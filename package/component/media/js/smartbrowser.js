import { A as e, B as t, C as n, D as r, E as i, F as a, H as o, I as s, L as c, M as l, N as u, O as d, P as f, S as p, T as m, U as h, V as g, W as _, _ as v, b as y, d as b, f as x, g as S, h as C, j as w, k as T, l as E, m as D, p as O, t as k, u as A, v as j, x as M, y as ee, z as te } from "./visual-runtime-DVMDRhTu.js";
import { a as N, i as P, o as F, r as I } from "./visual-runtime-BjkbZE8K.js";
import { a as L, c as R, d as ne, f as re, h as z, i as B, l as ie, m as ae, n as oe, o as se, p as V, r as H, s as U, t as W, u as G } from "./visual-runtime-Dv7lQ9di.js";
//#region resources/js/core/displayMode.js
var K = [
	"normal",
	"wide",
	"focus"
], q = "smartbrowser.displayMode";
function ce(e, t = () => {}) {
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
		if (!K.includes(r)) return;
		let u = n;
		if (c(), n = r, t(n), l) try {
			o?.setItem(q, n);
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
		let e = o?.getItem(q);
		K.includes(e) && e !== "normal" && l(e, !1);
	} catch {}
	return {
		get mode() {
			return n;
		},
		set: l,
		cycle: () => l(K[(K.indexOf(n) + 1) % 3]),
		destroy() {
			l("normal", !1), a.removeEventListener("keydown", u);
		}
	};
}
//#endregion
//#region resources/js/components/ResourceActions.vue
var J = { class: "resource-actions-area" }, Y = [
	"href",
	"title",
	"aria-label"
], le = { class: "resource-action-label" }, ue = [
	"disabled",
	"title",
	"aria-label"
], de = { class: "resource-action-label" }, fe = ["title", "aria-label"], pe = { class: "resource-action-label" }, me = [
	"title",
	"aria-label",
	"disabled",
	"onClick"
], X = {
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
}, Z = ["disabled", "onClick"], ve = [
	"disabled",
	"title",
	"aria-label"
], ye = { class: "resource-action-label" }, be = ["title", "aria-label"], xe = { class: "resource-action-label" }, Se = {
	key: 6,
	class: "resource-filter-buttons"
}, Ce = [
	"aria-expanded",
	"title",
	"aria-label"
], we = { class: "resource-action-label" }, Te = {
	key: 0,
	class: "badge bg-primary"
}, Ee = ["disabled", "title"], De = [
	"title",
	"aria-label",
	"aria-pressed"
], Oe = [
	"href",
	"target",
	"rel",
	"title",
	"aria-label"
], ke = {
	key: 0,
	class: "resource-action-filters"
}, Ae = ["value", "onChange"], je = ["value"], Me = {
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
				t[8] ||= j("span", {
					class: "fas fa-arrow-left",
					"aria-hidden": "true"
				}, null, -1),
				t[9] ||= p(),
				j("span", le, _(n.t(n.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD")), 1)
			], 8, Y)) : y("", !0),
			n.selectionMode ? (w(), M("button", {
				key: 1,
				type: "button",
				class: "btn btn-primary",
				disabled: !n.canComplete,
				title: n.t("COM_SMARTBROWSER_SELECT"),
				"aria-label": n.t("COM_SMARTBROWSER_SELECT"),
				onClick: t[0] ||= (t) => e.$emit("complete")
			}, [
				t[10] ||= j("span", {
					class: "fas fa-check",
					"aria-hidden": "true"
				}, null, -1),
				t[11] ||= p(),
				j("span", de, _(n.t("COM_SMARTBROWSER_SELECT")), 1)
			], 8, ue)) : y("", !0),
			n.allowNoUser ? (w(), M("button", {
				key: 2,
				type: "button",
				class: "btn btn-outline-secondary",
				title: n.t("JOPTION_NO_USER"),
				"aria-label": n.t("JOPTION_NO_USER"),
				onClick: t[1] ||= (t) => e.$emit("no-user")
			}, [
				t[12] ||= j("span", {
					class: "fas fa-user",
					"aria-hidden": "true"
				}, null, -1),
				t[13] ||= p(),
				j("span", pe, _(n.t("JOPTION_NO_USER")), 1)
			], 8, fe)) : y("", !0),
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
			}, null, 2), t.creationRole === "contextual" ? y("", !0) : (w(), M("span", X, _(n.t(t.label)), 1))], 10, me))), 128)),
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
				t[14] ||= j("span", {
					class: "fas fa-ellipsis-h",
					"aria-hidden": "true"
				}, null, -1),
				t[15] ||= p(),
				j("span", ge, _(n.t("COM_SMARTBROWSER_ACTIONS")), 1),
				t[16] ||= p(),
				t[17] ||= j("span", {
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
			}, null, 2), p(" " + _(n.t(t.label)), 1)], 10, Z)]))), 128))])) : y("", !0)], 512)) : y("", !0),
			n.batchAvailable ? (w(), M("button", {
				key: 4,
				type: "button",
				class: "btn btn-outline-secondary resource-batch-toggle",
				disabled: !n.selection?.length,
				title: n.t("COM_SMARTBROWSER_BATCH_ACTIONS"),
				"aria-label": n.t("COM_SMARTBROWSER_BATCH_ACTIONS"),
				onClick: t[3] ||= (t) => e.$emit("batch")
			}, [
				t[18] ||= j("span", {
					class: "fas fa-magic",
					"aria-hidden": "true"
				}, null, -1),
				t[19] ||= p(),
				j("span", ye, _(n.t("COM_SMARTBROWSER_BATCH")), 1)
			], 8, ve)) : y("", !0),
			n.canCancel ? (w(), M("button", {
				key: 5,
				type: "button",
				class: "btn btn-outline-secondary resource-picker-cancel",
				title: n.t("JCANCEL"),
				"aria-label": n.t("JCANCEL"),
				onClick: t[4] ||= (t) => e.$emit("cancel")
			}, [
				t[20] ||= j("span", {
					class: "fas fa-times",
					"aria-hidden": "true"
				}, null, -1),
				t[21] ||= p(),
				j("span", xe, _(n.t("JCANCEL")), 1)
			], 8, be)) : y("", !0),
			n.filters?.length ? (w(), M("div", Se, [j("button", {
				type: "button",
				class: o(["btn resource-filter-toggle", { active: n.filtersOpen }]),
				"aria-expanded": n.filtersOpen,
				title: n.t("COM_SMARTBROWSER_FILTER_OPTIONS"),
				"aria-label": n.t("COM_SMARTBROWSER_FILTER_OPTIONS"),
				onClick: t[5] ||= (t) => e.$emit("toggle-filters")
			}, [
				t[22] ||= j("span", {
					class: "fas fa-filter",
					"aria-hidden": "true"
				}, null, -1),
				t[23] ||= p(),
				j("span", we, _(n.t("COM_SMARTBROWSER_FILTER_OPTIONS")), 1),
				b.value ? (w(), M("span", Te, _(b.value), 1)) : y("", !0),
				j("span", {
					class: o(["fas fa-angle-down resource-filter-caret", { open: n.filtersOpen }]),
					"aria-hidden": "true"
				}, null, 2)
			], 10, Ce), j("button", {
				type: "button",
				class: "btn resource-filter-clear",
				disabled: !b.value,
				title: n.t("JCLEAR"),
				onClick: t[6] ||= (t) => e.$emit("clear-filters")
			}, _(n.t("JCLEAR")), 9, Ee)])) : y("", !0),
			n.flatAvailable ? (w(), M("button", {
				key: 7,
				type: "button",
				class: o(["btn resource-flat-toggle", { active: n.flatActive }]),
				title: n.t("COM_SMARTBROWSER_FLAT_VIEW"),
				"aria-label": n.t("COM_SMARTBROWSER_FLAT_VIEW"),
				"aria-pressed": n.flatActive,
				onClick: t[7] ||= (t) => e.$emit("toggle-flat")
			}, [...t[24] ||= [j("span", {
				class: "fas fa-layer-group",
				"aria-hidden": "true"
			}, null, -1)]], 10, De)) : y("", !0),
			n.managerUrl ? (w(), M("a", {
				key: 8,
				class: "btn resource-manager-link",
				href: n.managerUrl,
				target: n.managerNewTab ? "_blank" : void 0,
				rel: n.managerNewTab ? "noopener noreferrer" : void 0,
				title: n.t("COM_SMARTBROWSER_OPEN_JOOMLA_MANAGER"),
				"aria-label": n.t("COM_SMARTBROWSER_OPEN_JOOMLA_MANAGER")
			}, [...t[25] ||= [j("span", {
				class: "fab fa-joomla",
				"aria-hidden": "true"
			}, null, -1)]], 8, Oe)) : y("", !0),
			u(e.$slots, "display-controls")
		], 512), n.filters?.length && n.filtersOpen ? (w(), M("div", ke, [(w(!0), M(S, null, l(n.filters, (t) => (w(), M("label", { key: t.id }, [j("span", null, _(n.t(t.label)), 1), t.type === "select" ? (w(), M("select", {
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
		}, _(x(t, e)), 9, je))), 128))], 40, Ae)) : y("", !0)]))), 128))])) : y("", !0)]));
	}
}, Ne = ["placeholder"], Pe = ["multiple"], Fe = ["selected"], Ie = ["value", "selected"], Le = {
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
		}, _(e.t(e.placeholder)), 9, Fe)), (w(!0), M(S, null, l(u.value, (t) => (w(), M("option", {
			key: t.value,
			value: String(t.value),
			selected: p(t.value)
		}, _(e.t(t.label)), 9, Ie))), 128))], 40, Pe)], 10, Ne));
	}
}, Re = { class: "resource-batch-field" }, ze = ["aria-label"], Be = ["aria-pressed", "onClick"], Ve = {
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
		return (n, r) => (w(), M("div", Re, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), j("div", {
			class: "btn-group resource-batch-mode-toggle",
			role: "group",
			"aria-label": e.t("COM_SMARTBROWSER_BATCH_MODE")
		}, [(w(), M(S, null, l(t, (t) => j("button", {
			key: t.value,
			type: "button",
			class: o(["btn", e.modelValue === t.value ? "is-active" : ""]),
			"aria-pressed": e.modelValue === t.value,
			onClick: (e) => n.$emit("update:modelValue", t.value)
		}, _(e.t(t.label)), 11, Be)), 64))], 8, ze)]));
	}
}, He = ["aria-label"], Ue = { class: "resource-batch-body" }, We = {
	class: "resource-batch-heading",
	role: "heading",
	"aria-level": "3"
}, Ge = ["open"], Ke = { class: "resource-batch-fields" }, qe = ["aria-label"], Je = ["value"], Ye = ["aria-label"], Xe = { value: "asc" }, Ze = { value: "desc" }, Q = ["open"], Qe = { class: "resource-batch-fields" }, $e = ["aria-label"], et = {
	key: 1,
	class: "text-danger"
}, tt = ["open"], nt = { class: "resource-batch-fields" }, rt = ["disabled"], it = { class: "resource-batch-check" }, at = { key: 0 }, ot = ["open"], st = { class: "resource-batch-fields" }, ct = { class: "input-group" }, lt = ["open"], ut = { class: "resource-batch-fields" }, dt = { class: "resource-batch-check" }, ft = ["disabled"], pt = ["open"], mt = ["onClick"], ht = { class: "resource-batch-fields" }, gt = ["onUpdate:modelValue", "aria-label"], _t = { value: "" }, vt = ["value"], yt = ["open"], bt = {
	key: 0,
	class: "resource-batch-fields"
}, xt = { class: "resource-batch-field" }, St = { class: "resource-batch-field" }, Ct = ["open"], wt = {
	key: 0,
	class: "resource-batch-fields"
}, Tt = ["open"], Et = ["onClick"], Dt = {
	key: 0,
	class: "resource-batch-fields"
}, Ot = ["onUpdate:modelValue", "aria-label"], kt = { value: "" }, At = ["value"], jt = ["open"], Mt = {
	key: 0,
	class: "resource-batch-fields"
}, Nt = { class: "resource-batch-field" }, Pt = { class: "resource-batch-field" }, Ft = ["open"], It = {
	key: 0,
	class: "resource-batch-fields"
}, Lt = ["open"], Rt = ["open"], zt = {
	key: 0,
	class: "resource-batch-fields"
}, Bt = ["open"], Vt = {
	key: 0,
	class: "resource-batch-fields"
}, Ht = { value: "add" }, Ut = { value: "remove" }, Wt = { value: "set" }, Gt = ["open"], Kt = {
	key: 0,
	class: "resource-batch-fields"
}, qt = { value: "yes" }, Jt = { value: "no" }, Yt = { class: "resource-batch-bottom" }, Xt = { class: "resource-batch-preview" }, Zt = {
	class: "resource-batch-preview-heading",
	role: "heading",
	"aria-level": "3"
}, Qt = {
	key: 0,
	class: "resource-batch-summary"
}, $t = {
	key: 0,
	class: "fas fa-arrow-right resource-batch-sequence-arrow",
	"aria-hidden": "true"
}, en = { class: "resource-batch-summary-step" }, tn = {
	class: "resource-batch-summary-step-heading",
	role: "heading",
	"aria-level": "4"
}, nn = {
	key: 0,
	class: "resource-batch-summary-params"
}, rn = {
	key: 1,
	class: "resource-batch-no-changes"
}, an = { class: "resource-batch-footer" }, on = { class: "resource-batch-footer-actions" }, sn = ["disabled"], cn = ["aria-label"], ln = { class: "resource-batch-preview-dialog-head" }, un = ["aria-label"], dn = { class: "resource-batch-preview-list" }, fn = ["title"], pn = ["title"], mn = ["aria-label"], hn = { class: "resource-batch-preview-dialog-head" }, gn = ["aria-label"], _n = { class: "resource-batch-selected-list" }, vn = {
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
		sortFields: {
			type: Array,
			default: () => []
		},
		orderingAvailable: Boolean,
		t: {
			type: Function,
			required: !0
		}
	},
	emits: ["apply"],
	setup(e, { expose: r, emit: i }) {
		let a = e, s = i, u = m("resourceApi"), d = t(!1), f = t([]), h = t(!1), E = t(""), D = 0, O = t(null), k = t(null), N = t(null), P = v(() => a.adapter.replace(/^flat-/, "")), F = v(() => P.value === "media"), I = v(() => ["articles", "articles-by-tag"].includes(P.value)), L = v(() => P.value === "categories"), R = v(() => P.value === "tags"), ne = v(() => P.value === "menus"), re = v(() => P.value === "users"), z = v(() => ({
			articles: "article:",
			"articles-by-tag": "article:",
			categories: "category:",
			tags: "tag:",
			menus: "menu-item:",
			users: "user:"
		})[P.value]), B = v(() => z.value ? a.selection.filter((e) => e.id.startsWith(z.value)) : a.selection), ie = {
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
			zipName: "selection",
			extract: !1,
			deleteArchive: !1
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
		}, V = te({ ...ie }), H = te({ ...ae }), U = te({ ...oe }), W = te({ ...se }), G = te({
			enabled: !1,
			field: "title",
			direction: "asc"
		}), K = v(() => B.value.length === 1 && B.value[0].capabilities?.extract === !0), q = [{
			id: "language",
			enabled: "changeLanguage",
			label: "COM_SMARTBROWSER_BATCH_SET_LANGUAGE",
			placeholder: "COM_SMARTBROWSER_SELECT_LANGUAGE"
		}, {
			id: "access",
			enabled: "changeAccess",
			label: "COM_SMARTBROWSER_BATCH_SET_ACCESS",
			placeholder: "COM_SMARTBROWSER_SELECT_ACCESS"
		}], ce = q, J = v(() => G.enabled || JSON.stringify(V) !== JSON.stringify(ie) || JSON.stringify(H) !== JSON.stringify(ae) || JSON.stringify(U) !== JSON.stringify(oe) || JSON.stringify(W) !== JSON.stringify(se)), Y = (e) => (a.batchOptions[e] || a.filters.find((t) => t.id === e)?.options || []).filter((e) => String(e.value) !== ""), le = v(() => (a.batchOptions.menu || []).flatMap((e) => [{
			value: `${e.value}.0`,
			label: e.label
		}, ...(a.batchOptions.menuParent || []).filter((t) => t.menu === e.value).map((t) => ({
			value: `${e.value}.${t.value}`,
			label: `- ${t.label}`
		}))])), ue = v(() => V.zipName.trim().replace(/\.zip$/i, "")), de = (e) => {
			H.tagAdd = e, H.tagRemove = H.tagRemove.filter((t) => !e.includes(t));
		}, fe = (e) => {
			H.tagRemove = e, H.tagAdd = H.tagAdd.filter((t) => !e.includes(t));
		}, pe = (e) => {
			U.tagAdd = e, U.tagRemove = U.tagRemove.filter((t) => !e.includes(t));
		}, me = (e) => {
			U.tagRemove = e, U.tagAdd = U.tagAdd.filter((t) => !e.includes(t));
		}, X = (e, t) => a.t(Y(e).find((e) => String(e.value) === String(t))?.label || t), he = v(() => {
			let e = [];
			if (G.enabled && a.orderingAvailable && e.push({
				id: "sort",
				title: a.t("COM_SMARTBROWSER_BATCH_SORT"),
				parameters: [a.t(a.sortFields.find((e) => e.id === G.field)?.label || G.field), a.t(G.direction === "asc" ? "COM_SMARTBROWSER_ASCENDING" : "COM_SMARTBROWSER_DESCENDING")]
			}), F.value) V.placement !== "none" && e.push({
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
				parameters: [`${ue.value}.zip`]
			}), V.extract && K.value && e.push({
				id: "extract",
				title: a.t("COM_SMARTBROWSER_BATCH_EXTRACT"),
				parameters: V.deleteArchive ? [a.t("COM_SMARTBROWSER_BATCH_EXTRACT_DELETE")] : []
			});
			else if (I.value) {
				for (let t of q) H[t.enabled] && H[t.id] && e.push({
					id: t.id,
					title: a.t(t.label),
					parameters: [X(t.id, H[t.id])]
				});
				H.tagsOpen && H.tagAdd.length && e.push({
					id: "tag-add",
					title: a.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: H.tagAdd.map((e) => X("tag", e))
				}), H.tagsOpen && H.tagRemove.length && e.push({
					id: "tag-remove",
					title: a.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: H.tagRemove.map((e) => X("tag", e))
				}), H.placement !== "none" && e.unshift({
					id: "placement",
					title: a.t(H.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [H.category ? X("category", H.category) : "..."]
				});
			} else if (L.value || R.value || ne.value) {
				for (let t of ce) U[t.enabled] && U[t.id] && e.push({
					id: t.id,
					title: a.t(t.label),
					parameters: [X(t.id, U[t.id])]
				});
				L.value && (U.tagsOpen && U.tagAdd.length && e.push({
					id: "tag-add",
					title: a.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: U.tagAdd.map((e) => X("tag", e))
				}), U.tagsOpen && U.tagRemove.length && e.push({
					id: "tag-remove",
					title: a.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: U.tagRemove.map((e) => X("tag", e))
				}), U.placement !== "none" && e.unshift({
					id: "placement",
					title: a.t(U.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [U.category ? X("category", U.category) : "..."]
				}), U.flipOrdering && e.push({
					id: "flip",
					title: a.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING"),
					parameters: []
				})), ne.value && U.placement !== "none" && e.unshift({
					id: "placement",
					title: a.t(U.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [le.value.find((e) => e.value === U.menuDestination)?.label || "..."]
				});
			} else re.value && (W.groupOpen && W.group && e.push({
				id: "group",
				title: a.t({
					add: "COM_SMARTBROWSER_BATCH_GROUP_ADD",
					remove: "COM_SMARTBROWSER_BATCH_GROUP_REMOVE",
					set: "COM_SMARTBROWSER_BATCH_GROUP_SET"
				}[W.groupAction]),
				parameters: [X("group", W.group)]
			}), W.resetOpen && e.push({
				id: "reset",
				title: a.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET"),
				parameters: [a.t(W.reset === "yes" ? "JYES" : "JNO")]
			}));
			return e;
		}), ge = v(() => !(!B.value.length || !he.value.length || V.extract && (!K.value || V.rename || V.zip || V.placement !== "none") || F.value && V.placement !== "none" && !f.value.some((e) => e.value === V.destination) || I.value && H.placement !== "none" && !H.category || L.value && U.placement !== "none" && !U.category || ne.value && U.placement !== "none" && !le.value.some((e) => e.value === U.menuDestination) || F.value && V.zip && !ue.value)), _e = () => {
			if (F.value) return {
				...V,
				zipName: ue.value
			};
			if (I.value) return {
				language: H.changeLanguage ? H.language : "",
				access: H.changeAccess ? H.access : "",
				tagAdd: H.tagsOpen ? H.tagAdd : [],
				tagRemove: H.tagsOpen ? H.tagRemove : [],
				placement: H.placement,
				category: H.category
			};
			if (re.value) return {
				group: W.groupOpen ? W.group : "",
				groupAction: W.groupAction === "remove" ? "del" : W.groupAction,
				reset: W.resetOpen ? W.reset : ""
			};
			let e = U.menuDestination.lastIndexOf(".");
			return {
				language: U.changeLanguage ? U.language : "",
				access: U.changeAccess ? U.access : "",
				tagAdd: L.value && U.tagsOpen ? U.tagAdd : [],
				tagRemove: L.value && U.tagsOpen ? U.tagRemove : [],
				placement: U.placement,
				category: U.category,
				flipOrdering: L.value && U.flipOrdering,
				menu: ne.value && e >= 0 ? U.menuDestination.slice(0, e) : "",
				menuParent: ne.value && e >= 0 ? U.menuDestination.slice(e + 1) : "0"
			};
		}, Z = async () => {
			if (!d.value && ge.value) {
				d.value = !0;
				try {
					await new Promise((e, t) => s("apply", {
						selection: B.value.map((e) => e.id),
						payload: {
							..._e(),
							...G.enabled && a.orderingAvailable ? { sort: {
								field: G.field,
								direction: G.direction
							} } : {}
						},
						resolve: e,
						reject: t
					})), Ee();
				} catch (e) {
					window.Joomla?.renderMessages?.({ error: [e.message || String(e)] });
				} finally {
					d.value = !1;
				}
			}
		}, ve = (e, t) => {
			if (!V.rename) return e.title;
			let n = e.kind === "item" ? e.title.lastIndexOf(".") : -1, r = n > 0 ? e.title.slice(0, n) : e.title, i = n > 0 ? e.title.slice(n) : "", a = V.find ? r.split(V.find).join(V.replace) : r, o = V.number ? `-${String(Math.max(1, Number(V.startAt) || 1) + t).padStart(2, "0")}` : "";
			return `${V.prefix}${a}${V.suffix}${o}${i}`;
		}, ye = v(() => B.value.map((e, t) => {
			let n = e.id.includes(":") ? e.id.slice(e.id.indexOf(":") + 1) : e.title, r = V.placement !== "none" && V.destination ? `${V.destination.slice(V.destination.indexOf(":") + 1).replace(/\/$/, "")}/` : n.slice(0, n.lastIndexOf("/") + 1);
			return {
				id: e.id,
				before: n,
				after: r + ve(e, t)
			};
		})), be = async () => {
			let e = ++D;
			h.value = !0, E.value = "";
			try {
				let t = await u.execute("batchFolders", B.value.map((e) => e.id));
				e === D && (f.value = t);
			} catch (t) {
				e === D && (E.value = t.message || String(t));
			} finally {
				e === D && (h.value = !1);
			}
		}, xe = () => {
			Object.assign(V, ie), Object.assign(H, ae), Object.assign(U, oe), Object.assign(W, se), Object.assign(G, {
				enabled: !1,
				field: a.sortFields[0]?.id || "title",
				direction: "asc"
			}), f.value = [], O.value?.showModal(), F.value && be();
		}, Se = () => k.value?.showModal(), Ce = () => {
			k.value?.open && k.value.close();
		}, we = () => N.value?.showModal(), Te = () => {
			N.value?.open && N.value.close();
		}, Ee = () => {
			D++, Ce(), Te(), O.value?.close();
		};
		return r({
			open: xe,
			close: Ee
		}), T(() => {
			window.SmartBrowserDialogDismiss.install(O.value, () => J.value), window.SmartBrowserDialogDismiss.install(k.value), window.SmartBrowserDialogDismiss.install(N.value), O.value.addEventListener("close", () => {
				Ce(), Te();
			});
		}), (t, r) => (w(), M(S, null, [
			j("dialog", {
				ref_key: "dialog",
				ref: O,
				class: "resource-batch-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_BATCH_ACTIONS")
			}, [j("div", Ue, [
				j("div", We, _(e.t("COM_SMARTBROWSER_BATCH_SELECT_ACTIONS")), 1),
				e.orderingAvailable && B.value.every((e) => e.capabilities?.reorder) ? (w(), M("details", {
					key: 0,
					class: "resource-batch-step",
					open: G.enabled
				}, [j("summary", { onClick: r[0] ||= C((e) => G.enabled = !G.enabled, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_SORT")), 1), j("div", Ke, [c(j("select", {
					"onUpdate:modelValue": r[1] ||= (e) => G.field = e,
					class: "form-select",
					"aria-label": e.t("COM_SMARTBROWSER_BATCH_SORT")
				}, [(w(!0), M(S, null, l(e.sortFields, (t) => (w(), M("option", {
					key: t.id,
					value: t.id
				}, _(e.t(t.label)), 9, Je))), 128))], 8, qe), [[b, G.field]]), c(j("select", {
					"onUpdate:modelValue": r[2] ||= (e) => G.direction = e,
					class: "form-select",
					"aria-label": e.t("COM_SMARTBROWSER_SORT_DIRECTION")
				}, [j("option", Xe, _(e.t("COM_SMARTBROWSER_ASCENDING")), 1), j("option", Ze, _(e.t("COM_SMARTBROWSER_DESCENDING")), 1)], 8, Ye), [[b, G.direction]])])], 8, Ge)) : y("", !0),
				F.value ? (w(), M(S, { key: 1 }, [
					j("details", {
						class: "resource-batch-step",
						open: V.placement !== "none"
					}, [j("summary", { onClick: r[3] ||= C((e) => V.placement = V.placement === "none" ? "move" : "none", ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_PLACEMENT")), 1), j("div", Qe, [n(Ve, {
						modelValue: V.placement,
						"onUpdate:modelValue": r[4] ||= (e) => V.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_DESTINATION_FOLDER")) + " ", 1), h.value ? (w(), M("span", {
						key: 0,
						class: "spinner-border spinner-border-sm",
						role: "status",
						"aria-label": e.t("COM_SMARTBROWSER_LOADING_FOLDERS")
					}, null, 8, $e)) : E.value ? (w(), M("span", et, _(E.value), 1)) : (w(), ee(Le, {
						key: 2,
						modelValue: V.destination,
						"onUpdate:modelValue": r[5] ||= (e) => V.destination = e,
						options: f.value,
						placeholder: "COM_SMARTBROWSER_SELECT_FOLDER",
						t: e.t
					}, null, 8, [
						"modelValue",
						"options",
						"t"
					]))])])], 8, Q),
					j("details", {
						class: "resource-batch-step",
						open: V.rename
					}, [j("summary", { onClick: r[6] ||= C((e) => V.rename = !V.rename, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_RENAME")), 1), j("div", nt, [
						j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_FIND")), 1), c(j("input", {
							"onUpdate:modelValue": r[7] ||= (e) => V.find = e,
							type: "text",
							class: "form-control"
						}, null, 512), [[x, V.find]])]),
						j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_REPLACE")), 1), c(j("input", {
							"onUpdate:modelValue": r[8] ||= (e) => V.replace = e,
							type: "text",
							class: "form-control",
							disabled: !V.find
						}, null, 8, rt), [[x, V.replace]])]),
						j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_PREFIX")), 1), c(j("input", {
							"onUpdate:modelValue": r[9] ||= (e) => V.prefix = e,
							type: "text",
							class: "form-control"
						}, null, 512), [[x, V.prefix]])]),
						j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_SUFFIX")), 1), c(j("input", {
							"onUpdate:modelValue": r[10] ||= (e) => V.suffix = e,
							type: "text",
							class: "form-control"
						}, null, 512), [[x, V.suffix]])]),
						j("label", it, [c(j("input", {
							"onUpdate:modelValue": r[11] ||= (e) => V.number = e,
							type: "checkbox",
							class: "form-check-input"
						}, null, 512), [[A, V.number]]), p(" " + _(e.t("COM_SMARTBROWSER_BATCH_NUMBER")), 1)]),
						V.number ? (w(), M("label", at, [p(_(e.t("COM_SMARTBROWSER_BATCH_START_AT")), 1), c(j("input", {
							"onUpdate:modelValue": r[12] ||= (e) => V.startAt = e,
							type: "number",
							min: "1",
							class: "form-control"
						}, null, 512), [[
							x,
							V.startAt,
							void 0,
							{ number: !0 }
						]])])) : y("", !0)
					])], 8, tt),
					j("details", {
						class: "resource-batch-step",
						open: V.zip
					}, [j("summary", { onClick: r[13] ||= C((e) => V.zip = !V.zip, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_ZIP")), 1), j("div", st, [j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_ZIP_NAME")), 1), j("span", ct, [c(j("input", {
						"onUpdate:modelValue": r[14] ||= (e) => V.zipName = e,
						type: "text",
						class: "form-control",
						onBlur: r[15] ||= (e) => V.zipName = ue.value
					}, null, 544), [[x, V.zipName]]), r[35] ||= j("span", { class: "input-group-text" }, ".zip", -1)])])])], 8, ot),
					K.value ? (w(), M("details", {
						key: 0,
						class: "resource-batch-step",
						open: V.extract
					}, [j("summary", { onClick: r[16] ||= C((e) => V.extract = !V.extract, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_EXTRACT")), 1), j("div", ut, [j("label", dt, [c(j("input", {
						"onUpdate:modelValue": r[17] ||= (e) => V.deleteArchive = e,
						type: "checkbox",
						class: "form-check-input",
						disabled: !B.value.every((e) => e.capabilities?.delete)
					}, null, 8, ft), [[A, V.deleteArchive]]), p(" " + _(e.t("COM_SMARTBROWSER_BATCH_EXTRACT_DELETE")), 1)])])], 8, lt)) : y("", !0)
				], 64)) : I.value ? (w(), M(S, { key: 2 }, [
					(w(), M(S, null, l(q, (t) => j("details", {
						key: t.id,
						class: "resource-batch-step",
						open: H[t.enabled]
					}, [j("summary", { onClick: C((e) => H[t.enabled] = !H[t.enabled], ["prevent"]) }, _(e.t(t.label)), 9, mt), j("div", ht, [c(j("select", {
						"onUpdate:modelValue": (e) => H[t.id] = e,
						class: "form-select",
						"aria-label": e.t(t.label)
					}, [j("option", _t, _(e.t(t.placeholder)), 1), (w(!0), M(S, null, l(Y(t.id), (t) => (w(), M("option", {
						key: t.value,
						value: t.value
					}, _(e.t(t.label)), 9, vt))), 128))], 8, gt), [[b, H[t.id]]])])], 8, pt)), 64)),
					j("details", {
						class: "resource-batch-step",
						open: H.tagsOpen
					}, [j("summary", { onClick: r[18] ||= C((e) => H.tagsOpen = !H.tagsOpen, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), H.tagsOpen ? (w(), M("div", bt, [j("div", xt, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), n(Le, {
						"model-value": H.tagAdd,
						options: Y("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": de
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])]), j("div", St, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), n(Le, {
						"model-value": H.tagRemove,
						options: Y("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": fe
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])])])) : y("", !0)], 8, yt),
					j("details", {
						class: "resource-batch-step",
						open: H.placement !== "none"
					}, [j("summary", { onClick: r[19] ||= C((e) => H.placement = H.placement === "none" ? "move" : "none", ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), H.placement === "none" ? y("", !0) : (w(), M("div", wt, [n(Ve, {
						modelValue: H.placement,
						"onUpdate:modelValue": r[20] ||= (e) => H.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_CATEGORY")), 1), n(Le, {
						modelValue: H.category,
						"onUpdate:modelValue": r[21] ||= (e) => H.category = e,
						options: Y("category"),
						placeholder: "COM_SMARTBROWSER_SELECT_CATEGORY",
						t: e.t
					}, null, 8, [
						"modelValue",
						"options",
						"t"
					])])]))], 8, Ct)
				], 64)) : L.value || R.value || ne.value ? (w(), M(S, { key: 3 }, [
					(w(!0), M(S, null, l(g(ce), (t) => (w(), M("details", {
						key: t.id,
						class: "resource-batch-step",
						open: U[t.enabled]
					}, [j("summary", { onClick: C((e) => U[t.enabled] = !U[t.enabled], ["prevent"]) }, _(e.t(t.label)), 9, Et), U[t.enabled] ? (w(), M("div", Dt, [c(j("select", {
						"onUpdate:modelValue": (e) => U[t.id] = e,
						class: "form-select",
						"aria-label": e.t(t.label)
					}, [j("option", kt, _(e.t(t.placeholder)), 1), (w(!0), M(S, null, l(Y(t.id), (t) => (w(), M("option", {
						key: t.value,
						value: t.value
					}, _(e.t(t.label)), 9, At))), 128))], 8, Ot), [[b, U[t.id]]])])) : y("", !0)], 8, Tt))), 128)),
					L.value ? (w(), M("details", {
						key: 0,
						class: "resource-batch-step",
						open: U.tagsOpen
					}, [j("summary", { onClick: r[22] ||= C((e) => U.tagsOpen = !U.tagsOpen, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), U.tagsOpen ? (w(), M("div", Mt, [j("div", Nt, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), n(Le, {
						"model-value": U.tagAdd,
						options: Y("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": pe
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])]), j("div", Pt, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), n(Le, {
						"model-value": U.tagRemove,
						options: Y("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": me
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])])])) : y("", !0)], 8, jt)) : y("", !0),
					L.value ? (w(), M("details", {
						key: 1,
						class: "resource-batch-step",
						open: U.placement !== "none"
					}, [j("summary", { onClick: r[23] ||= C((e) => U.placement = U.placement === "none" ? "move" : "none", ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), U.placement === "none" ? y("", !0) : (w(), M("div", It, [n(Ve, {
						modelValue: U.placement,
						"onUpdate:modelValue": r[24] ||= (e) => U.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_PARENT_CATEGORY")), 1), n(Le, {
						modelValue: U.category,
						"onUpdate:modelValue": r[25] ||= (e) => U.category = e,
						options: Y("category"),
						placeholder: "COM_SMARTBROWSER_SELECT_CATEGORY",
						t: e.t
					}, null, 8, [
						"modelValue",
						"options",
						"t"
					])])]))], 8, Ft)) : y("", !0),
					L.value ? (w(), M("details", {
						key: 2,
						class: "resource-batch-step",
						open: U.flipOrdering
					}, [j("summary", { onClick: r[26] ||= C((e) => U.flipOrdering = !U.flipOrdering, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING")), 1)], 8, Lt)) : y("", !0),
					ne.value ? (w(), M("details", {
						key: 3,
						class: "resource-batch-step",
						open: U.placement !== "none"
					}, [j("summary", { onClick: r[27] ||= C((e) => U.placement = U.placement === "none" ? "move" : "none", ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_MENU_PLACEMENT")), 1), U.placement === "none" ? y("", !0) : (w(), M("div", zt, [n(Ve, {
						modelValue: U.placement,
						"onUpdate:modelValue": r[28] ||= (e) => U.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_MENU_DESTINATION")), 1), n(Le, {
						modelValue: U.menuDestination,
						"onUpdate:modelValue": r[29] ||= (e) => U.menuDestination = e,
						options: le.value,
						placeholder: "COM_SMARTBROWSER_SELECT_MENU",
						t: e.t
					}, null, 8, [
						"modelValue",
						"options",
						"t"
					])])]))], 8, Rt)) : y("", !0)
				], 64)) : re.value ? (w(), M(S, { key: 4 }, [j("details", {
					class: "resource-batch-step",
					open: W.groupOpen
				}, [j("summary", { onClick: r[30] ||= C((e) => W.groupOpen = !W.groupOpen, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_USER_GROUPS")), 1), W.groupOpen ? (w(), M("div", Vt, [j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), c(j("select", {
					"onUpdate:modelValue": r[31] ||= (e) => W.groupAction = e,
					class: "form-select resource-batch-mode-select"
				}, [
					j("option", Ht, _(e.t("COM_SMARTBROWSER_BATCH_GROUP_ADD")), 1),
					j("option", Ut, _(e.t("COM_SMARTBROWSER_BATCH_GROUP_REMOVE")), 1),
					j("option", Wt, _(e.t("COM_SMARTBROWSER_BATCH_GROUP_SET")), 1)
				], 512), [[b, W.groupAction]])]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_USER_GROUP")), 1), n(Le, {
					modelValue: W.group,
					"onUpdate:modelValue": r[32] ||= (e) => W.group = e,
					options: Y("group"),
					placeholder: "COM_SMARTBROWSER_SELECT_USER_GROUP",
					t: e.t
				}, null, 8, [
					"modelValue",
					"options",
					"t"
				])])])) : y("", !0)], 8, Bt), j("details", {
					class: "resource-batch-step",
					open: W.resetOpen
				}, [j("summary", { onClick: r[33] ||= C((e) => W.resetOpen = !W.resetOpen, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), W.resetOpen ? (w(), M("div", Kt, [j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), c(j("select", {
					"onUpdate:modelValue": r[34] ||= (e) => W.reset = e,
					class: "form-select"
				}, [j("option", qt, _(e.t("JYES")), 1), j("option", Jt, _(e.t("JNO")), 1)], 512), [[b, W.reset]])])])) : y("", !0)], 8, Gt)], 64)) : y("", !0)
			]), j("div", Yt, [j("div", Xt, [j("div", Zt, _(e.t("COM_SMARTBROWSER_BATCH_PREVIEW")), 1), he.value.length ? (w(), M("div", Qt, [(w(!0), M(S, null, l(he.value, (t, n) => (w(), M("div", {
				key: t.id,
				class: "resource-batch-sequence-item"
			}, [n ? (w(), M("span", $t)) : y("", !0), j("div", en, [j("div", tn, _(t.title), 1), t.parameters.length || t.preview ? (w(), M("div", nn, [(w(!0), M(S, null, l(t.parameters, (e) => (w(), M("span", { key: e }, _(e), 1))), 128)), t.preview ? (w(), M("button", {
				key: 0,
				type: "button",
				class: "resource-batch-preview-link",
				onClick: Se
			}, _(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")), 1)) : y("", !0)])) : y("", !0)])]))), 128))])) : (w(), M("p", rn, _(e.t("COM_SMARTBROWSER_BATCH_NO_CHANGES")), 1))]), j("div", an, [j("button", {
				type: "button",
				class: "resource-batch-items-link",
				onClick: we
			}, _(B.value.length) + " " + _(e.t(B.value.length === 1 ? "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_ONE" : "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_MANY")), 1), j("div", on, [j("button", {
				type: "button",
				class: "btn btn-primary",
				disabled: d.value || !ge.value,
				onClick: Z
			}, _(e.t("COM_SMARTBROWSER_BATCH_APPLY")), 9, sn), j("button", {
				type: "button",
				class: "btn btn-danger",
				onClick: Ee
			}, _(e.t("COM_SMARTBROWSER_CANCEL")), 1)])])])], 8, He),
			j("dialog", {
				ref_key: "previewDialog",
				ref: k,
				class: "resource-batch-preview-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")
			}, [j("div", ln, [j("strong", null, _(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")) + " (" + _(ye.value.length) + ")", 1), j("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: Ce
			}, null, 8, un)]), j("div", dn, [(w(!0), M(S, null, l(ye.value, (e) => (w(), M("div", {
				key: e.id,
				class: "resource-batch-preview-row"
			}, [
				j("span", { title: e.before }, _(e.before), 9, fn),
				r[36] ||= j("span", {
					class: "fas fa-arrow-right",
					"aria-hidden": "true"
				}, null, -1),
				j("strong", { title: e.after }, _(e.after), 9, pn)
			]))), 128))])], 8, cn),
			j("dialog", {
				ref_key: "selectionDialog",
				ref: N,
				class: "resource-batch-preview-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_SELECTED_ITEMS")
			}, [j("div", hn, [j("strong", null, _(e.t("COM_SMARTBROWSER_SELECTED_ITEMS")), 1), j("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: Te
			}, null, 8, gn)]), j("ul", _n, [(w(!0), M(S, null, l(B.value, (e) => (w(), M("li", { key: e.id }, [j("span", {
				class: o(e.icon || "fas fa-file"),
				"aria-hidden": "true"
			}, null, 2), j("span", null, _(e.title), 1)]))), 128))])], 8, mn)
		], 64));
	}
}, yn = (e) => (e || []).filter((e) => e.type === "resource" && e.visualRole === "thumbnail");
function bn(e, t = {}) {
	if (!e || e.unavailable) return "";
	let n = t["visual.iconOverride"];
	return typeof n == "string" && n.length <= 160 && /^[a-zA-Z0-9_-]+(?: [a-zA-Z0-9_-]+)*$/.test(n) ? n : e.icon || "fas fa-file";
}
function xn(e) {
	return !e || e.unavailable ? "" : e.thumbnail || e.metadata?.thumbnail || e.metadata?.poster || e.image || (e.type === "image" ? e.metadata?.url : "") || "";
}
//#endregion
//#region resources/js/core/selectionUsage.js
var Sn = /^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/, Cn = (e, t) => Object.prototype.hasOwnProperty.call(e, t), wn = (e) => e === void 0 ? void 0 : JSON.parse(JSON.stringify(e)), Tn = (e) => e == null || typeof e == "string" && !e.trim(), En = /* @__PURE__ */ new Set([
	"text",
	"textarea",
	"boolean",
	"select",
	"number",
	"resource"
]), Dn = (e, t) => !!(e.disabledWhen && Cn(t || {}, e.disabledWhen.key) && t[e.disabledWhen.key] === e.disabledWhen.equals);
function On(e, t = {}) {
	if (!e || e.unavailable || !t || typeof t != "object") return [];
	let n = Array.isArray(e.selectionCapabilities) ? e.selectionCapabilities : [], r = /* @__PURE__ */ new Set();
	return n.flatMap((e) => {
		let n = e?.key;
		if (!Sn.test(n || "") || ![
			"string",
			"boolean",
			"number",
			"resource",
			"object"
		].includes(e.type) || r.has(n) || !Cn(t, n) || t[n] === !1) return [];
		r.add(n);
		let i = t[n] && typeof t[n] == "object" ? t[n] : {};
		return [{
			...e,
			policy: i,
			presentation: ["secondary", "hidden"].includes(i.presentation) ? i.presentation : "primary",
			default: Cn(i, "default") ? i.default : e.default,
			required: i.required === !0
		}];
	});
}
function kn(e, t) {
	if (Tn(t)) return e.required ? "COM_SMARTBROWSER_USAGE_REQUIRED" : null;
	let n = e.type;
	if (n === "string" && typeof t != "string" || n === "boolean" && typeof t != "boolean" || n === "number" && (typeof t != "number" || !Number.isFinite(t)) || n === "object" && (typeof t != "object" || Array.isArray(t)) || n === "resource" && !I(t)) return "COM_SMARTBROWSER_USAGE_INVALID";
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
function An({ profile: e = {}, initialUsage: t = {}, resolveReference: n, editors: r = {} } = {}) {
	let i = /* @__PURE__ */ new Map(), a = (t) => On(t, e);
	function o(e) {
		if (!e) return {};
		let n = N(e);
		i.has(n) || i.set(n, e.unavailable ? wn(t[n] || {}) : {});
		let r = i.get(n);
		for (let i of a(e)) Cn(r, i.key) || (r[i.key] = wn(Cn(t[n] || {}, i.key) ? t[n][i.key] : i.default ?? null));
		for (let t of a(e)) Dn(t, r) && (r[t.key] = wn(t.inactiveValue ?? null));
		return wn(r);
	}
	function s(e, t, n) {
		a(e).some((e) => e.key === t) && (o(e), i.get(N(e))[t] = wn(n), o(e));
	}
	async function c(e) {
		let t = {}, i = {}, s = {};
		for (let c of e) {
			let e = N(c), l = o(c), u = {};
			for (let o of a(c)) {
				let a = l[o.key], s = kn(Dn(o, l) ? {
					...o,
					required: !1
				} : o, a);
				if (!s && o.type === "resource" && !Tn(a)) {
					let e = I(a), t = o.picker || {};
					if (t.adapter && e.adapter !== t.adapter || t.allowedAdapters?.length && !t.allowedAdapters.includes(e.adapter)) s = "COM_SMARTBROWSER_USAGE_INVALID";
					else try {
						let r = await n(e, t);
						(!r || r.unavailable || r.selectable === !1 || t.selectionTarget === "item" && r.kind !== "item" || t.selectionTarget === "node" && r.kind !== "node" || t.allowedResourceTypes?.length && !t.allowedResourceTypes.includes(r.type)) && (s = "COM_SMARTBROWSER_USAGE_INVALID");
					} catch {
						s = "COM_SMARTBROWSER_USAGE_INVALID";
					}
				}
				let d = r[o.editor];
				if (o.presentation !== "hidden" && !En.has(o.editor) && !d && (s = "COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE"), !s && d?.validate) try {
					s = await d.validate(a, {
						definition: o,
						resource: c,
						values: l
					}) || null;
				} catch {
					s = "COM_SMARTBROWSER_USAGE_INVALID";
				}
				s && (t[e] ||= {}, t[e][o.key] = s, o.presentation === "hidden" && (i[e] ||= {}, i[e][o.key] = s)), u[o.key] = o.type === "resource" && !Tn(a) ? I(a) : a;
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
		validate: c,
		forget(e) {
			i.delete(N(e));
		}
	};
}
//#endregion
//#region resources/js/components/LightweightResourceVisual.vue
var jn = { class: "resource-lightweight-area" }, Mn = ["src"], Nn = {
	key: 0,
	class: "resource-lightweight-actions resource-lightweight-preview-action"
}, Pn = ["title", "aria-label"], Fn = { class: "resource-lightweight-actions" }, In = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], Ln = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], Rn = {
	key: 0,
	class: "text-danger",
	role: "alert"
}, zn = {
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
		let i = e, s = r, c = v(() => yn(i.definitions)), f = v(() => i.editable ? c.value.filter((e) => e.presentation !== "hidden") : []), p = v(() => bn(i.resource, i.values)), m = v(() => c.value.find((e) => i.values?.[e.key])), h = t(""), g = t(""), b = t(""), x = t(!1), C = t(null), T = v(() => h.value || xn(i.resource)), E = 0, D = !1;
		a(() => [
			N(i.resource),
			m.value,
			m.value && i.values?.[m.value.key]
		], async () => {
			let e = ++E;
			h.value = "", g.value = "", b.value = "";
			let t = m.value;
			if (t) try {
				let n = await i.resolveReference(i.values[t.key], t.picker);
				if (e !== E) return;
				!n || n.unavailable || n.selectable === !1 || !xn(n) || t.picker?.allowedResourceTypes?.length && !t.picker.allowedResourceTypes.includes(n.type) ? b.value = "COM_SMARTBROWSER_USAGE_INVALID" : h.value = xn(n);
			} catch {
				e === E && (b.value = "COM_SMARTBROWSER_USAGE_INVALID");
			}
		}, {
			immediate: !0,
			deep: !0
		});
		async function O(e) {
			let t = N(i.resource);
			x.value = !0;
			try {
				let n = await window.SmartBrowserPicker.open({
					...e.picker,
					multiple: !1,
					initialSelection: i.values?.[e.key] ? [i.values[e.key].id] : []
				});
				n && !D && N(i.resource) === t && s("change", e.key, I({
					adapter: e.picker.adapter,
					id: n.id
				}));
			} catch {
				!D && N(i.resource) === t && (b.value = "COM_SMARTBROWSER_USAGE_INVALID");
			} finally {
				x.value = !1;
			}
		}
		return n({ element: C }), d(() => {
			D = !0, ++E;
		}), (t, n) => (w(), M(S, null, [j("div", jn, [
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
			}, null, 40, Mn)) : y("", !0), j("span", {
				class: o(["resource-lightweight-icon", [p.value, { "with-thumbnail": T.value && g.value !== T.value }]]),
				"aria-hidden": "true"
			}, null, 2)], 2),
			e.canPreview ? (w(), M("div", Nn, [e.canPreview ? (w(), M("button", {
				key: 0,
				type: "button",
				title: e.t("COM_SMARTBROWSER_ACTION_PREVIEW"),
				"aria-label": e.t("COM_SMARTBROWSER_ACTION_PREVIEW"),
				onClick: n[1] ||= (e) => t.$emit("preview")
			}, [...n[2] ||= [j("span", {
				class: "fas fa-eye",
				"aria-hidden": "true"
			}, null, -1)]], 8, Pn)) : y("", !0)])) : y("", !0),
			j("div", Fn, [(w(!0), M(S, null, l(f.value, (r) => (w(), M(S, { key: r.key }, [j("button", {
				type: "button",
				class: o({ selected: !!e.values?.[r.key] }),
				disabled: x.value,
				title: e.t(e.values?.[r.key] ? "COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL" : "COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL"),
				"aria-label": e.t(e.values?.[r.key] ? "COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL" : "COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL"),
				onClick: (e) => O(r)
			}, [...n[3] ||= [j("span", {
				class: "fas fa-image",
				"aria-hidden": "true"
			}, null, -1)]], 10, In), e.values?.[r.key] ? (w(), M("button", {
				key: 0,
				type: "button",
				disabled: x.value,
				title: e.t("COM_SMARTBROWSER_USAGE_CLEAR"),
				"aria-label": e.t("COM_SMARTBROWSER_USAGE_CLEAR"),
				onClick: (e) => t.$emit("change", r.key, null)
			}, [...n[4] ||= [j("span", {
				class: "fas fa-times",
				"aria-hidden": "true"
			}, null, -1)]], 8, Ln)) : y("", !0)], 64))), 128)), u(t.$slots, "actions")])
		]), b.value || c.value.some((t) => e.errors?.[t.key]) ? (w(), M("small", Rn, _(e.t(b.value || e.errors[c.value.find((t) => e.errors?.[t.key]).key])), 1)) : y("", !0)], 64));
	}
}, Bn = { class: "resource-usage-field" }, Vn = {
	key: 0,
	"aria-hidden": "true"
}, Hn = [
	"value",
	"disabled",
	"required",
	"aria-invalid"
], Un = [
	"value",
	"required",
	"aria-invalid"
], Wn = {
	key: 3,
	class: "resource-usage-check"
}, Gn = ["checked"], Kn = ["value", "aria-invalid"], qn = {
	key: 0,
	value: ""
}, Jn = ["value"], Yn = ["value", "aria-invalid"], Xn = ["value"], Zn = { value: "auto" }, Qn = { value: "custom" }, $n = {
	key: 0,
	class: "resource-usage-reference"
}, er = { key: 0 }, tr = ["disabled"], nr = ["title", "aria-label"], rr = {
	key: 8,
	class: "text-danger"
}, ir = { key: 9 }, ar = {
	key: 10,
	class: "text-danger",
	role: "alert"
}, or = {
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
		let i = e, o = n, s = `sb-usage-${Math.random().toString(36).slice(2)}`, c = t(i.value ? "custom" : "auto"), u = t(""), f = t(!1), m = t(""), h = t(null), g = v(() => i.editors?.[i.definition.editor]), b = v(() => Dn(i.definition, i.values)), x, C, T = 0, E = !1, D = (e) => {
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
				e && !E && D(I({
					adapter: i.definition.picker.adapter,
					id: e.id
				}));
			} catch {
				m.value = "COM_SMARTBROWSER_USAGE_INVALID";
			} finally {
				f.value = !1;
			}
		}
		return a([g, () => N(i.resource)], async () => {
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
		}), (t, n) => (w(), M("div", Bn, [
			e.definition.editor === "boolean" ? y("", !0) : (w(), M("label", {
				key: 0,
				for: s
			}, [p(_(e.t(e.definition.label)), 1), e.definition.required ? (w(), M("span", Vn, " *")) : y("", !0)])),
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
			}, null, 40, Hn)) : e.definition.editor === "textarea" ? (w(), M("textarea", {
				key: 2,
				id: s,
				class: "form-control",
				rows: "3",
				value: e.value ?? "",
				required: e.definition.required,
				"aria-invalid": !!e.error,
				onInput: n[1] ||= (e) => D(e.target.value)
			}, null, 40, Un)) : e.definition.editor === "boolean" ? (w(), M("label", Wn, [j("input", {
				id: s,
				class: "form-check-input",
				type: "checkbox",
				checked: e.value === !0,
				onChange: n[2] ||= (e) => D(e.target.checked)
			}, null, 40, Gn), p(_(e.t(e.definition.label)), 1)])) : e.definition.editor === "select" ? (w(), M("select", {
				key: 4,
				id: s,
				class: "form-select",
				value: e.value,
				"aria-invalid": !!e.error,
				onChange: n[3] ||= (t) => D(e.definition.options.find((e) => String(e.value) === t.target.value)?.value)
			}, [!e.definition.required && !e.definition.options?.some((e) => e.value === "") ? (w(), M("option", qn, _(e.t("COM_SMARTBROWSER_USAGE_CHOOSE")), 1)) : y("", !0), (w(!0), M(S, null, l(e.definition.options, (t) => (w(), M("option", {
				key: String(t.value),
				value: t.value
			}, _(e.t(t.label)), 9, Jn))), 128))], 40, Kn)) : e.definition.editor === "number" ? (w(), M("input", {
				key: 5,
				id: s,
				class: "form-control",
				type: "number",
				value: e.value ?? "",
				"aria-invalid": !!e.error,
				onInput: n[4] ||= (e) => D(e.target.value === "" ? null : Number(e.target.value))
			}, null, 40, Yn)) : e.definition.editor === "resource" ? (w(), M(S, { key: 6 }, [j("select", {
				id: s,
				class: "form-select",
				value: c.value,
				onChange: n[5] ||= (e) => k(e.target.value)
			}, [j("option", Zn, _(e.t("COM_SMARTBROWSER_USAGE_AUTO")), 1), j("option", Qn, _(e.t("COM_SMARTBROWSER_USAGE_CUSTOM")), 1)], 40, Xn), c.value === "custom" ? (w(), M("div", $n, [
				e.value ? (w(), M("span", er, _(u.value || e.value.id), 1)) : y("", !0),
				j("button", {
					type: "button",
					class: "btn btn-outline-primary",
					disabled: f.value,
					onClick: A
				}, [n[6] ||= j("span", {
					class: "fas fa-plus",
					"aria-hidden": "true"
				}, null, -1), p(" " + _(e.t(e.definition.pickerLabel || "COM_SMARTBROWSER_USAGE_PICK_RESOURCE")), 1)], 8, tr),
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
				}, null, -1)]], 8, nr)) : y("", !0)
			])) : y("", !0)], 64)) : g.value ? (w(), M("div", {
				key: 7,
				ref_key: "customContainer",
				ref: h
			}, null, 512)) : (w(), M("small", rr, _(e.t("COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE")), 1)),
			e.definition.description ? (w(), M("small", ir, _(e.t(e.definition.description)), 1)) : y("", !0),
			e.error || m.value ? (w(), M("small", ar, _(e.t(e.error || m.value)), 1)) : y("", !0)
		]));
	}
}, sr = { class: "resource-usage-editor" }, cr = ["open"], lr = {
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
		return (t, o) => (w(), M("div", sr, [(w(!0), M(S, null, l(n.value, (e) => (w(), ee(or, i({ key: e.key }, { ref_for: !0 }, a(e), { onChange: (n) => t.$emit("change", e.key, n) }), null, 16, ["onChange"]))), 128)), r.value.length ? (w(), M("details", {
			key: 0,
			class: "resource-usage-secondary",
			open: r.value.some((t) => e.errors?.[t.key]) || void 0
		}, [j("summary", null, _(e.t("COM_SMARTBROWSER_USAGE_MORE")), 1), (w(!0), M(S, null, l(r.value, (e) => (w(), ee(or, i({ key: e.key }, { ref_for: !0 }, a(e), { onChange: (n) => t.$emit("change", e.key, n) }), null, 16, ["onChange"]))), 128))], 8, cr)) : y("", !0)]));
	}
}, ur = {
	key: 0,
	class: "resource-info-tabs",
	role: "tablist"
}, dr = ["aria-selected"], fr = ["aria-selected"], pr = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], mr = { key: 0 }, hr = {
	key: 0,
	class: "resource-language"
}, gr = ["src"], _r = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, vr = {
	key: 2,
	class: "resource-info-timezone"
}, yr = { key: 1 }, br = { key: 0 }, xr = { key: 1 }, Sr = {
	key: 0,
	class: "resource-info-timezone"
}, Cr = { key: 2 }, wr = {
	key: 0,
	class: "resource-info-timezone"
}, Tr = { key: 3 }, Er = { key: 4 }, Dr = { key: 5 }, Or = { key: 6 }, kr = {
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
		let r = e, i = v(() => (r.usageDefinitions || []).filter((e) => !yn([e]).length)), u = t("info"), f = t("usage"), m = (e) => {
			f.value = e, u.value = e;
		}, h = t(!1), b = t(null), x;
		a(() => N(r.resource), () => x?.abort()), d(() => x?.abort()), a(() => !!r.usageDefinitions?.length, (e) => {
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
		}), D = z, k = v(() => r.resource?.kind === "node" ? r.t("COM_SMARTBROWSER_FOLDER") : r.resource?.type ? r.resource.type.charAt(0).toUpperCase() + r.resource.type.slice(1) : r.t("COM_SMARTBROWSER_RESOURCE")), A = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, te = (e) => `${(e / 1024).toFixed(2)} KB`, P = (e) => String(e.source || "").split(".").reduce((e, t) => e?.[t], r.resource), F = (e) => (e.format === "language" || e.source === "metadata.language") && P(e) === "*" ? r.t("COM_SMARTBROWSER_ALL_LANGUAGES") : e.format === "date" ? A(P(e)) : e.format === "size" ? P(e) !== null && P(e) !== void 0 ? te(P(e)) : "" : e.format === "dimensions" ? r.resource?.metadata.width && r.resource?.metadata.height ? `${r.resource.metadata.width}px \u00d7 ${r.resource.metadata.height}px` : "" : P(e), I = (e) => {
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
			e.usageDefinitions?.length ? (w(), M("div", ur, [j("button", {
				type: "button",
				role: "tab",
				"aria-selected": u.value === "usage",
				onClick: r[0] ||= (e) => m("usage")
			}, _(e.t("COM_SMARTBROWSER_USAGE_OPTIONS")), 9, dr), j("button", {
				type: "button",
				role: "tab",
				"aria-selected": u.value === "info",
				onClick: r[1] ||= (e) => m("info")
			}, _(e.t("COM_SMARTBROWSER_USAGE_INFO")), 9, fr)])) : y("", !0),
			n(zn, {
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
				}, null, 2)], 8, pr))), 128))]),
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
			e.usageDefinitions?.length && u.value === "usage" ? (w(), ee(lr, {
				key: g(N)(e.resource),
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
			])) : (w(), M(S, { key: 2 }, [e.fields?.length ? (w(), M("dl", mr, [(w(!0), M(S, null, l(E.value, (t) => c((w(), M("div", { key: `${t.source}-${t.label}` }, [
				j("dt", null, [j("span", {
					class: o(g(D)(t)),
					"aria-hidden": "true"
				}, null, 2), p(_(e.t(t.label)), 1)]),
				t.format === "language" ? (w(), M("dd", hr, [e.resource.metadata?.languageImage ? (w(), M("img", {
					key: 0,
					src: e.resource.metadata.languageImage,
					alt: "",
					"aria-hidden": "true"
				}, null, 8, gr)) : P(t) === "*" ? (w(), M("span", _r)) : y("", !0), j("span", null, _(F(t)), 1)])) : (w(), M("dd", {
					key: 1,
					class: o({
						"resource-info-identifier": t.source === "metadata.alias" || t.source === "metadata.username",
						"resource-info-lines": t.source === "metadata.tagPaths"
					})
				}, _(F(t)), 3)),
				t.format === "date" && I(P(t)) ? (w(), M("small", vr, _(I(P(t))), 1)) : y("", !0)
			])), [[O, F(t) !== "" && F(t) !== null && F(t) !== void 0]])), 128))])) : (w(), M("dl", yr, [
				e.resource.parentId ? (w(), M("div", br, [j("dt", null, [r[5] ||= j("span", {
					class: "fas fa-folder",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_FOLDER")), 1)]), j("dd", null, _(e.resource.parentId), 1)])) : y("", !0),
				j("div", null, [j("dt", null, [r[6] ||= j("span", {
					class: "fas fa-file-alt",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_TYPE")), 1)]), j("dd", null, _(k.value), 1)]),
				e.resource.metadata.created ? (w(), M("div", xr, [
					j("dt", null, [r[7] ||= j("span", {
						class: "fas fa-calendar",
						"aria-hidden": "true"
					}, null, -1), p(_(e.t("COM_SMARTBROWSER_DATE_CREATED")), 1)]),
					j("dd", null, _(A(e.resource.metadata.created)), 1),
					I(e.resource.metadata.created) ? (w(), M("small", Sr, _(I(e.resource.metadata.created)), 1)) : y("", !0)
				])) : y("", !0),
				e.resource.metadata.modified ? (w(), M("div", Cr, [
					j("dt", null, [r[8] ||= j("span", {
						class: "fas fa-calendar",
						"aria-hidden": "true"
					}, null, -1), p(_(e.t("COM_SMARTBROWSER_DATE_MODIFIED")), 1)]),
					j("dd", null, _(A(e.resource.metadata.modified)), 1),
					I(e.resource.metadata.modified) ? (w(), M("small", wr, _(I(e.resource.metadata.modified)), 1)) : y("", !0)
				])) : y("", !0),
				e.resource.metadata.width && e.resource.metadata.height ? (w(), M("div", Tr, [j("dt", null, [r[9] ||= j("span", {
					class: "fas fa-expand",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_DIMENSIONS")), 1)]), j("dd", null, _(e.resource.metadata.width) + "px × " + _(e.resource.metadata.height) + "px", 1)])) : y("", !0),
				e.resource.metadata.size ? (w(), M("div", Er, [j("dt", null, [r[10] ||= j("span", {
					class: "fas fa-database",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_SIZE")), 1)]), j("dd", null, _(te(e.resource.metadata.size)), 1)])) : y("", !0),
				e.resource.metadata.mimeType ? (w(), M("div", Dr, [j("dt", null, [r[11] ||= j("span", {
					class: "fas fa-file-alt",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_MIME_TYPE")), 1)]), j("dd", null, _(e.resource.metadata.mimeType), 1)])) : y("", !0),
				e.resource.metadata.extension ? (w(), M("div", Or, [j("dt", null, [r[12] ||= j("span", {
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
}, Ar = {
	class: "resource-breadcrumb",
	"aria-label": "Breadcrumb"
}, jr = [
	"title",
	"aria-label",
	"onClick"
], Mr = {
	key: 1,
	class: "resource-breadcrumb-title"
}, Nr = {
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
		return (t, r) => (w(), M("nav", Ar, [(w(!0), M(S, null, l(n.value, (n, r) => (w(), M("button", {
			key: n.id,
			type: "button",
			class: o({ "root-crumb": r === 0 && e.iconOnlyRoot }),
			title: n.title,
			"aria-label": r === 0 && e.iconOnlyRoot ? n.title : void 0,
			onClick: (e) => t.$emit("open", n.id)
		}, [r === 0 ? (w(), M("span", {
			key: 0,
			class: o(n.useResourceIcon ? n.openIcon || n.icon : e.rootIcon),
			"aria-hidden": "true"
		}, null, 2)) : y("", !0), r !== 0 || !e.iconOnlyRoot ? (w(), M("span", Mr, _(n.title), 1)) : y("", !0)], 10, jr))), 128))]));
	}
}, Pr = {
	class: "resource-toolbar",
	role: "toolbar"
}, Fr = { class: "resource-toolbar-primary" }, Ir = { class: "resource-view-controls" }, Lr = [
	"disabled",
	"title",
	"aria-label"
], Rr = ["title"], zr = ["title"], Br = ["disabled"], Vr = ["disabled"], Hr = ["title"], Ur = { "aria-hidden": "true" }, Wr = [
	"title",
	"aria-label",
	"aria-expanded"
], Gr = {
	key: 0,
	class: "resource-column-menu"
}, Kr = { class: "resource-column-menu-title" }, qr = [
	"checked",
	"disabled",
	"onChange"
], Jr = { class: "resource-mode-controls" }, Yr = ["title", "onClick"], Xr = ["title"], Zr = {
	key: 0,
	class: "resource-toolbar-expanded resource-search-row"
}, Qr = {
	for: "smartbrowser-search",
	class: "visually-hidden"
}, $r = { class: "input-group resource-search-control" }, ei = ["value", "placeholder"], ti = ["title"], ni = { class: "visually-hidden" }, ri = {
	key: 1,
	class: "resource-toolbar-expanded resource-sort-row"
}, ii = { class: "resource-sort-controls" }, ai = { class: "visually-hidden" }, oi = ["value"], si = { value: "" }, ci = ["value"], li = { class: "visually-hidden" }, ui = ["value", "disabled"], di = { value: "asc" }, fi = { value: "desc" }, pi = {
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
		return (t, r) => (w(), M("div", Pr, [
			j("div", Fr, [n(Nr, {
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
			]), j("div", Ir, [
				e.reorderVisible ? (w(), ee(ae, {
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
				}, null, -1)]], 8, Lr)) : y("", !0),
				j("button", {
					type: "button",
					class: o(["resource-icon-button", { active: u.value }]),
					title: e.t("COM_SMARTBROWSER_SEARCH"),
					onClick: r[3] ||= (e) => u.value = !u.value
				}, [...r[17] ||= [j("span", {
					class: "fas fa-search",
					"aria-hidden": "true"
				}, null, -1)]], 10, Rr),
				b("sort") ? (w(), M("button", {
					key: 2,
					type: "button",
					class: o(["resource-icon-button", { active: c.value }]),
					title: e.t("COM_SMARTBROWSER_SORT_BY"),
					onClick: r[4] ||= (e) => c.value = !c.value
				}, [...r[18] ||= [j("span", {
					class: "fas fa-sort-amount-down-alt",
					"aria-hidden": "true"
				}, null, -1)]], 10, zr)) : y("", !0),
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
				}, null, -1)]], 8, Br)) : y("", !0),
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
				}, null, -1)]], 8, Vr)) : y("", !0),
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
				}, null, -1), j("small", Ur, _(h.value), 1)], 8, Hr)) : y("", !0),
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
				}, null, -1)]], 8, Wr), f.value ? (w(), M("div", Gr, [j("div", Kr, _(e.t("COM_SMARTBROWSER_COLUMNS")), 1), (w(!0), M(S, null, l(e.columns, (n) => (w(), M("label", {
					key: n.id,
					class: "resource-column-choice"
				}, [j("input", {
					type: "checkbox",
					checked: n.defaultVisible ? !e.hiddenColumns?.includes(n.id) : e.shownColumns?.includes(n.id),
					disabled: n.id === "title" || n.id === "name",
					onChange: (e) => t.$emit("toggle-column", n.id)
				}, null, 40, qr), j("span", null, _(e.t(n.label || (n.dateGroup ? "COM_SMARTBROWSER_DATE" : n.fields?.[0]?.label))), 1)]))), 128))])) : y("", !0)], 512)) : y("", !0),
				j("div", Jr, [(w(!0), M(S, null, l(e.views, (n) => (w(), M("button", {
					key: n.id,
					type: "button",
					class: o(["resource-icon-button", { active: e.activeView === n.id }]),
					title: e.t(n.label),
					onClick: (e) => t.$emit("view", n.id)
				}, [j("span", {
					class: o(n.icon),
					"aria-hidden": "true"
				}, null, 2)], 10, Yr))), 128))]),
				j("button", {
					type: "button",
					class: o(["resource-icon-button", { active: e.showInfo }]),
					title: e.t("COM_SMARTBROWSER_TOGGLE_INFO"),
					onClick: r[10] ||= (e) => t.$emit("info")
				}, [...r[24] ||= [j("span", {
					class: "fas fa-info",
					"aria-hidden": "true"
				}, null, -1)]], 10, Xr)
			])]),
			u.value ? (w(), M("div", Zr, [j("label", Qr, _(e.t("COM_SMARTBROWSER_SEARCH")), 1), j("div", $r, [j("input", {
				id: "smartbrowser-search",
				value: e.search,
				type: "search",
				class: "form-control",
				placeholder: e.t("COM_SMARTBROWSER_SEARCH"),
				onInput: r[11] ||= (e) => t.$emit("search", e.target.value),
				onKeydown: r[12] ||= D(C((e) => t.$emit("search", e.target.value), ["prevent"]), ["enter"])
			}, null, 40, ei), j("button", {
				type: "button",
				class: "btn btn-primary",
				title: e.t("COM_SMARTBROWSER_SEARCH"),
				onClick: r[13] ||= (n) => t.$emit("search", e.search)
			}, [r[25] ||= j("span", {
				class: "fas fa-search",
				"aria-hidden": "true"
			}, null, -1), j("span", ni, _(e.t("COM_SMARTBROWSER_SEARCH")), 1)], 8, ti)])])) : y("", !0),
			c.value && b("sort") ? (w(), M("div", ri, [j("div", ii, [j("label", null, [j("span", ai, _(e.t("COM_SMARTBROWSER_SORT_BY")), 1), j("select", {
				value: e.sortBy,
				class: "form-select",
				onChange: r[14] ||= (e) => t.$emit("sort-by", e.target.value)
			}, [j("option", si, _(e.t("COM_SMARTBROWSER_DEFAULT_SORTING")), 1), (w(!0), M(S, null, l(s.value, (t) => (w(), M("option", {
				key: t.id,
				value: t.id
			}, _(e.t(t.label)), 9, ci))), 128))], 40, oi)]), j("label", null, [j("span", li, _(e.t("COM_SMARTBROWSER_SORT_DIRECTION")), 1), j("select", {
				value: e.sortDirection || "asc",
				class: "form-select",
				disabled: !e.sortBy,
				onChange: r[15] ||= (e) => t.$emit("sort-direction-value", e.target.value)
			}, [j("option", di, _(e.t("COM_SMARTBROWSER_ASCENDING")), 1), j("option", fi, _(e.t("COM_SMARTBROWSER_DESCENDING")), 1)], 40, ui)])])])) : y("", !0)
		]));
	}
}, mi = {
	__name: "ResourceNodeVisual",
	props: {
		resource: Object,
		open: Boolean
	},
	setup(e) {
		return (t, n) => (w(), ee(k, {
			resource: e.resource,
			variant: "compact",
			"allow-image": !1,
			open: e.open,
			"align-base-start": ""
		}, null, 8, ["resource", "open"]));
	}
}, hi = ["aria-label"], gi = ["open", "onToggle"], _i = ["onClick"], vi = {
	key: 0,
	class: "resource-adapter-roots"
}, yi = ["onClick"], bi = {
	key: 1,
	class: "resource-tree-branch"
}, xi = ["onClick"], Si = ["onClick"], Ci = {
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
		}, null, 2), p(" " + _(r.title), 1)], 8, _i), r.id !== e.activeAdapter || d.value ? (w(), M("div", vi, [(w(!0), M(S, null, l(r.id === e.activeAdapter ? e.roots : [], (i) => (w(), M("section", {
			key: i.id,
			class: o(["resource-tree-root", { "root-hidden": i.visible === !1 }])
		}, [i.visible === !1 ? y("", !0) : (w(), M("button", {
			key: 0,
			type: "button",
			class: o({ active: e.selectedNode === i.id }),
			onClick: (e) => t.$emit("open", i.id)
		}, [j("span", {
			class: o(["resource-tree-root-icon", i.useResourceIcon ? i.icon : r.icon]),
			"aria-hidden": "true"
		}, null, 2), j("span", null, _(i.title), 1)], 10, yi)), c(i) ? (w(), M("div", bi, [(w(!0), M(S, null, l(u(i), (r) => (w(), M("button", {
			key: r.id,
			type: "button",
			class: o({ active: e.selectedNode === r.id }),
			style: h(f(i, u(i).indexOf(r))),
			onClick: (e) => t.$emit("open", r.id)
		}, [n(mi, {
			resource: r,
			open: !0
		}, null, 8, ["resource"]), j("span", null, _(r.title), 1)], 14, xi))), 128)), (w(!0), M(S, null, l(e.nodes, (e) => (w(), M(S, { key: e.id }, [e.navigable === !1 ? (w(), M("div", {
			key: 1,
			class: "resource-tree-entry resource-tree-static",
			style: h(f(i, u(i).length))
		}, [n(mi, { resource: e }, null, 8, ["resource"]), j("span", null, _(e.title), 1)], 4)) : (w(), M("button", {
			key: 0,
			type: "button",
			class: "resource-tree-entry",
			style: h(f(i, u(i).length)),
			onClick: (n) => t.$emit("open", e.id)
		}, [n(mi, { resource: e }, null, 8, ["resource"]), j("span", null, _(e.title), 1)], 12, Si))], 64))), 128))])) : y("", !0)], 2))), 128))])) : y("", !0)], 40, gi))), 128))], 8, hi));
	}
}, wi = /* @__PURE__ */ new Set([
	"articles",
	"categories",
	"tags",
	"articles-by-tag",
	"menus",
	"users",
	"media"
]), Ti = (e, t, n) => {
	let r = e.startsWith("flat-") ? new URL(n).searchParams.get("flatFromBrowseRoot") || "" : t || "";
	return `supjx.smartbrowser.ui.${e.replace(/^flat-/, "")}.${r}`;
}, Ei = (e, t, n, r) => {
	let i = new URL(e);
	if (!wi.has(t)) return i.toString();
	i.searchParams.set("flatFromAdapter", t), i.searchParams.set("flatFromNode", n), r ? i.searchParams.set("flatFromBrowseRoot", r) : i.searchParams.delete("flatFromBrowseRoot");
	let a = `flat-${t}`;
	if (i.searchParams.set("adapter", a), i.searchParams.set("node", `${a}:root`), t === "articles" || t === "categories") {
		let e = n.startsWith("category:") ? n : r;
		e?.startsWith("category:") ? i.searchParams.set("browseRoot", e) : i.searchParams.delete("browseRoot"), i.searchParams.delete("flatScope");
	} else r ? i.searchParams.set("browseRoot", r) : i.searchParams.delete("browseRoot"), i.searchParams.set("flatScope", n);
	return i.toString();
}, Di = (e, t) => {
	let n = new URL(e), r = n.searchParams.get("flatFromAdapter"), i = wi.has(r) ? r : "articles", a = n.searchParams.get("flatFromBrowseRoot") || (r ? null : t), o = n.searchParams.get("flatFromNode") || a || "content:root";
	n.searchParams.set("adapter", i), n.searchParams.set("node", o), a ? n.searchParams.set("browseRoot", a) : n.searchParams.delete("browseRoot");
	for (let e of [
		"flatFromAdapter",
		"flatFromNode",
		"flatFromBrowseRoot",
		"flatScope"
	]) n.searchParams.delete(e);
	return n.toString();
}, Oi = (e, t) => {
	let n = new URL(e);
	if (!n.searchParams.get("adapter")?.startsWith("flat-") || !t) return n.toString();
	let r = n.searchParams.get("adapter");
	if (n.searchParams.set("node", `${r}:root`), n.searchParams.set("flatFromNode", t), r === "flat-articles" || r === "flat-categories") {
		let e = n.searchParams.get("flatFromBrowseRoot") || (n.searchParams.has("flatFromAdapter") ? null : n.searchParams.get("browseRoot"));
		e ? n.searchParams.set("browseRoot", e) : n.searchParams.delete("browseRoot"), n.searchParams.delete("flatScope");
	} else n.searchParams.set("flatScope", t);
	return n.toString();
}, ki = {
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
}, Ai = (e) => ({
	stateLabel: "status",
	width: "dimension",
	link: "url"
})[e.split(".").pop()] || e.split(".").pop();
function ji(e, t) {
	let n = e?.columns || [], r = n.map((e) => ({
		...e,
		defaultVisible: !0
	})), i = new Set(n.map((e) => e.id)), a = new Set(n.map((e) => e.source).filter(Boolean)), o = t.replace(/^flat-/, "") === "articles-by-tag" ? "articles" : t.replace(/^flat-/, ""), s = [...e?.infoFields || [], ...(ki[o] || []).map(([e, t, n]) => ({
		id: Ai(e),
		label: t,
		source: `metadata.${e}`,
		format: n
	}))], c = i.has("dates");
	for (let e of s) {
		if (!e.source || !e.label || e.source === "metadata.locationPath") continue;
		let t = e.id || Ai(e.source);
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
var Mi = {
	key: 0,
	class: "smartbrowser-busy",
	role: "status",
	"aria-live": "polite"
}, Ni = [
	"aria-pressed",
	"title",
	"aria-label"
], Pi = [
	"aria-pressed",
	"title",
	"aria-label"
], Fi = {
	key: 1,
	class: "resource-picker-collection"
}, Ii = [
	"title",
	"aria-label",
	"aria-expanded"
], Li = { class: "resource-main" }, Ri = {
	key: 0,
	class: "resource-loader"
}, zi = {
	key: 1,
	class: "resource-empty"
}, Bi = {
	key: 3,
	class: "resource-drop-overlay"
}, Vi = {
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
			l && (b = ce(document.getElementById("smartbrowser-app"), (e) => {
				u.value = e;
			}));
		}), d(() => b?.destroy());
		let E = m("actionDriver"), D = m("resourceApi"), O = m("viewRegistry"), { state: k, resources: A, bulkSelectableResources: te, selection: I, focusedResource: R, load: z, focus: ae, toggle: oe, selectAll: H, invertSelection: U } = i, K = c.mode === "select" ? c.pickerContext || c.selectionHost : c.selectionHost || null, q = !!K?.collectionMode, J = (e) => Joomla.Text?._(e, e) || e, Y = /* @__PURE__ */ new Map(), le = (e) => {
			let t = e?.selection?.adapter || e?.adapter;
			if (!t || t === c.adapter.replace(/^flat-/, "")) return E;
			if (!Y.has(t)) {
				let e = new L({
					...c,
					adapter: t,
					browseRoot: null,
					flatScope: null
				});
				Y.set(t, {
					api: e,
					driver: new se(e, k, async () => {
						await me?.refresh();
						for (let e of me?.browser.state.items || []) k.selectedResources[N(e)] = re(e);
						await z();
					}, J, c.editorMode, c.application)
				});
			}
			return Y.get(t).driver.selectionHost = be, Y.get(t).driver;
		}, ue = (e) => e?.collectionActions || k.actions, de = (e, t) => ue(t).find((t) => t.id === e.id) || e, fe = (e, t) => {
			if (!q || e.currentNode || !t.length) return E.available(e, t);
			if (e.single && t.length !== 1) return !1;
			let n = (t) => (!t.collectionActions || t.collectionActions.some((t) => t.id === e.id)) && le(t).available(de(e, t), [t]);
			return e.exclusiveGroup ? t.some(n) : t.every(n);
		}, pe = async (e, t) => {
			if (!fe(e, t)) return;
			if (!q || e.currentNode || !t.length) return E.execute(e, t);
			let n = /* @__PURE__ */ new Map();
			for (let e of t) {
				let t = le(e);
				n.has(t) || n.set(t, []), n.get(t).push(e);
			}
			for (let [t, r] of n) await t.execute(de(e, r[0]), r);
		};
		d(() => Y.forEach(({ api: e, driver: t }) => {
			t.destroy(), e.destroy();
		}));
		let me, X = !1, he = {
			referenceItems: !0,
			homogeneous: K?.homogeneous === !0,
			readOnly: !1,
			showCount: !1,
			items: K?.getCollectionSnapshot?.().items || [],
			layout: "compact",
			allowRemove: !0,
			allowOrdering: c.multiple && K?.allowOrdering !== !1,
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
				k.selectedResources[N(t)] = t, k.focusedId = N(t);
			}
		}, ge = /* @__PURE__ */ new Map();
		async function _e(e, t = {}) {
			let n = JSON.stringify([e.adapter, t.browseRoot || ""]);
			return ge.has(n) || ge.set(n, new L({
				...c,
				adapter: e.adapter,
				mode: "select",
				browseRoot: t.browseRoot || null,
				flatScope: null
			})), (await ge.get(n).collection([e.id])).resources[0];
		}
		let Z = An({
			profile: K?.selectionProfile || {},
			initialUsage: K?.initialUsage || {},
			editors: K?.editors || {},
			resolveReference: _e
		}), ve = () => k.selectedIds.flatMap((e) => {
			let t = I.value.find((t) => N(t) === e);
			if (t) return [{
				selection: F(t, c.adapter.replace(/^flat-/, "")),
				usage: Z.get(t)
			}];
			let n = K?.getCollectionSnapshot?.().items.find((t) => P(t.selection) === e);
			return n ? [n] : [];
		}), ye = () => {
			q && K.commitCollection?.({
				items: ve(),
				resources: Object.fromEntries(I.value.map((e) => [N(e), e])),
				virtualResources: k.virtualResources
			});
		}, be = c.selectionState && (K || c.selectionHost) ? {
			editorContext: K?.selectionEditorContext || {},
			canAdd: (e, t) => i.canAddSelection(e, t),
			canCreate: (e) => i.canCreateSelectionResource(e),
			remove: (e) => {
				i.deleteVirtualResources(e), e.forEach((e) => Z.forget(e)), xe.value++, ye(), c.selectionHost?.onChange?.({ items: ve() });
			},
			replace: (e, t) => {
				let n = t ? { ...Z.get(t) } : {}, r = i.replaceSelectionResource(e, t);
				for (let e of Z.definitions(r)) Object.prototype.hasOwnProperty.call(n, e.key) && Z.set(r, e.key, n[e.key]);
				return xe.value++, ye(), c.selectionHost?.onChange?.({ items: ve() }), t && N(t) !== N(r) && Z.forget(t), r;
			}
		} : null;
		E.selectionHost = be, a(() => [k.selectedIds, k.selectedResources], ye, {
			deep: !0,
			flush: "sync"
		}), d(ye);
		let xe = t(0);
		q && (me = W({
			config: he,
			api: D,
			translate: J,
			notify: (e) => {
				X = !0, k.selectedResources = Object.fromEntries(e.resources.map((e) => [N(e), re(e)])), k.selectedIds = e.items.map((e) => P(e.selection)), X = !1;
			}
		}), me.refresh().catch((e) => Joomla.renderMessages({ error: [e.message] })), a(() => [k.selectedIds, xe.value], () => {
			X || me.setItems(ve()).catch((e) => Joomla.renderMessages({ error: [e.message] }));
		}, {
			deep: !0,
			flush: "sync"
		}), d(() => me.destroy()));
		let Se = t(K?.isMaximized?.() || !1), Ce = t(0), we = t({}), Te = t(!1), Ee = v(() => Z.definitions(R.value).filter((e) => e.presentation !== "hidden")), De = v(() => (xe.value, Z.get(R.value))), Oe = v(() => !!(K && Ee.value.length)), ke = !!(K && Object.keys(K.selectionProfile || {}).length), Ae = t(k.showInfo), je = v(() => Oe.value || (ke ? Ae.value : k.showInfo)), Ne = () => {
			Oe.value || (ke ? Ae.value = !Ae.value : k.showInfo = !k.showInfo);
		}, Pe = (e, t, n) => {
			e && !Re && (Z.set(e, t, n), we.value = {
				...we.value,
				[N(e)]: {}
			}, xe.value++, ye());
		}, Fe = (e, t) => Pe(R.value, e, t), Ie = v(() => {
			let e = R.value;
			return {
				resource: e,
				profile: K?.selectionProfile || {},
				values: De.value,
				getValues: () => Z.get(e),
				setValue: (t, n) => Pe(e, t, n),
				refresh: () => z(),
				selectResource: (e) => window.SmartBrowserPicker.open(e)
			};
		}), Le = v(() => (K?.previewActions || []).filter((e) => {
			try {
				return R.value && (!e.applies || e.applies(Ie.value));
			} catch {
				return !1;
			}
		})), Re = !1;
		d(() => {
			Re = !0, ge.forEach((e) => e.destroy());
		});
		let ze = O.all(), Be = v(() => O.get(k.activeView)), Ve = v(() => ji(k.presentation, c.adapter)), He = v(() => Ve.value.filter((e) => e.id === "title" || e.id === "name" || (e.defaultVisible ? !k.hiddenColumns.includes(e.id) : k.shownColumns.includes(e.id)))), Ue = (e) => {
			let t = Ve.value.find((t) => t.id === e);
			if (!t || ["title", "name"].includes(e)) return;
			let n = t.defaultVisible ? "hiddenColumns" : "shownColumns";
			k[n] = k[n].includes(e) ? k[n].filter((t) => t !== e) : [...k[n], e];
		}, We = t(!1), Ge = t(!1), Ke = t(null), qe = v(() => c.adapter === "media"), Je = v(() => c.mode === "manage" && ["details", "grid"].includes(k.activeView) && k.presentation.orderingField && k.sortBy === k.presentation.orderingField && ["asc", "desc"].includes(k.sortDirection) && (c.adapter === "featured-articles" || String(k.filters.featured ?? "") !== "1")), Ye = v(() => Je.value && !k.busy && I.value.length > 0 && I.value.every((e) => e.capabilities?.reorder === !0)), Xe = async (e) => {
			if (!Ye.value || !["up", "down"].includes(e)) return;
			let t = I.value.map((e) => e.id), n = k.focusedId;
			k.busy = !0;
			try {
				let r = k.sortDirection === "desc" ? e === "up" ? "down" : "up" : e;
				(await D.execute("reorder", t, { direction: r })).updated?.length && (await z(), k.selectedIds = t.filter((e) => A.value.some((t) => t.id === e)), k.focusedId = k.selectedIds.includes(n) ? n : k.selectedIds[0] || null);
			} catch (e) {
				Joomla.renderMessages({ error: [e.message] });
			} finally {
				k.busy = !1;
			}
		}, Ze = c.adapter !== "featured-articles" && [
			"articles",
			"categories",
			"tags",
			"articles-by-tag",
			"menus",
			"users",
			"media"
		].includes(c.adapter.replace(/^flat-/, "")), Q = c.adapter.startsWith("flat-") || c.adapter === "featured-articles", Qe = Object.fromEntries(Object.entries(c.gridWidths || {}).map(([e, t]) => [`--sb-grid-${e}`, `${t}px`])), $e = Ti(c.adapter, c.browseRoot, window.location.href), et = (() => {
			try {
				return JSON.parse(window.sessionStorage.getItem($e) || "{}");
			} catch {
				return {};
			}
		})(), tt = t(et.filtersOpen === !0), nt = (e) => {
			et = {
				...et,
				filtersOpen: tt.value,
				...e
			}, window.sessionStorage.setItem($e, JSON.stringify(et));
		}, rt = () => {
			tt.value = !tt.value, nt({ filtersOpen: tt.value });
		}, it = () => {
			nt({ flat: !Q }), window.location.assign(Q ? Di(window.location.href, c.browseRoot) : Ei(window.location.href, c.adapter, k.selectedNode, c.browseRoot));
		}, at = v(() => c.adapters?.find((e) => e.id === c.adapter)?.icon || "fas fa-list"), ot = v(() => c.adapters?.find((e) => e.id === c.adapter)?.nodeOpenIcon || {
			media: "fas fa-folder-open",
			articles: "fas fa-box-open",
			"flat-articles": "fas fa-box-open",
			categories: "fas fa-box-open",
			tags: "fas fa-tags",
			"articles-by-tag": "fas fa-tags",
			users: "fas fa-users-viewfinder",
			menus: "fas fa-diagram-successor",
			"featured-articles": "fas fa-star"
		}[c.adapter] || "fas fa-folder-open"), st = [
			"sm",
			"md",
			"lg",
			"xl"
		], ct = async ({ selection: e, payload: t, resolve: n, reject: r }) => {
			try {
				let r = await D.execute("batch", e, t);
				if (r.download) {
					let e = atob(r.download.content), t = Uint8Array.from(e, (e) => e.charCodeAt(0)), n = URL.createObjectURL(new Blob([t], { type: "application/zip" })), i = document.createElement("a");
					i.href = n, i.download = r.download.name, i.click(), setTimeout(() => URL.revokeObjectURL(n), 6e4);
				}
				await z(), n(r);
			} catch (e) {
				r(e);
			}
		}, lt = async (e) => {
			if (Te.value || !e.length) return;
			Te.value = !0;
			let t = xe.value, n;
			try {
				n = await Z.validate(e);
			} finally {
				Te.value = !1;
			}
			if (Re || t !== xe.value) return;
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
			q && (r.collectionItems = e.map((e) => ({
				selection: F(e, c.adapter.replace(/^flat-/, "")),
				usage: n.usage[N(e)] || {}
			}))), K && (r.pickerInstance = c.pickerInstance, r.usage = n.usage), document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r })), window.parent !== window && window.parent.document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r }));
		}, ut = (e) => {
			let t = st.indexOf(k.viewOptions.gridSize);
			k.viewOptions.gridSize = st[Math.max(0, Math.min(st.length - 1, t + e))];
		}, dt = (e) => ie(e, c.mode, ue(e), fe, c.selectionTarget || "both"), ft = (e) => ne(e, c.mode, ue(e), fe), pt = (e) => G(e, c.mode, ue(e), fe, c.selectionTarget || "both"), mt = (e, t) => !k.busy && (e.local ? t.every((t) => dt(t)?.id === e.id || pt(t)?.id === e.id) : fe(e, t)), ht = (e) => {
			let t = dt(e);
			t && gt(t, e);
		}, gt = (e, t) => {
			if (e && t && mt(e, [t])) return e.id === "browseOpen" ? z(t.id) : e.id === "pickerSelect" ? q ? (k.selectedIds.includes(N(t)) || oe(t, !0), lt(I.value)) : lt([t]) : pe(e, [t]);
		}, _t = (e) => {
			if (K?.allowedAdapters?.length && !K.allowedAdapters.includes(e.replace(/^flat-/, "")) || e === c.adapter) return;
			ye();
			let t = new URL(window.location.href);
			t.searchParams.set("adapter", e), t.searchParams.delete("node"), t.searchParams.delete("browseRoot"), K?.initialBrowseRoot && e.replace(/^flat-/, "") === K.initialAdapter.replace(/^flat-/, "") && t.searchParams.set("browseRoot", K.initialBrowseRoot), t.searchParams.delete("initialResource"), t.searchParams.delete("flatScope"), window.location.href = t.toString();
		}, vt = async ({ id: e, value: t }) => {
			if (k.filters[e] = t, e === "menu" && t && !c.browseRoot && c.adapter === "menus") {
				await z(`menu:${t}`);
				return;
			}
			if (e === "menu" && t && !c.browseRoot && c.adapter === "flat-menus") {
				let e = new URL(window.location.href);
				e.searchParams.set("flatScope", `menu:${t}`), e.searchParams.set("flatFromNode", `menu:${t}`), window.location.assign(e.toString());
				return;
			}
			await z(k.selectedNode);
		}, yt = async () => {
			(k.presentation.filters || []).forEach((e) => {
				k.filters[e.id] = e.default ?? "";
			}), await z(k.selectedNode);
		}, bt = async (e) => {
			if (Q && e === k.selectedNode && e === k.roots[0]?.id) {
				k.search = "", k.sortBy = c.defaultSortBy || "", k.sortDirection = c.defaultSortDirection || "";
				let e = Oi(window.location.href, c.flatRootNode);
				if (e !== window.location.href) {
					(k.presentation.filters || []).forEach((e) => {
						k.filters[e.id] = e.default ?? "";
					}), await r(), window.location.assign(e);
					return;
				}
				await yt();
				return;
			}
			await z(e);
		}, xt = (e) => {
			k.sortBy === e ? k.sortDirection === "asc" ? k.sortDirection = "desc" : (k.sortBy = "", k.sortDirection = "") : (k.sortBy = e, k.sortDirection = "asc");
		}, St = (e) => {
			k.sortBy = e, k.sortDirection = e ? k.sortDirection || "asc" : "";
		}, Ct = () => {
			let e = [
				"modified",
				"created",
				"both"
			], t = e.indexOf(k.viewOptions.detailsDateMode);
			k.viewOptions.detailsDateMode = e[(t + 1) % e.length];
		}, wt = async (e) => {
			We.value = !1, qe.value && await E.uploadFiles(e.dataTransfer?.files);
		};
		return T(() => {
			if (Q && nt({ flat: !0 }), !Q && Ze && et.flat === !0) {
				window.location.replace(Ei(window.location.href, c.adapter, k.selectedNode, c.browseRoot));
				return;
			}
			z(k.selectedNode).then(async () => {
				if (q) {
					let e = K.getCollectionSnapshot();
					try {
						let t = await D.collection(e.items, {
							referenceItems: !0,
							homogeneous: K.homogeneous
						});
						if (Re) return;
						k.selectedResources = Object.fromEntries(t.resources.map((e) => [N(e), re(e)])), k.selectedIds = t.items.map((e) => P(e.selection)), k.focusedId = k.selectedIds.find((e) => A.value.some((t) => N(t) === e)) || k.selectedIds[0] || null;
					} catch (e) {
						Re || Joomla.renderMessages({ error: [e.message] });
					}
				}
				if (!q && K?.initialSelection?.length && (!K.initialAdapter || K.initialAdapter.replace(/^flat-/, "") === c.adapter.replace(/^flat-/, ""))) {
					let e = K.initialSelection.map((e) => e && typeof e == "object" ? e.id : e);
					try {
						let t = await D.collection(c.multiple ? e : e.slice(0, 1));
						if (Re) return;
						let n = new Set(c.allowedResourceTypes || []), r = t.resources.filter((e) => !e.unavailable && V(e, c.selectionTarget) && (!n.size || n.has(e.type)));
						k.selectedIds = r.map((e) => e.id), k.selectedResources = Object.fromEntries(r.map((e) => [e.id, e])), k.focusedId = k.selectedIds[0] || null;
					} catch (e) {
						Re || Joomla.renderMessages({ error: [e.message] });
					}
				}
				c.adapter === "media" && c.initialResource && A.value.some((e) => e.id === c.initialResource) && (k.focusedId = N(A.value.find((e) => e.id === c.initialResource)));
			});
		}), (e, t) => (w(), M("div", {
			class: "smartbrowser-shell",
			style: h(g(Qe))
		}, [
			g(k).busy ? (w(), M("div", Mi, [t[15] ||= j("span", {
				class: "spinner-border",
				"aria-hidden": "true"
			}, null, -1), j("span", null, _(J("COM_SMARTBROWSER_WORKING")), 1)])) : y("", !0),
			n(Me, {
				actions: g(k).actions,
				available: (e) => fe(e, g(I)),
				selection: g(I),
				"batch-available": g(c).mode === "manage",
				"can-cancel": typeof g(K)?.cancel == "function",
				"flat-available": g(Ze),
				"flat-active": g(Q),
				"filters-open": tt.value,
				filters: g(k).presentation.filters,
				"filter-values": g(k).filters,
				"manager-url": g(c).managerUrl,
				"manager-new-tab": g(c).application === "site",
				"dashboard-url": g(c).dashboardUrl,
				integrated: g(c).integrated,
				"selection-mode": g(c).mode === "select",
				"allow-no-user": g(c).allowNoUser,
				"can-complete": g(I).length > 0 && !Te.value,
				t: J,
				onAction: t[1] ||= (e) => pe(e, g(I)),
				onBatch: t[2] ||= (e) => Ke.value?.open(),
				onCancel: t[3] ||= (e) => g(K)?.cancel(),
				onToggleFlat: it,
				onToggleFilters: rt,
				onFilter: vt,
				onClearFilters: yt,
				onComplete: t[4] ||= (e) => lt(g(I)),
				onNoUser: t[5] ||= (e) => lt([{
					id: "user:0",
					type: "user",
					title: ""
				}])
			}, {
				"display-controls": s(() => [g(K)?.toggleSize ? (w(), M("button", {
					key: 0,
					type: "button",
					class: o(["resource-icon-button resource-display-toggle", { active: Se.value }]),
					"aria-pressed": Se.value,
					title: J(Se.value ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE"),
					"aria-label": J(Se.value ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE"),
					onClick: t[0] ||= (e) => Se.value = g(K).toggleSize()
				}, [j("span", {
					class: o(Se.value ? "fas fa-compress" : "fas fa-expand"),
					"aria-hidden": "true"
				}, null, 2)], 10, Ni)) : y("", !0), g(l) ? (w(), M("button", {
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
				}, null, 2)], 10, Pi)) : y("", !0)]),
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
				"can-complete"
			]),
			g(q) ? (w(), M("details", Fi, [j("summary", null, [
				t[16] ||= j("span", {
					class: "fas fa-chevron-right resource-picker-collection-chevron",
					"aria-hidden": "true"
				}, null, -1),
				p(_(J("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": ", 1),
				j("span", null, _(g(k).selectedIds.length), 1)
			]), g(me) ? (w(), ee(B, {
				key: 0,
				model: g(me),
				api: g(D),
				config: he,
				t: J
			}, null, 8, ["model", "api"])) : y("", !0)])) : y("", !0),
			n(vn, {
				ref_key: "batchDialog",
				ref: Ke,
				selection: g(I),
				adapter: g(c).adapter,
				filters: g(k).presentation.filters,
				"batch-options": g(k).presentation.batchOptions,
				"sort-fields": g(k).presentation.sortFields,
				"ordering-available": Je.value,
				t: J,
				onApply: ct
			}, null, 8, [
				"selection",
				"adapter",
				"filters",
				"batch-options",
				"sort-fields",
				"ordering-available"
			]),
			j("div", { class: o(["smartbrowser-layout", {
				"flat-mode": g(Q) && !g(q),
				"tree-collapsed": Ge.value
			}]) }, [
				(!g(Q) || g(q)) && !Ge.value ? (w(), ee(Ci, {
					key: 0,
					adapters: g(K)?.allowedAdapters?.length ? (g(c).adapters || []).filter((e) => g(K).allowedAdapters.includes(e.id.replace(/^flat-/, ""))) : g(c).adapters,
					"active-adapter": g(c).adapter,
					roots: g(k).roots,
					nodes: g(Q) ? [] : g(k).nodes,
					breadcrumb: g(k).breadcrumb,
					"selected-node": g(k).selectedNode,
					t: J,
					onOpen: g(z),
					onAdapter: _t
				}, null, 8, [
					"adapters",
					"active-adapter",
					"roots",
					"nodes",
					"breadcrumb",
					"selected-node",
					"onOpen"
				])) : y("", !0),
				!g(Q) || g(q) ? (w(), M("button", {
					key: 1,
					type: "button",
					class: "resource-sidebar-handle",
					title: J(Ge.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-label": J(Ge.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-expanded": !Ge.value,
					onClick: t[6] ||= (e) => Ge.value = !Ge.value
				}, [j("span", {
					class: o(Ge.value ? "fas fa-chevron-right" : "fas fa-chevron-left"),
					"aria-hidden": "true"
				}, null, 2)], 8, Ii)) : y("", !0),
				j("main", Li, [n(pi, {
					breadcrumb: g(k).breadcrumb,
					root: g(k).roots[0],
					"root-icon": ot.value,
					"icon-only-root": !g(Q) && g(k).breadcrumb.length > 1,
					search: g(k).search,
					"sort-by": g(k).sortBy,
					"sort-direction": g(k).sortDirection,
					"sort-fields": g(k).presentation.sortFields,
					"ordering-field": g(k).presentation.orderingField,
					views: g(ze),
					"active-view": g(k).activeView,
					"grid-size": g(k).viewOptions.gridSize,
					"details-thumbnails": g(k).viewOptions.detailsThumbnails,
					"details-date-mode": g(k).viewOptions.detailsDateMode,
					columns: Ve.value,
					"hidden-columns": g(k).hiddenColumns,
					"shown-columns": g(k).shownColumns,
					"show-info": je.value,
					multiple: g(c).multiple,
					"can-invert": g(c).multiple && g(te).length > 0,
					"reorder-visible": Je.value,
					"reorder-enabled": Ye.value,
					t: J,
					onOpen: bt,
					onInvertSelection: g(U),
					onReorder: Xe,
					onSearch: t[7] ||= (e) => g(k).search = e,
					onSortBy: St,
					onSortDirectionValue: t[8] ||= (e) => g(k).sortDirection = e,
					onResize: ut,
					onToggleThumbnails: t[9] ||= (e) => g(k).viewOptions.detailsThumbnails = !g(k).viewOptions.detailsThumbnails,
					onToggleDateField: Ct,
					onToggleColumn: Ue,
					onView: t[10] ||= (e) => g(k).activeView = e,
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
						"is-dragging": We.value,
						"info-open": je.value,
						"usage-open": Oe.value
					}]),
					onDragenter: t[12] ||= C((e) => We.value = qe.value, ["prevent"]),
					onDragover: t[13] ||= C(() => {}, ["prevent"]),
					onDragleave: t[14] ||= C((e) => We.value = !1, ["self"]),
					onDrop: C(wt, ["prevent"])
				}, [
					g(k).loading ? (w(), M("div", Ri, [...t[17] ||= [j("span", {
						class: "spinner-border",
						"aria-hidden": "true"
					}, null, -1)]])) : g(A).length ? (w(), ee(f(Be.value.component), {
						key: 2,
						resources: g(A),
						"selected-ids": g(k).selectedIds,
						"focused-id": g(k).focusedId,
						"all-selected": g(te).length > 0 && g(te).every((e) => g(k).selectedIds.includes(g(N)(e))),
						options: g(k).viewOptions,
						"selection-controls": g(c).mode !== "select" || g(c).multiple,
						actions: g(k).actions,
						"action-available": mt,
						"default-action": dt,
						"preview-action": ft,
						"modified-action": pt,
						"sort-by": g(k).sortBy,
						"sort-direction": g(k).sortDirection,
						"sort-fields": g(k).presentation.sortFields,
						"ordering-field": g(k).presentation.orderingField,
						columns: He.value,
						"grid-fields": g(k).presentation.gridFields,
						t: J,
						onSelect: g(oe),
						onFocus: g(ae),
						onSelectAll: g(H),
						onOpen: g(z),
						onActivate: ht,
						onAction: gt,
						onSort: xt
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
					])) : (w(), M("div", zi, [j("span", {
						class: o(g(k).search ? "fas fa-search" : qe.value ? "fas fa-cloud-upload-alt" : at.value),
						"aria-hidden": "true"
					}, null, 2), j("p", null, _(g(k).search ? J("COM_SMARTBROWSER_NO_RESULTS") : qe.value ? J("COM_SMARTBROWSER_DROP_UPLOAD") : J("COM_SMARTBROWSER_EMPTY_STATE")), 1)])),
					qe.value && We.value ? (w(), M("div", Bi, [t[18] ||= j("span", { class: "fas fa-cloud-upload-alt" }, null, -1), p(_(J("COM_SMARTBROWSER_DROP_UPLOAD")), 1)])) : y("", !0),
					je.value ? (w(), ee(kr, {
						key: 4,
						resource: g(R),
						fields: g(R)?.collectionPresentation?.infoFields || g(k).presentation.infoFields,
						t: J,
						"usage-definitions": Ee.value,
						"usage-values": De.value,
						"usage-errors": we.value[g(N)(g(R))] || {},
						"usage-editors": g(K)?.editors,
						"resolve-reference": _e,
						"usage-revision": Ce.value,
						"preview-actions": Le.value,
						"preview-context": Ie.value,
						"can-preview": !!ft(g(R)) && le(g(R)).canPreview(g(R)) && !g(k).busy,
						onPreview: t[11] ||= (e) => gt(ft(g(R)), g(R)),
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
}, Hi = class {
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
}, Ui = "supjx.smartbrowser.preferencesResetToken";
function Wi(e, t) {
	if (!t || e.getItem(Ui) === t) return !1;
	let n = [];
	for (let t = 0; t < e.length; t++) {
		let r = e.key(t);
		r?.startsWith("supjx.smartbrowser.") && r !== Ui && r !== "supjx.smartbrowser.editorReturn" && n.push(r);
	}
	return n.forEach((t) => e.removeItem(t)), e.setItem(Ui, t), !0;
}
//#endregion
//#region resources/js/core/resetSessionNavigation.js
var Gi = "supjx.smartbrowser.";
function Ki(e, t, n) {
	if (!n) return !1;
	let r = `${Gi}session.${t}`, i = e.getItem(r);
	if (e.setItem(r, n), !i || i === n) return !1;
	for (let t = 0; t < e.length; t++) {
		let n = e.key(t);
		if (!(!n?.startsWith(Gi) || n.startsWith(`${Gi}ui.`) || n.startsWith(`${Gi}session.`))) try {
			let t = JSON.parse(e.getItem(n));
			if (!t || typeof t != "object" || Array.isArray(t) || !("selectedNode" in t) && !("filters" in t)) continue;
			delete t.selectedNode, delete t.filters, e.setItem(n, JSON.stringify(t));
		} catch {}
	}
	return !0;
}
function qi(e) {
	let t = new URL(e);
	if (t.searchParams.delete("node"), t.searchParams.has("flatFromAdapter")) {
		let e = t.searchParams.get("flatFromBrowseRoot");
		e ? t.searchParams.set("browseRoot", e) : t.searchParams.delete("browseRoot"), t.searchParams.delete("flatScope"), t.searchParams.delete("flatFromNode"), t.searchParams.delete("flatFromBrowseRoot"), t.searchParams.delete("flatFromAdapter");
	}
	return t.toString();
}
//#endregion
//#region resources/js/main.js
var $ = Joomla.getOptions("com_smartbrowser", {}), Ji = null;
try {
	Ji = window.parent !== window && $.pickerInstance ? window.parent.SmartBrowserPicker?.context($.pickerInstance, window) : null;
} catch {}
$.pickerContext = Ji, Wi(window.sessionStorage, $.preferencesResetToken);
var Yi = Ki(window.sessionStorage, $.application, $.csrfToken) ? qi(window.location.href) : window.location.href;
if (Yi !== window.location.href) window.location.replace(Yi);
else {
	let e = new L($), t = $.browseRoot ? `supjx.smartbrowser.${$.adapter}.${$.browseRoot}` : `supjx.smartbrowser.${$.adapter}`, n = new Hi(window.sessionStorage, t), r = oe().register({
		id: "grid",
		label: "COM_SMARTBROWSER_GRID",
		icon: "fas fa-th",
		component: R,
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
	}, E(Vi).provide("browser", i).provide("resourceApi", e).provide("smartBrowserOptions", $).provide("viewRegistry", r).provide("actionDriver", a).mount("#smartbrowser-app");
}
//#endregion
