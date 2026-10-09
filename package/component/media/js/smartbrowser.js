import { A as e, B as t, C as n, D as r, E as i, F as a, H as o, I as s, L as c, M as l, N as u, O as d, P as f, S as p, T as m, U as h, V as g, W as _, _ as v, b as y, d as b, f as x, g as S, h as C, j as w, k as T, l as E, m as D, p as O, t as k, u as A, v as j, x as M, y as N, z as ee } from "./visual-runtime-DVMDRhTu.js";
import { a as P, i as F, o as I, r as L } from "./visual-runtime-BpJbHzSM.js";
import { a as R, c as z, d as te, f as ne, h as B, i as re, l as ie, m as ae, n as oe, o as se, p as V, r as H, s as U, t as W, u as ce } from "./visual-runtime-Dc6Pbaih.js";
//#region resources/js/core/displayMode.js
var G = [
	"normal",
	"wide",
	"focus"
], K = "smartbrowser.displayMode";
function q(e, t = () => {}) {
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
		if (!G.includes(r)) return;
		let u = n;
		if (c(), n = r, t(n), l) try {
			o?.setItem(K, n);
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
		let e = o?.getItem(K);
		G.includes(e) && e !== "normal" && l(e, !1);
	} catch {}
	return {
		get mode() {
			return n;
		},
		set: l,
		cycle: () => l(G[(G.indexOf(n) + 1) % 3]),
		destroy() {
			l("normal", !1), a.removeEventListener("keydown", u);
		}
	};
}
//#endregion
//#region resources/js/components/ResourceActions.vue
var J = { class: "resource-actions-area" }, le = [
	"href",
	"title",
	"aria-label"
], ue = { class: "resource-action-label" }, de = [
	"disabled",
	"title",
	"aria-label"
], fe = { class: "resource-action-label" }, pe = ["title", "aria-label"], Y = { class: "resource-action-label" }, X = [
	"title",
	"aria-label",
	"disabled",
	"onClick"
], me = {
	key: 0,
	class: "resource-action-label"
}, he = [
	"aria-expanded",
	"title",
	"aria-label"
], ge = { class: "resource-action-label" }, _e = {
	key: 0,
	class: "resource-action-menu",
	role: "menu"
}, ve = ["disabled", "onClick"], ye = [
	"disabled",
	"title",
	"aria-label"
], be = { class: "resource-action-label" }, xe = {
	key: 5,
	class: "resource-filter-buttons"
}, Se = [
	"aria-expanded",
	"title",
	"aria-label"
], Ce = { class: "resource-action-label" }, we = {
	key: 0,
	class: "badge bg-primary"
}, Te = ["disabled", "title"], Ee = [
	"title",
	"aria-label",
	"aria-pressed"
], De = [
	"href",
	"target",
	"rel",
	"title",
	"aria-label"
], Oe = {
	key: 0,
	class: "resource-action-filters"
}, ke = ["value", "onChange"], Ae = ["value"], je = {
	__name: "ResourceActions",
	props: {
		actions: Array,
		available: Function,
		selection: Array,
		batchAvailable: Boolean,
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
		t: Function
	},
	emits: [
		"action",
		"batch",
		"toggle-flat",
		"toggle-filters",
		"filter",
		"clear-filters",
		"complete",
		"no-user"
	],
	setup(n) {
		let r = n, i = t(!1), a = t(null), s = t(null), c, f = 0, m = 0, h = () => {
			let e = s.value;
			if (!e) return;
			e.classList.remove("is-compact-1", "is-compact-2", "is-compact-3", "is-compact-4");
			let t = () => {
				let t = getComputedStyle(e), n = parseFloat(t.columnGap) || 0, r = (parseFloat(t.paddingInlineStart) || 0) + (parseFloat(t.paddingInlineEnd) || 0), i = [...e.children].filter((e) => getComputedStyle(e).display !== "none");
				return i.reduce((e, t) => e + t.getBoundingClientRect().width, r + n * Math.max(0, i.length - 1)) <= e.clientWidth + 1;
			};
			for (let n = 1; n <= 4 && !t(); n += 1) e.classList.add(`is-compact-${n}`);
		}, g = () => {
			cancelAnimationFrame(f), f = requestAnimationFrame(h);
		}, b = v(() => (r.filters || []).filter((e) => String(r.filterValues[e.id] ?? e.default ?? "") !== String(e.default ?? "")).length), x = (e, t) => r.t(t.label), C = v(() => {
			let e = /* @__PURE__ */ new Set(), t = [];
			return r.actions.filter((e) => e.id !== "checkin" || r.available(e)).forEach((n) => {
				if (!n.exclusiveGroup) {
					t.push(n);
					return;
				}
				if (e.has(n.exclusiveGroup)) return;
				e.add(n.exclusiveGroup);
				let i = r.actions.filter((e) => e.exclusiveGroup === n.exclusiveGroup), a = i.filter((e) => r.available(e)), o = r.selection?.length === 1 ? r.selection[0].overlays?.find((e) => i.some((t) => t.id === e.action))?.action : null;
				t.push(...a.length ? a : [i.find((e) => e.id === o) || i[0]]);
			}), t;
		}), E = {
			item: 0,
			node: 1,
			contextual: 2
		}, D = v(() => C.value.filter((e) => e.primary || e.creationRole || [
			"upload",
			"createNode",
			"createChild",
			"newArticle"
		].includes(e.id)).sort((e, t) => (E[e.creationRole] ?? 3) - (E[t.creationRole] ?? 3))), O = v(() => C.value.filter((e) => !D.value.includes(e))), k = (e) => {
			a.value?.contains(e.target) || (i.value = !1);
		}, A = (e) => {
			e.key === "Escape" && (i.value = !1);
		};
		return T(() => {
			document.addEventListener("click", k), document.addEventListener("keydown", A), c = new ResizeObserver(([e]) => {
				e.contentRect.width !== m && (m = e.contentRect.width, g());
			}), c.observe(s.value), document.fonts?.ready.then(g), g();
		}), e(g), d(() => {
			document.removeEventListener("click", k), document.removeEventListener("keydown", A), c?.disconnect(), cancelAnimationFrame(f);
		}), (e, t) => (w(), M("div", J, [j("div", {
			ref_key: "actionRow",
			ref: s,
			class: "resource-actions"
		}, [
			n.dashboardUrl ? (w(), M("a", {
				key: 0,
				class: "btn resource-dashboard-link",
				href: n.dashboardUrl,
				title: n.t(n.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD"),
				"aria-label": n.t(n.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD")
			}, [
				t[7] ||= j("span", {
					class: "fas fa-arrow-left",
					"aria-hidden": "true"
				}, null, -1),
				t[8] ||= p(),
				j("span", ue, _(n.t(n.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD")), 1)
			], 8, le)) : y("", !0),
			n.selectionMode ? (w(), M("button", {
				key: 1,
				type: "button",
				class: "btn btn-primary",
				disabled: !n.canComplete,
				title: n.t("COM_SMARTBROWSER_SELECT"),
				"aria-label": n.t("COM_SMARTBROWSER_SELECT"),
				onClick: t[0] ||= (t) => e.$emit("complete")
			}, [
				t[9] ||= j("span", {
					class: "fas fa-check",
					"aria-hidden": "true"
				}, null, -1),
				t[10] ||= p(),
				j("span", fe, _(n.t("COM_SMARTBROWSER_SELECT")), 1)
			], 8, de)) : y("", !0),
			n.allowNoUser ? (w(), M("button", {
				key: 2,
				type: "button",
				class: "btn btn-outline-secondary",
				title: n.t("JOPTION_NO_USER"),
				"aria-label": n.t("JOPTION_NO_USER"),
				onClick: t[1] ||= (t) => e.$emit("no-user")
			}, [
				t[11] ||= j("span", {
					class: "fas fa-user",
					"aria-hidden": "true"
				}, null, -1),
				t[12] ||= p(),
				j("span", Y, _(n.t("JOPTION_NO_USER")), 1)
			], 8, pe)) : y("", !0),
			(w(!0), M(S, null, l(D.value, (t) => (w(), M("button", {
				key: t.id,
				type: "button",
				class: o(["btn btn-outline-secondary", [`resource-action-${t.id}`, { "resource-contextual-add": t.creationRole === "contextual" }]]),
				title: n.t(t.label),
				"aria-label": n.t(t.label),
				disabled: !n.available(t),
				onClick: (n) => e.$emit("action", t)
			}, [j("span", {
				class: o(t.icon),
				"aria-hidden": "true"
			}, null, 2), t.creationRole === "contextual" ? y("", !0) : (w(), M("span", me, _(n.t(t.label)), 1))], 10, X))), 128)),
			O.value.length ? (w(), M("div", {
				key: 3,
				ref_key: "actionMenu",
				ref: a,
				class: "resource-action-menu-wrap"
			}, [j("button", {
				type: "button",
				class: "btn btn-outline-secondary resource-action-menu-toggle",
				"aria-expanded": i.value,
				title: n.t("COM_SMARTBROWSER_ACTIONS"),
				"aria-label": n.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: t[2] ||= (e) => i.value = !i.value
			}, [
				t[13] ||= j("span", {
					class: "fas fa-ellipsis-h",
					"aria-hidden": "true"
				}, null, -1),
				t[14] ||= p(),
				j("span", ge, _(n.t("COM_SMARTBROWSER_ACTIONS")), 1),
				t[15] ||= p(),
				t[16] ||= j("span", {
					class: "fas fa-angle-down",
					"aria-hidden": "true"
				}, null, -1)
			], 8, he), i.value ? (w(), M("div", _e, [(w(!0), M(S, null, l(O.value, (t) => (w(), M("div", {
				key: t.id,
				class: "resource-action-menu-item",
				role: "none"
			}, [j("button", {
				type: "button",
				role: "menuitem",
				class: o(`resource-action-${t.id}`),
				disabled: !n.available(t),
				onClick: (n) => {
					i.value = !1, e.$emit("action", t);
				}
			}, [j("span", {
				class: o(t.icon),
				"aria-hidden": "true"
			}, null, 2), p(" " + _(n.t(t.label)), 1)], 10, ve)]))), 128))])) : y("", !0)], 512)) : y("", !0),
			n.batchAvailable ? (w(), M("button", {
				key: 4,
				type: "button",
				class: "btn btn-outline-secondary resource-batch-toggle",
				disabled: !n.selection?.length,
				title: n.t("COM_SMARTBROWSER_BATCH_ACTIONS"),
				"aria-label": n.t("COM_SMARTBROWSER_BATCH_ACTIONS"),
				onClick: t[3] ||= (t) => e.$emit("batch")
			}, [
				t[17] ||= j("span", {
					class: "fas fa-magic",
					"aria-hidden": "true"
				}, null, -1),
				t[18] ||= p(),
				j("span", be, _(n.t("COM_SMARTBROWSER_BATCH")), 1)
			], 8, ye)) : y("", !0),
			n.filters?.length ? (w(), M("div", xe, [j("button", {
				type: "button",
				class: o(["btn resource-filter-toggle", { active: n.filtersOpen }]),
				"aria-expanded": n.filtersOpen,
				title: n.t("COM_SMARTBROWSER_FILTER_OPTIONS"),
				"aria-label": n.t("COM_SMARTBROWSER_FILTER_OPTIONS"),
				onClick: t[4] ||= (t) => e.$emit("toggle-filters")
			}, [
				t[19] ||= j("span", {
					class: "fas fa-filter",
					"aria-hidden": "true"
				}, null, -1),
				t[20] ||= p(),
				j("span", Ce, _(n.t("COM_SMARTBROWSER_FILTER_OPTIONS")), 1),
				b.value ? (w(), M("span", we, _(b.value), 1)) : y("", !0),
				j("span", {
					class: o(["fas fa-angle-down resource-filter-caret", { open: n.filtersOpen }]),
					"aria-hidden": "true"
				}, null, 2)
			], 10, Se), j("button", {
				type: "button",
				class: "btn resource-filter-clear",
				disabled: !b.value,
				title: n.t("JCLEAR"),
				onClick: t[5] ||= (t) => e.$emit("clear-filters")
			}, _(n.t("JCLEAR")), 9, Te)])) : y("", !0),
			n.flatAvailable ? (w(), M("button", {
				key: 6,
				type: "button",
				class: o(["btn resource-flat-toggle", { active: n.flatActive }]),
				title: n.t("COM_SMARTBROWSER_FLAT_VIEW"),
				"aria-label": n.t("COM_SMARTBROWSER_FLAT_VIEW"),
				"aria-pressed": n.flatActive,
				onClick: t[6] ||= (t) => e.$emit("toggle-flat")
			}, [...t[21] ||= [j("span", {
				class: "fas fa-layer-group",
				"aria-hidden": "true"
			}, null, -1)]], 10, Ee)) : y("", !0),
			n.managerUrl ? (w(), M("a", {
				key: 7,
				class: "btn resource-manager-link",
				href: n.managerUrl,
				target: n.managerNewTab ? "_blank" : void 0,
				rel: n.managerNewTab ? "noopener noreferrer" : void 0,
				title: n.t("COM_SMARTBROWSER_OPEN_JOOMLA_MANAGER"),
				"aria-label": n.t("COM_SMARTBROWSER_OPEN_JOOMLA_MANAGER")
			}, [...t[22] ||= [j("span", {
				class: "fab fa-joomla",
				"aria-hidden": "true"
			}, null, -1)]], 8, De)) : y("", !0),
			u(e.$slots, "display-controls")
		], 512), n.filters?.length && n.filtersOpen ? (w(), M("div", Oe, [(w(!0), M(S, null, l(n.filters, (t) => (w(), M("label", { key: t.id }, [j("span", null, _(n.t(t.label)), 1), t.type === "select" ? (w(), M("select", {
			key: 0,
			class: "form-select",
			value: n.filterValues[t.id] ?? t.default,
			onChange: (n) => e.$emit("filter", {
				id: t.id,
				value: n.target.value
			})
		}, [(w(!0), M(S, null, l(t.options, (e) => (w(), M("option", {
			key: e.value,
			value: e.value
		}, _(x(t, e)), 9, Ae))), 128))], 40, ke)) : y("", !0)]))), 128))])) : y("", !0)]));
	}
}, Me = ["placeholder"], Ne = ["multiple"], Pe = ["selected"], Fe = ["value", "selected"], Z = {
	__name: "ResourceFancySelect",
	props: {
		modelValue: {
			type: [Array, String],
			required: !0
		},
		options: {
			type: Array,
			default: () => []
		},
		multiple: Boolean,
		placeholder: {
			type: String,
			required: !0
		},
		t: {
			type: Function,
			required: !0
		}
	},
	emits: ["update:modelValue"],
	setup(e, { emit: n }) {
		let i = e, s = n, c = t(null), u = v(() => i.options.filter((e) => String(e.value) !== "")), f = v(() => u.value.map((e) => String(e.value)).join("|")), p = (e) => i.multiple ? i.modelValue.includes(String(e)) : String(i.modelValue) === String(e), m = (e) => s("update:modelValue", i.multiple ? Array.from(e.target.selectedOptions, (e) => e.value) : e.target.value), h, g, b, x = () => c.value?.choicesInstance?.hideDropdown(), C = () => {
			if (!h?.matches(":popover-open")) return;
			let e = c.value?.choicesInstance?.containerOuter?.element;
			if (!e) return;
			let t = e.getBoundingClientRect();
			if (t.bottom < 0 || t.top > window.innerHeight) {
				c.value.choicesInstance.hideDropdown();
				return;
			}
			let n = window.innerHeight - t.bottom - 8, r = t.top - 8, i = n < 240 && r > n, a = Math.max(0, i ? r : n);
			h.style.left = `${t.left}px`, h.style.top = `${i ? t.top : t.bottom}px`, h.style.width = `${t.width}px`, h.style.maxHeight = `${a}px`, h.style.transform = i ? "translateY(-100%)" : "", h.style.setProperty("--resource-batch-dropdown-list-height", `${Math.max(0, a - 2)}px`);
		}, E = () => {
			h && (h.classList.contains("is-active") && c.value?.closest("dialog")?.open ? (h.matches(":popover-open") || h.showPopover(), C()) : h.matches(":popover-open") && h.hidePopover());
		};
		return T(async () => {
			await r(), h = c.value?.choicesInstance?.dropdown?.element, h && (b = c.value.closest("dialog"), h.setAttribute("popover", "manual"), h.classList.add("resource-batch-choices-dropdown"), g = new MutationObserver(E), g.observe(h, {
				attributes: !0,
				attributeFilter: ["class"]
			}), window.addEventListener("scroll", C, !0), window.addEventListener("resize", C), b?.addEventListener("close", x));
		}), d(() => {
			g?.disconnect(), h?.matches(":popover-open") && h.hidePopover(), window.removeEventListener("scroll", C, !0), window.removeEventListener("resize", C), b?.removeEventListener("close", x);
		}), a(() => i.modelValue, async (e) => {
			await r();
			let t = c.value?.choicesInstance;
			if (!t) return;
			let n = i.multiple ? e : e ? [e] : [], a = t.getValue(!0), o = Array.isArray(a) ? a : a ? [a] : [];
			o.filter((e) => !n.includes(String(e))).forEach((e) => t.removeActiveItemsByValue(String(e))), n.filter((e) => !o.includes(String(e))).forEach((e) => t.setChoiceByValue(String(e)));
		}), (t, n) => (w(), M("joomla-field-fancy-select", {
			ref_key: "field",
			ref: c,
			key: f.value,
			class: o({ "resource-batch-single-select": !e.multiple }),
			placeholder: e.t(e.placeholder)
		}, [j("select", {
			class: "form-select",
			multiple: e.multiple,
			onChange: m
		}, [e.multiple ? y("", !0) : (w(), M("option", {
			key: 0,
			value: "",
			selected: !e.modelValue
		}, _(e.t(e.placeholder)), 9, Pe)), (w(!0), M(S, null, l(u.value, (t) => (w(), M("option", {
			key: t.value,
			value: String(t.value),
			selected: p(t.value)
		}, _(e.t(t.label)), 9, Fe))), 128))], 40, Ne)], 10, Me));
	}
}, Ie = { class: "resource-batch-field" }, Le = ["aria-label"], Re = ["aria-pressed", "onClick"], ze = {
	__name: "ResourceBatchModeToggle",
	props: {
		modelValue: {
			type: String,
			required: !0
		},
		t: {
			type: Function,
			required: !0
		}
	},
	emits: ["update:modelValue"],
	setup(e) {
		let t = [{
			value: "move",
			label: "COM_SMARTBROWSER_BATCH_MOVE"
		}, {
			value: "copy",
			label: "COM_SMARTBROWSER_BATCH_COPY"
		}];
		return (n, r) => (w(), M("div", Ie, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), j("div", {
			class: "btn-group resource-batch-mode-toggle",
			role: "group",
			"aria-label": e.t("COM_SMARTBROWSER_BATCH_MODE")
		}, [(w(), M(S, null, l(t, (t) => j("button", {
			key: t.value,
			type: "button",
			class: o(["btn", e.modelValue === t.value ? "is-active" : ""]),
			"aria-pressed": e.modelValue === t.value,
			onClick: (e) => n.$emit("update:modelValue", t.value)
		}, _(e.t(t.label)), 11, Re)), 64))], 8, Le)]));
	}
}, Be = ["aria-label"], Ve = { class: "resource-batch-body" }, He = {
	class: "resource-batch-heading",
	role: "heading",
	"aria-level": "3"
}, Ue = ["open"], We = { class: "resource-batch-fields" }, Ge = ["aria-label"], Ke = {
	key: 1,
	class: "text-danger"
}, qe = ["open"], Je = { class: "resource-batch-fields" }, Ye = ["disabled"], Xe = { class: "resource-batch-check" }, Q = { key: 0 }, Ze = ["open"], Qe = { class: "resource-batch-fields" }, $e = { class: "input-group" }, et = ["open"], tt = ["onClick"], nt = { class: "resource-batch-fields" }, rt = ["onUpdate:modelValue", "aria-label"], it = { value: "" }, at = ["value"], ot = ["open"], st = {
	key: 0,
	class: "resource-batch-fields"
}, ct = { class: "resource-batch-field" }, lt = { class: "resource-batch-field" }, ut = ["open"], dt = {
	key: 0,
	class: "resource-batch-fields"
}, ft = ["open"], pt = ["onClick"], mt = {
	key: 0,
	class: "resource-batch-fields"
}, ht = ["onUpdate:modelValue", "aria-label"], gt = { value: "" }, _t = ["value"], vt = ["open"], yt = {
	key: 0,
	class: "resource-batch-fields"
}, bt = { class: "resource-batch-field" }, xt = { class: "resource-batch-field" }, St = ["open"], Ct = {
	key: 0,
	class: "resource-batch-fields"
}, wt = ["open"], Tt = ["open"], Et = {
	key: 0,
	class: "resource-batch-fields"
}, Dt = ["open"], Ot = {
	key: 0,
	class: "resource-batch-fields"
}, kt = { value: "add" }, At = { value: "remove" }, jt = { value: "set" }, Mt = ["open"], Nt = {
	key: 0,
	class: "resource-batch-fields"
}, Pt = { value: "yes" }, Ft = { value: "no" }, It = { class: "resource-batch-bottom" }, Lt = { class: "resource-batch-preview" }, Rt = {
	class: "resource-batch-preview-heading",
	role: "heading",
	"aria-level": "3"
}, zt = {
	key: 0,
	class: "resource-batch-summary"
}, Bt = {
	key: 0,
	class: "fas fa-arrow-right resource-batch-sequence-arrow",
	"aria-hidden": "true"
}, Vt = { class: "resource-batch-summary-step" }, Ht = {
	class: "resource-batch-summary-step-heading",
	role: "heading",
	"aria-level": "4"
}, Ut = {
	key: 0,
	class: "resource-batch-summary-params"
}, Wt = {
	key: 1,
	class: "resource-batch-no-changes"
}, Gt = { class: "resource-batch-footer" }, Kt = { class: "resource-batch-footer-actions" }, qt = ["disabled"], Jt = ["aria-label"], Yt = { class: "resource-batch-preview-dialog-head" }, Xt = ["aria-label"], Zt = { class: "resource-batch-preview-list" }, Qt = ["title"], $t = ["title"], en = ["aria-label"], tn = { class: "resource-batch-preview-dialog-head" }, nn = ["aria-label"], rn = { class: "resource-batch-selected-list" }, an = {
	__name: "ResourceBatchDialog",
	props: {
		selection: {
			type: Array,
			required: !0
		},
		adapter: {
			type: String,
			required: !0
		},
		filters: {
			type: Array,
			default: () => []
		},
		batchOptions: {
			type: Object,
			default: () => ({})
		},
		t: {
			type: Function,
			required: !0
		}
	},
	emits: ["apply"],
	setup(e, { expose: r, emit: i }) {
		let a = e, s = i, u = m("resourceApi"), d = t(!1), f = t([]), h = t(!1), E = t(""), D = 0, O = t(null), k = t(null), P = t(null), F = v(() => a.adapter.replace(/^flat-/, "")), I = v(() => F.value === "media"), L = v(() => ["articles", "articles-by-tag"].includes(F.value)), R = v(() => F.value === "categories"), z = v(() => F.value === "tags"), te = v(() => F.value === "menus"), ne = v(() => F.value === "users"), B = v(() => ({
			articles: "article:",
			"articles-by-tag": "article:",
			categories: "category:",
			tags: "tag:",
			menus: "menu-item:",
			users: "user:"
		})[F.value]), re = v(() => B.value ? a.selection.filter((e) => e.id.startsWith(B.value)) : a.selection), ie = {
			rename: !1,
			find: "",
			replace: "",
			prefix: "",
			suffix: "",
			number: !1,
			startAt: 1,
			placement: "none",
			destination: "",
			zip: !1,
			zipName: "selection"
		}, ae = {
			changeLanguage: !1,
			language: "",
			changeAccess: !1,
			access: "",
			tagsOpen: !1,
			tagAdd: [],
			tagRemove: [],
			placement: "none",
			category: ""
		}, oe = {
			changeLanguage: !1,
			language: "",
			changeAccess: !1,
			access: "",
			tagsOpen: !1,
			tagAdd: [],
			tagRemove: [],
			placement: "none",
			category: "",
			flipOrdering: !1,
			menuDestination: ""
		}, se = {
			groupOpen: !1,
			groupAction: "add",
			group: "",
			resetOpen: !1,
			reset: "yes"
		}, V = ee({ ...ie }), H = ee({ ...ae }), U = ee({ ...oe }), W = ee({ ...se }), ce = [{
			id: "language",
			enabled: "changeLanguage",
			label: "COM_SMARTBROWSER_BATCH_SET_LANGUAGE",
			placeholder: "COM_SMARTBROWSER_SELECT_LANGUAGE"
		}, {
			id: "access",
			enabled: "changeAccess",
			label: "COM_SMARTBROWSER_BATCH_SET_ACCESS",
			placeholder: "COM_SMARTBROWSER_SELECT_ACCESS"
		}], G = ce, K = v(() => JSON.stringify(V) !== JSON.stringify(ie) || JSON.stringify(H) !== JSON.stringify(ae) || JSON.stringify(U) !== JSON.stringify(oe) || JSON.stringify(W) !== JSON.stringify(se)), q = (e) => (a.batchOptions[e] || a.filters.find((t) => t.id === e)?.options || []).filter((e) => String(e.value) !== ""), J = v(() => (a.batchOptions.menu || []).flatMap((e) => [{
			value: `${e.value}.0`,
			label: e.label
		}, ...(a.batchOptions.menuParent || []).filter((t) => t.menu === e.value).map((t) => ({
			value: `${e.value}.${t.value}`,
			label: `- ${t.label}`
		}))])), le = v(() => V.zipName.trim().replace(/\.zip$/i, "")), ue = (e) => {
			H.tagAdd = e, H.tagRemove = H.tagRemove.filter((t) => !e.includes(t));
		}, de = (e) => {
			H.tagRemove = e, H.tagAdd = H.tagAdd.filter((t) => !e.includes(t));
		}, fe = (e) => {
			U.tagAdd = e, U.tagRemove = U.tagRemove.filter((t) => !e.includes(t));
		}, pe = (e) => {
			U.tagRemove = e, U.tagAdd = U.tagAdd.filter((t) => !e.includes(t));
		}, Y = (e, t) => a.t(q(e).find((e) => String(e.value) === String(t))?.label || t), X = v(() => {
			let e = [];
			if (I.value) V.placement !== "none" && e.push({
				id: "placement",
				title: a.t(V.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
				parameters: [f.value.find((e) => e.value === V.destination)?.path || "..."]
			}), V.rename && e.push({
				id: "rename",
				title: a.t("COM_SMARTBROWSER_BATCH_RENAME"),
				parameters: [
					...V.find ? [`${a.t("COM_SMARTBROWSER_BATCH_FIND")}: ${V.find} → ${V.replace}`] : [],
					...V.prefix ? [`${a.t("COM_SMARTBROWSER_BATCH_PREFIX")}: ${V.prefix}`] : [],
					...V.suffix ? [`${a.t("COM_SMARTBROWSER_BATCH_SUFFIX")}: ${V.suffix}`] : [],
					...V.number ? [`${a.t("COM_SMARTBROWSER_BATCH_NUMBER")}: ${V.startAt}`] : []
				],
				preview: !0
			}), V.zip && e.push({
				id: "zip",
				title: a.t("COM_SMARTBROWSER_BATCH_ZIP"),
				parameters: [`${le.value}.zip`]
			});
			else if (L.value) {
				for (let t of ce) H[t.enabled] && H[t.id] && e.push({
					id: t.id,
					title: a.t(t.label),
					parameters: [Y(t.id, H[t.id])]
				});
				H.tagsOpen && H.tagAdd.length && e.push({
					id: "tag-add",
					title: a.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: H.tagAdd.map((e) => Y("tag", e))
				}), H.tagsOpen && H.tagRemove.length && e.push({
					id: "tag-remove",
					title: a.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: H.tagRemove.map((e) => Y("tag", e))
				}), H.placement !== "none" && e.unshift({
					id: "placement",
					title: a.t(H.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [H.category ? Y("category", H.category) : "..."]
				});
			} else if (R.value || z.value || te.value) {
				for (let t of G) U[t.enabled] && U[t.id] && e.push({
					id: t.id,
					title: a.t(t.label),
					parameters: [Y(t.id, U[t.id])]
				});
				R.value && (U.tagsOpen && U.tagAdd.length && e.push({
					id: "tag-add",
					title: a.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: U.tagAdd.map((e) => Y("tag", e))
				}), U.tagsOpen && U.tagRemove.length && e.push({
					id: "tag-remove",
					title: a.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: U.tagRemove.map((e) => Y("tag", e))
				}), U.placement !== "none" && e.unshift({
					id: "placement",
					title: a.t(U.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [U.category ? Y("category", U.category) : "..."]
				}), U.flipOrdering && e.push({
					id: "flip",
					title: a.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING"),
					parameters: []
				})), te.value && U.placement !== "none" && e.unshift({
					id: "placement",
					title: a.t(U.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [J.value.find((e) => e.value === U.menuDestination)?.label || "..."]
				});
			} else ne.value && (W.groupOpen && W.group && e.push({
				id: "group",
				title: a.t({
					add: "COM_SMARTBROWSER_BATCH_GROUP_ADD",
					remove: "COM_SMARTBROWSER_BATCH_GROUP_REMOVE",
					set: "COM_SMARTBROWSER_BATCH_GROUP_SET"
				}[W.groupAction]),
				parameters: [Y("group", W.group)]
			}), W.resetOpen && e.push({
				id: "reset",
				title: a.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET"),
				parameters: [a.t(W.reset === "yes" ? "JYES" : "JNO")]
			}));
			return e;
		}), me = v(() => !(!re.value.length || !X.value.length || I.value && V.placement !== "none" && !f.value.some((e) => e.value === V.destination) || L.value && H.placement !== "none" && !H.category || R.value && U.placement !== "none" && !U.category || te.value && U.placement !== "none" && !J.value.some((e) => e.value === U.menuDestination) || I.value && V.zip && !le.value)), he = () => {
			if (I.value) return {
				...V,
				zipName: le.value
			};
			if (L.value) return {
				language: H.changeLanguage ? H.language : "",
				access: H.changeAccess ? H.access : "",
				tagAdd: H.tagsOpen ? H.tagAdd : [],
				tagRemove: H.tagsOpen ? H.tagRemove : [],
				placement: H.placement,
				category: H.category
			};
			if (ne.value) return {
				group: W.groupOpen ? W.group : "",
				groupAction: W.groupAction === "remove" ? "del" : W.groupAction,
				reset: W.resetOpen ? W.reset : ""
			};
			let e = U.menuDestination.lastIndexOf(".");
			return {
				language: U.changeLanguage ? U.language : "",
				access: U.changeAccess ? U.access : "",
				tagAdd: R.value && U.tagsOpen ? U.tagAdd : [],
				tagRemove: R.value && U.tagsOpen ? U.tagRemove : [],
				placement: U.placement,
				category: U.category,
				flipOrdering: R.value && U.flipOrdering,
				menu: te.value && e >= 0 ? U.menuDestination.slice(0, e) : "",
				menuParent: te.value && e >= 0 ? U.menuDestination.slice(e + 1) : "0"
			};
		}, ge = async () => {
			if (!d.value && me.value) {
				d.value = !0;
				try {
					await new Promise((e, t) => s("apply", {
						selection: re.value.map((e) => e.id),
						payload: he(),
						resolve: e,
						reject: t
					})), Te();
				} catch (e) {
					window.Joomla?.renderMessages?.({ error: [e.message || String(e)] });
				} finally {
					d.value = !1;
				}
			}
		}, _e = (e, t) => {
			if (!V.rename) return e.title;
			let n = e.kind === "item" ? e.title.lastIndexOf(".") : -1, r = n > 0 ? e.title.slice(0, n) : e.title, i = n > 0 ? e.title.slice(n) : "", a = V.find ? r.split(V.find).join(V.replace) : r, o = V.number ? `-${String(Math.max(1, Number(V.startAt) || 1) + t).padStart(2, "0")}` : "";
			return `${V.prefix}${a}${V.suffix}${o}${i}`;
		}, ve = v(() => re.value.map((e, t) => {
			let n = e.id.includes(":") ? e.id.slice(e.id.indexOf(":") + 1) : e.title, r = V.placement !== "none" && V.destination ? `${V.destination.slice(V.destination.indexOf(":") + 1).replace(/\/$/, "")}/` : n.slice(0, n.lastIndexOf("/") + 1);
			return {
				id: e.id,
				before: n,
				after: r + _e(e, t)
			};
		})), ye = async () => {
			let e = ++D;
			h.value = !0, E.value = "";
			try {
				let t = await u.execute("batchFolders", re.value.map((e) => e.id));
				e === D && (f.value = t);
			} catch (t) {
				e === D && (E.value = t.message || String(t));
			} finally {
				e === D && (h.value = !1);
			}
		}, be = () => {
			Object.assign(V, ie), Object.assign(H, ae), Object.assign(U, oe), Object.assign(W, se), f.value = [], O.value?.showModal(), I.value && ye();
		}, xe = () => k.value?.showModal(), Se = () => {
			k.value?.open && k.value.close();
		}, Ce = () => P.value?.showModal(), we = () => {
			P.value?.open && P.value.close();
		}, Te = () => {
			D++, Se(), we(), O.value?.close();
		};
		return r({
			open: be,
			close: Te
		}), T(() => {
			window.SmartBrowserDialogDismiss.install(O.value, () => K.value), window.SmartBrowserDialogDismiss.install(k.value), window.SmartBrowserDialogDismiss.install(P.value), O.value.addEventListener("close", () => {
				Se(), we();
			});
		}), (t, r) => (w(), M(S, null, [
			j("dialog", {
				ref_key: "dialog",
				ref: O,
				class: "resource-batch-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_BATCH_ACTIONS")
			}, [j("div", Ve, [j("div", He, _(e.t("COM_SMARTBROWSER_BATCH_SELECT_ACTIONS")), 1), I.value ? (w(), M(S, { key: 0 }, [
				j("details", {
					class: "resource-batch-step",
					open: V.placement !== "none"
				}, [j("summary", { onClick: r[0] ||= C((e) => V.placement = V.placement === "none" ? "move" : "none", ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_PLACEMENT")), 1), j("div", We, [n(ze, {
					modelValue: V.placement,
					"onUpdate:modelValue": r[1] ||= (e) => V.placement = e,
					t: e.t
				}, null, 8, ["modelValue", "t"]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_DESTINATION_FOLDER")) + " ", 1), h.value ? (w(), M("span", {
					key: 0,
					class: "spinner-border spinner-border-sm",
					role: "status",
					"aria-label": e.t("COM_SMARTBROWSER_LOADING_FOLDERS")
				}, null, 8, Ge)) : E.value ? (w(), M("span", Ke, _(E.value), 1)) : (w(), N(Z, {
					key: 2,
					modelValue: V.destination,
					"onUpdate:modelValue": r[2] ||= (e) => V.destination = e,
					options: f.value,
					placeholder: "COM_SMARTBROWSER_SELECT_FOLDER",
					t: e.t
				}, null, 8, [
					"modelValue",
					"options",
					"t"
				]))])])], 8, Ue),
				j("details", {
					class: "resource-batch-step",
					open: V.rename
				}, [j("summary", { onClick: r[3] ||= C((e) => V.rename = !V.rename, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_RENAME")), 1), j("div", Je, [
					j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_FIND")), 1), c(j("input", {
						"onUpdate:modelValue": r[4] ||= (e) => V.find = e,
						type: "text",
						class: "form-control"
					}, null, 512), [[x, V.find]])]),
					j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_REPLACE")), 1), c(j("input", {
						"onUpdate:modelValue": r[5] ||= (e) => V.replace = e,
						type: "text",
						class: "form-control",
						disabled: !V.find
					}, null, 8, Ye), [[x, V.replace]])]),
					j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_PREFIX")), 1), c(j("input", {
						"onUpdate:modelValue": r[6] ||= (e) => V.prefix = e,
						type: "text",
						class: "form-control"
					}, null, 512), [[x, V.prefix]])]),
					j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_SUFFIX")), 1), c(j("input", {
						"onUpdate:modelValue": r[7] ||= (e) => V.suffix = e,
						type: "text",
						class: "form-control"
					}, null, 512), [[x, V.suffix]])]),
					j("label", Xe, [c(j("input", {
						"onUpdate:modelValue": r[8] ||= (e) => V.number = e,
						type: "checkbox",
						class: "form-check-input"
					}, null, 512), [[A, V.number]]), p(" " + _(e.t("COM_SMARTBROWSER_BATCH_NUMBER")), 1)]),
					V.number ? (w(), M("label", Q, [p(_(e.t("COM_SMARTBROWSER_BATCH_START_AT")), 1), c(j("input", {
						"onUpdate:modelValue": r[9] ||= (e) => V.startAt = e,
						type: "number",
						min: "1",
						class: "form-control"
					}, null, 512), [[
						x,
						V.startAt,
						void 0,
						{ number: !0 }
					]])])) : y("", !0)
				])], 8, qe),
				j("details", {
					class: "resource-batch-step",
					open: V.zip
				}, [j("summary", { onClick: r[10] ||= C((e) => V.zip = !V.zip, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_ZIP")), 1), j("div", Qe, [j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_ZIP_NAME")), 1), j("span", $e, [c(j("input", {
					"onUpdate:modelValue": r[11] ||= (e) => V.zipName = e,
					type: "text",
					class: "form-control",
					onBlur: r[12] ||= (e) => V.zipName = le.value
				}, null, 544), [[x, V.zipName]]), r[30] ||= j("span", { class: "input-group-text" }, ".zip", -1)])])])], 8, Ze)
			], 64)) : L.value ? (w(), M(S, { key: 1 }, [
				(w(), M(S, null, l(ce, (t) => j("details", {
					key: t.id,
					class: "resource-batch-step",
					open: H[t.enabled]
				}, [j("summary", { onClick: C((e) => H[t.enabled] = !H[t.enabled], ["prevent"]) }, _(e.t(t.label)), 9, tt), j("div", nt, [c(j("select", {
					"onUpdate:modelValue": (e) => H[t.id] = e,
					class: "form-select",
					"aria-label": e.t(t.label)
				}, [j("option", it, _(e.t(t.placeholder)), 1), (w(!0), M(S, null, l(q(t.id), (t) => (w(), M("option", {
					key: t.value,
					value: t.value
				}, _(e.t(t.label)), 9, at))), 128))], 8, rt), [[b, H[t.id]]])])], 8, et)), 64)),
				j("details", {
					class: "resource-batch-step",
					open: H.tagsOpen
				}, [j("summary", { onClick: r[13] ||= C((e) => H.tagsOpen = !H.tagsOpen, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), H.tagsOpen ? (w(), M("div", st, [j("div", ct, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), n(Z, {
					"model-value": H.tagAdd,
					options: q("tag"),
					multiple: "",
					placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
					t: e.t,
					"onUpdate:modelValue": ue
				}, null, 8, [
					"model-value",
					"options",
					"t"
				])]), j("div", lt, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), n(Z, {
					"model-value": H.tagRemove,
					options: q("tag"),
					multiple: "",
					placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
					t: e.t,
					"onUpdate:modelValue": de
				}, null, 8, [
					"model-value",
					"options",
					"t"
				])])])) : y("", !0)], 8, ot),
				j("details", {
					class: "resource-batch-step",
					open: H.placement !== "none"
				}, [j("summary", { onClick: r[14] ||= C((e) => H.placement = H.placement === "none" ? "move" : "none", ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), H.placement === "none" ? y("", !0) : (w(), M("div", dt, [n(ze, {
					modelValue: H.placement,
					"onUpdate:modelValue": r[15] ||= (e) => H.placement = e,
					t: e.t
				}, null, 8, ["modelValue", "t"]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_CATEGORY")), 1), n(Z, {
					modelValue: H.category,
					"onUpdate:modelValue": r[16] ||= (e) => H.category = e,
					options: q("category"),
					placeholder: "COM_SMARTBROWSER_SELECT_CATEGORY",
					t: e.t
				}, null, 8, [
					"modelValue",
					"options",
					"t"
				])])]))], 8, ut)
			], 64)) : R.value || z.value || te.value ? (w(), M(S, { key: 2 }, [
				(w(!0), M(S, null, l(g(G), (t) => (w(), M("details", {
					key: t.id,
					class: "resource-batch-step",
					open: U[t.enabled]
				}, [j("summary", { onClick: C((e) => U[t.enabled] = !U[t.enabled], ["prevent"]) }, _(e.t(t.label)), 9, pt), U[t.enabled] ? (w(), M("div", mt, [c(j("select", {
					"onUpdate:modelValue": (e) => U[t.id] = e,
					class: "form-select",
					"aria-label": e.t(t.label)
				}, [j("option", gt, _(e.t(t.placeholder)), 1), (w(!0), M(S, null, l(q(t.id), (t) => (w(), M("option", {
					key: t.value,
					value: t.value
				}, _(e.t(t.label)), 9, _t))), 128))], 8, ht), [[b, U[t.id]]])])) : y("", !0)], 8, ft))), 128)),
				R.value ? (w(), M("details", {
					key: 0,
					class: "resource-batch-step",
					open: U.tagsOpen
				}, [j("summary", { onClick: r[17] ||= C((e) => U.tagsOpen = !U.tagsOpen, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), U.tagsOpen ? (w(), M("div", yt, [j("div", bt, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), n(Z, {
					"model-value": U.tagAdd,
					options: q("tag"),
					multiple: "",
					placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
					t: e.t,
					"onUpdate:modelValue": fe
				}, null, 8, [
					"model-value",
					"options",
					"t"
				])]), j("div", xt, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), n(Z, {
					"model-value": U.tagRemove,
					options: q("tag"),
					multiple: "",
					placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
					t: e.t,
					"onUpdate:modelValue": pe
				}, null, 8, [
					"model-value",
					"options",
					"t"
				])])])) : y("", !0)], 8, vt)) : y("", !0),
				R.value ? (w(), M("details", {
					key: 1,
					class: "resource-batch-step",
					open: U.placement !== "none"
				}, [j("summary", { onClick: r[18] ||= C((e) => U.placement = U.placement === "none" ? "move" : "none", ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), U.placement === "none" ? y("", !0) : (w(), M("div", Ct, [n(ze, {
					modelValue: U.placement,
					"onUpdate:modelValue": r[19] ||= (e) => U.placement = e,
					t: e.t
				}, null, 8, ["modelValue", "t"]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_PARENT_CATEGORY")), 1), n(Z, {
					modelValue: U.category,
					"onUpdate:modelValue": r[20] ||= (e) => U.category = e,
					options: q("category"),
					placeholder: "COM_SMARTBROWSER_SELECT_CATEGORY",
					t: e.t
				}, null, 8, [
					"modelValue",
					"options",
					"t"
				])])]))], 8, St)) : y("", !0),
				R.value ? (w(), M("details", {
					key: 2,
					class: "resource-batch-step",
					open: U.flipOrdering
				}, [j("summary", { onClick: r[21] ||= C((e) => U.flipOrdering = !U.flipOrdering, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING")), 1)], 8, wt)) : y("", !0),
				te.value ? (w(), M("details", {
					key: 3,
					class: "resource-batch-step",
					open: U.placement !== "none"
				}, [j("summary", { onClick: r[22] ||= C((e) => U.placement = U.placement === "none" ? "move" : "none", ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_MENU_PLACEMENT")), 1), U.placement === "none" ? y("", !0) : (w(), M("div", Et, [n(ze, {
					modelValue: U.placement,
					"onUpdate:modelValue": r[23] ||= (e) => U.placement = e,
					t: e.t
				}, null, 8, ["modelValue", "t"]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_MENU_DESTINATION")), 1), n(Z, {
					modelValue: U.menuDestination,
					"onUpdate:modelValue": r[24] ||= (e) => U.menuDestination = e,
					options: J.value,
					placeholder: "COM_SMARTBROWSER_SELECT_MENU",
					t: e.t
				}, null, 8, [
					"modelValue",
					"options",
					"t"
				])])]))], 8, Tt)) : y("", !0)
			], 64)) : ne.value ? (w(), M(S, { key: 3 }, [j("details", {
				class: "resource-batch-step",
				open: W.groupOpen
			}, [j("summary", { onClick: r[25] ||= C((e) => W.groupOpen = !W.groupOpen, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_USER_GROUPS")), 1), W.groupOpen ? (w(), M("div", Ot, [j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), c(j("select", {
				"onUpdate:modelValue": r[26] ||= (e) => W.groupAction = e,
				class: "form-select resource-batch-mode-select"
			}, [
				j("option", kt, _(e.t("COM_SMARTBROWSER_BATCH_GROUP_ADD")), 1),
				j("option", At, _(e.t("COM_SMARTBROWSER_BATCH_GROUP_REMOVE")), 1),
				j("option", jt, _(e.t("COM_SMARTBROWSER_BATCH_GROUP_SET")), 1)
			], 512), [[b, W.groupAction]])]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_USER_GROUP")), 1), n(Z, {
				modelValue: W.group,
				"onUpdate:modelValue": r[27] ||= (e) => W.group = e,
				options: q("group"),
				placeholder: "COM_SMARTBROWSER_SELECT_USER_GROUP",
				t: e.t
			}, null, 8, [
				"modelValue",
				"options",
				"t"
			])])])) : y("", !0)], 8, Dt), j("details", {
				class: "resource-batch-step",
				open: W.resetOpen
			}, [j("summary", { onClick: r[28] ||= C((e) => W.resetOpen = !W.resetOpen, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), W.resetOpen ? (w(), M("div", Nt, [j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), c(j("select", {
				"onUpdate:modelValue": r[29] ||= (e) => W.reset = e,
				class: "form-select"
			}, [j("option", Pt, _(e.t("JYES")), 1), j("option", Ft, _(e.t("JNO")), 1)], 512), [[b, W.reset]])])])) : y("", !0)], 8, Mt)], 64)) : y("", !0)]), j("div", It, [j("div", Lt, [j("div", Rt, _(e.t("COM_SMARTBROWSER_BATCH_PREVIEW")), 1), X.value.length ? (w(), M("div", zt, [(w(!0), M(S, null, l(X.value, (t, n) => (w(), M("div", {
				key: t.id,
				class: "resource-batch-sequence-item"
			}, [n ? (w(), M("span", Bt)) : y("", !0), j("div", Vt, [j("div", Ht, _(t.title), 1), t.parameters.length || t.preview ? (w(), M("div", Ut, [(w(!0), M(S, null, l(t.parameters, (e) => (w(), M("span", { key: e }, _(e), 1))), 128)), t.preview ? (w(), M("button", {
				key: 0,
				type: "button",
				class: "resource-batch-preview-link",
				onClick: xe
			}, _(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")), 1)) : y("", !0)])) : y("", !0)])]))), 128))])) : (w(), M("p", Wt, _(e.t("COM_SMARTBROWSER_BATCH_NO_CHANGES")), 1))]), j("div", Gt, [j("button", {
				type: "button",
				class: "resource-batch-items-link",
				onClick: Ce
			}, _(re.value.length) + " " + _(e.t(re.value.length === 1 ? "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_ONE" : "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_MANY")), 1), j("div", Kt, [j("button", {
				type: "button",
				class: "btn btn-primary",
				disabled: d.value || !me.value,
				onClick: ge
			}, _(e.t("COM_SMARTBROWSER_BATCH_APPLY")), 9, qt), j("button", {
				type: "button",
				class: "btn btn-danger",
				onClick: Te
			}, _(e.t("COM_SMARTBROWSER_CANCEL")), 1)])])])], 8, Be),
			j("dialog", {
				ref_key: "previewDialog",
				ref: k,
				class: "resource-batch-preview-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")
			}, [j("div", Yt, [j("strong", null, _(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")) + " (" + _(ve.value.length) + ")", 1), j("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: Se
			}, null, 8, Xt)]), j("div", Zt, [(w(!0), M(S, null, l(ve.value, (e) => (w(), M("div", {
				key: e.id,
				class: "resource-batch-preview-row"
			}, [
				j("span", { title: e.before }, _(e.before), 9, Qt),
				r[31] ||= j("span", {
					class: "fas fa-arrow-right",
					"aria-hidden": "true"
				}, null, -1),
				j("strong", { title: e.after }, _(e.after), 9, $t)
			]))), 128))])], 8, Jt),
			j("dialog", {
				ref_key: "selectionDialog",
				ref: P,
				class: "resource-batch-preview-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_SELECTED_ITEMS")
			}, [j("div", tn, [j("strong", null, _(e.t("COM_SMARTBROWSER_SELECTED_ITEMS")), 1), j("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: we
			}, null, 8, nn)]), j("ul", rn, [(w(!0), M(S, null, l(re.value, (e) => (w(), M("li", { key: e.id }, [j("span", {
				class: o(e.icon || "fas fa-file"),
				"aria-hidden": "true"
			}, null, 2), j("span", null, _(e.title), 1)]))), 128))])], 8, en)
		], 64));
	}
}, on = (e) => (e || []).filter((e) => e.type === "resource" && e.visualRole === "thumbnail");
function sn(e, t = {}) {
	if (!e || e.unavailable) return "";
	let n = t["visual.iconOverride"];
	return typeof n == "string" && n.length <= 160 && /^[a-zA-Z0-9_-]+(?: [a-zA-Z0-9_-]+)*$/.test(n) ? n : e.icon || "fas fa-file";
}
function cn(e) {
	return !e || e.unavailable ? "" : e.thumbnail || e.metadata?.thumbnail || e.metadata?.poster || e.image || (e.type === "image" ? e.metadata?.url : "") || "";
}
//#endregion
//#region resources/js/core/selectionUsage.js
var ln = /^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/, un = (e, t) => Object.prototype.hasOwnProperty.call(e, t), dn = (e) => e === void 0 ? void 0 : JSON.parse(JSON.stringify(e)), fn = (e) => e == null || typeof e == "string" && !e.trim(), pn = /* @__PURE__ */ new Set([
	"text",
	"textarea",
	"boolean",
	"select",
	"number",
	"resource"
]), mn = (e, t) => !!(e.disabledWhen && un(t || {}, e.disabledWhen.key) && t[e.disabledWhen.key] === e.disabledWhen.equals);
function hn(e, t = {}) {
	if (!e || e.unavailable || !t || typeof t != "object") return [];
	let n = Array.isArray(e.selectionCapabilities) ? e.selectionCapabilities : [], r = /* @__PURE__ */ new Set();
	return n.flatMap((e) => {
		let n = e?.key;
		if (!ln.test(n || "") || ![
			"string",
			"boolean",
			"number",
			"resource",
			"object"
		].includes(e.type) || r.has(n) || !un(t, n) || t[n] === !1) return [];
		r.add(n);
		let i = t[n] && typeof t[n] == "object" ? t[n] : {};
		return [{
			...e,
			policy: i,
			presentation: ["secondary", "hidden"].includes(i.presentation) ? i.presentation : "primary",
			default: un(i, "default") ? i.default : e.default,
			required: i.required === !0
		}];
	});
}
function gn(e, t) {
	if (fn(t)) return e.required ? "COM_SMARTBROWSER_USAGE_REQUIRED" : null;
	let n = e.type;
	if (n === "string" && typeof t != "string" || n === "boolean" && typeof t != "boolean" || n === "number" && (typeof t != "number" || !Number.isFinite(t)) || n === "object" && (typeof t != "object" || Array.isArray(t)) || n === "resource" && !L(t)) return "COM_SMARTBROWSER_USAGE_INVALID";
	let r = [e.validation || {}, e.policy?.constraints || {}];
	for (let e of r) {
		if (typeof t == "string" && (e.maxLength != null && [...t].length > e.maxLength || e.minLength != null && [...t].length < e.minLength) || typeof t == "number" && (e.min != null && t < e.min || e.max != null && t > e.max || e.integer === !0 && !Number.isInteger(t)) || Array.isArray(e.allowedValues) && !e.allowedValues.includes(t)) return "COM_SMARTBROWSER_USAGE_INVALID";
		if (e.pattern && typeof t == "string") try {
			if (!new RegExp(e.pattern, "u").test(t)) return "COM_SMARTBROWSER_USAGE_INVALID";
		} catch {
			return "COM_SMARTBROWSER_USAGE_INVALID";
		}
	}
	return Array.isArray(e.options) && !e.options.some((e) => e.value === t) ? "COM_SMARTBROWSER_USAGE_INVALID" : null;
}
function _n({ profile: e = {}, initialUsage: t = {}, resolveReference: n, editors: r = {} } = {}) {
	let i = /* @__PURE__ */ new Map(), a = (t) => hn(t, e);
	function o(e) {
		if (!e) return {};
		let n = P(e);
		i.has(n) || i.set(n, e.unavailable ? dn(t[n] || {}) : {});
		let r = i.get(n);
		for (let i of a(e)) un(r, i.key) || (r[i.key] = dn(un(t[n] || {}, i.key) ? t[n][i.key] : i.default ?? null));
		for (let t of a(e)) mn(t, r) && (r[t.key] = dn(t.inactiveValue ?? null));
		return dn(r);
	}
	function s(e, t, n) {
		a(e).some((e) => e.key === t) && (o(e), i.get(P(e))[t] = dn(n), o(e));
	}
	async function c(e) {
		let t = {}, i = {}, s = {};
		for (let c of e) {
			let e = P(c), l = o(c), u = {};
			for (let o of a(c)) {
				let a = l[o.key], s = gn(mn(o, l) ? {
					...o,
					required: !1
				} : o, a);
				if (!s && o.type === "resource" && !fn(a)) {
					let e = L(a), t = o.picker || {};
					if (t.adapter && e.adapter !== t.adapter || t.allowedAdapters?.length && !t.allowedAdapters.includes(e.adapter)) s = "COM_SMARTBROWSER_USAGE_INVALID";
					else try {
						let r = await n(e, t);
						(!r || r.unavailable || r.selectable === !1 || t.selectionTarget === "item" && r.kind !== "item" || t.selectionTarget === "node" && r.kind !== "node" || t.allowedResourceTypes?.length && !t.allowedResourceTypes.includes(r.type)) && (s = "COM_SMARTBROWSER_USAGE_INVALID");
					} catch {
						s = "COM_SMARTBROWSER_USAGE_INVALID";
					}
				}
				let d = r[o.editor];
				if (o.presentation !== "hidden" && !pn.has(o.editor) && !d && (s = "COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE"), !s && d?.validate) try {
					s = await d.validate(a, {
						definition: o,
						resource: c,
						values: l
					}) || null;
				} catch {
					s = "COM_SMARTBROWSER_USAGE_INVALID";
				}
				s && (t[e] ||= {}, t[e][o.key] = s, o.presentation === "hidden" && (i[e] ||= {}, i[e][o.key] = s)), u[o.key] = o.type === "resource" && !fn(a) ? L(a) : a;
			}
			s[e] = c.unavailable ? l : u;
		}
		return {
			valid: !Object.keys(t).length,
			errors: t,
			profileErrors: i,
			usage: s
		};
	}
	return {
		definitions: a,
		get: o,
		set: s,
		validate: c
	};
}
//#endregion
//#region resources/js/components/LightweightResourceVisual.vue
var vn = { class: "resource-lightweight-area" }, yn = ["src"], bn = {
	key: 0,
	class: "resource-lightweight-actions resource-lightweight-preview-action"
}, xn = ["title", "aria-label"], Sn = { class: "resource-lightweight-actions" }, Cn = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], wn = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], Tn = {
	key: 0,
	class: "text-danger",
	role: "alert"
}, En = {
	__name: "LightweightResourceVisual",
	props: {
		resource: Object,
		definitions: Array,
		values: Object,
		errors: Object,
		resolveReference: Function,
		canPreview: Boolean,
		editable: Boolean,
		t: Function
	},
	emits: ["change", "preview"],
	setup(e, { expose: n, emit: r }) {
		let i = e, s = r, c = v(() => on(i.definitions)), f = v(() => i.editable ? c.value.filter((e) => e.presentation !== "hidden") : []), p = v(() => sn(i.resource, i.values)), m = v(() => c.value.find((e) => i.values?.[e.key])), h = t(""), g = t(""), b = t(""), x = t(!1), C = t(null), T = v(() => h.value || cn(i.resource)), E = 0, D = !1;
		a(() => [
			P(i.resource),
			m.value,
			m.value && i.values?.[m.value.key]
		], async () => {
			let e = ++E;
			h.value = "", g.value = "", b.value = "";
			let t = m.value;
			if (t) try {
				let n = await i.resolveReference(i.values[t.key], t.picker);
				if (e !== E) return;
				!n || n.unavailable || n.selectable === !1 || !cn(n) || t.picker?.allowedResourceTypes?.length && !t.picker.allowedResourceTypes.includes(n.type) ? b.value = "COM_SMARTBROWSER_USAGE_INVALID" : h.value = cn(n);
			} catch {
				e === E && (b.value = "COM_SMARTBROWSER_USAGE_INVALID");
			}
		}, {
			immediate: !0,
			deep: !0
		});
		async function O(e) {
			let t = P(i.resource);
			x.value = !0;
			try {
				let n = await window.SmartBrowserPicker.open({
					...e.picker,
					multiple: !1,
					initialSelection: i.values?.[e.key] ? [i.values[e.key].id] : []
				});
				n && !D && P(i.resource) === t && s("change", e.key, L({
					adapter: e.picker.adapter,
					id: n.id
				}));
			} catch {
				!D && P(i.resource) === t && (b.value = "COM_SMARTBROWSER_USAGE_INVALID");
			} finally {
				x.value = !1;
			}
		}
		return n({ element: C }), d(() => {
			D = !0, ++E;
		}), (t, n) => (w(), M(S, null, [j("div", vn, [
			j("div", {
				ref_key: "surface",
				ref: C,
				class: o(["resource-lightweight-visual", { "has-override": !!m.value }])
			}, [T.value && g.value !== T.value ? (w(), M("img", {
				key: 0,
				src: T.value,
				alt: "",
				loading: "lazy",
				onError: n[0] ||= (e) => g.value = T.value
			}, null, 40, yn)) : y("", !0), j("span", {
				class: o(["resource-lightweight-icon", [p.value, { "with-thumbnail": T.value && g.value !== T.value }]]),
				"aria-hidden": "true"
			}, null, 2)], 2),
			e.canPreview ? (w(), M("div", bn, [e.canPreview ? (w(), M("button", {
				key: 0,
				type: "button",
				title: e.t("COM_SMARTBROWSER_ACTION_PREVIEW"),
				"aria-label": e.t("COM_SMARTBROWSER_ACTION_PREVIEW"),
				onClick: n[1] ||= (e) => t.$emit("preview")
			}, [...n[2] ||= [j("span", {
				class: "fas fa-eye",
				"aria-hidden": "true"
			}, null, -1)]], 8, xn)) : y("", !0)])) : y("", !0),
			j("div", Sn, [(w(!0), M(S, null, l(f.value, (r) => (w(), M(S, { key: r.key }, [j("button", {
				type: "button",
				class: o({ selected: !!e.values?.[r.key] }),
				disabled: x.value,
				title: e.t(e.values?.[r.key] ? "COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL" : "COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL"),
				"aria-label": e.t(e.values?.[r.key] ? "COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL" : "COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL"),
				onClick: (e) => O(r)
			}, [...n[3] ||= [j("span", {
				class: "fas fa-image",
				"aria-hidden": "true"
			}, null, -1)]], 10, Cn), e.values?.[r.key] ? (w(), M("button", {
				key: 0,
				type: "button",
				disabled: x.value,
				title: e.t("COM_SMARTBROWSER_USAGE_CLEAR"),
				"aria-label": e.t("COM_SMARTBROWSER_USAGE_CLEAR"),
				onClick: (e) => t.$emit("change", r.key, null)
			}, [...n[4] ||= [j("span", {
				class: "fas fa-times",
				"aria-hidden": "true"
			}, null, -1)]], 8, wn)) : y("", !0)], 64))), 128)), u(t.$slots, "actions")])
		]), b.value || c.value.some((t) => e.errors?.[t.key]) ? (w(), M("small", Tn, _(e.t(b.value || e.errors[c.value.find((t) => e.errors?.[t.key]).key])), 1)) : y("", !0)], 64));
	}
}, Dn = { class: "resource-usage-field" }, On = {
	key: 0,
	"aria-hidden": "true"
}, kn = [
	"value",
	"disabled",
	"required",
	"aria-invalid"
], An = [
	"value",
	"required",
	"aria-invalid"
], jn = {
	key: 3,
	class: "resource-usage-check"
}, Mn = ["checked"], Nn = ["value", "aria-invalid"], Pn = {
	key: 0,
	value: ""
}, Fn = ["value"], In = ["value", "aria-invalid"], Ln = ["value"], Rn = { value: "auto" }, zn = { value: "custom" }, Bn = {
	key: 0,
	class: "resource-usage-reference"
}, Vn = { key: 0 }, Hn = ["disabled"], Un = ["title", "aria-label"], Wn = {
	key: 8,
	class: "text-danger"
}, Gn = { key: 9 }, Kn = {
	key: 10,
	class: "text-danger",
	role: "alert"
}, qn = {
	__name: "SelectionUsageField",
	props: {
		definition: Object,
		resource: Object,
		value: null,
		values: Object,
		error: String,
		t: Function,
		editors: Object,
		resolveReference: Function
	},
	emits: ["change"],
	setup(e, { emit: n }) {
		let i = e, o = n, s = `sb-usage-${Math.random().toString(36).slice(2)}`, c = t(i.value ? "custom" : "auto"), u = t(""), f = t(!1), m = t(""), h = t(null), g = v(() => i.editors?.[i.definition.editor]), b = v(() => mn(i.definition, i.values)), x, C, T = 0, E = !1, D = (e) => {
			m.value = "", o("change", e);
		}, O = () => {
			c.value = "auto", D(null);
		}, k = (e) => {
			c.value = e, e === "auto" && D(null);
		};
		a(() => i.value, async (e) => {
			let t = ++T;
			if (m.value = "", u.value = "", i.definition.type === "resource" && e) {
				c.value = "custom";
				try {
					let n = await i.resolveReference(e, i.definition.picker);
					t === T && (u.value = n?.title || "", (!n || n.unavailable) && (m.value = "COM_SMARTBROWSER_USAGE_INVALID"));
				} catch {
					t === T && (m.value = "COM_SMARTBROWSER_USAGE_INVALID");
				}
			}
		}, { immediate: !0 });
		async function A() {
			f.value = !0;
			try {
				let e = await window.SmartBrowserPicker.open({
					...i.definition.picker,
					multiple: !1,
					initialSelection: i.value ? [i.value.id] : []
				});
				e && !E && D(L({
					adapter: i.definition.picker.adapter,
					id: e.id
				}));
			} catch {
				m.value = "COM_SMARTBROWSER_USAGE_INVALID";
			} finally {
				f.value = !1;
			}
		}
		return a([g, () => P(i.resource)], async () => {
			if (C?.abort(), x?.destroy?.(), x = null, await r(), !E && g.value && h.value) {
				C = new AbortController();
				try {
					x = g.value.mount(h.value, {
						definition: i.definition,
						resource: i.resource,
						id: s,
						value: i.value,
						values: i.values,
						setValue: D,
						signal: C.signal,
						translate: i.t
					}) || null;
				} catch {
					m.value = "COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE";
				}
			}
		}, { immediate: !0 }), a(() => [i.value, i.values], () => x?.update?.({
			value: i.value,
			values: i.values
		}), { deep: !0 }), d(() => {
			E = !0, ++T, C?.abort(), x?.destroy?.();
		}), (t, n) => (w(), M("div", Dn, [
			e.definition.editor === "boolean" ? y("", !0) : (w(), M("label", {
				key: 0,
				for: s
			}, [p(_(e.t(e.definition.label)), 1), e.definition.required ? (w(), M("span", On, " *")) : y("", !0)])),
			e.definition.editor === "text" ? (w(), M("input", {
				key: 1,
				id: s,
				class: "form-control",
				type: "text",
				value: e.value ?? "",
				disabled: b.value,
				required: e.definition.required && !b.value,
				"aria-invalid": !!e.error,
				onInput: n[0] ||= (e) => D(e.target.value)
			}, null, 40, kn)) : e.definition.editor === "textarea" ? (w(), M("textarea", {
				key: 2,
				id: s,
				class: "form-control",
				rows: "3",
				value: e.value ?? "",
				required: e.definition.required,
				"aria-invalid": !!e.error,
				onInput: n[1] ||= (e) => D(e.target.value)
			}, null, 40, An)) : e.definition.editor === "boolean" ? (w(), M("label", jn, [j("input", {
				id: s,
				class: "form-check-input",
				type: "checkbox",
				checked: e.value === !0,
				onChange: n[2] ||= (e) => D(e.target.checked)
			}, null, 40, Mn), p(_(e.t(e.definition.label)), 1)])) : e.definition.editor === "select" ? (w(), M("select", {
				key: 4,
				id: s,
				class: "form-select",
				value: e.value,
				"aria-invalid": !!e.error,
				onChange: n[3] ||= (t) => D(e.definition.options.find((e) => String(e.value) === t.target.value)?.value)
			}, [!e.definition.required && !e.definition.options?.some((e) => e.value === "") ? (w(), M("option", Pn, _(e.t("COM_SMARTBROWSER_USAGE_CHOOSE")), 1)) : y("", !0), (w(!0), M(S, null, l(e.definition.options, (t) => (w(), M("option", {
				key: String(t.value),
				value: t.value
			}, _(e.t(t.label)), 9, Fn))), 128))], 40, Nn)) : e.definition.editor === "number" ? (w(), M("input", {
				key: 5,
				id: s,
				class: "form-control",
				type: "number",
				value: e.value ?? "",
				"aria-invalid": !!e.error,
				onInput: n[4] ||= (e) => D(e.target.value === "" ? null : Number(e.target.value))
			}, null, 40, In)) : e.definition.editor === "resource" ? (w(), M(S, { key: 6 }, [j("select", {
				id: s,
				class: "form-select",
				value: c.value,
				onChange: n[5] ||= (e) => k(e.target.value)
			}, [j("option", Rn, _(e.t("COM_SMARTBROWSER_USAGE_AUTO")), 1), j("option", zn, _(e.t("COM_SMARTBROWSER_USAGE_CUSTOM")), 1)], 40, Ln), c.value === "custom" ? (w(), M("div", Bn, [
				e.value ? (w(), M("span", Vn, _(u.value || e.value.id), 1)) : y("", !0),
				j("button", {
					type: "button",
					class: "btn btn-outline-primary",
					disabled: f.value,
					onClick: A
				}, [n[6] ||= j("span", {
					class: "fas fa-plus",
					"aria-hidden": "true"
				}, null, -1), p(" " + _(e.t(e.definition.pickerLabel || "COM_SMARTBROWSER_USAGE_PICK_RESOURCE")), 1)], 8, Hn),
				e.value ? (w(), M("button", {
					key: 1,
					type: "button",
					class: "btn btn-outline-secondary",
					title: e.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					"aria-label": e.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					onClick: O
				}, [...n[7] ||= [j("span", {
					class: "fas fa-times",
					"aria-hidden": "true"
				}, null, -1)]], 8, Un)) : y("", !0)
			])) : y("", !0)], 64)) : g.value ? (w(), M("div", {
				key: 7,
				ref_key: "customContainer",
				ref: h
			}, null, 512)) : (w(), M("small", Wn, _(e.t("COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE")), 1)),
			e.definition.description ? (w(), M("small", Gn, _(e.t(e.definition.description)), 1)) : y("", !0),
			e.error || m.value ? (w(), M("small", Kn, _(e.t(e.error || m.value)), 1)) : y("", !0)
		]));
	}
}, Jn = { class: "resource-usage-editor" }, Yn = ["open"], Xn = {
	__name: "SelectionUsageEditor",
	props: {
		definitions: Array,
		values: Object,
		errors: Object,
		resource: Object,
		t: Function,
		editors: Object,
		resolveReference: Function
	},
	emits: ["change"],
	setup(e) {
		let t = e, n = v(() => t.definitions.filter((e) => e.presentation === "primary")), r = v(() => t.definitions.filter((e) => e.presentation === "secondary")), a = (e) => ({
			definition: e,
			value: t.values[e.key],
			values: t.values,
			error: t.errors?.[e.key],
			resource: t.resource,
			t: t.t,
			editors: t.editors,
			resolveReference: t.resolveReference
		});
		return (t, o) => (w(), M("div", Jn, [(w(!0), M(S, null, l(n.value, (e) => (w(), N(qn, i({ key: e.key }, { ref_for: !0 }, a(e), { onChange: (n) => t.$emit("change", e.key, n) }), null, 16, ["onChange"]))), 128)), r.value.length ? (w(), M("details", {
			key: 0,
			class: "resource-usage-secondary",
			open: r.value.some((t) => e.errors?.[t.key]) || void 0
		}, [j("summary", null, _(e.t("COM_SMARTBROWSER_USAGE_MORE")), 1), (w(!0), M(S, null, l(r.value, (e) => (w(), N(qn, i({ key: e.key }, { ref_for: !0 }, a(e), { onChange: (n) => t.$emit("change", e.key, n) }), null, 16, ["onChange"]))), 128))], 8, Yn)) : y("", !0)]));
	}
}, Zn = {
	key: 0,
	class: "resource-info-tabs",
	role: "tablist"
}, Qn = ["aria-selected"], $n = ["aria-selected"], er = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], tr = { key: 0 }, nr = {
	key: 0,
	class: "resource-language"
}, rr = ["src"], ir = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, ar = {
	key: 2,
	class: "resource-info-timezone"
}, or = { key: 1 }, sr = { key: 0 }, cr = { key: 1 }, lr = {
	key: 0,
	class: "resource-info-timezone"
}, ur = { key: 2 }, dr = {
	key: 0,
	class: "resource-info-timezone"
}, fr = { key: 3 }, pr = { key: 4 }, mr = { key: 5 }, hr = { key: 6 }, gr = {
	__name: "ResourceInfoPanel",
	props: {
		resource: Object,
		fields: Array,
		t: Function,
		usageDefinitions: Array,
		usageValues: Object,
		usageErrors: Object,
		usageEditors: Object,
		resolveReference: Function,
		previewActions: Array,
		previewContext: Object,
		usageRevision: Number,
		canPreview: Boolean
	},
	emits: ["usage-change", "preview"],
	setup(e) {
		let r = e, i = v(() => (r.usageDefinitions || []).filter((e) => !on([e]).length)), u = t("info"), f = t("usage"), m = (e) => {
			f.value = e, u.value = e;
		}, h = t(!1), b = t(null), x;
		a(() => P(r.resource), () => x?.abort()), d(() => x?.abort()), a(() => !!r.usageDefinitions?.length, (e) => {
			u.value = e ? f.value : "info";
		}, { immediate: !0 }), a(() => r.usageRevision, () => {
			r.usageDefinitions?.length && (u.value = "usage");
		});
		async function C(e) {
			h.value = !0, x = new AbortController();
			let t = x.signal;
			try {
				await e.run({
					...r.previewContext,
					previewElement: b.value?.element,
					signal: t
				});
			} catch (e) {
				t.aborted || Joomla.renderMessages({ error: [e.message || r.t("COM_SMARTBROWSER_USAGE_INVALID")] });
			} finally {
				h.value = !1;
			}
		}
		let T = [
			["metadata.access", "JFIELD_ACCESS_LABEL"],
			["metadata.categoryPath", "COM_SMARTBROWSER_CATEGORY_HIERARCHY"],
			["metadata.parent", "COM_SMARTBROWSER_PARENT"],
			["metadata.parentPath", "COM_SMARTBROWSER_PARENT"],
			["metadata.tagPaths", "COM_SMARTBROWSER_TAG_HIERARCHY"],
			["metadata.url", "COM_SMARTBROWSER_URL"],
			["metadata.link", "COM_SMARTBROWSER_URL"],
			["metadata.mimeType", "COM_SMARTBROWSER_MIME_TYPE"],
			["metadata.extension", "COM_SMARTBROWSER_EXTENSION"],
			[
				"metadata.size",
				"COM_SMARTBROWSER_SIZE",
				"size"
			],
			[
				"metadata.width",
				"COM_SMARTBROWSER_DIMENSIONS",
				"dimensions"
			]
		].map(([e, t, n]) => ({
			source: e,
			label: t,
			format: n
		})), E = v(() => {
			let e = (r.resource?.infoFields?.length ? r.resource.infoFields : r.fields || []).filter((e) => (!e.kinds || e.kinds.includes(r.resource?.kind)) && ![
				"metadata.locationPath",
				"metadata.category",
				"metadata.tags"
			].includes(e.source)), t = new Set(e.map((e) => e.source));
			return [...e, ...T.filter((e) => {
				let n = r.resource?.metadata?.[e.source.split(".")[1]];
				return !t.has(e.source) && n != null && n !== "";
			})];
		}), D = B, k = v(() => r.resource?.kind === "node" ? r.t("COM_SMARTBROWSER_FOLDER") : r.resource?.type ? r.resource.type.charAt(0).toUpperCase() + r.resource.type.slice(1) : r.t("COM_SMARTBROWSER_RESOURCE")), A = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, ee = (e) => `${(e / 1024).toFixed(2)} KB`, F = (e) => String(e.source || "").split(".").reduce((e, t) => e?.[t], r.resource), I = (e) => (e.format === "language" || e.source === "metadata.language") && F(e) === "*" ? r.t("COM_SMARTBROWSER_ALL_LANGUAGES") : e.format === "date" ? A(F(e)) : e.format === "size" ? F(e) !== null && F(e) !== void 0 ? ee(F(e)) : "" : e.format === "dimensions" ? r.resource?.metadata.width && r.resource?.metadata.height ? `${r.resource.metadata.width}px \u00d7 ${r.resource.metadata.height}px` : "" : F(e), L = (e) => {
			let t = String(e || "").trim().match(/(Z|[+-]\d{2}:?\d{2})$/i);
			if (!t) return "";
			let n = t[1].toUpperCase() === "Z" ? 0 : (t[1].startsWith("-") ? -1 : 1) * (Number(t[1].slice(1, 3)) * 60 + Number(t[1].slice(-2)));
			if (n === -new Date(e).getTimezoneOffset()) return "";
			let i = n >= 0 ? "+" : "-", a = Math.abs(n), o = n === 0 ? "UTC" : `UTC${i}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
			return `${r.t("COM_SMARTBROWSER_SOURCE_TIMEZONE")}: ${o}`;
		};
		return (t, r) => (w(), M("aside", { class: o(["resource-info-panel", {
			"has-usage": e.usageDefinitions?.length,
			"showing-usage": e.usageDefinitions?.length && u.value === "usage"
		}]) }, [e.resource ? (w(), M(S, { key: 0 }, [
			e.usageDefinitions?.length ? (w(), M("div", Zn, [j("button", {
				type: "button",
				role: "tab",
				"aria-selected": u.value === "usage",
				onClick: r[0] ||= (e) => m("usage")
			}, _(e.t("COM_SMARTBROWSER_USAGE_OPTIONS")), 9, Qn), j("button", {
				type: "button",
				role: "tab",
				"aria-selected": u.value === "info",
				onClick: r[1] ||= (e) => m("info")
			}, _(e.t("COM_SMARTBROWSER_USAGE_INFO")), 9, $n)])) : y("", !0),
			n(En, {
				ref_key: "previewElement",
				ref: b,
				resource: e.resource,
				definitions: e.usageDefinitions,
				values: e.usageValues,
				errors: e.usageErrors,
				"resolve-reference": e.resolveReference,
				"can-preview": e.canPreview,
				editable: u.value === "usage",
				t: e.t,
				onPreview: r[2] ||= (e) => t.$emit("preview"),
				onChange: r[3] ||= (e, n) => t.$emit("usage-change", e, n)
			}, {
				actions: s(() => [(w(!0), M(S, null, l(e.previewActions, (t) => (w(), M("button", {
					key: t.id,
					type: "button",
					disabled: h.value,
					title: e.t(t.label),
					"aria-label": e.t(t.label),
					onClick: (e) => C(t)
				}, [j("span", {
					class: o(t.icon || "fas fa-bolt"),
					"aria-hidden": "true"
				}, null, 2)], 8, er))), 128))]),
				_: 1
			}, 8, [
				"resource",
				"definitions",
				"values",
				"errors",
				"resolve-reference",
				"can-preview",
				"editable",
				"t"
			]),
			j("h3", null, _(e.resource.title), 1),
			e.usageDefinitions?.length && u.value === "usage" ? (w(), N(Xn, {
				key: g(P)(e.resource),
				definitions: i.value,
				values: e.usageValues,
				errors: e.usageErrors,
				resource: e.resource,
				t: e.t,
				editors: e.usageEditors,
				"resolve-reference": e.resolveReference,
				onChange: r[4] ||= (e, n) => t.$emit("usage-change", e, n)
			}, null, 8, [
				"definitions",
				"values",
				"errors",
				"resource",
				"t",
				"editors",
				"resolve-reference"
			])) : (w(), M(S, { key: 2 }, [e.fields?.length ? (w(), M("dl", tr, [(w(!0), M(S, null, l(E.value, (t) => c((w(), M("div", { key: `${t.source}-${t.label}` }, [
				j("dt", null, [j("span", {
					class: o(g(D)(t)),
					"aria-hidden": "true"
				}, null, 2), p(_(e.t(t.label)), 1)]),
				t.format === "language" ? (w(), M("dd", nr, [e.resource.metadata?.languageImage ? (w(), M("img", {
					key: 0,
					src: e.resource.metadata.languageImage,
					alt: "",
					"aria-hidden": "true"
				}, null, 8, rr)) : F(t) === "*" ? (w(), M("span", ir)) : y("", !0), j("span", null, _(I(t)), 1)])) : (w(), M("dd", {
					key: 1,
					class: o({
						"resource-info-identifier": t.source === "metadata.alias" || t.source === "metadata.username",
						"resource-info-lines": t.source === "metadata.tagPaths"
					})
				}, _(I(t)), 3)),
				t.format === "date" && L(F(t)) ? (w(), M("small", ar, _(L(F(t))), 1)) : y("", !0)
			])), [[O, I(t) !== "" && I(t) !== null && I(t) !== void 0]])), 128))])) : (w(), M("dl", or, [
				e.resource.parentId ? (w(), M("div", sr, [j("dt", null, [r[5] ||= j("span", {
					class: "fas fa-folder",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_FOLDER")), 1)]), j("dd", null, _(e.resource.parentId), 1)])) : y("", !0),
				j("div", null, [j("dt", null, [r[6] ||= j("span", {
					class: "fas fa-file-alt",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_TYPE")), 1)]), j("dd", null, _(k.value), 1)]),
				e.resource.metadata.created ? (w(), M("div", cr, [
					j("dt", null, [r[7] ||= j("span", {
						class: "fas fa-calendar",
						"aria-hidden": "true"
					}, null, -1), p(_(e.t("COM_SMARTBROWSER_DATE_CREATED")), 1)]),
					j("dd", null, _(A(e.resource.metadata.created)), 1),
					L(e.resource.metadata.created) ? (w(), M("small", lr, _(L(e.resource.metadata.created)), 1)) : y("", !0)
				])) : y("", !0),
				e.resource.metadata.modified ? (w(), M("div", ur, [
					j("dt", null, [r[8] ||= j("span", {
						class: "fas fa-calendar",
						"aria-hidden": "true"
					}, null, -1), p(_(e.t("COM_SMARTBROWSER_DATE_MODIFIED")), 1)]),
					j("dd", null, _(A(e.resource.metadata.modified)), 1),
					L(e.resource.metadata.modified) ? (w(), M("small", dr, _(L(e.resource.metadata.modified)), 1)) : y("", !0)
				])) : y("", !0),
				e.resource.metadata.width && e.resource.metadata.height ? (w(), M("div", fr, [j("dt", null, [r[9] ||= j("span", {
					class: "fas fa-expand",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_DIMENSIONS")), 1)]), j("dd", null, _(e.resource.metadata.width) + "px × " + _(e.resource.metadata.height) + "px", 1)])) : y("", !0),
				e.resource.metadata.size ? (w(), M("div", pr, [j("dt", null, [r[10] ||= j("span", {
					class: "fas fa-database",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_SIZE")), 1)]), j("dd", null, _(ee(e.resource.metadata.size)), 1)])) : y("", !0),
				e.resource.metadata.mimeType ? (w(), M("div", mr, [j("dt", null, [r[11] ||= j("span", {
					class: "fas fa-file-alt",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_MIME_TYPE")), 1)]), j("dd", null, _(e.resource.metadata.mimeType), 1)])) : y("", !0),
				e.resource.metadata.extension ? (w(), M("div", hr, [j("dt", null, [r[12] ||= j("span", {
					class: "fas fa-file-alt",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_EXTENSION")), 1)]), j("dd", null, _(e.resource.metadata.extension), 1)])) : y("", !0),
				j("div", null, [j("dt", null, [r[13] ||= j("span", {
					class: "fas fa-key",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("JGLOBAL_FIELD_ID_LABEL")), 1)]), j("dd", null, _(e.resource.metadata.id ?? e.resource.id), 1)])
			]))], 64))
		], 64)) : y("", !0)], 2));
	}
}, _r = {
	class: "resource-breadcrumb",
	"aria-label": "Breadcrumb"
}, vr = [
	"title",
	"aria-label",
	"onClick"
], yr = {
	key: 1,
	class: "resource-breadcrumb-title"
}, br = {
	__name: "ResourceBreadcrumb",
	props: {
		breadcrumb: Array,
		root: Object,
		rootIcon: String,
		iconOnlyRoot: Boolean
	},
	emits: ["open"],
	setup(e) {
		let t = e, n = v(() => {
			let e = t.breadcrumb || [], n = e[0] || t.root;
			return n ? [n, ...e.slice(1).filter((e) => e.visible !== !1)] : [];
		});
		return (t, r) => (w(), M("nav", _r, [(w(!0), M(S, null, l(n.value, (n, r) => (w(), M("button", {
			key: n.id,
			type: "button",
			class: o({ "root-crumb": r === 0 && e.iconOnlyRoot }),
			title: n.title,
			"aria-label": r === 0 && e.iconOnlyRoot ? n.title : void 0,
			onClick: (e) => t.$emit("open", n.id)
		}, [r === 0 ? (w(), M("span", {
			key: 0,
			class: o(e.rootIcon),
			"aria-hidden": "true"
		}, null, 2)) : y("", !0), r !== 0 || !e.iconOnlyRoot ? (w(), M("span", yr, _(n.title), 1)) : y("", !0)], 10, vr))), 128))]));
	}
}, xr = {
	class: "resource-toolbar",
	role: "toolbar"
}, Sr = { class: "resource-toolbar-primary" }, Cr = { class: "resource-view-controls" }, wr = [
	"disabled",
	"title",
	"aria-label"
], Tr = ["title"], Er = ["title"], Dr = ["disabled"], Or = ["disabled"], kr = ["title"], Ar = { "aria-hidden": "true" }, jr = [
	"title",
	"aria-label",
	"aria-expanded"
], Mr = {
	key: 0,
	class: "resource-column-menu"
}, Nr = { class: "resource-column-menu-title" }, Pr = [
	"checked",
	"disabled",
	"onChange"
], Fr = { class: "resource-mode-controls" }, Ir = ["title", "onClick"], Lr = ["title"], Rr = {
	key: 0,
	class: "resource-toolbar-expanded resource-search-row"
}, zr = {
	for: "smartbrowser-search",
	class: "visually-hidden"
}, Br = { class: "input-group resource-search-control" }, Vr = ["value", "placeholder"], Hr = ["title"], Ur = { class: "visually-hidden" }, Wr = {
	key: 1,
	class: "resource-toolbar-expanded resource-sort-row"
}, Gr = { class: "resource-sort-controls" }, Kr = { class: "visually-hidden" }, qr = ["value"], Jr = { value: "" }, Yr = ["value"], Xr = { class: "visually-hidden" }, Zr = ["value", "disabled"], Qr = { value: "asc" }, $r = { value: "desc" }, ei = {
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
		let r = e, i = v(() => r.views.find((e) => e.id === r.activeView) || {}), a = [
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
		], s = v(() => {
			let e = r.sortFields?.length ? [...r.sortFields] : [...a];
			r.orderingField && !e.some((e) => e.id === r.orderingField) && e.push({
				id: r.orderingField,
				label: "JGRID_HEADING_ORDERING"
			});
			let t = (r.columns || []).flatMap((e) => e.dateGroup ? (e.fields || []).map((e) => e.sortField || e.id) : [e.sortField || e.id]), n = (e) => e === r.orderingField ? -1 : t.indexOf(e);
			return e.sort((e, i) => {
				let a = n(e.id), o = n(i.id);
				return (a < 0 && e.id !== r.orderingField ? t.length : a) - (o < 0 && i.id !== r.orderingField ? t.length : o);
			});
		}), c = t(!1), u = t(!1), f = t(!1), p = t(null), m = (e) => {
			p.value?.contains(e.target) || (f.value = !1);
		};
		T(() => document.addEventListener("pointerdown", m)), d(() => document.removeEventListener("pointerdown", m));
		let h = v(() => ({
			created: "C",
			modified: "M",
			both: "M&C"
		})[r.detailsDateMode] || "M"), g = v(() => `${r.t("COM_SMARTBROWSER_DATE")}: ${h.value}`), b = (e) => i.value.controls?.includes(e);
		return (t, r) => (w(), M("div", xr, [
			j("div", Sr, [n(br, {
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
			]), j("div", Cr, [
				e.reorderVisible ? (w(), N(ae, {
					key: 0,
					enabled: e.reorderEnabled,
					t: e.t,
					onReorder: r[1] ||= (e) => t.$emit("reorder", e)
				}, null, 8, ["enabled", "t"])) : y("", !0),
				e.multiple ? (w(), M("button", {
					key: 1,
					type: "button",
					class: "resource-icon-button",
					disabled: !e.canInvert,
					title: e.t("COM_SMARTBROWSER_INVERT_SELECTION"),
					"aria-label": e.t("COM_SMARTBROWSER_INVERT_SELECTION"),
					onClick: r[2] ||= (e) => t.$emit("invert-selection")
				}, [...r[16] ||= [j("span", {
					class: "fas fa-retweet",
					"aria-hidden": "true"
				}, null, -1)]], 8, wr)) : y("", !0),
				j("button", {
					type: "button",
					class: o(["resource-icon-button", { active: u.value }]),
					title: e.t("COM_SMARTBROWSER_SEARCH"),
					onClick: r[3] ||= (e) => u.value = !u.value
				}, [...r[17] ||= [j("span", {
					class: "fas fa-search",
					"aria-hidden": "true"
				}, null, -1)]], 10, Tr),
				b("sort") ? (w(), M("button", {
					key: 2,
					type: "button",
					class: o(["resource-icon-button", { active: c.value }]),
					title: e.t("COM_SMARTBROWSER_SORT_BY"),
					onClick: r[4] ||= (e) => c.value = !c.value
				}, [...r[18] ||= [j("span", {
					class: "fas fa-sort-amount-down-alt",
					"aria-hidden": "true"
				}, null, -1)]], 10, Er)) : y("", !0),
				b("zoom") ? (w(), M("button", {
					key: 3,
					type: "button",
					class: "resource-icon-button",
					disabled: e.gridSize === "sm",
					title: "Decrease size",
					onClick: r[5] ||= (e) => t.$emit("resize", -1)
				}, [...r[19] ||= [j("span", {
					class: "fas fa-search-minus",
					"aria-hidden": "true"
				}, null, -1)]], 8, Dr)) : y("", !0),
				b("zoom") ? (w(), M("button", {
					key: 4,
					type: "button",
					class: "resource-icon-button",
					disabled: e.gridSize === "xl",
					title: "Increase size",
					onClick: r[6] ||= (e) => t.$emit("resize", 1)
				}, [...r[20] ||= [j("span", {
					class: "fas fa-search-plus",
					"aria-hidden": "true"
				}, null, -1)]], 8, Or)) : y("", !0),
				b("thumbnails") ? (w(), M("button", {
					key: 5,
					type: "button",
					class: o(["resource-icon-button", { active: e.detailsThumbnails }]),
					title: "Toggle thumbnails",
					onClick: r[7] ||= (e) => t.$emit("toggle-thumbnails")
				}, [...r[21] ||= [j("span", {
					class: "fas fa-images",
					"aria-hidden": "true"
				}, null, -1)]], 2)) : y("", !0),
				b("dateField") ? (w(), M("button", {
					key: 6,
					type: "button",
					class: "resource-icon-button resource-date-toggle",
					title: g.value,
					onClick: r[8] ||= (e) => t.$emit("toggle-date-field")
				}, [r[22] ||= j("span", {
					class: "fas fa-calendar",
					"aria-hidden": "true"
				}, null, -1), j("small", Ar, _(h.value), 1)], 8, kr)) : y("", !0),
				b("dateField") && e.columns?.length ? (w(), M("div", {
					key: 7,
					ref_key: "columnPicker",
					ref: p,
					class: "resource-column-picker"
				}, [j("button", {
					type: "button",
					class: "resource-icon-button",
					title: e.t("COM_SMARTBROWSER_COLUMNS"),
					"aria-label": e.t("COM_SMARTBROWSER_COLUMNS"),
					"aria-expanded": f.value,
					onClick: r[9] ||= (e) => f.value = !f.value
				}, [...r[23] ||= [j("span", {
					class: "fas fa-columns",
					"aria-hidden": "true"
				}, null, -1)]], 8, jr), f.value ? (w(), M("div", Mr, [j("div", Nr, _(e.t("COM_SMARTBROWSER_COLUMNS")), 1), (w(!0), M(S, null, l(e.columns, (n) => (w(), M("label", {
					key: n.id,
					class: "resource-column-choice"
				}, [j("input", {
					type: "checkbox",
					checked: n.defaultVisible ? !e.hiddenColumns?.includes(n.id) : e.shownColumns?.includes(n.id),
					disabled: n.id === "title" || n.id === "name",
					onChange: (e) => t.$emit("toggle-column", n.id)
				}, null, 40, Pr), j("span", null, _(e.t(n.label || (n.dateGroup ? "COM_SMARTBROWSER_DATE" : n.fields?.[0]?.label))), 1)]))), 128))])) : y("", !0)], 512)) : y("", !0),
				j("div", Fr, [(w(!0), M(S, null, l(e.views, (n) => (w(), M("button", {
					key: n.id,
					type: "button",
					class: o(["resource-icon-button", { active: e.activeView === n.id }]),
					title: e.t(n.label),
					onClick: (e) => t.$emit("view", n.id)
				}, [j("span", {
					class: o(n.icon),
					"aria-hidden": "true"
				}, null, 2)], 10, Ir))), 128))]),
				j("button", {
					type: "button",
					class: o(["resource-icon-button", { active: e.showInfo }]),
					title: e.t("COM_SMARTBROWSER_TOGGLE_INFO"),
					onClick: r[10] ||= (e) => t.$emit("info")
				}, [...r[24] ||= [j("span", {
					class: "fas fa-info",
					"aria-hidden": "true"
				}, null, -1)]], 10, Lr)
			])]),
			u.value ? (w(), M("div", Rr, [j("label", zr, _(e.t("COM_SMARTBROWSER_SEARCH")), 1), j("div", Br, [j("input", {
				id: "smartbrowser-search",
				value: e.search,
				type: "search",
				class: "form-control",
				placeholder: e.t("COM_SMARTBROWSER_SEARCH"),
				onInput: r[11] ||= (e) => t.$emit("search", e.target.value),
				onKeydown: r[12] ||= D(C((e) => t.$emit("search", e.target.value), ["prevent"]), ["enter"])
			}, null, 40, Vr), j("button", {
				type: "button",
				class: "btn btn-primary",
				title: e.t("COM_SMARTBROWSER_SEARCH"),
				onClick: r[13] ||= (n) => t.$emit("search", e.search)
			}, [r[25] ||= j("span", {
				class: "fas fa-search",
				"aria-hidden": "true"
			}, null, -1), j("span", Ur, _(e.t("COM_SMARTBROWSER_SEARCH")), 1)], 8, Hr)])])) : y("", !0),
			c.value && b("sort") ? (w(), M("div", Wr, [j("div", Gr, [j("label", null, [j("span", Kr, _(e.t("COM_SMARTBROWSER_SORT_BY")), 1), j("select", {
				value: e.sortBy,
				class: "form-select",
				onChange: r[14] ||= (e) => t.$emit("sort-by", e.target.value)
			}, [j("option", Jr, _(e.t("COM_SMARTBROWSER_DEFAULT_SORTING")), 1), (w(!0), M(S, null, l(s.value, (t) => (w(), M("option", {
				key: t.id,
				value: t.id
			}, _(e.t(t.label)), 9, Yr))), 128))], 40, qr)]), j("label", null, [j("span", Xr, _(e.t("COM_SMARTBROWSER_SORT_DIRECTION")), 1), j("select", {
				value: e.sortDirection || "asc",
				class: "form-select",
				disabled: !e.sortBy,
				onChange: r[15] ||= (e) => t.$emit("sort-direction-value", e.target.value)
			}, [j("option", Qr, _(e.t("COM_SMARTBROWSER_ASCENDING")), 1), j("option", $r, _(e.t("COM_SMARTBROWSER_DESCENDING")), 1)], 40, Zr)])])])) : y("", !0)
		]));
	}
}, ti = {
	__name: "ResourceNodeVisual",
	props: {
		resource: Object,
		open: Boolean
	},
	setup(e) {
		return (t, n) => (w(), N(k, {
			resource: e.resource,
			variant: "compact",
			"allow-image": !1,
			open: e.open,
			"align-base-start": ""
		}, null, 8, ["resource", "open"]));
	}
}, ni = ["aria-label"], ri = ["open", "onToggle"], ii = ["onClick"], ai = {
	key: 0,
	class: "resource-adapter-roots"
}, oi = ["onClick"], si = {
	key: 1,
	class: "resource-tree-branch"
}, ci = ["onClick"], li = ["onClick"], ui = {
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
		}, c = (e) => r.breadcrumb.some((t) => t.id === e.id), u = (e) => r.breadcrumb.filter((t) => t.id !== e.id), d = v(() => r.roots.some((e) => e.visible !== !1 || c(e) && (u(e).length > 0 || r.nodes.length > 0))), f = (e, t) => ({ paddingInlineStart: `${10 + (e.visible === !1 ? 0 : 18) + t * 18}px` });
		return (t, r) => (w(), M("nav", {
			class: "resource-sidebar",
			"aria-label": e.t("COM_SMARTBROWSER_VIEW")
		}, [(w(!0), M(S, null, l(e.adapters, (r) => (w(), M("details", {
			key: r.id,
			class: "resource-adapter",
			open: r.id === e.activeAdapter,
			onToggle: (e) => a(e, r.id)
		}, [j("summary", { onClick: C((e) => s(r.id), ["prevent"]) }, [j("span", {
			class: o(r.icon),
			"aria-hidden": "true"
		}, null, 2), p(" " + _(r.title), 1)], 8, ii), r.id !== e.activeAdapter || d.value ? (w(), M("div", ai, [(w(!0), M(S, null, l(r.id === e.activeAdapter ? e.roots : [], (i) => (w(), M("section", {
			key: i.id,
			class: o(["resource-tree-root", { "root-hidden": i.visible === !1 }])
		}, [i.visible === !1 ? y("", !0) : (w(), M("button", {
			key: 0,
			type: "button",
			class: o({ active: e.selectedNode === i.id }),
			onClick: (e) => t.$emit("open", i.id)
		}, [j("span", {
			class: o(["resource-tree-root-icon", r.icon]),
			"aria-hidden": "true"
		}, null, 2), j("span", null, _(i.title), 1)], 10, oi)), c(i) ? (w(), M("div", si, [(w(!0), M(S, null, l(u(i), (r) => (w(), M("button", {
			key: r.id,
			type: "button",
			class: o({ active: e.selectedNode === r.id }),
			style: h(f(i, u(i).indexOf(r))),
			onClick: (e) => t.$emit("open", r.id)
		}, [n(ti, {
			resource: r,
			open: !0
		}, null, 8, ["resource"]), j("span", null, _(r.title), 1)], 14, ci))), 128)), (w(!0), M(S, null, l(e.nodes, (e) => (w(), M(S, { key: e.id }, [e.navigable === !1 ? (w(), M("div", {
			key: 1,
			class: "resource-tree-entry resource-tree-static",
			style: h(f(i, u(i).length))
		}, [n(ti, { resource: e }, null, 8, ["resource"]), j("span", null, _(e.title), 1)], 4)) : (w(), M("button", {
			key: 0,
			type: "button",
			class: "resource-tree-entry",
			style: h(f(i, u(i).length)),
			onClick: (n) => t.$emit("open", e.id)
		}, [n(ti, { resource: e }, null, 8, ["resource"]), j("span", null, _(e.title), 1)], 12, li))], 64))), 128))])) : y("", !0)], 2))), 128))])) : y("", !0)], 40, ri))), 128))], 8, ni));
	}
}, di = /* @__PURE__ */ new Set([
	"articles",
	"categories",
	"tags",
	"articles-by-tag",
	"menus",
	"users",
	"media"
]), fi = (e, t, n) => {
	let r = e.startsWith("flat-") ? new URL(n).searchParams.get("flatFromBrowseRoot") || "" : t || "";
	return `supjx.smartbrowser.ui.${e.replace(/^flat-/, "")}.${r}`;
}, pi = (e, t, n, r) => {
	let i = new URL(e);
	if (!di.has(t)) return i.toString();
	i.searchParams.set("flatFromAdapter", t), i.searchParams.set("flatFromNode", n), r ? i.searchParams.set("flatFromBrowseRoot", r) : i.searchParams.delete("flatFromBrowseRoot");
	let a = `flat-${t}`;
	if (i.searchParams.set("adapter", a), i.searchParams.set("node", `${a}:root`), t === "articles" || t === "categories") {
		let e = n.startsWith("category:") ? n : r;
		e?.startsWith("category:") ? i.searchParams.set("browseRoot", e) : i.searchParams.delete("browseRoot"), i.searchParams.delete("flatScope");
	} else r ? i.searchParams.set("browseRoot", r) : i.searchParams.delete("browseRoot"), i.searchParams.set("flatScope", n);
	return i.toString();
}, mi = (e, t) => {
	let n = new URL(e), r = n.searchParams.get("flatFromAdapter"), i = di.has(r) ? r : "articles", a = n.searchParams.get("flatFromBrowseRoot") || (r ? null : t), o = n.searchParams.get("flatFromNode") || a || "content:root";
	n.searchParams.set("adapter", i), n.searchParams.set("node", o), a ? n.searchParams.set("browseRoot", a) : n.searchParams.delete("browseRoot");
	for (let e of [
		"flatFromAdapter",
		"flatFromNode",
		"flatFromBrowseRoot",
		"flatScope"
	]) n.searchParams.delete(e);
	return n.toString();
}, hi = (e, t) => {
	let n = new URL(e);
	if (!n.searchParams.get("adapter")?.startsWith("flat-") || !t) return n.toString();
	let r = n.searchParams.get("adapter");
	if (n.searchParams.set("node", `${r}:root`), n.searchParams.set("flatFromNode", t), r === "flat-articles" || r === "flat-categories") {
		let e = n.searchParams.get("flatFromBrowseRoot") || (n.searchParams.has("flatFromAdapter") ? null : n.searchParams.get("browseRoot"));
		e ? n.searchParams.set("browseRoot", e) : n.searchParams.delete("browseRoot"), n.searchParams.delete("flatScope");
	} else n.searchParams.set("flatScope", t);
	return n.toString();
}, gi = {
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
}, _i = (e) => ({
	stateLabel: "status",
	width: "dimension",
	link: "url"
})[e.split(".").pop()] || e.split(".").pop();
function vi(e, t) {
	let n = e?.columns || [], r = n.map((e) => ({
		...e,
		defaultVisible: !0
	})), i = new Set(n.map((e) => e.id)), a = t.replace(/^flat-/, "") === "articles-by-tag" ? "articles" : t.replace(/^flat-/, ""), o = [...e?.infoFields || [], ...(gi[a] || []).map(([e, t, n]) => ({
		id: _i(e),
		label: t,
		source: `metadata.${e}`,
		format: n
	}))], s = i.has("dates");
	for (let e of o) {
		if (!e.source || !e.label || e.source === "metadata.locationPath") continue;
		let t = e.id || _i(e.source);
		i.has(t) || s && ["created", "modified"].includes(t) || (i.add(t), r.push({
			id: t,
			label: e.label,
			source: e.source,
			format: e.format,
			defaultVisible: !1
		}));
	}
	return r;
}
//#endregion
//#region resources/js/components/SmartBrowserApp.vue
var yi = {
	key: 0,
	class: "smartbrowser-busy",
	role: "status",
	"aria-live": "polite"
}, bi = [
	"aria-pressed",
	"title",
	"aria-label"
], xi = [
	"aria-pressed",
	"title",
	"aria-label"
], Si = {
	key: 1,
	class: "resource-picker-collection"
}, Ci = [
	"title",
	"aria-label",
	"aria-expanded"
], wi = { class: "resource-main" }, Ti = {
	key: 0,
	class: "resource-loader"
}, Ei = {
	key: 1,
	class: "resource-empty"
}, Di = {
	key: 3,
	class: "resource-drop-overlay"
}, Oi = {
	__name: "SmartBrowserApp",
	setup(e) {
		let i = m("browser"), c = m("smartBrowserOptions"), l = c.application === "site" && window.self === window.top, u = t("normal"), b, x = v(() => ({
			normal: "COM_SMARTBROWSER_DISPLAY_WIDE",
			wide: "COM_SMARTBROWSER_DISPLAY_FOCUS",
			focus: "COM_SMARTBROWSER_DISPLAY_NORMAL"
		})[u.value]), S = () => {
			u.value = b.cycle();
		};
		T(() => {
			l && (b = q(document.getElementById("smartbrowser-app"), (e) => {
				u.value = e;
			}));
		}), d(() => b?.destroy());
		let E = m("actionDriver"), D = m("resourceApi"), O = m("viewRegistry"), { state: k, resources: A, bulkSelectableResources: ee, selection: L, focusedResource: z, load: B, focus: ae, toggle: oe, selectAll: H, invertSelection: U } = i, G = c.mode === "select" ? c.pickerContext : null, K = !!G?.collectionMode, J = (e) => Joomla.Text?._(e, e) || e, le = /* @__PURE__ */ new Map(), ue = (e) => {
			let t = e?.selection?.adapter || e?.adapter;
			if (!t || t === c.adapter.replace(/^flat-/, "")) return E;
			if (!le.has(t)) {
				let e = new R({
					...c,
					adapter: t,
					browseRoot: null,
					flatScope: null
				});
				le.set(t, {
					api: e,
					driver: new se(e, k, async () => {
						await X?.refresh();
						for (let e of X?.browser.state.items || []) k.selectedResources[P(e)] = ne(e);
						await B();
					}, J, c.editorMode, c.application)
				});
			}
			return le.get(t).driver;
		}, de = (e) => e?.collectionActions || k.actions, fe = (e, t) => de(t).find((t) => t.id === e.id) || e, pe = (e, t) => {
			if (!K || e.currentNode || !t.length) return E.available(e, t);
			if (e.single && t.length !== 1) return !1;
			let n = (t) => (!t.collectionActions || t.collectionActions.some((t) => t.id === e.id)) && ue(t).available(fe(e, t), [t]);
			return e.exclusiveGroup ? t.some(n) : t.every(n);
		}, Y = async (e, t) => {
			if (!pe(e, t)) return;
			if (!K || e.currentNode || !t.length) return E.execute(e, t);
			let n = /* @__PURE__ */ new Map();
			for (let e of t) {
				let t = ue(e);
				n.has(t) || n.set(t, []), n.get(t).push(e);
			}
			for (let [t, r] of n) await t.execute(fe(e, r[0]), r);
		};
		d(() => le.forEach(({ api: e, driver: t }) => {
			t.destroy(), e.destroy();
		}));
		let X, me = !1, he = {
			referenceItems: !0,
			homogeneous: G?.homogeneous === !0,
			readOnly: !1,
			showCount: !1,
			items: G?.getCollectionSnapshot?.().items || [],
			layout: "compact",
			allowRemove: !0,
			allowOrdering: c.multiple && G?.allowOrdering !== !1,
			contextActions: !1,
			resourceActions: [{
				id: "selectionFocus",
				label: "COM_SMARTBROWSER_USAGE_OPTIONS",
				icon: "fas fa-pen",
				requiresSelection: !0
			}],
			defaultResourceActionId: "selectionFocus",
			apiBaseUrl: c.apiBaseUrl,
			csrfToken: c.csrfToken,
			application: c.application,
			onResourceAction: (e, t) => {
				k.selectedResources[P(t)] = t, k.focusedId = P(t);
			}
		}, ge = /* @__PURE__ */ new Map();
		async function _e(e, t = {}) {
			let n = JSON.stringify([e.adapter, t.browseRoot || ""]);
			return ge.has(n) || ge.set(n, new R({
				...c,
				adapter: e.adapter,
				mode: "select",
				browseRoot: t.browseRoot || null,
				flatScope: null
			})), (await ge.get(n).collection([e.id])).resources[0];
		}
		let ve = _n({
			profile: G?.selectionProfile || {},
			initialUsage: G?.initialUsage || {},
			editors: G?.editors || {},
			resolveReference: _e
		}), ye = () => k.selectedIds.flatMap((e) => {
			let t = L.value.find((t) => P(t) === e);
			if (t) return [{
				selection: I(t, c.adapter.replace(/^flat-/, "")),
				usage: ve.get(t)
			}];
			let n = G?.getCollectionSnapshot?.().items.find((t) => F(t.selection) === e);
			return n ? [n] : [];
		}), be = () => {
			K && G.commitCollection({
				items: ye(),
				resources: Object.fromEntries(L.value.map((e) => [P(e), e]))
			});
		};
		a(() => [k.selectedIds, k.selectedResources], be, {
			deep: !0,
			flush: "sync"
		}), d(be);
		let xe = t(0);
		K && (X = W({
			config: he,
			api: D,
			translate: J,
			notify: (e) => {
				me = !0, k.selectedResources = Object.fromEntries(e.resources.map((e) => [P(e), ne(e)])), k.selectedIds = e.items.map((e) => F(e.selection)), me = !1;
			}
		}), X.refresh().catch((e) => Joomla.renderMessages({ error: [e.message] })), a(() => [k.selectedIds, xe.value], () => {
			me || X.setItems(ye()).catch((e) => Joomla.renderMessages({ error: [e.message] }));
		}, {
			deep: !0,
			flush: "sync"
		}), d(() => X.destroy()));
		let Se = t(G?.isMaximized?.() || !1), Ce = t(0), we = t({}), Te = t(!1), Ee = v(() => ve.definitions(z.value).filter((e) => e.presentation !== "hidden")), De = v(() => (xe.value, ve.get(z.value))), Oe = v(() => !!(G && Ee.value.length)), ke = !!(G && Object.keys(G.selectionProfile || {}).length), Ae = t(k.showInfo), Me = v(() => Oe.value || (ke ? Ae.value : k.showInfo)), Ne = () => {
			Oe.value || (ke ? Ae.value = !Ae.value : k.showInfo = !k.showInfo);
		}, Pe = (e, t, n) => {
			e && !Le && (ve.set(e, t, n), we.value = {
				...we.value,
				[P(e)]: {}
			}, xe.value++, be());
		}, Fe = (e, t) => Pe(z.value, e, t), Z = v(() => {
			let e = z.value;
			return {
				resource: e,
				profile: G?.selectionProfile || {},
				values: De.value,
				getValues: () => ve.get(e),
				setValue: (t, n) => Pe(e, t, n),
				refresh: () => B(),
				selectResource: (e) => window.SmartBrowserPicker.open(e)
			};
		}), Ie = v(() => (G?.previewActions || []).filter((e) => {
			try {
				return z.value && (!e.applies || e.applies(Z.value));
			} catch {
				return !1;
			}
		})), Le = !1;
		d(() => {
			Le = !0, ge.forEach((e) => e.destroy());
		});
		let Re = O.all(), ze = v(() => O.get(k.activeView)), Be = v(() => vi(k.presentation, c.adapter)), Ve = v(() => Be.value.filter((e) => e.id === "title" || e.id === "name" || (e.defaultVisible ? !k.hiddenColumns.includes(e.id) : k.shownColumns.includes(e.id)))), He = (e) => {
			let t = Be.value.find((t) => t.id === e);
			if (!t || ["title", "name"].includes(e)) return;
			let n = t.defaultVisible ? "hiddenColumns" : "shownColumns";
			k[n] = k[n].includes(e) ? k[n].filter((t) => t !== e) : [...k[n], e];
		}, Ue = t(!1), We = t(!1), Ge = t(null), Ke = v(() => c.adapter === "media"), qe = v(() => c.mode === "manage" && ["details", "grid"].includes(k.activeView) && k.presentation.orderingField && k.sortBy === k.presentation.orderingField && ["asc", "desc"].includes(k.sortDirection) && (c.adapter === "featured-articles" || String(k.filters.featured ?? "") !== "1")), Je = v(() => qe.value && !k.busy && L.value.length > 0 && L.value.every((e) => e.capabilities?.reorder === !0)), Ye = async (e) => {
			if (!Je.value || !["up", "down"].includes(e)) return;
			let t = L.value.map((e) => e.id), n = k.focusedId;
			k.busy = !0;
			try {
				let r = k.sortDirection === "desc" ? e === "up" ? "down" : "up" : e;
				(await D.execute("reorder", t, { direction: r })).updated?.length && (await B(), k.selectedIds = t.filter((e) => A.value.some((t) => t.id === e)), k.focusedId = k.selectedIds.includes(n) ? n : k.selectedIds[0] || null);
			} catch (e) {
				Joomla.renderMessages({ error: [e.message] });
			} finally {
				k.busy = !1;
			}
		}, Xe = c.adapter !== "featured-articles" && [
			"articles",
			"categories",
			"tags",
			"articles-by-tag",
			"menus",
			"users",
			"media"
		].includes(c.adapter.replace(/^flat-/, "")), Q = c.adapter.startsWith("flat-") || c.adapter === "featured-articles", Ze = Object.fromEntries(Object.entries(c.gridWidths || {}).map(([e, t]) => [`--sb-grid-${e}`, `${t}px`])), Qe = fi(c.adapter, c.browseRoot, window.location.href), $e = (() => {
			try {
				return JSON.parse(window.sessionStorage.getItem(Qe) || "{}");
			} catch {
				return {};
			}
		})(), et = t($e.filtersOpen === !0), tt = (e) => {
			$e = {
				...$e,
				filtersOpen: et.value,
				...e
			}, window.sessionStorage.setItem(Qe, JSON.stringify($e));
		}, nt = () => {
			et.value = !et.value, tt({ filtersOpen: et.value });
		}, rt = () => {
			tt({ flat: !Q }), window.location.assign(Q ? mi(window.location.href, c.browseRoot) : pi(window.location.href, c.adapter, k.selectedNode, c.browseRoot));
		}, it = v(() => c.adapters?.find((e) => e.id === c.adapter)?.icon || "fas fa-list"), at = v(() => c.adapters?.find((e) => e.id === c.adapter)?.nodeOpenIcon || {
			media: "fas fa-folder-open",
			articles: "fas fa-box-open",
			"flat-articles": "fas fa-box-open",
			categories: "fas fa-box-open",
			tags: "fas fa-tags",
			"articles-by-tag": "fas fa-tags",
			users: "fas fa-users-viewfinder",
			menus: "fas fa-diagram-successor",
			"featured-articles": "fas fa-star"
		}[c.adapter] || "fas fa-folder-open"), ot = [
			"sm",
			"md",
			"lg",
			"xl"
		], st = async ({ selection: e, payload: t, resolve: n, reject: r }) => {
			try {
				let r = await D.execute("batch", e, t);
				if (r.download) {
					let e = atob(r.download.content), t = Uint8Array.from(e, (e) => e.charCodeAt(0)), n = URL.createObjectURL(new Blob([t], { type: "application/zip" })), i = document.createElement("a");
					i.href = n, i.download = r.download.name, i.click(), setTimeout(() => URL.revokeObjectURL(n), 6e4);
				}
				await B(), n(r);
			} catch (e) {
				r(e);
			}
		}, ct = async (e) => {
			if (Te.value || !e.length) return;
			Te.value = !0;
			let t = xe.value, n;
			try {
				n = await ve.validate(e);
			} finally {
				Te.value = !1;
			}
			if (Le || t !== xe.value) return;
			if (we.value = n.errors, !n.valid) {
				Object.keys(n.profileErrors).length && Joomla.renderMessages({ error: [J("COM_SMARTBROWSER_USAGE_PROFILE_INVALID")] });
				let e = Object.keys(n.errors).find((e) => Object.keys(n.errors[e]).some((t) => !n.profileErrors[e]?.[t]));
				e && (k.focusedId = e, Ce.value++);
				return;
			}
			let r = {
				adapter: c.adapter.replace(/^flat-/, ""),
				mode: c.mode,
				resources: [...e]
			};
			K && (r.collectionItems = e.map((e) => ({
				selection: I(e, c.adapter.replace(/^flat-/, "")),
				usage: n.usage[P(e)] || {}
			}))), G && (r.pickerInstance = c.pickerInstance, r.usage = n.usage), document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r })), window.parent !== window && window.parent.document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r }));
		}, lt = (e) => {
			let t = ot.indexOf(k.viewOptions.gridSize);
			k.viewOptions.gridSize = ot[Math.max(0, Math.min(ot.length - 1, t + e))];
		}, ut = (e) => ie(e, c.mode, de(e), pe, c.selectionTarget || "both"), dt = (e) => te(e, c.mode, de(e), pe), ft = (e) => ce(e, c.mode, de(e), pe, c.selectionTarget || "both"), pt = (e, t) => !k.busy && (e.local ? t.every((t) => ut(t)?.id === e.id || ft(t)?.id === e.id) : pe(e, t)), mt = (e) => {
			let t = ut(e);
			t && ht(t, e);
		}, ht = (e, t) => {
			if (e && t && pt(e, [t])) return e.id === "browseOpen" ? B(t.id) : e.id === "pickerSelect" ? K ? (k.selectedIds.includes(P(t)) || oe(t, !0), ct(L.value)) : ct([t]) : Y(e, [t]);
		}, gt = (e) => {
			if (G?.allowedAdapters?.length && !G.allowedAdapters.includes(e.replace(/^flat-/, "")) || e === c.adapter) return;
			be();
			let t = new URL(window.location.href);
			t.searchParams.set("adapter", e), t.searchParams.delete("node"), t.searchParams.delete("browseRoot"), G?.initialBrowseRoot && e.replace(/^flat-/, "") === G.initialAdapter.replace(/^flat-/, "") && t.searchParams.set("browseRoot", G.initialBrowseRoot), t.searchParams.delete("initialResource"), t.searchParams.delete("flatScope"), window.location.href = t.toString();
		}, _t = async ({ id: e, value: t }) => {
			if (k.filters[e] = t, e === "menu" && t && !c.browseRoot && c.adapter === "menus") {
				await B(`menu:${t}`);
				return;
			}
			if (e === "menu" && t && !c.browseRoot && c.adapter === "flat-menus") {
				let e = new URL(window.location.href);
				e.searchParams.set("flatScope", `menu:${t}`), e.searchParams.set("flatFromNode", `menu:${t}`), window.location.assign(e.toString());
				return;
			}
			await B(k.selectedNode);
		}, vt = async () => {
			(k.presentation.filters || []).forEach((e) => {
				k.filters[e.id] = e.default ?? "";
			}), await B(k.selectedNode);
		}, yt = async (e) => {
			if (Q && e === k.selectedNode && e === k.roots[0]?.id) {
				k.search = "", k.sortBy = c.defaultSortBy || "", k.sortDirection = c.defaultSortDirection || "";
				let e = hi(window.location.href, c.flatRootNode);
				if (e !== window.location.href) {
					(k.presentation.filters || []).forEach((e) => {
						k.filters[e.id] = e.default ?? "";
					}), await r(), window.location.assign(e);
					return;
				}
				await vt();
				return;
			}
			await B(e);
		}, bt = (e) => {
			k.sortBy === e ? k.sortDirection === "asc" ? k.sortDirection = "desc" : (k.sortBy = "", k.sortDirection = "") : (k.sortBy = e, k.sortDirection = "asc");
		}, xt = (e) => {
			k.sortBy = e, k.sortDirection = e ? k.sortDirection || "asc" : "";
		}, St = () => {
			let e = [
				"modified",
				"created",
				"both"
			], t = e.indexOf(k.viewOptions.detailsDateMode);
			k.viewOptions.detailsDateMode = e[(t + 1) % e.length];
		}, Ct = async (e) => {
			Ue.value = !1, Ke.value && await E.uploadFiles(e.dataTransfer?.files);
		};
		return T(() => {
			if (Q && tt({ flat: !0 }), !Q && Xe && $e.flat === !0) {
				window.location.replace(pi(window.location.href, c.adapter, k.selectedNode, c.browseRoot));
				return;
			}
			B(k.selectedNode).then(async () => {
				if (K) {
					let e = G.getCollectionSnapshot();
					try {
						let t = await D.collection(e.items, {
							referenceItems: !0,
							homogeneous: G.homogeneous
						});
						if (Le) return;
						k.selectedResources = Object.fromEntries(t.resources.map((e) => [P(e), ne(e)])), k.selectedIds = t.items.map((e) => F(e.selection)), k.focusedId = k.selectedIds.find((e) => A.value.some((t) => P(t) === e)) || k.selectedIds[0] || null;
					} catch (e) {
						Le || Joomla.renderMessages({ error: [e.message] });
					}
				}
				if (!K && G?.initialSelection?.length && (!G.initialAdapter || G.initialAdapter.replace(/^flat-/, "") === c.adapter.replace(/^flat-/, ""))) {
					let e = G.initialSelection.map((e) => e && typeof e == "object" ? e.id : e);
					try {
						let t = await D.collection(c.multiple ? e : e.slice(0, 1));
						if (Le) return;
						let n = new Set(c.allowedResourceTypes || []), r = t.resources.filter((e) => !e.unavailable && V(e, c.selectionTarget) && (!n.size || n.has(e.type)));
						k.selectedIds = r.map((e) => e.id), k.selectedResources = Object.fromEntries(r.map((e) => [e.id, e])), k.focusedId = k.selectedIds[0] || null;
					} catch (e) {
						Le || Joomla.renderMessages({ error: [e.message] });
					}
				}
				c.adapter === "media" && c.initialResource && A.value.some((e) => e.id === c.initialResource) && (k.focusedId = P(A.value.find((e) => e.id === c.initialResource)));
			});
		}), (e, t) => (w(), M("div", {
			class: "smartbrowser-shell",
			style: h(g(Ze))
		}, [
			g(k).busy ? (w(), M("div", yi, [t[14] ||= j("span", {
				class: "spinner-border",
				"aria-hidden": "true"
			}, null, -1), j("span", null, _(J("COM_SMARTBROWSER_WORKING")), 1)])) : y("", !0),
			n(je, {
				actions: g(k).actions,
				available: (e) => pe(e, g(L)),
				selection: g(L),
				"batch-available": g(c).mode === "manage",
				"flat-available": g(Xe),
				"flat-active": g(Q),
				"filters-open": et.value,
				filters: g(k).presentation.filters,
				"filter-values": g(k).filters,
				"manager-url": g(c).managerUrl,
				"manager-new-tab": g(c).application === "site",
				"dashboard-url": g(c).dashboardUrl,
				integrated: g(c).integrated,
				"selection-mode": g(c).mode === "select",
				"allow-no-user": g(c).allowNoUser,
				"can-complete": g(L).length > 0 && !Te.value,
				t: J,
				onAction: t[1] ||= (e) => Y(e, g(L)),
				onBatch: t[2] ||= (e) => Ge.value?.open(),
				onToggleFlat: rt,
				onToggleFilters: nt,
				onFilter: _t,
				onClearFilters: vt,
				onComplete: t[3] ||= (e) => ct(g(L)),
				onNoUser: t[4] ||= (e) => ct([{
					id: "user:0",
					type: "user",
					title: ""
				}])
			}, {
				"display-controls": s(() => [g(G)?.toggleSize ? (w(), M("button", {
					key: 0,
					type: "button",
					class: o(["resource-icon-button resource-display-toggle", { active: Se.value }]),
					"aria-pressed": Se.value,
					title: J(Se.value ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE"),
					"aria-label": J(Se.value ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE"),
					onClick: t[0] ||= (e) => Se.value = g(G).toggleSize()
				}, [j("span", {
					class: o(Se.value ? "fas fa-compress" : "fas fa-expand"),
					"aria-hidden": "true"
				}, null, 2)], 10, bi)) : y("", !0), g(l) ? (w(), M("button", {
					key: 1,
					type: "button",
					class: o(["resource-icon-button resource-display-toggle", { active: u.value !== "normal" }]),
					"aria-pressed": u.value !== "normal",
					title: J(x.value),
					"aria-label": J(x.value),
					onClick: S
				}, [j("span", {
					class: o(u.value === "normal" ? "fas fa-arrows-alt-h" : u.value === "wide" ? "fas fa-expand" : "fas fa-compress"),
					"aria-hidden": "true"
				}, null, 2)], 10, xi)) : y("", !0)]),
				_: 1
			}, 8, [
				"actions",
				"available",
				"selection",
				"batch-available",
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
				"can-complete"
			]),
			g(K) ? (w(), M("details", Si, [j("summary", null, [
				t[15] ||= j("span", {
					class: "fas fa-chevron-right resource-picker-collection-chevron",
					"aria-hidden": "true"
				}, null, -1),
				p(_(J("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": ", 1),
				j("span", null, _(g(k).selectedIds.length), 1)
			]), g(X) ? (w(), N(re, {
				key: 0,
				model: g(X),
				api: g(D),
				config: he,
				t: J
			}, null, 8, ["model", "api"])) : y("", !0)])) : y("", !0),
			n(an, {
				ref_key: "batchDialog",
				ref: Ge,
				selection: g(L),
				adapter: g(c).adapter,
				filters: g(k).presentation.filters,
				"batch-options": g(k).presentation.batchOptions,
				t: J,
				onApply: st
			}, null, 8, [
				"selection",
				"adapter",
				"filters",
				"batch-options"
			]),
			j("div", { class: o(["smartbrowser-layout", {
				"flat-mode": g(Q) && !g(K),
				"tree-collapsed": We.value
			}]) }, [
				(!g(Q) || g(K)) && !We.value ? (w(), N(ui, {
					key: 0,
					adapters: g(G)?.allowedAdapters?.length ? (g(c).adapters || []).filter((e) => g(G).allowedAdapters.includes(e.id.replace(/^flat-/, ""))) : g(c).adapters,
					"active-adapter": g(c).adapter,
					roots: g(k).roots,
					nodes: g(Q) ? [] : g(k).nodes,
					breadcrumb: g(k).breadcrumb,
					"selected-node": g(k).selectedNode,
					t: J,
					onOpen: g(B),
					onAdapter: gt
				}, null, 8, [
					"adapters",
					"active-adapter",
					"roots",
					"nodes",
					"breadcrumb",
					"selected-node",
					"onOpen"
				])) : y("", !0),
				!g(Q) || g(K) ? (w(), M("button", {
					key: 1,
					type: "button",
					class: "resource-sidebar-handle",
					title: J(We.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-label": J(We.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-expanded": !We.value,
					onClick: t[5] ||= (e) => We.value = !We.value
				}, [j("span", {
					class: o(We.value ? "fas fa-chevron-right" : "fas fa-chevron-left"),
					"aria-hidden": "true"
				}, null, 2)], 8, Ci)) : y("", !0),
				j("main", wi, [n(ei, {
					breadcrumb: g(k).breadcrumb,
					root: g(k).roots[0],
					"root-icon": at.value,
					"icon-only-root": !g(Q) && g(k).breadcrumb.length > 1,
					search: g(k).search,
					"sort-by": g(k).sortBy,
					"sort-direction": g(k).sortDirection,
					"sort-fields": g(k).presentation.sortFields,
					"ordering-field": g(k).presentation.orderingField,
					views: g(Re),
					"active-view": g(k).activeView,
					"grid-size": g(k).viewOptions.gridSize,
					"details-thumbnails": g(k).viewOptions.detailsThumbnails,
					"details-date-mode": g(k).viewOptions.detailsDateMode,
					columns: Be.value,
					"hidden-columns": g(k).hiddenColumns,
					"shown-columns": g(k).shownColumns,
					"show-info": Me.value,
					multiple: g(c).multiple,
					"can-invert": g(c).multiple && g(ee).length > 0,
					"reorder-visible": qe.value,
					"reorder-enabled": Je.value,
					t: J,
					onOpen: yt,
					onInvertSelection: g(U),
					onReorder: Ye,
					onSearch: t[6] ||= (e) => g(k).search = e,
					onSortBy: xt,
					onSortDirectionValue: t[7] ||= (e) => g(k).sortDirection = e,
					onResize: lt,
					onToggleThumbnails: t[8] ||= (e) => g(k).viewOptions.detailsThumbnails = !g(k).viewOptions.detailsThumbnails,
					onToggleDateField: St,
					onToggleColumn: He,
					onView: t[9] ||= (e) => g(k).activeView = e,
					onInfo: Ne
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
				]), j("div", {
					class: o(["resource-browser", {
						loading: g(k).loading,
						"is-dragging": Ue.value,
						"info-open": Me.value,
						"usage-open": Oe.value
					}]),
					onDragenter: t[11] ||= C((e) => Ue.value = Ke.value, ["prevent"]),
					onDragover: t[12] ||= C(() => {}, ["prevent"]),
					onDragleave: t[13] ||= C((e) => Ue.value = !1, ["self"]),
					onDrop: C(Ct, ["prevent"])
				}, [
					g(k).loading ? (w(), M("div", Ti, [...t[16] ||= [j("span", {
						class: "spinner-border",
						"aria-hidden": "true"
					}, null, -1)]])) : g(A).length ? (w(), N(f(ze.value.component), {
						key: 2,
						resources: g(A),
						"selected-ids": g(k).selectedIds,
						"focused-id": g(k).focusedId,
						"all-selected": g(ee).length > 0 && g(ee).every((e) => g(k).selectedIds.includes(g(P)(e))),
						options: g(k).viewOptions,
						actions: g(k).actions,
						"action-available": pt,
						"default-action": ut,
						"preview-action": dt,
						"modified-action": ft,
						"sort-by": g(k).sortBy,
						"sort-direction": g(k).sortDirection,
						"sort-fields": g(k).presentation.sortFields,
						"ordering-field": g(k).presentation.orderingField,
						columns: Ve.value,
						"grid-fields": g(k).presentation.gridFields,
						t: J,
						onSelect: g(oe),
						onFocus: g(ae),
						onSelectAll: g(H),
						onOpen: g(B),
						onActivate: mt,
						onAction: ht,
						onSort: bt
					}, null, 40, [
						"resources",
						"selected-ids",
						"focused-id",
						"all-selected",
						"options",
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
					])) : (w(), M("div", Ei, [j("span", {
						class: o(g(k).search ? "fas fa-search" : Ke.value ? "fas fa-cloud-upload-alt" : it.value),
						"aria-hidden": "true"
					}, null, 2), j("p", null, _(g(k).search ? J("COM_SMARTBROWSER_NO_RESULTS") : Ke.value ? J("COM_SMARTBROWSER_DROP_UPLOAD") : J("COM_SMARTBROWSER_EMPTY_STATE")), 1)])),
					Ke.value && Ue.value ? (w(), M("div", Di, [t[17] ||= j("span", { class: "fas fa-cloud-upload-alt" }, null, -1), p(_(J("COM_SMARTBROWSER_DROP_UPLOAD")), 1)])) : y("", !0),
					Me.value ? (w(), N(gr, {
						key: 4,
						resource: g(z),
						fields: g(z)?.collectionPresentation?.infoFields || g(k).presentation.infoFields,
						t: J,
						"usage-definitions": Ee.value,
						"usage-values": De.value,
						"usage-errors": we.value[g(P)(g(z))] || {},
						"usage-editors": g(G)?.editors,
						"resolve-reference": _e,
						"usage-revision": Ce.value,
						"preview-actions": Ie.value,
						"preview-context": Z.value,
						"can-preview": !!dt(g(z)) && ue(g(z)).canPreview(g(z)) && !g(k).busy,
						onPreview: t[10] ||= (e) => ht(dt(g(z)), g(z)),
						onUsageChange: Fe
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
					])) : y("", !0)
				], 34)])
			], 2)
		], 4));
	}
}, ki = class {
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
}, Ai = "supjx.smartbrowser.preferencesResetToken";
function ji(e, t) {
	if (!t || e.getItem(Ai) === t) return !1;
	let n = [];
	for (let t = 0; t < e.length; t++) {
		let r = e.key(t);
		r?.startsWith("supjx.smartbrowser.") && r !== Ai && r !== "supjx.smartbrowser.editorReturn" && n.push(r);
	}
	return n.forEach((t) => e.removeItem(t)), e.setItem(Ai, t), !0;
}
//#endregion
//#region resources/js/core/resetSessionNavigation.js
var Mi = "supjx.smartbrowser.";
function Ni(e, t, n) {
	if (!n) return !1;
	let r = `${Mi}session.${t}`, i = e.getItem(r);
	if (e.setItem(r, n), !i || i === n) return !1;
	for (let t = 0; t < e.length; t++) {
		let n = e.key(t);
		if (!(!n?.startsWith(Mi) || n.startsWith(`${Mi}ui.`) || n.startsWith(`${Mi}session.`))) try {
			let t = JSON.parse(e.getItem(n));
			if (!t || typeof t != "object" || Array.isArray(t) || !("selectedNode" in t) && !("filters" in t)) continue;
			delete t.selectedNode, delete t.filters, e.setItem(n, JSON.stringify(t));
		} catch {}
	}
	return !0;
}
function Pi(e) {
	let t = new URL(e);
	if (t.searchParams.delete("node"), t.searchParams.has("flatFromAdapter")) {
		let e = t.searchParams.get("flatFromBrowseRoot");
		e ? t.searchParams.set("browseRoot", e) : t.searchParams.delete("browseRoot"), t.searchParams.delete("flatScope"), t.searchParams.delete("flatFromNode"), t.searchParams.delete("flatFromBrowseRoot"), t.searchParams.delete("flatFromAdapter");
	}
	return t.toString();
}
//#endregion
//#region resources/js/main.js
var $ = Joomla.getOptions("com_smartbrowser", {}), Fi = null;
try {
	Fi = window.parent !== window && $.pickerInstance ? window.parent.SmartBrowserPicker?.context($.pickerInstance, window) : null;
} catch {}
$.pickerContext = Fi, ji(window.sessionStorage, $.preferencesResetToken);
var Ii = Ni(window.sessionStorage, $.application, $.csrfToken) ? Pi(window.location.href) : window.location.href;
if (Ii !== window.location.href) window.location.replace(Ii);
else {
	let e = new R($), t = $.browseRoot ? `supjx.smartbrowser.${$.adapter}.${$.browseRoot}` : `supjx.smartbrowser.${$.adapter}`, n = new ki(window.sessionStorage, t), r = oe().register({
		id: "grid",
		label: "COM_SMARTBROWSER_GRID",
		icon: "fas fa-th",
		component: z,
		supportsSize: !0,
		controls: ["sort", "zoom"],
		options: { gridSize: "md" }
	}).register({
		id: "details",
		label: "COM_SMARTBROWSER_DETAILS",
		icon: "fas fa-list",
		component: U,
		supportsSize: !1,
		controls: ["thumbnails", "dateField"],
		options: {
			detailsThumbnails: !1,
			detailsDateMode: "modified"
		}
	}), i = H({
		options: $,
		api: e,
		persistence: n,
		viewRegistry: r
	}), a = new se(e, i.state, () => i.load(), (e) => Joomla.Text?._(e, e) || e, $.editorMode, $.application);
	window.SmartBrowser = {
		...window.SmartBrowser,
		open(e = {}) {
			let t = e.showContextResources ?? $.showContextResources ?? !1, n = e.browseRoot ? `&browseRoot=${encodeURIComponent(e.browseRoot)}` : "", r = e.defaultView ? `&defaultView=${encodeURIComponent(e.defaultView)}` : "", i = e.allowedResourceTypes?.length ? `&allowedResourceTypes=${encodeURIComponent(e.allowedResourceTypes.join(","))}` : "", a = e.showAdapterSwitcher ? "&showAdapterSwitcher=1" : "";
			window.location.href = `${$.returnUrl}&adapter=${encodeURIComponent(e.adapter || $.adapter)}&mode=${encodeURIComponent(e.mode || "select")}&multiple=${+!!e.multiple}&selectionTarget=${encodeURIComponent(e.selectionTarget || "item")}&showContextResources=${+!!t}${n}${r}${i}${a}`;
		},
		registerView: (e) => r.register(e)
	}, E(Oi).provide("browser", i).provide("resourceApi", e).provide("smartBrowserOptions", $).provide("viewRegistry", r).provide("actionDriver", a).mount("#smartbrowser-app");
}
//#endregion
