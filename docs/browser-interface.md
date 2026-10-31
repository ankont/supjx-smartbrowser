# Browser interface and integration

Management browsers remember one state per base adapter across roots and regular/flat
navigation. This changes preference scoping only; API browse boundaries remain enforced.
View preferences now persist in user-scoped localStorage and Joomla user profiles, with
independent caller-scoped Picker state and a global reset covering all view/window preferences.
See [view preferences](docs/view-preferences.md) for caller keys, native scopes and synchronization.
Browser information tabs stay visible above an independent scrolling body. Its relative
scroll position is retained when changing resources. List headings remain visible while
scrolling. Flat Location sorting uses the full hierarchy; persistent ordering continues
to use each adapter's native sibling groups (no artificial file/user ordering is stored).
Location paths use » separators without indentation. Article columns use Location instead
of Category Hierarchy and label Tag Hierarchy as Tags. Published articles blocked by an
unpublished or trashed category/ancestor use the expired-publication icon and explanatory text.

File editors keep Content as a read-only preview and expose text editing or the enabled
Joomla image tools in the main tab bar. Opening image tools alone does not modify a file.
Article links always support Direct Links, with Articles and Menus enabled by default;
additional adapters can be selected below Article links layout. Only resources with a
public URL can be written to native article links. Since 4.3.26 those fields retain full
Selection Addresses, including identity, thumbnail overrides and registered extension
properties. The enabled system integration plugin strips only recognized structured
fragments from render-time URLs; ordinary anchors remain intact. Optional template data
are available in `$item->smartbrowserLinks` (see [field output](docs/field-output.md)).
Article preview popups reuse native Joomla rendering and access checks with native editing
flags disabled. Custom overrides should respect those flags. Embedded frontend selectors
retain the frontend's core language strings.
Authorised article management previews can render non-public article/category states.
Backend links carry a five-minute article/user-scoped signed grant across Joomla client
sessions, rechecking current permissions on opening. Unsigned public requests retain
Joomla's normal publication rules; preview requests do not change stored publication state.

Backend management browsers automatically use the corresponding native title and Options
when that adapter's integration is enabled. The integration system plugin must be enabled;
no `integrated` URL parameter is needed. Picker, embedded collection and frontend integration
policies remain unchanged. Administrator menu highlighting follows the actual browse
scope: an unscoped menu browser selects All Menu Items, while `browseRoot=menu:...`
selects only that specific menu and its parent navigation group.
General Integrations, below Global Replacement, independently controls the administrator menu
and the Home Dashboard shortcut (shown by default to authorised users in the 3rd Party group).
The administrator menu is labelled SupJx SmartBrowser; the shared folder-and-grip icon also
appears in the SmartBrowser Dashboard title and Home Dashboard shortcut.
For frontend menu items, set Joomla's Link Icon Class to `icon-sb-brand`.
The enabled integration plugin supplies the shared icon styles and Joomla icon font.
Backend management pages use two rows in Joomla's sticky toolbar: Dashboard, browser description
and configuration/native-manager links above, then creation actions, Actions,
Advanced and filters below. Frontend pages use the same two-row header with a page title,
adapter icon, compact stacked subtitle and display controls. In normal backend/frontend
pages the first row scrolls away; only the second action row and resource toolbar stay pinned.
Frontend headers copy the surrounding page background onto an opaque base so results
cannot show through. Focused fullscreen mode uses that background for the whole browser
and restores the host styles on exit. Pickers and focused views retain their complete headers.
Picker headings use their caller's title/subtitle.
Full-height tree and information rails extend to the end of the listing, with sticky,
independently scrollable content below the host's header. The collapse handle stays centred
in the visible part of its own rail. Focused frontend views and pickers scroll results
within their available viewport.
Flat views retain their existing root title/icon; inside a hierarchy they show the
regular adapter's breadcrumb and parent links keep flat mode and the original browse boundary.
View changes show progress before navigation.
Frontend sticky offsets track template menus that become fixed during scrolling. For
non-scrolling ancestors that use overflow:hidden, the mounted browser temporarily uses
overflow:clip to preserve clipping without creating a false sticky scroll container;
original inline styles are restored when leaving that context or destroying the browser.
SmartBrowser
Options is a toolbar link with a tooltip and a label that expands when space permits, independent of menu/dashboard visibility,
and remains restricted to users with the component's configuration permission.
All pickers keep Selected resources at the bottom as an always-visible drawer header.
The drawer opens upward, reserves height instead of covering results, and scrolls its own
content. Browser headers show the adapter description.
Technical identifiers and PHP namespaces retain `SuperSoft`; `SuperSoftJx` is the display brand.
