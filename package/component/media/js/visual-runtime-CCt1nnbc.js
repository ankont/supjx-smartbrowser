import { t as e } from "./visual-runtime-9kQymmoE.js?v=5.2.0";
//#region resources/js/core/selectionIdentity.js
function t(e) {
	return !e || typeof e != "object" || Array.isArray(e) || typeof e.adapter != "string" || !/^[a-z][a-z0-9-]*$/.test(e.adapter) || typeof e.id != "string" || !e.id || e.id.length > 2048 ? null : {
		adapter: e.adapter,
		id: e.id
	};
}
var n = (e) => JSON.stringify([e.adapter, e.id]), r = (e) => e?.selectionKey || e?.id, i = (e, n) => t(e?.selection || {
	adapter: e?.adapter || n,
	id: e?.id
});
function a(e, { adapter: r, allowedAdapters: i = [], homogeneous: a = !1, maxSelections: o = 500 } = {}) {
	if (!Number.isInteger(o) || o < 1 || o > 500) throw TypeError("Invalid selection limit.");
	if (!Array.isArray(e) || e.length > 500) throw TypeError("A collection supports at most 500 entries.");
	let s = /* @__PURE__ */ new Set(), c = e.map((e) => {
		let n = t(e?.selection || (e && typeof e == "object" ? {
			adapter: e.adapter || r,
			id: String(e.id)
		} : {
			adapter: r,
			id: String(e)
		}));
		if (!n || !n.id.includes(":") || i.length && !i.includes(n.adapter)) throw TypeError("Invalid or disallowed collection reference.");
		let a = e?.usage ?? {};
		if (!a || typeof a != "object" || Array.isArray(a) || Object.keys(a).length > 100 || Object.keys(a).some((e) => !/^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/.test(e)) || JSON.stringify(a).length > 65536) throw TypeError("Invalid collection usage.");
		return {
			selection: n,
			usage: JSON.parse(JSON.stringify(a))
		};
	}).filter((e) => {
		let t = e.selection, r = n(/^uri:[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)?$/.test(t.id) ? {
			...t,
			id: t.id.split(".")[0]
		} : t);
		return !s.has(r) && (s.add(r), !0);
	});
	if (a && new Set(c.map((e) => e.selection.adapter)).size > 1) throw TypeError("This collection requires one adapter.");
	if (c.length > o) throw TypeError("Selection limit exceeded.");
	return c;
}
//#endregion
//#region resources/js/core/pageScrollLock.js
var o = /* @__PURE__ */ new WeakMap();
function s(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	for (; e && !n.has(e);) {
		n.add(e);
		let r = [e.documentElement, e.body].filter((e) => e?.classList);
		if (r.length) {
			let n = o.get(e);
			n || (n = {
				count: 0,
				elements: r.map((e) => ({
					element: e,
					existed: e.classList.contains("sb-modal-scroll-locked")
				}))
			}, o.set(e, n)), n.count++, n.elements.forEach(({ element: e }) => e.classList.add("sb-modal-scroll-locked")), t.push(e);
		}
		try {
			e = e.defaultView?.frameElement?.ownerDocument;
		} catch {
			break;
		}
	}
	let r = !1;
	return () => {
		r || (r = !0, t.forEach((e) => {
			let t = o.get(e);
			--t.count || (t.elements.forEach(({ element: e, existed: t }) => {
				t || e.classList.remove("sb-modal-scroll-locked");
			}), o.delete(e));
		}));
	};
}
//#endregion
//#region resources/js/core/editorSize.js
var c = "smartbrowser.editorMaximized";
function l(t, n, r, i = c) {
	let a;
	try {
		a = e(t.ownerDocument.defaultView);
	} catch {}
	let o = !1, l, u = (e, c = !0) => {
		if (o = e, t.classList.toggle("is-maximized", e), e && !l && (l = s(t.ownerDocument)), !e && l && (l(), l = null), c) try {
			a?.setItem(i, String(e));
		} catch {}
		if (!n) return;
		n.setAttribute("aria-pressed", String(e));
		let u = r(e ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE");
		n.title = u, n.setAttribute("aria-label", u), n.querySelector("span").className = e ? "fas fa-compress" : "fas fa-expand";
	};
	try {
		o = a?.getItem(i) === "true";
	} catch {}
	u(o, !1);
	let d = () => u(!o);
	return n?.addEventListener("click", d), {
		toggle() {
			return u(!o), o;
		},
		isMaximized() {
			return o;
		},
		bind(e) {
			n?.removeEventListener("click", d), n = e, u(o, !1), n?.addEventListener("click", d);
		},
		destroy() {
			n?.removeEventListener("click", d), l?.(), l = null;
		}
	};
}
//#endregion
export { r as a, n as i, a as n, i as o, t as r, l as t };
