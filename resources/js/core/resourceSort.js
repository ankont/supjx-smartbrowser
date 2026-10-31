export const compareResources = (field, direction) => (left, right) => {
  if (field === 'ordering' && left.type === 'article' && right.type === 'article' && left.parentId !== right.parentId && left.metadata?.locationPath && right.metadata?.locationPath) {
    const group = left.metadata.locationPath.localeCompare(right.metadata.locationPath);
    if (group) return direction === 'asc' ? group : -group;
  }
  const value = resource => field === 'title' ? String(resource.title || '').toLocaleLowerCase()
    : field === 'location' ? resource.metadata?.locationPath || resource.metadata?.location || resource.metadata?.categoryPath || resource.metadata?.parentPath || resource.metadata?.parent || ''
    : field === 'ordering' ? resource.metadata?.hierarchyOrder ?? resource.metadata?.ordering
    : field === 'dimension' ? (resource.metadata?.width || 0) * (resource.metadata?.height || 0) : resource.metadata?.[field];
  const a = value(left), b = value(right);
  const result = typeof a === 'string' ? (a || '').localeCompare(b || '') : (a || 0) - (b || 0);
  return direction === 'asc' ? result : -result;
};
