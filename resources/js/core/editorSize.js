import { lockPageScroll } from './pageScrollLock.js';

const storageKey = 'smartbrowser.editorMaximized';

export function createEditorSize(dialog, button, translate, preferenceKey = storageKey) {
  let storage;
  try { storage = dialog.ownerDocument.defaultView.localStorage; } catch {}
  let maximized = false;
  let unlock;
  const set = (value, persist = true) => {
    maximized = value;
    dialog.classList.toggle('is-maximized', value);
    if (value && !unlock) unlock = lockPageScroll(dialog.ownerDocument);
    if (!value && unlock) { unlock(); unlock = null; }
    if (persist) { try { storage?.setItem(preferenceKey, String(value)); } catch {} }
    if (!button) return;
    button.setAttribute('aria-pressed', String(value));
    const label = translate(value ? 'COM_SMARTBROWSER_EDITOR_RESTORE' : 'COM_SMARTBROWSER_EDITOR_MAXIMIZE');
    button.title = label;
    button.setAttribute('aria-label', label);
    button.querySelector('span').className = value ? 'fas fa-compress' : 'fas fa-expand';
  };
  try { maximized = storage?.getItem(preferenceKey) === 'true'; } catch {}
  set(maximized, false);
  const toggle = () => set(!maximized);
  button?.addEventListener('click', toggle);
  return {
    toggle() { set(!maximized); return maximized; },
    isMaximized() { return maximized; },
    bind(next) {
      button?.removeEventListener('click', toggle);
      button = next;
      set(maximized, false);
      button?.addEventListener('click', toggle);
    },
    destroy() { button?.removeEventListener('click', toggle); unlock?.(); unlock = null; },
  };
}
