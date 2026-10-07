(() => {
  const normalize = value => {
    value = value.trim();
    if (/^fa-[a-z0-9-]+$/.test(value)) value = 'fas ' + value;
    return /^(fas|far|fab|fa-solid|fa-regular|fa-brands) fa-[a-z0-9-]+$/.test(value) ? value : '';
  };
  const update = root => {
    const saved = {};
    for (const input of root.querySelectorAll('input[data-role]')) {
      const value = normalize(input.value);
      input.setCustomValidity(input.value.trim() && !value ? Joomla.Text._('COM_SMARTBROWSER_ICON_INVALID') : '');
      input.closest('.sb-icon-row').querySelector('[data-icon-preview]').className = value || input.dataset.default;
      if (value && value !== input.dataset.default) (saved[input.dataset.adapter] ||= {})[input.dataset.role] = value;
    }
    const hidden = root.querySelector('[data-icon-value]');
    hidden.value = JSON.stringify(saved);
    hidden.dispatchEvent(new Event('change', { bubbles: true }));
  };
  document.addEventListener('input', event => {
    if (event.target.matches('.sb-icon-settings input[data-role]')) update(event.target.closest('.sb-icon-settings'));
  });
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-icon-reset]');
    if (!button) return;
    const root = button.closest('.sb-icon-settings');
    if (!root) return;
    button.closest('.sb-icon-row').querySelector('input[data-role]').value = '';
    update(root);
  });
})();
