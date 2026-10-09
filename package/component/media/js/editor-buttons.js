import { JoomlaEditorButton } from 'editor-api';

const settings = () => Joomla.getOptions('com_smartbrowser.editor-buttons', {});
const safeUrl = value => {
  const url = new URL(value, settings().siteUrl || window.location.href);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid resource URL.');
  return url.href;
};
async function thumbnail(reference) {
  const config = settings();
  const url = new URL(config.apiUrl);
  url.searchParams.set('task', 'api.collection');
  url.searchParams.set('adapter', reference.adapter);
  url.searchParams.set('mode', 'select');
  const response = await fetch(url, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [reference.id], [config.csrfToken]: 1 }) });
  const result = await response.json();
  if (!response.ok || result.success === false) throw new Error(result.message || 'Resource unavailable.');
  const resource = result.data?.resources?.[0];
  if (!resource || resource.unavailable || resource.type !== 'image') throw new Error('Thumbnail unavailable.');
  return safeUrl(resource.metadata.url);
}
export async function mediaMarkup(resource, usage = {}) {
  const url = safeUrl(resource.metadata?.url);
  let element;
  if (resource.type === 'image') {
    element = document.createElement('img');
    element.src = url;
    element.alt = usage['media.decorative'] ? '' : (usage['media.alt'] || '');
    if (['lazy', 'eager'].includes(usage['media.loading'])) element.loading = usage['media.loading'];
  } else if (['video', 'audio'].includes(resource.type)) {
    element = document.createElement(resource.type);
    element.src = url;
    element.controls = true;
  } else {
    element = document.createElement('a');
    element.href = url;
    const reference = usage['visual.thumbnailOverride'];
    if (reference) {
      const image = document.createElement('img');
      image.src = await thumbnail(reference);
      image.alt = resource.title || '';
      element.append(image);
    } else element.textContent = resource.title || url;
  }
  return element.outerHTML;
}
const run = handler => async editor => {
  try { await handler(editor); }
  catch (error) { Joomla.renderMessages({ error: [error.message] }); }
};
JoomlaEditorButton.registerAction('smartbrowser-media', run(async editor => {
  const result = await window.SmartBrowserPicker.open({ url: settings().url, adapter: 'media', selectionTarget: 'item',
    allowedResourceTypes: ['image', 'document', 'video', 'audio'], resultFormat: 'usage',
    selectionProfile: { 'media.alt': {}, 'media.decorative': {}, 'media.loading': { default: 'auto' }, 'visual.thumbnailOverride': {} } });
  if (result) editor.replaceSelection(await mediaMarkup(result.selection, result.usage[result.selection.id]));
}));
JoomlaEditorButton.registerAction('smartbrowser-article', run(async editor => {
  const resource = await window.SmartBrowserPicker.open({ url: settings().url, adapter: 'articles', selectionTarget: 'item', allowedResourceTypes: ['article'] });
  if (!resource) return;
  const id = /^article:(\d+)$/.exec(resource.id)?.[1];
  if (!id) throw new Error('Invalid article reference.');
  const link = document.createElement('a');
  link.href = new URL(`index.php?option=com_content&view=article&id=${id}`, settings().siteUrl).href;
  link.textContent = resource.title;
  editor.replaceSelection(link.outerHTML);
}));
