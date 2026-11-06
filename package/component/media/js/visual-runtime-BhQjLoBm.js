import { W as e, u as t } from "./visual-runtime-BEbhjzcM.js?v=5.0.15";
import { a as n, i as r, n as i } from "./visual-runtime-DQsy__lt.js?v=5.0.15";
import { a, c as o, i as s, o as c, s as l, t as u, w as d } from "./visual-runtime-NnvsnHf2.js?v=5.0.15";
//#region resources/js/core/selectionFieldValue.js
function f(e, t, n = !0, r = !1) {
	if (e === "" || e == null) return {
		version: 1,
		items: []
	};
	if (typeof e == "string" && e.length > 262144) throw TypeError("Field value too large.");
	let a = typeof e == "string" ? JSON.parse(e) : e;
	if (a?.version !== 1) throw TypeError("Invalid SmartBrowser field version.");
	let o = a.items || a.selection?.map((e) => ({
		selection: e,
		usage: a.usage?.[e.id] || {}
	})), s = i(o, {
		allowedAdapters: Array.isArray(t) ? t : t ? [t] : [],
		homogeneous: r
	});
	if (s.length !== o.length || !n && s.length > 1) throw TypeError("Invalid SmartBrowser field selection.");
	return {
		version: 1,
		items: s
	};
}
function p(e, t, n, a, o = null, s = !1, c = !1, l = "replace") {
	let u = t.items || (Array.isArray(t.selection) ? t.selection : [t.selection]).map((r) => ({
		selection: {
			adapter: t.adapter || e.items[0]?.selection.adapter || (Array.isArray(n) ? n[0] : n),
			id: r.id
		},
		usage: t.usage?.[r.id] || {}
	})), p = new Set(e.items.map((e) => r(e.selection))), m = l === "append" ? [...e.items, ...u.filter((e) => !p.has(r(e.selection)))] : o ? e.items.flatMap((e) => r(e.selection) === r(o) ? u.map((t) => ({
		...t,
		usage: c || r(t.selection) === r(e.selection) ? {
			...d(e.usage),
			...t.usage
		} : t.usage
	})) : [e]) : u;
	return f({
		version: 1,
		items: i(m)
	}, n, a, s);
}
//#endregion
//#region resources/js/core/collectionPicker.js
function m({ config: e, model: t, api: i, open: a, isDisposed: o = () => !1 }) {
	let s = !1;
	async function c(c = null, l = !1) {
		if (s || o() || e.readOnly || t.browser.state.loading || t.browser.state.busy) return;
		let u = {
			version: 1,
			items: t.getItems()
		}, d = e.multiple === !1 ? 1 : e.maxSelections || 500;
		if (l && u.items.length >= d) return;
		let m = t.revision.value, h = e.allowedAdapters || (e.adapter ? [e.adapter] : []), g = c?.selection || (c ? {
			adapter: c.adapter || e.adapter,
			id: c.id
		} : null), _ = g?.adapter || u.items[0]?.selection.adapter || e.adapter || h[0], v = g ? u.items.find((e) => r(e.selection) === r(g)) : e.multiple === !1 ? u.items[0] : null, y = { ...e.selectionProfile };
		if (!l && e.preserveUsageOnReplace && v) for (let [e, t] of Object.entries(y)) t !== !1 && Object.hasOwn(v.usage, e) && (y[e] = {
			...typeof t == "object" ? t : {},
			default: v.usage[e]
		});
		s = !0;
		try {
			let s = typeof e.pickerOptions == "function" ? e.pickerOptions() : e.pickerOptions || {}, v = await a({
				...e,
				...s,
				url: e.pickerUrl,
				adapter: _,
				selectionProfile: y,
				browseRoot: _ === e.adapter ? e.browseRoot : "",
				allowedAdapters: l && e.homogeneous && u.items.length ? [u.items[0].selection.adapter] : h,
				homogeneous: e.multiple !== !1 && e.homogeneous,
				multiple: e.multiple !== !1,
				resultFormat: "collection",
				maxSelections: l ? d - u.items.length : d,
				initialFocus: g,
				initialInfoOpen: !!g,
				initialNode: c?.parentId || "",
				initialCollection: l ? [] : u.items
			});
			if (!v || o()) return;
			if (m !== t.revision.value) throw Error("Selection changed while the Picker was open.");
			f({
				version: 1,
				items: v.items
			}, h, e.multiple !== !1, e.homogeneous);
			let b = p(u, v, h, e.multiple !== !1, e.multiple === !1 ? g : null, e.homogeneous, e.preserveUsageOnReplace === !0, l ? "append" : "replace");
			if (b.items.length > d) throw Error("Selection limit exceeded.");
			let x = await i.collection(b.items, {
				referenceItems: !0,
				homogeneous: e.homogeneous === !0
			});
			if (o()) return;
			if (m !== t.revision.value) throw Error("Selection changed while the Picker was open.");
			let S = new Set(v.items.map((e) => r(e.selection))), C = new Set(u.items.map((e) => r(e.selection)));
			for (let t of x.resources) if (S.has(n(t)) && !(t.unavailable && C.has(n(t))) && (t.unavailable || t.selectable === !1 || e.allowedResourceTypes?.length && !e.allowedResourceTypes.includes(t.type) || e.selectionTarget === "item" && t.kind !== "item" || e.selectionTarget === "node" && t.kind !== "node")) throw Error("Unavailable or disallowed selection.");
			return await t.setItems(b.items, {
				resolvedResources: x.resources,
				reason: l ? "add" : "replace"
			}), t.getItems();
		} finally {
			s = !1;
		}
	}
	return {
		add: () => c(null, !0),
		editSelection: (e) => c(e)
	};
}
//#endregion
//#region resources/js/collection.js
var h = /* @__PURE__ */ new WeakMap();
function g(n, r = {}) {
	let i = typeof n == "string" ? document.querySelector(n) : n;
	if (!(i instanceof Element)) throw TypeError("A collection requires a container element.");
	if (h.has(i)) throw Error("A SmartBrowser collection is already mounted in this container.");
	let l = window.Joomla?.getOptions("com_smartbrowser.collection", {}) || {}, d = e({
		...l,
		...r
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
	let f = d.translate || ((e) => window.Joomla?.Text?._(e, e) || e), p = new o({
		...d,
		mode: d.readOnly ? "readonly" : "manage"
	}), g = !1, _ = /* @__PURE__ */ new Map(), v, y = u({
		config: d,
		api: p,
		notify: (e) => {
			g || (i.dispatchEvent(new CustomEvent("smartbrowser:collection-change", {
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
	let x = a({
		api: p,
		config: d
	});
	d.addressService = x, Object.assign(d, c({
		model: y,
		api: p,
		config: d,
		service: x,
		isDisposed: () => g
	}));
	let S = t(s, {
		model: y,
		api: p,
		config: d,
		t: f
	}).provide("smartBrowserOptions", y.options).provide("resourceApi", p);
	S.mount(i);
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
			let t = i.querySelector(".sb-native-preview-host");
			if (!t) return;
			let n = document.createComment("SmartBrowser preview");
			e.before(n), t.append(e), v = {
				element: e,
				marker: n
			}, d.nativePreview = !0;
		},
		addToolbarButton(e) {
			if (g) return () => {};
			if (!(e instanceof (e?.ownerDocument?.defaultView?.HTMLElement || HTMLElement)) || !e.matches("button, [role=\"button\"]")) throw TypeError("A toolbar button element is required.");
			if (!_.has(e)) {
				e.textContent.trim() || (e.dataset.sbHostLabel = e.getAttribute("aria-label") || e.title || "");
				let t = document.createComment("SmartBrowser toolbar button");
				e.before(t), _.set(e, t), i.querySelector(".sb-collection-extra-buttons").append(e);
			}
			return () => {
				let t = _.get(e);
				t && (t.replaceWith(e), delete e.dataset.sbHostLabel, _.delete(e));
			};
		},
		destroy() {
			g || (_.forEach((e, t) => {
				e.replaceWith(t), delete t.dataset.sbHostLabel;
			}), _.clear(), v && v.marker.replaceWith(v.element), g = !0, x.destroy(), y.destroy(), S.unmount(), h.delete(i));
		}
	};
	return h.set(i, w), w;
}
window.SmartBrowser = {
	...window.SmartBrowser,
	mountCollection: g,
	SelectionAddress: l,
	createSelectionAddressService: a
}, document.dispatchEvent(new CustomEvent("smartbrowser:collection-ready"));
//#endregion
export { f as n, g as t };
