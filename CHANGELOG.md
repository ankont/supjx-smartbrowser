# Changelog

## 3.0.9 - 2026-10-08

- Add a translated Double click tooltip to bold default actions in grid/details menus, alongside the modified-action tooltip.

## 3.0.8 - 2026-10-08

- Ctrl+double-click edits nodes in manage mode and selects eligible nodes in selection mode, while normal activation still navigates.
- Mark the modified action in grid/details context menus with italics and a translated tooltip; keep the default action bold and full Preview independent.

## 3.0.7 - 2026-10-08

- Raise embedded collections only while their item menu is open, keeping menus above adjacent browser and collection toolbars.

## 3.0.6 - 2026-10-08

- Allow embedded Collection View menus to extend outside their browser/table containers without changing full-browser scrolling.
- Use neutral Remove/Αφαίρεση wording for single and multiple selections.

## 3.0.5 - 2026-10-08

- Move the Collection View count to its footer and add a colon before the number.
- Make the Picker selection disclosure visibly interactive with a rotating chevron, hover and focus states; suppress the duplicate count in the embedded collection.

## 3.0.4 - 2026-10-08

- Add an optional generic onAdd callback to the Collection View toolbar, before Remove, with the label Add/Προσθήκη.
- Move custom-field additions into the shared toolbar, including compact and empty views; remove the external field controls.

## 3.0.3 - 2026-10-08

- Restore Picker action-toolbar rendering with real adapter actions by binding availability to the current selection; keep the existing completion action.
- Export collection language strings to browser/Picker instances.
- Remove flat article views from adapter descriptors; retain adapter navigation in reference-collection Pickers while browsing flat views.
- Extend the production fixture with nonempty actions and add regressions for toolbar binding, translations and adapter navigation.

## 3.0.2 - 2026-10-08

- Use smartbrowser as the custom-field identifier and SupJx SmartBrowser Picker (smartbrowser) as its type-list label.
- Keep only the canonical type in discovery, including upgrades with obsolete files left on disk; no legacy field-type compatibility is provided.

## 3.0.1 - 2026-10-08

- Fix field creation and edit-form namespace registration using Joomla FormHelper instead of the nonexistent Form::addFieldPrefix method.
- Rename the field plugin to Fields - SuperSoftJx - SmartBrowser Picker and prefix its field-type label.
- Add regression coverage for plugin form/DOM preparation, preserving native parameter loading and disabled-field ACL attributes.

## 3.0.0 - 2026-10-08

- Add the Fields - SmartBrowser Picker plugin for administrator and frontend custom-field editing.
- Configure allowed adapters, browse root, resource target/types, single/multiple selection, ordering, generic Selection Profile JSON and Auto/Compact/Collection editor display.
- Generalize the core collection contract to ordered per-item normalized adapter/resource references and independent usage values, with optional homogeneous constraints and unchanged legacy APIs.
- Preserve selected resources and usage while switching browsing adapters; keep grids/columns single-adapter and resolve metadata, visuals and actions per selected item.
- Store versioned field collections without resolved labels or presentation markup.
- Reuse the Picker and Collection View, adding a compact details-renderer route and generic collection host-action callback.
- Resolve prepared values dynamically with adapter/access checks and safe unavailable states; provide escaped text-only default output.
- Preserve other items and their usages when editing one selection. Enforce homogeneous restrictions at addition, not browsing; allow mixed fields by disabling the optional constraint.
- Validate stored field usages server-side against the existing capability/profile contract, including reference permissions and resource types.
- Verify 321 JavaScript tests and 18 standalone PHP regression scripts, plus production-bundle browser fixtures for mixed/homogeneous selection, image/PDF/article fields, nested thumbnails and per-item usage/order preservation.

## 2.1.7 - 2026-10-08

- Restrict thumbnail editing actions to Usage options, preserving the effective visual in Information.
- Keep the chosen pane tab across resource changes, temporarily falling back to Information when Usage options are unavailable.
- Anchor contextual buttons to the pane visual area's outer edge without extra padding or image margins; overlap is allowed. Preview remains available in both tabs.
- Separate Preview on the leading edge from editing actions on the trailing edge, with 4px edge spacing.
- Link decorative-image usage to alternative text: decorative selection clears and disables alt text, including initial and returned usage values.

