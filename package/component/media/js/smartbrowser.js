import { A as e, B as t, C as n, D as r, F as i, G as a, I as o, J as s, L as c, M as l, N as u, P as d, S as f, T as p, V as m, X as h, Y as g, _, b as v, g as y, j as b, q as x, t as S, u as C, v as ee, w, x as T, y as E } from "./visual-runtime-BEbhjzcM.js?v=5.0.15";
import { a as D, i as O, o as k, s as A } from "./visual-runtime-DQsy__lt.js?v=5.0.15";
import { C as te, S as ne, T as re, _ as ie, a as ae, b as j, c as oe, d as se, f as ce, g as le, h as ue, i as de, l as fe, m as pe, n as me, p as he, r as ge, t as _e, u as M, v as ve, x as ye, y as N } from "./visual-runtime-NnvsnHf2.js?v=5.0.15";
import { t as be } from "./visual-runtime-CSXJ-t_P.js?v=5.0.15";
//#region resources/js/core/pickerViewport.js
function xe(e) {
	let t = e.ownerDocument.defaultView, n = t.innerHeight, r = 0, i = !1;
	for (let a = e.parentElement; a; a = a.parentElement) {
		let o = t.getComputedStyle(a), s = (parseFloat(o.paddingBottom) || 0) + (parseFloat(o.borderBottomWidth) || 0);
		if (a.matches("dialog, [data-sb-focus]")) {
			n = Math.min(t.innerHeight, a.getBoundingClientRect().bottom - s) - r, i = !0;
			break;
		}
		if (r += s + (parseFloat(o.marginBottom) || 0), n = t.innerHeight - r, a === e.ownerDocument.body) break;
	}
	return Math.max(0, n - e.getBoundingClientRect().top - (i ? 0 : t.scrollY));
}
function Se(e, t) {
	let n = e.querySelector(".resource-main > .resource-browser");
	if (!n || !t.length) return;
	let r = n.querySelector(":scope > .resource-browser-grid, :scope > .resource-details-view") || n, i = new Set(t), a = [...r.querySelectorAll("[data-sb-resource-key]")].filter((e) => i.has(e.dataset.sbResourceKey) && e.getClientRects().length);
	if (!a.length) return;
	let o = e.ownerDocument.defaultView, s = a[0].parentElement;
	for (; s && s !== n && !(/auto|scroll/.test(o.getComputedStyle(s).overflowY) && s.scrollHeight > s.clientHeight);) s = s.parentElement;
	if (!s) return;
	let c = s.getBoundingClientRect(), l = r.querySelector("thead"), u = l && o.getComputedStyle(l.querySelector("th")).position === "sticky" ? l.getBoundingClientRect().height : 0, d = c.top + s.clientTop + u, f = c.top + s.clientTop + s.clientHeight, p = e.querySelector(".sb-browser-messages #system-message-container");
	p?.children.length && p.getBoundingClientRect().height && (f = Math.min(f, p.getBoundingClientRect().top));
	let m = a.map((e) => e.getBoundingClientRect()), h = Math.min(...m.map((e) => e.top)), g = Math.max(...m.map((e) => e.bottom)), _ = g - h > f - d || h < d ? h - d : g > f ? g - f : 0;
	_ && (s.scrollTop += _);
}
//#endregion
//#region resources/js/core/displayMode.js
var Ce = [
	"normal",
	"wide",
	"focus"
], P = "smartbrowser.displayMode";
function we(e) {
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
function Te(e, t = () => {}) {
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
		if (!Ce.includes(l)) return;
		let d = n;
		if (c(), n = l, t(n), u) try {
			o?.setItem(P, n);
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
		if (n === "wide") {
			s(e, "data-sb-wide", "");
			for (let t = e.parentElement; t && t !== a.body && t !== a.documentElement; t = t.parentElement) s(t, "data-sb-wide-container", "");
		}
		if (n === "focus") {
			let t = we(e);
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
		let e = o?.getItem(P);
		Ce.includes(e) && e !== "normal" && l(e, !1);
	} catch {}
	return {
		get mode() {
			return n;
		},
		set: l,
		cycle: () => l(Ce[(Ce.indexOf(n) + 1) % 3]),
		destroy() {
			l("normal", !1), a.removeEventListener("keydown", u);
		}
	};
}
//#endregion
//#region resources/js/core/browserLayout.js
function Ee(e, t, n) {
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
			let t = we(e);
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
var De = { class: "sb-browser-heading" }, Oe = { class: "sb-browser-heading-leading" }, ke = [
	"disabled",
	"title",
	"aria-label"
], F = [
	"href",
	"title",
	"aria-label"
], Ae = { class: "sb-browser-heading-copy" }, I = {
	key: 1,
	class: "sb-browser-description"
}, L = { class: "sb-heading-controls" }, je = ["title", "aria-label"], R = [
	"href",
	"target",
	"rel",
	"title",
	"aria-label"
], z = ["title", "aria-label"], B = { class: "resource-action-label" }, Me = [
	"title",
	"aria-label",
	"disabled",
	"onClick"
], Ne = {
	key: 0,
	class: "resource-action-label"
}, Pe = [
	"aria-expanded",
	"title",
	"aria-label"
], Fe = { class: "resource-action-label" }, V = {
	key: 0,
	class: "resource-action-menu",
	role: "menu"
}, H = ["disabled", "onClick"], Ie = [
	"disabled",
	"title",
	"aria-label"
], U = { class: "resource-action-label" }, Le = {
	key: 3,
	class: "resource-filter-buttons"
}, Re = [
	"aria-expanded",
	"title",
	"aria-label"
], ze = { class: "resource-action-label" }, Be = {
	key: 0,
	class: "badge bg-primary"
}, Ve = ["disabled", "title"], W = [
	"title",
	"aria-label",
	"aria-pressed",
	"aria-busy",
	"disabled"
], He = ["aria-label"], G = {
	key: 1,
	class: "fas fa-layer-group",
	"aria-hidden": "true"
}, Ue = { class: "resource-action-label" }, We = {
	key: 0,
	class: "resource-action-filters"
}, Ge = ["value", "onChange"], Ke = ["value"], qe = {
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
		}, ae = E(() => (r.filters || []).filter((e) => String(r.filterValues[e.id] ?? e.default ?? "") !== String(e.default ?? "")).length), j = (e, t) => r.t(t.label), oe = E(() => {
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
		}, ce = E(() => oe.value.filter((e) => e.primary || e.creationRole || [
			"upload",
			"createNode",
			"createChild",
			"newArticle"
		].includes(e.id)).sort((e, t) => (se[e.creationRole] ?? 3) - (se[t.creationRole] ?? 3))), le = E(() => oe.value.filter((e) => !ce.value.includes(e))), ue = (e) => {
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
			v("header", De, [(d(), T(ee, {
				to: x(g) || "body",
				disabled: !x(g)
			}, [v("div", Oe, [
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
				], 8, ke)) : f("", !0),
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
				], 8, F)) : f("", !0),
				v("div", Ae, [x(p) ? f("", !0) : (d(), T(c(e.selectionMode ? "h2" : "h1"), {
					key: 0,
					class: "sb-browser-title"
				}, {
					default: m(() => [v("span", {
						class: s(e.headingIcon),
						"aria-hidden": "true"
					}, null, 2), w(" " + h(e.headingTitle), 1)]),
					_: 1
				})), e.headingSubtitle ? (d(), n("p", I, h(e.headingSubtitle), 1)) : f("", !0)])
			])], 8, ["to", "disabled"])), (d(), T(ee, {
				to: x(y) || "body",
				disabled: !x(y)
			}, [v("div", L, [
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
				], 8, je)) : f("", !0),
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
				}, null, -1)]], 8, R)) : f("", !0),
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
					v("span", B, h(e.t("JOPTION_NO_USER")), 1)
				], 8, z)) : f("", !0),
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
				}, null, 2), r.creationRole === "contextual" ? f("", !0) : (d(), n("span", Ne, h(e.t(r.label)), 1))], 10, Me))), 128)),
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
					v("span", Fe, h(e.t("COM_SMARTBROWSER_ACTIONS")), 1),
					r[19] ||= w(),
					r[20] ||= v("span", {
						class: "fas fa-angle-down",
						"aria-hidden": "true"
					}, null, -1)
				], 8, Pe), C.value ? (d(), n("div", V, [(d(!0), n(_, null, i(le.value, (r) => (d(), n("div", {
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
				}, null, 2), w(" " + h(e.t(r.label)), 1)], 10, H)]))), 128))])) : f("", !0)], 512)) : f("", !0),
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
					v("span", U, h(e.t("COM_SMARTBROWSER_BATCH")), 1)
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
					v("span", ze, h(e.t("COM_SMARTBROWSER_FILTER_OPTIONS")), 1),
					ae.value ? (d(), n("span", Be, h(ae.value), 1)) : f("", !0),
					v("span", {
						class: s(["fas fa-angle-down resource-filter-caret", { open: e.filtersOpen }]),
						"aria-hidden": "true"
					}, null, 2)
				], 10, Re), v("button", {
					type: "button",
					class: "btn resource-filter-clear",
					disabled: !ae.value,
					title: e.t("JCLEAR"),
					onClick: r[6] ||= (e) => t.$emit("clear-filters")
				}, h(e.t("JCLEAR")), 9, Ve)])) : f("", !0),
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
				}, null, 8, He)) : (d(), n("span", G)), v("span", Ue, h(e.t("COM_SMARTBROWSER_FLAT_VIEW")), 1)], 10, W)) : f("", !0)
			], 2),
			e.filters?.length && e.filtersOpen ? (d(), n("div", We, [(d(!0), n(_, null, i(e.filters, (r) => (d(), n("label", { key: r.id }, [v("span", null, h(e.t(r.label)), 1), r.type === "select" ? (d(), n("select", {
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
			}, h(j(r, e)), 9, Ke))), 128))], 40, Ge)) : f("", !0)]))), 128))])) : f("", !0)
		], 2)], 8, ["to", "disabled"]));
	}
}, Je = {
	class: "resource-breadcrumb",
	"aria-label": "Breadcrumb"
}, K = [
	"title",
	"aria-label",
	"onClick"
], Ye = {
	key: 1,
	class: "resource-breadcrumb-title"
}, q = {
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
		return (t, a) => (d(), n("nav", Je, [(d(!0), n(_, null, i(r.value, (r, i) => (d(), n("button", {
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
		}, null, 2)) : f("", !0), i !== 0 || !e.iconOnlyRoot ? (d(), n("span", Ye, h(r.title), 1)) : f("", !0)], 10, K))), 128))]));
	}
}, Xe = {
	class: "resource-toolbar",
	role: "toolbar"
}, J = { class: "resource-toolbar-primary" }, Ze = { class: "resource-view-controls" }, Qe = [
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
		return (t, r) => (d(), n("div", Xe, [v("div", J, [p(q, {
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
			e.reorderVisible ? (d(), T(j, {
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
			p(N, {
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
			u("dateField") && e.columns?.length ? (d(), T(ve, {
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
}, ut = ["aria-label"], dt = { class: "resource-tree-content" }, ft = ["open", "onToggle"], pt = ["onClick"], mt = {
	key: 0,
	class: "resource-adapter-roots"
}, ht = ["onClick"], Y = {
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
		}, [v("div", dt, [(d(!0), n(_, null, i(e.adapters, (r) => (d(), n("details", {
			key: r.id,
			class: "resource-adapter",
			open: r.id === e.activeAdapter,
			onToggle: (e) => o(e, r.id)
		}, [v("summary", { onClick: y((e) => c(r.id), ["prevent"]) }, [v("span", {
			class: s(r.icon),
			"aria-hidden": "true"
		}, null, 2), w(" " + h(r.title), 1)], 8, pt), r.id !== e.activeAdapter || m.value ? (d(), n("div", mt, [(d(!0), n(_, null, i(r.id === e.activeAdapter ? e.roots : [], (a) => (d(), n("section", {
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
		}, null, 2), v("span", null, h(a.title), 1)], 10, ht)), l(a) ? (d(), n("div", Y, [(d(!0), n(_, null, i(u(a), (r) => (d(), n("button", {
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
		}, [p(lt, { resource: e }, null, 8, ["resource"]), v("span", null, h(e.title), 1)], 12, _t))], 64))), 128))])) : f("", !0)], 2))), 128))])) : f("", !0)], 40, ft))), 128))])], 8, ut));
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
}, Ot = (e) => ({
	stateLabel: "status",
	width: "dimension",
	link: "url"
})[e.split(".").pop()] || e.split(".").pop();
function kt(e, t) {
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
			id: Ot(e),
			label: t,
			source: `metadata.${e}`,
			format: n
		}))
	], c = i.has("dates");
	for (let e of s) {
		if (!e.source || !e.label || e.source === "metadata.locationPath" || o === "articles" && e.source === "metadata.categoryPath") continue;
		let t = e.id || Ot(e.source);
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
var At = {
	key: 0,
	class: "smartbrowser-busy",
	role: "status",
	"aria-live": "polite"
}, jt = [
	"aria-pressed",
	"title",
	"aria-label"
], Mt = [
	"aria-pressed",
	"title",
	"aria-label"
], Nt = { class: "sb-tree-handle-rail" }, Pt = [
	"title",
	"aria-label",
	"aria-expanded",
	"aria-busy"
], Ft = {
	key: 0,
	class: "spinner-border spinner-border-sm",
	"aria-hidden": "true"
}, It = { class: "resource-main" }, Lt = ["aria-busy"], Rt = {
	key: 0,
	class: "resource-loader",
	role: "status",
	"aria-live": "polite"
}, zt = {
	key: 1,
	class: "resource-empty"
}, Bt = {
	key: 3,
	class: "resource-drop-overlay"
}, Vt = {
	key: 4,
	class: "sb-browser-info-rail"
}, Ht = { class: "resource-picker-collection-body" }, Ut = {
	__name: "SmartBrowserApp",
	setup(i) {
		let o = r("browser"), u = r("smartBrowserOptions"), _ = u.application === "site" && window.self === window.top, S = a("normal"), C = a(null), ee = a("620px"), ie = a(null), j = a(null), fe = a(null), me = a("0px"), ge = a("0px"), M, ve, N, Ce, P = () => {
			let e = C.value;
			e && (ee.value = `${xe(e)}px`, me.value = `${fe.value?.getBoundingClientRect().height || 0}px`, ge.value = `${j.value?.getBoundingClientRect().height || 0}px`);
		}, we, De = E(() => ({
			normal: "COM_SMARTBROWSER_DISPLAY_WIDE",
			wide: "COM_SMARTBROWSER_DISPLAY_FOCUS",
			focus: "COM_SMARTBROWSER_DISPLAY_NORMAL"
		})[S.value]), Oe = () => {
			S.value = we.cycle();
		};
		l(() => {
			M = document.getElementById("system-message-container"), j.value && M && !M.contains(C.value) && (ve = document.createComment("SmartBrowser message position"), M.before(ve), j.value.append(M)), _ && (we = Te(document.getElementById("smartbrowser-app"), (e) => {
				S.value = e;
			})), P(), N = new ResizeObserver(P), N.observe(C.value.parentElement), fe.value && N.observe(fe.value), j.value && N.observe(j.value);
			let e = C.value.closest("dialog");
			e && N.observe(e), Ce = Ee(C.value, () => ie.value?.element, u.nativeToolbarTarget), window.addEventListener("resize", P);
		}), t(S, () => e(P)), b(() => {
			ve?.parentNode && ve.replaceWith(M), N?.disconnect(), Ce?.(), window.removeEventListener("resize", P), we?.destroy();
		});
		let ke = r("actionDriver"), F = r("resourceApi"), Ae = r("viewRegistry"), { state: I, resources: L, bulkSelectableResources: je, selection: R, focusedResource: z, load: B, focus: Me, toggle: Ne, selectAll: Pe, invertSelection: Fe } = o;
		t(() => [
			I.revealIds,
			I.busy,
			I.loading,
			I.activeView
		], async () => {
			if (!I.revealIds?.length || I.busy || I.loading) return;
			let t = I.revealIds;
			await e(), await new Promise((e) => requestAnimationFrame(() => requestAnimationFrame(e))), !Y && C.value && t === I.revealIds && (Se(C.value, t), I.revealIds = []);
		});
		let V = u.mode === "select" ? u.pickerContext || u.selectionHost : u.selectionHost || null, H = !!V?.collectionMode, Ie = u.mode === "select" || !!V, U = (e) => Joomla.Text?._(e, e) || e, Le = E(() => U(u.adapters?.find((e) => e.id === u.adapter)?.title || u.adapters?.find((e) => e.id === u.adapter.replace(/^flat-/, ""))?.title || "COM_SMARTBROWSER_RESOURCE")), Re = /* @__PURE__ */ new Map(), ze = (e) => {
			let t = e?.selection?.adapter || e?.adapter;
			if (!t || t === u.adapter.replace(/^flat-/, "")) return ke;
			if (!Re.has(t)) {
				let e = new oe({
					...u,
					adapter: t,
					browseRoot: null,
					flatScope: null
				});
				Re.set(t, {
					api: e,
					driver: new be(e, I, async () => {
						await G?.refresh();
						for (let e of G?.browser.state.items || []) I.selectedResources[D(e)] = ue(e);
						await B();
					}, U, u.editorMode, u.application)
				});
			}
			return Re.get(t).driver.selectionHost = Xe, Re.get(t).driver;
		}, Be = (e) => e?.collectionActions || I.actions, Ve = (e, t) => Be(t).find((t) => t.id === e.id) || e, W = (e, t) => {
			if (!H || e.currentNode || !t.length) return ke.available(e, t);
			if (e.single && t.length !== 1) return !1;
			let n = (t) => (!t.collectionActions || t.collectionActions.some((t) => t.id === e.id)) && ze(t).available(Ve(e, t), [t]);
			return e.exclusiveGroup ? t.some(n) : t.every(n);
		}, He = async (e, t) => {
			if (!W(e, t)) return;
			if (!H || e.currentNode || !t.length) return ke.execute(e, t);
			let n = /* @__PURE__ */ new Map();
			for (let e of t) {
				let t = ze(e);
				n.has(t) || n.set(t, []), n.get(t).push(e);
			}
			for (let [t, r] of n) await t.execute(Ve(e, r[0]), r);
		};
		b(() => Re.forEach(({ api: e, driver: t }) => {
			t.destroy(), e.destroy();
		}));
		let G, Ue = !1, We = (e) => H ? e : {
			...e,
			selectionKey: void 0
		}, Ge = {
			referenceItems: !0,
			homogeneous: V?.homogeneous === !0,
			readOnly: !1,
			showCount: !1,
			selectionProfile: V?.selectionProfile || {},
			addressContract: V?.addressContract,
			adapter: u.adapter.replace(/^flat-/, ""),
			allowedAdapters: V?.allowedAdapters || (V?.collectionMode ? [] : [u.adapter.replace(/^flat-/, "")]),
			allowedResourceTypes: u.allowedResourceTypes,
			selectionTarget: u.selectionTarget,
			maxSelections: V?.maxSelections || 500,
			selectedResources: !0,
			informationPanel: !1,
			multiple: u.multiple,
			items: V?.getCollectionSnapshot?.().items || [],
			layout: "compact",
			allowRemove: !0,
			allowOrdering: u.multiple && V?.allowOrdering !== !1,
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
				t = We(t), I.selectedResources[D(t)] = t, I.focusedId = D(t);
			}
		}, Ke = /* @__PURE__ */ new Map();
		async function Je(e, t = {}) {
			let n = JSON.stringify([e.adapter, t.browseRoot || ""]);
			return Ke.has(n) || Ke.set(n, new oe({
				...u,
				adapter: e.adapter,
				mode: "select",
				browseRoot: t.browseRoot || null,
				flatScope: null
			})), (await Ke.get(n).collection([e.id])).resources[0];
		}
		let K = te({
			profile: V?.selectionProfile || {},
			initialUsage: V?.initialUsage || {},
			editors: V?.editors || {},
			resolveReference: Je
		}), Ye = () => I.selectedIds.flatMap((e) => {
			let t = R.value.find((t) => D(t) === e);
			if (t) return [{
				selection: k(t, u.adapter.replace(/^flat-/, "")),
				usage: K.get(t)
			}];
			let n = V?.getCollectionSnapshot?.().items.find((t) => O(t.selection) === e);
			return n ? [n] : [];
		}), q = () => {
			H && V.commitCollection?.({
				items: Ye(),
				resources: Object.fromEntries(R.value.map((e) => [D(e), e])),
				virtualResources: I.virtualResources
			});
		}, Xe = u.selectionState && (V || u.selectionHost) ? {
			editorContext: V?.selectionEditorContext || {},
			canAdd: (e, t) => o.canAddSelection(e, t),
			canCreate: (e) => o.canCreateSelectionResource(e),
			remove: (e) => {
				o.deleteVirtualResources(e), e.forEach((e) => K.forget(e)), J.value++, q(), u.selectionHost?.onChange?.({ items: Ye() });
			},
			replace: (e, t) => {
				let n = t ? { ...K.get(t) } : {}, r = o.replaceSelectionResource(e, t);
				for (let e of K.definitions(r)) Object.prototype.hasOwnProperty.call(n, e.key) && K.set(r, e.key, n[e.key]);
				return J.value++, q(), u.selectionHost?.onChange?.({ items: Ye() }), t && D(t) !== D(r) && K.forget(t), r;
			}
		} : null;
		ke.selectionHost = Xe, t(() => [I.selectedIds, I.selectedResources], q, {
			deep: !0,
			flush: "sync"
		}), b(q);
		let J = a(0);
		Ie && (G = _e({
			config: Ge,
			api: F,
			translate: U,
			notify: (e) => {
				Ue = !0;
				for (let t of e.items) {
					let n = e.resources.find((e) => D(e) === O(t.selection));
					if (n) for (let [e, r] of Object.entries(t.usage)) K.set(We(n), e, r);
				}
				I.selectedResources = Object.fromEntries(e.resources.map(We).map((e) => [D(e), ue(e)])), I.selectedIds = e.items.map((e) => H ? O(e.selection) : e.selection.id), J.value++, Ue = !1, q();
			}
		}), G.refresh().catch((e) => Joomla.renderMessages({ error: [e.message] })), t(() => [I.selectedIds, J.value], () => {
			Ue || G.setItems(Ye()).catch((e) => Joomla.renderMessages({ error: [e.message] }));
		}, {
			deep: !0,
			flush: "sync"
		}), b(() => G.destroy()));
		let Ze = a(V?.isMaximized?.() || !1), Qe = E(() => {
			if (V?.title) return V.title;
			let e = u.adapters?.find((e) => e.id === u.adapter) || u.adapters?.find((e) => e.id === u.adapter.replace(/^flat-/, ""));
			return `${U("COM_SMARTBROWSER_PICKER_SELECT_TITLE")} \u2014 ${U(e?.title || "COM_SMARTBROWSER_RESOURCE")}`;
		}), $e = a(0), et = a({}), tt = a(!1), nt = E(() => K.definitions(z.value).filter((e) => e.presentation !== "hidden")), rt = E(() => (J.value, K.get(z.value))), it = E(() => !!(V && Object.keys(V.selectionProfile || {}).length)), at = !!(V && Object.keys(V.selectionProfile || {}).length), ot = a(V?.initialInfoOpen === !0 || (typeof u.pickerRememberedInfo == "boolean" ? u.pickerRememberedInfo : Object.values(V?.selectionProfile || {}).some((e) => e !== !1 && e?.presentation !== "hidden") || I.showInfo)), st = E(() => at || V?.initialInfoOpen === !0 ? ot.value : I.showInfo), lt = () => {
			at || V?.initialInfoOpen === !0 ? (ot.value = !ot.value, I.showInfo = ot.value) : I.showInfo = !I.showInfo;
		}, ut = (e, t, n) => {
			e && !Y && (K.set(e, t, n), et.value = {
				...et.value,
				[D(e)]: {}
			}, J.value++, q());
		}, dt = (e, t) => ut(z.value, e, t), ft = E(() => {
			let e = z.value;
			return se({
				resource: e,
				overlayRegistry: V || window.SmartBrowserPicker,
				isReadOnly: !V || u.mode === "readonly",
				fieldElement: null,
				isCurrent: () => !Y && D(z.value) === D(e),
				getAddress: () => K.get(e)["ext.address"] ?? ne(e),
				getDefaultAddress: () => ne(e),
				resetAddress: () => ut(e, "ext.address", null),
				setAddress: (t) => ut(e, "ext.address", t),
				profile: V?.selectionProfile || {},
				values: rt.value,
				getValues: () => K.get(e),
				setValue: (t, n) => ut(e, t, n),
				refresh: () => B(),
				selectResource: (e) => window.SmartBrowserPicker.open(e)
			});
		}), pt = a(V?.previewActions || []), mt = V?.subscribePreviewActions?.((e) => {
			pt.value = e;
		});
		b(() => mt?.());
		let ht = E(() => pt.value.filter((e) => {
			try {
				return z.value && (!ft.value.isReadOnly || e.allowReadOnly === !0) && (!e.applies || e.applies(ft.value));
			} catch {
				return !1;
			}
		})), Y = !1;
		b(() => {
			Y = !0, Ke.forEach((e) => e.destroy());
		});
		let gt = Ae.all(), _t = E(() => Ae.get(I.activeView)), yt = a(!1), Tt = E(() => I.loading || yt.value), Et = async (t) => {
			if (!(I.activeView === t || I.loading || I.busy || yt.value)) {
				yt.value = !0;
				try {
					await e(), await new Promise((e) => requestAnimationFrame(() => requestAnimationFrame(e))), I.activeView = t, await e();
				} finally {
					yt.value = !1;
				}
			}
		}, Dt = a({}), Ot = ae({
			api: F,
			config: {
				...u,
				selectionProfile: V?.selectionProfile || {},
				addressContract: V?.addressContract
			}
		}), Ut = 0;
		t(() => [L.value, J.value], async () => {
			if (!V) return;
			let e = ++Ut, t = {};
			for (let e of L.value) try {
				t[D(e)] = await Ot.serialize({
					selection: k(e, u.adapter.replace(/^flat-/, "")),
					usage: K.get(e)
				}, e);
			} catch {
				t[D(e)] = "";
			}
			e === Ut && (Dt.value = t);
		}, { immediate: !0 }), b(() => {
			Ut++, Ot.destroy();
		});
		let Wt = E(() => V ? L.value.map((e) => ({
			...e,
			selectionAddress: Dt.value[D(e)] || ""
		})) : L.value), Gt = E(() => {
			let e = kt(I.presentation, u.adapter);
			return V && !e.some((e) => e.id === "selectionAddress") && e.push({
				id: "selectionAddress",
				source: "selectionAddress",
				label: "COM_SMARTBROWSER_URI",
				headerIcon: "fas fa-link",
				defaultVisible: !1
			}), e;
		}), Kt = E(() => Gt.value.filter((e) => e.id === "title" || e.id === "name" || (e.defaultVisible ? !I.hiddenColumns.includes(e.id) : I.shownColumns.includes(e.id)))), qt = (e) => {
			let t = Gt.value.find((t) => t.id === e);
			if (!t || ["title", "name"].includes(e)) return;
			let n = t.defaultVisible ? "hiddenColumns" : "shownColumns";
			I[n] = I[n].includes(e) ? I[n].filter((t) => t !== e) : [...I[n], e];
		}, Jt = a(!1), X = a(u.adapter.startsWith("flat-")), Z = a(null), Yt = a(!1), Xt = a(null), Zt = E(() => u.adapter === "media"), Qt = E(() => u.mode === "manage" && ["details", "grid"].includes(I.activeView) && I.presentation.orderingField && I.sortBy === I.presentation.orderingField && ["asc", "desc"].includes(I.sortDirection) && (u.adapter === "featured-articles" || String(I.filters.featured ?? "") !== "1")), $t = E(() => Qt.value && !I.busy && R.value.length > 0 && R.value.every((e) => e.capabilities?.reorder === !0)), en = async (e) => {
			if (!$t.value || !["up", "down"].includes(e)) return;
			let t = R.value.map((e) => e.id), n = I.focusedId;
			I.busy = !0;
			try {
				let r = I.sortDirection === "desc" ? e === "up" ? "down" : "up" : e;
				(await F.execute("reorder", t, { direction: r })).updated?.length && (await B(), I.selectedIds = t.filter((e) => L.value.some((t) => t.id === e)), I.focusedId = I.selectedIds.includes(n) ? n : I.selectedIds[0] || null);
			} catch (e) {
				Joomla.renderMessages({ error: [e.message] });
			} finally {
				I.busy = !1;
			}
		}, tn = u.adapter !== "featured-articles" && [
			"articles",
			"categories",
			"tags",
			"articles-by-tag",
			"menus",
			"users",
			"media"
		].includes(u.adapter.replace(/^flat-/, "")), Q = u.adapter.startsWith("flat-") || u.adapter === "featured-articles", $ = u.adapter.startsWith("flat-") ? new oe({
			...u,
			adapter: u.adapter.slice(5),
			browseRoot: u.flatTreeRoot || null,
			flatScope: null
		}) : null, nn = E(() => (u.adapters || []).filter((e) => (!$ || e.id !== u.adapter.slice(5)) && (!V?.allowedAdapters?.length || V.allowedAdapters.includes(e.id.replace(/^flat-/, "")))));
		t(X, async (e) => {
			if (!(e || !$ || Z.value || Yt.value)) {
				Yt.value = !0;
				try {
					let e = (await $.getResources("")).roots || [], t = u.flatTreeNode || e[0]?.id;
					Z.value = {
						...t ? await $.getResources(t) : {},
						roots: e
					};
				} catch (e) {
					Y || Joomla.renderMessages({ error: [e.message] });
				} finally {
					Yt.value = !1;
				}
			}
		}), b(() => $?.destroy());
		let rn = async (e) => {
			if (!$) return B(e);
			q(), await pn(xt(window.location.href, u.adapter.slice(5), e, u.flatTreeRoot || null));
		}, an = E(() => !Q || !u.flatBreadcrumb?.length || u.flatBreadcrumb.length === 1 ? I.breadcrumb : u.flatBreadcrumb), on = a(!1), sn = Object.fromEntries(Object.entries(u.gridWidths || {}).map(([e, t]) => [`--sb-grid-${e}`, `${t}px`])), cn = wt(u) ? bt(u.adapter, u.browseRoot, window.location.href, !0) : `supjx.smartbrowser.ui.picker.${encodeURIComponent(V?.viewPreferenceKey || u.viewPreferenceKey || "default")}.${u.adapter.replace(/^flat-/, "")}`, ln = (() => {
			try {
				return JSON.parse(A().getItem(cn) || "{}");
			} catch {
				return {};
			}
		})(), un = a(ln.filtersOpen === !0), dn = (e) => {
			ln = {
				...ln,
				filtersOpen: un.value,
				...e
			}, A().setItem(cn, JSON.stringify(ln));
		}, fn = () => {
			un.value = !un.value, dn({ filtersOpen: un.value });
		}, pn = async (t) => {
			on.value || (on.value = !0, I.loading = !0, await e(), await new Promise((e) => requestAnimationFrame(() => requestAnimationFrame(e))), window.location.assign(t));
		}, mn = () => {
			dn({ flat: !Q }), pn(Q ? St(window.location.href, u.browseRoot) : xt(window.location.href, u.adapter, I.selectedNode, u.browseRoot));
		}, hn = E(() => u.adapters?.find((e) => e.id === u.adapter)?.icon || u.adapters?.find((e) => e.id === u.adapter.replace(/^flat-/, ""))?.icon || "fas fa-list"), gn = E(() => u.adapters?.find((e) => e.id === u.adapter)?.nodeOpenIcon || {
			media: "fas fa-folder-open",
			articles: "fas fa-box-open",
			"flat-articles": "fas fa-box-open",
			categories: "fas fa-box-open",
			tags: "fas fa-tags",
			"articles-by-tag": "fas fa-tags",
			users: "fas fa-users-viewfinder",
			menus: "fas fa-diagram-successor",
			"featured-articles": "fas fa-star"
		}[u.adapter] || "fas fa-folder-open"), _n = [
			"sm",
			"md",
			"lg",
			"xl"
		], vn = async ({ selection: e, payload: t, resolve: n, reject: r }) => {
			try {
				let r = await F.execute("batch", e, t);
				if (r.download) {
					let e = atob(r.download.content), t = Uint8Array.from(e, (e) => e.charCodeAt(0)), n = URL.createObjectURL(new Blob([t], { type: "application/zip" })), i = document.createElement("a");
					i.href = n, i.download = r.download.name, i.click(), setTimeout(() => URL.revokeObjectURL(n), 6e4);
				}
				await B(), n(r);
			} catch (e) {
				r(e);
			}
		}, yn = async (e) => {
			if (tt.value || !e.length) return;
			tt.value = !0;
			let t = J.value, n;
			try {
				n = await K.validate(e);
			} finally {
				tt.value = !1;
			}
			if (Y || t !== J.value) return;
			if (et.value = n.errors, !n.valid) {
				Object.keys(n.profileErrors).length && Joomla.renderMessages({ error: [U("COM_SMARTBROWSER_USAGE_PROFILE_INVALID")] });
				let e = Object.keys(n.errors).find((e) => Object.keys(n.errors[e]).some((t) => !n.profileErrors[e]?.[t]));
				e && (I.focusedId = e, $e.value++, st.value || Joomla.renderMessages({ error: [U("COM_SMARTBROWSER_USAGE_INVALID")] }));
				return;
			}
			let r = {
				adapter: u.adapter.replace(/^flat-/, ""),
				mode: u.mode,
				resources: [...e]
			};
			H && (r.collectionItems = e.map((e) => ({
				selection: k(e, u.adapter.replace(/^flat-/, "")),
				usage: n.usage[D(e)] || {}
			}))), V && (r.pickerInstance = u.pickerInstance, r.usage = n.usage), document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r })), window.parent !== window && window.parent.document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r }));
		}, bn = (e) => {
			let t = _n.indexOf(I.viewOptions.gridSize);
			I.viewOptions.gridSize = _n[Math.max(0, Math.min(_n.length - 1, t + e))];
		}, xn = (e) => ce(e, u.mode, Be(e), W, u.selectionTarget || "both"), Sn = (e) => pe(e, u.mode, Be(e), W), Cn = (e) => he(e, u.mode, Be(e), W, u.selectionTarget || "both"), wn = (e, t) => !I.busy && (e.local ? t.every((t) => xn(t)?.id === e.id || Cn(t)?.id === e.id) : W(e, t)), Tn = (e) => {
			let t = xn(e);
			t && En(t, e);
		}, En = (e, t) => {
			if (e && t && wn(e, [t])) return e.id === "browseOpen" ? B(t.id) : e.id === "pickerSelect" ? H ? (I.selectedIds.includes(D(t)) || Ne(t, !0), yn(R.value)) : yn([t]) : He(e, [t]);
		}, Dn = (e) => {
			if (V?.allowedAdapters?.length && !V.allowedAdapters.includes(e.replace(/^flat-/, "")) || e === u.adapter) return;
			q();
			let t = new URL(window.location.href);
			t.searchParams.set("adapter", e), t.searchParams.delete("node"), t.searchParams.delete("browseRoot"), V?.initialBrowseRoot && e.replace(/^flat-/, "") === V.initialAdapter.replace(/^flat-/, "") && t.searchParams.set("browseRoot", V.initialBrowseRoot), t.searchParams.delete("initialResource"), t.searchParams.delete("flatScope"), window.location.href = t.toString();
		}, On = async ({ id: e, value: t }) => {
			if (I.filters[e] = t, e === "menu" && t && !u.browseRoot && u.adapter === "menus") {
				await B(`menu:${t}`);
				return;
			}
			if (e === "menu" && t && !u.browseRoot && u.adapter === "flat-menus") {
				let e = new URL(window.location.href);
				e.searchParams.set("flatScope", `menu:${t}`), e.searchParams.set("flatFromNode", `menu:${t}`), window.location.assign(e.toString());
				return;
			}
			await B(I.selectedNode);
		}, kn = async () => {
			(I.presentation.filters || []).forEach((e) => {
				I.filters[e.id] = e.default ?? "";
			}), await B(I.selectedNode);
		}, An = async (t) => {
			if (Q && u.flatBreadcrumb?.some((e) => e.id === t)) {
				if (t === u.flatBreadcrumb.at(-1)?.id) return;
				let e = new URL(window.location.href), n = e.searchParams.get("flatFromBrowseRoot") || (e.searchParams.has("flatFromAdapter") ? null : u.browseRoot);
				await pn(xt(window.location.href, u.adapter.replace(/^flat-/, ""), t, n));
				return;
			}
			if (Q && t === I.selectedNode && t === I.roots[0]?.id) {
				I.search = "", I.sortBy = u.defaultSortBy || "", I.sortDirection = u.defaultSortDirection || "";
				let t = Ct(window.location.href, u.flatRootNode);
				if (t !== window.location.href) {
					(I.presentation.filters || []).forEach((e) => {
						I.filters[e.id] = e.default ?? "";
					}), await e(), window.location.assign(t);
					return;
				}
				await kn();
				return;
			}
			await B(t);
		}, jn = (e) => {
			I.sortBy === e ? I.sortDirection === "asc" ? I.sortDirection = "desc" : (I.sortBy = "", I.sortDirection = "") : (I.sortBy = e, I.sortDirection = "asc");
		}, Mn = (e) => {
			I.sortBy = e, I.sortDirection = e ? I.sortDirection || "asc" : "";
		}, Nn = () => {
			let e = [
				"modified",
				"created",
				"both"
			], t = e.indexOf(I.viewOptions.detailsDateMode);
			I.viewOptions.detailsDateMode = e[(t + 1) % e.length];
		}, Pn = async (e) => {
			Jt.value = !1, Zt.value && await ke.uploadFiles(e.dataTransfer?.files);
		};
		return l(() => {
			if (Q && dn({ flat: !0 }), !Q && tn && ln.flat === !0) {
				window.location.replace(xt(window.location.href, u.adapter, I.selectedNode, u.browseRoot));
				return;
			}
			B(I.selectedNode).then(async () => {
				if (H) {
					let e = V.getCollectionSnapshot();
					try {
						let t = await F.collection(e.items, {
							referenceItems: !0,
							homogeneous: V.homogeneous
						});
						if (Y) return;
						if (I.selectedResources = Object.fromEntries(t.resources.map((e) => [D(e), ue(e)])), I.selectedIds = t.items.map((e) => O(e.selection)), I.focusedId = I.selectedIds.find((e) => L.value.some((t) => D(t) === e)) || I.selectedIds[0] || null, V.initialFocus) {
							let e = O(V.initialFocus);
							I.selectedIds.includes(e) && (I.focusedId = e);
						}
					} catch (e) {
						Y || Joomla.renderMessages({ error: [e.message] });
					}
				}
				if (!H && V?.initialSelection?.length && (!V.initialAdapter || V.initialAdapter.replace(/^flat-/, "") === u.adapter.replace(/^flat-/, ""))) {
					let e = V.initialSelection.map((e) => e && typeof e == "object" ? e.id : e);
					try {
						let t = await F.collection(u.multiple ? e : e.slice(0, 1));
						if (Y) return;
						let n = new Set(u.allowedResourceTypes || []), r = t.resources.filter((e) => !e.unavailable && le(e, u.selectionTarget) && (!n.size || n.has(e.type)));
						I.selectedIds = r.map((e) => e.id), I.selectedResources = Object.fromEntries(r.map((e) => [e.id, e])), I.focusedId = I.selectedIds[0] || null;
					} catch (e) {
						Y || Joomla.renderMessages({ error: [e.message] });
					}
				}
				u.adapter === "media" && u.initialResource && L.value.some((e) => e.id === u.initialResource) && (I.focusedId = D(L.value.find((e) => e.id === u.initialResource)));
			});
		}), (e, t) => (d(), n("div", {
			ref_key: "shellElement",
			ref: C,
			class: s(["smartbrowser-shell sb-redesigned-browser", {
				"is-site": x(u).application === "site",
				"is-picker": x(u).mode === "select" || !!x(V),
				"is-contained": x(u).mode === "select" || !!x(V) || S.value === "focus"
			}]),
			style: g({
				...x(sn),
				"--sb-browser-available-height": ee.value,
				"--sb-picker-footer-height": me.value,
				"--sb-picker-message-height": ge.value
			})
		}, [
			x(I).busy ? (d(), n("div", At, [t[14] ||= v("span", {
				class: "spinner-border",
				"aria-hidden": "true"
			}, null, -1), v("span", null, h(U("COM_SMARTBROWSER_WORKING")), 1)])) : f("", !0),
			p(qe, {
				ref_key: "browserHeader",
				ref: ie,
				"native-toolbar-target": x(u).nativeToolbarTarget,
				"heading-title": x(V) || x(u).mode === "select" ? Qe.value : Le.value,
				"heading-subtitle": x(V) || x(u).mode === "select" ? x(V)?.subtitle : x(u).browserDescription,
				"heading-icon": hn.value,
				actions: x(I).actions,
				available: (e) => W(e, x(R)),
				selection: x(R),
				"batch-available": x(u).mode === "manage",
				"can-cancel": typeof x(V)?.cancel == "function",
				"flat-available": x(tn),
				"flat-active": x(Q),
				"flat-busy": on.value,
				"filters-open": un.value,
				filters: x(I).presentation.filters,
				"filter-values": x(I).filters,
				"manager-url": x(u).managerUrl,
				"manager-new-tab": x(u).application === "site",
				"dashboard-url": x(u).dashboardUrl,
				integrated: x(u).integrated,
				"selection-mode": x(u).mode === "select",
				"allow-no-user": x(u).allowNoUser,
				"can-complete": x(R).length > 0 && !tt.value,
				"confirm-label": x(V)?.confirmLabel,
				t: U,
				onAction: t[1] ||= (e) => He(e, x(R)),
				onBatch: t[2] ||= (e) => Xt.value?.open(),
				onCancel: t[3] ||= (e) => x(V)?.cancel(),
				onToggleFlat: mn,
				onToggleFilters: fn,
				onFilter: On,
				onClearFilters: kn,
				onComplete: t[4] ||= (e) => yn(x(R)),
				onNoUser: t[5] ||= (e) => yn([{
					id: "user:0",
					type: "user",
					title: ""
				}])
			}, {
				"display-controls": m(() => [x(V)?.toggleSize ? (d(), n("button", {
					key: 0,
					type: "button",
					class: s(["resource-icon-button resource-display-toggle", { active: Ze.value }]),
					"aria-pressed": Ze.value,
					title: U(Ze.value ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE"),
					"aria-label": U(Ze.value ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE"),
					onClick: t[0] ||= (e) => Ze.value = x(V).toggleSize()
				}, [v("span", {
					class: s(Ze.value ? "fas fa-compress" : "fas fa-expand"),
					"aria-hidden": "true"
				}, null, 2)], 10, jt)) : f("", !0), x(_) ? (d(), n("button", {
					key: 1,
					type: "button",
					class: s(["resource-icon-button resource-display-toggle", { active: S.value !== "normal" }]),
					"aria-pressed": S.value !== "normal",
					title: U(De.value),
					"aria-label": U(De.value),
					onClick: Oe
				}, [v("span", {
					class: s(S.value === "normal" ? "fas fa-arrows-alt-h" : S.value === "wide" ? "fas fa-expand" : "fas fa-compress"),
					"aria-hidden": "true"
				}, null, 2)], 10, Mt)) : f("", !0)]),
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
				ref: Xt,
				selection: x(R),
				adapter: x(u).adapter,
				filters: x(I).presentation.filters,
				"batch-options": x(I).presentation.batchOptions,
				"sort-fields": x(I).presentation.sortFields,
				"ordering-available": Qt.value,
				t: U,
				onApply: vn
			}, null, 8, [
				"selection",
				"adapter",
				"filters",
				"batch-options",
				"sort-fields",
				"ordering-available"
			]),
			v("div", { class: s(["smartbrowser-layout", { "tree-collapsed": X.value }]) }, [
				!X.value && (!x($) || Z.value) ? (d(), T(vt, {
					key: 0,
					adapters: nn.value,
					"active-adapter": x(u).adapter,
					roots: Z.value?.roots || x(I).roots,
					nodes: Z.value?.nodes || x(I).nodes,
					breadcrumb: Z.value?.breadcrumb || x(I).breadcrumb,
					"selected-node": Z.value?.nodeId || x(I).selectedNode,
					t: U,
					onOpen: rn,
					onAdapter: Dn
				}, null, 8, [
					"adapters",
					"active-adapter",
					"roots",
					"nodes",
					"breadcrumb",
					"selected-node"
				])) : f("", !0),
				v("div", Nt, [v("button", {
					type: "button",
					class: "resource-sidebar-handle",
					title: U(X.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-label": U(X.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-expanded": !X.value,
					"aria-busy": Yt.value,
					onClick: t[6] ||= (e) => X.value = !X.value
				}, [Yt.value ? (d(), n("span", Ft)) : (d(), n("span", {
					key: 1,
					class: s(X.value ? "fas fa-chevron-right" : "fas fa-chevron-left"),
					"aria-hidden": "true"
				}, null, 2))], 8, Pt)]),
				v("main", It, [p(ct, {
					breadcrumb: an.value,
					root: x(I).roots[0],
					"root-icon": gn.value,
					"icon-only-root": an.value.length > 1,
					search: x(I).search,
					"sort-by": x(I).sortBy,
					"sort-direction": x(I).sortDirection,
					"sort-fields": x(I).presentation.sortFields,
					"ordering-field": x(I).presentation.orderingField,
					views: x(gt),
					"active-view": x(I).activeView,
					"grid-size": x(I).viewOptions.gridSize,
					"details-thumbnails": x(I).viewOptions.detailsThumbnails,
					"details-date-mode": x(I).viewOptions.detailsDateMode,
					columns: Gt.value,
					"hidden-columns": x(I).hiddenColumns,
					"shown-columns": x(I).shownColumns,
					"show-info": st.value,
					multiple: x(u).multiple,
					"can-invert": x(u).multiple && x(je).length > 0,
					"reorder-visible": Qt.value,
					"reorder-enabled": $t.value,
					t: U,
					onOpen: An,
					onInvertSelection: x(Fe),
					onReorder: en,
					onSearch: t[7] ||= (e) => x(I).search = e,
					onSortBy: Mn,
					onSortDirectionValue: t[8] ||= (e) => x(I).sortDirection = e,
					onResize: bn,
					onToggleThumbnails: t[9] ||= (e) => x(I).viewOptions.detailsThumbnails = !x(I).viewOptions.detailsThumbnails,
					onToggleDateField: Nn,
					onToggleColumn: qt,
					onView: Et,
					onInfo: lt
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
						loading: Tt.value,
						"is-dragging": Jt.value,
						"info-open": st.value,
						"usage-open": it.value
					}]),
					"aria-busy": Tt.value,
					onDragenter: t[11] ||= y((e) => Jt.value = Zt.value, ["prevent"]),
					onDragover: t[12] ||= y(() => {}, ["prevent"]),
					onDragleave: t[13] ||= y((e) => Jt.value = !1, ["self"]),
					onDrop: y(Pn, ["prevent"])
				}, [
					Tt.value ? (d(), n("div", Rt, [t[15] ||= v("span", {
						class: "spinner-border",
						"aria-hidden": "true"
					}, null, -1), v("span", null, h(U("COM_SMARTBROWSER_LOADING")), 1)])) : x(L).length ? (d(), T(c(_t.value.component), {
						key: 2,
						resources: Wt.value,
						"selected-ids": x(I).selectedIds,
						"focused-id": x(I).focusedId,
						"all-selected": x(je).length > 0 && x(je).every((e) => x(I).selectedIds.includes(x(D)(e))),
						options: x(I).viewOptions,
						"selection-controls": !x(V) || x(u).multiple !== !1,
						actions: x(I).actions,
						"action-available": wn,
						"default-action": xn,
						"preview-action": Sn,
						"modified-action": Cn,
						"sort-by": x(I).sortBy,
						"sort-direction": x(I).sortDirection,
						"sort-fields": x(I).presentation.sortFields,
						"ordering-field": x(I).presentation.orderingField,
						columns: Kt.value,
						"grid-fields": x(I).presentation.gridFields,
						t: U,
						onSelect: x(Ne),
						onFocus: x(Me),
						onSelectAll: x(Pe),
						onOpen: x(B),
						onActivate: Tn,
						onAction: En,
						onSort: jn
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
					])) : (d(), n("div", zt, [v("span", {
						class: s(x(I).search ? "fas fa-search" : Zt.value ? "fas fa-cloud-upload-alt" : hn.value),
						"aria-hidden": "true"
					}, null, 2), v("p", null, h(x(I).search ? U("COM_SMARTBROWSER_NO_RESULTS") : Zt.value ? U("COM_SMARTBROWSER_DROP_UPLOAD") : U("COM_SMARTBROWSER_EMPTY_STATE")), 1)])),
					Zt.value && Jt.value ? (d(), n("div", Bt, [t[16] ||= v("span", { class: "fas fa-cloud-upload-alt" }, null, -1), w(h(U("COM_SMARTBROWSER_DROP_UPLOAD")), 1)])) : f("", !0),
					st.value ? (d(), n("div", Vt, [p(ye, {
						resource: x(z),
						fields: x(z)?.collectionPresentation?.infoFields || x(I).presentation.infoFields,
						t: U,
						"usage-definitions": nt.value,
						"usage-values": rt.value,
						"usage-errors": et.value[x(D)(x(z))] || {},
						"usage-editors": x(V)?.editors,
						"resolve-reference": Je,
						"usage-revision": $e.value,
						"preview-actions": ht.value,
						"preview-context": ft.value,
						"can-preview": !!Sn(x(z)) && ze(x(z)).canPreview(x(z)) && !x(I).busy,
						onPreview: t[10] ||= (e) => En(Sn(x(z)), x(z)),
						onUsageChange: dt
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
				], 42, Lt)])
			], 2),
			x(Ie) ? (d(), n("div", {
				key: 1,
				ref_key: "messagesElement",
				ref: j,
				class: "sb-browser-messages"
			}, null, 512)) : f("", !0),
			x(Ie) ? (d(), n("details", {
				key: 2,
				ref_key: "pickerFooter",
				ref: fe,
				class: "resource-picker-collection"
			}, [v("summary", null, [
				t[17] ||= v("span", {
					class: "fas fa-chevron-up resource-picker-collection-chevron",
					"aria-hidden": "true"
				}, null, -1),
				w(h(U("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": ", 1),
				v("span", null, h(x(I).selectedIds.length), 1)
			]), v("div", Ht, [x(G) ? (d(), T(de, {
				key: 0,
				model: x(G),
				api: x(F),
				config: Ge,
				t: U
			}, null, 8, ["model", "api"])) : f("", !0)])], 512)) : f("", !0)
		], 6));
	}
}, Wt = "supjx.smartbrowser.preferencesResetToken";
function Gt(e, t) {
	if (!t || e.getItem(Wt) === t) return !1;
	let n = [];
	for (let t = 0; t < e.length; t++) {
		let r = e.key(t);
		r?.startsWith("supjx.smartbrowser.") && r !== Wt && r !== "supjx.smartbrowser.editorReturn" && n.push(r);
	}
	return n.forEach((t) => e.removeItem(t)), e.setItem(Wt, t), !0;
}
//#endregion
//#region resources/js/core/resetSessionNavigation.js
var Kt = "supjx.smartbrowser.";
function qt(e, t, n) {
	if (!n) return !1;
	let r = `${Kt}session.${t}`, i = e.getItem(r);
	if (e.setItem(r, n), !i || i === n) return !1;
	for (let t = 0; t < e.length; t++) {
		let n = e.key(t);
		if (!(!n?.startsWith(Kt) || n.startsWith(`${Kt}ui.`) || n.startsWith(`${Kt}session.`))) try {
			let t = JSON.parse(e.getItem(n));
			if (!t || typeof t != "object" || Array.isArray(t) || !("selectedNode" in t) && !("filters" in t)) continue;
			delete t.selectedNode, delete t.filters, e.setItem(n, JSON.stringify(t));
		} catch {}
	}
	return !0;
}
function Jt(e) {
	let t = new URL(e);
	if (t.searchParams.delete("node"), t.searchParams.has("flatFromAdapter")) {
		let e = t.searchParams.get("flatFromBrowseRoot");
		e ? t.searchParams.set("browseRoot", e) : t.searchParams.delete("browseRoot"), t.searchParams.delete("flatScope"), t.searchParams.delete("flatFromNode"), t.searchParams.delete("flatFromBrowseRoot"), t.searchParams.delete("flatFromAdapter");
	}
	return t.toString();
}
//#endregion
//#region resources/js/main.js
var X = Joomla.getOptions("com_smartbrowser", {}), Z = null;
try {
	Z = window.parent !== window && X.pickerInstance ? window.parent.SmartBrowserPicker?.context(X.pickerInstance, window) : null;
} catch {}
X.pickerContext = Z, Gt(window.sessionStorage, X.preferencesResetToken);
var Yt = qt(window.sessionStorage, X.application, X.csrfToken) ? Jt(window.location.href) : window.location.href;
if (Yt !== window.location.href) window.location.replace(Yt);
else {
	let e = new oe(X), t = Tt(X), n = new Et(A(), t);
	Z && (X.pickerRememberedInfo = n.load({}).showInfo);
	let r = me().register({
		id: "grid",
		label: "COM_SMARTBROWSER_GRID",
		icon: "fas fa-th",
		component: M,
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
		options: X,
		api: e,
		persistence: n,
		viewRegistry: r
	}), a = new be(e, i.state, () => i.load(), (e) => Joomla.Text?._(e, e) || e, X.editorMode, X.application);
	window.SmartBrowser = {
		...window.SmartBrowser,
		open(e = {}) {
			let t = e.showContextResources ?? X.showContextResources ?? !1, n = e.browseRoot ? `&browseRoot=${encodeURIComponent(e.browseRoot)}` : "", r = e.defaultView ? `&defaultView=${encodeURIComponent(e.defaultView)}` : "", i = e.allowedResourceTypes?.length ? `&allowedResourceTypes=${encodeURIComponent(e.allowedResourceTypes.join(","))}` : "", a = e.showAdapterSwitcher ? "&showAdapterSwitcher=1" : "";
			window.location.href = `${X.returnUrl}&adapter=${encodeURIComponent(e.adapter || X.adapter)}&mode=${encodeURIComponent(e.mode || "select")}&multiple=${+!!e.multiple}&selectionTarget=${encodeURIComponent(e.selectionTarget || "item")}&showContextResources=${+!!t}${n}${r}${i}${a}`;
		},
		registerView: (e) => r.register(e)
	}, C(Ut).provide("browser", i).provide("resourceApi", e).provide("smartBrowserOptions", X).provide("viewRegistry", r).provide("actionDriver", a).mount("#smartbrowser-app");
}
//#endregion
