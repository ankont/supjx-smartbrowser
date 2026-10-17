import { createVisualOverlays } from './visualOverlays.js';

export function createPreviewRenderer(options) {
  const lifecycle = createVisualOverlays({ ...options, removeOnError: true, remountWithoutUpdate: true });
  return {
    sync(surface, definitions, context, identity) {
      for (const definition of definitions) {
        try { if (definition.applies && !definition.applies(context)) continue; }
        catch (error) { (options.report || console.error)(error); continue; }
        if (lifecycle.sync(surface, [definition], context, identity)) return true;
      }
      lifecycle.sync(surface, [], context, identity);
      return false;
    },
    destroy: () => lifecycle.destroy(),
  };
}
