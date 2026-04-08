import { cp, mkdir, readdir, readFile, rm, writeFile, stat, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const sourceDir = path.resolve(root, '..', 'mobile_ionic', 'www');
const distDir = path.resolve(root, 'dist');
const sourceApiUrl = process.env.PLANB_SOURCE_API_URL ?? 'https://adminweb-production-d7b5.up.railway.app';
const targetApiUrl = process.env.PLANB_API_BASE_URL ?? sourceApiUrl;

const replaceExtensions = new Set(['.html', '.js', '.css', '.json', '.txt', '.map']);

// Remove macOS duplicate files (files containing " 2", " 3" etc. in the name)
async function removeDuplicateFiles(currentPath) {
  const entries = await readdir(currentPath, { withFileTypes: true });
  let removed = 0;

  for (const entry of entries) {
    const fullPath = path.join(currentPath, entry.name);
    if (entry.isDirectory()) {
      // Remove entire duplicate directories (e.g. "assets 3")
      if (/\s\d+$/.test(entry.name)) {
        await rm(fullPath, { recursive: true, force: true });
        removed++;
        continue;
      }
      removed += await removeDuplicateFiles(fullPath);
      continue;
    }
    // Remove files like "chunk-ABC 2.js", "_headers 2"
    if (/\s\d+(\.\w+)?$/.test(entry.name)) {
      await unlink(fullPath);
      removed++;
    }
  }
  return removed;
}

async function replaceInDist(currentPath) {
  const entries = await readdir(currentPath, { withFileTypes: true });
  let filesChanged = 0;

  for (const entry of entries) {
    const fullPath = path.join(currentPath, entry.name);
    if (entry.isDirectory()) {
      filesChanged += await replaceInDist(fullPath);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!replaceExtensions.has(ext)) {
      continue;
    }

    const content = await readFile(fullPath, 'utf8');
    if (!content.includes(sourceApiUrl)) {
      continue;
    }

    const updated = content.split(sourceApiUrl).join(targetApiUrl);
    await writeFile(fullPath, updated, 'utf8');
    filesChanged += 1;
  }

  return filesChanged;
}

// Patch index.html with proper meta tags for PWA / SEO
async function patchIndexHtml() {
  const indexPath = path.join(distDir, 'index.html');
  let html = await readFile(indexPath, 'utf8');

  // Update title
  html = html.replace(/<title>Ionic App<\/title>/, '<title>RinoMed 2026</title>');

  // Add meta description and theme-color if missing
  if (!html.includes('name="description"')) {
    html = html.replace(
      '</head>',
      '  <meta name="description" content="RinoMed 2026 — Gestión médica de rinología">\n  <meta name="theme-color" content="#c07ab8">\n</head>'
    );
  }

  await writeFile(indexPath, html, 'utf8');
}

async function main() {
  if (!existsSync(sourceDir)) {
    throw new Error(`Source build not found: ${sourceDir}. Run mobile build first.`);
  }

  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });
  await cp(sourceDir, distDir, { recursive: true });

  // Copy public/ static files (privacy.html, etc.) to dist/
  const publicDir = path.resolve(root, 'public');
  if (existsSync(publicDir)) {
    await cp(publicDir, distDir, { recursive: true });
    console.log('Copied public/ static files to dist/');
  }

  // Clean up duplicate files before writing anything
  const duplicatesRemoved = await removeDuplicateFiles(distDir);
  if (duplicatesRemoved > 0) {
    console.log(`Cleaned ${duplicatesRemoved} duplicate file(s)/folder(s)`);
  }

  const redirects = '/privacy.html /privacy.html 200\n/* /index.html 200\n';
  const headers = [
    '/index.html',
    '  Cache-Control: no-cache, no-store, must-revalidate',
    '  X-Frame-Options: DENY',
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '',
    '/assets/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '',
    '/*.js',
    '  Cache-Control: public, max-age=31536000, immutable',
    '',
    '/*.css',
    '  Cache-Control: public, max-age=31536000, immutable',
    ''
  ].join('\n');

  await writeFile(path.join(distDir, '_redirects'), redirects, 'utf8');
  await writeFile(path.join(distDir, '_headers'), headers, 'utf8');

  // Patch index.html meta tags
  await patchIndexHtml();

  const filesChanged = await replaceInDist(distDir);
  if (targetApiUrl !== sourceApiUrl) {
    console.log(`API override applied: ${sourceApiUrl} -> ${targetApiUrl} (files changed: ${filesChanged})`);
  }

  // Print summary
  const allFiles = await readdir(distDir, { recursive: true });
  const totalSize = allFiles.length;
  console.log(`Plan B dist ready at ${distDir} (${totalSize} files)`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
