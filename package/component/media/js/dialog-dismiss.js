(() => {
  const outside = (dialog, event) => {
    if (event.target !== dialog) return false;
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right
      || event.clientY < rect.top || event.clientY > rect.bottom;
  };

  window.SmartBrowserDialogDismiss = {
    install(dialog, isDirty = () => false, close = () => dialog.close()) {
      const dismiss = () => {
        if (!isDirty() || window.confirm(window.Joomla?.Text?._('COM_SMARTBROWSER_CONFIRM_DISCARD', 'Discard your unsaved changes and leave?') || 'Discard your unsaved changes and leave?')) close();
      };
      dialog.addEventListener('click', (event) => {
        if (outside(dialog, event)) dismiss();
      });
      dialog.addEventListener('cancel', (event) => {
        event.preventDefault();
        dismiss();
      });
    },
    watchFrame(frame, onDirty) {
      try {
        const form = frame.contentDocument?.querySelector('form#adminForm');
        if (form) this.watchForm(form, onDirty, frame.contentWindow);
      } catch {
        // Cross-origin editor frames cannot be inspected.
      }
    },
    watchForm(form, onDirty, editorWindow = window) {
      form.addEventListener('input', onDirty, true);
      form.addEventListener('change', onDirty, true);
      const tinymce = editorWindow?.tinymce;
      const observe = editor => editor.on('input change', onDirty);
      tinymce?.editors?.forEach(observe);
      tinymce?.on?.('AddEditor', event => observe(event.editor));
    },
  };
})();
