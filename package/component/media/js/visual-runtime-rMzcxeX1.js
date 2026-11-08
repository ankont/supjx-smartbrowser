import { t as e } from "./visual-runtime-9kQymmoE.js?v=6.0.0";
//#region resources/js/core/personalPreferences.js
var t = "supjx.smartbrowser.personal", n = [
	"categories",
	"tags",
	"menus"
], r = Object.freeze({
	pageSize: null,
	loadingMode: "inherit",
	editorMode: "inherit",
	contextItems: "inherit",
	integration: "inherit",
	pickerStateScope: "caller",
	pickerNodeScope: "caller"
}), i = {
	loadingMode: [
		"inherit",
		"all",
		"pages",
		"smart"
	],
	editorMode: [
		"inherit",
		"modal",
		"page"
	],
	contextItems: [
		"inherit",
		"show",
		"hide"
	],
	integration: [
		"inherit",
		"smartbrowser",
		"native"
	],
	pickerStateScope: ["caller", "adapter"],
	pickerNodeScope: ["caller", "adapter"]
};
function a(t = e()) {
	let n;
	try {
		n = JSON.parse(t?.getItem("supjx.smartbrowser.personal") || "{}");
	} catch {}
	return o(n);
}
function o(e = {}) {
	let t = Object.fromEntries(Object.entries(r).map(([t, n]) => [t, t === "pageSize" ? Number.isSafeInteger(e?.pageSize) && e.pageSize > 0 ? e.pageSize : null : i[t].includes(e?.[t]) ? e[t] : n]));
	return t.contextItemsByAdapter = Object.fromEntries(n.map((n) => [n, i.contextItems.includes(e?.contextItemsByAdapter?.[n]) ? e.contextItemsByAdapter[n] : t.contextItems])), t;
}
function s(e, t) {
	return {
		mode: e.loadingMode === "inherit" ? t.loadingMode || "all" : e.loadingMode,
		pageSize: Number.isSafeInteger(e.pageSize) && e.pageSize > 0 ? e.pageSize : Number.isSafeInteger(t.pageSize) && t.pageSize > 0 ? t.pageSize : 50
	};
}
var c = (e, t) => e.contextItemsByAdapter?.[t?.replace(/^flat-/, "")] || e.contextItems || "inherit";
function l(e, t = a(), n = "state") {
	return t[n === "node" ? "pickerNodeScope" : "pickerStateScope"] === "adapter" ? "shared" : encodeURIComponent(e.pickerContext?.viewPreferenceKey || e.selectionHost?.viewPreferenceKey || e.viewPreferenceKey || "default");
}
var u = (t, n = e()) => `supjx.smartbrowser.nodes.${t.mode === "manage" && !t.pickerInstance && !t.pickerContext ? "manage" : "picker." + l(t, a(n), "node")}.${t.adapter.replace(/^flat-/, "")}`;
async function d(n, r = e()) {
	let i = o(n);
	if (r.setItem(t, JSON.stringify(i)), r.flush && !await r.flush()) throw Error("COM_SMARTBROWSER_PERSONAL_SAVE_FAILED");
	return i;
}
//#endregion
export { l as a, a as i, u as n, s as o, c as r, d as s, n as t };
