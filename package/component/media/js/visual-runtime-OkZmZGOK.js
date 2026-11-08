import { C as e, E as t, I as n, R as r, S as i, T as a, c as o, j as s, m as c, u as l, v as u, w as d, z as f } from "./visual-runtime-CJIQlqNK.js?v=6.0.0";
//#region resources/js/core/resourceVisual.js
var p = [
	"base",
	"identity",
	"image"
], m = [
	"hidden",
	"center",
	"corner",
	"badge"
], h = [
	"small",
	"medium",
	"large",
	"max"
], g = [
	"top-left",
	"top-right",
	"bottom-left",
	"bottom-right"
], _ = [
	"center",
	"corner",
	"badge"
], v = Object.freeze({
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
}), y = (e, t, n) => {
	let r = /* @__PURE__ */ new Set([t]), i = n;
	for (; i;) {
		if (r.has(i)) return !1;
		r.add(i), i = e[i]?.style === "badge" ? e[i].anchor : null;
	}
	return p.includes(n) && t !== n;
}, b = (e) => {
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
}, x = (e = {}) => {
	if (Array.isArray(e.rules)) return { rules: D(e.rules) };
	let t = b(e), n = {
		order: [],
		imageBackground: [
			"auto",
			"transparent",
			"checkerboard"
		].includes(t.imageBackground) ? t.imageBackground : "auto"
	};
	for (let e of p) {
		let r = t[e] || {}, i = v[e], a = /^(center|corner)-(small|medium|large|max)$/.exec(r.style || ""), o = a ? a[1] : m.includes(r.style) ? r.style : i.style, s = {};
		for (let e of _) {
			let t = r.sizes?.[e], n = a ? a[2] : r.size;
			s[e] = h.includes(t) ? t : !r.sizes && e === o && h.includes(n) ? n : i.sizes[e];
		}
		n[e] = {
			style: o,
			sizes: s,
			size: s[o] || s.center,
			position: g.includes(r.position) ? r.position : i.position,
			anchor: p.includes(r.anchor) && r.anchor !== e ? r.anchor : i.anchor
		};
	}
	n.order = [.../* @__PURE__ */ new Set([...Array.isArray(t.order) ? t.order.filter((e) => p.includes(e)) : v.order, ...v.order])];
	for (let e of p) n[e].style === "badge" && !y(n, e, n[e].anchor) && (n[e].style = "corner", n[e].size = n[e].sizes.corner);
	return n;
}, S = (e = {}) => ({
	nodes: x(e.nodes || e),
	items: x(e.items || e)
}), C = (e, t = {}) => ["transparent", "checkerboard"].includes(t.imageBackground) ? t.imageBackground : e?.type === "image" && e?.kind !== "node" ? "checkerboard" : "transparent", w = (e) => e.style === "center" ? "center" : `${e.style}:${e.position}`, T = (e) => [...new Set(e.filter((e) => e && p.includes(e.asset) && e.style !== "badge" && e.style !== "hidden").map(w))], E = (e, t) => {
	let n = p.includes(e.anchor) ? t.find((t) => t && t.asset === e.anchor && t.style !== "badge" && t.style !== "hidden") : null, r = n ? w(n) : e.anchor;
	return T(t).includes(r) ? r : "item";
}, D = (e) => e.filter((e) => e && p.includes(e.asset)).map((t, n) => ({
	asset: t.asset,
	style: [
		"center",
		"corner",
		"badge"
	].includes(t.style) ? t.style : "center",
	size: h.includes(t.size) ? t.size : "medium",
	position: g.includes(t.position) ? t.position : "top-left",
	priority: Number.isInteger(Number(t.priority)) && Number(t.priority) > 0 ? Number(t.priority) : n + 1,
	anchor: E(t, e)
})), O = (e = {}) => {
	if (Array.isArray(e.rules)) return D(e.rules);
	if (!p.some((t) => e[t]) && !e.baseMode) return [{
		asset: "base",
		style: "center",
		size: "medium",
		position: "top-left",
		anchor: "item",
		priority: 1
	}];
	let t = x(e), n = [];
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
	return D(n);
}, k = (e, t) => {
	let n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), i = [];
	return e.map((e, t) => ({
		rule: e,
		index: t
	})).sort((e, t) => (e.rule.priority ?? e.index + 1) - (t.rule.priority ?? t.index + 1) || e.index - t.index).forEach(({ rule: a, index: o }) => {
		let s = w(a);
		!t[a.asset] || n.has(a.asset) || r.has(s) || (n.add(a.asset), r.add(s), i.push({
			...a,
			ruleIndex: o,
			z: e.length - o
		}));
	}), i;
}, A = {
	small: 25,
	medium: 50,
	large: 75,
	max: 100
}, j = (e, t, n, r = !1) => {
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
	}, a = r ? ["small", "medium"].includes(n) ? "large" : "max" : n, o = e === "badge" ? i[n] : A[a], s = e === "center", c = Math.min(3, (100 - o) / 2);
	return {
		x: s ? (100 - o) / 2 : t.endsWith("right") ? 100 - c - o : c,
		y: s ? (100 - o) / 2 : t.startsWith("bottom") ? 100 - c - o : c,
		width: o,
		height: o
	};
}, M = (e, t) => {
	if (!Number.isFinite(t) || t <= 0) return e;
	let n = t >= 1 ? e.width : e.width * t, r = t >= 1 ? e.height / t : e.height;
	return {
		x: e.x + (e.width - n) / 2,
		y: e.y + (e.height - r) / 2,
		width: n,
		height: r
	};
}, N = (e, t, n, r) => {
	let i = r ? Math.min(e.width * .2, t.width / 2) : 0, a = r ? Math.min(e.height * .2, t.height / 2) : 0;
	return {
		...e,
		x: Math.max(0, Math.min(100 - e.width, (n.endsWith("right") ? t.x + t.width - i : t.x + i) - e.width / 2)),
		y: Math.max(0, Math.min(100 - e.height, (n.startsWith("bottom") ? t.y + t.height - a : t.y + a) - e.height / 2))
	};
}, P = (e = {}, { settings: t = {}, background: n, availableAssets: r = {}, allowImage: i = !0, imageFailed: a = !1, open: o = !1, imageRatio: s = 1, iconRatios: c = {}, compact: l = !1, alignBaseStart: u = !1 } = {}) => {
	let d = x(t[e.kind === "node" || !e.kind ? "nodes" : "items"] || t), f = {
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
	for (let e of p) r[e] === !1 && (f[e] = "");
	let m = e.visualPresentation;
	if (m === "icon" && (f.image = "", f.base = f.identity || f.base), m === "thumbnail" && f.image && (f.base = "", f.identity = ""), [
		"thumbnail",
		"icon",
		"both"
	].includes(m)) {
		let e = f.image ? [...m === "both" ? [{
			...d.rules?.find((e) => e.style === "badge" && ["identity", "base"].includes(e.asset)) || (d.identity?.style === "badge" ? d.identity : d.base?.style === "badge" ? d.base : v.identity),
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
		m === "both" && (f.base = f.identity || f.base), d.rules = D(e);
	}
	if (d.rules) {
		let t = k(d.rules, f).map((e) => ({
			...e,
			icon: e.asset === "image" ? "" : f[e.asset],
			src: e.asset === "image" ? f.image : ""
		}));
		for (let e of t.filter((e) => e.style !== "badge")) {
			let t = j(e.style, e.position, e.size, l);
			t = M(t, e.asset === "image" ? s : c[e.icon] || 1), l && u && e.asset === "base" && e.style === "center" && (t.x = 0), e.box = t;
		}
		for (let e of t.filter((e) => e.style === "badge")) {
			let n = t.find((t) => t !== e && t.style !== "badge" && w(t) === e.anchor), r = n?.box || {
				x: 0,
				y: 0,
				width: 100,
				height: 100
			}, i = N(j("badge", e.position, e.size, l), r, e.position, !!n && !l);
			e.box = e.asset === "image" ? M(i, s) : i;
		}
		return {
			layers: t,
			background: C(e, { imageBackground: n || "auto" })
		};
	}
	let h = p.filter((e) => f[e] && d[e].style !== "hidden").map((e) => ({
		asset: e,
		icon: e === "image" ? "" : f[e],
		src: e === "image" ? f.image : "",
		...d[e],
		z: d.order.indexOf(e) + 1
	}));
	if (!h.some((e) => e.style !== "badge")) {
		let e = h.find((e) => e.asset === "base");
		e ? (e.style = "center", e.size = d.base.sizes.center) : h.push({
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
	if (!h.some((e) => e.style.startsWith("center"))) for (let e of h) e.style === "corner" && (e.style = "center", e.size = d[e.asset].sizes.center);
	let g = /* @__PURE__ */ new Map(), _ = (e) => {
		if (g.has(e.asset)) return g.get(e.asset);
		let t = j(e.style, e.position, e.size, l);
		if (e.style === "badge") {
			let n = h.find((t) => t.asset === e.anchor) || h.filter((t) => t.asset !== e.asset && t.style !== "badge").sort((e, t) => A[t.size] - A[e.size])[0], r = n ? _(n) : {
				x: 4,
				y: 4,
				width: 92,
				height: 92
			};
			t = N(t, r, e.position, !!n && !l);
		}
		return e.asset === "image" ? t = M(t, s) : e.style !== "badge" && (t = M(t, c[e.icon] || 1)), l && u && e.asset === "base" && e.style === "center" && (t.x = 0), g.set(e.asset, t), t;
	};
	for (let e of h) e.box = _(e);
	return {
		layers: h,
		background: C(e, n ? { imageBackground: n } : d)
	};
};
//#endregion
//#region resources/js/core/imagePresentation.js
function F(e) {
	let t = String(e || "").trim().replace(/^auto\s+|\s+auto$/g, "").split(/\s*\/\s*/);
	if (t.length > 2 || t.some((e) => !/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(e))) return null;
	let n = Number(t[0]), r = t.length === 2 ? Number(t[1]) : 1, i = n / r;
	return n > 0 && r > 0 && Number.isFinite(n) && Number.isFinite(r) && i > 0 && Number.isFinite(i) ? i : null;
}
function I({ report: e = (e) => console.error(e) } = {}) {
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
var L = [
	"base",
	"identity",
	"image"
], R = 0, z, B = () => `sbv${++R}`, V = (e) => Number.isFinite(e) ? Math.round(e * 1e3) / 1e3 : 0, H = (e, t, n = 180) => {
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
}, U = (e, t, n) => {
	if (!/^sbv\d+$/.test(e)) throw Error("Invalid visual style ID");
	return t.filter((e) => L.includes(e.asset)).map((t) => {
		let r = t.box, i = (t.fontHeight ?? n * r.height / 100) * (t.style === "badge" ? .65 : 1);
		return t.crop ? `[data-sb-visual="${e}"] > .asset-${t.asset} { --sb-visual-x: ${V(r.x)}%; --sb-visual-y: ${V(r.y)}%; --sb-visual-width: ${V(r.width)}%; --sb-visual-height: ${V(r.height)}%; --sb-visual-level: ${V(t.z)}; --sb-visual-font-size: ${V(i)}px; --sb-crop-x: ${V(t.crop.x)}%; --sb-crop-y: ${V(t.crop.y)}%; --sb-crop-width: ${V(t.crop.width)}%; --sb-crop-height: ${V(t.crop.height)}%; }` : `[data-sb-visual="${e}"] > .asset-${t.asset} { --sb-visual-x: ${V(r.x)}%; --sb-visual-y: ${V(r.y)}%; --sb-visual-width: ${V(r.width)}%; --sb-visual-height: ${V(r.height)}%; --sb-visual-level: ${V(t.z)}; --sb-visual-font-size: ${V(i)}px; }`;
	}).join("\n");
}, W = (e) => {
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
			let o = U(e, n, r) + (a === void 0 ? "" : `\n[data-sb-visual="${e}"] { position: relative; inset: auto; width: 100%; height: ${V(a)}px; }`);
			t.get(e) !== o && (t.set(e, o), i());
		},
		remove(e) {
			t.delete(e) && i();
		}
	};
}, G = () => z ||= W(document), K = ["data-sb-visual"], q = ["src"], J = ["data-visual-icon"], Y = {
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
	setup(p, { expose: m, emit: h }) {
		let g = B(), _ = p, v = h, y = () => D.value?.querySelector(".asset-image > img.resource-visual-image") || null, b = n(null), x = () => {
			let e = y(), t = _.presentationManaged && e ? F(e.ownerDocument.defaultView.getComputedStyle(e).aspectRatio) : null;
			b.value !== t && (b.value = t);
		};
		m({
			getImageElement: y,
			refreshPresentation: x
		}), s(() => _.resource.image, () => {
			b.value = null;
		}, { flush: "sync" });
		let S = l(() => _.fitContent), C = n({
			width: 180,
			height: 180
		}), w = u("smartBrowserOptions", {}), T = n(null), E = n({
			url: "",
			ratio: 1
		}), D = n(null), O = n(_.variant === "compact" ? 18 : 180), k = n({}), A = /* @__PURE__ */ new Set(), j, M = () => {
			for (let e of A) D.value.contains(e) || (j.unobserve(e), A.delete(e));
			for (let e of D.value.querySelectorAll("[data-visual-icon]")) A.has(e) || (j.observe(e), A.add(e));
		};
		e(() => {
			z(), j = new ResizeObserver((e) => {
				for (let t of e) if (t.target === D.value) O.value = Math.min(t.contentRect.width, t.contentRect.height), C.value = {
					width: t.contentRect.width,
					height: t.contentRect.height
				};
				else if (t.contentRect.width && t.contentRect.height) {
					let e = t.target.dataset.visualIcon, n = Math.round(t.contentRect.width / t.contentRect.height * 100) / 100;
					Math.abs((k.value[e] || 0) - n) > .001 && (k.value = {
						...k.value,
						[e]: n
					});
				}
			}), j.observe(D.value), M(), v("image-change", y());
		}), d(() => {
			j && M(), v("image-change", y());
		}), i(() => {
			v("image-change", null), j?.disconnect(), G().remove(g);
		});
		let N = (e) => {
			E.value = {
				url: _.resource.image,
				ratio: e.target.naturalWidth / e.target.naturalHeight
			}, x();
		}, I = l(() => _.presentationManaged ? null : _.resource.imageCrop?.source === _.resource.image ? _.resource.imageCrop : null), L = l(() => {
			if (!_.presentationManaged || !b.value) return null;
			let e = !S.value && C.value.width > 0 && C.value.height > 0 ? C.value.height / C.value.width : 1;
			return b.value * e;
		}), R = l(() => P(_.resource, {
			settings: _.settings ?? _.resource.collectionVisualSettings ?? w.visualSettings ?? {},
			allowImage: _.allowImage,
			open: _.open,
			background: _.background ?? _.resource.collectionImageBackground ?? w.imageBackground ?? "auto",
			availableAssets: _.availableAssets,
			compact: _.variant === "compact",
			alignBaseStart: _.alignBaseStart,
			iconRatios: k.value,
			imageFailed: !!(_.resource.image && T.value === _.resource.image),
			imageRatio: L.value || I.value?.ratio || (E.value.url === _.resource.image ? E.value.ratio : 1)
		})), z = () => {
			let e = S.value ? H(R.value.layers, C.value.width) : {
				layers: R.value.layers,
				side: O.value
			};
			G().update(g, e.layers.map((e) => ({
				...e,
				crop: e.src ? I.value : null
			})), S.value ? e.height : e.side, S.value ? e.height : void 0);
		};
		return s([
			R,
			O,
			C,
			S
		], () => {
			D.value && z();
		}, { flush: "post" }), (e, n) => (a(), c("span", {
			ref_key: "surface",
			ref: D,
			class: f(["resource-visual-content", `visual-${p.variant}`]),
			"data-sb-visual": r(g),
			"aria-hidden": "true"
		}, [(a(!0), c(o, null, t(R.value.layers, (e) => (a(), c("span", {
			key: e.asset,
			class: f(["resource-visual-layer", [
				`asset-${e.asset}`,
				`style-${e.style}`,
				{
					"resource-node-visual-symbol": e.style === "badge",
					"has-image-crop": e.src && I.value
				}
			]])
		}, [e.src ? (a(), c("img", {
			key: 0,
			class: f(["resource-visual-image", { "image-background": R.value.background === "checkerboard" }]),
			src: e.src,
			alt: "",
			loading: "lazy",
			onLoad: N,
			onError: n[0] ||= (e) => T.value = p.resource.image
		}, null, 42, q)) : (a(), c("span", {
			key: 1,
			class: f(["resource-visual-icon", e.icon]),
			"data-visual-icon": e.icon
		}, null, 10, J))], 2))), 128))], 10, K));
	}
};
//#endregion
export { k as a, g as c, D as i, h as l, I as n, O as o, S as r, T as s, Y as t };
