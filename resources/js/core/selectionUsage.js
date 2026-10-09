const keyPattern = /^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/;
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const copy = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));
const empty = value => value === null || value === undefined || typeof value === 'string' && !value.trim();
const builtinEditors = new Set(['text', 'textarea', 'boolean', 'select', 'number', 'resource']);
import { normalizeReference, resourceKey } from './selectionIdentity.js';
export { normalizeReference } from './selectionIdentity.js';

export const capabilityDisabled = (definition, values) => Boolean(definition.disabledWhen && own(values || {}, definition.disabledWhen.key) && values[definition.disabledWhen.key] === definition.disabledWhen.equals);

export function applicableCapabilities(resource, profile = {}) {
  if (!resource || resource.unavailable || !profile || typeof profile !== 'object') return [];
  const definitions = Array.isArray(resource.selectionCapabilities) ? resource.selectionCapabilities : [];
  const seen = new Set();
  return definitions.flatMap(definition => {
    const key = definition?.key;
    if (!keyPattern.test(key || '') || !['string', 'boolean', 'number', 'resource', 'object'].includes(definition.type)
      || seen.has(key) || !own(profile, key) || profile[key] === false) return [];
    seen.add(key);
    const policy = profile[key] && typeof profile[key] === 'object' ? profile[key] : {};
    return [{ ...definition, policy, presentation: ['secondary', 'hidden'].includes(policy.presentation) ? policy.presentation : 'primary',
      default: own(policy, 'default') ? policy.default : definition.default,
      required: policy.required === true,
    }];
  });
}

export function valueError(definition, value) {
  if (empty(value)) return definition.required ? 'COM_SMARTBROWSER_USAGE_REQUIRED' : null;
  const type = definition.type;
  if (type === 'string' && typeof value !== 'string' || type === 'boolean' && typeof value !== 'boolean'
    || type === 'number' && (typeof value !== 'number' || !Number.isFinite(value))
    || type === 'object' && (typeof value !== 'object' || Array.isArray(value))
    || type === 'resource' && !normalizeReference(value)) return 'COM_SMARTBROWSER_USAGE_INVALID';
  const rules = [definition.validation || {}, definition.policy?.constraints || {}];
  for (const rule of rules) {
    if (typeof value === 'string' && (rule.maxLength != null && [...value].length > rule.maxLength
      || rule.minLength != null && [...value].length < rule.minLength)) return 'COM_SMARTBROWSER_USAGE_INVALID';
    if (typeof value === 'number' && (rule.min != null && value < rule.min || rule.max != null && value > rule.max
      || rule.integer === true && !Number.isInteger(value))) return 'COM_SMARTBROWSER_USAGE_INVALID';
    if (Array.isArray(rule.allowedValues) && !rule.allowedValues.includes(value)) return 'COM_SMARTBROWSER_USAGE_INVALID';
    if (rule.pattern && typeof value === 'string') {
      try { if (!new RegExp(rule.pattern, 'u').test(value)) return 'COM_SMARTBROWSER_USAGE_INVALID'; }
      catch { return 'COM_SMARTBROWSER_USAGE_INVALID'; }
    }
  }
  if (Array.isArray(definition.options) && !definition.options.some(option => option.value === value)) return 'COM_SMARTBROWSER_USAGE_INVALID';
  return null;
}

export function createSelectionUsage({ profile = {}, initialUsage = {}, resolveReference, editors = {} } = {}) {
  const values = new Map();
  const definitions = resource => applicableCapabilities(resource, profile);
  function get(resource) {
    if (!resource) return {};
    const key = resourceKey(resource);
    if (!values.has(key)) values.set(key, resource.unavailable ? copy(initialUsage[key] || {}) : {});
    const state = values.get(key);
    for (const definition of definitions(resource)) {
      if (!own(state, definition.key)) state[definition.key] = copy(own(initialUsage[key] || {}, definition.key)
        ? initialUsage[key][definition.key] : definition.default ?? null);
    }
    for (const definition of definitions(resource)) {
      if (capabilityDisabled(definition, state)) state[definition.key] = copy(definition.inactiveValue ?? null);
    }
    return copy(state);
  }
  function set(resource, key, value) {
    if (!definitions(resource).some(definition => definition.key === key)) return;
    get(resource);
    values.get(resourceKey(resource))[key] = copy(value);
    get(resource);
  }
  async function validate(resources) {
    const errors = {};
    const profileErrors = {};
    const usage = {};
    for (const resource of resources) {
      const key = resourceKey(resource);
      const current = get(resource);
      const result = {};
      for (const definition of definitions(resource)) {
        const value = current[definition.key];
        let error = valueError(capabilityDisabled(definition, current) ? { ...definition, required: false } : definition, value);
        if (!error && definition.type === 'resource' && !empty(value)) {
          const reference = normalizeReference(value);
          const picker = definition.picker || {};
          if (picker.adapter && reference.adapter !== picker.adapter || picker.allowedAdapters?.length && !picker.allowedAdapters.includes(reference.adapter)) error = 'COM_SMARTBROWSER_USAGE_INVALID';
          else {
            try {
              const resolved = await resolveReference(reference, picker);
              if (!resolved || resolved.unavailable || resolved.selectable === false
                || picker.selectionTarget === 'item' && resolved.kind !== 'item'
                || picker.selectionTarget === 'node' && resolved.kind !== 'node'
                || picker.allowedResourceTypes?.length && !picker.allowedResourceTypes.includes(resolved.type)) error = 'COM_SMARTBROWSER_USAGE_INVALID';
            } catch { error = 'COM_SMARTBROWSER_USAGE_INVALID'; }
          }
        }
        const editor = editors[definition.editor];
        if (definition.presentation !== 'hidden' && !builtinEditors.has(definition.editor) && !editor) error = 'COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE';
        if (!error && editor?.validate) {
          try { error = await editor.validate(value, { definition, resource, values: current }) || null; }
          catch { error = 'COM_SMARTBROWSER_USAGE_INVALID'; }
        }
        if (error) {
          errors[key] ||= {};
          errors[key][definition.key] = error;
          if (definition.presentation === 'hidden') {
            profileErrors[key] ||= {};
            profileErrors[key][definition.key] = error;
          }
        }
        result[definition.key] = definition.type === 'resource' && !empty(value) ? normalizeReference(value) : value;
      }
      usage[key] = resource.unavailable ? current : result;
    }
    return { valid: !Object.keys(errors).length, errors, profileErrors, usage };
  }
  return { definitions, get, set, validate };
}
