import { A as e, B as t, C as n, D as r, E as i, F as a, H as o, I as s, L as c, M as l, N as u, O as d, P as f, S as p, T as m, U as h, V as g, W as _, _ as v, b as y, d as b, f as x, g as S, h as C, j as w, k as T, l as E, m as D, p as O, t as k, u as A, v as j, x as M, y as N, z as P } from "./visual-runtime-BsRY_8Qs.js";
import { a as F, c as I, d as L, i as R, l as z, n as ee, o as B, r as te, s as ne, t as re, u as V } from "./visual-runtime-IfXUj9it.js";
//#region resources/js/core/displayMode.js
var H = [
	"normal",
	"wide",
	"focus"
], ie = "smartbrowser.displayMode";
function ae(e, t = () => {}) {
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
		if (!H.includes(r)) return;
		let u = n;
		if (c(), n = r, t(n), l) try {
			o?.setItem(ie, n);
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
		let e = o?.getItem(ie);
		H.includes(e) && e !== "normal" && l(e, !1);
	} catch {}
	return {
		get mode() {
			return n;
		},
		set: l,
		cycle: () => l(H[(H.indexOf(n) + 1) % 3]),
		destroy() {
			l("normal", !1), a.removeEventListener("keydown", u);
		}
	};
}
//#endregion
//#region resources/js/components/ResourceActions.vue
var U = { class: "resource-actions-area" }, W = [
	"href",
	"title",
	"aria-label"
], G = { class: "resource-action-label" }, K = [
	"disabled",
	"title",
	"aria-label"
], oe = { class: "resource-action-label" }, se = ["title", "aria-label"], ce = { class: "resource-action-label" }, q = [
	"title",
	"aria-label",
	"disabled",
	"onClick"
], le = {
	key: 0,
	class: "resource-action-label"
}, ue = [
	"aria-expanded",
	"title",
	"aria-label"
], de = { class: "resource-action-label" }, fe = {
	key: 0,
	class: "resource-action-menu",
	role: "menu"
}, pe = ["disabled", "onClick"], me = [
	"disabled",
	"title",
	"aria-label"
], J = { class: "resource-action-label" }, he = {
	key: 5,
	class: "resource-filter-buttons"
}, ge = [
	"aria-expanded",
	"title",
	"aria-label"
], _e = { class: "resource-action-label" }, ve = {
	key: 0,
	class: "badge bg-primary"
}, ye = ["disabled", "title"], be = [
	"title",
	"aria-label",
	"aria-pressed"
], xe = [
	"href",
	"target",
	"rel",
	"title",
	"aria-label"
], Se = {
	key: 0,
	class: "resource-action-filters"
}, Ce = ["value", "onChange"], Y = ["value"], we = {
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
		}), (e, t) => (w(), M("div", U, [j("div", {
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
				j("span", G, _(n.t(n.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD")), 1)
			], 8, W)) : y("", !0),
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
				j("span", oe, _(n.t("COM_SMARTBROWSER_SELECT")), 1)
			], 8, K)) : y("", !0),
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
				j("span", ce, _(n.t("JOPTION_NO_USER")), 1)
			], 8, se)) : y("", !0),
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
			}, null, 2), t.creationRole === "contextual" ? y("", !0) : (w(), M("span", le, _(n.t(t.label)), 1))], 10, q))), 128)),
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
				j("span", de, _(n.t("COM_SMARTBROWSER_ACTIONS")), 1),
				t[15] ||= p(),
				t[16] ||= j("span", {
					class: "fas fa-angle-down",
					"aria-hidden": "true"
				}, null, -1)
			], 8, ue), i.value ? (w(), M("div", fe, [(w(!0), M(S, null, l(O.value, (t) => (w(), M("div", {
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
			}, null, 2), p(" " + _(n.t(t.label)), 1)], 10, pe)]))), 128))])) : y("", !0)], 512)) : y("", !0),
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
				j("span", J, _(n.t("COM_SMARTBROWSER_BATCH")), 1)
			], 8, me)) : y("", !0),
			n.filters?.length ? (w(), M("div", he, [j("button", {
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
				j("span", _e, _(n.t("COM_SMARTBROWSER_FILTER_OPTIONS")), 1),
				b.value ? (w(), M("span", ve, _(b.value), 1)) : y("", !0),
				j("span", {
					class: o(["fas fa-angle-down resource-filter-caret", { open: n.filtersOpen }]),
					"aria-hidden": "true"
				}, null, 2)
			], 10, ge), j("button", {
				type: "button",
				class: "btn resource-filter-clear",
				disabled: !b.value,
				title: n.t("JCLEAR"),
				onClick: t[5] ||= (t) => e.$emit("clear-filters")
			}, _(n.t("JCLEAR")), 9, ye)])) : y("", !0),
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
			}, null, -1)]], 10, be)) : y("", !0),
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
			}, null, -1)]], 8, xe)) : y("", !0),
			u(e.$slots, "display-controls")
		], 512), n.filters?.length && n.filtersOpen ? (w(), M("div", Se, [(w(!0), M(S, null, l(n.filters, (t) => (w(), M("label", { key: t.id }, [j("span", null, _(n.t(t.label)), 1), t.type === "select" ? (w(), M("select", {
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
		}, _(x(t, e)), 9, Y))), 128))], 40, Ce)) : y("", !0)]))), 128))])) : y("", !0)]));
	}
}, Te = ["placeholder"], Ee = ["multiple"], De = ["selected"], Oe = ["value", "selected"], X = {
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
		}, _(e.t(e.placeholder)), 9, De)), (w(!0), M(S, null, l(u.value, (t) => (w(), M("option", {
			key: t.value,
			value: String(t.value),
			selected: p(t.value)
		}, _(e.t(t.label)), 9, Oe))), 128))], 40, Ee)], 10, Te));
	}
}, ke = { class: "resource-batch-field" }, Z = ["aria-label"], Ae = ["aria-pressed", "onClick"], je = {
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
		return (n, r) => (w(), M("div", ke, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), j("div", {
			class: "btn-group resource-batch-mode-toggle",
			role: "group",
			"aria-label": e.t("COM_SMARTBROWSER_BATCH_MODE")
		}, [(w(), M(S, null, l(t, (t) => j("button", {
			key: t.value,
			type: "button",
			class: o(["btn", e.modelValue === t.value ? "is-active" : ""]),
			"aria-pressed": e.modelValue === t.value,
			onClick: (e) => n.$emit("update:modelValue", t.value)
		}, _(e.t(t.label)), 11, Ae)), 64))], 8, Z)]));
	}
}, Me = ["aria-label"], Ne = { class: "resource-batch-body" }, Pe = {
	class: "resource-batch-heading",
	role: "heading",
	"aria-level": "3"
}, Fe = ["open"], Ie = { class: "resource-batch-fields" }, Le = ["aria-label"], Re = {
	key: 1,
	class: "text-danger"
}, ze = ["open"], Q = { class: "resource-batch-fields" }, Be = ["disabled"], Ve = { class: "resource-batch-check" }, He = { key: 0 }, Ue = ["open"], We = { class: "resource-batch-fields" }, Ge = { class: "input-group" }, Ke = ["open"], qe = ["onClick"], Je = { class: "resource-batch-fields" }, Ye = ["onUpdate:modelValue", "aria-label"], Xe = { value: "" }, Ze = ["value"], Qe = ["open"], $e = {
	key: 0,
	class: "resource-batch-fields"
}, et = { class: "resource-batch-field" }, tt = { class: "resource-batch-field" }, nt = ["open"], rt = {
	key: 0,
	class: "resource-batch-fields"
}, it = ["open"], at = ["onClick"], ot = {
	key: 0,
	class: "resource-batch-fields"
}, st = ["onUpdate:modelValue", "aria-label"], ct = { value: "" }, lt = ["value"], ut = ["open"], dt = {
	key: 0,
	class: "resource-batch-fields"
}, ft = { class: "resource-batch-field" }, pt = { class: "resource-batch-field" }, mt = ["open"], ht = {
	key: 0,
	class: "resource-batch-fields"
}, gt = ["open"], _t = ["open"], vt = {
	key: 0,
	class: "resource-batch-fields"
}, yt = ["open"], bt = {
	key: 0,
	class: "resource-batch-fields"
}, xt = { value: "add" }, St = { value: "remove" }, Ct = { value: "set" }, wt = ["open"], Tt = {
	key: 0,
	class: "resource-batch-fields"
}, Et = { value: "yes" }, Dt = { value: "no" }, Ot = { class: "resource-batch-bottom" }, kt = { class: "resource-batch-preview" }, At = {
	class: "resource-batch-preview-heading",
	role: "heading",
	"aria-level": "3"
}, jt = {
	key: 0,
	class: "resource-batch-summary"
}, Mt = {
	key: 0,
	class: "fas fa-arrow-right resource-batch-sequence-arrow",
	"aria-hidden": "true"
}, Nt = { class: "resource-batch-summary-step" }, Pt = {
	class: "resource-batch-summary-step-heading",
	role: "heading",
	"aria-level": "4"
}, Ft = {
	key: 0,
	class: "resource-batch-summary-params"
}, It = {
	key: 1,
	class: "resource-batch-no-changes"
}, Lt = { class: "resource-batch-footer" }, Rt = { class: "resource-batch-footer-actions" }, zt = ["disabled"], Bt = ["aria-label"], Vt = { class: "resource-batch-preview-dialog-head" }, Ht = ["aria-label"], Ut = { class: "resource-batch-preview-list" }, Wt = ["title"], Gt = ["title"], Kt = ["aria-label"], qt = { class: "resource-batch-preview-dialog-head" }, Jt = ["aria-label"], Yt = { class: "resource-batch-selected-list" }, Xt = {
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
		let a = e, s = i, u = m("resourceApi"), d = t(!1), f = t([]), h = t(!1), E = t(""), D = 0, O = t(null), k = t(null), F = t(null), I = v(() => a.adapter.replace(/^flat-/, "")), L = v(() => I.value === "media"), R = v(() => ["articles", "articles-by-tag"].includes(I.value)), z = v(() => I.value === "categories"), ee = v(() => I.value === "tags"), B = v(() => I.value === "menus"), te = v(() => I.value === "users"), ne = v(() => ({
			articles: "article:",
			"articles-by-tag": "article:",
			categories: "category:",
			tags: "tag:",
			menus: "menu-item:",
			users: "user:"
		})[I.value]), re = v(() => ne.value ? a.selection.filter((e) => e.id.startsWith(ne.value)) : a.selection), V = {
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
		}, H = {
			changeLanguage: !1,
			language: "",
			changeAccess: !1,
			access: "",
			tagsOpen: !1,
			tagAdd: [],
			tagRemove: [],
			placement: "none",
			category: ""
		}, ie = {
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
		}, ae = {
			groupOpen: !1,
			groupAction: "add",
			group: "",
			resetOpen: !1,
			reset: "yes"
		}, U = P({ ...V }), W = P({ ...H }), G = P({ ...ie }), K = P({ ...ae }), oe = [{
			id: "language",
			enabled: "changeLanguage",
			label: "COM_SMARTBROWSER_BATCH_SET_LANGUAGE",
			placeholder: "COM_SMARTBROWSER_SELECT_LANGUAGE"
		}, {
			id: "access",
			enabled: "changeAccess",
			label: "COM_SMARTBROWSER_BATCH_SET_ACCESS",
			placeholder: "COM_SMARTBROWSER_SELECT_ACCESS"
		}], se = oe, ce = v(() => JSON.stringify(U) !== JSON.stringify(V) || JSON.stringify(W) !== JSON.stringify(H) || JSON.stringify(G) !== JSON.stringify(ie) || JSON.stringify(K) !== JSON.stringify(ae)), q = (e) => (a.batchOptions[e] || a.filters.find((t) => t.id === e)?.options || []).filter((e) => String(e.value) !== ""), le = v(() => (a.batchOptions.menu || []).flatMap((e) => [{
			value: `${e.value}.0`,
			label: e.label
		}, ...(a.batchOptions.menuParent || []).filter((t) => t.menu === e.value).map((t) => ({
			value: `${e.value}.${t.value}`,
			label: `- ${t.label}`
		}))])), ue = v(() => U.zipName.trim().replace(/\.zip$/i, "")), de = (e) => {
			W.tagAdd = e, W.tagRemove = W.tagRemove.filter((t) => !e.includes(t));
		}, fe = (e) => {
			W.tagRemove = e, W.tagAdd = W.tagAdd.filter((t) => !e.includes(t));
		}, pe = (e) => {
			G.tagAdd = e, G.tagRemove = G.tagRemove.filter((t) => !e.includes(t));
		}, me = (e) => {
			G.tagRemove = e, G.tagAdd = G.tagAdd.filter((t) => !e.includes(t));
		}, J = (e, t) => a.t(q(e).find((e) => String(e.value) === String(t))?.label || t), he = v(() => {
			let e = [];
			if (L.value) U.placement !== "none" && e.push({
				id: "placement",
				title: a.t(U.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
				parameters: [f.value.find((e) => e.value === U.destination)?.path || "..."]
			}), U.rename && e.push({
				id: "rename",
				title: a.t("COM_SMARTBROWSER_BATCH_RENAME"),
				parameters: [
					...U.find ? [`${a.t("COM_SMARTBROWSER_BATCH_FIND")}: ${U.find} → ${U.replace}`] : [],
					...U.prefix ? [`${a.t("COM_SMARTBROWSER_BATCH_PREFIX")}: ${U.prefix}`] : [],
					...U.suffix ? [`${a.t("COM_SMARTBROWSER_BATCH_SUFFIX")}: ${U.suffix}`] : [],
					...U.number ? [`${a.t("COM_SMARTBROWSER_BATCH_NUMBER")}: ${U.startAt}`] : []
				],
				preview: !0
			}), U.zip && e.push({
				id: "zip",
				title: a.t("COM_SMARTBROWSER_BATCH_ZIP"),
				parameters: [`${ue.value}.zip`]
			});
			else if (R.value) {
				for (let t of oe) W[t.enabled] && W[t.id] && e.push({
					id: t.id,
					title: a.t(t.label),
					parameters: [J(t.id, W[t.id])]
				});
				W.tagsOpen && W.tagAdd.length && e.push({
					id: "tag-add",
					title: a.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: W.tagAdd.map((e) => J("tag", e))
				}), W.tagsOpen && W.tagRemove.length && e.push({
					id: "tag-remove",
					title: a.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: W.tagRemove.map((e) => J("tag", e))
				}), W.placement !== "none" && e.unshift({
					id: "placement",
					title: a.t(W.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [W.category ? J("category", W.category) : "..."]
				});
			} else if (z.value || ee.value || B.value) {
				for (let t of se) G[t.enabled] && G[t.id] && e.push({
					id: t.id,
					title: a.t(t.label),
					parameters: [J(t.id, G[t.id])]
				});
				z.value && (G.tagsOpen && G.tagAdd.length && e.push({
					id: "tag-add",
					title: a.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: G.tagAdd.map((e) => J("tag", e))
				}), G.tagsOpen && G.tagRemove.length && e.push({
					id: "tag-remove",
					title: a.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: G.tagRemove.map((e) => J("tag", e))
				}), G.placement !== "none" && e.unshift({
					id: "placement",
					title: a.t(G.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [G.category ? J("category", G.category) : "..."]
				}), G.flipOrdering && e.push({
					id: "flip",
					title: a.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING"),
					parameters: []
				})), B.value && G.placement !== "none" && e.unshift({
					id: "placement",
					title: a.t(G.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [le.value.find((e) => e.value === G.menuDestination)?.label || "..."]
				});
			} else te.value && (K.groupOpen && K.group && e.push({
				id: "group",
				title: a.t({
					add: "COM_SMARTBROWSER_BATCH_GROUP_ADD",
					remove: "COM_SMARTBROWSER_BATCH_GROUP_REMOVE",
					set: "COM_SMARTBROWSER_BATCH_GROUP_SET"
				}[K.groupAction]),
				parameters: [J("group", K.group)]
			}), K.resetOpen && e.push({
				id: "reset",
				title: a.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET"),
				parameters: [a.t(K.reset === "yes" ? "JYES" : "JNO")]
			}));
			return e;
		}), ge = v(() => !(!re.value.length || !he.value.length || L.value && U.placement !== "none" && !f.value.some((e) => e.value === U.destination) || R.value && W.placement !== "none" && !W.category || z.value && G.placement !== "none" && !G.category || B.value && G.placement !== "none" && !le.value.some((e) => e.value === G.menuDestination) || L.value && U.zip && !ue.value)), _e = () => {
			if (L.value) return {
				...U,
				zipName: ue.value
			};
			if (R.value) return {
				language: W.changeLanguage ? W.language : "",
				access: W.changeAccess ? W.access : "",
				tagAdd: W.tagsOpen ? W.tagAdd : [],
				tagRemove: W.tagsOpen ? W.tagRemove : [],
				placement: W.placement,
				category: W.category
			};
			if (te.value) return {
				group: K.groupOpen ? K.group : "",
				groupAction: K.groupAction === "remove" ? "del" : K.groupAction,
				reset: K.resetOpen ? K.reset : ""
			};
			let e = G.menuDestination.lastIndexOf(".");
			return {
				language: G.changeLanguage ? G.language : "",
				access: G.changeAccess ? G.access : "",
				tagAdd: z.value && G.tagsOpen ? G.tagAdd : [],
				tagRemove: z.value && G.tagsOpen ? G.tagRemove : [],
				placement: G.placement,
				category: G.category,
				flipOrdering: z.value && G.flipOrdering,
				menu: B.value && e >= 0 ? G.menuDestination.slice(0, e) : "",
				menuParent: B.value && e >= 0 ? G.menuDestination.slice(e + 1) : "0"
			};
		}, ve = async () => {
			if (!d.value && ge.value) {
				d.value = !0;
				try {
					await new Promise((e, t) => s("apply", {
						selection: re.value.map((e) => e.id),
						payload: _e(),
						resolve: e,
						reject: t
					})), Ee();
				} catch (e) {
					window.Joomla?.renderMessages?.({ error: [e.message || String(e)] });
				} finally {
					d.value = !1;
				}
			}
		}, ye = (e, t) => {
			if (!U.rename) return e.title;
			let n = e.kind === "item" ? e.title.lastIndexOf(".") : -1, r = n > 0 ? e.title.slice(0, n) : e.title, i = n > 0 ? e.title.slice(n) : "", a = U.find ? r.split(U.find).join(U.replace) : r, o = U.number ? `-${String(Math.max(1, Number(U.startAt) || 1) + t).padStart(2, "0")}` : "";
			return `${U.prefix}${a}${U.suffix}${o}${i}`;
		}, be = v(() => re.value.map((e, t) => {
			let n = e.id.includes(":") ? e.id.slice(e.id.indexOf(":") + 1) : e.title, r = U.placement !== "none" && U.destination ? `${U.destination.slice(U.destination.indexOf(":") + 1).replace(/\/$/, "")}/` : n.slice(0, n.lastIndexOf("/") + 1);
			return {
				id: e.id,
				before: n,
				after: r + ye(e, t)
			};
		})), xe = async () => {
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
		}, Se = () => {
			Object.assign(U, V), Object.assign(W, H), Object.assign(G, ie), Object.assign(K, ae), f.value = [], O.value?.showModal(), L.value && xe();
		}, Ce = () => k.value?.showModal(), Y = () => {
			k.value?.open && k.value.close();
		}, we = () => F.value?.showModal(), Te = () => {
			F.value?.open && F.value.close();
		}, Ee = () => {
			D++, Y(), Te(), O.value?.close();
		};
		return r({
			open: Se,
			close: Ee
		}), T(() => {
			window.SmartBrowserDialogDismiss.install(O.value, () => ce.value), window.SmartBrowserDialogDismiss.install(k.value), window.SmartBrowserDialogDismiss.install(F.value), O.value.addEventListener("close", () => {
				Y(), Te();
			});
		}), (t, r) => (w(), M(S, null, [
			j("dialog", {
				ref_key: "dialog",
				ref: O,
				class: "resource-batch-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_BATCH_ACTIONS")
			}, [j("div", Ne, [j("div", Pe, _(e.t("COM_SMARTBROWSER_BATCH_SELECT_ACTIONS")), 1), L.value ? (w(), M(S, { key: 0 }, [
				j("details", {
					class: "resource-batch-step",
					open: U.placement !== "none"
				}, [j("summary", { onClick: r[0] ||= C((e) => U.placement = U.placement === "none" ? "move" : "none", ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_PLACEMENT")), 1), j("div", Ie, [n(je, {
					modelValue: U.placement,
					"onUpdate:modelValue": r[1] ||= (e) => U.placement = e,
					t: e.t
				}, null, 8, ["modelValue", "t"]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_DESTINATION_FOLDER")) + " ", 1), h.value ? (w(), M("span", {
					key: 0,
					class: "spinner-border spinner-border-sm",
					role: "status",
					"aria-label": e.t("COM_SMARTBROWSER_LOADING_FOLDERS")
				}, null, 8, Le)) : E.value ? (w(), M("span", Re, _(E.value), 1)) : (w(), N(X, {
					key: 2,
					modelValue: U.destination,
					"onUpdate:modelValue": r[2] ||= (e) => U.destination = e,
					options: f.value,
					placeholder: "COM_SMARTBROWSER_SELECT_FOLDER",
					t: e.t
				}, null, 8, [
					"modelValue",
					"options",
					"t"
				]))])])], 8, Fe),
				j("details", {
					class: "resource-batch-step",
					open: U.rename
				}, [j("summary", { onClick: r[3] ||= C((e) => U.rename = !U.rename, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_RENAME")), 1), j("div", Q, [
					j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_FIND")), 1), c(j("input", {
						"onUpdate:modelValue": r[4] ||= (e) => U.find = e,
						type: "text",
						class: "form-control"
					}, null, 512), [[x, U.find]])]),
					j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_REPLACE")), 1), c(j("input", {
						"onUpdate:modelValue": r[5] ||= (e) => U.replace = e,
						type: "text",
						class: "form-control",
						disabled: !U.find
					}, null, 8, Be), [[x, U.replace]])]),
					j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_PREFIX")), 1), c(j("input", {
						"onUpdate:modelValue": r[6] ||= (e) => U.prefix = e,
						type: "text",
						class: "form-control"
					}, null, 512), [[x, U.prefix]])]),
					j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_SUFFIX")), 1), c(j("input", {
						"onUpdate:modelValue": r[7] ||= (e) => U.suffix = e,
						type: "text",
						class: "form-control"
					}, null, 512), [[x, U.suffix]])]),
					j("label", Ve, [c(j("input", {
						"onUpdate:modelValue": r[8] ||= (e) => U.number = e,
						type: "checkbox",
						class: "form-check-input"
					}, null, 512), [[A, U.number]]), p(" " + _(e.t("COM_SMARTBROWSER_BATCH_NUMBER")), 1)]),
					U.number ? (w(), M("label", He, [p(_(e.t("COM_SMARTBROWSER_BATCH_START_AT")), 1), c(j("input", {
						"onUpdate:modelValue": r[9] ||= (e) => U.startAt = e,
						type: "number",
						min: "1",
						class: "form-control"
					}, null, 512), [[
						x,
						U.startAt,
						void 0,
						{ number: !0 }
					]])])) : y("", !0)
				])], 8, ze),
				j("details", {
					class: "resource-batch-step",
					open: U.zip
				}, [j("summary", { onClick: r[10] ||= C((e) => U.zip = !U.zip, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_ZIP")), 1), j("div", We, [j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_ZIP_NAME")), 1), j("span", Ge, [c(j("input", {
					"onUpdate:modelValue": r[11] ||= (e) => U.zipName = e,
					type: "text",
					class: "form-control",
					onBlur: r[12] ||= (e) => U.zipName = ue.value
				}, null, 544), [[x, U.zipName]]), r[30] ||= j("span", { class: "input-group-text" }, ".zip", -1)])])])], 8, Ue)
			], 64)) : R.value ? (w(), M(S, { key: 1 }, [
				(w(), M(S, null, l(oe, (t) => j("details", {
					key: t.id,
					class: "resource-batch-step",
					open: W[t.enabled]
				}, [j("summary", { onClick: C((e) => W[t.enabled] = !W[t.enabled], ["prevent"]) }, _(e.t(t.label)), 9, qe), j("div", Je, [c(j("select", {
					"onUpdate:modelValue": (e) => W[t.id] = e,
					class: "form-select",
					"aria-label": e.t(t.label)
				}, [j("option", Xe, _(e.t(t.placeholder)), 1), (w(!0), M(S, null, l(q(t.id), (t) => (w(), M("option", {
					key: t.value,
					value: t.value
				}, _(e.t(t.label)), 9, Ze))), 128))], 8, Ye), [[b, W[t.id]]])])], 8, Ke)), 64)),
				j("details", {
					class: "resource-batch-step",
					open: W.tagsOpen
				}, [j("summary", { onClick: r[13] ||= C((e) => W.tagsOpen = !W.tagsOpen, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), W.tagsOpen ? (w(), M("div", $e, [j("div", et, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), n(X, {
					"model-value": W.tagAdd,
					options: q("tag"),
					multiple: "",
					placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
					t: e.t,
					"onUpdate:modelValue": de
				}, null, 8, [
					"model-value",
					"options",
					"t"
				])]), j("div", tt, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), n(X, {
					"model-value": W.tagRemove,
					options: q("tag"),
					multiple: "",
					placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
					t: e.t,
					"onUpdate:modelValue": fe
				}, null, 8, [
					"model-value",
					"options",
					"t"
				])])])) : y("", !0)], 8, Qe),
				j("details", {
					class: "resource-batch-step",
					open: W.placement !== "none"
				}, [j("summary", { onClick: r[14] ||= C((e) => W.placement = W.placement === "none" ? "move" : "none", ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), W.placement === "none" ? y("", !0) : (w(), M("div", rt, [n(je, {
					modelValue: W.placement,
					"onUpdate:modelValue": r[15] ||= (e) => W.placement = e,
					t: e.t
				}, null, 8, ["modelValue", "t"]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_CATEGORY")), 1), n(X, {
					modelValue: W.category,
					"onUpdate:modelValue": r[16] ||= (e) => W.category = e,
					options: q("category"),
					placeholder: "COM_SMARTBROWSER_SELECT_CATEGORY",
					t: e.t
				}, null, 8, [
					"modelValue",
					"options",
					"t"
				])])]))], 8, nt)
			], 64)) : z.value || ee.value || B.value ? (w(), M(S, { key: 2 }, [
				(w(!0), M(S, null, l(g(se), (t) => (w(), M("details", {
					key: t.id,
					class: "resource-batch-step",
					open: G[t.enabled]
				}, [j("summary", { onClick: C((e) => G[t.enabled] = !G[t.enabled], ["prevent"]) }, _(e.t(t.label)), 9, at), G[t.enabled] ? (w(), M("div", ot, [c(j("select", {
					"onUpdate:modelValue": (e) => G[t.id] = e,
					class: "form-select",
					"aria-label": e.t(t.label)
				}, [j("option", ct, _(e.t(t.placeholder)), 1), (w(!0), M(S, null, l(q(t.id), (t) => (w(), M("option", {
					key: t.value,
					value: t.value
				}, _(e.t(t.label)), 9, lt))), 128))], 8, st), [[b, G[t.id]]])])) : y("", !0)], 8, it))), 128)),
				z.value ? (w(), M("details", {
					key: 0,
					class: "resource-batch-step",
					open: G.tagsOpen
				}, [j("summary", { onClick: r[17] ||= C((e) => G.tagsOpen = !G.tagsOpen, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), G.tagsOpen ? (w(), M("div", dt, [j("div", ft, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), n(X, {
					"model-value": G.tagAdd,
					options: q("tag"),
					multiple: "",
					placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
					t: e.t,
					"onUpdate:modelValue": pe
				}, null, 8, [
					"model-value",
					"options",
					"t"
				])]), j("div", pt, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), n(X, {
					"model-value": G.tagRemove,
					options: q("tag"),
					multiple: "",
					placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
					t: e.t,
					"onUpdate:modelValue": me
				}, null, 8, [
					"model-value",
					"options",
					"t"
				])])])) : y("", !0)], 8, ut)) : y("", !0),
				z.value ? (w(), M("details", {
					key: 1,
					class: "resource-batch-step",
					open: G.placement !== "none"
				}, [j("summary", { onClick: r[18] ||= C((e) => G.placement = G.placement === "none" ? "move" : "none", ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), G.placement === "none" ? y("", !0) : (w(), M("div", ht, [n(je, {
					modelValue: G.placement,
					"onUpdate:modelValue": r[19] ||= (e) => G.placement = e,
					t: e.t
				}, null, 8, ["modelValue", "t"]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_PARENT_CATEGORY")), 1), n(X, {
					modelValue: G.category,
					"onUpdate:modelValue": r[20] ||= (e) => G.category = e,
					options: q("category"),
					placeholder: "COM_SMARTBROWSER_SELECT_CATEGORY",
					t: e.t
				}, null, 8, [
					"modelValue",
					"options",
					"t"
				])])]))], 8, mt)) : y("", !0),
				z.value ? (w(), M("details", {
					key: 2,
					class: "resource-batch-step",
					open: G.flipOrdering
				}, [j("summary", { onClick: r[21] ||= C((e) => G.flipOrdering = !G.flipOrdering, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING")), 1)], 8, gt)) : y("", !0),
				B.value ? (w(), M("details", {
					key: 3,
					class: "resource-batch-step",
					open: G.placement !== "none"
				}, [j("summary", { onClick: r[22] ||= C((e) => G.placement = G.placement === "none" ? "move" : "none", ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_MENU_PLACEMENT")), 1), G.placement === "none" ? y("", !0) : (w(), M("div", vt, [n(je, {
					modelValue: G.placement,
					"onUpdate:modelValue": r[23] ||= (e) => G.placement = e,
					t: e.t
				}, null, 8, ["modelValue", "t"]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_MENU_DESTINATION")), 1), n(X, {
					modelValue: G.menuDestination,
					"onUpdate:modelValue": r[24] ||= (e) => G.menuDestination = e,
					options: le.value,
					placeholder: "COM_SMARTBROWSER_SELECT_MENU",
					t: e.t
				}, null, 8, [
					"modelValue",
					"options",
					"t"
				])])]))], 8, _t)) : y("", !0)
			], 64)) : te.value ? (w(), M(S, { key: 3 }, [j("details", {
				class: "resource-batch-step",
				open: K.groupOpen
			}, [j("summary", { onClick: r[25] ||= C((e) => K.groupOpen = !K.groupOpen, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_USER_GROUPS")), 1), K.groupOpen ? (w(), M("div", bt, [j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), c(j("select", {
				"onUpdate:modelValue": r[26] ||= (e) => K.groupAction = e,
				class: "form-select resource-batch-mode-select"
			}, [
				j("option", xt, _(e.t("COM_SMARTBROWSER_BATCH_GROUP_ADD")), 1),
				j("option", St, _(e.t("COM_SMARTBROWSER_BATCH_GROUP_REMOVE")), 1),
				j("option", Ct, _(e.t("COM_SMARTBROWSER_BATCH_GROUP_SET")), 1)
			], 512), [[b, K.groupAction]])]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_USER_GROUP")), 1), n(X, {
				modelValue: K.group,
				"onUpdate:modelValue": r[27] ||= (e) => K.group = e,
				options: q("group"),
				placeholder: "COM_SMARTBROWSER_SELECT_USER_GROUP",
				t: e.t
			}, null, 8, [
				"modelValue",
				"options",
				"t"
			])])])) : y("", !0)], 8, yt), j("details", {
				class: "resource-batch-step",
				open: K.resetOpen
			}, [j("summary", { onClick: r[28] ||= C((e) => K.resetOpen = !K.resetOpen, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), K.resetOpen ? (w(), M("div", Tt, [j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), c(j("select", {
				"onUpdate:modelValue": r[29] ||= (e) => K.reset = e,
				class: "form-select"
			}, [j("option", Et, _(e.t("JYES")), 1), j("option", Dt, _(e.t("JNO")), 1)], 512), [[b, K.reset]])])])) : y("", !0)], 8, wt)], 64)) : y("", !0)]), j("div", Ot, [j("div", kt, [j("div", At, _(e.t("COM_SMARTBROWSER_BATCH_PREVIEW")), 1), he.value.length ? (w(), M("div", jt, [(w(!0), M(S, null, l(he.value, (t, n) => (w(), M("div", {
				key: t.id,
				class: "resource-batch-sequence-item"
			}, [n ? (w(), M("span", Mt)) : y("", !0), j("div", Nt, [j("div", Pt, _(t.title), 1), t.parameters.length || t.preview ? (w(), M("div", Ft, [(w(!0), M(S, null, l(t.parameters, (e) => (w(), M("span", { key: e }, _(e), 1))), 128)), t.preview ? (w(), M("button", {
				key: 0,
				type: "button",
				class: "resource-batch-preview-link",
				onClick: Ce
			}, _(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")), 1)) : y("", !0)])) : y("", !0)])]))), 128))])) : (w(), M("p", It, _(e.t("COM_SMARTBROWSER_BATCH_NO_CHANGES")), 1))]), j("div", Lt, [j("button", {
				type: "button",
				class: "resource-batch-items-link",
				onClick: we
			}, _(re.value.length) + " " + _(e.t(re.value.length === 1 ? "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_ONE" : "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_MANY")), 1), j("div", Rt, [j("button", {
				type: "button",
				class: "btn btn-primary",
				disabled: d.value || !ge.value,
				onClick: ve
			}, _(e.t("COM_SMARTBROWSER_BATCH_APPLY")), 9, zt), j("button", {
				type: "button",
				class: "btn btn-danger",
				onClick: Ee
			}, _(e.t("COM_SMARTBROWSER_CANCEL")), 1)])])])], 8, Me),
			j("dialog", {
				ref_key: "previewDialog",
				ref: k,
				class: "resource-batch-preview-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")
			}, [j("div", Vt, [j("strong", null, _(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")) + " (" + _(be.value.length) + ")", 1), j("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: Y
			}, null, 8, Ht)]), j("div", Ut, [(w(!0), M(S, null, l(be.value, (e) => (w(), M("div", {
				key: e.id,
				class: "resource-batch-preview-row"
			}, [
				j("span", { title: e.before }, _(e.before), 9, Wt),
				r[31] ||= j("span", {
					class: "fas fa-arrow-right",
					"aria-hidden": "true"
				}, null, -1),
				j("strong", { title: e.after }, _(e.after), 9, Gt)
			]))), 128))])], 8, Bt),
			j("dialog", {
				ref_key: "selectionDialog",
				ref: F,
				class: "resource-batch-preview-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_SELECTED_ITEMS")
			}, [j("div", qt, [j("strong", null, _(e.t("COM_SMARTBROWSER_SELECTED_ITEMS")), 1), j("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: Te
			}, null, 8, Jt)]), j("ul", Yt, [(w(!0), M(S, null, l(re.value, (e) => (w(), M("li", { key: e.id }, [j("span", {
				class: o(e.icon || "fas fa-file"),
				"aria-hidden": "true"
			}, null, 2), j("span", null, _(e.title), 1)]))), 128))])], 8, Kt)
		], 64));
	}
}, Zt = (e) => (e || []).filter((e) => e.type === "resource" && e.visualRole === "thumbnail");
function Qt(e) {
	return !e || e.unavailable ? "" : e.thumbnail || e.metadata?.thumbnail || e.metadata?.poster || e.image || (e.type === "image" ? e.metadata?.url : "") || "";
}
//#endregion
//#region resources/js/core/selectionUsage.js
var $t = /^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/, en = (e, t) => Object.prototype.hasOwnProperty.call(e, t), tn = (e) => e === void 0 ? void 0 : JSON.parse(JSON.stringify(e)), nn = (e) => e == null || typeof e == "string" && !e.trim(), rn = /* @__PURE__ */ new Set([
	"text",
	"textarea",
	"boolean",
	"select",
	"number",
	"resource"
]), an = (e, t) => !!(e.disabledWhen && en(t || {}, e.disabledWhen.key) && t[e.disabledWhen.key] === e.disabledWhen.equals);
function on(e, t = {}) {
	if (!e || e.unavailable || !t || typeof t != "object") return [];
	let n = Array.isArray(e.selectionCapabilities) ? e.selectionCapabilities : [], r = /* @__PURE__ */ new Set();
	return n.flatMap((e) => {
		let n = e?.key;
		if (!$t.test(n || "") || ![
			"string",
			"boolean",
			"number",
			"resource",
			"object"
		].includes(e.type) || r.has(n) || !en(t, n) || t[n] === !1) return [];
		r.add(n);
		let i = t[n] && typeof t[n] == "object" ? t[n] : {};
		return [{
			...e,
			policy: i,
			presentation: ["secondary", "hidden"].includes(i.presentation) ? i.presentation : "primary",
			default: en(i, "default") ? i.default : e.default,
			required: i.required === !0
		}];
	});
}
function sn(e) {
	return !e || typeof e != "object" || Array.isArray(e) || typeof e.adapter != "string" || !/^[a-z][a-z0-9-]*$/.test(e.adapter) || typeof e.id != "string" || !e.id || e.id.length > 2048 ? null : {
		adapter: e.adapter,
		id: e.id
	};
}
function cn(e, t) {
	if (nn(t)) return e.required ? "COM_SMARTBROWSER_USAGE_REQUIRED" : null;
	let n = e.type;
	if (n === "string" && typeof t != "string" || n === "boolean" && typeof t != "boolean" || n === "number" && (typeof t != "number" || !Number.isFinite(t)) || n === "object" && (typeof t != "object" || Array.isArray(t)) || n === "resource" && !sn(t)) return "COM_SMARTBROWSER_USAGE_INVALID";
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
function ln({ profile: e = {}, initialUsage: t = {}, resolveReference: n, editors: r = {} } = {}) {
	let i = /* @__PURE__ */ new Map(), a = (t) => on(t, e);
	function o(e) {
		if (!e) return {};
		i.has(e.id) || i.set(e.id, {});
		let n = i.get(e.id);
		for (let r of a(e)) en(n, r.key) || (n[r.key] = tn(en(t[e.id] || {}, r.key) ? t[e.id][r.key] : r.default ?? null));
		for (let t of a(e)) an(t, n) && (n[t.key] = tn(t.inactiveValue ?? null));
		return tn(n);
	}
	function s(e, t, n) {
		a(e).some((e) => e.key === t) && (o(e), i.get(e.id)[t] = tn(n), o(e));
	}
	async function c(e) {
		let t = {}, i = {}, s = {};
		for (let c of e) {
			let e = o(c), l = {};
			for (let o of a(c)) {
				let a = e[o.key], s = cn(an(o, e) ? {
					...o,
					required: !1
				} : o, a);
				if (!s && o.type === "resource" && !nn(a)) {
					let e = sn(a), t = o.picker || {};
					if (t.adapter && e.adapter !== t.adapter) s = "COM_SMARTBROWSER_USAGE_INVALID";
					else try {
						let r = await n(e, t);
						(!r || r.unavailable || r.selectable === !1 || t.selectionTarget === "item" && r.kind !== "item" || t.selectionTarget === "node" && r.kind !== "node" || t.allowedResourceTypes?.length && !t.allowedResourceTypes.includes(r.type)) && (s = "COM_SMARTBROWSER_USAGE_INVALID");
					} catch {
						s = "COM_SMARTBROWSER_USAGE_INVALID";
					}
				}
				let u = r[o.editor];
				if (o.presentation !== "hidden" && !rn.has(o.editor) && !u && (s = "COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE"), !s && u?.validate) try {
					s = await u.validate(a, {
						definition: o,
						resource: c,
						values: e
					}) || null;
				} catch {
					s = "COM_SMARTBROWSER_USAGE_INVALID";
				}
				s && (t[c.id] ||= {}, t[c.id][o.key] = s, o.presentation === "hidden" && (i[c.id] ||= {}, i[c.id][o.key] = s)), l[o.key] = o.type === "resource" && !nn(a) ? sn(a) : a;
			}
			s[c.id] = l;
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
var un = { class: "resource-lightweight-area" }, dn = ["src"], fn = {
	key: 0,
	class: "resource-lightweight-actions resource-lightweight-preview-action"
}, pn = ["title", "aria-label"], mn = { class: "resource-lightweight-actions" }, hn = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], gn = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], _n = {
	key: 0,
	class: "text-danger",
	role: "alert"
}, vn = {
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
		let i = e, s = r, c = v(() => Zt(i.definitions)), f = v(() => i.editable ? c.value : []), p = v(() => c.value.find((e) => i.values?.[e.key])), m = t(""), h = t(""), g = t(""), b = t(!1), x = t(null), C = v(() => m.value || Qt(i.resource)), T = 0, E = !1;
		a(() => [
			i.resource?.id,
			p.value,
			p.value && i.values?.[p.value.key]
		], async () => {
			let e = ++T;
			m.value = "", h.value = "", g.value = "";
			let t = p.value;
			if (t) try {
				let n = await i.resolveReference(i.values[t.key], t.picker);
				if (e !== T) return;
				!n || n.unavailable || !Qt(n) ? g.value = "COM_SMARTBROWSER_USAGE_INVALID" : m.value = Qt(n);
			} catch {
				e === T && (g.value = "COM_SMARTBROWSER_USAGE_INVALID");
			}
		}, {
			immediate: !0,
			deep: !0
		});
		async function D(e) {
			let t = i.resource.id;
			b.value = !0;
			try {
				let n = await window.SmartBrowserPicker.open({
					...e.picker,
					multiple: !1,
					initialSelection: i.values?.[e.key] ? [i.values[e.key].id] : []
				});
				n && !E && i.resource.id === t && s("change", e.key, sn({
					adapter: e.picker.adapter,
					id: n.id
				}));
			} catch {
				!E && i.resource.id === t && (g.value = "COM_SMARTBROWSER_USAGE_INVALID");
			} finally {
				b.value = !1;
			}
		}
		return n({ element: x }), d(() => {
			E = !0, ++T;
		}), (t, n) => (w(), M(S, null, [j("div", un, [
			j("div", {
				ref_key: "surface",
				ref: x,
				class: o(["resource-lightweight-visual", { "has-override": !!p.value }])
			}, [C.value && h.value !== C.value ? (w(), M("img", {
				key: 0,
				src: C.value,
				alt: "",
				loading: "lazy",
				onError: n[0] ||= (e) => h.value = C.value
			}, null, 40, dn)) : (w(), M("span", {
				key: 1,
				class: o(["resource-lightweight-icon", e.resource.icon || "fas fa-file"]),
				"aria-hidden": "true"
			}, null, 2))], 2),
			e.canPreview ? (w(), M("div", fn, [e.canPreview ? (w(), M("button", {
				key: 0,
				type: "button",
				title: e.t("COM_SMARTBROWSER_ACTION_PREVIEW"),
				"aria-label": e.t("COM_SMARTBROWSER_ACTION_PREVIEW"),
				onClick: n[1] ||= (e) => t.$emit("preview")
			}, [...n[2] ||= [j("span", {
				class: "fas fa-eye",
				"aria-hidden": "true"
			}, null, -1)]], 8, pn)) : y("", !0)])) : y("", !0),
			j("div", mn, [(w(!0), M(S, null, l(f.value, (r) => (w(), M(S, { key: r.key }, [j("button", {
				type: "button",
				class: o({ selected: !!e.values?.[r.key] }),
				disabled: b.value,
				title: e.t(e.values?.[r.key] ? "COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL" : "COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL"),
				"aria-label": e.t(e.values?.[r.key] ? "COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL" : "COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL"),
				onClick: (e) => D(r)
			}, [...n[3] ||= [j("span", {
				class: "fas fa-image",
				"aria-hidden": "true"
			}, null, -1)]], 10, hn), e.values?.[r.key] ? (w(), M("button", {
				key: 0,
				type: "button",
				disabled: b.value,
				title: e.t("COM_SMARTBROWSER_USAGE_CLEAR"),
				"aria-label": e.t("COM_SMARTBROWSER_USAGE_CLEAR"),
				onClick: (e) => t.$emit("change", r.key, null)
			}, [...n[4] ||= [j("span", {
				class: "fas fa-times",
				"aria-hidden": "true"
			}, null, -1)]], 8, gn)) : y("", !0)], 64))), 128)), u(t.$slots, "actions")])
		]), g.value || c.value.some((t) => e.errors?.[t.key]) ? (w(), M("small", _n, _(e.t(g.value || e.errors[c.value.find((t) => e.errors?.[t.key]).key])), 1)) : y("", !0)], 64));
	}
}, yn = { class: "resource-usage-field" }, bn = {
	key: 0,
	"aria-hidden": "true"
}, xn = [
	"value",
	"disabled",
	"required",
	"aria-invalid"
], Sn = [
	"value",
	"required",
	"aria-invalid"
], Cn = {
	key: 3,
	class: "resource-usage-check"
}, wn = ["checked"], Tn = ["value", "aria-invalid"], En = {
	key: 0,
	value: ""
}, Dn = ["value"], On = ["value", "aria-invalid"], kn = ["value"], An = { value: "auto" }, jn = { value: "custom" }, Mn = {
	key: 0,
	class: "resource-usage-reference"
}, Nn = { key: 0 }, Pn = ["disabled"], Fn = ["title", "aria-label"], In = {
	key: 8,
	class: "text-danger"
}, Ln = { key: 9 }, Rn = {
	key: 10,
	class: "text-danger",
	role: "alert"
}, zn = {
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
		let i = e, o = n, s = `sb-usage-${Math.random().toString(36).slice(2)}`, c = t(i.value ? "custom" : "auto"), u = t(""), f = t(!1), m = t(""), h = t(null), g = v(() => i.editors?.[i.definition.editor]), b = v(() => an(i.definition, i.values)), x, C, T = 0, E = !1, D = (e) => {
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
				e && !E && D(sn({
					adapter: i.definition.picker.adapter,
					id: e.id
				}));
			} catch {
				m.value = "COM_SMARTBROWSER_USAGE_INVALID";
			} finally {
				f.value = !1;
			}
		}
		return a([g, () => i.resource?.id], async () => {
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
		}), (t, n) => (w(), M("div", yn, [
			e.definition.editor === "boolean" ? y("", !0) : (w(), M("label", {
				key: 0,
				for: s
			}, [p(_(e.t(e.definition.label)), 1), e.definition.required ? (w(), M("span", bn, " *")) : y("", !0)])),
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
			}, null, 40, xn)) : e.definition.editor === "textarea" ? (w(), M("textarea", {
				key: 2,
				id: s,
				class: "form-control",
				rows: "3",
				value: e.value ?? "",
				required: e.definition.required,
				"aria-invalid": !!e.error,
				onInput: n[1] ||= (e) => D(e.target.value)
			}, null, 40, Sn)) : e.definition.editor === "boolean" ? (w(), M("label", Cn, [j("input", {
				id: s,
				class: "form-check-input",
				type: "checkbox",
				checked: e.value === !0,
				onChange: n[2] ||= (e) => D(e.target.checked)
			}, null, 40, wn), p(_(e.t(e.definition.label)), 1)])) : e.definition.editor === "select" ? (w(), M("select", {
				key: 4,
				id: s,
				class: "form-select",
				value: e.value,
				"aria-invalid": !!e.error,
				onChange: n[3] ||= (t) => D(e.definition.options.find((e) => String(e.value) === t.target.value)?.value)
			}, [!e.definition.required && !e.definition.options?.some((e) => e.value === "") ? (w(), M("option", En, _(e.t("COM_SMARTBROWSER_USAGE_CHOOSE")), 1)) : y("", !0), (w(!0), M(S, null, l(e.definition.options, (t) => (w(), M("option", {
				key: String(t.value),
				value: t.value
			}, _(e.t(t.label)), 9, Dn))), 128))], 40, Tn)) : e.definition.editor === "number" ? (w(), M("input", {
				key: 5,
				id: s,
				class: "form-control",
				type: "number",
				value: e.value ?? "",
				"aria-invalid": !!e.error,
				onInput: n[4] ||= (e) => D(e.target.value === "" ? null : Number(e.target.value))
			}, null, 40, On)) : e.definition.editor === "resource" ? (w(), M(S, { key: 6 }, [j("select", {
				id: s,
				class: "form-select",
				value: c.value,
				onChange: n[5] ||= (e) => k(e.target.value)
			}, [j("option", An, _(e.t("COM_SMARTBROWSER_USAGE_AUTO")), 1), j("option", jn, _(e.t("COM_SMARTBROWSER_USAGE_CUSTOM")), 1)], 40, kn), c.value === "custom" ? (w(), M("div", Mn, [
				e.value ? (w(), M("span", Nn, _(u.value || e.value.id), 1)) : y("", !0),
				j("button", {
					type: "button",
					class: "btn btn-outline-primary",
					disabled: f.value,
					onClick: A
				}, [n[6] ||= j("span", {
					class: "fas fa-plus",
					"aria-hidden": "true"
				}, null, -1), p(" " + _(e.t(e.definition.pickerLabel || "COM_SMARTBROWSER_USAGE_PICK_RESOURCE")), 1)], 8, Pn),
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
				}, null, -1)]], 8, Fn)) : y("", !0)
			])) : y("", !0)], 64)) : g.value ? (w(), M("div", {
				key: 7,
				ref_key: "customContainer",
				ref: h
			}, null, 512)) : (w(), M("small", In, _(e.t("COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE")), 1)),
			e.definition.description ? (w(), M("small", Ln, _(e.t(e.definition.description)), 1)) : y("", !0),
			e.error || m.value ? (w(), M("small", Rn, _(e.t(e.error || m.value)), 1)) : y("", !0)
		]));
	}
}, Bn = { class: "resource-usage-editor" }, Vn = ["open"], Hn = {
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
		return (t, o) => (w(), M("div", Bn, [(w(!0), M(S, null, l(n.value, (e) => (w(), N(zn, i({ key: e.key }, { ref_for: !0 }, a(e), { onChange: (n) => t.$emit("change", e.key, n) }), null, 16, ["onChange"]))), 128)), r.value.length ? (w(), M("details", {
			key: 0,
			class: "resource-usage-secondary",
			open: r.value.some((t) => e.errors?.[t.key]) || void 0
		}, [j("summary", null, _(e.t("COM_SMARTBROWSER_USAGE_MORE")), 1), (w(!0), M(S, null, l(r.value, (e) => (w(), N(zn, i({ key: e.key }, { ref_for: !0 }, a(e), { onChange: (n) => t.$emit("change", e.key, n) }), null, 16, ["onChange"]))), 128))], 8, Vn)) : y("", !0)]));
	}
}, Un = {
	key: 0,
	class: "resource-info-tabs",
	role: "tablist"
}, Wn = ["aria-selected"], Gn = ["aria-selected"], Kn = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], qn = { key: 0 }, Jn = {
	key: 0,
	class: "resource-language"
}, Yn = ["src"], Xn = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, Zn = {
	key: 2,
	class: "resource-info-timezone"
}, Qn = { key: 1 }, $n = { key: 0 }, er = { key: 1 }, tr = {
	key: 0,
	class: "resource-info-timezone"
}, nr = { key: 2 }, rr = {
	key: 0,
	class: "resource-info-timezone"
}, ir = { key: 3 }, ar = { key: 4 }, or = { key: 5 }, sr = { key: 6 }, cr = {
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
		let r = e, i = v(() => (r.usageDefinitions || []).filter((e) => !Zt([e]).length)), u = t("info"), f = t("usage"), m = (e) => {
			f.value = e, u.value = e;
		}, h = t(!1), b = t(null), x;
		a(() => r.resource?.id, () => x?.abort()), d(() => x?.abort()), a(() => !!r.usageDefinitions?.length, (e) => {
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
			let e = (r.fields || []).filter((e) => (!e.kinds || e.kinds.includes(r.resource?.kind)) && ![
				"metadata.locationPath",
				"metadata.category",
				"metadata.tags"
			].includes(e.source)), t = new Set(e.map((e) => e.source));
			return [...e, ...T.filter((e) => {
				let n = r.resource?.metadata?.[e.source.split(".")[1]];
				return !t.has(e.source) && n != null && n !== "";
			})];
		}), D = L, k = v(() => r.resource?.kind === "node" ? r.t("COM_SMARTBROWSER_FOLDER") : r.resource?.type ? r.resource.type.charAt(0).toUpperCase() + r.resource.type.slice(1) : r.t("COM_SMARTBROWSER_RESOURCE")), A = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, P = (e) => `${(e / 1024).toFixed(2)} KB`, F = (e) => String(e.source || "").split(".").reduce((e, t) => e?.[t], r.resource), I = (e) => (e.format === "language" || e.source === "metadata.language") && F(e) === "*" ? r.t("COM_SMARTBROWSER_ALL_LANGUAGES") : e.format === "date" ? A(F(e)) : e.format === "size" ? F(e) !== null && F(e) !== void 0 ? P(F(e)) : "" : e.format === "dimensions" ? r.resource?.metadata.width && r.resource?.metadata.height ? `${r.resource.metadata.width}px \u00d7 ${r.resource.metadata.height}px` : "" : F(e), R = (e) => {
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
			e.usageDefinitions?.length ? (w(), M("div", Un, [j("button", {
				type: "button",
				role: "tab",
				"aria-selected": u.value === "usage",
				onClick: r[0] ||= (e) => m("usage")
			}, _(e.t("COM_SMARTBROWSER_USAGE_OPTIONS")), 9, Wn), j("button", {
				type: "button",
				role: "tab",
				"aria-selected": u.value === "info",
				onClick: r[1] ||= (e) => m("info")
			}, _(e.t("COM_SMARTBROWSER_USAGE_INFO")), 9, Gn)])) : y("", !0),
			n(vn, {
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
				}, null, 2)], 8, Kn))), 128))]),
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
			e.usageDefinitions?.length && u.value === "usage" ? (w(), N(Hn, {
				key: e.resource.id,
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
			])) : (w(), M(S, { key: 2 }, [e.fields?.length ? (w(), M("dl", qn, [(w(!0), M(S, null, l(E.value, (t) => c((w(), M("div", { key: `${t.source}-${t.label}` }, [
				j("dt", null, [j("span", {
					class: o(g(D)(t)),
					"aria-hidden": "true"
				}, null, 2), p(_(e.t(t.label)), 1)]),
				t.format === "language" ? (w(), M("dd", Jn, [e.resource.metadata?.languageImage ? (w(), M("img", {
					key: 0,
					src: e.resource.metadata.languageImage,
					alt: "",
					"aria-hidden": "true"
				}, null, 8, Yn)) : F(t) === "*" ? (w(), M("span", Xn)) : y("", !0), j("span", null, _(I(t)), 1)])) : (w(), M("dd", {
					key: 1,
					class: o({
						"resource-info-identifier": t.source === "metadata.alias" || t.source === "metadata.username",
						"resource-info-lines": t.source === "metadata.tagPaths"
					})
				}, _(I(t)), 3)),
				t.format === "date" && R(F(t)) ? (w(), M("small", Zn, _(R(F(t))), 1)) : y("", !0)
			])), [[O, I(t) !== "" && I(t) !== null && I(t) !== void 0]])), 128))])) : (w(), M("dl", Qn, [
				e.resource.parentId ? (w(), M("div", $n, [j("dt", null, [r[5] ||= j("span", {
					class: "fas fa-folder",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_FOLDER")), 1)]), j("dd", null, _(e.resource.parentId), 1)])) : y("", !0),
				j("div", null, [j("dt", null, [r[6] ||= j("span", {
					class: "fas fa-file-alt",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_TYPE")), 1)]), j("dd", null, _(k.value), 1)]),
				e.resource.metadata.created ? (w(), M("div", er, [
					j("dt", null, [r[7] ||= j("span", {
						class: "fas fa-calendar",
						"aria-hidden": "true"
					}, null, -1), p(_(e.t("COM_SMARTBROWSER_DATE_CREATED")), 1)]),
					j("dd", null, _(A(e.resource.metadata.created)), 1),
					R(e.resource.metadata.created) ? (w(), M("small", tr, _(R(e.resource.metadata.created)), 1)) : y("", !0)
				])) : y("", !0),
				e.resource.metadata.modified ? (w(), M("div", nr, [
					j("dt", null, [r[8] ||= j("span", {
						class: "fas fa-calendar",
						"aria-hidden": "true"
					}, null, -1), p(_(e.t("COM_SMARTBROWSER_DATE_MODIFIED")), 1)]),
					j("dd", null, _(A(e.resource.metadata.modified)), 1),
					R(e.resource.metadata.modified) ? (w(), M("small", rr, _(R(e.resource.metadata.modified)), 1)) : y("", !0)
				])) : y("", !0),
				e.resource.metadata.width && e.resource.metadata.height ? (w(), M("div", ir, [j("dt", null, [r[9] ||= j("span", {
					class: "fas fa-expand",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_DIMENSIONS")), 1)]), j("dd", null, _(e.resource.metadata.width) + "px × " + _(e.resource.metadata.height) + "px", 1)])) : y("", !0),
				e.resource.metadata.size ? (w(), M("div", ar, [j("dt", null, [r[10] ||= j("span", {
					class: "fas fa-database",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_SIZE")), 1)]), j("dd", null, _(P(e.resource.metadata.size)), 1)])) : y("", !0),
				e.resource.metadata.mimeType ? (w(), M("div", or, [j("dt", null, [r[11] ||= j("span", {
					class: "fas fa-file-alt",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_MIME_TYPE")), 1)]), j("dd", null, _(e.resource.metadata.mimeType), 1)])) : y("", !0),
				e.resource.metadata.extension ? (w(), M("div", sr, [j("dt", null, [r[12] ||= j("span", {
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
}, lr = {
	class: "resource-breadcrumb",
	"aria-label": "Breadcrumb"
}, ur = [
	"title",
	"aria-label",
	"onClick"
], dr = {
	key: 1,
	class: "resource-breadcrumb-title"
}, fr = {
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
		return (t, r) => (w(), M("nav", lr, [(w(!0), M(S, null, l(n.value, (n, r) => (w(), M("button", {
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
		}, null, 2)) : y("", !0), r !== 0 || !e.iconOnlyRoot ? (w(), M("span", dr, _(n.title), 1)) : y("", !0)], 10, ur))), 128))]));
	}
}, pr = {
	class: "resource-toolbar",
	role: "toolbar"
}, mr = { class: "resource-toolbar-primary" }, hr = { class: "resource-view-controls" }, gr = [
	"disabled",
	"title",
	"aria-label"
], _r = ["title"], vr = ["title"], yr = ["disabled"], br = ["disabled"], xr = ["title"], Sr = { "aria-hidden": "true" }, Cr = [
	"title",
	"aria-label",
	"aria-expanded"
], wr = {
	key: 0,
	class: "resource-column-menu"
}, Tr = { class: "resource-column-menu-title" }, Er = [
	"checked",
	"disabled",
	"onChange"
], Dr = { class: "resource-mode-controls" }, Or = ["title", "onClick"], kr = ["title"], Ar = {
	key: 0,
	class: "resource-toolbar-expanded resource-search-row"
}, jr = {
	for: "smartbrowser-search",
	class: "visually-hidden"
}, Mr = { class: "input-group resource-search-control" }, Nr = ["value", "placeholder"], Pr = ["title"], Fr = { class: "visually-hidden" }, Ir = {
	key: 1,
	class: "resource-toolbar-expanded resource-sort-row"
}, Lr = { class: "resource-sort-controls" }, Rr = { class: "visually-hidden" }, zr = ["value"], Br = { value: "" }, Vr = ["value"], Hr = { class: "visually-hidden" }, Ur = ["value", "disabled"], Wr = { value: "asc" }, Gr = { value: "desc" }, Kr = {
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
		return (t, r) => (w(), M("div", pr, [
			j("div", mr, [n(fr, {
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
			]), j("div", hr, [
				e.reorderVisible ? (w(), N(V, {
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
				}, null, -1)]], 8, gr)) : y("", !0),
				j("button", {
					type: "button",
					class: o(["resource-icon-button", { active: u.value }]),
					title: e.t("COM_SMARTBROWSER_SEARCH"),
					onClick: r[3] ||= (e) => u.value = !u.value
				}, [...r[17] ||= [j("span", {
					class: "fas fa-search",
					"aria-hidden": "true"
				}, null, -1)]], 10, _r),
				b("sort") ? (w(), M("button", {
					key: 2,
					type: "button",
					class: o(["resource-icon-button", { active: c.value }]),
					title: e.t("COM_SMARTBROWSER_SORT_BY"),
					onClick: r[4] ||= (e) => c.value = !c.value
				}, [...r[18] ||= [j("span", {
					class: "fas fa-sort-amount-down-alt",
					"aria-hidden": "true"
				}, null, -1)]], 10, vr)) : y("", !0),
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
				}, null, -1)]], 8, yr)) : y("", !0),
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
				}, null, -1)]], 8, br)) : y("", !0),
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
				}, null, -1), j("small", Sr, _(h.value), 1)], 8, xr)) : y("", !0),
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
				}, null, -1)]], 8, Cr), f.value ? (w(), M("div", wr, [j("div", Tr, _(e.t("COM_SMARTBROWSER_COLUMNS")), 1), (w(!0), M(S, null, l(e.columns, (n) => (w(), M("label", {
					key: n.id,
					class: "resource-column-choice"
				}, [j("input", {
					type: "checkbox",
					checked: n.defaultVisible ? !e.hiddenColumns?.includes(n.id) : e.shownColumns?.includes(n.id),
					disabled: n.id === "title" || n.id === "name",
					onChange: (e) => t.$emit("toggle-column", n.id)
				}, null, 40, Er), j("span", null, _(e.t(n.label || (n.dateGroup ? "COM_SMARTBROWSER_DATE" : n.fields?.[0]?.label))), 1)]))), 128))])) : y("", !0)], 512)) : y("", !0),
				j("div", Dr, [(w(!0), M(S, null, l(e.views, (n) => (w(), M("button", {
					key: n.id,
					type: "button",
					class: o(["resource-icon-button", { active: e.activeView === n.id }]),
					title: e.t(n.label),
					onClick: (e) => t.$emit("view", n.id)
				}, [j("span", {
					class: o(n.icon),
					"aria-hidden": "true"
				}, null, 2)], 10, Or))), 128))]),
				j("button", {
					type: "button",
					class: o(["resource-icon-button", { active: e.showInfo }]),
					title: e.t("COM_SMARTBROWSER_TOGGLE_INFO"),
					onClick: r[10] ||= (e) => t.$emit("info")
				}, [...r[24] ||= [j("span", {
					class: "fas fa-info",
					"aria-hidden": "true"
				}, null, -1)]], 10, kr)
			])]),
			u.value ? (w(), M("div", Ar, [j("label", jr, _(e.t("COM_SMARTBROWSER_SEARCH")), 1), j("div", Mr, [j("input", {
				id: "smartbrowser-search",
				value: e.search,
				type: "search",
				class: "form-control",
				placeholder: e.t("COM_SMARTBROWSER_SEARCH"),
				onInput: r[11] ||= (e) => t.$emit("search", e.target.value),
				onKeydown: r[12] ||= D(C((e) => t.$emit("search", e.target.value), ["prevent"]), ["enter"])
			}, null, 40, Nr), j("button", {
				type: "button",
				class: "btn btn-primary",
				title: e.t("COM_SMARTBROWSER_SEARCH"),
				onClick: r[13] ||= (n) => t.$emit("search", e.search)
			}, [r[25] ||= j("span", {
				class: "fas fa-search",
				"aria-hidden": "true"
			}, null, -1), j("span", Fr, _(e.t("COM_SMARTBROWSER_SEARCH")), 1)], 8, Pr)])])) : y("", !0),
			c.value && b("sort") ? (w(), M("div", Ir, [j("div", Lr, [j("label", null, [j("span", Rr, _(e.t("COM_SMARTBROWSER_SORT_BY")), 1), j("select", {
				value: e.sortBy,
				class: "form-select",
				onChange: r[14] ||= (e) => t.$emit("sort-by", e.target.value)
			}, [j("option", Br, _(e.t("COM_SMARTBROWSER_DEFAULT_SORTING")), 1), (w(!0), M(S, null, l(s.value, (t) => (w(), M("option", {
				key: t.id,
				value: t.id
			}, _(e.t(t.label)), 9, Vr))), 128))], 40, zr)]), j("label", null, [j("span", Hr, _(e.t("COM_SMARTBROWSER_SORT_DIRECTION")), 1), j("select", {
				value: e.sortDirection || "asc",
				class: "form-select",
				disabled: !e.sortBy,
				onChange: r[15] ||= (e) => t.$emit("sort-direction-value", e.target.value)
			}, [j("option", Wr, _(e.t("COM_SMARTBROWSER_ASCENDING")), 1), j("option", Gr, _(e.t("COM_SMARTBROWSER_DESCENDING")), 1)], 40, Ur)])])])) : y("", !0)
		]));
	}
}, qr = {
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
}, Jr = ["aria-label"], Yr = ["open", "onToggle"], Xr = ["onClick"], Zr = {
	key: 0,
	class: "resource-adapter-roots"
}, Qr = ["onClick"], $r = {
	key: 1,
	class: "resource-tree-branch"
}, ei = ["onClick"], ti = ["onClick"], ni = {
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
		}, null, 2), p(" " + _(r.title), 1)], 8, Xr), r.id !== e.activeAdapter || d.value ? (w(), M("div", Zr, [(w(!0), M(S, null, l(r.id === e.activeAdapter ? e.roots : [], (i) => (w(), M("section", {
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
		}, null, 2), j("span", null, _(i.title), 1)], 10, Qr)), c(i) ? (w(), M("div", $r, [(w(!0), M(S, null, l(u(i), (r) => (w(), M("button", {
			key: r.id,
			type: "button",
			class: o({ active: e.selectedNode === r.id }),
			style: h(f(i, u(i).indexOf(r))),
			onClick: (e) => t.$emit("open", r.id)
		}, [n(qr, {
			resource: r,
			open: !0
		}, null, 8, ["resource"]), j("span", null, _(r.title), 1)], 14, ei))), 128)), (w(!0), M(S, null, l(e.nodes, (e) => (w(), M(S, { key: e.id }, [e.navigable === !1 ? (w(), M("div", {
			key: 1,
			class: "resource-tree-entry resource-tree-static",
			style: h(f(i, u(i).length))
		}, [n(qr, { resource: e }, null, 8, ["resource"]), j("span", null, _(e.title), 1)], 4)) : (w(), M("button", {
			key: 0,
			type: "button",
			class: "resource-tree-entry",
			style: h(f(i, u(i).length)),
			onClick: (n) => t.$emit("open", e.id)
		}, [n(qr, { resource: e }, null, 8, ["resource"]), j("span", null, _(e.title), 1)], 12, ti))], 64))), 128))])) : y("", !0)], 2))), 128))])) : y("", !0)], 40, Yr))), 128))], 8, Jr));
	}
}, ri = /* @__PURE__ */ new Set([
	"articles",
	"categories",
	"tags",
	"articles-by-tag",
	"menus",
	"users",
	"media"
]), ii = (e, t, n) => {
	let r = e.startsWith("flat-") ? new URL(n).searchParams.get("flatFromBrowseRoot") || "" : t || "";
	return `supjx.smartbrowser.ui.${e.replace(/^flat-/, "")}.${r}`;
}, ai = (e, t, n, r) => {
	let i = new URL(e);
	if (!ri.has(t)) return i.toString();
	i.searchParams.set("flatFromAdapter", t), i.searchParams.set("flatFromNode", n), r ? i.searchParams.set("flatFromBrowseRoot", r) : i.searchParams.delete("flatFromBrowseRoot");
	let a = `flat-${t}`;
	if (i.searchParams.set("adapter", a), i.searchParams.set("node", `${a}:root`), t === "articles" || t === "categories") {
		let e = n.startsWith("category:") ? n : r;
		e?.startsWith("category:") ? i.searchParams.set("browseRoot", e) : i.searchParams.delete("browseRoot"), i.searchParams.delete("flatScope");
	} else r ? i.searchParams.set("browseRoot", r) : i.searchParams.delete("browseRoot"), i.searchParams.set("flatScope", n);
	return i.toString();
}, oi = (e, t) => {
	let n = new URL(e), r = n.searchParams.get("flatFromAdapter"), i = ri.has(r) ? r : "articles", a = n.searchParams.get("flatFromBrowseRoot") || (r ? null : t), o = n.searchParams.get("flatFromNode") || a || "content:root";
	n.searchParams.set("adapter", i), n.searchParams.set("node", o), a ? n.searchParams.set("browseRoot", a) : n.searchParams.delete("browseRoot");
	for (let e of [
		"flatFromAdapter",
		"flatFromNode",
		"flatFromBrowseRoot",
		"flatScope"
	]) n.searchParams.delete(e);
	return n.toString();
}, si = (e, t) => {
	let n = new URL(e);
	if (!n.searchParams.get("adapter")?.startsWith("flat-") || !t) return n.toString();
	let r = n.searchParams.get("adapter");
	if (n.searchParams.set("node", `${r}:root`), n.searchParams.set("flatFromNode", t), r === "flat-articles" || r === "flat-categories") {
		let e = n.searchParams.get("flatFromBrowseRoot") || (n.searchParams.has("flatFromAdapter") ? null : n.searchParams.get("browseRoot"));
		e ? n.searchParams.set("browseRoot", e) : n.searchParams.delete("browseRoot"), n.searchParams.delete("flatScope");
	} else n.searchParams.set("flatScope", t);
	return n.toString();
}, ci = {
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
}, li = (e) => ({
	stateLabel: "status",
	width: "dimension",
	link: "url"
})[e.split(".").pop()] || e.split(".").pop();
function ui(e, t) {
	let n = e?.columns || [], r = n.map((e) => ({
		...e,
		defaultVisible: !0
	})), i = new Set(n.map((e) => e.id)), a = t.replace(/^flat-/, "") === "articles-by-tag" ? "articles" : t.replace(/^flat-/, ""), o = [...e?.infoFields || [], ...(ci[a] || []).map(([e, t, n]) => ({
		id: li(e),
		label: t,
		source: `metadata.${e}`,
		format: n
	}))], s = i.has("dates");
	for (let e of o) {
		if (!e.source || !e.label || e.source === "metadata.locationPath") continue;
		let t = e.id || li(e.source);
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
var di = {
	key: 0,
	class: "smartbrowser-busy",
	role: "status",
	"aria-live": "polite"
}, fi = [
	"aria-pressed",
	"title",
	"aria-label"
], pi = [
	"aria-pressed",
	"title",
	"aria-label"
], mi = [
	"title",
	"aria-label",
	"aria-expanded"
], hi = { class: "resource-main" }, gi = {
	key: 0,
	class: "resource-loader"
}, _i = {
	key: 1,
	class: "resource-empty"
}, vi = {
	key: 3,
	class: "resource-drop-overlay"
}, yi = {
	__name: "SmartBrowserApp",
	setup(e) {
		let i = m("browser"), a = m("smartBrowserOptions"), c = a.application === "site" && window.self === window.top, l = t("normal"), u, b = v(() => ({
			normal: "COM_SMARTBROWSER_DISPLAY_WIDE",
			wide: "COM_SMARTBROWSER_DISPLAY_FOCUS",
			focus: "COM_SMARTBROWSER_DISPLAY_NORMAL"
		})[l.value]), x = () => {
			l.value = u.cycle();
		};
		T(() => {
			c && (u = ae(document.getElementById("smartbrowser-app"), (e) => {
				l.value = e;
			}));
		}), d(() => u?.destroy());
		let S = m("actionDriver"), E = m("resourceApi"), D = m("viewRegistry"), { state: O, resources: k, bulkSelectableResources: A, selection: P, focusedResource: F, load: L, focus: R, toggle: ee, selectAll: te, invertSelection: re } = i, V = a.mode === "select" ? a.pickerContext : null, H = /* @__PURE__ */ new Map();
		async function ie(e, t = {}) {
			let n = JSON.stringify([e.adapter, t.browseRoot || ""]);
			return H.has(n) || H.set(n, new B({
				...a,
				adapter: e.adapter,
				mode: "select",
				browseRoot: t.browseRoot || null,
				flatScope: null
			})), (await H.get(n).collection([e.id])).resources[0];
		}
		let U = ln({
			profile: V?.selectionProfile || {},
			initialUsage: V?.initialUsage || {},
			editors: V?.editors || {},
			resolveReference: ie
		}), W = t(0), G = t(V?.isMaximized?.() || !1), K = t(0), oe = t({}), se = t(!1), ce = v(() => U.definitions(F.value).filter((e) => e.presentation !== "hidden")), q = v(() => (W.value, U.get(F.value))), le = v(() => !!(V && ce.value.length)), ue = !!(V && Object.keys(V.selectionProfile || {}).length), de = t(O.showInfo), fe = v(() => le.value || (ue ? de.value : O.showInfo)), pe = () => {
			le.value || (ue ? de.value = !de.value : O.showInfo = !O.showInfo);
		}, me = (e, t, n) => {
			e && !_e && (U.set(e, t, n), oe.value = {
				...oe.value,
				[e.id]: {}
			}, W.value++);
		}, J = (e, t) => me(F.value, e, t), he = v(() => {
			let e = F.value;
			return {
				resource: e,
				profile: V?.selectionProfile || {},
				values: q.value,
				getValues: () => U.get(e),
				setValue: (t, n) => me(e, t, n),
				refresh: () => L(),
				selectResource: (e) => window.SmartBrowserPicker.open(e)
			};
		}), ge = v(() => (V?.previewActions || []).filter((e) => {
			try {
				return F.value && (!e.applies || e.applies(he.value));
			} catch {
				return !1;
			}
		})), _e = !1;
		d(() => {
			_e = !0, H.forEach((e) => e.destroy());
		});
		let ve = D.all(), ye = v(() => D.get(O.activeView)), be = v(() => ui(O.presentation, a.adapter)), xe = v(() => be.value.filter((e) => e.id === "title" || e.id === "name" || (e.defaultVisible ? !O.hiddenColumns.includes(e.id) : O.shownColumns.includes(e.id)))), Se = (e) => {
			let t = be.value.find((t) => t.id === e);
			if (!t || ["title", "name"].includes(e)) return;
			let n = t.defaultVisible ? "hiddenColumns" : "shownColumns";
			O[n] = O[n].includes(e) ? O[n].filter((t) => t !== e) : [...O[n], e];
		}, Ce = t(!1), Y = t(!1), Te = t(null), Ee = v(() => a.adapter === "media"), De = v(() => a.mode === "manage" && ["details", "grid"].includes(O.activeView) && O.presentation.orderingField && O.sortBy === O.presentation.orderingField && ["asc", "desc"].includes(O.sortDirection) && (a.adapter === "featured-articles" || String(O.filters.featured ?? "") !== "1")), Oe = v(() => De.value && !O.busy && P.value.length > 0 && P.value.every((e) => e.capabilities?.reorder === !0)), X = async (e) => {
			if (!Oe.value || !["up", "down"].includes(e)) return;
			let t = P.value.map((e) => e.id), n = O.focusedId;
			O.busy = !0;
			try {
				let r = O.sortDirection === "desc" ? e === "up" ? "down" : "up" : e;
				(await E.execute("reorder", t, { direction: r })).updated?.length && (await L(), O.selectedIds = t.filter((e) => k.value.some((t) => t.id === e)), O.focusedId = O.selectedIds.includes(n) ? n : O.selectedIds[0] || null);
			} catch (e) {
				Joomla.renderMessages({ error: [e.message] });
			} finally {
				O.busy = !1;
			}
		}, ke = a.adapter !== "featured-articles" && [
			"articles",
			"categories",
			"tags",
			"articles-by-tag",
			"menus",
			"users",
			"media"
		].includes(a.adapter.replace(/^flat-/, "")), Z = a.adapter.startsWith("flat-") || a.adapter === "featured-articles", Ae = Object.fromEntries(Object.entries(a.gridWidths || {}).map(([e, t]) => [`--sb-grid-${e}`, `${t}px`])), je = ii(a.adapter, a.browseRoot, window.location.href), Me = (() => {
			try {
				return JSON.parse(window.sessionStorage.getItem(je) || "{}");
			} catch {
				return {};
			}
		})(), Ne = t(Me.filtersOpen === !0), Pe = (e) => {
			Me = {
				...Me,
				filtersOpen: Ne.value,
				...e
			}, window.sessionStorage.setItem(je, JSON.stringify(Me));
		}, Fe = () => {
			Ne.value = !Ne.value, Pe({ filtersOpen: Ne.value });
		}, Ie = () => {
			Pe({ flat: !Z }), window.location.assign(Z ? oi(window.location.href, a.browseRoot) : ai(window.location.href, a.adapter, O.selectedNode, a.browseRoot));
		}, Le = v(() => a.adapters?.find((e) => e.id === a.adapter)?.icon || "fas fa-list"), Re = v(() => a.adapters?.find((e) => e.id === a.adapter)?.nodeOpenIcon || {
			media: "fas fa-folder-open",
			articles: "fas fa-box-open",
			"flat-articles": "fas fa-box-open",
			categories: "fas fa-box-open",
			tags: "fas fa-tags",
			"articles-by-tag": "fas fa-tags",
			users: "fas fa-users-viewfinder",
			menus: "fas fa-diagram-successor",
			"featured-articles": "fas fa-star"
		}[a.adapter] || "fas fa-folder-open"), ze = [
			"sm",
			"md",
			"lg",
			"xl"
		], Q = (e) => Joomla.Text?._(e, e) || e, Be = async ({ selection: e, payload: t, resolve: n, reject: r }) => {
			try {
				let r = await E.execute("batch", e, t);
				if (r.download) {
					let e = atob(r.download.content), t = Uint8Array.from(e, (e) => e.charCodeAt(0)), n = URL.createObjectURL(new Blob([t], { type: "application/zip" })), i = document.createElement("a");
					i.href = n, i.download = r.download.name, i.click(), setTimeout(() => URL.revokeObjectURL(n), 6e4);
				}
				await L(), n(r);
			} catch (e) {
				r(e);
			}
		}, Ve = async (e) => {
			if (se.value || !e.length) return;
			se.value = !0;
			let t = W.value, n;
			try {
				n = await U.validate(e);
			} finally {
				se.value = !1;
			}
			if (_e || t !== W.value) return;
			if (oe.value = n.errors, !n.valid) {
				Object.keys(n.profileErrors).length && Joomla.renderMessages({ error: [Q("COM_SMARTBROWSER_USAGE_PROFILE_INVALID")] });
				let e = Object.keys(n.errors).find((e) => Object.keys(n.errors[e]).some((t) => !n.profileErrors[e]?.[t]));
				e && (O.focusedId = e, K.value++);
				return;
			}
			let r = {
				adapter: a.adapter.replace(/^flat-/, ""),
				mode: a.mode,
				resources: [...e]
			};
			V && (r.pickerInstance = a.pickerInstance, r.usage = n.usage), document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r })), window.parent !== window && window.parent.document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r }));
		}, He = (e) => {
			let t = ze.indexOf(O.viewOptions.gridSize);
			O.viewOptions.gridSize = ze[Math.max(0, Math.min(ze.length - 1, t + e))];
		}, Ue = (e) => ne(e, a.mode, O.actions, (e, t) => S.available(e, t), a.selectionTarget || "both"), We = (e) => I(e, a.mode, O.actions, (e, t) => S.available(e, t)), Ge = (e, t) => !O.busy && (e.local ? t.every((t) => Ue(t)?.id === e.id) : S.available(e, t)), Ke = (e) => {
			let t = Ue(e);
			t && qe(t, e);
		}, qe = (e, t) => {
			if (e && t && Ge(e, [t])) return e.id === "browseOpen" ? L(t.id) : e.id === "pickerSelect" ? Ve([t]) : S.execute(e, [t]);
		}, Je = (e) => {
			if (e === a.adapter) return;
			let t = new URL(window.location.href);
			t.searchParams.set("adapter", e), t.searchParams.delete("node"), t.searchParams.delete("browseRoot"), window.location.href = t.toString();
		}, Ye = async ({ id: e, value: t }) => {
			if (O.filters[e] = t, e === "menu" && t && !a.browseRoot && a.adapter === "menus") {
				await L(`menu:${t}`);
				return;
			}
			if (e === "menu" && t && !a.browseRoot && a.adapter === "flat-menus") {
				let e = new URL(window.location.href);
				e.searchParams.set("flatScope", `menu:${t}`), e.searchParams.set("flatFromNode", `menu:${t}`), window.location.assign(e.toString());
				return;
			}
			await L(O.selectedNode);
		}, Xe = async () => {
			(O.presentation.filters || []).forEach((e) => {
				O.filters[e.id] = e.default ?? "";
			}), await L(O.selectedNode);
		}, Ze = async (e) => {
			if (Z && e === O.selectedNode && e === O.roots[0]?.id) {
				O.search = "", O.sortBy = a.defaultSortBy || "", O.sortDirection = a.defaultSortDirection || "";
				let e = si(window.location.href, a.flatRootNode);
				if (e !== window.location.href) {
					(O.presentation.filters || []).forEach((e) => {
						O.filters[e.id] = e.default ?? "";
					}), await r(), window.location.assign(e);
					return;
				}
				await Xe();
				return;
			}
			await L(e);
		}, Qe = (e) => {
			O.sortBy === e ? O.sortDirection === "asc" ? O.sortDirection = "desc" : (O.sortBy = "", O.sortDirection = "") : (O.sortBy = e, O.sortDirection = "asc");
		}, $e = (e) => {
			O.sortBy = e, O.sortDirection = e ? O.sortDirection || "asc" : "";
		}, et = () => {
			let e = [
				"modified",
				"created",
				"both"
			], t = e.indexOf(O.viewOptions.detailsDateMode);
			O.viewOptions.detailsDateMode = e[(t + 1) % e.length];
		}, tt = async (e) => {
			Ce.value = !1, Ee.value && await S.uploadFiles(e.dataTransfer?.files);
		};
		return T(() => {
			if (Z && Pe({ flat: !0 }), !Z && ke && Me.flat === !0) {
				window.location.replace(ai(window.location.href, a.adapter, O.selectedNode, a.browseRoot));
				return;
			}
			L(O.selectedNode).then(async () => {
				if (V?.initialSelection?.length) {
					let e = V.initialSelection.map((e) => e && typeof e == "object" ? e.id : e);
					try {
						let t = await E.collection(a.multiple ? e : e.slice(0, 1));
						if (_e) return;
						let n = new Set(a.allowedResourceTypes || []), r = t.resources.filter((e) => !e.unavailable && z(e, a.selectionTarget) && (!n.size || n.has(e.type)));
						O.selectedIds = r.map((e) => e.id), O.selectedResources = Object.fromEntries(r.map((e) => [e.id, e])), O.focusedId = O.selectedIds[0] || null;
					} catch (e) {
						_e || Joomla.renderMessages({ error: [e.message] });
					}
				}
				a.adapter === "media" && a.initialResource && k.value.some((e) => e.id === a.initialResource) && (O.focusedId = a.initialResource);
			});
		}), (e, t) => (w(), M("div", {
			class: "smartbrowser-shell",
			style: h(g(Ae))
		}, [
			g(O).busy ? (w(), M("div", di, [t[14] ||= j("span", {
				class: "spinner-border",
				"aria-hidden": "true"
			}, null, -1), j("span", null, _(Q("COM_SMARTBROWSER_WORKING")), 1)])) : y("", !0),
			n(we, {
				actions: g(O).actions,
				available: (e) => g(S).available(e, g(P)),
				selection: g(P),
				"batch-available": g(a).mode === "manage",
				"flat-available": g(ke),
				"flat-active": g(Z),
				"filters-open": Ne.value,
				filters: g(O).presentation.filters,
				"filter-values": g(O).filters,
				"manager-url": g(a).managerUrl,
				"manager-new-tab": g(a).application === "site",
				"dashboard-url": g(a).dashboardUrl,
				integrated: g(a).integrated,
				"selection-mode": g(a).mode === "select",
				"allow-no-user": g(a).allowNoUser,
				"can-complete": g(P).length > 0 && !se.value,
				t: Q,
				onAction: t[1] ||= (e) => g(S).execute(e, g(P)),
				onBatch: t[2] ||= (e) => Te.value?.open(),
				onToggleFlat: Ie,
				onToggleFilters: Fe,
				onFilter: Ye,
				onClearFilters: Xe,
				onComplete: t[3] ||= (e) => Ve(g(P)),
				onNoUser: t[4] ||= (e) => Ve([{
					id: "user:0",
					type: "user",
					title: ""
				}])
			}, {
				"display-controls": s(() => [g(V)?.toggleSize ? (w(), M("button", {
					key: 0,
					type: "button",
					class: o(["resource-icon-button resource-display-toggle", { active: G.value }]),
					"aria-pressed": G.value,
					title: Q(G.value ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE"),
					"aria-label": Q(G.value ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE"),
					onClick: t[0] ||= (e) => G.value = g(V).toggleSize()
				}, [j("span", {
					class: o(G.value ? "fas fa-compress" : "fas fa-expand"),
					"aria-hidden": "true"
				}, null, 2)], 10, fi)) : y("", !0), g(c) ? (w(), M("button", {
					key: 1,
					type: "button",
					class: o(["resource-icon-button resource-display-toggle", { active: l.value !== "normal" }]),
					"aria-pressed": l.value !== "normal",
					title: Q(b.value),
					"aria-label": Q(b.value),
					onClick: x
				}, [j("span", {
					class: o(l.value === "normal" ? "fas fa-arrows-alt-h" : l.value === "wide" ? "fas fa-expand" : "fas fa-compress"),
					"aria-hidden": "true"
				}, null, 2)], 10, pi)) : y("", !0)]),
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
			n(Xt, {
				ref_key: "batchDialog",
				ref: Te,
				selection: g(P),
				adapter: g(a).adapter,
				filters: g(O).presentation.filters,
				"batch-options": g(O).presentation.batchOptions,
				t: Q,
				onApply: Be
			}, null, 8, [
				"selection",
				"adapter",
				"filters",
				"batch-options"
			]),
			j("div", { class: o(["smartbrowser-layout", {
				"flat-mode": g(Z),
				"tree-collapsed": Y.value
			}]) }, [
				!g(Z) && !Y.value ? (w(), N(ni, {
					key: 0,
					adapters: g(a).adapters,
					"active-adapter": g(a).adapter,
					roots: g(O).roots,
					nodes: g(O).nodes,
					breadcrumb: g(O).breadcrumb,
					"selected-node": g(O).selectedNode,
					t: Q,
					onOpen: g(L),
					onAdapter: Je
				}, null, 8, [
					"adapters",
					"active-adapter",
					"roots",
					"nodes",
					"breadcrumb",
					"selected-node",
					"onOpen"
				])) : y("", !0),
				g(Z) ? y("", !0) : (w(), M("button", {
					key: 1,
					type: "button",
					class: "resource-sidebar-handle",
					title: Q(Y.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-label": Q(Y.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-expanded": !Y.value,
					onClick: t[5] ||= (e) => Y.value = !Y.value
				}, [j("span", {
					class: o(Y.value ? "fas fa-chevron-right" : "fas fa-chevron-left"),
					"aria-hidden": "true"
				}, null, 2)], 8, mi)),
				j("main", hi, [n(Kr, {
					breadcrumb: g(O).breadcrumb,
					root: g(O).roots[0],
					"root-icon": Re.value,
					"icon-only-root": !g(Z) && g(O).breadcrumb.length > 1,
					search: g(O).search,
					"sort-by": g(O).sortBy,
					"sort-direction": g(O).sortDirection,
					"sort-fields": g(O).presentation.sortFields,
					"ordering-field": g(O).presentation.orderingField,
					views: g(ve),
					"active-view": g(O).activeView,
					"grid-size": g(O).viewOptions.gridSize,
					"details-thumbnails": g(O).viewOptions.detailsThumbnails,
					"details-date-mode": g(O).viewOptions.detailsDateMode,
					columns: be.value,
					"hidden-columns": g(O).hiddenColumns,
					"shown-columns": g(O).shownColumns,
					"show-info": fe.value,
					multiple: g(a).multiple,
					"can-invert": g(a).multiple && g(A).length > 0,
					"reorder-visible": De.value,
					"reorder-enabled": Oe.value,
					t: Q,
					onOpen: Ze,
					onInvertSelection: g(re),
					onReorder: X,
					onSearch: t[6] ||= (e) => g(O).search = e,
					onSortBy: $e,
					onSortDirectionValue: t[7] ||= (e) => g(O).sortDirection = e,
					onResize: He,
					onToggleThumbnails: t[8] ||= (e) => g(O).viewOptions.detailsThumbnails = !g(O).viewOptions.detailsThumbnails,
					onToggleDateField: et,
					onToggleColumn: Se,
					onView: t[9] ||= (e) => g(O).activeView = e,
					onInfo: pe
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
						loading: g(O).loading,
						"is-dragging": Ce.value,
						"info-open": fe.value,
						"usage-open": le.value
					}]),
					onDragenter: t[11] ||= C((e) => Ce.value = Ee.value, ["prevent"]),
					onDragover: t[12] ||= C(() => {}, ["prevent"]),
					onDragleave: t[13] ||= C((e) => Ce.value = !1, ["self"]),
					onDrop: C(tt, ["prevent"])
				}, [
					g(O).loading ? (w(), M("div", gi, [...t[15] ||= [j("span", {
						class: "spinner-border",
						"aria-hidden": "true"
					}, null, -1)]])) : g(k).length ? (w(), N(f(ye.value.component), {
						key: 2,
						resources: g(k),
						"selected-ids": g(O).selectedIds,
						"focused-id": g(O).focusedId,
						"all-selected": g(A).length > 0 && g(A).every((e) => g(O).selectedIds.includes(e.id)),
						options: g(O).viewOptions,
						actions: g(O).actions,
						"action-available": Ge,
						"default-action": Ue,
						"preview-action": We,
						"sort-by": g(O).sortBy,
						"sort-direction": g(O).sortDirection,
						"sort-fields": g(O).presentation.sortFields,
						"ordering-field": g(O).presentation.orderingField,
						columns: xe.value,
						"grid-fields": g(O).presentation.gridFields,
						t: Q,
						onSelect: g(ee),
						onFocus: g(R),
						onSelectAll: g(te),
						onOpen: g(L),
						onActivate: Ke,
						onAction: qe,
						onSort: Qe
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
					])) : (w(), M("div", _i, [j("span", {
						class: o(g(O).search ? "fas fa-search" : Ee.value ? "fas fa-cloud-upload-alt" : Le.value),
						"aria-hidden": "true"
					}, null, 2), j("p", null, _(g(O).search ? Q("COM_SMARTBROWSER_NO_RESULTS") : Ee.value ? Q("COM_SMARTBROWSER_DROP_UPLOAD") : Q("COM_SMARTBROWSER_EMPTY_STATE")), 1)])),
					Ee.value && Ce.value ? (w(), M("div", vi, [t[16] ||= j("span", { class: "fas fa-cloud-upload-alt" }, null, -1), p(_(Q("COM_SMARTBROWSER_DROP_UPLOAD")), 1)])) : y("", !0),
					fe.value ? (w(), N(cr, {
						key: 4,
						resource: g(F),
						fields: g(O).presentation.infoFields,
						t: Q,
						"usage-definitions": ce.value,
						"usage-values": q.value,
						"usage-errors": oe.value[g(F)?.id] || {},
						"usage-editors": g(V)?.editors,
						"resolve-reference": ie,
						"usage-revision": K.value,
						"preview-actions": ge.value,
						"preview-context": he.value,
						"can-preview": !!We(g(F)) && g(S).canPreview(g(F)) && !g(O).busy,
						onPreview: t[10] ||= (e) => qe(We(g(F)), g(F)),
						onUsageChange: J
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
}, bi = class {
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
}, xi = "supjx.smartbrowser.preferencesResetToken";
function Si(e, t) {
	if (!t || e.getItem(xi) === t) return !1;
	let n = [];
	for (let t = 0; t < e.length; t++) {
		let r = e.key(t);
		r?.startsWith("supjx.smartbrowser.") && r !== xi && r !== "supjx.smartbrowser.editorReturn" && n.push(r);
	}
	return n.forEach((t) => e.removeItem(t)), e.setItem(xi, t), !0;
}
//#endregion
//#region resources/js/core/resetSessionNavigation.js
var Ci = "supjx.smartbrowser.";
function wi(e, t, n) {
	if (!n) return !1;
	let r = `${Ci}session.${t}`, i = e.getItem(r);
	if (e.setItem(r, n), !i || i === n) return !1;
	for (let t = 0; t < e.length; t++) {
		let n = e.key(t);
		if (!(!n?.startsWith(Ci) || n.startsWith(`${Ci}ui.`) || n.startsWith(`${Ci}session.`))) try {
			let t = JSON.parse(e.getItem(n));
			if (!t || typeof t != "object" || Array.isArray(t) || !("selectedNode" in t) && !("filters" in t)) continue;
			delete t.selectedNode, delete t.filters, e.setItem(n, JSON.stringify(t));
		} catch {}
	}
	return !0;
}
function Ti(e) {
	let t = new URL(e);
	if (t.searchParams.delete("node"), t.searchParams.has("flatFromAdapter")) {
		let e = t.searchParams.get("flatFromBrowseRoot");
		e ? t.searchParams.set("browseRoot", e) : t.searchParams.delete("browseRoot"), t.searchParams.delete("flatScope"), t.searchParams.delete("flatFromNode"), t.searchParams.delete("flatFromBrowseRoot"), t.searchParams.delete("flatFromAdapter");
	}
	return t.toString();
}
//#endregion
//#region resources/js/main.js
var $ = Joomla.getOptions("com_smartbrowser", {}), Ei = null;
try {
	Ei = window.parent !== window && $.pickerInstance ? window.parent.SmartBrowserPicker?.context($.pickerInstance, window) : null;
} catch {}
$.pickerContext = Ei, Si(window.sessionStorage, $.preferencesResetToken);
var Di = wi(window.sessionStorage, $.application, $.csrfToken) ? Ti(window.location.href) : window.location.href;
if (Di !== window.location.href) window.location.replace(Di);
else {
	let e = new B($), t = $.browseRoot ? `supjx.smartbrowser.${$.adapter}.${$.browseRoot}` : `supjx.smartbrowser.${$.adapter}`, n = new bi(window.sessionStorage, t), r = re().register({
		id: "grid",
		label: "COM_SMARTBROWSER_GRID",
		icon: "fas fa-th",
		component: F,
		supportsSize: !0,
		controls: ["sort", "zoom"],
		options: { gridSize: "md" }
	}).register({
		id: "details",
		label: "COM_SMARTBROWSER_DETAILS",
		icon: "fas fa-list",
		component: R,
		supportsSize: !1,
		controls: ["thumbnails", "dateField"],
		options: {
			detailsThumbnails: !1,
			detailsDateMode: "modified"
		}
	}), i = ee({
		options: $,
		api: e,
		persistence: n,
		viewRegistry: r
	}), a = new te(e, i.state, () => i.load(), (e) => Joomla.Text?._(e, e) || e, $.editorMode, $.application);
	window.SmartBrowser = {
		...window.SmartBrowser,
		open(e = {}) {
			let t = e.showContextResources ?? $.showContextResources ?? !1, n = e.browseRoot ? `&browseRoot=${encodeURIComponent(e.browseRoot)}` : "", r = e.defaultView ? `&defaultView=${encodeURIComponent(e.defaultView)}` : "", i = e.allowedResourceTypes?.length ? `&allowedResourceTypes=${encodeURIComponent(e.allowedResourceTypes.join(","))}` : "", a = e.showAdapterSwitcher ? "&showAdapterSwitcher=1" : "";
			window.location.href = `${$.returnUrl}&adapter=${encodeURIComponent(e.adapter || $.adapter)}&mode=${encodeURIComponent(e.mode || "select")}&multiple=${+!!e.multiple}&selectionTarget=${encodeURIComponent(e.selectionTarget || "item")}&showContextResources=${+!!t}${n}${r}${i}${a}`;
		},
		registerView: (e) => r.register(e)
	}, E(yi).provide("browser", i).provide("resourceApi", e).provide("smartBrowserOptions", $).provide("viewRegistry", r).provide("actionDriver", a).mount("#smartbrowser-app");
}
//#endregion
