// Keep embedded pickers inside their actual dialog, rather than estimating its
// bottom edge from centered margins (which differ between templates).
export function browserAvailableHeight(shell) {
  const win = shell.ownerDocument.defaultView;
  let bottom = win.innerHeight;
  let trailing = 0;
  let focused = false;
  for (let element = shell.parentElement; element; element = element.parentElement) {
    const style = win.getComputedStyle(element);
    const inset = (parseFloat(style.paddingBottom) || 0) + (parseFloat(style.borderBottomWidth) || 0);
    if (element.matches('dialog, [data-sb-focus]')) {
      bottom = Math.min(win.innerHeight, element.getBoundingClientRect().bottom - inset) - trailing;
      focused = true;
      break;
    }
    trailing += inset + (parseFloat(style.marginBottom) || 0);
    bottom = win.innerHeight - trailing;
    if (element === shell.ownerDocument.body) break;
  }
  return Math.max(0, bottom - shell.getBoundingClientRect().top - (focused ? 0 : win.scrollY));
}

// Scroll only the results area, never the page behind an embedded picker.
export function revealResources(shell, keys) {
  const results = shell.querySelector('.resource-main > .resource-browser');
  if (!results || !keys.length) return;
  const view = results.querySelector(':scope > .resource-browser-grid, :scope > .resource-details-view') || results;
  const wanted = new Set(keys);
  const elements = [...view.querySelectorAll('[data-sb-resource-key]')]
    .filter(element => wanted.has(element.dataset.sbResourceKey) && element.getClientRects().length);
  if (!elements.length) return;
  const win = shell.ownerDocument.defaultView;
  let scroller = elements[0].parentElement;
  while (scroller && scroller !== results && !(/auto|scroll/.test(win.getComputedStyle(scroller).overflowY) && scroller.scrollHeight > scroller.clientHeight)) scroller = scroller.parentElement;
  if (!scroller) return;
  const box = scroller.getBoundingClientRect();
  const heading = view.querySelector('thead');
  const inset = heading && win.getComputedStyle(heading.querySelector('th')).position === 'sticky' ? heading.getBoundingClientRect().height : 0;
  const top = box.top + scroller.clientTop + inset;
  let bottom = box.top + scroller.clientTop + scroller.clientHeight;
  const message = shell.querySelector('.sb-browser-messages #system-message-container');
  if (message?.children.length && message.getBoundingClientRect().height) bottom = Math.min(bottom, message.getBoundingClientRect().top);
  const rects = elements.map(element => element.getBoundingClientRect());
  const first = Math.min(...rects.map(rect => rect.top));
  const last = Math.max(...rects.map(rect => rect.bottom));
  const delta = last - first > bottom - top || first < top ? first - top : last > bottom ? last - bottom : 0;
  if (delta) scroller.scrollTop += delta;
}
