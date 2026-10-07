export const itemMenuActions = (actions, resource, available, defaultAction = null) => {
  if (!resource?.actionable) return defaultAction ? [{ ...defaultAction, isDefault: true }] : [];

  const selection = [resource];
  const result = [];
  const renderedGroups = new Set();

  for (const action of actions || []) {
    if (!action.requiresSelection) continue;
    if (action.id === 'checkin' && !available(action, selection)) continue;
    if (action.id === 'removeFromGroup' && !available(action, selection)) continue;
    if (!action.exclusiveGroup) {
      result.push(action);
      continue;
    }
    if (renderedGroups.has(action.exclusiveGroup)) continue;
    renderedGroups.add(action.exclusiveGroup);

    const group = actions.filter((candidate) => candidate.requiresSelection && candidate.exclusiveGroup === action.exclusiveGroup);
    const enabled = group.find((candidate) => available(candidate, selection));
    const overlayAction = resource.overlays?.find((overlay) => group.some((candidate) => candidate.id === overlay.action))?.action;
    result.push(enabled || group.find((candidate) => candidate.id === overlayAction) || group[0]);
  }

  return defaultAction ? [{ ...defaultAction, isDefault: true }, ...result.filter(action => action.id !== defaultAction.id)] : result;
};
