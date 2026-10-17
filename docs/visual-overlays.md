# Visual Overlay Extensions

Load the integration after the SmartBrowser Picker script. Registration may happen before or after a preview is mounted; open Pickers and external selection controls subscribe to registry changes.

```js
const buttons = new WeakMap();
const unregister = SmartBrowserPicker.registerVisualOverlay({
  id: 'smartcrop.framing',
  order: 100,
  applies: ({ resource }) => resource?.type === 'image',
  mount(layer, context) {
    const button = layer.ownerDocument.createElement('button');
    button.type = 'button';
    const update = () => {
      button.textContent = context.getMetadata('smartcrop.crop')?.ratio || 'Crop';
      button.disabled = context.isReadOnly;
    };
    update();
    button.addEventListener('click', event => {
      event.stopPropagation();
      // Open the extension's own editor here. Its result can be applied with:
      // context.setMetadata('smartcrop.crop', result.crop);
      // context.setAddress(result.address);
    });
    (context.actionsContainer || layer).append(button);
    buttons.set(layer, button);
    return () => { button.remove(); buttons.delete(layer); };
  },
  update(layer, context) {
    const button = buttons.get(layer);
    button.textContent = context.getMetadata('smartcrop.crop')?.ratio || 'Crop';
    button.disabled = context.isReadOnly;
  },
});
// unregister(); or SmartBrowserPicker.unregisterVisualOverlay('smartcrop.framing');
```

## Lifecycle

`mount(layer, context)` receives a plugin-owned, full-surface layer inside `.resource-visual-overlay-layer`. Add only plugin-owned nodes there. Native Joomla image previews use the same layer contract without replacing the native preview or its handlers. The layer is the mount target, not the image element.

`update(layer, context)` runs when resource presentation, usage, address or readonly status changes. Context remains live while that overlay is mounted. Resource identity changes, surface replacement, registry removal or failed applicability destroy the mount. SmartBrowser aborts `context.signal`, calls the returned cleanup and optional `unmount(layer, context)`, and removes the layer. Plugins should clean up listeners, timers and their own dialogs. Exceptions in one plugin do not prevent other overlays from mounting.

## Context

- `resource`: current adapter resource descriptor, unchanged by extension metadata.
- `isReadOnly`: true for readonly/hidden Selection Use Data or a read-only browser. Overlays still mount, but write callbacks reject writes. Enable editable Selection Use Data for a crop editor; a readonly overlay can inspect or display existing crop data.
- `fieldElement`: surrounding `.sb-selection-field`, or null in the Picker/browser.
- `actionsContainer`: the shared `.resource-lightweight-preview-action` DOM element on managed lightweight visuals. Append action buttons here, rather than to `layer`, after the host's reset and thumbnail controls on the left. The preview eye is separate on the right. It exists even without an eye button. Other surfaces, including attached native Joomla previews, may omit it; feature-detect before use. Buttons inherit the host's 26px height, spacing, borders, colors and hover treatment. Text labels use variable width; use `resource-lightweight-icon-action` for square icon-only buttons and `selected` for active overlays. Do not apply absolute positioning or custom geometry to buttons in this slot. Supply an accessible name and `type="button"`.
- `hasPreviewChanges()` / `resetPreview()`: detect/reset the host's visual and address overrides and delegate extension-specific detection/reset to registered image-presentation providers. The host does not interpret extension namespaces. See [Image Presentation](image-presentation.md).
- `visualElement`, `imageUrl`, `resolvedImage`, `getImageElement()`: explicit primary-image access on managed previews. Use the [image-presentation provider API](image-presentation.md) for styles and cleanup, not DOM searches or crop-specific host CSS. Custom renderers must publish their primary image for this accessor to return it.
- `getMetadata(namespace?)`: isolated JSON data from extension storage; omit the namespace to read the extension dictionary. `smartcrop.crop` maps to `ext.smartcrop.crop`; explicitly prefixed keys are also accepted.
- `setMetadata(namespace, data)`: persist JSON-compatible data through existing Selection Use Data and field change events. Rejects stale, readonly, cyclic, non-finite, excessively deep or oversized data.
- `getAddress()`: current displayed/native address, saved extension address, or the adapter's selection URI.
- `getSelectionAddress()`: complete portable Selection Address for display/copy. `getAddress()` remains field-specific/native for existing extensions.
- `setAddress(uri)`: persist `ext.address`, update the displayed address and emit existing selection change events. Native image integrations also write the native Joomla image field and refresh its preview. This is not a URI resolver and does not replace the resource identity. Generic custom fields retain the URI override as usage data for consumers to interpret.
- `refresh()`: existing presentation refresh, not a separate resource mechanism.
- Existing preview context fields such as `profile`, `values`, `getValues`, `setValue` and `selectResource` remain available.

Callbacks retained after unmount must not be used; overlay write/refresh callbacks reject after abort. Async consumers should also observe `signal` before applying a result.

The actions container is shared: remove only your own buttons in the returned cleanup or `unmount`, never clear the container or remove the native eye/other extensions' actions. Keep references to your buttons because they are outside the plugin's overlay layer. Replacing the actions container remounts the overlay so cleanup can release old buttons and mount into the new slot.

## Persistence

The version-1 item schema remains `{ selection, usage }`. Reserved `ext.*` properties are preserved through JS selection validation, collection refresh, Picker results, PHP field encode/decode and capability validation. Ordinary unknown properties remain rejected. The existing maximum of 100 usage properties and 64 KB per item still applies; extension data is JSON, never trusted HTML, capabilities or adapter metadata. Native image fields persist their URI and native usage properties; they do not gain a new database column for arbitrary extension data. Plugins needing additional durable metadata on native images must use their own storage or an existing custom selection field.

No `smartcrop.*` exemption or arbitrary namespace exemption is introduced. Existing stored extension usage can be migrated by its owner to `ext.smartcrop.*`.

Portable address export of structured extension metadata requires a codec. Register it through `SmartBrowser.SelectionAddress.registerCodec()` and bind it through `registerProperty({ key: 'ext.plugin.property', type: 'object', address: { name: 'portableName', codec: 'plugin.codec', alias: 'p' } })`. The codec supplies reversible textual component pairs; it must not depend on DOM scraping or introduce a second storage format. The built-in `joomlaImage` codec already preserves native image query metadata such as crop, ratio, zoom and unfamiliar extension parameters. See the [authoritative contract](selection-address-contract.md) for the public API.

## Readonly Preview Actions

Existing `registerPreviewAction()` definitions remain editable-only by default. Non-mutating inspection actions may set `allowReadOnly: true`. Their context still blocks writes in readonly mode. Overlay definitions do not require that flag: they always receive readonly state and decide how to present their controls.

## Expansion

Add `.is-expanded-overlay` to a plugin-owned node while a reveal is open, then remove it on close. SmartBrowser preview and selection ancestors elevate their stacking context and permit overflow only while that marker exists. Position badge/reveal content with plugin CSS; do not overwrite the normal resource visual's image/icon layers or their z-index settings. An iframe boundary, dialog top layer or an unrelated template ancestor may still constrain expansion; use a plugin-owned popover/dialog when expansion beyond those boundaries is required.
