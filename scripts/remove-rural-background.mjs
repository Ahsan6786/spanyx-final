import sharp from 'sharp';
import fs from 'node:fs';

async function makeTransparent() {
  const inputPng = 'public/partners/rural-immersion.png';
  const backupPng = 'public/partners/rural-immersion-orig.png';

  if (!fs.existsSync(backupPng)) {
    fs.copyFileSync(inputPng, backupPng);
    console.log('Backed up original rural-immersion.png');
  }

  const { data, info } = await sharp(backupPng)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const visited = new Uint8Array(width * height);
  const queue = [];

  // Seed flood fill from all perimeter pixels
  for (let x = 0; x < width; x++) {
    queue.push(x);
    queue.push((height - 1) * width + x);
    visited[x] = 1;
    visited[(height - 1) * width + x] = 1;
  }
  for (let y = 0; y < height; y++) {
    queue.push(y * width);
    queue.push(y * width + width - 1);
    visited[y * width] = 1;
    visited[y * width + width - 1] = 1;
  }

  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    const neighbors = [];
    if (cx > 0) neighbors.push(curr - 1);
    if (cx < width - 1) neighbors.push(curr + 1);
    if (cy > 0) neighbors.push(curr - width);
    if (cy < height - 1) neighbors.push(curr + width);

    for (const n of neighbors) {
      if (!visited[n]) {
        visited[n] = 1;
        const idx = n * 4;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        // If near white / background color (threshold 228)
        if (r >= 228 && g >= 228 && b >= 228) {
          queue.push(n);
        }
      }
    }
  }

  // Create alpha channel based on flood fill and antialiasing
  const outBuffer = Buffer.from(data);
  for (let i = 0; i < queue.length; i++) {
    const p = queue[i];
    const idx = p * 4;
    outBuffer[idx + 3] = 0; // Completely transparent
  }

  // Antialias boundary pixels
  for (let i = 0; i < queue.length; i++) {
    const p = queue[i];
    const cx = p % width;
    const cy = Math.floor(p / width);

    const neighbors = [p - 1, p + 1, p - width, p + width];
    for (const n of neighbors) {
      if (n >= 0 && n < width * height && outBuffer[n * 4 + 3] > 0) {
        const nIdx = n * 4;
        const r = outBuffer[nIdx];
        const g = outBuffer[nIdx + 1];
        const b = outBuffer[nIdx + 2];
        const brightness = (r + g + b) / 3;
        if (brightness > 210) {
          outBuffer[nIdx + 3] = Math.max(0, Math.min(255, Math.round((255 - brightness) * 4.5)));
        }
      }
    }
  }

  // Trim transparent bounding box so logo is nicely framed and maximized
  await sharp(outBuffer, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .trim()
    .png({ quality: 100, compressionLevel: 9 })
    .toFile('public/partners/rural-immersion.png');

  await sharp('public/partners/rural-immersion.png')
    .webp({ quality: 92, lossless: true })
    .toFile('public/partners/rural-immersion.webp');

  console.log('Successfully generated transparent rural-immersion.png and rural-immersion.webp!');
}

makeTransparent().catch(console.error);
