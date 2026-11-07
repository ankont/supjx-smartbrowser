import { E as e, F as t, I as n, M as r, N as i, O as a, R as o, T as s, V as c, _ as l, c as u, d, f, g as p, h as m, j as h, m as g, n as _, p as v, t as y, u as b, z as x } from "./visual-runtime-CJIQlqNK.js?v=5.2.0";
import { a as S, c as C, i as w, l as T, o as E, r as D, s as O, t as k } from "./visual-runtime-DAGXuL4O.js?v=5.2.0";
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
], N = ["value"], P = [
	"title",
	"aria-label",
	"value",
	"onChange"
], F = [
	"aria-label",
	"value",
	"onChange"
], I = ["value"], L = [
	"aria-label",
	"value",
	"onChange"
], R = ["value"], z = [
	"aria-label",
	"value",
	"onChange"
], B = ["value"], V = [
	"aria-label",
	"value",
	"onChange"
], H = { value: "item" }, U = ["value"], W = [
	"title",
	"aria-label",
	"onClick"
], G = { class: "sb-rule-commands" }, K = ["title", "aria-label"], q = ["title", "aria-label"], J = {
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
	setup(t, { emit: r }) {
		let i = t, a = r, l = n(i.value?.custom === !0 || i.value?.custom === 1), f = n(E(i.value)), p = b(() => i.adapter && !l.value ? E(i.globalSettings) : f.value), m = b(() => p.value.map((e, t) => ({
			rule: e,
			index: t
		}))), _ = b(() => [
			"base",
			"identity",
			"image"
		]), y = b(() => O(m.value.map((e) => e.rule))), D = b(() => new Set(S(p.value, i.available || {}).map((e) => e.ruleIndex))), k = (e) => {
			l.value = !!i.adapter, f.value = w(e);
		}, J = (e, t, n) => k(p.value.map((r, i) => i === e ? {
			...r,
			[t]: n
		} : r)), Y = (e, t) => {
			let n = m.value.findIndex((t) => t.index === e), r = m.value[n + t]?.index;
			if (r === void 0) return;
			let i = [...p.value];
			[i[e], i[r]] = [i[r], i[e]], k(i);
		}, X = (e) => k(p.value.filter((t, n) => n !== e)), Z = () => k([...p.value, {
			asset: "base",
			style: "center",
			size: "medium",
			position: "top-left",
			anchor: "item",
			priority: Math.max(0, ...p.value.map((e) => e.priority || 0)) + 1
		}]), Q = () => {
			l.value = !1;
		};
		return h([f, l], () => a("change", i.adapter && !l.value ? { custom: !1 } : {
			rules: f.value,
			...i.adapter ? { custom: !0 } : {}
		}), {
			deep: !0,
			immediate: !0
		}), (n, r) => (s(), g("div", A, [(s(!0), g(u, null, e(m.value, ({ rule: n, index: i }, a) => (s(), g("div", {
			key: i,
			class: x(["sb-appearance-row sb-appearance-rule", { "is-active": D.value.has(i) }])
		}, [
			d("span", j, [d("button", {
				type: "button",
				disabled: a === m.value.length - 1,
				title: t.labels.down,
				"aria-label": t.labels.down,
				onClick: (e) => Y(i, 1)
			}, [...r[0] ||= [d("span", { class: "fas fa-chevron-down" }, null, -1)]], 8, M), d("button", {
				type: "button",
				disabled: a === 0,
				title: t.labels.up,
				"aria-label": t.labels.up,
				onClick: (e) => Y(i, -1)
			}, [...r[1] ||= [d("span", { class: "fas fa-chevron-up" }, null, -1)]], 8, ee)]),
			d("select", {
				"aria-label": t.labels.asset,
				value: n.asset,
				onChange: (e) => J(i, "asset", e.target.value)
			}, [(s(!0), g(u, null, e(_.value, (e) => (s(), g("option", {
				key: e,
				value: e
			}, c(t.labels[e]), 9, N))), 128))], 40, te),
			d("input", {
				class: "sb-rule-z",
				type: "number",
				min: "1",
				step: "1",
				title: t.labels.z_index,
				"aria-label": t.labels.z_index,
				value: n.priority,
				onChange: (e) => J(i, "priority", Math.max(1, Number(e.target.value) || 1))
			}, null, 40, P),
			d("select", {
				"aria-label": t.labels.position,
				value: n.style,
				onChange: (e) => J(i, "style", e.target.value)
			}, [(s(), g(u, null, e([
				"center",
				"corner",
				"badge"
			], (e) => d("option", {
				key: e,
				value: e
			}, c(t.labels[e]), 9, I)), 64))], 40, F),
			n.style === "center" ? v("", !0) : (s(), g("select", {
				key: 0,
				"aria-label": t.labels.position,
				value: n.position,
				onChange: (e) => J(i, "position", e.target.value)
			}, [(s(!0), g(u, null, e(o(C), (e) => (s(), g("option", {
				key: e,
				value: e
			}, c(t.labels[e.replaceAll("-", "_")]), 9, R))), 128))], 40, L)),
			d("select", {
				"aria-label": t.labels.size,
				value: n.size,
				onChange: (e) => J(i, "size", e.target.value)
			}, [(s(!0), g(u, null, e(o(T), (e) => (s(), g("option", {
				key: e,
				value: e
			}, c(t.labels[e]), 9, B))), 128))], 40, z),
			n.style === "badge" ? (s(), g("select", {
				key: 1,
				"aria-label": t.labels.anchor,
				value: y.value.includes(n.anchor) ? n.anchor : "item",
				onChange: (e) => J(i, "anchor", e.target.value)
			}, [d("option", H, c(t.labels.item), 1), (s(!0), g(u, null, e(y.value, (e) => (s(), g("option", {
				key: e,
				value: e
			}, c(e === "center" ? t.labels.center : `${t.labels.corner}: ${t.labels[e.slice(7).replaceAll("-", "_")]}`), 9, U))), 128))], 40, V)) : v("", !0),
			d("button", {
				class: "sb-rule-command",
				type: "button",
				title: t.labels.remove,
				"aria-label": t.labels.remove,
				onClick: (e) => X(i)
			}, [...r[2] ||= [d("span", { class: "fas fa-trash-alt" }, null, -1)]], 8, W)
		], 2))), 128)), d("div", G, [d("button", {
			class: "sb-rule-command",
			type: "button",
			title: t.labels.add,
			"aria-label": t.labels.add,
			onClick: Z
		}, [...r[3] ||= [d("span", { class: "fas fa-plus" }, null, -1)]], 8, K), t.adapter && l.value ? (s(), g("button", {
			key: 0,
			class: "sb-rule-command",
			type: "button",
			title: t.labels.inherited,
			"aria-label": t.labels.inherited,
			onClick: Q
		}, [...r[4] ||= [d("span", { class: "fas fa-undo" }, null, -1)]], 8, q)) : v("", !0)])]));
	}
}, Y = { class: "sb-appearance-editor" }, X = { key: 0 }, Z = { class: "sb-appearance-profile" }, Q = { class: "sb-appearance-previews" }, ne = { class: "sb-preview-body" }, re = { class: "sb-appearance-preview-tile" }, ie = { class: "sb-preview-assets" }, ae = ["onUpdate:modelValue"], oe = { class: "sb-appearance-profile" }, se = {
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
	setup(o, { emit: l }) {
		let h = o, y = l, b = n({
			nodes: h.value?.nodes || h.value || {},
			items: h.value?.items || h.value || {}
		}), x = t({
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
		}), S = (e) => ({ rules: E(h.adapter && !b.value[e]?.custom ? h.globalSettings?.[e] : b.value[e]) }), C = (e) => ({
			kind: e === "nodes" ? "node" : "item",
			type: e === "nodes" ? "category" : "article",
			icon: e === "nodes" ? "fas fa-folder" : "fas fa-file-alt",
			badgeIcon: "fas fa-book",
			image: h.sampleImage
		}), w = (e, t) => {
			b.value[e] = t, y("change", { ...b.value });
		};
		return (t, n) => (s(), g("div", Y, [(s(), f(a(o.adapter ? "details" : "div"), { class: "sb-appearance-overrides" }, {
			default: r(() => [
				o.adapter ? (s(), g("summary", X, c(o.labels.adapter_title), 1)) : v("", !0),
				d("section", Z, [d("h4", null, c(o.labels.nodes), 1), p(J, {
					adapter: o.adapter,
					kind: "nodes",
					labels: o.labels,
					value: o.value?.nodes || o.value || {},
					"global-settings": o.globalSettings?.nodes,
					available: x.nodes,
					onChange: n[0] ||= (e) => w("nodes", e)
				}, null, 8, [
					"adapter",
					"labels",
					"value",
					"global-settings",
					"available"
				])]),
				d("div", Q, [(s(), g(u, null, e(["nodes", "items"], (t) => d("figure", {
					key: t,
					class: "sb-appearance-preview"
				}, [d("figcaption", null, c(o.labels.preview) + ": " + c(o.labels[t]), 1), d("div", ne, [d("span", re, [p(k, {
					resource: C(t),
					settings: S(t),
					"available-assets": x[t],
					background: o.background
				}, null, 8, [
					"resource",
					"settings",
					"available-assets",
					"background"
				])]), d("div", ie, [(s(), g(u, null, e([
					"base",
					"identity",
					"image"
				], (e) => d("label", { key: e }, [i(d("input", {
					"onUpdate:modelValue": (n) => x[t][e] = n,
					type: "checkbox"
				}, null, 8, ae), [[_, x[t][e]]]), m(c(o.labels[e]), 1)])), 64))])])])), 64))]),
				d("section", oe, [d("h4", null, c(o.labels.items), 1), p(J, {
					adapter: o.adapter,
					kind: "items",
					labels: o.labels,
					value: o.value?.items || o.value || {},
					"global-settings": o.globalSettings?.items,
					available: x.items,
					onChange: n[1] ||= (e) => w("items", e)
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
	let e = [...document.querySelectorAll("[data-sb-visual-settings]")], n = e.find((e) => !JSON.parse(e.dataset.sbVisualSettings).adapter);
	if (!n) return;
	let r = t(D(JSON.parse(n.dataset.sbVisualSettings).value)), i = new URL("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='26%2028%20108%20110'%3e%3crect%20x='28'%20y='30'%20width='104'%20height='106'%20rx='6'%20fill='%23e2edf4'%20stroke='%2391adbf'%20stroke-width='3'/%3e%3crect%20x='38'%20y='40'%20width='84'%20height='58'%20rx='3'%20fill='%23c6e4ee'/%3e%3ccircle%20cx='98'%20cy='58'%20r='10'%20fill='%23f0c651'/%3e%3cpath%20d='M38%2098L63%2064%2086%2088%20101%2076%20122%2098Z'%20fill='%2347957b'/%3e%3cpath%20d='M40%20112H119M40%20123H98'%20stroke='%237896aa'%20stroke-width='5'/%3e%3c/svg%3e", "" + import.meta.url).href, a = document.querySelector("select[name=\"jform[params][image_background]\"], select[name=\"jform[image_background]\"]") || document.getElementById("jform_image_background"), o = n.closest(".control-group"), s = a?.closest(".control-group");
	s && o && s !== o && o.before(s);
	let c = t({ background: a?.value || "auto" });
	a?.addEventListener("change", () => {
		c.background = a.value;
	});
	for (let t of e) {
		if (t.dataset.sbVisualMounted) continue;
		let e = JSON.parse(t.dataset.sbVisualSettings);
		e.adapter ? t.closest(".control-group")?.classList.add("sb-appearance-adapter") : t.closest(".control-group")?.classList.add("sb-appearance-general");
		let n = document.getElementById(e.id);
		n && (t.dataset.sbVisualMounted = "true", y({ setup: () => () => l(se, {
			...e,
			globalSettings: r,
			sampleImage: i,
			background: c.background,
			onChange(t) {
				n.value = JSON.stringify(t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.adapter || Object.assign(r, D(t));
			}
		}) }).mount(t));
	}
};
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", $, { once: !0 }) : $();
//#endregion