## 2.1.6 - 2026-10-08

- Expand the Information visual to available width and 150px height while retaining compact Usage dimensions and transparent backgrounds.
- Use an eye icon for full-resource Preview, distinct from image zoom.
- Offer the existing thumbnail override capability for image resources as well as PDFs; the original image remains the full Preview and insertion target.

## 2.1.5 - 2026-10-08

- Separate compact Information/Usage visuals from composite browser cards and full Preview modals.
- Reuse the existing Preview dispatcher from contextual visual actions; unsupported file previews are omitted.
- Present thumbnail reference capabilities with `visualRole: 'thumbnail'` as compact add/change/remove actions, resolving overrides without changing selected-resource identity.
- Reuse registered provider preview actions on the lightweight visual in both pane tabs.

## 2.1.4 - 2026-10-07

- Put Usage options before Information, with a compact preview above the resource title; preserve the regular Information preview/title layout.
- Move Picker maximize into the browser action toolbar using the dashboard button style.
- Harden maximized dialog dimensions against template CSS overrides and preserve size preferences without an external button.

## 2.1.3 - 2026-10-07

- Keep the resource preview and provider preview actions in the Information view, leaving Usage options unobstructed.
- Add Picker maximize/restore with an independent remembered preference and shared host-page scroll locking.

## 2.1.2 - 2026-10-07

- Fit frontend modal editors to their available viewport and keep scrolling inside editor content, including accordion layouts.
- Lock same-origin host page scrolling while an editor modal is maximized; restore it on resize, close, or teardown.
- Route authorised Joomla media/article editor buttons through SmartBrowser when their integrations are enabled. Media insertion consumes image usage options and PDF thumbnail references.

## 2.1.1 - 2026-10-07

- Added explicit `presentation: 'hidden'` selection-profile options, including required properties with initial/default values.
- Hidden properties retain validation and result values without rendering editors or forcing an empty Info pane.
- Invalid hidden values produce a visible integration/profile configuration error.

## 2.1.0 - 2026-10-07

### Selection Profiles
- Added generic resource selection capabilities, caller selection profiles and per-resource usage state to the existing Picker.
- Added text, textarea, boolean, select, number and resource-reference editors in the existing Info pane, with primary/secondary presentation and validation.
- Added custom usage-editor and preview-action registration APIs.
- Added image alternative text, decorative state and loading strategy capabilities to the Media adapter.
- Added PDF thumbnail overrides using a nested instance of the same Picker, returning only a normalized resource reference.
- Preserved legacy result shapes; callers can explicitly request `{ selection, usage }`.
- Added ordered initial selections, isolated nested/parallel instances and transient Info visibility without changing remembered browser preferences.
- Added regression coverage, including desktop/mobile browser scenarios with the production renderer.

### Previously Uncommitted Changes
The source history also includes the changes delivered in the preserved 2.0.6 installer:
- Reusable single-adapter Collection View with resource resolution, ordering, removal, callbacks and lifecycle support.
- Flexible resource appearance rules, unified Font Awesome icon vocabulary and per-adapter icon customization.
- Generic SmartVisuals decoration consumption and optional SmartCrop image presentation.
- Expanded editor image-fieldset rendering for plugin fields, generic article creation defaults and the fix for normal creation without defaults.
- Default edit/selection actions, content previews, tree/breadcrumb icon fixes and Joomla media-field integration improvements.
- Remembered dashboard expansion and two-state popup editor maximization, with a shared dimmed/blurred modal backdrop.

### Verification
- 291 JavaScript tests and the standalone PHP regression suite pass locally.
- Browser checks cover image usage validation, PDF thumbnail selection/change/removal, ordered multiple selection, custom editors/actions and mobile layout.

## 2.0.6 - Archived Installer

The installer produced before Selection Profiles has been preserved as a separate
GitHub release under `archive-v2.0.6`.

The original full source snapshot was not committed. The archive tag therefore
contains only archival documentation and the installer checksum; it does not
pretend to be a reproducible source checkout of 2.0.6. Use the attached
`pkg_smartbrowser-v2.0.6.zip` installer, not GitHub's automatic source archives.
