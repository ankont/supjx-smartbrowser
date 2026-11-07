// History shares the existing node preference, without changing saved selections.
export function createNodeHistory(storage, key, root = '') {
  let data;
  try { data = JSON.parse(storage.getItem(key) || '{}'); } catch {}
  data = { ...data, trail: Array.isArray(data?.trail) ? data.trail.slice(-10) : [], cursor: Number.isInteger(data?.cursor) ? data.cursor : -1 };
  const allowed = entry => entry && typeof entry.id === 'string' && typeof entry.title === 'string' && (!root || entry.id === root || entry.parents?.includes(root));
  data.trail = data.trail.filter(allowed);
  data.cursor = Math.min(data.cursor, data.trail.length - 1);
  let previousId = data.previousId || data.trail[data.cursor - 1]?.id;
  const save = () => {
    while (data.trail.length > 1 && new TextEncoder().encode(JSON.stringify(data.trail)).length > 22000) {
      const index = data.cursor === 0 ? data.trail.length - 1 : 0;
      data.trail.splice(index, 1);
      if (index < data.cursor) data.cursor--;
    }
    let current = {}; try { current = JSON.parse(storage.getItem(key) || '{}'); } catch {}
    storage.setItem(key, JSON.stringify({ ...current, trail: data.trail, cursor: data.cursor, previousId }));
  };
  return {
    entries: () => data.trail.filter((entry, index) => index !== data.cursor && data.trail.findIndex(other => other.id === entry.id) === index).slice().reverse(),
    previous: () => data.trail.find(entry => entry.id === previousId) || null,
    visit(id, breadcrumb = []) {
      if (!id) return;
      const title = breadcrumb.map(part => part.title || part.name || '').filter(Boolean).join(' \u00bb ').slice(0, 1600);
      if (!title) return;
      const entry = { id, title, parents: breadcrumb.map(part => part.id).filter(value => typeof value === 'string').slice(0, 64).map(value => value.slice(0, 240)) };
      if (!allowed(entry)) return;
      if (data.trail[data.cursor]?.id === id) return;
      previousId = data.trail[data.cursor]?.id;
      data.trail = [...data.trail.filter(other => other.id !== id), entry].slice(-10);
      data.cursor = data.trail.length - 1; save();
    },
    back() { const index = data.trail.findIndex(entry => entry.id === previousId); if (index < 0) return null; previousId = data.trail[data.cursor]?.id; data.cursor = index; save(); return data.trail[data.cursor]; },
    remove(id) {
      const currentId = data.trail[data.cursor]?.id;
      data.trail = data.trail.filter(entry => entry.id !== id);
      data.cursor = data.trail.findIndex(entry => entry.id === currentId);
      if (previousId === id) previousId = null;
      save();
    },
    clear() { data.trail = []; data.cursor = -1; previousId = null; save(); },
  };
}
