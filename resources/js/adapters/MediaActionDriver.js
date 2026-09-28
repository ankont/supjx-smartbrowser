const promptValue = (message, value = '') => window.prompt(message, value);

export default class MediaActionDriver {
  constructor(api, state, reload, translate, editorMode = 'modal', application = 'administrator') {
    this.api = api;
    this.state = state;
    this.reload = reload;
    this.translate = translate;
    this.editorMode = editorMode;
    this.application = application;
  }

  available(action, selection) {
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
    if (!this.available(action, selection)) return;
    const targets = action.exclusiveGroup
      ? selection.filter((resource) => resource.capabilities?.[action.id] === true)
      : selection;
    const ids = targets.map((resource) => resource.id);

    if (action.id === 'upload') return this.pickUpload();
    if (action.id === 'createNode') {
      const name = promptValue(this.translate('COM_SMARTBROWSER_NEW_FOLDER_NAME'));
      if (name) await this.mutate(action.id, [], { nodeId: this.state.selectedNode, name });
      return;
    }
    if (action.currentNode) {
      const result = await this.api.execute(action.id, [], { nodeId: this.state.selectedNode });
      if (result?.command === 'openEditor') this.openEditor(result.url);
      else await this.reload();
      return;
    }
    if (action.id === 'rename') {
      const name = promptValue(this.translate('COM_SMARTBROWSER_RENAME_TO'), selection[0].title);
      if (name && name !== selection[0].title) await this.mutate(action.id, ids, { name });
      return;
    }
    if (action.id === 'delete') {
      if (window.confirm(this.translate('COM_SMARTBROWSER_CONFIRM_DELETE'))) await this.mutate(action.id, ids);
      return;
    }
    if (action.id === 'removeFromGroup') {
      const groups = Object.fromEntries(targets.map((resource) => [resource.id, resource.metadata?.sourceGroupId]));
      if (ids.some((id) => !groups[id])) return;
      if (window.confirm(this.translate('COM_SMARTBROWSER_CONFIRM_REMOVE_FROM_GROUP'))) {
        await this.mutate(action.id, ids, { groups });
      }
      return;
    }

    const resource = await this.api.execute(action.id, ids);
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
    if (action.id === 'share') this.share(resource);
    if (action.id === 'download') this.download(resource);
    if (resource?.updated || resource?.deleted) await this.reload();
  }

  openEditor(url) {
    if (this.editorMode === 'page') {
      const destination = new URL(url, window.location.href);
      if (this.application === 'site') {
        window.sessionStorage.setItem('supjx.smartbrowser.editorReturn', window.location.href);
        destination.searchParams.set('sbpage', '1');
        destination.searchParams.delete('tmpl');
      } else {
        destination.searchParams.delete('layout');
        destination.searchParams.delete('tmpl');
        destination.searchParams.set('return', window.btoa(window.location.href));
      }
      window.location.assign(destination.toString());
      return;
    }
    const dialog = document.createElement('dialog');
    dialog.className = 'smartbrowser-editor';
    dialog.innerHTML = `<iframe src="${this.escape(url)}" title="Editor"></iframe><button type="button" class="btn-close" aria-label="Close"></button>`;
    const iframe = dialog.querySelector('iframe');
    let initialLoadComplete = false;
    let dirty = false;
    iframe.addEventListener('load', () => {
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
        const hasEditorForm = Boolean(iframe.contentDocument?.querySelector('form#adminForm'));
        if (!isEditLocation || !hasEditorForm) dialog.close();
      } catch (error) {
        // Cross-origin navigations cannot be inspected and must remain user-closeable.
      }
    });
    dialog.querySelector('button').addEventListener('click', () => dialog.close());
    window.SmartBrowserDialogDismiss.install(dialog, () => dirty);
    dialog.addEventListener('close', async () => { dialog.remove(); await this.reload(); });
    document.body.appendChild(dialog);
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
    for (const file of Array.from(files || [])) {
      const content = await this.read(file);
      await this.mutate('upload', [], { nodeId: this.state.selectedNode, name: file.name, content });
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

  preview(resource) {
    const url = resource.metadata?.url;
    if (!url) return;
    let currentResource = resource;
    const [initialName, initialExtension] = this.splitFilename(resource.title);
    const dialog = document.createElement('dialog');
    dialog.className = 'smartbrowser-preview';
    const media = resource.type === 'image'
      ? `<img src="${this.escapeAttribute(url)}" alt="${this.escapeAttribute(resource.title)}">`
      : `<iframe src="${this.escapeAttribute(url)}" title="${this.escapeAttribute(resource.title)}"></iframe>`;
    dialog.innerHTML = `<form class="smartbrowser-preview-form com-smartbrowser-editor" method="dialog">
      <div class="smartbrowser-preview-actions">
        <button type="button" class="btn btn-primary" data-action="save" ${resource.capabilities?.rename ? '' : 'disabled'}><span class="icon-save" aria-hidden="true"></span> ${this.escapeTranslated('JSAVE')}</button>
        <button type="button" class="btn btn-outline-primary" data-action="apply" ${resource.capabilities?.rename ? '' : 'disabled'}><span class="icon-check" aria-hidden="true"></span> ${this.escapeTranslated('JAPPLY')}</button>
        <button type="button" class="btn btn-outline-primary" data-action="copy" ${resource.capabilities?.copy ? '' : 'disabled'}><span class="icon-copy" aria-hidden="true"></span> ${this.escapeTranslated('JSAVEASCOPY')}</button>
        <button type="button" class="btn btn-danger" data-action="cancel"><span class="icon-cancel" aria-hidden="true"></span> ${this.escape(this.translate('COM_SMARTBROWSER_CANCEL'))}</button>
        <button type="button" class="btn btn-outline-secondary smartbrowser-preview-download" data-action="download"><span class="icon-download" aria-hidden="true"></span> ${this.escape(this.translate('COM_SMARTBROWSER_ACTION_DOWNLOAD'))}</button>
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
          const preview = dialog.querySelector('.smartbrowser-preview-media img, .smartbrowser-preview-media iframe');
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
    dialog.addEventListener('close', () => dialog.remove());
    document.body.appendChild(dialog);
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
