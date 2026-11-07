import { A as e, B as t, C as n, D as r, E as i, F as a, I as o, L as s, M as c, N as l, O as u, P as d, R as f, S as p, T as m, V as h, a as g, b as _, c as v, d as y, f as b, g as x, h as S, i as C, j as w, k as T, l as E, m as D, n as O, o as k, p as A, r as ee, s as j, u as M, v as te, w as N, x as P, y as ne, z as F } from "./visual-runtime-CJIQlqNK.js?v=5.2.0";
import { t as I } from "./visual-runtime-9kQymmoE.js?v=5.2.0";
import { a as L, i as R, n as z, r as B } from "./visual-runtime-CCt1nnbc.js?v=5.2.0";
import { n as V, t as re } from "./visual-runtime-DAGXuL4O.js?v=5.2.0";
import { t as H } from "./visual-runtime-BVhlxhI5.js?v=5.2.0";
//#region resources/js/components/ResourceFancySelect.vue
var U = ["placeholder"], ie = ["multiple"], W = ["selected"], G = ["value", "selected"], K = {
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
	setup(e, { emit: t }) {
		let r = e, a = t, s = o(null), c = M(() => r.options.filter((e) => String(e.value) !== "")), l = M(() => c.value.map((e) => String(e.value)).join("|")), u = (e) => r.multiple ? r.modelValue.includes(String(e)) : String(r.modelValue) === String(e), d = (e) => a("update:modelValue", r.multiple ? Array.from(e.target.selectedOptions, (e) => e.value) : e.target.value), f, g, _, b = () => s.value?.choicesInstance?.hideDropdown(), x = () => {
			if (!f?.matches(":popover-open")) return;
			let e = s.value?.choicesInstance?.containerOuter?.element;
			if (!e) return;
			let t = e.getBoundingClientRect();
			if (t.bottom < 0 || t.top > window.innerHeight) {
				s.value.choicesInstance.hideDropdown();
				return;
			}
			let n = window.innerHeight - t.bottom - 8, r = t.top - 8, i = n < 240 && r > n, a = Math.max(0, i ? r : n);
			f.style.left = `${t.left}px`, f.style.top = `${i ? t.top : t.bottom}px`, f.style.width = `${t.width}px`, f.style.maxHeight = `${a}px`, f.style.transform = i ? "translateY(-100%)" : "", f.style.setProperty("--resource-batch-dropdown-list-height", `${Math.max(0, a - 2)}px`);
		}, S = () => {
			f && (f.classList.contains("is-active") && s.value?.closest("dialog")?.open ? (f.matches(":popover-open") || f.showPopover(), x()) : f.matches(":popover-open") && f.hidePopover());
		};
		return n(async () => {
			await P(), f = s.value?.choicesInstance?.dropdown?.element, f && (_ = s.value.closest("dialog"), f.setAttribute("popover", "manual"), f.classList.add("resource-batch-choices-dropdown"), g = new MutationObserver(S), g.observe(f, {
				attributes: !0,
				attributeFilter: ["class"]
			}), window.addEventListener("scroll", x, !0), window.addEventListener("resize", x), _?.addEventListener("close", b));
		}), p(() => {
			g?.disconnect(), f?.matches(":popover-open") && f.hidePopover(), window.removeEventListener("scroll", x, !0), window.removeEventListener("resize", x), _?.removeEventListener("close", b);
		}), w(() => r.modelValue, async (e) => {
			await P();
			let t = s.value?.choicesInstance;
			if (!t) return;
			let n = r.multiple ? e : e ? [e] : [], i = t.getValue(!0), a = Array.isArray(i) ? i : i ? [i] : [];
			a.filter((e) => !n.includes(String(e))).forEach((e) => t.removeActiveItemsByValue(String(e))), n.filter((e) => !a.includes(String(e))).forEach((e) => t.setChoiceByValue(String(e)));
		}), (t, n) => (m(), D("joomla-field-fancy-select", {
			ref_key: "field",
			ref: s,
			key: l.value,
			class: F({ "resource-batch-single-select": !e.multiple }),
			placeholder: e.t(e.placeholder)
		}, [y("select", {
			class: "form-select",
			multiple: e.multiple,
			onChange: d
		}, [e.multiple ? A("", !0) : (m(), D("option", {
			key: 0,
			value: "",
			selected: !e.modelValue
		}, h(e.t(e.placeholder)), 9, W)), (m(!0), D(v, null, i(c.value, (t) => (m(), D("option", {
			key: t.value,
			value: String(t.value),
			selected: u(t.value)
		}, h(e.t(t.label)), 9, G))), 128))], 40, ie)], 10, U));
	}
}, q = { class: "resource-batch-field" }, J = ["aria-label"], Y = ["aria-pressed", "onClick"], X = {
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
		return (n, r) => (m(), D("div", q, [y("span", null, h(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), y("div", {
			class: "btn-group resource-batch-mode-toggle",
			role: "group",
			"aria-label": e.t("COM_SMARTBROWSER_BATCH_MODE")
		}, [(m(), D(v, null, i(t, (t) => y("button", {
			key: t.value,
			type: "button",
			class: F(["btn", e.modelValue === t.value ? "is-active" : ""]),
			"aria-pressed": e.modelValue === t.value,
			onClick: (e) => n.$emit("update:modelValue", t.value)
		}, h(e.t(t.label)), 11, Y)), 64))], 8, J)]));
	}
}, Z = ["aria-label"], ae = { class: "resource-batch-body" }, oe = {
	class: "resource-batch-heading",
	role: "heading",
	"aria-level": "3"
}, se = ["open"], ce = { class: "resource-batch-fields" }, le = ["aria-label"], ue = ["value"], de = ["aria-label"], fe = { value: "asc" }, pe = { value: "desc" }, me = ["open"], he = { class: "resource-batch-fields" }, ge = { class: "resource-batch-field" }, _e = ["aria-label"], ve = {
	key: 1,
	class: "text-danger"
}, ye = ["open"], be = { class: "resource-batch-fields" }, xe = ["disabled"], Se = { class: "resource-batch-check" }, Ce = { key: 0 }, we = ["open"], Te = { class: "resource-batch-fields" }, Ee = { class: "input-group" }, De = ["open"], Oe = { class: "resource-batch-fields" }, ke = { class: "resource-batch-check" }, Ae = ["disabled"], je = ["open"], Me = ["onClick"], Ne = { class: "resource-batch-fields" }, Pe = ["onUpdate:modelValue", "aria-label"], Fe = { value: "" }, Ie = ["value"], Le = ["open"], Re = {
	key: 0,
	class: "resource-batch-fields"
}, ze = { class: "resource-batch-field" }, Be = { class: "resource-batch-field" }, Ve = ["open"], He = {
	key: 0,
	class: "resource-batch-fields"
}, Ue = { class: "resource-batch-field" }, We = ["open"], Ge = ["onClick"], Ke = {
	key: 0,
	class: "resource-batch-fields"
}, qe = ["onUpdate:modelValue", "aria-label"], Je = { value: "" }, Ye = ["value"], Xe = ["open"], Ze = {
	key: 0,
	class: "resource-batch-fields"
}, Qe = { class: "resource-batch-field" }, $e = { class: "resource-batch-field" }, et = ["open"], tt = {
	key: 0,
	class: "resource-batch-fields"
}, nt = { class: "resource-batch-field" }, rt = ["open"], it = ["open"], at = {
	key: 0,
	class: "resource-batch-fields"
}, ot = { class: "resource-batch-field" }, st = ["open"], ct = {
	key: 0,
	class: "resource-batch-fields"
}, lt = { value: "add" }, ut = { value: "remove" }, dt = { value: "set" }, ft = { class: "resource-batch-field" }, pt = ["open"], mt = {
	key: 0,
	class: "resource-batch-fields"
}, ht = { value: "yes" }, gt = { value: "no" }, Q = { class: "resource-batch-bottom" }, $ = { class: "resource-batch-preview" }, _t = {
	class: "resource-batch-preview-heading",
	role: "heading",
	"aria-level": "3"
}, vt = {
	key: 0,
	class: "resource-batch-summary"
}, yt = {
	key: 0,
	class: "fas fa-arrow-right resource-batch-sequence-arrow",
	"aria-hidden": "true"
}, bt = { class: "resource-batch-summary-step" }, xt = {
	class: "resource-batch-summary-step-heading",
	role: "heading",
	"aria-level": "4"
}, St = {
	key: 0,
	class: "resource-batch-summary-params"
}, Ct = {
	key: 1,
	class: "resource-batch-no-changes"
}, wt = { class: "resource-batch-footer" }, Tt = { class: "resource-batch-footer-actions" }, Et = ["disabled"], Dt = ["aria-label"], Ot = { class: "resource-batch-preview-dialog-head" }, kt = ["aria-label"], At = { class: "resource-batch-preview-list" }, jt = ["title"], Mt = ["title"], Nt = ["aria-label"], Pt = { class: "resource-batch-preview-dialog-head" }, Ft = ["aria-label"], It = { class: "resource-batch-selected-list" }, Lt = {
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
		collectionOnly: Boolean,
		t: {
			type: Function,
			required: !0
		}
	},
	emits: ["apply"],
	setup(e, { expose: t, emit: r }) {
		let s = e, c = r, u = te("resourceApi"), d = o(!1), p = o([]), g = o(!1), _ = o(""), w = 0, T = o(null), E = o(null), k = o(null), N = M(() => s.adapter.replace(/^flat-/, "")), P = M(() => N.value === "media"), ne = M(() => ["articles", "articles-by-tag"].includes(N.value)), I = M(() => N.value === "categories"), L = M(() => N.value === "tags"), R = M(() => N.value === "menus"), z = M(() => N.value === "users"), B = M(() => ({
			articles: "article:",
			"articles-by-tag": "article:",
			categories: "category:",
			tags: "tag:",
			menus: "menu-item:",
			users: "user:"
		})[N.value]), V = M(() => !s.collectionOnly && B.value ? s.selection.filter((e) => e.id.startsWith(B.value)) : s.selection), re = {
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
		}, U = {
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
		}, ie = {
			groupOpen: !1,
			groupAction: "add",
			group: "",
			resetOpen: !1,
			reset: "yes"
		}, W = a({ ...re }), G = a({ ...H }), q = a({ ...U }), J = a({ ...ie }), Y = a({
			enabled: !1,
			field: "title",
			direction: "asc"
		}), Lt = M(() => V.value.length === 1 && V.value[0].capabilities?.extract === !0), Rt = [{
			id: "language",
			enabled: "changeLanguage",
			label: "COM_SMARTBROWSER_BATCH_SET_LANGUAGE",
			placeholder: "COM_SMARTBROWSER_SELECT_LANGUAGE"
		}, {
			id: "access",
			enabled: "changeAccess",
			label: "COM_SMARTBROWSER_BATCH_SET_ACCESS",
			placeholder: "COM_SMARTBROWSER_SELECT_ACCESS"
		}], zt = Rt, Bt = M(() => Y.enabled || JSON.stringify(W) !== JSON.stringify(re) || JSON.stringify(G) !== JSON.stringify(H) || JSON.stringify(q) !== JSON.stringify(U) || JSON.stringify(J) !== JSON.stringify(ie)), Vt = (e) => (s.batchOptions[e] || s.filters.find((t) => t.id === e)?.options || []).filter((e) => String(e.value) !== ""), Ht = M(() => (s.batchOptions.menu || []).flatMap((e) => [{
			value: `${e.value}.0`,
			label: e.label
		}, ...(s.batchOptions.menuParent || []).filter((t) => t.menu === e.value).map((t) => ({
			value: `${e.value}.${t.value}`,
			label: `- ${t.label}`
		}))])), Ut = M(() => W.zipName.trim().replace(/\.zip$/i, "")), Wt = (e) => {
			G.tagAdd = e, G.tagRemove = G.tagRemove.filter((t) => !e.includes(t));
		}, Gt = (e) => {
			G.tagRemove = e, G.tagAdd = G.tagAdd.filter((t) => !e.includes(t));
		}, Kt = (e) => {
			q.tagAdd = e, q.tagRemove = q.tagRemove.filter((t) => !e.includes(t));
		}, qt = (e) => {
			q.tagRemove = e, q.tagAdd = q.tagAdd.filter((t) => !e.includes(t));
		}, Jt = (e, t) => s.t(Vt(e).find((e) => String(e.value) === String(t))?.label || t), Yt = M(() => {
			let e = [];
			if (Y.enabled && s.orderingAvailable && e.push({
				id: "sort",
				title: s.t("COM_SMARTBROWSER_BATCH_SORT"),
				parameters: [s.t(s.sortFields.find((e) => e.id === Y.field)?.label || Y.field), s.t(Y.direction === "asc" ? "COM_SMARTBROWSER_ASCENDING" : "COM_SMARTBROWSER_DESCENDING")]
			}), P.value) W.placement !== "none" && e.push({
				id: "placement",
				title: s.t(W.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
				parameters: [p.value.find((e) => e.value === W.destination)?.path || "..."]
			}), W.rename && e.push({
				id: "rename",
				title: s.t("COM_SMARTBROWSER_BATCH_RENAME"),
				parameters: [
					...W.find ? [`${s.t("COM_SMARTBROWSER_BATCH_FIND")}: ${W.find} → ${W.replace}`] : [],
					...W.prefix ? [`${s.t("COM_SMARTBROWSER_BATCH_PREFIX")}: ${W.prefix}`] : [],
					...W.suffix ? [`${s.t("COM_SMARTBROWSER_BATCH_SUFFIX")}: ${W.suffix}`] : [],
					...W.number ? [`${s.t("COM_SMARTBROWSER_BATCH_NUMBER")}: ${W.startAt}`] : []
				],
				preview: !0
			}), W.zip && e.push({
				id: "zip",
				title: s.t("COM_SMARTBROWSER_BATCH_ZIP"),
				parameters: [`${Ut.value}.zip`]
			}), W.extract && Lt.value && e.push({
				id: "extract",
				title: s.t("COM_SMARTBROWSER_BATCH_EXTRACT"),
				parameters: W.deleteArchive ? [s.t("COM_SMARTBROWSER_BATCH_EXTRACT_DELETE")] : []
			});
			else if (ne.value) {
				for (let t of Rt) G[t.enabled] && G[t.id] && e.push({
					id: t.id,
					title: s.t(t.label),
					parameters: [Jt(t.id, G[t.id])]
				});
				G.tagsOpen && G.tagAdd.length && e.push({
					id: "tag-add",
					title: s.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: G.tagAdd.map((e) => Jt("tag", e))
				}), G.tagsOpen && G.tagRemove.length && e.push({
					id: "tag-remove",
					title: s.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: G.tagRemove.map((e) => Jt("tag", e))
				}), G.placement !== "none" && e.unshift({
					id: "placement",
					title: s.t(G.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [G.category ? Jt("category", G.category) : "..."]
				});
			} else if (I.value || L.value || R.value) {
				for (let t of zt) q[t.enabled] && q[t.id] && e.push({
					id: t.id,
					title: s.t(t.label),
					parameters: [Jt(t.id, q[t.id])]
				});
				I.value && (q.tagsOpen && q.tagAdd.length && e.push({
					id: "tag-add",
					title: s.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: q.tagAdd.map((e) => Jt("tag", e))
				}), q.tagsOpen && q.tagRemove.length && e.push({
					id: "tag-remove",
					title: s.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: q.tagRemove.map((e) => Jt("tag", e))
				}), q.placement !== "none" && e.unshift({
					id: "placement",
					title: s.t(q.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [q.category ? Jt("category", q.category) : "..."]
				}), q.flipOrdering && e.push({
					id: "flip",
					title: s.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING"),
					parameters: []
				})), R.value && q.placement !== "none" && e.unshift({
					id: "placement",
					title: s.t(q.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [Ht.value.find((e) => e.value === q.menuDestination)?.label || "..."]
				});
			} else z.value && (J.groupOpen && J.group && e.push({
				id: "group",
				title: s.t({
					add: "COM_SMARTBROWSER_BATCH_GROUP_ADD",
					remove: "COM_SMARTBROWSER_BATCH_GROUP_REMOVE",
					set: "COM_SMARTBROWSER_BATCH_GROUP_SET"
				}[J.groupAction]),
				parameters: [Jt("group", J.group)]
			}), J.resetOpen && e.push({
				id: "reset",
				title: s.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET"),
				parameters: [s.t(J.reset === "yes" ? "JYES" : "JNO")]
			}));
			return e;
		}), Xt = M(() => !(!V.value.length || !Yt.value.length || W.extract && (!Lt.value || W.rename || W.zip || W.placement !== "none") || P.value && W.placement !== "none" && !p.value.some((e) => e.value === W.destination) || ne.value && G.placement !== "none" && !G.category || I.value && q.placement !== "none" && !q.category || R.value && q.placement !== "none" && !Ht.value.some((e) => e.value === q.menuDestination) || P.value && W.zip && !Ut.value)), Zt = () => {
			if (s.collectionOnly) return {};
			if (P.value) return {
				...W,
				zipName: Ut.value
			};
			if (ne.value) return {
				language: G.changeLanguage ? G.language : "",
				access: G.changeAccess ? G.access : "",
				tagAdd: G.tagsOpen ? G.tagAdd : [],
				tagRemove: G.tagsOpen ? G.tagRemove : [],
				placement: G.placement,
				category: G.category
			};
			if (z.value) return {
				group: J.groupOpen ? J.group : "",
				groupAction: J.groupAction === "remove" ? "del" : J.groupAction,
				reset: J.resetOpen ? J.reset : ""
			};
			let e = q.menuDestination.lastIndexOf(".");
			return {
				language: q.changeLanguage ? q.language : "",
				access: q.changeAccess ? q.access : "",
				tagAdd: I.value && q.tagsOpen ? q.tagAdd : [],
				tagRemove: I.value && q.tagsOpen ? q.tagRemove : [],
				placement: q.placement,
				category: q.category,
				flipOrdering: I.value && q.flipOrdering,
				menu: R.value && e >= 0 ? q.menuDestination.slice(0, e) : "",
				menuParent: R.value && e >= 0 ? q.menuDestination.slice(e + 1) : "0"
			};
		}, Qt = async () => {
			if (!d.value && Xt.value) {
				d.value = !0;
				try {
					await new Promise((e, t) => c("apply", {
						selection: V.value.map((e) => e.id),
						payload: {
							...Zt(),
							...Y.enabled && s.orderingAvailable ? { sort: {
								field: Y.field,
								direction: Y.direction
							} } : {}
						},
						resolve: e,
						reject: t
					})), cn();
				} catch (e) {
					window.Joomla?.renderMessages?.({ error: [e.message || String(e)] });
				} finally {
					d.value = !1;
				}
			}
		}, $t = (e, t) => {
			if (!W.rename) return e.title;
			let n = e.kind === "item" ? e.title.lastIndexOf(".") : -1, r = n > 0 ? e.title.slice(0, n) : e.title, i = n > 0 ? e.title.slice(n) : "", a = W.find ? r.split(W.find).join(W.replace) : r, o = W.number ? `-${String(Math.max(1, Number(W.startAt) || 1) + t).padStart(2, "0")}` : "";
			return `${W.prefix}${a}${W.suffix}${o}${i}`;
		}, en = M(() => V.value.map((e, t) => {
			let n = e.id.includes(":") ? e.id.slice(e.id.indexOf(":") + 1) : e.title, r = W.placement !== "none" && W.destination ? `${W.destination.slice(W.destination.indexOf(":") + 1).replace(/\/$/, "")}/` : n.slice(0, n.lastIndexOf("/") + 1);
			return {
				id: e.id,
				before: n,
				after: r + $t(e, t)
			};
		})), tn = async () => {
			let e = ++w;
			g.value = !0, _.value = "";
			try {
				let t = await u.execute("batchFolders", V.value.map((e) => e.id));
				e === w && (p.value = t);
			} catch (t) {
				e === w && (_.value = t.message || String(t));
			} finally {
				e === w && (g.value = !1);
			}
		}, nn = () => {
			Object.assign(W, re), Object.assign(G, H), Object.assign(q, U), Object.assign(J, ie), Object.assign(Y, {
				enabled: s.collectionOnly,
				field: s.sortFields[0]?.id || "title",
				direction: "asc"
			}), p.value = [], T.value?.showModal(), P.value && !s.collectionOnly && tn();
		}, rn = () => E.value?.showModal(), an = () => {
			E.value?.open && E.value.close();
		}, on = () => k.value?.showModal(), sn = () => {
			k.value?.open && k.value.close();
		}, cn = () => {
			w++, an(), sn(), T.value?.close();
		};
		return t({
			open: nn,
			close: cn
		}), n(() => {
			window.SmartBrowserDialogDismiss.install(T.value, () => Bt.value), window.SmartBrowserDialogDismiss.install(E.value), window.SmartBrowserDialogDismiss.install(k.value), T.value.addEventListener("close", () => {
				an(), sn();
			});
		}), (t, n) => (m(), D(v, null, [
			y("dialog", {
				ref_key: "dialog",
				ref: T,
				class: "resource-batch-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_BATCH_ACTIONS")
			}, [y("div", ae, [
				y("div", oe, h(e.t("COM_SMARTBROWSER_BATCH_SELECT_ACTIONS")), 1),
				e.orderingAvailable && (e.collectionOnly || V.value.every((e) => e.capabilities?.reorder)) ? (m(), D("details", {
					key: 0,
					class: "resource-batch-step",
					open: Y.enabled
				}, [y("summary", { onClick: n[0] ||= j((e) => Y.enabled = !Y.enabled, ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_SORT")), 1), y("div", ce, [l(y("select", {
					"onUpdate:modelValue": n[1] ||= (e) => Y.field = e,
					class: "form-select",
					"aria-label": e.t("COM_SMARTBROWSER_BATCH_SORT")
				}, [(m(!0), D(v, null, i(e.sortFields, (t) => (m(), D("option", {
					key: t.id,
					value: t.id
				}, h(e.t(t.label)), 9, ue))), 128))], 8, le), [[ee, Y.field]]), l(y("select", {
					"onUpdate:modelValue": n[2] ||= (e) => Y.direction = e,
					class: "form-select",
					"aria-label": e.t("COM_SMARTBROWSER_SORT_DIRECTION")
				}, [y("option", fe, h(e.t("COM_SMARTBROWSER_ASCENDING")), 1), y("option", pe, h(e.t("COM_SMARTBROWSER_DESCENDING")), 1)], 8, de), [[ee, Y.direction]])])], 8, se)) : A("", !0),
				P.value && !e.collectionOnly ? (m(), D(v, { key: 1 }, [
					y("details", {
						class: "resource-batch-step",
						open: W.placement !== "none"
					}, [y("summary", { onClick: n[3] ||= j((e) => W.placement = W.placement === "none" ? "move" : "none", ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_PLACEMENT")), 1), y("div", he, [x(X, {
						modelValue: W.placement,
						"onUpdate:modelValue": n[4] ||= (e) => W.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), y("div", ge, [y("span", null, h(e.t("COM_SMARTBROWSER_BATCH_DESTINATION_FOLDER")), 1), g.value ? (m(), D("span", {
						key: 0,
						class: "spinner-border spinner-border-sm",
						role: "status",
						"aria-label": e.t("COM_SMARTBROWSER_LOADING_FOLDERS")
					}, null, 8, _e)) : _.value ? (m(), D("span", ve, h(_.value), 1)) : (m(), b(K, {
						key: 2,
						modelValue: W.destination,
						"onUpdate:modelValue": n[5] ||= (e) => W.destination = e,
						options: p.value,
						placeholder: "COM_SMARTBROWSER_SELECT_FOLDER",
						t: e.t,
						"aria-label": e.t("COM_SMARTBROWSER_BATCH_DESTINATION_FOLDER")
					}, null, 8, [
						"modelValue",
						"options",
						"t",
						"aria-label"
					]))])])], 8, me),
					y("details", {
						class: "resource-batch-step",
						open: W.rename
					}, [y("summary", { onClick: n[6] ||= j((e) => W.rename = !W.rename, ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_RENAME")), 1), y("div", be, [
						y("label", null, [S(h(e.t("COM_SMARTBROWSER_BATCH_FIND")), 1), l(y("input", {
							"onUpdate:modelValue": n[7] ||= (e) => W.find = e,
							type: "text",
							class: "form-control"
						}, null, 512), [[C, W.find]])]),
						y("label", null, [S(h(e.t("COM_SMARTBROWSER_BATCH_REPLACE")), 1), l(y("input", {
							"onUpdate:modelValue": n[8] ||= (e) => W.replace = e,
							type: "text",
							class: "form-control",
							disabled: !W.find
						}, null, 8, xe), [[C, W.replace]])]),
						y("label", null, [S(h(e.t("COM_SMARTBROWSER_BATCH_PREFIX")), 1), l(y("input", {
							"onUpdate:modelValue": n[9] ||= (e) => W.prefix = e,
							type: "text",
							class: "form-control"
						}, null, 512), [[C, W.prefix]])]),
						y("label", null, [S(h(e.t("COM_SMARTBROWSER_BATCH_SUFFIX")), 1), l(y("input", {
							"onUpdate:modelValue": n[10] ||= (e) => W.suffix = e,
							type: "text",
							class: "form-control"
						}, null, 512), [[C, W.suffix]])]),
						y("label", Se, [l(y("input", {
							"onUpdate:modelValue": n[11] ||= (e) => W.number = e,
							type: "checkbox",
							class: "form-check-input"
						}, null, 512), [[O, W.number]]), S(" " + h(e.t("COM_SMARTBROWSER_BATCH_NUMBER")), 1)]),
						W.number ? (m(), D("label", Ce, [S(h(e.t("COM_SMARTBROWSER_BATCH_START_AT")), 1), l(y("input", {
							"onUpdate:modelValue": n[12] ||= (e) => W.startAt = e,
							type: "number",
							min: "1",
							class: "form-control"
						}, null, 512), [[
							C,
							W.startAt,
							void 0,
							{ number: !0 }
						]])])) : A("", !0)
					])], 8, ye),
					y("details", {
						class: "resource-batch-step",
						open: W.zip
					}, [y("summary", { onClick: n[13] ||= j((e) => W.zip = !W.zip, ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_ZIP")), 1), y("div", Te, [y("label", null, [S(h(e.t("COM_SMARTBROWSER_BATCH_ZIP_NAME")), 1), y("span", Ee, [l(y("input", {
						"onUpdate:modelValue": n[14] ||= (e) => W.zipName = e,
						type: "text",
						class: "form-control",
						onBlur: n[15] ||= (e) => W.zipName = Ut.value
					}, null, 544), [[C, W.zipName]]), n[35] ||= y("span", { class: "input-group-text" }, ".zip", -1)])])])], 8, we),
					Lt.value ? (m(), D("details", {
						key: 0,
						class: "resource-batch-step",
						open: W.extract
					}, [y("summary", { onClick: n[16] ||= j((e) => W.extract = !W.extract, ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_EXTRACT")), 1), y("div", Oe, [y("label", ke, [l(y("input", {
						"onUpdate:modelValue": n[17] ||= (e) => W.deleteArchive = e,
						type: "checkbox",
						class: "form-check-input",
						disabled: !V.value.every((e) => e.capabilities?.delete)
					}, null, 8, Ae), [[O, W.deleteArchive]]), S(" " + h(e.t("COM_SMARTBROWSER_BATCH_EXTRACT_DELETE")), 1)])])], 8, De)) : A("", !0)
				], 64)) : ne.value && !e.collectionOnly ? (m(), D(v, { key: 2 }, [
					(m(), D(v, null, i(Rt, (t) => y("details", {
						key: t.id,
						class: "resource-batch-step",
						open: G[t.enabled]
					}, [y("summary", { onClick: j((e) => G[t.enabled] = !G[t.enabled], ["prevent"]) }, h(e.t(t.label)), 9, Me), y("div", Ne, [l(y("select", {
						"onUpdate:modelValue": (e) => G[t.id] = e,
						class: "form-select",
						"aria-label": e.t(t.label)
					}, [y("option", Fe, h(e.t(t.placeholder)), 1), (m(!0), D(v, null, i(Vt(t.id), (t) => (m(), D("option", {
						key: t.value,
						value: t.value
					}, h(e.t(t.label)), 9, Ie))), 128))], 8, Pe), [[ee, G[t.id]]])])], 8, je)), 64)),
					y("details", {
						class: "resource-batch-step",
						open: G.tagsOpen
					}, [y("summary", { onClick: n[18] ||= j((e) => G.tagsOpen = !G.tagsOpen, ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), G.tagsOpen ? (m(), D("div", Re, [y("div", ze, [y("span", null, h(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), x(K, {
						"model-value": G.tagAdd,
						options: Vt("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": Wt
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])]), y("div", Be, [y("span", null, h(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), x(K, {
						"model-value": G.tagRemove,
						options: Vt("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": Gt
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])])])) : A("", !0)], 8, Le),
					y("details", {
						class: "resource-batch-step",
						open: G.placement !== "none"
					}, [y("summary", { onClick: n[19] ||= j((e) => G.placement = G.placement === "none" ? "move" : "none", ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), G.placement === "none" ? A("", !0) : (m(), D("div", He, [x(X, {
						modelValue: G.placement,
						"onUpdate:modelValue": n[20] ||= (e) => G.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), y("div", Ue, [y("span", null, h(e.t("COM_SMARTBROWSER_CATEGORY")), 1), x(K, {
						modelValue: G.category,
						"onUpdate:modelValue": n[21] ||= (e) => G.category = e,
						options: Vt("category"),
						placeholder: "COM_SMARTBROWSER_SELECT_CATEGORY",
						t: e.t,
						"aria-label": e.t("COM_SMARTBROWSER_CATEGORY")
					}, null, 8, [
						"modelValue",
						"options",
						"t",
						"aria-label"
					])])]))], 8, Ve)
				], 64)) : !e.collectionOnly && (I.value || L.value || R.value) ? (m(), D(v, { key: 3 }, [
					(m(!0), D(v, null, i(f(zt), (t) => (m(), D("details", {
						key: t.id,
						class: "resource-batch-step",
						open: q[t.enabled]
					}, [y("summary", { onClick: j((e) => q[t.enabled] = !q[t.enabled], ["prevent"]) }, h(e.t(t.label)), 9, Ge), q[t.enabled] ? (m(), D("div", Ke, [l(y("select", {
						"onUpdate:modelValue": (e) => q[t.id] = e,
						class: "form-select",
						"aria-label": e.t(t.label)
					}, [y("option", Je, h(e.t(t.placeholder)), 1), (m(!0), D(v, null, i(Vt(t.id), (t) => (m(), D("option", {
						key: t.value,
						value: t.value
					}, h(e.t(t.label)), 9, Ye))), 128))], 8, qe), [[ee, q[t.id]]])])) : A("", !0)], 8, We))), 128)),
					I.value ? (m(), D("details", {
						key: 0,
						class: "resource-batch-step",
						open: q.tagsOpen
					}, [y("summary", { onClick: n[22] ||= j((e) => q.tagsOpen = !q.tagsOpen, ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), q.tagsOpen ? (m(), D("div", Ze, [y("div", Qe, [y("span", null, h(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), x(K, {
						"model-value": q.tagAdd,
						options: Vt("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": Kt
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])]), y("div", $e, [y("span", null, h(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), x(K, {
						"model-value": q.tagRemove,
						options: Vt("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": qt
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])])])) : A("", !0)], 8, Xe)) : A("", !0),
					I.value ? (m(), D("details", {
						key: 1,
						class: "resource-batch-step",
						open: q.placement !== "none"
					}, [y("summary", { onClick: n[23] ||= j((e) => q.placement = q.placement === "none" ? "move" : "none", ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), q.placement === "none" ? A("", !0) : (m(), D("div", tt, [x(X, {
						modelValue: q.placement,
						"onUpdate:modelValue": n[24] ||= (e) => q.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), y("div", nt, [y("span", null, h(e.t("COM_SMARTBROWSER_BATCH_PARENT_CATEGORY")), 1), x(K, {
						modelValue: q.category,
						"onUpdate:modelValue": n[25] ||= (e) => q.category = e,
						options: Vt("category"),
						placeholder: "COM_SMARTBROWSER_SELECT_CATEGORY",
						t: e.t,
						"aria-label": e.t("COM_SMARTBROWSER_BATCH_PARENT_CATEGORY")
					}, null, 8, [
						"modelValue",
						"options",
						"t",
						"aria-label"
					])])]))], 8, et)) : A("", !0),
					I.value ? (m(), D("details", {
						key: 2,
						class: "resource-batch-step",
						open: q.flipOrdering
					}, [y("summary", { onClick: n[26] ||= j((e) => q.flipOrdering = !q.flipOrdering, ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING")), 1)], 8, rt)) : A("", !0),
					R.value ? (m(), D("details", {
						key: 3,
						class: "resource-batch-step",
						open: q.placement !== "none"
					}, [y("summary", { onClick: n[27] ||= j((e) => q.placement = q.placement === "none" ? "move" : "none", ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_MENU_PLACEMENT")), 1), q.placement === "none" ? A("", !0) : (m(), D("div", at, [x(X, {
						modelValue: q.placement,
						"onUpdate:modelValue": n[28] ||= (e) => q.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), y("div", ot, [y("span", null, h(e.t("COM_SMARTBROWSER_BATCH_MENU_DESTINATION")), 1), x(K, {
						modelValue: q.menuDestination,
						"onUpdate:modelValue": n[29] ||= (e) => q.menuDestination = e,
						options: Ht.value,
						placeholder: "COM_SMARTBROWSER_SELECT_MENU",
						t: e.t,
						"aria-label": e.t("COM_SMARTBROWSER_BATCH_MENU_DESTINATION")
					}, null, 8, [
						"modelValue",
						"options",
						"t",
						"aria-label"
					])])]))], 8, it)) : A("", !0)
				], 64)) : z.value && !e.collectionOnly ? (m(), D(v, { key: 4 }, [y("details", {
					class: "resource-batch-step",
					open: J.groupOpen
				}, [y("summary", { onClick: n[30] ||= j((e) => J.groupOpen = !J.groupOpen, ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_USER_GROUPS")), 1), J.groupOpen ? (m(), D("div", ct, [y("label", null, [S(h(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), l(y("select", {
					"onUpdate:modelValue": n[31] ||= (e) => J.groupAction = e,
					class: "form-select resource-batch-mode-select"
				}, [
					y("option", lt, h(e.t("COM_SMARTBROWSER_BATCH_GROUP_ADD")), 1),
					y("option", ut, h(e.t("COM_SMARTBROWSER_BATCH_GROUP_REMOVE")), 1),
					y("option", dt, h(e.t("COM_SMARTBROWSER_BATCH_GROUP_SET")), 1)
				], 512), [[ee, J.groupAction]])]), y("div", ft, [y("span", null, h(e.t("COM_SMARTBROWSER_USER_GROUP")), 1), x(K, {
					modelValue: J.group,
					"onUpdate:modelValue": n[32] ||= (e) => J.group = e,
					options: Vt("group"),
					placeholder: "COM_SMARTBROWSER_SELECT_USER_GROUP",
					t: e.t,
					"aria-label": e.t("COM_SMARTBROWSER_USER_GROUP")
				}, null, 8, [
					"modelValue",
					"options",
					"t",
					"aria-label"
				])])])) : A("", !0)], 8, st), y("details", {
					class: "resource-batch-step",
					open: J.resetOpen
				}, [y("summary", { onClick: n[33] ||= j((e) => J.resetOpen = !J.resetOpen, ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), J.resetOpen ? (m(), D("div", mt, [y("label", null, [S(h(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), l(y("select", {
					"onUpdate:modelValue": n[34] ||= (e) => J.reset = e,
					class: "form-select"
				}, [y("option", ht, h(e.t("JYES")), 1), y("option", gt, h(e.t("JNO")), 1)], 512), [[ee, J.reset]])])])) : A("", !0)], 8, pt)], 64)) : A("", !0)
			]), y("div", Q, [y("div", $, [y("div", _t, h(e.t("COM_SMARTBROWSER_BATCH_PREVIEW")), 1), Yt.value.length ? (m(), D("div", vt, [(m(!0), D(v, null, i(Yt.value, (t, n) => (m(), D("div", {
				key: t.id,
				class: "resource-batch-sequence-item"
			}, [n ? (m(), D("span", yt)) : A("", !0), y("div", bt, [y("div", xt, h(t.title), 1), t.parameters.length || t.preview ? (m(), D("div", St, [(m(!0), D(v, null, i(t.parameters, (e) => (m(), D("span", { key: e }, h(e), 1))), 128)), t.preview ? (m(), D("button", {
				key: 0,
				type: "button",
				class: "resource-batch-preview-link",
				onClick: rn
			}, h(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")), 1)) : A("", !0)])) : A("", !0)])]))), 128))])) : (m(), D("p", Ct, h(e.t("COM_SMARTBROWSER_BATCH_NO_CHANGES")), 1))]), y("div", wt, [y("button", {
				type: "button",
				class: "resource-batch-items-link",
				onClick: on
			}, h(V.value.length) + " " + h(e.t(V.value.length === 1 ? "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_ONE" : "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_MANY")), 1), y("div", Tt, [y("button", {
				type: "button",
				class: "btn btn-primary",
				disabled: d.value || !Xt.value,
				onClick: Qt
			}, h(e.t("COM_SMARTBROWSER_BATCH_APPLY")), 9, Et), y("button", {
				type: "button",
				class: "btn btn-danger",
				onClick: cn
			}, h(e.t("COM_SMARTBROWSER_CANCEL")), 1)])])])], 8, Z),
			y("dialog", {
				ref_key: "previewDialog",
				ref: E,
				class: "resource-batch-preview-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")
			}, [y("div", Ot, [y("strong", null, h(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")) + " (" + h(en.value.length) + ")", 1), y("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: an
			}, null, 8, kt)]), y("div", At, [(m(!0), D(v, null, i(en.value, (e) => (m(), D("div", {
				key: e.id,
				class: "resource-batch-preview-row"
			}, [
				y("span", { title: e.before }, h(e.before), 9, jt),
				n[36] ||= y("span", {
					class: "fas fa-arrow-right",
					"aria-hidden": "true"
				}, null, -1),
				y("strong", { title: e.after }, h(e.after), 9, Mt)
			]))), 128))])], 8, Dt),
			y("dialog", {
				ref_key: "selectionDialog",
				ref: k,
				class: "resource-batch-preview-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_SELECTED_ITEMS")
			}, [y("div", Pt, [y("strong", null, h(e.t("COM_SMARTBROWSER_SELECTED_ITEMS")), 1), y("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: sn
			}, null, 8, Ft)]), y("ul", It, [(m(!0), D(v, null, i(V.value, (e) => (m(), D("li", { key: e.id }, [y("span", {
				class: F(e.icon || "fas fa-file"),
				"aria-hidden": "true"
			}, null, 2), y("span", null, h(e.title), 1)]))), 128))])], 8, Nt)
		], 64));
	}
}, Rt = {
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
}, zt = (e) => e.icon || e.headerIcon || Rt[e.id || String(e.source || "").split(".").pop()] || (e.format === "date" ? "fas fa-calendar" : "fas fa-info"), Bt = (e) => e.icon || {
	"media.caption": "fas fa-comment",
	"media.class": "fas fa-code",
	"media.figureClass": "fas fa-code",
	"media.alt": "fas fa-font",
	"media.decorative": "fas fa-image",
	"media.loading": "fas fa-clock",
	"link.text": "fas fa-font",
	"link.target": "fas fa-external-link-alt"
}[e.key] || "fas fa-info", Vt = (e) => String(e ?? "").trim().replace(/\s+/g, " "), Ht = (e) => (e || []).filter((e) => e.type === "resource" && e.visualRole === "thumbnail");
function Ut(e, t = {}) {
	let n = t["article.displayedName"], r = Wt(e, t);
	return {
		...e,
		resolvedTitle: e?.resolvedTitle ?? e?.title,
		title: e?.type === "article" && typeof n == "string" && n.trim() ? n.trim() : e?.resolvedTitle ?? e?.title,
		icon: r,
		...e?.badgeIcon && r === t["visual.iconOverride"] ? { badgeIcon: r } : {},
		visualPresentation: [
			"thumbnail",
			"icon",
			"both"
		].includes(t["visual.presentation"]) ? t["visual.presentation"] : null
	};
}
function Wt(e, t = {}) {
	if (!e || e.unavailable) return "";
	let n = t["visual.iconOverride"];
	return typeof n == "string" && n.length <= 160 && /^[a-zA-Z0-9_-]+(?: [a-zA-Z0-9_-]+)*$/.test(n) ? n : e.icon || "fas fa-file";
}
function Gt(e) {
	return !e || e.unavailable ? "" : e.thumbnail || e.metadata?.thumbnail || e.metadata?.poster || e.image || (e.type === "image" ? e.metadata?.url : "") || "";
}
function Kt(e, t = {}) {
	return [
		"category",
		"tag",
		"menu-item",
		"menu"
	].includes(e?.type) ? Wt({
		...e,
		icon: e.badgeIcon || e.icon
	}, t) : "";
}
function qt(e, t = {}, n = "") {
	return {
		...Ut(e, t),
		image: n || e?.image || Gt(e)
	};
}
function Jt(e, t = {}, n = "") {
	let r = Ut(e, t).visualPresentation, i = r === "icon" ? "" : n || Gt(e), a = r === "thumbnail" && i ? "" : Kt(e, t) || Wt(e, t);
	return {
		image: i,
		icon: a,
		typeIcon: e?.typeIcon || e?.icon || "fas fa-file",
		badgeIcon: r === "icon" ? "" : a,
		presentation: r,
		imageCrop: e?.imageCrop || null
	};
}
async function Yt(e, t, n) {
	let r = await n(t, e.picker);
	if (!r || r.unavailable || r.selectable === !1 || !Gt(r) || e.picker?.allowedResourceTypes?.length && !e.picker.allowedResourceTypes.includes(r.type)) throw Error("COM_SMARTBROWSER_USAGE_INVALID");
	return r;
}
//#endregion
//#region resources/js/core/extensionMetadata.js
var Xt = (e) => /^ext\.[a-zA-Z][a-zA-Z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)*$/.test(e), Zt = (e) => Object.fromEntries(Object.entries(e || {}).filter(([e]) => Xt(e)));
function Qt(e) {
	let t = e?.startsWith("ext.") ? e : `ext.${e}`;
	if (!Xt(t)) throw TypeError("Invalid extension metadata namespace.");
	return t;
}
function $t(e) {
	let t = /* @__PURE__ */ new Set(), n = (e, r) => {
		if (r > 24) throw TypeError("Extension metadata is too deep.");
		if (e !== null && typeof e != "string" && typeof e != "boolean" && !(typeof e == "number" && Number.isFinite(e))) {
			if (typeof e != "object" || t.has(e) || !Array.isArray(e) && Object.getPrototypeOf(e) !== Object.prototype) throw TypeError("Extension metadata must be JSON data.");
			t.add(e);
			for (let t of Object.values(e)) n(t, r + 1);
			t.delete(e);
		}
	};
	n(e, 0);
	let r = JSON.stringify(e);
	if (new TextEncoder().encode(r).length > 65536) throw TypeError("Extension metadata exceeds 64 KB.");
	return JSON.parse(r);
}
//#endregion
//#region resources/js/core/selectionUsage.js
var en = /^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/, tn = (e, t) => Object.prototype.hasOwnProperty.call(e, t), nn = (e) => e === void 0 ? void 0 : JSON.parse(JSON.stringify(e)), rn = (e) => e == null || typeof e == "string" && !e.trim(), an = /* @__PURE__ */ new Set([
	"text",
	"textarea",
	"boolean",
	"select",
	"number",
	"resource"
]), on = (e, t) => !!(e.disabledWhen && tn(t || {}, e.disabledWhen.key) && t[e.disabledWhen.key] === e.disabledWhen.equals);
function sn(e, t = {}) {
	if (!e || e.unavailable || !t || typeof t != "object") return [];
	let n = Array.isArray(e.selectionCapabilities) ? e.selectionCapabilities : [], r = /* @__PURE__ */ new Set();
	return n.flatMap((e) => {
		let n = e?.key;
		if (!en.test(n || "") || ![
			"string",
			"boolean",
			"number",
			"resource",
			"object"
		].includes(e.type) || r.has(n) || !tn(t, n) || t[n] === !1) return [];
		r.add(n);
		let i = t[n] && typeof t[n] == "object" ? t[n] : {};
		return [{
			...e,
			policy: i,
			presentation: ["secondary", "hidden"].includes(i.presentation) ? i.presentation : "primary",
			default: tn(i, "default") ? i.default : e.default,
			required: i.required === !0
		}];
	});
}
function cn(e, t) {
	if (rn(t)) return e.required ? "COM_SMARTBROWSER_USAGE_REQUIRED" : null;
	let n = e.type;
	if (n === "string" && typeof t != "string" || n === "boolean" && typeof t != "boolean" || n === "number" && (typeof t != "number" || !Number.isFinite(t)) || n === "object" && (typeof t != "object" || Array.isArray(t)) || n === "resource" && !B(t)) return "COM_SMARTBROWSER_USAGE_INVALID";
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
	let i = /* @__PURE__ */ new Map(), a = (t) => sn(t, e);
	function o(e) {
		if (!e) return {};
		let n = L(e);
		i.has(n) || i.set(n, e.unavailable ? nn(t[n] || {}) : Zt(nn(t[n] || {})));
		let r = i.get(n);
		for (let i of a(e)) tn(r, i.key) || (r[i.key] = nn(tn(t[n] || {}, i.key) ? t[n][i.key] : i.default ?? null));
		for (let t of a(e)) on(t, r) && (r[t.key] = nn(t.inactiveValue ?? null));
		return nn(r);
	}
	function s(e, t, n) {
		(Xt(t) || a(e).some((e) => e.key === t)) && (Xt(t) && (n = $t(n)), o(e), i.get(L(e))[t] = nn(n), o(e));
	}
	async function c(e) {
		let t = {}, i = {}, s = {};
		for (let c of e) {
			let e = L(c), l = o(c), u = Zt(l);
			for (let o of a(c)) {
				let a = l[o.key], s = cn(on(o, l) ? {
					...o,
					required: !1
				} : o, a);
				if (!s && o.type === "resource" && !rn(a)) {
					let e = B(a), t = o.picker || {};
					if (t.adapter && e.adapter !== t.adapter || t.allowedAdapters?.length && !t.allowedAdapters.includes(e.adapter)) s = "COM_SMARTBROWSER_USAGE_INVALID";
					else try {
						let r = await n(e, t);
						(!r || r.unavailable || r.selectable === !1 || t.selectionTarget === "item" && r.kind !== "item" || t.selectionTarget === "node" && r.kind !== "node" || t.allowedResourceTypes?.length && !t.allowedResourceTypes.includes(r.type)) && (s = "COM_SMARTBROWSER_USAGE_INVALID");
					} catch {
						s = "COM_SMARTBROWSER_USAGE_INVALID";
					}
				}
				let d = r[o.editor];
				if (o.presentation !== "hidden" && !an.has(o.editor) && !d && (s = "COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE"), !s && d?.validate) try {
					s = await d.validate(a, {
						definition: o,
						resource: c,
						values: l
					}) || null;
				} catch {
					s = "COM_SMARTBROWSER_USAGE_INVALID";
				}
				s && (t[e] ||= {}, t[e][o.key] = s, o.presentation === "hidden" && (i[e] ||= {}, i[e][o.key] = s)), u[o.key] = o.type === "resource" && !rn(a) ? B(a) : a;
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
			i.delete(L(e));
		}
	};
}
//#endregion
//#region resources/js/core/visualOverlays.js
function un({ createLayer: e, report: t = (e) => console.error(e), removeOnError: n = !1, remountWithoutUpdate: r = !1 }) {
	let i = /* @__PURE__ */ new Map(), a = (e, t) => {
		let n = {
			...e,
			signal: t.signal
		};
		typeof e.getImageElement == "function" && (n.getImageElement = () => t.signal.aborted ? null : e.getImageElement());
		for (let r of [
			"setValue",
			"setMetadata",
			"setAddress",
			"refresh",
			"resetPreview",
			"setImageElement",
			"notifyPresentationChange"
		]) typeof e[r] == "function" && (n[r] = (...n) => {
			if (t.signal.aborted) throw Error("This visual overlay is no longer active.");
			return e[r](...n);
		});
		return n;
	}, o = (e) => {
		let n = i.get(e);
		if (n) {
			i.delete(e), n.abort.abort();
			try {
				n.cleanup?.();
			} catch (e) {
				t(e);
			}
			try {
				n.definition.unmount?.(n.layer, n.context);
			} catch (e) {
				t(e);
			}
			n.layer.remove();
		}
	};
	return {
		sync(s, c, l, u) {
			let d = c.filter((e) => {
				try {
					return s && l?.resource?.id && (!e.applies || e.applies(l));
				} catch (e) {
					return t(e), !1;
				}
			});
			for (let [e, t] of i) (t.surface !== s || t.identity !== u || t.context.actionsContainer !== l?.actionsContainer || !d.includes(t.definition)) && o(e);
			for (let c of d) {
				let d = i.get(c.id);
				if (d && r && typeof c.update != "function" && (o(c.id), d = null), d) {
					Object.assign(d.context, a(l, d.abort));
					try {
						c.update?.(d.layer, d.context);
					} catch (e) {
						if (t(e), n) {
							o(c.id);
							continue;
						}
					}
				} else {
					let n = e(s, c), r = new AbortController();
					d = {
						definition: c,
						layer: n,
						surface: s,
						identity: u,
						abort: r,
						context: a(l, r)
					}, i.set(c.id, d);
					try {
						d.cleanup = c.mount(n, d.context);
					} catch (e) {
						t(e), o(c.id);
						continue;
					}
					typeof d.cleanup != "function" && (d.cleanup = null);
				}
				s.append(d.layer);
			}
			return i.size;
		},
		destroy() {
			for (let e of [...i.keys()]) o(e);
		}
	};
}
//#endregion
//#region resources/js/components/ResourceVisualOverlays.vue
var dn = {
	__name: "ResourceVisualOverlays",
	props: { context: Object },
	setup(e) {
		let t = e, n = o(null), r = t.context?.overlayRegistry || window.SmartBrowserPicker, i = o(r?.extensions?.().visualOverlays || r?.visualOverlays || []), a = r?.subscribeVisualOverlays?.((e) => {
			i.value = e;
		}), s = un({ createLayer(e, t) {
			let n = e.ownerDocument.createElement("div");
			return n.className = "resource-visual-overlay", n.dataset.overlayId = t.id, e.append(n), n;
		} });
		return w(() => [
			n.value,
			i.value,
			t.context
		], () => {
			s.sync(n.value, i.value, t.context, L(t.context?.resource));
		}, {
			deep: !0,
			flush: "post",
			immediate: !0
		}), p(() => {
			a?.(), s.destroy();
		}), (e, t) => (m(), D("div", {
			ref_key: "layer",
			ref: n,
			class: "resource-visual-overlay-layer"
		}, null, 512));
	}
};
//#endregion
//#region resources/js/core/previewRenderers.js
function fn(e) {
	let t = un({
		...e,
		removeOnError: !0,
		remountWithoutUpdate: !0
	});
	return {
		sync(n, r, i, a) {
			for (let o of r) {
				try {
					if (o.applies && !o.applies(i)) continue;
				} catch (t) {
					(e.report || console.error)(t);
					continue;
				}
				if (t.sync(n, [o], i, a)) return !0;
			}
			return t.sync(n, [], i, a), !1;
		},
		destroy: () => t.destroy()
	};
}
//#endregion
//#region resources/js/components/ResourcePreviewRenderer.vue
var pn = {
	__name: "ResourcePreviewRenderer",
	props: { context: Object },
	emits: ["active-change", "before-update"],
	setup(e, { emit: t }) {
		let n = e, i = t, a = o(null), s = o(!1);
		w(s, (e) => i("active-change", e), { flush: "sync" });
		let c = n.context?.overlayRegistry || window.SmartBrowserPicker, u = o(c?.extensions?.().previewRenderers || c?.previewRenderers || []), d = c?.subscribePreviewRenderers?.((e) => {
			u.value = e;
		}), f = fn({ createLayer(e, t) {
			let n = e.ownerDocument.createElement("div");
			return n.className = "resource-preview-renderer", n.dataset.rendererId = t.id, e.append(n), n;
		} });
		return w(() => [
			a.value,
			u.value,
			n.context
		], () => {
			i("before-update"), s.value = f.sync(a.value, u.value, n.context, L(n.context?.resource));
		}, {
			deep: !0,
			flush: "post",
			immediate: !0
		}), p(() => {
			d?.(), f.destroy();
		}), (e, t) => (m(), D(v, null, [s.value ? A("", !0) : r(e.$slots, "default", {}, void 0, void 0, 0), l(y("div", {
			ref_key: "surface",
			ref: a,
			class: "resource-preview-renderer-layer"
		}, null, 512), [[g, s.value]])], 64));
	}
}, mn = {
	__name: "ResourceImagePresentation",
	props: {
		imageElement: Object,
		context: Object
	},
	emits: ["providers-change"],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, a = r.context?.overlayRegistry || window.SmartBrowserPicker, c = s(a?.extensions?.().imagePresentations || a?.imagePresentations || []), l = a?.subscribeImagePresentations?.((e) => {
			c.value = e, i("providers-change");
		}), u = V(), d = o(0), f = () => {
			d.value++;
		};
		return w(() => r.imageElement, (e, t) => {
			t?.removeEventListener("load", f), e?.addEventListener("load", f);
		}, {
			flush: "sync",
			immediate: !0
		}), t({ release: () => u.destroy() }), w(() => r.context, () => u.destroy(), {
			deep: !0,
			flush: "pre"
		}), w(() => [
			r.imageElement,
			r.context,
			c.value,
			d.value
		], () => {
			u.sync(r.imageElement, c.value, r.context);
		}, {
			deep: !0,
			flush: "post",
			immediate: !0
		}), p(() => {
			r.imageElement?.removeEventListener("load", f), l?.(), u.destroy();
		}), (e, t) => null;
	}
}, hn = { class: "resource-lightweight-area" }, gn = {
	key: 0,
	class: "resource-lightweight-actions resource-lightweight-eye-action"
}, _n = ["title", "aria-label"], vn = [
	"disabled",
	"title",
	"aria-label"
], yn = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], bn = {
	key: 0,
	class: "text-danger",
	role: "alert"
}, xn = {
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
		overlayContext: Object,
		t: Function
	},
	emits: ["change", "preview"],
	setup(e, { expose: t, emit: n }) {
		let a = e, u = n, d = M(() => Ht(a.definitions)), f = M(() => a.editable ? d.value.filter((e) => e.presentation !== "hidden") : []), _ = M(() => d.value.find((e) => a.values?.[e.key])), S = o(""), C = o(""), T = o(!1), E = o(null), O = o(null), k = o(null), ee = s(null), j = s(null), te = o(!1), N = o(null), P = o(null), ne = o(0), I = null, R = M(() => te.value ? j.value : ee.value), z = (e) => {
			te.value || P.value?.refreshPresentation(), I?.onPresentationChange?.(e), E.value?.dispatchEvent(new CustomEvent("smartbrowser:image-presentation-change", {
				detail: e,
				bubbles: !0
			}));
		}, V = (e, t = {}) => {
			if (e != null && (e.tagName !== "IMG" || !E.value?.contains(e))) throw TypeError("The primary image must belong to this preview.");
			N.value?.release();
			let n = { onPresentationChange: t.onPresentationChange };
			return I = n, j.value = e, ne.value++, () => {
				I === n && (N.value?.release(), I = null, j.value = null);
			};
		}, H = M(() => a.overlayContext ? {
			...a.overlayContext,
			actionsContainer: k.value,
			visualElement: E.value,
			imageElement: R.value,
			getImageElement: () => R.value,
			imageUrl: G.value,
			imageVersion: ne.value,
			resolvedImage: O.value || a.resource,
			values: a.values || {},
			notifyPresentationChange: z
		} : null), U = o(0), ie = M(() => (U.value, !!(_.value || a.overlayContext?.hasPreviewChanges?.())));
		async function W() {
			T.value = !0;
			try {
				if (a.overlayContext?.resetPreview) await a.overlayContext.resetPreview();
				else for (let e of f.value) u("change", e.key, null);
			} catch {
				C.value = "COM_SMARTBROWSER_USAGE_INVALID";
			} finally {
				T.value = !1;
			}
		}
		let G = M(() => a.contentOnly && a.resource?.type === "image" ? a.resource.image || a.resource.metadata?.url || Gt(a.resource) : S.value || Gt(a.resource)), K = M(() => ({
			...qt(a.resource, a.values, S.value),
			imageCrop: O.value?.imageCrop || a.resource?.imageCrop
		})), q = M(() => ({
			...a.overlayContext,
			resource: a.resource,
			visualElement: E.value,
			setImageElement: V,
			getImageElement: () => R.value,
			imageUrl: G.value,
			resolvedImage: O.value || a.resource,
			actionsContainer: k.value,
			values: a.values || {},
			visuals: Jt(K.value, a.values, G.value),
			isReadOnly: a.overlayContext?.isReadOnly !== !1,
			purpose: "preview"
		})), J = 0, Y = !1;
		w(() => [
			L(a.resource),
			_.value,
			_.value && a.values?.[_.value.key]
		], async () => {
			let e = ++J;
			S.value = "", O.value = null, C.value = "";
			let t = _.value;
			if (t) try {
				let n = await Yt(t, a.values[t.key], a.resolveReference);
				if (e !== J) return;
				O.value = n, S.value = Gt(n);
			} catch {
				e === J && (C.value = "COM_SMARTBROWSER_USAGE_INVALID");
			}
		}, {
			immediate: !0,
			deep: !0
		});
		async function X(e) {
			let t = L(a.resource);
			T.value = !0;
			try {
				let n = await window.SmartBrowserPicker.open({
					...e.picker,
					viewPreferenceKey: e.picker.viewPreferenceKey || "supjx.smartbrowser.thumbnail",
					title: a.t("COM_SMARTBROWSER_SELECT_THUMBNAIL"),
					subtitle: a.resource.title,
					confirmLabel: a.t("COM_SMARTBROWSER_USE_THUMBNAIL"),
					multiple: !1,
					initialSelection: a.values?.[e.key] ? [a.values[e.key].id] : []
				});
				n && !Y && L(a.resource) === t && u("change", e.key, B({
					adapter: e.picker.adapter,
					id: n.id
				}));
			} catch {
				!Y && L(a.resource) === t && (C.value = "COM_SMARTBROWSER_USAGE_INVALID");
			} finally {
				T.value = !1;
			}
		}
		return t({ element: E }), p(() => {
			Y = !0, ++J;
		}), (t, n) => (m(), D(v, null, [y("div", hn, [
			l(y("div", {
				ref_key: "surface",
				ref: E,
				class: F(["resource-lightweight-visual", {
					"has-override": !!_.value,
					"is-information-visual": !e.contentOnly,
					"is-grid-information": !e.contentOnly && e.resource?.type !== "image",
					"has-unavailable-content": e.contentOnly && e.resource?.id && !G.value
				}])
			}, [
				e.contentOnly ? e.nativePreview ? A("", !0) : (m(), b(pn, {
					key: 1,
					context: q.value,
					onActiveChange: n[1] ||= (e) => te.value = e,
					onBeforeUpdate: n[2] ||= (e) => N.value?.release()
				}, {
					default: c(() => [x(re, {
						ref_key: "fallbackVisual",
						ref: P,
						resource: K.value,
						"presentation-managed": "",
						onImageChange: n[0] ||= (e) => ee.value = e
					}, null, 8, ["resource"])]),
					_: 1
				}, 8, ["context"])) : (m(), b(re, {
					key: 0,
					resource: e.resource,
					"fit-content": e.resource.type === "image"
				}, null, 8, ["resource", "fit-content"])),
				H.value && !e.nativePreview ? (m(), b(dn, {
					key: 2,
					context: H.value
				}, null, 8, ["context"])) : A("", !0),
				H.value && e.contentOnly && !e.nativePreview ? (m(), b(mn, {
					key: 3,
					ref_key: "presentation",
					ref: N,
					"image-element": R.value,
					context: H.value,
					onProvidersChange: n[3] ||= (e) => U.value++
				}, null, 8, ["image-element", "context"])) : A("", !0)
			], 2), [[g, !e.nativePreview]]),
			e.canPreview ? (m(), D("div", gn, [e.canPreview ? (m(), D("button", {
				key: 0,
				type: "button",
				class: "resource-lightweight-icon-action",
				title: e.t("COM_SMARTBROWSER_ACTION_PREVIEW"),
				"aria-label": e.t("COM_SMARTBROWSER_ACTION_PREVIEW"),
				onClick: n[4] ||= (e) => t.$emit("preview")
			}, [...n[5] ||= [y("span", {
				class: "fas fa-eye",
				"aria-hidden": "true"
			}, null, -1)]], 8, _n)) : A("", !0)])) : A("", !0),
			y("div", {
				ref_key: "previewActionsEl",
				ref: k,
				class: "resource-lightweight-actions resource-lightweight-preview-action"
			}, [
				e.editable && ie.value ? (m(), D("button", {
					key: 0,
					type: "button",
					class: "resource-lightweight-icon-action",
					disabled: T.value,
					title: e.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					"aria-label": e.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					onClick: W
				}, [...n[6] ||= [y("span", {
					class: "fas fa-times",
					"aria-hidden": "true"
				}, null, -1)]], 8, vn)) : A("", !0),
				(m(!0), D(v, null, i(f.value, (t) => (m(), D("button", {
					key: t.key,
					type: "button",
					class: F({ selected: !!e.values?.[t.key] }),
					disabled: T.value,
					title: e.t(e.values?.[t.key] ? "COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL" : "COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL"),
					"aria-label": e.t(e.values?.[t.key] ? "COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL" : "COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL"),
					onClick: (e) => X(t)
				}, [...n[7] ||= [y("span", {
					class: "fas fa-image",
					"aria-hidden": "true"
				}, null, -1)]], 10, yn))), 128)),
				r(t.$slots, "actions")
			], 512)
		]), C.value || d.value.some((t) => e.errors?.[t.key]) ? (m(), D("small", bn, h(e.t(C.value || e.errors[d.value.find((t) => e.errors?.[t.key]).key])), 1)) : A("", !0)], 64));
	}
}, Sn = {
	__name: "ResourceActionIcon",
	props: { icon: String },
	setup(e) {
		return (t, n) => (m(), D("span", {
			class: F(e.icon === "arrow-down-up-across-line" ? "fas fa-arrow-down-up-across-line" : e.icon),
			"aria-hidden": "true"
		}, null, 2));
	}
}, Cn = { class: "resource-usage-field" }, wn = {
	key: 0,
	"aria-hidden": "true"
}, Tn = [
	"value",
	"disabled",
	"required",
	"aria-invalid"
], En = [
	"value",
	"required",
	"aria-invalid"
], Dn = {
	key: 3,
	class: "resource-usage-check"
}, On = ["checked"], kn = ["value", "aria-invalid"], An = {
	key: 0,
	value: ""
}, jn = ["value"], Mn = ["value", "aria-invalid"], Nn = ["value"], Pn = { value: "auto" }, Fn = { value: "custom" }, In = {
	key: 0,
	class: "resource-usage-reference"
}, Ln = { key: 0 }, Rn = ["disabled"], zn = ["title", "aria-label"], Bn = {
	key: 8,
	class: "text-danger"
}, Vn = { key: 9 }, Hn = {
	key: 10,
	class: "text-danger",
	role: "alert"
}, Un = {
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
	setup(e, { emit: t }) {
		let n = e, r = t, a = `sb-usage-${Math.random().toString(36).slice(2)}`, s = o(n.value ? "custom" : "auto"), c = o(""), l = o(!1), u = o(""), d = o(n.value ?? ""), g = o(null), _ = M(() => n.editors?.[n.definition.editor]), b = M(() => on(n.definition, n.values)), x, C, T = 0, E = !1, O = (e) => {
			u.value = "", r("change", e);
		}, k = (e) => {
			n.definition.key === "visual.iconOverride" ? (d.value = e, O(Vt(e))) : O(e);
		}, ee = () => {
			s.value = "auto", O(null);
		}, j = (e) => {
			s.value = e, e === "auto" && O(null);
		};
		w(() => n.value, async (e) => {
			n.definition.key === "visual.iconOverride" && Vt(d.value) !== (e ?? "") && (d.value = e ?? "");
			let t = ++T;
			if (u.value = "", c.value = "", n.definition.type === "resource" && e) {
				s.value = "custom";
				try {
					let r = await n.resolveReference(e, n.definition.picker);
					t === T && (c.value = r?.title || "", (!r || r.unavailable) && (u.value = "COM_SMARTBROWSER_USAGE_INVALID"));
				} catch {
					t === T && (u.value = "COM_SMARTBROWSER_USAGE_INVALID");
				}
			}
		}, { immediate: !0 });
		async function te() {
			l.value = !0;
			try {
				let e = await window.SmartBrowserPicker.open({
					...n.definition.picker,
					multiple: !1,
					initialSelection: n.value ? [n.value.id] : []
				});
				e && !E && O(B({
					adapter: n.definition.picker.adapter,
					id: e.id
				}));
			} catch {
				u.value = "COM_SMARTBROWSER_USAGE_INVALID";
			} finally {
				l.value = !1;
			}
		}
		return w([_, () => L(n.resource)], async () => {
			if (C?.abort(), x?.destroy?.(), x = null, await P(), !E && _.value && g.value) {
				C = new AbortController();
				try {
					x = _.value.mount(g.value, {
						definition: n.definition,
						resource: n.resource,
						id: a,
						value: n.value,
						values: n.values,
						setValue: O,
						signal: C.signal,
						translate: n.t
					}) || null;
				} catch {
					u.value = "COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE";
				}
			}
		}, { immediate: !0 }), w(() => [n.value, n.values], () => x?.update?.({
			value: n.value,
			values: n.values
		}), { deep: !0 }), p(() => {
			E = !0, ++T, C?.abort(), x?.destroy?.();
		}), (t, n) => (m(), D("div", Cn, [
			e.definition.editor === "boolean" ? A("", !0) : (m(), D("label", {
				key: 0,
				for: a
			}, [
				y("span", {
					class: F(f(Bt)(e.definition)),
					"aria-hidden": "true"
				}, null, 2),
				S(h(e.t(e.definition.label)), 1),
				e.definition.required ? (m(), D("span", wn, " *")) : A("", !0)
			])),
			e.definition.editor === "text" ? (m(), D("input", {
				key: 1,
				id: a,
				class: "form-control",
				type: "text",
				value: e.definition.key === "visual.iconOverride" ? d.value : e.value ?? "",
				disabled: b.value,
				required: e.definition.required && !b.value,
				"aria-invalid": !!e.error,
				onInput: n[0] ||= (e) => k(e.target.value)
			}, null, 40, Tn)) : e.definition.editor === "textarea" ? (m(), D("textarea", {
				key: 2,
				id: a,
				class: "form-control",
				rows: "3",
				value: e.value ?? "",
				required: e.definition.required,
				"aria-invalid": !!e.error,
				onInput: n[1] ||= (e) => O(e.target.value)
			}, null, 40, En)) : e.definition.editor === "boolean" ? (m(), D("label", Dn, [
				y("input", {
					id: a,
					class: "form-check-input",
					type: "checkbox",
					checked: e.value === !0,
					onChange: n[2] ||= (e) => O(e.target.checked)
				}, null, 40, On),
				e.definition.key === "media.decorative" ? A("", !0) : (m(), D("span", {
					key: 0,
					class: F(f(Bt)(e.definition)),
					"aria-hidden": "true"
				}, null, 2)),
				S(h(e.t(e.definition.label)), 1)
			])) : e.definition.editor === "select" ? (m(), D("select", {
				key: 4,
				id: a,
				class: "form-select",
				value: e.value ?? "",
				"aria-invalid": !!e.error,
				onChange: n[3] ||= (t) => O(e.definition.options.find((e) => String(e.value) === t.target.value)?.value)
			}, [!e.definition.required && !e.definition.options?.some((e) => e.value === "") ? (m(), D("option", An, h(e.t(e.definition.key === "visual.presentation" ? "COM_SMARTBROWSER_USAGE_DEFAULT" : "COM_SMARTBROWSER_USAGE_CHOOSE")), 1)) : A("", !0), (m(!0), D(v, null, i(e.definition.options, (t) => (m(), D("option", {
				key: String(t.value),
				value: t.value
			}, h(e.t(t.label)), 9, jn))), 128))], 40, kn)) : e.definition.editor === "number" ? (m(), D("input", {
				key: 5,
				id: a,
				class: "form-control",
				type: "number",
				value: e.value ?? "",
				"aria-invalid": !!e.error,
				onInput: n[4] ||= (e) => O(e.target.value === "" ? null : Number(e.target.value))
			}, null, 40, Mn)) : e.definition.editor === "resource" ? (m(), D(v, { key: 6 }, [y("select", {
				id: a,
				class: "form-select",
				value: s.value,
				onChange: n[5] ||= (e) => j(e.target.value)
			}, [y("option", Pn, h(e.t("COM_SMARTBROWSER_USAGE_AUTO")), 1), y("option", Fn, h(e.t("COM_SMARTBROWSER_USAGE_CUSTOM")), 1)], 40, Nn), s.value === "custom" ? (m(), D("div", In, [
				e.value ? (m(), D("span", Ln, h(c.value || e.value.id), 1)) : A("", !0),
				y("button", {
					type: "button",
					class: "btn btn-outline-primary",
					disabled: l.value,
					onClick: te
				}, [n[6] ||= y("span", {
					class: "fas fa-plus",
					"aria-hidden": "true"
				}, null, -1), S(" " + h(e.t(e.definition.pickerLabel || "COM_SMARTBROWSER_USAGE_PICK_RESOURCE")), 1)], 8, Rn),
				e.value ? (m(), D("button", {
					key: 1,
					type: "button",
					class: "btn btn-outline-secondary",
					title: e.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					"aria-label": e.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					onClick: ee
				}, [...n[7] ||= [y("span", {
					class: "fas fa-times",
					"aria-hidden": "true"
				}, null, -1)]], 8, zn)) : A("", !0)
			])) : A("", !0)], 64)) : _.value ? (m(), D("div", {
				key: 7,
				ref_key: "customContainer",
				ref: g
			}, null, 512)) : (m(), D("small", Bn, h(e.t("COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE")), 1)),
			e.definition.description ? (m(), D("small", Vn, h(e.t(e.definition.description)), 1)) : A("", !0),
			e.error || u.value ? (m(), D("small", Hn, h(e.t(e.error || u.value)), 1)) : A("", !0)
		]));
	}
}, Wn = { class: "resource-usage-editor" }, Gn = ["open"], Kn = {
	__name: "SelectionUsageEditor",
	props: /*@__PURE__*/ ne({
		definitions: Array,
		values: Object,
		errors: Object,
		resource: Object,
		t: Function,
		editors: Object,
		resolveReference: Function
	}, {
		secondaryOpen: {
			type: Boolean,
			default: !1
		},
		secondaryOpenModifiers: {}
	}),
	emits: /*@__PURE__*/ ne(["change"], ["update:secondaryOpen"]),
	setup(t) {
		let n = t, r = e(t, "secondaryOpen"), a = M(() => n.definitions.filter((e) => e.presentation === "primary")), o = M(() => n.definitions.filter((e) => e.presentation === "secondary")), s = (e) => ({
			definition: e,
			value: n.values[e.key],
			values: n.values,
			error: n.errors?.[e.key],
			resource: n.resource,
			t: n.t,
			editors: n.editors,
			resolveReference: n.resolveReference
		});
		return (e, n) => (m(), D("div", Wn, [(m(!0), D(v, null, i(a.value, (t) => (m(), b(Un, _({ key: t.key }, { ref_for: !0 }, s(t), { onChange: (n) => e.$emit("change", t.key, n) }), null, 16, ["onChange"]))), 128)), o.value.length ? (m(), D("details", {
			key: 0,
			class: "resource-usage-secondary",
			open: r.value || o.value.some((e) => t.errors?.[e.key]),
			onToggle: n[0] ||= (e) => r.value = e.target.open
		}, [y("summary", null, [n[1] ||= y("span", {
			class: "fas fa-chevron-right resource-usage-secondary-chevron",
			"aria-hidden": "true"
		}, null, -1), S(h(t.t("COM_SMARTBROWSER_USAGE_MORE")), 1)]), (m(!0), D(v, null, i(o.value, (t) => (m(), b(Un, _({ key: t.key }, { ref_for: !0 }, s(t), { onChange: (n) => e.$emit("change", t.key, n) }), null, 16, ["onChange"]))), 128))], 40, Gn)) : A("", !0)]));
	}
}, qn = {
	__name: "ResourceInfoScroller",
	props: {
		disabled: Boolean,
		resourceKey: String,
		tab: String
	},
	setup(e) {
		let t = e, i = o(null), a = o(null), s = /* @__PURE__ */ new Map(), c = 0, l = 0, u = !1, d, f = () => {
			if (u || !i.value) return;
			let e = i.value, n = e.scrollHeight - e.clientHeight;
			s.set(t.tab, n > 0 ? e.scrollTop / n : 0);
		}, h = () => {
			i.value && (u = !0, cancelAnimationFrame(c), cancelAnimationFrame(l), c = requestAnimationFrame(() => {
				let e = i.value;
				e && (e.scrollTop = (s.get(t.tab) || 0) * Math.max(0, e.scrollHeight - e.clientHeight)), l = requestAnimationFrame(() => {
					u = !1;
				});
			}));
		};
		return w(() => [t.resourceKey, t.tab], h, { flush: "post" }), N(h), n(() => {
			a.value && (d = new ResizeObserver(h), d.observe(a.value));
		}), p(() => {
			d?.disconnect(), cancelAnimationFrame(c), cancelAnimationFrame(l);
		}), (t, n) => e.disabled ? r(t.$slots, "default", {}, void 0, void 0, 0) : (m(), D("div", {
			key: 1,
			ref_key: "viewport",
			ref: i,
			class: "resource-info-scroll",
			onScroll: f
		}, [y("div", {
			ref_key: "content",
			ref: a,
			class: "resource-info-scroll-content"
		}, [r(t.$slots, "default")], 512)], 544));
	}
}, Jn = (e) => String(e ?? "").replaceAll(" / ", " » "), Yn = (e, t) => ({
	...e,
	label: e.source === "metadata.categoryPath" ? "COM_SMARTBROWSER_LOCATION" : e.source === "metadata.tagPaths" ? t?.type === "tag" ? "COM_SMARTBROWSER_LOCATION" : "COM_SMARTBROWSER_TAGS" : e.label
}), Xn = [
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
})), Zn = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e);
function Qn(e, t = {}) {
	return {
		...e,
		image: e?.effectiveThumbnail || Gt(e),
		selectionType: e?.metadata?.typeLabel || e?.type || "",
		selectionPath: $n(e)
	};
}
function $n(e) {
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
var er = [
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
er.slice(1, 3);
var tr = [
	...er.map((e) => ({
		...e,
		defaultVisible: !0
	})),
	{
		id: "selectionId",
		source: "id",
		label: "JGRID_HEADING_ID",
		headerIcon: "fas fa-hashtag",
		defaultVisible: !1
	},
	{
		id: "type",
		source: "selectionType",
		label: "COM_SMARTBROWSER_TYPE",
		headerIcon: "fas fa-shapes",
		defaultVisible: !1
	},
	{
		id: "created",
		source: "metadata.created",
		label: "JGLOBAL_FIELD_CREATED_LABEL",
		headerIcon: "fas fa-calendar-plus",
		format: "date",
		defaultVisible: !1
	},
	{
		id: "modified",
		source: "metadata.modified",
		label: "JGLOBAL_FIELD_MODIFIED_LABEL",
		headerIcon: "fas fa-calendar-alt",
		format: "date",
		defaultVisible: !1
	}
], nr = tr.filter((e) => e.id !== "status").map((e) => ({
	id: e.id,
	label: e.label
}));
function rr(e, t, n = "asc") {
	let r = tr.find((e) => e.id === t);
	if (!r) return [...e];
	let i = (e) => Zn(e, r.source || r.id);
	return [...e].sort((e, t) => {
		let r = i(e), a = i(t), o = r == null || r === "", s = a == null || a === "";
		if (o || s) return Number(o) - Number(s);
		let c = typeof r == "number" && typeof a == "number" ? r - a : String(r).localeCompare(String(a), void 0, {
			numeric: !0,
			sensitivity: "base"
		});
		return n === "desc" ? -c : c;
	});
}
function ir(e, t) {
	let n = {
		image: "COM_SMARTBROWSER_MEDIA_IMAGE",
		document: "COM_SMARTBROWSER_MEDIA_DOCUMENT",
		video: "COM_SMARTBROWSER_MEDIA_VIDEO",
		audio: "COM_SMARTBROWSER_MEDIA_AUDIO",
		folder: "COM_SMARTBROWSER_FOLDER"
	}[e?.type], r = e?.metadata?.typeLabel || e?.type || "";
	return n ? t(n) : r ? r.charAt(0).toUpperCase() + r.slice(1) : t("COM_SMARTBROWSER_RESOURCE");
}
function ar(e, t) {
	return !e.readOnly && typeof e.onAdd == "function" && t < (e.multiple === !1 ? 1 : e.maxSelections || 500);
}
function or(e = "auto", t = 0) {
	return e === "auto" ? t >= 800 ? "right" : "bottom" : ["left", "right"].includes(e) && t < 640 ? "bottom" : e;
}
//#endregion
//#region resources/js/components/ResourceInfoPanel.vue
var sr = {
	key: 0,
	class: "resource-info-tabs",
	role: "tablist"
}, cr = ["aria-selected"], lr = ["aria-selected"], ur = {
	key: 0,
	class: "sb-preview-selection-actions"
}, dr = [
	"disabled",
	"title",
	"aria-label"
], fr = {
	key: 0,
	class: "alert alert-warning",
	role: "status"
}, pr = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], mr = { key: 2 }, hr = { key: 3 }, gr = {
	key: 4,
	class: "sb-preview-selection-actions"
}, _r = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], vr = { class: "sb-info-details" }, yr = {
	key: 0,
	class: "resource-selection-information"
}, br = { class: "resource-selection-path" }, xr = [
	"value",
	"title",
	"aria-label"
], Sr = ["title", "aria-label"], Cr = {
	class: "visually-hidden",
	role: "status"
}, wr = {
	key: 1,
	class: "resource-selection-usage"
}, Tr = { key: 0 }, Er = {
	key: 0,
	class: "resource-language"
}, Dr = ["src"], Or = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, kr = {
	key: 2,
	class: "resource-info-timezone"
}, Ar = { key: 1 }, jr = { key: 0 }, Mr = { key: 1 }, Nr = {
	key: 0,
	class: "resource-info-timezone"
}, Pr = { key: 2 }, Fr = {
	key: 0,
	class: "resource-info-timezone"
}, Ir = { key: 3 }, Lr = { key: 4 }, Rr = { key: 5 }, zr = { key: 6 }, Br = {
	key: 4,
	class: "resource-info-empty",
	role: "status"
}, Vr = ["disabled"], Hr = {
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
	setup(e) {
		let t = e, n = M(() => t.address ?? $n(t.resource)), a = o(!1), u = M(() => !!(t.usageDefinitions?.length || t.previewContext && (t.previewContext.isReadOnly === !1 || Object.values(t.usageValues || {}).some((e) => e != null && e !== "")))), d = M(() => t.selectionOnly || u.value && N.value === "usage"), _ = M(() => t.resource?.unavailable ? t.t("COM_SMARTBROWSER_SELECTION_UNAVAILABLE") : d.value ? Ut(t.resource, t.usageValues).title : t.resource?.title), C = Bt, T = o(!1), E, O = 0, k = () => {
			O++, clearTimeout(E), T.value = !1;
		};
		w(n, k), p(k);
		async function ee(e) {
			k();
			let n = O;
			try {
				if (await navigator.clipboard.writeText(Array.isArray(e) ? e.join("\n") : String(e)), n !== O) return;
				T.value = !0, E = setTimeout(k, 1600);
			} catch {
				window.Joomla?.renderMessages?.({ error: [t.t("COM_SMARTBROWSER_COPY_FAILED")] });
			}
		}
		let j = (e) => {
			let n = t.usageValues?.[e.key];
			if (n == null || n === "") return "—";
			if (typeof n == "boolean") return t.t(n ? "JYES" : "JNO");
			let r = e.options?.find((e) => e.value === n);
			return r ? t.t(r.label) : e.type === "resource" ? n.id : typeof n == "object" ? JSON.stringify(n) : String(n);
		}, te = M(() => (t.usageDefinitions || []).filter((e) => !Ht([e]).length)), N = o("info"), P = o("usage"), ne = (e) => {
			P.value = e, N.value = e;
		}, I = o(!1), R = o(null), z = o(null), B = s(null), V = o(""), re;
		w(() => [z.value, t.nativePreview], () => {
			re?.disconnect();
			let e = z.value;
			if (!e || !t.nativePreview) {
				B.value = null, V.value = "";
				return;
			}
			let n = () => {
				B.value = [...e.querySelectorAll("img")].find((e) => !e.closest(".resource-visual-overlay-layer")) || null, V.value = B.value?.getAttribute("src") || "";
			};
			re = new MutationObserver(n), re.observe(e, {
				subtree: !0,
				childList: !0,
				attributes: !0,
				attributeFilter: ["src"]
			}), n();
		}, {
			flush: "post",
			immediate: !0
		}), p(() => re?.disconnect());
		let H = M(() => ({
			...t.previewContext,
			visualElement: z.value,
			imageElement: B.value,
			getImageElement: () => B.value,
			imageUrl: V.value,
			resolvedImage: t.resource,
			values: t.usageValues || {},
			notifyPresentationChange: (e) => z.value?.dispatchEvent(new CustomEvent("smartbrowser:image-presentation-change", {
				detail: e,
				bubbles: !0
			}))
		})), U;
		w(() => L(t.resource), () => U?.abort()), p(() => U?.abort()), w(u, (e) => {
			N.value = e ? P.value : "info";
		}, { immediate: !0 }), w(() => t.usageRevision, () => {
			u.value && (N.value = "usage");
		});
		async function ie(e) {
			I.value = !0, U = new AbortController();
			let n = U.signal;
			try {
				await e.run({
					...t.previewContext,
					previewElement: t.nativePreview ? z.value : R.value?.element,
					signal: n
				});
			} catch (e) {
				n.aborted || Joomla.renderMessages({ error: [e.message || t.t("COM_SMARTBROWSER_USAGE_INVALID")] });
			} finally {
				I.value = !1;
			}
		}
		let W = M(() => {
			let e = (t.resource?.infoFields?.length ? t.resource.infoFields : t.fields || []).filter((e) => (!e.kinds || e.kinds.includes(t.resource?.kind)) && ![
				"metadata.locationPath",
				"metadata.category",
				"metadata.tags"
			].includes(e.source)), n = new Set(e.map((e) => e.source));
			return [...e, ...Xn.filter((e) => {
				let r = t.resource?.metadata?.[e.source.split(".")[1]];
				return !n.has(e.source) && r != null && r !== "";
			})].map((e) => Yn(e, t.resource));
		}), G = zt, K = M(() => t.selectionOnly ? ir(t.resource, t.t) : t.resource?.kind === "node" ? t.t("COM_SMARTBROWSER_FOLDER") : t.resource?.type ? t.resource.type.charAt(0).toUpperCase() + t.resource.type.slice(1) : t.t("COM_SMARTBROWSER_RESOURCE")), q = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, J = (e) => `${(e / 1024).toFixed(2)} KB`, Y = (e) => String(e.source || "").split(".").reduce((e, t) => e?.[t], t.resource), X = (e) => [
			"metadata.categoryPath",
			"metadata.tagPaths",
			"metadata.locationPath"
		].includes(e.source) ? Jn(Y(e)) : (e.format === "language" || e.source === "metadata.language") && Y(e) === "*" ? t.t("COM_SMARTBROWSER_ALL_LANGUAGES") : e.format === "date" ? q(Y(e)) : e.format === "size" ? Y(e) !== null && Y(e) !== void 0 ? J(Y(e)) : "" : e.format === "dimensions" ? t.resource?.metadata.width && t.resource?.metadata.height ? `${t.resource.metadata.width}px \u00d7 ${t.resource.metadata.height}px` : "" : Y(e), Z = (e) => {
			let n = String(e || "").trim().match(/(Z|[+-]\d{2}:?\d{2})$/i);
			if (!n) return "";
			let r = n[1].toUpperCase() === "Z" ? 0 : (n[1].startsWith("-") ? -1 : 1) * (Number(n[1].slice(1, 3)) * 60 + Number(n[1].slice(-2)));
			if (r === -new Date(e).getTimezoneOffset()) return "";
			let i = r >= 0 ? "+" : "-", a = Math.abs(r), o = r === 0 ? "UTC" : `UTC${i}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
			return `${t.t("COM_SMARTBROWSER_SOURCE_TIMEZONE")}: ${o}`;
		};
		return (t, o) => (m(), D("aside", { class: F(["resource-info-panel", {
			"has-usage": u.value,
			"showing-usage": u.value && N.value === "usage",
			"is-empty-selection": e.selectionOnly && !e.resource,
			"is-selection-panel": e.selectionOnly
		}]) }, [e.resource && !e.selectionOnly && u.value ? (m(), D("div", sr, [y("button", {
			type: "button",
			role: "tab",
			"aria-selected": N.value === "usage",
			onClick: o[0] ||= (e) => ne("usage")
		}, h(e.t("COM_SMARTBROWSER_USAGE_OPTIONS")), 9, cr), y("button", {
			type: "button",
			role: "tab",
			"aria-selected": N.value === "info",
			onClick: o[1] ||= (e) => ne("info")
		}, h(e.t("COM_SMARTBROWSER_USAGE_INFO")), 9, lr)])) : A("", !0), x(qn, {
			disabled: e.selectionOnly,
			"resource-key": f(L)(e.resource),
			tab: N.value
		}, {
			default: c(() => [
				e.selectionOnly ? l((m(), D("div", {
					key: 0,
					ref_key: "nativePreviewElement",
					ref: z,
					class: "sb-native-preview-host"
				}, [e.nativePreview && e.resource ? (m(), b(dn, {
					key: 0,
					context: H.value
				}, null, 8, ["context"])) : A("", !0), e.nativePreview && e.resource ? (m(), b(mn, {
					key: 1,
					"image-element": B.value,
					context: H.value
				}, null, 8, ["image-element", "context"])) : A("", !0)], 512)), [[g, e.nativePreview]]) : A("", !0),
				e.selectionOnly && !e.resource && !e.nativePreview ? (m(), b(xn, {
					key: 1,
					resource: {
						id: "",
						metadata: {}
					},
					definitions: [],
					values: {},
					"content-only": "",
					t: e.t
				}, null, 8, ["t"])) : A("", !0),
				e.selectionOnly && !e.resource ? (m(), D(v, { key: 2 }, [y("h3", null, h(e.t(e.nativePreview ? "COM_SMARTBROWSER_NO_IMAGE_SELECTED" : "COM_SMARTBROWSER_COLLECTION_EMPTY")), 1), e.allowQuickAdd ? (m(), D("div", ur, [y("button", {
					type: "button",
					class: "resource-preview-add",
					disabled: e.addDisabled,
					title: e.t("COM_SMARTBROWSER_COLLECTION_ADD"),
					"aria-label": e.t("COM_SMARTBROWSER_COLLECTION_ADD"),
					onClick: o[2] ||= (e) => t.$emit("selection-add")
				}, [...o[9] ||= [y("span", { class: "fas fa-plus" }, null, -1)]], 8, dr)])) : A("", !0)], 64)) : A("", !0),
				e.resource ? (m(), D(v, { key: 3 }, [
					e.resource.unavailable || e.resource.metadata?.state === -2 ? (m(), D("p", fr, h(e.t("COM_SMARTBROWSER_SELECTION_UNAVAILABLE")), 1)) : A("", !0),
					!e.resource.unavailable && e.resource.metadata?.state !== -2 ? (m(), b(xn, {
						key: 1,
						ref_key: "previewElement",
						ref: R,
						"overlay-context": d.value ? e.previewContext : null,
						resource: e.resource,
						definitions: d.value ? e.usageDefinitions : [],
						values: d.value ? e.usageValues : {},
						errors: d.value ? e.usageErrors : {},
						"resolve-reference": e.resolveReference,
						"can-preview": e.canPreview,
						"native-preview": e.nativePreview,
						"content-only": d.value,
						editable: e.selectionOnly ? e.usageMode === "editable" : d.value && e.previewContext?.isReadOnly === !1,
						t: e.t,
						onPreview: o[3] ||= (e) => t.$emit("preview"),
						onChange: o[4] ||= (e, n) => t.$emit("usage-change", e, n)
					}, {
						actions: c(() => [(m(!0), D(v, null, i(d.value ? e.previewActions : [], (t) => (m(), D("button", {
							key: t.id,
							type: "button",
							disabled: I.value,
							title: e.t(t.label),
							"aria-label": e.t(t.label),
							onClick: (e) => ie(t)
						}, [y("span", {
							class: F(t.icon || "fas fa-bolt"),
							"aria-hidden": "true"
						}, null, 2)], 8, pr))), 128))]),
						_: 1
					}, 8, [
						"overlay-context",
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
					])) : A("", !0),
					e.selectionOnly ? (m(), D("h3", mr, h(_.value), 1)) : (m(), D("h3", hr, h(_.value), 1)),
					e.selectionActions?.length ? (m(), D("div", gr, [(m(!0), D(v, null, i(e.selectionActions, (n) => (m(), D("button", {
						key: n.id,
						type: "button",
						disabled: n.disabled,
						title: e.t(n.label),
						"aria-label": e.t(n.label),
						class: F({
							"resource-preview-remove": n.id === "collectionRemove",
							"resource-preview-add": n.id === "collectionAdd"
						}),
						onClick: (e) => t.$emit("selection-action", n)
					}, [x(Sn, { icon: n.icon }, null, 8, ["icon"])], 10, _r))), 128)), r(t.$slots, "quick-actions")])) : A("", !0),
					y("div", vr, [
						e.selectionOnly ? (m(), D("dl", yr, [y("div", null, [y("dt", null, [o[10] ||= y("span", {
							class: "fas fa-link",
							"aria-hidden": "true"
						}, null, -1), S(h(e.t("COM_SMARTBROWSER_URI")), 1)]), y("dd", br, [
							y("input", {
								type: "text",
								value: n.value,
								title: n.value,
								"aria-label": e.t("COM_SMARTBROWSER_URI"),
								class: "sb-reference-readonly",
								readonly: "",
								"aria-readonly": "true"
							}, null, 8, xr),
							y("button", {
								type: "button",
								class: F({ "is-copied": T.value }),
								title: e.t(T.value ? "COM_SMARTBROWSER_COPIED" : "COM_SMARTBROWSER_COPY_PATH"),
								"aria-label": e.t(T.value ? "COM_SMARTBROWSER_COPIED" : "COM_SMARTBROWSER_COPY_PATH"),
								onClick: o[5] ||= (e) => ee(n.value)
							}, [y("span", {
								class: F(T.value ? "fas fa-check" : "fas fa-copy"),
								"aria-hidden": "true"
							}, null, 2)], 10, Sr),
							y("span", Cr, h(T.value ? e.t("COM_SMARTBROWSER_COPIED") : ""), 1)
						])])])) : A("", !0),
						e.selectionOnly && e.usageMode === "readonly" && e.usageDefinitions?.length ? (m(), D("dl", wr, [(m(!0), D(v, null, i(e.usageDefinitions, (t) => (m(), D("div", { key: t.key }, [y("dt", null, [t.key === "media.decorative" ? A("", !0) : (m(), D("span", {
							key: 0,
							class: F(f(C)(t)),
							"aria-hidden": "true"
						}, null, 2)), S(h(e.t(t.label)), 1)]), y("dd", null, h(j(t)), 1)]))), 128))])) : A("", !0),
						e.usageDefinitions?.length && (e.selectionOnly ? e.usageMode === "editable" : N.value === "usage") ? (m(), b(Kn, {
							key: f(L)(e.resource),
							"secondary-open": a.value,
							"onUpdate:secondaryOpen": o[6] ||= (e) => a.value = e,
							definitions: te.value,
							values: e.usageValues,
							errors: e.usageErrors,
							resource: e.resource,
							t: e.t,
							editors: e.usageEditors,
							"resolve-reference": e.resolveReference,
							onChange: o[7] ||= (e, n) => t.$emit("usage-change", e, n)
						}, null, 8, [
							"secondary-open",
							"definitions",
							"values",
							"errors",
							"resource",
							"t",
							"editors",
							"resolve-reference"
						])) : A("", !0)
					]),
					!e.selectionOnly && !d.value ? (m(), D(v, { key: 5 }, [e.fields?.length ? (m(), D("dl", Tr, [(m(!0), D(v, null, i(W.value, (t) => l((m(), D("div", { key: `${t.source}-${t.label}` }, [
						y("dt", null, [y("span", {
							class: F(f(G)(t)),
							"aria-hidden": "true"
						}, null, 2), S(h(e.t(t.label)), 1)]),
						t.format === "language" ? (m(), D("dd", Er, [e.resource.metadata?.languageImage ? (m(), D("img", {
							key: 0,
							src: e.resource.metadata.languageImage,
							alt: "",
							"aria-hidden": "true"
						}, null, 8, Dr)) : Y(t) === "*" ? (m(), D("span", Or)) : A("", !0), y("span", null, h(X(t)), 1)])) : (m(), D("dd", {
							key: 1,
							class: F({
								"resource-info-identifier": t.source === "metadata.alias" || t.source === "metadata.username",
								"resource-info-lines": t.source === "metadata.tagPaths"
							})
						}, h(X(t)), 3)),
						t.format === "date" && Z(Y(t)) ? (m(), D("small", kr, h(Z(Y(t))), 1)) : A("", !0)
					])), [[g, X(t) !== "" && X(t) !== null && X(t) !== void 0]])), 128))])) : (m(), D("dl", Ar, [
						e.resource.parentId ? (m(), D("div", jr, [y("dt", null, [o[11] ||= y("span", {
							class: "fas fa-folder",
							"aria-hidden": "true"
						}, null, -1), S(h(e.t("COM_SMARTBROWSER_FOLDER")), 1)]), y("dd", null, h(e.resource.parentId), 1)])) : A("", !0),
						y("div", null, [y("dt", null, [o[12] ||= y("span", {
							class: "fas fa-file-alt",
							"aria-hidden": "true"
						}, null, -1), S(h(e.t("COM_SMARTBROWSER_TYPE")), 1)]), y("dd", null, h(K.value), 1)]),
						e.resource.metadata.created ? (m(), D("div", Mr, [
							y("dt", null, [o[13] ||= y("span", {
								class: "fas fa-calendar",
								"aria-hidden": "true"
							}, null, -1), S(h(e.t("COM_SMARTBROWSER_DATE_CREATED")), 1)]),
							y("dd", null, h(q(e.resource.metadata.created)), 1),
							Z(e.resource.metadata.created) ? (m(), D("small", Nr, h(Z(e.resource.metadata.created)), 1)) : A("", !0)
						])) : A("", !0),
						e.resource.metadata.modified ? (m(), D("div", Pr, [
							y("dt", null, [o[14] ||= y("span", {
								class: "fas fa-calendar",
								"aria-hidden": "true"
							}, null, -1), S(h(e.t("COM_SMARTBROWSER_DATE_MODIFIED")), 1)]),
							y("dd", null, h(q(e.resource.metadata.modified)), 1),
							Z(e.resource.metadata.modified) ? (m(), D("small", Fr, h(Z(e.resource.metadata.modified)), 1)) : A("", !0)
						])) : A("", !0),
						e.resource.metadata.width && e.resource.metadata.height ? (m(), D("div", Ir, [y("dt", null, [o[15] ||= y("span", {
							class: "fas fa-expand",
							"aria-hidden": "true"
						}, null, -1), S(h(e.t("COM_SMARTBROWSER_DIMENSIONS")), 1)]), y("dd", null, h(e.resource.metadata.width) + "px × " + h(e.resource.metadata.height) + "px", 1)])) : A("", !0),
						e.resource.metadata.size ? (m(), D("div", Lr, [y("dt", null, [o[16] ||= y("span", {
							class: "fas fa-database",
							"aria-hidden": "true"
						}, null, -1), S(h(e.t("COM_SMARTBROWSER_SIZE")), 1)]), y("dd", null, h(J(e.resource.metadata.size)), 1)])) : A("", !0),
						e.resource.metadata.mimeType ? (m(), D("div", Rr, [y("dt", null, [o[17] ||= y("span", {
							class: "fas fa-file-alt",
							"aria-hidden": "true"
						}, null, -1), S(h(e.t("COM_SMARTBROWSER_MIME_TYPE")), 1)]), y("dd", null, h(e.resource.metadata.mimeType), 1)])) : A("", !0),
						e.resource.metadata.extension ? (m(), D("div", zr, [y("dt", null, [o[18] ||= y("span", {
							class: "fas fa-file-alt",
							"aria-hidden": "true"
						}, null, -1), S(h(e.t("COM_SMARTBROWSER_EXTENSION")), 1)]), y("dd", null, h(e.resource.metadata.extension), 1)])) : A("", !0),
						y("div", null, [y("dt", null, [o[19] ||= y("span", {
							class: "fas fa-key",
							"aria-hidden": "true"
						}, null, -1), S(h(e.t("JGLOBAL_FIELD_ID_LABEL")), 1)]), y("dd", null, h(e.resource.metadata.id ?? e.resource.id), 1)])
					]))], 64)) : A("", !0)
				], 64)) : (m(), D("div", Br, [
					e.allowAdd ? (m(), D("button", {
						key: 0,
						type: "button",
						class: "btn btn-outline-secondary",
						disabled: e.addDisabled,
						onClick: o[8] ||= (e) => t.$emit("selection-add")
					}, [o[20] ||= y("span", { class: "fas fa-plus" }, null, -1), S(" " + h(e.t("COM_SMARTBROWSER_SELECT_RESOURCE")), 1)], 8, Vr)) : A("", !0),
					y("p", null, h(e.t(e.selectionOnly ? "COM_SMARTBROWSER_SELECTION_START" : "COM_SMARTBROWSER_SELECTION_INFO_EMPTY")), 1),
					r(t.$slots, "empty-actions")
				]))
			]),
			_: 3
		}, 8, [
			"disabled",
			"resource-key",
			"tab"
		])], 2));
	}
}, Ur = { class: "resource-ordering-moves" }, Wr = [
	"disabled",
	"title",
	"aria-label"
], Gr = [
	"disabled",
	"title",
	"aria-label"
], Kr = {
	__name: "ResourceOrderingControls",
	props: {
		enabled: Boolean,
		t: Function
	},
	emits: ["reorder"],
	setup(e) {
		return (t, n) => (m(), D("span", Ur, [y("button", {
			type: "button",
			disabled: !e.enabled,
			title: e.t("COM_SMARTBROWSER_MOVE_UP"),
			"aria-label": e.t("COM_SMARTBROWSER_MOVE_UP"),
			onClick: n[0] ||= (e) => t.$emit("reorder", "up")
		}, [...n[2] ||= [y("span", {
			class: "fas fa-arrow-up",
			"aria-hidden": "true"
		}, null, -1)]], 8, Wr), y("button", {
			type: "button",
			disabled: !e.enabled,
			title: e.t("COM_SMARTBROWSER_MOVE_DOWN"),
			"aria-label": e.t("COM_SMARTBROWSER_MOVE_DOWN"),
			onClick: n[1] ||= (e) => t.$emit("reorder", "down")
		}, [...n[3] ||= [y("span", {
			class: "fas fa-arrow-down",
			"aria-hidden": "true"
		}, null, -1)]], 8, Gr)]));
	}
}, qr = ["popover"], Jr = [
	"title",
	"aria-label",
	"aria-expanded",
	"popovertarget"
], Yr = 0, Xr = {
	__name: "ResourceToolbarPopover",
	props: {
		label: String,
		icon: String,
		panelClass: String,
		width: {
			type: Number,
			default: 320
		},
		inline: Boolean,
		alignment: {
			type: String,
			default: "end"
		}
	},
	setup(e, { expose: i }) {
		let a = e, s = `sb-toolbar-popup-${++Yr}`, c = o(null), u = o(null), d = o(null), f = o(!1), h = o(!1), _, v, b = () => S();
		function x() {
			if (!f.value || h.value) return;
			let e = d.value.getBoundingClientRect();
			if (!e.width || e.bottom < 0 || e.top > window.innerHeight) {
				S();
				return;
			}
			let t = u.value.getBoundingClientRect(), n = window.innerHeight - e.bottom - 8, r = a.alignment === "start" != (getComputedStyle(c.value).direction === "rtl");
			u.value.style.left = `${Math.max(8, Math.min(r ? e.left : e.right - t.width, window.innerWidth - t.width - 8))}px`, u.value.style.top = `${Math.max(8, n < t.height && e.top > n ? e.top - t.height : e.bottom)}px`, u.value.style.maxHeight = `${Math.max(80, Math.max(n, e.top - 8))}px`;
		}
		i({ close: () => S() });
		function S(e = !1) {
			u.value?.matches(":popover-open") && u.value.hidePopover(), f.value = !1, e && d.value?.focus();
		}
		async function C() {
			if (f.value) {
				S();
				return;
			}
			f.value = !0, await P(), u.value.querySelector("input:not(:disabled), select:not(:disabled), button:not(:disabled)")?.focus({ preventScroll: !0 });
		}
		async function w(e) {
			h.value || (f.value = e.newState === "open", f.value && (await P(), x(), u.value.querySelector("input:not(:disabled), select:not(:disabled), button:not(:disabled)")?.focus({ preventScroll: !0 })));
		}
		function T(e) {
			e.key === "Escape" && f.value && (e.stopPropagation(), e.preventDefault(), S(!0));
		}
		function E(e) {
			h.value && !c.value?.contains(e.target) && S();
		}
		return n(() => {
			v = c.value.closest("dialog"), v?.addEventListener("close", b), document.addEventListener("pointerdown", E), window.addEventListener("scroll", x, !0), window.addEventListener("resize", x), _ = new ResizeObserver(([e]) => {
				e.contentRect.width || S();
				let t = a.inline && e.contentRect.width >= 800;
				t !== h.value && (S(), h.value = t);
			}), _.observe(c.value.closest(".resource-toolbar"));
		}), p(() => {
			S(), _?.disconnect(), v?.removeEventListener("close", b), document.removeEventListener("pointerdown", E), window.removeEventListener("scroll", x, !0), window.removeEventListener("resize", x);
		}), (n, i) => (m(), D("div", {
			ref_key: "host",
			ref: c,
			class: F(["resource-toolbar-popup", {
				"is-inline": h.value,
				"is-aligned-start": e.alignment === "start"
			}]),
			onKeydown: T
		}, [l(y("div", {
			id: s,
			ref_key: "panel",
			ref: u,
			popover: h.value ? void 0 : "auto",
			class: F(["resource-toolbar-popup-panel", e.panelClass]),
			style: t({ "--sb-toolbar-popup-width": `${e.width}px` }),
			onToggle: w
		}, [r(n.$slots, "default")], 46, qr), [[g, f.value || !h.value]]), y("button", {
			ref_key: "button",
			ref: d,
			type: "button",
			class: F(["resource-icon-button", { active: f.value }]),
			title: e.label,
			"aria-label": e.label,
			"aria-expanded": f.value,
			"aria-controls": s,
			popovertarget: h.value ? void 0 : s,
			onClick: i[0] ||= (e) => h.value && C()
		}, [y("span", {
			class: F(e.icon),
			"aria-hidden": "true"
		}, null, 2)], 10, Jr)], 34));
	}
}, Zr = { class: "resource-column-menu-title" }, Qr = [
	"checked",
	"disabled",
	"onChange"
], $r = {
	__name: "ResourceColumnPicker",
	props: {
		columns: Array,
		hiddenColumns: Array,
		shownColumns: Array,
		t: Function
	},
	emits: ["toggle-column"],
	setup(e) {
		return (t, n) => (m(), b(Xr, {
			class: "resource-column-picker",
			label: e.t("COM_SMARTBROWSER_COLUMNS"),
			icon: "fas fa-columns",
			"panel-class": "resource-column-menu",
			width: 220
		}, {
			default: c(() => [y("div", Zr, h(e.t("COM_SMARTBROWSER_COLUMNS")), 1), (m(!0), D(v, null, i(e.columns, (n) => (m(), D("label", {
				key: n.id,
				class: "resource-column-choice"
			}, [y("input", {
				type: "checkbox",
				checked: n.defaultVisible === !1 ? e.shownColumns?.includes(n.id) : !e.hiddenColumns?.includes(n.id),
				disabled: n.id === "title" || n.id === "name",
				onChange: (e) => t.$emit("toggle-column", n.id)
			}, null, 40, Qr), y("span", null, h(e.t(n.label || (n.dateGroup ? "COM_SMARTBROWSER_DATE" : n.fields?.[0]?.label))), 1)]))), 128))]),
			_: 1
		}, 8, ["label"]));
	}
}, ei = { class: "resource-sort-controls" }, ti = ["value", "aria-label"], ni = ["value"], ri = ["value"], ii = [
	"disabled",
	"title",
	"aria-label"
], ai = {
	__name: "ResourceSortControls",
	props: {
		fields: Array,
		sortBy: String,
		sortDirection: String,
		alignment: {
			type: String,
			default: "end"
		},
		defaultValue: {
			type: String,
			default: ""
		},
		defaultLabel: {
			type: String,
			default: "COM_SMARTBROWSER_DEFAULT_SORTING"
		},
		t: Function
	},
	emits: ["sort-by", "sort-direction-value"],
	setup(e) {
		return (t, n) => (m(), b(Xr, {
			alignment: e.alignment,
			label: e.t("COM_SMARTBROWSER_SORT_BY"),
			icon: "fas fa-signal",
			"panel-class": "resource-sort-menu",
			width: 260
		}, {
			default: c(() => [y("div", ei, [y("select", {
				value: e.sortBy,
				class: "form-select",
				"aria-label": e.t("COM_SMARTBROWSER_SORT_BY"),
				onChange: n[0] ||= (e) => t.$emit("sort-by", e.target.value)
			}, [e.defaultValue === null ? A("", !0) : (m(), D("option", {
				key: 0,
				value: e.defaultValue
			}, h(e.t(e.defaultLabel)), 9, ni)), (m(!0), D(v, null, i(e.fields, (t) => (m(), D("option", {
				key: t.id,
				value: t.id
			}, h(e.t(t.label)), 9, ri))), 128))], 40, ti), y("button", {
				type: "button",
				class: "resource-icon-button",
				disabled: !e.sortBy,
				title: e.t("COM_SMARTBROWSER_SORT_DIRECTION"),
				"aria-label": e.t("COM_SMARTBROWSER_SORT_DIRECTION"),
				onClick: n[1] ||= (n) => t.$emit("sort-direction-value", e.sortDirection === "desc" ? "asc" : "desc")
			}, [y("span", {
				class: F(e.sortDirection === "desc" ? "fas fa-sort-amount-down-alt" : "fas fa-sort-amount-up"),
				"aria-hidden": "true"
			}, null, 2)], 8, ii)])]),
			_: 1
		}, 8, ["alignment", "label"]));
	}
}, oi = "contextual", si = (e, t) => ({
	...e,
	focusable: e.focusable ?? t.focusable,
	selectable: e.selectable ?? t.selectable,
	bulkSelectable: e.bulkSelectable ?? e.selectable ?? t.bulkSelectable,
	actionable: e.actionable ?? t.actionable,
	navigable: e.navigable ?? t.navigable,
	activatable: e.activatable ?? t.activatable
}), ci = (e) => si({
	...e,
	role: e.role || "primary"
}, {
	focusable: !0,
	selectable: !1,
	bulkSelectable: !1,
	actionable: !0,
	navigable: !1,
	activatable: !0
}), li = (e) => ({
	...e,
	role: oi,
	focusable: e.focusable ?? !0,
	selectable: !1,
	bulkSelectable: !1,
	actionable: !1,
	navigable: !1,
	activatable: !1,
	interactiveOverlays: !1,
	capabilities: {}
}), ui = (e) => e?.role === oi, di = (e) => e?.focusable === !0, fi = (e, t = "both") => e?.selectable === !0 && (t === "both" || e.kind === t), pi = (e, t = "both") => fi(e, t) && e?.bulkSelectable === !0, mi = (e) => e?.actionable === !0, hi = () => ({
	id: "browseOpen",
	label: "COM_SMARTBROWSER_OPEN",
	icon: "fas fa-folder-open",
	local: !0
}), gi = () => ({
	id: "pickerSelect",
	label: "COM_SMARTBROWSER_SELECT",
	icon: "fas fa-check",
	local: !0
}), _i = (e, t, n, r, i) => e?.kind !== "node" || !e.navigable || e.hasChildren !== !1 || !e.activatable ? null : t === "select" ? n.some((e) => e.defaultOnLeaf === !0) && fi(e, i) ? gi() : null : t === "manage" && mi(e) ? n.find((t) => t.defaultOnLeaf === !0 && r(t, [e])) : null, vi = (e, t, n, r) => ["manage", "select"].includes(t) && mi(e) && n.find((t) => t.id === "preview" && r(t, [e])) || null;
function yi(e, t, n, r, i = "both") {
	return _i(e, t, n, r, i) ? hi() : e?.kind === "node" ? t === "select" ? fi(e, i) ? gi() : null : t === "manage" && mi(e) && n.find((t) => t.id === "edit" && r(t, [e])) || null : (["manage", "select"].includes(t) && mi(e) ? n.find((t) => t.modifiedDefault === !0 && r(t, [e])) : null) || vi(e, t, n, r);
}
function bi(e, t, n, r, i = "both") {
	return _i(e, t, n, r, i) || (e?.navigable ? hi() : e?.activatable ? t === "select" ? fi(e, i) ? gi() : null : mi(e) && n.find((n) => n.id === (t === "manage" ? "edit" : "preview") && r(n, [e])) || null : null);
}
//#endregion
//#region resources/js/core/previewExtensionContext.js
function xi(e) {
	let t = () => {
		if (e.isReadOnly || e.isCurrent?.() === !1) throw Error("This preview is read-only or no longer active.");
	}, n = () => {
		let t = e.overlayRegistry || globalThis.window?.SmartBrowserPicker;
		return t?.getImagePresentations?.() || t?.extensions?.().imagePresentations || t?.imagePresentations || [];
	}, r = () => n().filter((e) => {
		try {
			return typeof e.reset == "function" && e.hasChanges?.(i) === !0;
		} catch (e) {
			return console.error(e), !1;
		}
	}), i = {
		...e,
		hasPreviewChanges() {
			let t = e.getValues?.() || {};
			return Object.entries(t).some(([e, t]) => e.startsWith("visual.") && t != null && t !== "") || !!(t["ext.address"] && t["ext.address"] !== e.getDefaultAddress?.()) || !!(e.getDefaultAddress?.() && e.getAddress?.() !== e.getDefaultAddress()) || r().length > 0;
		},
		async resetPreview() {
			t();
			for (let e of r()) t(), await e.reset(i);
			for (let n of Object.keys(e.getValues?.() || {})) t(), n.startsWith("visual.") && await e.setValue(n, null);
			t(), e.resetAddress ? await e.resetAddress() : e.getDefaultAddress ? await e.setAddress?.(e.getDefaultAddress()) : await e.setValue?.("ext.address", null);
		},
		getMetadata(t) {
			let n = e.getValues?.() || {};
			return t == null ? Object.fromEntries(Object.entries(Zt(n)).map(([e, t]) => [e.slice(4), $t(t)])) : n[Qt(t)] === void 0 ? void 0 : $t(n[Qt(t)]);
		},
		setMetadata(n, r) {
			t();
			let i = Qt(n), a = $t(r), o = {
				...e.getValues?.(),
				[i]: a
			};
			if (Object.keys(o).length > 100) throw TypeError("Too many selection properties.");
			return $t(o), e.setValue(i, a);
		},
		setAddress(n) {
			t();
			let r = String(n || "");
			if (r.length > 2048 || /[\u0000-\u001f\u007f]/.test(r) || /^\s*(?:javascript|data|vbscript):/i.test(r)) throw TypeError("Invalid preview address.");
			return e.setAddress?.(r);
		},
		setValue(n, r) {
			return t(), e.setValue?.(n, r);
		}
	};
	return i;
}
//#endregion
//#region resources/js/core/overlayTooltip.js
function Si(e, t, n) {
	let r = [e.label, ...e.tooltipLines || []];
	if (t) {
		let e = {
			publish: "JLIB_HTML_PUBLISH_ITEM",
			unpublish: "JLIB_HTML_PUBLISHED_UNPUBLISH",
			unarchive: "JLIB_HTML_UNPUBLISH_ITEM",
			restore: "COM_SMARTBROWSER_ACTION_RESTORE",
			feature: "JGLOBAL_TOGGLE_FEATURED",
			unfeature: "JGLOBAL_TOGGLE_FEATURED"
		}[t.id];
		e && r.push(n(e));
	}
	return r.filter(Boolean).join("\n");
}
//#endregion
//#region resources/js/core/itemMenuActions.js
var Ci = (e, t, n, r = null, i = null) => {
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
function wi() {
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
var Ti = { class: "resource-grid-select-all" }, Ei = ["checked", "aria-label"], Di = [
	"data-sb-resource-key",
	"role",
	"tabindex",
	"aria-pressed",
	"onClick",
	"onDblclick",
	"onKeydown"
], Oi = [
	"checked",
	"aria-label",
	"onChange"
], ki = [
	"aria-expanded",
	"title",
	"onClick"
], Ai = [
	"title",
	"disabled",
	"onClick"
], ji = { class: "resource-item-visual" }, Mi = {
	key: 0,
	class: "resource-item-overlays"
}, Ni = ["title", "onClick"], Pi = ["src"], Fi = ["title"], Ii = ["src"], Li = ["title"], Ri = ["title"], zi = { class: "resource-item-metadata-text" }, Bi = {
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
	setup(e, { emit: r }) {
		let a = e, s = wi(), c = r, l = (e, t) => {
			if (s.accepts(L(e), t)) {
				if ((t?.ctrlKey || t?.metaKey) && (a.modifiedAction || a.previewAction)) {
					let t = a.modifiedAction ? a.modifiedAction(e) : a.previewAction(e);
					if (t && a.actionAvailable(t, [e])) {
						c("action", t, e);
						return;
					}
				}
				if (a.defaultAction) {
					let t = a.defaultAction(e);
					t && a.actionAvailable(t, [e]) && c("action", t, e);
				} else e.navigable ? c("open", e.id) : e.activatable ? c("activate", e) : c("focus", e);
			}
		}, u = o(null), d = o(!1), g = o(0), _ = async (e, t) => {
			if (u.value === e) {
				u.value = null;
				return;
			}
			let n = t.currentTarget.closest(".resource-browser-item"), r = n?.closest(".resource-browser");
			if (d.value = !1, g.value = r ? Math.max(0, Math.min(360, r.clientWidth - 8, window.innerWidth - 20)) : 0, u.value = e, await P(), u.value !== e || !r) return;
			let i = n.querySelector(".resource-item-menu");
			d.value = i?.getBoundingClientRect().left < r.getBoundingClientRect().left + 4;
		}, b = (e) => Ci(a.actions, e, a.actionAvailable, a.defaultAction?.(e), (a.modifiedAction || a.previewAction)?.(e)), C = (e, t) => mi(t) && t.interactiveOverlays !== !1 ? a.actions.find((n) => n.id === e.action && a.actionAvailable(n, [t])) : void 0, w = () => {
			u.value = null;
		}, T = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e), E = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, O = (e) => {
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
				e.type === "article" && a.gridFields?.some((e) => e.source === "metadata.cardSummaryWithCategory") ? n("JCATEGORY", t.category, "fas fa-folder") : null
			].filter(Boolean) : e.kind === "item" && t.mimeType ? [n("COM_SMARTBROWSER_MIME_TYPE", t.mimeType, "fas fa-file-alt"), e.type === "image" && t.width > 0 && t.height > 0 ? n("COM_SMARTBROWSER_DIMENSIONS", `${t.width} × ${t.height}`, "fas fa-expand") : null].filter(Boolean) : (e.collectionPresentation?.gridFields || a.gridFields || []).map((t) => n(t.label || "COM_SMARTBROWSER_DETAILS", t.format === "date" ? E(T(e, t.source)) : T(e, t.source), t.icon || "fas fa-info")).filter(Boolean);
		};
		return n(() => document.addEventListener("click", w)), p(() => document.removeEventListener("click", w)), (n, r) => (m(), D("div", { class: F(["resource-browser-grid", `size-${e.options.gridSize}`]) }, [e.selectionControls ? (m(), D("div", {
			key: 0,
			class: F(["resource-view-icons", { active: e.allSelected }])
		}, [y("label", Ti, [y("input", {
			type: "checkbox",
			checked: e.allSelected,
			"aria-label": e.t("COM_SMARTBROWSER_SELECT_ALL"),
			onChange: r[0] ||= (e) => n.$emit("select-all")
		}, null, 40, Ei)])], 2)) : A("", !0), (m(!0), D(v, null, i(e.resources, (a) => (m(), D("div", {
			key: f(L)(a),
			"data-sb-resource-key": f(L)(a),
			class: F(["resource-browser-item", {
				selected: e.selectedIds.includes(f(L)(a)),
				focused: e.focusedId === f(L)(a),
				active: u.value === f(L)(a),
				contextual: f(ui)(a)
			}]),
			role: f(di)(a) ? "button" : void 0,
			tabindex: f(di)(a) ? 0 : void 0,
			"aria-pressed": f(fi)(a) ? e.selectedIds.includes(f(L)(a)) : void 0,
			onClick: j((e) => {
				f(s).click(f(L)(a), e), u.value = null, n.$emit("select", a, e.ctrlKey || e.metaKey);
			}, ["stop"]),
			onDblclick: j((e) => l(a, e), ["stop"]),
			onKeydown: k(j((e) => l(a), ["prevent"]), ["enter"]),
			onMouseleave: r[3] ||= (e) => u.value = null
		}, [
			e.selectionControls && f(fi)(a) ? (m(), D("label", {
				key: 0,
				class: F(["resource-item-select", { checked: e.selectedIds.includes(f(L)(a)) }]),
				onClick: r[1] ||= j(() => {}, ["stop"])
			}, [y("input", {
				type: "checkbox",
				checked: e.selectedIds.includes(f(L)(a)),
				"aria-label": a.title,
				onChange: (e) => n.$emit("select", a, !0)
			}, null, 40, Oi)], 2)) : A("", !0),
			b(a).length ? (m(), D("button", {
				key: 1,
				type: "button",
				class: "resource-item-menu-toggle",
				"aria-expanded": u.value === f(L)(a),
				title: e.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: j((e) => {
					n.$emit("focus", a), _(f(L)(a), e);
				}, ["stop"])
			}, [...r[4] ||= [y("span", {
				class: "fas fa-ellipsis-h",
				"aria-hidden": "true"
			}, null, -1)]], 8, ki)) : A("", !0),
			u.value === f(L)(a) ? (m(), D("div", {
				key: 2,
				class: F(["resource-item-menu", { "align-start": d.value }]),
				style: t(g.value ? { maxWidth: `${g.value}px` } : null),
				onClick: r[2] ||= j(() => {}, ["stop"])
			}, [y("strong", null, h(a.title), 1), (m(!0), D(v, null, i(b(a), (t) => (m(), D("button", {
				key: t.id,
				type: "button",
				class: F([`resource-action-${t.id}`, {
					"resource-default-action": t.isDefault,
					"resource-modified-action": t.isModified
				}]),
				title: t.isDefault ? e.t("COM_SMARTBROWSER_DOUBLE_CLICK") : t.isModified ? e.t("COM_SMARTBROWSER_CTRL_DOUBLE_CLICK") : void 0,
				disabled: !e.actionAvailable(t, [a]),
				onClick: (e) => {
					u.value = null, n.$emit("action", t, a);
				}
			}, [x(Sn, { icon: t.icon }, null, 8, ["icon"]), S(" " + h(e.t(t.label)), 1)], 10, Ai))), 128))], 6)) : A("", !0),
			y("span", ji, [x(re, { resource: a }, null, 8, ["resource"]), a.overlays?.length ? (m(), D("span", Mi, [(m(!0), D(v, null, i(a.overlays, (t) => (m(), D(v, { key: t.id }, [C(t, a) ? (m(), D("button", {
				key: 0,
				type: "button",
				class: F(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: f(Si)(t, C(t, a), e.t),
				onClick: j((e) => {
					n.$emit("focus", a), n.$emit("action", C(t, a), a);
				}, ["stop"])
			}, [t.image ? (m(), D("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, Pi)) : (m(), D("span", {
				key: 1,
				class: F(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, Ni)) : (m(), D("span", {
				key: 1,
				class: F(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: f(Si)(t, C(t, a), e.t)
			}, [t.image ? (m(), D("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, Ii)) : (m(), D("span", {
				key: 1,
				class: F(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, Fi))], 64))), 128))])) : A("", !0)]),
			y("span", {
				class: "resource-item-title",
				title: `${e.t("COM_SMARTBROWSER_NAME")}: ${a.title}`
			}, h(a.title), 9, Li),
			(m(!0), D(v, null, i(O(a), (t) => (m(), D("span", {
				key: t.label,
				class: F(["resource-item-metadata", { "resource-item-identifier": t.identifier }]),
				title: `${e.t(t.label)}: ${t.value}`
			}, [y("span", {
				class: F(t.icon),
				"aria-hidden": "true"
			}, null, 2), y("span", zi, h(t.value), 1)], 10, Ri))), 128))
		], 42, Di))), 128))], 2));
	}
}, Vi = { class: "table-responsive resource-details-view" }, Hi = { class: "table table-hover" }, Ui = {
	class: "resource-type-column resource-details-select-column",
	scope: "col"
}, Wi = { class: "resource-details-select-controls" }, Gi = {
	key: 0,
	class: "resource-details-select-all"
}, Ki = [
	"checked",
	"title",
	"aria-label"
], qi = ["title", "aria-label"], Ji = [
	"title",
	"aria-label",
	"onClick"
], Yi = ["title"], Xi = [
	"data-sb-resource-key",
	"tabindex",
	"aria-current",
	"onClick",
	"onDblclick",
	"onKeydown"
], Zi = { class: "resource-type-column" }, Qi = [
	"checked",
	"aria-label",
	"onChange"
], $i = ["title"], ea = { class: "resource-cell-ellipsis" }, ta = ["title"], na = ["title", "onClick"], ra = { class: "visually-hidden" }, ia = ["title"], aa = { class: "visually-hidden" }, oa = {
	key: 1,
	class: "resource-language"
}, sa = ["src"], ca = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, la = { class: "resource-language-name" }, ua = {
	key: 2,
	class: "resource-location-path"
}, da = {
	key: 0,
	class: "resource-location-parents"
}, fa = { class: "resource-location-current" }, pa = {
	key: 3,
	class: "resource-cell-ellipsis"
}, ma = {
	key: 4,
	class: "resource-row-overlays"
}, ha = ["title", "onClick"], ga = ["src"], _a = ["title"], va = ["src"], ya = { class: "resource-row-actions" }, ba = [
	"aria-expanded",
	"title",
	"onClick"
], xa = [
	"title",
	"disabled",
	"onClick"
], Sa = {
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
	setup(e, { emit: r }) {
		let a = wi(), s = e, c = r, l = (e, t) => {
			if (a.accepts(L(e), t)) {
				if ((t?.ctrlKey || t?.metaKey) && (s.modifiedAction || s.previewAction)) {
					let t = s.modifiedAction ? s.modifiedAction(e) : s.previewAction(e);
					if (t && s.actionAvailable(t, [e])) {
						c("action", t, e);
						return;
					}
				}
				if (s.defaultAction) {
					let t = s.defaultAction(e);
					t && s.actionAvailable(t, [e]) && c("action", t, e);
				} else e.navigable ? c("open", e.id) : e.activatable ? c("activate", e) : c("focus", e);
			}
		}, u = [
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
		], d = () => [
			"created",
			"modified",
			"both"
		].includes(s.options.detailsDateMode) ? s.options.detailsDateMode : "modified", g = (e) => {
			if (!e.dateGroup) return [e];
			let t = e.fields || [];
			return d() === "both" ? t : t.filter((e) => e.id === d());
		}, _ = M(() => (s.columns?.length ? s.columns : u).flatMap(g)), b = M(() => 44 + 24 * Math.max(0, ...(s.resources || []).map((e) => (e.overlays || []).filter((e) => e.id !== "status").length))), C = M(() => Math.max(48, 24 + 8 * Math.max(1, ...(s.resources || []).map((e) => String(e.metadata?.id ?? "").length)))), w = (e) => {
			let t = e.id === "status" && e.overlays ? b.value : e.id === "id" ? C.value : null;
			return t === null ? null : {
				width: `${t}px`,
				minWidth: `${t}px`
			};
		}, T = (e) => e.headerIcon || (Object.hasOwn(Rt, e.id) ? Rt[e.id] : "fas fa-info"), E = (e) => e.sortField || e.id, O = (e) => s.t(e.label), ee = (e) => (s.sortFields || u).some((t) => t.id === E(e)), te = (e) => s.sortBy === e ? s.sortDirection === "asc" ? "fas fa-caret-up ms-1" : "fas fa-caret-down ms-1" : "fas fa-sort ms-1", N = (e) => e ? `${(e / 1024).toFixed(2)}KB` : "", P = (e) => e.metadata.width && e.metadata.height ? `${e.metadata.width}px \u00d7 ${e.metadata.height}px` : "", ne = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, I = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e), R = (e, t) => {
			if (t.id === "location") return String(e.metadata?.locationPath || e.metadata?.location || e.metadata?.categoryPath || e.metadata?.parentPath || e.metadata?.parent || "").replaceAll(" / ", " » ");
			if (t.id === "size") return e.kind === "node" ? "" : N(e.metadata.size);
			if (t.id === "dimension") return P(e);
			let n = t.source || `metadata.${t.id}`, r = I(e, n);
			return t.format === "size" ? N(r) : t.format === "dimensions" ? P(e) : t.format === "date" || ["created", "modified"].includes(t.id) ? ne(r) : t.format === "mediaType" ? s.t({
				folder: "COM_SMARTBROWSER_FOLDER",
				image: "COM_SMARTBROWSER_MEDIA_IMAGE",
				document: "COM_SMARTBROWSER_MEDIA_DOCUMENT",
				video: "COM_SMARTBROWSER_MEDIA_VIDEO",
				audio: "COM_SMARTBROWSER_MEDIA_AUDIO"
			}[r] || "COM_SMARTBROWSER_RESOURCE") : t.format === "language" && r === "*" ? s.t("COM_SMARTBROWSER_ALL_LANGUAGES") : ["categoryPath", "tagPaths"].includes(t.id) ? String(r ?? "").replaceAll(" / ", " » ") : r ?? "";
		}, z = (e, t) => t.id === "location" ? String(R(e, t) || "") : t.format === "status" ? V(e).label : String(R(e, t) || ""), B = (e, t) => {
			let n = String(R(e, t)), r = n.lastIndexOf(" » ");
			return r < 0 ? {
				parent: "",
				leaf: n
			} : {
				parent: n.slice(0, r),
				leaf: n.slice(r)
			};
		}, V = (e) => ({
			icon: e.statusPresentation?.icon || "fas fa-question-circle",
			label: e.statusPresentation?.label || R(e, { source: "metadata.stateLabel" }),
			class: `status-${e.statusPresentation?.tone || "neutral"}`
		}), H = (e) => e.overlays?.find((e) => e.id === "status") || {}, U = o(null), ie = (e) => {
			U.value = U.value === e ? null : e;
		}, W = (e) => Ci(s.actions, e, s.actionAvailable, s.defaultAction?.(e), (s.modifiedAction || s.previewAction)?.(e)), G = (e, t) => mi(t) && t.interactiveOverlays !== !1 ? s.actions.find((n) => n.id === e.action && s.actionAvailable(n, [t])) : void 0, K = () => {
			U.value = null;
		};
		return n(() => document.addEventListener("click", K)), p(() => document.removeEventListener("click", K)), (n, r) => (m(), D("div", Vi, [y("table", Hi, [y("thead", null, [y("tr", null, [
			y("th", Ui, [y("span", Wi, [e.selectionControls ? (m(), D("label", Gi, [y("input", {
				type: "checkbox",
				checked: e.allSelected,
				title: e.t("COM_SMARTBROWSER_SELECT_ALL"),
				"aria-label": e.t("COM_SMARTBROWSER_SELECT_ALL"),
				onChange: r[0] ||= (e) => n.$emit("select-all")
			}, null, 40, Ki)])) : A("", !0), e.orderingField ? (m(), D("button", {
				key: 1,
				type: "button",
				class: "resource-ordering-sort",
				title: e.t("COM_SMARTBROWSER_ORDERING"),
				"aria-label": e.t("COM_SMARTBROWSER_ORDERING"),
				onClick: r[1] ||= (t) => n.$emit("sort", e.orderingField)
			}, [y("span", {
				class: F(te(e.orderingField)),
				"aria-hidden": "true"
			}, null, 2)], 8, qi)) : A("", !0)])]),
			(m(!0), D(v, null, i(_.value, (r) => (m(), D("th", {
				key: r.id,
				class: F(`resource-column-${r.id}`),
				style: t(w(r)),
				scope: "col"
			}, [ee(r) ? (m(), D("button", {
				key: 0,
				type: "button",
				class: "btn btn-link",
				title: O(r),
				"aria-label": O(r),
				onClick: (e) => n.$emit("sort", E(r))
			}, [
				T(r) ? (m(), D("span", {
					key: 0,
					class: F(T(r)),
					"aria-hidden": "true"
				}, null, 2)) : A("", !0),
				y("span", { class: F(["resource-header-text", { "resource-header-primary": ["title", "name"].includes(r.id) }]) }, h(O(r)), 3),
				y("span", {
					class: F(te(E(r))),
					"aria-hidden": "true"
				}, null, 2)
			], 8, Ji)) : (m(), D("span", {
				key: 1,
				class: "resource-column-label",
				title: O(r)
			}, [T(r) ? (m(), D("span", {
				key: 0,
				class: F(T(r)),
				"aria-hidden": "true"
			}, null, 2)) : A("", !0), y("span", { class: F(["resource-header-text", { "resource-header-primary": ["title", "name"].includes(r.id) }]) }, h(r.shortLabel ? e.t(r.shortLabel) : O(r)), 3)], 8, Yi))], 6))), 128)),
			r[4] ||= y("th", {
				class: "resource-row-actions",
				scope: "col"
			}, null, -1)
		])]), y("tbody", null, [(m(!0), D(v, null, i(e.resources, (o) => (m(), D("tr", {
			key: f(L)(o),
			"data-sb-resource-key": f(L)(o),
			class: F({
				selected: e.selectedIds.includes(f(L)(o)),
				focused: e.focusedId === f(L)(o),
				focusable: f(di)(o),
				contextual: f(ui)(o)
			}),
			tabindex: f(di)(o) ? 0 : void 0,
			"aria-current": e.focusedId === f(L)(o) ? "true" : void 0,
			onClick: j((e) => {
				f(a).click(f(L)(o), e), U.value = null, n.$emit("select", o, e.ctrlKey || e.metaKey);
			}, ["stop"]),
			onDblclick: j((e) => l(o, e), ["stop"]),
			onKeydown: k(j((e) => l(o), ["prevent"]), ["enter"])
		}, [
			y("td", Zi, [x(re, {
				resource: o,
				variant: "compact",
				"allow-image": e.options.detailsThumbnails
			}, null, 8, ["resource", "allow-image"]), e.selectionControls && f(fi)(o) ? (m(), D("label", {
				key: 0,
				class: F(["resource-row-select", { checked: e.selectedIds.includes(f(L)(o)) }]),
				onClick: r[2] ||= j(() => {}, ["stop"])
			}, [y("input", {
				type: "checkbox",
				checked: e.selectedIds.includes(f(L)(o)),
				"aria-label": o.title,
				onChange: (e) => n.$emit("select", o, !0)
			}, null, 40, Qi)], 2)) : A("", !0)]),
			y("th", {
				class: "resource-title-cell",
				scope: "row",
				title: o.title
			}, [y("span", ea, h(o.title), 1)], 8, $i),
			(m(!0), D(v, null, i(_.value.slice(1), (r) => (m(), D("td", {
				key: r.id,
				class: F(`resource-column-${r.id}`),
				style: t(w(r)),
				title: z(o, r)
			}, [y("span", { class: F(["resource-cell-content", { "resource-status-group": r.format === "status" }]) }, [r.format === "status" && o.statusPresentation ? (m(), D(v, { key: 0 }, [G(H(o), o) ? (m(), D("button", {
				key: 0,
				type: "button",
				class: F(["resource-status-icon", V(o).class]),
				title: f(Si)({
					...H(o),
					label: V(o).label
				}, G(H(o), o), e.t),
				onClick: j((e) => {
					n.$emit("focus", o), n.$emit("action", G(H(o), o), o);
				}, ["stop"])
			}, [y("span", {
				class: F(V(o).icon),
				"aria-hidden": "true"
			}, null, 2), y("span", ra, h(V(o).label), 1)], 10, na)) : (m(), D("span", {
				key: 1,
				class: F(["resource-status-icon", V(o).class]),
				title: f(Si)({
					...H(o),
					label: V(o).label
				}, G(H(o), o), e.t)
			}, [y("span", {
				class: F(V(o).icon),
				"aria-hidden": "true"
			}, null, 2), y("span", aa, h(V(o).label), 1)], 10, ia))], 64)) : r.format === "language" ? (m(), D("span", oa, [o.metadata.languageImage ? (m(), D("img", {
				key: 0,
				src: o.metadata.languageImage,
				alt: ""
			}, null, 8, sa)) : o.metadata.language === "*" ? (m(), D("span", ca)) : A("", !0), y("span", la, h(R(o, r)), 1)])) : r.id === "location" ? (m(), D("span", ua, [B(o, r).parent ? (m(), D("span", da, h(B(o, r).parent), 1)) : A("", !0), y("span", fa, h(B(o, r).leaf), 1)])) : (m(), D("span", pa, h(R(o, r)), 1)), r.overlays && o.overlays?.length ? (m(), D("span", ma, [(m(!0), D(v, null, i(o.overlays.filter((e) => e.id !== "status"), (t) => (m(), D(v, { key: t.id }, [G(t, o) ? (m(), D("button", {
				key: 0,
				type: "button",
				class: F(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: f(Si)(t, G(t, o), e.t),
				onClick: j((e) => {
					n.$emit("focus", o), n.$emit("action", G(t, o), o);
				}, ["stop"])
			}, [t.image ? (m(), D("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, ga)) : (m(), D("span", {
				key: 1,
				class: F(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, ha)) : (m(), D("span", {
				key: 1,
				class: F(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: f(Si)(t, G(t, o), e.t)
			}, [t.image ? (m(), D("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, va)) : (m(), D("span", {
				key: 1,
				class: F(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, _a))], 64))), 128))])) : A("", !0)], 2)], 14, ta))), 128)),
			y("td", ya, [W(o).length ? (m(), D("button", {
				key: 0,
				type: "button",
				class: "resource-row-menu-toggle",
				"aria-expanded": U.value === f(L)(o),
				title: e.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: j((e) => {
					n.$emit("focus", o), ie(f(L)(o));
				}, ["stop"])
			}, [...r[5] ||= [y("span", {
				class: "fas fa-ellipsis-h",
				"aria-hidden": "true"
			}, null, -1)]], 8, ba)) : A("", !0), U.value === f(L)(o) ? (m(), D("div", {
				key: 1,
				class: "resource-item-menu resource-row-menu",
				onClick: r[3] ||= j(() => {}, ["stop"])
			}, [y("strong", null, h(o.title), 1), (m(!0), D(v, null, i(W(o), (t) => (m(), D("button", {
				key: t.id,
				type: "button",
				class: F([`resource-action-${t.id}`, {
					"resource-default-action": t.isDefault,
					"resource-modified-action": t.isModified
				}]),
				title: t.isDefault ? e.t("COM_SMARTBROWSER_DOUBLE_CLICK") : t.isModified ? e.t("COM_SMARTBROWSER_CTRL_DOUBLE_CLICK") : void 0,
				disabled: !e.actionAvailable(t, [o]),
				onClick: (e) => {
					U.value = null, n.$emit("action", t, o);
				}
			}, [x(Sn, { icon: t.icon }, null, 8, ["icon"]), S(" " + h(e.t(t.label)), 1)], 10, xa))), 128))])) : A("", !0)])
		], 42, Xi))), 128))])])]));
	}
};
//#endregion
//#region resources/js/services/ResourceApi.js
function Ca(e, t = 0, n = (e) => e) {
	let r = e?.messages && typeof e.messages == "object" ? Object.values(e.messages).flat() : [], i = [...new Set([e?.message, ...r].filter((e) => typeof e == "string" && e.trim()).map((e) => e.trim()))];
	return i.length ? i.join("; ") : t === 413 ? n("COM_SMARTBROWSER_ERROR_REQUEST_TOO_LARGE") : t ? n("COM_SMARTBROWSER_ERROR_REQUEST_HTTP").replace("%s", String(t)) : n("COM_SMARTBROWSER_ERROR_REQUEST_NETWORK");
}
var wa = class {
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
						let e = Error(Ca(t, Number(t.code) || 0, (e) => Joomla.Text?._(e, e) || e));
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
					let n = Ca(t, Number(e.status) || 0, (e) => Joomla.Text?._(e, e) || e), r = Error(n);
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
}, Ta = /^[a-zA-Z][a-zA-Z0-9_.-]*$/, Ea = (e, t) => Object.prototype.hasOwnProperty.call(e, t), Da = (e, t) => e === t || !!(e && t && typeof e == "object" && typeof t == "object" && Array.isArray(e) === Array.isArray(t) && Object.keys(e).length === Object.keys(t).length && Object.keys(e).every((n) => Ea(t, n) && Da(e[n], t[n]))), Oa = /* @__PURE__ */ new Set(["ext.selectionAddress"]), ka = (e) => encodeURIComponent(String(e)).replace(/[!'()*]/g, (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`), Aa = (e) => e.map(([e, t]) => `${ka(e)}=${ka(t)}`).join("&"), ja = (e) => {
	if (/%(?![a-fA-F0-9]{2})/.test(e)) throw TypeError("Invalid address percent encoding.");
	let t = [...new URLSearchParams(e)];
	if (t.some(([e]) => !e || /[\u0000-\u001f\u007f]/.test(e))) throw TypeError("Invalid address properties.");
	return t;
};
function Ma(e, t = !1) {
	if (typeof e != "string" || !t && !e || /[\u0000-\u0020\u007f<>"\\]/.test(e) || /%(?![a-fA-F0-9]{2})/.test(e) || /[\u0000-\u001f\u007f]/.test(decodeURIComponent(e)) || /^[^/?#]*:/.test(e) && !/^(?:https?:\/\/|mailto:|tel:)/i.test(e) || e.startsWith("//")) throw TypeError("Unsafe resource URL.");
	if (/^https?:/i.test(e)) {
		let t = new URL(e);
		if (!t.hostname || t.username || t.password) throw TypeError("Unsafe resource URL.");
	}
	return e;
}
function Na(e) {
	let t = e.indexOf("/"), n = e.slice(0, t), r = decodeURIComponent(e.slice(t)), i = r;
	try {
		i = decodeURIComponent(r);
	} catch {}
	if (t < 1 || !/^[a-zA-Z0-9_.-]+$/.test(n) || /[\\\u0000-\u001f\u007f]/.test(r) || r.split("/").some((e) => [".", ".."].includes(e)) || i.split("/").includes("..")) throw TypeError("Invalid media locator.");
	return {
		adapter: "media",
		id: `${n}:${r}`
	};
}
function Pa(e) {
	let t = /^([a-zA-Z0-9_.-]+):(\/.*)$/.exec(e.id || "");
	if (!t) throw TypeError("Invalid media reference.");
	let n = t[1] + t[2].split("/").map(ka).join("/");
	return Na(n), n;
}
function Fa() {
	let e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), i = () => {
		for (let e of r) try {
			e();
		} catch (e) {
			console.error(e);
		}
	}, a = new Map(Object.entries({
		article: [
			"articles",
			"featured-articles",
			"articles-by-tag"
		],
		category: ["categories", "articles"],
		tag: ["tags", "articles-by-tag"],
		"menu-item": ["menus"],
		user: ["users"]
	})), o = (e, t, n) => {
		if (!Ta.test(t) || e.has(t)) throw TypeError(`Address registration conflict: ${t}`);
		return e.set(t, n), i(), () => {
			e.get(t) === n && (e.delete(t), i());
		};
	}, s = {
		formats: () => [...e.keys()],
		subscribe(e) {
			return r.add(e), () => r.delete(e);
		},
		getFormat: (t) => e.has(t) ? { ...e.get(t) } : null,
		registerFormat(t, n, { replace: r = !1 } = {}) {
			if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(t) || typeof n?.reference != "function") throw TypeError("An address format requires a reference handler.");
			if (r && e.has(t)) {
				let r = e.get(t);
				return e.set(t, n), i(), () => {
					e.get(t) === n && (e.set(t, r), i());
				};
			}
			return o(e, t, n);
		},
		registerCodec(e, n) {
			if (typeof n?.encode != "function" || typeof n?.decode != "function") throw TypeError("An address codec requires encode/decode.");
			return o(t, e, n);
		},
		registerProperty(e) {
			return o(n, e.key, e);
		},
		registerItemType(e, t) {
			return o(a, e, t);
		},
		parse(t) {
			let n = String(t || "").trim();
			if (!n || n.length > 262144 || /[\r\n]/.test(n)) throw TypeError("Invalid selection address.");
			let r = [...n.matchAll(/#([a-zA-Z][a-zA-Z0-9]*):\/\//g)], i = r.reverse().find((t) => e.has(t[1]));
			if (!i) {
				if (r.length) throw TypeError(`Unsupported address format: ${r[0][1]}`);
				return {
					format: "joomlaLink",
					url: Ma(n),
					locator: "",
					properties: [],
					plain: !0
				};
			}
			let a = Ma(n.slice(0, i.index), !0), o = n.slice(i.index + i[0].length), s = o.indexOf("?"), c = s < 0 ? o : o.slice(0, s);
			if (/[#\s\\]/.test(c) || /%(?![a-fA-F0-9]{2})/.test(c)) throw TypeError("Invalid address locator.");
			return {
				format: i[1],
				url: a,
				locator: c,
				properties: s < 0 ? [] : ja(o.slice(s + 1))
			};
		},
		parseLines(e) {
			if (String(e).length > 4194304) throw TypeError("Selection address input is too large.");
			let t = [], n = [];
			if (String(e).split(/\r?\n/).forEach((e, r) => {
				if (e.trim()) try {
					t.push({
						...s.parse(e),
						line: r + 1
					});
				} catch (e) {
					n.push(`Line ${r + 1}: ${e.message}`);
				}
			}), !t.length && !n.length && n.push("No selection addresses."), n.length) throw TypeError(n.join("\n"));
			if (t.length > 500) throw TypeError("A collection supports at most 500 addresses.");
			return t;
		},
		serialize({ format: t, url: n = "", locator: r = "", properties: i = [] }) {
			if (!e.has(t)) throw TypeError(`Unsupported address format: ${t}`);
			Ma(n, t !== "joomlaLink");
			let a = `${n}#${t}://${r}${i.length ? `?${Aa(i)}` : ""}`;
			return s.parse(a), t === "joomlaLink" && !r && !i.length ? n : a;
		},
		reference(t, n = {}) {
			if (!e.has(t.format)) throw TypeError("Unsupported address format.");
			return e.get(t.format).reference(t, n);
		},
		assertResource(t, n) {
			if (e.get(t.format)?.validate?.(n, t) === !1) throw TypeError("Resource does not support this address format.");
		},
		describe(t, { format: n, nativeAddress: r } = {}) {
			let i = t.selectionAddress || e.get(n || za(t))?.describe?.(t);
			if (!i) throw TypeError("This resource has no address provider.");
			if (i = {
				...i,
				format: n || i.format,
				properties: [...i.properties || []]
			}, !e.has(i.format)) throw TypeError("Unsupported address format.");
			if (r && i.format === "joomlaImage") {
				let e = s.parse(r);
				if (e.plain) return {
					...i,
					url: e.url
				};
				if (e.format !== "joomlaImage" || Na(e.locator).id !== t.id) throw TypeError("Native image identity does not match selection.");
				i = e;
			}
			return i;
		},
		descriptors(t, r = {}, i = za(t)) {
			let a = [], o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), c = e.get(i)?.propertyNames || [];
			for (let e of [...t.selectionCapabilities || [], ...n.values()]) {
				if (r[e.key] === !1 || !Ea(r, e.key) && !e.key?.startsWith("ext.")) continue;
				let t = typeof r[e.key] == "object" ? r[e.key] : {}, n = {
					...e.address,
					...t?.address
				}, i = n.name || e.key;
				if (!Ta.test(i) || o.has(i) || s.has(e.key) || c.includes(i)) throw TypeError(`Address property conflict: ${i}`);
				o.add(i), s.add(e.key), a.push({
					...e,
					...n,
					name: i,
					default: Ea(t, "default") ? t.default : e.default
				});
			}
			return a;
		},
		async encodeProperties(e, n, r, i = {}) {
			let a = s.descriptors(e, n, i.format).filter((e) => !(i.addressConsumed && e.key === "ext.address")), o = r["ext.selectionAddress"] || {}, c = [...o.properties || []], l = /* @__PURE__ */ new Set([...a.flatMap((e) => [e.name, e.name.split(".")[0]]), ...c.map(([e]) => e.split(".")[0])]);
			for (let e of Object.keys(r)) if (!(Oa.has(e) || i.addressConsumed && e === "ext.address" || a.some((t) => t.key === e) || r[e] == null)) {
				if (typeof r[e] == "object") throw TypeError(`No address codec for property: ${e}`);
				if (!e.startsWith("ext.")) throw TypeError(`Unsupported address property: ${e}`);
				if (l.has(e)) throw TypeError(`Address property conflict: ${e}`);
				l.add(e), c.push([e, La(r[e])]);
			}
			for (let e of a) {
				let n = r[e.key];
				if (n == null) continue;
				if (c.some(([t]) => t === e.name)) throw TypeError(`Address property conflict: ${e.name}`);
				if (!e.codec) {
					if ([
						"string",
						"number",
						"boolean"
					].includes(e.type) && typeof n !== e.type) throw TypeError(`Invalid address property type: ${e.name}`);
					if (Da(n, e.default)) continue;
					c.push([e.name, e.values?.[String(n)] ?? La(n)]);
					continue;
				}
				if (Da(n, e.default)) continue;
				let a = t.get(e.codec);
				if (!a) throw TypeError(`Unsupported address codec: ${e.codec}`);
				let s = /^[a-z]$/i.test(e.alias || "") ? e.alias : e.name[0].toLowerCase(), u = s, d = 1;
				for (; l.has(u);) u = s + d++;
				l.add(u);
				let f = await a.encode(n, {
					...i,
					definition: e,
					preserved: o.compounds?.[e.key]
				});
				if (!f.length) throw TypeError("Empty compound address property.");
				c.push([e.name, u], ...f.map(([e, t]) => [`${u}.${e}`, String(t)]));
			}
			return c;
		},
		async decodeProperties(e, n, r, i = {}) {
			let a = s.descriptors(n, r, e.format), o = {}, c = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), u = {};
			for (let n of a) {
				let r = e.properties.flatMap(([e], t) => e === n.name ? [t] : []);
				if (!r.length) continue;
				if (r.length > 1) throw TypeError(`Duplicate address property: ${n.name}`);
				let s = r[0], d = e.properties[s][1];
				if (c.add(s), !n.codec) {
					o[n.key] = Ra(d, n);
					continue;
				}
				let f = t.get(n.codec);
				if (!f || !/^[a-zA-Z][a-zA-Z0-9]*$/.test(d) || l.has(d) || a.some((e) => e.name === d || e.name.startsWith(`${d}.`))) throw TypeError(`Invalid compound alias: ${d}`);
				l.add(d);
				let p = [];
				e.properties.forEach(([e, t], n) => {
					e.startsWith(`${d}.`) && (c.add(n), p.push([e.slice(d.length + 1), t]));
				});
				let m = await f.decode(p, {
					...i,
					definition: n
				});
				o[n.key] = m.value, m.preserved !== void 0 && (u[n.key] = m.preserved);
			}
			return {
				usage: o,
				remaining: e.properties.filter((e, t) => !c.has(t)),
				compounds: u
			};
		}
	}, c = (e) => ({
		propertyNames: e === "joomlaImage" ? ["width", "height"] : e === "joomlaMedia" ? ["mediaType"] : [],
		reference: (e) => Na(e.locator),
		validate: (t, n) => e === "joomlaImage" ? t.type === "image" : e === "joomlaFolder" ? t.kind === "node" : e === "joomlaFile" ? t.kind === "item" : ["audio", "video"].includes(t.type) && n.properties.filter(([e]) => e === "mediaType").length <= 1 && !n.properties.some(([e, n]) => e === "mediaType" && n !== t.type),
		describe(t) {
			let n = t.metadata || {}, r = [];
			if (e === "joomlaImage") for (let e of ["width", "height"]) Number(n[e]) > 0 && r.push([e, String(n[e])]);
			return e === "joomlaMedia" && r.push(["mediaType", t.type]), {
				format: e,
				locator: Pa(t.selection || t),
				url: e === "joomlaFolder" ? n.publicUrl || "" : n.relativePath || n.url || "",
				properties: r
			};
		}
	});
	for (let e of [
		"joomlaImage",
		"joomlaFile",
		"joomlaFolder",
		"joomlaMedia"
	]) s.registerFormat(e, c(e));
	return s.registerFormat("joomlaItem", {
		propertyNames: ["adapter"],
		reference(e, t) {
			let n = /^([a-z][a-z0-9-]*)\/([1-9][0-9]*)$/.exec(e.locator), r = n && a.get(n[1]), i = t.allowedAdapters || [], o = e.properties.filter(([e]) => e === "adapter");
			if (o.length > 1) throw TypeError("Duplicate adapter hint.");
			let s = o.length ? r?.find((e) => e === o[0][1] && (!i.length || i.includes(e))) : r?.find((e) => !i.length || i.includes(e));
			if (!s) throw TypeError("Unsupported or disallowed Joomla resource type.");
			return {
				adapter: s,
				id: `${n[1]}:${n[2]}`
			};
		},
		describe: (e) => {
			let t = a.get(e.id.split(":")[0]) || [];
			return {
				format: "joomlaItem",
				locator: e.id.replace(":", "/"),
				url: e.metadata?.publicUrl || e.status === 1 && (e.type === "menu-item" || e.type === "tag") && e.metadata?.url || "",
				properties: e.adapter && t.includes(e.adapter) && e.adapter !== t[0] ? [["adapter", e.adapter]] : []
			};
		}
	}), s.registerFormat("joomlaLink", {
		propertyNames: ["name"],
		reference(e, t) {
			if (e.locator) throw TypeError("A link address must have an empty locator.");
			if (e.properties.filter(([e]) => e === "name").length > 1) throw TypeError("Duplicate link name.");
			if (!t.linkReference) throw TypeError("No link reference provider.");
			return t.linkReference(Ma(e.url));
		},
		describe: (e) => ({
			format: "joomlaLink",
			locator: "",
			url: e.metadata?.url || e.metadata?.link || "",
			properties: e.metadata?.linkName ? [["name", e.metadata.linkName]] : []
		})
	}), s.registerFormat("joomlaGallery", {
		reference() {
			throw TypeError("No gallery address provider is installed.");
		},
		describe: (e) => ({
			format: "joomlaGallery",
			locator: e.metadata?.galleryLocator || "",
			url: e.metadata?.publicUrl || ""
		})
	}), s.registerCodec("joomlaImage", {
		async encode(e, t) {
			let n;
			if (typeof e == "string" ? n = s.parse(e) : t.preserved && (n = s.parse(t.preserved), Na(n.locator).id !== e.id && (n = null)), !n) {
				let r = await t.resolveReference(e, t.definition.picker || {});
				if (!r || r.unavailable || r.selectable === !1 || r.type !== "image") throw TypeError("Unavailable compound image.");
				n = s.describe(r, { format: "joomlaImage" });
			}
			if (n.format !== "joomlaImage" || !n.url) throw TypeError("A Joomla image requires src and media components.");
			return Na(n.locator), [
				["src", n.url],
				["media", n.locator],
				...n.properties.map(([e, t]) => [Ia.has(e) ? e : `param.${e}`, t])
			];
		},
		async decode(e, t) {
			let n = /* @__PURE__ */ new Map(), r = [];
			for (let [t, i] of e) if (["src", "media"].includes(t)) {
				if (n.has(t)) throw TypeError("Duplicate compound image component.");
				n.set(t, i);
			} else if (Ia.has(t)) r.push([t, i]);
			else if (t.startsWith("param.") && t.length > 6) r.push([t.slice(6), i]);
			else throw TypeError(`Unknown image component: ${t}`);
			if (!n.get("src") || !n.get("media")) throw TypeError("Missing compound image src or media.");
			let i = Na(n.get("media")), a = s.serialize({
				format: "joomlaImage",
				url: n.get("src"),
				locator: n.get("media"),
				properties: r
			});
			return {
				value: t.definition.type === "resource" ? i : a,
				preserved: a
			};
		}
	}), s;
}
var Ia = /* @__PURE__ */ new Set([
	"width",
	"height",
	"crop",
	"ratio",
	"zoom"
]), La = (e) => {
	if (typeof e == "string" || typeof e == "boolean" || typeof e == "number" && Number.isFinite(e)) return String(e);
	throw TypeError("A structured property requires a registered address codec.");
}, Ra = (e, t) => {
	if (t.values) {
		let n = Object.entries(t.values).find(([, t]) => t === e);
		if (!n) throw TypeError(`Unsupported value for ${t.name}`);
		e = n[0];
	}
	if (t.type === "boolean") {
		if (!["true", "false"].includes(e)) throw TypeError("Invalid boolean property.");
		return e === "true";
	}
	if (t.type === "number") {
		if (!e.trim() || !Number.isFinite(Number(e))) throw TypeError("Invalid numeric property.");
		return Number(e);
	}
	if (!["string", void 0].includes(t.type)) throw TypeError("A structured property requires an address codec.");
	return e;
}, za = (e) => e.type === "image" ? "joomlaImage" : e.type === "folder" ? "joomlaFolder" : ["audio", "video"].includes(e.type) ? "joomlaMedia" : e.adapter === "media" || e.type === "document" ? "joomlaFile" : e.type === "uri" || e.adapter === "direct-links" ? "joomlaLink" : e.type === "gallery" ? "joomlaGallery" : "joomlaItem", Ba = Fa();
//#endregion
//#region resources/js/services/SelectionAddressService.js
function Va({ model: e, api: t, config: n, service: r, isDisposed: i = () => !1 }) {
	return {
		async exportAddresses({ selectionIds: t, ...i } = {}) {
			await e.refresh();
			let a = t === void 0 ? null : new Set(t), o = e.getItems().filter((e) => !a || a.has(e.selection ? R(e.selection) : String(e)));
			return r.serializeLines(o, e.resources.value, {
				...n.nativeImage ? { nativeAddress: n.nativeAddress } : {},
				...i
			});
		},
		async importAddresses(a, o) {
			if (!e.referenceItems) throw TypeError("This consumer stores identifiers only, not selection usage.");
			let s = e.revision.value, c = await r.import(a, e.getItems(), o), l = await t.collection(c.items, {
				referenceItems: !0,
				homogeneous: n.homogeneous === !0
			});
			if (i() || e.revision.value !== s) throw Error("Selection changed while importing addresses.");
			if (!Array.isArray(l.resources) || l.resources.length !== c.items.length) throw Error("Incomplete imported selection.");
			let u = new Set(e.getItems().map((e) => R(e.selection)));
			if (l.resources.some((e) => !u.has(e.selectionKey || R(e.selection || {
				adapter: e.adapter || n.adapter,
				id: e.id
			})) && (e.unavailable || e.selectable === !1))) throw Error("An imported resource is unavailable.");
			return await e.setItems(c.items, {
				resolvedResources: l.resources,
				reason: "import"
			}), e.getItems();
		}
	};
}
function Ha({ api: e, config: t, contract: n = t.addressContract || Ba }) {
	let r = !e;
	e ||= new wa({
		...t,
		mode: "select"
	});
	let i = /* @__PURE__ */ new Map(), a = t.selectionProfile || {}, o = {
		...t,
		allowedAdapters: t.allowedAdapters || (t.adapter ? [t.adapter] : []),
		maxSelections: t.multiple === !1 ? 1 : t.maxSelections || 500
	}, s = (e, n = {}) => {
		let r = n.browseRoot ?? (e.adapter === t.adapter ? t.browseRoot : ""), a = JSON.stringify([e.adapter, r]);
		return i.has(a) || i.set(a, new wa({
			...t,
			adapter: e.adapter,
			mode: "select",
			browseRoot: r
		})), i.get(a);
	}, c = async (t, n = {}) => {
		let r = (n.adapter || n.browseRoot ? await s(t, n).collection([t.id]) : await e.collection([{
			selection: t,
			usage: {}
		}], { referenceItems: !0 })).resources?.[0];
		if (!r || r.unavailable || r.selectable === !1 || n.adapter && n.adapter !== t.adapter || n.allowedResourceTypes?.length && !n.allowedResourceTypes.includes(r.type)) throw TypeError("Unavailable or disallowed resource.");
		return r;
	}, l = (e) => n.serialize(e);
	return {
		contract: n,
		async serialize(e, r, i = {}) {
			!r && e?.selection && (r = await c(e.selection)), e?.selection || (e = {
				selection: {
					adapter: t.adapter || r.adapter,
					id: r.id
				},
				usage: {}
			});
			let o = e.usage || {}, s = o["ext.selectionAddress"] || {}, l = i.format || s.format, u = i.nativeAddress || (r.type === "image" ? o["ext.address"] : null), d = n.describe({
				...r,
				adapter: e.selection.adapter
			}, {
				format: l,
				nativeAddress: u
			}), f = await n.encodeProperties(r, a, o, {
				resolveReference: c,
				format: d.format,
				addressConsumed: !!(u && d.format === "joomlaImage")
			});
			for (let [e] of f) if (d.properties.some(([t]) => t === e)) throw TypeError(`Address property conflict: ${e}`);
			return n.serialize({
				...d,
				properties: [...d.properties, ...f]
			});
		},
		async serializeLines(e, n, r = {}) {
			let i = new Map(n.map((e) => [e.selectionKey || R(e.selection || {
				adapter: e.adapter || t.adapter,
				id: e.id
			}), e])), a = [];
			for (let n of e) {
				let e = n.selection ? n : {
					selection: {
						adapter: t.adapter,
						id: String(n)
					},
					usage: {}
				}, o = i.get(R(e.selection));
				if (!o) throw TypeError("Unavailable selection address.");
				a.push(await this.serialize(e, o, r));
			}
			return a.join("\n");
		},
		async import(r, i = [], { append: u = t.multiple !== !1 } = {}) {
			if (t.readOnly) throw TypeError("This selection is read-only.");
			let d = n.parseLines(r), f = [], p = [], m = [];
			for (let e of d) try {
				if (t.nativeImage && e.format !== "joomlaImage") throw TypeError("This native field only accepts Joomla image addresses.");
				let r = await n.reference(e, {
					...o,
					linkReference: async (t) => {
						if (o.allowedAdapters.length && !o.allowedAdapters.includes("direct-links")) throw TypeError("Links are not allowed in this selection.");
						let n = t.startsWith("mailto:") ? "mail" : t.startsWith("tel:") ? "tel" : t.startsWith("#") ? "fragment" : "web", r = e.properties.find(([e]) => e === "name")?.[1] || "";
						return {
							adapter: "direct-links",
							id: (await s({ adapter: "direct-links" }).execute("resolveVirtual", [], {
								nodeId: `direct-links:${n}`,
								value: t,
								addressMode: /^https?:/i.test(t) ? "absolute" : "relative",
								name: r
							})).resource.id
						};
					}
				});
				z([{ selection: r }], o);
				let i = await c(r);
				if (o.allowedResourceTypes?.length && !o.allowedResourceTypes.includes(i.type) || o.selectionTarget && o.selectionTarget !== "both" && o.selectionTarget !== i.kind) throw TypeError("This resource type cannot be selected here.");
				n.assertResource(e, i);
				let u = await n.decodeProperties(e, i, a, { resolveReference: c }), d = u.usage, m = u.remaining;
				if (e.format !== "joomlaImage") {
					let e = m.filter(([e]) => e === "ext.address");
					if (e.length > 1) throw TypeError("Duplicate address override.");
					e.length && (d["ext.address"] = e[0][1], m = m.filter(([e]) => e !== "ext.address"));
				}
				if (t.nativeImage && m.some(([e]) => (i.selectionCapabilities || []).some((t) => (t.address?.name || t.key) === e))) throw TypeError("This image field cannot store these selection properties.");
				e.format === "joomlaImage" ? (d["ext.address"] = l({
					...e,
					properties: m
				}), m = []) : e.format === "joomlaMedia" ? m = m.filter(([e]) => e !== "mediaType") : e.format === "joomlaLink" ? m = m.filter(([e]) => e !== "name") : e.format === "joomlaItem" && (m = m.filter(([e]) => e !== "adapter"));
				let h = {
					format: e.format,
					...m.length ? { properties: m } : {},
					...Object.keys(u.compounds).length ? { compounds: u.compounds } : {}
				};
				if (t.nativeImage || (d["ext.selectionAddress"] = h), t.nativeImage && (Object.keys(u.compounds).length || Object.keys(d).some((e) => !["ext.address", ...t.nativeUsageKeys || []].includes(e)))) throw TypeError("This image field cannot store these selection properties.");
				let g = ln({
					profile: a,
					initialUsage: { [R(r)]: d },
					resolveReference: c,
					editors: globalThis.SmartBrowserPicker?.extensions?.().editors || {}
				}), _ = {
					...i,
					selectionKey: R(r)
				}, v = await g.validate([_]);
				if (!v.valid) throw TypeError(`Invalid selection properties: ${Object.keys(v.errors[R(r)] || {}).join(", ")}`);
				f.push({
					selection: r,
					usage: {
						...d,
						...v.usage[R(r)]
					}
				}), p.push(_);
			} catch (t) {
				m.push(`Line ${e.line}: ${t.message}`);
			}
			if (m.length) throw TypeError(m.join("\n"));
			let h = z(u ? [...i, ...f] : f, o), g = z(f, o), _ = g.map((e) => d[f.findIndex((t) => R(t.selection) === R(e.selection))]?.line), v = await e.collection(g, {
				referenceItems: !0,
				operation: "validate",
				selectionProfile: a
			});
			if (v.errors?.length) throw TypeError(v.errors.map((e) => `Line ${_[e.index] || "?"}: ${e.message}`).join("\n"));
			if (!v.resources || v.resources.some((e) => e.unavailable || e.selectable === !1)) throw TypeError("Resource is no longer available.");
			return {
				items: h,
				resources: [...p, ...v.resources]
			};
		},
		destroy() {
			i.forEach((e) => e.destroy()), i.clear(), r && e.destroy();
		}
	};
}
//#endregion
//#region resources/js/components/CollectionView.vue
var Ua = ["aria-label", "aria-busy"], Wa = { class: "resource-browser" }, Ga = {
	key: 0,
	class: "alert alert-danger",
	role: "alert"
}, Ka = {
	key: 0,
	class: "sb-collection-count"
}, qa = ["aria-expanded"], Ja = { class: "sb-selected-list" }, Ya = { class: "resource-toolbar sb-collection-toolbar" }, Xa = ["disabled", "aria-label"], Za = [
	"disabled",
	"title",
	"aria-label"
], Qa = [
	"disabled",
	"title",
	"aria-label"
], $a = [
	"disabled",
	"title",
	"aria-label"
], eo = [
	"disabled",
	"title",
	"aria-label"
], to = [
	"disabled",
	"title",
	"aria-label"
], no = [
	"disabled",
	"title",
	"aria-label"
], ro = [
	"title",
	"aria-label",
	"aria-pressed",
	"onClick"
], io = [
	"data-info-state",
	"aria-pressed",
	"title",
	"aria-label"
], ao = ["disabled", "aria-label"], oo = { class: "sb-selected-content" }, so = {
	key: 0,
	class: "resource-empty-state sb-selection-empty",
	role: "status"
}, co = ["disabled"], lo = {
	key: 0,
	class: "sb-selected-panel"
}, uo = {
	key: 0,
	class: "sb-selection-gallery-nav"
}, fo = ["disabled", "aria-label"], po = {
	key: 0,
	"aria-hidden": "true"
}, mo = ["disabled", "aria-label"], ho = {
	key: 0,
	"aria-hidden": "true"
}, go = ["aria-label", "aria-valuenow"], _o = {
	key: 3,
	class: "text-danger sb-address-error",
	role: "alert"
}, vo = {
	key: 1,
	class: "sb-collection-count"
}, yo = ["aria-label"], bo = { class: "sb-address-dialog-body" }, xo = ["disabled"], So = {
	key: 0,
	class: "sb-address-append"
}, Co = ["disabled"], wo = {
	key: 1,
	class: "text-danger sb-address-error",
	role: "alert"
}, To = { class: "sb-address-dialog-actions" }, Eo = ["disabled"], Do = ["disabled"], Oo = {
	__name: "CollectionView",
	props: {
		model: Object,
		api: Object,
		config: Object,
		t: Function
	},
	setup(e) {
		let r = e, a = r.model.browser.state, s = !1, d = 0, _ = r.config.addressService || Ha({
			api: r.api,
			config: r.config
		}), ee = r.config.importAddresses ? r.config : Va({
			model: r.model,
			api: r.api,
			config: r.config,
			service: _,
			isDisposed: () => s
		}), te = o({}), N = o({}), P = o(0), ne = _.contract.subscribe(() => {
			P.value++;
		}), z = `sb-address-${T()}`, B = o(null), V = o(""), re = o(""), U = o(!1), ie = o(r.config.multiple !== !1);
		function W() {
			V.value = "", re.value = "", B.value.showModal();
		}
		async function G() {
			if (!U.value) {
				U.value = !0, re.value = "";
				try {
					await ee.importAddresses(V.value, { append: ie.value }), B.value.close();
				} catch (e) {
					re.value = e.message;
				} finally {
					U.value = !1;
				}
			}
		}
		async function K(e = yt.value) {
			if (e.length) try {
				await navigator.clipboard.writeText(await ee.exportAddresses({ selectionIds: [...e] }));
			} catch (e) {
				a.error = e.message || r.t("COM_SMARTBROWSER_COPY_FAILED");
			}
		}
		p(() => {
			s = !0, d++, ne(), r.config.addressService || _.destroy();
		});
		let q = M(() => r.config.selectedResources && r.config.informationPanel !== !1), J = `${r.config.viewPreferenceKey || "supjx.smartbrowser.collection.view"}.${r.config.multiple === !1 ? "single" : "multiple"}-layout`, Y = {};
		try {
			Y = JSON.parse(I().getItem(J) || "{}") || {};
		} catch {}
		let X = o(!q.value || Y.listOpen === !0), Z = o([
			"side",
			"vertical",
			"hidden"
		].includes(Y.infoState) ? Y.infoState : r.config.informationPanelOpen === !1 ? "hidden" : Y.sideInfo === !0 ? "side" : "vertical");
		function ae() {
			Z.value = {
				hidden: "side",
				side: "vertical",
				vertical: "hidden"
			}[Z.value];
		}
		function oe() {
			X.value ? (X.value = !1, Z.value === "hidden" && (Z.value = "vertical")) : (X.value = !0, Z.value = "hidden");
		}
		w(X, (e) => {
			q.value && !e && (Z.value = "vertical");
		}, { immediate: !0 }), w(() => [
			X.value,
			Z.value,
			a.sortBy,
			a.sortDirection,
			a.hiddenColumns,
			a.shownColumns
		], () => {
			if (q.value || r.config.selectedResources) try {
				let e = JSON.parse(I().getItem(J) || "{}") || {};
				I().setItem(J, JSON.stringify({
					...e,
					...q.value ? {
						listOpen: X.value,
						infoState: Z.value
					} : {},
					sortBy: a.sortBy,
					sortDirection: a.sortDirection,
					hiddenColumns: a.hiddenColumns,
					shownColumns: a.shownColumns
				}));
			} catch {}
		}, { deep: !0 });
		let se = M(() => !r.config.readOnly && typeof r.config.onAdd == "function"), ce = o(!1), le = M(() => (r.model.revision?.value, ar(r.config, r.model.getItems().length) && !ce.value && !a.loading && !a.busy));
		async function ue() {
			if (le.value) {
				ce.value = !0;
				try {
					await r.config.onAdd();
				} catch (e) {
					r.config.onError?.(e);
				} finally {
					ce.value = !1;
				}
			}
		}
		a.sortBy = r.config.selectedResources && ["collectionOrder", ...nr.map((e) => e.id)].includes(Y.sortBy) ? Y.sortBy : "collectionOrder", a.sortDirection = Y.sortDirection === "desc" ? "desc" : "asc", w(() => a.sortBy, (e) => {
			r.config.allowOrdering === !1 && e === "collectionOrder" && (a.sortBy = "title");
		}, {
			immediate: !0,
			flush: "sync"
		}), a.hiddenColumns = Array.isArray(Y.hiddenColumns) ? Y.hiddenColumns : [], a.shownColumns = Array.isArray(Y.shownColumns) ? Y.shownColumns : [], a.viewOptions.gridSize = r.config.gridSize || "md", a.viewOptions.detailsThumbnails = r.config.thumbnails !== !1;
		let de = new H(r.api, a, () => r.model.refresh(), r.t, r.config.editorMode || "modal", r.config.application), fe = /* @__PURE__ */ new Map(), pe = (e) => {
			if (!e.adapter) return de;
			if (!fe.has(e.adapter)) {
				let t = new wa({
					...r.config,
					adapter: e.adapter,
					mode: r.config.readOnly ? "readonly" : "manage"
				});
				fe.set(e.adapter, {
					api: t,
					driver: new H(t, a, () => r.model.refresh(), r.t, r.config.editorMode || "modal", r.config.application)
				});
			}
			return fe.get(e.adapter).driver;
		}, me = [
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
		], he = M(() => r.config.selectedResources && r.config.multiple !== !1 && r.model.canOrder && a.sortBy === "collectionOrder" ? [
			{
				id: "collectionMoveUp",
				label: "COM_SMARTBROWSER_MOVE_UP",
				icon: "fas fa-arrow-up",
				requiresSelection: !0,
				collectionCommand: !0
			},
			{
				id: "collectionMoveDown",
				label: "COM_SMARTBROWSER_MOVE_DOWN",
				icon: "fas fa-arrow-down",
				requiresSelection: !0,
				collectionCommand: !0
			},
			{
				id: "collectionSort",
				label: "COM_SMARTBROWSER_COLLECTION_SORT",
				icon: "fas fa-sort",
				requiresSelection: !0,
				collectionCommand: !0
			}
		] : []), ge = M(() => [
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
			...he.value.filter((e) => e.id !== "collectionSort").map((e) => ({
				...e,
				label: e.id === "collectionMoveUp" ? "COM_SMARTBROWSER_ITEM_MOVE_UP" : "COM_SMARTBROWSER_ITEM_MOVE_DOWN"
			})),
			...r.config.selectedResources ? [{
				id: "collectionCopy",
				label: "COM_SMARTBROWSER_COPY_ADDRESS",
				icon: "fas fa-copy",
				requiresSelection: !0,
				collectionCommand: !0
			}] : [],
			...r.config.readOnly ? [] : (r.config.resourceActions || []).map((e) => ({
				...e,
				collectionCommand: !0
			})),
			...r.config.contextActions === !0 && !r.config.readOnly ? a.actions.filter((e) => (r.config.contextActionIds || me).includes(e.id)) : []
		]), _e = M(() => ge.value.find((e) => e.id === "collectionReplace")), ve = M(() => !q.value || X.value ? [] : [
			...se.value ? [{
				id: "collectionAdd",
				label: "COM_SMARTBROWSER_COLLECTION_ADD",
				icon: "fas fa-plus",
				disabled: !le.value
			}] : [],
			...ge.value.filter((e) => ["collectionRemove", "collectionReplace"].includes(e.id)).map((e) => ({
				...e,
				disabled: !$.value || !Ce(e, [$.value])
			})),
			...he.value.map((e) => ({
				...e,
				disabled: !$.value || !Ce(e, [$.value])
			}))
		]), ye = M(() => $.value?.collectionActions?.find((e) => e.id === "preview" && pe($.value).available(e, [$.value])) || Te($.value)), be = (e) => e.id === "collectionReplace" || (r.config.resourceActions || []).some((t) => t.id === e.id), xe = (e, t) => t.collectionActions?.find((t) => t.id === e.id) || e, Se = (e) => yt.value.includes(L(e)) ? yt.value : [L(e)], Ce = (e, t) => {
			if (a.loading || a.busy) return !1;
			if (e.id === "collectionAdd") return le.value;
			if (e.id === "collectionCopy") return t.length > 0;
			if (e.id === "collectionImport") return r.model.referenceItems && !r.config.readOnly;
			if ([
				"collectionMoveUp",
				"collectionMoveDown",
				"collectionSort"
			].includes(e.id)) {
				if (!he.value.some((t) => t.id === e.id)) return !1;
				if (e.id === "collectionSort") return Q.value.length > 1;
				if (!t[0]) return !1;
				let n = new Set(Se(t[0])), r = e.id === "collectionMoveUp" ? -1 : 1;
				return Q.value.some((e, t) => n.has(L(e)) && Q.value[t + r] && !n.has(L(Q.value[t + r])));
			}
			return e.id === "collectionRemove" ? r.model.canRemove : be(e) ? !r.config.readOnly : !t.some((e) => e.unavailable) && t.every((t) => (!t.collectionActions || t.collectionActions.some((t) => t.id === e.id)) && pe(t).available(xe(e, t), [t]));
		}, we = (e) => ge.value.find((t) => t.id === r.config.defaultResourceActionId && Ce(t, [e])) || (r.config.contextActions === !0 && !r.config.readOnly ? bi({
			...e,
			activatable: !e.unavailable
		}, "manage", ge.value, Ce) : null), Te = (e) => r.config.contextActions === !0 && !r.config.readOnly ? vi(e, "manage", ge.value, Ce) : null;
		async function Ee(e, t) {
			if (![
				"collectionSort",
				"collectionAdd",
				"collectionCopy",
				"collectionImport",
				"collectionMoveUp",
				"collectionMoveDown"
			].includes(e?.id) || Ce(e, t ? [t] : [])) {
				if (e?.id === "collectionSort") {
					e.disabled || je.value?.open();
					return;
				}
				if (e?.id === "collectionAdd") return ue();
				if (e?.id === "collectionCopy") return K(Se(t));
				if (e?.id === "collectionImport") return W();
				if (["collectionMoveUp", "collectionMoveDown"].includes(e?.id)) return !t || e.disabled ? void 0 : r.model.move(e.id === "collectionMoveUp" ? "up" : "down", Se(t));
				if (t && Ce(e, [t])) {
					if (e.id === "collectionRemove") return r.model.remove(yt.value.includes(L(t)) ? yt.value : [L(t)]);
					try {
						await (e.id === "collectionReplace" ? r.config.onReplace(t) : be(e) ? r.config.onResourceAction?.(e, t) : pe(t).execute(xe(e, t), [t]));
					} catch (e) {
						r.config.onError?.(e);
					}
				}
			}
		}
		let De = M(() => r.config.selectedResources ? nr : (a.presentation.sortFields || [{
			id: "title",
			label: "COM_SMARTBROWSER_NAME"
		}]).filter((e) => !["ordering", "collectionOrder"].includes(e.id))), Oe = M(() => r.config.selectedResources ? tr : a.presentation.columns || [{
			id: "title",
			label: "COM_SMARTBROWSER_NAME"
		}]), ke = M(() => Oe.value.filter((e) => e.id === "title" || (e.defaultVisible === !1 ? a.shownColumns.includes(e.id) : !a.hiddenColumns.includes(e.id)))), Ae = (e) => {
			let t = Oe.value.find((t) => t.id === e);
			if (!t || e === "title") return;
			let n = t.defaultVisible === !1 ? "shownColumns" : "hiddenColumns";
			a[n] = a[n].includes(e) ? a[n].filter((t) => t !== e) : [...a[n], e];
		}, je = o(null);
		function Me({ payload: e, resolve: t, reject: n }) {
			try {
				if (!e.sort || a.sortBy !== "collectionOrder" || !De.value.some((t) => t.id === e.sort.field) || !["asc", "desc"].includes(e.sort.direction)) throw Error("Invalid collection sorting state.");
				r.model.reorderItems(rr(Q.value, e.sort.field, e.sort.direction).map(L)), a.sortDirection = "asc", t();
			} catch (e) {
				n(e);
			}
		}
		let Ne = (e) => {
			a.sortBy === e ? a.sortDirection = a.sortDirection === "asc" ? "desc" : "asc" : (a.sortBy = e, a.sortDirection = "asc");
		}, Pe = [{
			id: "grid",
			label: "COM_SMARTBROWSER_GRID",
			icon: "fas fa-th"
		}, {
			id: "details",
			label: "COM_SMARTBROWSER_DETAILS",
			icon: "fas fa-list"
		}], Fe = M(() => r.model.browser.bulkSelectableResources.value.length > 0 && r.model.browser.bulkSelectableResources.value.every((e) => a.selectedIds.includes(L(e)))), Ie = o(null), Le = o(0), Re = o(null), ze = o(!1), Be = o(!1), Ve = o(!1), He = o(null), Ue = o(null), We = o(null), Ge = M(() => Je.value && Qe.value && !$.value && Ue.value ? Ue.value : !X.value && We.value ? We.value : He.value);
		function Ke() {
			let e = Re.value;
			e && (ze.value = e.scrollWidth > e.clientWidth + 2, Be.value = e.scrollLeft > 1, Ve.value = e.scrollLeft + e.clientWidth < e.scrollWidth - 1);
		}
		function qe(e) {
			Re.value.scrollBy({
				left: e * 260,
				behavior: "smooth"
			});
		}
		let Je = M(() => q.value && !X.value || Z.value !== "hidden"), Ye = M(() => r.config.informationPanelVerticalPosition || (["top", "bottom"].includes(r.config.informationPanelPosition) ? r.config.informationPanelPosition : "top")), Xe = M(() => r.config.informationPanelHorizontalPosition || (["left", "right"].includes(r.config.informationPanelPosition) ? r.config.informationPanelPosition : "right")), Ze = M(() => q.value ? X.value ? Z.value === "side" && Le.value >= 640 ? Xe.value : Ye.value : "top" : or(r.config.informationPanelPosition, Le.value)), Qe = M(() => ["top", "bottom"].includes(Ze.value)), $e = o(0), et = M(() => $e.value && Je.value && ["left", "right"].includes(Ze.value) ? { gridTemplateColumns: Ze.value === "left" ? `${tt($e.value)}px minmax(0, 1fr)` : `minmax(0, 1fr) ${tt($e.value)}px` } : void 0), tt = (e) => Math.max(200, Math.min(e, Le.value - 200)), nt;
		function rt(e) {
			e.button === 0 && (e.preventDefault(), nt = {
				x: e.clientX,
				width: e.currentTarget.parentElement.getBoundingClientRect().width
			}, e.currentTarget.setPointerCapture(e.pointerId));
		}
		function it(e) {
			nt && ($e.value = tt(nt.width + (e.clientX - nt.x) * (Ze.value === "left" ? 1 : -1)));
		}
		function at() {
			nt = null;
		}
		function ot(e) {
			$e.value = tt(($e.value || Le.value * .32) + e * (Ze.value === "left" ? 1 : -1));
		}
		let st = M(() => r.config.readOnly ? "readonly" : r.config.selectionUseData || "readonly"), ct = window.SmartBrowserPicker?.extensions?.() || {
			editors: {},
			previewActions: []
		}, lt = o(ct.previewActions), ut = window.SmartBrowserPicker?.subscribePreviewActions?.((e) => {
			lt.value = e;
		});
		p(() => ut?.());
		let dt = /* @__PURE__ */ new Map();
		async function ft(e, t = {}) {
			let n = JSON.stringify([e.adapter, t.browseRoot || ""]);
			return dt.has(n) || dt.set(n, new wa({
				...r.config,
				adapter: e.adapter,
				mode: "select",
				browseRoot: t.browseRoot || null,
				flatScope: null
			})), (await dt.get(n).collection([e.id])).resources[0];
		}
		let pt = (e) => (r.model.revision?.value, r.model.getItems().find((t) => t.selection && R(t.selection) === L(e))?.usage || {}), mt = M(() => (r.model.revision?.value, ln({
			profile: r.config.selectionProfile || {},
			initialUsage: Object.fromEntries(r.model.resources.value.map((e) => [L(e), pt(e)])),
			editors: ct.editors,
			resolveReference: ft
		}))), ht = o({}), gt = o({}), Q = M(() => {
			let e = r.model.resources.value.map((e) => {
				let t = Ut(e, pt(e)), n = gt.value[L(e)];
				return r.config.selectedResources ? {
					...Qn({
						...t,
						effectiveThumbnail: ht.value[L(e)],
						effectiveThumbnailResource: n,
						imageCrop: n?.imageCrop || e.imageCrop
					}, a.presentation),
					selectionPath: te.value[L(e)] || (N.value[L(e)] ? r.t("COM_SMARTBROWSER_ADDRESS_UNAVAILABLE") : "")
				} : t;
			});
			return r.config.selectedResources && a.sortBy !== "collectionOrder" ? rr(e, a.sortBy, a.sortDirection) : e;
		});
		w(() => [
			r.model.resources.value,
			r.model.revision?.value,
			r.config.nativeAddress,
			r.config.selectionProfile,
			P.value
		], async () => {
			let e = ++d, t = {}, n = {};
			for (let e of r.model.resources.value) {
				let i = L(e), a = r.model.getItems().find((e) => e.selection && R(e.selection) === i) || {
					selection: e.selection || {
						adapter: e.adapter || r.config.adapter,
						id: e.id
					},
					usage: {}
				};
				try {
					t[i] = await _.serialize(a, e, r.config.nativeImage ? { nativeAddress: r.config.nativeAddress } : {});
				} catch (e) {
					n[i] = e.message;
				}
			}
			e === d && !s && (te.value = t, N.value = n);
		}, {
			immediate: !0,
			deep: !0
		});
		let $ = M(() => Q.value.find((e) => L(e) === a.focusedId) || Q.value[0] || null), _t = M(() => Q.value.findIndex((e) => L(e) === L($.value)));
		function vt(e) {
			let t = Q.value[_t.value + e];
			t && r.model.browser.focus(t);
		}
		let yt = M(() => a.selectedIds), bt = M(() => r.config.multiple === !1 ? Q.value.map(L) : yt.value);
		w(() => r.config.multiple === !1 ? L(Q.value[0]) : null, (e) => {
			e && (a.selectedIds = [e]);
		}, { immediate: !0 });
		let xt = M(() => st.value === "hidden" ? [] : mt.value.definitions($.value).filter((e) => e.presentation !== "hidden")), St = o(0), Ct = 0, wt = M(() => (St.value, {
			...pt($.value),
			...mt.value.get($.value)
		})), Tt = o({});
		function Et(e, t) {
			r.model.browser.toggle(e, t);
		}
		async function Dt(e, t) {
			let n = $.value;
			if (!n || st.value !== "editable") return;
			let i = mt.value, a = ++Ct;
			i.set(n, e, t), St.value++;
			let o = {
				...pt(n),
				...i.get(n)
			}, s = await i.validate([n]);
			a === Ct && i === mt.value && (L($.value) === L(n) && (Tt.value = s.errors[L(n)] || {}), s.valid && r.model.setUsage(n, o));
		}
		let Ot = M(() => {
			let e = $.value, t = () => $n(e);
			return xi({
				resource: e,
				isReadOnly: st.value !== "editable",
				fieldElement: Ie.value?.closest(".sb-selection-field") || null,
				profile: r.config.selectionProfile || {},
				values: wt.value,
				getValues: () => ({
					...pt(e),
					...mt.value.get(e)
				}),
				getAddress: () => (r.config.nativeImage || r.config.nativePreview ? r.config.nativeAddress : void 0) ?? pt(e)["ext.address"] ?? $n(e),
				getSelectionAddress: () => te.value[L(e)] || "",
				getDefaultAddress: t,
				resetAddress: () => {
					if (L($.value) === L(e)) return r.config.nativeImage || r.config.nativePreview ? (r.config.nativeAddress = t(), Dt("ext.address", r.config.nativeAddress)) : Dt("ext.address", null);
				},
				setAddress: (t) => {
					if (L($.value) === L(e)) return r.config.nativeAddress = String(t || ""), Dt("ext.address", r.config.nativeAddress);
				},
				isCurrent: () => L($.value) === L(e),
				setValue: (t, n) => {
					if (L($.value) === L(e)) return Dt(t, n);
				},
				refresh: () => r.model.refresh(),
				selectResource: (e) => window.SmartBrowserPicker.open(e)
			});
		}), kt = M(() => lt.value.filter((e) => {
			try {
				return $.value && (st.value === "editable" || e.allowReadOnly === !0) && (!e.applies || e.applies(Ot.value));
			} catch {
				return !1;
			}
		})), At, jt = 0;
		return w(() => [r.model.resources.value, r.model.revision?.value], async () => {
			let e = ++jt, t = {}, n = {};
			for (let e of r.model.resources.value) {
				let r = pt(e), i = Ht(mt.value.definitions(e)).find((e) => r[e.key]);
				if (i) try {
					n[L(e)] = await Yt(i, r[i.key], ft), t[L(e)] = Gt(n[L(e)]);
				} catch {}
			}
			e === jt && (ht.value = t, gt.value = n);
		}, { immediate: !0 }), n(() => {
			At = new ResizeObserver(() => {
				Le.value = Ie.value.getBoundingClientRect().width, Ke();
			}), At.observe(Ie.value), At.observe(Re.value);
		}), p(() => {
			At?.disconnect(), jt++, dt.forEach((e) => e.destroy());
		}), p(() => {
			de.destroy(), fe.forEach(({ driver: e, api: t }) => {
				e.destroy(), t.destroy();
			});
		}), (n, r) => (m(), D("section", {
			ref_key: "control",
			ref: Ie,
			class: F(["smartbrowser smartbrowser-collection", {
				"is-compact": e.config.layout === "compact",
				"is-selected-resources": e.config.selectedResources,
				"is-single-selection": q.value && ["top", "bottom"].includes(Ze.value)
			}]),
			"aria-label": e.t("COM_SMARTBROWSER_COLLECTION_TITLE"),
			"aria-busy": f(a).loading || f(a).busy
		}, [
			y("div", Wa, [
				f(a).error ? (m(), D("p", Ga, h(f(a).error), 1)) : A("", !0),
				y("div", {
					class: F(["sb-selected-layout", [`panel-${Ze.value}`, {
						"panel-open": Je.value && e.config.informationPanel !== !1,
						"is-collapsed": q.value && !X.value
					}]]),
					style: t(X.value ? et.value : void 0)
				}, [y("div", { class: F(["sb-selected-items", `view-${f(a).activeView}`]) }, [q.value ? (m(), D("div", Ka, [y("button", {
					type: "button",
					class: "sb-collection-count-toggle",
					"aria-expanded": X.value,
					onClick: oe
				}, [y("span", { class: F(X.value ? "fas fa-chevron-up" : "fas fa-chevron-down") }, null, 2), S(h(e.t("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": " + h(e.model.getItems().length), 1)], 8, qa)])) : A("", !0), l(y("div", Ja, [y("header", Ya, [
					l(y("button", {
						class: "resource-icon-button sb-toolbar-scroll",
						type: "button",
						disabled: !Be.value,
						"aria-label": e.t("COM_SMARTBROWSER_SCROLL_BACK"),
						onClick: r[0] ||= (e) => qe(-1)
					}, [...r[19] ||= [y("span", { class: "fas fa-chevron-left" }, null, -1)]], 8, Xa), [[g, ze.value]]),
					y("div", {
						ref_key: "toolbar",
						ref: Re,
						class: "resource-view-controls",
						onScroll: Ke
					}, [
						se.value ? (m(), D("button", {
							key: 0,
							class: "resource-icon-button",
							type: "button",
							disabled: !le.value,
							title: e.t(e.config.addLabel || "COM_SMARTBROWSER_COLLECTION_ADD"),
							"aria-label": e.t(e.config.addLabel || "COM_SMARTBROWSER_COLLECTION_ADD"),
							onClick: ue
						}, [...r[20] ||= [y("span", {
							class: "fas fa-plus",
							"aria-hidden": "true"
						}, null, -1)]], 8, Za)) : A("", !0),
						e.model.canRemove ? (m(), D("button", {
							key: 1,
							class: "resource-icon-button",
							type: "button",
							disabled: !bt.value.length || f(a).loading || f(a).busy,
							title: e.t("COM_SMARTBROWSER_COLLECTION_REMOVE"),
							"aria-label": e.t("COM_SMARTBROWSER_COLLECTION_REMOVE"),
							onClick: r[1] ||= (t) => e.model.remove(bt.value)
						}, [...r[21] ||= [y("span", {
							class: "fas fa-minus",
							"aria-hidden": "true"
						}, null, -1)]], 8, Qa)) : A("", !0),
						_e.value ? (m(), D("button", {
							key: 2,
							class: "resource-icon-button",
							type: "button",
							disabled: !$.value || !Ce(_e.value, [$.value]),
							title: e.t(_e.value.label),
							"aria-label": e.t(_e.value.label),
							onClick: r[2] ||= (e) => Ee(_e.value, $.value)
						}, [x(Sn, { icon: _e.value.icon }, null, 8, ["icon"])], 8, $a)) : A("", !0),
						e.model.canOrder && f(a).sortBy === "collectionOrder" ? (m(), b(Kr, {
							key: 3,
							enabled: !f(a).loading && !f(a).busy && f(a).selectedIds.length > 0,
							t: e.t,
							onReorder: e.model.move
						}, null, 8, [
							"enabled",
							"t",
							"onReorder"
						])) : A("", !0),
						e.config.selectedResources && e.config.multiple !== !1 && e.model.canOrder && f(a).sortBy === "collectionOrder" ? (m(), D("button", {
							key: 4,
							class: "resource-icon-button",
							type: "button",
							disabled: Q.value.length < 2 || f(a).busy || f(a).loading,
							title: e.t("COM_SMARTBROWSER_COLLECTION_SORT"),
							"aria-label": e.t("COM_SMARTBROWSER_COLLECTION_SORT"),
							onClick: r[3] ||= (e) => je.value.open()
						}, [...r[22] ||= [y("span", { class: "fas fa-sort" }, null, -1)]], 8, eo)) : A("", !0),
						y("span", {
							ref_key: "toolbarExtraHost",
							ref: He
						}, null, 512),
						e.config.selectedResources ? (m(), D("button", {
							key: 5,
							type: "button",
							class: "resource-icon-button",
							disabled: !yt.value.length || f(a).loading || f(a).busy,
							title: e.t("COM_SMARTBROWSER_COPY_ADDRESSES"),
							"aria-label": e.t("COM_SMARTBROWSER_COPY_ADDRESSES"),
							onClick: r[4] ||= (e) => K()
						}, [...r[23] ||= [y("span", { class: "fas fa-copy" }, null, -1)]], 8, to)) : A("", !0),
						e.config.selectedResources && e.model.referenceItems && !e.config.readOnly ? (m(), D("button", {
							key: 6,
							type: "button",
							class: "resource-icon-button",
							disabled: f(a).loading || f(a).busy,
							title: e.t("COM_SMARTBROWSER_IMPORT_ADDRESSES"),
							"aria-label": e.t("COM_SMARTBROWSER_IMPORT_ADDRESSES"),
							onClick: W
						}, [...r[24] ||= [y("span", { class: "fas fa-paste" }, null, -1)]], 8, no)) : A("", !0),
						f(a).activeView === "grid" && (e.config.selectedResources || e.config.layout !== "compact") ? (m(), b(ai, {
							key: 7,
							alignment: "start",
							fields: De.value,
							"sort-by": f(a).sortBy,
							"sort-direction": f(a).sortDirection,
							"default-value": e.config.allowOrdering === !1 ? null : "collectionOrder",
							"default-label": "JGRID_HEADING_ORDERING",
							t: e.t,
							onSortBy: r[5] ||= (e) => {
								f(a).sortBy = e, f(a).sortDirection = "asc";
							},
							onSortDirectionValue: r[6] ||= (e) => f(a).sortDirection = e
						}, null, 8, [
							"fields",
							"sort-by",
							"sort-direction",
							"default-value",
							"t"
						])) : A("", !0),
						e.config.selectedResources && f(a).activeView === "details" ? (m(), b($r, {
							key: 8,
							columns: Oe.value,
							"hidden-columns": f(a).hiddenColumns,
							"shown-columns": f(a).shownColumns,
							t: e.t,
							onToggleColumn: Ae
						}, null, 8, [
							"columns",
							"hidden-columns",
							"shown-columns",
							"t"
						])) : A("", !0),
						(m(), D(v, null, i(Pe, (t) => y("button", {
							key: t.id,
							class: F(["resource-icon-button", { active: f(a).activeView === t.id }]),
							type: "button",
							title: e.t(t.label),
							"aria-label": e.t(t.label),
							"aria-pressed": f(a).activeView === t.id,
							onClick: (e) => f(a).activeView = t.id
						}, [y("span", {
							class: F(t.icon),
							"aria-hidden": "true"
						}, null, 2)], 10, ro)), 64)),
						e.config.informationPanel !== !1 && e.config.selectedResources ? (m(), D("button", {
							key: 9,
							class: F(["resource-icon-button", {
								active: Z.value === "side",
								"info-vertical": Z.value === "vertical"
							}]),
							type: "button",
							"data-info-state": Z.value,
							"aria-pressed": Je.value,
							title: e.t("COM_SMARTBROWSER_USAGE_INFO"),
							"aria-label": e.t("COM_SMARTBROWSER_USAGE_INFO"),
							onClick: ae
						}, [...r[25] ||= [y("span", {
							class: "fas fa-info-circle",
							"aria-hidden": "true"
						}, null, -1)]], 10, io)) : A("", !0)
					], 544),
					l(y("button", {
						class: "resource-icon-button sb-toolbar-scroll",
						type: "button",
						disabled: !Ve.value,
						"aria-label": e.t("COM_SMARTBROWSER_SCROLL_FORWARD"),
						onClick: r[7] ||= (e) => qe(1)
					}, [...r[26] ||= [y("span", { class: "fas fa-chevron-right" }, null, -1)]], 8, ao), [[g, ze.value]])
				]), y("div", oo, [e.model.resources.value.length ? (m(), b(u(f(a).activeView === "details" ? Sa : Bi), {
					key: 1,
					resources: Q.value,
					"selected-ids": yt.value,
					"focused-id": f(a).focusedId,
					"all-selected": Fe.value,
					"selection-controls": e.config.multiple !== !1,
					options: f(a).viewOptions,
					actions: ge.value,
					"action-available": Ce,
					"default-action": we,
					"preview-action": Te,
					"grid-fields": e.config.selectedResources ? [...f(a).presentation.gridFields || [], ...ke.value.filter((e) => e.defaultVisible === !1)] : f(a).presentation.gridFields || [],
					columns: ke.value,
					"sort-by": f(a).sortBy,
					"sort-direction": f(a).sortDirection,
					"sort-fields": De.value,
					"ordering-field": e.config.allowOrdering === !1 ? void 0 : "collectionOrder",
					t: e.t,
					onSelect: Et,
					onSelectAll: e.model.browser.selectAll,
					onFocus: e.model.browser.focus,
					onAction: Ee,
					onSort: Ne
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
				])) : (m(), D("div", so, [y("span", null, h(e.t(f(a).loading ? "COM_SMARTBROWSER_LOADING" : "COM_SMARTBROWSER_COLLECTION_EMPTY")), 1), se.value && (!Je.value || !Qe.value) ? (m(), D("button", {
					key: 0,
					type: "button",
					class: "btn btn-outline-secondary",
					disabled: !le.value,
					onClick: ue
				}, [r[27] ||= y("span", { class: "fas fa-plus" }, null, -1), S(" " + h(e.t("COM_SMARTBROWSER_SELECT_RESOURCE")), 1)], 8, co)) : A("", !0)]))])], 512), [[g, !q.value || X.value]])], 2), e.config.selectedResources && e.config.informationPanel !== !1 ? l((m(), D("div", lo, [
					e.config.multiple !== !1 && ["top", "bottom"].includes(Ze.value) && Q.value.length > 1 ? (m(), D("div", uo, [y("button", {
						type: "button",
						class: "resource-icon-button",
						disabled: _t.value <= 0,
						"aria-label": e.t("COM_SMARTBROWSER_PREVIOUS_RESOURCE"),
						onClick: r[8] ||= (e) => vt(-1)
					}, [r[28] ||= y("span", { class: "fas fa-chevron-left" }, null, -1), _t.value > 0 ? (m(), D("small", po, h(_t.value), 1)) : A("", !0)], 8, fo), y("button", {
						type: "button",
						class: "resource-icon-button",
						disabled: _t.value >= Q.value.length - 1,
						"aria-label": e.t("COM_SMARTBROWSER_NEXT_RESOURCE"),
						onClick: r[9] ||= (e) => vt(1)
					}, [_t.value < Q.value.length - 1 ? (m(), D("small", ho, h(_t.value + 2), 1)) : A("", !0), r[29] ||= y("span", { class: "fas fa-chevron-right" }, null, -1)], 8, mo)])) : A("", !0),
					X.value && ["left", "right"].includes(Ze.value) ? (m(), D("div", {
						key: 1,
						class: "sb-panel-resize",
						role: "separator",
						tabindex: "0",
						"aria-orientation": "vertical",
						"aria-label": e.t("COM_SMARTBROWSER_RESIZE_INFO"),
						"aria-valuenow": Math.round($e.value || Le.value * .32),
						onPointerdown: rt,
						onPointermove: it,
						onPointerup: at,
						onPointercancel: at,
						onKeydown: [r[10] ||= k(j((e) => ot(-16), ["prevent"]), ["left"]), r[11] ||= k(j((e) => ot(16), ["prevent"]), ["right"])],
						onDblclick: r[12] ||= (e) => $e.value = 0
					}, null, 40, go)) : A("", !0),
					e.config.selectedResources && e.config.informationPanel !== !1 ? l((m(), b(Hr, {
						key: 2,
						"selection-only": "",
						resource: $.value,
						fields: f(a).presentation.infoFields,
						t: e.t,
						address: te.value[f(L)($.value)] || "",
						"usage-mode": st.value,
						"usage-definitions": xt.value,
						"usage-values": wt.value,
						"usage-errors": Tt.value,
						"usage-editors": f(ct).editors,
						"resolve-reference": ft,
						"preview-actions": kt.value,
						"selection-actions": ve.value,
						"allow-add": se.value && Qe.value,
						"allow-quick-add": se.value && Qe.value && !X.value,
						"add-disabled": !le.value,
						"can-preview": !!ye.value,
						"preview-context": Ot.value,
						"native-preview": e.config.nativePreview,
						onSelectionAdd: ue,
						onSelectionAction: r[13] ||= (e) => Ee(e, $.value),
						onPreview: r[14] ||= (e) => Ee(ye.value, $.value),
						onUsageChange: Dt
					}, {
						"empty-actions": c(() => [y("span", {
							ref_key: "emptyExtraHost",
							ref: Ue,
							class: "sb-preview-host-actions"
						}, null, 512)]),
						"quick-actions": c(() => [y("span", {
							ref_key: "quickExtraHost",
							ref: We,
							class: "sb-preview-host-actions"
						}, null, 512)]),
						_: 1
					}, 8, [
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
						"add-disabled",
						"can-preview",
						"preview-context",
						"native-preview"
					])), [[g, Je.value]]) : A("", !0),
					$.value && N.value[f(L)($.value)] ? (m(), D("p", _o, h(N.value[f(L)($.value)]), 1)) : A("", !0)
				], 512)), [[g, Je.value]]) : A("", !0)], 6),
				e.config.showCount !== !1 && !q.value ? (m(), D("footer", vo, h(e.t("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": " + h(e.model.getItems().length), 1)) : A("", !0),
				(m(), b(E, {
					to: Ge.value || "body",
					disabled: !Ge.value
				}, [r[30] ||= y("span", { class: "sb-collection-extra-buttons" }, null, -1)], 8, ["to", "disabled"]))
			]),
			e.config.selectedResources && e.model.canOrder && e.config.multiple !== !1 ? (m(), b(Lt, {
				key: 0,
				ref_key: "collectionSort",
				ref: je,
				"collection-only": "",
				selection: Q.value,
				adapter: e.config.adapter || "mixed",
				"sort-fields": De.value,
				"ordering-available": "",
				t: e.t,
				onApply: Me
			}, null, 8, [
				"selection",
				"adapter",
				"sort-fields",
				"t"
			])) : A("", !0),
			y("dialog", {
				ref_key: "addressDialog",
				ref: B,
				class: "resource-batch-preview-dialog sb-address-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_IMPORT_ADDRESSES"),
				onCancel: r[18] ||= j((e) => !U.value && B.value.close(), ["prevent"])
			}, [y("div", bo, [
				y("label", {
					for: z,
					class: "form-label"
				}, h(e.t("COM_SMARTBROWSER_IMPORT_ADDRESSES")), 1),
				l(y("textarea", {
					id: z,
					"onUpdate:modelValue": r[15] ||= (e) => V.value = e,
					class: "form-control",
					rows: "7",
					maxlength: "4194304",
					disabled: U.value
				}, null, 8, xo), [[C, V.value]]),
				e.config.multiple === !1 ? A("", !0) : (m(), D("label", So, [l(y("input", {
					"onUpdate:modelValue": r[16] ||= (e) => ie.value = e,
					type: "checkbox",
					disabled: U.value
				}, null, 8, Co), [[O, ie.value]]), S(" " + h(e.t("COM_SMARTBROWSER_ADDRESS_APPEND")), 1)])),
				re.value ? (m(), D("p", wo, h(re.value), 1)) : A("", !0),
				y("div", To, [y("button", {
					type: "button",
					class: "btn btn-primary",
					disabled: U.value,
					onClick: G
				}, h(e.t("COM_SMARTBROWSER_IMPORT")), 9, Eo), y("button", {
					type: "button",
					class: "btn btn-secondary",
					disabled: U.value,
					onClick: r[17] ||= (e) => B.value.close()
				}, h(e.t("JCANCEL")), 9, Do)])
			])], 40, yo)
		], 10, Ua));
	}
}, ko = (e, t) => (n, r) => {
	if (e === "ordering" && n.type === "article" && r.type === "article" && n.parentId !== r.parentId && n.metadata?.locationPath && r.metadata?.locationPath) {
		let e = n.metadata.locationPath.localeCompare(r.metadata.locationPath);
		if (e) return t === "asc" ? e : -e;
	}
	let i = (t) => e === "title" ? String(t.title || "").toLocaleLowerCase() : e === "location" ? t.metadata?.locationPath || t.metadata?.location || t.metadata?.categoryPath || t.metadata?.parentPath || t.metadata?.parent || "" : e === "ordering" ? t.metadata?.hierarchyOrder ?? t.metadata?.ordering : e === "dimension" ? (t.metadata?.width || 0) * (t.metadata?.height || 0) : t.metadata?.[e], a = i(n), o = i(r), s = typeof a == "string" ? (a || "").localeCompare(o || "") : (a || 0) - (o || 0);
	return t === "asc" ? s : -s;
};
//#endregion
//#region resources/js/core/createBrowserState.js
function Ao({ options: e, api: t, persistence: n, viewRegistry: r }) {
	let i = e.pickerContext || e.selectionHost, o = !!i?.collectionMode, s = (o || e.mode === "select") && e.multiple === !1 ? 1 : i?.maxSelections ?? e.maxSelections ?? 500, c = o ? i.getCollectionSnapshot() : null, l = !!(o || e.selectionState || e.pickerContext && (Object.keys(e.pickerContext.selectionProfile || {}).length || e.pickerContext.initialSelection?.length)), u = e.adapter?.replace(/^flat-/, ""), d = (e) => o ? {
		...e,
		adapter: u,
		selection: {
			adapter: u,
			id: e.id
		},
		selectionKey: R({
			adapter: u,
			id: e.id
		})
	} : e, f = (t) => o && e.multiple && i.homogeneous && _.selectedIds.length && (_.selectedResources[_.selectedIds[0]]?.selection?.adapter || c.items.find((e) => R(e.selection) === _.selectedIds[0])?.selection.adapter) !== t.selection?.adapter, p = new Set(e.allowedResourceTypes || []), m = (t) => e.mode === "readonly" || f(t) || p.size && !p.has(t.type) ? {
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
	let _ = a({
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
		revealIds: [],
		selectedIds: c ? c.items.map((e) => R(e.selection)) : [],
		selectedResources: c?.resources || {},
		virtualResources: c?.virtualResources || {},
		search: "",
		navigationRevision: 0,
		loading: !1,
		busy: !1,
		error: ""
	}), v = M(() => {
		let t = _.search.trim().toLocaleLowerCase(), n = (e) => !t || [
			e.title,
			e.subtitle,
			e.metadata?.alias
		].some((e) => String(e || "").toLocaleLowerCase().includes(t)), r = (_.presentation.navigationOnlyNodes ? [] : _.nodes).map(d).map(ci).map(m).filter(n), i = (_.presentation.selectionScoped && e.selectionState ? Object.values(_.virtualResources).filter((e) => e && (e.selection?.adapter || e.adapter || u) === u && e.parentId === _.selectedNode) : _.items).map(d).map(ci).map(m).filter(n), a = _.contextItems.map(li);
		return _.sortBy ? [
			...r.sort(ko(_.sortBy, _.sortDirection)),
			...i.sort(ko(_.sortBy, _.sortDirection)),
			...a
		] : [
			...r,
			...i,
			...a
		];
	}), y = M(() => {
		let t = e.selectionTarget || "both";
		return v.value.filter((e) => fi(e, t));
	}), b = M(() => {
		let t = e.selectionTarget || "both";
		return v.value.filter((e) => pi(e, t));
	}), x = M(() => l ? _.selectedIds.map((e) => v.value.find((t) => L(t) === e) || _.selectedResources[e]).filter(Boolean) : v.value.filter((e) => _.selectedIds.includes(L(e)))), S = M(() => v.value.find((e) => L(e) === _.focusedId) || (l ? _.selectedResources[_.focusedId] : null) || null);
	async function C(n = _.selectedNode) {
		_.loading = !0, _.error = "", l || (_.selectedIds = []), _.focusedId = null;
		try {
			let r = await t.getResources(n, {
				search: _.search,
				sortBy: _.sortBy,
				sortDirection: _.sortDirection,
				filters: _.filters
			});
			if (_.selectedNode = n, _.nodes = r.nodes, _.items = r.items, r.presentation?.selectionScoped) for (let e of r.items) {
				let t = d(e);
				_.virtualResources[L(t)] = ci(t);
			}
			if (l) for (let e of [...r.nodes, ...r.items]) {
				let t = d(e);
				_.selectedIds.includes(L(t)) && (_.selectedResources[L(t)] = m(ci(t)));
			}
			_.contextItems = r.contextItems || [], _.breadcrumb = r.breadcrumb, _.actions = e.mode === "readonly" ? [] : r.actions, _.presentation = r.presentation || _.presentation, _.sortBy && !(_.presentation.sortFields || []).some((e) => e.id === _.sortBy) && (_.sortBy = "", _.sortDirection = ""), (_.presentation.filters || []).forEach((e) => {
				_.filters[e.id] === void 0 && (_.filters[e.id] = e.default);
			}), _.currentResource = r.currentResource || null;
			let i = new URL(window.location.href);
			i.searchParams.set("node", n), window.history.replaceState({}, "", i), _.navigationRevision++;
		} catch (t) {
			if (n !== e.initialNode && [403, 404].includes(t.status)) {
				_.selectedNode = e.initialNode, await C(e.initialNode);
				return;
			}
			_.error = t.message, Joomla.renderMessages({ error: [t.message] });
		} finally {
			_.loading = !1;
		}
	}
	function T(t, n = !0) {
		if (E(t), !fi(t, e.selectionTarget || "both") || f(t)) return;
		let r = L(t);
		l && (_.selectedResources[r] = t);
		let i = _.selectedIds.includes(r);
		!i && e.multiple && n && _.selectedIds.length >= s || (!e.multiple || !n ? _.selectedIds = i ? [] : [r] : _.selectedIds = i ? _.selectedIds.filter((e) => e !== r) : [..._.selectedIds, r]);
	}
	function E(e) {
		di(e) && (_.focusedId = L(e));
	}
	function D() {
		l && b.value.forEach((e) => {
			_.selectedResources[L(e)] = e;
		});
		let t = b.value.map(L);
		if (o && !e.multiple) {
			let e = t[0];
			_.selectedIds = e && !_.selectedIds.includes(e) ? [e] : [];
			return;
		}
		let n = _.selectedIds.filter((e) => !t.includes(e)).length, r = Math.min(t.length, Math.max(0, s - n)), i = r > 0 && t.filter((e) => _.selectedIds.includes(e)).length >= r;
		_.selectedIds = i ? _.selectedIds.filter((e) => !t.includes(e)) : [.../* @__PURE__ */ new Set([..._.selectedIds, ...t])].slice(0, s);
	}
	function O() {
		l && b.value.forEach((e) => {
			_.selectedResources[L(e)] = e;
		});
		let e = b.value.map(L), t = new Set(_.selectedIds);
		e.forEach((e) => t.has(e) ? t.delete(e) : t.add(e)), _.selectedIds = [...t].slice(0, s);
	}
	w(() => [
		_.selectedNode,
		_.activeView,
		_.viewOptions,
		_.hiddenColumns,
		_.shownColumns,
		_.sortBy,
		_.sortDirection,
		_.showInfo,
		_.filters
	], () => n.save(_), { deep: !0 });
	function k(t, n) {
		if (e.multiple && _.selectedIds.length >= s || !e.selectionState || e.mode === "readonly" || e.selectionTarget === "node" || p.size && !p.has(n)) return !1;
		let r = _.selectedResources[_.selectedIds[0]]?.selection?.adapter || c?.items.find((e) => R(e.selection) === _.selectedIds[0])?.selection.adapter;
		return !(e.multiple && i?.homogeneous && r && r !== t);
	}
	function A(t) {
		return !(!e.selectionState || e.mode === "readonly" || e.selectionTarget === "node" || p.size && !p.has(t));
	}
	function ee(t, n = null) {
		let r = t.adapter || u, i = {
			adapter: r,
			id: t.id
		}, a = o ? R(i) : t.id, s = n ? L(n) : null;
		if (n && !_.selectedIds.includes(s) && !_.virtualResources[s]) throw Error("COM_SMARTBROWSER_LINK_SELECTION_FULL");
		if ((_.selectedIds.includes(a) || _.virtualResources[a]) && a !== s) throw Error("COM_SMARTBROWSER_LINK_DUPLICATE");
		if (t.uniquenessId) for (let e of /* @__PURE__ */ new Set([..._.selectedIds, ...Object.keys(_.virtualResources)])) {
			if (e === s) continue;
			let n = _.virtualResources[e] || _.selectedResources[e], i = n?.selection || (n ? {
				adapter: n.adapter || u,
				id: n.id
			} : c?.items.find((t) => R(t.selection) === e)?.selection);
			if (i?.adapter === r && (i.id === t.uniquenessId || i.id.startsWith(t.uniquenessId + "."))) throw Error("COM_SMARTBROWSER_LINK_DUPLICATE");
		}
		if (!n && !A(t.type)) throw Error("COM_SMARTBROWSER_LINK_SELECTION_FULL");
		let l = ci({
			...t,
			adapter: r,
			...o ? {
				selection: i,
				selectionKey: a
			} : {}
		});
		return _.selectedResources[a] = l, _.virtualResources[a] = l, _.selectedIds = n ? _.selectedIds.map((e) => e === s ? a : e) : k(r, t.type) ? e.multiple ? [..._.selectedIds, a] : [a] : _.selectedIds, s && s !== a && (delete _.selectedResources[s], delete _.virtualResources[s]), _.focusedId = a, l;
	}
	function j(e) {
		for (let t of e) {
			let e = L(t);
			_.virtualResources[e] && (_.selectedIds = _.selectedIds.filter((t) => t !== e), delete _.selectedResources[e], delete _.virtualResources[e], _.focusedId === e && (_.focusedId = null));
		}
	}
	return t.options && e.selectionState && (t.options.selectionItems = () => [.../* @__PURE__ */ new Set([..._.selectedIds, ...Object.keys(_.virtualResources)])].map((e) => {
		let t = _.virtualResources[e] || _.selectedResources[e];
		return t ? {
			selection: t.selection || {
				adapter: t.adapter || u,
				id: t.id
			},
			usage: {}
		} : c?.items.find((t) => R(t.selection) === e);
	}).filter(Boolean)), {
		state: _,
		resources: v,
		selectableResources: y,
		bulkSelectableResources: b,
		selection: x,
		focusedResource: S,
		load: C,
		focus: E,
		toggle: T,
		selectAll: D,
		invertSelection: O,
		canAddSelection: k,
		canCreateSelectionResource: A,
		replaceSelectionResource: ee,
		deleteVirtualResources: j
	};
}
//#endregion
//#region resources/js/core/viewRegistry.js
var jo = () => {
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
}, Mo = (e) => {
	if (!Array.isArray(e)) throw TypeError("Collection items must be an array.");
	let t = e.map((e) => e && typeof e == "object" ? e.id : e);
	if (t.some((e) => !["string", "number"].includes(typeof e) || String(e) === "")) throw TypeError("Invalid collection identifier.");
	return [...new Set(t.map(String))];
};
function No({ config: e, api: t, notify: n, translate: r }) {
	let i = e.referenceItems === !0 || !e.adapter || (e.items || []).some((e) => e?.selection || e?.adapter), s = (t) => i ? z(t, e) : Mo(t), c = (e) => i ? R(e.selection) : e, l = () => i ? JSON.parse(JSON.stringify(y)) : [...y], u = d(), f = e.viewPreferenceKey || "supjx.smartbrowser.collection.view", p;
	try {
		p = I().getItem(f);
	} catch {}
	let m = ["grid", "details"].includes(p) ? p : e.layout === "compact" ? "details" : e.layout || "grid", h = a({
		...e,
		allowedResourceTypes: [],
		roots: [],
		actions: [],
		multiple: e.multiple !== !1,
		selectionTarget: "both",
		mode: e.readOnly ? "readonly" : "manage",
		defaultView: m
	}), g = {
		load: (e) => e,
		save(e) {
			try {
				I().setItem(f, e.activeView);
			} catch {}
		}
	}, _ = u.run(() => Ao({
		options: h,
		api: t,
		persistence: g,
		viewRegistry: jo().register({
			id: "grid",
			component: {}
		}).register({
			id: "details",
			component: {}
		})
	})), { state: v } = _, y = s(e.items || []), b = 0, x = !1, S = o(0), C = !e.readOnly, w = C && e.allowRemove !== !1, T = C && e.allowOrdering !== !1, E = (t) => t.map((t) => ({
		...t,
		selectable: C && (w || T),
		bulkSelectable: C && (w || T),
		focusable: !0,
		actionable: C,
		navigable: !1,
		activatable: !1,
		interactiveOverlays: C && e.contextActions === !0,
		capabilities: {
			...t.capabilities,
			collectionRemove: w
		}
	})), D = (t) => n({
		adapter: e.adapter,
		mode: "collection",
		items: l(),
		resources: [...v.items],
		reason: t
	});
	async function O() {
		if (x) return;
		let n = ++b;
		v.loading = !0, v.error = "";
		try {
			let r = await t.collection(y, i ? {
				referenceItems: !0,
				homogeneous: e.homogeneous === !0
			} : void 0);
			if (x || n !== b) return;
			let a = new Map(i ? y.map((e) => [c(e), e.usage]) : []);
			y = i ? s(r.items).map((e) => ({
				...e,
				usage: a.get(c(e)) || e.usage
			})) : [...r.identifiers], S.value++, v.items = E(r.resources), v.actions = [...r.actions || [], ...v.items.flatMap((e) => e.collectionActions || [])].filter((e, t, n) => n.findIndex((t) => t.id === e.id) === t && e.requiresSelection && !e.currentNode && ![
				"reorder",
				"removeFromGroup",
				"batch",
				"activate",
				"select"
			].includes(e.id)), v.presentation = r.presentation || {}, h.visualSettings = r.visualSettings, h.imageBackground = r.imageBackground, v.selectedIds = v.selectedIds.filter((e) => y.some((t) => c(t) === e));
		} catch (e) {
			if (!x && n === b) throw v.error = e.message, e;
		} finally {
			!x && n === b && (v.loading = !1);
		}
	}
	async function k(e, { resolvedResources: t, reason: n } = {}) {
		if (x) throw Error("Collection is destroyed.");
		let r = s(e);
		if (t) {
			if (!C || v.busy || v.loading) throw Error("The collection cannot be changed now.");
			let e = new Map(t.map((e) => [L(e), e]));
			if (r.some((t) => !e.has(c(t)))) throw TypeError("Incomplete resolved collection.");
			++b, y = r, S.value++, v.items = E(r.map((t) => e.get(c(t)))), v.selectedIds = [], v.error = "", v.sortBy = "collectionOrder", v.sortDirection = "asc", n && D(n);
			return;
		}
		let a = i && r.length === y.length && r.every((e, t) => c(e) === c(y[t])), o = {
			items: y,
			resources: v.items,
			selectedIds: v.selectedIds,
			sortBy: v.sortBy,
			sortDirection: v.sortDirection
		};
		if (y = r, S.value++, !a || v.items.length !== y.length || v.error) {
			v.selectedIds = [], v.sortBy = "collectionOrder", v.sortDirection = "asc";
			try {
				await O();
			} catch (e) {
				throw y = o.items, v.items = o.resources, v.selectedIds = o.selectedIds, v.sortBy = o.sortBy, v.sortDirection = o.sortDirection, S.value++, e;
			}
		}
	}
	function A(e) {
		if (!w || x || v.loading || v.busy) return;
		++b;
		let t = new Set(e), n = y.filter((e) => !t.has(c(e)));
		n.length !== y.length && (y = n, S.value++, v.items = v.items.filter((e) => !t.has(L(e))), v.selectedIds = v.selectedIds.filter((e) => !t.has(e)), D("remove"));
	}
	async function ee(n, r = v.selectedIds) {
		if (!T || x || v.busy || v.loading || !r.length || !["up", "down"].includes(n) || v.sortBy && v.sortBy !== "collectionOrder") return;
		let a = ++b;
		v.busy = !0;
		try {
			let o = v.sortDirection === "desc" ? n === "up" ? "down" : "up" : n, l = await t.collection(y, {
				...i ? {
					referenceItems: !0,
					homogeneous: e.homogeneous === !0
				} : {},
				operation: "reorder",
				selection: [...r],
				direction: o
			});
			if (x || a !== b) return;
			y = s(l.items), S.value++;
			let u = new Map(v.items.map((e) => [L(e), e]));
			v.items = y.map((e) => u.get(c(e))).filter(Boolean), D("reorder");
		} catch (e) {
			!x && a === b && (v.error = e.message);
		} finally {
			x || (v.busy = !1);
		}
	}
	return {
		options: h,
		browser: _,
		resources: u.run(() => M(() => v.sortBy === "collectionOrder" ? v.sortDirection === "desc" ? [...v.items].reverse() : v.items : e.selectedResources ? v.items : _.resources.value)),
		referenceItems: i,
		canRemove: w,
		canOrder: T,
		refresh: O,
		setItems: k,
		remove: A,
		move: ee,
		revision: S,
		reorderItems(e) {
			if (!T || x || v.busy || v.loading) return;
			if (!Array.isArray(e) || e.length !== y.length || new Set(e).size !== y.length || e.some((e) => !y.some((t) => c(t) === e))) throw TypeError("Invalid collection order.");
			let t = new Map(y.map((e) => [c(e), e]));
			y = e.map((e) => t.get(e));
			let n = new Map(v.items.map((e) => [L(e), e]));
			v.items = e.map((e) => n.get(e)).filter(Boolean), S.value++, D("reorder");
		},
		setUsage(e, t) {
			if (!C || x || !i || v.loading || v.busy) return;
			let n = L(e);
			y = y.map((e) => c(e) === n ? {
				...e,
				usage: JSON.parse(JSON.stringify(t))
			} : e), S.value++, D("usage");
		},
		getItems: l,
		async addItems(e) {
			await k(s([...y, ...e])), D("add");
		},
		destroy() {
			x = !0, b++, t.destroy?.(), u.stop();
		}
	};
}
//#endregion
export { ln as C, $n as S, Lt as T, ai as _, Ha as a, Kr as b, wa as c, xi as d, bi as f, fi as g, ci as h, Oo as i, Sa as l, vi as m, jo as n, Va as o, yi as p, Ao as r, Ba as s, No as t, Bi as u, $r as v, Zt as w, Hr as x, Xr as y };
