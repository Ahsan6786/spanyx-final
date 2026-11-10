import http from 'http';
import fs from 'fs';
import path from 'path';

function requestUrl(urlPath, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 9001,
        path: urlPath,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          ...headers,
        },
      },
      (res) => {
        let size = 0;
        const chunks = [];
        res.on('data', (chunk) => {
          size += chunk.length;
          chunks.push(chunk);
        });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            size,
            body: Buffer.concat(chunks),
          });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runAudit() {
  console.log('--- STARTING NETWORK & CACHE AUDIT ---\n');

  // 1. Audit Landing Page HTML
  const pageRes = await requestUrl('/');
  console.log(`[PAGE] / -> Status: ${pageRes.statusCode}, Size: ${(pageRes.size / 1024).toFixed(1)} KB`);
  console.log(`[PAGE HEADERS] Content-Type: ${pageRes.headers['content-type']}`);
  console.log(`[PAGE HEADERS] Cache-Control: ${pageRes.headers['cache-control'] || 'none'}`);

  // Check HTML for preload tags
  const html = pageRes.body.toString('utf-8');
  const preloads = html.match(/<link[^>]*rel="preload"[^>]*>/g) || [];
  console.log('\n[HTML PRELOAD TAGS FOUND]:');
  preloads.forEach((p) => console.log('  ' + p));

  // Check HTML for Hero pictures
  const heroMockupMatch = html.includes('mockup-long-wrap');
  console.log(`\n[HERO MOCKUP IN HTML]: ${heroMockupMatch ? 'Present' : 'Missing'}`);

  // 2. Audit Critical & Background Assets
  const assetsToAudit = [
    '/span/logo.webp',
    '/span/long1.webp',
    '/span/short-clean.webp',
    '/cards.webp',
    '/carddd.webp',
    '/partners/trademax.webp',
    '/partners/partner-logo-1.webp',
    '/partners/rural-immersion.webp',
    '/industries/real-estate.svg',
    '/team/shiv-sutar.webp',
    '/team/poonam-bhosale.webp',
    '/team/ahsan-imam-khan.webp',
  ];

  console.log('\n--- ASSET AUDIT (First Fetch vs Revalidation) ---');
  let totalPreloadedBytes = 0;

  for (const assetPath of assetsToAudit) {
    const t0 = performance.now();
    const res1 = await requestUrl(assetPath);
    const duration1 = (performance.now() - t0).toFixed(1);
    totalPreloadedBytes += res1.size;

    const etag = res1.headers['etag'];
    const cacheControl = res1.headers['cache-control'] || 'NONE';

    // Simulate revalidation with If-None-Match
    let revalStatus = 'N/A';
    if (etag) {
      const res2 = await requestUrl(assetPath, { 'If-None-Match': etag });
      revalStatus = String(res2.statusCode);
    }

    console.log(
      `[ASSET] ${assetPath.padEnd(32)} | Status: ${res1.statusCode} | Size: ${(res1.size / 1024).toFixed(1).padStart(5)} KB | Time: ${duration1.padStart(5)}ms | Cache-Control: ${cacheControl} | 304 Reval: ${revalStatus}`
    );
  }

  console.log(`\n[TOTAL AUDITED ASSETS SIZE]: ${(totalPreloadedBytes / 1024).toFixed(1)} KB`);
  console.log('\n--- AUDIT COMPLETE ---');
}

runAudit().catch(console.error);
