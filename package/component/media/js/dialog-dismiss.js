(() => {
  const outside = (dialog, event) => {
    if (event.target !== dialog) return false;
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right
      || event.clientY < rect.top || event.clientY > rect.bottom;
  };

  window.SmartBrowserDialogDismiss = {
    install(dialog, isDirty = () => false, close = () => dialog.close()) {
      dialog.addEventListener('click', (event) => {
        if (outside(dialog, event) && !isDirty()) close();
      });
      dialog.addEventListener('cancel', (event) => {
        event.preventDefault();
        if (!isDirty()) close();
      });
    },
    watchFrame(frame, onDirty) {
      try {
        const form = frame.contentDocument?.querySelector('form#adminForm');
        if (!form) return;
        form.addEventListener('input', onDirty, true);
        form.addEventListener('change', onDirty, true);
        const tinymce = frame.contentWindow?.tinymce;
        tinymce?.editors?.forEach((editor) => editor.on('input change keyup', onDirty));
        tinymce?.on?.('AddEditor', (event) => event.editor.on('input change keyup', onDirty));
      } catch {
        // Cross-origin editor frames cannot be inspected.
      }
    },
  };
})();
