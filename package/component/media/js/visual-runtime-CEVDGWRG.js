//#region resources/js/core/pageScrollLock.js
var e = /* @__PURE__ */ new WeakMap();
function t(t) {
	let n = [], r = /* @__PURE__ */ new Set();
	for (; t && !r.has(t);) {
		r.add(t);
		let i = [t.documentElement, t.body].filter((e) => e?.classList);
		if (i.length) {
			let r = e.get(t);
			r || (r = {
				count: 0,
				elements: i.map((e) => ({
					element: e,
					existed: e.classList.contains("sb-modal-scroll-locked")
				}))
			}, e.set(t, r)), r.count++, r.elements.forEach(({ element: e }) => e.classList.add("sb-modal-scroll-locked")), n.push(t);
		}
		try {
			t = t.defaultView?.frameElement?.ownerDocument;
		} catch {
			break;
		}
	}
	let i = !1;
	return () => {
		i || (i = !0, n.forEach((t) => {
			let n = e.get(t);
			--n.count || (n.elements.forEach(({ element: e, existed: t }) => {
				t || e.classList.remove("sb-modal-scroll-locked");
			}), e.delete(t));
		}));
	};
}
//#endregion
//#region resources/js/core/editorSize.js
var n = "smartbrowser.editorMaximized";
function r(e, r, i, a = n) {
	let o;
	try {
		o = e.ownerDocument.defaultView.localStorage;
	} catch {}
	let s = !1, c, l = (n, l = !0) => {
		if (s = n, e.classList.toggle("is-maximized", n), n && !c && (c = t(e.ownerDocument)), !n && c && (c(), c = null), l) try {
			o?.setItem(a, String(n));
		} catch {}
		if (!r) return;
		r.setAttribute("aria-pressed", String(n));
		let u = i(n ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE");
		r.title = u, r.setAttribute("aria-label", u), r.querySelector("span").className = n ? "fas fa-compress" : "fas fa-expand";
	};
	try {
		s = o?.getItem(a) === "true";
	} catch {}
	l(s, !1);
	let u = () => l(!s);
	return r?.addEventListener("click", u), {
		toggle() {
			return l(!s), s;
		},
		isMaximized() {
			return s;
		},
		bind(e) {
			r?.removeEventListener("click", u), r = e, l(s, !1), r?.addEventListener("click", u);
		},
		destroy() {
			r?.removeEventListener("click", u), c?.(), c = null;
		}
	};
}
//#endregion
export { r as t };
