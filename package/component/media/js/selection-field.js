import { i as e, n as t } from "./visual-runtime-BjkbZE8K.js";
import { mountCollection as n } from "./collection.js";
//#region resources/js/core/selectionFieldValue.js
function r(e, n, r = !0, i = !1) {
	if (e === "" || e == null) return {
		version: 1,
		items: []
	};
	if (typeof e == "string" && e.length > 262144) throw TypeError("Field value too large.");
	let a = typeof e == "string" ? JSON.parse(e) : e;
	if (a?.version !== 1) throw TypeError("Invalid SmartBrowser field version.");
	let o = a.items || a.selection?.map((e) => ({
		selection: e,
		usage: a.usage?.[e.id] || {}
	})), s = t(o, {
		allowedAdapters: Array.isArray(n) ? n : n ? [n] : [],
		homogeneous: i
	});
	if (s.length !== o.length || !r && s.length > 1) throw TypeError("Invalid SmartBrowser field selection.");
	return {
		version: 1,
		items: s
	};
}
function i(n, i, a, o, s = null, c = !1) {
	let l = i.items || (Array.isArray(i.selection) ? i.selection : [i.selection]).map((e) => ({
		selection: {
			adapter: i.adapter || n.items[0]?.selection.adapter || (Array.isArray(a) ? a[0] : a),
			id: e.id
		},
		usage: i.usage?.[e.id] || {}
	})), u = s ? n.items.flatMap((t) => e(t.selection) === e(s) ? l : [t]) : l;
	return r({
		version: 1,
		items: t(u)
	}, a, o, c);
}
//#endregion
//#region resources/js/core/articleAnchors.js
function a(e, t = "none") {
	if (!["anchors", "all"].includes(t)) return [];
	let n = /* @__PURE__ */ new Set();
	for (let r of e.querySelectorAll(t === "all" ? "[id], a[name]" : "a[name], a[id]:not([href])")) {
		let e = r.getAttribute("id"), i = r.localName === "a" ? r.getAttribute("name") : null;
		e && (t === "all" || !r.hasAttribute("href")) && n.add(e), i && n.add(i);
	}
	return [...n];
}
function o(e, t, n = window.Joomla?.editors?.instances) {
	if (!["anchors", "all"].includes(t)) return [];
	let r = e?.elements.namedItem("jform[articletext]");
	if (!r || typeof r.value != "string") return [];
	try {
		let e = n?.[r.id], i = typeof e?.getValue == "function" ? e.getValue() : r.value;
		if (typeof i != "string") return [];
		let o = document.createElement("template");
		return o.innerHTML = i, a(o.content, t);
	} catch {
		return [];
	}
}
//#endregion
//#region resources/js/selection-field.js
var s = /* @__PURE__ */ new WeakMap();
function c(e) {
	if (s.has(e)) return s.get(e);
	let t = e.querySelector("[data-sb-value]"), a = t.value, c = JSON.parse(e.dataset.sbField), l = c.allowedAdapters || [c.adapter], u = (e) => window.Joomla?.Text?._(e, e) || e, d = e.querySelector("[data-sb-error]"), f = (e) => {
		d.textContent = e ? u("PLG_FIELDS_SMARTBROWSERPICKER_INVALID") : "", d.hidden = !e;
	}, p, m = !1, h = !1;
	try {
		p = r(t.value, l, c.multiple, c.homogeneous);
	} catch (e) {
		p = r("", l), f(e);
	}
	let g = () => {
		t.value = p.items.length ? JSON.stringify(p) : "", t.dispatchEvent(new Event("change", { bubbles: !0 })), f(null);
	}, _, v = async () => _ ? _.setItems(p.items) : (_ = n(e.querySelector("[data-sb-collection]"), {
		...c,
		referenceItems: !0,
		items: p.items,
		layout: c.editorDisplay === "compact" ? "compact" : "grid",
		readOnly: c.readOnly,
		allowOrdering: c.multiple && c.ordering,
		allowRemove: !c.readOnly,
		contextActions: !1,
		onAdd: () => x(),
		resourceActions: [{
			id: "selectionUsageEdit",
			label: "PLG_FIELDS_SMARTBROWSERPICKER_EDIT",
			icon: "fas fa-pen",
			requiresSelection: !0
		}],
		defaultResourceActionId: "selectionUsageEdit",
		onResourceAction: (e, t) => x(t),
		onChange(e) {
			p = r({
				version: 1,
				items: e.items
			}, l, c.multiple, c.homogeneous), g();
		},
		onError: f
	}), _.ready);
	v().catch(f);
	let y = e.querySelector("[data-sb-select]"), b = e.querySelector("[data-sb-clear]");
	async function x(e = null) {
		if (c.readOnly || h || m) return;
		h = !0, y && (y.disabled = !0);
		let n = p;
		try {
			let r = e?.selection.adapter || n.items[0]?.selection.adapter || l[0], a = await window.SmartBrowserPicker.open({
				...c,
				url: c.pickerUrl,
				adapter: r,
				selectionEditorContext: {
					...c.selectionEditorContext,
					suggestions: {
						...c.selectionEditorContext?.suggestions,
						anchors: o(t.form, c.anchorSuggestions)
					},
					phoneCountryPrefix: c.phoneCountryPrefix || ""
				},
				browseRoot: r === c.adapter ? c.browseRoot : "",
				allowedAdapters: l,
				homogeneous: c.multiple && c.homogeneous,
				multiple: !e && c.multiple,
				resultFormat: "collection",
				initialNode: e?.parentId || "",
				initialCollection: e ? n.items.filter((t) => t.selection.adapter === e.selection.adapter && t.selection.id === e.id) : n.items
			});
			if (!a || m || n !== p) return;
			p = i(n, a, l, c.multiple, e?.selection, c.homogeneous), g(), await v();
		} catch (e) {
			m || f(e);
		} finally {
			h = !1, y && (y.disabled = c.readOnly);
		}
	}
	let S = () => x(), C = () => {
		c.readOnly || m || (p = r("", l), g(), v().catch(f));
	}, w = () => setTimeout(() => {
		if (!m) {
			t.value = a;
			try {
				p = r(t.value, l, c.multiple, c.homogeneous), v().catch(f), f(null);
			} catch (e) {
				f(e);
			}
		}
	}, 0);
	y?.addEventListener("click", S), b?.addEventListener("click", C), t.form?.addEventListener("reset", w);
	let T = { destroy() {
		m || (m = !0, y?.removeEventListener("click", S), b?.removeEventListener("click", C), t.form?.removeEventListener("reset", w), _.destroy(), s.delete(e));
	} };
	return s.set(e, T), T;
}
var l = (e) => {
	e.matches?.("[data-sb-field]") && c(e), e.querySelectorAll?.("[data-sb-field]").forEach(c);
};
l(document), document.addEventListener("joomla:updated", (e) => l(e.target));
var u = new MutationObserver((e) => e.forEach((e) => {
	e.removedNodes.forEach((e) => {
		e.nodeType === 1 && [e, ...e.querySelectorAll("[data-sb-field]")].forEach((e) => {
			e.isConnected || s.get(e)?.destroy();
		});
	}), e.addedNodes.forEach((e) => {
		e.nodeType === 1 && l(e);
	});
}));
u.observe(document.body, {
	childList: !0,
	subtree: !0
}), window.addEventListener("pagehide", () => {
	u.disconnect(), document.querySelectorAll("[data-sb-field]").forEach((e) => s.get(e)?.destroy());
}, { once: !0 });
//#endregion
export { c as mountSelectionField };
