import { l as e, z as t } from "./visual-runtime-6WA-BB1G.js?v=3.6.22";
import { a as n, i as r, t as i } from "./visual-runtime-hH3o4gop.js?v=3.6.22";
//#region resources/js/collection.js
var a = /* @__PURE__ */ new WeakMap();
function o(o, s = {}) {
	let c = typeof o == "string" ? document.querySelector(o) : o;
	if (!(c instanceof Element)) throw TypeError("A collection requires a container element.");
	if (a.has(c)) throw Error("A SmartBrowser collection is already mounted in this container.");
	let l = window.Joomla?.getOptions("com_smartbrowser.collection", {}) || {}, u = t({
		...l,
		...s
	});
	if (!u.apiBaseUrl || !u.csrfToken) throw TypeError("Collection apiBaseUrl and csrfToken are required.");
	if (u.layout && ![
		"grid",
		"details",
		"compact"
	].includes(u.layout)) throw TypeError("Collection layout must be grid, details or compact.");
	if (u.informationPanelPosition && ![
		"auto",
		"top",
		"bottom",
		"left",
		"right"
	].includes(u.informationPanelPosition)) throw TypeError("Invalid information panel position.");
	if (u.informationPanelHorizontalPosition && !["left", "right"].includes(u.informationPanelHorizontalPosition)) throw TypeError("Invalid horizontal information panel position.");
	if (u.informationPanelVerticalPosition && !["top", "bottom"].includes(u.informationPanelVerticalPosition)) throw TypeError("Invalid vertical information panel position.");
	if (u.selectionUseData && ![
		"hidden",
		"readonly",
		"editable"
	].includes(u.selectionUseData)) throw TypeError("Invalid selection use data presentation.");
	let d = u.translate || ((e) => window.Joomla?.Text?._(e, e) || e), f = new n({
		...u,
		mode: u.readOnly ? "readonly" : "manage"
	}), p = !1, m = /* @__PURE__ */ new Map(), h, g = i({
		config: u,
		api: f,
		notify: (e) => {
			p || (c.dispatchEvent(new CustomEvent("smartbrowser:collection-change", {
				detail: e,
				bubbles: !0
			})), u.onChange?.(e));
		},
		translate: d
	}), _ = e(r, {
		model: g,
		api: f,
		config: u,
		t: d
	}).provide("smartBrowserOptions", g.options);
	_.mount(c);
	let v = g.refresh();
	v.catch((e) => u.onError?.(e));
	let y = {
		ready: v,
		getItems: g.getItems,
		setItems: (e) => g.setItems(e),
		addItems: (e) => g.addItems(e),
		refresh: () => g.refresh(),
		setNativeAddress: (e) => {
			u.nativeAddress = String(e || "");
		},
		attachPreview(e) {
			if (p || !(e instanceof HTMLElement) || h) return;
			let t = c.querySelector(".sb-native-preview-host");
			if (!t) return;
			let n = document.createComment("SmartBrowser preview");
			e.before(n), t.append(e), h = {
				element: e,
				marker: n
			}, u.nativePreview = !0;
		},
		addToolbarButton(e) {
			if (p || !(e instanceof HTMLElement) || !e.matches("button, [role=\"button\"]")) throw TypeError("A toolbar button element is required.");
			if (!m.has(e)) {
				let t = document.createComment("SmartBrowser toolbar button");
				e.before(t), m.set(e, t), c.querySelector(".sb-collection-extra-buttons").append(e);
			}
			return () => {
				let t = m.get(e);
				t && (t.replaceWith(e), m.delete(e));
			};
		},
		destroy() {
			p || (m.forEach((e, t) => e.replaceWith(t)), m.clear(), h && h.marker.replaceWith(h.element), p = !0, g.destroy(), _.unmount(), a.delete(c));
		}
	};
	return a.set(c, y), y;
}
window.SmartBrowser = {
	...window.SmartBrowser,
	mountCollection: o
}, document.dispatchEvent(new CustomEvent("smartbrowser:collection-ready"));
//#endregion
export { o as mountCollection };
