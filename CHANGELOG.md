# Changelog

## 6.0.0 - 2026-11-08

- Release unified pagination and smart loading across built-in adapters, retaining native defaults and selections across batches.
- Default new installations to smart loading with batches of 50, preserving explicitly saved loading preferences.
- Show a simple total when smart loading completes and keep result counts outside the navigation tree.
- Place Handling Large Lists below Default View State in Options.
- Clear the personal page-size override when its numeric control reaches zero, revealing the inherited-default hint.

## 5.4.3 - 2026-11-08

- Place Load more on the left and Load all on the right, keeping counts centered; add subtle borders and visible hover/keyboard focus.
- Load remaining batches on demand without changing the saved loading preference; stop on errors or navigation.

## 5.4.2 - 2026-11-08

- Use native Joomla article ordering when no explicit sort is selected.
- Place result counts consistently below results, independent of the navigation tree; show counts for full loading and single-page results too.

## 5.4.1 - 2026-11-08

- Preserve natural category and user-group ordering when pagination is enabled without an explicit sort.
- Keep contextual article ordering identical in full, paged and smart loading modes.
- Verify exact first/middle/last page order against full listings on Joomla 5 and 6.

## 5.4.0 - 2026-11-08

- Extend pagination to all built-in adapters and combine primary/contextual resources within one page limit.
- Add optional smart scroll loading with stable selection/focus, duplicate-request guards, retained results on failure and manual retry.
- Page hierarchical users and contextual articles through native database queries; preserve full sidebar navigation.
- Add adapter-specific flat-view descriptions and clarify source-enumeration limits for Media and generic flat adapters.
- Correct multi-state article filtering and menu nested-set ordering normalization.

## 5.3.1 - 2026-11-07

- Keep page navigation visible at the top and throughout scrolling, including flat layouts; reserve room for floating Picker messages above pagination.
- Move personal preferences before native Options in the administrator browser toolbar.
- Add an inherited account-wide numeric page size beside the large-list preference, accepting arbitrary positive integers and ignoring legacy per-view sizes.
- Refresh only the current browser when loading preferences are saved, retaining selections and preserving the surrounding form.
- Clarify page-scoped selection tooltips and remove the unrelated range tooltip.

## 5.3.0 - 2026-11-07

- Add opt-in server pagination for hierarchical and flat Article browsers, reusing Joomla access/filter queries and enriching only requested article rows.
- Retain complete sidebar navigation separately from result pages, use stable server ordering and preserve selections across pages.
- Add component loading defaults, a shared personal loading preference, saved page sizes and responsive page controls for administrator, frontend and selection windows.
- Preserve valid results on failed requests, ignore superseded responses and clamp pages after totals shrink.
- Keep unsupported adapters on full loading; contextual paging, Media optimization and scroll loading remain subsequent rollout stages.

## 5.2.1 - 2026-11-07

- Persist source-adapter locations instead of synthetic flat roots, preventing forbidden scopes when reopening flat browsers; recover previously saved flat-root locations without changing access checks.

## 5.2.0 - 2026-11-07

- Add My preferences with account-owned editor and integration choices, per-resource contextual visibility, independently scoped selection appearance and last locations, and personal resets.
- Add bounded recent-location history with alternating navigation and a split dropdown, shared through existing user-profile and local preference storage.
- Introduce category-tree filtering for featured articles with recursive category scope, independent dropdown filters and preserved featured ordering.
- Place recent-location history before all other browser toolbar controls, including ordering arrows.
- Add a plain Clear history footer that clears saved recent locations without navigating away from the current location.
- Center frontend browser heading controls and add a small top inset while preserving template-owned outer spacing.
- Define frontend Dashboard heading spacing on its wrapper, with 24px block margins, a margin-free title and centered preference controls.
- Widen frontend containers without forcing percentage widths on intermediate grid wrappers; preserve negative gutters, handle responsive width constraints and restore the original layout on exit.

## 5.1.7 - 2026-11-07

- Add category-tree navigation to featured articles, recursively scoping results while keeping dropdown filters independent.
- Reuse flat article scope resolution, retain access and browse-root restrictions, and keep category navigation nodes out of article results and bulk selection.
- Preserve featured ordering, breadcrumb navigation, saved locations and the featured-only constraint when returning to root.

