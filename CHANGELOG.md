# Changelog

## 4.0.0 - 2026-10-18

- Consolidate Selection View enhancements, universal selection addresses, extensible previews and image-presentation providers.
- Add native Joomla custom-field output with shared layouts, template overrides and generic PHP image presentation.
- Include accumulated adapter, permissions, editor, accessibility and layout fixes; preserve existing selections and consumer compatibility.

## 3.16.0 - 2026-10-17

- Render custom fields through a shared Joomla resource layout with native image markup, captions, public links and safe text fallbacks across adapters and node/item kinds.
- Add a generic PHP image-presentation event after layouts, with opaque Usage, resolved image context, failure rollback and once-only server presentation markers.
- Preserve template overrides and existing read policies/storage; prevent duplicate JS presentation of server-rendered images and document migration for template, SmartVisuals, Sources and providers.

## 3.15.1 - 2026-10-17

- Recalculate native preview image viewport geometry from provider-declared CSS aspect-ratio on generic presentation notifications, ahead of natural dimensions.
- Restore fallback geometry after reset, image changes, provider removal and failed application; document equivalent custom-renderer behavior without metadata parsing or reapplication loops.

## 3.15.0 - 2026-10-17

- Add generic preview image-presentation providers with declared style ownership, ordered conflict resolution, rollback, cancellation, readonly rendering and provider-owned reset hooks.
- Publish primary images explicitly from native previews and custom renderers; expose resolved image context and generic presentation-change notifications while preserving renderer frames/pins.
- Remove extension-specific reset metadata handling and the optional direct PHP image-extension helper call; document provider/renderer migration without changing selection storage or introducing grid/list effects.

## 3.14.4 - 2026-10-17

- Make Selection Usage available in writable Pickers even without ordinary usage fields; keep crop, reset and modified previews exclusively in Selection Usage, leaving Information unchanged.
- Offer a hidden-by-default Address column in Pickers using the existing Selection Address serializer and live usage values.

## 3.14.3 - 2026-10-17

- Detect native image address changes independently of attached native preview markup, showing reset for address-only crops and restoring the default image address.

## 3.14.2 - 2026-10-16

- Restore independent type icon, thematic badge and image layers in item appearance settings and previews.
- Preserve configured item type icons when visuals providers supply a separate thematic icon.

## 3.14.1 - 2026-10-16

- Place preview editing controls on the left (reset, thumbnail, extensions) and the preview eye on the right.
- Detect persisted SmartCrop changes and reset visual, crop and address overrides without clearing unrelated metadata.

## 3.14.0 - 2026-10-16

- Centralize selection Add/Replace Picker workflows in the public Collection View, including resource resolution, limits, metadata-safe append, current-resource focus and stale-result protection.
- Reuse the public workflow in selection fields; retain explicit callback overrides and expose add()/editSelection() for external consumer buttons.

## 3.13.0 - 2026-10-16

- Open an empty Picker for selection-field Add and append new identities without modifying existing entries or usage.
- Edit the full collection through Replace, focusing the current resource with Information open through public initialFocus/initialInfoOpen options.
- Remove Add from item context menus and document the callback contract for external collection consumers.

## 3.12.3 - 2026-10-16

- Keep the modal document body at viewport height so TinyMCE CMS menus and other body-mounted dropdowns are not clipped behind the fixed editor.

## 3.12.2 - 2026-10-16

- Clear stale native form session data in frontend editors as well as administrator, so article Edit loads the requested record instead of a blank or unrelated draft.
- Preserve recovery data for the same record and cover native frontend article identity routing.

## 3.12.1 - 2026-10-15

- Preserve icon class input drafts while normalizing whitespace in stored values.
- Validate Selection View usage edits before notifying consumers, keeping invalid drafts out of persisted selections and rejecting stale validation results.

## 3.12.0 - 2026-10-15

- Expose a shared preview actions container to visual overlays, with consistent square icon and variable-width text button styling.
- Remount overlays when their action slot changes and document extension button ownership and cleanup.

## 3.11.4 - 2026-10-15

- Fill the modal editor viewport edge-to-edge, removing template insets above its toolbar and placing the form scrollbar at the window edge.
- Keep field spacing inside a shared content wrapper so grid gutters do not create horizontal form scrolling.

## 3.11.3 - 2026-10-15

- Keep the icon badge above the thumbnail in Both presentation mode.
- Add a visible disclosure indicator to More options and retain its open/closed state while switching selected resources.

## 3.11.2 - 2026-10-15

- Let all modal editors scroll the complete form below a sticky action toolbar instead of restricting scrolling to tab panels.
- Remove reserved toolbar padding before the title and adapt focus/dropdown scrolling to the shared form viewport.

## 3.11.1 - 2026-10-15

- Extend the Browser folders, content and Information panel to the available viewport height, including resized and focus layouts.

## 3.11.0 - 2026-10-15

- Align generic selection previews with grid composition and pass effective presentation mode, imagery and crop to site preview renderers.
- Reuse configured badge placement for explicit visual modes, clarify Default and add icons to common presentation usage fields.

