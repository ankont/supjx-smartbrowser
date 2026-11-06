import { B as e, C as t, E as n, F as r, G as i, H as a, J as o, L as s, P as c, S as l, T as u, V as d, W as f, X as p, _ as m, a as h, b as g, c as _, d as v, i as y, l as b, o as x, q as S, r as C, s as w, t as T, u as E, w as D, x as O, y as k } from "./visual-runtime-BEbhjzcM.js?v=5.0.15";
//#region resources/js/components/VisualProfileSettings.vue
var A = { class: "sb-appearance-controls" }, j = { class: "sb-appearance-layer-buttons" }, M = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], N = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], ee = [
	"aria-label",
	"value",
	"onChange"
], te = ["value"], ne = [
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
	setup(n, { emit: a }) {
		let s = n, u = a, d = i(s.value?.custom === !0 || s.value?.custom === 1), f = i(x(s.value)), v = k(() => s.adapter && !d.value ? x(s.globalSettings) : f.value), C = k(() => v.value.map((e, t) => ({
			rule: e,
			index: t
		}))), T = k(() => [
			"base",
			"identity",
			"image"
		]), E = k(() => w(C.value.map((e) => e.rule))), D = k(() => new Set(h(v.value, s.available || {}).map((e) => e.ruleIndex))), O = (e) => {
			d.value = !!s.adapter, f.value = y(e);
		}, q = (e, t, n) => O(v.value.map((r, i) => i === e ? {
			...r,
			[t]: n
		} : r)), J = (e, t) => {
			let n = C.value.findIndex((t) => t.index === e), r = C.value[n + t]?.index;
			if (r === void 0) return;
			let i = [...v.value];
			[i[e], i[r]] = [i[r], i[e]], O(i);
		}, Y = (e) => O(v.value.filter((t, n) => n !== e)), X = () => O([...v.value, {
			asset: "base",
			style: "center",
			size: "medium",
			position: "top-left",
			anchor: "item",
			priority: Math.max(0, ...v.value.map((e) => e.priority || 0)) + 1
		}]), Z = () => {
			d.value = !1;
		};
		return e([f, d], () => u("change", s.adapter && !d.value ? { custom: !1 } : {
			rules: f.value,
			...s.adapter ? { custom: !0 } : {}
		}), {
			deep: !0,
			immediate: !0
		}), (e, i) => (c(), t("div", A, [(c(!0), t(m, null, r(C.value, ({ rule: e, index: a }, s) => (c(), t("div", {
			key: a,
			class: o(["sb-appearance-row sb-appearance-rule", { "is-active": D.value.has(a) }])
		}, [
			g("span", j, [g("button", {
				type: "button",
				disabled: s === C.value.length - 1,
				title: n.labels.down,
				"aria-label": n.labels.down,
				onClick: (e) => J(a, 1)
			}, [...i[0] ||= [g("span", { class: "fas fa-chevron-down" }, null, -1)]], 8, M), g("button", {
				type: "button",
				disabled: s === 0,
				title: n.labels.up,
				"aria-label": n.labels.up,
				onClick: (e) => J(a, -1)
			}, [...i[1] ||= [g("span", { class: "fas fa-chevron-up" }, null, -1)]], 8, N)]),
			g("select", {
				"aria-label": n.labels.asset,
				value: e.asset,
				onChange: (e) => q(a, "asset", e.target.value)
			}, [(c(!0), t(m, null, r(T.value, (e) => (c(), t("option", {
				key: e,
				value: e
			}, p(n.labels[e]), 9, te))), 128))], 40, ee),
			g("input", {
				class: "sb-rule-z",
				type: "number",
				min: "1",
				step: "1",
				title: n.labels.z_index,
				"aria-label": n.labels.z_index,
				value: e.priority,
				onChange: (e) => q(a, "priority", Math.max(1, Number(e.target.value) || 1))
			}, null, 40, ne),
			g("select", {
				"aria-label": n.labels.position,
				value: e.style,
				onChange: (e) => q(a, "style", e.target.value)
			}, [(c(), t(m, null, r([
				"center",
				"corner",
				"badge"
			], (e) => g("option", {
				key: e,
				value: e
			}, p(n.labels[e]), 9, F)), 64))], 40, P),
			e.style === "center" ? l("", !0) : (c(), t("select", {
				key: 0,
				"aria-label": n.labels.position,
				value: e.position,
				onChange: (e) => q(a, "position", e.target.value)
			}, [(c(!0), t(m, null, r(S(_), (e) => (c(), t("option", {
				key: e,
				value: e
			}, p(n.labels[e.replaceAll("-", "_")]), 9, L))), 128))], 40, I)),
			g("select", {
				"aria-label": n.labels.size,
				value: e.size,
				onChange: (e) => q(a, "size", e.target.value)
			}, [(c(!0), t(m, null, r(S(b), (e) => (c(), t("option", {
				key: e,
				value: e
			}, p(n.labels[e]), 9, z))), 128))], 40, R),
			e.style === "badge" ? (c(), t("select", {
				key: 1,
				"aria-label": n.labels.anchor,
				value: E.value.includes(e.anchor) ? e.anchor : "item",
				onChange: (e) => q(a, "anchor", e.target.value)
			}, [g("option", V, p(n.labels.item), 1), (c(!0), t(m, null, r(E.value, (e) => (c(), t("option", {
				key: e,
				value: e
			}, p(e === "center" ? n.labels.center : `${n.labels.corner}: ${n.labels[e.slice(7).replaceAll("-", "_")]}`), 9, H))), 128))], 40, B)) : l("", !0),
			g("button", {
				class: "sb-rule-command",
				type: "button",
				title: n.labels.remove,
				"aria-label": n.labels.remove,
				onClick: (e) => Y(a)
			}, [...i[2] ||= [g("span", { class: "fas fa-trash-alt" }, null, -1)]], 8, U)
		], 2))), 128)), g("div", W, [g("button", {
			class: "sb-rule-command",
			type: "button",
			title: n.labels.add,
			"aria-label": n.labels.add,
			onClick: X
		}, [...i[3] ||= [g("span", { class: "fas fa-plus" }, null, -1)]], 8, G), n.adapter && d.value ? (c(), t("button", {
			key: 0,
			class: "sb-rule-command",
			type: "button",
			title: n.labels.inherited,
			"aria-label": n.labels.inherited,
			onClick: Z
		}, [...i[4] ||= [g("span", { class: "fas fa-undo" }, null, -1)]], 8, K)) : l("", !0)])]));
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
	setup(e, { emit: n }) {
		let o = e, h = n, _ = i({
			nodes: o.value?.nodes || o.value || {},
			items: o.value?.items || o.value || {}
		}), y = f({
			nodes: {
				base: !0,
				identity: !0,
				image: !0
			},
			items: {
				base: !0,
				identity: !0,
				image: !0
			}
		}), b = (e) => ({ rules: x(o.adapter && !_.value[e]?.custom ? o.globalSettings?.[e] : _.value[e]) }), S = (e) => ({
			kind: e === "nodes" ? "node" : "item",
			type: e === "nodes" ? "category" : "article",
			icon: e === "nodes" ? "fas fa-folder" : "fas fa-file-alt",
			badgeIcon: "fas fa-book",
			image: o.sampleImage
		}), C = (e, t) => {
			_.value[e] = t, h("change", { ..._.value });
		};
		return (n, i) => (c(), t("div", J, [(c(), O(s(e.adapter ? "details" : "div"), { class: "sb-appearance-overrides" }, {
			default: d(() => [
				e.adapter ? (c(), t("summary", Y, p(e.labels.adapter_title), 1)) : l("", !0),
				g("section", X, [g("h4", null, p(e.labels.nodes), 1), u(q, {
					adapter: e.adapter,
					kind: "nodes",
					labels: e.labels,
					value: e.value?.nodes || e.value || {},
					"global-settings": e.globalSettings?.nodes,
					available: y.nodes,
					onChange: i[0] ||= (e) => C("nodes", e)
				}, null, 8, [
					"adapter",
					"labels",
					"value",
					"global-settings",
					"available"
				])]),
				g("div", Z, [(c(), t(m, null, r(["nodes", "items"], (n) => g("figure", {
					key: n,
					class: "sb-appearance-preview"
				}, [g("figcaption", null, p(e.labels.preview) + ": " + p(e.labels[n]), 1), g("div", re, [g("span", Q, [u(T, {
					resource: S(n),
					settings: b(n),
					"available-assets": y[n],
					background: e.background
				}, null, 8, [
					"resource",
					"settings",
					"available-assets",
					"background"
				])]), g("div", ie, [(c(), t(m, null, r([
					"base",
					"identity",
					"image"
				], (t) => g("label", { key: t }, [a(g("input", {
					"onUpdate:modelValue": (e) => y[n][t] = e,
					type: "checkbox"
				}, null, 8, ae), [[v, y[n][t]]]), D(p(e.labels[t]), 1)])), 64))])])])), 64))]),
				g("section", oe, [g("h4", null, p(e.labels.items), 1), u(q, {
					adapter: e.adapter,
					kind: "items",
					labels: e.labels,
					value: e.value?.items || e.value || {},
					"global-settings": e.globalSettings?.items,
					available: y.items,
					onChange: i[1] ||= (e) => C("items", e)
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
	let r = f(C(JSON.parse(t.dataset.sbVisualSettings).value)), i = new URL("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='26%2028%20108%20110'%3e%3crect%20x='28'%20y='30'%20width='104'%20height='106'%20rx='6'%20fill='%23e2edf4'%20stroke='%2391adbf'%20stroke-width='3'/%3e%3crect%20x='38'%20y='40'%20width='84'%20height='58'%20rx='3'%20fill='%23c6e4ee'/%3e%3ccircle%20cx='98'%20cy='58'%20r='10'%20fill='%23f0c651'/%3e%3cpath%20d='M38%2098L63%2064%2086%2088%20101%2076%20122%2098Z'%20fill='%2347957b'/%3e%3cpath%20d='M40%20112H119M40%20123H98'%20stroke='%237896aa'%20stroke-width='5'/%3e%3c/svg%3e", "" + import.meta.url).href, a = document.querySelector("select[name=\"jform[params][image_background]\"], select[name=\"jform[image_background]\"]") || document.getElementById("jform_image_background"), o = t.closest(".control-group"), s = a?.closest(".control-group");
	s && o && s !== o && o.before(s);
	let c = f({ background: a?.value || "auto" });
	a?.addEventListener("change", () => {
		c.background = a.value;
	});
	for (let t of e) {
		if (t.dataset.sbVisualMounted) continue;
		let e = JSON.parse(t.dataset.sbVisualSettings);
		e.adapter ? t.closest(".control-group")?.classList.add("sb-appearance-adapter") : t.closest(".control-group")?.classList.add("sb-appearance-general");
		let a = document.getElementById(e.id);
		a && (t.dataset.sbVisualMounted = "true", E({ setup: () => () => n(se, {
			...e,
			globalSettings: r,
			sampleImage: i,
			background: c.background,
			onChange(t) {
				a.value = JSON.stringify(t), a.dispatchEvent(new Event("change", { bubbles: !0 })), e.adapter || Object.assign(r, C(t));
			}
		}) }).mount(t));
	}
};
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", $, { once: !0 }) : $();
//#endregion
