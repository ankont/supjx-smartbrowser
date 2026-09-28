export const createViewRegistry = () => {
  const views = new Map();

  return {
    register(definition) {
      if (!definition.id || !definition.component) throw new TypeError('A view requires an id and component.');
      views.set(definition.id, Object.freeze({ supportsSize: false, controls: [], options: {}, ...definition }));
      return this;
    },
    get(id) { return views.get(id); },
    all() { return Array.from(views.values()); },
    has(id) { return views.has(id); },
  };
};
