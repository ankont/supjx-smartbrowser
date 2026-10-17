# Selected Resources Controls

Frontend field output uses the separate [Joomla layout and PHP presentation pipeline](field-output.md), not this editor Collection View.

Site-specific managed previews can be supplied through the [preview renderer contract](preview-renderers.md). The default preview uses an image or the configured type icon as its base, and the site-specific icon as a corner badge. Renderers replace only preview content, not selection actions, Information visuals or native Joomla field integration.

Category previews use the native category image; tag previews prefer Intro Image and fall back to Full Image. Menu items supply their Link Image and Link Icon. These are ordinary adapter descriptor visuals, so existing `smartvisuals` decorations (`image`, `icon`, `badgeIcon`) still apply. Selection thumbnail/icon overrides remain local to the selection and do not edit the underlying category, tag or menu. A caller must enable those capabilities in its Selection Profile to expose their controls. Attached native image-field previews retain their existing integration; managed previews use the generic composition or a registered renderer.

`CollectionView` is shared by the Picker's selected-resources area and external form controls. It uses the browser's existing Grid/List resource renderers, collection state, ordering API and `ResourceInfoPanel`. It does not load a navigation tree. Its column catalog contains common selection fields, not all adapter-specific Browser metadata.

External `mountSelectionField` configurations support:

| Option | Default | Values |
| --- | --- | --- |
| `informationPanel` | `true` | Boolean |
| `informationPanelOpen` | `true` | Initial visibility only |
| `informationPanelPosition` | `auto` | `auto`, `top`, `bottom`, `left`, `right` |
| `selectionUseData` | `readonly` | `hidden`, `readonly`, `editable` |
| `showLabel` | `true` | Independent of full width |
| `fullWidth` | `false` | Boolean |

The equivalent Joomla field attributes are `information_panel`, `information_panel_position`, `selection_use_data`, `show_label` and `full_width`. These are also available in the custom field designer. A read-only field never exposes editable usage controls.

Panel placement uses the control's width, not the viewport. Auto chooses the left side in wide controls; side panels stack in narrow containers. The toolbar belongs to the Grid/List region, not the preview region. Selection never changes panel visibility. Native image callers choose editable usage and a left panel. Other designers retain the readonly default.

Grid resources use the normal Browser presentation, including its thumbnail, file badge and compact metadata. List columns default to Name, URI and Status. ID, Type, Created and Modified are available, hidden by default, with the normal header icons. Column choices and view sorting are saved at the public viewPreferenceKey's existing layout suffix. Media URI uses the same formatter as the native Joomla image field; it is never a concatenation of parent paths and URLs. The readonly Address input supports text selection and copying; changing a reference still uses Replace, not URI editing. The Picker retains its complete Information tab and initially opens its panel for profiles with visible Usage Options; closing it manually remains effective while selecting resources.

## Selection Presentation and Ordering

Article descriptors expose `article.displayedName` (string, maximum 255 characters). Empty/whitespace values use the resolved article title. This never changes the article record. Generic `visual.presentation` accepts `thumbnail`, `icon` or `both`; null retains the existing visual settings. It reuses `visual.thumbnailOverride` and `visual.iconOverride`. Thumbnail-only falls back to the icon when no thumbnail is available. These capabilities appear only when included in the caller's selectionProfile, for example:

```js
selectionProfile: {
  'article.displayedName': {},
  'visual.presentation': {},
  'visual.thumbnailOverride': {},
  'visual.iconOverride': {},
}
```

The effective thumbnail is the resolved thumbnail override, otherwise the adapter's existing thumbnail/poster/image. Its resolved descriptor and crop presentation are retained as derived `effectiveThumbnailResource`/`imageCrop`; the selected article identity remains unchanged. PHP prepared selection items also expose `displayedName`, `visualPresentation`, `effectiveThumbnail` and `effectiveIcon`. Extensions keep their data under reserved `ext.*` usage keys using the existing preview context; SmartBrowser does not interpret a plugin's crop/watermark metadata itself.

View sorting (Name, Address, ID, Type, Created or Modified) only changes the displayed order. Missing sort values remain last, and ties retain input order. Manual move controls appear only for Ordering. The Sort Selection Order command reuses the advanced Sort dialog, applies to the entire selected collection and persists its new order through the existing field/collection change event. It never reorders native Joomla article records. Full selection entries move together, including thumbnail references, displayed names and extension metadata. The public collection instance exposes `reorderItems(keys)` for validated, full-permutation collection ordering; keys use the existing resource identity contract.

The Grid toolbar exposes view sorting; List sorting uses the column headers and its Columns button opens the same checkbox popup as the main Browser. Search remains a Browser feature, not a Selection View feature. Browser search opens a popup, while sorting expands inline in wide toolbars and uses a popup in narrow containers; neither adds a toolbar row.

