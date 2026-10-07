(() => {
  const editor = document.querySelector('.com-smartbrowser-editor:not(.is-page)');
  if (!editor) return;
  const root = document.documentElement;
  root.classList.add('sb-editor-modal-document');
  let frame;
  const fit = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const available = Math.max(0, (window.visualViewport?.height || window.innerHeight) - Math.max(0, editor.getBoundingClientRect().top));
      editor.style.setProperty('--sb-editor-available-height', `${available}px`);
    });
  };
  const observer = new ResizeObserver(fit);
  observer.observe(document.body);
  window.addEventListener('resize', fit);
  window.visualViewport?.addEventListener('resize', fit);
  window.addEventListener('pagehide', () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize', fit); window.visualViewport?.removeEventListener('resize', fit); }, { once: true });
  fit();
})();
