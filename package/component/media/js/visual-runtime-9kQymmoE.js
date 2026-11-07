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
	let o = `supjx.smartbrowser.user.${r.userId}.`, s = o + "$generation", c = o + "$pending", l = {}, u = null, d = !1, f = !1, p = null, m = () => {
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
	m(), n.setItem(s, r.generation);
	for (let [t, i] of Object.entries({
		...r.values,
		...l
	})) e(t) && typeof i == "string" && n.setItem(o + t, i);
	let h = () => n.getItem(s) === r.generation, g = () => {
		h() && n.setItem(c, JSON.stringify(l));
	};
	g();
	let _ = () => {
		u == null && !f && r.userId && (u = a(() => {
			u = null, v();
		}));
	}, v = async () => {
		if (f || !h()) return !1;
		if (d) {
			try {
				await p;
			} catch {}
			return v();
		}
		if (!r.userId || !Object.keys(l).length) return !0;
		let e = {}, t = 0;
		for (let [n, r] of Object.entries(l)) {
			let i = new TextEncoder().encode(JSON.stringify([n, r])).length;
			if (t + i > 48e3 && t || Object.keys(e).length >= 100) break;
			e[n] = r, t += i;
		}
		d = !0;
		try {
			p = i({
				generation: r.generation,
				changes: e
			}), await p;
			for (let [t, n] of Object.entries(e)) l[t] === n && delete l[t];
			g();
		} catch (e) {
			return e.status === 409 && (f = !0, l = {}, h() && m()), !1;
		} finally {
			d = !1;
		}
		return !Object.keys(l).length || v();
	}, y = {
		getItem(t) {
			return e(t) && h() ? n.getItem(o + t) : null;
		},
		setItem(t, r) {
			e(t) && !f && h() && (r = String(r), n.getItem(o + t) !== r && (n.setItem(o + t, r), l[t] = r, g(), _()));
		},
		removeItem(t) {
			e(t) && !f && h() && (n.removeItem(o + t), l[t] = null, g(), _());
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
			for (; y.key(e) !== null;) e++;
			return e;
		},
		flush: v,
		async reset() {
			if (f || !h()) throw Error("Preferences were reset. Reload the page.");
			let e = await i({
				generation: r.generation,
				operation: "reset"
			});
			if (!e?.generation) throw Error("Preferences could not be reset.");
			return f = !0, l = {}, m(), n.setItem(s, e.generation), e;
		}
	};
	return _(), y;
}
function r(e = globalThis.window) {
	let t = e?.Joomla?.getOptions?.("com_smartbrowser.preferences");
	if (!t || typeof t.userId != "number") return e?.localStorage;
	let i = e;
	try {
		let n = e.parent.Joomla?.getOptions?.("com_smartbrowser.preferences");
		if (e.parent !== e && n?.userId === t.userId) {
			let r = e.parent.localStorage?.getItem(`supjx.smartbrowser.user.${t.userId}.$generation`);
			(n.generation.split(":")[0] !== t.generation.split(":")[0] || r === t.generation && n.generation !== t.generation) && Object.assign(n, t), i = e.parent, t = n;
		}
	} catch {}
	let a = `${t.userId}:${t.generation}`;
	if (i.__smartbrowserPreferences?.identity === a) return i.__smartbrowserPreferences.storage;
	let o;
	try {
		o = i.localStorage;
	} catch {}
	let s = n({
		storage: o,
		context: { ...t },
		schedule: (e) => i.setTimeout(e, 500),
		send: async (e) => {
			let n = await i.fetch(t.apiUrl, {
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
			let r = await n.json();
			if (r.success === !1) throw Error("Preferences could not be saved.");
			return r.data;
		}
	}), c = s.reset;
	return s.reset = async () => {
		let n = await c();
		t.generation = n.generation, t.values = {};
		let a = e.Joomla?.getOptions?.("com_smartbrowser.preferences");
		return a?.userId === t.userId && (a.generation = n.generation, a.values = {}), i.__smartbrowserPreferences = null, r(i);
	}, i.__smartbrowserPreferences = {
		identity: a,
		storage: s
	}, i.addEventListener("pagehide", () => void s.flush()), s;
}
//#endregion
export { r as t };
