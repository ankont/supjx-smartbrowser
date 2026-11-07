import { B as e, C as t, D as n, E as r, I as i, M as a, O as o, R as s, S as c, T as l, V as u, c as d, d as f, f as p, g as m, h, j as g, l as _, m as v, p as y, s as b, t as x, u as S, v as C, w, x as T, z as E } from "./visual-runtime-CJIQlqNK.js?v=5.2.0";
import { t as D } from "./visual-runtime-9kQymmoE.js?v=5.2.0";
import { a as ee, i as O, n as k, r as te, t as ne } from "./visual-runtime-BcqBP5rk.js?v=5.2.0";
import { C as re, S as ie, T as ae, _ as oe, a as se, b as A, c as ce, d as le, f as ue, g as de, h as fe, i as pe, l as me, m as he, n as ge, p as _e, r as ve, t as ye, u as be, v as xe, x as Se, y as j } from "./visual-runtime-DbGbfChU.js?v=5.2.0";
import { a as M, i as Ce, o as we } from "./visual-runtime-CCt1nnbc.js?v=5.2.0";
import { t as Te } from "./visual-runtime-DAGXuL4O.js?v=5.2.0";
import { t as Ee } from "./visual-runtime-BVhlxhI5.js?v=5.2.0";
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
function Ae(e) {
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
function je(e, t = () => {}) {
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
			let t = Ae(e);
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
function Me(e, t, n) {
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
			let t = Ae(e);
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
var Ne = { class: "sb-browser-heading" }, Pe = { class: "sb-browser-heading-leading" }, P = [
	"disabled",
	"title",
	"aria-label"
], Fe = [
	"href",
	"title",
	"aria-label"
], F = { class: "sb-browser-heading-copy" }, I = {
	key: 1,
	class: "sb-browser-description"
}, Ie = { class: "sb-heading-controls" }, L = ["title", "aria-label"], R = [
	"href",
	"target",
	"rel",
	"title",
	"aria-label"
], z = ["title", "aria-label"], Le = { class: "resource-action-label" }, Re = [
	"title",
	"aria-label",
	"disabled",
	"onClick"
], ze = {
	key: 0,
	class: "resource-action-label"
}, Be = [
	"aria-expanded",
	"title",
	"aria-label"
], B = { class: "resource-action-label" }, V = {
	key: 0,
	class: "resource-action-menu",
	role: "menu"
}, Ve = ["disabled", "onClick"], H = [
	"disabled",
	"title",
	"aria-label"
], He = { class: "resource-action-label" }, Ue = {
	key: 3,
	class: "resource-filter-buttons"
}, We = [
	"aria-expanded",
	"title",
	"aria-label"
], Ge = { class: "resource-action-label" }, Ke = {
	key: 0,
	class: "badge bg-primary"
}, qe = ["disabled", "title"], Je = [
	"title",
	"aria-label",
	"aria-pressed",
	"aria-busy",
	"disabled"
], U = ["aria-label"], Ye = {
	key: 1,
	class: "fas fa-layer-group",
	"aria-hidden": "true"
}, Xe = { class: "resource-action-label" }, Ze = {
	key: 0,
	class: "resource-action-filters"
}, Qe = ["value", "onChange"], $e = ["value"], et = {
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
		let g = e, b = g.nativeToolbarTarget ? document.querySelector(g.nativeToolbarTarget) : null, x = b?.parentElement.querySelector("#sb-native-intro"), C = b?.parentElement.querySelector("#sb-native-manager"), T = i(null);
		m({ element: T });
		let D = i(!1), ee = i(null), O = i(null), k, te = 0, ne = 0, re = () => {
			let e = O.value;
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
		}, oe = S(() => (g.filters || []).filter((e) => String(g.filterValues[e.id] ?? e.default ?? "") !== String(e.default ?? "")).length), se = (e, t) => g.t(t.label), A = S(() => {
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
		}), ce = {
			item: 0,
			node: 1,
			contextual: 2
		}, le = S(() => A.value.filter((e) => e.primary || e.creationRole || [
			"upload",
			"createNode",
			"createChild",
			"newArticle"
		].includes(e.id)).sort((e, t) => (ce[e.creationRole] ?? 3) - (ce[t.creationRole] ?? 3))), ue = S(() => A.value.filter((e) => !le.value.includes(e))), de = (e) => {
			ee.value?.contains(e.target) || (D.value = !1);
		}, fe = (e) => {
			e.key === "Escape" && (D.value = !1);
		};
		return t(() => {
			document.addEventListener("click", de), document.addEventListener("keydown", fe), k = new ResizeObserver(([e]) => {
				e.contentRect.width !== ne && (ne = e.contentRect.width, ie());
			}), k.observe(O.value), b && (k.observe(b), k.observe(b.parentElement)), document.fonts?.ready.then(ie), ie();
		}), w(ie), c(() => {
			document.removeEventListener("click", de), document.removeEventListener("keydown", fe), k?.disconnect(), cancelAnimationFrame(te);
		}), (t, i) => (l(), p(_, {
			to: s(b) || "body",
			disabled: !s(b)
		}, [f("div", {
			ref_key: "headerElement",
			ref: T,
			class: E(["resource-actions-area sb-browser-header", { "is-native-header": !!s(b) }])
		}, [
			f("header", Ne, [(l(), p(_, {
				to: s(x) || "body",
				disabled: !s(x)
			}, [f("div", Pe, [
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
				], 8, P)) : y("", !0),
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
				})), e.headingSubtitle ? (l(), v("p", I, u(e.headingSubtitle), 1)) : y("", !0)])
			])], 8, ["to", "disabled"])), (l(), p(_, {
				to: s(C) || "body",
				disabled: !s(C)
			}, [f("div", Ie, [
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
				n(t.$slots, "preferences"),
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
				}, null, -1)]], 8, R)) : y("", !0),
				n(t.$slots, "display-controls")
			])], 8, ["to", "disabled"]))]),
			f("div", {
				ref_key: "actionRow",
				ref: O,
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
					f("span", Le, u(e.t("JOPTION_NO_USER")), 1)
				], 8, z)) : y("", !0),
				(l(!0), v(d, null, r(le.value, (n) => (l(), v("button", {
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
				}, null, 2), n.creationRole === "contextual" ? y("", !0) : (l(), v("span", ze, u(e.t(n.label)), 1))], 10, Re))), 128)),
				ue.value.length ? (l(), v("div", {
					key: 1,
					ref_key: "actionMenu",
					ref: ee,
					class: "resource-action-menu-wrap"
				}, [f("button", {
					type: "button",
					class: "btn btn-outline-secondary resource-action-menu-toggle",
					"aria-expanded": D.value,
					title: e.t("COM_SMARTBROWSER_ACTIONS"),
					"aria-label": e.t("COM_SMARTBROWSER_ACTIONS"),
					onClick: i[3] ||= (e) => D.value = !D.value
				}, [
					i[17] ||= f("span", {
						class: "fas fa-ellipsis-h",
						"aria-hidden": "true"
					}, null, -1),
					i[18] ||= h(),
					f("span", B, u(e.t("COM_SMARTBROWSER_ACTIONS")), 1),
					i[19] ||= h(),
					i[20] ||= f("span", {
						class: "fas fa-angle-down",
						"aria-hidden": "true"
					}, null, -1)
				], 8, Be), D.value ? (l(), v("div", V, [(l(!0), v(d, null, r(ue.value, (n) => (l(), v("div", {
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
						D.value = !1, t.$emit("action", n);
					}
				}, [f("span", {
					class: E(n.icon),
					"aria-hidden": "true"
				}, null, 2), h(" " + u(e.t(n.label)), 1)], 10, Ve)]))), 128))])) : y("", !0)], 512)) : y("", !0),
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
				e.filters?.length ? (l(), v("div", Ue, [f("button", {
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
					f("span", Ge, u(e.t("COM_SMARTBROWSER_FILTER_OPTIONS")), 1),
					oe.value ? (l(), v("span", Ke, u(oe.value), 1)) : y("", !0),
					f("span", {
						class: E(["fas fa-angle-down resource-filter-caret", { open: e.filtersOpen }]),
						"aria-hidden": "true"
					}, null, 2)
				], 10, We), f("button", {
					type: "button",
					class: "btn resource-filter-clear",
					disabled: !oe.value,
					title: e.t("JCLEAR"),
					onClick: i[6] ||= (e) => t.$emit("clear-filters")
				}, u(e.t("JCLEAR")), 9, qe)])) : y("", !0),
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
				}, null, 8, U)) : (l(), v("span", Ye)), f("span", Xe, u(e.t("COM_SMARTBROWSER_FLAT_VIEW")), 1)], 10, Je)) : y("", !0)
			], 2),
			e.filters?.length && e.filtersOpen ? (l(), v("div", Ze, [(l(!0), v(d, null, r(e.filters, (n) => (l(), v("label", { key: n.id }, [f("span", null, u(e.t(n.label)), 1), n.type === "select" ? (l(), v("select", {
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
			}, u(se(n, e)), 9, $e))), 128))], 40, Qe)) : y("", !0)]))), 128))])) : y("", !0)
		], 2)], 8, ["to", "disabled"]));
	}
};
//#endregion
//#region resources/js/core/nodeHistory.js
function tt(e, t, n = "") {
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
var W = {
	class: "resource-breadcrumb",
	"aria-label": "Breadcrumb"
}, nt = [
	"title",
	"aria-label",
	"onClick"
], G = {
	key: 1,
	class: "resource-breadcrumb-title"
}, rt = {
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
		return (t, i) => (l(), v("nav", W, [(l(!0), v(d, null, r(n.value, (n, r) => (l(), v("button", {
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
		}, null, 2)) : y("", !0), r !== 0 || !e.iconOnlyRoot ? (l(), v("span", G, u(n.title), 1)) : y("", !0)], 10, nt))), 128))]));
	}
}, K = {
	class: "resource-toolbar",
	role: "toolbar"
}, it = { class: "resource-toolbar-primary" }, at = { class: "resource-view-controls" }, ot = ["aria-label"], st = [
	"disabled",
	"title",
	"aria-label"
], ct = {
	key: 0,
	class: "resource-history-empty"
}, lt = ["title", "onClick"], ut = [
	"disabled",
	"title",
	"aria-label"
], dt = [
	"value",
	"aria-label",
	"placeholder"
], ft = ["title", "aria-label"], pt = ["disabled"], mt = ["disabled"], ht = ["title"], gt = { "aria-hidden": "true" }, _t = { class: "resource-mode-controls" }, vt = ["title", "onClick"], yt = ["title"], bt = {
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
		return (t, i) => (l(), v("div", K, [f("div", it, [m(rt, {
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
			}, null, -1)]], 8, st), m(j, {
				ref_key: "historyPopup",
				ref: n,
				label: e.t("COM_SMARTBROWSER_HISTORY_TITLE"),
				icon: "fas fa-caret-down",
				width: 360,
				"panel-class": "resource-history-menu"
			}, {
				default: a(() => [
					e.historyEntries?.length ? y("", !0) : (l(), v("p", ct, u(e.t("COM_SMARTBROWSER_HISTORY_EMPTY")), 1)),
					(l(!0), v(d, null, r(e.historyEntries, (e) => (l(), v("button", {
						key: e.id,
						type: "button",
						class: "btn btn-outline-secondary",
						title: e.title,
						onClick: (r) => {
							n.value?.close(), t.$emit("history-open", e.id);
						}
					}, u(e.title), 9, lt))), 128)),
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
			}, 8, ["label"])], 8, ot),
			e.reorderVisible ? (l(), p(A, {
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
			}, null, -1)]], 8, ut)) : y("", !0),
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
				}, null, 40, dt), f("button", {
					type: "submit",
					class: "btn btn-primary",
					title: e.t("COM_SMARTBROWSER_SEARCH"),
					"aria-label": e.t("COM_SMARTBROWSER_SEARCH")
				}, [...i[18] ||= [f("span", {
					class: "fas fa-search",
					"aria-hidden": "true"
				}, null, -1)]], 8, ft)], 32)]),
				_: 1
			}, 8, ["label"]),
			x("sort") ? (l(), p(oe, {
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
			}, null, -1)]], 8, pt)) : y("", !0),
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
			}, null, -1)]], 8, mt)) : y("", !0),
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
			}, null, -1), f("small", gt, u(g.value), 1)], 8, ht)) : y("", !0),
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
			f("div", _t, [(l(!0), v(d, null, r(e.views, (n) => (l(), v("button", {
				key: n.id,
				type: "button",
				class: E(["resource-icon-button", { active: e.activeView === n.id }]),
				title: e.t(n.label),
				onClick: (e) => t.$emit("view", n.id)
			}, [f("span", {
				class: E(n.icon),
				"aria-hidden": "true"
			}, null, 2)], 10, vt))), 128))]),
			f("button", {
				type: "button",
				class: E(["resource-icon-button", { active: e.showInfo }]),
				title: e.t("COM_SMARTBROWSER_TOGGLE_INFO"),
				onClick: i[14] ||= (e) => t.$emit("info")
			}, [...i[23] ||= [f("span", {
				class: "fas fa-info",
				"aria-hidden": "true"
			}, null, -1)]], 10, yt)
		])])]));
	}
}, xt = {
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
}, St = ["aria-label"], q = { class: "resource-tree-content" }, Ct = ["open", "onToggle"], wt = ["onClick"], Tt = {
	key: 0,
	class: "resource-adapter-roots"
}, Et = ["onClick"], Dt = {
	key: 1,
	class: "resource-tree-branch"
}, Ot = ["onClick"], kt = ["onClick"], At = {
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
	setup(t, { emit: n }) {
		let i = t, a = n, o = (e, t) => {
			e.target.open && t !== i.activeAdapter && a("adapter", t);
		}, s = (e) => {
			e === i.activeAdapter ? i.roots[0] && a("open", i.roots[0].id) : a("adapter", e);
		}, c = (e) => i.breadcrumb.some((t) => t.id === e.id), p = (e) => i.breadcrumb.filter((t) => t.id !== e.id), g = S(() => i.roots.some((e) => e.visible !== !1 || c(e) && (p(e).length > 0 || i.nodes.length > 0))), _ = (e, t) => ({ paddingInlineStart: `${10 + (e.visible === !1 ? 0 : 18) + t * 18}px` });
		return (n, i) => (l(), v("nav", {
			class: "resource-sidebar",
			"aria-label": t.t("COM_SMARTBROWSER_VIEW")
		}, [f("div", q, [(l(!0), v(d, null, r(t.adapters, (i) => (l(), v("details", {
			key: i.id,
			class: "resource-adapter",
			open: i.id === t.activeAdapter,
			onToggle: (e) => o(e, i.id)
		}, [f("summary", { onClick: b((e) => s(i.id), ["prevent"]) }, [f("span", {
			class: E(i.icon),
			"aria-hidden": "true"
		}, null, 2), h(" " + u(i.title), 1)], 8, wt), i.id !== t.activeAdapter || g.value ? (l(), v("div", Tt, [(l(!0), v(d, null, r(i.id === t.activeAdapter ? t.roots : [], (a) => (l(), v("section", {
			key: a.id,
			class: E(["resource-tree-root", { "root-hidden": a.visible === !1 }])
		}, [a.visible === !1 ? y("", !0) : (l(), v("button", {
			key: 0,
			type: "button",
			class: E({ active: t.selectedNode === a.id }),
			onClick: (e) => n.$emit("open", a.id)
		}, [f("span", {
			class: E(["resource-tree-root-icon", a.useResourceIcon ? a.icon : i.icon]),
			"aria-hidden": "true"
		}, null, 2), f("span", null, u(a.title), 1)], 10, Et)), c(a) ? (l(), v("div", Dt, [(l(!0), v(d, null, r(p(a), (r) => (l(), v("button", {
			key: r.id,
			type: "button",
			class: E({ active: t.selectedNode === r.id }),
			style: e(_(a, p(a).indexOf(r))),
			onClick: (e) => n.$emit("open", r.id)
		}, [m(xt, {
			resource: r,
			open: !0
		}, null, 8, ["resource"]), f("span", null, u(r.title), 1)], 14, Ot))), 128)), (l(!0), v(d, null, r(t.nodes, (t) => (l(), v(d, { key: t.id }, [t.navigable === !1 ? (l(), v("div", {
			key: 1,
			class: "resource-tree-entry resource-tree-static",
			style: e(_(a, p(a).length))
		}, [m(xt, { resource: t }, null, 8, ["resource"]), f("span", null, u(t.title), 1)], 4)) : (l(), v("button", {
			key: 0,
			type: "button",
			class: "resource-tree-entry",
			style: e(_(a, p(a).length)),
			onClick: (e) => n.$emit("open", t.id)
		}, [m(xt, { resource: t }, null, 8, ["resource"]), f("span", null, u(t.title), 1)], 12, kt))], 64))), 128))])) : y("", !0)], 2))), 128))])) : y("", !0)], 40, Ct))), 128))])], 8, St));
	}
}, jt = /* @__PURE__ */ new Set([
	"articles",
	"categories",
	"tags",
	"articles-by-tag",
	"menus",
	"users",
	"media"
]), Mt = (e, t, n, r = !1) => {
	let i = r ? "" : e.startsWith("flat-") ? new URL(n).searchParams.get("flatFromBrowseRoot") || "" : t || "";
	return `supjx.smartbrowser.ui.${e.replace(/^flat-/, "")}.${i}`;
}, Nt = (e, t, n, r) => {
	let i = new URL(e);
	if (!jt.has(t)) return i.toString();
	i.searchParams.set("flatFromAdapter", t), i.searchParams.set("flatFromNode", n), r ? i.searchParams.set("flatFromBrowseRoot", r) : i.searchParams.delete("flatFromBrowseRoot");
	let a = `flat-${t}`;
	if (i.searchParams.set("adapter", a), i.searchParams.set("node", `${a}:root`), t === "articles" || t === "categories") {
		let e = n.startsWith("category:") ? n : r;
		e?.startsWith("category:") ? i.searchParams.set("browseRoot", e) : i.searchParams.delete("browseRoot"), i.searchParams.delete("flatScope");
	} else r ? i.searchParams.set("browseRoot", r) : i.searchParams.delete("browseRoot"), i.searchParams.set("flatScope", n);
	return i.toString();
}, Pt = (e, t) => {
	let n = new URL(e), r = n.searchParams.get("flatFromAdapter"), i = jt.has(r) ? r : "articles", a = n.searchParams.get("flatFromBrowseRoot") || (r ? null : t), o = n.searchParams.get("flatFromNode") || a || "content:root";
	n.searchParams.set("adapter", i), n.searchParams.set("node", o), a ? n.searchParams.set("browseRoot", a) : n.searchParams.delete("browseRoot");
	for (let e of [
		"flatFromAdapter",
		"flatFromNode",
		"flatFromBrowseRoot",
		"flatScope"
	]) n.searchParams.delete(e);
	return n.toString();
}, Ft = (e, t) => {
	let n = new URL(e);
	if (!n.searchParams.get("adapter")?.startsWith("flat-") || !t) return n.toString();
	let r = n.searchParams.get("adapter");
	if (n.searchParams.set("node", `${r}:root`), n.searchParams.set("flatFromNode", t), r === "flat-articles" || r === "flat-categories") {
		let e = n.searchParams.get("flatFromBrowseRoot") || (n.searchParams.has("flatFromAdapter") ? null : n.searchParams.get("browseRoot"));
		e ? n.searchParams.set("browseRoot", e) : n.searchParams.delete("browseRoot"), n.searchParams.delete("flatScope");
	} else n.searchParams.set("flatScope", t);
	return n.toString();
}, It = (e) => e.mode === "manage" && !e.pickerInstance && !e.pickerContext, Lt = (e, t = D()) => It(e) ? `supjx.smartbrowser.${e.adapter.replace(/^flat-/, "")}` : `supjx.smartbrowser.picker.${ee(e, O(t))}.${e.adapter.replace(/^flat-/, "")}`, Rt = class {
	constructor(e = D(), t = "supjx.smartbrowser.media", n = null) {
		this.storage = e, this.key = t, this.nodeKey = n ? k(n, e) : null;
	}
	load(e) {
		try {
			let t = {
				...e,
				...JSON.parse(this.storage.getItem(this.key) || "{}")
			};
			return this.nodeKey && (t.selectedNode = JSON.parse(this.storage.getItem(this.nodeKey) || "{}").selectedNode || t.selectedNode), t;
		} catch {
			return { ...e };
		}
	}
	save(e) {
		let t = {
			...this.nodeKey ? {} : { selectedNode: e.selectedNode },
			activeView: e.activeView,
			viewOptions: e.viewOptions,
			hiddenColumns: e.hiddenColumns,
			shownColumns: e.shownColumns,
			sortBy: e.sortBy,
			sortDirection: e.sortDirection,
			showInfo: e.showInfo,
			filters: e.filters
		};
		if (this.storage.setItem(this.key, JSON.stringify(t)), this.nodeKey) {
			let t = {};
			try {
				t = JSON.parse(this.storage.getItem(this.nodeKey) || "{}");
			} catch {}
			this.storage.setItem(this.nodeKey, JSON.stringify({
				...t,
				selectedNode: e.selectedNode
			}));
		}
	}
}, zt = {
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
}, Bt = (e) => ({
	stateLabel: "status",
	width: "dimension",
	link: "url"
})[e.split(".").pop()] || e.split(".").pop();
function Vt(e, t) {
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
		...(zt[o] || []).map(([e, t, n]) => ({
			id: Bt(e),
			label: t,
			source: `metadata.${e}`,
			format: n
		}))
	], c = i.has("dates");
	for (let e of s) {
		if (!e.source || !e.label || e.source === "metadata.locationPath" || o === "articles" && e.source === "metadata.categoryPath") continue;
		let t = e.id || Bt(e.source);
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
var Ht = {
	key: 0,
	class: "smartbrowser-busy",
	role: "status",
	"aria-live": "polite"
}, Ut = [
	"aria-pressed",
	"title",
	"aria-label"
], Wt = [
	"aria-pressed",
	"title",
	"aria-label"
], Gt = { class: "sb-tree-handle-rail" }, Kt = [
	"title",
	"aria-label",
	"aria-expanded",
	"aria-busy"
], qt = {
	key: 0,
	class: "spinner-border spinner-border-sm",
	"aria-hidden": "true"
}, Jt = { class: "resource-main" }, Yt = ["aria-busy"], Xt = {
	key: 0,
	class: "resource-loader",
	role: "status",
	"aria-live": "polite"
}, Zt = {
	key: 1,
	class: "resource-empty"
}, Qt = {
	key: 3,
	class: "resource-drop-overlay"
}, $t = {
	key: 4,
	class: "sb-browser-info-rail"
}, en = { class: "resource-picker-collection-body" }, tn = {
	__name: "SmartBrowserApp",
	setup(n) {
		let r = C("browser"), d = C("smartBrowserOptions"), _ = C("persistence"), x = d.application === "site" && window.self === window.top, w = i("normal"), O = i(null), te = i("620px"), oe = i(null), A = i(null), me = i(null), ge = i("0px"), ve = i("0px"), be, xe, j, Te, N = () => {
			let e = O.value;
			e && (te.value = `${De(e)}px`, ge.value = `${me.value?.getBoundingClientRect().height || 0}px`, ve.value = `${A.value?.getBoundingClientRect().height || 0}px`);
		}, ke, Ae = S(() => ({
			normal: "COM_SMARTBROWSER_DISPLAY_WIDE",
			wide: "COM_SMARTBROWSER_DISPLAY_FOCUS",
			focus: "COM_SMARTBROWSER_DISPLAY_NORMAL"
		})[w.value]), Ne = () => {
			w.value = ke.cycle();
		};
		t(() => {
			be = document.getElementById("system-message-container"), A.value && be && !be.contains(O.value) && (xe = document.createComment("SmartBrowser message position"), be.before(xe), A.value.append(be)), x && (ke = je(document.getElementById("smartbrowser-app"), (e) => {
				w.value = e;
			})), N(), j = new ResizeObserver(N), j.observe(O.value.parentElement), me.value && j.observe(me.value), A.value && j.observe(A.value);
			let e = O.value.closest("dialog");
			e && j.observe(e), Te = Me(O.value, () => oe.value?.element, d.nativeToolbarTarget), window.addEventListener("resize", N);
		}), g(w, () => T(N)), c(() => {
			xe?.parentNode && xe.replaceWith(be), j?.disconnect(), Te?.(), window.removeEventListener("resize", N), ke?.destroy();
		});
		let Pe = C("actionDriver"), P = C("resourceApi"), Fe = C("viewRegistry"), { state: F, resources: I, bulkSelectableResources: Ie, selection: L, focusedResource: R, load: z, focus: Le, toggle: Re, selectAll: ze, invertSelection: Be } = r;
		g(() => [
			F.revealIds,
			F.busy,
			F.loading,
			F.activeView
		], async () => {
			if (!F.revealIds?.length || F.busy || F.loading) return;
			let e = F.revealIds;
			await T(), await new Promise((e) => requestAnimationFrame(() => requestAnimationFrame(e))), !q && O.value && e === F.revealIds && (Oe(O.value, e), F.revealIds = []);
		});
		let B = d.mode === "select" ? d.pickerContext || d.selectionHost : d.selectionHost || null, V = !!B?.collectionMode, Ve = d.mode === "select" || !!B, H = (e) => Joomla.Text?._(e, e) || e, He = S(() => H(d.adapters?.find((e) => e.id === d.adapter)?.title || d.adapters?.find((e) => e.id === d.adapter.replace(/^flat-/, ""))?.title || "COM_SMARTBROWSER_RESOURCE")), Ue = /* @__PURE__ */ new Map(), We = (e) => {
			let t = e?.selection?.adapter || e?.adapter;
			if (!t || t === d.adapter.replace(/^flat-/, "")) return Pe;
			if (!Ue.has(t)) {
				let e = new ce({
					...d,
					adapter: t,
					browseRoot: null,
					flatScope: null
				});
				Ue.set(t, {
					api: e,
					driver: new Ee(e, F, async () => {
						await U?.refresh();
						for (let e of U?.browser.state.items || []) F.selectedResources[M(e)] = fe(e);
						await z();
					}, H, d.editorMode, d.application)
				});
			}
			return Ue.get(t).driver.selectionHost = rt, Ue.get(t).driver;
		}, Ge = (e) => e?.collectionActions || F.actions, Ke = (e, t) => Ge(t).find((t) => t.id === e.id) || e, qe = (e, t) => {
			if (!V || e.currentNode || !t.length) return Pe.available(e, t);
			if (e.single && t.length !== 1) return !1;
			let n = (t) => (!t.collectionActions || t.collectionActions.some((t) => t.id === e.id)) && We(t).available(Ke(e, t), [t]);
			return e.exclusiveGroup ? t.some(n) : t.every(n);
		}, Je = async (e, t) => {
			if (!qe(e, t)) return;
			if (!V || e.currentNode || !t.length) return Pe.execute(e, t);
			let n = /* @__PURE__ */ new Map();
			for (let e of t) {
				let t = We(e);
				n.has(t) || n.set(t, []), n.get(t).push(e);
			}
			for (let [t, r] of n) await t.execute(Ke(e, r[0]), r);
		};
		c(() => Ue.forEach(({ api: e, driver: t }) => {
			t.destroy(), e.destroy();
		}));
		let U, Ye = !1, Xe = (e) => V ? e : {
			...e,
			selectionKey: void 0
		}, Ze = {
			referenceItems: !0,
			homogeneous: B?.homogeneous === !0,
			readOnly: !1,
			showCount: !1,
			selectionProfile: B?.selectionProfile || {},
			addressContract: B?.addressContract,
			adapter: d.adapter.replace(/^flat-/, ""),
			allowedAdapters: B?.allowedAdapters || (B?.collectionMode ? [] : [d.adapter.replace(/^flat-/, "")]),
			allowedResourceTypes: d.allowedResourceTypes,
			selectionTarget: d.selectionTarget,
			maxSelections: B?.maxSelections || 500,
			selectedResources: !0,
			informationPanel: !1,
			multiple: d.multiple,
			items: B?.getCollectionSnapshot?.().items || [],
			layout: "compact",
			allowRemove: !0,
			allowOrdering: d.multiple && B?.allowOrdering !== !1,
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
				t = Xe(t), F.selectedResources[M(t)] = t, F.focusedId = M(t);
			}
		}, Qe = /* @__PURE__ */ new Map();
		async function $e(e, t = {}) {
			let n = JSON.stringify([e.adapter, t.browseRoot || ""]);
			return Qe.has(n) || Qe.set(n, new ce({
				...d,
				adapter: e.adapter,
				mode: "select",
				browseRoot: t.browseRoot || null,
				flatScope: null
			})), (await Qe.get(n).collection([e.id])).resources[0];
		}
		let W = re({
			profile: B?.selectionProfile || {},
			initialUsage: B?.initialUsage || {},
			editors: B?.editors || {},
			resolveReference: $e
		}), nt = () => F.selectedIds.flatMap((e) => {
			let t = L.value.find((t) => M(t) === e);
			if (t) return [{
				selection: we(t, d.adapter.replace(/^flat-/, "")),
				usage: W.get(t)
			}];
			let n = B?.getCollectionSnapshot?.().items.find((t) => Ce(t.selection) === e);
			return n ? [n] : [];
		}), G = () => {
			V && B.commitCollection?.({
				items: nt(),
				resources: Object.fromEntries(L.value.map((e) => [M(e), e])),
				virtualResources: F.virtualResources
			});
		}, rt = d.selectionState && (B || d.selectionHost) ? {
			editorContext: B?.selectionEditorContext || {},
			canAdd: (e, t) => r.canAddSelection(e, t),
			canCreate: (e) => r.canCreateSelectionResource(e),
			remove: (e) => {
				r.deleteVirtualResources(e), e.forEach((e) => W.forget(e)), K.value++, G(), d.selectionHost?.onChange?.({ items: nt() });
			},
			replace: (e, t) => {
				let n = t ? { ...W.get(t) } : {}, i = r.replaceSelectionResource(e, t);
				for (let e of W.definitions(i)) Object.prototype.hasOwnProperty.call(n, e.key) && W.set(i, e.key, n[e.key]);
				return K.value++, G(), d.selectionHost?.onChange?.({ items: nt() }), t && M(t) !== M(i) && W.forget(t), i;
			}
		} : null;
		Pe.selectionHost = rt, g(() => [F.selectedIds, F.selectedResources], G, {
			deep: !0,
			flush: "sync"
		}), c(G);
		let K = i(0);
		Ve && (U = ye({
			config: Ze,
			api: P,
			translate: H,
			notify: (e) => {
				Ye = !0;
				for (let t of e.items) {
					let n = e.resources.find((e) => M(e) === Ce(t.selection));
					if (n) for (let [e, r] of Object.entries(t.usage)) W.set(Xe(n), e, r);
				}
				F.selectedResources = Object.fromEntries(e.resources.map(Xe).map((e) => [M(e), fe(e)])), F.selectedIds = e.items.map((e) => V ? Ce(e.selection) : e.selection.id), K.value++, Ye = !1, G();
			}
		}), U.refresh().catch((e) => Joomla.renderMessages({ error: [e.message] })), g(() => [F.selectedIds, K.value], () => {
			Ye || U.setItems(nt()).catch((e) => Joomla.renderMessages({ error: [e.message] }));
		}, {
			deep: !0,
			flush: "sync"
		}), c(() => U.destroy()));
		let it = i(B?.isMaximized?.() || !1), at = S(() => {
			if (B?.title) return B.title;
			let e = d.adapters?.find((e) => e.id === d.adapter) || d.adapters?.find((e) => e.id === d.adapter.replace(/^flat-/, ""));
			return `${H("COM_SMARTBROWSER_PICKER_SELECT_TITLE")} \u2014 ${H(e?.title || "COM_SMARTBROWSER_RESOURCE")}`;
		}), ot = i(0), st = i({}), ct = i(!1), lt = S(() => W.definitions(R.value).filter((e) => e.presentation !== "hidden")), ut = S(() => (K.value, W.get(R.value))), dt = S(() => !!(B && Object.keys(B.selectionProfile || {}).length)), ft = !!(B && Object.keys(B.selectionProfile || {}).length), pt = i(B?.initialInfoOpen === !0 || (typeof d.pickerRememberedInfo == "boolean" ? d.pickerRememberedInfo : Object.values(B?.selectionProfile || {}).some((e) => e !== !1 && e?.presentation !== "hidden") || F.showInfo)), mt = S(() => ft || B?.initialInfoOpen === !0 ? pt.value : F.showInfo), ht = () => {
			ft || B?.initialInfoOpen === !0 ? (pt.value = !pt.value, F.showInfo = pt.value) : F.showInfo = !F.showInfo;
		}, gt = (e, t, n) => {
			e && !q && (W.set(e, t, n), st.value = {
				...st.value,
				[M(e)]: {}
			}, K.value++, G());
		}, _t = (e, t) => gt(R.value, e, t), vt = S(() => {
			let e = R.value;
			return le({
				resource: e,
				overlayRegistry: B || window.SmartBrowserPicker,
				isReadOnly: !B || d.mode === "readonly",
				fieldElement: null,
				isCurrent: () => !q && M(R.value) === M(e),
				getAddress: () => W.get(e)["ext.address"] ?? ie(e),
				getDefaultAddress: () => ie(e),
				resetAddress: () => gt(e, "ext.address", null),
				setAddress: (t) => gt(e, "ext.address", t),
				profile: B?.selectionProfile || {},
				values: ut.value,
				getValues: () => W.get(e),
				setValue: (t, n) => gt(e, t, n),
				refresh: () => z(),
				selectResource: (e) => window.SmartBrowserPicker.open(e)
			});
		}), yt = i(B?.previewActions || []), xt = B?.subscribePreviewActions?.((e) => {
			yt.value = e;
		});
		c(() => xt?.());
		let St = S(() => yt.value.filter((e) => {
			try {
				return R.value && (!vt.value.isReadOnly || e.allowReadOnly === !0) && (!e.applies || e.applies(vt.value));
			} catch {
				return !1;
			}
		})), q = !1;
		c(() => {
			q = !0, Qe.forEach((e) => e.destroy());
		});
		let Ct = Fe.all(), wt = S(() => Fe.get(F.activeView)), Tt = i(!1), Et = S(() => F.loading || Tt.value), Dt = async (e) => {
			if (!(F.activeView === e || F.loading || F.busy || Tt.value)) {
				Tt.value = !0;
				try {
					await T(), await new Promise((e) => requestAnimationFrame(() => requestAnimationFrame(e))), F.activeView = e, await T();
				} finally {
					Tt.value = !1;
				}
			}
		}, Ot = i({}), kt = se({
			api: P,
			config: {
				...d,
				selectionProfile: B?.selectionProfile || {},
				addressContract: B?.addressContract
			}
		}), jt = 0;
		g(() => [I.value, K.value], async () => {
			if (!B) return;
			let e = ++jt, t = {};
			for (let e of I.value) try {
				t[M(e)] = await kt.serialize({
					selection: we(e, d.adapter.replace(/^flat-/, "")),
					usage: W.get(e)
				}, e);
			} catch {
				t[M(e)] = "";
			}
			e === jt && (Ot.value = t);
		}, { immediate: !0 }), c(() => {
			jt++, kt.destroy();
		});
		let Rt = S(() => B ? I.value.map((e) => ({
			...e,
			selectionAddress: Ot.value[M(e)] || ""
		})) : I.value), zt = S(() => {
			let e = Vt(F.presentation, d.adapter);
			return B && !e.some((e) => e.id === "selectionAddress") && e.push({
				id: "selectionAddress",
				source: "selectionAddress",
				label: "COM_SMARTBROWSER_URI",
				headerIcon: "fas fa-link",
				defaultVisible: !1
			}), e;
		}), Bt = S(() => zt.value.filter((e) => e.id === "title" || e.id === "name" || (e.defaultVisible ? !F.hiddenColumns.includes(e.id) : F.shownColumns.includes(e.id)))), tn = (e) => {
			let t = zt.value.find((t) => t.id === e);
			if (!t || ["title", "name"].includes(e)) return;
			let n = t.defaultVisible ? "hiddenColumns" : "shownColumns";
			F[n] = F[n].includes(e) ? F[n].filter((t) => t !== e) : [...F[n], e];
		}, J = i(!1), Y = i(d.adapter.startsWith("flat-")), X = i(null), nn = i(!1), rn = i(null), Z = S(() => d.adapter === "media"), an = S(() => d.mode === "manage" && ["details", "grid"].includes(F.activeView) && F.presentation.orderingField && F.sortBy === F.presentation.orderingField && ["asc", "desc"].includes(F.sortDirection) && (d.adapter === "featured-articles" || String(F.filters.featured ?? "") !== "1")), on = S(() => an.value && !F.busy && L.value.length > 0 && L.value.every((e) => e.capabilities?.reorder === !0)), sn = async (e) => {
			if (!on.value || !["up", "down"].includes(e)) return;
			let t = L.value.map((e) => e.id), n = F.focusedId;
			F.busy = !0;
			try {
				let r = F.sortDirection === "desc" ? e === "up" ? "down" : "up" : e;
				(await P.execute("reorder", t, { direction: r })).updated?.length && (await z(), F.selectedIds = t.filter((e) => I.value.some((t) => t.id === e)), F.focusedId = F.selectedIds.includes(n) ? n : F.selectedIds[0] || null);
			} catch (e) {
				Joomla.renderMessages({ error: [e.message] });
			} finally {
				F.busy = !1;
			}
		}, cn = d.adapter !== "featured-articles" && [
			"articles",
			"categories",
			"tags",
			"articles-by-tag",
			"menus",
			"users",
			"media"
		].includes(d.adapter.replace(/^flat-/, "")), ln = d.adapter.startsWith("flat-") || d.adapter === "featured-articles", Q = d.adapter.startsWith("flat-") ? new ce({
			...d,
			adapter: d.adapter.slice(5),
			browseRoot: d.flatTreeRoot || null,
			flatScope: null
		}) : null, un = S(() => (d.adapters || []).filter((e) => (!Q || e.id !== d.adapter.slice(5)) && (!B?.allowedAdapters?.length || B.allowedAdapters.includes(e.id.replace(/^flat-/, "")))));
		g(Y, async (e) => {
			if (!(e || !Q || X.value || nn.value)) {
				nn.value = !0;
				try {
					let e = (await Q.getResources("")).roots || [], t = d.flatTreeNode || e[0]?.id;
					X.value = {
						...t ? await Q.getResources(t) : {},
						roots: e
					};
				} catch (e) {
					q || Joomla.renderMessages({ error: [e.message] });
				} finally {
					nn.value = !1;
				}
			}
		}), c(() => Q?.destroy());
		let dn = async (e) => {
			if (!Q) return z(e);
			G(), await kn(Nt(window.location.href, d.adapter.slice(5), e, d.flatTreeRoot || null));
		}, fn = S(() => !ln || !d.flatBreadcrumb?.length || d.flatBreadcrumb.length === 1 ? F.breadcrumb : d.flatBreadcrumb), pn = i([]), mn = i(null), $, hn = () => {
			pn.value = $.entries(), mn.value = $.previous();
		}, gn = () => {
			$ = tt(D(), k(d), d.browseRoot || ""), hn();
		};
		gn(), g(() => F.navigationRevision, () => {
			$.visit(d.flatTreeNode || F.selectedNode, fn.value), hn();
		});
		let _n = async (e) => {
			await dn(e), !Q && (F.error || F.selectedNode !== e) && ($.remove(e), hn());
		}, vn = () => {
			$.clear(), $.visit(d.flatTreeNode || F.selectedNode, fn.value), hn();
		}, yn = () => {
			let e = $.back();
			hn(), e && _n(e.id);
		};
		function bn() {
			let e = D();
			_ && (_.storage = e, _.key = Lt(d, e), _.nodeKey = k(d, e)), e.removeItem(Lt(d, e)), e.removeItem(wn), e.removeItem(k(d, e)), F.activeView = d.defaultView || "grid", F.showInfo = !1, F.search = "", F.hiddenColumns = [], F.shownColumns = [], F.sortBy = d.defaultSortBy || "", F.sortDirection = d.defaultSortDirection || "", F.viewOptions = {
				gridSize: "md",
				detailsThumbnails: !1,
				detailsDateMode: "modified"
			}, F.filters = { ...d.initialFilters || {} };
			for (let e of F.presentation.filters || []) F.filters[e.id] === void 0 && (F.filters[e.id] = e.default);
			En.value = !1, Y.value = !!Q, Tn = {}, gn();
		}
		function xn(e) {
			let t = Joomla.getOptions?.("com_smartbrowser.preferences", {}) || {};
			d.editorMode = e.editorMode === "inherit" ? t.editorDefault || "modal" : e.editorMode, Pe.editorMode = d.editorMode, gn();
		}
		let Sn = i(!1), Cn = Object.fromEntries(Object.entries(d.gridWidths || {}).map(([e, t]) => [`--sb-grid-${e}`, `${t}px`])), wn = It(d) ? Mt(d.adapter, d.browseRoot, window.location.href, !0) : `supjx.smartbrowser.ui.picker.${ee(d)}.${d.adapter.replace(/^flat-/, "")}`, Tn = (() => {
			try {
				return JSON.parse(D().getItem(wn) || "{}");
			} catch {
				return {};
			}
		})(), En = i(Tn.filtersOpen === !0), Dn = (e) => {
			Tn = {
				...Tn,
				filtersOpen: En.value,
				...e
			}, D().setItem(wn, JSON.stringify(Tn));
		}, On = () => {
			En.value = !En.value, Dn({ filtersOpen: En.value });
		}, kn = async (e) => {
			Sn.value || (Sn.value = !0, F.loading = !0, await T(), await new Promise((e) => requestAnimationFrame(() => requestAnimationFrame(e))), window.location.assign(e));
		}, An = () => {
			Dn({ flat: !ln }), kn(ln ? Pt(window.location.href, d.browseRoot) : Nt(window.location.href, d.adapter, F.selectedNode, d.browseRoot));
		}, jn = S(() => d.adapters?.find((e) => e.id === d.adapter)?.icon || d.adapters?.find((e) => e.id === d.adapter.replace(/^flat-/, ""))?.icon || "fas fa-list"), Mn = S(() => d.adapters?.find((e) => e.id === d.adapter)?.nodeOpenIcon || {
			media: "fas fa-folder-open",
			articles: "fas fa-box-open",
			"flat-articles": "fas fa-box-open",
			categories: "fas fa-box-open",
			tags: "fas fa-tags",
			"articles-by-tag": "fas fa-tags",
			users: "fas fa-users-viewfinder",
			menus: "fas fa-diagram-successor",
			"featured-articles": "fas fa-star"
		}[d.adapter] || "fas fa-folder-open"), Nn = [
			"sm",
			"md",
			"lg",
			"xl"
		], Pn = async ({ selection: e, payload: t, resolve: n, reject: r }) => {
			try {
				let r = await P.execute("batch", e, t);
				if (r.download) {
					let e = atob(r.download.content), t = Uint8Array.from(e, (e) => e.charCodeAt(0)), n = URL.createObjectURL(new Blob([t], { type: "application/zip" })), i = document.createElement("a");
					i.href = n, i.download = r.download.name, i.click(), setTimeout(() => URL.revokeObjectURL(n), 6e4);
				}
				await z(), n(r);
			} catch (e) {
				r(e);
			}
		}, Fn = async (e) => {
			if (ct.value || !e.length) return;
			ct.value = !0;
			let t = K.value, n;
			try {
				n = await W.validate(e);
			} finally {
				ct.value = !1;
			}
			if (q || t !== K.value) return;
			if (st.value = n.errors, !n.valid) {
				Object.keys(n.profileErrors).length && Joomla.renderMessages({ error: [H("COM_SMARTBROWSER_USAGE_PROFILE_INVALID")] });
				let e = Object.keys(n.errors).find((e) => Object.keys(n.errors[e]).some((t) => !n.profileErrors[e]?.[t]));
				e && (F.focusedId = e, ot.value++, mt.value || Joomla.renderMessages({ error: [H("COM_SMARTBROWSER_USAGE_INVALID")] }));
				return;
			}
			let r = {
				adapter: d.adapter.replace(/^flat-/, ""),
				mode: d.mode,
				resources: [...e]
			};
			V && (r.collectionItems = e.map((e) => ({
				selection: we(e, d.adapter.replace(/^flat-/, "")),
				usage: n.usage[M(e)] || {}
			}))), B && (r.pickerInstance = d.pickerInstance, r.usage = n.usage), document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r })), window.parent !== window && window.parent.document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r }));
		}, In = (e) => {
			let t = Nn.indexOf(F.viewOptions.gridSize);
			F.viewOptions.gridSize = Nn[Math.max(0, Math.min(Nn.length - 1, t + e))];
		}, Ln = (e) => ue(e, d.mode, Ge(e), qe, d.selectionTarget || "both"), Rn = (e) => he(e, d.mode, Ge(e), qe), zn = (e) => _e(e, d.mode, Ge(e), qe, d.selectionTarget || "both"), Bn = (e, t) => !F.busy && (e.local ? t.every((t) => Ln(t)?.id === e.id || zn(t)?.id === e.id) : qe(e, t)), Vn = (e) => {
			let t = Ln(e);
			t && Hn(t, e);
		}, Hn = (e, t) => {
			if (e && t && Bn(e, [t])) return e.id === "browseOpen" ? z(t.id) : e.id === "pickerSelect" ? V ? (F.selectedIds.includes(M(t)) || Re(t, !0), Fn(L.value)) : Fn([t]) : Je(e, [t]);
		}, Un = (e) => {
			if (B?.allowedAdapters?.length && !B.allowedAdapters.includes(e.replace(/^flat-/, "")) || e === d.adapter) return;
			G();
			let t = new URL(window.location.href);
			t.searchParams.set("adapter", e), t.searchParams.delete("node"), t.searchParams.delete("browseRoot"), B?.initialBrowseRoot && e.replace(/^flat-/, "") === B.initialAdapter.replace(/^flat-/, "") && t.searchParams.set("browseRoot", B.initialBrowseRoot), t.searchParams.delete("initialResource"), t.searchParams.delete("flatScope"), window.location.href = t.toString();
		}, Wn = async ({ id: e, value: t }) => {
			if (F.filters[e] = t, e === "menu" && t && !d.browseRoot && d.adapter === "menus") {
				await z(`menu:${t}`);
				return;
			}
			if (e === "menu" && t && !d.browseRoot && d.adapter === "flat-menus") {
				let e = new URL(window.location.href);
				e.searchParams.set("flatScope", `menu:${t}`), e.searchParams.set("flatFromNode", `menu:${t}`), window.location.assign(e.toString());
				return;
			}
			await z(F.selectedNode);
		}, Gn = async () => {
			(F.presentation.filters || []).forEach((e) => {
				F.filters[e.id] = e.default ?? "";
			}), await z(F.selectedNode);
		}, Kn = async (e) => {
			if (ln && d.flatBreadcrumb?.some((t) => t.id === e)) {
				if (e === d.flatBreadcrumb.at(-1)?.id) return;
				let t = new URL(window.location.href), n = t.searchParams.get("flatFromBrowseRoot") || (t.searchParams.has("flatFromAdapter") ? null : d.browseRoot);
				await kn(Nt(window.location.href, d.adapter.replace(/^flat-/, ""), e, n));
				return;
			}
			if (d.adapter.startsWith("flat-") && e === F.selectedNode && e === F.roots[0]?.id) {
				F.search = "", F.sortBy = d.defaultSortBy || "", F.sortDirection = d.defaultSortDirection || "";
				let e = Ft(window.location.href, d.flatRootNode);
				if (e !== window.location.href) {
					(F.presentation.filters || []).forEach((e) => {
						F.filters[e.id] = e.default ?? "";
					}), await T(), window.location.assign(e);
					return;
				}
				await Gn();
				return;
			}
			await z(e);
		}, qn = (e) => {
			F.sortBy === e ? F.sortDirection === "asc" ? F.sortDirection = "desc" : (F.sortBy = "", F.sortDirection = "") : (F.sortBy = e, F.sortDirection = "asc");
		}, Jn = (e) => {
			F.sortBy = e, F.sortDirection = e ? F.sortDirection || "asc" : "";
		}, Yn = () => {
			let e = [
				"modified",
				"created",
				"both"
			], t = e.indexOf(F.viewOptions.detailsDateMode);
			F.viewOptions.detailsDateMode = e[(t + 1) % e.length];
		}, Xn = async (e) => {
			J.value = !1, Z.value && await Pe.uploadFiles(e.dataTransfer?.files);
		};
		return t(() => {
			if (ln && Dn({ flat: !0 }), !ln && cn && Tn.flat === !0) {
				window.location.replace(Nt(window.location.href, d.adapter, F.selectedNode, d.browseRoot));
				return;
			}
			z(F.selectedNode).then(async () => {
				if (V) {
					let e = B.getCollectionSnapshot();
					try {
						let t = await P.collection(e.items, {
							referenceItems: !0,
							homogeneous: B.homogeneous
						});
						if (q) return;
						if (F.selectedResources = Object.fromEntries(t.resources.map((e) => [M(e), fe(e)])), F.selectedIds = t.items.map((e) => Ce(e.selection)), F.focusedId = F.selectedIds.find((e) => I.value.some((t) => M(t) === e)) || F.selectedIds[0] || null, B.initialFocus) {
							let e = Ce(B.initialFocus);
							F.selectedIds.includes(e) && (F.focusedId = e);
						}
					} catch (e) {
						q || Joomla.renderMessages({ error: [e.message] });
					}
				}
				if (!V && B?.initialSelection?.length && (!B.initialAdapter || B.initialAdapter.replace(/^flat-/, "") === d.adapter.replace(/^flat-/, ""))) {
					let e = B.initialSelection.map((e) => e && typeof e == "object" ? e.id : e);
					try {
						let t = await P.collection(d.multiple ? e : e.slice(0, 1));
						if (q) return;
						let n = new Set(d.allowedResourceTypes || []), r = t.resources.filter((e) => !e.unavailable && de(e, d.selectionTarget) && (!n.size || n.has(e.type)));
						F.selectedIds = r.map((e) => e.id), F.selectedResources = Object.fromEntries(r.map((e) => [e.id, e])), F.focusedId = F.selectedIds[0] || null;
					} catch (e) {
						q || Joomla.renderMessages({ error: [e.message] });
					}
				}
				d.adapter === "media" && d.initialResource && I.value.some((e) => e.id === d.initialResource) && (F.focusedId = M(I.value.find((e) => e.id === d.initialResource)));
			});
		}), (t, n) => (l(), v("div", {
			ref_key: "shellElement",
			ref: O,
			class: E(["smartbrowser-shell sb-redesigned-browser", {
				"is-site": s(d).application === "site",
				"is-picker": s(d).mode === "select" || !!s(B),
				"is-contained": s(d).mode === "select" || !!s(B) || w.value === "focus"
			}]),
			style: e({
				...s(Cn),
				"--sb-browser-available-height": te.value,
				"--sb-picker-footer-height": ge.value,
				"--sb-picker-message-height": ve.value
			})
		}, [
			s(F).busy ? (l(), v("div", Ht, [n[14] ||= f("span", {
				class: "spinner-border",
				"aria-hidden": "true"
			}, null, -1), f("span", null, u(H("COM_SMARTBROWSER_WORKING")), 1)])) : y("", !0),
			m(et, {
				ref_key: "browserHeader",
				ref: oe,
				"native-toolbar-target": s(d).nativeToolbarTarget,
				"heading-title": s(B) || s(d).mode === "select" ? at.value : He.value,
				"heading-subtitle": s(B) || s(d).mode === "select" ? s(B)?.subtitle : s(d).browserDescription,
				"heading-icon": jn.value,
				actions: s(F).actions,
				available: (e) => qe(e, s(L)),
				selection: s(L),
				"batch-available": s(d).mode === "manage",
				"can-cancel": typeof s(B)?.cancel == "function",
				"flat-available": s(cn),
				"flat-active": s(ln),
				"flat-busy": Sn.value,
				"filters-open": En.value,
				filters: s(F).presentation.filters,
				"filter-values": s(F).filters,
				"manager-url": s(d).managerUrl,
				"manager-new-tab": s(d).application === "site",
				"dashboard-url": s(d).dashboardUrl,
				integrated: s(d).integrated,
				"selection-mode": s(d).mode === "select",
				"allow-no-user": s(d).allowNoUser,
				"can-complete": s(L).length > 0 && !ct.value,
				"confirm-label": s(B)?.confirmLabel,
				t: H,
				onAction: n[1] ||= (e) => Je(e, s(L)),
				onBatch: n[2] ||= (e) => rn.value?.open(),
				onCancel: n[3] ||= (e) => s(B)?.cancel(),
				onToggleFlat: An,
				onToggleFilters: On,
				onFilter: Wn,
				onClearFilters: Gn,
				onComplete: n[4] ||= (e) => Fn(s(L)),
				onNoUser: n[5] ||= (e) => Fn([{
					id: "user:0",
					type: "user",
					title: ""
				}])
			}, {
				preferences: a(() => [m(ne, {
					t: H,
					adapter: s(d).adapter,
					"current-view": "",
					onSaved: xn,
					onResetView: bn
				}, null, 8, ["adapter"])]),
				"display-controls": a(() => [s(B)?.toggleSize ? (l(), v("button", {
					key: 0,
					type: "button",
					class: E(["resource-icon-button resource-display-toggle", { active: it.value }]),
					"aria-pressed": it.value,
					title: H(it.value ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE"),
					"aria-label": H(it.value ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE"),
					onClick: n[0] ||= (e) => it.value = s(B).toggleSize()
				}, [f("span", {
					class: E(it.value ? "fas fa-compress" : "fas fa-expand"),
					"aria-hidden": "true"
				}, null, 2)], 10, Ut)) : y("", !0), s(x) ? (l(), v("button", {
					key: 1,
					type: "button",
					class: E(["resource-icon-button resource-display-toggle", { active: w.value !== "normal" }]),
					"aria-pressed": w.value !== "normal",
					title: H(Ae.value),
					"aria-label": H(Ae.value),
					onClick: Ne
				}, [f("span", {
					class: E(w.value === "normal" ? "fas fa-arrows-alt-h" : w.value === "wide" ? "fas fa-expand" : "fas fa-compress"),
					"aria-hidden": "true"
				}, null, 2)], 10, Wt)) : y("", !0)]),
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
			m(ae, {
				ref_key: "batchDialog",
				ref: rn,
				selection: s(L),
				adapter: s(d).adapter,
				filters: s(F).presentation.filters,
				"batch-options": s(F).presentation.batchOptions,
				"sort-fields": s(F).presentation.sortFields,
				"ordering-available": an.value,
				t: H,
				onApply: Pn
			}, null, 8, [
				"selection",
				"adapter",
				"filters",
				"batch-options",
				"sort-fields",
				"ordering-available"
			]),
			f("div", { class: E(["smartbrowser-layout", { "tree-collapsed": Y.value }]) }, [
				!Y.value && (!s(Q) || X.value) ? (l(), p(At, {
					key: 0,
					adapters: un.value,
					"active-adapter": s(d).adapter,
					roots: X.value?.roots || s(F).roots,
					nodes: X.value?.nodes || s(F).nodes,
					breadcrumb: X.value?.breadcrumb || s(F).breadcrumb,
					"selected-node": X.value?.nodeId || s(F).selectedNode,
					t: H,
					onOpen: dn,
					onAdapter: Un
				}, null, 8, [
					"adapters",
					"active-adapter",
					"roots",
					"nodes",
					"breadcrumb",
					"selected-node"
				])) : y("", !0),
				f("div", Gt, [f("button", {
					type: "button",
					class: "resource-sidebar-handle",
					title: H(Y.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-label": H(Y.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-expanded": !Y.value,
					"aria-busy": nn.value,
					onClick: n[6] ||= (e) => Y.value = !Y.value
				}, [nn.value ? (l(), v("span", qt)) : (l(), v("span", {
					key: 1,
					class: E(Y.value ? "fas fa-chevron-right" : "fas fa-chevron-left"),
					"aria-hidden": "true"
				}, null, 2))], 8, Kt)]),
				f("main", Jt, [m(bt, {
					"history-entries": pn.value,
					"history-previous": mn.value,
					onHistoryBack: yn,
					onHistoryOpen: _n,
					onHistoryClear: vn,
					breadcrumb: fn.value,
					root: s(F).roots[0],
					"root-icon": Mn.value,
					"icon-only-root": fn.value.length > 1,
					search: s(F).search,
					"sort-by": s(F).sortBy,
					"sort-direction": s(F).sortDirection,
					"sort-fields": s(F).presentation.sortFields,
					"ordering-field": s(F).presentation.orderingField,
					views: s(Ct),
					"active-view": s(F).activeView,
					"grid-size": s(F).viewOptions.gridSize,
					"details-thumbnails": s(F).viewOptions.detailsThumbnails,
					"details-date-mode": s(F).viewOptions.detailsDateMode,
					columns: zt.value,
					"hidden-columns": s(F).hiddenColumns,
					"shown-columns": s(F).shownColumns,
					"show-info": mt.value,
					multiple: s(d).multiple,
					"can-invert": s(d).multiple && s(Ie).length > 0,
					"reorder-visible": an.value,
					"reorder-enabled": on.value,
					t: H,
					onOpen: Kn,
					onInvertSelection: s(Be),
					onReorder: sn,
					onSearch: n[7] ||= (e) => s(F).search = e,
					onSortBy: Jn,
					onSortDirectionValue: n[8] ||= (e) => s(F).sortDirection = e,
					onResize: In,
					onToggleThumbnails: n[9] ||= (e) => s(F).viewOptions.detailsThumbnails = !s(F).viewOptions.detailsThumbnails,
					onToggleDateField: Yn,
					onToggleColumn: tn,
					onView: Dt,
					onInfo: ht
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
				]), f("div", {
					class: E(["resource-browser", {
						loading: Et.value,
						"is-dragging": J.value,
						"info-open": mt.value,
						"usage-open": dt.value
					}]),
					"aria-busy": Et.value,
					onDragenter: n[11] ||= b((e) => J.value = Z.value, ["prevent"]),
					onDragover: n[12] ||= b(() => {}, ["prevent"]),
					onDragleave: n[13] ||= b((e) => J.value = !1, ["self"]),
					onDrop: b(Xn, ["prevent"])
				}, [
					Et.value ? (l(), v("div", Xt, [n[15] ||= f("span", {
						class: "spinner-border",
						"aria-hidden": "true"
					}, null, -1), f("span", null, u(H("COM_SMARTBROWSER_LOADING")), 1)])) : s(I).length ? (l(), p(o(wt.value.component), {
						key: 2,
						resources: Rt.value,
						"selected-ids": s(F).selectedIds,
						"focused-id": s(F).focusedId,
						"all-selected": s(Ie).length > 0 && s(Ie).every((e) => s(F).selectedIds.includes(s(M)(e))),
						options: s(F).viewOptions,
						"selection-controls": !s(B) || s(d).multiple !== !1,
						actions: s(F).actions,
						"action-available": Bn,
						"default-action": Ln,
						"preview-action": Rn,
						"modified-action": zn,
						"sort-by": s(F).sortBy,
						"sort-direction": s(F).sortDirection,
						"sort-fields": s(F).presentation.sortFields,
						"ordering-field": s(F).presentation.orderingField,
						columns: Bt.value,
						"grid-fields": s(F).presentation.gridFields,
						t: H,
						onSelect: s(Re),
						onFocus: s(Le),
						onSelectAll: s(ze),
						onOpen: s(z),
						onActivate: Vn,
						onAction: Hn,
						onSort: qn
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
					])) : (l(), v("div", Zt, [f("span", {
						class: E(s(F).search ? "fas fa-search" : Z.value ? "fas fa-cloud-upload-alt" : jn.value),
						"aria-hidden": "true"
					}, null, 2), f("p", null, u(s(F).search ? H("COM_SMARTBROWSER_NO_RESULTS") : Z.value ? H("COM_SMARTBROWSER_DROP_UPLOAD") : H("COM_SMARTBROWSER_EMPTY_STATE")), 1)])),
					Z.value && J.value ? (l(), v("div", Qt, [n[16] ||= f("span", { class: "fas fa-cloud-upload-alt" }, null, -1), h(u(H("COM_SMARTBROWSER_DROP_UPLOAD")), 1)])) : y("", !0),
					mt.value ? (l(), v("div", $t, [m(Se, {
						resource: s(R),
						fields: s(R)?.collectionPresentation?.infoFields || s(F).presentation.infoFields,
						t: H,
						"usage-definitions": lt.value,
						"usage-values": ut.value,
						"usage-errors": st.value[s(M)(s(R))] || {},
						"usage-editors": s(B)?.editors,
						"resolve-reference": $e,
						"usage-revision": ot.value,
						"preview-actions": St.value,
						"preview-context": vt.value,
						"can-preview": !!Rn(s(R)) && We(s(R)).canPreview(s(R)) && !s(F).busy,
						onPreview: n[10] ||= (e) => Hn(Rn(s(R)), s(R)),
						onUsageChange: _t
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
				], 42, Yt)])
			], 2),
			s(Ve) ? (l(), v("div", {
				key: 1,
				ref_key: "messagesElement",
				ref: A,
				class: "sb-browser-messages"
			}, null, 512)) : y("", !0),
			s(Ve) ? (l(), v("details", {
				key: 2,
				ref_key: "pickerFooter",
				ref: me,
				class: "resource-picker-collection"
			}, [f("summary", null, [
				n[17] ||= f("span", {
					class: "fas fa-chevron-up resource-picker-collection-chevron",
					"aria-hidden": "true"
				}, null, -1),
				h(u(H("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": ", 1),
				f("span", null, u(s(F).selectedIds.length), 1)
			]), f("div", en, [s(U) ? (l(), p(pe, {
				key: 0,
				model: s(U),
				api: s(P),
				config: Ze,
				t: H
			}, null, 8, ["model", "api"])) : y("", !0)])], 512)) : y("", !0)
		], 6));
	}
}, J = "supjx.smartbrowser.preferencesResetToken";
function Y(e, t) {
	if (!t || e.getItem(J) === t) return !1;
	let n = [];
	for (let t = 0; t < e.length; t++) {
		let r = e.key(t);
		r?.startsWith("supjx.smartbrowser.") && r !== J && r !== "supjx.smartbrowser.editorReturn" && n.push(r);
	}
	return n.forEach((t) => e.removeItem(t)), e.setItem(J, t), !0;
}
//#endregion
//#region resources/js/core/resetSessionNavigation.js
var X = "supjx.smartbrowser.";
function nn(e, t, n) {
	if (!n) return !1;
	let r = `${X}session.${t}`, i = e.getItem(r);
	if (e.setItem(r, n), !i || i === n) return !1;
	for (let t = 0; t < e.length; t++) {
		let n = e.key(t);
		if (!(!n?.startsWith(X) || n.startsWith(`${X}ui.`) || n.startsWith(`${X}session.`))) try {
			let t = JSON.parse(e.getItem(n));
			if (!t || typeof t != "object" || Array.isArray(t) || !("selectedNode" in t) && !("filters" in t)) continue;
			delete t.selectedNode, delete t.filters, e.setItem(n, JSON.stringify(t));
		} catch {}
	}
	return !0;
}
function rn(e) {
	let t = new URL(e);
	if (t.searchParams.delete("node"), t.searchParams.has("flatFromAdapter")) {
		let e = t.searchParams.get("flatFromBrowseRoot");
		e ? t.searchParams.set("browseRoot", e) : t.searchParams.delete("browseRoot"), t.searchParams.delete("flatScope"), t.searchParams.delete("flatFromNode"), t.searchParams.delete("flatFromBrowseRoot"), t.searchParams.delete("flatFromAdapter");
	}
	return t.toString();
}
//#endregion
//#region resources/js/main.js
var Z = Joomla.getOptions("com_smartbrowser", {}), an = O(), on = te(an, Z.adapter);
on !== "inherit" && (Z.showContextResources = on === "show"), an.editorMode !== "inherit" && (Z.editorMode = an.editorMode);
var sn = null;
try {
	sn = window.parent !== window && Z.pickerInstance ? window.parent.SmartBrowserPicker?.context(Z.pickerInstance, window) : null;
} catch {}
Z.pickerContext = sn, Y(window.sessionStorage, Z.preferencesResetToken);
var cn = nn(window.sessionStorage, Z.application, Z.csrfToken) ? rn(window.location.href) : window.location.href;
if (cn !== window.location.href) window.location.replace(cn);
else {
	let e = new ce(Z), t = Lt(Z), n = new Rt(D(), t, Z);
	sn && (Z.pickerRememberedInfo = n.load({}).showInfo);
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
		options: Z,
		api: e,
		persistence: n,
		viewRegistry: r
	}), a = new Ee(e, i.state, () => i.load(), (e) => Joomla.Text?._(e, e) || e, Z.editorMode, Z.application);
	window.SmartBrowser = {
		...window.SmartBrowser,
		open(e = {}) {
			let t = e.showContextResources ?? Z.showContextResources ?? !1, n = e.browseRoot ? `&browseRoot=${encodeURIComponent(e.browseRoot)}` : "", r = e.defaultView ? `&defaultView=${encodeURIComponent(e.defaultView)}` : "", i = e.allowedResourceTypes?.length ? `&allowedResourceTypes=${encodeURIComponent(e.allowedResourceTypes.join(","))}` : "", a = e.showAdapterSwitcher ? "&showAdapterSwitcher=1" : "";
			window.location.href = `${Z.returnUrl}&adapter=${encodeURIComponent(e.adapter || Z.adapter)}&mode=${encodeURIComponent(e.mode || "select")}&multiple=${+!!e.multiple}&selectionTarget=${encodeURIComponent(e.selectionTarget || "item")}&showContextResources=${+!!t}${n}${r}${i}${a}`;
		},
		registerView: (e) => r.register(e)
	}, x(tn).provide("browser", i).provide("persistence", n).provide("resourceApi", e).provide("smartBrowserOptions", Z).provide("viewRegistry", r).provide("actionDriver", a).mount("#smartbrowser-app");
}
//#endregion
