import { createServer } from 'node:http';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('.');
const joomla = resolve(process.env.SMARTBROWSER_TEST_JOOMLA_ROOT || '../joomla');
const secondSite = process.env.SMARTBROWSER_TEST_SECOND_SITE_ROOT ? resolve(process.env.SMARTBROWSER_TEST_SECOND_SITE_ROOT) : null;
const server = createServer(async (request, response) => {
  try {
    const path = new URL(request.url, 'http://localhost').pathname;
    if (path === '/editor-forms.html') {
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.end(execFileSync('php', ['tests/fixtures/editor-forms.php'])); return;
    }
    if (path === '/selection-output-preview.html') {
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.end(execFileSync('php', ['tests/fixtures/selection-output-preview.php'])); return;
    }
    if (path === '/' || path === '/index.php') {
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.end(await readFile('tests/fixtures/picker-profiles.html', 'utf8')); return;
    }
    const prefix = path.startsWith('/joomla/') ? '/joomla/' : path.startsWith('/second-site/') ? '/second-site/' : '';
    const base = prefix === '/joomla/' ? joomla : prefix === '/second-site/' ? secondSite : root;
    if (!base) throw new Error('Fixture site root not configured');
    const target = resolve(base, '.' + (prefix ? '/' + path.slice(prefix.length) : path));
    if (!target.startsWith(base + sep)) throw new Error('Outside fixture roots');
    response.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' })[extname(target)] || 'application/octet-stream');
    response.end(await readFile(target));
  } catch { response.writeHead(404); response.end(); }
});
server.listen(8791, '127.0.0.1', () => console.log('Picker fixture: http://127.0.0.1:8791'));
