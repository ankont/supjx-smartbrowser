//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function e(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var t = {}, n = [], r = () => {}, i = () => !1, a = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), o = (e) => e.startsWith("onUpdate:"), s = Object.assign, c = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", w = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ee = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), te = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ne = /-\w/g, T = te((e) => e.replace(ne, (e) => e.slice(1).toUpperCase())), re = /\B([A-Z])/g, E = te((e) => e.replace(re, "-$1").toLowerCase()), ie = te((e) => e.charAt(0).toUpperCase() + e.slice(1)), ae = te((e) => e ? `on${ie(e)}` : ""), D = (e, t) => !Object.is(e, t), oe = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, O = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, se = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, ce, le = () => ce ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function ue(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? me(r) : ue(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (g(e) || v(e)) return e;
}
var de = /;(?![^(]*\))/g, fe = /:([^]+)/, pe = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function me(e) {
	let t = {};
	return e.replace(pe, (e) => e.startsWith("/*") ? "" : e).split(de).forEach((e) => {
		if (e) {
			let n = e.split(fe);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function k(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = k(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var he = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", ge = /* @__PURE__ */ e(he);
he + "";
function _e(e) {
	return !!e || e === "";
}
function ve(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = A(e[i], t[i], n);
	return r;
}
function ye(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && A(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function be(e, t, n) {
	let r = f(e), i = f(t);
	if (r || i || (r = p(e), i = p(t), r || i)) return r && i ? ye(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !A(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function xe(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function A(e, t, n) {
	if (e === t) return !0;
	let r = m(e), i = m(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = _(e), i = _(t), r || i ? e === t : (r = d(e), i = d(t), r || i ? r && i ? xe(e, t, n, ve) : !1 : (r = v(e), i = v(t), r || i ? !r || !i ? !1 : xe(e, t, n, be) : String(e) === String(t))));
}
function Se(e, t) {
	return e.findIndex((e) => A(e, t));
}
var Ce = (e) => !!(e && e.__v_isRef === !0), we = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? Ce(e) ? we(e.value) : JSON.stringify(e, Te, 2) : String(e), Te = (e, t) => Ce(t) ? Te(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Ee(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Ee(e)) } : _(t) ? Ee(t) : v(t) && !d(t) && !C(t) ? String(t) : t, Ee = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, j, De = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && j && (j.active ? (this.parent = j, this.index = (j.scopes || (j.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = !0;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].pause();
			}
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause();
		}
	}
	resume() {
		if (this._active && this._isPaused) {
			this._isPaused = !1;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].resume();
			}
			let n = this.effects.slice();
			for (e = 0, t = n.length; e < t; e++) n[e].resume();
		}
	}
	run(e) {
		if (this._active) {
			let t = j;
			try {
				return j = this, e();
			} finally {
				j = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = j, j = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (j === this) j = this.prevScope;
			else {
				let e = j;
				for (; e;) {
					if (e.prevScope === this) {
						e.prevScope = this.prevScope;
						break;
					}
					e = e.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(e) {
		if (this._active) {
			this._active = !1;
			let t, n;
			for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
			for (this.effects.length = 0, t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
			if (this.cleanups.length = 0, this.scopes) {
				let e = this.scopes.slice();
				for (t = 0, n = e.length; t < n; t++) e[t].stop(!0);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !e) {
				let e = this.parent.scopes.pop();
				e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index);
			}
			this.parent = void 0;
		}
	}
};
function Oe(e) {
	return new De(e);
}
function ke() {
	return j;
}
var M, Ae = /* @__PURE__ */ new WeakSet(), je = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, j && (j.active ? j.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Ae.has(this) && (Ae.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Fe(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, qe(this), Re(this);
		let e = M, t = N;
		M = this, N = !0;
		try {
			return this.fn();
		} finally {
			ze(this), M = e, N = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) He(e);
			this.deps = this.depsTail = void 0, qe(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Ae.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Be(this) && this.run();
	}
	get dirty() {
		return Be(this);
	}
}, Me = 0, Ne, Pe;
function Fe(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Pe, Pe = e;
		return;
	}
	e.next = Ne, Ne = e;
}
function Ie() {
	Me++;
}
function Le() {
	if (--Me > 0) return;
	if (Pe) {
		let e = Pe;
		for (Pe = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Ne;) {
		let t = Ne;
		for (Ne = void 0; t;) {
			let n = t.next;
			if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
				t.trigger();
			} catch (t) {
				e ||= t;
			}
			t = n;
		}
	}
	if (e) throw e;
}
function Re(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function ze(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), He(r), Ue(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Be(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ve(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ve(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Je) || (e.globalVersion = Je, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Be(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = M, r = N;
	M = e, N = !0;
	try {
		Re(e);
		let n = e.fn(e._value);
		(t.version === 0 || D(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		M = n, N = r, ze(e), e.flags &= -3;
	}
}
function He(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) He(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ue(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var N = !0, We = [];
function Ge() {
	We.push(N), N = !1;
}
function Ke() {
	let e = We.pop();
	N = e === void 0 || e;
}
function qe(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = M;
		M = void 0;
		try {
			t();
		} finally {
			M = e;
		}
	}
}
var Je = 0, Ye = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Xe = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!M || !N || M === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== M) t = this.activeLink = new Ye(M, this), M.deps ? (t.prevDep = M.depsTail, M.depsTail.nextDep = t, M.depsTail = t) : M.deps = M.depsTail = t, Ze(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = M.depsTail, t.nextDep = void 0, M.depsTail.nextDep = t, M.depsTail = t, M.deps === t && (M.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Je++, this.notify(e);
	}
	notify(e) {
		Ie();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Le();
		}
	}
};
function Ze(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Ze(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Qe = /* @__PURE__ */ new WeakMap(), $e = /* @__PURE__ */ Symbol(""), et = /* @__PURE__ */ Symbol(""), tt = /* @__PURE__ */ Symbol("");
function P(e, t, n) {
	if (N && M) {
		let t = Qe.get(e);
		t || Qe.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Xe()), r.map = t, r.key = n), r.track();
	}
}
function nt(e, t, n, r, i, a) {
	let o = Qe.get(e);
	if (!o) {
		Je++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Ie(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === tt || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(tt)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get($e)), f(e) && s(o.get(et)));
				break;
			case "delete":
				i || (s(o.get($e)), f(e) && s(o.get(et)));
				break;
			case "set": f(e) && s(o.get($e));
		}
	}
	Le();
}
function rt(e) {
	let t = /* @__PURE__ */ L(e);
	return t === e || (P(t, "iterate", tt), /* @__PURE__ */ I(e)) ? t : /* @__PURE__ */ Bt(e) ? /* @__PURE__ */ zt(e) ? t.map((e) => Ut(R(e))) : t.map(Ut) : t.map(R);
}
function it(e) {
	return P(e = /* @__PURE__ */ L(e), "iterate", tt), e;
}
function F(e, t) {
	return /* @__PURE__ */ Bt(e) ? Ut(/* @__PURE__ */ zt(e) ? R(t) : t) : R(t);
}
var at = {
	__proto__: null,
	[Symbol.iterator]() {
		return ot(this, Symbol.iterator, (e) => F(this, e));
	},
	concat(...e) {
		return rt(this).concat(...e.map((e) => d(e) ? rt(e) : e));
	},
	entries() {
		return ot(this, "entries", (e) => (e[1] = F(this, e[1]), e));
	},
	every(e, t) {
		return ct(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return ct(this, "filter", e, t, (e) => e.map((e) => F(this, e)), arguments);
	},
	find(e, t) {
		return ct(this, "find", e, t, (e) => F(this, e), arguments);
	},
	findIndex(e, t) {
		return ct(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return ct(this, "findLast", e, t, (e) => F(this, e), arguments);
	},
	findLastIndex(e, t) {
		return ct(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return ct(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return ut(this, "includes", e);
	},
	indexOf(...e) {
		return ut(this, "indexOf", e);
	},
	join(e) {
		return rt(this).join(e);
	},
	lastIndexOf(...e) {
		return ut(this, "lastIndexOf", e);
	},
	map(e, t) {
		return ct(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return dt(this, "pop");
	},
	push(...e) {
		return dt(this, "push", e);
	},
	reduce(e, ...t) {
		return lt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return lt(this, "reduceRight", e, t);
	},
	shift() {
		return dt(this, "shift");
	},
	some(e, t) {
		return ct(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return dt(this, "splice", e);
	},
	toReversed() {
		return rt(this).toReversed();
	},
	toSorted(e) {
		return rt(this).toSorted(e);
	},
	toSpliced(...e) {
		return rt(this).toSpliced(...e);
	},
	unshift(...e) {
		return dt(this, "unshift", e);
	},
	values() {
		return ot(this, "values", (e) => F(this, e));
	}
};
function ot(e, t, n) {
	let r = it(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ I(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var st = Array.prototype;
function ct(e, t, n, r, i, a) {
	let o = it(e), s = o !== e && !/* @__PURE__ */ I(e), c = o[t];
	if (c !== st[t]) {
		let t = c.apply(e, a);
		return s ? R(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, F(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function lt(e, t, n, r) {
	let i = it(e), a = i !== e && !/* @__PURE__ */ I(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = F(e, t)), n.call(this, t, F(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? F(e, c) : c;
}
function ut(e, t, n) {
	let r = /* @__PURE__ */ L(e);
	P(r, "iterate", tt);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Vt(n[0]) ? (n[0] = /* @__PURE__ */ L(n[0]), r[t](...n)) : i;
}
function dt(e, t, n = []) {
	Ge(), Ie();
	let r = (/* @__PURE__ */ L(e))[t].apply(e, n);
	return Le(), Ke(), r;
}
var ft = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), pt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function mt(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ L(this);
	return P(t, "has", e), t.hasOwnProperty(e);
}
var ht = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Nt : Mt : i ? jt : At).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = at[t])) return e;
			if (t === "hasOwnProperty") return mt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ z(e) ? e : n);
		if ((_(t) ? pt.has(t) : ft(t)) || (r || P(e, "get", t), i)) return o;
		if (/* @__PURE__ */ z(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Lt(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Lt(o) : /* @__PURE__ */ Ft(o) : o;
	}
}, gt = class extends ht {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Bt(i);
			if (!/* @__PURE__ */ I(n) && !/* @__PURE__ */ Bt(n) && (i = /* @__PURE__ */ L(i), n = /* @__PURE__ */ L(n)), !a && /* @__PURE__ */ z(i) && !/* @__PURE__ */ z(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ z(e) ? e : r);
		return e === /* @__PURE__ */ L(r) && s && (o ? D(n, i) && nt(e, "set", t, n, i) : nt(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && nt(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!_(t) || !pt.has(t)) && P(e, "has", t), n;
	}
	ownKeys(e) {
		return P(e, "iterate", d(e) ? "length" : $e), Reflect.ownKeys(e);
	}
}, _t = class extends ht {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, vt = /* @__PURE__ */ new gt(), yt = /* @__PURE__ */ new _t(), bt = /* @__PURE__ */ new gt(!0), xt = (e) => e, St = (e) => Reflect.getPrototypeOf(e);
function Ct(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ L(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? xt : t ? Ut : R;
		return !t && P(a, "iterate", l ? et : $e), s(Object.create(u), { next() {
			let { value: e, done: t } = u.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: c ? [d(e[0]), d(e[1])] : d(e),
				done: t
			};
		} });
	};
}
function wt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Tt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ L(r), a = /* @__PURE__ */ L(n);
			e || (D(n, a) && P(i, "get", n), P(i, "get", a));
			let { has: o } = St(i), s = t ? xt : e ? Ut : R;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && P(/* @__PURE__ */ L(t), "iterate", $e), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ L(n), i = /* @__PURE__ */ L(t);
			return e || (D(t, i) && P(r, "has", t), P(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ L(a), s = t ? xt : e ? Ut : R;
			return !e && P(o, "iterate", $e), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: wt("add"),
		set: wt("set"),
		delete: wt("delete"),
		clear: wt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ L(this), r = St(n), i = /* @__PURE__ */ L(e), a = !t && !/* @__PURE__ */ I(e) && !/* @__PURE__ */ Bt(e) ? i : e;
			return r.has.call(n, a) || D(e, a) && r.has.call(n, e) || D(i, a) && r.has.call(n, i) || (n.add(a), nt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ I(n) && !/* @__PURE__ */ Bt(n) && (n = /* @__PURE__ */ L(n));
			let r = /* @__PURE__ */ L(this), { has: i, get: a } = St(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ L(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? D(n, s) && nt(r, "set", e, n, s) : nt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ L(this), { has: n, get: r } = St(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ L(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && nt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ L(this), t = e.size !== 0, n = e.clear();
			return t && nt(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Ct(r, e, t);
	}), n;
}
function Et(e, t) {
	let n = Tt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(u(n, r) && r in t ? n : t, r, i);
}
var Dt = { get: /* @__PURE__ */ Et(!1, !1) }, Ot = { get: /* @__PURE__ */ Et(!1, !0) }, kt = { get: /* @__PURE__ */ Et(!0, !1) }, At = /* @__PURE__ */ new WeakMap(), jt = /* @__PURE__ */ new WeakMap(), Mt = /* @__PURE__ */ new WeakMap(), Nt = /* @__PURE__ */ new WeakMap();
function Pt(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function Ft(e) {
	return /* @__PURE__ */ Bt(e) ? e : Rt(e, !1, vt, Dt, At);
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return Rt(e, !1, bt, Ot, jt);
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
	return Rt(e, !0, yt, kt, Mt);
}
function Rt(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Pt(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return /* @__PURE__ */ Bt(e) ? /* @__PURE__ */ zt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Bt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function I(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Vt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function L(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ L(t) : e;
}
function Ht(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && O(e, "__v_skip", !0), e;
}
var R = (e) => v(e) ? /* @__PURE__ */ Ft(e) : e, Ut = (e) => v(e) ? /* @__PURE__ */ Lt(e) : e;
// @__NO_SIDE_EFFECTS__
function z(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function Wt(e) {
	return Kt(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Gt(e) {
	return Kt(e, !0);
}
function Kt(e, t) {
	return /* @__PURE__ */ z(e) ? e : new qt(e, t);
}
var qt = class {
	constructor(e, t) {
		this.dep = new Xe(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ L(e), this._value = t ? e : R(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ I(e) || /* @__PURE__ */ Bt(e);
		e = n ? e : /* @__PURE__ */ L(e), D(e, t) && (this._rawValue = e, this._value = n ? e : R(e), this.dep.trigger());
	}
};
function Jt(e) {
	return /* @__PURE__ */ z(e) ? e.value : e;
}
var Yt = {
	get: (e, t, n) => t === "__v_raw" ? e : Jt(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ z(i) && !/* @__PURE__ */ z(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Xt(e) {
	return /* @__PURE__ */ zt(e) ? e : new Proxy(e, Yt);
}
var Zt = class {
	constructor(e) {
		this.__v_isRef = !0, this._value = void 0;
		let t = this.dep = new Xe(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
		this._get = n, this._set = r;
	}
	get value() {
		return this._value = this._get();
	}
	set value(e) {
		this._set(e);
	}
};
function Qt(e) {
	return new Zt(e);
}
var $t = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Xe(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Je - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && M !== this) return Fe(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Ve(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function en(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new $t(r, i, n);
}
var tn = {}, nn = /* @__PURE__ */ new WeakMap(), rn = void 0;
function an(e, t = !1, n = rn) {
	if (n) {
		let t = nn.get(n);
		t || nn.set(n, t = []), t.push(e);
	}
}
function on(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ I(e) || o === !1 || o === 0 ? sn(e, 1) : sn(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ z(e) ? (g = () => e.value, y = /* @__PURE__ */ I(e)) : /* @__PURE__ */ zt(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ zt(e) || /* @__PURE__ */ I(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ z(e)) return e.value;
		if (/* @__PURE__ */ zt(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			Ge();
			try {
				_();
			} finally {
				Ke();
			}
		}
		let t = rn;
		rn = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			rn = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => sn(e(), t);
	}
	let x = ke(), S = () => {
		m.stop(), x && x.active && c(x.effects, m);
	};
	if (s && n) {
		let e = n;
		n = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(tn) : tn, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (n) {
				let t = m.run();
				if (e || o || y || (b ? t.some((e, t) => D(e, C[t])) : D(t, C))) {
					_ && _();
					let e = rn;
					rn = m;
					try {
						let e = [
							t,
							C === tn ? void 0 : b && C[0] === tn ? [] : C,
							v
						];
						C = t, f ? f(n, 3, e) : n(...e);
					} finally {
						rn = e;
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new je(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => an(e, !1, m), _ = m.onStop = () => {
		let e = nn.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			nn.delete(m);
		}
	}, n ? a ? w(!0) : C = m.run() : l ? l(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function sn(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ z(e)) sn(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) sn(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		sn(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) sn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && sn(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function cn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		ln(e, t, n);
	}
}
function B(e, t, n, r) {
	if (h(e)) {
		let i = cn(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			ln(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(B(e[a], t, n, r));
		return i;
	}
}
function ln(e, n, r, i = !0) {
	let a = n ? n.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = n && n.appContext.config || t;
	if (n) {
		let t = n.parent, i = n.proxy, a = `https://vuejs.org/error-reference/#runtime-${r}`;
		for (; t;) {
			let n = t.ec;
			if (n) {
				for (let t = 0; t < n.length; t++) if (n[t](e, i, a) === !1) return;
			}
			t = t.parent;
		}
		if (o) {
			Ge(), cn(o, null, 10, [
				e,
				i,
				a
			]), Ke();
			return;
		}
	}
	un(e, r, a, i, s);
}
function un(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var V = [], H = -1, dn = [], fn = null, pn = 0, mn = /* @__PURE__ */ Promise.resolve(), hn = null;
function gn(e) {
	let t = hn || mn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function _n(e) {
	let t = H + 1, n = V.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = V[r], a = Cn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function vn(e) {
	if (!(e.flags & 1)) {
		let t = Cn(e), n = V[V.length - 1];
		!n || !(e.flags & 2) && t >= Cn(n) ? V.push(e) : V.splice(_n(t), 0, e), e.flags |= 1, yn();
	}
}
function yn() {
	hn ||= mn.then(wn);
}
function bn(e) {
	if (!d(e)) fn && e.id === -1 ? fn.splice(pn + 1, 0, e) : e.flags & 1 || (dn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) dn.push(e[t]);
	yn();
}
function xn(e, t, n = H + 1) {
	for (; n < V.length; n++) {
		let t = V[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			V.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function Sn(e) {
	if (dn.length) {
		let e = [...new Set(dn)].sort((e, t) => Cn(e) - Cn(t));
		if (dn.length = 0, fn) {
			for (let t = 0; t < e.length; t++) fn.push(e[t]);
			return;
		}
		for (fn = e, pn = 0; pn < fn.length; pn++) {
			let e = fn[pn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		fn = null, pn = 0;
	}
}
var Cn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function wn(e) {
	try {
		for (H = 0; H < V.length; H++) {
			let e = V[H];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), cn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; H < V.length; H++) {
			let e = V[H];
			e && (e.flags &= -2);
		}
		H = -1, V.length = 0, Sn(e), hn = null, (V.length || dn.length) && wn(e);
	}
}
var U = null, Tn = null;
function En(e) {
	let t = U;
	return U = e, Tn = e && e.type.__scopeId || null, t;
}
function Dn(e, t = U, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Hi(-1);
		let i = En(t), a = Ri.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Ri.length; e > a; e--) Bi();
			En(i), r._d && Hi(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function On(e, n) {
	if (U === null) return e;
	let r = Sa(U), i = e.dirs ||= [];
	for (let e = 0; e < n.length; e++) {
		let [a, o, s, c = t] = n[e];
		a && (h(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && sn(o), i.push({
			dir: a,
			instance: r,
			value: o,
			oldValue: void 0,
			arg: s,
			modifiers: c
		}));
	}
	return e;
}
function kn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ge(), B(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Ke());
	}
}
function An(e, t) {
	if (Z) {
		let n = Z.provides, r = Z.parent && Z.parent.provides;
		r === n && (n = Z.provides = Object.create(r)), n[e] = t;
	}
}
function jn(e, t, n = !1) {
	let r = la();
	if (r || Kr) {
		let i = Kr ? Kr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var Mn = /* @__PURE__ */ Symbol.for("v-scx"), Nn = () => jn(Mn);
function Pn(e, t) {
	return In(e, null, { flush: "sync" });
}
function Fn(e, t, n) {
	return In(e, t, n);
}
function In(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (ha) {
		if (c === "sync") {
			let e = Nn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = Z;
	u.call = (e, t, n) => B(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		G(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : vn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = on(e, n, u);
	return ha && (f ? f.push(h) : d && h()), h;
}
function Ln(e, t, n) {
	let r = this.proxy, i = g(e) ? e.includes(".") ? Rn(r, e) : () => r[e] : e.bind(r, r), a;
	h(t) ? a = t : (a = t.handler, n = t);
	let o = fa(this), s = In(i, a.bind(r), n);
	return o(), s;
}
function Rn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var zn = /* @__PURE__ */ Symbol("_vte"), Bn = (e) => e.__isTeleport, Vn = /* @__PURE__ */ Symbol("_leaveCb");
function Hn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== q) {
			t = n;
			break;
		}
	}
	return t;
}
function Un(e) {
	if (!Qn(e)) return Bn(e.type) && e.children ? Hn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && h(n.default)) return n.default();
	}
}
function Wn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Wn(Bn(n.type) && Un(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Gn() {
	let e = la();
	return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function Kn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function qn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Jn = /* @__PURE__ */ new WeakMap();
function Yn(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => Yn(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (Zn(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && Yn(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? Sa(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ L(v), b = v === t ? i : (e) => !qn(_, e) && u(y, e), x = (e, t) => !(t && qn(_, t));
	if (m != null && m !== p) {
		if (Xn(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ z(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) cn(p, f, 12, [l, _]);
	else {
		let t = g(p), n = /* @__PURE__ */ z(p);
		if (t || n) {
			let i = () => {
				if (e.f) {
					let n = t ? b(p) ? v[p] : _[p] : x(p) || !e.k ? p.value : _[e.k];
					if (o) d(n) && c(n, s);
					else if (d(n)) n.includes(s) || n.push(s);
					else if (t) _[p] = [s], b(p) && (v[p] = _[p]);
					else {
						let t = [s];
						x(p, e.k) && (p.value = t), e.k && (_[e.k] = t);
					}
				} else t ? (_[p] = l, b(p) && (v[p] = l)) : n && (x(p, e.k) && (p.value = l), e.k && (_[e.k] = l));
			};
			if (l) {
				let t = () => {
					i(), Jn.delete(e);
				};
				t.id = -1, Jn.set(e, t), G(t, r);
			} else Xn(e), i();
		}
	}
}
function Xn(e) {
	let t = Jn.get(e);
	t && (t.flags |= 8, Jn.delete(e));
}
le().requestIdleCallback, le().cancelIdleCallback;
var Zn = (e) => !!e.type.__asyncLoader, Qn = (e) => e.type.__isKeepAlive;
function $n(e, t) {
	tr(e, "a", t);
}
function er(e, t) {
	tr(e, "da", t);
}
function tr(e, t, n = Z) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (rr(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Qn(e.parent.vnode) && nr(r, t, n, e), e = e.parent;
	}
}
function nr(e, t, n, r) {
	let i = rr(t, e, r, !0);
	ur(() => {
		c(r[t], i);
	}, n);
}
function rr(e, t, n = Z, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ge();
			let i = fa(n), a = B(t, n, e, r);
			return i(), Ke(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var ir = (e) => (t, n = Z) => {
	(!ha || e === "sp") && rr(e, (...e) => t(...e), n);
}, ar = ir("bm"), or = ir("m"), sr = ir("bu"), cr = ir("u"), lr = ir("bum"), ur = ir("um"), dr = ir("sp"), fr = ir("rtg"), pr = ir("rtc");
function mr(e, t = Z) {
	rr("ec", e, t);
}
var hr = "components", gr = /* @__PURE__ */ Symbol.for("v-ndc");
function _r(e) {
	return g(e) ? vr(hr, e, !1) || e : e || gr;
}
function vr(e, t, n = !0, r = !1) {
	let i = U || Z;
	if (i) {
		let n = i.type;
		if (e === hr) {
			let e = Ca(n, !1);
			if (e && (e === t || e === T(t) || e === ie(T(t)))) return n;
		}
		let a = yr(i[e] || n[e], t) || yr(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function yr(e, t) {
	return e && (e[t] || e[T(t)] || e[ie(T(t))]);
}
function br(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ zt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ I(e), s = /* @__PURE__ */ Bt(e), e = it(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Ut(R(e[n])) : R(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	} else if (v(e)) {
		if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
		else {
			let n = Object.keys(e);
			i = Array(n.length);
			for (let r = 0, o = n.length; r < o; r++) {
				let o = n[r];
				i[r] = t(e[o], o, r, a && a[r]);
			}
		}
	} else i = [];
	return n && (n[r] = i), i;
}
function xr(e, t, n, r, i, a) {
	if (n ??= {}, U.ce || U.parent && Zn(U.parent) && U.parent.ce) {
		let e = a != null && n.key == null ? s({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), zi(), Gi(K, null, [Y("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let c = Ri.length;
	zi();
	let l;
	try {
		let i = o && Sr(o(n)), s = n.key || a || i && i.key;
		l = Gi(K, { key: (s && !_(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Ri.length; e > c; e--) Bi();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), l;
}
function Sr(e) {
	return e.some((e) => !Ki(e) || !(e.type === q || e.type === K && !Sr(e.children))) ? e : null;
}
var Cr = (e) => e ? ma(e) ? Sa(e) : Cr(e.parent) : null, wr = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Cr(e.parent),
	$root: (e) => Cr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => Pr(e),
	$forceUpdate: (e) => e.f ||= () => {
		vn(e.update);
	},
	$nextTick: (e) => e.n ||= gn.bind(e.proxy),
	$watch: (e) => Ln.bind(e)
}), Tr = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), Er = {
	get({ _: e }, n) {
		if (n === "__v_skip") return !0;
		let { ctx: r, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (n[0] !== "$") {
			let e = s[n];
			if (e !== void 0) switch (e) {
				case 1: return i[n];
				case 2: return a[n];
				case 4: return r[n];
				case 3: return o[n];
			}
			else if (Tr(i, n)) return s[n] = 1, i[n];
			else if (a !== t && u(a, n)) return s[n] = 2, a[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else kr && (s[n] = 0);
		}
		let d = wr[n], f, p;
		if (d) return n === "$attrs" && P(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, n, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return Tr(a, n) ? (a[n] = r, !0) : i !== t && u(i, n) ? (i[n] = r, !0) : u(e.props, n) || n[0] === "$" && n.slice(1) in e ? !1 : (o[n] = r, !0);
	},
	has({ _: { data: e, setupState: n, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== t && c[0] !== "$" && u(e, c) || Tr(n, c) || u(o, c) || u(i, c) || u(wr, c) || u(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function Dr(e) {
	return d(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function Or(e, t) {
	return !e || !t ? e || t : d(e) && d(t) ? e.concat(t) : s({}, Dr(e), Dr(t));
}
var kr = !0;
function Ar(e) {
	let t = Pr(e), n = e.proxy, i = e.ctx;
	kr = !1, t.beforeCreate && Mr(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: y, deactivated: b, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: ee, renderTracked: te, renderTriggered: ne, errorCaptured: T, serverPrefetch: re, expose: E, inheritAttrs: ie, components: ae, directives: D, filters: oe } = t;
	if (u && jr(u, i, null), s) for (let e in s) {
		let t = s[e];
		h(t) && (i[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		v(t) && (e.data = /* @__PURE__ */ Ft(t));
	}
	if (kr = !0, o) for (let e in o) {
		let t = o[e], a = Ta({
			get: h(t) ? t.bind(n, n) : h(t.get) ? t.get.bind(n, n) : r,
			set: !h(t) && h(t.set) ? t.set.bind(n) : r
		});
		Object.defineProperty(i, e, {
			enumerable: !0,
			configurable: !0,
			get: () => a.value,
			set: (e) => a.value = e
		});
	}
	if (c) for (let e in c) Nr(c[e], i, n, e);
	if (l) {
		let e = h(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			An(t, e[t]);
		});
	}
	f && Mr(f, e, "c");
	function O(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (O(ar, p), O(or, m), O(sr, g), O(cr, _), O($n, y), O(er, b), O(mr, T), O(pr, te), O(fr, ne), O(lr, S), O(ur, w), O(dr, re), d(E)) {
		if (E.length) {
			let t = e.exposed ||= {};
			E.forEach((e) => {
				Object.defineProperty(t, e, {
					get: () => n[e],
					set: (t) => n[e] = t,
					enumerable: !0
				});
			});
		} else e.exposed ||= {};
	}
	ee && e.render === r && (e.render = ee), ie != null && (e.inheritAttrs = ie), ae && (e.components = ae), D && (e.directives = D), re && Kn(e);
}
function jr(e, t, n = r) {
	d(e) && (e = zr(e));
	for (let n in e) {
		let r = e[n], i;
		i = v(r) ? "default" in r ? jn(r.from || n, r.default, !0) : jn(r.from || n) : jn(r), /* @__PURE__ */ z(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function Mr(e, t, n) {
	B(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Nr(e, t, n, r) {
	let i = r.includes(".") ? Rn(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) && Fn(i, n);
	} else if (h(e)) Fn(i, e.bind(n));
	else if (v(e)) {
		if (d(e)) e.forEach((e) => Nr(e, t, n, r));
		else {
			let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
			h(r) && Fn(i, r, e);
		}
	}
}
function Pr(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Fr(c, e, o, !0)), Fr(c, t, o)), v(t) && a.set(t, c), c;
}
function Fr(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Fr(e, a, n, !0), i && i.forEach((t) => Fr(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = Ir[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Ir = {
	data: Lr,
	props: Vr,
	emits: Vr,
	methods: Br,
	computed: Br,
	beforeCreate: W,
	created: W,
	beforeMount: W,
	mounted: W,
	beforeUpdate: W,
	updated: W,
	beforeDestroy: W,
	beforeUnmount: W,
	destroyed: W,
	unmounted: W,
	activated: W,
	deactivated: W,
	errorCaptured: W,
	serverPrefetch: W,
	components: Br,
	directives: Br,
	watch: Hr,
	provide: Lr,
	inject: Rr
};
function Lr(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function Rr(e, t) {
	return Br(zr(e), zr(t));
}
function zr(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function W(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Br(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Vr(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), Dr(e), Dr(t ?? {})) : t;
}
function Hr(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = W(e[r], t[r]);
	return n;
}
function Ur() {
	return {
		app: null,
		config: {
			isNativeTag: i,
			performance: !1,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var Wr = 0;
function Gr(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = Ur(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: Wr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Da,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && h(e.install) ? (a.add(e), e.install(l, ...t)) : h(e) && (a.add(e), e(l, ...t))), l;
			},
			mixin(e) {
				return i.mixins.includes(e) || i.mixins.push(e), l;
			},
			component(e, t) {
				return t ? (i.components[e] = t, l) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, l) : i.directives[e];
			},
			mount(a, o, s) {
				if (!c) {
					let u = l._ceVNode || Y(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, Sa(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				c && (B(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = Kr;
				Kr = l;
				try {
					return e();
				} finally {
					Kr = t;
				}
			}
		};
		return l;
	};
}
var Kr = null;
function qr(e, n, r = t) {
	let i = la(), a = T(n), o = E(n), s = Jr(e, a), c = Qt((s, c) => {
		let l, u = t, d;
		return Pn(() => {
			let t = e[a];
			D(l, t) && (l = t, c());
		}), {
			get() {
				return s(), r.get ? r.get(l) : l;
			},
			set(e) {
				let s = r.set ? r.set(e) : e;
				if (!D(s, l) && !(u !== t && D(e, u))) return;
				let f = i.vnode.props, p = !!(f && (n in f || a in f || o in f) && (`onUpdate:${n}` in f || `onUpdate:${a}` in f || `onUpdate:${o}` in f));
				p || (l = e, c()), i.emit(`update:${n}`, s), D(e, u) && (D(e, s) && !D(s, d) || p && u !== t && !D(s, l)) && c(), u = e, d = s;
			}
		};
	});
	return c[Symbol.iterator] = () => {
		let e = 0;
		return { next() {
			return e < 2 ? {
				value: e++ ? s || t : c,
				done: !1
			} : { done: !0 };
		} };
	}, c;
}
var Jr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${T(t)}Modifiers`] || e[`${E(t)}Modifiers`];
function Yr(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && Jr(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(se)));
	let c, l = i[c = ae(n)] || i[c = ae(T(n))];
	!l && o && (l = i[c = ae(E(n))]), l && B(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, B(u, e, 6, a);
	}
}
var Xr = /* @__PURE__ */ new WeakMap();
function Zr(e, t, n = !1) {
	let r = n ? Xr : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, c = !1;
	if (!h(e)) {
		let r = (e) => {
			let n = Zr(e, t, !0);
			n && (c = !0, s(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !c ? (v(e) && r.set(e, null), null) : (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o);
}
function Qr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, E(t)) || u(e, t));
}
function $r(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = En(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = X(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = X(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : ei(c);
		}
	} catch (t) {
		Ri.length = 0, ln(t, e, 1), v = Y(q);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = ti(y, a)), b = $i(b, y, !1, !0));
	}
	return n.dirs && (b = $i(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Wn(Bn(b.type) && Un(b) || b, n.transition), v = b, En(_), v;
}
var ei = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, ti = (e, t) => {
	let n = {};
	for (let r in e) (!o(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function ni(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? ri(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (ii(o, r, n) && !Qr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || ri(r, o, l) : !!o;
	return !1;
}
function ri(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (ii(t, e, a) && !Qr(n, a)) return !0;
	}
	return !1;
}
function ii(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !A(r, i) : r !== i;
}
function ai({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var oi = {}, si = () => Object.create(oi), ci = (e) => Object.getPrototypeOf(e) === oi;
function li(e, t, n, r = !1) {
	let i = {}, a = si();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), di(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ It(i) : e.type.props ? i : a, e.attrs = a;
}
function ui(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ L(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Qr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) {
					if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
					else {
						let t = T(o);
						i[t] = fi(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		di(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !u(t, a) && ((r = E(a)) === a || !u(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = fi(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !u(t, e)) && (delete a[e], l = !0);
	}
	l && nt(e.attrs, "set", "");
}
function di(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (ee(t)) continue;
		let l = n[t], d;
		a && u(a, d = T(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : Qr(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ L(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = fi(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function fi(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = fa(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === E(n)) && (r = !0));
	}
	return r;
}
var pi = /* @__PURE__ */ new WeakMap();
function mi(e, r, i = !1) {
	let a = i ? pi : r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [], p = !1;
	if (!h(e)) {
		let t = (e) => {
			p = !0;
			let [t, n] = mi(e, r, !0);
			s(l, t), n && f.push(...n);
		};
		!i && r.mixins.length && r.mixins.forEach(t), e.extends && t(e.extends), e.mixins && e.mixins.forEach(t);
	}
	if (!c && !p) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = T(c[e]);
		hi(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = T(e);
		if (hi(t)) {
			let n = c[e], r = l[t] = d(n) || h(n) ? { type: n } : s({}, n), i = r.type, a = !1, o = !0;
			if (d(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = h(t) && t.name;
				if (n === "Boolean") {
					a = !0;
					break;
				}
				n === "String" && (o = !1);
			}
			else a = h(i) && i.name === "Boolean";
			r[0] = a, r[1] = o, (a || u(r, "default")) && f.push(t);
		}
	}
	let m = [l, f];
	return v(e) && a.set(e, m), m;
}
function hi(e) {
	return e[0] !== "$" && !ee(e);
}
var gi = (e) => e === "_" || e === "_ctx" || e === "$stable", _i = (e) => d(e) ? e.map(X) : [X(e)], vi = (e, t, n) => {
	if (t._n) return t;
	let r = Dn((...e) => _i(t(...e)), n);
	return r._c = !1, r;
}, yi = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (gi(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = vi(n, i, r);
		else if (i != null) {
			let e = _i(i);
			t[n] = () => e;
		}
	}
}, bi = (e, t) => {
	let n = _i(t);
	e.slots.default = () => n;
}, xi = (e, t, n) => {
	for (let r in t) (n || !gi(r)) && (e[r] = t[r]);
}, Si = (e, t, n) => {
	let r = e.slots = si();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (xi(r, t, n), n && O(r, "_", e, !0)) : yi(t, r);
	} else t && bi(e, t);
}, Ci = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : xi(a, n, r) : (o = !n.$stable, yi(n, a)), s = n;
	} else n && (bi(e, n), s = { default: 1 });
	if (o) for (let e in a) !gi(e) && s[e] == null && delete a[e];
}, G = Fi;
function wi(e) {
	return Ti(e);
}
function Ti(e, i) {
	let a = le();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !qi(e, t) && (i = ye(e), k(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case Ii:
				y(e, t, r, i);
				break;
			case q:
				b(e, t, r, i);
				break;
			case Li:
				e ?? x(t, r, i, s);
				break;
			case K:
				ae(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, r, i, a, o, s, c, l) : f & 6 ? D(e, t, r, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, r, i, a, o, s, c, l, A);
		}
		d != null && a ? Yn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && Yn(e.ref, null, o, e, !0);
	}, y = (e, t, n, r) => {
		if (e == null) o(t.el = u(t.children), n, r);
		else {
			let n = t.el = e.el;
			t.children !== e.children && f(n, t.children);
		}
	}, b = (e, t, n, r) => {
		e == null ? o(t.el = d(t.children || ""), n, r) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, S = ({ el: e, anchor: t }, n, r) => {
		let i;
		for (; e && e !== t;) i = h(e), o(e, n, r), e = i;
		o(t, n, r);
	}, C = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, w = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) te(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), re(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, te = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && T(e.children, d, null, r, i, Ei(e, a), s, u), _ && kn(e, null, r, "created"), ne(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !ee(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && aa(f, r, e);
		}
		_ && kn(e, null, r, "beforeMount");
		let v = Oi(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && G(() => {
			try {
				f && aa(f, r, e), v && g.enter(d), _ && kn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, ne = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Pi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ne(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, T = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? na(e[l]) : X(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, re = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && Di(r, !1), (g = h.onVnodeBeforeUpdate) && aa(g, r, n, e), f && kn(n, e, r, "beforeUpdate"), r && Di(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? E(e.dynamicChildren, d, l, r, i, Ei(n, a), o) : s || de(e, n, l, null, r, i, Ei(n, a), o, !1), u > 0) {
			if (u & 16) ie(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && ie(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && G(() => {
			g && aa(g, r, n, e), f && kn(n, e, r, "updated");
		}, i);
	}, E = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === K || !qi(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, ie = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !ee(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (ee(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, ae = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), T(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (E(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && ki(e, t, !0)) : de(e, t, n, f, i, a, s, c, l);
	}, D = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : O(t, n, r, i, a, o, c) : se(e, t, c);
	}, O = (e, t, n, r, i, a, o) => {
		let s = e.component = ca(e, r, i);
		if (Qn(e) && (s.ctx.renderer = A), ga(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ce, o), !e.el) {
				let r = s.subTree = Y(q);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ce(s, e, t, n, i, a, o);
	}, se = (e, t, n) => {
		let r = t.component = e.component;
		if (ni(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, ue(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, r.vnode = t;
	}, ce = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = ji(e);
					if (n) {
						t && (t.el = c.el, ue(e, t, o)), n.asyncDep.then(() => {
							G(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Di(e, !1), t ? (t.el = c.el, ue(e, t, o)) : t = c, n && oe(n), (d = t.props && t.props.onVnodeBeforeUpdate) && aa(d, s, t, c), Di(e, !0);
				let f = $r(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ye(p), e, i, a), t.el = f.el, u === null && ai(e, f.el), r && G(r, i), (d = t.props && t.props.onVnodeUpdated) && G(() => aa(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Zn(t);
				if (Di(e, !1), l && oe(l), !m && (o = c && c.onVnodeBeforeMount) && aa(o, d, t), Di(e, !0), s && Ce) {
					let t = () => {
						e.subTree = $r(e), Ce(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = $r(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && G(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					G(() => aa(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Zn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && G(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new je(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => vn(u), Di(e, !0), l();
	}, ue = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, ui(e, t.props, r, n), Ci(e, t.children, n), Ge(), xn(e), Ke();
	}, de = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				pe(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				fe(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && ve(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? pe(l, d, n, r, i, a, o, s, c) : ve(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && T(d, n, r, i, a, o, s, c));
	}, fe = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let n = t[p] = l ? na(t[p]) : X(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? ve(e, a, o, !0, !1, f) : T(t, r, i, a, o, s, c, l, f);
	}, pe = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? na(t[u]) : X(t[u]);
			if (qi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? na(t[p]) : X(t[p]);
			if (qi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? na(t[u]) : X(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) k(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? na(t[u]) : X(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					k(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && qi(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? k(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? Ai(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Ni(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? me(n, r, p, 2) : _--);
			}
		}
	}, me = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			me(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, A);
			return;
		}
		if (c === K) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) me(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === Li) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Vn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), G(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Vn];
					a._isLeaving && a[Vn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, k = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Ge(), Yn(s, null, n, e, !0), Ke()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Zn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && aa(_, t, e), u & 6) _e(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && kn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, A, r) : l && !l.hasOnce && (a !== K || d > 0 && d & 64) ? ve(l, t, n, !1, !0) : (a === K && d & 384 || !i && u & 16) && ve(c, t, n), r && he(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && G(() => {
			_ && aa(_, t, e), h && kn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, he = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === K) {
			ge(n, r);
			return;
		}
		if (t === Li) {
			C(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let a = () => {
			s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (e.shapeFlag & 1 && i && !i.persisted) {
			let { leave: t, delayLeave: r } = i, o = () => t(n, a);
			r ? r(e.el, a, o) : o();
		} else a();
	}, ge = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, _e = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Mi(c), Mi(l), r && oe(r), i.stop(), a ? (a.flags |= 8, k(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, k(o, e, t, n)), s && G(s, t), G(() => {
			e.isUnmounted = !0;
		}, t);
	}, ve = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) k(e[o], t, n, r, i);
	}, ye = (e) => {
		if (e.shapeFlag & 6) return ye(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[zn];
		return n ? h(n) : t;
	}, be = !1, xe = (e, t, n) => {
		let r;
		e == null ? t._vnode && (k(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, be ||= (be = !0, xn(r), Sn(), !1);
	}, A = {
		p: v,
		um: k,
		m: me,
		r: he,
		mt: O,
		mc: T,
		pc: de,
		pbc: E,
		n: ye,
		o: e
	}, Se, Ce;
	return i && ([Se, Ce] = i(A)), {
		render: xe,
		hydrate: Se,
		createApp: Gr(xe, Se)
	};
}
function Ei({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Di({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Oi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function ki(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = na(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && ki(t, a)), a.type === Ii && (a.patchFlag === -1 && (a = i[e] = na(a)), a.el = t.el), a.type === q && !a.el && (a.el = t.el);
	}
}
function Ai(e) {
	let t = e.slice(), n = [0], r, i, a, o, s, c = e.length;
	for (r = 0; r < c; r++) {
		let c = e[r];
		if (c !== 0) {
			if (i = n[n.length - 1], e[i] < c) {
				t[r] = i, n.push(r);
				continue;
			}
			for (a = 0, o = n.length - 1; a < o;) s = a + o >> 1, e[n[s]] < c ? a = s + 1 : o = s;
			c < e[n[a]] && (a > 0 && (t[r] = n[a - 1]), n[a] = r);
		}
	}
	for (a = n.length, o = n[a - 1]; a-- > 0;) n[a] = o, o = t[o];
	return n;
}
function ji(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : ji(t);
}
function Mi(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Ni(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Ni(t.subTree) : null;
}
var Pi = (e) => e.__isSuspense;
function Fi(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : bn(e);
}
var K = /* @__PURE__ */ Symbol.for("v-fgt"), Ii = /* @__PURE__ */ Symbol.for("v-txt"), q = /* @__PURE__ */ Symbol.for("v-cmt"), Li = /* @__PURE__ */ Symbol.for("v-stc"), Ri = [], J = null;
function zi(e = !1) {
	Ri.push(J = e ? null : []);
}
function Bi() {
	Ri.pop(), J = Ri[Ri.length - 1] || null;
}
var Vi = 1;
function Hi(e, t = !1) {
	Vi += e, e < 0 && J && t && (J.hasOnce = !0);
}
function Ui(e) {
	return e.dynamicChildren = Vi > 0 ? J || n : null, Bi(), Vi > 0 && J && J.push(e), e;
}
function Wi(e, t, n, r, i, a) {
	return Ui(Xi(e, t, n, r, i, a, !0));
}
function Gi(e, t, n, r, i) {
	return Ui(Y(e, t, n, r, i, !0));
}
function Ki(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function qi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Ji = ({ key: e }) => e ?? null, Yi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ z(e) || h(e) ? {
	i: U,
	r: e,
	k: t,
	f: !!n
} : e);
function Xi(e, t = null, n = null, r = 0, i = null, a = e === K ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Ji(t),
		ref: t && Yi(t),
		scopeId: Tn,
		slotScopeIds: null,
		children: n,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: i,
		dynamicChildren: null,
		appContext: null,
		ctx: U
	};
	return s ? (ra(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), Vi > 0 && !o && J && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && J.push(c), c;
}
var Y = Zi;
function Zi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === gr) && (e = q), Ki(e)) {
		let r = $i(e, t, !0);
		return n && ra(r, n), Vi > 0 && !a && J && (r.shapeFlag & 6 ? J[J.indexOf(e)] = r : J.push(r)), r.patchFlag = -2, r;
	}
	if (wa(e) && (e = e.__vccOpts), t) {
		t = Qi(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = k(e)), v(n) && (/* @__PURE__ */ Vt(n) && !d(n) && (n = s({}, n)), t.style = ue(n));
	}
	let o = g(e) ? 1 : Pi(e) ? 128 : Bn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return Xi(e, t, n, r, i, o, a, !0);
}
function Qi(e) {
	return e ? /* @__PURE__ */ Vt(e) || ci(e) ? s({}, e) : e : null;
}
function $i(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ia(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Ji(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(Yi(t)) : [a, Yi(t)] : Yi(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== K ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && $i(e.ssContent),
		ssFallback: e.ssFallback && $i(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Wn(u, c.clone(u)), u;
}
function ea(e = " ", t = 0) {
	return Y(Ii, null, e, t);
}
function ta(e = "", t = !1) {
	return t ? (zi(), Gi(q, null, e)) : Y(q, null, e);
}
function X(e) {
	return e == null || typeof e == "boolean" ? Y(q) : d(e) ? Y(K, null, e.slice()) : Ki(e) ? na(e) : Y(Ii, null, String(e));
}
function na(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : $i(e);
}
function ra(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), ra(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !ci(t) ? t._ctx = U : r === 3 && U && (U.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			ra(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: U
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [ea(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function ia(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = k([t.class, r.class]));
		else if (e === "style") t.style = ue([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function aa(e, t, n, r = null) {
	B(e, t, 7, [n, r]);
}
var oa = Ur(), sa = 0;
function ca(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || oa, o = {
		uid: sa++,
		vnode: e,
		type: i,
		parent: n,
		appContext: a,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new De(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: n ? n.provides : Object.create(a.provides),
		ids: n ? n.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: mi(i, a),
		emitsOptions: Zr(i, a),
		emit: null,
		emitted: null,
		propsDefaults: t,
		inheritAttrs: i.inheritAttrs,
		ctx: t,
		data: t,
		props: t,
		attrs: t,
		slots: t,
		refs: t,
		setupState: t,
		setupContext: null,
		suspense: r,
		suspenseId: r ? r.pendingId : 0,
		asyncDep: null,
		asyncResolved: !1,
		isMounted: !1,
		isUnmounted: !1,
		isDeactivated: !1,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = Yr.bind(null, o), e.ce && e.ce(o), o;
}
var Z = null, la = () => Z || U, ua, da;
{
	let e = le(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	ua = t("__VUE_INSTANCE_SETTERS__", (e) => Z = e), da = t("__VUE_SSR_SETTERS__", (e) => ha = e);
}
var fa = (e) => {
	let t = Z;
	return ua(e), e.scope.on(), () => {
		e.scope.off(), ua(t);
	};
}, pa = () => {
	Z && Z.scope.off(), ua(null);
};
function ma(e) {
	return e.vnode.shapeFlag & 4;
}
var ha = !1;
function ga(e, t = !1, n = !1) {
	t && da(t);
	let { props: r, children: i } = e.vnode, a = ma(e);
	li(e, r, a, t), Si(e, i, n || t);
	let o = a ? _a(e, t) : void 0;
	return t && da(!1), o;
}
function _a(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Er);
	let { setup: r } = n;
	if (r) {
		Ge();
		let n = e.setupContext = r.length > 1 ? xa(e) : null, i = fa(e), a = cn(r, e, 0, [e.props, n]), o = y(a);
		if (Ke(), i(), (o || e.sp) && !Zn(e) && Kn(e), o) {
			if (a.then(pa, pa), t) return a.then((n) => {
				da(!0);
				try {
					va(e, n, t);
				} finally {
					da(!1);
				}
			}).catch((t) => {
				ln(t, e, 0);
			});
			e.asyncDep = a;
		} else va(e, a, t);
	} else ya(e, t);
}
function va(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Xt(t)), ya(e, n);
}
function ya(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
	{
		let t = fa(e);
		Ge();
		try {
			Ar(e);
		} finally {
			Ke(), t();
		}
	}
}
var ba = { get(e, t) {
	return P(e, "get", ""), e[t];
} };
function xa(e) {
	return {
		attrs: new Proxy(e.attrs, ba),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Sa(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Xt(Ht(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in wr) return wr[n](e);
		},
		has(e, t) {
			return t in e || t in wr;
		}
	}) : e.proxy;
}
function Ca(e, t = !0) {
	return h(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function wa(e) {
	return h(e) && "__vccOpts" in e;
}
var Ta = (e, t) => /* @__PURE__ */ en(e, t, ha);
function Ea(e, t, n) {
	try {
		Hi(-1);
		let r = arguments.length;
		return r === 2 ? v(t) && !d(t) ? Ki(t) ? Y(e, null, [t]) : Y(e, t) : Y(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && Ki(n) && (n = [n]), Y(e, t, n));
	} finally {
		Hi(1);
	}
}
var Da = "3.5.43", Oa = void 0, ka = typeof window < "u" && window.trustedTypes;
if (ka) try {
	Oa = /* @__PURE__ */ ka.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Aa = Oa ? (e) => Oa.createHTML(e) : (e) => e, ja = "http://www.w3.org/2000/svg", Ma = "http://www.w3.org/1998/Math/MathML", Na = typeof document < "u" ? document : null, Pa = Na && /* @__PURE__ */ Na.createElement("template"), Fa = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Na.createElementNS(ja, e) : t === "mathml" ? Na.createElementNS(Ma, e) : n ? Na.createElement(e, { is: n }) : Na.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Na.createTextNode(e),
	createComment: (e) => Na.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Na.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Pa.innerHTML = Aa(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Pa.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Ia = /* @__PURE__ */ Symbol("_vtc");
function La(e, t, n) {
	let r = e[Ia];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Ra = /* @__PURE__ */ Symbol("_vod"), za = /* @__PURE__ */ Symbol("_vsh"), Ba = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[Ra] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Va(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), Va(e, !0), r.enter(e)) : r.leave(e, () => {
			Va(e, !1);
		}) : Va(e, t));
	},
	beforeUnmount(e, { value: t }) {
		Va(e, t);
	}
};
function Va(e, t) {
	e.style.display = t ? e[Ra] : "none", e[za] = !t;
}
var Ha = /* @__PURE__ */ Symbol(""), Ua = /(?:^|;)\s*display\s*:/;
function Wa(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) {
			if (g(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? Ka(r, t, "");
			}
			else for (let e in t) n[e] ?? Ka(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Ka(r, i, "") : Xa(e, i, !g(t) && t ? t[i] : void 0, o) || Ka(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Ha];
			e && (n += ";" + e), r.cssText = n, a = Ua.test(n);
		}
	} else t && e.removeAttribute("style");
	Ra in e && (e[Ra] = a ? r.display : "", e[za] && (r.display = "none"));
}
var Ga = /\s*!important$/;
function Ka(e, t, n) {
	if (d(n)) n.forEach((n) => Ka(e, t, n));
	else if (n ??= "", t.startsWith("--")) Ga.test(n) ? e.setProperty(t, n.replace(Ga, ""), "important") : e.setProperty(t, n);
	else {
		let r = Ya(e, t);
		Ga.test(n) ? e.setProperty(E(r), n.replace(Ga, ""), "important") : e[r] = n;
	}
}
var qa = [
	"Webkit",
	"Moz",
	"ms"
], Ja = {};
function Ya(e, t) {
	let n = Ja[t];
	if (n) return n;
	let r = T(t);
	if (r !== "filter" && r in e) return Ja[t] = r;
	r = ie(r);
	for (let n = 0; n < qa.length; n++) {
		let i = qa[n] + r;
		if (i in e) return Ja[t] = i;
	}
	return t;
}
function Xa(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var Za = "http://www.w3.org/1999/xlink";
function Qa(e, t, n, r, i, a = ge(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Za, t.slice(6, t.length)) : e.setAttributeNS(Za, t, n) : n == null || a && !_e(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function $a(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Aa(n) : n);
		return;
	}
	let a = e.tagName;
	if (t === "value" && a !== "PROGRESS" && !a.includes("-")) {
		let r = a === "OPTION" ? e.getAttribute("value") || "" : e.value, i = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
		(r !== i || !("_value" in e)) && (e.value = i), n ?? e.removeAttribute(t), e._value = n;
		return;
	}
	let o = !1;
	if (n === "" || n == null) {
		let r = typeof e[t];
		r === "boolean" ? n = _e(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function eo(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function to(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var no = /* @__PURE__ */ Symbol("_vei");
function ro(e, t, n, r, i = null) {
	let a = e[no] || (e[no] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = oo(t);
		r ? eo(e, n, a[t] = uo(r, i), s) : o && (to(e, n, o, s), a[t] = void 0);
	}
}
var io = /(Once|Passive|Capture)$/, ao = /^on:?(?:Once|Passive|Capture)$/;
function oo(e) {
	let t, n;
	for (; (n = e.match(io)) && !ao.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : E(e.slice(2)), t];
}
var so = 0, co = /* @__PURE__ */ Promise.resolve(), lo = () => so ||= (co.then(() => so = 0), Date.now());
function uo(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (d(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && B(e, t, 5, a);
			}
		} else B(r, t, 5, [e]);
	};
	return n.value = e, n.attached = lo(), n;
}
var fo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, po = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? La(e, r, c) : t === "style" ? Wa(e, n, r) : a(t) ? o(t) || ro(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : mo(e, t, r, c)) ? ($a(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Qa(e, t, r, c, s, t !== "value")) : e._isVueCE && (ho(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? $a(e, T(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Qa(e, t, r, c));
};
function mo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && fo(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return fo(t) && g(n) ? !1 : t in e;
}
function ho(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = T(t);
	return Array.isArray(n) ? n.some((e) => T(e) === r) : Object.keys(n).some((e) => T(e) === r);
}
var go = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => oe(t, e) : t;
};
function _o(e) {
	e.target.composing = !0;
}
function vo(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var yo = /* @__PURE__ */ Symbol("_assign"), bo = /* @__PURE__ */ Symbol("_initialValue");
function xo(e, t, n) {
	return t && (e = e.trim()), n && (e = se(e)), e;
}
var So = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[bo] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[bo] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[yo] = go(i);
		let a = r || i.props && i.props.type === "number";
		eo(e, t ? "change" : "input", (t) => {
			t.target.composing || e[yo](xo(e.value, n, a));
		}), (n || a) && eo(e, "change", () => {
			e.value = xo(e.value, n, a);
		}), t || (eo(e, "compositionstart", _o), eo(e, "compositionend", vo), eo(e, "change", vo));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[bo];
		delete e[bo], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[yo](xo(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[yo] = go(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? se(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Co = {
	deep: !0,
	created(e, t, n) {
		e[yo] = go(n), eo(e, "change", () => {
			let t = e._modelValue, n = Oo(e), r = e.checked, i = e[yo];
			if (d(t)) {
				let e = Se(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (p(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(ko(e, r));
		});
	},
	mounted: wo,
	beforeUpdate(e, t, n) {
		e[yo] = go(n), wo(e, t, n);
	}
};
function wo(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (d(t)) i = Se(t, r.props.value) > -1;
	else if (p(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = A(t, ko(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var To = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, eo(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? se(Oo(e)) : Oo(e)), r = e.multiple, i = r ? p(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? d(i) ? t.slice() : t : i];
			try {
				e[yo](i);
			} finally {
				gn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[yo] = go(r);
	},
	mounted(e, { value: t }) {
		Do(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[yo] = go(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !Eo(t, n[1], n[0])) && Do(e, t);
	}
};
function Eo(e, t, n) {
	if (!n || d(e)) return A(e, t);
	if (p(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function Do(e, t) {
	let n = e.multiple, r = d(t);
	if (!n || r || p(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = Oo(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : Se(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (A(Oo(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function Oo(e) {
	return "_value" in e ? e._value : e.value;
}
function ko(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var Ao = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], jo = {
	stop: (e) => e.stopPropagation(),
	prevent: (e) => e.preventDefault(),
	self: (e) => e.target !== e.currentTarget,
	ctrl: (e) => !e.ctrlKey,
	shift: (e) => !e.shiftKey,
	alt: (e) => !e.altKey,
	meta: (e) => !e.metaKey,
	left: (e) => "button" in e && e.button !== 0,
	middle: (e) => "button" in e && e.button !== 1,
	right: (e) => "button" in e && e.button !== 2,
	exact: (e, t) => Ao.some((n) => e[`${n}Key`] && !t.includes(n))
}, Mo = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = jo[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, No = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, Po = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = E(n.key);
		if (t.some((e) => e === r || No[e] === r)) return e(n);
	}));
}, Fo = /* @__PURE__ */ s({ patchProp: po }, Fa), Io;
function Lo() {
	return Io ||= wi(Fo);
}
var Ro = ((...e) => {
	let t = Lo().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Bo(e);
		if (!r) return;
		let i = t._component;
		!h(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, zo(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function zo(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Bo(e) {
	return g(e) ? document.querySelector(e) : e;
}
//#endregion
//#region resources/js/core/resourceVisual.js
var Q = [
	"base",
	"identity",
	"image"
], Vo = [
	"hidden",
	"center",
	"corner",
	"badge"
], Ho = [
	"small",
	"medium",
	"large",
	"max"
], Uo = [
	"top-left",
	"top-right",
	"bottom-left",
	"bottom-right"
], Wo = [
	"center",
	"corner",
	"badge"
], Go = Object.freeze({
	base: {
		style: "center",
		size: "medium",
		sizes: {
			center: "medium",
			corner: "medium",
			badge: "small"
		},
		position: "top-left",
		anchor: "image"
	},
	identity: {
		style: "badge",
		size: "small",
		sizes: {
			center: "medium",
			corner: "small",
			badge: "small"
		},
		position: "bottom-right",
		anchor: "image"
	},
	image: {
		style: "center",
		size: "large",
		sizes: {
			center: "large",
			corner: "medium",
			badge: "small"
		},
		position: "bottom-left",
		anchor: "base"
	},
	order: [
		"base",
		"image",
		"identity"
	],
	imageBackground: "auto"
}), Ko = (e, t, n) => {
	let r = /* @__PURE__ */ new Set([t]), i = n;
	for (; i;) {
		if (r.has(i)) return !1;
		r.add(i), i = e[i]?.style === "badge" ? e[i].anchor : null;
	}
	return Q.includes(n) && t !== n;
}, qo = (e) => {
	if (!e?.baseMode) return e || {};
	let t = {
		hidden: "hidden",
		center: "center",
		behind: "corner-large",
		badge: "badge",
		corner: "corner-large"
	};
	return {
		base: {
			style: t[e.baseMode],
			position: e.basePosition
		},
		identity: {
			style: t[e.identityMode],
			position: e.identityPosition,
			anchor: e.imageMode === "center" ? "image" : "base"
		},
		image: {
			style: e.imageMode === "center" ? "center-large" : t[e.imageMode],
			position: "bottom-left"
		},
		imageBackground: e.imageBackground
	};
}, Jo = (e = {}) => {
	if (Array.isArray(e.rules)) return { rules: es(e.rules) };
	let t = qo(e), n = {
		order: [],
		imageBackground: [
			"auto",
			"transparent",
			"checkerboard"
		].includes(t.imageBackground) ? t.imageBackground : "auto"
	};
	for (let e of Q) {
		let r = t[e] || {}, i = Go[e], a = /^(center|corner)-(small|medium|large|max)$/.exec(r.style || ""), o = a ? a[1] : Vo.includes(r.style) ? r.style : i.style, s = {};
		for (let e of Wo) {
			let t = r.sizes?.[e], n = a ? a[2] : r.size;
			s[e] = Ho.includes(t) ? t : !r.sizes && e === o && Ho.includes(n) ? n : i.sizes[e];
		}
		n[e] = {
			style: o,
			sizes: s,
			size: s[o] || s.center,
			position: Uo.includes(r.position) ? r.position : i.position,
			anchor: Q.includes(r.anchor) && r.anchor !== e ? r.anchor : i.anchor
		};
	}
	n.order = [.../* @__PURE__ */ new Set([...Array.isArray(t.order) ? t.order.filter((e) => Q.includes(e)) : Go.order, ...Go.order])];
	for (let e of Q) n[e].style === "badge" && !Ko(n, e, n[e].anchor) && (n[e].style = "corner", n[e].size = n[e].sizes.corner);
	return n;
}, Yo = (e = {}) => ({
	nodes: Jo(e.nodes || e),
	items: Jo(e.items || e)
}), Xo = (e, t = {}) => ["transparent", "checkerboard"].includes(t.imageBackground) ? t.imageBackground : e?.type === "image" && e?.kind !== "node" ? "checkerboard" : "transparent", Zo = (e) => e.style === "center" ? "center" : `${e.style}:${e.position}`, Qo = (e) => [...new Set(e.filter((e) => e && Q.includes(e.asset) && e.style !== "badge" && e.style !== "hidden").map(Zo))], $o = (e, t) => {
	let n = Q.includes(e.anchor) ? t.find((t) => t && t.asset === e.anchor && t.style !== "badge" && t.style !== "hidden") : null, r = n ? Zo(n) : e.anchor;
	return Qo(t).includes(r) ? r : "item";
}, es = (e) => e.filter((e) => e && Q.includes(e.asset)).map((t, n) => ({
	asset: t.asset,
	style: [
		"center",
		"corner",
		"badge"
	].includes(t.style) ? t.style : "center",
	size: Ho.includes(t.size) ? t.size : "medium",
	position: Uo.includes(t.position) ? t.position : "top-left",
	priority: Number.isInteger(Number(t.priority)) && Number(t.priority) > 0 ? Number(t.priority) : n + 1,
	anchor: $o(t, e)
})), ts = (e = {}) => {
	if (Array.isArray(e.rules)) return es(e.rules);
	if (!Q.some((t) => e[t]) && !e.baseMode) return [{
		asset: "base",
		style: "center",
		size: "medium",
		position: "top-left",
		anchor: "item",
		priority: 1
	}];
	let t = Jo(e), n = [];
	for (let e of [...t.order].reverse()) {
		let r = t[e];
		r.style !== "hidden" && n.push({
			asset: e,
			style: r.style,
			size: r.size,
			position: r.position,
			anchor: r.anchor
		});
	}
	for (let e of [...n]) e.style === "corner" && !n.some((t) => t.asset === e.asset && t.style === "center") && n.splice(n.indexOf(e), 0, {
		...e,
		style: "center",
		size: t[e.asset].sizes.center
	});
	return es(n);
}, ns = (e, t) => {
	let n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), i = [];
	return e.map((e, t) => ({
		rule: e,
		index: t
	})).sort((e, t) => (e.rule.priority ?? e.index + 1) - (t.rule.priority ?? t.index + 1) || e.index - t.index).forEach(({ rule: a, index: o }) => {
		let s = Zo(a);
		!t[a.asset] || n.has(a.asset) || r.has(s) || (n.add(a.asset), r.add(s), i.push({
			...a,
			ruleIndex: o,
			z: e.length - o
		}));
	}), i;
}, rs = {
	small: 25,
	medium: 50,
	large: 75,
	max: 100
}, is = (e, t, n, r = !1) => {
	let i = r ? {
		small: 60,
		medium: 60,
		large: 70,
		max: 70
	} : {
		small: 15,
		medium: 20,
		large: 25,
		max: 30
	}, a = r ? ["small", "medium"].includes(n) ? "large" : "max" : n, o = e === "badge" ? i[n] : rs[a], s = e === "center", c = Math.min(3, (100 - o) / 2);
	return {
		x: s ? (100 - o) / 2 : t.endsWith("right") ? 100 - c - o : c,
		y: s ? (100 - o) / 2 : t.startsWith("bottom") ? 100 - c - o : c,
		width: o,
		height: o
	};
}, as = (e, t) => {
	if (!Number.isFinite(t) || t <= 0) return e;
	let n = t >= 1 ? e.width : e.width * t, r = t >= 1 ? e.height / t : e.height;
	return {
		x: e.x + (e.width - n) / 2,
		y: e.y + (e.height - r) / 2,
		width: n,
		height: r
	};
}, os = (e, t, n, r) => {
	let i = r ? Math.min(e.width * .2, t.width / 2) : 0, a = r ? Math.min(e.height * .2, t.height / 2) : 0;
	return {
		...e,
		x: Math.max(0, Math.min(100 - e.width, (n.endsWith("right") ? t.x + t.width - i : t.x + i) - e.width / 2)),
		y: Math.max(0, Math.min(100 - e.height, (n.startsWith("bottom") ? t.y + t.height - a : t.y + a) - e.height / 2))
	};
}, ss = (e = {}, { settings: t = {}, background: n, availableAssets: r = {}, allowImage: i = !0, imageFailed: a = !1, open: o = !1, imageRatio: s = 1, iconRatios: c = {}, compact: l = !1, alignBaseStart: u = !1 } = {}) => {
	let d = Jo(t[e.kind === "node" || !e.kind ? "nodes" : "items"] || t), f = {
		base: o ? e.openIcon && e.closedIcon === e.icon ? e.openIcon : {
			"fas fa-folder": "fas fa-folder-open",
			"fas fa-box": "fas fa-box-open",
			"fas fa-tag": "fas fa-tags",
			"fas fa-users-rectangle": "fas fa-users-viewfinder",
			"fas fa-diagram-predecessor": "fas fa-diagram-successor",
			"icon-folder": "icon-folder-open"
		}[e.icon] || e.icon || "fas fa-file" : e.icon || "fas fa-file",
		identity: e.badgeIcon || "",
		image: i && !a && e.image || ""
	};
	e.kind === "item" && e.typeIcon && (f.base = e.typeIcon, f.identity = e.badgeIcon || (e.icon === e.typeIcon ? "" : e.icon) || "");
	for (let e of Q) r[e] === !1 && (f[e] = "");
	let p = e.visualPresentation;
	if (p === "icon" && (f.image = "", f.base = f.identity || f.base), p === "thumbnail" && f.image && (f.base = "", f.identity = ""), [
		"thumbnail",
		"icon",
		"both"
	].includes(p)) {
		let e = f.image ? [...p === "both" ? [{
			...d.rules?.find((e) => e.style === "badge" && ["identity", "base"].includes(e.asset)) || (d.identity?.style === "badge" ? d.identity : d.base?.style === "badge" ? d.base : Go.identity),
			asset: "base",
			style: "badge",
			anchor: "center",
			priority: 2
		}] : [], {
			asset: "image",
			style: "center",
			size: "large",
			position: "top-left",
			priority: 1
		}] : [{
			asset: "base",
			style: "center",
			size: "medium",
			position: "top-left",
			z: 1
		}];
		p === "both" && (f.base = f.identity || f.base), d.rules = es(e);
	}
	if (d.rules) {
		let t = ns(d.rules, f).map((e) => ({
			...e,
			icon: e.asset === "image" ? "" : f[e.asset],
			src: e.asset === "image" ? f.image : ""
		}));
		for (let e of t.filter((e) => e.style !== "badge")) {
			let t = is(e.style, e.position, e.size, l);
			t = as(t, e.asset === "image" ? s : c[e.icon] || 1), l && u && e.asset === "base" && e.style === "center" && (t.x = 0), e.box = t;
		}
		for (let e of t.filter((e) => e.style === "badge")) {
			let n = t.find((t) => t !== e && t.style !== "badge" && Zo(t) === e.anchor), r = n?.box || {
				x: 0,
				y: 0,
				width: 100,
				height: 100
			}, i = os(is("badge", e.position, e.size, l), r, e.position, !!n && !l);
			e.box = e.asset === "image" ? as(i, s) : i;
		}
		return {
			layers: t,
			background: Xo(e, { imageBackground: n || "auto" })
		};
	}
	let m = Q.filter((e) => f[e] && d[e].style !== "hidden").map((e) => ({
		asset: e,
		icon: e === "image" ? "" : f[e],
		src: e === "image" ? f.image : "",
		...d[e],
		z: d.order.indexOf(e) + 1
	}));
	if (!m.some((e) => e.style !== "badge")) {
		let e = m.find((e) => e.asset === "base");
		e ? (e.style = "center", e.size = d.base.sizes.center) : m.push({
			asset: "base",
			icon: f.base,
			src: "",
			style: "center",
			size: d.base.sizes.center,
			position: "top-left",
			anchor: "",
			z: d.order.indexOf("base") + 1
		});
	}
	if (!m.some((e) => e.style.startsWith("center"))) for (let e of m) e.style === "corner" && (e.style = "center", e.size = d[e.asset].sizes.center);
	let h = /* @__PURE__ */ new Map(), g = (e) => {
		if (h.has(e.asset)) return h.get(e.asset);
		let t = is(e.style, e.position, e.size, l);
		if (e.style === "badge") {
			let n = m.find((t) => t.asset === e.anchor) || m.filter((t) => t.asset !== e.asset && t.style !== "badge").sort((e, t) => rs[t.size] - rs[e.size])[0], r = n ? g(n) : {
				x: 4,
				y: 4,
				width: 92,
				height: 92
			};
			t = os(t, r, e.position, !!n && !l);
		}
		return e.asset === "image" ? t = as(t, s) : e.style !== "badge" && (t = as(t, c[e.icon] || 1)), l && u && e.asset === "base" && e.style === "center" && (t.x = 0), h.set(e.asset, t), t;
	};
	for (let e of m) e.box = g(e);
	return {
		layers: m,
		background: Xo(e, n ? { imageBackground: n } : d)
	};
};
//#endregion
//#region resources/js/core/imagePresentation.js
function cs(e) {
	let t = String(e || "").trim().replace(/^auto\s+|\s+auto$/g, "").split(/\s*\/\s*/);
	if (t.length > 2 || t.some((e) => !/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(e))) return null;
	let n = Number(t[0]), r = t.length === 2 ? Number(t[1]) : 1, i = n / r;
	return n > 0 && r > 0 && Number.isFinite(n) && Number.isFinite(r) && i > 0 && Number.isFinite(i) ? i : null;
}
function ls({ report: e = (e) => console.error(e) } = {}) {
	let t = [], n = () => {
		for (let n of t.reverse()) {
			n.abort.abort();
			try {
				n.cleanup?.();
			} catch (t) {
				e(t);
			}
			for (let [e, t, r] of n.styles) t ? n.image.style.setProperty(e, t, r) : n.image.style.removeProperty(e);
			try {
				n.context.notifyPresentationChange?.({
					providerId: n.id,
					phase: "removed"
				});
			} catch (t) {
				e(t);
			}
		}
		t = [];
	};
	return {
		sync(r, i, a) {
			if (n(), !r || !a?.resource?.id || a.resource.unavailable || r.getAttribute?.("data-sb-image-presentation") === "server") return;
			let o = /* @__PURE__ */ new Set();
			for (let n of [...i].sort((e, t) => (e.order ?? 100) - (t.order ?? 100))) {
				let i = new AbortController(), s = {
					...a,
					imageElement: r,
					getImageElement: () => i.signal.aborted ? null : r,
					signal: i.signal
				};
				for (let e of [
					"setValue",
					"setMetadata",
					"setAddress",
					"resetPreview",
					"refresh",
					"notifyPresentationChange"
				]) typeof a[e] == "function" && (s[e] = (...t) => {
					if (i.signal.aborted) throw Error("This image presentation is no longer active.");
					return a[e](...t);
				});
				let c;
				try {
					if (n.applies && !n.applies(s)) {
						i.abort();
						continue;
					}
					let l = n.styles || [];
					if (l.some((e) => o.has(e))) {
						i.abort();
						continue;
					}
					if (c = {
						image: r,
						abort: i,
						context: a,
						id: n.id,
						styles: l.map((e) => [
							e,
							r.style.getPropertyValue(e),
							r.style.getPropertyPriority(e)
						])
					}, t.push(c), c.cleanup = n.apply(r, s), c.cleanup != null && typeof c.cleanup != "function") throw TypeError("Image presentation apply must return cleanup or undefined.");
					l.forEach((e) => o.add(e));
					try {
						a.notifyPresentationChange?.({
							providerId: n.id,
							phase: "applied"
						});
					} catch (t) {
						e(t);
					}
				} catch (o) {
					if (e(o), i.abort(), c) {
						t.pop();
						for (let [e, t, n] of c.styles) t ? r.style.setProperty(e, t, n) : r.style.removeProperty(e);
						try {
							a.notifyPresentationChange?.({
								providerId: n.id,
								phase: "removed"
							});
						} catch (t) {
							e(t);
						}
					}
				}
			}
		},
		destroy: n
	};
}
//#endregion
//#region resources/js/core/visualStyleVariables.js
var us = [
	"base",
	"identity",
	"image"
], ds = 0, fs, ps = () => `sbv${++ds}`, $ = (e) => Number.isFinite(e) ? Math.round(e * 1e3) / 1e3 : 0, ms = (e, t, n = 180) => {
	let r = e.find((e) => e.src), i = Math.max(26, ...e.filter((e) => !e.src).map((e) => n * e.box.height / 100)), a = Math.min(n, t) / 100, o = (e) => r && e.style === "badge" && (e.anchor === "image" || e.anchor === (r.style === "center" ? "center" : `${r.style}:${r.position}`)), s = r ? Math.max(0, ...e.filter(o).map((e) => Math.max(r.box.y - e.box.y, e.box.y + e.box.height - r.box.y - r.box.height) * a)) : 0, c = Math.max(i, r ? Math.max(Math.min(n, t) * Math.min(1, r.box.height / r.box.width), r.box.height * a + s * 2) : Math.min(n, t));
	return {
		height: c,
		layers: e.map((e) => {
			let i = e.box, s = i.width * a, l = i.height * a, u = Math.min(t, n), d = e.src ? (t - s) / 2 : (t - u) / 2 + i.x / Math.max(1, 100 - i.width) * Math.max(0, u - s), f = e.src ? (c - l) / 2 : o(e) ? (c - r.box.height * a) / 2 + (i.y - r.box.y) * a : i.y / Math.max(1, 100 - i.height) * Math.max(0, c - l);
			return {
				...e,
				fontHeight: e.src ? void 0 : n * i.height / 100,
				box: {
					x: d / t * 100,
					y: f / c * 100,
					width: s / t * 100,
					height: l / c * 100
				}
			};
		})
	};
}, hs = (e, t, n) => {
	if (!/^sbv\d+$/.test(e)) throw Error("Invalid visual style ID");
	return t.filter((e) => us.includes(e.asset)).map((t) => {
		let r = t.box, i = (t.fontHeight ?? n * r.height / 100) * (t.style === "badge" ? .65 : 1);
		return t.crop ? `[data-sb-visual="${e}"] > .asset-${t.asset} { --sb-visual-x: ${$(r.x)}%; --sb-visual-y: ${$(r.y)}%; --sb-visual-width: ${$(r.width)}%; --sb-visual-height: ${$(r.height)}%; --sb-visual-level: ${$(t.z)}; --sb-visual-font-size: ${$(i)}px; --sb-crop-x: ${$(t.crop.x)}%; --sb-crop-y: ${$(t.crop.y)}%; --sb-crop-width: ${$(t.crop.width)}%; --sb-crop-height: ${$(t.crop.height)}%; }` : `[data-sb-visual="${e}"] > .asset-${t.asset} { --sb-visual-x: ${$(r.x)}%; --sb-visual-y: ${$(r.y)}%; --sb-visual-width: ${$(r.width)}%; --sb-visual-height: ${$(r.height)}%; --sb-visual-level: ${$(t.z)}; --sb-visual-font-size: ${$(i)}px; }`;
	}).join("\n");
}, gs = (e) => {
	let t = /* @__PURE__ */ new Map(), n, r = !1, i = () => {
		r || (r = !0, queueMicrotask(() => {
			if (r = !1, !t.size) {
				n?.remove(), n = null;
				return;
			}
			n || (n = e.createElement("style"), n.dataset.sbVisualVariables = "", e.head.append(n)), n.textContent = [...t.values()].join("\n");
		}));
	};
	return {
		update(e, n, r, a) {
			let o = hs(e, n, r) + (a === void 0 ? "" : `\n[data-sb-visual="${e}"] { position: relative; inset: auto; width: 100%; height: ${$(a)}px; }`);
			t.get(e) !== o && (t.set(e, o), i());
		},
		remove(e) {
			t.delete(e) && i();
		}
	};
}, _s = () => fs ||= gs(document), vs = ["data-sb-visual"], ys = ["src"], bs = ["data-visual-icon"], xs = {
	__name: "ResourceVisual",
	props: {
		resource: Object,
		settings: Object,
		background: String,
		availableAssets: Object,
		variant: {
			type: String,
			default: "grid"
		},
		allowImage: {
			type: Boolean,
			default: !0
		},
		open: Boolean,
		alignBaseStart: Boolean,
		fitContent: Boolean,
		presentationManaged: Boolean
	},
	emits: ["image-change"],
	setup(e, { expose: t, emit: n }) {
		let r = ps(), i = e, a = n, o = () => m.value?.querySelector(".asset-image > img.resource-visual-image") || null, s = /* @__PURE__ */ Wt(null), c = () => {
			let e = o(), t = i.presentationManaged && e ? cs(e.ownerDocument.defaultView.getComputedStyle(e).aspectRatio) : null;
			s.value !== t && (s.value = t);
		};
		t({
			getImageElement: o,
			refreshPresentation: c
		}), Fn(() => i.resource.image, () => {
			s.value = null;
		}, { flush: "sync" });
		let l = Ta(() => i.fitContent), u = /* @__PURE__ */ Wt({
			width: 180,
			height: 180
		}), d = jn("smartBrowserOptions", {}), f = /* @__PURE__ */ Wt(null), p = /* @__PURE__ */ Wt({
			url: "",
			ratio: 1
		}), m = /* @__PURE__ */ Wt(null), h = /* @__PURE__ */ Wt(i.variant === "compact" ? 18 : 180), g = /* @__PURE__ */ Wt({}), _ = /* @__PURE__ */ new Set(), v, y = () => {
			for (let e of _) m.value.contains(e) || (v.unobserve(e), _.delete(e));
			for (let e of m.value.querySelectorAll("[data-visual-icon]")) _.has(e) || (v.observe(e), _.add(e));
		};
		or(() => {
			w(), v = new ResizeObserver((e) => {
				for (let t of e) if (t.target === m.value) h.value = Math.min(t.contentRect.width, t.contentRect.height), u.value = {
					width: t.contentRect.width,
					height: t.contentRect.height
				};
				else if (t.contentRect.width && t.contentRect.height) {
					let e = t.target.dataset.visualIcon, n = Math.round(t.contentRect.width / t.contentRect.height * 100) / 100;
					Math.abs((g.value[e] || 0) - n) > .001 && (g.value = {
						...g.value,
						[e]: n
					});
				}
			}), v.observe(m.value), y(), a("image-change", o());
		}), cr(() => {
			v && y(), a("image-change", o());
		}), lr(() => {
			a("image-change", null), v?.disconnect(), _s().remove(r);
		});
		let b = (e) => {
			p.value = {
				url: i.resource.image,
				ratio: e.target.naturalWidth / e.target.naturalHeight
			}, c();
		}, x = Ta(() => i.presentationManaged ? null : i.resource.imageCrop?.source === i.resource.image ? i.resource.imageCrop : null), S = Ta(() => {
			if (!i.presentationManaged || !s.value) return null;
			let e = !l.value && u.value.width > 0 && u.value.height > 0 ? u.value.height / u.value.width : 1;
			return s.value * e;
		}), C = Ta(() => ss(i.resource, {
			settings: i.settings ?? i.resource.collectionVisualSettings ?? d.visualSettings ?? {},
			allowImage: i.allowImage,
			open: i.open,
			background: i.background ?? i.resource.collectionImageBackground ?? d.imageBackground ?? "auto",
			availableAssets: i.availableAssets,
			compact: i.variant === "compact",
			alignBaseStart: i.alignBaseStart,
			iconRatios: g.value,
			imageFailed: !!(i.resource.image && f.value === i.resource.image),
			imageRatio: S.value || x.value?.ratio || (p.value.url === i.resource.image ? p.value.ratio : 1)
		})), w = () => {
			let e = l.value ? ms(C.value.layers, u.value.width) : {
				layers: C.value.layers,
				side: h.value
			};
			_s().update(r, e.layers.map((e) => ({
				...e,
				crop: e.src ? x.value : null
			})), l.value ? e.height : e.side, l.value ? e.height : void 0);
		};
		return Fn([
			C,
			h,
			u,
			l
		], () => {
			m.value && w();
		}, { flush: "post" }), (t, n) => (zi(), Wi("span", {
			ref_key: "surface",
			ref: m,
			class: k(["resource-visual-content", `visual-${e.variant}`]),
			"data-sb-visual": Jt(r),
			"aria-hidden": "true"
		}, [(zi(!0), Wi(K, null, br(C.value.layers, (t) => (zi(), Wi("span", {
			key: t.asset,
			class: k(["resource-visual-layer", [
				`asset-${t.asset}`,
				`style-${t.style}`,
				{
					"resource-node-visual-symbol": t.style === "badge",
					"has-image-crop": t.src && x.value
				}
			]])
		}, [t.src ? (zi(), Wi("img", {
			key: 0,
			class: k(["resource-visual-image", { "image-background": C.value.background === "checkerboard" }]),
			src: t.src,
			alt: "",
			loading: "lazy",
			onLoad: b,
			onError: n[0] ||= (t) => f.value = e.resource.image
		}, null, 42, ys)) : (zi(), Wi("span", {
			key: 1,
			class: k(["resource-visual-icon", t.icon]),
			"data-visual-icon": t.icon
		}, null, 10, bs))], 2))), 128))], 10, vs));
	}
};
//#endregion
export { lr as A, Dn as B, ea as C, Or as D, jn as E, xr as F, Gt as G, Oe as H, _r as I, ue as J, Jt as K, Gn as L, cr as M, zi as N, ia as O, br as P, qr as R, Wi as S, Ea as T, Ft as U, On as V, Wt as W, we as Y, K as _, ns as a, Gi as b, Uo as c, Co as d, To as f, Mo as g, Po as h, es as i, or as j, gn as k, Ho as l, Ba as m, ls as n, ts as o, So as p, k as q, Yo as r, Qo as s, xs as t, Ro as u, Ta as v, Y as w, ta as x, Xi as y, Fn as z };
