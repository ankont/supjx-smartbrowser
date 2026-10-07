const assets = ['base', 'identity', 'image'];
let nextId = 0;
let registry;

export const allocateVisualId = () => `sbv${++nextId}`;
const number = (value) => Number.isFinite(value) ? Math.round(value * 1000) / 1000 : 0;

export const visualVariableRules = (id, layers, side) => {
  if (!/^sbv\d+$/.test(id)) throw new Error('Invalid visual style ID');
  return layers.filter(layer => assets.includes(layer.asset)).map(layer => {
    const box = layer.box;
    const fontSize = side * box.height / 100 * (layer.style === 'badge' ? .65 : 1);
    if (layer.crop) {
      return `[data-sb-visual="${id}"] > .asset-${layer.asset} { --sb-visual-x: ${number(box.x)}%; --sb-visual-y: ${number(box.y)}%; --sb-visual-width: ${number(box.width)}%; --sb-visual-height: ${number(box.height)}%; --sb-visual-level: ${number(layer.z)}; --sb-visual-font-size: ${number(fontSize)}px; --sb-crop-x: ${number(layer.crop.x)}%; --sb-crop-y: ${number(layer.crop.y)}%; --sb-crop-width: ${number(layer.crop.width)}%; --sb-crop-height: ${number(layer.crop.height)}%; }`;
    }
    return `[data-sb-visual="${id}"] > .asset-${layer.asset} { --sb-visual-x: ${number(box.x)}%; --sb-visual-y: ${number(box.y)}%; --sb-visual-width: ${number(box.width)}%; --sb-visual-height: ${number(box.height)}%; --sb-visual-level: ${number(layer.z)}; --sb-visual-font-size: ${number(fontSize)}px; }`;
  }).join('\n');
};

export const createVisualStyleRegistry = (doc) => {
  const rules = new Map();
  let sheet, pending = false;
  const schedule = () => {
    if (pending) return;
    pending = true;
    // Batch all tile updates into one shared stylesheet, not element style attributes.
    queueMicrotask(() => {
      pending = false;
      if (!rules.size) { sheet?.remove(); sheet = null; return; }
      if (!sheet) { sheet = doc.createElement('style'); sheet.dataset.sbVisualVariables = ''; doc.head.append(sheet); }
      sheet.textContent = [...rules.values()].join('\n');
    });
  };
  return {
    update(id, layers, side) {
      const css = visualVariableRules(id, layers, side);
      if (rules.get(id) === css) return;
      rules.set(id, css);
      schedule();
    },
    remove(id) { if (rules.delete(id)) schedule(); },
  };
};

export const visualStyleRegistry = () => registry ||= createVisualStyleRegistry(document);
