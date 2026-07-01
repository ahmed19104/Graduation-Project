import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { marked } from 'marked';
import { chromium } from 'playwright';
import PptxGenJS from 'pptxgenjs';
import { existsSync } from 'fs';

const ROOT = 'E:\\G-P-main (1)\\G-P-main';
const OUTPUT = `${ROOT}\\output`;

async function ensureDir() {
  if (!existsSync(OUTPUT)) await mkdir(OUTPUT, { recursive: true });
}

// ── 1. Markdown → DOCX ──
async function createDocx(mdPath, outPath) {
  const md = await readFile(mdPath, 'utf-8');
  const lines = md.split('\n');
  const children = [];

  for (const line of lines) {
    if (line.startsWith('# '))
      children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 }, children: [new TextRun({ text: line.replace(/^#\s*/, ''), bold: true, size: 52 }) ] }));
    else if (line.startsWith('## '))
      children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 }, children: [new TextRun({ text: line.replace(/^##\s*/, ''), bold: true, size: 40 }) ] }));
    else if (line.startsWith('### '))
      children.push(new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 250, after: 120 }, children: [new TextRun({ text: line.replace(/^###\s*/, ''), bold: true, size: 32 }) ] }));
    else if (line.startsWith('- '))
      children.push(new Paragraph({ spacing: { after: 60 }, indent: { left: 400 }, children: [new TextRun({ text: `• ${line.slice(2)}`, size: 24 }) ] }));
    else if (line.match(/^\d+\. /))
      children.push(new Paragraph({ spacing: { after: 60 }, indent: { left: 400 }, children: [new TextRun({ text: line, size: 24 }) ] }));
    else if (line.trim())
      children.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: line, size: 24 }) ] }));
    else
      children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
  }

  const doc = new Document({
    title: 'Ather - Egyptian Tourism Platform',
    sections: [{ children }],
  });
  const buffer = await Packer.toBuffer(doc);
  await writeFile(outPath, buffer);
  console.log(`✅ DOCX created: ${outPath}`);
}

// ── 2. Markdown → PDF ──
async function createPdf(mdPath, outPath) {
  const md = await readFile(mdPath, 'utf-8');
  const html = await marked.parse(md);
  const fullHtml = `<!DOCTYPE html><html><head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #1a1a1a; max-width: 900px; margin: 40px auto; padding: 20px; }
      h1 { font-size: 28pt; color: #0e7490; border-bottom: 2px solid #0e7490; padding-bottom: 8px; }
      h2 { font-size: 20pt; color: #155e75; margin-top: 30px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
      h3 { font-size: 16pt; color: #1e293b; margin-top: 20px; }
      table { border-collapse: collapse; width: 100%; margin: 15px 0; }
      th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
      th { background: #0e7490; color: white; }
      tr:nth-child(even) { background: #f8fafc; }
      code { background: #f1f5f9; padding: 2px 6px; border-radius: 3px; font-size: 10pt; }
      pre { background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 5px; overflow-x: auto; }
      pre code { background: none; color: inherit; padding: 0; }
      blockquote { border-left: 4px solid #0e7490; margin: 15px 0; padding: 10px 20px; background: #f0f9ff; }
      hr { border: none; border-top: 1px solid #ccc; margin: 25px 0; }
      ul, ol { padding-left: 25px; }
      li { margin: 4px 0; }
      a { color: #0e7490; }
      @media print { body { margin: 0; } }
    </style>
  </head><body>${html}</body></html>`;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'networkidle' });
  await page.pdf({ path: outPath, format: 'A4', margin: { top: '25mm', bottom: '25mm', left: '20mm', right: '20mm' }, printBackground: true, displayHeaderFooter: true, footerTemplate: '<div style="font-size:9px;text-align:center;width:100%;color:#999;"><span class="pageNumber"></span></div>' });
  await browser.close();
  console.log(`✅ PDF created: ${outPath}`);
}

// ── 3. Markdown → PPTX ──
async function createPptx(mdPath, outPath) {
  const md = await readFile(mdPath, 'utf-8');
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });
  pptx.layout = 'WIDE';

  const BRAND = '0E7490';
  const DARK = '1E293B';
  const GOLD = 'B8860B';
  const LIGHT_BG = 'F8FAFC';

  // Parse slides: split by --- but handle frontmatter
  const rawSlides = md.split('\n---\n');
  const slides = [];

  for (const raw of rawSlides) {
    const lines = raw.trim().split('\n').filter(l => !l.startsWith('marp:') && !l.startsWith('theme:') && !l.startsWith('class:') && !l.startsWith('paginate:') && !l.startsWith('<!--'));
    // Remove empty frontmatter lines (just `---` artifacts)
    const clean = lines.filter(l => l.trim() !== '' && !l.startsWith('---'));
    if (clean.length === 0) continue;

    const titleLine = clean.find(l => l.startsWith('# '));
    const title = titleLine ? titleLine.replace(/^#\s*/, '').replace(/<!--fit-->\s*/g, '').trim() : '';
    const subtitleLine = clean.find(l => l.startsWith('## '));
    const subtitle = subtitleLine ? subtitleLine.replace(/^##\s*/, '').trim() : '';

    // Get content lines (everything except title lines and frontmatter)
    const contentLines = clean.filter(l => !l.startsWith('# ') && !l.startsWith('## '));
    slides.push({ title, subtitle, contentLines });
  }

  if (slides.length === 0) {
    console.log('❌ No slides parsed!');
    return;
  }

  let slideIdx = 0;

  for (const slide of slides) {
    const s = pptx.addSlide();
    slideIdx++;

    const isFirst = slideIdx === 1;
    const isLast = slideIdx === slides.length;

    if (isFirst) {
      // Title slide
      s.background = { fill: BRAND };
      s.addText(slide.title, {
        x: 0.5, y: 2.0, w: 12.33, h: 1.5,
        fontSize: 48, color: 'FFFFFF', bold: true, fontFace: 'Arial', align: 'center'
      });
      if (slide.subtitle) {
        s.addText(slide.subtitle, {
          x: 0.5, y: 3.5, w: 12.33, h: 0.8,
          fontSize: 24, color: 'FFFFFF', fontFace: 'Arial', align: 'center', transparency: 20
        });
      }
      if (slide.contentLines.length > 0) {
        s.addText(slide.contentLines.join('\n'), {
          x: 0.5, y: 4.5, w: 12.33, h: 2.5,
          fontSize: 18, color: 'FFFFFF', fontFace: 'Arial', align: 'center', transparency: 15, lineSpacingMultiple: 1.5
        });
      }
    } else if (isLast) {
      // Closing slide
      s.background = { fill: BRAND };
      s.addText('Thank You', {
        x: 0.5, y: 2.0, w: 12.33, h: 1.2,
        fontSize: 44, color: 'FFFFFF', bold: true, fontFace: 'Arial', align: 'center'
      });
      if (slide.subtitle) {
        s.addText(slide.subtitle, {
          x: 0.5, y: 3.3, w: 12.33, h: 0.8,
          fontSize: 22, color: 'FFFFFF', fontFace: 'Arial', align: 'center', transparency: 20
        });
      }
      if (slide.contentLines.length > 0) {
        s.addText(slide.contentLines.join('\n'), {
          x: 0.5, y: 4.2, w: 12.33, h: 2.5,
          fontSize: 18, color: 'FFFFFF', fontFace: 'Arial', align: 'center', transparency: 15, lineSpacingMultiple: 1.4
        });
      }
    } else {
      // Content slide
      s.background = { fill: 'FFFFFF' };
      // Top bar
      s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 1.1, fill: { color: BRAND } });
      s.addText(slide.title, {
        x: 0.5, y: 0.1, w: 12.33, h: 0.9,
        fontSize: 28, color: 'FFFFFF', bold: true, fontFace: 'Arial'
      });
      // Gold accent line
      s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 2, h: 0.05, fill: { color: GOLD } });

      // Process content
      const textLines = slide.contentLines;
      const yStart = 1.5;
      let y = yStart;

      // Group content: bullet lists, tables, code blocks
      let i = 0;
      while (i < textLines.length) {
        const line = textLines[i];
        const nextLine = i < textLines.length - 1 ? textLines[i + 1] : '';

        if (line.startsWith('| ')) {
          // Build table
          const rows = [];
          while (i < textLines.length && textLines[i].startsWith('|')) {
            rows.push(textLines[i].split('|').filter(c => c.trim()).map(c => c.trim()));
            i++;
          }
          // Skip separator rows
          const dataRows = rows.filter(r => !r[0]?.includes('---'));
          if (dataRows.length > 0) {
            const isSmall = dataRows.length > 3;
            const colCount = dataRows[0].length;
            const colW = (12.33 - 1) / colCount;
            const rowH = isSmall ? 0.35 : 0.4;

            dataRows.forEach((row, ri) => {
              const isHeader = ri === 0;
              row.forEach((cell, ci) => {
                s.addShape(pptx.ShapeType.rect, {
                  x: 0.5 + ci * colW, y: y + ri * rowH, w: colW, h: rowH,
                  fill: { color: isHeader ? BRAND : (ri % 2 === 0 ? LIGHT_BG : 'FFFFFF') },
                  line: { color: 'D1D5DB', width: 0.5 }
                });
                s.addText(cell, {
                  x: 0.55 + ci * colW, y: y + ri * rowH + 0.05, w: colW - 0.1, h: rowH - 0.1,
                  fontSize: isHeader ? 12 : 11, color: isHeader ? 'FFFFFF' : DARK, fontFace: 'Arial',
                  bold: isHeader, valign: 'middle'
                });
              });
            });
            y += dataRows.length * rowH + 0.2;
          }
        } else if (line.startsWith('```')) {
          // Code block
          let code = '';
          i++;
          while (i < textLines.length && !textLines[i].startsWith('```')) {
            code += textLines[i] + '\n';
            i++;
          }
          if (code) {
            const linesCount = code.split('\n').length;
            const blockH = Math.min(3.5, Math.max(0.8, linesCount * 0.22));
            s.addShape(pptx.ShapeType.roundRect, {
              x: 0.5, y, w: 12.33, h: blockH,
              fill: { color: '1E293B' }, rectRadius: 0.08
            });
            s.addText(code.trim(), {
              x: 0.7, y: y + 0.1, w: 11.93, h: blockH - 0.2,
              fontSize: 12, color: 'E2E8F0', fontFace: 'Consolas', valign: 'top', lineSpacingMultiple: 1.1
            });
            y += blockH + 0.2;
          }
          i++;
        } else if (line.startsWith('- ')) {
          // Bullet list - collect consecutive bullets
          let bullets = [];
          while (i < textLines.length && textLines[i].startsWith('- ')) {
            bullets.push(`• ${textLines[i].slice(2)}`);
            i++;
          }
          if (bullets.length > 0) {
            const fs = bullets.length > 8 ? 14 : 16;
            const lineH = fs / 72 * 1.5 + 0.05;
            const blockH = Math.min(5, bullets.length * lineH);
            s.addText(bullets.join('\n'), {
              x: 0.6, y, w: 12.2, h: blockH,
              fontSize: fs, color: DARK, fontFace: 'Arial',
              valign: 'top', lineSpacingMultiple: 1.5, paraSpaceAfter: 4
            });
            y += blockH + 0.1;
          }
        } else if (line.startsWith('**') && line.endsWith('**')) {
          // Bold section header
          s.addText(line.replace(/\*\*/g, ''), {
            x: 0.6, y, w: 12.2, h: 0.4,
            fontSize: 18, color: GOLD, bold: true, fontFace: 'Arial'
          });
          y += 0.45;
          i++;
        } else if (line.trim() && !line.includes('|') && !line.startsWith('>')) {
          // Regular text - treat as a content block
          s.addText(line, {
            x: 0.6, y, w: 12.2, h: 0.5,
            fontSize: 16, color: DARK, fontFace: 'Arial'
          });
          y += 0.5;
          i++;
        } else {
          i++;
        }
      }
    }
  }

  await pptx.writeFile({ fileName: outPath });
  console.log(`✅ PPTX created: ${outPath} (${slides.length} slides)`);
}

// ── Main ──
async function main() {
  await ensureDir();
  await createDocx(`${ROOT}\\README.md`, `${OUTPUT}\\README.docx`);
  await createPdf(`${ROOT}\\DOCUMENTATION.md`, `${OUTPUT}\\DOCUMENTATION.pdf`);
  await createPptx(`${ROOT}\\PRESENTATION.md`, `${OUTPUT}\\PRESENTATION.pptx`);
  console.log('\n🎉 All conversions complete!');
}

main().catch(console.error);
