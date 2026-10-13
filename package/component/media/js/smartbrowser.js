import { A as e, B as t, C as n, D as r, F as i, H as a, I as o, L as s, M as c, N as l, O as u, P as d, S as f, T as p, U as m, V as h, W as g, _, b as v, d as y, f as b, g as x, h as S, j as C, k as ee, l as w, m as T, t as E, u as te, v as D, x as O, y as ne, z as k } from "./visual-runtime-6WA-BB1G.js?v=3.6.22";
import { a as re, i as A, r as ie } from "./visual-runtime-1h24eaHt.js?v=3.6.22";
import { a as j, c as ae, d as oe, f as M, h as se, i as ce, l as le, m as ue, n as N, o as de, p as P, r as F, s as I, t as L, u as R } from "./visual-runtime-hH3o4gop.js?v=3.6.22";
import { t as z } from "./visual-runtime-BceWU2F8.js?v=3.6.22";
//#region resources/js/core/displayMode.js
var B = [
	"normal",
	"wide",
	"focus"
], V = "smartbrowser.displayMode";
function fe(e, t = () => {}) {
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
		if (!B.includes(r)) return;
		let u = n;
		if (c(), n = r, t(n), l) try {
			o?.setItem(V, n);
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
		let e = o?.getItem(V);
		B.includes(e) && e !== "normal" && l(e, !1);
	} catch {}
	return {
		get mode() {
			return n;
		},
		set: l,
		cycle: () => l(B[(B.indexOf(n) + 1) % 3]),
		destroy() {
			l("normal", !1), a.removeEventListener("keydown", u);
		}
	};
}
//#endregion
//#region resources/js/components/ResourceActions.vue
var pe = { class: "resource-actions-area" }, me = [
	"href",
	"title",
	"aria-label"
], H = { class: "resource-action-label" }, U = [
	"disabled",
	"title",
	"aria-label"
], W = { class: "resource-action-label" }, G = ["title", "aria-label"], he = { class: "resource-action-label" }, ge = [
	"title",
	"aria-label",
	"disabled",
	"onClick"
], _e = {
	key: 0,
	class: "resource-action-label"
}, ve = [
	"aria-expanded",
	"title",
	"aria-label"
], K = { class: "resource-action-label" }, q = {
	key: 0,
	class: "resource-action-menu",
	role: "menu"
}, ye = ["disabled", "onClick"], be = [
	"disabled",
	"title",
	"aria-label"
], xe = { class: "resource-action-label" }, Se = ["title", "aria-label"], J = { class: "resource-action-label" }, Ce = {
	key: 6,
	class: "resource-filter-buttons"
}, we = [
	"aria-expanded",
	"title",
	"aria-label"
], Te = { class: "resource-action-label" }, Y = {
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
	setup(n) {
		let r = n, i = t(!1), o = t(null), s = t(null), d, p = 0, m = 0, h = () => {
			let e = s.value;
			if (!e) return;
			e.classList.remove("is-compact-1", "is-compact-2", "is-compact-3", "is-compact-4");
			let t = () => {
				let t = getComputedStyle(e), n = parseFloat(t.columnGap) || 0, r = (parseFloat(t.paddingInlineStart) || 0) + (parseFloat(t.paddingInlineEnd) || 0), i = [...e.children].filter((e) => getComputedStyle(e).display !== "none");
				return i.reduce((e, t) => e + t.getBoundingClientRect().width, r + n * Math.max(0, i.length - 1)) <= e.clientWidth + 1;
			};
			for (let n = 1; n <= 4 && !t(); n += 1) e.classList.add(`is-compact-${n}`);
		}, y = () => {
			cancelAnimationFrame(p), p = requestAnimationFrame(h);
		}, b = _(() => (r.filters || []).filter((e) => String(r.filterValues[e.id] ?? e.default ?? "") !== String(e.default ?? "")).length), S = (e, t) => r.t(t.label), w = _(() => {
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
		}), T = {
			item: 0,
			node: 1,
			contextual: 2
		}, E = _(() => w.value.filter((e) => e.primary || e.creationRole || [
			"upload",
			"createNode",
			"createChild",
			"newArticle"
		].includes(e.id)).sort((e, t) => (T[e.creationRole] ?? 3) - (T[t.creationRole] ?? 3))), te = _(() => w.value.filter((e) => !E.value.includes(e))), ne = (e) => {
			o.value?.contains(e.target) || (i.value = !1);
		}, k = (e) => {
			e.key === "Escape" && (i.value = !1);
		};
		return ee(() => {
			document.addEventListener("click", ne), document.addEventListener("keydown", k), d = new ResizeObserver(([e]) => {
				e.contentRect.width !== m && (m = e.contentRect.width, y());
			}), d.observe(s.value), document.fonts?.ready.then(y), y();
		}), e(y), u(() => {
			document.removeEventListener("click", ne), document.removeEventListener("keydown", k), d?.disconnect(), cancelAnimationFrame(p);
		}), (e, t) => (C(), O("div", pe, [D("div", {
			ref_key: "actionRow",
			ref: s,
			class: "resource-actions"
		}, [
			n.dashboardUrl ? (C(), O("a", {
				key: 0,
				class: "btn resource-dashboard-link",
				href: n.dashboardUrl,
				title: n.t(n.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD"),
				"aria-label": n.t(n.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD")
			}, [
				t[8] ||= D("span", {
					class: "fas fa-arrow-left",
					"aria-hidden": "true"
				}, null, -1),
				t[9] ||= f(),
				D("span", H, g(n.t(n.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD")), 1)
			], 8, me)) : v("", !0),
			n.selectionMode ? (C(), O("button", {
				key: 1,
				type: "button",
				class: "btn btn-primary",
				disabled: !n.canComplete,
				title: n.confirmLabel || n.t("COM_SMARTBROWSER_SELECT"),
				"aria-label": n.confirmLabel || n.t("COM_SMARTBROWSER_SELECT"),
				onClick: t[0] ||= (t) => e.$emit("complete")
			}, [
				t[10] ||= D("span", {
					class: "fas fa-check",
					"aria-hidden": "true"
				}, null, -1),
				t[11] ||= f(),
				D("span", W, g(n.confirmLabel || n.t("COM_SMARTBROWSER_SELECT")), 1)
			], 8, U)) : v("", !0),
			n.allowNoUser ? (C(), O("button", {
				key: 2,
				type: "button",
				class: "btn btn-outline-secondary",
				title: n.t("JOPTION_NO_USER"),
				"aria-label": n.t("JOPTION_NO_USER"),
				onClick: t[1] ||= (t) => e.$emit("no-user")
			}, [
				t[12] ||= D("span", {
					class: "fas fa-user",
					"aria-hidden": "true"
				}, null, -1),
				t[13] ||= f(),
				D("span", he, g(n.t("JOPTION_NO_USER")), 1)
			], 8, G)) : v("", !0),
			(C(!0), O(x, null, c(E.value, (t) => (C(), O("button", {
				key: t.id,
				type: "button",
				class: a(["btn btn-outline-secondary", [`resource-action-${t.id}`, { "resource-contextual-add": t.creationRole === "contextual" }]]),
				title: n.t(t.label),
				"aria-label": n.t(t.label),
				disabled: !n.available(t),
				onClick: (n) => e.$emit("action", t)
			}, [D("span", {
				class: a(t.icon),
				"aria-hidden": "true"
			}, null, 2), t.creationRole === "contextual" ? v("", !0) : (C(), O("span", _e, g(n.t(t.label)), 1))], 10, ge))), 128)),
			te.value.length ? (C(), O("div", {
				key: 3,
				ref_key: "actionMenu",
				ref: o,
				class: "resource-action-menu-wrap"
			}, [D("button", {
				type: "button",
				class: "btn btn-outline-secondary resource-action-menu-toggle",
				"aria-expanded": i.value,
				title: n.t("COM_SMARTBROWSER_ACTIONS"),
				"aria-label": n.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: t[2] ||= (e) => i.value = !i.value
			}, [
				t[14] ||= D("span", {
					class: "fas fa-ellipsis-h",
					"aria-hidden": "true"
				}, null, -1),
				t[15] ||= f(),
				D("span", K, g(n.t("COM_SMARTBROWSER_ACTIONS")), 1),
				t[16] ||= f(),
				t[17] ||= D("span", {
					class: "fas fa-angle-down",
					"aria-hidden": "true"
				}, null, -1)
			], 8, ve), i.value ? (C(), O("div", q, [(C(!0), O(x, null, c(te.value, (t) => (C(), O("div", {
				key: t.id,
				class: "resource-action-menu-item",
				role: "none"
			}, [D("button", {
				type: "button",
				role: "menuitem",
				class: a(`resource-action-${t.id}`),
				disabled: !n.available(t),
				onClick: (n) => {
					i.value = !1, e.$emit("action", t);
				}
			}, [D("span", {
				class: a(t.icon),
				"aria-hidden": "true"
			}, null, 2), f(" " + g(n.t(t.label)), 1)], 10, ye)]))), 128))])) : v("", !0)], 512)) : v("", !0),
			n.batchAvailable ? (C(), O("button", {
				key: 4,
				type: "button",
				class: "btn btn-outline-secondary resource-batch-toggle",
				disabled: !n.selection?.length,
				title: n.t("COM_SMARTBROWSER_BATCH_ACTIONS"),
				"aria-label": n.t("COM_SMARTBROWSER_BATCH_ACTIONS"),
				onClick: t[3] ||= (t) => e.$emit("batch")
			}, [
				t[18] ||= D("span", {
					class: "fas fa-magic",
					"aria-hidden": "true"
				}, null, -1),
				t[19] ||= f(),
				D("span", xe, g(n.t("COM_SMARTBROWSER_BATCH")), 1)
			], 8, be)) : v("", !0),
			n.canCancel ? (C(), O("button", {
				key: 5,
				type: "button",
				class: "btn btn-danger resource-picker-cancel",
				title: n.t("JCANCEL"),
				"aria-label": n.t("JCANCEL"),
				onClick: t[4] ||= (t) => e.$emit("cancel")
			}, [
				t[20] ||= D("span", {
					class: "fas fa-times",
					"aria-hidden": "true"
				}, null, -1),
				t[21] ||= f(),
				D("span", J, g(n.t("JCANCEL")), 1)
			], 8, Se)) : v("", !0),
			n.filters?.length ? (C(), O("div", Ce, [D("button", {
				type: "button",
				class: a(["btn resource-filter-toggle", { active: n.filtersOpen }]),
				"aria-expanded": n.filtersOpen,
				title: n.t("COM_SMARTBROWSER_FILTER_OPTIONS"),
				"aria-label": n.t("COM_SMARTBROWSER_FILTER_OPTIONS"),
				onClick: t[5] ||= (t) => e.$emit("toggle-filters")
			}, [
				t[22] ||= D("span", {
					class: "fas fa-filter",
					"aria-hidden": "true"
				}, null, -1),
				t[23] ||= f(),
				D("span", Te, g(n.t("COM_SMARTBROWSER_FILTER_OPTIONS")), 1),
				b.value ? (C(), O("span", Y, g(b.value), 1)) : v("", !0),
				D("span", {
					class: a(["fas fa-angle-down resource-filter-caret", { open: n.filtersOpen }]),
					"aria-hidden": "true"
				}, null, 2)
			], 10, we), D("button", {
				type: "button",
				class: "btn resource-filter-clear",
				disabled: !b.value,
				title: n.t("JCLEAR"),
				onClick: t[6] ||= (t) => e.$emit("clear-filters")
			}, g(n.t("JCLEAR")), 9, Ee)])) : v("", !0),
			n.flatAvailable ? (C(), O("button", {
				key: 7,
				type: "button",
				class: a(["btn resource-flat-toggle", { active: n.flatActive }]),
				title: n.t("COM_SMARTBROWSER_FLAT_VIEW"),
				"aria-label": n.t("COM_SMARTBROWSER_FLAT_VIEW"),
				"aria-pressed": n.flatActive,
				onClick: t[7] ||= (t) => e.$emit("toggle-flat")
			}, [...t[24] ||= [D("span", {
				class: "fas fa-layer-group",
				"aria-hidden": "true"
			}, null, -1)]], 10, De)) : v("", !0),
			n.managerUrl ? (C(), O("a", {
				key: 8,
				class: "btn resource-manager-link",
				href: n.managerUrl,
				target: n.managerNewTab ? "_blank" : void 0,
				rel: n.managerNewTab ? "noopener noreferrer" : void 0,
				title: n.t("COM_SMARTBROWSER_OPEN_JOOMLA_MANAGER"),
				"aria-label": n.t("COM_SMARTBROWSER_OPEN_JOOMLA_MANAGER")
			}, [...t[25] ||= [D("span", {
				class: "fab fa-joomla",
				"aria-hidden": "true"
			}, null, -1)]], 8, Oe)) : v("", !0),
			l(e.$slots, "display-controls")
		], 512), n.filters?.length && n.filtersOpen ? (C(), O("div", ke, [(C(!0), O(x, null, c(n.filters, (t) => (C(), O("label", { key: t.id }, [D("span", null, g(n.t(t.label)), 1), t.type === "select" ? (C(), O("select", {
			key: 0,
			class: "form-select",
			value: n.filterValues[t.id] ?? t.default,
			onChange: (n) => e.$emit("filter", {
				id: t.id,
				value: n.target.value
			})
		}, [(C(!0), O(x, null, c(t.options, (e) => (C(), O("option", {
			key: e.value,
			value: e.value
		}, g(S(t, e)), 9, je))), 128))], 40, Ae)) : v("", !0)]))), 128))])) : v("", !0)]));
	}
}, Ne = ["placeholder"], Pe = ["multiple"], Fe = ["selected"], Ie = ["value", "selected"], X = {
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
		let o = e, s = n, l = t(null), d = _(() => o.options.filter((e) => String(e.value) !== "")), f = _(() => d.value.map((e) => String(e.value)).join("|")), p = (e) => o.multiple ? o.modelValue.includes(String(e)) : String(o.modelValue) === String(e), m = (e) => s("update:modelValue", o.multiple ? Array.from(e.target.selectedOptions, (e) => e.value) : e.target.value), h, y, b, S = () => l.value?.choicesInstance?.hideDropdown(), w = () => {
			if (!h?.matches(":popover-open")) return;
			let e = l.value?.choicesInstance?.containerOuter?.element;
			if (!e) return;
			let t = e.getBoundingClientRect();
			if (t.bottom < 0 || t.top > window.innerHeight) {
				l.value.choicesInstance.hideDropdown();
				return;
			}
			let n = window.innerHeight - t.bottom - 8, r = t.top - 8, i = n < 240 && r > n, a = Math.max(0, i ? r : n);
			h.style.left = `${t.left}px`, h.style.top = `${i ? t.top : t.bottom}px`, h.style.width = `${t.width}px`, h.style.maxHeight = `${a}px`, h.style.transform = i ? "translateY(-100%)" : "", h.style.setProperty("--resource-batch-dropdown-list-height", `${Math.max(0, a - 2)}px`);
		}, T = () => {
			h && (h.classList.contains("is-active") && l.value?.closest("dialog")?.open ? (h.matches(":popover-open") || h.showPopover(), w()) : h.matches(":popover-open") && h.hidePopover());
		};
		return ee(async () => {
			await r(), h = l.value?.choicesInstance?.dropdown?.element, h && (b = l.value.closest("dialog"), h.setAttribute("popover", "manual"), h.classList.add("resource-batch-choices-dropdown"), y = new MutationObserver(T), y.observe(h, {
				attributes: !0,
				attributeFilter: ["class"]
			}), window.addEventListener("scroll", w, !0), window.addEventListener("resize", w), b?.addEventListener("close", S));
		}), u(() => {
			y?.disconnect(), h?.matches(":popover-open") && h.hidePopover(), window.removeEventListener("scroll", w, !0), window.removeEventListener("resize", w), b?.removeEventListener("close", S);
		}), i(() => o.modelValue, async (e) => {
			await r();
			let t = l.value?.choicesInstance;
			if (!t) return;
			let n = o.multiple ? e : e ? [e] : [], i = t.getValue(!0), a = Array.isArray(i) ? i : i ? [i] : [];
			a.filter((e) => !n.includes(String(e))).forEach((e) => t.removeActiveItemsByValue(String(e))), n.filter((e) => !a.includes(String(e))).forEach((e) => t.setChoiceByValue(String(e)));
		}), (t, n) => (C(), O("joomla-field-fancy-select", {
			ref_key: "field",
			ref: l,
			key: f.value,
			class: a({ "resource-batch-single-select": !e.multiple }),
			placeholder: e.t(e.placeholder)
		}, [D("select", {
			class: "form-select",
			multiple: e.multiple,
			onChange: m
		}, [e.multiple ? v("", !0) : (C(), O("option", {
			key: 0,
			value: "",
			selected: !e.modelValue
		}, g(e.t(e.placeholder)), 9, Fe)), (C(!0), O(x, null, c(d.value, (t) => (C(), O("option", {
			key: t.value,
			value: String(t.value),
			selected: p(t.value)
		}, g(e.t(t.label)), 9, Ie))), 128))], 40, Pe)], 10, Ne));
	}
}, Le = { class: "resource-batch-field" }, Re = ["aria-label"], ze = ["aria-pressed", "onClick"], Be = {
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
		return (n, r) => (C(), O("div", Le, [D("span", null, g(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), D("div", {
			class: "btn-group resource-batch-mode-toggle",
			role: "group",
			"aria-label": e.t("COM_SMARTBROWSER_BATCH_MODE")
		}, [(C(), O(x, null, c(t, (t) => D("button", {
			key: t.value,
			type: "button",
			class: a(["btn", e.modelValue === t.value ? "is-active" : ""]),
			"aria-pressed": e.modelValue === t.value,
			onClick: (e) => n.$emit("update:modelValue", t.value)
		}, g(e.t(t.label)), 11, ze)), 64))], 8, Re)]));
	}
}, Ve = ["aria-label"], He = { class: "resource-batch-body" }, Ue = {
	class: "resource-batch-heading",
	role: "heading",
	"aria-level": "3"
}, We = ["open"], Ge = { class: "resource-batch-fields" }, Ke = ["aria-label"], qe = ["value"], Je = ["aria-label"], Ye = { value: "asc" }, Xe = { value: "desc" }, Z = ["open"], Ze = { class: "resource-batch-fields" }, Qe = ["aria-label"], $e = {
	key: 1,
	class: "text-danger"
}, et = ["open"], tt = { class: "resource-batch-fields" }, nt = ["disabled"], Q = { class: "resource-batch-check" }, rt = { key: 0 }, it = ["open"], at = { class: "resource-batch-fields" }, ot = { class: "input-group" }, st = ["open"], ct = { class: "resource-batch-fields" }, lt = { class: "resource-batch-check" }, ut = ["disabled"], dt = ["open"], ft = ["onClick"], pt = { class: "resource-batch-fields" }, mt = ["onUpdate:modelValue", "aria-label"], ht = { value: "" }, gt = ["value"], _t = ["open"], vt = {
	key: 0,
	class: "resource-batch-fields"
}, yt = { class: "resource-batch-field" }, bt = { class: "resource-batch-field" }, xt = ["open"], St = {
	key: 0,
	class: "resource-batch-fields"
}, Ct = ["open"], wt = ["onClick"], Tt = {
	key: 0,
	class: "resource-batch-fields"
}, Et = ["onUpdate:modelValue", "aria-label"], Dt = { value: "" }, Ot = ["value"], kt = ["open"], At = {
	key: 0,
	class: "resource-batch-fields"
}, jt = { class: "resource-batch-field" }, Mt = { class: "resource-batch-field" }, Nt = ["open"], Pt = {
	key: 0,
	class: "resource-batch-fields"
}, Ft = ["open"], It = ["open"], Lt = {
	key: 0,
	class: "resource-batch-fields"
}, Rt = ["open"], zt = {
	key: 0,
	class: "resource-batch-fields"
}, Bt = { value: "add" }, Vt = { value: "remove" }, Ht = { value: "set" }, Ut = ["open"], Wt = {
	key: 0,
	class: "resource-batch-fields"
}, Gt = { value: "yes" }, Kt = { value: "no" }, qt = { class: "resource-batch-bottom" }, Jt = { class: "resource-batch-preview" }, Yt = {
	class: "resource-batch-preview-heading",
	role: "heading",
	"aria-level": "3"
}, Xt = {
	key: 0,
	class: "resource-batch-summary"
}, Zt = {
	key: 0,
	class: "fas fa-arrow-right resource-batch-sequence-arrow",
	"aria-hidden": "true"
}, Qt = { class: "resource-batch-summary-step" }, $t = {
	class: "resource-batch-summary-step-heading",
	role: "heading",
	"aria-level": "4"
}, en = {
	key: 0,
	class: "resource-batch-summary-params"
}, tn = {
	key: 1,
	class: "resource-batch-no-changes"
}, nn = { class: "resource-batch-footer" }, rn = { class: "resource-batch-footer-actions" }, an = ["disabled"], on = ["aria-label"], sn = { class: "resource-batch-preview-dialog-head" }, cn = ["aria-label"], ln = { class: "resource-batch-preview-list" }, un = ["title"], dn = ["title"], fn = ["aria-label"], pn = { class: "resource-batch-preview-dialog-head" }, mn = ["aria-label"], hn = { class: "resource-batch-selected-list" }, gn = {
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
		let o = e, l = i, u = p("resourceApi"), d = t(!1), m = t([]), w = t(!1), T = t(""), E = 0, re = t(null), A = t(null), ie = t(null), j = _(() => o.adapter.replace(/^flat-/, "")), ae = _(() => j.value === "media"), oe = _(() => ["articles", "articles-by-tag"].includes(j.value)), M = _(() => j.value === "categories"), se = _(() => j.value === "tags"), ce = _(() => j.value === "menus"), le = _(() => j.value === "users"), ue = _(() => ({
			articles: "article:",
			"articles-by-tag": "article:",
			categories: "category:",
			tags: "tag:",
			menus: "menu-item:",
			users: "user:"
		})[j.value]), N = _(() => ue.value ? o.selection.filter((e) => e.id.startsWith(ue.value)) : o.selection), de = {
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
		}, P = {
			changeLanguage: !1,
			language: "",
			changeAccess: !1,
			access: "",
			tagsOpen: !1,
			tagAdd: [],
			tagRemove: [],
			placement: "none",
			category: ""
		}, F = {
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
		}, I = {
			groupOpen: !1,
			groupAction: "add",
			group: "",
			resetOpen: !1,
			reset: "yes"
		}, L = k({ ...de }), R = k({ ...P }), z = k({ ...F }), B = k({ ...I }), V = k({
			enabled: !1,
			field: "title",
			direction: "asc"
		}), fe = _(() => N.value.length === 1 && N.value[0].capabilities?.extract === !0), pe = [{
			id: "language",
			enabled: "changeLanguage",
			label: "COM_SMARTBROWSER_BATCH_SET_LANGUAGE",
			placeholder: "COM_SMARTBROWSER_SELECT_LANGUAGE"
		}, {
			id: "access",
			enabled: "changeAccess",
			label: "COM_SMARTBROWSER_BATCH_SET_ACCESS",
			placeholder: "COM_SMARTBROWSER_SELECT_ACCESS"
		}], me = pe, H = _(() => V.enabled || JSON.stringify(L) !== JSON.stringify(de) || JSON.stringify(R) !== JSON.stringify(P) || JSON.stringify(z) !== JSON.stringify(F) || JSON.stringify(B) !== JSON.stringify(I)), U = (e) => (o.batchOptions[e] || o.filters.find((t) => t.id === e)?.options || []).filter((e) => String(e.value) !== ""), W = _(() => (o.batchOptions.menu || []).flatMap((e) => [{
			value: `${e.value}.0`,
			label: e.label
		}, ...(o.batchOptions.menuParent || []).filter((t) => t.menu === e.value).map((t) => ({
			value: `${e.value}.${t.value}`,
			label: `- ${t.label}`
		}))])), G = _(() => L.zipName.trim().replace(/\.zip$/i, "")), he = (e) => {
			R.tagAdd = e, R.tagRemove = R.tagRemove.filter((t) => !e.includes(t));
		}, ge = (e) => {
			R.tagRemove = e, R.tagAdd = R.tagAdd.filter((t) => !e.includes(t));
		}, _e = (e) => {
			z.tagAdd = e, z.tagRemove = z.tagRemove.filter((t) => !e.includes(t));
		}, ve = (e) => {
			z.tagRemove = e, z.tagAdd = z.tagAdd.filter((t) => !e.includes(t));
		}, K = (e, t) => o.t(U(e).find((e) => String(e.value) === String(t))?.label || t), q = _(() => {
			let e = [];
			if (V.enabled && o.orderingAvailable && e.push({
				id: "sort",
				title: o.t("COM_SMARTBROWSER_BATCH_SORT"),
				parameters: [o.t(o.sortFields.find((e) => e.id === V.field)?.label || V.field), o.t(V.direction === "asc" ? "COM_SMARTBROWSER_ASCENDING" : "COM_SMARTBROWSER_DESCENDING")]
			}), ae.value) L.placement !== "none" && e.push({
				id: "placement",
				title: o.t(L.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
				parameters: [m.value.find((e) => e.value === L.destination)?.path || "..."]
			}), L.rename && e.push({
				id: "rename",
				title: o.t("COM_SMARTBROWSER_BATCH_RENAME"),
				parameters: [
					...L.find ? [`${o.t("COM_SMARTBROWSER_BATCH_FIND")}: ${L.find} → ${L.replace}`] : [],
					...L.prefix ? [`${o.t("COM_SMARTBROWSER_BATCH_PREFIX")}: ${L.prefix}`] : [],
					...L.suffix ? [`${o.t("COM_SMARTBROWSER_BATCH_SUFFIX")}: ${L.suffix}`] : [],
					...L.number ? [`${o.t("COM_SMARTBROWSER_BATCH_NUMBER")}: ${L.startAt}`] : []
				],
				preview: !0
			}), L.zip && e.push({
				id: "zip",
				title: o.t("COM_SMARTBROWSER_BATCH_ZIP"),
				parameters: [`${G.value}.zip`]
			}), L.extract && fe.value && e.push({
				id: "extract",
				title: o.t("COM_SMARTBROWSER_BATCH_EXTRACT"),
				parameters: L.deleteArchive ? [o.t("COM_SMARTBROWSER_BATCH_EXTRACT_DELETE")] : []
			});
			else if (oe.value) {
				for (let t of pe) R[t.enabled] && R[t.id] && e.push({
					id: t.id,
					title: o.t(t.label),
					parameters: [K(t.id, R[t.id])]
				});
				R.tagsOpen && R.tagAdd.length && e.push({
					id: "tag-add",
					title: o.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: R.tagAdd.map((e) => K("tag", e))
				}), R.tagsOpen && R.tagRemove.length && e.push({
					id: "tag-remove",
					title: o.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: R.tagRemove.map((e) => K("tag", e))
				}), R.placement !== "none" && e.unshift({
					id: "placement",
					title: o.t(R.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [R.category ? K("category", R.category) : "..."]
				});
			} else if (M.value || se.value || ce.value) {
				for (let t of me) z[t.enabled] && z[t.id] && e.push({
					id: t.id,
					title: o.t(t.label),
					parameters: [K(t.id, z[t.id])]
				});
				M.value && (z.tagsOpen && z.tagAdd.length && e.push({
					id: "tag-add",
					title: o.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: z.tagAdd.map((e) => K("tag", e))
				}), z.tagsOpen && z.tagRemove.length && e.push({
					id: "tag-remove",
					title: o.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: z.tagRemove.map((e) => K("tag", e))
				}), z.placement !== "none" && e.unshift({
					id: "placement",
					title: o.t(z.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [z.category ? K("category", z.category) : "..."]
				}), z.flipOrdering && e.push({
					id: "flip",
					title: o.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING"),
					parameters: []
				})), ce.value && z.placement !== "none" && e.unshift({
					id: "placement",
					title: o.t(z.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [W.value.find((e) => e.value === z.menuDestination)?.label || "..."]
				});
			} else le.value && (B.groupOpen && B.group && e.push({
				id: "group",
				title: o.t({
					add: "COM_SMARTBROWSER_BATCH_GROUP_ADD",
					remove: "COM_SMARTBROWSER_BATCH_GROUP_REMOVE",
					set: "COM_SMARTBROWSER_BATCH_GROUP_SET"
				}[B.groupAction]),
				parameters: [K("group", B.group)]
			}), B.resetOpen && e.push({
				id: "reset",
				title: o.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET"),
				parameters: [o.t(B.reset === "yes" ? "JYES" : "JNO")]
			}));
			return e;
		}), ye = _(() => !(!N.value.length || !q.value.length || L.extract && (!fe.value || L.rename || L.zip || L.placement !== "none") || ae.value && L.placement !== "none" && !m.value.some((e) => e.value === L.destination) || oe.value && R.placement !== "none" && !R.category || M.value && z.placement !== "none" && !z.category || ce.value && z.placement !== "none" && !W.value.some((e) => e.value === z.menuDestination) || ae.value && L.zip && !G.value)), be = () => {
			if (ae.value) return {
				...L,
				zipName: G.value
			};
			if (oe.value) return {
				language: R.changeLanguage ? R.language : "",
				access: R.changeAccess ? R.access : "",
				tagAdd: R.tagsOpen ? R.tagAdd : [],
				tagRemove: R.tagsOpen ? R.tagRemove : [],
				placement: R.placement,
				category: R.category
			};
			if (le.value) return {
				group: B.groupOpen ? B.group : "",
				groupAction: B.groupAction === "remove" ? "del" : B.groupAction,
				reset: B.resetOpen ? B.reset : ""
			};
			let e = z.menuDestination.lastIndexOf(".");
			return {
				language: z.changeLanguage ? z.language : "",
				access: z.changeAccess ? z.access : "",
				tagAdd: M.value && z.tagsOpen ? z.tagAdd : [],
				tagRemove: M.value && z.tagsOpen ? z.tagRemove : [],
				placement: z.placement,
				category: z.category,
				flipOrdering: M.value && z.flipOrdering,
				menu: ce.value && e >= 0 ? z.menuDestination.slice(0, e) : "",
				menuParent: ce.value && e >= 0 ? z.menuDestination.slice(e + 1) : "0"
			};
		}, xe = async () => {
			if (!d.value && ye.value) {
				d.value = !0;
				try {
					await new Promise((e, t) => l("apply", {
						selection: N.value.map((e) => e.id),
						payload: {
							...be(),
							...V.enabled && o.orderingAvailable ? { sort: {
								field: V.field,
								direction: V.direction
							} } : {}
						},
						resolve: e,
						reject: t
					})), Oe();
				} catch (e) {
					window.Joomla?.renderMessages?.({ error: [e.message || String(e)] });
				} finally {
					d.value = !1;
				}
			}
		}, Se = (e, t) => {
			if (!L.rename) return e.title;
			let n = e.kind === "item" ? e.title.lastIndexOf(".") : -1, r = n > 0 ? e.title.slice(0, n) : e.title, i = n > 0 ? e.title.slice(n) : "", a = L.find ? r.split(L.find).join(L.replace) : r, o = L.number ? `-${String(Math.max(1, Number(L.startAt) || 1) + t).padStart(2, "0")}` : "";
			return `${L.prefix}${a}${L.suffix}${o}${i}`;
		}, J = _(() => N.value.map((e, t) => {
			let n = e.id.includes(":") ? e.id.slice(e.id.indexOf(":") + 1) : e.title, r = L.placement !== "none" && L.destination ? `${L.destination.slice(L.destination.indexOf(":") + 1).replace(/\/$/, "")}/` : n.slice(0, n.lastIndexOf("/") + 1);
			return {
				id: e.id,
				before: n,
				after: r + Se(e, t)
			};
		})), Ce = async () => {
			let e = ++E;
			w.value = !0, T.value = "";
			try {
				let t = await u.execute("batchFolders", N.value.map((e) => e.id));
				e === E && (m.value = t);
			} catch (t) {
				e === E && (T.value = t.message || String(t));
			} finally {
				e === E && (w.value = !1);
			}
		}, we = () => {
			Object.assign(L, de), Object.assign(R, P), Object.assign(z, F), Object.assign(B, I), Object.assign(V, {
				enabled: !1,
				field: o.sortFields[0]?.id || "title",
				direction: "asc"
			}), m.value = [], re.value?.showModal(), ae.value && Ce();
		}, Te = () => A.value?.showModal(), Y = () => {
			A.value?.open && A.value.close();
		}, Ee = () => ie.value?.showModal(), De = () => {
			ie.value?.open && ie.value.close();
		}, Oe = () => {
			E++, Y(), De(), re.value?.close();
		};
		return r({
			open: we,
			close: Oe
		}), ee(() => {
			window.SmartBrowserDialogDismiss.install(re.value, () => H.value), window.SmartBrowserDialogDismiss.install(A.value), window.SmartBrowserDialogDismiss.install(ie.value), re.value.addEventListener("close", () => {
				Y(), De();
			});
		}), (t, r) => (C(), O(x, null, [
			D("dialog", {
				ref_key: "dialog",
				ref: re,
				class: "resource-batch-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_BATCH_ACTIONS")
			}, [D("div", He, [
				D("div", Ue, g(e.t("COM_SMARTBROWSER_BATCH_SELECT_ACTIONS")), 1),
				e.orderingAvailable && N.value.every((e) => e.capabilities?.reorder) ? (C(), O("details", {
					key: 0,
					class: "resource-batch-step",
					open: V.enabled
				}, [D("summary", { onClick: r[0] ||= S((e) => V.enabled = !V.enabled, ["prevent"]) }, g(e.t("COM_SMARTBROWSER_BATCH_SORT")), 1), D("div", Ge, [s(D("select", {
					"onUpdate:modelValue": r[1] ||= (e) => V.field = e,
					class: "form-select",
					"aria-label": e.t("COM_SMARTBROWSER_BATCH_SORT")
				}, [(C(!0), O(x, null, c(e.sortFields, (t) => (C(), O("option", {
					key: t.id,
					value: t.id
				}, g(e.t(t.label)), 9, qe))), 128))], 8, Ke), [[y, V.field]]), s(D("select", {
					"onUpdate:modelValue": r[2] ||= (e) => V.direction = e,
					class: "form-select",
					"aria-label": e.t("COM_SMARTBROWSER_SORT_DIRECTION")
				}, [D("option", Ye, g(e.t("COM_SMARTBROWSER_ASCENDING")), 1), D("option", Xe, g(e.t("COM_SMARTBROWSER_DESCENDING")), 1)], 8, Je), [[y, V.direction]])])], 8, We)) : v("", !0),
				ae.value ? (C(), O(x, { key: 1 }, [
					D("details", {
						class: "resource-batch-step",
						open: L.placement !== "none"
					}, [D("summary", { onClick: r[3] ||= S((e) => L.placement = L.placement === "none" ? "move" : "none", ["prevent"]) }, g(e.t("COM_SMARTBROWSER_BATCH_PLACEMENT")), 1), D("div", Ze, [n(Be, {
						modelValue: L.placement,
						"onUpdate:modelValue": r[4] ||= (e) => L.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), D("label", null, [f(g(e.t("COM_SMARTBROWSER_BATCH_DESTINATION_FOLDER")) + " ", 1), w.value ? (C(), O("span", {
						key: 0,
						class: "spinner-border spinner-border-sm",
						role: "status",
						"aria-label": e.t("COM_SMARTBROWSER_LOADING_FOLDERS")
					}, null, 8, Qe)) : T.value ? (C(), O("span", $e, g(T.value), 1)) : (C(), ne(X, {
						key: 2,
						modelValue: L.destination,
						"onUpdate:modelValue": r[5] ||= (e) => L.destination = e,
						options: m.value,
						placeholder: "COM_SMARTBROWSER_SELECT_FOLDER",
						t: e.t
					}, null, 8, [
						"modelValue",
						"options",
						"t"
					]))])])], 8, Z),
					D("details", {
						class: "resource-batch-step",
						open: L.rename
					}, [D("summary", { onClick: r[6] ||= S((e) => L.rename = !L.rename, ["prevent"]) }, g(e.t("COM_SMARTBROWSER_BATCH_RENAME")), 1), D("div", tt, [
						D("label", null, [f(g(e.t("COM_SMARTBROWSER_BATCH_FIND")), 1), s(D("input", {
							"onUpdate:modelValue": r[7] ||= (e) => L.find = e,
							type: "text",
							class: "form-control"
						}, null, 512), [[b, L.find]])]),
						D("label", null, [f(g(e.t("COM_SMARTBROWSER_BATCH_REPLACE")), 1), s(D("input", {
							"onUpdate:modelValue": r[8] ||= (e) => L.replace = e,
							type: "text",
							class: "form-control",
							disabled: !L.find
						}, null, 8, nt), [[b, L.replace]])]),
						D("label", null, [f(g(e.t("COM_SMARTBROWSER_BATCH_PREFIX")), 1), s(D("input", {
							"onUpdate:modelValue": r[9] ||= (e) => L.prefix = e,
							type: "text",
							class: "form-control"
						}, null, 512), [[b, L.prefix]])]),
						D("label", null, [f(g(e.t("COM_SMARTBROWSER_BATCH_SUFFIX")), 1), s(D("input", {
							"onUpdate:modelValue": r[10] ||= (e) => L.suffix = e,
							type: "text",
							class: "form-control"
						}, null, 512), [[b, L.suffix]])]),
						D("label", Q, [s(D("input", {
							"onUpdate:modelValue": r[11] ||= (e) => L.number = e,
							type: "checkbox",
							class: "form-check-input"
						}, null, 512), [[te, L.number]]), f(" " + g(e.t("COM_SMARTBROWSER_BATCH_NUMBER")), 1)]),
						L.number ? (C(), O("label", rt, [f(g(e.t("COM_SMARTBROWSER_BATCH_START_AT")), 1), s(D("input", {
							"onUpdate:modelValue": r[12] ||= (e) => L.startAt = e,
							type: "number",
							min: "1",
							class: "form-control"
						}, null, 512), [[
							b,
							L.startAt,
							void 0,
							{ number: !0 }
						]])])) : v("", !0)
					])], 8, et),
					D("details", {
						class: "resource-batch-step",
						open: L.zip
					}, [D("summary", { onClick: r[13] ||= S((e) => L.zip = !L.zip, ["prevent"]) }, g(e.t("COM_SMARTBROWSER_BATCH_ZIP")), 1), D("div", at, [D("label", null, [f(g(e.t("COM_SMARTBROWSER_BATCH_ZIP_NAME")), 1), D("span", ot, [s(D("input", {
						"onUpdate:modelValue": r[14] ||= (e) => L.zipName = e,
						type: "text",
						class: "form-control",
						onBlur: r[15] ||= (e) => L.zipName = G.value
					}, null, 544), [[b, L.zipName]]), r[35] ||= D("span", { class: "input-group-text" }, ".zip", -1)])])])], 8, it),
					fe.value ? (C(), O("details", {
						key: 0,
						class: "resource-batch-step",
						open: L.extract
					}, [D("summary", { onClick: r[16] ||= S((e) => L.extract = !L.extract, ["prevent"]) }, g(e.t("COM_SMARTBROWSER_BATCH_EXTRACT")), 1), D("div", ct, [D("label", lt, [s(D("input", {
						"onUpdate:modelValue": r[17] ||= (e) => L.deleteArchive = e,
						type: "checkbox",
						class: "form-check-input",
						disabled: !N.value.every((e) => e.capabilities?.delete)
					}, null, 8, ut), [[te, L.deleteArchive]]), f(" " + g(e.t("COM_SMARTBROWSER_BATCH_EXTRACT_DELETE")), 1)])])], 8, st)) : v("", !0)
				], 64)) : oe.value ? (C(), O(x, { key: 2 }, [
					(C(), O(x, null, c(pe, (t) => D("details", {
						key: t.id,
						class: "resource-batch-step",
						open: R[t.enabled]
					}, [D("summary", { onClick: S((e) => R[t.enabled] = !R[t.enabled], ["prevent"]) }, g(e.t(t.label)), 9, ft), D("div", pt, [s(D("select", {
						"onUpdate:modelValue": (e) => R[t.id] = e,
						class: "form-select",
						"aria-label": e.t(t.label)
					}, [D("option", ht, g(e.t(t.placeholder)), 1), (C(!0), O(x, null, c(U(t.id), (t) => (C(), O("option", {
						key: t.value,
						value: t.value
					}, g(e.t(t.label)), 9, gt))), 128))], 8, mt), [[y, R[t.id]]])])], 8, dt)), 64)),
					D("details", {
						class: "resource-batch-step",
						open: R.tagsOpen
					}, [D("summary", { onClick: r[18] ||= S((e) => R.tagsOpen = !R.tagsOpen, ["prevent"]) }, g(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), R.tagsOpen ? (C(), O("div", vt, [D("div", yt, [D("span", null, g(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), n(X, {
						"model-value": R.tagAdd,
						options: U("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": he
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])]), D("div", bt, [D("span", null, g(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), n(X, {
						"model-value": R.tagRemove,
						options: U("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": ge
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])])])) : v("", !0)], 8, _t),
					D("details", {
						class: "resource-batch-step",
						open: R.placement !== "none"
					}, [D("summary", { onClick: r[19] ||= S((e) => R.placement = R.placement === "none" ? "move" : "none", ["prevent"]) }, g(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), R.placement === "none" ? v("", !0) : (C(), O("div", St, [n(Be, {
						modelValue: R.placement,
						"onUpdate:modelValue": r[20] ||= (e) => R.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), D("label", null, [f(g(e.t("COM_SMARTBROWSER_CATEGORY")), 1), n(X, {
						modelValue: R.category,
						"onUpdate:modelValue": r[21] ||= (e) => R.category = e,
						options: U("category"),
						placeholder: "COM_SMARTBROWSER_SELECT_CATEGORY",
						t: e.t
					}, null, 8, [
						"modelValue",
						"options",
						"t"
					])])]))], 8, xt)
				], 64)) : M.value || se.value || ce.value ? (C(), O(x, { key: 3 }, [
					(C(!0), O(x, null, c(h(me), (t) => (C(), O("details", {
						key: t.id,
						class: "resource-batch-step",
						open: z[t.enabled]
					}, [D("summary", { onClick: S((e) => z[t.enabled] = !z[t.enabled], ["prevent"]) }, g(e.t(t.label)), 9, wt), z[t.enabled] ? (C(), O("div", Tt, [s(D("select", {
						"onUpdate:modelValue": (e) => z[t.id] = e,
						class: "form-select",
						"aria-label": e.t(t.label)
					}, [D("option", Dt, g(e.t(t.placeholder)), 1), (C(!0), O(x, null, c(U(t.id), (t) => (C(), O("option", {
						key: t.value,
						value: t.value
					}, g(e.t(t.label)), 9, Ot))), 128))], 8, Et), [[y, z[t.id]]])])) : v("", !0)], 8, Ct))), 128)),
					M.value ? (C(), O("details", {
						key: 0,
						class: "resource-batch-step",
						open: z.tagsOpen
					}, [D("summary", { onClick: r[22] ||= S((e) => z.tagsOpen = !z.tagsOpen, ["prevent"]) }, g(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), z.tagsOpen ? (C(), O("div", At, [D("div", jt, [D("span", null, g(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), n(X, {
						"model-value": z.tagAdd,
						options: U("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": _e
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])]), D("div", Mt, [D("span", null, g(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), n(X, {
						"model-value": z.tagRemove,
						options: U("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": ve
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])])])) : v("", !0)], 8, kt)) : v("", !0),
					M.value ? (C(), O("details", {
						key: 1,
						class: "resource-batch-step",
						open: z.placement !== "none"
					}, [D("summary", { onClick: r[23] ||= S((e) => z.placement = z.placement === "none" ? "move" : "none", ["prevent"]) }, g(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), z.placement === "none" ? v("", !0) : (C(), O("div", Pt, [n(Be, {
						modelValue: z.placement,
						"onUpdate:modelValue": r[24] ||= (e) => z.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), D("label", null, [f(g(e.t("COM_SMARTBROWSER_BATCH_PARENT_CATEGORY")), 1), n(X, {
						modelValue: z.category,
						"onUpdate:modelValue": r[25] ||= (e) => z.category = e,
						options: U("category"),
						placeholder: "COM_SMARTBROWSER_SELECT_CATEGORY",
						t: e.t
					}, null, 8, [
						"modelValue",
						"options",
						"t"
					])])]))], 8, Nt)) : v("", !0),
					M.value ? (C(), O("details", {
						key: 2,
						class: "resource-batch-step",
						open: z.flipOrdering
					}, [D("summary", { onClick: r[26] ||= S((e) => z.flipOrdering = !z.flipOrdering, ["prevent"]) }, g(e.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING")), 1)], 8, Ft)) : v("", !0),
					ce.value ? (C(), O("details", {
						key: 3,
						class: "resource-batch-step",
						open: z.placement !== "none"
					}, [D("summary", { onClick: r[27] ||= S((e) => z.placement = z.placement === "none" ? "move" : "none", ["prevent"]) }, g(e.t("COM_SMARTBROWSER_BATCH_MENU_PLACEMENT")), 1), z.placement === "none" ? v("", !0) : (C(), O("div", Lt, [n(Be, {
						modelValue: z.placement,
						"onUpdate:modelValue": r[28] ||= (e) => z.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), D("label", null, [f(g(e.t("COM_SMARTBROWSER_BATCH_MENU_DESTINATION")), 1), n(X, {
						modelValue: z.menuDestination,
						"onUpdate:modelValue": r[29] ||= (e) => z.menuDestination = e,
						options: W.value,
						placeholder: "COM_SMARTBROWSER_SELECT_MENU",
						t: e.t
					}, null, 8, [
						"modelValue",
						"options",
						"t"
					])])]))], 8, It)) : v("", !0)
				], 64)) : le.value ? (C(), O(x, { key: 4 }, [D("details", {
					class: "resource-batch-step",
					open: B.groupOpen
				}, [D("summary", { onClick: r[30] ||= S((e) => B.groupOpen = !B.groupOpen, ["prevent"]) }, g(e.t("COM_SMARTBROWSER_BATCH_USER_GROUPS")), 1), B.groupOpen ? (C(), O("div", zt, [D("label", null, [f(g(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), s(D("select", {
					"onUpdate:modelValue": r[31] ||= (e) => B.groupAction = e,
					class: "form-select resource-batch-mode-select"
				}, [
					D("option", Bt, g(e.t("COM_SMARTBROWSER_BATCH_GROUP_ADD")), 1),
					D("option", Vt, g(e.t("COM_SMARTBROWSER_BATCH_GROUP_REMOVE")), 1),
					D("option", Ht, g(e.t("COM_SMARTBROWSER_BATCH_GROUP_SET")), 1)
				], 512), [[y, B.groupAction]])]), D("label", null, [f(g(e.t("COM_SMARTBROWSER_USER_GROUP")), 1), n(X, {
					modelValue: B.group,
					"onUpdate:modelValue": r[32] ||= (e) => B.group = e,
					options: U("group"),
					placeholder: "COM_SMARTBROWSER_SELECT_USER_GROUP",
					t: e.t
				}, null, 8, [
					"modelValue",
					"options",
					"t"
				])])])) : v("", !0)], 8, Rt), D("details", {
					class: "resource-batch-step",
					open: B.resetOpen
				}, [D("summary", { onClick: r[33] ||= S((e) => B.resetOpen = !B.resetOpen, ["prevent"]) }, g(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), B.resetOpen ? (C(), O("div", Wt, [D("label", null, [f(g(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), s(D("select", {
					"onUpdate:modelValue": r[34] ||= (e) => B.reset = e,
					class: "form-select"
				}, [D("option", Gt, g(e.t("JYES")), 1), D("option", Kt, g(e.t("JNO")), 1)], 512), [[y, B.reset]])])])) : v("", !0)], 8, Ut)], 64)) : v("", !0)
			]), D("div", qt, [D("div", Jt, [D("div", Yt, g(e.t("COM_SMARTBROWSER_BATCH_PREVIEW")), 1), q.value.length ? (C(), O("div", Xt, [(C(!0), O(x, null, c(q.value, (t, n) => (C(), O("div", {
				key: t.id,
				class: "resource-batch-sequence-item"
			}, [n ? (C(), O("span", Zt)) : v("", !0), D("div", Qt, [D("div", $t, g(t.title), 1), t.parameters.length || t.preview ? (C(), O("div", en, [(C(!0), O(x, null, c(t.parameters, (e) => (C(), O("span", { key: e }, g(e), 1))), 128)), t.preview ? (C(), O("button", {
				key: 0,
				type: "button",
				class: "resource-batch-preview-link",
				onClick: Te
			}, g(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")), 1)) : v("", !0)])) : v("", !0)])]))), 128))])) : (C(), O("p", tn, g(e.t("COM_SMARTBROWSER_BATCH_NO_CHANGES")), 1))]), D("div", nn, [D("button", {
				type: "button",
				class: "resource-batch-items-link",
				onClick: Ee
			}, g(N.value.length) + " " + g(e.t(N.value.length === 1 ? "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_ONE" : "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_MANY")), 1), D("div", rn, [D("button", {
				type: "button",
				class: "btn btn-primary",
				disabled: d.value || !ye.value,
				onClick: xe
			}, g(e.t("COM_SMARTBROWSER_BATCH_APPLY")), 9, an), D("button", {
				type: "button",
				class: "btn btn-danger",
				onClick: Oe
			}, g(e.t("COM_SMARTBROWSER_CANCEL")), 1)])])])], 8, Ve),
			D("dialog", {
				ref_key: "previewDialog",
				ref: A,
				class: "resource-batch-preview-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")
			}, [D("div", sn, [D("strong", null, g(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")) + " (" + g(J.value.length) + ")", 1), D("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: Y
			}, null, 8, cn)]), D("div", ln, [(C(!0), O(x, null, c(J.value, (e) => (C(), O("div", {
				key: e.id,
				class: "resource-batch-preview-row"
			}, [
				D("span", { title: e.before }, g(e.before), 9, un),
				r[36] ||= D("span", {
					class: "fas fa-arrow-right",
					"aria-hidden": "true"
				}, null, -1),
				D("strong", { title: e.after }, g(e.after), 9, dn)
			]))), 128))])], 8, on),
			D("dialog", {
				ref_key: "selectionDialog",
				ref: ie,
				class: "resource-batch-preview-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_SELECTED_ITEMS")
			}, [D("div", pn, [D("strong", null, g(e.t("COM_SMARTBROWSER_SELECTED_ITEMS")), 1), D("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: De
			}, null, 8, mn)]), D("ul", hn, [(C(!0), O(x, null, c(N.value, (e) => (C(), O("li", { key: e.id }, [D("span", {
				class: a(e.icon || "fas fa-file"),
				"aria-hidden": "true"
			}, null, 2), D("span", null, g(e.title), 1)]))), 128))])], 8, fn)
		], 64));
	}
}, _n = {
	class: "resource-breadcrumb",
	"aria-label": "Breadcrumb"
}, vn = [
	"title",
	"aria-label",
	"onClick"
], yn = {
	key: 1,
	class: "resource-breadcrumb-title"
}, bn = {
	__name: "ResourceBreadcrumb",
	props: {
		breadcrumb: Array,
		root: Object,
		rootIcon: String,
		iconOnlyRoot: Boolean
	},
	emits: ["open"],
	setup(e) {
		let t = e, n = _(() => {
			let e = t.breadcrumb || [], n = e[0] || t.root;
			return n ? [n, ...e.slice(1).filter((e) => e.visible !== !1)] : [];
		});
		return (t, r) => (C(), O("nav", _n, [(C(!0), O(x, null, c(n.value, (n, r) => (C(), O("button", {
			key: n.id,
			type: "button",
			class: a({ "root-crumb": r === 0 && e.iconOnlyRoot }),
			title: n.title,
			"aria-label": r === 0 && e.iconOnlyRoot ? n.title : void 0,
			onClick: (e) => t.$emit("open", n.id)
		}, [r === 0 ? (C(), O("span", {
			key: 0,
			class: a(n.useResourceIcon ? n.openIcon || n.icon : e.rootIcon),
			"aria-hidden": "true"
		}, null, 2)) : v("", !0), r !== 0 || !e.iconOnlyRoot ? (C(), O("span", yn, g(n.title), 1)) : v("", !0)], 10, vn))), 128))]));
	}
}, xn = {
	class: "resource-toolbar",
	role: "toolbar"
}, Sn = { class: "resource-toolbar-primary" }, Cn = { class: "resource-view-controls" }, wn = [
	"disabled",
	"title",
	"aria-label"
], Tn = ["title"], En = ["title"], Dn = ["disabled"], On = ["disabled"], kn = ["title"], An = { "aria-hidden": "true" }, jn = [
	"title",
	"aria-label",
	"aria-expanded"
], Mn = {
	key: 0,
	class: "resource-column-menu"
}, Nn = { class: "resource-column-menu-title" }, Pn = [
	"checked",
	"disabled",
	"onChange"
], Fn = { class: "resource-mode-controls" }, In = ["title", "onClick"], Ln = ["title"], Rn = {
	key: 0,
	class: "resource-toolbar-expanded resource-search-row"
}, zn = {
	for: "smartbrowser-search",
	class: "visually-hidden"
}, Bn = { class: "input-group resource-search-control" }, Vn = ["value", "placeholder"], Hn = ["title"], Un = { class: "visually-hidden" }, Wn = {
	key: 1,
	class: "resource-toolbar-expanded resource-sort-row"
}, Gn = { class: "resource-sort-controls" }, Kn = { class: "visually-hidden" }, qn = ["value"], Jn = { value: "" }, Yn = ["value"], Xn = { class: "visually-hidden" }, Zn = ["value", "disabled"], Qn = { value: "asc" }, $n = { value: "desc" }, er = {
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
		let r = e, i = _(() => r.views.find((e) => e.id === r.activeView) || {}), o = [
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
		], s = _(() => {
			let e = r.sortFields?.length ? [...r.sortFields] : [...o];
			r.orderingField && !e.some((e) => e.id === r.orderingField) && e.push({
				id: r.orderingField,
				label: "JGRID_HEADING_ORDERING"
			});
			let t = (r.columns || []).flatMap((e) => e.dateGroup ? (e.fields || []).map((e) => e.sortField || e.id) : [e.sortField || e.id]), n = (e) => e === r.orderingField ? -1 : t.indexOf(e);
			return e.sort((e, i) => {
				let a = n(e.id), o = n(i.id);
				return (a < 0 && e.id !== r.orderingField ? t.length : a) - (o < 0 && i.id !== r.orderingField ? t.length : o);
			});
		}), l = t(!1), d = t(!1), f = t(!1), p = t(null), m = (e) => {
			p.value?.contains(e.target) || (f.value = !1);
		};
		ee(() => document.addEventListener("pointerdown", m)), u(() => document.removeEventListener("pointerdown", m));
		let h = _(() => ({
			created: "C",
			modified: "M",
			both: "M&C"
		})[r.detailsDateMode] || "M"), y = _(() => `${r.t("COM_SMARTBROWSER_DATE")}: ${h.value}`), b = (e) => i.value.controls?.includes(e);
		return (t, r) => (C(), O("div", xn, [
			D("div", Sn, [n(bn, {
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
			]), D("div", Cn, [
				e.reorderVisible ? (C(), ne(P, {
					key: 0,
					enabled: e.reorderEnabled,
					t: e.t,
					onReorder: r[1] ||= (e) => t.$emit("reorder", e)
				}, null, 8, ["enabled", "t"])) : v("", !0),
				e.multiple ? (C(), O("button", {
					key: 1,
					type: "button",
					class: "resource-icon-button",
					disabled: !e.canInvert,
					title: e.t("COM_SMARTBROWSER_INVERT_SELECTION"),
					"aria-label": e.t("COM_SMARTBROWSER_INVERT_SELECTION"),
					onClick: r[2] ||= (e) => t.$emit("invert-selection")
				}, [...r[16] ||= [D("span", {
					class: "fas fa-retweet",
					"aria-hidden": "true"
				}, null, -1)]], 8, wn)) : v("", !0),
				D("button", {
					type: "button",
					class: a(["resource-icon-button", { active: d.value }]),
					title: e.t("COM_SMARTBROWSER_SEARCH"),
					onClick: r[3] ||= (e) => d.value = !d.value
				}, [...r[17] ||= [D("span", {
					class: "fas fa-search",
					"aria-hidden": "true"
				}, null, -1)]], 10, Tn),
				b("sort") ? (C(), O("button", {
					key: 2,
					type: "button",
					class: a(["resource-icon-button", { active: l.value }]),
					title: e.t("COM_SMARTBROWSER_SORT_BY"),
					onClick: r[4] ||= (e) => l.value = !l.value
				}, [...r[18] ||= [D("span", {
					class: "fas fa-sort-amount-down-alt",
					"aria-hidden": "true"
				}, null, -1)]], 10, En)) : v("", !0),
				b("zoom") ? (C(), O("button", {
					key: 3,
					type: "button",
					class: "resource-icon-button",
					disabled: e.gridSize === "sm",
					title: "Decrease size",
					onClick: r[5] ||= (e) => t.$emit("resize", -1)
				}, [...r[19] ||= [D("span", {
					class: "fas fa-search-minus",
					"aria-hidden": "true"
				}, null, -1)]], 8, Dn)) : v("", !0),
				b("zoom") ? (C(), O("button", {
					key: 4,
					type: "button",
					class: "resource-icon-button",
					disabled: e.gridSize === "xl",
					title: "Increase size",
					onClick: r[6] ||= (e) => t.$emit("resize", 1)
				}, [...r[20] ||= [D("span", {
					class: "fas fa-search-plus",
					"aria-hidden": "true"
				}, null, -1)]], 8, On)) : v("", !0),
				b("thumbnails") ? (C(), O("button", {
					key: 5,
					type: "button",
					class: a(["resource-icon-button", { active: e.detailsThumbnails }]),
					title: "Toggle thumbnails",
					onClick: r[7] ||= (e) => t.$emit("toggle-thumbnails")
				}, [...r[21] ||= [D("span", {
					class: "fas fa-images",
					"aria-hidden": "true"
				}, null, -1)]], 2)) : v("", !0),
				b("dateField") ? (C(), O("button", {
					key: 6,
					type: "button",
					class: "resource-icon-button resource-date-toggle",
					title: y.value,
					onClick: r[8] ||= (e) => t.$emit("toggle-date-field")
				}, [r[22] ||= D("span", {
					class: "fas fa-calendar",
					"aria-hidden": "true"
				}, null, -1), D("small", An, g(h.value), 1)], 8, kn)) : v("", !0),
				b("dateField") && e.columns?.length ? (C(), O("div", {
					key: 7,
					ref_key: "columnPicker",
					ref: p,
					class: "resource-column-picker"
				}, [D("button", {
					type: "button",
					class: "resource-icon-button",
					title: e.t("COM_SMARTBROWSER_COLUMNS"),
					"aria-label": e.t("COM_SMARTBROWSER_COLUMNS"),
					"aria-expanded": f.value,
					onClick: r[9] ||= (e) => f.value = !f.value
				}, [...r[23] ||= [D("span", {
					class: "fas fa-columns",
					"aria-hidden": "true"
				}, null, -1)]], 8, jn), f.value ? (C(), O("div", Mn, [D("div", Nn, g(e.t("COM_SMARTBROWSER_COLUMNS")), 1), (C(!0), O(x, null, c(e.columns, (n) => (C(), O("label", {
					key: n.id,
					class: "resource-column-choice"
				}, [D("input", {
					type: "checkbox",
					checked: n.defaultVisible ? !e.hiddenColumns?.includes(n.id) : e.shownColumns?.includes(n.id),
					disabled: n.id === "title" || n.id === "name",
					onChange: (e) => t.$emit("toggle-column", n.id)
				}, null, 40, Pn), D("span", null, g(e.t(n.label || (n.dateGroup ? "COM_SMARTBROWSER_DATE" : n.fields?.[0]?.label))), 1)]))), 128))])) : v("", !0)], 512)) : v("", !0),
				D("div", Fn, [(C(!0), O(x, null, c(e.views, (n) => (C(), O("button", {
					key: n.id,
					type: "button",
					class: a(["resource-icon-button", { active: e.activeView === n.id }]),
					title: e.t(n.label),
					onClick: (e) => t.$emit("view", n.id)
				}, [D("span", {
					class: a(n.icon),
					"aria-hidden": "true"
				}, null, 2)], 10, In))), 128))]),
				D("button", {
					type: "button",
					class: a(["resource-icon-button", { active: e.showInfo }]),
					title: e.t("COM_SMARTBROWSER_TOGGLE_INFO"),
					onClick: r[10] ||= (e) => t.$emit("info")
				}, [...r[24] ||= [D("span", {
					class: "fas fa-info",
					"aria-hidden": "true"
				}, null, -1)]], 10, Ln)
			])]),
			d.value ? (C(), O("div", Rn, [D("label", zn, g(e.t("COM_SMARTBROWSER_SEARCH")), 1), D("div", Bn, [D("input", {
				id: "smartbrowser-search",
				value: e.search,
				type: "search",
				class: "form-control",
				placeholder: e.t("COM_SMARTBROWSER_SEARCH"),
				onInput: r[11] ||= (e) => t.$emit("search", e.target.value),
				onKeydown: r[12] ||= T(S((e) => t.$emit("search", e.target.value), ["prevent"]), ["enter"])
			}, null, 40, Vn), D("button", {
				type: "button",
				class: "btn btn-primary",
				title: e.t("COM_SMARTBROWSER_SEARCH"),
				onClick: r[13] ||= (n) => t.$emit("search", e.search)
			}, [r[25] ||= D("span", {
				class: "fas fa-search",
				"aria-hidden": "true"
			}, null, -1), D("span", Un, g(e.t("COM_SMARTBROWSER_SEARCH")), 1)], 8, Hn)])])) : v("", !0),
			l.value && b("sort") ? (C(), O("div", Wn, [D("div", Gn, [D("label", null, [D("span", Kn, g(e.t("COM_SMARTBROWSER_SORT_BY")), 1), D("select", {
				value: e.sortBy,
				class: "form-select",
				onChange: r[14] ||= (e) => t.$emit("sort-by", e.target.value)
			}, [D("option", Jn, g(e.t("COM_SMARTBROWSER_DEFAULT_SORTING")), 1), (C(!0), O(x, null, c(s.value, (t) => (C(), O("option", {
				key: t.id,
				value: t.id
			}, g(e.t(t.label)), 9, Yn))), 128))], 40, qn)]), D("label", null, [D("span", Xn, g(e.t("COM_SMARTBROWSER_SORT_DIRECTION")), 1), D("select", {
				value: e.sortDirection || "asc",
				class: "form-select",
				disabled: !e.sortBy,
				onChange: r[15] ||= (e) => t.$emit("sort-direction-value", e.target.value)
			}, [D("option", Qn, g(e.t("COM_SMARTBROWSER_ASCENDING")), 1), D("option", $n, g(e.t("COM_SMARTBROWSER_DESCENDING")), 1)], 40, Zn)])])])) : v("", !0)
		]));
	}
}, tr = {
	__name: "ResourceNodeVisual",
	props: {
		resource: Object,
		open: Boolean
	},
	setup(e) {
		return (t, n) => (C(), ne(E, {
			resource: e.resource,
			variant: "compact",
			"allow-image": !1,
			open: e.open,
			"align-base-start": ""
		}, null, 8, ["resource", "open"]));
	}
}, nr = ["aria-label"], rr = ["open", "onToggle"], ir = ["onClick"], ar = {
	key: 0,
	class: "resource-adapter-roots"
}, or = ["onClick"], sr = {
	key: 1,
	class: "resource-tree-branch"
}, cr = ["onClick"], lr = ["onClick"], ur = {
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
		let r = e, i = t, o = (e, t) => {
			e.target.open && t !== r.activeAdapter && i("adapter", t);
		}, s = (e) => {
			e === r.activeAdapter ? r.roots[0] && i("open", r.roots[0].id) : i("adapter", e);
		}, l = (e) => r.breadcrumb.some((t) => t.id === e.id), u = (e) => r.breadcrumb.filter((t) => t.id !== e.id), d = _(() => r.roots.some((e) => e.visible !== !1 || l(e) && (u(e).length > 0 || r.nodes.length > 0))), p = (e, t) => ({ paddingInlineStart: `${10 + (e.visible === !1 ? 0 : 18) + t * 18}px` });
		return (t, r) => (C(), O("nav", {
			class: "resource-sidebar",
			"aria-label": e.t("COM_SMARTBROWSER_VIEW")
		}, [(C(!0), O(x, null, c(e.adapters, (r) => (C(), O("details", {
			key: r.id,
			class: "resource-adapter",
			open: r.id === e.activeAdapter,
			onToggle: (e) => o(e, r.id)
		}, [D("summary", { onClick: S((e) => s(r.id), ["prevent"]) }, [D("span", {
			class: a(r.icon),
			"aria-hidden": "true"
		}, null, 2), f(" " + g(r.title), 1)], 8, ir), r.id !== e.activeAdapter || d.value ? (C(), O("div", ar, [(C(!0), O(x, null, c(r.id === e.activeAdapter ? e.roots : [], (i) => (C(), O("section", {
			key: i.id,
			class: a(["resource-tree-root", { "root-hidden": i.visible === !1 }])
		}, [i.visible === !1 ? v("", !0) : (C(), O("button", {
			key: 0,
			type: "button",
			class: a({ active: e.selectedNode === i.id }),
			onClick: (e) => t.$emit("open", i.id)
		}, [D("span", {
			class: a(["resource-tree-root-icon", i.useResourceIcon ? i.icon : r.icon]),
			"aria-hidden": "true"
		}, null, 2), D("span", null, g(i.title), 1)], 10, or)), l(i) ? (C(), O("div", sr, [(C(!0), O(x, null, c(u(i), (r) => (C(), O("button", {
			key: r.id,
			type: "button",
			class: a({ active: e.selectedNode === r.id }),
			style: m(p(i, u(i).indexOf(r))),
			onClick: (e) => t.$emit("open", r.id)
		}, [n(tr, {
			resource: r,
			open: !0
		}, null, 8, ["resource"]), D("span", null, g(r.title), 1)], 14, cr))), 128)), (C(!0), O(x, null, c(e.nodes, (e) => (C(), O(x, { key: e.id }, [e.navigable === !1 ? (C(), O("div", {
			key: 1,
			class: "resource-tree-entry resource-tree-static",
			style: m(p(i, u(i).length))
		}, [n(tr, { resource: e }, null, 8, ["resource"]), D("span", null, g(e.title), 1)], 4)) : (C(), O("button", {
			key: 0,
			type: "button",
			class: "resource-tree-entry",
			style: m(p(i, u(i).length)),
			onClick: (n) => t.$emit("open", e.id)
		}, [n(tr, { resource: e }, null, 8, ["resource"]), D("span", null, g(e.title), 1)], 12, lr))], 64))), 128))])) : v("", !0)], 2))), 128))])) : v("", !0)], 40, rr))), 128))], 8, nr));
	}
}, dr = /* @__PURE__ */ new Set([
	"articles",
	"categories",
	"tags",
	"articles-by-tag",
	"menus",
	"users",
	"media"
]), fr = (e, t, n) => {
	let r = e.startsWith("flat-") ? new URL(n).searchParams.get("flatFromBrowseRoot") || "" : t || "";
	return `supjx.smartbrowser.ui.${e.replace(/^flat-/, "")}.${r}`;
}, pr = (e, t, n, r) => {
	let i = new URL(e);
	if (!dr.has(t)) return i.toString();
	i.searchParams.set("flatFromAdapter", t), i.searchParams.set("flatFromNode", n), r ? i.searchParams.set("flatFromBrowseRoot", r) : i.searchParams.delete("flatFromBrowseRoot");
	let a = `flat-${t}`;
	if (i.searchParams.set("adapter", a), i.searchParams.set("node", `${a}:root`), t === "articles" || t === "categories") {
		let e = n.startsWith("category:") ? n : r;
		e?.startsWith("category:") ? i.searchParams.set("browseRoot", e) : i.searchParams.delete("browseRoot"), i.searchParams.delete("flatScope");
	} else r ? i.searchParams.set("browseRoot", r) : i.searchParams.delete("browseRoot"), i.searchParams.set("flatScope", n);
	return i.toString();
}, mr = (e, t) => {
	let n = new URL(e), r = n.searchParams.get("flatFromAdapter"), i = dr.has(r) ? r : "articles", a = n.searchParams.get("flatFromBrowseRoot") || (r ? null : t), o = n.searchParams.get("flatFromNode") || a || "content:root";
	n.searchParams.set("adapter", i), n.searchParams.set("node", o), a ? n.searchParams.set("browseRoot", a) : n.searchParams.delete("browseRoot");
	for (let e of [
		"flatFromAdapter",
		"flatFromNode",
		"flatFromBrowseRoot",
		"flatScope"
	]) n.searchParams.delete(e);
	return n.toString();
}, hr = (e, t) => {
	let n = new URL(e);
	if (!n.searchParams.get("adapter")?.startsWith("flat-") || !t) return n.toString();
	let r = n.searchParams.get("adapter");
	if (n.searchParams.set("node", `${r}:root`), n.searchParams.set("flatFromNode", t), r === "flat-articles" || r === "flat-categories") {
		let e = n.searchParams.get("flatFromBrowseRoot") || (n.searchParams.has("flatFromAdapter") ? null : n.searchParams.get("browseRoot"));
		e ? n.searchParams.set("browseRoot", e) : n.searchParams.delete("browseRoot"), n.searchParams.delete("flatScope");
	} else n.searchParams.set("flatScope", t);
	return n.toString();
}, gr = {
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
}, _r = (e) => ({
	stateLabel: "status",
	width: "dimension",
	link: "url"
})[e.split(".").pop()] || e.split(".").pop();
function vr(e, t) {
	let n = e?.columns || [], r = n.map((e) => ({
		...e,
		defaultVisible: !0
	})), i = new Set(n.map((e) => e.id)), a = new Set(n.map((e) => e.source).filter(Boolean)), o = t.replace(/^flat-/, "") === "articles-by-tag" ? "articles" : t.replace(/^flat-/, ""), s = [...e?.infoFields || [], ...(gr[o] || []).map(([e, t, n]) => ({
		id: _r(e),
		label: t,
		source: `metadata.${e}`,
		format: n
	}))], c = i.has("dates");
	for (let e of s) {
		if (!e.source || !e.label || e.source === "metadata.locationPath") continue;
		let t = e.id || _r(e.source);
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
var yr = {
	key: 0,
	class: "resource-picker-titlebar"
}, br = ["title"], xr = {
	key: 1,
	class: "smartbrowser-busy",
	role: "status",
	"aria-live": "polite"
}, Sr = [
	"aria-pressed",
	"title",
	"aria-label"
], Cr = [
	"aria-pressed",
	"title",
	"aria-label"
], wr = {
	key: 2,
	class: "resource-picker-collection"
}, Tr = [
	"title",
	"aria-label",
	"aria-expanded"
], Er = { class: "resource-main" }, Dr = {
	key: 0,
	class: "resource-loader"
}, Or = {
	key: 1,
	class: "resource-empty"
}, kr = {
	key: 3,
	class: "resource-drop-overlay"
}, Ar = {
	__name: "SmartBrowserApp",
	setup(e) {
		let s = p("browser"), c = p("smartBrowserOptions"), l = c.application === "site" && window.self === window.top, y = t("normal"), b, x = _(() => ({
			normal: "COM_SMARTBROWSER_DISPLAY_WIDE",
			wide: "COM_SMARTBROWSER_DISPLAY_FOCUS",
			focus: "COM_SMARTBROWSER_DISPLAY_NORMAL"
		})[y.value]), w = () => {
			y.value = b.cycle();
		};
		ee(() => {
			l && (b = fe(document.getElementById("smartbrowser-app"), (e) => {
				y.value = e;
			}));
		}), u(() => b?.destroy());
		let T = p("actionDriver"), E = p("resourceApi"), te = p("viewRegistry"), { state: k, resources: N, bulkSelectableResources: de, selection: P, focusedResource: F, load: I, focus: B, toggle: V, selectAll: pe, invertSelection: me } = s, H = c.mode === "select" ? c.pickerContext || c.selectionHost : c.selectionHost || null, U = !!H?.collectionMode, W = (e) => Joomla.Text?._(e, e) || e, G = /* @__PURE__ */ new Map(), he = (e) => {
			let t = e?.selection?.adapter || e?.adapter;
			if (!t || t === c.adapter.replace(/^flat-/, "")) return T;
			if (!G.has(t)) {
				let e = new j({
					...c,
					adapter: t,
					browseRoot: null,
					flatScope: null
				});
				G.set(t, {
					api: e,
					driver: new z(e, k, async () => {
						await q?.refresh();
						for (let e of q?.browser.state.items || []) k.selectedResources[A(e)] = oe(e);
						await I();
					}, W, c.editorMode, c.application)
				});
			}
			return G.get(t).driver.selectionHost = Te, G.get(t).driver;
		}, ge = (e) => e?.collectionActions || k.actions, _e = (e, t) => ge(t).find((t) => t.id === e.id) || e, ve = (e, t) => {
			if (!U || e.currentNode || !t.length) return T.available(e, t);
			if (e.single && t.length !== 1) return !1;
			let n = (t) => (!t.collectionActions || t.collectionActions.some((t) => t.id === e.id)) && he(t).available(_e(e, t), [t]);
			return e.exclusiveGroup ? t.some(n) : t.every(n);
		}, K = async (e, t) => {
			if (!ve(e, t)) return;
			if (!U || e.currentNode || !t.length) return T.execute(e, t);
			let n = /* @__PURE__ */ new Map();
			for (let e of t) {
				let t = he(e);
				n.has(t) || n.set(t, []), n.get(t).push(e);
			}
			for (let [t, r] of n) await t.execute(_e(e, r[0]), r);
		};
		u(() => G.forEach(({ api: e, driver: t }) => {
			t.destroy(), e.destroy();
		}));
		let q, ye = !1, be = {
			referenceItems: !0,
			homogeneous: H?.homogeneous === !0,
			readOnly: !1,
			showCount: !1,
			selectedResources: !0,
			informationPanel: !1,
			multiple: c.multiple,
			items: H?.getCollectionSnapshot?.().items || [],
			layout: "compact",
			allowRemove: !0,
			allowOrdering: c.multiple && H?.allowOrdering !== !1,
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
				k.selectedResources[A(t)] = t, k.focusedId = A(t);
			}
		}, xe = /* @__PURE__ */ new Map();
		async function Se(e, t = {}) {
			let n = JSON.stringify([e.adapter, t.browseRoot || ""]);
			return xe.has(n) || xe.set(n, new j({
				...c,
				adapter: e.adapter,
				mode: "select",
				browseRoot: t.browseRoot || null,
				flatScope: null
			})), (await xe.get(n).collection([e.id])).resources[0];
		}
		let J = se({
			profile: H?.selectionProfile || {},
			initialUsage: H?.initialUsage || {},
			editors: H?.editors || {},
			resolveReference: Se
		}), Ce = () => k.selectedIds.flatMap((e) => {
			let t = P.value.find((t) => A(t) === e);
			if (t) return [{
				selection: re(t, c.adapter.replace(/^flat-/, "")),
				usage: J.get(t)
			}];
			let n = H?.getCollectionSnapshot?.().items.find((t) => ie(t.selection) === e);
			return n ? [n] : [];
		}), we = () => {
			U && H.commitCollection?.({
				items: Ce(),
				resources: Object.fromEntries(P.value.map((e) => [A(e), e])),
				virtualResources: k.virtualResources
			});
		}, Te = c.selectionState && (H || c.selectionHost) ? {
			editorContext: H?.selectionEditorContext || {},
			canAdd: (e, t) => s.canAddSelection(e, t),
			canCreate: (e) => s.canCreateSelectionResource(e),
			remove: (e) => {
				s.deleteVirtualResources(e), e.forEach((e) => J.forget(e)), Y.value++, we(), c.selectionHost?.onChange?.({ items: Ce() });
			},
			replace: (e, t) => {
				let n = t ? { ...J.get(t) } : {}, r = s.replaceSelectionResource(e, t);
				for (let e of J.definitions(r)) Object.prototype.hasOwnProperty.call(n, e.key) && J.set(r, e.key, n[e.key]);
				return Y.value++, we(), c.selectionHost?.onChange?.({ items: Ce() }), t && A(t) !== A(r) && J.forget(t), r;
			}
		} : null;
		T.selectionHost = Te, i(() => [k.selectedIds, k.selectedResources], we, {
			deep: !0,
			flush: "sync"
		}), u(we);
		let Y = t(0);
		U && (q = L({
			config: be,
			api: E,
			translate: W,
			notify: (e) => {
				ye = !0, k.selectedResources = Object.fromEntries(e.resources.map((e) => [A(e), oe(e)])), k.selectedIds = e.items.map((e) => ie(e.selection)), ye = !1;
			}
		}), q.refresh().catch((e) => Joomla.renderMessages({ error: [e.message] })), i(() => [k.selectedIds, Y.value], () => {
			ye || q.setItems(Ce()).catch((e) => Joomla.renderMessages({ error: [e.message] }));
		}, {
			deep: !0,
			flush: "sync"
		}), u(() => q.destroy()));
		let Ee = t(H?.isMaximized?.() || !1), De = _(() => {
			if (H?.title) return H.title;
			let e = c.adapters?.find((e) => e.id === c.adapter.replace(/^flat-/, ""));
			return `${W("COM_SMARTBROWSER_SELECT_RESOURCE")} \u2014 ${W(e?.title || "COM_SMARTBROWSER_RESOURCE")}`;
		}), Oe = t(0), ke = t({}), Ae = t(!1), je = _(() => J.definitions(F.value).filter((e) => e.presentation !== "hidden")), Ne = _(() => (Y.value, J.get(F.value))), Pe = _(() => !!(H && Object.keys(H.selectionProfile || {}).length)), Fe = !!(H && Object.keys(H.selectionProfile || {}).length), Ie = t(Object.values(H?.selectionProfile || {}).some((e) => e !== !1 && e?.presentation !== "hidden") || k.showInfo), X = _(() => Fe ? Ie.value : k.showInfo), Le = () => {
			Fe ? Ie.value = !Ie.value : k.showInfo = !k.showInfo;
		}, Re = (e, t, n) => {
			e && !We && (J.set(e, t, n), ke.value = {
				...ke.value,
				[A(e)]: {}
			}, Y.value++, we());
		}, ze = (e, t) => Re(F.value, e, t), Be = _(() => {
			let e = F.value;
			return {
				resource: e,
				profile: H?.selectionProfile || {},
				values: Ne.value,
				getValues: () => J.get(e),
				setValue: (t, n) => Re(e, t, n),
				refresh: () => I(),
				selectResource: (e) => window.SmartBrowserPicker.open(e)
			};
		}), Ve = t(H?.previewActions || []), He = H?.subscribePreviewActions?.((e) => {
			Ve.value = e;
		});
		u(() => He?.());
		let Ue = _(() => Ve.value.filter((e) => {
			try {
				return F.value && (!e.applies || e.applies(Be.value));
			} catch {
				return !1;
			}
		})), We = !1;
		u(() => {
			We = !0, xe.forEach((e) => e.destroy());
		});
		let Ge = te.all(), Ke = _(() => te.get(k.activeView)), qe = _(() => vr(k.presentation, c.adapter)), Je = _(() => qe.value.filter((e) => e.id === "title" || e.id === "name" || (e.defaultVisible ? !k.hiddenColumns.includes(e.id) : k.shownColumns.includes(e.id)))), Ye = (e) => {
			let t = qe.value.find((t) => t.id === e);
			if (!t || ["title", "name"].includes(e)) return;
			let n = t.defaultVisible ? "hiddenColumns" : "shownColumns";
			k[n] = k[n].includes(e) ? k[n].filter((t) => t !== e) : [...k[n], e];
		}, Xe = t(!1), Z = t(!1), Ze = t(null), Qe = _(() => c.adapter === "media"), $e = _(() => c.mode === "manage" && ["details", "grid"].includes(k.activeView) && k.presentation.orderingField && k.sortBy === k.presentation.orderingField && ["asc", "desc"].includes(k.sortDirection) && (c.adapter === "featured-articles" || String(k.filters.featured ?? "") !== "1")), et = _(() => $e.value && !k.busy && P.value.length > 0 && P.value.every((e) => e.capabilities?.reorder === !0)), tt = async (e) => {
			if (!et.value || !["up", "down"].includes(e)) return;
			let t = P.value.map((e) => e.id), n = k.focusedId;
			k.busy = !0;
			try {
				let r = k.sortDirection === "desc" ? e === "up" ? "down" : "up" : e;
				(await E.execute("reorder", t, { direction: r })).updated?.length && (await I(), k.selectedIds = t.filter((e) => N.value.some((t) => t.id === e)), k.focusedId = k.selectedIds.includes(n) ? n : k.selectedIds[0] || null);
			} catch (e) {
				Joomla.renderMessages({ error: [e.message] });
			} finally {
				k.busy = !1;
			}
		}, nt = c.adapter !== "featured-articles" && [
			"articles",
			"categories",
			"tags",
			"articles-by-tag",
			"menus",
			"users",
			"media"
		].includes(c.adapter.replace(/^flat-/, "")), Q = c.adapter.startsWith("flat-") || c.adapter === "featured-articles", rt = Object.fromEntries(Object.entries(c.gridWidths || {}).map(([e, t]) => [`--sb-grid-${e}`, `${t}px`])), it = fr(c.adapter, c.browseRoot, window.location.href), at = (() => {
			try {
				return JSON.parse(window.sessionStorage.getItem(it) || "{}");
			} catch {
				return {};
			}
		})(), ot = t(at.filtersOpen === !0), st = (e) => {
			at = {
				...at,
				filtersOpen: ot.value,
				...e
			}, window.sessionStorage.setItem(it, JSON.stringify(at));
		}, ct = () => {
			ot.value = !ot.value, st({ filtersOpen: ot.value });
		}, lt = () => {
			st({ flat: !Q }), window.location.assign(Q ? mr(window.location.href, c.browseRoot) : pr(window.location.href, c.adapter, k.selectedNode, c.browseRoot));
		}, ut = _(() => c.adapters?.find((e) => e.id === c.adapter)?.icon || "fas fa-list"), dt = _(() => c.adapters?.find((e) => e.id === c.adapter)?.nodeOpenIcon || {
			media: "fas fa-folder-open",
			articles: "fas fa-box-open",
			"flat-articles": "fas fa-box-open",
			categories: "fas fa-box-open",
			tags: "fas fa-tags",
			"articles-by-tag": "fas fa-tags",
			users: "fas fa-users-viewfinder",
			menus: "fas fa-diagram-successor",
			"featured-articles": "fas fa-star"
		}[c.adapter] || "fas fa-folder-open"), ft = [
			"sm",
			"md",
			"lg",
			"xl"
		], pt = async ({ selection: e, payload: t, resolve: n, reject: r }) => {
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
		}, mt = async (e) => {
			if (Ae.value || !e.length) return;
			Ae.value = !0;
			let t = Y.value, n;
			try {
				n = await J.validate(e);
			} finally {
				Ae.value = !1;
			}
			if (We || t !== Y.value) return;
			if (ke.value = n.errors, !n.valid) {
				Object.keys(n.profileErrors).length && Joomla.renderMessages({ error: [W("COM_SMARTBROWSER_USAGE_PROFILE_INVALID")] });
				let e = Object.keys(n.errors).find((e) => Object.keys(n.errors[e]).some((t) => !n.profileErrors[e]?.[t]));
				e && (k.focusedId = e, Oe.value++, X.value || Joomla.renderMessages({ error: [W("COM_SMARTBROWSER_USAGE_INVALID")] }));
				return;
			}
			let r = {
				adapter: c.adapter.replace(/^flat-/, ""),
				mode: c.mode,
				resources: [...e]
			};
			U && (r.collectionItems = e.map((e) => ({
				selection: re(e, c.adapter.replace(/^flat-/, "")),
				usage: n.usage[A(e)] || {}
			}))), H && (r.pickerInstance = c.pickerInstance, r.usage = n.usage), document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r })), window.parent !== window && window.parent.document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: r }));
		}, ht = (e) => {
			let t = ft.indexOf(k.viewOptions.gridSize);
			k.viewOptions.gridSize = ft[Math.max(0, Math.min(ft.length - 1, t + e))];
		}, gt = (e) => ae(e, c.mode, ge(e), ve, c.selectionTarget || "both"), _t = (e) => R(e, c.mode, ge(e), ve), vt = (e) => le(e, c.mode, ge(e), ve, c.selectionTarget || "both"), yt = (e, t) => !k.busy && (e.local ? t.every((t) => gt(t)?.id === e.id || vt(t)?.id === e.id) : ve(e, t)), bt = (e) => {
			let t = gt(e);
			t && xt(t, e);
		}, xt = (e, t) => {
			if (e && t && yt(e, [t])) return e.id === "browseOpen" ? I(t.id) : e.id === "pickerSelect" ? U ? (k.selectedIds.includes(A(t)) || V(t, !0), mt(P.value)) : mt([t]) : K(e, [t]);
		}, St = (e) => {
			if (H?.allowedAdapters?.length && !H.allowedAdapters.includes(e.replace(/^flat-/, "")) || e === c.adapter) return;
			we();
			let t = new URL(window.location.href);
			t.searchParams.set("adapter", e), t.searchParams.delete("node"), t.searchParams.delete("browseRoot"), H?.initialBrowseRoot && e.replace(/^flat-/, "") === H.initialAdapter.replace(/^flat-/, "") && t.searchParams.set("browseRoot", H.initialBrowseRoot), t.searchParams.delete("initialResource"), t.searchParams.delete("flatScope"), window.location.href = t.toString();
		}, Ct = async ({ id: e, value: t }) => {
			if (k.filters[e] = t, e === "menu" && t && !c.browseRoot && c.adapter === "menus") {
				await I(`menu:${t}`);
				return;
			}
			if (e === "menu" && t && !c.browseRoot && c.adapter === "flat-menus") {
				let e = new URL(window.location.href);
				e.searchParams.set("flatScope", `menu:${t}`), e.searchParams.set("flatFromNode", `menu:${t}`), window.location.assign(e.toString());
				return;
			}
			await I(k.selectedNode);
		}, wt = async () => {
			(k.presentation.filters || []).forEach((e) => {
				k.filters[e.id] = e.default ?? "";
			}), await I(k.selectedNode);
		}, Tt = async (e) => {
			if (Q && e === k.selectedNode && e === k.roots[0]?.id) {
				k.search = "", k.sortBy = c.defaultSortBy || "", k.sortDirection = c.defaultSortDirection || "";
				let e = hr(window.location.href, c.flatRootNode);
				if (e !== window.location.href) {
					(k.presentation.filters || []).forEach((e) => {
						k.filters[e.id] = e.default ?? "";
					}), await r(), window.location.assign(e);
					return;
				}
				await wt();
				return;
			}
			await I(e);
		}, Et = (e) => {
			k.sortBy === e ? k.sortDirection === "asc" ? k.sortDirection = "desc" : (k.sortBy = "", k.sortDirection = "") : (k.sortBy = e, k.sortDirection = "asc");
		}, Dt = (e) => {
			k.sortBy = e, k.sortDirection = e ? k.sortDirection || "asc" : "";
		}, Ot = () => {
			let e = [
				"modified",
				"created",
				"both"
			], t = e.indexOf(k.viewOptions.detailsDateMode);
			k.viewOptions.detailsDateMode = e[(t + 1) % e.length];
		}, kt = async (e) => {
			Xe.value = !1, Qe.value && await T.uploadFiles(e.dataTransfer?.files);
		};
		return ee(() => {
			if (Q && st({ flat: !0 }), !Q && nt && at.flat === !0) {
				window.location.replace(pr(window.location.href, c.adapter, k.selectedNode, c.browseRoot));
				return;
			}
			I(k.selectedNode).then(async () => {
				if (U) {
					let e = H.getCollectionSnapshot();
					try {
						let t = await E.collection(e.items, {
							referenceItems: !0,
							homogeneous: H.homogeneous
						});
						if (We) return;
						k.selectedResources = Object.fromEntries(t.resources.map((e) => [A(e), oe(e)])), k.selectedIds = t.items.map((e) => ie(e.selection)), k.focusedId = k.selectedIds.find((e) => N.value.some((t) => A(t) === e)) || k.selectedIds[0] || null;
					} catch (e) {
						We || Joomla.renderMessages({ error: [e.message] });
					}
				}
				if (!U && H?.initialSelection?.length && (!H.initialAdapter || H.initialAdapter.replace(/^flat-/, "") === c.adapter.replace(/^flat-/, ""))) {
					let e = H.initialSelection.map((e) => e && typeof e == "object" ? e.id : e);
					try {
						let t = await E.collection(c.multiple ? e : e.slice(0, 1));
						if (We) return;
						let n = new Set(c.allowedResourceTypes || []), r = t.resources.filter((e) => !e.unavailable && M(e, c.selectionTarget) && (!n.size || n.has(e.type)));
						k.selectedIds = r.map((e) => e.id), k.selectedResources = Object.fromEntries(r.map((e) => [e.id, e])), k.focusedId = k.selectedIds[0] || null;
					} catch (e) {
						We || Joomla.renderMessages({ error: [e.message] });
					}
				}
				c.adapter === "media" && c.initialResource && N.value.some((e) => e.id === c.initialResource) && (k.focusedId = A(N.value.find((e) => e.id === c.initialResource)));
			});
		}), (e, t) => (C(), O("div", {
			class: "smartbrowser-shell",
			style: m(h(rt))
		}, [
			h(H) ? (C(), O("div", yr, [D("strong", null, g(De.value), 1), h(H).subtitle ? (C(), O("span", {
				key: 0,
				title: h(H).subtitle
			}, g(h(H).subtitle), 9, br)) : v("", !0)])) : v("", !0),
			h(k).busy ? (C(), O("div", xr, [t[15] ||= D("span", {
				class: "spinner-border",
				"aria-hidden": "true"
			}, null, -1), D("span", null, g(W("COM_SMARTBROWSER_WORKING")), 1)])) : v("", !0),
			n(Me, {
				actions: h(k).actions,
				available: (e) => ve(e, h(P)),
				selection: h(P),
				"batch-available": h(c).mode === "manage",
				"can-cancel": typeof h(H)?.cancel == "function",
				"flat-available": h(nt),
				"flat-active": h(Q),
				"filters-open": ot.value,
				filters: h(k).presentation.filters,
				"filter-values": h(k).filters,
				"manager-url": h(c).managerUrl,
				"manager-new-tab": h(c).application === "site",
				"dashboard-url": h(c).dashboardUrl,
				integrated: h(c).integrated,
				"selection-mode": h(c).mode === "select",
				"allow-no-user": h(c).allowNoUser,
				"can-complete": h(P).length > 0 && !Ae.value,
				"confirm-label": h(H)?.confirmLabel,
				t: W,
				onAction: t[1] ||= (e) => K(e, h(P)),
				onBatch: t[2] ||= (e) => Ze.value?.open(),
				onCancel: t[3] ||= (e) => h(H)?.cancel(),
				onToggleFlat: lt,
				onToggleFilters: ct,
				onFilter: Ct,
				onClearFilters: wt,
				onComplete: t[4] ||= (e) => mt(h(P)),
				onNoUser: t[5] ||= (e) => mt([{
					id: "user:0",
					type: "user",
					title: ""
				}])
			}, {
				"display-controls": o(() => [h(H)?.toggleSize ? (C(), O("button", {
					key: 0,
					type: "button",
					class: a(["resource-icon-button resource-display-toggle", { active: Ee.value }]),
					"aria-pressed": Ee.value,
					title: W(Ee.value ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE"),
					"aria-label": W(Ee.value ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE"),
					onClick: t[0] ||= (e) => Ee.value = h(H).toggleSize()
				}, [D("span", {
					class: a(Ee.value ? "fas fa-compress" : "fas fa-expand"),
					"aria-hidden": "true"
				}, null, 2)], 10, Sr)) : v("", !0), h(l) ? (C(), O("button", {
					key: 1,
					type: "button",
					class: a(["resource-icon-button resource-display-toggle", { active: y.value !== "normal" }]),
					"aria-pressed": y.value !== "normal",
					title: W(x.value),
					"aria-label": W(x.value),
					onClick: w
				}, [D("span", {
					class: a(y.value === "normal" ? "fas fa-arrows-alt-h" : y.value === "wide" ? "fas fa-expand" : "fas fa-compress"),
					"aria-hidden": "true"
				}, null, 2)], 10, Cr)) : v("", !0)]),
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
			h(U) ? (C(), O("details", wr, [D("summary", null, [
				t[16] ||= D("span", {
					class: "fas fa-chevron-right resource-picker-collection-chevron",
					"aria-hidden": "true"
				}, null, -1),
				f(g(W("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": ", 1),
				D("span", null, g(h(k).selectedIds.length), 1)
			]), h(q) ? (C(), ne(ce, {
				key: 0,
				model: h(q),
				api: h(E),
				config: be,
				t: W
			}, null, 8, ["model", "api"])) : v("", !0)])) : v("", !0),
			n(gn, {
				ref_key: "batchDialog",
				ref: Ze,
				selection: h(P),
				adapter: h(c).adapter,
				filters: h(k).presentation.filters,
				"batch-options": h(k).presentation.batchOptions,
				"sort-fields": h(k).presentation.sortFields,
				"ordering-available": $e.value,
				t: W,
				onApply: pt
			}, null, 8, [
				"selection",
				"adapter",
				"filters",
				"batch-options",
				"sort-fields",
				"ordering-available"
			]),
			D("div", { class: a(["smartbrowser-layout", {
				"flat-mode": h(Q) && !h(U),
				"tree-collapsed": Z.value
			}]) }, [
				(!h(Q) || h(U)) && !Z.value ? (C(), ne(ur, {
					key: 0,
					adapters: h(H)?.allowedAdapters?.length ? (h(c).adapters || []).filter((e) => h(H).allowedAdapters.includes(e.id.replace(/^flat-/, ""))) : h(c).adapters,
					"active-adapter": h(c).adapter,
					roots: h(k).roots,
					nodes: h(Q) ? [] : h(k).nodes,
					breadcrumb: h(k).breadcrumb,
					"selected-node": h(k).selectedNode,
					t: W,
					onOpen: h(I),
					onAdapter: St
				}, null, 8, [
					"adapters",
					"active-adapter",
					"roots",
					"nodes",
					"breadcrumb",
					"selected-node",
					"onOpen"
				])) : v("", !0),
				!h(Q) || h(U) ? (C(), O("button", {
					key: 1,
					type: "button",
					class: "resource-sidebar-handle",
					title: W(Z.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-label": W(Z.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-expanded": !Z.value,
					onClick: t[6] ||= (e) => Z.value = !Z.value
				}, [D("span", {
					class: a(Z.value ? "fas fa-chevron-right" : "fas fa-chevron-left"),
					"aria-hidden": "true"
				}, null, 2)], 8, Tr)) : v("", !0),
				D("main", Er, [n(er, {
					breadcrumb: h(k).breadcrumb,
					root: h(k).roots[0],
					"root-icon": dt.value,
					"icon-only-root": !h(Q) && h(k).breadcrumb.length > 1,
					search: h(k).search,
					"sort-by": h(k).sortBy,
					"sort-direction": h(k).sortDirection,
					"sort-fields": h(k).presentation.sortFields,
					"ordering-field": h(k).presentation.orderingField,
					views: h(Ge),
					"active-view": h(k).activeView,
					"grid-size": h(k).viewOptions.gridSize,
					"details-thumbnails": h(k).viewOptions.detailsThumbnails,
					"details-date-mode": h(k).viewOptions.detailsDateMode,
					columns: qe.value,
					"hidden-columns": h(k).hiddenColumns,
					"shown-columns": h(k).shownColumns,
					"show-info": X.value,
					multiple: h(c).multiple,
					"can-invert": h(c).multiple && h(de).length > 0,
					"reorder-visible": $e.value,
					"reorder-enabled": et.value,
					t: W,
					onOpen: Tt,
					onInvertSelection: h(me),
					onReorder: tt,
					onSearch: t[7] ||= (e) => h(k).search = e,
					onSortBy: Dt,
					onSortDirectionValue: t[8] ||= (e) => h(k).sortDirection = e,
					onResize: ht,
					onToggleThumbnails: t[9] ||= (e) => h(k).viewOptions.detailsThumbnails = !h(k).viewOptions.detailsThumbnails,
					onToggleDateField: Ot,
					onToggleColumn: Ye,
					onView: t[10] ||= (e) => h(k).activeView = e,
					onInfo: Le
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
				]), D("div", {
					class: a(["resource-browser", {
						loading: h(k).loading,
						"is-dragging": Xe.value,
						"info-open": X.value,
						"usage-open": Pe.value
					}]),
					onDragenter: t[12] ||= S((e) => Xe.value = Qe.value, ["prevent"]),
					onDragover: t[13] ||= S(() => {}, ["prevent"]),
					onDragleave: t[14] ||= S((e) => Xe.value = !1, ["self"]),
					onDrop: S(kt, ["prevent"])
				}, [
					h(k).loading ? (C(), O("div", Dr, [...t[17] ||= [D("span", {
						class: "spinner-border",
						"aria-hidden": "true"
					}, null, -1)]])) : h(N).length ? (C(), ne(d(Ke.value.component), {
						key: 2,
						resources: h(N),
						"selected-ids": h(k).selectedIds,
						"focused-id": h(k).focusedId,
						"all-selected": h(de).length > 0 && h(de).every((e) => h(k).selectedIds.includes(h(A)(e))),
						options: h(k).viewOptions,
						"selection-controls": !h(H) || h(c).multiple !== !1,
						actions: h(k).actions,
						"action-available": yt,
						"default-action": gt,
						"preview-action": _t,
						"modified-action": vt,
						"sort-by": h(k).sortBy,
						"sort-direction": h(k).sortDirection,
						"sort-fields": h(k).presentation.sortFields,
						"ordering-field": h(k).presentation.orderingField,
						columns: Je.value,
						"grid-fields": h(k).presentation.gridFields,
						t: W,
						onSelect: h(V),
						onFocus: h(B),
						onSelectAll: h(pe),
						onOpen: h(I),
						onActivate: bt,
						onAction: xt,
						onSort: Et
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
					])) : (C(), O("div", Or, [D("span", {
						class: a(h(k).search ? "fas fa-search" : Qe.value ? "fas fa-cloud-upload-alt" : ut.value),
						"aria-hidden": "true"
					}, null, 2), D("p", null, g(h(k).search ? W("COM_SMARTBROWSER_NO_RESULTS") : Qe.value ? W("COM_SMARTBROWSER_DROP_UPLOAD") : W("COM_SMARTBROWSER_EMPTY_STATE")), 1)])),
					Qe.value && Xe.value ? (C(), O("div", kr, [t[18] ||= D("span", { class: "fas fa-cloud-upload-alt" }, null, -1), f(g(W("COM_SMARTBROWSER_DROP_UPLOAD")), 1)])) : v("", !0),
					X.value ? (C(), ne(ue, {
						key: 4,
						resource: h(F),
						fields: h(F)?.collectionPresentation?.infoFields || h(k).presentation.infoFields,
						t: W,
						"usage-definitions": je.value,
						"usage-values": Ne.value,
						"usage-errors": ke.value[h(A)(h(F))] || {},
						"usage-editors": h(H)?.editors,
						"resolve-reference": Se,
						"usage-revision": Oe.value,
						"preview-actions": Ue.value,
						"preview-context": Be.value,
						"can-preview": !!_t(h(F)) && he(h(F)).canPreview(h(F)) && !h(k).busy,
						onPreview: t[11] ||= (e) => xt(_t(h(F)), h(F)),
						onUsageChange: ze
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
					])) : v("", !0)
				], 34)])
			], 2)
		], 4));
	}
}, jr = class {
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
}, Mr = "supjx.smartbrowser.preferencesResetToken";
function Nr(e, t) {
	if (!t || e.getItem(Mr) === t) return !1;
	let n = [];
	for (let t = 0; t < e.length; t++) {
		let r = e.key(t);
		r?.startsWith("supjx.smartbrowser.") && r !== Mr && r !== "supjx.smartbrowser.editorReturn" && n.push(r);
	}
	return n.forEach((t) => e.removeItem(t)), e.setItem(Mr, t), !0;
}
//#endregion
//#region resources/js/core/resetSessionNavigation.js
var Pr = "supjx.smartbrowser.";
function Fr(e, t, n) {
	if (!n) return !1;
	let r = `${Pr}session.${t}`, i = e.getItem(r);
	if (e.setItem(r, n), !i || i === n) return !1;
	for (let t = 0; t < e.length; t++) {
		let n = e.key(t);
		if (!(!n?.startsWith(Pr) || n.startsWith(`${Pr}ui.`) || n.startsWith(`${Pr}session.`))) try {
			let t = JSON.parse(e.getItem(n));
			if (!t || typeof t != "object" || Array.isArray(t) || !("selectedNode" in t) && !("filters" in t)) continue;
			delete t.selectedNode, delete t.filters, e.setItem(n, JSON.stringify(t));
		} catch {}
	}
	return !0;
}
function Ir(e) {
	let t = new URL(e);
	if (t.searchParams.delete("node"), t.searchParams.has("flatFromAdapter")) {
		let e = t.searchParams.get("flatFromBrowseRoot");
		e ? t.searchParams.set("browseRoot", e) : t.searchParams.delete("browseRoot"), t.searchParams.delete("flatScope"), t.searchParams.delete("flatFromNode"), t.searchParams.delete("flatFromBrowseRoot"), t.searchParams.delete("flatFromAdapter");
	}
	return t.toString();
}
//#endregion
//#region resources/js/main.js
var $ = Joomla.getOptions("com_smartbrowser", {}), Lr = null;
try {
	Lr = window.parent !== window && $.pickerInstance ? window.parent.SmartBrowserPicker?.context($.pickerInstance, window) : null;
} catch {}
$.pickerContext = Lr, Nr(window.sessionStorage, $.preferencesResetToken);
var Rr = Fr(window.sessionStorage, $.application, $.csrfToken) ? Ir(window.location.href) : window.location.href;
if (Rr !== window.location.href) window.location.replace(Rr);
else {
	let e = new j($), t = $.browseRoot ? `supjx.smartbrowser.${$.adapter}.${$.browseRoot}` : `supjx.smartbrowser.${$.adapter}`, n = new jr(window.sessionStorage, t), r = N().register({
		id: "grid",
		label: "COM_SMARTBROWSER_GRID",
		icon: "fas fa-th",
		component: I,
		supportsSize: !0,
		controls: ["sort", "zoom"],
		options: { gridSize: "md" }
	}).register({
		id: "details",
		label: "COM_SMARTBROWSER_DETAILS",
		icon: "fas fa-list",
		component: de,
		supportsSize: !1,
		controls: ["thumbnails", "dateField"],
		options: {
			detailsThumbnails: !1,
			detailsDateMode: "modified"
		}
	}), i = F({
		options: $,
		api: e,
		persistence: n,
		viewRegistry: r
	}), a = new z(e, i.state, () => i.load(), (e) => Joomla.Text?._(e, e) || e, $.editorMode, $.application);
	window.SmartBrowser = {
		...window.SmartBrowser,
		open(e = {}) {
			let t = e.showContextResources ?? $.showContextResources ?? !1, n = e.browseRoot ? `&browseRoot=${encodeURIComponent(e.browseRoot)}` : "", r = e.defaultView ? `&defaultView=${encodeURIComponent(e.defaultView)}` : "", i = e.allowedResourceTypes?.length ? `&allowedResourceTypes=${encodeURIComponent(e.allowedResourceTypes.join(","))}` : "", a = e.showAdapterSwitcher ? "&showAdapterSwitcher=1" : "";
			window.location.href = `${$.returnUrl}&adapter=${encodeURIComponent(e.adapter || $.adapter)}&mode=${encodeURIComponent(e.mode || "select")}&multiple=${+!!e.multiple}&selectionTarget=${encodeURIComponent(e.selectionTarget || "item")}&showContextResources=${+!!t}${n}${r}${i}${a}`;
		},
		registerView: (e) => r.register(e)
	}, w(Ar).provide("browser", i).provide("resourceApi", e).provide("smartBrowserOptions", $).provide("viewRegistry", r).provide("actionDriver", a).mount("#smartbrowser-app");
}
//#endregion
