import { U as e, u as t } from "./visual-runtime-DqAjSaDT.js?v=4.0.0";
import { a as n, c as r, i, o as a, s as o, t as s, w as c } from "./visual-runtime-Bwz_0MG8.js?v=4.0.0";
import { i as l, r as u, t as d } from "./visual-runtime-1h24eaHt.js?v=4.0.0";
//#region resources/js/core/selectionFieldValue.js
function f(e, t, n = !0, r = !1) {
	if (e === "" || e == null) return {
		version: 1,
		items: []
	};
	if (typeof e == "string" && e.length > 262144) throw TypeError("Field value too large.");
	let i = typeof e == "string" ? JSON.parse(e) : e;
	if (i?.version !== 1) throw TypeError("Invalid SmartBrowser field version.");
	let a = i.items || i.selection?.map((e) => ({
		selection: e,
		usage: i.usage?.[e.id] || {}
	})), o = d(a, {
		allowedAdapters: Array.isArray(t) ? t : t ? [t] : [],
		homogeneous: r
	});
	if (o.length !== a.length || !n && o.length > 1) throw TypeError("Invalid SmartBrowser field selection.");
	return {
		version: 1,
		items: o
	};
}
function p(e, t, n, r, i = null, a = !1, o = !1, s = "replace") {
	let l = t.items || (Array.isArray(t.selection) ? t.selection : [t.selection]).map((r) => ({
		selection: {
			adapter: t.adapter || e.items[0]?.selection.adapter || (Array.isArray(n) ? n[0] : n),
			id: r.id
		},
		usage: t.usage?.[r.id] || {}
	})), p = new Set(e.items.map((e) => u(e.selection))), m = s === "append" ? [...e.items, ...l.filter((e) => !p.has(u(e.selection)))] : i ? e.items.flatMap((e) => u(e.selection) === u(i) ? l.map((t) => ({
		...t,
		usage: o || u(t.selection) === u(e.selection) ? {
			...c(e.usage),
			...t.usage
		} : t.usage
	})) : [e]) : l;
	return f({
		version: 1,
		items: d(m)
	}, n, r, a);
}
//#endregion
//#region resources/js/core/collectionPicker.js
function m({ config: e, model: t, api: n, open: r, isDisposed: i = () => !1 }) {
	let a = !1;
	async function o(o = null, s = !1) {
		if (a || i() || e.readOnly || t.browser.state.loading || t.browser.state.busy) return;
		let c = {
			version: 1,
			items: t.getItems()
		}, d = e.multiple === !1 ? 1 : e.maxSelections || 500;
		if (s && c.items.length >= d) return;
		let m = t.revision.value, h = e.allowedAdapters || (e.adapter ? [e.adapter] : []), g = o?.selection || (o ? {
			adapter: o.adapter || e.adapter,
			id: o.id
		} : null), _ = g?.adapter || c.items[0]?.selection.adapter || e.adapter || h[0], v = g ? c.items.find((e) => u(e.selection) === u(g)) : e.multiple === !1 ? c.items[0] : null, y = { ...e.selectionProfile };
		if (!s && e.preserveUsageOnReplace && v) for (let [e, t] of Object.entries(y)) t !== !1 && Object.hasOwn(v.usage, e) && (y[e] = {
			...typeof t == "object" ? t : {},
			default: v.usage[e]
		});
		a = !0;
		try {
			let a = typeof e.pickerOptions == "function" ? e.pickerOptions() : e.pickerOptions || {}, v = await r({
				...e,
				...a,
				url: e.pickerUrl,
				adapter: _,
				selectionProfile: y,
				browseRoot: _ === e.adapter ? e.browseRoot : "",
				allowedAdapters: s && e.homogeneous && c.items.length ? [c.items[0].selection.adapter] : h,
				homogeneous: e.multiple !== !1 && e.homogeneous,
				multiple: e.multiple !== !1,
				resultFormat: "collection",
				maxSelections: s ? d - c.items.length : d,
				initialFocus: g,
				initialInfoOpen: !!g,
				initialNode: o?.parentId || "",
				initialCollection: s ? [] : c.items
			});
			if (!v || i()) return;
			if (m !== t.revision.value) throw Error("Selection changed while the Picker was open.");
			f({
				version: 1,
				items: v.items
			}, h, e.multiple !== !1, e.homogeneous);
			let b = p(c, v, h, e.multiple !== !1, e.multiple === !1 ? g : null, e.homogeneous, e.preserveUsageOnReplace === !0, s ? "append" : "replace");
			if (b.items.length > d) throw Error("Selection limit exceeded.");
			let x = await n.collection(b.items, {
				referenceItems: !0,
				homogeneous: e.homogeneous === !0
			});
			if (i()) return;
			if (m !== t.revision.value) throw Error("Selection changed while the Picker was open.");
			let S = new Set(v.items.map((e) => u(e.selection)));
			for (let t of x.resources) if (S.has(l(t)) && (t.unavailable || t.selectable === !1 || e.allowedResourceTypes?.length && !e.allowedResourceTypes.includes(t.type) || e.selectionTarget === "item" && t.kind !== "item" || e.selectionTarget === "node" && t.kind !== "node")) throw Error("Unavailable or disallowed selection.");
			return await t.setItems(b.items, {
				resolvedResources: x.resources,
				reason: s ? "add" : "replace"
			}), t.getItems();
		} finally {
			a = !1;
		}
	}
	return {
		add: () => o(null, !0),
		editSelection: (e) => o(e)
	};
}
//#endregion
//#region resources/js/collection.js
var h = /* @__PURE__ */ new WeakMap();
function g(o, c = {}) {
	let l = typeof o == "string" ? document.querySelector(o) : o;
	if (!(l instanceof Element)) throw TypeError("A collection requires a container element.");
	if (h.has(l)) throw Error("A SmartBrowser collection is already mounted in this container.");
	let u = window.Joomla?.getOptions("com_smartbrowser.collection", {}) || {}, d = e({
		...u,
		...c
	});
	if (!d.apiBaseUrl || !d.csrfToken) throw TypeError("Collection apiBaseUrl and csrfToken are required.");
	if (d.layout && ![
		"grid",
		"details",
		"compact"
	].includes(d.layout)) throw TypeError("Collection layout must be grid, details or compact.");
	if (d.informationPanelPosition && ![
		"auto",
		"top",
		"bottom",
		"left",
		"right"
	].includes(d.informationPanelPosition)) throw TypeError("Invalid information panel position.");
	if (d.informationPanelHorizontalPosition && !["left", "right"].includes(d.informationPanelHorizontalPosition)) throw TypeError("Invalid horizontal information panel position.");
	if (d.informationPanelVerticalPosition && !["top", "bottom"].includes(d.informationPanelVerticalPosition)) throw TypeError("Invalid vertical information panel position.");
	if (d.selectionUseData && ![
		"hidden",
		"readonly",
		"editable"
	].includes(d.selectionUseData)) throw TypeError("Invalid selection use data presentation.");
	let f = d.translate || ((e) => window.Joomla?.Text?._(e, e) || e), p = new r({
		...d,
		mode: d.readOnly ? "readonly" : "manage"
	}), g = !1, _ = /* @__PURE__ */ new Map(), v, y = s({
		config: d,
		api: p,
		notify: (e) => {
			g || (l.dispatchEvent(new CustomEvent("smartbrowser:collection-change", {
				detail: e,
				bubbles: !0
			})), d.onChange?.(e));
		},
		translate: f
	}), b = m({
		config: d,
		model: y,
		api: p,
		open: (e) => window.SmartBrowserPicker.open(e),
		isDisposed: () => g
	});
	d.selectedResources && y.referenceItems && d.pickerUrl && !d.readOnly && (d.onAdd === void 0 && d.allowAdd !== !1 && (d.onAdd = b.add), d.onReplace === void 0 && d.allowReplace !== !1 && (d.onReplace = b.editSelection), d.defaultResourceActionId === void 0 && d.onReplace && (d.defaultResourceActionId = "collectionReplace"));
	let x = n({
		api: p,
		config: d
	});
	d.addressService = x, Object.assign(d, a({
		model: y,
		api: p,
		config: d,
		service: x,
		isDisposed: () => g
	}));
	let S = t(i, {
		model: y,
		api: p,
		config: d,
		t: f
	}).provide("smartBrowserOptions", y.options).provide("resourceApi", p);
	S.mount(l);
	let C = y.refresh();
	C.catch((e) => d.onError?.(e));
	let w = {
		ready: C,
		getItems: y.getItems,
		add: () => d.readOnly ? void 0 : d.onAdd?.(),
		editSelection: (e) => d.readOnly ? void 0 : d.onReplace?.(e || y.resources.value.find((e) => e.selectionKey === y.browser.state.focusedId || e.id === y.browser.state.focusedId) || y.resources.value[0]),
		exportAddresses: (e) => d.exportAddresses(e),
		importAddresses: (e, t) => d.importAddresses(e, t),
		setItems: (e) => y.setItems(e),
		addItems: (e) => y.addItems(e),
		reorderItems: (e) => y.reorderItems(e),
		refresh: () => y.refresh(),
		setNativeAddress: (e) => {
			d.nativeAddress = String(e || "");
		},
		attachPreview(e) {
			if (g || !(e instanceof HTMLElement) || v) return;
			let t = l.querySelector(".sb-native-preview-host");
			if (!t) return;
			let n = document.createComment("SmartBrowser preview");
			e.before(n), t.append(e), v = {
				element: e,
				marker: n
			}, d.nativePreview = !0;
		},
		addToolbarButton(e) {
			if (g || !(e instanceof HTMLElement) || !e.matches("button, [role=\"button\"]")) throw TypeError("A toolbar button element is required.");
			if (!_.has(e)) {
				let t = document.createComment("SmartBrowser toolbar button");
				e.before(t), _.set(e, t), l.querySelector(".sb-collection-extra-buttons").append(e);
			}
			return () => {
				let t = _.get(e);
				t && (t.replaceWith(e), _.delete(e));
			};
		},
		destroy() {
			g || (_.forEach((e, t) => e.replaceWith(t)), _.clear(), v && v.marker.replaceWith(v.element), g = !0, x.destroy(), y.destroy(), S.unmount(), h.delete(l));
		}
	};
	return h.set(l, w), w;
}
window.SmartBrowser = {
	...window.SmartBrowser,
	mountCollection: g,
	SelectionAddress: o,
	createSelectionAddressService: n
}, document.dispatchEvent(new CustomEvent("smartbrowser:collection-ready"));
//#endregion
export { f as n, g as t };