## 5.1.6 - 2026-11-07

- Clarify that contextual visibility controls related articles or menu content, with concise resource-type labels and generic label fallback.

## 5.1.5 - 2026-11-07

- Preserve template-defined frontend Dashboard title margins instead of replacing them with fixed heading spacing.

## 5.1.4 - 2026-11-07

- Move contextual preferences below general and location settings with a small visual separation.
- Add an explicit SmartBrowser integration choice while retaining administrator restrictions.
- Center and style empty recent-location messages; align frontend Dashboard preferences with the title.

## 5.1.3 - 2026-11-07

- Group personal preferences into responsive two- and three-column rows, wrapping contextual controls without narrowing them as resource types grow.
- Replace field terminology in personal preference labels and help with user-facing wording.

## 5.1.2 - 2026-11-07

- Restore native toolbar spacing between Dashboard personal preferences and Options.

## 5.1.1 - 2026-11-07

- Repair Greek preference labels and replace technical terms with user-facing selection-window and resource-type wording.
- Show administrator defaults in inherited preference options and add Joomla inline help with integration warnings.
- Correct Save & Close text, use a red Cancel action and align Dashboard preferences next to Options.
- Integrate the history dropdown into a narrow strip on the main history button.
- Store contextual-resource preferences separately for categories, tags and menus; show the current browser's setting and expose all three on the Dashboard.

## 5.1.0 - 2026-11-06

- Add account-owned My preferences with editor, contextual-resource and integration overrides, reusing Joomla user profiles and local caching.
- Let Picker appearance and last-location scopes be configured independently per caller or adapter while keeping management browsers separate.
- Add a bounded recent-location split control with alternating back/forward navigation and full-path dropdown entries.
- Add current-view and personal-account resets with generation checks against stale tab writes.
- Expose the default preference button before native Joomla/maximize controls and on both Dashboards.

## 5.0.15 - 2026-11-06

- Float Picker messages over the results immediately above the selection panel without consuming layout height; follow panel expansion and retain dismiss interaction.

## 5.0.14 - 2026-11-06

- Keep the Picker message container transparent while retaining template padding and individual alert backgrounds.

## 5.0.13 - 2026-11-06

- Place Picker status messages immediately above the bottom selection panel, outside the results scrolling area, retaining native dismissal and full-height layout.

## 5.0.12 - 2026-11-06

- Apply consistent Choices select styling and dropdown indicators throughout editor fieldsets and sidebars.
- Let multiple-select search inputs fit narrow columns instead of clipping their placeholder-sized inline minimum; remove the nested input border and retain wrapping tags, keyboard interaction and native values.

## 5.0.11 - 2026-11-06

- Place native Joomla status messages below both Picker header rows, restoring their original container position when the Picker unmounts.
- Size contained Pickers against actual dialog bounds, retaining full-height results when messages close, the window resizes or the selection drawer toggles.
- Reveal newly uploaded selections in grid/list without scrolling the surrounding page; respect single-selection and caller-defined limits.

## 5.0.10 - 2026-11-05

- Select eligible leaf nodes by default in category, menu and tag Pickers, while retaining Open in the context menu and Ctrl/Cmd activation.
- Respect Picker resource-type constraints and selection permissions independently of edit permissions; branches and non-node browsers retain navigation defaults.

## 5.0.9 - 2026-11-05

- Default to Edit for permitted leaf nodes in category, menu and tag management browsers, using existing child metadata without additional requests.
- Retain Open in the context menu and as the Ctrl/Cmd activation for these leaves; preserve navigation defaults in article/media browsers and Pickers.

## 5.0.8 - 2026-11-05

- Support legacy nested radio groups and current Joomla radio-button layouts throughout embedded editors, including extension-provided fieldsets, without changing field values or initializing replacement widgets.
- Keep native and legacy selects readable and correctly sized, with help below controls and existing switcher, Choices, validation and showon behaviour preserved.
- Position native calendar popups within the editor viewport using the browser top layer where available, retaining Joomla keyboard/date handlers and restoring presentation on close.
- Set the backend Dashboard HTML document title to SmartBrowser Dashboard.

