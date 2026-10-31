// Joomla owns the image operations; the enclosing SmartBrowser file editor owns saving.
window.addEventListener('DOMContentLoaded', async () => {
  try {
    await import(Joomla.getOptions('com_smartbrowser.imageEditor').engine);
    const editor = Joomla.MediaManager.Edit;
    let baseline = editor.options.contents, interacted = false;
    await customElements.whenDefined('joomla-tab');
    const tabs = document.getElementById('myTab');
    const buttons = [...tabs.firstElementChild.querySelectorAll('button[aria-controls]')];
    tabs.firstElementChild.hidden = true;
    // Cropper may encode a full-image canvas during initialization. That alone
    // is not an edit to a file opened on the unchanged Content tab.
    const form = document.getElementById('media-form');
    for (const event of ['input', 'change']) form.addEventListener(event, () => { interacted = true; }, true);
    form.addEventListener('pointerdown', event => { if (event.target.closest('input, button, select, .cropper-container')) interacted = true; }, true);
    window.SmartBrowserImageEditor = {
      getTabs: () => buttons.map(button => ({ id: button.getAttribute('aria-controls'), label: button.textContent.trim() })),
      activateTab: id => { window.dispatchEvent(new Event('resize')); tabs.activateTab(buttons.findIndex(button => button.getAttribute('aria-controls') === id), false); },
      getContent: () => interacted ? editor.current.contents.split(',')[1] : baseline,
      isDirty: () => interacted && editor.current.contents.split(',')[1] !== baseline,
      commit: content => { baseline = content; editor.options.contents = content; interacted = false; },
      reset: content => {
        baseline = content; interacted = false; editor.options.contents = content;
        editor.Reset('initial');
      },
    };
    // Native plugins invoke image operations directly. Native submit tasks must
    // never navigate this embedded editor to com_media or write outside the host.
    Joomla.submitbutton = task => {
      if (task === 'file.reset' || task === 'reset') editor.Reset('initial');
    };
    window.dispatchEvent(new Event('smartbrowser-image-editor-ready'));
  } catch (error) {
    document.getElementById('media-form').textContent = error.message;
    console.error(error);
  }
}, { once: true });
