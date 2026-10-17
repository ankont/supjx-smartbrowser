import { c as e } from "./visual-runtime-Bwz_0MG8.js?v=4.0.0";
import { t } from "./visual-runtime-D66WPd8K.js?v=4.0.0";
//#region resources/js/article-media.js
var n = /* @__PURE__ */ new WeakSet();
function r(r) {
	if (n.has(r)) return;
	let i = JSON.parse(r.dataset.sbArticleMedia), a = JSON.parse(r.dataset.sbField), o = !!i.image, s = i.group === "images" || o, c = r.querySelector("[data-sb-value]"), l = c.form, u = new e({
		...a,
		mode: "manage"
	}), d = (e) => {
		let t = l.elements.namedItem(i.nativeNames?.[e] || `jform[${i.group}][${e}]`);
		return t && !t.tagName ? [...t].find((e) => e.type === "checkbox") || t[0] : t;
	}, f = o ? [i.image, ...Object.values(i.usageFields || {
		"media.alt": "image_alt",
		"media.decorative": "image_alt_empty"
	})] : i.group === "images" ? [
		`image_${i.role}`,
		`image_${i.role}_alt`,
		`image_${i.role}_alt_empty`,
		`image_${i.role}_caption`,
		`float_${i.role}`
	] : i.slots.flatMap((e) => [
		`url${e}`,
		`url${e}text`,
		`target${e}`
	]);
	if (f.some((e) => !d(e) || d(e).disabled || d(e).readOnly)) {
		r.remove();
		return;
	}
	if (o) {
		let e = d(i.image).closest(".controls");
		e ? e.append(r) : d(i.image).closest(".control-group")?.after(r);
	}
	s && (r.dataset.sbField = JSON.stringify({
		...a,
		nativeImage: !0,
		nativeUsageKeys: o ? Object.keys(i.usageFields || {
			"media.alt": "",
			"media.decorative": ""
		}) : [
			"media.alt",
			"media.decorative",
			"media.caption",
			"media.class"
		]
	}));
	let p = t(r);
	if (n.add(r), s) {
		let e = d(f[0]);
		p.setNativeAddress?.(e.value), e.addEventListener?.("change", () => p.setNativeAddress?.(e.value));
	}
	for (let e of f) {
		let t = d(e), n = s && e === f[0] ? t.closest("joomla-field-media") : null;
		if (n) {
			n.classList.add("sb-article-image-preview"), t.closest(".control-group")?.classList.add("sb-article-image-field");
			let e = () => n.querySelectorAll(".input-group > :is(button, [role=\"button\"]):not(.button-select):not(.button-clear)").forEach((e) => p.addToolbarButton(e));
			e(), p.attachPreview(n);
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
	let m = !1, h = !1, g = 0, _ = (e, t) => {
		let n = d(e);
		n.type === "checkbox" ? n.checked = !!t : n.value = String(t ?? "");
		let i = s && e === f[0] ? n.closest("joomla-field-media") : null;
		i && (i.validatedUrl = n.value, i.updatePreview?.(), i.dispatchEvent(new CustomEvent("change", {
			bubbles: !0,
			detail: { value: n.value }
		}))), r.dataset.sbNativeWriting = "1";
		try {
			n.dispatchEvent(new Event("change", { bubbles: !0 }));
		} finally {
			delete r.dataset.sbNativeWriting;
		}
	};
	c.addEventListener("change", async () => {
		let e = ++g;
		m = !0, h = !1;
		try {
			let t = JSON.parse(c.value || "{\"items\":[]}").items, n = await u.collection(t, { referenceItems: !0 });
			if (e !== g) return;
			let r = new Map(n.resources.map((e) => [JSON.stringify(e.selection), e])), a = t.map((e) => {
				let t = r.get(JSON.stringify(e.selection));
				if (!t || t.unavailable) throw Error(Joomla.Text._("PLG_FIELDS_SMARTBROWSERPICKER_INVALID"));
				return {
					resource: t,
					usage: e.usage || {}
				};
			});
			if (s) {
				let e = a[0], t = o ? i.image : `image_${i.role}`, n = d(t).value, r = window.SmartBrowserMediaValue.parse?.(n)?.resourceId, s = e && r && r === e.resource.id;
				if (_(t, e ? e.usage["ext.address"] ?? (s ? n : window.SmartBrowserMediaValue.format(e.resource, "joomla")) : ""), o) for (let [t, n] of Object.entries(i.usageFields || {
					"media.alt": "image_alt",
					"media.decorative": "image_alt_empty"
				})) _(n, e?.usage[t] ?? (t !== "media.decorative" && ""));
				else _(`${t}_alt`, e?.usage["media.alt"] || ""), _(`${t}_alt_empty`, e?.usage["media.decorative"] || !1);
				o || (_(`${t}_caption`, e?.usage["media.caption"] || ""), _(`float_${i.role}`, e?.usage["media.class"] || ""));
			} else i.slots.forEach((e, t) => {
				let n = a[t];
				_(`url${e}`, n?.resource.metadata.url || ""), _(`url${e}text`, n?.usage["link.text"] || n?.resource.metadata.linkName || ""), _(`target${e}`, n?.usage["link.target"] ?? "");
			});
		} catch (t) {
			if (e !== g) return;
			h = !0, Joomla.renderMessages({ error: [t.message] });
		} finally {
			e === g && (m = !1);
		}
	}), l.addEventListener("reset", () => {
		g++, m = !1, h = !1;
	}), l.addEventListener("submit", (e) => {
		if (m || h) {
			e.preventDefault();
			let t = document.querySelector(".smartbrowser-editor-busy");
			t && (t.hidden = !0), Joomla.renderMessages({ error: [Joomla.Text._(m ? "COM_SMARTBROWSER_WORKING" : "PLG_FIELDS_SMARTBROWSERPICKER_INVALID")] });
		}
	}, !0), window.addEventListener("pagehide", () => u.destroy(), { once: !0 });
}
for (let e of document.querySelectorAll("[data-sb-article-media]")) r(e);
//#endregion
export { r as mountNativeSelection };
