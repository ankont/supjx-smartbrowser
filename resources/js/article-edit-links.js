import MediaActionDriver from './adapters/MediaActionDriver.js';

const editor = new MediaActionDriver(null, {}, () => window.location.reload(), key => Joomla.Text._(key), 'modal', 'site');
document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href]');
  if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin || url.searchParams.has('sbNative')) return;
  const task = url.searchParams.get('task');
  if (!['article.edit', 'article.add'].includes(task)) return;
  if (url.searchParams.has('option') && url.searchParams.get('option') !== 'com_content') return;
  event.preventDefault();
  url.searchParams.set('tmpl', 'component');
  url.searchParams.delete('sbpage');
  editor.openEditor(url.href);
});
window.addEventListener('pagehide', () => editor.destroy(), { once: true });
