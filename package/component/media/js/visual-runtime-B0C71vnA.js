import { A as e, B as t, C as n, D as r, E as i, F as a, I as o, L as s, M as c, N as l, O as u, P as d, R as f, S as p, T as m, V as h, a as g, b as _, c as v, d as y, f as b, g as x, h as S, i as C, j as w, k as T, l as E, m as D, n as O, o as k, p as A, r as j, s as M, u as N, v as ee, w as P, x as F, y as te, z as I } from "./visual-runtime-CJIQlqNK.js?v=6.0.0";
import { t as L } from "./visual-runtime-9kQymmoE.js?v=6.0.0";
import { i as ne, o as R } from "./visual-runtime-rMzcxeX1.js?v=6.0.0";
import { a as z, i as B, n as V, r as H } from "./visual-runtime-RVfXtehh.js?v=6.0.0";
import { n as U, t as re } from "./visual-runtime-OkZmZGOK.js?v=6.0.0";
import { t as ie } from "./visual-runtime-CMW4NWo-.js?v=6.0.0";
//#region resources/js/components/ResourceFancySelect.vue
var W = ["placeholder"], G = ["multiple"], K = ["selected"], q = ["value", "selected"], J = {
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
		let r = e, a = t, s = o(null), c = N(() => r.options.filter((e) => String(e.value) !== "")), l = N(() => c.value.map((e) => String(e.value)).join("|")), u = (e) => r.multiple ? r.modelValue.includes(String(e)) : String(r.modelValue) === String(e), d = (e) => a("update:modelValue", r.multiple ? Array.from(e.target.selectedOptions, (e) => e.value) : e.target.value), f, g, _, b = () => s.value?.choicesInstance?.hideDropdown(), x = () => {
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
			await F(), f = s.value?.choicesInstance?.dropdown?.element, f && (_ = s.value.closest("dialog"), f.setAttribute("popover", "manual"), f.classList.add("resource-batch-choices-dropdown"), g = new MutationObserver(S), g.observe(f, {
				attributes: !0,
				attributeFilter: ["class"]
			}), window.addEventListener("scroll", x, !0), window.addEventListener("resize", x), _?.addEventListener("close", b));
		}), p(() => {
			g?.disconnect(), f?.matches(":popover-open") && f.hidePopover(), window.removeEventListener("scroll", x, !0), window.removeEventListener("resize", x), _?.removeEventListener("close", b);
		}), w(() => r.modelValue, async (e) => {
			await F();
			let t = s.value?.choicesInstance;
			if (!t) return;
			let n = r.multiple ? e : e ? [e] : [], i = t.getValue(!0), a = Array.isArray(i) ? i : i ? [i] : [];
			a.filter((e) => !n.includes(String(e))).forEach((e) => t.removeActiveItemsByValue(String(e))), n.filter((e) => !a.includes(String(e))).forEach((e) => t.setChoiceByValue(String(e)));
		}), (t, n) => (m(), D("joomla-field-fancy-select", {
			ref_key: "field",
			ref: s,
			key: l.value,
			class: I({ "resource-batch-single-select": !e.multiple }),
			placeholder: e.t(e.placeholder)
		}, [y("select", {
			class: "form-select",
			multiple: e.multiple,
			onChange: d
		}, [e.multiple ? A("", !0) : (m(), D("option", {
			key: 0,
			value: "",
			selected: !e.modelValue
		}, h(e.t(e.placeholder)), 9, K)), (m(!0), D(v, null, i(c.value, (t) => (m(), D("option", {
			key: t.value,
			value: String(t.value),
			selected: u(t.value)
		}, h(e.t(t.label)), 9, q))), 128))], 40, G)], 10, W));
	}
}, Y = { class: "resource-batch-field" }, X = ["aria-label"], Z = ["aria-pressed", "onClick"], ae = {
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
		return (n, r) => (m(), D("div", Y, [y("span", null, h(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), y("div", {
			class: "btn-group resource-batch-mode-toggle",
			role: "group",
			"aria-label": e.t("COM_SMARTBROWSER_BATCH_MODE")
		}, [(m(), D(v, null, i(t, (t) => y("button", {
			key: t.value,
			type: "button",
			class: I(["btn", e.modelValue === t.value ? "is-active" : ""]),
			"aria-pressed": e.modelValue === t.value,
			onClick: (e) => n.$emit("update:modelValue", t.value)
		}, h(e.t(t.label)), 11, Z)), 64))], 8, X)]));
	}
}, oe = ["aria-label"], se = { class: "resource-batch-body" }, ce = {
	class: "resource-batch-heading",
	role: "heading",
	"aria-level": "3"
}, le = ["open"], ue = { class: "resource-batch-fields" }, de = ["aria-label"], fe = ["value"], pe = ["aria-label"], me = { value: "asc" }, he = { value: "desc" }, ge = ["open"], _e = { class: "resource-batch-fields" }, ve = { class: "resource-batch-field" }, ye = ["aria-label"], be = {
	key: 1,
	class: "text-danger"
}, xe = ["open"], Se = { class: "resource-batch-fields" }, Ce = ["disabled"], we = { class: "resource-batch-check" }, Te = { key: 0 }, Ee = ["open"], De = { class: "resource-batch-fields" }, Oe = { class: "input-group" }, ke = ["open"], Ae = { class: "resource-batch-fields" }, je = { class: "resource-batch-check" }, Me = ["disabled"], Ne = ["open"], Pe = ["onClick"], Fe = { class: "resource-batch-fields" }, Ie = ["onUpdate:modelValue", "aria-label"], Le = { value: "" }, Re = ["value"], ze = ["open"], Be = {
	key: 0,
	class: "resource-batch-fields"
}, Ve = { class: "resource-batch-field" }, He = { class: "resource-batch-field" }, Ue = ["open"], We = {
	key: 0,
	class: "resource-batch-fields"
}, Ge = { class: "resource-batch-field" }, Ke = ["open"], qe = ["onClick"], Je = {
	key: 0,
	class: "resource-batch-fields"
}, Ye = ["onUpdate:modelValue", "aria-label"], Xe = { value: "" }, Ze = ["value"], Qe = ["open"], $e = {
	key: 0,
	class: "resource-batch-fields"
}, et = { class: "resource-batch-field" }, tt = { class: "resource-batch-field" }, nt = ["open"], rt = {
	key: 0,
	class: "resource-batch-fields"
}, it = { class: "resource-batch-field" }, at = ["open"], ot = ["open"], st = {
	key: 0,
	class: "resource-batch-fields"
}, ct = { class: "resource-batch-field" }, lt = ["open"], ut = {
	key: 0,
	class: "resource-batch-fields"
}, dt = { value: "add" }, ft = { value: "remove" }, pt = { value: "set" }, mt = { class: "resource-batch-field" }, ht = ["open"], gt = {
	key: 0,
	class: "resource-batch-fields"
}, Q = { value: "yes" }, $ = { value: "no" }, _t = { class: "resource-batch-bottom" }, vt = { class: "resource-batch-preview" }, yt = {
	class: "resource-batch-preview-heading",
	role: "heading",
	"aria-level": "3"
}, bt = {
	key: 0,
	class: "resource-batch-summary"
}, xt = {
	key: 0,
	class: "fas fa-arrow-right resource-batch-sequence-arrow",
	"aria-hidden": "true"
}, St = { class: "resource-batch-summary-step" }, Ct = {
	class: "resource-batch-summary-step-heading",
	role: "heading",
	"aria-level": "4"
}, wt = {
	key: 0,
	class: "resource-batch-summary-params"
}, Tt = {
	key: 1,
	class: "resource-batch-no-changes"
}, Et = { class: "resource-batch-footer" }, Dt = { class: "resource-batch-footer-actions" }, Ot = ["disabled"], kt = ["aria-label"], At = { class: "resource-batch-preview-dialog-head" }, jt = ["aria-label"], Mt = { class: "resource-batch-preview-list" }, Nt = ["title"], Pt = ["title"], Ft = ["aria-label"], It = { class: "resource-batch-preview-dialog-head" }, Lt = ["aria-label"], Rt = { class: "resource-batch-selected-list" }, zt = {
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
		let s = e, c = r, u = ee("resourceApi"), d = o(!1), p = o([]), g = o(!1), _ = o(""), w = 0, T = o(null), E = o(null), k = o(null), P = N(() => s.adapter.replace(/^flat-/, "")), F = N(() => P.value === "media"), te = N(() => ["articles", "articles-by-tag"].includes(P.value)), L = N(() => P.value === "categories"), ne = N(() => P.value === "tags"), R = N(() => P.value === "menus"), z = N(() => P.value === "users"), B = N(() => ({
			articles: "article:",
			"articles-by-tag": "article:",
			categories: "category:",
			tags: "tag:",
			menus: "menu-item:",
			users: "user:"
		})[P.value]), V = N(() => !s.collectionOnly && B.value ? s.selection.filter((e) => e.id.startsWith(B.value)) : s.selection), H = {
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
		}, U = {
			changeLanguage: !1,
			language: "",
			changeAccess: !1,
			access: "",
			tagsOpen: !1,
			tagAdd: [],
			tagRemove: [],
			placement: "none",
			category: ""
		}, re = {
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
		}, W = a({ ...H }), G = a({ ...U }), K = a({ ...re }), q = a({ ...ie }), Y = a({
			enabled: !1,
			field: "title",
			direction: "asc"
		}), X = N(() => V.value.length === 1 && V.value[0].capabilities?.extract === !0), Z = [{
			id: "language",
			enabled: "changeLanguage",
			label: "COM_SMARTBROWSER_BATCH_SET_LANGUAGE",
			placeholder: "COM_SMARTBROWSER_SELECT_LANGUAGE"
		}, {
			id: "access",
			enabled: "changeAccess",
			label: "COM_SMARTBROWSER_BATCH_SET_ACCESS",
			placeholder: "COM_SMARTBROWSER_SELECT_ACCESS"
		}], zt = Z, Bt = N(() => Y.enabled || JSON.stringify(W) !== JSON.stringify(H) || JSON.stringify(G) !== JSON.stringify(U) || JSON.stringify(K) !== JSON.stringify(re) || JSON.stringify(q) !== JSON.stringify(ie)), Vt = (e) => (s.batchOptions[e] || s.filters.find((t) => t.id === e)?.options || []).filter((e) => String(e.value) !== ""), Ht = N(() => (s.batchOptions.menu || []).flatMap((e) => [{
			value: `${e.value}.0`,
			label: e.label
		}, ...(s.batchOptions.menuParent || []).filter((t) => t.menu === e.value).map((t) => ({
			value: `${e.value}.${t.value}`,
			label: `- ${t.label}`
		}))])), Ut = N(() => W.zipName.trim().replace(/\.zip$/i, "")), Wt = (e) => {
			G.tagAdd = e, G.tagRemove = G.tagRemove.filter((t) => !e.includes(t));
		}, Gt = (e) => {
			G.tagRemove = e, G.tagAdd = G.tagAdd.filter((t) => !e.includes(t));
		}, Kt = (e) => {
			K.tagAdd = e, K.tagRemove = K.tagRemove.filter((t) => !e.includes(t));
		}, qt = (e) => {
			K.tagRemove = e, K.tagAdd = K.tagAdd.filter((t) => !e.includes(t));
		}, Jt = (e, t) => s.t(Vt(e).find((e) => String(e.value) === String(t))?.label || t), Yt = N(() => {
			let e = [];
			if (Y.enabled && s.orderingAvailable && e.push({
				id: "sort",
				title: s.t("COM_SMARTBROWSER_BATCH_SORT"),
				parameters: [s.t(s.sortFields.find((e) => e.id === Y.field)?.label || Y.field), s.t(Y.direction === "asc" ? "COM_SMARTBROWSER_ASCENDING" : "COM_SMARTBROWSER_DESCENDING")]
			}), F.value) W.placement !== "none" && e.push({
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
			}), W.extract && X.value && e.push({
				id: "extract",
				title: s.t("COM_SMARTBROWSER_BATCH_EXTRACT"),
				parameters: W.deleteArchive ? [s.t("COM_SMARTBROWSER_BATCH_EXTRACT_DELETE")] : []
			});
			else if (te.value) {
				for (let t of Z) G[t.enabled] && G[t.id] && e.push({
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
			} else if (L.value || ne.value || R.value) {
				for (let t of zt) K[t.enabled] && K[t.id] && e.push({
					id: t.id,
					title: s.t(t.label),
					parameters: [Jt(t.id, K[t.id])]
				});
				L.value && (K.tagsOpen && K.tagAdd.length && e.push({
					id: "tag-add",
					title: s.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: K.tagAdd.map((e) => Jt("tag", e))
				}), K.tagsOpen && K.tagRemove.length && e.push({
					id: "tag-remove",
					title: s.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: K.tagRemove.map((e) => Jt("tag", e))
				}), K.placement !== "none" && e.unshift({
					id: "placement",
					title: s.t(K.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [K.category ? Jt("category", K.category) : "..."]
				}), K.flipOrdering && e.push({
					id: "flip",
					title: s.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING"),
					parameters: []
				})), R.value && K.placement !== "none" && e.unshift({
					id: "placement",
					title: s.t(K.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [Ht.value.find((e) => e.value === K.menuDestination)?.label || "..."]
				});
			} else z.value && (q.groupOpen && q.group && e.push({
				id: "group",
				title: s.t({
					add: "COM_SMARTBROWSER_BATCH_GROUP_ADD",
					remove: "COM_SMARTBROWSER_BATCH_GROUP_REMOVE",
					set: "COM_SMARTBROWSER_BATCH_GROUP_SET"
				}[q.groupAction]),
				parameters: [Jt("group", q.group)]
			}), q.resetOpen && e.push({
				id: "reset",
				title: s.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET"),
				parameters: [s.t(q.reset === "yes" ? "JYES" : "JNO")]
			}));
			return e;
		}), Xt = N(() => !(!V.value.length || !Yt.value.length || W.extract && (!X.value || W.rename || W.zip || W.placement !== "none") || F.value && W.placement !== "none" && !p.value.some((e) => e.value === W.destination) || te.value && G.placement !== "none" && !G.category || L.value && K.placement !== "none" && !K.category || R.value && K.placement !== "none" && !Ht.value.some((e) => e.value === K.menuDestination) || F.value && W.zip && !Ut.value)), Zt = () => {
			if (s.collectionOnly) return {};
			if (F.value) return {
				...W,
				zipName: Ut.value
			};
			if (te.value) return {
				language: G.changeLanguage ? G.language : "",
				access: G.changeAccess ? G.access : "",
				tagAdd: G.tagsOpen ? G.tagAdd : [],
				tagRemove: G.tagsOpen ? G.tagRemove : [],
				placement: G.placement,
				category: G.category
			};
			if (z.value) return {
				group: q.groupOpen ? q.group : "",
				groupAction: q.groupAction === "remove" ? "del" : q.groupAction,
				reset: q.resetOpen ? q.reset : ""
			};
			let e = K.menuDestination.lastIndexOf(".");
			return {
				language: K.changeLanguage ? K.language : "",
				access: K.changeAccess ? K.access : "",
				tagAdd: L.value && K.tagsOpen ? K.tagAdd : [],
				tagRemove: L.value && K.tagsOpen ? K.tagRemove : [],
				placement: K.placement,
				category: K.category,
				flipOrdering: L.value && K.flipOrdering,
				menu: R.value && e >= 0 ? K.menuDestination.slice(0, e) : "",
				menuParent: R.value && e >= 0 ? K.menuDestination.slice(e + 1) : "0"
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
		}, en = N(() => V.value.map((e, t) => {
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
			Object.assign(W, H), Object.assign(G, U), Object.assign(K, re), Object.assign(q, ie), Object.assign(Y, {
				enabled: s.collectionOnly,
				field: s.sortFields[0]?.id || "title",
				direction: "asc"
			}), p.value = [], T.value?.showModal(), F.value && !s.collectionOnly && tn();
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
			}, [y("div", se, [
				y("div", ce, h(e.t("COM_SMARTBROWSER_BATCH_SELECT_ACTIONS")), 1),
				e.orderingAvailable && (e.collectionOnly || V.value.every((e) => e.capabilities?.reorder)) ? (m(), D("details", {
					key: 0,
					class: "resource-batch-step",
					open: Y.enabled
				}, [y("summary", { onClick: n[0] ||= M((e) => Y.enabled = !Y.enabled, ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_SORT")), 1), y("div", ue, [l(y("select", {
					"onUpdate:modelValue": n[1] ||= (e) => Y.field = e,
					class: "form-select",
					"aria-label": e.t("COM_SMARTBROWSER_BATCH_SORT")
				}, [(m(!0), D(v, null, i(e.sortFields, (t) => (m(), D("option", {
					key: t.id,
					value: t.id
				}, h(e.t(t.label)), 9, fe))), 128))], 8, de), [[j, Y.field]]), l(y("select", {
					"onUpdate:modelValue": n[2] ||= (e) => Y.direction = e,
					class: "form-select",
					"aria-label": e.t("COM_SMARTBROWSER_SORT_DIRECTION")
				}, [y("option", me, h(e.t("COM_SMARTBROWSER_ASCENDING")), 1), y("option", he, h(e.t("COM_SMARTBROWSER_DESCENDING")), 1)], 8, pe), [[j, Y.direction]])])], 8, le)) : A("", !0),
				F.value && !e.collectionOnly ? (m(), D(v, { key: 1 }, [
					y("details", {
						class: "resource-batch-step",
						open: W.placement !== "none"
					}, [y("summary", { onClick: n[3] ||= M((e) => W.placement = W.placement === "none" ? "move" : "none", ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_PLACEMENT")), 1), y("div", _e, [x(ae, {
						modelValue: W.placement,
						"onUpdate:modelValue": n[4] ||= (e) => W.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), y("div", ve, [y("span", null, h(e.t("COM_SMARTBROWSER_BATCH_DESTINATION_FOLDER")), 1), g.value ? (m(), D("span", {
						key: 0,
						class: "spinner-border spinner-border-sm",
						role: "status",
						"aria-label": e.t("COM_SMARTBROWSER_LOADING_FOLDERS")
					}, null, 8, ye)) : _.value ? (m(), D("span", be, h(_.value), 1)) : (m(), b(J, {
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
					]))])])], 8, ge),
					y("details", {
						class: "resource-batch-step",
						open: W.rename
					}, [y("summary", { onClick: n[6] ||= M((e) => W.rename = !W.rename, ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_RENAME")), 1), y("div", Se, [
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
						}, null, 8, Ce), [[C, W.replace]])]),
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
						y("label", we, [l(y("input", {
							"onUpdate:modelValue": n[11] ||= (e) => W.number = e,
							type: "checkbox",
							class: "form-check-input"
						}, null, 512), [[O, W.number]]), S(" " + h(e.t("COM_SMARTBROWSER_BATCH_NUMBER")), 1)]),
						W.number ? (m(), D("label", Te, [S(h(e.t("COM_SMARTBROWSER_BATCH_START_AT")), 1), l(y("input", {
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
					])], 8, xe),
					y("details", {
						class: "resource-batch-step",
						open: W.zip
					}, [y("summary", { onClick: n[13] ||= M((e) => W.zip = !W.zip, ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_ZIP")), 1), y("div", De, [y("label", null, [S(h(e.t("COM_SMARTBROWSER_BATCH_ZIP_NAME")), 1), y("span", Oe, [l(y("input", {
						"onUpdate:modelValue": n[14] ||= (e) => W.zipName = e,
						type: "text",
						class: "form-control",
						onBlur: n[15] ||= (e) => W.zipName = Ut.value
					}, null, 544), [[C, W.zipName]]), n[35] ||= y("span", { class: "input-group-text" }, ".zip", -1)])])])], 8, Ee),
					X.value ? (m(), D("details", {
						key: 0,
						class: "resource-batch-step",
						open: W.extract
					}, [y("summary", { onClick: n[16] ||= M((e) => W.extract = !W.extract, ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_EXTRACT")), 1), y("div", Ae, [y("label", je, [l(y("input", {
						"onUpdate:modelValue": n[17] ||= (e) => W.deleteArchive = e,
						type: "checkbox",
						class: "form-check-input",
						disabled: !V.value.every((e) => e.capabilities?.delete)
					}, null, 8, Me), [[O, W.deleteArchive]]), S(" " + h(e.t("COM_SMARTBROWSER_BATCH_EXTRACT_DELETE")), 1)])])], 8, ke)) : A("", !0)
				], 64)) : te.value && !e.collectionOnly ? (m(), D(v, { key: 2 }, [
					(m(), D(v, null, i(Z, (t) => y("details", {
						key: t.id,
						class: "resource-batch-step",
						open: G[t.enabled]
					}, [y("summary", { onClick: M((e) => G[t.enabled] = !G[t.enabled], ["prevent"]) }, h(e.t(t.label)), 9, Pe), y("div", Fe, [l(y("select", {
						"onUpdate:modelValue": (e) => G[t.id] = e,
						class: "form-select",
						"aria-label": e.t(t.label)
					}, [y("option", Le, h(e.t(t.placeholder)), 1), (m(!0), D(v, null, i(Vt(t.id), (t) => (m(), D("option", {
						key: t.value,
						value: t.value
					}, h(e.t(t.label)), 9, Re))), 128))], 8, Ie), [[j, G[t.id]]])])], 8, Ne)), 64)),
					y("details", {
						class: "resource-batch-step",
						open: G.tagsOpen
					}, [y("summary", { onClick: n[18] ||= M((e) => G.tagsOpen = !G.tagsOpen, ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), G.tagsOpen ? (m(), D("div", Be, [y("div", Ve, [y("span", null, h(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), x(J, {
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
					])]), y("div", He, [y("span", null, h(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), x(J, {
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
					])])])) : A("", !0)], 8, ze),
					y("details", {
						class: "resource-batch-step",
						open: G.placement !== "none"
					}, [y("summary", { onClick: n[19] ||= M((e) => G.placement = G.placement === "none" ? "move" : "none", ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), G.placement === "none" ? A("", !0) : (m(), D("div", We, [x(ae, {
						modelValue: G.placement,
						"onUpdate:modelValue": n[20] ||= (e) => G.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), y("div", Ge, [y("span", null, h(e.t("COM_SMARTBROWSER_CATEGORY")), 1), x(J, {
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
					])])]))], 8, Ue)
				], 64)) : !e.collectionOnly && (L.value || ne.value || R.value) ? (m(), D(v, { key: 3 }, [
					(m(!0), D(v, null, i(f(zt), (t) => (m(), D("details", {
						key: t.id,
						class: "resource-batch-step",
						open: K[t.enabled]
					}, [y("summary", { onClick: M((e) => K[t.enabled] = !K[t.enabled], ["prevent"]) }, h(e.t(t.label)), 9, qe), K[t.enabled] ? (m(), D("div", Je, [l(y("select", {
						"onUpdate:modelValue": (e) => K[t.id] = e,
						class: "form-select",
						"aria-label": e.t(t.label)
					}, [y("option", Xe, h(e.t(t.placeholder)), 1), (m(!0), D(v, null, i(Vt(t.id), (t) => (m(), D("option", {
						key: t.value,
						value: t.value
					}, h(e.t(t.label)), 9, Ze))), 128))], 8, Ye), [[j, K[t.id]]])])) : A("", !0)], 8, Ke))), 128)),
					L.value ? (m(), D("details", {
						key: 0,
						class: "resource-batch-step",
						open: K.tagsOpen
					}, [y("summary", { onClick: n[22] ||= M((e) => K.tagsOpen = !K.tagsOpen, ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), K.tagsOpen ? (m(), D("div", $e, [y("div", et, [y("span", null, h(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), x(J, {
						"model-value": K.tagAdd,
						options: Vt("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": Kt
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])]), y("div", tt, [y("span", null, h(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), x(J, {
						"model-value": K.tagRemove,
						options: Vt("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": qt
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])])])) : A("", !0)], 8, Qe)) : A("", !0),
					L.value ? (m(), D("details", {
						key: 1,
						class: "resource-batch-step",
						open: K.placement !== "none"
					}, [y("summary", { onClick: n[23] ||= M((e) => K.placement = K.placement === "none" ? "move" : "none", ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), K.placement === "none" ? A("", !0) : (m(), D("div", rt, [x(ae, {
						modelValue: K.placement,
						"onUpdate:modelValue": n[24] ||= (e) => K.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), y("div", it, [y("span", null, h(e.t("COM_SMARTBROWSER_BATCH_PARENT_CATEGORY")), 1), x(J, {
						modelValue: K.category,
						"onUpdate:modelValue": n[25] ||= (e) => K.category = e,
						options: Vt("category"),
						placeholder: "COM_SMARTBROWSER_SELECT_CATEGORY",
						t: e.t,
						"aria-label": e.t("COM_SMARTBROWSER_BATCH_PARENT_CATEGORY")
					}, null, 8, [
						"modelValue",
						"options",
						"t",
						"aria-label"
					])])]))], 8, nt)) : A("", !0),
					L.value ? (m(), D("details", {
						key: 2,
						class: "resource-batch-step",
						open: K.flipOrdering
					}, [y("summary", { onClick: n[26] ||= M((e) => K.flipOrdering = !K.flipOrdering, ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING")), 1)], 8, at)) : A("", !0),
					R.value ? (m(), D("details", {
						key: 3,
						class: "resource-batch-step",
						open: K.placement !== "none"
					}, [y("summary", { onClick: n[27] ||= M((e) => K.placement = K.placement === "none" ? "move" : "none", ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_MENU_PLACEMENT")), 1), K.placement === "none" ? A("", !0) : (m(), D("div", st, [x(ae, {
						modelValue: K.placement,
						"onUpdate:modelValue": n[28] ||= (e) => K.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), y("div", ct, [y("span", null, h(e.t("COM_SMARTBROWSER_BATCH_MENU_DESTINATION")), 1), x(J, {
						modelValue: K.menuDestination,
						"onUpdate:modelValue": n[29] ||= (e) => K.menuDestination = e,
						options: Ht.value,
						placeholder: "COM_SMARTBROWSER_SELECT_MENU",
						t: e.t,
						"aria-label": e.t("COM_SMARTBROWSER_BATCH_MENU_DESTINATION")
					}, null, 8, [
						"modelValue",
						"options",
						"t",
						"aria-label"
					])])]))], 8, ot)) : A("", !0)
				], 64)) : z.value && !e.collectionOnly ? (m(), D(v, { key: 4 }, [y("details", {
					class: "resource-batch-step",
					open: q.groupOpen
				}, [y("summary", { onClick: n[30] ||= M((e) => q.groupOpen = !q.groupOpen, ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_USER_GROUPS")), 1), q.groupOpen ? (m(), D("div", ut, [y("label", null, [S(h(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), l(y("select", {
					"onUpdate:modelValue": n[31] ||= (e) => q.groupAction = e,
					class: "form-select resource-batch-mode-select"
				}, [
					y("option", dt, h(e.t("COM_SMARTBROWSER_BATCH_GROUP_ADD")), 1),
					y("option", ft, h(e.t("COM_SMARTBROWSER_BATCH_GROUP_REMOVE")), 1),
					y("option", pt, h(e.t("COM_SMARTBROWSER_BATCH_GROUP_SET")), 1)
				], 512), [[j, q.groupAction]])]), y("div", mt, [y("span", null, h(e.t("COM_SMARTBROWSER_USER_GROUP")), 1), x(J, {
					modelValue: q.group,
					"onUpdate:modelValue": n[32] ||= (e) => q.group = e,
					options: Vt("group"),
					placeholder: "COM_SMARTBROWSER_SELECT_USER_GROUP",
					t: e.t,
					"aria-label": e.t("COM_SMARTBROWSER_USER_GROUP")
				}, null, 8, [
					"modelValue",
					"options",
					"t",
					"aria-label"
				])])])) : A("", !0)], 8, lt), y("details", {
					class: "resource-batch-step",
					open: q.resetOpen
				}, [y("summary", { onClick: n[33] ||= M((e) => q.resetOpen = !q.resetOpen, ["prevent"]) }, h(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), q.resetOpen ? (m(), D("div", gt, [y("label", null, [S(h(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), l(y("select", {
					"onUpdate:modelValue": n[34] ||= (e) => q.reset = e,
					class: "form-select"
				}, [y("option", Q, h(e.t("JYES")), 1), y("option", $, h(e.t("JNO")), 1)], 512), [[j, q.reset]])])])) : A("", !0)], 8, ht)], 64)) : A("", !0)
			]), y("div", _t, [y("div", vt, [y("div", yt, h(e.t("COM_SMARTBROWSER_BATCH_PREVIEW")), 1), Yt.value.length ? (m(), D("div", bt, [(m(!0), D(v, null, i(Yt.value, (t, n) => (m(), D("div", {
				key: t.id,
				class: "resource-batch-sequence-item"
			}, [n ? (m(), D("span", xt)) : A("", !0), y("div", St, [y("div", Ct, h(t.title), 1), t.parameters.length || t.preview ? (m(), D("div", wt, [(m(!0), D(v, null, i(t.parameters, (e) => (m(), D("span", { key: e }, h(e), 1))), 128)), t.preview ? (m(), D("button", {
				key: 0,
				type: "button",
				class: "resource-batch-preview-link",
				onClick: rn
			}, h(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")), 1)) : A("", !0)])) : A("", !0)])]))), 128))])) : (m(), D("p", Tt, h(e.t("COM_SMARTBROWSER_BATCH_NO_CHANGES")), 1))]), y("div", Et, [y("button", {
				type: "button",
				class: "resource-batch-items-link",
				onClick: on
			}, h(V.value.length) + " " + h(e.t(V.value.length === 1 ? "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_ONE" : "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_MANY")), 1), y("div", Dt, [y("button", {
				type: "button",
				class: "btn btn-primary",
				disabled: d.value || !Xt.value,
				onClick: Qt
			}, h(e.t("COM_SMARTBROWSER_BATCH_APPLY")), 9, Ot), y("button", {
				type: "button",
				class: "btn btn-danger",
				onClick: cn
			}, h(e.t("COM_SMARTBROWSER_CANCEL")), 1)])])])], 8, oe),
			y("dialog", {
				ref_key: "previewDialog",
				ref: E,
				class: "resource-batch-preview-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")
			}, [y("div", At, [y("strong", null, h(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")) + " (" + h(en.value.length) + ")", 1), y("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: an
			}, null, 8, jt)]), y("div", Mt, [(m(!0), D(v, null, i(en.value, (e) => (m(), D("div", {
				key: e.id,
				class: "resource-batch-preview-row"
			}, [
				y("span", { title: e.before }, h(e.before), 9, Nt),
				n[36] ||= y("span", {
					class: "fas fa-arrow-right",
					"aria-hidden": "true"
				}, null, -1),
				y("strong", { title: e.after }, h(e.after), 9, Pt)
			]))), 128))])], 8, kt),
			y("dialog", {
				ref_key: "selectionDialog",
				ref: k,
				class: "resource-batch-preview-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_SELECTED_ITEMS")
			}, [y("div", It, [y("strong", null, h(e.t("COM_SMARTBROWSER_SELECTED_ITEMS")), 1), y("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: sn
			}, null, 8, Lt)]), y("ul", Rt, [(m(!0), D(v, null, i(V.value, (e) => (m(), D("li", { key: e.id }, [y("span", {
				class: I(e.icon || "fas fa-file"),
				"aria-hidden": "true"
			}, null, 2), y("span", null, h(e.title), 1)]))), 128))])], 8, Ft)
		], 64));
	}
}, Bt = {
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
}, Vt = (e) => e.icon || e.headerIcon || Bt[e.id || String(e.source || "").split(".").pop()] || (e.format === "date" ? "fas fa-calendar" : "fas fa-info"), Ht = (e) => e.icon || {
	"media.caption": "fas fa-comment",
	"media.class": "fas fa-code",
	"media.figureClass": "fas fa-code",
	"media.alt": "fas fa-font",
	"media.decorative": "fas fa-image",
	"media.loading": "fas fa-clock",
	"link.text": "fas fa-font",
	"link.target": "fas fa-external-link-alt"
}[e.key] || "fas fa-info", Ut = (e) => String(e ?? "").trim().replace(/\s+/g, " "), Wt = (e) => (e || []).filter((e) => e.type === "resource" && e.visualRole === "thumbnail");
function Gt(e, t = {}) {
	let n = t["article.displayedName"], r = Kt(e, t);
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
function Kt(e, t = {}) {
	if (!e || e.unavailable) return "";
	let n = t["visual.iconOverride"];
	return typeof n == "string" && n.length <= 160 && /^[a-zA-Z0-9_-]+(?: [a-zA-Z0-9_-]+)*$/.test(n) ? n : e.icon || "fas fa-file";
}
function qt(e) {
	return !e || e.unavailable ? "" : e.thumbnail || e.metadata?.thumbnail || e.metadata?.poster || e.image || (e.type === "image" ? e.metadata?.url : "") || "";
}
function Jt(e, t = {}) {
	return [
		"category",
		"tag",
		"menu-item",
		"menu"
	].includes(e?.type) ? Kt({
		...e,
		icon: e.badgeIcon || e.icon
	}, t) : "";
}
function Yt(e, t = {}, n = "") {
	return {
		...Gt(e, t),
		image: n || e?.image || qt(e)
	};
}
function Xt(e, t = {}, n = "") {
	let r = Gt(e, t).visualPresentation, i = r === "icon" ? "" : n || qt(e), a = r === "thumbnail" && i ? "" : Jt(e, t) || Kt(e, t);
	return {
		image: i,
		icon: a,
		typeIcon: e?.typeIcon || e?.icon || "fas fa-file",
		badgeIcon: r === "icon" ? "" : a,
		presentation: r,
		imageCrop: e?.imageCrop || null
	};
}
async function Zt(e, t, n) {
	let r = await n(t, e.picker);
	if (!r || r.unavailable || r.selectable === !1 || !qt(r) || e.picker?.allowedResourceTypes?.length && !e.picker.allowedResourceTypes.includes(r.type)) throw Error("COM_SMARTBROWSER_USAGE_INVALID");
	return r;
}
//#endregion
//#region resources/js/core/extensionMetadata.js
var Qt = (e) => /^ext\.[a-zA-Z][a-zA-Z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)*$/.test(e), $t = (e) => Object.fromEntries(Object.entries(e || {}).filter(([e]) => Qt(e)));
function en(e) {
	let t = e?.startsWith("ext.") ? e : `ext.${e}`;
	if (!Qt(t)) throw TypeError("Invalid extension metadata namespace.");
	return t;
}
function tn(e) {
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
var nn = /^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/, rn = (e, t) => Object.prototype.hasOwnProperty.call(e, t), an = (e) => e === void 0 ? void 0 : JSON.parse(JSON.stringify(e)), on = (e) => e == null || typeof e == "string" && !e.trim(), sn = /* @__PURE__ */ new Set([
	"text",
	"textarea",
	"boolean",
	"select",
	"number",
	"resource"
]), cn = (e, t) => !!(e.disabledWhen && rn(t || {}, e.disabledWhen.key) && t[e.disabledWhen.key] === e.disabledWhen.equals);
function ln(e, t = {}) {
	if (!e || e.unavailable || !t || typeof t != "object") return [];
	let n = Array.isArray(e.selectionCapabilities) ? e.selectionCapabilities : [], r = /* @__PURE__ */ new Set();
	return n.flatMap((e) => {
		let n = e?.key;
		if (!nn.test(n || "") || ![
			"string",
			"boolean",
			"number",
			"resource",
			"object"
		].includes(e.type) || r.has(n) || !rn(t, n) || t[n] === !1) return [];
		r.add(n);
		let i = t[n] && typeof t[n] == "object" ? t[n] : {};
		return [{
			...e,
			policy: i,
			presentation: ["secondary", "hidden"].includes(i.presentation) ? i.presentation : "primary",
			default: rn(i, "default") ? i.default : e.default,
			required: i.required === !0
		}];
	});
}
function un(e, t) {
	if (on(t)) return e.required ? "COM_SMARTBROWSER_USAGE_REQUIRED" : null;
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
function dn({ profile: e = {}, initialUsage: t = {}, resolveReference: n, editors: r = {} } = {}) {
	let i = /* @__PURE__ */ new Map(), a = (t) => ln(t, e);
	function o(e) {
		if (!e) return {};
		let n = z(e);
		i.has(n) || i.set(n, e.unavailable ? an(t[n] || {}) : $t(an(t[n] || {})));
		let r = i.get(n);
		for (let i of a(e)) rn(r, i.key) || (r[i.key] = an(rn(t[n] || {}, i.key) ? t[n][i.key] : i.default ?? null));
		for (let t of a(e)) cn(t, r) && (r[t.key] = an(t.inactiveValue ?? null));
		return an(r);
	}
	function s(e, t, n) {
		(Qt(t) || a(e).some((e) => e.key === t)) && (Qt(t) && (n = tn(n)), o(e), i.get(z(e))[t] = an(n), o(e));
	}
	async function c(e) {
		let t = {}, i = {}, s = {};
		for (let c of e) {
			let e = z(c), l = o(c), u = $t(l);
			for (let o of a(c)) {
				let a = l[o.key], s = un(cn(o, l) ? {
					...o,
					required: !1
				} : o, a);
				if (!s && o.type === "resource" && !on(a)) {
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
				if (o.presentation !== "hidden" && !sn.has(o.editor) && !d && (s = "COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE"), !s && d?.validate) try {
					s = await d.validate(a, {
						definition: o,
						resource: c,
						values: l
					}) || null;
				} catch {
					s = "COM_SMARTBROWSER_USAGE_INVALID";
				}
				s && (t[e] ||= {}, t[e][o.key] = s, o.presentation === "hidden" && (i[e] ||= {}, i[e][o.key] = s)), u[o.key] = o.type === "resource" && !on(a) ? H(a) : a;
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
			i.delete(z(e));
		}
	};
}
//#endregion
//#region resources/js/core/visualOverlays.js
function fn({ createLayer: e, report: t = (e) => console.error(e), removeOnError: n = !1, remountWithoutUpdate: r = !1 }) {
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
var pn = {
	__name: "ResourceVisualOverlays",
	props: { context: Object },
	setup(e) {
		let t = e, n = o(null), r = t.context?.overlayRegistry || window.SmartBrowserPicker, i = o(r?.extensions?.().visualOverlays || r?.visualOverlays || []), a = r?.subscribeVisualOverlays?.((e) => {
			i.value = e;
		}), s = fn({ createLayer(e, t) {
			let n = e.ownerDocument.createElement("div");
			return n.className = "resource-visual-overlay", n.dataset.overlayId = t.id, e.append(n), n;
		} });
		return w(() => [
			n.value,
			i.value,
			t.context
		], () => {
			s.sync(n.value, i.value, t.context, z(t.context?.resource));
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
function mn(e) {
	let t = fn({
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
var hn = {
	__name: "ResourcePreviewRenderer",
	props: { context: Object },
	emits: ["active-change", "before-update"],
	setup(e, { emit: t }) {
		let n = e, i = t, a = o(null), s = o(!1);
		w(s, (e) => i("active-change", e), { flush: "sync" });
		let c = n.context?.overlayRegistry || window.SmartBrowserPicker, u = o(c?.extensions?.().previewRenderers || c?.previewRenderers || []), d = c?.subscribePreviewRenderers?.((e) => {
			u.value = e;
		}), f = mn({ createLayer(e, t) {
			let n = e.ownerDocument.createElement("div");
			return n.className = "resource-preview-renderer", n.dataset.rendererId = t.id, e.append(n), n;
		} });
		return w(() => [
			a.value,
			u.value,
			n.context
		], () => {
			i("before-update"), s.value = f.sync(a.value, u.value, n.context, z(n.context?.resource));
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
}, gn = {
	__name: "ResourceImagePresentation",
	props: {
		imageElement: Object,
		context: Object
	},
	emits: ["providers-change"],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, a = r.context?.overlayRegistry || window.SmartBrowserPicker, c = s(a?.extensions?.().imagePresentations || a?.imagePresentations || []), l = a?.subscribeImagePresentations?.((e) => {
			c.value = e, i("providers-change");
		}), u = U(), d = o(0), f = () => {
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
}, _n = { class: "resource-lightweight-area" }, vn = {
	key: 0,
	class: "resource-lightweight-actions resource-lightweight-eye-action"
}, yn = ["title", "aria-label"], bn = [
	"disabled",
	"title",
	"aria-label"
], xn = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], Sn = {
	key: 0,
	class: "text-danger",
	role: "alert"
}, Cn = {
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
		let a = e, u = n, d = N(() => Wt(a.definitions)), f = N(() => a.editable ? d.value.filter((e) => e.presentation !== "hidden") : []), _ = N(() => d.value.find((e) => a.values?.[e.key])), S = o(""), C = o(""), T = o(!1), E = o(null), O = o(null), k = o(null), j = s(null), M = s(null), ee = o(!1), P = o(null), F = o(null), te = o(0), L = null, ne = N(() => ee.value ? M.value : j.value), R = (e) => {
			ee.value || F.value?.refreshPresentation(), L?.onPresentationChange?.(e), E.value?.dispatchEvent(new CustomEvent("smartbrowser:image-presentation-change", {
				detail: e,
				bubbles: !0
			}));
		}, B = (e, t = {}) => {
			if (e != null && (e.tagName !== "IMG" || !E.value?.contains(e))) throw TypeError("The primary image must belong to this preview.");
			P.value?.release();
			let n = { onPresentationChange: t.onPresentationChange };
			return L = n, M.value = e, te.value++, () => {
				L === n && (P.value?.release(), L = null, M.value = null);
			};
		}, V = N(() => a.overlayContext ? {
			...a.overlayContext,
			actionsContainer: k.value,
			visualElement: E.value,
			imageElement: ne.value,
			getImageElement: () => ne.value,
			imageUrl: G.value,
			imageVersion: te.value,
			resolvedImage: O.value || a.resource,
			values: a.values || {},
			notifyPresentationChange: R
		} : null), U = o(0), ie = N(() => (U.value, !!(_.value || a.overlayContext?.hasPreviewChanges?.())));
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
		let G = N(() => a.contentOnly && a.resource?.type === "image" ? a.resource.image || a.resource.metadata?.url || qt(a.resource) : S.value || qt(a.resource)), K = N(() => ({
			...Yt(a.resource, a.values, S.value),
			imageCrop: O.value?.imageCrop || a.resource?.imageCrop
		})), q = N(() => ({
			...a.overlayContext,
			resource: a.resource,
			visualElement: E.value,
			setImageElement: B,
			getImageElement: () => ne.value,
			imageUrl: G.value,
			resolvedImage: O.value || a.resource,
			actionsContainer: k.value,
			values: a.values || {},
			visuals: Xt(K.value, a.values, G.value),
			isReadOnly: a.overlayContext?.isReadOnly !== !1,
			purpose: "preview"
		})), J = 0, Y = !1;
		w(() => [
			z(a.resource),
			_.value,
			_.value && a.values?.[_.value.key]
		], async () => {
			let e = ++J;
			S.value = "", O.value = null, C.value = "";
			let t = _.value;
			if (t) try {
				let n = await Zt(t, a.values[t.key], a.resolveReference);
				if (e !== J) return;
				O.value = n, S.value = qt(n);
			} catch {
				e === J && (C.value = "COM_SMARTBROWSER_USAGE_INVALID");
			}
		}, {
			immediate: !0,
			deep: !0
		});
		async function X(e) {
			let t = z(a.resource);
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
				n && !Y && z(a.resource) === t && u("change", e.key, H({
					adapter: e.picker.adapter,
					id: n.id
				}));
			} catch {
				!Y && z(a.resource) === t && (C.value = "COM_SMARTBROWSER_USAGE_INVALID");
			} finally {
				T.value = !1;
			}
		}
		return t({ element: E }), p(() => {
			Y = !0, ++J;
		}), (t, n) => (m(), D(v, null, [y("div", _n, [
			l(y("div", {
				ref_key: "surface",
				ref: E,
				class: I(["resource-lightweight-visual", {
					"has-override": !!_.value,
					"is-information-visual": !e.contentOnly,
					"is-grid-information": !e.contentOnly && e.resource?.type !== "image",
					"has-unavailable-content": e.contentOnly && e.resource?.id && !G.value
				}])
			}, [
				e.contentOnly ? e.nativePreview ? A("", !0) : (m(), b(hn, {
					key: 1,
					context: q.value,
					onActiveChange: n[1] ||= (e) => ee.value = e,
					onBeforeUpdate: n[2] ||= (e) => P.value?.release()
				}, {
					default: c(() => [x(re, {
						ref_key: "fallbackVisual",
						ref: F,
						resource: K.value,
						"presentation-managed": "",
						onImageChange: n[0] ||= (e) => j.value = e
					}, null, 8, ["resource"])]),
					_: 1
				}, 8, ["context"])) : (m(), b(re, {
					key: 0,
					resource: e.resource,
					"fit-content": e.resource.type === "image"
				}, null, 8, ["resource", "fit-content"])),
				V.value && !e.nativePreview ? (m(), b(pn, {
					key: 2,
					context: V.value
				}, null, 8, ["context"])) : A("", !0),
				V.value && e.contentOnly && !e.nativePreview ? (m(), b(gn, {
					key: 3,
					ref_key: "presentation",
					ref: P,
					"image-element": ne.value,
					context: V.value,
					onProvidersChange: n[3] ||= (e) => U.value++
				}, null, 8, ["image-element", "context"])) : A("", !0)
			], 2), [[g, !e.nativePreview]]),
			e.canPreview ? (m(), D("div", vn, [e.canPreview ? (m(), D("button", {
				key: 0,
				type: "button",
				class: "resource-lightweight-icon-action",
				title: e.t("COM_SMARTBROWSER_ACTION_PREVIEW"),
				"aria-label": e.t("COM_SMARTBROWSER_ACTION_PREVIEW"),
				onClick: n[4] ||= (e) => t.$emit("preview")
			}, [...n[5] ||= [y("span", {
				class: "fas fa-eye",
				"aria-hidden": "true"
			}, null, -1)]], 8, yn)) : A("", !0)])) : A("", !0),
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
				}, null, -1)]], 8, bn)) : A("", !0),
				(m(!0), D(v, null, i(f.value, (t) => (m(), D("button", {
					key: t.key,
					type: "button",
					class: I({ selected: !!e.values?.[t.key] }),
					disabled: T.value,
					title: e.t(e.values?.[t.key] ? "COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL" : "COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL"),
					"aria-label": e.t(e.values?.[t.key] ? "COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL" : "COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL"),
					onClick: (e) => X(t)
				}, [...n[7] ||= [y("span", {
					class: "fas fa-image",
					"aria-hidden": "true"
				}, null, -1)]], 10, xn))), 128)),
				r(t.$slots, "actions")
			], 512)
		]), C.value || d.value.some((t) => e.errors?.[t.key]) ? (m(), D("small", Sn, h(e.t(C.value || e.errors[d.value.find((t) => e.errors?.[t.key]).key])), 1)) : A("", !0)], 64));
	}
}, wn = {
	__name: "ResourceActionIcon",
	props: { icon: String },
	setup(e) {
		return (t, n) => (m(), D("span", {
			class: I(e.icon === "arrow-down-up-across-line" ? "fas fa-arrow-down-up-across-line" : e.icon),
			"aria-hidden": "true"
		}, null, 2));
	}
}, Tn = { class: "resource-usage-field" }, En = {
	key: 0,
	"aria-hidden": "true"
}, Dn = [
	"value",
	"disabled",
	"required",
	"aria-invalid"
], On = [
	"value",
	"required",
	"aria-invalid"
], kn = {
	key: 3,
	class: "resource-usage-check"
}, An = ["checked"], jn = ["value", "aria-invalid"], Mn = {
	key: 0,
	value: ""
}, Nn = ["value"], Pn = ["value", "aria-invalid"], Fn = ["value"], In = { value: "auto" }, Ln = { value: "custom" }, Rn = {
	key: 0,
	class: "resource-usage-reference"
}, zn = { key: 0 }, Bn = ["disabled"], Vn = ["title", "aria-label"], Hn = {
	key: 8,
	class: "text-danger"
}, Un = { key: 9 }, Wn = {
	key: 10,
	class: "text-danger",
	role: "alert"
}, Gn = {
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
		let n = e, r = t, a = `sb-usage-${Math.random().toString(36).slice(2)}`, s = o(n.value ? "custom" : "auto"), c = o(""), l = o(!1), u = o(""), d = o(n.value ?? ""), g = o(null), _ = N(() => n.editors?.[n.definition.editor]), b = N(() => cn(n.definition, n.values)), x, C, T = 0, E = !1, O = (e) => {
			u.value = "", r("change", e);
		}, k = (e) => {
			n.definition.key === "visual.iconOverride" ? (d.value = e, O(Ut(e))) : O(e);
		}, j = () => {
			s.value = "auto", O(null);
		}, M = (e) => {
			s.value = e, e === "auto" && O(null);
		};
		w(() => n.value, async (e) => {
			n.definition.key === "visual.iconOverride" && Ut(d.value) !== (e ?? "") && (d.value = e ?? "");
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
		async function ee() {
			l.value = !0;
			try {
				let e = await window.SmartBrowserPicker.open({
					...n.definition.picker,
					multiple: !1,
					initialSelection: n.value ? [n.value.id] : []
				});
				e && !E && O(H({
					adapter: n.definition.picker.adapter,
					id: e.id
				}));
			} catch {
				u.value = "COM_SMARTBROWSER_USAGE_INVALID";
			} finally {
				l.value = !1;
			}
		}
		return w([_, () => z(n.resource)], async () => {
			if (C?.abort(), x?.destroy?.(), x = null, await F(), !E && _.value && g.value) {
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
		}), (t, n) => (m(), D("div", Tn, [
			e.definition.editor === "boolean" ? A("", !0) : (m(), D("label", {
				key: 0,
				for: a
			}, [
				y("span", {
					class: I(f(Ht)(e.definition)),
					"aria-hidden": "true"
				}, null, 2),
				S(h(e.t(e.definition.label)), 1),
				e.definition.required ? (m(), D("span", En, " *")) : A("", !0)
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
			}, null, 40, Dn)) : e.definition.editor === "textarea" ? (m(), D("textarea", {
				key: 2,
				id: a,
				class: "form-control",
				rows: "3",
				value: e.value ?? "",
				required: e.definition.required,
				"aria-invalid": !!e.error,
				onInput: n[1] ||= (e) => O(e.target.value)
			}, null, 40, On)) : e.definition.editor === "boolean" ? (m(), D("label", kn, [
				y("input", {
					id: a,
					class: "form-check-input",
					type: "checkbox",
					checked: e.value === !0,
					onChange: n[2] ||= (e) => O(e.target.checked)
				}, null, 40, An),
				e.definition.key === "media.decorative" ? A("", !0) : (m(), D("span", {
					key: 0,
					class: I(f(Ht)(e.definition)),
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
			}, [!e.definition.required && !e.definition.options?.some((e) => e.value === "") ? (m(), D("option", Mn, h(e.t(e.definition.key === "visual.presentation" ? "COM_SMARTBROWSER_USAGE_DEFAULT" : "COM_SMARTBROWSER_USAGE_CHOOSE")), 1)) : A("", !0), (m(!0), D(v, null, i(e.definition.options, (t) => (m(), D("option", {
				key: String(t.value),
				value: t.value
			}, h(e.t(t.label)), 9, Nn))), 128))], 40, jn)) : e.definition.editor === "number" ? (m(), D("input", {
				key: 5,
				id: a,
				class: "form-control",
				type: "number",
				value: e.value ?? "",
				"aria-invalid": !!e.error,
				onInput: n[4] ||= (e) => O(e.target.value === "" ? null : Number(e.target.value))
			}, null, 40, Pn)) : e.definition.editor === "resource" ? (m(), D(v, { key: 6 }, [y("select", {
				id: a,
				class: "form-select",
				value: s.value,
				onChange: n[5] ||= (e) => M(e.target.value)
			}, [y("option", In, h(e.t("COM_SMARTBROWSER_USAGE_AUTO")), 1), y("option", Ln, h(e.t("COM_SMARTBROWSER_USAGE_CUSTOM")), 1)], 40, Fn), s.value === "custom" ? (m(), D("div", Rn, [
				e.value ? (m(), D("span", zn, h(c.value || e.value.id), 1)) : A("", !0),
				y("button", {
					type: "button",
					class: "btn btn-outline-primary",
					disabled: l.value,
					onClick: ee
				}, [n[6] ||= y("span", {
					class: "fas fa-plus",
					"aria-hidden": "true"
				}, null, -1), S(" " + h(e.t(e.definition.pickerLabel || "COM_SMARTBROWSER_USAGE_PICK_RESOURCE")), 1)], 8, Bn),
				e.value ? (m(), D("button", {
					key: 1,
					type: "button",
					class: "btn btn-outline-secondary",
					title: e.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					"aria-label": e.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					onClick: j
				}, [...n[7] ||= [y("span", {
					class: "fas fa-times",
					"aria-hidden": "true"
				}, null, -1)]], 8, Vn)) : A("", !0)
			])) : A("", !0)], 64)) : _.value ? (m(), D("div", {
				key: 7,
				ref_key: "customContainer",
				ref: g
			}, null, 512)) : (m(), D("small", Hn, h(e.t("COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE")), 1)),
			e.definition.description ? (m(), D("small", Un, h(e.t(e.definition.description)), 1)) : A("", !0),
			e.error || u.value ? (m(), D("small", Wn, h(e.t(e.error || u.value)), 1)) : A("", !0)
		]));
	}
}, Kn = { class: "resource-usage-editor" }, qn = ["open"], Jn = {
	__name: "SelectionUsageEditor",
	props: /*@__PURE__*/ te({
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
	emits: /*@__PURE__*/ te(["change"], ["update:secondaryOpen"]),
	setup(t) {
		let n = t, r = e(t, "secondaryOpen"), a = N(() => n.definitions.filter((e) => e.presentation === "primary")), o = N(() => n.definitions.filter((e) => e.presentation === "secondary")), s = (e) => ({
			definition: e,
			value: n.values[e.key],
			values: n.values,
			error: n.errors?.[e.key],
			resource: n.resource,
			t: n.t,
			editors: n.editors,
			resolveReference: n.resolveReference
		});
		return (e, n) => (m(), D("div", Kn, [(m(!0), D(v, null, i(a.value, (t) => (m(), b(Gn, _({ key: t.key }, { ref_for: !0 }, s(t), { onChange: (n) => e.$emit("change", t.key, n) }), null, 16, ["onChange"]))), 128)), o.value.length ? (m(), D("details", {
			key: 0,
			class: "resource-usage-secondary",
			open: r.value || o.value.some((e) => t.errors?.[e.key]),
			onToggle: n[0] ||= (e) => r.value = e.target.open
		}, [y("summary", null, [n[1] ||= y("span", {
			class: "fas fa-chevron-right resource-usage-secondary-chevron",
			"aria-hidden": "true"
		}, null, -1), S(h(t.t("COM_SMARTBROWSER_USAGE_MORE")), 1)]), (m(!0), D(v, null, i(o.value, (t) => (m(), b(Gn, _({ key: t.key }, { ref_for: !0 }, s(t), { onChange: (n) => e.$emit("change", t.key, n) }), null, 16, ["onChange"]))), 128))], 40, qn)) : A("", !0)]));
	}
}, Yn = {
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
		return w(() => [t.resourceKey, t.tab], h, { flush: "post" }), P(h), n(() => {
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
}, Xn = (e) => String(e ?? "").replaceAll(" / ", " » "), Zn = (e, t) => ({
	...e,
	label: e.source === "metadata.categoryPath" ? "COM_SMARTBROWSER_LOCATION" : e.source === "metadata.tagPaths" ? t?.type === "tag" ? "COM_SMARTBROWSER_LOCATION" : "COM_SMARTBROWSER_TAGS" : e.label
}), Qn = [
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
})), $n = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e);
function er(e, t = {}) {
	return {
		...e,
		image: e?.effectiveThumbnail || qt(e),
		selectionType: e?.metadata?.typeLabel || e?.type || "",
		selectionPath: tr(e)
	};
}
function tr(e) {
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
var nr = [
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
nr.slice(1, 3);
var rr = [
	...nr.map((e) => ({
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
], ir = rr.filter((e) => e.id !== "status").map((e) => ({
	id: e.id,
	label: e.label
}));
function ar(e, t, n = "asc") {
	let r = rr.find((e) => e.id === t);
	if (!r) return [...e];
	let i = (e) => $n(e, r.source || r.id);
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
function or(e, t) {
	let n = {
		image: "COM_SMARTBROWSER_MEDIA_IMAGE",
		document: "COM_SMARTBROWSER_MEDIA_DOCUMENT",
		video: "COM_SMARTBROWSER_MEDIA_VIDEO",
		audio: "COM_SMARTBROWSER_MEDIA_AUDIO",
		folder: "COM_SMARTBROWSER_FOLDER"
	}[e?.type], r = e?.metadata?.typeLabel || e?.type || "";
	return n ? t(n) : r ? r.charAt(0).toUpperCase() + r.slice(1) : t("COM_SMARTBROWSER_RESOURCE");
}
function sr(e, t) {
	return !e.readOnly && typeof e.onAdd == "function" && t < (e.multiple === !1 ? 1 : e.maxSelections || 500);
}
function cr(e = "auto", t = 0) {
	return e === "auto" ? t >= 800 ? "right" : "bottom" : ["left", "right"].includes(e) && t < 640 ? "bottom" : e;
}
//#endregion
//#region resources/js/components/ResourceInfoPanel.vue
var lr = {
	key: 0,
	class: "resource-info-tabs",
	role: "tablist"
}, ur = ["aria-selected"], dr = ["aria-selected"], fr = {
	key: 0,
	class: "sb-preview-selection-actions"
}, pr = [
	"disabled",
	"title",
	"aria-label"
], mr = {
	key: 0,
	class: "alert alert-warning",
	role: "status"
}, hr = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], gr = { key: 2 }, _r = { key: 3 }, vr = {
	key: 4,
	class: "sb-preview-selection-actions"
}, yr = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], br = { class: "sb-info-details" }, xr = {
	key: 0,
	class: "resource-selection-information"
}, Sr = { class: "resource-selection-path" }, Cr = [
	"value",
	"title",
	"aria-label"
], wr = ["title", "aria-label"], Tr = {
	class: "visually-hidden",
	role: "status"
}, Er = {
	key: 1,
	class: "resource-selection-usage"
}, Dr = { key: 0 }, Or = {
	key: 0,
	class: "resource-language"
}, kr = ["src"], Ar = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, jr = {
	key: 2,
	class: "resource-info-timezone"
}, Mr = { key: 1 }, Nr = { key: 0 }, Pr = { key: 1 }, Fr = {
	key: 0,
	class: "resource-info-timezone"
}, Ir = { key: 2 }, Lr = {
	key: 0,
	class: "resource-info-timezone"
}, Rr = { key: 3 }, zr = { key: 4 }, Br = { key: 5 }, Vr = { key: 6 }, Hr = {
	key: 4,
	class: "resource-info-empty",
	role: "status"
}, Ur = ["disabled"], Wr = {
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
		let t = e, n = N(() => t.address ?? tr(t.resource)), a = o(!1), u = N(() => !!(t.usageDefinitions?.length || t.previewContext && (t.previewContext.isReadOnly === !1 || Object.values(t.usageValues || {}).some((e) => e != null && e !== "")))), d = N(() => t.selectionOnly || u.value && P.value === "usage"), _ = N(() => t.resource?.unavailable ? t.t("COM_SMARTBROWSER_SELECTION_UNAVAILABLE") : d.value ? Gt(t.resource, t.usageValues).title : t.resource?.title), C = Ht, T = o(!1), E, O = 0, k = () => {
			O++, clearTimeout(E), T.value = !1;
		};
		w(n, k), p(k);
		async function j(e) {
			k();
			let n = O;
			try {
				if (await navigator.clipboard.writeText(Array.isArray(e) ? e.join("\n") : String(e)), n !== O) return;
				T.value = !0, E = setTimeout(k, 1600);
			} catch {
				window.Joomla?.renderMessages?.({ error: [t.t("COM_SMARTBROWSER_COPY_FAILED")] });
			}
		}
		let M = (e) => {
			let n = t.usageValues?.[e.key];
			if (n == null || n === "") return "—";
			if (typeof n == "boolean") return t.t(n ? "JYES" : "JNO");
			let r = e.options?.find((e) => e.value === n);
			return r ? t.t(r.label) : e.type === "resource" ? n.id : typeof n == "object" ? JSON.stringify(n) : String(n);
		}, ee = N(() => (t.usageDefinitions || []).filter((e) => !Wt([e]).length)), P = o("info"), F = o("usage"), te = (e) => {
			F.value = e, P.value = e;
		}, L = o(!1), ne = o(null), R = o(null), B = s(null), V = o(""), H;
		w(() => [R.value, t.nativePreview], () => {
			H?.disconnect();
			let e = R.value;
			if (!e || !t.nativePreview) {
				B.value = null, V.value = "";
				return;
			}
			let n = () => {
				B.value = [...e.querySelectorAll("img")].find((e) => !e.closest(".resource-visual-overlay-layer")) || null, V.value = B.value?.getAttribute("src") || "";
			};
			H = new MutationObserver(n), H.observe(e, {
				subtree: !0,
				childList: !0,
				attributes: !0,
				attributeFilter: ["src"]
			}), n();
		}, {
			flush: "post",
			immediate: !0
		}), p(() => H?.disconnect());
		let U = N(() => ({
			...t.previewContext,
			visualElement: R.value,
			imageElement: B.value,
			getImageElement: () => B.value,
			imageUrl: V.value,
			resolvedImage: t.resource,
			values: t.usageValues || {},
			notifyPresentationChange: (e) => R.value?.dispatchEvent(new CustomEvent("smartbrowser:image-presentation-change", {
				detail: e,
				bubbles: !0
			}))
		})), re;
		w(() => z(t.resource), () => re?.abort()), p(() => re?.abort()), w(u, (e) => {
			P.value = e ? F.value : "info";
		}, { immediate: !0 }), w(() => t.usageRevision, () => {
			u.value && (P.value = "usage");
		});
		async function ie(e) {
			L.value = !0, re = new AbortController();
			let n = re.signal;
			try {
				await e.run({
					...t.previewContext,
					previewElement: t.nativePreview ? R.value : ne.value?.element,
					signal: n
				});
			} catch (e) {
				n.aborted || Joomla.renderMessages({ error: [e.message || t.t("COM_SMARTBROWSER_USAGE_INVALID")] });
			} finally {
				L.value = !1;
			}
		}
		let W = N(() => {
			let e = (t.resource?.infoFields?.length ? t.resource.infoFields : t.fields || []).filter((e) => (!e.kinds || e.kinds.includes(t.resource?.kind)) && ![
				"metadata.locationPath",
				"metadata.category",
				"metadata.tags"
			].includes(e.source)), n = new Set(e.map((e) => e.source));
			return [...e, ...Qn.filter((e) => {
				let r = t.resource?.metadata?.[e.source.split(".")[1]];
				return !n.has(e.source) && r != null && r !== "";
			})].map((e) => Zn(e, t.resource));
		}), G = Vt, K = N(() => t.selectionOnly ? or(t.resource, t.t) : t.resource?.kind === "node" ? t.t("COM_SMARTBROWSER_FOLDER") : t.resource?.type ? t.resource.type.charAt(0).toUpperCase() + t.resource.type.slice(1) : t.t("COM_SMARTBROWSER_RESOURCE")), q = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, J = (e) => `${(e / 1024).toFixed(2)} KB`, Y = (e) => String(e.source || "").split(".").reduce((e, t) => e?.[t], t.resource), X = (e) => [
			"metadata.categoryPath",
			"metadata.tagPaths",
			"metadata.locationPath"
		].includes(e.source) ? Xn(Y(e)) : (e.format === "language" || e.source === "metadata.language") && Y(e) === "*" ? t.t("COM_SMARTBROWSER_ALL_LANGUAGES") : e.format === "date" ? q(Y(e)) : e.format === "size" ? Y(e) !== null && Y(e) !== void 0 ? J(Y(e)) : "" : e.format === "dimensions" ? t.resource?.metadata.width && t.resource?.metadata.height ? `${t.resource.metadata.width}px \u00d7 ${t.resource.metadata.height}px` : "" : Y(e), Z = (e) => {
			let n = String(e || "").trim().match(/(Z|[+-]\d{2}:?\d{2})$/i);
			if (!n) return "";
			let r = n[1].toUpperCase() === "Z" ? 0 : (n[1].startsWith("-") ? -1 : 1) * (Number(n[1].slice(1, 3)) * 60 + Number(n[1].slice(-2)));
			if (r === -new Date(e).getTimezoneOffset()) return "";
			let i = r >= 0 ? "+" : "-", a = Math.abs(r), o = r === 0 ? "UTC" : `UTC${i}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
			return `${t.t("COM_SMARTBROWSER_SOURCE_TIMEZONE")}: ${o}`;
		};
		return (t, o) => (m(), D("aside", { class: I(["resource-info-panel", {
			"has-usage": u.value,
			"showing-usage": u.value && P.value === "usage",
			"is-empty-selection": e.selectionOnly && !e.resource,
			"is-selection-panel": e.selectionOnly
		}]) }, [e.resource && !e.selectionOnly && u.value ? (m(), D("div", lr, [y("button", {
			type: "button",
			role: "tab",
			"aria-selected": P.value === "usage",
			onClick: o[0] ||= (e) => te("usage")
		}, h(e.t("COM_SMARTBROWSER_USAGE_OPTIONS")), 9, ur), y("button", {
			type: "button",
			role: "tab",
			"aria-selected": P.value === "info",
			onClick: o[1] ||= (e) => te("info")
		}, h(e.t("COM_SMARTBROWSER_USAGE_INFO")), 9, dr)])) : A("", !0), x(Yn, {
			disabled: e.selectionOnly,
			"resource-key": f(z)(e.resource),
			tab: P.value
		}, {
			default: c(() => [
				e.selectionOnly ? l((m(), D("div", {
					key: 0,
					ref_key: "nativePreviewElement",
					ref: R,
					class: "sb-native-preview-host"
				}, [e.nativePreview && e.resource ? (m(), b(pn, {
					key: 0,
					context: U.value
				}, null, 8, ["context"])) : A("", !0), e.nativePreview && e.resource ? (m(), b(gn, {
					key: 1,
					"image-element": B.value,
					context: U.value
				}, null, 8, ["image-element", "context"])) : A("", !0)], 512)), [[g, e.nativePreview]]) : A("", !0),
				e.selectionOnly && !e.resource && !e.nativePreview ? (m(), b(Cn, {
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
				e.selectionOnly && !e.resource ? (m(), D(v, { key: 2 }, [y("h3", null, h(e.t(e.nativePreview ? "COM_SMARTBROWSER_NO_IMAGE_SELECTED" : "COM_SMARTBROWSER_COLLECTION_EMPTY")), 1), e.allowQuickAdd ? (m(), D("div", fr, [y("button", {
					type: "button",
					class: "resource-preview-add",
					disabled: e.addDisabled,
					title: e.t("COM_SMARTBROWSER_COLLECTION_ADD"),
					"aria-label": e.t("COM_SMARTBROWSER_COLLECTION_ADD"),
					onClick: o[2] ||= (e) => t.$emit("selection-add")
				}, [...o[9] ||= [y("span", { class: "fas fa-plus" }, null, -1)]], 8, pr)])) : A("", !0)], 64)) : A("", !0),
				e.resource ? (m(), D(v, { key: 3 }, [
					e.resource.unavailable || e.resource.metadata?.state === -2 ? (m(), D("p", mr, h(e.t("COM_SMARTBROWSER_SELECTION_UNAVAILABLE")), 1)) : A("", !0),
					!e.resource.unavailable && e.resource.metadata?.state !== -2 ? (m(), b(Cn, {
						key: 1,
						ref_key: "previewElement",
						ref: ne,
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
							disabled: L.value,
							title: e.t(t.label),
							"aria-label": e.t(t.label),
							onClick: (e) => ie(t)
						}, [y("span", {
							class: I(t.icon || "fas fa-bolt"),
							"aria-hidden": "true"
						}, null, 2)], 8, hr))), 128))]),
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
					e.selectionOnly ? (m(), D("h3", gr, h(_.value), 1)) : (m(), D("h3", _r, h(_.value), 1)),
					e.selectionActions?.length ? (m(), D("div", vr, [(m(!0), D(v, null, i(e.selectionActions, (n) => (m(), D("button", {
						key: n.id,
						type: "button",
						disabled: n.disabled,
						title: e.t(n.label),
						"aria-label": e.t(n.label),
						class: I({
							"resource-preview-remove": n.id === "collectionRemove",
							"resource-preview-add": n.id === "collectionAdd"
						}),
						onClick: (e) => t.$emit("selection-action", n)
					}, [x(wn, { icon: n.icon }, null, 8, ["icon"])], 10, yr))), 128)), r(t.$slots, "quick-actions")])) : A("", !0),
					y("div", br, [
						e.selectionOnly ? (m(), D("dl", xr, [y("div", null, [y("dt", null, [o[10] ||= y("span", {
							class: "fas fa-link",
							"aria-hidden": "true"
						}, null, -1), S(h(e.t("COM_SMARTBROWSER_URI")), 1)]), y("dd", Sr, [
							y("input", {
								type: "text",
								value: n.value,
								title: n.value,
								"aria-label": e.t("COM_SMARTBROWSER_URI"),
								class: "sb-reference-readonly",
								readonly: "",
								"aria-readonly": "true"
							}, null, 8, Cr),
							y("button", {
								type: "button",
								class: I({ "is-copied": T.value }),
								title: e.t(T.value ? "COM_SMARTBROWSER_COPIED" : "COM_SMARTBROWSER_COPY_PATH"),
								"aria-label": e.t(T.value ? "COM_SMARTBROWSER_COPIED" : "COM_SMARTBROWSER_COPY_PATH"),
								onClick: o[5] ||= (e) => j(n.value)
							}, [y("span", {
								class: I(T.value ? "fas fa-check" : "fas fa-copy"),
								"aria-hidden": "true"
							}, null, 2)], 10, wr),
							y("span", Tr, h(T.value ? e.t("COM_SMARTBROWSER_COPIED") : ""), 1)
						])])])) : A("", !0),
						e.selectionOnly && e.usageMode === "readonly" && e.usageDefinitions?.length ? (m(), D("dl", Er, [(m(!0), D(v, null, i(e.usageDefinitions, (t) => (m(), D("div", { key: t.key }, [y("dt", null, [t.key === "media.decorative" ? A("", !0) : (m(), D("span", {
							key: 0,
							class: I(f(C)(t)),
							"aria-hidden": "true"
						}, null, 2)), S(h(e.t(t.label)), 1)]), y("dd", null, h(M(t)), 1)]))), 128))])) : A("", !0),
						e.usageDefinitions?.length && (e.selectionOnly ? e.usageMode === "editable" : P.value === "usage") ? (m(), b(Jn, {
							key: f(z)(e.resource),
							"secondary-open": a.value,
							"onUpdate:secondaryOpen": o[6] ||= (e) => a.value = e,
							definitions: ee.value,
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
					!e.selectionOnly && !d.value ? (m(), D(v, { key: 5 }, [e.fields?.length ? (m(), D("dl", Dr, [(m(!0), D(v, null, i(W.value, (t) => l((m(), D("div", { key: `${t.source}-${t.label}` }, [
						y("dt", null, [y("span", {
							class: I(f(G)(t)),
							"aria-hidden": "true"
						}, null, 2), S(h(e.t(t.label)), 1)]),
						t.format === "language" ? (m(), D("dd", Or, [e.resource.metadata?.languageImage ? (m(), D("img", {
							key: 0,
							src: e.resource.metadata.languageImage,
							alt: "",
							"aria-hidden": "true"
						}, null, 8, kr)) : Y(t) === "*" ? (m(), D("span", Ar)) : A("", !0), y("span", null, h(X(t)), 1)])) : (m(), D("dd", {
							key: 1,
							class: I({
								"resource-info-identifier": t.source === "metadata.alias" || t.source === "metadata.username",
								"resource-info-lines": t.source === "metadata.tagPaths"
							})
						}, h(X(t)), 3)),
						t.format === "date" && Z(Y(t)) ? (m(), D("small", jr, h(Z(Y(t))), 1)) : A("", !0)
					])), [[g, X(t) !== "" && X(t) !== null && X(t) !== void 0]])), 128))])) : (m(), D("dl", Mr, [
						e.resource.parentId ? (m(), D("div", Nr, [y("dt", null, [o[11] ||= y("span", {
							class: "fas fa-folder",
							"aria-hidden": "true"
						}, null, -1), S(h(e.t("COM_SMARTBROWSER_FOLDER")), 1)]), y("dd", null, h(e.resource.parentId), 1)])) : A("", !0),
						y("div", null, [y("dt", null, [o[12] ||= y("span", {
							class: "fas fa-file-alt",
							"aria-hidden": "true"
						}, null, -1), S(h(e.t("COM_SMARTBROWSER_TYPE")), 1)]), y("dd", null, h(K.value), 1)]),
						e.resource.metadata.created ? (m(), D("div", Pr, [
							y("dt", null, [o[13] ||= y("span", {
								class: "fas fa-calendar",
								"aria-hidden": "true"
							}, null, -1), S(h(e.t("COM_SMARTBROWSER_DATE_CREATED")), 1)]),
							y("dd", null, h(q(e.resource.metadata.created)), 1),
							Z(e.resource.metadata.created) ? (m(), D("small", Fr, h(Z(e.resource.metadata.created)), 1)) : A("", !0)
						])) : A("", !0),
						e.resource.metadata.modified ? (m(), D("div", Ir, [
							y("dt", null, [o[14] ||= y("span", {
								class: "fas fa-calendar",
								"aria-hidden": "true"
							}, null, -1), S(h(e.t("COM_SMARTBROWSER_DATE_MODIFIED")), 1)]),
							y("dd", null, h(q(e.resource.metadata.modified)), 1),
							Z(e.resource.metadata.modified) ? (m(), D("small", Lr, h(Z(e.resource.metadata.modified)), 1)) : A("", !0)
						])) : A("", !0),
						e.resource.metadata.width && e.resource.metadata.height ? (m(), D("div", Rr, [y("dt", null, [o[15] ||= y("span", {
							class: "fas fa-expand",
							"aria-hidden": "true"
						}, null, -1), S(h(e.t("COM_SMARTBROWSER_DIMENSIONS")), 1)]), y("dd", null, h(e.resource.metadata.width) + "px × " + h(e.resource.metadata.height) + "px", 1)])) : A("", !0),
						e.resource.metadata.size ? (m(), D("div", zr, [y("dt", null, [o[16] ||= y("span", {
							class: "fas fa-database",
							"aria-hidden": "true"
						}, null, -1), S(h(e.t("COM_SMARTBROWSER_SIZE")), 1)]), y("dd", null, h(J(e.resource.metadata.size)), 1)])) : A("", !0),
						e.resource.metadata.mimeType ? (m(), D("div", Br, [y("dt", null, [o[17] ||= y("span", {
							class: "fas fa-file-alt",
							"aria-hidden": "true"
						}, null, -1), S(h(e.t("COM_SMARTBROWSER_MIME_TYPE")), 1)]), y("dd", null, h(e.resource.metadata.mimeType), 1)])) : A("", !0),
						e.resource.metadata.extension ? (m(), D("div", Vr, [y("dt", null, [o[18] ||= y("span", {
							class: "fas fa-file-alt",
							"aria-hidden": "true"
						}, null, -1), S(h(e.t("COM_SMARTBROWSER_EXTENSION")), 1)]), y("dd", null, h(e.resource.metadata.extension), 1)])) : A("", !0),
						y("div", null, [y("dt", null, [o[19] ||= y("span", {
							class: "fas fa-key",
							"aria-hidden": "true"
						}, null, -1), S(h(e.t("JGLOBAL_FIELD_ID_LABEL")), 1)]), y("dd", null, h(e.resource.metadata.id ?? e.resource.id), 1)])
					]))], 64)) : A("", !0)
				], 64)) : (m(), D("div", Hr, [
					e.allowAdd ? (m(), D("button", {
						key: 0,
						type: "button",
						class: "btn btn-outline-secondary",
						disabled: e.addDisabled,
						onClick: o[8] ||= (e) => t.$emit("selection-add")
					}, [o[20] ||= y("span", { class: "fas fa-plus" }, null, -1), S(" " + h(e.t("COM_SMARTBROWSER_SELECT_RESOURCE")), 1)], 8, Ur)) : A("", !0),
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
}, Gr = { class: "resource-ordering-moves" }, Kr = [
	"disabled",
	"title",
	"aria-label"
], qr = [
	"disabled",
	"title",
	"aria-label"
], Jr = {
	__name: "ResourceOrderingControls",
	props: {
		enabled: Boolean,
		t: Function
	},
	emits: ["reorder"],
	setup(e) {
		return (t, n) => (m(), D("span", Gr, [y("button", {
			type: "button",
			disabled: !e.enabled,
			title: e.t("COM_SMARTBROWSER_MOVE_UP"),
			"aria-label": e.t("COM_SMARTBROWSER_MOVE_UP"),
			onClick: n[0] ||= (e) => t.$emit("reorder", "up")
		}, [...n[2] ||= [y("span", {
			class: "fas fa-arrow-up",
			"aria-hidden": "true"
		}, null, -1)]], 8, Kr), y("button", {
			type: "button",
			disabled: !e.enabled,
			title: e.t("COM_SMARTBROWSER_MOVE_DOWN"),
			"aria-label": e.t("COM_SMARTBROWSER_MOVE_DOWN"),
			onClick: n[1] ||= (e) => t.$emit("reorder", "down")
		}, [...n[3] ||= [y("span", {
			class: "fas fa-arrow-down",
			"aria-hidden": "true"
		}, null, -1)]], 8, qr)]));
	}
}, Yr = ["popover"], Xr = [
	"title",
	"aria-label",
	"aria-expanded",
	"popovertarget"
], Zr = 0, Qr = {
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
		let a = e, s = `sb-toolbar-popup-${++Zr}`, c = o(null), u = o(null), d = o(null), f = o(!1), h = o(!1), _, v, b = () => S();
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
			f.value = !0, await F(), u.value.querySelector("input:not(:disabled), select:not(:disabled), button:not(:disabled)")?.focus({ preventScroll: !0 });
		}
		async function w(e) {
			h.value || (f.value = e.newState === "open", f.value && (await F(), x(), u.value.querySelector("input:not(:disabled), select:not(:disabled), button:not(:disabled)")?.focus({ preventScroll: !0 })));
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
			class: I(["resource-toolbar-popup", {
				"is-inline": h.value,
				"is-aligned-start": e.alignment === "start"
			}]),
			onKeydown: T
		}, [l(y("div", {
			id: s,
			ref_key: "panel",
			ref: u,
			popover: h.value ? void 0 : "auto",
			class: I(["resource-toolbar-popup-panel", e.panelClass]),
			style: t({ "--sb-toolbar-popup-width": `${e.width}px` }),
			onToggle: w
		}, [r(n.$slots, "default")], 46, Yr), [[g, f.value || !h.value]]), y("button", {
			ref_key: "button",
			ref: d,
			type: "button",
			class: I(["resource-icon-button", { active: f.value }]),
			title: e.label,
			"aria-label": e.label,
			"aria-expanded": f.value,
			"aria-controls": s,
			popovertarget: h.value ? void 0 : s,
			onClick: i[0] ||= (e) => h.value && C()
		}, [y("span", {
			class: I(e.icon),
			"aria-hidden": "true"
		}, null, 2)], 10, Xr)], 34));
	}
}, $r = { class: "resource-column-menu-title" }, ei = [
	"checked",
	"disabled",
	"onChange"
], ti = {
	__name: "ResourceColumnPicker",
	props: {
		columns: Array,
		hiddenColumns: Array,
		shownColumns: Array,
		t: Function
	},
	emits: ["toggle-column"],
	setup(e) {
		return (t, n) => (m(), b(Qr, {
			class: "resource-column-picker",
			label: e.t("COM_SMARTBROWSER_COLUMNS"),
			icon: "fas fa-columns",
			"panel-class": "resource-column-menu",
			width: 220
		}, {
			default: c(() => [y("div", $r, h(e.t("COM_SMARTBROWSER_COLUMNS")), 1), (m(!0), D(v, null, i(e.columns, (n) => (m(), D("label", {
				key: n.id,
				class: "resource-column-choice"
			}, [y("input", {
				type: "checkbox",
				checked: n.defaultVisible === !1 ? e.shownColumns?.includes(n.id) : !e.hiddenColumns?.includes(n.id),
				disabled: n.id === "title" || n.id === "name",
				onChange: (e) => t.$emit("toggle-column", n.id)
			}, null, 40, ei), y("span", null, h(e.t(n.label || (n.dateGroup ? "COM_SMARTBROWSER_DATE" : n.fields?.[0]?.label))), 1)]))), 128))]),
			_: 1
		}, 8, ["label"]));
	}
}, ni = { class: "resource-sort-controls" }, ri = ["value", "aria-label"], ii = ["value"], ai = ["value"], oi = [
	"disabled",
	"title",
	"aria-label"
], si = {
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
		return (t, n) => (m(), b(Qr, {
			alignment: e.alignment,
			label: e.t("COM_SMARTBROWSER_SORT_BY"),
			icon: "fas fa-signal",
			"panel-class": "resource-sort-menu",
			width: 260
		}, {
			default: c(() => [y("div", ni, [y("select", {
				value: e.sortBy,
				class: "form-select",
				"aria-label": e.t("COM_SMARTBROWSER_SORT_BY"),
				onChange: n[0] ||= (e) => t.$emit("sort-by", e.target.value)
			}, [e.defaultValue === null ? A("", !0) : (m(), D("option", {
				key: 0,
				value: e.defaultValue
			}, h(e.t(e.defaultLabel)), 9, ii)), (m(!0), D(v, null, i(e.fields, (t) => (m(), D("option", {
				key: t.id,
				value: t.id
			}, h(e.t(t.label)), 9, ai))), 128))], 40, ri), y("button", {
				type: "button",
				class: "resource-icon-button",
				disabled: !e.sortBy,
				title: e.t("COM_SMARTBROWSER_SORT_DIRECTION"),
				"aria-label": e.t("COM_SMARTBROWSER_SORT_DIRECTION"),
				onClick: n[1] ||= (n) => t.$emit("sort-direction-value", e.sortDirection === "desc" ? "asc" : "desc")
			}, [y("span", {
				class: I(e.sortDirection === "desc" ? "fas fa-sort-amount-down-alt" : "fas fa-sort-amount-up"),
				"aria-hidden": "true"
			}, null, 2)], 8, oi)])]),
			_: 1
		}, 8, ["alignment", "label"]));
	}
}, ci = "contextual", li = (e, t) => ({
	...e,
	focusable: e.focusable ?? t.focusable,
	selectable: e.selectable ?? t.selectable,
	bulkSelectable: e.bulkSelectable ?? e.selectable ?? t.bulkSelectable,
	actionable: e.actionable ?? t.actionable,
	navigable: e.navigable ?? t.navigable,
	activatable: e.activatable ?? t.activatable
}), ui = (e) => li({
	...e,
	role: e.role || "primary"
}, {
	focusable: !0,
	selectable: !1,
	bulkSelectable: !1,
	actionable: !0,
	navigable: !1,
	activatable: !0
}), di = (e) => ({
	...e,
	role: ci,
	focusable: e.focusable ?? !0,
	selectable: !1,
	bulkSelectable: !1,
	actionable: !1,
	navigable: !1,
	activatable: !1,
	interactiveOverlays: !1,
	capabilities: {}
}), fi = (e) => e?.role === ci, pi = (e) => e?.focusable === !0, mi = (e, t = "both") => e?.selectable === !0 && (t === "both" || e.kind === t), hi = (e, t = "both") => mi(e, t) && e?.bulkSelectable === !0, gi = (e) => e?.actionable === !0, _i = () => ({
	id: "browseOpen",
	label: "COM_SMARTBROWSER_OPEN",
	icon: "fas fa-folder-open",
	local: !0
}), vi = () => ({
	id: "pickerSelect",
	label: "COM_SMARTBROWSER_SELECT",
	icon: "fas fa-check",
	local: !0
}), yi = (e, t, n, r, i) => e?.kind !== "node" || !e.navigable || e.hasChildren !== !1 || !e.activatable ? null : t === "select" ? n.some((e) => e.defaultOnLeaf === !0) && mi(e, i) ? vi() : null : t === "manage" && gi(e) ? n.find((t) => t.defaultOnLeaf === !0 && r(t, [e])) : null, bi = (e, t, n, r) => ["manage", "select"].includes(t) && gi(e) && n.find((t) => t.id === "preview" && r(t, [e])) || null;
function xi(e, t, n, r, i = "both") {
	return yi(e, t, n, r, i) ? _i() : e?.kind === "node" ? t === "select" ? mi(e, i) ? vi() : null : t === "manage" && gi(e) && n.find((t) => t.id === "edit" && r(t, [e])) || null : (["manage", "select"].includes(t) && gi(e) ? n.find((t) => t.modifiedDefault === !0 && r(t, [e])) : null) || bi(e, t, n, r);
}
function Si(e, t, n, r, i = "both") {
	return yi(e, t, n, r, i) || (e?.navigable ? _i() : e?.activatable ? t === "select" ? mi(e, i) ? vi() : null : gi(e) && n.find((n) => n.id === (t === "manage" ? "edit" : "preview") && r(n, [e])) || null : null);
}
//#endregion
//#region resources/js/core/previewExtensionContext.js
function Ci(e) {
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
			return t == null ? Object.fromEntries(Object.entries($t(n)).map(([e, t]) => [e.slice(4), tn(t)])) : n[en(t)] === void 0 ? void 0 : tn(n[en(t)]);
		},
		setMetadata(n, r) {
			t();
			let i = en(n), a = tn(r), o = {
				...e.getValues?.(),
				[i]: a
			};
			if (Object.keys(o).length > 100) throw TypeError("Too many selection properties.");
			return tn(o), e.setValue(i, a);
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
function wi(e, t, n) {
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
var Ti = (e, t, n, r = null, i = null) => {
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
function Ei() {
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
var Di = ["title"], Oi = ["checked", "aria-label"], ki = [
	"data-sb-resource-key",
	"role",
	"tabindex",
	"aria-pressed",
	"onClick",
	"onDblclick",
	"onKeydown"
], Ai = [
	"checked",
	"aria-label",
	"onChange"
], ji = [
	"aria-expanded",
	"title",
	"onClick"
], Mi = [
	"title",
	"disabled",
	"onClick"
], Ni = { class: "resource-item-visual" }, Pi = {
	key: 0,
	class: "resource-item-overlays"
}, Fi = ["title", "onClick"], Ii = ["src"], Li = ["title"], Ri = ["src"], zi = ["title"], Bi = ["title"], Vi = { class: "resource-item-metadata-text" }, Hi = {
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
	setup(e, { emit: a }) {
		let s = e, c = Ei(), l = a, u = (e, t) => {
			if (c.accepts(z(e), t)) {
				if ((t?.ctrlKey || t?.metaKey) && (s.modifiedAction || s.previewAction)) {
					let t = s.modifiedAction ? s.modifiedAction(e) : s.previewAction(e);
					if (t && s.actionAvailable(t, [e])) {
						l("action", t, e);
						return;
					}
				}
				if (s.defaultAction) {
					let t = s.defaultAction(e);
					t && s.actionAvailable(t, [e]) && l("action", t, e);
				} else e.navigable ? l("open", e.id) : e.activatable ? l("activate", e) : l("focus", e);
			}
		}, d = o(null), g = o(!1), _ = o(0), b = async (e, t) => {
			if (d.value === e) {
				d.value = null;
				return;
			}
			let n = t.currentTarget.closest(".resource-browser-item"), r = n?.closest(".resource-browser");
			if (g.value = !1, _.value = r ? Math.max(0, Math.min(360, r.clientWidth - 8, window.innerWidth - 20)) : 0, d.value = e, await F(), d.value !== e || !r) return;
			let i = n.querySelector(".resource-item-menu");
			g.value = i?.getBoundingClientRect().left < r.getBoundingClientRect().left + 4;
		}, C = (e) => Ti(s.actions, e, s.actionAvailable, s.defaultAction?.(e), (s.modifiedAction || s.previewAction)?.(e)), w = (e, t) => gi(t) && t.interactiveOverlays !== !1 ? s.actions.find((n) => n.id === e.action && s.actionAvailable(n, [t])) : void 0, T = () => {
			d.value = null;
		}, E = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e), O = (e) => {
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
				e.type === "article" && s.gridFields?.some((e) => e.source === "metadata.cardSummaryWithCategory") ? n("JCATEGORY", t.category, "fas fa-folder") : null
			].filter(Boolean) : e.kind === "item" && t.mimeType ? [n("COM_SMARTBROWSER_MIME_TYPE", t.mimeType, "fas fa-file-alt"), e.type === "image" && t.width > 0 && t.height > 0 ? n("COM_SMARTBROWSER_DIMENSIONS", `${t.width} × ${t.height}`, "fas fa-expand") : null].filter(Boolean) : (e.collectionPresentation?.gridFields || s.gridFields || []).map((t) => n(t.label || "COM_SMARTBROWSER_DETAILS", t.format === "date" ? O(E(e, t.source)) : E(e, t.source), t.icon || "fas fa-info")).filter(Boolean);
		};
		return n(() => document.addEventListener("click", T)), p(() => document.removeEventListener("click", T)), (n, a) => (m(), D("div", { class: I(["resource-browser-grid", `size-${e.options.gridSize}`]) }, [
			e.selectionControls ? (m(), D("div", {
				key: 0,
				class: I(["resource-view-icons", { active: e.allSelected }])
			}, [y("label", {
				class: "resource-grid-select-all",
				title: e.t("COM_SMARTBROWSER_SELECT_ALL")
			}, [y("input", {
				type: "checkbox",
				checked: e.allSelected,
				"aria-label": e.t("COM_SMARTBROWSER_SELECT_ALL"),
				onChange: a[0] ||= (e) => n.$emit("select-all")
			}, null, 40, Oi)], 8, Di)], 2)) : A("", !0),
			(m(!0), D(v, null, i(e.resources, (r) => (m(), D("div", {
				key: f(z)(r),
				"data-sb-resource-key": f(z)(r),
				class: I(["resource-browser-item", {
					selected: e.selectedIds.includes(f(z)(r)),
					focused: e.focusedId === f(z)(r),
					active: d.value === f(z)(r),
					contextual: f(fi)(r)
				}]),
				role: f(pi)(r) ? "button" : void 0,
				tabindex: f(pi)(r) ? 0 : void 0,
				"aria-pressed": f(mi)(r) ? e.selectedIds.includes(f(z)(r)) : void 0,
				onClick: M((e) => {
					f(c).click(f(z)(r), e), d.value = null, n.$emit("select", r, e.ctrlKey || e.metaKey);
				}, ["stop"]),
				onDblclick: M((e) => u(r, e), ["stop"]),
				onKeydown: k(M((e) => u(r), ["prevent"]), ["enter"]),
				onMouseleave: a[3] ||= (e) => d.value = null
			}, [
				e.selectionControls && f(mi)(r) ? (m(), D("label", {
					key: 0,
					class: I(["resource-item-select", { checked: e.selectedIds.includes(f(z)(r)) }]),
					onClick: a[1] ||= M(() => {}, ["stop"])
				}, [y("input", {
					type: "checkbox",
					checked: e.selectedIds.includes(f(z)(r)),
					"aria-label": r.title,
					onChange: (e) => n.$emit("select", r, !0)
				}, null, 40, Ai)], 2)) : A("", !0),
				C(r).length ? (m(), D("button", {
					key: 1,
					type: "button",
					class: "resource-item-menu-toggle",
					"aria-expanded": d.value === f(z)(r),
					title: e.t("COM_SMARTBROWSER_ACTIONS"),
					onClick: M((e) => {
						n.$emit("focus", r), b(f(z)(r), e);
					}, ["stop"])
				}, [...a[4] ||= [y("span", {
					class: "fas fa-ellipsis-h",
					"aria-hidden": "true"
				}, null, -1)]], 8, ji)) : A("", !0),
				d.value === f(z)(r) ? (m(), D("div", {
					key: 2,
					class: I(["resource-item-menu", { "align-start": g.value }]),
					style: t(_.value ? { maxWidth: `${_.value}px` } : null),
					onClick: a[2] ||= M(() => {}, ["stop"])
				}, [y("strong", null, h(r.title), 1), (m(!0), D(v, null, i(C(r), (t) => (m(), D("button", {
					key: t.id,
					type: "button",
					class: I([`resource-action-${t.id}`, {
						"resource-default-action": t.isDefault,
						"resource-modified-action": t.isModified
					}]),
					title: t.isDefault ? e.t("COM_SMARTBROWSER_DOUBLE_CLICK") : t.isModified ? e.t("COM_SMARTBROWSER_CTRL_DOUBLE_CLICK") : void 0,
					disabled: !e.actionAvailable(t, [r]),
					onClick: (e) => {
						d.value = null, n.$emit("action", t, r);
					}
				}, [x(wn, { icon: t.icon }, null, 8, ["icon"]), S(" " + h(e.t(t.label)), 1)], 10, Mi))), 128))], 6)) : A("", !0),
				y("span", Ni, [x(re, { resource: r }, null, 8, ["resource"]), r.overlays?.length ? (m(), D("span", Pi, [(m(!0), D(v, null, i(r.overlays, (t) => (m(), D(v, { key: t.id }, [w(t, r) ? (m(), D("button", {
					key: 0,
					type: "button",
					class: I(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
					title: f(wi)(t, w(t, r), e.t),
					onClick: M((e) => {
						n.$emit("focus", r), n.$emit("action", w(t, r), r);
					}, ["stop"])
				}, [t.image ? (m(), D("img", {
					key: 0,
					src: t.image,
					alt: "",
					"aria-hidden": "true"
				}, null, 8, Ii)) : (m(), D("span", {
					key: 1,
					class: I(t.icon),
					"aria-hidden": "true"
				}, null, 2))], 10, Fi)) : (m(), D("span", {
					key: 1,
					class: I(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
					title: f(wi)(t, w(t, r), e.t)
				}, [t.image ? (m(), D("img", {
					key: 0,
					src: t.image,
					alt: "",
					"aria-hidden": "true"
				}, null, 8, Ri)) : (m(), D("span", {
					key: 1,
					class: I(t.icon),
					"aria-hidden": "true"
				}, null, 2))], 10, Li))], 64))), 128))])) : A("", !0)]),
				y("span", {
					class: "resource-item-title",
					title: `${e.t("COM_SMARTBROWSER_NAME")}: ${r.title}`
				}, h(r.title), 9, zi),
				(m(!0), D(v, null, i(j(r), (t) => (m(), D("span", {
					key: t.label,
					class: I(["resource-item-metadata", { "resource-item-identifier": t.identifier }]),
					title: `${e.t(t.label)}: ${t.value}`
				}, [y("span", {
					class: I(t.icon),
					"aria-hidden": "true"
				}, null, 2), y("span", Vi, h(t.value), 1)], 10, Bi))), 128))
			], 42, ki))), 128)),
			r(n.$slots, "end")
		], 2));
	}
}, Ui = { class: "table-responsive resource-details-view" }, Wi = { class: "table table-hover" }, Gi = {
	class: "resource-type-column resource-details-select-column",
	scope: "col"
}, Ki = { class: "resource-details-select-controls" }, qi = ["title"], Ji = [
	"checked",
	"title",
	"aria-label"
], Yi = ["title", "aria-label"], Xi = [
	"title",
	"aria-label",
	"onClick"
], Zi = ["title"], Qi = [
	"data-sb-resource-key",
	"tabindex",
	"aria-current",
	"onClick",
	"onDblclick",
	"onKeydown"
], $i = { class: "resource-type-column" }, ea = [
	"checked",
	"aria-label",
	"onChange"
], ta = ["title"], na = { class: "resource-cell-ellipsis" }, ra = ["title"], ia = ["title", "onClick"], aa = { class: "visually-hidden" }, oa = ["title"], sa = { class: "visually-hidden" }, ca = {
	key: 1,
	class: "resource-language"
}, la = ["src"], ua = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, da = { class: "resource-language-name" }, fa = {
	key: 2,
	class: "resource-location-path"
}, pa = {
	key: 0,
	class: "resource-location-parents"
}, ma = { class: "resource-location-current" }, ha = {
	key: 3,
	class: "resource-cell-ellipsis"
}, ga = {
	key: 4,
	class: "resource-row-overlays"
}, _a = ["title", "onClick"], va = ["src"], ya = ["title"], ba = ["src"], xa = { class: "resource-row-actions" }, Sa = [
	"aria-expanded",
	"title",
	"onClick"
], Ca = [
	"title",
	"disabled",
	"onClick"
], wa = {
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
	setup(e, { emit: a }) {
		let s = Ei(), c = e, l = a, u = (e, t) => {
			if (s.accepts(z(e), t)) {
				if ((t?.ctrlKey || t?.metaKey) && (c.modifiedAction || c.previewAction)) {
					let t = c.modifiedAction ? c.modifiedAction(e) : c.previewAction(e);
					if (t && c.actionAvailable(t, [e])) {
						l("action", t, e);
						return;
					}
				}
				if (c.defaultAction) {
					let t = c.defaultAction(e);
					t && c.actionAvailable(t, [e]) && l("action", t, e);
				} else e.navigable ? l("open", e.id) : e.activatable ? l("activate", e) : l("focus", e);
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
		], g = () => [
			"created",
			"modified",
			"both"
		].includes(c.options.detailsDateMode) ? c.options.detailsDateMode : "modified", _ = (e) => {
			if (!e.dateGroup) return [e];
			let t = e.fields || [];
			return g() === "both" ? t : t.filter((e) => e.id === g());
		}, b = N(() => (c.columns?.length ? c.columns : d).flatMap(_)), C = N(() => 44 + 24 * Math.max(0, ...(c.resources || []).map((e) => (e.overlays || []).filter((e) => e.id !== "status").length))), w = N(() => Math.max(48, 24 + 8 * Math.max(1, ...(c.resources || []).map((e) => String(e.metadata?.id ?? "").length)))), T = (e) => {
			let t = e.id === "status" && e.overlays ? C.value : e.id === "id" ? w.value : null;
			return t === null ? null : {
				width: `${t}px`,
				minWidth: `${t}px`
			};
		}, E = (e) => e.headerIcon || (Object.hasOwn(Bt, e.id) ? Bt[e.id] : "fas fa-info"), O = (e) => e.sortField || e.id, j = (e) => c.t(e.label), ee = (e) => (c.sortFields || d).some((t) => t.id === O(e)), P = (e) => c.sortBy === e ? c.sortDirection === "asc" ? "fas fa-caret-up ms-1" : "fas fa-caret-down ms-1" : "fas fa-sort ms-1", F = (e) => e ? `${(e / 1024).toFixed(2)}KB` : "", te = (e) => e.metadata.width && e.metadata.height ? `${e.metadata.width}px \u00d7 ${e.metadata.height}px` : "", L = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, ne = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e), R = (e, t) => {
			if (t.id === "location") return String(e.metadata?.locationPath || e.metadata?.location || e.metadata?.categoryPath || e.metadata?.parentPath || e.metadata?.parent || "").replaceAll(" / ", " » ");
			if (t.id === "size") return e.kind === "node" ? "" : F(e.metadata.size);
			if (t.id === "dimension") return te(e);
			let n = t.source || `metadata.${t.id}`, r = ne(e, n);
			return t.format === "size" ? F(r) : t.format === "dimensions" ? te(e) : t.format === "date" || ["created", "modified"].includes(t.id) ? L(r) : t.format === "mediaType" ? c.t({
				folder: "COM_SMARTBROWSER_FOLDER",
				image: "COM_SMARTBROWSER_MEDIA_IMAGE",
				document: "COM_SMARTBROWSER_MEDIA_DOCUMENT",
				video: "COM_SMARTBROWSER_MEDIA_VIDEO",
				audio: "COM_SMARTBROWSER_MEDIA_AUDIO"
			}[r] || "COM_SMARTBROWSER_RESOURCE") : t.format === "language" && r === "*" ? c.t("COM_SMARTBROWSER_ALL_LANGUAGES") : ["categoryPath", "tagPaths"].includes(t.id) ? String(r ?? "").replaceAll(" / ", " » ") : r ?? "";
		}, B = (e, t) => t.id === "location" ? String(R(e, t) || "") : t.format === "status" ? H(e).label : String(R(e, t) || ""), V = (e, t) => {
			let n = String(R(e, t)), r = n.lastIndexOf(" » ");
			return r < 0 ? {
				parent: "",
				leaf: n
			} : {
				parent: n.slice(0, r),
				leaf: n.slice(r)
			};
		}, H = (e) => ({
			icon: e.statusPresentation?.icon || "fas fa-question-circle",
			label: e.statusPresentation?.label || R(e, { source: "metadata.stateLabel" }),
			class: `status-${e.statusPresentation?.tone || "neutral"}`
		}), U = (e) => e.overlays?.find((e) => e.id === "status") || {}, ie = o(null), W = (e) => {
			ie.value = ie.value === e ? null : e;
		}, G = (e) => Ti(c.actions, e, c.actionAvailable, c.defaultAction?.(e), (c.modifiedAction || c.previewAction)?.(e)), K = (e, t) => gi(t) && t.interactiveOverlays !== !1 ? c.actions.find((n) => n.id === e.action && c.actionAvailable(n, [t])) : void 0, q = () => {
			ie.value = null;
		};
		return n(() => document.addEventListener("click", q)), p(() => document.removeEventListener("click", q)), (n, a) => (m(), D("div", Ui, [y("table", Wi, [y("thead", null, [y("tr", null, [
			y("th", Gi, [y("span", Ki, [e.selectionControls ? (m(), D("label", {
				key: 0,
				class: "resource-details-select-all",
				title: e.t("COM_SMARTBROWSER_SELECT_ALL")
			}, [y("input", {
				type: "checkbox",
				checked: e.allSelected,
				title: e.t("COM_SMARTBROWSER_SELECT_ALL"),
				"aria-label": e.t("COM_SMARTBROWSER_SELECT_ALL"),
				onChange: a[0] ||= (e) => n.$emit("select-all")
			}, null, 40, Ji)], 8, qi)) : A("", !0), e.orderingField ? (m(), D("button", {
				key: 1,
				type: "button",
				class: "resource-ordering-sort",
				title: e.t("COM_SMARTBROWSER_ORDERING"),
				"aria-label": e.t("COM_SMARTBROWSER_ORDERING"),
				onClick: a[1] ||= (t) => n.$emit("sort", e.orderingField)
			}, [y("span", {
				class: I(P(e.orderingField)),
				"aria-hidden": "true"
			}, null, 2)], 8, Yi)) : A("", !0)])]),
			(m(!0), D(v, null, i(b.value, (r) => (m(), D("th", {
				key: r.id,
				class: I(`resource-column-${r.id}`),
				style: t(T(r)),
				scope: "col"
			}, [ee(r) ? (m(), D("button", {
				key: 0,
				type: "button",
				class: "btn btn-link",
				title: j(r),
				"aria-label": j(r),
				onClick: (e) => n.$emit("sort", O(r))
			}, [
				E(r) ? (m(), D("span", {
					key: 0,
					class: I(E(r)),
					"aria-hidden": "true"
				}, null, 2)) : A("", !0),
				y("span", { class: I(["resource-header-text", { "resource-header-primary": ["title", "name"].includes(r.id) }]) }, h(j(r)), 3),
				y("span", {
					class: I(P(O(r))),
					"aria-hidden": "true"
				}, null, 2)
			], 8, Xi)) : (m(), D("span", {
				key: 1,
				class: "resource-column-label",
				title: j(r)
			}, [E(r) ? (m(), D("span", {
				key: 0,
				class: I(E(r)),
				"aria-hidden": "true"
			}, null, 2)) : A("", !0), y("span", { class: I(["resource-header-text", { "resource-header-primary": ["title", "name"].includes(r.id) }]) }, h(r.shortLabel ? e.t(r.shortLabel) : j(r)), 3)], 8, Zi))], 6))), 128)),
			a[4] ||= y("th", {
				class: "resource-row-actions",
				scope: "col"
			}, null, -1)
		])]), y("tbody", null, [(m(!0), D(v, null, i(e.resources, (r) => (m(), D("tr", {
			key: f(z)(r),
			"data-sb-resource-key": f(z)(r),
			class: I({
				selected: e.selectedIds.includes(f(z)(r)),
				focused: e.focusedId === f(z)(r),
				focusable: f(pi)(r),
				contextual: f(fi)(r)
			}),
			tabindex: f(pi)(r) ? 0 : void 0,
			"aria-current": e.focusedId === f(z)(r) ? "true" : void 0,
			onClick: M((e) => {
				f(s).click(f(z)(r), e), ie.value = null, n.$emit("select", r, e.ctrlKey || e.metaKey);
			}, ["stop"]),
			onDblclick: M((e) => u(r, e), ["stop"]),
			onKeydown: k(M((e) => u(r), ["prevent"]), ["enter"])
		}, [
			y("td", $i, [x(re, {
				resource: r,
				variant: "compact",
				"allow-image": e.options.detailsThumbnails
			}, null, 8, ["resource", "allow-image"]), e.selectionControls && f(mi)(r) ? (m(), D("label", {
				key: 0,
				class: I(["resource-row-select", { checked: e.selectedIds.includes(f(z)(r)) }]),
				onClick: a[2] ||= M(() => {}, ["stop"])
			}, [y("input", {
				type: "checkbox",
				checked: e.selectedIds.includes(f(z)(r)),
				"aria-label": r.title,
				onChange: (e) => n.$emit("select", r, !0)
			}, null, 40, ea)], 2)) : A("", !0)]),
			y("th", {
				class: "resource-title-cell",
				scope: "row",
				title: r.title
			}, [y("span", na, h(r.title), 1)], 8, ta),
			(m(!0), D(v, null, i(b.value.slice(1), (a) => (m(), D("td", {
				key: a.id,
				class: I(`resource-column-${a.id}`),
				style: t(T(a)),
				title: B(r, a)
			}, [y("span", { class: I(["resource-cell-content", { "resource-status-group": a.format === "status" }]) }, [a.format === "status" && r.statusPresentation ? (m(), D(v, { key: 0 }, [K(U(r), r) ? (m(), D("button", {
				key: 0,
				type: "button",
				class: I(["resource-status-icon", H(r).class]),
				title: f(wi)({
					...U(r),
					label: H(r).label
				}, K(U(r), r), e.t),
				onClick: M((e) => {
					n.$emit("focus", r), n.$emit("action", K(U(r), r), r);
				}, ["stop"])
			}, [y("span", {
				class: I(H(r).icon),
				"aria-hidden": "true"
			}, null, 2), y("span", aa, h(H(r).label), 1)], 10, ia)) : (m(), D("span", {
				key: 1,
				class: I(["resource-status-icon", H(r).class]),
				title: f(wi)({
					...U(r),
					label: H(r).label
				}, K(U(r), r), e.t)
			}, [y("span", {
				class: I(H(r).icon),
				"aria-hidden": "true"
			}, null, 2), y("span", sa, h(H(r).label), 1)], 10, oa))], 64)) : a.format === "language" ? (m(), D("span", ca, [r.metadata.languageImage ? (m(), D("img", {
				key: 0,
				src: r.metadata.languageImage,
				alt: ""
			}, null, 8, la)) : r.metadata.language === "*" ? (m(), D("span", ua)) : A("", !0), y("span", da, h(R(r, a)), 1)])) : a.id === "location" ? (m(), D("span", fa, [V(r, a).parent ? (m(), D("span", pa, h(V(r, a).parent), 1)) : A("", !0), y("span", ma, h(V(r, a).leaf), 1)])) : (m(), D("span", ha, h(R(r, a)), 1)), a.overlays && r.overlays?.length ? (m(), D("span", ga, [(m(!0), D(v, null, i(r.overlays.filter((e) => e.id !== "status"), (t) => (m(), D(v, { key: t.id }, [K(t, r) ? (m(), D("button", {
				key: 0,
				type: "button",
				class: I(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: f(wi)(t, K(t, r), e.t),
				onClick: M((e) => {
					n.$emit("focus", r), n.$emit("action", K(t, r), r);
				}, ["stop"])
			}, [t.image ? (m(), D("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, va)) : (m(), D("span", {
				key: 1,
				class: I(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, _a)) : (m(), D("span", {
				key: 1,
				class: I(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: f(wi)(t, K(t, r), e.t)
			}, [t.image ? (m(), D("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, ba)) : (m(), D("span", {
				key: 1,
				class: I(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, ya))], 64))), 128))])) : A("", !0)], 2)], 14, ra))), 128)),
			y("td", xa, [G(r).length ? (m(), D("button", {
				key: 0,
				type: "button",
				class: "resource-row-menu-toggle",
				"aria-expanded": ie.value === f(z)(r),
				title: e.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: M((e) => {
					n.$emit("focus", r), W(f(z)(r));
				}, ["stop"])
			}, [...a[5] ||= [y("span", {
				class: "fas fa-ellipsis-h",
				"aria-hidden": "true"
			}, null, -1)]], 8, Sa)) : A("", !0), ie.value === f(z)(r) ? (m(), D("div", {
				key: 1,
				class: "resource-item-menu resource-row-menu",
				onClick: a[3] ||= M(() => {}, ["stop"])
			}, [y("strong", null, h(r.title), 1), (m(!0), D(v, null, i(G(r), (t) => (m(), D("button", {
				key: t.id,
				type: "button",
				class: I([`resource-action-${t.id}`, {
					"resource-default-action": t.isDefault,
					"resource-modified-action": t.isModified
				}]),
				title: t.isDefault ? e.t("COM_SMARTBROWSER_DOUBLE_CLICK") : t.isModified ? e.t("COM_SMARTBROWSER_CTRL_DOUBLE_CLICK") : void 0,
				disabled: !e.actionAvailable(t, [r]),
				onClick: (e) => {
					ie.value = null, n.$emit("action", t, r);
				}
			}, [x(wn, { icon: t.icon }, null, 8, ["icon"]), S(" " + h(e.t(t.label)), 1)], 10, Ca))), 128))])) : A("", !0)])
		], 42, Qi))), 128))])]), r(n.$slots, "end")]));
	}
};
//#endregion
//#region resources/js/services/ResourceApi.js
function Ta(e, t = 0, n = (e) => e) {
	let r = e?.messages && typeof e.messages == "object" ? Object.values(e.messages).flat() : [], i = [...new Set([e?.message, ...r].filter((e) => typeof e == "string" && e.trim()).map((e) => e.trim()))];
	return i.length ? i.join("; ") : t === 413 ? n("COM_SMARTBROWSER_ERROR_REQUEST_TOO_LARGE") : t ? n("COM_SMARTBROWSER_ERROR_REQUEST_HTTP").replace("%s", String(t)) : n("COM_SMARTBROWSER_ERROR_REQUEST_NETWORK");
}
var Ea = class {
	constructor(e) {
		this.options = e, this.pending = /* @__PURE__ */ new Map();
	}
	async getResources(e, t = {}) {
		let n = new URL(`${this.options.apiBaseUrl}&task=api.resources&adapter=${encodeURIComponent(this.options.adapter)}`);
		return n.searchParams.set("mode", this.options.mode || "manage"), this.options.browseRoot && n.searchParams.set("browseRoot", this.options.browseRoot), this.options.flatScope && n.searchParams.set("flatScope", this.options.flatScope), n.searchParams.set("node", e), this.options.navigationOnly && n.searchParams.set("navigationOnly", "1"), this.options.adapterOptions && n.searchParams.set("adapterOptions", JSON.stringify(this.options.adapterOptions)), t.search && n.searchParams.set("search", t.search), t.sortBy && n.searchParams.set("sortBy", t.sortBy), t.sortDirection && n.searchParams.set("sortDirection", t.sortDirection), t.filters && n.searchParams.set("filters", JSON.stringify(t.filters)), t.limit && (n.searchParams.set("limit", t.limit), n.searchParams.set("offset", t.offset || 0)), n.searchParams.set("showContextResources", this.options.showContextResources ? "1" : "0"), this.options.selectionItems ? this.request(n, {
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
						let e = Error(Ta(t, Number(t.code) || 0, (e) => Joomla.Text?._(e, e) || e));
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
					let n = Ta(t, Number(e.status) || 0, (e) => Joomla.Text?._(e, e) || e), r = Error(n);
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
}, Da = /^[a-zA-Z][a-zA-Z0-9_.-]*$/, Oa = (e, t) => Object.prototype.hasOwnProperty.call(e, t), ka = (e, t) => e === t || !!(e && t && typeof e == "object" && typeof t == "object" && Array.isArray(e) === Array.isArray(t) && Object.keys(e).length === Object.keys(t).length && Object.keys(e).every((n) => Oa(t, n) && ka(e[n], t[n]))), Aa = /* @__PURE__ */ new Set(["ext.selectionAddress"]), ja = (e) => encodeURIComponent(String(e)).replace(/[!'()*]/g, (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`), Ma = (e) => e.map(([e, t]) => `${ja(e)}=${ja(t)}`).join("&"), Na = (e) => {
	if (/%(?![a-fA-F0-9]{2})/.test(e)) throw TypeError("Invalid address percent encoding.");
	let t = [...new URLSearchParams(e)];
	if (t.some(([e]) => !e || /[\u0000-\u001f\u007f]/.test(e))) throw TypeError("Invalid address properties.");
	return t;
};
function Pa(e, t = !1) {
	if (typeof e != "string" || !t && !e || /[\u0000-\u0020\u007f<>"\\]/.test(e) || /%(?![a-fA-F0-9]{2})/.test(e) || /[\u0000-\u001f\u007f]/.test(decodeURIComponent(e)) || /^[^/?#]*:/.test(e) && !/^(?:https?:\/\/|mailto:|tel:)/i.test(e) || e.startsWith("//")) throw TypeError("Unsafe resource URL.");
	if (/^https?:/i.test(e)) {
		let t = new URL(e);
		if (!t.hostname || t.username || t.password) throw TypeError("Unsafe resource URL.");
	}
	return e;
}
function Fa(e) {
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
function Ia(e) {
	let t = /^([a-zA-Z0-9_.-]+):(\/.*)$/.exec(e.id || "");
	if (!t) throw TypeError("Invalid media reference.");
	let n = t[1] + t[2].split("/").map(ja).join("/");
	return Fa(n), n;
}
function La() {
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
		if (!Da.test(t) || e.has(t)) throw TypeError(`Address registration conflict: ${t}`);
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
					url: Pa(n),
					locator: "",
					properties: [],
					plain: !0
				};
			}
			let a = Pa(n.slice(0, i.index), !0), o = n.slice(i.index + i[0].length), s = o.indexOf("?"), c = s < 0 ? o : o.slice(0, s);
			if (/[#\s\\]/.test(c) || /%(?![a-fA-F0-9]{2})/.test(c)) throw TypeError("Invalid address locator.");
			return {
				format: i[1],
				url: a,
				locator: c,
				properties: s < 0 ? [] : Na(o.slice(s + 1))
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
			Pa(n, t !== "joomlaLink");
			let a = `${n}#${t}://${r}${i.length ? `?${Ma(i)}` : ""}`;
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
			let i = t.selectionAddress || e.get(n || Va(t))?.describe?.(t);
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
				if (e.format !== "joomlaImage" || Fa(e.locator).id !== t.id) throw TypeError("Native image identity does not match selection.");
				i = e;
			}
			return i;
		},
		descriptors(t, r = {}, i = Va(t)) {
			let a = [], o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), c = e.get(i)?.propertyNames || [];
			for (let e of [...t.selectionCapabilities || [], ...n.values()]) {
				if (r[e.key] === !1 || !Oa(r, e.key) && !e.key?.startsWith("ext.")) continue;
				let t = typeof r[e.key] == "object" ? r[e.key] : {}, n = {
					...e.address,
					...t?.address
				}, i = n.name || e.key;
				if (!Da.test(i) || o.has(i) || s.has(e.key) || c.includes(i)) throw TypeError(`Address property conflict: ${i}`);
				o.add(i), s.add(e.key), a.push({
					...e,
					...n,
					name: i,
					default: Oa(t, "default") ? t.default : e.default
				});
			}
			return a;
		},
		async encodeProperties(e, n, r, i = {}) {
			let a = s.descriptors(e, n, i.format).filter((e) => !(i.addressConsumed && e.key === "ext.address")), o = r["ext.selectionAddress"] || {}, c = [...o.properties || []], l = /* @__PURE__ */ new Set([...a.flatMap((e) => [e.name, e.name.split(".")[0]]), ...c.map(([e]) => e.split(".")[0])]);
			for (let e of Object.keys(r)) if (!(Aa.has(e) || i.addressConsumed && e === "ext.address" || a.some((t) => t.key === e) || r[e] == null)) {
				if (typeof r[e] == "object") throw TypeError(`No address codec for property: ${e}`);
				if (!e.startsWith("ext.")) throw TypeError(`Unsupported address property: ${e}`);
				if (l.has(e)) throw TypeError(`Address property conflict: ${e}`);
				l.add(e), c.push([e, za(r[e])]);
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
					if (ka(n, e.default)) continue;
					c.push([e.name, e.values?.[String(n)] ?? za(n)]);
					continue;
				}
				if (ka(n, e.default)) continue;
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
					o[n.key] = Ba(d, n);
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
		reference: (e) => Fa(e.locator),
		validate: (t, n) => e === "joomlaImage" ? t.type === "image" : e === "joomlaFolder" ? t.kind === "node" : e === "joomlaFile" ? t.kind === "item" : ["audio", "video"].includes(t.type) && n.properties.filter(([e]) => e === "mediaType").length <= 1 && !n.properties.some(([e, n]) => e === "mediaType" && n !== t.type),
		describe(t) {
			let n = t.metadata || {}, r = [];
			if (e === "joomlaImage") for (let e of ["width", "height"]) Number(n[e]) > 0 && r.push([e, String(n[e])]);
			return e === "joomlaMedia" && r.push(["mediaType", t.type]), {
				format: e,
				locator: Ia(t.selection || t),
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
			return t.linkReference(Pa(e.url));
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
			if (typeof e == "string" ? n = s.parse(e) : t.preserved && (n = s.parse(t.preserved), Fa(n.locator).id !== e.id && (n = null)), !n) {
				let r = await t.resolveReference(e, t.definition.picker || {});
				if (!r || r.unavailable || r.selectable === !1 || r.type !== "image") throw TypeError("Unavailable compound image.");
				n = s.describe(r, { format: "joomlaImage" });
			}
			if (n.format !== "joomlaImage" || !n.url) throw TypeError("A Joomla image requires src and media components.");
			return Fa(n.locator), [
				["src", n.url],
				["media", n.locator],
				...n.properties.map(([e, t]) => [Ra.has(e) ? e : `param.${e}`, t])
			];
		},
		async decode(e, t) {
			let n = /* @__PURE__ */ new Map(), r = [];
			for (let [t, i] of e) if (["src", "media"].includes(t)) {
				if (n.has(t)) throw TypeError("Duplicate compound image component.");
				n.set(t, i);
			} else if (Ra.has(t)) r.push([t, i]);
			else if (t.startsWith("param.") && t.length > 6) r.push([t.slice(6), i]);
			else throw TypeError(`Unknown image component: ${t}`);
			if (!n.get("src") || !n.get("media")) throw TypeError("Missing compound image src or media.");
			let i = Fa(n.get("media")), a = s.serialize({
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
var Ra = /* @__PURE__ */ new Set([
	"width",
	"height",
	"crop",
	"ratio",
	"zoom"
]), za = (e) => {
	if (typeof e == "string" || typeof e == "boolean" || typeof e == "number" && Number.isFinite(e)) return String(e);
	throw TypeError("A structured property requires a registered address codec.");
}, Ba = (e, t) => {
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
}, Va = (e) => e.type === "image" ? "joomlaImage" : e.type === "folder" ? "joomlaFolder" : ["audio", "video"].includes(e.type) ? "joomlaMedia" : e.adapter === "media" || e.type === "document" ? "joomlaFile" : e.type === "uri" || e.adapter === "direct-links" ? "joomlaLink" : e.type === "gallery" ? "joomlaGallery" : "joomlaItem", Ha = La();
//#endregion
//#region resources/js/services/SelectionAddressService.js
function Ua({ model: e, api: t, config: n, service: r, isDisposed: i = () => !1 }) {
	return {
		async exportAddresses({ selectionIds: t, ...i } = {}) {
			await e.refresh();
			let a = t === void 0 ? null : new Set(t), o = e.getItems().filter((e) => !a || a.has(e.selection ? B(e.selection) : String(e)));
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
			let u = new Set(e.getItems().map((e) => B(e.selection)));
			if (l.resources.some((e) => !u.has(e.selectionKey || B(e.selection || {
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
function Wa({ api: e, config: t, contract: n = t.addressContract || Ha }) {
	let r = !e;
	e ||= new Ea({
		...t,
		mode: "select"
	});
	let i = /* @__PURE__ */ new Map(), a = t.selectionProfile || {}, o = {
		...t,
		allowedAdapters: t.allowedAdapters || (t.adapter ? [t.adapter] : []),
		maxSelections: t.multiple === !1 ? 1 : t.maxSelections || 500
	}, s = (e, n = {}) => {
		let r = n.browseRoot ?? (e.adapter === t.adapter ? t.browseRoot : ""), a = JSON.stringify([e.adapter, r]);
		return i.has(a) || i.set(a, new Ea({
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
			let i = new Map(n.map((e) => [e.selectionKey || B(e.selection || {
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
				}, o = i.get(B(e.selection));
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
				V([{ selection: r }], o);
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
				let g = dn({
					profile: a,
					initialUsage: { [B(r)]: d },
					resolveReference: c,
					editors: globalThis.SmartBrowserPicker?.extensions?.().editors || {}
				}), _ = {
					...i,
					selectionKey: B(r)
				}, v = await g.validate([_]);
				if (!v.valid) throw TypeError(`Invalid selection properties: ${Object.keys(v.errors[B(r)] || {}).join(", ")}`);
				f.push({
					selection: r,
					usage: {
						...d,
						...v.usage[B(r)]
					}
				}), p.push(_);
			} catch (t) {
				m.push(`Line ${e.line}: ${t.message}`);
			}
			if (m.length) throw TypeError(m.join("\n"));
			let h = V(u ? [...i, ...f] : f, o), g = V(f, o), _ = g.map((e) => d[f.findIndex((t) => B(t.selection) === B(e.selection))]?.line), v = await e.collection(g, {
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
var Ga = ["aria-label", "aria-busy"], Ka = { class: "resource-browser" }, qa = {
	key: 0,
	class: "alert alert-danger",
	role: "alert"
}, Ja = {
	key: 0,
	class: "sb-collection-count"
}, Ya = ["aria-expanded"], Xa = { class: "sb-selected-list" }, Za = { class: "resource-toolbar sb-collection-toolbar" }, Qa = ["disabled", "aria-label"], $a = [
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
	"disabled",
	"title",
	"aria-label"
], io = [
	"disabled",
	"title",
	"aria-label"
], ao = [
	"title",
	"aria-label",
	"aria-pressed",
	"onClick"
], oo = [
	"data-info-state",
	"aria-pressed",
	"title",
	"aria-label"
], so = ["disabled", "aria-label"], co = { class: "sb-selected-content" }, lo = {
	key: 0,
	class: "resource-empty-state sb-selection-empty",
	role: "status"
}, uo = ["disabled"], fo = {
	key: 0,
	class: "sb-selected-panel"
}, po = {
	key: 0,
	class: "sb-selection-gallery-nav"
}, mo = ["disabled", "aria-label"], ho = {
	key: 0,
	"aria-hidden": "true"
}, go = ["disabled", "aria-label"], _o = {
	key: 0,
	"aria-hidden": "true"
}, vo = ["aria-label", "aria-valuenow"], yo = {
	key: 3,
	class: "text-danger sb-address-error",
	role: "alert"
}, bo = {
	key: 1,
	class: "sb-collection-count"
}, xo = ["aria-label"], So = { class: "sb-address-dialog-body" }, Co = ["disabled"], wo = {
	key: 0,
	class: "sb-address-append"
}, To = ["disabled"], Eo = {
	key: 1,
	class: "text-danger sb-address-error",
	role: "alert"
}, Do = { class: "sb-address-dialog-actions" }, Oo = ["disabled"], ko = ["disabled"], Ao = {
	__name: "CollectionView",
	props: {
		model: Object,
		api: Object,
		config: Object,
		t: Function
	},
	setup(e) {
		let r = e, a = r.model.browser.state, s = !1, d = 0, _ = r.config.addressService || Wa({
			api: r.api,
			config: r.config
		}), j = r.config.importAddresses ? r.config : Ua({
			model: r.model,
			api: r.api,
			config: r.config,
			service: _,
			isDisposed: () => s
		}), ee = o({}), P = o({}), F = o(0), te = _.contract.subscribe(() => {
			F.value++;
		}), ne = `sb-address-${T()}`, R = o(null), V = o(""), H = o(""), U = o(!1), re = o(r.config.multiple !== !1);
		function W() {
			V.value = "", H.value = "", R.value.showModal();
		}
		async function G() {
			if (!U.value) {
				U.value = !0, H.value = "";
				try {
					await j.importAddresses(V.value, { append: re.value }), R.value.close();
				} catch (e) {
					H.value = e.message;
				} finally {
					U.value = !1;
				}
			}
		}
		async function K(e = yt.value) {
			if (e.length) try {
				await navigator.clipboard.writeText(await j.exportAddresses({ selectionIds: [...e] }));
			} catch (e) {
				a.error = e.message || r.t("COM_SMARTBROWSER_COPY_FAILED");
			}
		}
		p(() => {
			s = !0, d++, te(), r.config.addressService || _.destroy();
		});
		let q = N(() => r.config.selectedResources && r.config.informationPanel !== !1), J = `${r.config.viewPreferenceKey || "supjx.smartbrowser.collection.view"}.${r.config.multiple === !1 ? "single" : "multiple"}-layout`, Y = {};
		try {
			Y = JSON.parse(L().getItem(J) || "{}") || {};
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
				let e = JSON.parse(L().getItem(J) || "{}") || {};
				L().setItem(J, JSON.stringify({
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
		let se = N(() => !r.config.readOnly && typeof r.config.onAdd == "function"), ce = o(!1), le = N(() => (r.model.revision?.value, sr(r.config, r.model.getItems().length) && !ce.value && !a.loading && !a.busy));
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
		a.sortBy = r.config.selectedResources && ["collectionOrder", ...ir.map((e) => e.id)].includes(Y.sortBy) ? Y.sortBy : "collectionOrder", a.sortDirection = Y.sortDirection === "desc" ? "desc" : "asc", w(() => a.sortBy, (e) => {
			r.config.allowOrdering === !1 && e === "collectionOrder" && (a.sortBy = "title");
		}, {
			immediate: !0,
			flush: "sync"
		}), a.hiddenColumns = Array.isArray(Y.hiddenColumns) ? Y.hiddenColumns : [], a.shownColumns = Array.isArray(Y.shownColumns) ? Y.shownColumns : [], a.viewOptions.gridSize = r.config.gridSize || "md", a.viewOptions.detailsThumbnails = r.config.thumbnails !== !1;
		let de = new ie(r.api, a, () => r.model.refresh(), r.t, r.config.editorMode || "modal", r.config.application), fe = /* @__PURE__ */ new Map(), pe = (e) => {
			if (!e.adapter) return de;
			if (!fe.has(e.adapter)) {
				let t = new Ea({
					...r.config,
					adapter: e.adapter,
					mode: r.config.readOnly ? "readonly" : "manage"
				});
				fe.set(e.adapter, {
					api: t,
					driver: new ie(t, a, () => r.model.refresh(), r.t, r.config.editorMode || "modal", r.config.application)
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
		], he = N(() => r.config.selectedResources && r.config.multiple !== !1 && r.model.canOrder && a.sortBy === "collectionOrder" ? [
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
		] : []), ge = N(() => [
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
		]), _e = N(() => ge.value.find((e) => e.id === "collectionReplace")), ve = N(() => !q.value || X.value ? [] : [
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
		]), ye = N(() => $.value?.collectionActions?.find((e) => e.id === "preview" && pe($.value).available(e, [$.value])) || Te($.value)), be = (e) => e.id === "collectionReplace" || (r.config.resourceActions || []).some((t) => t.id === e.id), xe = (e, t) => t.collectionActions?.find((t) => t.id === e.id) || e, Se = (e) => yt.value.includes(z(e)) ? yt.value : [z(e)], Ce = (e, t) => {
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
				return Q.value.some((e, t) => n.has(z(e)) && Q.value[t + r] && !n.has(z(Q.value[t + r])));
			}
			return e.id === "collectionRemove" ? r.model.canRemove : be(e) ? !r.config.readOnly : !t.some((e) => e.unavailable) && t.every((t) => (!t.collectionActions || t.collectionActions.some((t) => t.id === e.id)) && pe(t).available(xe(e, t), [t]));
		}, we = (e) => ge.value.find((t) => t.id === r.config.defaultResourceActionId && Ce(t, [e])) || (r.config.contextActions === !0 && !r.config.readOnly ? Si({
			...e,
			activatable: !e.unavailable
		}, "manage", ge.value, Ce) : null), Te = (e) => r.config.contextActions === !0 && !r.config.readOnly ? bi(e, "manage", ge.value, Ce) : null;
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
					if (e.id === "collectionRemove") return r.model.remove(yt.value.includes(z(t)) ? yt.value : [z(t)]);
					try {
						await (e.id === "collectionReplace" ? r.config.onReplace(t) : be(e) ? r.config.onResourceAction?.(e, t) : pe(t).execute(xe(e, t), [t]));
					} catch (e) {
						r.config.onError?.(e);
					}
				}
			}
		}
		let De = N(() => r.config.selectedResources ? ir : (a.presentation.sortFields || [{
			id: "title",
			label: "COM_SMARTBROWSER_NAME"
		}]).filter((e) => !["ordering", "collectionOrder"].includes(e.id))), Oe = N(() => r.config.selectedResources ? rr : a.presentation.columns || [{
			id: "title",
			label: "COM_SMARTBROWSER_NAME"
		}]), ke = N(() => Oe.value.filter((e) => e.id === "title" || (e.defaultVisible === !1 ? a.shownColumns.includes(e.id) : !a.hiddenColumns.includes(e.id)))), Ae = (e) => {
			let t = Oe.value.find((t) => t.id === e);
			if (!t || e === "title") return;
			let n = t.defaultVisible === !1 ? "shownColumns" : "hiddenColumns";
			a[n] = a[n].includes(e) ? a[n].filter((t) => t !== e) : [...a[n], e];
		}, je = o(null);
		function Me({ payload: e, resolve: t, reject: n }) {
			try {
				if (!e.sort || a.sortBy !== "collectionOrder" || !De.value.some((t) => t.id === e.sort.field) || !["asc", "desc"].includes(e.sort.direction)) throw Error("Invalid collection sorting state.");
				r.model.reorderItems(ar(Q.value, e.sort.field, e.sort.direction).map(z)), a.sortDirection = "asc", t();
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
		}], Fe = N(() => r.model.browser.bulkSelectableResources.value.length > 0 && r.model.browser.bulkSelectableResources.value.every((e) => a.selectedIds.includes(z(e)))), Ie = o(null), Le = o(0), Re = o(null), ze = o(!1), Be = o(!1), Ve = o(!1), He = o(null), Ue = o(null), We = o(null), Ge = N(() => Je.value && Qe.value && !$.value && Ue.value ? Ue.value : !X.value && We.value ? We.value : He.value);
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
		let Je = N(() => q.value && !X.value || Z.value !== "hidden"), Ye = N(() => r.config.informationPanelVerticalPosition || (["top", "bottom"].includes(r.config.informationPanelPosition) ? r.config.informationPanelPosition : "top")), Xe = N(() => r.config.informationPanelHorizontalPosition || (["left", "right"].includes(r.config.informationPanelPosition) ? r.config.informationPanelPosition : "right")), Ze = N(() => q.value ? X.value ? Z.value === "side" && Le.value >= 640 ? Xe.value : Ye.value : "top" : cr(r.config.informationPanelPosition, Le.value)), Qe = N(() => ["top", "bottom"].includes(Ze.value)), $e = o(0), et = N(() => $e.value && Je.value && ["left", "right"].includes(Ze.value) ? { gridTemplateColumns: Ze.value === "left" ? `${tt($e.value)}px minmax(0, 1fr)` : `minmax(0, 1fr) ${tt($e.value)}px` } : void 0), tt = (e) => Math.max(200, Math.min(e, Le.value - 200)), nt;
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
		let st = N(() => r.config.readOnly ? "readonly" : r.config.selectionUseData || "readonly"), ct = window.SmartBrowserPicker?.extensions?.() || {
			editors: {},
			previewActions: []
		}, lt = o(ct.previewActions), ut = window.SmartBrowserPicker?.subscribePreviewActions?.((e) => {
			lt.value = e;
		});
		p(() => ut?.());
		let dt = /* @__PURE__ */ new Map();
		async function ft(e, t = {}) {
			let n = JSON.stringify([e.adapter, t.browseRoot || ""]);
			return dt.has(n) || dt.set(n, new Ea({
				...r.config,
				adapter: e.adapter,
				mode: "select",
				browseRoot: t.browseRoot || null,
				flatScope: null
			})), (await dt.get(n).collection([e.id])).resources[0];
		}
		let pt = (e) => (r.model.revision?.value, r.model.getItems().find((t) => t.selection && B(t.selection) === z(e))?.usage || {}), mt = N(() => (r.model.revision?.value, dn({
			profile: r.config.selectionProfile || {},
			initialUsage: Object.fromEntries(r.model.resources.value.map((e) => [z(e), pt(e)])),
			editors: ct.editors,
			resolveReference: ft
		}))), ht = o({}), gt = o({}), Q = N(() => {
			let e = r.model.resources.value.map((e) => {
				let t = Gt(e, pt(e)), n = gt.value[z(e)];
				return r.config.selectedResources ? {
					...er({
						...t,
						effectiveThumbnail: ht.value[z(e)],
						effectiveThumbnailResource: n,
						imageCrop: n?.imageCrop || e.imageCrop
					}, a.presentation),
					selectionPath: ee.value[z(e)] || (P.value[z(e)] ? r.t("COM_SMARTBROWSER_ADDRESS_UNAVAILABLE") : "")
				} : t;
			});
			return r.config.selectedResources && a.sortBy !== "collectionOrder" ? ar(e, a.sortBy, a.sortDirection) : e;
		});
		w(() => [
			r.model.resources.value,
			r.model.revision?.value,
			r.config.nativeAddress,
			r.config.selectionProfile,
			F.value
		], async () => {
			let e = ++d, t = {}, n = {};
			for (let e of r.model.resources.value) {
				let i = z(e), a = r.model.getItems().find((e) => e.selection && B(e.selection) === i) || {
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
			e === d && !s && (ee.value = t, P.value = n);
		}, {
			immediate: !0,
			deep: !0
		});
		let $ = N(() => Q.value.find((e) => z(e) === a.focusedId) || Q.value[0] || null), _t = N(() => Q.value.findIndex((e) => z(e) === z($.value)));
		function vt(e) {
			let t = Q.value[_t.value + e];
			t && r.model.browser.focus(t);
		}
		let yt = N(() => a.selectedIds), bt = N(() => r.config.multiple === !1 ? Q.value.map(z) : yt.value);
		w(() => r.config.multiple === !1 ? z(Q.value[0]) : null, (e) => {
			e && (a.selectedIds = [e]);
		}, { immediate: !0 });
		let xt = N(() => st.value === "hidden" ? [] : mt.value.definitions($.value).filter((e) => e.presentation !== "hidden")), St = o(0), Ct = 0, wt = N(() => (St.value, {
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
			a === Ct && i === mt.value && (z($.value) === z(n) && (Tt.value = s.errors[z(n)] || {}), s.valid && r.model.setUsage(n, o));
		}
		let Ot = N(() => {
			let e = $.value, t = () => tr(e);
			return Ci({
				resource: e,
				isReadOnly: st.value !== "editable",
				fieldElement: Ie.value?.closest(".sb-selection-field") || null,
				profile: r.config.selectionProfile || {},
				values: wt.value,
				getValues: () => ({
					...pt(e),
					...mt.value.get(e)
				}),
				getAddress: () => (r.config.nativeImage || r.config.nativePreview ? r.config.nativeAddress : void 0) ?? pt(e)["ext.address"] ?? tr(e),
				getSelectionAddress: () => ee.value[z(e)] || "",
				getDefaultAddress: t,
				resetAddress: () => {
					if (z($.value) === z(e)) return r.config.nativeImage || r.config.nativePreview ? (r.config.nativeAddress = t(), Dt("ext.address", r.config.nativeAddress)) : Dt("ext.address", null);
				},
				setAddress: (t) => {
					if (z($.value) === z(e)) return r.config.nativeAddress = String(t || ""), Dt("ext.address", r.config.nativeAddress);
				},
				isCurrent: () => z($.value) === z(e),
				setValue: (t, n) => {
					if (z($.value) === z(e)) return Dt(t, n);
				},
				refresh: () => r.model.refresh(),
				selectResource: (e) => window.SmartBrowserPicker.open(e)
			});
		}), kt = N(() => lt.value.filter((e) => {
			try {
				return $.value && (st.value === "editable" || e.allowReadOnly === !0) && (!e.applies || e.applies(Ot.value));
			} catch {
				return !1;
			}
		})), At, jt = 0;
		return w(() => [r.model.resources.value, r.model.revision?.value], async () => {
			let e = ++jt, t = {}, n = {};
			for (let e of r.model.resources.value) {
				let r = pt(e), i = Wt(mt.value.definitions(e)).find((e) => r[e.key]);
				if (i) try {
					n[z(e)] = await Zt(i, r[i.key], ft), t[z(e)] = qt(n[z(e)]);
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
			class: I(["smartbrowser smartbrowser-collection", {
				"is-compact": e.config.layout === "compact",
				"is-selected-resources": e.config.selectedResources,
				"is-single-selection": q.value && ["top", "bottom"].includes(Ze.value)
			}]),
			"aria-label": e.t("COM_SMARTBROWSER_COLLECTION_TITLE"),
			"aria-busy": f(a).loading || f(a).busy
		}, [
			y("div", Ka, [
				f(a).error ? (m(), D("p", qa, h(f(a).error), 1)) : A("", !0),
				y("div", {
					class: I(["sb-selected-layout", [`panel-${Ze.value}`, {
						"panel-open": Je.value && e.config.informationPanel !== !1,
						"is-collapsed": q.value && !X.value
					}]]),
					style: t(X.value ? et.value : void 0)
				}, [y("div", { class: I(["sb-selected-items", `view-${f(a).activeView}`]) }, [q.value ? (m(), D("div", Ja, [y("button", {
					type: "button",
					class: "sb-collection-count-toggle",
					"aria-expanded": X.value,
					onClick: oe
				}, [y("span", { class: I(X.value ? "fas fa-chevron-up" : "fas fa-chevron-down") }, null, 2), S(h(e.t("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": " + h(e.model.getItems().length), 1)], 8, Ya)])) : A("", !0), l(y("div", Xa, [y("header", Za, [
					l(y("button", {
						class: "resource-icon-button sb-toolbar-scroll",
						type: "button",
						disabled: !Be.value,
						"aria-label": e.t("COM_SMARTBROWSER_SCROLL_BACK"),
						onClick: r[0] ||= (e) => qe(-1)
					}, [...r[19] ||= [y("span", { class: "fas fa-chevron-left" }, null, -1)]], 8, Qa), [[g, ze.value]]),
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
						}, null, -1)]], 8, $a)) : A("", !0),
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
						}, null, -1)]], 8, eo)) : A("", !0),
						_e.value ? (m(), D("button", {
							key: 2,
							class: "resource-icon-button",
							type: "button",
							disabled: !$.value || !Ce(_e.value, [$.value]),
							title: e.t(_e.value.label),
							"aria-label": e.t(_e.value.label),
							onClick: r[2] ||= (e) => Ee(_e.value, $.value)
						}, [x(wn, { icon: _e.value.icon }, null, 8, ["icon"])], 8, to)) : A("", !0),
						e.model.canOrder && f(a).sortBy === "collectionOrder" ? (m(), b(Jr, {
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
						}, [...r[22] ||= [y("span", { class: "fas fa-sort" }, null, -1)]], 8, no)) : A("", !0),
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
						}, [...r[23] ||= [y("span", { class: "fas fa-copy" }, null, -1)]], 8, ro)) : A("", !0),
						e.config.selectedResources && e.model.referenceItems && !e.config.readOnly ? (m(), D("button", {
							key: 6,
							type: "button",
							class: "resource-icon-button",
							disabled: f(a).loading || f(a).busy,
							title: e.t("COM_SMARTBROWSER_IMPORT_ADDRESSES"),
							"aria-label": e.t("COM_SMARTBROWSER_IMPORT_ADDRESSES"),
							onClick: W
						}, [...r[24] ||= [y("span", { class: "fas fa-paste" }, null, -1)]], 8, io)) : A("", !0),
						f(a).activeView === "grid" && (e.config.selectedResources || e.config.layout !== "compact") ? (m(), b(si, {
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
						e.config.selectedResources && f(a).activeView === "details" ? (m(), b(ti, {
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
							class: I(["resource-icon-button", { active: f(a).activeView === t.id }]),
							type: "button",
							title: e.t(t.label),
							"aria-label": e.t(t.label),
							"aria-pressed": f(a).activeView === t.id,
							onClick: (e) => f(a).activeView = t.id
						}, [y("span", {
							class: I(t.icon),
							"aria-hidden": "true"
						}, null, 2)], 10, ao)), 64)),
						e.config.informationPanel !== !1 && e.config.selectedResources ? (m(), D("button", {
							key: 9,
							class: I(["resource-icon-button", {
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
						}, null, -1)]], 10, oo)) : A("", !0)
					], 544),
					l(y("button", {
						class: "resource-icon-button sb-toolbar-scroll",
						type: "button",
						disabled: !Ve.value,
						"aria-label": e.t("COM_SMARTBROWSER_SCROLL_FORWARD"),
						onClick: r[7] ||= (e) => qe(1)
					}, [...r[26] ||= [y("span", { class: "fas fa-chevron-right" }, null, -1)]], 8, so), [[g, ze.value]])
				]), y("div", co, [e.model.resources.value.length ? (m(), b(u(f(a).activeView === "details" ? wa : Hi), {
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
				])) : (m(), D("div", lo, [y("span", null, h(e.t(f(a).loading ? "COM_SMARTBROWSER_LOADING" : "COM_SMARTBROWSER_COLLECTION_EMPTY")), 1), se.value && (!Je.value || !Qe.value) ? (m(), D("button", {
					key: 0,
					type: "button",
					class: "btn btn-outline-secondary",
					disabled: !le.value,
					onClick: ue
				}, [r[27] ||= y("span", { class: "fas fa-plus" }, null, -1), S(" " + h(e.t("COM_SMARTBROWSER_SELECT_RESOURCE")), 1)], 8, uo)) : A("", !0)]))])], 512), [[g, !q.value || X.value]])], 2), e.config.selectedResources && e.config.informationPanel !== !1 ? l((m(), D("div", fo, [
					e.config.multiple !== !1 && ["top", "bottom"].includes(Ze.value) && Q.value.length > 1 ? (m(), D("div", po, [y("button", {
						type: "button",
						class: "resource-icon-button",
						disabled: _t.value <= 0,
						"aria-label": e.t("COM_SMARTBROWSER_PREVIOUS_RESOURCE"),
						onClick: r[8] ||= (e) => vt(-1)
					}, [r[28] ||= y("span", { class: "fas fa-chevron-left" }, null, -1), _t.value > 0 ? (m(), D("small", ho, h(_t.value), 1)) : A("", !0)], 8, mo), y("button", {
						type: "button",
						class: "resource-icon-button",
						disabled: _t.value >= Q.value.length - 1,
						"aria-label": e.t("COM_SMARTBROWSER_NEXT_RESOURCE"),
						onClick: r[9] ||= (e) => vt(1)
					}, [_t.value < Q.value.length - 1 ? (m(), D("small", _o, h(_t.value + 2), 1)) : A("", !0), r[29] ||= y("span", { class: "fas fa-chevron-right" }, null, -1)], 8, go)])) : A("", !0),
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
						onKeydown: [r[10] ||= k(M((e) => ot(-16), ["prevent"]), ["left"]), r[11] ||= k(M((e) => ot(16), ["prevent"]), ["right"])],
						onDblclick: r[12] ||= (e) => $e.value = 0
					}, null, 40, vo)) : A("", !0),
					e.config.selectedResources && e.config.informationPanel !== !1 ? l((m(), b(Wr, {
						key: 2,
						"selection-only": "",
						resource: $.value,
						fields: f(a).presentation.infoFields,
						t: e.t,
						address: ee.value[f(z)($.value)] || "",
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
					$.value && P.value[f(z)($.value)] ? (m(), D("p", yo, h(P.value[f(z)($.value)]), 1)) : A("", !0)
				], 512)), [[g, Je.value]]) : A("", !0)], 6),
				e.config.showCount !== !1 && !q.value ? (m(), D("footer", bo, h(e.t("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": " + h(e.model.getItems().length), 1)) : A("", !0),
				(m(), b(E, {
					to: Ge.value || "body",
					disabled: !Ge.value
				}, [r[30] ||= y("span", { class: "sb-collection-extra-buttons" }, null, -1)], 8, ["to", "disabled"]))
			]),
			e.config.selectedResources && e.model.canOrder && e.config.multiple !== !1 ? (m(), b(zt, {
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
				ref: R,
				class: "resource-batch-preview-dialog sb-address-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_IMPORT_ADDRESSES"),
				onCancel: r[18] ||= M((e) => !U.value && R.value.close(), ["prevent"])
			}, [y("div", So, [
				y("label", {
					for: ne,
					class: "form-label"
				}, h(e.t("COM_SMARTBROWSER_IMPORT_ADDRESSES")), 1),
				l(y("textarea", {
					id: ne,
					"onUpdate:modelValue": r[15] ||= (e) => V.value = e,
					class: "form-control",
					rows: "7",
					maxlength: "4194304",
					disabled: U.value
				}, null, 8, Co), [[C, V.value]]),
				e.config.multiple === !1 ? A("", !0) : (m(), D("label", wo, [l(y("input", {
					"onUpdate:modelValue": r[16] ||= (e) => re.value = e,
					type: "checkbox",
					disabled: U.value
				}, null, 8, To), [[O, re.value]]), S(" " + h(e.t("COM_SMARTBROWSER_ADDRESS_APPEND")), 1)])),
				H.value ? (m(), D("p", Eo, h(H.value), 1)) : A("", !0),
				y("div", Do, [y("button", {
					type: "button",
					class: "btn btn-primary",
					disabled: U.value,
					onClick: G
				}, h(e.t("COM_SMARTBROWSER_IMPORT")), 9, Oo), y("button", {
					type: "button",
					class: "btn btn-secondary",
					disabled: U.value,
					onClick: r[17] ||= (e) => R.value.close()
				}, h(e.t("JCANCEL")), 9, ko)])
			])], 40, xo)
		], 10, Ga));
	}
}, jo = (e, t) => (n, r) => {
	if (e === "ordering" && n.type === "article" && r.type === "article" && n.parentId !== r.parentId && n.metadata?.locationPath && r.metadata?.locationPath) {
		let e = n.metadata.locationPath.localeCompare(r.metadata.locationPath);
		if (e) return t === "asc" ? e : -e;
	}
	let i = (t) => e === "title" ? String(t.title || "").toLocaleLowerCase() : e === "location" ? t.metadata?.locationPath || t.metadata?.location || t.metadata?.categoryPath || t.metadata?.parentPath || t.metadata?.parent || "" : e === "ordering" ? t.metadata?.hierarchyOrder ?? t.metadata?.ordering : e === "dimension" ? (t.metadata?.width || 0) * (t.metadata?.height || 0) : t.metadata?.[e], a = i(n), o = i(r), s = typeof a == "string" ? (a || "").localeCompare(o || "") : (a || 0) - (o || 0);
	return t === "asc" ? s : -s;
};
//#endregion
//#region resources/js/core/createBrowserState.js
function Mo({ options: e, api: t, persistence: n, viewRegistry: r }) {
	let i = e.pickerContext || e.selectionHost, o = !!i?.collectionMode, s = (o || e.mode === "select") && e.multiple === !1 ? 1 : i?.maxSelections ?? e.maxSelections ?? 500, c = o ? i.getCollectionSnapshot() : null, l = {
		loadingMode: "inherit",
		pageSize: null
	};
	try {
		e.paginationSupported && (l = ne());
	} catch {}
	let u = R(l, e), d = e.paginationSupported ? u.mode : "all", f = ["pages", "smart"].includes(d), p = !!(o || e.selectionState || e.pickerContext && (Object.keys(e.pickerContext.selectionProfile || {}).length || e.pickerContext.initialSelection?.length)), m = f || p, h = e.adapter?.replace(/^flat-/, ""), g = (e) => o ? {
		...e,
		adapter: h,
		selection: {
			adapter: h,
			id: e.id
		},
		selectionKey: B({
			adapter: h,
			id: e.id
		})
	} : e, _ = (t) => o && e.multiple && i.homogeneous && S.selectedIds.length && (S.selectedResources[S.selectedIds[0]]?.selection?.adapter || c.items.find((e) => B(e.selection) === S.selectedIds[0])?.selection.adapter) !== t.selection?.adapter, v = new Set(e.allowedResourceTypes || []), y = (t) => e.mode === "readonly" || _(t) || v.size && !v.has(t.type) ? {
		...t,
		selectable: !1,
		bulkSelectable: !1
	} : t, b = {
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
		filters: {},
		pageSize: u.pageSize
	}, x = n.load(b);
	x.filters = {
		...x.filters || {},
		...e.initialFilters || {}
	}, Array.isArray(x.hiddenColumns) || (x.hiddenColumns = []), Array.isArray(x.shownColumns) || (x.shownColumns = []), x.pageSize = u.pageSize, e.currentNode && (x.selectedNode = e.currentNode), e.defaultView && (x.activeView = e.defaultView), r.has(x.activeView) || (x.activeView = "grid");
	let S = a({
		...x,
		roots: e.roots,
		nodes: [],
		navigationNodes: null,
		pagination: null,
		loadingMode: d,
		loadedCount: 0,
		loadingMore: !1,
		loadingAll: !1,
		items: [],
		contextItems: [],
		breadcrumb: [],
		actions: e.actions,
		presentation: e.presentation || {},
		currentResource: null,
		focusedId: null,
		revealIds: [],
		selectedIds: c ? c.items.map((e) => B(e.selection)) : [],
		selectedResources: c?.resources || {},
		virtualResources: c?.virtualResources || {},
		search: "",
		navigationRevision: 0,
		loading: !1,
		busy: !1,
		error: ""
	}), C = N(() => {
		let t = f ? "" : S.search.trim().toLocaleLowerCase(), n = (e) => !t || [
			e.title,
			e.subtitle,
			e.metadata?.alias
		].some((e) => String(e || "").toLocaleLowerCase().includes(t)), r = (S.presentation.navigationOnlyNodes ? [] : S.nodes).map(g).map(ui).map(y).filter(n), i = (S.presentation.selectionScoped && e.selectionState && !f ? Object.values(S.virtualResources).filter((e) => e && (e.selection?.adapter || e.adapter || h) === h && e.parentId === S.selectedNode) : S.items).map(g).map(ui).map(y).filter(n), a = S.contextItems.map(di);
		return f || !S.sortBy ? [
			...r,
			...i,
			...a
		] : [
			...r.sort(jo(S.sortBy, S.sortDirection)),
			...i.sort(jo(S.sortBy, S.sortDirection)),
			...a
		];
	}), T = N(() => {
		let t = e.selectionTarget || "both";
		return C.value.filter((e) => mi(e, t));
	}), E = N(() => {
		let t = e.selectionTarget || "both";
		return C.value.filter((e) => hi(e, t));
	}), D = N(() => m ? S.selectedIds.map((e) => C.value.find((t) => z(t) === e) || S.selectedResources[e]).filter(Boolean) : C.value.filter((e) => S.selectedIds.includes(z(e)))), O = N(() => C.value.find((e) => z(e) === S.focusedId) || (m ? S.selectedResources[S.focusedId] : null) || null), k = 0, A = "", j = !1, M = () => JSON.stringify([
		d,
		S.search,
		S.sortBy,
		S.sortDirection,
		S.filters,
		S.pageSize
	]);
	async function ee() {
		if (S.loadingAll || S.loading || S.loadingMore || d !== "smart") return;
		let e = S.selectedNode, t = M(), n = S.navigationRevision;
		S.loadingAll = !0;
		try {
			for (; S.pagination?.hasMore && e === S.selectedNode && t === M() && n === S.navigationRevision;) {
				let t = S.pagination.nextOffset;
				if (!await P(e, { append: !0 }) || S.error || S.pagination?.nextOffset <= t) break;
			}
		} finally {
			S.loadingAll = !1;
		}
	}
	async function P(n = S.selectedNode, r = {}) {
		let i = M(), a = n === S.selectedNode && i === A, s = !!(r.append && a && d === "smart");
		if (r.append && (!s || S.loading || S.loadingMore || !S.pagination?.hasMore)) return;
		let c = ++k, l = f ? r.offset ?? (s ? S.pagination.nextOffset : a && d === "pages" && S.pagination?.offset || 0) : 0;
		S.loading = !s, S.loadingMore = s, S.error = "";
		try {
			let r = await t.getResources(n, {
				search: S.search,
				sortBy: S.sortBy,
				sortDirection: S.sortDirection,
				filters: S.filters,
				...f ? {
					offset: l,
					limit: S.pageSize
				} : {}
			});
			if (c !== k) return;
			if (!j && (!m || f && !o && !e.selectionState && n !== S.selectedNode) && (S.selectedIds = [], S.selectedResources = {}), s && r.pagination?.total !== S.pagination.total) return P(n, { offset: 0 });
			s || (S.focusedId = null), S.pagination = r.pagination ? {
				...r.pagination,
				nextOffset: r.pagination.offset + r.pagination.limit
			} : null, S.navigationNodes = r.navigationNodes || null, S.selectedNode = n;
			let i = (e, t) => [...new Map([...e, ...t].map((e) => [z(g(e)), e])).values()];
			if (S.nodes = s ? i(S.nodes, r.nodes) : r.nodes, S.items = s ? i(S.items, r.items) : r.items, r.presentation?.selectionScoped) for (let e of r.items) {
				let t = g(e);
				S.virtualResources[z(t)] = ui(t);
			}
			if (m) for (let e of [...r.nodes, ...r.items]) {
				let t = g(e);
				S.selectedIds.includes(z(t)) && (S.selectedResources[z(t)] = y(ui(t)));
			}
			S.contextItems = s ? i(S.contextItems, r.contextItems || []) : r.contextItems || [], S.loadedCount = (r.presentation?.navigationOnlyNodes ? 0 : S.nodes.length) + S.items.length + S.contextItems.length, S.breadcrumb = r.breadcrumb, S.actions = e.mode === "readonly" ? [] : r.actions, S.presentation = r.presentation || S.presentation, S.sortBy && !(S.presentation.sortFields || []).some((e) => e.id === S.sortBy) && (S.sortBy = "", S.sortDirection = ""), (S.presentation.filters || []).forEach((e) => {
				S.filters[e.id] === void 0 && (S.filters[e.id] = e.default);
			}), S.currentResource = r.currentResource || null;
			let a = new URL(window.location.href);
			return a.searchParams.set("node", n), window.history.replaceState({}, "", a), A = M(), s || S.navigationRevision++, !0;
		} catch (t) {
			if (c !== k) return;
			if (n !== e.initialNode && [403, 404].includes(t.status)) {
				S.selectedNode = e.initialNode, await P(e.initialNode);
				return;
			}
			return S.error = t.message, Joomla.renderMessages({ error: [t.message] }), !1;
		} finally {
			c === k && (S.loading = !1, S.loadingMore = !1);
		}
	}
	w(() => [
		S.search,
		S.sortBy,
		S.sortDirection,
		S.pageSize
	], () => {
		f && S.pagination && !j && P(S.selectedNode, { offset: 0 });
	});
	async function te(t) {
		if (!e.paginationSupported) return;
		let n = R(t, e), r = ["pages", "smart"].includes(n.mode);
		if (n.mode === d && n.pageSize === S.pageSize) return;
		let i = {
			paged: f,
			mode: d,
			size: S.pageSize
		};
		for (let e of D.value) S.selectedResources[z(e)] = e;
		j = !0, ++k, d = n.mode, S.loadingMode = d, f = r, m = f || p, S.pageSize = n.pageSize, await F();
		let a = await P(S.selectedNode, { offset: 0 });
		return a === !1 && (d = i.mode, S.loadingMode = d, f = i.paged, m = f || p, S.pageSize = i.size), await F(), j = !1, a;
	}
	function I(t, n = !0) {
		if (L(t), !mi(t, e.selectionTarget || "both") || _(t)) return;
		let r = z(t);
		m && (S.selectedResources[r] = t);
		let i = S.selectedIds.includes(r);
		!i && e.multiple && n && S.selectedIds.length >= s || (!e.multiple || !n ? S.selectedIds = i ? [] : [r] : S.selectedIds = i ? S.selectedIds.filter((e) => e !== r) : [...S.selectedIds, r]);
	}
	function L(e) {
		pi(e) && (S.focusedId = z(e));
	}
	function V() {
		m && E.value.forEach((e) => {
			S.selectedResources[z(e)] = e;
		});
		let t = E.value.map(z);
		if (o && !e.multiple) {
			let e = t[0];
			S.selectedIds = e && !S.selectedIds.includes(e) ? [e] : [];
			return;
		}
		let n = S.selectedIds.filter((e) => !t.includes(e)).length, r = Math.min(t.length, Math.max(0, s - n)), i = r > 0 && t.filter((e) => S.selectedIds.includes(e)).length >= r;
		S.selectedIds = i ? S.selectedIds.filter((e) => !t.includes(e)) : [.../* @__PURE__ */ new Set([...S.selectedIds, ...t])].slice(0, s);
	}
	function H() {
		m && E.value.forEach((e) => {
			S.selectedResources[z(e)] = e;
		});
		let e = E.value.map(z), t = new Set(S.selectedIds);
		e.forEach((e) => t.has(e) ? t.delete(e) : t.add(e)), S.selectedIds = [...t].slice(0, s);
	}
	w(() => [
		S.selectedNode,
		S.activeView,
		S.pageSize,
		S.viewOptions,
		S.hiddenColumns,
		S.shownColumns,
		S.sortBy,
		S.sortDirection,
		S.showInfo,
		S.filters
	], () => n.save(S), { deep: !0 });
	function U(t, n) {
		if (e.multiple && S.selectedIds.length >= s || !e.selectionState || e.mode === "readonly" || e.selectionTarget === "node" || v.size && !v.has(n)) return !1;
		let r = S.selectedResources[S.selectedIds[0]]?.selection?.adapter || c?.items.find((e) => B(e.selection) === S.selectedIds[0])?.selection.adapter;
		return !(e.multiple && i?.homogeneous && r && r !== t);
	}
	function re(t) {
		return !(!e.selectionState || e.mode === "readonly" || e.selectionTarget === "node" || v.size && !v.has(t));
	}
	function ie(t, n = null) {
		let r = t.adapter || h, i = {
			adapter: r,
			id: t.id
		}, a = o ? B(i) : t.id, s = n ? z(n) : null;
		if (n && !S.selectedIds.includes(s) && !S.virtualResources[s]) throw Error("COM_SMARTBROWSER_LINK_SELECTION_FULL");
		if ((S.selectedIds.includes(a) || S.virtualResources[a]) && a !== s) throw Error("COM_SMARTBROWSER_LINK_DUPLICATE");
		if (t.uniquenessId) for (let e of /* @__PURE__ */ new Set([...S.selectedIds, ...Object.keys(S.virtualResources)])) {
			if (e === s) continue;
			let n = S.virtualResources[e] || S.selectedResources[e], i = n?.selection || (n ? {
				adapter: n.adapter || h,
				id: n.id
			} : c?.items.find((t) => B(t.selection) === e)?.selection);
			if (i?.adapter === r && (i.id === t.uniquenessId || i.id.startsWith(t.uniquenessId + "."))) throw Error("COM_SMARTBROWSER_LINK_DUPLICATE");
		}
		if (!n && !re(t.type)) throw Error("COM_SMARTBROWSER_LINK_SELECTION_FULL");
		let l = ui({
			...t,
			adapter: r,
			...o ? {
				selection: i,
				selectionKey: a
			} : {}
		});
		return S.selectedResources[a] = l, S.virtualResources[a] = l, S.selectedIds = n ? S.selectedIds.map((e) => e === s ? a : e) : U(r, t.type) ? e.multiple ? [...S.selectedIds, a] : [a] : S.selectedIds, s && s !== a && (delete S.selectedResources[s], delete S.virtualResources[s]), S.focusedId = a, l;
	}
	function W(e) {
		for (let t of e) {
			let e = z(t);
			S.virtualResources[e] && (S.selectedIds = S.selectedIds.filter((t) => t !== e), delete S.selectedResources[e], delete S.virtualResources[e], S.focusedId === e && (S.focusedId = null));
		}
	}
	return t.options && e.selectionState && (t.options.selectionItems = () => [.../* @__PURE__ */ new Set([...S.selectedIds, ...Object.keys(S.virtualResources)])].map((e) => {
		let t = S.virtualResources[e] || S.selectedResources[e];
		return t ? {
			selection: t.selection || {
				adapter: t.adapter || h,
				id: t.id
			},
			usage: {}
		} : c?.items.find((t) => B(t.selection) === e);
	}).filter(Boolean)), {
		state: S,
		resources: C,
		selectableResources: T,
		bulkSelectableResources: E,
		selection: D,
		focusedResource: O,
		load: P,
		loadAll: ee,
		loadMore: () => P(S.selectedNode, { append: !0 }),
		applyLoadingPreferences: te,
		focus: L,
		toggle: I,
		selectAll: V,
		invertSelection: H,
		canAddSelection: U,
		canCreateSelectionResource: re,
		replaceSelectionResource: ie,
		deleteVirtualResources: W
	};
}
//#endregion
//#region resources/js/core/viewRegistry.js
var No = () => {
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
}, Po = (e) => {
	if (!Array.isArray(e)) throw TypeError("Collection items must be an array.");
	let t = e.map((e) => e && typeof e == "object" ? e.id : e);
	if (t.some((e) => !["string", "number"].includes(typeof e) || String(e) === "")) throw TypeError("Invalid collection identifier.");
	return [...new Set(t.map(String))];
};
function Fo({ config: e, api: t, notify: n, translate: r }) {
	let i = e.referenceItems === !0 || !e.adapter || (e.items || []).some((e) => e?.selection || e?.adapter), s = (t) => i ? V(t, e) : Po(t), c = (e) => i ? B(e.selection) : e, l = () => i ? JSON.parse(JSON.stringify(y)) : [...y], u = d(), f = e.viewPreferenceKey || "supjx.smartbrowser.collection.view", p;
	try {
		p = L().getItem(f);
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
				L().setItem(f, e.activeView);
			} catch {}
		}
	}, _ = u.run(() => Mo({
		options: h,
		api: t,
		persistence: g,
		viewRegistry: No().register({
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
			let e = new Map(t.map((e) => [z(e), e]));
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
		n.length !== y.length && (y = n, S.value++, v.items = v.items.filter((e) => !t.has(z(e))), v.selectedIds = v.selectedIds.filter((e) => !t.has(e)), D("remove"));
	}
	async function j(n, r = v.selectedIds) {
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
			let u = new Map(v.items.map((e) => [z(e), e]));
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
		resources: u.run(() => N(() => v.sortBy === "collectionOrder" ? v.sortDirection === "desc" ? [...v.items].reverse() : v.items : e.selectedResources ? v.items : _.resources.value)),
		referenceItems: i,
		canRemove: w,
		canOrder: T,
		refresh: O,
		setItems: k,
		remove: A,
		move: j,
		revision: S,
		reorderItems(e) {
			if (!T || x || v.busy || v.loading) return;
			if (!Array.isArray(e) || e.length !== y.length || new Set(e).size !== y.length || e.some((e) => !y.some((t) => c(t) === e))) throw TypeError("Invalid collection order.");
			let t = new Map(y.map((e) => [c(e), e]));
			y = e.map((e) => t.get(e));
			let n = new Map(v.items.map((e) => [z(e), e]));
			v.items = e.map((e) => n.get(e)).filter(Boolean), S.value++, D("reorder");
		},
		setUsage(e, t) {
			if (!C || x || !i || v.loading || v.busy) return;
			let n = z(e);
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
export { dn as C, tr as S, zt as T, si as _, Wa as a, Jr as b, Ea as c, Ci as d, Si as f, mi as g, ui as h, Ao as i, wa as l, bi as m, No as n, Ua as o, xi as p, Mo as r, Ha as s, Fo as t, Hi as u, ti as v, $t as w, Wr as x, Qr as y };
