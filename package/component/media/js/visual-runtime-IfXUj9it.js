import { B as e, C as t, D as n, F as r, H as i, M as a, O as o, S as s, U as c, V as l, W as u, _ as d, b as f, g as p, h as m, j as h, k as g, m as _, t as v, v as y, x as b, z as x } from "./visual-runtime-BsRY_8Qs.js";
import { t as S } from "./visual-runtime-CEVDGWRG.js";
//#region resources/js/core/fieldIcons.js
var C = {
	title: null,
	name: null,
	alias: "fas fa-link",
	status: "fas fa-check-circle",
	stateLabel: "fas fa-check-circle",
	author: "fas fa-user",
	category: "fas fa-folder",
	categoryPath: "fas fa-folder",
	parent: "fas fa-folder",
	parentPath: "fas fa-folder",
	location: "fas fa-folder",
	locationPath: "fas fa-folder",
	tagPaths: "fas fa-tags",
	created: "fas fa-calendar",
	modified: "fas fa-calendar",
	registered: "fas fa-calendar",
	lastVisit: "fas fa-clock",
	language: "fas fa-globe",
	languageKey: "fas fa-language",
	id: "fas fa-key",
	access: "fas fa-lock",
	size: "fas fa-database",
	dimension: "fas fa-expand",
	width: "fas fa-expand",
	ordering: "fas fa-sort",
	menu: "fas fa-bars",
	menuItemType: "fas fa-file-alt",
	shortcut: "fas fa-link",
	url: "fas fa-link",
	link: "fas fa-link",
	username: "fas fa-user",
	email: "fas fa-envelope",
	groups: "fas fa-users",
	tags: "fas fa-tags",
	mimeType: "fas fa-file-alt",
	extension: "fas fa-tag",
	type: "fas fa-file-alt"
}, w = (e) => e.icon || e.headerIcon || C[e.id || String(e.source || "").split(".").pop()] || (e.format === "date" ? "fas fa-calendar" : "fas fa-info"), T = { class: "resource-ordering-moves" }, E = [
	"disabled",
	"title",
	"aria-label"
], D = [
	"disabled",
	"title",
	"aria-label"
], O = {
	__name: "ResourceOrderingControls",
	props: {
		enabled: Boolean,
		t: Function
	},
	emits: ["reorder"],
	setup(e) {
		return (t, n) => (h(), b("span", T, [y("button", {
			type: "button",
			disabled: !e.enabled,
			title: e.t("COM_SMARTBROWSER_MOVE_UP"),
			"aria-label": e.t("COM_SMARTBROWSER_MOVE_UP"),
			onClick: n[0] ||= (e) => t.$emit("reorder", "up")
		}, [...n[2] ||= [y("span", {
			class: "fas fa-arrow-up",
			"aria-hidden": "true"
		}, null, -1)]], 8, E), y("button", {
			type: "button",
			disabled: !e.enabled,
			title: e.t("COM_SMARTBROWSER_MOVE_DOWN"),
			"aria-label": e.t("COM_SMARTBROWSER_MOVE_DOWN"),
			onClick: n[1] ||= (e) => t.$emit("reorder", "down")
		}, [...n[3] ||= [y("span", {
			class: "fas fa-arrow-down",
			"aria-hidden": "true"
		}, null, -1)]], 8, D)]));
	}
}, k = "contextual", A = (e, t) => ({
	...e,
	focusable: e.focusable ?? t.focusable,
	selectable: e.selectable ?? t.selectable,
	bulkSelectable: e.bulkSelectable ?? e.selectable ?? t.bulkSelectable,
	actionable: e.actionable ?? t.actionable,
	navigable: e.navigable ?? t.navigable,
	activatable: e.activatable ?? t.activatable
}), j = (e) => A({
	...e,
	role: e.role || "primary"
}, {
	focusable: !0,
	selectable: !1,
	bulkSelectable: !1,
	actionable: !0,
	navigable: !1,
	activatable: !0
}), M = (e) => ({
	...e,
	role: k,
	focusable: e.focusable ?? !0,
	selectable: !1,
	bulkSelectable: !1,
	actionable: !1,
	navigable: !1,
	activatable: !1,
	interactiveOverlays: !1,
	capabilities: {}
}), N = (e) => e?.role === k, P = (e) => e?.focusable === !0, F = (e, t = "both") => e?.selectable === !0 && (t === "both" || e.kind === t), I = (e, t = "both") => F(e, t) && e?.bulkSelectable === !0, L = (e) => e?.actionable === !0, R = (e, t, n, r) => ["manage", "select"].includes(t) && L(e) && n.find((t) => t.id === "preview" && r(t, [e])) || null;
function ee(e, t, n, r, i = "both") {
	return e?.navigable ? {
		id: "browseOpen",
		label: "COM_SMARTBROWSER_OPEN",
		icon: "fas fa-folder-open",
		local: !0
	} : e?.activatable ? t === "select" ? F(e, i) ? {
		id: "pickerSelect",
		label: "COM_SMARTBROWSER_SELECT",
		icon: "fas fa-check",
		local: !0
	} : null : L(e) && n.find((n) => n.id === (t === "manage" ? "edit" : "preview") && r(n, [e])) || null : null;
}
//#endregion
//#region resources/js/services/ResourceApi.js
function z(e, t = 0, n = (e) => e) {
	let r = e?.messages && typeof e.messages == "object" ? Object.values(e.messages).flat() : [], i = [...new Set([e?.message, ...r].filter((e) => typeof e == "string" && e.trim()).map((e) => e.trim()))];
	return i.length ? i.join("; ") : t === 413 ? n("COM_SMARTBROWSER_ERROR_REQUEST_TOO_LARGE") : t ? n("COM_SMARTBROWSER_ERROR_REQUEST_HTTP").replace("%s", String(t)) : n("COM_SMARTBROWSER_ERROR_REQUEST_NETWORK");
}
var B = class {
	constructor(e) {
		this.options = e, this.pending = /* @__PURE__ */ new Map();
	}
	async getResources(e, t = {}) {
		let n = new URL(`${this.options.apiBaseUrl}&task=api.resources&adapter=${encodeURIComponent(this.options.adapter)}`);
		return n.searchParams.set("mode", this.options.mode || "manage"), this.options.browseRoot && n.searchParams.set("browseRoot", this.options.browseRoot), this.options.flatScope && n.searchParams.set("flatScope", this.options.flatScope), n.searchParams.set("node", e), t.search && n.searchParams.set("search", t.search), t.sortBy && n.searchParams.set("sortBy", t.sortBy), t.sortDirection && n.searchParams.set("sortDirection", t.sortDirection), t.filters && n.searchParams.set("filters", JSON.stringify(t.filters)), n.searchParams.set("showContextResources", this.options.showContextResources ? "1" : "0"), this.request(n);
	}
	async execute(e, t = [], n = {}) {
		let r = new URL(`${this.options.apiBaseUrl}&task=api.action&adapter=${encodeURIComponent(this.options.adapter)}`);
		return r.searchParams.set("mode", this.options.mode || "manage"), this.options.browseRoot && r.searchParams.set("browseRoot", this.options.browseRoot), this.options.flatScope && r.searchParams.set("flatScope", this.options.flatScope), this.request(r, {
			method: "POST",
			body: JSON.stringify({
				action: e,
				selection: t,
				payload: n,
				[this.options.csrfToken]: 1
			})
		});
	}
	collection(e, t = {}) {
		let n = new URL(this.options.apiBaseUrl, window.location.href);
		return n.searchParams.set("task", "api.collection"), n.searchParams.set("adapter", this.options.adapter), n.searchParams.set("mode", this.options.mode || "manage"), this.request(n, {
			method: "POST",
			body: JSON.stringify({
				...t,
				items: e,
				[this.options.csrfToken]: 1
			})
		});
	}
	request(e, t = {}) {
		let n;
		return new Promise((r, i) => {
			n = Joomla.request({
				url: e.toString(),
				method: t.method || "GET",
				data: t.body,
				headers: { "Content-Type": "application/json" },
				onSuccess: (e) => {
					let t;
					try {
						t = JSON.parse(e);
					} catch (e) {
						i(e);
						return;
					}
					if (t.data?.authenticationRequired) this.redirectToLogin(t.data.loginUrl), i(Error(t.message));
					else if (t.success === !1) {
						let e = Error(z(t, Number(t.code) || 0, (e) => Joomla.Text?._(e, e) || e));
						e.status = Number(t.code) || 0, i(e);
					} else r(t.data);
				},
				onError: (e) => {
					let t = null;
					try {
						t = JSON.parse(e.responseText || e.response), (e.status === 401 || t.data?.authenticationRequired) && this.redirectToLogin(t.data?.loginUrl);
					} catch {
						e.status === 401 && this.redirectToLogin();
					}
					let n = z(t, Number(e.status) || 0, (e) => Joomla.Text?._(e, e) || e), r = Error(n);
					r.status = Number(e.status) || 0, i(r);
				}
			}), n && this.pending.set(n, i);
		}).finally(() => this.pending.delete(n));
	}
	destroy() {
		for (let [e, t] of this.pending) e.abort?.(), t(/* @__PURE__ */ Error("SmartBrowser request cancelled."));
		this.pending.clear();
	}
	redirectToLogin(e = null) {
		let t = e || this.options.loginUrl;
		t && window.top.location.assign(t);
	}
}, V = (e, t, n, r = null) => {
	if (!t?.actionable) return r ? [{
		...r,
		isDefault: !0
	}] : [];
	let i = [t], a = [], o = /* @__PURE__ */ new Set();
	for (let r of e || []) {
		if (!r.requiresSelection || r.id === "checkin" && !n(r, i) || r.id === "removeFromGroup" && !n(r, i)) continue;
		if (!r.exclusiveGroup) {
			a.push(r);
			continue;
		}
		if (o.has(r.exclusiveGroup)) continue;
		o.add(r.exclusiveGroup);
		let s = e.filter((e) => e.requiresSelection && e.exclusiveGroup === r.exclusiveGroup), c = s.find((e) => n(e, i)), l = t.overlays?.find((e) => s.some((t) => t.id === e.action))?.action;
		a.push(c || s.find((e) => e.id === l) || s[0]);
	}
	return r ? [{
		...r,
		isDefault: !0
	}, ...a.filter((e) => e.id !== r.id)] : a;
}, H = { class: "resource-grid-select-all" }, U = ["checked", "aria-label"], W = [
	"role",
	"tabindex",
	"aria-pressed",
	"onClick",
	"onDblclick",
	"onKeydown"
], G = [
	"checked",
	"aria-label",
	"onChange"
], K = [
	"aria-expanded",
	"title",
	"onClick"
], q = ["disabled", "onClick"], J = { class: "resource-item-visual" }, Y = {
	key: 0,
	class: "resource-item-overlays"
}, X = ["title", "onClick"], Z = ["src"], Q = ["title"], $ = ["src"], te = ["title"], ne = ["title"], re = { class: "resource-item-metadata-text" }, ie = {
	__name: "ResourceGrid",
	props: {
		defaultAction: Function,
		previewAction: Function,
		selectionControls: {
			type: Boolean,
			default: !0
		},
		resources: Array,
		selectedIds: Array,
		focusedId: String,
		allSelected: Boolean,
		options: Object,
		actions: Array,
		actionAvailable: Function,
		gridFields: Array,
		t: Function
	},
	emits: [
		"select",
		"select-all",
		"focus",
		"open",
		"activate",
		"action"
	],
	setup(r, { emit: d }) {
		let x = r, S = d, C = (e, t) => {
			if ((t?.ctrlKey || t?.metaKey) && x.previewAction) {
				let t = x.previewAction(e);
				if (t && x.actionAvailable(t, [e])) {
					S("action", t, e);
					return;
				}
			}
			if (x.defaultAction) {
				let t = x.defaultAction(e);
				t && x.actionAvailable(t, [e]) && S("action", t, e);
			} else e.navigable ? S("open", e.id) : e.activatable ? S("activate", e) : S("focus", e);
		}, w = e(null), T = e(!1), E = e(0), D = async (e, t) => {
			if (w.value === e) {
				w.value = null;
				return;
			}
			let r = t.currentTarget.closest(".resource-browser-item"), i = r?.closest(".resource-browser");
			if (T.value = !1, E.value = i ? Math.max(0, Math.min(360, i.clientWidth - 8, window.innerWidth - 20)) : 0, w.value = e, await n(), w.value !== e || !i) return;
			let a = r.querySelector(".resource-item-menu");
			T.value = a?.getBoundingClientRect().left < i.getBoundingClientRect().left + 4;
		}, O = (e) => V(x.actions, e, x.actionAvailable, x.defaultAction?.(e)), k = (e, t) => L(t) && t.interactiveOverlays !== !1 ? x.actions.find((n) => n.id === e.action && x.actionAvailable(n, [t])) : void 0, A = () => {
			w.value = null;
		}, j = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e), M = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, I = (e) => {
			let t = e.metadata || {}, n = (e, t, n, r = !1) => t ? {
				label: e,
				value: t,
				icon: n,
				identifier: r
			} : null;
			return e.type === "user" ? [n("COM_SMARTBROWSER_USERNAME", t.username, "fas fa-user", !0), n("JGLOBAL_EMAIL", t.email, "fas fa-envelope")].filter(Boolean) : t.alias || t.languageKey || t.menuItemType ? [
				n("COM_SMARTBROWSER_ALIAS_LABEL", t.alias, "fas fa-link", !0),
				n("COM_SMARTBROWSER_MENU_ITEM_TYPE", t.menuItemType, "fas fa-file-alt"),
				n("COM_SMARTBROWSER_LANGUAGE_KEY", t.languageKey, "fas fa-language"),
				e.type === "article" && x.gridFields?.some((e) => e.source === "metadata.cardSummaryWithCategory") ? n("JCATEGORY", t.category, "fas fa-folder") : null
			].filter(Boolean) : e.kind === "item" && t.mimeType ? [n("COM_SMARTBROWSER_MIME_TYPE", t.mimeType, "fas fa-file-alt"), e.type === "image" && t.width > 0 && t.height > 0 ? n("COM_SMARTBROWSER_DIMENSIONS", `${t.width} × ${t.height}`, "fas fa-expand") : null].filter(Boolean) : (x.gridFields || []).map((t) => n(t.label || "COM_SMARTBROWSER_DETAILS", t.format === "date" ? M(j(e, t.source)) : j(e, t.source), "fas fa-info")).filter(Boolean);
		};
		return g(() => document.addEventListener("click", A)), o(() => document.removeEventListener("click", A)), (e, n) => (h(), b("div", { class: i(["resource-browser-grid", `size-${r.options.gridSize}`]) }, [r.selectionControls ? (h(), b("div", {
			key: 0,
			class: i(["resource-view-icons", { active: r.allSelected }])
		}, [y("label", H, [y("input", {
			type: "checkbox",
			checked: r.allSelected,
			"aria-label": r.t("COM_SMARTBROWSER_SELECT_ALL"),
			onChange: n[0] ||= (t) => e.$emit("select-all")
		}, null, 40, U)])], 2)) : f("", !0), (h(!0), b(p, null, a(r.resources, (o) => (h(), b("div", {
			key: o.id,
			class: i(["resource-browser-item", {
				selected: r.selectedIds.includes(o.id),
				focused: r.focusedId === o.id,
				active: w.value === o.id,
				contextual: l(N)(o)
			}]),
			role: l(P)(o) ? "button" : void 0,
			tabindex: l(P)(o) ? 0 : void 0,
			"aria-pressed": l(F)(o) ? r.selectedIds.includes(o.id) : void 0,
			onClick: m((t) => {
				w.value = null, e.$emit("select", o, t.ctrlKey || t.metaKey);
			}, ["stop"]),
			onDblclick: m((e) => C(o, e), ["stop"]),
			onKeydown: _(m((e) => C(o), ["prevent"]), ["enter"]),
			onMouseleave: n[3] ||= (e) => w.value = null
		}, [
			l(F)(o) ? (h(), b("label", {
				key: 0,
				class: i(["resource-item-select", { checked: r.selectedIds.includes(o.id) }]),
				onClick: n[1] ||= m(() => {}, ["stop"])
			}, [y("input", {
				type: "checkbox",
				checked: r.selectedIds.includes(o.id),
				"aria-label": o.title,
				onChange: (t) => e.$emit("select", o, !0)
			}, null, 40, G)], 2)) : f("", !0),
			O(o).length ? (h(), b("button", {
				key: 1,
				type: "button",
				class: "resource-item-menu-toggle",
				"aria-expanded": w.value === o.id,
				title: r.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: m((t) => {
					e.$emit("focus", o), D(o.id, t);
				}, ["stop"])
			}, [...n[4] ||= [y("span", {
				class: "fas fa-ellipsis-h",
				"aria-hidden": "true"
			}, null, -1)]], 8, K)) : f("", !0),
			w.value === o.id ? (h(), b("div", {
				key: 2,
				class: i(["resource-item-menu", { "align-start": T.value }]),
				style: c(E.value ? { maxWidth: `${E.value}px` } : null),
				onClick: n[2] ||= m(() => {}, ["stop"])
			}, [y("strong", null, u(o.title), 1), (h(!0), b(p, null, a(O(o), (t) => (h(), b("button", {
				key: t.id,
				type: "button",
				class: i([`resource-action-${t.id}`, { "resource-default-action": t.isDefault }]),
				disabled: !r.actionAvailable(t, [o]),
				onClick: (n) => {
					w.value = null, e.$emit("action", t, o);
				}
			}, [y("span", {
				class: i(t.icon),
				"aria-hidden": "true"
			}, null, 2), s(" " + u(r.t(t.label)), 1)], 10, q))), 128))], 6)) : f("", !0),
			y("span", J, [t(v, { resource: o }, null, 8, ["resource"]), o.overlays?.length ? (h(), b("span", Y, [(h(!0), b(p, null, a(o.overlays, (t) => (h(), b(p, { key: t.id }, [k(t, o) ? (h(), b("button", {
				key: 0,
				type: "button",
				class: i(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label,
				onClick: m((n) => {
					e.$emit("focus", o), e.$emit("action", k(t, o), o);
				}, ["stop"])
			}, [t.image ? (h(), b("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, Z)) : (h(), b("span", {
				key: 1,
				class: i(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, X)) : (h(), b("span", {
				key: 1,
				class: i(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label
			}, [t.image ? (h(), b("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, $)) : (h(), b("span", {
				key: 1,
				class: i(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, Q))], 64))), 128))])) : f("", !0)]),
			y("span", {
				class: "resource-item-title",
				title: `${r.t("COM_SMARTBROWSER_NAME")}: ${o.title}`
			}, u(o.title), 9, te),
			(h(!0), b(p, null, a(I(o), (e) => (h(), b("span", {
				key: e.label,
				class: i(["resource-item-metadata", { "resource-item-identifier": e.identifier }]),
				title: `${r.t(e.label)}: ${e.value}`
			}, [y("span", {
				class: i(e.icon),
				"aria-hidden": "true"
			}, null, 2), y("span", re, u(e.value), 1)], 10, ne))), 128))
		], 42, W))), 128))], 2));
	}
}, ae = { class: "table-responsive resource-details-view" }, oe = { class: "table table-hover" }, se = {
	class: "resource-type-column resource-details-select-column",
	scope: "col"
}, ce = { class: "resource-details-select-controls" }, le = {
	key: 0,
	class: "resource-details-select-all"
}, ue = ["checked", "aria-label"], de = ["title"], fe = [
	"title",
	"aria-label",
	"onClick"
], pe = ["title"], me = [
	"tabindex",
	"aria-current",
	"onClick",
	"onDblclick",
	"onKeydown"
], he = { class: "resource-type-column" }, ge = [
	"checked",
	"aria-label",
	"onChange"
], _e = ["title"], ve = { class: "resource-cell-ellipsis" }, ye = ["title"], be = ["title", "onClick"], xe = { class: "visually-hidden" }, Se = ["title"], Ce = { class: "visually-hidden" }, we = {
	key: 1,
	class: "resource-language"
}, Te = ["src"], Ee = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, De = { class: "resource-language-name" }, Oe = {
	key: 2,
	class: "resource-cell-ellipsis"
}, ke = {
	key: 3,
	class: "resource-row-overlays"
}, Ae = ["title", "onClick"], je = ["src"], Me = ["title"], Ne = ["src"], Pe = { class: "resource-row-actions" }, Fe = [
	"aria-expanded",
	"title",
	"onClick"
], Ie = ["disabled", "onClick"], Le = {
	__name: "ResourceDetails",
	props: {
		defaultAction: Function,
		previewAction: Function,
		selectionControls: {
			type: Boolean,
			default: !0
		},
		resources: Array,
		selectedIds: Array,
		focusedId: String,
		allSelected: Boolean,
		options: Object,
		actions: Array,
		actionAvailable: Function,
		sortBy: String,
		sortDirection: String,
		sortFields: Array,
		orderingField: String,
		columns: Array,
		t: Function
	},
	emits: [
		"select",
		"select-all",
		"focus",
		"open",
		"activate",
		"sort",
		"action"
	],
	setup(n, { emit: r }) {
		let x = n, S = r, w = (e, t) => {
			if ((t?.ctrlKey || t?.metaKey) && x.previewAction) {
				let t = x.previewAction(e);
				if (t && x.actionAvailable(t, [e])) {
					S("action", t, e);
					return;
				}
			}
			if (x.defaultAction) {
				let t = x.defaultAction(e);
				t && x.actionAvailable(t, [e]) && S("action", t, e);
			} else e.navigable ? S("open", e.id) : e.activatable ? S("activate", e) : S("focus", e);
		}, T = [
			{
				id: "title",
				label: "COM_SMARTBROWSER_NAME"
			},
			{
				id: "size",
				label: "COM_SMARTBROWSER_SIZE"
			},
			{
				id: "dimension",
				label: "COM_SMARTBROWSER_DIMENSIONS"
			},
			{
				id: "created",
				label: "COM_SMARTBROWSER_DATE_CREATED"
			},
			{
				id: "modified",
				label: "COM_SMARTBROWSER_DATE_MODIFIED"
			}
		], E = () => [
			"created",
			"modified",
			"both"
		].includes(x.options.detailsDateMode) ? x.options.detailsDateMode : "modified", D = (e) => {
			if (!e.dateGroup) return [e];
			let t = e.fields || [];
			return E() === "both" ? t : t.filter((e) => e.id === E());
		}, O = d(() => (x.columns?.length ? x.columns : T).flatMap(D)), k = d(() => 44 + 24 * Math.max(0, ...(x.resources || []).map((e) => (e.overlays || []).filter((e) => e.id !== "status").length))), A = d(() => Math.max(48, 24 + 8 * Math.max(1, ...(x.resources || []).map((e) => String(e.metadata?.id ?? "").length)))), j = (e) => {
			let t = e.id === "status" && e.overlays ? k.value : e.id === "id" ? A.value : null;
			return t === null ? null : {
				width: `${t}px`,
				minWidth: `${t}px`
			};
		}, M = (e) => e.headerIcon || (Object.hasOwn(C, e.id) ? C[e.id] : "fas fa-info"), I = (e) => e.sortField || e.id, R = (e) => x.t(e.label), ee = (e) => (x.sortFields || T).some((t) => t.id === I(e)), z = (e) => x.sortBy === e ? x.sortDirection === "asc" ? "fas fa-caret-up ms-1" : "fas fa-caret-down ms-1" : "fas fa-sort ms-1", B = (e) => e ? `${(e / 1024).toFixed(2)}KB` : "", H = (e) => e.metadata.width && e.metadata.height ? `${e.metadata.width}px \u00d7 ${e.metadata.height}px` : "", U = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, W = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e), G = (e, t) => {
			if (t.id === "size") return e.kind === "node" ? "" : B(e.metadata.size);
			if (t.id === "dimension") return H(e);
			let n = t.source || `metadata.${t.id}`, r = W(e, n);
			return t.format === "size" ? B(r) : t.format === "dimensions" ? H(e) : t.format === "date" || ["created", "modified"].includes(t.id) ? U(r) : t.format === "mediaType" ? x.t({
				folder: "COM_SMARTBROWSER_FOLDER",
				image: "COM_SMARTBROWSER_MEDIA_IMAGE",
				document: "COM_SMARTBROWSER_MEDIA_DOCUMENT",
				video: "COM_SMARTBROWSER_MEDIA_VIDEO",
				audio: "COM_SMARTBROWSER_MEDIA_AUDIO"
			}[r] || "COM_SMARTBROWSER_RESOURCE") : t.format === "language" && r === "*" ? x.t("COM_SMARTBROWSER_ALL_LANGUAGES") : r ?? "";
		}, K = (e, t) => t.id === "location" ? String(e.metadata?.locationPath || G(e, t) || "") : t.format === "status" ? q(e).label : String(G(e, t) || ""), q = (e) => ({
			icon: e.statusPresentation?.icon || "fas fa-question-circle",
			label: e.statusPresentation?.label || G(e, { source: "metadata.stateLabel" }),
			class: `status-${e.statusPresentation?.tone || "neutral"}`
		}), J = (e) => e.overlays?.find((e) => e.id === "status") || {}, Y = e(null), X = (e) => {
			Y.value = Y.value === e ? null : e;
		}, Z = (e) => V(x.actions, e, x.actionAvailable, x.defaultAction?.(e)), Q = (e, t) => L(t) && t.interactiveOverlays !== !1 ? x.actions.find((n) => n.id === e.action && x.actionAvailable(n, [t])) : void 0, $ = () => {
			Y.value = null;
		};
		return g(() => document.addEventListener("click", $)), o(() => document.removeEventListener("click", $)), (e, r) => (h(), b("div", ae, [y("table", oe, [y("thead", null, [y("tr", null, [
			y("th", se, [y("span", ce, [n.selectionControls ? (h(), b("label", le, [y("input", {
				type: "checkbox",
				checked: n.allSelected,
				"aria-label": n.t("COM_SMARTBROWSER_SELECT_ALL"),
				onChange: r[0] ||= (t) => e.$emit("select-all")
			}, null, 40, ue)])) : f("", !0), n.orderingField ? (h(), b("button", {
				key: 1,
				type: "button",
				class: "resource-ordering-sort",
				title: n.t("JGRID_HEADING_ORDERING"),
				onClick: r[1] ||= (t) => e.$emit("sort", n.orderingField)
			}, [y("span", {
				class: i(z(n.orderingField)),
				"aria-hidden": "true"
			}, null, 2)], 8, de)) : f("", !0)])]),
			(h(!0), b(p, null, a(O.value, (t) => (h(), b("th", {
				key: t.id,
				class: i(`resource-column-${t.id}`),
				style: c(j(t)),
				scope: "col"
			}, [ee(t) ? (h(), b("button", {
				key: 0,
				type: "button",
				class: "btn btn-link",
				title: R(t),
				"aria-label": R(t),
				onClick: (n) => e.$emit("sort", I(t))
			}, [
				M(t) ? (h(), b("span", {
					key: 0,
					class: i(M(t)),
					"aria-hidden": "true"
				}, null, 2)) : f("", !0),
				y("span", { class: i(["resource-header-text", { "resource-header-primary": ["title", "name"].includes(t.id) }]) }, u(R(t)), 3),
				y("span", {
					class: i(z(I(t))),
					"aria-hidden": "true"
				}, null, 2)
			], 8, fe)) : (h(), b("span", {
				key: 1,
				class: "resource-column-label",
				title: R(t)
			}, [M(t) ? (h(), b("span", {
				key: 0,
				class: i(M(t)),
				"aria-hidden": "true"
			}, null, 2)) : f("", !0), y("span", { class: i(["resource-header-text", { "resource-header-primary": ["title", "name"].includes(t.id) }]) }, u(t.shortLabel ? n.t(t.shortLabel) : R(t)), 3)], 8, pe))], 6))), 128)),
			r[4] ||= y("th", {
				class: "resource-row-actions",
				scope: "col"
			}, null, -1)
		])]), y("tbody", null, [(h(!0), b(p, null, a(n.resources, (o) => (h(), b("tr", {
			key: o.id,
			class: i({
				selected: n.selectedIds.includes(o.id),
				focused: n.focusedId === o.id,
				focusable: l(P)(o),
				contextual: l(N)(o)
			}),
			tabindex: l(P)(o) ? 0 : void 0,
			"aria-current": n.focusedId === o.id ? "true" : void 0,
			onClick: m((t) => {
				Y.value = null, e.$emit("select", o, t.ctrlKey || t.metaKey);
			}, ["stop"]),
			onDblclick: m((e) => w(o, e), ["stop"]),
			onKeydown: _(m((e) => w(o), ["prevent"]), ["enter"])
		}, [
			y("td", he, [t(v, {
				resource: o,
				variant: "compact",
				"allow-image": n.options.detailsThumbnails
			}, null, 8, ["resource", "allow-image"]), l(F)(o) ? (h(), b("label", {
				key: 0,
				class: i(["resource-row-select", { checked: n.selectedIds.includes(o.id) }]),
				onClick: r[2] ||= m(() => {}, ["stop"])
			}, [y("input", {
				type: "checkbox",
				checked: n.selectedIds.includes(o.id),
				"aria-label": o.title,
				onChange: (t) => e.$emit("select", o, !0)
			}, null, 40, ge)], 2)) : f("", !0)]),
			y("th", {
				class: "resource-title-cell",
				scope: "row",
				title: o.title
			}, [y("span", ve, u(o.title), 1)], 8, _e),
			(h(!0), b(p, null, a(O.value.slice(1), (t) => (h(), b("td", {
				key: t.id,
				class: i(`resource-column-${t.id}`),
				style: c(j(t)),
				title: K(o, t)
			}, [y("span", { class: i(["resource-cell-content", { "resource-status-group": t.format === "status" }]) }, [t.format === "status" && o.statusPresentation ? (h(), b(p, { key: 0 }, [Q(J(o), o) ? (h(), b("button", {
				key: 0,
				type: "button",
				class: i(["resource-status-icon", q(o).class]),
				title: q(o).label,
				onClick: m((t) => {
					e.$emit("focus", o), e.$emit("action", Q(J(o), o), o);
				}, ["stop"])
			}, [y("span", {
				class: i(q(o).icon),
				"aria-hidden": "true"
			}, null, 2), y("span", xe, u(q(o).label), 1)], 10, be)) : (h(), b("span", {
				key: 1,
				class: i(["resource-status-icon", q(o).class]),
				title: q(o).label
			}, [y("span", {
				class: i(q(o).icon),
				"aria-hidden": "true"
			}, null, 2), y("span", Ce, u(q(o).label), 1)], 10, Se))], 64)) : t.format === "language" ? (h(), b("span", we, [o.metadata.languageImage ? (h(), b("img", {
				key: 0,
				src: o.metadata.languageImage,
				alt: ""
			}, null, 8, Te)) : o.metadata.language === "*" ? (h(), b("span", Ee)) : f("", !0), y("span", De, u(G(o, t)), 1)])) : (h(), b("span", Oe, u(G(o, t)), 1)), t.overlays && o.overlays?.length ? (h(), b("span", ke, [(h(!0), b(p, null, a(o.overlays.filter((e) => e.id !== "status"), (t) => (h(), b(p, { key: t.id }, [Q(t, o) ? (h(), b("button", {
				key: 0,
				type: "button",
				class: i(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label,
				onClick: m((n) => {
					e.$emit("focus", o), e.$emit("action", Q(t, o), o);
				}, ["stop"])
			}, [t.image ? (h(), b("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, je)) : (h(), b("span", {
				key: 1,
				class: i(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, Ae)) : (h(), b("span", {
				key: 1,
				class: i(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label
			}, [t.image ? (h(), b("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, Ne)) : (h(), b("span", {
				key: 1,
				class: i(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, Me))], 64))), 128))])) : f("", !0)], 2)], 14, ye))), 128)),
			y("td", Pe, [Z(o).length ? (h(), b("button", {
				key: 0,
				type: "button",
				class: "resource-row-menu-toggle",
				"aria-expanded": Y.value === o.id,
				title: n.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: m((t) => {
					e.$emit("focus", o), X(o.id);
				}, ["stop"])
			}, [...r[5] ||= [y("span", {
				class: "fas fa-ellipsis-h",
				"aria-hidden": "true"
			}, null, -1)]], 8, Fe)) : f("", !0), Y.value === o.id ? (h(), b("div", {
				key: 1,
				class: "resource-item-menu resource-row-menu",
				onClick: r[3] ||= m(() => {}, ["stop"])
			}, [y("strong", null, u(o.title), 1), (h(!0), b(p, null, a(Z(o), (t) => (h(), b("button", {
				key: t.id,
				type: "button",
				class: i([`resource-action-${t.id}`, { "resource-default-action": t.isDefault }]),
				disabled: !n.actionAvailable(t, [o]),
				onClick: (n) => {
					Y.value = null, e.$emit("action", t, o);
				}
			}, [y("span", {
				class: i(t.icon),
				"aria-hidden": "true"
			}, null, 2), s(" " + u(n.t(t.label)), 1)], 10, Ie))), 128))])) : f("", !0)])
		], 42, me))), 128))])])]));
	}
}, Re = (e, t = "") => window.prompt(e, t), ze = (e) => {
	if (!e.metadata?.url) return null;
	let t = (e.metadata.mimeType || "").toLowerCase();
	return t.startsWith("image/") ? "image" : /^video\/(mp4|webm|ogg)$/.test(t) ? "video" : /^audio\/(mpeg|mp4|ogg|wav|webm)$/.test(t) ? "audio" : t === "application/pdf" ? "pdf" : null;
}, Be = class {
	constructor(e, t, n, r, i = "modal", a = "administrator") {
		this.api = e, this.state = t, this.reload = n, this.translate = r, this.editorMode = i, this.application = a, this.dialogs = /* @__PURE__ */ new Set(), this.dialogCleanups = /* @__PURE__ */ new Map();
	}
	destroy() {
		this.destroyed = !0;
		for (let e of this.dialogs) this.dialogCleanups.get(e)?.(), e.remove();
		this.dialogs.clear(), this.dialogCleanups.clear();
	}
	ownDialog(e, t = () => {}) {
		if (this.destroyed) {
			t(), e.remove();
			return;
		}
		this.dialogs.add(e), this.dialogCleanups.set(e, t), e.addEventListener("close", () => {
			t(), this.dialogs.delete(e), this.dialogCleanups.delete(e);
		}, { once: !0 }), document.body.appendChild(e);
	}
	available(e, t) {
		return this.destroyed || e.currentNode && this.state.currentResource?.capabilities?.[e.id] === !1 || e.requiresSelection && t.length === 0 || e.single && t.length !== 1 || e.itemsOnly && t.some((e) => e.kind !== "item") || e.nodesOnly && t.some((e) => e.kind !== "node") ? !1 : e.exclusiveGroup && t.length ? t.some((t) => t.capabilities?.[e.id] === !0) : e.requiresSelection && t.length ? t.every((t) => t.capabilities?.[e.id] === !0) : !0;
	}
	async execute(e, t) {
		if (!this.state.busy) {
			this.state.busy = !0;
			try {
				return await this.executeUnchecked(e, t);
			} catch (e) {
				Joomla.renderMessages({ error: [e.message] });
			} finally {
				this.state.busy = !1;
			}
		}
	}
	async executeUnchecked(e, t) {
		if (!this.available(e, t)) return;
		let n = e.exclusiveGroup ? t.filter((t) => t.capabilities?.[e.id] === !0) : t, r = n.map((e) => e.id);
		if (e.id === "upload") return this.pickUpload();
		if (e.id === "createNode") {
			let t = Re(this.translate("COM_SMARTBROWSER_NEW_FOLDER_NAME"));
			t && await this.mutate(e.id, [], {
				nodeId: this.state.selectedNode,
				name: t
			});
			return;
		}
		if (e.currentNode) {
			let t = await this.api.execute(e.id, [], { nodeId: this.state.selectedNode });
			t?.command === "openEditor" ? this.openEditor(t.url) : await this.reload();
			return;
		}
		if (e.id === "rename") {
			let n = Re(this.translate("COM_SMARTBROWSER_RENAME_TO"), t[0].title);
			n && n !== t[0].title && await this.mutate(e.id, r, { name: n });
			return;
		}
		if (e.id === "delete") {
			window.confirm(this.translate("COM_SMARTBROWSER_CONFIRM_DELETE")) && await this.mutate(e.id, r);
			return;
		}
		if (e.id === "removeFromGroup") {
			let t = Object.fromEntries(n.map((e) => [e.id, e.metadata?.sourceGroupId]));
			if (r.some((e) => !t[e])) return;
			window.confirm(this.translate("COM_SMARTBROWSER_CONFIRM_REMOVE_FROM_GROUP")) && await this.mutate(e.id, r, { groups: t });
			return;
		}
		let i = await this.api.execute(e.id, r);
		if (i?.command === "previewUrl") {
			this.previewUrl(i.url, i.title);
			return;
		}
		if (i?.command === "openEditor") {
			this.openEditor(i.url);
			return;
		}
		if (i?.command === "openUrl" && i.url) {
			if (i.target === "_self") {
				let e = new URL(i.url, window.location.href);
				if (i.returnToCurrent) {
					let t = window.location.href;
					e.searchParams.set("return", window.btoa(t));
				}
				i.replace ? window.location.replace(e.toString()) : window.location.href = e.toString();
			} else window.open(i.url, "_blank", "noopener,noreferrer");
			return;
		}
		if (i?.command === "copyText" && i.text) {
			await navigator.clipboard.writeText(i.text), Joomla.renderMessages({ success: [i.text] });
			return;
		}
		e.id === "preview" && this.preview(i), e.id === "edit" && i?.metadata?.mimeType && this.editMedia(i), e.id === "share" && this.share(i), e.id === "download" && this.download(i), (i?.updated || i?.deleted) && await this.reload();
	}
	canPreview(e) {
		return !e?.metadata?.mimeType || !!ze(e);
	}
	openEditor(e) {
		if (this.destroyed) return;
		if (this.editorMode === "page") {
			let t = new URL(e, window.location.href);
			this.application === "site" ? (window.sessionStorage.setItem("supjx.smartbrowser.editorReturn", window.location.href), t.searchParams.set("sbpage", "1"), t.searchParams.delete("tmpl")) : (t.searchParams.has("view") && !t.searchParams.has("task") ? t.searchParams.set("layout", "edit") : t.searchParams.delete("layout"), t.searchParams.delete("tmpl"), t.searchParams.set("return", window.btoa(window.location.href))), window.location.assign(t.toString());
			return;
		}
		let t = document.createElement("dialog");
		t.className = "smartbrowser-editor", t.innerHTML = `<iframe src="${this.escape(e)}" title="Editor"></iframe><div class="smartbrowser-editor-loading" role="status"><span class="spinner-border" aria-hidden="true"></span><span>${this.escape(this.translate("COM_SMARTBROWSER_WORKING"))}</span></div><button type="button" class="btn-close" aria-label="Close"></button>`;
		let n = S(t, null, this.translate), r = t.querySelector("iframe"), i = t.querySelector(".smartbrowser-editor-loading"), a = !1, o = !1;
		r.addEventListener("load", () => {
			i.hidden = !0, n.bind(null);
			try {
				let e = r.contentDocument?.querySelector(".smartbrowser-editor-actions, #toolbar");
				if (e) {
					let t = r.contentDocument.createElement("button");
					t.type = "button", t.className = "btn btn-outline-secondary ms-auto smartbrowser-editor-size", t.innerHTML = "<span class=\"fas fa-expand\" aria-hidden=\"true\"></span>", e.append(t), n.bind(t);
				}
			} catch {}
			try {
				r.contentWindow.addEventListener("beforeunload", () => {
					i.hidden = !1;
				}, { once: !0 });
			} catch {}
			if (o = !1, window.SmartBrowserDialogDismiss.watchFrame(r, () => {
				o = !0;
			}), !a) {
				a = !0;
				return;
			}
			try {
				let e = new URL(r.contentWindow.location.href);
				if (e.searchParams.get("option") === "com_users" && e.searchParams.get("view") === "login" || r.contentDocument?.querySelector("form#login-form, .com-users-login")) {
					window.top.location.assign(e.toString());
					return;
				}
				let n = e.searchParams.get("task") || "", i = e.searchParams.get("layout") || "", a = /\.(?:edit|add)$/.test(n) || i === "edit" || i === "modal", o = !!r.contentDocument?.querySelector("form#adminForm, form#item-form");
				(!a || !o) && t.close();
			} catch {}
		}), t.querySelector(".btn-close").addEventListener("click", () => t.close()), window.SmartBrowserDialogDismiss.install(t, () => o), t.addEventListener("close", async () => {
			n.destroy(), t.remove(), this.destroyed || await this.reload();
		}), this.ownDialog(t, () => n.destroy()), t.showModal();
	}
	async mutate(e, t, n = {}) {
		try {
			await this.api.execute(e, t, n), await this.reload();
		} catch (e) {
			Joomla.renderMessages({ error: [e.message] });
		}
	}
	pickUpload() {
		let e = document.createElement("input");
		e.type = "file", e.multiple = !0, e.addEventListener("change", () => this.uploadFiles(e.files)), e.click();
	}
	async uploadFiles(e) {
		if (this.state.busy) return;
		this.state.busy = !0;
		let t = 0;
		try {
			for (let n of Array.from(e || [])) try {
				let e = await this.read(n), r = {
					nodeId: this.state.selectedNode,
					name: n.name,
					content: e
				};
				try {
					await this.api.execute("upload", [], r);
				} catch (e) {
					if (e.status !== 409) throw e;
					let t = this.translate("COM_MEDIA_FILE_EXISTS_AND_OVERRIDE").replace(/%[sS]/, n.name);
					if (!window.confirm(t)) continue;
					await this.api.execute("upload", [], {
						...r,
						override: !0
					});
				}
				t++;
			} catch (e) {
				let t = e?.message || this.translate("COM_SMARTBROWSER_ERROR_UPLOAD_FAILED");
				Joomla.renderMessages({ error: [`${n.name}: ${t}`] });
			}
			t && (await this.reload(), Joomla.renderMessages({ success: [this.translate("COM_MEDIA_UPLOAD_SUCCESS")] }));
		} finally {
			this.state.busy = !1;
		}
	}
	read(e) {
		return new Promise((t, n) => {
			let r = new FileReader();
			r.onload = () => t(String(r.result).split(",")[1]), r.onerror = n, r.readAsDataURL(e);
		});
	}
	previewMedia(e) {
		let t = e.metadata?.url, n = ze(e);
		return n === "image" ? `<img data-preview-media src="${this.escapeAttribute(t)}" alt="${this.escapeAttribute(e.title)}">` : n === "video" ? `<video data-preview-media src="${this.escapeAttribute(t)}" controls preload="metadata"></video>` : n === "audio" ? `<audio data-preview-media src="${this.escapeAttribute(t)}" controls preload="metadata"></audio>` : n === "pdf" ? `<iframe data-preview-media src="${this.escapeAttribute(t)}" title="${this.escapeAttribute(e.title)}"></iframe>` : `<div class="smartbrowser-preview-unavailable"><span class="${this.escapeAttribute(e.icon || "fas fa-file")}" aria-hidden="true"></span><span>${this.escape(this.translate("COM_SMARTBROWSER_PREVIEW_UNAVAILABLE"))}</span></div>`;
	}
	previewUrl(e, t) {
		let n = document.createElement("dialog");
		n.className = "smartbrowser-preview smartbrowser-content-preview", n.setAttribute("aria-label", t || this.translate("COM_SMARTBROWSER_ACTION_PREVIEW")), n.innerHTML = `<button type="button" class="btn-close" aria-label="${this.escapeAttribute(this.translate("JCLOSE"))}"></button><div class="smartbrowser-preview-media"><iframe src="${this.escapeAttribute(e)}" title="${this.escapeAttribute(t || "")}"></iframe></div>`, this.showContentPreview(n);
	}
	preview(e) {
		let t = document.createElement("dialog");
		t.className = "smartbrowser-preview smartbrowser-content-preview", t.setAttribute("aria-label", e.title), t.innerHTML = `<button type="button" class="btn-close" aria-label="${this.escapeAttribute(this.translate("JCLOSE"))}"></button><div class="smartbrowser-preview-media">${this.previewMedia(e)}</div>`, this.showContentPreview(t);
	}
	showContentPreview(e) {
		this.destroyed || (e.querySelector(".btn-close").addEventListener("click", () => e.close()), window.SmartBrowserDialogDismiss.install(e), e.addEventListener("close", () => e.remove()), this.ownDialog(e), e.showModal());
	}
	editMedia(e) {
		let t = e, [n, r] = this.splitFilename(e.title), i = document.createElement("dialog");
		i.className = "smartbrowser-preview";
		let a = this.previewMedia(e);
		i.innerHTML = `<form class="smartbrowser-preview-form com-smartbrowser-editor" method="dialog">
      <div class="smartbrowser-preview-actions">
        <button type="button" class="btn btn-primary" data-action="save" ${e.capabilities?.rename ? "" : "disabled"}><span class="fas fa-save" aria-hidden="true"></span> ${this.escapeTranslated("JSAVE")}</button>
        <button type="button" class="btn btn-outline-primary" data-action="apply" ${e.capabilities?.rename ? "" : "disabled"}><span class="fas fa-check" aria-hidden="true"></span> ${this.escapeTranslated("JAPPLY")}</button>
        <button type="button" class="btn btn-outline-primary" data-action="copy" ${e.capabilities?.copy ? "" : "disabled"}><span class="fas fa-copy" aria-hidden="true"></span> ${this.escapeTranslated("JSAVEASCOPY")}</button>
        <button type="button" class="btn btn-danger" data-action="cancel"><span class="fas fa-times" aria-hidden="true"></span> ${this.escape(this.translate("COM_SMARTBROWSER_CANCEL"))}</button>
        <button type="button" class="btn btn-outline-secondary smartbrowser-preview-download" data-action="download"><span class="fas fa-download" aria-hidden="true"></span> ${this.escape(this.translate("COM_SMARTBROWSER_ACTION_DOWNLOAD"))}</button>
        <button type="button" class="btn btn-outline-secondary ms-auto smartbrowser-editor-size"><span class="fas fa-expand" aria-hidden="true"></span></button>
      </div>
      <div class="smartbrowser-preview-card">
        <div class="smartbrowser-preview-tabs" role="tablist">
          <button type="button" role="tab" data-tab="content" aria-selected="true" aria-controls="smartbrowser-preview-content">${this.escape(this.translate("COM_SMARTBROWSER_CONTENT_TAB"))}</button>
          <button type="button" role="tab" data-tab="metadata" aria-selected="false" aria-controls="smartbrowser-preview-metadata">${this.escape(this.translate("COM_SMARTBROWSER_METADATA_TAB"))}</button>
        </div>
        <section id="smartbrowser-preview-content" class="smartbrowser-preview-tab smartbrowser-editor-tab" role="tabpanel">
          <div class="smartbrowser-preview-name-fields smartbrowser-editor-title-alias">
            <div class="control-group"><div class="control-label"><label for="smartbrowser-preview-name">${this.escape(this.translate("COM_SMARTBROWSER_FILE_NAME"))}</label></div>
              <div class="controls"><input id="smartbrowser-preview-name" class="form-control" name="name" required value="${this.escapeAttribute(n)}" ${e.capabilities?.rename || e.capabilities?.copy ? "" : "readonly"}></div></div>
            <div class="control-group"><div class="control-label"><label for="smartbrowser-preview-extension">${this.escape(this.translate("COM_SMARTBROWSER_EXTENSION"))}</label></div>
              <div class="controls"><input id="smartbrowser-preview-extension" class="form-control" name="extension" value="${this.escapeAttribute(r)}" ${e.capabilities?.rename || e.capabilities?.copy ? "" : "readonly"}></div></div>
          </div>
          <div class="smartbrowser-preview-media">${a}</div>
        </section>
        <section id="smartbrowser-preview-metadata" class="smartbrowser-preview-tab" role="tabpanel" hidden>
          <dl class="smartbrowser-preview-metadata">
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_FILE_TYPE"))}</dt><dd>${this.escape(this.translate({
			image: "COM_SMARTBROWSER_MEDIA_IMAGE",
			document: "COM_SMARTBROWSER_MEDIA_DOCUMENT",
			video: "COM_SMARTBROWSER_MEDIA_VIDEO",
			audio: "COM_SMARTBROWSER_MEDIA_AUDIO"
		}[e.type] || "COM_SMARTBROWSER_RESOURCE"))}</dd></div>
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_MIME_TYPE"))}</dt><dd>${this.escape(e.metadata?.mimeType || "")}</dd></div>
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_EXTENSION"))}</dt><dd>${this.escape(e.metadata?.extension || "")}</dd></div>
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_SIZE"))}</dt><dd>${this.escape(this.formatPreviewSize(e.metadata?.size))}</dd></div>
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_DIMENSIONS"))}</dt><dd>${e.metadata?.width && e.metadata?.height ? `${Number(e.metadata.width)} × ${Number(e.metadata.height)} px` : ""}</dd></div>
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_DATE_CREATED"))}</dt><dd>${this.escape(this.formatPreviewDate(e.metadata?.created))}</dd></div>
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_DATE_MODIFIED"))}</dt><dd>${this.escape(this.formatPreviewDate(e.metadata?.modified))}</dd></div>
          </dl>
        </section>
      </div></form>`;
		let o = S(i, i.querySelector(".smartbrowser-editor-size"), this.translate);
		i.querySelector("form").addEventListener("submit", (e) => e.preventDefault()), i.querySelectorAll("[data-tab]").forEach((e) => e.addEventListener("click", () => {
			i.querySelectorAll("[data-tab]").forEach((t) => {
				t.setAttribute("aria-selected", String(t === e));
			}), i.querySelector("#smartbrowser-preview-content").hidden = e.dataset.tab !== "content", i.querySelector("#smartbrowser-preview-metadata").hidden = e.dataset.tab !== "metadata";
		})), i.querySelector("[data-action=\"cancel\"]").addEventListener("click", () => i.close()), i.querySelector("[data-action=\"download\"]").addEventListener("click", async () => {
			try {
				this.download(await this.api.execute("download", [t.id]));
			} catch (e) {
				Joomla.renderMessages({ error: [e.message] });
			}
		});
		let s = i.querySelector("[name=\"name\"]"), c = i.querySelector("[name=\"extension\"]"), l = () => s.value.trim() + (c.value.trim().replace(/^\.+/, "") ? `.${c.value.trim().replace(/^\.+/, "")}` : "");
		window.SmartBrowserDialogDismiss.install(i, () => l() !== t.title);
		let u = async (e) => {
			if (!s.value.trim()) {
				s.reportValidity();
				return;
			}
			let n = l();
			try {
				if (n !== t.title) {
					t = await this.api.execute("rename", [t.id], { name: n });
					let e = i.querySelector("[data-preview-media]");
					e && t.metadata?.url && (e.src = t.metadata.url), [s.value, c.value] = this.splitFilename(t.title), await this.reload();
				}
				e && i.close();
			} catch (e) {
				Joomla.renderMessages({ error: [e.message] });
			}
		};
		i.querySelector("[data-action=\"save\"]").addEventListener("click", () => u(!0)), i.querySelector("[data-action=\"apply\"]").addEventListener("click", () => u(!1)), i.querySelector("[data-action=\"copy\"]").addEventListener("click", async () => {
			if (!s.value.trim()) {
				s.reportValidity();
				return;
			}
			try {
				await this.api.execute("copy", [t.id], { name: l() }), i.close(), await this.reload();
			} catch (e) {
				Joomla.renderMessages({ error: [e.message] });
			}
		}), i.addEventListener("close", () => {
			o.destroy(), i.remove();
		}), this.ownDialog(i, () => o.destroy()), i.showModal();
	}
	async share(e) {
		let t = e.metadata?.url;
		t && (navigator.share ? await navigator.share({
			title: e.title,
			url: t
		}) : (await navigator.clipboard.writeText(t), Joomla.renderMessages({ success: [t] })));
	}
	download(e) {
		let t = document.createElement("a");
		t.download = e.title, t.href = e.metadata?.content ? `data:${e.metadata.mimeType};base64,${e.metadata.content}` : e.metadata?.url, t.click();
	}
	escape(e) {
		let t = document.createElement("div");
		return t.textContent = e || "", t.innerHTML;
	}
	escapeTranslated(e) {
		let t = document.createElement("textarea");
		return t.innerHTML = this.translate(e), this.escape(t.value);
	}
	escapeAttribute(e) {
		return this.escape(e).replace(/"/g, "&quot;");
	}
	formatPreviewSize(e) {
		return Number.isFinite(Number(e)) ? `${(Number(e) / 1024).toFixed(2)} KB` : "";
	}
	formatPreviewDate(e) {
		if (!e) return "";
		let t = new Date(e);
		return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
	}
	splitFilename(e) {
		let t = e.lastIndexOf(".");
		return t > 0 && t < e.length - 1 ? [e.slice(0, t), e.slice(t + 1)] : [e, ""];
	}
}, Ve = (e, t) => (n, r) => {
	let i = (t) => e === "title" ? String(t.title || "").toLocaleLowerCase() : e === "dimension" ? (t.metadata?.width || 0) * (t.metadata?.height || 0) : t.metadata?.[e], a = i(n), o = i(r), s = typeof a == "string" ? (a || "").localeCompare(o || "") : (a || 0) - (o || 0);
	return t === "asc" ? s : -s;
};
//#endregion
//#region resources/js/core/createBrowserState.js
function He({ options: e, api: t, persistence: n, viewRegistry: i }) {
	let a = !!(e.pickerContext && (Object.keys(e.pickerContext.selectionProfile || {}).length || e.pickerContext.initialSelection?.length)), o = new Set(e.allowedResourceTypes || []), s = (t) => e.mode === "readonly" || o.size && !o.has(t.type) ? {
		...t,
		selectable: !1,
		bulkSelectable: !1
	} : t, c = {
		selectedNode: e.currentNode || e.initialNode || e.roots[0]?.id || "",
		activeView: e.defaultView || "grid",
		viewOptions: {
			gridSize: "md",
			detailsThumbnails: !1,
			detailsDateMode: "modified"
		},
		hiddenColumns: [],
		shownColumns: [],
		sortBy: e.defaultSortBy || "",
		sortDirection: e.defaultSortDirection || "",
		showInfo: !1,
		filters: {}
	}, l = n.load(c);
	l.filters = {
		...l.filters || {},
		...e.initialFilters || {}
	}, Array.isArray(l.hiddenColumns) || (l.hiddenColumns = []), Array.isArray(l.shownColumns) || (l.shownColumns = []), e.currentNode && (l.selectedNode = e.currentNode), e.defaultView && (l.activeView = e.defaultView), i.has(l.activeView) || (l.activeView = "grid");
	let u = x({
		...l,
		roots: e.roots,
		nodes: [],
		items: [],
		contextItems: [],
		breadcrumb: [],
		actions: e.actions,
		presentation: e.presentation || {},
		currentResource: null,
		focusedId: null,
		selectedIds: [],
		selectedResources: {},
		search: "",
		loading: !1,
		busy: !1,
		error: ""
	}), f = d(() => {
		let e = u.search.trim().toLocaleLowerCase(), t = (t) => !e || [
			t.title,
			t.subtitle,
			t.metadata?.alias
		].some((t) => String(t || "").toLocaleLowerCase().includes(e)), n = u.nodes.map(j).map(s).filter(t), r = u.items.map(j).map(s).filter(t), i = u.contextItems.map(M);
		return u.sortBy ? [
			...n.sort(Ve(u.sortBy, u.sortDirection)),
			...r.sort(Ve(u.sortBy, u.sortDirection)),
			...i
		] : [
			...n,
			...r,
			...i
		];
	}), p = d(() => {
		let t = e.selectionTarget || "both";
		return f.value.filter((e) => F(e, t));
	}), m = d(() => {
		let t = e.selectionTarget || "both";
		return f.value.filter((e) => I(e, t));
	}), h = d(() => a ? u.selectedIds.map((e) => f.value.find((t) => t.id === e) || u.selectedResources[e]).filter(Boolean) : f.value.filter((e) => u.selectedIds.includes(e.id))), g = d(() => f.value.find((e) => e.id === u.focusedId) || (a ? u.selectedResources[u.focusedId] : null) || null);
	async function _(n = u.selectedNode) {
		u.loading = !0, u.error = "", a || (u.selectedIds = []), u.focusedId = null;
		try {
			let r = await t.getResources(n, {
				search: u.search,
				sortBy: u.sortBy,
				sortDirection: u.sortDirection,
				filters: u.filters
			});
			if (u.selectedNode = n, u.nodes = r.nodes, u.items = r.items, a) for (let e of [...r.nodes, ...r.items]) u.selectedIds.includes(e.id) && (u.selectedResources[e.id] = s(j(e)));
			u.contextItems = r.contextItems || [], u.breadcrumb = r.breadcrumb, u.actions = e.mode === "readonly" ? [] : r.actions, u.presentation = r.presentation || u.presentation, u.sortBy && !(u.presentation.sortFields || []).some((e) => e.id === u.sortBy) && (u.sortBy = "", u.sortDirection = ""), (u.presentation.filters || []).forEach((e) => {
				u.filters[e.id] === void 0 && (u.filters[e.id] = e.default);
			}), u.currentResource = r.currentResource || null;
			let i = new URL(window.location.href);
			i.searchParams.set("node", n), window.history.replaceState({}, "", i);
		} catch (t) {
			if (n !== e.initialNode && [403, 404].includes(t.status)) {
				u.selectedNode = e.initialNode, await _(e.initialNode);
				return;
			}
			u.error = t.message, Joomla.renderMessages({ error: [t.message] });
		} finally {
			u.loading = !1;
		}
	}
	function v(t, n = !0) {
		if (y(t), !F(t, e.selectionTarget || "both")) return;
		a && (u.selectedResources[t.id] = t);
		let r = u.selectedIds.includes(t.id);
		!e.multiple || !n ? u.selectedIds = r ? [] : [t.id] : u.selectedIds = r ? u.selectedIds.filter((e) => e !== t.id) : [...u.selectedIds, t.id];
	}
	function y(e) {
		P(e) && (u.focusedId = e.id);
	}
	function b() {
		a && m.value.forEach((e) => {
			u.selectedResources[e.id] = e;
		});
		let e = m.value.map((e) => e.id), t = e.length > 0 && e.every((e) => u.selectedIds.includes(e));
		u.selectedIds = t ? u.selectedIds.filter((t) => !e.includes(t)) : [.../* @__PURE__ */ new Set([...u.selectedIds, ...e])];
	}
	function S() {
		a && m.value.forEach((e) => {
			u.selectedResources[e.id] = e;
		});
		let e = m.value.map((e) => e.id), t = new Set(u.selectedIds);
		e.forEach((e) => t.has(e) ? t.delete(e) : t.add(e)), u.selectedIds = [...t];
	}
	return r(() => [
		u.selectedNode,
		u.activeView,
		u.viewOptions,
		u.hiddenColumns,
		u.shownColumns,
		u.sortBy,
		u.sortDirection,
		u.showInfo,
		u.filters
	], () => n.save(u), { deep: !0 }), {
		state: u,
		resources: f,
		selectableResources: p,
		bulkSelectableResources: m,
		selection: h,
		focusedResource: g,
		load: _,
		focus: y,
		toggle: v,
		selectAll: b,
		invertSelection: S
	};
}
//#endregion
//#region resources/js/core/viewRegistry.js
var Ue = () => {
	let e = /* @__PURE__ */ new Map();
	return {
		register(t) {
			if (!t.id || !t.component) throw TypeError("A view requires an id and component.");
			return e.set(t.id, Object.freeze({
				supportsSize: !1,
				controls: [],
				options: {},
				...t
			})), this;
		},
		get(t) {
			return e.get(t);
		},
		all() {
			return Array.from(e.values());
		},
		has(t) {
			return e.has(t);
		}
	};
};
//#endregion
export { ie as a, R as c, w as d, Le as i, F as l, He as n, B as o, Be as r, ee as s, Ue as t, O as u };
