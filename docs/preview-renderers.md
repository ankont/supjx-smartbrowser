# Preview Renderers

SmartVisuals plugins can replace the content of the managed preview surface without replacing its outer frame, toolbar, selection state, overlays or storage. The Information tab keeps its resource visual composition. Attached native Joomla image-field DOM remains owned by its existing integration; renderers do not hijack that native wrapper.

## Loading Assets

The PHP event `onSmartVisualsPreparePreviews` is dispatched once per document by Browser and Collection View preparation, in both frontend and administrator clients. It belongs to the existing `smartvisuals` plugin group and receives:

- `document`: the host Joomla document; register/use the plugin's preview JS and scoped CSS through its WebAssetManager.
- `context`: `{ application: 'site' | 'administrator' }`.

Declare `com_smartbrowser.picker` as a dependency of the renderer script. Register assets in this event, not in the resource-decoration event (which also runs in JSON API requests). Load scoped preview styles/icon fonts in every host document, including Picker iframes; do not assume the frontend template stylesheet is loaded in administrator. SmartBrowser does not inject arbitrary HTML/CSS supplied in resource data.

## JavaScript Contract

```js
const unregister = SmartBrowserPicker.registerPreviewRenderer({
  id: 'catichisi.identity',
  order: 100,
  applies: context => ['category', 'tag', 'menu-item'].includes(context.resource.type),
  mount(element, context) {
    const image = element.ownerDocument.createElement('img');
    element.append(image);
    image.src = context.visuals.image;
    return () => image.remove();
  },
  update(element, context) {
    element.querySelector('img').src = context.visuals.image;
  },
});
```

The example demonstrates ownership only; site plugins should reuse their site identity resolver/rendering code, handle missing images and render their desired badge composition. Use `element.ownerDocument`, not a captured parent document: the same renderer can run inside the Picker iframe.

To enable generic image-presentation providers, publish the primary image with `context.setImageElement(image, { onPresentationChange(detail) {} })` after appending it. Return cleanup that calls the returned release function before removing the image. Never invoke a specific image extension from a renderer. See the complete [Image Presentation contract and frame/pin example](image-presentation.md). Old renderers continue to render without publication, but receive no image-presentation effects; there is no markup scraping fallback.

- Namespaced IDs must be unique. Lower `order` runs first (default 100); the first applicable successful renderer owns the content.
- `mount(element, context)` is synchronous and may return cleanup. Async work should observe `context.signal` before touching DOM or using callbacks.
- `update(element, context)` runs for changed resource data, usage, address or effective visuals without an identity change. Without `update`, the renderer is cleaned up and remounted.
- Optional `unmount(element, context)` runs in addition to returned cleanup. Listeners/timers/framework instances must be released. Signal abortion precedes cleanup; stale write callbacks are rejected.
- Resource identity/surface changes, unregistering, loss of applicability and component teardown clean up the renderer.
- Mount/update failures are reported to the console, cleaned up, and fall through to another renderer or the generic preview. Errors in an async task must be handled by the plugin itself.
- Registration after mount is supported. `unregisterPreviewRenderer(id)` and the returned cleanup unregister it. Picker contexts share the caller's live registry/subscription.

## Context

The context extends the existing preview-action/overlay context: `resource`, `values` (effective Selection Use Data), `isReadOnly`, `fieldElement`, metadata/address read/write callbacks, `refresh`, and `signal`. Existing permission, readonly and current-resource guards apply unchanged. Rendering/inspection is permitted in readonly mode; writes are not. Mutating resource objects directly is not a persistence API.

`purpose` is `preview`. `visuals` contains the resolved effective `image`, identity `icon`, configured `typeIcon`, `badgeIcon`, `imageCrop` and `presentation` (`null` for Default, `thumbnail`, `icon` or `both`). Thumbnail and icon overrides are already represented there. Icon mode suppresses `image`; thumbnail mode suppresses the identity icon when an image exists. A renderer should honor these rather than rediscover native fields or scrape the site's DOM. The renderer owns the composition (for example, a site-specific bottom-right pin), not the choice of selection overrides. `getSelectionAddress()` remains available where provided by the selection host; the field-specific `getAddress()`/`setAddress()` semantics are unchanged.

`visuals.imageCrop` is legacy descriptor data, not part of the new image-presentation API. Migrated renderers leave extension-specific presentation to registered providers and do not interpret it themselves. The new contract does not change grid/list decoration.

## Generic Fallback

The fallback reuses the selection grid's `ResourceVisual`, effective resource and configured visual settings, without a separate preview composition. Default preserves all SmartBrowser composition rules. Explicit presentation modes select image/icon content; Both reuses the configured badge position (bottom-right when not configured), rather than imposing bottom-left. The Information tab also retains the grid composition. Existing native image field behavior and storage are unchanged.

Callers continue to control which usage properties are editable through Selection Profiles. Sites that require a fixed image-and-pin identity can omit `visual.presentation` from the editable profile while allowing thumbnail/crop overrides. Consumers such as Sources must apply the stored usage data in their frontend rendering; preview renderers do not change consumer templates or article data.
