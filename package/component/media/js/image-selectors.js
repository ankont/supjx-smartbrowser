import { t as e } from "./visual-runtime-Djrr_qeB.js?v=3.6.22";
import { mountNativeSelection as t } from "./article-media.js?v=3.6.22";
//#region resources/js/image-selectors.js
var n = /* @__PURE__ */ new WeakSet(), r = Joomla.getOptions("com_smartbrowser.image-selectors", {});
function i(e) {
	if (!e) return null;
	let t = window.SmartBrowserMediaValue.parse(e);
	if (t.resourceId) return {
		adapter: "media",
		id: t.resourceId
	};
	if (/[\\?#]/.test(e) || e.split("/").includes("..")) throw Error("Unsupported media value");
	let n = new URL(e, r.siteUrl).href, i = [...r.roots].sort((e, t) => t.url.length - e.url.length).find((e) => n.startsWith(e.url));
	if (!i) throw Error("Unsupported media provider");
	let a = "/" + decodeURIComponent(n.slice(i.url.length));
	if (/[\\?#]/.test(a) || a.split("/").includes("..")) throw Error("Unsafe media path");
	return {
		adapter: "media",
		id: i.filesystem + ":" + a
	};
}
function a(a) {
	if (n.has(a) || a.getAttribute("types") !== "images") return;
	let o = a.querySelector(".field-media-input"), s = o?.form, c = o?.closest(".control-group");
	if (!s || !c || o.matches(":disabled") || o.readOnly || !o.name || c.nextElementSibling?.matches("[data-sb-article-media]")) return;
	let l;
	try {
		l = i(o.value);
	} catch {
		return;
	}
	let u = {}, d = { image: o.name }, f = {}, p = /^jform\[(images|params)\]\[(image_intro|image_fulltext|image)\]$/.exec(o.name), m = /^(.*)\[imagefile\]$/.exec(o.name);
	if (p || m) {
		let e = m ? {
			"media.alt": "alt_text",
			"media.decorative": "alt_empty"
		} : {
			"media.alt": p[2] + "_alt",
			"media.decorative": p[2] + "_alt_empty"
		};
		p && p[1] === "images" && Object.assign(e, {
			"media.caption": p[2] + "_caption",
			"media.class": "float_" + p[2].slice(6)
		});
		for (let [t, n] of Object.entries(e)) {
			let e = m ? `${m[1]}[${n}]` : `jform[${p[1]}][${n}]`, r = s.elements.namedItem(e);
			!r?.tagName || r.disabled || r.readOnly || (u[t] = n, d[n] = e, f[t] = r.type === "checkbox" ? r.checked : r.value);
		}
	}
	let h = document.createElement("div"), g = "";
	try {
		let e = new URL(a.getAttribute("url"), window.location.href).searchParams.get("path") || "";
		/^[\w-]+:\//.test(e) && (g = e);
	} catch {}
	h.className = "sb-selection-field", h.dataset.sbArticleMedia = JSON.stringify({
		group: "native",
		image: "image",
		usageFields: u,
		nativeNames: d
	}), h.dataset.sbField = JSON.stringify({
		...r,
		browseRoot: g,
		adapter: "media",
		allowedAdapters: ["media"],
		allowedResourceTypes: ["image"],
		multiple: !1,
		maxSelections: 1,
		homogeneous: !0,
		selectionTarget: "item",
		editorDisplay: "compact",
		informationPanelPosition: "right",
		selectionUseData: "editable",
		fullWidth: !0,
		showLabel: !c.closest?.("[data-sb-native-media]"),
		preserveUsageOnReplace: !0,
		selectionProfile: Object.fromEntries(Object.entries(f).map(([e, t]) => [e, { default: t }]))
	}), h.innerHTML = "<input type=\"hidden\" data-sb-value><div data-sb-collection></div><p class=\"text-danger\" data-sb-error role=\"alert\" hidden></p>", h.querySelector("[data-sb-value]").value = JSON.stringify({
		version: 1,
		items: l ? [{
			selection: l,
			usage: f
		}] : []
	}), c.after(h), n.add(a), t(h);
	let _ = e(h);
	o.addEventListener("change", async () => {
		if (!h.dataset.sbNativeWriting && h.isConnected) try {
			let e = i(o.value);
			await _.setItems(e ? [{
				selection: e,
				usage: Object.fromEntries(Object.entries(u).map(([e, t]) => {
					let n = s.elements.namedItem(d[t]);
					return [e, n.type === "checkbox" ? n.checked : n.value];
				}))
			}] : []);
		} catch {}
	});
}
var o = () => document.querySelectorAll("joomla-field-media").forEach(a);
o();
var s = new MutationObserver(o);
s.observe(document.body, {
	childList: !0,
	subtree: !0
}), window.addEventListener("pagehide", () => s.disconnect(), { once: !0 });
//#endregion
