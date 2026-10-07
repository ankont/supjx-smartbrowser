import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('image extension fields retain Joomla validation, saved media binding and failed-submit restoration', async () => {
  const service = await readFile(new URL('../package/component/site/src/Service/FrontendEditorService.php', import.meta.url), 'utf8');
  const controller = await readFile(new URL('../package/component/site/src/Controller/EditorController.php', import.meta.url), 'utf8');
  const view = await readFile(new URL('../package/component/site/src/View/Editor/HtmlView.php', import.meta.url), 'utf8');
  assert.match(service, /\$model->getForm\(\$data, false\)/);
  assert.match(service, /\$model->validate\(\$form, \$data\)/);
  assert.match(service, /array_replace\(\$stored, \$valid\[\$group\]\)/);
  assert.match(service, /\$model->save\(\$valid\)/);
  assert.match(service, /\$form->bind\(\$this->articleMediaGroups\(\$model, \$id\)\)/);
  assert.match(controller, /post->get\('jform', \[\], 'array'\)/);
  assert.match(controller, /'data' => \$data/);
  assert.match(view, /\$this->editorForm->bind\(\$failure\['data'\]\)/);
});
