import { i as e, n as t } from "./visual-runtime-BpJbHzSM.js";
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
//#region resources/js/selection-field.js
var a = /* @__PURE__ */ new WeakMap();
function o(e) {
	if (a.has(e)) return a.get(e);
	let t = e.querySelector("[data-sb-value]"), o = t.value, s = JSON.parse(e.dataset.sbField), c = s.allowedAdapters || [s.adapter], l = (e) => window.Joomla?.Text?._(e, e) || e, u = e.querySelector("[data-sb-error]"), d = (e) => {
		u.textContent = e ? l("PLG_FIELDS_SMARTBROWSERPICKER_INVALID") : "", u.hidden = !e;
	}, f, p = !1, m = !1;
	try {
		f = r(t.value, c, s.multiple, s.homogeneous);
	} catch (e) {
		f = r("", c), d(e);
	}
	let h = () => {
		t.value = f.items.length ? JSON.stringify(f) : "", t.dispatchEvent(new Event("change", { bubbles: !0 })), d(null);
	}, g, _ = async () => g ? g.setItems(f.items) : (g = n(e.querySelector("[data-sb-collection]"), {
		...s,
		referenceItems: !0,
		items: f.items,
		layout: s.editorDisplay === "compact" ? "compact" : "grid",
		readOnly: s.readOnly,
		allowOrdering: s.multiple && s.ordering,
		allowRemove: !s.readOnly,
		contextActions: !1,
		onAdd: () => b(),
		resourceActions: [{
			id: "selectionUsageEdit",
			label: "PLG_FIELDS_SMARTBROWSERPICKER_EDIT",
			icon: "fas fa-pen",
			requiresSelection: !0
		}],
		defaultResourceActionId: "selectionUsageEdit",
		onResourceAction: (e, t) => b(t),
		onChange(e) {
			f = r({
				version: 1,
				items: e.items
			}, c, s.multiple, s.homogeneous), h();
		},
		onError: d
	}), g.ready);
	_().catch(d);
	let v = e.querySelector("[data-sb-select]"), y = e.querySelector("[data-sb-clear]");
	async function b(e = null) {
		if (s.readOnly || m || p) return;
		m = !0, v && (v.disabled = !0);
		let t = f;
		try {
			let n = e?.selection.adapter || t.items[0]?.selection.adapter || c[0], r = await window.SmartBrowserPicker.open({
				...s,
				url: s.pickerUrl,
				adapter: n,
				browseRoot: n === s.adapter ? s.browseRoot : "",
				allowedAdapters: c,
				homogeneous: s.multiple && s.homogeneous,
				multiple: !e && s.multiple,
				resultFormat: "collection",
				initialNode: e?.parentId || "",
				initialCollection: e ? t.items.filter((t) => t.selection.adapter === e.selection.adapter && t.selection.id === e.id) : t.items
			});
			if (!r || p || t !== f) return;
			f = i(t, r, c, s.multiple, e?.selection, s.homogeneous), h(), await _();
		} catch (e) {
			p || d(e);
		} finally {
			m = !1, v && (v.disabled = s.readOnly);
		}
	}
	let x = () => b(), S = () => {
		s.readOnly || p || (f = r("", c), h(), _().catch(d));
	}, C = () => setTimeout(() => {
		if (!p) {
			t.value = o;
			try {
				f = r(t.value, c, s.multiple, s.homogeneous), _().catch(d), d(null);
			} catch (e) {
				d(e);
			}
		}
	}, 0);
	v?.addEventListener("click", x), y?.addEventListener("click", S), t.form?.addEventListener("reset", C);
	let w = { destroy() {
		p || (p = !0, v?.removeEventListener("click", x), y?.removeEventListener("click", S), t.form?.removeEventListener("reset", C), g.destroy(), a.delete(e));
	} };
	return a.set(e, w), w;
}
var s = (e) => {
	e.matches?.("[data-sb-field]") && o(e), e.querySelectorAll?.("[data-sb-field]").forEach(o);
};
s(document), document.addEventListener("joomla:updated", (e) => s(e.target));
var c = new MutationObserver((e) => e.forEach((e) => {
	e.removedNodes.forEach((e) => {
		e.nodeType === 1 && [e, ...e.querySelectorAll("[data-sb-field]")].forEach((e) => {
			e.isConnected || a.get(e)?.destroy();
		});
	}), e.addedNodes.forEach((e) => {
		e.nodeType === 1 && s(e);
	});
}));
c.observe(document.body, {
	childList: !0,
	subtree: !0
}), window.addEventListener("pagehide", () => {
	c.disconnect(), document.querySelectorAll("[data-sb-field]").forEach((e) => a.get(e)?.destroy());
}, { once: !0 });
//#endregion
export { o as mountSelectionField };
