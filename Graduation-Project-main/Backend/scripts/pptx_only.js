import { readFile } from 'fs/promises';
import PptxGenJS from 'pptxgenjs';

const ROOT = 'E:\\G-P-main (1)\\G-P-main';
const OUTPUT = `${ROOT}\\output`;

async function main() {
  const md = await readFile(`${ROOT}\\PRESENTATION.md`, 'utf-8');
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });
  pptx.layout = 'WIDE';

  const BRAND = '0E7490';
  const DARK = '1E293B';
  const GOLD = 'B8860B';
  const LIGHT_BG = 'F8FAFC';

  const rawSlides = md.split('\n---\n');
  const slides = [];

  for (const raw of rawSlides) {
    const lines = raw.trim().split('\n').filter(l => !l.startsWith('marp:') && !l.startsWith('theme:') && !l.startsWith('class:') && !l.startsWith('paginate:') && !l.startsWith('<!--'));
    const clean = lines.filter(l => l.trim() !== '' && !l.startsWith('---'));
    if (clean.length === 0) continue;

    const title = clean.find(l => l.startsWith('# '))?.replace(/^#\s*/, '').replace(/<!--fit-->\s*/g, '').trim() || '';
    const subtitle = clean.find(l => l.startsWith('## '))?.replace(/^##\s*/, '').trim() || '';
    const contentLines = clean.filter(l => !l.startsWith('# ') && !l.startsWith('## '));
    slides.push({ title, subtitle, contentLines });
  }

  if (slides.length === 0) { console.error('No slides!'); return; }

  slides.forEach((slide, idx) => {
    const s = pptx.addSlide();
    const isFirst = idx === 0;
    const isLast = idx === slides.length - 1;

    if (isFirst) {
      s.background = { fill: BRAND };
      s.addText(slide.title, { x: 0.5, y: 2.0, w: 12.33, h: 1.5, fontSize: 48, color: 'FFFFFF', bold: true, fontFace: 'Arial', align: 'center' });
      if (slide.subtitle) s.addText(slide.subtitle, { x: 0.5, y: 3.5, w: 12.33, h: 0.8, fontSize: 24, color: 'FFFFFF', fontFace: 'Arial', align: 'center', transparency: 20 });
      if (slide.contentLines.length > 0) s.addText(slide.contentLines.join('\n'), { x: 0.5, y: 4.5, w: 12.33, h: 2.5, fontSize: 18, color: 'FFFFFF', fontFace: 'Arial', align: 'center', transparency: 15, lineSpacingMultiple: 1.5 });
    } else if (isLast) {
      s.background = { fill: BRAND };
      s.addText('Thank You', { x: 0.5, y: 2.0, w: 12.33, h: 1.2, fontSize: 44, color: 'FFFFFF', bold: true, fontFace: 'Arial', align: 'center' });
      if (slide.subtitle) s.addText(slide.subtitle, { x: 0.5, y: 3.3, w: 12.33, h: 0.8, fontSize: 22, color: 'FFFFFF', fontFace: 'Arial', align: 'center', transparency: 20 });
      if (slide.contentLines.length > 0) s.addText(slide.contentLines.join('\n'), { x: 0.5, y: 4.2, w: 12.33, h: 2.5, fontSize: 18, color: 'FFFFFF', fontFace: 'Arial', align: 'center', transparency: 15, lineSpacingMultiple: 1.4 });
    } else {
      s.background = { fill: 'FFFFFF' };
      s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 1.1, fill: { color: BRAND } });
      s.addText(slide.title, { x: 0.5, y: 0.1, w: 12.33, h: 0.9, fontSize: 28, color: 'FFFFFF', bold: true, fontFace: 'Arial' });
      s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 2, h: 0.05, fill: { color: GOLD } });

      const textLines = slide.contentLines;
      let y = 1.5;
      let i = 0;

      while (i < textLines.length) {
        const line = textLines[i];

        if (line.startsWith('| ')) {
          const rows = [];
          while (i < textLines.length && textLines[i].startsWith('|')) {
            rows.push(textLines[i].split('|').filter(c => c.trim()).map(c => c.trim()));
            i++;
          }
          const dataRows = rows.filter(r => !r[0]?.includes('---'));
          if (dataRows.length > 0) {
            const isSmall = dataRows.length > 3;
            const colCount = dataRows[0].length;
            const colW = (12.33 - 1) / colCount;
            const rowH = isSmall ? 0.35 : 0.4;
            dataRows.forEach((row, ri) => {
              const isHeader = ri === 0;
              row.forEach((cell, ci) => {
                s.addShape(pptx.ShapeType.rect, { x: 0.5 + ci * colW, y: y + ri * rowH, w: colW, h: rowH, fill: { color: isHeader ? BRAND : (ri % 2 === 0 ? LIGHT_BG : 'FFFFFF') }, line: { color: 'D1D5DB', width: 0.5 } });
                s.addText(cell, { x: 0.55 + ci * colW, y: y + ri * rowH + 0.05, w: colW - 0.1, h: rowH - 0.1, fontSize: isHeader ? 12 : 11, color: isHeader ? 'FFFFFF' : DARK, fontFace: 'Arial', bold: isHeader, valign: 'middle' });
              });
            });
            y += dataRows.length * rowH + 0.2;
          }
        } else if (line.startsWith('```')) {
          let code = '';
          i++;
          while (i < textLines.length && !textLines[i].startsWith('```')) { code += textLines[i] + '\n'; i++; }
          if (code) {
            const linesCount = code.split('\n').length;
            const blockH = Math.min(3.5, Math.max(0.8, linesCount * 0.22));
            s.addShape(pptx.ShapeType.roundRect, { x: 0.5, y, w: 12.33, h: blockH, fill: { color: '1E293B' }, rectRadius: 0.08 });
            s.addText(code.trim(), { x: 0.7, y: y + 0.1, w: 11.93, h: blockH - 0.2, fontSize: 12, color: 'E2E8F0', fontFace: 'Consolas', valign: 'top', lineSpacingMultiple: 1.1 });
            y += blockH + 0.2;
          }
          i++;
        } else if (line.startsWith('- ')) {
          let bullets = [];
          while (i < textLines.length && textLines[i].startsWith('- ')) { bullets.push(`• ${textLines[i].slice(2)}`); i++; }
          if (bullets.length > 0) {
            const fs = bullets.length > 8 ? 14 : 16;
            const lineH = fs / 72 * 1.5 + 0.05;
            const blockH = Math.min(5, bullets.length * lineH);
            s.addText(bullets.join('\n'), { x: 0.6, y, w: 12.2, h: blockH, fontSize: fs, color: DARK, fontFace: 'Arial', valign: 'top', lineSpacingMultiple: 1.5, paraSpaceAfter: 4 });
            y += blockH + 0.1;
          }
        } else if (line.startsWith('**') && line.endsWith('**')) {
          s.addText(line.replace(/\*\*/g, ''), { x: 0.6, y, w: 12.2, h: 0.4, fontSize: 18, color: GOLD, bold: true, fontFace: 'Arial' });
          y += 0.45;
          i++;
        } else if (line.trim()) {
          s.addText(line, { x: 0.6, y, w: 12.2, h: 0.5, fontSize: 16, color: DARK, fontFace: 'Arial' });
          y += 0.5;
          i++;
        } else { i++; }
      }
    }
  });

  const tempDir = 'C:\\Users\\Compu City\\AppData\\Local\\Temp\\opencode\\ather_output';
  const { existsSync } = await import('fs');
  const { mkdir } = await import('fs/promises');
  if (!existsSync(tempDir)) await mkdir(tempDir, { recursive: true });
  const outFile = `${tempDir}\\Ather_Presentation.pptx`;
  await pptx.writeFile({ fileName: outFile });
  console.log(`✅ PPTX created: ${outFile} (${slides.length} slides)`);
}

main().catch(console.error);