## 5.0.7 - 2026-11-05

- Export only selection properties differing from their effective capability/profile defaults, including scalar and compound values across adapters; retain meaningful empty overrides.
- Export Direct Links as plain URLs when no additional address information is present, while continuing to accept older explicit markers.
- Confirm successful address copies with a temporary checkmark, translated accessible feedback and a pressed state.
- Place the backend Dashboard heading in the Joomla toolbar alongside Options instead of repeating it below the toolbar.

## 5.0.6 - 2026-11-04

- Keep browser tree headings contiguous with their nodes under Joomla administrator summary-spacing rules.
- Give expanded page-width browsers consistent inline gutters and restore the original spacing when leaving wide mode.
- Isolate editor controls from legacy template form offsets, keeping sidebar fields inside their columns.
- Centre icon-only browser and editor controls independently of template icon-caption spacing.
- Respect Joomla showon visibility under aligned editor layouts and explicitly load its behaviour for extension-provided fields.

## 5.0.5 - 2026-11-01

- Restore the embedded image editor's transparency checkerboard on frontend templates without Atum's color variables.

## 5.0.4 - 2026-11-01

- Keep embedded image-tool navigation hidden through Joomla responsive tab updates, remove duplicate visible tool headings and use compact content spacing.

## 5.0.3 - 2026-11-01

- Remove inherited native fieldset padding that added excessive space between image-tool headings and their first controls.

## 5.0.2 - 2026-11-01

- Give embedded native image-editing forms their own scoped frontend layout so fieldset titles and labels do not overlap under site templates.

## 5.0.1 - 2026-11-01

- Distinguish published, unpublished and trashed states with unambiguous Greek labels across content and menu adapters.
- Show native Joomla publication timing, start/end dates and permitted action hints in grid/list status tooltips.
- Export missing frontend browser action translations using an isolated administrator-language fallback, preserving the host page's frontend Save and other core strings.

## 5.0.0 - 2026-11-01

- Unify administrator/frontend management and Picker layouts with responsive toolbars, sticky controls, independent information scrolling and a bottom selection drawer.
- Persist view and window preferences in user-scoped localStorage and Joomla profiles, isolate browser/Picker/caller contexts and extend global reset to every persisted UI preference.
- Restore saved Picker views on reopening, including nested thumbnail Pickers; explicit caller defaults retain precedence over saved preferences.
- Enhance native article image/link selections, retain full Selection Addresses and expose prepared link presentation data to template overrides while keeping ordinary output URLs clean.
- Add native Joomla image tools and bounded UTF-8 text editing to the Media file editor, with revision-aware writes, Apply, Save as Copy and Reset.
- Improve hierarchy paths, sibling ordering, menu filters, media uploads, unavailable-resource presentation and publication indicators for blocked category ancestry.
- Strengthen native editor return navigation, modal scrolling, translations, access-controlled management previews and extension integration contracts.
- Refresh public documentation, naming, branding and installable package metadata; retain extension identities, existing native data and selection JSON compatibility.

## 4.3.31 - 2026-10-31

- Isolate Picker preferences from management browsers and support caller-scoped viewPreferenceKey namespaces without per-resource roots.
- Persist existing view/window preferences in user-scoped localStorage and Joomla user profiles, shared across frontend/backend with authenticated, CSRF-protected patch saves.
- Expand Reset preferences to invalidate all user/cache generations, including Selection Views, display modes, popup sizes and unsent changes; reject stale writers.
- Supply stable role/field keys for native article/media fields, editor insertion actions, thumbnails and SmartAuthors user pickers.
- Verify account isolation, cross-device snapshots, concurrent patch merging, offline recovery, reset races and native Joomla profile persistence.

## 4.3.30 - 2026-10-31

- Share management-browser state by base adapter across browse roots and regular/flat views, including information visibility, columns, sorting, filters and current navigation.
- Share management filter-panel and remembered flat-mode UI state across roots without changing API browse boundaries or Picker/embedded-collection policies.
- Add regression coverage for cross-root state restoration and retained Picker scoping.

## 4.3.29 - 2026-10-31

