//#region resources/js/core/selectionIdentity.js
function e(e) {
	return !e || typeof e != "object" || Array.isArray(e) || typeof e.adapter != "string" || !/^[a-z][a-z0-9-]*$/.test(e.adapter) || typeof e.id != "string" || !e.id || e.id.length > 2048 ? null : {
		adapter: e.adapter,
		id: e.id
	};
}
var t = (e) => JSON.stringify([e.adapter, e.id]), n = (e) => e?.selectionKey || e?.id, r = (t, n) => e(t?.selection || {
	adapter: t?.adapter || n,
	id: t?.id
});
function i(n, { adapter: r, allowedAdapters: i = [], homogeneous: a = !1 } = {}) {
	if (!Array.isArray(n) || n.length > 500) throw TypeError("A collection supports at most 500 entries.");
	let o = /* @__PURE__ */ new Set(), s = n.map((t) => {
		let n = e(t?.selection || (t && typeof t == "object" ? {
			adapter: t.adapter || r,
			id: String(t.id)
		} : {
			adapter: r,
			id: String(t)
		}));
		if (!n || !n.id.includes(":") || i.length && !i.includes(n.adapter)) throw TypeError("Invalid or disallowed collection reference.");
		let a = t?.usage ?? {};
		if (!a || typeof a != "object" || Array.isArray(a) || Object.keys(a).length > 100 || Object.keys(a).some((e) => !/^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/.test(e)) || JSON.stringify(a).length > 65536) throw TypeError("Invalid collection usage.");
		return {
			selection: n,
			usage: JSON.parse(JSON.stringify(a))
		};
	}).filter((e) => {
		let n = t(e.selection);
		return !o.has(n) && (o.add(n), !0);
	});
	if (a && new Set(s.map((e) => e.selection.adapter)).size > 1) throw TypeError("This collection requires one adapter.");
	return s;
}
//#endregion
//#region resources/js/core/pageScrollLock.js
var a = /* @__PURE__ */ new WeakMap();
function o(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	for (; e && !n.has(e);) {
		n.add(e);
		let r = [e.documentElement, e.body].filter((e) => e?.classList);
		if (r.length) {
			let n = a.get(e);
			n || (n = {
				count: 0,
				elements: r.map((e) => ({
					element: e,
					existed: e.classList.contains("sb-modal-scroll-locked")
				}))
			}, a.set(e, n)), n.count++, n.elements.forEach(({ element: e }) => e.classList.add("sb-modal-scroll-locked")), t.push(e);
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
			let t = a.get(e);
			--t.count || (t.elements.forEach(({ element: e, existed: t }) => {
				t || e.classList.remove("sb-modal-scroll-locked");
			}), a.delete(e));
		}));
	};
}
//#endregion
//#region resources/js/core/editorSize.js
var s = "smartbrowser.editorMaximized";
function c(e, t, n, r = s) {
	let i;
	try {
		i = e.ownerDocument.defaultView.localStorage;
	} catch {}
	let a = !1, c, l = (s, l = !0) => {
		if (a = s, e.classList.toggle("is-maximized", s), s && !c && (c = o(e.ownerDocument)), !s && c && (c(), c = null), l) try {
			i?.setItem(r, String(s));
		} catch {}
		if (!t) return;
		t.setAttribute("aria-pressed", String(s));
		let u = n(s ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE");
		t.title = u, t.setAttribute("aria-label", u), t.querySelector("span").className = s ? "fas fa-compress" : "fas fa-expand";
	};
	try {
		a = i?.getItem(r) === "true";
	} catch {}
	l(a, !1);
	let u = () => l(!a);
	return t?.addEventListener("click", u), {
		toggle() {
			return l(!a), a;
		},
		isMaximized() {
			return a;
		},
		bind(e) {
			t?.removeEventListener("click", u), t = e, l(a, !1), t?.addEventListener("click", u);
		},
		destroy() {
			t?.removeEventListener("click", u), c?.(), c = null;
		}
	};
}
//#endregion
export { n as a, t as i, i as n, r as o, e as r, c as t };
