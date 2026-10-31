import { A as e, B as t, C as n, D as r, F as i, G as a, H as o, I as s, J as c, K as l, L as u, M as d, N as f, O as p, P as m, R as h, S as g, T as _, U as v, V as y, W as b, X as x, Y as S, _ as C, b as w, d as T, f as E, g as D, h as O, j as k, k as A, m as j, n as M, p as N, q as P, t as ee, v as F, w as I, x as L, y as R, z } from "./visual-runtime-BEbhjzcM.js?v=5.0.0";
import { a as B, i as V, n as te, r as H, s as U } from "./visual-runtime-DQsy__lt.js?v=5.0.0";
import { t as ne } from "./visual-runtime-BqvJBmz9.js?v=5.0.0";
//#region resources/js/components/ResourceFancySelect.vue
var W = ["placeholder"], re = ["multiple"], G = ["selected"], K = ["value", "selected"], q = {
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
	setup(r, { emit: o }) {
		let s = r, l = o, u = a(null), f = R(() => s.options.filter((e) => String(e.value) !== "")), p = R(() => f.value.map((e) => String(e.value)).join("|")), h = (e) => s.multiple ? s.modelValue.includes(String(e)) : String(s.modelValue) === String(e), _ = (e) => l("update:modelValue", s.multiple ? Array.from(e.target.selectedOptions, (e) => e.value) : e.target.value), v, y, b, S = () => u.value?.choicesInstance?.hideDropdown(), T = () => {
			if (!v?.matches(":popover-open")) return;
			let e = u.value?.choicesInstance?.containerOuter?.element;
			if (!e) return;
			let t = e.getBoundingClientRect();
			if (t.bottom < 0 || t.top > window.innerHeight) {
				u.value.choicesInstance.hideDropdown();
				return;
			}
			let n = window.innerHeight - t.bottom - 8, r = t.top - 8, i = n < 240 && r > n, a = Math.max(0, i ? r : n);
			v.style.left = `${t.left}px`, v.style.top = `${i ? t.top : t.bottom}px`, v.style.width = `${t.width}px`, v.style.maxHeight = `${a}px`, v.style.transform = i ? "translateY(-100%)" : "", v.style.setProperty("--resource-batch-dropdown-list-height", `${Math.max(0, a - 2)}px`);
		}, E = () => {
			v && (v.classList.contains("is-active") && u.value?.closest("dialog")?.open ? (v.matches(":popover-open") || v.showPopover(), T()) : v.matches(":popover-open") && v.hidePopover());
		};
		return d(async () => {
			await e(), v = u.value?.choicesInstance?.dropdown?.element, v && (b = u.value.closest("dialog"), v.setAttribute("popover", "manual"), v.classList.add("resource-batch-choices-dropdown"), y = new MutationObserver(E), y.observe(v, {
				attributes: !0,
				attributeFilter: ["class"]
			}), window.addEventListener("scroll", T, !0), window.addEventListener("resize", T), b?.addEventListener("close", S));
		}), k(() => {
			y?.disconnect(), v?.matches(":popover-open") && v.hidePopover(), window.removeEventListener("scroll", T, !0), window.removeEventListener("resize", T), b?.removeEventListener("close", S);
		}), t(() => s.modelValue, async (t) => {
			await e();
			let n = u.value?.choicesInstance;
			if (!n) return;
			let r = s.multiple ? t : t ? [t] : [], i = n.getValue(!0), a = Array.isArray(i) ? i : i ? [i] : [];
			a.filter((e) => !r.includes(String(e))).forEach((e) => n.removeActiveItemsByValue(String(e))), r.filter((e) => !a.includes(String(e))).forEach((e) => n.setChoiceByValue(String(e)));
		}), (e, t) => (m(), n("joomla-field-fancy-select", {
			ref_key: "field",
			ref: u,
			key: p.value,
			class: c({ "resource-batch-single-select": !r.multiple }),
			placeholder: r.t(r.placeholder)
		}, [w("select", {
			class: "form-select",
			multiple: r.multiple,
			onChange: _
		}, [r.multiple ? g("", !0) : (m(), n("option", {
			key: 0,
			value: "",
			selected: !r.modelValue
		}, x(r.t(r.placeholder)), 9, G)), (m(!0), n(C, null, i(f.value, (e) => (m(), n("option", {
			key: e.value,
			value: String(e.value),
			selected: h(e.value)
		}, x(r.t(e.label)), 9, K))), 128))], 40, re)], 10, W));
	}
}, J = { class: "resource-batch-field" }, Y = ["aria-label"], X = ["aria-pressed", "onClick"], Z = {
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
		return (r, a) => (m(), n("div", J, [w("span", null, x(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), w("div", {
			class: "btn-group resource-batch-mode-toggle",
			role: "group",
			"aria-label": e.t("COM_SMARTBROWSER_BATCH_MODE")
		}, [(m(), n(C, null, i(t, (t) => w("button", {
			key: t.value,
			type: "button",
			class: c(["btn", e.modelValue === t.value ? "is-active" : ""]),
			"aria-pressed": e.modelValue === t.value,
			onClick: (e) => r.$emit("update:modelValue", t.value)
		}, x(e.t(t.label)), 11, X)), 64))], 8, Y)]));
	}
}, ie = ["aria-label"], ae = { class: "resource-batch-body" }, oe = {
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
	setup(e, { expose: t, emit: s }) {
		let l = e, u = s, f = r("resourceApi"), p = a(!1), h = a([]), v = a(!1), y = a(""), S = 0, O = a(null), k = a(null), A = a(null), j = R(() => l.adapter.replace(/^flat-/, "")), M = R(() => j.value === "media"), ee = R(() => ["articles", "articles-by-tag"].includes(j.value)), F = R(() => j.value === "categories"), z = R(() => j.value === "tags"), B = R(() => j.value === "menus"), V = R(() => j.value === "users"), te = R(() => ({
			articles: "article:",
			"articles-by-tag": "article:",
			categories: "category:",
			tags: "tag:",
			menus: "menu-item:",
			users: "user:"
		})[j.value]), H = R(() => !l.collectionOnly && te.value ? l.selection.filter((e) => e.id.startsWith(te.value)) : l.selection), U = {
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
		}, ne = {
			changeLanguage: !1,
			language: "",
			changeAccess: !1,
			access: "",
			tagsOpen: !1,
			tagAdd: [],
			tagRemove: [],
			placement: "none",
			category: ""
		}, W = {
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
		}, re = {
			groupOpen: !1,
			groupAction: "add",
			group: "",
			resetOpen: !1,
			reset: "yes"
		}, G = b({ ...U }), K = b({ ...ne }), J = b({ ...W }), Y = b({ ...re }), X = b({
			enabled: !1,
			field: "title",
			direction: "asc"
		}), Lt = R(() => H.value.length === 1 && H.value[0].capabilities?.extract === !0), Rt = [{
			id: "language",
			enabled: "changeLanguage",
			label: "COM_SMARTBROWSER_BATCH_SET_LANGUAGE",
			placeholder: "COM_SMARTBROWSER_SELECT_LANGUAGE"
		}, {
			id: "access",
			enabled: "changeAccess",
			label: "COM_SMARTBROWSER_BATCH_SET_ACCESS",
			placeholder: "COM_SMARTBROWSER_SELECT_ACCESS"
		}], zt = Rt, Bt = R(() => X.enabled || JSON.stringify(G) !== JSON.stringify(U) || JSON.stringify(K) !== JSON.stringify(ne) || JSON.stringify(J) !== JSON.stringify(W) || JSON.stringify(Y) !== JSON.stringify(re)), Vt = (e) => (l.batchOptions[e] || l.filters.find((t) => t.id === e)?.options || []).filter((e) => String(e.value) !== ""), Ht = R(() => (l.batchOptions.menu || []).flatMap((e) => [{
			value: `${e.value}.0`,
			label: e.label
		}, ...(l.batchOptions.menuParent || []).filter((t) => t.menu === e.value).map((t) => ({
			value: `${e.value}.${t.value}`,
			label: `- ${t.label}`
		}))])), Ut = R(() => G.zipName.trim().replace(/\.zip$/i, "")), Wt = (e) => {
			K.tagAdd = e, K.tagRemove = K.tagRemove.filter((t) => !e.includes(t));
		}, Gt = (e) => {
			K.tagRemove = e, K.tagAdd = K.tagAdd.filter((t) => !e.includes(t));
		}, Kt = (e) => {
			J.tagAdd = e, J.tagRemove = J.tagRemove.filter((t) => !e.includes(t));
		}, qt = (e) => {
			J.tagRemove = e, J.tagAdd = J.tagAdd.filter((t) => !e.includes(t));
		}, Jt = (e, t) => l.t(Vt(e).find((e) => String(e.value) === String(t))?.label || t), Yt = R(() => {
			let e = [];
			if (X.enabled && l.orderingAvailable && e.push({
				id: "sort",
				title: l.t("COM_SMARTBROWSER_BATCH_SORT"),
				parameters: [l.t(l.sortFields.find((e) => e.id === X.field)?.label || X.field), l.t(X.direction === "asc" ? "COM_SMARTBROWSER_ASCENDING" : "COM_SMARTBROWSER_DESCENDING")]
			}), M.value) G.placement !== "none" && e.push({
				id: "placement",
				title: l.t(G.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
				parameters: [h.value.find((e) => e.value === G.destination)?.path || "..."]
			}), G.rename && e.push({
				id: "rename",
				title: l.t("COM_SMARTBROWSER_BATCH_RENAME"),
				parameters: [
					...G.find ? [`${l.t("COM_SMARTBROWSER_BATCH_FIND")}: ${G.find} → ${G.replace}`] : [],
					...G.prefix ? [`${l.t("COM_SMARTBROWSER_BATCH_PREFIX")}: ${G.prefix}`] : [],
					...G.suffix ? [`${l.t("COM_SMARTBROWSER_BATCH_SUFFIX")}: ${G.suffix}`] : [],
					...G.number ? [`${l.t("COM_SMARTBROWSER_BATCH_NUMBER")}: ${G.startAt}`] : []
				],
				preview: !0
			}), G.zip && e.push({
				id: "zip",
				title: l.t("COM_SMARTBROWSER_BATCH_ZIP"),
				parameters: [`${Ut.value}.zip`]
			}), G.extract && Lt.value && e.push({
				id: "extract",
				title: l.t("COM_SMARTBROWSER_BATCH_EXTRACT"),
				parameters: G.deleteArchive ? [l.t("COM_SMARTBROWSER_BATCH_EXTRACT_DELETE")] : []
			});
			else if (ee.value) {
				for (let t of Rt) K[t.enabled] && K[t.id] && e.push({
					id: t.id,
					title: l.t(t.label),
					parameters: [Jt(t.id, K[t.id])]
				});
				K.tagsOpen && K.tagAdd.length && e.push({
					id: "tag-add",
					title: l.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: K.tagAdd.map((e) => Jt("tag", e))
				}), K.tagsOpen && K.tagRemove.length && e.push({
					id: "tag-remove",
					title: l.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: K.tagRemove.map((e) => Jt("tag", e))
				}), K.placement !== "none" && e.unshift({
					id: "placement",
					title: l.t(K.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [K.category ? Jt("category", K.category) : "..."]
				});
			} else if (F.value || z.value || B.value) {
				for (let t of zt) J[t.enabled] && J[t.id] && e.push({
					id: t.id,
					title: l.t(t.label),
					parameters: [Jt(t.id, J[t.id])]
				});
				F.value && (J.tagsOpen && J.tagAdd.length && e.push({
					id: "tag-add",
					title: l.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: J.tagAdd.map((e) => Jt("tag", e))
				}), J.tagsOpen && J.tagRemove.length && e.push({
					id: "tag-remove",
					title: l.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: J.tagRemove.map((e) => Jt("tag", e))
				}), J.placement !== "none" && e.unshift({
					id: "placement",
					title: l.t(J.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [J.category ? Jt("category", J.category) : "..."]
				}), J.flipOrdering && e.push({
					id: "flip",
					title: l.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING"),
					parameters: []
				})), B.value && J.placement !== "none" && e.unshift({
					id: "placement",
					title: l.t(J.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [Ht.value.find((e) => e.value === J.menuDestination)?.label || "..."]
				});
			} else V.value && (Y.groupOpen && Y.group && e.push({
				id: "group",
				title: l.t({
					add: "COM_SMARTBROWSER_BATCH_GROUP_ADD",
					remove: "COM_SMARTBROWSER_BATCH_GROUP_REMOVE",
					set: "COM_SMARTBROWSER_BATCH_GROUP_SET"
				}[Y.groupAction]),
				parameters: [Jt("group", Y.group)]
			}), Y.resetOpen && e.push({
				id: "reset",
				title: l.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET"),
				parameters: [l.t(Y.reset === "yes" ? "JYES" : "JNO")]
			}));
			return e;
		}), Xt = R(() => !(!H.value.length || !Yt.value.length || G.extract && (!Lt.value || G.rename || G.zip || G.placement !== "none") || M.value && G.placement !== "none" && !h.value.some((e) => e.value === G.destination) || ee.value && K.placement !== "none" && !K.category || F.value && J.placement !== "none" && !J.category || B.value && J.placement !== "none" && !Ht.value.some((e) => e.value === J.menuDestination) || M.value && G.zip && !Ut.value)), Zt = () => {
			if (l.collectionOnly) return {};
			if (M.value) return {
				...G,
				zipName: Ut.value
			};
			if (ee.value) return {
				language: K.changeLanguage ? K.language : "",
				access: K.changeAccess ? K.access : "",
				tagAdd: K.tagsOpen ? K.tagAdd : [],
				tagRemove: K.tagsOpen ? K.tagRemove : [],
				placement: K.placement,
				category: K.category
			};
			if (V.value) return {
				group: Y.groupOpen ? Y.group : "",
				groupAction: Y.groupAction === "remove" ? "del" : Y.groupAction,
				reset: Y.resetOpen ? Y.reset : ""
			};
			let e = J.menuDestination.lastIndexOf(".");
			return {
				language: J.changeLanguage ? J.language : "",
				access: J.changeAccess ? J.access : "",
				tagAdd: F.value && J.tagsOpen ? J.tagAdd : [],
				tagRemove: F.value && J.tagsOpen ? J.tagRemove : [],
				placement: J.placement,
				category: J.category,
				flipOrdering: F.value && J.flipOrdering,
				menu: B.value && e >= 0 ? J.menuDestination.slice(0, e) : "",
				menuParent: B.value && e >= 0 ? J.menuDestination.slice(e + 1) : "0"
			};
		}, Qt = async () => {
			if (!p.value && Xt.value) {
				p.value = !0;
				try {
					await new Promise((e, t) => u("apply", {
						selection: H.value.map((e) => e.id),
						payload: {
							...Zt(),
							...X.enabled && l.orderingAvailable ? { sort: {
								field: X.field,
								direction: X.direction
							} } : {}
						},
						resolve: e,
						reject: t
					})), cn();
				} catch (e) {
					window.Joomla?.renderMessages?.({ error: [e.message || String(e)] });
				} finally {
					p.value = !1;
				}
			}
		}, $t = (e, t) => {
			if (!G.rename) return e.title;
			let n = e.kind === "item" ? e.title.lastIndexOf(".") : -1, r = n > 0 ? e.title.slice(0, n) : e.title, i = n > 0 ? e.title.slice(n) : "", a = G.find ? r.split(G.find).join(G.replace) : r, o = G.number ? `-${String(Math.max(1, Number(G.startAt) || 1) + t).padStart(2, "0")}` : "";
			return `${G.prefix}${a}${G.suffix}${o}${i}`;
		}, en = R(() => H.value.map((e, t) => {
			let n = e.id.includes(":") ? e.id.slice(e.id.indexOf(":") + 1) : e.title, r = G.placement !== "none" && G.destination ? `${G.destination.slice(G.destination.indexOf(":") + 1).replace(/\/$/, "")}/` : n.slice(0, n.lastIndexOf("/") + 1);
			return {
				id: e.id,
				before: n,
				after: r + $t(e, t)
			};
		})), tn = async () => {
			let e = ++S;
			v.value = !0, y.value = "";
			try {
				let t = await f.execute("batchFolders", H.value.map((e) => e.id));
				e === S && (h.value = t);
			} catch (t) {
				e === S && (y.value = t.message || String(t));
			} finally {
				e === S && (v.value = !1);
			}
		}, nn = () => {
			Object.assign(G, U), Object.assign(K, ne), Object.assign(J, W), Object.assign(Y, re), Object.assign(X, {
				enabled: l.collectionOnly,
				field: l.sortFields[0]?.id || "title",
				direction: "asc"
			}), h.value = [], O.value?.showModal(), M.value && !l.collectionOnly && tn();
		}, rn = () => k.value?.showModal(), an = () => {
			k.value?.open && k.value.close();
		}, on = () => A.value?.showModal(), sn = () => {
			A.value?.open && A.value.close();
		}, cn = () => {
			S++, an(), sn(), O.value?.close();
		};
		return t({
			open: nn,
			close: cn
		}), d(() => {
			window.SmartBrowserDialogDismiss.install(O.value, () => Bt.value), window.SmartBrowserDialogDismiss.install(k.value), window.SmartBrowserDialogDismiss.install(A.value), O.value.addEventListener("close", () => {
				an(), sn();
			});
		}), (t, r) => (m(), n(C, null, [
			w("dialog", {
				ref_key: "dialog",
				ref: O,
				class: "resource-batch-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_BATCH_ACTIONS")
			}, [w("div", ae, [
				w("div", oe, x(e.t("COM_SMARTBROWSER_BATCH_SELECT_ACTIONS")), 1),
				e.orderingAvailable && (e.collectionOnly || H.value.every((e) => e.capabilities?.reorder)) ? (m(), n("details", {
					key: 0,
					class: "resource-batch-step",
					open: X.enabled
				}, [w("summary", { onClick: r[0] ||= D((e) => X.enabled = !X.enabled, ["prevent"]) }, x(e.t("COM_SMARTBROWSER_BATCH_SORT")), 1), w("div", ce, [o(w("select", {
					"onUpdate:modelValue": r[1] ||= (e) => X.field = e,
					class: "form-select",
					"aria-label": e.t("COM_SMARTBROWSER_BATCH_SORT")
				}, [(m(!0), n(C, null, i(e.sortFields, (t) => (m(), n("option", {
					key: t.id,
					value: t.id
				}, x(e.t(t.label)), 9, ue))), 128))], 8, le), [[E, X.field]]), o(w("select", {
					"onUpdate:modelValue": r[2] ||= (e) => X.direction = e,
					class: "form-select",
					"aria-label": e.t("COM_SMARTBROWSER_SORT_DIRECTION")
				}, [w("option", fe, x(e.t("COM_SMARTBROWSER_ASCENDING")), 1), w("option", pe, x(e.t("COM_SMARTBROWSER_DESCENDING")), 1)], 8, de), [[E, X.direction]])])], 8, se)) : g("", !0),
				M.value && !e.collectionOnly ? (m(), n(C, { key: 1 }, [
					w("details", {
						class: "resource-batch-step",
						open: G.placement !== "none"
					}, [w("summary", { onClick: r[3] ||= D((e) => G.placement = G.placement === "none" ? "move" : "none", ["prevent"]) }, x(e.t("COM_SMARTBROWSER_BATCH_PLACEMENT")), 1), w("div", he, [_(Z, {
						modelValue: G.placement,
						"onUpdate:modelValue": r[4] ||= (e) => G.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), w("div", ge, [w("span", null, x(e.t("COM_SMARTBROWSER_BATCH_DESTINATION_FOLDER")), 1), v.value ? (m(), n("span", {
						key: 0,
						class: "spinner-border spinner-border-sm",
						role: "status",
						"aria-label": e.t("COM_SMARTBROWSER_LOADING_FOLDERS")
					}, null, 8, _e)) : y.value ? (m(), n("span", ve, x(y.value), 1)) : (m(), L(q, {
						key: 2,
						modelValue: G.destination,
						"onUpdate:modelValue": r[5] ||= (e) => G.destination = e,
						options: h.value,
						placeholder: "COM_SMARTBROWSER_SELECT_FOLDER",
						t: e.t,
						"aria-label": e.t("COM_SMARTBROWSER_BATCH_DESTINATION_FOLDER")
					}, null, 8, [
						"modelValue",
						"options",
						"t",
						"aria-label"
					]))])])], 8, me),
					w("details", {
						class: "resource-batch-step",
						open: G.rename
					}, [w("summary", { onClick: r[6] ||= D((e) => G.rename = !G.rename, ["prevent"]) }, x(e.t("COM_SMARTBROWSER_BATCH_RENAME")), 1), w("div", be, [
						w("label", null, [I(x(e.t("COM_SMARTBROWSER_BATCH_FIND")), 1), o(w("input", {
							"onUpdate:modelValue": r[7] ||= (e) => G.find = e,
							type: "text",
							class: "form-control"
						}, null, 512), [[N, G.find]])]),
						w("label", null, [I(x(e.t("COM_SMARTBROWSER_BATCH_REPLACE")), 1), o(w("input", {
							"onUpdate:modelValue": r[8] ||= (e) => G.replace = e,
							type: "text",
							class: "form-control",
							disabled: !G.find
						}, null, 8, xe), [[N, G.replace]])]),
						w("label", null, [I(x(e.t("COM_SMARTBROWSER_BATCH_PREFIX")), 1), o(w("input", {
							"onUpdate:modelValue": r[9] ||= (e) => G.prefix = e,
							type: "text",
							class: "form-control"
						}, null, 512), [[N, G.prefix]])]),
						w("label", null, [I(x(e.t("COM_SMARTBROWSER_BATCH_SUFFIX")), 1), o(w("input", {
							"onUpdate:modelValue": r[10] ||= (e) => G.suffix = e,
							type: "text",
							class: "form-control"
						}, null, 512), [[N, G.suffix]])]),
						w("label", Se, [o(w("input", {
							"onUpdate:modelValue": r[11] ||= (e) => G.number = e,
							type: "checkbox",
							class: "form-check-input"
						}, null, 512), [[T, G.number]]), I(" " + x(e.t("COM_SMARTBROWSER_BATCH_NUMBER")), 1)]),
						G.number ? (m(), n("label", Ce, [I(x(e.t("COM_SMARTBROWSER_BATCH_START_AT")), 1), o(w("input", {
							"onUpdate:modelValue": r[12] ||= (e) => G.startAt = e,
							type: "number",
							min: "1",
							class: "form-control"
						}, null, 512), [[
							N,
							G.startAt,
							void 0,
							{ number: !0 }
						]])])) : g("", !0)
					])], 8, ye),
					w("details", {
						class: "resource-batch-step",
						open: G.zip
					}, [w("summary", { onClick: r[13] ||= D((e) => G.zip = !G.zip, ["prevent"]) }, x(e.t("COM_SMARTBROWSER_BATCH_ZIP")), 1), w("div", Te, [w("label", null, [I(x(e.t("COM_SMARTBROWSER_BATCH_ZIP_NAME")), 1), w("span", Ee, [o(w("input", {
						"onUpdate:modelValue": r[14] ||= (e) => G.zipName = e,
						type: "text",
						class: "form-control",
						onBlur: r[15] ||= (e) => G.zipName = Ut.value
					}, null, 544), [[N, G.zipName]]), r[35] ||= w("span", { class: "input-group-text" }, ".zip", -1)])])])], 8, we),
					Lt.value ? (m(), n("details", {
						key: 0,
						class: "resource-batch-step",
						open: G.extract
					}, [w("summary", { onClick: r[16] ||= D((e) => G.extract = !G.extract, ["prevent"]) }, x(e.t("COM_SMARTBROWSER_BATCH_EXTRACT")), 1), w("div", Oe, [w("label", ke, [o(w("input", {
						"onUpdate:modelValue": r[17] ||= (e) => G.deleteArchive = e,
						type: "checkbox",
						class: "form-check-input",
						disabled: !H.value.every((e) => e.capabilities?.delete)
					}, null, 8, Ae), [[T, G.deleteArchive]]), I(" " + x(e.t("COM_SMARTBROWSER_BATCH_EXTRACT_DELETE")), 1)])])], 8, De)) : g("", !0)
				], 64)) : ee.value && !e.collectionOnly ? (m(), n(C, { key: 2 }, [
					(m(), n(C, null, i(Rt, (t) => w("details", {
						key: t.id,
						class: "resource-batch-step",
						open: K[t.enabled]
					}, [w("summary", { onClick: D((e) => K[t.enabled] = !K[t.enabled], ["prevent"]) }, x(e.t(t.label)), 9, Me), w("div", Ne, [o(w("select", {
						"onUpdate:modelValue": (e) => K[t.id] = e,
						class: "form-select",
						"aria-label": e.t(t.label)
					}, [w("option", Fe, x(e.t(t.placeholder)), 1), (m(!0), n(C, null, i(Vt(t.id), (t) => (m(), n("option", {
						key: t.value,
						value: t.value
					}, x(e.t(t.label)), 9, Ie))), 128))], 8, Pe), [[E, K[t.id]]])])], 8, je)), 64)),
					w("details", {
						class: "resource-batch-step",
						open: K.tagsOpen
					}, [w("summary", { onClick: r[18] ||= D((e) => K.tagsOpen = !K.tagsOpen, ["prevent"]) }, x(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), K.tagsOpen ? (m(), n("div", Re, [w("div", ze, [w("span", null, x(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), _(q, {
						"model-value": K.tagAdd,
						options: Vt("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": Wt
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])]), w("div", Be, [w("span", null, x(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), _(q, {
						"model-value": K.tagRemove,
						options: Vt("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": Gt
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])])])) : g("", !0)], 8, Le),
					w("details", {
						class: "resource-batch-step",
						open: K.placement !== "none"
					}, [w("summary", { onClick: r[19] ||= D((e) => K.placement = K.placement === "none" ? "move" : "none", ["prevent"]) }, x(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), K.placement === "none" ? g("", !0) : (m(), n("div", He, [_(Z, {
						modelValue: K.placement,
						"onUpdate:modelValue": r[20] ||= (e) => K.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), w("div", Ue, [w("span", null, x(e.t("COM_SMARTBROWSER_CATEGORY")), 1), _(q, {
						modelValue: K.category,
						"onUpdate:modelValue": r[21] ||= (e) => K.category = e,
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
				], 64)) : !e.collectionOnly && (F.value || z.value || B.value) ? (m(), n(C, { key: 3 }, [
					(m(!0), n(C, null, i(P(zt), (t) => (m(), n("details", {
						key: t.id,
						class: "resource-batch-step",
						open: J[t.enabled]
					}, [w("summary", { onClick: D((e) => J[t.enabled] = !J[t.enabled], ["prevent"]) }, x(e.t(t.label)), 9, Ge), J[t.enabled] ? (m(), n("div", Ke, [o(w("select", {
						"onUpdate:modelValue": (e) => J[t.id] = e,
						class: "form-select",
						"aria-label": e.t(t.label)
					}, [w("option", Je, x(e.t(t.placeholder)), 1), (m(!0), n(C, null, i(Vt(t.id), (t) => (m(), n("option", {
						key: t.value,
						value: t.value
					}, x(e.t(t.label)), 9, Ye))), 128))], 8, qe), [[E, J[t.id]]])])) : g("", !0)], 8, We))), 128)),
					F.value ? (m(), n("details", {
						key: 0,
						class: "resource-batch-step",
						open: J.tagsOpen
					}, [w("summary", { onClick: r[22] ||= D((e) => J.tagsOpen = !J.tagsOpen, ["prevent"]) }, x(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), J.tagsOpen ? (m(), n("div", Ze, [w("div", Qe, [w("span", null, x(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), _(q, {
						"model-value": J.tagAdd,
						options: Vt("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": Kt
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])]), w("div", $e, [w("span", null, x(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), _(q, {
						"model-value": J.tagRemove,
						options: Vt("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": qt
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])])])) : g("", !0)], 8, Xe)) : g("", !0),
					F.value ? (m(), n("details", {
						key: 1,
						class: "resource-batch-step",
						open: J.placement !== "none"
					}, [w("summary", { onClick: r[23] ||= D((e) => J.placement = J.placement === "none" ? "move" : "none", ["prevent"]) }, x(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), J.placement === "none" ? g("", !0) : (m(), n("div", tt, [_(Z, {
						modelValue: J.placement,
						"onUpdate:modelValue": r[24] ||= (e) => J.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), w("div", nt, [w("span", null, x(e.t("COM_SMARTBROWSER_BATCH_PARENT_CATEGORY")), 1), _(q, {
						modelValue: J.category,
						"onUpdate:modelValue": r[25] ||= (e) => J.category = e,
						options: Vt("category"),
						placeholder: "COM_SMARTBROWSER_SELECT_CATEGORY",
						t: e.t,
						"aria-label": e.t("COM_SMARTBROWSER_BATCH_PARENT_CATEGORY")
					}, null, 8, [
						"modelValue",
						"options",
						"t",
						"aria-label"
					])])]))], 8, et)) : g("", !0),
					F.value ? (m(), n("details", {
						key: 2,
						class: "resource-batch-step",
						open: J.flipOrdering
					}, [w("summary", { onClick: r[26] ||= D((e) => J.flipOrdering = !J.flipOrdering, ["prevent"]) }, x(e.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING")), 1)], 8, rt)) : g("", !0),
					B.value ? (m(), n("details", {
						key: 3,
						class: "resource-batch-step",
						open: J.placement !== "none"
					}, [w("summary", { onClick: r[27] ||= D((e) => J.placement = J.placement === "none" ? "move" : "none", ["prevent"]) }, x(e.t("COM_SMARTBROWSER_BATCH_MENU_PLACEMENT")), 1), J.placement === "none" ? g("", !0) : (m(), n("div", at, [_(Z, {
						modelValue: J.placement,
						"onUpdate:modelValue": r[28] ||= (e) => J.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), w("div", ot, [w("span", null, x(e.t("COM_SMARTBROWSER_BATCH_MENU_DESTINATION")), 1), _(q, {
						modelValue: J.menuDestination,
						"onUpdate:modelValue": r[29] ||= (e) => J.menuDestination = e,
						options: Ht.value,
						placeholder: "COM_SMARTBROWSER_SELECT_MENU",
						t: e.t,
						"aria-label": e.t("COM_SMARTBROWSER_BATCH_MENU_DESTINATION")
					}, null, 8, [
						"modelValue",
						"options",
						"t",
						"aria-label"
					])])]))], 8, it)) : g("", !0)
				], 64)) : V.value && !e.collectionOnly ? (m(), n(C, { key: 4 }, [w("details", {
					class: "resource-batch-step",
					open: Y.groupOpen
				}, [w("summary", { onClick: r[30] ||= D((e) => Y.groupOpen = !Y.groupOpen, ["prevent"]) }, x(e.t("COM_SMARTBROWSER_BATCH_USER_GROUPS")), 1), Y.groupOpen ? (m(), n("div", ct, [w("label", null, [I(x(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), o(w("select", {
					"onUpdate:modelValue": r[31] ||= (e) => Y.groupAction = e,
					class: "form-select resource-batch-mode-select"
				}, [
					w("option", lt, x(e.t("COM_SMARTBROWSER_BATCH_GROUP_ADD")), 1),
					w("option", ut, x(e.t("COM_SMARTBROWSER_BATCH_GROUP_REMOVE")), 1),
					w("option", dt, x(e.t("COM_SMARTBROWSER_BATCH_GROUP_SET")), 1)
				], 512), [[E, Y.groupAction]])]), w("div", ft, [w("span", null, x(e.t("COM_SMARTBROWSER_USER_GROUP")), 1), _(q, {
					modelValue: Y.group,
					"onUpdate:modelValue": r[32] ||= (e) => Y.group = e,
					options: Vt("group"),
					placeholder: "COM_SMARTBROWSER_SELECT_USER_GROUP",
					t: e.t,
					"aria-label": e.t("COM_SMARTBROWSER_USER_GROUP")
				}, null, 8, [
					"modelValue",
					"options",
					"t",
					"aria-label"
				])])])) : g("", !0)], 8, st), w("details", {
					class: "resource-batch-step",
					open: Y.resetOpen
				}, [w("summary", { onClick: r[33] ||= D((e) => Y.resetOpen = !Y.resetOpen, ["prevent"]) }, x(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), Y.resetOpen ? (m(), n("div", mt, [w("label", null, [I(x(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), o(w("select", {
					"onUpdate:modelValue": r[34] ||= (e) => Y.reset = e,
					class: "form-select"
				}, [w("option", ht, x(e.t("JYES")), 1), w("option", gt, x(e.t("JNO")), 1)], 512), [[E, Y.reset]])])])) : g("", !0)], 8, pt)], 64)) : g("", !0)
			]), w("div", Q, [w("div", $, [w("div", _t, x(e.t("COM_SMARTBROWSER_BATCH_PREVIEW")), 1), Yt.value.length ? (m(), n("div", vt, [(m(!0), n(C, null, i(Yt.value, (t, r) => (m(), n("div", {
				key: t.id,
				class: "resource-batch-sequence-item"
			}, [r ? (m(), n("span", yt)) : g("", !0), w("div", bt, [w("div", xt, x(t.title), 1), t.parameters.length || t.preview ? (m(), n("div", St, [(m(!0), n(C, null, i(t.parameters, (e) => (m(), n("span", { key: e }, x(e), 1))), 128)), t.preview ? (m(), n("button", {
				key: 0,
				type: "button",
				class: "resource-batch-preview-link",
				onClick: rn
			}, x(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")), 1)) : g("", !0)])) : g("", !0)])]))), 128))])) : (m(), n("p", Ct, x(e.t("COM_SMARTBROWSER_BATCH_NO_CHANGES")), 1))]), w("div", wt, [w("button", {
				type: "button",
				class: "resource-batch-items-link",
				onClick: on
			}, x(H.value.length) + " " + x(e.t(H.value.length === 1 ? "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_ONE" : "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_MANY")), 1), w("div", Tt, [w("button", {
				type: "button",
				class: "btn btn-primary",
				disabled: p.value || !Xt.value,
				onClick: Qt
			}, x(e.t("COM_SMARTBROWSER_BATCH_APPLY")), 9, Et), w("button", {
				type: "button",
				class: "btn btn-danger",
				onClick: cn
			}, x(e.t("COM_SMARTBROWSER_CANCEL")), 1)])])])], 8, ie),
			w("dialog", {
				ref_key: "previewDialog",
				ref: k,
				class: "resource-batch-preview-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")
			}, [w("div", Ot, [w("strong", null, x(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")) + " (" + x(en.value.length) + ")", 1), w("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: an
			}, null, 8, kt)]), w("div", At, [(m(!0), n(C, null, i(en.value, (e) => (m(), n("div", {
				key: e.id,
				class: "resource-batch-preview-row"
			}, [
				w("span", { title: e.before }, x(e.before), 9, jt),
				r[36] ||= w("span", {
					class: "fas fa-arrow-right",
					"aria-hidden": "true"
				}, null, -1),
				w("strong", { title: e.after }, x(e.after), 9, Mt)
			]))), 128))])], 8, Dt),
			w("dialog", {
				ref_key: "selectionDialog",
				ref: A,
				class: "resource-batch-preview-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_SELECTED_ITEMS")
			}, [w("div", Pt, [w("strong", null, x(e.t("COM_SMARTBROWSER_SELECTED_ITEMS")), 1), w("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: sn
			}, null, 8, Ft)]), w("ul", It, [(m(!0), n(C, null, i(H.value, (e) => (m(), n("li", { key: e.id }, [w("span", {
				class: c(e.icon || "fas fa-file"),
				"aria-hidden": "true"
			}, null, 2), w("span", null, x(e.title), 1)]))), 128))])], 8, Nt)
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
	if (n === "string" && typeof t != "string" || n === "boolean" && typeof t != "boolean" || n === "number" && (typeof t != "number" || !Number.isFinite(t)) || n === "object" && (typeof t != "object" || Array.isArray(t)) || n === "resource" && !H(t)) return "COM_SMARTBROWSER_USAGE_INVALID";
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
		let n = B(e);
		i.has(n) || i.set(n, e.unavailable ? nn(t[n] || {}) : Zt(nn(t[n] || {})));
		let r = i.get(n);
		for (let i of a(e)) tn(r, i.key) || (r[i.key] = nn(tn(t[n] || {}, i.key) ? t[n][i.key] : i.default ?? null));
		for (let t of a(e)) on(t, r) && (r[t.key] = nn(t.inactiveValue ?? null));
		return nn(r);
	}
	function s(e, t, n) {
		(Xt(t) || a(e).some((e) => e.key === t)) && (Xt(t) && (n = $t(n)), o(e), i.get(B(e))[t] = nn(n), o(e));
	}
	async function c(e) {
		let t = {}, i = {}, s = {};
		for (let c of e) {
			let e = B(c), l = o(c), u = Zt(l);
			for (let o of a(c)) {
				let a = l[o.key], s = cn(on(o, l) ? {
					...o,
					required: !1
				} : o, a);
				if (!s && o.type === "resource" && !rn(a)) {
					let e = H(a), t = o.picker || {};
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
				s && (t[e] ||= {}, t[e][o.key] = s, o.presentation === "hidden" && (i[e] ||= {}, i[e][o.key] = s)), u[o.key] = o.type === "resource" && !rn(a) ? H(a) : a;
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
			i.delete(B(e));
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
		let r = e, i = a(null), o = r.context?.overlayRegistry || window.SmartBrowserPicker, s = a(o?.extensions?.().visualOverlays || o?.visualOverlays || []), c = o?.subscribeVisualOverlays?.((e) => {
			s.value = e;
		}), l = un({ createLayer(e, t) {
			let n = e.ownerDocument.createElement("div");
			return n.className = "resource-visual-overlay", n.dataset.overlayId = t.id, e.append(n), n;
		} });
		return t(() => [
			i.value,
			s.value,
			r.context
		], () => {
			l.sync(i.value, s.value, r.context, B(r.context?.resource));
		}, {
			deep: !0,
			flush: "post",
			immediate: !0
		}), k(() => {
			c?.(), l.destroy();
		}), (e, t) => (m(), n("div", {
			ref_key: "layer",
			ref: i,
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
	setup(e, { emit: r }) {
		let i = e, c = r, l = a(null), u = a(!1);
		t(u, (e) => c("active-change", e), { flush: "sync" });
		let d = i.context?.overlayRegistry || window.SmartBrowserPicker, f = a(d?.extensions?.().previewRenderers || d?.previewRenderers || []), p = d?.subscribePreviewRenderers?.((e) => {
			f.value = e;
		}), h = fn({ createLayer(e, t) {
			let n = e.ownerDocument.createElement("div");
			return n.className = "resource-preview-renderer", n.dataset.rendererId = t.id, e.append(n), n;
		} });
		return t(() => [
			l.value,
			f.value,
			i.context
		], () => {
			c("before-update"), u.value = h.sync(l.value, f.value, i.context, B(i.context?.resource));
		}, {
			deep: !0,
			flush: "post",
			immediate: !0
		}), k(() => {
			p?.(), h.destroy();
		}), (e, t) => (m(), n(C, null, [u.value ? g("", !0) : s(e.$slots, "default", {}, void 0, void 0, 0), o(w("div", {
			ref_key: "surface",
			ref: l,
			class: "resource-preview-renderer-layer"
		}, null, 512), [[j, u.value]])], 64));
	}
}, mn = {
	__name: "ResourceImagePresentation",
	props: {
		imageElement: Object,
		context: Object
	},
	emits: ["providers-change"],
	setup(e, { expose: n, emit: r }) {
		let i = e, o = r, s = i.context?.overlayRegistry || window.SmartBrowserPicker, c = l(s?.extensions?.().imagePresentations || s?.imagePresentations || []), u = s?.subscribeImagePresentations?.((e) => {
			c.value = e, o("providers-change");
		}), d = M(), f = a(0), p = () => {
			f.value++;
		};
		return t(() => i.imageElement, (e, t) => {
			t?.removeEventListener("load", p), e?.addEventListener("load", p);
		}, {
			flush: "sync",
			immediate: !0
		}), n({ release: () => d.destroy() }), t(() => i.context, () => d.destroy(), {
			deep: !0,
			flush: "pre"
		}), t(() => [
			i.imageElement,
			i.context,
			c.value,
			f.value
		], () => {
			d.sync(i.imageElement, c.value, i.context);
		}, {
			deep: !0,
			flush: "post",
			immediate: !0
		}), k(() => {
			i.imageElement?.removeEventListener("load", p), u?.(), d.destroy();
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
	setup(e, { expose: r, emit: u }) {
		let d = e, f = u, p = R(() => Ht(d.definitions)), h = R(() => d.editable ? p.value.filter((e) => e.presentation !== "hidden") : []), v = R(() => p.value.find((e) => d.values?.[e.key])), b = a(""), S = a(""), T = a(!1), E = a(null), D = a(null), O = a(null), A = l(null), M = l(null), N = a(!1), P = a(null), F = a(null), I = a(0), z = null, V = R(() => N.value ? M.value : A.value), te = (e) => {
			N.value || F.value?.refreshPresentation(), z?.onPresentationChange?.(e), E.value?.dispatchEvent(new CustomEvent("smartbrowser:image-presentation-change", {
				detail: e,
				bubbles: !0
			}));
		}, U = (e, t = {}) => {
			if (e != null && (e.tagName !== "IMG" || !E.value?.contains(e))) throw TypeError("The primary image must belong to this preview.");
			P.value?.release();
			let n = { onPresentationChange: t.onPresentationChange };
			return z = n, M.value = e, I.value++, () => {
				z === n && (P.value?.release(), z = null, M.value = null);
			};
		}, ne = R(() => d.overlayContext ? {
			...d.overlayContext,
			actionsContainer: O.value,
			visualElement: E.value,
			imageElement: V.value,
			getImageElement: () => V.value,
			imageUrl: K.value,
			imageVersion: I.value,
			resolvedImage: D.value || d.resource,
			values: d.values || {},
			notifyPresentationChange: te
		} : null), W = a(0), re = R(() => (W.value, !!(v.value || d.overlayContext?.hasPreviewChanges?.())));
		async function G() {
			T.value = !0;
			try {
				if (d.overlayContext?.resetPreview) await d.overlayContext.resetPreview();
				else for (let e of h.value) f("change", e.key, null);
			} catch {
				S.value = "COM_SMARTBROWSER_USAGE_INVALID";
			} finally {
				T.value = !1;
			}
		}
		let K = R(() => d.contentOnly && d.resource?.type === "image" ? d.resource.image || d.resource.metadata?.url || Gt(d.resource) : b.value || Gt(d.resource)), q = R(() => ({
			...qt(d.resource, d.values, b.value),
			imageCrop: D.value?.imageCrop || d.resource?.imageCrop
		})), J = R(() => ({
			...d.overlayContext,
			resource: d.resource,
			visualElement: E.value,
			setImageElement: U,
			getImageElement: () => V.value,
			imageUrl: K.value,
			resolvedImage: D.value || d.resource,
			actionsContainer: O.value,
			values: d.values || {},
			visuals: Jt(q.value, d.values, K.value),
			isReadOnly: d.overlayContext?.isReadOnly !== !1,
			purpose: "preview"
		})), Y = 0, X = !1;
		t(() => [
			B(d.resource),
			v.value,
			v.value && d.values?.[v.value.key]
		], async () => {
			let e = ++Y;
			b.value = "", D.value = null, S.value = "";
			let t = v.value;
			if (t) try {
				let n = await Yt(t, d.values[t.key], d.resolveReference);
				if (e !== Y) return;
				D.value = n, b.value = Gt(n);
			} catch {
				e === Y && (S.value = "COM_SMARTBROWSER_USAGE_INVALID");
			}
		}, {
			immediate: !0,
			deep: !0
		});
		async function Z(e) {
			let t = B(d.resource);
			T.value = !0;
			try {
				let n = await window.SmartBrowserPicker.open({
					...e.picker,
					viewPreferenceKey: e.picker.viewPreferenceKey || "supjx.smartbrowser.thumbnail",
					title: d.t("COM_SMARTBROWSER_SELECT_THUMBNAIL"),
					subtitle: d.resource.title,
					confirmLabel: d.t("COM_SMARTBROWSER_USE_THUMBNAIL"),
					multiple: !1,
					initialSelection: d.values?.[e.key] ? [d.values[e.key].id] : []
				});
				n && !X && B(d.resource) === t && f("change", e.key, H({
					adapter: e.picker.adapter,
					id: n.id
				}));
			} catch {
				!X && B(d.resource) === t && (S.value = "COM_SMARTBROWSER_USAGE_INVALID");
			} finally {
				T.value = !1;
			}
		}
		return r({ element: E }), k(() => {
			X = !0, ++Y;
		}), (t, r) => (m(), n(C, null, [w("div", hn, [
			o(w("div", {
				ref_key: "surface",
				ref: E,
				class: c(["resource-lightweight-visual", {
					"has-override": !!v.value,
					"is-information-visual": !e.contentOnly,
					"is-grid-information": !e.contentOnly && e.resource?.type !== "image",
					"has-unavailable-content": e.contentOnly && e.resource?.id && !K.value
				}])
			}, [
				e.contentOnly ? e.nativePreview ? g("", !0) : (m(), L(pn, {
					key: 1,
					context: J.value,
					onActiveChange: r[1] ||= (e) => N.value = e,
					onBeforeUpdate: r[2] ||= (e) => P.value?.release()
				}, {
					default: y(() => [_(ee, {
						ref_key: "fallbackVisual",
						ref: F,
						resource: q.value,
						"presentation-managed": "",
						onImageChange: r[0] ||= (e) => A.value = e
					}, null, 8, ["resource"])]),
					_: 1
				}, 8, ["context"])) : (m(), L(ee, {
					key: 0,
					resource: e.resource,
					"fit-content": e.resource.type === "image"
				}, null, 8, ["resource", "fit-content"])),
				ne.value && !e.nativePreview ? (m(), L(dn, {
					key: 2,
					context: ne.value
				}, null, 8, ["context"])) : g("", !0),
				ne.value && e.contentOnly && !e.nativePreview ? (m(), L(mn, {
					key: 3,
					ref_key: "presentation",
					ref: P,
					"image-element": V.value,
					context: ne.value,
					onProvidersChange: r[3] ||= (e) => W.value++
				}, null, 8, ["image-element", "context"])) : g("", !0)
			], 2), [[j, !e.nativePreview]]),
			e.canPreview ? (m(), n("div", gn, [e.canPreview ? (m(), n("button", {
				key: 0,
				type: "button",
				class: "resource-lightweight-icon-action",
				title: e.t("COM_SMARTBROWSER_ACTION_PREVIEW"),
				"aria-label": e.t("COM_SMARTBROWSER_ACTION_PREVIEW"),
				onClick: r[4] ||= (e) => t.$emit("preview")
			}, [...r[5] ||= [w("span", {
				class: "fas fa-eye",
				"aria-hidden": "true"
			}, null, -1)]], 8, _n)) : g("", !0)])) : g("", !0),
			w("div", {
				ref_key: "previewActionsEl",
				ref: O,
				class: "resource-lightweight-actions resource-lightweight-preview-action"
			}, [
				e.editable && re.value ? (m(), n("button", {
					key: 0,
					type: "button",
					class: "resource-lightweight-icon-action",
					disabled: T.value,
					title: e.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					"aria-label": e.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					onClick: G
				}, [...r[6] ||= [w("span", {
					class: "fas fa-times",
					"aria-hidden": "true"
				}, null, -1)]], 8, vn)) : g("", !0),
				(m(!0), n(C, null, i(h.value, (t) => (m(), n("button", {
					key: t.key,
					type: "button",
					class: c({ selected: !!e.values?.[t.key] }),
					disabled: T.value,
					title: e.t(e.values?.[t.key] ? "COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL" : "COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL"),
					"aria-label": e.t(e.values?.[t.key] ? "COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL" : "COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL"),
					onClick: (e) => Z(t)
				}, [...r[7] ||= [w("span", {
					class: "fas fa-image",
					"aria-hidden": "true"
				}, null, -1)]], 10, yn))), 128)),
				s(t.$slots, "actions")
			], 512)
		]), S.value || p.value.some((t) => e.errors?.[t.key]) ? (m(), n("small", bn, x(e.t(S.value || e.errors[p.value.find((t) => e.errors?.[t.key]).key])), 1)) : g("", !0)], 64));
	}
}, Sn = {
	__name: "ResourceActionIcon",
	props: { icon: String },
	setup(e) {
		return (t, r) => (m(), n("span", {
			class: c(e.icon === "arrow-down-up-across-line" ? "fas fa-arrow-down-up-across-line" : e.icon),
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
	setup(r, { emit: o }) {
		let s = r, l = o, u = `sb-usage-${Math.random().toString(36).slice(2)}`, d = a(s.value ? "custom" : "auto"), f = a(""), p = a(!1), h = a(""), _ = a(s.value ?? ""), v = a(null), y = R(() => s.editors?.[s.definition.editor]), b = R(() => on(s.definition, s.values)), S, T, E = 0, D = !1, O = (e) => {
			h.value = "", l("change", e);
		}, A = (e) => {
			s.definition.key === "visual.iconOverride" ? (_.value = e, O(Vt(e))) : O(e);
		}, j = () => {
			d.value = "auto", O(null);
		}, M = (e) => {
			d.value = e, e === "auto" && O(null);
		};
		t(() => s.value, async (e) => {
			s.definition.key === "visual.iconOverride" && Vt(_.value) !== (e ?? "") && (_.value = e ?? "");
			let t = ++E;
			if (h.value = "", f.value = "", s.definition.type === "resource" && e) {
				d.value = "custom";
				try {
					let n = await s.resolveReference(e, s.definition.picker);
					t === E && (f.value = n?.title || "", (!n || n.unavailable) && (h.value = "COM_SMARTBROWSER_USAGE_INVALID"));
				} catch {
					t === E && (h.value = "COM_SMARTBROWSER_USAGE_INVALID");
				}
			}
		}, { immediate: !0 });
		async function N() {
			p.value = !0;
			try {
				let e = await window.SmartBrowserPicker.open({
					...s.definition.picker,
					multiple: !1,
					initialSelection: s.value ? [s.value.id] : []
				});
				e && !D && O(H({
					adapter: s.definition.picker.adapter,
					id: e.id
				}));
			} catch {
				h.value = "COM_SMARTBROWSER_USAGE_INVALID";
			} finally {
				p.value = !1;
			}
		}
		return t([y, () => B(s.resource)], async () => {
			if (T?.abort(), S?.destroy?.(), S = null, await e(), !D && y.value && v.value) {
				T = new AbortController();
				try {
					S = y.value.mount(v.value, {
						definition: s.definition,
						resource: s.resource,
						id: u,
						value: s.value,
						values: s.values,
						setValue: O,
						signal: T.signal,
						translate: s.t
					}) || null;
				} catch {
					h.value = "COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE";
				}
			}
		}, { immediate: !0 }), t(() => [s.value, s.values], () => S?.update?.({
			value: s.value,
			values: s.values
		}), { deep: !0 }), k(() => {
			D = !0, ++E, T?.abort(), S?.destroy?.();
		}), (e, t) => (m(), n("div", Cn, [
			r.definition.editor === "boolean" ? g("", !0) : (m(), n("label", {
				key: 0,
				for: u
			}, [
				w("span", {
					class: c(P(Bt)(r.definition)),
					"aria-hidden": "true"
				}, null, 2),
				I(x(r.t(r.definition.label)), 1),
				r.definition.required ? (m(), n("span", wn, " *")) : g("", !0)
			])),
			r.definition.editor === "text" ? (m(), n("input", {
				key: 1,
				id: u,
				class: "form-control",
				type: "text",
				value: r.definition.key === "visual.iconOverride" ? _.value : r.value ?? "",
				disabled: b.value,
				required: r.definition.required && !b.value,
				"aria-invalid": !!r.error,
				onInput: t[0] ||= (e) => A(e.target.value)
			}, null, 40, Tn)) : r.definition.editor === "textarea" ? (m(), n("textarea", {
				key: 2,
				id: u,
				class: "form-control",
				rows: "3",
				value: r.value ?? "",
				required: r.definition.required,
				"aria-invalid": !!r.error,
				onInput: t[1] ||= (e) => O(e.target.value)
			}, null, 40, En)) : r.definition.editor === "boolean" ? (m(), n("label", Dn, [
				w("input", {
					id: u,
					class: "form-check-input",
					type: "checkbox",
					checked: r.value === !0,
					onChange: t[2] ||= (e) => O(e.target.checked)
				}, null, 40, On),
				r.definition.key === "media.decorative" ? g("", !0) : (m(), n("span", {
					key: 0,
					class: c(P(Bt)(r.definition)),
					"aria-hidden": "true"
				}, null, 2)),
				I(x(r.t(r.definition.label)), 1)
			])) : r.definition.editor === "select" ? (m(), n("select", {
				key: 4,
				id: u,
				class: "form-select",
				value: r.value ?? "",
				"aria-invalid": !!r.error,
				onChange: t[3] ||= (e) => O(r.definition.options.find((t) => String(t.value) === e.target.value)?.value)
			}, [!r.definition.required && !r.definition.options?.some((e) => e.value === "") ? (m(), n("option", An, x(r.t(r.definition.key === "visual.presentation" ? "COM_SMARTBROWSER_USAGE_DEFAULT" : "COM_SMARTBROWSER_USAGE_CHOOSE")), 1)) : g("", !0), (m(!0), n(C, null, i(r.definition.options, (e) => (m(), n("option", {
				key: String(e.value),
				value: e.value
			}, x(r.t(e.label)), 9, jn))), 128))], 40, kn)) : r.definition.editor === "number" ? (m(), n("input", {
				key: 5,
				id: u,
				class: "form-control",
				type: "number",
				value: r.value ?? "",
				"aria-invalid": !!r.error,
				onInput: t[4] ||= (e) => O(e.target.value === "" ? null : Number(e.target.value))
			}, null, 40, Mn)) : r.definition.editor === "resource" ? (m(), n(C, { key: 6 }, [w("select", {
				id: u,
				class: "form-select",
				value: d.value,
				onChange: t[5] ||= (e) => M(e.target.value)
			}, [w("option", Pn, x(r.t("COM_SMARTBROWSER_USAGE_AUTO")), 1), w("option", Fn, x(r.t("COM_SMARTBROWSER_USAGE_CUSTOM")), 1)], 40, Nn), d.value === "custom" ? (m(), n("div", In, [
				r.value ? (m(), n("span", Ln, x(f.value || r.value.id), 1)) : g("", !0),
				w("button", {
					type: "button",
					class: "btn btn-outline-primary",
					disabled: p.value,
					onClick: N
				}, [t[6] ||= w("span", {
					class: "fas fa-plus",
					"aria-hidden": "true"
				}, null, -1), I(" " + x(r.t(r.definition.pickerLabel || "COM_SMARTBROWSER_USAGE_PICK_RESOURCE")), 1)], 8, Rn),
				r.value ? (m(), n("button", {
					key: 1,
					type: "button",
					class: "btn btn-outline-secondary",
					title: r.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					"aria-label": r.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					onClick: j
				}, [...t[7] ||= [w("span", {
					class: "fas fa-times",
					"aria-hidden": "true"
				}, null, -1)]], 8, zn)) : g("", !0)
			])) : g("", !0)], 64)) : y.value ? (m(), n("div", {
				key: 7,
				ref_key: "customContainer",
				ref: v
			}, null, 512)) : (m(), n("small", Bn, x(r.t("COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE")), 1)),
			r.definition.description ? (m(), n("small", Vn, x(r.t(r.definition.description)), 1)) : g("", !0),
			r.error || h.value ? (m(), n("small", Hn, x(r.t(r.error || h.value)), 1)) : g("", !0)
		]));
	}
}, Wn = { class: "resource-usage-editor" }, Gn = ["open"], Kn = {
	__name: "SelectionUsageEditor",
	props: /*@__PURE__*/ p({
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
	emits: /*@__PURE__*/ p(["change"], ["update:secondaryOpen"]),
	setup(e) {
		let t = e, r = z(e, "secondaryOpen"), a = R(() => t.definitions.filter((e) => e.presentation === "primary")), o = R(() => t.definitions.filter((e) => e.presentation === "secondary")), s = (e) => ({
			definition: e,
			value: t.values[e.key],
			values: t.values,
			error: t.errors?.[e.key],
			resource: t.resource,
			t: t.t,
			editors: t.editors,
			resolveReference: t.resolveReference
		});
		return (t, c) => (m(), n("div", Wn, [(m(!0), n(C, null, i(a.value, (e) => (m(), L(Un, A({ key: e.key }, { ref_for: !0 }, s(e), { onChange: (n) => t.$emit("change", e.key, n) }), null, 16, ["onChange"]))), 128)), o.value.length ? (m(), n("details", {
			key: 0,
			class: "resource-usage-secondary",
			open: r.value || o.value.some((t) => e.errors?.[t.key]),
			onToggle: c[0] ||= (e) => r.value = e.target.open
		}, [w("summary", null, [c[1] ||= w("span", {
			class: "fas fa-chevron-right resource-usage-secondary-chevron",
			"aria-hidden": "true"
		}, null, -1), I(x(e.t("COM_SMARTBROWSER_USAGE_MORE")), 1)]), (m(!0), n(C, null, i(o.value, (e) => (m(), L(Un, A({ key: e.key }, { ref_for: !0 }, s(e), { onChange: (n) => t.$emit("change", e.key, n) }), null, 16, ["onChange"]))), 128))], 40, Gn)) : g("", !0)]));
	}
}, qn = {
	__name: "ResourceInfoScroller",
	props: {
		disabled: Boolean,
		resourceKey: String,
		tab: String
	},
	setup(e) {
		let r = e, i = a(null), o = a(null), c = /* @__PURE__ */ new Map(), l = 0, u = 0, p = !1, h, g = () => {
			if (p || !i.value) return;
			let e = i.value, t = e.scrollHeight - e.clientHeight;
			c.set(r.tab, t > 0 ? e.scrollTop / t : 0);
		}, _ = () => {
			i.value && (p = !0, cancelAnimationFrame(l), cancelAnimationFrame(u), l = requestAnimationFrame(() => {
				let e = i.value;
				e && (e.scrollTop = (c.get(r.tab) || 0) * Math.max(0, e.scrollHeight - e.clientHeight)), u = requestAnimationFrame(() => {
					p = !1;
				});
			}));
		};
		return t(() => [r.resourceKey, r.tab], _, { flush: "post" }), f(_), d(() => {
			o.value && (h = new ResizeObserver(_), h.observe(o.value));
		}), k(() => {
			h?.disconnect(), cancelAnimationFrame(l), cancelAnimationFrame(u);
		}), (t, r) => e.disabled ? s(t.$slots, "default", {}, void 0, void 0, 0) : (m(), n("div", {
			key: 1,
			ref_key: "viewport",
			ref: i,
			class: "resource-info-scroll",
			onScroll: g
		}, [w("div", {
			ref_key: "content",
			ref: o,
			class: "resource-info-scroll-content"
		}, [s(t.$slots, "default")], 512)], 544));
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
	key: 1,
	class: "resource-selection-usage"
}, wr = { key: 0 }, Tr = {
	key: 0,
	class: "resource-language"
}, Er = ["src"], Dr = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, Or = {
	key: 2,
	class: "resource-info-timezone"
}, kr = { key: 1 }, Ar = { key: 0 }, jr = { key: 1 }, Mr = {
	key: 0,
	class: "resource-info-timezone"
}, Nr = { key: 2 }, Pr = {
	key: 0,
	class: "resource-info-timezone"
}, Fr = { key: 3 }, Ir = { key: 4 }, Lr = { key: 5 }, Rr = { key: 6 }, zr = {
	key: 4,
	class: "resource-info-empty",
	role: "status"
}, Br = ["disabled"], Vr = {
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
		let r = e, u = R(() => r.address ?? $n(r.resource)), d = a(!1), f = R(() => !!(r.usageDefinitions?.length || r.previewContext && (r.previewContext.isReadOnly === !1 || Object.values(r.usageValues || {}).some((e) => e != null && e !== "")))), p = R(() => r.selectionOnly || f.value && E.value === "usage"), h = R(() => r.resource?.unavailable ? r.t("COM_SMARTBROWSER_SELECTION_UNAVAILABLE") : p.value ? Ut(r.resource, r.usageValues).title : r.resource?.title), v = Bt;
		async function b(e) {
			try {
				await navigator.clipboard.writeText(Array.isArray(e) ? e.join("\n") : String(e));
			} catch {
				window.Joomla?.renderMessages?.({ error: [r.t("COM_SMARTBROWSER_COPY_FAILED")] });
			}
		}
		let S = (e) => {
			let t = r.usageValues?.[e.key];
			if (t == null || t === "") return "—";
			if (typeof t == "boolean") return r.t(t ? "JYES" : "JNO");
			let n = e.options?.find((e) => e.value === t);
			return n ? r.t(n.label) : e.type === "resource" ? t.id : typeof t == "object" ? JSON.stringify(t) : String(t);
		}, T = R(() => (r.usageDefinitions || []).filter((e) => !Ht([e]).length)), E = a("info"), D = a("usage"), O = (e) => {
			D.value = e, E.value = e;
		}, A = a(!1), M = a(null), N = a(null), ee = l(null), F = a(""), z;
		t(() => [N.value, r.nativePreview], () => {
			z?.disconnect();
			let e = N.value;
			if (!e || !r.nativePreview) {
				ee.value = null, F.value = "";
				return;
			}
			let t = () => {
				ee.value = [...e.querySelectorAll("img")].find((e) => !e.closest(".resource-visual-overlay-layer")) || null, F.value = ee.value?.getAttribute("src") || "";
			};
			z = new MutationObserver(t), z.observe(e, {
				subtree: !0,
				childList: !0,
				attributes: !0,
				attributeFilter: ["src"]
			}), t();
		}, {
			flush: "post",
			immediate: !0
		}), k(() => z?.disconnect());
		let V = R(() => ({
			...r.previewContext,
			visualElement: N.value,
			imageElement: ee.value,
			getImageElement: () => ee.value,
			imageUrl: F.value,
			resolvedImage: r.resource,
			values: r.usageValues || {},
			notifyPresentationChange: (e) => N.value?.dispatchEvent(new CustomEvent("smartbrowser:image-presentation-change", {
				detail: e,
				bubbles: !0
			}))
		})), te;
		t(() => B(r.resource), () => te?.abort()), k(() => te?.abort()), t(f, (e) => {
			E.value = e ? D.value : "info";
		}, { immediate: !0 }), t(() => r.usageRevision, () => {
			f.value && (E.value = "usage");
		});
		async function H(e) {
			A.value = !0, te = new AbortController();
			let t = te.signal;
			try {
				await e.run({
					...r.previewContext,
					previewElement: r.nativePreview ? N.value : M.value?.element,
					signal: t
				});
			} catch (e) {
				t.aborted || Joomla.renderMessages({ error: [e.message || r.t("COM_SMARTBROWSER_USAGE_INVALID")] });
			} finally {
				A.value = !1;
			}
		}
		let U = R(() => {
			let e = (r.resource?.infoFields?.length ? r.resource.infoFields : r.fields || []).filter((e) => (!e.kinds || e.kinds.includes(r.resource?.kind)) && ![
				"metadata.locationPath",
				"metadata.category",
				"metadata.tags"
			].includes(e.source)), t = new Set(e.map((e) => e.source));
			return [...e, ...Xn.filter((e) => {
				let n = r.resource?.metadata?.[e.source.split(".")[1]];
				return !t.has(e.source) && n != null && n !== "";
			})].map((e) => Yn(e, r.resource));
		}), ne = zt, W = R(() => r.selectionOnly ? ir(r.resource, r.t) : r.resource?.kind === "node" ? r.t("COM_SMARTBROWSER_FOLDER") : r.resource?.type ? r.resource.type.charAt(0).toUpperCase() + r.resource.type.slice(1) : r.t("COM_SMARTBROWSER_RESOURCE")), re = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, G = (e) => `${(e / 1024).toFixed(2)} KB`, K = (e) => String(e.source || "").split(".").reduce((e, t) => e?.[t], r.resource), q = (e) => [
			"metadata.categoryPath",
			"metadata.tagPaths",
			"metadata.locationPath"
		].includes(e.source) ? Jn(K(e)) : (e.format === "language" || e.source === "metadata.language") && K(e) === "*" ? r.t("COM_SMARTBROWSER_ALL_LANGUAGES") : e.format === "date" ? re(K(e)) : e.format === "size" ? K(e) !== null && K(e) !== void 0 ? G(K(e)) : "" : e.format === "dimensions" ? r.resource?.metadata.width && r.resource?.metadata.height ? `${r.resource.metadata.width}px \u00d7 ${r.resource.metadata.height}px` : "" : K(e), J = (e) => {
			let t = String(e || "").trim().match(/(Z|[+-]\d{2}:?\d{2})$/i);
			if (!t) return "";
			let n = t[1].toUpperCase() === "Z" ? 0 : (t[1].startsWith("-") ? -1 : 1) * (Number(t[1].slice(1, 3)) * 60 + Number(t[1].slice(-2)));
			if (n === -new Date(e).getTimezoneOffset()) return "";
			let i = n >= 0 ? "+" : "-", a = Math.abs(n), o = n === 0 ? "UTC" : `UTC${i}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
			return `${r.t("COM_SMARTBROWSER_SOURCE_TIMEZONE")}: ${o}`;
		};
		return (t, r) => (m(), n("aside", { class: c(["resource-info-panel", {
			"has-usage": f.value,
			"showing-usage": f.value && E.value === "usage",
			"is-empty-selection": e.selectionOnly && !e.resource,
			"is-selection-panel": e.selectionOnly
		}]) }, [e.resource && !e.selectionOnly && f.value ? (m(), n("div", sr, [w("button", {
			type: "button",
			role: "tab",
			"aria-selected": E.value === "usage",
			onClick: r[0] ||= (e) => O("usage")
		}, x(e.t("COM_SMARTBROWSER_USAGE_OPTIONS")), 9, cr), w("button", {
			type: "button",
			role: "tab",
			"aria-selected": E.value === "info",
			onClick: r[1] ||= (e) => O("info")
		}, x(e.t("COM_SMARTBROWSER_USAGE_INFO")), 9, lr)])) : g("", !0), _(qn, {
			disabled: e.selectionOnly,
			"resource-key": P(B)(e.resource),
			tab: E.value
		}, {
			default: y(() => [
				e.selectionOnly ? o((m(), n("div", {
					key: 0,
					ref_key: "nativePreviewElement",
					ref: N,
					class: "sb-native-preview-host"
				}, [e.nativePreview && e.resource ? (m(), L(dn, {
					key: 0,
					context: V.value
				}, null, 8, ["context"])) : g("", !0), e.nativePreview && e.resource ? (m(), L(mn, {
					key: 1,
					"image-element": ee.value,
					context: V.value
				}, null, 8, ["image-element", "context"])) : g("", !0)], 512)), [[j, e.nativePreview]]) : g("", !0),
				e.selectionOnly && !e.resource && !e.nativePreview ? (m(), L(xn, {
					key: 1,
					resource: {
						id: "",
						metadata: {}
					},
					definitions: [],
					values: {},
					"content-only": "",
					t: e.t
				}, null, 8, ["t"])) : g("", !0),
				e.selectionOnly && !e.resource ? (m(), n(C, { key: 2 }, [w("h3", null, x(e.t(e.nativePreview ? "COM_SMARTBROWSER_NO_IMAGE_SELECTED" : "COM_SMARTBROWSER_COLLECTION_EMPTY")), 1), e.allowQuickAdd ? (m(), n("div", ur, [w("button", {
					type: "button",
					class: "resource-preview-add",
					disabled: e.addDisabled,
					title: e.t("COM_SMARTBROWSER_COLLECTION_ADD"),
					"aria-label": e.t("COM_SMARTBROWSER_COLLECTION_ADD"),
					onClick: r[2] ||= (e) => t.$emit("selection-add")
				}, [...r[9] ||= [w("span", { class: "fas fa-plus" }, null, -1)]], 8, dr)])) : g("", !0)], 64)) : g("", !0),
				e.resource ? (m(), n(C, { key: 3 }, [
					e.resource.unavailable || e.resource.metadata?.state === -2 ? (m(), n("p", fr, x(e.t("COM_SMARTBROWSER_SELECTION_UNAVAILABLE")), 1)) : g("", !0),
					!e.resource.unavailable && e.resource.metadata?.state !== -2 ? (m(), L(xn, {
						key: 1,
						ref_key: "previewElement",
						ref: M,
						"overlay-context": p.value ? e.previewContext : null,
						resource: e.resource,
						definitions: p.value ? e.usageDefinitions : [],
						values: p.value ? e.usageValues : {},
						errors: p.value ? e.usageErrors : {},
						"resolve-reference": e.resolveReference,
						"can-preview": e.canPreview,
						"native-preview": e.nativePreview,
						"content-only": p.value,
						editable: e.selectionOnly ? e.usageMode === "editable" : p.value && e.previewContext?.isReadOnly === !1,
						t: e.t,
						onPreview: r[3] ||= (e) => t.$emit("preview"),
						onChange: r[4] ||= (e, n) => t.$emit("usage-change", e, n)
					}, {
						actions: y(() => [(m(!0), n(C, null, i(p.value ? e.previewActions : [], (t) => (m(), n("button", {
							key: t.id,
							type: "button",
							disabled: A.value,
							title: e.t(t.label),
							"aria-label": e.t(t.label),
							onClick: (e) => H(t)
						}, [w("span", {
							class: c(t.icon || "fas fa-bolt"),
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
					])) : g("", !0),
					e.selectionOnly ? (m(), n("h3", mr, x(h.value), 1)) : (m(), n("h3", hr, x(h.value), 1)),
					e.selectionActions?.length ? (m(), n("div", gr, [(m(!0), n(C, null, i(e.selectionActions, (r) => (m(), n("button", {
						key: r.id,
						type: "button",
						disabled: r.disabled,
						title: e.t(r.label),
						"aria-label": e.t(r.label),
						class: c({
							"resource-preview-remove": r.id === "collectionRemove",
							"resource-preview-add": r.id === "collectionAdd"
						}),
						onClick: (e) => t.$emit("selection-action", r)
					}, [_(Sn, { icon: r.icon }, null, 8, ["icon"])], 10, _r))), 128)), s(t.$slots, "quick-actions")])) : g("", !0),
					w("div", vr, [
						e.selectionOnly ? (m(), n("dl", yr, [w("div", null, [w("dt", null, [r[10] ||= w("span", {
							class: "fas fa-link",
							"aria-hidden": "true"
						}, null, -1), I(x(e.t("COM_SMARTBROWSER_URI")), 1)]), w("dd", br, [w("input", {
							type: "text",
							value: u.value,
							title: u.value,
							"aria-label": e.t("COM_SMARTBROWSER_URI"),
							class: "sb-reference-readonly",
							readonly: "",
							"aria-readonly": "true"
						}, null, 8, xr), w("button", {
							type: "button",
							title: e.t("COM_SMARTBROWSER_COPY_PATH"),
							"aria-label": e.t("COM_SMARTBROWSER_COPY_PATH"),
							onClick: r[5] ||= (e) => b(u.value)
						}, [...r[11] ||= [w("span", {
							class: "fas fa-copy",
							"aria-hidden": "true"
						}, null, -1)]], 8, Sr)])])])) : g("", !0),
						e.selectionOnly && e.usageMode === "readonly" && e.usageDefinitions?.length ? (m(), n("dl", Cr, [(m(!0), n(C, null, i(e.usageDefinitions, (t) => (m(), n("div", { key: t.key }, [w("dt", null, [t.key === "media.decorative" ? g("", !0) : (m(), n("span", {
							key: 0,
							class: c(P(v)(t)),
							"aria-hidden": "true"
						}, null, 2)), I(x(e.t(t.label)), 1)]), w("dd", null, x(S(t)), 1)]))), 128))])) : g("", !0),
						e.usageDefinitions?.length && (e.selectionOnly ? e.usageMode === "editable" : E.value === "usage") ? (m(), L(Kn, {
							key: P(B)(e.resource),
							"secondary-open": d.value,
							"onUpdate:secondaryOpen": r[6] ||= (e) => d.value = e,
							definitions: T.value,
							values: e.usageValues,
							errors: e.usageErrors,
							resource: e.resource,
							t: e.t,
							editors: e.usageEditors,
							"resolve-reference": e.resolveReference,
							onChange: r[7] ||= (e, n) => t.$emit("usage-change", e, n)
						}, null, 8, [
							"secondary-open",
							"definitions",
							"values",
							"errors",
							"resource",
							"t",
							"editors",
							"resolve-reference"
						])) : g("", !0)
					]),
					!e.selectionOnly && !p.value ? (m(), n(C, { key: 5 }, [e.fields?.length ? (m(), n("dl", wr, [(m(!0), n(C, null, i(U.value, (t) => o((m(), n("div", { key: `${t.source}-${t.label}` }, [
						w("dt", null, [w("span", {
							class: c(P(ne)(t)),
							"aria-hidden": "true"
						}, null, 2), I(x(e.t(t.label)), 1)]),
						t.format === "language" ? (m(), n("dd", Tr, [e.resource.metadata?.languageImage ? (m(), n("img", {
							key: 0,
							src: e.resource.metadata.languageImage,
							alt: "",
							"aria-hidden": "true"
						}, null, 8, Er)) : K(t) === "*" ? (m(), n("span", Dr)) : g("", !0), w("span", null, x(q(t)), 1)])) : (m(), n("dd", {
							key: 1,
							class: c({
								"resource-info-identifier": t.source === "metadata.alias" || t.source === "metadata.username",
								"resource-info-lines": t.source === "metadata.tagPaths"
							})
						}, x(q(t)), 3)),
						t.format === "date" && J(K(t)) ? (m(), n("small", Or, x(J(K(t))), 1)) : g("", !0)
					])), [[j, q(t) !== "" && q(t) !== null && q(t) !== void 0]])), 128))])) : (m(), n("dl", kr, [
						e.resource.parentId ? (m(), n("div", Ar, [w("dt", null, [r[12] ||= w("span", {
							class: "fas fa-folder",
							"aria-hidden": "true"
						}, null, -1), I(x(e.t("COM_SMARTBROWSER_FOLDER")), 1)]), w("dd", null, x(e.resource.parentId), 1)])) : g("", !0),
						w("div", null, [w("dt", null, [r[13] ||= w("span", {
							class: "fas fa-file-alt",
							"aria-hidden": "true"
						}, null, -1), I(x(e.t("COM_SMARTBROWSER_TYPE")), 1)]), w("dd", null, x(W.value), 1)]),
						e.resource.metadata.created ? (m(), n("div", jr, [
							w("dt", null, [r[14] ||= w("span", {
								class: "fas fa-calendar",
								"aria-hidden": "true"
							}, null, -1), I(x(e.t("COM_SMARTBROWSER_DATE_CREATED")), 1)]),
							w("dd", null, x(re(e.resource.metadata.created)), 1),
							J(e.resource.metadata.created) ? (m(), n("small", Mr, x(J(e.resource.metadata.created)), 1)) : g("", !0)
						])) : g("", !0),
						e.resource.metadata.modified ? (m(), n("div", Nr, [
							w("dt", null, [r[15] ||= w("span", {
								class: "fas fa-calendar",
								"aria-hidden": "true"
							}, null, -1), I(x(e.t("COM_SMARTBROWSER_DATE_MODIFIED")), 1)]),
							w("dd", null, x(re(e.resource.metadata.modified)), 1),
							J(e.resource.metadata.modified) ? (m(), n("small", Pr, x(J(e.resource.metadata.modified)), 1)) : g("", !0)
						])) : g("", !0),
						e.resource.metadata.width && e.resource.metadata.height ? (m(), n("div", Fr, [w("dt", null, [r[16] ||= w("span", {
							class: "fas fa-expand",
							"aria-hidden": "true"
						}, null, -1), I(x(e.t("COM_SMARTBROWSER_DIMENSIONS")), 1)]), w("dd", null, x(e.resource.metadata.width) + "px × " + x(e.resource.metadata.height) + "px", 1)])) : g("", !0),
						e.resource.metadata.size ? (m(), n("div", Ir, [w("dt", null, [r[17] ||= w("span", {
							class: "fas fa-database",
							"aria-hidden": "true"
						}, null, -1), I(x(e.t("COM_SMARTBROWSER_SIZE")), 1)]), w("dd", null, x(G(e.resource.metadata.size)), 1)])) : g("", !0),
						e.resource.metadata.mimeType ? (m(), n("div", Lr, [w("dt", null, [r[18] ||= w("span", {
							class: "fas fa-file-alt",
							"aria-hidden": "true"
						}, null, -1), I(x(e.t("COM_SMARTBROWSER_MIME_TYPE")), 1)]), w("dd", null, x(e.resource.metadata.mimeType), 1)])) : g("", !0),
						e.resource.metadata.extension ? (m(), n("div", Rr, [w("dt", null, [r[19] ||= w("span", {
							class: "fas fa-file-alt",
							"aria-hidden": "true"
						}, null, -1), I(x(e.t("COM_SMARTBROWSER_EXTENSION")), 1)]), w("dd", null, x(e.resource.metadata.extension), 1)])) : g("", !0),
						w("div", null, [w("dt", null, [r[20] ||= w("span", {
							class: "fas fa-key",
							"aria-hidden": "true"
						}, null, -1), I(x(e.t("JGLOBAL_FIELD_ID_LABEL")), 1)]), w("dd", null, x(e.resource.metadata.id ?? e.resource.id), 1)])
					]))], 64)) : g("", !0)
				], 64)) : (m(), n("div", zr, [
					e.allowAdd ? (m(), n("button", {
						key: 0,
						type: "button",
						class: "btn btn-outline-secondary",
						disabled: e.addDisabled,
						onClick: r[8] ||= (e) => t.$emit("selection-add")
					}, [r[21] ||= w("span", { class: "fas fa-plus" }, null, -1), I(" " + x(e.t("COM_SMARTBROWSER_SELECT_RESOURCE")), 1)], 8, Br)) : g("", !0),
					w("p", null, x(e.t(e.selectionOnly ? "COM_SMARTBROWSER_SELECTION_START" : "COM_SMARTBROWSER_SELECTION_INFO_EMPTY")), 1),
					s(t.$slots, "empty-actions")
				]))
			]),
			_: 3
		}, 8, [
			"disabled",
			"resource-key",
			"tab"
		])], 2));
	}
}, Hr = { class: "resource-ordering-moves" }, Ur = [
	"disabled",
	"title",
	"aria-label"
], Wr = [
	"disabled",
	"title",
	"aria-label"
], Gr = {
	__name: "ResourceOrderingControls",
	props: {
		enabled: Boolean,
		t: Function
	},
	emits: ["reorder"],
	setup(e) {
		return (t, r) => (m(), n("span", Hr, [w("button", {
			type: "button",
			disabled: !e.enabled,
			title: e.t("COM_SMARTBROWSER_MOVE_UP"),
			"aria-label": e.t("COM_SMARTBROWSER_MOVE_UP"),
			onClick: r[0] ||= (e) => t.$emit("reorder", "up")
		}, [...r[2] ||= [w("span", {
			class: "fas fa-arrow-up",
			"aria-hidden": "true"
		}, null, -1)]], 8, Ur), w("button", {
			type: "button",
			disabled: !e.enabled,
			title: e.t("COM_SMARTBROWSER_MOVE_DOWN"),
			"aria-label": e.t("COM_SMARTBROWSER_MOVE_DOWN"),
			onClick: r[1] ||= (e) => t.$emit("reorder", "down")
		}, [...r[3] ||= [w("span", {
			class: "fas fa-arrow-down",
			"aria-hidden": "true"
		}, null, -1)]], 8, Wr)]));
	}
}, Kr = ["popover"], qr = [
	"title",
	"aria-label",
	"aria-expanded",
	"popovertarget"
], Jr = 0, Yr = {
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
	setup(t) {
		let r = t, i = `sb-toolbar-popup-${++Jr}`, l = a(null), u = a(null), f = a(null), p = a(!1), h = a(!1), g, _, v = () => b();
		function y() {
			if (!p.value || h.value) return;
			let e = f.value.getBoundingClientRect();
			if (!e.width || e.bottom < 0 || e.top > window.innerHeight) {
				b();
				return;
			}
			let t = u.value.getBoundingClientRect(), n = window.innerHeight - e.bottom - 8, i = r.alignment === "start" != (getComputedStyle(l.value).direction === "rtl");
			u.value.style.left = `${Math.max(8, Math.min(i ? e.left : e.right - t.width, window.innerWidth - t.width - 8))}px`, u.value.style.top = `${Math.max(8, n < t.height && e.top > n ? e.top - t.height : e.bottom)}px`, u.value.style.maxHeight = `${Math.max(80, Math.max(n, e.top - 8))}px`;
		}
		function b(e = !1) {
			u.value?.matches(":popover-open") && u.value.hidePopover(), p.value = !1, e && f.value?.focus();
		}
		async function x() {
			if (p.value) {
				b();
				return;
			}
			p.value = !0, await e(), u.value.querySelector("input:not(:disabled), select:not(:disabled), button:not(:disabled)")?.focus({ preventScroll: !0 });
		}
		async function C(t) {
			h.value || (p.value = t.newState === "open", p.value && (await e(), y(), u.value.querySelector("input:not(:disabled), select:not(:disabled), button:not(:disabled)")?.focus({ preventScroll: !0 })));
		}
		function T(e) {
			e.key === "Escape" && p.value && (e.stopPropagation(), e.preventDefault(), b(!0));
		}
		function E(e) {
			h.value && !l.value?.contains(e.target) && b();
		}
		return d(() => {
			_ = l.value.closest("dialog"), _?.addEventListener("close", v), document.addEventListener("pointerdown", E), window.addEventListener("scroll", y, !0), window.addEventListener("resize", y), g = new ResizeObserver(([e]) => {
				e.contentRect.width || b();
				let t = r.inline && e.contentRect.width >= 800;
				t !== h.value && (b(), h.value = t);
			}), g.observe(l.value.closest(".resource-toolbar"));
		}), k(() => {
			b(), g?.disconnect(), _?.removeEventListener("close", v), document.removeEventListener("pointerdown", E), window.removeEventListener("scroll", y, !0), window.removeEventListener("resize", y);
		}), (e, r) => (m(), n("div", {
			ref_key: "host",
			ref: l,
			class: c(["resource-toolbar-popup", {
				"is-inline": h.value,
				"is-aligned-start": t.alignment === "start"
			}]),
			onKeydown: T
		}, [o(w("div", {
			id: i,
			ref_key: "panel",
			ref: u,
			popover: h.value ? void 0 : "auto",
			class: c(["resource-toolbar-popup-panel", t.panelClass]),
			style: S({ "--sb-toolbar-popup-width": `${t.width}px` }),
			onToggle: C
		}, [s(e.$slots, "default")], 46, Kr), [[j, p.value || !h.value]]), w("button", {
			ref_key: "button",
			ref: f,
			type: "button",
			class: c(["resource-icon-button", { active: p.value }]),
			title: t.label,
			"aria-label": t.label,
			"aria-expanded": p.value,
			"aria-controls": i,
			popovertarget: h.value ? void 0 : i,
			onClick: r[0] ||= (e) => h.value && x()
		}, [w("span", {
			class: c(t.icon),
			"aria-hidden": "true"
		}, null, 2)], 10, qr)], 34));
	}
}, Xr = { class: "resource-column-menu-title" }, Zr = [
	"checked",
	"disabled",
	"onChange"
], Qr = {
	__name: "ResourceColumnPicker",
	props: {
		columns: Array,
		hiddenColumns: Array,
		shownColumns: Array,
		t: Function
	},
	emits: ["toggle-column"],
	setup(e) {
		return (t, r) => (m(), L(Yr, {
			class: "resource-column-picker",
			label: e.t("COM_SMARTBROWSER_COLUMNS"),
			icon: "fas fa-columns",
			"panel-class": "resource-column-menu",
			width: 220
		}, {
			default: y(() => [w("div", Xr, x(e.t("COM_SMARTBROWSER_COLUMNS")), 1), (m(!0), n(C, null, i(e.columns, (r) => (m(), n("label", {
				key: r.id,
				class: "resource-column-choice"
			}, [w("input", {
				type: "checkbox",
				checked: r.defaultVisible === !1 ? e.shownColumns?.includes(r.id) : !e.hiddenColumns?.includes(r.id),
				disabled: r.id === "title" || r.id === "name",
				onChange: (e) => t.$emit("toggle-column", r.id)
			}, null, 40, Zr), w("span", null, x(e.t(r.label || (r.dateGroup ? "COM_SMARTBROWSER_DATE" : r.fields?.[0]?.label))), 1)]))), 128))]),
			_: 1
		}, 8, ["label"]));
	}
}, $r = { class: "resource-sort-controls" }, ei = ["value", "aria-label"], ti = ["value"], ni = ["value"], ri = [
	"disabled",
	"title",
	"aria-label"
], ii = {
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
		return (t, r) => (m(), L(Yr, {
			alignment: e.alignment,
			label: e.t("COM_SMARTBROWSER_SORT_BY"),
			icon: "fas fa-signal",
			"panel-class": "resource-sort-menu",
			width: 260
		}, {
			default: y(() => [w("div", $r, [w("select", {
				value: e.sortBy,
				class: "form-select",
				"aria-label": e.t("COM_SMARTBROWSER_SORT_BY"),
				onChange: r[0] ||= (e) => t.$emit("sort-by", e.target.value)
			}, [e.defaultValue === null ? g("", !0) : (m(), n("option", {
				key: 0,
				value: e.defaultValue
			}, x(e.t(e.defaultLabel)), 9, ti)), (m(!0), n(C, null, i(e.fields, (t) => (m(), n("option", {
				key: t.id,
				value: t.id
			}, x(e.t(t.label)), 9, ni))), 128))], 40, ei), w("button", {
				type: "button",
				class: "resource-icon-button",
				disabled: !e.sortBy,
				title: e.t("COM_SMARTBROWSER_SORT_DIRECTION"),
				"aria-label": e.t("COM_SMARTBROWSER_SORT_DIRECTION"),
				onClick: r[1] ||= (n) => t.$emit("sort-direction-value", e.sortDirection === "desc" ? "asc" : "desc")
			}, [w("span", {
				class: c(e.sortDirection === "desc" ? "fas fa-sort-amount-down-alt" : "fas fa-sort-amount-up"),
				"aria-hidden": "true"
			}, null, 2)], 8, ri)])]),
			_: 1
		}, 8, ["alignment", "label"]));
	}
}, ai = "contextual", oi = (e, t) => ({
	...e,
	focusable: e.focusable ?? t.focusable,
	selectable: e.selectable ?? t.selectable,
	bulkSelectable: e.bulkSelectable ?? e.selectable ?? t.bulkSelectable,
	actionable: e.actionable ?? t.actionable,
	navigable: e.navigable ?? t.navigable,
	activatable: e.activatable ?? t.activatable
}), si = (e) => oi({
	...e,
	role: e.role || "primary"
}, {
	focusable: !0,
	selectable: !1,
	bulkSelectable: !1,
	actionable: !0,
	navigable: !1,
	activatable: !0
}), ci = (e) => ({
	...e,
	role: ai,
	focusable: e.focusable ?? !0,
	selectable: !1,
	bulkSelectable: !1,
	actionable: !1,
	navigable: !1,
	activatable: !1,
	interactiveOverlays: !1,
	capabilities: {}
}), li = (e) => e?.role === ai, ui = (e) => e?.focusable === !0, di = (e, t = "both") => e?.selectable === !0 && (t === "both" || e.kind === t), fi = (e, t = "both") => di(e, t) && e?.bulkSelectable === !0, pi = (e) => e?.actionable === !0, mi = (e, t, n, r) => ["manage", "select"].includes(t) && pi(e) && n.find((t) => t.id === "preview" && r(t, [e])) || null;
function hi(e, t, n, r, i = "both") {
	return e?.kind === "node" ? t === "select" ? di(e, i) ? {
		id: "pickerSelect",
		label: "COM_SMARTBROWSER_SELECT",
		icon: "fas fa-check",
		local: !0
	} : null : t === "manage" && pi(e) && n.find((t) => t.id === "edit" && r(t, [e])) || null : (["manage", "select"].includes(t) && pi(e) ? n.find((t) => t.modifiedDefault === !0 && r(t, [e])) : null) || mi(e, t, n, r);
}
function gi(e, t, n, r, i = "both") {
	return e?.navigable ? {
		id: "browseOpen",
		label: "COM_SMARTBROWSER_OPEN",
		icon: "fas fa-folder-open",
		local: !0
	} : e?.activatable ? t === "select" ? di(e, i) ? {
		id: "pickerSelect",
		label: "COM_SMARTBROWSER_SELECT",
		icon: "fas fa-check",
		local: !0
	} : null : pi(e) && n.find((n) => n.id === (t === "manage" ? "edit" : "preview") && r(n, [e])) || null : null;
}
//#endregion
//#region resources/js/core/previewExtensionContext.js
function _i(e) {
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
//#region resources/js/core/itemMenuActions.js
var vi = (e, t, n, r = null, i = null) => {
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
function yi() {
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
var bi = { class: "resource-grid-select-all" }, xi = ["checked", "aria-label"], Si = [
	"role",
	"tabindex",
	"aria-pressed",
	"onClick",
	"onDblclick",
	"onKeydown"
], Ci = [
	"checked",
	"aria-label",
	"onChange"
], wi = [
	"aria-expanded",
	"title",
	"onClick"
], Ti = [
	"title",
	"disabled",
	"onClick"
], Ei = { class: "resource-item-visual" }, Di = {
	key: 0,
	class: "resource-item-overlays"
}, Oi = ["title", "onClick"], ki = ["src"], Ai = ["title"], ji = ["src"], Mi = ["title"], Ni = ["title"], Pi = { class: "resource-item-metadata-text" }, Fi = {
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
	setup(t, { emit: r }) {
		let o = t, s = yi(), l = r, u = (e, t) => {
			if (s.accepts(B(e), t)) {
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
		}, f = a(null), p = a(!1), h = a(0), v = async (t, n) => {
			if (f.value === t) {
				f.value = null;
				return;
			}
			let r = n.currentTarget.closest(".resource-browser-item"), i = r?.closest(".resource-browser");
			if (p.value = !1, h.value = i ? Math.max(0, Math.min(360, i.clientWidth - 8, window.innerWidth - 20)) : 0, f.value = t, await e(), f.value !== t || !i) return;
			let a = r.querySelector(".resource-item-menu");
			p.value = a?.getBoundingClientRect().left < i.getBoundingClientRect().left + 4;
		}, y = (e) => vi(o.actions, e, o.actionAvailable, o.defaultAction?.(e), (o.modifiedAction || o.previewAction)?.(e)), b = (e, t) => pi(t) && t.interactiveOverlays !== !1 ? o.actions.find((n) => n.id === e.action && o.actionAvailable(n, [t])) : void 0, T = () => {
			f.value = null;
		}, E = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e), A = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, j = (e) => {
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
			].filter(Boolean) : e.kind === "item" && t.mimeType ? [n("COM_SMARTBROWSER_MIME_TYPE", t.mimeType, "fas fa-file-alt"), e.type === "image" && t.width > 0 && t.height > 0 ? n("COM_SMARTBROWSER_DIMENSIONS", `${t.width} × ${t.height}`, "fas fa-expand") : null].filter(Boolean) : (e.collectionPresentation?.gridFields || o.gridFields || []).map((t) => n(t.label || "COM_SMARTBROWSER_DETAILS", t.format === "date" ? A(E(e, t.source)) : E(e, t.source), t.icon || "fas fa-info")).filter(Boolean);
		};
		return d(() => document.addEventListener("click", T)), k(() => document.removeEventListener("click", T)), (e, r) => (m(), n("div", { class: c(["resource-browser-grid", `size-${t.options.gridSize}`]) }, [t.selectionControls ? (m(), n("div", {
			key: 0,
			class: c(["resource-view-icons", { active: t.allSelected }])
		}, [w("label", bi, [w("input", {
			type: "checkbox",
			checked: t.allSelected,
			"aria-label": t.t("COM_SMARTBROWSER_SELECT_ALL"),
			onChange: r[0] ||= (t) => e.$emit("select-all")
		}, null, 40, xi)])], 2)) : g("", !0), (m(!0), n(C, null, i(t.resources, (a) => (m(), n("div", {
			key: P(B)(a),
			class: c(["resource-browser-item", {
				selected: t.selectedIds.includes(P(B)(a)),
				focused: t.focusedId === P(B)(a),
				active: f.value === P(B)(a),
				contextual: P(li)(a)
			}]),
			role: P(ui)(a) ? "button" : void 0,
			tabindex: P(ui)(a) ? 0 : void 0,
			"aria-pressed": P(di)(a) ? t.selectedIds.includes(P(B)(a)) : void 0,
			onClick: D((t) => {
				P(s).click(P(B)(a), t), f.value = null, e.$emit("select", a, t.ctrlKey || t.metaKey);
			}, ["stop"]),
			onDblclick: D((e) => u(a, e), ["stop"]),
			onKeydown: O(D((e) => u(a), ["prevent"]), ["enter"]),
			onMouseleave: r[3] ||= (e) => f.value = null
		}, [
			t.selectionControls && P(di)(a) ? (m(), n("label", {
				key: 0,
				class: c(["resource-item-select", { checked: t.selectedIds.includes(P(B)(a)) }]),
				onClick: r[1] ||= D(() => {}, ["stop"])
			}, [w("input", {
				type: "checkbox",
				checked: t.selectedIds.includes(P(B)(a)),
				"aria-label": a.title,
				onChange: (t) => e.$emit("select", a, !0)
			}, null, 40, Ci)], 2)) : g("", !0),
			y(a).length ? (m(), n("button", {
				key: 1,
				type: "button",
				class: "resource-item-menu-toggle",
				"aria-expanded": f.value === P(B)(a),
				title: t.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: D((t) => {
					e.$emit("focus", a), v(P(B)(a), t);
				}, ["stop"])
			}, [...r[4] ||= [w("span", {
				class: "fas fa-ellipsis-h",
				"aria-hidden": "true"
			}, null, -1)]], 8, wi)) : g("", !0),
			f.value === P(B)(a) ? (m(), n("div", {
				key: 2,
				class: c(["resource-item-menu", { "align-start": p.value }]),
				style: S(h.value ? { maxWidth: `${h.value}px` } : null),
				onClick: r[2] ||= D(() => {}, ["stop"])
			}, [w("strong", null, x(a.title), 1), (m(!0), n(C, null, i(y(a), (r) => (m(), n("button", {
				key: r.id,
				type: "button",
				class: c([`resource-action-${r.id}`, {
					"resource-default-action": r.isDefault,
					"resource-modified-action": r.isModified
				}]),
				title: r.isDefault ? t.t("COM_SMARTBROWSER_DOUBLE_CLICK") : r.isModified ? t.t("COM_SMARTBROWSER_CTRL_DOUBLE_CLICK") : void 0,
				disabled: !t.actionAvailable(r, [a]),
				onClick: (t) => {
					f.value = null, e.$emit("action", r, a);
				}
			}, [_(Sn, { icon: r.icon }, null, 8, ["icon"]), I(" " + x(t.t(r.label)), 1)], 10, Ti))), 128))], 6)) : g("", !0),
			w("span", Ei, [_(ee, { resource: a }, null, 8, ["resource"]), a.overlays?.length ? (m(), n("span", Di, [(m(!0), n(C, null, i(a.overlays, (t) => (m(), n(C, { key: t.id }, [b(t, a) ? (m(), n("button", {
				key: 0,
				type: "button",
				class: c(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label,
				onClick: D((n) => {
					e.$emit("focus", a), e.$emit("action", b(t, a), a);
				}, ["stop"])
			}, [t.image ? (m(), n("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, ki)) : (m(), n("span", {
				key: 1,
				class: c(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, Oi)) : (m(), n("span", {
				key: 1,
				class: c(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label
			}, [t.image ? (m(), n("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, ji)) : (m(), n("span", {
				key: 1,
				class: c(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, Ai))], 64))), 128))])) : g("", !0)]),
			w("span", {
				class: "resource-item-title",
				title: `${t.t("COM_SMARTBROWSER_NAME")}: ${a.title}`
			}, x(a.title), 9, Mi),
			(m(!0), n(C, null, i(j(a), (e) => (m(), n("span", {
				key: e.label,
				class: c(["resource-item-metadata", { "resource-item-identifier": e.identifier }]),
				title: `${t.t(e.label)}: ${e.value}`
			}, [w("span", {
				class: c(e.icon),
				"aria-hidden": "true"
			}, null, 2), w("span", Pi, x(e.value), 1)], 10, Ni))), 128))
		], 42, Si))), 128))], 2));
	}
}, Ii = { class: "table-responsive resource-details-view" }, Li = { class: "table table-hover" }, Ri = {
	class: "resource-type-column resource-details-select-column",
	scope: "col"
}, zi = { class: "resource-details-select-controls" }, Bi = {
	key: 0,
	class: "resource-details-select-all"
}, Vi = [
	"checked",
	"title",
	"aria-label"
], Hi = ["title", "aria-label"], Ui = [
	"title",
	"aria-label",
	"onClick"
], Wi = ["title"], Gi = [
	"tabindex",
	"aria-current",
	"onClick",
	"onDblclick",
	"onKeydown"
], Ki = { class: "resource-type-column" }, qi = [
	"checked",
	"aria-label",
	"onChange"
], Ji = ["title"], Yi = { class: "resource-cell-ellipsis" }, Xi = ["title"], Zi = ["title", "onClick"], Qi = { class: "visually-hidden" }, $i = ["title"], ea = { class: "visually-hidden" }, ta = {
	key: 1,
	class: "resource-language"
}, na = ["src"], ra = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, ia = { class: "resource-language-name" }, aa = {
	key: 2,
	class: "resource-location-path"
}, oa = {
	key: 0,
	class: "resource-location-parents"
}, sa = { class: "resource-location-current" }, ca = {
	key: 3,
	class: "resource-cell-ellipsis"
}, la = {
	key: 4,
	class: "resource-row-overlays"
}, ua = ["title", "onClick"], da = ["src"], fa = ["title"], pa = ["src"], ma = { class: "resource-row-actions" }, ha = [
	"aria-expanded",
	"title",
	"onClick"
], ga = [
	"title",
	"disabled",
	"onClick"
], _a = {
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
	setup(e, { emit: t }) {
		let r = yi(), o = e, s = t, l = (e, t) => {
			if (r.accepts(B(e), t)) {
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
		], f = () => [
			"created",
			"modified",
			"both"
		].includes(o.options.detailsDateMode) ? o.options.detailsDateMode : "modified", p = (e) => {
			if (!e.dateGroup) return [e];
			let t = e.fields || [];
			return f() === "both" ? t : t.filter((e) => e.id === f());
		}, h = R(() => (o.columns?.length ? o.columns : u).flatMap(p)), v = R(() => 44 + 24 * Math.max(0, ...(o.resources || []).map((e) => (e.overlays || []).filter((e) => e.id !== "status").length))), y = R(() => Math.max(48, 24 + 8 * Math.max(1, ...(o.resources || []).map((e) => String(e.metadata?.id ?? "").length)))), b = (e) => {
			let t = e.id === "status" && e.overlays ? v.value : e.id === "id" ? y.value : null;
			return t === null ? null : {
				width: `${t}px`,
				minWidth: `${t}px`
			};
		}, T = (e) => e.headerIcon || (Object.hasOwn(Rt, e.id) ? Rt[e.id] : "fas fa-info"), E = (e) => e.sortField || e.id, A = (e) => o.t(e.label), j = (e) => (o.sortFields || u).some((t) => t.id === E(e)), M = (e) => o.sortBy === e ? o.sortDirection === "asc" ? "fas fa-caret-up ms-1" : "fas fa-caret-down ms-1" : "fas fa-sort ms-1", N = (e) => e ? `${(e / 1024).toFixed(2)}KB` : "", F = (e) => e.metadata.width && e.metadata.height ? `${e.metadata.width}px \u00d7 ${e.metadata.height}px` : "", L = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, z = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e), V = (e, t) => {
			if (t.id === "location") return String(e.metadata?.locationPath || e.metadata?.location || e.metadata?.categoryPath || e.metadata?.parentPath || e.metadata?.parent || "").replaceAll(" / ", " » ");
			if (t.id === "size") return e.kind === "node" ? "" : N(e.metadata.size);
			if (t.id === "dimension") return F(e);
			let n = t.source || `metadata.${t.id}`, r = z(e, n);
			return t.format === "size" ? N(r) : t.format === "dimensions" ? F(e) : t.format === "date" || ["created", "modified"].includes(t.id) ? L(r) : t.format === "mediaType" ? o.t({
				folder: "COM_SMARTBROWSER_FOLDER",
				image: "COM_SMARTBROWSER_MEDIA_IMAGE",
				document: "COM_SMARTBROWSER_MEDIA_DOCUMENT",
				video: "COM_SMARTBROWSER_MEDIA_VIDEO",
				audio: "COM_SMARTBROWSER_MEDIA_AUDIO"
			}[r] || "COM_SMARTBROWSER_RESOURCE") : t.format === "language" && r === "*" ? o.t("COM_SMARTBROWSER_ALL_LANGUAGES") : ["categoryPath", "tagPaths"].includes(t.id) ? String(r ?? "").replaceAll(" / ", " » ") : r ?? "";
		}, te = (e, t) => t.id === "location" ? String(V(e, t) || "") : t.format === "status" ? U(e).label : String(V(e, t) || ""), H = (e, t) => {
			let n = String(V(e, t)), r = n.lastIndexOf(" » ");
			return r < 0 ? {
				parent: "",
				leaf: n
			} : {
				parent: n.slice(0, r),
				leaf: n.slice(r)
			};
		}, U = (e) => ({
			icon: e.statusPresentation?.icon || "fas fa-question-circle",
			label: e.statusPresentation?.label || V(e, { source: "metadata.stateLabel" }),
			class: `status-${e.statusPresentation?.tone || "neutral"}`
		}), ne = (e) => e.overlays?.find((e) => e.id === "status") || {}, W = a(null), re = (e) => {
			W.value = W.value === e ? null : e;
		}, G = (e) => vi(o.actions, e, o.actionAvailable, o.defaultAction?.(e), (o.modifiedAction || o.previewAction)?.(e)), K = (e, t) => pi(t) && t.interactiveOverlays !== !1 ? o.actions.find((n) => n.id === e.action && o.actionAvailable(n, [t])) : void 0, q = () => {
			W.value = null;
		};
		return d(() => document.addEventListener("click", q)), k(() => document.removeEventListener("click", q)), (t, a) => (m(), n("div", Ii, [w("table", Li, [w("thead", null, [w("tr", null, [
			w("th", Ri, [w("span", zi, [e.selectionControls ? (m(), n("label", Bi, [w("input", {
				type: "checkbox",
				checked: e.allSelected,
				title: e.t("COM_SMARTBROWSER_SELECT_ALL"),
				"aria-label": e.t("COM_SMARTBROWSER_SELECT_ALL"),
				onChange: a[0] ||= (e) => t.$emit("select-all")
			}, null, 40, Vi)])) : g("", !0), e.orderingField ? (m(), n("button", {
				key: 1,
				type: "button",
				class: "resource-ordering-sort",
				title: e.t("COM_SMARTBROWSER_ORDERING"),
				"aria-label": e.t("COM_SMARTBROWSER_ORDERING"),
				onClick: a[1] ||= (n) => t.$emit("sort", e.orderingField)
			}, [w("span", {
				class: c(M(e.orderingField)),
				"aria-hidden": "true"
			}, null, 2)], 8, Hi)) : g("", !0)])]),
			(m(!0), n(C, null, i(h.value, (r) => (m(), n("th", {
				key: r.id,
				class: c(`resource-column-${r.id}`),
				style: S(b(r)),
				scope: "col"
			}, [j(r) ? (m(), n("button", {
				key: 0,
				type: "button",
				class: "btn btn-link",
				title: A(r),
				"aria-label": A(r),
				onClick: (e) => t.$emit("sort", E(r))
			}, [
				T(r) ? (m(), n("span", {
					key: 0,
					class: c(T(r)),
					"aria-hidden": "true"
				}, null, 2)) : g("", !0),
				w("span", { class: c(["resource-header-text", { "resource-header-primary": ["title", "name"].includes(r.id) }]) }, x(A(r)), 3),
				w("span", {
					class: c(M(E(r))),
					"aria-hidden": "true"
				}, null, 2)
			], 8, Ui)) : (m(), n("span", {
				key: 1,
				class: "resource-column-label",
				title: A(r)
			}, [T(r) ? (m(), n("span", {
				key: 0,
				class: c(T(r)),
				"aria-hidden": "true"
			}, null, 2)) : g("", !0), w("span", { class: c(["resource-header-text", { "resource-header-primary": ["title", "name"].includes(r.id) }]) }, x(r.shortLabel ? e.t(r.shortLabel) : A(r)), 3)], 8, Wi))], 6))), 128)),
			a[4] ||= w("th", {
				class: "resource-row-actions",
				scope: "col"
			}, null, -1)
		])]), w("tbody", null, [(m(!0), n(C, null, i(e.resources, (o) => (m(), n("tr", {
			key: P(B)(o),
			class: c({
				selected: e.selectedIds.includes(P(B)(o)),
				focused: e.focusedId === P(B)(o),
				focusable: P(ui)(o),
				contextual: P(li)(o)
			}),
			tabindex: P(ui)(o) ? 0 : void 0,
			"aria-current": e.focusedId === P(B)(o) ? "true" : void 0,
			onClick: D((e) => {
				P(r).click(P(B)(o), e), W.value = null, t.$emit("select", o, e.ctrlKey || e.metaKey);
			}, ["stop"]),
			onDblclick: D((e) => l(o, e), ["stop"]),
			onKeydown: O(D((e) => l(o), ["prevent"]), ["enter"])
		}, [
			w("td", Ki, [_(ee, {
				resource: o,
				variant: "compact",
				"allow-image": e.options.detailsThumbnails
			}, null, 8, ["resource", "allow-image"]), e.selectionControls && P(di)(o) ? (m(), n("label", {
				key: 0,
				class: c(["resource-row-select", { checked: e.selectedIds.includes(P(B)(o)) }]),
				onClick: a[2] ||= D(() => {}, ["stop"])
			}, [w("input", {
				type: "checkbox",
				checked: e.selectedIds.includes(P(B)(o)),
				"aria-label": o.title,
				onChange: (e) => t.$emit("select", o, !0)
			}, null, 40, qi)], 2)) : g("", !0)]),
			w("th", {
				class: "resource-title-cell",
				scope: "row",
				title: o.title
			}, [w("span", Yi, x(o.title), 1)], 8, Ji),
			(m(!0), n(C, null, i(h.value.slice(1), (e) => (m(), n("td", {
				key: e.id,
				class: c(`resource-column-${e.id}`),
				style: S(b(e)),
				title: te(o, e)
			}, [w("span", { class: c(["resource-cell-content", { "resource-status-group": e.format === "status" }]) }, [e.format === "status" && o.statusPresentation ? (m(), n(C, { key: 0 }, [K(ne(o), o) ? (m(), n("button", {
				key: 0,
				type: "button",
				class: c(["resource-status-icon", U(o).class]),
				title: U(o).label,
				onClick: D((e) => {
					t.$emit("focus", o), t.$emit("action", K(ne(o), o), o);
				}, ["stop"])
			}, [w("span", {
				class: c(U(o).icon),
				"aria-hidden": "true"
			}, null, 2), w("span", Qi, x(U(o).label), 1)], 10, Zi)) : (m(), n("span", {
				key: 1,
				class: c(["resource-status-icon", U(o).class]),
				title: U(o).label
			}, [w("span", {
				class: c(U(o).icon),
				"aria-hidden": "true"
			}, null, 2), w("span", ea, x(U(o).label), 1)], 10, $i))], 64)) : e.format === "language" ? (m(), n("span", ta, [o.metadata.languageImage ? (m(), n("img", {
				key: 0,
				src: o.metadata.languageImage,
				alt: ""
			}, null, 8, na)) : o.metadata.language === "*" ? (m(), n("span", ra)) : g("", !0), w("span", ia, x(V(o, e)), 1)])) : e.id === "location" ? (m(), n("span", aa, [H(o, e).parent ? (m(), n("span", oa, x(H(o, e).parent), 1)) : g("", !0), w("span", sa, x(H(o, e).leaf), 1)])) : (m(), n("span", ca, x(V(o, e)), 1)), e.overlays && o.overlays?.length ? (m(), n("span", la, [(m(!0), n(C, null, i(o.overlays.filter((e) => e.id !== "status"), (e) => (m(), n(C, { key: e.id }, [K(e, o) ? (m(), n("button", {
				key: 0,
				type: "button",
				class: c(["resource-overlay", [`overlay-${e.id}`, `tone-${e.tone || "neutral"}`]]),
				title: e.label,
				onClick: D((n) => {
					t.$emit("focus", o), t.$emit("action", K(e, o), o);
				}, ["stop"])
			}, [e.image ? (m(), n("img", {
				key: 0,
				src: e.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, da)) : (m(), n("span", {
				key: 1,
				class: c(e.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, ua)) : (m(), n("span", {
				key: 1,
				class: c(["resource-overlay", [`overlay-${e.id}`, `tone-${e.tone || "neutral"}`]]),
				title: e.label
			}, [e.image ? (m(), n("img", {
				key: 0,
				src: e.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, pa)) : (m(), n("span", {
				key: 1,
				class: c(e.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, fa))], 64))), 128))])) : g("", !0)], 2)], 14, Xi))), 128)),
			w("td", ma, [G(o).length ? (m(), n("button", {
				key: 0,
				type: "button",
				class: "resource-row-menu-toggle",
				"aria-expanded": W.value === P(B)(o),
				title: e.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: D((e) => {
					t.$emit("focus", o), re(P(B)(o));
				}, ["stop"])
			}, [...a[5] ||= [w("span", {
				class: "fas fa-ellipsis-h",
				"aria-hidden": "true"
			}, null, -1)]], 8, ha)) : g("", !0), W.value === P(B)(o) ? (m(), n("div", {
				key: 1,
				class: "resource-item-menu resource-row-menu",
				onClick: a[3] ||= D(() => {}, ["stop"])
			}, [w("strong", null, x(o.title), 1), (m(!0), n(C, null, i(G(o), (r) => (m(), n("button", {
				key: r.id,
				type: "button",
				class: c([`resource-action-${r.id}`, {
					"resource-default-action": r.isDefault,
					"resource-modified-action": r.isModified
				}]),
				title: r.isDefault ? e.t("COM_SMARTBROWSER_DOUBLE_CLICK") : r.isModified ? e.t("COM_SMARTBROWSER_CTRL_DOUBLE_CLICK") : void 0,
				disabled: !e.actionAvailable(r, [o]),
				onClick: (e) => {
					W.value = null, t.$emit("action", r, o);
				}
			}, [_(Sn, { icon: r.icon }, null, 8, ["icon"]), I(" " + x(e.t(r.label)), 1)], 10, ga))), 128))])) : g("", !0)])
		], 42, Gi))), 128))])])]));
	}
};
//#endregion
//#region resources/js/services/ResourceApi.js
function va(e, t = 0, n = (e) => e) {
	let r = e?.messages && typeof e.messages == "object" ? Object.values(e.messages).flat() : [], i = [...new Set([e?.message, ...r].filter((e) => typeof e == "string" && e.trim()).map((e) => e.trim()))];
	return i.length ? i.join("; ") : t === 413 ? n("COM_SMARTBROWSER_ERROR_REQUEST_TOO_LARGE") : t ? n("COM_SMARTBROWSER_ERROR_REQUEST_HTTP").replace("%s", String(t)) : n("COM_SMARTBROWSER_ERROR_REQUEST_NETWORK");
}
var ya = class {
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
						let e = Error(va(t, Number(t.code) || 0, (e) => Joomla.Text?._(e, e) || e));
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
					let n = va(t, Number(e.status) || 0, (e) => Joomla.Text?._(e, e) || e), r = Error(n);
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
}, ba = /^[a-zA-Z][a-zA-Z0-9_.-]*$/, xa = (e, t) => Object.prototype.hasOwnProperty.call(e, t), Sa = /* @__PURE__ */ new Set(["ext.selectionAddress"]), Ca = (e) => encodeURIComponent(String(e)).replace(/[!'()*]/g, (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`), wa = (e) => e.map(([e, t]) => `${Ca(e)}=${Ca(t)}`).join("&"), Ta = (e) => {
	if (/%(?![a-fA-F0-9]{2})/.test(e)) throw TypeError("Invalid address percent encoding.");
	let t = [...new URLSearchParams(e)];
	if (t.some(([e]) => !e || /[\u0000-\u001f\u007f]/.test(e))) throw TypeError("Invalid address properties.");
	return t;
};
function Ea(e, t = !1) {
	if (typeof e != "string" || !t && !e || /[\u0000-\u0020\u007f<>"\\]/.test(e) || /%(?![a-fA-F0-9]{2})/.test(e) || /[\u0000-\u001f\u007f]/.test(decodeURIComponent(e)) || /^[^/?#]*:/.test(e) && !/^(?:https?:\/\/|mailto:|tel:)/i.test(e) || e.startsWith("//")) throw TypeError("Unsafe resource URL.");
	if (/^https?:/i.test(e)) {
		let t = new URL(e);
		if (!t.hostname || t.username || t.password) throw TypeError("Unsafe resource URL.");
	}
	return e;
}
function Da(e) {
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
function Oa(e) {
	let t = /^([a-zA-Z0-9_.-]+):(\/.*)$/.exec(e.id || "");
	if (!t) throw TypeError("Invalid media reference.");
	let n = t[1] + t[2].split("/").map(Ca).join("/");
	return Da(n), n;
}
function ka() {
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
		if (!ba.test(t) || e.has(t)) throw TypeError(`Address registration conflict: ${t}`);
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
					url: Ea(n),
					locator: "",
					properties: [],
					plain: !0
				};
			}
			let a = Ea(n.slice(0, i.index), !0), o = n.slice(i.index + i[0].length), s = o.indexOf("?"), c = s < 0 ? o : o.slice(0, s);
			if (/[#\s\\]/.test(c) || /%(?![a-fA-F0-9]{2})/.test(c)) throw TypeError("Invalid address locator.");
			return {
				format: i[1],
				url: a,
				locator: c,
				properties: s < 0 ? [] : Ta(o.slice(s + 1))
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
			Ea(n, t !== "joomlaLink");
			let a = `${n}#${t}://${r}${i.length ? `?${wa(i)}` : ""}`;
			return s.parse(a), a;
		},
		reference(t, n = {}) {
			if (!e.has(t.format)) throw TypeError("Unsupported address format.");
			return e.get(t.format).reference(t, n);
		},
		assertResource(t, n) {
			if (e.get(t.format)?.validate?.(n, t) === !1) throw TypeError("Resource does not support this address format.");
		},
		describe(t, { format: n, nativeAddress: r } = {}) {
			let i = t.selectionAddress || e.get(n || Na(t))?.describe?.(t);
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
				if (e.format !== "joomlaImage" || Da(e.locator).id !== t.id) throw TypeError("Native image identity does not match selection.");
				i = e;
			}
			return i;
		},
		descriptors(t, r = {}, i = Na(t)) {
			let a = [], o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), c = e.get(i)?.propertyNames || [];
			for (let e of [...t.selectionCapabilities || [], ...n.values()]) {
				if (r[e.key] === !1 || !xa(r, e.key) && !e.key?.startsWith("ext.")) continue;
				let t = typeof r[e.key] == "object" ? r[e.key] : {}, n = {
					...e.address,
					...t?.address
				}, i = n.name || e.key;
				if (!ba.test(i) || o.has(i) || s.has(e.key) || c.includes(i)) throw TypeError(`Address property conflict: ${i}`);
				o.add(i), s.add(e.key), a.push({
					...e,
					...n,
					name: i
				});
			}
			return a;
		},
		async encodeProperties(e, n, r, i = {}) {
			let a = s.descriptors(e, n, i.format).filter((e) => !(i.addressConsumed && e.key === "ext.address")), o = r["ext.selectionAddress"] || {}, c = [...o.properties || []], l = /* @__PURE__ */ new Set([...a.flatMap((e) => [e.name, e.name.split(".")[0]]), ...c.map(([e]) => e.split(".")[0])]);
			for (let e of Object.keys(r)) if (!(Sa.has(e) || i.addressConsumed && e === "ext.address" || a.some((t) => t.key === e) || r[e] == null)) {
				if (typeof r[e] == "object") throw TypeError(`No address codec for property: ${e}`);
				if (!e.startsWith("ext.")) throw TypeError(`Unsupported address property: ${e}`);
				if (l.has(e)) throw TypeError(`Address property conflict: ${e}`);
				l.add(e), c.push([e, ja(r[e])]);
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
					c.push([e.name, e.values?.[String(n)] ?? ja(n)]);
					continue;
				}
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
					o[n.key] = Ma(d, n);
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
		reference: (e) => Da(e.locator),
		validate: (t, n) => e === "joomlaImage" ? t.type === "image" : e === "joomlaFolder" ? t.kind === "node" : e === "joomlaFile" ? t.kind === "item" : ["audio", "video"].includes(t.type) && n.properties.filter(([e]) => e === "mediaType").length <= 1 && !n.properties.some(([e, n]) => e === "mediaType" && n !== t.type),
		describe(t) {
			let n = t.metadata || {}, r = [];
			if (e === "joomlaImage") for (let e of ["width", "height"]) Number(n[e]) > 0 && r.push([e, String(n[e])]);
			return e === "joomlaMedia" && r.push(["mediaType", t.type]), {
				format: e,
				locator: Oa(t.selection || t),
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
			return t.linkReference(Ea(e.url));
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
			if (typeof e == "string" ? n = s.parse(e) : t.preserved && (n = s.parse(t.preserved), Da(n.locator).id !== e.id && (n = null)), !n) {
				let r = await t.resolveReference(e, t.definition.picker || {});
				if (!r || r.unavailable || r.selectable === !1 || r.type !== "image") throw TypeError("Unavailable compound image.");
				n = s.describe(r, { format: "joomlaImage" });
			}
			if (n.format !== "joomlaImage" || !n.url) throw TypeError("A Joomla image requires src and media components.");
			return Da(n.locator), [
				["src", n.url],
				["media", n.locator],
				...n.properties.map(([e, t]) => [Aa.has(e) ? e : `param.${e}`, t])
			];
		},
		async decode(e, t) {
			let n = /* @__PURE__ */ new Map(), r = [];
			for (let [t, i] of e) if (["src", "media"].includes(t)) {
				if (n.has(t)) throw TypeError("Duplicate compound image component.");
				n.set(t, i);
			} else if (Aa.has(t)) r.push([t, i]);
			else if (t.startsWith("param.") && t.length > 6) r.push([t.slice(6), i]);
			else throw TypeError(`Unknown image component: ${t}`);
			if (!n.get("src") || !n.get("media")) throw TypeError("Missing compound image src or media.");
			let i = Da(n.get("media")), a = s.serialize({
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
var Aa = /* @__PURE__ */ new Set([
	"width",
	"height",
	"crop",
	"ratio",
	"zoom"
]), ja = (e) => {
	if (typeof e == "string" || typeof e == "boolean" || typeof e == "number" && Number.isFinite(e)) return String(e);
	throw TypeError("A structured property requires a registered address codec.");
}, Ma = (e, t) => {
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
}, Na = (e) => e.type === "image" ? "joomlaImage" : e.type === "folder" ? "joomlaFolder" : ["audio", "video"].includes(e.type) ? "joomlaMedia" : e.adapter === "media" || e.type === "document" ? "joomlaFile" : e.type === "uri" || e.adapter === "direct-links" ? "joomlaLink" : e.type === "gallery" ? "joomlaGallery" : "joomlaItem", Pa = ka();
//#endregion
//#region resources/js/services/SelectionAddressService.js
function Fa({ model: e, api: t, config: n, service: r, isDisposed: i = () => !1 }) {
	return {
		async exportAddresses({ selectionIds: t, ...i } = {}) {
			await e.refresh();
			let a = t === void 0 ? null : new Set(t), o = e.getItems().filter((e) => !a || a.has(e.selection ? V(e.selection) : String(e)));
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
			let u = new Set(e.getItems().map((e) => V(e.selection)));
			if (l.resources.some((e) => !u.has(e.selectionKey || V(e.selection || {
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
function Ia({ api: e, config: t, contract: n = t.addressContract || Pa }) {
	let r = !e;
	e ||= new ya({
		...t,
		mode: "select"
	});
	let i = /* @__PURE__ */ new Map(), a = t.selectionProfile || {}, o = {
		...t,
		allowedAdapters: t.allowedAdapters || (t.adapter ? [t.adapter] : []),
		maxSelections: t.multiple === !1 ? 1 : t.maxSelections || 500
	}, s = (e, n = {}) => {
		let r = n.browseRoot ?? (e.adapter === t.adapter ? t.browseRoot : ""), a = JSON.stringify([e.adapter, r]);
		return i.has(a) || i.set(a, new ya({
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
			let i = new Map(n.map((e) => [e.selectionKey || V(e.selection || {
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
				}, o = i.get(V(e.selection));
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
				te([{ selection: r }], o);
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
					initialUsage: { [V(r)]: d },
					resolveReference: c,
					editors: globalThis.SmartBrowserPicker?.extensions?.().editors || {}
				}), _ = {
					...i,
					selectionKey: V(r)
				}, v = await g.validate([_]);
				if (!v.valid) throw TypeError(`Invalid selection properties: ${Object.keys(v.errors[V(r)] || {}).join(", ")}`);
				f.push({
					selection: r,
					usage: {
						...d,
						...v.usage[V(r)]
					}
				}), p.push(_);
			} catch (t) {
				m.push(`Line ${e.line}: ${t.message}`);
			}
			if (m.length) throw TypeError(m.join("\n"));
			let h = te(u ? [...i, ...f] : f, o), g = te(f, o), _ = g.map((e) => d[f.findIndex((t) => V(t.selection) === V(e.selection))]?.line), v = await e.collection(g, {
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
var La = ["aria-label", "aria-busy"], Ra = { class: "resource-browser" }, za = {
	key: 0,
	class: "alert alert-danger",
	role: "alert"
}, Ba = {
	key: 0,
	class: "sb-collection-count"
}, Va = ["aria-expanded"], Ha = { class: "sb-selected-list" }, Ua = { class: "resource-toolbar sb-collection-toolbar" }, Wa = ["disabled", "aria-label"], Ga = [
	"disabled",
	"title",
	"aria-label"
], Ka = [
	"disabled",
	"title",
	"aria-label"
], qa = [
	"disabled",
	"title",
	"aria-label"
], Ja = [
	"disabled",
	"title",
	"aria-label"
], Ya = [
	"disabled",
	"title",
	"aria-label"
], Xa = [
	"disabled",
	"title",
	"aria-label"
], Za = [
	"title",
	"aria-label",
	"aria-pressed",
	"onClick"
], Qa = [
	"data-info-state",
	"aria-pressed",
	"title",
	"aria-label"
], $a = ["disabled", "aria-label"], eo = { class: "sb-selected-content" }, to = {
	key: 0,
	class: "resource-empty-state sb-selection-empty",
	role: "status"
}, no = ["disabled"], ro = {
	key: 0,
	class: "sb-selected-panel"
}, io = {
	key: 0,
	class: "sb-selection-gallery-nav"
}, ao = ["disabled", "aria-label"], oo = {
	key: 0,
	"aria-hidden": "true"
}, so = ["disabled", "aria-label"], co = {
	key: 0,
	"aria-hidden": "true"
}, lo = ["aria-label", "aria-valuenow"], uo = {
	key: 3,
	class: "text-danger sb-address-error",
	role: "alert"
}, fo = {
	key: 1,
	class: "sb-collection-count"
}, po = ["aria-label"], mo = { class: "sb-address-dialog-body" }, ho = ["disabled"], go = {
	key: 0,
	class: "sb-address-append"
}, _o = ["disabled"], vo = {
	key: 1,
	class: "text-danger sb-address-error",
	role: "alert"
}, yo = { class: "sb-address-dialog-actions" }, bo = ["disabled"], xo = ["disabled"], So = {
	__name: "CollectionView",
	props: {
		model: Object,
		api: Object,
		config: Object,
		t: Function
	},
	setup(e) {
		let r = e, s = r.model.browser.state, l = !1, f = 0, p = r.config.addressService || Ia({
			api: r.api,
			config: r.config
		}), v = r.config.importAddresses ? r.config : Fa({
			model: r.model,
			api: r.api,
			config: r.config,
			service: p,
			isDisposed: () => l
		}), b = a({}), E = a({}), A = a(0), M = p.contract.subscribe(() => {
			A.value++;
		}), ee = `sb-address-${h()}`, z = a(null), te = a(""), H = a(""), W = a(!1), re = a(r.config.multiple !== !1);
		function G() {
			te.value = "", H.value = "", z.value.showModal();
		}
		async function K() {
			if (!W.value) {
				W.value = !0, H.value = "";
				try {
					await v.importAddresses(te.value, { append: re.value }), z.value.close();
				} catch (e) {
					H.value = e.message;
				} finally {
					W.value = !1;
				}
			}
		}
		async function q(e = yt.value) {
			if (e.length) try {
				await navigator.clipboard.writeText(await v.exportAddresses({ selectionIds: [...e] }));
			} catch (e) {
				s.error = e.message || r.t("COM_SMARTBROWSER_COPY_FAILED");
			}
		}
		k(() => {
			l = !0, f++, M(), r.config.addressService || p.destroy();
		});
		let J = R(() => r.config.selectedResources && r.config.informationPanel !== !1), Y = `${r.config.viewPreferenceKey || "supjx.smartbrowser.collection.view"}.${r.config.multiple === !1 ? "single" : "multiple"}-layout`, X = {};
		try {
			X = JSON.parse(U().getItem(Y) || "{}") || {};
		} catch {}
		let Z = a(!J.value || X.listOpen === !0), ie = a([
			"side",
			"vertical",
			"hidden"
		].includes(X.infoState) ? X.infoState : r.config.informationPanelOpen === !1 ? "hidden" : X.sideInfo === !0 ? "side" : "vertical");
		function ae() {
			ie.value = {
				hidden: "side",
				side: "vertical",
				vertical: "hidden"
			}[ie.value];
		}
		function oe() {
			Z.value ? (Z.value = !1, ie.value === "hidden" && (ie.value = "vertical")) : (Z.value = !0, ie.value = "hidden");
		}
		t(Z, (e) => {
			J.value && !e && (ie.value = "vertical");
		}, { immediate: !0 }), t(() => [
			Z.value,
			ie.value,
			s.sortBy,
			s.sortDirection,
			s.hiddenColumns,
			s.shownColumns
		], () => {
			if (J.value || r.config.selectedResources) try {
				let e = JSON.parse(U().getItem(Y) || "{}") || {};
				U().setItem(Y, JSON.stringify({
					...e,
					...J.value ? {
						listOpen: Z.value,
						infoState: ie.value
					} : {},
					sortBy: s.sortBy,
					sortDirection: s.sortDirection,
					hiddenColumns: s.hiddenColumns,
					shownColumns: s.shownColumns
				}));
			} catch {}
		}, { deep: !0 });
		let se = R(() => !r.config.readOnly && typeof r.config.onAdd == "function"), ce = a(!1), le = R(() => (r.model.revision?.value, ar(r.config, r.model.getItems().length) && !ce.value && !s.loading && !s.busy));
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
		s.sortBy = r.config.selectedResources && ["collectionOrder", ...nr.map((e) => e.id)].includes(X.sortBy) ? X.sortBy : "collectionOrder", s.sortDirection = X.sortDirection === "desc" ? "desc" : "asc", t(() => s.sortBy, (e) => {
			r.config.allowOrdering === !1 && e === "collectionOrder" && (s.sortBy = "title");
		}, {
			immediate: !0,
			flush: "sync"
		}), s.hiddenColumns = Array.isArray(X.hiddenColumns) ? X.hiddenColumns : [], s.shownColumns = Array.isArray(X.shownColumns) ? X.shownColumns : [], s.viewOptions.gridSize = r.config.gridSize || "md", s.viewOptions.detailsThumbnails = r.config.thumbnails !== !1;
		let de = new ne(r.api, s, () => r.model.refresh(), r.t, r.config.editorMode || "modal", r.config.application), fe = /* @__PURE__ */ new Map(), pe = (e) => {
			if (!e.adapter) return de;
			if (!fe.has(e.adapter)) {
				let t = new ya({
					...r.config,
					adapter: e.adapter,
					mode: r.config.readOnly ? "readonly" : "manage"
				});
				fe.set(e.adapter, {
					api: t,
					driver: new ne(t, s, () => r.model.refresh(), r.t, r.config.editorMode || "modal", r.config.application)
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
		], he = R(() => r.config.selectedResources && r.config.multiple !== !1 && r.model.canOrder && s.sortBy === "collectionOrder" ? [
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
		] : []), ge = R(() => [
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
			...r.config.contextActions === !0 && !r.config.readOnly ? s.actions.filter((e) => (r.config.contextActionIds || me).includes(e.id)) : []
		]), _e = R(() => ge.value.find((e) => e.id === "collectionReplace")), ve = R(() => !J.value || Z.value ? [] : [
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
		]), ye = R(() => $.value?.collectionActions?.find((e) => e.id === "preview" && pe($.value).available(e, [$.value])) || Te($.value)), be = (e) => e.id === "collectionReplace" || (r.config.resourceActions || []).some((t) => t.id === e.id), xe = (e, t) => t.collectionActions?.find((t) => t.id === e.id) || e, Se = (e) => yt.value.includes(B(e)) ? yt.value : [B(e)], Ce = (e, t) => {
			if (s.loading || s.busy) return !1;
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
				return Q.value.some((e, t) => n.has(B(e)) && Q.value[t + r] && !n.has(B(Q.value[t + r])));
			}
			return e.id === "collectionRemove" ? r.model.canRemove : be(e) ? !r.config.readOnly : !t.some((e) => e.unavailable) && t.every((t) => (!t.collectionActions || t.collectionActions.some((t) => t.id === e.id)) && pe(t).available(xe(e, t), [t]));
		}, we = (e) => ge.value.find((t) => t.id === r.config.defaultResourceActionId && Ce(t, [e])) || (r.config.contextActions === !0 && !r.config.readOnly ? gi({
			...e,
			activatable: !e.unavailable
		}, "manage", ge.value, Ce) : null), Te = (e) => r.config.contextActions === !0 && !r.config.readOnly ? mi(e, "manage", ge.value, Ce) : null;
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
				if (e?.id === "collectionCopy") return q(Se(t));
				if (e?.id === "collectionImport") return G();
				if (["collectionMoveUp", "collectionMoveDown"].includes(e?.id)) return !t || e.disabled ? void 0 : r.model.move(e.id === "collectionMoveUp" ? "up" : "down", Se(t));
				if (t && Ce(e, [t])) {
					if (e.id === "collectionRemove") return r.model.remove(yt.value.includes(B(t)) ? yt.value : [B(t)]);
					try {
						await (e.id === "collectionReplace" ? r.config.onReplace(t) : be(e) ? r.config.onResourceAction?.(e, t) : pe(t).execute(xe(e, t), [t]));
					} catch (e) {
						r.config.onError?.(e);
					}
				}
			}
		}
		let De = R(() => r.config.selectedResources ? nr : (s.presentation.sortFields || [{
			id: "title",
			label: "COM_SMARTBROWSER_NAME"
		}]).filter((e) => !["ordering", "collectionOrder"].includes(e.id))), Oe = R(() => r.config.selectedResources ? tr : s.presentation.columns || [{
			id: "title",
			label: "COM_SMARTBROWSER_NAME"
		}]), ke = R(() => Oe.value.filter((e) => e.id === "title" || (e.defaultVisible === !1 ? s.shownColumns.includes(e.id) : !s.hiddenColumns.includes(e.id)))), Ae = (e) => {
			let t = Oe.value.find((t) => t.id === e);
			if (!t || e === "title") return;
			let n = t.defaultVisible === !1 ? "shownColumns" : "hiddenColumns";
			s[n] = s[n].includes(e) ? s[n].filter((t) => t !== e) : [...s[n], e];
		}, je = a(null);
		function Me({ payload: e, resolve: t, reject: n }) {
			try {
				if (!e.sort || s.sortBy !== "collectionOrder" || !De.value.some((t) => t.id === e.sort.field) || !["asc", "desc"].includes(e.sort.direction)) throw Error("Invalid collection sorting state.");
				r.model.reorderItems(rr(Q.value, e.sort.field, e.sort.direction).map(B)), s.sortDirection = "asc", t();
			} catch (e) {
				n(e);
			}
		}
		let Ne = (e) => {
			s.sortBy === e ? s.sortDirection = s.sortDirection === "asc" ? "desc" : "asc" : (s.sortBy = e, s.sortDirection = "asc");
		}, Pe = [{
			id: "grid",
			label: "COM_SMARTBROWSER_GRID",
			icon: "fas fa-th"
		}, {
			id: "details",
			label: "COM_SMARTBROWSER_DETAILS",
			icon: "fas fa-list"
		}], Fe = R(() => r.model.browser.bulkSelectableResources.value.length > 0 && r.model.browser.bulkSelectableResources.value.every((e) => s.selectedIds.includes(B(e)))), Ie = a(null), Le = a(0), Re = a(null), ze = a(!1), Be = a(!1), Ve = a(!1), He = a(null), Ue = a(null), We = a(null), Ge = R(() => Je.value && Qe.value && !$.value && Ue.value ? Ue.value : !Z.value && We.value ? We.value : He.value);
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
		let Je = R(() => J.value && !Z.value || ie.value !== "hidden"), Ye = R(() => r.config.informationPanelVerticalPosition || (["top", "bottom"].includes(r.config.informationPanelPosition) ? r.config.informationPanelPosition : "top")), Xe = R(() => r.config.informationPanelHorizontalPosition || (["left", "right"].includes(r.config.informationPanelPosition) ? r.config.informationPanelPosition : "right")), Ze = R(() => J.value ? Z.value ? ie.value === "side" && Le.value >= 640 ? Xe.value : Ye.value : "top" : or(r.config.informationPanelPosition, Le.value)), Qe = R(() => ["top", "bottom"].includes(Ze.value)), $e = a(0), et = R(() => $e.value && Je.value && ["left", "right"].includes(Ze.value) ? { gridTemplateColumns: Ze.value === "left" ? `${tt($e.value)}px minmax(0, 1fr)` : `minmax(0, 1fr) ${tt($e.value)}px` } : void 0), tt = (e) => Math.max(200, Math.min(e, Le.value - 200)), nt;
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
		let st = R(() => r.config.readOnly ? "readonly" : r.config.selectionUseData || "readonly"), ct = window.SmartBrowserPicker?.extensions?.() || {
			editors: {},
			previewActions: []
		}, lt = a(ct.previewActions), ut = window.SmartBrowserPicker?.subscribePreviewActions?.((e) => {
			lt.value = e;
		});
		k(() => ut?.());
		let dt = /* @__PURE__ */ new Map();
		async function ft(e, t = {}) {
			let n = JSON.stringify([e.adapter, t.browseRoot || ""]);
			return dt.has(n) || dt.set(n, new ya({
				...r.config,
				adapter: e.adapter,
				mode: "select",
				browseRoot: t.browseRoot || null,
				flatScope: null
			})), (await dt.get(n).collection([e.id])).resources[0];
		}
		let pt = (e) => (r.model.revision?.value, r.model.getItems().find((t) => t.selection && V(t.selection) === B(e))?.usage || {}), mt = R(() => (r.model.revision?.value, ln({
			profile: r.config.selectionProfile || {},
			initialUsage: Object.fromEntries(r.model.resources.value.map((e) => [B(e), pt(e)])),
			editors: ct.editors,
			resolveReference: ft
		}))), ht = a({}), gt = a({}), Q = R(() => {
			let e = r.model.resources.value.map((e) => {
				let t = Ut(e, pt(e)), n = gt.value[B(e)];
				return r.config.selectedResources ? {
					...Qn({
						...t,
						effectiveThumbnail: ht.value[B(e)],
						effectiveThumbnailResource: n,
						imageCrop: n?.imageCrop || e.imageCrop
					}, s.presentation),
					selectionPath: b.value[B(e)] || (E.value[B(e)] ? r.t("COM_SMARTBROWSER_ADDRESS_UNAVAILABLE") : "")
				} : t;
			});
			return r.config.selectedResources && s.sortBy !== "collectionOrder" ? rr(e, s.sortBy, s.sortDirection) : e;
		});
		t(() => [
			r.model.resources.value,
			r.model.revision?.value,
			r.config.nativeAddress,
			r.config.selectionProfile,
			A.value
		], async () => {
			let e = ++f, t = {}, n = {};
			for (let e of r.model.resources.value) {
				let i = B(e), a = r.model.getItems().find((e) => e.selection && V(e.selection) === i) || {
					selection: e.selection || {
						adapter: e.adapter || r.config.adapter,
						id: e.id
					},
					usage: {}
				};
				try {
					t[i] = await p.serialize(a, e, r.config.nativeImage ? { nativeAddress: r.config.nativeAddress } : {});
				} catch (e) {
					n[i] = e.message;
				}
			}
			e === f && !l && (b.value = t, E.value = n);
		}, {
			immediate: !0,
			deep: !0
		});
		let $ = R(() => Q.value.find((e) => B(e) === s.focusedId) || Q.value[0] || null), _t = R(() => Q.value.findIndex((e) => B(e) === B($.value)));
		function vt(e) {
			let t = Q.value[_t.value + e];
			t && r.model.browser.focus(t);
		}
		let yt = R(() => s.selectedIds), bt = R(() => r.config.multiple === !1 ? Q.value.map(B) : yt.value);
		t(() => r.config.multiple === !1 ? B(Q.value[0]) : null, (e) => {
			e && (s.selectedIds = [e]);
		}, { immediate: !0 });
		let xt = R(() => st.value === "hidden" ? [] : mt.value.definitions($.value).filter((e) => e.presentation !== "hidden")), St = a(0), Ct = 0, wt = R(() => (St.value, {
			...pt($.value),
			...mt.value.get($.value)
		})), Tt = a({});
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
			a === Ct && i === mt.value && (B($.value) === B(n) && (Tt.value = s.errors[B(n)] || {}), s.valid && r.model.setUsage(n, o));
		}
		let Ot = R(() => {
			let e = $.value, t = () => $n(e);
			return _i({
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
				getSelectionAddress: () => b.value[B(e)] || "",
				getDefaultAddress: t,
				resetAddress: () => {
					if (B($.value) === B(e)) return r.config.nativeImage || r.config.nativePreview ? (r.config.nativeAddress = t(), Dt("ext.address", r.config.nativeAddress)) : Dt("ext.address", null);
				},
				setAddress: (t) => {
					if (B($.value) === B(e)) return r.config.nativeAddress = String(t || ""), Dt("ext.address", r.config.nativeAddress);
				},
				isCurrent: () => B($.value) === B(e),
				setValue: (t, n) => {
					if (B($.value) === B(e)) return Dt(t, n);
				},
				refresh: () => r.model.refresh(),
				selectResource: (e) => window.SmartBrowserPicker.open(e)
			});
		}), kt = R(() => lt.value.filter((e) => {
			try {
				return $.value && (st.value === "editable" || e.allowReadOnly === !0) && (!e.applies || e.applies(Ot.value));
			} catch {
				return !1;
			}
		})), At, jt = 0;
		return t(() => [r.model.resources.value, r.model.revision?.value], async () => {
			let e = ++jt, t = {}, n = {};
			for (let e of r.model.resources.value) {
				let r = pt(e), i = Ht(mt.value.definitions(e)).find((e) => r[e.key]);
				if (i) try {
					n[B(e)] = await Yt(i, r[i.key], ft), t[B(e)] = Gt(n[B(e)]);
				} catch {}
			}
			e === jt && (ht.value = t, gt.value = n);
		}, { immediate: !0 }), d(() => {
			At = new ResizeObserver(() => {
				Le.value = Ie.value.getBoundingClientRect().width, Ke();
			}), At.observe(Ie.value), At.observe(Re.value);
		}), k(() => {
			At?.disconnect(), jt++, dt.forEach((e) => e.destroy());
		}), k(() => {
			de.destroy(), fe.forEach(({ driver: e, api: t }) => {
				e.destroy(), t.destroy();
			});
		}), (t, r) => (m(), n("section", {
			ref_key: "control",
			ref: Ie,
			class: c(["smartbrowser smartbrowser-collection", {
				"is-compact": e.config.layout === "compact",
				"is-selected-resources": e.config.selectedResources,
				"is-single-selection": J.value && ["top", "bottom"].includes(Ze.value)
			}]),
			"aria-label": e.t("COM_SMARTBROWSER_COLLECTION_TITLE"),
			"aria-busy": P(s).loading || P(s).busy
		}, [
			w("div", Ra, [
				P(s).error ? (m(), n("p", za, x(P(s).error), 1)) : g("", !0),
				w("div", {
					class: c(["sb-selected-layout", [`panel-${Ze.value}`, {
						"panel-open": Je.value && e.config.informationPanel !== !1,
						"is-collapsed": J.value && !Z.value
					}]]),
					style: S(Z.value ? et.value : void 0)
				}, [w("div", { class: c(["sb-selected-items", `view-${P(s).activeView}`]) }, [J.value ? (m(), n("div", Ba, [w("button", {
					type: "button",
					class: "sb-collection-count-toggle",
					"aria-expanded": Z.value,
					onClick: oe
				}, [w("span", { class: c(Z.value ? "fas fa-chevron-up" : "fas fa-chevron-down") }, null, 2), I(x(e.t("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": " + x(e.model.getItems().length), 1)], 8, Va)])) : g("", !0), o(w("div", Ha, [w("header", Ua, [
					o(w("button", {
						class: "resource-icon-button sb-toolbar-scroll",
						type: "button",
						disabled: !Be.value,
						"aria-label": e.t("COM_SMARTBROWSER_SCROLL_BACK"),
						onClick: r[0] ||= (e) => qe(-1)
					}, [...r[19] ||= [w("span", { class: "fas fa-chevron-left" }, null, -1)]], 8, Wa), [[j, ze.value]]),
					w("div", {
						ref_key: "toolbar",
						ref: Re,
						class: "resource-view-controls",
						onScroll: Ke
					}, [
						se.value ? (m(), n("button", {
							key: 0,
							class: "resource-icon-button",
							type: "button",
							disabled: !le.value,
							title: e.t(e.config.addLabel || "COM_SMARTBROWSER_COLLECTION_ADD"),
							"aria-label": e.t(e.config.addLabel || "COM_SMARTBROWSER_COLLECTION_ADD"),
							onClick: ue
						}, [...r[20] ||= [w("span", {
							class: "fas fa-plus",
							"aria-hidden": "true"
						}, null, -1)]], 8, Ga)) : g("", !0),
						e.model.canRemove ? (m(), n("button", {
							key: 1,
							class: "resource-icon-button",
							type: "button",
							disabled: !bt.value.length || P(s).loading || P(s).busy,
							title: e.t("COM_SMARTBROWSER_COLLECTION_REMOVE"),
							"aria-label": e.t("COM_SMARTBROWSER_COLLECTION_REMOVE"),
							onClick: r[1] ||= (t) => e.model.remove(bt.value)
						}, [...r[21] ||= [w("span", {
							class: "fas fa-minus",
							"aria-hidden": "true"
						}, null, -1)]], 8, Ka)) : g("", !0),
						_e.value ? (m(), n("button", {
							key: 2,
							class: "resource-icon-button",
							type: "button",
							disabled: !$.value || !Ce(_e.value, [$.value]),
							title: e.t(_e.value.label),
							"aria-label": e.t(_e.value.label),
							onClick: r[2] ||= (e) => Ee(_e.value, $.value)
						}, [_(Sn, { icon: _e.value.icon }, null, 8, ["icon"])], 8, qa)) : g("", !0),
						e.model.canOrder && P(s).sortBy === "collectionOrder" ? (m(), L(Gr, {
							key: 3,
							enabled: !P(s).loading && !P(s).busy && P(s).selectedIds.length > 0,
							t: e.t,
							onReorder: e.model.move
						}, null, 8, [
							"enabled",
							"t",
							"onReorder"
						])) : g("", !0),
						e.config.selectedResources && e.config.multiple !== !1 && e.model.canOrder && P(s).sortBy === "collectionOrder" ? (m(), n("button", {
							key: 4,
							class: "resource-icon-button",
							type: "button",
							disabled: Q.value.length < 2 || P(s).busy || P(s).loading,
							title: e.t("COM_SMARTBROWSER_COLLECTION_SORT"),
							"aria-label": e.t("COM_SMARTBROWSER_COLLECTION_SORT"),
							onClick: r[3] ||= (e) => je.value.open()
						}, [...r[22] ||= [w("span", { class: "fas fa-sort" }, null, -1)]], 8, Ja)) : g("", !0),
						w("span", {
							ref_key: "toolbarExtraHost",
							ref: He
						}, null, 512),
						e.config.selectedResources ? (m(), n("button", {
							key: 5,
							type: "button",
							class: "resource-icon-button",
							disabled: !yt.value.length || P(s).loading || P(s).busy,
							title: e.t("COM_SMARTBROWSER_COPY_ADDRESSES"),
							"aria-label": e.t("COM_SMARTBROWSER_COPY_ADDRESSES"),
							onClick: r[4] ||= (e) => q()
						}, [...r[23] ||= [w("span", { class: "fas fa-copy" }, null, -1)]], 8, Ya)) : g("", !0),
						e.config.selectedResources && e.model.referenceItems && !e.config.readOnly ? (m(), n("button", {
							key: 6,
							type: "button",
							class: "resource-icon-button",
							disabled: P(s).loading || P(s).busy,
							title: e.t("COM_SMARTBROWSER_IMPORT_ADDRESSES"),
							"aria-label": e.t("COM_SMARTBROWSER_IMPORT_ADDRESSES"),
							onClick: G
						}, [...r[24] ||= [w("span", { class: "fas fa-paste" }, null, -1)]], 8, Xa)) : g("", !0),
						P(s).activeView === "grid" && (e.config.selectedResources || e.config.layout !== "compact") ? (m(), L(ii, {
							key: 7,
							alignment: "start",
							fields: De.value,
							"sort-by": P(s).sortBy,
							"sort-direction": P(s).sortDirection,
							"default-value": e.config.allowOrdering === !1 ? null : "collectionOrder",
							"default-label": "JGRID_HEADING_ORDERING",
							t: e.t,
							onSortBy: r[5] ||= (e) => {
								P(s).sortBy = e, P(s).sortDirection = "asc";
							},
							onSortDirectionValue: r[6] ||= (e) => P(s).sortDirection = e
						}, null, 8, [
							"fields",
							"sort-by",
							"sort-direction",
							"default-value",
							"t"
						])) : g("", !0),
						e.config.selectedResources && P(s).activeView === "details" ? (m(), L(Qr, {
							key: 8,
							columns: Oe.value,
							"hidden-columns": P(s).hiddenColumns,
							"shown-columns": P(s).shownColumns,
							t: e.t,
							onToggleColumn: Ae
						}, null, 8, [
							"columns",
							"hidden-columns",
							"shown-columns",
							"t"
						])) : g("", !0),
						(m(), n(C, null, i(Pe, (t) => w("button", {
							key: t.id,
							class: c(["resource-icon-button", { active: P(s).activeView === t.id }]),
							type: "button",
							title: e.t(t.label),
							"aria-label": e.t(t.label),
							"aria-pressed": P(s).activeView === t.id,
							onClick: (e) => P(s).activeView = t.id
						}, [w("span", {
							class: c(t.icon),
							"aria-hidden": "true"
						}, null, 2)], 10, Za)), 64)),
						e.config.informationPanel !== !1 && e.config.selectedResources ? (m(), n("button", {
							key: 9,
							class: c(["resource-icon-button", {
								active: ie.value === "side",
								"info-vertical": ie.value === "vertical"
							}]),
							type: "button",
							"data-info-state": ie.value,
							"aria-pressed": Je.value,
							title: e.t("COM_SMARTBROWSER_USAGE_INFO"),
							"aria-label": e.t("COM_SMARTBROWSER_USAGE_INFO"),
							onClick: ae
						}, [...r[25] ||= [w("span", {
							class: "fas fa-info-circle",
							"aria-hidden": "true"
						}, null, -1)]], 10, Qa)) : g("", !0)
					], 544),
					o(w("button", {
						class: "resource-icon-button sb-toolbar-scroll",
						type: "button",
						disabled: !Ve.value,
						"aria-label": e.t("COM_SMARTBROWSER_SCROLL_FORWARD"),
						onClick: r[7] ||= (e) => qe(1)
					}, [...r[26] ||= [w("span", { class: "fas fa-chevron-right" }, null, -1)]], 8, $a), [[j, ze.value]])
				]), w("div", eo, [e.model.resources.value.length ? (m(), L(u(P(s).activeView === "details" ? _a : Fi), {
					key: 1,
					resources: Q.value,
					"selected-ids": yt.value,
					"focused-id": P(s).focusedId,
					"all-selected": Fe.value,
					"selection-controls": e.config.multiple !== !1,
					options: P(s).viewOptions,
					actions: ge.value,
					"action-available": Ce,
					"default-action": we,
					"preview-action": Te,
					"grid-fields": e.config.selectedResources ? [...P(s).presentation.gridFields || [], ...ke.value.filter((e) => e.defaultVisible === !1)] : P(s).presentation.gridFields || [],
					columns: ke.value,
					"sort-by": P(s).sortBy,
					"sort-direction": P(s).sortDirection,
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
				])) : (m(), n("div", to, [w("span", null, x(e.t(P(s).loading ? "COM_SMARTBROWSER_LOADING" : "COM_SMARTBROWSER_COLLECTION_EMPTY")), 1), se.value && (!Je.value || !Qe.value) ? (m(), n("button", {
					key: 0,
					type: "button",
					class: "btn btn-outline-secondary",
					disabled: !le.value,
					onClick: ue
				}, [r[27] ||= w("span", { class: "fas fa-plus" }, null, -1), I(" " + x(e.t("COM_SMARTBROWSER_SELECT_RESOURCE")), 1)], 8, no)) : g("", !0)]))])], 512), [[j, !J.value || Z.value]])], 2), e.config.selectedResources && e.config.informationPanel !== !1 ? o((m(), n("div", ro, [
					e.config.multiple !== !1 && ["top", "bottom"].includes(Ze.value) && Q.value.length > 1 ? (m(), n("div", io, [w("button", {
						type: "button",
						class: "resource-icon-button",
						disabled: _t.value <= 0,
						"aria-label": e.t("COM_SMARTBROWSER_PREVIOUS_RESOURCE"),
						onClick: r[8] ||= (e) => vt(-1)
					}, [r[28] ||= w("span", { class: "fas fa-chevron-left" }, null, -1), _t.value > 0 ? (m(), n("small", oo, x(_t.value), 1)) : g("", !0)], 8, ao), w("button", {
						type: "button",
						class: "resource-icon-button",
						disabled: _t.value >= Q.value.length - 1,
						"aria-label": e.t("COM_SMARTBROWSER_NEXT_RESOURCE"),
						onClick: r[9] ||= (e) => vt(1)
					}, [_t.value < Q.value.length - 1 ? (m(), n("small", co, x(_t.value + 2), 1)) : g("", !0), r[29] ||= w("span", { class: "fas fa-chevron-right" }, null, -1)], 8, so)])) : g("", !0),
					Z.value && ["left", "right"].includes(Ze.value) ? (m(), n("div", {
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
						onKeydown: [r[10] ||= O(D((e) => ot(-16), ["prevent"]), ["left"]), r[11] ||= O(D((e) => ot(16), ["prevent"]), ["right"])],
						onDblclick: r[12] ||= (e) => $e.value = 0
					}, null, 40, lo)) : g("", !0),
					e.config.selectedResources && e.config.informationPanel !== !1 ? o((m(), L(Vr, {
						key: 2,
						"selection-only": "",
						resource: $.value,
						fields: P(s).presentation.infoFields,
						t: e.t,
						address: b.value[P(B)($.value)] || "",
						"usage-mode": st.value,
						"usage-definitions": xt.value,
						"usage-values": wt.value,
						"usage-errors": Tt.value,
						"usage-editors": P(ct).editors,
						"resolve-reference": ft,
						"preview-actions": kt.value,
						"selection-actions": ve.value,
						"allow-add": se.value && Qe.value,
						"allow-quick-add": se.value && Qe.value && !Z.value,
						"add-disabled": !le.value,
						"can-preview": !!ye.value,
						"preview-context": Ot.value,
						"native-preview": e.config.nativePreview,
						onSelectionAdd: ue,
						onSelectionAction: r[13] ||= (e) => Ee(e, $.value),
						onPreview: r[14] ||= (e) => Ee(ye.value, $.value),
						onUsageChange: Dt
					}, {
						"empty-actions": y(() => [w("span", {
							ref_key: "emptyExtraHost",
							ref: Ue,
							class: "sb-preview-host-actions"
						}, null, 512)]),
						"quick-actions": y(() => [w("span", {
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
					])), [[j, Je.value]]) : g("", !0),
					$.value && E.value[P(B)($.value)] ? (m(), n("p", uo, x(E.value[P(B)($.value)]), 1)) : g("", !0)
				], 512)), [[j, Je.value]]) : g("", !0)], 6),
				e.config.showCount !== !1 && !J.value ? (m(), n("footer", fo, x(e.t("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": " + x(e.model.getItems().length), 1)) : g("", !0),
				(m(), L(F, {
					to: Ge.value || "body",
					disabled: !Ge.value
				}, [r[30] ||= w("span", { class: "sb-collection-extra-buttons" }, null, -1)], 8, ["to", "disabled"]))
			]),
			e.config.selectedResources && e.model.canOrder && e.config.multiple !== !1 ? (m(), L(Lt, {
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
			])) : g("", !0),
			w("dialog", {
				ref_key: "addressDialog",
				ref: z,
				class: "resource-batch-preview-dialog sb-address-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_IMPORT_ADDRESSES"),
				onCancel: r[18] ||= D((e) => !W.value && z.value.close(), ["prevent"])
			}, [w("div", mo, [
				w("label", {
					for: ee,
					class: "form-label"
				}, x(e.t("COM_SMARTBROWSER_IMPORT_ADDRESSES")), 1),
				o(w("textarea", {
					id: ee,
					"onUpdate:modelValue": r[15] ||= (e) => te.value = e,
					class: "form-control",
					rows: "7",
					maxlength: "4194304",
					disabled: W.value
				}, null, 8, ho), [[N, te.value]]),
				e.config.multiple === !1 ? g("", !0) : (m(), n("label", go, [o(w("input", {
					"onUpdate:modelValue": r[16] ||= (e) => re.value = e,
					type: "checkbox",
					disabled: W.value
				}, null, 8, _o), [[T, re.value]]), I(" " + x(e.t("COM_SMARTBROWSER_ADDRESS_APPEND")), 1)])),
				H.value ? (m(), n("p", vo, x(H.value), 1)) : g("", !0),
				w("div", yo, [w("button", {
					type: "button",
					class: "btn btn-primary",
					disabled: W.value,
					onClick: K
				}, x(e.t("COM_SMARTBROWSER_IMPORT")), 9, bo), w("button", {
					type: "button",
					class: "btn btn-secondary",
					disabled: W.value,
					onClick: r[17] ||= (e) => z.value.close()
				}, x(e.t("JCANCEL")), 9, xo)])
			])], 40, po)
		], 10, La));
	}
}, Co = (e, t) => (n, r) => {
	if (e === "ordering" && n.type === "article" && r.type === "article" && n.parentId !== r.parentId && n.metadata?.locationPath && r.metadata?.locationPath) {
		let e = n.metadata.locationPath.localeCompare(r.metadata.locationPath);
		if (e) return t === "asc" ? e : -e;
	}
	let i = (t) => e === "title" ? String(t.title || "").toLocaleLowerCase() : e === "location" ? t.metadata?.locationPath || t.metadata?.location || t.metadata?.categoryPath || t.metadata?.parentPath || t.metadata?.parent || "" : e === "ordering" ? t.metadata?.hierarchyOrder ?? t.metadata?.ordering : e === "dimension" ? (t.metadata?.width || 0) * (t.metadata?.height || 0) : t.metadata?.[e], a = i(n), o = i(r), s = typeof a == "string" ? (a || "").localeCompare(o || "") : (a || 0) - (o || 0);
	return t === "asc" ? s : -s;
};
//#endregion
//#region resources/js/core/createBrowserState.js
function wo({ options: e, api: n, persistence: r, viewRegistry: i }) {
	let a = e.pickerContext || e.selectionHost, o = !!a?.collectionMode, s = (o || e.mode === "select") && e.multiple === !1 ? 1 : a?.maxSelections ?? e.maxSelections ?? 500, c = o ? a.getCollectionSnapshot() : null, l = !!(o || e.selectionState || e.pickerContext && (Object.keys(e.pickerContext.selectionProfile || {}).length || e.pickerContext.initialSelection?.length)), u = e.adapter?.replace(/^flat-/, ""), d = (e) => o ? {
		...e,
		adapter: u,
		selection: {
			adapter: u,
			id: e.id
		},
		selectionKey: V({
			adapter: u,
			id: e.id
		})
	} : e, f = (t) => o && e.multiple && a.homogeneous && _.selectedIds.length && (_.selectedResources[_.selectedIds[0]]?.selection?.adapter || c.items.find((e) => V(e.selection) === _.selectedIds[0])?.selection.adapter) !== t.selection?.adapter, p = new Set(e.allowedResourceTypes || []), m = (t) => e.mode === "readonly" || f(t) || p.size && !p.has(t.type) ? {
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
	}, g = r.load(h);
	g.filters = {
		...g.filters || {},
		...e.initialFilters || {}
	}, Array.isArray(g.hiddenColumns) || (g.hiddenColumns = []), Array.isArray(g.shownColumns) || (g.shownColumns = []), e.currentNode && (g.selectedNode = e.currentNode), e.defaultView && (g.activeView = e.defaultView), i.has(g.activeView) || (g.activeView = "grid");
	let _ = b({
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
		selectedIds: c ? c.items.map((e) => V(e.selection)) : [],
		selectedResources: c?.resources || {},
		virtualResources: c?.virtualResources || {},
		search: "",
		loading: !1,
		busy: !1,
		error: ""
	}), v = R(() => {
		let t = _.search.trim().toLocaleLowerCase(), n = (e) => !t || [
			e.title,
			e.subtitle,
			e.metadata?.alias
		].some((e) => String(e || "").toLocaleLowerCase().includes(t)), r = _.nodes.map(d).map(si).map(m).filter(n), i = (_.presentation.selectionScoped && e.selectionState ? Object.values(_.virtualResources).filter((e) => e && (e.selection?.adapter || e.adapter || u) === u && e.parentId === _.selectedNode) : _.items).map(d).map(si).map(m).filter(n), a = _.contextItems.map(ci);
		return _.sortBy ? [
			...r.sort(Co(_.sortBy, _.sortDirection)),
			...i.sort(Co(_.sortBy, _.sortDirection)),
			...a
		] : [
			...r,
			...i,
			...a
		];
	}), y = R(() => {
		let t = e.selectionTarget || "both";
		return v.value.filter((e) => di(e, t));
	}), x = R(() => {
		let t = e.selectionTarget || "both";
		return v.value.filter((e) => fi(e, t));
	}), S = R(() => l ? _.selectedIds.map((e) => v.value.find((t) => B(t) === e) || _.selectedResources[e]).filter(Boolean) : v.value.filter((e) => _.selectedIds.includes(B(e)))), C = R(() => v.value.find((e) => B(e) === _.focusedId) || (l ? _.selectedResources[_.focusedId] : null) || null);
	async function w(t = _.selectedNode) {
		_.loading = !0, _.error = "", l || (_.selectedIds = []), _.focusedId = null;
		try {
			let r = await n.getResources(t, {
				search: _.search,
				sortBy: _.sortBy,
				sortDirection: _.sortDirection,
				filters: _.filters
			});
			if (_.selectedNode = t, _.nodes = r.nodes, _.items = r.items, r.presentation?.selectionScoped) for (let e of r.items) {
				let t = d(e);
				_.virtualResources[B(t)] = si(t);
			}
			if (l) for (let e of [...r.nodes, ...r.items]) {
				let t = d(e);
				_.selectedIds.includes(B(t)) && (_.selectedResources[B(t)] = m(si(t)));
			}
			_.contextItems = r.contextItems || [], _.breadcrumb = r.breadcrumb, _.actions = e.mode === "readonly" ? [] : r.actions, _.presentation = r.presentation || _.presentation, _.sortBy && !(_.presentation.sortFields || []).some((e) => e.id === _.sortBy) && (_.sortBy = "", _.sortDirection = ""), (_.presentation.filters || []).forEach((e) => {
				_.filters[e.id] === void 0 && (_.filters[e.id] = e.default);
			}), _.currentResource = r.currentResource || null;
			let i = new URL(window.location.href);
			i.searchParams.set("node", t), window.history.replaceState({}, "", i);
		} catch (n) {
			if (t !== e.initialNode && [403, 404].includes(n.status)) {
				_.selectedNode = e.initialNode, await w(e.initialNode);
				return;
			}
			_.error = n.message, Joomla.renderMessages({ error: [n.message] });
		} finally {
			_.loading = !1;
		}
	}
	function T(t, n = !0) {
		if (E(t), !di(t, e.selectionTarget || "both") || f(t)) return;
		let r = B(t);
		l && (_.selectedResources[r] = t);
		let i = _.selectedIds.includes(r);
		!i && e.multiple && n && _.selectedIds.length >= s || (!e.multiple || !n ? _.selectedIds = i ? [] : [r] : _.selectedIds = i ? _.selectedIds.filter((e) => e !== r) : [..._.selectedIds, r]);
	}
	function E(e) {
		ui(e) && (_.focusedId = B(e));
	}
	function D() {
		l && x.value.forEach((e) => {
			_.selectedResources[B(e)] = e;
		});
		let t = x.value.map(B);
		if (o && !e.multiple) {
			let e = t[0];
			_.selectedIds = e && !_.selectedIds.includes(e) ? [e] : [];
			return;
		}
		let n = _.selectedIds.filter((e) => !t.includes(e)).length, r = Math.min(t.length, Math.max(0, s - n)), i = r > 0 && t.filter((e) => _.selectedIds.includes(e)).length >= r;
		_.selectedIds = i ? _.selectedIds.filter((e) => !t.includes(e)) : [.../* @__PURE__ */ new Set([..._.selectedIds, ...t])].slice(0, s);
	}
	function O() {
		l && x.value.forEach((e) => {
			_.selectedResources[B(e)] = e;
		});
		let e = x.value.map(B), t = new Set(_.selectedIds);
		e.forEach((e) => t.has(e) ? t.delete(e) : t.add(e)), _.selectedIds = [...t].slice(0, s);
	}
	t(() => [
		_.selectedNode,
		_.activeView,
		_.viewOptions,
		_.hiddenColumns,
		_.shownColumns,
		_.sortBy,
		_.sortDirection,
		_.showInfo,
		_.filters
	], () => r.save(_), { deep: !0 });
	function k(t, n) {
		if (e.multiple && _.selectedIds.length >= s || !e.selectionState || e.mode === "readonly" || e.selectionTarget === "node" || p.size && !p.has(n)) return !1;
		let r = _.selectedResources[_.selectedIds[0]]?.selection?.adapter || c?.items.find((e) => V(e.selection) === _.selectedIds[0])?.selection.adapter;
		return !(e.multiple && a?.homogeneous && r && r !== t);
	}
	function A(t) {
		return !(!e.selectionState || e.mode === "readonly" || e.selectionTarget === "node" || p.size && !p.has(t));
	}
	function j(t, n = null) {
		let r = t.adapter || u, i = {
			adapter: r,
			id: t.id
		}, a = o ? V(i) : t.id, s = n ? B(n) : null;
		if (n && !_.selectedIds.includes(s) && !_.virtualResources[s]) throw Error("COM_SMARTBROWSER_LINK_SELECTION_FULL");
		if ((_.selectedIds.includes(a) || _.virtualResources[a]) && a !== s) throw Error("COM_SMARTBROWSER_LINK_DUPLICATE");
		if (t.uniquenessId) for (let e of /* @__PURE__ */ new Set([..._.selectedIds, ...Object.keys(_.virtualResources)])) {
			if (e === s) continue;
			let n = _.virtualResources[e] || _.selectedResources[e], i = n?.selection || (n ? {
				adapter: n.adapter || u,
				id: n.id
			} : c?.items.find((t) => V(t.selection) === e)?.selection);
			if (i?.adapter === r && (i.id === t.uniquenessId || i.id.startsWith(t.uniquenessId + "."))) throw Error("COM_SMARTBROWSER_LINK_DUPLICATE");
		}
		if (!n && !A(t.type)) throw Error("COM_SMARTBROWSER_LINK_SELECTION_FULL");
		let l = si({
			...t,
			adapter: r,
			...o ? {
				selection: i,
				selectionKey: a
			} : {}
		});
		return _.selectedResources[a] = l, _.virtualResources[a] = l, _.selectedIds = n ? _.selectedIds.map((e) => e === s ? a : e) : k(r, t.type) ? e.multiple ? [..._.selectedIds, a] : [a] : _.selectedIds, s && s !== a && (delete _.selectedResources[s], delete _.virtualResources[s]), _.focusedId = a, l;
	}
	function M(e) {
		for (let t of e) {
			let e = B(t);
			_.virtualResources[e] && (_.selectedIds = _.selectedIds.filter((t) => t !== e), delete _.selectedResources[e], delete _.virtualResources[e], _.focusedId === e && (_.focusedId = null));
		}
	}
	return n.options && e.selectionState && (n.options.selectionItems = () => [.../* @__PURE__ */ new Set([..._.selectedIds, ...Object.keys(_.virtualResources)])].map((e) => {
		let t = _.virtualResources[e] || _.selectedResources[e];
		return t ? {
			selection: t.selection || {
				adapter: t.adapter || u,
				id: t.id
			},
			usage: {}
		} : c?.items.find((t) => V(t.selection) === e);
	}).filter(Boolean)), {
		state: _,
		resources: v,
		selectableResources: y,
		bulkSelectableResources: x,
		selection: S,
		focusedResource: C,
		load: w,
		focus: E,
		toggle: T,
		selectAll: D,
		invertSelection: O,
		canAddSelection: k,
		canCreateSelectionResource: A,
		replaceSelectionResource: j,
		deleteVirtualResources: M
	};
}
//#endregion
//#region resources/js/core/viewRegistry.js
var To = () => {
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
}, Eo = (e) => {
	if (!Array.isArray(e)) throw TypeError("Collection items must be an array.");
	let t = e.map((e) => e && typeof e == "object" ? e.id : e);
	if (t.some((e) => !["string", "number"].includes(typeof e) || String(e) === "")) throw TypeError("Invalid collection identifier.");
	return [...new Set(t.map(String))];
};
function Do({ config: e, api: t, notify: n, translate: r }) {
	let i = e.referenceItems === !0 || !e.adapter || (e.items || []).some((e) => e?.selection || e?.adapter), o = (t) => i ? te(t, e) : Eo(t), s = (e) => i ? V(e.selection) : e, c = () => i ? JSON.parse(JSON.stringify(_)) : [..._], l = v(), u = e.viewPreferenceKey || "supjx.smartbrowser.collection.view", d;
	try {
		d = U().getItem(u);
	} catch {}
	let f = ["grid", "details"].includes(d) ? d : e.layout === "compact" ? "details" : e.layout || "grid", p = b({
		...e,
		allowedResourceTypes: [],
		roots: [],
		actions: [],
		multiple: e.multiple !== !1,
		selectionTarget: "both",
		mode: e.readOnly ? "readonly" : "manage",
		defaultView: f
	}), m = {
		load: (e) => e,
		save(e) {
			try {
				U().setItem(u, e.activeView);
			} catch {}
		}
	}, h = l.run(() => wo({
		options: p,
		api: t,
		persistence: m,
		viewRegistry: To().register({
			id: "grid",
			component: {}
		}).register({
			id: "details",
			component: {}
		})
	})), { state: g } = h, _ = o(e.items || []), y = 0, x = !1, S = a(0), C = !e.readOnly, w = C && e.allowRemove !== !1, T = C && e.allowOrdering !== !1, E = (t) => t.map((t) => ({
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
		items: c(),
		resources: [...g.items],
		reason: t
	});
	async function O() {
		if (x) return;
		let n = ++y;
		g.loading = !0, g.error = "";
		try {
			let r = await t.collection(_, i ? {
				referenceItems: !0,
				homogeneous: e.homogeneous === !0
			} : void 0);
			if (x || n !== y) return;
			let a = new Map(i ? _.map((e) => [s(e), e.usage]) : []);
			_ = i ? o(r.items).map((e) => ({
				...e,
				usage: a.get(s(e)) || e.usage
			})) : [...r.identifiers], S.value++, g.items = E(r.resources), g.actions = [...r.actions || [], ...g.items.flatMap((e) => e.collectionActions || [])].filter((e, t, n) => n.findIndex((t) => t.id === e.id) === t && e.requiresSelection && !e.currentNode && ![
				"reorder",
				"removeFromGroup",
				"batch",
				"activate",
				"select"
			].includes(e.id)), g.presentation = r.presentation || {}, p.visualSettings = r.visualSettings, p.imageBackground = r.imageBackground, g.selectedIds = g.selectedIds.filter((e) => _.some((t) => s(t) === e));
		} catch (e) {
			if (!x && n === y) throw g.error = e.message, e;
		} finally {
			!x && n === y && (g.loading = !1);
		}
	}
	async function k(e, { resolvedResources: t, reason: n } = {}) {
		if (x) throw Error("Collection is destroyed.");
		let r = o(e);
		if (t) {
			if (!C || g.busy || g.loading) throw Error("The collection cannot be changed now.");
			let e = new Map(t.map((e) => [B(e), e]));
			if (r.some((t) => !e.has(s(t)))) throw TypeError("Incomplete resolved collection.");
			++y, _ = r, S.value++, g.items = E(r.map((t) => e.get(s(t)))), g.selectedIds = [], g.error = "", g.sortBy = "collectionOrder", g.sortDirection = "asc", n && D(n);
			return;
		}
		let a = i && r.length === _.length && r.every((e, t) => s(e) === s(_[t])), c = {
			items: _,
			resources: g.items,
			selectedIds: g.selectedIds,
			sortBy: g.sortBy,
			sortDirection: g.sortDirection
		};
		if (_ = r, S.value++, !a || g.items.length !== _.length || g.error) {
			g.selectedIds = [], g.sortBy = "collectionOrder", g.sortDirection = "asc";
			try {
				await O();
			} catch (e) {
				throw _ = c.items, g.items = c.resources, g.selectedIds = c.selectedIds, g.sortBy = c.sortBy, g.sortDirection = c.sortDirection, S.value++, e;
			}
		}
	}
	function A(e) {
		if (!w || x || g.loading || g.busy) return;
		++y;
		let t = new Set(e), n = _.filter((e) => !t.has(s(e)));
		n.length !== _.length && (_ = n, S.value++, g.items = g.items.filter((e) => !t.has(B(e))), g.selectedIds = g.selectedIds.filter((e) => !t.has(e)), D("remove"));
	}
	async function j(n, r = g.selectedIds) {
		if (!T || x || g.busy || g.loading || !r.length || !["up", "down"].includes(n) || g.sortBy && g.sortBy !== "collectionOrder") return;
		let a = ++y;
		g.busy = !0;
		try {
			let c = g.sortDirection === "desc" ? n === "up" ? "down" : "up" : n, l = await t.collection(_, {
				...i ? {
					referenceItems: !0,
					homogeneous: e.homogeneous === !0
				} : {},
				operation: "reorder",
				selection: [...r],
				direction: c
			});
			if (x || a !== y) return;
			_ = o(l.items), S.value++;
			let u = new Map(g.items.map((e) => [B(e), e]));
			g.items = _.map((e) => u.get(s(e))).filter(Boolean), D("reorder");
		} catch (e) {
			!x && a === y && (g.error = e.message);
		} finally {
			x || (g.busy = !1);
		}
	}
	return {
		options: p,
		browser: h,
		resources: l.run(() => R(() => g.sortBy === "collectionOrder" ? g.sortDirection === "desc" ? [...g.items].reverse() : g.items : e.selectedResources ? g.items : h.resources.value)),
		referenceItems: i,
		canRemove: w,
		canOrder: T,
		refresh: O,
		setItems: k,
		remove: A,
		move: j,
		revision: S,
		reorderItems(e) {
			if (!T || x || g.busy || g.loading) return;
			if (!Array.isArray(e) || e.length !== _.length || new Set(e).size !== _.length || e.some((e) => !_.some((t) => s(t) === e))) throw TypeError("Invalid collection order.");
			let t = new Map(_.map((e) => [s(e), e]));
			_ = e.map((e) => t.get(e));
			let n = new Map(g.items.map((e) => [B(e), e]));
			g.items = e.map((e) => n.get(e)).filter(Boolean), S.value++, D("reorder");
		},
		setUsage(e, t) {
			if (!C || x || !i || g.loading || g.busy) return;
			let n = B(e);
			_ = _.map((e) => s(e) === n ? {
				...e,
				usage: JSON.parse(JSON.stringify(t))
			} : e), S.value++, D("usage");
		},
		getItems: c,
		async addItems(e) {
			await k(o([..._, ...e])), D("add");
		},
		destroy() {
			x = !0, y++, t.destroy?.(), l.stop();
		}
	};
}
//#endregion
export { ln as C, $n as S, Lt as T, ii as _, Ia as a, Gr as b, ya as c, _i as d, gi as f, di as g, si as h, So as i, _a as l, mi as m, To as n, Fa as o, hi as p, wo as r, Pa as s, Do as t, Fi as u, Qr as v, Zt as w, Vr as x, Yr as y };
