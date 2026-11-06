/* Compatibility for Joomla form layouts inside SmartBrowser, without rebuilding widgets. */
(() => {
  const instances = new WeakMap();
  function init(root) {
    if (instances.has(root)) return;
    const calendars = new Map();
    let frame = 0;
    function restore(element, state) {
      if (element.hidePopover && element.matches(':popover-open')) element.hidePopover();
      if (state.popover === null) element.removeAttribute('popover');
      else element.setAttribute('popover', state.popover);
      if (state.style === null) element.removeAttribute('style');
      else element.setAttribute('style', state.style);
      resizeObserver.unobserve(state.anchor);
      calendars.delete(element);
    }
    function update() {
      frame = 0;
      for (const [element, state] of calendars) {
        if (!root.contains(element) || element.hidden || !element.classList.contains('open')) restore(element, state);
      }
      for (const element of root.querySelectorAll('.field-calendar .js-calendar.open:not([hidden])')) {
        const field = element.closest('.field-calendar');
        const anchor = field.querySelector('.input-group') || field;
        if (!anchor.getClientRects().length) {
          if (calendars.has(element)) restore(element, calendars.get(element));
          continue;
        }
        if (!calendars.has(element)) {
          calendars.set(element, { style: element.getAttribute('style'), popover: element.getAttribute('popover'), anchor });
          resizeObserver.observe(anchor);
        }
        // A manual popover escapes clipping ancestors while remaining a descendant of
        // the native field: Joomla's outside-click and keyboard handlers still work.
        if (element.showPopover) {
          element.setAttribute('popover', 'manual');
          if (!element.matches(':popover-open')) element.showPopover();
        }
        const viewport = window.visualViewport;
        const host = root.getBoundingClientRect();
        let left = Math.max(host.left, viewport?.offsetLeft || 0) + 8;
        let top = Math.max(host.top, viewport?.offsetTop || 0) + 8;
        let right = Math.min(host.right, (viewport?.offsetLeft || 0) + (viewport?.width || innerWidth)) - 8;
        let bottom = Math.min(host.bottom, (viewport?.offsetTop || 0) + (viewport?.height || innerHeight)) - 8;
        const toolbar = root.querySelector('.smartbrowser-editor-actions:not([hidden])');
        if (toolbar) top = Math.max(top, toolbar.getBoundingClientRect().bottom + 4);
        // Older browsers without top-layer support must also respect clipping parents.
        if (!element.showPopover) for (let parent = element.parentElement; parent; parent = parent.parentElement) {
          const css = getComputedStyle(parent), box = parent.getBoundingClientRect();
          if (/(auto|scroll|hidden|clip)/.test(css.overflowX)) { left = Math.max(left, box.left + 4); right = Math.min(right, box.right - 4); }
          if (/(auto|scroll|hidden|clip)/.test(css.overflowY)) { top = Math.max(top, box.top + 4); bottom = Math.min(bottom, box.bottom - 4); }
        }
        const style = element.style;
        style.position = 'fixed';
        style.inset = 'auto';
        style.margin = '0';
        style.boxSizing = 'border-box';
        style.minWidth = '0';
        style.width = `${Math.max(1, Math.min(360, right - left))}px`;
        style.maxWidth = `${Math.max(1, right - left)}px`;
        style.maxHeight = `${Math.max(1, bottom - top)}px`;
        style.overflow = 'auto';
        const rect = anchor.getBoundingClientRect();
        const height = element.getBoundingClientRect().height;
        const below = bottom - rect.bottom, above = rect.top - top;
        const y = below >= height || below >= above ? rect.bottom + 4 : rect.top - height - 4;
        const width = element.getBoundingClientRect().width;
        style.left = `${Math.max(left, Math.min(right - width, getComputedStyle(field).direction === 'rtl' ? rect.right - width : rect.left))}px`;
        style.top = `${Math.max(top, Math.min(bottom - height, y))}px`;
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(root);
    const observer = new MutationObserver(records => {
      if (records.some(record => record.type === 'childList' || record.target.matches('.js-calendar')
        || [...calendars.keys()].some(element => record.target.contains(element)))) schedule();
    });
    observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'class'] });
    root.addEventListener('scroll', schedule, true);
    window.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('scroll', schedule);
    instances.set(root, true);
    window.addEventListener('pagehide', () => {
      observer.disconnect();
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
      for (const [element, state] of calendars) restore(element, state);
      root.removeEventListener('scroll', schedule, true);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('scroll', schedule);
      instances.delete(root);
    }, { once: true });
    schedule();
  }
  function scan(target = document) {
    if (target.matches?.('.com-smartbrowser-editor')) init(target);
    target.querySelectorAll?.('.com-smartbrowser-editor').forEach(init);
  }
  scan();
  document.addEventListener('joomla:updated', event => scan(event.target));
  window.addEventListener('pageshow', event => { if (event.persisted) scan(); });
})();
