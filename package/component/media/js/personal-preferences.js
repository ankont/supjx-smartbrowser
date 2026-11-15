import { t as e } from "./visual-runtime-CJIQlqNK.js?v=6.0.5";
import { t } from "./visual-runtime-w5tRYetL.js?v=6.0.5";
//#region resources/js/personal-preferences.js
var n = () => document.querySelectorAll("[data-sb-personal-preferences]").forEach((n) => {
	n.dataset.mounted || (n.dataset.mounted = "true", e(t, { t: (e) => window.Joomla?.Text?._(e, e) || e }).mount(n));
});
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n, { once: !0 }) : n();
//#endregion
