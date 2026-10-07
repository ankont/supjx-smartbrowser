import { A as e, B as t, C as n, D as r, E as i, F as a, H as o, I as s, L as c, M as l, N as u, O as d, P as f, S as p, T as m, U as h, V as g, W as _, _ as v, b as y, d as b, f as x, g as S, h as C, j as w, k as T, l as E, m as D, p as O, t as k, u as A, v as j, x as M, y as N, z as P } from "./visual-runtime-BsRY_8Qs.js";
import { a as F, c as ee, d as I, i as te, l as L, n as ne, o as R, r as re, s as ie, t as z, u as B } from "./visual-runtime-C3qHcZ7w.js";
//#region resources/js/core/displayMode.js
var V = [
	"normal",
	"wide",
	"focus"
], ae = "smartbrowser.displayMode";
function oe(e, t = () => {}) {
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
		if (!V.includes(r)) return;
		let u = n;
		if (c(), n = r, t(n), l) try {
			o?.setItem(ae, n);
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
		let e = o?.getItem(ae);
		V.includes(e) && e !== "normal" && l(e, !1);
	} catch {}
	return {
		get mode() {
			return n;
		},
		set: l,
		cycle: () => l(V[(V.indexOf(n) + 1) % 3]),
		destroy() {
			l("normal", !1), a.removeEventListener("keydown", u);
		}
	};
}
//#endregion
//#region resources/js/components/ResourceActions.vue
var H = { class: "resource-actions-area" }, U = [
	"href",
	"title",
	"aria-label"
], W = { class: "resource-action-label" }, G = [
	"disabled",
	"title",
	"aria-label"
], se = { class: "resource-action-label" }, ce = ["title", "aria-label"], le = { class: "resource-action-label" }, K = [
	"title",
	"aria-label",
	"disabled",
	"onClick"
], ue = {
	key: 0,
	class: "resource-action-label"
}, de = [
	"aria-expanded",
	"title",
	"aria-label"
], fe = { class: "resource-action-label" }, pe = {
	key: 0,
	class: "resource-action-menu",
	role: "menu"
}, me = ["disabled", "onClick"], he = [
	"disabled",
	"title",
	"aria-label"
], q = { class: "resource-action-label" }, ge = {
	key: 5,
	class: "resource-filter-buttons"
}, _e = [
	"aria-expanded",
	"title",
	"aria-label"
], ve = { class: "resource-action-label" }, ye = {
	key: 0,
	class: "badge bg-primary"
}, be = ["disabled", "title"], xe = [
	"title",
	"aria-label",
	"aria-pressed"
], Se = [
	"href",
	"target",
	"rel",
	"title",
	"aria-label"
], Ce = {
	key: 0,
	class: "resource-action-filters"
}, J = ["value", "onChange"], we = ["value"], Te = {
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
		}), (e, t) => (w(), M("div", H, [j("div", {
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
				j("span", W, _(n.t(n.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD")), 1)
			], 8, U)) : y("", !0),
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
				j("span", se, _(n.t("COM_SMARTBROWSER_SELECT")), 1)
			], 8, G)) : y("", !0),
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
				j("span", le, _(n.t("JOPTION_NO_USER")), 1)
			], 8, ce)) : y("", !0),
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
			}, null, 2), t.creationRole === "contextual" ? y("", !0) : (w(), M("span", ue, _(n.t(t.label)), 1))], 10, K))), 128)),
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
				j("span", fe, _(n.t("COM_SMARTBROWSER_ACTIONS")), 1),
				t[15] ||= p(),
				t[16] ||= j("span", {
					class: "fas fa-angle-down",
					"aria-hidden": "true"
				}, null, -1)
			], 8, de), i.value ? (w(), M("div", pe, [(w(!0), M(S, null, l(O.value, (t) => (w(), M("div", {
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
			}, null, 2), p(" " + _(n.t(t.label)), 1)], 10, me)]))), 128))])) : y("", !0)], 512)) : y("", !0),
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
				j("span", q, _(n.t("COM_SMARTBROWSER_BATCH")), 1)
			], 8, he)) : y("", !0),
			n.filters?.length ? (w(), M("div", ge, [j("button", {
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
				j("span", ve, _(n.t("COM_SMARTBROWSER_FILTER_OPTIONS")), 1),
				b.value ? (w(), M("span", ye, _(b.value), 1)) : y("", !0),
				j("span", {
					class: o(["fas fa-angle-down resource-filter-caret", { open: n.filtersOpen }]),
					"aria-hidden": "true"
				}, null, 2)
			], 10, _e), j("button", {
				type: "button",
				class: "btn resource-filter-clear",
				disabled: !b.value,
				title: n.t("JCLEAR"),
				onClick: t[5] ||= (t) => e.$emit("clear-filters")
			}, _(n.t("JCLEAR")), 9, be)])) : y("", !0),
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
			}, null, -1)]], 10, xe)) : y("", !0),
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
			}, null, -1)]], 8, Se)) : y("", !0),
			u(e.$slots, "display-controls")
		], 512), n.filters?.length && n.filtersOpen ? (w(), M("div", Ce, [(w(!0), M(S, null, l(n.filters, (t) => (w(), M("label", { key: t.id }, [j("span", null, _(n.t(t.label)), 1), t.type === "select" ? (w(), M("select", {
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
		}, _(x(t, e)), 9, we))), 128))], 40, J)) : y("", !0)]))), 128))])) : y("", !0)]));
	}
}, Y = ["placeholder"], Ee = ["multiple"], De = ["selected"], Oe = ["value", "selected"], X = {
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
		}, _(e.t(t.label)), 9, Oe))), 128))], 40, Ee)], 10, Y));
	}
}, Z = { class: "resource-batch-field" }, ke = ["aria-label"], Ae = ["aria-pressed", "onClick"], je = {
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
		return (n, r) => (w(), M("div", Z, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), j("div", {
			class: "btn-group resource-batch-mode-toggle",
			role: "group",
			"aria-label": e.t("COM_SMARTBROWSER_BATCH_MODE")
		}, [(w(), M(S, null, l(t, (t) => j("button", {
			key: t.value,
			type: "button",
			class: o(["btn", e.modelValue === t.value ? "is-active" : ""]),
			"aria-pressed": e.modelValue === t.value,
			onClick: (e) => n.$emit("update:modelValue", t.value)
		}, _(e.t(t.label)), 11, Ae)), 64))], 8, ke)]));
	}
}, Me = ["aria-label"], Ne = { class: "resource-batch-body" }, Pe = {
	class: "resource-batch-heading",
	role: "heading",
	"aria-level": "3"
}, Fe = ["open"], Ie = { class: "resource-batch-fields" }, Le = ["aria-label"], Re = {
	key: 1,
	class: "text-danger"
}, Q = ["open"], ze = { class: "resource-batch-fields" }, Be = ["disabled"], Ve = { class: "resource-batch-check" }, He = { key: 0 }, Ue = ["open"], We = { class: "resource-batch-fields" }, Ge = { class: "input-group" }, Ke = ["open"], qe = ["onClick"], Je = { class: "resource-batch-fields" }, Ye = ["onUpdate:modelValue", "aria-label"], Xe = { value: "" }, Ze = ["value"], Qe = ["open"], $e = {
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
		let a = e, s = i, u = m("resourceApi"), d = t(!1), f = t([]), h = t(!1), E = t(""), D = 0, O = t(null), k = t(null), F = t(null), ee = v(() => a.adapter.replace(/^flat-/, "")), I = v(() => ee.value === "media"), te = v(() => ["articles", "articles-by-tag"].includes(ee.value)), L = v(() => ee.value === "categories"), ne = v(() => ee.value === "tags"), R = v(() => ee.value === "menus"), re = v(() => ee.value === "users"), ie = v(() => ({
			articles: "article:",
			"articles-by-tag": "article:",
			categories: "category:",
			tags: "tag:",
			menus: "menu-item:",
			users: "user:"
		})[ee.value]), z = v(() => ie.value ? a.selection.filter((e) => e.id.startsWith(ie.value)) : a.selection), B = {
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
		}, V = {
			changeLanguage: !1,
			language: "",
			changeAccess: !1,
			access: "",
			tagsOpen: !1,
			tagAdd: [],
			tagRemove: [],
			placement: "none",
			category: ""
		}, ae = {
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
		}, oe = {
			groupOpen: !1,
			groupAction: "add",
			group: "",
			resetOpen: !1,
			reset: "yes"
		}, H = P({ ...B }), U = P({ ...V }), W = P({ ...ae }), G = P({ ...oe }), se = [{
			id: "language",
			enabled: "changeLanguage",
			label: "COM_SMARTBROWSER_BATCH_SET_LANGUAGE",
			placeholder: "COM_SMARTBROWSER_SELECT_LANGUAGE"
		}, {
			id: "access",
			enabled: "changeAccess",
			label: "COM_SMARTBROWSER_BATCH_SET_ACCESS",
			placeholder: "COM_SMARTBROWSER_SELECT_ACCESS"
		}], ce = se, le = v(() => JSON.stringify(H) !== JSON.stringify(B) || JSON.stringify(U) !== JSON.stringify(V) || JSON.stringify(W) !== JSON.stringify(ae) || JSON.stringify(G) !== JSON.stringify(oe)), K = (e) => (a.batchOptions[e] || a.filters.find((t) => t.id === e)?.options || []).filter((e) => String(e.value) !== ""), ue = v(() => (a.batchOptions.menu || []).flatMap((e) => [{
			value: `${e.value}.0`,
			label: e.label
		}, ...(a.batchOptions.menuParent || []).filter((t) => t.menu === e.value).map((t) => ({
			value: `${e.value}.${t.value}`,
			label: `- ${t.label}`
		}))])), de = v(() => H.zipName.trim().replace(/\.zip$/i, "")), fe = (e) => {
			U.tagAdd = e, U.tagRemove = U.tagRemove.filter((t) => !e.includes(t));
		}, pe = (e) => {
			U.tagRemove = e, U.tagAdd = U.tagAdd.filter((t) => !e.includes(t));
		}, me = (e) => {
			W.tagAdd = e, W.tagRemove = W.tagRemove.filter((t) => !e.includes(t));
		}, he = (e) => {
			W.tagRemove = e, W.tagAdd = W.tagAdd.filter((t) => !e.includes(t));
		}, q = (e, t) => a.t(K(e).find((e) => String(e.value) === String(t))?.label || t), ge = v(() => {
			let e = [];
			if (I.value) H.placement !== "none" && e.push({
				id: "placement",
				title: a.t(H.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
				parameters: [f.value.find((e) => e.value === H.destination)?.path || "..."]
			}), H.rename && e.push({
				id: "rename",
				title: a.t("COM_SMARTBROWSER_BATCH_RENAME"),
				parameters: [
					...H.find ? [`${a.t("COM_SMARTBROWSER_BATCH_FIND")}: ${H.find} → ${H.replace}`] : [],
					...H.prefix ? [`${a.t("COM_SMARTBROWSER_BATCH_PREFIX")}: ${H.prefix}`] : [],
					...H.suffix ? [`${a.t("COM_SMARTBROWSER_BATCH_SUFFIX")}: ${H.suffix}`] : [],
					...H.number ? [`${a.t("COM_SMARTBROWSER_BATCH_NUMBER")}: ${H.startAt}`] : []
				],
				preview: !0
			}), H.zip && e.push({
				id: "zip",
				title: a.t("COM_SMARTBROWSER_BATCH_ZIP"),
				parameters: [`${de.value}.zip`]
			});
			else if (te.value) {
				for (let t of se) U[t.enabled] && U[t.id] && e.push({
					id: t.id,
					title: a.t(t.label),
					parameters: [q(t.id, U[t.id])]
				});
				U.tagsOpen && U.tagAdd.length && e.push({
					id: "tag-add",
					title: a.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: U.tagAdd.map((e) => q("tag", e))
				}), U.tagsOpen && U.tagRemove.length && e.push({
					id: "tag-remove",
					title: a.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: U.tagRemove.map((e) => q("tag", e))
				}), U.placement !== "none" && e.unshift({
					id: "placement",
					title: a.t(U.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [U.category ? q("category", U.category) : "..."]
				});
			} else if (L.value || ne.value || R.value) {
				for (let t of ce) W[t.enabled] && W[t.id] && e.push({
					id: t.id,
					title: a.t(t.label),
					parameters: [q(t.id, W[t.id])]
				});
				L.value && (W.tagsOpen && W.tagAdd.length && e.push({
					id: "tag-add",
					title: a.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: W.tagAdd.map((e) => q("tag", e))
				}), W.tagsOpen && W.tagRemove.length && e.push({
					id: "tag-remove",
					title: a.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: W.tagRemove.map((e) => q("tag", e))
				}), W.placement !== "none" && e.unshift({
					id: "placement",
					title: a.t(W.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [W.category ? q("category", W.category) : "..."]
				}), W.flipOrdering && e.push({
					id: "flip",
					title: a.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING"),
					parameters: []
				})), R.value && W.placement !== "none" && e.unshift({
					id: "placement",
					title: a.t(W.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [ue.value.find((e) => e.value === W.menuDestination)?.label || "..."]
				});
			} else re.value && (G.groupOpen && G.group && e.push({
				id: "group",
				title: a.t({
					add: "COM_SMARTBROWSER_BATCH_GROUP_ADD",
					remove: "COM_SMARTBROWSER_BATCH_GROUP_REMOVE",
					set: "COM_SMARTBROWSER_BATCH_GROUP_SET"
				}[G.groupAction]),
				parameters: [q("group", G.group)]
			}), G.resetOpen && e.push({
				id: "reset",
				title: a.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET"),
				parameters: [a.t(G.reset === "yes" ? "JYES" : "JNO")]
			}));
			return e;
		}), _e = v(() => !(!z.value.length || !ge.value.length || I.value && H.placement !== "none" && !f.value.some((e) => e.value === H.destination) || te.value && U.placement !== "none" && !U.category || L.value && W.placement !== "none" && !W.category || R.value && W.placement !== "none" && !ue.value.some((e) => e.value === W.menuDestination) || I.value && H.zip && !de.value)), ve = () => {
			if (I.value) return {
				...H,
				zipName: de.value
			};
			if (te.value) return {
				language: U.changeLanguage ? U.language : "",
				access: U.changeAccess ? U.access : "",
				tagAdd: U.tagsOpen ? U.tagAdd : [],
				tagRemove: U.tagsOpen ? U.tagRemove : [],
				placement: U.placement,
				category: U.category
			};
			if (re.value) return {
				group: G.groupOpen ? G.group : "",
				groupAction: G.groupAction === "remove" ? "del" : G.groupAction,
				reset: G.resetOpen ? G.reset : ""
			};
			let e = W.menuDestination.lastIndexOf(".");
			return {
				language: W.changeLanguage ? W.language : "",
				access: W.changeAccess ? W.access : "",
				tagAdd: L.value && W.tagsOpen ? W.tagAdd : [],
				tagRemove: L.value && W.tagsOpen ? W.tagRemove : [],
				placement: W.placement,
				category: W.category,
				flipOrdering: L.value && W.flipOrdering,
				menu: R.value && e >= 0 ? W.menuDestination.slice(0, e) : "",
				menuParent: R.value && e >= 0 ? W.menuDestination.slice(e + 1) : "0"
			};
		}, ye = async () => {
			if (!d.value && _e.value) {
				d.value = !0;
				try {
					await new Promise((e, t) => s("apply", {
						selection: z.value.map((e) => e.id),
						payload: ve(),
						resolve: e,
						reject: t
					})), Ee();
				} catch (e) {
					window.Joomla?.renderMessages?.({ error: [e.message || String(e)] });
				} finally {
					d.value = !1;
				}
			}
		}, be = (e, t) => {
			if (!H.rename) return e.title;
			let n = e.kind === "item" ? e.title.lastIndexOf(".") : -1, r = n > 0 ? e.title.slice(0, n) : e.title, i = n > 0 ? e.title.slice(n) : "", a = H.find ? r.split(H.find).join(H.replace) : r, o = H.number ? `-${String(Math.max(1, Number(H.startAt) || 1) + t).padStart(2, "0")}` : "";
			return `${H.prefix}${a}${H.suffix}${o}${i}`;
		}, xe = v(() => z.value.map((e, t) => {
			let n = e.id.includes(":") ? e.id.slice(e.id.indexOf(":") + 1) : e.title, r = H.placement !== "none" && H.destination ? `${H.destination.slice(H.destination.indexOf(":") + 1).replace(/\/$/, "")}/` : n.slice(0, n.lastIndexOf("/") + 1);
			return {
				id: e.id,
				before: n,
				after: r + be(e, t)
			};
		})), Se = async () => {
			let e = ++D;
			h.value = !0, E.value = "";
			try {
				let t = await u.execute("batchFolders", z.value.map((e) => e.id));
				e === D && (f.value = t);
			} catch (t) {
				e === D && (E.value = t.message || String(t));
			} finally {
				e === D && (h.value = !1);
			}
		}, Ce = () => {
			Object.assign(H, B), Object.assign(U, V), Object.assign(W, ae), Object.assign(G, oe), f.value = [], O.value?.showModal(), I.value && Se();
		}, J = () => k.value?.showModal(), we = () => {
			k.value?.open && k.value.close();
		}, Te = () => F.value?.showModal(), Y = () => {
			F.value?.open && F.value.close();
		}, Ee = () => {
			D++, we(), Y(), O.value?.close();
		};
		return r({
			open: Ce,
			close: Ee
		}), T(() => {
			window.SmartBrowserDialogDismiss.install(O.value, () => le.value), window.SmartBrowserDialogDismiss.install(k.value), window.SmartBrowserDialogDismiss.install(F.value), O.value.addEventListener("close", () => {
				we(), Y();
			});
		}), (t, r) => (w(), M(S, null, [
			j("dialog", {
				ref_key: "dialog",
				ref: O,
				class: "resource-batch-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_BATCH_ACTIONS")
			}, [j("div", Ne, [j("div", Pe, _(e.t("COM_SMARTBROWSER_BATCH_SELECT_ACTIONS")), 1), I.value ? (w(), M(S, { key: 0 }, [
				j("details", {
					class: "resource-batch-step",
					open: H.placement !== "none"
				}, [j("summary", { onClick: r[0] ||= C((e) => H.placement = H.placement === "none" ? "move" : "none", ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_PLACEMENT")), 1), j("div", Ie, [n(je, {
					modelValue: H.placement,
					"onUpdate:modelValue": r[1] ||= (e) => H.placement = e,
					t: e.t
				}, null, 8, ["modelValue", "t"]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_DESTINATION_FOLDER")) + " ", 1), h.value ? (w(), M("span", {
					key: 0,
					class: "spinner-border spinner-border-sm",
					role: "status",
					"aria-label": e.t("COM_SMARTBROWSER_LOADING_FOLDERS")
				}, null, 8, Le)) : E.value ? (w(), M("span", Re, _(E.value), 1)) : (w(), N(X, {
					key: 2,
					modelValue: H.destination,
					"onUpdate:modelValue": r[2] ||= (e) => H.destination = e,
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
					open: H.rename
				}, [j("summary", { onClick: r[3] ||= C((e) => H.rename = !H.rename, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_RENAME")), 1), j("div", ze, [
					j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_FIND")), 1), c(j("input", {
						"onUpdate:modelValue": r[4] ||= (e) => H.find = e,
						type: "text",
						class: "form-control"
					}, null, 512), [[x, H.find]])]),
					j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_REPLACE")), 1), c(j("input", {
						"onUpdate:modelValue": r[5] ||= (e) => H.replace = e,
						type: "text",
						class: "form-control",
						disabled: !H.find
					}, null, 8, Be), [[x, H.replace]])]),
					j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_PREFIX")), 1), c(j("input", {
						"onUpdate:modelValue": r[6] ||= (e) => H.prefix = e,
						type: "text",
						class: "form-control"
					}, null, 512), [[x, H.prefix]])]),
					j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_SUFFIX")), 1), c(j("input", {
						"onUpdate:modelValue": r[7] ||= (e) => H.suffix = e,
						type: "text",
						class: "form-control"
					}, null, 512), [[x, H.suffix]])]),
					j("label", Ve, [c(j("input", {
						"onUpdate:modelValue": r[8] ||= (e) => H.number = e,
						type: "checkbox",
						class: "form-check-input"
					}, null, 512), [[A, H.number]]), p(" " + _(e.t("COM_SMARTBROWSER_BATCH_NUMBER")), 1)]),
					H.number ? (w(), M("label", He, [p(_(e.t("COM_SMARTBROWSER_BATCH_START_AT")), 1), c(j("input", {
						"onUpdate:modelValue": r[9] ||= (e) => H.startAt = e,
						type: "number",
						min: "1",
						class: "form-control"
					}, null, 512), [[
						x,
						H.startAt,
						void 0,
						{ number: !0 }
					]])])) : y("", !0)
				])], 8, Q),
				j("details", {
					class: "resource-batch-step",
					open: H.zip
				}, [j("summary", { onClick: r[10] ||= C((e) => H.zip = !H.zip, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_ZIP")), 1), j("div", We, [j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_ZIP_NAME")), 1), j("span", Ge, [c(j("input", {
					"onUpdate:modelValue": r[11] ||= (e) => H.zipName = e,
					type: "text",
					class: "form-control",
					onBlur: r[12] ||= (e) => H.zipName = de.value
				}, null, 544), [[x, H.zipName]]), r[30] ||= j("span", { class: "input-group-text" }, ".zip", -1)])])])], 8, Ue)
			], 64)) : te.value ? (w(), M(S, { key: 1 }, [
				(w(), M(S, null, l(se, (t) => j("details", {
					key: t.id,
					class: "resource-batch-step",
					open: U[t.enabled]
				}, [j("summary", { onClick: C((e) => U[t.enabled] = !U[t.enabled], ["prevent"]) }, _(e.t(t.label)), 9, qe), j("div", Je, [c(j("select", {
					"onUpdate:modelValue": (e) => U[t.id] = e,
					class: "form-select",
					"aria-label": e.t(t.label)
				}, [j("option", Xe, _(e.t(t.placeholder)), 1), (w(!0), M(S, null, l(K(t.id), (t) => (w(), M("option", {
					key: t.value,
					value: t.value
				}, _(e.t(t.label)), 9, Ze))), 128))], 8, Ye), [[b, U[t.id]]])])], 8, Ke)), 64)),
				j("details", {
					class: "resource-batch-step",
					open: U.tagsOpen
				}, [j("summary", { onClick: r[13] ||= C((e) => U.tagsOpen = !U.tagsOpen, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), U.tagsOpen ? (w(), M("div", $e, [j("div", et, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), n(X, {
					"model-value": U.tagAdd,
					options: K("tag"),
					multiple: "",
					placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
					t: e.t,
					"onUpdate:modelValue": fe
				}, null, 8, [
					"model-value",
					"options",
					"t"
				])]), j("div", tt, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), n(X, {
					"model-value": U.tagRemove,
					options: K("tag"),
					multiple: "",
					placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
					t: e.t,
					"onUpdate:modelValue": pe
				}, null, 8, [
					"model-value",
					"options",
					"t"
				])])])) : y("", !0)], 8, Qe),
				j("details", {
					class: "resource-batch-step",
					open: U.placement !== "none"
				}, [j("summary", { onClick: r[14] ||= C((e) => U.placement = U.placement === "none" ? "move" : "none", ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), U.placement === "none" ? y("", !0) : (w(), M("div", rt, [n(je, {
					modelValue: U.placement,
					"onUpdate:modelValue": r[15] ||= (e) => U.placement = e,
					t: e.t
				}, null, 8, ["modelValue", "t"]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_CATEGORY")), 1), n(X, {
					modelValue: U.category,
					"onUpdate:modelValue": r[16] ||= (e) => U.category = e,
					options: K("category"),
					placeholder: "COM_SMARTBROWSER_SELECT_CATEGORY",
					t: e.t
				}, null, 8, [
					"modelValue",
					"options",
					"t"
				])])]))], 8, nt)
			], 64)) : L.value || ne.value || R.value ? (w(), M(S, { key: 2 }, [
				(w(!0), M(S, null, l(g(ce), (t) => (w(), M("details", {
					key: t.id,
					class: "resource-batch-step",
					open: W[t.enabled]
				}, [j("summary", { onClick: C((e) => W[t.enabled] = !W[t.enabled], ["prevent"]) }, _(e.t(t.label)), 9, at), W[t.enabled] ? (w(), M("div", ot, [c(j("select", {
					"onUpdate:modelValue": (e) => W[t.id] = e,
					class: "form-select",
					"aria-label": e.t(t.label)
				}, [j("option", ct, _(e.t(t.placeholder)), 1), (w(!0), M(S, null, l(K(t.id), (t) => (w(), M("option", {
					key: t.value,
					value: t.value
				}, _(e.t(t.label)), 9, lt))), 128))], 8, st), [[b, W[t.id]]])])) : y("", !0)], 8, it))), 128)),
				L.value ? (w(), M("details", {
					key: 0,
					class: "resource-batch-step",
					open: W.tagsOpen
				}, [j("summary", { onClick: r[17] ||= C((e) => W.tagsOpen = !W.tagsOpen, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), W.tagsOpen ? (w(), M("div", dt, [j("div", ft, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), n(X, {
					"model-value": W.tagAdd,
					options: K("tag"),
					multiple: "",
					placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
					t: e.t,
					"onUpdate:modelValue": me
				}, null, 8, [
					"model-value",
					"options",
					"t"
				])]), j("div", pt, [j("span", null, _(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), n(X, {
					"model-value": W.tagRemove,
					options: K("tag"),
					multiple: "",
					placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
					t: e.t,
					"onUpdate:modelValue": he
				}, null, 8, [
					"model-value",
					"options",
					"t"
				])])])) : y("", !0)], 8, ut)) : y("", !0),
				L.value ? (w(), M("details", {
					key: 1,
					class: "resource-batch-step",
					open: W.placement !== "none"
				}, [j("summary", { onClick: r[18] ||= C((e) => W.placement = W.placement === "none" ? "move" : "none", ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), W.placement === "none" ? y("", !0) : (w(), M("div", ht, [n(je, {
					modelValue: W.placement,
					"onUpdate:modelValue": r[19] ||= (e) => W.placement = e,
					t: e.t
				}, null, 8, ["modelValue", "t"]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_PARENT_CATEGORY")), 1), n(X, {
					modelValue: W.category,
					"onUpdate:modelValue": r[20] ||= (e) => W.category = e,
					options: K("category"),
					placeholder: "COM_SMARTBROWSER_SELECT_CATEGORY",
					t: e.t
				}, null, 8, [
					"modelValue",
					"options",
					"t"
				])])]))], 8, mt)) : y("", !0),
				L.value ? (w(), M("details", {
					key: 2,
					class: "resource-batch-step",
					open: W.flipOrdering
				}, [j("summary", { onClick: r[21] ||= C((e) => W.flipOrdering = !W.flipOrdering, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING")), 1)], 8, gt)) : y("", !0),
				R.value ? (w(), M("details", {
					key: 3,
					class: "resource-batch-step",
					open: W.placement !== "none"
				}, [j("summary", { onClick: r[22] ||= C((e) => W.placement = W.placement === "none" ? "move" : "none", ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_MENU_PLACEMENT")), 1), W.placement === "none" ? y("", !0) : (w(), M("div", vt, [n(je, {
					modelValue: W.placement,
					"onUpdate:modelValue": r[23] ||= (e) => W.placement = e,
					t: e.t
				}, null, 8, ["modelValue", "t"]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_MENU_DESTINATION")), 1), n(X, {
					modelValue: W.menuDestination,
					"onUpdate:modelValue": r[24] ||= (e) => W.menuDestination = e,
					options: ue.value,
					placeholder: "COM_SMARTBROWSER_SELECT_MENU",
					t: e.t
				}, null, 8, [
					"modelValue",
					"options",
					"t"
				])])]))], 8, _t)) : y("", !0)
			], 64)) : re.value ? (w(), M(S, { key: 3 }, [j("details", {
				class: "resource-batch-step",
				open: G.groupOpen
			}, [j("summary", { onClick: r[25] ||= C((e) => G.groupOpen = !G.groupOpen, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_USER_GROUPS")), 1), G.groupOpen ? (w(), M("div", bt, [j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), c(j("select", {
				"onUpdate:modelValue": r[26] ||= (e) => G.groupAction = e,
				class: "form-select resource-batch-mode-select"
			}, [
				j("option", xt, _(e.t("COM_SMARTBROWSER_BATCH_GROUP_ADD")), 1),
				j("option", St, _(e.t("COM_SMARTBROWSER_BATCH_GROUP_REMOVE")), 1),
				j("option", Ct, _(e.t("COM_SMARTBROWSER_BATCH_GROUP_SET")), 1)
			], 512), [[b, G.groupAction]])]), j("label", null, [p(_(e.t("COM_SMARTBROWSER_USER_GROUP")), 1), n(X, {
				modelValue: G.group,
				"onUpdate:modelValue": r[27] ||= (e) => G.group = e,
				options: K("group"),
				placeholder: "COM_SMARTBROWSER_SELECT_USER_GROUP",
				t: e.t
			}, null, 8, [
				"modelValue",
				"options",
				"t"
			])])])) : y("", !0)], 8, yt), j("details", {
				class: "resource-batch-step",
				open: G.resetOpen
			}, [j("summary", { onClick: r[28] ||= C((e) => G.resetOpen = !G.resetOpen, ["prevent"]) }, _(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), G.resetOpen ? (w(), M("div", Tt, [j("label", null, [p(_(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), c(j("select", {
				"onUpdate:modelValue": r[29] ||= (e) => G.reset = e,
				class: "form-select"
			}, [j("option", Et, _(e.t("JYES")), 1), j("option", Dt, _(e.t("JNO")), 1)], 512), [[b, G.reset]])])])) : y("", !0)], 8, wt)], 64)) : y("", !0)]), j("div", Ot, [j("div", kt, [j("div", At, _(e.t("COM_SMARTBROWSER_BATCH_PREVIEW")), 1), ge.value.length ? (w(), M("div", jt, [(w(!0), M(S, null, l(ge.value, (t, n) => (w(), M("div", {
				key: t.id,
				class: "resource-batch-sequence-item"
			}, [n ? (w(), M("span", Mt)) : y("", !0), j("div", Nt, [j("div", Pt, _(t.title), 1), t.parameters.length || t.preview ? (w(), M("div", Ft, [(w(!0), M(S, null, l(t.parameters, (e) => (w(), M("span", { key: e }, _(e), 1))), 128)), t.preview ? (w(), M("button", {
				key: 0,
				type: "button",
				class: "resource-batch-preview-link",
				onClick: J
			}, _(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")), 1)) : y("", !0)])) : y("", !0)])]))), 128))])) : (w(), M("p", It, _(e.t("COM_SMARTBROWSER_BATCH_NO_CHANGES")), 1))]), j("div", Lt, [j("button", {
				type: "button",
				class: "resource-batch-items-link",
				onClick: Te
			}, _(z.value.length) + " " + _(e.t(z.value.length === 1 ? "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_ONE" : "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_MANY")), 1), j("div", Rt, [j("button", {
				type: "button",
				class: "btn btn-primary",
				disabled: d.value || !_e.value,
				onClick: ye
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
			}, [j("div", Vt, [j("strong", null, _(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")) + " (" + _(xe.value.length) + ")", 1), j("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: we
			}, null, 8, Ht)]), j("div", Ut, [(w(!0), M(S, null, l(xe.value, (e) => (w(), M("div", {
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
				onClick: Y
			}, null, 8, Jt)]), j("ul", Yt, [(w(!0), M(S, null, l(z.value, (e) => (w(), M("li", { key: e.id }, [j("span", {
				class: o(e.icon || "fas fa-file"),
				"aria-hidden": "true"
			}, null, 2), j("span", null, _(e.title), 1)]))), 128))])], 8, Kt)
		], 64));
	}
}, Zt = /^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/, Qt = (e, t) => Object.prototype.hasOwnProperty.call(e, t), $t = (e) => e === void 0 ? void 0 : JSON.parse(JSON.stringify(e)), en = (e) => e == null || typeof e == "string" && !e.trim(), tn = /* @__PURE__ */ new Set([
	"text",
	"textarea",
	"boolean",
	"select",
	"number",
	"resource"
]);
function nn(e, t = {}) {
	if (!e || e.unavailable || !t || typeof t != "object") return [];
	let n = Array.isArray(e.selectionCapabilities) ? e.selectionCapabilities : [], r = /* @__PURE__ */ new Set();
	return n.flatMap((e) => {
		let n = e?.key;
		if (!Zt.test(n || "") || ![
			"string",
			"boolean",
			"number",
			"resource",
			"object"
		].includes(e.type) || r.has(n) || !Qt(t, n) || t[n] === !1) return [];
		r.add(n);
		let i = t[n] && typeof t[n] == "object" ? t[n] : {};
		return [{
			...e,
			policy: i,
			presentation: i.presentation === "secondary" ? "secondary" : "primary",
			default: Qt(i, "default") ? i.default : e.default,
			required: i.required === !0
		}];
	});
}
function rn(e) {
	return !e || typeof e != "object" || Array.isArray(e) || typeof e.adapter != "string" || !/^[a-z][a-z0-9-]*$/.test(e.adapter) || typeof e.id != "string" || !e.id || e.id.length > 2048 ? null : {
		adapter: e.adapter,
		id: e.id
	};
}
function an(e, t) {
	if (en(t)) return e.required ? "COM_SMARTBROWSER_USAGE_REQUIRED" : null;
	let n = e.type;
	if (n === "string" && typeof t != "string" || n === "boolean" && typeof t != "boolean" || n === "number" && (typeof t != "number" || !Number.isFinite(t)) || n === "object" && (typeof t != "object" || Array.isArray(t)) || n === "resource" && !rn(t)) return "COM_SMARTBROWSER_USAGE_INVALID";
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
function on({ profile: e = {}, initialUsage: t = {}, resolveReference: n, editors: r = {} } = {}) {
	let i = /* @__PURE__ */ new Map(), a = (t) => nn(t, e);
	function o(e) {
		if (!e) return {};
		i.has(e.id) || i.set(e.id, {});
		let n = i.get(e.id);
		for (let r of a(e)) Qt(n, r.key) || (n[r.key] = $t(Qt(t[e.id] || {}, r.key) ? t[e.id][r.key] : r.default ?? null));
		return $t(n);
	}
	function s(e, t, n) {
		a(e).some((e) => e.key === t) && (o(e), i.get(e.id)[t] = $t(n));
	}
	async function c(e) {
		let t = {}, i = {};
		for (let s of e) {
			let e = o(s), c = {};
			for (let i of a(s)) {
				let a = e[i.key], o = an(i, a);
				if (!o && i.type === "resource" && !en(a)) {
					let e = rn(a), t = i.picker || {};
					if (t.adapter && e.adapter !== t.adapter) o = "COM_SMARTBROWSER_USAGE_INVALID";
					else try {
						let r = await n(e, t);
						(!r || r.unavailable || r.selectable === !1 || t.selectionTarget === "item" && r.kind !== "item" || t.selectionTarget === "node" && r.kind !== "node" || t.allowedResourceTypes?.length && !t.allowedResourceTypes.includes(r.type)) && (o = "COM_SMARTBROWSER_USAGE_INVALID");
					} catch {
						o = "COM_SMARTBROWSER_USAGE_INVALID";
					}
				}
				let l = r[i.editor];
				if (!tn.has(i.editor) && !l && (o = "COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE"), !o && l?.validate) try {
					o = await l.validate(a, {
						definition: i,
						resource: s,
						values: e
					}) || null;
				} catch {
					o = "COM_SMARTBROWSER_USAGE_INVALID";
				}
				o && (t[s.id] ||= {}, t[s.id][i.key] = o), c[i.key] = i.type === "resource" && !en(a) ? rn(a) : a;
			}
			i[s.id] = c;
		}
		return {
			valid: !Object.keys(t).length,
			errors: t,
			usage: i
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
//#region resources/js/components/SelectionUsageField.vue
var sn = { class: "resource-usage-field" }, cn = {
	key: 0,
	"aria-hidden": "true"
}, ln = [
	"value",
	"required",
	"aria-invalid"
], un = [
	"value",
	"required",
	"aria-invalid"
], dn = {
	key: 3,
	class: "resource-usage-check"
}, fn = ["checked"], pn = ["value", "aria-invalid"], mn = {
	key: 0,
	value: ""
}, hn = ["value"], gn = ["value", "aria-invalid"], _n = ["value"], vn = { value: "auto" }, yn = { value: "custom" }, bn = {
	key: 0,
	class: "resource-usage-reference"
}, xn = { key: 0 }, Sn = ["disabled"], Cn = ["title", "aria-label"], wn = {
	key: 8,
	class: "text-danger"
}, Tn = { key: 9 }, En = {
	key: 10,
	class: "text-danger",
	role: "alert"
}, Dn = {
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
		let i = e, o = n, s = `sb-usage-${Math.random().toString(36).slice(2)}`, c = t(i.value ? "custom" : "auto"), u = t(""), f = t(!1), m = t(""), h = t(null), g = v(() => i.editors?.[i.definition.editor]), b, x, C = 0, T = !1, E = (e) => {
			m.value = "", o("change", e);
		}, D = () => {
			c.value = "auto", E(null);
		}, O = (e) => {
			c.value = e, e === "auto" && E(null);
		};
		a(() => i.value, async (e) => {
			let t = ++C;
			if (m.value = "", u.value = "", i.definition.type === "resource" && e) {
				c.value = "custom";
				try {
					let n = await i.resolveReference(e, i.definition.picker);
					t === C && (u.value = n?.title || "", (!n || n.unavailable) && (m.value = "COM_SMARTBROWSER_USAGE_INVALID"));
				} catch {
					t === C && (m.value = "COM_SMARTBROWSER_USAGE_INVALID");
				}
			}
		}, { immediate: !0 });
		async function k() {
			f.value = !0;
			try {
				let e = await window.SmartBrowserPicker.open({
					...i.definition.picker,
					multiple: !1,
					initialSelection: i.value ? [i.value.id] : []
				});
				e && !T && E(rn({
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
			if (x?.abort(), b?.destroy?.(), b = null, await r(), !T && g.value && h.value) {
				x = new AbortController();
				try {
					b = g.value.mount(h.value, {
						definition: i.definition,
						resource: i.resource,
						id: s,
						value: i.value,
						values: i.values,
						setValue: E,
						signal: x.signal,
						translate: i.t
					}) || null;
				} catch {
					m.value = "COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE";
				}
			}
		}, { immediate: !0 }), a(() => [i.value, i.values], () => b?.update?.({
			value: i.value,
			values: i.values
		}), { deep: !0 }), d(() => {
			T = !0, ++C, x?.abort(), b?.destroy?.();
		}), (t, n) => (w(), M("div", sn, [
			e.definition.editor === "boolean" ? y("", !0) : (w(), M("label", {
				key: 0,
				for: s
			}, [p(_(e.t(e.definition.label)), 1), e.definition.required ? (w(), M("span", cn, " *")) : y("", !0)])),
			e.definition.editor === "text" ? (w(), M("input", {
				key: 1,
				id: s,
				class: "form-control",
				type: "text",
				value: e.value ?? "",
				required: e.definition.required,
				"aria-invalid": !!e.error,
				onInput: n[0] ||= (e) => E(e.target.value)
			}, null, 40, ln)) : e.definition.editor === "textarea" ? (w(), M("textarea", {
				key: 2,
				id: s,
				class: "form-control",
				rows: "3",
				value: e.value ?? "",
				required: e.definition.required,
				"aria-invalid": !!e.error,
				onInput: n[1] ||= (e) => E(e.target.value)
			}, null, 40, un)) : e.definition.editor === "boolean" ? (w(), M("label", dn, [j("input", {
				id: s,
				class: "form-check-input",
				type: "checkbox",
				checked: e.value === !0,
				onChange: n[2] ||= (e) => E(e.target.checked)
			}, null, 40, fn), p(_(e.t(e.definition.label)), 1)])) : e.definition.editor === "select" ? (w(), M("select", {
				key: 4,
				id: s,
				class: "form-select",
				value: e.value,
				"aria-invalid": !!e.error,
				onChange: n[3] ||= (t) => E(e.definition.options.find((e) => String(e.value) === t.target.value)?.value)
			}, [!e.definition.required && !e.definition.options?.some((e) => e.value === "") ? (w(), M("option", mn, _(e.t("COM_SMARTBROWSER_USAGE_CHOOSE")), 1)) : y("", !0), (w(!0), M(S, null, l(e.definition.options, (t) => (w(), M("option", {
				key: String(t.value),
				value: t.value
			}, _(e.t(t.label)), 9, hn))), 128))], 40, pn)) : e.definition.editor === "number" ? (w(), M("input", {
				key: 5,
				id: s,
				class: "form-control",
				type: "number",
				value: e.value ?? "",
				"aria-invalid": !!e.error,
				onInput: n[4] ||= (e) => E(e.target.value === "" ? null : Number(e.target.value))
			}, null, 40, gn)) : e.definition.editor === "resource" ? (w(), M(S, { key: 6 }, [j("select", {
				id: s,
				class: "form-select",
				value: c.value,
				onChange: n[5] ||= (e) => O(e.target.value)
			}, [j("option", vn, _(e.t("COM_SMARTBROWSER_USAGE_AUTO")), 1), j("option", yn, _(e.t("COM_SMARTBROWSER_USAGE_CUSTOM")), 1)], 40, _n), c.value === "custom" ? (w(), M("div", bn, [
				e.value ? (w(), M("span", xn, _(u.value || e.value.id), 1)) : y("", !0),
				j("button", {
					type: "button",
					class: "btn btn-outline-primary",
					disabled: f.value,
					onClick: k
				}, [n[6] ||= j("span", {
					class: "fas fa-plus",
					"aria-hidden": "true"
				}, null, -1), p(" " + _(e.t(e.definition.pickerLabel || "COM_SMARTBROWSER_USAGE_PICK_RESOURCE")), 1)], 8, Sn),
				e.value ? (w(), M("button", {
					key: 1,
					type: "button",
					class: "btn btn-outline-secondary",
					title: e.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					"aria-label": e.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					onClick: D
				}, [...n[7] ||= [j("span", {
					class: "fas fa-times",
					"aria-hidden": "true"
				}, null, -1)]], 8, Cn)) : y("", !0)
			])) : y("", !0)], 64)) : g.value ? (w(), M("div", {
				key: 7,
				ref_key: "customContainer",
				ref: h
			}, null, 512)) : (w(), M("small", wn, _(e.t("COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE")), 1)),
			e.definition.description ? (w(), M("small", Tn, _(e.t(e.definition.description)), 1)) : y("", !0),
			e.error || m.value ? (w(), M("small", En, _(e.t(e.error || m.value)), 1)) : y("", !0)
		]));
	}
}, On = { class: "resource-usage-editor" }, kn = ["open"], An = {
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
		let t = e, n = v(() => t.definitions.filter((e) => e.presentation !== "secondary")), r = v(() => t.definitions.filter((e) => e.presentation === "secondary")), a = (e) => ({
			definition: e,
			value: t.values[e.key],
			values: t.values,
			error: t.errors?.[e.key],
			resource: t.resource,
			t: t.t,
			editors: t.editors,
			resolveReference: t.resolveReference
		});
		return (t, o) => (w(), M("div", On, [(w(!0), M(S, null, l(n.value, (e) => (w(), N(Dn, i({ key: e.key }, { ref_for: !0 }, a(e), { onChange: (n) => t.$emit("change", e.key, n) }), null, 16, ["onChange"]))), 128)), r.value.length ? (w(), M("details", {
			key: 0,
			class: "resource-usage-secondary",
			open: r.value.some((t) => e.errors?.[t.key]) || void 0
		}, [j("summary", null, _(e.t("COM_SMARTBROWSER_USAGE_MORE")), 1), (w(!0), M(S, null, l(r.value, (e) => (w(), N(Dn, i({ key: e.key }, { ref_for: !0 }, a(e), { onChange: (n) => t.$emit("change", e.key, n) }), null, 16, ["onChange"]))), 128))], 8, kn)) : y("", !0)]));
	}
}, jn = {
	key: 0,
	class: "resource-info-tabs",
	role: "tablist"
}, Mn = ["aria-selected"], Nn = ["aria-selected"], Pn = {
	key: 1,
	class: "resource-info-preview-actions"
}, Fn = [
	"disabled",
	"title",
	"onClick"
], In = { key: 0 }, Ln = {
	key: 0,
	class: "resource-language"
}, Rn = ["src"], zn = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, Bn = {
	key: 2,
	class: "resource-info-timezone"
}, Vn = { key: 1 }, Hn = { key: 0 }, Un = { key: 1 }, Wn = {
	key: 0,
	class: "resource-info-timezone"
}, Gn = { key: 2 }, Kn = {
	key: 0,
	class: "resource-info-timezone"
}, qn = { key: 3 }, Jn = { key: 4 }, Yn = { key: 5 }, Xn = { key: 6 }, Zn = {
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
		usageRevision: Number
	},
	emits: ["usage-change"],
	setup(e) {
		let r = e, i = t("info"), s = t(!1), u = t(null), f;
		a(() => r.resource?.id, () => f?.abort()), d(() => f?.abort()), a(() => [
			r.resource?.id,
			r.usageDefinitions?.length,
			r.usageRevision
		], () => {
			i.value = r.usageDefinitions?.length ? "usage" : "info";
		}, { immediate: !0 });
		async function m(e) {
			s.value = !0, f = new AbortController();
			let t = f.signal;
			try {
				await e.run({
					...r.previewContext,
					previewElement: u.value,
					signal: t
				});
			} catch (e) {
				t.aborted || Joomla.renderMessages({ error: [e.message || r.t("COM_SMARTBROWSER_USAGE_INVALID")] });
			} finally {
				s.value = !1;
			}
		}
		let h = [
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
		})), b = v(() => {
			let e = (r.fields || []).filter((e) => (!e.kinds || e.kinds.includes(r.resource?.kind)) && ![
				"metadata.locationPath",
				"metadata.category",
				"metadata.tags"
			].includes(e.source)), t = new Set(e.map((e) => e.source));
			return [...e, ...h.filter((e) => {
				let n = r.resource?.metadata?.[e.source.split(".")[1]];
				return !t.has(e.source) && n != null && n !== "";
			})];
		}), x = I, C = v(() => r.resource?.kind === "node" ? r.t("COM_SMARTBROWSER_FOLDER") : r.resource?.type ? r.resource.type.charAt(0).toUpperCase() + r.resource.type.slice(1) : r.t("COM_SMARTBROWSER_RESOURCE")), T = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, E = (e) => `${(e / 1024).toFixed(2)} KB`, D = (e) => String(e.source || "").split(".").reduce((e, t) => e?.[t], r.resource), A = (e) => (e.format === "language" || e.source === "metadata.language") && D(e) === "*" ? r.t("COM_SMARTBROWSER_ALL_LANGUAGES") : e.format === "date" ? T(D(e)) : e.format === "size" ? D(e) !== null && D(e) !== void 0 ? E(D(e)) : "" : e.format === "dimensions" ? r.resource?.metadata.width && r.resource?.metadata.height ? `${r.resource.metadata.width}px \u00d7 ${r.resource.metadata.height}px` : "" : D(e), P = (e) => {
			let t = String(e || "").trim().match(/(Z|[+-]\d{2}:?\d{2})$/i);
			if (!t) return "";
			let n = t[1].toUpperCase() === "Z" ? 0 : (t[1].startsWith("-") ? -1 : 1) * (Number(t[1].slice(1, 3)) * 60 + Number(t[1].slice(-2)));
			if (n === -new Date(e).getTimezoneOffset()) return "";
			let i = n >= 0 ? "+" : "-", a = Math.abs(n), o = n === 0 ? "UTC" : `UTC${i}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
			return `${r.t("COM_SMARTBROWSER_SOURCE_TIMEZONE")}: ${o}`;
		};
		return (t, r) => (w(), M("aside", { class: o(["resource-info-panel", { "has-usage": e.usageDefinitions?.length }]) }, [e.resource ? (w(), M(S, { key: 0 }, [
			j("div", {
				ref_key: "previewElement",
				ref: u,
				class: "resource-info-preview"
			}, [n(k, { resource: e.resource }, null, 8, ["resource"])], 512),
			j("h3", null, _(e.resource.title), 1),
			e.usageDefinitions?.length ? (w(), M("div", jn, [j("button", {
				type: "button",
				role: "tab",
				"aria-selected": i.value === "info",
				onClick: r[0] ||= (e) => i.value = "info"
			}, _(e.t("COM_SMARTBROWSER_USAGE_INFO")), 9, Mn), j("button", {
				type: "button",
				role: "tab",
				"aria-selected": i.value === "usage",
				onClick: r[1] ||= (e) => i.value = "usage"
			}, _(e.t("COM_SMARTBROWSER_USAGE_OPTIONS")), 9, Nn)])) : y("", !0),
			e.previewActions?.length ? (w(), M("div", Pn, [(w(!0), M(S, null, l(e.previewActions, (t) => (w(), M("button", {
				key: t.id,
				type: "button",
				class: "btn btn-outline-secondary",
				disabled: s.value,
				title: e.t(t.label),
				onClick: (e) => m(t)
			}, [j("span", {
				class: o(t.icon || "fas fa-bolt"),
				"aria-hidden": "true"
			}, null, 2), p(" " + _(e.t(t.label)), 1)], 8, Fn))), 128))])) : y("", !0),
			e.usageDefinitions?.length && i.value === "usage" ? (w(), N(An, {
				key: e.resource.id,
				definitions: e.usageDefinitions,
				values: e.usageValues,
				errors: e.usageErrors,
				resource: e.resource,
				t: e.t,
				editors: e.usageEditors,
				"resolve-reference": e.resolveReference,
				onChange: r[2] ||= (e, n) => t.$emit("usage-change", e, n)
			}, null, 8, [
				"definitions",
				"values",
				"errors",
				"resource",
				"t",
				"editors",
				"resolve-reference"
			])) : (w(), M(S, { key: 3 }, [e.fields?.length ? (w(), M("dl", In, [(w(!0), M(S, null, l(b.value, (t) => c((w(), M("div", { key: `${t.source}-${t.label}` }, [
				j("dt", null, [j("span", {
					class: o(g(x)(t)),
					"aria-hidden": "true"
				}, null, 2), p(_(e.t(t.label)), 1)]),
				t.format === "language" ? (w(), M("dd", Ln, [e.resource.metadata?.languageImage ? (w(), M("img", {
					key: 0,
					src: e.resource.metadata.languageImage,
					alt: "",
					"aria-hidden": "true"
				}, null, 8, Rn)) : D(t) === "*" ? (w(), M("span", zn)) : y("", !0), j("span", null, _(A(t)), 1)])) : (w(), M("dd", {
					key: 1,
					class: o({
						"resource-info-identifier": t.source === "metadata.alias" || t.source === "metadata.username",
						"resource-info-lines": t.source === "metadata.tagPaths"
					})
				}, _(A(t)), 3)),
				t.format === "date" && P(D(t)) ? (w(), M("small", Bn, _(P(D(t))), 1)) : y("", !0)
			])), [[O, A(t) !== "" && A(t) !== null && A(t) !== void 0]])), 128))])) : (w(), M("dl", Vn, [
				e.resource.parentId ? (w(), M("div", Hn, [j("dt", null, [r[3] ||= j("span", {
					class: "fas fa-folder",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_FOLDER")), 1)]), j("dd", null, _(e.resource.parentId), 1)])) : y("", !0),
				j("div", null, [j("dt", null, [r[4] ||= j("span", {
					class: "fas fa-file-alt",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_TYPE")), 1)]), j("dd", null, _(C.value), 1)]),
				e.resource.metadata.created ? (w(), M("div", Un, [
					j("dt", null, [r[5] ||= j("span", {
						class: "fas fa-calendar",
						"aria-hidden": "true"
					}, null, -1), p(_(e.t("COM_SMARTBROWSER_DATE_CREATED")), 1)]),
					j("dd", null, _(T(e.resource.metadata.created)), 1),
					P(e.resource.metadata.created) ? (w(), M("small", Wn, _(P(e.resource.metadata.created)), 1)) : y("", !0)
				])) : y("", !0),
				e.resource.metadata.modified ? (w(), M("div", Gn, [
					j("dt", null, [r[6] ||= j("span", {
						class: "fas fa-calendar",
						"aria-hidden": "true"
					}, null, -1), p(_(e.t("COM_SMARTBROWSER_DATE_MODIFIED")), 1)]),
					j("dd", null, _(T(e.resource.metadata.modified)), 1),
					P(e.resource.metadata.modified) ? (w(), M("small", Kn, _(P(e.resource.metadata.modified)), 1)) : y("", !0)
				])) : y("", !0),
				e.resource.metadata.width && e.resource.metadata.height ? (w(), M("div", qn, [j("dt", null, [r[7] ||= j("span", {
					class: "fas fa-expand",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_DIMENSIONS")), 1)]), j("dd", null, _(e.resource.metadata.width) + "px × " + _(e.resource.metadata.height) + "px", 1)])) : y("", !0),
				e.resource.metadata.size ? (w(), M("div", Jn, [j("dt", null, [r[8] ||= j("span", {
					class: "fas fa-database",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_SIZE")), 1)]), j("dd", null, _(E(e.resource.metadata.size)), 1)])) : y("", !0),
				e.resource.metadata.mimeType ? (w(), M("div", Yn, [j("dt", null, [r[9] ||= j("span", {
					class: "fas fa-file-alt",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_MIME_TYPE")), 1)]), j("dd", null, _(e.resource.metadata.mimeType), 1)])) : y("", !0),
				e.resource.metadata.extension ? (w(), M("div", Xn, [j("dt", null, [r[10] ||= j("span", {
					class: "fas fa-file-alt",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("COM_SMARTBROWSER_EXTENSION")), 1)]), j("dd", null, _(e.resource.metadata.extension), 1)])) : y("", !0),
				j("div", null, [j("dt", null, [r[11] ||= j("span", {
					class: "fas fa-key",
					"aria-hidden": "true"
				}, null, -1), p(_(e.t("JGLOBAL_FIELD_ID_LABEL")), 1)]), j("dd", null, _(e.resource.metadata.id ?? e.resource.id), 1)])
			]))], 64))
		], 64)) : y("", !0)], 2));
	}
}, Qn = {
	class: "resource-breadcrumb",
	"aria-label": "Breadcrumb"
}, $n = [
	"title",
	"aria-label",
	"onClick"
], er = {
	key: 1,
	class: "resource-breadcrumb-title"
}, tr = {
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
		return (t, r) => (w(), M("nav", Qn, [(w(!0), M(S, null, l(n.value, (n, r) => (w(), M("button", {
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
		}, null, 2)) : y("", !0), r !== 0 || !e.iconOnlyRoot ? (w(), M("span", er, _(n.title), 1)) : y("", !0)], 10, $n))), 128))]));
	}
}, nr = {
	class: "resource-toolbar",
	role: "toolbar"
}, rr = { class: "resource-toolbar-primary" }, ir = { class: "resource-view-controls" }, ar = [
	"disabled",
	"title",
	"aria-label"
], or = ["title"], sr = ["title"], cr = ["disabled"], lr = ["disabled"], ur = ["title"], dr = { "aria-hidden": "true" }, fr = [
	"title",
	"aria-label",
	"aria-expanded"
], pr = {
	key: 0,
	class: "resource-column-menu"
}, mr = { class: "resource-column-menu-title" }, hr = [
	"checked",
	"disabled",
	"onChange"
], gr = { class: "resource-mode-controls" }, _r = ["title", "onClick"], vr = ["title"], yr = {
	key: 0,
	class: "resource-toolbar-expanded resource-search-row"
}, br = {
	for: "smartbrowser-search",
	class: "visually-hidden"
}, xr = { class: "input-group resource-search-control" }, Sr = ["value", "placeholder"], Cr = ["title"], wr = { class: "visually-hidden" }, Tr = {
	key: 1,
	class: "resource-toolbar-expanded resource-sort-row"
}, Er = { class: "resource-sort-controls" }, Dr = { class: "visually-hidden" }, Or = ["value"], kr = { value: "" }, Ar = ["value"], jr = { class: "visually-hidden" }, Mr = ["value", "disabled"], Nr = { value: "asc" }, Pr = { value: "desc" }, Fr = {
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
		return (t, r) => (w(), M("div", nr, [
			j("div", rr, [n(tr, {
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
			]), j("div", ir, [
				e.reorderVisible ? (w(), N(B, {
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
				}, null, -1)]], 8, ar)) : y("", !0),
				j("button", {
					type: "button",
					class: o(["resource-icon-button", { active: u.value }]),
					title: e.t("COM_SMARTBROWSER_SEARCH"),
					onClick: r[3] ||= (e) => u.value = !u.value
				}, [...r[17] ||= [j("span", {
					class: "fas fa-search",
					"aria-hidden": "true"
				}, null, -1)]], 10, or),
				b("sort") ? (w(), M("button", {
					key: 2,
					type: "button",
					class: o(["resource-icon-button", { active: c.value }]),
					title: e.t("COM_SMARTBROWSER_SORT_BY"),
					onClick: r[4] ||= (e) => c.value = !c.value
				}, [...r[18] ||= [j("span", {
					class: "fas fa-sort-amount-down-alt",
					"aria-hidden": "true"
				}, null, -1)]], 10, sr)) : y("", !0),
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
				}, null, -1)]], 8, cr)) : y("", !0),
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
				}, null, -1)]], 8, lr)) : y("", !0),
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
				}, null, -1), j("small", dr, _(h.value), 1)], 8, ur)) : y("", !0),
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
				}, null, -1)]], 8, fr), f.value ? (w(), M("div", pr, [j("div", mr, _(e.t("COM_SMARTBROWSER_COLUMNS")), 1), (w(!0), M(S, null, l(e.columns, (n) => (w(), M("label", {
					key: n.id,
					class: "resource-column-choice"
				}, [j("input", {
					type: "checkbox",
					checked: n.defaultVisible ? !e.hiddenColumns?.includes(n.id) : e.shownColumns?.includes(n.id),
					disabled: n.id === "title" || n.id === "name",
					onChange: (e) => t.$emit("toggle-column", n.id)
				}, null, 40, hr), j("span", null, _(e.t(n.label || (n.dateGroup ? "COM_SMARTBROWSER_DATE" : n.fields?.[0]?.label))), 1)]))), 128))])) : y("", !0)], 512)) : y("", !0),
				j("div", gr, [(w(!0), M(S, null, l(e.views, (n) => (w(), M("button", {
					key: n.id,
					type: "button",
					class: o(["resource-icon-button", { active: e.activeView === n.id }]),
					title: e.t(n.label),
					onClick: (e) => t.$emit("view", n.id)
				}, [j("span", {
					class: o(n.icon),
					"aria-hidden": "true"
				}, null, 2)], 10, _r))), 128))]),
				j("button", {
					type: "button",
					class: o(["resource-icon-button", { active: e.showInfo }]),
					title: e.t("COM_SMARTBROWSER_TOGGLE_INFO"),
					onClick: r[10] ||= (e) => t.$emit("info")
				}, [...r[24] ||= [j("span", {
					class: "fas fa-info",
					"aria-hidden": "true"
				}, null, -1)]], 10, vr)
			])]),
			u.value ? (w(), M("div", yr, [j("label", br, _(e.t("COM_SMARTBROWSER_SEARCH")), 1), j("div", xr, [j("input", {
				id: "smartbrowser-search",
				value: e.search,
				type: "search",
				class: "form-control",
				placeholder: e.t("COM_SMARTBROWSER_SEARCH"),
				onInput: r[11] ||= (e) => t.$emit("search", e.target.value),
				onKeydown: r[12] ||= D(C((e) => t.$emit("search", e.target.value), ["prevent"]), ["enter"])
			}, null, 40, Sr), j("button", {
				type: "button",
				class: "btn btn-primary",
				title: e.t("COM_SMARTBROWSER_SEARCH"),
				onClick: r[13] ||= (n) => t.$emit("search", e.search)
			}, [r[25] ||= j("span", {
				class: "fas fa-search",
				"aria-hidden": "true"
			}, null, -1), j("span", wr, _(e.t("COM_SMARTBROWSER_SEARCH")), 1)], 8, Cr)])])) : y("", !0),
			c.value && b("sort") ? (w(), M("div", Tr, [j("div", Er, [j("label", null, [j("span", Dr, _(e.t("COM_SMARTBROWSER_SORT_BY")), 1), j("select", {
				value: e.sortBy,
				class: "form-select",
				onChange: r[14] ||= (e) => t.$emit("sort-by", e.target.value)
			}, [j("option", kr, _(e.t("COM_SMARTBROWSER_DEFAULT_SORTING")), 1), (w(!0), M(S, null, l(s.value, (t) => (w(), M("option", {
				key: t.id,
				value: t.id
			}, _(e.t(t.label)), 9, Ar))), 128))], 40, Or)]), j("label", null, [j("span", jr, _(e.t("COM_SMARTBROWSER_SORT_DIRECTION")), 1), j("select", {
				value: e.sortDirection || "asc",
				class: "form-select",
				disabled: !e.sortBy,
				onChange: r[15] ||= (e) => t.$emit("sort-direction-value", e.target.value)
			}, [j("option", Nr, _(e.t("COM_SMARTBROWSER_ASCENDING")), 1), j("option", Pr, _(e.t("COM_SMARTBROWSER_DESCENDING")), 1)], 40, Mr)])])])) : y("", !0)
		]));
	}
}, Ir = {
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
}, Lr = ["aria-label"], Rr = ["open", "onToggle"], zr = ["onClick"], Br = {
	key: 0,
	class: "resource-adapter-roots"
}, Vr = ["onClick"], Hr = {
	key: 1,
	class: "resource-tree-branch"
}, Ur = ["onClick"], Wr = ["onClick"], Gr = {
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
		}, null, 2), p(" " + _(r.title), 1)], 8, zr), r.id !== e.activeAdapter || d.value ? (w(), M("div", Br, [(w(!0), M(S, null, l(r.id === e.activeAdapter ? e.roots : [], (i) => (w(), M("section", {
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
		}, null, 2), j("span", null, _(i.title), 1)], 10, Vr)), c(i) ? (w(), M("div", Hr, [(w(!0), M(S, null, l(u(i), (r) => (w(), M("button", {
			key: r.id,
			type: "button",
			class: o({ active: e.selectedNode === r.id }),
			style: h(f(i, u(i).indexOf(r))),
			onClick: (e) => t.$emit("open", r.id)
		}, [n(Ir, {
			resource: r,
			open: !0
		}, null, 8, ["resource"]), j("span", null, _(r.title), 1)], 14, Ur))), 128)), (w(!0), M(S, null, l(e.nodes, (e) => (w(), M(S, { key: e.id }, [e.navigable === !1 ? (w(), M("div", {
			key: 1,
			class: "resource-tree-entry resource-tree-static",
			style: h(f(i, u(i).length))
		}, [n(Ir, { resource: e }, null, 8, ["resource"]), j("span", null, _(e.title), 1)], 4)) : (w(), M("button", {
			key: 0,
			type: "button",
			class: "resource-tree-entry",
			style: h(f(i, u(i).length)),
			onClick: (n) => t.$emit("open", e.id)
		}, [n(Ir, { resource: e }, null, 8, ["resource"]), j("span", null, _(e.title), 1)], 12, Wr))], 64))), 128))])) : y("", !0)], 2))), 128))])) : y("", !0)], 40, Rr))), 128))], 8, Lr));
	}
}, Kr = /* @__PURE__ */ new Set([
	"articles",
	"categories",
	"tags",
	"articles-by-tag",
	"menus",
	"users",
	"media"
]), qr = (e, t, n) => {
	let r = e.startsWith("flat-") ? new URL(n).searchParams.get("flatFromBrowseRoot") || "" : t || "";
	return `supjx.smartbrowser.ui.${e.replace(/^flat-/, "")}.${r}`;
}, Jr = (e, t, n, r) => {
	let i = new URL(e);
	if (!Kr.has(t)) return i.toString();
	i.searchParams.set("flatFromAdapter", t), i.searchParams.set("flatFromNode", n), r ? i.searchParams.set("flatFromBrowseRoot", r) : i.searchParams.delete("flatFromBrowseRoot");
	let a = `flat-${t}`;
	if (i.searchParams.set("adapter", a), i.searchParams.set("node", `${a}:root`), t === "articles" || t === "categories") {
		let e = n.startsWith("category:") ? n : r;
		e?.startsWith("category:") ? i.searchParams.set("browseRoot", e) : i.searchParams.delete("browseRoot"), i.searchParams.delete("flatScope");
	} else r ? i.searchParams.set("browseRoot", r) : i.searchParams.delete("browseRoot"), i.searchParams.set("flatScope", n);
	return i.toString();
}, Yr = (e, t) => {
	let n = new URL(e), r = n.searchParams.get("flatFromAdapter"), i = Kr.has(r) ? r : "articles", a = n.searchParams.get("flatFromBrowseRoot") || (r ? null : t), o = n.searchParams.get("flatFromNode") || a || "content:root";
	n.searchParams.set("adapter", i), n.searchParams.set("node", o), a ? n.searchParams.set("browseRoot", a) : n.searchParams.delete("browseRoot");
	for (let e of [
		"flatFromAdapter",
		"flatFromNode",
		"flatFromBrowseRoot",
		"flatScope"
	]) n.searchParams.delete(e);
	return n.toString();
}, Xr = (e, t) => {
	let n = new URL(e);
	if (!n.searchParams.get("adapter")?.startsWith("flat-") || !t) return n.toString();
	let r = n.searchParams.get("adapter");
	if (n.searchParams.set("node", `${r}:root`), n.searchParams.set("flatFromNode", t), r === "flat-articles" || r === "flat-categories") {
		let e = n.searchParams.get("flatFromBrowseRoot") || (n.searchParams.has("flatFromAdapter") ? null : n.searchParams.get("browseRoot"));
		e ? n.searchParams.set("browseRoot", e) : n.searchParams.delete("browseRoot"), n.searchParams.delete("flatScope");
	} else n.searchParams.set("flatScope", t);
	return n.toString();
}, Zr = {
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
}, Qr = (e) => ({
	stateLabel: "status",
	width: "dimension",
	link: "url"
})[e.split(".").pop()] || e.split(".").pop();
function $r(e, t) {
	let n = e?.columns || [], r = n.map((e) => ({
		...e,
		defaultVisible: !0
	})), i = new Set(n.map((e) => e.id)), a = t.replace(/^flat-/, "") === "articles-by-tag" ? "articles" : t.replace(/^flat-/, ""), o = [...e?.infoFields || [], ...(Zr[a] || []).map(([e, t, n]) => ({
		id: Qr(e),
		label: t,
		source: `metadata.${e}`,
		format: n
	}))], s = i.has("dates");
	for (let e of o) {
		if (!e.source || !e.label || e.source === "metadata.locationPath") continue;
		let t = e.id || Qr(e.source);
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
var ei = {
	key: 0,
	class: "smartbrowser-busy",
	role: "status",
	"aria-live": "polite"
}, ti = [
	"aria-pressed",
	"title",
	"aria-label"
], ni = [
	"title",
	"aria-label",
	"aria-expanded"
], ri = { class: "resource-main" }, ii = {
	key: 0,
	class: "resource-loader"
}, ai = {
	key: 1,
	class: "resource-empty"
}, oi = {
	key: 3,
	class: "resource-drop-overlay"
}, si = {
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
			c && (u = oe(document.getElementById("smartbrowser-app"), (e) => {
				l.value = e;
			}));
		}), d(() => u?.destroy());
		let S = m("actionDriver"), E = m("resourceApi"), D = m("viewRegistry"), { state: O, resources: k, bulkSelectableResources: A, selection: P, focusedResource: F, load: I, focus: te, toggle: ne, selectAll: re, invertSelection: z } = i, B = a.mode === "select" ? a.pickerContext : null, V = /* @__PURE__ */ new Map();
		async function ae(e, t = {}) {
			let n = JSON.stringify([e.adapter, t.browseRoot || ""]);
			return V.has(n) || V.set(n, new R({
				...a,
				adapter: e.adapter,
				mode: "select",
				browseRoot: t.browseRoot || null,
				flatScope: null
			})), (await V.get(n).collection([e.id])).resources[0];
		}
		let H = on({
			profile: B?.selectionProfile || {},
			initialUsage: B?.initialUsage || {},
			editors: B?.editors || {},
			resolveReference: ae
		}), U = t(0), W = t(0), G = t({}), se = t(!1), ce = v(() => H.definitions(F.value)), le = v(() => (U.value, H.get(F.value))), K = v(() => !!(B && ce.value.length)), ue = !!(B && Object.keys(B.selectionProfile || {}).length), de = t(O.showInfo), fe = v(() => K.value || (ue ? de.value : O.showInfo)), pe = () => {
			K.value || (ue ? de.value = !de.value : O.showInfo = !O.showInfo);
		}, me = (e, t, n) => {
			e && !_e && (H.set(e, t, n), G.value = {
				...G.value,
				[e.id]: {}
			}, U.value++);
		}, he = (e, t) => me(F.value, e, t), q = v(() => {
			let e = F.value;
			return {
				resource: e,
				profile: B?.selectionProfile || {},
				values: le.value,
				getValues: () => H.get(e),
				setValue: (t, n) => me(e, t, n),
				refresh: () => I(),
				selectResource: (e) => window.SmartBrowserPicker.open(e)
			};
		}), ge = v(() => (B?.previewActions || []).filter((e) => {
			try {
				return F.value && (!e.applies || e.applies(q.value));
			} catch {
				return !1;
			}
		})), _e = !1;
		d(() => {
			_e = !0, V.forEach((e) => e.destroy());
		});
		let ve = D.all(), ye = v(() => D.get(O.activeView)), be = v(() => $r(O.presentation, a.adapter)), xe = v(() => be.value.filter((e) => e.id === "title" || e.id === "name" || (e.defaultVisible ? !O.hiddenColumns.includes(e.id) : O.shownColumns.includes(e.id)))), Se = (e) => {
			let t = be.value.find((t) => t.id === e);
			if (!t || ["title", "name"].includes(e)) return;
			let n = t.defaultVisible ? "hiddenColumns" : "shownColumns";
			O[n] = O[n].includes(e) ? O[n].filter((t) => t !== e) : [...O[n], e];
		}, Ce = t(!1), J = t(!1), we = t(null), Y = v(() => a.adapter === "media"), Ee = v(() => a.mode === "manage" && ["details", "grid"].includes(O.activeView) && O.presentation.orderingField && O.sortBy === O.presentation.orderingField && ["asc", "desc"].includes(O.sortDirection) && (a.adapter === "featured-articles" || String(O.filters.featured ?? "") !== "1")), De = v(() => Ee.value && !O.busy && P.value.length > 0 && P.value.every((e) => e.capabilities?.reorder === !0)), Oe = async (e) => {
			if (!De.value || !["up", "down"].includes(e)) return;
			let t = P.value.map((e) => e.id), n = O.focusedId;
			O.busy = !0;
			try {
				let r = O.sortDirection === "desc" ? e === "up" ? "down" : "up" : e;
				(await E.execute("reorder", t, { direction: r })).updated?.length && (await I(), O.selectedIds = t.filter((e) => k.value.some((t) => t.id === e)), O.focusedId = O.selectedIds.includes(n) ? n : O.selectedIds[0] || null);
			} catch (e) {
				Joomla.renderMessages({ error: [e.message] });
			} finally {
				O.busy = !1;
			}
		}, X = a.adapter !== "featured-articles" && [
			"articles",
			"categories",
			"tags",
			"articles-by-tag",
			"menus",
			"users",
			"media"
		].includes(a.adapter.replace(/^flat-/, "")), Z = a.adapter.startsWith("flat-") || a.adapter === "featured-articles", ke = Object.fromEntries(Object.entries(a.gridWidths || {}).map(([e, t]) => [`--sb-grid-${e}`, `${t}px`])), Ae = qr(a.adapter, a.browseRoot, window.location.href), je = (() => {
			try {
				return JSON.parse(window.sessionStorage.getItem(Ae) || "{}");
			} catch {
				return {};
			}
		})(), Me = t(je.filtersOpen === !0), Ne = (e) => {
			je = {
				...je,
				filtersOpen: Me.value,
				...e
			}, window.sessionStorage.setItem(Ae, JSON.stringify(je));
		}, Pe = () => {
			Me.value = !Me.value, Ne({ filtersOpen: Me.value });
		}, Fe = () => {
			Ne({ flat: !Z }), window.location.assign(Z ? Yr(window.location.href, a.browseRoot) : Jr(window.location.href, a.adapter, O.selectedNode, a.browseRoot));
		}, Ie = v(() => a.adapters?.find((e) => e.id === a.adapter)?.icon || "fas fa-list"), Le = v(() => a.adapters?.find((e) => e.id === a.adapter)?.nodeOpenIcon || {
			media: "fas fa-folder-open",
			articles: "fas fa-box-open",
			"flat-articles": "fas fa-box-open",
			categories: "fas fa-box-open",
			tags: "fas fa-tags",
			"articles-by-tag": "fas fa-tags",
			users: "fas fa-users-viewfinder",
			menus: "fas fa-diagram-successor",
			"featured-articles": "fas fa-star"
		}[a.adapter] || "fas fa-folder-open"), Re = [
			"sm",
			"md",
			"lg",
			"xl"
		], Q = (e) => Joomla.Text?._(e, e) || e, ze = async ({ selection: e, payload: t, resolve: n, reject: r }) => {
			try {
				let r = await E.execute("batch", e, t);
				if (r.download) {
					let e = atob(r.download.content), t = Uint8Array.from(e, (e) => e.charCodeAt(0)), n = URL.createObjectURL(new Blob([t], { type: "application/zip" })), i = document.createElement("a");
					i.href = n, i.download = r.download.name, i.click(), setTimeout(() => URL.revokeObjectURL(n), 6e4);
				}
				await I(), n(r);
			} catch (e) {
				r(e);
			}
		}, Be = async (e) => {
			if (se.value || !e.length) return;
			se.value = !0;
			let t = U.value, n;
			try {
				n = await H.validate(e);
			} finally {
				se.value = !1;
			}
			if (_e || t !== U.value) return;
			if (G.value = n.errors, !n.valid) {
				O.focusedId = Object.keys(n.errors)[0], W.value++;
				return;
			}
			let r = {
				adapter: a.adapter.replace(/^flat-/, ""),
				mode: a.mode,
				resources: [...e]
			};
			B && (r.pickerInstance = a.pickerInstance, r.usage = n.usage), document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r })), window.parent !== window && window.parent.document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r }));
		}, Ve = (e) => {
			let t = Re.indexOf(O.viewOptions.gridSize);
			O.viewOptions.gridSize = Re[Math.max(0, Math.min(Re.length - 1, t + e))];
		}, He = (e) => ie(e, a.mode, O.actions, (e, t) => S.available(e, t), a.selectionTarget || "both"), Ue = (e) => ee(e, a.mode, O.actions, (e, t) => S.available(e, t)), We = (e, t) => !O.busy && (e.local ? t.every((t) => He(t)?.id === e.id) : S.available(e, t)), Ge = (e) => {
			let t = He(e);
			t && Ke(t, e);
		}, Ke = (e, t) => {
			if (We(e, [t])) return e.id === "browseOpen" ? I(t.id) : e.id === "pickerSelect" ? Be([t]) : S.execute(e, [t]);
		}, qe = (e) => {
			if (e === a.adapter) return;
			let t = new URL(window.location.href);
			t.searchParams.set("adapter", e), t.searchParams.delete("node"), t.searchParams.delete("browseRoot"), window.location.href = t.toString();
		}, Je = async ({ id: e, value: t }) => {
			if (O.filters[e] = t, e === "menu" && t && !a.browseRoot && a.adapter === "menus") {
				await I(`menu:${t}`);
				return;
			}
			if (e === "menu" && t && !a.browseRoot && a.adapter === "flat-menus") {
				let e = new URL(window.location.href);
				e.searchParams.set("flatScope", `menu:${t}`), e.searchParams.set("flatFromNode", `menu:${t}`), window.location.assign(e.toString());
				return;
			}
			await I(O.selectedNode);
		}, Ye = async () => {
			(O.presentation.filters || []).forEach((e) => {
				O.filters[e.id] = e.default ?? "";
			}), await I(O.selectedNode);
		}, Xe = async (e) => {
			if (Z && e === O.selectedNode && e === O.roots[0]?.id) {
				O.search = "", O.sortBy = a.defaultSortBy || "", O.sortDirection = a.defaultSortDirection || "";
				let e = Xr(window.location.href, a.flatRootNode);
				if (e !== window.location.href) {
					(O.presentation.filters || []).forEach((e) => {
						O.filters[e.id] = e.default ?? "";
					}), await r(), window.location.assign(e);
					return;
				}
				await Ye();
				return;
			}
			await I(e);
		}, Ze = (e) => {
			O.sortBy === e ? O.sortDirection === "asc" ? O.sortDirection = "desc" : (O.sortBy = "", O.sortDirection = "") : (O.sortBy = e, O.sortDirection = "asc");
		}, Qe = (e) => {
			O.sortBy = e, O.sortDirection = e ? O.sortDirection || "asc" : "";
		}, $e = () => {
			let e = [
				"modified",
				"created",
				"both"
			], t = e.indexOf(O.viewOptions.detailsDateMode);
			O.viewOptions.detailsDateMode = e[(t + 1) % e.length];
		}, et = async (e) => {
			Ce.value = !1, Y.value && await S.uploadFiles(e.dataTransfer?.files);
		};
		return T(() => {
			if (Z && Ne({ flat: !0 }), !Z && X && je.flat === !0) {
				window.location.replace(Jr(window.location.href, a.adapter, O.selectedNode, a.browseRoot));
				return;
			}
			I(O.selectedNode).then(async () => {
				if (B?.initialSelection?.length) {
					let e = B.initialSelection.map((e) => e && typeof e == "object" ? e.id : e);
					try {
						let t = await E.collection(a.multiple ? e : e.slice(0, 1));
						if (_e) return;
						let n = new Set(a.allowedResourceTypes || []), r = t.resources.filter((e) => !e.unavailable && L(e, a.selectionTarget) && (!n.size || n.has(e.type)));
						O.selectedIds = r.map((e) => e.id), O.selectedResources = Object.fromEntries(r.map((e) => [e.id, e])), O.focusedId = O.selectedIds[0] || null;
					} catch (e) {
						_e || Joomla.renderMessages({ error: [e.message] });
					}
				}
				a.adapter === "media" && a.initialResource && k.value.some((e) => e.id === a.initialResource) && (O.focusedId = a.initialResource);
			});
		}), (e, t) => (w(), M("div", {
			class: "smartbrowser-shell",
			style: h(g(ke))
		}, [
			g(O).busy ? (w(), M("div", ei, [t[12] ||= j("span", {
				class: "spinner-border",
				"aria-hidden": "true"
			}, null, -1), j("span", null, _(Q("COM_SMARTBROWSER_WORKING")), 1)])) : y("", !0),
			n(Te, {
				actions: g(O).actions,
				available: (e) => g(S).available(e, g(P)),
				selection: g(P),
				"batch-available": g(a).mode === "manage",
				"flat-available": g(X),
				"flat-active": g(Z),
				"filters-open": Me.value,
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
				onAction: t[0] ||= (e) => g(S).execute(e, g(P)),
				onBatch: t[1] ||= (e) => we.value?.open(),
				onToggleFlat: Fe,
				onToggleFilters: Pe,
				onFilter: Je,
				onClearFilters: Ye,
				onComplete: t[2] ||= (e) => Be(g(P)),
				onNoUser: t[3] ||= (e) => Be([{
					id: "user:0",
					type: "user",
					title: ""
				}])
			}, {
				"display-controls": s(() => [g(c) ? (w(), M("button", {
					key: 0,
					type: "button",
					class: o(["resource-icon-button resource-display-toggle", { active: l.value !== "normal" }]),
					"aria-pressed": l.value !== "normal",
					title: Q(b.value),
					"aria-label": Q(b.value),
					onClick: x
				}, [j("span", {
					class: o(l.value === "normal" ? "fas fa-arrows-alt-h" : l.value === "wide" ? "fas fa-expand" : "fas fa-compress"),
					"aria-hidden": "true"
				}, null, 2)], 10, ti)) : y("", !0)]),
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
				ref: we,
				selection: g(P),
				adapter: g(a).adapter,
				filters: g(O).presentation.filters,
				"batch-options": g(O).presentation.batchOptions,
				t: Q,
				onApply: ze
			}, null, 8, [
				"selection",
				"adapter",
				"filters",
				"batch-options"
			]),
			j("div", { class: o(["smartbrowser-layout", {
				"flat-mode": g(Z),
				"tree-collapsed": J.value
			}]) }, [
				!g(Z) && !J.value ? (w(), N(Gr, {
					key: 0,
					adapters: g(a).adapters,
					"active-adapter": g(a).adapter,
					roots: g(O).roots,
					nodes: g(O).nodes,
					breadcrumb: g(O).breadcrumb,
					"selected-node": g(O).selectedNode,
					t: Q,
					onOpen: g(I),
					onAdapter: qe
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
					title: Q(J.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-label": Q(J.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-expanded": !J.value,
					onClick: t[4] ||= (e) => J.value = !J.value
				}, [j("span", {
					class: o(J.value ? "fas fa-chevron-right" : "fas fa-chevron-left"),
					"aria-hidden": "true"
				}, null, 2)], 8, ni)),
				j("main", ri, [n(Fr, {
					breadcrumb: g(O).breadcrumb,
					root: g(O).roots[0],
					"root-icon": Le.value,
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
					"reorder-visible": Ee.value,
					"reorder-enabled": De.value,
					t: Q,
					onOpen: Xe,
					onInvertSelection: g(z),
					onReorder: Oe,
					onSearch: t[5] ||= (e) => g(O).search = e,
					onSortBy: Qe,
					onSortDirectionValue: t[6] ||= (e) => g(O).sortDirection = e,
					onResize: Ve,
					onToggleThumbnails: t[7] ||= (e) => g(O).viewOptions.detailsThumbnails = !g(O).viewOptions.detailsThumbnails,
					onToggleDateField: $e,
					onToggleColumn: Se,
					onView: t[8] ||= (e) => g(O).activeView = e,
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
						"usage-open": K.value
					}]),
					onDragenter: t[9] ||= C((e) => Ce.value = Y.value, ["prevent"]),
					onDragover: t[10] ||= C(() => {}, ["prevent"]),
					onDragleave: t[11] ||= C((e) => Ce.value = !1, ["self"]),
					onDrop: C(et, ["prevent"])
				}, [
					g(O).loading ? (w(), M("div", ii, [...t[13] ||= [j("span", {
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
						"action-available": We,
						"default-action": He,
						"preview-action": Ue,
						"sort-by": g(O).sortBy,
						"sort-direction": g(O).sortDirection,
						"sort-fields": g(O).presentation.sortFields,
						"ordering-field": g(O).presentation.orderingField,
						columns: xe.value,
						"grid-fields": g(O).presentation.gridFields,
						t: Q,
						onSelect: g(ne),
						onFocus: g(te),
						onSelectAll: g(re),
						onOpen: g(I),
						onActivate: Ge,
						onAction: Ke,
						onSort: Ze
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
					])) : (w(), M("div", ai, [j("span", {
						class: o(g(O).search ? "fas fa-search" : Y.value ? "fas fa-cloud-upload-alt" : Ie.value),
						"aria-hidden": "true"
					}, null, 2), j("p", null, _(g(O).search ? Q("COM_SMARTBROWSER_NO_RESULTS") : Y.value ? Q("COM_SMARTBROWSER_DROP_UPLOAD") : Q("COM_SMARTBROWSER_EMPTY_STATE")), 1)])),
					Y.value && Ce.value ? (w(), M("div", oi, [t[14] ||= j("span", { class: "fas fa-cloud-upload-alt" }, null, -1), p(_(Q("COM_SMARTBROWSER_DROP_UPLOAD")), 1)])) : y("", !0),
					fe.value ? (w(), N(Zn, {
						key: 4,
						resource: g(F),
						fields: g(O).presentation.infoFields,
						t: Q,
						"usage-definitions": ce.value,
						"usage-values": le.value,
						"usage-errors": G.value[g(F)?.id] || {},
						"usage-editors": g(B)?.editors,
						"resolve-reference": ae,
						"usage-revision": W.value,
						"preview-actions": ge.value,
						"preview-context": q.value,
						onUsageChange: he
					}, null, 8, [
						"resource",
						"fields",
						"usage-definitions",
						"usage-values",
						"usage-errors",
						"usage-editors",
						"usage-revision",
						"preview-actions",
						"preview-context"
					])) : y("", !0)
				], 34)])
			], 2)
		], 4));
	}
}, ci = class {
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
}, li = "supjx.smartbrowser.preferencesResetToken";
function ui(e, t) {
	if (!t || e.getItem(li) === t) return !1;
	let n = [];
	for (let t = 0; t < e.length; t++) {
		let r = e.key(t);
		r?.startsWith("supjx.smartbrowser.") && r !== li && r !== "supjx.smartbrowser.editorReturn" && n.push(r);
	}
	return n.forEach((t) => e.removeItem(t)), e.setItem(li, t), !0;
}
//#endregion
//#region resources/js/core/resetSessionNavigation.js
var di = "supjx.smartbrowser.";
function fi(e, t, n) {
	if (!n) return !1;
	let r = `${di}session.${t}`, i = e.getItem(r);
	if (e.setItem(r, n), !i || i === n) return !1;
	for (let t = 0; t < e.length; t++) {
		let n = e.key(t);
		if (!(!n?.startsWith(di) || n.startsWith(`${di}ui.`) || n.startsWith(`${di}session.`))) try {
			let t = JSON.parse(e.getItem(n));
			if (!t || typeof t != "object" || Array.isArray(t) || !("selectedNode" in t) && !("filters" in t)) continue;
			delete t.selectedNode, delete t.filters, e.setItem(n, JSON.stringify(t));
		} catch {}
	}
	return !0;
}
function pi(e) {
	let t = new URL(e);
	if (t.searchParams.delete("node"), t.searchParams.has("flatFromAdapter")) {
		let e = t.searchParams.get("flatFromBrowseRoot");
		e ? t.searchParams.set("browseRoot", e) : t.searchParams.delete("browseRoot"), t.searchParams.delete("flatScope"), t.searchParams.delete("flatFromNode"), t.searchParams.delete("flatFromBrowseRoot"), t.searchParams.delete("flatFromAdapter");
	}
	return t.toString();
}
//#endregion
//#region resources/js/main.js
var $ = Joomla.getOptions("com_smartbrowser", {}), mi = null;
try {
	mi = window.parent !== window && $.pickerInstance ? window.parent.SmartBrowserPicker?.context($.pickerInstance, window) : null;
} catch {}
$.pickerContext = mi, ui(window.sessionStorage, $.preferencesResetToken);
var hi = fi(window.sessionStorage, $.application, $.csrfToken) ? pi(window.location.href) : window.location.href;
if (hi !== window.location.href) window.location.replace(hi);
else {
	let e = new R($), t = $.browseRoot ? `supjx.smartbrowser.${$.adapter}.${$.browseRoot}` : `supjx.smartbrowser.${$.adapter}`, n = new ci(window.sessionStorage, t), r = z().register({
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
		component: te,
		supportsSize: !1,
		controls: ["thumbnails", "dateField"],
		options: {
			detailsThumbnails: !1,
			detailsDateMode: "modified"
		}
	}), i = ne({
		options: $,
		api: e,
		persistence: n,
		viewRegistry: r
	}), a = new re(e, i.state, () => i.load(), (e) => Joomla.Text?._(e, e) || e, $.editorMode, $.application);
	window.SmartBrowser = {
		...window.SmartBrowser,
		open(e = {}) {
			let t = e.showContextResources ?? $.showContextResources ?? !1, n = e.browseRoot ? `&browseRoot=${encodeURIComponent(e.browseRoot)}` : "", r = e.defaultView ? `&defaultView=${encodeURIComponent(e.defaultView)}` : "", i = e.allowedResourceTypes?.length ? `&allowedResourceTypes=${encodeURIComponent(e.allowedResourceTypes.join(","))}` : "", a = e.showAdapterSwitcher ? "&showAdapterSwitcher=1" : "";
			window.location.href = `${$.returnUrl}&adapter=${encodeURIComponent(e.adapter || $.adapter)}&mode=${encodeURIComponent(e.mode || "select")}&multiple=${+!!e.multiple}&selectionTarget=${encodeURIComponent(e.selectionTarget || "item")}&showContextResources=${+!!t}${n}${r}${i}${a}`;
		},
		registerView: (e) => r.register(e)
	}, E(si).provide("browser", i).provide("resourceApi", e).provide("smartBrowserOptions", $).provide("viewRegistry", r).provide("actionDriver", a).mount("#smartbrowser-app");
}
//#endregion
