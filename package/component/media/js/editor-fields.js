(() => {
  const form = document.getElementById('adminForm');
  if (!form) return;

  const busy = document.querySelector('.smartbrowser-editor-busy');
  form.addEventListener('submit', (event) => {
    if (event.defaultPrevented || !form.checkValidity() || !busy) return;
    busy.hidden = false;
    queueMicrotask(() => { if (event.defaultPrevented) busy.hidden = true; });
  });
  form.addEventListener('invalid', () => { if (busy) busy.hidden = true; }, true);
  window.addEventListener('pageshow', () => { if (busy) busy.hidden = true; });

  const targets = {
    com_categories: { type: 'category', adapter: 'categories', selectionTarget: 'node' },
    com_tags: { type: 'tag', adapter: 'tags', selectionTarget: 'node' },
    com_menus: { type: 'menu-item', adapter: 'menus', selectionTarget: 'node' },
    com_users: { type: 'user', adapter: 'users', selectionTarget: 'item' },
  };
  let active = null;
  let dialog;
  let frame;
  let pickerHeading;
  let editorDirty = false;

  const targetFor = (source) => {
    const url = new URL(source, window.location.href);
    const option = url.searchParams.get('option');
    if (option === 'com_content') {
      const category = url.searchParams.get('view') === 'categories'
        || (url.searchParams.get('task') || '').startsWith('category.');
      return category
        ? { type: 'category', adapter: 'categories', selectionTarget: 'node' }
        : { type: 'article', adapter: 'flat-articles', selectionTarget: 'item' };
    }
    return targets[option] || null;
  };

  const ensureDialog = () => {
    if (dialog) return;
    dialog = document.createElement('dialog');
    dialog.className = 'com-smartbrowser-editor-picker';
    pickerHeading = document.createElement('div');
    pickerHeading.className = 'smartbrowser-picker-heading';
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'btn-close';
    close.setAttribute('aria-label', Joomla.Text?._('JCLOSE') || 'Close');
    close.addEventListener('click', () => dialog.close());
    frame = document.createElement('iframe');
    frame.title = Joomla.Text?._('JSELECT') || 'Select';
    frame.addEventListener('load', onFrameLoad);
    window.SmartBrowserDialogDismiss.install(dialog, () => active?.kind === 'edit' && editorDirty);
    dialog.append(pickerHeading, close, frame);
    dialog.addEventListener('close', () => {
      frame.removeAttribute('src');
      active = null;
    });
    document.body.append(dialog);
  };

  const open = (url, context) => {
    ensureDialog();
    active = context;
    editorDirty = false;
    dialog.classList.toggle('is-menu-type', context.kind === 'menu-type');
    pickerHeading.textContent = context.title || '';
    frame.src = url.toString();
    dialog.showModal();
  };

  const openSelection = (target, field) => {
    const url = new URL(form.dataset.browserUrl, window.location.href);
    url.searchParams.set('adapter', target.adapter);
    url.searchParams.set('mode', 'select');
    url.searchParams.set('selectionTarget', target.selectionTarget);
    url.searchParams.set('showAdapterSwitcher', '0');
    if (target.type === 'media') {
      const selected = window.SmartBrowserMediaValue.selectionLocation(field.querySelector('.field-media-input')?.value);
      if (selected.node) {
        url.searchParams.set('node', selected.node);
        url.searchParams.set('initialResource', selected.resourceId);
      }
    }
    open(url, { kind: 'select', target, field });
  };

  const openEditor = (target, field, source, id) => {
    const url = new URL(form.dataset.editorUrl, window.location.href);
    const original = new URL(source, window.location.href);
    url.searchParams.set('type', target.type);
    url.searchParams.set('id', String(id));
    for (const key of ['extension', 'parent_id', 'menutype', 'catid']) {
      if (original.searchParams.has(key)) url.searchParams.set(key, original.searchParams.get(key));
    }
    open(url, { kind: 'edit', target, field, created: id === 0 });
  };

  const setSelection = (field, resource) => {
    const id = resource.id.match(/:(\d+)$/)?.[1];
    if (!id) return false;
    if (field.matches('joomla-field-user')) {
      const value = field.querySelector('.field-user-input');
      const name = field.querySelector('.field-user-input-name');
      if (!value || !name) return false;
      value.value = id;
      name.value = resource.title;
      value.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    const value = field.querySelector('.js-input-value');
    const title = field.querySelector('.js-input-title');
    if (!value || !title) return false;
    value.value = id;
    title.value = resource.title;
    value.dispatchEvent(new Event('change', { bubbles: true }));
    field.querySelectorAll('[data-show-when-value]').forEach((button) => {
      button.hidden = button.dataset.showWhenValue === '';
    });
    return true;
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || !form.contains(button) || button.disabled) return;
    const user = button.closest('joomla-field-user');
    if (user && button.matches('.button-select')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openSelection(targets.com_users, user);
      return;
    }
    const media = button.closest('joomla-field-media');
    if (media && button.matches('.button-select')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openSelection({ type: 'media', adapter: 'media', selectionTarget: 'item' }, media);
      return;
    }
    const field = button.closest('.js-modal-content-select-field');
    const action = button.dataset.buttonAction;
    if (!field || !['select', 'create', 'edit'].includes(action)) return;
    let config;
    try { config = JSON.parse(button.dataset.modalConfig || '{}'); } catch { return; }
    if (!config.src) return;
    const source = new URL(config.src, window.location.href);
    if (action === 'select' && source.searchParams.get('view') === 'menutypes') {
      event.preventDefault();
      event.stopImmediatePropagation();
      open(source, { kind: 'menu-type', title: config.textHeader || '' });
      return;
    }
    const target = targetFor(config.src);
    if (!target) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (action === 'select') openSelection(target, field);
    else openEditor(target, field, config.src, action === 'edit' ? Number(field.querySelector('.js-input-value')?.value || 0) : 0);
  }, true);

  document.addEventListener('smartbrowser:select', (event) => {
    if (!active || active.kind !== 'select') return;
    const resource = event.detail?.resources?.[0];
    if (!resource || event.detail.adapter !== active.target.adapter) return;
    if (active.target.type === 'media') {
      if (typeof active.field.setValue !== 'function') return;
      const value = window.SmartBrowserMediaValue.format(resource, 'joomla');
      if (!value) return;
      active.field.setValue(value);
    } else if (!setSelection(active.field, resource)) return;
    dialog.close();
  });

  document.addEventListener('DOMContentLoaded', () => {
    const menuTypeField = form.querySelector('#jform_type')?.closest('.js-modal-content-select-field');
    if (menuTypeField) {
      const title = menuTypeField.querySelector('.js-input-title');
      const value = menuTypeField.querySelector('.js-input-value');
      title?.removeAttribute('name');
      if (value && form.dataset.menuItemType) value.value = form.dataset.menuItemType;
      if (title && form.dataset.menuItemTypeTitle) title.value = form.dataset.menuItemTypeTitle;
    }
    if (!window.customElements?.whenDefined) return;
    customElements.whenDefined('joomla-tab').then(() => requestAnimationFrame(() => {
      const tab = document.getElementById('smartbrowserEditorTabs');
      const list = tab?.querySelector(':scope > [role="tablist"]');
      const card = tab?.closest('.main-card');
      if (!list || !card) return;
      const arrows = ['prev', 'next'].map((direction) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `smartbrowser-tab-scroll smartbrowser-tab-scroll-${direction}`;
        button.title = direction === 'prev' ? 'Previous tabs' : 'Next tabs';
        button.setAttribute('aria-label', button.title);
        const icon = document.createElement('span');
        icon.className = direction === 'prev' ? 'fas fa-chevron-left' : 'fas fa-chevron-right';
        icon.setAttribute('aria-hidden', 'true');
        button.append(icon);
        button.addEventListener('click', () => list.scrollBy({ left: direction === 'prev' ? -260 : 260, behavior: 'smooth' }));
        card.append(button);
        return button;
      });
      const update = () => {
        const overflow = tab.getAttribute('view') === 'tabs' && list.scrollWidth > list.clientWidth + 2;
        arrows.forEach((button) => { button.hidden = !overflow; });
        arrows[0].disabled = list.scrollLeft <= 1;
        arrows[1].disabled = list.scrollLeft + list.clientWidth >= list.scrollWidth - 1;
      };
      const revealDropdown = (choices) => {
        const panel = choices.closest('[role="tabpanel"]');
        const dropdown = choices.querySelector('.choices__list--dropdown');
        if (!panel || !dropdown || !choices.classList.contains('is-open')) return;
        requestAnimationFrame(() => {
          const overflow = dropdown.getBoundingClientRect().bottom - panel.getBoundingClientRect().bottom;
          if (overflow > 0) panel.scrollTop += overflow + 8;
        });
      };
      new MutationObserver((records) => {
        for (const record of records) {
          if (record.target instanceof Element && record.target.matches('.choices.is-open')) {
            revealDropdown(record.target);
          }
        }
      }).observe(tab, { attributes: true, attributeFilter: ['class'], subtree: true });
      const revealTab = (button) => {
        if (!button || tab.getAttribute('view') !== 'tabs') return;
        const visible = list.getBoundingClientRect();
        const selected = button.getBoundingClientRect();
        const start = visible.left + 38;
        const end = visible.right - 38;
        const delta = selected.left < start ? selected.left - start
          : selected.right > end ? selected.right - end : 0;
        if (delta) list.scrollBy({ left: delta, behavior: 'smooth' });
      };
      list.addEventListener('scroll', update);
      list.addEventListener('click', (event) => {
        const button = event.target.closest('button[role="tab"]');
        if (button) requestAnimationFrame(() => revealTab(button));
      });
      list.addEventListener('keyup', () => requestAnimationFrame(() => {
        revealTab(list.querySelector('button[role="tab"][aria-selected="true"]'));
      }));
      new ResizeObserver(update).observe(list);
      new MutationObserver(update).observe(tab, { attributes: true, attributeFilter: ['view'] });
      update();
    }));
  });

  function onFrameLoad() {
    if (active?.kind !== 'edit') return;
    editorDirty = false;
    window.SmartBrowserDialogDismiss.watchFrame(frame, () => { editorDirty = true; });
    let completed;
    try {
      completed = new URL(frame.contentWindow.location.href);
      if (completed.searchParams.get('done') !== '1') return;
    } catch { return; }
    const { target, field, created } = active;
    dialog.close();
    if (created && completed.searchParams.get('cancelled') !== '1') openSelection(target, field);
  }
})();
