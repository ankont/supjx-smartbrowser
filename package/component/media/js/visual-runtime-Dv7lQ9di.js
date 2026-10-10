import { B as e, C as t, D as n, F as r, H as i, M as a, O as o, P as s, R as c, S as l, U as u, V as d, W as f, _ as p, b as m, g as h, h as g, j as _, k as v, m as y, t as b, v as x, x as S, y as C, z as w } from "./visual-runtime-DVMDRhTu.js";
import { a as T, i as E, n as D, t as O } from "./visual-runtime-BjkbZE8K.js";
//#region resources/js/core/fieldIcons.js
var k = {
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
}, A = (e) => e.icon || e.headerIcon || k[e.id || String(e.source || "").split(".").pop()] || (e.format === "date" ? "fas fa-calendar" : "fas fa-info"), j = { class: "resource-ordering-moves" }, M = [
	"disabled",
	"title",
	"aria-label"
], N = [
	"disabled",
	"title",
	"aria-label"
], P = {
	__name: "ResourceOrderingControls",
	props: {
		enabled: Boolean,
		t: Function
	},
	emits: ["reorder"],
	setup(e) {
		return (t, n) => (_(), S("span", j, [x("button", {
			type: "button",
			disabled: !e.enabled,
			title: e.t("COM_SMARTBROWSER_MOVE_UP"),
			"aria-label": e.t("COM_SMARTBROWSER_MOVE_UP"),
			onClick: n[0] ||= (e) => t.$emit("reorder", "up")
		}, [...n[2] ||= [x("span", {
			class: "fas fa-arrow-up",
			"aria-hidden": "true"
		}, null, -1)]], 8, M), x("button", {
			type: "button",
			disabled: !e.enabled,
			title: e.t("COM_SMARTBROWSER_MOVE_DOWN"),
			"aria-label": e.t("COM_SMARTBROWSER_MOVE_DOWN"),
			onClick: n[1] ||= (e) => t.$emit("reorder", "down")
		}, [...n[3] ||= [x("span", {
			class: "fas fa-arrow-down",
			"aria-hidden": "true"
		}, null, -1)]], 8, N)]));
	}
}, F = "contextual", I = (e, t) => ({
	...e,
	focusable: e.focusable ?? t.focusable,
	selectable: e.selectable ?? t.selectable,
	bulkSelectable: e.bulkSelectable ?? e.selectable ?? t.bulkSelectable,
	actionable: e.actionable ?? t.actionable,
	navigable: e.navigable ?? t.navigable,
	activatable: e.activatable ?? t.activatable
}), L = (e) => I({
	...e,
	role: e.role || "primary"
}, {
	focusable: !0,
	selectable: !1,
	bulkSelectable: !1,
	actionable: !0,
	navigable: !1,
	activatable: !0
}), R = (e) => ({
	...e,
	role: F,
	focusable: e.focusable ?? !0,
	selectable: !1,
	bulkSelectable: !1,
	actionable: !1,
	navigable: !1,
	activatable: !1,
	interactiveOverlays: !1,
	capabilities: {}
}), z = (e) => e?.role === F, B = (e) => e?.focusable === !0, V = (e, t = "both") => e?.selectable === !0 && (t === "both" || e.kind === t), H = (e, t = "both") => V(e, t) && e?.bulkSelectable === !0, U = (e) => e?.actionable === !0, W = (e, t, n, r) => ["manage", "select"].includes(t) && U(e) && n.find((t) => t.id === "preview" && r(t, [e])) || null;
function G(e, t, n, r, i = "both") {
	return e?.kind === "node" ? t === "select" ? V(e, i) ? {
		id: "pickerSelect",
		label: "COM_SMARTBROWSER_SELECT",
		icon: "fas fa-check",
		local: !0
	} : null : t === "manage" && U(e) && n.find((t) => t.id === "edit" && r(t, [e])) || null : (["manage", "select"].includes(t) && U(e) ? n.find((t) => t.modifiedDefault === !0 && r(t, [e])) : null) || W(e, t, n, r);
}
function K(e, t, n, r, i = "both") {
	return e?.navigable ? {
		id: "browseOpen",
		label: "COM_SMARTBROWSER_OPEN",
		icon: "fas fa-folder-open",
		local: !0
	} : e?.activatable ? t === "select" ? V(e, i) ? {
		id: "pickerSelect",
		label: "COM_SMARTBROWSER_SELECT",
		icon: "fas fa-check",
		local: !0
	} : null : U(e) && n.find((n) => n.id === (t === "manage" ? "edit" : "preview") && r(n, [e])) || null : null;
}
//#endregion
//#region resources/js/core/itemMenuActions.js
var ee = (e, t, n, r = null, i = null) => {
	if (!t?.actionable) return r ? [{
		...r,
		isDefault: !0
	}] : [];
	let a = [t], o = [], s = /* @__PURE__ */ new Set();
	for (let r of e || []) {
		if (t.collectionActions && !r.collectionCommand && !t.collectionActions.some((e) => e.id === r.id) || !r.requiresSelection || r.trashedOnly && t.status !== -2 || r.id === "trash" && t.status === -2 || r.id === "checkin" && !n(r, a) || r.id === "removeFromGroup" && !n(r, a)) continue;
		if (!r.exclusiveGroup) {
			o.push(r);
			continue;
		}
		if (s.has(r.exclusiveGroup)) continue;
		s.add(r.exclusiveGroup);
		let i = e.filter((e) => e.requiresSelection && e.exclusiveGroup === r.exclusiveGroup && (e.id !== "trash" || t.status !== -2)), c = i.find((e) => n(e, a)), l = t.overlays?.find((e) => i.some((t) => t.id === e.action))?.action;
		o.push(c || i.find((e) => e.id === l) || i[0]);
	}
	return i && !o.some((e) => e.id === i.id) && i.id !== r?.id && o.push(i), (r ? [{
		...r,
		isDefault: !0
	}, ...o.filter((e) => e.id !== r.id)] : o).map((e) => !e.isDefault && e.id === i?.id ? {
		...e,
		isModified: !0
	} : e);
}, te = { class: "resource-grid-select-all" }, q = ["checked", "aria-label"], J = [
	"role",
	"tabindex",
	"aria-pressed",
	"onClick",
	"onDblclick",
	"onKeydown"
], Y = [
	"checked",
	"aria-label",
	"onChange"
], ne = [
	"aria-expanded",
	"title",
	"onClick"
], X = [
	"title",
	"disabled",
	"onClick"
], Z = { class: "resource-item-visual" }, Q = {
	key: 0,
	class: "resource-item-overlays"
}, re = ["title", "onClick"], ie = ["src"], ae = ["title"], oe = ["src"], se = ["title"], ce = ["title"], le = { class: "resource-item-metadata-text" }, ue = {
	__name: "ResourceGrid",
	props: {
		defaultAction: Function,
		modifiedAction: Function,
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
	setup(r, { emit: s }) {
		let c = r, p = s, C = (e, t) => {
			if ((t?.ctrlKey || t?.metaKey) && (c.modifiedAction || c.previewAction)) {
				let t = c.modifiedAction ? c.modifiedAction(e) : c.previewAction(e);
				if (t && c.actionAvailable(t, [e])) {
					p("action", t, e);
					return;
				}
			}
			if (c.defaultAction) {
				let t = c.defaultAction(e);
				t && c.actionAvailable(t, [e]) && p("action", t, e);
			} else e.navigable ? p("open", e.id) : e.activatable ? p("activate", e) : p("focus", e);
		}, w = e(null), E = e(!1), D = e(0), O = async (e, t) => {
			if (w.value === e) {
				w.value = null;
				return;
			}
			let r = t.currentTarget.closest(".resource-browser-item"), i = r?.closest(".resource-browser");
			if (E.value = !1, D.value = i ? Math.max(0, Math.min(360, i.clientWidth - 8, window.innerWidth - 20)) : 0, w.value = e, await n(), w.value !== e || !i) return;
			let a = r.querySelector(".resource-item-menu");
			E.value = a?.getBoundingClientRect().left < i.getBoundingClientRect().left + 4;
		}, k = (e) => ee(c.actions, e, c.actionAvailable, c.defaultAction?.(e), (c.modifiedAction || c.previewAction)?.(e)), A = (e, t) => U(t) && t.interactiveOverlays !== !1 ? c.actions.find((n) => n.id === e.action && c.actionAvailable(n, [t])) : void 0, j = () => {
			w.value = null;
		}, M = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e), N = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, P = (e) => {
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
				e.type === "article" && c.gridFields?.some((e) => e.source === "metadata.cardSummaryWithCategory") ? n("JCATEGORY", t.category, "fas fa-folder") : null
			].filter(Boolean) : e.kind === "item" && t.mimeType ? [n("COM_SMARTBROWSER_MIME_TYPE", t.mimeType, "fas fa-file-alt"), e.type === "image" && t.width > 0 && t.height > 0 ? n("COM_SMARTBROWSER_DIMENSIONS", `${t.width} × ${t.height}`, "fas fa-expand") : null].filter(Boolean) : (e.collectionPresentation?.gridFields || c.gridFields || []).map((t) => n(t.label || "COM_SMARTBROWSER_DETAILS", t.format === "date" ? N(M(e, t.source)) : M(e, t.source), t.icon || "fas fa-info")).filter(Boolean);
		};
		return v(() => document.addEventListener("click", j)), o(() => document.removeEventListener("click", j)), (e, n) => (_(), S("div", { class: i(["resource-browser-grid", `size-${r.options.gridSize}`]) }, [r.selectionControls ? (_(), S("div", {
			key: 0,
			class: i(["resource-view-icons", { active: r.allSelected }])
		}, [x("label", te, [x("input", {
			type: "checkbox",
			checked: r.allSelected,
			"aria-label": r.t("COM_SMARTBROWSER_SELECT_ALL"),
			onChange: n[0] ||= (t) => e.$emit("select-all")
		}, null, 40, q)])], 2)) : m("", !0), (_(!0), S(h, null, a(r.resources, (o) => (_(), S("div", {
			key: d(T)(o),
			class: i(["resource-browser-item", {
				selected: r.selectedIds.includes(d(T)(o)),
				focused: r.focusedId === d(T)(o),
				active: w.value === d(T)(o),
				contextual: d(z)(o)
			}]),
			role: d(B)(o) ? "button" : void 0,
			tabindex: d(B)(o) ? 0 : void 0,
			"aria-pressed": d(V)(o) ? r.selectedIds.includes(d(T)(o)) : void 0,
			onClick: g((t) => {
				w.value = null, e.$emit("select", o, t.ctrlKey || t.metaKey);
			}, ["stop"]),
			onDblclick: g((e) => C(o, e), ["stop"]),
			onKeydown: y(g((e) => C(o), ["prevent"]), ["enter"]),
			onMouseleave: n[3] ||= (e) => w.value = null
		}, [
			r.selectionControls && d(V)(o) ? (_(), S("label", {
				key: 0,
				class: i(["resource-item-select", { checked: r.selectedIds.includes(d(T)(o)) }]),
				onClick: n[1] ||= g(() => {}, ["stop"])
			}, [x("input", {
				type: "checkbox",
				checked: r.selectedIds.includes(d(T)(o)),
				"aria-label": o.title,
				onChange: (t) => e.$emit("select", o, !0)
			}, null, 40, Y)], 2)) : m("", !0),
			k(o).length ? (_(), S("button", {
				key: 1,
				type: "button",
				class: "resource-item-menu-toggle",
				"aria-expanded": w.value === d(T)(o),
				title: r.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: g((t) => {
					e.$emit("focus", o), O(d(T)(o), t);
				}, ["stop"])
			}, [...n[4] ||= [x("span", {
				class: "fas fa-ellipsis-h",
				"aria-hidden": "true"
			}, null, -1)]], 8, ne)) : m("", !0),
			w.value === d(T)(o) ? (_(), S("div", {
				key: 2,
				class: i(["resource-item-menu", { "align-start": E.value }]),
				style: u(D.value ? { maxWidth: `${D.value}px` } : null),
				onClick: n[2] ||= g(() => {}, ["stop"])
			}, [x("strong", null, f(o.title), 1), (_(!0), S(h, null, a(k(o), (t) => (_(), S("button", {
				key: t.id,
				type: "button",
				class: i([`resource-action-${t.id}`, {
					"resource-default-action": t.isDefault,
					"resource-modified-action": t.isModified
				}]),
				title: t.isDefault ? r.t("COM_SMARTBROWSER_DOUBLE_CLICK") : t.isModified ? r.t("COM_SMARTBROWSER_CTRL_DOUBLE_CLICK") : void 0,
				disabled: !r.actionAvailable(t, [o]),
				onClick: (n) => {
					w.value = null, e.$emit("action", t, o);
				}
			}, [x("span", {
				class: i(t.icon),
				"aria-hidden": "true"
			}, null, 2), l(" " + f(r.t(t.label)), 1)], 10, X))), 128))], 6)) : m("", !0),
			x("span", Z, [t(b, { resource: o }, null, 8, ["resource"]), o.overlays?.length ? (_(), S("span", Q, [(_(!0), S(h, null, a(o.overlays, (t) => (_(), S(h, { key: t.id }, [A(t, o) ? (_(), S("button", {
				key: 0,
				type: "button",
				class: i(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label,
				onClick: g((n) => {
					e.$emit("focus", o), e.$emit("action", A(t, o), o);
				}, ["stop"])
			}, [t.image ? (_(), S("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, ie)) : (_(), S("span", {
				key: 1,
				class: i(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, re)) : (_(), S("span", {
				key: 1,
				class: i(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label
			}, [t.image ? (_(), S("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, oe)) : (_(), S("span", {
				key: 1,
				class: i(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, ae))], 64))), 128))])) : m("", !0)]),
			x("span", {
				class: "resource-item-title",
				title: `${r.t("COM_SMARTBROWSER_NAME")}: ${o.title}`
			}, f(o.title), 9, se),
			(_(!0), S(h, null, a(P(o), (e) => (_(), S("span", {
				key: e.label,
				class: i(["resource-item-metadata", { "resource-item-identifier": e.identifier }]),
				title: `${r.t(e.label)}: ${e.value}`
			}, [x("span", {
				class: i(e.icon),
				"aria-hidden": "true"
			}, null, 2), x("span", le, f(e.value), 1)], 10, ce))), 128))
		], 42, J))), 128))], 2));
	}
}, de = { class: "table-responsive resource-details-view" }, fe = { class: "table table-hover" }, pe = {
	class: "resource-type-column resource-details-select-column",
	scope: "col"
}, me = { class: "resource-details-select-controls" }, he = {
	key: 0,
	class: "resource-details-select-all"
}, ge = ["checked", "aria-label"], _e = ["title"], ve = [
	"title",
	"aria-label",
	"onClick"
], ye = ["title"], be = [
	"tabindex",
	"aria-current",
	"onClick",
	"onDblclick",
	"onKeydown"
], xe = { class: "resource-type-column" }, Se = [
	"checked",
	"aria-label",
	"onChange"
], Ce = ["title"], we = { class: "resource-cell-ellipsis" }, Te = ["title"], Ee = ["title", "onClick"], De = { class: "visually-hidden" }, Oe = ["title"], ke = { class: "visually-hidden" }, Ae = {
	key: 1,
	class: "resource-language"
}, je = ["src"], Me = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, Ne = { class: "resource-language-name" }, Pe = {
	key: 2,
	class: "resource-cell-ellipsis"
}, Fe = {
	key: 3,
	class: "resource-row-overlays"
}, Ie = ["title", "onClick"], Le = ["src"], Re = ["title"], ze = ["src"], Be = { class: "resource-row-actions" }, Ve = [
	"aria-expanded",
	"title",
	"onClick"
], He = [
	"title",
	"disabled",
	"onClick"
], Ue = {
	__name: "ResourceDetails",
	props: {
		defaultAction: Function,
		modifiedAction: Function,
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
		let s = n, c = r, C = (e, t) => {
			if ((t?.ctrlKey || t?.metaKey) && (s.modifiedAction || s.previewAction)) {
				let t = s.modifiedAction ? s.modifiedAction(e) : s.previewAction(e);
				if (t && s.actionAvailable(t, [e])) {
					c("action", t, e);
					return;
				}
			}
			if (s.defaultAction) {
				let t = s.defaultAction(e);
				t && s.actionAvailable(t, [e]) && c("action", t, e);
			} else e.navigable ? c("open", e.id) : e.activatable ? c("activate", e) : c("focus", e);
		}, w = [
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
		].includes(s.options.detailsDateMode) ? s.options.detailsDateMode : "modified", D = (e) => {
			if (!e.dateGroup) return [e];
			let t = e.fields || [];
			return E() === "both" ? t : t.filter((e) => e.id === E());
		}, O = p(() => (s.columns?.length ? s.columns : w).flatMap(D)), A = p(() => 44 + 24 * Math.max(0, ...(s.resources || []).map((e) => (e.overlays || []).filter((e) => e.id !== "status").length))), j = p(() => Math.max(48, 24 + 8 * Math.max(1, ...(s.resources || []).map((e) => String(e.metadata?.id ?? "").length)))), M = (e) => {
			let t = e.id === "status" && e.overlays ? A.value : e.id === "id" ? j.value : null;
			return t === null ? null : {
				width: `${t}px`,
				minWidth: `${t}px`
			};
		}, N = (e) => e.headerIcon || (Object.hasOwn(k, e.id) ? k[e.id] : "fas fa-info"), P = (e) => e.sortField || e.id, F = (e) => s.t(e.label), I = (e) => (s.sortFields || w).some((t) => t.id === P(e)), L = (e) => s.sortBy === e ? s.sortDirection === "asc" ? "fas fa-caret-up ms-1" : "fas fa-caret-down ms-1" : "fas fa-sort ms-1", R = (e) => e ? `${(e / 1024).toFixed(2)}KB` : "", H = (e) => e.metadata.width && e.metadata.height ? `${e.metadata.width}px \u00d7 ${e.metadata.height}px` : "", W = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, G = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e), K = (e, t) => {
			if (t.id === "size") return e.kind === "node" ? "" : R(e.metadata.size);
			if (t.id === "dimension") return H(e);
			let n = t.source || `metadata.${t.id}`, r = G(e, n);
			return t.format === "size" ? R(r) : t.format === "dimensions" ? H(e) : t.format === "date" || ["created", "modified"].includes(t.id) ? W(r) : t.format === "mediaType" ? s.t({
				folder: "COM_SMARTBROWSER_FOLDER",
				image: "COM_SMARTBROWSER_MEDIA_IMAGE",
				document: "COM_SMARTBROWSER_MEDIA_DOCUMENT",
				video: "COM_SMARTBROWSER_MEDIA_VIDEO",
				audio: "COM_SMARTBROWSER_MEDIA_AUDIO"
			}[r] || "COM_SMARTBROWSER_RESOURCE") : t.format === "language" && r === "*" ? s.t("COM_SMARTBROWSER_ALL_LANGUAGES") : r ?? "";
		}, te = (e, t) => t.id === "location" ? String(e.metadata?.locationPath || K(e, t) || "") : t.format === "status" ? q(e).label : String(K(e, t) || ""), q = (e) => ({
			icon: e.statusPresentation?.icon || "fas fa-question-circle",
			label: e.statusPresentation?.label || K(e, { source: "metadata.stateLabel" }),
			class: `status-${e.statusPresentation?.tone || "neutral"}`
		}), J = (e) => e.overlays?.find((e) => e.id === "status") || {}, Y = e(null), ne = (e) => {
			Y.value = Y.value === e ? null : e;
		}, X = (e) => ee(s.actions, e, s.actionAvailable, s.defaultAction?.(e), (s.modifiedAction || s.previewAction)?.(e)), Z = (e, t) => U(t) && t.interactiveOverlays !== !1 ? s.actions.find((n) => n.id === e.action && s.actionAvailable(n, [t])) : void 0, Q = () => {
			Y.value = null;
		};
		return v(() => document.addEventListener("click", Q)), o(() => document.removeEventListener("click", Q)), (e, r) => (_(), S("div", de, [x("table", fe, [x("thead", null, [x("tr", null, [
			x("th", pe, [x("span", me, [n.selectionControls ? (_(), S("label", he, [x("input", {
				type: "checkbox",
				checked: n.allSelected,
				"aria-label": n.t("COM_SMARTBROWSER_SELECT_ALL"),
				onChange: r[0] ||= (t) => e.$emit("select-all")
			}, null, 40, ge)])) : m("", !0), n.orderingField ? (_(), S("button", {
				key: 1,
				type: "button",
				class: "resource-ordering-sort",
				title: n.t("JGRID_HEADING_ORDERING"),
				onClick: r[1] ||= (t) => e.$emit("sort", n.orderingField)
			}, [x("span", {
				class: i(L(n.orderingField)),
				"aria-hidden": "true"
			}, null, 2)], 8, _e)) : m("", !0)])]),
			(_(!0), S(h, null, a(O.value, (t) => (_(), S("th", {
				key: t.id,
				class: i(`resource-column-${t.id}`),
				style: u(M(t)),
				scope: "col"
			}, [I(t) ? (_(), S("button", {
				key: 0,
				type: "button",
				class: "btn btn-link",
				title: F(t),
				"aria-label": F(t),
				onClick: (n) => e.$emit("sort", P(t))
			}, [
				N(t) ? (_(), S("span", {
					key: 0,
					class: i(N(t)),
					"aria-hidden": "true"
				}, null, 2)) : m("", !0),
				x("span", { class: i(["resource-header-text", { "resource-header-primary": ["title", "name"].includes(t.id) }]) }, f(F(t)), 3),
				x("span", {
					class: i(L(P(t))),
					"aria-hidden": "true"
				}, null, 2)
			], 8, ve)) : (_(), S("span", {
				key: 1,
				class: "resource-column-label",
				title: F(t)
			}, [N(t) ? (_(), S("span", {
				key: 0,
				class: i(N(t)),
				"aria-hidden": "true"
			}, null, 2)) : m("", !0), x("span", { class: i(["resource-header-text", { "resource-header-primary": ["title", "name"].includes(t.id) }]) }, f(t.shortLabel ? n.t(t.shortLabel) : F(t)), 3)], 8, ye))], 6))), 128)),
			r[4] ||= x("th", {
				class: "resource-row-actions",
				scope: "col"
			}, null, -1)
		])]), x("tbody", null, [(_(!0), S(h, null, a(n.resources, (o) => (_(), S("tr", {
			key: d(T)(o),
			class: i({
				selected: n.selectedIds.includes(d(T)(o)),
				focused: n.focusedId === d(T)(o),
				focusable: d(B)(o),
				contextual: d(z)(o)
			}),
			tabindex: d(B)(o) ? 0 : void 0,
			"aria-current": n.focusedId === d(T)(o) ? "true" : void 0,
			onClick: g((t) => {
				Y.value = null, e.$emit("select", o, t.ctrlKey || t.metaKey);
			}, ["stop"]),
			onDblclick: g((e) => C(o, e), ["stop"]),
			onKeydown: y(g((e) => C(o), ["prevent"]), ["enter"])
		}, [
			x("td", xe, [t(b, {
				resource: o,
				variant: "compact",
				"allow-image": n.options.detailsThumbnails
			}, null, 8, ["resource", "allow-image"]), n.selectionControls && d(V)(o) ? (_(), S("label", {
				key: 0,
				class: i(["resource-row-select", { checked: n.selectedIds.includes(d(T)(o)) }]),
				onClick: r[2] ||= g(() => {}, ["stop"])
			}, [x("input", {
				type: "checkbox",
				checked: n.selectedIds.includes(d(T)(o)),
				"aria-label": o.title,
				onChange: (t) => e.$emit("select", o, !0)
			}, null, 40, Se)], 2)) : m("", !0)]),
			x("th", {
				class: "resource-title-cell",
				scope: "row",
				title: o.title
			}, [x("span", we, f(o.title), 1)], 8, Ce),
			(_(!0), S(h, null, a(O.value.slice(1), (t) => (_(), S("td", {
				key: t.id,
				class: i(`resource-column-${t.id}`),
				style: u(M(t)),
				title: te(o, t)
			}, [x("span", { class: i(["resource-cell-content", { "resource-status-group": t.format === "status" }]) }, [t.format === "status" && o.statusPresentation ? (_(), S(h, { key: 0 }, [Z(J(o), o) ? (_(), S("button", {
				key: 0,
				type: "button",
				class: i(["resource-status-icon", q(o).class]),
				title: q(o).label,
				onClick: g((t) => {
					e.$emit("focus", o), e.$emit("action", Z(J(o), o), o);
				}, ["stop"])
			}, [x("span", {
				class: i(q(o).icon),
				"aria-hidden": "true"
			}, null, 2), x("span", De, f(q(o).label), 1)], 10, Ee)) : (_(), S("span", {
				key: 1,
				class: i(["resource-status-icon", q(o).class]),
				title: q(o).label
			}, [x("span", {
				class: i(q(o).icon),
				"aria-hidden": "true"
			}, null, 2), x("span", ke, f(q(o).label), 1)], 10, Oe))], 64)) : t.format === "language" ? (_(), S("span", Ae, [o.metadata.languageImage ? (_(), S("img", {
				key: 0,
				src: o.metadata.languageImage,
				alt: ""
			}, null, 8, je)) : o.metadata.language === "*" ? (_(), S("span", Me)) : m("", !0), x("span", Ne, f(K(o, t)), 1)])) : (_(), S("span", Pe, f(K(o, t)), 1)), t.overlays && o.overlays?.length ? (_(), S("span", Fe, [(_(!0), S(h, null, a(o.overlays.filter((e) => e.id !== "status"), (t) => (_(), S(h, { key: t.id }, [Z(t, o) ? (_(), S("button", {
				key: 0,
				type: "button",
				class: i(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label,
				onClick: g((n) => {
					e.$emit("focus", o), e.$emit("action", Z(t, o), o);
				}, ["stop"])
			}, [t.image ? (_(), S("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, Le)) : (_(), S("span", {
				key: 1,
				class: i(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, Ie)) : (_(), S("span", {
				key: 1,
				class: i(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label
			}, [t.image ? (_(), S("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, ze)) : (_(), S("span", {
				key: 1,
				class: i(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, Re))], 64))), 128))])) : m("", !0)], 2)], 14, Te))), 128)),
			x("td", Be, [X(o).length ? (_(), S("button", {
				key: 0,
				type: "button",
				class: "resource-row-menu-toggle",
				"aria-expanded": Y.value === d(T)(o),
				title: n.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: g((t) => {
					e.$emit("focus", o), ne(d(T)(o));
				}, ["stop"])
			}, [...r[5] ||= [x("span", {
				class: "fas fa-ellipsis-h",
				"aria-hidden": "true"
			}, null, -1)]], 8, Ve)) : m("", !0), Y.value === d(T)(o) ? (_(), S("div", {
				key: 1,
				class: "resource-item-menu resource-row-menu",
				onClick: r[3] ||= g(() => {}, ["stop"])
			}, [x("strong", null, f(o.title), 1), (_(!0), S(h, null, a(X(o), (t) => (_(), S("button", {
				key: t.id,
				type: "button",
				class: i([`resource-action-${t.id}`, {
					"resource-default-action": t.isDefault,
					"resource-modified-action": t.isModified
				}]),
				title: t.isDefault ? n.t("COM_SMARTBROWSER_DOUBLE_CLICK") : t.isModified ? n.t("COM_SMARTBROWSER_CTRL_DOUBLE_CLICK") : void 0,
				disabled: !n.actionAvailable(t, [o]),
				onClick: (n) => {
					Y.value = null, e.$emit("action", t, o);
				}
			}, [x("span", {
				class: i(t.icon),
				"aria-hidden": "true"
			}, null, 2), l(" " + f(n.t(t.label)), 1)], 10, He))), 128))])) : m("", !0)])
		], 42, be))), 128))])])]));
	}
}, We = (e) => {
	if (!e.metadata?.url) return null;
	let t = (e.metadata.mimeType || "").toLowerCase();
	return t.startsWith("image/") ? "image" : /^video\/(mp4|webm|ogg)$/.test(t) ? "video" : /^audio\/(mpeg|mp4|ogg|wav|webm)$/.test(t) ? "audio" : t === "application/pdf" ? "pdf" : null;
}, $ = class {
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
		return this.destroyed || e.selectionScoped && (!this.selectionHost || e.currentNode && !(this.selectionHost.canCreate ? this.selectionHost.canCreate(e.resourceType || "uri") : this.selectionHost.canAdd(this.api.options.adapter, e.resourceType || "uri"))) || e.currentNode && this.state.currentResource?.capabilities?.[e.id] === !1 || e.requiresSelection && t.length === 0 || e.single && t.length !== 1 || e.itemsOnly && t.some((e) => e.kind !== "item") || e.nodesOnly && t.some((e) => e.kind !== "node") ? !1 : e.exclusiveGroup && t.length ? t.some((t) => t.capabilities?.[e.id] === !0) : e.requiresSelection && t.length ? t.every((t) => t.capabilities?.[e.id] === !0) : !0;
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
			let t = await this.actionDialog({
				title: "COM_SMARTBROWSER_NEW_FOLDER_NAME",
				value: ""
			});
			t && await this.mutate(e.id, [], {
				nodeId: this.state.selectedNode,
				name: t
			});
			return;
		}
		if (e.currentNode) {
			let t = await this.api.execute(e.id, [], { nodeId: this.state.selectedNode });
			if (t?.command === "selectionEditor") return this.selectionEditor(t, null);
			t?.command === "openEditor" ? this.openEditor(t.url) : await this.reload();
			return;
		}
		if (e.id === "rename") {
			let n = await this.actionDialog({
				title: "COM_SMARTBROWSER_RENAME_TO",
				value: t[0].title
			});
			n && n !== t[0].title && await this.mutate(e.id, r, { name: n });
			return;
		}
		if (e.id === "delete") {
			(e.confirm === !1 || await this.actionDialog({
				title: "COM_SMARTBROWSER_DELETE",
				message: this.translate("COM_SMARTBROWSER_CONFIRM_DELETE"),
				accept: "COM_SMARTBROWSER_DELETE",
				destructive: !0
			})) && (e.localState ? this.selectionHost.remove(n) : await this.mutate(e.id, r));
			return;
		}
		if (e.id === "removeFromGroup") {
			let t = Object.fromEntries(n.map((e) => [e.id, e.metadata?.sourceGroupId]));
			if (r.some((e) => !t[e])) return;
			await this.actionDialog({
				title: "COM_SMARTBROWSER_REMOVE_FROM_GROUP",
				message: this.translate("COM_SMARTBROWSER_CONFIRM_REMOVE_FROM_GROUP"),
				accept: "COM_SMARTBROWSER_REMOVE_FROM_GROUP"
			}) && await this.mutate(e.id, r, { groups: t });
			return;
		}
		let i = await this.api.execute(e.id, r);
		if (i?.command === "selectionEditor") return this.selectionEditor(i, n[0]);
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
	actionDialog({ title: e, message: t, value: n, accept: r = "JTOOLBAR_SAVE", destructive: i = !1 }) {
		if (this.destroyed) return Promise.resolve(null);
		let a = (e) => {
			let t = document.createElement("textarea");
			return t.innerHTML = e, t.value;
		}, o = document.createElement("dialog");
		o.className = "smartbrowser-editor smartbrowser-local-editor";
		let s = document.createElement("form"), c = document.createElement("h3");
		c.textContent = a(this.translate(e)), s.append(c);
		let l;
		if (n !== void 0) {
			let e = document.createElement("label");
			e.textContent = a(this.translate("COM_SMARTBROWSER_NAME")), l = document.createElement("input"), l.type = "text", l.className = "form-control", l.value = n, l.required = !0, e.append(l), s.append(e);
		} else {
			let e = document.createElement("p");
			e.textContent = a(t || ""), s.append(e);
		}
		let u = document.createElement("div");
		u.className = "smartbrowser-local-editor-actions";
		let d = document.createElement("button");
		d.type = "submit", d.className = i ? "btn btn-danger" : "btn btn-primary", d.textContent = a(this.translate(r));
		let f = document.createElement("button");
		return f.type = "button", f.className = "btn btn-danger", f.textContent = a(this.translate("JCANCEL")), u.append(d, f), s.append(u), o.append(s), f.addEventListener("click", () => o.close()), window.SmartBrowserDialogDismiss?.install(o, () => l ? l.value !== n : !1), new Promise((e) => {
			this.ownDialog(o, () => {
				o.remove(), e(null);
			}), s.addEventListener("submit", (t) => {
				t.preventDefault(), s.reportValidity() && !this.destroyed && (e(!l || l.value), o.close());
			}), o.showModal(), l ? (l.focus(), l.select()) : f.focus();
		});
	}
	async selectionEditor(e, t) {
		if (!this.selectionHost || this.destroyed) return;
		let n = document.createElement("dialog");
		n.className = "smartbrowser-editor smartbrowser-local-editor";
		let r = document.createElement("form"), i = (e) => {
			let t = document.createElement("textarea");
			return t.innerHTML = this.translate(e), t.value;
		}, a = document.createElement("h3");
		a.textContent = i(e.label), r.append(a);
		let o = /* @__PURE__ */ new Map();
		for (let t of e.fields || []) {
			if (t.type === "hidden") {
				let e = document.createElement("input");
				e.type = "hidden", e.value = t.contextValue ? this.selectionHost.editorContext?.[t.contextValue] || t.value || "" : t.value || "", o.set(t.name, e), r.append(e);
				continue;
			}
			if (t.type === "segmented") {
				let e = document.createElement("fieldset");
				e.className = "smartbrowser-local-editor-modes";
				let n = document.createElement("legend");
				n.textContent = i(t.label), e.append(n);
				let a = document.createElement("input");
				a.type = "hidden", a.value = t.value || "", e.append(a), o.set(t.name, a);
				let s = document.createElement("div");
				s.className = "btn-group", e.append(s);
				for (let e of t.options || []) {
					let t = document.createElement("button");
					t.type = "button", t.className = "btn btn-outline-primary", t.textContent = i(e.label), t.dataset.value = e.value, t.setAttribute("aria-pressed", String(e.value === a.value)), t.addEventListener("click", () => {
						a.value = e.value;
						for (let e of s.children) e.setAttribute("aria-pressed", String(e.dataset.value === a.value));
						a.dispatchEvent(new Event("input", { bubbles: !0 }));
					}), s.append(t);
				}
				r.append(e);
				continue;
			}
			let e = document.createElement("label");
			e.textContent = i(t.label);
			let n = document.createElement(t.type === "select" ? "select" : "input");
			if (n.className = "form-control", t.type === "select") for (let e of t.options || []) {
				let t = document.createElement("option");
				t.value = e.value, t.textContent = i(e.label), n.append(t);
			}
			else n.type = "text";
			if (n.value = t.value || "", n.required = t.required === !0, n.maxLength = t.maxlength || 2048, e.append(n), r.append(e), o.set(t.name, n), t.placeholder && (n.placeholder = t.placeholder), t.hint) {
				let n = document.createElement("small");
				n.className = "text-muted", n.textContent = i(t.hint), e.append(n);
			}
			if (t.warningPattern) {
				let r = document.createElement("p");
				r.className = "alert alert-warning", r.textContent = i("COM_SMARTBROWSER_LINK_WEB_WARNING");
				let a = () => {
					r.hidden = !n.value || !new RegExp(t.warningPattern, "i").test(n.value);
				};
				n.addEventListener("input", a), a(), e.append(r);
			}
		}
		for (let t of e.fields || []) {
			if (t.placeholderFrom && !t.computedPlaceholder) {
				let e = o.get(t.placeholderFrom);
				e?.addEventListener("input", () => {
					o.get(t.name).placeholder = e.value;
				});
			}
			if (t.type === "select" && t.dependsOn) {
				let e = o.get(t.name), n = () => {
					let n = e.value;
					e.replaceChildren();
					for (let n of t.options || []) {
						if (n.parent !== o.get(t.dependsOn)?.value) continue;
						let r = document.createElement("option");
						r.value = n.value, r.textContent = i(n.label), e.append(r);
					}
					[...e.options].some((e) => e.value === n) && (e.value = n);
				};
				n(), o.get(t.dependsOn)?.addEventListener("change", n);
			}
			if (!t.suggestions) continue;
			let e = document.createElement("datalist");
			e.id = `smartbrowser-suggestions-${Math.random().toString(36).slice(2)}`, o.get(t.name).setAttribute("list", e.id), r.append(e);
			let n = () => {
				let n = typeof t.suggestions == "string" ? this.selectionHost.editorContext?.suggestions?.[t.suggestions] : t.suggestionsBy ? t.suggestions[o.get(t.suggestionsBy)?.value] : t.suggestions;
				e.replaceChildren();
				for (let t of Array.isArray(n) ? n.slice(0, 500) : []) {
					let n = document.createElement("option");
					n.value = typeof t == "string" ? t : t.value, typeof t == "object" && t.label && (n.label = t.label), e.append(n);
				}
			};
			n(), t.suggestionsBy && o.get(t.suggestionsBy)?.addEventListener("input", n);
		}
		let s = document.createElement("p");
		s.className = "text-danger", s.setAttribute("role", "alert"), r.append(s);
		let c = document.createElement("div");
		c.className = "smartbrowser-local-editor-actions";
		let l = document.createElement("button");
		l.type = "submit", l.className = "btn btn-primary", l.textContent = i("JTOOLBAR_SAVE");
		let u = document.createElement("button");
		u.type = "button", u.className = "btn btn-danger", u.textContent = i("JCANCEL"), c.append(l, u), r.append(c), n.append(r), u.addEventListener("click", () => n.close());
		let d = new Map([...o].map(([e, t]) => [e, t.value]));
		window.SmartBrowserDialogDismiss?.install(n, () => [...o].some(([e, t]) => t.value !== d.get(e)));
		let f, p = 0, m = e.fields?.find((e) => e.computedPlaceholder), h = () => {
			clearTimeout(f);
			let t = ++p;
			m && !o.get(m.name).value && (o.get(m.name).placeholder = "", f = setTimeout(async () => {
				if (!this.destroyed && n.isConnected) try {
					let r = {
						nodeId: e.nodeId,
						...Object.fromEntries([...o].map(([e, t]) => [e, t.value])),
						[m.name]: ""
					}, i = await this.api.execute(e.action, [], r);
					t === p && n.isConnected && !this.destroyed && (o.get(m.name).placeholder = i.resource.title);
				} catch {}
			}, 300));
		};
		return m && r.addEventListener("input", h), new Promise((i) => {
			this.ownDialog(n, () => {
				clearTimeout(f), p++, n.remove(), i();
			}), r.addEventListener("submit", async (i) => {
				if (i.preventDefault(), r.reportValidity()) {
					l.disabled = !0, s.textContent = "";
					try {
						let r = {
							nodeId: e.nodeId,
							...Object.fromEntries([...o].map(([e, t]) => [e, t.value]))
						}, i = await this.api.execute(e.action, [], r);
						if (this.destroyed) return;
						let a = this.selectionHost.replace({
							...i.resource,
							adapter: this.api.options.adapter.replace(/^flat-/, "")
						}, t);
						n.close(), await this.reload(), this.state.focusedId = a.selectionKey || a.id;
					} catch (e) {
						s.textContent = this.translate(e.message);
					} finally {
						l.disabled = !1;
					}
				}
			}), n.showModal(), [...o.values()].find((e) => e.type !== "hidden")?.focus(), h();
		});
	}
	canPreview(e) {
		return !e?.metadata?.mimeType || !!We(e);
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
		let n = O(t, null, this.translate), r = t.querySelector("iframe"), i = t.querySelector(".smartbrowser-editor-loading"), a = !1, o = !1;
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
					if (!await this.actionDialog({
						title: "COM_SMARTBROWSER_ACTION_UPLOAD",
						message: t,
						accept: "JYES",
						destructive: !0
					})) continue;
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
		let t = e.metadata?.url, n = We(e);
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
		let o = O(i, i.querySelector(".smartbrowser-editor-size"), this.translate);
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
};
//#endregion
//#region resources/js/services/ResourceApi.js
function Ge(e, t = 0, n = (e) => e) {
	let r = e?.messages && typeof e.messages == "object" ? Object.values(e.messages).flat() : [], i = [...new Set([e?.message, ...r].filter((e) => typeof e == "string" && e.trim()).map((e) => e.trim()))];
	return i.length ? i.join("; ") : t === 413 ? n("COM_SMARTBROWSER_ERROR_REQUEST_TOO_LARGE") : t ? n("COM_SMARTBROWSER_ERROR_REQUEST_HTTP").replace("%s", String(t)) : n("COM_SMARTBROWSER_ERROR_REQUEST_NETWORK");
}
var Ke = class {
	constructor(e) {
		this.options = e, this.pending = /* @__PURE__ */ new Map();
	}
	async getResources(e, t = {}) {
		let n = new URL(`${this.options.apiBaseUrl}&task=api.resources&adapter=${encodeURIComponent(this.options.adapter)}`);
		return n.searchParams.set("mode", this.options.mode || "manage"), this.options.browseRoot && n.searchParams.set("browseRoot", this.options.browseRoot), this.options.flatScope && n.searchParams.set("flatScope", this.options.flatScope), n.searchParams.set("node", e), this.options.adapterOptions && n.searchParams.set("adapterOptions", JSON.stringify(this.options.adapterOptions)), t.search && n.searchParams.set("search", t.search), t.sortBy && n.searchParams.set("sortBy", t.sortBy), t.sortDirection && n.searchParams.set("sortDirection", t.sortDirection), t.filters && n.searchParams.set("filters", JSON.stringify(t.filters)), n.searchParams.set("showContextResources", this.options.showContextResources ? "1" : "0"), this.options.selectionItems ? this.request(n, {
			method: "POST",
			body: JSON.stringify({
				items: this.options.selectionItems(),
				[this.options.csrfToken]: 1
			})
		}) : this.request(n);
	}
	async execute(e, t = [], n = {}) {
		let r = new URL(`${this.options.apiBaseUrl}&task=api.action&adapter=${encodeURIComponent(this.options.adapter)}`);
		return this.options.adapterOptions && r.searchParams.set("adapterOptions", JSON.stringify(this.options.adapterOptions)), r.searchParams.set("mode", this.options.mode || "manage"), this.options.browseRoot && r.searchParams.set("browseRoot", this.options.browseRoot), this.options.flatScope && r.searchParams.set("flatScope", this.options.flatScope), this.request(r, {
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
		return n.searchParams.set("task", "api.collection"), this.options.adapter && n.searchParams.set("adapter", this.options.adapter), n.searchParams.set("mode", this.options.mode || "manage"), this.options.browseRoot && n.searchParams.set("browseRoot", this.options.browseRoot), this.options.flatScope && n.searchParams.set("flatScope", this.options.flatScope), this.request(n, {
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
						let e = Error(Ge(t, Number(t.code) || 0, (e) => Joomla.Text?._(e, e) || e));
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
					let n = Ge(t, Number(e.status) || 0, (e) => Joomla.Text?._(e, e) || e), r = Error(n);
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
}, qe = ["aria-label", "aria-busy"], Je = { class: "resource-browser" }, Ye = { class: "resource-toolbar sb-collection-toolbar" }, Xe = { class: "resource-view-controls" }, Ze = [
	"disabled",
	"title",
	"aria-label"
], Qe = [
	"disabled",
	"title",
	"aria-label"
], $e = ["aria-label", "value"], et = { value: "collectionOrder" }, tt = ["value"], nt = ["title", "aria-label"], rt = [
	"title",
	"aria-label",
	"aria-pressed",
	"onClick"
], it = {
	key: 0,
	class: "alert alert-danger",
	role: "alert"
}, at = {
	key: 1,
	role: "status"
}, ot = {
	key: 2,
	class: "resource-empty-state"
}, st = {
	key: 4,
	class: "sb-collection-count"
}, ct = {
	__name: "CollectionView",
	props: {
		model: Object,
		api: Object,
		config: Object,
		t: Function
	},
	setup(t) {
		let n = t, r = n.model.browser.state, c = p(() => !n.config.readOnly && typeof n.config.onAdd == "function"), l = e(!1);
		async function u() {
			if (!(!c.value || l.value || r.loading || r.busy)) {
				l.value = !0;
				try {
					await n.config.onAdd();
				} catch (e) {
					n.config.onError?.(e);
				} finally {
					l.value = !1;
				}
			}
		}
		r.sortBy = "collectionOrder", r.sortDirection = "asc", r.viewOptions.gridSize = n.config.gridSize || "sm", r.viewOptions.detailsThumbnails = n.config.thumbnails !== !1;
		let g = new $(n.api, r, () => n.model.refresh(), n.t, n.config.editorMode || "modal", n.config.application), v = /* @__PURE__ */ new Map(), y = (e) => {
			if (!e.adapter) return g;
			if (!v.has(e.adapter)) {
				let t = new Ke({
					...n.config,
					adapter: e.adapter,
					mode: n.config.readOnly ? "readonly" : "manage"
				});
				v.set(e.adapter, {
					api: t,
					driver: new $(t, r, () => n.model.refresh(), n.t, n.config.editorMode || "modal", n.config.application)
				});
			}
			return v.get(e.adapter).driver;
		}, b = [
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
		], w = p(() => [
			...n.model.canRemove ? [{
				id: "collectionRemove",
				label: "COM_SMARTBROWSER_COLLECTION_REMOVE",
				icon: "fas fa-minus",
				requiresSelection: !0,
				collectionCommand: !0
			}] : [],
			...n.config.readOnly ? [] : (n.config.resourceActions || []).map((e) => ({
				...e,
				collectionCommand: !0
			})),
			...n.config.contextActions === !0 && !n.config.readOnly ? r.actions.filter((e) => (n.config.contextActionIds || b).includes(e.id)) : []
		]), E = (e) => (n.config.resourceActions || []).some((t) => t.id === e.id), D = (e, t) => t.collectionActions?.find((t) => t.id === e.id) || e, O = (e, t) => !r.loading && !r.busy && (e.id === "collectionRemove" ? n.model.canRemove : !t.some((e) => e.unavailable) && (E(e) ? !n.config.readOnly : t.every((t) => (!t.collectionActions || t.collectionActions.some((t) => t.id === e.id)) && y(t).available(D(e, t), [t])))), k = (e) => w.value.find((t) => t.id === n.config.defaultResourceActionId && O(t, [e])) || (n.config.contextActions === !0 && !n.config.readOnly ? K({
			...e,
			activatable: !e.unavailable
		}, "manage", w.value, O) : null), A = (e) => n.config.contextActions === !0 && !n.config.readOnly ? W(e, "manage", w.value, O) : null, j = (e, t) => e.id === "collectionRemove" ? n.model.remove([T(t)]) : O(e, [t]) && (E(e) ? n.config.onResourceAction?.(e, t) : y(t).execute(D(e, t), [t])), M = p(() => (r.presentation.sortFields || [{
			id: "title",
			label: "COM_SMARTBROWSER_NAME"
		}]).filter((e) => !["ordering", "collectionOrder"].includes(e.id))), N = (e) => {
			r.sortBy === e ? r.sortDirection = r.sortDirection === "asc" ? "desc" : "asc" : (r.sortBy = e, r.sortDirection = "asc");
		}, F = [{
			id: "grid",
			label: "COM_SMARTBROWSER_GRID",
			icon: "fas fa-th"
		}, {
			id: "details",
			label: "COM_SMARTBROWSER_DETAILS",
			icon: "fas fa-list"
		}], I = p(() => n.model.browser.bulkSelectableResources.value.length > 0 && n.model.browser.bulkSelectableResources.value.every((e) => r.selectedIds.includes(T(e))));
		return o(() => {
			g.destroy(), v.forEach(({ driver: e, api: t }) => {
				e.destroy(), t.destroy();
			});
		}), (e, n) => (_(), S("section", {
			class: i(["smartbrowser smartbrowser-collection", { "is-compact": t.config.layout === "compact" }]),
			"aria-label": t.t("COM_SMARTBROWSER_COLLECTION_TITLE"),
			"aria-busy": d(r).loading || d(r).busy
		}, [x("div", Je, [
			x("header", Ye, [x("div", Xe, [
				t.model.canOrder ? (_(), C(P, {
					key: 0,
					enabled: !d(r).loading && !d(r).busy && d(r).selectedIds.length > 0 && d(r).sortBy === "collectionOrder",
					t: t.t,
					onReorder: t.model.move
				}, null, 8, [
					"enabled",
					"t",
					"onReorder"
				])) : m("", !0),
				c.value ? (_(), S("button", {
					key: 1,
					class: "resource-icon-button",
					type: "button",
					disabled: l.value || d(r).loading || d(r).busy,
					title: t.t(t.config.addLabel || "COM_SMARTBROWSER_COLLECTION_ADD"),
					"aria-label": t.t(t.config.addLabel || "COM_SMARTBROWSER_COLLECTION_ADD"),
					onClick: u
				}, [...n[3] ||= [x("span", {
					class: "fas fa-plus",
					"aria-hidden": "true"
				}, null, -1)]], 8, Ze)) : m("", !0),
				t.model.canRemove ? (_(), S("button", {
					key: 2,
					class: "resource-icon-button",
					type: "button",
					disabled: !d(r).selectedIds.length || d(r).loading || d(r).busy,
					title: t.t("COM_SMARTBROWSER_COLLECTION_REMOVE"),
					"aria-label": t.t("COM_SMARTBROWSER_COLLECTION_REMOVE"),
					onClick: n[0] ||= (e) => t.model.remove(d(r).selectedIds)
				}, [...n[4] ||= [x("span", {
					class: "fas fa-minus",
					"aria-hidden": "true"
				}, null, -1)]], 8, Qe)) : m("", !0),
				t.config.layout === "compact" ? m("", !0) : (_(), S(h, { key: 3 }, [x("select", {
					"aria-label": t.t("COM_SMARTBROWSER_SORT_BY"),
					value: d(r).sortBy,
					onChange: n[1] ||= (e) => d(r).sortBy = e.target.value
				}, [x("option", et, f(t.t("JGRID_HEADING_ORDERING")), 1), (_(!0), S(h, null, a(M.value, (e) => (_(), S("option", {
					key: e.id,
					value: e.id
				}, f(t.t(e.label)), 9, tt))), 128))], 40, $e), x("button", {
					class: "resource-icon-button",
					type: "button",
					title: t.t("COM_SMARTBROWSER_SORT_DIRECTION"),
					"aria-label": t.t("COM_SMARTBROWSER_SORT_DIRECTION"),
					onClick: n[2] ||= (e) => d(r).sortDirection = d(r).sortDirection === "asc" ? "desc" : "asc"
				}, [x("span", {
					class: i(d(r).sortDirection === "asc" ? "fas fa-sort-amount-up" : "fas fa-sort-amount-down-alt"),
					"aria-hidden": "true"
				}, null, 2)], 8, nt)], 64)),
				(_(), S(h, null, a(F, (e) => x("button", {
					key: e.id,
					class: i(["resource-icon-button", { active: d(r).activeView === e.id }]),
					type: "button",
					title: t.t(e.label),
					"aria-label": t.t(e.label),
					"aria-pressed": d(r).activeView === e.id,
					onClick: (t) => d(r).activeView = e.id
				}, [x("span", {
					class: i(e.icon),
					"aria-hidden": "true"
				}, null, 2)], 10, rt)), 64))
			])]),
			d(r).error ? (_(), S("p", it, f(d(r).error), 1)) : m("", !0),
			d(r).loading ? (_(), S("p", at, f(t.t("COM_SMARTBROWSER_LOADING")), 1)) : t.model.resources.value.length ? (_(), C(s(d(r).activeView === "details" ? Ue : ue), {
				key: 3,
				resources: t.model.resources.value,
				"selected-ids": d(r).selectedIds,
				"focused-id": d(r).focusedId,
				"all-selected": I.value,
				"selection-controls": t.model.canRemove || t.model.canOrder,
				options: d(r).viewOptions,
				actions: w.value,
				"action-available": O,
				"default-action": k,
				"preview-action": A,
				"grid-fields": d(r).presentation.gridFields || [],
				columns: t.config.layout === "compact" ? [{
					id: "title",
					label: "COM_SMARTBROWSER_NAME"
				}] : d(r).presentation.columns || [{
					id: "title",
					label: "COM_SMARTBROWSER_NAME"
				}],
				"sort-by": d(r).sortBy,
				"sort-direction": d(r).sortDirection,
				"sort-fields": M.value,
				"ordering-field": "collectionOrder",
				t: t.t,
				onSelect: t.model.browser.toggle,
				onSelectAll: t.model.browser.selectAll,
				onFocus: t.model.browser.focus,
				onAction: j,
				onSort: N
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
			])) : (_(), S("p", ot, f(t.t("COM_SMARTBROWSER_COLLECTION_EMPTY")), 1)),
			t.config.showCount === !1 ? m("", !0) : (_(), S("footer", st, f(t.t("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": " + f(t.model.getItems().length), 1))
		])], 10, qe));
	}
}, lt = (e, t) => (n, r) => {
	let i = (t) => e === "title" ? String(t.title || "").toLocaleLowerCase() : e === "dimension" ? (t.metadata?.width || 0) * (t.metadata?.height || 0) : t.metadata?.[e], a = i(n), o = i(r), s = typeof a == "string" ? (a || "").localeCompare(o || "") : (a || 0) - (o || 0);
	return t === "asc" ? s : -s;
};
//#endregion
//#region resources/js/core/createBrowserState.js
function ut({ options: e, api: t, persistence: n, viewRegistry: i }) {
	let a = e.pickerContext || e.selectionHost, o = !!a?.collectionMode, s = o ? a.getCollectionSnapshot() : null, c = !!(o || e.selectionState || e.pickerContext && (Object.keys(e.pickerContext.selectionProfile || {}).length || e.pickerContext.initialSelection?.length)), l = e.adapter?.replace(/^flat-/, ""), u = (e) => o ? {
		...e,
		adapter: l,
		selection: {
			adapter: l,
			id: e.id
		},
		selectionKey: E({
			adapter: l,
			id: e.id
		})
	} : e, d = (t) => o && e.multiple && a.homogeneous && _.selectedIds.length && (_.selectedResources[_.selectedIds[0]]?.selection?.adapter || s.items.find((e) => E(e.selection) === _.selectedIds[0])?.selection.adapter) !== t.selection?.adapter, f = new Set(e.allowedResourceTypes || []), m = (t) => e.mode === "readonly" || d(t) || f.size && !f.has(t.type) ? {
		...t,
		selectable: !1,
		bulkSelectable: !1
	} : t, h = {
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
	}, g = n.load(h);
	g.filters = {
		...g.filters || {},
		...e.initialFilters || {}
	}, Array.isArray(g.hiddenColumns) || (g.hiddenColumns = []), Array.isArray(g.shownColumns) || (g.shownColumns = []), e.currentNode && (g.selectedNode = e.currentNode), e.defaultView && (g.activeView = e.defaultView), i.has(g.activeView) || (g.activeView = "grid");
	let _ = w({
		...g,
		roots: e.roots,
		nodes: [],
		items: [],
		contextItems: [],
		breadcrumb: [],
		actions: e.actions,
		presentation: e.presentation || {},
		currentResource: null,
		focusedId: null,
		selectedIds: s ? s.items.map((e) => E(e.selection)) : [],
		selectedResources: s?.resources || {},
		virtualResources: s?.virtualResources || {},
		search: "",
		loading: !1,
		busy: !1,
		error: ""
	}), v = p(() => {
		let t = _.search.trim().toLocaleLowerCase(), n = (e) => !t || [
			e.title,
			e.subtitle,
			e.metadata?.alias
		].some((e) => String(e || "").toLocaleLowerCase().includes(t)), r = _.nodes.map(u).map(L).map(m).filter(n), i = (_.presentation.selectionScoped && e.selectionState ? Object.values(_.virtualResources).filter((e) => e && (e.selection?.adapter || e.adapter || l) === l && e.parentId === _.selectedNode) : _.items).map(u).map(L).map(m).filter(n), a = _.contextItems.map(R);
		return _.sortBy ? [
			...r.sort(lt(_.sortBy, _.sortDirection)),
			...i.sort(lt(_.sortBy, _.sortDirection)),
			...a
		] : [
			...r,
			...i,
			...a
		];
	}), y = p(() => {
		let t = e.selectionTarget || "both";
		return v.value.filter((e) => V(e, t));
	}), b = p(() => {
		let t = e.selectionTarget || "both";
		return v.value.filter((e) => H(e, t));
	}), x = p(() => c ? _.selectedIds.map((e) => v.value.find((t) => T(t) === e) || _.selectedResources[e]).filter(Boolean) : v.value.filter((e) => _.selectedIds.includes(T(e)))), S = p(() => v.value.find((e) => T(e) === _.focusedId) || (c ? _.selectedResources[_.focusedId] : null) || null);
	async function C(n = _.selectedNode) {
		_.loading = !0, _.error = "", c || (_.selectedIds = []), _.focusedId = null;
		try {
			let r = await t.getResources(n, {
				search: _.search,
				sortBy: _.sortBy,
				sortDirection: _.sortDirection,
				filters: _.filters
			});
			if (_.selectedNode = n, _.nodes = r.nodes, _.items = r.items, r.presentation?.selectionScoped) for (let e of r.items) {
				let t = u(e);
				_.virtualResources[T(t)] = L(t);
			}
			if (c) for (let e of [...r.nodes, ...r.items]) {
				let t = u(e);
				_.selectedIds.includes(T(t)) && (_.selectedResources[T(t)] = m(L(t)));
			}
			_.contextItems = r.contextItems || [], _.breadcrumb = r.breadcrumb, _.actions = e.mode === "readonly" ? [] : r.actions, _.presentation = r.presentation || _.presentation, _.sortBy && !(_.presentation.sortFields || []).some((e) => e.id === _.sortBy) && (_.sortBy = "", _.sortDirection = ""), (_.presentation.filters || []).forEach((e) => {
				_.filters[e.id] === void 0 && (_.filters[e.id] = e.default);
			}), _.currentResource = r.currentResource || null;
			let i = new URL(window.location.href);
			i.searchParams.set("node", n), window.history.replaceState({}, "", i);
		} catch (t) {
			if (n !== e.initialNode && [403, 404].includes(t.status)) {
				_.selectedNode = e.initialNode, await C(e.initialNode);
				return;
			}
			_.error = t.message, Joomla.renderMessages({ error: [t.message] });
		} finally {
			_.loading = !1;
		}
	}
	function D(t, n = !0) {
		if (O(t), !V(t, e.selectionTarget || "both") || d(t)) return;
		let r = T(t);
		c && (_.selectedResources[r] = t);
		let i = _.selectedIds.includes(r);
		!e.multiple || !n ? _.selectedIds = i ? [] : [r] : _.selectedIds = i ? _.selectedIds.filter((e) => e !== r) : [..._.selectedIds, r];
	}
	function O(e) {
		B(e) && (_.focusedId = T(e));
	}
	function k() {
		c && b.value.forEach((e) => {
			_.selectedResources[T(e)] = e;
		});
		let t = b.value.map(T);
		if (o && !e.multiple) {
			let e = t[0];
			_.selectedIds = e && !_.selectedIds.includes(e) ? [e] : [];
			return;
		}
		let n = t.length > 0 && t.every((e) => _.selectedIds.includes(e));
		_.selectedIds = n ? _.selectedIds.filter((e) => !t.includes(e)) : [.../* @__PURE__ */ new Set([..._.selectedIds, ...t])];
	}
	function A() {
		c && b.value.forEach((e) => {
			_.selectedResources[T(e)] = e;
		});
		let e = b.value.map(T), t = new Set(_.selectedIds);
		e.forEach((e) => t.has(e) ? t.delete(e) : t.add(e)), _.selectedIds = [...t];
	}
	r(() => [
		_.selectedNode,
		_.activeView,
		_.viewOptions,
		_.hiddenColumns,
		_.shownColumns,
		_.sortBy,
		_.sortDirection,
		_.showInfo,
		_.filters
	], () => n.save(_), { deep: !0 });
	function j(t, n) {
		if (!e.selectionState || e.mode === "readonly" || e.selectionTarget === "node" || f.size && !f.has(n)) return !1;
		let r = _.selectedResources[_.selectedIds[0]]?.selection?.adapter || s?.items.find((e) => E(e.selection) === _.selectedIds[0])?.selection.adapter;
		return !(e.multiple && a?.homogeneous && r && r !== t);
	}
	function M(t) {
		return !(!e.selectionState || e.mode === "readonly" || e.selectionTarget === "node" || f.size && !f.has(t));
	}
	function N(t, n = null) {
		let r = t.adapter || l, i = {
			adapter: r,
			id: t.id
		}, a = o ? E(i) : t.id, c = n ? T(n) : null;
		if (n && !_.selectedIds.includes(c) && !_.virtualResources[c]) throw Error("COM_SMARTBROWSER_LINK_SELECTION_FULL");
		if ((_.selectedIds.includes(a) || _.virtualResources[a]) && a !== c) throw Error("COM_SMARTBROWSER_LINK_DUPLICATE");
		if (t.uniquenessId) for (let e of /* @__PURE__ */ new Set([..._.selectedIds, ...Object.keys(_.virtualResources)])) {
			if (e === c) continue;
			let n = _.virtualResources[e] || _.selectedResources[e], i = n?.selection || (n ? {
				adapter: n.adapter || l,
				id: n.id
			} : s?.items.find((t) => E(t.selection) === e)?.selection);
			if (i?.adapter === r && (i.id === t.uniquenessId || i.id.startsWith(t.uniquenessId + "."))) throw Error("COM_SMARTBROWSER_LINK_DUPLICATE");
		}
		if (!n && !M(t.type)) throw Error("COM_SMARTBROWSER_LINK_SELECTION_FULL");
		let u = L({
			...t,
			adapter: r,
			...o ? {
				selection: i,
				selectionKey: a
			} : {}
		});
		return _.selectedResources[a] = u, _.virtualResources[a] = u, _.selectedIds = n ? _.selectedIds.map((e) => e === c ? a : e) : j(r, t.type) ? e.multiple ? [..._.selectedIds, a] : [a] : _.selectedIds, c && c !== a && (delete _.selectedResources[c], delete _.virtualResources[c]), _.focusedId = a, u;
	}
	function P(e) {
		for (let t of e) {
			let e = T(t);
			_.virtualResources[e] && (_.selectedIds = _.selectedIds.filter((t) => t !== e), delete _.selectedResources[e], delete _.virtualResources[e], _.focusedId === e && (_.focusedId = null));
		}
	}
	return t.options && e.selectionState && (t.options.selectionItems = () => [.../* @__PURE__ */ new Set([..._.selectedIds, ...Object.keys(_.virtualResources)])].map((e) => {
		let t = _.virtualResources[e] || _.selectedResources[e];
		return t ? {
			selection: t.selection || {
				adapter: t.adapter || l,
				id: t.id
			},
			usage: {}
		} : s?.items.find((t) => E(t.selection) === e);
	}).filter(Boolean)), {
		state: _,
		resources: v,
		selectableResources: y,
		bulkSelectableResources: b,
		selection: x,
		focusedResource: S,
		load: C,
		focus: O,
		toggle: D,
		selectAll: k,
		invertSelection: A,
		canAddSelection: j,
		canCreateSelectionResource: M,
		replaceSelectionResource: N,
		deleteVirtualResources: P
	};
}
//#endregion
//#region resources/js/core/viewRegistry.js
var dt = () => {
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
}, ft = (e) => {
	if (!Array.isArray(e)) throw TypeError("Collection items must be an array.");
	let t = e.map((e) => e && typeof e == "object" ? e.id : e);
	if (t.some((e) => !["string", "number"].includes(typeof e) || String(e) === "")) throw TypeError("Invalid collection identifier.");
	return [...new Set(t.map(String))];
};
function pt({ config: e, api: t, notify: n, translate: r }) {
	let i = e.referenceItems === !0 || !e.adapter || (e.items || []).some((e) => e?.selection || e?.adapter), a = (t) => i ? D(t, e) : ft(t), o = (e) => i ? E(e.selection) : e, s = () => i ? JSON.parse(JSON.stringify(v)) : [...v], l = c(), u = e.viewPreferenceKey || "supjx.smartbrowser.collection.view", d;
	try {
		d = window.localStorage.getItem(u);
	} catch {}
	let f = ["grid", "details"].includes(d) ? d : e.layout === "compact" ? "details" : e.layout || "grid", m = w({
		...e,
		roots: [],
		actions: [],
		multiple: !0,
		selectionTarget: "both",
		mode: e.readOnly ? "readonly" : "manage",
		defaultView: f
	}), h = {
		load: (e) => e,
		save(e) {
			try {
				window.localStorage.setItem(u, e.activeView);
			} catch {}
		}
	}, g = l.run(() => ut({
		options: m,
		api: t,
		persistence: h,
		viewRegistry: dt().register({
			id: "grid",
			component: {}
		}).register({
			id: "details",
			component: {}
		})
	})), { state: _ } = g, v = a(e.items || []), y = 0, b = !1, x = !e.readOnly, S = x && e.allowRemove !== !1, C = x && e.allowOrdering !== !1, O = (t) => t.map((t) => ({
		...t,
		selectable: x && (S || C),
		bulkSelectable: x && (S || C),
		focusable: x,
		actionable: x,
		navigable: !1,
		activatable: !1,
		interactiveOverlays: x && e.contextActions === !0,
		capabilities: {
			...t.capabilities,
			collectionRemove: S
		}
	})), k = (t) => n({
		adapter: e.adapter,
		mode: "collection",
		items: s(),
		resources: [..._.items],
		reason: t
	});
	async function A() {
		if (b) return;
		let n = ++y;
		_.loading = !0, _.error = "";
		try {
			let r = await t.collection(v, i ? {
				referenceItems: !0,
				homogeneous: e.homogeneous === !0
			} : void 0);
			if (b || n !== y) return;
			let s = new Map(i ? v.map((e) => [o(e), e.usage]) : []);
			v = i ? a(r.items).map((e) => ({
				...e,
				usage: s.get(o(e)) || e.usage
			})) : [...r.identifiers], _.items = O(r.resources), _.actions = [...r.actions || [], ..._.items.flatMap((e) => e.collectionActions || [])].filter((e, t, n) => n.findIndex((t) => t.id === e.id) === t && e.requiresSelection && !e.currentNode && ![
				"reorder",
				"removeFromGroup",
				"batch",
				"activate",
				"select"
			].includes(e.id)), _.presentation = r.presentation || {}, m.visualSettings = r.visualSettings, m.imageBackground = r.imageBackground, _.selectedIds = _.selectedIds.filter((e) => v.some((t) => o(t) === e));
		} catch (e) {
			if (!b && n === y) throw _.error = e.message, e;
		} finally {
			!b && n === y && (_.loading = !1);
		}
	}
	async function j(e) {
		if (b) throw Error("Collection is destroyed.");
		let t = a(e), n = i && t.length === v.length && t.every((e, t) => o(e) === o(v[t]));
		v = t, (!n || _.items.length !== v.length || _.error) && (_.selectedIds = [], _.items = [], _.sortBy = "collectionOrder", _.sortDirection = "asc", await A());
	}
	function M(e) {
		if (!S || b || _.loading || _.busy) return;
		++y;
		let t = new Set(e), n = v.filter((e) => !t.has(o(e)));
		n.length !== v.length && (v = n, _.items = _.items.filter((e) => !t.has(T(e))), _.selectedIds = _.selectedIds.filter((e) => !t.has(e)), k("remove"));
	}
	async function N(n) {
		if (!C || b || _.busy || _.loading || !_.selectedIds.length || !["up", "down"].includes(n) || _.sortBy && _.sortBy !== "collectionOrder") return;
		let r = ++y;
		_.busy = !0;
		try {
			let s = _.sortDirection === "desc" ? n === "up" ? "down" : "up" : n, c = await t.collection(v, {
				...i ? {
					referenceItems: !0,
					homogeneous: e.homogeneous === !0
				} : {},
				operation: "reorder",
				selection: [..._.selectedIds],
				direction: s
			});
			if (b || r !== y) return;
			v = a(c.items);
			let l = new Map(_.items.map((e) => [T(e), e]));
			_.items = v.map((e) => l.get(o(e))).filter(Boolean), k("reorder");
		} catch (e) {
			!b && r === y && (_.error = e.message);
		} finally {
			b || (_.busy = !1);
		}
	}
	return {
		options: m,
		browser: g,
		resources: l.run(() => p(() => _.sortBy === "collectionOrder" ? _.sortDirection === "desc" ? [..._.items].reverse() : _.items : g.resources.value)),
		canRemove: S,
		canOrder: C,
		refresh: A,
		setItems: j,
		remove: M,
		move: N,
		getItems: s,
		async addItems(e) {
			await j(a([...v, ...e])), k("add");
		},
		destroy() {
			b = !0, y++, t.destroy?.(), l.stop();
		}
	};
}
//#endregion
export { Ke as a, ue as c, W as d, L as f, A as h, ct as i, K as l, P as m, dt as n, $ as o, V as p, ut as r, Ue as s, pt as t, G as u };
