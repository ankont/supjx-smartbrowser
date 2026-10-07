export const resourceVisualIcon = (resource) => resource?.badgeIcon || resource?.icon;
export const hasNodeBadge = (resource) => Boolean(resource?.badgeIcon && (resource.kind === 'node' || !resource.kind));
export const visualAssets = ['base', 'identity', 'image'];
export const visualStyles = ['hidden', 'center', 'corner', 'badge'];
export const visualSizes = ['small', 'medium', 'large', 'max'];
export const visualPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
export const visualSizeModes = ['center', 'corner', 'badge'];
export const visualDefaults = Object.freeze({
  base: { style: 'center', size: 'medium', sizes: { center: 'medium', corner: 'medium', badge: 'small' }, position: 'top-left', anchor: 'image' },
  identity: { style: 'badge', size: 'small', sizes: { center: 'medium', corner: 'small', badge: 'small' }, position: 'bottom-right', anchor: 'image' },
  image: { style: 'center', size: 'large', sizes: { center: 'large', corner: 'medium', badge: 'small' }, position: 'bottom-left', anchor: 'base' },
  order: ['base', 'image', 'identity'], imageBackground: 'auto',
});
export const canAnchor = (settings, asset, target) => {
  const seen = new Set([asset]);
  let current = target;
  while (current) {
    if (seen.has(current)) return false;
    seen.add(current);
    current = settings[current]?.style === 'badge' ? settings[current].anchor : null;
  }
  return visualAssets.includes(target) && asset !== target;
};
const migrate = (input) => {
  if (!input?.baseMode) return input || {};
  const styles = { hidden: 'hidden', center: 'center', behind: 'corner-large', badge: 'badge', corner: 'corner-large' };
  return {
    base: { style: styles[input.baseMode], position: input.basePosition },
    identity: { style: styles[input.identityMode], position: input.identityPosition, anchor: input.imageMode === 'center' ? 'image' : 'base' },
    image: { style: input.imageMode === 'center' ? 'center-large' : styles[input.imageMode], position: 'bottom-left' },
    imageBackground: input.imageBackground,
  };
};
export const normalizeVisualSettings = (value = {}) => {
  if (Array.isArray(value.rules)) return { rules: normalizeVisualRules(value.rules) };
  const input = migrate(value);
  const settings = { order: [], imageBackground: ['auto', 'transparent', 'checkerboard'].includes(input.imageBackground) ? input.imageBackground : 'auto' };
  for (const asset of visualAssets) {
    const source = input[asset] || {}, defaults = visualDefaults[asset];
    const legacy = /^(center|corner)-(small|medium|large|max)$/.exec(source.style || '');
    const style = legacy ? legacy[1] : visualStyles.includes(source.style) ? source.style : defaults.style;
    const modeSizes = {};
    for (const mode of visualSizeModes) {
      const saved = source.sizes?.[mode];
      const oldSize = legacy ? legacy[2] : source.size;
      modeSizes[mode] = visualSizes.includes(saved) ? saved :
        !source.sizes && mode === style && visualSizes.includes(oldSize) ? oldSize : defaults.sizes[mode];
    }
    settings[asset] = {
      style, sizes: modeSizes, size: modeSizes[style] || modeSizes.center,
      position: visualPositions.includes(source.position) ? source.position : defaults.position,
      anchor: visualAssets.includes(source.anchor) && source.anchor !== asset ? source.anchor : defaults.anchor,
    };
  }
  settings.order = [...new Set([...(Array.isArray(input.order) ? input.order.filter(asset => visualAssets.includes(asset)) : visualDefaults.order), ...visualDefaults.order])];
  // Invalid stored cycles become an unanchored corner visual; UI prevents creating them.
  for (const asset of visualAssets) {
    if (settings[asset].style === 'badge' && !canAnchor(settings, asset, settings[asset].anchor)) {
      settings[asset].style = 'corner';
      settings[asset].size = settings[asset].sizes.corner;
    }
  }
  return settings;
};
export const normalizeVisualProfiles = (input = {}) => ({
  nodes: normalizeVisualSettings(input.nodes || input), items: normalizeVisualSettings(input.items || input),
});
export const moveVisualLayer = (input, asset, direction, visibleAssets = visualAssets) => {
  const settings = normalizeVisualSettings(input), index = settings.order.indexOf(asset);
  const visible = settings.order.filter(entry => visibleAssets.includes(entry));
  const target = visible[visible.indexOf(asset) + direction], next = settings.order.indexOf(target);
  if (index >= 0 && next >= 0 && visible.includes(asset)) [settings.order[index], settings.order[next]] = [settings.order[next], settings.order[index]];
  return settings;
};
export const imageBackground = (resource, settings = {}) => {
  if (['transparent', 'checkerboard'].includes(settings.imageBackground)) return settings.imageBackground;
  return resource?.type === 'image' && resource?.kind !== 'node' ? 'checkerboard' : 'transparent';
};
export const rulePosition = (rule) => rule.style === 'center' ? 'center' : `${rule.style}:${rule.position}`;
export const visualAnchorRegions = rules => [...new Set(rules.filter(rule => rule && visualAssets.includes(rule.asset) && rule.style !== 'badge' && rule.style !== 'hidden').map(rulePosition))];
const regionAnchor = (rule, rules) => {
  const target = visualAssets.includes(rule.anchor) ? rules.find(other => other && other.asset === rule.anchor && other.style !== 'badge' && other.style !== 'hidden') : null;
  const anchor = target ? rulePosition(target) : rule.anchor;
  return visualAnchorRegions(rules).includes(anchor) ? anchor : 'item';
};
export const normalizeVisualRules = (rules) => {
  const normalized = rules.filter(rule => rule && visualAssets.includes(rule.asset)).map((rule, index) => ({
  asset: rule.asset, style: ['center', 'corner', 'badge'].includes(rule.style) ? rule.style : 'center',
  size: visualSizes.includes(rule.size) ? rule.size : 'medium',
  position: visualPositions.includes(rule.position) ? rule.position : 'top-left',
  priority: Number.isInteger(Number(rule.priority)) && Number(rule.priority) > 0 ? Number(rule.priority) : index + 1,
  anchor: regionAnchor(rule, rules),
  }));
  return normalized;
};
export const toVisualRules = (value = {}) => {
  if (Array.isArray(value.rules)) return normalizeVisualRules(value.rules);
  if (!visualAssets.some(asset => value[asset]) && !value.baseMode) return [{ asset: 'base', style: 'center', size: 'medium', position: 'top-left', anchor: 'item', priority: 1 }];
  const settings = normalizeVisualSettings(value), rules = [];
  for (const asset of [...settings.order].reverse()) {
    const option = settings[asset];
    if (option.style === 'hidden') continue;
    rules.push({ asset, style: option.style, size: option.size, position: option.position, anchor: option.anchor });
  }
  // Preserve the old missing-image fallback explicitly rather than moving assets at runtime.
  for (const rule of [...rules]) if (rule.style === 'corner' && !rules.some(other => other.asset === rule.asset && other.style === 'center')) {
    rules.splice(rules.indexOf(rule), 0, { ...rule, style: 'center', size: settings[rule.asset].sizes.center });
  }
  return normalizeVisualRules(rules);
};
export const selectVisualRules = (rules, available) => {
  const assets = new Set(), positions = new Set(), selected = [];
  rules.map((rule, index) => ({ rule, index })).sort((a, b) => (a.rule.priority ?? a.index + 1) - (b.rule.priority ?? b.index + 1) || a.index - b.index).forEach(({ rule, index }) => {
    const position = rulePosition(rule);
    if (!available[rule.asset] || assets.has(rule.asset) || positions.has(position)) return;
    assets.add(rule.asset); positions.add(position); selected.push({ ...rule, ruleIndex: index, z: rules.length - index });
  });
  return selected;
};
const sizes = { small: 25, medium: 50, large: 75, max: 100 };
const placedBox = (style, position, sizeName, compact = false) => {
  const badgeSizes = compact ? { small: 60, medium: 60, large: 70, max: 70 } : { small: 15, medium: 20, large: 25, max: 30 };
  const displaySize = compact ? (['small', 'medium'].includes(sizeName) ? 'large' : 'max') : sizeName;
  const size = style === 'badge' ? badgeSizes[sizeName] : sizes[displaySize], center = style === 'center';
  const margin = Math.min(3, (100 - size) / 2);
  return { x: center ? (100 - size) / 2 : position.endsWith('right') ? 100 - margin - size : margin,
    y: center ? (100 - size) / 2 : position.startsWith('bottom') ? 100 - margin - size : margin, width: size, height: size };
};
const containBox = (box, ratio) => {
  if (!Number.isFinite(ratio) || ratio <= 0) return box;
  const width = ratio >= 1 ? box.width : box.width * ratio;
  const height = ratio >= 1 ? box.height / ratio : box.height;
  return { x: box.x + (box.width - width) / 2, y: box.y + (box.height - height) / 2, width, height };
};
const attachBadge = (box, anchor, position, attached) => {
  const insetX = attached ? Math.min(box.width * .2, anchor.width / 2) : 0;
  const insetY = attached ? Math.min(box.height * .2, anchor.height / 2) : 0;
  return { ...box,
    x: Math.max(0, Math.min(100 - box.width, (position.endsWith('right') ? anchor.x + anchor.width - insetX : anchor.x + insetX) - box.width / 2)),
    y: Math.max(0, Math.min(100 - box.height, (position.startsWith('bottom') ? anchor.y + anchor.height - insetY : anchor.y + insetY) - box.height / 2)),
  };
};
export const resolveResourceVisual = (resource = {}, { settings = {}, background, availableAssets = {}, allowImage = true, imageFailed = false, open = false, imageRatio = 1, iconRatios = {}, compact = false, alignBaseStart = false } = {}) => {
  const profile = resource.kind === 'node' || !resource.kind ? 'nodes' : 'items';
  const options = normalizeVisualSettings(settings[profile] || settings);
  const assets = {
    base: open ? (resource.openIcon && resource.closedIcon === resource.icon ? resource.openIcon : ({ 'fas fa-folder': 'fas fa-folder-open', 'fas fa-box': 'fas fa-box-open', 'fas fa-tag': 'fas fa-tags', 'fas fa-users-rectangle': 'fas fa-users-viewfinder', 'fas fa-diagram-predecessor': 'fas fa-diagram-successor', 'icon-folder': 'icon-folder-open' }[resource.icon] || resource.icon || 'fas fa-file')) : resource.icon || 'fas fa-file',
    identity: resource.badgeIcon || '', image: allowImage && !imageFailed ? resource.image || '' : '',
  };
  for (const asset of visualAssets) if (availableAssets[asset] === false) assets[asset] = '';
  if (options.rules) {
    const layers = selectVisualRules(options.rules, assets).map(rule => ({ ...rule, icon: rule.asset === 'image' ? '' : assets[rule.asset], src: rule.asset === 'image' ? assets.image : '' }));
    for (const layer of layers.filter(layer => layer.style !== 'badge')) {
      let box = placedBox(layer.style, layer.position, layer.size, compact);
      box = containBox(box, layer.asset === 'image' ? imageRatio : iconRatios[layer.icon] || 1);
      if (compact && alignBaseStart && layer.asset === 'base' && layer.style === 'center') box.x = 0;
      layer.box = box;
    }
    for (const layer of layers.filter(layer => layer.style === 'badge')) {
      const target = layers.find(other => other !== layer && other.style !== 'badge' && rulePosition(other) === layer.anchor);
      const anchor = target?.box || { x: 0, y: 0, width: 100, height: 100 };
      const box = attachBadge(placedBox('badge', layer.position, layer.size, compact), anchor, layer.position, Boolean(target) && !compact);
      layer.box = layer.asset === 'image' ? containBox(box, imageRatio) : box;
    }
    return { layers, background: imageBackground(resource, { imageBackground: background || 'auto' }) };
  }
  const layers = visualAssets.filter(asset => assets[asset] && options[asset].style !== 'hidden').map(asset => ({
    asset, icon: asset !== 'image' ? assets[asset] : '', src: asset === 'image' ? assets.image : '',
    ...options[asset], z: options.order.indexOf(asset) + 1,
  }));
  if (!layers.some(layer => layer.style !== 'badge')) {
    const base = layers.find(layer => layer.asset === 'base');
    if (base) { base.style = 'center'; base.size = options.base.sizes.center; }
    else layers.push({ asset: 'base', icon: assets.base, src: '', style: 'center', size: options.base.sizes.center, position: 'top-left', anchor: '', z: options.order.indexOf('base') + 1 });
  }
  // Keep stored corner choices while centering compositions without a central asset.
  if (!layers.some(layer => layer.style.startsWith('center'))) {
    for (const layer of layers) if (layer.style === 'corner') {
      layer.style = 'center';
      layer.size = options[layer.asset].sizes.center;
    }
  }
  const boxes = new Map();
  const place = (layer) => {
    if (boxes.has(layer.asset)) return boxes.get(layer.asset);
    let box = placedBox(layer.style, layer.position, layer.size, compact);
    if (layer.style === 'badge') {
      const target = layers.find(other => other.asset === layer.anchor) ||
        layers.filter(other => other.asset !== layer.asset && other.style !== 'badge').sort((a,b) => sizes[b.size] - sizes[a.size])[0];
      const anchor = target ? place(target) : { x: 4, y: 4, width: 92, height: 92 };
      box = attachBadge(box, anchor, layer.position, Boolean(target) && !compact);
    }
    if (layer.asset === 'image') box = containBox(box, imageRatio);
    else if (layer.style !== 'badge') box = containBox(box, iconRatios[layer.icon] || 1);
    if (compact && alignBaseStart && layer.asset === 'base' && layer.style === 'center') box.x = 0;
    boxes.set(layer.asset, box);
    return box;
  };
  for (const layer of layers) layer.box = place(layer);
  return { layers, background: imageBackground(resource, background ? { imageBackground: background } : options) };
};
