import { preferenceStorage } from './userPreferences.js';
export const displayModes = ['normal', 'wide', 'focus'];
const storageKey = 'smartbrowser.displayMode';

export function resolvePageBackground(container) {
  const win = container.ownerDocument.defaultView;
  if (!win.getComputedStyle) return null;
  let colour = '', image = null;
  for (let parent = container.parentElement; parent; parent = parent.parentElement) {
    const style = win.getComputedStyle(parent);
    if (!colour && style.backgroundColor !== 'transparent' && !style.backgroundColor.startsWith('rgba(')) colour = style.backgroundColor;
    if (!image && style.backgroundImage !== 'none') image = style;
  }
  return {
    color: colour || 'Canvas',
    image: image?.backgroundImage || 'none',
    size: image?.backgroundSize || 'auto',
    repeat: image?.backgroundRepeat || 'repeat',
    position: image?.backgroundPosition || '0% 0%',
    attachment: image?.backgroundAttachment || 'scroll',
  };
}

export function createDisplayMode(container, onChange = () => {}) {
  let mode = 'normal', restore = [], placeholder = null;
  const doc = container.ownerDocument;
  let storage;
  try { storage = preferenceStorage(doc.defaultView); } catch {}
  const attribute = (element, name, value) => {
    const previous = element.getAttribute(name);
    element.setAttribute(name, value);
    restore.push(() => previous === null ? element.removeAttribute(name) : element.setAttribute(name, previous));
  };
  const reset = () => {
    if (placeholder) { placeholder.replaceWith(container); placeholder = null; }
    restore.reverse().forEach(fn => fn()); restore = [];
  };
  const set = (next, persist = true) => {
    if (!displayModes.includes(next)) return;
    const previous = mode;
    reset(); mode = next; onChange(mode);
    if (persist) {
      try { storage?.setItem(storageKey, mode); } catch {}
    }
    const event = new CustomEvent('smartbrowser:display-mode', { bubbles: true, cancelable: true, detail: { mode, previous, container } });
    if (!container.dispatchEvent(event)) return mode;
    if (mode === 'wide') {
      for (let parent = container.parentElement; parent && parent !== doc.body && parent !== doc.documentElement; parent = parent.parentElement) {
        attribute(parent, 'data-sb-wide-container', '');
      }
    }
    if (mode === 'focus') {
      const background = resolvePageBackground(container);
      if (background) {
        const previousStyle = container.getAttribute('style');
        for (const [property, value] of Object.entries(background)) container.style.setProperty(`--sb-focus-background-${property}`, value);
        restore.push(() => previousStyle === null ? container.removeAttribute('style') : container.setAttribute('style', previousStyle));
      }
      placeholder = doc.createComment('SmartBrowser display position');
      container.replaceWith(placeholder);
      doc.body.appendChild(container);
      attribute(container, 'data-sb-focus', '');
      attribute(doc.body, 'data-sb-focus-page', '');
      for (const sibling of doc.body.children) {
        if (sibling === container || sibling.tagName === 'DIALOG') continue;
        attribute(sibling, 'inert', '');
      }
    }
    return mode;
  };
  const escape = event => {
    if (event.key === 'Escape' && !event.defaultPrevented && mode !== 'normal' && !doc.querySelector('dialog[open]')) {
      set('normal'); container.querySelector('.resource-display-toggle')?.focus();
    }
  };
  doc.addEventListener('keydown', escape);
  try {
    const saved = storage?.getItem(storageKey);
    if (displayModes.includes(saved) && saved !== 'normal') set(saved, false);
  } catch {}
  return { get mode() { return mode; }, set, cycle: () => set(displayModes[(displayModes.indexOf(mode) + 1) % 3]),
    destroy() { set('normal', false); doc.removeEventListener('keydown', escape); },
  };
}
