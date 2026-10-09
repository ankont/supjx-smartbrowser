export function responseErrorMessage(response, status = 0, translate = (key) => key) {
  const queued = response?.messages && typeof response.messages === 'object'
    ? Object.values(response.messages).flat()
    : [];
  const details = [...new Set([response?.message, ...queued].filter((value) => typeof value === 'string' && value.trim()).map((value) => value.trim()))];
  if (details.length) return details.join('; ');
  if (status === 413) return translate('COM_SMARTBROWSER_ERROR_REQUEST_TOO_LARGE');
  if (status) return translate('COM_SMARTBROWSER_ERROR_REQUEST_HTTP').replace('%s', String(status));
  return translate('COM_SMARTBROWSER_ERROR_REQUEST_NETWORK');
}

export default class ResourceApi {
  constructor(options) {
    this.options = options;
    this.pending = new Map();
  }

  async getResources(nodeId, options = {}) {
    const url = new URL(`${this.options.apiBaseUrl}&task=api.resources&adapter=${encodeURIComponent(this.options.adapter)}`);
    url.searchParams.set('mode', this.options.mode || 'manage');
    if (this.options.browseRoot) url.searchParams.set('browseRoot', this.options.browseRoot);
    if (this.options.flatScope) url.searchParams.set('flatScope', this.options.flatScope);
    url.searchParams.set('node', nodeId);
    if (options.search) url.searchParams.set('search', options.search);
    if (options.sortBy) url.searchParams.set('sortBy', options.sortBy);
    if (options.sortDirection) url.searchParams.set('sortDirection', options.sortDirection);
    if (options.filters) url.searchParams.set('filters', JSON.stringify(options.filters));
    url.searchParams.set('showContextResources', this.options.showContextResources ? '1' : '0');

    return this.request(url);
  }

  async execute(action, selection = [], payload = {}) {
    const url = new URL(`${this.options.apiBaseUrl}&task=api.action&adapter=${encodeURIComponent(this.options.adapter)}`);
    url.searchParams.set('mode', this.options.mode || 'manage');
    if (this.options.browseRoot) url.searchParams.set('browseRoot', this.options.browseRoot);
    if (this.options.flatScope) url.searchParams.set('flatScope', this.options.flatScope);
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify({
        action,
        selection,
        payload,
        [this.options.csrfToken]: 1,
      }),
    });
  }

  collection(items, options = {}) {
    const url = new URL(this.options.apiBaseUrl, window.location.href);
    url.searchParams.set('task', 'api.collection');
    if (this.options.adapter) url.searchParams.set('adapter', this.options.adapter);
    url.searchParams.set('mode', this.options.mode || 'manage');
    if (this.options.browseRoot) url.searchParams.set('browseRoot', this.options.browseRoot);
    if (this.options.flatScope) url.searchParams.set('flatScope', this.options.flatScope);
    return this.request(url, { method: 'POST', body: JSON.stringify({ ...options, items, [this.options.csrfToken]: 1 }) });
  }

  request(url, init = {}) {
    let xhr;
    const promise = new Promise((resolve, reject) => {
      xhr = Joomla.request({
        url: url.toString(),
        method: init.method || 'GET',
        data: init.body,
        headers: { 'Content-Type': 'application/json' },
        onSuccess: (raw) => {
          let response;
          try { response = JSON.parse(raw); } catch (error) { reject(error); return; }
          if (response.data?.authenticationRequired) {
            this.redirectToLogin(response.data.loginUrl);
            reject(new Error(response.message));
          } else if (response.success === false) {
            const error = new Error(responseErrorMessage(response, Number(response.code) || 0, (key) => Joomla.Text?._(key, key) || key));
            error.status = Number(response.code) || 0;
            reject(error);
          }
          else resolve(response.data);
        },
        onError: (xhr) => {
          let response = null;
          try {
            response = JSON.parse(xhr.responseText || xhr.response);
            if (xhr.status === 401 || response.data?.authenticationRequired) this.redirectToLogin(response.data?.loginUrl);
          } catch (error) {
            if (xhr.status === 401) this.redirectToLogin();
          }
          const message = responseErrorMessage(response, Number(xhr.status) || 0, (key) => Joomla.Text?._(key, key) || key);
          const error = new Error(message);
          error.status = Number(xhr.status) || 0;
          reject(error);
        },
      });
      if (xhr) this.pending.set(xhr, reject);
    });
    return promise.finally(() => this.pending.delete(xhr));
  }

  destroy() {
    for (const [xhr, reject] of this.pending) {
      xhr.abort?.();
      reject(new Error('SmartBrowser request cancelled.'));
    }
    this.pending.clear();
  }

  redirectToLogin(url = null) {
    const loginUrl = url || this.options.loginUrl;
    if (loginUrl) window.top.location.assign(loginUrl);
  }
}
