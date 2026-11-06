/** Include an action hint only when the rendered control can perform that action. */
export function overlayTooltip(overlay, action, t) {
  const lines = [overlay.label, ...(overlay.tooltipLines || [])];
  if (action) {
    const key = { publish: 'JLIB_HTML_PUBLISH_ITEM', unpublish: 'JLIB_HTML_PUBLISHED_UNPUBLISH',
      unarchive: 'JLIB_HTML_UNPUBLISH_ITEM', restore: 'COM_SMARTBROWSER_ACTION_RESTORE',
      feature: 'JGLOBAL_TOGGLE_FEATURED', unfeature: 'JGLOBAL_TOGGLE_FEATURED' }[action.id];
    if (key) lines.push(t(key));
  }
  return lines.filter(Boolean).join('\n');
}
