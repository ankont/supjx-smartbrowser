import { B as e, C as t, I as n, K as r, N as i, P as a, S as o, T as s, U as c, V as l, W as u, Y as d, _ as f, a as p, b as m, c as h, d as g, i as _, l as v, o as y, q as b, r as x, s as S, t as C, u as w, v as T, w as E, x as D, y as O, z as k } from "./visual-runtime-DqAjSaDT.js?v=4.0.0";
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
], P = [
	"aria-label",
	"value",
	"onChange"
], ee = ["value"], te = [
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
	setup(e, { emit: t }) {
		let n = e, s = t, c = u(n.value?.custom === !0 || n.value?.custom === 1), l = u(y(n.value)), m = T(() => n.adapter && !c.value ? y(n.globalSettings) : l.value), g = T(() => m.value.map((e, t) => ({
			rule: e,
			index: t
		}))), x = T(() => [
			"base",
			"identity",
			"image"
		]), C = T(() => S(g.value.map((e) => e.rule))), w = T(() => new Set(p(m.value, n.available || {}).map((e) => e.ruleIndex))), E = (e) => {
			c.value = !!n.adapter, l.value = _(e);
		}, J = (e, t, n) => E(m.value.map((r, i) => i === e ? {
			...r,
			[t]: n
		} : r)), Y = (e, t) => {
			let n = g.value.findIndex((t) => t.index === e), r = g.value[n + t]?.index;
			if (r === void 0) return;
			let i = [...m.value];
			[i[e], i[r]] = [i[r], i[e]], E(i);
		}, X = (e) => E(m.value.filter((t, n) => n !== e)), Z = () => E([...m.value, {
			asset: "base",
			style: "center",
			size: "medium",
			position: "top-left",
			anchor: "item",
			priority: Math.max(0, ...m.value.map((e) => e.priority || 0)) + 1
		}]), Q = () => {
			c.value = !1;
		};
		return k([l, c], () => s("change", n.adapter && !c.value ? { custom: !1 } : {
			rules: l.value,
			...n.adapter ? { custom: !0 } : {}
		}), {
			deep: !0,
			immediate: !0
		}), (t, n) => (i(), o("div", A, [(i(!0), o(f, null, a(g.value, ({ rule: t, index: s }, c) => (i(), o("div", {
			key: s,
			class: b(["sb-appearance-row sb-appearance-rule", { "is-active": w.value.has(s) }])
		}, [
			O("span", j, [O("button", {
				type: "button",
				disabled: c === g.value.length - 1,
				title: e.labels.down,
				"aria-label": e.labels.down,
				onClick: (e) => Y(s, 1)
			}, [...n[0] ||= [O("span", { class: "fas fa-chevron-down" }, null, -1)]], 8, M), O("button", {
				type: "button",
				disabled: c === 0,
				title: e.labels.up,
				"aria-label": e.labels.up,
				onClick: (e) => Y(s, -1)
			}, [...n[1] ||= [O("span", { class: "fas fa-chevron-up" }, null, -1)]], 8, N)]),
			O("select", {
				"aria-label": e.labels.asset,
				value: t.asset,
				onChange: (e) => J(s, "asset", e.target.value)
			}, [(i(!0), o(f, null, a(x.value, (t) => (i(), o("option", {
				key: t,
				value: t
			}, d(e.labels[t]), 9, ee))), 128))], 40, P),
			O("input", {
				class: "sb-rule-z",
				type: "number",
				min: "1",
				step: "1",
				title: e.labels.z_index,
				"aria-label": e.labels.z_index,
				value: t.priority,
				onChange: (e) => J(s, "priority", Math.max(1, Number(e.target.value) || 1))
			}, null, 40, te),
			O("select", {
				"aria-label": e.labels.position,
				value: t.style,
				onChange: (e) => J(s, "style", e.target.value)
			}, [(i(), o(f, null, a([
				"center",
				"corner",
				"badge"
			], (t) => O("option", {
				key: t,
				value: t
			}, d(e.labels[t]), 9, I)), 64))], 40, F),
			t.style === "center" ? D("", !0) : (i(), o("select", {
				key: 0,
				"aria-label": e.labels.position,
				value: t.position,
				onChange: (e) => J(s, "position", e.target.value)
			}, [(i(!0), o(f, null, a(r(h), (t) => (i(), o("option", {
				key: t,
				value: t
			}, d(e.labels[t.replaceAll("-", "_")]), 9, R))), 128))], 40, L)),
			O("select", {
				"aria-label": e.labels.size,
				value: t.size,
				onChange: (e) => J(s, "size", e.target.value)
			}, [(i(!0), o(f, null, a(r(v), (t) => (i(), o("option", {
				key: t,
				value: t
			}, d(e.labels[t]), 9, B))), 128))], 40, z),
			t.style === "badge" ? (i(), o("select", {
				key: 1,
				"aria-label": e.labels.anchor,
				value: C.value.includes(t.anchor) ? t.anchor : "item",
				onChange: (e) => J(s, "anchor", e.target.value)
			}, [O("option", H, d(e.labels.item), 1), (i(!0), o(f, null, a(C.value, (t) => (i(), o("option", {
				key: t,
				value: t
			}, d(t === "center" ? e.labels.center : `${e.labels.corner}: ${e.labels[t.slice(7).replaceAll("-", "_")]}`), 9, U))), 128))], 40, V)) : D("", !0),
			O("button", {
				class: "sb-rule-command",
				type: "button",
				title: e.labels.remove,
				"aria-label": e.labels.remove,
				onClick: (e) => X(s)
			}, [...n[2] ||= [O("span", { class: "fas fa-trash-alt" }, null, -1)]], 8, W)
		], 2))), 128)), O("div", G, [O("button", {
			class: "sb-rule-command",
			type: "button",
			title: e.labels.add,
			"aria-label": e.labels.add,
			onClick: Z
		}, [...n[3] ||= [O("span", { class: "fas fa-plus" }, null, -1)]], 8, K), e.adapter && c.value ? (i(), o("button", {
			key: 0,
			class: "sb-rule-command",
			type: "button",
			title: e.labels.inherited,
			"aria-label": e.labels.inherited,
			onClick: Q
		}, [...n[4] ||= [O("span", { class: "fas fa-undo" }, null, -1)]], 8, q)) : D("", !0)])]));
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
	setup(r, { emit: s }) {
		let p = r, h = s, _ = u({
			nodes: p.value?.nodes || p.value || {},
			items: p.value?.items || p.value || {}
		}), v = c({
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
		}), b = (e) => ({ rules: y(p.adapter && !_.value[e]?.custom ? p.globalSettings?.[e] : _.value[e]) }), x = (e) => ({
			kind: e === "nodes" ? "node" : "item",
			type: e === "nodes" ? "category" : "article",
			icon: e === "nodes" ? "fas fa-folder" : "fas fa-file-alt",
			badgeIcon: "fas fa-book",
			image: p.sampleImage
		}), S = (e, t) => {
			_.value[e] = t, h("change", { ..._.value });
		};
		return (s, c) => (i(), o("div", Y, [(i(), m(n(r.adapter ? "details" : "div"), { class: "sb-appearance-overrides" }, {
			default: e(() => [
				r.adapter ? (i(), o("summary", X, d(r.labels.adapter_title), 1)) : D("", !0),
				O("section", Z, [O("h4", null, d(r.labels.nodes), 1), E(J, {
					adapter: r.adapter,
					kind: "nodes",
					labels: r.labels,
					value: r.value?.nodes || r.value || {},
					"global-settings": r.globalSettings?.nodes,
					available: v.nodes,
					onChange: c[0] ||= (e) => S("nodes", e)
				}, null, 8, [
					"adapter",
					"labels",
					"value",
					"global-settings",
					"available"
				])]),
				O("div", Q, [(i(), o(f, null, a(["nodes", "items"], (e) => O("figure", {
					key: e,
					class: "sb-appearance-preview"
				}, [O("figcaption", null, d(r.labels.preview) + ": " + d(r.labels[e]), 1), O("div", ne, [O("span", re, [E(C, {
					resource: x(e),
					settings: b(e),
					"available-assets": v[e],
					background: r.background
				}, null, 8, [
					"resource",
					"settings",
					"available-assets",
					"background"
				])]), O("div", ie, [(i(), o(f, null, a([
					"base",
					"identity",
					"image"
				], (n) => O("label", { key: n }, [l(O("input", {
					"onUpdate:modelValue": (t) => v[e][n] = t,
					type: "checkbox"
				}, null, 8, ae), [[g, v[e][n]]]), t(d(r.labels[n]), 1)])), 64))])])])), 64))]),
				O("section", oe, [O("h4", null, d(r.labels.items), 1), E(J, {
					adapter: r.adapter,
					kind: "items",
					labels: r.labels,
					value: r.value?.items || r.value || {},
					"global-settings": r.globalSettings?.items,
					available: v.items,
					onChange: c[1] ||= (e) => S("items", e)
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
	let n = c(x(JSON.parse(t.dataset.sbVisualSettings).value)), r = new URL("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='26%2028%20108%20110'%3e%3crect%20x='28'%20y='30'%20width='104'%20height='106'%20rx='6'%20fill='%23e2edf4'%20stroke='%2391adbf'%20stroke-width='3'/%3e%3crect%20x='38'%20y='40'%20width='84'%20height='58'%20rx='3'%20fill='%23c6e4ee'/%3e%3ccircle%20cx='98'%20cy='58'%20r='10'%20fill='%23f0c651'/%3e%3cpath%20d='M38%2098L63%2064%2086%2088%20101%2076%20122%2098Z'%20fill='%2347957b'/%3e%3cpath%20d='M40%20112H119M40%20123H98'%20stroke='%237896aa'%20stroke-width='5'/%3e%3c/svg%3e", "" + import.meta.url).href, i = document.getElementById("jform_image_background"), a = c({ background: i?.value || "auto" });
	i?.addEventListener("change", () => {
		a.background = i.value;
	});
	for (let t of e) {
		if (t.dataset.sbVisualMounted) continue;
		let e = JSON.parse(t.dataset.sbVisualSettings);
		e.adapter ? t.closest(".control-group")?.classList.add("sb-appearance-adapter") : t.closest(".control-group")?.classList.add("sb-appearance-general");
		let i = document.getElementById(e.id);
		i && (t.dataset.sbVisualMounted = "true", w({ setup: () => () => s(se, {
			...e,
			globalSettings: n,
			sampleImage: r,
			background: a.background,
			onChange(t) {
				i.value = JSON.stringify(t), i.dispatchEvent(new Event("change", { bubbles: !0 })), e.adapter || Object.assign(n, x(t));
			}
		}) }).mount(t));
	}
};
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", $, { once: !0 }) : $();
//#endregion
