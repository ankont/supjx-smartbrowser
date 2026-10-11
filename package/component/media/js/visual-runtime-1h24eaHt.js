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
function i(n, { adapter: r, allowedAdapters: i = [], homogeneous: a = !1, maxSelections: o = 500 } = {}) {
	if (!Number.isInteger(o) || o < 1 || o > 500) throw TypeError("Invalid selection limit.");
	if (!Array.isArray(n) || n.length > 500) throw TypeError("A collection supports at most 500 entries.");
	let s = /* @__PURE__ */ new Set(), c = n.map((t) => {
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
		let n = e.selection, r = t(/^uri:[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)?$/.test(n.id) ? {
			...n,
			id: n.id.split(".")[0]
		} : n);
		return !s.has(r) && (s.add(r), !0);
	});
	if (a && new Set(c.map((e) => e.selection.adapter)).size > 1) throw TypeError("This collection requires one adapter.");
	if (c.length > o) throw TypeError("Selection limit exceeded.");
	return c;
}
//#endregion
export { r as a, n as i, e as n, t as r, i as t };
