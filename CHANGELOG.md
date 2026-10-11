# Changelog

## 3.5.0 - 2026-10-12

- Consolidate the accumulated 3.1.13-3.1.51 improvements into a feature release.
- Align administrator and frontend resource editors with native Joomla layouts, toolbars, permissions and fallback navigation.
- Add shared Image Selectors integration, native Media custom-field usage, Article image/link Selection Profiles and bounded link collections.
- Reorganize Options and integrations, improve contextual resource management and retain native Media provider behavior on hosted deployments.
- Refine previews, shared dialogs, labels and destructive actions; clear User passwords before displaying edit forms.

## 3.1.51 - 2026-10-12

- Match Selection Remove to destructive context-menu icon badges: red badge with white minus, neutral row until hover/focus.

## 3.1.50 - 2026-10-12

- Keep Selection context-menu Remove neutral with a red icon until hover/focus; retain the red Remove toolbar button.

## 3.1.49 - 2026-10-12

- Clear native User password and confirmation fields before displaying forms, including failed-save rebinding, without changing native password saving.
- Restore labels on converted image selectors and place the Selection Box alongside its native preview in the original controls column.

## 3.1.48 - 2026-10-12

- Apply compact framed fieldsets and legends consistently to every editor tab in both clients, instead of relying on administrator template styling outside Images and Links.

## 3.1.47 - 2026-10-12

- Align Menu, Tag and User editors with native Joomla title/alias, sidebar, parameters and grouped account details; use native administrator toolbars and Tag Versions.
- Share compact fieldset spacing, horizontal main fields and stacked sidebar controls across administrator/frontend editors, reusing Category layouts in both clients.
- Place frontend Article text and Content Settings side by side, combine Publishing/Metadata and keep native form permissions, optional fields and validation unchanged.
- Use red Close controls consistently and retain native User group selections when displaying Assigned Groups.

## 3.1.46 - 2026-10-12

- Recognize native accessible Media custom-field imagefile/alt_text/alt_empty companions in the shared Image Selector, including nested subform names; expose alt/decorative in the Selection Profile while preserving native field storage.

## 3.1.45 - 2026-10-12

- Shorten Options tab labels to Resources, Icons, Browsers, Editors, Integrations and Permissions; label the first Icons group Icon appearance.
- Move frontend/administrator resource editor opening modes into an Open behavior group in Editors without changing stored settings or defaults.

## 3.1.44 - 2026-10-12

- Add independent Image Selectors integration under Selection Fields, enabled by Global Replacement and always active inside SmartBrowser editors.
- Centralize compatible native image field conversion across native and SmartBrowser editors, retaining original field names/storage, previews, upload controls and known Article/Category usage mappings.
- Detect dynamic fields, avoid duplicate conversion and synchronize native upload changes; unsupported providers and protected fields retain native controls.

## 3.1.43 - 2026-10-12

- Follow native Joomla workflow activation before showing the Category Workflow tab.
- Add Category Image Selection with alt/decorative usage in administrator and frontend editors, retaining native preview/upload controls and params storage; unsupported legacy values keep their native fields.

## 3.1.42 - 2026-10-12

- Align administrator Category editing with the Article editor: native toolbar, title/alias above tabs, framed description and stacked sidebar settings, compact full-width spacing and native parameter layouts.
- Combine Category Publishing and Metadata into side-by-side frames and restore permission-gated Permissions, associations and native Versions support.

## 3.1.41 - 2026-10-12

- Blur the Article Preview backdrop and suppress background page scrolling only while its dialog is open and maximized, restoring scrolling automatically on restore or close.

## 3.1.40 - 2026-10-12

- Explicitly select the native Joomla iframe dialog for Article Preview rather than its legacy Bootstrap fallback, enabling full-height preview and maximize/restore; leave a 10% horizontal viewport margin by default.

## 3.1.39 - 2026-10-12

- Expand administrator Article Preview to near-viewport dimensions, fill the dialog body with its iframe and add a maximize/restore control alongside Close, retaining Joomla's native preview dialog.

## 3.1.38 - 2026-10-11

- Match caller-provided Selection toolbar controls to the native icon buttons, including dimensions, borders and hover/focus states.

## 3.1.37 - 2026-10-11

- Move image upload controls implemented as accessible role-button elements, including JCE file-input labels, into the Selection toolbar; observe delayed control initialization.
- Give enabled Selection Remove buttons a red background and white icon in the toolbar and item menu.

## 3.1.36 - 2026-10-11

- Allow Selection and Collection callers to attach existing buttons to the toolbar while preserving their event handlers and restoring them on disposal; move native image upload controls into the Selection toolbar.
- Mark Selection Remove commands and Picker Cancel in red.

## 3.1.35 - 2026-10-11

