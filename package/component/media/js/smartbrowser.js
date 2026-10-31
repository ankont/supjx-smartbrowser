import { A as e, B as t, C as n, D as r, F as i, G as a, I as o, J as s, L as c, M as l, N as u, P as d, S as f, T as p, V as m, X as h, Y as g, _, b as v, g as y, j as b, q as x, t as S, u as C, v as ee, w, x as T, y as E } from "./visual-runtime-BEbhjzcM.js?v=5.0.0";
import { a as D, i as O, o as k, s as A } from "./visual-runtime-DQsy__lt.js?v=5.0.0";
import { C as te, S as ne, T as re, _ as ie, a as ae, b as oe, c as j, d as se, f as ce, g as le, h as ue, i as de, l as fe, m as pe, n as me, p as he, r as ge, t as _e, u as ve, v as ye, x as be, y as xe } from "./visual-runtime-CVgqf5Z1.js?v=5.0.0";
import { t as Se } from "./visual-runtime-BqvJBmz9.js?v=5.0.0";
//#region resources/js/core/displayMode.js
var M = [
	"normal",
	"wide",
	"focus"
], Ce = "smartbrowser.displayMode";
function N(e) {
	let t = e.ownerDocument.defaultView;
	if (!t.getComputedStyle) return null;
	let n = "", r = null;
	for (let i = e.parentElement; i; i = i.parentElement) {
		let e = t.getComputedStyle(i);
		!n && e.backgroundColor !== "transparent" && !e.backgroundColor.startsWith("rgba(") && (n = e.backgroundColor), !r && e.backgroundImage !== "none" && (r = e);
	}
	return {
		color: n || "Canvas",
		image: r?.backgroundImage || "none",
		size: r?.backgroundSize || "auto",
		repeat: r?.backgroundRepeat || "repeat",
		position: r?.backgroundPosition || "0% 0%",
		attachment: r?.backgroundAttachment || "scroll"
	};
}
function we(e, t = () => {}) {
	let n = "normal", r = [], i = null, a = e.ownerDocument, o;
	try {
		o = A(a.defaultView);
	} catch {}
	let s = (e, t, n) => {
		let i = e.getAttribute(t);
		e.setAttribute(t, n), r.push(() => i === null ? e.removeAttribute(t) : e.setAttribute(t, i));
	}, c = () => {
		i &&= (i.replaceWith(e), null), r.reverse().forEach((e) => e()), r = [];
	}, l = (l, u = !0) => {
		if (!M.includes(l)) return;
		let d = n;
		if (c(), n = l, t(n), u) try {
			o?.setItem(Ce, n);
		} catch {}
		let f = new CustomEvent("smartbrowser:display-mode", {
			bubbles: !0,
			cancelable: !0,
			detail: {
				mode: n,
				previous: d,
				container: e
			}
		});
		if (!e.dispatchEvent(f)) return n;
		if (n === "wide") for (let t = e.parentElement; t && t !== a.body && t !== a.documentElement; t = t.parentElement) s(t, "data-sb-wide-container", "");
		if (n === "focus") {
			let t = N(e);
			if (t) {
				let n = e.getAttribute("style");
				for (let [n, r] of Object.entries(t)) e.style.setProperty(`--sb-focus-background-${n}`, r);
				r.push(() => n === null ? e.removeAttribute("style") : e.setAttribute("style", n));
			}
			i = a.createComment("SmartBrowser display position"), e.replaceWith(i), a.body.appendChild(e), s(e, "data-sb-focus", ""), s(a.body, "data-sb-focus-page", "");
			for (let t of a.body.children) t !== e && t.tagName !== "DIALOG" && s(t, "inert", "");
		}
		return n;
	}, u = (t) => {
		t.key === "Escape" && !t.defaultPrevented && n !== "normal" && !a.querySelector("dialog[open]") && (l("normal"), e.querySelector(".resource-display-toggle")?.focus());
	};
	a.addEventListener("keydown", u);
	try {
		let e = o?.getItem(Ce);
		M.includes(e) && e !== "normal" && l(e, !1);
	} catch {}
	return {
		get mode() {
			return n;
		},
		set: l,
		cycle: () => l(M[(M.indexOf(n) + 1) % 3]),
		destroy() {
			l("normal", !1), a.removeEventListener("keydown", u);
		}
	};
}
//#endregion
//#region resources/js/core/browserLayout.js
function Te(e, t, n) {
	let r = e.ownerDocument, i = r.defaultView, a = 0, o = !1, s = null, c = n ? r.querySelector(n)?.closest(".subhead") : null, l = c && parseFloat(i.getComputedStyle(c).top) || 0, u = c ? ["--sb-native-top", "--sb-native-heading-offset"].map((e) => [
		e,
		c.style.getPropertyValue(e),
		c.style.getPropertyPriority(e)
	]) : [], d = () => [...r.querySelectorAll("header, [role=\"banner\"], [id], [class*=\"sticky\"], [class*=\"fixed\"]")].filter((t) => !t.contains(e) && !e.contains(t)), f = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Map(), m = (e) => {
		for (let [t, n, r, i] of p.get(e) || []) e.style.getPropertyValue(t) === i && (n ? e.style.setProperty(t, n, r) : e.style.removeProperty(t));
		p.delete(e);
	}, h = (t) => {
		let n = /* @__PURE__ */ new Set();
		if (!t && !c && i.CSS?.supports("overflow", "clip")) for (let t = e.parentElement; t && t !== r.body; t = t.parentElement) {
			let e = i.getComputedStyle(t);
			if (t.scrollTop || ["auto", "scroll"].includes(e.overflowY) && t.scrollHeight > t.clientHeight + 1) continue;
			if (p.has(t)) {
				n.add(t);
				continue;
			}
			if (![e.overflowX, e.overflowY].includes("hidden")) continue;
			let r = [];
			for (let [n, i] of [["overflow-x", e.overflowX], ["overflow-y", e.overflowY]]) {
				let e = i === "hidden" ? "clip" : i === "auto" ? "visible" : null;
				e && r.push([
					n,
					t.style.getPropertyValue(n),
					t.style.getPropertyPriority(n),
					e
				]);
			}
			p.set(t, r), n.add(t);
			for (let [e, , , n] of r) t.style.setProperty(e, n, "important");
		}
		for (let e of p.keys()) n.has(e) || m(e);
	}, g = (t, n) => {
		let r = `${Math.round(n)}px`;
		e.style.getPropertyValue(t) !== r && e.style.setProperty(t, r);
	}, _ = () => {
		let a = t(), o = e.classList.contains("is-picker") || e.parentElement.hasAttribute("data-sb-focus");
		if (e.classList.contains("is-site") && s !== e.parentElement.parentElement) {
			s = e.parentElement.parentElement;
			let t = N(e);
			if (t) for (let [n, r] of Object.entries(t)) e.style.setProperty(`--sb-page-background-${n}`, r);
		}
		h(o);
		let u = 0;
		if (!o && !c) for (let e of d()) {
			if (!["fixed", "sticky"].includes(i.getComputedStyle(e).position)) continue;
			f.has(e) || (f.add(e), y.observe(e));
			let t = e.getBoundingClientRect();
			!e.inert && t.width > i.innerWidth / 2 && t.top <= u + 1 && t.bottom > u && t.height < i.innerHeight / 2 && (u = t.bottom);
		}
		let p = o ? 0 : c ? Math.max(0, r.querySelector(n).getBoundingClientRect().top - c.getBoundingClientRect().top) : e.classList.contains("is-site") && a?.querySelector(".sb-browser-heading")?.getBoundingClientRect().height || 0;
		g("--sb-heading-height", p), c && (c.style.setProperty("--sb-native-top", `${l}px`), c.style.setProperty("--sb-native-heading-offset", `${p}px`));
		let m = o ? 0 : c ? (parseFloat(i.getComputedStyle(c).top) || 0) + c.getBoundingClientRect().height : u + (a?.getBoundingClientRect().height || 0) - p;
		g("--sb-page-inset", u), g("--sb-content-top", m), g("--sb-results-top", m + (e.querySelector(".resource-main > .resource-toolbar")?.getBoundingClientRect().height || 0));
		let _ = m + (e.querySelector(".resource-main > .resource-toolbar")?.getBoundingClientRect().height || 0);
		g("--sb-tree-height", Math.max(0, i.innerHeight - m)), g("--sb-info-height", o && e.querySelector(".resource-main > .resource-browser")?.clientHeight || Math.max(0, i.innerHeight - _));
		let v = e.querySelector(".sb-tree-handle-rail")?.getBoundingClientRect(), b = Math.max(m, v?.top ?? m), x = Math.min(i.innerHeight, v?.bottom ?? i.innerHeight);
		g("--sb-tree-handle-top", b + Math.max(0, (x - b - 54) / 2));
	}, v = () => {
		o || (i.cancelAnimationFrame(a), a = i.requestAnimationFrame(_));
	}, y = new i.ResizeObserver(v);
	return [
		t(),
		c,
		e.querySelector(".resource-main > .resource-toolbar"),
		e.querySelector(".resource-main > .resource-browser"),
		e.querySelector(".smartbrowser-layout")
	].filter(Boolean).forEach((e) => y.observe(e)), i.addEventListener("resize", v), i.addEventListener("scroll", v, { passive: !0 }), r.addEventListener("smartbrowser:display-mode", v), r.fonts?.ready.then(v), _(), () => {
		o = !0;
		for (let [e, t, n] of u) t ? c.style.setProperty(e, t, n) : c.style.removeProperty(e);
		for (let e of p.keys()) m(e);
		y.disconnect(), i.cancelAnimationFrame(a), i.removeEventListener("resize", v), i.removeEventListener("scroll", v), r.removeEventListener("smartbrowser:display-mode", v);
	};
}
//#endregion
//#region resources/js/components/ResourceActions.vue
var P = { class: "sb-browser-heading" }, Ee = { class: "sb-browser-heading-leading" }, F = [
	"disabled",
	"title",
	"aria-label"
], I = [
	"href",
	"title",
	"aria-label"
], L = { class: "sb-browser-heading-copy" }, De = {
	key: 1,
	class: "sb-browser-description"
}, Oe = { class: "sb-heading-controls" }, ke = ["title", "aria-label"], Ae = [
	"href",
	"target",
	"rel",
	"title",
	"aria-label"
], R = ["title", "aria-label"], z = { class: "resource-action-label" }, je = [
	"title",
	"aria-label",
	"disabled",
	"onClick"
], B = {
	key: 0,
	class: "resource-action-label"
}, Me = [
	"aria-expanded",
	"title",
	"aria-label"
], Ne = { class: "resource-action-label" }, Pe = {
	key: 0,
	class: "resource-action-menu",
	role: "menu"
}, Fe = ["disabled", "onClick"], Ie = [
	"disabled",
	"title",
	"aria-label"
], V = { class: "resource-action-label" }, Le = {
	key: 3,
	class: "resource-filter-buttons"
}, H = [
	"aria-expanded",
	"title",
	"aria-label"
], Re = { class: "resource-action-label" }, ze = {
	key: 0,
	class: "badge bg-primary"
}, Be = ["disabled", "title"], Ve = [
	"title",
	"aria-label",
	"aria-pressed",
	"aria-busy",
	"disabled"
], He = ["aria-label"], U = {
	key: 1,
	class: "fas fa-layer-group",
	"aria-hidden": "true"
}, Ue = { class: "resource-action-label" }, W = {
	key: 0,
	class: "resource-action-filters"
}, We = ["value", "onChange"], G = ["value"], Ge = {
	__name: "ResourceActions",
	props: {
		headingTitle: String,
		headingSubtitle: String,
		headingIcon: String,
		nativeToolbarTarget: String,
		actions: Array,
		available: Function,
		selection: Array,
		batchAvailable: Boolean,
		canCancel: Boolean,
		flatAvailable: Boolean,
		flatActive: Boolean,
		flatBusy: Boolean,
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
	setup(e, { expose: t }) {
		let r = e, p = r.nativeToolbarTarget ? document.querySelector(r.nativeToolbarTarget) : null, g = p?.parentElement.querySelector("#sb-native-intro"), y = p?.parentElement.querySelector("#sb-native-manager"), S = a(null);
		t({ element: S });
		let C = a(!1), D = a(null), O = a(null), k, A = 0, te = 0, ne = () => {
			let e = O.value;
			if (!e) return;
			e.classList.remove("is-compact-1", "is-compact-2", "is-compact-3", "is-compact-4");
			let t = () => {
				let t = getComputedStyle(e), n = parseFloat(t.columnGap) || 0, r = (parseFloat(t.paddingInlineStart) || 0) + (parseFloat(t.paddingInlineEnd) || 0), i = [...e.children].filter((e) => getComputedStyle(e).display !== "none");
				return i.reduce((e, t) => e + t.getBoundingClientRect().width, r + n * Math.max(0, i.length - 1)) <= e.clientWidth + 1;
			};
			for (let n = 1; n <= 4 && !t(); n += 1) e.classList.add(`is-compact-${n}`);
		}, re = () => {
			cancelAnimationFrame(A), A = requestAnimationFrame(() => {
				ne(), ie();
			});
		}, ie = () => {
			let e = p?.parentElement, t = e?.querySelector(".sb-options-icon"), n = t?.querySelector(".sb-options-label");
			if (!n || (t.classList.remove("is-expanded"), e.clientWidth < 640)) return;
			let r = getComputedStyle(e), i = [...e.children].filter((e) => e !== p && e !== g && getComputedStyle(e).display !== "none"), a = i.reduce((e, n) => {
				let r = getComputedStyle(n);
				return e + n.getBoundingClientRect().width + (n === t ? 0 : (parseFloat(r.marginInlineStart) || 0) + (parseFloat(r.marginInlineEnd) || 0));
			}, 240 + (parseFloat(r.columnGap) || 0) * i.length + (parseFloat(r.paddingInlineStart) || 0) + (parseFloat(r.paddingInlineEnd) || 0)), o = document.createElement("canvas").getContext("2d");
			o.font = getComputedStyle(n).font, a + o.measureText(n.textContent).width + 8 + 24 <= e.clientWidth && t.classList.add("is-expanded");
		}, ae = E(() => (r.filters || []).filter((e) => String(r.filterValues[e.id] ?? e.default ?? "") !== String(e.default ?? "")).length), oe = (e, t) => r.t(t.label), j = E(() => {
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
		}), se = {
			item: 0,
			node: 1,
			contextual: 2
		}, ce = E(() => j.value.filter((e) => e.primary || e.creationRole || [
			"upload",
			"createNode",
			"createChild",
			"newArticle"
		].includes(e.id)).sort((e, t) => (se[e.creationRole] ?? 3) - (se[t.creationRole] ?? 3))), le = E(() => j.value.filter((e) => !ce.value.includes(e))), ue = (e) => {
			D.value?.contains(e.target) || (C.value = !1);
		}, de = (e) => {
			e.key === "Escape" && (C.value = !1);
		};
		return l(() => {
			document.addEventListener("click", ue), document.addEventListener("keydown", de), k = new ResizeObserver(([e]) => {
				e.contentRect.width !== te && (te = e.contentRect.width, re());
			}), k.observe(O.value), p && (k.observe(p), k.observe(p.parentElement)), document.fonts?.ready.then(re), re();
		}), u(re), b(() => {
			document.removeEventListener("click", ue), document.removeEventListener("keydown", de), k?.disconnect(), cancelAnimationFrame(A);
		}), (t, r) => (d(), T(ee, {
			to: x(p) || "body",
			disabled: !x(p)
		}, [v("div", {
			ref_key: "headerElement",
			ref: S,
			class: s(["resource-actions-area sb-browser-header", { "is-native-header": !!x(p) }])
		}, [
			v("header", P, [(d(), T(ee, {
				to: x(g) || "body",
				disabled: !x(g)
			}, [v("div", Ee, [
				e.selectionMode ? (d(), n("button", {
					key: 0,
					type: "button",
					class: "btn btn-primary resource-picker-select",
					disabled: !e.canComplete,
					title: e.confirmLabel || e.t("COM_SMARTBROWSER_SELECT"),
					"aria-label": e.confirmLabel || e.t("COM_SMARTBROWSER_SELECT"),
					onClick: r[0] ||= (e) => t.$emit("complete")
				}, [
					r[8] ||= v("span", {
						class: "fas fa-check",
						"aria-hidden": "true"
					}, null, -1),
					r[9] ||= w(),
					v("span", null, h(e.confirmLabel || e.t("COM_SMARTBROWSER_SELECT")), 1)
				], 8, F)) : f("", !0),
				e.dashboardUrl ? (d(), n("a", {
					key: 1,
					class: "btn resource-dashboard-link",
					href: e.dashboardUrl,
					title: e.t(e.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD"),
					"aria-label": e.t(e.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD")
				}, [
					r[10] ||= v("span", {
						class: "fas fa-arrow-left",
						"aria-hidden": "true"
					}, null, -1),
					r[11] ||= w(),
					v("span", null, h(e.t(e.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD")), 1)
				], 8, I)) : f("", !0),
				v("div", L, [x(p) ? f("", !0) : (d(), T(c(e.selectionMode ? "h2" : "h1"), {
					key: 0,
					class: "sb-browser-title"
				}, {
					default: m(() => [v("span", {
						class: s(e.headingIcon),
						"aria-hidden": "true"
					}, null, 2), w(" " + h(e.headingTitle), 1)]),
					_: 1
				})), e.headingSubtitle ? (d(), n("p", De, h(e.headingSubtitle), 1)) : f("", !0)])
			])], 8, ["to", "disabled"])), (d(), T(ee, {
				to: x(y) || "body",
				disabled: !x(y)
			}, [v("div", Oe, [
				e.canCancel ? (d(), n("button", {
					key: 0,
					type: "button",
					class: "btn btn-danger resource-picker-cancel",
					title: e.t("JCANCEL"),
					"aria-label": e.t("JCANCEL"),
					onClick: r[1] ||= (e) => t.$emit("cancel")
				}, [
					r[12] ||= v("span", {
						class: "fas fa-times",
						"aria-hidden": "true"
					}, null, -1),
					r[13] ||= w(),
					v("span", null, h(e.t("JCANCEL")), 1)
				], 8, ke)) : f("", !0),
				e.managerUrl ? (d(), n("a", {
					key: 1,
					class: "btn resource-manager-link",
					href: e.managerUrl,
					target: e.managerNewTab ? "_blank" : void 0,
					rel: e.managerNewTab ? "noopener noreferrer" : void 0,
					title: e.t("COM_SMARTBROWSER_OPEN_JOOMLA_MANAGER"),
					"aria-label": e.t("COM_SMARTBROWSER_OPEN_JOOMLA_MANAGER")
				}, [...r[14] ||= [v("span", {
					class: "fab fa-joomla",
					"aria-hidden": "true"
				}, null, -1)]], 8, Ae)) : f("", !0),
				o(t.$slots, "display-controls")
			])], 8, ["to", "disabled"]))]),
			v("div", {
				ref_key: "actionRow",
				ref: O,
				class: s(["resource-actions", { "has-native-toolbar": !!x(p) }])
			}, [
				e.allowNoUser ? (d(), n("button", {
					key: 0,
					type: "button",
					class: "btn btn-outline-secondary",
					title: e.t("JOPTION_NO_USER"),
					"aria-label": e.t("JOPTION_NO_USER"),
					onClick: r[2] ||= (e) => t.$emit("no-user")
				}, [
					r[15] ||= v("span", {
						class: "fas fa-user",
						"aria-hidden": "true"
					}, null, -1),
					r[16] ||= w(),
					v("span", z, h(e.t("JOPTION_NO_USER")), 1)
				], 8, R)) : f("", !0),
				(d(!0), n(_, null, i(ce.value, (r) => (d(), n("button", {
					key: r.id,
					type: "button",
					class: s(["btn btn-outline-secondary", [`resource-action-${r.id}`, {
						"resource-action-create": r.creationRole ? r.creationRole === "item" : r.primary && [
							"upload",
							"createNode",
							"createChild",
							"newArticle",
							"newUser"
						].includes(r.id),
						"resource-contextual-add": r.creationRole === "contextual",
						"is-destructive": [
							"delete",
							"trash",
							"remove"
						].includes(r.id)
					}]]),
					title: e.t(r.label),
					"aria-label": e.t(r.label),
					disabled: !e.available(r),
					onClick: (e) => t.$emit("action", r)
				}, [v("span", {
					class: s(r.icon),
					"aria-hidden": "true"
				}, null, 2), r.creationRole === "contextual" ? f("", !0) : (d(), n("span", B, h(e.t(r.label)), 1))], 10, je))), 128)),
				le.value.length ? (d(), n("div", {
					key: 1,
					ref_key: "actionMenu",
					ref: D,
					class: "resource-action-menu-wrap"
				}, [v("button", {
					type: "button",
					class: "btn btn-outline-secondary resource-action-menu-toggle",
					"aria-expanded": C.value,
					title: e.t("COM_SMARTBROWSER_ACTIONS"),
					"aria-label": e.t("COM_SMARTBROWSER_ACTIONS"),
					onClick: r[3] ||= (e) => C.value = !C.value
				}, [
					r[17] ||= v("span", {
						class: "fas fa-ellipsis-h",
						"aria-hidden": "true"
					}, null, -1),
					r[18] ||= w(),
					v("span", Ne, h(e.t("COM_SMARTBROWSER_ACTIONS")), 1),
					r[19] ||= w(),
					r[20] ||= v("span", {
						class: "fas fa-angle-down",
						"aria-hidden": "true"
					}, null, -1)
				], 8, Me), C.value ? (d(), n("div", Pe, [(d(!0), n(_, null, i(le.value, (r) => (d(), n("div", {
					key: r.id,
					class: "resource-action-menu-item",
					role: "none"
				}, [v("button", {
					type: "button",
					role: "menuitem",
					class: s([`resource-action-${r.id}`, { "is-destructive": [
						"delete",
						"trash",
						"remove"
					].includes(r.id) }]),
					disabled: !e.available(r),
					onClick: (e) => {
						C.value = !1, t.$emit("action", r);
					}
				}, [v("span", {
					class: s(r.icon),
					"aria-hidden": "true"
				}, null, 2), w(" " + h(e.t(r.label)), 1)], 10, Fe)]))), 128))])) : f("", !0)], 512)) : f("", !0),
				e.batchAvailable ? (d(), n("button", {
					key: 2,
					type: "button",
					class: "btn btn-outline-secondary resource-batch-toggle",
					disabled: !e.selection?.length,
					title: e.t("COM_SMARTBROWSER_BATCH_ACTIONS"),
					"aria-label": e.t("COM_SMARTBROWSER_BATCH_ACTIONS"),
					onClick: r[4] ||= (e) => t.$emit("batch")
				}, [
					r[21] ||= v("span", {
						class: "fas fa-magic",
						"aria-hidden": "true"
					}, null, -1),
					r[22] ||= w(),
					v("span", V, h(e.t("COM_SMARTBROWSER_BATCH")), 1)
				], 8, Ie)) : f("", !0),
				e.filters?.length ? (d(), n("div", Le, [v("button", {
					type: "button",
					class: s(["btn resource-filter-toggle", { active: e.filtersOpen }]),
					"aria-expanded": e.filtersOpen,
					title: e.t("COM_SMARTBROWSER_FILTER_OPTIONS"),
					"aria-label": e.t("COM_SMARTBROWSER_FILTER_OPTIONS"),
					onClick: r[5] ||= (e) => t.$emit("toggle-filters")
				}, [
					r[23] ||= v("span", {
						class: "fas fa-filter",
						"aria-hidden": "true"
					}, null, -1),
					r[24] ||= w(),
					v("span", Re, h(e.t("COM_SMARTBROWSER_FILTER_OPTIONS")), 1),
					ae.value ? (d(), n("span", ze, h(ae.value), 1)) : f("", !0),
					v("span", {
						class: s(["fas fa-angle-down resource-filter-caret", { open: e.filtersOpen }]),
						"aria-hidden": "true"
					}, null, 2)
				], 10, H), v("button", {
					type: "button",
					class: "btn resource-filter-clear",
					disabled: !ae.value,
					title: e.t("JCLEAR"),
					onClick: r[6] ||= (e) => t.$emit("clear-filters")
				}, h(e.t("JCLEAR")), 9, Be)])) : f("", !0),
				e.flatAvailable ? (d(), n("button", {
					key: 4,
					type: "button",
					class: s(["btn resource-flat-toggle", { active: e.flatActive }]),
					title: e.t("COM_SMARTBROWSER_FLAT_VIEW"),
					"aria-label": e.t("COM_SMARTBROWSER_FLAT_VIEW"),
					"aria-pressed": e.flatActive,
					"aria-busy": e.flatBusy,
					disabled: e.flatBusy,
					onClick: r[7] ||= (e) => t.$emit("toggle-flat")
				}, [e.flatBusy ? (d(), n("span", {
					key: 0,
					class: "spinner-border spinner-border-sm",
					role: "status",
					"aria-label": e.t("COM_SMARTBROWSER_WORKING")
				}, null, 8, He)) : (d(), n("span", U)), v("span", Ue, h(e.t("COM_SMARTBROWSER_FLAT_VIEW")), 1)], 10, Ve)) : f("", !0)
			], 2),
			e.filters?.length && e.filtersOpen ? (d(), n("div", W, [(d(!0), n(_, null, i(e.filters, (r) => (d(), n("label", { key: r.id }, [v("span", null, h(e.t(r.label)), 1), r.type === "select" ? (d(), n("select", {
				key: 0,
				class: "form-select",
				value: e.filterValues[r.id] ?? r.default,
				onChange: (e) => t.$emit("filter", {
					id: r.id,
					value: e.target.value
				})
			}, [(d(!0), n(_, null, i(r.options, (e) => (d(), n("option", {
				key: e.value,
				value: e.value
			}, h(oe(r, e)), 9, G))), 128))], 40, We)) : f("", !0)]))), 128))])) : f("", !0)
		], 2)], 8, ["to", "disabled"]));
	}
}, K = {
	class: "resource-breadcrumb",
	"aria-label": "Breadcrumb"
}, Ke = [
	"title",
	"aria-label",
	"onClick"
], qe = {
	key: 1,
	class: "resource-breadcrumb-title"
}, Je = {
	__name: "ResourceBreadcrumb",
	props: {
		breadcrumb: Array,
		root: Object,
		rootIcon: String,
		iconOnlyRoot: Boolean
	},
	emits: ["open"],
	setup(e) {
		let t = e, r = E(() => {
			let e = t.breadcrumb || [], n = e[0] || t.root;
			return n ? [n, ...e.slice(1).filter((e) => e.visible !== !1)] : [];
		});
		return (t, a) => (d(), n("nav", K, [(d(!0), n(_, null, i(r.value, (r, i) => (d(), n("button", {
			key: r.id,
			type: "button",
			class: s({ "root-crumb": i === 0 && e.iconOnlyRoot }),
			title: r.title,
			"aria-label": i === 0 && e.iconOnlyRoot ? r.title : void 0,
			onClick: (e) => t.$emit("open", r.id)
		}, [i === 0 ? (d(), n("span", {
			key: 0,
			class: s(r.useResourceIcon ? r.openIcon || r.icon : e.rootIcon),
			"aria-hidden": "true"
		}, null, 2)) : f("", !0), i !== 0 || !e.iconOnlyRoot ? (d(), n("span", qe, h(r.title), 1)) : f("", !0)], 10, Ke))), 128))]));
	}
}, Ye = {
	class: "resource-toolbar",
	role: "toolbar"
}, Xe = { class: "resource-toolbar-primary" }, Ze = { class: "resource-view-controls" }, Qe = [
	"disabled",
	"title",
	"aria-label"
], $e = [
	"value",
	"aria-label",
	"placeholder"
], et = ["title", "aria-label"], tt = ["disabled"], nt = ["disabled"], rt = ["title"], it = { "aria-hidden": "true" }, at = { class: "resource-mode-controls" }, ot = ["title", "onClick"], st = ["title"], ct = {
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
		let t = e, r = E(() => t.views.find((e) => e.id === t.activeView) || {}), a = [
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
		], o = E(() => {
			let e = t.sortFields?.length ? [...t.sortFields] : [...a];
			t.orderingField && !e.some((e) => e.id === t.orderingField) && e.push({
				id: t.orderingField,
				label: "JGRID_HEADING_ORDERING"
			});
			let n = (t.columns || []).flatMap((e) => e.dateGroup ? (e.fields || []).map((e) => e.sortField || e.id) : [e.sortField || e.id]), r = (e) => e === t.orderingField ? -1 : n.indexOf(e);
			return e.sort((e, i) => {
				let a = r(e.id), o = r(i.id);
				return (a < 0 && e.id !== t.orderingField ? n.length : a) - (o < 0 && i.id !== t.orderingField ? n.length : o);
			});
		}), c = E(() => ({
			created: "C",
			modified: "M",
			both: "M&C"
		})[t.detailsDateMode] || "M"), l = E(() => `${t.t("COM_SMARTBROWSER_DATE")}: ${c.value}`), u = (e) => r.value.controls?.includes(e);
		return (t, r) => (d(), n("div", Ye, [v("div", Xe, [p(Je, {
			breadcrumb: e.breadcrumb,
			root: e.root,
			"root-icon": e.rootIcon,
			"icon-only-root": e.iconOnlyRoot,
			onOpen: r[0] ||= (e) => t.$emit("open", e)
		}, null, 8, [
			"breadcrumb",
			"root",
			"root-icon",
			"icon-only-root"
		]), v("div", Ze, [
			e.reorderVisible ? (d(), T(oe, {
				key: 0,
				enabled: e.reorderEnabled,
				t: e.t,
				onReorder: r[1] ||= (e) => t.$emit("reorder", e)
			}, null, 8, ["enabled", "t"])) : f("", !0),
			e.multiple ? (d(), n("button", {
				key: 1,
				type: "button",
				class: "resource-icon-button",
				disabled: !e.canInvert,
				title: e.t("COM_SMARTBROWSER_INVERT_SELECTION"),
				"aria-label": e.t("COM_SMARTBROWSER_INVERT_SELECTION"),
				onClick: r[2] ||= (e) => t.$emit("invert-selection")
			}, [...r[13] ||= [v("span", {
				class: "fas fa-retweet",
				"aria-hidden": "true"
			}, null, -1)]], 8, Qe)) : f("", !0),
			p(xe, {
				label: e.t("COM_SMARTBROWSER_SEARCH"),
				icon: "fas fa-search",
				"panel-class": "resource-search-row",
				width: 360
			}, {
				default: m(() => [v("form", {
					class: "input-group resource-search-control",
					role: "search",
					onSubmit: r[4] ||= y((n) => t.$emit("search", e.search), ["prevent"])
				}, [v("input", {
					value: e.search,
					type: "search",
					class: "form-control",
					"aria-label": e.t("COM_SMARTBROWSER_SEARCH"),
					placeholder: e.t("COM_SMARTBROWSER_SEARCH"),
					onInput: r[3] ||= (e) => t.$emit("search", e.target.value)
				}, null, 40, $e), v("button", {
					type: "submit",
					class: "btn btn-primary",
					title: e.t("COM_SMARTBROWSER_SEARCH"),
					"aria-label": e.t("COM_SMARTBROWSER_SEARCH")
				}, [...r[14] ||= [v("span", {
					class: "fas fa-search",
					"aria-hidden": "true"
				}, null, -1)]], 8, et)], 32)]),
				_: 1
			}, 8, ["label"]),
			u("sort") ? (d(), T(ie, {
				key: 2,
				fields: o.value,
				"sort-by": e.sortBy,
				"sort-direction": e.sortDirection,
				t: e.t,
				onSortBy: r[5] ||= (e) => t.$emit("sort-by", e),
				onSortDirectionValue: r[6] ||= (e) => t.$emit("sort-direction-value", e)
			}, null, 8, [
				"fields",
				"sort-by",
				"sort-direction",
				"t"
			])) : f("", !0),
			u("zoom") ? (d(), n("button", {
				key: 3,
				type: "button",
				class: "resource-icon-button",
				disabled: e.gridSize === "sm",
				title: "Decrease size",
				onClick: r[7] ||= (e) => t.$emit("resize", -1)
			}, [...r[15] ||= [v("span", {
				class: "fas fa-search-minus",
				"aria-hidden": "true"
			}, null, -1)]], 8, tt)) : f("", !0),
			u("zoom") ? (d(), n("button", {
				key: 4,
				type: "button",
				class: "resource-icon-button",
				disabled: e.gridSize === "xl",
				title: "Increase size",
				onClick: r[8] ||= (e) => t.$emit("resize", 1)
			}, [...r[16] ||= [v("span", {
				class: "fas fa-search-plus",
				"aria-hidden": "true"
			}, null, -1)]], 8, nt)) : f("", !0),
			u("thumbnails") ? (d(), n("button", {
				key: 5,
				type: "button",
				class: s(["resource-icon-button", { active: e.detailsThumbnails }]),
				title: "Toggle thumbnails",
				onClick: r[9] ||= (e) => t.$emit("toggle-thumbnails")
			}, [...r[17] ||= [v("span", {
				class: "fas fa-images",
				"aria-hidden": "true"
			}, null, -1)]], 2)) : f("", !0),
			u("dateField") ? (d(), n("button", {
				key: 6,
				type: "button",
				class: "resource-icon-button resource-date-toggle",
				title: l.value,
				onClick: r[10] ||= (e) => t.$emit("toggle-date-field")
			}, [r[18] ||= v("span", {
				class: "fas fa-calendar",
				"aria-hidden": "true"
			}, null, -1), v("small", it, h(c.value), 1)], 8, rt)) : f("", !0),
			u("dateField") && e.columns?.length ? (d(), T(ye, {
				key: 7,
				columns: e.columns,
				"hidden-columns": e.hiddenColumns,
				"shown-columns": e.shownColumns,
				t: e.t,
				onToggleColumn: r[11] ||= (e) => t.$emit("toggle-column", e)
			}, null, 8, [
				"columns",
				"hidden-columns",
				"shown-columns",
				"t"
			])) : f("", !0),
			v("div", at, [(d(!0), n(_, null, i(e.views, (r) => (d(), n("button", {
				key: r.id,
				type: "button",
				class: s(["resource-icon-button", { active: e.activeView === r.id }]),
				title: e.t(r.label),
				onClick: (e) => t.$emit("view", r.id)
			}, [v("span", {
				class: s(r.icon),
				"aria-hidden": "true"
			}, null, 2)], 10, ot))), 128))]),
			v("button", {
				type: "button",
				class: s(["resource-icon-button", { active: e.showInfo }]),
				title: e.t("COM_SMARTBROWSER_TOGGLE_INFO"),
				onClick: r[12] ||= (e) => t.$emit("info")
			}, [...r[19] ||= [v("span", {
				class: "fas fa-info",
				"aria-hidden": "true"
			}, null, -1)]], 10, st)
		])])]));
	}
}, lt = {
	__name: "ResourceNodeVisual",
	props: {
		resource: Object,
		open: Boolean
	},
	setup(e) {
		return (t, n) => (d(), T(S, {
			resource: e.resource,
			variant: "compact",
			"allow-image": !1,
			open: e.open,
			"align-base-start": ""
		}, null, 8, ["resource", "open"]));
	}
}, q = ["aria-label"], ut = { class: "resource-tree-content" }, dt = ["open", "onToggle"], ft = ["onClick"], pt = {
	key: 0,
	class: "resource-adapter-roots"
}, mt = ["onClick"], ht = {
	key: 1,
	class: "resource-tree-branch"
}, gt = ["onClick"], _t = ["onClick"], vt = {
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
		let r = e, a = t, o = (e, t) => {
			e.target.open && t !== r.activeAdapter && a("adapter", t);
		}, c = (e) => {
			e === r.activeAdapter ? r.roots[0] && a("open", r.roots[0].id) : a("adapter", e);
		}, l = (e) => r.breadcrumb.some((t) => t.id === e.id), u = (e) => r.breadcrumb.filter((t) => t.id !== e.id), m = E(() => r.roots.some((e) => e.visible !== !1 || l(e) && (u(e).length > 0 || r.nodes.length > 0))), b = (e, t) => ({ paddingInlineStart: `${10 + (e.visible === !1 ? 0 : 18) + t * 18}px` });
		return (t, r) => (d(), n("nav", {
			class: "resource-sidebar",
			"aria-label": e.t("COM_SMARTBROWSER_VIEW")
		}, [v("div", ut, [(d(!0), n(_, null, i(e.adapters, (r) => (d(), n("details", {
			key: r.id,
			class: "resource-adapter",
			open: r.id === e.activeAdapter,
			onToggle: (e) => o(e, r.id)
		}, [v("summary", { onClick: y((e) => c(r.id), ["prevent"]) }, [v("span", {
			class: s(r.icon),
			"aria-hidden": "true"
		}, null, 2), w(" " + h(r.title), 1)], 8, ft), r.id !== e.activeAdapter || m.value ? (d(), n("div", pt, [(d(!0), n(_, null, i(r.id === e.activeAdapter ? e.roots : [], (a) => (d(), n("section", {
			key: a.id,
			class: s(["resource-tree-root", { "root-hidden": a.visible === !1 }])
		}, [a.visible === !1 ? f("", !0) : (d(), n("button", {
			key: 0,
			type: "button",
			class: s({ active: e.selectedNode === a.id }),
			onClick: (e) => t.$emit("open", a.id)
		}, [v("span", {
			class: s(["resource-tree-root-icon", a.useResourceIcon ? a.icon : r.icon]),
			"aria-hidden": "true"
		}, null, 2), v("span", null, h(a.title), 1)], 10, mt)), l(a) ? (d(), n("div", ht, [(d(!0), n(_, null, i(u(a), (r) => (d(), n("button", {
			key: r.id,
			type: "button",
			class: s({ active: e.selectedNode === r.id }),
			style: g(b(a, u(a).indexOf(r))),
			onClick: (e) => t.$emit("open", r.id)
		}, [p(lt, {
			resource: r,
			open: !0
		}, null, 8, ["resource"]), v("span", null, h(r.title), 1)], 14, gt))), 128)), (d(!0), n(_, null, i(e.nodes, (e) => (d(), n(_, { key: e.id }, [e.navigable === !1 ? (d(), n("div", {
			key: 1,
			class: "resource-tree-entry resource-tree-static",
			style: g(b(a, u(a).length))
		}, [p(lt, { resource: e }, null, 8, ["resource"]), v("span", null, h(e.title), 1)], 4)) : (d(), n("button", {
			key: 0,
			type: "button",
			class: "resource-tree-entry",
			style: g(b(a, u(a).length)),
			onClick: (n) => t.$emit("open", e.id)
		}, [p(lt, { resource: e }, null, 8, ["resource"]), v("span", null, h(e.title), 1)], 12, _t))], 64))), 128))])) : f("", !0)], 2))), 128))])) : f("", !0)], 40, dt))), 128))])], 8, q));
	}
}, yt = /* @__PURE__ */ new Set([
	"articles",
	"categories",
	"tags",
	"articles-by-tag",
	"menus",
	"users",
	"media"
]), bt = (e, t, n, r = !1) => {
	let i = r ? "" : e.startsWith("flat-") ? new URL(n).searchParams.get("flatFromBrowseRoot") || "" : t || "";
	return `supjx.smartbrowser.ui.${e.replace(/^flat-/, "")}.${i}`;
}, xt = (e, t, n, r) => {
	let i = new URL(e);
	if (!yt.has(t)) return i.toString();
	i.searchParams.set("flatFromAdapter", t), i.searchParams.set("flatFromNode", n), r ? i.searchParams.set("flatFromBrowseRoot", r) : i.searchParams.delete("flatFromBrowseRoot");
	let a = `flat-${t}`;
	if (i.searchParams.set("adapter", a), i.searchParams.set("node", `${a}:root`), t === "articles" || t === "categories") {
		let e = n.startsWith("category:") ? n : r;
		e?.startsWith("category:") ? i.searchParams.set("browseRoot", e) : i.searchParams.delete("browseRoot"), i.searchParams.delete("flatScope");
	} else r ? i.searchParams.set("browseRoot", r) : i.searchParams.delete("browseRoot"), i.searchParams.set("flatScope", n);
	return i.toString();
}, St = (e, t) => {
	let n = new URL(e), r = n.searchParams.get("flatFromAdapter"), i = yt.has(r) ? r : "articles", a = n.searchParams.get("flatFromBrowseRoot") || (r ? null : t), o = n.searchParams.get("flatFromNode") || a || "content:root";
	n.searchParams.set("adapter", i), n.searchParams.set("node", o), a ? n.searchParams.set("browseRoot", a) : n.searchParams.delete("browseRoot");
	for (let e of [
		"flatFromAdapter",
		"flatFromNode",
		"flatFromBrowseRoot",
		"flatScope"
	]) n.searchParams.delete(e);
	return n.toString();
}, Ct = (e, t) => {
	let n = new URL(e);
	if (!n.searchParams.get("adapter")?.startsWith("flat-") || !t) return n.toString();
	let r = n.searchParams.get("adapter");
	if (n.searchParams.set("node", `${r}:root`), n.searchParams.set("flatFromNode", t), r === "flat-articles" || r === "flat-categories") {
		let e = n.searchParams.get("flatFromBrowseRoot") || (n.searchParams.has("flatFromAdapter") ? null : n.searchParams.get("browseRoot"));
		e ? n.searchParams.set("browseRoot", e) : n.searchParams.delete("browseRoot"), n.searchParams.delete("flatScope");
	} else n.searchParams.set("flatScope", t);
	return n.toString();
}, wt = (e) => e.mode === "manage" && !e.pickerInstance && !e.pickerContext, Tt = (e) => wt(e) ? `supjx.smartbrowser.${e.adapter.replace(/^flat-/, "")}` : `supjx.smartbrowser.picker.${encodeURIComponent(e.pickerContext?.viewPreferenceKey || e.viewPreferenceKey || "default")}.${e.adapter.replace(/^flat-/, "")}`, Et = class {
	constructor(e = A(), t = "supjx.smartbrowser.media") {
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
}, Dt = {
	articles: [
		["tagPaths", "COM_SMARTBROWSER_TAGS"],
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
}, J = (e) => ({
	stateLabel: "status",
	width: "dimension",
	link: "url"
})[e.split(".").pop()] || e.split(".").pop();
function Ot(e, t) {
	let n = e?.columns || [], r = n.map((e) => ({
		...e,
		defaultVisible: !0
	})), i = new Set(n.map((e) => e.id)), a = new Set(n.map((e) => e.source).filter(Boolean)), o = ["articles-by-tag", "featured-articles"].includes(t.replace(/^flat-/, "")) ? "articles" : t.replace(/^flat-/, ""), s = [
		...e?.infoFields || [],
		{
			id: "location",
			label: "COM_SMARTBROWSER_LOCATION",
			source: "metadata.location"
		},
		...(Dt[o] || []).map(([e, t, n]) => ({
			id: J(e),
			label: t,
			source: `metadata.${e}`,
			format: n
		}))
	], c = i.has("dates");
	for (let e of s) {
		if (!e.source || !e.label || e.source === "metadata.locationPath" || o === "articles" && e.source === "metadata.categoryPath") continue;
		let t = e.id || J(e.source);
		i.has(t) || a.has(e.source) || c && ["created", "modified"].includes(t) || (i.add(t), a.add(e.source), r.push({
			id: t,
			label: o === "articles" && t === "tagPaths" ? "COM_SMARTBROWSER_TAGS" : e.label,
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
var kt = {
	key: 0,
	class: "smartbrowser-busy",
	role: "status",
	"aria-live": "polite"
}, At = [
	"aria-pressed",
	"title",
	"aria-label"
], jt = [
	"aria-pressed",
	"title",
	"aria-label"
], Mt = { class: "sb-tree-handle-rail" }, Nt = [
	"title",
	"aria-label",
	"aria-expanded",
	"aria-busy"
], Pt = {
	key: 0,
	class: "spinner-border spinner-border-sm",
	"aria-hidden": "true"
}, Ft = { class: "resource-main" }, It = ["aria-busy"], Lt = {
	key: 0,
	class: "resource-loader",
	role: "status",
	"aria-live": "polite"
}, Rt = {
	key: 1,
	class: "resource-empty"
}, zt = {
	key: 3,
	class: "resource-drop-overlay"
}, Bt = {
	key: 4,
	class: "sb-browser-info-rail"
}, Vt = {
	key: 1,
	class: "resource-picker-collection"
}, Ht = { class: "resource-picker-collection-body" }, Y = {
	__name: "SmartBrowserApp",
	setup(i) {
		let o = r("browser"), u = r("smartBrowserOptions"), _ = u.application === "site" && window.self === window.top, S = a("normal"), C = a(null), ee = a("620px"), ie = a(null), oe, fe, me = () => {
			let e = C.value;
			if (!e) return;
			let t = e.parentElement, n = 0;
			for (let e = t; e; e = e.parentElement) {
				let t = getComputedStyle(e);
				if (n += (parseFloat(t.paddingBottom) || 0) + (parseFloat(t.borderBottomWidth) || 0) + (parseFloat(t.marginBottom) || 0), e.hasAttribute("data-sb-focus") || e === document.body) break;
			}
			let r = t.hasAttribute("data-sb-focus") ? 0 : window.scrollY;
			ee.value = `${Math.max(0, window.innerHeight - e.getBoundingClientRect().top - r - n)}px`;
		}, ge, ve = E(() => ({
			normal: "COM_SMARTBROWSER_DISPLAY_WIDE",
			wide: "COM_SMARTBROWSER_DISPLAY_FOCUS",
			focus: "COM_SMARTBROWSER_DISPLAY_NORMAL"
		})[S.value]), ye = () => {
			S.value = ge.cycle();
		};
		l(() => {
			_ && (ge = we(document.getElementById("smartbrowser-app"), (e) => {
				S.value = e;
			})), me(), oe = new ResizeObserver(me), oe.observe(C.value.parentElement), fe = Te(C.value, () => ie.value?.element, u.nativeToolbarTarget), window.addEventListener("resize", me);
		}), t(S, () => e(me)), b(() => {
			oe?.disconnect(), fe?.(), window.removeEventListener("resize", me), ge?.destroy();
		});
		let xe = r("actionDriver"), M = r("resourceApi"), Ce = r("viewRegistry"), { state: N, resources: P, bulkSelectableResources: Ee, selection: F, focusedResource: I, load: L, focus: De, toggle: Oe, selectAll: ke, invertSelection: Ae } = o, R = u.mode === "select" ? u.pickerContext || u.selectionHost : u.selectionHost || null, z = !!R?.collectionMode, je = u.mode === "select" || !!R, B = (e) => Joomla.Text?._(e, e) || e, Me = E(() => B(u.adapters?.find((e) => e.id === u.adapter)?.title || u.adapters?.find((e) => e.id === u.adapter.replace(/^flat-/, ""))?.title || "COM_SMARTBROWSER_RESOURCE")), Ne = /* @__PURE__ */ new Map(), Pe = (e) => {
			let t = e?.selection?.adapter || e?.adapter;
			if (!t || t === u.adapter.replace(/^flat-/, "")) return xe;
			if (!Ne.has(t)) {
				let e = new j({
					...u,
					adapter: t,
					browseRoot: null,
					flatScope: null
				});
				Ne.set(t, {
					api: e,
					driver: new Se(e, N, async () => {
						await H?.refresh();
						for (let e of H?.browser.state.items || []) N.selectedResources[D(e)] = ue(e);
						await L();
					}, B, u.editorMode, u.application)
				});
			}
			return Ne.get(t).driver.selectionHost = We, Ne.get(t).driver;
		}, Fe = (e) => e?.collectionActions || N.actions, Ie = (e, t) => Fe(t).find((t) => t.id === e.id) || e, V = (e, t) => {
			if (!z || e.currentNode || !t.length) return xe.available(e, t);
			if (e.single && t.length !== 1) return !1;
			let n = (t) => (!t.collectionActions || t.collectionActions.some((t) => t.id === e.id)) && Pe(t).available(Ie(e, t), [t]);
			return e.exclusiveGroup ? t.some(n) : t.every(n);
		}, Le = async (e, t) => {
			if (!V(e, t)) return;
			if (!z || e.currentNode || !t.length) return xe.execute(e, t);
			let n = /* @__PURE__ */ new Map();
			for (let e of t) {
				let t = Pe(e);
				n.has(t) || n.set(t, []), n.get(t).push(e);
			}
			for (let [t, r] of n) await t.execute(Ie(e, r[0]), r);
		};
		b(() => Ne.forEach(({ api: e, driver: t }) => {
			t.destroy(), e.destroy();
		}));
		let H, Re = !1, ze = (e) => z ? e : {
			...e,
			selectionKey: void 0
		}, Be = {
			referenceItems: !0,
			homogeneous: R?.homogeneous === !0,
			readOnly: !1,
			showCount: !1,
			selectionProfile: R?.selectionProfile || {},
			addressContract: R?.addressContract,
			adapter: u.adapter.replace(/^flat-/, ""),
			allowedAdapters: R?.allowedAdapters || (R?.collectionMode ? [] : [u.adapter.replace(/^flat-/, "")]),
			allowedResourceTypes: u.allowedResourceTypes,
			selectionTarget: u.selectionTarget,
			maxSelections: R?.maxSelections || 500,
			selectedResources: !0,
			informationPanel: !1,
			multiple: u.multiple,
			items: R?.getCollectionSnapshot?.().items || [],
			layout: "compact",
			allowRemove: !0,
			allowOrdering: u.multiple && R?.allowOrdering !== !1,
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
				t = ze(t), N.selectedResources[D(t)] = t, N.focusedId = D(t);
			}
		}, Ve = /* @__PURE__ */ new Map();
		async function He(e, t = {}) {
			let n = JSON.stringify([e.adapter, t.browseRoot || ""]);
			return Ve.has(n) || Ve.set(n, new j({
				...u,
				adapter: e.adapter,
				mode: "select",
				browseRoot: t.browseRoot || null,
				flatScope: null
			})), (await Ve.get(n).collection([e.id])).resources[0];
		}
		let U = te({
			profile: R?.selectionProfile || {},
			initialUsage: R?.initialUsage || {},
			editors: R?.editors || {},
			resolveReference: He
		}), Ue = () => N.selectedIds.flatMap((e) => {
			let t = F.value.find((t) => D(t) === e);
			if (t) return [{
				selection: k(t, u.adapter.replace(/^flat-/, "")),
				usage: U.get(t)
			}];
			let n = R?.getCollectionSnapshot?.().items.find((t) => O(t.selection) === e);
			return n ? [n] : [];
		}), W = () => {
			z && R.commitCollection?.({
				items: Ue(),
				resources: Object.fromEntries(F.value.map((e) => [D(e), e])),
				virtualResources: N.virtualResources
			});
		}, We = u.selectionState && (R || u.selectionHost) ? {
			editorContext: R?.selectionEditorContext || {},
			canAdd: (e, t) => o.canAddSelection(e, t),
			canCreate: (e) => o.canCreateSelectionResource(e),
			remove: (e) => {
				o.deleteVirtualResources(e), e.forEach((e) => U.forget(e)), G.value++, W(), u.selectionHost?.onChange?.({ items: Ue() });
			},
			replace: (e, t) => {
				let n = t ? { ...U.get(t) } : {}, r = o.replaceSelectionResource(e, t);
				for (let e of U.definitions(r)) Object.prototype.hasOwnProperty.call(n, e.key) && U.set(r, e.key, n[e.key]);
				return G.value++, W(), u.selectionHost?.onChange?.({ items: Ue() }), t && D(t) !== D(r) && U.forget(t), r;
			}
		} : null;
		xe.selectionHost = We, t(() => [N.selectedIds, N.selectedResources], W, {
			deep: !0,
			flush: "sync"
		}), b(W);
		let G = a(0);
		je && (H = _e({
			config: Be,
			api: M,
			translate: B,
			notify: (e) => {
				Re = !0;
				for (let t of e.items) {
					let n = e.resources.find((e) => D(e) === O(t.selection));
					if (n) for (let [e, r] of Object.entries(t.usage)) U.set(ze(n), e, r);
				}
				N.selectedResources = Object.fromEntries(e.resources.map(ze).map((e) => [D(e), ue(e)])), N.selectedIds = e.items.map((e) => z ? O(e.selection) : e.selection.id), G.value++, Re = !1, W();
			}
		}), H.refresh().catch((e) => Joomla.renderMessages({ error: [e.message] })), t(() => [N.selectedIds, G.value], () => {
			Re || H.setItems(Ue()).catch((e) => Joomla.renderMessages({ error: [e.message] }));
		}, {
			deep: !0,
			flush: "sync"
		}), b(() => H.destroy()));
		let K = a(R?.isMaximized?.() || !1), Ke = E(() => {
			if (R?.title) return R.title;
			let e = u.adapters?.find((e) => e.id === u.adapter) || u.adapters?.find((e) => e.id === u.adapter.replace(/^flat-/, ""));
			return `${B("COM_SMARTBROWSER_PICKER_SELECT_TITLE")} \u2014 ${B(e?.title || "COM_SMARTBROWSER_RESOURCE")}`;
		}), qe = a(0), Je = a({}), Ye = a(!1), Xe = E(() => U.definitions(I.value).filter((e) => e.presentation !== "hidden")), Ze = E(() => (G.value, U.get(I.value))), Qe = E(() => !!(R && Object.keys(R.selectionProfile || {}).length)), $e = !!(R && Object.keys(R.selectionProfile || {}).length), et = a(R?.initialInfoOpen === !0 || (typeof u.pickerRememberedInfo == "boolean" ? u.pickerRememberedInfo : Object.values(R?.selectionProfile || {}).some((e) => e !== !1 && e?.presentation !== "hidden") || N.showInfo)), tt = E(() => $e || R?.initialInfoOpen === !0 ? et.value : N.showInfo), nt = () => {
			$e || R?.initialInfoOpen === !0 ? (et.value = !et.value, N.showInfo = et.value) : N.showInfo = !N.showInfo;
		}, rt = (e, t, n) => {
			e && !q && (U.set(e, t, n), Je.value = {
				...Je.value,
				[D(e)]: {}
			}, G.value++, W());
		}, it = (e, t) => rt(I.value, e, t), at = E(() => {
			let e = I.value;
			return se({
				resource: e,
				overlayRegistry: R || window.SmartBrowserPicker,
				isReadOnly: !R || u.mode === "readonly",
				fieldElement: null,
				isCurrent: () => !q && D(I.value) === D(e),
				getAddress: () => U.get(e)["ext.address"] ?? ne(e),
				getDefaultAddress: () => ne(e),
				resetAddress: () => rt(e, "ext.address", null),
				setAddress: (t) => rt(e, "ext.address", t),
				profile: R?.selectionProfile || {},
				values: Ze.value,
				getValues: () => U.get(e),
				setValue: (t, n) => rt(e, t, n),
				refresh: () => L(),
				selectResource: (e) => window.SmartBrowserPicker.open(e)
			});
		}), ot = a(R?.previewActions || []), st = R?.subscribePreviewActions?.((e) => {
			ot.value = e;
		});
		b(() => st?.());
		let lt = E(() => ot.value.filter((e) => {
			try {
				return I.value && (!at.value.isReadOnly || e.allowReadOnly === !0) && (!e.applies || e.applies(at.value));
			} catch {
				return !1;
			}
		})), q = !1;
		b(() => {
			q = !0, Ve.forEach((e) => e.destroy());
		});
		let ut = Ce.all(), dt = E(() => Ce.get(N.activeView)), ft = a(!1), pt = E(() => N.loading || ft.value), mt = async (t) => {
			if (!(N.activeView === t || N.loading || N.busy || ft.value)) {
				ft.value = !0;
				try {
					await e(), await new Promise((e) => requestAnimationFrame(() => requestAnimationFrame(e))), N.activeView = t, await e();
				} finally {
					ft.value = !1;
				}
			}
		}, ht = a({}), gt = ae({
			api: M,
			config: {
				...u,
				selectionProfile: R?.selectionProfile || {},
				addressContract: R?.addressContract
			}
		}), _t = 0;
		t(() => [P.value, G.value], async () => {
			if (!R) return;
			let e = ++_t, t = {};
			for (let e of P.value) try {
				t[D(e)] = await gt.serialize({
					selection: k(e, u.adapter.replace(/^flat-/, "")),
					usage: U.get(e)
				}, e);
			} catch {
				t[D(e)] = "";
			}
			e === _t && (ht.value = t);
		}, { immediate: !0 }), b(() => {
			_t++, gt.destroy();
		});
		let yt = E(() => R ? P.value.map((e) => ({
			...e,
			selectionAddress: ht.value[D(e)] || ""
		})) : P.value), Tt = E(() => {
			let e = Ot(N.presentation, u.adapter);
			return R && !e.some((e) => e.id === "selectionAddress") && e.push({
				id: "selectionAddress",
				source: "selectionAddress",
				label: "COM_SMARTBROWSER_URI",
				headerIcon: "fas fa-link",
				defaultVisible: !1
			}), e;
		}), Et = E(() => Tt.value.filter((e) => e.id === "title" || e.id === "name" || (e.defaultVisible ? !N.hiddenColumns.includes(e.id) : N.shownColumns.includes(e.id)))), Dt = (e) => {
			let t = Tt.value.find((t) => t.id === e);
			if (!t || ["title", "name"].includes(e)) return;
			let n = t.defaultVisible ? "hiddenColumns" : "shownColumns";
			N[n] = N[n].includes(e) ? N[n].filter((t) => t !== e) : [...N[n], e];
		}, J = a(!1), Y = a(u.adapter.startsWith("flat-")), X = a(null), Ut = a(!1), Wt = a(null), Gt = E(() => u.adapter === "media"), Kt = E(() => u.mode === "manage" && ["details", "grid"].includes(N.activeView) && N.presentation.orderingField && N.sortBy === N.presentation.orderingField && ["asc", "desc"].includes(N.sortDirection) && (u.adapter === "featured-articles" || String(N.filters.featured ?? "") !== "1")), Z = E(() => Kt.value && !N.busy && F.value.length > 0 && F.value.every((e) => e.capabilities?.reorder === !0)), qt = async (e) => {
			if (!Z.value || !["up", "down"].includes(e)) return;
			let t = F.value.map((e) => e.id), n = N.focusedId;
			N.busy = !0;
			try {
				let r = N.sortDirection === "desc" ? e === "up" ? "down" : "up" : e;
				(await M.execute("reorder", t, { direction: r })).updated?.length && (await L(), N.selectedIds = t.filter((e) => P.value.some((t) => t.id === e)), N.focusedId = N.selectedIds.includes(n) ? n : N.selectedIds[0] || null);
			} catch (e) {
				Joomla.renderMessages({ error: [e.message] });
			} finally {
				N.busy = !1;
			}
		}, Jt = u.adapter !== "featured-articles" && [
			"articles",
			"categories",
			"tags",
			"articles-by-tag",
			"menus",
			"users",
			"media"
		].includes(u.adapter.replace(/^flat-/, "")), Q = u.adapter.startsWith("flat-") || u.adapter === "featured-articles", $ = u.adapter.startsWith("flat-") ? new j({
			...u,
			adapter: u.adapter.slice(5),
			browseRoot: u.flatTreeRoot || null,
			flatScope: null
		}) : null, Yt = E(() => (u.adapters || []).filter((e) => (!$ || e.id !== u.adapter.slice(5)) && (!R?.allowedAdapters?.length || R.allowedAdapters.includes(e.id.replace(/^flat-/, "")))));
		t(Y, async (e) => {
			if (!(e || !$ || X.value || Ut.value)) {
				Ut.value = !0;
				try {
					let e = (await $.getResources("")).roots || [], t = u.flatTreeNode || e[0]?.id;
					X.value = {
						...t ? await $.getResources(t) : {},
						roots: e
					};
				} catch (e) {
					q || Joomla.renderMessages({ error: [e.message] });
				} finally {
					Ut.value = !1;
				}
			}
		}), b(() => $?.destroy());
		let Xt = async (e) => {
			if (!$) return L(e);
			W(), await on(xt(window.location.href, u.adapter.slice(5), e, u.flatTreeRoot || null));
		}, Zt = E(() => !Q || !u.flatBreadcrumb?.length || u.flatBreadcrumb.length === 1 ? N.breadcrumb : u.flatBreadcrumb), Qt = a(!1), $t = Object.fromEntries(Object.entries(u.gridWidths || {}).map(([e, t]) => [`--sb-grid-${e}`, `${t}px`])), en = wt(u) ? bt(u.adapter, u.browseRoot, window.location.href, !0) : `supjx.smartbrowser.ui.picker.${encodeURIComponent(R?.viewPreferenceKey || u.viewPreferenceKey || "default")}.${u.adapter.replace(/^flat-/, "")}`, tn = (() => {
			try {
				return JSON.parse(A().getItem(en) || "{}");
			} catch {
				return {};
			}
		})(), nn = a(tn.filtersOpen === !0), rn = (e) => {
			tn = {
				...tn,
				filtersOpen: nn.value,
				...e
			}, A().setItem(en, JSON.stringify(tn));
		}, an = () => {
			nn.value = !nn.value, rn({ filtersOpen: nn.value });
		}, on = async (t) => {
			Qt.value || (Qt.value = !0, N.loading = !0, await e(), await new Promise((e) => requestAnimationFrame(() => requestAnimationFrame(e))), window.location.assign(t));
		}, sn = () => {
			rn({ flat: !Q }), on(Q ? St(window.location.href, u.browseRoot) : xt(window.location.href, u.adapter, N.selectedNode, u.browseRoot));
		}, cn = E(() => u.adapters?.find((e) => e.id === u.adapter)?.icon || u.adapters?.find((e) => e.id === u.adapter.replace(/^flat-/, ""))?.icon || "fas fa-list"), ln = E(() => u.adapters?.find((e) => e.id === u.adapter)?.nodeOpenIcon || {
			media: "fas fa-folder-open",
			articles: "fas fa-box-open",
			"flat-articles": "fas fa-box-open",
			categories: "fas fa-box-open",
			tags: "fas fa-tags",
			"articles-by-tag": "fas fa-tags",
			users: "fas fa-users-viewfinder",
			menus: "fas fa-diagram-successor",
			"featured-articles": "fas fa-star"
		}[u.adapter] || "fas fa-folder-open"), un = [
			"sm",
			"md",
			"lg",
			"xl"
		], dn = async ({ selection: e, payload: t, resolve: n, reject: r }) => {
			try {
				let r = await M.execute("batch", e, t);
				if (r.download) {
					let e = atob(r.download.content), t = Uint8Array.from(e, (e) => e.charCodeAt(0)), n = URL.createObjectURL(new Blob([t], { type: "application/zip" })), i = document.createElement("a");
					i.href = n, i.download = r.download.name, i.click(), setTimeout(() => URL.revokeObjectURL(n), 6e4);
				}
				await L(), n(r);
			} catch (e) {
				r(e);
			}
		}, fn = async (e) => {
			if (Ye.value || !e.length) return;
			Ye.value = !0;
			let t = G.value, n;
			try {
				n = await U.validate(e);
			} finally {
				Ye.value = !1;
			}
			if (q || t !== G.value) return;
			if (Je.value = n.errors, !n.valid) {
				Object.keys(n.profileErrors).length && Joomla.renderMessages({ error: [B("COM_SMARTBROWSER_USAGE_PROFILE_INVALID")] });
				let e = Object.keys(n.errors).find((e) => Object.keys(n.errors[e]).some((t) => !n.profileErrors[e]?.[t]));
				e && (N.focusedId = e, qe.value++, tt.value || Joomla.renderMessages({ error: [B("COM_SMARTBROWSER_USAGE_INVALID")] }));
				return;
			}
			let r = {
				adapter: u.adapter.replace(/^flat-/, ""),
				mode: u.mode,
				resources: [...e]
			};
			z && (r.collectionItems = e.map((e) => ({
				selection: k(e, u.adapter.replace(/^flat-/, "")),
				usage: n.usage[D(e)] || {}
			}))), R && (r.pickerInstance = u.pickerInstance, r.usage = n.usage), document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r })), window.parent !== window && window.parent.document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r }));
		}, pn = (e) => {
			let t = un.indexOf(N.viewOptions.gridSize);
			N.viewOptions.gridSize = un[Math.max(0, Math.min(un.length - 1, t + e))];
		}, mn = (e) => ce(e, u.mode, Fe(e), V, u.selectionTarget || "both"), hn = (e) => pe(e, u.mode, Fe(e), V), gn = (e) => he(e, u.mode, Fe(e), V, u.selectionTarget || "both"), _n = (e, t) => !N.busy && (e.local ? t.every((t) => mn(t)?.id === e.id || gn(t)?.id === e.id) : V(e, t)), vn = (e) => {
			let t = mn(e);
			t && yn(t, e);
		}, yn = (e, t) => {
			if (e && t && _n(e, [t])) return e.id === "browseOpen" ? L(t.id) : e.id === "pickerSelect" ? z ? (N.selectedIds.includes(D(t)) || Oe(t, !0), fn(F.value)) : fn([t]) : Le(e, [t]);
		}, bn = (e) => {
			if (R?.allowedAdapters?.length && !R.allowedAdapters.includes(e.replace(/^flat-/, "")) || e === u.adapter) return;
			W();
			let t = new URL(window.location.href);
			t.searchParams.set("adapter", e), t.searchParams.delete("node"), t.searchParams.delete("browseRoot"), R?.initialBrowseRoot && e.replace(/^flat-/, "") === R.initialAdapter.replace(/^flat-/, "") && t.searchParams.set("browseRoot", R.initialBrowseRoot), t.searchParams.delete("initialResource"), t.searchParams.delete("flatScope"), window.location.href = t.toString();
		}, xn = async ({ id: e, value: t }) => {
			if (N.filters[e] = t, e === "menu" && t && !u.browseRoot && u.adapter === "menus") {
				await L(`menu:${t}`);
				return;
			}
			if (e === "menu" && t && !u.browseRoot && u.adapter === "flat-menus") {
				let e = new URL(window.location.href);
				e.searchParams.set("flatScope", `menu:${t}`), e.searchParams.set("flatFromNode", `menu:${t}`), window.location.assign(e.toString());
				return;
			}
			await L(N.selectedNode);
		}, Sn = async () => {
			(N.presentation.filters || []).forEach((e) => {
				N.filters[e.id] = e.default ?? "";
			}), await L(N.selectedNode);
		}, Cn = async (t) => {
			if (Q && u.flatBreadcrumb?.some((e) => e.id === t)) {
				if (t === u.flatBreadcrumb.at(-1)?.id) return;
				let e = new URL(window.location.href), n = e.searchParams.get("flatFromBrowseRoot") || (e.searchParams.has("flatFromAdapter") ? null : u.browseRoot);
				await on(xt(window.location.href, u.adapter.replace(/^flat-/, ""), t, n));
				return;
			}
			if (Q && t === N.selectedNode && t === N.roots[0]?.id) {
				N.search = "", N.sortBy = u.defaultSortBy || "", N.sortDirection = u.defaultSortDirection || "";
				let t = Ct(window.location.href, u.flatRootNode);
				if (t !== window.location.href) {
					(N.presentation.filters || []).forEach((e) => {
						N.filters[e.id] = e.default ?? "";
					}), await e(), window.location.assign(t);
					return;
				}
				await Sn();
				return;
			}
			await L(t);
		}, wn = (e) => {
			N.sortBy === e ? N.sortDirection === "asc" ? N.sortDirection = "desc" : (N.sortBy = "", N.sortDirection = "") : (N.sortBy = e, N.sortDirection = "asc");
		}, Tn = (e) => {
			N.sortBy = e, N.sortDirection = e ? N.sortDirection || "asc" : "";
		}, En = () => {
			let e = [
				"modified",
				"created",
				"both"
			], t = e.indexOf(N.viewOptions.detailsDateMode);
			N.viewOptions.detailsDateMode = e[(t + 1) % e.length];
		}, Dn = async (e) => {
			J.value = !1, Gt.value && await xe.uploadFiles(e.dataTransfer?.files);
		};
		return l(() => {
			if (Q && rn({ flat: !0 }), !Q && Jt && tn.flat === !0) {
				window.location.replace(xt(window.location.href, u.adapter, N.selectedNode, u.browseRoot));
				return;
			}
			L(N.selectedNode).then(async () => {
				if (z) {
					let e = R.getCollectionSnapshot();
					try {
						let t = await M.collection(e.items, {
							referenceItems: !0,
							homogeneous: R.homogeneous
						});
						if (q) return;
						if (N.selectedResources = Object.fromEntries(t.resources.map((e) => [D(e), ue(e)])), N.selectedIds = t.items.map((e) => O(e.selection)), N.focusedId = N.selectedIds.find((e) => P.value.some((t) => D(t) === e)) || N.selectedIds[0] || null, R.initialFocus) {
							let e = O(R.initialFocus);
							N.selectedIds.includes(e) && (N.focusedId = e);
						}
					} catch (e) {
						q || Joomla.renderMessages({ error: [e.message] });
					}
				}
				if (!z && R?.initialSelection?.length && (!R.initialAdapter || R.initialAdapter.replace(/^flat-/, "") === u.adapter.replace(/^flat-/, ""))) {
					let e = R.initialSelection.map((e) => e && typeof e == "object" ? e.id : e);
					try {
						let t = await M.collection(u.multiple ? e : e.slice(0, 1));
						if (q) return;
						let n = new Set(u.allowedResourceTypes || []), r = t.resources.filter((e) => !e.unavailable && le(e, u.selectionTarget) && (!n.size || n.has(e.type)));
						N.selectedIds = r.map((e) => e.id), N.selectedResources = Object.fromEntries(r.map((e) => [e.id, e])), N.focusedId = N.selectedIds[0] || null;
					} catch (e) {
						q || Joomla.renderMessages({ error: [e.message] });
					}
				}
				u.adapter === "media" && u.initialResource && P.value.some((e) => e.id === u.initialResource) && (N.focusedId = D(P.value.find((e) => e.id === u.initialResource)));
			});
		}), (e, t) => (d(), n("div", {
			ref_key: "shellElement",
			ref: C,
			class: s(["smartbrowser-shell sb-redesigned-browser", {
				"is-site": x(u).application === "site",
				"is-picker": x(u).mode === "select" || !!x(R),
				"is-contained": x(u).mode === "select" || !!x(R) || S.value === "focus"
			}]),
			style: g({
				...x($t),
				"--sb-browser-available-height": ee.value
			})
		}, [
			x(N).busy ? (d(), n("div", kt, [t[14] ||= v("span", {
				class: "spinner-border",
				"aria-hidden": "true"
			}, null, -1), v("span", null, h(B("COM_SMARTBROWSER_WORKING")), 1)])) : f("", !0),
			p(Ge, {
				ref_key: "browserHeader",
				ref: ie,
				"native-toolbar-target": x(u).nativeToolbarTarget,
				"heading-title": x(R) || x(u).mode === "select" ? Ke.value : Me.value,
				"heading-subtitle": x(R) || x(u).mode === "select" ? x(R)?.subtitle : x(u).browserDescription,
				"heading-icon": cn.value,
				actions: x(N).actions,
				available: (e) => V(e, x(F)),
				selection: x(F),
				"batch-available": x(u).mode === "manage",
				"can-cancel": typeof x(R)?.cancel == "function",
				"flat-available": x(Jt),
				"flat-active": x(Q),
				"flat-busy": Qt.value,
				"filters-open": nn.value,
				filters: x(N).presentation.filters,
				"filter-values": x(N).filters,
				"manager-url": x(u).managerUrl,
				"manager-new-tab": x(u).application === "site",
				"dashboard-url": x(u).dashboardUrl,
				integrated: x(u).integrated,
				"selection-mode": x(u).mode === "select",
				"allow-no-user": x(u).allowNoUser,
				"can-complete": x(F).length > 0 && !Ye.value,
				"confirm-label": x(R)?.confirmLabel,
				t: B,
				onAction: t[1] ||= (e) => Le(e, x(F)),
				onBatch: t[2] ||= (e) => Wt.value?.open(),
				onCancel: t[3] ||= (e) => x(R)?.cancel(),
				onToggleFlat: sn,
				onToggleFilters: an,
				onFilter: xn,
				onClearFilters: Sn,
				onComplete: t[4] ||= (e) => fn(x(F)),
				onNoUser: t[5] ||= (e) => fn([{
					id: "user:0",
					type: "user",
					title: ""
				}])
			}, {
				"display-controls": m(() => [x(R)?.toggleSize ? (d(), n("button", {
					key: 0,
					type: "button",
					class: s(["resource-icon-button resource-display-toggle", { active: K.value }]),
					"aria-pressed": K.value,
					title: B(K.value ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE"),
					"aria-label": B(K.value ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE"),
					onClick: t[0] ||= (e) => K.value = x(R).toggleSize()
				}, [v("span", {
					class: s(K.value ? "fas fa-compress" : "fas fa-expand"),
					"aria-hidden": "true"
				}, null, 2)], 10, At)) : f("", !0), x(_) ? (d(), n("button", {
					key: 1,
					type: "button",
					class: s(["resource-icon-button resource-display-toggle", { active: S.value !== "normal" }]),
					"aria-pressed": S.value !== "normal",
					title: B(ve.value),
					"aria-label": B(ve.value),
					onClick: ye
				}, [v("span", {
					class: s(S.value === "normal" ? "fas fa-arrows-alt-h" : S.value === "wide" ? "fas fa-expand" : "fas fa-compress"),
					"aria-hidden": "true"
				}, null, 2)], 10, jt)) : f("", !0)]),
				_: 1
			}, 8, [
				"native-toolbar-target",
				"heading-title",
				"heading-subtitle",
				"heading-icon",
				"actions",
				"available",
				"selection",
				"batch-available",
				"can-cancel",
				"flat-available",
				"flat-active",
				"flat-busy",
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
			p(re, {
				ref_key: "batchDialog",
				ref: Wt,
				selection: x(F),
				adapter: x(u).adapter,
				filters: x(N).presentation.filters,
				"batch-options": x(N).presentation.batchOptions,
				"sort-fields": x(N).presentation.sortFields,
				"ordering-available": Kt.value,
				t: B,
				onApply: dn
			}, null, 8, [
				"selection",
				"adapter",
				"filters",
				"batch-options",
				"sort-fields",
				"ordering-available"
			]),
			v("div", { class: s(["smartbrowser-layout", { "tree-collapsed": Y.value }]) }, [
				!Y.value && (!x($) || X.value) ? (d(), T(vt, {
					key: 0,
					adapters: Yt.value,
					"active-adapter": x(u).adapter,
					roots: X.value?.roots || x(N).roots,
					nodes: X.value?.nodes || x(N).nodes,
					breadcrumb: X.value?.breadcrumb || x(N).breadcrumb,
					"selected-node": X.value?.nodeId || x(N).selectedNode,
					t: B,
					onOpen: Xt,
					onAdapter: bn
				}, null, 8, [
					"adapters",
					"active-adapter",
					"roots",
					"nodes",
					"breadcrumb",
					"selected-node"
				])) : f("", !0),
				v("div", Mt, [v("button", {
					type: "button",
					class: "resource-sidebar-handle",
					title: B(Y.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-label": B(Y.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-expanded": !Y.value,
					"aria-busy": Ut.value,
					onClick: t[6] ||= (e) => Y.value = !Y.value
				}, [Ut.value ? (d(), n("span", Pt)) : (d(), n("span", {
					key: 1,
					class: s(Y.value ? "fas fa-chevron-right" : "fas fa-chevron-left"),
					"aria-hidden": "true"
				}, null, 2))], 8, Nt)]),
				v("main", Ft, [p(ct, {
					breadcrumb: Zt.value,
					root: x(N).roots[0],
					"root-icon": ln.value,
					"icon-only-root": Zt.value.length > 1,
					search: x(N).search,
					"sort-by": x(N).sortBy,
					"sort-direction": x(N).sortDirection,
					"sort-fields": x(N).presentation.sortFields,
					"ordering-field": x(N).presentation.orderingField,
					views: x(ut),
					"active-view": x(N).activeView,
					"grid-size": x(N).viewOptions.gridSize,
					"details-thumbnails": x(N).viewOptions.detailsThumbnails,
					"details-date-mode": x(N).viewOptions.detailsDateMode,
					columns: Tt.value,
					"hidden-columns": x(N).hiddenColumns,
					"shown-columns": x(N).shownColumns,
					"show-info": tt.value,
					multiple: x(u).multiple,
					"can-invert": x(u).multiple && x(Ee).length > 0,
					"reorder-visible": Kt.value,
					"reorder-enabled": Z.value,
					t: B,
					onOpen: Cn,
					onInvertSelection: x(Ae),
					onReorder: qt,
					onSearch: t[7] ||= (e) => x(N).search = e,
					onSortBy: Tn,
					onSortDirectionValue: t[8] ||= (e) => x(N).sortDirection = e,
					onResize: pn,
					onToggleThumbnails: t[9] ||= (e) => x(N).viewOptions.detailsThumbnails = !x(N).viewOptions.detailsThumbnails,
					onToggleDateField: En,
					onToggleColumn: Dt,
					onView: mt,
					onInfo: nt
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
				]), v("div", {
					class: s(["resource-browser", {
						loading: pt.value,
						"is-dragging": J.value,
						"info-open": tt.value,
						"usage-open": Qe.value
					}]),
					"aria-busy": pt.value,
					onDragenter: t[11] ||= y((e) => J.value = Gt.value, ["prevent"]),
					onDragover: t[12] ||= y(() => {}, ["prevent"]),
					onDragleave: t[13] ||= y((e) => J.value = !1, ["self"]),
					onDrop: y(Dn, ["prevent"])
				}, [
					pt.value ? (d(), n("div", Lt, [t[15] ||= v("span", {
						class: "spinner-border",
						"aria-hidden": "true"
					}, null, -1), v("span", null, h(B("COM_SMARTBROWSER_LOADING")), 1)])) : x(P).length ? (d(), T(c(dt.value.component), {
						key: 2,
						resources: yt.value,
						"selected-ids": x(N).selectedIds,
						"focused-id": x(N).focusedId,
						"all-selected": x(Ee).length > 0 && x(Ee).every((e) => x(N).selectedIds.includes(x(D)(e))),
						options: x(N).viewOptions,
						"selection-controls": !x(R) || x(u).multiple !== !1,
						actions: x(N).actions,
						"action-available": _n,
						"default-action": mn,
						"preview-action": hn,
						"modified-action": gn,
						"sort-by": x(N).sortBy,
						"sort-direction": x(N).sortDirection,
						"sort-fields": x(N).presentation.sortFields,
						"ordering-field": x(N).presentation.orderingField,
						columns: Et.value,
						"grid-fields": x(N).presentation.gridFields,
						t: B,
						onSelect: x(Oe),
						onFocus: x(De),
						onSelectAll: x(ke),
						onOpen: x(L),
						onActivate: vn,
						onAction: yn,
						onSort: wn
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
					])) : (d(), n("div", Rt, [v("span", {
						class: s(x(N).search ? "fas fa-search" : Gt.value ? "fas fa-cloud-upload-alt" : cn.value),
						"aria-hidden": "true"
					}, null, 2), v("p", null, h(x(N).search ? B("COM_SMARTBROWSER_NO_RESULTS") : Gt.value ? B("COM_SMARTBROWSER_DROP_UPLOAD") : B("COM_SMARTBROWSER_EMPTY_STATE")), 1)])),
					Gt.value && J.value ? (d(), n("div", zt, [t[16] ||= v("span", { class: "fas fa-cloud-upload-alt" }, null, -1), w(h(B("COM_SMARTBROWSER_DROP_UPLOAD")), 1)])) : f("", !0),
					tt.value ? (d(), n("div", Bt, [p(be, {
						resource: x(I),
						fields: x(I)?.collectionPresentation?.infoFields || x(N).presentation.infoFields,
						t: B,
						"usage-definitions": Xe.value,
						"usage-values": Ze.value,
						"usage-errors": Je.value[x(D)(x(I))] || {},
						"usage-editors": x(R)?.editors,
						"resolve-reference": He,
						"usage-revision": qe.value,
						"preview-actions": lt.value,
						"preview-context": at.value,
						"can-preview": !!hn(x(I)) && Pe(x(I)).canPreview(x(I)) && !x(N).busy,
						onPreview: t[10] ||= (e) => yn(hn(x(I)), x(I)),
						onUsageChange: it
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
					])])) : f("", !0)
				], 42, It)])
			], 2),
			x(je) ? (d(), n("details", Vt, [v("summary", null, [
				t[17] ||= v("span", {
					class: "fas fa-chevron-up resource-picker-collection-chevron",
					"aria-hidden": "true"
				}, null, -1),
				w(h(B("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": ", 1),
				v("span", null, h(x(N).selectedIds.length), 1)
			]), v("div", Ht, [x(H) ? (d(), T(de, {
				key: 0,
				model: x(H),
				api: x(M),
				config: Be,
				t: B
			}, null, 8, ["model", "api"])) : f("", !0)])])) : f("", !0)
		], 6));
	}
}, X = "supjx.smartbrowser.preferencesResetToken";
function Ut(e, t) {
	if (!t || e.getItem(X) === t) return !1;
	let n = [];
	for (let t = 0; t < e.length; t++) {
		let r = e.key(t);
		r?.startsWith("supjx.smartbrowser.") && r !== X && r !== "supjx.smartbrowser.editorReturn" && n.push(r);
	}
	return n.forEach((t) => e.removeItem(t)), e.setItem(X, t), !0;
}
//#endregion
//#region resources/js/core/resetSessionNavigation.js
var Wt = "supjx.smartbrowser.";
function Gt(e, t, n) {
	if (!n) return !1;
	let r = `${Wt}session.${t}`, i = e.getItem(r);
	if (e.setItem(r, n), !i || i === n) return !1;
	for (let t = 0; t < e.length; t++) {
		let n = e.key(t);
		if (!(!n?.startsWith(Wt) || n.startsWith(`${Wt}ui.`) || n.startsWith(`${Wt}session.`))) try {
			let t = JSON.parse(e.getItem(n));
			if (!t || typeof t != "object" || Array.isArray(t) || !("selectedNode" in t) && !("filters" in t)) continue;
			delete t.selectedNode, delete t.filters, e.setItem(n, JSON.stringify(t));
		} catch {}
	}
	return !0;
}
function Kt(e) {
	let t = new URL(e);
	if (t.searchParams.delete("node"), t.searchParams.has("flatFromAdapter")) {
		let e = t.searchParams.get("flatFromBrowseRoot");
		e ? t.searchParams.set("browseRoot", e) : t.searchParams.delete("browseRoot"), t.searchParams.delete("flatScope"), t.searchParams.delete("flatFromNode"), t.searchParams.delete("flatFromBrowseRoot"), t.searchParams.delete("flatFromAdapter");
	}
	return t.toString();
}
//#endregion
//#region resources/js/main.js
var Z = Joomla.getOptions("com_smartbrowser", {}), qt = null;
try {
	qt = window.parent !== window && Z.pickerInstance ? window.parent.SmartBrowserPicker?.context(Z.pickerInstance, window) : null;
} catch {}
Z.pickerContext = qt, Ut(window.sessionStorage, Z.preferencesResetToken);
var Jt = Gt(window.sessionStorage, Z.application, Z.csrfToken) ? Kt(window.location.href) : window.location.href;
if (Jt !== window.location.href) window.location.replace(Jt);
else {
	let e = new j(Z), t = Tt(Z), n = new Et(A(), t);
	qt && (Z.pickerRememberedInfo = n.load({}).showInfo);
	let r = me().register({
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
		component: fe,
		supportsSize: !1,
		controls: ["thumbnails", "dateField"],
		options: {
			detailsThumbnails: !1,
			detailsDateMode: "modified"
		}
	}), i = ge({
		options: Z,
		api: e,
		persistence: n,
		viewRegistry: r
	}), a = new Se(e, i.state, () => i.load(), (e) => Joomla.Text?._(e, e) || e, Z.editorMode, Z.application);
	window.SmartBrowser = {
		...window.SmartBrowser,
		open(e = {}) {
			let t = e.showContextResources ?? Z.showContextResources ?? !1, n = e.browseRoot ? `&browseRoot=${encodeURIComponent(e.browseRoot)}` : "", r = e.defaultView ? `&defaultView=${encodeURIComponent(e.defaultView)}` : "", i = e.allowedResourceTypes?.length ? `&allowedResourceTypes=${encodeURIComponent(e.allowedResourceTypes.join(","))}` : "", a = e.showAdapterSwitcher ? "&showAdapterSwitcher=1" : "";
			window.location.href = `${Z.returnUrl}&adapter=${encodeURIComponent(e.adapter || Z.adapter)}&mode=${encodeURIComponent(e.mode || "select")}&multiple=${+!!e.multiple}&selectionTarget=${encodeURIComponent(e.selectionTarget || "item")}&showContextResources=${+!!t}${n}${r}${i}${a}`;
		},
		registerView: (e) => r.register(e)
	}, C(Y).provide("browser", i).provide("resourceApi", e).provide("smartBrowserOptions", Z).provide("viewRegistry", r).provide("actionDriver", a).mount("#smartbrowser-app");
}
//#endregion
