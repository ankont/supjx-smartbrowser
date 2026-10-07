const locks = new WeakMap();

export function lockPageScroll(document) {
  const held = [];
  const visited = new Set();
  while (document && !visited.has(document)) {
    visited.add(document);
    const elements = [document.documentElement, document.body].filter(element => element?.classList);
    if (elements.length) {
      let lock = locks.get(document);
      if (!lock) {
        lock = { count: 0, elements: elements.map(element => ({ element, existed: element.classList.contains('sb-modal-scroll-locked') })) };
        locks.set(document, lock);
      }
      lock.count++;
      lock.elements.forEach(({ element }) => element.classList.add('sb-modal-scroll-locked'));
      held.push(document);
    }
    try { document = document.defaultView?.frameElement?.ownerDocument; } catch { break; }
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    held.forEach(document => {
      const lock = locks.get(document);
      if (--lock.count) return;
      lock.elements.forEach(({ element, existed }) => { if (!existed) element.classList.remove('sb-modal-scroll-locked'); });
      locks.delete(document);
    });
  };
}
