import { B as e, C as t, D as n, F as r, H as i, M as a, O as o, P as s, R as c, S as l, U as u, V as d, W as f, _ as p, b as m, g as h, h as g, j as _, k as v, m as y, t as b, v as x, x as S, y as C, z as w } from "./visual-runtime-DVMDRhTu.js";
import { i as T, r as E, t as D } from "./visual-runtime-1h24eaHt.js";
import { t as O } from "./visual-runtime-Cya3OMId.js";
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
var q = (e, t, n, r = null, i = null) => {
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
}, ee = { class: "resource-grid-select-all" }, J = ["checked", "aria-label"], Y = [
	"role",
	"tabindex",
	"aria-pressed",
	"onClick",
	"onDblclick",
	"onKeydown"
], X = [
	"checked",
	"aria-label",
	"onChange"
], te = [
	"aria-expanded",
	"title",
	"onClick"
], Z = [
	"title",
	"disabled",
	"onClick"
], Q = { class: "resource-item-visual" }, $ = {
	key: 0,
	class: "resource-item-overlays"
}, ne = ["title", "onClick"], re = ["src"], ie = ["title"], ae = ["src"], oe = ["title"], se = ["title"], ce = { class: "resource-item-metadata-text" }, le = {
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
		}, k = (e) => q(c.actions, e, c.actionAvailable, c.defaultAction?.(e), (c.modifiedAction || c.previewAction)?.(e)), A = (e, t) => U(t) && t.interactiveOverlays !== !1 ? c.actions.find((n) => n.id === e.action && c.actionAvailable(n, [t])) : void 0, j = () => {
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
		}, [x("label", ee, [x("input", {
			type: "checkbox",
			checked: r.allSelected,
			"aria-label": r.t("COM_SMARTBROWSER_SELECT_ALL"),
			onChange: n[0] ||= (t) => e.$emit("select-all")
		}, null, 40, J)])], 2)) : m("", !0), (_(!0), S(h, null, a(r.resources, (o) => (_(), S("div", {
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
			}, null, 40, X)], 2)) : m("", !0),
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
			}, null, -1)]], 8, te)) : m("", !0),
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
			}, null, 2), l(" " + f(r.t(t.label)), 1)], 10, Z))), 128))], 6)) : m("", !0),
			x("span", Q, [t(b, { resource: o }, null, 8, ["resource"]), o.overlays?.length ? (_(), S("span", $, [(_(!0), S(h, null, a(o.overlays, (t) => (_(), S(h, { key: t.id }, [A(t, o) ? (_(), S("button", {
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
			}, null, 8, re)) : (_(), S("span", {
				key: 1,
				class: i(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, ne)) : (_(), S("span", {
				key: 1,
				class: i(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label
			}, [t.image ? (_(), S("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, ae)) : (_(), S("span", {
				key: 1,
				class: i(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, ie))], 64))), 128))])) : m("", !0)]),
			x("span", {
				class: "resource-item-title",
				title: `${r.t("COM_SMARTBROWSER_NAME")}: ${o.title}`
			}, f(o.title), 9, oe),
			(_(!0), S(h, null, a(P(o), (e) => (_(), S("span", {
				key: e.label,
				class: i(["resource-item-metadata", { "resource-item-identifier": e.identifier }]),
				title: `${r.t(e.label)}: ${e.value}`
			}, [x("span", {
				class: i(e.icon),
				"aria-hidden": "true"
			}, null, 2), x("span", ce, f(e.value), 1)], 10, se))), 128))
		], 42, Y))), 128))], 2));
	}
}, ue = { class: "table-responsive resource-details-view" }, de = { class: "table table-hover" }, fe = {
	class: "resource-type-column resource-details-select-column",
	scope: "col"
}, pe = { class: "resource-details-select-controls" }, me = {
	key: 0,
	class: "resource-details-select-all"
}, he = ["checked", "aria-label"], ge = ["title"], _e = [
	"title",
	"aria-label",
	"onClick"
], ve = ["title"], ye = [
	"tabindex",
	"aria-current",
	"onClick",
	"onDblclick",
	"onKeydown"
], be = { class: "resource-type-column" }, xe = [
	"checked",
	"aria-label",
	"onChange"
], Se = ["title"], Ce = { class: "resource-cell-ellipsis" }, we = ["title"], Te = ["title", "onClick"], Ee = { class: "visually-hidden" }, De = ["title"], Oe = { class: "visually-hidden" }, ke = {
	key: 1,
	class: "resource-language"
}, Ae = ["src"], je = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, Me = { class: "resource-language-name" }, Ne = {
	key: 2,
	class: "resource-cell-ellipsis"
}, Pe = {
	key: 3,
	class: "resource-row-overlays"
}, Fe = ["title", "onClick"], Ie = ["src"], Le = ["title"], Re = ["src"], ze = { class: "resource-row-actions" }, Be = [
	"aria-expanded",
	"title",
	"onClick"
], Ve = [
	"title",
	"disabled",
	"onClick"
], He = {
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
		}, ee = (e, t) => t.id === "location" ? String(e.metadata?.locationPath || K(e, t) || "") : t.format === "status" ? J(e).label : String(K(e, t) || ""), J = (e) => ({
			icon: e.statusPresentation?.icon || "fas fa-question-circle",
			label: e.statusPresentation?.label || K(e, { source: "metadata.stateLabel" }),
			class: `status-${e.statusPresentation?.tone || "neutral"}`
		}), Y = (e) => e.overlays?.find((e) => e.id === "status") || {}, X = e(null), te = (e) => {
			X.value = X.value === e ? null : e;
		}, Z = (e) => q(s.actions, e, s.actionAvailable, s.defaultAction?.(e), (s.modifiedAction || s.previewAction)?.(e)), Q = (e, t) => U(t) && t.interactiveOverlays !== !1 ? s.actions.find((n) => n.id === e.action && s.actionAvailable(n, [t])) : void 0, $ = () => {
			X.value = null;
		};
		return v(() => document.addEventListener("click", $)), o(() => document.removeEventListener("click", $)), (e, r) => (_(), S("div", ue, [x("table", de, [x("thead", null, [x("tr", null, [
			x("th", fe, [x("span", pe, [n.selectionControls ? (_(), S("label", me, [x("input", {
				type: "checkbox",
				checked: n.allSelected,
				"aria-label": n.t("COM_SMARTBROWSER_SELECT_ALL"),
				onChange: r[0] ||= (t) => e.$emit("select-all")
			}, null, 40, he)])) : m("", !0), n.orderingField ? (_(), S("button", {
				key: 1,
				type: "button",
				class: "resource-ordering-sort",
				title: n.t("JGRID_HEADING_ORDERING"),
				onClick: r[1] ||= (t) => e.$emit("sort", n.orderingField)
			}, [x("span", {
				class: i(L(n.orderingField)),
				"aria-hidden": "true"
			}, null, 2)], 8, ge)) : m("", !0)])]),
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
			], 8, _e)) : (_(), S("span", {
				key: 1,
				class: "resource-column-label",
				title: F(t)
			}, [N(t) ? (_(), S("span", {
				key: 0,
				class: i(N(t)),
				"aria-hidden": "true"
			}, null, 2)) : m("", !0), x("span", { class: i(["resource-header-text", { "resource-header-primary": ["title", "name"].includes(t.id) }]) }, f(t.shortLabel ? n.t(t.shortLabel) : F(t)), 3)], 8, ve))], 6))), 128)),
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
				X.value = null, e.$emit("select", o, t.ctrlKey || t.metaKey);
			}, ["stop"]),
			onDblclick: g((e) => C(o, e), ["stop"]),
			onKeydown: y(g((e) => C(o), ["prevent"]), ["enter"])
		}, [
			x("td", be, [t(b, {
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
			}, null, 40, xe)], 2)) : m("", !0)]),
			x("th", {
				class: "resource-title-cell",
				scope: "row",
				title: o.title
			}, [x("span", Ce, f(o.title), 1)], 8, Se),
			(_(!0), S(h, null, a(O.value.slice(1), (t) => (_(), S("td", {
				key: t.id,
				class: i(`resource-column-${t.id}`),
				style: u(M(t)),
				title: ee(o, t)
			}, [x("span", { class: i(["resource-cell-content", { "resource-status-group": t.format === "status" }]) }, [t.format === "status" && o.statusPresentation ? (_(), S(h, { key: 0 }, [Q(Y(o), o) ? (_(), S("button", {
				key: 0,
				type: "button",
				class: i(["resource-status-icon", J(o).class]),
				title: J(o).label,
				onClick: g((t) => {
					e.$emit("focus", o), e.$emit("action", Q(Y(o), o), o);
				}, ["stop"])
			}, [x("span", {
				class: i(J(o).icon),
				"aria-hidden": "true"
			}, null, 2), x("span", Ee, f(J(o).label), 1)], 10, Te)) : (_(), S("span", {
				key: 1,
				class: i(["resource-status-icon", J(o).class]),
				title: J(o).label
			}, [x("span", {
				class: i(J(o).icon),
				"aria-hidden": "true"
			}, null, 2), x("span", Oe, f(J(o).label), 1)], 10, De))], 64)) : t.format === "language" ? (_(), S("span", ke, [o.metadata.languageImage ? (_(), S("img", {
				key: 0,
				src: o.metadata.languageImage,
				alt: ""
			}, null, 8, Ae)) : o.metadata.language === "*" ? (_(), S("span", je)) : m("", !0), x("span", Me, f(K(o, t)), 1)])) : (_(), S("span", Ne, f(K(o, t)), 1)), t.overlays && o.overlays?.length ? (_(), S("span", Pe, [(_(!0), S(h, null, a(o.overlays.filter((e) => e.id !== "status"), (t) => (_(), S(h, { key: t.id }, [Q(t, o) ? (_(), S("button", {
				key: 0,
				type: "button",
				class: i(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label,
				onClick: g((n) => {
					e.$emit("focus", o), e.$emit("action", Q(t, o), o);
				}, ["stop"])
			}, [t.image ? (_(), S("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, Ie)) : (_(), S("span", {
				key: 1,
				class: i(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, Fe)) : (_(), S("span", {
				key: 1,
				class: i(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label
			}, [t.image ? (_(), S("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, Re)) : (_(), S("span", {
				key: 1,
				class: i(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, Le))], 64))), 128))])) : m("", !0)], 2)], 14, we))), 128)),
			x("td", ze, [Z(o).length ? (_(), S("button", {
				key: 0,
				type: "button",
				class: "resource-row-menu-toggle",
				"aria-expanded": X.value === d(T)(o),
				title: n.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: g((t) => {
					e.$emit("focus", o), te(d(T)(o));
				}, ["stop"])
			}, [...r[5] ||= [x("span", {
				class: "fas fa-ellipsis-h",
				"aria-hidden": "true"
			}, null, -1)]], 8, Be)) : m("", !0), X.value === d(T)(o) ? (_(), S("div", {
				key: 1,
				class: "resource-item-menu resource-row-menu",
				onClick: r[3] ||= g(() => {}, ["stop"])
			}, [x("strong", null, f(o.title), 1), (_(!0), S(h, null, a(Z(o), (t) => (_(), S("button", {
				key: t.id,
				type: "button",
				class: i([`resource-action-${t.id}`, {
					"resource-default-action": t.isDefault,
					"resource-modified-action": t.isModified
				}]),
				title: t.isDefault ? n.t("COM_SMARTBROWSER_DOUBLE_CLICK") : t.isModified ? n.t("COM_SMARTBROWSER_CTRL_DOUBLE_CLICK") : void 0,
				disabled: !n.actionAvailable(t, [o]),
				onClick: (n) => {
					X.value = null, e.$emit("action", t, o);
				}
			}, [x("span", {
				class: i(t.icon),
				"aria-hidden": "true"
			}, null, 2), l(" " + f(n.t(t.label)), 1)], 10, Ve))), 128))])) : m("", !0)])
		], 42, ye))), 128))])])]));
	}
};
//#endregion
//#region resources/js/services/ResourceApi.js
function Ue(e, t = 0, n = (e) => e) {
	let r = e?.messages && typeof e.messages == "object" ? Object.values(e.messages).flat() : [], i = [...new Set([e?.message, ...r].filter((e) => typeof e == "string" && e.trim()).map((e) => e.trim()))];
	return i.length ? i.join("; ") : t === 413 ? n("COM_SMARTBROWSER_ERROR_REQUEST_TOO_LARGE") : t ? n("COM_SMARTBROWSER_ERROR_REQUEST_HTTP").replace("%s", String(t)) : n("COM_SMARTBROWSER_ERROR_REQUEST_NETWORK");
}
var We = class {
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
				...this.options.maxSelections ? { maxSelections: this.options.maxSelections } : {},
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
						let e = Error(Ue(t, Number(t.code) || 0, (e) => Joomla.Text?._(e, e) || e));
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
					let n = Ue(t, Number(e.status) || 0, (e) => Joomla.Text?._(e, e) || e), r = Error(n);
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
}, Ge = ["aria-label", "aria-busy"], Ke = { class: "resource-browser" }, qe = { class: "resource-toolbar sb-collection-toolbar" }, Je = { class: "resource-view-controls" }, Ye = [
	"disabled",
	"title",
	"aria-label"
], Xe = [
	"disabled",
	"title",
	"aria-label"
], Ze = ["aria-label", "value"], Qe = { value: "collectionOrder" }, $e = ["value"], et = ["title", "aria-label"], tt = [
	"title",
	"aria-label",
	"aria-pressed",
	"onClick"
], nt = {
	key: 0,
	class: "alert alert-danger",
	role: "alert"
}, rt = {
	key: 1,
	role: "status"
}, it = {
	key: 2,
	class: "resource-empty-state"
}, at = {
	key: 4,
	class: "sb-collection-count"
}, ot = {
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
		let g = new O(n.api, r, () => n.model.refresh(), n.t, n.config.editorMode || "modal", n.config.application), v = /* @__PURE__ */ new Map(), y = (e) => {
			if (!e.adapter) return g;
			if (!v.has(e.adapter)) {
				let t = new We({
					...n.config,
					adapter: e.adapter,
					mode: n.config.readOnly ? "readonly" : "manage"
				});
				v.set(e.adapter, {
					api: t,
					driver: new O(t, r, () => n.model.refresh(), n.t, n.config.editorMode || "modal", n.config.application)
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
		]), E = (e) => (n.config.resourceActions || []).some((t) => t.id === e.id), D = (e, t) => t.collectionActions?.find((t) => t.id === e.id) || e, k = (e, t) => !r.loading && !r.busy && (e.id === "collectionRemove" ? n.model.canRemove : !t.some((e) => e.unavailable) && (E(e) ? !n.config.readOnly : t.every((t) => (!t.collectionActions || t.collectionActions.some((t) => t.id === e.id)) && y(t).available(D(e, t), [t])))), A = (e) => w.value.find((t) => t.id === n.config.defaultResourceActionId && k(t, [e])) || (n.config.contextActions === !0 && !n.config.readOnly ? K({
			...e,
			activatable: !e.unavailable
		}, "manage", w.value, k) : null), j = (e) => n.config.contextActions === !0 && !n.config.readOnly ? W(e, "manage", w.value, k) : null, M = (e, t) => e.id === "collectionRemove" ? n.model.remove([T(t)]) : k(e, [t]) && (E(e) ? n.config.onResourceAction?.(e, t) : y(t).execute(D(e, t), [t])), N = p(() => (r.presentation.sortFields || [{
			id: "title",
			label: "COM_SMARTBROWSER_NAME"
		}]).filter((e) => !["ordering", "collectionOrder"].includes(e.id))), F = (e) => {
			r.sortBy === e ? r.sortDirection = r.sortDirection === "asc" ? "desc" : "asc" : (r.sortBy = e, r.sortDirection = "asc");
		}, I = [{
			id: "grid",
			label: "COM_SMARTBROWSER_GRID",
			icon: "fas fa-th"
		}, {
			id: "details",
			label: "COM_SMARTBROWSER_DETAILS",
			icon: "fas fa-list"
		}], L = p(() => n.model.browser.bulkSelectableResources.value.length > 0 && n.model.browser.bulkSelectableResources.value.every((e) => r.selectedIds.includes(T(e))));
		return o(() => {
			g.destroy(), v.forEach(({ driver: e, api: t }) => {
				e.destroy(), t.destroy();
			});
		}), (e, n) => (_(), S("section", {
			class: i(["smartbrowser smartbrowser-collection", { "is-compact": t.config.layout === "compact" }]),
			"aria-label": t.t("COM_SMARTBROWSER_COLLECTION_TITLE"),
			"aria-busy": d(r).loading || d(r).busy
		}, [x("div", Ke, [
			x("header", qe, [x("div", Je, [
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
				}, null, -1)]], 8, Ye)) : m("", !0),
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
				}, null, -1)]], 8, Xe)) : m("", !0),
				n[5] ||= x("span", { class: "sb-collection-extra-buttons" }, null, -1),
				t.config.layout === "compact" ? m("", !0) : (_(), S(h, { key: 3 }, [x("select", {
					"aria-label": t.t("COM_SMARTBROWSER_SORT_BY"),
					value: d(r).sortBy,
					onChange: n[1] ||= (e) => d(r).sortBy = e.target.value
				}, [x("option", Qe, f(t.t("JGRID_HEADING_ORDERING")), 1), (_(!0), S(h, null, a(N.value, (e) => (_(), S("option", {
					key: e.id,
					value: e.id
				}, f(t.t(e.label)), 9, $e))), 128))], 40, Ze), x("button", {
					class: "resource-icon-button",
					type: "button",
					title: t.t("COM_SMARTBROWSER_SORT_DIRECTION"),
					"aria-label": t.t("COM_SMARTBROWSER_SORT_DIRECTION"),
					onClick: n[2] ||= (e) => d(r).sortDirection = d(r).sortDirection === "asc" ? "desc" : "asc"
				}, [x("span", {
					class: i(d(r).sortDirection === "asc" ? "fas fa-sort-amount-up" : "fas fa-sort-amount-down-alt"),
					"aria-hidden": "true"
				}, null, 2)], 8, et)], 64)),
				(_(), S(h, null, a(I, (e) => x("button", {
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
				}, null, 2)], 10, tt)), 64))
			])]),
			d(r).error ? (_(), S("p", nt, f(d(r).error), 1)) : m("", !0),
			d(r).loading ? (_(), S("p", rt, f(t.t("COM_SMARTBROWSER_LOADING")), 1)) : t.model.resources.value.length ? (_(), C(s(d(r).activeView === "details" ? He : le), {
				key: 3,
				resources: t.model.resources.value,
				"selected-ids": d(r).selectedIds,
				"focused-id": d(r).focusedId,
				"all-selected": L.value,
				"selection-controls": t.model.canRemove || t.model.canOrder,
				options: d(r).viewOptions,
				actions: w.value,
				"action-available": k,
				"default-action": A,
				"preview-action": j,
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
				"sort-fields": N.value,
				"ordering-field": "collectionOrder",
				t: t.t,
				onSelect: t.model.browser.toggle,
				onSelectAll: t.model.browser.selectAll,
				onFocus: t.model.browser.focus,
				onAction: M,
				onSort: F
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
			])) : (_(), S("p", it, f(t.t("COM_SMARTBROWSER_COLLECTION_EMPTY")), 1)),
			t.config.showCount === !1 ? m("", !0) : (_(), S("footer", at, f(t.t("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": " + f(t.model.getItems().length), 1))
		])], 10, Ge));
	}
}, st = (e, t) => (n, r) => {
	let i = (t) => e === "title" ? String(t.title || "").toLocaleLowerCase() : e === "dimension" ? (t.metadata?.width || 0) * (t.metadata?.height || 0) : t.metadata?.[e], a = i(n), o = i(r), s = typeof a == "string" ? (a || "").localeCompare(o || "") : (a || 0) - (o || 0);
	return t === "asc" ? s : -s;
};
//#endregion
//#region resources/js/core/createBrowserState.js
function ct({ options: e, api: t, persistence: n, viewRegistry: i }) {
	let a = e.pickerContext || e.selectionHost, o = !!a?.collectionMode, s = (o || e.mode === "select") && e.multiple === !1 ? 1 : a?.maxSelections ?? e.maxSelections ?? 500, c = o ? a.getCollectionSnapshot() : null, l = !!(o || e.selectionState || e.pickerContext && (Object.keys(e.pickerContext.selectionProfile || {}).length || e.pickerContext.initialSelection?.length)), u = e.adapter?.replace(/^flat-/, ""), d = (e) => o ? {
		...e,
		adapter: u,
		selection: {
			adapter: u,
			id: e.id
		},
		selectionKey: E({
			adapter: u,
			id: e.id
		})
	} : e, f = (t) => o && e.multiple && a.homogeneous && v.selectedIds.length && (v.selectedResources[v.selectedIds[0]]?.selection?.adapter || c.items.find((e) => E(e.selection) === v.selectedIds[0])?.selection.adapter) !== t.selection?.adapter, m = new Set(e.allowedResourceTypes || []), h = (t) => e.mode === "readonly" || f(t) || m.size && !m.has(t.type) ? {
		...t,
		selectable: !1,
		bulkSelectable: !1
	} : t, g = {
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
	}, _ = n.load(g);
	_.filters = {
		..._.filters || {},
		...e.initialFilters || {}
	}, Array.isArray(_.hiddenColumns) || (_.hiddenColumns = []), Array.isArray(_.shownColumns) || (_.shownColumns = []), e.currentNode && (_.selectedNode = e.currentNode), e.defaultView && (_.activeView = e.defaultView), i.has(_.activeView) || (_.activeView = "grid");
	let v = w({
		..._,
		roots: e.roots,
		nodes: [],
		items: [],
		contextItems: [],
		breadcrumb: [],
		actions: e.actions,
		presentation: e.presentation || {},
		currentResource: null,
		focusedId: null,
		selectedIds: c ? c.items.map((e) => E(e.selection)) : [],
		selectedResources: c?.resources || {},
		virtualResources: c?.virtualResources || {},
		search: "",
		loading: !1,
		busy: !1,
		error: ""
	}), y = p(() => {
		let t = v.search.trim().toLocaleLowerCase(), n = (e) => !t || [
			e.title,
			e.subtitle,
			e.metadata?.alias
		].some((e) => String(e || "").toLocaleLowerCase().includes(t)), r = v.nodes.map(d).map(L).map(h).filter(n), i = (v.presentation.selectionScoped && e.selectionState ? Object.values(v.virtualResources).filter((e) => e && (e.selection?.adapter || e.adapter || u) === u && e.parentId === v.selectedNode) : v.items).map(d).map(L).map(h).filter(n), a = v.contextItems.map(R);
		return v.sortBy ? [
			...r.sort(st(v.sortBy, v.sortDirection)),
			...i.sort(st(v.sortBy, v.sortDirection)),
			...a
		] : [
			...r,
			...i,
			...a
		];
	}), b = p(() => {
		let t = e.selectionTarget || "both";
		return y.value.filter((e) => V(e, t));
	}), x = p(() => {
		let t = e.selectionTarget || "both";
		return y.value.filter((e) => H(e, t));
	}), S = p(() => l ? v.selectedIds.map((e) => y.value.find((t) => T(t) === e) || v.selectedResources[e]).filter(Boolean) : y.value.filter((e) => v.selectedIds.includes(T(e)))), C = p(() => y.value.find((e) => T(e) === v.focusedId) || (l ? v.selectedResources[v.focusedId] : null) || null);
	async function D(n = v.selectedNode) {
		v.loading = !0, v.error = "", l || (v.selectedIds = []), v.focusedId = null;
		try {
			let r = await t.getResources(n, {
				search: v.search,
				sortBy: v.sortBy,
				sortDirection: v.sortDirection,
				filters: v.filters
			});
			if (v.selectedNode = n, v.nodes = r.nodes, v.items = r.items, r.presentation?.selectionScoped) for (let e of r.items) {
				let t = d(e);
				v.virtualResources[T(t)] = L(t);
			}
			if (l) for (let e of [...r.nodes, ...r.items]) {
				let t = d(e);
				v.selectedIds.includes(T(t)) && (v.selectedResources[T(t)] = h(L(t)));
			}
			v.contextItems = r.contextItems || [], v.breadcrumb = r.breadcrumb, v.actions = e.mode === "readonly" ? [] : r.actions, v.presentation = r.presentation || v.presentation, v.sortBy && !(v.presentation.sortFields || []).some((e) => e.id === v.sortBy) && (v.sortBy = "", v.sortDirection = ""), (v.presentation.filters || []).forEach((e) => {
				v.filters[e.id] === void 0 && (v.filters[e.id] = e.default);
			}), v.currentResource = r.currentResource || null;
			let i = new URL(window.location.href);
			i.searchParams.set("node", n), window.history.replaceState({}, "", i);
		} catch (t) {
			if (n !== e.initialNode && [403, 404].includes(t.status)) {
				v.selectedNode = e.initialNode, await D(e.initialNode);
				return;
			}
			v.error = t.message, Joomla.renderMessages({ error: [t.message] });
		} finally {
			v.loading = !1;
		}
	}
	function O(t, n = !0) {
		if (k(t), !V(t, e.selectionTarget || "both") || f(t)) return;
		let r = T(t);
		l && (v.selectedResources[r] = t);
		let i = v.selectedIds.includes(r);
		!i && e.multiple && n && v.selectedIds.length >= s || (!e.multiple || !n ? v.selectedIds = i ? [] : [r] : v.selectedIds = i ? v.selectedIds.filter((e) => e !== r) : [...v.selectedIds, r]);
	}
	function k(e) {
		B(e) && (v.focusedId = T(e));
	}
	function A() {
		l && x.value.forEach((e) => {
			v.selectedResources[T(e)] = e;
		});
		let t = x.value.map(T);
		if (o && !e.multiple) {
			let e = t[0];
			v.selectedIds = e && !v.selectedIds.includes(e) ? [e] : [];
			return;
		}
		let n = v.selectedIds.filter((e) => !t.includes(e)).length, r = Math.min(t.length, Math.max(0, s - n)), i = r > 0 && t.filter((e) => v.selectedIds.includes(e)).length >= r;
		v.selectedIds = i ? v.selectedIds.filter((e) => !t.includes(e)) : [.../* @__PURE__ */ new Set([...v.selectedIds, ...t])].slice(0, s);
	}
	function j() {
		l && x.value.forEach((e) => {
			v.selectedResources[T(e)] = e;
		});
		let e = x.value.map(T), t = new Set(v.selectedIds);
		e.forEach((e) => t.has(e) ? t.delete(e) : t.add(e)), v.selectedIds = [...t].slice(0, s);
	}
	r(() => [
		v.selectedNode,
		v.activeView,
		v.viewOptions,
		v.hiddenColumns,
		v.shownColumns,
		v.sortBy,
		v.sortDirection,
		v.showInfo,
		v.filters
	], () => n.save(v), { deep: !0 });
	function M(t, n) {
		if (e.multiple && v.selectedIds.length >= s || !e.selectionState || e.mode === "readonly" || e.selectionTarget === "node" || m.size && !m.has(n)) return !1;
		let r = v.selectedResources[v.selectedIds[0]]?.selection?.adapter || c?.items.find((e) => E(e.selection) === v.selectedIds[0])?.selection.adapter;
		return !(e.multiple && a?.homogeneous && r && r !== t);
	}
	function N(t) {
		return !(!e.selectionState || e.mode === "readonly" || e.selectionTarget === "node" || m.size && !m.has(t));
	}
	function P(t, n = null) {
		let r = t.adapter || u, i = {
			adapter: r,
			id: t.id
		}, a = o ? E(i) : t.id, s = n ? T(n) : null;
		if (n && !v.selectedIds.includes(s) && !v.virtualResources[s]) throw Error("COM_SMARTBROWSER_LINK_SELECTION_FULL");
		if ((v.selectedIds.includes(a) || v.virtualResources[a]) && a !== s) throw Error("COM_SMARTBROWSER_LINK_DUPLICATE");
		if (t.uniquenessId) for (let e of /* @__PURE__ */ new Set([...v.selectedIds, ...Object.keys(v.virtualResources)])) {
			if (e === s) continue;
			let n = v.virtualResources[e] || v.selectedResources[e], i = n?.selection || (n ? {
				adapter: n.adapter || u,
				id: n.id
			} : c?.items.find((t) => E(t.selection) === e)?.selection);
			if (i?.adapter === r && (i.id === t.uniquenessId || i.id.startsWith(t.uniquenessId + "."))) throw Error("COM_SMARTBROWSER_LINK_DUPLICATE");
		}
		if (!n && !N(t.type)) throw Error("COM_SMARTBROWSER_LINK_SELECTION_FULL");
		let l = L({
			...t,
			adapter: r,
			...o ? {
				selection: i,
				selectionKey: a
			} : {}
		});
		return v.selectedResources[a] = l, v.virtualResources[a] = l, v.selectedIds = n ? v.selectedIds.map((e) => e === s ? a : e) : M(r, t.type) ? e.multiple ? [...v.selectedIds, a] : [a] : v.selectedIds, s && s !== a && (delete v.selectedResources[s], delete v.virtualResources[s]), v.focusedId = a, l;
	}
	function F(e) {
		for (let t of e) {
			let e = T(t);
			v.virtualResources[e] && (v.selectedIds = v.selectedIds.filter((t) => t !== e), delete v.selectedResources[e], delete v.virtualResources[e], v.focusedId === e && (v.focusedId = null));
		}
	}
	return t.options && e.selectionState && (t.options.selectionItems = () => [.../* @__PURE__ */ new Set([...v.selectedIds, ...Object.keys(v.virtualResources)])].map((e) => {
		let t = v.virtualResources[e] || v.selectedResources[e];
		return t ? {
			selection: t.selection || {
				adapter: t.adapter || u,
				id: t.id
			},
			usage: {}
		} : c?.items.find((t) => E(t.selection) === e);
	}).filter(Boolean)), {
		state: v,
		resources: y,
		selectableResources: b,
		bulkSelectableResources: x,
		selection: S,
		focusedResource: C,
		load: D,
		focus: k,
		toggle: O,
		selectAll: A,
		invertSelection: j,
		canAddSelection: M,
		canCreateSelectionResource: N,
		replaceSelectionResource: P,
		deleteVirtualResources: F
	};
}
//#endregion
//#region resources/js/core/viewRegistry.js
var lt = () => {
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
}, ut = (e) => {
	if (!Array.isArray(e)) throw TypeError("Collection items must be an array.");
	let t = e.map((e) => e && typeof e == "object" ? e.id : e);
	if (t.some((e) => !["string", "number"].includes(typeof e) || String(e) === "")) throw TypeError("Invalid collection identifier.");
	return [...new Set(t.map(String))];
};
function dt({ config: e, api: t, notify: n, translate: r }) {
	let i = e.referenceItems === !0 || !e.adapter || (e.items || []).some((e) => e?.selection || e?.adapter), a = (t) => i ? D(t, e) : ut(t), o = (e) => i ? E(e.selection) : e, s = () => i ? JSON.parse(JSON.stringify(v)) : [...v], l = c(), u = e.viewPreferenceKey || "supjx.smartbrowser.collection.view", d;
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
	}, g = l.run(() => ct({
		options: m,
		api: t,
		persistence: h,
		viewRegistry: lt().register({
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
export { We as a, K as c, L as d, V as f, ot as i, G as l, A as m, lt as n, He as o, P as p, ct as r, le as s, dt as t, W as u };
