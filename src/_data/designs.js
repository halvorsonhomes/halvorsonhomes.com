const Image = require('@11ty/eleventy-img');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const IMG_EXTS   = /\.(jpg|jpeg|png|webp)$/i;
const ELEVATION  = /^elevation\./i;
const FLOOR_PLAN = /^floor[_-]plan\./i;

async function processImg(inputPath, outputDir, urlPath) {
  const meta = await Image(inputPath, {
    widths: [800, 1600],
    formats: ['webp', 'jpeg'],
    outputDir,
    urlPath,
  });
  const webp = meta.webp;
  const jpeg = meta.jpeg;
  return {
    srcset:   webp.map(e => `${e.url} ${e.width}w`).join(', '),
    src:      webp[webp.length - 1].url,
    fallback: jpeg[jpeg.length - 1].url,
    thumb:    webp[0].url,
  };
}

module.exports = async function() {
  const designsDir = path.join(__dirname, '../_designs');
  const imagesBase = path.join(__dirname, '../images/designs');
  const outputDir  = path.resolve(__dirname, '../../_site/images/opt');
  const urlPath    = '/images/opt/';

  if (!fs.existsSync(designsDir)) return [];

  const rawDesigns = fs.readdirSync(designsDir)
    .filter(f => /\.(yaml|yml)$/.test(f))
    .map(f => yaml.load(fs.readFileSync(path.join(designsDir, f), 'utf8')));

  for (const design of rawDesigns) {
    const imgDir = path.join(imagesBase, design.slug);
    if (!fs.existsSync(imgDir)) continue;

    const files = fs.readdirSync(imgDir).filter(f => IMG_EXTS.test(f));

    // Build carousel slides: elevation first, then gallery photos (alpha sorted)
    const slides = [];

    const elevFile = files.find(f => ELEVATION.test(f));
    if (elevFile) {
      try {
        const opt = await processImg(path.join(imgDir, elevFile), outputDir, urlPath);
        slides.push({ ...opt, label: 'Elevation' });
        design.image = opt.thumb; // update card thumbnail to optimised version
      } catch {
        slides.push({ src: design.image, fallback: design.image, srcset: '', thumb: design.image, label: 'Elevation' });
      }
    }

    const photos = files.filter(f => !ELEVATION.test(f) && !FLOOR_PLAN.test(f)).sort();
    for (const file of photos) {
      try {
        slides.push(await processImg(path.join(imgDir, file), outputDir, urlPath));
      } catch {
        const url = `/images/designs/${design.slug}/${file}`;
        slides.push({ src: url, fallback: url, srcset: '', thumb: url });
      }
    }

    if (slides.length) design.slides = slides;

    // Floor plan
    const fpFile = files.find(f => FLOOR_PLAN.test(f));
    if (fpFile) {
      try {
        const opt = await processImg(path.join(imgDir, fpFile), outputDir, urlPath);
        design.floor_plan_opt = opt.src;
      } catch {}
    }
  }

  return rawDesigns.sort((a, b) => a.name.localeCompare(b.name));
};
