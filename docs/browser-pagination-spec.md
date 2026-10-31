# SmartBrowser Browser Pagination

Status: planned; not implemented.
Date: 2026-10-28.

## Goal and scope

Offer administrator-controlled pagination for large resource listings, reducing
initial loading and rendering costs without changing existing selection storage.
This applies to hierarchical and flat browsers, grid and list presentations,
backend and frontend, and browser pickers. Flat view is not the only target.

This specification does not introduce pagination of the stored Selection View
collection. It does cover browsing resources when adding or replacing selections.
Do not implement this feature as part of recording this specification.

## Current architecture

- `ResourceApi.getResources()` requests the current listing without pagination.
- `createBrowserState.load()` waits for that response and replaces the listing.
- Grid/list components render all supplied resources.
- Several database adapters explicitly request unlimited native model results.
- Media currently obtains a folder listing through Joomla's Media API and
  normalizes its resources. The generic flat adapter traverses its source hierarchy.

Image lazy loading alone does not address these costs. Hiding or slicing results
after retrieving and enriching every resource does not constitute server pagination.

## Configuration

Add a Loading group to the component's Browsers settings:

- Pagination: administrator opt-in; disabled by default for compatibility.
- Page size: configurable, initially proposed default 50.
- All: preserves the existing unpaginated behavior.

When pagination is enabled, expose page size in Filter Options rather than adding
another permanent toolbar control. The administrator must control whether All is
available when pagination is enabled; the exact options and allowed sizes remain
an implementation decision to confirm before development.

Reuse existing configuration, browser state and preference mechanisms. Do not add
a parallel selection or storage system. Existing callers must remain compatible.

## User interface

Use a compact previous/next control with a visible range and total, for example:

    ‹  1–50 of 438  ›

- With the tree visible, place it at the bottom of the tree/sidebar column,
  separated from the hierarchy by a subtle rule. It navigates the central result
  listing, not the tree. Accessible labels and tooltips must make that clear.
- Keep tree scrolling separate so a long hierarchy does not push the control
  out of the sidebar viewport.
- With the tree hidden, in flat mode, or when a responsive layout removes the
  sidebar, place the same control below the grid/list. Render only one instance.
- Do not put pagination arrows on the left/right edges of the results: they can
  be confused with the existing tree-collapse arrow.
- Do not consume additional space in the already crowded frontend toolbars.
- Use the same behavior in backend and frontend, grid and list.
- Hide pagination controls in All mode. For an enabled single-page result, retain
  the range/total with disabled arrows; empty results show an appropriate empty state.

Disable Previous on the first page and Next on the last. Show loading feedback
and prevent duplicate page requests while a transition is pending. Provide
translated accessible button names, keyboard operation and a result-status
announcement. Do not move keyboard focus unexpectedly on successful loading.

On page changes, scroll the results viewport to its start without scrolling the
whole frontend page or resetting the tree's scroll position.

## Data retrieval and adapter responsibilities

Extend the existing resource-list API and adapter infrastructure. The response
must identify the returned page/range, page size and total accessible matches.
The precise request/response field names are to follow repository conventions
when implementing; no new endpoint is required solely for pagination.

- Apply access policy, browse scope, filters, search and sorting to the complete
  eligible dataset before choosing a page.
- Use deterministic ordering with a stable identity tie-breaker. Preserve existing
  node/item grouping unless an intentional behavior change is agreed separately.
- Database adapters should use native Joomla model/query pagination where possible.
  Avoid fetching, normalizing and decorating all rows before slicing.
- Media may initially retrieve the complete lightweight folder listing and paginate
  afterward if its provider cannot page. Defer expensive normalization, decoration
  and presentation work where feasible. This improves rendering but cannot promise
  faster directory enumeration; measure local and remote providers separately.
- Flat adapters must avoid repeating an expensive full hierarchy traversal for
  every page. Investigate source-specific queries or reuse of existing caching
  facilities, with appropriate permission, filter and content invalidation.
  Do not silently present slicing after full traversal as equivalent performance.
- The sidebar tree, breadcrumbs, action definitions and filter-option catalogs must
  remain complete for their intended scope; do not derive them from the current
  resource page alone.
- Counts must not reveal resources the user cannot access.

## Search, sorting and state

Search, sorting, filters, page size, adapter and browse-root changes reset to the
first page. They must act on all matching resources, not just loaded results.
Maintain the existing grid/list and column preferences. Reuse browser navigation
state for page position where appropriate; exact persistence policy is to be
confirmed rather than introducing new durable identifiers.

Ignore or cancel superseded responses so rapid navigation cannot replace a newer
listing with an older page. On failure, retain the previous valid listing and
selections, report the error and allow retry. Handle totals shrinking after edits
or deletion by moving to a valid page without a reload loop.

## Selection and actions

- Select All and Invert Selection operate on eligible resources on the current
  page, with labels/help that communicate this scope.
- Selections survive page changes within the same browser context. Preserve
  existing adapter/root and picker selection-policy boundaries.
- Retain the descriptors needed by selected resources on other pages. Selection
  counts and actions must not silently discard those resources.
- Toolbar and context actions follow existing selected-group/clicked-item rules.
  Copy addresses includes only selected resources, including retained off-page
  selections; it must not export the whole listing.
- Do not introduce an implicit Select All Across All Pages action.
- Preserve single-select, maximum-selection limits, homogeneous collections,
  readonly constraints and per-resource permissions.
- Picker confirmation and Add/Replace workflows must retain off-page selections
  and Selection Usage/metadata without changing their persisted representation.
- Before enabling pagination, define and test ordering actions at page boundaries.
  Reordering must preserve the underlying collection/parent scope and cannot use
  the visible page as if it were the complete ordering domain. Do not silently
  change the scope of advanced Sort or other bulk actions.

## Validation and rollout

Measure representative large folders and database listings before implementation:
server retrieval/enrichment time, response size, time to first usable results,
rendering cost and DOM size. Include hierarchical and flat browsing.

Focused automated coverage must include:

- First/middle/last/empty pages, exact page-size boundaries and changing totals.
- Global search/filter/sort correctness, stable ordering and permission-safe totals.
- Selections across pages, page-scoped Select All/Invert, Copy, actions and picker
  confirmation, including Add/Replace and retained Usage/metadata.
- Failed, duplicate, cancelled and out-of-order requests.
- Ordering boundaries and refresh after uploads, edits and deletions.
- Backend/frontend and picker boundaries; grid/list; visible/hidden tree; flat mode;
  mobile widths; one pagination control; focus, status announcements and scrolling.
- Pagination disabled and All mode compatibility.

Implement incrementally by adapter capability, clearly documenting any Media/flat
performance limitations. Do not enable an adapter path until its paging, counts,
selection and action semantics are correct. No release/version bump is required
for this planning document alone.
