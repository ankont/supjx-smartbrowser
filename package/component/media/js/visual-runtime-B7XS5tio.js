import { t as e } from "./visual-runtime-CEVDGWRG.js?v=4.0.0";
//#region resources/js/adapters/MediaActionDriver.js
var t = (e) => {
	if (!e.metadata?.url) return null;
	let t = (e.metadata.mimeType || "").toLowerCase();
	return t.startsWith("image/") ? "image" : /^video\/(mp4|webm|ogg)$/.test(t) ? "video" : /^audio\/(mpeg|mp4|ogg|wav|webm)$/.test(t) ? "audio" : t === "application/pdf" ? "pdf" : null;
}, n = class {
	constructor(e, t, n, r, i = "modal", a = "administrator") {
		this.api = e, this.state = t, this.reload = n, this.translate = r, this.editorMode = i, this.application = a, this.dialogs = /* @__PURE__ */ new Set(), this.dialogCleanups = /* @__PURE__ */ new Map();
	}
	destroy() {
		this.destroyed = !0;
		for (let e of this.dialogs) this.dialogCleanups.get(e)?.(), e.remove();
		this.dialogs.clear(), this.dialogCleanups.clear();
	}
	ownDialog(e, t = () => {}) {
		if (this.destroyed) {
			t(), e.remove();
			return;
		}
		this.dialogs.add(e), this.dialogCleanups.set(e, t), e.addEventListener("close", () => {
			t(), this.dialogs.delete(e), this.dialogCleanups.delete(e);
		}, { once: !0 }), document.body.appendChild(e);
	}
	available(e, t) {
		return this.destroyed || e.selectionScoped && (!this.selectionHost || e.currentNode && !(this.selectionHost.canCreate ? this.selectionHost.canCreate(e.resourceType || "uri") : this.selectionHost.canAdd(this.api.options.adapter, e.resourceType || "uri"))) || e.currentNode && this.state.currentResource?.capabilities?.[e.id] === !1 || e.requiresSelection && t.length === 0 || e.single && t.length !== 1 || e.itemsOnly && t.some((e) => e.kind !== "item") || e.nodesOnly && t.some((e) => e.kind !== "node") ? !1 : e.exclusiveGroup && t.length ? t.some((t) => t.capabilities?.[e.id] === !0) : e.requiresSelection && t.length ? t.every((t) => t.capabilities?.[e.id] === !0) : !0;
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
			let t = await this.actionDialog({
				title: "COM_SMARTBROWSER_NEW_FOLDER_NAME",
				value: ""
			});
			t && await this.mutate(e.id, [], {
				nodeId: this.state.selectedNode,
				name: t
			});
			return;
		}
		if (e.currentNode) {
			let t = await this.api.execute(e.id, [], { nodeId: this.state.selectedNode });
			if (t?.command === "selectionEditor") return this.selectionEditor(t, null);
			t?.command === "openEditor" ? this.openEditor(t.url) : await this.reload();
			return;
		}
		if (e.id === "rename") {
			let n = await this.actionDialog({
				title: "COM_SMARTBROWSER_RENAME_TO",
				value: t[0].title
			});
			n && n !== t[0].title && await this.mutate(e.id, r, { name: n });
			return;
		}
		if (e.id === "delete") {
			(e.confirm === !1 || await this.actionDialog({
				title: "COM_SMARTBROWSER_DELETE",
				message: this.translate("COM_SMARTBROWSER_CONFIRM_DELETE"),
				accept: "COM_SMARTBROWSER_DELETE",
				destructive: !0
			})) && (e.localState ? this.selectionHost.remove(n) : await this.mutate(e.id, r));
			return;
		}
		if (e.id === "removeFromGroup") {
			let t = Object.fromEntries(n.map((e) => [e.id, e.metadata?.sourceGroupId]));
			if (r.some((e) => !t[e])) return;
			await this.actionDialog({
				title: "COM_SMARTBROWSER_REMOVE_FROM_GROUP",
				message: this.translate("COM_SMARTBROWSER_CONFIRM_REMOVE_FROM_GROUP"),
				accept: "COM_SMARTBROWSER_REMOVE_FROM_GROUP"
			}) && await this.mutate(e.id, r, { groups: t });
			return;
		}
		let i = await this.api.execute(e.id, r);
		if (i?.command === "selectionEditor") return this.selectionEditor(i, n[0]);
		if (i?.command === "previewUrl") {
			this.previewUrl(i.url, i.title);
			return;
		}
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
		e.id === "preview" && this.preview(i), e.id === "edit" && i?.metadata?.mimeType && this.editMedia(i), e.id === "share" && this.share(i), e.id === "download" && this.download(i), (i?.updated || i?.deleted) && await this.reload();
	}
	actionDialog({ title: e, message: t, value: n, accept: r = "JTOOLBAR_SAVE", destructive: i = !1 }) {
		if (this.destroyed) return Promise.resolve(null);
		let a = (e) => {
			let t = document.createElement("textarea");
			return t.innerHTML = e, t.value;
		}, o = document.createElement("dialog");
		o.className = "smartbrowser-editor smartbrowser-local-editor";
		let s = document.createElement("form"), c = document.createElement("h3");
		c.textContent = a(this.translate(e)), s.append(c);
		let l;
		if (n !== void 0) {
			let e = document.createElement("label");
			e.textContent = a(this.translate("COM_SMARTBROWSER_NAME")), l = document.createElement("input"), l.type = "text", l.className = "form-control", l.value = n, l.required = !0, e.append(l), s.append(e);
		} else {
			let e = document.createElement("p");
			e.textContent = a(t || ""), s.append(e);
		}
		let u = document.createElement("div");
		u.className = "smartbrowser-local-editor-actions";
		let d = document.createElement("button");
		d.type = "submit", d.className = i ? "btn btn-danger" : "btn btn-primary", d.textContent = a(this.translate(r));
		let f = document.createElement("button");
		return f.type = "button", f.className = "btn btn-danger", f.textContent = a(this.translate("JCANCEL")), u.append(d, f), s.append(u), o.append(s), f.addEventListener("click", () => o.close()), window.SmartBrowserDialogDismiss?.install(o, () => l ? l.value !== n : !1), new Promise((e) => {
			this.ownDialog(o, () => {
				o.remove(), e(null);
			}), s.addEventListener("submit", (t) => {
				t.preventDefault(), s.reportValidity() && !this.destroyed && (e(!l || l.value), o.close());
			}), o.showModal(), l ? (l.focus(), l.select()) : f.focus();
		});
	}
	async selectionEditor(e, t) {
		if (!this.selectionHost || this.destroyed) return;
		let n = document.createElement("dialog");
		n.className = "smartbrowser-editor smartbrowser-local-editor";
		let r = document.createElement("form"), i = (e) => {
			let t = document.createElement("textarea");
			return t.innerHTML = this.translate(e), t.value;
		}, a = document.createElement("h3");
		a.textContent = i(e.label), r.append(a);
		let o = /* @__PURE__ */ new Map();
		for (let t of e.fields || []) {
			if (t.type === "hidden") {
				let e = document.createElement("input");
				e.type = "hidden", e.value = t.contextValue ? this.selectionHost.editorContext?.[t.contextValue] || t.value || "" : t.value || "", o.set(t.name, e), r.append(e);
				continue;
			}
			if (t.type === "segmented") {
				let e = document.createElement("fieldset");
				e.className = "smartbrowser-local-editor-modes";
				let n = document.createElement("legend");
				n.textContent = i(t.label), e.append(n);
				let a = document.createElement("input");
				a.type = "hidden", a.value = t.value || "", e.append(a), o.set(t.name, a);
				let s = document.createElement("div");
				s.className = "btn-group", e.append(s);
				for (let e of t.options || []) {
					let t = document.createElement("button");
					t.type = "button", t.className = "btn btn-outline-primary", t.textContent = i(e.label), t.dataset.value = e.value, t.setAttribute("aria-pressed", String(e.value === a.value)), t.addEventListener("click", () => {
						a.value = e.value;
						for (let e of s.children) e.setAttribute("aria-pressed", String(e.dataset.value === a.value));
						a.dispatchEvent(new Event("input", { bubbles: !0 }));
					}), s.append(t);
				}
				r.append(e);
				continue;
			}
			let e = document.createElement("label");
			e.textContent = i(t.label);
			let n = document.createElement(t.type === "select" ? "select" : "input");
			if (n.className = "form-control", t.type === "select") for (let e of t.options || []) {
				let t = document.createElement("option");
				t.value = e.value, t.textContent = i(e.label), n.append(t);
			}
			else n.type = "text";
			if (n.value = t.value || "", n.required = t.required === !0, n.maxLength = t.maxlength || 2048, e.append(n), r.append(e), o.set(t.name, n), t.placeholder && (n.placeholder = t.placeholder), t.hint) {
				let n = document.createElement("small");
				n.className = "text-muted", n.textContent = i(t.hint), e.append(n);
			}
			if (t.warningPattern) {
				let r = document.createElement("p");
				r.className = "alert alert-warning", r.textContent = i("COM_SMARTBROWSER_LINK_WEB_WARNING");
				let a = () => {
					r.hidden = !n.value || !new RegExp(t.warningPattern, "i").test(n.value);
				};
				n.addEventListener("input", a), a(), e.append(r);
			}
		}
		for (let t of e.fields || []) {
			if (t.placeholderFrom && !t.computedPlaceholder) {
				let e = o.get(t.placeholderFrom);
				e?.addEventListener("input", () => {
					o.get(t.name).placeholder = e.value;
				});
			}
			if (t.type === "select" && t.dependsOn) {
				let e = o.get(t.name), n = () => {
					let n = e.value;
					e.replaceChildren();
					for (let n of t.options || []) {
						if (n.parent !== o.get(t.dependsOn)?.value) continue;
						let r = document.createElement("option");
						r.value = n.value, r.textContent = i(n.label), e.append(r);
					}
					[...e.options].some((e) => e.value === n) && (e.value = n);
				};
				n(), o.get(t.dependsOn)?.addEventListener("change", n);
			}
			if (!t.suggestions) continue;
			let e = document.createElement("datalist");
			e.id = `smartbrowser-suggestions-${Math.random().toString(36).slice(2)}`, o.get(t.name).setAttribute("list", e.id), r.append(e);
			let n = () => {
				let n = typeof t.suggestions == "string" ? this.selectionHost.editorContext?.suggestions?.[t.suggestions] : t.suggestionsBy ? t.suggestions[o.get(t.suggestionsBy)?.value] : t.suggestions;
				e.replaceChildren();
				for (let t of Array.isArray(n) ? n.slice(0, 500) : []) {
					let n = document.createElement("option");
					n.value = typeof t == "string" ? t : t.value, typeof t == "object" && t.label && (n.label = t.label), e.append(n);
				}
			};
			n(), t.suggestionsBy && o.get(t.suggestionsBy)?.addEventListener("input", n);
		}
		let s = document.createElement("p");
		s.className = "text-danger", s.setAttribute("role", "alert"), r.append(s);
		let c = document.createElement("div");
		c.className = "smartbrowser-local-editor-actions";
		let l = document.createElement("button");
		l.type = "submit", l.className = "btn btn-primary", l.textContent = i("JTOOLBAR_SAVE");
		let u = document.createElement("button");
		u.type = "button", u.className = "btn btn-danger", u.textContent = i("JCANCEL"), c.append(l, u), r.append(c), n.append(r), u.addEventListener("click", () => n.close());
		let d = new Map([...o].map(([e, t]) => [e, t.value]));
		window.SmartBrowserDialogDismiss?.install(n, () => [...o].some(([e, t]) => t.value !== d.get(e)));
		let f, p = 0, m = e.fields?.find((e) => e.computedPlaceholder), h = () => {
			clearTimeout(f);
			let t = ++p;
			m && !o.get(m.name).value && (o.get(m.name).placeholder = "", f = setTimeout(async () => {
				if (!this.destroyed && n.isConnected) try {
					let r = {
						nodeId: e.nodeId,
						...Object.fromEntries([...o].map(([e, t]) => [e, t.value])),
						[m.name]: ""
					}, i = await this.api.execute(e.action, [], r);
					t === p && n.isConnected && !this.destroyed && (o.get(m.name).placeholder = i.resource.title);
				} catch {}
			}, 300));
		};
		return m && r.addEventListener("input", h), new Promise((i) => {
			this.ownDialog(n, () => {
				clearTimeout(f), p++, n.remove(), i();
			}), r.addEventListener("submit", async (i) => {
				if (i.preventDefault(), r.reportValidity()) {
					l.disabled = !0, s.textContent = "";
					try {
						let r = {
							nodeId: e.nodeId,
							...Object.fromEntries([...o].map(([e, t]) => [e, t.value]))
						}, i = await this.api.execute(e.action, [], r);
						if (this.destroyed) return;
						let a = this.selectionHost.replace({
							...i.resource,
							adapter: this.api.options.adapter.replace(/^flat-/, "")
						}, t);
						n.close(), await this.reload(), this.state.focusedId = a.selectionKey || a.id;
					} catch (e) {
						s.textContent = this.translate(e.message);
					} finally {
						l.disabled = !1;
					}
				}
			}), n.showModal(), [...o.values()].find((e) => e.type !== "hidden")?.focus(), h();
		});
	}
	canPreview(e) {
		return !e?.metadata?.mimeType || !!t(e);
	}
	openEditor(t) {
		if (this.destroyed) return;
		if (this.editorMode === "page") {
			let e = new URL(t, window.location.href);
			this.application === "site" ? (window.sessionStorage.setItem("supjx.smartbrowser.editorReturn", window.location.href), e.searchParams.set("sbpage", "1"), e.searchParams.delete("tmpl")) : (e.searchParams.get("option") === "com_smartbrowser" && e.searchParams.get("view") === "editor" ? (e.searchParams.set("sbpage", "1"), e.searchParams.set("sbReturn", window.btoa(window.location.href))) : e.searchParams.has("view") && !e.searchParams.has("task") ? e.searchParams.set("layout", "edit") : e.searchParams.delete("layout"), e.searchParams.delete("tmpl"), e.searchParams.set("return", window.btoa(window.location.href))), window.location.assign(e.toString());
			return;
		}
		let n = document.createElement("dialog");
		n.className = "smartbrowser-editor", n.innerHTML = `<iframe src="${this.escape(t)}" title="Editor"></iframe><div class="smartbrowser-editor-loading" role="status"><span class="spinner-border" aria-hidden="true"></span><span>${this.escape(this.translate("COM_SMARTBROWSER_WORKING"))}</span></div><button type="button" class="btn-close" aria-label="Close"></button>`;
		let r = e(n, null, this.translate), i = n.querySelector("iframe"), a = n.querySelector(".smartbrowser-editor-loading"), o = !1, s = !1;
		i.addEventListener("load", () => {
			a.hidden = !0, r.bind(null);
			try {
				let e = i.contentDocument?.querySelector(".smartbrowser-editor-actions, #toolbar");
				if (e) {
					let t = e.querySelector(".smartbrowser-editor-tools"), n = t?.querySelector(".smartbrowser-editor-native");
					if (n) {
						let e = new URL(n.href, window.location.href);
						e.searchParams.set("sbReturn", window.btoa(window.location.href)), e.searchParams.set("return", window.btoa(window.location.href)), n.href = e.toString();
					}
					let a = i.contentDocument.createElement("button");
					a.type = "button", a.className = `btn btn-outline-secondary ${t ? "" : "ms-auto "}smartbrowser-editor-size`, a.innerHTML = "<span class=\"fas fa-expand\" aria-hidden=\"true\"></span>", (t || e).append(a), r.bind(a);
				}
			} catch {}
			try {
				i.contentWindow.addEventListener("beforeunload", () => {
					a.hidden = !1;
				}, { once: !0 });
			} catch {}
			if (s = !1, window.SmartBrowserDialogDismiss.watchFrame(i, () => {
				s = !0;
			}), !o) {
				o = !0;
				return;
			}
			try {
				let e = new URL(i.contentWindow.location.href);
				if (e.searchParams.get("option") === "com_users" && e.searchParams.get("view") === "login" || i.contentDocument?.querySelector("form#login-form, .com-users-login")) {
					window.top.location.assign(e.toString());
					return;
				}
				let t = e.searchParams.get("task") || "", r = e.searchParams.get("layout") || "", a = /\.(?:edit|add)$/.test(t) || r === "edit" || r === "modal", o = !!i.contentDocument?.querySelector("form#adminForm, form#item-form");
				(!a || !o) && n.close();
			} catch {}
		}), n.querySelector(".btn-close").addEventListener("click", () => n.close()), window.SmartBrowserDialogDismiss.install(n, () => s), n.addEventListener("close", async () => {
			r.destroy(), n.remove(), this.destroyed || await this.reload();
		}), this.ownDialog(n, () => r.destroy()), n.showModal();
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
					if (!await this.actionDialog({
						title: "COM_SMARTBROWSER_ACTION_UPLOAD",
						message: t,
						accept: "JYES",
						destructive: !0
					})) continue;
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
	previewMedia(e) {
		let n = e.metadata?.url, r = t(e);
		return r === "image" ? `<img data-preview-media src="${this.escapeAttribute(n)}" alt="${this.escapeAttribute(e.title)}">` : r === "video" ? `<video data-preview-media src="${this.escapeAttribute(n)}" controls preload="metadata"></video>` : r === "audio" ? `<audio data-preview-media src="${this.escapeAttribute(n)}" controls preload="metadata"></audio>` : r === "pdf" ? `<iframe data-preview-media src="${this.escapeAttribute(n)}" title="${this.escapeAttribute(e.title)}"></iframe>` : `<div class="smartbrowser-preview-unavailable"><span class="${this.escapeAttribute(e.icon || "fas fa-file")}" aria-hidden="true"></span><span>${this.escape(this.translate("COM_SMARTBROWSER_PREVIEW_UNAVAILABLE"))}</span></div>`;
	}
	previewUrl(e, t) {
		let n = document.createElement("dialog");
		n.className = "smartbrowser-preview smartbrowser-content-preview", n.setAttribute("aria-label", t || this.translate("COM_SMARTBROWSER_ACTION_PREVIEW")), n.innerHTML = `<button type="button" class="btn-close" aria-label="${this.escapeAttribute(this.translate("JCLOSE"))}"></button><div class="smartbrowser-preview-media"><iframe src="${this.escapeAttribute(e)}" title="${this.escapeAttribute(t || "")}"></iframe></div>`, this.showContentPreview(n);
	}
	preview(e) {
		let t = document.createElement("dialog");
		t.className = "smartbrowser-preview smartbrowser-content-preview", t.setAttribute("aria-label", e.title), t.innerHTML = `<button type="button" class="btn-close" aria-label="${this.escapeAttribute(this.translate("JCLOSE"))}"></button><div class="smartbrowser-preview-media">${this.previewMedia(e)}</div>`, this.showContentPreview(t);
	}
	showContentPreview(e) {
		this.destroyed || (e.querySelector(".btn-close").addEventListener("click", () => e.close()), window.SmartBrowserDialogDismiss.install(e), e.addEventListener("close", () => e.remove()), this.ownDialog(e), e.showModal());
	}
	editMedia(t) {
		let n = t, [r, i] = this.splitFilename(t.title), a = document.createElement("dialog");
		a.className = "smartbrowser-preview";
		let o = this.previewMedia(t);
		a.innerHTML = `<form class="smartbrowser-preview-form com-smartbrowser-editor" method="dialog">
      <div class="smartbrowser-preview-actions">
        <button type="button" class="btn btn-primary" data-action="save" ${t.capabilities?.rename ? "" : "disabled"}><span class="fas fa-save" aria-hidden="true"></span> ${this.escapeTranslated("JSAVE")}</button>
        <button type="button" class="btn btn-outline-primary" data-action="apply" ${t.capabilities?.rename ? "" : "disabled"}><span class="fas fa-check" aria-hidden="true"></span> ${this.escapeTranslated("JAPPLY")}</button>
        <button type="button" class="btn btn-outline-primary" data-action="copy" ${t.capabilities?.copy ? "" : "disabled"}><span class="fas fa-copy" aria-hidden="true"></span> ${this.escapeTranslated("JSAVEASCOPY")}</button>
        <button type="button" class="btn btn-danger" data-action="cancel"><span class="fas fa-times" aria-hidden="true"></span> ${this.escape(this.translate("COM_SMARTBROWSER_CANCEL"))}</button>
        <button type="button" class="btn btn-outline-secondary smartbrowser-preview-download" data-action="download"><span class="fas fa-download" aria-hidden="true"></span> ${this.escape(this.translate("COM_SMARTBROWSER_ACTION_DOWNLOAD"))}</button>
        <button type="button" class="btn btn-outline-secondary ms-auto smartbrowser-editor-size"><span class="fas fa-expand" aria-hidden="true"></span></button>
      </div>
      <div class="smartbrowser-preview-card">
        <div class="smartbrowser-preview-tabs" role="tablist">
          <button type="button" role="tab" data-tab="content" aria-selected="true" aria-controls="smartbrowser-preview-content">${this.escape(this.translate("COM_SMARTBROWSER_CONTENT_TAB"))}</button>
          <button type="button" role="tab" data-tab="metadata" aria-selected="false" aria-controls="smartbrowser-preview-metadata">${this.escape(this.translate("COM_SMARTBROWSER_METADATA_TAB"))}</button>
        </div>
        <section id="smartbrowser-preview-content" class="smartbrowser-preview-tab smartbrowser-editor-tab" role="tabpanel">
          <div class="smartbrowser-preview-name-fields smartbrowser-editor-title-alias">
            <div class="control-group"><div class="control-label"><label for="smartbrowser-preview-name">${this.escape(this.translate("COM_SMARTBROWSER_FILE_NAME"))}</label></div>
              <div class="controls"><input id="smartbrowser-preview-name" class="form-control" name="name" required value="${this.escapeAttribute(r)}" ${t.capabilities?.rename || t.capabilities?.copy ? "" : "readonly"}></div></div>
            <div class="control-group"><div class="control-label"><label for="smartbrowser-preview-extension">${this.escape(this.translate("COM_SMARTBROWSER_EXTENSION"))}</label></div>
              <div class="controls"><input id="smartbrowser-preview-extension" class="form-control" name="extension" value="${this.escapeAttribute(i)}" ${t.capabilities?.rename || t.capabilities?.copy ? "" : "readonly"}></div></div>
          </div>
          <div class="smartbrowser-preview-media">${o}</div>
        </section>
        <section id="smartbrowser-preview-metadata" class="smartbrowser-preview-tab" role="tabpanel" hidden>
          <dl class="smartbrowser-preview-metadata">
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_FILE_TYPE"))}</dt><dd>${this.escape(this.translate({
			image: "COM_SMARTBROWSER_MEDIA_IMAGE",
			document: "COM_SMARTBROWSER_MEDIA_DOCUMENT",
			video: "COM_SMARTBROWSER_MEDIA_VIDEO",
			audio: "COM_SMARTBROWSER_MEDIA_AUDIO"
		}[t.type] || "COM_SMARTBROWSER_RESOURCE"))}</dd></div>
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_MIME_TYPE"))}</dt><dd>${this.escape(t.metadata?.mimeType || "")}</dd></div>
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_EXTENSION"))}</dt><dd>${this.escape(t.metadata?.extension || "")}</dd></div>
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_SIZE"))}</dt><dd>${this.escape(this.formatPreviewSize(t.metadata?.size))}</dd></div>
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_DIMENSIONS"))}</dt><dd>${t.metadata?.width && t.metadata?.height ? `${Number(t.metadata.width)} × ${Number(t.metadata.height)} px` : ""}</dd></div>
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_DATE_CREATED"))}</dt><dd>${this.escape(this.formatPreviewDate(t.metadata?.created))}</dd></div>
            <div><dt>${this.escape(this.translate("COM_SMARTBROWSER_DATE_MODIFIED"))}</dt><dd>${this.escape(this.formatPreviewDate(t.metadata?.modified))}</dd></div>
          </dl>
        </section>
      </div></form>`;
		let s = e(a, a.querySelector(".smartbrowser-editor-size"), this.translate);
		a.querySelector("form").addEventListener("submit", (e) => e.preventDefault()), a.querySelectorAll("[data-tab]").forEach((e) => e.addEventListener("click", () => {
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
		}), a.addEventListener("close", () => {
			s.destroy(), a.remove();
		}), this.ownDialog(a, () => s.destroy()), a.showModal();
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
};
//#endregion
export { n as t };
