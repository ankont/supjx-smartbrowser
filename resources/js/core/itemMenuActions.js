export const itemMenuActions = (actions, resource, available, defaultAction = null, modifiedAction = null) => {
  if (!resource?.actionable) return defaultAction ? [{ ...defaultAction, isDefault: true }] : [];

  const selection = [resource];
  const result = [];
  const renderedGroups = new Set();

  for (const action of actions || []) {
    if (resource.collectionActions && !action.collectionCommand && !resource.collectionActions.some(candidate => candidate.id === action.id)) continue;
    if (!action.requiresSelection) continue;
    if (action.trashedOnly && resource.status !== -2) continue;
    if (action.id === 'trash' && resource.status === -2) continue;
    if (action.id === 'checkin' && !available(action, selection)) continue;
    if (action.id === 'removeFromGroup' && !available(action, selection)) continue;
    if (!action.exclusiveGroup) {
      result.push(action);
      continue;
    }
    if (renderedGroups.has(action.exclusiveGroup)) continue;
    renderedGroups.add(action.exclusiveGroup);

    const group = actions.filter((candidate) => candidate.requiresSelection && candidate.exclusiveGroup === action.exclusiveGroup
      && !(candidate.id === 'trash' && resource.status === -2));
    const enabled = group.find((candidate) => available(candidate, selection));
    const overlayAction = resource.overlays?.find((overlay) => group.some((candidate) => candidate.id === overlay.action))?.action;
    result.push(enabled || group.find((candidate) => candidate.id === overlayAction) || group[0]);
  }

  if (modifiedAction && !result.some(action => action.id === modifiedAction.id) && modifiedAction.id !== defaultAction?.id) result.push(modifiedAction);
  const entries = defaultAction ? [{ ...defaultAction, isDefault: true }, ...result.filter(action => action.id !== defaultAction.id)] : result;
  return entries.map(action => !action.isDefault && action.id === modifiedAction?.id ? { ...action, isModified: true } : action);
};