## 3.10.4 - 2026-10-15

- Shorten selection context menu labels and keep collection ordering sort in the toolbar only.

## 3.10.3 - 2026-10-15

- Add selection toolbar operations to item context menus, sharing ordering commands, availability checks and handlers with preview actions.

## 3.10.2 - 2026-10-15

- Restore the Sort icon for stored collection ordering; reserve Signal for view sorting.

## 3.10.1 - 2026-10-15

- Keep Information visuals identical to the Browser Grid composition for non-image resources, independently of Selection Preview renderers and usage overrides.
- Scope generic preview sizing so Information surfaces cannot collapse and paint over their metadata; retain adaptive native-image Information sizing.

## 3.10.0 - 2026-10-15

- Add registered preview renderers with shared mount/update/cleanup, readonly inspection, late registration and Picker iframe integration.
- Add the SmartVisuals preview asset preparation hook for frontend and administrator hosts.
- Reuse resource visual composition for generic previews: image or configured type icon, with site-specific identity as a corner badge.
- Preserve native image field integration and separate Information visuals, overlays and preview actions.

## 3.9.1 - 2026-10-15

- Show native category and tag images in shared resource descriptors and previews, including readable frontend selections.
- Show menu link images or icons in previews and preserve native image metadata in menu visuals.
- Keep node previews compatible with SmartVisuals decorations and selection thumbnail/icon overrides.

## 3.9.0 - 2026-10-15

- Implement the Universal Selection Address Contract with seven semantic formats, flat registered properties and extensible compound codecs.
- Add deterministic short image aliases and lossless native image query metadata, including SmartCrop and unknown extension parameters.
- Integrate complete plain-text addresses, copy/export and atomic multiline paste/import into the shared Selection View.
- Resolve imports through existing adapters and server profile/ACL validation; retain JSON storage and native Joomla image field output.
- Generate public Joomla resource URLs through site routing and preserve existing view-adapter identities through optional routing hints.
- Share the Browser Columns popup with Selection View, show sorting only in Grid, and keep search/sort controls out of expanded toolbar rows.
- Honor caller-disabled selection ordering throughout the UI while retaining view sorting, and rename address commands to Copy/Import Resource Addresses.
- Use Signal icons for sorting, expand sort options away from aligned triggers without moving them, and place selection ordering actions after Replace.
- Export advanced Sort translations through the common language list for external Selection Views as well as the Browser.

## 3.8.0 - 2026-10-14

- Add per-selection article displayed names and thumbnail/icon/both visual presentation capabilities.
- Add common optional selection columns and persistent view sorting without altering stored selection order.
- Reuse advanced Sort for whole-collection ordering, preserving full entries and extension metadata without changing native Joomla resource order.
- Retain resolved thumbnail crop presentation and document extension metadata and replacement policy.

## 3.7.1 - 2026-10-14

- Move selection position hints from preview titles to accessible gallery navigation buttons.
- Style selection addresses explicitly as readonly while allowing text selection without URI editing.

## 3.7.0 - 2026-10-13

- Add a shared visual overlay registry and mount/update/cleanup lifecycle for Picker, external and native image previews, including late registration.
- Allow explicitly declared inspection preview actions in readonly usage mode while protecting write callbacks.
- Persist bounded extension metadata under reserved ext.* usage keys without weakening standard capability validation.
- Synchronize extension address updates with selection change events and native image fields; support expanded overlay stacking.

## 3.6.22 - 2026-10-13

- Disable single-resource Media download/share for multiple selections, constrain batch control sizing, normalize Joomla article reorder conditions, and preserve unselected sibling slots during advanced Sort.

- Keep the empty image name placeholder below the preview instead of inside it.
- Show the compact empty-selection Add command only while Grid/List is collapsed.

## 3.6.21 - 2026-10-13

- Remove duplicate selection commands from side Information and move the helper Add command to empty Grid/List when Information is beside the list or hidden.
- Show the native empty image message only once, shorten unavailable content previews, and add a regular-weight active-selection counter next to the resource name.
- Label reusable link usage as Link Text rather than Link A Text in Picker and external controls.

## 3.6.20 - 2026-10-13

- Reactivate vertical Information when closing the selected-resource list, retaining and saving that state when reopening the list instead of restoring hidden Information.
- Cycle Information in vertical, side, hidden order.

## 3.6.19 - 2026-10-13

- Match empty selection preview structure with a title and compact Add below the preview while retaining the right-side helper selection button.
- Automatically show top Information while the list is collapsed, preserving the user's expanded-list Information state.
- Reinforce native preview borders with explicit physical/logical borders and an inset bottom edge.

## 3.6.18 - 2026-10-13

- Cycle external Information through side, vertical and hidden states, with a distinct theme-aware vertical button background and persisted visibility/layout preference.
- Preserve existing top/bottom and left/right configuration plus compatibility with previously saved two-state preferences.

## 3.6.17 - 2026-10-13

