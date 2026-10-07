import { H as e, M as t, O as n, P as r, R as i, S as a, V as o, W as s, _ as c, b as l, g as u, j as d, l as f, v as p, x as m, y as h, z as g } from "./visual-runtime-BsRY_8Qs.js";
import { a as _, c as v, i as y, n as b, o as x, r as S, s as C, t as w, u as T } from "./visual-runtime-C3qHcZ7w.js";
//#region resources/js/components/CollectionView.vue
var E = ["aria-label", "aria-busy"], D = { class: "resource-browser" }, O = { class: "resource-toolbar sb-collection-toolbar" }, k = { class: "resource-view-controls" }, A = [
	"disabled",
	"title",
	"aria-label"
], j = ["aria-label", "value"], M = { value: "collectionOrder" }, N = ["value"], P = ["title", "aria-label"], F = [
	"title",
	"aria-label",
	"onClick"
], I = {
	key: 0,
	class: "alert alert-danger",
	role: "alert"
}, L = {
	key: 1,
	role: "status"
}, R = {
	key: 2,
	class: "resource-empty-state"
}, z = {
	__name: "CollectionView",
	props: {
		model: Object,
		api: Object,
		config: Object,
		t: Function
	},
	setup(i) {
		let f = i, g = f.model.browser.state;
		g.sortBy = "collectionOrder", g.sortDirection = "asc", g.viewOptions.gridSize = f.config.gridSize || "sm", g.viewOptions.detailsThumbnails = f.config.thumbnails !== !1;
		let b = new S(f.api, g, () => f.model.refresh(), f.t, f.config.editorMode || "modal", f.config.application), x = [
			"edit",
			"preview",
			"download",
			"publish",
			"unpublish",
			"archive",
			"unarchive",
			"trash",
			"restore",
			"checkin",
			"feature",
			"unfeature",
			"share"
		], w = c(() => [...f.model.canRemove ? [{
			id: "collectionRemove",
			label: "COM_SMARTBROWSER_COLLECTION_REMOVE",
			icon: "fas fa-minus",
			requiresSelection: !0
		}] : [], ...f.config.contextActions === !0 && !f.config.readOnly ? g.actions.filter((e) => (f.config.contextActionIds || x).includes(e.id)) : []]), z = (e, t) => !g.loading && !g.busy && (e.id === "collectionRemove" ? f.model.canRemove : !t.some((e) => e.unavailable) && b.available(e, t)), B = (e) => f.config.contextActions === !0 && !f.config.readOnly ? C({
			...e,
			activatable: !e.unavailable
		}, "manage", w.value, z) : null, V = (e) => f.config.contextActions === !0 && !f.config.readOnly ? v(e, "manage", w.value, z) : null, H = (e, t) => e.id === "collectionRemove" ? f.model.remove([t.id]) : z(e, [t]) && b.execute(e, [t]), U = c(() => (g.presentation.sortFields || [{
			id: "title",
			label: "COM_SMARTBROWSER_NAME"
		}]).filter((e) => !["ordering", "collectionOrder"].includes(e.id))), W = (e) => {
			g.sortBy === e ? g.sortDirection = g.sortDirection === "asc" ? "desc" : "asc" : (g.sortBy = e, g.sortDirection = "asc");
		}, G = [{
			id: "grid",
			label: "COM_SMARTBROWSER_GRID",
			icon: "fas fa-th"
		}, {
			id: "details",
			label: "COM_SMARTBROWSER_DETAILS",
			icon: "fas fa-list"
		}], K = c(() => f.model.browser.bulkSelectableResources.value.length > 0 && f.model.browser.bulkSelectableResources.value.every((e) => g.selectedIds.includes(e.id)));
		return n(() => b.destroy()), (n, c) => (d(), m("section", {
			class: "smartbrowser smartbrowser-collection",
			"aria-label": i.t("COM_SMARTBROWSER_COLLECTION_TITLE"),
			"aria-busy": o(g).loading || o(g).busy
		}, [p("div", D, [
			p("header", O, [p("strong", null, [a(s(i.t("COM_SMARTBROWSER_COLLECTION_TITLE")) + " ", 1), p("span", null, s(i.model.getItems().length), 1)]), p("div", k, [
				i.model.canOrder ? (d(), h(T, {
					key: 0,
					enabled: !o(g).loading && !o(g).busy && o(g).selectedIds.length > 0 && o(g).sortBy === "collectionOrder",
					t: i.t,
					onReorder: i.model.move
				}, null, 8, [
					"enabled",
					"t",
					"onReorder"
				])) : l("", !0),
				i.model.canRemove ? (d(), m("button", {
					key: 1,
					class: "resource-icon-button",
					type: "button",
					disabled: !o(g).selectedIds.length || o(g).loading || o(g).busy,
					title: i.t("COM_SMARTBROWSER_COLLECTION_REMOVE"),
					"aria-label": i.t("COM_SMARTBROWSER_COLLECTION_REMOVE"),
					onClick: c[0] ||= (e) => i.model.remove(o(g).selectedIds)
				}, [...c[3] ||= [p("span", {
					class: "fas fa-minus",
					"aria-hidden": "true"
				}, null, -1)]], 8, A)) : l("", !0),
				p("select", {
					"aria-label": i.t("COM_SMARTBROWSER_SORT_BY"),
					value: o(g).sortBy,
					onChange: c[1] ||= (e) => o(g).sortBy = e.target.value
				}, [p("option", M, s(i.t("JGRID_HEADING_ORDERING")), 1), (d(!0), m(u, null, t(U.value, (e) => (d(), m("option", {
					key: e.id,
					value: e.id
				}, s(i.t(e.label)), 9, N))), 128))], 40, j),
				p("button", {
					class: "resource-icon-button",
					type: "button",
					title: i.t("COM_SMARTBROWSER_SORT_DIRECTION"),
					"aria-label": i.t("COM_SMARTBROWSER_SORT_DIRECTION"),
					onClick: c[2] ||= (e) => o(g).sortDirection = o(g).sortDirection === "asc" ? "desc" : "asc"
				}, [p("span", {
					class: e(o(g).sortDirection === "asc" ? "fas fa-sort-amount-up" : "fas fa-sort-amount-down-alt"),
					"aria-hidden": "true"
				}, null, 2)], 8, P),
				(d(), m(u, null, t(G, (t) => p("button", {
					key: t.id,
					class: e(["resource-icon-button", { active: o(g).activeView === t.id }]),
					type: "button",
					title: i.t(t.label),
					"aria-label": i.t(t.label),
					onClick: (e) => o(g).activeView = t.id
				}, [p("span", {
					class: e(t.icon),
					"aria-hidden": "true"
				}, null, 2)], 10, F)), 64))
			])]),
			o(g).error ? (d(), m("p", I, s(o(g).error), 1)) : l("", !0),
			o(g).loading ? (d(), m("p", L, s(i.t("COM_SMARTBROWSER_LOADING")), 1)) : i.model.resources.value.length ? (d(), h(r(o(g).activeView === "details" ? y : _), {
				key: 3,
				resources: i.model.resources.value,
				"selected-ids": o(g).selectedIds,
				"focused-id": o(g).focusedId,
				"all-selected": K.value,
				"selection-controls": i.model.canRemove || i.model.canOrder,
				options: o(g).viewOptions,
				actions: w.value,
				"action-available": z,
				"default-action": B,
				"preview-action": V,
				"grid-fields": o(g).presentation.gridFields || [],
				columns: o(g).presentation.columns || [{
					id: "title",
					label: "COM_SMARTBROWSER_NAME"
				}],
				"sort-by": o(g).sortBy,
				"sort-direction": o(g).sortDirection,
				"sort-fields": U.value,
				"ordering-field": "collectionOrder",
				t: i.t,
				onSelect: i.model.browser.toggle,
				onSelectAll: i.model.browser.selectAll,
				onFocus: i.model.browser.focus,
				onAction: H,
				onSort: W
			}, null, 40, [
				"resources",
				"selected-ids",
				"focused-id",
				"all-selected",
				"selection-controls",
				"options",
				"actions",
				"grid-fields",
				"columns",
				"sort-by",
				"sort-direction",
				"sort-fields",
				"t",
				"onSelect",
				"onSelectAll",
				"onFocus"
			])) : (d(), m("p", R, s(i.t("COM_SMARTBROWSER_COLLECTION_EMPTY")), 1))
		])], 8, E));
	}
}, B = (e) => {
	if (!Array.isArray(e)) throw TypeError("Collection items must be an array.");
	let t = e.map((e) => e && typeof e == "object" ? e.id : e);
	if (t.some((e) => !["string", "number"].includes(typeof e) || String(e) === "")) throw TypeError("Invalid collection identifier.");
	return [...new Set(t.map(String))];
};
function V({ config: e, api: t, notify: n, translate: r }) {
	let a = i(), o = g({
		...e,
		roots: [],
		actions: [],
		multiple: !0,
		selectionTarget: "both",
		mode: e.readOnly ? "readonly" : "manage",
		defaultView: e.layout || "grid"
	}), s = a.run(() => b({
		options: o,
		api: t,
		persistence: {
			load: (e) => e,
			save() {}
		},
		viewRegistry: w().register({
			id: "grid",
			component: {}
		}).register({
			id: "details",
			component: {}
		})
	})), { state: l } = s, u = B(e.items || []), d = 0, f = !1, p = !e.readOnly, m = p && e.allowRemove !== !1, h = p && e.allowOrdering !== !1, _ = (t) => t.map((t) => ({
		...t,
		selectable: p && (m || h),
		bulkSelectable: p && (m || h),
		focusable: p,
		actionable: p,
		navigable: !1,
		activatable: !1,
		interactiveOverlays: p && e.contextActions === !0,
		capabilities: {
			...t.capabilities,
			collectionRemove: m
		}
	})), v = (t) => n({
		adapter: e.adapter,
		mode: "collection",
		items: [...u],
		resources: [...l.items],
		reason: t
	});
	async function y() {
		if (f) return;
		let e = ++d;
		l.loading = !0, l.error = "";
		try {
			let n = await t.collection(u);
			if (f || e !== d) return;
			u = [...n.identifiers], l.items = _(n.resources), l.actions = (n.actions || []).filter((e) => e.requiresSelection && !e.currentNode && ![
				"reorder",
				"removeFromGroup",
				"batch",
				"activate",
				"select"
			].includes(e.id)), l.presentation = n.presentation || {}, o.visualSettings = n.visualSettings, o.imageBackground = n.imageBackground, l.selectedIds = l.selectedIds.filter((e) => u.includes(e));
		} catch (t) {
			if (!f && e === d) throw l.error = t.message, t;
		} finally {
			!f && e === d && (l.loading = !1);
		}
	}
	async function x(e) {
		if (f) throw Error("Collection is destroyed.");
		u = B(e), l.selectedIds = [], l.items = [], l.sortBy = "collectionOrder", l.sortDirection = "asc", await y();
	}
	function S(e) {
		if (!m || f || l.loading || l.busy) return;
		++d;
		let t = new Set(e), n = u.filter((e) => !t.has(e));
		n.length !== u.length && (u = n, l.items = l.items.filter((e) => !t.has(e.id)), l.selectedIds = l.selectedIds.filter((e) => !t.has(e)), v("remove"));
	}
	async function C(e) {
		if (!h || f || l.busy || l.loading || !l.selectedIds.length || !["up", "down"].includes(e) || l.sortBy && l.sortBy !== "collectionOrder") return;
		let n = ++d;
		l.busy = !0;
		try {
			let r = l.sortDirection === "desc" ? e === "up" ? "down" : "up" : e, i = await t.collection(u, {
				operation: "reorder",
				selection: [...l.selectedIds],
				direction: r
			});
			if (f || n !== d) return;
			u = [...i.items];
			let a = new Map(l.items.map((e) => [e.id, e]));
			l.items = u.map((e) => a.get(e)).filter(Boolean), v("reorder");
		} catch (e) {
			!f && n === d && (l.error = e.message);
		} finally {
			f || (l.busy = !1);
		}
	}
	return {
		options: o,
		browser: s,
		resources: a.run(() => c(() => l.sortBy === "collectionOrder" ? l.sortDirection === "desc" ? [...l.items].reverse() : l.items : s.resources.value)),
		canRemove: m,
		canOrder: h,
		refresh: y,
		setItems: x,
		remove: S,
		move: C,
		getItems: () => [...u],
		destroy() {
			f = !0, d++, t.destroy?.(), a.stop();
		}
	};
}
//#endregion
//#region resources/js/collection.js
var H = /* @__PURE__ */ new WeakMap();
function U(e, t = {}) {
	let n = typeof e == "string" ? document.querySelector(e) : e;
	if (!(n instanceof Element)) throw TypeError("A collection requires a container element.");
	if (H.has(n)) throw Error("A SmartBrowser collection is already mounted in this container.");
	let r = {
		...window.Joomla?.getOptions("com_smartbrowser.collection", {}) || {},
		...t
	};
	if (!r.adapter || !r.apiBaseUrl || !r.csrfToken) throw TypeError("Collection adapter, apiBaseUrl and csrfToken are required.");
	if (r.layout && !["grid", "details"].includes(r.layout)) throw TypeError("Collection layout must be grid or details.");
	let i = r.translate || ((e) => window.Joomla?.Text?._(e, e) || e), a = new x({
		...r,
		mode: r.readOnly ? "readonly" : "manage"
	}), o = !1, s = V({
		config: r,
		api: a,
		notify: (e) => {
			o || (n.dispatchEvent(new CustomEvent("smartbrowser:collection-change", {
				detail: e,
				bubbles: !0
			})), r.onChange?.(e));
		},
		translate: i
	}), c = f(z, {
		model: s,
		api: a,
		config: r,
		t: i
	}).provide("smartBrowserOptions", s.options);
	c.mount(n);
	let l = s.refresh();
	l.catch((e) => r.onError?.(e));
	let u = {
		ready: l,
		getItems: s.getItems,
		setItems: (e) => s.setItems(e),
		refresh: () => s.refresh(),
		destroy() {
			o || (o = !0, s.destroy(), c.unmount(), H.delete(n));
		}
	};
	return H.set(n, u), u;
}
window.SmartBrowser = {
	...window.SmartBrowser,
	mountCollection: U
}, document.dispatchEvent(new CustomEvent("smartbrowser:collection-ready"));
//#endregion
export { U as mountCollection };
