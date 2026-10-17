# Preview Image Presentation Contract

Status: implemented in SmartBrowser 3.15.0. This is the public contract for image-presentation providers. It is independent of any extension, data namespace or site. Providers enhance **preview images only**, not grid/list visuals or resource decoration.

Since 3.16.0, [field output and the PHP presentation event](field-output.md) provide the server-rendered counterpart. The JS controller skips `data-sb-image-presentation="server"` images, avoiding double application. PHP field output does not require the Picker runtime.

## Responsibilities and Existing APIs

The existing APIs retain their roles:

- `registerVisualOverlay`: interactive controls/badges; use `context.actionsContainer` for buttons.
- `registerPreviewRenderer`: owns the preview composition, frame and decorative pins.
- Selection Usage, `setMetadata`, `setAddress` and registered address codecs: persistence and portable addresses, unchanged.

New in 3.15.0: `registerImagePresentation`, explicit renderer image publication, image lifecycle notifications and provider-owned reset hooks. The host resolves the effective image, including permitted thumbnail overrides, before passing it to providers. It owns the image element and its source. Providers own only their declared presentation styles and their own event listeners. They interpret their own Usage/Address data. SmartBrowser neither understands nor reconstructs those data.

## Register a Provider

```js
const unregister = SmartBrowserPicker.registerImagePresentation({
  id: 'example.monochrome',
  order: 100, // lower first; registration order breaks ties
  styles: ['filter'], // CSS property names, including custom properties
  applies: context => context.getMetadata('example.monochrome') === true,
  apply(image, context) {
    image.style.setProperty('filter', 'grayscale(1)');
    context.notifyPresentationChange({ reason: 'appearance' });
    // Return cleanup for listeners, timers and other provider-owned effects.
    // Declared inline styles are restored automatically after cleanup.
    return () => {};
  },
  hasChanges: context => context.getMetadata('example.monochrome') === true,
  reset: context => context.setMetadata('example.monochrome', null),
});
// unregister(); or SmartBrowserPicker.unregisterImagePresentation('example.monochrome');
```

`id`, `styles` and synchronous `apply(imageElement, context)` are required. `applies`, `order`, `hasChanges` and `reset` are optional. `apply` returns a cleanup function or nothing, never a Promise. Async work started by `apply` must observe `context.signal`; release its listeners/timers in cleanup and never touch the image after cancellation. If synchronous setup can throw after creating listeners, use a local try/catch to remove them before rethrowing.

For metadata-only changes, provide **both** `hasChanges(context)` and `reset(context)`. They run without requiring a mounted image, so check your own resource/data applicability there. `hasChanges` must be synchronous, pure and return a boolean. `reset` may return a Promise and uses the ordinary guarded persistence callbacks. Reset is an explicit user action, not part of presentation application. Failure is reported by the existing UI; it does not authorize clearing another extension's metadata.

## Context

The context extends the existing preview context:

| Field | Meaning |
| --- | --- |
| `resource` | Original, access-filtered resource descriptor. Do not mutate it. |
| `resolvedImage` | Resolved thumbnail resource when overridden; otherwise the original resource. |
| `imageUrl` | Resolved, unmodified source URL chosen by the host. No guessing between metadata fields. |
| `imageElement` | Current primary `HTMLImageElement` for this application. |
| `getImageElement()` | Current primary image, or `null`; returns `null` on an aborted provider/overlay context. |
| `visualElement` | Outer preview surface. Read-only to providers; not a container they may replace/style. |
| `values`, `getValues()` | Current Selection Usage, including registered extension data. Do not mutate returned objects. |
| `getMetadata`, `setMetadata` | Generic, namespaced JSON persistence, with existing limits and validation. |
| `getAddress`, `getDefaultAddress`, `getSelectionAddress`, `setAddress` | Existing field/portable address methods where supplied. No new storage. |
| `isReadOnly`, `fieldElement`, `profile` | Existing selection policy and host context. |
| `signal` | Aborted before cleanup or replacement. |
| `notifyPresentationChange(detail)` | Generic notification that the renderer may need to react. |

`actionsContainer` remains available to overlay/action integrations. Use a separate overlay registration for editing controls; image providers should apply presentation equally in writable and readonly previews. The `imageElement` is **not** a badge/pin image and is never found by a provider's DOM queries.

