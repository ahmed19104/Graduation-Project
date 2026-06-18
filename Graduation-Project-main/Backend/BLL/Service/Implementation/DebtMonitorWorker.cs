using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Service.Implementation
{
    public class DebtMonitorWorker : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;



        public DebtMonitorWorker(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }



        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // اللوب ده هيفضل شغال طول ما السيرفر قايم
            while (!stoppingToken.IsCancellationRequested)
            {
                // بنعمل Scope عشان نقدر نستخدم الـ Scoped Services زي UnitOfWork و EmailService
                using (var scope = _serviceProvider.CreateScope())
                {
                    var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
                    var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();



                    // تحديد التاريخ اللي من 30 يوم فاتوا
                    var limitDate = DateTime.UtcNow.AddMinutes(-60);



                    // هنجيب المرشدين اللي شغالين، وعليهم فلوس، وتاريخ بداية المديونية عدى عليه 30 يوم
                    var overdueGuides = await unitOfWork.TourGuides.FindAsyncInclude(
 g => g.State == true && g.OutstandingBalance > 0 && g.DebtStartDate != null && g.DebtStartDate <= limitDate,
 g => g.User
 );



                    foreach (var guide in overdueGuides)
                    {
                        // 1. إيقاف الحساب باستخدام دالة البيزنس اللي عملناها
                        guide.SuspendForDebt();
                        unitOfWork.TourGuides.Update(guide);



                        // 2. إرسال إيميل تحذيري
                        string subject = "🚨 إيقاف مؤقت للحساب بسبب تأخر السداد";
                        string body = $@"
<h3 style='color:red;'>مرحباً {guide.User?.UserName ?? "يا كابتن"}،</h3>
<p>تم <b>إيقاف حسابك مؤقتاً</b> نظراً لعدم سداد مديونيتك البالغة <b>{guide.OutstandingBalance}</b> لمدة تتجاوز 30 يوماً.</p>
<p>يرجى سداد المديونية ليتم تفعيل حسابك تلقائياً والعودة لاستقبال الحجوزات.</p>";



                        if (!string.IsNullOrEmpty(guide.User?.Email))
                        {
                            try
                            {
                                await emailService.SendEmailAsync(guide.User.Email, subject, body);
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine(ex.Message);
                            }
                        }



                        // حفظ التعديلات في الداتا بيز لو تم إيقاف أي مرشد
                        if (overdueGuides.Any())
                        {
                            await unitOfWork.CompleteAsync();
                        }
                    }



                    // الـ Worker هينام 24 ساعة وبعدين يصحى يشيك تاني
                    await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
                }
            }
        }
    }
}
