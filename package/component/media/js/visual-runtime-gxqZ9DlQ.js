import { E as e, I as t, N as n, R as r, T as i, V as a, c as o, d as s, f as c, h as l, i as u, k as d, l as f, m as p, p as m, s as h, u as g, z as _ } from "./visual-runtime-CJIQlqNK.js?v=6.0.0";
import { t as v } from "./visual-runtime-9kQymmoE.js?v=6.0.0";
import { i as y, s as b, t as x } from "./visual-runtime-rMzcxeX1.js?v=6.0.0";
//#region resources/js/components/PersonalPreferencesDialog.vue
var S = ["title", "aria-label"], C = ["aria-labelledby"], w = { class: "sb-personal-heading" }, T = ["id"], ee = [
	"aria-expanded",
	"aria-controls",
	"title",
	"aria-label"
], E = { class: "sb-personal-help-label" }, D = ["id"], O = {
	key: 0,
	class: "sb-personal-group-title"
}, k = [
	"max",
	"placeholder",
	"disabled",
	"aria-describedby"
], A = [
	"value",
	"onChange",
	"disabled",
	"aria-describedby"
], j = ["value"], M = ["id"], N = ["id"], P = {
	key: 0,
	role: "alert",
	class: "alert alert-danger"
}, F = {
	key: 1,
	role: "status"
}, I = { class: "sb-personal-buttons" }, L = ["disabled"], R = ["disabled"], z = { class: "sb-personal-buttons" }, B = ["disabled"], te = ["disabled"], V = {
	__name: "PersonalPreferencesDialog",
	props: {
		t: Function,
		currentView: Boolean,
		adapter: String
	},
	emits: ["saved", "reset-view"],
	setup(V, { emit: H }) {
		let U = V, W = H, G = d(), K = t(null), q = t(y()), J = t(!1), Y = t(""), X = t(""), Z = t(!1);
		function Q(e) {
			let t = "COM_SMARTBROWSER_PERSONAL_CONTEXT_" + e.toUpperCase(), n = U.t(t);
			return n === t ? U.t("COM_SMARTBROWSER_ADAPTER_" + e.toUpperCase()) : n;
		}
		function ne(e, t) {
			let n = U.t("COM_SMARTBROWSER_PERSONAL_VALUE_" + t.toUpperCase());
			if (t !== "inherit") return n;
			let r = window.Joomla?.getOptions?.("com_smartbrowser.preferences", {})?.globalDefaults || {}, i = e.adapter ? r.contextItemsByAdapter?.[e.adapter] || r.contextItems : r[e.key];
			return i ? `${n} (${U.t("COM_SMARTBROWSER_PERSONAL_VALUE_" + i.toUpperCase())})` : n;
		}
		let $ = g(() => [
			{
				key: "loadingMode",
				label: "COM_SMARTBROWSER_PERSONAL_LOADING",
				values: [
					"inherit",
					"all",
					"smart",
					"pages"
				]
			},
			{
				key: "pageSize",
				label: "COM_SMARTBROWSER_PERSONAL_PAGE_SIZE"
			},
			{
				key: "editorMode",
				label: "COM_SMARTBROWSER_PERSONAL_EDITOR",
				values: [
					"inherit",
					"modal",
					"page"
				]
			},
			...x.filter((e) => !U.adapter || e === U.adapter.replace(/^flat-/, "")).map((e) => ({
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
		]), re = g(() => [
			{
				id: "general",
				fields: $.value.filter((e) => ["editorMode", "integration"].includes(e.key))
			},
			{
				id: "remember",
				fields: $.value.filter((e) => ["pickerStateScope", "pickerNodeScope"].includes(e.key))
			},
			{
				id: "loading",
				fields: $.value.filter((e) => ["loadingMode", "pageSize"].includes(e.key))
			},
			{
				id: "context",
				fields: $.value.filter((e) => e.adapter)
			}
		].filter((e) => e.fields.length)), ie = g(() => `${U.t("COM_SMARTBROWSER_PERSONAL_VALUE_INHERIT")} (${window.Joomla?.getOptions?.("com_smartbrowser.preferences", {})?.globalDefaults?.pageSize || 50})`);
		function ae() {
			q.value = y(), Y.value = "", X.value = "", K.value.showModal();
		}
		function oe(e) {
			e.target.value !== "" && Number(e.target.value) <= 0 && (q.value.pageSize = null, e.target.value = "");
		}
		async function se() {
			J.value = !0, Y.value = "";
			try {
				let e = await b(q.value);
				W("saved", e), K.value.close();
			} catch (e) {
				Y.value = window.Joomla?.Text?._(e.message, e.message) || e.message;
			} finally {
				J.value = !1;
			}
		}
		async function ce() {
			J.value = !0, Y.value = "";
			try {
				let e = v();
				e.reset ? await e.reset() : Array.from({ length: e.length }, (t, n) => e.key(n)).filter((e) => e?.startsWith("supjx.smartbrowser.") || e?.startsWith("smartbrowser.")).forEach((t) => e.removeItem(t)), q.value = y(), W("reset-view"), W("saved", q.value), K.value.close();
			} catch (e) {
				Y.value = e.message;
			} finally {
				J.value = !1;
			}
		}
		return (t, d) => (i(), p(o, null, [s("button", {
			type: "button",
			class: "btn btn-outline-secondary sb-personal-preferences-button",
			title: V.t("COM_SMARTBROWSER_PERSONAL_TITLE"),
			"aria-label": V.t("COM_SMARTBROWSER_PERSONAL_TITLE"),
			onClick: ae
		}, [...d[5] ||= [s("span", {
			class: "fas fa-sliders-h",
			"aria-hidden": "true"
		}, null, -1)]], 8, S), (i(), c(f, { to: "body" }, [s("dialog", {
			ref_key: "dialog",
			ref: K,
			class: "sb-personal-preferences",
			"aria-labelledby": r(G),
			onClose: d[4] ||= (e) => J.value = !1
		}, [s("form", { onSubmit: h(se, ["prevent"]) }, [
			s("div", w, [s("h2", { id: r(G) }, a(V.t("COM_SMARTBROWSER_PERSONAL_TITLE")), 9, T), s("button", {
				type: "button",
				class: "btn btn-outline-secondary",
				"aria-expanded": Z.value,
				"aria-controls": r(G) + "-help",
				title: V.t("JINLINEHELP"),
				"aria-label": V.t("JINLINEHELP"),
				onClick: d[0] ||= (e) => Z.value = !Z.value
			}, [
				d[6] ||= s("span", {
					class: "fas fa-question-circle",
					"aria-hidden": "true"
				}, null, -1),
				d[7] ||= l(),
				s("span", E, a(V.t("JINLINEHELP")), 1)
			], 8, ee)]),
			s("p", null, a(V.t("COM_SMARTBROWSER_PERSONAL_DESCRIPTION")), 1),
			s("div", { id: r(G) + "-help" }, [(i(!0), p(o, null, e(re.value, (t) => (i(), p("section", {
				key: t.id,
				class: _(["sb-personal-group", {
					"sb-personal-context-group": t.id === "context",
					"has-single-field": t.fields.length === 1
				}])
			}, [
				t.id === "context" ? (i(), p("h3", O, a(V.t("COM_SMARTBROWSER_PERSONAL_CONTEXT")), 1)) : m("", !0),
				(i(!0), p(o, null, e(t.fields, (t) => (i(), p("label", {
					key: t.key,
					class: "sb-personal-field"
				}, [
					s("span", null, a(t.adapter ? Q(t.adapter) : V.t(t.label)), 1),
					t.key === "pageSize" ? n((i(), p("input", {
						key: 0,
						"onUpdate:modelValue": d[1] ||= (e) => q.value.pageSize = e,
						onInput: oe,
						type: "number",
						min: "0",
						max: 2 ** 53 - 1,
						step: "1",
						class: "form-control",
						placeholder: ie.value,
						disabled: J.value,
						"aria-describedby": Z.value ? r(G) + "-pageSize" : void 0
					}, null, 40, k)), [[
						u,
						q.value.pageSize,
						void 0,
						{ number: !0 }
					]]) : (i(), p("select", {
						key: 1,
						value: t.adapter ? q.value.contextItemsByAdapter[t.adapter] : q.value[t.key],
						onChange: (e) => t.adapter ? q.value.contextItemsByAdapter[t.adapter] = e.target.value : q.value[t.key] = e.target.value,
						class: "form-select",
						disabled: J.value,
						"aria-describedby": Z.value ? t.adapter ? r(G) + "-context-help" : r(G) + "-" + t.key : void 0
					}, [(i(!0), p(o, null, e(t.values, (e) => (i(), p("option", {
						key: e,
						value: e
					}, a(ne(t, e)), 9, j))), 128))], 40, A)),
					Z.value && !t.adapter ? (i(), p("small", {
						key: 2,
						id: r(G) + "-" + t.key,
						class: _(["form-text", { "sb-personal-integration-help": t.key === "integration" }])
					}, a(V.t(t.label + "_DESC")), 11, M)) : m("", !0)
				]))), 128)),
				Z.value && t.id === "context" ? (i(), p("small", {
					key: 1,
					id: r(G) + "-context-help",
					class: "form-text sb-personal-group-help"
				}, a(V.t("COM_SMARTBROWSER_PERSONAL_CONTEXT_DESC")), 9, N)) : m("", !0)
			], 2))), 128))], 8, D),
			Y.value ? (i(), p("p", P, a(Y.value), 1)) : m("", !0),
			X.value ? (i(), p("p", F, a(X.value), 1)) : m("", !0),
			s("div", I, [V.currentView ? (i(), p("button", {
				key: 0,
				type: "button",
				class: "btn btn-outline-secondary",
				disabled: J.value,
				onClick: d[2] ||= (e) => {
					t.$emit("reset-view"), X.value = V.t("COM_SMARTBROWSER_PERSONAL_RESET_DONE");
				}
			}, a(V.t("COM_SMARTBROWSER_PERSONAL_RESET_VIEW")), 9, L)) : m("", !0), s("button", {
				type: "button",
				class: "btn btn-outline-danger",
				disabled: J.value,
				onClick: ce
			}, a(V.t("COM_SMARTBROWSER_PERSONAL_RESET_ALL")), 9, R)]),
			s("div", z, [s("button", {
				type: "submit",
				class: "btn btn-primary",
				disabled: J.value
			}, a(V.t("COM_SMARTBROWSER_PERSONAL_SAVE_CLOSE")), 9, B), s("button", {
				type: "button",
				class: "btn btn-danger",
				disabled: J.value,
				onClick: d[3] ||= (e) => K.value.close()
			}, a(V.t("JCANCEL")), 9, te)])
		], 32)], 40, C)]))], 64));
	}
};
//#endregion
export { V as t };
