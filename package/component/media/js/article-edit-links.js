import { t as e } from "./visual-runtime-B7XS5tio.js?v=4.0.0";
//#region resources/js/article-edit-links.js
var t = new e(null, {}, () => window.location.reload(), (e) => Joomla.Text._(e), "modal", "site");
document.addEventListener("click", (e) => {
	if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
	let n = e.target.closest("a[href]");
	if (!n || n.hasAttribute("download") || n.target && n.target !== "_self") return;
	let r = new URL(n.href, window.location.href);
	if (r.origin !== window.location.origin || r.searchParams.has("sbNative")) return;
	let i = r.searchParams.get("task");
	["article.edit", "article.add"].includes(i) && (r.searchParams.has("option") && r.searchParams.get("option") !== "com_content" || (e.preventDefault(), r.searchParams.set("tmpl", "component"), r.searchParams.delete("sbpage"), t.openEditor(r.href)));
}), window.addEventListener("pagehide", () => t.destroy(), { once: !0 });
//#endregion
