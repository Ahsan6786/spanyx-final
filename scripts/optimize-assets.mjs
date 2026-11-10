import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function optimizeImages() {
  console.log('Optimizing images...');

  // 1. Partner Logos
  const partners = [
    { input: 'public/partners/trademax.png', base: 'public/partners/trademax', maxW: 480 },
    { input: 'public/partners/partner-logo-1.png', base: 'public/partners/partner-logo-1', maxW: 480 },
    { input: 'public/partners/rural-immersion.png', base: 'public/partners/rural-immersion', maxW: 480 },
  ];

  for (const p of partners) {
    if (fs.existsSync(p.input)) {
      console.log(`Optimizing ${p.input}...`);
      await sharp(p.input)
        .resize({ width: p.maxW, withoutEnlargement: true })
        .webp({ quality: 88, effort: 6 })
        .toFile(`${p.base}.webp`);

      await sharp(p.input)
        .resize({ width: p.maxW, withoutEnlargement: true })
        .png({ compressionLevel: 9, quality: 90 })
        .toFile(`${p.base}-opt.png`);

      fs.copyFileSync(`${p.base}-opt.png`, `${p.base}.png`);
      fs.unlinkSync(`${p.base}-opt.png`);
    }
  }

  // Partner logoo.jpg
  if (fs.existsSync('public/partners/logoo.jpg')) {
    await sharp('public/partners/logoo.jpg')
      .resize({ width: 480, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile('public/partners/logoo.webp');
  }

  // 2. Brand Logo
  if (fs.existsSync('public/span/logo.png')) {
    console.log('Optimizing brand logo...');
    await sharp('public/span/logo.png')
      .resize({ width: 640, withoutEnlargement: true })
      .webp({ quality: 90, effort: 6 })
      .toFile('public/span/logo.webp');
  }

  // 3. Team Photos
  const teamPhotos = ['shiv-sutar', 'poonam-bhosale', 'ahsan-imam-khan'];
  for (const name of teamPhotos) {
    const src = `public/team/${name}.jpg`;
    if (fs.existsSync(src)) {
      console.log(`Optimizing team photo ${name}...`);
      await sharp(src)
        .resize({ width: 640, withoutEnlargement: true })
        .webp({ quality: 86, effort: 6 })
        .toFile(`public/team/${name}.webp`);
    }
  }

  // 4. carddd.png -> carddd.webp
  if (fs.existsSync('public/carddd.png')) {
    console.log('Optimizing carddd.png...');
    await sharp('public/carddd.png')
      .webp({ quality: 85, effort: 6 })
      .toFile('public/carddd.webp');
  }

  console.log('Image optimization complete!');
}

optimizeImages().catch(console.error);