- Add an authorised management preview for articles independently of publication dates, article state and category/ancestor state, while retaining public-view rules for ordinary requests.
- Keep native article rendering/template overrides and recheck article management/access permissions before supplying preview data.
- Support separate backend/site sessions through article/user-scoped HMAC grants expiring after five minutes; reject altered, expired, revoked or blocked-user grants.
- Disable preview caching/indexing and referrers, and restore the original request identity after rendering.
- Verify preview grant security and render an existing article in a non-published category against local Joomla without database writes.

## 4.3.28 - 2026-10-31

- Use Location/Tags labels and Joomla-style » separators in information panels, including category and tag ancestry.
- Truncate only the parent portion of narrow Location paths where possible, keeping the final node visible and the complete path in the tooltip.
- Supply a component-owned Not featured label instead of the missing frontend JUNFEATURED translation.

## 4.3.27 - 2026-10-31

- Indicate published articles blocked by an unpublished/trashed category or ancestor, using the same minus-circle icon as expired publication while retaining the native state actions.
- Replace the optional article Category Hierarchy column with the universal Location column and label article Tag Hierarchy as Tags, including featured and tag-based article adapters.
- Show complete location paths with Joomla-style » separators instead of depth markers; retain raw hierarchy-based sorting and keep stored metadata compatible.
- Verify category publication states, column catalog changes and existing address/editor regressions.

## 4.3.26 - 2026-10-31

- Retain complete Selection Addresses in native article link URL slots, restoring typed references, Usage, compound thumbnails and extension properties on reopen.
- Enable visual Usage controls for article links, serialize all addresses before touching native fields and silently rehydrate registered codecs without marking the editor dirty.
- Prepare site article/module links independently of replacement settings: native layouts receive bare URLs with real anchors preserved, while overrides receive optional prepared selections in smartbrowserLinks.
- Reuse public resource resolution, field output and PHP image-presentation providers; add an extensible server-side address reader that retains unknown properties without interpreting extension schemas.
- Verify JavaScript/PHP address round trips, native Joomla URL filtering/validation, template data, ordinary anchors, codec handling and silent editor restoration.

## 4.3.25 - 2026-10-31

- Align file editor Apply/Save as Copy styling with article editors and switch popup Close to Cancel after changes, restoring Close after Apply or Reset.
- Size host extension buttons to match compact preview actions, and show labelled Select-resource-style controls in empty previews without cloning their handlers.
- Separate adapter sections in mixed trees and replace the generic information prompt's entry terminology with resource.
- Explicitly select the native com_content view option for article previews so Joomla uses the template's article overrides even when the outer component option is cached.
- Centre list selection controls, supply an accessible translated Ordering tooltip and use the frontend JSAVE label for rename/local dialogs.
- Verify generic thumbnail capabilities for text/PDF/archive resources while retaining caller profile and access policies.

## 4.3.24 - 2026-10-31

- Give browser information panels their own bounded scrolling viewport, fixed tabs and retained relative scroll position; keep list headings visible while scrolling.
- Sort flat locations by their full hierarchy and expose native sibling-group ordering in flat article browsers without introducing a separate ordering system.
- Place native image tools and text editing in the file editor's main tabs, preserve the Content preview and avoid saving untouched image tools as modifications.
- Correct file-editor labels and fullscreen controls, preserve collapsed selection preferences and reuse host Upload buttons in empty/collapsed previews.
- Allow configured article-link adapters while storing resolved public URLs in Joomla's native link fields; improve empty-selection guidance and unavailable-icon settings.
- Load core language strings from the current Joomla client so embedded frontend selectors do not replace native Save captions.
- Render article preview popups through Joomla's native article view with edit controls disabled and existing access checks retained.
- Add focused sorting, persistence, scrolling, host-action, file-editor, translation and article-preview regression coverage.

## 4.3.23 - 2026-10-31

- Fix the active generic article image-selector bridge to bind Joomla's separate image and figure classes, instead of applying the fix only to the legacy bridge.
- Expose the figure/container class as `media.figureClass`, preserve both class values and write all core image options back to the native Joomla fields.
- Apply separate image/container classes in default field output and retain compatibility with older article forms.
- Remove obsolete icon-settings code that moved Image transparency outside Thumbnail options after visual-settings had positioned it correctly.
- Verify both image slots through the actual generic selector bridge and initialize both Options scripts together in the transparency regression test.