- Restore the native Joomla image preview and media wrapper in Article Pickers, retaining the integration point for preview plugins and refreshing it on selection changes.
- Give Intro and Full Article image fieldsets equal height within each image row.

## 3.1.34 - 2026-10-11

- Add an independent Resource Editors settings tab with native Article links as separate A/B/C slots or an ordered collection of up to three links.
- Reuse Picker Selection Profiles for image alt/decorative/caption/classes and link text/target in shared frontend/administrator Images and Links, translating edits back into native Joomla images/urls fields only.
- Add a reusable maximum-selection limit to Picker/collection normalization and selection operations; preserve native controls for unrepresentable legacy values and duplicate link slots.
- Guard article saves while asynchronous resource translation is pending or fails, ignore stale responses and compact ordered native links only when saving.

## 3.1.33 - 2026-10-11

- Stack Content Settings controls below their labels in the narrow administrator Article sidebar, retaining horizontal fields elsewhere.

## 3.1.32 - 2026-10-11

- Reduce standalone administrator Article top spacing, tab/fieldset padding and column gutters to preserve editing space.
- Open saved-article Preview in the native Joomla modal instead of a new browser tab.

## 3.1.31 - 2026-10-11

- Match native administrator Article field spacing and label widths using the native flex layout instead of a grid that added pseudo-element rows.

## 3.1.30 - 2026-10-11

- Add native administrator Article Versions and saved-article Preview, and use a red Close action with matching frontend Article wording.
- Frame Article tab content with titled fieldsets, split Content into Article Text/Content Settings, align administrator labels and controls, and match Images and Links to the shared frontend layout.

## 3.1.29 - 2026-10-11

- Remove the redundant hidden icon-help note that reserves layout space and rename the icon profile field to Customize Icons.

## 3.1.28 - 2026-10-11

- Use the native administrator page title and toolbar for standalone Article editors, keeping the Joomla fallback on the right and preserving shared submit actions.
- Expand administrator Article pages to the available width, place title/alias above the tab card, restore the article text label and correct the Configure Edit Screen translation key.

## 3.1.27 - 2026-10-11

- Use natural explanatory text and the native information icon in the Global Replacement help box.

## 3.1.26 - 2026-10-11

- Keep an explanatory Yes/No note visible beneath Global Replacement, including when individual integration settings are hidden.

## 3.1.25 - 2026-10-11

- Restore native switch dimensions when Global Replacement is displayed inline in the group legend.

## 3.1.24 - 2026-10-11

- Place the Global Replacement label and native switch together in the integration group legend.

## 3.1.23 - 2026-10-11

- Shorten contextual Inline Help to Yes/No behavior and group individual integrations under the Global Replacement switch.
- Move menu hiding into Administrator Navigation and apply it automatically with Global Replacement, preserving access to SmartBrowser options from integrated managers.

## 3.1.22 - 2026-10-11

- Place image transparency background above and outside the resource appearance settings block.

## 3.1.21 - 2026-10-11

- Put reset guidance above its section, contextual guidance before frontend/administrator settings, and clarify related-article switch labels.
- Show frontend settings first and remove the visual grouping around the general integration switches.

## 3.1.20 - 2026-10-11

- Restore the complete browser settings explanation above all groups and move saved browser preference reset into an explained section before client-specific settings.

## 3.1.19 - 2026-10-11

- Keep the related-articles settings explanation visible below the resource editor opening mode, independently of Inline Help.

## 3.1.18 - 2026-10-11

- Open native frontend Article edit links through the shared popup when configured, preserving page mode and the Joomla fallback.
- Correct the native Joomla Associations class namespace in the administrator Article layout.

## 3.1.17 - 2026-10-11

- Keep new article identity separate from routed category IDs when replacing native frontend editors.
- Keep Joomla fallback and maximize controls together in a compact right-aligned editor toolbar group.

## 3.1.16 - 2026-10-11

- Keep frontend article editors on the native article route and preserve the original return location through Joomla fallback editors.
- Place the icon-only Joomla fallback beside popup sizing controls on the right.
- Reuse native administrator article layouts for fieldset hierarchy, sidebar fields, permissions and effective global option labels.
- Reorganize appearance and browser settings, consolidate Article icon controls and simplify conditional integrations.

## 3.1.15 - 2026-10-11

- Add Replace all with conditional individual integrations and independent Yes/No editor-button settings, removing Follow integrations.
- Reuse SmartBrowser editor views, templates and controllers in the administrator with native administrator Article models and component/resource authorization.
- Add per-resource administrator editor replacement and frontend Article replacement at native edit entry points, including token-checked navigation posts.
- Add a scoped Joomla editor fallback, safe standalone return handling and native checkout/checkin lifecycle checks.

## 3.1.14 - 2026-10-11

