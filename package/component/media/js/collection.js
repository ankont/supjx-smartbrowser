import { l as e } from "./visual-runtime-DVMDRhTu.js";
import { a as t, i as n, t as r } from "./visual-runtime-Dv7lQ9di.js";
//#region resources/js/collection.js
var i = /* @__PURE__ */ new WeakMap();
function a(a, o = {}) {
	let s = typeof a == "string" ? document.querySelector(a) : a;
	if (!(s instanceof Element)) throw TypeError("A collection requires a container element.");
	if (i.has(s)) throw Error("A SmartBrowser collection is already mounted in this container.");
	let c = {
		...window.Joomla?.getOptions("com_smartbrowser.collection", {}) || {},
		...o
	};
	if (!c.apiBaseUrl || !c.csrfToken) throw TypeError("Collection apiBaseUrl and csrfToken are required.");
	if (c.layout && ![
		"grid",
		"details",
		"compact"
	].includes(c.layout)) throw TypeError("Collection layout must be grid, details or compact.");
	let l = c.translate || ((e) => window.Joomla?.Text?._(e, e) || e), u = new t({
		...c,
		mode: c.readOnly ? "readonly" : "manage"
	}), d = !1, f = r({
		config: c,
		api: u,
		notify: (e) => {
			d || (s.dispatchEvent(new CustomEvent("smartbrowser:collection-change", {
				detail: e,
				bubbles: !0
			})), c.onChange?.(e));
		},
		translate: l
	}), p = e(n, {
		model: f,
		api: u,
		config: c,
		t: l
	}).provide("smartBrowserOptions", f.options);
	p.mount(s);
	let m = f.refresh();
	m.catch((e) => c.onError?.(e));
	let h = {
		ready: m,
		getItems: f.getItems,
		setItems: (e) => f.setItems(e),
		addItems: (e) => f.addItems(e),
		refresh: () => f.refresh(),
		destroy() {
			d || (d = !0, f.destroy(), p.unmount(), i.delete(s));
		}
	};
	return i.set(s, h), h;
}
window.SmartBrowser = {
	...window.SmartBrowser,
	mountCollection: a
}, document.dispatchEvent(new CustomEvent("smartbrowser:collection-ready"));
//#endregion
export { a as mountCollection };