## 4.3.22 - 2026-10-31

- Keep the source hierarchy available in flat browsers, initially collapsed, including switching between Media filesystems and menus.
- Move Picker Select before the heading and Cancel beside its native/fullscreen controls; use Select — Adapter headings.
- Keep native article editors component-only when opened from popup editors, preserving the selected category.
- Hide both duplicated Joomla image/figure class controls while retaining their stored values and the Selection Usage image-class editor.
- Embed Joomla's enabled media-action image tools in the file editor and add bounded UTF-8 text editing with Save, Apply, Save as Copy and Reset.
- Enforce Media ACL, browse scope, content validation and revision checks on file writes; version image presentation URLs without changing canonical addresses.
- Verify picker navigation/results, modern and legacy image fields, text round trips and failures, and native Joomla image tools.

## 4.3.21 - 2026-10-31

- Place Image transparency beside the global thumbnail controls without depending on a generated fieldset ID.
- Supply missing location-depth metadata for flat articles/categories, retaining raw location sorting.
- Use SupJx SmartBrowser only for its Options navigation link, preserving the component identity.
- Visibly distinguish fixed Published/Trashed switches and provide targeted default-state help in English and Greek.
- Paint loading status before expensive list/grid transitions without interfering with network loading state.

## 4.3.20 - 2026-10-30

- Bind article Image Class usage to Joomla's imgclass fields when available, hide the duplicated native control and preserve the separate figure class; retain legacy field compatibility.
- Extend the fixed bottom selection drawer to legacy/resource/usage pickers, reusing the collection renderer without changing returned selection formats.
- Return backend native editor Save/Cancel to the enabled integrated browser when no explicit return URL was supplied; preserve native behaviour when integration is disabled.
- Verify modern/legacy image-class mapping, picker drawer geometry and result contracts, usage profiles, and native editor return/token policies.

## 4.3.19 - 2026-10-30

- Respect explicit creation roles before legacy action-name fallbacks, so contextual New Article in the Category browser stays an ordinary auxiliary button.

## 4.3.18 - 2026-10-30

- Use the flat adapter's actual root-node title for the breadcrumb tooltip (for example All Articles), retaining the original browse boundary rather than substituting the generic browser name.

## 4.3.17 - 2026-10-30

- Label the icon-only flat breadcrumb root with its browser title instead of the regular hierarchy label, retaining existing root presentation.
- Show the Flat View label in frontend toolbars when space permits and collapse it to its tooltip-backed icon during responsive compaction.

## 4.3.16 - 2026-10-30

- Give the resource-list loader a visible accent colour instead of the template's light text colour, with a translated loading message and accessible busy/status semantics throughout slow responses.
- Keep Flat View right-aligned before filter controls arrive, avoiding the initial toolbar jump after loading completes.
- Verify pending and completed backend/frontend resource responses with delayed fixtures.

## 4.3.15 - 2026-10-30

- Keep secondary node creation buttons in the ordinary toolbar style; reserve green styling for primary creation actions.

## 4.3.14 - 2026-10-30

- Restore green creation buttons and consistent Flat View active colours in backend/frontend; use dark Actions-style hover for Flat View and display/fullscreen toggles.
- Show navigation progress before switching flat scopes or view modes, including slow backend page loads.
- Use the regular adapter's full breadcrumb inside flat hierarchy scopes and navigate parent folders in flat mode while preserving the original browse boundary; retain existing root presentation.
- Verify colours, full breadcrumb, parent scope, progress feedback and return-to-regular navigation.

## 4.3.13 - 2026-10-30

- Use a compact Picker heading while retaining normal browser page titles.
- Include surrounding component-template bottom spacing in contained browser height calculations, removing the outer page scrollbar without disabling result scrolling.
- Group native Help with the Joomla escape-hatch button at the right of backend editor toolbars.
- Verify padded Atum picker layouts at multiple viewport sizes and Help/Joomla toolbar alignment in browser fixtures.

