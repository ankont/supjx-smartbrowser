import { r as e, t } from "./visual-runtime-1h24eaHt.js?v=3.6.22";
import { mountCollection as n } from "./collection.js?v=3.6.22";
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
	let t = e.querySelector("[data-sb-value]"), a = t.value, c = JSON.parse(e.dataset.sbField), l = e.closest(".control-group"), u = l?.querySelector(":scope > .control-label"), d = u?.hidden;
	c.showLabel === !1 && u && (u.hidden = !0), c.fullWidth === !0 && l?.classList.add("sb-selection-full-width");
	let f = c.allowedAdapters || [c.adapter], p = (e) => window.Joomla?.Text?._(e, e) || e, m = e.querySelector("[data-sb-error]"), h = (e) => {
		m.textContent = e ? p("PLG_FIELDS_SMARTBROWSERPICKER_INVALID") : "", m.hidden = !e;
	}, g, _ = !1, v = !1;
	try {
		g = r(t.value, f, c.multiple, c.homogeneous);
	} catch (e) {
		g = r("", f), h(e);
	}
	let y = () => {
		t.value = g.items.length ? JSON.stringify(g) : "", t.dispatchEvent(new Event("change", { bubbles: !0 })), h(null);
	}, b, x = async () => b ? b.setItems(g.items) : (b = n(e.querySelector("[data-sb-collection]"), {
		...c,
		referenceItems: !0,
		items: g.items,
		layout: c.editorDisplay === "compact" ? "compact" : "grid",
		readOnly: c.readOnly,
		allowOrdering: c.multiple && c.ordering,
		allowRemove: !c.readOnly,
		contextActions: !1,
		onAdd: () => w(),
		selectedResources: !0,
		informationPanel: c.informationPanel !== !1,
		onReplace: (e) => w(e),
		defaultResourceActionId: "collectionReplace",
		onChange(e) {
			g = r({
				version: 1,
				items: e.items
			}, f, c.multiple, c.homogeneous), y();
		},
		onError: h
	}), b.ready);
	x().catch(h);
	let S = e.querySelector("[data-sb-select]"), C = e.querySelector("[data-sb-clear]");
	async function w(e = null) {
		if (c.readOnly || v || _) return;
		v = !0, S && (S.disabled = !0);
		let n = g;
		try {
			let r = e?.selection.adapter || n.items[0]?.selection.adapter || f[0], a = e ? n.items.find((t) => t.selection.adapter === e.selection.adapter && t.selection.id === e.id) : c.multiple ? null : n.items[0], s = { ...c.selectionProfile };
			if (c.preserveUsageOnReplace && a) for (let [e, t] of Object.entries(s)) t !== !1 && Object.prototype.hasOwnProperty.call(a.usage, e) && (s[e] = {
				...typeof t == "object" ? t : {},
				default: a.usage[e]
			});
			let l = await window.SmartBrowserPicker.open({
				...c,
				url: c.pickerUrl,
				adapter: r,
				selectionProfile: s,
				selectionEditorContext: {
					...c.selectionEditorContext,
					suggestions: {
						...c.selectionEditorContext?.suggestions,
						anchors: o(t.form, c.anchorSuggestions)
					},
					phoneCountryPrefix: c.phoneCountryPrefix || ""
				},
				browseRoot: r === c.adapter ? c.browseRoot : "",
				allowedAdapters: f,
				homogeneous: c.multiple && c.homogeneous,
				multiple: !e && c.multiple,
				resultFormat: "collection",
				initialNode: e?.parentId || "",
				initialCollection: e ? n.items.filter((t) => t.selection.adapter === e.selection.adapter && t.selection.id === e.id) : n.items
			});
			if (!l || _ || n !== g) return;
			let u = i(n, l, f, c.multiple, e?.selection, c.homogeneous);
			if (c.maxSelections && u.items.length > c.maxSelections) throw Error("Selection limit exceeded.");
			g = u, y(), await x();
		} catch (e) {
			_ || h(e);
		} finally {
			v = !1, S && (S.disabled = c.readOnly);
		}
	}
	let T = () => w(), E = () => {
		c.readOnly || _ || (g = r("", f), y(), x().catch(h));
	}, D = () => setTimeout(() => {
		if (!_) {
			t.value = a;
			try {
				g = r(t.value, f, c.multiple, c.homogeneous), x().catch(h), h(null);
			} catch (e) {
				h(e);
			}
		}
	}, 0);
	S?.addEventListener("click", T), C?.addEventListener("click", E), t.form?.addEventListener("reset", D);
	let O = {
		addToolbarButton: (e) => b.addToolbarButton(e),
		attachPreview: (e) => b.attachPreview(e),
		destroy() {
			_ || (_ = !0, S?.removeEventListener("click", T), C?.removeEventListener("click", E), t.form?.removeEventListener("reset", D), u && (u.hidden = d), c.fullWidth === !0 && l?.classList.remove("sb-selection-full-width"), b.destroy(), s.delete(e));
		}
	};
	return s.set(e, O), O.setNativeAddress = (e) => b.setNativeAddress(e), O.setItems = (e) => {
		if (!(_ || c.readOnly)) return g = r({
			version: 1,
			items: e
		}, f, c.multiple, c.homogeneous), y(), x();
	}, O;
}
var l = (e) => {
	e.matches?.("[data-sb-field]") && c(e), e.querySelectorAll?.("[data-sb-field]").forEach(c);
};
window.SmartBrowser = {
	...window.SmartBrowser,
	mountSelectionField: c
}, l(document), document.addEventListener("joomla:updated", (e) => l(e.target));
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
export { c as t };
