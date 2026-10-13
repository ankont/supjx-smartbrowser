# Selected Resources Controls

`CollectionView` is shared by the Picker's selected-resources area and external form controls. It uses the browser's existing Grid/List resource renderers, collection state, ordering API and `ResourceInfoPanel`. It does not load a navigation tree or expose the browser's metadata column settings.

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

Grid resources use the normal Browser presentation, including its thumbnail, file badge and compact metadata. List columns are Name, URI and Status, with the normal header icons. Media URI uses the same formatter as the native Joomla image field; it is never a concatenation of parent paths and URLs. External panels show the resource title and usage options first, with a readable/copyable URI below. The Picker retains its complete Information tab and initially opens its panel for profiles with visible Usage Options; closing it manually remains effective while selecting resources.

Picker callers can provide `title`, `subtitle` and `confirmLabel`. Nested thumbnail selection uses the existing nested Picker with a thumbnail-specific title and confirmation label.

`SmartBrowserPicker.extensions()` exposes registered usage editors and preview actions to external controls. `subscribePreviewActions(listener)` notifies subscribers with the current action array on registration/removal and returns an unsubscribe function. Open Pickers and external controls subscribe automatically and clean up on unmount. Preview action contexts retain `resource`, `profile`, `values`, `getValues`, `setValue`, `previewElement`, `selectResource`, `refresh` and `signal`; external controls also expose `setAddress(uri)` to update the displayed address. Action effects are scoped to the active resource and aborted when it changes. Readonly/hidden usage does not expose mutating preview actions.

`mountCollection().attachPreview(element)` attaches the existing native preview DOM to the shared information host, preserving third-party listeners and native form inputs. `addToolbarButton(element)` continues to move the actual caller button. Both restore the original elements on teardown. This keeps native image-preview plugins independent of SmartBrowser's content preview renderer.

Storage remains `{ version: 1, items: [{ selection: { adapter, id }, usage }] }`. Replacing a resource uses the existing usage-preservation policy and keeps its ordered slot. Cancelling leaves the original selection unchanged.
