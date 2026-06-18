


using DAL.Entity;
using Microsoft.AspNetCore.Identity;

namespace BLL.Service.Implementation
{
    public class BookingUpdateWorker : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;



        public BookingUpdateWorker(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }



        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
                    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();



                    // 1. جلب الحجوزات اللي حالتها Accepted وعدى عليها الوقت (مثلاً ساعة للتجربة)
                    var expiredBookings = await unitOfWork.Bookings.FindAsync(
 b => b.State == "Accepted" && b.CreatedAt.AddMinutes(60) < DateTime.UtcNow
 );



                    foreach (var booking in expiredBookings)
                    {
                        #region شرح اللوجيك الاكونت الموقوف
                        // 2. 🚨 التشيك السحري: هل السايح أو المرشد حسابهم موقوف (Banned)؟
                        // بنجيب بيانات الـ AppUser للسايح والمرشد
                        //var touristUser = await userManager.FindByIdAsync(booking.TouristId);
                        //var guideUser = await userManager.FindByIdAsync(booking.GuideId);



                        //bool isTouristBanned = touristUser?.LockoutEnd != null && touristUser.LockoutEnd > DateTimeOffset.UtcNow;
                        //bool isGuideBanned = guideUser?.LockoutEnd != null && guideUser.LockoutEnd > DateTimeOffset.UtcNow;



                        //if (isTouristBanned || isGuideBanned)
                        //{
                        //    // 🛑 حالة الحظر: نلغي الرحلة فوراً بدون حساب عمولة
                        //    booking.RejectBooking();
                        //    unitOfWork.Bookings.Update(booking);
                        //    // بنعمل Continue عشان نتخطى لوجيك الـ Completion والعمولة
                        //    continue;
                        //}
                        #endregion


                        // 3. ✅ الحالة الطبيعية: تحويل لـ Completed وحساب العمولات
                        booking.CompleteBooking();



                        // حساب عمولة الموقع (5%)
                        decimal commission = booking.TotalPrice * 0.05m;



                        // جلب المرشد لإضافة المديونية
                        var guide = await unitOfWork.TourGuides.GetByIdAsStringAsync(booking.GuideId);
                        if (guide != null)
                        {
                            guide.AddDebt(commission);
                            unitOfWork.TourGuides.Update(guide);
                        }



                        unitOfWork.Bookings.Update(booking);
                    }



                    if (expiredBookings.Any())
                    {
                        await unitOfWork.CompleteAsync();
                    }
                }



                // انتظار وقت معين (دقيقة مثلاً) قبل الدورة الجاية
                await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
            }
        }

    }
}