## 4.3.12 - 2026-10-30

- Finalize configured unavailable-resource placeholder images through the existing PHP presentation hook, for default output and consumer-composed fragments.
- Rebuild unavailable provider context centrally with null selection, empty Usage/metadata and no original image identity; expose an unavailable flag while retaining visibility policy.
- Preserve no-image output, once-only processing, custom frames/pins and provider rollback; test privacy, trashed resources, hidden output and direct consumer finalization.

## 4.3.11 - 2026-10-29

- Apply the editor's native publishing-field definitions before category reload filtering, matching the displayed Created date format instead of the frontend model's different definition.
- Return reload filtering errors to the editor with unsaved input preserved instead of an uncaught 500, while retaining forbidden-access errors.
- Reproduce the Created date failure using the actual local Joomla calendar output and verify the fix against that runtime without saving an article.

## 4.3.10 - 2026-10-29

- Locate category refresh metadata on Joomla's fancy-select wrapper, and submit category reloads to their explicit reload URL instead of the save action.
- Restore the save task for actual save buttons and set cancel/menu-type tasks explicitly, keeping URL and POST tasks consistent.
- Accept toolbar buttons created in another frame and ignore late toolbar callbacks after a collection is destroyed.
- Exercise the real Joomla fancy-select, category-change and submitform scripts through a captured POST; verify cross-frame toolbar button handlers and teardown.

## 4.3.9 - 2026-10-29

- Remove wrapping labels from enhanced batch destination controls to avoid duplicate mouse activation of their hidden native selects; verify mouse opening, searching and selection.
- Supply the task control expected by Joomla category-change in native frontend article forms when missing, and route SmartBrowser category changes through a dedicated reload action.
- Preserve unsaved article/custom-field/media data during category reload, normalise calendar values as Joomla does, and retain token, permission and checkout checks without saving the article.

## 4.3.8 - 2026-10-29

- Keep only the second action row pinned in normal backend and frontend browsers, allowing the heading, Back and configuration controls to scroll away.
- Give frontend browser headers an opaque background derived from the surrounding page colour and texture; retain complete headers in pickers and focused views.
- Verify both toolbar rows, dynamic template offsets, sidebar handle alignment and fullscreen background restoration in browser fixtures.

## 4.3.7 - 2026-10-28

- Preserve viewport sticky behaviour under clipped frontend template wrappers by temporarily using overflow:clip instead of hidden on non-scrolling ancestors, with restoration on focus/unmount.
- Re-evaluate template headers during scrolling so menus that become fixed after a threshold contribute their current height to browser offsets.
- Verify header, toolbar and handle alignment through forward/back scrolling in a clipped-template fixture and a temporary probe within the actual public Catichisi template; verify restoration of template clipping.

## 4.3.6 - 2026-10-28

- Cover mouse focus and pressed states for Filter Options/Clear as well as expanded filters; verify closed-but-focused Filter retains blue styling until blur.

## 4.3.5 - 2026-10-28

- Give Filter Options/Clear scoped colour states that resist native subhead defaults and the generic browser button palette, including active filters, icon contrast and disabled Clear opacity.
- Verify normal, hover, open, enabled and disabled states with native CSS loaded after the component stylesheet in backend/frontend fixtures.

## 4.3.4 - 2026-10-28

- Separate full-listing sidebar/info rails from their sticky viewport content, keeping both column backgrounds extended to the end of long results instead of ending after one viewport.
- Give the tree-collapse handle its own full-height rail and centre it in the visible area, including collapsed-tree state; preserve contained picker and mobile layouts.
- Check complete rail bottoms against long listing bounds, sticky contents, handle alignment and drawer behaviour in backend/frontend browser fixtures.

## 4.3.3 - 2026-10-28

- Stack the frontend subtitle directly under its title in a compact block beside Back and the display controls.
- Preserve normal transparency while giving focused fullscreen mode an opaque page-derived background with the surrounding texture; restore original host styles when leaving focus mode.

## 4.3.2 - 2026-10-28

- Restore a pale grey-blue Dashboard/Back hover and keyboard-focus state with a subtle border and readable dark text/icons in both backend and frontend headers.

## 4.3.1 - 2026-10-28

