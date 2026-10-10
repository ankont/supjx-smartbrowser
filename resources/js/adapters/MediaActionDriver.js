import { createEditorSize } from '../core/editorSize.js';

export const previewKind = (resource) => {
  if (!resource.metadata?.url) return null;
  const mime = (resource.metadata.mimeType || '').toLowerCase();
  if (mime.startsWith('image/')) return 'image';
  if (/^video\/(mp4|webm|ogg)$/.test(mime)) return 'video';
  if (/^audio\/(mpeg|mp4|ogg|wav|webm)$/.test(mime)) return 'audio';
  if (mime === 'application/pdf') return 'pdf';
  return null;
};

export default class MediaActionDriver {
  constructor(api, state, reload, translate, editorMode = 'modal', application = 'administrator') {
    this.api = api;
    this.state = state;
    this.reload = reload;
    this.translate = translate;
    this.editorMode = editorMode;
    this.application = application;
    this.dialogs = new Set();
    this.dialogCleanups = new Map();
  }

  destroy() {
    this.destroyed = true;
    for (const dialog of this.dialogs) { this.dialogCleanups.get(dialog)?.(); dialog.remove(); }
    this.dialogs.clear();
    this.dialogCleanups.clear();
  }

  ownDialog(dialog, cleanup = () => {}) {
    if (this.destroyed) { cleanup(); dialog.remove(); return; }
    this.dialogs.add(dialog);
    this.dialogCleanups.set(dialog, cleanup);
    dialog.addEventListener('close', () => { cleanup(); this.dialogs.delete(dialog); this.dialogCleanups.delete(dialog); }, { once: true });
    document.body.appendChild(dialog);
  }

  available(action, selection) {
    if (this.destroyed) return false;
    if (action.selectionScoped && (!this.selectionHost || action.currentNode && !(this.selectionHost.canCreate
      ? this.selectionHost.canCreate(action.resourceType || 'uri') : this.selectionHost.canAdd(this.api.options.adapter, action.resourceType || 'uri')))) return false;
    if (action.currentNode && this.state.currentResource?.capabilities?.[action.id] === false) return false;
    if (action.requiresSelection && selection.length === 0) return false;
    if (action.single && selection.length !== 1) return false;
    if (action.itemsOnly && selection.some((resource) => resource.kind !== 'item')) return false;
    if (action.nodesOnly && selection.some((resource) => resource.kind !== 'node')) return false;
    if (action.exclusiveGroup && selection.length) {
      return selection.some((resource) => resource.capabilities?.[action.id] === true);
    }
    if (action.requiresSelection && selection.length) {
      return selection.every((resource) => resource.capabilities?.[action.id] === true);
    }
    return true;
  }

  async execute(action, selection) {
    if (this.state.busy) return;
    this.state.busy = true;
    try {
      return await this.executeUnchecked(action, selection);
    } catch (error) {
      Joomla.renderMessages({ error: [error.message] });
    } finally {
      this.state.busy = false;
    }
  }