- Allow menu managers to inspect Guest-access menu items without changing action ACL or public read visibility.
- Rename the default sorting label to Unsorted, without changing sorting behavior.
- Enable native Joomla Inline Help throughout component options, add translated integration descriptions and hide the unsupported external Help button only on SmartBrowser options.
- Group integrations and add independent, inheritable Media, Articles and Menu editor-button replacements, preserving native button authorization.
- Configure Direct Links icons per URI type with matching node/item visuals, without separate open/closed settings.

## 3.1.13 - 2026-10-11

- Align native local Media descriptor resolution with Joomla com_media: validate provider URLs and local files without server-side HTTP/TLS loopback probes.
- Retain authoring ACL, safe metadata, URL/path containment and fail-closed custom-provider handling; document that descriptors do not certify anonymous web-server access.
- Remove endpoint-dependent verification caching and cover proxy/HTTPS contexts, unsafe URLs, missing files and path escapes with regression tests.

## 3.1.12 - 2026-10-10

- Register the missing local Rename translation.
- Replace browser prompts/confirmations for rename, folder creation, deletion, group removal and upload overwrite with shared content-sized SmartBrowser dialogs; preserve cancellation and local link deletion without confirmation.
- Compute automatic link name hints with the existing stateless resolver, including the final root URL, and translate Home Page into Greek.

## 3.1.11 - 2026-10-10

- Add optional named URI references, automatic name hints and local Rename, preserving duplicate-URI constraints and ordered replacement.
- Add advisory URL warnings in the local editor; invalid destinations still fail validation.
- Allow callers/fields to specify an optional phone country prefix, recognize international 00 prefixes and retain entered phone formatting in link names.

## 3.1.10 - 2026-10-10

- Match the local resource editor Cancel button to the red styling of other editor modals.

## 3.1.9 - 2026-10-10

- Label Joomla path resources with the translated component name, view and optional ID; retain the URI as secondary information and use component names in editor choices.

## 3.1.8 - 2026-10-10

- Label root web links Home Page and remove confirmation for transient Direct Links deletion.
- Separate local resource creation from selection constraints: single creation replaces selection; homogeneous multiple collections retain foreign virtual items without selecting them.

## 3.1.7 - 2026-10-10

- Replace web address format dropdown with direct segmented choices.
- Explicit relative mode converts absolute destinations; automatic mode recognizes same-site HTTP/HTTPS URLs while retaining distinct custom ports.
- Expose effective absolute addresses alongside returned URL values in Direct Links metadata, columns and sorting.
- Size local resource editor dialogs to their content and scroll only when needed, without changing full resource editor sizing.

## 3.1.6 - 2026-10-10

- Simplify custom field selection editing labels to Edit.
- Make Direct Links Edit the declared Ctrl-double-click action, reusing the shared italic menu indication and permission checks.

## 3.1.5 - 2026-10-10

- Add optional article anchor suggestions to SmartBrowser custom fields: none, intentional anchors only, or all IDs and anchors.
- Read current Joomla editor content at Picker opening; retain editable suggestions, legacy anchor support and safe fallback outside article forms.

## 3.1.4 - 2026-10-10

- Decode translated text labels in the local resource editor.
- Add automatic/absolute/relative web addresses, caller-provided anchor suggestions and configurable Direct Links nodes.
- Add Joomla path resources with installed frontend component/view choices, retaining the URI reference contract.

## 3.1.3 - 2026-10-10

- Preserve Direct Links node icons in tree roots and breadcrumbs; remove duplicate URL columns and expose URL/type sorting.
- Move Picker cancellation into the main toolbar and remove its empty close-button header; round normal modal corners.
- Allow compact selections to switch between grid/details and remember the collection view locally.
- Add spacing after the Info pane title and metadata.

## 3.1.2 - 2026-10-09

- Reuse native backend publishing/audit field definitions in the frontend article editor and save validation.
- Show publishing dates, creator, modifier, revision and hits independently of presentation settings; retain native author-change ACL and read-only audit fields.

## 3.1.1 - 2026-10-09

- Add permanent Delete/Restore for trashed content, categories, tags and menu items; retain category navigation to trashed articles.
- Hide selection checkboxes in single-value Pickers; retain them for multiple selections and management.
- Retain deselected Direct Links for the selector lifetime with explicit Delete, friendly URI-derived labels, Greek naming and clean information fields.
- Complete frontend article publishing dates and use consistent start/finish labels.
- Add batch persisted sorting and safe provider-based ZIP extraction with optional archive removal; rename category placement to Change category.

## 3.1.0 - 2026-10-09

- Add the selection-scoped Direct Links adapter for web URIs, e-mail, phones and anchors.
- Reuse the common resource editor host for temporary selection edits, retaining order and usage.
- Resolve canonical URI references publicly without database persistence or destination requests.

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