- Override the native toolbar's d-flex utility for the two-row layout; move borderless Dashboard/Back before the description and keep both Options links and the dark native-manager button together on the right.
- Standardize browser control heights, restore light-blue Flat View/Advanced controls, blue default hover, dark Actions hover and neutral dropdown hover while retaining green/destructive variants.
- Use a compact transparent frontend header with adjacent title/subtitle and Back, and restore viewport-filling tree/info panels with a measured centred tree handle.
- Add browser checks using the actual native d-flex markup for alignment, heights, colour states and pane geometry.

## 4.3.0 - 2026-10-28

- Unify browser headers across backend, frontend and pickers: two-row sticky native management toolbar, frontend title/icon/subtitle, and caller-aware picker headings with native/display controls aligned above the actions.
- Keep browser controls, independently scrollable tree and information accessible below measured Joomla/template headers, including responsive and focused layouts.
- Move collection picker selections into an always-visible bottom drawer that opens upward, reserves result height and retains scroll position; bound its height on small screens.
- Replace the interim backend count status with the adapter description; preserve action handlers, permissions, picker selection/usage and Add/Replace contracts.
- Add long-list sticky-layout and drawer regression fixtures; verify native controls, responsive bounds, nested pickers, selection usage, public collection workflows and existing search/sort/columns popups.

## 4.2.7 - 2026-10-28

- Expand the SmartBrowser Options label when native toolbar space permits, retaining the accessible icon/tooltip in narrow layouts.
- Show reactive current-listing and selected-resource counts in the backend's lower action row, leaving frontend and picker toolbars unchanged.

## 4.2.6 - 2026-10-28

- Match Atum's native toolbar spacing, keep both Options links right-aligned despite native button margins, and show Flat View text with wider spacing in the remaining backend action row.

## 4.2.5 - 2026-10-28

- Render backend management primary actions in Joomla's native toolbar via Vue Teleport, keeping existing reactive handlers, selection checks and inline fallback for other hosts.
- Always offer authorised users an icon-only SmartBrowser Options link with an accessible tooltip, independent of Dashboard/menu visibility; preserve native component Options and return URLs.
- Verify dynamic toolbar selection state, creation controls, dropdown dismissal, filter placement, responsive wrapping and missing-host fallback in browser tests.

## 4.2.4 - 2026-10-28

- Protect the shared icon viewport from later Bootstrap menu padding utilities and absolutely position both glyph layers, preserving composition and text-baseline alignment at menu and heading sizes.
- Verify the fix against the public site's template CSS and a regression fixture with later important padding rules.

## 4.2.3 - 2026-10-28

- Align the shared identity icon to the text baseline instead of the lowercase midpoint and preserve spacing before adjacent menu labels and headings.

## 4.2.2 - 2026-10-28

- Add the shared folder-and-grip icon to the frontend Dashboard heading, loading its styles and icon font independently of the integration plugin.

## 4.2.1 - 2026-10-28

- Make the shared icon-sb-brand folder-and-grip identity available to frontend menu links through the integration plugin, including Joomla's icon font and native menu spacing compatibility.

## 4.2.0 - 2026-10-28

- Adopt the shared folder-and-grip identity, with a larger inset grip, for administrator navigation, the SmartBrowser dashboard title and Home Dashboard shortcut.
- Label the administrator menu SupJx SmartBrowser without changing extension identities or resource-type labels.
- Place independent menu visibility and Home Dashboard visibility switches in General Integrations below Global Replacement; preserve ACL checks and default the dashboard shortcut to visible.

## 4.1.11 - 2026-10-28

- Move Hide SmartBrowser menu above and outside the Global Replacement frame, preserving independent behavior and simplifying the integration hint in both languages.

## 4.1.10 - 2026-10-28

- Copy resource addresses from the toolbar only for the current selection, disabling Copy when nothing is selected; context Copy uses the selected group or the clicked item.
- Add optional selection scoping to address export while preserving full-collection exports for existing API consumers and collection order.

## 4.1.9 - 2026-10-28

