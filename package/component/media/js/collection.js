import { l as e } from "./visual-runtime-DVMDRhTu.js";
import { a as t, i as n, t as r } from "./visual-runtime-EwHcw_pv.js";
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
	}), d = !1, f = /* @__PURE__ */ new Map(), p = r({
		config: c,
		api: u,
		notify: (e) => {
			d || (s.dispatchEvent(new CustomEvent("smartbrowser:collection-change", {
				detail: e,
				bubbles: !0
			})), c.onChange?.(e));
		},
		translate: l
	}), m = e(n, {
		model: p,
		api: u,
		config: c,
		t: l
	}).provide("smartBrowserOptions", p.options);
	m.mount(s);
	let h = p.refresh();
	h.catch((e) => c.onError?.(e));
	let g = {
		ready: h,
		getItems: p.getItems,
		setItems: (e) => p.setItems(e),
		addItems: (e) => p.addItems(e),
		refresh: () => p.refresh(),
		addToolbarButton(e) {
			if (d || !(e instanceof HTMLElement) || !e.matches("button, [role=\"button\"]")) throw TypeError("A toolbar button element is required.");
			if (!f.has(e)) {
				let t = document.createComment("SmartBrowser toolbar button");
				e.before(t), f.set(e, t), s.querySelector(".sb-collection-extra-buttons").append(e);
			}
			return () => {
				let t = f.get(e);
				t && (t.replaceWith(e), f.delete(e));
			};
		},
		destroy() {
			d || (f.forEach((e, t) => e.replaceWith(t)), f.clear(), d = !0, p.destroy(), m.unmount(), i.delete(s));
		}
	};
	return i.set(s, g), g;
}
window.SmartBrowser = {
	...window.SmartBrowser,
	mountCollection: a
}, document.dispatchEvent(new CustomEvent("smartbrowser:collection-ready"));
//#endregion
export { a as mountCollection };
