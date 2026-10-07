const storageKey = 'smartbrowser.editorMaximized';

export function createEditorSize(dialog, button, translate) {
  let storage;
  try { storage = dialog.ownerDocument.defaultView.localStorage; } catch {}
  let maximized = false;
  const set = (value, persist = true) => {
    maximized = value;
    dialog.classList.toggle('is-maximized', value);
    if (!button) return;
    button.setAttribute('aria-pressed', String(value));
    const label = translate(value ? 'COM_SMARTBROWSER_EDITOR_RESTORE' : 'COM_SMARTBROWSER_EDITOR_MAXIMIZE');
    button.title = label;
    button.setAttribute('aria-label', label);
    button.querySelector('span').className = value ? 'fas fa-compress' : 'fas fa-expand';
    if (persist) { try { storage?.setItem(storageKey, String(value)); } catch {} }
  };
  try { maximized = storage?.getItem(storageKey) === 'true'; } catch {}
  set(maximized, false);
  const toggle = () => set(!maximized);
  button?.addEventListener('click', toggle);
  return {
    bind(next) {
      button?.removeEventListener('click', toggle);
      button = next;
      set(maximized, false);
      button?.addEventListener('click', toggle);
    },
    destroy: () => button?.removeEventListener('click', toggle),
  };
}