- Keep Hide SmartBrowser menu independent of Global Replacement and individual replacements; display it above the integration hint and clarify both translations.
- Add an ACL-aware SmartBrowser dashboard shortcut to Joomla's Home Dashboard third-party quick icons through the existing integration plugin.
- Cover independent visibility settings, Options ordering, quickicon contexts, result preservation and access checks.

## 4.1.8 - 2026-10-28

- Remove native required validation from the address-paste textarea so its closed dialog cannot block saving the enclosing Joomla editor form; empty imports still use the existing import validation.
- Verify host form validation before and after closing Paste, plus empty/invalid imports, at desktop and mobile widths.

## 4.1.7 - 2026-10-28

- Override Atum's generic details-content padding within the SmartBrowser adapter tree, removing the backend-only gap between the adapter heading and its roots.
- Verify contiguous root placement in a browser with the Atum spacing rule applied.

## 4.1.6 - 2026-10-28

- Derive backend management integration from enabled per-adapter settings and the integration plugin, removing the integrated URL flag while retaining Picker/frontend boundaries and Options ACL checks.
- Use resolved menu titles rather than URL title hints, and distinguish all-menu trees from scoped menus in active sidebar selection and Joomla URL prefix matching.
- Cover enabled/disabled integration, flat adapters, dashboard entry, standalone modes and mutually exclusive menu leaves in regression tests.

## 4.1.5 - 2026-10-28

- Highlight the matching administrator menu and its ancestors for SmartBrowser browser routes regardless of the integrated flag, including dashboard returns.
- Resolve menu identity from the current menu node, falling back to browseRoot for menu-item nodes; cover the reported Hidden Menu/Main Menu URLs and flat menus in regression tests.

## 4.1.4 - 2026-10-28

- Configure an optional public placeholder image, plain-text title and optional Font Awesome icon for unavailable output under Selection options, using Joomla conditional controls.
- Render unavailable selections through the shared Joomla layout with a sanitized placeholder descriptor, no original identity/Usage/private metadata, no links and no original image-presentation providers.
- Preserve global/host visibility inheritance and cover layout overrides, escaping, unsafe settings, disabled assets and input immutability in output tests.

## 4.1.3 - 2026-10-28

- Accept native image JSON strings and already-decoded arrays/objects in article and tag normalization, preserving image URIs and Intro/Full Image fallback without array-to-string warnings.
- Add regression coverage that converts PHP warnings to exceptions and checks malformed values and input immutability.

## 4.1.2 - 2026-10-28

- Locate the transparency control by its Joomla parameter name, including the params prefix, so placement and live background previews work in component Options.
- Document unavailable manual selections that must reach the shared renderer instead of being removed by consumer queries or preparation filters.
- Add per-custom-field Use Global/Show/Hide controls, an effective-value Global label and a reusable tri-state visibility resolver for hosts.

## 4.1.1 - 2026-10-28

- Restore Paste dialog padding and spacing through an explicit body class, without reintroducing a nested form; cover desktop/mobile spacing in the browser regression test.
- Keep the transparency control inside Thumbnail options, scope reset help to its own group and show four native publication-state switches with readable locked states.
- Restore the corresponding administrator menu path when returning to integrated browsers, including scoped menus and flat adapters without a standalone component menu entry.

## 4.1.0 - 2026-10-28

- Keep unavailable selections bulk-selectable and replaceable; optionally render a safe, translated unavailable notice in field output and always flag unavailable/trashed previews.
- Remove nested Paste forms and context-menu Paste commands, load Cancel translations, preserve selections on resolution failure and accept retained unavailable references during collection editing.
- Update list/preview toggling and info-state order; use sort popups, compact access columns, framed tree roots and display-only flat location depth hints.
- Select uploaded media, add menu-item-type sorting/filtering, default tags to ordering and expose configurable default published/unpublished/archived browsing states.
- Add backend Help and article Save dropdown/accessibility controls; popup editors use Close until the first change, then Cancel, while page editors use Cancel. Confirm before dismissing dirty dialogs and retain native editor return context for default list routes.

## 4.0.1 - 2026-10-19

- Standardize Joomla extension names and field-type labels on SuperSoftJx while preserving technical identities and translated plugin group labels.
- Complete author and release-date metadata across all manifests and synchronize package, extension and asset versions.

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
