export function createVisualOverlays({ createLayer, report = error => console.error(error), removeOnError = false, remountWithoutUpdate = false }) {
  const mounted = new Map();
  const liveContext = (context, abort) => {
    const result = { ...context, signal: abort.signal };
    if (typeof context.getImageElement === 'function') result.getImageElement = () => abort.signal.aborted ? null : context.getImageElement();
    for (const key of ['setValue', 'setMetadata', 'setAddress', 'refresh', 'resetPreview', 'setImageElement', 'notifyPresentationChange']) {
      if (typeof context[key] === 'function') result[key] = (...args) => {
        if (abort.signal.aborted) throw new Error('This visual overlay is no longer active.');
        return context[key](...args);
      };
    }
    return result;
  };
  const remove = id => {
    const entry = mounted.get(id);
    if (!entry) return;
    mounted.delete(id);
    entry.abort.abort();
    try { entry.cleanup?.(); } catch (error) { report(error); }
    try { entry.definition.unmount?.(entry.layer, entry.context); } catch (error) { report(error); }
    entry.layer.remove();
  };
  return {
    sync(surface, definitions, context, identity) {
      const applicable = definitions.filter(definition => {
        try { return surface && context?.resource?.id && (!definition.applies || definition.applies(context)); }
        catch (error) { report(error); return false; }
      });
      for (const [id, entry] of mounted) {
        if (entry.surface !== surface || entry.identity !== identity || entry.context.actionsContainer !== context?.actionsContainer || !applicable.includes(entry.definition)) remove(id);
      }
      for (const definition of applicable) {
        let entry = mounted.get(definition.id);
        if (entry && remountWithoutUpdate && typeof definition.update !== 'function') { remove(definition.id); entry = null; }
        if (!entry) {
          const layer = createLayer(surface, definition);
          const abort = new AbortController();
          entry = { definition, layer, surface, identity, abort, context: liveContext(context, abort) };
          mounted.set(definition.id, entry);
          try { entry.cleanup = definition.mount(layer, entry.context); }
          catch (error) { report(error); remove(definition.id); continue; }
          if (typeof entry.cleanup !== 'function') entry.cleanup = null;
        } else {
          Object.assign(entry.context, liveContext(context, entry.abort));
          try { definition.update?.(entry.layer, entry.context); } catch (error) { report(error); if (removeOnError) { remove(definition.id); continue; } }
        }
        surface.append(entry.layer);
      }
      return mounted.size;
    },
    destroy() { for (const id of [...mounted.keys()]) remove(id); },
  };
}
