import { canActOnResource, canSelectResource } from './resourcePolicy.js';

export const resourcePreviewAction = (resource, mode, actions, available) => ['manage', 'select'].includes(mode) && canActOnResource(resource)
  ? actions.find(action => action.id === 'preview' && available(action, [resource])) || null : null;

export function modifiedResourceAction(resource, mode, actions, available, selectionTarget = 'both') {
  if (resource?.kind !== 'node') {
    const declared = ['manage', 'select'].includes(mode) && canActOnResource(resource)
      ? actions.find(action => action.modifiedDefault === true && available(action, [resource])) : null;
    return declared || resourcePreviewAction(resource, mode, actions, available);
  }
  if (mode === 'select') return canSelectResource(resource, selectionTarget)
    ? { id: 'pickerSelect', label: 'COM_SMARTBROWSER_SELECT', icon: 'fas fa-check', local: true } : null;
  return mode === 'manage' && canActOnResource(resource)
    ? actions.find(action => action.id === 'edit' && available(action, [resource])) || null : null;
}

export function defaultResourceAction(resource, mode, actions, available, selectionTarget = 'both') {
  if (resource?.navigable) return { id: 'browseOpen', label: 'COM_SMARTBROWSER_OPEN', icon: 'fas fa-folder-open', local: true };
  if (!resource?.activatable) return null;
  if (mode === 'select') return canSelectResource(resource, selectionTarget)
    ? { id: 'pickerSelect', label: 'COM_SMARTBROWSER_SELECT', icon: 'fas fa-check', local: true } : null;
  if (!canActOnResource(resource)) return null;
  return actions.find(action => action.id === (mode === 'manage' ? 'edit' : 'preview') && available(action, [resource])) || null;
}
