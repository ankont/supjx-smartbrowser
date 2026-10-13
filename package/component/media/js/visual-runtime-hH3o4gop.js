import { B as e, C as t, D as n, E as r, F as i, H as a, I as o, L as s, M as c, N as l, O as u, P as d, R as f, S as p, U as m, V as h, W as g, _, b as v, g as y, h as b, j as x, k as S, m as C, p as w, t as T, v as E, x as D, y as O, z as k } from "./visual-runtime-6WA-BB1G.js?v=3.6.22";
import { i as A, n as j, r as M, t as N } from "./visual-runtime-1h24eaHt.js?v=3.6.22";
import { t as P } from "./visual-runtime-BceWU2F8.js?v=3.6.22";
//#region resources/js/core/fieldIcons.js
var F = {
	title: null,
	name: null,
	alias: "fas fa-link",
	status: "fas fa-check-circle",
	stateLabel: "fas fa-check-circle",
	author: "fas fa-user",
	category: "fas fa-folder",
	categoryPath: "fas fa-folder",
	parent: "fas fa-folder",
	parentPath: "fas fa-folder",
	location: "fas fa-folder",
	locationPath: "fas fa-folder",
	tagPaths: "fas fa-tags",
	created: "fas fa-calendar",
	modified: "fas fa-calendar",
	registered: "fas fa-calendar",
	lastVisit: "fas fa-clock",
	language: "fas fa-globe",
	languageKey: "fas fa-language",
	id: "fas fa-key",
	access: "fas fa-lock",
	size: "fas fa-database",
	dimension: "fas fa-expand",
	width: "fas fa-expand",
	ordering: "fas fa-sort",
	menu: "fas fa-bars",
	menuItemType: "fas fa-file-alt",
	shortcut: "fas fa-link",
	url: "fas fa-link",
	link: "fas fa-link",
	username: "fas fa-user",
	email: "fas fa-envelope",
	groups: "fas fa-users",
	tags: "fas fa-tags",
	mimeType: "fas fa-file-alt",
	extension: "fas fa-tag",
	type: "fas fa-file-alt"
}, I = (e) => e.icon || e.headerIcon || F[e.id || String(e.source || "").split(".").pop()] || (e.format === "date" ? "fas fa-calendar" : "fas fa-info"), L = (e) => e.icon || {
	"media.caption": "fas fa-comment",
	"media.class": "fas fa-code",
	"media.alt": "fas fa-font",
	"media.decorative": "fas fa-image",
	"media.loading": "fas fa-clock",
	"link.text": "fas fa-font",
	"link.target": "fas fa-external-link-alt"
}[e.key] || "fas fa-info", ee = (e) => (e || []).filter((e) => e.type === "resource" && e.visualRole === "thumbnail");
function te(e, t = {}) {
	if (!e || e.unavailable) return "";
	let n = t["visual.iconOverride"];
	return typeof n == "string" && n.length <= 160 && /^[a-zA-Z0-9_-]+(?: [a-zA-Z0-9_-]+)*$/.test(n) ? n : e.icon || "fas fa-file";
}
function R(e) {
	return !e || e.unavailable ? "" : e.thumbnail || e.metadata?.thumbnail || e.metadata?.poster || e.image || (e.type === "image" ? e.metadata?.url : "") || "";
}
async function ne(e, t, n) {
	let r = await n(t, e.picker);
	if (!r || r.unavailable || r.selectable === !1 || !R(r) || e.picker?.allowedResourceTypes?.length && !e.picker.allowedResourceTypes.includes(r.type)) throw Error("COM_SMARTBROWSER_USAGE_INVALID");
	return R(r);
}
//#endregion
//#region resources/js/core/selectionUsage.js
var re = /^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/, z = (e, t) => Object.prototype.hasOwnProperty.call(e, t), B = (e) => e === void 0 ? void 0 : JSON.parse(JSON.stringify(e)), V = (e) => e == null || typeof e == "string" && !e.trim(), H = /* @__PURE__ */ new Set([
	"text",
	"textarea",
	"boolean",
	"select",
	"number",
	"resource"
]), U = (e, t) => !!(e.disabledWhen && z(t || {}, e.disabledWhen.key) && t[e.disabledWhen.key] === e.disabledWhen.equals);
function ie(e, t = {}) {
	if (!e || e.unavailable || !t || typeof t != "object") return [];
	let n = Array.isArray(e.selectionCapabilities) ? e.selectionCapabilities : [], r = /* @__PURE__ */ new Set();
	return n.flatMap((e) => {
		let n = e?.key;
		if (!re.test(n || "") || ![
			"string",
			"boolean",
			"number",
			"resource",
			"object"
		].includes(e.type) || r.has(n) || !z(t, n) || t[n] === !1) return [];
		r.add(n);
		let i = t[n] && typeof t[n] == "object" ? t[n] : {};
		return [{
			...e,
			policy: i,
			presentation: ["secondary", "hidden"].includes(i.presentation) ? i.presentation : "primary",
			default: z(i, "default") ? i.default : e.default,
			required: i.required === !0
		}];
	});
}
function ae(e, t) {
	if (V(t)) return e.required ? "COM_SMARTBROWSER_USAGE_REQUIRED" : null;
	let n = e.type;
	if (n === "string" && typeof t != "string" || n === "boolean" && typeof t != "boolean" || n === "number" && (typeof t != "number" || !Number.isFinite(t)) || n === "object" && (typeof t != "object" || Array.isArray(t)) || n === "resource" && !j(t)) return "COM_SMARTBROWSER_USAGE_INVALID";
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
function oe({ profile: e = {}, initialUsage: t = {}, resolveReference: n, editors: r = {} } = {}) {
	let i = /* @__PURE__ */ new Map(), a = (t) => ie(t, e);
	function o(e) {
		if (!e) return {};
		let n = A(e);
		i.has(n) || i.set(n, e.unavailable ? B(t[n] || {}) : {});
		let r = i.get(n);
		for (let i of a(e)) z(r, i.key) || (r[i.key] = B(z(t[n] || {}, i.key) ? t[n][i.key] : i.default ?? null));
		for (let t of a(e)) U(t, r) && (r[t.key] = B(t.inactiveValue ?? null));
		return B(r);
	}
	function s(e, t, n) {
		a(e).some((e) => e.key === t) && (o(e), i.get(A(e))[t] = B(n), o(e));
	}
	async function c(e) {
		let t = {}, i = {}, s = {};
		for (let c of e) {
			let e = A(c), l = o(c), u = {};
			for (let o of a(c)) {
				let a = l[o.key], s = ae(U(o, l) ? {
					...o,
					required: !1
				} : o, a);
				if (!s && o.type === "resource" && !V(a)) {
					let e = j(a), t = o.picker || {};
					if (t.adapter && e.adapter !== t.adapter || t.allowedAdapters?.length && !t.allowedAdapters.includes(e.adapter)) s = "COM_SMARTBROWSER_USAGE_INVALID";
					else try {
						let r = await n(e, t);
						(!r || r.unavailable || r.selectable === !1 || t.selectionTarget === "item" && r.kind !== "item" || t.selectionTarget === "node" && r.kind !== "node" || t.allowedResourceTypes?.length && !t.allowedResourceTypes.includes(r.type)) && (s = "COM_SMARTBROWSER_USAGE_INVALID");
					} catch {
						s = "COM_SMARTBROWSER_USAGE_INVALID";
					}
				}
				let d = r[o.editor];
				if (o.presentation !== "hidden" && !H.has(o.editor) && !d && (s = "COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE"), !s && d?.validate) try {
					s = await d.validate(a, {
						definition: o,
						resource: c,
						values: l
					}) || null;
				} catch {
					s = "COM_SMARTBROWSER_USAGE_INVALID";
				}
				s && (t[e] ||= {}, t[e][o.key] = s, o.presentation === "hidden" && (i[e] ||= {}, i[e][o.key] = s)), u[o.key] = o.type === "resource" && !V(a) ? j(a) : a;
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
			i.delete(A(e));
		}
	};
}
//#endregion
//#region resources/js/components/LightweightResourceVisual.vue
var se = { class: "resource-lightweight-area" }, ce = ["src"], W = {
	key: 2,
	class: "resource-preview-empty"
}, le = {
	key: 0,
	class: "resource-lightweight-actions resource-lightweight-preview-action"
}, ue = ["title", "aria-label"], de = { class: "resource-lightweight-actions" }, fe = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], pe = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], me = {
	key: 0,
	class: "text-danger",
	role: "alert"
}, he = {
	__name: "LightweightResourceVisual",
	props: {
		resource: Object,
		definitions: Array,
		values: Object,
		errors: Object,
		resolveReference: Function,
		canPreview: Boolean,
		editable: Boolean,
		contentOnly: Boolean,
		nativePreview: Boolean,
		t: Function
	},
	emits: ["change", "preview"],
	setup(t, { expose: n, emit: r }) {
		let o = t, d = r, f = _(() => ee(o.definitions)), p = _(() => o.editable ? f.value.filter((e) => e.presentation !== "hidden") : []), m = _(() => te(o.resource, o.values)), h = _(() => f.value.find((e) => o.values?.[e.key])), b = e(""), S = e(""), C = e(""), k = e(!1), M = e(null), N = _(() => o.contentOnly && o.resource?.type === "image" ? o.resource.metadata?.url || o.resource.image || R(o.resource) : b.value || R(o.resource)), P = 0, F = !1;
		i(() => [
			A(o.resource),
			h.value,
			h.value && o.values?.[h.value.key]
		], async () => {
			let e = ++P;
			b.value = "", S.value = "", C.value = "";
			let t = h.value;
			if (t) try {
				let n = await ne(t, o.values[t.key], o.resolveReference);
				if (e !== P) return;
				b.value = n;
			} catch {
				e === P && (C.value = "COM_SMARTBROWSER_USAGE_INVALID");
			}
		}, {
			immediate: !0,
			deep: !0
		});
		async function I(e) {
			let t = A(o.resource);
			k.value = !0;
			try {
				let n = await window.SmartBrowserPicker.open({
					...e.picker,
					title: o.t("COM_SMARTBROWSER_SELECT_THUMBNAIL"),
					subtitle: o.resource.title,
					confirmLabel: o.t("COM_SMARTBROWSER_USE_THUMBNAIL"),
					multiple: !1,
					initialSelection: o.values?.[e.key] ? [o.values[e.key].id] : []
				});
				n && !F && A(o.resource) === t && d("change", e.key, j({
					adapter: e.picker.adapter,
					id: n.id
				}));
			} catch {
				!F && A(o.resource) === t && (C.value = "COM_SMARTBROWSER_USAGE_INVALID");
			} finally {
				k.value = !1;
			}
		}
		return n({ element: M }), u(() => {
			F = !0, ++P;
		}), (e, n) => (x(), D(y, null, [E("div", se, [
			s(E("div", {
				ref_key: "surface",
				ref: M,
				class: a(["resource-lightweight-visual", {
					"has-override": !!h.value,
					"is-information-visual": !t.contentOnly,
					"has-unavailable-content": t.contentOnly && t.resource?.id && !N.value
				}])
			}, [t.contentOnly ? N.value && S.value !== N.value ? (x(), D("img", {
				key: 1,
				src: N.value,
				alt: "",
				loading: "lazy",
				onError: n[0] ||= (e) => S.value = N.value
			}, null, 40, ce)) : v("", !0) : (x(), O(T, {
				key: 0,
				resource: {
					...t.resource,
					image: N.value,
					icon: m.value
				},
				"fit-content": ""
			}, null, 8, ["resource"])), t.contentOnly && (!N.value || S.value === N.value) ? (x(), D("span", W, g(t.t("COM_SMARTBROWSER_PREVIEW_UNAVAILABLE")), 1)) : v("", !0)], 2), [[w, !t.nativePreview]]),
			t.canPreview ? (x(), D("div", le, [t.canPreview ? (x(), D("button", {
				key: 0,
				type: "button",
				title: t.t("COM_SMARTBROWSER_ACTION_PREVIEW"),
				"aria-label": t.t("COM_SMARTBROWSER_ACTION_PREVIEW"),
				onClick: n[1] ||= (t) => e.$emit("preview")
			}, [...n[2] ||= [E("span", {
				class: "fas fa-eye",
				"aria-hidden": "true"
			}, null, -1)]], 8, ue)) : v("", !0)])) : v("", !0),
			E("div", de, [(x(!0), D(y, null, c(p.value, (r) => (x(), D(y, { key: r.key }, [E("button", {
				type: "button",
				class: a({ selected: !!t.values?.[r.key] }),
				disabled: k.value,
				title: t.t(t.values?.[r.key] ? "COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL" : "COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL"),
				"aria-label": t.t(t.values?.[r.key] ? "COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL" : "COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL"),
				onClick: (e) => I(r)
			}, [...n[3] ||= [E("span", {
				class: "fas fa-image",
				"aria-hidden": "true"
			}, null, -1)]], 10, fe), t.values?.[r.key] ? (x(), D("button", {
				key: 0,
				type: "button",
				disabled: k.value,
				title: t.t("COM_SMARTBROWSER_USAGE_CLEAR"),
				"aria-label": t.t("COM_SMARTBROWSER_USAGE_CLEAR"),
				onClick: (t) => e.$emit("change", r.key, null)
			}, [...n[4] ||= [E("span", {
				class: "fas fa-times",
				"aria-hidden": "true"
			}, null, -1)]], 8, pe)) : v("", !0)], 64))), 128)), l(e.$slots, "actions")])
		]), C.value || f.value.some((e) => t.errors?.[e.key]) ? (x(), D("small", me, g(t.t(C.value || t.errors[f.value.find((e) => t.errors?.[e.key]).key])), 1)) : v("", !0)], 64));
	}
}, ge = {
	__name: "ResourceActionIcon",
	props: { icon: String },
	setup(e) {
		return (t, n) => (x(), D("span", {
			class: a(e.icon === "arrow-down-up-across-line" ? "fas fa-arrow-down-up-across-line" : e.icon),
			"aria-hidden": "true"
		}, null, 2));
	}
}, _e = { class: "resource-usage-field" }, G = {
	key: 0,
	"aria-hidden": "true"
}, ve = [
	"value",
	"disabled",
	"required",
	"aria-invalid"
], ye = [
	"value",
	"required",
	"aria-invalid"
], be = {
	key: 3,
	class: "resource-usage-check"
}, xe = ["checked"], Se = ["value", "aria-invalid"], Ce = {
	key: 0,
	value: ""
}, K = ["value"], we = ["value", "aria-invalid"], Te = ["value"], q = { value: "auto" }, Ee = { value: "custom" }, J = {
	key: 0,
	class: "resource-usage-reference"
}, De = { key: 0 }, Oe = ["disabled"], ke = ["title", "aria-label"], Ae = {
	key: 8,
	class: "text-danger"
}, je = { key: 9 }, Me = {
	key: 10,
	class: "text-danger",
	role: "alert"
}, Ne = {
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
	setup(t, { emit: r }) {
		let o = t, s = r, l = `sb-usage-${Math.random().toString(36).slice(2)}`, d = e(o.value ? "custom" : "auto"), f = e(""), m = e(!1), b = e(""), S = e(null), C = _(() => o.editors?.[o.definition.editor]), w = _(() => U(o.definition, o.values)), T, O, k = 0, M = !1, N = (e) => {
			b.value = "", s("change", e);
		}, P = () => {
			d.value = "auto", N(null);
		}, F = (e) => {
			d.value = e, e === "auto" && N(null);
		};
		i(() => o.value, async (e) => {
			let t = ++k;
			if (b.value = "", f.value = "", o.definition.type === "resource" && e) {
				d.value = "custom";
				try {
					let n = await o.resolveReference(e, o.definition.picker);
					t === k && (f.value = n?.title || "", (!n || n.unavailable) && (b.value = "COM_SMARTBROWSER_USAGE_INVALID"));
				} catch {
					t === k && (b.value = "COM_SMARTBROWSER_USAGE_INVALID");
				}
			}
		}, { immediate: !0 });
		async function I() {
			m.value = !0;
			try {
				let e = await window.SmartBrowserPicker.open({
					...o.definition.picker,
					multiple: !1,
					initialSelection: o.value ? [o.value.id] : []
				});
				e && !M && N(j({
					adapter: o.definition.picker.adapter,
					id: e.id
				}));
			} catch {
				b.value = "COM_SMARTBROWSER_USAGE_INVALID";
			} finally {
				m.value = !1;
			}
		}
		return i([C, () => A(o.resource)], async () => {
			if (O?.abort(), T?.destroy?.(), T = null, await n(), !M && C.value && S.value) {
				O = new AbortController();
				try {
					T = C.value.mount(S.value, {
						definition: o.definition,
						resource: o.resource,
						id: l,
						value: o.value,
						values: o.values,
						setValue: N,
						signal: O.signal,
						translate: o.t
					}) || null;
				} catch {
					b.value = "COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE";
				}
			}
		}, { immediate: !0 }), i(() => [o.value, o.values], () => T?.update?.({
			value: o.value,
			values: o.values
		}), { deep: !0 }), u(() => {
			M = !0, ++k, O?.abort(), T?.destroy?.();
		}), (e, n) => (x(), D("div", _e, [
			t.definition.editor === "boolean" ? v("", !0) : (x(), D("label", {
				key: 0,
				for: l
			}, [
				E("span", {
					class: a(h(L)(t.definition)),
					"aria-hidden": "true"
				}, null, 2),
				p(g(t.t(t.definition.label)), 1),
				t.definition.required ? (x(), D("span", G, " *")) : v("", !0)
			])),
			t.definition.editor === "text" ? (x(), D("input", {
				key: 1,
				id: l,
				class: "form-control",
				type: "text",
				value: t.value ?? "",
				disabled: w.value,
				required: t.definition.required && !w.value,
				"aria-invalid": !!t.error,
				onInput: n[0] ||= (e) => N(e.target.value)
			}, null, 40, ve)) : t.definition.editor === "textarea" ? (x(), D("textarea", {
				key: 2,
				id: l,
				class: "form-control",
				rows: "3",
				value: t.value ?? "",
				required: t.definition.required,
				"aria-invalid": !!t.error,
				onInput: n[1] ||= (e) => N(e.target.value)
			}, null, 40, ye)) : t.definition.editor === "boolean" ? (x(), D("label", be, [
				E("input", {
					id: l,
					class: "form-check-input",
					type: "checkbox",
					checked: t.value === !0,
					onChange: n[2] ||= (e) => N(e.target.checked)
				}, null, 40, xe),
				t.definition.key === "media.decorative" ? v("", !0) : (x(), D("span", {
					key: 0,
					class: a(h(L)(t.definition)),
					"aria-hidden": "true"
				}, null, 2)),
				p(g(t.t(t.definition.label)), 1)
			])) : t.definition.editor === "select" ? (x(), D("select", {
				key: 4,
				id: l,
				class: "form-select",
				value: t.value,
				"aria-invalid": !!t.error,
				onChange: n[3] ||= (e) => N(t.definition.options.find((t) => String(t.value) === e.target.value)?.value)
			}, [!t.definition.required && !t.definition.options?.some((e) => e.value === "") ? (x(), D("option", Ce, g(t.t("COM_SMARTBROWSER_USAGE_CHOOSE")), 1)) : v("", !0), (x(!0), D(y, null, c(t.definition.options, (e) => (x(), D("option", {
				key: String(e.value),
				value: e.value
			}, g(t.t(e.label)), 9, K))), 128))], 40, Se)) : t.definition.editor === "number" ? (x(), D("input", {
				key: 5,
				id: l,
				class: "form-control",
				type: "number",
				value: t.value ?? "",
				"aria-invalid": !!t.error,
				onInput: n[4] ||= (e) => N(e.target.value === "" ? null : Number(e.target.value))
			}, null, 40, we)) : t.definition.editor === "resource" ? (x(), D(y, { key: 6 }, [E("select", {
				id: l,
				class: "form-select",
				value: d.value,
				onChange: n[5] ||= (e) => F(e.target.value)
			}, [E("option", q, g(t.t("COM_SMARTBROWSER_USAGE_AUTO")), 1), E("option", Ee, g(t.t("COM_SMARTBROWSER_USAGE_CUSTOM")), 1)], 40, Te), d.value === "custom" ? (x(), D("div", J, [
				t.value ? (x(), D("span", De, g(f.value || t.value.id), 1)) : v("", !0),
				E("button", {
					type: "button",
					class: "btn btn-outline-primary",
					disabled: m.value,
					onClick: I
				}, [n[6] ||= E("span", {
					class: "fas fa-plus",
					"aria-hidden": "true"
				}, null, -1), p(" " + g(t.t(t.definition.pickerLabel || "COM_SMARTBROWSER_USAGE_PICK_RESOURCE")), 1)], 8, Oe),
				t.value ? (x(), D("button", {
					key: 1,
					type: "button",
					class: "btn btn-outline-secondary",
					title: t.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					"aria-label": t.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					onClick: P
				}, [...n[7] ||= [E("span", {
					class: "fas fa-times",
					"aria-hidden": "true"
				}, null, -1)]], 8, ke)) : v("", !0)
			])) : v("", !0)], 64)) : C.value ? (x(), D("div", {
				key: 7,
				ref_key: "customContainer",
				ref: S
			}, null, 512)) : (x(), D("small", Ae, g(t.t("COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE")), 1)),
			t.definition.description ? (x(), D("small", je, g(t.t(t.definition.description)), 1)) : v("", !0),
			t.error || b.value ? (x(), D("small", Me, g(t.t(t.error || b.value)), 1)) : v("", !0)
		]));
	}
}, Pe = { class: "resource-usage-editor" }, Fe = ["open"], Ie = {
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
		let t = e, n = _(() => t.definitions.filter((e) => e.presentation === "primary")), i = _(() => t.definitions.filter((e) => e.presentation === "secondary")), a = (e) => ({
			definition: e,
			value: t.values[e.key],
			values: t.values,
			error: t.errors?.[e.key],
			resource: t.resource,
			t: t.t,
			editors: t.editors,
			resolveReference: t.resolveReference
		});
		return (t, o) => (x(), D("div", Pe, [(x(!0), D(y, null, c(n.value, (e) => (x(), O(Ne, r({ key: e.key }, { ref_for: !0 }, a(e), { onChange: (n) => t.$emit("change", e.key, n) }), null, 16, ["onChange"]))), 128)), i.value.length ? (x(), D("details", {
			key: 0,
			class: "resource-usage-secondary",
			open: i.value.some((t) => e.errors?.[t.key]) || void 0
		}, [E("summary", null, g(e.t("COM_SMARTBROWSER_USAGE_MORE")), 1), (x(!0), D(y, null, c(i.value, (e) => (x(), O(Ne, r({ key: e.key }, { ref_for: !0 }, a(e), { onChange: (n) => t.$emit("change", e.key, n) }), null, 16, ["onChange"]))), 128))], 8, Fe)) : v("", !0)]));
	}
}, Le = [
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
}));
function Re(e, t = {}) {
	return {
		...e,
		image: e?.effectiveThumbnail || R(e),
		selectionType: e?.metadata?.typeLabel || e?.type || "",
		selectionPath: ze(e)
	};
}
function ze(e) {
	if (e?.adapter === "media" || [
		"image",
		"document",
		"audio",
		"video"
	].includes(e?.type)) {
		let t = globalThis.SmartBrowserMediaValue?.format(e, "joomla");
		if (t) return t;
	}
	return e?.metadata?.relativePath || e?.metadata?.url || e?.metadata?.link || e?.id || "";
}
var Be = [
	{
		id: "title",
		label: "COM_SMARTBROWSER_NAME",
		headerIcon: "fas fa-file-alt"
	},
	{
		id: "selectionPath",
		source: "selectionPath",
		label: "COM_SMARTBROWSER_URI",
		headerIcon: "fas fa-link"
	},
	{
		id: "status",
		label: "JSTATUS",
		format: "status",
		overlays: !0
	}
];
Be.slice(1, 3);
function Ve(e, t) {
	let n = {
		image: "COM_SMARTBROWSER_MEDIA_IMAGE",
		document: "COM_SMARTBROWSER_MEDIA_DOCUMENT",
		video: "COM_SMARTBROWSER_MEDIA_VIDEO",
		audio: "COM_SMARTBROWSER_MEDIA_AUDIO",
		folder: "COM_SMARTBROWSER_FOLDER"
	}[e?.type], r = e?.metadata?.typeLabel || e?.type || "";
	return n ? t(n) : r ? r.charAt(0).toUpperCase() + r.slice(1) : t("COM_SMARTBROWSER_RESOURCE");
}
function He(e, t) {
	return !e.readOnly && typeof e.onAdd == "function" && t < (e.multiple === !1 ? 1 : e.maxSelections || 500);
}
function Ue(e = "auto", t = 0) {
	return e === "auto" ? t >= 800 ? "right" : "bottom" : ["left", "right"].includes(e) && t < 640 ? "bottom" : e;
}
//#endregion
//#region resources/js/components/ResourceInfoPanel.vue
var Y = {
	key: 0,
	class: "sb-preview-selection-actions"
}, We = [
	"disabled",
	"title",
	"aria-label"
], Ge = {
	key: 0,
	class: "resource-info-tabs",
	role: "tablist"
}, X = ["aria-selected"], Z = ["aria-selected"], Q = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], Ke = { key: 1 }, qe = {
	key: 0,
	class: "sb-selection-position"
}, Je = { key: 2 }, Ye = {
	key: 3,
	class: "sb-preview-selection-actions"
}, Xe = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], Ze = { class: "sb-info-details" }, Qe = {
	key: 0,
	class: "resource-selection-information"
}, $e = { class: "resource-selection-path" }, et = [
	"value",
	"title",
	"aria-label"
], tt = ["title", "aria-label"], nt = {
	key: 1,
	class: "resource-selection-usage"
}, rt = { key: 0 }, it = {
	key: 0,
	class: "resource-language"
}, at = ["src"], ot = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, st = {
	key: 2,
	class: "resource-info-timezone"
}, ct = { key: 1 }, lt = { key: 0 }, ut = { key: 1 }, dt = {
	key: 0,
	class: "resource-info-timezone"
}, ft = { key: 2 }, pt = {
	key: 0,
	class: "resource-info-timezone"
}, mt = { key: 3 }, ht = { key: 4 }, gt = { key: 5 }, _t = { key: 6 }, vt = {
	key: 4,
	class: "resource-info-empty",
	role: "status"
}, yt = ["disabled"], bt = {
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
		canPreview: Boolean,
		selectionOnly: Boolean,
		nativePreview: Boolean,
		address: String,
		selectionPosition: String,
		selectionActions: Array,
		allowAdd: Boolean,
		allowQuickAdd: Boolean,
		addDisabled: Boolean,
		usageMode: {
			type: String,
			default: "readonly"
		}
	},
	emits: [
		"usage-change",
		"preview",
		"selection-action",
		"selection-add"
	],
	setup(n) {
		let r = n, l = _(() => r.address ?? ze(r.resource)), d = L;
		async function f(e) {
			try {
				await navigator.clipboard.writeText(Array.isArray(e) ? e.join("\n") : String(e));
			} catch {
				window.Joomla?.renderMessages?.({ error: [r.t("COM_SMARTBROWSER_COPY_FAILED")] });
			}
		}
		let m = (e) => {
			let t = r.usageValues?.[e.key];
			if (t == null || t === "") return "—";
			if (typeof t == "boolean") return r.t(t ? "JYES" : "JNO");
			let n = e.options?.find((e) => e.value === t);
			return n ? r.t(n.label) : e.type === "resource" ? t.id : typeof t == "object" ? JSON.stringify(t) : String(t);
		}, b = _(() => (r.usageDefinitions || []).filter((e) => !ee([e]).length)), S = e("info"), C = e("usage"), T = (e) => {
			C.value = e, S.value = e;
		}, k = e(!1), j = e(null), M = e(null), N;
		i(() => A(r.resource), () => N?.abort()), u(() => N?.abort()), i(() => !!r.usageDefinitions?.length, (e) => {
			S.value = e ? C.value : "info";
		}, { immediate: !0 }), i(() => r.usageRevision, () => {
			r.usageDefinitions?.length && (S.value = "usage");
		});
		async function P(e) {
			k.value = !0, N = new AbortController();
			let t = N.signal;
			try {
				await e.run({
					...r.previewContext,
					previewElement: r.nativePreview ? M.value : j.value?.element,
					signal: t
				});
			} catch (e) {
				t.aborted || Joomla.renderMessages({ error: [e.message || r.t("COM_SMARTBROWSER_USAGE_INVALID")] });
			} finally {
				k.value = !1;
			}
		}
		let F = _(() => {
			let e = (r.resource?.infoFields?.length ? r.resource.infoFields : r.fields || []).filter((e) => (!e.kinds || e.kinds.includes(r.resource?.kind)) && ![
				"metadata.locationPath",
				"metadata.category",
				"metadata.tags"
			].includes(e.source)), t = new Set(e.map((e) => e.source));
			return [...e, ...Le.filter((e) => {
				let n = r.resource?.metadata?.[e.source.split(".")[1]];
				return !t.has(e.source) && n != null && n !== "";
			})];
		}), te = I, R = _(() => r.selectionOnly ? Ve(r.resource, r.t) : r.resource?.kind === "node" ? r.t("COM_SMARTBROWSER_FOLDER") : r.resource?.type ? r.resource.type.charAt(0).toUpperCase() + r.resource.type.slice(1) : r.t("COM_SMARTBROWSER_RESOURCE")), ne = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, re = (e) => `${(e / 1024).toFixed(2)} KB`, z = (e) => String(e.source || "").split(".").reduce((e, t) => e?.[t], r.resource), B = (e) => (e.format === "language" || e.source === "metadata.language") && z(e) === "*" ? r.t("COM_SMARTBROWSER_ALL_LANGUAGES") : e.format === "date" ? ne(z(e)) : e.format === "size" ? z(e) !== null && z(e) !== void 0 ? re(z(e)) : "" : e.format === "dimensions" ? r.resource?.metadata.width && r.resource?.metadata.height ? `${r.resource.metadata.width}px \u00d7 ${r.resource.metadata.height}px` : "" : z(e), V = (e) => {
			let t = String(e || "").trim().match(/(Z|[+-]\d{2}:?\d{2})$/i);
			if (!t) return "";
			let n = t[1].toUpperCase() === "Z" ? 0 : (t[1].startsWith("-") ? -1 : 1) * (Number(t[1].slice(1, 3)) * 60 + Number(t[1].slice(-2)));
			if (n === -new Date(e).getTimezoneOffset()) return "";
			let i = n >= 0 ? "+" : "-", a = Math.abs(n), o = n === 0 ? "UTC" : `UTC${i}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
			return `${r.t("COM_SMARTBROWSER_SOURCE_TIMEZONE")}: ${o}`;
		};
		return (e, r) => (x(), D("aside", { class: a(["resource-info-panel", {
			"has-usage": n.usageDefinitions?.length,
			"showing-usage": n.usageDefinitions?.length && S.value === "usage",
			"is-empty-selection": n.selectionOnly && !n.resource
		}]) }, [
			n.selectionOnly ? s((x(), D("div", {
				key: 0,
				ref_key: "nativePreviewElement",
				ref: M,
				class: "sb-native-preview-host"
			}, null, 512)), [[w, n.nativePreview]]) : v("", !0),
			n.selectionOnly && !n.resource && !n.nativePreview ? (x(), O(he, {
				key: 1,
				resource: {
					id: "",
					metadata: {}
				},
				definitions: [],
				values: {},
				"content-only": "",
				t: n.t
			}, null, 8, ["t"])) : v("", !0),
			n.selectionOnly && !n.resource ? (x(), D(y, { key: 2 }, [E("h3", null, g(n.t(n.nativePreview ? "COM_SMARTBROWSER_NO_IMAGE_SELECTED" : "COM_SMARTBROWSER_COLLECTION_EMPTY")), 1), n.allowQuickAdd ? (x(), D("div", Y, [E("button", {
				type: "button",
				class: "resource-preview-add",
				disabled: n.addDisabled,
				title: n.t("COM_SMARTBROWSER_COLLECTION_ADD"),
				"aria-label": n.t("COM_SMARTBROWSER_COLLECTION_ADD"),
				onClick: r[0] ||= (t) => e.$emit("selection-add")
			}, [...r[8] ||= [E("span", { class: "fas fa-plus" }, null, -1)]], 8, We)])) : v("", !0)], 64)) : v("", !0),
			n.resource ? (x(), D(y, { key: 3 }, [
				!n.selectionOnly && n.usageDefinitions?.length ? (x(), D("div", Ge, [E("button", {
					type: "button",
					role: "tab",
					"aria-selected": S.value === "usage",
					onClick: r[1] ||= (e) => T("usage")
				}, g(n.t("COM_SMARTBROWSER_USAGE_OPTIONS")), 9, X), E("button", {
					type: "button",
					role: "tab",
					"aria-selected": S.value === "info",
					onClick: r[2] ||= (e) => T("info")
				}, g(n.t("COM_SMARTBROWSER_USAGE_INFO")), 9, Z)])) : v("", !0),
				t(he, {
					ref_key: "previewElement",
					ref: j,
					resource: n.resource,
					definitions: n.usageDefinitions,
					values: n.usageValues,
					errors: n.usageErrors,
					"resolve-reference": n.resolveReference,
					"can-preview": n.canPreview,
					"native-preview": n.nativePreview,
					"content-only": n.selectionOnly || S.value === "usage",
					editable: n.selectionOnly ? n.usageMode === "editable" : S.value === "usage",
					t: n.t,
					onPreview: r[3] ||= (t) => e.$emit("preview"),
					onChange: r[4] ||= (t, n) => e.$emit("usage-change", t, n)
				}, {
					actions: o(() => [(x(!0), D(y, null, c(n.previewActions, (e) => (x(), D("button", {
						key: e.id,
						type: "button",
						disabled: k.value,
						title: n.t(e.label),
						"aria-label": n.t(e.label),
						onClick: (t) => P(e)
					}, [E("span", {
						class: a(e.icon || "fas fa-bolt"),
						"aria-hidden": "true"
					}, null, 2)], 8, Q))), 128))]),
					_: 1
				}, 8, [
					"resource",
					"definitions",
					"values",
					"errors",
					"resolve-reference",
					"can-preview",
					"native-preview",
					"content-only",
					"editable",
					"t"
				]),
				n.selectionOnly ? (x(), D("h3", Ke, [p(g(n.resource.title), 1), n.selectionPosition ? (x(), D("span", qe, " (" + g(n.selectionPosition) + ")", 1)) : v("", !0)])) : (x(), D("h3", Je, g(n.resource.title), 1)),
				n.selectionActions?.length ? (x(), D("div", Ye, [(x(!0), D(y, null, c(n.selectionActions, (r) => (x(), D("button", {
					key: r.id,
					type: "button",
					disabled: r.disabled,
					title: n.t(r.label),
					"aria-label": n.t(r.label),
					class: a({
						"resource-preview-remove": r.id === "collectionRemove",
						"resource-preview-add": r.id === "collectionAdd"
					}),
					onClick: (t) => e.$emit("selection-action", r)
				}, [t(ge, { icon: r.icon }, null, 8, ["icon"])], 10, Xe))), 128))])) : v("", !0),
				E("div", Ze, [
					n.selectionOnly ? (x(), D("dl", Qe, [E("div", null, [E("dt", null, [r[9] ||= E("span", {
						class: "fas fa-link",
						"aria-hidden": "true"
					}, null, -1), p(g(n.t("COM_SMARTBROWSER_URI")), 1)]), E("dd", $e, [E("input", {
						type: "text",
						value: l.value,
						title: l.value,
						"aria-label": n.t("COM_SMARTBROWSER_URI"),
						disabled: ""
					}, null, 8, et), E("button", {
						type: "button",
						title: n.t("COM_SMARTBROWSER_COPY_PATH"),
						"aria-label": n.t("COM_SMARTBROWSER_COPY_PATH"),
						onClick: r[5] ||= (e) => f(l.value)
					}, [...r[10] ||= [E("span", {
						class: "fas fa-copy",
						"aria-hidden": "true"
					}, null, -1)]], 8, tt)])])])) : v("", !0),
					n.selectionOnly && n.usageMode === "readonly" && n.usageDefinitions?.length ? (x(), D("dl", nt, [(x(!0), D(y, null, c(n.usageDefinitions, (e) => (x(), D("div", { key: e.key }, [E("dt", null, [e.key === "media.decorative" ? v("", !0) : (x(), D("span", {
						key: 0,
						class: a(h(d)(e)),
						"aria-hidden": "true"
					}, null, 2)), p(g(n.t(e.label)), 1)]), E("dd", null, g(m(e)), 1)]))), 128))])) : v("", !0),
					n.usageDefinitions?.length && (n.selectionOnly ? n.usageMode === "editable" : S.value === "usage") ? (x(), O(Ie, {
						key: h(A)(n.resource),
						definitions: b.value,
						values: n.usageValues,
						errors: n.usageErrors,
						resource: n.resource,
						t: n.t,
						editors: n.usageEditors,
						"resolve-reference": n.resolveReference,
						onChange: r[6] ||= (t, n) => e.$emit("usage-change", t, n)
					}, null, 8, [
						"definitions",
						"values",
						"errors",
						"resource",
						"t",
						"editors",
						"resolve-reference"
					])) : v("", !0)
				]),
				!n.selectionOnly && !(n.usageDefinitions?.length && S.value === "usage") ? (x(), D(y, { key: 4 }, [n.fields?.length ? (x(), D("dl", rt, [(x(!0), D(y, null, c(F.value, (e) => s((x(), D("div", { key: `${e.source}-${e.label}` }, [
					E("dt", null, [E("span", {
						class: a(h(te)(e)),
						"aria-hidden": "true"
					}, null, 2), p(g(n.t(e.label)), 1)]),
					e.format === "language" ? (x(), D("dd", it, [n.resource.metadata?.languageImage ? (x(), D("img", {
						key: 0,
						src: n.resource.metadata.languageImage,
						alt: "",
						"aria-hidden": "true"
					}, null, 8, at)) : z(e) === "*" ? (x(), D("span", ot)) : v("", !0), E("span", null, g(B(e)), 1)])) : (x(), D("dd", {
						key: 1,
						class: a({
							"resource-info-identifier": e.source === "metadata.alias" || e.source === "metadata.username",
							"resource-info-lines": e.source === "metadata.tagPaths"
						})
					}, g(B(e)), 3)),
					e.format === "date" && V(z(e)) ? (x(), D("small", st, g(V(z(e))), 1)) : v("", !0)
				])), [[w, B(e) !== "" && B(e) !== null && B(e) !== void 0]])), 128))])) : (x(), D("dl", ct, [
					n.resource.parentId ? (x(), D("div", lt, [E("dt", null, [r[11] ||= E("span", {
						class: "fas fa-folder",
						"aria-hidden": "true"
					}, null, -1), p(g(n.t("COM_SMARTBROWSER_FOLDER")), 1)]), E("dd", null, g(n.resource.parentId), 1)])) : v("", !0),
					E("div", null, [E("dt", null, [r[12] ||= E("span", {
						class: "fas fa-file-alt",
						"aria-hidden": "true"
					}, null, -1), p(g(n.t("COM_SMARTBROWSER_TYPE")), 1)]), E("dd", null, g(R.value), 1)]),
					n.resource.metadata.created ? (x(), D("div", ut, [
						E("dt", null, [r[13] ||= E("span", {
							class: "fas fa-calendar",
							"aria-hidden": "true"
						}, null, -1), p(g(n.t("COM_SMARTBROWSER_DATE_CREATED")), 1)]),
						E("dd", null, g(ne(n.resource.metadata.created)), 1),
						V(n.resource.metadata.created) ? (x(), D("small", dt, g(V(n.resource.metadata.created)), 1)) : v("", !0)
					])) : v("", !0),
					n.resource.metadata.modified ? (x(), D("div", ft, [
						E("dt", null, [r[14] ||= E("span", {
							class: "fas fa-calendar",
							"aria-hidden": "true"
						}, null, -1), p(g(n.t("COM_SMARTBROWSER_DATE_MODIFIED")), 1)]),
						E("dd", null, g(ne(n.resource.metadata.modified)), 1),
						V(n.resource.metadata.modified) ? (x(), D("small", pt, g(V(n.resource.metadata.modified)), 1)) : v("", !0)
					])) : v("", !0),
					n.resource.metadata.width && n.resource.metadata.height ? (x(), D("div", mt, [E("dt", null, [r[15] ||= E("span", {
						class: "fas fa-expand",
						"aria-hidden": "true"
					}, null, -1), p(g(n.t("COM_SMARTBROWSER_DIMENSIONS")), 1)]), E("dd", null, g(n.resource.metadata.width) + "px × " + g(n.resource.metadata.height) + "px", 1)])) : v("", !0),
					n.resource.metadata.size ? (x(), D("div", ht, [E("dt", null, [r[16] ||= E("span", {
						class: "fas fa-database",
						"aria-hidden": "true"
					}, null, -1), p(g(n.t("COM_SMARTBROWSER_SIZE")), 1)]), E("dd", null, g(re(n.resource.metadata.size)), 1)])) : v("", !0),
					n.resource.metadata.mimeType ? (x(), D("div", gt, [E("dt", null, [r[17] ||= E("span", {
						class: "fas fa-file-alt",
						"aria-hidden": "true"
					}, null, -1), p(g(n.t("COM_SMARTBROWSER_MIME_TYPE")), 1)]), E("dd", null, g(n.resource.metadata.mimeType), 1)])) : v("", !0),
					n.resource.metadata.extension ? (x(), D("div", _t, [E("dt", null, [r[18] ||= E("span", {
						class: "fas fa-file-alt",
						"aria-hidden": "true"
					}, null, -1), p(g(n.t("COM_SMARTBROWSER_EXTENSION")), 1)]), E("dd", null, g(n.resource.metadata.extension), 1)])) : v("", !0),
					E("div", null, [E("dt", null, [r[19] ||= E("span", {
						class: "fas fa-key",
						"aria-hidden": "true"
					}, null, -1), p(g(n.t("JGLOBAL_FIELD_ID_LABEL")), 1)]), E("dd", null, g(n.resource.metadata.id ?? n.resource.id), 1)])
				]))], 64)) : v("", !0)
			], 64)) : (x(), D("div", vt, [n.allowAdd ? (x(), D("button", {
				key: 0,
				type: "button",
				class: "btn btn-outline-secondary",
				disabled: n.addDisabled,
				onClick: r[7] ||= (t) => e.$emit("selection-add")
			}, [r[20] ||= E("span", { class: "fas fa-plus" }, null, -1), p(" " + g(n.t("COM_SMARTBROWSER_SELECT_RESOURCE")), 1)], 8, yt)) : v("", !0), E("p", null, g(n.t("COM_SMARTBROWSER_SELECTION_INFO_EMPTY")), 1)]))
		], 2));
	}
}, xt = { class: "resource-ordering-moves" }, St = [
	"disabled",
	"title",
	"aria-label"
], Ct = [
	"disabled",
	"title",
	"aria-label"
], wt = {
	__name: "ResourceOrderingControls",
	props: {
		enabled: Boolean,
		t: Function
	},
	emits: ["reorder"],
	setup(e) {
		return (t, n) => (x(), D("span", xt, [E("button", {
			type: "button",
			disabled: !e.enabled,
			title: e.t("COM_SMARTBROWSER_MOVE_UP"),
			"aria-label": e.t("COM_SMARTBROWSER_MOVE_UP"),
			onClick: n[0] ||= (e) => t.$emit("reorder", "up")
		}, [...n[2] ||= [E("span", {
			class: "fas fa-arrow-up",
			"aria-hidden": "true"
		}, null, -1)]], 8, St), E("button", {
			type: "button",
			disabled: !e.enabled,
			title: e.t("COM_SMARTBROWSER_MOVE_DOWN"),
			"aria-label": e.t("COM_SMARTBROWSER_MOVE_DOWN"),
			onClick: n[1] ||= (e) => t.$emit("reorder", "down")
		}, [...n[3] ||= [E("span", {
			class: "fas fa-arrow-down",
			"aria-hidden": "true"
		}, null, -1)]], 8, Ct)]));
	}
}, Tt = "contextual", Et = (e, t) => ({
	...e,
	focusable: e.focusable ?? t.focusable,
	selectable: e.selectable ?? t.selectable,
	bulkSelectable: e.bulkSelectable ?? e.selectable ?? t.bulkSelectable,
	actionable: e.actionable ?? t.actionable,
	navigable: e.navigable ?? t.navigable,
	activatable: e.activatable ?? t.activatable
}), Dt = (e) => Et({
	...e,
	role: e.role || "primary"
}, {
	focusable: !0,
	selectable: !1,
	bulkSelectable: !1,
	actionable: !0,
	navigable: !1,
	activatable: !0
}), Ot = (e) => ({
	...e,
	role: Tt,
	focusable: e.focusable ?? !0,
	selectable: !1,
	bulkSelectable: !1,
	actionable: !1,
	navigable: !1,
	activatable: !1,
	interactiveOverlays: !1,
	capabilities: {}
}), kt = (e) => e?.role === Tt, At = (e) => e?.focusable === !0, $ = (e, t = "both") => e?.selectable === !0 && (t === "both" || e.kind === t), jt = (e, t = "both") => $(e, t) && e?.bulkSelectable === !0, Mt = (e) => e?.actionable === !0, Nt = (e, t, n, r) => ["manage", "select"].includes(t) && Mt(e) && n.find((t) => t.id === "preview" && r(t, [e])) || null;
function Pt(e, t, n, r, i = "both") {
	return e?.kind === "node" ? t === "select" ? $(e, i) ? {
		id: "pickerSelect",
		label: "COM_SMARTBROWSER_SELECT",
		icon: "fas fa-check",
		local: !0
	} : null : t === "manage" && Mt(e) && n.find((t) => t.id === "edit" && r(t, [e])) || null : (["manage", "select"].includes(t) && Mt(e) ? n.find((t) => t.modifiedDefault === !0 && r(t, [e])) : null) || Nt(e, t, n, r);
}
function Ft(e, t, n, r, i = "both") {
	return e?.navigable ? {
		id: "browseOpen",
		label: "COM_SMARTBROWSER_OPEN",
		icon: "fas fa-folder-open",
		local: !0
	} : e?.activatable ? t === "select" ? $(e, i) ? {
		id: "pickerSelect",
		label: "COM_SMARTBROWSER_SELECT",
		icon: "fas fa-check",
		local: !0
	} : null : Mt(e) && n.find((n) => n.id === (t === "manage" ? "edit" : "preview") && r(n, [e])) || null : null;
}
//#endregion
//#region resources/js/core/itemMenuActions.js
var It = (e, t, n, r = null, i = null) => {
	if (!t?.actionable) return r ? [{
		...r,
		isDefault: !0
	}] : [];
	let a = [t], o = [], s = /* @__PURE__ */ new Set();
	for (let r of e || []) {
		if (t.collectionActions && !r.collectionCommand && !t.collectionActions.some((e) => e.id === r.id) || !r.requiresSelection || r.trashedOnly && t.status !== -2 || r.id === "trash" && t.status === -2 || r.id === "checkin" && !n(r, a) || r.id === "removeFromGroup" && !n(r, a)) continue;
		if (!r.exclusiveGroup) {
			o.push(r);
			continue;
		}
		if (s.has(r.exclusiveGroup)) continue;
		s.add(r.exclusiveGroup);
		let i = e.filter((e) => e.requiresSelection && e.exclusiveGroup === r.exclusiveGroup && (e.id !== "trash" || t.status !== -2)), c = i.find((e) => n(e, a)), l = t.overlays?.find((e) => i.some((t) => t.id === e.action))?.action;
		o.push(c || i.find((e) => e.id === l) || i[0]);
	}
	return i && !o.some((e) => e.id === i.id) && i.id !== r?.id && o.push(i), (r ? [{
		...r,
		isDefault: !0
	}, ...o.filter((e) => e.id !== r.id)] : o).map((e) => !e.isDefault && e.id === i?.id ? {
		...e,
		isModified: !0
	} : e);
};
//#endregion
//#region resources/js/core/resourceClickGuard.js
function Lt() {
	let e;
	return {
		click(t, n) {
			(!n?.detail || n.detail === 1) && (e = t);
		},
		accepts(t, n) {
			return n?.type !== "dblclick" || e === t;
		}
	};
}
//#endregion
//#region resources/js/components/ResourceGrid.vue
var Rt = { class: "resource-grid-select-all" }, zt = ["checked", "aria-label"], Bt = [
	"role",
	"tabindex",
	"aria-pressed",
	"onClick",
	"onDblclick",
	"onKeydown"
], Vt = [
	"checked",
	"aria-label",
	"onChange"
], Ht = [
	"aria-expanded",
	"title",
	"onClick"
], Ut = [
	"title",
	"disabled",
	"onClick"
], Wt = { class: "resource-item-visual" }, Gt = {
	key: 0,
	class: "resource-item-overlays"
}, Kt = ["title", "onClick"], qt = ["src"], Jt = ["title"], Yt = ["src"], Xt = ["title"], Zt = ["title"], Qt = { class: "resource-item-metadata-text" }, $t = {
	__name: "ResourceGrid",
	props: {
		defaultAction: Function,
		modifiedAction: Function,
		previewAction: Function,
		selectionControls: {
			type: Boolean,
			default: !0
		},
		resources: Array,
		selectedIds: Array,
		focusedId: String,
		allSelected: Boolean,
		options: Object,
		actions: Array,
		actionAvailable: Function,
		gridFields: Array,
		t: Function
	},
	emits: [
		"select",
		"select-all",
		"focus",
		"open",
		"activate",
		"action"
	],
	setup(r, { emit: i }) {
		let o = r, s = Lt(), l = i, d = (e, t) => {
			if (s.accepts(A(e), t)) {
				if ((t?.ctrlKey || t?.metaKey) && (o.modifiedAction || o.previewAction)) {
					let t = o.modifiedAction ? o.modifiedAction(e) : o.previewAction(e);
					if (t && o.actionAvailable(t, [e])) {
						l("action", t, e);
						return;
					}
				}
				if (o.defaultAction) {
					let t = o.defaultAction(e);
					t && o.actionAvailable(t, [e]) && l("action", t, e);
				} else e.navigable ? l("open", e.id) : e.activatable ? l("activate", e) : l("focus", e);
			}
		}, f = e(null), _ = e(!1), w = e(0), O = async (e, t) => {
			if (f.value === e) {
				f.value = null;
				return;
			}
			let r = t.currentTarget.closest(".resource-browser-item"), i = r?.closest(".resource-browser");
			if (_.value = !1, w.value = i ? Math.max(0, Math.min(360, i.clientWidth - 8, window.innerWidth - 20)) : 0, f.value = e, await n(), f.value !== e || !i) return;
			let a = r.querySelector(".resource-item-menu");
			_.value = a?.getBoundingClientRect().left < i.getBoundingClientRect().left + 4;
		}, k = (e) => It(o.actions, e, o.actionAvailable, o.defaultAction?.(e), (o.modifiedAction || o.previewAction)?.(e)), j = (e, t) => Mt(t) && t.interactiveOverlays !== !1 ? o.actions.find((n) => n.id === e.action && o.actionAvailable(n, [t])) : void 0, M = () => {
			f.value = null;
		}, N = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e), P = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, F = (e) => {
			let t = e.metadata || {}, n = (e, t, n, r = !1) => t ? {
				label: e,
				value: t,
				icon: n,
				identifier: r
			} : null;
			return e.type === "user" ? [n("COM_SMARTBROWSER_USERNAME", t.username, "fas fa-user", !0), n("JGLOBAL_EMAIL", t.email, "fas fa-envelope")].filter(Boolean) : t.alias || t.languageKey || t.menuItemType ? [
				n("COM_SMARTBROWSER_ALIAS_LABEL", t.alias, "fas fa-link", !0),
				n("COM_SMARTBROWSER_MENU_ITEM_TYPE", t.menuItemType, "fas fa-file-alt"),
				n("COM_SMARTBROWSER_LANGUAGE_KEY", t.languageKey, "fas fa-language"),
				e.type === "article" && o.gridFields?.some((e) => e.source === "metadata.cardSummaryWithCategory") ? n("JCATEGORY", t.category, "fas fa-folder") : null
			].filter(Boolean) : e.kind === "item" && t.mimeType ? [n("COM_SMARTBROWSER_MIME_TYPE", t.mimeType, "fas fa-file-alt"), e.type === "image" && t.width > 0 && t.height > 0 ? n("COM_SMARTBROWSER_DIMENSIONS", `${t.width} × ${t.height}`, "fas fa-expand") : null].filter(Boolean) : (e.collectionPresentation?.gridFields || o.gridFields || []).map((t) => n(t.label || "COM_SMARTBROWSER_DETAILS", t.format === "date" ? P(N(e, t.source)) : N(e, t.source), t.icon || "fas fa-info")).filter(Boolean);
		};
		return S(() => document.addEventListener("click", M)), u(() => document.removeEventListener("click", M)), (e, n) => (x(), D("div", { class: a(["resource-browser-grid", `size-${r.options.gridSize}`]) }, [r.selectionControls ? (x(), D("div", {
			key: 0,
			class: a(["resource-view-icons", { active: r.allSelected }])
		}, [E("label", Rt, [E("input", {
			type: "checkbox",
			checked: r.allSelected,
			"aria-label": r.t("COM_SMARTBROWSER_SELECT_ALL"),
			onChange: n[0] ||= (t) => e.$emit("select-all")
		}, null, 40, zt)])], 2)) : v("", !0), (x(!0), D(y, null, c(r.resources, (i) => (x(), D("div", {
			key: h(A)(i),
			class: a(["resource-browser-item", {
				selected: r.selectedIds.includes(h(A)(i)),
				focused: r.focusedId === h(A)(i),
				active: f.value === h(A)(i),
				contextual: h(kt)(i)
			}]),
			role: h(At)(i) ? "button" : void 0,
			tabindex: h(At)(i) ? 0 : void 0,
			"aria-pressed": h($)(i) ? r.selectedIds.includes(h(A)(i)) : void 0,
			onClick: b((t) => {
				h(s).click(h(A)(i), t), f.value = null, e.$emit("select", i, t.ctrlKey || t.metaKey);
			}, ["stop"]),
			onDblclick: b((e) => d(i, e), ["stop"]),
			onKeydown: C(b((e) => d(i), ["prevent"]), ["enter"]),
			onMouseleave: n[3] ||= (e) => f.value = null
		}, [
			r.selectionControls && h($)(i) ? (x(), D("label", {
				key: 0,
				class: a(["resource-item-select", { checked: r.selectedIds.includes(h(A)(i)) }]),
				onClick: n[1] ||= b(() => {}, ["stop"])
			}, [E("input", {
				type: "checkbox",
				checked: r.selectedIds.includes(h(A)(i)),
				"aria-label": i.title,
				onChange: (t) => e.$emit("select", i, !0)
			}, null, 40, Vt)], 2)) : v("", !0),
			k(i).length ? (x(), D("button", {
				key: 1,
				type: "button",
				class: "resource-item-menu-toggle",
				"aria-expanded": f.value === h(A)(i),
				title: r.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: b((t) => {
					e.$emit("focus", i), O(h(A)(i), t);
				}, ["stop"])
			}, [...n[4] ||= [E("span", {
				class: "fas fa-ellipsis-h",
				"aria-hidden": "true"
			}, null, -1)]], 8, Ht)) : v("", !0),
			f.value === h(A)(i) ? (x(), D("div", {
				key: 2,
				class: a(["resource-item-menu", { "align-start": _.value }]),
				style: m(w.value ? { maxWidth: `${w.value}px` } : null),
				onClick: n[2] ||= b(() => {}, ["stop"])
			}, [E("strong", null, g(i.title), 1), (x(!0), D(y, null, c(k(i), (n) => (x(), D("button", {
				key: n.id,
				type: "button",
				class: a([`resource-action-${n.id}`, {
					"resource-default-action": n.isDefault,
					"resource-modified-action": n.isModified
				}]),
				title: n.isDefault ? r.t("COM_SMARTBROWSER_DOUBLE_CLICK") : n.isModified ? r.t("COM_SMARTBROWSER_CTRL_DOUBLE_CLICK") : void 0,
				disabled: !r.actionAvailable(n, [i]),
				onClick: (t) => {
					f.value = null, e.$emit("action", n, i);
				}
			}, [t(ge, { icon: n.icon }, null, 8, ["icon"]), p(" " + g(r.t(n.label)), 1)], 10, Ut))), 128))], 6)) : v("", !0),
			E("span", Wt, [t(T, { resource: i }, null, 8, ["resource"]), i.overlays?.length ? (x(), D("span", Gt, [(x(!0), D(y, null, c(i.overlays, (t) => (x(), D(y, { key: t.id }, [j(t, i) ? (x(), D("button", {
				key: 0,
				type: "button",
				class: a(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label,
				onClick: b((n) => {
					e.$emit("focus", i), e.$emit("action", j(t, i), i);
				}, ["stop"])
			}, [t.image ? (x(), D("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, qt)) : (x(), D("span", {
				key: 1,
				class: a(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, Kt)) : (x(), D("span", {
				key: 1,
				class: a(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label
			}, [t.image ? (x(), D("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, Yt)) : (x(), D("span", {
				key: 1,
				class: a(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, Jt))], 64))), 128))])) : v("", !0)]),
			E("span", {
				class: "resource-item-title",
				title: `${r.t("COM_SMARTBROWSER_NAME")}: ${i.title}`
			}, g(i.title), 9, Xt),
			(x(!0), D(y, null, c(F(i), (e) => (x(), D("span", {
				key: e.label,
				class: a(["resource-item-metadata", { "resource-item-identifier": e.identifier }]),
				title: `${r.t(e.label)}: ${e.value}`
			}, [E("span", {
				class: a(e.icon),
				"aria-hidden": "true"
			}, null, 2), E("span", Qt, g(e.value), 1)], 10, Zt))), 128))
		], 42, Bt))), 128))], 2));
	}
}, en = { class: "table-responsive resource-details-view" }, tn = { class: "table table-hover" }, nn = {
	class: "resource-type-column resource-details-select-column",
	scope: "col"
}, rn = { class: "resource-details-select-controls" }, an = {
	key: 0,
	class: "resource-details-select-all"
}, on = ["checked", "aria-label"], sn = ["title"], cn = [
	"title",
	"aria-label",
	"onClick"
], ln = ["title"], un = [
	"tabindex",
	"aria-current",
	"onClick",
	"onDblclick",
	"onKeydown"
], dn = { class: "resource-type-column" }, fn = [
	"checked",
	"aria-label",
	"onChange"
], pn = ["title"], mn = { class: "resource-cell-ellipsis" }, hn = ["title"], gn = ["title", "onClick"], _n = { class: "visually-hidden" }, vn = ["title"], yn = { class: "visually-hidden" }, bn = {
	key: 1,
	class: "resource-language"
}, xn = ["src"], Sn = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, Cn = { class: "resource-language-name" }, wn = {
	key: 2,
	class: "resource-cell-ellipsis"
}, Tn = {
	key: 3,
	class: "resource-row-overlays"
}, En = ["title", "onClick"], Dn = ["src"], On = ["title"], kn = ["src"], An = { class: "resource-row-actions" }, jn = [
	"aria-expanded",
	"title",
	"onClick"
], Mn = [
	"title",
	"disabled",
	"onClick"
], Nn = {
	__name: "ResourceDetails",
	props: {
		defaultAction: Function,
		modifiedAction: Function,
		previewAction: Function,
		selectionControls: {
			type: Boolean,
			default: !0
		},
		resources: Array,
		selectedIds: Array,
		focusedId: String,
		allSelected: Boolean,
		options: Object,
		actions: Array,
		actionAvailable: Function,
		sortBy: String,
		sortDirection: String,
		sortFields: Array,
		orderingField: String,
		columns: Array,
		t: Function
	},
	emits: [
		"select",
		"select-all",
		"focus",
		"open",
		"activate",
		"sort",
		"action"
	],
	setup(n, { emit: r }) {
		let i = Lt(), o = n, s = r, l = (e, t) => {
			if (i.accepts(A(e), t)) {
				if ((t?.ctrlKey || t?.metaKey) && (o.modifiedAction || o.previewAction)) {
					let t = o.modifiedAction ? o.modifiedAction(e) : o.previewAction(e);
					if (t && o.actionAvailable(t, [e])) {
						s("action", t, e);
						return;
					}
				}
				if (o.defaultAction) {
					let t = o.defaultAction(e);
					t && o.actionAvailable(t, [e]) && s("action", t, e);
				} else e.navigable ? s("open", e.id) : e.activatable ? s("activate", e) : s("focus", e);
			}
		}, d = [
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
		], f = () => [
			"created",
			"modified",
			"both"
		].includes(o.options.detailsDateMode) ? o.options.detailsDateMode : "modified", w = (e) => {
			if (!e.dateGroup) return [e];
			let t = e.fields || [];
			return f() === "both" ? t : t.filter((e) => e.id === f());
		}, O = _(() => (o.columns?.length ? o.columns : d).flatMap(w)), k = _(() => 44 + 24 * Math.max(0, ...(o.resources || []).map((e) => (e.overlays || []).filter((e) => e.id !== "status").length))), j = _(() => Math.max(48, 24 + 8 * Math.max(1, ...(o.resources || []).map((e) => String(e.metadata?.id ?? "").length)))), M = (e) => {
			let t = e.id === "status" && e.overlays ? k.value : e.id === "id" ? j.value : null;
			return t === null ? null : {
				width: `${t}px`,
				minWidth: `${t}px`
			};
		}, N = (e) => e.headerIcon || (Object.hasOwn(F, e.id) ? F[e.id] : "fas fa-info"), P = (e) => e.sortField || e.id, I = (e) => o.t(e.label), L = (e) => (o.sortFields || d).some((t) => t.id === P(e)), ee = (e) => o.sortBy === e ? o.sortDirection === "asc" ? "fas fa-caret-up ms-1" : "fas fa-caret-down ms-1" : "fas fa-sort ms-1", te = (e) => e ? `${(e / 1024).toFixed(2)}KB` : "", R = (e) => e.metadata.width && e.metadata.height ? `${e.metadata.width}px \u00d7 ${e.metadata.height}px` : "", ne = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, re = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e), z = (e, t) => {
			if (t.id === "size") return e.kind === "node" ? "" : te(e.metadata.size);
			if (t.id === "dimension") return R(e);
			let n = t.source || `metadata.${t.id}`, r = re(e, n);
			return t.format === "size" ? te(r) : t.format === "dimensions" ? R(e) : t.format === "date" || ["created", "modified"].includes(t.id) ? ne(r) : t.format === "mediaType" ? o.t({
				folder: "COM_SMARTBROWSER_FOLDER",
				image: "COM_SMARTBROWSER_MEDIA_IMAGE",
				document: "COM_SMARTBROWSER_MEDIA_DOCUMENT",
				video: "COM_SMARTBROWSER_MEDIA_VIDEO",
				audio: "COM_SMARTBROWSER_MEDIA_AUDIO"
			}[r] || "COM_SMARTBROWSER_RESOURCE") : t.format === "language" && r === "*" ? o.t("COM_SMARTBROWSER_ALL_LANGUAGES") : r ?? "";
		}, B = (e, t) => t.id === "location" ? String(e.metadata?.locationPath || z(e, t) || "") : t.format === "status" ? V(e).label : String(z(e, t) || ""), V = (e) => ({
			icon: e.statusPresentation?.icon || "fas fa-question-circle",
			label: e.statusPresentation?.label || z(e, { source: "metadata.stateLabel" }),
			class: `status-${e.statusPresentation?.tone || "neutral"}`
		}), H = (e) => e.overlays?.find((e) => e.id === "status") || {}, U = e(null), ie = (e) => {
			U.value = U.value === e ? null : e;
		}, ae = (e) => It(o.actions, e, o.actionAvailable, o.defaultAction?.(e), (o.modifiedAction || o.previewAction)?.(e)), oe = (e, t) => Mt(t) && t.interactiveOverlays !== !1 ? o.actions.find((n) => n.id === e.action && o.actionAvailable(n, [t])) : void 0, se = () => {
			U.value = null;
		};
		return S(() => document.addEventListener("click", se)), u(() => document.removeEventListener("click", se)), (e, r) => (x(), D("div", en, [E("table", tn, [E("thead", null, [E("tr", null, [
			E("th", nn, [E("span", rn, [n.selectionControls ? (x(), D("label", an, [E("input", {
				type: "checkbox",
				checked: n.allSelected,
				"aria-label": n.t("COM_SMARTBROWSER_SELECT_ALL"),
				onChange: r[0] ||= (t) => e.$emit("select-all")
			}, null, 40, on)])) : v("", !0), n.orderingField ? (x(), D("button", {
				key: 1,
				type: "button",
				class: "resource-ordering-sort",
				title: n.t("JGRID_HEADING_ORDERING"),
				onClick: r[1] ||= (t) => e.$emit("sort", n.orderingField)
			}, [E("span", {
				class: a(ee(n.orderingField)),
				"aria-hidden": "true"
			}, null, 2)], 8, sn)) : v("", !0)])]),
			(x(!0), D(y, null, c(O.value, (t) => (x(), D("th", {
				key: t.id,
				class: a(`resource-column-${t.id}`),
				style: m(M(t)),
				scope: "col"
			}, [L(t) ? (x(), D("button", {
				key: 0,
				type: "button",
				class: "btn btn-link",
				title: I(t),
				"aria-label": I(t),
				onClick: (n) => e.$emit("sort", P(t))
			}, [
				N(t) ? (x(), D("span", {
					key: 0,
					class: a(N(t)),
					"aria-hidden": "true"
				}, null, 2)) : v("", !0),
				E("span", { class: a(["resource-header-text", { "resource-header-primary": ["title", "name"].includes(t.id) }]) }, g(I(t)), 3),
				E("span", {
					class: a(ee(P(t))),
					"aria-hidden": "true"
				}, null, 2)
			], 8, cn)) : (x(), D("span", {
				key: 1,
				class: "resource-column-label",
				title: I(t)
			}, [N(t) ? (x(), D("span", {
				key: 0,
				class: a(N(t)),
				"aria-hidden": "true"
			}, null, 2)) : v("", !0), E("span", { class: a(["resource-header-text", { "resource-header-primary": ["title", "name"].includes(t.id) }]) }, g(t.shortLabel ? n.t(t.shortLabel) : I(t)), 3)], 8, ln))], 6))), 128)),
			r[4] ||= E("th", {
				class: "resource-row-actions",
				scope: "col"
			}, null, -1)
		])]), E("tbody", null, [(x(!0), D(y, null, c(n.resources, (o) => (x(), D("tr", {
			key: h(A)(o),
			class: a({
				selected: n.selectedIds.includes(h(A)(o)),
				focused: n.focusedId === h(A)(o),
				focusable: h(At)(o),
				contextual: h(kt)(o)
			}),
			tabindex: h(At)(o) ? 0 : void 0,
			"aria-current": n.focusedId === h(A)(o) ? "true" : void 0,
			onClick: b((t) => {
				h(i).click(h(A)(o), t), U.value = null, e.$emit("select", o, t.ctrlKey || t.metaKey);
			}, ["stop"]),
			onDblclick: b((e) => l(o, e), ["stop"]),
			onKeydown: C(b((e) => l(o), ["prevent"]), ["enter"])
		}, [
			E("td", dn, [t(T, {
				resource: o,
				variant: "compact",
				"allow-image": n.options.detailsThumbnails
			}, null, 8, ["resource", "allow-image"]), n.selectionControls && h($)(o) ? (x(), D("label", {
				key: 0,
				class: a(["resource-row-select", { checked: n.selectedIds.includes(h(A)(o)) }]),
				onClick: r[2] ||= b(() => {}, ["stop"])
			}, [E("input", {
				type: "checkbox",
				checked: n.selectedIds.includes(h(A)(o)),
				"aria-label": o.title,
				onChange: (t) => e.$emit("select", o, !0)
			}, null, 40, fn)], 2)) : v("", !0)]),
			E("th", {
				class: "resource-title-cell",
				scope: "row",
				title: o.title
			}, [E("span", mn, g(o.title), 1)], 8, pn),
			(x(!0), D(y, null, c(O.value.slice(1), (t) => (x(), D("td", {
				key: t.id,
				class: a(`resource-column-${t.id}`),
				style: m(M(t)),
				title: B(o, t)
			}, [E("span", { class: a(["resource-cell-content", { "resource-status-group": t.format === "status" }]) }, [t.format === "status" && o.statusPresentation ? (x(), D(y, { key: 0 }, [oe(H(o), o) ? (x(), D("button", {
				key: 0,
				type: "button",
				class: a(["resource-status-icon", V(o).class]),
				title: V(o).label,
				onClick: b((t) => {
					e.$emit("focus", o), e.$emit("action", oe(H(o), o), o);
				}, ["stop"])
			}, [E("span", {
				class: a(V(o).icon),
				"aria-hidden": "true"
			}, null, 2), E("span", _n, g(V(o).label), 1)], 10, gn)) : (x(), D("span", {
				key: 1,
				class: a(["resource-status-icon", V(o).class]),
				title: V(o).label
			}, [E("span", {
				class: a(V(o).icon),
				"aria-hidden": "true"
			}, null, 2), E("span", yn, g(V(o).label), 1)], 10, vn))], 64)) : t.format === "language" ? (x(), D("span", bn, [o.metadata.languageImage ? (x(), D("img", {
				key: 0,
				src: o.metadata.languageImage,
				alt: ""
			}, null, 8, xn)) : o.metadata.language === "*" ? (x(), D("span", Sn)) : v("", !0), E("span", Cn, g(z(o, t)), 1)])) : (x(), D("span", wn, g(z(o, t)), 1)), t.overlays && o.overlays?.length ? (x(), D("span", Tn, [(x(!0), D(y, null, c(o.overlays.filter((e) => e.id !== "status"), (t) => (x(), D(y, { key: t.id }, [oe(t, o) ? (x(), D("button", {
				key: 0,
				type: "button",
				class: a(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label,
				onClick: b((n) => {
					e.$emit("focus", o), e.$emit("action", oe(t, o), o);
				}, ["stop"])
			}, [t.image ? (x(), D("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, Dn)) : (x(), D("span", {
				key: 1,
				class: a(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, En)) : (x(), D("span", {
				key: 1,
				class: a(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label
			}, [t.image ? (x(), D("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, kn)) : (x(), D("span", {
				key: 1,
				class: a(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, On))], 64))), 128))])) : v("", !0)], 2)], 14, hn))), 128)),
			E("td", An, [ae(o).length ? (x(), D("button", {
				key: 0,
				type: "button",
				class: "resource-row-menu-toggle",
				"aria-expanded": U.value === h(A)(o),
				title: n.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: b((t) => {
					e.$emit("focus", o), ie(h(A)(o));
				}, ["stop"])
			}, [...r[5] ||= [E("span", {
				class: "fas fa-ellipsis-h",
				"aria-hidden": "true"
			}, null, -1)]], 8, jn)) : v("", !0), U.value === h(A)(o) ? (x(), D("div", {
				key: 1,
				class: "resource-item-menu resource-row-menu",
				onClick: r[3] ||= b(() => {}, ["stop"])
			}, [E("strong", null, g(o.title), 1), (x(!0), D(y, null, c(ae(o), (r) => (x(), D("button", {
				key: r.id,
				type: "button",
				class: a([`resource-action-${r.id}`, {
					"resource-default-action": r.isDefault,
					"resource-modified-action": r.isModified
				}]),
				title: r.isDefault ? n.t("COM_SMARTBROWSER_DOUBLE_CLICK") : r.isModified ? n.t("COM_SMARTBROWSER_CTRL_DOUBLE_CLICK") : void 0,
				disabled: !n.actionAvailable(r, [o]),
				onClick: (t) => {
					U.value = null, e.$emit("action", r, o);
				}
			}, [t(ge, { icon: r.icon }, null, 8, ["icon"]), p(" " + g(n.t(r.label)), 1)], 10, Mn))), 128))])) : v("", !0)])
		], 42, un))), 128))])])]));
	}
};
//#endregion
//#region resources/js/services/ResourceApi.js
function Pn(e, t = 0, n = (e) => e) {
	let r = e?.messages && typeof e.messages == "object" ? Object.values(e.messages).flat() : [], i = [...new Set([e?.message, ...r].filter((e) => typeof e == "string" && e.trim()).map((e) => e.trim()))];
	return i.length ? i.join("; ") : t === 413 ? n("COM_SMARTBROWSER_ERROR_REQUEST_TOO_LARGE") : t ? n("COM_SMARTBROWSER_ERROR_REQUEST_HTTP").replace("%s", String(t)) : n("COM_SMARTBROWSER_ERROR_REQUEST_NETWORK");
}
var Fn = class {
	constructor(e) {
		this.options = e, this.pending = /* @__PURE__ */ new Map();
	}
	async getResources(e, t = {}) {
		let n = new URL(`${this.options.apiBaseUrl}&task=api.resources&adapter=${encodeURIComponent(this.options.adapter)}`);
		return n.searchParams.set("mode", this.options.mode || "manage"), this.options.browseRoot && n.searchParams.set("browseRoot", this.options.browseRoot), this.options.flatScope && n.searchParams.set("flatScope", this.options.flatScope), n.searchParams.set("node", e), this.options.adapterOptions && n.searchParams.set("adapterOptions", JSON.stringify(this.options.adapterOptions)), t.search && n.searchParams.set("search", t.search), t.sortBy && n.searchParams.set("sortBy", t.sortBy), t.sortDirection && n.searchParams.set("sortDirection", t.sortDirection), t.filters && n.searchParams.set("filters", JSON.stringify(t.filters)), n.searchParams.set("showContextResources", this.options.showContextResources ? "1" : "0"), this.options.selectionItems ? this.request(n, {
			method: "POST",
			body: JSON.stringify({
				items: this.options.selectionItems(),
				[this.options.csrfToken]: 1
			})
		}) : this.request(n);
	}
	async execute(e, t = [], n = {}) {
		let r = new URL(`${this.options.apiBaseUrl}&task=api.action&adapter=${encodeURIComponent(this.options.adapter)}`);
		return this.options.adapterOptions && r.searchParams.set("adapterOptions", JSON.stringify(this.options.adapterOptions)), r.searchParams.set("mode", this.options.mode || "manage"), this.options.browseRoot && r.searchParams.set("browseRoot", this.options.browseRoot), this.options.flatScope && r.searchParams.set("flatScope", this.options.flatScope), this.request(r, {
			method: "POST",
			body: JSON.stringify({
				action: e,
				selection: t,
				payload: n,
				[this.options.csrfToken]: 1
			})
		});
	}
	collection(e, t = {}) {
		let n = new URL(this.options.apiBaseUrl, window.location.href);
		return n.searchParams.set("task", "api.collection"), this.options.adapter && n.searchParams.set("adapter", this.options.adapter), n.searchParams.set("mode", this.options.mode || "manage"), this.options.browseRoot && n.searchParams.set("browseRoot", this.options.browseRoot), this.options.flatScope && n.searchParams.set("flatScope", this.options.flatScope), this.request(n, {
			method: "POST",
			body: JSON.stringify({
				...this.options.maxSelections ? { maxSelections: this.options.maxSelections } : {},
				...t,
				items: e,
				[this.options.csrfToken]: 1
			})
		});
	}
	request(e, t = {}) {
		let n;
		return new Promise((r, i) => {
			n = Joomla.request({
				url: e.toString(),
				method: t.method || "GET",
				data: t.body,
				headers: { "Content-Type": "application/json" },
				onSuccess: (e) => {
					let t;
					try {
						t = JSON.parse(e);
					} catch (e) {
						i(e);
						return;
					}
					if (t.data?.authenticationRequired) this.redirectToLogin(t.data.loginUrl), i(Error(t.message));
					else if (t.success === !1) {
						let e = Error(Pn(t, Number(t.code) || 0, (e) => Joomla.Text?._(e, e) || e));
						e.status = Number(t.code) || 0, i(e);
					} else r(t.data);
				},
				onError: (e) => {
					let t = null;
					try {
						t = JSON.parse(e.responseText || e.response), (e.status === 401 || t.data?.authenticationRequired) && this.redirectToLogin(t.data?.loginUrl);
					} catch {
						e.status === 401 && this.redirectToLogin();
					}
					let n = Pn(t, Number(e.status) || 0, (e) => Joomla.Text?._(e, e) || e), r = Error(n);
					r.status = Number(e.status) || 0, i(r);
				}
			}), n && this.pending.set(n, i);
		}).finally(() => this.pending.delete(n));
	}
	destroy() {
		for (let [e, t] of this.pending) e.abort?.(), t(/* @__PURE__ */ Error("SmartBrowser request cancelled."));
		this.pending.clear();
	}
	redirectToLogin(e = null) {
		let t = e || this.options.loginUrl;
		t && window.top.location.assign(t);
	}
}, In = ["aria-label", "aria-busy"], Ln = { class: "resource-browser" }, Rn = {
	key: 0,
	class: "alert alert-danger",
	role: "alert"
}, zn = {
	key: 0,
	class: "sb-collection-count"
}, Bn = ["aria-expanded"], Vn = { class: "sb-selected-list" }, Hn = { class: "resource-toolbar sb-collection-toolbar" }, Un = ["disabled", "aria-label"], Wn = [
	"disabled",
	"title",
	"aria-label"
], Gn = [
	"disabled",
	"title",
	"aria-label"
], Kn = [
	"disabled",
	"title",
	"aria-label"
], qn = ["aria-label", "value"], Jn = { value: "collectionOrder" }, Yn = ["value"], Xn = ["title", "aria-label"], Zn = [
	"title",
	"aria-label",
	"aria-pressed",
	"onClick"
], Qn = [
	"data-info-state",
	"aria-pressed",
	"title",
	"aria-label"
], $n = ["disabled", "aria-label"], er = { class: "sb-selected-content" }, tr = {
	key: 0,
	class: "resource-empty-state sb-selection-empty",
	role: "status"
}, nr = ["disabled"], rr = {
	key: 0,
	class: "sb-selected-panel"
}, ir = {
	key: 0,
	class: "sb-selection-gallery-nav"
}, ar = ["disabled", "aria-label"], or = ["disabled", "aria-label"], sr = ["aria-label", "aria-valuenow"], cr = {
	key: 1,
	class: "sb-collection-count"
}, lr = {
	__name: "CollectionView",
	props: {
		model: Object,
		api: Object,
		config: Object,
		t: Function
	},
	setup(n) {
		let r = n, o = r.model.browser.state, l = _(() => r.config.selectedResources && r.config.informationPanel !== !1), f = `${r.config.viewPreferenceKey || "supjx.smartbrowser.collection.view"}.${r.config.multiple === !1 ? "single" : "multiple"}-layout`, T = {};
		try {
			T = JSON.parse(localStorage.getItem(f) || "{}") || {};
		} catch {}
		let k = e(!l.value || T.listOpen === !0), j = e([
			"side",
			"vertical",
			"hidden"
		].includes(T.infoState) ? T.infoState : r.config.informationPanelOpen === !1 ? "hidden" : T.sideInfo === !0 ? "side" : "vertical");
		function N() {
			j.value = {
				vertical: "side",
				side: "hidden",
				hidden: "vertical"
			}[j.value];
		}
		i(k, (e) => {
			l.value && !e && (j.value = "vertical");
		}, { immediate: !0 }), i([k, j], () => {
			if (l.value) try {
				localStorage.setItem(f, JSON.stringify({
					listOpen: k.value,
					infoState: j.value
				}));
			} catch {}
		});
		let F = _(() => !r.config.readOnly && typeof r.config.onAdd == "function"), I = e(!1), L = _(() => (r.model.revision?.value, He(r.config, r.model.getItems().length) && !I.value && !o.loading && !o.busy));
		async function R() {
			if (L.value) {
				I.value = !0;
				try {
					await r.config.onAdd();
				} catch (e) {
					r.config.onError?.(e);
				} finally {
					I.value = !1;
				}
			}
		}
		o.sortBy = "collectionOrder", o.sortDirection = "asc", o.viewOptions.gridSize = r.config.gridSize || "md", o.viewOptions.detailsThumbnails = r.config.thumbnails !== !1;
		let re = new P(r.api, o, () => r.model.refresh(), r.t, r.config.editorMode || "modal", r.config.application), z = /* @__PURE__ */ new Map(), B = (e) => {
			if (!e.adapter) return re;
			if (!z.has(e.adapter)) {
				let t = new Fn({
					...r.config,
					adapter: e.adapter,
					mode: r.config.readOnly ? "readonly" : "manage"
				});
				z.set(e.adapter, {
					api: t,
					driver: new P(t, o, () => r.model.refresh(), r.t, r.config.editorMode || "modal", r.config.application)
				});
			}
			return z.get(e.adapter).driver;
		}, V = [
			"edit",
			"preview",
			"download",
			"publish",
			"unpublish",
			"archive",
			"unarchive",
			"trash",
			"restore",
			"checkin",
			"feature",
			"unfeature",
			"share"
		], H = _(() => [
			...r.model.canRemove ? [{
				id: "collectionRemove",
				label: "COM_SMARTBROWSER_COLLECTION_REMOVE",
				icon: "fas fa-minus",
				requiresSelection: !0,
				collectionCommand: !0
			}] : [],
			...!r.config.readOnly && typeof r.config.onReplace == "function" ? [{
				id: "collectionReplace",
				label: "COM_SMARTBROWSER_COLLECTION_REPLACE",
				icon: "arrow-down-up-across-line",
				requiresSelection: !0,
				collectionCommand: !0
			}] : [],
			...r.config.readOnly ? [] : (r.config.resourceActions || []).map((e) => ({
				...e,
				collectionCommand: !0
			})),
			...r.config.contextActions === !0 && !r.config.readOnly ? o.actions.filter((e) => (r.config.contextActionIds || V).includes(e.id)) : []
		]), U = _(() => H.value.find((e) => e.id === "collectionReplace")), ie = _(() => !l.value || k.value ? [] : [
			...r.config.multiple !== !1 && r.model.canOrder ? [{
				id: "collectionMoveUp",
				label: "COM_SMARTBROWSER_MOVE_UP",
				icon: "fas fa-arrow-up",
				disabled: Q.value <= 0 || o.busy || o.loading
			}, {
				id: "collectionMoveDown",
				label: "COM_SMARTBROWSER_MOVE_DOWN",
				icon: "fas fa-arrow-down",
				disabled: Q.value < 0 || Q.value >= X.value.length - 1 || o.busy || o.loading
			}] : [],
			...F.value ? [{
				id: "collectionAdd",
				label: "COM_SMARTBROWSER_COLLECTION_ADD",
				icon: "fas fa-plus",
				disabled: !L.value
			}] : [],
			...H.value.filter((e) => ["collectionRemove", "collectionReplace"].includes(e.id)).map((e) => ({
				...e,
				disabled: !Z.value || !W(e, [Z.value])
			}))
		]), ae = _(() => Z.value?.collectionActions?.find((e) => e.id === "preview" && B(Z.value).available(e, [Z.value])) || ue(Z.value)), se = (e) => e.id === "collectionReplace" || (r.config.resourceActions || []).some((t) => t.id === e.id), ce = (e, t) => t.collectionActions?.find((t) => t.id === e.id) || e, W = (e, t) => !o.loading && !o.busy && (e.id === "collectionRemove" ? r.model.canRemove : !t.some((e) => e.unavailable) && (se(e) ? !r.config.readOnly : t.every((t) => (!t.collectionActions || t.collectionActions.some((t) => t.id === e.id)) && B(t).available(ce(e, t), [t])))), le = (e) => H.value.find((t) => t.id === r.config.defaultResourceActionId && W(t, [e])) || (r.config.contextActions === !0 && !r.config.readOnly ? Ft({
			...e,
			activatable: !e.unavailable
		}, "manage", H.value, W) : null), ue = (e) => r.config.contextActions === !0 && !r.config.readOnly ? Nt(e, "manage", H.value, W) : null;
		async function de(e, t) {
			if (e?.id === "collectionAdd") return R();
			if (["collectionMoveUp", "collectionMoveDown"].includes(e?.id)) return !t || e.disabled ? void 0 : r.model.move(e.id === "collectionMoveUp" ? "up" : "down", [A(t)]);
			if (t && W(e, [t])) {
				if (e.id === "collectionRemove") return r.model.remove(qe.value.includes(A(t)) ? qe.value : [A(t)]);
				try {
					await (e.id === "collectionReplace" ? r.config.onReplace(t) : se(e) ? r.config.onResourceAction?.(e, t) : B(t).execute(ce(e, t), [t]));
				} catch (e) {
					r.config.onError?.(e);
				}
			}
		}
		let fe = _(() => (o.presentation.sortFields || [{
			id: "title",
			label: "COM_SMARTBROWSER_NAME"
		}]).filter((e) => !["ordering", "collectionOrder"].includes(e.id))), pe = (e) => {
			o.sortBy === e ? o.sortDirection = o.sortDirection === "asc" ? "desc" : "asc" : (o.sortBy = e, o.sortDirection = "asc");
		}, me = [{
			id: "grid",
			label: "COM_SMARTBROWSER_GRID",
			icon: "fas fa-th"
		}, {
			id: "details",
			label: "COM_SMARTBROWSER_DETAILS",
			icon: "fas fa-list"
		}], he = _(() => r.model.browser.bulkSelectableResources.value.length > 0 && r.model.browser.bulkSelectableResources.value.every((e) => o.selectedIds.includes(A(e)))), _e = e(null), G = e(0), ve = e(null), ye = e(!1), be = e(!1), xe = e(!1);
		function Se() {
			let e = ve.value;
			e && (ye.value = e.scrollWidth > e.clientWidth + 2, be.value = e.scrollLeft > 1, xe.value = e.scrollLeft + e.clientWidth < e.scrollWidth - 1);
		}
		function Ce(e) {
			ve.value.scrollBy({
				left: e * 260,
				behavior: "smooth"
			});
		}
		let K = _(() => l.value && !k.value || j.value !== "hidden"), we = _(() => r.config.informationPanelVerticalPosition || (["top", "bottom"].includes(r.config.informationPanelPosition) ? r.config.informationPanelPosition : "top")), Te = _(() => r.config.informationPanelHorizontalPosition || (["left", "right"].includes(r.config.informationPanelPosition) ? r.config.informationPanelPosition : "right")), q = _(() => l.value ? k.value ? j.value === "side" && G.value >= 640 ? Te.value : we.value : "top" : Ue(r.config.informationPanelPosition, G.value)), Ee = _(() => ["top", "bottom"].includes(q.value)), J = e(0), De = _(() => J.value && K.value && ["left", "right"].includes(q.value) ? { gridTemplateColumns: q.value === "left" ? `${Oe(J.value)}px minmax(0, 1fr)` : `minmax(0, 1fr) ${Oe(J.value)}px` } : void 0), Oe = (e) => Math.max(200, Math.min(e, G.value - 200)), ke;
		function Ae(e) {
			e.button === 0 && (e.preventDefault(), ke = {
				x: e.clientX,
				width: e.currentTarget.parentElement.getBoundingClientRect().width
			}, e.currentTarget.setPointerCapture(e.pointerId));
		}
		function je(e) {
			ke && (J.value = Oe(ke.width + (e.clientX - ke.x) * (q.value === "left" ? 1 : -1)));
		}
		function Me() {
			ke = null;
		}
		function Ne(e) {
			J.value = Oe((J.value || G.value * .32) + e * (q.value === "left" ? 1 : -1));
		}
		let Pe = _(() => r.config.readOnly ? "readonly" : r.config.selectionUseData || "readonly"), Fe = window.SmartBrowserPicker?.extensions?.() || {
			editors: {},
			previewActions: []
		}, Ie = e(Fe.previewActions), Le = window.SmartBrowserPicker?.subscribePreviewActions?.((e) => {
			Ie.value = e;
		});
		u(() => Le?.());
		let ze = /* @__PURE__ */ new Map();
		async function Ve(e, t = {}) {
			let n = JSON.stringify([e.adapter, t.browseRoot || ""]);
			return ze.has(n) || ze.set(n, new Fn({
				...r.config,
				adapter: e.adapter,
				mode: "select",
				browseRoot: t.browseRoot || null,
				flatScope: null
			})), (await ze.get(n).collection([e.id])).resources[0];
		}
		let Y = (e) => (r.model.revision?.value, r.model.getItems().find((t) => t.selection && M(t.selection) === A(e))?.usage || {}), We = _(() => (r.model.revision?.value, oe({
			profile: r.config.selectionProfile || {},
			initialUsage: Object.fromEntries(r.model.resources.value.map((e) => [A(e), Y(e)])),
			editors: Fe.editors,
			resolveReference: Ve
		}))), Ge = e({}), X = _(() => r.model.resources.value.map((e) => r.config.selectedResources ? Re({
			...e,
			icon: te(e, Y(e)),
			effectiveThumbnail: Ge.value[A(e)]
		}, o.presentation) : e)), Z = _(() => X.value.find((e) => A(e) === o.focusedId) || X.value[0] || null), Q = _(() => X.value.findIndex((e) => A(e) === A(Z.value)));
		function Ke(e) {
			let t = X.value[Q.value + e];
			t && r.model.browser.focus(t);
		}
		let qe = _(() => o.selectedIds), Je = _(() => r.config.multiple === !1 ? X.value.map(A) : qe.value);
		i(() => r.config.multiple === !1 ? A(X.value[0]) : null, (e) => {
			e && (o.selectedIds = [e]);
		}, { immediate: !0 });
		let Ye = _(() => Pe.value === "hidden" ? [] : We.value.definitions(Z.value).filter((e) => e.presentation !== "hidden")), Xe = _(() => ({
			...Y(Z.value),
			...We.value.get(Z.value)
		})), Ze = e({});
		function Qe(e, t) {
			r.model.browser.toggle(e, t);
		}
		async function $e(e, t) {
			let n = Z.value;
			if (!n || Pe.value !== "editable") return;
			let i = We.value;
			i.set(n, e, t);
			let a = {
				...Y(n),
				...i.get(n)
			};
			r.model.setUsage(n, a);
			let o = await i.validate([n]);
			A(Z.value) === A(n) && (Ze.value = o.errors[A(n)] || {});
		}
		let et = _(() => {
			let e = Z.value;
			return {
				resource: e,
				profile: r.config.selectionProfile || {},
				values: Xe.value,
				getValues: () => ({
					...Y(e),
					...We.value.get(e)
				}),
				setAddress: (e) => {
					r.config.nativeAddress = String(e || "");
				},
				setValue: (t, n) => {
					if (A(Z.value) === A(e)) return $e(t, n);
				},
				refresh: () => r.model.refresh(),
				selectResource: (e) => window.SmartBrowserPicker.open(e)
			};
		}), tt = _(() => Pe.value === "editable" ? Ie.value.filter((e) => {
			try {
				return Z.value && (!e.applies || e.applies(et.value));
			} catch {
				return !1;
			}
		}) : []), nt, rt = 0;
		return i(() => [r.model.resources.value, r.model.revision?.value], async () => {
			let e = ++rt, t = {};
			for (let e of r.model.resources.value) {
				let n = Y(e), r = ee(We.value.definitions(e)).find((e) => n[e.key]);
				if (r) try {
					t[A(e)] = await ne(r, n[r.key], Ve);
				} catch {}
			}
			e === rt && (Ge.value = t);
		}, { immediate: !0 }), S(() => {
			nt = new ResizeObserver(() => {
				G.value = _e.value.getBoundingClientRect().width, Se();
			}), nt.observe(_e.value), nt.observe(ve.value);
		}), u(() => {
			nt?.disconnect(), rt++, ze.forEach((e) => e.destroy());
		}), u(() => {
			re.destroy(), z.forEach(({ driver: e, api: t }) => {
				e.destroy(), t.destroy();
			});
		}), (e, r) => (x(), D("section", {
			ref_key: "control",
			ref: _e,
			class: a(["smartbrowser smartbrowser-collection", {
				"is-compact": n.config.layout === "compact",
				"is-selected-resources": n.config.selectedResources,
				"is-single-selection": l.value && ["top", "bottom"].includes(q.value)
			}]),
			"aria-label": n.t("COM_SMARTBROWSER_COLLECTION_TITLE"),
			"aria-busy": h(o).loading || h(o).busy
		}, [E("div", Ln, [
			h(o).error ? (x(), D("p", Rn, g(h(o).error), 1)) : v("", !0),
			E("div", {
				class: a(["sb-selected-layout", [`panel-${q.value}`, {
					"panel-open": K.value && n.config.informationPanel !== !1,
					"is-collapsed": l.value && !k.value
				}]]),
				style: m(k.value ? De.value : void 0)
			}, [E("div", { class: a(["sb-selected-items", `view-${h(o).activeView}`]) }, [l.value ? (x(), D("div", zn, [E("button", {
				type: "button",
				class: "sb-collection-count-toggle",
				"aria-expanded": k.value,
				onClick: r[0] ||= (e) => k.value = !k.value
			}, [E("span", { class: a(k.value ? "fas fa-chevron-up" : "fas fa-chevron-down") }, null, 2), p(g(n.t("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": " + g(n.model.getItems().length), 1)], 8, Bn)])) : v("", !0), s(E("div", Vn, [E("header", Hn, [
				s(E("button", {
					class: "resource-icon-button sb-toolbar-scroll",
					type: "button",
					disabled: !be.value,
					"aria-label": n.t("COM_SMARTBROWSER_SCROLL_BACK"),
					onClick: r[1] ||= (e) => Ce(-1)
				}, [...r[14] ||= [E("span", { class: "fas fa-chevron-left" }, null, -1)]], 8, Un), [[w, ye.value]]),
				E("div", {
					ref_key: "toolbar",
					ref: ve,
					class: "resource-view-controls",
					onScroll: Se
				}, [
					n.model.canOrder ? (x(), O(wt, {
						key: 0,
						enabled: !h(o).loading && !h(o).busy && h(o).selectedIds.length > 0 && h(o).sortBy === "collectionOrder",
						t: n.t,
						onReorder: n.model.move
					}, null, 8, [
						"enabled",
						"t",
						"onReorder"
					])) : v("", !0),
					F.value ? (x(), D("button", {
						key: 1,
						class: "resource-icon-button",
						type: "button",
						disabled: !L.value,
						title: n.t(n.config.addLabel || "COM_SMARTBROWSER_COLLECTION_ADD"),
						"aria-label": n.t(n.config.addLabel || "COM_SMARTBROWSER_COLLECTION_ADD"),
						onClick: R
					}, [...r[15] ||= [E("span", {
						class: "fas fa-plus",
						"aria-hidden": "true"
					}, null, -1)]], 8, Wn)) : v("", !0),
					n.model.canRemove ? (x(), D("button", {
						key: 2,
						class: "resource-icon-button",
						type: "button",
						disabled: !Je.value.length || h(o).loading || h(o).busy,
						title: n.t("COM_SMARTBROWSER_COLLECTION_REMOVE"),
						"aria-label": n.t("COM_SMARTBROWSER_COLLECTION_REMOVE"),
						onClick: r[2] ||= (e) => n.model.remove(Je.value)
					}, [...r[16] ||= [E("span", {
						class: "fas fa-minus",
						"aria-hidden": "true"
					}, null, -1)]], 8, Gn)) : v("", !0),
					U.value ? (x(), D("button", {
						key: 3,
						class: "resource-icon-button",
						type: "button",
						disabled: !Z.value || !W(U.value, [Z.value]),
						title: n.t(U.value.label),
						"aria-label": n.t(U.value.label),
						onClick: r[3] ||= (e) => de(U.value, Z.value)
					}, [t(ge, { icon: U.value.icon }, null, 8, ["icon"])], 8, Kn)) : v("", !0),
					r[18] ||= E("span", { class: "sb-collection-extra-buttons" }, null, -1),
					n.config.layout !== "compact" && !n.config.selectedResources ? (x(), D(y, { key: 4 }, [E("select", {
						"aria-label": n.t("COM_SMARTBROWSER_SORT_BY"),
						value: h(o).sortBy,
						onChange: r[4] ||= (e) => h(o).sortBy = e.target.value
					}, [E("option", Jn, g(n.t("JGRID_HEADING_ORDERING")), 1), (x(!0), D(y, null, c(fe.value, (e) => (x(), D("option", {
						key: e.id,
						value: e.id
					}, g(n.t(e.label)), 9, Yn))), 128))], 40, qn), E("button", {
						class: "resource-icon-button",
						type: "button",
						title: n.t("COM_SMARTBROWSER_SORT_DIRECTION"),
						"aria-label": n.t("COM_SMARTBROWSER_SORT_DIRECTION"),
						onClick: r[5] ||= (e) => h(o).sortDirection = h(o).sortDirection === "asc" ? "desc" : "asc"
					}, [E("span", {
						class: a(h(o).sortDirection === "asc" ? "fas fa-sort-amount-up" : "fas fa-sort-amount-down-alt"),
						"aria-hidden": "true"
					}, null, 2)], 8, Xn)], 64)) : v("", !0),
					(x(), D(y, null, c(me, (e) => E("button", {
						key: e.id,
						class: a(["resource-icon-button", { active: h(o).activeView === e.id }]),
						type: "button",
						title: n.t(e.label),
						"aria-label": n.t(e.label),
						"aria-pressed": h(o).activeView === e.id,
						onClick: (t) => h(o).activeView = e.id
					}, [E("span", {
						class: a(e.icon),
						"aria-hidden": "true"
					}, null, 2)], 10, Zn)), 64)),
					n.config.informationPanel !== !1 && n.config.selectedResources ? (x(), D("button", {
						key: 5,
						class: a(["resource-icon-button", {
							active: j.value === "side",
							"info-vertical": j.value === "vertical"
						}]),
						type: "button",
						"data-info-state": j.value,
						"aria-pressed": K.value,
						title: n.t("COM_SMARTBROWSER_USAGE_INFO"),
						"aria-label": n.t("COM_SMARTBROWSER_USAGE_INFO"),
						onClick: N
					}, [...r[17] ||= [E("span", {
						class: "fas fa-info-circle",
						"aria-hidden": "true"
					}, null, -1)]], 10, Qn)) : v("", !0)
				], 544),
				s(E("button", {
					class: "resource-icon-button sb-toolbar-scroll",
					type: "button",
					disabled: !xe.value,
					"aria-label": n.t("COM_SMARTBROWSER_SCROLL_FORWARD"),
					onClick: r[6] ||= (e) => Ce(1)
				}, [...r[19] ||= [E("span", { class: "fas fa-chevron-right" }, null, -1)]], 8, $n), [[w, ye.value]])
			]), E("div", er, [n.model.resources.value.length ? (x(), O(d(h(o).activeView === "details" ? Nn : $t), {
				key: 1,
				resources: X.value,
				"selected-ids": qe.value,
				"focused-id": h(o).focusedId,
				"all-selected": he.value,
				"selection-controls": n.config.multiple !== !1,
				options: h(o).viewOptions,
				actions: H.value,
				"action-available": W,
				"default-action": le,
				"preview-action": ue,
				"grid-fields": h(o).presentation.gridFields || [],
				columns: n.config.selectedResources ? h(Be) : h(o).presentation.columns || [{
					id: "title",
					label: "COM_SMARTBROWSER_NAME"
				}],
				"sort-by": h(o).sortBy,
				"sort-direction": h(o).sortDirection,
				"sort-fields": n.config.selectedResources ? [] : fe.value,
				"ordering-field": n.config.selectedResources ? void 0 : "collectionOrder",
				t: n.t,
				onSelect: Qe,
				onSelectAll: n.model.browser.selectAll,
				onFocus: n.model.browser.focus,
				onAction: de,
				onSort: pe
			}, null, 40, [
				"resources",
				"selected-ids",
				"focused-id",
				"all-selected",
				"selection-controls",
				"options",
				"actions",
				"grid-fields",
				"columns",
				"sort-by",
				"sort-direction",
				"sort-fields",
				"ordering-field",
				"t",
				"onSelectAll",
				"onFocus"
			])) : (x(), D("div", tr, [E("span", null, g(n.t(h(o).loading ? "COM_SMARTBROWSER_LOADING" : "COM_SMARTBROWSER_COLLECTION_EMPTY")), 1), F.value && (!K.value || !Ee.value) ? (x(), D("button", {
				key: 0,
				type: "button",
				class: "btn btn-outline-secondary",
				disabled: !L.value,
				onClick: R
			}, [r[20] ||= E("span", { class: "fas fa-plus" }, null, -1), p(" " + g(n.t("COM_SMARTBROWSER_SELECT_RESOURCE")), 1)], 8, nr)) : v("", !0)]))])], 512), [[w, !l.value || k.value]])], 2), n.config.selectedResources && n.config.informationPanel !== !1 ? s((x(), D("div", rr, [
				n.config.multiple !== !1 && ["top", "bottom"].includes(q.value) && X.value.length > 1 ? (x(), D("div", ir, [E("button", {
					type: "button",
					class: "resource-icon-button",
					disabled: Q.value <= 0,
					"aria-label": n.t("COM_SMARTBROWSER_PREVIOUS_RESOURCE"),
					onClick: r[7] ||= (e) => Ke(-1)
				}, [...r[21] ||= [E("span", { class: "fas fa-chevron-left" }, null, -1)]], 8, ar), E("button", {
					type: "button",
					class: "resource-icon-button",
					disabled: Q.value >= X.value.length - 1,
					"aria-label": n.t("COM_SMARTBROWSER_NEXT_RESOURCE"),
					onClick: r[8] ||= (e) => Ke(1)
				}, [...r[22] ||= [E("span", { class: "fas fa-chevron-right" }, null, -1)]], 8, or)])) : v("", !0),
				k.value && ["left", "right"].includes(q.value) ? (x(), D("div", {
					key: 1,
					class: "sb-panel-resize",
					role: "separator",
					tabindex: "0",
					"aria-orientation": "vertical",
					"aria-label": n.t("COM_SMARTBROWSER_RESIZE_INFO"),
					"aria-valuenow": Math.round(J.value || G.value * .32),
					onPointerdown: Ae,
					onPointermove: je,
					onPointerup: Me,
					onPointercancel: Me,
					onKeydown: [r[9] ||= C(b((e) => Ne(-16), ["prevent"]), ["left"]), r[10] ||= C(b((e) => Ne(16), ["prevent"]), ["right"])],
					onDblclick: r[11] ||= (e) => J.value = 0
				}, null, 40, sr)) : v("", !0),
				n.config.selectedResources && n.config.informationPanel !== !1 ? s((x(), O(bt, {
					key: 2,
					"selection-only": "",
					resource: Z.value,
					fields: h(o).presentation.infoFields,
					t: n.t,
					address: n.config.nativeAddress,
					"usage-mode": Pe.value,
					"usage-definitions": Ye.value,
					"usage-values": Xe.value,
					"usage-errors": Ze.value,
					"usage-editors": h(Fe).editors,
					"resolve-reference": Ve,
					"preview-actions": tt.value,
					"selection-actions": ie.value,
					"allow-add": F.value && Ee.value,
					"allow-quick-add": F.value && Ee.value && !k.value,
					"selection-position": n.config.multiple !== !1 && X.value.length > 1 ? `${Q.value + 1}/${X.value.length}` : "",
					"add-disabled": !L.value,
					"can-preview": !!ae.value,
					"preview-context": et.value,
					"native-preview": n.config.nativePreview,
					onSelectionAdd: R,
					onSelectionAction: r[12] ||= (e) => de(e, Z.value),
					onPreview: r[13] ||= (e) => de(ae.value, Z.value),
					onUsageChange: $e
				}, null, 8, [
					"resource",
					"fields",
					"t",
					"address",
					"usage-mode",
					"usage-definitions",
					"usage-values",
					"usage-errors",
					"usage-editors",
					"preview-actions",
					"selection-actions",
					"allow-add",
					"allow-quick-add",
					"selection-position",
					"add-disabled",
					"can-preview",
					"preview-context",
					"native-preview"
				])), [[w, K.value]]) : v("", !0)
			], 512)), [[w, K.value]]) : v("", !0)], 6),
			n.config.showCount !== !1 && !l.value ? (x(), D("footer", cr, g(n.t("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": " + g(n.model.getItems().length), 1)) : v("", !0)
		])], 10, In));
	}
}, ur = (e, t) => (n, r) => {
	let i = (t) => e === "title" ? String(t.title || "").toLocaleLowerCase() : e === "dimension" ? (t.metadata?.width || 0) * (t.metadata?.height || 0) : t.metadata?.[e], a = i(n), o = i(r), s = typeof a == "string" ? (a || "").localeCompare(o || "") : (a || 0) - (o || 0);
	return t === "asc" ? s : -s;
};
//#endregion
//#region resources/js/core/createBrowserState.js
function dr({ options: e, api: t, persistence: n, viewRegistry: r }) {
	let a = e.pickerContext || e.selectionHost, o = !!a?.collectionMode, s = (o || e.mode === "select") && e.multiple === !1 ? 1 : a?.maxSelections ?? e.maxSelections ?? 500, c = o ? a.getCollectionSnapshot() : null, l = !!(o || e.selectionState || e.pickerContext && (Object.keys(e.pickerContext.selectionProfile || {}).length || e.pickerContext.initialSelection?.length)), u = e.adapter?.replace(/^flat-/, ""), d = (e) => o ? {
		...e,
		adapter: u,
		selection: {
			adapter: u,
			id: e.id
		},
		selectionKey: M({
			adapter: u,
			id: e.id
		})
	} : e, f = (t) => o && e.multiple && a.homogeneous && v.selectedIds.length && (v.selectedResources[v.selectedIds[0]]?.selection?.adapter || c.items.find((e) => M(e.selection) === v.selectedIds[0])?.selection.adapter) !== t.selection?.adapter, p = new Set(e.allowedResourceTypes || []), m = (t) => e.mode === "readonly" || f(t) || p.size && !p.has(t.type) ? {
		...t,
		selectable: !1,
		bulkSelectable: !1
	} : t, h = {
		selectedNode: e.currentNode || e.initialNode || e.roots[0]?.id || "",
		activeView: e.defaultView || "grid",
		viewOptions: {
			gridSize: "md",
			detailsThumbnails: !1,
			detailsDateMode: "modified"
		},
		hiddenColumns: [],
		shownColumns: [],
		sortBy: e.defaultSortBy || "",
		sortDirection: e.defaultSortDirection || "",
		showInfo: !1,
		filters: {}
	}, g = n.load(h);
	g.filters = {
		...g.filters || {},
		...e.initialFilters || {}
	}, Array.isArray(g.hiddenColumns) || (g.hiddenColumns = []), Array.isArray(g.shownColumns) || (g.shownColumns = []), e.currentNode && (g.selectedNode = e.currentNode), e.defaultView && (g.activeView = e.defaultView), r.has(g.activeView) || (g.activeView = "grid");
	let v = k({
		...g,
		roots: e.roots,
		nodes: [],
		items: [],
		contextItems: [],
		breadcrumb: [],
		actions: e.actions,
		presentation: e.presentation || {},
		currentResource: null,
		focusedId: null,
		selectedIds: c ? c.items.map((e) => M(e.selection)) : [],
		selectedResources: c?.resources || {},
		virtualResources: c?.virtualResources || {},
		search: "",
		loading: !1,
		busy: !1,
		error: ""
	}), y = _(() => {
		let t = v.search.trim().toLocaleLowerCase(), n = (e) => !t || [
			e.title,
			e.subtitle,
			e.metadata?.alias
		].some((e) => String(e || "").toLocaleLowerCase().includes(t)), r = v.nodes.map(d).map(Dt).map(m).filter(n), i = (v.presentation.selectionScoped && e.selectionState ? Object.values(v.virtualResources).filter((e) => e && (e.selection?.adapter || e.adapter || u) === u && e.parentId === v.selectedNode) : v.items).map(d).map(Dt).map(m).filter(n), a = v.contextItems.map(Ot);
		return v.sortBy ? [
			...r.sort(ur(v.sortBy, v.sortDirection)),
			...i.sort(ur(v.sortBy, v.sortDirection)),
			...a
		] : [
			...r,
			...i,
			...a
		];
	}), b = _(() => {
		let t = e.selectionTarget || "both";
		return y.value.filter((e) => $(e, t));
	}), x = _(() => {
		let t = e.selectionTarget || "both";
		return y.value.filter((e) => jt(e, t));
	}), S = _(() => l ? v.selectedIds.map((e) => y.value.find((t) => A(t) === e) || v.selectedResources[e]).filter(Boolean) : y.value.filter((e) => v.selectedIds.includes(A(e)))), C = _(() => y.value.find((e) => A(e) === v.focusedId) || (l ? v.selectedResources[v.focusedId] : null) || null);
	async function w(n = v.selectedNode) {
		v.loading = !0, v.error = "", l || (v.selectedIds = []), v.focusedId = null;
		try {
			let r = await t.getResources(n, {
				search: v.search,
				sortBy: v.sortBy,
				sortDirection: v.sortDirection,
				filters: v.filters
			});
			if (v.selectedNode = n, v.nodes = r.nodes, v.items = r.items, r.presentation?.selectionScoped) for (let e of r.items) {
				let t = d(e);
				v.virtualResources[A(t)] = Dt(t);
			}
			if (l) for (let e of [...r.nodes, ...r.items]) {
				let t = d(e);
				v.selectedIds.includes(A(t)) && (v.selectedResources[A(t)] = m(Dt(t)));
			}
			v.contextItems = r.contextItems || [], v.breadcrumb = r.breadcrumb, v.actions = e.mode === "readonly" ? [] : r.actions, v.presentation = r.presentation || v.presentation, v.sortBy && !(v.presentation.sortFields || []).some((e) => e.id === v.sortBy) && (v.sortBy = "", v.sortDirection = ""), (v.presentation.filters || []).forEach((e) => {
				v.filters[e.id] === void 0 && (v.filters[e.id] = e.default);
			}), v.currentResource = r.currentResource || null;
			let i = new URL(window.location.href);
			i.searchParams.set("node", n), window.history.replaceState({}, "", i);
		} catch (t) {
			if (n !== e.initialNode && [403, 404].includes(t.status)) {
				v.selectedNode = e.initialNode, await w(e.initialNode);
				return;
			}
			v.error = t.message, Joomla.renderMessages({ error: [t.message] });
		} finally {
			v.loading = !1;
		}
	}
	function T(t, n = !0) {
		if (E(t), !$(t, e.selectionTarget || "both") || f(t)) return;
		let r = A(t);
		l && (v.selectedResources[r] = t);
		let i = v.selectedIds.includes(r);
		!i && e.multiple && n && v.selectedIds.length >= s || (!e.multiple || !n ? v.selectedIds = i ? [] : [r] : v.selectedIds = i ? v.selectedIds.filter((e) => e !== r) : [...v.selectedIds, r]);
	}
	function E(e) {
		At(e) && (v.focusedId = A(e));
	}
	function D() {
		l && x.value.forEach((e) => {
			v.selectedResources[A(e)] = e;
		});
		let t = x.value.map(A);
		if (o && !e.multiple) {
			let e = t[0];
			v.selectedIds = e && !v.selectedIds.includes(e) ? [e] : [];
			return;
		}
		let n = v.selectedIds.filter((e) => !t.includes(e)).length, r = Math.min(t.length, Math.max(0, s - n)), i = r > 0 && t.filter((e) => v.selectedIds.includes(e)).length >= r;
		v.selectedIds = i ? v.selectedIds.filter((e) => !t.includes(e)) : [.../* @__PURE__ */ new Set([...v.selectedIds, ...t])].slice(0, s);
	}
	function O() {
		l && x.value.forEach((e) => {
			v.selectedResources[A(e)] = e;
		});
		let e = x.value.map(A), t = new Set(v.selectedIds);
		e.forEach((e) => t.has(e) ? t.delete(e) : t.add(e)), v.selectedIds = [...t].slice(0, s);
	}
	i(() => [
		v.selectedNode,
		v.activeView,
		v.viewOptions,
		v.hiddenColumns,
		v.shownColumns,
		v.sortBy,
		v.sortDirection,
		v.showInfo,
		v.filters
	], () => n.save(v), { deep: !0 });
	function j(t, n) {
		if (e.multiple && v.selectedIds.length >= s || !e.selectionState || e.mode === "readonly" || e.selectionTarget === "node" || p.size && !p.has(n)) return !1;
		let r = v.selectedResources[v.selectedIds[0]]?.selection?.adapter || c?.items.find((e) => M(e.selection) === v.selectedIds[0])?.selection.adapter;
		return !(e.multiple && a?.homogeneous && r && r !== t);
	}
	function N(t) {
		return !(!e.selectionState || e.mode === "readonly" || e.selectionTarget === "node" || p.size && !p.has(t));
	}
	function P(t, n = null) {
		let r = t.adapter || u, i = {
			adapter: r,
			id: t.id
		}, a = o ? M(i) : t.id, s = n ? A(n) : null;
		if (n && !v.selectedIds.includes(s) && !v.virtualResources[s]) throw Error("COM_SMARTBROWSER_LINK_SELECTION_FULL");
		if ((v.selectedIds.includes(a) || v.virtualResources[a]) && a !== s) throw Error("COM_SMARTBROWSER_LINK_DUPLICATE");
		if (t.uniquenessId) for (let e of /* @__PURE__ */ new Set([...v.selectedIds, ...Object.keys(v.virtualResources)])) {
			if (e === s) continue;
			let n = v.virtualResources[e] || v.selectedResources[e], i = n?.selection || (n ? {
				adapter: n.adapter || u,
				id: n.id
			} : c?.items.find((t) => M(t.selection) === e)?.selection);
			if (i?.adapter === r && (i.id === t.uniquenessId || i.id.startsWith(t.uniquenessId + "."))) throw Error("COM_SMARTBROWSER_LINK_DUPLICATE");
		}
		if (!n && !N(t.type)) throw Error("COM_SMARTBROWSER_LINK_SELECTION_FULL");
		let l = Dt({
			...t,
			adapter: r,
			...o ? {
				selection: i,
				selectionKey: a
			} : {}
		});
		return v.selectedResources[a] = l, v.virtualResources[a] = l, v.selectedIds = n ? v.selectedIds.map((e) => e === s ? a : e) : j(r, t.type) ? e.multiple ? [...v.selectedIds, a] : [a] : v.selectedIds, s && s !== a && (delete v.selectedResources[s], delete v.virtualResources[s]), v.focusedId = a, l;
	}
	function F(e) {
		for (let t of e) {
			let e = A(t);
			v.virtualResources[e] && (v.selectedIds = v.selectedIds.filter((t) => t !== e), delete v.selectedResources[e], delete v.virtualResources[e], v.focusedId === e && (v.focusedId = null));
		}
	}
	return t.options && e.selectionState && (t.options.selectionItems = () => [.../* @__PURE__ */ new Set([...v.selectedIds, ...Object.keys(v.virtualResources)])].map((e) => {
		let t = v.virtualResources[e] || v.selectedResources[e];
		return t ? {
			selection: t.selection || {
				adapter: t.adapter || u,
				id: t.id
			},
			usage: {}
		} : c?.items.find((t) => M(t.selection) === e);
	}).filter(Boolean)), {
		state: v,
		resources: y,
		selectableResources: b,
		bulkSelectableResources: x,
		selection: S,
		focusedResource: C,
		load: w,
		focus: E,
		toggle: T,
		selectAll: D,
		invertSelection: O,
		canAddSelection: j,
		canCreateSelectionResource: N,
		replaceSelectionResource: P,
		deleteVirtualResources: F
	};
}
//#endregion
//#region resources/js/core/viewRegistry.js
var fr = () => {
	let e = /* @__PURE__ */ new Map();
	return {
		register(t) {
			if (!t.id || !t.component) throw TypeError("A view requires an id and component.");
			return e.set(t.id, Object.freeze({
				supportsSize: !1,
				controls: [],
				options: {},
				...t
			})), this;
		},
		get(t) {
			return e.get(t);
		},
		all() {
			return Array.from(e.values());
		},
		has(t) {
			return e.has(t);
		}
	};
}, pr = (e) => {
	if (!Array.isArray(e)) throw TypeError("Collection items must be an array.");
	let t = e.map((e) => e && typeof e == "object" ? e.id : e);
	if (t.some((e) => !["string", "number"].includes(typeof e) || String(e) === "")) throw TypeError("Invalid collection identifier.");
	return [...new Set(t.map(String))];
};
function mr({ config: t, api: n, notify: r, translate: i }) {
	let a = t.referenceItems === !0 || !t.adapter || (t.items || []).some((e) => e?.selection || e?.adapter), o = (e) => a ? N(e, t) : pr(e), s = (e) => a ? M(e.selection) : e, c = () => a ? JSON.parse(JSON.stringify(y)) : [...y], l = f(), u = t.viewPreferenceKey || "supjx.smartbrowser.collection.view", d;
	try {
		d = window.localStorage.getItem(u);
	} catch {}
	let p = ["grid", "details"].includes(d) ? d : t.layout === "compact" ? "details" : t.layout || "grid", m = k({
		...t,
		roots: [],
		actions: [],
		multiple: t.multiple !== !1,
		selectionTarget: "both",
		mode: t.readOnly ? "readonly" : "manage",
		defaultView: p
	}), h = {
		load: (e) => e,
		save(e) {
			try {
				window.localStorage.setItem(u, e.activeView);
			} catch {}
		}
	}, g = l.run(() => dr({
		options: m,
		api: n,
		persistence: h,
		viewRegistry: fr().register({
			id: "grid",
			component: {}
		}).register({
			id: "details",
			component: {}
		})
	})), { state: v } = g, y = o(t.items || []), b = 0, x = !1, S = e(0), C = !t.readOnly, w = C && t.allowRemove !== !1, T = C && t.allowOrdering !== !1, E = (e) => e.map((e) => ({
		...e,
		selectable: C && (w || T),
		bulkSelectable: C && (w || T),
		focusable: !0,
		actionable: C,
		navigable: !1,
		activatable: !1,
		interactiveOverlays: C && t.contextActions === !0,
		capabilities: {
			...e.capabilities,
			collectionRemove: w
		}
	})), D = (e) => r({
		adapter: t.adapter,
		mode: "collection",
		items: c(),
		resources: [...v.items],
		reason: e
	});
	async function O() {
		if (x) return;
		let e = ++b;
		v.loading = !0, v.error = "";
		try {
			let r = await n.collection(y, a ? {
				referenceItems: !0,
				homogeneous: t.homogeneous === !0
			} : void 0);
			if (x || e !== b) return;
			let i = new Map(a ? y.map((e) => [s(e), e.usage]) : []);
			y = a ? o(r.items).map((e) => ({
				...e,
				usage: i.get(s(e)) || e.usage
			})) : [...r.identifiers], S.value++, v.items = E(r.resources), v.actions = [...r.actions || [], ...v.items.flatMap((e) => e.collectionActions || [])].filter((e, t, n) => n.findIndex((t) => t.id === e.id) === t && e.requiresSelection && !e.currentNode && ![
				"reorder",
				"removeFromGroup",
				"batch",
				"activate",
				"select"
			].includes(e.id)), v.presentation = r.presentation || {}, m.visualSettings = r.visualSettings, m.imageBackground = r.imageBackground, v.selectedIds = v.selectedIds.filter((e) => y.some((t) => s(t) === e));
		} catch (t) {
			if (!x && e === b) throw v.error = t.message, t;
		} finally {
			!x && e === b && (v.loading = !1);
		}
	}
	async function j(e) {
		if (x) throw Error("Collection is destroyed.");
		let t = o(e), n = a && t.length === y.length && t.every((e, t) => s(e) === s(y[t]));
		y = t, S.value++, (!n || v.items.length !== y.length || v.error) && (v.selectedIds = [], v.items = [], v.sortBy = "collectionOrder", v.sortDirection = "asc", await O());
	}
	function P(e) {
		if (!w || x || v.loading || v.busy) return;
		++b;
		let t = new Set(e), n = y.filter((e) => !t.has(s(e)));
		n.length !== y.length && (y = n, S.value++, v.items = v.items.filter((e) => !t.has(A(e))), v.selectedIds = v.selectedIds.filter((e) => !t.has(e)), D("remove"));
	}
	async function F(e, r = v.selectedIds) {
		if (!T || x || v.busy || v.loading || !r.length || !["up", "down"].includes(e) || v.sortBy && v.sortBy !== "collectionOrder") return;
		let i = ++b;
		v.busy = !0;
		try {
			let c = v.sortDirection === "desc" ? e === "up" ? "down" : "up" : e, l = await n.collection(y, {
				...a ? {
					referenceItems: !0,
					homogeneous: t.homogeneous === !0
				} : {},
				operation: "reorder",
				selection: [...r],
				direction: c
			});
			if (x || i !== b) return;
			y = o(l.items), S.value++;
			let u = new Map(v.items.map((e) => [A(e), e]));
			v.items = y.map((e) => u.get(s(e))).filter(Boolean), D("reorder");
		} catch (e) {
			!x && i === b && (v.error = e.message);
		} finally {
			x || (v.busy = !1);
		}
	}
	return {
		options: m,
		browser: g,
		resources: l.run(() => _(() => v.sortBy === "collectionOrder" ? v.sortDirection === "desc" ? [...v.items].reverse() : v.items : g.resources.value)),
		canRemove: w,
		canOrder: T,
		refresh: O,
		setItems: j,
		remove: P,
		move: F,
		revision: S,
		setUsage(e, t) {
			if (!C || x || !a || v.loading || v.busy) return;
			let n = A(e);
			y = y.map((e) => s(e) === n ? {
				...e,
				usage: JSON.parse(JSON.stringify(t))
			} : e), S.value++, D("usage");
		},
		getItems: c,
		async addItems(e) {
			await j(o([...y, ...e])), D("add");
		},
		destroy() {
			x = !0, b++, n.destroy?.(), l.stop();
		}
	};
}
//#endregion
export { Fn as a, Ft as c, Dt as d, $ as f, oe as h, lr as i, Pt as l, bt as m, fr as n, Nn as o, wt as p, dr as r, $t as s, mr as t, Nt as u };
