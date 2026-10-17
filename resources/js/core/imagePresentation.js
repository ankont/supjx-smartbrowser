export function declaredAspectRatio(value) {
  const ratio = String(value || '').trim().replace(/^auto\s+|\s+auto$/g, '').split(/\s*\/\s*/);
  if (ratio.length > 2 || ratio.some(part => !/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(part))) return null;
  const width = Number(ratio[0]), height = ratio.length === 2 ? Number(ratio[1]) : 1;
  const result = width / height;
  return width > 0 && height > 0 && Number.isFinite(width) && Number.isFinite(height) && result > 0 && Number.isFinite(result) ? result : null;
}

// Each update releases the old presentation before applying the new one.
export function createImagePresentation({ report = error => console.error(error) } = {}) {
  let entries = [];
  const clear = () => {
    for (const entry of entries.reverse()) {
      entry.abort.abort();
      try { entry.cleanup?.(); } catch (error) { report(error); }
      for (const [name, value, priority] of entry.styles) {
        if (value) entry.image.style.setProperty(name, value, priority);
        else entry.image.style.removeProperty(name);
      }
      try { entry.context.notifyPresentationChange?.({ providerId: entry.id, phase: 'removed' }); } catch (error) { report(error); }
    }
    entries = [];
  };
  return {
    sync(image, definitions, context) {
      clear();
      if (!image || !context?.resource?.id || context.resource.unavailable || image.getAttribute?.('data-sb-image-presentation') === 'server') return;
      const claimed = new Set();
      for (const definition of [...definitions].sort((a, b) => (a.order ?? 100) - (b.order ?? 100))) {
        const abort = new AbortController();
        const live = { ...context, imageElement: image, getImageElement: () => abort.signal.aborted ? null : image, signal: abort.signal };
        for (const key of ['setValue', 'setMetadata', 'setAddress', 'resetPreview', 'refresh', 'notifyPresentationChange']) {
          if (typeof context[key] === 'function') live[key] = (...args) => {
            if (abort.signal.aborted) throw new Error('This image presentation is no longer active.');
            return context[key](...args);
          };
        }
        let entry;
        try {
          if (definition.applies && !definition.applies(live)) { abort.abort(); continue; }
          const names = definition.styles || [];
          if (names.some(name => claimed.has(name))) { abort.abort(); continue; }
          entry = { image, abort, context, id: definition.id, styles: names.map(name => [name, image.style.getPropertyValue(name), image.style.getPropertyPriority(name)]) };
          entries.push(entry);
          entry.cleanup = definition.apply(image, live);
          if (entry.cleanup != null && typeof entry.cleanup !== 'function') throw new TypeError('Image presentation apply must return cleanup or undefined.');
          names.forEach(name => claimed.add(name));
          try { context.notifyPresentationChange?.({ providerId: definition.id, phase: 'applied' }); } catch (error) { report(error); }
        } catch (error) {
          report(error);
          abort.abort();
          if (entry) {
            entries.pop();
            for (const [name, value, priority] of entry.styles) {
              if (value) image.style.setProperty(name, value, priority); else image.style.removeProperty(name);
            }
            try { context.notifyPresentationChange?.({ providerId: definition.id, phase: 'removed' }); } catch (error) { report(error); }
          }
        }
      }
    },
    destroy: clear,
  };
}
