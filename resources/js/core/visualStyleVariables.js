const assets = ['base', 'identity', 'image'];
let nextId = 0;
let registry;

export const allocateVisualId = () => `sbv${++nextId}`;
const number = (value) => Number.isFinite(value) ? Math.round(value * 1000) / 1000 : 0;

export const fitVisualLayers = (layers, width, height, adaptive = false) => {
  if (!layers.length || width <= 0 || height <= 0) return { layers, side: Math.min(width, height) };
  const left = Math.min(...layers.map(layer => layer.box.x));
  const boundsWidth = Math.max(...layers.map(layer => layer.box.x + layer.box.width)) - left;
  const top = adaptive ? Math.min(...layers.map(layer => layer.box.y)) : 0;
  const boundsHeight = adaptive ? Math.max(...layers.map(layer => layer.box.y + layer.box.height)) - top : 100;
  if (adaptive) height = Math.max(26, Math.min(height, width * boundsHeight / boundsWidth));
  const scale = Math.min(width / boundsWidth, height / boundsHeight);
  const offsetX = (width - boundsWidth * scale) / 2;
  const offsetY = (height - boundsHeight * scale) / 2;
  return { height, side: scale * 100, layers: layers.map(layer => ({ ...layer, box: {
    x: ((layer.box.x - left) * scale + offsetX) / width * 100,
    y: ((layer.box.y - top) * scale + offsetY) / height * 100,
    width: layer.box.width * scale / width * 100,
    height: layer.box.height * scale / height * 100,
  } })) };
};

export const informationVisualLayers = (layers, width, gridSide = 180) => {
  const image = layers.find(layer => layer.src);
  const iconHeight = Math.max(26, ...layers.filter(layer => !layer.src).map(layer => gridSide * layer.box.height / 100));
  const scale = Math.min(gridSide, width) / 100;
  const anchorsImage = layer => image && layer.style === 'badge' && (layer.anchor === 'image' || layer.anchor === (image.style === 'center' ? 'center' : `${image.style}:${image.position}`));
  const overhang = image ? Math.max(0, ...layers.filter(anchorsImage).map(layer => Math.max(image.box.y - layer.box.y, layer.box.y + layer.box.height - image.box.y - image.box.height) * scale)) : 0;
  const height = Math.max(iconHeight, image ? Math.max(Math.min(gridSide, width) * Math.min(1, image.box.height / image.box.width), image.box.height * scale + overhang * 2) : Math.min(gridSide, width));
  return { height, layers: layers.map(layer => {
    const box = layer.box;
    const layerWidth = box.width * scale;
    const layerHeight = box.height * scale;
    const canvasWidth = Math.min(width, gridSide);
    const x = layer.src ? (width - layerWidth) / 2 : (width - canvasWidth) / 2 + box.x / Math.max(1, 100 - box.width) * Math.max(0, canvasWidth - layerWidth);
    const y = layer.src ? (height - layerHeight) / 2 : anchorsImage(layer) ? (height - image.box.height * scale) / 2 + (box.y - image.box.y) * scale : box.y / Math.max(1, 100 - box.height) * Math.max(0, height - layerHeight);
    return { ...layer, fontHeight: layer.src ? undefined : gridSide * box.height / 100,
      box: { x: x / width * 100, y: y / height * 100, width: layerWidth / width * 100, height: layerHeight / height * 100 } };
  }) };
};

export const visualVariableRules = (id, layers, side) => {
  if (!/^sbv\d+$/.test(id)) throw new Error('Invalid visual style ID');
  return layers.filter(layer => assets.includes(layer.asset)).map(layer => {
    const box = layer.box;
    const fontSize = (layer.fontHeight ?? side * box.height / 100) * (layer.style === 'badge' ? .65 : 1);
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
    update(id, layers, side, height) {
      const css = visualVariableRules(id, layers, side) + (height === undefined ? '' : `\n[data-sb-visual="${id}"] { position: relative; inset: auto; width: 100%; height: ${number(height)}px; }`);
      if (rules.get(id) === css) return;
      rules.set(id, css);
      schedule();
    },
    remove(id) { if (rules.delete(id)) schedule(); },
  };
};

export const visualStyleRegistry = () => registry ||= createVisualStyleRegistry(document);
