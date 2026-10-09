import { B as e, C as t, F as n, H as r, I as i, L as a, M as o, P as s, S as c, V as l, W as u, _ as d, a as f, b as p, c as m, g as h, i as g, j as _, l as v, n as y, o as b, r as x, s as S, t as C, u as w, v as T, w as E, x as D, y as O, z as k } from "./visual-runtime-DVMDRhTu.js";
//#region resources/js/components/VisualProfileSettings.vue
var A = { class: "sb-appearance-controls" }, j = { class: "sb-appearance-layer-buttons" }, M = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], ee = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], te = [
	"aria-label",
	"value",
	"onChange"
], ne = ["value"], N = [
	"title",
	"aria-label",
	"value",
	"onChange"
], P = [
	"aria-label",
	"value",
	"onChange"
], F = ["value"], I = [
	"aria-label",
	"value",
	"onChange"
], L = ["value"], R = [
	"aria-label",
	"value",
	"onChange"
], z = ["value"], B = [
	"aria-label",
	"value",
	"onChange"
], V = { value: "item" }, H = ["value"], U = [
	"title",
	"aria-label",
	"onClick"
], W = { class: "sb-rule-commands" }, G = ["title", "aria-label"], K = ["title", "aria-label"], q = {
	__name: "VisualProfileSettings",
	props: {
		adapter: String,
		kind: String,
		value: Object,
		labels: Object,
		globalSettings: Object,
		available: Object
	},
	emits: ["change"],
	setup(t, { emit: i }) {
		let a = t, s = i, c = e(a.value?.custom === !0 || a.value?.custom === 1), v = e(f(a.value)), y = d(() => a.adapter && !c.value ? f(a.globalSettings) : v.value), C = d(() => y.value.map((e, t) => ({
			rule: e,
			index: t
		})).filter(({ rule: e }) => a.kind !== "items" || e.asset !== "identity")), w = d(() => a.kind === "items" ? ["base", "image"] : [
			"base",
			"identity",
			"image"
		]), E = d(() => b(C.value.map((e) => e.rule))), O = d(() => new Set(g(y.value, a.available || {}).map((e) => e.ruleIndex))), k = (e) => {
			c.value = !!a.adapter, v.value = x(e);
		}, q = (e, t, n) => k(y.value.map((r, i) => i === e ? {
			...r,
			[t]: n
		} : r)), J = (e, t) => {
			let n = C.value.findIndex((t) => t.index === e), r = C.value[n + t]?.index;
			if (r === void 0) return;
			let i = [...y.value];
			[i[e], i[r]] = [i[r], i[e]], k(i);
		}, Y = (e) => k(y.value.filter((t, n) => n !== e)), X = () => k([...y.value, {
			asset: "base",
			style: "center",
			size: "medium",
			position: "top-left",
			anchor: "item",
			priority: Math.max(0, ...y.value.map((e) => e.priority || 0)) + 1
		}]), Z = () => {
			c.value = !1;
		};
		return n([v, c], () => s("change", a.adapter && !c.value ? { custom: !1 } : {
			rules: v.value,
			...a.adapter ? { custom: !0 } : {}
		}), {
			deep: !0,
			immediate: !0
		}), (e, n) => (_(), D("div", A, [(_(!0), D(h, null, o(C.value, ({ rule: e, index: i }, a) => (_(), D("div", {
			key: i,
			class: r(["sb-appearance-row sb-appearance-rule", { "is-active": O.value.has(i) }])
		}, [
			T("span", j, [T("button", {
				type: "button",
				disabled: a === C.value.length - 1,
				title: t.labels.down,
				"aria-label": t.labels.down,
				onClick: (e) => J(i, 1)
			}, [...n[0] ||= [T("span", { class: "fas fa-chevron-down" }, null, -1)]], 8, M), T("button", {
				type: "button",
				disabled: a === 0,
				title: t.labels.up,
				"aria-label": t.labels.up,
				onClick: (e) => J(i, -1)
			}, [...n[1] ||= [T("span", { class: "fas fa-chevron-up" }, null, -1)]], 8, ee)]),
			T("select", {
				"aria-label": t.labels.asset,
				value: e.asset,
				onChange: (e) => q(i, "asset", e.target.value)
			}, [(_(!0), D(h, null, o(w.value, (e) => (_(), D("option", {
				key: e,
				value: e
			}, u(t.labels[e]), 9, ne))), 128))], 40, te),
			T("input", {
				class: "sb-rule-z",
				type: "number",
				min: "1",
				step: "1",
				title: t.labels.z_index,
				"aria-label": t.labels.z_index,
				value: e.priority,
				onChange: (e) => q(i, "priority", Math.max(1, Number(e.target.value) || 1))
			}, null, 40, N),
			T("select", {
				"aria-label": t.labels.position,
				value: e.style,
				onChange: (e) => q(i, "style", e.target.value)
			}, [(_(), D(h, null, o([
				"center",
				"corner",
				"badge"
			], (e) => T("option", {
				key: e,
				value: e
			}, u(t.labels[e]), 9, F)), 64))], 40, P),
			e.style === "center" ? p("", !0) : (_(), D("select", {
				key: 0,
				"aria-label": t.labels.position,
				value: e.position,
				onChange: (e) => q(i, "position", e.target.value)
			}, [(_(!0), D(h, null, o(l(S), (e) => (_(), D("option", {
				key: e,
				value: e
			}, u(t.labels[e.replaceAll("-", "_")]), 9, L))), 128))], 40, I)),
			T("select", {
				"aria-label": t.labels.size,
				value: e.size,
				onChange: (e) => q(i, "size", e.target.value)
			}, [(_(!0), D(h, null, o(l(m), (e) => (_(), D("option", {
				key: e,
				value: e
			}, u(t.labels[e]), 9, z))), 128))], 40, R),
			e.style === "badge" ? (_(), D("select", {
				key: 1,
				"aria-label": t.labels.anchor,
				value: E.value.includes(e.anchor) ? e.anchor : "item",
				onChange: (e) => q(i, "anchor", e.target.value)
			}, [T("option", V, u(t.labels.item), 1), (_(!0), D(h, null, o(E.value, (e) => (_(), D("option", {
				key: e,
				value: e
			}, u(e === "center" ? t.labels.center : `${t.labels.corner}: ${t.labels[e.slice(7).replaceAll("-", "_")]}`), 9, H))), 128))], 40, B)) : p("", !0),
			T("button", {
				class: "sb-rule-command",
				type: "button",
				title: t.labels.remove,
				"aria-label": t.labels.remove,
				onClick: (e) => Y(i)
			}, [...n[2] ||= [T("span", { class: "fas fa-trash-alt" }, null, -1)]], 8, U)
		], 2))), 128)), T("div", W, [T("button", {
			class: "sb-rule-command",
			type: "button",
			title: t.labels.add,
			"aria-label": t.labels.add,
			onClick: X
		}, [...n[3] ||= [T("span", { class: "fas fa-plus" }, null, -1)]], 8, G), t.adapter && c.value ? (_(), D("button", {
			key: 0,
			class: "sb-rule-command",
			type: "button",
			title: t.labels.inherited,
			"aria-label": t.labels.inherited,
			onClick: Z
		}, [...n[4] ||= [T("span", { class: "fas fa-undo" }, null, -1)]], 8, K)) : p("", !0)])]));
	}
}, J = { class: "sb-appearance-editor" }, Y = { key: 0 }, X = { class: "sb-appearance-profile" }, Z = { class: "sb-appearance-previews" }, re = { class: "sb-preview-body" }, Q = { class: "sb-appearance-preview-tile" }, ie = { class: "sb-preview-assets" }, ae = ["onUpdate:modelValue"], oe = { class: "sb-appearance-profile" }, se = {
	__name: "VisualSettings",
	props: {
		adapter: String,
		value: Object,
		labels: Object,
		globalSettings: Object,
		sampleImage: String,
		background: {
			type: String,
			default: "auto"
		}
	},
	emits: ["change"],
	setup(n, { emit: r }) {
		let l = n, d = r, m = e({
			nodes: l.value?.nodes || l.value || {},
			items: l.value?.items || l.value || {}
		}), g = k({
			nodes: {
				base: !0,
				identity: !0,
				image: !0
			},
			items: {
				base: !0,
				identity: !1,
				image: !0
			}
		}), v = (e) => ({ rules: f(l.adapter && !m.value[e]?.custom ? l.globalSettings?.[e] : m.value[e]) }), y = (e) => ({
			kind: e === "nodes" ? "node" : "item",
			type: e === "nodes" ? "category" : "article",
			icon: e === "nodes" ? "fas fa-folder" : "fas fa-file-alt",
			badgeIcon: e === "nodes" ? "fas fa-book" : "",
			image: l.sampleImage
		}), b = (e, t) => {
			m.value[e] = t, d("change", { ...m.value });
		};
		return (e, r) => (_(), D("div", J, [(_(), O(s(n.adapter ? "details" : "div"), { class: "sb-appearance-overrides" }, {
			default: i(() => [
				n.adapter ? (_(), D("summary", Y, u(n.labels.adapter_title), 1)) : p("", !0),
				T("section", X, [T("h4", null, u(n.labels.nodes), 1), t(q, {
					adapter: n.adapter,
					kind: "nodes",
					labels: n.labels,
					value: n.value?.nodes || n.value || {},
					"global-settings": n.globalSettings?.nodes,
					available: g.nodes,
					onChange: r[0] ||= (e) => b("nodes", e)
				}, null, 8, [
					"adapter",
					"labels",
					"value",
					"global-settings",
					"available"
				])]),
				T("div", Z, [(_(), D(h, null, o(["nodes", "items"], (e) => T("figure", {
					key: e,
					class: "sb-appearance-preview"
				}, [T("figcaption", null, u(n.labels.preview) + ": " + u(n.labels[e]), 1), T("div", re, [T("span", Q, [t(C, {
					resource: y(e),
					settings: v(e),
					"available-assets": g[e],
					background: n.background
				}, null, 8, [
					"resource",
					"settings",
					"available-assets",
					"background"
				])]), T("div", ie, [(_(!0), D(h, null, o(e === "nodes" ? [
					"base",
					"identity",
					"image"
				] : ["base", "image"], (t) => (_(), D("label", { key: t }, [a(T("input", {
					"onUpdate:modelValue": (n) => g[e][t] = n,
					type: "checkbox"
				}, null, 8, ae), [[w, g[e][t]]]), c(u(n.labels[t]), 1)]))), 128))])])])), 64))]),
				T("section", oe, [T("h4", null, u(n.labels.items), 1), t(q, {
					adapter: n.adapter,
					kind: "items",
					labels: n.labels,
					value: n.value?.items || n.value || {},
					"global-settings": n.globalSettings?.items,
					available: g.items,
					onChange: r[1] ||= (e) => b("items", e)
				}, null, 8, [
					"adapter",
					"labels",
					"value",
					"global-settings",
					"available"
				])])
			]),
			_: 1
		}))]));
	}
}, $ = () => {
	let e = [...document.querySelectorAll("[data-sb-visual-settings]")], t = e.find((e) => !JSON.parse(e.dataset.sbVisualSettings).adapter);
	if (!t) return;
	let n = k(y(JSON.parse(t.dataset.sbVisualSettings).value)), r = new URL("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='26%2028%20108%20110'%3e%3crect%20x='28'%20y='30'%20width='104'%20height='106'%20rx='6'%20fill='%23e2edf4'%20stroke='%2391adbf'%20stroke-width='3'/%3e%3crect%20x='38'%20y='40'%20width='84'%20height='58'%20rx='3'%20fill='%23c6e4ee'/%3e%3ccircle%20cx='98'%20cy='58'%20r='10'%20fill='%23f0c651'/%3e%3cpath%20d='M38%2098L63%2064%2086%2088%20101%2076%20122%2098Z'%20fill='%2347957b'/%3e%3cpath%20d='M40%20112H119M40%20123H98'%20stroke='%237896aa'%20stroke-width='5'/%3e%3c/svg%3e", "" + import.meta.url).href, i = document.getElementById("jform_image_background"), a = k({ background: i?.value || "auto" });
	i?.addEventListener("change", () => {
		a.background = i.value;
	});
	for (let t of e) {
		if (t.dataset.sbVisualMounted) continue;
		let e = JSON.parse(t.dataset.sbVisualSettings);
		e.adapter ? t.closest(".control-group")?.classList.add("sb-appearance-adapter") : t.closest(".control-group")?.classList.add("sb-appearance-general");
		let i = document.getElementById(e.id);
		i && (t.dataset.sbVisualMounted = "true", v({ setup: () => () => E(se, {
			...e,
			globalSettings: n,
			sampleImage: r,
			background: a.background,
			onChange(t) {
				i.value = JSON.stringify(t), i.dispatchEvent(new Event("change", { bubbles: !0 })), e.adapter || Object.assign(n, y(t));
			}
		}) }).mount(t));
	}
};
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", $, { once: !0 }) : $();
//#endregion
