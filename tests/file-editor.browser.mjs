async page => {
  await page.goto('http://127.0.0.1:8791');
  return page.evaluate(async () => {
    const { default: Driver } = await import('/resources/js/adapters/MediaActionDriver.js');
    const resource = { id: 'local-files:/notes.txt', title: 'notes.txt', type: 'document', capabilities: { rename: true, copy: true }, metadata: { mimeType: 'text/plain', extension: 'txt', url: '/notes.txt' } };
    let content = btoa('original'), revision = 'first', fail = false, reloads = 0;
    const calls = [];
    const api = { options: {}, async execute(action, ids, payload) {
      calls.push({ action, ids, payload });
      if (action === 'writeFile') {
        if (fail) throw Error('Concurrent edit');
        content = payload.content; revision = 'saved';
      }
      return { kind: 'text', resource, content, revision };
    } };
    const check = (condition, message) => { if (!condition) throw Error(message); };
    const driver = new Driver(api, {}, async () => { reloads++; }, key => key);
    await driver.editMedia(resource);
    const dialog = document.querySelector('dialog.smartbrowser-preview');
    const input = dialog.querySelector('textarea');
    check(input.value === 'original', 'Text not loaded');
    input.value = 'Ελληνικά <script>plain text</script>';
    dialog.querySelector('[data-action="apply"]').click();
    await new Promise(resolve => setTimeout(resolve, 30));
    check(calls.at(-1).action === 'writeFile' && calls.at(-1).payload.revision === 'first', 'Content not saved with revision');
    check(new TextDecoder().decode(Uint8Array.from(atob(content), char => char.charCodeAt(0))) === input.value, 'UTF-8 content damaged');
    check(dialog.open && reloads === 1, 'Apply must retain dialog and refresh list');
    fail = true;
    input.value = 'unsaved';
    dialog.querySelector('[data-action="save"]').click();
    await new Promise(resolve => setTimeout(resolve, 30));
    check(dialog.open && input.value === 'unsaved', 'Failure discarded editor');
    check(document.getElementById('fixture-messages').textContent.includes('Concurrent edit'), 'Failure not reported');
    [...dialog.querySelectorAll('button')].find(button => button.textContent === 'JRESET').click();
    check(input.value.startsWith('Ελληνικά'), 'Reset must restore last saved content');
    driver.destroy();
    check(!document.querySelector('dialog.smartbrowser-preview'), 'Editor leaked after destroy');
    return 'Text editor UTF-8 round trip, Apply, failed Save, Reset and cleanup passed';
  });
}
