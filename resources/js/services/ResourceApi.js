export default class ResourceApi {
  constructor(options) {
    this.options = options;
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

  request(url, init = {}) {
    return new Promise((resolve, reject) => {
      Joomla.request({
        url: url.toString(),
        method: init.method || 'GET',
        data: init.body,
        headers: { 'Content-Type': 'application/json' },
        onSuccess: (raw) => {
          const response = JSON.parse(raw);
          if (response.data?.authenticationRequired) {
            this.redirectToLogin(response.data.loginUrl);
            reject(new Error(response.message));
          } else if (response.success === false) {
            const error = new Error(response.message);
            error.status = Number(response.code) || 0;
            reject(error);
          }
          else resolve(response.data);
        },
        onError: (xhr) => {
          let message = 'Request failed';
          try {
            const response = JSON.parse(xhr.responseText || xhr.response);
            message = response.message || message;
            if (xhr.status === 401 || response.data?.authenticationRequired) this.redirectToLogin(response.data?.loginUrl);
          } catch (error) {
            if (xhr.status === 401) this.redirectToLogin();
          }
          const error = new Error(message);
          error.status = xhr.status;
          reject(error);
        },
      });
    });
  }

  redirectToLogin(url = null) {
    const loginUrl = url || this.options.loginUrl;
    if (loginUrl) window.top.location.assign(loginUrl);
  }
}
