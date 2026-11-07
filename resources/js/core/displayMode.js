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
  let mode = 'normal', restore = [], placeholder = null, resizeWide = null;
  const doc = container.ownerDocument;
  let storage;
  try { storage = preferenceStorage(doc.defaultView); } catch {}
  const attribute = (element, name, value) => {
    const previous = element.getAttribute(name);
    if (previous === value) return;
    element.setAttribute(name, value);
    restore.push(() => previous === null ? element.removeAttribute(name) : element.setAttribute(name, previous));
  };
  const reset = () => {
    resizeWide = null;
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
      const ancestors = [];
      const win = doc.defaultView;
      for (let parent = container.parentElement; parent && parent !== doc.body && parent !== doc.documentElement; parent = parent.parentElement) {
        const gridItem = win.getComputedStyle && ['grid', 'inline-grid'].includes(win.getComputedStyle(parent.parentElement).display);
        ancestors.push({ element: parent, gridItem });
      }
      attribute(container, 'data-sb-wide', '');
      for (const { element, gridItem } of ancestors) {
        attribute(element, 'data-sb-wide-container', '');
        if (gridItem) attribute(element, 'data-sb-wide-grid-item', '');
      }
      // Release remaining width constraints outside-in. Rows that already fill
      // their containing block, including negative gutters, keep their own width rules.
      resizeWide = () => {
        if (!win.getComputedStyle) return;
        for (const { element } of [...ancestors].reverse()) {
          const style = win.getComputedStyle(element), outer = win.getComputedStyle(element.parentElement);
          if (['grid', 'inline-grid'].includes(outer.display)) attribute(element, 'data-sb-wide-grid-item', '');
          const pixels = value => parseFloat(value) || 0;
          const margins = [pixels(style.marginLeft), pixels(style.marginRight)];
          // Typed OM distinguishes authored auto margins from negative used
          // values produced by an overflowing centered fixed-width box.
          const computed = element.computedStyleMap?.();
          const gutter = (side, index) => computed
            ? (String(computed.get('margin-' + side)) === 'auto' ? 0 : Math.min(0, margins[index]))
            : (margins.every(value => value < 0) ? margins[index] : 0);
          const available = element.parentElement.clientWidth - pixels(outer.paddingLeft) - pixels(outer.paddingRight)
            - gutter('left', 0) - gutter('right', 1);
          if (available > 0 && Math.abs(element.getBoundingClientRect().width - available) > 1) attribute(element, 'data-sb-wide-sizing', '');
        }
      };
      resizeWide();
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
  const resize = () => resizeWide?.();
  doc.defaultView.addEventListener?.('resize', resize);
  try {
    const saved = storage?.getItem(storageKey);
    if (displayModes.includes(saved) && saved !== 'normal') set(saved, false);
  } catch {}
  return { get mode() { return mode; }, set, cycle: () => set(displayModes[(displayModes.indexOf(mode) + 1) % 3]),
    destroy() { set('normal', false); doc.removeEventListener('keydown', escape); doc.defaultView.removeEventListener?.('resize', resize); },
  };
}
