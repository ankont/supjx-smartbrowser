document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-sb-reset-preferences]');
  if (!button) return;
  const target = document.getElementById(button.dataset.sbResetPreferences);
  if (!target) return;
  target.value = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const pending = document.querySelector('[data-sb-reset-pending="' + button.dataset.sbResetPreferences + '"]');
  if (pending) pending.hidden = false;
});