- Complete recognizable schemeless websites with HTTPS in Automatic Direct Links mode without network requests; preserve relative paths, queries and common local filenames.
- Stop showing the missing-scheme warning for addresses that the existing resolver can normalize.

## 3.6.16 - 2026-10-13

- Use the same compact Add action for empty and filled selection panels, retaining bounded single-selection behavior and the existing Picker handler.
- Complete schemeless website addresses with HTTPS in explicit External website mode without altering stored references or relative-address behavior.

## 3.6.15 - 2026-10-13

- Move gallery navigation into subdued side strips with hover/focus emphasis and no additional vertical space.
- Add bounded Add and active-resource ordering to the preview quick toolbar, retaining existing collection actions and checkbox state.
- Center quick-action icons without browser button padding and load native link-target translations in external controls.

## 3.6.14 - 2026-10-13

- Split Information position into independent horizontal and vertical settings, with legacy configuration compatibility.
- Share collapsed/expanded and top/side presentation with multiple selections; add previous/next active-resource navigation in vertical panels without changing ordering or stored usage.
- Enforce the native preview bottom border and remove duplicate empty-state selection commands from Grid/List.

## 3.6.13 - 2026-10-13

- Match Preview button top/left inset, restore the native preview bottom border, and give List action menus additional right-edge spacing.
- Share empty/filled content preview sizing and remove Select resource from the Grid empty state.

## 3.6.12 - 2026-10-13

- Place single-selection quick actions below a larger preview, keep the count toggle above the list, and persist expanded and top/side Information preferences.
- Use Information toggle to switch expanded single selections between top and side layouts while retaining visible information.
- Remove the Decorative Image icon and align empty-state Add before information text in the controls column.

## 3.6.11 - 2026-10-13

- Place Address before readonly and editable usage, add shared usage label icons and Information-style control indentation.
- Let external Information panels grow with their contents without internal scrolling.
- Default single selections to top Information with side-by-side preview and controls on wide containers, collapsed lists toggled by the selection count, and direct Remove/Replace plus adapter-supported Preview actions.

## 3.6.10 - 2026-10-13

- Hide item and Select All checkboxes in single-selection Picker and external controls, preserving multiple-selection and normal Browser controls.
- Align the Address textbox with other usage controls without definition-list indentation.

## 3.6.9 - 2026-10-13

- Synchronize native image Address display with plugin URI changes, place Address before editable usage, and share Information label styling with Picker usage fields.
- Keep embedded toolbars on one row with overflow scroll arrows and use Picker single-selection checkbox state rules.

## 3.6.8 - 2026-10-13

- Load native content translations in embedded selections and unify editable usage label styling.
- Show Address as a disabled single-line field with an inset copy button; place image and automatic panels on the right with pointer and keyboard width resizing.
- Preserve native image URI extension data when usage changes without replacing the resource.

## 3.6.7 - 2026-10-13

- Offset Information file icons by 20px for thumbnail previews, reserving matching layout space and an additional filename gap.

## 3.6.6 - 2026-10-13

- Preserve Grid overhang for image-anchored Information badges, reserving space to avoid clipping without changing icon size or layer order.

## 3.6.5 - 2026-10-13

- Size Information icons from the Grid reference independently of image aspect ratio, center images vertically, and reduce wide-image preview height without altering configured layer order.

## 3.6.4 - 2026-10-12

- Preserve configured Information visual composition and layer order; adapt preview height to visible content without unnecessary empty space.

## 3.6.3 - 2026-10-12

- Keep Information thumbnail visuals centered with a small muted file badge, independent of Grid composition settings.
- Keep Preview and thumbnail action buttons above the visual layers.

## 3.6.2 - 2026-10-12

- Fit Information visuals to their composed thumbnail and badge bounds inside a flexible rectangular preview, preserving space for wide images without detached file icons.

## 3.6.1 - 2026-10-12

- Place image previews on the left and keep the selection toolbar directly above Grid/List, aligned with the preview region.
- Reuse normal Browser Grid metadata, selection checkboxes and square Information visuals; show Name, native URI and Status columns with header icons.
- Prioritize resource titles and Usage Options in external panels, with editable usage for native image callers.
- Initially open Picker panels for visible Usage profiles without selection-driven visibility changes.
- Version Joomla asset URLs and generated ES module imports together to prevent old/new selection control assets from mixing after upgrades.

## 3.6.0 - 2026-10-12

- Share selected-resource presentation, Grid/List renderers, Information Panel and preview/usage integration between Picker collections and external form controls.
- Add explicit Replace actions, bounded Add, stable empty states, responsive panel placement and readonly/editable/hidden Selection Use Data.
- Retain native image preview DOM and caller toolbar buttons, with independent label visibility and full-width form layout.
- Add compact caller-defined Picker titles, subtitles and confirmation labels, including direct nested thumbnail selection from external controls.
- Stop selection-driven panel visibility changes and guard double-click activation against resource reflow.
- Preserve resource references, storage format, ordering, replacement usage policy, adapter security checks and plugin extension points.

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
