const updateGridWidthPreview = (control) => {
  const input = control.querySelector('input[type="number"]');
  const preview = control.querySelector('.sb-grid-width-preview-tile');
  if (!input || !preview) return;
  const width = Math.max(80, Math.min(800, Number(input.value) || Number(input.defaultValue) || 120));
  preview.style.setProperty('--sb-grid-preview-side', `${width}px`);
};

const initializeGridWidthPreviews = () => {
  document.querySelectorAll('[data-sb-grid-width]').forEach(updateGridWidthPreview);
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeGridWidthPreviews, { once: true });
else initializeGridWidthPreviews();

document.addEventListener('input', (event) => {
  const control = event.target.closest('[data-sb-grid-width]');
  if (control) updateGridWidthPreview(control);
});
