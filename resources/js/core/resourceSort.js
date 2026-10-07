export const compareResources = (field, direction) => (left, right) => {
  const value = resource => field === 'title' ? String(resource.title || '').toLocaleLowerCase()
    : field === 'dimension' ? (resource.metadata?.width || 0) * (resource.metadata?.height || 0) : resource.metadata?.[field];
  const a = value(left), b = value(right);
  const result = typeof a === 'string' ? (a || '').localeCompare(b || '') : (a || 0) - (b || 0);
  return direction === 'asc' ? result : -result;
};
