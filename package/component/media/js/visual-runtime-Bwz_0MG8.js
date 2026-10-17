import { A as e, B as t, C as n, D as r, E as i, F as a, G as o, H as s, I as c, J as l, K as u, L as d, N as f, O as p, P as m, R as h, S as g, U as _, V as v, W as y, Y as b, _ as x, b as S, d as C, f as w, g as T, h as E, j as D, k as O, m as k, n as A, p as j, q as M, t as N, v as P, w as F, x as I, y as L, z as R } from "./visual-runtime-DqAjSaDT.js?v=4.0.0";
import { i as z, n as B, r as V, t as H } from "./visual-runtime-1h24eaHt.js?v=4.0.0";
import { t as ee } from "./visual-runtime-B7XS5tio.js?v=4.0.0";
//#region resources/js/components/ResourceFancySelect.vue
var U = ["placeholder"], te = ["multiple"], W = ["selected"], ne = ["value", "selected"], re = {
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
	setup(t, { emit: n }) {
		let r = t, i = n, a = y(null), o = P(() => r.options.filter((e) => String(e.value) !== "")), s = P(() => o.value.map((e) => String(e.value)).join("|")), c = (e) => r.multiple ? r.modelValue.includes(String(e)) : String(r.modelValue) === String(e), l = (e) => i("update:modelValue", r.multiple ? Array.from(e.target.selectedOptions, (e) => e.value) : e.target.value), u, d, p, h = () => a.value?.choicesInstance?.hideDropdown(), _ = () => {
			if (!u?.matches(":popover-open")) return;
			let e = a.value?.choicesInstance?.containerOuter?.element;
			if (!e) return;
			let t = e.getBoundingClientRect();
			if (t.bottom < 0 || t.top > window.innerHeight) {
				a.value.choicesInstance.hideDropdown();
				return;
			}
			let n = window.innerHeight - t.bottom - 8, r = t.top - 8, i = n < 240 && r > n, o = Math.max(0, i ? r : n);
			u.style.left = `${t.left}px`, u.style.top = `${i ? t.top : t.bottom}px`, u.style.width = `${t.width}px`, u.style.maxHeight = `${o}px`, u.style.transform = i ? "translateY(-100%)" : "", u.style.setProperty("--resource-batch-dropdown-list-height", `${Math.max(0, o - 2)}px`);
		}, v = () => {
			u && (u.classList.contains("is-active") && a.value?.closest("dialog")?.open ? (u.matches(":popover-open") || u.showPopover(), _()) : u.matches(":popover-open") && u.hidePopover());
		};
		return D(async () => {
			await O(), u = a.value?.choicesInstance?.dropdown?.element, u && (p = a.value.closest("dialog"), u.setAttribute("popover", "manual"), u.classList.add("resource-batch-choices-dropdown"), d = new MutationObserver(v), d.observe(u, {
				attributes: !0,
				attributeFilter: ["class"]
			}), window.addEventListener("scroll", _, !0), window.addEventListener("resize", _), p?.addEventListener("close", h));
		}), e(() => {
			d?.disconnect(), u?.matches(":popover-open") && u.hidePopover(), window.removeEventListener("scroll", _, !0), window.removeEventListener("resize", _), p?.removeEventListener("close", h);
		}), R(() => r.modelValue, async (e) => {
			await O();
			let t = a.value?.choicesInstance;
			if (!t) return;
			let n = r.multiple ? e : e ? [e] : [], i = t.getValue(!0), o = Array.isArray(i) ? i : i ? [i] : [];
			o.filter((e) => !n.includes(String(e))).forEach((e) => t.removeActiveItemsByValue(String(e))), n.filter((e) => !o.includes(String(e))).forEach((e) => t.setChoiceByValue(String(e)));
		}), (e, n) => (f(), g("joomla-field-fancy-select", {
			ref_key: "field",
			ref: a,
			key: s.value,
			class: M({ "resource-batch-single-select": !t.multiple }),
			placeholder: t.t(t.placeholder)
		}, [L("select", {
			class: "form-select",
			multiple: t.multiple,
			onChange: l
		}, [t.multiple ? I("", !0) : (f(), g("option", {
			key: 0,
			value: "",
			selected: !t.modelValue
		}, b(t.t(t.placeholder)), 9, W)), (f(!0), g(x, null, m(o.value, (e) => (f(), g("option", {
			key: e.value,
			value: String(e.value),
			selected: c(e.value)
		}, b(t.t(e.label)), 9, ne))), 128))], 40, te)], 10, U));
	}
}, G = { class: "resource-batch-field" }, K = ["aria-label"], q = ["aria-pressed", "onClick"], J = {
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
		return (n, r) => (f(), g("div", G, [L("span", null, b(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), L("div", {
			class: "btn-group resource-batch-mode-toggle",
			role: "group",
			"aria-label": e.t("COM_SMARTBROWSER_BATCH_MODE")
		}, [(f(), g(x, null, m(t, (t) => L("button", {
			key: t.value,
			type: "button",
			class: M(["btn", e.modelValue === t.value ? "is-active" : ""]),
			"aria-pressed": e.modelValue === t.value,
			onClick: (e) => n.$emit("update:modelValue", t.value)
		}, b(e.t(t.label)), 11, q)), 64))], 8, K)]));
	}
}, ie = ["aria-label"], ae = { class: "resource-batch-body" }, oe = {
	class: "resource-batch-heading",
	role: "heading",
	"aria-level": "3"
}, se = ["open"], ce = { class: "resource-batch-fields" }, le = ["aria-label"], ue = ["value"], de = ["aria-label"], fe = { value: "asc" }, pe = { value: "desc" }, me = ["open"], he = { class: "resource-batch-fields" }, ge = ["aria-label"], _e = {
	key: 1,
	class: "text-danger"
}, ve = ["open"], ye = { class: "resource-batch-fields" }, be = ["disabled"], xe = { class: "resource-batch-check" }, Se = { key: 0 }, Ce = ["open"], we = { class: "resource-batch-fields" }, Te = { class: "input-group" }, Ee = ["open"], De = { class: "resource-batch-fields" }, Oe = { class: "resource-batch-check" }, ke = ["disabled"], Ae = ["open"], je = ["onClick"], Me = { class: "resource-batch-fields" }, Ne = ["onUpdate:modelValue", "aria-label"], Pe = { value: "" }, Fe = ["value"], Ie = ["open"], Le = {
	key: 0,
	class: "resource-batch-fields"
}, Re = { class: "resource-batch-field" }, ze = { class: "resource-batch-field" }, Be = ["open"], Ve = {
	key: 0,
	class: "resource-batch-fields"
}, He = ["open"], Ue = ["onClick"], We = {
	key: 0,
	class: "resource-batch-fields"
}, Ge = ["onUpdate:modelValue", "aria-label"], Ke = { value: "" }, qe = ["value"], Je = ["open"], Ye = {
	key: 0,
	class: "resource-batch-fields"
}, Xe = { class: "resource-batch-field" }, Ze = { class: "resource-batch-field" }, Qe = ["open"], $e = {
	key: 0,
	class: "resource-batch-fields"
}, et = ["open"], tt = ["open"], nt = {
	key: 0,
	class: "resource-batch-fields"
}, rt = ["open"], it = {
	key: 0,
	class: "resource-batch-fields"
}, at = { value: "add" }, ot = { value: "remove" }, st = { value: "set" }, ct = ["open"], lt = {
	key: 0,
	class: "resource-batch-fields"
}, ut = { value: "yes" }, dt = { value: "no" }, Y = { class: "resource-batch-bottom" }, X = { class: "resource-batch-preview" }, ft = {
	class: "resource-batch-preview-heading",
	role: "heading",
	"aria-level": "3"
}, pt = {
	key: 0,
	class: "resource-batch-summary"
}, mt = {
	key: 0,
	class: "fas fa-arrow-right resource-batch-sequence-arrow",
	"aria-hidden": "true"
}, ht = { class: "resource-batch-summary-step" }, gt = {
	class: "resource-batch-summary-step-heading",
	role: "heading",
	"aria-level": "4"
}, _t = {
	key: 0,
	class: "resource-batch-summary-params"
}, vt = {
	key: 1,
	class: "resource-batch-no-changes"
}, yt = { class: "resource-batch-footer" }, bt = { class: "resource-batch-footer-actions" }, xt = ["disabled"], St = ["aria-label"], Ct = { class: "resource-batch-preview-dialog-head" }, wt = ["aria-label"], Tt = { class: "resource-batch-preview-list" }, Et = ["title"], Dt = ["title"], Ot = ["aria-label"], kt = { class: "resource-batch-preview-dialog-head" }, At = ["aria-label"], jt = { class: "resource-batch-selected-list" }, Z = {
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
		let a = e, o = r, s = i("resourceApi"), c = y(!1), l = y([]), d = y(!1), p = y(""), h = 0, E = y(null), O = y(null), k = y(null), A = P(() => a.adapter.replace(/^flat-/, "")), N = P(() => A.value === "media"), R = P(() => ["articles", "articles-by-tag"].includes(A.value)), z = P(() => A.value === "categories"), B = P(() => A.value === "tags"), V = P(() => A.value === "menus"), H = P(() => A.value === "users"), ee = P(() => ({
			articles: "article:",
			"articles-by-tag": "article:",
			categories: "category:",
			tags: "tag:",
			menus: "menu-item:",
			users: "user:"
		})[A.value]), U = P(() => !a.collectionOnly && ee.value ? a.selection.filter((e) => e.id.startsWith(ee.value)) : a.selection), te = {
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
		}, W = {
			changeLanguage: !1,
			language: "",
			changeAccess: !1,
			access: "",
			tagsOpen: !1,
			tagAdd: [],
			tagRemove: [],
			placement: "none",
			category: ""
		}, ne = {
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
		}, G = {
			groupOpen: !1,
			groupAction: "add",
			group: "",
			resetOpen: !1,
			reset: "yes"
		}, K = _({ ...te }), q = _({ ...W }), Z = _({ ...ne }), Q = _({ ...G }), $ = _({
			enabled: !1,
			field: "title",
			direction: "asc"
		}), Mt = P(() => U.value.length === 1 && U.value[0].capabilities?.extract === !0), Nt = [{
			id: "language",
			enabled: "changeLanguage",
			label: "COM_SMARTBROWSER_BATCH_SET_LANGUAGE",
			placeholder: "COM_SMARTBROWSER_SELECT_LANGUAGE"
		}, {
			id: "access",
			enabled: "changeAccess",
			label: "COM_SMARTBROWSER_BATCH_SET_ACCESS",
			placeholder: "COM_SMARTBROWSER_SELECT_ACCESS"
		}], Pt = Nt, Ft = P(() => $.enabled || JSON.stringify(K) !== JSON.stringify(te) || JSON.stringify(q) !== JSON.stringify(W) || JSON.stringify(Z) !== JSON.stringify(ne) || JSON.stringify(Q) !== JSON.stringify(G)), It = (e) => (a.batchOptions[e] || a.filters.find((t) => t.id === e)?.options || []).filter((e) => String(e.value) !== ""), Lt = P(() => (a.batchOptions.menu || []).flatMap((e) => [{
			value: `${e.value}.0`,
			label: e.label
		}, ...(a.batchOptions.menuParent || []).filter((t) => t.menu === e.value).map((t) => ({
			value: `${e.value}.${t.value}`,
			label: `- ${t.label}`
		}))])), Rt = P(() => K.zipName.trim().replace(/\.zip$/i, "")), zt = (e) => {
			q.tagAdd = e, q.tagRemove = q.tagRemove.filter((t) => !e.includes(t));
		}, Bt = (e) => {
			q.tagRemove = e, q.tagAdd = q.tagAdd.filter((t) => !e.includes(t));
		}, Vt = (e) => {
			Z.tagAdd = e, Z.tagRemove = Z.tagRemove.filter((t) => !e.includes(t));
		}, Ht = (e) => {
			Z.tagRemove = e, Z.tagAdd = Z.tagAdd.filter((t) => !e.includes(t));
		}, Ut = (e, t) => a.t(It(e).find((e) => String(e.value) === String(t))?.label || t), Wt = P(() => {
			let e = [];
			if ($.enabled && a.orderingAvailable && e.push({
				id: "sort",
				title: a.t("COM_SMARTBROWSER_BATCH_SORT"),
				parameters: [a.t(a.sortFields.find((e) => e.id === $.field)?.label || $.field), a.t($.direction === "asc" ? "COM_SMARTBROWSER_ASCENDING" : "COM_SMARTBROWSER_DESCENDING")]
			}), N.value) K.placement !== "none" && e.push({
				id: "placement",
				title: a.t(K.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
				parameters: [l.value.find((e) => e.value === K.destination)?.path || "..."]
			}), K.rename && e.push({
				id: "rename",
				title: a.t("COM_SMARTBROWSER_BATCH_RENAME"),
				parameters: [
					...K.find ? [`${a.t("COM_SMARTBROWSER_BATCH_FIND")}: ${K.find} → ${K.replace}`] : [],
					...K.prefix ? [`${a.t("COM_SMARTBROWSER_BATCH_PREFIX")}: ${K.prefix}`] : [],
					...K.suffix ? [`${a.t("COM_SMARTBROWSER_BATCH_SUFFIX")}: ${K.suffix}`] : [],
					...K.number ? [`${a.t("COM_SMARTBROWSER_BATCH_NUMBER")}: ${K.startAt}`] : []
				],
				preview: !0
			}), K.zip && e.push({
				id: "zip",
				title: a.t("COM_SMARTBROWSER_BATCH_ZIP"),
				parameters: [`${Rt.value}.zip`]
			}), K.extract && Mt.value && e.push({
				id: "extract",
				title: a.t("COM_SMARTBROWSER_BATCH_EXTRACT"),
				parameters: K.deleteArchive ? [a.t("COM_SMARTBROWSER_BATCH_EXTRACT_DELETE")] : []
			});
			else if (R.value) {
				for (let t of Nt) q[t.enabled] && q[t.id] && e.push({
					id: t.id,
					title: a.t(t.label),
					parameters: [Ut(t.id, q[t.id])]
				});
				q.tagsOpen && q.tagAdd.length && e.push({
					id: "tag-add",
					title: a.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: q.tagAdd.map((e) => Ut("tag", e))
				}), q.tagsOpen && q.tagRemove.length && e.push({
					id: "tag-remove",
					title: a.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: q.tagRemove.map((e) => Ut("tag", e))
				}), q.placement !== "none" && e.unshift({
					id: "placement",
					title: a.t(q.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [q.category ? Ut("category", q.category) : "..."]
				});
			} else if (z.value || B.value || V.value) {
				for (let t of Pt) Z[t.enabled] && Z[t.id] && e.push({
					id: t.id,
					title: a.t(t.label),
					parameters: [Ut(t.id, Z[t.id])]
				});
				z.value && (Z.tagsOpen && Z.tagAdd.length && e.push({
					id: "tag-add",
					title: a.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: Z.tagAdd.map((e) => Ut("tag", e))
				}), Z.tagsOpen && Z.tagRemove.length && e.push({
					id: "tag-remove",
					title: a.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: Z.tagRemove.map((e) => Ut("tag", e))
				}), Z.placement !== "none" && e.unshift({
					id: "placement",
					title: a.t(Z.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [Z.category ? Ut("category", Z.category) : "..."]
				}), Z.flipOrdering && e.push({
					id: "flip",
					title: a.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING"),
					parameters: []
				})), V.value && Z.placement !== "none" && e.unshift({
					id: "placement",
					title: a.t(Z.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [Lt.value.find((e) => e.value === Z.menuDestination)?.label || "..."]
				});
			} else H.value && (Q.groupOpen && Q.group && e.push({
				id: "group",
				title: a.t({
					add: "COM_SMARTBROWSER_BATCH_GROUP_ADD",
					remove: "COM_SMARTBROWSER_BATCH_GROUP_REMOVE",
					set: "COM_SMARTBROWSER_BATCH_GROUP_SET"
				}[Q.groupAction]),
				parameters: [Ut("group", Q.group)]
			}), Q.resetOpen && e.push({
				id: "reset",
				title: a.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET"),
				parameters: [a.t(Q.reset === "yes" ? "JYES" : "JNO")]
			}));
			return e;
		}), Gt = P(() => !(!U.value.length || !Wt.value.length || K.extract && (!Mt.value || K.rename || K.zip || K.placement !== "none") || N.value && K.placement !== "none" && !l.value.some((e) => e.value === K.destination) || R.value && q.placement !== "none" && !q.category || z.value && Z.placement !== "none" && !Z.category || V.value && Z.placement !== "none" && !Lt.value.some((e) => e.value === Z.menuDestination) || N.value && K.zip && !Rt.value)), Kt = () => {
			if (a.collectionOnly) return {};
			if (N.value) return {
				...K,
				zipName: Rt.value
			};
			if (R.value) return {
				language: q.changeLanguage ? q.language : "",
				access: q.changeAccess ? q.access : "",
				tagAdd: q.tagsOpen ? q.tagAdd : [],
				tagRemove: q.tagsOpen ? q.tagRemove : [],
				placement: q.placement,
				category: q.category
			};
			if (H.value) return {
				group: Q.groupOpen ? Q.group : "",
				groupAction: Q.groupAction === "remove" ? "del" : Q.groupAction,
				reset: Q.resetOpen ? Q.reset : ""
			};
			let e = Z.menuDestination.lastIndexOf(".");
			return {
				language: Z.changeLanguage ? Z.language : "",
				access: Z.changeAccess ? Z.access : "",
				tagAdd: z.value && Z.tagsOpen ? Z.tagAdd : [],
				tagRemove: z.value && Z.tagsOpen ? Z.tagRemove : [],
				placement: Z.placement,
				category: Z.category,
				flipOrdering: z.value && Z.flipOrdering,
				menu: V.value && e >= 0 ? Z.menuDestination.slice(0, e) : "",
				menuParent: V.value && e >= 0 ? Z.menuDestination.slice(e + 1) : "0"
			};
		}, qt = async () => {
			if (!c.value && Gt.value) {
				c.value = !0;
				try {
					await new Promise((e, t) => o("apply", {
						selection: U.value.map((e) => e.id),
						payload: {
							...Kt(),
							...$.enabled && a.orderingAvailable ? { sort: {
								field: $.field,
								direction: $.direction
							} } : {}
						},
						resolve: e,
						reject: t
					})), nn();
				} catch (e) {
					window.Joomla?.renderMessages?.({ error: [e.message || String(e)] });
				} finally {
					c.value = !1;
				}
			}
		}, Jt = (e, t) => {
			if (!K.rename) return e.title;
			let n = e.kind === "item" ? e.title.lastIndexOf(".") : -1, r = n > 0 ? e.title.slice(0, n) : e.title, i = n > 0 ? e.title.slice(n) : "", a = K.find ? r.split(K.find).join(K.replace) : r, o = K.number ? `-${String(Math.max(1, Number(K.startAt) || 1) + t).padStart(2, "0")}` : "";
			return `${K.prefix}${a}${K.suffix}${o}${i}`;
		}, Yt = P(() => U.value.map((e, t) => {
			let n = e.id.includes(":") ? e.id.slice(e.id.indexOf(":") + 1) : e.title, r = K.placement !== "none" && K.destination ? `${K.destination.slice(K.destination.indexOf(":") + 1).replace(/\/$/, "")}/` : n.slice(0, n.lastIndexOf("/") + 1);
			return {
				id: e.id,
				before: n,
				after: r + Jt(e, t)
			};
		})), Xt = async () => {
			let e = ++h;
			d.value = !0, p.value = "";
			try {
				let t = await s.execute("batchFolders", U.value.map((e) => e.id));
				e === h && (l.value = t);
			} catch (t) {
				e === h && (p.value = t.message || String(t));
			} finally {
				e === h && (d.value = !1);
			}
		}, Zt = () => {
			Object.assign(K, te), Object.assign(q, W), Object.assign(Z, ne), Object.assign(Q, G), Object.assign($, {
				enabled: a.collectionOnly,
				field: a.sortFields[0]?.id || "title",
				direction: "asc"
			}), l.value = [], E.value?.showModal(), N.value && !a.collectionOnly && Xt();
		}, Qt = () => O.value?.showModal(), $t = () => {
			O.value?.open && O.value.close();
		}, en = () => k.value?.showModal(), tn = () => {
			k.value?.open && k.value.close();
		}, nn = () => {
			h++, $t(), tn(), E.value?.close();
		};
		return t({
			open: Zt,
			close: nn
		}), D(() => {
			window.SmartBrowserDialogDismiss.install(E.value, () => Ft.value), window.SmartBrowserDialogDismiss.install(O.value), window.SmartBrowserDialogDismiss.install(k.value), E.value.addEventListener("close", () => {
				$t(), tn();
			});
		}), (t, r) => (f(), g(x, null, [
			L("dialog", {
				ref_key: "dialog",
				ref: E,
				class: "resource-batch-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_BATCH_ACTIONS")
			}, [L("div", ae, [
				L("div", oe, b(e.t("COM_SMARTBROWSER_BATCH_SELECT_ACTIONS")), 1),
				e.orderingAvailable && (e.collectionOnly || U.value.every((e) => e.capabilities?.reorder)) ? (f(), g("details", {
					key: 0,
					class: "resource-batch-step",
					open: $.enabled
				}, [L("summary", { onClick: r[0] ||= T((e) => $.enabled = !$.enabled, ["prevent"]) }, b(e.t("COM_SMARTBROWSER_BATCH_SORT")), 1), L("div", ce, [v(L("select", {
					"onUpdate:modelValue": r[1] ||= (e) => $.field = e,
					class: "form-select",
					"aria-label": e.t("COM_SMARTBROWSER_BATCH_SORT")
				}, [(f(!0), g(x, null, m(e.sortFields, (t) => (f(), g("option", {
					key: t.id,
					value: t.id
				}, b(e.t(t.label)), 9, ue))), 128))], 8, le), [[w, $.field]]), v(L("select", {
					"onUpdate:modelValue": r[2] ||= (e) => $.direction = e,
					class: "form-select",
					"aria-label": e.t("COM_SMARTBROWSER_SORT_DIRECTION")
				}, [L("option", fe, b(e.t("COM_SMARTBROWSER_ASCENDING")), 1), L("option", pe, b(e.t("COM_SMARTBROWSER_DESCENDING")), 1)], 8, de), [[w, $.direction]])])], 8, se)) : I("", !0),
				N.value && !e.collectionOnly ? (f(), g(x, { key: 1 }, [
					L("details", {
						class: "resource-batch-step",
						open: K.placement !== "none"
					}, [L("summary", { onClick: r[3] ||= T((e) => K.placement = K.placement === "none" ? "move" : "none", ["prevent"]) }, b(e.t("COM_SMARTBROWSER_BATCH_PLACEMENT")), 1), L("div", he, [F(J, {
						modelValue: K.placement,
						"onUpdate:modelValue": r[4] ||= (e) => K.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), L("label", null, [n(b(e.t("COM_SMARTBROWSER_BATCH_DESTINATION_FOLDER")) + " ", 1), d.value ? (f(), g("span", {
						key: 0,
						class: "spinner-border spinner-border-sm",
						role: "status",
						"aria-label": e.t("COM_SMARTBROWSER_LOADING_FOLDERS")
					}, null, 8, ge)) : p.value ? (f(), g("span", _e, b(p.value), 1)) : (f(), S(re, {
						key: 2,
						modelValue: K.destination,
						"onUpdate:modelValue": r[5] ||= (e) => K.destination = e,
						options: l.value,
						placeholder: "COM_SMARTBROWSER_SELECT_FOLDER",
						t: e.t
					}, null, 8, [
						"modelValue",
						"options",
						"t"
					]))])])], 8, me),
					L("details", {
						class: "resource-batch-step",
						open: K.rename
					}, [L("summary", { onClick: r[6] ||= T((e) => K.rename = !K.rename, ["prevent"]) }, b(e.t("COM_SMARTBROWSER_BATCH_RENAME")), 1), L("div", ye, [
						L("label", null, [n(b(e.t("COM_SMARTBROWSER_BATCH_FIND")), 1), v(L("input", {
							"onUpdate:modelValue": r[7] ||= (e) => K.find = e,
							type: "text",
							class: "form-control"
						}, null, 512), [[j, K.find]])]),
						L("label", null, [n(b(e.t("COM_SMARTBROWSER_BATCH_REPLACE")), 1), v(L("input", {
							"onUpdate:modelValue": r[8] ||= (e) => K.replace = e,
							type: "text",
							class: "form-control",
							disabled: !K.find
						}, null, 8, be), [[j, K.replace]])]),
						L("label", null, [n(b(e.t("COM_SMARTBROWSER_BATCH_PREFIX")), 1), v(L("input", {
							"onUpdate:modelValue": r[9] ||= (e) => K.prefix = e,
							type: "text",
							class: "form-control"
						}, null, 512), [[j, K.prefix]])]),
						L("label", null, [n(b(e.t("COM_SMARTBROWSER_BATCH_SUFFIX")), 1), v(L("input", {
							"onUpdate:modelValue": r[10] ||= (e) => K.suffix = e,
							type: "text",
							class: "form-control"
						}, null, 512), [[j, K.suffix]])]),
						L("label", xe, [v(L("input", {
							"onUpdate:modelValue": r[11] ||= (e) => K.number = e,
							type: "checkbox",
							class: "form-check-input"
						}, null, 512), [[C, K.number]]), n(" " + b(e.t("COM_SMARTBROWSER_BATCH_NUMBER")), 1)]),
						K.number ? (f(), g("label", Se, [n(b(e.t("COM_SMARTBROWSER_BATCH_START_AT")), 1), v(L("input", {
							"onUpdate:modelValue": r[12] ||= (e) => K.startAt = e,
							type: "number",
							min: "1",
							class: "form-control"
						}, null, 512), [[
							j,
							K.startAt,
							void 0,
							{ number: !0 }
						]])])) : I("", !0)
					])], 8, ve),
					L("details", {
						class: "resource-batch-step",
						open: K.zip
					}, [L("summary", { onClick: r[13] ||= T((e) => K.zip = !K.zip, ["prevent"]) }, b(e.t("COM_SMARTBROWSER_BATCH_ZIP")), 1), L("div", we, [L("label", null, [n(b(e.t("COM_SMARTBROWSER_BATCH_ZIP_NAME")), 1), L("span", Te, [v(L("input", {
						"onUpdate:modelValue": r[14] ||= (e) => K.zipName = e,
						type: "text",
						class: "form-control",
						onBlur: r[15] ||= (e) => K.zipName = Rt.value
					}, null, 544), [[j, K.zipName]]), r[35] ||= L("span", { class: "input-group-text" }, ".zip", -1)])])])], 8, Ce),
					Mt.value ? (f(), g("details", {
						key: 0,
						class: "resource-batch-step",
						open: K.extract
					}, [L("summary", { onClick: r[16] ||= T((e) => K.extract = !K.extract, ["prevent"]) }, b(e.t("COM_SMARTBROWSER_BATCH_EXTRACT")), 1), L("div", De, [L("label", Oe, [v(L("input", {
						"onUpdate:modelValue": r[17] ||= (e) => K.deleteArchive = e,
						type: "checkbox",
						class: "form-check-input",
						disabled: !U.value.every((e) => e.capabilities?.delete)
					}, null, 8, ke), [[C, K.deleteArchive]]), n(" " + b(e.t("COM_SMARTBROWSER_BATCH_EXTRACT_DELETE")), 1)])])], 8, Ee)) : I("", !0)
				], 64)) : R.value && !e.collectionOnly ? (f(), g(x, { key: 2 }, [
					(f(), g(x, null, m(Nt, (t) => L("details", {
						key: t.id,
						class: "resource-batch-step",
						open: q[t.enabled]
					}, [L("summary", { onClick: T((e) => q[t.enabled] = !q[t.enabled], ["prevent"]) }, b(e.t(t.label)), 9, je), L("div", Me, [v(L("select", {
						"onUpdate:modelValue": (e) => q[t.id] = e,
						class: "form-select",
						"aria-label": e.t(t.label)
					}, [L("option", Pe, b(e.t(t.placeholder)), 1), (f(!0), g(x, null, m(It(t.id), (t) => (f(), g("option", {
						key: t.value,
						value: t.value
					}, b(e.t(t.label)), 9, Fe))), 128))], 8, Ne), [[w, q[t.id]]])])], 8, Ae)), 64)),
					L("details", {
						class: "resource-batch-step",
						open: q.tagsOpen
					}, [L("summary", { onClick: r[18] ||= T((e) => q.tagsOpen = !q.tagsOpen, ["prevent"]) }, b(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), q.tagsOpen ? (f(), g("div", Le, [L("div", Re, [L("span", null, b(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), F(re, {
						"model-value": q.tagAdd,
						options: It("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": zt
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])]), L("div", ze, [L("span", null, b(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), F(re, {
						"model-value": q.tagRemove,
						options: It("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": Bt
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])])])) : I("", !0)], 8, Ie),
					L("details", {
						class: "resource-batch-step",
						open: q.placement !== "none"
					}, [L("summary", { onClick: r[19] ||= T((e) => q.placement = q.placement === "none" ? "move" : "none", ["prevent"]) }, b(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), q.placement === "none" ? I("", !0) : (f(), g("div", Ve, [F(J, {
						modelValue: q.placement,
						"onUpdate:modelValue": r[20] ||= (e) => q.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), L("label", null, [n(b(e.t("COM_SMARTBROWSER_CATEGORY")), 1), F(re, {
						modelValue: q.category,
						"onUpdate:modelValue": r[21] ||= (e) => q.category = e,
						options: It("category"),
						placeholder: "COM_SMARTBROWSER_SELECT_CATEGORY",
						t: e.t
					}, null, 8, [
						"modelValue",
						"options",
						"t"
					])])]))], 8, Be)
				], 64)) : !e.collectionOnly && (z.value || B.value || V.value) ? (f(), g(x, { key: 3 }, [
					(f(!0), g(x, null, m(u(Pt), (t) => (f(), g("details", {
						key: t.id,
						class: "resource-batch-step",
						open: Z[t.enabled]
					}, [L("summary", { onClick: T((e) => Z[t.enabled] = !Z[t.enabled], ["prevent"]) }, b(e.t(t.label)), 9, Ue), Z[t.enabled] ? (f(), g("div", We, [v(L("select", {
						"onUpdate:modelValue": (e) => Z[t.id] = e,
						class: "form-select",
						"aria-label": e.t(t.label)
					}, [L("option", Ke, b(e.t(t.placeholder)), 1), (f(!0), g(x, null, m(It(t.id), (t) => (f(), g("option", {
						key: t.value,
						value: t.value
					}, b(e.t(t.label)), 9, qe))), 128))], 8, Ge), [[w, Z[t.id]]])])) : I("", !0)], 8, He))), 128)),
					z.value ? (f(), g("details", {
						key: 0,
						class: "resource-batch-step",
						open: Z.tagsOpen
					}, [L("summary", { onClick: r[22] ||= T((e) => Z.tagsOpen = !Z.tagsOpen, ["prevent"]) }, b(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), Z.tagsOpen ? (f(), g("div", Ye, [L("div", Xe, [L("span", null, b(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), F(re, {
						"model-value": Z.tagAdd,
						options: It("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": Vt
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])]), L("div", Ze, [L("span", null, b(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), F(re, {
						"model-value": Z.tagRemove,
						options: It("tag"),
						multiple: "",
						placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
						t: e.t,
						"onUpdate:modelValue": Ht
					}, null, 8, [
						"model-value",
						"options",
						"t"
					])])])) : I("", !0)], 8, Je)) : I("", !0),
					z.value ? (f(), g("details", {
						key: 1,
						class: "resource-batch-step",
						open: Z.placement !== "none"
					}, [L("summary", { onClick: r[23] ||= T((e) => Z.placement = Z.placement === "none" ? "move" : "none", ["prevent"]) }, b(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), Z.placement === "none" ? I("", !0) : (f(), g("div", $e, [F(J, {
						modelValue: Z.placement,
						"onUpdate:modelValue": r[24] ||= (e) => Z.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), L("label", null, [n(b(e.t("COM_SMARTBROWSER_BATCH_PARENT_CATEGORY")), 1), F(re, {
						modelValue: Z.category,
						"onUpdate:modelValue": r[25] ||= (e) => Z.category = e,
						options: It("category"),
						placeholder: "COM_SMARTBROWSER_SELECT_CATEGORY",
						t: e.t
					}, null, 8, [
						"modelValue",
						"options",
						"t"
					])])]))], 8, Qe)) : I("", !0),
					z.value ? (f(), g("details", {
						key: 2,
						class: "resource-batch-step",
						open: Z.flipOrdering
					}, [L("summary", { onClick: r[26] ||= T((e) => Z.flipOrdering = !Z.flipOrdering, ["prevent"]) }, b(e.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING")), 1)], 8, et)) : I("", !0),
					V.value ? (f(), g("details", {
						key: 3,
						class: "resource-batch-step",
						open: Z.placement !== "none"
					}, [L("summary", { onClick: r[27] ||= T((e) => Z.placement = Z.placement === "none" ? "move" : "none", ["prevent"]) }, b(e.t("COM_SMARTBROWSER_BATCH_MENU_PLACEMENT")), 1), Z.placement === "none" ? I("", !0) : (f(), g("div", nt, [F(J, {
						modelValue: Z.placement,
						"onUpdate:modelValue": r[28] ||= (e) => Z.placement = e,
						t: e.t
					}, null, 8, ["modelValue", "t"]), L("label", null, [n(b(e.t("COM_SMARTBROWSER_BATCH_MENU_DESTINATION")), 1), F(re, {
						modelValue: Z.menuDestination,
						"onUpdate:modelValue": r[29] ||= (e) => Z.menuDestination = e,
						options: Lt.value,
						placeholder: "COM_SMARTBROWSER_SELECT_MENU",
						t: e.t
					}, null, 8, [
						"modelValue",
						"options",
						"t"
					])])]))], 8, tt)) : I("", !0)
				], 64)) : H.value && !e.collectionOnly ? (f(), g(x, { key: 4 }, [L("details", {
					class: "resource-batch-step",
					open: Q.groupOpen
				}, [L("summary", { onClick: r[30] ||= T((e) => Q.groupOpen = !Q.groupOpen, ["prevent"]) }, b(e.t("COM_SMARTBROWSER_BATCH_USER_GROUPS")), 1), Q.groupOpen ? (f(), g("div", it, [L("label", null, [n(b(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), v(L("select", {
					"onUpdate:modelValue": r[31] ||= (e) => Q.groupAction = e,
					class: "form-select resource-batch-mode-select"
				}, [
					L("option", at, b(e.t("COM_SMARTBROWSER_BATCH_GROUP_ADD")), 1),
					L("option", ot, b(e.t("COM_SMARTBROWSER_BATCH_GROUP_REMOVE")), 1),
					L("option", st, b(e.t("COM_SMARTBROWSER_BATCH_GROUP_SET")), 1)
				], 512), [[w, Q.groupAction]])]), L("label", null, [n(b(e.t("COM_SMARTBROWSER_USER_GROUP")), 1), F(re, {
					modelValue: Q.group,
					"onUpdate:modelValue": r[32] ||= (e) => Q.group = e,
					options: It("group"),
					placeholder: "COM_SMARTBROWSER_SELECT_USER_GROUP",
					t: e.t
				}, null, 8, [
					"modelValue",
					"options",
					"t"
				])])])) : I("", !0)], 8, rt), L("details", {
					class: "resource-batch-step",
					open: Q.resetOpen
				}, [L("summary", { onClick: r[33] ||= T((e) => Q.resetOpen = !Q.resetOpen, ["prevent"]) }, b(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), Q.resetOpen ? (f(), g("div", lt, [L("label", null, [n(b(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), v(L("select", {
					"onUpdate:modelValue": r[34] ||= (e) => Q.reset = e,
					class: "form-select"
				}, [L("option", ut, b(e.t("JYES")), 1), L("option", dt, b(e.t("JNO")), 1)], 512), [[w, Q.reset]])])])) : I("", !0)], 8, ct)], 64)) : I("", !0)
			]), L("div", Y, [L("div", X, [L("div", ft, b(e.t("COM_SMARTBROWSER_BATCH_PREVIEW")), 1), Wt.value.length ? (f(), g("div", pt, [(f(!0), g(x, null, m(Wt.value, (t, n) => (f(), g("div", {
				key: t.id,
				class: "resource-batch-sequence-item"
			}, [n ? (f(), g("span", mt)) : I("", !0), L("div", ht, [L("div", gt, b(t.title), 1), t.parameters.length || t.preview ? (f(), g("div", _t, [(f(!0), g(x, null, m(t.parameters, (e) => (f(), g("span", { key: e }, b(e), 1))), 128)), t.preview ? (f(), g("button", {
				key: 0,
				type: "button",
				class: "resource-batch-preview-link",
				onClick: Qt
			}, b(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")), 1)) : I("", !0)])) : I("", !0)])]))), 128))])) : (f(), g("p", vt, b(e.t("COM_SMARTBROWSER_BATCH_NO_CHANGES")), 1))]), L("div", yt, [L("button", {
				type: "button",
				class: "resource-batch-items-link",
				onClick: en
			}, b(U.value.length) + " " + b(e.t(U.value.length === 1 ? "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_ONE" : "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_MANY")), 1), L("div", bt, [L("button", {
				type: "button",
				class: "btn btn-primary",
				disabled: c.value || !Gt.value,
				onClick: qt
			}, b(e.t("COM_SMARTBROWSER_BATCH_APPLY")), 9, xt), L("button", {
				type: "button",
				class: "btn btn-danger",
				onClick: nn
			}, b(e.t("COM_SMARTBROWSER_CANCEL")), 1)])])])], 8, ie),
			L("dialog", {
				ref_key: "previewDialog",
				ref: O,
				class: "resource-batch-preview-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")
			}, [L("div", Ct, [L("strong", null, b(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")) + " (" + b(Yt.value.length) + ")", 1), L("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: $t
			}, null, 8, wt)]), L("div", Tt, [(f(!0), g(x, null, m(Yt.value, (e) => (f(), g("div", {
				key: e.id,
				class: "resource-batch-preview-row"
			}, [
				L("span", { title: e.before }, b(e.before), 9, Et),
				r[36] ||= L("span", {
					class: "fas fa-arrow-right",
					"aria-hidden": "true"
				}, null, -1),
				L("strong", { title: e.after }, b(e.after), 9, Dt)
			]))), 128))])], 8, St),
			L("dialog", {
				ref_key: "selectionDialog",
				ref: k,
				class: "resource-batch-preview-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_SELECTED_ITEMS")
			}, [L("div", kt, [L("strong", null, b(e.t("COM_SMARTBROWSER_SELECTED_ITEMS")), 1), L("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: tn
			}, null, 8, At)]), L("ul", jt, [(f(!0), g(x, null, m(U.value, (e) => (f(), g("li", { key: e.id }, [L("span", {
				class: M(e.icon || "fas fa-file"),
				"aria-hidden": "true"
			}, null, 2), L("span", null, b(e.title), 1)]))), 128))])], 8, Ot)
		], 64));
	}
}, Q = {
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
}, $ = (e) => e.icon || e.headerIcon || Q[e.id || String(e.source || "").split(".").pop()] || (e.format === "date" ? "fas fa-calendar" : "fas fa-info"), Mt = (e) => e.icon || {
	"media.caption": "fas fa-comment",
	"media.class": "fas fa-code",
	"media.alt": "fas fa-font",
	"media.decorative": "fas fa-image",
	"media.loading": "fas fa-clock",
	"link.text": "fas fa-font",
	"link.target": "fas fa-external-link-alt"
}[e.key] || "fas fa-info", Nt = (e) => String(e ?? "").trim().replace(/\s+/g, " "), Pt = (e) => (e || []).filter((e) => e.type === "resource" && e.visualRole === "thumbnail");
function Ft(e, t = {}) {
	let n = t["article.displayedName"], r = It(e, t);
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
function It(e, t = {}) {
	if (!e || e.unavailable) return "";
	let n = t["visual.iconOverride"];
	return typeof n == "string" && n.length <= 160 && /^[a-zA-Z0-9_-]+(?: [a-zA-Z0-9_-]+)*$/.test(n) ? n : e.icon || "fas fa-file";
}
function Lt(e) {
	return !e || e.unavailable ? "" : e.thumbnail || e.metadata?.thumbnail || e.metadata?.poster || e.image || (e.type === "image" ? e.metadata?.url : "") || "";
}
function Rt(e, t = {}) {
	return [
		"category",
		"tag",
		"menu-item",
		"menu"
	].includes(e?.type) ? It({
		...e,
		icon: e.badgeIcon || e.icon
	}, t) : "";
}
function zt(e, t = {}, n = "") {
	return {
		...Ft(e, t),
		image: n || e?.image || Lt(e)
	};
}
function Bt(e, t = {}, n = "") {
	let r = Ft(e, t).visualPresentation, i = r === "icon" ? "" : n || Lt(e), a = r === "thumbnail" && i ? "" : Rt(e, t) || It(e, t);
	return {
		image: i,
		icon: a,
		typeIcon: e?.typeIcon || e?.icon || "fas fa-file",
		badgeIcon: r === "icon" ? "" : a,
		presentation: r,
		imageCrop: e?.imageCrop || null
	};
}
async function Vt(e, t, n) {
	let r = await n(t, e.picker);
	if (!r || r.unavailable || r.selectable === !1 || !Lt(r) || e.picker?.allowedResourceTypes?.length && !e.picker.allowedResourceTypes.includes(r.type)) throw Error("COM_SMARTBROWSER_USAGE_INVALID");
	return r;
}
//#endregion
//#region resources/js/core/extensionMetadata.js
var Ht = (e) => /^ext\.[a-zA-Z][a-zA-Z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)*$/.test(e), Ut = (e) => Object.fromEntries(Object.entries(e || {}).filter(([e]) => Ht(e)));
function Wt(e) {
	let t = e?.startsWith("ext.") ? e : `ext.${e}`;
	if (!Ht(t)) throw TypeError("Invalid extension metadata namespace.");
	return t;
}
function Gt(e) {
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
var Kt = /^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/, qt = (e, t) => Object.prototype.hasOwnProperty.call(e, t), Jt = (e) => e === void 0 ? void 0 : JSON.parse(JSON.stringify(e)), Yt = (e) => e == null || typeof e == "string" && !e.trim(), Xt = /* @__PURE__ */ new Set([
	"text",
	"textarea",
	"boolean",
	"select",
	"number",
	"resource"
]), Zt = (e, t) => !!(e.disabledWhen && qt(t || {}, e.disabledWhen.key) && t[e.disabledWhen.key] === e.disabledWhen.equals);
function Qt(e, t = {}) {
	if (!e || e.unavailable || !t || typeof t != "object") return [];
	let n = Array.isArray(e.selectionCapabilities) ? e.selectionCapabilities : [], r = /* @__PURE__ */ new Set();
	return n.flatMap((e) => {
		let n = e?.key;
		if (!Kt.test(n || "") || ![
			"string",
			"boolean",
			"number",
			"resource",
			"object"
		].includes(e.type) || r.has(n) || !qt(t, n) || t[n] === !1) return [];
		r.add(n);
		let i = t[n] && typeof t[n] == "object" ? t[n] : {};
		return [{
			...e,
			policy: i,
			presentation: ["secondary", "hidden"].includes(i.presentation) ? i.presentation : "primary",
			default: qt(i, "default") ? i.default : e.default,
			required: i.required === !0
		}];
	});
}
function $t(e, t) {
	if (Yt(t)) return e.required ? "COM_SMARTBROWSER_USAGE_REQUIRED" : null;
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
function en({ profile: e = {}, initialUsage: t = {}, resolveReference: n, editors: r = {} } = {}) {
	let i = /* @__PURE__ */ new Map(), a = (t) => Qt(t, e);
	function o(e) {
		if (!e) return {};
		let n = z(e);
		i.has(n) || i.set(n, e.unavailable ? Jt(t[n] || {}) : Ut(Jt(t[n] || {})));
		let r = i.get(n);
		for (let i of a(e)) qt(r, i.key) || (r[i.key] = Jt(qt(t[n] || {}, i.key) ? t[n][i.key] : i.default ?? null));
		for (let t of a(e)) Zt(t, r) && (r[t.key] = Jt(t.inactiveValue ?? null));
		return Jt(r);
	}
	function s(e, t, n) {
		(Ht(t) || a(e).some((e) => e.key === t)) && (Ht(t) && (n = Gt(n)), o(e), i.get(z(e))[t] = Jt(n), o(e));
	}
	async function c(e) {
		let t = {}, i = {}, s = {};
		for (let c of e) {
			let e = z(c), l = o(c), u = Ut(l);
			for (let o of a(c)) {
				let a = l[o.key], s = $t(Zt(o, l) ? {
					...o,
					required: !1
				} : o, a);
				if (!s && o.type === "resource" && !Yt(a)) {
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
				if (o.presentation !== "hidden" && !Xt.has(o.editor) && !d && (s = "COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE"), !s && d?.validate) try {
					s = await d.validate(a, {
						definition: o,
						resource: c,
						values: l
					}) || null;
				} catch {
					s = "COM_SMARTBROWSER_USAGE_INVALID";
				}
				s && (t[e] ||= {}, t[e][o.key] = s, o.presentation === "hidden" && (i[e] ||= {}, i[e][o.key] = s)), u[o.key] = o.type === "resource" && !Yt(a) ? B(a) : a;
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
function tn({ createLayer: e, report: t = (e) => console.error(e), removeOnError: n = !1, remountWithoutUpdate: r = !1 }) {
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
var nn = {
	__name: "ResourceVisualOverlays",
	props: { context: Object },
	setup(t) {
		let n = t, r = y(null), i = n.context?.overlayRegistry || window.SmartBrowserPicker, a = y(i?.extensions?.().visualOverlays || i?.visualOverlays || []), o = i?.subscribeVisualOverlays?.((e) => {
			a.value = e;
		}), s = tn({ createLayer(e, t) {
			let n = e.ownerDocument.createElement("div");
			return n.className = "resource-visual-overlay", n.dataset.overlayId = t.id, e.append(n), n;
		} });
		return R(() => [
			r.value,
			a.value,
			n.context
		], () => {
			s.sync(r.value, a.value, n.context, z(n.context?.resource));
		}, {
			deep: !0,
			flush: "post",
			immediate: !0
		}), e(() => {
			o?.(), s.destroy();
		}), (e, t) => (f(), g("div", {
			ref_key: "layer",
			ref: r,
			class: "resource-visual-overlay-layer"
		}, null, 512));
	}
};
//#endregion
//#region resources/js/core/previewRenderers.js
function rn(e) {
	let t = tn({
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
var an = {
	__name: "ResourcePreviewRenderer",
	props: { context: Object },
	emits: ["active-change", "before-update"],
	setup(t, { emit: n }) {
		let r = t, i = n, o = y(null), s = y(!1);
		R(s, (e) => i("active-change", e), { flush: "sync" });
		let c = r.context?.overlayRegistry || window.SmartBrowserPicker, l = y(c?.extensions?.().previewRenderers || c?.previewRenderers || []), u = c?.subscribePreviewRenderers?.((e) => {
			l.value = e;
		}), d = rn({ createLayer(e, t) {
			let n = e.ownerDocument.createElement("div");
			return n.className = "resource-preview-renderer", n.dataset.rendererId = t.id, e.append(n), n;
		} });
		return R(() => [
			o.value,
			l.value,
			r.context
		], () => {
			i("before-update"), s.value = d.sync(o.value, l.value, r.context, z(r.context?.resource));
		}, {
			deep: !0,
			flush: "post",
			immediate: !0
		}), e(() => {
			u?.(), d.destroy();
		}), (e, t) => (f(), g(x, null, [s.value ? I("", !0) : a(e.$slots, "default", {}, void 0, void 0, 0), v(L("div", {
			ref_key: "surface",
			ref: o,
			class: "resource-preview-renderer-layer"
		}, null, 512), [[k, s.value]])], 64));
	}
}, on = {
	__name: "ResourceImagePresentation",
	props: {
		imageElement: Object,
		context: Object
	},
	emits: ["providers-change"],
	setup(t, { expose: n, emit: r }) {
		let i = t, a = r, s = i.context?.overlayRegistry || window.SmartBrowserPicker, c = o(s?.extensions?.().imagePresentations || s?.imagePresentations || []), l = s?.subscribeImagePresentations?.((e) => {
			c.value = e, a("providers-change");
		}), u = A(), d = y(0), f = () => {
			d.value++;
		};
		return R(() => i.imageElement, (e, t) => {
			t?.removeEventListener("load", f), e?.addEventListener("load", f);
		}, {
			flush: "sync",
			immediate: !0
		}), n({ release: () => u.destroy() }), R(() => i.context, () => u.destroy(), {
			deep: !0,
			flush: "pre"
		}), R(() => [
			i.imageElement,
			i.context,
			c.value,
			d.value
		], () => {
			u.sync(i.imageElement, c.value, i.context);
		}, {
			deep: !0,
			flush: "post",
			immediate: !0
		}), e(() => {
			i.imageElement?.removeEventListener("load", f), l?.(), u.destroy();
		}), (e, t) => null;
	}
}, sn = { class: "resource-lightweight-area" }, cn = {
	key: 0,
	class: "resource-lightweight-actions resource-lightweight-eye-action"
}, ln = ["title", "aria-label"], un = [
	"disabled",
	"title",
	"aria-label"
], dn = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], fn = {
	key: 0,
	class: "text-danger",
	role: "alert"
}, pn = {
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
	setup(n, { expose: r, emit: i }) {
		let s = n, c = i, l = P(() => Pt(s.definitions)), u = P(() => s.editable ? l.value.filter((e) => e.presentation !== "hidden") : []), d = P(() => l.value.find((e) => s.values?.[e.key])), p = y(""), h = y(""), _ = y(!1), C = y(null), w = y(null), T = y(null), E = o(null), D = o(null), O = y(!1), A = y(null), j = y(null), V = y(0), H = null, ee = P(() => O.value ? D.value : E.value), U = (e) => {
			O.value || j.value?.refreshPresentation(), H?.onPresentationChange?.(e), C.value?.dispatchEvent(new CustomEvent("smartbrowser:image-presentation-change", {
				detail: e,
				bubbles: !0
			}));
		}, te = (e, t = {}) => {
			if (e != null && (e.tagName !== "IMG" || !C.value?.contains(e))) throw TypeError("The primary image must belong to this preview.");
			A.value?.release();
			let n = { onPresentationChange: t.onPresentationChange };
			return H = n, D.value = e, V.value++, () => {
				H === n && (A.value?.release(), H = null, D.value = null);
			};
		}, W = P(() => s.overlayContext ? {
			...s.overlayContext,
			actionsContainer: T.value,
			visualElement: C.value,
			imageElement: ee.value,
			getImageElement: () => ee.value,
			imageUrl: K.value,
			imageVersion: V.value,
			resolvedImage: w.value || s.resource,
			values: s.values || {},
			notifyPresentationChange: U
		} : null), ne = y(0), re = P(() => (ne.value, !!(d.value || s.overlayContext?.hasPreviewChanges?.())));
		async function G() {
			_.value = !0;
			try {
				if (s.overlayContext?.resetPreview) await s.overlayContext.resetPreview();
				else for (let e of u.value) c("change", e.key, null);
			} catch {
				h.value = "COM_SMARTBROWSER_USAGE_INVALID";
			} finally {
				_.value = !1;
			}
		}
		let K = P(() => s.contentOnly && s.resource?.type === "image" ? s.resource.metadata?.url || s.resource.image || Lt(s.resource) : p.value || Lt(s.resource)), q = P(() => ({
			...zt(s.resource, s.values, p.value),
			imageCrop: w.value?.imageCrop || s.resource?.imageCrop
		})), J = P(() => ({
			...s.overlayContext,
			resource: s.resource,
			visualElement: C.value,
			setImageElement: te,
			getImageElement: () => ee.value,
			imageUrl: K.value,
			resolvedImage: w.value || s.resource,
			actionsContainer: T.value,
			values: s.values || {},
			visuals: Bt(q.value, s.values, K.value),
			isReadOnly: s.overlayContext?.isReadOnly !== !1,
			purpose: "preview"
		})), ie = 0, ae = !1;
		R(() => [
			z(s.resource),
			d.value,
			d.value && s.values?.[d.value.key]
		], async () => {
			let e = ++ie;
			p.value = "", w.value = null, h.value = "";
			let t = d.value;
			if (t) try {
				let n = await Vt(t, s.values[t.key], s.resolveReference);
				if (e !== ie) return;
				w.value = n, p.value = Lt(n);
			} catch {
				e === ie && (h.value = "COM_SMARTBROWSER_USAGE_INVALID");
			}
		}, {
			immediate: !0,
			deep: !0
		});
		async function oe(e) {
			let t = z(s.resource);
			_.value = !0;
			try {
				let n = await window.SmartBrowserPicker.open({
					...e.picker,
					title: s.t("COM_SMARTBROWSER_SELECT_THUMBNAIL"),
					subtitle: s.resource.title,
					confirmLabel: s.t("COM_SMARTBROWSER_USE_THUMBNAIL"),
					multiple: !1,
					initialSelection: s.values?.[e.key] ? [s.values[e.key].id] : []
				});
				n && !ae && z(s.resource) === t && c("change", e.key, B({
					adapter: e.picker.adapter,
					id: n.id
				}));
			} catch {
				!ae && z(s.resource) === t && (h.value = "COM_SMARTBROWSER_USAGE_INVALID");
			} finally {
				_.value = !1;
			}
		}
		return r({ element: C }), e(() => {
			ae = !0, ++ie;
		}), (e, r) => (f(), g(x, null, [L("div", sn, [
			v(L("div", {
				ref_key: "surface",
				ref: C,
				class: M(["resource-lightweight-visual", {
					"has-override": !!d.value,
					"is-information-visual": !n.contentOnly,
					"is-grid-information": !n.contentOnly && n.resource?.type !== "image",
					"has-unavailable-content": n.contentOnly && n.resource?.id && !K.value
				}])
			}, [
				n.contentOnly ? n.nativePreview ? I("", !0) : (f(), S(an, {
					key: 1,
					context: J.value,
					onActiveChange: r[1] ||= (e) => O.value = e,
					onBeforeUpdate: r[2] ||= (e) => A.value?.release()
				}, {
					default: t(() => [F(N, {
						ref_key: "fallbackVisual",
						ref: j,
						resource: q.value,
						"presentation-managed": "",
						onImageChange: r[0] ||= (e) => E.value = e
					}, null, 8, ["resource"])]),
					_: 1
				}, 8, ["context"])) : (f(), S(N, {
					key: 0,
					resource: n.resource,
					"fit-content": n.resource.type === "image"
				}, null, 8, ["resource", "fit-content"])),
				W.value && !n.nativePreview ? (f(), S(nn, {
					key: 2,
					context: W.value
				}, null, 8, ["context"])) : I("", !0),
				W.value && n.contentOnly && !n.nativePreview ? (f(), S(on, {
					key: 3,
					ref_key: "presentation",
					ref: A,
					"image-element": ee.value,
					context: W.value,
					onProvidersChange: r[3] ||= (e) => ne.value++
				}, null, 8, ["image-element", "context"])) : I("", !0)
			], 2), [[k, !n.nativePreview]]),
			n.canPreview ? (f(), g("div", cn, [n.canPreview ? (f(), g("button", {
				key: 0,
				type: "button",
				class: "resource-lightweight-icon-action",
				title: n.t("COM_SMARTBROWSER_ACTION_PREVIEW"),
				"aria-label": n.t("COM_SMARTBROWSER_ACTION_PREVIEW"),
				onClick: r[4] ||= (t) => e.$emit("preview")
			}, [...r[5] ||= [L("span", {
				class: "fas fa-eye",
				"aria-hidden": "true"
			}, null, -1)]], 8, ln)) : I("", !0)])) : I("", !0),
			L("div", {
				ref_key: "previewActionsEl",
				ref: T,
				class: "resource-lightweight-actions resource-lightweight-preview-action"
			}, [
				n.editable && re.value ? (f(), g("button", {
					key: 0,
					type: "button",
					class: "resource-lightweight-icon-action",
					disabled: _.value,
					title: n.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					"aria-label": n.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					onClick: G
				}, [...r[6] ||= [L("span", {
					class: "fas fa-times",
					"aria-hidden": "true"
				}, null, -1)]], 8, un)) : I("", !0),
				(f(!0), g(x, null, m(u.value, (e) => (f(), g("button", {
					key: e.key,
					type: "button",
					class: M({ selected: !!n.values?.[e.key] }),
					disabled: _.value,
					title: n.t(n.values?.[e.key] ? "COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL" : "COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL"),
					"aria-label": n.t(n.values?.[e.key] ? "COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL" : "COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL"),
					onClick: (t) => oe(e)
				}, [...r[7] ||= [L("span", {
					class: "fas fa-image",
					"aria-hidden": "true"
				}, null, -1)]], 10, dn))), 128)),
				a(e.$slots, "actions")
			], 512)
		]), h.value || l.value.some((e) => n.errors?.[e.key]) ? (f(), g("small", fn, b(n.t(h.value || n.errors[l.value.find((e) => n.errors?.[e.key]).key])), 1)) : I("", !0)], 64));
	}
}, mn = {
	__name: "ResourceActionIcon",
	props: { icon: String },
	setup(e) {
		return (t, n) => (f(), g("span", {
			class: M(e.icon === "arrow-down-up-across-line" ? "fas fa-arrow-down-up-across-line" : e.icon),
			"aria-hidden": "true"
		}, null, 2));
	}
}, hn = { class: "resource-usage-field" }, gn = {
	key: 0,
	"aria-hidden": "true"
}, _n = [
	"value",
	"disabled",
	"required",
	"aria-invalid"
], vn = [
	"value",
	"required",
	"aria-invalid"
], yn = {
	key: 3,
	class: "resource-usage-check"
}, bn = ["checked"], xn = ["value", "aria-invalid"], Sn = {
	key: 0,
	value: ""
}, Cn = ["value"], wn = ["value", "aria-invalid"], Tn = ["value"], En = { value: "auto" }, Dn = { value: "custom" }, On = {
	key: 0,
	class: "resource-usage-reference"
}, kn = { key: 0 }, An = ["disabled"], jn = ["title", "aria-label"], Mn = {
	key: 8,
	class: "text-danger"
}, Nn = { key: 9 }, Pn = {
	key: 10,
	class: "text-danger",
	role: "alert"
}, Fn = {
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
		let i = t, a = r, o = `sb-usage-${Math.random().toString(36).slice(2)}`, s = y(i.value ? "custom" : "auto"), c = y(""), l = y(!1), d = y(""), p = y(i.value ?? ""), h = y(null), _ = P(() => i.editors?.[i.definition.editor]), v = P(() => Zt(i.definition, i.values)), S, C, w = 0, T = !1, E = (e) => {
			d.value = "", a("change", e);
		}, D = (e) => {
			i.definition.key === "visual.iconOverride" ? (p.value = e, E(Nt(e))) : E(e);
		}, k = () => {
			s.value = "auto", E(null);
		}, A = (e) => {
			s.value = e, e === "auto" && E(null);
		};
		R(() => i.value, async (e) => {
			i.definition.key === "visual.iconOverride" && Nt(p.value) !== (e ?? "") && (p.value = e ?? "");
			let t = ++w;
			if (d.value = "", c.value = "", i.definition.type === "resource" && e) {
				s.value = "custom";
				try {
					let n = await i.resolveReference(e, i.definition.picker);
					t === w && (c.value = n?.title || "", (!n || n.unavailable) && (d.value = "COM_SMARTBROWSER_USAGE_INVALID"));
				} catch {
					t === w && (d.value = "COM_SMARTBROWSER_USAGE_INVALID");
				}
			}
		}, { immediate: !0 });
		async function j() {
			l.value = !0;
			try {
				let e = await window.SmartBrowserPicker.open({
					...i.definition.picker,
					multiple: !1,
					initialSelection: i.value ? [i.value.id] : []
				});
				e && !T && E(B({
					adapter: i.definition.picker.adapter,
					id: e.id
				}));
			} catch {
				d.value = "COM_SMARTBROWSER_USAGE_INVALID";
			} finally {
				l.value = !1;
			}
		}
		return R([_, () => z(i.resource)], async () => {
			if (C?.abort(), S?.destroy?.(), S = null, await O(), !T && _.value && h.value) {
				C = new AbortController();
				try {
					S = _.value.mount(h.value, {
						definition: i.definition,
						resource: i.resource,
						id: o,
						value: i.value,
						values: i.values,
						setValue: E,
						signal: C.signal,
						translate: i.t
					}) || null;
				} catch {
					d.value = "COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE";
				}
			}
		}, { immediate: !0 }), R(() => [i.value, i.values], () => S?.update?.({
			value: i.value,
			values: i.values
		}), { deep: !0 }), e(() => {
			T = !0, ++w, C?.abort(), S?.destroy?.();
		}), (e, r) => (f(), g("div", hn, [
			t.definition.editor === "boolean" ? I("", !0) : (f(), g("label", {
				key: 0,
				for: o
			}, [
				L("span", {
					class: M(u(Mt)(t.definition)),
					"aria-hidden": "true"
				}, null, 2),
				n(b(t.t(t.definition.label)), 1),
				t.definition.required ? (f(), g("span", gn, " *")) : I("", !0)
			])),
			t.definition.editor === "text" ? (f(), g("input", {
				key: 1,
				id: o,
				class: "form-control",
				type: "text",
				value: t.definition.key === "visual.iconOverride" ? p.value : t.value ?? "",
				disabled: v.value,
				required: t.definition.required && !v.value,
				"aria-invalid": !!t.error,
				onInput: r[0] ||= (e) => D(e.target.value)
			}, null, 40, _n)) : t.definition.editor === "textarea" ? (f(), g("textarea", {
				key: 2,
				id: o,
				class: "form-control",
				rows: "3",
				value: t.value ?? "",
				required: t.definition.required,
				"aria-invalid": !!t.error,
				onInput: r[1] ||= (e) => E(e.target.value)
			}, null, 40, vn)) : t.definition.editor === "boolean" ? (f(), g("label", yn, [
				L("input", {
					id: o,
					class: "form-check-input",
					type: "checkbox",
					checked: t.value === !0,
					onChange: r[2] ||= (e) => E(e.target.checked)
				}, null, 40, bn),
				t.definition.key === "media.decorative" ? I("", !0) : (f(), g("span", {
					key: 0,
					class: M(u(Mt)(t.definition)),
					"aria-hidden": "true"
				}, null, 2)),
				n(b(t.t(t.definition.label)), 1)
			])) : t.definition.editor === "select" ? (f(), g("select", {
				key: 4,
				id: o,
				class: "form-select",
				value: t.value ?? "",
				"aria-invalid": !!t.error,
				onChange: r[3] ||= (e) => E(t.definition.options.find((t) => String(t.value) === e.target.value)?.value)
			}, [!t.definition.required && !t.definition.options?.some((e) => e.value === "") ? (f(), g("option", Sn, b(t.t(t.definition.key === "visual.presentation" ? "COM_SMARTBROWSER_USAGE_DEFAULT" : "COM_SMARTBROWSER_USAGE_CHOOSE")), 1)) : I("", !0), (f(!0), g(x, null, m(t.definition.options, (e) => (f(), g("option", {
				key: String(e.value),
				value: e.value
			}, b(t.t(e.label)), 9, Cn))), 128))], 40, xn)) : t.definition.editor === "number" ? (f(), g("input", {
				key: 5,
				id: o,
				class: "form-control",
				type: "number",
				value: t.value ?? "",
				"aria-invalid": !!t.error,
				onInput: r[4] ||= (e) => E(e.target.value === "" ? null : Number(e.target.value))
			}, null, 40, wn)) : t.definition.editor === "resource" ? (f(), g(x, { key: 6 }, [L("select", {
				id: o,
				class: "form-select",
				value: s.value,
				onChange: r[5] ||= (e) => A(e.target.value)
			}, [L("option", En, b(t.t("COM_SMARTBROWSER_USAGE_AUTO")), 1), L("option", Dn, b(t.t("COM_SMARTBROWSER_USAGE_CUSTOM")), 1)], 40, Tn), s.value === "custom" ? (f(), g("div", On, [
				t.value ? (f(), g("span", kn, b(c.value || t.value.id), 1)) : I("", !0),
				L("button", {
					type: "button",
					class: "btn btn-outline-primary",
					disabled: l.value,
					onClick: j
				}, [r[6] ||= L("span", {
					class: "fas fa-plus",
					"aria-hidden": "true"
				}, null, -1), n(" " + b(t.t(t.definition.pickerLabel || "COM_SMARTBROWSER_USAGE_PICK_RESOURCE")), 1)], 8, An),
				t.value ? (f(), g("button", {
					key: 1,
					type: "button",
					class: "btn btn-outline-secondary",
					title: t.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					"aria-label": t.t("COM_SMARTBROWSER_USAGE_CLEAR"),
					onClick: k
				}, [...r[7] ||= [L("span", {
					class: "fas fa-times",
					"aria-hidden": "true"
				}, null, -1)]], 8, jn)) : I("", !0)
			])) : I("", !0)], 64)) : _.value ? (f(), g("div", {
				key: 7,
				ref_key: "customContainer",
				ref: h
			}, null, 512)) : (f(), g("small", Mn, b(t.t("COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE")), 1)),
			t.definition.description ? (f(), g("small", Nn, b(t.t(t.definition.description)), 1)) : I("", !0),
			t.error || d.value ? (f(), g("small", Pn, b(t.t(t.error || d.value)), 1)) : I("", !0)
		]));
	}
}, In = { class: "resource-usage-editor" }, Ln = ["open"], Rn = {
	__name: "SelectionUsageEditor",
	props: /*@__PURE__*/ r({
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
	emits: /*@__PURE__*/ r(["change"], ["update:secondaryOpen"]),
	setup(e) {
		let t = e, r = h(e, "secondaryOpen"), i = P(() => t.definitions.filter((e) => e.presentation === "primary")), a = P(() => t.definitions.filter((e) => e.presentation === "secondary")), o = (e) => ({
			definition: e,
			value: t.values[e.key],
			values: t.values,
			error: t.errors?.[e.key],
			resource: t.resource,
			t: t.t,
			editors: t.editors,
			resolveReference: t.resolveReference
		});
		return (t, s) => (f(), g("div", In, [(f(!0), g(x, null, m(i.value, (e) => (f(), S(Fn, p({ key: e.key }, { ref_for: !0 }, o(e), { onChange: (n) => t.$emit("change", e.key, n) }), null, 16, ["onChange"]))), 128)), a.value.length ? (f(), g("details", {
			key: 0,
			class: "resource-usage-secondary",
			open: r.value || a.value.some((t) => e.errors?.[t.key]),
			onToggle: s[0] ||= (e) => r.value = e.target.open
		}, [L("summary", null, [s[1] ||= L("span", {
			class: "fas fa-chevron-right resource-usage-secondary-chevron",
			"aria-hidden": "true"
		}, null, -1), n(b(e.t("COM_SMARTBROWSER_USAGE_MORE")), 1)]), (f(!0), g(x, null, m(a.value, (e) => (f(), S(Fn, p({ key: e.key }, { ref_for: !0 }, o(e), { onChange: (n) => t.$emit("change", e.key, n) }), null, 16, ["onChange"]))), 128))], 40, Ln)) : I("", !0)]));
	}
}, zn = [
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
})), Bn = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e);
function Vn(e, t = {}) {
	return {
		...e,
		image: e?.effectiveThumbnail || Lt(e),
		selectionType: e?.metadata?.typeLabel || e?.type || "",
		selectionPath: Hn(e)
	};
}
function Hn(e) {
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
var Un = [
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
Un.slice(1, 3);
var Wn = [
	...Un.map((e) => ({
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
], Gn = Wn.filter((e) => e.id !== "status").map((e) => ({
	id: e.id,
	label: e.label
}));
function Kn(e, t, n = "asc") {
	let r = Wn.find((e) => e.id === t);
	if (!r) return [...e];
	let i = (e) => Bn(e, r.source || r.id);
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
function qn(e, t) {
	let n = {
		image: "COM_SMARTBROWSER_MEDIA_IMAGE",
		document: "COM_SMARTBROWSER_MEDIA_DOCUMENT",
		video: "COM_SMARTBROWSER_MEDIA_VIDEO",
		audio: "COM_SMARTBROWSER_MEDIA_AUDIO",
		folder: "COM_SMARTBROWSER_FOLDER"
	}[e?.type], r = e?.metadata?.typeLabel || e?.type || "";
	return n ? t(n) : r ? r.charAt(0).toUpperCase() + r.slice(1) : t("COM_SMARTBROWSER_RESOURCE");
}
function Jn(e, t) {
	return !e.readOnly && typeof e.onAdd == "function" && t < (e.multiple === !1 ? 1 : e.maxSelections || 500);
}
function Yn(e = "auto", t = 0) {
	return e === "auto" ? t >= 800 ? "right" : "bottom" : ["left", "right"].includes(e) && t < 640 ? "bottom" : e;
}
//#endregion
//#region resources/js/components/ResourceInfoPanel.vue
var Xn = {
	key: 0,
	class: "sb-preview-selection-actions"
}, Zn = [
	"disabled",
	"title",
	"aria-label"
], Qn = {
	key: 0,
	class: "resource-info-tabs",
	role: "tablist"
}, $n = ["aria-selected"], er = ["aria-selected"], tr = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], nr = { key: 1 }, rr = { key: 2 }, ir = {
	key: 3,
	class: "sb-preview-selection-actions"
}, ar = [
	"disabled",
	"title",
	"aria-label",
	"onClick"
], or = { class: "sb-info-details" }, sr = {
	key: 0,
	class: "resource-selection-information"
}, cr = { class: "resource-selection-path" }, lr = [
	"value",
	"title",
	"aria-label"
], ur = ["title", "aria-label"], dr = {
	key: 1,
	class: "resource-selection-usage"
}, fr = { key: 0 }, pr = {
	key: 0,
	class: "resource-language"
}, mr = ["src"], hr = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, gr = {
	key: 2,
	class: "resource-info-timezone"
}, _r = { key: 1 }, vr = { key: 0 }, yr = { key: 1 }, br = {
	key: 0,
	class: "resource-info-timezone"
}, xr = { key: 2 }, Sr = {
	key: 0,
	class: "resource-info-timezone"
}, Cr = { key: 3 }, wr = { key: 4 }, Tr = { key: 5 }, Er = { key: 6 }, Dr = {
	key: 4,
	class: "resource-info-empty",
	role: "status"
}, Or = ["disabled"], kr = {
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
	setup(r) {
		let i = r, a = P(() => i.address ?? Hn(i.resource)), s = y(!1), c = P(() => !!(i.usageDefinitions?.length || i.previewContext && (i.previewContext.isReadOnly === !1 || Object.values(i.usageValues || {}).some((e) => e != null && e !== "")))), l = P(() => i.selectionOnly || c.value && w.value === "usage"), d = P(() => l.value ? Ft(i.resource, i.usageValues).title : i.resource?.title), p = Mt;
		async function h(e) {
			try {
				await navigator.clipboard.writeText(Array.isArray(e) ? e.join("\n") : String(e));
			} catch {
				window.Joomla?.renderMessages?.({ error: [i.t("COM_SMARTBROWSER_COPY_FAILED")] });
			}
		}
		let _ = (e) => {
			let t = i.usageValues?.[e.key];
			if (t == null || t === "") return "—";
			if (typeof t == "boolean") return i.t(t ? "JYES" : "JNO");
			let n = e.options?.find((e) => e.value === t);
			return n ? i.t(n.label) : e.type === "resource" ? t.id : typeof t == "object" ? JSON.stringify(t) : String(t);
		}, C = P(() => (i.usageDefinitions || []).filter((e) => !Pt([e]).length)), w = y("info"), T = y("usage"), E = (e) => {
			T.value = e, w.value = e;
		}, D = y(!1), O = y(null), A = y(null), j = o(null), N = y(""), B;
		R(() => [A.value, i.nativePreview], () => {
			B?.disconnect();
			let e = A.value;
			if (!e || !i.nativePreview) {
				j.value = null, N.value = "";
				return;
			}
			let t = () => {
				j.value = [...e.querySelectorAll("img")].find((e) => !e.closest(".resource-visual-overlay-layer")) || null, N.value = j.value?.getAttribute("src") || "";
			};
			B = new MutationObserver(t), B.observe(e, {
				subtree: !0,
				childList: !0,
				attributes: !0,
				attributeFilter: ["src"]
			}), t();
		}, {
			flush: "post",
			immediate: !0
		}), e(() => B?.disconnect());
		let V = P(() => ({
			...i.previewContext,
			visualElement: A.value,
			imageElement: j.value,
			getImageElement: () => j.value,
			imageUrl: N.value,
			resolvedImage: i.resource,
			values: i.usageValues || {},
			notifyPresentationChange: (e) => A.value?.dispatchEvent(new CustomEvent("smartbrowser:image-presentation-change", {
				detail: e,
				bubbles: !0
			}))
		})), H;
		R(() => z(i.resource), () => H?.abort()), e(() => H?.abort()), R(c, (e) => {
			w.value = e ? T.value : "info";
		}, { immediate: !0 }), R(() => i.usageRevision, () => {
			c.value && (w.value = "usage");
		});
		async function ee(e) {
			D.value = !0, H = new AbortController();
			let t = H.signal;
			try {
				await e.run({
					...i.previewContext,
					previewElement: i.nativePreview ? A.value : O.value?.element,
					signal: t
				});
			} catch (e) {
				t.aborted || Joomla.renderMessages({ error: [e.message || i.t("COM_SMARTBROWSER_USAGE_INVALID")] });
			} finally {
				D.value = !1;
			}
		}
		let U = P(() => {
			let e = (i.resource?.infoFields?.length ? i.resource.infoFields : i.fields || []).filter((e) => (!e.kinds || e.kinds.includes(i.resource?.kind)) && ![
				"metadata.locationPath",
				"metadata.category",
				"metadata.tags"
			].includes(e.source)), t = new Set(e.map((e) => e.source));
			return [...e, ...zn.filter((e) => {
				let n = i.resource?.metadata?.[e.source.split(".")[1]];
				return !t.has(e.source) && n != null && n !== "";
			})];
		}), te = $, W = P(() => i.selectionOnly ? qn(i.resource, i.t) : i.resource?.kind === "node" ? i.t("COM_SMARTBROWSER_FOLDER") : i.resource?.type ? i.resource.type.charAt(0).toUpperCase() + i.resource.type.slice(1) : i.t("COM_SMARTBROWSER_RESOURCE")), ne = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, re = (e) => `${(e / 1024).toFixed(2)} KB`, G = (e) => String(e.source || "").split(".").reduce((e, t) => e?.[t], i.resource), K = (e) => (e.format === "language" || e.source === "metadata.language") && G(e) === "*" ? i.t("COM_SMARTBROWSER_ALL_LANGUAGES") : e.format === "date" ? ne(G(e)) : e.format === "size" ? G(e) !== null && G(e) !== void 0 ? re(G(e)) : "" : e.format === "dimensions" ? i.resource?.metadata.width && i.resource?.metadata.height ? `${i.resource.metadata.width}px \u00d7 ${i.resource.metadata.height}px` : "" : G(e), q = (e) => {
			let t = String(e || "").trim().match(/(Z|[+-]\d{2}:?\d{2})$/i);
			if (!t) return "";
			let n = t[1].toUpperCase() === "Z" ? 0 : (t[1].startsWith("-") ? -1 : 1) * (Number(t[1].slice(1, 3)) * 60 + Number(t[1].slice(-2)));
			if (n === -new Date(e).getTimezoneOffset()) return "";
			let r = n >= 0 ? "+" : "-", a = Math.abs(n), o = n === 0 ? "UTC" : `UTC${r}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
			return `${i.t("COM_SMARTBROWSER_SOURCE_TIMEZONE")}: ${o}`;
		};
		return (e, i) => (f(), g("aside", { class: M(["resource-info-panel", {
			"has-usage": c.value,
			"showing-usage": c.value && w.value === "usage",
			"is-empty-selection": r.selectionOnly && !r.resource
		}]) }, [
			r.selectionOnly ? v((f(), g("div", {
				key: 0,
				ref_key: "nativePreviewElement",
				ref: A,
				class: "sb-native-preview-host"
			}, [r.nativePreview && r.resource ? (f(), S(nn, {
				key: 0,
				context: V.value
			}, null, 8, ["context"])) : I("", !0), r.nativePreview && r.resource ? (f(), S(on, {
				key: 1,
				"image-element": j.value,
				context: V.value
			}, null, 8, ["image-element", "context"])) : I("", !0)], 512)), [[k, r.nativePreview]]) : I("", !0),
			r.selectionOnly && !r.resource && !r.nativePreview ? (f(), S(pn, {
				key: 1,
				resource: {
					id: "",
					metadata: {}
				},
				definitions: [],
				values: {},
				"content-only": "",
				t: r.t
			}, null, 8, ["t"])) : I("", !0),
			r.selectionOnly && !r.resource ? (f(), g(x, { key: 2 }, [L("h3", null, b(r.t(r.nativePreview ? "COM_SMARTBROWSER_NO_IMAGE_SELECTED" : "COM_SMARTBROWSER_COLLECTION_EMPTY")), 1), r.allowQuickAdd ? (f(), g("div", Xn, [L("button", {
				type: "button",
				class: "resource-preview-add",
				disabled: r.addDisabled,
				title: r.t("COM_SMARTBROWSER_COLLECTION_ADD"),
				"aria-label": r.t("COM_SMARTBROWSER_COLLECTION_ADD"),
				onClick: i[0] ||= (t) => e.$emit("selection-add")
			}, [...i[9] ||= [L("span", { class: "fas fa-plus" }, null, -1)]], 8, Zn)])) : I("", !0)], 64)) : I("", !0),
			r.resource ? (f(), g(x, { key: 3 }, [
				!r.selectionOnly && c.value ? (f(), g("div", Qn, [L("button", {
					type: "button",
					role: "tab",
					"aria-selected": w.value === "usage",
					onClick: i[1] ||= (e) => E("usage")
				}, b(r.t("COM_SMARTBROWSER_USAGE_OPTIONS")), 9, $n), L("button", {
					type: "button",
					role: "tab",
					"aria-selected": w.value === "info",
					onClick: i[2] ||= (e) => E("info")
				}, b(r.t("COM_SMARTBROWSER_USAGE_INFO")), 9, er)])) : I("", !0),
				F(pn, {
					ref_key: "previewElement",
					ref: O,
					"overlay-context": l.value ? r.previewContext : null,
					resource: r.resource,
					definitions: l.value ? r.usageDefinitions : [],
					values: l.value ? r.usageValues : {},
					errors: l.value ? r.usageErrors : {},
					"resolve-reference": r.resolveReference,
					"can-preview": r.canPreview,
					"native-preview": r.nativePreview,
					"content-only": l.value,
					editable: r.selectionOnly ? r.usageMode === "editable" : l.value && r.previewContext?.isReadOnly === !1,
					t: r.t,
					onPreview: i[3] ||= (t) => e.$emit("preview"),
					onChange: i[4] ||= (t, n) => e.$emit("usage-change", t, n)
				}, {
					actions: t(() => [(f(!0), g(x, null, m(l.value ? r.previewActions : [], (e) => (f(), g("button", {
						key: e.id,
						type: "button",
						disabled: D.value,
						title: r.t(e.label),
						"aria-label": r.t(e.label),
						onClick: (t) => ee(e)
					}, [L("span", {
						class: M(e.icon || "fas fa-bolt"),
						"aria-hidden": "true"
					}, null, 2)], 8, tr))), 128))]),
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
				]),
				r.selectionOnly ? (f(), g("h3", nr, b(d.value), 1)) : (f(), g("h3", rr, b(d.value), 1)),
				r.selectionActions?.length ? (f(), g("div", ir, [(f(!0), g(x, null, m(r.selectionActions, (t) => (f(), g("button", {
					key: t.id,
					type: "button",
					disabled: t.disabled,
					title: r.t(t.label),
					"aria-label": r.t(t.label),
					class: M({
						"resource-preview-remove": t.id === "collectionRemove",
						"resource-preview-add": t.id === "collectionAdd"
					}),
					onClick: (n) => e.$emit("selection-action", t)
				}, [F(mn, { icon: t.icon }, null, 8, ["icon"])], 10, ar))), 128))])) : I("", !0),
				L("div", or, [
					r.selectionOnly ? (f(), g("dl", sr, [L("div", null, [L("dt", null, [i[10] ||= L("span", {
						class: "fas fa-link",
						"aria-hidden": "true"
					}, null, -1), n(b(r.t("COM_SMARTBROWSER_URI")), 1)]), L("dd", cr, [L("input", {
						type: "text",
						value: a.value,
						title: a.value,
						"aria-label": r.t("COM_SMARTBROWSER_URI"),
						class: "sb-reference-readonly",
						readonly: "",
						"aria-readonly": "true"
					}, null, 8, lr), L("button", {
						type: "button",
						title: r.t("COM_SMARTBROWSER_COPY_PATH"),
						"aria-label": r.t("COM_SMARTBROWSER_COPY_PATH"),
						onClick: i[5] ||= (e) => h(a.value)
					}, [...i[11] ||= [L("span", {
						class: "fas fa-copy",
						"aria-hidden": "true"
					}, null, -1)]], 8, ur)])])])) : I("", !0),
					r.selectionOnly && r.usageMode === "readonly" && r.usageDefinitions?.length ? (f(), g("dl", dr, [(f(!0), g(x, null, m(r.usageDefinitions, (e) => (f(), g("div", { key: e.key }, [L("dt", null, [e.key === "media.decorative" ? I("", !0) : (f(), g("span", {
						key: 0,
						class: M(u(p)(e)),
						"aria-hidden": "true"
					}, null, 2)), n(b(r.t(e.label)), 1)]), L("dd", null, b(_(e)), 1)]))), 128))])) : I("", !0),
					r.usageDefinitions?.length && (r.selectionOnly ? r.usageMode === "editable" : w.value === "usage") ? (f(), S(Rn, {
						key: u(z)(r.resource),
						"secondary-open": s.value,
						"onUpdate:secondaryOpen": i[6] ||= (e) => s.value = e,
						definitions: C.value,
						values: r.usageValues,
						errors: r.usageErrors,
						resource: r.resource,
						t: r.t,
						editors: r.usageEditors,
						"resolve-reference": r.resolveReference,
						onChange: i[7] ||= (t, n) => e.$emit("usage-change", t, n)
					}, null, 8, [
						"secondary-open",
						"definitions",
						"values",
						"errors",
						"resource",
						"t",
						"editors",
						"resolve-reference"
					])) : I("", !0)
				]),
				!r.selectionOnly && !l.value ? (f(), g(x, { key: 4 }, [r.fields?.length ? (f(), g("dl", fr, [(f(!0), g(x, null, m(U.value, (e) => v((f(), g("div", { key: `${e.source}-${e.label}` }, [
					L("dt", null, [L("span", {
						class: M(u(te)(e)),
						"aria-hidden": "true"
					}, null, 2), n(b(r.t(e.label)), 1)]),
					e.format === "language" ? (f(), g("dd", pr, [r.resource.metadata?.languageImage ? (f(), g("img", {
						key: 0,
						src: r.resource.metadata.languageImage,
						alt: "",
						"aria-hidden": "true"
					}, null, 8, mr)) : G(e) === "*" ? (f(), g("span", hr)) : I("", !0), L("span", null, b(K(e)), 1)])) : (f(), g("dd", {
						key: 1,
						class: M({
							"resource-info-identifier": e.source === "metadata.alias" || e.source === "metadata.username",
							"resource-info-lines": e.source === "metadata.tagPaths"
						})
					}, b(K(e)), 3)),
					e.format === "date" && q(G(e)) ? (f(), g("small", gr, b(q(G(e))), 1)) : I("", !0)
				])), [[k, K(e) !== "" && K(e) !== null && K(e) !== void 0]])), 128))])) : (f(), g("dl", _r, [
					r.resource.parentId ? (f(), g("div", vr, [L("dt", null, [i[12] ||= L("span", {
						class: "fas fa-folder",
						"aria-hidden": "true"
					}, null, -1), n(b(r.t("COM_SMARTBROWSER_FOLDER")), 1)]), L("dd", null, b(r.resource.parentId), 1)])) : I("", !0),
					L("div", null, [L("dt", null, [i[13] ||= L("span", {
						class: "fas fa-file-alt",
						"aria-hidden": "true"
					}, null, -1), n(b(r.t("COM_SMARTBROWSER_TYPE")), 1)]), L("dd", null, b(W.value), 1)]),
					r.resource.metadata.created ? (f(), g("div", yr, [
						L("dt", null, [i[14] ||= L("span", {
							class: "fas fa-calendar",
							"aria-hidden": "true"
						}, null, -1), n(b(r.t("COM_SMARTBROWSER_DATE_CREATED")), 1)]),
						L("dd", null, b(ne(r.resource.metadata.created)), 1),
						q(r.resource.metadata.created) ? (f(), g("small", br, b(q(r.resource.metadata.created)), 1)) : I("", !0)
					])) : I("", !0),
					r.resource.metadata.modified ? (f(), g("div", xr, [
						L("dt", null, [i[15] ||= L("span", {
							class: "fas fa-calendar",
							"aria-hidden": "true"
						}, null, -1), n(b(r.t("COM_SMARTBROWSER_DATE_MODIFIED")), 1)]),
						L("dd", null, b(ne(r.resource.metadata.modified)), 1),
						q(r.resource.metadata.modified) ? (f(), g("small", Sr, b(q(r.resource.metadata.modified)), 1)) : I("", !0)
					])) : I("", !0),
					r.resource.metadata.width && r.resource.metadata.height ? (f(), g("div", Cr, [L("dt", null, [i[16] ||= L("span", {
						class: "fas fa-expand",
						"aria-hidden": "true"
					}, null, -1), n(b(r.t("COM_SMARTBROWSER_DIMENSIONS")), 1)]), L("dd", null, b(r.resource.metadata.width) + "px × " + b(r.resource.metadata.height) + "px", 1)])) : I("", !0),
					r.resource.metadata.size ? (f(), g("div", wr, [L("dt", null, [i[17] ||= L("span", {
						class: "fas fa-database",
						"aria-hidden": "true"
					}, null, -1), n(b(r.t("COM_SMARTBROWSER_SIZE")), 1)]), L("dd", null, b(re(r.resource.metadata.size)), 1)])) : I("", !0),
					r.resource.metadata.mimeType ? (f(), g("div", Tr, [L("dt", null, [i[18] ||= L("span", {
						class: "fas fa-file-alt",
						"aria-hidden": "true"
					}, null, -1), n(b(r.t("COM_SMARTBROWSER_MIME_TYPE")), 1)]), L("dd", null, b(r.resource.metadata.mimeType), 1)])) : I("", !0),
					r.resource.metadata.extension ? (f(), g("div", Er, [L("dt", null, [i[19] ||= L("span", {
						class: "fas fa-file-alt",
						"aria-hidden": "true"
					}, null, -1), n(b(r.t("COM_SMARTBROWSER_EXTENSION")), 1)]), L("dd", null, b(r.resource.metadata.extension), 1)])) : I("", !0),
					L("div", null, [L("dt", null, [i[20] ||= L("span", {
						class: "fas fa-key",
						"aria-hidden": "true"
					}, null, -1), n(b(r.t("JGLOBAL_FIELD_ID_LABEL")), 1)]), L("dd", null, b(r.resource.metadata.id ?? r.resource.id), 1)])
				]))], 64)) : I("", !0)
			], 64)) : (f(), g("div", Dr, [r.allowAdd ? (f(), g("button", {
				key: 0,
				type: "button",
				class: "btn btn-outline-secondary",
				disabled: r.addDisabled,
				onClick: i[8] ||= (t) => e.$emit("selection-add")
			}, [i[21] ||= L("span", { class: "fas fa-plus" }, null, -1), n(" " + b(r.t("COM_SMARTBROWSER_SELECT_RESOURCE")), 1)], 8, Or)) : I("", !0), L("p", null, b(r.t("COM_SMARTBROWSER_SELECTION_INFO_EMPTY")), 1)]))
		], 2));
	}
}, Ar = { class: "resource-ordering-moves" }, jr = [
	"disabled",
	"title",
	"aria-label"
], Mr = [
	"disabled",
	"title",
	"aria-label"
], Nr = {
	__name: "ResourceOrderingControls",
	props: {
		enabled: Boolean,
		t: Function
	},
	emits: ["reorder"],
	setup(e) {
		return (t, n) => (f(), g("span", Ar, [L("button", {
			type: "button",
			disabled: !e.enabled,
			title: e.t("COM_SMARTBROWSER_MOVE_UP"),
			"aria-label": e.t("COM_SMARTBROWSER_MOVE_UP"),
			onClick: n[0] ||= (e) => t.$emit("reorder", "up")
		}, [...n[2] ||= [L("span", {
			class: "fas fa-arrow-up",
			"aria-hidden": "true"
		}, null, -1)]], 8, jr), L("button", {
			type: "button",
			disabled: !e.enabled,
			title: e.t("COM_SMARTBROWSER_MOVE_DOWN"),
			"aria-label": e.t("COM_SMARTBROWSER_MOVE_DOWN"),
			onClick: n[1] ||= (e) => t.$emit("reorder", "down")
		}, [...n[3] ||= [L("span", {
			class: "fas fa-arrow-down",
			"aria-hidden": "true"
		}, null, -1)]], 8, Mr)]));
	}
}, Pr = ["popover"], Fr = [
	"title",
	"aria-label",
	"aria-expanded",
	"popovertarget"
], Ir = 0, Lr = {
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
		let n = t, r = `sb-toolbar-popup-${++Ir}`, i = y(null), o = y(null), s = y(null), c = y(!1), u = y(!1), d, p, m = () => _();
		function h() {
			if (!c.value || u.value) return;
			let e = s.value.getBoundingClientRect();
			if (!e.width || e.bottom < 0 || e.top > window.innerHeight) {
				_();
				return;
			}
			let t = o.value.getBoundingClientRect(), r = window.innerHeight - e.bottom - 8, a = n.alignment === "start" != (getComputedStyle(i.value).direction === "rtl");
			o.value.style.left = `${Math.max(8, Math.min(a ? e.left : e.right - t.width, window.innerWidth - t.width - 8))}px`, o.value.style.top = `${Math.max(8, r < t.height && e.top > r ? e.top - t.height : e.bottom)}px`, o.value.style.maxHeight = `${Math.max(80, Math.max(r, e.top - 8))}px`;
		}
		function _(e = !1) {
			o.value?.matches(":popover-open") && o.value.hidePopover(), c.value = !1, e && s.value?.focus();
		}
		async function b() {
			if (c.value) {
				_();
				return;
			}
			c.value = !0, await O(), o.value.querySelector("input:not(:disabled), select:not(:disabled), button:not(:disabled)")?.focus({ preventScroll: !0 });
		}
		async function x(e) {
			u.value || (c.value = e.newState === "open", c.value && (await O(), h(), o.value.querySelector("input:not(:disabled), select:not(:disabled), button:not(:disabled)")?.focus({ preventScroll: !0 })));
		}
		function S(e) {
			e.key === "Escape" && c.value && (e.stopPropagation(), e.preventDefault(), _(!0));
		}
		function C(e) {
			u.value && !i.value?.contains(e.target) && _();
		}
		return D(() => {
			p = i.value.closest("dialog"), p?.addEventListener("close", m), document.addEventListener("pointerdown", C), window.addEventListener("scroll", h, !0), window.addEventListener("resize", h), d = new ResizeObserver(([e]) => {
				e.contentRect.width || _();
				let t = n.inline && e.contentRect.width >= 800;
				t !== u.value && (_(), u.value = t);
			}), d.observe(i.value.closest(".resource-toolbar"));
		}), e(() => {
			_(), d?.disconnect(), p?.removeEventListener("close", m), document.removeEventListener("pointerdown", C), window.removeEventListener("scroll", h, !0), window.removeEventListener("resize", h);
		}), (e, n) => (f(), g("div", {
			ref_key: "host",
			ref: i,
			class: M(["resource-toolbar-popup", {
				"is-inline": u.value,
				"is-aligned-start": t.alignment === "start"
			}]),
			onKeydown: S
		}, [v(L("div", {
			id: r,
			ref_key: "panel",
			ref: o,
			popover: u.value ? void 0 : "auto",
			class: M(["resource-toolbar-popup-panel", t.panelClass]),
			style: l({ "--sb-toolbar-popup-width": `${t.width}px` }),
			onToggle: x
		}, [a(e.$slots, "default")], 46, Pr), [[k, c.value || !u.value]]), L("button", {
			ref_key: "button",
			ref: s,
			type: "button",
			class: M(["resource-icon-button", { active: c.value }]),
			title: t.label,
			"aria-label": t.label,
			"aria-expanded": c.value,
			"aria-controls": r,
			popovertarget: u.value ? void 0 : r,
			onClick: n[0] ||= (e) => u.value && b()
		}, [L("span", {
			class: M(t.icon),
			"aria-hidden": "true"
		}, null, 2)], 10, Fr)], 34));
	}
}, Rr = { class: "resource-column-menu-title" }, zr = [
	"checked",
	"disabled",
	"onChange"
], Br = {
	__name: "ResourceColumnPicker",
	props: {
		columns: Array,
		hiddenColumns: Array,
		shownColumns: Array,
		t: Function
	},
	emits: ["toggle-column"],
	setup(e) {
		return (n, r) => (f(), S(Lr, {
			class: "resource-column-picker",
			label: e.t("COM_SMARTBROWSER_COLUMNS"),
			icon: "fas fa-columns",
			"panel-class": "resource-column-menu",
			width: 220
		}, {
			default: t(() => [L("div", Rr, b(e.t("COM_SMARTBROWSER_COLUMNS")), 1), (f(!0), g(x, null, m(e.columns, (t) => (f(), g("label", {
				key: t.id,
				class: "resource-column-choice"
			}, [L("input", {
				type: "checkbox",
				checked: t.defaultVisible === !1 ? e.shownColumns?.includes(t.id) : !e.hiddenColumns?.includes(t.id),
				disabled: t.id === "title" || t.id === "name",
				onChange: (e) => n.$emit("toggle-column", t.id)
			}, null, 40, zr), L("span", null, b(e.t(t.label || (t.dateGroup ? "COM_SMARTBROWSER_DATE" : t.fields?.[0]?.label))), 1)]))), 128))]),
			_: 1
		}, 8, ["label"]));
	}
}, Vr = { class: "resource-sort-controls" }, Hr = ["value", "aria-label"], Ur = ["value"], Wr = ["value"], Gr = [
	"disabled",
	"title",
	"aria-label"
], Kr = {
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
		return (n, r) => (f(), S(Lr, {
			inline: "",
			alignment: e.alignment,
			label: e.t("COM_SMARTBROWSER_SORT_BY"),
			icon: "fas fa-signal",
			"panel-class": "resource-sort-menu",
			width: 260
		}, {
			default: t(() => [L("div", Vr, [L("select", {
				value: e.sortBy,
				class: "form-select",
				"aria-label": e.t("COM_SMARTBROWSER_SORT_BY"),
				onChange: r[0] ||= (e) => n.$emit("sort-by", e.target.value)
			}, [e.defaultValue === null ? I("", !0) : (f(), g("option", {
				key: 0,
				value: e.defaultValue
			}, b(e.t(e.defaultLabel)), 9, Ur)), (f(!0), g(x, null, m(e.fields, (t) => (f(), g("option", {
				key: t.id,
				value: t.id
			}, b(e.t(t.label)), 9, Wr))), 128))], 40, Hr), L("button", {
				type: "button",
				class: "resource-icon-button",
				disabled: !e.sortBy,
				title: e.t("COM_SMARTBROWSER_SORT_DIRECTION"),
				"aria-label": e.t("COM_SMARTBROWSER_SORT_DIRECTION"),
				onClick: r[1] ||= (t) => n.$emit("sort-direction-value", e.sortDirection === "desc" ? "asc" : "desc")
			}, [L("span", {
				class: M(e.sortDirection === "desc" ? "fas fa-sort-amount-down-alt" : "fas fa-sort-amount-up"),
				"aria-hidden": "true"
			}, null, 2)], 8, Gr)])]),
			_: 1
		}, 8, ["alignment", "label"]));
	}
}, qr = "contextual", Jr = (e, t) => ({
	...e,
	focusable: e.focusable ?? t.focusable,
	selectable: e.selectable ?? t.selectable,
	bulkSelectable: e.bulkSelectable ?? e.selectable ?? t.bulkSelectable,
	actionable: e.actionable ?? t.actionable,
	navigable: e.navigable ?? t.navigable,
	activatable: e.activatable ?? t.activatable
}), Yr = (e) => Jr({
	...e,
	role: e.role || "primary"
}, {
	focusable: !0,
	selectable: !1,
	bulkSelectable: !1,
	actionable: !0,
	navigable: !1,
	activatable: !0
}), Xr = (e) => ({
	...e,
	role: qr,
	focusable: e.focusable ?? !0,
	selectable: !1,
	bulkSelectable: !1,
	actionable: !1,
	navigable: !1,
	activatable: !1,
	interactiveOverlays: !1,
	capabilities: {}
}), Zr = (e) => e?.role === qr, Qr = (e) => e?.focusable === !0, $r = (e, t = "both") => e?.selectable === !0 && (t === "both" || e.kind === t), ei = (e, t = "both") => $r(e, t) && e?.bulkSelectable === !0, ti = (e) => e?.actionable === !0, ni = (e, t, n, r) => ["manage", "select"].includes(t) && ti(e) && n.find((t) => t.id === "preview" && r(t, [e])) || null;
function ri(e, t, n, r, i = "both") {
	return e?.kind === "node" ? t === "select" ? $r(e, i) ? {
		id: "pickerSelect",
		label: "COM_SMARTBROWSER_SELECT",
		icon: "fas fa-check",
		local: !0
	} : null : t === "manage" && ti(e) && n.find((t) => t.id === "edit" && r(t, [e])) || null : (["manage", "select"].includes(t) && ti(e) ? n.find((t) => t.modifiedDefault === !0 && r(t, [e])) : null) || ni(e, t, n, r);
}
function ii(e, t, n, r, i = "both") {
	return e?.navigable ? {
		id: "browseOpen",
		label: "COM_SMARTBROWSER_OPEN",
		icon: "fas fa-folder-open",
		local: !0
	} : e?.activatable ? t === "select" ? $r(e, i) ? {
		id: "pickerSelect",
		label: "COM_SMARTBROWSER_SELECT",
		icon: "fas fa-check",
		local: !0
	} : null : ti(e) && n.find((n) => n.id === (t === "manage" ? "edit" : "preview") && r(n, [e])) || null : null;
}
//#endregion
//#region resources/js/core/previewExtensionContext.js
function ai(e) {
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
			return t == null ? Object.fromEntries(Object.entries(Ut(n)).map(([e, t]) => [e.slice(4), Gt(t)])) : n[Wt(t)] === void 0 ? void 0 : Gt(n[Wt(t)]);
		},
		setMetadata(n, r) {
			t();
			let i = Wt(n), a = Gt(r), o = {
				...e.getValues?.(),
				[i]: a
			};
			if (Object.keys(o).length > 100) throw TypeError("Too many selection properties.");
			return Gt(o), e.setValue(i, a);
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
var oi = (e, t, n, r = null, i = null) => {
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
function si() {
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
var ci = { class: "resource-grid-select-all" }, li = ["checked", "aria-label"], ui = [
	"role",
	"tabindex",
	"aria-pressed",
	"onClick",
	"onDblclick",
	"onKeydown"
], di = [
	"checked",
	"aria-label",
	"onChange"
], fi = [
	"aria-expanded",
	"title",
	"onClick"
], pi = [
	"title",
	"disabled",
	"onClick"
], mi = { class: "resource-item-visual" }, hi = {
	key: 0,
	class: "resource-item-overlays"
}, gi = ["title", "onClick"], _i = ["src"], vi = ["title"], yi = ["src"], bi = ["title"], xi = ["title"], Si = { class: "resource-item-metadata-text" }, Ci = {
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
		let i = t, a = si(), o = r, s = (e, t) => {
			if (a.accepts(z(e), t)) {
				if ((t?.ctrlKey || t?.metaKey) && (i.modifiedAction || i.previewAction)) {
					let t = i.modifiedAction ? i.modifiedAction(e) : i.previewAction(e);
					if (t && i.actionAvailable(t, [e])) {
						o("action", t, e);
						return;
					}
				}
				if (i.defaultAction) {
					let t = i.defaultAction(e);
					t && i.actionAvailable(t, [e]) && o("action", t, e);
				} else e.navigable ? o("open", e.id) : e.activatable ? o("activate", e) : o("focus", e);
			}
		}, c = y(null), d = y(!1), p = y(0), h = async (e, t) => {
			if (c.value === e) {
				c.value = null;
				return;
			}
			let n = t.currentTarget.closest(".resource-browser-item"), r = n?.closest(".resource-browser");
			if (d.value = !1, p.value = r ? Math.max(0, Math.min(360, r.clientWidth - 8, window.innerWidth - 20)) : 0, c.value = e, await O(), c.value !== e || !r) return;
			let i = n.querySelector(".resource-item-menu");
			d.value = i?.getBoundingClientRect().left < r.getBoundingClientRect().left + 4;
		}, _ = (e) => oi(i.actions, e, i.actionAvailable, i.defaultAction?.(e), (i.modifiedAction || i.previewAction)?.(e)), v = (e, t) => ti(t) && t.interactiveOverlays !== !1 ? i.actions.find((n) => n.id === e.action && i.actionAvailable(n, [t])) : void 0, S = () => {
			c.value = null;
		}, C = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e), w = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, k = (e) => {
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
				e.type === "article" && i.gridFields?.some((e) => e.source === "metadata.cardSummaryWithCategory") ? n("JCATEGORY", t.category, "fas fa-folder") : null
			].filter(Boolean) : e.kind === "item" && t.mimeType ? [n("COM_SMARTBROWSER_MIME_TYPE", t.mimeType, "fas fa-file-alt"), e.type === "image" && t.width > 0 && t.height > 0 ? n("COM_SMARTBROWSER_DIMENSIONS", `${t.width} × ${t.height}`, "fas fa-expand") : null].filter(Boolean) : (e.collectionPresentation?.gridFields || i.gridFields || []).map((t) => n(t.label || "COM_SMARTBROWSER_DETAILS", t.format === "date" ? w(C(e, t.source)) : C(e, t.source), t.icon || "fas fa-info")).filter(Boolean);
		};
		return D(() => document.addEventListener("click", S)), e(() => document.removeEventListener("click", S)), (e, r) => (f(), g("div", { class: M(["resource-browser-grid", `size-${t.options.gridSize}`]) }, [t.selectionControls ? (f(), g("div", {
			key: 0,
			class: M(["resource-view-icons", { active: t.allSelected }])
		}, [L("label", ci, [L("input", {
			type: "checkbox",
			checked: t.allSelected,
			"aria-label": t.t("COM_SMARTBROWSER_SELECT_ALL"),
			onChange: r[0] ||= (t) => e.$emit("select-all")
		}, null, 40, li)])], 2)) : I("", !0), (f(!0), g(x, null, m(t.resources, (i) => (f(), g("div", {
			key: u(z)(i),
			class: M(["resource-browser-item", {
				selected: t.selectedIds.includes(u(z)(i)),
				focused: t.focusedId === u(z)(i),
				active: c.value === u(z)(i),
				contextual: u(Zr)(i)
			}]),
			role: u(Qr)(i) ? "button" : void 0,
			tabindex: u(Qr)(i) ? 0 : void 0,
			"aria-pressed": u($r)(i) ? t.selectedIds.includes(u(z)(i)) : void 0,
			onClick: T((t) => {
				u(a).click(u(z)(i), t), c.value = null, e.$emit("select", i, t.ctrlKey || t.metaKey);
			}, ["stop"]),
			onDblclick: T((e) => s(i, e), ["stop"]),
			onKeydown: E(T((e) => s(i), ["prevent"]), ["enter"]),
			onMouseleave: r[3] ||= (e) => c.value = null
		}, [
			t.selectionControls && u($r)(i) ? (f(), g("label", {
				key: 0,
				class: M(["resource-item-select", { checked: t.selectedIds.includes(u(z)(i)) }]),
				onClick: r[1] ||= T(() => {}, ["stop"])
			}, [L("input", {
				type: "checkbox",
				checked: t.selectedIds.includes(u(z)(i)),
				"aria-label": i.title,
				onChange: (t) => e.$emit("select", i, !0)
			}, null, 40, di)], 2)) : I("", !0),
			_(i).length ? (f(), g("button", {
				key: 1,
				type: "button",
				class: "resource-item-menu-toggle",
				"aria-expanded": c.value === u(z)(i),
				title: t.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: T((t) => {
					e.$emit("focus", i), h(u(z)(i), t);
				}, ["stop"])
			}, [...r[4] ||= [L("span", {
				class: "fas fa-ellipsis-h",
				"aria-hidden": "true"
			}, null, -1)]], 8, fi)) : I("", !0),
			c.value === u(z)(i) ? (f(), g("div", {
				key: 2,
				class: M(["resource-item-menu", { "align-start": d.value }]),
				style: l(p.value ? { maxWidth: `${p.value}px` } : null),
				onClick: r[2] ||= T(() => {}, ["stop"])
			}, [L("strong", null, b(i.title), 1), (f(!0), g(x, null, m(_(i), (r) => (f(), g("button", {
				key: r.id,
				type: "button",
				class: M([`resource-action-${r.id}`, {
					"resource-default-action": r.isDefault,
					"resource-modified-action": r.isModified
				}]),
				title: r.isDefault ? t.t("COM_SMARTBROWSER_DOUBLE_CLICK") : r.isModified ? t.t("COM_SMARTBROWSER_CTRL_DOUBLE_CLICK") : void 0,
				disabled: !t.actionAvailable(r, [i]),
				onClick: (t) => {
					c.value = null, e.$emit("action", r, i);
				}
			}, [F(mn, { icon: r.icon }, null, 8, ["icon"]), n(" " + b(t.t(r.label)), 1)], 10, pi))), 128))], 6)) : I("", !0),
			L("span", mi, [F(N, { resource: i }, null, 8, ["resource"]), i.overlays?.length ? (f(), g("span", hi, [(f(!0), g(x, null, m(i.overlays, (t) => (f(), g(x, { key: t.id }, [v(t, i) ? (f(), g("button", {
				key: 0,
				type: "button",
				class: M(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label,
				onClick: T((n) => {
					e.$emit("focus", i), e.$emit("action", v(t, i), i);
				}, ["stop"])
			}, [t.image ? (f(), g("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, _i)) : (f(), g("span", {
				key: 1,
				class: M(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, gi)) : (f(), g("span", {
				key: 1,
				class: M(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label
			}, [t.image ? (f(), g("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, yi)) : (f(), g("span", {
				key: 1,
				class: M(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, vi))], 64))), 128))])) : I("", !0)]),
			L("span", {
				class: "resource-item-title",
				title: `${t.t("COM_SMARTBROWSER_NAME")}: ${i.title}`
			}, b(i.title), 9, bi),
			(f(!0), g(x, null, m(k(i), (e) => (f(), g("span", {
				key: e.label,
				class: M(["resource-item-metadata", { "resource-item-identifier": e.identifier }]),
				title: `${t.t(e.label)}: ${e.value}`
			}, [L("span", {
				class: M(e.icon),
				"aria-hidden": "true"
			}, null, 2), L("span", Si, b(e.value), 1)], 10, xi))), 128))
		], 42, ui))), 128))], 2));
	}
}, wi = { class: "table-responsive resource-details-view" }, Ti = { class: "table table-hover" }, Ei = {
	class: "resource-type-column resource-details-select-column",
	scope: "col"
}, Di = { class: "resource-details-select-controls" }, Oi = {
	key: 0,
	class: "resource-details-select-all"
}, ki = ["checked", "aria-label"], Ai = ["title"], ji = [
	"title",
	"aria-label",
	"onClick"
], Mi = ["title"], Ni = [
	"tabindex",
	"aria-current",
	"onClick",
	"onDblclick",
	"onKeydown"
], Pi = { class: "resource-type-column" }, Fi = [
	"checked",
	"aria-label",
	"onChange"
], Ii = ["title"], Li = { class: "resource-cell-ellipsis" }, Ri = ["title"], zi = ["title", "onClick"], Bi = { class: "visually-hidden" }, Vi = ["title"], Hi = { class: "visually-hidden" }, Ui = {
	key: 1,
	class: "resource-language"
}, Wi = ["src"], Gi = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, Ki = { class: "resource-language-name" }, qi = {
	key: 2,
	class: "resource-cell-ellipsis"
}, Ji = {
	key: 3,
	class: "resource-row-overlays"
}, Yi = ["title", "onClick"], Xi = ["src"], Zi = ["title"], Qi = ["src"], $i = { class: "resource-row-actions" }, ea = [
	"aria-expanded",
	"title",
	"onClick"
], ta = [
	"title",
	"disabled",
	"onClick"
], na = {
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
	setup(t, { emit: r }) {
		let i = si(), a = t, o = r, s = (e, t) => {
			if (i.accepts(z(e), t)) {
				if ((t?.ctrlKey || t?.metaKey) && (a.modifiedAction || a.previewAction)) {
					let t = a.modifiedAction ? a.modifiedAction(e) : a.previewAction(e);
					if (t && a.actionAvailable(t, [e])) {
						o("action", t, e);
						return;
					}
				}
				if (a.defaultAction) {
					let t = a.defaultAction(e);
					t && a.actionAvailable(t, [e]) && o("action", t, e);
				} else e.navigable ? o("open", e.id) : e.activatable ? o("activate", e) : o("focus", e);
			}
		}, c = [
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
		].includes(a.options.detailsDateMode) ? a.options.detailsDateMode : "modified", p = (e) => {
			if (!e.dateGroup) return [e];
			let t = e.fields || [];
			return d() === "both" ? t : t.filter((e) => e.id === d());
		}, h = P(() => (a.columns?.length ? a.columns : c).flatMap(p)), _ = P(() => 44 + 24 * Math.max(0, ...(a.resources || []).map((e) => (e.overlays || []).filter((e) => e.id !== "status").length))), v = P(() => Math.max(48, 24 + 8 * Math.max(1, ...(a.resources || []).map((e) => String(e.metadata?.id ?? "").length)))), S = (e) => {
			let t = e.id === "status" && e.overlays ? _.value : e.id === "id" ? v.value : null;
			return t === null ? null : {
				width: `${t}px`,
				minWidth: `${t}px`
			};
		}, C = (e) => e.headerIcon || (Object.hasOwn(Q, e.id) ? Q[e.id] : "fas fa-info"), w = (e) => e.sortField || e.id, O = (e) => a.t(e.label), k = (e) => (a.sortFields || c).some((t) => t.id === w(e)), A = (e) => a.sortBy === e ? a.sortDirection === "asc" ? "fas fa-caret-up ms-1" : "fas fa-caret-down ms-1" : "fas fa-sort ms-1", j = (e) => e ? `${(e / 1024).toFixed(2)}KB` : "", R = (e) => e.metadata.width && e.metadata.height ? `${e.metadata.width}px \u00d7 ${e.metadata.height}px` : "", B = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, V = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e), H = (e, t) => {
			if (t.id === "size") return e.kind === "node" ? "" : j(e.metadata.size);
			if (t.id === "dimension") return R(e);
			let n = t.source || `metadata.${t.id}`, r = V(e, n);
			return t.format === "size" ? j(r) : t.format === "dimensions" ? R(e) : t.format === "date" || ["created", "modified"].includes(t.id) ? B(r) : t.format === "mediaType" ? a.t({
				folder: "COM_SMARTBROWSER_FOLDER",
				image: "COM_SMARTBROWSER_MEDIA_IMAGE",
				document: "COM_SMARTBROWSER_MEDIA_DOCUMENT",
				video: "COM_SMARTBROWSER_MEDIA_VIDEO",
				audio: "COM_SMARTBROWSER_MEDIA_AUDIO"
			}[r] || "COM_SMARTBROWSER_RESOURCE") : t.format === "language" && r === "*" ? a.t("COM_SMARTBROWSER_ALL_LANGUAGES") : r ?? "";
		}, ee = (e, t) => t.id === "location" ? String(e.metadata?.locationPath || H(e, t) || "") : t.format === "status" ? U(e).label : String(H(e, t) || ""), U = (e) => ({
			icon: e.statusPresentation?.icon || "fas fa-question-circle",
			label: e.statusPresentation?.label || H(e, { source: "metadata.stateLabel" }),
			class: `status-${e.statusPresentation?.tone || "neutral"}`
		}), te = (e) => e.overlays?.find((e) => e.id === "status") || {}, W = y(null), ne = (e) => {
			W.value = W.value === e ? null : e;
		}, re = (e) => oi(a.actions, e, a.actionAvailable, a.defaultAction?.(e), (a.modifiedAction || a.previewAction)?.(e)), G = (e, t) => ti(t) && t.interactiveOverlays !== !1 ? a.actions.find((n) => n.id === e.action && a.actionAvailable(n, [t])) : void 0, K = () => {
			W.value = null;
		};
		return D(() => document.addEventListener("click", K)), e(() => document.removeEventListener("click", K)), (e, r) => (f(), g("div", wi, [L("table", Ti, [L("thead", null, [L("tr", null, [
			L("th", Ei, [L("span", Di, [t.selectionControls ? (f(), g("label", Oi, [L("input", {
				type: "checkbox",
				checked: t.allSelected,
				"aria-label": t.t("COM_SMARTBROWSER_SELECT_ALL"),
				onChange: r[0] ||= (t) => e.$emit("select-all")
			}, null, 40, ki)])) : I("", !0), t.orderingField ? (f(), g("button", {
				key: 1,
				type: "button",
				class: "resource-ordering-sort",
				title: t.t("JGRID_HEADING_ORDERING"),
				onClick: r[1] ||= (n) => e.$emit("sort", t.orderingField)
			}, [L("span", {
				class: M(A(t.orderingField)),
				"aria-hidden": "true"
			}, null, 2)], 8, Ai)) : I("", !0)])]),
			(f(!0), g(x, null, m(h.value, (n) => (f(), g("th", {
				key: n.id,
				class: M(`resource-column-${n.id}`),
				style: l(S(n)),
				scope: "col"
			}, [k(n) ? (f(), g("button", {
				key: 0,
				type: "button",
				class: "btn btn-link",
				title: O(n),
				"aria-label": O(n),
				onClick: (t) => e.$emit("sort", w(n))
			}, [
				C(n) ? (f(), g("span", {
					key: 0,
					class: M(C(n)),
					"aria-hidden": "true"
				}, null, 2)) : I("", !0),
				L("span", { class: M(["resource-header-text", { "resource-header-primary": ["title", "name"].includes(n.id) }]) }, b(O(n)), 3),
				L("span", {
					class: M(A(w(n))),
					"aria-hidden": "true"
				}, null, 2)
			], 8, ji)) : (f(), g("span", {
				key: 1,
				class: "resource-column-label",
				title: O(n)
			}, [C(n) ? (f(), g("span", {
				key: 0,
				class: M(C(n)),
				"aria-hidden": "true"
			}, null, 2)) : I("", !0), L("span", { class: M(["resource-header-text", { "resource-header-primary": ["title", "name"].includes(n.id) }]) }, b(n.shortLabel ? t.t(n.shortLabel) : O(n)), 3)], 8, Mi))], 6))), 128)),
			r[4] ||= L("th", {
				class: "resource-row-actions",
				scope: "col"
			}, null, -1)
		])]), L("tbody", null, [(f(!0), g(x, null, m(t.resources, (a) => (f(), g("tr", {
			key: u(z)(a),
			class: M({
				selected: t.selectedIds.includes(u(z)(a)),
				focused: t.focusedId === u(z)(a),
				focusable: u(Qr)(a),
				contextual: u(Zr)(a)
			}),
			tabindex: u(Qr)(a) ? 0 : void 0,
			"aria-current": t.focusedId === u(z)(a) ? "true" : void 0,
			onClick: T((t) => {
				u(i).click(u(z)(a), t), W.value = null, e.$emit("select", a, t.ctrlKey || t.metaKey);
			}, ["stop"]),
			onDblclick: T((e) => s(a, e), ["stop"]),
			onKeydown: E(T((e) => s(a), ["prevent"]), ["enter"])
		}, [
			L("td", Pi, [F(N, {
				resource: a,
				variant: "compact",
				"allow-image": t.options.detailsThumbnails
			}, null, 8, ["resource", "allow-image"]), t.selectionControls && u($r)(a) ? (f(), g("label", {
				key: 0,
				class: M(["resource-row-select", { checked: t.selectedIds.includes(u(z)(a)) }]),
				onClick: r[2] ||= T(() => {}, ["stop"])
			}, [L("input", {
				type: "checkbox",
				checked: t.selectedIds.includes(u(z)(a)),
				"aria-label": a.title,
				onChange: (t) => e.$emit("select", a, !0)
			}, null, 40, Fi)], 2)) : I("", !0)]),
			L("th", {
				class: "resource-title-cell",
				scope: "row",
				title: a.title
			}, [L("span", Li, b(a.title), 1)], 8, Ii),
			(f(!0), g(x, null, m(h.value.slice(1), (t) => (f(), g("td", {
				key: t.id,
				class: M(`resource-column-${t.id}`),
				style: l(S(t)),
				title: ee(a, t)
			}, [L("span", { class: M(["resource-cell-content", { "resource-status-group": t.format === "status" }]) }, [t.format === "status" && a.statusPresentation ? (f(), g(x, { key: 0 }, [G(te(a), a) ? (f(), g("button", {
				key: 0,
				type: "button",
				class: M(["resource-status-icon", U(a).class]),
				title: U(a).label,
				onClick: T((t) => {
					e.$emit("focus", a), e.$emit("action", G(te(a), a), a);
				}, ["stop"])
			}, [L("span", {
				class: M(U(a).icon),
				"aria-hidden": "true"
			}, null, 2), L("span", Bi, b(U(a).label), 1)], 10, zi)) : (f(), g("span", {
				key: 1,
				class: M(["resource-status-icon", U(a).class]),
				title: U(a).label
			}, [L("span", {
				class: M(U(a).icon),
				"aria-hidden": "true"
			}, null, 2), L("span", Hi, b(U(a).label), 1)], 10, Vi))], 64)) : t.format === "language" ? (f(), g("span", Ui, [a.metadata.languageImage ? (f(), g("img", {
				key: 0,
				src: a.metadata.languageImage,
				alt: ""
			}, null, 8, Wi)) : a.metadata.language === "*" ? (f(), g("span", Gi)) : I("", !0), L("span", Ki, b(H(a, t)), 1)])) : (f(), g("span", qi, b(H(a, t)), 1)), t.overlays && a.overlays?.length ? (f(), g("span", Ji, [(f(!0), g(x, null, m(a.overlays.filter((e) => e.id !== "status"), (t) => (f(), g(x, { key: t.id }, [G(t, a) ? (f(), g("button", {
				key: 0,
				type: "button",
				class: M(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label,
				onClick: T((n) => {
					e.$emit("focus", a), e.$emit("action", G(t, a), a);
				}, ["stop"])
			}, [t.image ? (f(), g("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, Xi)) : (f(), g("span", {
				key: 1,
				class: M(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, Yi)) : (f(), g("span", {
				key: 1,
				class: M(["resource-overlay", [`overlay-${t.id}`, `tone-${t.tone || "neutral"}`]]),
				title: t.label
			}, [t.image ? (f(), g("img", {
				key: 0,
				src: t.image,
				alt: "",
				"aria-hidden": "true"
			}, null, 8, Qi)) : (f(), g("span", {
				key: 1,
				class: M(t.icon),
				"aria-hidden": "true"
			}, null, 2))], 10, Zi))], 64))), 128))])) : I("", !0)], 2)], 14, Ri))), 128)),
			L("td", $i, [re(a).length ? (f(), g("button", {
				key: 0,
				type: "button",
				class: "resource-row-menu-toggle",
				"aria-expanded": W.value === u(z)(a),
				title: t.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: T((t) => {
					e.$emit("focus", a), ne(u(z)(a));
				}, ["stop"])
			}, [...r[5] ||= [L("span", {
				class: "fas fa-ellipsis-h",
				"aria-hidden": "true"
			}, null, -1)]], 8, ea)) : I("", !0), W.value === u(z)(a) ? (f(), g("div", {
				key: 1,
				class: "resource-item-menu resource-row-menu",
				onClick: r[3] ||= T(() => {}, ["stop"])
			}, [L("strong", null, b(a.title), 1), (f(!0), g(x, null, m(re(a), (r) => (f(), g("button", {
				key: r.id,
				type: "button",
				class: M([`resource-action-${r.id}`, {
					"resource-default-action": r.isDefault,
					"resource-modified-action": r.isModified
				}]),
				title: r.isDefault ? t.t("COM_SMARTBROWSER_DOUBLE_CLICK") : r.isModified ? t.t("COM_SMARTBROWSER_CTRL_DOUBLE_CLICK") : void 0,
				disabled: !t.actionAvailable(r, [a]),
				onClick: (t) => {
					W.value = null, e.$emit("action", r, a);
				}
			}, [F(mn, { icon: r.icon }, null, 8, ["icon"]), n(" " + b(t.t(r.label)), 1)], 10, ta))), 128))])) : I("", !0)])
		], 42, Ni))), 128))])])]));
	}
};
//#endregion
//#region resources/js/services/ResourceApi.js
function ra(e, t = 0, n = (e) => e) {
	let r = e?.messages && typeof e.messages == "object" ? Object.values(e.messages).flat() : [], i = [...new Set([e?.message, ...r].filter((e) => typeof e == "string" && e.trim()).map((e) => e.trim()))];
	return i.length ? i.join("; ") : t === 413 ? n("COM_SMARTBROWSER_ERROR_REQUEST_TOO_LARGE") : t ? n("COM_SMARTBROWSER_ERROR_REQUEST_HTTP").replace("%s", String(t)) : n("COM_SMARTBROWSER_ERROR_REQUEST_NETWORK");
}
var ia = class {
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
						let e = Error(ra(t, Number(t.code) || 0, (e) => Joomla.Text?._(e, e) || e));
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
					let n = ra(t, Number(e.status) || 0, (e) => Joomla.Text?._(e, e) || e), r = Error(n);
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
}, aa = /^[a-zA-Z][a-zA-Z0-9_.-]*$/, oa = (e, t) => Object.prototype.hasOwnProperty.call(e, t), sa = /* @__PURE__ */ new Set(["ext.selectionAddress"]), ca = (e) => encodeURIComponent(String(e)).replace(/[!'()*]/g, (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`), la = (e) => e.map(([e, t]) => `${ca(e)}=${ca(t)}`).join("&"), ua = (e) => {
	if (/%(?![a-fA-F0-9]{2})/.test(e)) throw TypeError("Invalid address percent encoding.");
	let t = [...new URLSearchParams(e)];
	if (t.some(([e]) => !e || /[\u0000-\u001f\u007f]/.test(e))) throw TypeError("Invalid address properties.");
	return t;
};
function da(e, t = !1) {
	if (typeof e != "string" || !t && !e || /[\u0000-\u0020\u007f<>"\\]/.test(e) || /%(?![a-fA-F0-9]{2})/.test(e) || /[\u0000-\u001f\u007f]/.test(decodeURIComponent(e)) || /^[^/?#]*:/.test(e) && !/^(?:https?:\/\/|mailto:|tel:)/i.test(e) || e.startsWith("//")) throw TypeError("Unsafe resource URL.");
	if (/^https?:/i.test(e)) {
		let t = new URL(e);
		if (!t.hostname || t.username || t.password) throw TypeError("Unsafe resource URL.");
	}
	return e;
}
function fa(e) {
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
function pa(e) {
	let t = /^([a-zA-Z0-9_.-]+):(\/.*)$/.exec(e.id || "");
	if (!t) throw TypeError("Invalid media reference.");
	let n = t[1] + t[2].split("/").map(ca).join("/");
	return fa(n), n;
}
function ma() {
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
		if (!aa.test(t) || e.has(t)) throw TypeError(`Address registration conflict: ${t}`);
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
					url: da(n),
					locator: "",
					properties: [],
					plain: !0
				};
			}
			let a = da(n.slice(0, i.index), !0), o = n.slice(i.index + i[0].length), s = o.indexOf("?"), c = s < 0 ? o : o.slice(0, s);
			if (/[#\s\\]/.test(c) || /%(?![a-fA-F0-9]{2})/.test(c)) throw TypeError("Invalid address locator.");
			return {
				format: i[1],
				url: a,
				locator: c,
				properties: s < 0 ? [] : ua(o.slice(s + 1))
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
			da(n, t !== "joomlaLink");
			let a = `${n}#${t}://${r}${i.length ? `?${la(i)}` : ""}`;
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
			let i = t.selectionAddress || e.get(n || va(t))?.describe?.(t);
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
				if (e.format !== "joomlaImage" || fa(e.locator).id !== t.id) throw TypeError("Native image identity does not match selection.");
				i = e;
			}
			return i;
		},
		descriptors(t, r = {}, i = va(t)) {
			let a = [], o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), c = e.get(i)?.propertyNames || [];
			for (let e of [...t.selectionCapabilities || [], ...n.values()]) {
				if (r[e.key] === !1 || !oa(r, e.key) && !e.key?.startsWith("ext.")) continue;
				let t = typeof r[e.key] == "object" ? r[e.key] : {}, n = {
					...e.address,
					...t?.address
				}, i = n.name || e.key;
				if (!aa.test(i) || o.has(i) || s.has(e.key) || c.includes(i)) throw TypeError(`Address property conflict: ${i}`);
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
			for (let e of Object.keys(r)) if (!(sa.has(e) || i.addressConsumed && e === "ext.address" || a.some((t) => t.key === e) || r[e] == null)) {
				if (typeof r[e] == "object") throw TypeError(`No address codec for property: ${e}`);
				if (!e.startsWith("ext.")) throw TypeError(`Unsupported address property: ${e}`);
				if (l.has(e)) throw TypeError(`Address property conflict: ${e}`);
				l.add(e), c.push([e, ga(r[e])]);
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
					c.push([e.name, e.values?.[String(n)] ?? ga(n)]);
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
					o[n.key] = _a(d, n);
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
		reference: (e) => fa(e.locator),
		validate: (t, n) => e === "joomlaImage" ? t.type === "image" : e === "joomlaFolder" ? t.kind === "node" : e === "joomlaFile" ? t.kind === "item" : ["audio", "video"].includes(t.type) && n.properties.filter(([e]) => e === "mediaType").length <= 1 && !n.properties.some(([e, n]) => e === "mediaType" && n !== t.type),
		describe(t) {
			let n = t.metadata || {}, r = [];
			if (e === "joomlaImage") for (let e of ["width", "height"]) Number(n[e]) > 0 && r.push([e, String(n[e])]);
			return e === "joomlaMedia" && r.push(["mediaType", t.type]), {
				format: e,
				locator: pa(t.selection || t),
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
			return t.linkReference(da(e.url));
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
			if (typeof e == "string" ? n = s.parse(e) : t.preserved && (n = s.parse(t.preserved), fa(n.locator).id !== e.id && (n = null)), !n) {
				let r = await t.resolveReference(e, t.definition.picker || {});
				if (!r || r.unavailable || r.selectable === !1 || r.type !== "image") throw TypeError("Unavailable compound image.");
				n = s.describe(r, { format: "joomlaImage" });
			}
			if (n.format !== "joomlaImage" || !n.url) throw TypeError("A Joomla image requires src and media components.");
			return fa(n.locator), [
				["src", n.url],
				["media", n.locator],
				...n.properties.map(([e, t]) => [ha.has(e) ? e : `param.${e}`, t])
			];
		},
		async decode(e, t) {
			let n = /* @__PURE__ */ new Map(), r = [];
			for (let [t, i] of e) if (["src", "media"].includes(t)) {
				if (n.has(t)) throw TypeError("Duplicate compound image component.");
				n.set(t, i);
			} else if (ha.has(t)) r.push([t, i]);
			else if (t.startsWith("param.") && t.length > 6) r.push([t.slice(6), i]);
			else throw TypeError(`Unknown image component: ${t}`);
			if (!n.get("src") || !n.get("media")) throw TypeError("Missing compound image src or media.");
			let i = fa(n.get("media")), a = s.serialize({
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
var ha = /* @__PURE__ */ new Set([
	"width",
	"height",
	"crop",
	"ratio",
	"zoom"
]), ga = (e) => {
	if (typeof e == "string" || typeof e == "boolean" || typeof e == "number" && Number.isFinite(e)) return String(e);
	throw TypeError("A structured property requires a registered address codec.");
}, _a = (e, t) => {
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
}, va = (e) => e.type === "image" ? "joomlaImage" : e.type === "folder" ? "joomlaFolder" : ["audio", "video"].includes(e.type) ? "joomlaMedia" : e.adapter === "media" || e.type === "document" ? "joomlaFile" : e.type === "uri" || e.adapter === "direct-links" ? "joomlaLink" : e.type === "gallery" ? "joomlaGallery" : "joomlaItem", ya = ma();
//#endregion
//#region resources/js/services/SelectionAddressService.js
function ba({ model: e, api: t, config: n, service: r, isDisposed: i = () => !1 }) {
	return {
		async exportAddresses(t) {
			return await e.refresh(), r.serializeLines(e.getItems(), e.resources.value, {
				...n.nativeImage ? { nativeAddress: n.nativeAddress } : {},
				...t
			});
		},
		async importAddresses(a, o) {
			if (!e.referenceItems) throw TypeError("This consumer stores identifiers only, not selection usage.");
			let s = e.revision.value, c = await r.import(a, e.getItems(), o), l = await t.collection(c.items, {
				referenceItems: !0,
				homogeneous: n.homogeneous === !0
			});
			if (i() || e.revision.value !== s) throw Error("Selection changed while importing addresses.");
			if (l.resources.some((e) => e.unavailable || e.selectable === !1)) throw Error("An imported resource is unavailable.");
			return await e.setItems(c.items, {
				resolvedResources: l.resources,
				reason: "import"
			}), e.getItems();
		}
	};
}
function xa({ api: e, config: t, contract: n = t.addressContract || ya }) {
	let r = !e;
	e ||= new ia({
		...t,
		mode: "select"
	});
	let i = /* @__PURE__ */ new Map(), a = t.selectionProfile || {}, o = {
		...t,
		allowedAdapters: t.allowedAdapters || (t.adapter ? [t.adapter] : []),
		maxSelections: t.multiple === !1 ? 1 : t.maxSelections || 500
	}, s = (e, n = {}) => {
		let r = n.browseRoot ?? (e.adapter === t.adapter ? t.browseRoot : ""), a = JSON.stringify([e.adapter, r]);
		return i.has(a) || i.set(a, new ia({
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
				H([{ selection: r }], o);
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
				let g = en({
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
			let h = H(u ? [...i, ...f] : f, o), g = H(f, o), _ = g.map((e) => d[f.findIndex((t) => V(t.selection) === V(e.selection))]?.line), v = await e.collection(g, {
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
var Sa = ["aria-label", "aria-busy"], Ca = { class: "resource-browser" }, wa = {
	key: 0,
	class: "alert alert-danger",
	role: "alert"
}, Ta = {
	key: 0,
	class: "sb-collection-count"
}, Ea = ["aria-expanded"], Da = { class: "sb-selected-list" }, Oa = { class: "resource-toolbar sb-collection-toolbar" }, ka = ["disabled", "aria-label"], Aa = [
	"disabled",
	"title",
	"aria-label"
], ja = [
	"disabled",
	"title",
	"aria-label"
], Ma = [
	"disabled",
	"title",
	"aria-label"
], Na = [
	"disabled",
	"title",
	"aria-label"
], Pa = [
	"disabled",
	"title",
	"aria-label"
], Fa = [
	"disabled",
	"title",
	"aria-label"
], Ia = [
	"title",
	"aria-label",
	"aria-pressed",
	"onClick"
], La = [
	"data-info-state",
	"aria-pressed",
	"title",
	"aria-label"
], Ra = ["disabled", "aria-label"], za = { class: "sb-selected-content" }, Ba = {
	key: 0,
	class: "resource-empty-state sb-selection-empty",
	role: "status"
}, Va = ["disabled"], Ha = {
	key: 0,
	class: "sb-selected-panel"
}, Ua = {
	key: 0,
	class: "sb-selection-gallery-nav"
}, Wa = ["disabled", "aria-label"], Ga = {
	key: 0,
	"aria-hidden": "true"
}, Ka = ["disabled", "aria-label"], qa = {
	key: 0,
	"aria-hidden": "true"
}, Ja = ["aria-label", "aria-valuenow"], Ya = {
	key: 3,
	class: "text-danger sb-address-error",
	role: "alert"
}, Xa = {
	key: 1,
	class: "sb-collection-count"
}, Za = ["aria-label"], Qa = ["disabled"], $a = {
	key: 0,
	class: "sb-address-append"
}, eo = ["disabled"], to = {
	key: 1,
	class: "text-danger sb-address-error",
	role: "alert"
}, no = { class: "sb-address-dialog-actions" }, ro = ["disabled"], io = ["disabled"], ao = {
	__name: "CollectionView",
	props: {
		model: Object,
		api: Object,
		config: Object,
		t: Function
	},
	setup(t) {
		let r = t, i = r.model.browser.state, a = !1, o = 0, s = r.config.addressService || xa({
			api: r.api,
			config: r.config
		}), p = r.config.importAddresses ? r.config : ba({
			model: r.model,
			api: r.api,
			config: r.config,
			service: s,
			isDisposed: () => a
		}), h = y({}), _ = y({}), w = y(0), O = s.contract.subscribe(() => {
			w.value++;
		}), A = `sb-address-${d()}`, N = y(null), B = y(""), H = y(""), U = y(!1), te = y(r.config.multiple !== !1);
		function W() {
			B.value = "", H.value = "", N.value.showModal();
		}
		async function ne() {
			if (!U.value) {
				U.value = !0, H.value = "";
				try {
					await p.importAddresses(B.value, { append: te.value }), N.value.close();
				} catch (e) {
					H.value = e.message;
				} finally {
					U.value = !1;
				}
			}
		}
		async function re() {
			try {
				await navigator.clipboard.writeText(await p.exportAddresses());
			} catch (e) {
				i.error = e.message || r.t("COM_SMARTBROWSER_COPY_FAILED");
			}
		}
		e(() => {
			a = !0, o++, O(), r.config.addressService || s.destroy();
		});
		let G = P(() => r.config.selectedResources && r.config.informationPanel !== !1), K = `${r.config.viewPreferenceKey || "supjx.smartbrowser.collection.view"}.${r.config.multiple === !1 ? "single" : "multiple"}-layout`, q = {};
		try {
			q = JSON.parse(localStorage.getItem(K) || "{}") || {};
		} catch {}
		let J = y(!G.value || q.listOpen === !0), ie = y([
			"side",
			"vertical",
			"hidden"
		].includes(q.infoState) ? q.infoState : r.config.informationPanelOpen === !1 ? "hidden" : q.sideInfo === !0 ? "side" : "vertical");
		function ae() {
			ie.value = {
				vertical: "side",
				side: "hidden",
				hidden: "vertical"
			}[ie.value];
		}
		R(J, (e) => {
			G.value && !e && (ie.value = "vertical");
		}, { immediate: !0 }), R(() => [
			J.value,
			ie.value,
			i.sortBy,
			i.sortDirection,
			i.hiddenColumns,
			i.shownColumns
		], () => {
			if (G.value || r.config.selectedResources) try {
				localStorage.setItem(K, JSON.stringify({
					listOpen: J.value,
					infoState: ie.value,
					sortBy: i.sortBy,
					sortDirection: i.sortDirection,
					hiddenColumns: i.hiddenColumns,
					shownColumns: i.shownColumns
				}));
			} catch {}
		}, { deep: !0 });
		let oe = P(() => !r.config.readOnly && typeof r.config.onAdd == "function"), se = y(!1), ce = P(() => (r.model.revision?.value, Jn(r.config, r.model.getItems().length) && !se.value && !i.loading && !i.busy));
		async function le() {
			if (ce.value) {
				se.value = !0;
				try {
					await r.config.onAdd();
				} catch (e) {
					r.config.onError?.(e);
				} finally {
					se.value = !1;
				}
			}
		}
		i.sortBy = r.config.selectedResources && ["collectionOrder", ...Gn.map((e) => e.id)].includes(q.sortBy) ? q.sortBy : "collectionOrder", i.sortDirection = q.sortDirection === "desc" ? "desc" : "asc", R(() => i.sortBy, (e) => {
			r.config.allowOrdering === !1 && e === "collectionOrder" && (i.sortBy = "title");
		}, {
			immediate: !0,
			flush: "sync"
		}), i.hiddenColumns = Array.isArray(q.hiddenColumns) ? q.hiddenColumns : [], i.shownColumns = Array.isArray(q.shownColumns) ? q.shownColumns : [], i.viewOptions.gridSize = r.config.gridSize || "md", i.viewOptions.detailsThumbnails = r.config.thumbnails !== !1;
		let ue = new ee(r.api, i, () => r.model.refresh(), r.t, r.config.editorMode || "modal", r.config.application), de = /* @__PURE__ */ new Map(), fe = (e) => {
			if (!e.adapter) return ue;
			if (!de.has(e.adapter)) {
				let t = new ia({
					...r.config,
					adapter: e.adapter,
					mode: r.config.readOnly ? "readonly" : "manage"
				});
				de.set(e.adapter, {
					api: t,
					driver: new ee(t, i, () => r.model.refresh(), r.t, r.config.editorMode || "modal", r.config.application)
				});
			}
			return de.get(e.adapter).driver;
		}, pe = [
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
		], me = P(() => r.config.selectedResources && r.config.multiple !== !1 && r.model.canOrder && i.sortBy === "collectionOrder" ? [
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
		] : []), he = P(() => [
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
			...me.value.filter((e) => e.id !== "collectionSort").map((e) => ({
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
			...r.config.selectedResources && r.model.referenceItems && !r.config.readOnly ? [{
				id: "collectionImport",
				label: "COM_SMARTBROWSER_IMPORT_ADDRESS",
				icon: "fas fa-paste",
				requiresSelection: !0,
				collectionCommand: !0
			}] : [],
			...r.config.readOnly ? [] : (r.config.resourceActions || []).map((e) => ({
				...e,
				collectionCommand: !0
			})),
			...r.config.contextActions === !0 && !r.config.readOnly ? i.actions.filter((e) => (r.config.contextActionIds || pe).includes(e.id)) : []
		]), ge = P(() => he.value.find((e) => e.id === "collectionReplace")), _e = P(() => !G.value || J.value ? [] : [
			...oe.value ? [{
				id: "collectionAdd",
				label: "COM_SMARTBROWSER_COLLECTION_ADD",
				icon: "fas fa-plus",
				disabled: !ce.value
			}] : [],
			...he.value.filter((e) => ["collectionRemove", "collectionReplace"].includes(e.id)).map((e) => ({
				...e,
				disabled: !X.value || !Se(e, [X.value])
			})),
			...me.value.map((e) => ({
				...e,
				disabled: !X.value || !Se(e, [X.value])
			}))
		]), ve = P(() => X.value?.collectionActions?.find((e) => e.id === "preview" && fe(X.value).available(e, [X.value])) || we(X.value)), ye = (e) => e.id === "collectionReplace" || (r.config.resourceActions || []).some((t) => t.id === e.id), be = (e, t) => t.collectionActions?.find((t) => t.id === e.id) || e, xe = (e) => mt.value.includes(z(e)) ? mt.value : [z(e)], Se = (e, t) => {
			if (i.loading || i.busy) return !1;
			if (e.id === "collectionAdd") return ce.value;
			if (e.id === "collectionCopy") return Y.value.length > 0;
			if (e.id === "collectionImport") return r.model.referenceItems && !r.config.readOnly;
			if ([
				"collectionMoveUp",
				"collectionMoveDown",
				"collectionSort"
			].includes(e.id)) {
				if (!me.value.some((t) => t.id === e.id)) return !1;
				if (e.id === "collectionSort") return Y.value.length > 1;
				if (!t[0]) return !1;
				let n = new Set(xe(t[0])), r = e.id === "collectionMoveUp" ? -1 : 1;
				return Y.value.some((e, t) => n.has(z(e)) && Y.value[t + r] && !n.has(z(Y.value[t + r])));
			}
			return e.id === "collectionRemove" ? r.model.canRemove : !t.some((e) => e.unavailable) && (ye(e) ? !r.config.readOnly : t.every((t) => (!t.collectionActions || t.collectionActions.some((t) => t.id === e.id)) && fe(t).available(be(e, t), [t])));
		}, Ce = (e) => he.value.find((t) => t.id === r.config.defaultResourceActionId && Se(t, [e])) || (r.config.contextActions === !0 && !r.config.readOnly ? ii({
			...e,
			activatable: !e.unavailable
		}, "manage", he.value, Se) : null), we = (e) => r.config.contextActions === !0 && !r.config.readOnly ? ni(e, "manage", he.value, Se) : null;
		async function Te(e, t) {
			if (![
				"collectionSort",
				"collectionAdd",
				"collectionCopy",
				"collectionImport",
				"collectionMoveUp",
				"collectionMoveDown"
			].includes(e?.id) || Se(e, t ? [t] : [])) {
				if (e?.id === "collectionSort") {
					e.disabled || Ae.value?.open();
					return;
				}
				if (e?.id === "collectionAdd") return le();
				if (e?.id === "collectionCopy") return re();
				if (e?.id === "collectionImport") return W();
				if (["collectionMoveUp", "collectionMoveDown"].includes(e?.id)) return !t || e.disabled ? void 0 : r.model.move(e.id === "collectionMoveUp" ? "up" : "down", xe(t));
				if (t && Se(e, [t])) {
					if (e.id === "collectionRemove") return r.model.remove(mt.value.includes(z(t)) ? mt.value : [z(t)]);
					try {
						await (e.id === "collectionReplace" ? r.config.onReplace(t) : ye(e) ? r.config.onResourceAction?.(e, t) : fe(t).execute(be(e, t), [t]));
					} catch (e) {
						r.config.onError?.(e);
					}
				}
			}
		}
		let Ee = P(() => r.config.selectedResources ? Gn : (i.presentation.sortFields || [{
			id: "title",
			label: "COM_SMARTBROWSER_NAME"
		}]).filter((e) => !["ordering", "collectionOrder"].includes(e.id))), De = P(() => r.config.selectedResources ? Wn : i.presentation.columns || [{
			id: "title",
			label: "COM_SMARTBROWSER_NAME"
		}]), Oe = P(() => De.value.filter((e) => e.id === "title" || (e.defaultVisible === !1 ? i.shownColumns.includes(e.id) : !i.hiddenColumns.includes(e.id)))), ke = (e) => {
			let t = De.value.find((t) => t.id === e);
			if (!t || e === "title") return;
			let n = t.defaultVisible === !1 ? "shownColumns" : "hiddenColumns";
			i[n] = i[n].includes(e) ? i[n].filter((t) => t !== e) : [...i[n], e];
		}, Ae = y(null);
		function je({ payload: e, resolve: t, reject: n }) {
			try {
				if (!e.sort || i.sortBy !== "collectionOrder" || !Ee.value.some((t) => t.id === e.sort.field) || !["asc", "desc"].includes(e.sort.direction)) throw Error("Invalid collection sorting state.");
				r.model.reorderItems(Kn(Y.value, e.sort.field, e.sort.direction).map(z)), i.sortDirection = "asc", t();
			} catch (e) {
				n(e);
			}
		}
		let Me = (e) => {
			i.sortBy === e ? i.sortDirection = i.sortDirection === "asc" ? "desc" : "asc" : (i.sortBy = e, i.sortDirection = "asc");
		}, Ne = [{
			id: "grid",
			label: "COM_SMARTBROWSER_GRID",
			icon: "fas fa-th"
		}, {
			id: "details",
			label: "COM_SMARTBROWSER_DETAILS",
			icon: "fas fa-list"
		}], Pe = P(() => r.model.browser.bulkSelectableResources.value.length > 0 && r.model.browser.bulkSelectableResources.value.every((e) => i.selectedIds.includes(z(e)))), Fe = y(null), Ie = y(0), Le = y(null), Re = y(!1), ze = y(!1), Be = y(!1);
		function Ve() {
			let e = Le.value;
			e && (Re.value = e.scrollWidth > e.clientWidth + 2, ze.value = e.scrollLeft > 1, Be.value = e.scrollLeft + e.clientWidth < e.scrollWidth - 1);
		}
		function He(e) {
			Le.value.scrollBy({
				left: e * 260,
				behavior: "smooth"
			});
		}
		let Ue = P(() => G.value && !J.value || ie.value !== "hidden"), We = P(() => r.config.informationPanelVerticalPosition || (["top", "bottom"].includes(r.config.informationPanelPosition) ? r.config.informationPanelPosition : "top")), Ge = P(() => r.config.informationPanelHorizontalPosition || (["left", "right"].includes(r.config.informationPanelPosition) ? r.config.informationPanelPosition : "right")), Ke = P(() => G.value ? J.value ? ie.value === "side" && Ie.value >= 640 ? Ge.value : We.value : "top" : Yn(r.config.informationPanelPosition, Ie.value)), qe = P(() => ["top", "bottom"].includes(Ke.value)), Je = y(0), Ye = P(() => Je.value && Ue.value && ["left", "right"].includes(Ke.value) ? { gridTemplateColumns: Ke.value === "left" ? `${Xe(Je.value)}px minmax(0, 1fr)` : `minmax(0, 1fr) ${Xe(Je.value)}px` } : void 0), Xe = (e) => Math.max(200, Math.min(e, Ie.value - 200)), Ze;
		function Qe(e) {
			e.button === 0 && (e.preventDefault(), Ze = {
				x: e.clientX,
				width: e.currentTarget.parentElement.getBoundingClientRect().width
			}, e.currentTarget.setPointerCapture(e.pointerId));
		}
		function $e(e) {
			Ze && (Je.value = Xe(Ze.width + (e.clientX - Ze.x) * (Ke.value === "left" ? 1 : -1)));
		}
		function et() {
			Ze = null;
		}
		function tt(e) {
			Je.value = Xe((Je.value || Ie.value * .32) + e * (Ke.value === "left" ? 1 : -1));
		}
		let nt = P(() => r.config.readOnly ? "readonly" : r.config.selectionUseData || "readonly"), rt = window.SmartBrowserPicker?.extensions?.() || {
			editors: {},
			previewActions: []
		}, it = y(rt.previewActions), at = window.SmartBrowserPicker?.subscribePreviewActions?.((e) => {
			it.value = e;
		});
		e(() => at?.());
		let ot = /* @__PURE__ */ new Map();
		async function st(e, t = {}) {
			let n = JSON.stringify([e.adapter, t.browseRoot || ""]);
			return ot.has(n) || ot.set(n, new ia({
				...r.config,
				adapter: e.adapter,
				mode: "select",
				browseRoot: t.browseRoot || null,
				flatScope: null
			})), (await ot.get(n).collection([e.id])).resources[0];
		}
		let ct = (e) => (r.model.revision?.value, r.model.getItems().find((t) => t.selection && V(t.selection) === z(e))?.usage || {}), lt = P(() => (r.model.revision?.value, en({
			profile: r.config.selectionProfile || {},
			initialUsage: Object.fromEntries(r.model.resources.value.map((e) => [z(e), ct(e)])),
			editors: rt.editors,
			resolveReference: st
		}))), ut = y({}), dt = y({}), Y = P(() => {
			let e = r.model.resources.value.map((e) => {
				let t = Ft(e, ct(e)), n = dt.value[z(e)];
				return r.config.selectedResources ? {
					...Vn({
						...t,
						effectiveThumbnail: ut.value[z(e)],
						effectiveThumbnailResource: n,
						imageCrop: n?.imageCrop || e.imageCrop
					}, i.presentation),
					selectionPath: h.value[z(e)] || (_.value[z(e)] ? r.t("COM_SMARTBROWSER_ADDRESS_UNAVAILABLE") : "")
				} : t;
			});
			return r.config.selectedResources && i.sortBy !== "collectionOrder" ? Kn(e, i.sortBy, i.sortDirection) : e;
		});
		R(() => [
			r.model.resources.value,
			r.model.revision?.value,
			r.config.nativeAddress,
			r.config.selectionProfile,
			w.value
		], async () => {
			let e = ++o, t = {}, n = {};
			for (let e of r.model.resources.value) {
				let i = z(e), a = r.model.getItems().find((e) => e.selection && V(e.selection) === i) || {
					selection: e.selection || {
						adapter: e.adapter || r.config.adapter,
						id: e.id
					},
					usage: {}
				};
				try {
					t[i] = await s.serialize(a, e, r.config.nativeImage ? { nativeAddress: r.config.nativeAddress } : {});
				} catch (e) {
					n[i] = e.message;
				}
			}
			e === o && !a && (h.value = t, _.value = n);
		}, {
			immediate: !0,
			deep: !0
		});
		let X = P(() => Y.value.find((e) => z(e) === i.focusedId) || Y.value[0] || null), ft = P(() => Y.value.findIndex((e) => z(e) === z(X.value)));
		function pt(e) {
			let t = Y.value[ft.value + e];
			t && r.model.browser.focus(t);
		}
		let mt = P(() => i.selectedIds), ht = P(() => r.config.multiple === !1 ? Y.value.map(z) : mt.value);
		R(() => r.config.multiple === !1 ? z(Y.value[0]) : null, (e) => {
			e && (i.selectedIds = [e]);
		}, { immediate: !0 });
		let gt = P(() => nt.value === "hidden" ? [] : lt.value.definitions(X.value).filter((e) => e.presentation !== "hidden")), _t = y(0), vt = 0, yt = P(() => (_t.value, {
			...ct(X.value),
			...lt.value.get(X.value)
		})), bt = y({});
		function xt(e, t) {
			r.model.browser.toggle(e, t);
		}
		async function St(e, t) {
			let n = X.value;
			if (!n || nt.value !== "editable") return;
			let i = lt.value, a = ++vt;
			i.set(n, e, t), _t.value++;
			let o = {
				...ct(n),
				...i.get(n)
			}, s = await i.validate([n]);
			a === vt && i === lt.value && (z(X.value) === z(n) && (bt.value = s.errors[z(n)] || {}), s.valid && r.model.setUsage(n, o));
		}
		let Ct = P(() => {
			let e = X.value, t = () => Hn(e);
			return ai({
				resource: e,
				isReadOnly: nt.value !== "editable",
				fieldElement: Fe.value?.closest(".sb-selection-field") || null,
				profile: r.config.selectionProfile || {},
				values: yt.value,
				getValues: () => ({
					...ct(e),
					...lt.value.get(e)
				}),
				getAddress: () => (r.config.nativeImage || r.config.nativePreview ? r.config.nativeAddress : void 0) ?? ct(e)["ext.address"] ?? Hn(e),
				getSelectionAddress: () => h.value[z(e)] || "",
				getDefaultAddress: t,
				resetAddress: () => {
					if (z(X.value) === z(e)) return r.config.nativeImage || r.config.nativePreview ? (r.config.nativeAddress = t(), St("ext.address", r.config.nativeAddress)) : St("ext.address", null);
				},
				setAddress: (t) => {
					if (z(X.value) === z(e)) return r.config.nativeAddress = String(t || ""), St("ext.address", r.config.nativeAddress);
				},
				isCurrent: () => z(X.value) === z(e),
				setValue: (t, n) => {
					if (z(X.value) === z(e)) return St(t, n);
				},
				refresh: () => r.model.refresh(),
				selectResource: (e) => window.SmartBrowserPicker.open(e)
			});
		}), wt = P(() => it.value.filter((e) => {
			try {
				return X.value && (nt.value === "editable" || e.allowReadOnly === !0) && (!e.applies || e.applies(Ct.value));
			} catch {
				return !1;
			}
		})), Tt, Et = 0;
		return R(() => [r.model.resources.value, r.model.revision?.value], async () => {
			let e = ++Et, t = {}, n = {};
			for (let e of r.model.resources.value) {
				let r = ct(e), i = Pt(lt.value.definitions(e)).find((e) => r[e.key]);
				if (i) try {
					n[z(e)] = await Vt(i, r[i.key], st), t[z(e)] = Lt(n[z(e)]);
				} catch {}
			}
			e === Et && (ut.value = t, dt.value = n);
		}, { immediate: !0 }), D(() => {
			Tt = new ResizeObserver(() => {
				Ie.value = Fe.value.getBoundingClientRect().width, Ve();
			}), Tt.observe(Fe.value), Tt.observe(Le.value);
		}), e(() => {
			Tt?.disconnect(), Et++, ot.forEach((e) => e.destroy());
		}), e(() => {
			ue.destroy(), de.forEach(({ driver: e, api: t }) => {
				e.destroy(), t.destroy();
			});
		}), (e, r) => (f(), g("section", {
			ref_key: "control",
			ref: Fe,
			class: M(["smartbrowser smartbrowser-collection", {
				"is-compact": t.config.layout === "compact",
				"is-selected-resources": t.config.selectedResources,
				"is-single-selection": G.value && ["top", "bottom"].includes(Ke.value)
			}]),
			"aria-label": t.t("COM_SMARTBROWSER_COLLECTION_TITLE"),
			"aria-busy": u(i).loading || u(i).busy
		}, [
			L("div", Ca, [
				u(i).error ? (f(), g("p", wa, b(u(i).error), 1)) : I("", !0),
				L("div", {
					class: M(["sb-selected-layout", [`panel-${Ke.value}`, {
						"panel-open": Ue.value && t.config.informationPanel !== !1,
						"is-collapsed": G.value && !J.value
					}]]),
					style: l(J.value ? Ye.value : void 0)
				}, [L("div", { class: M(["sb-selected-items", `view-${u(i).activeView}`]) }, [G.value ? (f(), g("div", Ta, [L("button", {
					type: "button",
					class: "sb-collection-count-toggle",
					"aria-expanded": J.value,
					onClick: r[0] ||= (e) => J.value = !J.value
				}, [L("span", { class: M(J.value ? "fas fa-chevron-up" : "fas fa-chevron-down") }, null, 2), n(b(t.t("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": " + b(t.model.getItems().length), 1)], 8, Ea)])) : I("", !0), v(L("div", Da, [L("header", Oa, [
					v(L("button", {
						class: "resource-icon-button sb-toolbar-scroll",
						type: "button",
						disabled: !ze.value,
						"aria-label": t.t("COM_SMARTBROWSER_SCROLL_BACK"),
						onClick: r[1] ||= (e) => He(-1)
					}, [...r[19] ||= [L("span", { class: "fas fa-chevron-left" }, null, -1)]], 8, ka), [[k, Re.value]]),
					L("div", {
						ref_key: "toolbar",
						ref: Le,
						class: "resource-view-controls",
						onScroll: Ve
					}, [
						oe.value ? (f(), g("button", {
							key: 0,
							class: "resource-icon-button",
							type: "button",
							disabled: !ce.value,
							title: t.t(t.config.addLabel || "COM_SMARTBROWSER_COLLECTION_ADD"),
							"aria-label": t.t(t.config.addLabel || "COM_SMARTBROWSER_COLLECTION_ADD"),
							onClick: le
						}, [...r[20] ||= [L("span", {
							class: "fas fa-plus",
							"aria-hidden": "true"
						}, null, -1)]], 8, Aa)) : I("", !0),
						t.model.canRemove ? (f(), g("button", {
							key: 1,
							class: "resource-icon-button",
							type: "button",
							disabled: !ht.value.length || u(i).loading || u(i).busy,
							title: t.t("COM_SMARTBROWSER_COLLECTION_REMOVE"),
							"aria-label": t.t("COM_SMARTBROWSER_COLLECTION_REMOVE"),
							onClick: r[2] ||= (e) => t.model.remove(ht.value)
						}, [...r[21] ||= [L("span", {
							class: "fas fa-minus",
							"aria-hidden": "true"
						}, null, -1)]], 8, ja)) : I("", !0),
						ge.value ? (f(), g("button", {
							key: 2,
							class: "resource-icon-button",
							type: "button",
							disabled: !X.value || !Se(ge.value, [X.value]),
							title: t.t(ge.value.label),
							"aria-label": t.t(ge.value.label),
							onClick: r[3] ||= (e) => Te(ge.value, X.value)
						}, [F(mn, { icon: ge.value.icon }, null, 8, ["icon"])], 8, Ma)) : I("", !0),
						t.model.canOrder && u(i).sortBy === "collectionOrder" ? (f(), S(Nr, {
							key: 3,
							enabled: !u(i).loading && !u(i).busy && u(i).selectedIds.length > 0,
							t: t.t,
							onReorder: t.model.move
						}, null, 8, [
							"enabled",
							"t",
							"onReorder"
						])) : I("", !0),
						t.config.selectedResources && t.config.multiple !== !1 && t.model.canOrder && u(i).sortBy === "collectionOrder" ? (f(), g("button", {
							key: 4,
							class: "resource-icon-button",
							type: "button",
							disabled: Y.value.length < 2 || u(i).busy || u(i).loading,
							title: t.t("COM_SMARTBROWSER_COLLECTION_SORT"),
							"aria-label": t.t("COM_SMARTBROWSER_COLLECTION_SORT"),
							onClick: r[4] ||= (e) => Ae.value.open()
						}, [...r[22] ||= [L("span", { class: "fas fa-sort" }, null, -1)]], 8, Na)) : I("", !0),
						r[26] ||= L("span", { class: "sb-collection-extra-buttons" }, null, -1),
						t.config.selectedResources ? (f(), g("button", {
							key: 5,
							type: "button",
							class: "resource-icon-button",
							disabled: !Y.value.length || u(i).loading || u(i).busy,
							title: t.t("COM_SMARTBROWSER_COPY_ADDRESSES"),
							"aria-label": t.t("COM_SMARTBROWSER_COPY_ADDRESSES"),
							onClick: re
						}, [...r[23] ||= [L("span", { class: "fas fa-copy" }, null, -1)]], 8, Pa)) : I("", !0),
						t.config.selectedResources && t.model.referenceItems && !t.config.readOnly ? (f(), g("button", {
							key: 6,
							type: "button",
							class: "resource-icon-button",
							disabled: u(i).loading || u(i).busy,
							title: t.t("COM_SMARTBROWSER_IMPORT_ADDRESSES"),
							"aria-label": t.t("COM_SMARTBROWSER_IMPORT_ADDRESSES"),
							onClick: W
						}, [...r[24] ||= [L("span", { class: "fas fa-paste" }, null, -1)]], 8, Fa)) : I("", !0),
						u(i).activeView === "grid" && (t.config.selectedResources || t.config.layout !== "compact") ? (f(), S(Kr, {
							key: 7,
							alignment: "start",
							fields: Ee.value,
							"sort-by": u(i).sortBy,
							"sort-direction": u(i).sortDirection,
							"default-value": t.config.allowOrdering === !1 ? null : "collectionOrder",
							"default-label": "JGRID_HEADING_ORDERING",
							t: t.t,
							onSortBy: r[5] ||= (e) => {
								u(i).sortBy = e, u(i).sortDirection = "asc";
							},
							onSortDirectionValue: r[6] ||= (e) => u(i).sortDirection = e
						}, null, 8, [
							"fields",
							"sort-by",
							"sort-direction",
							"default-value",
							"t"
						])) : I("", !0),
						t.config.selectedResources && u(i).activeView === "details" ? (f(), S(Br, {
							key: 8,
							columns: De.value,
							"hidden-columns": u(i).hiddenColumns,
							"shown-columns": u(i).shownColumns,
							t: t.t,
							onToggleColumn: ke
						}, null, 8, [
							"columns",
							"hidden-columns",
							"shown-columns",
							"t"
						])) : I("", !0),
						(f(), g(x, null, m(Ne, (e) => L("button", {
							key: e.id,
							class: M(["resource-icon-button", { active: u(i).activeView === e.id }]),
							type: "button",
							title: t.t(e.label),
							"aria-label": t.t(e.label),
							"aria-pressed": u(i).activeView === e.id,
							onClick: (t) => u(i).activeView = e.id
						}, [L("span", {
							class: M(e.icon),
							"aria-hidden": "true"
						}, null, 2)], 10, Ia)), 64)),
						t.config.informationPanel !== !1 && t.config.selectedResources ? (f(), g("button", {
							key: 9,
							class: M(["resource-icon-button", {
								active: ie.value === "side",
								"info-vertical": ie.value === "vertical"
							}]),
							type: "button",
							"data-info-state": ie.value,
							"aria-pressed": Ue.value,
							title: t.t("COM_SMARTBROWSER_USAGE_INFO"),
							"aria-label": t.t("COM_SMARTBROWSER_USAGE_INFO"),
							onClick: ae
						}, [...r[25] ||= [L("span", {
							class: "fas fa-info-circle",
							"aria-hidden": "true"
						}, null, -1)]], 10, La)) : I("", !0)
					], 544),
					v(L("button", {
						class: "resource-icon-button sb-toolbar-scroll",
						type: "button",
						disabled: !Be.value,
						"aria-label": t.t("COM_SMARTBROWSER_SCROLL_FORWARD"),
						onClick: r[7] ||= (e) => He(1)
					}, [...r[27] ||= [L("span", { class: "fas fa-chevron-right" }, null, -1)]], 8, Ra), [[k, Re.value]])
				]), L("div", za, [t.model.resources.value.length ? (f(), S(c(u(i).activeView === "details" ? na : Ci), {
					key: 1,
					resources: Y.value,
					"selected-ids": mt.value,
					"focused-id": u(i).focusedId,
					"all-selected": Pe.value,
					"selection-controls": t.config.multiple !== !1,
					options: u(i).viewOptions,
					actions: he.value,
					"action-available": Se,
					"default-action": Ce,
					"preview-action": we,
					"grid-fields": t.config.selectedResources ? [...u(i).presentation.gridFields || [], ...Oe.value.filter((e) => e.defaultVisible === !1)] : u(i).presentation.gridFields || [],
					columns: Oe.value,
					"sort-by": u(i).sortBy,
					"sort-direction": u(i).sortDirection,
					"sort-fields": Ee.value,
					"ordering-field": t.config.allowOrdering === !1 ? void 0 : "collectionOrder",
					t: t.t,
					onSelect: xt,
					onSelectAll: t.model.browser.selectAll,
					onFocus: t.model.browser.focus,
					onAction: Te,
					onSort: Me
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
				])) : (f(), g("div", Ba, [L("span", null, b(t.t(u(i).loading ? "COM_SMARTBROWSER_LOADING" : "COM_SMARTBROWSER_COLLECTION_EMPTY")), 1), oe.value && (!Ue.value || !qe.value) ? (f(), g("button", {
					key: 0,
					type: "button",
					class: "btn btn-outline-secondary",
					disabled: !ce.value,
					onClick: le
				}, [r[28] ||= L("span", { class: "fas fa-plus" }, null, -1), n(" " + b(t.t("COM_SMARTBROWSER_SELECT_RESOURCE")), 1)], 8, Va)) : I("", !0)]))])], 512), [[k, !G.value || J.value]])], 2), t.config.selectedResources && t.config.informationPanel !== !1 ? v((f(), g("div", Ha, [
					t.config.multiple !== !1 && ["top", "bottom"].includes(Ke.value) && Y.value.length > 1 ? (f(), g("div", Ua, [L("button", {
						type: "button",
						class: "resource-icon-button",
						disabled: ft.value <= 0,
						"aria-label": t.t("COM_SMARTBROWSER_PREVIOUS_RESOURCE"),
						onClick: r[8] ||= (e) => pt(-1)
					}, [r[29] ||= L("span", { class: "fas fa-chevron-left" }, null, -1), ft.value > 0 ? (f(), g("small", Ga, b(ft.value), 1)) : I("", !0)], 8, Wa), L("button", {
						type: "button",
						class: "resource-icon-button",
						disabled: ft.value >= Y.value.length - 1,
						"aria-label": t.t("COM_SMARTBROWSER_NEXT_RESOURCE"),
						onClick: r[9] ||= (e) => pt(1)
					}, [ft.value < Y.value.length - 1 ? (f(), g("small", qa, b(ft.value + 2), 1)) : I("", !0), r[30] ||= L("span", { class: "fas fa-chevron-right" }, null, -1)], 8, Ka)])) : I("", !0),
					J.value && ["left", "right"].includes(Ke.value) ? (f(), g("div", {
						key: 1,
						class: "sb-panel-resize",
						role: "separator",
						tabindex: "0",
						"aria-orientation": "vertical",
						"aria-label": t.t("COM_SMARTBROWSER_RESIZE_INFO"),
						"aria-valuenow": Math.round(Je.value || Ie.value * .32),
						onPointerdown: Qe,
						onPointermove: $e,
						onPointerup: et,
						onPointercancel: et,
						onKeydown: [r[10] ||= E(T((e) => tt(-16), ["prevent"]), ["left"]), r[11] ||= E(T((e) => tt(16), ["prevent"]), ["right"])],
						onDblclick: r[12] ||= (e) => Je.value = 0
					}, null, 40, Ja)) : I("", !0),
					t.config.selectedResources && t.config.informationPanel !== !1 ? v((f(), S(kr, {
						key: 2,
						"selection-only": "",
						resource: X.value,
						fields: u(i).presentation.infoFields,
						t: t.t,
						address: h.value[u(z)(X.value)] || "",
						"usage-mode": nt.value,
						"usage-definitions": gt.value,
						"usage-values": yt.value,
						"usage-errors": bt.value,
						"usage-editors": u(rt).editors,
						"resolve-reference": st,
						"preview-actions": wt.value,
						"selection-actions": _e.value,
						"allow-add": oe.value && qe.value,
						"allow-quick-add": oe.value && qe.value && !J.value,
						"add-disabled": !ce.value,
						"can-preview": !!ve.value,
						"preview-context": Ct.value,
						"native-preview": t.config.nativePreview,
						onSelectionAdd: le,
						onSelectionAction: r[13] ||= (e) => Te(e, X.value),
						onPreview: r[14] ||= (e) => Te(ve.value, X.value),
						onUsageChange: St
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
						"add-disabled",
						"can-preview",
						"preview-context",
						"native-preview"
					])), [[k, Ue.value]]) : I("", !0),
					X.value && _.value[u(z)(X.value)] ? (f(), g("p", Ya, b(_.value[u(z)(X.value)]), 1)) : I("", !0)
				], 512)), [[k, Ue.value]]) : I("", !0)], 6),
				t.config.showCount !== !1 && !G.value ? (f(), g("footer", Xa, b(t.t("COM_SMARTBROWSER_COLLECTION_TITLE")) + ": " + b(t.model.getItems().length), 1)) : I("", !0)
			]),
			t.config.selectedResources && t.model.canOrder && t.config.multiple !== !1 ? (f(), S(Z, {
				key: 0,
				ref_key: "collectionSort",
				ref: Ae,
				"collection-only": "",
				selection: Y.value,
				adapter: t.config.adapter || "mixed",
				"sort-fields": Ee.value,
				"ordering-available": "",
				t: t.t,
				onApply: je
			}, null, 8, [
				"selection",
				"adapter",
				"sort-fields",
				"t"
			])) : I("", !0),
			L("dialog", {
				ref_key: "addressDialog",
				ref: N,
				class: "resource-batch-preview-dialog sb-address-dialog",
				"aria-label": t.t("COM_SMARTBROWSER_IMPORT_ADDRESSES"),
				onCancel: r[18] ||= T((e) => !U.value && N.value.close(), ["prevent"])
			}, [L("form", { onSubmit: T(ne, ["prevent"]) }, [
				L("label", {
					for: A,
					class: "form-label"
				}, b(t.t("COM_SMARTBROWSER_IMPORT_ADDRESSES")), 1),
				v(L("textarea", {
					id: A,
					"onUpdate:modelValue": r[15] ||= (e) => B.value = e,
					class: "form-control",
					rows: "7",
					maxlength: "4194304",
					disabled: U.value,
					required: ""
				}, null, 8, Qa), [[j, B.value]]),
				t.config.multiple === !1 ? I("", !0) : (f(), g("label", $a, [v(L("input", {
					"onUpdate:modelValue": r[16] ||= (e) => te.value = e,
					type: "checkbox",
					disabled: U.value
				}, null, 8, eo), [[C, te.value]]), n(" " + b(t.t("COM_SMARTBROWSER_ADDRESS_APPEND")), 1)])),
				H.value ? (f(), g("p", to, b(H.value), 1)) : I("", !0),
				L("div", no, [L("button", {
					type: "submit",
					class: "btn btn-primary",
					disabled: U.value
				}, b(t.t("COM_SMARTBROWSER_IMPORT")), 9, ro), L("button", {
					type: "button",
					class: "btn btn-secondary",
					disabled: U.value,
					onClick: r[17] ||= (e) => N.value.close()
				}, b(t.t("JCANCEL")), 9, io)])
			], 32)], 40, Za)
		], 10, Sa));
	}
}, oo = (e, t) => (n, r) => {
	let i = (t) => e === "title" ? String(t.title || "").toLocaleLowerCase() : e === "dimension" ? (t.metadata?.width || 0) * (t.metadata?.height || 0) : t.metadata?.[e], a = i(n), o = i(r), s = typeof a == "string" ? (a || "").localeCompare(o || "") : (a || 0) - (o || 0);
	return t === "asc" ? s : -s;
};
//#endregion
//#region resources/js/core/createBrowserState.js
function so({ options: e, api: t, persistence: n, viewRegistry: r }) {
	let i = e.pickerContext || e.selectionHost, a = !!i?.collectionMode, o = (a || e.mode === "select") && e.multiple === !1 ? 1 : i?.maxSelections ?? e.maxSelections ?? 500, s = a ? i.getCollectionSnapshot() : null, c = !!(a || e.selectionState || e.pickerContext && (Object.keys(e.pickerContext.selectionProfile || {}).length || e.pickerContext.initialSelection?.length)), l = e.adapter?.replace(/^flat-/, ""), u = (e) => a ? {
		...e,
		adapter: l,
		selection: {
			adapter: l,
			id: e.id
		},
		selectionKey: V({
			adapter: l,
			id: e.id
		})
	} : e, d = (t) => a && e.multiple && i.homogeneous && g.selectedIds.length && (g.selectedResources[g.selectedIds[0]]?.selection?.adapter || s.items.find((e) => V(e.selection) === g.selectedIds[0])?.selection.adapter) !== t.selection?.adapter, f = new Set(e.allowedResourceTypes || []), p = (t) => e.mode === "readonly" || d(t) || f.size && !f.has(t.type) ? {
		...t,
		selectable: !1,
		bulkSelectable: !1
	} : t, m = {
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
	}, h = n.load(m);
	h.filters = {
		...h.filters || {},
		...e.initialFilters || {}
	}, Array.isArray(h.hiddenColumns) || (h.hiddenColumns = []), Array.isArray(h.shownColumns) || (h.shownColumns = []), e.currentNode && (h.selectedNode = e.currentNode), e.defaultView && (h.activeView = e.defaultView), r.has(h.activeView) || (h.activeView = "grid");
	let g = _({
		...h,
		roots: e.roots,
		nodes: [],
		items: [],
		contextItems: [],
		breadcrumb: [],
		actions: e.actions,
		presentation: e.presentation || {},
		currentResource: null,
		focusedId: null,
		selectedIds: s ? s.items.map((e) => V(e.selection)) : [],
		selectedResources: s?.resources || {},
		virtualResources: s?.virtualResources || {},
		search: "",
		loading: !1,
		busy: !1,
		error: ""
	}), v = P(() => {
		let t = g.search.trim().toLocaleLowerCase(), n = (e) => !t || [
			e.title,
			e.subtitle,
			e.metadata?.alias
		].some((e) => String(e || "").toLocaleLowerCase().includes(t)), r = g.nodes.map(u).map(Yr).map(p).filter(n), i = (g.presentation.selectionScoped && e.selectionState ? Object.values(g.virtualResources).filter((e) => e && (e.selection?.adapter || e.adapter || l) === l && e.parentId === g.selectedNode) : g.items).map(u).map(Yr).map(p).filter(n), a = g.contextItems.map(Xr);
		return g.sortBy ? [
			...r.sort(oo(g.sortBy, g.sortDirection)),
			...i.sort(oo(g.sortBy, g.sortDirection)),
			...a
		] : [
			...r,
			...i,
			...a
		];
	}), y = P(() => {
		let t = e.selectionTarget || "both";
		return v.value.filter((e) => $r(e, t));
	}), b = P(() => {
		let t = e.selectionTarget || "both";
		return v.value.filter((e) => ei(e, t));
	}), x = P(() => c ? g.selectedIds.map((e) => v.value.find((t) => z(t) === e) || g.selectedResources[e]).filter(Boolean) : v.value.filter((e) => g.selectedIds.includes(z(e)))), S = P(() => v.value.find((e) => z(e) === g.focusedId) || (c ? g.selectedResources[g.focusedId] : null) || null);
	async function C(n = g.selectedNode) {
		g.loading = !0, g.error = "", c || (g.selectedIds = []), g.focusedId = null;
		try {
			let r = await t.getResources(n, {
				search: g.search,
				sortBy: g.sortBy,
				sortDirection: g.sortDirection,
				filters: g.filters
			});
			if (g.selectedNode = n, g.nodes = r.nodes, g.items = r.items, r.presentation?.selectionScoped) for (let e of r.items) {
				let t = u(e);
				g.virtualResources[z(t)] = Yr(t);
			}
			if (c) for (let e of [...r.nodes, ...r.items]) {
				let t = u(e);
				g.selectedIds.includes(z(t)) && (g.selectedResources[z(t)] = p(Yr(t)));
			}
			g.contextItems = r.contextItems || [], g.breadcrumb = r.breadcrumb, g.actions = e.mode === "readonly" ? [] : r.actions, g.presentation = r.presentation || g.presentation, g.sortBy && !(g.presentation.sortFields || []).some((e) => e.id === g.sortBy) && (g.sortBy = "", g.sortDirection = ""), (g.presentation.filters || []).forEach((e) => {
				g.filters[e.id] === void 0 && (g.filters[e.id] = e.default);
			}), g.currentResource = r.currentResource || null;
			let i = new URL(window.location.href);
			i.searchParams.set("node", n), window.history.replaceState({}, "", i);
		} catch (t) {
			if (n !== e.initialNode && [403, 404].includes(t.status)) {
				g.selectedNode = e.initialNode, await C(e.initialNode);
				return;
			}
			g.error = t.message, Joomla.renderMessages({ error: [t.message] });
		} finally {
			g.loading = !1;
		}
	}
	function w(t, n = !0) {
		if (T(t), !$r(t, e.selectionTarget || "both") || d(t)) return;
		let r = z(t);
		c && (g.selectedResources[r] = t);
		let i = g.selectedIds.includes(r);
		!i && e.multiple && n && g.selectedIds.length >= o || (!e.multiple || !n ? g.selectedIds = i ? [] : [r] : g.selectedIds = i ? g.selectedIds.filter((e) => e !== r) : [...g.selectedIds, r]);
	}
	function T(e) {
		Qr(e) && (g.focusedId = z(e));
	}
	function E() {
		c && b.value.forEach((e) => {
			g.selectedResources[z(e)] = e;
		});
		let t = b.value.map(z);
		if (a && !e.multiple) {
			let e = t[0];
			g.selectedIds = e && !g.selectedIds.includes(e) ? [e] : [];
			return;
		}
		let n = g.selectedIds.filter((e) => !t.includes(e)).length, r = Math.min(t.length, Math.max(0, o - n)), i = r > 0 && t.filter((e) => g.selectedIds.includes(e)).length >= r;
		g.selectedIds = i ? g.selectedIds.filter((e) => !t.includes(e)) : [.../* @__PURE__ */ new Set([...g.selectedIds, ...t])].slice(0, o);
	}
	function D() {
		c && b.value.forEach((e) => {
			g.selectedResources[z(e)] = e;
		});
		let e = b.value.map(z), t = new Set(g.selectedIds);
		e.forEach((e) => t.has(e) ? t.delete(e) : t.add(e)), g.selectedIds = [...t].slice(0, o);
	}
	R(() => [
		g.selectedNode,
		g.activeView,
		g.viewOptions,
		g.hiddenColumns,
		g.shownColumns,
		g.sortBy,
		g.sortDirection,
		g.showInfo,
		g.filters
	], () => n.save(g), { deep: !0 });
	function O(t, n) {
		if (e.multiple && g.selectedIds.length >= o || !e.selectionState || e.mode === "readonly" || e.selectionTarget === "node" || f.size && !f.has(n)) return !1;
		let r = g.selectedResources[g.selectedIds[0]]?.selection?.adapter || s?.items.find((e) => V(e.selection) === g.selectedIds[0])?.selection.adapter;
		return !(e.multiple && i?.homogeneous && r && r !== t);
	}
	function k(t) {
		return !(!e.selectionState || e.mode === "readonly" || e.selectionTarget === "node" || f.size && !f.has(t));
	}
	function A(t, n = null) {
		let r = t.adapter || l, i = {
			adapter: r,
			id: t.id
		}, o = a ? V(i) : t.id, c = n ? z(n) : null;
		if (n && !g.selectedIds.includes(c) && !g.virtualResources[c]) throw Error("COM_SMARTBROWSER_LINK_SELECTION_FULL");
		if ((g.selectedIds.includes(o) || g.virtualResources[o]) && o !== c) throw Error("COM_SMARTBROWSER_LINK_DUPLICATE");
		if (t.uniquenessId) for (let e of /* @__PURE__ */ new Set([...g.selectedIds, ...Object.keys(g.virtualResources)])) {
			if (e === c) continue;
			let n = g.virtualResources[e] || g.selectedResources[e], i = n?.selection || (n ? {
				adapter: n.adapter || l,
				id: n.id
			} : s?.items.find((t) => V(t.selection) === e)?.selection);
			if (i?.adapter === r && (i.id === t.uniquenessId || i.id.startsWith(t.uniquenessId + "."))) throw Error("COM_SMARTBROWSER_LINK_DUPLICATE");
		}
		if (!n && !k(t.type)) throw Error("COM_SMARTBROWSER_LINK_SELECTION_FULL");
		let u = Yr({
			...t,
			adapter: r,
			...a ? {
				selection: i,
				selectionKey: o
			} : {}
		});
		return g.selectedResources[o] = u, g.virtualResources[o] = u, g.selectedIds = n ? g.selectedIds.map((e) => e === c ? o : e) : O(r, t.type) ? e.multiple ? [...g.selectedIds, o] : [o] : g.selectedIds, c && c !== o && (delete g.selectedResources[c], delete g.virtualResources[c]), g.focusedId = o, u;
	}
	function j(e) {
		for (let t of e) {
			let e = z(t);
			g.virtualResources[e] && (g.selectedIds = g.selectedIds.filter((t) => t !== e), delete g.selectedResources[e], delete g.virtualResources[e], g.focusedId === e && (g.focusedId = null));
		}
	}
	return t.options && e.selectionState && (t.options.selectionItems = () => [.../* @__PURE__ */ new Set([...g.selectedIds, ...Object.keys(g.virtualResources)])].map((e) => {
		let t = g.virtualResources[e] || g.selectedResources[e];
		return t ? {
			selection: t.selection || {
				adapter: t.adapter || l,
				id: t.id
			},
			usage: {}
		} : s?.items.find((t) => V(t.selection) === e);
	}).filter(Boolean)), {
		state: g,
		resources: v,
		selectableResources: y,
		bulkSelectableResources: b,
		selection: x,
		focusedResource: S,
		load: C,
		focus: T,
		toggle: w,
		selectAll: E,
		invertSelection: D,
		canAddSelection: O,
		canCreateSelectionResource: k,
		replaceSelectionResource: A,
		deleteVirtualResources: j
	};
}
//#endregion
//#region resources/js/core/viewRegistry.js
var co = () => {
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
}, lo = (e) => {
	if (!Array.isArray(e)) throw TypeError("Collection items must be an array.");
	let t = e.map((e) => e && typeof e == "object" ? e.id : e);
	if (t.some((e) => !["string", "number"].includes(typeof e) || String(e) === "")) throw TypeError("Invalid collection identifier.");
	return [...new Set(t.map(String))];
};
function uo({ config: e, api: t, notify: n, translate: r }) {
	let i = e.referenceItems === !0 || !e.adapter || (e.items || []).some((e) => e?.selection || e?.adapter), a = (t) => i ? H(t, e) : lo(t), o = (e) => i ? V(e.selection) : e, c = () => i ? JSON.parse(JSON.stringify(v)) : [...v], l = s(), u = e.viewPreferenceKey || "supjx.smartbrowser.collection.view", d;
	try {
		d = window.localStorage.getItem(u);
	} catch {}
	let f = ["grid", "details"].includes(d) ? d : e.layout === "compact" ? "details" : e.layout || "grid", p = _({
		...e,
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
				window.localStorage.setItem(u, e.activeView);
			} catch {}
		}
	}, h = l.run(() => so({
		options: p,
		api: t,
		persistence: m,
		viewRegistry: co().register({
			id: "grid",
			component: {}
		}).register({
			id: "details",
			component: {}
		})
	})), { state: g } = h, v = a(e.items || []), b = 0, x = !1, S = y(0), C = !e.readOnly, w = C && e.allowRemove !== !1, T = C && e.allowOrdering !== !1, E = (t) => t.map((t) => ({
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
		let n = ++b;
		g.loading = !0, g.error = "";
		try {
			let r = await t.collection(v, i ? {
				referenceItems: !0,
				homogeneous: e.homogeneous === !0
			} : void 0);
			if (x || n !== b) return;
			let s = new Map(i ? v.map((e) => [o(e), e.usage]) : []);
			v = i ? a(r.items).map((e) => ({
				...e,
				usage: s.get(o(e)) || e.usage
			})) : [...r.identifiers], S.value++, g.items = E(r.resources), g.actions = [...r.actions || [], ...g.items.flatMap((e) => e.collectionActions || [])].filter((e, t, n) => n.findIndex((t) => t.id === e.id) === t && e.requiresSelection && !e.currentNode && ![
				"reorder",
				"removeFromGroup",
				"batch",
				"activate",
				"select"
			].includes(e.id)), g.presentation = r.presentation || {}, p.visualSettings = r.visualSettings, p.imageBackground = r.imageBackground, g.selectedIds = g.selectedIds.filter((e) => v.some((t) => o(t) === e));
		} catch (e) {
			if (!x && n === b) throw g.error = e.message, e;
		} finally {
			!x && n === b && (g.loading = !1);
		}
	}
	async function k(e, { resolvedResources: t, reason: n } = {}) {
		if (x) throw Error("Collection is destroyed.");
		let r = a(e);
		if (t) {
			if (!C || g.busy || g.loading) throw Error("The collection cannot be changed now.");
			let e = new Map(t.map((e) => [z(e), e]));
			if (r.some((t) => !e.has(o(t)))) throw TypeError("Incomplete resolved collection.");
			++b, v = r, S.value++, g.items = E(r.map((t) => e.get(o(t)))), g.selectedIds = [], g.error = "", g.sortBy = "collectionOrder", g.sortDirection = "asc", n && D(n);
			return;
		}
		let s = i && r.length === v.length && r.every((e, t) => o(e) === o(v[t]));
		v = r, S.value++, (!s || g.items.length !== v.length || g.error) && (g.selectedIds = [], g.items = [], g.sortBy = "collectionOrder", g.sortDirection = "asc", await O());
	}
	function A(e) {
		if (!w || x || g.loading || g.busy) return;
		++b;
		let t = new Set(e), n = v.filter((e) => !t.has(o(e)));
		n.length !== v.length && (v = n, S.value++, g.items = g.items.filter((e) => !t.has(z(e))), g.selectedIds = g.selectedIds.filter((e) => !t.has(e)), D("remove"));
	}
	async function j(n, r = g.selectedIds) {
		if (!T || x || g.busy || g.loading || !r.length || !["up", "down"].includes(n) || g.sortBy && g.sortBy !== "collectionOrder") return;
		let s = ++b;
		g.busy = !0;
		try {
			let c = g.sortDirection === "desc" ? n === "up" ? "down" : "up" : n, l = await t.collection(v, {
				...i ? {
					referenceItems: !0,
					homogeneous: e.homogeneous === !0
				} : {},
				operation: "reorder",
				selection: [...r],
				direction: c
			});
			if (x || s !== b) return;
			v = a(l.items), S.value++;
			let u = new Map(g.items.map((e) => [z(e), e]));
			g.items = v.map((e) => u.get(o(e))).filter(Boolean), D("reorder");
		} catch (e) {
			!x && s === b && (g.error = e.message);
		} finally {
			x || (g.busy = !1);
		}
	}
	return {
		options: p,
		browser: h,
		resources: l.run(() => P(() => g.sortBy === "collectionOrder" ? g.sortDirection === "desc" ? [...g.items].reverse() : g.items : e.selectedResources ? g.items : h.resources.value)),
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
			if (!Array.isArray(e) || e.length !== v.length || new Set(e).size !== v.length || e.some((e) => !v.some((t) => o(t) === e))) throw TypeError("Invalid collection order.");
			let t = new Map(v.map((e) => [o(e), e]));
			v = e.map((e) => t.get(e));
			let n = new Map(g.items.map((e) => [z(e), e]));
			g.items = e.map((e) => n.get(e)).filter(Boolean), S.value++, D("reorder");
		},
		setUsage(e, t) {
			if (!C || x || !i || g.loading || g.busy) return;
			let n = z(e);
			v = v.map((e) => o(e) === n ? {
				...e,
				usage: JSON.parse(JSON.stringify(t))
			} : e), S.value++, D("usage");
		},
		getItems: c,
		async addItems(e) {
			await k(a([...v, ...e])), D("add");
		},
		destroy() {
			x = !0, b++, t.destroy?.(), l.stop();
		}
	};
}
//#endregion
export { en as C, Hn as S, Z as T, Kr as _, xa as a, Nr as b, ia as c, ai as d, ii as f, $r as g, Yr as h, ao as i, na as l, ni as m, co as n, ba as o, ri as p, so as r, ya as s, uo as t, Ci as u, Br as v, Ut as w, kr as x, Lr as y };