Readonly allows visual presentation, but metadata/address/value writes and reset remain rejected. Presentation application does not select resources, resolve new references, change permissions or persist data automatically. Unavailable resources and absent primary images receive no provider application. Plugins are trusted JS, not sandboxed; they must honor the ownership rules and cannot use this API to fetch inaccessible images or bypass adapter policy.

## Ownership, Ordering and Failure

Providers may modify **only declared inline CSS properties on the primary image**. Use CSS `setProperty`/`removeProperty`; do not replace the entire `style` attribute. Do not change `src`, `srcset`, `alt`, classes, attributes, DOM identity, container children, badges, frame or pins. This deliberately narrow v1 contract avoids competing DOM owners. New use cases requiring other mutation types need an explicit contract extension, not undocumented DOM edits.

Applicable providers are sorted by ascending `order`. Providers with disjoint style names cooperate. If any style is already claimed by an earlier successful provider, the later provider is skipped entirely. A failing provider restores its declared styles and does not claim them, allowing a later fallback. An empty `styles` array is permitted for listener-only integrations. Use a shared, declared CSS custom property as an exclusive ownership key when multiple providers implement mutually exclusive effects using otherwise different styles. Do not divide individual transform functions between providers: `transform` is a single property.

On update the host aborts and cleans up the previous application in reverse order, restores original inline values/priorities, then applies providers once in order. This cleanup/reapply model deliberately has no separate provider `update` hook: effects cannot accumulate. The existing overlay/renderer `update` hooks remain unchanged.

The host runs presentation after Vue DOM updates, on resolved image/Usage/context changes, registry changes, primary element replacement and image load. There is no provider-side MutationObserver requirement. A new image starts from its own host baseline. Unregistering, loss of applicability, switching to Information, missing image, resource replacement and unmount release old effects. No provider means the ordinary host preview, not a blank surface.

Host/renderers must not bind provider-owned inline styles while the image is leased. SmartBrowser releases presentations before custom renderer updates. For delayed renderer work, call the release function returned by `setImageElement` **before** changing the source or replacing the image, then publish it again. CSS on the renderer's outer wrapper remains wholly renderer-owned. Changes to layout should be requested through notifications, not by a provider modifying that wrapper.

`notifyPresentationChange(detail)` accepts an extension-defined object, not a crop/ratio protocol. Managed custom renderers receive it through their optional `onPresentationChange` callback. The outer visual also dispatches the bubbling `smartbrowser:image-presentation-change` DOM event. Automatic lifecycle notifications have `{ providerId, phase: 'applied' | 'removed' }`. Notifications do not persist data or automatically reload/rebuild the image. The renderer chooses whether to recalculate layout, invalidate a measurement or do nothing. It must not rebuild/re-publish the image on every notification, which would create an application loop.

### Native Aspect-Ratio Reaction (3.15.1)

The built-in SmartBrowser preview re-measures the primary image's computed CSS `aspect-ratio` on every presentation notification (including cleanup/rollback). A valid positive numeric ratio takes precedence over `naturalWidth / naturalHeight` in its image viewport geometry. `auto`, absent or invalid ratios leave the existing natural-image/default fallback unchanged. `auto <ratio>` is treated as an explicit declared ratio for preview geometry. Providers must declare `aspect-ratio` in `styles` to own it; no Usage/Address metadata is interpreted by the host.

This reaction updates only native image layer geometry; it neither republishes the image nor reapplies the provider. Equal measurements are ignored. Cleanup, reset and unregister restore the original CSS value before notification, so the viewport immediately returns to its original ratio. Image replacement discards the previous image's measurement. Attached third-party Joomla wrappers still own their viewport layout and can use the same bubbling notification to implement this reaction.

Custom renderers that need the same behavior should read the **computed CSS**, not crop data, in their `onPresentationChange` handler. Keep the image and publication stable, and update a renderer-owned viewport only when the measurement changes. For example:

```js
let previousRatio;
const release = context.setImageElement(image, {
  onPresentationChange() {
    const value = image.ownerDocument.defaultView.getComputedStyle(image).aspectRatio;
    // Prefer a valid CSS declaration; otherwise clear the viewport override
    // and let the renderer's original natural-size/layout rules take over.
    const match = value.replace(/\bauto\b/g, '').trim().match(/^(\d*\.?\d+)(?:\s*\/\s*(\d*\.?\d+))?$/);
    const ratio = match ? Number(match[1]) / Number(match[2] || 1) : NaN;
    const next = Number.isFinite(ratio) && ratio > 0 ? String(ratio) : '';
    if (next === previousRatio) return;
    previousRatio = next;
    if (next) viewport.style.setProperty('aspect-ratio', next);
    else viewport.style.removeProperty('aspect-ratio');
  },
});
// On teardown: release(), then remove the renderer-owned composition.
```

