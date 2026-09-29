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
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", w = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ee = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), T = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, E = /-\w/g, D = T((e) => e.replace(E, (e) => e.slice(1).toUpperCase())), O = /\B([A-Z])/g, k = T((e) => e.replace(O, "-$1").toLowerCase()), te = T((e) => e.charAt(0).toUpperCase() + e.slice(1)), ne = T((e) => e ? `on${te(e)}` : ""), re = (e, t) => !Object.is(e, t), ie = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, A = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, j = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, ae, oe = () => ae ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function se(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? de(r) : se(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (g(e) || v(e)) return e;
}
var ce = /;(?![^(]*\))/g, le = /:([^]+)/, ue = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function de(e) {
	let t = {};
	return e.replace(ue, (e) => e.startsWith("/*") ? "" : e).split(ce).forEach((e) => {
		if (e) {
			let n = e.split(le);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function M(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = M(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var fe = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", pe = /* @__PURE__ */ e(fe);
fe + "";
function me(e) {
	return !!e || e === "";
}
function he(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = N(e[i], t[i], n);
	return r;
}
function ge(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && N(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function _e(e, t, n) {
	let r = f(e), i = f(t);
	if (r || i || (r = p(e), i = p(t), r || i)) return r && i ? ge(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !N(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function ve(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function N(e, t, n) {
	if (e === t) return !0;
	let r = m(e), i = m(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = _(e), i = _(t), r || i ? e === t : (r = d(e), i = d(t), r || i ? r && i ? ve(e, t, n, he) : !1 : (r = v(e), i = v(t), r || i ? !r || !i ? !1 : ve(e, t, n, _e) : String(e) === String(t))));
}
function ye(e, t) {
	return e.findIndex((e) => N(e, t));
}
var be = (e) => !!(e && e.__v_isRef === !0), P = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? be(e) ? P(e.value) : JSON.stringify(e, xe, 2) : String(e), xe = (e, t) => be(t) ? xe(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Se(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Se(e)) } : _(t) ? Se(t) : v(t) && !d(t) && !C(t) ? String(t) : t, Se = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, F, Ce = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && F && (F.active ? (this.parent = F, this.index = (F.scopes || (F.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = F;
			try {
				return F = this, e();
			} finally {
				F = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = F, F = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (F === this) F = this.prevScope;
			else {
				let e = F;
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
function we() {
	return F;
}
var I, Te = /* @__PURE__ */ new WeakSet(), Ee = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, F && (F.active ? F.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Te.has(this) && (Te.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ae(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Ue(this), Ne(this);
		let e = I, t = ze;
		I = this, ze = !0;
		try {
			return this.fn();
		} finally {
			Pe(this), I = e, ze = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Le(e);
			this.deps = this.depsTail = void 0, Ue(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Te.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Fe(this) && this.run();
	}
	get dirty() {
		return Fe(this);
	}
}, De = 0, Oe, ke;
function Ae(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = ke, ke = e;
		return;
	}
	e.next = Oe, Oe = e;
}
function je() {
	De++;
}
function Me() {
	if (--De > 0) return;
	if (ke) {
		let e = ke;
		for (ke = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Oe;) {
		let t = Oe;
		for (Oe = void 0; t;) {
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
function Ne(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Pe(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Le(r), Re(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Fe(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ie(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ie(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === We) || (e.globalVersion = We, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Fe(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = I, r = ze;
	I = e, ze = !0;
	try {
		Ne(e);
		let n = e.fn(e._value);
		(t.version === 0 || re(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		I = n, ze = r, Pe(e), e.flags &= -3;
	}
}
function Le(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Le(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Re(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var ze = !0, Be = [];
function Ve() {
	Be.push(ze), ze = !1;
}
function He() {
	let e = Be.pop();
	ze = e === void 0 || e;
}
function Ue(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = I;
		I = void 0;
		try {
			t();
		} finally {
			I = e;
		}
	}
}
var We = 0, Ge = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Ke = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!I || !ze || I === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== I) t = this.activeLink = new Ge(I, this), I.deps ? (t.prevDep = I.depsTail, I.depsTail.nextDep = t, I.depsTail = t) : I.deps = I.depsTail = t, qe(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = I.depsTail, t.nextDep = void 0, I.depsTail.nextDep = t, I.depsTail = t, I.deps === t && (I.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, We++, this.notify(e);
	}
	notify(e) {
		je();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Me();
		}
	}
};
function qe(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) qe(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Je = /* @__PURE__ */ new WeakMap(), Ye = /* @__PURE__ */ Symbol(""), Xe = /* @__PURE__ */ Symbol(""), Ze = /* @__PURE__ */ Symbol("");
function L(e, t, n) {
	if (ze && I) {
		let t = Je.get(e);
		t || Je.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Ke()), r.map = t, r.key = n), r.track();
	}
}
function Qe(e, t, n, r, i, a) {
	let o = Je.get(e);
	if (!o) {
		We++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (je(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Ze || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Ze)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Ye)), f(e) && s(o.get(Xe)));
				break;
			case "delete":
				i || (s(o.get(Ye)), f(e) && s(o.get(Xe)));
				break;
			case "set": f(e) && s(o.get(Ye));
		}
	}
	Me();
}
function $e(e) {
	let t = /* @__PURE__ */ R(e);
	return t === e || (L(t, "iterate", Ze), /* @__PURE__ */ Rt(e)) ? t : /* @__PURE__ */ Lt(e) ? /* @__PURE__ */ It(e) ? t.map((e) => Ht(Vt(e))) : t.map(Ht) : t.map(Vt);
}
function et(e) {
	return L(e = /* @__PURE__ */ R(e), "iterate", Ze), e;
}
function tt(e, t) {
	return /* @__PURE__ */ Lt(e) ? Ht(/* @__PURE__ */ It(e) ? Vt(t) : t) : Vt(t);
}
var nt = {
	__proto__: null,
	[Symbol.iterator]() {
		return rt(this, Symbol.iterator, (e) => tt(this, e));
	},
	concat(...e) {
		return $e(this).concat(...e.map((e) => d(e) ? $e(e) : e));
	},
	entries() {
		return rt(this, "entries", (e) => (e[1] = tt(this, e[1]), e));
	},
	every(e, t) {
		return at(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return at(this, "filter", e, t, (e) => e.map((e) => tt(this, e)), arguments);
	},
	find(e, t) {
		return at(this, "find", e, t, (e) => tt(this, e), arguments);
	},
	findIndex(e, t) {
		return at(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return at(this, "findLast", e, t, (e) => tt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return at(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return at(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return st(this, "includes", e);
	},
	indexOf(...e) {
		return st(this, "indexOf", e);
	},
	join(e) {
		return $e(this).join(e);
	},
	lastIndexOf(...e) {
		return st(this, "lastIndexOf", e);
	},
	map(e, t) {
		return at(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return ct(this, "pop");
	},
	push(...e) {
		return ct(this, "push", e);
	},
	reduce(e, ...t) {
		return ot(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return ot(this, "reduceRight", e, t);
	},
	shift() {
		return ct(this, "shift");
	},
	some(e, t) {
		return at(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return ct(this, "splice", e);
	},
	toReversed() {
		return $e(this).toReversed();
	},
	toSorted(e) {
		return $e(this).toSorted(e);
	},
	toSpliced(...e) {
		return $e(this).toSpliced(...e);
	},
	unshift(...e) {
		return ct(this, "unshift", e);
	},
	values() {
		return rt(this, "values", (e) => tt(this, e));
	}
};
function rt(e, t, n) {
	let r = et(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Rt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var it = Array.prototype;
function at(e, t, n, r, i, a) {
	let o = et(e), s = o !== e && !/* @__PURE__ */ Rt(e), c = o[t];
	if (c !== it[t]) {
		let t = c.apply(e, a);
		return s ? Vt(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, tt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function ot(e, t, n, r) {
	let i = et(e), a = i !== e && !/* @__PURE__ */ Rt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = tt(e, t)), n.call(this, t, tt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? tt(e, c) : c;
}
function st(e, t, n) {
	let r = /* @__PURE__ */ R(e);
	L(r, "iterate", Ze);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ zt(n[0]) ? (n[0] = /* @__PURE__ */ R(n[0]), r[t](...n)) : i;
}
function ct(e, t, n = []) {
	Ve(), je();
	let r = (/* @__PURE__ */ R(e))[t].apply(e, n);
	return Me(), He(), r;
}
var lt = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), ut = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function dt(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ R(this);
	return L(t, "has", e), t.hasOwnProperty(e);
}
var ft = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? At : kt : i ? Ot : Dt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = nt[t])) return e;
			if (t === "hasOwnProperty") return dt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ z(e) ? e : n);
		if ((_(t) ? ut.has(t) : lt(t)) || (r || L(e, "get", t), i)) return o;
		if (/* @__PURE__ */ z(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Pt(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Pt(o) : /* @__PURE__ */ Mt(o) : o;
	}
}, pt = class extends ft {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Lt(i);
			if (!/* @__PURE__ */ Rt(n) && !/* @__PURE__ */ Lt(n) && (i = /* @__PURE__ */ R(i), n = /* @__PURE__ */ R(n)), !a && /* @__PURE__ */ z(i) && !/* @__PURE__ */ z(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ z(e) ? e : r);
		return e === /* @__PURE__ */ R(r) && s && (o ? re(n, i) && Qe(e, "set", t, n, i) : Qe(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Qe(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!_(t) || !ut.has(t)) && L(e, "has", t), n;
	}
	ownKeys(e) {
		return L(e, "iterate", d(e) ? "length" : Ye), Reflect.ownKeys(e);
	}
}, mt = class extends ft {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, ht = /* @__PURE__ */ new pt(), gt = /* @__PURE__ */ new mt(), _t = /* @__PURE__ */ new pt(!0), vt = (e) => e, yt = (e) => Reflect.getPrototypeOf(e);
function bt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ R(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? vt : t ? Ht : Vt;
		return !t && L(a, "iterate", l ? Xe : Ye), s(Object.create(u), { next() {
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
function xt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function St(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ R(r), a = /* @__PURE__ */ R(n);
			e || (re(n, a) && L(i, "get", n), L(i, "get", a));
			let { has: o } = yt(i), s = t ? vt : e ? Ht : Vt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && L(/* @__PURE__ */ R(t), "iterate", Ye), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ R(n), i = /* @__PURE__ */ R(t);
			return e || (re(t, i) && L(r, "has", t), L(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ R(a), s = t ? vt : e ? Ht : Vt;
			return !e && L(o, "iterate", Ye), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: xt("add"),
		set: xt("set"),
		delete: xt("delete"),
		clear: xt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ R(this), r = yt(n), i = /* @__PURE__ */ R(e), a = !t && !/* @__PURE__ */ Rt(e) && !/* @__PURE__ */ Lt(e) ? i : e;
			return r.has.call(n, a) || re(e, a) && r.has.call(n, e) || re(i, a) && r.has.call(n, i) || (n.add(a), Qe(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Rt(n) && !/* @__PURE__ */ Lt(n) && (n = /* @__PURE__ */ R(n));
			let r = /* @__PURE__ */ R(this), { has: i, get: a } = yt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ R(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? re(n, s) && Qe(r, "set", e, n, s) : Qe(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ R(this), { has: n, get: r } = yt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ R(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Qe(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ R(this), t = e.size !== 0, n = e.clear();
			return t && Qe(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = bt(r, e, t);
	}), n;
}
function Ct(e, t) {
	let n = St(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(u(n, r) && r in t ? n : t, r, i);
}
var wt = { get: /* @__PURE__ */ Ct(!1, !1) }, Tt = { get: /* @__PURE__ */ Ct(!1, !0) }, Et = { get: /* @__PURE__ */ Ct(!0, !1) }, Dt = /* @__PURE__ */ new WeakMap(), Ot = /* @__PURE__ */ new WeakMap(), kt = /* @__PURE__ */ new WeakMap(), At = /* @__PURE__ */ new WeakMap();
function jt(e) {
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
function Mt(e) {
	return /* @__PURE__ */ Lt(e) ? e : Ft(e, !1, ht, wt, Dt);
}
// @__NO_SIDE_EFFECTS__
function Nt(e) {
	return Ft(e, !1, _t, Tt, Ot);
}
// @__NO_SIDE_EFFECTS__
function Pt(e) {
	return Ft(e, !0, gt, Et, kt);
}
function Ft(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = jt(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return /* @__PURE__ */ Lt(e) ? /* @__PURE__ */ It(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Rt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function R(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ R(t) : e;
}
function Bt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && A(e, "__v_skip", !0), e;
}
var Vt = (e) => v(e) ? /* @__PURE__ */ Mt(e) : e, Ht = (e) => v(e) ? /* @__PURE__ */ Pt(e) : e;
// @__NO_SIDE_EFFECTS__
function z(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function B(e) {
	return Ut(e, !1);
}
function Ut(e, t) {
	return /* @__PURE__ */ z(e) ? e : new Wt(e, t);
}
var Wt = class {
	constructor(e, t) {
		this.dep = new Ke(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ R(e), this._value = t ? e : Vt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Rt(e) || /* @__PURE__ */ Lt(e);
		e = n ? e : /* @__PURE__ */ R(e), re(e, t) && (this._rawValue = e, this._value = n ? e : Vt(e), this.dep.trigger());
	}
};
function V(e) {
	return /* @__PURE__ */ z(e) ? e.value : e;
}
var Gt = {
	get: (e, t, n) => t === "__v_raw" ? e : V(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ z(i) && !/* @__PURE__ */ z(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Kt(e) {
	return /* @__PURE__ */ It(e) ? e : new Proxy(e, Gt);
}
var qt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ke(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = We - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && I !== this) return Ae(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Ie(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Jt(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new qt(r, i, n);
}
var Yt = {}, Xt = /* @__PURE__ */ new WeakMap(), Zt = void 0;
function Qt(e, t = !1, n = Zt) {
	if (n) {
		let t = Xt.get(n);
		t || Xt.set(n, t = []), t.push(e);
	}
}
function $t(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ Rt(e) || o === !1 || o === 0 ? en(e, 1) : en(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ z(e) ? (g = () => e.value, y = /* @__PURE__ */ Rt(e)) : /* @__PURE__ */ It(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ It(e) || /* @__PURE__ */ Rt(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ z(e)) return e.value;
		if (/* @__PURE__ */ It(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			Ve();
			try {
				_();
			} finally {
				He();
			}
		}
		let t = Zt;
		Zt = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			Zt = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => en(e(), t);
	}
	let x = we(), S = () => {
		m.stop(), x && x.active && c(x.effects, m);
	};
	if (s && n) {
		let e = n;
		n = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(Yt) : Yt, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (n) {
				let t = m.run();
				if (e || o || y || (b ? t.some((e, t) => re(e, C[t])) : re(t, C))) {
					_ && _();
					let e = Zt;
					Zt = m;
					try {
						let e = [
							t,
							C === Yt ? void 0 : b && C[0] === Yt ? [] : C,
							v
						];
						C = t, f ? f(n, 3, e) : n(...e);
					} finally {
						Zt = e;
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new Ee(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => Qt(e, !1, m), _ = m.onStop = () => {
		let e = Xt.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			Xt.delete(m);
		}
	}, n ? a ? w(!0) : C = m.run() : l ? l(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function en(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ z(e)) en(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) en(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		en(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) en(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && en(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function tn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		rn(e, t, n);
	}
}
function nn(e, t, n, r) {
	if (h(e)) {
		let i = tn(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			rn(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(nn(e[a], t, n, r));
		return i;
	}
}
function rn(e, n, r, i = !0) {
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
			Ve(), tn(o, null, 10, [
				e,
				i,
				a
			]), He();
			return;
		}
	}
	an(e, r, a, i, s);
}
function an(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var on = [], sn = -1, cn = [], ln = null, un = 0, dn = /* @__PURE__ */ Promise.resolve(), fn = null;
function pn(e) {
	let t = fn || dn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function mn(e) {
	let t = sn + 1, n = on.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = on[r], a = bn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function hn(e) {
	if (!(e.flags & 1)) {
		let t = bn(e), n = on[on.length - 1];
		!n || !(e.flags & 2) && t >= bn(n) ? on.push(e) : on.splice(mn(t), 0, e), e.flags |= 1, gn();
	}
}
function gn() {
	fn ||= dn.then(xn);
}
function _n(e) {
	if (!d(e)) ln && e.id === -1 ? ln.splice(un + 1, 0, e) : e.flags & 1 || (cn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) cn.push(e[t]);
	gn();
}
function vn(e, t, n = sn + 1) {
	for (; n < on.length; n++) {
		let t = on[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			on.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function yn(e) {
	if (cn.length) {
		let e = [...new Set(cn)].sort((e, t) => bn(e) - bn(t));
		if (cn.length = 0, ln) {
			for (let t = 0; t < e.length; t++) ln.push(e[t]);
			return;
		}
		for (ln = e, un = 0; un < ln.length; un++) {
			let e = ln[un];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		ln = null, un = 0;
	}
}
var bn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function xn(e) {
	try {
		for (sn = 0; sn < on.length; sn++) {
			let e = on[sn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), tn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; sn < on.length; sn++) {
			let e = on[sn];
			e && (e.flags &= -2);
		}
		sn = -1, on.length = 0, yn(e), fn = null, (on.length || cn.length) && xn(e);
	}
}
var Sn = null, Cn = null;
function wn(e) {
	let t = Sn;
	return Sn = e, Cn = e && e.type.__scopeId || null, t;
}
function Tn(e, t = Sn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Ii(-1);
		let i = wn(t), a = Mi.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Mi.length; e > a; e--) Pi();
			wn(i), r._d && Ii(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function En(e, n) {
	if (Sn === null) return e;
	let r = pa(Sn), i = e.dirs ||= [];
	for (let e = 0; e < n.length; e++) {
		let [a, o, s, c = t] = n[e];
		a && (h(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && en(o), i.push({
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
function Dn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ve(), nn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), He());
	}
}
function On(e, t) {
	if (X) {
		let n = X.provides, r = X.parent && X.parent.provides;
		r === n && (n = X.provides = Object.create(r)), n[e] = t;
	}
}
function kn(e, t, n = !1) {
	let r = ea();
	if (r || zr) {
		let i = zr ? zr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var An = /* @__PURE__ */ Symbol.for("v-scx"), jn = () => kn(An);
function Mn(e, t, n) {
	return Nn(e, t, n);
}
function Nn(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (oa) {
		if (c === "sync") {
			let e = jn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = X;
	u.call = (e, t, n) => nn(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		gi(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : hn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = $t(e, n, u);
	return oa && (f ? f.push(h) : d && h()), h;
}
function Pn(e, t, n) {
	let r = this.proxy, i = g(e) ? e.includes(".") ? Fn(r, e) : () => r[e] : e.bind(r, r), a;
	h(t) ? a = t : (a = t.handler, n = t);
	let o = ra(this), s = Nn(i, a.bind(r), n);
	return o(), s;
}
function Fn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var In = /* @__PURE__ */ Symbol("_vte"), Ln = (e) => e.__isTeleport, Rn = /* @__PURE__ */ Symbol("_leaveCb");
function zn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Ai) {
			t = n;
			break;
		}
	}
	return t;
}
function Bn(e) {
	if (!Jn(e)) return Ln(e.type) && e.children ? zn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && h(n.default)) return n.default();
	}
}
function Vn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Vn(Ln(n.type) && Bn(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Hn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Un(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Wn = /* @__PURE__ */ new WeakMap();
function Gn(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => Gn(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (qn(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && Gn(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? pa(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ R(v), b = v === t ? i : (e) => !Un(_, e) && u(y, e), x = (e, t) => !(t && Un(_, t));
	if (m != null && m !== p) {
		if (Kn(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ z(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) tn(p, f, 12, [l, _]);
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
					i(), Wn.delete(e);
				};
				t.id = -1, Wn.set(e, t), gi(t, r);
			} else Kn(e), i();
		}
	}
}
function Kn(e) {
	let t = Wn.get(e);
	t && (t.flags |= 8, Wn.delete(e));
}
oe().requestIdleCallback, oe().cancelIdleCallback;
var qn = (e) => !!e.type.__asyncLoader, Jn = (e) => e.type.__isKeepAlive;
function Yn(e, t) {
	Zn(e, "a", t);
}
function Xn(e, t) {
	Zn(e, "da", t);
}
function Zn(e, t, n = X) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if ($n(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Jn(e.parent.vnode) && Qn(r, t, n, e), e = e.parent;
	}
}
function Qn(e, t, n, r) {
	let i = $n(t, e, r, !0);
	or(() => {
		c(r[t], i);
	}, n);
}
function $n(e, t, n = X, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ve();
			let i = ra(n), a = nn(t, n, e, r);
			return i(), He(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var er = (e) => (t, n = X) => {
	(!oa || e === "sp") && $n(e, (...e) => t(...e), n);
}, tr = er("bm"), nr = er("m"), rr = er("bu"), ir = er("u"), ar = er("bum"), or = er("um"), sr = er("sp"), cr = er("rtg"), lr = er("rtc");
function ur(e, t = X) {
	$n("ec", e, t);
}
var dr = "components", fr = /* @__PURE__ */ Symbol.for("v-ndc");
function pr(e) {
	return g(e) ? mr(dr, e, !1) || e : e || fr;
}
function mr(e, t, n = !0, r = !1) {
	let i = Sn || X;
	if (i) {
		let n = i.type;
		if (e === dr) {
			let e = ma(n, !1);
			if (e && (e === t || e === D(t) || e === te(D(t)))) return n;
		}
		let a = hr(i[e] || n[e], t) || hr(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function hr(e, t) {
	return e && (e[t] || e[D(t)] || e[te(D(t))]);
}
function H(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ It(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Rt(e), s = /* @__PURE__ */ Lt(e), e = et(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Ht(Vt(e[n])) : Vt(e[n]) : e[n], n, void 0, a && a[n]);
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
var gr = (e) => e ? aa(e) ? pa(e) : gr(e.parent) : null, _r = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => gr(e.parent),
	$root: (e) => gr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => Er(e),
	$forceUpdate: (e) => e.f ||= () => {
		hn(e.update);
	},
	$nextTick: (e) => e.n ||= pn.bind(e.proxy),
	$watch: (e) => Pn.bind(e)
}), vr = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), yr = {
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
			else if (vr(i, n)) return s[n] = 1, i[n];
			else if (a !== t && u(a, n)) return s[n] = 2, a[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else xr && (s[n] = 0);
		}
		let d = _r[n], f, p;
		if (d) return n === "$attrs" && L(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, n, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return vr(a, n) ? (a[n] = r, !0) : i !== t && u(i, n) ? (i[n] = r, !0) : u(e.props, n) || n[0] === "$" && n.slice(1) in e ? !1 : (o[n] = r, !0);
	},
	has({ _: { data: e, setupState: n, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== t && c[0] !== "$" && u(e, c) || vr(n, c) || u(o, c) || u(i, c) || u(_r, c) || u(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function br(e) {
	return d(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var xr = !0;
function Sr(e) {
	let t = Er(e), n = e.proxy, i = e.ctx;
	xr = !1, t.beforeCreate && wr(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: y, deactivated: b, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: ee, renderTracked: T, renderTriggered: E, errorCaptured: D, serverPrefetch: O, expose: k, inheritAttrs: te, components: ne, directives: re, filters: ie } = t;
	if (u && Cr(u, i, null), s) for (let e in s) {
		let t = s[e];
		h(t) && (i[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		v(t) && (e.data = /* @__PURE__ */ Mt(t));
	}
	if (xr = !0, o) for (let e in o) {
		let t = o[e], a = Z({
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
	if (c) for (let e in c) Tr(c[e], i, n, e);
	if (l) {
		let e = h(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			On(t, e[t]);
		});
	}
	f && wr(f, e, "c");
	function A(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (A(tr, p), A(nr, m), A(rr, g), A(ir, _), A(Yn, y), A(Xn, b), A(ur, D), A(lr, T), A(cr, E), A(ar, S), A(or, w), A(sr, O), d(k)) {
		if (k.length) {
			let t = e.exposed ||= {};
			k.forEach((e) => {
				Object.defineProperty(t, e, {
					get: () => n[e],
					set: (t) => n[e] = t,
					enumerable: !0
				});
			});
		} else e.exposed ||= {};
	}
	ee && e.render === r && (e.render = ee), te != null && (e.inheritAttrs = te), ne && (e.components = ne), re && (e.directives = re), O && Hn(e);
}
function Cr(e, t, n = r) {
	d(e) && (e = jr(e));
	for (let n in e) {
		let r = e[n], i;
		i = v(r) ? "default" in r ? kn(r.from || n, r.default, !0) : kn(r.from || n) : kn(r), /* @__PURE__ */ z(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function wr(e, t, n) {
	nn(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Tr(e, t, n, r) {
	let i = r.includes(".") ? Fn(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) && Mn(i, n);
	} else if (h(e)) Mn(i, e.bind(n));
	else if (v(e)) {
		if (d(e)) e.forEach((e) => Tr(e, t, n, r));
		else {
			let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
			h(r) && Mn(i, r, e);
		}
	}
}
function Er(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Dr(c, e, o, !0)), Dr(c, t, o)), v(t) && a.set(t, c), c;
}
function Dr(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Dr(e, a, n, !0), i && i.forEach((t) => Dr(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = Or[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Or = {
	data: kr,
	props: Pr,
	emits: Pr,
	methods: Nr,
	computed: Nr,
	beforeCreate: Mr,
	created: Mr,
	beforeMount: Mr,
	mounted: Mr,
	beforeUpdate: Mr,
	updated: Mr,
	beforeDestroy: Mr,
	beforeUnmount: Mr,
	destroyed: Mr,
	unmounted: Mr,
	activated: Mr,
	deactivated: Mr,
	errorCaptured: Mr,
	serverPrefetch: Mr,
	components: Nr,
	directives: Nr,
	watch: Fr,
	provide: kr,
	inject: Ar
};
function kr(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function Ar(e, t) {
	return Nr(jr(e), jr(t));
}
function jr(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function Mr(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Nr(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Pr(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), br(e), br(t ?? {})) : t;
}
function Fr(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = Mr(e[r], t[r]);
	return n;
}
function Ir() {
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
var Lr = 0;
function Rr(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = Ir(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: Lr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: ga,
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
					let u = l._ceVNode || q(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, pa(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				c && (nn(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = zr;
				zr = l;
				try {
					return e();
				} finally {
					zr = t;
				}
			}
		};
		return l;
	};
}
var zr = null, Br = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${D(t)}Modifiers`] || e[`${k(t)}Modifiers`];
function Vr(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && Br(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(j)));
	let c, l = i[c = ne(n)] || i[c = ne(D(n))];
	!l && o && (l = i[c = ne(k(n))]), l && nn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, nn(u, e, 6, a);
	}
}
var Hr = /* @__PURE__ */ new WeakMap();
function Ur(e, t, n = !1) {
	let r = n ? Hr : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, c = !1;
	if (!h(e)) {
		let r = (e) => {
			let n = Ur(e, t, !0);
			n && (c = !0, s(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !c ? (v(e) && r.set(e, null), null) : (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o);
}
function Wr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, k(t)) || u(e, t));
}
function Gr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = wn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Ki(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = Ki(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : Kr(c);
		}
	} catch (t) {
		Mi.length = 0, rn(t, e, 1), v = q(Ai);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = qr(y, a)), b = Gi(b, y, !1, !0));
	}
	return n.dirs && (b = Gi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Vn(Ln(b.type) && Bn(b) || b, n.transition), v = b, wn(_), v;
}
var Kr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, qr = (e, t) => {
	let n = {};
	for (let r in e) (!o(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Jr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Yr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Xr(o, r, n) && !Wr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Yr(r, o, l) : !!o;
	return !1;
}
function Yr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Xr(t, e, a) && !Wr(n, a)) return !0;
	}
	return !1;
}
function Xr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !N(r, i) : r !== i;
}
function Zr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Qr = {}, $r = () => Object.create(Qr), ei = (e) => Object.getPrototypeOf(e) === Qr;
function ti(e, t, n, r = !1) {
	let i = {}, a = $r();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), ri(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Nt(i) : e.type.props ? i : a, e.attrs = a;
}
function ni(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ R(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Wr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) {
					if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
					else {
						let t = D(o);
						i[t] = ii(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		ri(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !u(t, a) && ((r = k(a)) === a || !u(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = ii(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !u(t, e)) && (delete a[e], l = !0);
	}
	l && Qe(e.attrs, "set", "");
}
function ri(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (ee(t)) continue;
		let l = n[t], d;
		a && u(a, d = D(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : Wr(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ R(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = ii(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function ii(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = ra(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === k(n)) && (r = !0));
	}
	return r;
}
var ai = /* @__PURE__ */ new WeakMap();
function oi(e, r, i = !1) {
	let a = i ? ai : r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [], p = !1;
	if (!h(e)) {
		let t = (e) => {
			p = !0;
			let [t, n] = oi(e, r, !0);
			s(l, t), n && f.push(...n);
		};
		!i && r.mixins.length && r.mixins.forEach(t), e.extends && t(e.extends), e.mixins && e.mixins.forEach(t);
	}
	if (!c && !p) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = D(c[e]);
		si(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = D(e);
		if (si(t)) {
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
function si(e) {
	return e[0] !== "$" && !ee(e);
}
var ci = (e) => e === "_" || e === "_ctx" || e === "$stable", li = (e) => d(e) ? e.map(Ki) : [Ki(e)], ui = (e, t, n) => {
	if (t._n) return t;
	let r = Tn((...e) => li(t(...e)), n);
	return r._c = !1, r;
}, di = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (ci(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = ui(n, i, r);
		else if (i != null) {
			let e = li(i);
			t[n] = () => e;
		}
	}
}, fi = (e, t) => {
	let n = li(t);
	e.slots.default = () => n;
}, pi = (e, t, n) => {
	for (let r in t) (n || !ci(r)) && (e[r] = t[r]);
}, mi = (e, t, n) => {
	let r = e.slots = $r();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (pi(r, t, n), n && A(r, "_", e, !0)) : di(t, r);
	} else t && fi(e, t);
}, hi = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : pi(a, n, r) : (o = !n.$stable, di(n, a)), s = n;
	} else n && (fi(e, n), s = { default: 1 });
	if (o) for (let e in a) !ci(e) && s[e] == null && delete a[e];
}, gi = Oi;
function _i(e) {
	return vi(e);
}
function vi(e, i) {
	let a = oe();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Bi(e, t) && (i = ge(e), M(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case ki:
				y(e, t, r, i);
				break;
			case Ai:
				b(e, t, r, i);
				break;
			case ji:
				e ?? x(t, r, i, s);
				break;
			case U:
				ne(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, r, i, a, o, s, c, l) : f & 6 ? re(e, t, r, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, r, i, a, o, s, c, l, N);
		}
		d != null && a ? Gn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && Gn(e.ref, null, o, e, !0);
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
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) T(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), O(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && D(e.children, d, null, r, i, yi(e, a), s, u), _ && Dn(e, null, r, "created"), E(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !ee(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && Xi(f, r, e);
		}
		_ && Dn(e, null, r, "beforeMount");
		let v = xi(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && gi(() => {
			try {
				f && Xi(f, r, e), v && g.enter(d), _ && Dn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, E = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Di(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				E(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, D = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? qi(e[l]) : Ki(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, O = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && bi(r, !1), (g = h.onVnodeBeforeUpdate) && Xi(g, r, n, e), f && Dn(n, e, r, "beforeUpdate"), r && bi(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? k(e.dynamicChildren, d, l, r, i, yi(n, a), o) : s || ce(e, n, l, null, r, i, yi(n, a), o, !1), u > 0) {
			if (u & 16) te(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && te(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && gi(() => {
			g && Xi(g, r, n, e), f && Dn(n, e, r, "updated");
		}, i);
	}, k = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === U || !Bi(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, te = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !ee(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (ee(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, ne = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), D(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (k(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Si(e, t, !0)) : ce(e, t, n, f, i, a, s, c, l);
	}, re = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : A(t, n, r, i, a, o, c) : j(e, t, c);
	}, A = (e, t, n, r, i, a, o) => {
		let s = e.component = $i(e, r, i);
		if (Jn(e) && (s.ctx.renderer = N), sa(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ae, o), !e.el) {
				let r = s.subTree = q(Ai);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ae(s, e, t, n, i, a, o);
	}, j = (e, t, n) => {
		let r = t.component = e.component;
		if (Jr(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, se(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, r.vnode = t;
	}, ae = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = wi(e);
					if (n) {
						t && (t.el = c.el, se(e, t, o)), n.asyncDep.then(() => {
							gi(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				bi(e, !1), t ? (t.el = c.el, se(e, t, o)) : t = c, n && ie(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Xi(d, s, t, c), bi(e, !0);
				let f = Gr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ge(p), e, i, a), t.el = f.el, u === null && Zr(e, f.el), r && gi(r, i), (d = t.props && t.props.onVnodeUpdated) && gi(() => Xi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = qn(t);
				if (bi(e, !1), l && ie(l), !m && (o = c && c.onVnodeBeforeMount) && Xi(o, d, t), bi(e, !0), s && be) {
					let t = () => {
						e.subTree = Gr(e), be(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Gr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && gi(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					gi(() => Xi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && qn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && gi(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ee(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => hn(u), bi(e, !0), l();
	}, se = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, ni(e, t.props, r, n), hi(e, t.children, n), Ve(), vn(e), He();
	}, ce = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				ue(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				le(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && he(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? ue(l, d, n, r, i, a, o, s, c) : he(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && D(d, n, r, i, a, o, s, c));
	}, le = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let n = t[p] = l ? qi(t[p]) : Ki(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? he(e, a, o, !0, !1, f) : D(t, r, i, a, o, s, c, l, f);
	}, ue = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? qi(t[u]) : Ki(t[u]);
			if (Bi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? qi(t[p]) : Ki(t[p]);
			if (Bi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? qi(t[u]) : Ki(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) M(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? qi(t[u]) : Ki(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					M(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Bi(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? M(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? Ci(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Ei(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? de(n, r, p, 2) : _--);
			}
		}
	}, de = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			de(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, N);
			return;
		}
		if (c === U) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) de(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === ji) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Rn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), gi(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Rn];
					a._isLeaving && a[Rn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, M = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Ve(), Gn(s, null, n, e, !0), He()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !qn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Xi(_, t, e), u & 6) me(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Dn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, N, r) : l && !l.hasOnce && (a !== U || d > 0 && d & 64) ? he(l, t, n, !1, !0) : (a === U && d & 384 || !i && u & 16) && he(c, t, n), r && fe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && gi(() => {
			_ && Xi(_, t, e), h && Dn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, fe = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === U) {
			pe(n, r);
			return;
		}
		if (t === ji) {
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
	}, pe = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, me = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Ti(c), Ti(l), r && ie(r), i.stop(), a ? (a.flags |= 8, M(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, M(o, e, t, n)), s && gi(s, t), gi(() => {
			e.isUnmounted = !0;
		}, t);
	}, he = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) M(e[o], t, n, r, i);
	}, ge = (e) => {
		if (e.shapeFlag & 6) return ge(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[In];
		return n ? h(n) : t;
	}, _e = !1, ve = (e, t, n) => {
		let r;
		e == null ? t._vnode && (M(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, _e ||= (_e = !0, vn(r), yn(), !1);
	}, N = {
		p: v,
		um: M,
		m: de,
		r: fe,
		mt: A,
		mc: D,
		pc: ce,
		pbc: k,
		n: ge,
		o: e
	}, ye, be;
	return i && ([ye, be] = i(N)), {
		render: ve,
		hydrate: ye,
		createApp: Rr(ve, ye)
	};
}
function yi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function bi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function xi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Si(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = qi(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Si(t, a)), a.type === ki && (a.patchFlag === -1 && (a = i[e] = qi(a)), a.el = t.el), a.type === Ai && !a.el && (a.el = t.el);
	}
}
function Ci(e) {
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
function wi(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : wi(t);
}
function Ti(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Ei(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Ei(t.subTree) : null;
}
var Di = (e) => e.__isSuspense;
function Oi(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : _n(e);
}
var U = /* @__PURE__ */ Symbol.for("v-fgt"), ki = /* @__PURE__ */ Symbol.for("v-txt"), Ai = /* @__PURE__ */ Symbol.for("v-cmt"), ji = /* @__PURE__ */ Symbol.for("v-stc"), Mi = [], Ni = null;
function W(e = !1) {
	Mi.push(Ni = e ? null : []);
}
function Pi() {
	Mi.pop(), Ni = Mi[Mi.length - 1] || null;
}
var Fi = 1;
function Ii(e, t = !1) {
	Fi += e, e < 0 && Ni && t && (Ni.hasOnce = !0);
}
function Li(e) {
	return e.dynamicChildren = Fi > 0 ? Ni || n : null, Pi(), Fi > 0 && Ni && Ni.push(e), e;
}
function G(e, t, n, r, i, a) {
	return Li(K(e, t, n, r, i, a, !0));
}
function Ri(e, t, n, r, i) {
	return Li(q(e, t, n, r, i, !0));
}
function zi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Bi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Vi = ({ key: e }) => e ?? null, Hi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ z(e) || h(e) ? {
	i: Sn,
	r: e,
	k: t,
	f: !!n
} : e);
function K(e, t = null, n = null, r = 0, i = null, a = e === U ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Vi(t),
		ref: t && Hi(t),
		scopeId: Cn,
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
		ctx: Sn
	};
	return s ? (Ji(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), Fi > 0 && !o && Ni && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Ni.push(c), c;
}
var q = Ui;
function Ui(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === fr) && (e = Ai), zi(e)) {
		let r = Gi(e, t, !0);
		return n && Ji(r, n), Fi > 0 && !a && Ni && (r.shapeFlag & 6 ? Ni[Ni.indexOf(e)] = r : Ni.push(r)), r.patchFlag = -2, r;
	}
	if (ha(e) && (e = e.__vccOpts), t) {
		t = Wi(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = M(e)), v(n) && (/* @__PURE__ */ zt(n) && !d(n) && (n = s({}, n)), t.style = se(n));
	}
	let o = g(e) ? 1 : Di(e) ? 128 : Ln(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return K(e, t, n, r, i, o, a, !0);
}
function Wi(e) {
	return e ? /* @__PURE__ */ zt(e) || ei(e) ? s({}, e) : e : null;
}
function Gi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Yi(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Vi(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(Hi(t)) : [a, Hi(t)] : Hi(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== U ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && Gi(e.ssContent),
		ssFallback: e.ssFallback && Gi(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Vn(u, c.clone(u)), u;
}
function J(e = " ", t = 0) {
	return q(ki, null, e, t);
}
function Y(e = "", t = !1) {
	return t ? (W(), Ri(Ai, null, e)) : q(Ai, null, e);
}
function Ki(e) {
	return e == null || typeof e == "boolean" ? q(Ai) : d(e) ? q(U, null, e.slice()) : zi(e) ? qi(e) : q(ki, null, String(e));
}
function qi(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Gi(e);
}
function Ji(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Ji(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !ei(t) ? t._ctx = Sn : r === 3 && Sn && (Sn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			Ji(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Sn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [J(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Yi(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = M([t.class, r.class]));
		else if (e === "style") t.style = se([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Xi(e, t, n, r = null) {
	nn(e, t, 7, [n, r]);
}
var Zi = Ir(), Qi = 0;
function $i(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || Zi, o = {
		uid: Qi++,
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
		scope: new Ce(!0),
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
		propsOptions: oi(i, a),
		emitsOptions: Ur(i, a),
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
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = Vr.bind(null, o), e.ce && e.ce(o), o;
}
var X = null, ea = () => X || Sn, ta, na;
{
	let e = oe(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	ta = t("__VUE_INSTANCE_SETTERS__", (e) => X = e), na = t("__VUE_SSR_SETTERS__", (e) => oa = e);
}
var ra = (e) => {
	let t = X;
	return ta(e), e.scope.on(), () => {
		e.scope.off(), ta(t);
	};
}, ia = () => {
	X && X.scope.off(), ta(null);
};
function aa(e) {
	return e.vnode.shapeFlag & 4;
}
var oa = !1;
function sa(e, t = !1, n = !1) {
	t && na(t);
	let { props: r, children: i } = e.vnode, a = aa(e);
	ti(e, r, a, t), mi(e, i, n || t);
	let o = a ? ca(e, t) : void 0;
	return t && na(!1), o;
}
function ca(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, yr);
	let { setup: r } = n;
	if (r) {
		Ve();
		let n = e.setupContext = r.length > 1 ? fa(e) : null, i = ra(e), a = tn(r, e, 0, [e.props, n]), o = y(a);
		if (He(), i(), (o || e.sp) && !qn(e) && Hn(e), o) {
			if (a.then(ia, ia), t) return a.then((n) => {
				na(!0);
				try {
					la(e, n, t);
				} finally {
					na(!1);
				}
			}).catch((t) => {
				rn(t, e, 0);
			});
			e.asyncDep = a;
		} else la(e, a, t);
	} else ua(e, t);
}
function la(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Kt(t)), ua(e, n);
}
function ua(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
	{
		let t = ra(e);
		Ve();
		try {
			Sr(e);
		} finally {
			He(), t();
		}
	}
}
var da = { get(e, t) {
	return L(e, "get", ""), e[t];
} };
function fa(e) {
	return {
		attrs: new Proxy(e.attrs, da),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function pa(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Kt(Bt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in _r) return _r[n](e);
		},
		has(e, t) {
			return t in e || t in _r;
		}
	}) : e.proxy;
}
function ma(e, t = !0) {
	return h(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function ha(e) {
	return h(e) && "__vccOpts" in e;
}
var Z = (e, t) => /* @__PURE__ */ Jt(e, t, oa), ga = "3.5.43", _a = void 0, va = typeof window < "u" && window.trustedTypes;
if (va) try {
	_a = /* @__PURE__ */ va.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var ya = _a ? (e) => _a.createHTML(e) : (e) => e, ba = "http://www.w3.org/2000/svg", xa = "http://www.w3.org/1998/Math/MathML", Sa = typeof document < "u" ? document : null, Ca = Sa && /* @__PURE__ */ Sa.createElement("template"), wa = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Sa.createElementNS(ba, e) : t === "mathml" ? Sa.createElementNS(xa, e) : n ? Sa.createElement(e, { is: n }) : Sa.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Sa.createTextNode(e),
	createComment: (e) => Sa.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Sa.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Ca.innerHTML = ya(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Ca.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Ta = /* @__PURE__ */ Symbol("_vtc");
function Ea(e, t, n) {
	let r = e[Ta];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Da = /* @__PURE__ */ Symbol("_vod"), Oa = /* @__PURE__ */ Symbol("_vsh"), ka = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[Da] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Aa(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), Aa(e, !0), r.enter(e)) : r.leave(e, () => {
			Aa(e, !1);
		}) : Aa(e, t));
	},
	beforeUnmount(e, { value: t }) {
		Aa(e, t);
	}
};
function Aa(e, t) {
	e.style.display = t ? e[Da] : "none", e[Oa] = !t;
}
var ja = /* @__PURE__ */ Symbol(""), Ma = /(?:^|;)\s*display\s*:/;
function Na(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) {
			if (g(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? Fa(r, t, "");
			}
			else for (let e in t) n[e] ?? Fa(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Fa(r, i, "") : za(e, i, !g(t) && t ? t[i] : void 0, o) || Fa(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[ja];
			e && (n += ";" + e), r.cssText = n, a = Ma.test(n);
		}
	} else t && e.removeAttribute("style");
	Da in e && (e[Da] = a ? r.display : "", e[Oa] && (r.display = "none"));
}
var Pa = /\s*!important$/;
function Fa(e, t, n) {
	if (d(n)) n.forEach((n) => Fa(e, t, n));
	else if (n ??= "", t.startsWith("--")) Pa.test(n) ? e.setProperty(t, n.replace(Pa, ""), "important") : e.setProperty(t, n);
	else {
		let r = Ra(e, t);
		Pa.test(n) ? e.setProperty(k(r), n.replace(Pa, ""), "important") : e[r] = n;
	}
}
var Ia = [
	"Webkit",
	"Moz",
	"ms"
], La = {};
function Ra(e, t) {
	let n = La[t];
	if (n) return n;
	let r = D(t);
	if (r !== "filter" && r in e) return La[t] = r;
	r = te(r);
	for (let n = 0; n < Ia.length; n++) {
		let i = Ia[n] + r;
		if (i in e) return La[t] = i;
	}
	return t;
}
function za(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var Ba = "http://www.w3.org/1999/xlink";
function Va(e, t, n, r, i, a = pe(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Ba, t.slice(6, t.length)) : e.setAttributeNS(Ba, t, n) : n == null || a && !me(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function Ha(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? ya(n) : n);
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
		r === "boolean" ? n = me(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Ua(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Wa(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Ga = /* @__PURE__ */ Symbol("_vei");
function Ka(e, t, n, r, i = null) {
	let a = e[Ga] || (e[Ga] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Ya(t);
		r ? Ua(e, n, a[t] = $a(r, i), s) : o && (Wa(e, n, o, s), a[t] = void 0);
	}
}
var qa = /(Once|Passive|Capture)$/, Ja = /^on:?(?:Once|Passive|Capture)$/;
function Ya(e) {
	let t, n;
	for (; (n = e.match(qa)) && !Ja.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : k(e.slice(2)), t];
}
var Xa = 0, Za = /* @__PURE__ */ Promise.resolve(), Qa = () => Xa ||= (Za.then(() => Xa = 0), Date.now());
function $a(e, t) {
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
				e && nn(e, t, 5, a);
			}
		} else nn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Qa(), n;
}
var eo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, to = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? Ea(e, r, c) : t === "style" ? Na(e, n, r) : a(t) ? o(t) || Ka(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : no(e, t, r, c)) ? (Ha(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Va(e, t, r, c, s, t !== "value")) : e._isVueCE && (ro(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? Ha(e, D(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Va(e, t, r, c));
};
function no(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && eo(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return eo(t) && g(n) ? !1 : t in e;
}
function ro(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = D(t);
	return Array.isArray(n) ? n.some((e) => D(e) === r) : Object.keys(n).some((e) => D(e) === r);
}
var io = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => ie(t, e) : t;
};
function ao(e) {
	e.target.composing = !0;
}
function oo(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var so = /* @__PURE__ */ Symbol("_assign"), co = /* @__PURE__ */ Symbol("_initialValue");
function lo(e, t, n) {
	return t && (e = e.trim()), n && (e = j(e)), e;
}
var uo = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[co] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[co] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[so] = io(i);
		let a = r || i.props && i.props.type === "number";
		Ua(e, t ? "change" : "input", (t) => {
			t.target.composing || e[so](lo(e.value, n, a));
		}), (n || a) && Ua(e, "change", () => {
			e.value = lo(e.value, n, a);
		}), t || (Ua(e, "compositionstart", ao), Ua(e, "compositionend", oo), Ua(e, "change", oo));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[co];
		delete e[co], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[so](lo(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[so] = io(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? j(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, fo = {
	deep: !0,
	created(e, t, n) {
		e[so] = io(n), Ua(e, "change", () => {
			let t = e._modelValue, n = _o(e), r = e.checked, i = e[so];
			if (d(t)) {
				let e = ye(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (p(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(vo(e, r));
		});
	},
	mounted: po,
	beforeUpdate(e, t, n) {
		e[so] = io(n), po(e, t, n);
	}
};
function po(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (d(t)) i = ye(t, r.props.value) > -1;
	else if (p(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = N(t, vo(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var mo = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, Ua(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? j(_o(e)) : _o(e)), r = e.multiple, i = r ? p(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? d(i) ? t.slice() : t : i];
			try {
				e[so](i);
			} finally {
				pn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[so] = io(r);
	},
	mounted(e, { value: t }) {
		go(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[so] = io(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !ho(t, n[1], n[0])) && go(e, t);
	}
};
function ho(e, t, n) {
	if (!n || d(e)) return N(e, t);
	if (p(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function go(e, t) {
	let n = e.multiple, r = d(t);
	if (!n || r || p(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = _o(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : ye(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (N(_o(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function _o(e) {
	return "_value" in e ? e._value : e.value;
}
function vo(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var yo = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], bo = {
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
	exact: (e, t) => yo.some((n) => e[`${n}Key`] && !t.includes(n))
}, Q = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = bo[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, xo = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, So = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = k(n.key);
		if (t.some((e) => e === r || xo[e] === r)) return e(n);
	}));
}, Co = /* @__PURE__ */ s({ patchProp: to }, wa), wo;
function To() {
	return wo ||= _i(Co);
}
var Eo = ((...e) => {
	let t = To().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Oo(e);
		if (!r) return;
		let i = t._component;
		!h(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Do(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Do(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Oo(e) {
	return g(e) ? document.querySelector(e) : e;
}
//#endregion
//#region resources/js/components/ResourceActions.vue
var ko = { class: "resource-actions-area" }, Ao = { class: "resource-actions" }, jo = ["href", "title"], Mo = ["disabled"], No = ["disabled", "onClick"], Po = ["aria-expanded", "title"], Fo = {
	key: 0,
	class: "resource-action-menu",
	role: "menu"
}, Io = ["disabled", "onClick"], Lo = ["disabled", "title"], Ro = {
	key: 5,
	class: "resource-filter-buttons"
}, zo = ["aria-expanded"], Bo = {
	key: 0,
	class: "badge bg-primary"
}, Vo = ["disabled"], Ho = [
	"title",
	"aria-label",
	"aria-pressed"
], Uo = [
	"href",
	"target",
	"rel",
	"title",
	"aria-label"
], Wo = {
	key: 0,
	class: "resource-action-filters"
}, Go = ["value", "onChange"], Ko = ["value"], qo = {
	__name: "ResourceActions",
	props: {
		actions: Array,
		available: Function,
		selection: Array,
		batchAvailable: Boolean,
		flatAvailable: Boolean,
		flatActive: Boolean,
		filtersOpen: Boolean,
		filters: Array,
		filterValues: Object,
		managerUrl: String,
		managerNewTab: Boolean,
		dashboardUrl: String,
		integrated: Boolean,
		selectionMode: Boolean,
		allowNoUser: Boolean,
		canComplete: Boolean,
		t: Function
	},
	emits: [
		"action",
		"batch",
		"toggle-flat",
		"toggle-filters",
		"filter",
		"clear-filters",
		"complete",
		"no-user"
	],
	setup(e) {
		let t = e, n = /* @__PURE__ */ B(!1), r = /* @__PURE__ */ B(null), i = Z(() => (t.filters || []).filter((e) => String(t.filterValues[e.id] ?? e.default ?? "") !== String(e.default ?? "")).length), a = (e, n) => t.t(n.label), o = Z(() => {
			let e = /* @__PURE__ */ new Set(), n = [];
			return t.actions.filter((e) => e.id !== "checkin" || t.available(e)).forEach((r) => {
				if (!r.exclusiveGroup) {
					n.push(r);
					return;
				}
				if (e.has(r.exclusiveGroup)) return;
				e.add(r.exclusiveGroup);
				let i = t.actions.filter((e) => e.exclusiveGroup === r.exclusiveGroup), a = i.filter((e) => t.available(e)), o = t.selection?.length === 1 ? t.selection[0].overlays?.find((e) => i.some((t) => t.id === e.action))?.action : null;
				n.push(...a.length ? a : [i.find((e) => e.id === o) || i[0]]);
			}), n;
		}), s = Z(() => o.value.filter((e) => e.primary || [
			"upload",
			"createNode",
			"createChild",
			"newArticle"
		].includes(e.id))), c = Z(() => o.value.filter((e) => !s.value.includes(e))), l = (e) => {
			r.value?.contains(e.target) || (n.value = !1);
		}, u = (e) => {
			e.key === "Escape" && (n.value = !1);
		};
		return nr(() => {
			document.addEventListener("click", l), document.addEventListener("keydown", u);
		}), ar(() => {
			document.removeEventListener("click", l), document.removeEventListener("keydown", u);
		}), (t, o) => (W(), G("div", ko, [K("div", Ao, [
			e.dashboardUrl ? (W(), G("a", {
				key: 0,
				class: "btn resource-dashboard-link",
				href: e.dashboardUrl,
				title: e.t(e.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD")
			}, [o[7] ||= K("span", {
				class: "icon-arrow-left",
				"aria-hidden": "true"
			}, null, -1), J(" " + P(e.t(e.integrated ? "COM_SMARTBROWSER_DASHBOARD" : "COM_SMARTBROWSER_BACK_TO_DASHBOARD")), 1)], 8, jo)) : Y("", !0),
			e.selectionMode ? (W(), G("button", {
				key: 1,
				type: "button",
				class: "btn btn-primary",
				disabled: !e.canComplete,
				onClick: o[0] ||= (e) => t.$emit("complete")
			}, [o[8] ||= K("span", {
				class: "icon-check",
				"aria-hidden": "true"
			}, null, -1), J(" " + P(e.t("COM_SMARTBROWSER_SELECT")), 1)], 8, Mo)) : Y("", !0),
			e.allowNoUser ? (W(), G("button", {
				key: 2,
				type: "button",
				class: "btn btn-outline-secondary",
				onClick: o[1] ||= (e) => t.$emit("no-user")
			}, [o[9] ||= K("span", {
				class: "icon-user",
				"aria-hidden": "true"
			}, null, -1), J(" " + P(e.t("JOPTION_NO_USER")), 1)])) : Y("", !0),
			(W(!0), G(U, null, H(s.value, (n) => (W(), G("button", {
				key: n.id,
				type: "button",
				class: M(["btn btn-outline-secondary", `resource-action-${n.id}`]),
				disabled: !e.available(n),
				onClick: (e) => t.$emit("action", n)
			}, [K("span", {
				class: M(n.icon),
				"aria-hidden": "true"
			}, null, 2), J(" " + P(e.t(n.label)), 1)], 10, No))), 128)),
			c.value.length ? (W(), G("div", {
				key: 3,
				ref_key: "actionMenu",
				ref: r,
				class: "resource-action-menu-wrap"
			}, [K("button", {
				type: "button",
				class: "btn btn-outline-secondary resource-action-menu-toggle",
				"aria-expanded": n.value,
				title: e.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: o[2] ||= (e) => n.value = !n.value
			}, [
				o[10] ||= K("span", {
					class: "icon-ellipsis-h",
					"aria-hidden": "true"
				}, null, -1),
				J(" " + P(e.t("COM_SMARTBROWSER_ACTIONS")) + " ", 1),
				o[11] ||= K("span", {
					class: "icon-angle-down",
					"aria-hidden": "true"
				}, null, -1)
			], 8, Po), n.value ? (W(), G("div", Fo, [(W(!0), G(U, null, H(c.value, (r) => (W(), G("div", {
				key: r.id,
				class: "resource-action-menu-item",
				role: "none"
			}, [K("button", {
				type: "button",
				role: "menuitem",
				class: M(`resource-action-${r.id}`),
				disabled: !e.available(r),
				onClick: (e) => {
					n.value = !1, t.$emit("action", r);
				}
			}, [K("span", {
				class: M(r.icon),
				"aria-hidden": "true"
			}, null, 2), J(" " + P(e.t(r.label)), 1)], 10, Io)]))), 128))])) : Y("", !0)], 512)) : Y("", !0),
			e.batchAvailable ? (W(), G("button", {
				key: 4,
				type: "button",
				class: "btn btn-outline-secondary resource-batch-toggle",
				disabled: !e.selection?.length,
				title: e.t("COM_SMARTBROWSER_BATCH_ACTIONS"),
				onClick: o[3] ||= (e) => t.$emit("batch")
			}, [o[12] ||= K("span", {
				class: "fas fa-magic",
				"aria-hidden": "true"
			}, null, -1), J(" " + P(e.t("COM_SMARTBROWSER_BATCH")), 1)], 8, Lo)) : Y("", !0),
			e.filters?.length ? (W(), G("div", Ro, [K("button", {
				type: "button",
				class: M(["btn resource-filter-toggle", { active: e.filtersOpen }]),
				"aria-expanded": e.filtersOpen,
				onClick: o[4] ||= (e) => t.$emit("toggle-filters")
			}, [
				o[13] ||= K("span", {
					class: "icon-filter",
					"aria-hidden": "true"
				}, null, -1),
				J(" " + P(e.t("COM_SMARTBROWSER_FILTER_OPTIONS")) + " ", 1),
				i.value ? (W(), G("span", Bo, P(i.value), 1)) : Y("", !0),
				K("span", {
					class: M(["icon-angle-down resource-filter-caret", { open: e.filtersOpen }]),
					"aria-hidden": "true"
				}, null, 2)
			], 10, zo), K("button", {
				type: "button",
				class: "btn resource-filter-clear",
				disabled: !i.value,
				onClick: o[5] ||= (e) => t.$emit("clear-filters")
			}, P(e.t("JCLEAR")), 9, Vo)])) : Y("", !0),
			e.flatAvailable ? (W(), G("button", {
				key: 6,
				type: "button",
				class: M(["btn resource-flat-toggle", { active: e.flatActive }]),
				title: e.t("COM_SMARTBROWSER_FLAT_VIEW"),
				"aria-label": e.t("COM_SMARTBROWSER_FLAT_VIEW"),
				"aria-pressed": e.flatActive,
				onClick: o[6] ||= (e) => t.$emit("toggle-flat")
			}, [...o[14] ||= [K("span", {
				class: "fas fa-layer-group",
				"aria-hidden": "true"
			}, null, -1)]], 10, Ho)) : Y("", !0),
			e.managerUrl ? (W(), G("a", {
				key: 7,
				class: "btn resource-manager-link",
				href: e.managerUrl,
				target: e.managerNewTab ? "_blank" : void 0,
				rel: e.managerNewTab ? "noopener noreferrer" : void 0,
				title: e.t("COM_SMARTBROWSER_OPEN_JOOMLA_MANAGER"),
				"aria-label": e.t("COM_SMARTBROWSER_OPEN_JOOMLA_MANAGER")
			}, [...o[15] ||= [K("span", {
				class: "icon-joomla",
				"aria-hidden": "true"
			}, null, -1)]], 8, Uo)) : Y("", !0)
		]), e.filters?.length && e.filtersOpen ? (W(), G("div", Wo, [(W(!0), G(U, null, H(e.filters, (n) => (W(), G("label", { key: n.id }, [K("span", null, P(e.t(n.label)), 1), n.type === "select" ? (W(), G("select", {
			key: 0,
			class: "form-select",
			value: e.filterValues[n.id] ?? n.default,
			onChange: (e) => t.$emit("filter", {
				id: n.id,
				value: e.target.value
			})
		}, [(W(!0), G(U, null, H(n.options, (e) => (W(), G("option", {
			key: e.value,
			value: e.value
		}, P(a(n, e)), 9, Ko))), 128))], 40, Go)) : Y("", !0)]))), 128))])) : Y("", !0)]));
	}
}, Jo = ["placeholder"], Yo = ["multiple"], Xo = ["selected"], Zo = ["value", "selected"], Qo = {
	__name: "ResourceFancySelect",
	props: {
		modelValue: {
			type: [Array, String],
			required: !0
		},
		options: {
			type: Array,
			default: () => []
		},
		multiple: Boolean,
		placeholder: {
			type: String,
			required: !0
		},
		t: {
			type: Function,
			required: !0
		}
	},
	emits: ["update:modelValue"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ B(null), a = Z(() => n.options.filter((e) => String(e.value) !== "")), o = Z(() => a.value.map((e) => String(e.value)).join("|")), s = (e) => n.multiple ? n.modelValue.includes(String(e)) : String(n.modelValue) === String(e), c = (e) => r("update:modelValue", n.multiple ? Array.from(e.target.selectedOptions, (e) => e.value) : e.target.value), l, u, d, f = () => i.value?.choicesInstance?.hideDropdown(), p = () => {
			if (!l?.matches(":popover-open")) return;
			let e = i.value?.choicesInstance?.containerOuter?.element;
			if (!e) return;
			let t = e.getBoundingClientRect();
			if (t.bottom < 0 || t.top > window.innerHeight) {
				i.value.choicesInstance.hideDropdown();
				return;
			}
			let n = window.innerHeight - t.bottom - 8, r = t.top - 8, a = n < 240 && r > n, o = Math.max(0, a ? r : n);
			l.style.left = `${t.left}px`, l.style.top = `${a ? t.top : t.bottom}px`, l.style.width = `${t.width}px`, l.style.maxHeight = `${o}px`, l.style.transform = a ? "translateY(-100%)" : "", l.style.setProperty("--resource-batch-dropdown-list-height", `${Math.max(0, o - 2)}px`);
		}, m = () => {
			l && (l.classList.contains("is-active") && i.value?.closest("dialog")?.open ? (l.matches(":popover-open") || l.showPopover(), p()) : l.matches(":popover-open") && l.hidePopover());
		};
		return nr(async () => {
			await pn(), l = i.value?.choicesInstance?.dropdown?.element, l && (d = i.value.closest("dialog"), l.setAttribute("popover", "manual"), l.classList.add("resource-batch-choices-dropdown"), u = new MutationObserver(m), u.observe(l, {
				attributes: !0,
				attributeFilter: ["class"]
			}), window.addEventListener("scroll", p, !0), window.addEventListener("resize", p), d?.addEventListener("close", f));
		}), ar(() => {
			u?.disconnect(), l?.matches(":popover-open") && l.hidePopover(), window.removeEventListener("scroll", p, !0), window.removeEventListener("resize", p), d?.removeEventListener("close", f);
		}), Mn(() => n.modelValue, async (e) => {
			await pn();
			let t = i.value?.choicesInstance;
			if (!t) return;
			let r = n.multiple ? e : e ? [e] : [], a = t.getValue(!0), o = Array.isArray(a) ? a : a ? [a] : [];
			o.filter((e) => !r.includes(String(e))).forEach((e) => t.removeActiveItemsByValue(String(e))), r.filter((e) => !o.includes(String(e))).forEach((e) => t.setChoiceByValue(String(e)));
		}), (t, n) => (W(), G("joomla-field-fancy-select", {
			ref_key: "field",
			ref: i,
			key: o.value,
			class: M({ "resource-batch-single-select": !e.multiple }),
			placeholder: e.t(e.placeholder)
		}, [K("select", {
			class: "form-select",
			multiple: e.multiple,
			onChange: c
		}, [e.multiple ? Y("", !0) : (W(), G("option", {
			key: 0,
			value: "",
			selected: !e.modelValue
		}, P(e.t(e.placeholder)), 9, Xo)), (W(!0), G(U, null, H(a.value, (t) => (W(), G("option", {
			key: t.value,
			value: String(t.value),
			selected: s(t.value)
		}, P(e.t(t.label)), 9, Zo))), 128))], 40, Yo)], 10, Jo));
	}
}, $o = { class: "resource-batch-field" }, es = ["aria-label"], ts = ["aria-pressed", "onClick"], ns = {
	__name: "ResourceBatchModeToggle",
	props: {
		modelValue: {
			type: String,
			required: !0
		},
		t: {
			type: Function,
			required: !0
		}
	},
	emits: ["update:modelValue"],
	setup(e) {
		let t = [{
			value: "move",
			label: "COM_SMARTBROWSER_BATCH_MOVE"
		}, {
			value: "copy",
			label: "COM_SMARTBROWSER_BATCH_COPY"
		}];
		return (n, r) => (W(), G("div", $o, [K("span", null, P(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), K("div", {
			class: "btn-group resource-batch-mode-toggle",
			role: "group",
			"aria-label": e.t("COM_SMARTBROWSER_BATCH_MODE")
		}, [(W(), G(U, null, H(t, (t) => K("button", {
			key: t.value,
			type: "button",
			class: M(["btn", e.modelValue === t.value ? "is-active" : ""]),
			"aria-pressed": e.modelValue === t.value,
			onClick: (e) => n.$emit("update:modelValue", t.value)
		}, P(e.t(t.label)), 11, ts)), 64))], 8, es)]));
	}
}, rs = ["aria-label"], is = { class: "resource-batch-body" }, as = {
	class: "resource-batch-heading",
	role: "heading",
	"aria-level": "3"
}, os = ["open"], ss = { class: "resource-batch-fields" }, cs = ["aria-label"], ls = {
	key: 1,
	class: "text-danger"
}, us = ["open"], ds = { class: "resource-batch-fields" }, fs = ["disabled"], ps = { class: "resource-batch-check" }, ms = { key: 0 }, hs = ["open"], gs = { class: "resource-batch-fields" }, _s = { class: "input-group" }, vs = ["open"], ys = ["onClick"], bs = { class: "resource-batch-fields" }, xs = ["onUpdate:modelValue", "aria-label"], Ss = { value: "" }, Cs = ["value"], ws = ["open"], Ts = {
	key: 0,
	class: "resource-batch-fields"
}, Es = { class: "resource-batch-field" }, Ds = { class: "resource-batch-field" }, Os = ["open"], ks = {
	key: 0,
	class: "resource-batch-fields"
}, As = ["open"], js = ["onClick"], Ms = {
	key: 0,
	class: "resource-batch-fields"
}, Ns = ["onUpdate:modelValue", "aria-label"], Ps = { value: "" }, Fs = ["value"], Is = ["open"], Ls = {
	key: 0,
	class: "resource-batch-fields"
}, Rs = { class: "resource-batch-field" }, zs = { class: "resource-batch-field" }, Bs = ["open"], Vs = {
	key: 0,
	class: "resource-batch-fields"
}, Hs = ["open"], Us = ["open"], Ws = {
	key: 0,
	class: "resource-batch-fields"
}, Gs = ["open"], Ks = {
	key: 0,
	class: "resource-batch-fields"
}, qs = { value: "add" }, Js = { value: "remove" }, Ys = { value: "set" }, Xs = ["open"], Zs = {
	key: 0,
	class: "resource-batch-fields"
}, Qs = { value: "yes" }, $s = { value: "no" }, ec = { class: "resource-batch-bottom" }, tc = { class: "resource-batch-preview" }, nc = {
	class: "resource-batch-preview-heading",
	role: "heading",
	"aria-level": "3"
}, rc = {
	key: 0,
	class: "resource-batch-summary"
}, ic = {
	key: 0,
	class: "icon-arrow-right resource-batch-sequence-arrow",
	"aria-hidden": "true"
}, ac = { class: "resource-batch-summary-step" }, oc = {
	class: "resource-batch-summary-step-heading",
	role: "heading",
	"aria-level": "4"
}, sc = {
	key: 0,
	class: "resource-batch-summary-params"
}, cc = {
	key: 1,
	class: "resource-batch-no-changes"
}, lc = { class: "resource-batch-footer" }, uc = { class: "resource-batch-footer-actions" }, dc = ["disabled"], fc = ["aria-label"], pc = { class: "resource-batch-preview-dialog-head" }, mc = ["aria-label"], hc = { class: "resource-batch-preview-list" }, gc = ["title"], _c = ["title"], vc = ["aria-label"], yc = { class: "resource-batch-preview-dialog-head" }, bc = ["aria-label"], xc = { class: "resource-batch-selected-list" }, Sc = {
	__name: "ResourceBatchDialog",
	props: {
		selection: {
			type: Array,
			required: !0
		},
		adapter: {
			type: String,
			required: !0
		},
		filters: {
			type: Array,
			default: () => []
		},
		batchOptions: {
			type: Object,
			default: () => ({})
		},
		t: {
			type: Function,
			required: !0
		}
	},
	emits: ["apply"],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, a = kn("resourceApi"), o = /* @__PURE__ */ B(!1), s = /* @__PURE__ */ B([]), c = /* @__PURE__ */ B(!1), l = /* @__PURE__ */ B(""), u = 0, d = /* @__PURE__ */ B(null), f = /* @__PURE__ */ B(null), p = /* @__PURE__ */ B(null), m = Z(() => r.adapter.replace(/^flat-/, "")), h = Z(() => m.value === "media"), g = Z(() => ["articles", "articles-by-tag"].includes(m.value)), _ = Z(() => m.value === "categories"), v = Z(() => m.value === "tags"), y = Z(() => m.value === "menus"), b = Z(() => m.value === "users"), x = Z(() => ({
			articles: "article:",
			"articles-by-tag": "article:",
			categories: "category:",
			tags: "tag:",
			menus: "menu-item:",
			users: "user:"
		})[m.value]), S = Z(() => x.value ? r.selection.filter((e) => e.id.startsWith(x.value)) : r.selection), C = {
			rename: !1,
			find: "",
			replace: "",
			prefix: "",
			suffix: "",
			number: !1,
			startAt: 1,
			placement: "none",
			destination: "",
			zip: !1,
			zipName: "selection"
		}, w = {
			changeLanguage: !1,
			language: "",
			changeAccess: !1,
			access: "",
			tagsOpen: !1,
			tagAdd: [],
			tagRemove: [],
			placement: "none",
			category: ""
		}, ee = {
			changeLanguage: !1,
			language: "",
			changeAccess: !1,
			access: "",
			tagsOpen: !1,
			tagAdd: [],
			tagRemove: [],
			placement: "none",
			category: "",
			flipOrdering: !1,
			menuDestination: ""
		}, T = {
			groupOpen: !1,
			groupAction: "add",
			group: "",
			resetOpen: !1,
			reset: "yes"
		}, E = /* @__PURE__ */ Mt({ ...C }), D = /* @__PURE__ */ Mt({ ...w }), O = /* @__PURE__ */ Mt({ ...ee }), k = /* @__PURE__ */ Mt({ ...T }), te = [{
			id: "language",
			enabled: "changeLanguage",
			label: "COM_SMARTBROWSER_BATCH_SET_LANGUAGE",
			placeholder: "COM_SMARTBROWSER_SELECT_LANGUAGE"
		}, {
			id: "access",
			enabled: "changeAccess",
			label: "COM_SMARTBROWSER_BATCH_SET_ACCESS",
			placeholder: "COM_SMARTBROWSER_SELECT_ACCESS"
		}], ne = te, re = Z(() => JSON.stringify(E) !== JSON.stringify(C) || JSON.stringify(D) !== JSON.stringify(w) || JSON.stringify(O) !== JSON.stringify(ee) || JSON.stringify(k) !== JSON.stringify(T)), ie = (e) => (r.batchOptions[e] || r.filters.find((t) => t.id === e)?.options || []).filter((e) => String(e.value) !== ""), A = Z(() => (r.batchOptions.menu || []).flatMap((e) => [{
			value: `${e.value}.0`,
			label: e.label
		}, ...(r.batchOptions.menuParent || []).filter((t) => t.menu === e.value).map((t) => ({
			value: `${e.value}.${t.value}`,
			label: `- ${t.label}`
		}))])), j = Z(() => E.zipName.trim().replace(/\.zip$/i, "")), ae = (e) => {
			D.tagAdd = e, D.tagRemove = D.tagRemove.filter((t) => !e.includes(t));
		}, oe = (e) => {
			D.tagRemove = e, D.tagAdd = D.tagAdd.filter((t) => !e.includes(t));
		}, se = (e) => {
			O.tagAdd = e, O.tagRemove = O.tagRemove.filter((t) => !e.includes(t));
		}, ce = (e) => {
			O.tagRemove = e, O.tagAdd = O.tagAdd.filter((t) => !e.includes(t));
		}, le = (e, t) => r.t(ie(e).find((e) => String(e.value) === String(t))?.label || t), ue = Z(() => {
			let e = [];
			if (h.value) E.placement !== "none" && e.push({
				id: "placement",
				title: r.t(E.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
				parameters: [s.value.find((e) => e.value === E.destination)?.path || "..."]
			}), E.rename && e.push({
				id: "rename",
				title: r.t("COM_SMARTBROWSER_BATCH_RENAME"),
				parameters: [
					...E.find ? [`${r.t("COM_SMARTBROWSER_BATCH_FIND")}: ${E.find} → ${E.replace}`] : [],
					...E.prefix ? [`${r.t("COM_SMARTBROWSER_BATCH_PREFIX")}: ${E.prefix}`] : [],
					...E.suffix ? [`${r.t("COM_SMARTBROWSER_BATCH_SUFFIX")}: ${E.suffix}`] : [],
					...E.number ? [`${r.t("COM_SMARTBROWSER_BATCH_NUMBER")}: ${E.startAt}`] : []
				],
				preview: !0
			}), E.zip && e.push({
				id: "zip",
				title: r.t("COM_SMARTBROWSER_BATCH_ZIP"),
				parameters: [`${j.value}.zip`]
			});
			else if (g.value) {
				for (let t of te) D[t.enabled] && D[t.id] && e.push({
					id: t.id,
					title: r.t(t.label),
					parameters: [le(t.id, D[t.id])]
				});
				D.tagsOpen && D.tagAdd.length && e.push({
					id: "tag-add",
					title: r.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: D.tagAdd.map((e) => le("tag", e))
				}), D.tagsOpen && D.tagRemove.length && e.push({
					id: "tag-remove",
					title: r.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: D.tagRemove.map((e) => le("tag", e))
				}), D.placement !== "none" && e.unshift({
					id: "placement",
					title: r.t(D.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [D.category ? le("category", D.category) : "..."]
				});
			} else if (_.value || v.value || y.value) {
				for (let t of ne) O[t.enabled] && O[t.id] && e.push({
					id: t.id,
					title: r.t(t.label),
					parameters: [le(t.id, O[t.id])]
				});
				_.value && (O.tagsOpen && O.tagAdd.length && e.push({
					id: "tag-add",
					title: r.t("COM_SMARTBROWSER_BATCH_ADD_TAG"),
					parameters: O.tagAdd.map((e) => le("tag", e))
				}), O.tagsOpen && O.tagRemove.length && e.push({
					id: "tag-remove",
					title: r.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG"),
					parameters: O.tagRemove.map((e) => le("tag", e))
				}), O.placement !== "none" && e.unshift({
					id: "placement",
					title: r.t(O.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [O.category ? le("category", O.category) : "..."]
				}), O.flipOrdering && e.push({
					id: "flip",
					title: r.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING"),
					parameters: []
				})), y.value && O.placement !== "none" && e.unshift({
					id: "placement",
					title: r.t(O.placement === "copy" ? "COM_SMARTBROWSER_BATCH_COPY" : "COM_SMARTBROWSER_BATCH_MOVE"),
					parameters: [A.value.find((e) => e.value === O.menuDestination)?.label || "..."]
				});
			} else b.value && (k.groupOpen && k.group && e.push({
				id: "group",
				title: r.t({
					add: "COM_SMARTBROWSER_BATCH_GROUP_ADD",
					remove: "COM_SMARTBROWSER_BATCH_GROUP_REMOVE",
					set: "COM_SMARTBROWSER_BATCH_GROUP_SET"
				}[k.groupAction]),
				parameters: [le("group", k.group)]
			}), k.resetOpen && e.push({
				id: "reset",
				title: r.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET"),
				parameters: [r.t(k.reset === "yes" ? "JYES" : "JNO")]
			}));
			return e;
		}), de = Z(() => !(!S.value.length || !ue.value.length || h.value && E.placement !== "none" && !s.value.some((e) => e.value === E.destination) || g.value && D.placement !== "none" && !D.category || _.value && O.placement !== "none" && !O.category || y.value && O.placement !== "none" && !A.value.some((e) => e.value === O.menuDestination) || h.value && E.zip && !j.value)), fe = () => {
			if (h.value) return {
				...E,
				zipName: j.value
			};
			if (g.value) return {
				language: D.changeLanguage ? D.language : "",
				access: D.changeAccess ? D.access : "",
				tagAdd: D.tagsOpen ? D.tagAdd : [],
				tagRemove: D.tagsOpen ? D.tagRemove : [],
				placement: D.placement,
				category: D.category
			};
			if (b.value) return {
				group: k.groupOpen ? k.group : "",
				groupAction: k.groupAction === "remove" ? "del" : k.groupAction,
				reset: k.resetOpen ? k.reset : ""
			};
			let e = O.menuDestination.lastIndexOf(".");
			return {
				language: O.changeLanguage ? O.language : "",
				access: O.changeAccess ? O.access : "",
				tagAdd: _.value && O.tagsOpen ? O.tagAdd : [],
				tagRemove: _.value && O.tagsOpen ? O.tagRemove : [],
				placement: O.placement,
				category: O.category,
				flipOrdering: _.value && O.flipOrdering,
				menu: y.value && e >= 0 ? O.menuDestination.slice(0, e) : "",
				menuParent: y.value && e >= 0 ? O.menuDestination.slice(e + 1) : "0"
			};
		}, pe = async () => {
			if (!o.value && de.value) {
				o.value = !0;
				try {
					await new Promise((e, t) => i("apply", {
						selection: S.value.map((e) => e.id),
						payload: fe(),
						resolve: e,
						reject: t
					})), xe();
				} catch (e) {
					window.Joomla?.renderMessages?.({ error: [e.message || String(e)] });
				} finally {
					o.value = !1;
				}
			}
		}, me = (e, t) => {
			if (!E.rename) return e.title;
			let n = e.kind === "item" ? e.title.lastIndexOf(".") : -1, r = n > 0 ? e.title.slice(0, n) : e.title, i = n > 0 ? e.title.slice(n) : "", a = E.find ? r.split(E.find).join(E.replace) : r, o = E.number ? `-${String(Math.max(1, Number(E.startAt) || 1) + t).padStart(2, "0")}` : "";
			return `${E.prefix}${a}${E.suffix}${o}${i}`;
		}, he = Z(() => S.value.map((e, t) => {
			let n = e.id.includes(":") ? e.id.slice(e.id.indexOf(":") + 1) : e.title, r = E.placement !== "none" && E.destination ? `${E.destination.slice(E.destination.indexOf(":") + 1).replace(/\/$/, "")}/` : n.slice(0, n.lastIndexOf("/") + 1);
			return {
				id: e.id,
				before: n,
				after: r + me(e, t)
			};
		})), ge = async () => {
			let e = ++u;
			c.value = !0, l.value = "";
			try {
				let t = await a.execute("batchFolders", S.value.map((e) => e.id));
				e === u && (s.value = t);
			} catch (t) {
				e === u && (l.value = t.message || String(t));
			} finally {
				e === u && (c.value = !1);
			}
		}, _e = () => {
			Object.assign(E, C), Object.assign(D, w), Object.assign(O, ee), Object.assign(k, T), s.value = [], d.value?.showModal(), h.value && ge();
		}, ve = () => f.value?.showModal(), N = () => {
			f.value?.open && f.value.close();
		}, ye = () => p.value?.showModal(), be = () => {
			p.value?.open && p.value.close();
		}, xe = () => {
			u++, N(), be(), d.value?.close();
		};
		return t({
			open: _e,
			close: xe
		}), nr(() => {
			window.SmartBrowserDialogDismiss.install(d.value, () => re.value), window.SmartBrowserDialogDismiss.install(f.value), window.SmartBrowserDialogDismiss.install(p.value), d.value.addEventListener("close", () => {
				N(), be();
			});
		}), (t, n) => (W(), G(U, null, [
			K("dialog", {
				ref_key: "dialog",
				ref: d,
				class: "resource-batch-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_BATCH_ACTIONS")
			}, [K("div", is, [K("div", as, P(e.t("COM_SMARTBROWSER_BATCH_SELECT_ACTIONS")), 1), h.value ? (W(), G(U, { key: 0 }, [
				K("details", {
					class: "resource-batch-step",
					open: E.placement !== "none"
				}, [K("summary", { onClick: n[0] ||= Q((e) => E.placement = E.placement === "none" ? "move" : "none", ["prevent"]) }, P(e.t("COM_SMARTBROWSER_BATCH_PLACEMENT")), 1), K("div", ss, [q(ns, {
					modelValue: E.placement,
					"onUpdate:modelValue": n[1] ||= (e) => E.placement = e,
					t: e.t
				}, null, 8, ["modelValue", "t"]), K("label", null, [J(P(e.t("COM_SMARTBROWSER_BATCH_DESTINATION_FOLDER")) + " ", 1), c.value ? (W(), G("span", {
					key: 0,
					class: "spinner-border spinner-border-sm",
					role: "status",
					"aria-label": e.t("COM_SMARTBROWSER_LOADING_FOLDERS")
				}, null, 8, cs)) : l.value ? (W(), G("span", ls, P(l.value), 1)) : (W(), Ri(Qo, {
					key: 2,
					modelValue: E.destination,
					"onUpdate:modelValue": n[2] ||= (e) => E.destination = e,
					options: s.value,
					placeholder: "COM_SMARTBROWSER_SELECT_FOLDER",
					t: e.t
				}, null, 8, [
					"modelValue",
					"options",
					"t"
				]))])])], 8, os),
				K("details", {
					class: "resource-batch-step",
					open: E.rename
				}, [K("summary", { onClick: n[3] ||= Q((e) => E.rename = !E.rename, ["prevent"]) }, P(e.t("COM_SMARTBROWSER_BATCH_RENAME")), 1), K("div", ds, [
					K("label", null, [J(P(e.t("COM_SMARTBROWSER_BATCH_FIND")), 1), En(K("input", {
						"onUpdate:modelValue": n[4] ||= (e) => E.find = e,
						type: "text",
						class: "form-control"
					}, null, 512), [[uo, E.find]])]),
					K("label", null, [J(P(e.t("COM_SMARTBROWSER_BATCH_REPLACE")), 1), En(K("input", {
						"onUpdate:modelValue": n[5] ||= (e) => E.replace = e,
						type: "text",
						class: "form-control",
						disabled: !E.find
					}, null, 8, fs), [[uo, E.replace]])]),
					K("label", null, [J(P(e.t("COM_SMARTBROWSER_BATCH_PREFIX")), 1), En(K("input", {
						"onUpdate:modelValue": n[6] ||= (e) => E.prefix = e,
						type: "text",
						class: "form-control"
					}, null, 512), [[uo, E.prefix]])]),
					K("label", null, [J(P(e.t("COM_SMARTBROWSER_BATCH_SUFFIX")), 1), En(K("input", {
						"onUpdate:modelValue": n[7] ||= (e) => E.suffix = e,
						type: "text",
						class: "form-control"
					}, null, 512), [[uo, E.suffix]])]),
					K("label", ps, [En(K("input", {
						"onUpdate:modelValue": n[8] ||= (e) => E.number = e,
						type: "checkbox",
						class: "form-check-input"
					}, null, 512), [[fo, E.number]]), J(" " + P(e.t("COM_SMARTBROWSER_BATCH_NUMBER")), 1)]),
					E.number ? (W(), G("label", ms, [J(P(e.t("COM_SMARTBROWSER_BATCH_START_AT")), 1), En(K("input", {
						"onUpdate:modelValue": n[9] ||= (e) => E.startAt = e,
						type: "number",
						min: "1",
						class: "form-control"
					}, null, 512), [[
						uo,
						E.startAt,
						void 0,
						{ number: !0 }
					]])])) : Y("", !0)
				])], 8, us),
				K("details", {
					class: "resource-batch-step",
					open: E.zip
				}, [K("summary", { onClick: n[10] ||= Q((e) => E.zip = !E.zip, ["prevent"]) }, P(e.t("COM_SMARTBROWSER_BATCH_ZIP")), 1), K("div", gs, [K("label", null, [J(P(e.t("COM_SMARTBROWSER_BATCH_ZIP_NAME")), 1), K("span", _s, [En(K("input", {
					"onUpdate:modelValue": n[11] ||= (e) => E.zipName = e,
					type: "text",
					class: "form-control",
					onBlur: n[12] ||= (e) => E.zipName = j.value
				}, null, 544), [[uo, E.zipName]]), n[30] ||= K("span", { class: "input-group-text" }, ".zip", -1)])])])], 8, hs)
			], 64)) : g.value ? (W(), G(U, { key: 1 }, [
				(W(), G(U, null, H(te, (t) => K("details", {
					key: t.id,
					class: "resource-batch-step",
					open: D[t.enabled]
				}, [K("summary", { onClick: Q((e) => D[t.enabled] = !D[t.enabled], ["prevent"]) }, P(e.t(t.label)), 9, ys), K("div", bs, [En(K("select", {
					"onUpdate:modelValue": (e) => D[t.id] = e,
					class: "form-select",
					"aria-label": e.t(t.label)
				}, [K("option", Ss, P(e.t(t.placeholder)), 1), (W(!0), G(U, null, H(ie(t.id), (t) => (W(), G("option", {
					key: t.value,
					value: t.value
				}, P(e.t(t.label)), 9, Cs))), 128))], 8, xs), [[mo, D[t.id]]])])], 8, vs)), 64)),
				K("details", {
					class: "resource-batch-step",
					open: D.tagsOpen
				}, [K("summary", { onClick: n[13] ||= Q((e) => D.tagsOpen = !D.tagsOpen, ["prevent"]) }, P(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), D.tagsOpen ? (W(), G("div", Ts, [K("div", Es, [K("span", null, P(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), q(Qo, {
					"model-value": D.tagAdd,
					options: ie("tag"),
					multiple: "",
					placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
					t: e.t,
					"onUpdate:modelValue": ae
				}, null, 8, [
					"model-value",
					"options",
					"t"
				])]), K("div", Ds, [K("span", null, P(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), q(Qo, {
					"model-value": D.tagRemove,
					options: ie("tag"),
					multiple: "",
					placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
					t: e.t,
					"onUpdate:modelValue": oe
				}, null, 8, [
					"model-value",
					"options",
					"t"
				])])])) : Y("", !0)], 8, ws),
				K("details", {
					class: "resource-batch-step",
					open: D.placement !== "none"
				}, [K("summary", { onClick: n[14] ||= Q((e) => D.placement = D.placement === "none" ? "move" : "none", ["prevent"]) }, P(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), D.placement === "none" ? Y("", !0) : (W(), G("div", ks, [q(ns, {
					modelValue: D.placement,
					"onUpdate:modelValue": n[15] ||= (e) => D.placement = e,
					t: e.t
				}, null, 8, ["modelValue", "t"]), K("label", null, [J(P(e.t("COM_SMARTBROWSER_CATEGORY")), 1), q(Qo, {
					modelValue: D.category,
					"onUpdate:modelValue": n[16] ||= (e) => D.category = e,
					options: ie("category"),
					placeholder: "COM_SMARTBROWSER_SELECT_CATEGORY",
					t: e.t
				}, null, 8, [
					"modelValue",
					"options",
					"t"
				])])]))], 8, Os)
			], 64)) : _.value || v.value || y.value ? (W(), G(U, { key: 2 }, [
				(W(!0), G(U, null, H(V(ne), (t) => (W(), G("details", {
					key: t.id,
					class: "resource-batch-step",
					open: O[t.enabled]
				}, [K("summary", { onClick: Q((e) => O[t.enabled] = !O[t.enabled], ["prevent"]) }, P(e.t(t.label)), 9, js), O[t.enabled] ? (W(), G("div", Ms, [En(K("select", {
					"onUpdate:modelValue": (e) => O[t.id] = e,
					class: "form-select",
					"aria-label": e.t(t.label)
				}, [K("option", Ps, P(e.t(t.placeholder)), 1), (W(!0), G(U, null, H(ie(t.id), (t) => (W(), G("option", {
					key: t.value,
					value: t.value
				}, P(e.t(t.label)), 9, Fs))), 128))], 8, Ns), [[mo, O[t.id]]])])) : Y("", !0)], 8, As))), 128)),
				_.value ? (W(), G("details", {
					key: 0,
					class: "resource-batch-step",
					open: O.tagsOpen
				}, [K("summary", { onClick: n[17] ||= Q((e) => O.tagsOpen = !O.tagsOpen, ["prevent"]) }, P(e.t("COM_SMARTBROWSER_BATCH_TAGS")), 1), O.tagsOpen ? (W(), G("div", Ls, [K("div", Rs, [K("span", null, P(e.t("COM_SMARTBROWSER_BATCH_ADD_TAG")), 1), q(Qo, {
					"model-value": O.tagAdd,
					options: ie("tag"),
					multiple: "",
					placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
					t: e.t,
					"onUpdate:modelValue": se
				}, null, 8, [
					"model-value",
					"options",
					"t"
				])]), K("div", zs, [K("span", null, P(e.t("COM_SMARTBROWSER_BATCH_REMOVE_TAG")), 1), q(Qo, {
					"model-value": O.tagRemove,
					options: ie("tag"),
					multiple: "",
					placeholder: "COM_SMARTBROWSER_BATCH_KEEP_TAGS",
					t: e.t,
					"onUpdate:modelValue": ce
				}, null, 8, [
					"model-value",
					"options",
					"t"
				])])])) : Y("", !0)], 8, Is)) : Y("", !0),
				_.value ? (W(), G("details", {
					key: 1,
					class: "resource-batch-step",
					open: O.placement !== "none"
				}, [K("summary", { onClick: n[18] ||= Q((e) => O.placement = O.placement === "none" ? "move" : "none", ["prevent"]) }, P(e.t("COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT")), 1), O.placement === "none" ? Y("", !0) : (W(), G("div", Vs, [q(ns, {
					modelValue: O.placement,
					"onUpdate:modelValue": n[19] ||= (e) => O.placement = e,
					t: e.t
				}, null, 8, ["modelValue", "t"]), K("label", null, [J(P(e.t("COM_SMARTBROWSER_BATCH_PARENT_CATEGORY")), 1), q(Qo, {
					modelValue: O.category,
					"onUpdate:modelValue": n[20] ||= (e) => O.category = e,
					options: ie("category"),
					placeholder: "COM_SMARTBROWSER_SELECT_CATEGORY",
					t: e.t
				}, null, 8, [
					"modelValue",
					"options",
					"t"
				])])]))], 8, Bs)) : Y("", !0),
				_.value ? (W(), G("details", {
					key: 2,
					class: "resource-batch-step",
					open: O.flipOrdering
				}, [K("summary", { onClick: n[21] ||= Q((e) => O.flipOrdering = !O.flipOrdering, ["prevent"]) }, P(e.t("COM_SMARTBROWSER_BATCH_FLIP_ORDERING")), 1)], 8, Hs)) : Y("", !0),
				y.value ? (W(), G("details", {
					key: 3,
					class: "resource-batch-step",
					open: O.placement !== "none"
				}, [K("summary", { onClick: n[22] ||= Q((e) => O.placement = O.placement === "none" ? "move" : "none", ["prevent"]) }, P(e.t("COM_SMARTBROWSER_BATCH_MENU_PLACEMENT")), 1), O.placement === "none" ? Y("", !0) : (W(), G("div", Ws, [q(ns, {
					modelValue: O.placement,
					"onUpdate:modelValue": n[23] ||= (e) => O.placement = e,
					t: e.t
				}, null, 8, ["modelValue", "t"]), K("label", null, [J(P(e.t("COM_SMARTBROWSER_BATCH_MENU_DESTINATION")), 1), q(Qo, {
					modelValue: O.menuDestination,
					"onUpdate:modelValue": n[24] ||= (e) => O.menuDestination = e,
					options: A.value,
					placeholder: "COM_SMARTBROWSER_SELECT_MENU",
					t: e.t
				}, null, 8, [
					"modelValue",
					"options",
					"t"
				])])]))], 8, Us)) : Y("", !0)
			], 64)) : b.value ? (W(), G(U, { key: 3 }, [K("details", {
				class: "resource-batch-step",
				open: k.groupOpen
			}, [K("summary", { onClick: n[25] ||= Q((e) => k.groupOpen = !k.groupOpen, ["prevent"]) }, P(e.t("COM_SMARTBROWSER_BATCH_USER_GROUPS")), 1), k.groupOpen ? (W(), G("div", Ks, [K("label", null, [J(P(e.t("COM_SMARTBROWSER_BATCH_MODE")), 1), En(K("select", {
				"onUpdate:modelValue": n[26] ||= (e) => k.groupAction = e,
				class: "form-select resource-batch-mode-select"
			}, [
				K("option", qs, P(e.t("COM_SMARTBROWSER_BATCH_GROUP_ADD")), 1),
				K("option", Js, P(e.t("COM_SMARTBROWSER_BATCH_GROUP_REMOVE")), 1),
				K("option", Ys, P(e.t("COM_SMARTBROWSER_BATCH_GROUP_SET")), 1)
			], 512), [[mo, k.groupAction]])]), K("label", null, [J(P(e.t("COM_SMARTBROWSER_USER_GROUP")), 1), q(Qo, {
				modelValue: k.group,
				"onUpdate:modelValue": n[27] ||= (e) => k.group = e,
				options: ie("group"),
				placeholder: "COM_SMARTBROWSER_SELECT_USER_GROUP",
				t: e.t
			}, null, 8, [
				"modelValue",
				"options",
				"t"
			])])])) : Y("", !0)], 8, Gs), K("details", {
				class: "resource-batch-step",
				open: k.resetOpen
			}, [K("summary", { onClick: n[28] ||= Q((e) => k.resetOpen = !k.resetOpen, ["prevent"]) }, P(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), k.resetOpen ? (W(), G("div", Zs, [K("label", null, [J(P(e.t("COM_SMARTBROWSER_BATCH_PASSWORD_RESET")), 1), En(K("select", {
				"onUpdate:modelValue": n[29] ||= (e) => k.reset = e,
				class: "form-select"
			}, [K("option", Qs, P(e.t("JYES")), 1), K("option", $s, P(e.t("JNO")), 1)], 512), [[mo, k.reset]])])])) : Y("", !0)], 8, Xs)], 64)) : Y("", !0)]), K("div", ec, [K("div", tc, [K("div", nc, P(e.t("COM_SMARTBROWSER_BATCH_PREVIEW")), 1), ue.value.length ? (W(), G("div", rc, [(W(!0), G(U, null, H(ue.value, (t, n) => (W(), G("div", {
				key: t.id,
				class: "resource-batch-sequence-item"
			}, [n ? (W(), G("span", ic)) : Y("", !0), K("div", ac, [K("div", oc, P(t.title), 1), t.parameters.length || t.preview ? (W(), G("div", sc, [(W(!0), G(U, null, H(t.parameters, (e) => (W(), G("span", { key: e }, P(e), 1))), 128)), t.preview ? (W(), G("button", {
				key: 0,
				type: "button",
				class: "resource-batch-preview-link",
				onClick: ve
			}, P(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")), 1)) : Y("", !0)])) : Y("", !0)])]))), 128))])) : (W(), G("p", cc, P(e.t("COM_SMARTBROWSER_BATCH_NO_CHANGES")), 1))]), K("div", lc, [K("button", {
				type: "button",
				class: "resource-batch-items-link",
				onClick: ye
			}, P(S.value.length) + " " + P(e.t(S.value.length === 1 ? "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_ONE" : "COM_SMARTBROWSER_SELECTED_ITEM_COUNT_MANY")), 1), K("div", uc, [K("button", {
				type: "button",
				class: "btn btn-primary",
				disabled: o.value || !de.value,
				onClick: pe
			}, P(e.t("COM_SMARTBROWSER_BATCH_APPLY")), 9, dc), K("button", {
				type: "button",
				class: "btn btn-danger",
				onClick: xe
			}, P(e.t("COM_SMARTBROWSER_CANCEL")), 1)])])])], 8, rs),
			K("dialog", {
				ref_key: "previewDialog",
				ref: f,
				class: "resource-batch-preview-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")
			}, [K("div", pc, [K("strong", null, P(e.t("COM_SMARTBROWSER_BATCH_VIEW_NAMES")) + " (" + P(he.value.length) + ")", 1), K("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: N
			}, null, 8, mc)]), K("div", hc, [(W(!0), G(U, null, H(he.value, (e) => (W(), G("div", {
				key: e.id,
				class: "resource-batch-preview-row"
			}, [
				K("span", { title: e.before }, P(e.before), 9, gc),
				n[31] ||= K("span", {
					class: "icon-arrow-right",
					"aria-hidden": "true"
				}, null, -1),
				K("strong", { title: e.after }, P(e.after), 9, _c)
			]))), 128))])], 8, fc),
			K("dialog", {
				ref_key: "selectionDialog",
				ref: p,
				class: "resource-batch-preview-dialog",
				"aria-label": e.t("COM_SMARTBROWSER_SELECTED_ITEMS")
			}, [K("div", yc, [K("strong", null, P(e.t("COM_SMARTBROWSER_SELECTED_ITEMS")), 1), K("button", {
				type: "button",
				class: "btn-close",
				"aria-label": e.t("COM_SMARTBROWSER_CANCEL"),
				onClick: be
			}, null, 8, bc)]), K("ul", xc, [(W(!0), G(U, null, H(S.value, (e) => (W(), G("li", { key: e.id }, [K("span", {
				class: M(e.icon || "icon-file"),
				"aria-hidden": "true"
			}, null, 2), K("span", null, P(e.title), 1)]))), 128))])], 8, vc)
		], 64));
	}
}, Cc = {
	title: null,
	name: null,
	alias: "icon-link",
	status: "icon-check-circle",
	stateLabel: "icon-check-circle",
	author: "icon-user",
	category: "icon-folder",
	categoryPath: "icon-folder",
	parent: "icon-folder",
	parentPath: "icon-folder",
	location: "icon-folder",
	locationPath: "icon-folder",
	tagPaths: "icon-tags",
	created: "icon-calendar",
	modified: "icon-calendar",
	registered: "icon-calendar",
	lastVisit: "icon-clock",
	language: "icon-globe",
	languageKey: "icon-language",
	id: "icon-key",
	access: "icon-lock",
	size: "icon-database",
	dimension: "icon-expand",
	width: "icon-expand",
	ordering: "icon-sort",
	menu: "icon-menu",
	menuItemType: "icon-file-alt",
	shortcut: "icon-link",
	url: "icon-link",
	link: "icon-link",
	username: "icon-user",
	email: "icon-envelope",
	groups: "icon-users",
	tags: "icon-tags",
	mimeType: "icon-file-alt",
	extension: "icon-tag",
	type: "icon-file-alt"
}, wc = (e) => e.icon || e.headerIcon || Cc[e.id || String(e.source || "").split(".").pop()] || (e.format === "date" ? "icon-calendar" : "icon-info"), Tc = { class: "resource-info-panel" }, Ec = ["src", "alt"], Dc = ["hidden"], Oc = { key: 0 }, kc = {
	key: 0,
	class: "resource-language"
}, Ac = ["src"], jc = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, Mc = {
	key: 2,
	class: "resource-info-timezone"
}, Nc = { key: 1 }, Pc = { key: 0 }, Fc = { key: 1 }, Ic = {
	key: 0,
	class: "resource-info-timezone"
}, Lc = { key: 2 }, Rc = {
	key: 0,
	class: "resource-info-timezone"
}, zc = { key: 3 }, Bc = { key: 4 }, Vc = { key: 5 }, Hc = { key: 6 }, Uc = {
	__name: "ResourceInfoPanel",
	props: {
		resource: Object,
		fields: Array,
		t: Function
	},
	setup(e) {
		let t = e, n = [
			["metadata.access", "JFIELD_ACCESS_LABEL"],
			["metadata.categoryPath", "COM_SMARTBROWSER_CATEGORY_HIERARCHY"],
			["metadata.parent", "COM_SMARTBROWSER_PARENT"],
			["metadata.parentPath", "COM_SMARTBROWSER_PARENT"],
			["metadata.tagPaths", "COM_SMARTBROWSER_TAG_HIERARCHY"],
			["metadata.url", "COM_SMARTBROWSER_URL"],
			["metadata.link", "COM_SMARTBROWSER_URL"],
			["metadata.mimeType", "COM_SMARTBROWSER_MIME_TYPE"],
			["metadata.extension", "COM_SMARTBROWSER_EXTENSION"],
			[
				"metadata.size",
				"COM_SMARTBROWSER_SIZE",
				"size"
			],
			[
				"metadata.width",
				"COM_SMARTBROWSER_DIMENSIONS",
				"dimensions"
			]
		].map(([e, t, n]) => ({
			source: e,
			label: t,
			format: n
		})), r = Z(() => {
			let e = (t.fields || []).filter((e) => (!e.kinds || e.kinds.includes(t.resource?.kind)) && ![
				"metadata.locationPath",
				"metadata.category",
				"metadata.tags"
			].includes(e.source)), r = new Set(e.map((e) => e.source));
			return [...e, ...n.filter((e) => {
				let n = t.resource?.metadata?.[e.source.split(".")[1]];
				return !r.has(e.source) && n != null && n !== "";
			})];
		}), i = wc, a = Z(() => t.resource?.kind === "node" ? t.t("COM_SMARTBROWSER_FOLDER") : t.resource?.type ? t.resource.type.charAt(0).toUpperCase() + t.resource.type.slice(1) : t.t("COM_SMARTBROWSER_RESOURCE")), o = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, s = (e) => `${(e / 1024).toFixed(2)} KB`, c = (e) => {
			e.target.hidden = !0, e.target.nextElementSibling && (e.target.nextElementSibling.hidden = !1);
		}, l = (e) => String(e.source || "").split(".").reduce((e, t) => e?.[t], t.resource), u = (e) => (e.format === "language" || e.source === "metadata.language") && l(e) === "*" ? t.t("COM_SMARTBROWSER_ALL_LANGUAGES") : e.format === "date" ? o(l(e)) : e.format === "size" ? l(e) !== null && l(e) !== void 0 ? s(l(e)) : "" : e.format === "dimensions" ? t.resource?.metadata.width && t.resource?.metadata.height ? `${t.resource.metadata.width}px \u00d7 ${t.resource.metadata.height}px` : "" : l(e), d = (e) => {
			let n = String(e || "").trim().match(/(Z|[+-]\d{2}:?\d{2})$/i);
			if (!n) return "";
			let r = n[1].toUpperCase() === "Z" ? 0 : (n[1].startsWith("-") ? -1 : 1) * (Number(n[1].slice(1, 3)) * 60 + Number(n[1].slice(-2)));
			if (r === -new Date(e).getTimezoneOffset()) return "";
			let i = r >= 0 ? "+" : "-", a = Math.abs(r), o = r === 0 ? "UTC" : `UTC${i}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
			return `${t.t("COM_SMARTBROWSER_SOURCE_TIMEZONE")}: ${o}`;
		};
		return (t, n) => (W(), G("aside", Tc, [e.resource ? (W(), G(U, { key: 0 }, [
			K("div", { class: M(["resource-info-preview", { "image-background": e.resource.image }]) }, [e.resource.image ? (W(), G("img", {
				key: 0,
				src: e.resource.image,
				alt: e.resource.title,
				onError: c
			}, null, 40, Ec)) : Y("", !0), K("span", {
				class: M(e.resource.icon),
				hidden: !!e.resource.image,
				"aria-hidden": "true"
			}, null, 10, Dc)], 2),
			K("h3", null, P(e.resource.title), 1),
			e.fields?.length ? (W(), G("dl", Oc, [(W(!0), G(U, null, H(r.value, (t) => En((W(), G("div", { key: `${t.source}-${t.label}` }, [
				K("dt", null, [K("span", {
					class: M(V(i)(t)),
					"aria-hidden": "true"
				}, null, 2), J(P(e.t(t.label)), 1)]),
				t.format === "language" ? (W(), G("dd", kc, [e.resource.metadata?.languageImage ? (W(), G("img", {
					key: 0,
					src: e.resource.metadata.languageImage,
					alt: "",
					"aria-hidden": "true"
				}, null, 8, Ac)) : l(t) === "*" ? (W(), G("span", jc)) : Y("", !0), K("span", null, P(u(t)), 1)])) : (W(), G("dd", {
					key: 1,
					class: M({
						"resource-info-identifier": t.source === "metadata.alias" || t.source === "metadata.username",
						"resource-info-lines": t.source === "metadata.tagPaths"
					})
				}, P(u(t)), 3)),
				t.format === "date" && d(l(t)) ? (W(), G("small", Mc, P(d(l(t))), 1)) : Y("", !0)
			])), [[ka, u(t) !== "" && u(t) !== null && u(t) !== void 0]])), 128))])) : (W(), G("dl", Nc, [
				e.resource.parentId ? (W(), G("div", Pc, [K("dt", null, [n[0] ||= K("span", {
					class: "icon-folder",
					"aria-hidden": "true"
				}, null, -1), J(P(e.t("COM_SMARTBROWSER_FOLDER")), 1)]), K("dd", null, P(e.resource.parentId), 1)])) : Y("", !0),
				K("div", null, [K("dt", null, [n[1] ||= K("span", {
					class: "icon-file-alt",
					"aria-hidden": "true"
				}, null, -1), J(P(e.t("COM_SMARTBROWSER_TYPE")), 1)]), K("dd", null, P(a.value), 1)]),
				e.resource.metadata.created ? (W(), G("div", Fc, [
					K("dt", null, [n[2] ||= K("span", {
						class: "icon-calendar",
						"aria-hidden": "true"
					}, null, -1), J(P(e.t("COM_SMARTBROWSER_DATE_CREATED")), 1)]),
					K("dd", null, P(o(e.resource.metadata.created)), 1),
					d(e.resource.metadata.created) ? (W(), G("small", Ic, P(d(e.resource.metadata.created)), 1)) : Y("", !0)
				])) : Y("", !0),
				e.resource.metadata.modified ? (W(), G("div", Lc, [
					K("dt", null, [n[3] ||= K("span", {
						class: "icon-calendar",
						"aria-hidden": "true"
					}, null, -1), J(P(e.t("COM_SMARTBROWSER_DATE_MODIFIED")), 1)]),
					K("dd", null, P(o(e.resource.metadata.modified)), 1),
					d(e.resource.metadata.modified) ? (W(), G("small", Rc, P(d(e.resource.metadata.modified)), 1)) : Y("", !0)
				])) : Y("", !0),
				e.resource.metadata.width && e.resource.metadata.height ? (W(), G("div", zc, [K("dt", null, [n[4] ||= K("span", {
					class: "icon-expand",
					"aria-hidden": "true"
				}, null, -1), J(P(e.t("COM_SMARTBROWSER_DIMENSIONS")), 1)]), K("dd", null, P(e.resource.metadata.width) + "px × " + P(e.resource.metadata.height) + "px", 1)])) : Y("", !0),
				e.resource.metadata.size ? (W(), G("div", Bc, [K("dt", null, [n[5] ||= K("span", {
					class: "icon-database",
					"aria-hidden": "true"
				}, null, -1), J(P(e.t("COM_SMARTBROWSER_SIZE")), 1)]), K("dd", null, P(s(e.resource.metadata.size)), 1)])) : Y("", !0),
				e.resource.metadata.mimeType ? (W(), G("div", Vc, [K("dt", null, [n[6] ||= K("span", {
					class: "icon-file-alt",
					"aria-hidden": "true"
				}, null, -1), J(P(e.t("COM_SMARTBROWSER_MIME_TYPE")), 1)]), K("dd", null, P(e.resource.metadata.mimeType), 1)])) : Y("", !0),
				e.resource.metadata.extension ? (W(), G("div", Hc, [K("dt", null, [n[7] ||= K("span", {
					class: "icon-file-alt",
					"aria-hidden": "true"
				}, null, -1), J(P(e.t("COM_SMARTBROWSER_EXTENSION")), 1)]), K("dd", null, P(e.resource.metadata.extension), 1)])) : Y("", !0),
				K("div", null, [K("dt", null, [n[8] ||= K("span", {
					class: "icon-key",
					"aria-hidden": "true"
				}, null, -1), J(P(e.t("JGLOBAL_FIELD_ID_LABEL")), 1)]), K("dd", null, P(e.resource.metadata.id ?? e.resource.id), 1)])
			]))
		], 64)) : Y("", !0)]));
	}
}, Wc = {
	class: "resource-breadcrumb",
	"aria-label": "Breadcrumb"
}, Gc = [
	"title",
	"aria-label",
	"onClick"
], Kc = {
	key: 2,
	class: "resource-breadcrumb-title"
}, qc = {
	__name: "ResourceBreadcrumb",
	props: {
		breadcrumb: Array,
		root: Object,
		rootIcon: String,
		iconOnlyRoot: Boolean
	},
	emits: ["open"],
	setup(e) {
		let t = e, n = Z(() => {
			let e = t.breadcrumb || [], n = e[0] || t.root;
			return n ? [n, ...e.slice(1).filter((e) => e.visible !== !1)] : [];
		});
		return (t, r) => (W(), G("nav", Wc, [(W(!0), G(U, null, H(n.value, (n, r) => (W(), G("button", {
			key: n.id,
			type: "button",
			class: M({ "root-crumb": r === 0 && e.iconOnlyRoot }),
			title: n.title,
			"aria-label": r === 0 && e.iconOnlyRoot ? n.title : void 0,
			onClick: (e) => t.$emit("open", n.id)
		}, [n.icon ? (W(), G("span", {
			key: 0,
			class: M(n.icon),
			"aria-hidden": "true"
		}, null, 2)) : r === 0 ? (W(), G("span", {
			key: 1,
			class: M(e.rootIcon),
			"aria-hidden": "true"
		}, null, 2)) : Y("", !0), r !== 0 || !e.iconOnlyRoot ? (W(), G("span", Kc, P(n.title), 1)) : Y("", !0)], 10, Gc))), 128))]));
	}
}, Jc = {
	class: "resource-toolbar",
	role: "toolbar"
}, Yc = { class: "resource-toolbar-primary" }, Xc = { class: "resource-view-controls" }, Zc = [
	"disabled",
	"title",
	"aria-label"
], Qc = ["title"], $c = ["title"], el = ["disabled"], tl = ["disabled"], nl = ["title"], rl = { "aria-hidden": "true" }, il = [
	"title",
	"aria-label",
	"aria-expanded"
], al = {
	key: 0,
	class: "resource-column-menu"
}, ol = { class: "resource-column-menu-title" }, sl = [
	"checked",
	"disabled",
	"onChange"
], cl = { class: "resource-mode-controls" }, ll = ["title", "onClick"], ul = ["title"], dl = {
	key: 0,
	class: "resource-toolbar-expanded resource-search-row"
}, fl = {
	for: "smartbrowser-search",
	class: "visually-hidden"
}, pl = { class: "input-group resource-search-control" }, ml = ["value", "placeholder"], hl = ["title"], gl = { class: "visually-hidden" }, _l = {
	key: 1,
	class: "resource-toolbar-expanded resource-sort-row"
}, vl = { class: "resource-sort-controls" }, yl = { class: "visually-hidden" }, bl = ["value"], xl = { value: "" }, Sl = ["value"], Cl = { class: "visually-hidden" }, wl = ["value", "disabled"], Tl = { value: "asc" }, El = { value: "desc" }, Dl = {
	__name: "ResourceToolbar",
	props: {
		breadcrumb: Array,
		root: Object,
		rootIcon: String,
		iconOnlyRoot: Boolean,
		search: String,
		sortBy: String,
		sortDirection: String,
		sortFields: Array,
		views: Array,
		activeView: String,
		gridSize: String,
		detailsThumbnails: Boolean,
		detailsDateMode: String,
		columns: Array,
		hiddenColumns: Array,
		shownColumns: Array,
		showInfo: Boolean,
		canInvert: Boolean,
		t: Function
	},
	emits: [
		"open",
		"invert-selection",
		"search",
		"sort-by",
		"sort-direction-value",
		"resize",
		"toggle-thumbnails",
		"toggle-date-field",
		"toggle-column",
		"view",
		"info"
	],
	setup(e) {
		let t = e, n = Z(() => t.views.find((e) => e.id === t.activeView) || {}), r = Z(() => t.sortFields?.length ? t.sortFields : [
			{
				id: "title",
				label: "COM_SMARTBROWSER_NAME"
			},
			{
				id: "size",
				label: "COM_SMARTBROWSER_SIZE"
			},
			{
				id: "dimension",
				label: "COM_SMARTBROWSER_DIMENSIONS"
			},
			{
				id: "created",
				label: "COM_SMARTBROWSER_DATE_CREATED"
			},
			{
				id: "modified",
				label: "COM_SMARTBROWSER_DATE_MODIFIED"
			}
		]), i = /* @__PURE__ */ B(!1), a = /* @__PURE__ */ B(!1), o = /* @__PURE__ */ B(!1), s = /* @__PURE__ */ B(null), c = (e) => {
			s.value?.contains(e.target) || (o.value = !1);
		};
		nr(() => document.addEventListener("pointerdown", c)), ar(() => document.removeEventListener("pointerdown", c));
		let l = Z(() => ({
			created: "C",
			modified: "M",
			both: "M&C"
		})[t.detailsDateMode] || "M"), u = Z(() => `${t.t("COM_SMARTBROWSER_DATE")}: ${l.value}`), d = (e) => n.value.controls?.includes(e);
		return (t, n) => (W(), G("div", Jc, [
			K("div", Yc, [q(qc, {
				breadcrumb: e.breadcrumb,
				root: e.root,
				"root-icon": e.rootIcon,
				"icon-only-root": e.iconOnlyRoot,
				onOpen: n[0] ||= (e) => t.$emit("open", e)
			}, null, 8, [
				"breadcrumb",
				"root",
				"root-icon",
				"icon-only-root"
			]), K("div", Xc, [
				K("button", {
					type: "button",
					class: "resource-icon-button",
					disabled: !e.canInvert,
					title: e.t("COM_SMARTBROWSER_INVERT_SELECTION"),
					"aria-label": e.t("COM_SMARTBROWSER_INVERT_SELECTION"),
					onClick: n[1] ||= (e) => t.$emit("invert-selection")
				}, [...n[15] ||= [K("span", {
					class: "fas fa-retweet",
					"aria-hidden": "true"
				}, null, -1)]], 8, Zc),
				K("button", {
					type: "button",
					class: M(["resource-icon-button", { active: a.value }]),
					title: e.t("COM_SMARTBROWSER_SEARCH"),
					onClick: n[2] ||= (e) => a.value = !a.value
				}, [...n[16] ||= [K("span", {
					class: "icon-search",
					"aria-hidden": "true"
				}, null, -1)]], 10, Qc),
				d("sort") ? (W(), G("button", {
					key: 0,
					type: "button",
					class: M(["resource-icon-button", { active: i.value }]),
					title: e.t("COM_SMARTBROWSER_SORT_BY"),
					onClick: n[3] ||= (e) => i.value = !i.value
				}, [...n[17] ||= [K("span", {
					class: "fas fa-sort-amount-down-alt",
					"aria-hidden": "true"
				}, null, -1)]], 10, $c)) : Y("", !0),
				d("zoom") ? (W(), G("button", {
					key: 1,
					type: "button",
					class: "resource-icon-button",
					disabled: e.gridSize === "sm",
					title: "Decrease size",
					onClick: n[4] ||= (e) => t.$emit("resize", -1)
				}, [...n[18] ||= [K("span", {
					class: "icon-search-minus",
					"aria-hidden": "true"
				}, null, -1)]], 8, el)) : Y("", !0),
				d("zoom") ? (W(), G("button", {
					key: 2,
					type: "button",
					class: "resource-icon-button",
					disabled: e.gridSize === "xl",
					title: "Increase size",
					onClick: n[5] ||= (e) => t.$emit("resize", 1)
				}, [...n[19] ||= [K("span", {
					class: "icon-search-plus",
					"aria-hidden": "true"
				}, null, -1)]], 8, tl)) : Y("", !0),
				d("thumbnails") ? (W(), G("button", {
					key: 3,
					type: "button",
					class: M(["resource-icon-button", { active: e.detailsThumbnails }]),
					title: "Toggle thumbnails",
					onClick: n[6] ||= (e) => t.$emit("toggle-thumbnails")
				}, [...n[20] ||= [K("span", {
					class: "icon-images",
					"aria-hidden": "true"
				}, null, -1)]], 2)) : Y("", !0),
				d("dateField") ? (W(), G("button", {
					key: 4,
					type: "button",
					class: "resource-icon-button resource-date-toggle",
					title: u.value,
					onClick: n[7] ||= (e) => t.$emit("toggle-date-field")
				}, [n[21] ||= K("span", {
					class: "icon-calendar",
					"aria-hidden": "true"
				}, null, -1), K("small", rl, P(l.value), 1)], 8, nl)) : Y("", !0),
				d("dateField") && e.columns?.length ? (W(), G("div", {
					key: 5,
					ref_key: "columnPicker",
					ref: s,
					class: "resource-column-picker"
				}, [K("button", {
					type: "button",
					class: "resource-icon-button",
					title: e.t("COM_SMARTBROWSER_COLUMNS"),
					"aria-label": e.t("COM_SMARTBROWSER_COLUMNS"),
					"aria-expanded": o.value,
					onClick: n[8] ||= (e) => o.value = !o.value
				}, [...n[22] ||= [K("span", {
					class: "fas fa-columns",
					"aria-hidden": "true"
				}, null, -1)]], 8, il), o.value ? (W(), G("div", al, [K("div", ol, P(e.t("COM_SMARTBROWSER_COLUMNS")), 1), (W(!0), G(U, null, H(e.columns, (n) => (W(), G("label", {
					key: n.id,
					class: "resource-column-choice"
				}, [K("input", {
					type: "checkbox",
					checked: n.defaultVisible ? !e.hiddenColumns?.includes(n.id) : e.shownColumns?.includes(n.id),
					disabled: n.id === "title" || n.id === "name",
					onChange: (e) => t.$emit("toggle-column", n.id)
				}, null, 40, sl), K("span", null, P(e.t(n.label || (n.dateGroup ? "COM_SMARTBROWSER_DATE" : n.fields?.[0]?.label))), 1)]))), 128))])) : Y("", !0)], 512)) : Y("", !0),
				K("div", cl, [(W(!0), G(U, null, H(e.views, (n) => (W(), G("button", {
					key: n.id,
					type: "button",
					class: M(["resource-icon-button", { active: e.activeView === n.id }]),
					title: e.t(n.label),
					onClick: (e) => t.$emit("view", n.id)
				}, [K("span", {
					class: M(n.icon),
					"aria-hidden": "true"
				}, null, 2)], 10, ll))), 128))]),
				K("button", {
					type: "button",
					class: M(["resource-icon-button", { active: e.showInfo }]),
					title: e.t("COM_SMARTBROWSER_TOGGLE_INFO"),
					onClick: n[9] ||= (e) => t.$emit("info")
				}, [...n[23] ||= [K("span", {
					class: "icon-info",
					"aria-hidden": "true"
				}, null, -1)]], 10, ul)
			])]),
			a.value ? (W(), G("div", dl, [K("label", fl, P(e.t("COM_SMARTBROWSER_SEARCH")), 1), K("div", pl, [K("input", {
				id: "smartbrowser-search",
				value: e.search,
				type: "search",
				class: "form-control",
				placeholder: e.t("COM_SMARTBROWSER_SEARCH"),
				onInput: n[10] ||= (e) => t.$emit("search", e.target.value),
				onKeydown: n[11] ||= So(Q((e) => t.$emit("search", e.target.value), ["prevent"]), ["enter"])
			}, null, 40, ml), K("button", {
				type: "button",
				class: "btn btn-primary",
				title: e.t("COM_SMARTBROWSER_SEARCH"),
				onClick: n[12] ||= (n) => t.$emit("search", e.search)
			}, [n[24] ||= K("span", {
				class: "icon-search",
				"aria-hidden": "true"
			}, null, -1), K("span", gl, P(e.t("COM_SMARTBROWSER_SEARCH")), 1)], 8, hl)])])) : Y("", !0),
			i.value && d("sort") ? (W(), G("div", _l, [K("div", vl, [K("label", null, [K("span", yl, P(e.t("COM_SMARTBROWSER_SORT_BY")), 1), K("select", {
				value: e.sortBy,
				class: "form-select",
				onChange: n[13] ||= (e) => t.$emit("sort-by", e.target.value)
			}, [K("option", xl, P(e.t("COM_SMARTBROWSER_DEFAULT_SORTING")), 1), (W(!0), G(U, null, H(r.value, (t) => (W(), G("option", {
				key: t.id,
				value: t.id
			}, P(e.t(t.label)), 9, Sl))), 128))], 40, bl)]), K("label", null, [K("span", Cl, P(e.t("COM_SMARTBROWSER_SORT_DIRECTION")), 1), K("select", {
				value: e.sortDirection || "asc",
				class: "form-select",
				disabled: !e.sortBy,
				onChange: n[14] ||= (e) => t.$emit("sort-direction-value", e.target.value)
			}, [K("option", Tl, P(e.t("COM_SMARTBROWSER_ASCENDING")), 1), K("option", El, P(e.t("COM_SMARTBROWSER_DESCENDING")), 1)], 40, wl)])])])) : Y("", !0)
		]));
	}
}, Ol = ["aria-label"], kl = ["open", "onToggle"], Al = ["onClick"], jl = {
	key: 0,
	class: "resource-adapter-roots"
}, Ml = ["onClick"], Nl = {
	key: 1,
	class: "resource-tree-branch"
}, Pl = ["onClick"], Fl = ["onClick"], Il = {
	__name: "ResourceTree",
	props: {
		adapters: Array,
		activeAdapter: String,
		roots: Array,
		nodes: Array,
		breadcrumb: Array,
		selectedNode: String,
		t: Function
	},
	emits: ["open", "adapter"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = (e, t) => {
			e.target.open && t !== n.activeAdapter && r("adapter", t);
		}, a = (e) => {
			e === n.activeAdapter ? n.roots[0] && r("open", n.roots[0].id) : r("adapter", e);
		}, o = (e) => n.breadcrumb.some((t) => t.id === e.id), s = (e) => n.breadcrumb.filter((t) => t.id !== e.id), c = Z(() => n.roots.some((e) => e.visible !== !1 || o(e) && (s(e).length > 0 || n.nodes.length > 0))), l = (e, t) => ({ paddingInlineStart: `${10 + (e.visible === !1 ? 0 : 18) + t * 18}px` });
		return (t, n) => (W(), G("nav", {
			class: "resource-sidebar",
			"aria-label": e.t("COM_SMARTBROWSER_VIEW")
		}, [(W(!0), G(U, null, H(e.adapters, (r) => (W(), G("details", {
			key: r.id,
			class: "resource-adapter",
			open: r.id === e.activeAdapter,
			onToggle: (e) => i(e, r.id)
		}, [K("summary", { onClick: Q((e) => a(r.id), ["prevent"]) }, [K("span", {
			class: M(r.icon),
			"aria-hidden": "true"
		}, null, 2), J(" " + P(r.title), 1)], 8, Al), r.id !== e.activeAdapter || c.value ? (W(), G("div", jl, [(W(!0), G(U, null, H(r.id === e.activeAdapter ? e.roots : [], (r) => (W(), G("section", {
			key: r.id,
			class: M(["resource-tree-root", { "root-hidden": r.visible === !1 }])
		}, [r.visible === !1 ? Y("", !0) : (W(), G("button", {
			key: 0,
			type: "button",
			class: M({ active: e.selectedNode === r.id }),
			onClick: (e) => t.$emit("open", r.id)
		}, [K("span", {
			class: M(e.selectedNode.startsWith(r.id) ? "icon-folder-open" : "icon-folder"),
			"aria-hidden": "true"
		}, null, 2), K("span", null, P(r.title), 1)], 10, Ml)), o(r) ? (W(), G("div", Nl, [(W(!0), G(U, null, H(s(r), (i) => (W(), G("button", {
			key: i.id,
			type: "button",
			class: M({ active: e.selectedNode === i.id }),
			style: se(l(r, s(r).indexOf(i))),
			onClick: (e) => t.$emit("open", i.id)
		}, [n[0] ||= K("span", {
			class: "icon-folder",
			"aria-hidden": "true"
		}, null, -1), K("span", null, P(i.title), 1)], 14, Pl))), 128)), (W(!0), G(U, null, H(e.nodes, (e) => (W(), G(U, { key: e.id }, [e.navigable === !1 ? (W(), G("div", {
			key: 1,
			class: "resource-tree-entry resource-tree-static",
			style: se(l(r, s(r).length))
		}, [K("span", {
			class: M(e.icon),
			"aria-hidden": "true"
		}, null, 2), K("span", null, P(e.title), 1)], 4)) : (W(), G("button", {
			key: 0,
			type: "button",
			class: "resource-tree-entry",
			style: se(l(r, s(r).length)),
			onClick: (n) => t.$emit("open", e.id)
		}, [K("span", {
			class: M(e.icon),
			"aria-hidden": "true"
		}, null, 2), K("span", null, P(e.title), 1)], 12, Fl))], 64))), 128))])) : Y("", !0)], 2))), 128))])) : Y("", !0)], 40, kl))), 128))], 8, Ol));
	}
}, Ll = /* @__PURE__ */ new Set([
	"articles",
	"categories",
	"tags",
	"articles-by-tag",
	"menus",
	"users",
	"media"
]), Rl = (e, t, n) => {
	let r = e.startsWith("flat-") ? new URL(n).searchParams.get("flatFromBrowseRoot") || "" : t || "";
	return `supjx.smartbrowser.ui.${e.replace(/^flat-/, "")}.${r}`;
}, zl = (e, t, n, r) => {
	let i = new URL(e);
	if (!Ll.has(t)) return i.toString();
	i.searchParams.set("flatFromAdapter", t), i.searchParams.set("flatFromNode", n), r ? i.searchParams.set("flatFromBrowseRoot", r) : i.searchParams.delete("flatFromBrowseRoot");
	let a = `flat-${t}`;
	if (i.searchParams.set("adapter", a), i.searchParams.set("node", `${a}:root`), t === "articles" || t === "categories") {
		let e = n.startsWith("category:") ? n : r;
		e?.startsWith("category:") ? i.searchParams.set("browseRoot", e) : i.searchParams.delete("browseRoot"), i.searchParams.delete("flatScope");
	} else r ? i.searchParams.set("browseRoot", r) : i.searchParams.delete("browseRoot"), i.searchParams.set("flatScope", n);
	return i.toString();
}, Bl = (e, t) => {
	let n = new URL(e), r = n.searchParams.get("flatFromAdapter"), i = Ll.has(r) ? r : "articles", a = n.searchParams.get("flatFromBrowseRoot") || (r ? null : t), o = n.searchParams.get("flatFromNode") || a || "content:root";
	n.searchParams.set("adapter", i), n.searchParams.set("node", o), a ? n.searchParams.set("browseRoot", a) : n.searchParams.delete("browseRoot");
	for (let e of [
		"flatFromAdapter",
		"flatFromNode",
		"flatFromBrowseRoot",
		"flatScope"
	]) n.searchParams.delete(e);
	return n.toString();
}, Vl = (e, t) => {
	let n = new URL(e);
	if (!n.searchParams.get("adapter")?.startsWith("flat-") || !t) return n.toString();
	let r = n.searchParams.get("adapter");
	if (n.searchParams.set("node", `${r}:root`), n.searchParams.set("flatFromNode", t), r === "flat-articles" || r === "flat-categories") {
		let e = n.searchParams.get("flatFromBrowseRoot") || (n.searchParams.has("flatFromAdapter") ? null : n.searchParams.get("browseRoot"));
		e ? n.searchParams.set("browseRoot", e) : n.searchParams.delete("browseRoot"), n.searchParams.delete("flatScope");
	} else n.searchParams.set("flatScope", t);
	return n.toString();
}, Hl = {
	articles: [
		["categoryPath", "COM_SMARTBROWSER_CATEGORY_HIERARCHY"],
		["tagPaths", "COM_SMARTBROWSER_TAG_HIERARCHY"],
		["access", "JFIELD_ACCESS_LABEL"],
		["languageKey", "COM_SMARTBROWSER_LANGUAGE_KEY"]
	],
	categories: [
		["categoryPath", "COM_SMARTBROWSER_CATEGORY_HIERARCHY"],
		["access", "JFIELD_ACCESS_LABEL"],
		["languageKey", "COM_SMARTBROWSER_LANGUAGE_KEY"]
	],
	tags: [
		["tagPaths", "COM_SMARTBROWSER_TAG_HIERARCHY"],
		["access", "JFIELD_ACCESS_LABEL"],
		["languageKey", "COM_SMARTBROWSER_LANGUAGE_KEY"]
	],
	menus: [["link", "COM_SMARTBROWSER_URL"]],
	media: [
		["parentPath", "COM_SMARTBROWSER_PARENT"],
		["url", "COM_SMARTBROWSER_URL"],
		["mimeType", "COM_SMARTBROWSER_MIME_TYPE"],
		["extension", "COM_SMARTBROWSER_EXTENSION"],
		[
			"width",
			"COM_SMARTBROWSER_DIMENSIONS",
			"dimensions"
		],
		[
			"size",
			"COM_SMARTBROWSER_SIZE",
			"size"
		]
	]
}, Ul = (e) => ({
	stateLabel: "status",
	width: "dimension",
	link: "url"
})[e.split(".").pop()] || e.split(".").pop();
function Wl(e, t) {
	let n = e?.columns || [], r = n.map((e) => ({
		...e,
		defaultVisible: !0
	})), i = new Set(n.map((e) => e.id)), a = t.replace(/^flat-/, "") === "articles-by-tag" ? "articles" : t.replace(/^flat-/, ""), o = [...e?.infoFields || [], ...(Hl[a] || []).map(([e, t, n]) => ({
		id: Ul(e),
		label: t,
		source: `metadata.${e}`,
		format: n
	}))], s = i.has("dates");
	for (let e of o) {
		if (!e.source || !e.label || e.source === "metadata.locationPath") continue;
		let t = e.id || Ul(e.source);
		i.has(t) || s && ["created", "modified"].includes(t) || (i.add(t), r.push({
			id: t,
			label: e.label,
			source: e.source,
			format: e.format,
			defaultVisible: !1
		}));
	}
	return r;
}
//#endregion
//#region resources/js/components/SmartBrowserApp.vue
var Gl = {
	key: 0,
	class: "smartbrowser-busy",
	role: "status",
	"aria-live": "polite"
}, Kl = [
	"title",
	"aria-label",
	"aria-expanded"
], ql = { class: "resource-main" }, Jl = {
	key: 0,
	class: "resource-loader"
}, Yl = {
	key: 1,
	class: "resource-empty"
}, Xl = {
	key: 3,
	class: "resource-drop-overlay"
}, Zl = {
	__name: "SmartBrowserApp",
	setup(e) {
		let t = kn("browser"), n = kn("smartBrowserOptions"), r = kn("actionDriver"), i = kn("resourceApi"), a = kn("viewRegistry"), { state: o, resources: s, bulkSelectableResources: c, selection: l, focusedResource: u, load: d, focus: f, toggle: p, selectAll: m, invertSelection: h } = t, g = a.all(), _ = Z(() => a.get(o.activeView)), v = Z(() => Wl(o.presentation, n.adapter)), y = Z(() => v.value.filter((e) => e.id === "title" || e.id === "name" || (e.defaultVisible ? !o.hiddenColumns.includes(e.id) : o.shownColumns.includes(e.id)))), b = (e) => {
			let t = v.value.find((t) => t.id === e);
			if (!t || ["title", "name"].includes(e)) return;
			let n = t.defaultVisible ? "hiddenColumns" : "shownColumns";
			o[n] = o[n].includes(e) ? o[n].filter((t) => t !== e) : [...o[n], e];
		}, x = /* @__PURE__ */ B(!1), S = /* @__PURE__ */ B(!1), C = /* @__PURE__ */ B(null), w = Z(() => n.adapter === "media"), ee = [
			"articles",
			"categories",
			"tags",
			"articles-by-tag",
			"menus",
			"users",
			"media"
		].includes(n.adapter.replace(/^flat-/, "")), T = n.adapter.startsWith("flat-"), E = Object.fromEntries(Object.entries(n.gridWidths || {}).map(([e, t]) => [`--sb-grid-${e}`, `${t}px`])), D = Rl(n.adapter, n.browseRoot, window.location.href), O = (() => {
			try {
				return JSON.parse(window.sessionStorage.getItem(D) || "{}");
			} catch {
				return {};
			}
		})(), k = /* @__PURE__ */ B(O.filtersOpen === !0), te = (e) => {
			O = {
				...O,
				filtersOpen: k.value,
				...e
			}, window.sessionStorage.setItem(D, JSON.stringify(O));
		}, ne = () => {
			k.value = !k.value, te({ filtersOpen: k.value });
		}, re = () => {
			te({ flat: !T }), window.location.assign(T ? Bl(window.location.href, n.browseRoot) : zl(window.location.href, n.adapter, o.selectedNode, n.browseRoot));
		}, ie = Z(() => n.adapters?.find((e) => e.id === n.adapter)?.icon || "icon-list"), A = [
			"sm",
			"md",
			"lg",
			"xl"
		], j = (e) => Joomla.Text?._(e, e) || e, ae = async ({ selection: e, payload: t, resolve: n, reject: r }) => {
			try {
				let r = await i.execute("batch", e, t);
				if (r.download) {
					let e = atob(r.download.content), t = Uint8Array.from(e, (e) => e.charCodeAt(0)), n = URL.createObjectURL(new Blob([t], { type: "application/zip" })), i = document.createElement("a");
					i.href = n, i.download = r.download.name, i.click(), setTimeout(() => URL.revokeObjectURL(n), 6e4);
				}
				await d(), n(r);
			} catch (e) {
				r(e);
			}
		}, oe = (e) => {
			let t = {
				adapter: n.adapter.replace(/^flat-/, ""),
				mode: n.mode,
				resources: [...e]
			};
			document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: t })), window.parent !== window && window.parent.document.dispatchEvent(new CustomEvent("smartbrowser:select", { detail: t }));
		}, ce = (e) => {
			let t = A.indexOf(o.viewOptions.gridSize);
			o.viewOptions.gridSize = A[Math.max(0, Math.min(A.length - 1, t + e))];
		}, le = (e) => {
			if (n.mode === "select") {
				oe([e]);
				return;
			}
			let t = o.actions.find((e) => e.id === "preview");
			t && r.execute(t, [e]);
		}, ue = (e, t) => r.execute(e, [t]), de = (e) => {
			if (e === n.adapter) return;
			let t = new URL(window.location.href);
			t.searchParams.set("adapter", e), t.searchParams.delete("node"), t.searchParams.delete("browseRoot"), window.location.href = t.toString();
		}, fe = async ({ id: e, value: t }) => {
			if (o.filters[e] = t, e === "menu" && t && !n.browseRoot && n.adapter === "menus") {
				await d(`menu:${t}`);
				return;
			}
			if (e === "menu" && t && !n.browseRoot && n.adapter === "flat-menus") {
				let e = new URL(window.location.href);
				e.searchParams.set("flatScope", `menu:${t}`), e.searchParams.set("flatFromNode", `menu:${t}`), window.location.assign(e.toString());
				return;
			}
			await d(o.selectedNode);
		}, pe = async () => {
			(o.presentation.filters || []).forEach((e) => {
				o.filters[e.id] = e.default ?? "";
			}), await d(o.selectedNode);
		}, me = async (e) => {
			if (T && e === o.selectedNode && e === o.roots[0]?.id) {
				o.search = "", o.sortBy = "", o.sortDirection = "";
				let e = Vl(window.location.href, n.flatRootNode);
				if (e !== window.location.href) {
					(o.presentation.filters || []).forEach((e) => {
						o.filters[e.id] = e.default ?? "";
					}), await pn(), window.location.assign(e);
					return;
				}
				await pe();
				return;
			}
			await d(e);
		}, he = (e) => {
			o.sortBy === e ? o.sortDirection === "asc" ? o.sortDirection = "desc" : (o.sortBy = "", o.sortDirection = "") : (o.sortBy = e, o.sortDirection = "asc");
		}, ge = (e) => {
			o.sortBy = e, o.sortDirection = e ? o.sortDirection || "asc" : "";
		}, _e = () => {
			let e = [
				"modified",
				"created",
				"both"
			], t = e.indexOf(o.viewOptions.detailsDateMode);
			o.viewOptions.detailsDateMode = e[(t + 1) % e.length];
		}, ve = async (e) => {
			x.value = !1, w.value && await r.uploadFiles(e.dataTransfer?.files);
		};
		return nr(() => {
			if (T && te({ flat: !0 }), !T && ee && O.flat === !0) {
				window.location.replace(zl(window.location.href, n.adapter, o.selectedNode, n.browseRoot));
				return;
			}
			d(o.selectedNode);
		}), (e, t) => (W(), G("div", {
			class: "smartbrowser-shell",
			style: se(V(E))
		}, [
			V(o).busy ? (W(), G("div", Gl, [t[13] ||= K("span", {
				class: "spinner-border",
				"aria-hidden": "true"
			}, null, -1), K("span", null, P(j("COM_SMARTBROWSER_WORKING")), 1)])) : Y("", !0),
			q(qo, {
				actions: V(o).actions,
				available: (e) => V(r).available(e, V(l)),
				selection: V(l),
				"batch-available": V(n).mode === "manage",
				"flat-available": V(ee),
				"flat-active": V(T),
				"filters-open": k.value,
				filters: V(o).presentation.filters,
				"filter-values": V(o).filters,
				"manager-url": V(n).managerUrl,
				"manager-new-tab": V(n).application === "site",
				"dashboard-url": V(n).dashboardUrl,
				integrated: V(n).integrated,
				"selection-mode": V(n).mode === "select",
				"allow-no-user": V(n).allowNoUser,
				"can-complete": V(l).length > 0,
				t: j,
				onAction: t[0] ||= (e) => V(r).execute(e, V(l)),
				onBatch: t[1] ||= (e) => C.value?.open(),
				onToggleFlat: re,
				onToggleFilters: ne,
				onFilter: fe,
				onClearFilters: pe,
				onComplete: t[2] ||= (e) => oe(V(l)),
				onNoUser: t[3] ||= (e) => oe([{
					id: "user:0",
					type: "user",
					title: ""
				}])
			}, null, 8, [
				"actions",
				"available",
				"selection",
				"batch-available",
				"flat-available",
				"flat-active",
				"filters-open",
				"filters",
				"filter-values",
				"manager-url",
				"manager-new-tab",
				"dashboard-url",
				"integrated",
				"selection-mode",
				"allow-no-user",
				"can-complete"
			]),
			q(Sc, {
				ref_key: "batchDialog",
				ref: C,
				selection: V(l),
				adapter: V(n).adapter,
				filters: V(o).presentation.filters,
				"batch-options": V(o).presentation.batchOptions,
				t: j,
				onApply: ae
			}, null, 8, [
				"selection",
				"adapter",
				"filters",
				"batch-options"
			]),
			K("div", { class: M(["smartbrowser-layout", {
				"flat-mode": V(T),
				"tree-collapsed": S.value
			}]) }, [
				!V(T) && !S.value ? (W(), Ri(Il, {
					key: 0,
					adapters: V(n).adapters,
					"active-adapter": V(n).adapter,
					roots: V(o).roots,
					nodes: V(o).nodes,
					breadcrumb: V(o).breadcrumb,
					"selected-node": V(o).selectedNode,
					t: j,
					onOpen: V(d),
					onAdapter: de
				}, null, 8, [
					"adapters",
					"active-adapter",
					"roots",
					"nodes",
					"breadcrumb",
					"selected-node",
					"onOpen"
				])) : Y("", !0),
				V(T) ? Y("", !0) : (W(), G("button", {
					key: 1,
					type: "button",
					class: "resource-sidebar-handle",
					title: j(S.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-label": j(S.value ? "COM_SMARTBROWSER_SHOW_TREE" : "COM_SMARTBROWSER_HIDE_TREE"),
					"aria-expanded": !S.value,
					onClick: t[4] ||= (e) => S.value = !S.value
				}, [K("span", {
					class: M(S.value ? "fas fa-chevron-right" : "fas fa-chevron-left"),
					"aria-hidden": "true"
				}, null, 2)], 8, Kl)),
				K("main", ql, [q(Dl, {
					breadcrumb: V(o).breadcrumb,
					root: V(o).roots[0],
					"root-icon": ie.value,
					"icon-only-root": !V(T) && V(o).breadcrumb.length > 1,
					search: V(o).search,
					"sort-by": V(o).sortBy,
					"sort-direction": V(o).sortDirection,
					"sort-fields": V(o).presentation.sortFields,
					views: V(g),
					"active-view": V(o).activeView,
					"grid-size": V(o).viewOptions.gridSize,
					"details-thumbnails": V(o).viewOptions.detailsThumbnails,
					"details-date-mode": V(o).viewOptions.detailsDateMode,
					columns: v.value,
					"hidden-columns": V(o).hiddenColumns,
					"shown-columns": V(o).shownColumns,
					"show-info": V(o).showInfo,
					"can-invert": V(c).length > 0,
					t: j,
					onOpen: me,
					onInvertSelection: V(h),
					onSearch: t[5] ||= (e) => V(o).search = e,
					onSortBy: ge,
					onSortDirectionValue: t[6] ||= (e) => V(o).sortDirection = e,
					onResize: ce,
					onToggleThumbnails: t[7] ||= (e) => V(o).viewOptions.detailsThumbnails = !V(o).viewOptions.detailsThumbnails,
					onToggleDateField: _e,
					onToggleColumn: b,
					onView: t[8] ||= (e) => V(o).activeView = e,
					onInfo: t[9] ||= (e) => V(o).showInfo = !V(o).showInfo
				}, null, 8, [
					"breadcrumb",
					"root",
					"root-icon",
					"icon-only-root",
					"search",
					"sort-by",
					"sort-direction",
					"sort-fields",
					"views",
					"active-view",
					"grid-size",
					"details-thumbnails",
					"details-date-mode",
					"columns",
					"hidden-columns",
					"shown-columns",
					"show-info",
					"can-invert",
					"onInvertSelection"
				]), K("div", {
					class: M(["resource-browser", {
						loading: V(o).loading,
						"is-dragging": x.value,
						"info-open": V(o).showInfo
					}]),
					onDragenter: t[10] ||= Q((e) => x.value = w.value, ["prevent"]),
					onDragover: t[11] ||= Q(() => {}, ["prevent"]),
					onDragleave: t[12] ||= Q((e) => x.value = !1, ["self"]),
					onDrop: Q(ve, ["prevent"])
				}, [
					V(o).loading ? (W(), G("div", Jl, [...t[14] ||= [K("span", {
						class: "spinner-border",
						"aria-hidden": "true"
					}, null, -1)]])) : V(s).length ? (W(), Ri(pr(_.value.component), {
						key: 2,
						resources: V(s),
						"selected-ids": V(o).selectedIds,
						"focused-id": V(o).focusedId,
						"all-selected": V(c).length > 0 && V(c).every((e) => V(o).selectedIds.includes(e.id)),
						options: V(o).viewOptions,
						actions: V(o).actions,
						"action-available": (e, t) => V(r).available(e, t),
						"sort-by": V(o).sortBy,
						"sort-direction": V(o).sortDirection,
						"sort-fields": V(o).presentation.sortFields,
						"ordering-field": V(o).presentation.orderingField,
						columns: y.value,
						"grid-fields": V(o).presentation.gridFields,
						t: j,
						onSelect: V(p),
						onFocus: V(f),
						onSelectAll: V(m),
						onOpen: V(d),
						onActivate: le,
						onAction: ue,
						onSort: he
					}, null, 40, [
						"resources",
						"selected-ids",
						"focused-id",
						"all-selected",
						"options",
						"actions",
						"action-available",
						"sort-by",
						"sort-direction",
						"sort-fields",
						"ordering-field",
						"columns",
						"grid-fields",
						"onSelect",
						"onFocus",
						"onSelectAll",
						"onOpen"
					])) : (W(), G("div", Yl, [K("span", {
						class: M(V(o).search ? "icon-search" : w.value ? "icon-cloud-upload" : ie.value),
						"aria-hidden": "true"
					}, null, 2), K("p", null, P(V(o).search ? j("COM_SMARTBROWSER_NO_RESULTS") : w.value ? j("COM_SMARTBROWSER_DROP_UPLOAD") : j("COM_SMARTBROWSER_EMPTY_STATE")), 1)])),
					w.value && x.value ? (W(), G("div", Xl, [t[15] ||= K("span", { class: "icon-cloud-upload" }, null, -1), J(P(j("COM_SMARTBROWSER_DROP_UPLOAD")), 1)])) : Y("", !0),
					V(o).showInfo ? (W(), Ri(Uc, {
						key: 4,
						resource: V(u),
						fields: V(o).presentation.infoFields,
						t: j
					}, null, 8, ["resource", "fields"])) : Y("", !0)
				], 34)])
			], 2)
		], 4));
	}
}, Ql = "contextual", $l = (e, t) => ({
	...e,
	focusable: e.focusable ?? t.focusable,
	selectable: e.selectable ?? t.selectable,
	bulkSelectable: e.bulkSelectable ?? e.selectable ?? t.bulkSelectable,
	actionable: e.actionable ?? t.actionable,
	navigable: e.navigable ?? t.navigable,
	activatable: e.activatable ?? t.activatable
}), eu = (e) => $l({
	...e,
	role: e.role || "primary"
}, {
	focusable: !0,
	selectable: !1,
	bulkSelectable: !1,
	actionable: !0,
	navigable: !1,
	activatable: !0
}), tu = (e) => ({
	...e,
	role: Ql,
	focusable: e.focusable ?? !0,
	selectable: !1,
	bulkSelectable: !1,
	actionable: !1,
	navigable: !1,
	activatable: !1,
	interactiveOverlays: !1,
	capabilities: {}
}), nu = (e) => e?.role === Ql, ru = (e) => e?.focusable === !0, iu = (e, t = "both") => e?.selectable === !0 && (t === "both" || e.kind === t), au = (e, t = "both") => iu(e, t) && e?.bulkSelectable === !0, ou = (e) => e?.actionable === !0, su = (e, t, n) => {
	if (!t?.actionable) return [];
	let r = [t], i = [], a = /* @__PURE__ */ new Set();
	for (let o of e || []) {
		if (!o.requiresSelection || o.id === "checkin" && !n(o, r) || o.id === "removeFromGroup" && !n(o, r)) continue;
		if (!o.exclusiveGroup) {
			i.push(o);
			continue;
		}
		if (a.has(o.exclusiveGroup)) continue;
		a.add(o.exclusiveGroup);
		let s = e.filter((e) => e.requiresSelection && e.exclusiveGroup === o.exclusiveGroup), c = s.find((e) => n(e, r)), l = t.overlays?.find((e) => s.some((t) => t.id === e.action))?.action;
		i.push(c || s.find((e) => e.id === l) || s[0]);
	}
	return i;
}, cu = { class: "resource-grid-select-all" }, lu = ["checked", "aria-label"], uu = [
	"role",
	"tabindex",
	"aria-pressed",
	"onClick",
	"onDblclick",
	"onKeydown"
], du = [
	"checked",
	"aria-label",
	"onChange"
], fu = [
	"aria-expanded",
	"title",
	"onClick"
], pu = ["disabled", "onClick"], mu = ["src", "alt"], hu = ["hidden"], gu = {
	key: 1,
	class: "resource-item-overlays"
}, _u = ["title", "onClick"], vu = ["title"], yu = ["title"], bu = ["title"], xu = { class: "resource-item-metadata-text" }, Su = {
	__name: "ResourceGrid",
	props: {
		resources: Array,
		selectedIds: Array,
		focusedId: String,
		allSelected: Boolean,
		options: Object,
		actions: Array,
		actionAvailable: Function,
		gridFields: Array,
		t: Function
	},
	emits: [
		"select",
		"select-all",
		"focus",
		"open",
		"activate",
		"action"
	],
	setup(e) {
		let t = e, n = /* @__PURE__ */ B(null), r = /* @__PURE__ */ B(!1), i = /* @__PURE__ */ B(0), a = async (e, t) => {
			if (n.value === e) {
				n.value = null;
				return;
			}
			let a = t.currentTarget.closest(".resource-browser-item"), o = a?.closest(".resource-browser");
			if (r.value = !1, i.value = o ? Math.max(0, Math.min(360, o.clientWidth - 8, window.innerWidth - 20)) : 0, n.value = e, await pn(), n.value !== e || !o) return;
			let s = a.querySelector(".resource-item-menu");
			r.value = s?.getBoundingClientRect().left < o.getBoundingClientRect().left + 4;
		}, o = (e) => ou(e) ? su(t.actions, e, t.actionAvailable) : [], s = (e, n) => ou(n) && n.interactiveOverlays !== !1 ? t.actions.find((r) => r.id === e.action && t.actionAvailable(r, [n])) : void 0, c = () => {
			n.value = null;
		}, l = (e) => {
			e.target.hidden = !0, e.target.nextElementSibling && (e.target.nextElementSibling.hidden = !1);
		}, u = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e), d = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, f = (e) => {
			let n = e.metadata || {}, r = (e, t, n, r = !1) => t ? {
				label: e,
				value: t,
				icon: n,
				identifier: r
			} : null;
			return e.type === "user" ? [r("COM_SMARTBROWSER_USERNAME", n.username, "icon-user", !0), r("JGLOBAL_EMAIL", n.email, "icon-envelope")].filter(Boolean) : n.alias || n.languageKey || n.menuItemType ? [
				r("COM_SMARTBROWSER_ALIAS_LABEL", n.alias, "icon-link", !0),
				r("COM_SMARTBROWSER_MENU_ITEM_TYPE", n.menuItemType, "icon-file-alt"),
				r("COM_SMARTBROWSER_LANGUAGE_KEY", n.languageKey, "icon-language"),
				e.type === "article" && t.gridFields?.some((e) => e.source === "metadata.cardSummaryWithCategory") ? r("JCATEGORY", n.category, "icon-folder") : null
			].filter(Boolean) : e.kind === "item" && n.mimeType ? [r("COM_SMARTBROWSER_MIME_TYPE", n.mimeType, "icon-file-alt"), e.type === "image" && n.width > 0 && n.height > 0 ? r("COM_SMARTBROWSER_DIMENSIONS", `${n.width} × ${n.height}`, "icon-expand") : null].filter(Boolean) : (t.gridFields || []).map((t) => r(t.label || "COM_SMARTBROWSER_DETAILS", t.format === "date" ? d(u(e, t.source)) : u(e, t.source), "icon-info")).filter(Boolean);
		};
		return nr(() => document.addEventListener("click", c)), ar(() => document.removeEventListener("click", c)), (t, c) => (W(), G("div", { class: M(["resource-browser-grid", `size-${e.options.gridSize}`]) }, [K("div", { class: M(["resource-view-icons", { active: e.allSelected }]) }, [K("label", cu, [K("input", {
			type: "checkbox",
			checked: e.allSelected,
			"aria-label": e.t("COM_SMARTBROWSER_SELECT_ALL"),
			onChange: c[0] ||= (e) => t.$emit("select-all")
		}, null, 40, lu)])], 2), (W(!0), G(U, null, H(e.resources, (u) => (W(), G("div", {
			key: u.id,
			class: M(["resource-browser-item", {
				selected: e.selectedIds.includes(u.id),
				focused: e.focusedId === u.id,
				active: n.value === u.id,
				contextual: V(nu)(u)
			}]),
			role: V(ru)(u) ? "button" : void 0,
			tabindex: V(ru)(u) ? 0 : void 0,
			"aria-pressed": V(iu)(u) ? e.selectedIds.includes(u.id) : void 0,
			onClick: Q((e) => {
				n.value = null, t.$emit("select", u, e.ctrlKey || e.metaKey);
			}, ["stop"]),
			onDblclick: Q((e) => u.navigable ? t.$emit("open", u.id) : u.activatable && t.$emit("activate", u), ["stop"]),
			onKeydown: So(Q((e) => u.navigable ? t.$emit("open", u.id) : u.activatable ? t.$emit("activate", u) : t.$emit("focus", u), ["prevent"]), ["enter"]),
			onMouseleave: c[3] ||= (e) => n.value = null
		}, [
			V(iu)(u) ? (W(), G("label", {
				key: 0,
				class: M(["resource-item-select", { checked: e.selectedIds.includes(u.id) }]),
				onClick: c[1] ||= Q(() => {}, ["stop"])
			}, [K("input", {
				type: "checkbox",
				checked: e.selectedIds.includes(u.id),
				"aria-label": u.title,
				onChange: (e) => t.$emit("select", u, !0)
			}, null, 40, du)], 2)) : Y("", !0),
			o(u).length ? (W(), G("button", {
				key: 1,
				type: "button",
				class: "resource-item-menu-toggle",
				"aria-expanded": n.value === u.id,
				title: e.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: Q((e) => {
					t.$emit("focus", u), a(u.id, e);
				}, ["stop"])
			}, [...c[4] ||= [K("span", {
				class: "icon-ellipsis-h",
				"aria-hidden": "true"
			}, null, -1)]], 8, fu)) : Y("", !0),
			n.value === u.id ? (W(), G("div", {
				key: 2,
				class: M(["resource-item-menu", { "align-start": r.value }]),
				style: se(i.value ? { maxWidth: `${i.value}px` } : null),
				onClick: c[2] ||= Q(() => {}, ["stop"])
			}, [K("strong", null, P(u.title), 1), (W(!0), G(U, null, H(o(u), (r) => (W(), G("button", {
				key: r.id,
				type: "button",
				class: M(`resource-action-${r.id}`),
				disabled: !e.actionAvailable(r, [u]),
				onClick: (e) => {
					n.value = null, t.$emit("action", r, u);
				}
			}, [K("span", {
				class: M(r.icon),
				"aria-hidden": "true"
			}, null, 2), J(" " + P(e.t(r.label)), 1)], 10, pu))), 128))], 6)) : Y("", !0),
			K("span", { class: M(["resource-item-visual", { "image-background": u.image }]) }, [
				u.image ? (W(), G("img", {
					key: 0,
					src: u.image,
					alt: u.title,
					loading: "lazy",
					onError: l
				}, null, 40, mu)) : Y("", !0),
				K("span", {
					class: M(u.icon),
					hidden: !!u.image,
					"aria-hidden": "true"
				}, null, 10, hu),
				u.overlays?.length ? (W(), G("span", gu, [(W(!0), G(U, null, H(u.overlays, (e) => (W(), G(U, { key: e.id }, [s(e, u) ? (W(), G("button", {
					key: 0,
					type: "button",
					class: M(["resource-overlay", [`overlay-${e.id}`, `tone-${e.tone || "neutral"}`]]),
					title: e.label,
					onClick: Q((n) => {
						t.$emit("focus", u), t.$emit("action", s(e, u), u);
					}, ["stop"])
				}, [K("span", {
					class: M(e.icon),
					"aria-hidden": "true"
				}, null, 2)], 10, _u)) : (W(), G("span", {
					key: 1,
					class: M(["resource-overlay", [`overlay-${e.id}`, `tone-${e.tone || "neutral"}`]]),
					title: e.label
				}, [K("span", {
					class: M(e.icon),
					"aria-hidden": "true"
				}, null, 2)], 10, vu))], 64))), 128))])) : Y("", !0)
			], 2),
			K("span", {
				class: "resource-item-title",
				title: `${e.t("COM_SMARTBROWSER_NAME")}: ${u.title}`
			}, P(u.title), 9, yu),
			(W(!0), G(U, null, H(f(u), (t) => (W(), G("span", {
				key: t.label,
				class: M(["resource-item-metadata", { "resource-item-identifier": t.identifier }]),
				title: `${e.t(t.label)}: ${t.value}`
			}, [K("span", {
				class: M(t.icon),
				"aria-hidden": "true"
			}, null, 2), K("span", xu, P(t.value), 1)], 10, bu))), 128))
		], 42, uu))), 128))], 2));
	}
}, Cu = { class: "table-responsive resource-details-view" }, wu = { class: "table table-hover" }, Tu = {
	class: "resource-type-column resource-details-select-column",
	scope: "col"
}, Eu = { class: "resource-details-select-controls" }, Du = { class: "resource-details-select-all" }, Ou = ["checked", "aria-label"], ku = ["title"], Au = [
	"title",
	"aria-label",
	"onClick"
], ju = ["title"], Mu = [
	"tabindex",
	"aria-current",
	"onClick",
	"onDblclick",
	"onKeydown"
], Nu = { class: "resource-type-column" }, Pu = ["src", "alt"], Fu = [
	"checked",
	"aria-label",
	"onChange"
], Iu = ["title"], Lu = { class: "resource-cell-ellipsis" }, Ru = ["title"], zu = ["title", "onClick"], Bu = { class: "visually-hidden" }, Vu = ["title"], Hu = { class: "visually-hidden" }, Uu = {
	key: 1,
	class: "resource-language"
}, Wu = ["src"], Gu = {
	key: 1,
	class: "resource-language-all fas fa-asterisk",
	"aria-hidden": "true"
}, Ku = { class: "resource-language-name" }, qu = {
	key: 2,
	class: "resource-cell-ellipsis"
}, Ju = {
	key: 3,
	class: "resource-row-overlays"
}, Yu = ["title", "onClick"], Xu = ["title"], Zu = { class: "resource-row-actions" }, Qu = [
	"aria-expanded",
	"title",
	"onClick"
], $u = ["disabled", "onClick"], ed = {
	__name: "ResourceDetails",
	props: {
		resources: Array,
		selectedIds: Array,
		focusedId: String,
		allSelected: Boolean,
		options: Object,
		actions: Array,
		actionAvailable: Function,
		sortBy: String,
		sortDirection: String,
		sortFields: Array,
		orderingField: String,
		columns: Array,
		t: Function
	},
	emits: [
		"select",
		"select-all",
		"focus",
		"open",
		"activate",
		"sort",
		"action"
	],
	setup(e) {
		let t = e, n = [
			{
				id: "title",
				label: "COM_SMARTBROWSER_NAME"
			},
			{
				id: "size",
				label: "COM_SMARTBROWSER_SIZE"
			},
			{
				id: "dimension",
				label: "COM_SMARTBROWSER_DIMENSIONS"
			},
			{
				id: "created",
				label: "COM_SMARTBROWSER_DATE_CREATED"
			},
			{
				id: "modified",
				label: "COM_SMARTBROWSER_DATE_MODIFIED"
			}
		], r = () => [
			"created",
			"modified",
			"both"
		].includes(t.options.detailsDateMode) ? t.options.detailsDateMode : "modified", i = (e) => {
			if (!e.dateGroup) return [e];
			let t = e.fields || [];
			return r() === "both" ? t : t.filter((e) => e.id === r());
		}, a = Z(() => (t.columns?.length ? t.columns : n).flatMap(i)), o = Z(() => 44 + 24 * Math.max(0, ...(t.resources || []).map((e) => (e.overlays || []).filter((e) => e.id !== "status").length))), s = Z(() => Math.max(48, 24 + 8 * Math.max(1, ...(t.resources || []).map((e) => String(e.metadata?.id ?? "").length)))), c = (e) => {
			let t = e.id === "status" && e.overlays ? o.value : e.id === "id" ? s.value : null;
			return t === null ? null : {
				width: `${t}px`,
				minWidth: `${t}px`
			};
		}, l = (e) => e.headerIcon || (Object.hasOwn(Cc, e.id) ? Cc[e.id] : "icon-info"), u = (e) => e.sortField || e.id, d = (e) => t.t(e.label), f = (e) => (t.sortFields || n).some((t) => t.id === u(e)), p = (e) => t.sortBy === e ? t.sortDirection === "asc" ? "icon-caret-up ms-1" : "icon-caret-down ms-1" : "icon-sort ms-1", m = (e) => e ? `${(e / 1024).toFixed(2)}KB` : "", h = (e) => e.metadata.width && e.metadata.height ? `${e.metadata.width}px \u00d7 ${e.metadata.height}px` : "", g = (e) => {
			if (!e) return "";
			let t = new Date(e), n = (e) => String(e).padStart(2, "0");
			return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
		}, _ = (e, t) => String(t || "").split(".").reduce((e, t) => e?.[t], e), v = (e, n) => {
			if (n.id === "size") return e.kind === "node" ? "" : m(e.metadata.size);
			if (n.id === "dimension") return h(e);
			let r = n.source || `metadata.${n.id}`, i = _(e, r);
			return n.format === "size" ? m(i) : n.format === "dimensions" ? h(e) : n.format === "date" || ["created", "modified"].includes(n.id) ? g(i) : n.format === "mediaType" ? t.t({
				folder: "COM_SMARTBROWSER_FOLDER",
				image: "COM_SMARTBROWSER_MEDIA_IMAGE",
				document: "COM_SMARTBROWSER_MEDIA_DOCUMENT",
				video: "COM_SMARTBROWSER_MEDIA_VIDEO",
				audio: "COM_SMARTBROWSER_MEDIA_AUDIO"
			}[i] || "COM_SMARTBROWSER_RESOURCE") : n.format === "language" && i === "*" ? t.t("COM_SMARTBROWSER_ALL_LANGUAGES") : i ?? "";
		}, y = (e, t) => t.id === "location" ? String(e.metadata?.locationPath || v(e, t) || "") : t.format === "status" ? b(e).label : String(v(e, t) || ""), b = (e) => ({
			icon: e.statusPresentation?.icon || "icon-question-circle",
			label: e.statusPresentation?.label || v(e, { source: "metadata.stateLabel" }),
			class: `status-${e.statusPresentation?.tone || "neutral"}`
		}), x = (e) => e.overlays?.find((e) => e.id === "status") || {}, S = /* @__PURE__ */ B(null), C = (e) => {
			e.target.hidden = !0, e.target.nextElementSibling && (e.target.nextElementSibling.hidden = !1);
		}, w = (e) => {
			S.value = S.value === e ? null : e;
		}, ee = (e) => ou(e) ? su(t.actions, e, t.actionAvailable) : [], T = (e, n) => ou(n) && n.interactiveOverlays !== !1 ? t.actions.find((r) => r.id === e.action && t.actionAvailable(r, [n])) : void 0, E = () => {
			S.value = null;
		};
		return nr(() => document.addEventListener("click", E)), ar(() => document.removeEventListener("click", E)), (t, n) => (W(), G("div", Cu, [K("table", wu, [K("thead", null, [K("tr", null, [
			K("th", Tu, [K("span", Eu, [K("label", Du, [K("input", {
				type: "checkbox",
				checked: e.allSelected,
				"aria-label": e.t("COM_SMARTBROWSER_SELECT_ALL"),
				onChange: n[0] ||= (e) => t.$emit("select-all")
			}, null, 40, Ou)]), e.orderingField ? (W(), G("button", {
				key: 0,
				type: "button",
				class: "resource-ordering-sort",
				title: e.t("JGRID_HEADING_ORDERING"),
				onClick: n[1] ||= (n) => t.$emit("sort", e.orderingField)
			}, [K("span", {
				class: M(p(e.orderingField)),
				"aria-hidden": "true"
			}, null, 2)], 8, ku)) : Y("", !0)])]),
			(W(!0), G(U, null, H(a.value, (n) => (W(), G("th", {
				key: n.id,
				class: M(`resource-column-${n.id}`),
				style: se(c(n)),
				scope: "col"
			}, [f(n) ? (W(), G("button", {
				key: 0,
				type: "button",
				class: "btn btn-link",
				title: d(n),
				"aria-label": d(n),
				onClick: (e) => t.$emit("sort", u(n))
			}, [
				l(n) ? (W(), G("span", {
					key: 0,
					class: M(l(n)),
					"aria-hidden": "true"
				}, null, 2)) : Y("", !0),
				K("span", { class: M(["resource-header-text", { "resource-header-primary": ["title", "name"].includes(n.id) }]) }, P(d(n)), 3),
				K("span", {
					class: M(p(u(n))),
					"aria-hidden": "true"
				}, null, 2)
			], 8, Au)) : (W(), G("span", {
				key: 1,
				class: "resource-column-label",
				title: d(n)
			}, [l(n) ? (W(), G("span", {
				key: 0,
				class: M(l(n)),
				"aria-hidden": "true"
			}, null, 2)) : Y("", !0), K("span", { class: M(["resource-header-text", { "resource-header-primary": ["title", "name"].includes(n.id) }]) }, P(n.shortLabel ? e.t(n.shortLabel) : d(n)), 3)], 8, ju))], 6))), 128)),
			n[4] ||= K("th", {
				class: "resource-row-actions",
				scope: "col"
			}, null, -1)
		])]), K("tbody", null, [(W(!0), G(U, null, H(e.resources, (r) => (W(), G("tr", {
			key: r.id,
			class: M({
				selected: e.selectedIds.includes(r.id),
				focused: e.focusedId === r.id,
				focusable: V(ru)(r),
				contextual: V(nu)(r)
			}),
			tabindex: V(ru)(r) ? 0 : void 0,
			"aria-current": e.focusedId === r.id ? "true" : void 0,
			onClick: Q((e) => {
				S.value = null, t.$emit("select", r, e.ctrlKey || e.metaKey);
			}, ["stop"]),
			onDblclick: Q((e) => r.navigable ? t.$emit("open", r.id) : r.activatable && t.$emit("activate", r), ["stop"]),
			onKeydown: So(Q((e) => r.navigable ? t.$emit("open", r.id) : r.activatable ? t.$emit("activate", r) : t.$emit("focus", r), ["prevent"]), ["enter"])
		}, [
			K("td", Nu, [
				!e.options.detailsThumbnails || !r.image ? (W(), G("span", {
					key: 0,
					class: M(r.icon),
					"aria-hidden": "true"
				}, null, 2)) : (W(), G("img", {
					key: 1,
					class: "resource-row-thumbnail",
					src: r.image,
					alt: r.title,
					onError: C
				}, null, 40, Pu)),
				e.options.detailsThumbnails && r.image ? (W(), G("span", {
					key: 2,
					class: M(r.icon),
					hidden: "",
					"aria-hidden": "true"
				}, null, 2)) : Y("", !0),
				V(iu)(r) ? (W(), G("label", {
					key: 3,
					class: M(["resource-row-select", { checked: e.selectedIds.includes(r.id) }]),
					onClick: n[2] ||= Q(() => {}, ["stop"])
				}, [K("input", {
					type: "checkbox",
					checked: e.selectedIds.includes(r.id),
					"aria-label": r.title,
					onChange: (e) => t.$emit("select", r, !0)
				}, null, 40, Fu)], 2)) : Y("", !0)
			]),
			K("th", {
				class: "resource-title-cell",
				scope: "row",
				title: r.title
			}, [K("span", Lu, P(r.title), 1)], 8, Iu),
			(W(!0), G(U, null, H(a.value.slice(1), (e) => (W(), G("td", {
				key: e.id,
				class: M(`resource-column-${e.id}`),
				style: se(c(e)),
				title: y(r, e)
			}, [K("span", { class: M(["resource-cell-content", { "resource-status-group": e.format === "status" }]) }, [e.format === "status" && r.statusPresentation ? (W(), G(U, { key: 0 }, [T(x(r), r) ? (W(), G("button", {
				key: 0,
				type: "button",
				class: M(["resource-status-icon", b(r).class]),
				title: b(r).label,
				onClick: Q((e) => {
					t.$emit("focus", r), t.$emit("action", T(x(r), r), r);
				}, ["stop"])
			}, [K("span", {
				class: M(b(r).icon),
				"aria-hidden": "true"
			}, null, 2), K("span", Bu, P(b(r).label), 1)], 10, zu)) : (W(), G("span", {
				key: 1,
				class: M(["resource-status-icon", b(r).class]),
				title: b(r).label
			}, [K("span", {
				class: M(b(r).icon),
				"aria-hidden": "true"
			}, null, 2), K("span", Hu, P(b(r).label), 1)], 10, Vu))], 64)) : e.format === "language" ? (W(), G("span", Uu, [r.metadata.languageImage ? (W(), G("img", {
				key: 0,
				src: r.metadata.languageImage,
				alt: ""
			}, null, 8, Wu)) : r.metadata.language === "*" ? (W(), G("span", Gu)) : Y("", !0), K("span", Ku, P(v(r, e)), 1)])) : (W(), G("span", qu, P(v(r, e)), 1)), e.overlays && r.overlays?.length ? (W(), G("span", Ju, [(W(!0), G(U, null, H(r.overlays.filter((e) => e.id !== "status"), (e) => (W(), G(U, { key: e.id }, [T(e, r) ? (W(), G("button", {
				key: 0,
				type: "button",
				class: M(["resource-overlay", [`overlay-${e.id}`, `tone-${e.tone || "neutral"}`]]),
				title: e.label,
				onClick: Q((n) => {
					t.$emit("focus", r), t.$emit("action", T(e, r), r);
				}, ["stop"])
			}, [K("span", {
				class: M(e.icon),
				"aria-hidden": "true"
			}, null, 2)], 10, Yu)) : (W(), G("span", {
				key: 1,
				class: M(["resource-overlay", [`overlay-${e.id}`, `tone-${e.tone || "neutral"}`]]),
				title: e.label
			}, [K("span", {
				class: M(e.icon),
				"aria-hidden": "true"
			}, null, 2)], 10, Xu))], 64))), 128))])) : Y("", !0)], 2)], 14, Ru))), 128)),
			K("td", Zu, [ee(r).length ? (W(), G("button", {
				key: 0,
				type: "button",
				class: "resource-row-menu-toggle",
				"aria-expanded": S.value === r.id,
				title: e.t("COM_SMARTBROWSER_ACTIONS"),
				onClick: Q((e) => {
					t.$emit("focus", r), w(r.id);
				}, ["stop"])
			}, [...n[5] ||= [K("span", {
				class: "icon-ellipsis-h",
				"aria-hidden": "true"
			}, null, -1)]], 8, Qu)) : Y("", !0), S.value === r.id ? (W(), G("div", {
				key: 1,
				class: "resource-item-menu resource-row-menu",
				onClick: n[3] ||= Q(() => {}, ["stop"])
			}, [K("strong", null, P(r.title), 1), (W(!0), G(U, null, H(ee(r), (n) => (W(), G("button", {
				key: n.id,
				type: "button",
				class: M(`resource-action-${n.id}`),
				disabled: !e.actionAvailable(n, [r]),
				onClick: (e) => {
					S.value = null, t.$emit("action", n, r);
				}
			}, [K("span", {
				class: M(n.icon),
				"aria-hidden": "true"
			}, null, 2), J(" " + P(e.t(n.label)), 1)], 10, $u))), 128))])) : Y("", !0)])
		], 42, Mu))), 128))])])]));
	}
}, td = (e, t = "") => window.prompt(e, t), nd = (e) => {
	if (!e.metadata?.url) return null;
	let t = (e.metadata.mimeType || "").toLowerCase();
	return t.startsWith("image/") ? "image" : /^video\/(mp4|webm|ogg)$/.test(t) ? "video" : /^audio\/(mpeg|mp4|ogg|wav|webm)$/.test(t) ? "audio" : t === "application/pdf" ? "pdf" : null;
}, rd = class {
	constructor(e, t, n, r, i = "modal", a = "administrator") {
		this.api = e, this.state = t, this.reload = n, this.translate = r, this.editorMode = i, this.application = a;
	}
	available(e, t) {
		return e.currentNode && this.state.currentResource?.capabilities?.[e.id] === !1 || e.requiresSelection && t.length === 0 || e.single && t.length !== 1 || e.itemsOnly && t.some((e) => e.kind !== "item") || e.nodesOnly && t.some((e) => e.kind !== "node") ? !1 : e.exclusiveGroup && t.length ? t.some((t) => t.capabilities?.[e.id] === !0) : e.requiresSelection && t.length ? t.every((t) => t.capabilities?.[e.id] === !0) : !0;
	}
	async execute(e, t) {
		if (!this.state.busy) {
			this.state.busy = !0;
			try {
				return await this.executeUnchecked(e, t);
			} catch (e) {
				Joomla.renderMessages({ error: [e.message] });
			} finally {
				this.state.busy = !1;
			}
		}
	}
	async executeUnchecked(e, t) {
		if (!this.available(e, t)) return;
		let n = e.exclusiveGroup ? t.filter((t) => t.capabilities?.[e.id] === !0) : t, r = n.map((e) => e.id);
		if (e.id === "upload") return this.pickUpload();
		if (e.id === "createNode") {
			let t = td(this.translate("COM_SMARTBROWSER_NEW_FOLDER_NAME"));
			t && await this.mutate(e.id, [], {
				nodeId: this.state.selectedNode,
				name: t
			});
			return;
		}
		if (e.currentNode) {
			let t = await this.api.execute(e.id, [], { nodeId: this.state.selectedNode });
			t?.command === "openEditor" ? this.openEditor(t.url) : await this.reload();
			return;
		}
		if (e.id === "rename") {
			let n = td(this.translate("COM_SMARTBROWSER_RENAME_TO"), t[0].title);
			n && n !== t[0].title && await this.mutate(e.id, r, { name: n });
			return;
		}
		if (e.id === "delete") {
			window.confirm(this.translate("COM_SMARTBROWSER_CONFIRM_DELETE")) && await this.mutate(e.id, r);
			return;
		}
		if (e.id === "removeFromGroup") {
			let t = Object.fromEntries(n.map((e) => [e.id, e.metadata?.sourceGroupId]));
			if (r.some((e) => !t[e])) return;
			window.confirm(this.translate("COM_SMARTBROWSER_CONFIRM_REMOVE_FROM_GROUP")) && await this.mutate(e.id, r, { groups: t });
			return;
		}
		let i = await this.api.execute(e.id, r);
		if (i?.command === "openEditor") {
			this.openEditor(i.url);
			return;
		}
		if (i?.command === "openUrl" && i.url) {
			if (i.target === "_self") {
				let e = new URL(i.url, window.location.href);
				if (i.returnToCurrent) {
					let t = window.location.href;
					e.searchParams.set("return", window.btoa(t));
				}
				i.replace ? window.location.replace(e.toString()) : window.location.href = e.toString();
			} else window.open(i.url, "_blank", "noopener,noreferrer");
			return;
		}
		if (i?.command === "copyText" && i.text) {
			await navigator.clipboard.writeText(i.text), Joomla.renderMessages({ success: [i.text] });
			return;
		}
		e.id === "preview" && this.preview(i), e.id === "share" && this.share(i), e.id === "download" && this.download(i), (i?.updated || i?.deleted) && await this.reload();
	}
	openEditor(e) {
		if (this.editorMode === "page") {
			let t = new URL(e, window.location.href);
			this.application === "site" ? (window.sessionStorage.setItem("supjx.smartbrowser.editorReturn", window.location.href), t.searchParams.set("sbpage", "1"), t.searchParams.delete("tmpl")) : (t.searchParams.delete("layout"), t.searchParams.delete("tmpl"), t.searchParams.set("return", window.btoa(window.location.href))), window.location.assign(t.toString());
			return;
		}
		let t = document.createElement("dialog");
		t.className = "smartbrowser-editor", t.innerHTML = `<iframe src="${this.escape(e)}" title="Editor"></iframe><div class="smartbrowser-editor-loading" role="status"><span class="spinner-border" aria-hidden="true"></span><span>${this.escape(this.translate("COM_SMARTBROWSER_WORKING"))}</span></div><button type="button" class="btn-close" aria-label="Close"></button>`;
		let n = t.querySelector("iframe"), r = t.querySelector(".smartbrowser-editor-loading"), i = !1, a = !1;
		n.addEventListener("load", () => {
			r.hidden = !0;
			try {
				n.contentWindow.addEventListener("beforeunload", () => {
					r.hidden = !1;
				}, { once: !0 });
			} catch {}
			if (a = !1, window.SmartBrowserDialogDismiss.watchFrame(n, () => {
				a = !0;
			}), !i) {
				i = !0;
				return;
			}
			try {
				let e = new URL(n.contentWindow.location.href);
				if (e.searchParams.get("option") === "com_users" && e.searchParams.get("view") === "login" || n.contentDocument?.querySelector("form#login-form, .com-users-login")) {
					window.top.location.assign(e.toString());
					return;
				}
				let r = e.searchParams.get("task") || "", i = e.searchParams.get("layout") || "", a = /\.(?:edit|add)$/.test(r) || i === "edit" || i === "modal", o = !!n.contentDocument?.querySelector("form#adminForm");
				(!a || !o) && t.close();
			} catch {}
		}), t.querySelector("button").addEventListener("click", () => t.close()), window.SmartBrowserDialogDismiss.install(t, () => a), t.addEventListener("close", async () => {
			t.remove(), await this.reload();
		}), document.body.appendChild(t), t.showModal();
	}
	async mutate(e, t, n = {}) {
		try {
			await this.api.execute(e, t, n), await this.reload();
		} catch (e) {
			Joomla.renderMessages({ error: [e.message] });
		}
	}
	pickUpload() {
		let e = document.createElement("input");
		e.type = "file", e.multiple = !0, e.addEventListener("change", () => this.uploadFiles(e.files)), e.click();
	}
	async uploadFiles(e) {
		if (this.state.busy) return;
		this.state.busy = !0;
		let t = 0;
		try {
			for (let n of Array.from(e || [])) try {
				let e = await this.read(n), r = {
					nodeId: this.state.selectedNode,
					name: n.name,
					content: e
				};
				try {
					await this.api.execute("upload", [], r);
				} catch (e) {
					if (e.status !== 409) throw e;
					let t = this.translate("COM_MEDIA_FILE_EXISTS_AND_OVERRIDE").replace(/%[sS]/, n.name);
					if (!window.confirm(t)) continue;
					await this.api.execute("upload", [], {
						...r,
						override: !0
					});
				}
				t++;
			} catch (e) {
				let t = e?.message || this.translate("COM_SMARTBROWSER_ERROR_UPLOAD_FAILED");
				Joomla.renderMessages({ error: [`${n.name}: ${t}`] });
			}
			t && (await this.reload(), Joomla.renderMessages({ success: [this.translate("COM_MEDIA_UPLOAD_SUCCESS")] }));
		} finally {
			this.state.busy = !1;
		}
	}
	read(e) {
		return new Promise((t, n) => {
			let r = new FileReader();
			r.onload = () => t(String(r.result).split(",")[1]), r.onerror = n, r.readAsDataURL(e);
		});
	}
	preview(e) {
		let t = e.metadata?.url, n = e, [r, i] = this.splitFilename(e.title), a = document.createElement("dialog");
		a.className = "smartbrowser-preview";
		let o = nd(e), s = o === "image" ? `<img data-preview-media src="${this.escapeAttribute(t)}" alt="${this.escapeAttribute(e.title)}">` : o === "video" ? `<video data-preview-media src="${this.escapeAttribute(t)}" controls preload="metadata"></video>` : o === "audio" ? `<audio data-preview-media src="${this.escapeAttribute(t)}" controls preload="metadata"></audio>` : o === "pdf" ? `<iframe data-preview-media src="${this.escapeAttribute(t)}" title="${this.escapeAttribute(e.title)}"></iframe>` : `<div class="smartbrowser-preview-unavailable"><span class="${this.escapeAttribute(e.icon || "icon-file")}" aria-hidden="true"></span><span>${this.escape(this.translate("COM_SMARTBROWSER_PREVIEW_UNAVAILABLE"))}</span></div>`;
		a.innerHTML = `<form class="smartbrowser-preview-form com-smartbrowser-editor" method="dialog">
      <div class="smartbrowser-preview-actions">
        <button type="button" class="btn btn-primary" data-action="save" ${e.capabilities?.rename ? "" : "disabled"}><span class="icon-save" aria-hidden="true"></span> ${this.escapeTranslated("JSAVE")}</button>
        <button type="button" class="btn btn-outline-primary" data-action="apply" ${e.capabilities?.rename ? "" : "disabled"}><span class="icon-check" aria-hidden="true"></span> ${this.escapeTranslated("JAPPLY")}</button>
        <button type="button" class="btn btn-outline-primary" data-action="copy" ${e.capabilities?.copy ? "" : "disabled"}><span class="icon-copy" aria-hidden="true"></span> ${this.escapeTranslated("JSAVEASCOPY")}</button>
        <button type="button" class="btn btn-danger" data-action="cancel"><span class="icon-cancel" aria-hidden="true"></span> ${this.escape(this.translate("COM_SMARTBROWSER_CANCEL"))}</button>
        <button type="button" class="btn btn-outline-secondary smartbrowser-preview-download" data-action="download"><span class="icon-download" aria-hidden="true"></span> ${this.escape(this.translate("COM_SMARTBROWSER_ACTION_DOWNLOAD"))}</button>
      </div>
      <div class="smartbrowser-preview-card">
        <div class="smartbrowser-preview-tabs" role="tablist">
          <button type="button" role="tab" data-tab="content" aria-selected="true" aria-controls="smartbrowser-preview-content">${this.escape(this.translate("COM_SMARTBROWSER_CONTENT_TAB"))}</button>
          <button type="button" role="tab" data-tab="metadata" aria-selected="false" aria-controls="smartbrowser-preview-metadata">${this.escape(this.translate("COM_SMARTBROWSER_METADATA_TAB"))}</button>
        </div>
        <section id="smartbrowser-preview-content" class="smartbrowser-preview-tab smartbrowser-editor-tab" role="tabpanel">
          <div class="smartbrowser-preview-name-fields smartbrowser-editor-title-alias">
            <div class="control-group"><div class="control-label"><label for="smartbrowser-preview-name">${this.escape(this.translate("COM_SMARTBROWSER_FILE_NAME"))}</label></div>
              <div class="controls"><input id="smartbrowser-preview-name" class="form-control" name="name" required value="${this.escapeAttribute(r)}" ${e.capabilities?.rename || e.capabilities?.copy ? "" : "readonly"}></div></div>
            <div class="control-group"><div class="control-label"><label for="smartbrowser-preview-extension">${this.escape(this.translate("COM_SMARTBROWSER_EXTENSION"))}</label></div>
              <div class="controls"><input id="smartbrowser-preview-extension" class="form-control" name="extension" value="${this.escapeAttribute(i)}" ${e.capabilities?.rename || e.capabilities?.copy ? "" : "readonly"}></div></div>
          </div>
          <div class="smartbrowser-preview-media">${s}</div>
        </section>
        <section id="smartbrowser-preview-metadata" class="smartbrowser-preview-tab" role="tabpanel" hidden>
          <dl class="smartbrowser-preview-metadata">
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_FILE_TYPE"))}</dt><dd>${this.escape(this.translate({
			image: "COM_SMARTBROWSER_MEDIA_IMAGE",
			document: "COM_SMARTBROWSER_MEDIA_DOCUMENT",
			video: "COM_SMARTBROWSER_MEDIA_VIDEO",
			audio: "COM_SMARTBROWSER_MEDIA_AUDIO"
		}[e.type] || "COM_SMARTBROWSER_RESOURCE"))}</dd></div>
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_MIME_TYPE"))}</dt><dd>${this.escape(e.metadata?.mimeType || "")}</dd></div>
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_EXTENSION"))}</dt><dd>${this.escape(e.metadata?.extension || "")}</dd></div>
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_SIZE"))}</dt><dd>${this.escape(this.formatPreviewSize(e.metadata?.size))}</dd></div>
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_DIMENSIONS"))}</dt><dd>${e.metadata?.width && e.metadata?.height ? `${Number(e.metadata.width)} × ${Number(e.metadata.height)} px` : ""}</dd></div>
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_DATE_CREATED"))}</dt><dd>${this.escape(this.formatPreviewDate(e.metadata?.created))}</dd></div>
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_DATE_MODIFIED"))}</dt><dd>${this.escape(this.formatPreviewDate(e.metadata?.modified))}</dd></div>
          </dl>
        </section>
      </div></form>`, a.querySelector("form").addEventListener("submit", (e) => e.preventDefault()), a.querySelectorAll("[data-tab]").forEach((e) => e.addEventListener("click", () => {
			a.querySelectorAll("[data-tab]").forEach((t) => {
				t.setAttribute("aria-selected", String(t === e));
			}), a.querySelector("#smartbrowser-preview-content").hidden = e.dataset.tab !== "content", a.querySelector("#smartbrowser-preview-metadata").hidden = e.dataset.tab !== "metadata";
		})), a.querySelector("[data-action=\"cancel\"]").addEventListener("click", () => a.close()), a.querySelector("[data-action=\"download\"]").addEventListener("click", async () => {
			try {
				this.download(await this.api.execute("download", [n.id]));
			} catch (e) {
				Joomla.renderMessages({ error: [e.message] });
			}
		});
		let c = a.querySelector("[name=\"name\"]"), l = a.querySelector("[name=\"extension\"]"), u = () => c.value.trim() + (l.value.trim().replace(/^\.+/, "") ? `.${l.value.trim().replace(/^\.+/, "")}` : "");
		window.SmartBrowserDialogDismiss.install(a, () => u() !== n.title);
		let d = async (e) => {
			if (!c.value.trim()) {
				c.reportValidity();
				return;
			}
			let t = u();
			try {
				if (t !== n.title) {
					n = await this.api.execute("rename", [n.id], { name: t });
					let e = a.querySelector("[data-preview-media]");
					e && n.metadata?.url && (e.src = n.metadata.url), [c.value, l.value] = this.splitFilename(n.title), await this.reload();
				}
				e && a.close();
			} catch (e) {
				Joomla.renderMessages({ error: [e.message] });
			}
		};
		a.querySelector("[data-action=\"save\"]").addEventListener("click", () => d(!0)), a.querySelector("[data-action=\"apply\"]").addEventListener("click", () => d(!1)), a.querySelector("[data-action=\"copy\"]").addEventListener("click", async () => {
			if (!c.value.trim()) {
				c.reportValidity();
				return;
			}
			try {
				await this.api.execute("copy", [n.id], { name: u() }), a.close(), await this.reload();
			} catch (e) {
				Joomla.renderMessages({ error: [e.message] });
			}
		}), a.addEventListener("close", () => a.remove()), document.body.appendChild(a), a.showModal();
	}
	async share(e) {
		let t = e.metadata?.url;
		t && (navigator.share ? await navigator.share({
			title: e.title,
			url: t
		}) : (await navigator.clipboard.writeText(t), Joomla.renderMessages({ success: [t] })));
	}
	download(e) {
		let t = document.createElement("a");
		t.download = e.title, t.href = e.metadata?.content ? `data:${e.metadata.mimeType};base64,${e.metadata.content}` : e.metadata?.url, t.click();
	}
	escape(e) {
		let t = document.createElement("div");
		return t.textContent = e || "", t.innerHTML;
	}
	escapeTranslated(e) {
		let t = document.createElement("textarea");
		return t.innerHTML = this.translate(e), this.escape(t.value);
	}
	escapeAttribute(e) {
		return this.escape(e).replace(/"/g, "&quot;");
	}
	formatPreviewSize(e) {
		return Number.isFinite(Number(e)) ? `${(Number(e) / 1024).toFixed(2)} KB` : "";
	}
	formatPreviewDate(e) {
		if (!e) return "";
		let t = new Date(e);
		return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
	}
	splitFilename(e) {
		let t = e.lastIndexOf(".");
		return t > 0 && t < e.length - 1 ? [e.slice(0, t), e.slice(t + 1)] : [e, ""];
	}
}, id = (e, t) => (n, r) => {
	let i = e === "title" ? n.title.toLocaleLowerCase() : e === "dimension" ? (n.metadata?.width || 0) * (n.metadata?.height || 0) : n.metadata?.[e], a = e === "title" ? r.title.toLocaleLowerCase() : e === "dimension" ? (r.metadata?.width || 0) * (r.metadata?.height || 0) : r.metadata?.[e], o = typeof i == "string" ? (i || "").localeCompare(a || "") : (i || 0) - (a || 0);
	return t === "asc" ? o : -o;
};
function ad({ options: e, api: t, persistence: n, viewRegistry: r }) {
	let i = new Set(e.allowedResourceTypes || []), a = (t) => e.mode === "readonly" || i.size && !i.has(t.type) ? {
		...t,
		selectable: !1,
		bulkSelectable: !1
	} : t, o = {
		selectedNode: e.currentNode || e.initialNode || e.roots[0]?.id || "",
		activeView: e.defaultView || "grid",
		viewOptions: {
			gridSize: "md",
			detailsThumbnails: !1,
			detailsDateMode: "modified"
		},
		hiddenColumns: [],
		shownColumns: [],
		sortBy: "",
		sortDirection: "",
		showInfo: !1,
		filters: {}
	}, s = n.load(o);
	s.filters = {
		...s.filters || {},
		...e.initialFilters || {}
	}, Array.isArray(s.hiddenColumns) || (s.hiddenColumns = []), Array.isArray(s.shownColumns) || (s.shownColumns = []), e.currentNode && (s.selectedNode = e.currentNode), e.defaultView && (s.activeView = e.defaultView), r.has(s.activeView) || (s.activeView = "grid");
	let c = /* @__PURE__ */ Mt({
		...s,
		roots: e.roots,
		nodes: [],
		items: [],
		contextItems: [],
		breadcrumb: [],
		actions: e.actions,
		presentation: e.presentation || {},
		currentResource: null,
		focusedId: null,
		selectedIds: [],
		search: "",
		loading: !1,
		busy: !1,
		error: ""
	}), l = Z(() => {
		let e = c.search.trim().toLocaleLowerCase(), t = (t) => !e || [
			t.title,
			t.subtitle,
			t.metadata?.alias
		].some((t) => String(t || "").toLocaleLowerCase().includes(e)), n = c.nodes.map(eu).map(a).filter(t), r = c.items.map(eu).map(a).filter(t), i = c.contextItems.map(tu);
		return c.sortBy ? [
			...n.sort(id(c.sortBy, c.sortDirection)),
			...r.sort(id(c.sortBy, c.sortDirection)),
			...i
		] : [
			...n,
			...r,
			...i
		];
	}), u = Z(() => {
		let t = e.selectionTarget || "both";
		return l.value.filter((e) => iu(e, t));
	}), d = Z(() => {
		let t = e.selectionTarget || "both";
		return l.value.filter((e) => au(e, t));
	}), f = Z(() => l.value.filter((e) => c.selectedIds.includes(e.id))), p = Z(() => l.value.find((e) => e.id === c.focusedId) || null);
	async function m(n = c.selectedNode) {
		c.loading = !0, c.error = "", c.selectedIds = [], c.focusedId = null;
		try {
			let r = await t.getResources(n, {
				search: c.search,
				sortBy: c.sortBy,
				sortDirection: c.sortDirection,
				filters: c.filters
			});
			c.selectedNode = n, c.nodes = r.nodes, c.items = r.items, c.contextItems = r.contextItems || [], c.breadcrumb = r.breadcrumb, c.actions = e.mode === "readonly" ? [] : r.actions, c.presentation = r.presentation || c.presentation, c.sortBy && !(c.presentation.sortFields || []).some((e) => e.id === c.sortBy) && (c.sortBy = "", c.sortDirection = ""), (c.presentation.filters || []).forEach((e) => {
				c.filters[e.id] === void 0 && (c.filters[e.id] = e.default);
			}), c.currentResource = r.currentResource || null;
			let i = new URL(window.location.href);
			i.searchParams.set("node", n), window.history.replaceState({}, "", i);
		} catch (t) {
			if (n !== e.initialNode && [403, 404].includes(t.status)) {
				c.selectedNode = e.initialNode, await m(e.initialNode);
				return;
			}
			c.error = t.message, Joomla.renderMessages({ error: [t.message] });
		} finally {
			c.loading = !1;
		}
	}
	function h(t, n = !0) {
		if (g(t), !iu(t, e.selectionTarget || "both")) return;
		let r = c.selectedIds.includes(t.id);
		!e.multiple || !n ? c.selectedIds = r ? [] : [t.id] : c.selectedIds = r ? c.selectedIds.filter((e) => e !== t.id) : [...c.selectedIds, t.id];
	}
	function g(e) {
		ru(e) && (c.focusedId = e.id);
	}
	function _() {
		let e = d.value.map((e) => e.id), t = e.length > 0 && e.every((e) => c.selectedIds.includes(e));
		c.selectedIds = t ? c.selectedIds.filter((t) => !e.includes(t)) : [.../* @__PURE__ */ new Set([...c.selectedIds, ...e])];
	}
	function v() {
		let e = d.value.map((e) => e.id), t = new Set(c.selectedIds);
		e.forEach((e) => t.has(e) ? t.delete(e) : t.add(e)), c.selectedIds = [...t];
	}
	return Mn(() => [
		c.selectedNode,
		c.activeView,
		c.viewOptions,
		c.hiddenColumns,
		c.shownColumns,
		c.sortBy,
		c.sortDirection,
		c.showInfo,
		c.filters
	], () => n.save(c), { deep: !0 }), {
		state: c,
		resources: l,
		selectableResources: u,
		bulkSelectableResources: d,
		selection: f,
		focusedResource: p,
		load: m,
		focus: g,
		toggle: h,
		selectAll: _,
		invertSelection: v
	};
}
//#endregion
//#region resources/js/core/viewRegistry.js
var od = () => {
	let e = /* @__PURE__ */ new Map();
	return {
		register(t) {
			if (!t.id || !t.component) throw TypeError("A view requires an id and component.");
			return e.set(t.id, Object.freeze({
				supportsSize: !1,
				controls: [],
				options: {},
				...t
			})), this;
		},
		get(t) {
			return e.get(t);
		},
		all() {
			return Array.from(e.values());
		},
		has(t) {
			return e.has(t);
		}
	};
}, sd = class {
	constructor(e = window.sessionStorage, t = "supjx.smartbrowser.media") {
		this.storage = e, this.key = t;
	}
	load(e) {
		try {
			return {
				...e,
				...JSON.parse(this.storage.getItem(this.key) || "{}")
			};
		} catch {
			return { ...e };
		}
	}
	save(e) {
		let t = {
			selectedNode: e.selectedNode,
			activeView: e.activeView,
			viewOptions: e.viewOptions,
			hiddenColumns: e.hiddenColumns,
			shownColumns: e.shownColumns,
			sortBy: e.sortBy,
			sortDirection: e.sortDirection,
			showInfo: e.showInfo,
			filters: e.filters
		};
		this.storage.setItem(this.key, JSON.stringify(t));
	}
}, cd = "supjx.smartbrowser.preferencesResetToken";
function ld(e, t) {
	if (!t || e.getItem(cd) === t) return !1;
	let n = [];
	for (let t = 0; t < e.length; t++) {
		let r = e.key(t);
		r?.startsWith("supjx.smartbrowser.") && r !== cd && r !== "supjx.smartbrowser.editorReturn" && n.push(r);
	}
	return n.forEach((t) => e.removeItem(t)), e.setItem(cd, t), !0;
}
//#endregion
//#region resources/js/core/resetSessionNavigation.js
var ud = "supjx.smartbrowser.";
function dd(e, t, n) {
	if (!n) return !1;
	let r = `${ud}session.${t}`, i = e.getItem(r);
	if (e.setItem(r, n), !i || i === n) return !1;
	for (let t = 0; t < e.length; t++) {
		let n = e.key(t);
		if (!(!n?.startsWith(ud) || n.startsWith(`${ud}ui.`) || n.startsWith(`${ud}session.`))) try {
			let t = JSON.parse(e.getItem(n));
			if (!t || typeof t != "object" || Array.isArray(t) || !("selectedNode" in t) && !("filters" in t)) continue;
			delete t.selectedNode, delete t.filters, e.setItem(n, JSON.stringify(t));
		} catch {}
	}
	return !0;
}
function fd(e) {
	let t = new URL(e);
	if (t.searchParams.delete("node"), t.searchParams.has("flatFromAdapter")) {
		let e = t.searchParams.get("flatFromBrowseRoot");
		e ? t.searchParams.set("browseRoot", e) : t.searchParams.delete("browseRoot"), t.searchParams.delete("flatScope"), t.searchParams.delete("flatFromNode"), t.searchParams.delete("flatFromBrowseRoot"), t.searchParams.delete("flatFromAdapter");
	}
	return t.toString();
}
//#endregion
//#region resources/js/services/ResourceApi.js
function pd(e, t = 0, n = (e) => e) {
	let r = e?.messages && typeof e.messages == "object" ? Object.values(e.messages).flat() : [], i = [...new Set([e?.message, ...r].filter((e) => typeof e == "string" && e.trim()).map((e) => e.trim()))];
	return i.length ? i.join("; ") : t === 413 ? n("COM_SMARTBROWSER_ERROR_REQUEST_TOO_LARGE") : t ? n("COM_SMARTBROWSER_ERROR_REQUEST_HTTP").replace("%s", String(t)) : n("COM_SMARTBROWSER_ERROR_REQUEST_NETWORK");
}
var md = class {
	constructor(e) {
		this.options = e;
	}
	async getResources(e, t = {}) {
		let n = new URL(`${this.options.apiBaseUrl}&task=api.resources&adapter=${encodeURIComponent(this.options.adapter)}`);
		return n.searchParams.set("mode", this.options.mode || "manage"), this.options.browseRoot && n.searchParams.set("browseRoot", this.options.browseRoot), this.options.flatScope && n.searchParams.set("flatScope", this.options.flatScope), n.searchParams.set("node", e), t.search && n.searchParams.set("search", t.search), t.sortBy && n.searchParams.set("sortBy", t.sortBy), t.sortDirection && n.searchParams.set("sortDirection", t.sortDirection), t.filters && n.searchParams.set("filters", JSON.stringify(t.filters)), n.searchParams.set("showContextResources", this.options.showContextResources ? "1" : "0"), this.request(n);
	}
	async execute(e, t = [], n = {}) {
		let r = new URL(`${this.options.apiBaseUrl}&task=api.action&adapter=${encodeURIComponent(this.options.adapter)}`);
		return r.searchParams.set("mode", this.options.mode || "manage"), this.options.browseRoot && r.searchParams.set("browseRoot", this.options.browseRoot), this.options.flatScope && r.searchParams.set("flatScope", this.options.flatScope), this.request(r, {
			method: "POST",
			body: JSON.stringify({
				action: e,
				selection: t,
				payload: n,
				[this.options.csrfToken]: 1
			})
		});
	}
	request(e, t = {}) {
		return new Promise((n, r) => {
			Joomla.request({
				url: e.toString(),
				method: t.method || "GET",
				data: t.body,
				headers: { "Content-Type": "application/json" },
				onSuccess: (e) => {
					let t = JSON.parse(e);
					if (t.data?.authenticationRequired) this.redirectToLogin(t.data.loginUrl), r(Error(t.message));
					else if (t.success === !1) {
						let e = Error(pd(t, Number(t.code) || 0, (e) => Joomla.Text?._(e, e) || e));
						e.status = Number(t.code) || 0, r(e);
					} else n(t.data);
				},
				onError: (e) => {
					let t = null;
					try {
						t = JSON.parse(e.responseText || e.response), (e.status === 401 || t.data?.authenticationRequired) && this.redirectToLogin(t.data?.loginUrl);
					} catch {
						e.status === 401 && this.redirectToLogin();
					}
					let n = pd(t, Number(e.status) || 0, (e) => Joomla.Text?._(e, e) || e), i = Error(n);
					i.status = Number(e.status) || 0, r(i);
				}
			});
		});
	}
	redirectToLogin(e = null) {
		let t = e || this.options.loginUrl;
		t && window.top.location.assign(t);
	}
}, $ = Joomla.getOptions("com_smartbrowser", {});
ld(window.sessionStorage, $.preferencesResetToken);
var hd = dd(window.sessionStorage, $.application, $.csrfToken) ? fd(window.location.href) : window.location.href;
if (hd !== window.location.href) window.location.replace(hd);
else {
	let e = new md($), t = $.browseRoot ? `supjx.smartbrowser.${$.adapter}.${$.browseRoot}` : `supjx.smartbrowser.${$.adapter}`, n = new sd(window.sessionStorage, $.featuredOnly ? `${t}.featured` : t), r = od().register({
		id: "grid",
		label: "COM_SMARTBROWSER_GRID",
		icon: "icon-th",
		component: Su,
		supportsSize: !0,
		controls: ["sort", "zoom"],
		options: { gridSize: "md" }
	}).register({
		id: "details",
		label: "COM_SMARTBROWSER_DETAILS",
		icon: "icon-list",
		component: ed,
		supportsSize: !1,
		controls: ["thumbnails", "dateField"],
		options: {
			detailsThumbnails: !1,
			detailsDateMode: "modified"
		}
	}), i = ad({
		options: $,
		api: e,
		persistence: n,
		viewRegistry: r
	}), a = new rd(e, i.state, () => i.load(), (e) => Joomla.Text?._(e, e) || e, $.editorMode, $.application);
	window.SmartBrowser = {
		open(e = {}) {
			let t = e.showContextResources ?? $.showContextResources ?? !1, n = e.browseRoot ? `&browseRoot=${encodeURIComponent(e.browseRoot)}` : "", r = e.defaultView ? `&defaultView=${encodeURIComponent(e.defaultView)}` : "", i = e.allowedResourceTypes?.length ? `&allowedResourceTypes=${encodeURIComponent(e.allowedResourceTypes.join(","))}` : "", a = e.showAdapterSwitcher ? "&showAdapterSwitcher=1" : "";
			window.location.href = `${$.returnUrl}&adapter=${encodeURIComponent(e.adapter || $.adapter)}&mode=${encodeURIComponent(e.mode || "select")}&multiple=${+!!e.multiple}&selectionTarget=${encodeURIComponent(e.selectionTarget || "item")}&showContextResources=${+!!t}${n}${r}${i}${a}`;
		},
		registerView: (e) => r.register(e)
	}, Eo(Zl).provide("browser", i).provide("resourceApi", e).provide("smartBrowserOptions", $).provide("viewRegistry", r).provide("actionDriver", a).mount("#smartbrowser-app");
}
//#endregion
