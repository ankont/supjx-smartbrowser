import { createApp } from 'vue';
import PersonalPreferencesDialog from './components/PersonalPreferencesDialog.vue';
const mount = () => document.querySelectorAll('[data-sb-personal-preferences]').forEach(element => {
  if (element.dataset.mounted) return;
  element.dataset.mounted = 'true';
  createApp(PersonalPreferencesDialog, { t: key => window.Joomla?.Text?._(key, key) || key }).mount(element);
});
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
else mount();
