import { canActOnResource, canSelectResource } from './resourcePolicy.js';

const browseOpen = () => ({ id: 'browseOpen', label: 'COM_SMARTBROWSER_OPEN', icon: 'fas fa-folder-open', local: true });
const pickerSelect = () => ({ id: 'pickerSelect', label: 'COM_SMARTBROWSER_SELECT', icon: 'fas fa-check', local: true });
const leafAction = (resource, mode, actions, available, selectionTarget) => {
  if (resource?.kind !== 'node' || !resource.navigable || resource.hasChildren !== false || !resource.activatable) return null;
  if (mode === 'select') return actions.some(action => action.defaultOnLeaf === true) && canSelectResource(resource, selectionTarget)
    ? pickerSelect() : null;
  return mode === 'manage' && canActOnResource(resource)
    ? actions.find(action => action.defaultOnLeaf === true && available(action, [resource])) : null;
};

export const resourcePreviewAction = (resource, mode, actions, available) => ['manage', 'select'].includes(mode) && canActOnResource(resource)
  ? actions.find(action => action.id === 'preview' && available(action, [resource])) || null : null;

export function modifiedResourceAction(resource, mode, actions, available, selectionTarget = 'both') {
  if (leafAction(resource, mode, actions, available, selectionTarget)) return browseOpen();
  if (resource?.kind !== 'node') {
    const declared = ['manage', 'select'].includes(mode) && canActOnResource(resource)
      ? actions.find(action => action.modifiedDefault === true && available(action, [resource])) : null;
    return declared || resourcePreviewAction(resource, mode, actions, available);
  }
  if (mode === 'select') return canSelectResource(resource, selectionTarget)
    ? pickerSelect() : null;
  return mode === 'manage' && canActOnResource(resource)
    ? actions.find(action => action.id === 'edit' && available(action, [resource])) || null : null;
}

export function defaultResourceAction(resource, mode, actions, available, selectionTarget = 'both') {
  const leaf = leafAction(resource, mode, actions, available, selectionTarget);
  if (leaf) return leaf;
  if (resource?.navigable) return browseOpen();
  if (!resource?.activatable) return null;
  if (mode === 'select') return canSelectResource(resource, selectionTarget)
    ? pickerSelect() : null;
  if (!canActOnResource(resource)) return null;
  return actions.find(action => action.id === (mode === 'manage' ? 'edit' : 'preview') && available(action, [resource])) || null;
}
