//#region resources/js/core/userPreferences.js
var e = (e) => typeof e == "string" && /^[a-zA-Z][^\x00-\x20\x7f]{0,239}$/.test(e) && ![
	"__proto__",
	"constructor",
	"prototype"
].includes(e), t = (e) => {
	let t = /* @__PURE__ */ new Map(), n = () => {
		let n = /* @__PURE__ */ new Set();
		try {
			for (let t = 0; t < e.length; t++) n.add(e.key(t));
		} catch {}
		for (let [e, r] of t) r === null ? n.delete(e) : n.add(e);
		return [...n];
	};
	return {
		getItem(n) {
			if (t.has(n)) return t.get(n);
			try {
				return e?.getItem(n) ?? null;
			} catch {
				return null;
			}
		},
		setItem(n, r) {
			try {
				if (!e) throw Error();
				e.setItem(n, r), t.delete(n);
			} catch {
				t.set(n, r);
			}
		},
		removeItem(n) {
			try {
				e?.removeItem(n), t.delete(n);
			} catch {
				t.set(n, null);
			}
		},
		key(e) {
			return n()[e] ?? null;
		},
		get length() {
			return n().length;
		}
	};
};
function n({ storage: n, context: r, send: i, schedule: a = (e) => setTimeout(e, 500) }) {
	n = t(n);
	let o = `supjx.smartbrowser.user.${r.userId}.`, s = o + "$generation", c = o + "$pending", l = {}, u = null, d = !1, f = !1, p = () => {
		let e = [];
		for (let t = 0; t < n.length; t++) {
			let r = n.key(t);
			r?.startsWith(o) && e.push(r);
		}
		e.forEach((e) => n.removeItem(e));
	};
	if (n.getItem(s) === r.generation) try {
		l = JSON.parse(n.getItem(c) || "{}");
	} catch {}
	p(), n.setItem(s, r.generation);
	for (let [t, i] of Object.entries({
		...r.values,
		...l
	})) e(t) && typeof i == "string" && n.setItem(o + t, i);
	let m = () => n.getItem(s) === r.generation, h = () => {
		m() && n.setItem(c, JSON.stringify(l));
	};
	h();
	let g = () => {
		u == null && !f && r.userId && (u = a(() => {
			u = null, _();
		}));
	}, _ = async () => {
		if (d || f || !m() || !r.userId || !Object.keys(l).length) return;
		let e = {}, t = 0;
		for (let [n, r] of Object.entries(l)) {
			let i = new TextEncoder().encode(JSON.stringify([n, r])).length;
			if (t + i > 48e3 && t || Object.keys(e).length >= 100) break;
			e[n] = r, t += i;
		}
		d = !0;
		try {
			await i({
				generation: r.generation,
				changes: e
			});
			for (let [t, n] of Object.entries(e)) l[t] === n && delete l[t];
			h();
		} catch (e) {
			e.status === 409 && (f = !0, l = {}, m() && p());
			return;
		} finally {
			d = !1;
		}
		Object.keys(l).length && g();
	}, v = {
		getItem(t) {
			return e(t) && m() ? n.getItem(o + t) : null;
		},
		setItem(t, r) {
			e(t) && !f && m() && (r = String(r), n.getItem(o + t) !== r && (n.setItem(o + t, r), l[t] = r, h(), g()));
		},
		removeItem(t) {
			e(t) && !f && m() && (n.removeItem(o + t), l[t] = null, h(), g());
		},
		key(t) {
			let r = [];
			for (let t = 0; t < n.length; t++) {
				let i = n.key(t);
				i?.startsWith(o) && e(i.slice(o.length)) && r.push(i.slice(o.length));
			}
			return r[t] ?? null;
		},
		get length() {
			let e = 0;
			for (; v.key(e) !== null;) e++;
			return e;
		},
		flush: _
	};
	return g(), v;
}
function r(e = globalThis.window) {
	let t = e?.Joomla?.getOptions?.("com_smartbrowser.preferences");
	if (!t || typeof t.userId != "number") return e?.localStorage;
	let r = e;
	try {
		e.parent !== e && e.parent.Joomla?.getOptions?.("com_smartbrowser.preferences")?.userId === t.userId && (r = e.parent, t = r.Joomla.getOptions("com_smartbrowser.preferences"));
	} catch {}
	let i = `${t.userId}:${t.generation}`;
	if (r.__smartbrowserPreferences?.identity === i) return r.__smartbrowserPreferences.storage;
	let a;
	try {
		a = r.localStorage;
	} catch {}
	let o = n({
		storage: a,
		context: t,
		schedule: (e) => r.setTimeout(e, 500),
		send: async (e) => {
			let n = await r.fetch(t.apiUrl, {
				method: "POST",
				credentials: "same-origin",
				keepalive: !0,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...e,
					[t.csrfToken]: 1
				})
			});
			if (!n.ok) throw Object.assign(/* @__PURE__ */ Error("Preferences could not be saved."), { status: n.status });
			if ((await n.json()).success === !1) throw Error("Preferences could not be saved.");
		}
	});
	return r.__smartbrowserPreferences = {
		identity: i,
		storage: o
	}, r.addEventListener("pagehide", () => void o.flush()), o;
}
//#endregion
//#region resources/js/core/selectionIdentity.js
function i(e) {
	return !e || typeof e != "object" || Array.isArray(e) || typeof e.adapter != "string" || !/^[a-z][a-z0-9-]*$/.test(e.adapter) || typeof e.id != "string" || !e.id || e.id.length > 2048 ? null : {
		adapter: e.adapter,
		id: e.id
	};
}
var a = (e) => JSON.stringify([e.adapter, e.id]), o = (e) => e?.selectionKey || e?.id, s = (e, t) => i(e?.selection || {
	adapter: e?.adapter || t,
	id: e?.id
});
function c(e, { adapter: t, allowedAdapters: n = [], homogeneous: r = !1, maxSelections: o = 500 } = {}) {
	if (!Number.isInteger(o) || o < 1 || o > 500) throw TypeError("Invalid selection limit.");
	if (!Array.isArray(e) || e.length > 500) throw TypeError("A collection supports at most 500 entries.");
	let s = /* @__PURE__ */ new Set(), c = e.map((e) => {
		let r = i(e?.selection || (e && typeof e == "object" ? {
			adapter: e.adapter || t,
			id: String(e.id)
		} : {
			adapter: t,
			id: String(e)
		}));
		if (!r || !r.id.includes(":") || n.length && !n.includes(r.adapter)) throw TypeError("Invalid or disallowed collection reference.");
		let a = e?.usage ?? {};
		if (!a || typeof a != "object" || Array.isArray(a) || Object.keys(a).length > 100 || Object.keys(a).some((e) => !/^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/.test(e)) || JSON.stringify(a).length > 65536) throw TypeError("Invalid collection usage.");
		return {
			selection: r,
			usage: JSON.parse(JSON.stringify(a))
		};
	}).filter((e) => {
		let t = e.selection, n = a(/^uri:[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)?$/.test(t.id) ? {
			...t,
			id: t.id.split(".")[0]
		} : t);
		return !s.has(n) && (s.add(n), !0);
	});
	if (r && new Set(c.map((e) => e.selection.adapter)).size > 1) throw TypeError("This collection requires one adapter.");
	if (c.length > o) throw TypeError("Selection limit exceeded.");
	return c;
}
//#endregion
//#region resources/js/core/pageScrollLock.js
var l = /* @__PURE__ */ new WeakMap();
function u(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	for (; e && !n.has(e);) {
		n.add(e);
		let r = [e.documentElement, e.body].filter((e) => e?.classList);
		if (r.length) {
			let n = l.get(e);
			n || (n = {
				count: 0,
				elements: r.map((e) => ({
					element: e,
					existed: e.classList.contains("sb-modal-scroll-locked")
				}))
			}, l.set(e, n)), n.count++, n.elements.forEach(({ element: e }) => e.classList.add("sb-modal-scroll-locked")), t.push(e);
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
			let t = l.get(e);
			--t.count || (t.elements.forEach(({ element: e, existed: t }) => {
				t || e.classList.remove("sb-modal-scroll-locked");
			}), l.delete(e));
		}));
	};
}
//#endregion
//#region resources/js/core/editorSize.js
var d = "smartbrowser.editorMaximized";
function f(e, t, n, i = d) {
	let a;
	try {
		a = r(e.ownerDocument.defaultView);
	} catch {}
	let o = !1, s, c = (r, c = !0) => {
		if (o = r, e.classList.toggle("is-maximized", r), r && !s && (s = u(e.ownerDocument)), !r && s && (s(), s = null), c) try {
			a?.setItem(i, String(r));
		} catch {}
		if (!t) return;
		t.setAttribute("aria-pressed", String(r));
		let l = n(r ? "COM_SMARTBROWSER_EDITOR_RESTORE" : "COM_SMARTBROWSER_EDITOR_MAXIMIZE");
		t.title = l, t.setAttribute("aria-label", l), t.querySelector("span").className = r ? "fas fa-compress" : "fas fa-expand";
	};
	try {
		o = a?.getItem(i) === "true";
	} catch {}
	c(o, !1);
	let l = () => c(!o);
	return t?.addEventListener("click", l), {
		toggle() {
			return c(!o), o;
		},
		isMaximized() {
			return o;
		},
		bind(e) {
			t?.removeEventListener("click", l), t = e, c(o, !1), t?.addEventListener("click", l);
		},
		destroy() {
			t?.removeEventListener("click", l), s?.(), s = null;
		}
	};
}
//#endregion
export { o as a, a as i, c as n, s as o, i as r, r as s, f as t };
