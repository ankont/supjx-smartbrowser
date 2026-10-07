import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('.');
const joomla = resolve(process.env.SMARTBROWSER_TEST_JOOMLA_ROOT || '../joomla');
const server = createServer(async (request, response) => {
  try {
    const path = new URL(request.url, 'http://localhost').pathname;
    if (path === '/' || path === '/index.php') {
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.end(await readFile('tests/fixtures/picker-profiles.html', 'utf8')); return;
    }
    const base = path.startsWith('/joomla/') ? joomla : root;
    const target = resolve(base, '.' + (path.startsWith('/joomla/') ? path.slice(7) : path));
    if (!target.startsWith(base + sep)) throw new Error('Outside fixture roots');
    response.setHeader('Content-Type', ({ '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' })[extname(target)] || 'application/octet-stream');
    response.end(await readFile(target));
  } catch { response.writeHead(404); response.end(); }
});
server.listen(8791, '127.0.0.1', () => console.log('Picker fixture: http://127.0.0.1:8791'));
