import { resolvePageBackground } from './displayMode.js';

// Measure host chrome rather than assuming Joomla/template header heights.
export function observeBrowserLayout(shell, getHeader, nativeTarget) {
  const doc = shell.ownerDocument, win = doc.defaultView;
  let frame = 0, disposed = false, surfaceParent = null;
  const nativeBar = nativeTarget ? doc.querySelector(nativeTarget)?.closest('.subhead') : null;
  const nativeTop = nativeBar ? parseFloat(win.getComputedStyle(nativeBar).top) || 0 : 0;
  const nativeStyles = nativeBar ? ['--sb-native-top', '--sb-native-heading-offset'].map(property => [property, nativeBar.style.getPropertyValue(property), nativeBar.style.getPropertyPriority(property)]) : [];
  const candidates = () => [...doc.querySelectorAll('header, [role="banner"], [id], [class*="sticky"], [class*="fixed"]')]
    .filter(element => !element.contains(shell) && !shell.contains(element));
  const watched = new Set();
  const clipping = new Map();
  const restoreClip = element => {
    for (const [property, value, priority, applied] of clipping.get(element) || []) {
      if (element.style.getPropertyValue(property) !== applied) continue;
      if (value) element.style.setProperty(property, value, priority);
      else element.style.removeProperty(property);
    }
    clipping.delete(element);
  };
  const prepareAncestors = isolated => {
    const active = new Set();
    if (!isolated && !nativeBar && win.CSS?.supports('overflow', 'clip')) {
      for (let element = shell.parentElement; element && element !== doc.body; element = element.parentElement) {
        const style = win.getComputedStyle(element);
        if (element.scrollTop || (['auto', 'scroll'].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1)) continue;
        if (clipping.has(element)) { active.add(element); continue; }
        if (![style.overflowX, style.overflowY].includes('hidden')) continue;
        const changes = [];
        for (const [property, overflow] of [['overflow-x', style.overflowX], ['overflow-y', style.overflowY]]) {
          const applied = overflow === 'hidden' ? 'clip' : overflow === 'auto' ? 'visible' : null;
          if (!applied) continue;
          changes.push([property, element.style.getPropertyValue(property), element.style.getPropertyPriority(property), applied]);
        }
        clipping.set(element, changes); active.add(element);
        for (const [property, , , applied] of changes) element.style.setProperty(property, applied, 'important');
      }
    }
    for (const element of clipping.keys()) if (!active.has(element)) restoreClip(element);
  };
  const set = (name, value) => {
    const next = `${Math.round(value)}px`;
    if (shell.style.getPropertyValue(name) !== next) shell.style.setProperty(name, next);
  };
  const measure = () => {
    const header = getHeader();
    const isolated = shell.classList.contains('is-picker') || shell.parentElement.hasAttribute('data-sb-focus');
    if (shell.classList.contains('is-site') && surfaceParent !== shell.parentElement.parentElement) {
      surfaceParent = shell.parentElement.parentElement;
      const background = resolvePageBackground(shell);
      if (background) for (const [property, value] of Object.entries(background)) shell.style.setProperty(`--sb-page-background-${property}`, value);
    }
    prepareAncestors(isolated);
    let inset = 0;
    if (!isolated && !nativeBar) {
      for (const element of candidates()) {
        if (!['fixed', 'sticky'].includes(win.getComputedStyle(element).position)) continue;
        if (!watched.has(element)) { watched.add(element); observer.observe(element); }
        const rect = element.getBoundingClientRect();
        if (!element.inert && rect.width > win.innerWidth / 2 && rect.top <= inset + 1 && rect.bottom > inset && rect.height < win.innerHeight / 2) inset = rect.bottom;
      }
    }
    const headingHeight = isolated ? 0 : nativeBar
      ? Math.max(0, doc.querySelector(nativeTarget).getBoundingClientRect().top - nativeBar.getBoundingClientRect().top)
      : shell.classList.contains('is-site') ? header?.querySelector('.sb-browser-heading')?.getBoundingClientRect().height || 0 : 0;
    set('--sb-heading-height', headingHeight);
    if (nativeBar) {
      nativeBar.style.setProperty('--sb-native-top', `${nativeTop}px`);
      nativeBar.style.setProperty('--sb-native-heading-offset', `${headingHeight}px`);
    }
    const contentTop = isolated ? 0 : nativeBar
      ? (parseFloat(win.getComputedStyle(nativeBar).top) || 0) + nativeBar.getBoundingClientRect().height
      : inset + (header?.getBoundingClientRect().height || 0) - headingHeight;
    set('--sb-page-inset', inset);
    set('--sb-content-top', contentTop);
    set('--sb-results-top', contentTop + (shell.querySelector('.resource-main > .resource-toolbar')?.getBoundingClientRect().height || 0));
    const resultsTop = contentTop + (shell.querySelector('.resource-main > .resource-toolbar')?.getBoundingClientRect().height || 0);
    set('--sb-tree-height', Math.max(0, win.innerHeight - contentTop));
    set('--sb-info-height', isolated ? shell.querySelector('.resource-main > .resource-browser')?.clientHeight || Math.max(0, win.innerHeight - resultsTop) : Math.max(0, win.innerHeight - resultsTop));
    const rail = shell.querySelector('.sb-tree-handle-rail')?.getBoundingClientRect();
    const visibleTop = Math.max(contentTop, rail?.top ?? contentTop);
    const visibleBottom = Math.min(win.innerHeight, rail?.bottom ?? win.innerHeight);
    set('--sb-tree-handle-top', visibleTop + Math.max(0, (visibleBottom - visibleTop - 54) / 2));
  };
  const schedule = () => { if (disposed) return; win.cancelAnimationFrame(frame); frame = win.requestAnimationFrame(measure); };
  const observer = new win.ResizeObserver(schedule);
  [getHeader(), nativeBar, shell.querySelector('.resource-main > .resource-toolbar'), shell.querySelector('.resource-main > .resource-browser'), shell.querySelector('.smartbrowser-layout')].filter(Boolean).forEach(element => observer.observe(element));
  win.addEventListener('resize', schedule);
  win.addEventListener('scroll', schedule, { passive: true });
  doc.addEventListener('smartbrowser:display-mode', schedule);
  doc.fonts?.ready.then(schedule);
  measure();
  return () => {
    disposed = true;
    for (const [property, value, priority] of nativeStyles) {
      if (value) nativeBar.style.setProperty(property, value, priority);
      else nativeBar.style.removeProperty(property);
    }
    for (const element of clipping.keys()) restoreClip(element);
    observer.disconnect(); win.cancelAnimationFrame(frame);
    win.removeEventListener('resize', schedule); win.removeEventListener('scroll', schedule);
    doc.removeEventListener('smartbrowser:display-mode', schedule);
  };
}
