import { n as e, t } from "./visual-runtime-C8QgQ5Tx.js?v=4.0.0";
//#region resources/js/core/articleAnchors.js
function n(e, t = "none") {
	if (!["anchors", "all"].includes(t)) return [];
	let n = /* @__PURE__ */ new Set();
	for (let r of e.querySelectorAll(t === "all" ? "[id], a[name]" : "a[name], a[id]:not([href])")) {
		let e = r.getAttribute("id"), i = r.localName === "a" ? r.getAttribute("name") : null;
		e && (t === "all" || !r.hasAttribute("href")) && n.add(e), i && n.add(i);
	}
	return [...n];
}
function r(e, t, r = window.Joomla?.editors?.instances) {
	if (!["anchors", "all"].includes(t)) return [];
	let i = e?.elements.namedItem("jform[articletext]");
	if (!i || typeof i.value != "string") return [];
	try {
		let e = r?.[i.id], a = typeof e?.getValue == "function" ? e.getValue() : i.value;
		if (typeof a != "string") return [];
		let o = document.createElement("template");
		return o.innerHTML = a, n(o.content, t);
	} catch {
		return [];
	}
}
//#endregion
//#region resources/js/selection-field.js
var i = /* @__PURE__ */ new WeakMap();
function a(n) {
	if (i.has(n)) return i.get(n);
	let a = n.querySelector("[data-sb-value]"), o = a.value, s = JSON.parse(n.dataset.sbField), c = n.closest(".control-group"), l = c?.querySelector(":scope > .control-label"), u = l?.hidden;
	s.showLabel === !1 && l && (l.hidden = !0), s.fullWidth === !0 && c?.classList.add("sb-selection-full-width");
	let d = s.allowedAdapters || [s.adapter], f = (e) => window.Joomla?.Text?._(e, e) || e, p = n.querySelector("[data-sb-error]"), m = (e) => {
		p.textContent = e ? f("PLG_FIELDS_SMARTBROWSERPICKER_INVALID") : "", p.hidden = !e;
	}, h, g = !1;
	try {
		h = e(a.value, d, s.multiple, s.homogeneous);
	} catch (t) {
		h = e("", d), m(t);
	}
	let _ = () => {
		a.value = h.items.length ? JSON.stringify(h) : "", a.dispatchEvent(new Event("change", { bubbles: !0 })), m(null);
	}, v, y = async () => v ? v.setItems(h.items) : (v = t(n.querySelector("[data-sb-collection]"), {
		...s,
		referenceItems: !0,
		items: h.items,
		layout: s.editorDisplay === "compact" ? "compact" : "grid",
		readOnly: s.readOnly,
		allowOrdering: s.multiple && s.ordering,
		allowRemove: !s.readOnly,
		contextActions: !1,
		selectedResources: !0,
		informationPanel: s.informationPanel !== !1,
		pickerOptions: () => ({ selectionEditorContext: {
			...s.selectionEditorContext,
			suggestions: {
				...s.selectionEditorContext?.suggestions,
				anchors: r(a.form, s.anchorSuggestions)
			},
			phoneCountryPrefix: s.phoneCountryPrefix || ""
		} }),
		defaultResourceActionId: "collectionReplace",
		onChange(t) {
			h = e({
				version: 1,
				items: t.items
			}, d, s.multiple, s.homogeneous), _();
		},
		onError: m
	}), v.ready);
	y().catch(m);
	let b = n.querySelector("[data-sb-select]"), x = n.querySelector("[data-sb-clear]"), S = async () => {
		if (!(s.readOnly || g || b?.disabled)) {
			b && (b.disabled = !0);
			try {
				await v.editSelection();
			} catch (e) {
				g || m(e);
			} finally {
				b && !g && (b.disabled = s.readOnly);
			}
		}
	}, C = () => {
		s.readOnly || g || (h = e("", d), _(), y().catch(m));
	}, w = () => setTimeout(() => {
		if (!g) {
			a.value = o;
			try {
				h = e(a.value, d, s.multiple, s.homogeneous), y().catch(m), m(null);
			} catch (e) {
				m(e);
			}
		}
	}, 0);
	b?.addEventListener("click", S), x?.addEventListener("click", C), a.form?.addEventListener("reset", w);
	let T = {
		addToolbarButton: (e) => v.addToolbarButton(e),
		attachPreview: (e) => v.attachPreview(e),
		destroy() {
			g || (g = !0, b?.removeEventListener("click", S), x?.removeEventListener("click", C), a.form?.removeEventListener("reset", w), l && (l.hidden = u), s.fullWidth === !0 && c?.classList.remove("sb-selection-full-width"), v.destroy(), i.delete(n));
		}
	};
	return i.set(n, T), T.setNativeAddress = (e) => v.setNativeAddress(e), T.exportAddresses = (e) => v.exportAddresses(e), T.importAddresses = (e, t) => v.importAddresses(e, t), T.setItems = (t) => {
		if (!(g || s.readOnly)) return h = e({
			version: 1,
			items: t
		}, d, s.multiple, s.homogeneous), _(), y();
	}, T;
}
var o = (e) => {
	e.matches?.("[data-sb-field]") && a(e), e.querySelectorAll?.("[data-sb-field]").forEach(a);
};
window.SmartBrowser = {
	...window.SmartBrowser,
	mountSelectionField: a
}, o(document), document.addEventListener("joomla:updated", (e) => o(e.target));
var s = new MutationObserver((e) => e.forEach((e) => {
	e.removedNodes.forEach((e) => {
		e.nodeType === 1 && [e, ...e.querySelectorAll("[data-sb-field]")].forEach((e) => {
			e.isConnected || i.get(e)?.destroy();
		});
	}), e.addedNodes.forEach((e) => {
		e.nodeType === 1 && o(e);
	});
}));
s.observe(document.body, {
	childList: !0,
	subtree: !0
}), window.addEventListener("pagehide", () => {
	s.disconnect(), document.querySelectorAll("[data-sb-field]").forEach((e) => i.get(e)?.destroy());
}, { once: !0 });
//#endregion
export { a as t };