  async executeUnchecked(action, selection) {
    if (!this.available(action, selection)) return;
    const targets = action.exclusiveGroup
      ? selection.filter((resource) => resource.capabilities?.[action.id] === true)
      : selection;
    const ids = targets.map((resource) => resource.id);

    if (action.id === 'upload') return this.pickUpload();
    if (action.id === 'createNode') {
      const name = await this.actionDialog({ title: 'COM_SMARTBROWSER_NEW_FOLDER_NAME', value: '' });
      if (name) await this.mutate(action.id, [], { nodeId: this.state.selectedNode, name });
      return;
    }
    if (action.currentNode) {
      const result = await this.api.execute(action.id, [], { nodeId: this.state.selectedNode });
      if (result?.command === 'selectionEditor') return this.selectionEditor(result, null);
      if (result?.command === 'openEditor') this.openEditor(result.url);
      else await this.reload();
      return;
    }
    if (action.id === 'rename') {
      const name = await this.actionDialog({ title: 'COM_SMARTBROWSER_RENAME_TO', value: selection[0].title });
      if (name && name !== selection[0].title) await this.mutate(action.id, ids, { name });
      return;
    }
    if (action.id === 'delete') {
      if (action.confirm === false || await this.actionDialog({ title: 'COM_SMARTBROWSER_DELETE', message: this.translate('COM_SMARTBROWSER_CONFIRM_DELETE'), accept: 'COM_SMARTBROWSER_DELETE', destructive: true })) {
        if (action.localState) this.selectionHost.remove(targets);
        else await this.mutate(action.id, ids);
      }
      return;
    }
    if (action.id === 'removeFromGroup') {
      const groups = Object.fromEntries(targets.map((resource) => [resource.id, resource.metadata?.sourceGroupId]));
      if (ids.some((id) => !groups[id])) return;
      if (await this.actionDialog({ title: 'COM_SMARTBROWSER_REMOVE_FROM_GROUP', message: this.translate('COM_SMARTBROWSER_CONFIRM_REMOVE_FROM_GROUP'), accept: 'COM_SMARTBROWSER_REMOVE_FROM_GROUP' })) {
        await this.mutate(action.id, ids, { groups });
      }
      return;
    }

    const resource = await this.api.execute(action.id, ids);
    if (resource?.command === 'selectionEditor') return this.selectionEditor(resource, targets[0]);
    if (resource?.command === 'previewUrl') {
      this.previewUrl(resource.url, resource.title);
      return;
    }
    if (resource?.command === 'openEditor') {
      this.openEditor(resource.url);
      return;
    }
    if (resource?.command === 'openUrl' && resource.url) {
      if (resource.target === '_self') {
        const url = new URL(resource.url, window.location.href);
        if (resource.returnToCurrent) {
          const returnUrl = window.location.href;
          url.searchParams.set('return', window.btoa(returnUrl));
        }
        if (resource.replace) window.location.replace(url.toString());
        else window.location.href = url.toString();
      } else window.open(resource.url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (resource?.command === 'copyText' && resource.text) {
      await navigator.clipboard.writeText(resource.text);
      Joomla.renderMessages({ success: [resource.text] });
      return;
    }
    if (action.id === 'preview') this.preview(resource);
    if (action.id === 'edit' && resource?.metadata?.mimeType) this.editMedia(resource);
    if (action.id === 'share') this.share(resource);
    if (action.id === 'download') this.download(resource);
    if (resource?.updated || resource?.deleted) await this.reload();
  }

  actionDialog({ title, message, value, accept = 'JTOOLBAR_SAVE', destructive = false }) {
    if (this.destroyed) return Promise.resolve(null);
    const text = value => { const decoder = document.createElement('textarea'); decoder.innerHTML = value; return decoder.value; };
    const dialog = document.createElement('dialog'); dialog.className = 'smartbrowser-editor smartbrowser-local-editor';
    const form = document.createElement('form');
    const heading = document.createElement('h3'); heading.textContent = text(this.translate(title)); form.append(heading);
    let input;
    if (value !== undefined) {
      const label = document.createElement('label'); label.textContent = text(this.translate('COM_SMARTBROWSER_NAME'));
      input = document.createElement('input'); input.type = 'text'; input.className = 'form-control'; input.value = value; input.required = true;
      label.append(input); form.append(label);
    } else {
      const paragraph = document.createElement('p'); paragraph.textContent = text(message || ''); form.append(paragraph);
    }
    const actions = document.createElement('div'); actions.className = 'smartbrowser-local-editor-actions';
    const submit = document.createElement('button'); submit.type = 'submit'; submit.className = destructive ? 'btn btn-danger' : 'btn btn-primary'; submit.textContent = text(this.translate(accept));
    const cancel = document.createElement('button'); cancel.type = 'button'; cancel.className = 'btn btn-danger'; cancel.textContent = text(this.translate('JCANCEL'));
    actions.append(submit, cancel); form.append(actions); dialog.append(form);
    cancel.addEventListener('click', () => dialog.close());
    window.SmartBrowserDialogDismiss?.install(dialog, () => input ? input.value !== value : false);
    return new Promise(resolve => {
      this.ownDialog(dialog, () => { dialog.remove(); resolve(null); });
      form.addEventListener('submit', event => {
        event.preventDefault(); if (!form.reportValidity() || this.destroyed) return;
        resolve(input ? input.value : true); dialog.close();
      });
      dialog.showModal();
      if (input) { input.focus(); input.select(); } else cancel.focus();
    });
  }

  async selectionEditor(definition, previous) {
    if (!this.selectionHost || this.destroyed) return;
    const dialog = document.createElement('dialog');
    dialog.className = 'smartbrowser-editor smartbrowser-local-editor';
    const form = document.createElement('form');
    const text = key => { const decoder = document.createElement('textarea'); decoder.innerHTML = this.translate(key); return decoder.value; };
    const title = document.createElement('h3'); title.textContent = text(definition.label); form.append(title);
    const inputs = new Map();
    for (const field of definition.fields || []) {
      if (field.type === 'hidden') {
        const input = document.createElement('input'); input.type = 'hidden';
        input.value = field.contextValue ? this.selectionHost.editorContext?.[field.contextValue] || field.value || '' : field.value || '';
        inputs.set(field.name, input); form.append(input); continue;
      }
      if (field.type === 'segmented') {
        const group = document.createElement('fieldset'); group.className = 'smartbrowser-local-editor-modes';
        const legend = document.createElement('legend'); legend.textContent = text(field.label); group.append(legend);
        const input = document.createElement('input'); input.type = 'hidden'; input.value = field.value || ''; group.append(input); inputs.set(field.name, input);
        const controls = document.createElement('div'); controls.className = 'btn-group'; group.append(controls);
        for (const choice of field.options || []) {
          const button = document.createElement('button'); button.type = 'button'; button.className = 'btn btn-outline-primary'; button.textContent = text(choice.label);
          button.dataset.value = choice.value; button.setAttribute('aria-pressed', String(choice.value === input.value));
          button.addEventListener('click', () => {
            input.value = choice.value;
            for (const candidate of controls.children) candidate.setAttribute('aria-pressed', String(candidate.dataset.value === input.value));
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }); controls.append(button);
        }
        form.append(group); continue;
      }
      const label = document.createElement('label'); label.textContent = text(field.label);
      const input = document.createElement(field.type === 'select' ? 'select' : 'input'); input.className = 'form-control';
      if (field.type === 'select') for (const choice of field.options || []) {
        const option = document.createElement('option'); option.value = choice.value; option.textContent = text(choice.label); input.append(option);
      }
      else input.type = 'text';
      input.value = field.value || ''; input.required = field.required === true; input.maxLength = field.maxlength || 2048;
      label.append(input); form.append(label); inputs.set(field.name, input);
      if (field.placeholder) input.placeholder = field.placeholder;
      if (field.hint) { const hint = document.createElement('small'); hint.className = 'text-muted'; hint.textContent = text(field.hint); label.append(hint); }
      if (field.warningPattern) {
        const warning = document.createElement('p'); warning.className = 'alert alert-warning'; warning.textContent = text('COM_SMARTBROWSER_LINK_WEB_WARNING');
        const refresh = () => { warning.hidden = !input.value || !new RegExp(field.warningPattern, 'i').test(input.value); };
        input.addEventListener('input', refresh); refresh(); label.append(warning);
      }
    }
    for (const field of definition.fields || []) {
      if (field.placeholderFrom && !field.computedPlaceholder) {
        const source = inputs.get(field.placeholderFrom);
        source?.addEventListener('input', () => { inputs.get(field.name).placeholder = source.value; });
      }
      if (field.type === 'select' && field.dependsOn) {
        const input = inputs.get(field.name);
        const refresh = () => {
          const previous = input.value; input.replaceChildren();
          for (const choice of field.options || []) {
            if (choice.parent !== inputs.get(field.dependsOn)?.value) continue;
            const option = document.createElement('option'); option.value = choice.value; option.textContent = text(choice.label); input.append(option);
          }
          if ([...input.options].some(option => option.value === previous)) input.value = previous;
        };
        refresh(); inputs.get(field.dependsOn)?.addEventListener('change', refresh);
      }
      if (!field.suggestions) continue;
      const list = document.createElement('datalist'); list.id = `smartbrowser-suggestions-${Math.random().toString(36).slice(2)}`;
      inputs.get(field.name).setAttribute('list', list.id); form.append(list);
      const refresh = () => {
        const source = typeof field.suggestions === 'string' ? this.selectionHost.editorContext?.suggestions?.[field.suggestions]
          : field.suggestionsBy ? field.suggestions[inputs.get(field.suggestionsBy)?.value] : field.suggestions;
        list.replaceChildren();
        for (const choice of Array.isArray(source) ? source.slice(0, 500) : []) {
          const option = document.createElement('option'); option.value = typeof choice === 'string' ? choice : choice.value;
          if (typeof choice === 'object' && choice.label) option.label = choice.label;
          list.append(option);
        }
      };
      refresh(); if (field.suggestionsBy) inputs.get(field.suggestionsBy)?.addEventListener('input', refresh);
    }
    const error = document.createElement('p'); error.className = 'text-danger'; error.setAttribute('role','alert'); form.append(error);
    const actions = document.createElement('div'); actions.className = 'smartbrowser-local-editor-actions';
    const save = document.createElement('button'); save.type = 'submit'; save.className = 'btn btn-primary'; save.textContent = text('JTOOLBAR_SAVE');
    const cancel = document.createElement('button'); cancel.type = 'button'; cancel.className = 'btn btn-danger'; cancel.textContent = text('JCANCEL');
    actions.append(save, cancel); form.append(actions); dialog.append(form);
    cancel.addEventListener('click', () => dialog.close());
    const initialValues = new Map([...inputs].map(([name, input]) => [name, input.value]));
    window.SmartBrowserDialogDismiss?.install(dialog, () => [...inputs].some(([name, input]) => input.value !== initialValues.get(name)));
    let placeholderTimer, placeholderVersion = 0;
    const computedField = definition.fields?.find(field => field.computedPlaceholder);
    const schedulePlaceholder = () => {
      clearTimeout(placeholderTimer);
      const version = ++placeholderVersion;
      if (!computedField || inputs.get(computedField.name).value) return;
      inputs.get(computedField.name).placeholder = '';
      placeholderTimer = setTimeout(async () => {
        if (this.destroyed || !dialog.isConnected) return;
        try {
          // The existing stateless resolver supplies the automatic title; this does not select or save an item.
          const payload = { nodeId: definition.nodeId, ...Object.fromEntries([...inputs].map(([key, input]) => [key, input.value])), [computedField.name]: '' };
          const result = await this.api.execute(definition.action, [], payload);
          if (version === placeholderVersion && dialog.isConnected && !this.destroyed) inputs.get(computedField.name).placeholder = result.resource.title;
        } catch { /* Invalid/incomplete input retains the provisional hint until corrected. */ }
      }, 300);
    };
    if (computedField) form.addEventListener('input', schedulePlaceholder);
    return new Promise(resolve => {
      this.ownDialog(dialog, () => { clearTimeout(placeholderTimer); placeholderVersion++; dialog.remove(); resolve(); });
      form.addEventListener('submit', async event => {
        event.preventDefault(); if (!form.reportValidity()) return;
        save.disabled = true; error.textContent = '';
        try {
          const payload = { nodeId: definition.nodeId, ...Object.fromEntries([...inputs].map(([key,input]) => [key,input.value])) };
          const result = await this.api.execute(definition.action, [], payload);
          if (this.destroyed) return;
          const next = this.selectionHost.replace({ ...result.resource, adapter: this.api.options.adapter.replace(/^flat-/, '') }, previous);
          dialog.close(); await this.reload();
          this.state.focusedId = next.selectionKey || next.id;
        } catch (failure) { error.textContent = this.translate(failure.message); }
        finally { save.disabled = false; }
      });
      dialog.showModal(); [...inputs.values()].find(input => input.type !== 'hidden')?.focus();
      schedulePlaceholder();
    });
  }

  canPreview(resource) {
    return !resource?.metadata?.mimeType || Boolean(previewKind(resource));
  }

  openEditor(url) {
    if (this.destroyed) return;
    if (this.editorMode === 'page') {
      const destination = new URL(url, window.location.href);
      if (this.application === 'site') {
        window.sessionStorage.setItem('supjx.smartbrowser.editorReturn', window.location.href);
        destination.searchParams.set('sbpage', '1');
        destination.searchParams.delete('tmpl');
      } else {
        if (destination.searchParams.has('view') && !destination.searchParams.has('task')) {
          destination.searchParams.set('layout', 'edit');
        } else {
          destination.searchParams.delete('layout');
        }
        destination.searchParams.delete('tmpl');
        destination.searchParams.set('return', window.btoa(window.location.href));
      }
      window.location.assign(destination.toString());
      return;
    }
    const dialog = document.createElement('dialog');
    dialog.className = 'smartbrowser-editor';
    dialog.innerHTML = `<iframe src="${this.escape(url)}" title="Editor"></iframe><div class="smartbrowser-editor-loading" role="status"><span class="spinner-border" aria-hidden="true"></span><span>${this.escape(this.translate('COM_SMARTBROWSER_WORKING'))}</span></div><button type="button" class="btn-close" aria-label="Close"></button>`;
    const size = createEditorSize(dialog, null, this.translate);
    const iframe = dialog.querySelector('iframe');
    const loading = dialog.querySelector('.smartbrowser-editor-loading');
    let initialLoadComplete = false;
    let dirty = false;
    iframe.addEventListener('load', () => {
      loading.hidden = true;
      size.bind(null);
      try {
        const toolbar = iframe.contentDocument?.querySelector('.smartbrowser-editor-actions, #toolbar');
        if (toolbar) {
          const button = iframe.contentDocument.createElement('button');
          button.type = 'button';
          button.className = 'btn btn-outline-secondary ms-auto smartbrowser-editor-size';
          button.innerHTML = '<span class="fas fa-expand" aria-hidden="true"></span>';
          toolbar.append(button);
          size.bind(button);
        }
      } catch {}
      try { iframe.contentWindow.addEventListener('beforeunload', () => { loading.hidden = false; }, { once: true }); } catch {}
      dirty = false;
      window.SmartBrowserDialogDismiss.watchFrame(iframe, () => { dirty = true; });
      if (!initialLoadComplete) {
        initialLoadComplete = true;
        return;
      }

      try {
        const frameUrl = new URL(iframe.contentWindow.location.href);
        const isLogin = (frameUrl.searchParams.get('option') === 'com_users' && frameUrl.searchParams.get('view') === 'login')
          || Boolean(iframe.contentDocument?.querySelector('form#login-form, .com-users-login'));
        if (isLogin) {
          window.top.location.assign(frameUrl.toString());
          return;
        }
        const task = frameUrl.searchParams.get('task') || '';
        const layout = frameUrl.searchParams.get('layout') || '';
        const isEditLocation = /\.(?:edit|add)$/.test(task) || layout === 'edit' || layout === 'modal';
          const hasEditorForm = Boolean(iframe.contentDocument?.querySelector('form#adminForm, form#item-form'));
        if (!isEditLocation || !hasEditorForm) dialog.close();
      } catch (error) {
        // Cross-origin navigations cannot be inspected and must remain user-closeable.
      }
    });
    dialog.querySelector('.btn-close').addEventListener('click', () => dialog.close());
    window.SmartBrowserDialogDismiss.install(dialog, () => dirty);
    dialog.addEventListener('close', async () => { size.destroy(); dialog.remove(); if (!this.destroyed) await this.reload(); });
    this.ownDialog(dialog, () => size.destroy());
    dialog.showModal();
  }

  async mutate(action, selection, payload = {}) {
    try {
      await this.api.execute(action, selection, payload);
      await this.reload();
    } catch (error) {
      Joomla.renderMessages({ error: [error.message] });
    }
  }

  pickUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.addEventListener('change', () => this.uploadFiles(input.files));
    input.click();
  }

  async uploadFiles(files) {
    if (this.state.busy) return;
    this.state.busy = true;
    let uploaded = 0;
    try {
      for (const file of Array.from(files || [])) {
        try {
          const content = await this.read(file);
          const payload = { nodeId: this.state.selectedNode, name: file.name, content };
          try {
            await this.api.execute('upload', [], payload);
          } catch (error) {
            if (error.status !== 409) throw error;
            const question = this.translate('COM_MEDIA_FILE_EXISTS_AND_OVERRIDE').replace(/%[sS]/, file.name);
            if (!await this.actionDialog({ title: 'COM_SMARTBROWSER_ACTION_UPLOAD', message: question, accept: 'JYES', destructive: true })) continue;
            await this.api.execute('upload', [], { ...payload, override: true });
          }
          uploaded++;
        } catch (error) {
          const detail = error?.message || this.translate('COM_SMARTBROWSER_ERROR_UPLOAD_FAILED');
          Joomla.renderMessages({ error: [`${file.name}: ${detail}`] });
        }
      }
      if (uploaded) {
        await this.reload();
        Joomla.renderMessages({ success: [this.translate('COM_MEDIA_UPLOAD_SUCCESS')] });
      }
    } finally {
      this.state.busy = false;
    }
  }

  read(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  previewMedia(resource) {
    const url = resource.metadata?.url;
    const kind = previewKind(resource);
    return kind === 'image'
      ? `<img data-preview-media src="${this.escapeAttribute(url)}" alt="${this.escapeAttribute(resource.title)}">`
      : kind === 'video'
        ? `<video data-preview-media src="${this.escapeAttribute(url)}" controls preload="metadata"></video>`
        : kind === 'audio'
          ? `<audio data-preview-media src="${this.escapeAttribute(url)}" controls preload="metadata"></audio>`
          : kind === 'pdf'
            ? `<iframe data-preview-media src="${this.escapeAttribute(url)}" title="${this.escapeAttribute(resource.title)}"></iframe>`
            : `<div class="smartbrowser-preview-unavailable"><span class="${this.escapeAttribute(resource.icon || 'fas fa-file')}" aria-hidden="true"></span><span>${this.escape(this.translate('COM_SMARTBROWSER_PREVIEW_UNAVAILABLE'))}</span></div>`;
  }

  previewUrl(url, title) {
    const dialog = document.createElement('dialog');
    dialog.className = 'smartbrowser-preview smartbrowser-content-preview';
    dialog.setAttribute('aria-label', title || this.translate('COM_SMARTBROWSER_ACTION_PREVIEW'));
    dialog.innerHTML = `<button type="button" class="btn-close" aria-label="${this.escapeAttribute(this.translate('JCLOSE'))}"></button><div class="smartbrowser-preview-media"><iframe src="${this.escapeAttribute(url)}" title="${this.escapeAttribute(title || '')}"></iframe></div>`;
    this.showContentPreview(dialog);
  }

  preview(resource) {
    const dialog = document.createElement('dialog');
    dialog.className = 'smartbrowser-preview smartbrowser-content-preview';
    dialog.setAttribute('aria-label', resource.title);
    dialog.innerHTML = `<button type="button" class="btn-close" aria-label="${this.escapeAttribute(this.translate('JCLOSE'))}"></button><div class="smartbrowser-preview-media">${this.previewMedia(resource)}</div>`;
    this.showContentPreview(dialog);
  }

  showContentPreview(dialog) {
    if (this.destroyed) return;
    dialog.querySelector('.btn-close').addEventListener('click', () => dialog.close());
    window.SmartBrowserDialogDismiss.install(dialog);
    dialog.addEventListener('close', () => dialog.remove());
    this.ownDialog(dialog);
    dialog.showModal();
  }

  editMedia(resource) {
    let currentResource = resource;
    const [initialName, initialExtension] = this.splitFilename(resource.title);
    const dialog = document.createElement('dialog');
    dialog.className = 'smartbrowser-preview';
    const media = this.previewMedia(resource);
    dialog.innerHTML = `<form class="smartbrowser-preview-form com-smartbrowser-editor" method="dialog">
      <div class="smartbrowser-preview-actions">
        <button type="button" class="btn btn-primary" data-action="save" ${resource.capabilities?.rename ? '' : 'disabled'}><span class="fas fa-save" aria-hidden="true"></span> ${this.escapeTranslated('JSAVE')}</button>
        <button type="button" class="btn btn-outline-primary" data-action="apply" ${resource.capabilities?.rename ? '' : 'disabled'}><span class="fas fa-check" aria-hidden="true"></span> ${this.escapeTranslated('JAPPLY')}</button>
        <button type="button" class="btn btn-outline-primary" data-action="copy" ${resource.capabilities?.copy ? '' : 'disabled'}><span class="fas fa-copy" aria-hidden="true"></span> ${this.escapeTranslated('JSAVEASCOPY')}</button>
        <button type="button" class="btn btn-danger" data-action="cancel"><span class="fas fa-times" aria-hidden="true"></span> ${this.escape(this.translate('COM_SMARTBROWSER_CANCEL'))}</button>
        <button type="button" class="btn btn-outline-secondary smartbrowser-preview-download" data-action="download"><span class="fas fa-download" aria-hidden="true"></span> ${this.escape(this.translate('COM_SMARTBROWSER_ACTION_DOWNLOAD'))}</button>
        <button type="button" class="btn btn-outline-secondary ms-auto smartbrowser-editor-size"><span class="fas fa-expand" aria-hidden="true"></span></button>
      </div>
      <div class="smartbrowser-preview-card">
        <div class="smartbrowser-preview-tabs" role="tablist">
          <button type="button" role="tab" data-tab="content" aria-selected="true" aria-controls="smartbrowser-preview-content">${this.escape(this.translate('COM_SMARTBROWSER_CONTENT_TAB'))}</button>
          <button type="button" role="tab" data-tab="metadata" aria-selected="false" aria-controls="smartbrowser-preview-metadata">${this.escape(this.translate('COM_SMARTBROWSER_METADATA_TAB'))}</button>
        </div>
        <section id="smartbrowser-preview-content" class="smartbrowser-preview-tab smartbrowser-editor-tab" role="tabpanel">
          <div class="smartbrowser-preview-name-fields smartbrowser-editor-title-alias">
            <div class="control-group"><div class="control-label"><label for="smartbrowser-preview-name">${this.escape(this.translate('COM_SMARTBROWSER_FILE_NAME'))}</label></div>
              <div class="controls"><input id="smartbrowser-preview-name" class="form-control" name="name" required value="${this.escapeAttribute(initialName)}" ${resource.capabilities?.rename || resource.capabilities?.copy ? '' : 'readonly'}></div></div>
            <div class="control-group"><div class="control-label"><label for="smartbrowser-preview-extension">${this.escape(this.translate('COM_SMARTBROWSER_EXTENSION'))}</label></div>
              <div class="controls"><input id="smartbrowser-preview-extension" class="form-control" name="extension" value="${this.escapeAttribute(initialExtension)}" ${resource.capabilities?.rename || resource.capabilities?.copy ? '' : 'readonly'}></div></div>
          </div>
          <div class="smartbrowser-preview-media">${media}</div>
        </section>
        <section id="smartbrowser-preview-metadata" class="smartbrowser-preview-tab" role="tabpanel" hidden>
          <dl class="smartbrowser-preview-metadata">
            <div><dt>${this.escape(this.translate('COM_SMARTBROWSER_FILE_TYPE'))}</dt><dd>${this.escape(this.translate({ image: 'COM_SMARTBROWSER_MEDIA_IMAGE', document: 'COM_SMARTBROWSER_MEDIA_DOCUMENT', video: 'COM_SMARTBROWSER_MEDIA_VIDEO', audio: 'COM_SMARTBROWSER_MEDIA_AUDIO' }[resource.type] || 'COM_SMARTBROWSER_RESOURCE'))}</dd></div>
            <div><dt>${this.escape(this.translate('COM_SMARTBROWSER_MIME_TYPE'))}</dt><dd>${this.escape(resource.metadata?.mimeType || '')}</dd></div>
            <div><dt>${this.escape(this.translate('COM_SMARTBROWSER_EXTENSION'))}</dt><dd>${this.escape(resource.metadata?.extension || '')}</dd></div>
            <div><dt>${this.escape(this.translate('COM_SMARTBROWSER_SIZE'))}</dt><dd>${this.escape(this.formatPreviewSize(resource.metadata?.size))}</dd></div>
            <div><dt>${this.escape(this.translate('COM_SMARTBROWSER_DIMENSIONS'))}</dt><dd>${resource.metadata?.width && resource.metadata?.height ? `${Number(resource.metadata.width)} × ${Number(resource.metadata.height)} px` : ''}</dd></div>
            <div><dt>${this.escape(this.translate('COM_SMARTBROWSER_DATE_CREATED'))}</dt><dd>${this.escape(this.formatPreviewDate(resource.metadata?.created))}</dd></div>
            <div><dt>${this.escape(this.translate('COM_SMARTBROWSER_DATE_MODIFIED'))}</dt><dd>${this.escape(this.formatPreviewDate(resource.metadata?.modified))}</dd></div>
          </dl>
        </section>
      </div></form>`;
    const size = createEditorSize(dialog, dialog.querySelector('.smartbrowser-editor-size'), this.translate);
    dialog.querySelector('form').addEventListener('submit', (event) => event.preventDefault());
    dialog.querySelectorAll('[data-tab]').forEach((tab) => tab.addEventListener('click', () => {
      dialog.querySelectorAll('[data-tab]').forEach((button) => { button.setAttribute('aria-selected', String(button === tab)); });
      dialog.querySelector('#smartbrowser-preview-content').hidden = tab.dataset.tab !== 'content';
      dialog.querySelector('#smartbrowser-preview-metadata').hidden = tab.dataset.tab !== 'metadata';
    }));
    dialog.querySelector('[data-action="cancel"]').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-action="download"]').addEventListener('click', async () => {
      try { this.download(await this.api.execute('download', [currentResource.id])); }
      catch (error) { Joomla.renderMessages({ error: [error.message] }); }
    });
    const nameInput = dialog.querySelector('[name="name"]');
    const extensionInput = dialog.querySelector('[name="extension"]');
    const filename = () => nameInput.value.trim() + (extensionInput.value.trim().replace(/^\.+/, '') ? `.${extensionInput.value.trim().replace(/^\.+/, '')}` : '');
    window.SmartBrowserDialogDismiss.install(dialog, () => filename() !== currentResource.title);
    const save = async (closeAfter) => {
      if (!nameInput.value.trim()) { nameInput.reportValidity(); return; }
      const name = filename();
      try {
        if (name !== currentResource.title) {
          currentResource = await this.api.execute('rename', [currentResource.id], { name });
          const preview = dialog.querySelector('[data-preview-media]');
          if (preview && currentResource.metadata?.url) preview.src = currentResource.metadata.url;
          [nameInput.value, extensionInput.value] = this.splitFilename(currentResource.title);
          await this.reload();
        }
        if (closeAfter) dialog.close();
      } catch (error) { Joomla.renderMessages({ error: [error.message] }); }
    };
    dialog.querySelector('[data-action="save"]').addEventListener('click', () => save(true));
    dialog.querySelector('[data-action="apply"]').addEventListener('click', () => save(false));
    dialog.querySelector('[data-action="copy"]').addEventListener('click', async () => {
      if (!nameInput.value.trim()) { nameInput.reportValidity(); return; }
      try {
        await this.api.execute('copy', [currentResource.id], { name: filename() });
        dialog.close();
        await this.reload();
      } catch (error) { Joomla.renderMessages({ error: [error.message] }); }
    });
    dialog.addEventListener('close', () => { size.destroy(); dialog.remove(); });
    this.ownDialog(dialog, () => size.destroy());
    dialog.showModal();
  }

  async share(resource) {
    const url = resource.metadata?.url;
    if (!url) return;
    if (navigator.share) await navigator.share({ title: resource.title, url });
    else {
      await navigator.clipboard.writeText(url);
      Joomla.renderMessages({ success: [url] });
    }
  }

  download(resource) {
    const link = document.createElement('a');
    link.download = resource.title;
    link.href = resource.metadata?.content
      ? `data:${resource.metadata.mimeType};base64,${resource.metadata.content}`
      : resource.metadata?.url;
    link.click();
  }

  escape(value) {
    const element = document.createElement('div');
    element.textContent = value || '';
    return element.innerHTML;
  }

  escapeTranslated(key) {
    const decoder = document.createElement('textarea');
    decoder.innerHTML = this.translate(key);
    return this.escape(decoder.value);
  }

  escapeAttribute(value) {
    return this.escape(value).replace(/"/g, '&quot;');
  }

  formatPreviewSize(bytes) {
    return Number.isFinite(Number(bytes)) ? `${(Number(bytes) / 1024).toFixed(2)} KB` : '';
  }

  formatPreviewDate(value) {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleString();
  }

  splitFilename(filename) {
    const dot = filename.lastIndexOf('.');
    return dot > 0 && dot < filename.length - 1
      ? [filename.slice(0, dot), filename.slice(dot + 1)]
      : [filename, ''];
  }
}
