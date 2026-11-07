import { a as e, c as t } from "./visual-runtime-DbGbfChU.js?v=5.2.0";
import { t as n } from "./visual-runtime-B90WOEAT.js?v=5.2.0";
//#region resources/js/article-media.js
var r = /* @__PURE__ */ new WeakSet();
function i(i) {
	if (r.has(i)) return;
	let a = JSON.parse(i.dataset.sbArticleMedia), o = JSON.parse(i.dataset.sbField), s = !!a.image, c = a.group === "images" || s, l = i.querySelector("[data-sb-value]"), u = l.form, d = new t({
		...o,
		mode: "manage"
	}), f = c ? null : e({
		api: d,
		config: o
	}), p = (e) => {
		let t = u.elements.namedItem(a.nativeNames?.[e] || `jform[${a.group}][${e}]`);
		return t && !t.tagName ? [...t].find((e) => e.type === "checkbox") || t[0] : t;
	}, m = a.group === "images" ? p(`imgclass_${a.role}`) ? `imgclass_${a.role}` : `float_${a.role}` : null, h = a.group === "images" && m !== `float_${a.role}` && p(`float_${a.role}`) ? `float_${a.role}` : null, g = s ? [a.image, ...Object.values(a.usageFields || {
		"media.alt": "image_alt",
		"media.decorative": "image_alt_empty"
	})] : a.group === "images" ? [
		`image_${a.role}`,
		`image_${a.role}_alt`,
		`image_${a.role}_alt_empty`,
		`image_${a.role}_caption`,
		m,
		...h ? [h] : []
	] : a.slots.flatMap((e) => [
		`url${e}`,
		`url${e}text`,
		`target${e}`
	]);
	if (g.some((e) => !p(e) || p(e).disabled || p(e).readOnly)) {
		i.remove();
		return;
	}
	if (s) {
		let e = p(a.image).closest(".controls");
		e ? e.append(i) : p(a.image).closest(".control-group")?.after(i);
	}
	c && (i.dataset.sbField = JSON.stringify({
		...o,
		nativeImage: !0,
		nativeUsageKeys: s ? Object.keys(a.usageFields || {
			"media.alt": "",
			"media.decorative": ""
		}) : [
			"media.alt",
			"media.decorative",
			"media.caption",
			"media.class",
			...h ? ["media.figureClass"] : []
		]
	}));
	let _ = n(i);
	if (r.add(i), c) {
		let e = p(g[0]);
		_.setNativeAddress?.(e.value), e.addEventListener?.("change", () => _.setNativeAddress?.(e.value));
	}
	for (let e of g) {
		let t = p(e), n = c && e === g[0] ? t.closest("joomla-field-media") : null;
		if (n) {
			n.classList.add("sb-article-image-preview"), t.closest(".control-group")?.classList.add("sb-article-image-field");
			let e = () => n.querySelectorAll(".input-group > :is(button, [role=\"button\"]):not(.button-select):not(.button-clear)").forEach((e) => _.addToolbarButton(e));
			e(), _.attachPreview(n);
			let r = new MutationObserver(e);
			r.observe(n, {
				childList: !0,
				subtree: !0
			}), window.addEventListener("pagehide", () => r.disconnect(), { once: !0 });
		} else {
			let e = t.closest(".control-group");
			e?.setAttribute("hidden", ""), e?.classList?.add("sb-native-selection-hidden");
		}
	}
	let v = !1, y = !1, b = 0, x = (e, t) => {
		let n = p(e);
		n.type === "checkbox" ? n.checked = !!t : n.value = String(t ?? "");
		let r = c && e === g[0] ? n.closest("joomla-field-media") : null;
		r && (r.validatedUrl = n.value, r.updatePreview?.(), r.dispatchEvent(new CustomEvent("change", {
			bubbles: !0,
			detail: { value: n.value }
		}))), i.dataset.sbNativeWriting = "1";
		try {
			n.dispatchEvent(new Event("change", { bubbles: !0 }));
		} finally {
			delete i.dataset.sbNativeWriting;
		}
	};
	if (l.addEventListener("change", async () => {
		let e = ++b;
		v = !0, y = !1;
		try {
			let t = JSON.parse(l.value || "{\"items\":[]}").items, n = await d.collection(t, { referenceItems: !0 });
			if (e !== b) return;
			let r = new Map(n.resources.map((e) => [JSON.stringify(e.selection), e])), i = await Promise.all(t.map(async (e) => {
				let t = r.get(JSON.stringify(e.selection));
				if (!t || t.unavailable) throw Error(Joomla.Text._("PLG_FIELDS_SMARTBROWSERPICKER_INVALID"));
				let n = t.metadata?.publicUrl || t.metadata?.url || "";
				if (!c && !n) throw Error(Joomla.Text._("COM_SMARTBROWSER_LINK_NO_PUBLIC_URL"));
				let i = c ? "" : await f.serialize(e, t);
				return {
					resource: t,
					usage: e.usage || {},
					url: n,
					address: i
				};
			}));
			if (e !== b) return;
			if (c) {
				let e = i[0], t = s ? a.image : `image_${a.role}`, n = p(t).value, r = window.SmartBrowserMediaValue.parse?.(n)?.resourceId, o = e && r && r === e.resource.id;
				if (x(t, e ? e.usage["ext.address"] ?? (o ? n : window.SmartBrowserMediaValue.format(e.resource, "joomla")) : ""), s) for (let [t, n] of Object.entries(a.usageFields || {
					"media.alt": "image_alt",
					"media.decorative": "image_alt_empty"
				})) x(n, e?.usage[t] ?? (t !== "media.decorative" && ""));
				else x(`${t}_alt`, e?.usage["media.alt"] || ""), x(`${t}_alt_empty`, e?.usage["media.decorative"] || !1);
				s || (x(`${t}_caption`, e?.usage["media.caption"] || ""), x(m, e?.usage["media.class"] || ""), h && e && Object.hasOwn(e.usage, "media.figureClass") ? x(h, e.usage["media.figureClass"] || "") : h && !e && x(h, ""));
			} else a.slots.forEach((e, t) => {
				let n = i[t];
				x(`url${e}`, n?.address || ""), x(`url${e}text`, n?.usage["link.text"] || n?.resource.metadata.linkName || ""), x(`target${e}`, n?.usage["link.target"] ?? "");
			});
		} catch (t) {
			if (e !== b) return;
			y = !0, Joomla.renderMessages({ error: [t.message] });
		} finally {
			e === b && (v = !1);
		}
	}), u.addEventListener("reset", () => {
		b++, v = !1, y = !1;
	}), u.addEventListener("submit", (e) => {
		if (v || y) {
			e.preventDefault();
			let t = document.querySelector(".smartbrowser-editor-busy");
			t && (t.hidden = !0), Joomla.renderMessages({ error: [Joomla.Text._(v ? "COM_SMARTBROWSER_WORKING" : "PLG_FIELDS_SMARTBROWSERPICKER_INVALID")] });
		}
	}, !0), f && o.nativeLinkAddresses?.some((e) => /#[a-zA-Z][a-zA-Z0-9]*:\/\//.test(e))) {
		let e = b;
		v = !0;
		let t = JSON.parse(l.value || "{\"items\":[]}").items;
		Promise.all(o.nativeLinkAddresses.filter(Boolean).map((e, n) => f.import(e, [], { append: !1 }).then((e) => e.items[0]).catch(() => t[n]))).then((t) => {
			if (b === e) return _.setItems(t.filter(Boolean), {
				silent: !0,
				initial: !0
			});
		}).catch(() => {}).finally(() => {
			b === e && (v = !1);
		});
	}
	window.addEventListener("pagehide", () => {
		f?.destroy(), d.destroy();
	}, { once: !0 });
}
for (let e of document.querySelectorAll("[data-sb-article-media]")) i(e);
//#endregion
export { i as mountNativeSelection };
