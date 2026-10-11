(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const frontend = document.getElementById('fieldset-context_site');
    const explanation = frontend?.querySelector(':scope > .form-grid > .tab-description');
    if (explanation) frontend.before(explanation);
    const integration = document.getElementById('fieldset-integration_general');
    const controls = integration?.querySelector(':scope > .form-grid');
    if (controls) integration.replaceWith(controls);
    const replacement = document.querySelector('input[name="jform[replace_all]"]')?.closest('.control-group');
    if (replacement) {
      const group = document.createElement('fieldset');
      group.className = 'options-menu options-form';
      const legend = document.createElement('legend');
      legend.className = 'sb-integration-legend';
      const label = replacement.querySelector('.control-label label');
      const nativeSwitch = replacement.querySelector('.controls fieldset');
      if (label && nativeSwitch) {
        const switchHost = document.createElement('span');
        for (const attribute of nativeSwitch.attributes) switchHost.setAttribute(attribute.name, attribute.value);
        const switcher = nativeSwitch.querySelector('.switcher');
        const inlineSwitch = document.createElement('span');
        for (const attribute of switcher.attributes) inlineSwitch.setAttribute(attribute.name, attribute.value);
        inlineSwitch.append(...switcher.childNodes);
        switchHost.append(inlineSwitch);
        legend.append(label, switchHost);
        nativeSwitch.remove();
        replacement.querySelector('.control-label').remove();
      } else {
        legend.textContent = replacement.querySelector('label')?.textContent || '';
      }
      replacement.before(group);
      group.append(legend, replacement);
      const explanation = controls?.querySelector('.alert.alert-info');
      if (explanation) {
        const icon = document.createElement('span');
        icon.className = 'icon-info-circle';
        icon.setAttribute('aria-hidden', 'true');
        explanation.prepend(icon, document.createTextNode(' '));
        group.append(explanation.closest('.control-group') || explanation);
      }
      for (const name of ['fields', 'editor_buttons', 'resource_editors', 'navigation']) {
        const section = document.getElementById(`fieldset-integration_${name}`);
        if (section) group.append(section);
      }
    }
    const transparency = document.getElementById('jform_image_background')?.closest('.control-group');
    const appearance = transparency?.closest('fieldset');
    if (appearance) appearance.before(transparency);
  });
  const updateIntegrations = () => {
    const replacement = document.querySelector('input[name="jform[replace_all]"]:checked');
    if (!replacement) return;
    for (const group of ['fields', 'editor_buttons', 'resource_editors', 'navigation']) {
      const fieldset = document.getElementById(`fieldset-integration_${group}`);
      if (fieldset) fieldset.hidden = replacement.value === '1';
    }
  };
  document.addEventListener('DOMContentLoaded', updateIntegrations);
  document.addEventListener('change', event => {
    if (event.target.name === 'jform[replace_all]') updateIntegrations();
  });
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
