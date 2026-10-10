export function anchorSuggestions(content, mode = 'none') {
  if (!['anchors', 'all'].includes(mode)) return [];
  const values = new Set();
  for (const element of content.querySelectorAll(mode === 'all' ? '[id], a[name]' : 'a[name], a[id]:not([href])')) {
    const id = element.getAttribute('id');
    const name = element.localName === 'a' ? element.getAttribute('name') : null;
    if (id && (mode === 'all' || !element.hasAttribute('href'))) values.add(id);
    if (name) values.add(name);
  }
  return [...values];
}

export function articleAnchorSuggestions(form, mode, editors = window.Joomla?.editors?.instances) {
  if (!['anchors', 'all'].includes(mode)) return [];
  const field = form?.elements.namedItem('jform[articletext]');
  if (!field || typeof field.value !== 'string') return [];
  try {
    const editor = editors?.[field.id];
    const html = typeof editor?.getValue === 'function' ? editor.getValue() : field.value;
    if (typeof html !== 'string') return [];
    // Template content is inert: suggestions must not load or execute article markup.
    const template = document.createElement('template');
    template.innerHTML = html;
    return anchorSuggestions(template.content, mode);
  } catch (error) {
    return [];
  }
}
