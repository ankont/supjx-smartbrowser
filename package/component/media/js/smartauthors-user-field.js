(function () {
  const isSmartAuthorsUser = (input) => {
    const name = input?.name || '';
    return name.includes('[smartauthors]') && (
      name.endsWith('[owner_id]') || (name.includes('[contributors]') && name.endsWith('[user_id]'))
    );
  };

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('joomla-field-user .button-select');
    const field = button?.closest('joomla-field-user');
    const input = field?.querySelector('.field-user-input');
    if (!button || !field || !isSmartAuthorsUser(input) || !window.SmartBrowserPicker) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const user = await window.SmartBrowserPicker.open({
      adapter: 'users',
      selectionTarget: 'item',
      allowedResourceTypes: ['user'],
      multiple: false,
      allowNoUser: !field.querySelector('.field-user-input-name')?.required,
    });
    const id = user?.id?.match(/^user:(\d+)$/)?.[1];
    if (!id) return;

    const name = field.querySelector('.field-user-input-name');
    if (typeof field.setValue === 'function') field.setValue(id, user.title);
    else {
      input.value = id;
      if (name) name.value = user.title;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    input.value = id;
    if (name) name.value = user.title;
  }, true);
}());
