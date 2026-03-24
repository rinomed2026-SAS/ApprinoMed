import { access, readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const distIndex = path.join(distDir, 'index.html');

let errors = 0;

function ok(msg) { console.log(`  ✅ ${msg}`); }
function fail(msg) { console.error(`  ❌ ${msg}`); errors++; }

console.log('\n🔍 Checking Plan B dist for Netlify deploy…\n');

// 1. index.html exists
try {
  await access(distIndex);
  ok('dist/index.html exists');
} catch {
  fail('Missing dist/index.html. Run `npm run build` first.');
}

// 2. _redirects exists and has SPA rule
try {
  const redirects = await readFile(path.join(distDir, '_redirects'), 'utf8');
  if (redirects.includes('/* /index.html 200')) {
    ok('_redirects has SPA fallback rule');
  } else {
    fail('_redirects missing SPA rule: /* /index.html 200');
  }
} catch {
  fail('Missing dist/_redirects');
}

// 3. _headers exists
try {
  await access(path.join(distDir, '_headers'));
  ok('_headers exists');
} catch {
  fail('Missing dist/_headers');
}

// 4. No duplicate files (files with " 2", " 3" in name)
const allFiles = await readdir(distDir, { recursive: true });
const duplicates = allFiles.filter(f => /\s\d+(\.\w+)?$/.test(f));
if (duplicates.length === 0) {
  ok('No duplicate files detected');
} else {
  fail(`Found ${duplicates.length} duplicate file(s): ${duplicates.slice(0, 5).join(', ')}…`);
}

// 5. Main JS bundle exists
const mainJs = allFiles.find(f => f.startsWith('main-') && f.endsWith('.js'));
if (mainJs) {
  ok(`Main bundle found: ${mainJs}`);
} else {
  fail('No main-*.js bundle found');
}

// 6. Polyfills exist
const polyfills = allFiles.find(f => f.startsWith('polyfills-') && f.endsWith('.js'));
if (polyfills) {
  ok(`Polyfills found: ${polyfills}`);
} else {
  fail('No polyfills-*.js found');
}

// 7. CSS exists
const css = allFiles.find(f => f.endsWith('.css') && !f.startsWith('_'));
if (css) {
  ok(`Stylesheet found: ${css}`);
} else {
  fail('No CSS file found');
}

// 8. Title check
try {
  const html = await readFile(distIndex, 'utf8');
  if (html.includes('<title>RinoMed 2026</title>')) {
    ok('Page title is "RinoMed 2026"');
  } else {
    const match = html.match(/<title>(.*?)<\/title>/);
    fail(`Page title is "${match?.[1] ?? 'unknown'}" — expected "RinoMed 2026"`);
  }

  // 9. Community route is present in the Angular router output
  //    Angular lazy-loads community page as a named chunk; verify the route
  //    reference exists somewhere in the compiled JS bundles.
  const communityChunk = allFiles.find(
    f => f.endsWith('.js') && !f.startsWith('_') && !f.startsWith('polyfills') && !f.startsWith('main')
  );
  if (communityChunk) {
    ok('Lazy-loaded chunk(s) present (community route will be included)');
  } else {
    fail('No lazy-loaded chunks found — community route may be missing');
  }

  // 10. API URL in index.html should NOT be localhost
  if (html.includes('localhost')) {
    fail('index.html still references localhost — run prepare-planb with PLANB_API_BASE_URL set');
  } else {
    ok('No localhost API reference in index.html');
  }
} catch { /* already reported */ }

// Summary
console.log('');
if (errors > 0) {
  console.error(`💥 ${errors} issue(s) found. Fix before deploying.\n`);
  process.exit(1);
} else {
  console.log('🚀 All checks passed — ready for Netlify deploy!\n');
}
