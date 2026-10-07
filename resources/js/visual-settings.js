import { createApp, reactive, h } from 'vue';
import VisualSettings from './components/VisualSettings.vue';
import { normalizeVisualProfiles } from './core/resourceVisual.js';

const initialize = () => {
  const fields = [...document.querySelectorAll('[data-sb-visual-settings]')];
  const globalField = fields.find((field) => !JSON.parse(field.dataset.sbVisualSettings).adapter);
  if (!globalField) return;
  const global = reactive(normalizeVisualProfiles(JSON.parse(globalField.dataset.sbVisualSettings).value));
  const sampleImage = new URL('../images/visual-example.svg', import.meta.url).href;
  const backgroundInput = document.getElementById('jform_image_background');
  const display = reactive({ background: backgroundInput?.value || 'auto' });
  backgroundInput?.addEventListener('change', () => { display.background = backgroundInput.value; });
  for (const field of fields) {
    if (field.dataset.sbVisualMounted) continue;
    const data = JSON.parse(field.dataset.sbVisualSettings);
    if (data.adapter) field.closest('.control-group')?.classList.add('sb-appearance-adapter');
    else field.closest('.control-group')?.classList.add('sb-appearance-general');
    const input = document.getElementById(data.id);
    if (!input) continue;
    field.dataset.sbVisualMounted = 'true';
    createApp({ setup: () => () => h(VisualSettings, { ...data, globalSettings: global, sampleImage, background: display.background, onChange(value) {
      input.value = JSON.stringify(value);
      input.dispatchEvent(new Event('change', { bubbles: true }));
      if (!data.adapter) Object.assign(global, normalizeVisualProfiles(value));
    } }) }).mount(field);
  }
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
else initialize();
