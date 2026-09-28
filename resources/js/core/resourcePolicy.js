export const PRIMARY_ROLE = 'primary';
export const CONTEXTUAL_ROLE = 'contextual';

const withInteractionDefaults = (resource, defaults) => ({
  ...resource,
  focusable: resource.focusable ?? defaults.focusable,
  selectable: resource.selectable ?? defaults.selectable,
  bulkSelectable: resource.bulkSelectable ?? resource.selectable ?? defaults.bulkSelectable,
  actionable: resource.actionable ?? defaults.actionable,
  navigable: resource.navigable ?? defaults.navigable,
  activatable: resource.activatable ?? defaults.activatable,
});

export const asPrimaryResource = (resource) => withInteractionDefaults({
  ...resource,
  role: resource.role || PRIMARY_ROLE,
}, {
  focusable: true,
  selectable: false,
  bulkSelectable: false,
  actionable: true,
  navigable: false,
  activatable: true,
});

export const asContextualResource = (resource) => {
  return {
    ...resource,
    role: CONTEXTUAL_ROLE,
    focusable: resource.focusable ?? true,
    selectable: false,
    bulkSelectable: false,
    actionable: false,
    navigable: false,
    activatable: false,
    interactiveOverlays: false,
    capabilities: {},
  };
};

export const isContextualResource = (resource) => resource?.role === CONTEXTUAL_ROLE;

export const canFocusResource = (resource) => resource?.focusable === true;

export const canSelectResource = (resource, selectionTarget = 'both') => resource?.selectable === true
  && (selectionTarget === 'both' || resource.kind === selectionTarget);

export const canBulkSelectResource = (resource, selectionTarget = 'both') => canSelectResource(resource, selectionTarget)
  && resource?.bulkSelectable === true;

export const canActOnResource = (resource) => resource?.actionable === true;
