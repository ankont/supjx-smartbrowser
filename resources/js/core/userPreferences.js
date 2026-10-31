const validKey = key => typeof key === 'string' && /^[a-zA-Z][^\x00-\x20\x7f]{0,239}$/.test(key) && !['__proto__', 'constructor', 'prototype'].includes(key);

const resilientStorage = source => {
  const memory = new Map();
  const keys = () => {
    const result = new Set();
    try { for (let i = 0; i < source.length; i++) result.add(source.key(i)); } catch {}
    for (const [key, value] of memory) { if (value === null) result.delete(key); else result.add(key); }
    return [...result];
  };
  return {
    getItem(key) { if (memory.has(key)) return memory.get(key); try { return source?.getItem(key) ?? null; } catch { return null; } },
    setItem(key, value) { try { if (!source) throw Error(); source.setItem(key, value); memory.delete(key); } catch { memory.set(key, value); } },
    removeItem(key) { try { source?.removeItem(key); memory.delete(key); } catch { memory.set(key, null); } },
    key(index) { return keys()[index] ?? null; }, get length() { return keys().length; },
  };
};

export function createUserPreferenceStorage({ storage, context, send, schedule = callback => setTimeout(callback, 500) }) {
  storage = resilientStorage(storage);
  const prefix = `supjx.smartbrowser.user.${context.userId}.`;
  const generationKey = prefix + '$generation', pendingKey = prefix + '$pending';
  let pending = {}, timer = null, sending = false, stale = false;
  const clear = () => { const keys = []; for (let i = 0; i < storage.length; i++) { const key = storage.key(i); if (key?.startsWith(prefix)) keys.push(key); } keys.forEach(key => storage.removeItem(key)); };
  const sameGeneration = storage.getItem(generationKey) === context.generation;
  if (sameGeneration) { try { pending = JSON.parse(storage.getItem(pendingKey) || '{}'); } catch {} }
  clear();
  storage.setItem(generationKey, context.generation);
  for (const [key, value] of Object.entries({ ...context.values, ...pending })) if (validKey(key) && typeof value === 'string') storage.setItem(prefix + key, value);
  const current = () => storage.getItem(generationKey) === context.generation;
  const retain = () => { if (current()) storage.setItem(pendingKey, JSON.stringify(pending)); };
  retain();
  const queue = () => { if (timer == null && !stale && context.userId) timer = schedule(() => { timer = null; void flush(); }); };
  const flush = async () => {
    if (sending || stale || !current() || !context.userId || !Object.keys(pending).length) return;
    const batch = {}; let size = 0;
    for (const [key, value] of Object.entries(pending)) { const next = new TextEncoder().encode(JSON.stringify([key, value])).length; if ((size + next > 48000 && size) || Object.keys(batch).length >= 100) break; batch[key] = value; size += next; }
    sending = true;
    try {
      await send({ generation: context.generation, changes: batch });
      for (const [key, value] of Object.entries(batch)) if (pending[key] === value) delete pending[key];
      retain();
    } catch (error) {
      if (error.status === 409) { stale = true; pending = {}; if (current()) clear(); }
      // Keep an unsent patch locally for the next visit; never overwrite another user's cache.
      return;
    } finally { sending = false; }
    if (Object.keys(pending).length) queue();
  };
  const api = {
    getItem(key) { return validKey(key) && current() ? storage.getItem(prefix + key) : null; },
    setItem(key, value) { if (!validKey(key) || stale || !current()) return; value = String(value); if (storage.getItem(prefix + key) === value) return; storage.setItem(prefix + key, value); pending[key] = value; retain(); queue(); },
    removeItem(key) { if (!validKey(key) || stale || !current()) return; storage.removeItem(prefix + key); pending[key] = null; retain(); queue(); },
    key(index) { const keys = []; for (let i = 0; i < storage.length; i++) { const key = storage.key(i); if (key?.startsWith(prefix) && validKey(key.slice(prefix.length))) keys.push(key.slice(prefix.length)); } return keys[index] ?? null; },
    get length() { let count = 0; while (api.key(count) !== null) count++; return count; },
    flush,
  };
  queue();
  return api;
}

export function preferenceStorage(win = globalThis.window) {
  let context = win?.Joomla?.getOptions?.('com_smartbrowser.preferences');
  if (!context || typeof context.userId !== 'number') return win?.localStorage;
  let owner = win;
  try { if (win.parent !== win && win.parent.Joomla?.getOptions?.('com_smartbrowser.preferences')?.userId === context.userId) { owner = win.parent; context = owner.Joomla.getOptions('com_smartbrowser.preferences'); } } catch {}
  const identity = `${context.userId}:${context.generation}`;
  if (owner.__smartbrowserPreferences?.identity === identity) return owner.__smartbrowserPreferences.storage;
  let backing;
  try { backing = owner.localStorage; } catch {}
  const storage = createUserPreferenceStorage({ storage: backing, context, schedule: callback => owner.setTimeout(callback, 500), send: async payload => {
    const response = await owner.fetch(context.apiUrl, { method: 'POST', credentials: 'same-origin', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, [context.csrfToken]: 1 }) });
    if (!response.ok) throw Object.assign(new Error('Preferences could not be saved.'), { status: response.status });
    const result = await response.json(); if (result.success === false) throw new Error('Preferences could not be saved.');
  } });
  owner.__smartbrowserPreferences = { identity, storage };
  owner.addEventListener('pagehide', () => void storage.flush());
  return storage;
}
