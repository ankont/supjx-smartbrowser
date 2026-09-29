import assert from 'node:assert/strict';
import test from 'node:test';
import ResourceApi, { responseErrorMessage } from '../resources/js/services/ResourceApi.js';

const translate = (key) => ({
  COM_SMARTBROWSER_ERROR_REQUEST_TOO_LARGE: 'Check upload limits.',
  COM_SMARTBROWSER_ERROR_REQUEST_HTTP: 'Request failed (HTTP %s).',
  COM_SMARTBROWSER_ERROR_REQUEST_NETWORK: 'Could not contact the server.',
})[key] || key;

test('API preserves native main and queued error messages without duplicates', () => {
  assert.equal(responseErrorMessage({ message: 'Invalid MIME type', messages: { error: ['Invalid MIME type', 'Image contents are invalid'], warning: ['Upload blocked'] } }, 400, translate),
    'Invalid MIME type; Image contents are invalid; Upload blocked');
});

test('API gives specific fallbacks only when the server supplies no explanation', () => {
  assert.equal(responseErrorMessage({}, 413, translate), 'Check upload limits.');
  assert.equal(responseErrorMessage(null, 500, translate), 'Request failed (HTTP 500).');
  assert.equal(responseErrorMessage(null, 0, translate), 'Could not contact the server.');
});

test('HTTP upload errors retain their status and Joomla message queue', async () => {
  const previousJoomla = globalThis.Joomla;
  globalThis.Joomla = {
    Text: { _: translate },
    request: ({ onError }) => onError({
      status: 400,
      responseText: JSON.stringify({ message: 'Unsupported extension', messages: { error: ['Allowed: jpg, png, pdf'] } }),
    }),
  };
  try {
    const api = new ResourceApi({ apiBaseUrl: 'https://example.test/index.php?option=com_smartbrowser', adapter: 'media', csrfToken: 'token' });
    await assert.rejects(api.execute('upload', [], { name: 'bad.exe' }), (error) => {
      assert.equal(error.status, 400);
      assert.equal(error.message, 'Unsupported extension; Allowed: jpg, png, pdf');
      return true;
    });
  } finally {
    globalThis.Joomla = previousJoomla;
  }
});