Callers can set the existing collection option `allowOrdering: false` (Selection Field configuration: `ordering: false`) when stored order is not meaningful. This hides move controls, Sort Selection Order and the Ordering sort option/header. View sorting remains available, defaults to Name, and never changes stored order. Existing saved Ordering preferences fall back to Name for these callers.

Reopening the same selection retains its extension data and all supported usage values. In selection fields, Add opens an empty Picker and appends only new identities; existing entries, order and usage are unchanged, including when an existing identity is picked again. Replace opens the entire collection for editing, with the current resource focused and Information open. It uses the field's single/multiple selection rules, not a forced single-resource mode. The returned collection becomes the full selection. Single-selection replacement retains the existing preserveUsageOnReplace policy; default replacement does not carry crop/extension data to a new identity. Clear/remove discards the corresponding entry.

Public Picker options `initialFocus: { adapter, id }` and `initialInfoOpen: true` focus an already selected collection item and open its Information panel without changing order or membership. Unknown/unselected initial focus falls back to the normal initial resource. Add is not an item context-menu action.

## Shared Picker Operations

For writable `mountCollection` selections, pass `selectedResources: true`, reference entries and `pickerUrl`. Add and Replace then use the shared workflow automatically, with no `onAdd`/`onReplace` required. Existing explicit callbacks are retained as overrides. `allowAdd: false` and `allowReplace: false` suppress the corresponding default operation. Identifier-only and readonly collections do not acquire default editing operations.

The public instance exposes `add()` and `editSelection(resource?)` for caller-owned buttons. The latter uses the focused resource (or the first item) when omitted. Each confirmed operation resolves resources through the existing API, rejects disallowed types/references, enforces limits and emits one standard collection change with the complete `items` and reason `add` or `replace`. Cancellation leaves data untouched. A destroyed collection ignores late results; a concurrent collection edit rejects the stale Picker result rather than overwriting it. Duplicate identities in Add never overwrite an existing item's usage. Single-selection replacement retains its existing usage-preservation policy.

The host owns its storage: implement `onChange({ items })` to convert/store complete selection entries and `onError(error)` to report errors. For calls to `add()`/`editSelection()` from your own buttons, handle promise rejections in the caller. Do not append the `onChange` items again or implement a second Picker merge. Existing selection profile, adapter/type constraints, browse root, multiple/homogeneous rules and maximum count are reused. `pickerOptions` may be an object or synchronous function returning additional Picker options such as title and selection editor context; collection identity, membership and constraints remain host-controlled.

```js
const selection = SmartBrowser.mountCollection(element, {
  selectedResources: true, referenceItems: true, pickerUrl, apiBaseUrl, csrfToken,
  adapter: 'articles', allowedAdapters: ['articles'], allowedResourceTypes: ['article'],
  selectionTarget: 'item', multiple: true, homogeneous: true,
  items, selectionUseData: 'editable', selectionProfile,
  onChange: ({ items }) => saveSelection(items),
  onError: error => showError(error),
});
// External buttons may await selection.add() or selection.editSelection(resource).
```

Picker callers can provide `title`, `subtitle` and `confirmLabel`. Nested thumbnail selection uses the existing nested Picker with a thumbnail-specific title and confirmation label.

## Portable Selection Addresses

The shared Address column/input now displays the complete [Universal Selection Address](selection-address-contract.md), not legacy `article:id` text or raw JSON. Copy exports the stored order, independently of temporary view sorting. The existing collection/field instance provides `exportAddresses()` and `importAddresses(text, { append })`; toolbar Copy and Import use those same operations. Imports resolve through existing adapters, validate profiles on the server and commit atomically. Native image fields retain their field-specific URI representation rather than storing arbitrary portable formats.

Unknown textual properties and compound image details use the existing `ext.selectionAddress` metadata contract. Structured plugin metadata needs a registered property codec; unsupported data is reported rather than omitted from a purportedly complete address. The preview extension `getAddress()` retains native/field-specific behavior; `getSelectionAddress()` reads the portable representation.

`SmartBrowserPicker.extensions()` exposes registered usage editors and preview actions to external controls. `subscribePreviewActions(listener)` notifies subscribers with the current action array on registration/removal and returns an unsubscribe function. Open Pickers and external controls subscribe automatically and clean up on unmount. Preview action contexts retain `resource`, `profile`, `values`, `getValues`, `setValue`, `previewElement`, `selectResource`, `refresh` and `signal`; external controls also expose `setAddress(uri)` to update the displayed address. Action effects are scoped to the active resource and aborted when it changes. Readonly/hidden usage does not expose mutating preview actions.

`mountCollection().attachPreview(element)` attaches the existing native preview DOM to the shared information host, preserving third-party listeners and native form inputs. `addToolbarButton(element)` continues to move the actual caller button. Both restore the original elements on teardown. This keeps native image-preview plugins independent of SmartBrowser's content preview renderer.

Storage remains `{ version: 1, items: [{ selection: { adapter, id }, usage }] }`. Replacing a resource uses the existing usage-preservation policy and keeps its ordered slot. Cancelling leaves the original selection unchanged.
