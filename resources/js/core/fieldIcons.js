export const fieldIcons = {
  title: null, name: null, alias: 'icon-link', status: 'icon-check-circle', stateLabel: 'icon-check-circle',
  author: 'icon-user', category: 'icon-folder', categoryPath: 'icon-folder', parent: 'icon-folder', parentPath: 'icon-folder', location: 'icon-folder', locationPath: 'icon-folder', tagPaths: 'icon-tags',
  created: 'icon-calendar', modified: 'icon-calendar', registered: 'icon-calendar', lastVisit: 'icon-clock',
  language: 'icon-globe', languageKey: 'icon-language', id: 'icon-key', access: 'icon-lock',
  size: 'icon-database', dimension: 'icon-expand', width: 'icon-expand', ordering: 'icon-sort',
  menu: 'icon-menu', menuItemType: 'icon-file-alt', shortcut: 'icon-link', url: 'icon-link', link: 'icon-link',
  username: 'icon-user', email: 'icon-envelope', groups: 'icon-users', tags: 'icon-tags',
  mimeType: 'icon-file-alt', extension: 'icon-tag', type: 'icon-file-alt',
};

export const iconForField = (field) => field.icon || field.headerIcon
  || fieldIcons[field.id || String(field.source || '').split('.').pop()]
  || (field.format === 'date' ? 'icon-calendar' : 'icon-info');
