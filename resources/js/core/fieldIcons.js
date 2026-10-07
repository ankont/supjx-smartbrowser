export const fieldIcons = {
  title: null, name: null, alias: 'fas fa-link', status: 'fas fa-check-circle', stateLabel: 'fas fa-check-circle',
  author: 'fas fa-user', category: 'fas fa-folder', categoryPath: 'fas fa-folder', parent: 'fas fa-folder', parentPath: 'fas fa-folder', location: 'fas fa-folder', locationPath: 'fas fa-folder', tagPaths: 'fas fa-tags',
  created: 'fas fa-calendar', modified: 'fas fa-calendar', registered: 'fas fa-calendar', lastVisit: 'fas fa-clock',
  language: 'fas fa-globe', languageKey: 'fas fa-language', id: 'fas fa-key', access: 'fas fa-lock',
  size: 'fas fa-database', dimension: 'fas fa-expand', width: 'fas fa-expand', ordering: 'fas fa-sort',
  menu: 'fas fa-bars', menuItemType: 'fas fa-file-alt', shortcut: 'fas fa-link', url: 'fas fa-link', link: 'fas fa-link',
  username: 'fas fa-user', email: 'fas fa-envelope', groups: 'fas fa-users', tags: 'fas fa-tags',
  mimeType: 'fas fa-file-alt', extension: 'fas fa-tag', type: 'fas fa-file-alt',
};

export const iconForField = (field) => field.icon || field.headerIcon
  || fieldIcons[field.id || String(field.source || '').split('.').pop()]
  || (field.format === 'date' ? 'fas fa-calendar' : 'fas fa-info');
