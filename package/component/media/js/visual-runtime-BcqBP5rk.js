import { E as e, I as t, R as n, T as r, V as i, c as a, d as o, f as s, h as c, k as l, l as u, m as d, p as f, s as p, u as m, z as h } from "./visual-runtime-CJIQlqNK.js?v=5.2.0";
import { t as g } from "./visual-runtime-9kQymmoE.js?v=5.2.0";
//#region resources/js/core/personalPreferences.js
var _ = "supjx.smartbrowser.personal", v = [
	"categories",
	"tags",
	"menus"
], y = Object.freeze({
	editorMode: "inherit",
	contextItems: "inherit",
	integration: "inherit",
	pickerStateScope: "caller",
	pickerNodeScope: "caller"
}), b = {
	editorMode: [
		"inherit",
		"modal",
		"page"
	],
	contextItems: [
		"inherit",
		"show",
		"hide"
	],
	integration: [
		"inherit",
		"smartbrowser",
		"native"
	],
	pickerStateScope: ["caller", "adapter"],
	pickerNodeScope: ["caller", "adapter"]
};
function x(e = g()) {
	let t;
	try {
		t = JSON.parse(e?.getItem("supjx.smartbrowser.personal") || "{}");
	} catch {}
	return S(t);
}
function S(e = {}) {
	let t = Object.fromEntries(Object.entries(y).map(([t, n]) => [t, b[t].includes(e?.[t]) ? e[t] : n]));
	return t.contextItemsByAdapter = Object.fromEntries(v.map((n) => [n, b.contextItems.includes(e?.contextItemsByAdapter?.[n]) ? e.contextItemsByAdapter[n] : t.contextItems])), t;
}
var C = (e, t) => e.contextItemsByAdapter?.[t?.replace(/^flat-/, "")] || e.contextItems || "inherit";
function w(e, t = x(), n = "state") {
	return t[n === "node" ? "pickerNodeScope" : "pickerStateScope"] === "adapter" ? "shared" : encodeURIComponent(e.pickerContext?.viewPreferenceKey || e.selectionHost?.viewPreferenceKey || e.viewPreferenceKey || "default");
}
var T = (e, t = g()) => `supjx.smartbrowser.nodes.${e.mode === "manage" && !e.pickerInstance && !e.pickerContext ? "manage" : "picker." + w(e, x(t), "node")}.${e.adapter.replace(/^flat-/, "")}`;
async function E(e, t = g()) {
	let n = S(e);
	if (t.setItem(_, JSON.stringify(n)), t.flush && !await t.flush()) throw Error("COM_SMARTBROWSER_PERSONAL_SAVE_FAILED");
	return n;
}
//#endregion
//#region resources/js/components/PersonalPreferencesDialog.vue
var D = ["title", "aria-label"], O = ["aria-labelledby"], k = { class: "sb-personal-heading" }, A = ["id"], j = [
	"aria-expanded",
	"aria-controls",
	"title",
	"aria-label"
], M = { class: "sb-personal-help-label" }, N = ["id"], P = {
	key: 0,
	class: "sb-personal-group-title"
}, F = [
	"value",
	"onChange",
	"disabled",
	"aria-describedby"
], I = ["value"], L = ["id"], R = ["id"], z = {
	key: 0,
	role: "alert",
	class: "alert alert-danger"
}, B = {
	key: 1,
	role: "status"
}, V = { class: "sb-personal-buttons" }, H = ["disabled"], U = ["disabled"], W = { class: "sb-personal-buttons" }, G = ["disabled"], K = ["disabled"], q = {
	__name: "PersonalPreferencesDialog",
	props: {
		t: Function,
		currentView: Boolean,
		adapter: String
	},
	emits: ["saved", "reset-view"],
	setup(_, { emit: y }) {
		let b = _, S = y, C = l(), w = t(null), T = t(x()), q = t(!1), J = t(""), Y = t(""), X = t(!1);
		function Z(e) {
			let t = "COM_SMARTBROWSER_PERSONAL_CONTEXT_" + e.toUpperCase(), n = b.t(t);
			return n === t ? b.t("COM_SMARTBROWSER_ADAPTER_" + e.toUpperCase()) : n;
		}
		function Q(e, t) {
			let n = b.t("COM_SMARTBROWSER_PERSONAL_VALUE_" + t.toUpperCase());
			if (t !== "inherit") return n;
			let r = window.Joomla?.getOptions?.("com_smartbrowser.preferences", {})?.globalDefaults || {}, i = e.adapter ? r.contextItemsByAdapter?.[e.adapter] || r.contextItems : r[e.key];
			return i ? `${n} (${b.t("COM_SMARTBROWSER_PERSONAL_VALUE_" + i.toUpperCase())})` : n;
		}
		let $ = m(() => [
			{
				key: "editorMode",
				label: "COM_SMARTBROWSER_PERSONAL_EDITOR",
				values: [
					"inherit",
					"modal",
					"page"
				]
			},
			...v.filter((e) => !b.adapter || e === b.adapter.replace(/^flat-/, "")).map((e) => ({
				key: "contextItemsByAdapter." + e,
				adapter: e,
				label: "COM_SMARTBROWSER_PERSONAL_CONTEXT",
				values: [
					"inherit",
					"show",
					"hide"
				]
			})),
			{
				key: "integration",
				label: "COM_SMARTBROWSER_PERSONAL_INTEGRATION",
				values: [
					"inherit",
					"smartbrowser",
					"native"
				]
			},
			{
				key: "pickerStateScope",
				label: "COM_SMARTBROWSER_PERSONAL_STATE_SCOPE",
				values: ["caller", "adapter"]
			},
			{
				key: "pickerNodeScope",
				label: "COM_SMARTBROWSER_PERSONAL_NODE_SCOPE",
				values: ["caller", "adapter"]
			}
		]), ee = m(() => [
			{
				id: "general",
				fields: $.value.filter((e) => ["editorMode", "integration"].includes(e.key))
			},
			{
				id: "remember",
				fields: $.value.filter((e) => ["pickerStateScope", "pickerNodeScope"].includes(e.key))
			},
			{
				id: "context",
				fields: $.value.filter((e) => e.adapter)
			}
		].filter((e) => e.fields.length));
		function te() {
			T.value = x(), J.value = "", Y.value = "", w.value.showModal();
		}
		async function ne() {
			q.value = !0, J.value = "";
			try {
				let e = await E(T.value);
				S("saved", e), w.value.close();
			} catch (e) {
				J.value = window.Joomla?.Text?._(e.message, e.message) || e.message;
			} finally {
				q.value = !1;
			}
		}
		async function re() {
			q.value = !0, J.value = "";
			try {
				let e = g();
				e.reset ? await e.reset() : Array.from({ length: e.length }, (t, n) => e.key(n)).filter((e) => e?.startsWith("supjx.smartbrowser.") || e?.startsWith("smartbrowser.")).forEach((t) => e.removeItem(t)), T.value = x(), S("reset-view"), S("saved", T.value), w.value.close();
			} catch (e) {
				J.value = e.message;
			} finally {
				q.value = !1;
			}
		}
		return (t, l) => (r(), d(a, null, [o("button", {
			type: "button",
			class: "btn btn-outline-secondary sb-personal-preferences-button",
			title: _.t("COM_SMARTBROWSER_PERSONAL_TITLE"),
			"aria-label": _.t("COM_SMARTBROWSER_PERSONAL_TITLE"),
			onClick: te
		}, [...l[4] ||= [o("span", {
			class: "fas fa-sliders-h",
			"aria-hidden": "true"
		}, null, -1)]], 8, D), (r(), s(u, { to: "body" }, [o("dialog", {
			ref_key: "dialog",
			ref: w,
			class: "sb-personal-preferences",
			"aria-labelledby": n(C),
			onClose: l[3] ||= (e) => q.value = !1
		}, [o("form", { onSubmit: p(ne, ["prevent"]) }, [
			o("div", k, [o("h2", { id: n(C) }, i(_.t("COM_SMARTBROWSER_PERSONAL_TITLE")), 9, A), o("button", {
				type: "button",
				class: "btn btn-outline-secondary",
				"aria-expanded": X.value,
				"aria-controls": n(C) + "-help",
				title: _.t("JINLINEHELP"),
				"aria-label": _.t("JINLINEHELP"),
				onClick: l[0] ||= (e) => X.value = !X.value
			}, [
				l[5] ||= o("span", {
					class: "fas fa-question-circle",
					"aria-hidden": "true"
				}, null, -1),
				l[6] ||= c(),
				o("span", M, i(_.t("JINLINEHELP")), 1)
			], 8, j)]),
			o("p", null, i(_.t("COM_SMARTBROWSER_PERSONAL_DESCRIPTION")), 1),
			o("div", { id: n(C) + "-help" }, [(r(!0), d(a, null, e(ee.value, (t) => (r(), d("section", {
				key: t.id,
				class: h(["sb-personal-group", {
					"sb-personal-context-group": t.id === "context",
					"has-single-field": t.fields.length === 1
				}])
			}, [
				t.id === "context" ? (r(), d("h3", P, i(_.t("COM_SMARTBROWSER_PERSONAL_CONTEXT")), 1)) : f("", !0),
				(r(!0), d(a, null, e(t.fields, (t) => (r(), d("label", {
					key: t.key,
					class: "sb-personal-field"
				}, [
					o("span", null, i(t.adapter ? Z(t.adapter) : _.t(t.label)), 1),
					o("select", {
						value: t.adapter ? T.value.contextItemsByAdapter[t.adapter] : T.value[t.key],
						onChange: (e) => t.adapter ? T.value.contextItemsByAdapter[t.adapter] = e.target.value : T.value[t.key] = e.target.value,
						class: "form-select",
						disabled: q.value,
						"aria-describedby": X.value ? t.adapter ? n(C) + "-context-help" : n(C) + "-" + t.key : void 0
					}, [(r(!0), d(a, null, e(t.values, (e) => (r(), d("option", {
						key: e,
						value: e
					}, i(Q(t, e)), 9, I))), 128))], 40, F),
					X.value && !t.adapter ? (r(), d("small", {
						key: 0,
						id: n(C) + "-" + t.key,
						class: h(["form-text", { "sb-personal-integration-help": t.key === "integration" }])
					}, i(_.t(t.label + "_DESC")), 11, L)) : f("", !0)
				]))), 128)),
				X.value && t.id === "context" ? (r(), d("small", {
					key: 1,
					id: n(C) + "-context-help",
					class: "form-text sb-personal-group-help"
				}, i(_.t("COM_SMARTBROWSER_PERSONAL_CONTEXT_DESC")), 9, R)) : f("", !0)
			], 2))), 128))], 8, N),
			J.value ? (r(), d("p", z, i(J.value), 1)) : f("", !0),
			Y.value ? (r(), d("p", B, i(Y.value), 1)) : f("", !0),
			o("div", V, [_.currentView ? (r(), d("button", {
				key: 0,
				type: "button",
				class: "btn btn-outline-secondary",
				disabled: q.value,
				onClick: l[1] ||= (e) => {
					t.$emit("reset-view"), Y.value = _.t("COM_SMARTBROWSER_PERSONAL_RESET_DONE");
				}
			}, i(_.t("COM_SMARTBROWSER_PERSONAL_RESET_VIEW")), 9, H)) : f("", !0), o("button", {
				type: "button",
				class: "btn btn-outline-danger",
				disabled: q.value,
				onClick: re
			}, i(_.t("COM_SMARTBROWSER_PERSONAL_RESET_ALL")), 9, U)]),
			o("div", W, [o("button", {
				type: "submit",
				class: "btn btn-primary",
				disabled: q.value
			}, i(_.t("COM_SMARTBROWSER_PERSONAL_SAVE_CLOSE")), 9, G), o("button", {
				type: "button",
				class: "btn btn-danger",
				disabled: q.value,
				onClick: l[2] ||= (e) => w.value.close()
			}, i(_.t("JCANCEL")), 9, K)])
		], 32)], 40, O)]))], 64));
	}
};
//#endregion
export { w as a, x as i, T as n, C as r, q as t };