If the viewport already had an inline `aspect-ratio`, restore that baseline instead of removing it. The provider must not style the viewport itself. No `setImageElement`, `refresh()` or selection write is needed from this notification handler.

## Native Preview

No integration code is required for the native SmartBrowser preview. Its `ResourceVisual` publishes its primary image to the shared presentation component after mounting/patching; grid/list instances do not. Async thumbnail resolution, missing images and native image field changes feed that same lifecycle.

Attached Joomla native preview wrappers use a host-side DOM bridge to detect Joomla-created/replaced images and source changes. This observer belongs to the native adapter, not to providers. Providers still receive the same context and never need to inspect Joomla markup. Native wrapper integrations receive the bubbling presentation-change event when they need to react to layout changes. Existing native field storage and validation are unchanged.

For example, after the monochrome provider above is registered, an existing native Selection View whose Usage contains `ext.example.monochrome: true` automatically presents its image in monochrome. Readonly selections render the effect without an editing button. Turning it off through an overlay's `context.setMetadata('example.monochrome', null)` releases the filter; this does not modify the underlying file.

## Custom Renderer With Frame and Pin

```js
SmartBrowserPicker.registerPreviewRenderer({
  id: 'example.framed-preview',
  applies: context => Boolean(context.visuals.image),
  mount(layer, context) {
    const doc = layer.ownerDocument;
    const frame = doc.createElement('figure');
    frame.className = 'example-preview-frame';
    const viewport = doc.createElement('div');
    viewport.className = 'example-preview-viewport';
    const image = doc.createElement('img');
    image.src = context.visuals.image;
    image.alt = '';
    const pin = doc.createElement('span');
    pin.className = 'example-preview-pin';
    pin.textContent = 'Badge';
    viewport.append(image);
    frame.append(viewport, pin);
    layer.append(frame);

    const release = context.setImageElement(image, {
      onPresentationChange(detail) {
        // Re-measure renderer-owned layout if necessary; preserve this image.
        // No crop-specific fields are required or interpreted here.
      },
    });
    return () => { release(); frame.remove(); };
  },
  // Without update(), the existing renderer API cleans up and remounts.
});
```

`context.setImageElement(image, options?)` publishes exactly one primary image already inside this preview surface. Passing `null` releases it. It returns an idempotent release function scoped to that publication; a stale release cannot clear a newer publication. For an `update` implementation, release before altering source/host-owned styles, update `src` from `context.visuals.image`, then publish again. If there is no primary image, publish `null`. A renderer that does not publish an image still renders normally, but image providers are not applied: SmartBrowser does not scrape custom markup or fall back to a decorative image.

The renderer keeps ownership of viewport clipping, frame and pin positioning. It can establish stable CSS (for example `overflow: hidden` on its viewport) and react to generic notifications. The provider only changes declared properties on `image`. `getImageElement()` and `imageUrl` are also available to overlay integrations; use the existing overlay `update` lifecycle when these change.

## Migration

1. Keep existing overlays/actions for buttons and existing metadata/address codecs for persistence.
2. Move image styling into `registerImagePresentation`; read your own Usage/Address format and return cleanup for owned listeners/tasks. Remove DOM scraping and provider-side MutationObservers.
3. Supply `hasChanges`/`reset` for your metadata. SmartBrowser now resets only its `visual.*` and Address overrides and invokes provider reset hooks; it no longer knows individual extension namespaces. Existing metadata are retained unchanged until the owning provider migrates.
4. Custom renderers publish their own primary image with `setImageElement`. Remove direct calls to concrete extensions and do not interpret their metadata.
5. Remove dependencies on SmartBrowser's legacy crop-specific classes/CSS variables from preview integrations. The new image-presentation contract does not expose them.

The direct optional PHP extension-helper invocation has been removed. Existing generic `imageCrop` descriptors/rendering outside this preview mechanism remain legacy resource-decoration behavior; no new grid/list presentation API is introduced here. Extensions that depended on the removed helper must adapt separately. Until adapted, their stored selections/addresses are preserved, but their extension-specific visual effects/reset integration are not automatically interpreted by SmartBrowser. This is an explicit migration boundary, not a silent metadata conversion. No other extensions are modified by this change.
