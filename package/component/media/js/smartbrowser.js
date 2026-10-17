import { A as e, B as t, C as n, E as r, F as i, I as a, J as o, K as s, M as c, N as l, P as u, S as d, W as f, Y as p, _ as m, b as h, g, j as _, k as ee, q as v, t as y, u as b, v as x, w as S, x as C, y as w, z as te } from "./visual-runtime-DqAjSaDT.js?v=4.0.0";
import { C as ne, S as re, T as ie, _ as ae, a as oe, b as T, c as se, d as ce, f as le, g as ue, h as de, i as fe, l as E, m as pe, n as me, p as he, r as ge, t as _e, u as ve, v as D, x as ye, y as O } from "./visual-runtime-Bwz_0MG8.js?v=4.0.0";
import { a as be, i as k, r as xe } from "./visual-runtime-1h24eaHt.js?v=4.0.0";
import { t as Se } from "./visual-runtime-B7XS5tio.js?v=4.0.0";
//#region resources/js/core/displayMode.js
var A = [
	"normal",
	"wide",
	"focus"
], j = "smartbrowser.displayMode";
function Ce(e, t = () => {}) {
	let n = "normal", r = [], i = null, a = e.ownerDocument, o;
	try {
		o = a.defaultView?.localStorage;
	} catch {}
	let s = (e, t, n) => {
		let i = e.getAttribute(t);
		e.setAttribute(t, n), r.push(() => i === null ? e.removeAttribute(t) : e.setAttribute(t, i));
	}, c = () => {
		i &&= (i.replaceWith(e), null), r.reverse().forEach((e) => e()), r = [];
	}, l = (r, l = !0) => {
		if (!A.includes(r)) return;
		let u = n;
		if (c(), n = r, t(n), l) try {
			o?.setItem(j, n);
		} catch {}
		let d = new CustomEvent("smartbrowser:display-mode", {
			bubbles: !0,
			cancelable: !0,
			detail: {
				mode: n,
				previous: u,
				container: e
			}
		});
		if (!e.dispatchEvent(d)) return n;
		if (n === "wide") for (let t = e.parentElement; t && t !== a.body && t !== a.documentElement; t = t.parentElement) s(t, "data-sb-wide-container", "");
		if (n === "focus") {
			i = a.createComment("SmartBrowser display position"), e.replaceWith(i), a.body.appendChild(e), s(e, "data-sb-focus", ""), s(a.body, "data-sb-focus-page", "");
			for (let t of a.body.children) t !== e && t.tagName !== "DIALOG" && s(t, "inert", "");
		}
		return n;
	}, u = (t) => {
		t.key === "Escape" && !t.defaultPrevented && n !== "normal" && !a.querySelector("dialog[open]") && (l("normal"), e.querySelector(".resource-display-toggle")?.focus());
	};
	a.addEventListener("keydown", u);
	try {
		let e = o?.getItem(j);
		A.includes(e) && e !== "normal" && l(e, !1);
	} catch {}
	return {
		get mode() {
			return n;
		},
		set: l,
		cycle: () => l(A[(A.indexOf(n) + 1) % 3]),
		destroy() {
			l("normal", !1), a.removeEventListener("keydown", u);
		}
	};
}
//#endregion
//#region resources/js/components/ResourceActions.vue
var M = { class: "resource-actions-area" }, we = [
	"href",
	"title",
	"aria-label"
], N = { class: "resource-action-label" }, P = [
	"disabled",
	"title",
	"aria-label"
], F = { class: "resource-action-label" }, Te = ["title", "aria-label"], Ee = { class: "resource-action-label" }, De = [
	"title",
	"aria-label",
	"disabled",
	"onClick"
], Oe = {
	key: 0,
	class: "resource-action-label"
}, I = [
	"aria-expanded",
	"title",
	"aria-label"
], L = { class: "resource-action-label" }, R = {
	key: 0,
	class: "resource-action-menu",
	role: "menu"
}, z = ["disabled", "onClick"], ke = [
	"disabled",
	"title",
	"aria-label"
], Ae = { class: "resource-action-label" }, je = ["title", "aria-label"], B = { class: "resource-action-label" }, Me = {
	key: 6,
	class: "resource-filter-buttons"
}, V = [
	"aria-expanded",
	"title",
	"aria-label"
], Ne = { class: "resource-action-label" }, Pe = {
	key: 0,
	class: "badge bg-primary"
}, Fe = ["disabled", "title"], Ie = [
	"title",
	"aria-label",
	"aria-pressed"
], H = [
	"href",
	"target",
	"rel",
	"title",
	"aria-label"
], U = {
	key: 0,
	class: "resource-action-filters"
}, W = ["value", "onChange"], Le = ["value"], Re = {
	__name: "ResourceActions",
	props: {
		actions: Array,
		available: Function,
		selection: Array,
		batchAvailable: Boolean,
		canCancel: Boolean,
		flatAvailable: Boolean,
		flatActive: Boolean,
		filtersOpen: Boolean,
		filters: Array,
		filterValues: Object,
		managerUrl: String,
		managerNewTab: Boolean,
		dashboardUrl: String,
		integrated: Boolean,
		selectionMode: Boolean,
		allowNoUser: Boolean,
		canComplete: Boolean,
		confirmLabel: String,
		t: Function
	},
	emits: [
		"action",
		"batch",
		"cancel",
		"toggle-flat",
		"toggle-filters",
		"filter",
		"clear-filters",
		"complete",
		"no-user"
	],
	setup(t) {
		let r = t, a = f(!1), o = f(null), s = f(null), h, g = 0, ee = 0, y = () => {
			let e = s.value;
			if (!e) return;
			e.classList.remove("is-compact-1", "is-compact-2", "is-compact-3", "is-compact-4");
			let t = () => {
				let t = getComputedStyle(e), n = parseFloat(t.columnGap) || 0, r = (parseFloat(t.paddingInlineStart) || 0) + (parseFloat(t.paddingInlineEnd) || 0), i = [...e.children].filter((e) => getComputedStyle(e).display !== "none");
				return i.reduce((e, t) => e + t.getBoundingClientRect().width, r + n * Math.max(0, i.length - 1)) <= e.clientWidth + 1;
			};
			for (let n = 1; n <= 4 && !t(); n += 1) e.classList.add(`is-compact-${n}`);
		}, b = () => {
			cancelAnimationFrame(g), g = requestAnimationFrame(y);
		}, S = x(() => (r.filters || []).filter((e) => String(r.filterValues[e.id] ?? e.default ?? "") !== String(e.default ?? "")).length), te = (e, t) => r.t(t.label), ne = x(() => {
			let e = /* @__PURE__ */ new Set(), t = [], n = r.filterValues?.state === "trashed" || r.selection?.length && r.selection.every((e) => e.status === -2), i = r.actions.filter((e) => (e.id !== "checkin" || r.available(e)) && !(e.id === "trash" && n) && (!e.trashedOnly || r.filterValues?.state === "trashed" || r.selection?.some((e) => e.status === -2)));
			return i.forEach((n) => {
				if (!n.exclusiveGroup) {
					t.push(n);
					return;
				}
				if (e.has(n.exclusiveGroup)) return;
				e.add(n.exclusiveGroup);
				let a = i.filter((e) => e.exclusiveGroup === n.exclusiveGroup), o = a.filter((e) => r.available(e)), s = r.selection?.length === 1 ? r.selection[0].overlays?.find((e) => a.some((t) => t.id === e.action))?.action : null;
				t.push(...o.length ? o : [a.find((e) => e.id === s) || a[0]]);
			}), t;
		}), re = {
			item: 0,
			node: 1,
			contextual: 2
		}, ie = x(() => ne.value.filter((e) => e.primary || e.creationRole || [
			"upload",
			"createNode",
			"createChild",
			"newArticle"
		].includes(e.id)).sort((e, t) => (re[e.creationRole] ?? 3) - (re[t.creationRole] ?? 3))), ae = x(() => ne.value.filter((e) => !ie.value.includes(e))), oe = (e) => {
			o.value?.contains(e.target) || (a.value = !1);
		}, T = (e) => {
			e.key === "Escape" && (a.value = !1);
		};
		return _(() => {
			document.addEventListener("click", oe), document.addEventListener("keydown", T), h = new ResizeObserver(([e]) => {
				e.contentRect.width !== ee && (ee = e.contentRect.width, b());
			}), h.observe(s.value), document.fonts?.ready.then(b), b();
		}), c(b), e(() => {
			document.removeEventListener("click", oe), document.removeEventListener("keydown", T), h?.disconnect(), cancelAnimationFrame(g);
		}), (e, r) => (l(), d("div", M, [w("div", {
			ref_key: "actionRow",
			ref: s,
			class: "resource-actions"
		}, [
			t.dashboardUrl ? (l(), d("a", {
				key: 0,
				class: "btn resource-dashboard-link",
				href: t.dashboardUrl,
				title: t.t(t.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD"),
				"aria-label": t.t(t.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD")
			}, [
				r[8] ||= w("span", {
					class: "fas fa-arrow-left",
					"aria-hidden": "true"
				}, null, -1),
				r[9] ||= n(),
				w("span", N, p(t.t(t.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD")), 1)
			], 8, we)) : C("", !0),
			t.selectionMode ? (l(), d("button", {
				key: 1,
				type: "button",
				class: "btn btn-primary",
				disabled: !t.canComplete,
				title: t.confirmLabel || t.t("COM_SMARTBROWSER_SELECT"),
				"aria-label": t.confirmLabel || t.t("COM_SMARTBROWSER_SELECT"),
				onClick: r[0] ||= (t) => e.$emit("complete")
			}, [
				r[10] ||= w("span", {
					class: "fas fa-check",
					"aria-hidden": "true"
				}, null, -1),
				r[11] ||= n(),
				w("span", F, p(t.confirmLabel || t.t("COM_SMARTBROWSER_SELECT")), 1)
			], 8, P)) : C("", !0),
			t.allowNoUser ? (l(), d("button", {
				key: 2,
				type: "button",
				class: "btn btn-outline-secondary",
				title: t.t("JOPTION_NO_USER"),
				"aria-label": t.t("JOPTION_NO_USER"),
				onClick: r[1] ||= (t) => e.$emit("no-user")
			}, [
				r[12] ||= w("span", {
					class: "fas fa-user",
					"aria-hidden": "true"
				}, null, -1),
				r[13] ||= n(),
				w("span", Ee, p(t.t("JOPTION_NO_USER")), 1)
			], 8, Te)) : C("", !0),
			(l(!0), d(m, null, u(ie.value, (n) => (l(), d("button", {
				key: n.id,
				type: "button",
				class: v(["btn btn-outline-secondary", [`resource-action-${n.id}`, { "resource-contextual-add": n.creationRole === "contextual" }]]),
				title: t.t(n.label),
				"aria-label": t.t(n.label),
				disabled: !t.available(n),
				onClick: (t) => e.$emit("action", n)
			}, [w("span", {
				class: v(n.icon),
				"aria-hidden": "true"
			}, null, 2), n.creationRole === "contextual" ? C("", !0) : (l(), d("span", Oe, p(t.t(n.label)), 1))], 10, De))), 128)),
			ae.value.length ? (l(), d("div", {
				key: 3,
				ref_key: "actionMenu",
				ref: o,
				class: "resource-action-menu-wrap"
			}, [w("button", {
				type: "button",
				class: "btn btn-outline-secondary resource-action-menu-toggle",
				"aria-expanded": a.value,
				title: t.t("COM_SMARTBROWSER_ACTIONS"),
				"aria-label": t.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: r[2] ||= (e) => a.value = !a.value
			}, [
				r[14] ||= w("span", {
					class: "fas fa-ellipsis-h",
					"aria-hidden": "true"
				}, null, -1),
				r[15] ||= n(),
				w("span", L, p(t.t("COM_SMARTBROWSER_ACTIONS")), 1),
				r[16] ||= n(),
				r[17] ||= w("span", {
					class: "fas fa-angle-down",
					"aria-hidden": "true"
				}, null, -1)
			], 8, I), a.value ? (l(), d("div", R, [(l(!0), d(m, null, u(ae.value, (r) => (l(), d("div", {
				key: r.id,
				class: "resource-action-menu-item",
				role: "none"
			}, [w("button", {
				type: "button",
				role: "menuitem",
				class: v(`resource-action-${r.id}`),
				disabled: !t.available(r),
				onClick: (t) => {
					a.value = !1, e.$emit("action", r);
				}
			}, [w("span", {
				class: v(r.icon),
				"aria-hidden": "true"
			}, null, 2), n(" " + p(t.t(r.label)), 1)], 10, z)]))), 128))])) : C("", !0)], 512)) : C("", !0),
			t.batchAvailable ? (l(), d("button", {
				key: 4,
				type: "button",
				class: "btn btn-outline-secondary resource-batch-toggle",
				disabled: !t.selection?.length,
				title: t.t("COM_SMARTBROWSER_BATCH_ACTIONS"),
				"aria-label": t.t("COM_SMARTBROWSER_BATCH_ACTIONS"),
				onClick: r[3] ||= (t) => e.$emit("batch")
			}, [
				r[18] ||= w("span", {
					class: "fas fa-magic",
					"aria-hidden": "true"
				}, null, -1),
				r[19] ||= n(),
				w("span", Ae, p(t.t("COM_SMARTBROWSER_BATCH")), 1)
			], 8, ke)) : C("", !0),
			t.canCancel ? (l(), d("button", {
				key: 5,
				type: "button",
				class: "btn btn-danger resource-picker-cancel",
				title: t.t("JCANCEL"),
				"aria-label": t.t("JCANCEL"),
				onClick: r[4] ||= (t) => e.$emit("cancel")
			}, [
				r[20] ||= w("span", {
					class: "fas fa-times",
					"aria-hidden": "true"
				}, null, -1),
				r[21] ||= n(),
				w("span", B, p(t.t("JCANCEL")), 1)
			], 8, je)) : C("", !0),
			t.filters?.length ? (l(), d("div", Me, [w("button", {
				type: "button",
				class: v(["btn resource-filter-toggle", { active: t.filtersOpen }]),
				"aria-expanded": t.filtersOpen,
				title: t.t("COM_SMARTBROWSER_FILTER_OPTIONS"),
				"aria-label": t.t("COM_SMARTBROWSER_FILTER_OPTIONS"),
				onClick: r[5] ||= (t) => e.$emit("toggle-filters")
			}, [
				r[22] ||= w("span", {
					class: "fas fa-filter",
					"aria-hidden": "true"
				}, null, -1),
				r[23] ||= n(),
				w("span", Ne, p(t.t("COM_SMARTBROWSER_FILTER_OPTIONS")), 1),
				S.value ? (l(), d("span", Pe, p(S.value), 1)) : C("", !0),
				w("span", {
					class: v(["fas fa-angle-down resource-filter-caret", { open: t.filtersOpen }]),
					"aria-hidden": "true"
				}, null, 2)
			], 10, V), w("button", {
				type: "button",
				class: "btn resource-filter-clear",
				disabled: !S.value,
				title: t.t("JCLEAR"),
				onClick: r[6] ||= (t) => e.$emit("clear-filters")
			}, p(t.t("JCLEAR")), 9, Fe)])) : C("", !0),
			t.flatAvailable ? (l(), d("button", {
				key: 7,
				type: "button",
				class: v(["btn resource-flat-toggle", { active: t.flatActive }]),
				title: t.t("COM_SMARTBROWSER_FLAT_VIEW"),
				"aria-label": t.t("COM_SMARTBROWSER_FLAT_VIEW"),
				"aria-pressed": t.flatActive,
				onClick: r[7] ||= (t) => e.$emit("toggle-flat")
			}, [...r[24] ||= [w("span", {
				class: "fas fa-layer-group",
				"aria-hidden": "true"
			}, null, -1)]], 10, Ie)) : C("", !0),
			t.managerUrl ? (l(), d("a", {
				key: 8,
				class: "btn resource-manager-link",
				href: t.managerUrl,
				target: t.managerNewTab ? "_blank" : void 0,
				rel: t.managerNewTab ? "noopener noreferrer" : void 0,
				title: t.t("COM_SMARTBROWSER_OPEN_JOOMLA_MANAGER"),
				"aria-label": t.t("COM_SMARTBROWSER_OPEN_JOOMLA_MANAGER")
			}, [...r[25] ||= [w("span", {
				class: "fab fa-joomla",
				"aria-hidden": "true"
			}, null, -1)]], 8, H)) : C("", !0),
			i(e.$slots, "display-controls")
		], 512), t.filters?.length && t.filtersOpen ? (l(), d("div", U, [(l(!0), d(m, null, u(t.filters, (n) => (l(), d("label", { key: n.id }, [w("span", null, p(t.t(n.label)), 1), n.type === "select" ? (l(), d("select", {
			key: 0,
			class: "form-select",
			value: t.filterValues[n.id] ?? n.default,
			onChange: (t) => e.$emit("filter", {
				id: n.id,
				value: t.target.value
			})
		}, [(l(!0), d(m, null, u(n.options, (e) => (l(), d("option", {
			key: e.value,
			value: e.value
		}, p(te(n, e)), 9, Le))), 128))], 40, W)) : C("", !0)]))), 128))])) : C("", !0)]));
	}
}, G = {
	class: "resource-breadcrumb",
	"aria-label": "Breadcrumb"
}, K = [
	"title",
	"aria-label",
	"onClick"
], ze = {
	key: 1,
	class: "resource-breadcrumb-title"
}, Be = {
	__name: "ResourceBreadcrumb",
	props: {
		breadcrumb: Array,
		root: Object,
		rootIcon: String,
		iconOnlyRoot: Boolean
	},
	emits: ["open"],
	setup(e) {
		let t = e, n = x(() => {
			let e = t.breadcrumb || [], n = e[0] || t.root;
			return n ? [n, ...e.slice(1).filter((e) => e.visible !== !1)] : [];
		});
		return (t, r) => (l(), d("nav", G, [(l(!0), d(m, null, u(n.value, (n, r) => (l(), d("button", {
			key: n.id,
			type: "button",
			class: v({ "root-crumb": r === 0 && e.iconOnlyRoot }),
			title: n.title,
			"aria-label": r === 0 && e.iconOnlyRoot ? n.title : void 0,
			onClick: (e) => t.$emit("open", n.id)
		}, [r === 0 ? (l(), d("span", {
			key: 0,
			class: v(n.useResourceIcon ? n.openIcon || n.icon : e.rootIcon),
			"aria-hidden": "true"
		}, null, 2)) : C("", !0), r !== 0 || !e.iconOnlyRoot ? (l(), d("span", ze, p(n.title), 1)) : C("", !0)], 10, K))), 128))]));
	}
}, Ve = {
	class: "resource-toolbar",
	role: "toolbar"
}, He = { class: "resource-toolbar-primary" }, Ue = { class: "resource-view-controls" }, We = [
	"disabled",
	"title",
	"aria-label"
], Ge = [
	"value",
	"aria-label",
	"placeholder"
], Ke = ["title", "aria-label"], qe = ["disabled"], Je = ["disabled"], Ye = ["title"], Xe = { "aria-hidden": "true" }, Ze = { class: "resource-mode-controls" }, Qe = ["title", "onClick"], $e = ["title"], et = {
	__name: "ResourceToolbar",
	props: {
		breadcrumb: Array,
		root: Object,
		rootIcon: String,
		iconOnlyRoot: Boolean,
		search: String,
		sortBy: String,
		sortDirection: String,
		sortFields: Array,
		orderingField: String,
		views: Array,
		activeView: String,
		gridSize: String,
		detailsThumbnails: Boolean,
		multiple: Boolean,
		columns: Array,
		hiddenColumns: Array,
		shownColumns: Array,
		showInfo: Boolean,
		canInvert: Boolean,
		reorderVisible: Boolean,
		reorderEnabled: Boolean,
		t: Function
	},
	emits: [
		"open",
		"invert-selection",
		"reorder",
		"search",
		"sort-by",
		"sort-direction-value",
		"resize",
		"toggle-thumbnails",
		"toggle-date-field",
		"toggle-column",
		"view",
		"info"
	],
	setup(e) {
		let n = e, r = x(() => n.views.find((e) => e.id === n.activeView) || {}), i = [
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
		], a = x(() => {
			let e = n.sortFields?.length ? [...n.sortFields] : [...i];
			n.orderingField && !e.some((e) => e.id === n.orderingField) && e.push({
				id: n.orderingField,
				label: "JGRID_HEADING_ORDERING"
			});
			let t = (n.columns || []).flatMap((e) => e.dateGroup ? (e.fields || []).map((e) => e.sortField || e.id) : [e.sortField || e.id]), r = (e) => e === n.orderingField ? -1 : t.indexOf(e);
			return e.sort((e, i) => {
				let a = r(e.id), o = r(i.id);
				return (a < 0 && e.id !== n.orderingField ? t.length : a) - (o < 0 && i.id !== n.orderingField ? t.length : o);
			});
		}), o = x(() => ({
			created: "C",
			modified: "M",
			both: "M&C"
		})[n.detailsDateMode] || "M"), s = x(() => `${n.t("COM_SMARTBROWSER_DATE")}: ${o.value}`), c = (e) => r.value.controls?.includes(e);
		return (n, r) => (l(), d("div", Ve, [w("div", He, [S(Be, {
			breadcrumb: e.breadcrumb,
			root: e.root,
			"root-icon": e.rootIcon,
			"icon-only-root": e.iconOnlyRoot,
			onOpen: r[0] ||= (e) => n.$emit("open", e)
		}, null, 8, [
			"breadcrumb",
			"root",
			"root-icon",
			"icon-only-root"
		]), w("div", Ue, [
			e.reorderVisible ? (l(), h(T, {
				key: 0,
				enabled: e.reorderEnabled,
				t: e.t,
				onReorder: r[1] ||= (e) => n.$emit("reorder", e)
			}, null, 8, ["enabled", "t"])) : C("", !0),
			e.multiple ? (l(), d("button", {
				key: 1,
				type: "button",
				class: "resource-icon-button",
				disabled: !e.canInvert,
				title: e.t("COM_SMARTBROWSER_INVERT_SELECTION"),
				"aria-label": e.t("COM_SMARTBROWSER_INVERT_SELECTION"),
				onClick: r[2] ||= (e) => n.$emit("invert-selection")
			}, [...r[13] ||= [w("span", {
				class: "fas fa-retweet",
				"aria-hidden": "true"
			}, null, -1)]], 8, We)) : C("", !0),
			S(O, {
				label: e.t("COM_SMARTBROWSER_SEARCH"),
				icon: "fas fa-search",
				"panel-class": "resource-search-row",
				width: 360
			}, {
				default: t(() => [w("form", {
					class: "input-group resource-search-control",
					role: "search",
					onSubmit: r[4] ||= g((t) => n.$emit("search", e.search), ["prevent"])
				}, [w("input", {
					value: e.search,
					type: "search",
					class: "form-control",
					"aria-label": e.t("COM_SMARTBROWSER_SEARCH"),
					placeholder: e.t("COM_SMARTBROWSER_SEARCH"),
					onInput: r[3] ||= (e) => n.$emit("search", e.target.value)
				}, null, 40, Ge), w("button", {
					type: "submit",
					class: "btn btn-primary",
					title: e.t("COM_SMARTBROWSER_SEARCH"),
					"aria-label": e.t("COM_SMARTBROWSER_SEARCH")
				}, [...r[14] ||= [w("span", {
					class: "fas fa-search",
					"aria-hidden": "true"
				}, null, -1)]], 8, Ke)], 32)]),
				_: 1
			}, 8, ["label"]),
			c("sort") ? (l(), h(ae, {
				key: 2,
				fields: a.value,
				"sort-by": e.sortBy,
				"sort-direction": e.sortDirection,
				t: e.t,
				onSortBy: r[5] ||= (e) => n.$emit("sort-by", e),
				onSortDirectionValue: r[6] ||= (e) => n.$emit("sort-direction-value", e)
			}, null, 8, [
				"fields",
				"sort-by",
				"sort-direction",
				"t"
			])) : C("", !0),
			c("zoom") ? (l(), d("button", {
				key: 3,
				type: "button",
				class: "resource-icon-button",
				disabled: e.gridSize === "sm",
				title: "Decrease size",
				onClick: r[7] ||= (e) => n.$emit("resize", -1)
			}, [...r[15] ||= [w("span", {
				class: "fas fa-search-minus",
				"aria-hidden": "true"
			}, null, -1)]], 8, qe)) : C("", !0),
			c("zoom") ? (l(), d("button", {
				key: 4,
				type: "button",
				class: "resource-icon-button",
				disabled: e.gridSize === "xl",
				title: "Increase size",
				onClick: r[8] ||= (e) => n.$emit("resize", 1)
			}, [...r[16] ||= [w("span", {
				class: "fas fa-search-plus",
				"aria-hidden": "true"
			}, null, -1)]], 8, Je)) : C("", !0),
			c("thumbnails") ? (l(), d("button", {
				key: 5,
				type: "button",
				class: v(["resource-icon-button", { active: e.detailsThumbnails }]),
				title: "Toggle thumbnails",
				onClick: r[9] ||= (e) => n.$emit("toggle-thumbnails")
			}, [...r[17] ||= [w("span", {
				class: "fas fa-images",
				"aria-hidden": "true"
			}, null, -1)]], 2)) : C("", !0),
			c("dateField") ? (l(), d("button", {
				key: 6,
				type: "button",
				class: "resource-icon-button resource-date-toggle",
				title: s.value,
				onClick: r[10] ||= (e) => n.$emit("toggle-date-field")
			}, [r[18] ||= w("span", {
				class: "fas fa-calendar",
				"aria-hidden": "true"
			}, null, -1), w("small", Xe, p(o.value), 1)], 8, Ye)) : C("", !0),
			c("dateField") && e.columns?.length ? (l(), h(D, {
				key: 7,
				columns: e.columns,
				"hidden-columns": e.hiddenColumns,
				"shown-columns": e.shownColumns,
				t: e.t,
				onToggleColumn: r[11] ||= (e) => n.$emit("toggle-column", e)
			}, null, 8, [
				"columns",
				"hidden-columns",
				"shown-columns",
				"t"
			])) : C("", !0),
			w("div", Ze, [(l(!0), d(m, null, u(e.views, (t) => (l(), d("button", {
				key: t.id,
				type: "button",
				class: v(["resource-icon-button", { active: e.activeView === t.id }]),
				title: e.t(t.label),
				onClick: (e) => n.$emit("view", t.id)
			}, [w("span", {
				class: v(t.icon),
				"aria-hidden": "true"
			}, null, 2)], 10, Qe))), 128))]),
			w("button", {
				type: "button",
				class: v(["resource-icon-button", { active: e.showInfo }]),
				title: e.t("COM_SMARTBROWSER_TOGGLE_INFO"),
				onClick: r[12] ||= (e) => n.$emit("info")
			}, [...r[19] ||= [w("span", {
				class: "fas fa-info",
				"aria-hidden": "true"
			}, null, -1)]], 10, $e)
		])])]));
	}
}, tt = {
	__name: "ResourceNodeVisual",
	props: {
		resource: Object,
		open: Boolean
	},
	setup(e) {
		return (t, n) => (l(), h(y, {
			resource: e.resource,
			variant: "compact",
			"allow-image": !1,
			open: e.open,
			"align-base-start": ""
		}, null, 8, ["resource", "open"]));
	}
}, nt = ["aria-label"], q = ["open", "onToggle"], rt = ["onClick"], it = {
	key: 0,
	class: "resource-adapter-roots"
}, at = ["onClick"], ot = {
	key: 1,
	class: "resource-tree-branch"
}, st = ["onClick"], ct = ["onClick"], lt = {
	__name: "ResourceTree",
	props: {
		adapters: Array,
		activeAdapter: String,
		roots: Array,
		nodes: Array,
		breadcrumb: Array,
		selectedNode: String,
		t: Function
	},
	emits: ["open", "adapter"],
	setup(e, { emit: t }) {
		let r = e, i = t, a = (e, t) => {
			e.target.open && t !== r.activeAdapter && i("adapter", t);
		}, s = (e) => {
			e === r.activeAdapter ? r.roots[0] && i("open", r.roots[0].id) : i("adapter", e);
		}, c = (e) => r.breadcrumb.some((t) => t.id === e.id), f = (e) => r.breadcrumb.filter((t) => t.id !== e.id), h = x(() => r.roots.some((e) => e.visible !== !1 || c(e) && (f(e).length > 0 || r.nodes.length > 0))), _ = (e, t) => ({ paddingInlineStart: `${10 + (e.visible === !1 ? 0 : 18) + t * 18}px` });
		return (t, r) => (l(), d("nav", {
			class: "resource-sidebar",
			"aria-label": e.t("COM_SMARTBROWSER_VIEW")
		}, [(l(!0), d(m, null, u(e.adapters, (r) => (l(), d("details", {
			key: r.id,
			class: "resource-adapter",
			open: r.id === e.activeAdapter,
			onToggle: (e) => a(e, r.id)
		}, [w("summary", { onClick: g((e) => s(r.id), ["prevent"]) }, [w("span", {
			class: v(r.icon),
			"aria-hidden": "true"
		}, null, 2), n(" " + p(r.title), 1)], 8, rt), r.id !== e.activeAdapter || h.value ? (l(), d("div", it, [(l(!0), d(m, null, u(r.id === e.activeAdapter ? e.roots : [], (n) => (l(), d("section", {
			key: n.id,
			class: v(["resource-tree-root", { "root-hidden": n.visible === !1 }])
		}, [n.visible === !1 ? C("", !0) : (l(), d("button", {
			key: 0,
			type: "button",
			class: v({ active: e.selectedNode === n.id }),
			onClick: (e) => t.$emit("open", n.id)
		}, [w("span", {
			class: v(["resource-tree-root-icon", n.useResourceIcon ? n.icon : r.icon]),
			"aria-hidden": "true"
		}, null, 2), w("span", null, p(n.title), 1)], 10, at)), c(n) ? (l(), d("div", ot, [(l(!0), d(m, null, u(f(n), (r) => (l(), d("button", {
			key: r.id,
			type: "button",
			class: v({ active: e.selectedNode === r.id }),
			style: o(_(n, f(n).indexOf(r))),
			onClick: (e) => t.$emit("open", r.id)
		}, [S(tt, {
			resource: r,
			open: !0
		}, null, 8, ["resource"]), w("span", null, p(r.title), 1)], 14, st))), 128)), (l(!0), d(m, null, u(e.nodes, (e) => (l(), d(m, { key: e.id }, [e.navigable === !1 ? (l(), d("div", {
			key: 1,
			class: "resource-tree-entry resource-tree-static",
			style: o(_(n, f(n).length))
		}, [S(tt, { resource: e }, null, 8, ["resource"]), w("span", null, p(e.title), 1)], 4)) : (l(), d("button", {
			key: 0,
			type: "button",
			class: "resource-tree-entry",
			style: o(_(n, f(n).length)),
			onClick: (n) => t.$emit("open", e.id)
		}, [S(tt, { resource: e }, null, 8, ["resource"]), w("span", null, p(e.title), 1)], 12, ct))], 64))), 128))])) : C("", !0)], 2))), 128))])) : C("", !0)], 40, q))), 128))], 8, nt));
	}
}, ut = /* @__PURE__ */ new Set([
	"articles",
	"categories",
	"tags",
	"articles-by-tag",
	"menus",
	"users",
	"media"
]), dt = (e, t, n) => {
	let r = e.startsWith("flat-") ? new URL(n).searchParams.get("flatFromBrowseRoot") || "" : t || "";
	return `supjx.smartbrowser.ui.${e.replace(/^flat-/, "")}.${r}`;
}, ft = (e, t, n, r) => {
	let i = new URL(e);
	if (!ut.has(t)) return i.toString();
	i.searchParams.set("flatFromAdapter", t), i.searchParams.set("flatFromNode", n), r ? i.searchParams.set("flatFromBrowseRoot", r) : i.searchParams.delete("flatFromBrowseRoot");
	let a = `flat-${t}`;
	if (i.searchParams.set("adapter", a), i.searchParams.set("node", `${a}:root`), t === "articles" || t === "categories") {
		let e = n.startsWith("category:") ? n : r;
		e?.startsWith("category:") ? i.searchParams.set("browseRoot", e) : i.searchParams.delete("browseRoot"), i.searchParams.delete("flatScope");
	} else r ? i.searchParams.set("browseRoot", r) : i.searchParams.delete("browseRoot"), i.searchParams.set("flatScope", n);
	return i.toString();
}, pt = (e, t) => {
	let n = new URL(e), r = n.searchParams.get("flatFromAdapter"), i = ut.has(r) ? r : "articles", a = n.searchParams.get("flatFromBrowseRoot") || (r ? null : t), o = n.searchParams.get("flatFromNode") || a || "content:root";
	n.searchParams.set("adapter", i), n.searchParams.set("node", o), a ? n.searchParams.set("browseRoot", a) : n.searchParams.delete("browseRoot");
	for (let e of [
		"flatFromAdapter",
		"flatFromNode",
		"flatFromBrowseRoot",
		"flatScope"
	]) n.searchParams.delete(e);
	return n.toString();
}, mt = (e, t) => {
	let n = new URL(e);
	if (!n.searchParams.get("adapter")?.startsWith("flat-") || !t) return n.toString();
	let r = n.searchParams.get("adapter");
	if (n.searchParams.set("node", `${r}:root`), n.searchParams.set("flatFromNode", t), r === "flat-articles" || r === "flat-categories") {
		let e = n.searchParams.get("flatFromBrowseRoot") || (n.searchParams.has("flatFromAdapter") ? null : n.searchParams.get("browseRoot"));
		e ? n.searchParams.set("browseRoot", e) : n.searchParams.delete("browseRoot"), n.searchParams.delete("flatScope");
	} else n.searchParams.set("flatScope", t);
	return n.toString();
}, ht = {
	articles: [
		["categoryPath", "COM_SMARTBROWSER_CATEGORY_HIERARCHY"],
		["tagPaths", "COM_SMARTBROWSER_TAG_HIERARCHY"],
		["access", "JFIELD_ACCESS_LABEL"],
		["languageKey", "COM_SMARTBROWSER_LANGUAGE_KEY"]
	],
	categories: [
		["categoryPath", "COM_SMARTBROWSER_CATEGORY_HIERARCHY"],
		["access", "JFIELD_ACCESS_LABEL"],
		["languageKey", "COM_SMARTBROWSER_LANGUAGE_KEY"]
	],
	tags: [
		["tagPaths", "COM_SMARTBROWSER_TAG_HIERARCHY"],
		["access", "JFIELD_ACCESS_LABEL"],
		["languageKey", "COM_SMARTBROWSER_LANGUAGE_KEY"]
	],
	menus: [["link", "COM_SMARTBROWSER_URL"]],
	media: [
		["parentPath", "COM_SMARTBROWSER_PARENT"],
		["url", "COM_SMARTBROWSER_URL"],
		["mimeType", "COM_SMARTBROWSER_MIME_TYPE"],
		["extension", "COM_SMARTBROWSER_EXTENSION"],
		[
			"width",
			"COM_SMARTBROWSER_DIMENSIONS",
			"dimensions"
		],
		[
			"size",
			"COM_SMARTBROWSER_SIZE",
			"size"
		]
	]
}, gt = (e) => ({
	stateLabel: "status",
	width: "dimension",
	link: "url"
})[e.split(".").pop()] || e.split(".").pop();
function _t(e, t) {
	let n = e?.columns || [], r = n.map((e) => ({
		...e,
		defaultVisible: !0
	})), i = new Set(n.map((e) => e.id)), a = new Set(n.map((e) => e.source).filter(Boolean)), o = t.replace(/^flat-/, "") === "articles-by-tag" ? "articles" : t.replace(/^flat-/, ""), s = [...e?.infoFields || [], ...(ht[o] || []).map(([e, t, n]) => ({
		id: gt(e),
		label: t,
		source: `metadata.${e}`,
		format: n
	}))], c = i.has("dates");
	for (let e of s) {
		if (!e.source || !e.label || e.source === "metadata.locationPath") continue;
		let t = e.id || gt(e.source);
		i.has(t) || a.has(e.source) || c && ["created", "modified"].includes(t) || (i.add(t), a.add(e.source), r.push({
			id: t,
			label: e.label,
			source: e.source,
			format: e.format,
			sortField: e.sortField,
			defaultVisible: !1
		}));
	}
	return r;
}
//#endregion
//#region resources/js/components/SmartBrowserApp.vue
var vt = {
	key: 0,
	class: "resource-picker-titlebar"
}, yt = ["title"], bt = {
	key: 1,
	class: "smartbrowser-busy",
	role: "status",
	"aria-live": "polite"
}, xt = [
	"aria-pressed",
	"title",
	"aria-label"
], St = [
	"aria-pressed",
	"title",
	"aria-label"
], Ct = {
	key: 2,
	class: "resource-picker-collection"
}, wt = [
	"title",
	"aria-label",
	"aria-expanded"
], Tt = { class: "resource-main" }, Et = {
	key: 0,
	class: "resource-loader"
}, Dt = {
	key: 1,
	class: "resource-empty"
}, Ot = {
	key: 3,
	class: "resource-drop-overlay"
}, J = {
	__name: "SmartBrowserApp",
	setup(i) {
		let c = r("browser"), u = r("smartBrowserOptions"), m = u.application === "site" && window.self === window.top, y = f("normal"), b = f(null), ae = f("620px"), T, E = () => {
			let e = b.value;
			if (!e) return;
			let t = e.parentElement, n = getComputedStyle(t), r = parseFloat(n.paddingBottom) + parseFloat(n.borderBottomWidth), i = t.hasAttribute("data-sb-focus") ? 0 : window.scrollY;
			ae.value = `${Math.max(0, window.innerHeight - e.getBoundingClientRect().top - i - r)}px`;
		}, me, ge = x(() => ({
			normal: "COM_SMARTBROWSER_DISPLAY_WIDE",
			wide: "COM_SMARTBROWSER_DISPLAY_FOCUS",
			focus: "COM_SMARTBROWSER_DISPLAY_NORMAL"
		})[y.value]), ve = () => {
			y.value = me.cycle();
		};
		_(() => {
			m && (me = Ce(document.getElementById("smartbrowser-app"), (e) => {
				y.value = e;
			})), E(), T = new ResizeObserver(E), T.observe(b.value.parentElement), window.addEventListener("resize", E);
		}), te(y, () => ee(E)), e(() => {
			T?.disconnect(), window.removeEventListener("resize", E), me?.destroy();
		});
		let D = r("actionDriver"), O = r("resourceApi"), A = r("viewRegistry"), { state: j, resources: M, bulkSelectableResources: we, selection: N, focusedResource: P, load: F, focus: Te, toggle: Ee, selectAll: De, invertSelection: Oe } = c, I = u.mode === "select" ? u.pickerContext || u.selectionHost : u.selectionHost || null, L = !!I?.collectionMode, R = (e) => Joomla.Text?._(e, e) || e, z = /* @__PURE__ */ new Map(), ke = (e) => {
			let t = e?.selection?.adapter || e?.adapter;
			if (!t || t === u.adapter.replace(/^flat-/, "")) return D;
			if (!z.has(t)) {
				let e = new se({
					...u,
					adapter: t,
					browseRoot: null,
					flatScope: null
				});
				z.set(t, {
					api: e,
					driver: new Se(e, j, async () => {
						await V?.refresh();
						for (let e of V?.browser.state.items || []) j.selectedResources[k(e)] = de(e);
						await F();
					}, R, u.editorMode, u.application)
				});
			}
			return z.get(t).driver.selectionHost = Le, z.get(t).driver;
		}, Ae = (e) => e?.collectionActions || j.actions, je = (e, t) => Ae(t).find((t) => t.id === e.id) || e, B = (e, t) => {
			if (!L || e.currentNode || !t.length) return D.available(e, t);
			if (e.single && t.length !== 1) return !1;
			let n = (t) => (!t.collectionActions || t.collectionActions.some((t) => t.id === e.id)) && ke(t).available(je(e, t), [t]);
			return e.exclusiveGroup ? t.some(n) : t.every(n);
		}, Me = async (e, t) => {
			if (!B(e, t)) return;
			if (!L || e.currentNode || !t.length) return D.execute(e, t);
			let n = /* @__PURE__ */ new Map();
			for (let e of t) {
				let t = ke(e);
				n.has(t) || n.set(t, []), n.get(t).push(e);
			}
			for (let [t, r] of n) await t.execute(je(e, r[0]), r);
		};
		e(() => z.forEach(({ api: e, driver: t }) => {
			t.destroy(), e.destroy();
		}));
		let V, Ne = !1, Pe = {
			referenceItems: !0,
			homogeneous: I?.homogeneous === !0,
			readOnly: !1,
			showCount: !1,
			selectionProfile: I?.selectionProfile || {},
			addressContract: I?.addressContract,
			adapter: u.adapter,
			allowedAdapters: I?.allowedAdapters || (I?.collectionMode ? [] : [u.adapter]),
			allowedResourceTypes: u.allowedResourceTypes,
			selectionTarget: u.selectionTarget,
			maxSelections: I?.maxSelections || 500,
			selectedResources: !0,
			informationPanel: !1,
			multiple: u.multiple,
			items: I?.getCollectionSnapshot?.().items || [],
			layout: "compact",
			allowRemove: !0,
			allowOrdering: u.multiple && I?.allowOrdering !== !1,
			contextActions: !1,
			resourceActions: [{
				id: "selectionFocus",
				label: "COM_SMARTBROWSER_USAGE_OPTIONS",
				icon: "fas fa-pen",
				requiresSelection: !0
			}],
			defaultResourceActionId: "selectionFocus",
			apiBaseUrl: u.apiBaseUrl,
			csrfToken: u.csrfToken,
			application: u.application,
			onResourceAction: (e, t) => {
				j.selectedResources[k(t)] = t, j.focusedId = k(t);
			}
		}, Fe = /* @__PURE__ */ new Map();
		async function Ie(e, t = {}) {
			let n = JSON.stringify([e.adapter, t.browseRoot || ""]);
			return Fe.has(n) || Fe.set(n, new se({
				...u,
				adapter: e.adapter,
				mode: "select",
				browseRoot: t.browseRoot || null,
				flatScope: null
			})), (await Fe.get(n).collection([e.id])).resources[0];
		}
		let H = ne({
			profile: I?.selectionProfile || {},
			initialUsage: I?.initialUsage || {},
			editors: I?.editors || {},
			resolveReference: Ie
		}), U = () => j.selectedIds.flatMap((e) => {
			let t = N.value.find((t) => k(t) === e);
			if (t) return [{
				selection: be(t, u.adapter.replace(/^flat-/, "")),
				usage: H.get(t)
			}];
			let n = I?.getCollectionSnapshot?.().items.find((t) => xe(t.selection) === e);
			return n ? [n] : [];
		}), W = () => {
			L && I.commitCollection?.({
				items: U(),
				resources: Object.fromEntries(N.value.map((e) => [k(e), e])),
				virtualResources: j.virtualResources
			});
		}, Le = u.selectionState && (I || u.selectionHost) ? {
			editorContext: I?.selectionEditorContext || {},
			canAdd: (e, t) => c.canAddSelection(e, t),
			canCreate: (e) => c.canCreateSelectionResource(e),
			remove: (e) => {
				c.deleteVirtualResources(e), e.forEach((e) => H.forget(e)), G.value++, W(), u.selectionHost?.onChange?.({ items: U() });
			},
			replace: (e, t) => {
				let n = t ? { ...H.get(t) } : {}, r = c.replaceSelectionResource(e, t);
				for (let e of H.definitions(r)) Object.prototype.hasOwnProperty.call(n, e.key) && H.set(r, e.key, n[e.key]);
				return G.value++, W(), u.selectionHost?.onChange?.({ items: U() }), t && k(t) !== k(r) && H.forget(t), r;
			}
		} : null;
		D.selectionHost = Le, te(() => [j.selectedIds, j.selectedResources], W, {
			deep: !0,
			flush: "sync"
		}), e(W);
		let G = f(0);
		L && (V = _e({
			config: Pe,
			api: O,
			translate: R,
			notify: (e) => {
				Ne = !0;
				for (let t of e.items) {
					let n = e.resources.find((e) => k(e) === xe(t.selection));
					if (n) for (let [e, r] of Object.entries(t.usage)) H.set(n, e, r);
				}
				j.selectedResources = Object.fromEntries(e.resources.map((e) => [k(e), de(e)])), j.selectedIds = e.items.map((e) => xe(e.selection)), G.value++, Ne = !1, W();
			}
		}), V.refresh().catch((e) => Joomla.renderMessages({ error: [e.message] })), te(() => [j.selectedIds, G.value], () => {
			Ne || V.setItems(U()).catch((e) => Joomla.renderMessages({ error: [e.message] }));
		}, {
			deep: !0,
			flush: "sync"
		}), e(() => V.destroy()));
		let K = f(I?.isMaximized?.() || !1), ze = x(() => {
			if (I?.title) return I.title;
			let e = u.adapters?.find((e) => e.id === u.adapter.replace(/^flat-/, ""));
			return `${R("COM_SMARTBROWSER_SELECT_RESOURCE")} \u2014 ${R(e?.title || "COM_SMARTBROWSER_RESOURCE")}`;
		}), Be = f(0), Ve = f({}), He = f(!1), Ue = x(() => H.definitions(P.value).filter((e) => e.presentation !== "hidden")), We = x(() => (G.value, H.get(P.value))), Ge = x(() => !!(I && Object.keys(I.selectionProfile || {}).length)), Ke = !!(I && Object.keys(I.selectionProfile || {}).length), qe = f(I?.initialInfoOpen === !0 || Object.values(I?.selectionProfile || {}).some((e) => e !== !1 && e?.presentation !== "hidden") || j.showInfo), Je = x(() => Ke || I?.initialInfoOpen === !0 ? qe.value : j.showInfo), Ye = () => {
			Ke || I?.initialInfoOpen === !0 ? qe.value = !qe.value : j.showInfo = !j.showInfo;
		}, Xe = (e, t, n) => {
			e && !q && (H.set(e, t, n), Ve.value = {
				...Ve.value,
				[k(e)]: {}
			}, G.value++, W());
		}, Ze = (e, t) => Xe(P.value, e, t), Qe = x(() => {
			let e = P.value;
			return ce({
				resource: e,
				overlayRegistry: I || window.SmartBrowserPicker,
				isReadOnly: !I || u.mode === "readonly",
				fieldElement: null,
				isCurrent: () => !q && k(P.value) === k(e),
				getAddress: () => H.get(e)["ext.address"] ?? re(e),
				getDefaultAddress: () => re(e),
				resetAddress: () => Xe(e, "ext.address", null),
				setAddress: (t) => Xe(e, "ext.address", t),
				profile: I?.selectionProfile || {},
				values: We.value,
				getValues: () => H.get(e),
				setValue: (t, n) => Xe(e, t, n),
				refresh: () => F(),
				selectResource: (e) => window.SmartBrowserPicker.open(e)
			});
		}), $e = f(I?.previewActions || []), tt = I?.subscribePreviewActions?.((e) => {
			$e.value = e;
		});
		e(() => tt?.());
		let nt = x(() => $e.value.filter((e) => {
			try {
				return P.value && (!Qe.value.isReadOnly || e.allowReadOnly === !0) && (!e.applies || e.applies(Qe.value));
			} catch {
				return !1;
			}
		})), q = !1;
		e(() => {
			q = !0, Fe.forEach((e) => e.destroy());
		});
		let rt = A.all(), it = x(() => A.get(j.activeView)), at = f({}), ot = oe({
			api: O,
			config: {
				...u,
				selectionProfile: I?.selectionProfile || {},
				addressContract: I?.addressContract
			}
		}), st = 0;
		te(() => [M.value, G.value], async () => {
			if (!I) return;
			let e = ++st, t = {};
			for (let e of M.value) try {
				t[k(e)] = await ot.serialize({
					selection: be(e, u.adapter.replace(/^flat-/, "")),
					usage: H.get(e)
				}, e);
			} catch {
				t[k(e)] = "";
			}
			e === st && (at.value = t);
		}, { immediate: !0 }), e(() => {
			st++, ot.destroy();
		});
		let ct = x(() => I ? M.value.map((e) => ({
			...e,
			selectionAddress: at.value[k(e)] || ""
		})) : M.value), ut = x(() => {
			let e = _t(j.presentation, u.adapter);
			return I && !e.some((e) => e.id === "selectionAddress") && e.push({
				id: "selectionAddress",
				source: "selectionAddress",
				label: "COM_SMARTBROWSER_URI",
				headerIcon: "fas fa-link",
				defaultVisible: !1
			}), e;
		}), ht = x(() => ut.value.filter((e) => e.id === "title" || e.id === "name" || (e.defaultVisible ? !j.hiddenColumns.includes(e.id) : j.shownColumns.includes(e.id)))), gt = (e) => {
			let t = ut.value.find((t) => t.id === e);
			if (!t || ["title", "name"].includes(e)) return;
			let n = t.defaultVisible ? "hiddenColumns" : "shownColumns";
			j[n] = j[n].includes(e) ? j[n].filter((t) => t !== e) : [...j[n], e];
		}, J = f(!1), Y = f(!1), kt = f(null), X = x(() => u.adapter === "media"), Z = x(() => u.mode === "manage" && ["details", "grid"].includes(j.activeView) && j.presentation.orderingField && j.sortBy === j.presentation.orderingField && ["asc", "desc"].includes(j.sortDirection) && (u.adapter === "featured-articles" || String(j.filters.featured ?? "") !== "1")), At = x(() => Z.value && !j.busy && N.value.length > 0 && N.value.every((e) => e.capabilities?.reorder === !0)), jt = async (e) => {
			if (!At.value || !["up", "down"].includes(e)) return;
			let t = N.value.map((e) => e.id), n = j.focusedId;
			j.busy = !0;
			try {
				let r = j.sortDirection === "desc" ? e === "up" ? "down" : "up" : e;
				(await O.execute("reorder", t, { direction: r })).updated?.length && (await F(), j.selectedIds = t.filter((e) => M.value.some((t) => t.id === e)), j.focusedId = j.selectedIds.includes(n) ? n : j.selectedIds[0] || null);
			} catch (e) {
				Joomla.renderMessages({ error: [e.message] });
			} finally {
				j.busy = !1;
			}
		}, Q = u.adapter !== "featured-articles" && [
			"articles",
			"categories",
			"tags",
			"articles-by-tag",
			"menus",
			"users",
			"media"
		].includes(u.adapter.replace(/^flat-/, "")), $ = u.adapter.startsWith("flat-") || u.adapter === "featured-articles", Mt = Object.fromEntries(Object.entries(u.gridWidths || {}).map(([e, t]) => [`--sb-grid-${e}`, `${t}px`])), Nt = dt(u.adapter, u.browseRoot, window.location.href), Pt = (() => {
			try {
				return JSON.parse(window.sessionStorage.getItem(Nt) || "{}");
			} catch {
				return {};
			}
		})(), Ft = f(Pt.filtersOpen === !0), It = (e) => {
			Pt = {
				...Pt,
				filtersOpen: Ft.value,
				...e
			}, window.sessionStorage.setItem(Nt, JSON.stringify(Pt));
		}, Lt = () => {
			Ft.value = !Ft.value, It({ filtersOpen: Ft.value });
		}, Rt = () => {
			It({ flat: !$ }), window.location.assign($ ? pt(window.location.href, u.browseRoot) : ft(window.location.href, u.adapter, j.selectedNode, u.browseRoot));
		}, zt = x(() => u.adapters?.find((e) => e.id === u.adapter)?.icon || "fas fa-list"), Bt = x(() => u.adapters?.find((e) => e.id === u.adapter)?.nodeOpenIcon || {
			media: "fas fa-folder-open",
			articles: "fas fa-box-open",
			"flat-articles": "fas fa-box-open",
			categories: "fas fa-box-open",
			tags: "fas fa-tags",
			"articles-by-tag": "fas fa-tags",
			users: "fas fa-users-viewfinder",
			menus: "fas fa-diagram-successor",
			"featured-articles": "fas fa-star"
		}[u.adapter] || "fas fa-folder-open"), Vt = [
			"sm",
			"md",
			"lg",
			"xl"
		], Ht = async ({ selection: e, payload: t, resolve: n, reject: r }) => {
			try {
				let r = await O.execute("batch", e, t);
				if (r.download) {
					let e = atob(r.download.content), t = Uint8Array.from(e, (e) => e.charCodeAt(0)), n = URL.createObjectURL(new Blob([t], { type: "application/zip" })), i = document.createElement("a");
					i.href = n, i.download = r.download.name, i.click(), setTimeout(() => URL.revokeObjectURL(n), 6e4);
				}
				await F(), n(r);
			} catch (e) {
				r(e);
			}
		}, Ut = async (e) => {
			if (He.value || !e.length) return;
			He.value = !0;
			let t = G.value, n;
			try {
				n = await H.validate(e);
			} finally {
				He.value = !1;
			}
			if (q || t !== G.value) return;
			if (Ve.value = n.errors, !n.valid) {
				Object.keys(n.profileErrors).length && Joomla.renderMessages({ error: [R("COM_SMARTBROWSER_USAGE_PROFILE_INVALID")] });
				let e = Object.keys(n.errors).find((e) => Object.keys(n.errors[e]).some((t) => !n.profileErrors[e]?.[t]));
				e && (j.focusedId = e, Be.value++, Je.value || Joomla.renderMessages({ error: [R("COM_SMARTBROWSER_USAGE_INVALID")] }));
				return;
			}
			let r = {
				adapter: u.adapter.replace(/^flat-/, ""),
				mode: u.mode,
				resources: [...e]
			};
			L && (r.collectionItems = e.map((e) => ({
				selection: be(e, u.adapter.replace(/^flat-/, "")),
				usage: n.usage[k(e)] || {}
			}))), I && (r.pickerInstance = u.pickerInstance, r.usage = n.usage), document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r })), window.parent !== window && window.parent.document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r }));
		}, Wt = (e) => {
			let t = Vt.indexOf(j.viewOptions.gridSize);
			j.viewOptions.gridSize = Vt[Math.max(0, Math.min(Vt.length - 1, t + e))];
		}, Gt = (e) => le(e, u.mode, Ae(e), B, u.selectionTarget || "both"), Kt = (e) => pe(e, u.mode, Ae(e), B), qt = (e) => he(e, u.mode, Ae(e), B, u.selectionTarget || "both"), Jt = (e, t) => !j.busy && (e.local ? t.every((t) => Gt(t)?.id === e.id || qt(t)?.id === e.id) : B(e, t)), Yt = (e) => {
			let t = Gt(e);
			t && Xt(t, e);
		}, Xt = (e, t) => {
			if (e && t && Jt(e, [t])) return e.id === "browseOpen" ? F(t.id) : e.id === "pickerSelect" ? L ? (j.selectedIds.includes(k(t)) || Ee(t, !0), Ut(N.value)) : Ut([t]) : Me(e, [t]);
		}, Zt = (e) => {
			if (I?.allowedAdapters?.length && !I.allowedAdapters.includes(e.replace(/^flat-/, "")) || e === u.adapter) return;
			W();
			let t = new URL(window.location.href);
			t.searchParams.set("adapter", e), t.searchParams.delete("node"), t.searchParams.delete("browseRoot"), I?.initialBrowseRoot && e.replace(/^flat-/, "") === I.initialAdapter.replace(/^flat-/, "") && t.searchParams.set("browseRoot", I.initialBrowseRoot), t.searchParams.delete("initialResource"), t.searchParams.delete("flatScope"), window.location.href = t.toString();
		}, Qt = async ({ id: e, value: t }) => {
			if (j.filters[e] = t, e === "menu" && t && !u.browseRoot && u.adapter === "menus") {
				await F(`menu:${t}`);
				return;
			}
			if (e === "menu" && t && !u.browseRoot && u.adapter === "flat-menus") {
				let e = new URL(window.location.href);
				e.searchParams.set("flatScope", `menu:${t}`), e.searchParams.set("flatFromNode", `menu:${t}`), window.location.assign(e.toString());
				return;
			}
			await F(j.selectedNode);
		}, $t = async () => {
			(j.presentation.filters || []).forEach((e) => {
				j.filters[e.id] = e.default ?? "";
			}), await F(j.selectedNode);
		}, en = async (e) => {
			if ($ && e === j.selectedNode && e === j.roots[0]?.id) {
				j.search = "", j.sortBy = u.defaultSortBy || "", j.sortDirection = u.defaultSortDirection || "";
				let e = mt(window.location.href, u.flatRootNode);
				if (e !== window.location.href) {
					(j.presentation.filters || []).forEach((e) => {
						j.filters[e.id] = e.default ?? "";
					}), await ee(), window.location.assign(e);
					return;
				}
				await $t();
				return;
			}
			await F(e);
		}, tn = (e) => {
			j.sortBy === e ? j.sortDirection === "asc" ? j.sortDirection = "desc" : (j.sortBy = "", j.sortDirection = "") : (j.sortBy = e, j.sortDirection = "asc");
		}, nn = (e) => {
			j.sortBy = e, j.sortDirection = e ? j.sortDirection || "asc" : "";
		}, rn = () => {
			let e = [
				"modified",
				"created",
				"both"
			], t = e.indexOf(j.viewOptions.detailsDateMode);
			j.viewOptions.detailsDateMode = e[(t + 1) % e.length];
		}, an = async (e) => {
			J.value = !1, X.value && await D.uploadFiles(e.dataTransfer?.files);
		};
		return _(() => {
			if ($ && It({ flat: !0 }), !$ && Q && Pt.flat === !0) {
				window.location.replace(ft(window.location.href, u.adapter, j.selectedNode, u.browseRoot));
				return;
			}
			F(j.selectedNode).then(async () => {
				if (L) {
					let e = I.getCollectionSnapshot();
					try {
						let t = await O.collection(e.items, {
							referenceItems: !0,
							homogeneous: I.homogeneous
						});
						if (q) return;
						if (j.selectedResources = Object.fromEntries(t.resources.map((e) => [k(e), de(e)])), j.selectedIds = t.items.map((e) => xe(e.selection)), j.focusedId = j.selectedIds.find((e) => M.value.some((t) => k(t) === e)) || j.selectedIds[0] || null, I.initialFocus) {
							let e = xe(I.initialFocus);
							j.selectedIds.includes(e) && (j.focusedId = e);
						}
					} catch (e) {
						q || Joomla.renderMessages({ error: [e.message] });
					}
				}
				if (!L && I?.initialSelection?.length && (!I.initialAdapter || I.initialAdapter.replace(/^flat-/, "") === u.adapter.replace(/^flat-/, ""))) {
					let e = I.initialSelection.map((e) => e && typeof e == "object" ? e.id : e);
					try {
						let t = await O.collection(u.multiple ? e : e.slice(0, 1));
						if (q) return;
						let n = new Set(u.allowedResourceTypes || []), r = t.resources.filter((e) => !e.unavailable && ue(e, u.selectionTarget) && (!n.size || n.has(e.type)));
						j.selectedIds = r.map((e) => e.id), j.selectedResources = Object.fromEntries(r.map((e) => [e.id, e])), j.focusedId = j.selectedIds[0] || null;
					} catch (e) {
						q || Joomla.renderMessages({ error: [e.message] });
					}
				}
				u.adapter === "media" && u.initialResource && M.value.some((e) => e.id === u.initialResource) && (j.focusedId = k(M.value.find((e) => e.id === u.initialResource)));
			});
		}), (e, r) => (l(), d("div", {
			ref_key: "shellElement",
			ref: b,
			class: "smartbrowser-shell",
			style: o({
				...s(Mt),
				"--sb-browser-available-height": ae.value
			})
		}, [
			s(I) ? (l(), d("div", vt, [w("strong", null, p(ze.value), 1), s(I).subtitle ? (l(), d("span", {
				key: 0,
				title: s(I).subtitle
			}, p(s(I).subtitle), 9, yt)) : C("", !0)])) : C("", !0),
			s(j).busy ? (l(), d("div", bt, [r[15] ||= w("span", {
				class: "spinner-border",
				"aria-hidden": "true"
			}, null, -1), w("span", null, p(R("COM_SMARTBROWSER_WORKING")), 1)])) : C("", !0),
			S(Re, {
				actions: s(j).actions,
				available: (e) => B(e, s(N)),
				selection: s(N),
				"batch-available": s(u).mode === "manage",
				"can-cancel": typeof s(I)?.cancel == "function",
				"flat-available": s(Q),
				"flat-active": s($),
				"filters-open": Ft.value,
				filters: s(j).presentation.filters,
				"filter-values": s(j).filters,
				"manager-url": s(u).managerUrl,
				"manager-new-tab": s(u).application === "site",
				"dashboard-url": s(u).dashboardUrl,
				integrated: s(u).integrated,
				"selection-mode": s(u).mode === "select",
				"allow-no-user": s(u).allowNoUser,
				"can-complete": s(N).length > 0 && !He.value,
				"confirm-label": s(I)?.confirmLabel,
				t: R,
				onAction: r[1] ||= (e) => Me(e, s(N)),
				onBatch: r[2] ||= (e) => kt.value?.open(),
				onCancel: r[3] ||= (e) => s(I)?.cancel(),
				onToggleFlat: Rt,
				onToggleFilters: Lt,
				onFilter: Qt,
				onClearFilters: $t,
				onComplete: r[4] ||= (e) => Ut(s(N)),
				onNoUser: r[5] ||= (e) => Ut([{
					id: "user:0",
					type: "user",
					title: ""
				}])
			}, {
				"display-controls": t(() => [s(I)?.toggleSize ? (l(), d("button", {
					key: 0,
					type: "button",
					class: v(["resource-icon-button resource-display-toggle", { active: K.value }]),
					"aria-pressed": K.value,
					title: R(K.value ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE"),
					"aria-label": R(K.value ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE"),
					onClick: r[0] ||= (e) => K.value = s(I).toggleSize()
				}, [w("span", {
					class: v(K.value ? "fas fa-compress" : "fas fa-expand"),
					"aria-hidden": "true"
				}, null, 2)], 10, xt)) : C("", !0), s(m) ? (l(), d("button", {
					key: 1,
					type: "button",
					class: v(["resource-icon-button resource-display-toggle", { active: y.value !== "normal" }]),
					"aria-pressed": y.value !== "normal",
					title: R(ge.value),
					"aria-label": R(ge.value),
					onClick: ve
				}, [w("span", {
					class: v(y.value === "normal" ? "fas fa-arrows-alt-h" : y.value === "wide" ? "fas fa-expand" : "fas fa-compress"),
					"aria-hidden": "true"
				}, null, 2)], 10, St)) : C("", !0)]),
				_: 1
			}, 8, [
				"actions",
				"available",
				"selection",
				"batch-available",
				"can-cancel",
				"flat-available",
				"flat-active",
				"filters-open",
				"filters",
				"filter-values",
				"manager-url",
				"manager-new-tab",
				"dashboard-url",
				"integrated",
				"selection-mode",
				"allow-no-user",
				"can-complete",
				"confirm-label"
			]),
			s(L) ? (l(), d("details", Ct, [w("summary", null, [
				r[16] ||= w("span", {
					class: "fas fa-chevron-right resource-picker-collection-chevron",
					"aria-hidden": "true"
				}, null, -1),
				n(p(R("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": ", 1),
				w("span", null, p(s(j).selectedIds.length), 1)
			]), s(V) ? (l(), h(fe, {
				key: 0,
				model: s(V),
				api: s(O),
				config: Pe,
				t: R
			}, null, 8, ["model", "api"])) : C("", !0)])) : C("", !0),
			S(ie, {
				ref_key: "batchDialog",
				ref: kt,
				selection: s(N),
				adapter: s(u).adapter,
				filters: s(j).presentation.filters,
				"batch-options": s(j).presentation.batchOptions,
				"sort-fields": s(j).presentation.sortFields,
				"ordering-available": Z.value,
				t: R,
				onApply: Ht
			}, null, 8, [
				"selection",
				"adapter",
				"filters",
				"batch-options",
				"sort-fields",
				"ordering-available"
			]),
			w("div", { class: v(["smartbrowser-layout", {
				"flat-mode": s($) && !s(L),
				"tree-collapsed": Y.value
			}]) }, [
				(!s($) || s(L)) && !Y.value ? (l(), h(lt, {
					key: 0,
					adapters: s(I)?.allowedAdapters?.length ? (s(u).adapters || []).filter((e) => s(I).allowedAdapters.includes(e.id.replace(/^flat-/, ""))) : s(u).adapters,
					"active-adapter": s(u).adapter,
					roots: s(j).roots,
					nodes: s($) ? [] : s(j).nodes,
					breadcrumb: s(j).breadcrumb,
					"selected-node": s(j).selectedNode,
					t: R,
					onOpen: s(F),
					onAdapter: Zt
				}, null, 8, [
					"adapters",
					"active-adapter",
					"roots",
					"nodes",
					"breadcrumb",
					"selected-node",
					"onOpen"
				])) : C("", !0),
				!s($) || s(L) ? (l(), d("button", {
					key: 1,
					type: "button",
					class: "resource-sidebar-handle",
					title: R(Y.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-label": R(Y.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-expanded": !Y.value,
					onClick: r[6] ||= (e) => Y.value = !Y.value
				}, [w("span", {
					class: v(Y.value ? "fas fa-chevron-right" : "fas fa-chevron-left"),
					"aria-hidden": "true"
				}, null, 2)], 8, wt)) : C("", !0),
				w("main", Tt, [S(et, {
					breadcrumb: s(j).breadcrumb,
					root: s(j).roots[0],
					"root-icon": Bt.value,
					"icon-only-root": !s($) && s(j).breadcrumb.length > 1,
					search: s(j).search,
					"sort-by": s(j).sortBy,
					"sort-direction": s(j).sortDirection,
					"sort-fields": s(j).presentation.sortFields,
					"ordering-field": s(j).presentation.orderingField,
					views: s(rt),
					"active-view": s(j).activeView,
					"grid-size": s(j).viewOptions.gridSize,
					"details-thumbnails": s(j).viewOptions.detailsThumbnails,
					"details-date-mode": s(j).viewOptions.detailsDateMode,
					columns: ut.value,
					"hidden-columns": s(j).hiddenColumns,
					"shown-columns": s(j).shownColumns,
					"show-info": Je.value,
					multiple: s(u).multiple,
					"can-invert": s(u).multiple && s(we).length > 0,
					"reorder-visible": Z.value,
					"reorder-enabled": At.value,
					t: R,
					onOpen: en,
					onInvertSelection: s(Oe),
					onReorder: jt,
					onSearch: r[7] ||= (e) => s(j).search = e,
					onSortBy: nn,
					onSortDirectionValue: r[8] ||= (e) => s(j).sortDirection = e,
					onResize: Wt,
					onToggleThumbnails: r[9] ||= (e) => s(j).viewOptions.detailsThumbnails = !s(j).viewOptions.detailsThumbnails,
					onToggleDateField: rn,
					onToggleColumn: gt,
					onView: r[10] ||= (e) => s(j).activeView = e,
					onInfo: Ye
				}, null, 8, [
					"breadcrumb",
					"root",
					"root-icon",
					"icon-only-root",
					"search",
					"sort-by",
					"sort-direction",
					"sort-fields",
					"ordering-field",
					"views",
					"active-view",
					"grid-size",
					"details-thumbnails",
					"details-date-mode",
					"columns",
					"hidden-columns",
					"shown-columns",
					"show-info",
					"multiple",
					"can-invert",
					"reorder-visible",
					"reorder-enabled",
					"onInvertSelection"
				]), w("div", {
					class: v(["resource-browser", {
						loading: s(j).loading,
						"is-dragging": J.value,
						"info-open": Je.value,
						"usage-open": Ge.value
					}]),
					onDragenter: r[12] ||= g((e) => J.value = X.value, ["prevent"]),
					onDragover: r[13] ||= g(() => {}, ["prevent"]),
					onDragleave: r[14] ||= g((e) => J.value = !1, ["self"]),
					onDrop: g(an, ["prevent"])
				}, [
					s(j).loading ? (l(), d("div", Et, [...r[17] ||= [w("span", {
						class: "spinner-border",
						"aria-hidden": "true"
					}, null, -1)]])) : s(M).length ? (l(), h(a(it.value.component), {
						key: 2,
						resources: ct.value,
						"selected-ids": s(j).selectedIds,
						"focused-id": s(j).focusedId,
						"all-selected": s(we).length > 0 && s(we).every((e) => s(j).selectedIds.includes(s(k)(e))),
						options: s(j).viewOptions,
						"selection-controls": !s(I) || s(u).multiple !== !1,
						actions: s(j).actions,
						"action-available": Jt,
						"default-action": Gt,
						"preview-action": Kt,
						"modified-action": qt,
						"sort-by": s(j).sortBy,
						"sort-direction": s(j).sortDirection,
						"sort-fields": s(j).presentation.sortFields,
						"ordering-field": s(j).presentation.orderingField,
						columns: ht.value,
						"grid-fields": s(j).presentation.gridFields,
						t: R,
						onSelect: s(Ee),
						onFocus: s(Te),
						onSelectAll: s(De),
						onOpen: s(F),
						onActivate: Yt,
						onAction: Xt,
						onSort: tn
					}, null, 40, [
						"resources",
						"selected-ids",
						"focused-id",
						"all-selected",
						"options",
						"selection-controls",
						"actions",
						"sort-by",
						"sort-direction",
						"sort-fields",
						"ordering-field",
						"columns",
						"grid-fields",
						"onSelect",
						"onFocus",
						"onSelectAll",
						"onOpen"
					])) : (l(), d("div", Dt, [w("span", {
						class: v(s(j).search ? "fas fa-search" : X.value ? "fas fa-cloud-upload-alt" : zt.value),
						"aria-hidden": "true"
					}, null, 2), w("p", null, p(s(j).search ? R("COM_SMARTBROWSER_NO_RESULTS") : X.value ? R("COM_SMARTBROWSER_DROP_UPLOAD") : R("COM_SMARTBROWSER_EMPTY_STATE")), 1)])),
					X.value && J.value ? (l(), d("div", Ot, [r[18] ||= w("span", { class: "fas fa-cloud-upload-alt" }, null, -1), n(p(R("COM_SMARTBROWSER_DROP_UPLOAD")), 1)])) : C("", !0),
					Je.value ? (l(), h(ye, {
						key: 4,
						resource: s(P),
						fields: s(P)?.collectionPresentation?.infoFields || s(j).presentation.infoFields,
						t: R,
						"usage-definitions": Ue.value,
						"usage-values": We.value,
						"usage-errors": Ve.value[s(k)(s(P))] || {},
						"usage-editors": s(I)?.editors,
						"resolve-reference": Ie,
						"usage-revision": Be.value,
						"preview-actions": nt.value,
						"preview-context": Qe.value,
						"can-preview": !!Kt(s(P)) && ke(s(P)).canPreview(s(P)) && !s(j).busy,
						onPreview: r[11] ||= (e) => Xt(Kt(s(P)), s(P)),
						onUsageChange: Ze
					}, null, 8, [
						"resource",
						"fields",
						"usage-definitions",
						"usage-values",
						"usage-errors",
						"usage-editors",
						"usage-revision",
						"preview-actions",
						"preview-context",
						"can-preview"
					])) : C("", !0)
				], 34)])
			], 2)
		], 4));
	}
}, Y = class {
	constructor(e = window.sessionStorage, t = "supjx.smartbrowser.media") {
		this.storage = e, this.key = t;
	}
	load(e) {
		try {
			return {
				...e,
				...JSON.parse(this.storage.getItem(this.key) || "{}")
			};
		} catch {
			return { ...e };
		}
	}
	save(e) {
		let t = {
			selectedNode: e.selectedNode,
			activeView: e.activeView,
			viewOptions: e.viewOptions,
			hiddenColumns: e.hiddenColumns,
			shownColumns: e.shownColumns,
			sortBy: e.sortBy,
			sortDirection: e.sortDirection,
			showInfo: e.showInfo,
			filters: e.filters
		};
		this.storage.setItem(this.key, JSON.stringify(t));
	}
}, kt = "supjx.smartbrowser.preferencesResetToken";
function X(e, t) {
	if (!t || e.getItem(kt) === t) return !1;
	let n = [];
	for (let t = 0; t < e.length; t++) {
		let r = e.key(t);
		r?.startsWith("supjx.smartbrowser.") && r !== kt && r !== "supjx.smartbrowser.editorReturn" && n.push(r);
	}
	return n.forEach((t) => e.removeItem(t)), e.setItem(kt, t), !0;
}
//#endregion
//#region resources/js/core/resetSessionNavigation.js
var Z = "supjx.smartbrowser.";
function At(e, t, n) {
	if (!n) return !1;
	let r = `${Z}session.${t}`, i = e.getItem(r);
	if (e.setItem(r, n), !i || i === n) return !1;
	for (let t = 0; t < e.length; t++) {
		let n = e.key(t);
		if (!(!n?.startsWith(Z) || n.startsWith(`${Z}ui.`) || n.startsWith(`${Z}session.`))) try {
			let t = JSON.parse(e.getItem(n));
			if (!t || typeof t != "object" || Array.isArray(t) || !("selectedNode" in t) && !("filters" in t)) continue;
			delete t.selectedNode, delete t.filters, e.setItem(n, JSON.stringify(t));
		} catch {}
	}
	return !0;
}
function jt(e) {
	let t = new URL(e);
	if (t.searchParams.delete("node"), t.searchParams.has("flatFromAdapter")) {
		let e = t.searchParams.get("flatFromBrowseRoot");
		e ? t.searchParams.set("browseRoot", e) : t.searchParams.delete("browseRoot"), t.searchParams.delete("flatScope"), t.searchParams.delete("flatFromNode"), t.searchParams.delete("flatFromBrowseRoot"), t.searchParams.delete("flatFromAdapter");
	}
	return t.toString();
}
//#endregion
//#region resources/js/main.js
var Q = Joomla.getOptions("com_smartbrowser", {}), $ = null;
try {
	$ = window.parent !== window && Q.pickerInstance ? window.parent.SmartBrowserPicker?.context(Q.pickerInstance, window) : null;
} catch {}
Q.pickerContext = $, X(window.sessionStorage, Q.preferencesResetToken);
var Mt = At(window.sessionStorage, Q.application, Q.csrfToken) ? jt(window.location.href) : window.location.href;
if (Mt !== window.location.href) window.location.replace(Mt);
else {
	let e = new se(Q), t = Q.browseRoot ? `supjx.smartbrowser.${Q.adapter}.${Q.browseRoot}` : `supjx.smartbrowser.${Q.adapter}`, n = new Y(window.sessionStorage, t), r = me().register({
		id: "grid",
		label: "COM_SMARTBROWSER_GRID",
		icon: "fas fa-th",
		component: ve,
		supportsSize: !0,
		controls: ["sort", "zoom"],
		options: { gridSize: "md" }
	}).register({
		id: "details",
		label: "COM_SMARTBROWSER_DETAILS",
		icon: "fas fa-list",
		component: E,
		supportsSize: !1,
		controls: ["thumbnails", "dateField"],
		options: {
			detailsThumbnails: !1,
			detailsDateMode: "modified"
		}
	}), i = ge({
		options: Q,
		api: e,
		persistence: n,
		viewRegistry: r
	}), a = new Se(e, i.state, () => i.load(), (e) => Joomla.Text?._(e, e) || e, Q.editorMode, Q.application);
	window.SmartBrowser = {
		...window.SmartBrowser,
		open(e = {}) {
			let t = e.showContextResources ?? Q.showContextResources ?? !1, n = e.browseRoot ? `&browseRoot=${encodeURIComponent(e.browseRoot)}` : "", r = e.defaultView ? `&defaultView=${encodeURIComponent(e.defaultView)}` : "", i = e.allowedResourceTypes?.length ? `&allowedResourceTypes=${encodeURIComponent(e.allowedResourceTypes.join(","))}` : "", a = e.showAdapterSwitcher ? "&showAdapterSwitcher=1" : "";
			window.location.href = `${Q.returnUrl}&adapter=${encodeURIComponent(e.adapter || Q.adapter)}&mode=${encodeURIComponent(e.mode || "select")}&multiple=${+!!e.multiple}&selectionTarget=${encodeURIComponent(e.selectionTarget || "item")}&showContextResources=${+!!t}${n}${r}${i}${a}`;
		},
		registerView: (e) => r.register(e)
	}, b(J).provide("browser", i).provide("resourceApi", e).provide("smartBrowserOptions", Q).provide("viewRegistry", r).provide("actionDriver", a).mount("#smartbrowser-app");
}
//#endregion
