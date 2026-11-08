import { B as e, C as t, D as n, E as r, I as i, M as a, O as o, R as s, S as c, T as l, V as u, c as d, d as f, f as p, g as m, h, j as g, l as _, m as v, p as y, s as b, t as x, u as S, v as C, w, x as T, z as E } from "./visual-runtime-CJIQlqNK.js?v=6.0.0";
import { t as D } from "./visual-runtime-9kQymmoE.js?v=6.0.0";
import { a as O, i as k, n as ee, r as A } from "./visual-runtime-rMzcxeX1.js?v=6.0.0";
import { t as te } from "./visual-runtime-gxqZ9DlQ.js?v=6.0.0";
import { C as ne, S as re, T as ie, _ as ae, a as oe, b as se, c as ce, d as le, f as ue, g as de, h as fe, i as pe, l as me, m as he, n as ge, p as _e, r as ve, t as ye, u as be, v as xe, x as Se, y as j } from "./visual-runtime-B0C71vnA.js?v=6.0.0";
import { a as M, i as Ce, o as we } from "./visual-runtime-RVfXtehh.js?v=6.0.0";
import { t as Te } from "./visual-runtime-OkZmZGOK.js?v=6.0.0";
import { t as Ee } from "./visual-runtime-CMW4NWo-.js?v=6.0.0";
//#region resources/js/core/pickerViewport.js
function De(e) {
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
function Oe(e, t) {
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
var N = [
	"normal",
	"wide",
	"focus"
], ke = "smartbrowser.displayMode";
function P(e) {
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
function Ae(e, t = () => {}) {
	let n = "normal", r = [], i = null, a = null, o = e.ownerDocument, s;
	try {
		s = D(o.defaultView);
	} catch {}
	let c = (e, t, n) => {
		let i = e.getAttribute(t);
		i !== n && (e.setAttribute(t, n), r.push(() => i === null ? e.removeAttribute(t) : e.setAttribute(t, i)));
	}, l = () => {
		a = null, i &&= (i.replaceWith(e), null), r.reverse().forEach((e) => e()), r = [];
	}, u = (u, d = !0) => {
		if (!N.includes(u)) return;
		let f = n;
		if (l(), n = u, t(n), d) try {
			s?.setItem(ke, n);
		} catch {}
		let p = new CustomEvent("smartbrowser:display-mode", {
			bubbles: !0,
			cancelable: !0,
			detail: {
				mode: n,
				previous: f,
				container: e
			}
		});
		if (!e.dispatchEvent(p)) return n;
		if (n === "wide") {
			let t = [], n = o.defaultView;
			for (let r = e.parentElement; r && r !== o.body && r !== o.documentElement; r = r.parentElement) {
				let e = n.getComputedStyle && ["grid", "inline-grid"].includes(n.getComputedStyle(r.parentElement).display);
				t.push({
					element: r,
					gridItem: e
				});
			}
			c(e, "data-sb-wide", "");
			for (let { element: e, gridItem: n } of t) c(e, "data-sb-wide-container", ""), n && c(e, "data-sb-wide-grid-item", "");
			a = () => {
				if (n.getComputedStyle) for (let { element: e } of [...t].reverse()) {
					let t = n.getComputedStyle(e), r = n.getComputedStyle(e.parentElement);
					["grid", "inline-grid"].includes(r.display) && c(e, "data-sb-wide-grid-item", "");
					let i = (e) => parseFloat(e) || 0, a = [i(t.marginLeft), i(t.marginRight)], o = e.computedStyleMap?.(), s = (e, t) => o ? String(o.get("margin-" + e)) === "auto" ? 0 : Math.min(0, a[t]) : a.every((e) => e < 0) ? a[t] : 0, l = e.parentElement.clientWidth - i(r.paddingLeft) - i(r.paddingRight) - s("left", 0) - s("right", 1);
					l > 0 && Math.abs(e.getBoundingClientRect().width - l) > 1 && c(e, "data-sb-wide-sizing", "");
				}
			}, a();
		}
		if (n === "focus") {
			let t = P(e);
			if (t) {
				let n = e.getAttribute("style");
				for (let [n, r] of Object.entries(t)) e.style.setProperty(`--sb-focus-background-${n}`, r);
				r.push(() => n === null ? e.removeAttribute("style") : e.setAttribute("style", n));
			}
			i = o.createComment("SmartBrowser display position"), e.replaceWith(i), o.body.appendChild(e), c(e, "data-sb-focus", ""), c(o.body, "data-sb-focus-page", "");
			for (let t of o.body.children) t !== e && t.tagName !== "DIALOG" && c(t, "inert", "");
		}
		return n;
	}, d = (t) => {
		t.key === "Escape" && !t.defaultPrevented && n !== "normal" && !o.querySelector("dialog[open]") && (u("normal"), e.querySelector(".resource-display-toggle")?.focus());
	};
	o.addEventListener("keydown", d);
	let f = () => a?.();
	o.defaultView.addEventListener?.("resize", f);
	try {
		let e = s?.getItem(ke);
		N.includes(e) && e !== "normal" && u(e, !1);
	} catch {}
	return {
		get mode() {
			return n;
		},
		set: u,
		cycle: () => u(N[(N.indexOf(n) + 1) % 3]),
		destroy() {
			u("normal", !1), o.removeEventListener("keydown", d), o.defaultView.removeEventListener?.("resize", f);
		}
	};
}
//#endregion
//#region resources/js/core/browserLayout.js
function je(e, t, n) {
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
			let t = P(e);
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
		g("--sb-tree-height", Math.max(0, i.innerHeight - m));
		let v = e.querySelector(".resource-pagination"), b = v?.getBoundingClientRect().height || 0;
		g("--sb-pagination-height", b);
		let x = e.querySelector(".resource-picker-collection")?.getBoundingClientRect().height || 0;
		g("--sb-pagination-message-offset", o && v ? Math.max(0, e.getBoundingClientRect().bottom - v.getBoundingClientRect().top - x) : 0);
		let S = v?.closest(".resource-sidebar");
		if (S && !o) {
			let e = S.getBoundingClientRect(), t = Math.max(m, e.top), n = Math.min(i.innerHeight, e.bottom);
			g("--sb-pagination-tree-height", Math.max(0, n - t - b)), g("--sb-pagination-top", Math.max(t, n - b));
		}
		g("--sb-info-height", o && e.querySelector(".resource-main > .resource-browser")?.clientHeight || Math.max(0, i.innerHeight - _));
		let C = e.querySelector(".sb-tree-handle-rail")?.getBoundingClientRect(), w = Math.max(m, C?.top ?? m), T = Math.min(i.innerHeight, C?.bottom ?? i.innerHeight);
		g("--sb-tree-handle-top", w + Math.max(0, (T - w - 54) / 2));
	}, v = () => {
		o || (i.cancelAnimationFrame(a), a = i.requestAnimationFrame(_));
	}, y = new i.ResizeObserver(v);
	return [
		r.body,
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
var Me = { class: "sb-browser-heading" }, Ne = { class: "sb-browser-heading-leading" }, Pe = [
	"disabled",
	"title",
	"aria-label"
], Fe = [
	"href",
	"title",
	"aria-label"
], F = { class: "sb-browser-heading-copy" }, Ie = {
	key: 1,
	class: "sb-browser-description"
}, I = { class: "sb-heading-controls" }, L = ["title", "aria-label"], Le = [
	"href",
	"target",
	"rel",
	"title",
	"aria-label"
], R = ["title", "aria-label"], z = { class: "resource-action-label" }, B = [
	"title",
	"aria-label",
	"disabled",
	"onClick"
], Re = {
	key: 0,
	class: "resource-action-label"
}, ze = [
	"aria-expanded",
	"title",
	"aria-label"
], Be = { class: "resource-action-label" }, Ve = {
	key: 0,
	class: "resource-action-menu",
	role: "menu"
}, V = ["disabled", "onClick"], H = [
	"disabled",
	"title",
	"aria-label"
], He = { class: "resource-action-label" }, U = {
	key: 3,
	class: "resource-filter-buttons"
}, Ue = [
	"aria-expanded",
	"title",
	"aria-label"
], We = { class: "resource-action-label" }, Ge = {
	key: 0,
	class: "badge bg-primary"
}, Ke = ["disabled", "title"], qe = [
	"title",
	"aria-label",
	"aria-pressed",
	"aria-busy",
	"disabled"
], Je = ["aria-label"], Ye = {
	key: 1,
	class: "fas fa-layer-group",
	"aria-hidden": "true"
}, Xe = { class: "resource-action-label" }, W = {
	key: 0,
	class: "resource-action-filters"
}, Ze = ["value", "onChange"], Qe = ["value"], $e = {
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
	setup(e, { expose: m }) {
		let g = e, b = g.nativeToolbarTarget ? document.querySelector(g.nativeToolbarTarget) : null, x = b?.parentElement.querySelector("#sb-native-intro"), C = b?.parentElement.querySelector("#sb-native-manager"), T = b?.parentElement.querySelector("#sb-native-preferences"), D = i(null);
		m({ element: D });
		let O = i(!1), k = i(null), ee = i(null), A, te = 0, ne = 0, re = () => {
			let e = ee.value;
			if (!e) return;
			e.classList.remove("is-compact-1", "is-compact-2", "is-compact-3", "is-compact-4");
			let t = () => {
				let t = getComputedStyle(e), n = parseFloat(t.columnGap) || 0, r = (parseFloat(t.paddingInlineStart) || 0) + (parseFloat(t.paddingInlineEnd) || 0), i = [...e.children].filter((e) => getComputedStyle(e).display !== "none");
				return i.reduce((e, t) => e + t.getBoundingClientRect().width, r + n * Math.max(0, i.length - 1)) <= e.clientWidth + 1;
			};
			for (let n = 1; n <= 4 && !t(); n += 1) e.classList.add(`is-compact-${n}`);
		}, ie = () => {
			cancelAnimationFrame(te), te = requestAnimationFrame(() => {
				re(), ae();
			});
		}, ae = () => {
			let e = b?.parentElement, t = e?.querySelector(".sb-options-icon"), n = t?.querySelector(".sb-options-label");
			if (!n || (t.classList.remove("is-expanded"), e.clientWidth < 640)) return;
			let r = getComputedStyle(e), i = [...e.children].filter((e) => e !== b && e !== x && getComputedStyle(e).display !== "none"), a = i.reduce((e, n) => {
				let r = getComputedStyle(n);
				return e + n.getBoundingClientRect().width + (n === t ? 0 : (parseFloat(r.marginInlineStart) || 0) + (parseFloat(r.marginInlineEnd) || 0));
			}, 240 + (parseFloat(r.columnGap) || 0) * i.length + (parseFloat(r.paddingInlineStart) || 0) + (parseFloat(r.paddingInlineEnd) || 0)), o = document.createElement("canvas").getContext("2d");
			o.font = getComputedStyle(n).font, a + o.measureText(n.textContent).width + 8 + 24 <= e.clientWidth && t.classList.add("is-expanded");
		}, oe = S(() => (g.filters || []).filter((e) => String(g.filterValues[e.id] ?? e.default ?? "") !== String(e.default ?? "")).length), se = (e, t) => g.t(t.label), ce = S(() => {
			let e = /* @__PURE__ */ new Set(), t = [], n = g.filterValues?.state === "trashed" || g.selection?.length && g.selection.every((e) => e.status === -2), r = g.actions.filter((e) => (e.id !== "checkin" || g.available(e)) && !(e.id === "trash" && n) && (!e.trashedOnly || g.filterValues?.state === "trashed" || g.selection?.some((e) => e.status === -2)));
			return r.forEach((n) => {
				if (!n.exclusiveGroup) {
					t.push(n);
					return;
				}
				if (e.has(n.exclusiveGroup)) return;
				e.add(n.exclusiveGroup);
				let i = r.filter((e) => e.exclusiveGroup === n.exclusiveGroup), a = i.filter((e) => g.available(e)), o = g.selection?.length === 1 ? g.selection[0].overlays?.find((e) => i.some((t) => t.id === e.action))?.action : null;
				t.push(...a.length ? a : [i.find((e) => e.id === o) || i[0]]);
			}), t;
		}), le = {
			item: 0,
			node: 1,
			contextual: 2
		}, ue = S(() => ce.value.filter((e) => e.primary || e.creationRole || [
			"upload",
			"createNode",
			"createChild",
			"newArticle"
		].includes(e.id)).sort((e, t) => (le[e.creationRole] ?? 3) - (le[t.creationRole] ?? 3))), de = S(() => ce.value.filter((e) => !ue.value.includes(e))), fe = (e) => {
			k.value?.contains(e.target) || (O.value = !1);
		}, pe = (e) => {
			e.key === "Escape" && (O.value = !1);
		};
		return t(() => {
			document.addEventListener("click", fe), document.addEventListener("keydown", pe), A = new ResizeObserver(([e]) => {
				e.contentRect.width !== ne && (ne = e.contentRect.width, ie());
			}), A.observe(ee.value), b && (A.observe(b), A.observe(b.parentElement)), document.fonts?.ready.then(ie), ie();
		}), w(ie), c(() => {
			document.removeEventListener("click", fe), document.removeEventListener("keydown", pe), A?.disconnect(), cancelAnimationFrame(te);
		}), (t, i) => (l(), p(_, {
			to: s(b) || "body",
			disabled: !s(b)
		}, [f("div", {
			ref_key: "headerElement",
			ref: D,
			class: E(["resource-actions-area sb-browser-header", { "is-native-header": !!s(b) }])
		}, [
			f("header", Me, [(l(), p(_, {
				to: s(x) || "body",
				disabled: !s(x)
			}, [f("div", Ne, [
				e.selectionMode ? (l(), v("button", {
					key: 0,
					type: "button",
					class: "btn btn-primary resource-picker-select",
					disabled: !e.canComplete,
					title: e.confirmLabel || e.t("COM_SMARTBROWSER_SELECT"),
					"aria-label": e.confirmLabel || e.t("COM_SMARTBROWSER_SELECT"),
					onClick: i[0] ||= (e) => t.$emit("complete")
				}, [
					i[8] ||= f("span", {
						class: "fas fa-check",
						"aria-hidden": "true"
					}, null, -1),
					i[9] ||= h(),
					f("span", null, u(e.confirmLabel || e.t("COM_SMARTBROWSER_SELECT")), 1)
				], 8, Pe)) : y("", !0),
				e.dashboardUrl ? (l(), v("a", {
					key: 1,
					class: "btn resource-dashboard-link",
					href: e.dashboardUrl,
					title: e.t(e.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD"),
					"aria-label": e.t(e.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD")
				}, [
					i[10] ||= f("span", {
						class: "fas fa-arrow-left",
						"aria-hidden": "true"
					}, null, -1),
					i[11] ||= h(),
					f("span", null, u(e.t(e.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD")), 1)
				], 8, Fe)) : y("", !0),
				f("div", F, [s(b) ? y("", !0) : (l(), p(o(e.selectionMode ? "h2" : "h1"), {
					key: 0,
					class: "sb-browser-title"
				}, {
					default: a(() => [f("span", {
						class: E(e.headingIcon),
						"aria-hidden": "true"
					}, null, 2), h(" " + u(e.headingTitle), 1)]),
					_: 1
				})), e.headingSubtitle ? (l(), v("p", Ie, u(e.headingSubtitle), 1)) : y("", !0)])
			])], 8, ["to", "disabled"])), (l(), p(_, {
				to: s(C) || "body",
				disabled: !s(C)
			}, [f("div", I, [
				e.canCancel ? (l(), v("button", {
					key: 0,
					type: "button",
					class: "btn btn-danger resource-picker-cancel",
					title: e.t("JCANCEL"),
					"aria-label": e.t("JCANCEL"),
					onClick: i[1] ||= (e) => t.$emit("cancel")
				}, [
					i[12] ||= f("span", {
						class: "fas fa-times",
						"aria-hidden": "true"
					}, null, -1),
					i[13] ||= h(),
					f("span", null, u(e.t("JCANCEL")), 1)
				], 8, L)) : y("", !0),
				(l(), p(_, {
					to: s(T) || "body",
					disabled: !s(T)
				}, [n(t.$slots, "preferences")], 8, ["to", "disabled"])),
				e.managerUrl ? (l(), v("a", {
					key: 1,
					class: "btn resource-manager-link",
					href: e.managerUrl,
					target: e.managerNewTab ? "_blank" : void 0,
					rel: e.managerNewTab ? "noopener noreferrer" : void 0,
					title: e.t("COM_SMARTBROWSER_OPEN_JOOMLA_MANAGER"),
					"aria-label": e.t("COM_SMARTBROWSER_OPEN_JOOMLA_MANAGER")
				}, [...i[14] ||= [f("span", {
					class: "fab fa-joomla",
					"aria-hidden": "true"
				}, null, -1)]], 8, Le)) : y("", !0),
				n(t.$slots, "display-controls")
			])], 8, ["to", "disabled"]))]),
			f("div", {
				ref_key: "actionRow",
				ref: ee,
				class: E(["resource-actions", { "has-native-toolbar": !!s(b) }])
			}, [
				e.allowNoUser ? (l(), v("button", {
					key: 0,
					type: "button",
					class: "btn btn-outline-secondary",
					title: e.t("JOPTION_NO_USER"),
					"aria-label": e.t("JOPTION_NO_USER"),
					onClick: i[2] ||= (e) => t.$emit("no-user")
				}, [
					i[15] ||= f("span", {
						class: "fas fa-user",
						"aria-hidden": "true"
					}, null, -1),
					i[16] ||= h(),
					f("span", z, u(e.t("JOPTION_NO_USER")), 1)
				], 8, R)) : y("", !0),
				(l(!0), v(d, null, r(ue.value, (n) => (l(), v("button", {
					key: n.id,
					type: "button",
					class: E(["btn btn-outline-secondary", [`resource-action-${n.id}`, {
						"resource-action-create": n.creationRole ? n.creationRole === "item" : n.primary && [
							"upload",
							"createNode",
							"createChild",
							"newArticle",
							"newUser"
						].includes(n.id),
						"resource-contextual-add": n.creationRole === "contextual",
						"is-destructive": [
							"delete",
							"trash",
							"remove"
						].includes(n.id)
					}]]),
					title: e.t(n.label),
					"aria-label": e.t(n.label),
					disabled: !e.available(n),
					onClick: (e) => t.$emit("action", n)
				}, [f("span", {
					class: E(n.icon),
					"aria-hidden": "true"
				}, null, 2), n.creationRole === "contextual" ? y("", !0) : (l(), v("span", Re, u(e.t(n.label)), 1))], 10, B))), 128)),
				de.value.length ? (l(), v("div", {
					key: 1,
					ref_key: "actionMenu",
					ref: k,
					class: "resource-action-menu-wrap"
				}, [f("button", {
					type: "button",
					class: "btn btn-outline-secondary resource-action-menu-toggle",
					"aria-expanded": O.value,
					title: e.t("COM_SMARTBROWSER_ACTIONS"),
					"aria-label": e.t("COM_SMARTBROWSER_ACTIONS"),
					onClick: i[3] ||= (e) => O.value = !O.value
				}, [
					i[17] ||= f("span", {
						class: "fas fa-ellipsis-h",
						"aria-hidden": "true"
					}, null, -1),
					i[18] ||= h(),
					f("span", Be, u(e.t("COM_SMARTBROWSER_ACTIONS")), 1),
					i[19] ||= h(),
					i[20] ||= f("span", {
						class: "fas fa-angle-down",
						"aria-hidden": "true"
					}, null, -1)
				], 8, ze), O.value ? (l(), v("div", Ve, [(l(!0), v(d, null, r(de.value, (n) => (l(), v("div", {
					key: n.id,
					class: "resource-action-menu-item",
					role: "none"
				}, [f("button", {
					type: "button",
					role: "menuitem",
					class: E([`resource-action-${n.id}`, { "is-destructive": [
						"delete",
						"trash",
						"remove"
					].includes(n.id) }]),
					disabled: !e.available(n),
					onClick: (e) => {
						O.value = !1, t.$emit("action", n);
					}
				}, [f("span", {
					class: E(n.icon),
					"aria-hidden": "true"
				}, null, 2), h(" " + u(e.t(n.label)), 1)], 10, V)]))), 128))])) : y("", !0)], 512)) : y("", !0),
				e.batchAvailable ? (l(), v("button", {
					key: 2,
					type: "button",
					class: "btn btn-outline-secondary resource-batch-toggle",
					disabled: !e.selection?.length,
					title: e.t("COM_SMARTBROWSER_BATCH_ACTIONS"),
					"aria-label": e.t("COM_SMARTBROWSER_BATCH_ACTIONS"),
					onClick: i[4] ||= (e) => t.$emit("batch")
				}, [
					i[21] ||= f("span", {
						class: "fas fa-magic",
						"aria-hidden": "true"
					}, null, -1),
					i[22] ||= h(),
					f("span", He, u(e.t("COM_SMARTBROWSER_BATCH")), 1)
				], 8, H)) : y("", !0),
				e.filters?.length ? (l(), v("div", U, [f("button", {
					type: "button",
					class: E(["btn resource-filter-toggle", { active: e.filtersOpen }]),
					"aria-expanded": e.filtersOpen,
					title: e.t("COM_SMARTBROWSER_FILTER_OPTIONS"),
					"aria-label": e.t("COM_SMARTBROWSER_FILTER_OPTIONS"),
					onClick: i[5] ||= (e) => t.$emit("toggle-filters")
				}, [
					i[23] ||= f("span", {
						class: "fas fa-filter",
						"aria-hidden": "true"
					}, null, -1),
					i[24] ||= h(),
					f("span", We, u(e.t("COM_SMARTBROWSER_FILTER_OPTIONS")), 1),
					oe.value ? (l(), v("span", Ge, u(oe.value), 1)) : y("", !0),
					f("span", {
						class: E(["fas fa-angle-down resource-filter-caret", { open: e.filtersOpen }]),
						"aria-hidden": "true"
					}, null, 2)
				], 10, Ue), f("button", {
					type: "button",
					class: "btn resource-filter-clear",
					disabled: !oe.value,
					title: e.t("JCLEAR"),
					onClick: i[6] ||= (e) => t.$emit("clear-filters")
				}, u(e.t("JCLEAR")), 9, Ke)])) : y("", !0),
				e.flatAvailable ? (l(), v("button", {
					key: 4,
					type: "button",
					class: E(["btn resource-flat-toggle", { active: e.flatActive }]),
					title: e.t("COM_SMARTBROWSER_FLAT_VIEW"),
					"aria-label": e.t("COM_SMARTBROWSER_FLAT_VIEW"),
					"aria-pressed": e.flatActive,
					"aria-busy": e.flatBusy,
					disabled: e.flatBusy,
					onClick: i[7] ||= (e) => t.$emit("toggle-flat")
				}, [e.flatBusy ? (l(), v("span", {
					key: 0,
					class: "spinner-border spinner-border-sm",
					role: "status",
					"aria-label": e.t("COM_SMARTBROWSER_WORKING")
				}, null, 8, Je)) : (l(), v("span", Ye)), f("span", Xe, u(e.t("COM_SMARTBROWSER_FLAT_VIEW")), 1)], 10, qe)) : y("", !0)
			], 2),
			e.filters?.length && e.filtersOpen ? (l(), v("div", W, [(l(!0), v(d, null, r(e.filters, (n) => (l(), v("label", { key: n.id }, [f("span", null, u(e.t(n.label)), 1), n.type === "select" ? (l(), v("select", {
				key: 0,
				class: "form-select",
				value: e.filterValues[n.id] ?? n.default,
				onChange: (e) => t.$emit("filter", {
					id: n.id,
					value: e.target.value
				})
			}, [(l(!0), v(d, null, r(n.options, (e) => (l(), v("option", {
				key: e.value,
				value: e.value
			}, u(se(n, e)), 9, Qe))), 128))], 40, Ze)) : y("", !0)]))), 128)), n(t.$slots, "filters")])) : y("", !0)
		], 2)], 8, ["to", "disabled"]));
	}
};
//#endregion
//#region resources/js/core/nodeHistory.js
function et(e, t, n = "") {
	let r;
	try {
		r = JSON.parse(e.getItem(t) || "{}");
	} catch {}
	r = {
		...r,
		trail: Array.isArray(r?.trail) ? r.trail.slice(-10) : [],
		cursor: Number.isInteger(r?.cursor) ? r.cursor : -1
	};
	let i = (e) => e && typeof e.id == "string" && typeof e.title == "string" && (!n || e.id === n || e.parents?.includes(n));
	r.trail = r.trail.filter(i), r.cursor = Math.min(r.cursor, r.trail.length - 1);
	let a = r.previousId || r.trail[r.cursor - 1]?.id, o = () => {
		for (; r.trail.length > 1 && new TextEncoder().encode(JSON.stringify(r.trail)).length > 22e3;) {
			let e = r.cursor === 0 ? r.trail.length - 1 : 0;
			r.trail.splice(e, 1), e < r.cursor && r.cursor--;
		}
		let n = {};
		try {
			n = JSON.parse(e.getItem(t) || "{}");
		} catch {}
		e.setItem(t, JSON.stringify({
			...n,
			trail: r.trail,
			cursor: r.cursor,
			previousId: a
		}));
	};
	return {
		entries: () => r.trail.filter((e, t) => t !== r.cursor && r.trail.findIndex((t) => t.id === e.id) === t).slice().reverse(),
		previous: () => r.trail.find((e) => e.id === a) || null,
		visit(e, t = []) {
			if (!e) return;
			let n = t.map((e) => e.title || e.name || "").filter(Boolean).join(" » ").slice(0, 1600);
			if (!n) return;
			let s = {
				id: e,
				title: n,
				parents: t.map((e) => e.id).filter((e) => typeof e == "string").slice(0, 64).map((e) => e.slice(0, 240))
			};
			i(s) && r.trail[r.cursor]?.id !== e && (a = r.trail[r.cursor]?.id, r.trail = [...r.trail.filter((t) => t.id !== e), s].slice(-10), r.cursor = r.trail.length - 1, o());
		},
		back() {
			let e = r.trail.findIndex((e) => e.id === a);
			return e < 0 ? null : (a = r.trail[r.cursor]?.id, r.cursor = e, o(), r.trail[r.cursor]);
		},
		remove(e) {
			let t = r.trail[r.cursor]?.id;
			r.trail = r.trail.filter((t) => t.id !== e), r.cursor = r.trail.findIndex((e) => e.id === t), a === e && (a = null), o();
		},
		clear() {
			r.trail = [], r.cursor = -1, a = null, o();
		}
	};
}
//#endregion
//#region resources/js/components/ResourceBreadcrumb.vue
var tt = {
	class: "resource-breadcrumb",
	"aria-label": "Breadcrumb"
}, nt = [
	"title",
	"aria-label",
	"onClick"
], rt = {
	key: 1,
	class: "resource-breadcrumb-title"
}, G = {
	__name: "ResourceBreadcrumb",
	props: {
		breadcrumb: Array,
		root: Object,
		rootIcon: String,
		iconOnlyRoot: Boolean
	},
	emits: ["open"],
	setup(e) {
		let t = e, n = S(() => {
			let e = t.breadcrumb || [], n = e[0] || t.root;
			return n ? [n, ...e.slice(1).filter((e) => e.visible !== !1)] : [];
		});
		return (t, i) => (l(), v("nav", tt, [(l(!0), v(d, null, r(n.value, (n, r) => (l(), v("button", {
			key: n.id,
			type: "button",
			class: E({ "root-crumb": r === 0 && e.iconOnlyRoot }),
			title: n.title,
			"aria-label": r === 0 && e.iconOnlyRoot ? n.title : void 0,
			onClick: (e) => t.$emit("open", n.id)
		}, [r === 0 ? (l(), v("span", {
			key: 0,
			class: E(n.useResourceIcon ? n.openIcon || n.icon : e.rootIcon),
			"aria-hidden": "true"
		}, null, 2)) : y("", !0), r !== 0 || !e.iconOnlyRoot ? (l(), v("span", rt, u(n.title), 1)) : y("", !0)], 10, nt))), 128))]));
	}
}, it = {
	class: "resource-toolbar",
	role: "toolbar"
}, K = { class: "resource-toolbar-primary" }, at = { class: "resource-view-controls" }, q = ["aria-label"], ot = [
	"disabled",
	"title",
	"aria-label"
], st = {
	key: 0,
	class: "resource-history-empty"
}, ct = ["title", "onClick"], lt = [
	"disabled",
	"title",
	"aria-label"
], ut = [
	"value",
	"aria-label",
	"placeholder"
], dt = ["title", "aria-label"], ft = ["disabled"], pt = ["disabled"], mt = ["title"], ht = { "aria-hidden": "true" }, gt = { class: "resource-mode-controls" }, _t = ["title", "onClick"], vt = ["title"], yt = {
	__name: "ResourceToolbar",
	props: {
		historyEntries: Array,
		historyPrevious: Object,
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
		"history-back",
		"history-open",
		"history-clear",
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
		let t = e, n = i(null), o = S(() => t.views.find((e) => e.id === t.activeView) || {}), s = [
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
		], c = S(() => {
			let e = t.sortFields?.length ? [...t.sortFields] : [...s];
			t.orderingField && !e.some((e) => e.id === t.orderingField) && e.push({
				id: t.orderingField,
				label: "JGRID_HEADING_ORDERING"
			});
			let n = (t.columns || []).flatMap((e) => e.dateGroup ? (e.fields || []).map((e) => e.sortField || e.id) : [e.sortField || e.id]), r = (e) => e === t.orderingField ? -1 : n.indexOf(e);
			return e.sort((e, i) => {
				let a = r(e.id), o = r(i.id);
				return (a < 0 && e.id !== t.orderingField ? n.length : a) - (o < 0 && i.id !== t.orderingField ? n.length : o);
			});
		}), g = S(() => ({
			created: "C",
			modified: "M",
			both: "M&C"
		})[t.detailsDateMode] || "M"), _ = S(() => `${t.t("COM_SMARTBROWSER_DATE")}: ${g.value}`), x = (e) => o.value.controls?.includes(e);
		return (t, i) => (l(), v("div", it, [f("div", K, [m(G, {
			breadcrumb: e.breadcrumb,
			root: e.root,
			"root-icon": e.rootIcon,
			"icon-only-root": e.iconOnlyRoot,
			onOpen: i[0] ||= (e) => t.$emit("open", e)
		}, null, 8, [
			"breadcrumb",
			"root",
			"root-icon",
			"icon-only-root"
		]), f("div", at, [
			f("div", {
				class: "resource-history-controls",
				role: "group",
				"aria-label": e.t("COM_SMARTBROWSER_HISTORY_TITLE")
			}, [f("button", {
				type: "button",
				class: "resource-icon-button",
				disabled: !e.historyPrevious,
				title: e.historyPrevious ? e.t("COM_SMARTBROWSER_HISTORY_BACK") + ": " + e.historyPrevious.title : e.t("COM_SMARTBROWSER_HISTORY_BACK"),
				"aria-label": e.t("COM_SMARTBROWSER_HISTORY_BACK"),
				onClick: i[1] ||= (e) => t.$emit("history-back")
			}, [...i[15] ||= [f("span", {
				class: "fas fa-history",
				"aria-hidden": "true"
			}, null, -1)]], 8, ot), m(j, {
				ref_key: "historyPopup",
				ref: n,
				label: e.t("COM_SMARTBROWSER_HISTORY_TITLE"),
				icon: "fas fa-caret-down",
				width: 360,
				"panel-class": "resource-history-menu"
			}, {
				default: a(() => [
					e.historyEntries?.length ? y("", !0) : (l(), v("p", st, u(e.t("COM_SMARTBROWSER_HISTORY_EMPTY")), 1)),
					(l(!0), v(d, null, r(e.historyEntries, (e) => (l(), v("button", {
						key: e.id,
						type: "button",
						class: "btn btn-outline-secondary",
						title: e.title,
						onClick: (r) => {
							n.value?.close(), t.$emit("history-open", e.id);
						}
					}, u(e.title), 9, ct))), 128)),
					e.historyEntries?.length ? (l(), v("button", {
						key: 1,
						type: "button",
						class: "resource-history-clear",
						onClick: i[2] ||= (e) => {
							n.value?.close(), t.$emit("history-clear");
						}
					}, [i[16] ||= f("span", {
						class: "fas fa-eraser",
						"aria-hidden": "true"
					}, null, -1), h(" " + u(e.t("COM_SMARTBROWSER_HISTORY_CLEAR")), 1)])) : y("", !0)
				]),
				_: 1
			}, 8, ["label"])], 8, q),
			e.reorderVisible ? (l(), p(se, {
				key: 0,
				enabled: e.reorderEnabled,
				t: e.t,
				onReorder: i[3] ||= (e) => t.$emit("reorder", e)
			}, null, 8, ["enabled", "t"])) : y("", !0),
			e.multiple ? (l(), v("button", {
				key: 1,
				type: "button",
				class: "resource-icon-button",
				disabled: !e.canInvert,
				title: e.t("COM_SMARTBROWSER_INVERT_SELECTION"),
				"aria-label": e.t("COM_SMARTBROWSER_INVERT_SELECTION"),
				onClick: i[4] ||= (e) => t.$emit("invert-selection")
			}, [...i[17] ||= [f("span", {
				class: "fas fa-retweet",
				"aria-hidden": "true"
			}, null, -1)]], 8, lt)) : y("", !0),
			m(j, {
				label: e.t("COM_SMARTBROWSER_SEARCH"),
				icon: "fas fa-search",
				"panel-class": "resource-search-row",
				width: 360
			}, {
				default: a(() => [f("form", {
					class: "input-group resource-search-control",
					role: "search",
					onSubmit: i[6] ||= b((n) => t.$emit("search", e.search), ["prevent"])
				}, [f("input", {
					value: e.search,
					type: "search",
					class: "form-control",
					"aria-label": e.t("COM_SMARTBROWSER_SEARCH"),
					placeholder: e.t("COM_SMARTBROWSER_SEARCH"),
					onInput: i[5] ||= (e) => t.$emit("search", e.target.value)
				}, null, 40, ut), f("button", {
					type: "submit",
					class: "btn btn-primary",
					title: e.t("COM_SMARTBROWSER_SEARCH"),
					"aria-label": e.t("COM_SMARTBROWSER_SEARCH")
				}, [...i[18] ||= [f("span", {
					class: "fas fa-search",
					"aria-hidden": "true"
				}, null, -1)]], 8, dt)], 32)]),
				_: 1
			}, 8, ["label"]),
			x("sort") ? (l(), p(ae, {
				key: 2,
				fields: c.value,
				"sort-by": e.sortBy,
				"sort-direction": e.sortDirection,
				t: e.t,
				onSortBy: i[7] ||= (e) => t.$emit("sort-by", e),
				onSortDirectionValue: i[8] ||= (e) => t.$emit("sort-direction-value", e)
			}, null, 8, [
				"fields",
				"sort-by",
				"sort-direction",
				"t"
			])) : y("", !0),
			x("zoom") ? (l(), v("button", {
				key: 3,
				type: "button",
				class: "resource-icon-button",
				disabled: e.gridSize === "sm",
				title: "Decrease size",
				onClick: i[9] ||= (e) => t.$emit("resize", -1)
			}, [...i[19] ||= [f("span", {
				class: "fas fa-search-minus",
				"aria-hidden": "true"
			}, null, -1)]], 8, ft)) : y("", !0),
			x("zoom") ? (l(), v("button", {
				key: 4,
				type: "button",
				class: "resource-icon-button",
				disabled: e.gridSize === "xl",
				title: "Increase size",
				onClick: i[10] ||= (e) => t.$emit("resize", 1)
			}, [...i[20] ||= [f("span", {
				class: "fas fa-search-plus",
				"aria-hidden": "true"
			}, null, -1)]], 8, pt)) : y("", !0),
			x("thumbnails") ? (l(), v("button", {
				key: 5,
				type: "button",
				class: E(["resource-icon-button", { active: e.detailsThumbnails }]),
				title: "Toggle thumbnails",
				onClick: i[11] ||= (e) => t.$emit("toggle-thumbnails")
			}, [...i[21] ||= [f("span", {
				class: "fas fa-images",
				"aria-hidden": "true"
			}, null, -1)]], 2)) : y("", !0),
			x("dateField") ? (l(), v("button", {
				key: 6,
				type: "button",
				class: "resource-icon-button resource-date-toggle",
				title: _.value,
				onClick: i[12] ||= (e) => t.$emit("toggle-date-field")
			}, [i[22] ||= f("span", {
				class: "fas fa-calendar",
				"aria-hidden": "true"
			}, null, -1), f("small", ht, u(g.value), 1)], 8, mt)) : y("", !0),
			x("dateField") && e.columns?.length ? (l(), p(xe, {
				key: 7,
				columns: e.columns,
				"hidden-columns": e.hiddenColumns,
				"shown-columns": e.shownColumns,
				t: e.t,
				onToggleColumn: i[13] ||= (e) => t.$emit("toggle-column", e)
			}, null, 8, [
				"columns",
				"hidden-columns",
				"shown-columns",
				"t"
			])) : y("", !0),
			f("div", gt, [(l(!0), v(d, null, r(e.views, (n) => (l(), v("button", {
				key: n.id,
				type: "button",
				class: E(["resource-icon-button", { active: e.activeView === n.id }]),
				title: e.t(n.label),
				onClick: (e) => t.$emit("view", n.id)
			}, [f("span", {
				class: E(n.icon),
				"aria-hidden": "true"
			}, null, 2)], 10, _t))), 128))]),
			f("button", {
				type: "button",
				class: E(["resource-icon-button", { active: e.showInfo }]),
				title: e.t("COM_SMARTBROWSER_TOGGLE_INFO"),
				onClick: i[14] ||= (e) => t.$emit("info")
			}, [...i[23] ||= [f("span", {
				class: "fas fa-info",
				"aria-hidden": "true"
			}, null, -1)]], 10, vt)
		])])]));
	}
}, bt = {
	__name: "ResourceNodeVisual",
	props: {
		resource: Object,
		open: Boolean
	},
	setup(e) {
		return (t, n) => (l(), p(Te, {
			resource: e.resource,
			variant: "compact",
			"allow-image": !1,
			open: e.open,
			"align-base-start": ""
		}, null, 8, ["resource", "open"]));
	}
}, xt = ["aria-label"], St = { class: "resource-tree-content" }, Ct = ["open", "onToggle"], wt = ["onClick"], J = {
	key: 0,
	class: "resource-adapter-roots"
}, Tt = ["onClick"], Et = {
	key: 1,
	class: "resource-tree-branch"
}, Dt = ["onClick"], Ot = ["onClick"], kt = {
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
	setup(t, { emit: i }) {
		let a = t, o = i, s = (e, t) => {
			e.target.open && t !== a.activeAdapter && o("adapter", t);
		}, c = (e) => {
			e === a.activeAdapter ? a.roots[0] && o("open", a.roots[0].id) : o("adapter", e);
		}, p = (e) => a.breadcrumb.some((t) => t.id === e.id), g = (e) => a.breadcrumb.filter((t) => t.id !== e.id), _ = S(() => a.roots.some((e) => e.visible !== !1 || p(e) && (g(e).length > 0 || a.nodes.length > 0))), x = (e, t) => ({ paddingInlineStart: `${10 + (e.visible === !1 ? 0 : 18) + t * 18}px` });
		return (i, a) => (l(), v("nav", {
			class: "resource-sidebar",
			"aria-label": t.t("COM_SMARTBROWSER_VIEW")
		}, [f("div", St, [(l(!0), v(d, null, r(t.adapters, (n) => (l(), v("details", {
			key: n.id,
			class: "resource-adapter",
			open: n.id === t.activeAdapter,
			onToggle: (e) => s(e, n.id)
		}, [f("summary", { onClick: b((e) => c(n.id), ["prevent"]) }, [f("span", {
			class: E(n.icon),
			"aria-hidden": "true"
		}, null, 2), h(" " + u(n.title), 1)], 8, wt), n.id !== t.activeAdapter || _.value ? (l(), v("div", J, [(l(!0), v(d, null, r(n.id === t.activeAdapter ? t.roots : [], (a) => (l(), v("section", {
			key: a.id,
			class: E(["resource-tree-root", { "root-hidden": a.visible === !1 }])
		}, [a.visible === !1 ? y("", !0) : (l(), v("button", {
			key: 0,
			type: "button",
			class: E({ active: t.selectedNode === a.id }),
			onClick: (e) => i.$emit("open", a.id)
		}, [f("span", {
			class: E(["resource-tree-root-icon", a.useResourceIcon ? a.icon : n.icon]),
			"aria-hidden": "true"
		}, null, 2), f("span", null, u(a.title), 1)], 10, Tt)), p(a) ? (l(), v("div", Et, [(l(!0), v(d, null, r(g(a), (n) => (l(), v("button", {
			key: n.id,
			type: "button",
			class: E({ active: t.selectedNode === n.id }),
			style: e(x(a, g(a).indexOf(n))),
			onClick: (e) => i.$emit("open", n.id)
		}, [m(bt, {
			resource: n,
			open: !0
		}, null, 8, ["resource"]), f("span", null, u(n.title), 1)], 14, Dt))), 128)), (l(!0), v(d, null, r(t.nodes, (t) => (l(), v(d, { key: t.id }, [t.navigable === !1 ? (l(), v("div", {
			key: 1,
			class: "resource-tree-entry resource-tree-static",
			style: e(x(a, g(a).length))
		}, [m(bt, { resource: t }, null, 8, ["resource"]), f("span", null, u(t.title), 1)], 4)) : (l(), v("button", {
			key: 0,
			type: "button",
			class: "resource-tree-entry",
			style: e(x(a, g(a).length)),
			onClick: (e) => i.$emit("open", t.id)
		}, [m(bt, { resource: t }, null, 8, ["resource"]), f("span", null, u(t.title), 1)], 12, Ot))], 64))), 128))])) : y("", !0)], 2))), 128))])) : y("", !0)], 40, Ct))), 128))]), n(i.$slots, "footer")], 8, xt));
	}
}, At = ["aria-label", "aria-busy"], jt = [
	"disabled",
	"title",
	"aria-label"
], Mt = {
	key: 1,
	role: "status",
	"aria-live": "polite"
}, Nt = {
	key: 2,
	role: "status",
	"aria-live": "polite"
}, Pt = [
	"disabled",
	"title",
	"aria-label"
], Ft = ["disabled"], It = {
	key: 0,
	class: "spinner-border spinner-border-sm",
	"aria-hidden": "true"
}, Lt = {
	key: 1,
	class: "fas fa-angle-down",
	"aria-hidden": "true"
}, Rt = ["disabled"], zt = {
	__name: "ResourcePagination",
	props: {
		page: Object,
		total: {
			type: Number,
			default: 0
		},
		busy: Boolean,
		t: Function,
		smart: Boolean,
		loaded: Number
	},
	emits: [
		"page",
		"more",
		"all"
	],
	setup(e) {
		let t = e, n = S(() => t.page && t.page.total > t.page.limit && !(t.smart && t.loaded >= t.page.total));
		return (t, r) => (l(), v("nav", {
			class: E(["resource-pagination", { "is-smart": e.smart }]),
			"aria-label": e.t("COM_SMARTBROWSER_PAGINATION"),
			"aria-busy": e.busy
		}, [
			n.value && !e.smart ? (l(), v("button", {
				key: 0,
				type: "button",
				class: "btn btn-outline-secondary",
				disabled: e.busy || e.page.offset === 0,
				title: e.t("COM_SMARTBROWSER_PAGE_PREVIOUS"),
				"aria-label": e.t("COM_SMARTBROWSER_PAGE_PREVIOUS"),
				onClick: r[0] ||= (n) => t.$emit("page", Math.max(0, e.page.offset - e.page.limit))
			}, [...r[4] ||= [f("span", {
				class: "fas fa-chevron-left",
				"aria-hidden": "true"
			}, null, -1)]], 8, jt)) : y("", !0),
			n.value ? (l(), v("span", Mt, u(e.t("COM_SMARTBROWSER_PAGE_RANGE").replace("%1$s", String(e.page.total ? e.smart ? 1 : e.page.offset + 1 : 0)).replace("%2$s", String(e.smart ? e.loaded : Math.min(e.page.offset + e.page.limit, e.page.total))).replace("%3$s", String(e.page.total))), 1)) : y("", !0),
			n.value ? y("", !0) : (l(), v("span", Nt, u(e.t("COM_SMARTBROWSER_ITEM_COUNT").replace("%s", String(e.page?.total ?? e.total))), 1)),
			n.value && !e.smart ? (l(), v("button", {
				key: 3,
				type: "button",
				class: "btn btn-outline-secondary",
				disabled: e.busy || !e.page.hasMore,
				title: e.t("COM_SMARTBROWSER_PAGE_NEXT"),
				"aria-label": e.t("COM_SMARTBROWSER_PAGE_NEXT"),
				onClick: r[1] ||= (n) => t.$emit("page", e.page.offset + e.page.limit)
			}, [...r[5] ||= [f("span", {
				class: "fas fa-chevron-right",
				"aria-hidden": "true"
			}, null, -1)]], 8, Pt)) : e.smart && e.page?.hasMore ? (l(), v("button", {
				key: 4,
				type: "button",
				class: "btn btn-outline-secondary resource-load-more",
				disabled: e.busy,
				onClick: r[2] ||= (e) => t.$emit("more")
			}, [e.busy ? (l(), v("span", It)) : (l(), v("span", Lt)), h(u(e.t(e.busy ? "COM_SMARTBROWSER_LOADING" : "COM_SMARTBROWSER_LOAD_MORE")), 1)], 8, Ft)) : y("", !0),
			e.smart && e.page?.hasMore ? (l(), v("button", {
				key: 5,
				type: "button",
				class: "btn btn-outline-secondary resource-load-more resource-load-all",
				disabled: e.busy,
				onClick: r[3] ||= (e) => t.$emit("all")
			}, [r[6] ||= f("span", {
				class: "fas fa-angle-double-down",
				"aria-hidden": "true"
			}, null, -1), h(u(e.t("COM_SMARTBROWSER_LOAD_ALL")), 1)], 8, Rt)) : y("", !0)
		], 10, At));
	}
}, Bt = {
	__name: "ResourceLoadSentinel",
	props: {
		enabled: Boolean,
		requestKey: String
	},
	emits: ["load"],
	setup(e, { emit: n }) {
		let r = e, a = n, o = i(null), s, u, d = 0, f = "", p = !1, m = () => {
			let e = null;
			for (let t = o.value?.parentElement; t && t !== document.body; t = t.parentElement) if (/auto|scroll/.test(getComputedStyle(t).overflowY) && t.scrollHeight > t.clientHeight + 1) {
				e = t;
				break;
			}
			s && e === u || (u = e, s?.disconnect(), s = new IntersectionObserver(h, {
				root: u,
				rootMargin: "180px"
			}), s.observe(o.value));
		}, h = () => {
			if (p || !r.enabled || !o.value || f === r.requestKey) return;
			m();
			let e = o.value.getBoundingClientRect(), t = u?.getBoundingClientRect() || {
				top: 0,
				bottom: innerHeight
			};
			e.top <= t.bottom + 180 && e.bottom >= t.top && (f = r.requestKey, a("load"));
		};
		return t(() => {
			m();
		}), g(() => [r.enabled, r.requestKey], async () => {
			await T(), !p && (cancelAnimationFrame(d), d = requestAnimationFrame(h));
		}), c(() => {
			p = !0, s?.disconnect(), cancelAnimationFrame(d);
		}), (e, t) => (l(), v("div", {
			ref_key: "sentinel",
			ref: o,
			class: "resource-scroll-sentinel",
			"aria-hidden": "true"
		}, null, 512));
	}
}, Y = /* @__PURE__ */ new Set([
	"articles",
	"categories",
	"tags",
	"articles-by-tag",
	"menus",
	"users",
	"media"
]), Vt = (e, t, n, r = !1) => {
	let i = r ? "" : e.startsWith("flat-") ? new URL(n).searchParams.get("flatFromBrowseRoot") || "" : t || "";
	return `supjx.smartbrowser.ui.${e.replace(/^flat-/, "")}.${i}`;
}, Ht = (e, t, n, r) => {
	let i = new URL(e);
	if (!Y.has(t)) return i.toString();
	i.searchParams.set("flatFromAdapter", t), i.searchParams.set("flatFromNode", n), r ? i.searchParams.set("flatFromBrowseRoot", r) : i.searchParams.delete("flatFromBrowseRoot");
	let a = `flat-${t}`;
	if (i.searchParams.set("adapter", a), i.searchParams.set("node", `${a}:root`), t === "articles" || t === "categories") {
		let e = n.startsWith("category:") ? n : r;
		e?.startsWith("category:") ? i.searchParams.set("browseRoot", e) : i.searchParams.delete("browseRoot"), i.searchParams.delete("flatScope");
	} else r ? i.searchParams.set("browseRoot", r) : i.searchParams.delete("browseRoot"), i.searchParams.set("flatScope", n);
	return i.toString();
}, Ut = (e, t) => {
	let n = new URL(e), r = n.searchParams.get("flatFromAdapter"), i = Y.has(r) ? r : "articles", a = n.searchParams.get("flatFromBrowseRoot") || (r ? null : t), o = n.searchParams.get("flatFromNode") || a || "content:root";
	n.searchParams.set("adapter", i), n.searchParams.set("node", o), a ? n.searchParams.set("browseRoot", a) : n.searchParams.delete("browseRoot");
	for (let e of [
		"flatFromAdapter",
		"flatFromNode",
		"flatFromBrowseRoot",
		"flatScope"
	]) n.searchParams.delete(e);
	return n.toString();
}, Wt = (e, t) => {
	let n = new URL(e);
	if (!n.searchParams.get("adapter")?.startsWith("flat-") || !t) return n.toString();
	let r = n.searchParams.get("adapter");
	if (n.searchParams.set("node", `${r}:root`), n.searchParams.set("flatFromNode", t), r === "flat-articles" || r === "flat-categories") {
		let e = n.searchParams.get("flatFromBrowseRoot") || (n.searchParams.has("flatFromAdapter") ? null : n.searchParams.get("browseRoot"));
		e ? n.searchParams.set("browseRoot", e) : n.searchParams.delete("browseRoot"), n.searchParams.delete("flatScope");
	} else n.searchParams.set("flatScope", t);
	return n.toString();
}, Gt = (e) => e.mode === "manage" && !e.pickerInstance && !e.pickerContext, Kt = (e, t = D()) => Gt(e) ? `supjx.smartbrowser.${e.adapter.replace(/^flat-/, "")}` : `supjx.smartbrowser.picker.${O(e, k(t))}.${e.adapter.replace(/^flat-/, "")}`, X = class {
	constructor(e = D(), t = "supjx.smartbrowser.media", n = null) {
		this.storage = e, this.key = t, this.options = n, this.nodeKey = n ? ee(n, e) : null;
	}
	load(e) {
		try {
			let t = {
				...e,
				...JSON.parse(this.storage.getItem(this.key) || "{}")
			};
			return this.nodeKey && (t.selectedNode = JSON.parse(this.storage.getItem(this.nodeKey) || "{}").selectedNode || t.selectedNode), t.selectedNode?.startsWith("flat-") && t.selectedNode.endsWith(":root") && (t.selectedNode = e.selectedNode), t.pageSize = e.pageSize, t;
		} catch {
			return { ...e };
		}
	}
	save(e) {
		let t = this.options?.adapter?.startsWith("flat-") ? this.options.flatTreeNode || this.options.flatScope || this.options.browseRoot : e.selectedNode, n = {
			...!this.nodeKey && t ? { selectedNode: t } : {},
			activeView: e.activeView,
			viewOptions: e.viewOptions,
			hiddenColumns: e.hiddenColumns,
			shownColumns: e.shownColumns,
			sortBy: e.sortBy,
			sortDirection: e.sortDirection,
			showInfo: e.showInfo,
			filters: e.filters
		};
		if (this.storage.setItem(this.key, JSON.stringify(n)), this.nodeKey && t) {
			let e = {};
			try {
				e = JSON.parse(this.storage.getItem(this.nodeKey) || "{}");
			} catch {}
			this.storage.setItem(this.nodeKey, JSON.stringify({
				...e,
				selectedNode: t
			}));
		}
	}
}, qt = {
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
}, Jt = (e) => ({
	stateLabel: "status",
	width: "dimension",
	link: "url"
})[e.split(".").pop()] || e.split(".").pop();
function Yt(e, t) {
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
		...(qt[o] || []).map(([e, t, n]) => ({
			id: Jt(e),
			label: t,
			source: `metadata.${e}`,
			format: n
		}))
	], c = i.has("dates");
	for (let e of s) {
		if (!e.source || !e.label || e.source === "metadata.locationPath" || o === "articles" && e.source === "metadata.categoryPath") continue;
		let t = e.id || Jt(e.source);
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
var Xt = {
	key: 0,
	class: "smartbrowser-busy",
	role: "status",
	"aria-live": "polite"
}, Zt = [
	"aria-pressed",
	"title",
	"aria-label"
], Qt = [
	"aria-pressed",
	"title",
	"aria-label"
], $t = { class: "sb-tree-handle-rail" }, en = [
	"title",
	"aria-label",
	"aria-expanded",
	"aria-busy"
], tn = {
	key: 0,
	class: "spinner-border spinner-border-sm",
	"aria-hidden": "true"
}, nn = { class: "resource-main" }, rn = ["aria-busy"], an = {
	key: 0,
	class: "resource-loader",
	role: "status",
	"aria-live": "polite"
}, on = {
	key: 1,
	class: "resource-empty"
}, sn = {
	key: 3,
	class: "resource-drop-overlay"
}, cn = {
	key: 4,
	class: "sb-browser-info-rail"
}, ln = { class: "resource-picker-collection-body" }, un = {
	__name: "SmartBrowserApp",
	setup(n) {
		let r = C("browser"), d = C("smartBrowserOptions"), _ = C("persistence"), x = d.application === "site" && window.self === window.top, w = i("normal"), k = i(null), A = i("620px"), ae = i(window.innerWidth);
		async function se(e) {
			if (await B(I.selectedNode, { offset: e }), I.error) return;
			let t = k.value?.querySelector(".resource-browser");
			t && getComputedStyle(t).overflowY !== "visible" && (t.scrollTop = 0);
		}
		let me = i(null), ge = i(null), ve = i(null), be = i("0px"), xe = i("0px"), j, Te, N, ke, P = () => {
			ae.value = window.innerWidth;
			let e = k.value;
			e && (A.value = `${De(e)}px`, be.value = `${ve.value?.getBoundingClientRect().height || 0}px`, xe.value = `${ge.value?.getBoundingClientRect().height || 0}px`);
		}, Me, Ne = S(() => ({
			normal: "COM_SMARTBROWSER_DISPLAY_WIDE",
			wide: "COM_SMARTBROWSER_DISPLAY_FOCUS",
			focus: "COM_SMARTBROWSER_DISPLAY_NORMAL"
		})[w.value]), Pe = () => {
			w.value = Me.cycle();
		};
		t(() => {
			j = document.getElementById("system-message-container"), ge.value && j && !j.contains(k.value) && (Te = document.createComment("SmartBrowser message position"), j.before(Te), ge.value.append(j)), x && (Me = Ae(document.getElementById("smartbrowser-app"), (e) => {
				w.value = e;
			})), P(), N = new ResizeObserver(P), N.observe(k.value.parentElement), ve.value && N.observe(ve.value), ge.value && N.observe(ge.value);
			let e = k.value.closest("dialog");
			e && N.observe(e), ke = je(k.value, () => me.value?.element, d.nativeToolbarTarget), window.addEventListener("resize", P);
		}), g(w, () => T(P)), c(() => {
			Te?.parentNode && Te.replaceWith(j), N?.disconnect(), ke?.(), window.removeEventListener("resize", P), Me?.destroy();
		});
		let Fe = C("actionDriver"), F = C("resourceApi"), Ie = C("viewRegistry"), { state: I, resources: L, bulkSelectableResources: Le, selection: R, focusedResource: z, load: B, focus: Re, toggle: ze, selectAll: Be, invertSelection: Ve } = r;
		g(() => [
			I.revealIds,
			I.busy,
			I.loading,
			I.activeView
		], async () => {
			if (!I.revealIds?.length || I.busy || I.loading) return;
			let e = I.revealIds;
			await T(), await new Promise((e) => requestAnimationFrame(() => requestAnimationFrame(e))), !J && k.value && e === I.revealIds && (Oe(k.value, e), I.revealIds = []);
		});
		let V = d.mode === "select" ? d.pickerContext || d.selectionHost : d.selectionHost || null, H = !!V?.collectionMode, He = d.mode === "select" || !!V, U = (e) => Joomla.Text?._(e, e) || e, Ue = (e) => U(I.pagination && ["COM_SMARTBROWSER_SELECT_ALL", "COM_SMARTBROWSER_INVERT_SELECTION"].includes(e) ? e + (I.loadingMode === "smart" ? "_LOADED" : "_PAGE") : e), We = S(() => U(d.adapters?.find((e) => e.id === d.adapter)?.title || d.adapters?.find((e) => e.id === d.adapter.replace(/^flat-/, ""))?.title || "COM_SMARTBROWSER_RESOURCE")), Ge = /* @__PURE__ */ new Map(), Ke = (e) => {
			let t = e?.selection?.adapter || e?.adapter;
			if (!t || t === d.adapter.replace(/^flat-/, "")) return Fe;
			if (!Ge.has(t)) {
				let e = new ce({
					...d,
					adapter: t,
					browseRoot: null,
					flatScope: null
				});
				Ge.set(t, {
					api: e,
					driver: new Ee(e, I, async () => {
						await W?.refresh();
						for (let e of W?.browser.state.items || []) I.selectedResources[M(e)] = fe(e);
						await B();
					}, U, d.editorMode, d.application)
				});
			}
			return Ge.get(t).driver.selectionHost = at, Ge.get(t).driver;
		}, qe = (e) => e?.collectionActions || I.actions, Je = (e, t) => qe(t).find((t) => t.id === e.id) || e, Ye = (e, t) => {
			if (!H || e.currentNode || !t.length) return Fe.available(e, t);
			if (e.single && t.length !== 1) return !1;
			let n = (t) => (!t.collectionActions || t.collectionActions.some((t) => t.id === e.id)) && Ke(t).available(Je(e, t), [t]);
			return e.exclusiveGroup ? t.some(n) : t.every(n);
		}, Xe = async (e, t) => {
			if (!Ye(e, t)) return;
			if (!H || e.currentNode || !t.length) return Fe.execute(e, t);
			let n = /* @__PURE__ */ new Map();
			for (let e of t) {
				let t = Ke(e);
				n.has(t) || n.set(t, []), n.get(t).push(e);
			}
			for (let [t, r] of n) await t.execute(Je(e, r[0]), r);
		};
		c(() => Ge.forEach(({ api: e, driver: t }) => {
			t.destroy(), e.destroy();
		}));
		let W, Ze = !1, Qe = (e) => H ? e : {
			...e,
			selectionKey: void 0
		}, tt = {
			referenceItems: !0,
			homogeneous: V?.homogeneous === !0,
			readOnly: !1,
			showCount: !1,
			selectionProfile: V?.selectionProfile || {},
			addressContract: V?.addressContract,
			adapter: d.adapter.replace(/^flat-/, ""),
			allowedAdapters: V?.allowedAdapters || (V?.collectionMode ? [] : [d.adapter.replace(/^flat-/, "")]),
			allowedResourceTypes: d.allowedResourceTypes,
			selectionTarget: d.selectionTarget,
			maxSelections: V?.maxSelections || 500,
			selectedResources: !0,
			informationPanel: !1,
			multiple: d.multiple,
			items: V?.getCollectionSnapshot?.().items || [],
			layout: "compact",
			allowRemove: !0,
			allowOrdering: d.multiple && V?.allowOrdering !== !1,
			contextActions: !1,
			resourceActions: [{
				id: "selectionFocus",
				label: "COM_SMARTBROWSER_USAGE_OPTIONS",
				icon: "fas fa-pen",
				requiresSelection: !0
			}],
			defaultResourceActionId: "selectionFocus",
			apiBaseUrl: d.apiBaseUrl,
			csrfToken: d.csrfToken,
			application: d.application,
			onResourceAction: (e, t) => {
				t = Qe(t), I.selectedResources[M(t)] = t, I.focusedId = M(t);
			}
		}, nt = /* @__PURE__ */ new Map();
		async function rt(e, t = {}) {
			let n = JSON.stringify([e.adapter, t.browseRoot || ""]);
			return nt.has(n) || nt.set(n, new ce({
				...d,
				adapter: e.adapter,
				mode: "select",
				browseRoot: t.browseRoot || null,
				flatScope: null
			})), (await nt.get(n).collection([e.id])).resources[0];
		}
		let G = ne({
			profile: V?.selectionProfile || {},
			initialUsage: V?.initialUsage || {},
			editors: V?.editors || {},
			resolveReference: rt
		}), it = () => I.selectedIds.flatMap((e) => {
			let t = R.value.find((t) => M(t) === e);
			if (t) return [{
				selection: we(t, d.adapter.replace(/^flat-/, "")),
				usage: G.get(t)
			}];
			let n = V?.getCollectionSnapshot?.().items.find((t) => Ce(t.selection) === e);
			return n ? [n] : [];
		}), K = () => {
			H && V.commitCollection?.({
				items: it(),
				resources: Object.fromEntries(R.value.map((e) => [M(e), e])),
				virtualResources: I.virtualResources
			});
		}, at = d.selectionState && (V || d.selectionHost) ? {
			editorContext: V?.selectionEditorContext || {},
			canAdd: (e, t) => r.canAddSelection(e, t),
			canCreate: (e) => r.canCreateSelectionResource(e),
			remove: (e) => {
				r.deleteVirtualResources(e), e.forEach((e) => G.forget(e)), q.value++, K(), d.selectionHost?.onChange?.({ items: it() });
			},
			replace: (e, t) => {
				let n = t ? { ...G.get(t) } : {}, i = r.replaceSelectionResource(e, t);
				for (let e of G.definitions(i)) Object.prototype.hasOwnProperty.call(n, e.key) && G.set(i, e.key, n[e.key]);
				return q.value++, K(), d.selectionHost?.onChange?.({ items: it() }), t && M(t) !== M(i) && G.forget(t), i;
			}
		} : null;
		Fe.selectionHost = at, g(() => [I.selectedIds, I.selectedResources], K, {
			deep: !0,
			flush: "sync"
		}), c(K);
		let q = i(0);
		He && (W = ye({
			config: tt,
			api: F,
			translate: U,
			notify: (e) => {
				Ze = !0;
				for (let t of e.items) {
					let n = e.resources.find((e) => M(e) === Ce(t.selection));
					if (n) for (let [e, r] of Object.entries(t.usage)) G.set(Qe(n), e, r);
				}
				I.selectedResources = Object.fromEntries(e.resources.map(Qe).map((e) => [M(e), fe(e)])), I.selectedIds = e.items.map((e) => H ? Ce(e.selection) : e.selection.id), q.value++, Ze = !1, K();
			}
		}), W.refresh().catch((e) => Joomla.renderMessages({ error: [e.message] })), g(() => [I.selectedIds, q.value], () => {
			Ze || W.setItems(it()).catch((e) => Joomla.renderMessages({ error: [e.message] }));
		}, {
			deep: !0,
			flush: "sync"
		}), c(() => W.destroy()));
		let ot = i(V?.isMaximized?.() || !1), st = S(() => {
			if (V?.title) return V.title;
			let e = d.adapters?.find((e) => e.id === d.adapter) || d.adapters?.find((e) => e.id === d.adapter.replace(/^flat-/, ""));
			return `${U("COM_SMARTBROWSER_PICKER_SELECT_TITLE")} \u2014 ${U(e?.title || "COM_SMARTBROWSER_RESOURCE")}`;
		}), ct = i(0), lt = i({}), ut = i(!1), dt = S(() => G.definitions(z.value).filter((e) => e.presentation !== "hidden")), ft = S(() => (q.value, G.get(z.value))), pt = S(() => !!(V && Object.keys(V.selectionProfile || {}).length)), mt = !!(V && Object.keys(V.selectionProfile || {}).length), ht = i(V?.initialInfoOpen === !0 || (typeof d.pickerRememberedInfo == "boolean" ? d.pickerRememberedInfo : Object.values(V?.selectionProfile || {}).some((e) => e !== !1 && e?.presentation !== "hidden") || I.showInfo)), gt = S(() => mt || V?.initialInfoOpen === !0 ? ht.value : I.showInfo), _t = () => {
			mt || V?.initialInfoOpen === !0 ? (ht.value = !ht.value, I.showInfo = ht.value) : I.showInfo = !I.showInfo;
		}, vt = (e, t, n) => {
			e && !J && (G.set(e, t, n), lt.value = {
				...lt.value,
				[M(e)]: {}
			}, q.value++, K());
		}, bt = (e, t) => vt(z.value, e, t), xt = S(() => {
			let e = z.value;
			return le({
				resource: e,
				overlayRegistry: V || window.SmartBrowserPicker,
				isReadOnly: !V || d.mode === "readonly",
				fieldElement: null,
				isCurrent: () => !J && M(z.value) === M(e),
				getAddress: () => G.get(e)["ext.address"] ?? re(e),
				getDefaultAddress: () => re(e),
				resetAddress: () => vt(e, "ext.address", null),
				setAddress: (t) => vt(e, "ext.address", t),
				profile: V?.selectionProfile || {},
				values: ft.value,
				getValues: () => G.get(e),
				setValue: (t, n) => vt(e, t, n),
				refresh: () => B(),
				selectResource: (e) => window.SmartBrowserPicker.open(e)
			});
		}), St = i(V?.previewActions || []), Ct = V?.subscribePreviewActions?.((e) => {
			St.value = e;
		});
		c(() => Ct?.());
		let wt = S(() => St.value.filter((e) => {
			try {
				return z.value && (!xt.value.isReadOnly || e.allowReadOnly === !0) && (!e.applies || e.applies(xt.value));
			} catch {
				return !1;
			}
		})), J = !1;
		c(() => {
			J = !0, nt.forEach((e) => e.destroy());
		});
		let Tt = Ie.all(), Et = S(() => Ie.get(I.activeView)), Dt = i(!1), Ot = S(() => I.loading || Dt.value), At = async (e) => {
			if (!(I.activeView === e || I.loading || I.busy || Dt.value)) {
				Dt.value = !0;
				try {
					await T(), await new Promise((e) => requestAnimationFrame(() => requestAnimationFrame(e))), I.activeView = e, await T();
				} finally {
					Dt.value = !1;
				}
			}
		}, jt = i({}), Mt = oe({
			api: F,
			config: {
				...d,
				selectionProfile: V?.selectionProfile || {},
				addressContract: V?.addressContract
			}
		}), Nt = 0;
		g(() => [L.value, q.value], async () => {
			if (!V) return;
			let e = ++Nt, t = {};
			for (let e of L.value) try {
				t[M(e)] = await Mt.serialize({
					selection: we(e, d.adapter.replace(/^flat-/, "")),
					usage: G.get(e)
				}, e);
			} catch {
				t[M(e)] = "";
			}
			e === Nt && (jt.value = t);
		}, { immediate: !0 }), c(() => {
			Nt++, Mt.destroy();
		});
		let Pt = S(() => V ? L.value.map((e) => ({
			...e,
			selectionAddress: jt.value[M(e)] || ""
		})) : L.value), Ft = S(() => {
			let e = Yt(I.presentation, d.adapter);
			return V && !e.some((e) => e.id === "selectionAddress") && e.push({
				id: "selectionAddress",
				source: "selectionAddress",
				label: "COM_SMARTBROWSER_URI",
				headerIcon: "fas fa-link",
				defaultVisible: !1
			}), e;
		}), It = S(() => Ft.value.filter((e) => e.id === "title" || e.id === "name" || (e.defaultVisible ? !I.hiddenColumns.includes(e.id) : I.shownColumns.includes(e.id)))), Lt = (e) => {
			let t = Ft.value.find((t) => t.id === e);
			if (!t || ["title", "name"].includes(e)) return;
			let n = t.defaultVisible ? "hiddenColumns" : "shownColumns";
			I[n] = I[n].includes(e) ? I[n].filter((t) => t !== e) : [...I[n], e];
		}, Rt = i(!1), Y = i(d.adapter.startsWith("flat-")), X = i(null), qt = i(!1), Jt = i(null), un = S(() => d.adapter === "media"), dn = S(() => d.mode === "manage" && ["details", "grid"].includes(I.activeView) && I.presentation.orderingField && I.sortBy === I.presentation.orderingField && ["asc", "desc"].includes(I.sortDirection) && (d.adapter === "featured-articles" || String(I.filters.featured ?? "") !== "1")), fn = S(() => dn.value && !I.busy && R.value.length > 0 && R.value.every((e) => e.capabilities?.reorder === !0)), pn = async (e) => {
			if (!fn.value || !["up", "down"].includes(e)) return;
			let t = R.value.map((e) => e.id), n = I.focusedId;
			I.busy = !0;
			try {
				let r = I.sortDirection === "desc" ? e === "up" ? "down" : "up" : e;
				(await F.execute("reorder", t, { direction: r })).updated?.length && (await B(), I.selectedIds = I.pagination ? t : t.filter((e) => L.value.some((t) => t.id === e)), I.focusedId = I.selectedIds.includes(n) ? n : I.selectedIds[0] || null);
			} catch (e) {
				Joomla.renderMessages({ error: [e.message] });
			} finally {
				I.busy = !1;
			}
		}, mn = d.adapter !== "featured-articles" && [
			"articles",
			"categories",
			"tags",
			"articles-by-tag",
			"menus",
			"users",
			"media"
		].includes(d.adapter.replace(/^flat-/, "")), Z = d.adapter.startsWith("flat-") || d.adapter === "featured-articles", Q = d.adapter.startsWith("flat-") ? new ce({
			...d,
			adapter: d.adapter.slice(5),
			browseRoot: d.flatTreeRoot || null,
			flatScope: null,
			navigationOnly: !0
		}) : null, hn = S(() => (d.adapters || []).filter((e) => (!Q || e.id !== d.adapter.slice(5)) && (!V?.allowedAdapters?.length || V.allowedAdapters.includes(e.id.replace(/^flat-/, "")))));
		g(Y, async (e) => {
			if (!(e || !Q || X.value || qt.value)) {
				qt.value = !0;
				try {
					let e = (await Q.getResources("")).roots || [], t = d.flatTreeNode || e[0]?.id;
					X.value = {
						...t ? await Q.getResources(t) : {},
						roots: e
					};
				} catch (e) {
					J || Joomla.renderMessages({ error: [e.message] });
				} finally {
					qt.value = !1;
				}
			}
		}), c(() => Q?.destroy());
		let gn = async (e) => {
			if (!Q) return B(e);
			K(), await Pn(Ht(window.location.href, d.adapter.slice(5), e, d.flatTreeRoot || null));
		}, _n = S(() => !Z || !d.flatBreadcrumb?.length || d.flatBreadcrumb.length === 1 ? I.breadcrumb : d.flatBreadcrumb), vn = i([]), yn = i(null), $, bn = () => {
			vn.value = $.entries(), yn.value = $.previous();
		}, xn = () => {
			$ = et(D(), ee(d), d.browseRoot || ""), bn();
		};
		xn(), g(() => I.navigationRevision, () => {
			$.visit(d.flatTreeNode || I.selectedNode, _n.value), bn();
		});
		let Sn = async (e) => {
			await gn(e), !Q && (I.error || I.selectedNode !== e) && ($.remove(e), bn());
		}, Cn = () => {
			$.clear(), $.visit(d.flatTreeNode || I.selectedNode, _n.value), bn();
		}, wn = () => {
			let e = $.back();
			bn(), e && Sn(e.id);
		};
		function Tn() {
			let e = D();
			_ && (_.storage = e, _.key = Kt(d, e), _.nodeKey = ee(d, e)), e.removeItem(Kt(d, e)), e.removeItem(kn), e.removeItem(ee(d, e)), I.activeView = d.defaultView || "grid", I.showInfo = !1, I.search = "", I.hiddenColumns = [], I.shownColumns = [], I.sortBy = d.defaultSortBy || "", I.sortDirection = d.defaultSortDirection || "", I.viewOptions = {
				gridSize: "md",
				detailsThumbnails: !1,
				detailsDateMode: "modified"
			}, I.filters = { ...d.initialFilters || {} };
			for (let e of I.presentation.filters || []) I.filters[e.id] === void 0 && (I.filters[e.id] = e.default);
			jn.value = !1, Y.value = !!Q, An = {}, xn();
		}
		function En(e) {
			let t = Joomla.getOptions?.("com_smartbrowser.preferences", {}) || {};
			d.editorMode = e.editorMode === "inherit" ? t.editorDefault || "modal" : e.editorMode, Fe.editorMode = d.editorMode, xn(), r.applyLoadingPreferences(e);
		}
		let Dn = i(!1), On = Object.fromEntries(Object.entries(d.gridWidths || {}).map(([e, t]) => [`--sb-grid-${e}`, `${t}px`])), kn = Gt(d) ? Vt(d.adapter, d.browseRoot, window.location.href, !0) : `supjx.smartbrowser.ui.picker.${O(d)}.${d.adapter.replace(/^flat-/, "")}`, An = (() => {
			try {
				return JSON.parse(D().getItem(kn) || "{}");
			} catch {
				return {};
			}
		})(), jn = i(An.filtersOpen === !0), Mn = (e) => {
			An = {
				...An,
				filtersOpen: jn.value,
				...e
			}, D().setItem(kn, JSON.stringify(An));
		}, Nn = () => {
			jn.value = !jn.value, Mn({ filtersOpen: jn.value });
		}, Pn = async (e) => {
			Dn.value || (Dn.value = !0, I.loading = !0, await T(), await new Promise((e) => requestAnimationFrame(() => requestAnimationFrame(e))), window.location.assign(e));
		}, Fn = () => {
			Mn({ flat: !Z }), Pn(Z ? Ut(window.location.href, d.browseRoot) : Ht(window.location.href, d.adapter, I.selectedNode, d.browseRoot));
		}, In = S(() => d.adapters?.find((e) => e.id === d.adapter)?.icon || d.adapters?.find((e) => e.id === d.adapter.replace(/^flat-/, ""))?.icon || "fas fa-list"), Ln = S(() => d.adapters?.find((e) => e.id === d.adapter)?.nodeOpenIcon || {
			media: "fas fa-folder-open",
			articles: "fas fa-box-open",
			"flat-articles": "fas fa-box-open",
			categories: "fas fa-box-open",
			tags: "fas fa-tags",
			"articles-by-tag": "fas fa-tags",
			users: "fas fa-users-viewfinder",
			menus: "fas fa-diagram-successor",
			"featured-articles": "fas fa-star"
		}[d.adapter] || "fas fa-folder-open"), Rn = [
			"sm",
			"md",
			"lg",
			"xl"
		], zn = async ({ selection: e, payload: t, resolve: n, reject: r }) => {
			try {
				let r = await F.execute("batch", e, t);
				if (r.download) {
					let e = atob(r.download.content), t = Uint8Array.from(e, (e) => e.charCodeAt(0)), n = URL.createObjectURL(new Blob([t], { type: "application/zip" })), i = document.createElement("a");
					i.href = n, i.download = r.download.name, i.click(), setTimeout(() => URL.revokeObjectURL(n), 6e4);
				}
				I.pagination && d.mode === "manage" && !H && !d.selectionState && (I.selectedIds = [], I.selectedResources = {}), await B(), n(r);
			} catch (e) {
				r(e);
			}
		}, Bn = async (e) => {
			if (ut.value || !e.length) return;
			ut.value = !0;
			let t = q.value, n;
			try {
				n = await G.validate(e);
			} finally {
				ut.value = !1;
			}
			if (J || t !== q.value) return;
			if (lt.value = n.errors, !n.valid) {
				Object.keys(n.profileErrors).length && Joomla.renderMessages({ error: [U("COM_SMARTBROWSER_USAGE_PROFILE_INVALID")] });
				let e = Object.keys(n.errors).find((e) => Object.keys(n.errors[e]).some((t) => !n.profileErrors[e]?.[t]));
				e && (I.focusedId = e, ct.value++, gt.value || Joomla.renderMessages({ error: [U("COM_SMARTBROWSER_USAGE_INVALID")] }));
				return;
			}
			let r = {
				adapter: d.adapter.replace(/^flat-/, ""),
				mode: d.mode,
				resources: [...e]
			};
			H && (r.collectionItems = e.map((e) => ({
				selection: we(e, d.adapter.replace(/^flat-/, "")),
				usage: n.usage[M(e)] || {}
			}))), V && (r.pickerInstance = d.pickerInstance, r.usage = n.usage), document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r })), window.parent !== window && window.parent.document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r }));
		}, Vn = (e) => {
			let t = Rn.indexOf(I.viewOptions.gridSize);
			I.viewOptions.gridSize = Rn[Math.max(0, Math.min(Rn.length - 1, t + e))];
		}, Hn = (e) => ue(e, d.mode, qe(e), Ye, d.selectionTarget || "both"), Un = (e) => he(e, d.mode, qe(e), Ye), Wn = (e) => _e(e, d.mode, qe(e), Ye, d.selectionTarget || "both"), Gn = (e, t) => !I.busy && (e.local ? t.every((t) => Hn(t)?.id === e.id || Wn(t)?.id === e.id) : Ye(e, t)), Kn = (e) => {
			let t = Hn(e);
			t && qn(t, e);
		}, qn = (e, t) => {
			if (e && t && Gn(e, [t])) return e.id === "browseOpen" ? B(t.id) : e.id === "pickerSelect" ? H ? (I.selectedIds.includes(M(t)) || ze(t, !0), Bn(R.value)) : Bn([t]) : Xe(e, [t]);
		}, Jn = (e) => {
			if (V?.allowedAdapters?.length && !V.allowedAdapters.includes(e.replace(/^flat-/, "")) || e === d.adapter) return;
			K();
			let t = new URL(window.location.href);
			t.searchParams.set("adapter", e), t.searchParams.delete("node"), t.searchParams.delete("browseRoot"), V?.initialBrowseRoot && e.replace(/^flat-/, "") === V.initialAdapter.replace(/^flat-/, "") && t.searchParams.set("browseRoot", V.initialBrowseRoot), t.searchParams.delete("initialResource"), t.searchParams.delete("flatScope"), window.location.href = t.toString();
		}, Yn = async ({ id: e, value: t }) => {
			if (I.filters[e] = t, e === "menu" && t && !d.browseRoot && d.adapter === "menus") {
				await B(`menu:${t}`);
				return;
			}
			if (e === "menu" && t && !d.browseRoot && d.adapter === "flat-menus") {
				let e = new URL(window.location.href);
				e.searchParams.set("flatScope", `menu:${t}`), e.searchParams.set("flatFromNode", `menu:${t}`), window.location.assign(e.toString());
				return;
			}
			await B(I.selectedNode);
		}, Xn = async () => {
			(I.presentation.filters || []).forEach((e) => {
				I.filters[e.id] = e.default ?? "";
			}), await B(I.selectedNode);
		}, Zn = async (e) => {
			if (Z && d.flatBreadcrumb?.some((t) => t.id === e)) {
				if (e === d.flatBreadcrumb.at(-1)?.id) return;
				let t = new URL(window.location.href), n = t.searchParams.get("flatFromBrowseRoot") || (t.searchParams.has("flatFromAdapter") ? null : d.browseRoot);
				await Pn(Ht(window.location.href, d.adapter.replace(/^flat-/, ""), e, n));
				return;
			}
			if (d.adapter.startsWith("flat-") && e === I.selectedNode && e === I.roots[0]?.id) {
				I.search = "", I.sortBy = d.defaultSortBy || "", I.sortDirection = d.defaultSortDirection || "";
				let e = Wt(window.location.href, d.flatRootNode);
				if (e !== window.location.href) {
					(I.presentation.filters || []).forEach((e) => {
						I.filters[e.id] = e.default ?? "";
					}), await T(), window.location.assign(e);
					return;
				}
				await Xn();
				return;
			}
			await B(e);
		}, Qn = (e) => {
			I.sortBy === e ? I.sortDirection === "asc" ? I.sortDirection = "desc" : (I.sortBy = "", I.sortDirection = "") : (I.sortBy = e, I.sortDirection = "asc");
		}, $n = (e) => {
			I.sortBy = e, I.sortDirection = e ? I.sortDirection || "asc" : "";
		}, er = () => {
			let e = [
				"modified",
				"created",
				"both"
			], t = e.indexOf(I.viewOptions.detailsDateMode);
			I.viewOptions.detailsDateMode = e[(t + 1) % e.length];
		}, tr = async (e) => {
			Rt.value = !1, un.value && await Fe.uploadFiles(e.dataTransfer?.files);
		};
		return t(() => {
			if (Z && Mn({ flat: !0 }), !Z && mn && An.flat === !0) {
				window.location.replace(Ht(window.location.href, d.adapter, I.selectedNode, d.browseRoot));
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
						if (J) return;
						if (I.selectedResources = Object.fromEntries(t.resources.map((e) => [M(e), fe(e)])), I.selectedIds = t.items.map((e) => Ce(e.selection)), I.focusedId = I.selectedIds.find((e) => L.value.some((t) => M(t) === e)) || I.selectedIds[0] || null, V.initialFocus) {
							let e = Ce(V.initialFocus);
							I.selectedIds.includes(e) && (I.focusedId = e);
						}
					} catch (e) {
						J || Joomla.renderMessages({ error: [e.message] });
					}
				}
				if (!H && V?.initialSelection?.length && (!V.initialAdapter || V.initialAdapter.replace(/^flat-/, "") === d.adapter.replace(/^flat-/, ""))) {
					let e = V.initialSelection.map((e) => e && typeof e == "object" ? e.id : e);
					try {
						let t = await F.collection(d.multiple ? e : e.slice(0, 1));
						if (J) return;
						let n = new Set(d.allowedResourceTypes || []), r = t.resources.filter((e) => !e.unavailable && de(e, d.selectionTarget) && (!n.size || n.has(e.type)));
						I.selectedIds = r.map((e) => e.id), I.selectedResources = Object.fromEntries(r.map((e) => [e.id, e])), I.focusedId = I.selectedIds[0] || null;
					} catch (e) {
						J || Joomla.renderMessages({ error: [e.message] });
					}
				}
				d.adapter === "media" && d.initialResource && L.value.some((e) => e.id === d.initialResource) && (I.focusedId = M(L.value.find((e) => e.id === d.initialResource)));
			});
		}), (t, n) => (l(), v("div", {
			ref_key: "shellElement",
			ref: k,
			class: E(["smartbrowser-shell sb-redesigned-browser", {
				"is-site": s(d).application === "site",
				"is-picker": s(d).mode === "select" || !!s(V),
				"is-contained": s(d).mode === "select" || !!s(V) || w.value === "focus"
			}]),
			style: e({
				...s(On),
				"--sb-browser-available-height": A.value,
				"--sb-picker-footer-height": be.value,
				"--sb-picker-message-height": xe.value
			})
		}, [
			s(I).busy ? (l(), v("div", Xt, [n[17] ||= f("span", {
				class: "spinner-border",
				"aria-hidden": "true"
			}, null, -1), f("span", null, u(U("COM_SMARTBROWSER_WORKING")), 1)])) : y("", !0),
			m($e, {
				ref_key: "browserHeader",
				ref: me,
				"native-toolbar-target": s(d).nativeToolbarTarget,
				"heading-title": s(V) || s(d).mode === "select" ? st.value : We.value,
				"heading-subtitle": s(V) || s(d).mode === "select" ? s(V)?.subtitle : s(d).browserDescription,
				"heading-icon": In.value,
				actions: s(I).actions,
				available: (e) => Ye(e, s(R)),
				selection: s(R),
				"batch-available": s(d).mode === "manage",
				"can-cancel": typeof s(V)?.cancel == "function",
				"flat-available": s(mn),
				"flat-active": s(Z),
				"flat-busy": Dn.value,
				"filters-open": jn.value,
				filters: s(I).presentation.filters,
				"filter-values": s(I).filters,
				"manager-url": s(d).managerUrl,
				"manager-new-tab": s(d).application === "site",
				"dashboard-url": s(d).dashboardUrl,
				integrated: s(d).integrated,
				"selection-mode": s(d).mode === "select",
				"allow-no-user": s(d).allowNoUser,
				"can-complete": s(R).length > 0 && !ut.value,
				"confirm-label": s(V)?.confirmLabel,
				t: U,
				onAction: n[1] ||= (e) => Xe(e, s(R)),
				onBatch: n[2] ||= (e) => Jt.value?.open(),
				onCancel: n[3] ||= (e) => s(V)?.cancel(),
				onToggleFlat: Fn,
				onToggleFilters: Nn,
				onFilter: Yn,
				onClearFilters: Xn,
				onComplete: n[4] ||= (e) => Bn(s(R)),
				onNoUser: n[5] ||= (e) => Bn([{
					id: "user:0",
					type: "user",
					title: ""
				}])
			}, {
				preferences: a(() => [m(te, {
					t: U,
					adapter: s(d).adapter,
					"current-view": "",
					onSaved: En,
					onResetView: Tn
				}, null, 8, ["adapter"])]),
				"display-controls": a(() => [s(V)?.toggleSize ? (l(), v("button", {
					key: 0,
					type: "button",
					class: E(["resource-icon-button resource-display-toggle", { active: ot.value }]),
					"aria-pressed": ot.value,
					title: U(ot.value ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE"),
					"aria-label": U(ot.value ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE"),
					onClick: n[0] ||= (e) => ot.value = s(V).toggleSize()
				}, [f("span", {
					class: E(ot.value ? "fas fa-compress" : "fas fa-expand"),
					"aria-hidden": "true"
				}, null, 2)], 10, Zt)) : y("", !0), s(x) ? (l(), v("button", {
					key: 1,
					type: "button",
					class: E(["resource-icon-button resource-display-toggle", { active: w.value !== "normal" }]),
					"aria-pressed": w.value !== "normal",
					title: U(Ne.value),
					"aria-label": U(Ne.value),
					onClick: Pe
				}, [f("span", {
					class: E(w.value === "normal" ? "fas fa-arrows-alt-h" : w.value === "wide" ? "fas fa-expand" : "fas fa-compress"),
					"aria-hidden": "true"
				}, null, 2)], 10, Qt)) : y("", !0)]),
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
			m(ie, {
				ref_key: "batchDialog",
				ref: Jt,
				selection: s(R),
				adapter: s(d).adapter,
				filters: s(I).presentation.filters,
				"batch-options": s(I).presentation.batchOptions,
				"sort-fields": s(I).presentation.sortFields,
				"ordering-available": dn.value,
				t: U,
				onApply: zn
			}, null, 8, [
				"selection",
				"adapter",
				"filters",
				"batch-options",
				"sort-fields",
				"ordering-available"
			]),
			f("div", { class: E(["smartbrowser-layout", { "tree-collapsed": Y.value }]) }, [
				!Y.value && (!s(Q) || X.value) ? (l(), p(kt, {
					key: 0,
					adapters: hn.value,
					"active-adapter": s(d).adapter,
					roots: X.value?.roots || s(I).roots,
					nodes: X.value?.nodes || s(I).navigationNodes || s(I).nodes,
					breadcrumb: X.value?.breadcrumb || s(I).breadcrumb,
					"selected-node": X.value?.nodeId || s(I).selectedNode,
					t: U,
					onOpen: gn,
					onAdapter: Jn
				}, null, 8, [
					"adapters",
					"active-adapter",
					"roots",
					"nodes",
					"breadcrumb",
					"selected-node"
				])) : y("", !0),
				f("div", $t, [f("button", {
					type: "button",
					class: "resource-sidebar-handle",
					title: U(Y.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-label": U(Y.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-expanded": !Y.value,
					"aria-busy": qt.value,
					onClick: n[6] ||= (e) => Y.value = !Y.value
				}, [qt.value ? (l(), v("span", tn)) : (l(), v("span", {
					key: 1,
					class: E(Y.value ? "fas fa-chevron-right" : "fas fa-chevron-left"),
					"aria-hidden": "true"
				}, null, 2))], 8, en)]),
				f("main", nn, [
					m(yt, {
						"history-entries": vn.value,
						"history-previous": yn.value,
						onHistoryBack: wn,
						onHistoryOpen: Sn,
						onHistoryClear: Cn,
						breadcrumb: _n.value,
						root: s(I).roots[0],
						"root-icon": Ln.value,
						"icon-only-root": _n.value.length > 1,
						search: s(I).search,
						"sort-by": s(I).sortBy,
						"sort-direction": s(I).sortDirection,
						"sort-fields": s(I).presentation.sortFields,
						"ordering-field": s(I).presentation.orderingField,
						views: s(Tt),
						"active-view": s(I).activeView,
						"grid-size": s(I).viewOptions.gridSize,
						"details-thumbnails": s(I).viewOptions.detailsThumbnails,
						"details-date-mode": s(I).viewOptions.detailsDateMode,
						columns: Ft.value,
						"hidden-columns": s(I).hiddenColumns,
						"shown-columns": s(I).shownColumns,
						"show-info": gt.value,
						multiple: s(d).multiple,
						"can-invert": s(d).multiple && s(Le).length > 0,
						"reorder-visible": dn.value,
						"reorder-enabled": fn.value,
						t: Ue,
						onOpen: Zn,
						onInvertSelection: s(Ve),
						onReorder: pn,
						onSearch: n[7] ||= (e) => s(I).search = e,
						onSortBy: $n,
						onSortDirectionValue: n[8] ||= (e) => s(I).sortDirection = e,
						onResize: Vn,
						onToggleThumbnails: n[9] ||= (e) => s(I).viewOptions.detailsThumbnails = !s(I).viewOptions.detailsThumbnails,
						onToggleDateField: er,
						onToggleColumn: Lt,
						onView: At,
						onInfo: _t
					}, null, 8, [
						"history-entries",
						"history-previous",
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
					]),
					f("div", {
						class: E(["resource-browser", {
							loading: Ot.value,
							"is-dragging": Rt.value,
							"info-open": gt.value,
							"usage-open": pt.value
						}]),
						"aria-busy": Ot.value,
						onDragenter: n[12] ||= b((e) => Rt.value = un.value, ["prevent"]),
						onDragover: n[13] ||= b(() => {}, ["prevent"]),
						onDragleave: n[14] ||= b((e) => Rt.value = !1, ["self"]),
						onDrop: b(tr, ["prevent"])
					}, [
						Ot.value ? (l(), v("div", an, [n[18] ||= f("span", {
							class: "spinner-border",
							"aria-hidden": "true"
						}, null, -1), f("span", null, u(U("COM_SMARTBROWSER_LOADING")), 1)])) : s(L).length ? (l(), p(o(Et.value.component), {
							key: 2,
							resources: Pt.value,
							"selected-ids": s(I).selectedIds,
							"focused-id": s(I).focusedId,
							"all-selected": s(Le).length > 0 && s(Le).every((e) => s(I).selectedIds.includes(s(M)(e))),
							options: s(I).viewOptions,
							"selection-controls": !s(V) || s(d).multiple !== !1,
							actions: s(I).actions,
							"action-available": Gn,
							"default-action": Hn,
							"preview-action": Un,
							"modified-action": Wn,
							"sort-by": s(I).sortBy,
							"sort-direction": s(I).sortDirection,
							"sort-fields": s(I).presentation.sortFields,
							"ordering-field": s(I).presentation.orderingField,
							columns: It.value,
							"grid-fields": s(I).presentation.gridFields,
							t: Ue,
							onSelect: s(ze),
							onFocus: s(Re),
							onSelectAll: s(Be),
							onOpen: s(B),
							onActivate: Kn,
							onAction: qn,
							onSort: Qn
						}, {
							end: a(() => [s(I).loadingMode === "smart" ? (l(), p(Bt, {
								key: 0,
								enabled: !!s(I).pagination?.hasMore && !s(I).loading && !s(I).loadingMore && !s(I).loadingAll && !s(I).error,
								"request-key": `${s(I).navigationRevision}:${s(I).pagination?.nextOffset}`,
								onLoad: n[10] ||= (e) => s(r).loadMore()
							}, null, 8, ["enabled", "request-key"])) : y("", !0)]),
							_: 1
						}, 40, [
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
						])) : (l(), v("div", on, [f("span", {
							class: E(s(I).search ? "fas fa-search" : un.value ? "fas fa-cloud-upload-alt" : In.value),
							"aria-hidden": "true"
						}, null, 2), f("p", null, u(s(I).search ? U("COM_SMARTBROWSER_NO_RESULTS") : un.value ? U("COM_SMARTBROWSER_DROP_UPLOAD") : U("COM_SMARTBROWSER_EMPTY_STATE")), 1)])),
						un.value && Rt.value ? (l(), v("div", sn, [n[19] ||= f("span", { class: "fas fa-cloud-upload-alt" }, null, -1), h(u(U("COM_SMARTBROWSER_DROP_UPLOAD")), 1)])) : y("", !0),
						gt.value ? (l(), v("div", cn, [m(Se, {
							resource: s(z),
							fields: s(z)?.collectionPresentation?.infoFields || s(I).presentation.infoFields,
							t: U,
							"usage-definitions": dt.value,
							"usage-values": ft.value,
							"usage-errors": lt.value[s(M)(s(z))] || {},
							"usage-editors": s(V)?.editors,
							"resolve-reference": rt,
							"usage-revision": ct.value,
							"preview-actions": wt.value,
							"preview-context": xt.value,
							"can-preview": !!Un(s(z)) && Ke(s(z)).canPreview(s(z)) && !s(I).busy,
							onPreview: n[11] ||= (e) => qn(Un(s(z)), s(z)),
							onUsageChange: bt
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
						])])) : y("", !0)
					], 42, rn),
					m(zt, {
						page: s(I).pagination,
						total: s(L).length,
						smart: s(I).loadingMode === "smart",
						loaded: s(I).loadedCount,
						busy: s(I).loading || s(I).loadingMore || s(I).loadingAll,
						t: U,
						onPage: se,
						onMore: n[15] ||= (e) => s(r).loadMore(),
						onAll: n[16] ||= (e) => s(r).loadAll()
					}, null, 8, [
						"page",
						"total",
						"smart",
						"loaded",
						"busy"
					])
				])
			], 2),
			s(He) ? (l(), v("div", {
				key: 1,
				ref_key: "messagesElement",
				ref: ge,
				class: "sb-browser-messages"
			}, null, 512)) : y("", !0),
			s(He) ? (l(), v("details", {
				key: 2,
				ref_key: "pickerFooter",
				ref: ve,
				class: "resource-picker-collection"
			}, [f("summary", null, [
				n[20] ||= f("span", {
					class: "fas fa-chevron-up resource-picker-collection-chevron",
					"aria-hidden": "true"
				}, null, -1),
				h(u(U("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": ", 1),
				f("span", null, u(s(I).selectedIds.length), 1)
			]), f("div", ln, [s(W) ? (l(), p(pe, {
				key: 0,
				model: s(W),
				api: s(F),
				config: tt,
				t: U
			}, null, 8, ["model", "api"])) : y("", !0)])], 512)) : y("", !0)
		], 6));
	}
}, dn = "supjx.smartbrowser.preferencesResetToken";
function fn(e, t) {
	if (!t || e.getItem(dn) === t) return !1;
	let n = [];
	for (let t = 0; t < e.length; t++) {
		let r = e.key(t);
		r?.startsWith("supjx.smartbrowser.") && r !== dn && r !== "supjx.smartbrowser.editorReturn" && n.push(r);
	}
	return n.forEach((t) => e.removeItem(t)), e.setItem(dn, t), !0;
}
//#endregion
//#region resources/js/core/resetSessionNavigation.js
var pn = "supjx.smartbrowser.";
function mn(e, t, n) {
	if (!n) return !1;
	let r = `${pn}session.${t}`, i = e.getItem(r);
	if (e.setItem(r, n), !i || i === n) return !1;
	for (let t = 0; t < e.length; t++) {
		let n = e.key(t);
		if (!(!n?.startsWith(pn) || n.startsWith(`${pn}ui.`) || n.startsWith(`${pn}session.`))) try {
			let t = JSON.parse(e.getItem(n));
			if (!t || typeof t != "object" || Array.isArray(t) || !("selectedNode" in t) && !("filters" in t)) continue;
			delete t.selectedNode, delete t.filters, e.setItem(n, JSON.stringify(t));
		} catch {}
	}
	return !0;
}
function Z(e) {
	let t = new URL(e);
	if (t.searchParams.delete("node"), t.searchParams.has("flatFromAdapter")) {
		let e = t.searchParams.get("flatFromBrowseRoot");
		e ? t.searchParams.set("browseRoot", e) : t.searchParams.delete("browseRoot"), t.searchParams.delete("flatScope"), t.searchParams.delete("flatFromNode"), t.searchParams.delete("flatFromBrowseRoot"), t.searchParams.delete("flatFromAdapter");
	}
	return t.toString();
}
//#endregion
//#region resources/js/main.js
var Q = Joomla.getOptions("com_smartbrowser", {}), hn = k(), gn = A(hn, Q.adapter);
gn !== "inherit" && (Q.showContextResources = gn === "show"), hn.editorMode !== "inherit" && (Q.editorMode = hn.editorMode);
var _n = null;
try {
	_n = window.parent !== window && Q.pickerInstance ? window.parent.SmartBrowserPicker?.context(Q.pickerInstance, window) : null;
} catch {}
Q.pickerContext = _n, fn(window.sessionStorage, Q.preferencesResetToken);
var vn = mn(window.sessionStorage, Q.application, Q.csrfToken) ? Z(window.location.href) : window.location.href;
if (vn !== window.location.href) window.location.replace(vn);
else {
	let e = new ce(Q), t = Kt(Q), n = new X(D(), t, Q);
	_n && (Q.pickerRememberedInfo = n.load({}).showInfo);
	let r = ge().register({
		id: "grid",
		label: "COM_SMARTBROWSER_GRID",
		icon: "fas fa-th",
		component: be,
		supportsSize: !0,
		controls: ["sort", "zoom"],
		options: { gridSize: "md" }
	}).register({
		id: "details",
		label: "COM_SMARTBROWSER_DETAILS",
		icon: "fas fa-list",
		component: me,
		supportsSize: !1,
		controls: ["thumbnails", "dateField"],
		options: {
			detailsThumbnails: !1,
			detailsDateMode: "modified"
		}
	}), i = ve({
		options: Q,
		api: e,
		persistence: n,
		viewRegistry: r
	}), a = new Ee(e, i.state, () => (Q.mode === "manage" && i.state.pagination && !Q.selectionState && (i.state.selectedIds = [], i.state.selectedResources = {}), i.load()), (e) => Joomla.Text?._(e, e) || e, Q.editorMode, Q.application);
	window.SmartBrowser = {
		...window.SmartBrowser,
		open(e = {}) {
			let t = e.showContextResources ?? Q.showContextResources ?? !1, n = e.browseRoot ? `&browseRoot=${encodeURIComponent(e.browseRoot)}` : "", r = e.defaultView ? `&defaultView=${encodeURIComponent(e.defaultView)}` : "", i = e.allowedResourceTypes?.length ? `&allowedResourceTypes=${encodeURIComponent(e.allowedResourceTypes.join(","))}` : "", a = e.showAdapterSwitcher ? "&showAdapterSwitcher=1" : "";
			window.location.href = `${Q.returnUrl}&adapter=${encodeURIComponent(e.adapter || Q.adapter)}&mode=${encodeURIComponent(e.mode || "select")}&multiple=${+!!e.multiple}&selectionTarget=${encodeURIComponent(e.selectionTarget || "item")}&showContextResources=${+!!t}${n}${r}${i}${a}`;
		},
		registerView: (e) => r.register(e)
	}, x(un).provide("browser", i).provide("persistence", n).provide("resourceApi", e).provide("smartBrowserOptions", Q).provide("viewRegistry", r).provide("actionDriver", a).mount("#smartbrowser-app");
}
//#endregion
