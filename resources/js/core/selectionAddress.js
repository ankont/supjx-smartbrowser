const propertyName = /^[a-zA-Z][a-zA-Z0-9_.-]*$/;
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const reserved = new Set(['ext.selectionAddress']);
const encode = value => encodeURIComponent(String(value)).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
const queryText = entries => entries.map(([key, value]) => `${encode(key)}=${encode(value)}`).join('&');
const readQuery = text => {
  if (/%(?![a-fA-F0-9]{2})/.test(text)) throw new TypeError('Invalid address percent encoding.');
  const entries = [...new URLSearchParams(text)];
  if (entries.some(([key]) => !key || /[\u0000-\u001f\u007f]/.test(key))) throw new TypeError('Invalid address properties.');
  return entries;
};
export function safeAddressUrl(value, allowEmpty = false) {
  if (typeof value !== 'string' || (!allowEmpty && !value) || /[\u0000-\u0020\u007f<>"\\]/.test(value)
    || /%(?![a-fA-F0-9]{2})/.test(value) || /[\u0000-\u001f\u007f]/.test(decodeURIComponent(value))
    || /^[^/?#]*:/.test(value) && !/^(?:https?:\/\/|mailto:|tel:)/i.test(value) || value.startsWith('//')) throw new TypeError('Unsafe resource URL.');
  if (/^https?:/i.test(value)) {
    const url = new URL(value);
    if (!url.hostname || url.username || url.password) throw new TypeError('Unsafe resource URL.');
  }
  return value;
}
export function mediaReference(locator) {
  const slash = locator.indexOf('/');
  const filesystem = locator.slice(0, slash), path = decodeURIComponent(locator.slice(slash));
  let additional = path;
  try { additional = decodeURIComponent(path); } catch { /* A literal percent sign is a valid filename character. */ }
  if (slash < 1 || !/^[a-zA-Z0-9_.-]+$/.test(filesystem) || /[\\\u0000-\u001f\u007f]/.test(path)
    || path.split('/').some(part => ['.', '..'].includes(part)) || additional.split('/').includes('..')) throw new TypeError('Invalid media locator.');
  return { adapter: 'media', id: `${filesystem}:${path}` };
}
export function mediaLocator(reference) {
  const match = /^([a-zA-Z0-9_.-]+):(\/.*)$/.exec(reference.id || '');
  if (!match) throw new TypeError('Invalid media reference.');
  const locator = match[1] + match[2].split('/').map(encode).join('/');
  mediaReference(locator);
  return locator;
}

/** Syntax and property codecs only. Resource access remains with the existing adapters. */
export function createSelectionAddressContract() {
  const formats = new Map(), codecs = new Map(), properties = new Map();
  const listeners = new Set();
  const notify = () => { for (const listener of listeners) { try { listener(); } catch (error) { console.error(error); } } };
  const itemAdapters = new Map(Object.entries({ article: ['articles', 'featured-articles', 'articles-by-tag'], category: ['categories', 'articles'], tag: ['tags', 'articles-by-tag'], 'menu-item': ['menus'], user: ['users'] }));
  const register = (registry, name, definition) => {
    if (!propertyName.test(name) || registry.has(name)) throw new TypeError(`Address registration conflict: ${name}`);
    registry.set(name, definition);
    notify();
    return () => { if (registry.get(name) === definition) { registry.delete(name); notify(); } };
  };
  const api = {
    formats: () => [...formats.keys()],
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    getFormat: name => formats.has(name) ? { ...formats.get(name) } : null,
    registerFormat(name, definition, { replace = false } = {}) {
      if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(name) || typeof definition?.reference !== 'function') throw new TypeError('An address format requires a reference handler.');
      if (replace && formats.has(name)) {
        const previous = formats.get(name);
        formats.set(name, definition);
        notify();
        return () => { if (formats.get(name) === definition) { formats.set(name, previous); notify(); } };
      }
      return register(formats, name, definition);
    },
    registerCodec(name, codec) {
      if (typeof codec?.encode !== 'function' || typeof codec?.decode !== 'function') throw new TypeError('An address codec requires encode/decode.');
      return register(codecs, name, codec);
    },
    registerProperty(definition) { return register(properties, definition.key, definition); },
    registerItemType(type, adapters) { return register(itemAdapters, type, adapters); },
    parse(value) {
      const input = String(value || '').trim();
      if (!input || input.length > 262144 || /[\r\n]/.test(input)) throw new TypeError('Invalid selection address.');
      const markers = [...input.matchAll(/#([a-zA-Z][a-zA-Z0-9]*):\/\//g)];
      const marker = markers.reverse().find(match => formats.has(match[1]));
      if (!marker) {
        if (markers.length) throw new TypeError(`Unsupported address format: ${markers[0][1]}`);
        return { format: 'joomlaLink', url: safeAddressUrl(input), locator: '', properties: [], plain: true };
      }
      const url = safeAddressUrl(input.slice(0, marker.index), true);
      const suffix = input.slice(marker.index + marker[0].length);
      const question = suffix.indexOf('?');
      const locator = question < 0 ? suffix : suffix.slice(0, question);
      if (/[#\s\\]/.test(locator) || /%(?![a-fA-F0-9]{2})/.test(locator)) throw new TypeError('Invalid address locator.');
      return { format: marker[1], url, locator, properties: question < 0 ? [] : readQuery(suffix.slice(question + 1)) };
    },
    parseLines(text) {
      if (String(text).length > 4194304) throw new TypeError('Selection address input is too large.');
      const result = [], errors = [];
      String(text).split(/\r?\n/).forEach((line, index) => {
        if (!line.trim()) return;
        try { result.push({ ...api.parse(line), line: index + 1 }); }
        catch (error) { errors.push(`Line ${index + 1}: ${error.message}`); }
      });
      if (!result.length && !errors.length) errors.push('No selection addresses.');
      if (errors.length) throw new TypeError(errors.join('\n'));
      if (result.length > 500) throw new TypeError('A collection supports at most 500 addresses.');
      return result;
    },
    serialize({ format, url = '', locator = '', properties = [] }) {
      if (!formats.has(format)) throw new TypeError(`Unsupported address format: ${format}`);
      safeAddressUrl(url, format !== 'joomlaLink');
      const result = `${url}#${format}://${locator}${properties.length ? `?${queryText(properties)}` : ''}`;
      api.parse(result);
      return result;
    },
    reference(address, context = {}) {
      if (!formats.has(address.format)) throw new TypeError('Unsupported address format.');
      return formats.get(address.format).reference(address, context);
    },
    assertResource(address, resource) {
      if (formats.get(address.format)?.validate?.(resource, address) === false) throw new TypeError('Resource does not support this address format.');
    },
    describe(resource, { format, nativeAddress } = {}) {
      const supplied = resource.selectionAddress;
      let result = supplied || formats.get(format || defaultFormat(resource))?.describe?.(resource);
      if (!result) throw new TypeError('This resource has no address provider.');
      result = { ...result, format: format || result.format, properties: [...(result.properties || [])] };
      if (!formats.has(result.format)) throw new TypeError('Unsupported address format.');
      if (nativeAddress && result.format === 'joomlaImage') {
        const native = api.parse(nativeAddress);
        if (native.plain) return { ...result, url: native.url };
        if (native.format !== 'joomlaImage' || mediaReference(native.locator).id !== resource.id) throw new TypeError('Native image identity does not match selection.');
        result = native;
      }
      return result;
    },
    descriptors(resource, profile = {}, format = defaultFormat(resource)) {
      const result = [], names = new Set(), keys = new Set();
      const formatNames = formats.get(format)?.propertyNames || [];
      for (const definition of [...(resource.selectionCapabilities || []), ...properties.values()]) {
        if (profile[definition.key] === false || (!own(profile, definition.key) && !definition.key?.startsWith('ext.'))) continue;
        const policy = typeof profile[definition.key] === 'object' ? profile[definition.key] : {};
        const address = { ...definition.address, ...policy?.address };
        const name = address.name || definition.key;
        if (!propertyName.test(name) || names.has(name) || keys.has(definition.key) || formatNames.includes(name)) throw new TypeError(`Address property conflict: ${name}`);
        names.add(name); keys.add(definition.key);
        result.push({ ...definition, ...address, name });
      }
      return result;
    },
    async encodeProperties(resource, profile, usage, context = {}) {
      const descriptors = api.descriptors(resource, profile, context.format).filter(definition => !(context.addressConsumed && definition.key === 'ext.address'));
      const retained = usage['ext.selectionAddress'] || {};
      const output = [...(retained.properties || [])];
      const used = new Set([...descriptors.flatMap(d => [d.name, d.name.split('.')[0]]), ...output.map(([key]) => key.split('.')[0])]);
      for (const key of Object.keys(usage)) {
        if (reserved.has(key) || context.addressConsumed && key === 'ext.address' || descriptors.some(d => d.key === key) || usage[key] == null) continue;
        if (typeof usage[key] === 'object') throw new TypeError(`No address codec for property: ${key}`);
        if (!key.startsWith('ext.')) throw new TypeError(`Unsupported address property: ${key}`);
        if (used.has(key)) throw new TypeError(`Address property conflict: ${key}`);
        used.add(key); output.push([key, scalar(usage[key])]);
      }
      for (const definition of descriptors) {
        const value = usage[definition.key];
        if (value == null) continue;
        if (output.some(([key]) => key === definition.name)) throw new TypeError(`Address property conflict: ${definition.name}`);
        if (!definition.codec) {
          if (['string', 'number', 'boolean'].includes(definition.type) && typeof value !== definition.type) throw new TypeError(`Invalid address property type: ${definition.name}`);
          output.push([definition.name, definition.values?.[String(value)] ?? scalar(value)]);
          continue;
        }
        const codec = codecs.get(definition.codec);
        if (!codec) throw new TypeError(`Unsupported address codec: ${definition.codec}`);
        const seed = /^[a-z]$/i.test(definition.alias || '') ? definition.alias : definition.name[0].toLowerCase();
        let alias = seed, index = 1;
        while (used.has(alias)) alias = seed + index++;
        used.add(alias);
        const components = await codec.encode(value, { ...context, definition, preserved: retained.compounds?.[definition.key] });
        if (!components.length) throw new TypeError('Empty compound address property.');
        output.push([definition.name, alias], ...components.map(([key, part]) => [`${alias}.${key}`, String(part)]));
      }
      return output;
    },
    async decodeProperties(address, resource, profile, context = {}) {
      const descriptors = api.descriptors(resource, profile, address.format), usage = {}, claimed = new Set(), aliases = new Set(), compounds = {};
      for (const definition of descriptors) {
        const positions = address.properties.flatMap(([key], index) => key === definition.name ? [index] : []);
        if (!positions.length) continue;
        if (positions.length > 1) throw new TypeError(`Duplicate address property: ${definition.name}`);
        const position = positions[0], raw = address.properties[position][1];
        claimed.add(position);
        if (!definition.codec) { usage[definition.key] = parseScalar(raw, definition); continue; }
        const codec = codecs.get(definition.codec);
        if (!codec || !/^[a-zA-Z][a-zA-Z0-9]*$/.test(raw) || aliases.has(raw) || descriptors.some(d => d.name === raw || d.name.startsWith(`${raw}.`))) throw new TypeError(`Invalid compound alias: ${raw}`);
        aliases.add(raw);
        const components = [];
        address.properties.forEach(([key, value], index) => {
          if (key.startsWith(`${raw}.`)) { claimed.add(index); components.push([key.slice(raw.length + 1), value]); }
        });
        const decoded = await codec.decode(components, { ...context, definition });
        usage[definition.key] = decoded.value;
        if (decoded.preserved !== undefined) compounds[definition.key] = decoded.preserved;
      }
      const remaining = address.properties.filter((_, index) => !claimed.has(index));
      // Unregistered properties stay textual; they do not become unvalidated usage capabilities.
      return { usage, remaining, compounds };
    },
  };
  const filesystem = format => ({
    propertyNames: format === 'joomlaImage' ? ['width', 'height'] : format === 'joomlaMedia' ? ['mediaType'] : [],
    reference: address => mediaReference(address.locator),
    validate: (resource, address) => format === 'joomlaImage' ? resource.type === 'image'
      : format === 'joomlaFolder' ? resource.kind === 'node'
        : format === 'joomlaFile' ? resource.kind === 'item'
          : ['audio', 'video'].includes(resource.type) && address.properties.filter(([key]) => key === 'mediaType').length <= 1
            && !address.properties.some(([key, value]) => key === 'mediaType' && value !== resource.type),
    describe(resource) {
      const metadata = resource.metadata || {};
      const properties = [];
      if (format === 'joomlaImage') for (const key of ['width', 'height']) if (Number(metadata[key]) > 0) properties.push([key, String(metadata[key])]);
      if (format === 'joomlaMedia') properties.push(['mediaType', resource.type]);
      return { format, locator: mediaLocator(resource.selection || resource), url: format === 'joomlaFolder' ? metadata.publicUrl || '' : metadata.relativePath || metadata.url || '', properties };
    },
  });
  for (const format of ['joomlaImage', 'joomlaFile', 'joomlaFolder', 'joomlaMedia']) api.registerFormat(format, filesystem(format));
  api.registerFormat('joomlaItem', {
    propertyNames: ['adapter'],
    reference(address, context) {
      const match = /^([a-z][a-z0-9-]*)\/([1-9][0-9]*)$/.exec(address.locator);
      const adapters = match && itemAdapters.get(match[1]);
      const allowed = context.allowedAdapters || [];
      const hints = address.properties.filter(([key]) => key === 'adapter');
      if (hints.length > 1) throw new TypeError('Duplicate adapter hint.');
      const adapter = hints.length ? adapters?.find(id => id === hints[0][1] && (!allowed.length || allowed.includes(id)))
        : adapters?.find(id => !allowed.length || allowed.includes(id));
      if (!adapter) throw new TypeError('Unsupported or disallowed Joomla resource type.');
      return { adapter, id: `${match[1]}:${match[2]}` };
    },
    describe: resource => {
      const adapters = itemAdapters.get(resource.id.split(':')[0]) || [];
      return { format: 'joomlaItem', locator: resource.id.replace(':', '/'),
        url: resource.metadata?.publicUrl || (resource.status === 1 && (resource.type === 'menu-item' || resource.type === 'tag') ? resource.metadata?.url || '' : ''),
        properties: resource.adapter && adapters.includes(resource.adapter) && resource.adapter !== adapters[0] ? [['adapter', resource.adapter]] : [] };
    },
  });
  api.registerFormat('joomlaLink', {
    propertyNames: ['name'],
    reference(address, context) {
      if (address.locator) throw new TypeError('A link address must have an empty locator.');
      if (address.properties.filter(([key]) => key === 'name').length > 1) throw new TypeError('Duplicate link name.');
      if (!context.linkReference) throw new TypeError('No link reference provider.');
      return context.linkReference(safeAddressUrl(address.url));
    },
    describe: resource => ({ format: 'joomlaLink', locator: '', url: resource.metadata?.url || resource.metadata?.link || '', properties: resource.metadata?.linkName ? [['name', resource.metadata.linkName]] : [] }),
  });
  api.registerFormat('joomlaGallery', {
    reference() { throw new TypeError('No gallery address provider is installed.'); },
    describe: resource => ({ format: 'joomlaGallery', locator: resource.metadata?.galleryLocator || '', url: resource.metadata?.publicUrl || '' }),
  });
  api.registerCodec('joomlaImage', {
    async encode(value, context) {
      let native;
      if (typeof value === 'string') native = api.parse(value);
      else if (context.preserved) {
        native = api.parse(context.preserved);
        if (mediaReference(native.locator).id !== value.id) native = null;
      }
      if (!native) {
        const image = await context.resolveReference(value, context.definition.picker || {});
        if (!image || image.unavailable || image.selectable === false || image.type !== 'image') throw new TypeError('Unavailable compound image.');
        native = api.describe(image, { format: 'joomlaImage' });
      }
      if (native.format !== 'joomlaImage' || !native.url) throw new TypeError('A Joomla image requires src and media components.');
      mediaReference(native.locator);
      return [['src', native.url], ['media', native.locator], ...native.properties.map(([key, part]) => [imageKeys.has(key) ? key : `param.${key}`, part])];
    },
    async decode(parts, context) {
      const values = new Map(), parameters = [];
      for (const [key, value] of parts) {
        if (['src', 'media'].includes(key)) {
          if (values.has(key)) throw new TypeError('Duplicate compound image component.');
          values.set(key, value);
        } else if (imageKeys.has(key)) parameters.push([key, value]);
        else if (key.startsWith('param.') && key.length > 6) parameters.push([key.slice(6), value]);
        else throw new TypeError(`Unknown image component: ${key}`);
      }
      if (!values.get('src') || !values.get('media')) throw new TypeError('Missing compound image src or media.');
      const reference = mediaReference(values.get('media'));
      const preserved = api.serialize({ format: 'joomlaImage', url: values.get('src'), locator: values.get('media'), properties: parameters });
      return { value: context.definition.type === 'resource' ? reference : preserved, preserved };
    },
  });
  return api;
}
const imageKeys = new Set(['width', 'height', 'crop', 'ratio', 'zoom']);
const scalar = value => {
  if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' && Number.isFinite(value)) return String(value);
  throw new TypeError('A structured property requires a registered address codec.');
};
const parseScalar = (value, definition) => {
  if (definition.values) {
    const entry = Object.entries(definition.values).find(([, text]) => text === value);
    if (!entry) throw new TypeError(`Unsupported value for ${definition.name}`);
    value = entry[0];
  }
  if (definition.type === 'boolean') {
    if (!['true', 'false'].includes(value)) throw new TypeError('Invalid boolean property.');
    return value === 'true';
  }
  if (definition.type === 'number') {
    if (!value.trim() || !Number.isFinite(Number(value))) throw new TypeError('Invalid numeric property.');
    return Number(value);
  }
  if (!['string', undefined].includes(definition.type)) throw new TypeError('A structured property requires an address codec.');
  return value;
};
const defaultFormat = resource => resource.type === 'image' ? 'joomlaImage' : resource.type === 'folder' ? 'joomlaFolder'
  : ['audio', 'video'].includes(resource.type) ? 'joomlaMedia' : resource.adapter === 'media' || resource.type === 'document' ? 'joomlaFile'
    : resource.type === 'uri' || resource.adapter === 'direct-links' ? 'joomlaLink' : resource.type === 'gallery' ? 'joomlaGallery' : 'joomlaItem';
export const selectionAddress = createSelectionAddressContract();
