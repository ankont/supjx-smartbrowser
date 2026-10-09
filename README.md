# SuperSoftJx - SmartBrowser

SmartBrowser is a Joomla resource browser for articles, categories, tags, menu items, users, and media. It combines tree and flat navigation, grid and list views, contextual details, filtering, selection, editing, and batch operations in one interface. It runs in the administrator and site applications, subject to Joomla permissions.

## Requirements

- Joomla 5 or 6, with a supported PHP version for that Joomla installation.
- A modern browser with JavaScript enabled.
- Node.js and PowerShell are needed only to build the package from source.

## Installation

1. Download the latest `pkg_smartbrowser-v*.zip` release package, or build it from source.
2. In Joomla, go to **System > Extensions > Install** and upload the package ZIP. Install the outer `pkg_` ZIP, not one of its component or plugin ZIPs.
3. Open **Components > SuperSoftJx - SmartBrowser** to use the standalone Dashboard.
4. To replace native administrator manager links, enable the **System - SuperSoftJx - SmartBrowser Integration** plugin and select the desired replacements in **SmartBrowser Options > Integrations**. All replacements are off by default.

The package installs `com_smartbrowser`, an optional system integration plugin and the optional SmartBrowser Picker custom-field plugin. Native Joomla data remains in its existing components and Media providers. Joomla ACL is enforced by the adapters; access to one adapter does not imply access to the others.

## Features

- Articles, categories, tags, articles by tag, menus, users, and media adapters.
- Tree and flat views, scoped browsing, grid and configurable list columns, filters, sorting, and item details.
- Selection and edit workflows, plus adapter-specific batch actions. Media batch actions include copy/move, rename, and ZIP creation.
- Optional replacement of administrator links for Articles, Categories, Tags, Media, Menus, Users, and Featured Articles. The original Joomla manager remains reachable from the browser.
- Optional Media field picker integration and separate administrator/site editor-display settings.
- English and Greek interface translations.

Configure display, related-content, and integration settings in **SmartBrowser Options**. The integration plugin must be enabled for the built-in manager-link and field-picker replacements; third-party extensions can invoke the picker directly. SmartAuthors-specific user-field integration is used only when SmartAuthors is installed and enabled.

## Use from another extension

The `com_smartbrowser.picker` web asset exposes `window.SmartBrowserPicker.open(config)` to Joomla pages. Your extension can use this picker without enabling the optional manager-link integration plugin. Load the asset and supply a browser URL for the current Joomla application:

```php
use Joomla\CMS\Uri\Uri;

$assets = $document->getWebAssetManager();
$assets->getRegistry()->addExtensionRegistryFile('com_smartbrowser');
$assets->useStyle('com_smartbrowser.app')->useScript('com_smartbrowser.picker');
$document->addScriptOptions('com_smartbrowser.picker', [
    'url' => Uri::base() . 'index.php?option=com_smartbrowser&view=browser',
]);
```

Then open the picker from your own button or field handler:

```js
const article = await window.SmartBrowserPicker.open({
  adapter: 'articles',
  selectionTarget: 'item',
  allowedResourceTypes: ['article'],
  multiple: false,
});

if (article) {
  // For example: set your field value to article.id.
  console.log(article.id, article.title);
}
```

`open()` resolves to one resource, an array when `multiple: true`, or `null` when the dialog is dismissed. Resources include `id`, `type`, `kind`, and `title`; adapter-specific data is in `metadata`. Use the resource ID as an opaque value unless your extension explicitly depends on that adapter's ID format.

Media resources keep their provider identity separate from field output. Their metadata includes `filesystem`, `filesystemPath`, `relativePath` when the URL is local, `url`, MIME type, and available image dimensions. The picker asset also exposes `window.SmartBrowserMediaValue`:

```js
const image = await window.SmartBrowserPicker.open({
  adapter: 'media', selectionTarget: 'item', allowedResourceTypes: ['image'],
  initialValue: existingFieldValue,
});
if (image) {
  const fieldValue = window.SmartBrowserMediaValue.format(image, 'joomla');
  const plainPath = window.SmartBrowserMediaValue.format(image, 'path');
  const url = window.SmartBrowserMediaValue.format(image, 'url');
}
```

`format(resource, 'resource')` returns the unchanged resource. `parse(value)` returns the plain path, filesystem, filesystem path, resource ID, and dimensions from a native Joomla Media value; plain paths and URLs remain valid inputs. `initialValue` opens an existing native Media value in its provider folder and focuses the matching resource. The native Media-field integrations use `joomla` output for images, while non-image files and consumers requesting `path` or `url` retain plain values. A plain path alone cannot identify an arbitrary remote provider; use the native value when provider identity must survive a round trip.

Common options are `adapter` (`media`, `articles`, `categories`, `tags`, `articles-by-tag`, `menus`, or `users`), `selectionTarget` (`item`, `node`, or `both`), `multiple`, `allowedResourceTypes`, `browseRoot`, and `defaultView` (`grid` or `details`). For example, `browseRoot: 'category:42'` constrains an article picker to a category subtree; a Media picker can use a provider path such as `local-images:/lessons`. The selected user must have the relevant Joomla permissions. The picker also accepts an explicit `url` if your hosting page needs a different site or administrator browser route.

For a full-page browser, link to `index.php?option=com_smartbrowser&view=browser&adapter=articles&mode=select` in the appropriate Joomla application. If you host that page yourself, it dispatches `smartbrowser:select` with `event.detail` containing `{ adapter, mode, resources }`; the picker above handles that event and dialog lifecycle for you.

### Picker Selection Profiles (2.1)

Selection identity, resource capabilities, caller policy and usage values are
separate. Existing callers still receive one resource, an ordered array, or `null`;
usage is never appended to a resource descriptor or saved by SmartBrowser.

```js
const result = await SmartBrowserPicker.open({
  adapter: 'media', multiple: true,
  initialSelection: ['local-images:/cover.jpg', 'local-files:/report.pdf'],
  selectionProfile: {
    'media.alt': { presentation: 'primary' },
    'media.decorative': { presentation: 'primary' },
    'media.loading': { presentation: 'secondary', default: 'auto' },
    'visual.thumbnailOverride': { presentation: 'primary' },
  },
  initialUsage: {
    'local-images:/cover.jpg': { 'media.alt': 'Cover illustration' },
    'local-files:/report.pdf': {
      'visual.thumbnailOverride': { adapter: 'media', id: 'local-images:/cover.jpg' },
    },
  },
  resultFormat: 'usage',
});
// null on dismissal; otherwise:
// result.selection = the unchanged resource(s), in selection order
// result.usage[resource.id] = that resource's applicable usage values
```

`initialSelection` accepts ordered canonical IDs or normalized resources. It is
resolved through the existing adapter collection endpoint, including ACL and
browse-root restrictions; inaccessible references are not selectable. Without
`initialSelection`, `initialValue` retains the existing Media location/focus
behaviour. Single selection uses only the first initial identifier. A profiled
picker retains selected resources and their usage across folder navigation.

`selectionProfile` is a JSON-safe map keyed by capability ID. Only requested keys
supported by the focused resource appear. An empty/missing profile produces no
usage UI. Policies accept `required`, `default`, `presentation` (`primary`, the
default, `secondary` or `hidden`) and `constraints`. Constraints support `minLength`,
`maxLength`, `pattern`, `min`, `max`, `integer` and `allowedValues`; they supplement,
not weaken, the provider's validation. Unknown/inapplicable capabilities are
ignored, including required ones. Defaults initialize values only; initial and
edited values take precedence. Validation checks all selected resources, including
ones outside the current folder, and focuses the first resource with an invalid
visible field.

`presentation: 'hidden'` explicitly suppresses an option's editor, not its value
or validation. Initial values still override profile/provider defaults, and hidden
values are returned in usage. For example:

```js
'media.loading': { required: true, default: 'lazy', presentation: 'hidden' }
```

A profile with only hidden applicable options does not force the Info pane open or add
a Usage options tab. Invalid hidden values (including missing required values)
block completion with a visible profile-configuration error rather than an
invisible field error. Hidden custom capabilities do not require a mounted editor;
their generic validation and any registered custom validator still run.

The existing Info pane shows Information / Usage options tabs when applicable,
keeps its existing preview and collapses secondary fields. It edits the focused
resource without selecting it or changing the Selection UI. Profiled picker Info
visibility is transient; forcing or toggling it never changes remembered browser
Info preferences. `resultFormat: 'usage'` explicitly opts into `{ selection, usage }`.
Omit it to retain the existing result shape. `onSelect` receives the same shape as
the returned promise. Direct selection events retain `{ adapter, mode, resources }`
and include `usage` plus `pickerInstance` for managed picker instances.

#### Provider Capability Contract

Adapters/providers may add an optional `selectionCapabilities` array to any
resource they already return from `getResource()` / `getResources()`. Existing
action permissions remain in `capabilities`; do not put usage definitions there.
Availability is determined by each resource's native type/kind/MIME, not by the
caller. No Picker core changes are needed for another adapter's definitions:

```php
$resource['selectionCapabilities'] = [
    [
        'key' => 'example.displayLabel', 'type' => 'string', 'editor' => 'text',
        'label' => 'PLG_EXAMPLE_DISPLAY_LABEL',
        'description' => 'PLG_EXAMPLE_DISPLAY_LABEL_DESC',
        'default' => '', 'validation' => ['maxLength' => 160],
    ],
];
```

Keys and custom renderer/action IDs must be namespaced (`vendor.property`).
Supported value types are `string`, `boolean`, `number`, `resource` and `object`
(for custom editors). Built-in editors are `text`, `textarea`, `boolean`, `select`,
`number` and `resource`. Select definitions supply `options: [{ value, label }]`.
Providers load their own translation keys and optional JavaScript assets through
Joomla; labels/descriptions may also be literal text.

The Media adapter declares `media.alt`, `media.decorative` and `media.loading`
(`auto`, `lazy`, `eager`) only for images. All selectable resources expose
`visual.thumbnailOverride` and `visual.iconOverride`, independently of adapter/MIME.
Thumbnail override uses the generic `resource` editor: Automatic maps to
`null`; Custom opens the existing Picker with the definition's `picker`
configuration (`adapter`, `selectionTarget`, `allowedResourceTypes`, optional
`browseRoot`). `pickerLabel` can customize its button label. Initial, changed
and cleared references follow the same path. Nonempty references are re-resolved
through the adapter before completion; inaccessible, non-image or folder
references fail PDF thumbnail validation. The result contains **only**
`{ adapter, id }`, never title/image metadata, HTML or markup. Other resource kinds
can reuse this editor with their own picker constraints.

#### Custom Editors And Preview Actions

Register extensions on the calling page before opening the picker:

```js
const unregisterEditor = SmartBrowserPicker.registerUsageEditor('example.editor', {
  mount(container, context) {
    // Use container.ownerDocument; context contains id, definition, resource,
    // value, values, setValue(value), translate and an AbortSignal.
    // Return { update({ value, values }), destroy() } for updates and cleanup.
  },
  validate(value, { definition, resource, values }) {
    return null; // or an error message/language key; async is supported
  },
});
const unregisterAction = SmartBrowserPicker.registerPreviewAction({
  id: 'example.preview', label: 'PLG_EXAMPLE_PREVIEW', icon: 'fas fa-edit',
  applies: ({ resource, profile }) => Boolean(resource.selectionCapabilities?.length),
  async run(context) {
    // resource, profile, values, getValues(), setValue(key, value),
    // previewElement, signal, refresh(), selectResource(pickerConfig).
    // setValue is bound to this resource, even if focus later changes.
  },
});
```

Both APIs return unregister functions. Duplicate IDs are rejected. Custom editor
instances are destroyed on resource/tab changes and unmount; preview action
signals are aborted on focus changes and unmount. Providers must clean up their
own listeners/widgets, respect the signal and implement `update` when their UI
depends on changing values. Missing custom renderers are visible errors and block
completion. No crop feature is built into this mechanism.

Profiles, usage and extensions are passed through a same-origin, iframe-bound
instance context, not URL JSON or shared global selection state. Nested and
parallel pickers use isolated instance identifiers and cannot consume each other's
selection events. Closing a picker releases its host listener and context.
Extensions should still validate usage before their own server-side persistence;
client validation is an editing aid, not an authorization boundary.

Browser regression fixture: `node tests/serve-picker-fixture.mjs`, then run
`tests/picker-profiles.browser.mjs` with a Playwright page. The fixture uses the
built production renderer and mock adapter responses. Set
`SMARTBROWSER_TEST_JOOMLA_ROOT` to a local Joomla web root for styles/fonts (defaults
to `../joomla`). It covers nested PDF selection,
per-resource multiple usage, persistence, custom editors/actions and mobile layout.

### Visual Decoration Plugins

SmartBrowser consumes the generic Joomla `smartvisuals` plugin group and dispatches
`onSmartVisualsDecorateResources`. This works in both the site and administrator
applications and does not require the optional system integration plugin. The
event is dispatched once per resources response, including roots and collections.
Its arguments are `resources` (the authorised native resource descriptors) and
`decorations` (initially an empty map keyed by resource ID).

Adapters build their native data first, including Joomla article Intro/Full Images
in `resource['image']`. Providers receive these existing values and can supply a
fallback only when an image is empty. SmartBrowser does not know providers' site-
specific rules or custom fields. With no enabled provider, or no decorations, the
base resources remain unchanged. Valid nonempty decoration values replace the
corresponding native visual fields; this merge precedence is unchanged.

Return decorations keyed by the opaque resource ID. In a Joomla plugin class implementing `SubscriberInterface`, query custom-field or extension data for the whole `resources` batch rather than once per item:

```php
use Joomla\Event\Event;
use Joomla\Event\SubscriberInterface;

public static function getSubscribedEvents(): array
{
    return ['onSmartVisualsDecorateResources' => 'decorateResources'];
}

public function decorateResources(Event $event): void
{
    $decorations = $event->getArgument('decorations');
    $resources = $event->getArgument('resources');
    $visuals = $this->loadVisualMetadata($resources); // Provider-specific batch lookup.

    foreach ($resources as $resource) {
        $visual = $visuals[$resource['id']] ?? [];
        if (empty($resource['image']) && !empty($visual['image'])) {
            $decorations[$resource['id']]['image'] = $visual['image'];
        }
        if (!empty($visual['badgeIcon'])) {
            $decorations[$resource['id']]['badgeIcon'] = $visual['badgeIcon'];
        }
    }

    $event->setArgument('decorations', $decorations);
}
```

Each decoration can set `image` (a relative path or HTTP(S) URL), `icon` (the base icon's CSS classes), `badgeIcon` (the identity icon's CSS classes), and `badges` (additional passive status overlays). Plugins supply assets and state; appearance is configured centrally in SmartBrowser Options. Presentation fields in a plugin decoration are ignored.

```php
$decorations['category:7'] = [
    'image' => 'images/categories/news.png',
    'badgeIcon' => 'fas fa-newspaper',
];
```

Each additional `badges` entry needs a unique `id`, `label`, `icon` or `image`, and optional `tone` (`neutral`, `success`, `warning`, `danger`, `info`, `muted`, `expired`, `pending`). Badges appear in the grid and in list views with an overlays-enabled status column. Built-in status and actions cannot be replaced through this event; `action`, `capabilities`, and other fields in a decoration are ignored. Use a plugin-specific badge ID to avoid collisions with built-in overlays.

### Resource appearance

General appearance has separate Nodes and Items profiles, shared by frontend and administrator. Each adapter can override either profile independently; flat views inherit their source adapter. Plugins still supply only `icon`, `badgeIcon`, `image` and passive status badges.

Each nodes/items profile contains one ordered list of appearance rules. Each rule chooses an asset, selection priority, placement and size; badges additionally choose an anchor region. Lower numeric priorities are evaluated first, with row order breaking ties. Each asset and each position can be used once. Missing assets and occupied positions do not reserve anything. The first row appears in front; lower rows appear behind. Center, each Corner and each Badge corner are distinct positions. Empty lists remain empty; new profiles start with Icon at Center, Medium. Class controls remain hidden for items.

Add/remove buttons edit the list; up/down buttons change paint order without changing selection priorities. Rules selected by the preview are highlighted. Side-by-side previews sit between the nodes and items controls, with temporary asset checkboxes. Preview availability is not saved. Adapter drawers inherit general rules until edited, with a reset-to-inheritance command.

Every visible asset uses these placement modes:
- Hidden.
- Center.
- Corner (no frame).
- Badge (white frame), attached to one of the other assets.

Small / Medium / Large / Maximum are 25% / 50% / 75% / 100% for centered and corner assets. Badges use a smaller 15% / 20% / 25% / 30% scale in grid views. Compact visuals retain the existing legibility promotions. New rules never automatically move Corner to Center: add an explicit alternative rule instead. Grid corners use a 2.5% margin and center the glyph inside a shared square frame. Status overlays stay inside the tile and never affect positioning. Per-layer CSS variables live in one scoped stylesheet, not element style attributes. Legacy profiles remain readable and convert to rules when edited. Image background/transparency is one global Display Preferences option (Automatic by default), shared by frontend and backend.

Corners can be top left, top right, bottom left or bottom right. Badges attach to Center or a chosen Corner position and follow whichever asset wins there. Contained images use their actual visual bounds. Badge-to-badge attachment is not offered, preventing cycles. If the chosen position is empty, the badge uses the full tile as its reference frame.

Up/down buttons physically reorder paint layers; numeric priority determines the first eligible rule. Status overlays, selection and hover remain independent. On narrow screens each rule's controls scroll horizontally instead of wrapping to another line.

Image background remains Automatic / Transparent / Checkerboard. Automatic preserves real transparency for identity images and uses checkerboard for actual image-file resources. The separate file-preview dialog is unaffected.

Grid, list, tree and information-panel visuals share one renderer. Compact visuals promote Small/Medium to Large and Large/Maximum to Maximum without modifying saved settings; badges retain their separate compact scale. List images require thumbnails; the tree remains icon-only and preserves open-folder state. Each profile has a live preview with temporary asset-availability checkboxes. Adapter drawers show inherited rules immediately and create an independent profile override on editing.

Saved 1.6.1 independent-asset settings are mapped into both profiles as a starting point. Plugin event arguments and the asset/status contract are unchanged.
# Embedded Collection View (1.7.0)

### Article Creation Defaults

Consumers can feature-detect
`FrontendEditorService::supportsArticleCreateDefaults()` and open the frontend
article editor with `type=article&id=0&catid=32&sbCreateDefaults=...`.
`sbCreateDefaults` is a URL-encoded JSON object, decoded once by Joomla input:
`{"title":"Prayer","alias":"prayer_12","catid":32,"language":"*"}`.
Only title/alias (strings, up to 255 Unicode characters), catid (positive JSON
integer), and language (`*` or a language tag up to 7 characters) are accepted.
The complete JSON is limited to 4096 bytes; unknown keys and invalid values are
rejected with HTTP 400. The payload category must agree with a supplied positive
URL catid. If URL catid is absent, the payload category becomes the native model
context. Explicit core.create permission in that category is required (HTTP 403
otherwise), without site-specific permission fallbacks for this entry point.

Defaults apply only on the initial GET of a genuinely new, empty article form.
Existing articles, populated forms, native draft state and matching validation
failure state are not overwritten. Language choices remain constrained by the
native form. Native validation, publishing permissions and Save/Apply/Cancel
remain in place; opening the URL never saves or publishes anything. Validation
failure restores the user's category for the normal ACL check, not the original
defaults. Save submissions never read or apply sbCreateDefaults.

### Frontend Display Modes

Resource images optionally use the enabled SmartCrop plugin's
`SmartCropHelper::getFocalPointAndScale()` presentation. Native article media
URI fragments are retained; crop is resolved after visual decorations so an
image replacement cannot inherit another image's crop. The shared resource
renderer clips the existing image layer using scoped CSS variables, without
extra wrapper markup or inline styles. Without the helper, an enabled plugin,
or valid crop data, image rendering remains unchanged.

The full frontend browser (not embedded collections or iframe pickers) has a
top-right display control cycling normal -> wide -> focus -> normal. Wide mode
removes width limits on the component's ancestor containers; focus mode moves the
existing mount temporarily to a viewport-filling surface, covering page chrome
and making the surrounding page inert. No browser data or selection is reset.
Escape restores normal mode unless a dialog is open. Original DOM position and
attributes are restored on exit/unmount. Frontend editors are unchanged.
The last chosen mode is remembered in localStorage for this site and browser.
Unmount restores the page without overwriting that preference. If storage is
unavailable or contains an invalid value, the browser starts in normal mode.

Templates can listen for the bubbling, cancelable `smartbrowser:display-mode`
event with `{mode, previous, container}`. Calling `preventDefault()` opts out of
the generic layout implementation for that transition; the template must then
apply its own mode and handle `normal` restoration. This hook supports custom
template layouts without hardcoded template selectors in SmartBrowser.

Appearance badge anchors target configured regions (`center`, `corner:top-left`,
etc.) or `item` (Frame, the full visual square). They follow whichever asset wins
that region, including fallbacks. Missing regions fall back to Frame. Legacy asset
anchors migrate to their first configured region. Corner visuals use a 3% inset
where their size leaves room.

Rules store numeric `priority` (lower values are tried first); their array order
determines paint order (first row appears in front). Version 2.0.0 performs a
one-time component installer upgrade from earlier versions: old array indices
become priorities and old `z` values determine the new stable array order. This
includes both general nodes/items profiles and every adapter override. New
settings are not migrated during normal loading.

Native SmartBrowser icons use Joomla's Font Awesome classes, including file-type
icons for media, boxes for categories, newspapers for articles, tags for tag
nodes, hashtags for the tag adapter and distinct user-group open/closed symbols.
Plugin and menu-supplied symbols remain untouched. Tree roots always display the
adapter symbol; the first breadcrumb displays the open-node symbol. Featured
article navigation retains its special star identity.

The Icons options tab stores optional `icon_profiles` overrides per adapter for
adapter, closed node, open node and item icons, plus media file-type icons. Empty
values inherit native defaults; reset buttons clear individual overrides. Inputs
accept Font Awesome class pairs and display an immediate preview. Configuration
is normalized and cached once per PHP request. Native overrides are applied
before SmartVisuals decorations, which retain precedence. Special menu symbols,
menu identity badges and unrelated contextual resource types remain unchanged.
The same descriptors and decoration pipeline serve frontend, administrator and
collections, without extra network requests or a second rendering mechanism.

Native media-field integration uses the configured location as the initial node,
not as a browse boundary. Other configured filesystem roots remain visible and
the image-only selection restriction still applies. Existing selected media takes
precedence when choosing the initial location. Picker assets declare their dialog
dismiss dependency in both registry and fallback registration. Administrator menu
editor returns survive Apply, Save as Copy and validation-error reloads.

Resource activation: in Manage mode file/article items default to Edit; Ctrl (or
Cmd) + double click opens Preview where available. Selection mode retains Select
as its default. Navigable folders retain Open. File Edit uses the existing
Save/Apply/Save as Copy form, while Preview is view-only. Articles and tags open
native frontend component-only content in a popup; Joomla frontend publication
and access rules still apply (an unavailable/unpublished page may show a native
Joomla message rather than content).

An integration can display an ordered selection without mounting browser navigation.
The original identifier-list API uses one adapter; the opt-in reference-entry API also supports mixed collections. Load the public assets from a Joomla view:

```php
\Joomla\CMS\Factory::getApplication()->bootComponent('com_smartbrowser');
\SuperSoft\Component\Smartbrowser\Administrator\Support\CollectionViewSupport::prepare($document);
```

Mount after the collection module has loaded (or listen for the document event
`smartbrowser:collection-ready`):

```js
const collection = SmartBrowser.mountCollection('#selected-resources', {
  adapter: 'articles',
  items: [12, 45, 81],
  allowRemove: true,
  allowOrdering: true,
  contextActions: false,
  readOnly: false,
  layout: 'grid', // also 'details'
  onChange: ({ items, reason }) => saveOrderedSelection(items),
});
await collection.ready;
await collection.setItems(updatedIdentifiers);
await collection.refresh();
const identifiers = collection.getItems();
collection.destroy();
```

The module `media/com_smartbrowser/js/collection.js` also exports `mountCollection`.
An optional `onAdd()` callback exposes the common toolbar Add button before Remove; it may open the existing Picker and update the collection. The button is omitted in read-only views or without a callback. `addLabel` can override its translated tooltip. Compact and empty collections also expose this action when supplied.
Every container has its own state, renderer, transport and listeners. `destroy()`
aborts pending requests and removes owned dialogs/listeners. `onError(error)` handles
initial resolution failures; `ready`, `setItems()` and `refresh()` return promises.

Identifiers are normalized to SmartBrowser IDs (`article:12`, `category:12`, etc.).
Media paths must already use canonical IDs. The API accepts up to 500 references,
preserves order and deduplicates first occurrences. `setItems()` also accepts the
resource objects returned by the normal picker and is silent to prevent update loops.
Missing/inaccessible references retain their IDs and display an unavailable card.

User removal/reordering invokes `onChange` and emits the bubbling container event
`smartbrowser:collection-change` with `{adapter, mode, items, resources, reason}`.
The host persists `items`. Ordering reuses SmartBrowser's move buttons and block-move
algorithm but never writes native Joomla ordering. Other sort fields affect only
presentation; move buttons require collection-order sorting.

Context actions are opt-in and checked against adapter capabilities. Only relevant
resource actions are enabled by default, not navigation, native reorder, copy/move
or identifier-changing rename. `contextActionIds` may explicitly narrow/override that
allowlist. Read-only mode disables all membership changes and context actions.
Grid/Details, ResourceVisual, metadata, plugin decoration and existing action dialogs
are shared with the full browser; no integration-specific renderer is required.

### Reference Collections

The core ordered collection contract keeps identity and usage separate for every item:

```js
const items = [
  { selection: { adapter: 'media', id: 'local-files:/book.pdf' }, usage: {} },
  { selection: { adapter: 'articles', id: 'article:42' }, usage: {} },
];
const result = await SmartBrowserPicker.open({
  adapter: 'media',                    // Initial browsing adapter, not a collection type
  allowedAdapters: ['media', 'articles'],
  resultFormat: 'collection', multiple: true,
  homogeneous: false,                 // Optional constraint; mixed is the new API default
  initialCollection: items,
  selectionProfile: { 'visual.thumbnailOverride': {} },
});
// result is { items: [{ selection: { adapter, id }, usage }, ...] }, or null on Cancel.
const collection = SmartBrowser.mountCollection('#selected-resources', {
  referenceItems: true, items: result?.items || items,
  allowedAdapters: ['media', 'articles'], homogeneous: false,
  allowOrdering: true, allowRemove: true,
  onChange: ({ items }) => saveOrderedSelection(items),
});
await collection.ready;
await collection.addItems([{ selection: { adapter: 'articles', id: 'article:81' }, usage: {} }]);
```

Canonical identity includes both adapter and resource ID; identical IDs in different adapters never collide. Resolution is grouped by adapter and restored to caller order. Resource actions, metadata, visuals and usage definitions remain item-scoped. Browsing grids and columns still belong to one adapter. Switching browsing adapters retains the ordered selection and usage state in that Picker instance, not in global storage. Its collapsed selected-resources view reuses the same Collection View and ordering buttons.

With `homogeneous: true`, adding a foreign-adapter item is blocked while the collection is nonempty; browsing and focus are not blocked. Once empty, another adapter can be selected. A configured `browseRoot` scopes the initial adapter only and is restored when returning to it. The reference-entry API requires canonical IDs (`article:42`, provider-qualified media IDs); the old adapter-plus-ID-list API continues to accept numeric IDs and preserves its old callbacks. Existing raw and `{ selection, usage }` Picker results are unchanged. `setItems()` is silent; `addItems()`, remove and ordering notify the host. Missing references retain identity and usage and remain removable.

Upgrades from versions before 2.0.0 preserve selection order and visible composition.
No compatibility migration is performed for the uninstalled 2.0.0 release. Row arrows
now move forward/up or backward/down; numeric priority remains independent.
Menu roots use diagram-next for the adapter, diagram-predecessor for ordinary
nodes/items and diagram-successor for open nodes. Separator/heading defaults stay
unchanged, with independent Icons-tab overrides for separators, plain headings,
and closed/open headings with submenus.
### Editor button integrations

When `replace_media` or `replace_media_field` is enabled, the native Joomla Media editor button uses the existing SmartBrowser Picker with image alt/decorative/loading and PDF thumbnail usage options. `replace_articles` also routes the native Article button through SmartBrowser. Only buttons already exposed by the native plugins are replaced, preserving their permission checks. Editors using Joomla's editor action registry (including TinyMCE and JCE) share this integration. The integration inserts resource HTML into the editor; the generic Picker still returns normalized resources and usage values only.
### Lightweight Information / Usage Visual

The pane renders a constrained image or clean icon, independently of browser-card badges, overlays and status decorations. Full Preview uses the existing resource action/modal and always targets the original selected resource.

Resource-reference capabilities may declare `visualRole: 'thumbnail'`. Applicable capabilities use compact add/change/remove actions instead of generic form fields, retaining profile defaults, validation and normalized `{ adapter, id }` values. Explicit references are resolved for the pane visual only; natural thumbnails/posters/images and finally icons provide fallback. Existing `registerPreviewAction` providers appear as contextual visual actions in both pane tabs, with the lightweight DOM surface supplied as `previewElement`.
All selectable resources expose optional `visual.thumbnailOverride` and `visual.iconOverride` capabilities. Icons use the existing space-separated CSS classes, for example `fas fa-book`. Overrides change usage visuals, not full Preview. Information visuals use available width and 150px height; Usage visuals remain compact, and both preserve image transparency.
## SmartBrowser Picker Custom Field

The package installs **Fields - SuperSoftJx - SmartBrowser Picker** (`fields/smartbrowserpicker`). Enable the plugin, then select **SupJx SmartBrowser Picker (smartbrowser)** as the type of a Joomla custom field. Its field-type identifier is `smartbrowser`. It uses the same Picker, capability/profile intersection, usage editors, collection renderers and ordering API in both administrator and frontend forms. No resource HTML is stored.

Configuration includes **Allowed adapters**, optional canonical **Browse root** for the first adapter, **Selection target** (`item`, `node`, `both`), comma-separated **Allowed resource types**, **Multiple selection**, **One adapter per collection**, **Allow ordering**, **Editor display** and a JSON **Selection Profile** using the existing capability IDs/contracts. An empty `{}` profile is valid, including Article fields. Auto uses Compact for single selection and Collection for multiple selection. Compact reuses the existing resource details renderer; Collection reuses the embedded grid/details view. Editor display affects only the edit form, never the saved value or frontend rendering.

One field definition may allow several adapters. A single value can change to any allowed adapter. Multiple values use the generic core reference collection. **One adapter per collection** defaults to enabled and may be disabled to allow mixed selections. It limits additions, not browsing. Different content items may use different adapters for the same field definition. Per-item **Change selection / usage** opens the ordinary Picker with that item's current reference and usage, preserving the rest of the collection.

Version 1 storage wraps the core ordered entries without storing resolved resources:

```json
{
  "version": 1,
  "items": [{
    "selection": { "adapter": "media", "id": "local-files:/book.pdf" },
    "usage": {
      "visual.thumbnailOverride": { "adapter": "media", "id": "local-images:/cover.jpg" }
    }
  }]
}
```

The order of `items` is the collection order. An empty field stores an empty string and has no bound adapter. Unknown format versions, malformed values, duplicates, disallowed adapters and constraint violations are invalid. Old unavailable references remain removable and may be retained on unchanged content saves, but newly submitted unavailable references fail validation. Resolution always applies the current user's SmartBrowser/adapter permissions; knowing a stored identifier does not grant access. Server-side validation also enforces capability types, options, required/default state and resource-reference constraints, normalizing reference usages without resolved labels/markup.

When Joomla prepares a field, `$field->smartbrowser` contains `version`, `invalid` and ordered `items`. Each item contains `selection`, `resource`, `usage`, `effectiveThumbnail` and `unavailable`. `$field->rawvalue` remains the stored string; `$field->value` remains Joomla's rendered field output. The default field layout emits escaped available titles only. Use a template override of `plugins/fields/smartbrowserpicker/tmpl/smartbrowser.php` for presentation, or call the public component support API:

```php
use SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionFieldSupport;

$config = SelectionFieldSupport::configuration($field->fieldparams->toArray());
$selection = SelectionFieldSupport::prepare($field->rawvalue, $config);
foreach ($selection['items'] as $selected) {
    if ($selected['unavailable']) continue;
    // $selected['resource'], $selected['usage'], $selected['effectiveThumbnail']
}
```

Prepared data is resolved, not stored; it can differ by user permissions and must not be cached across users without appropriate access isolation. No image size, alignment, layout, link target, popup or rendering policy is configured/stored by this field.

The public Collection View accepts `layout: 'compact'`, optional `resourceActions`, `defaultResourceActionId` and `onResourceAction(action, resource)` for generic host commands. The field uses the core `resultFormat: 'collection'` API directly. Legacy callers may request `includeAdapter: true` with `resultFormat: 'usage'` to add the actual resolving adapter to that result envelope; existing callers/results are unchanged.
# Stored Selection Read Access

## Prepared Resource Contract

`SelectionFieldSupport::configuration($params)` and `prepare($raw, $config)` expose the same
contract as `$field->smartbrowser`, without rendering. Ordered items contain `selection`,
`resource`, `usage`, `effectiveThumbnail`, `effectiveIcon` and `unavailable`.
`resource` retains its native identity, title, kind/type, icon/image and extensible `metadata`.
Info Pane values come from those same properties; `infoFields`, where presentation is available,
describes existing sources/labels/formats. Missing properties are normal. Reader descriptors
retain only safe metadata, never account details or unverified menu destinations.
Natural visuals remain on `resource`. Valid overrides produce independent effective values;
invalid or inaccessible overrides retain the native fallback. Unavailable items have null
effective visuals. Neither resolved metadata nor rendering policy is stored in selection JSON.

Frontend field preparation uses reader visibility rather than Picker authoring permissions.
`AdapterRegistry::getReadable()` requires `ReadableResourceAdapterInterface`; adapters without
a verified policy fail closed. `ReadOnlyResources::resolve()` resolves canonical references
independently, preserving collection order and unavailable entries without caching across users.
`SelectionFieldSupport::prepare()` selects this path on the site; form filtering/validation
explicitly retain the existing authoring path. Thumbnail references use the same reader path.

Article/category references support published state, UTC publication dates, current user view
levels, and category ancestry visibility. Tags check published/access state through their ancestry.
Menus use Joomla SiteMenu filtering (publication dates, access, language) and verify parent items
and alias targets. Verified content/tag destinations receive frontend URLs; unknown component
destinations expose only the visible menu title, not their raw link or parameters.

Media read resolution uses registered Joomla filesystem providers. The exact native LocalAdapter
is supported after checking file existence, web-root containment, and an anonymous bounded GET
whose bytes match the local file. No cookies, credentials or redirects are used. Restricted files,
unknown/custom providers, folders, unverifiable responses or HTTP/TLS failures remain unavailable.
The probe reads at most 512 bytes with a three-second timeout. Checks are memoized only within
the current application/request, keyed by reader/view levels and file stat; failures are cached too.
The connection is pinned to `SERVER_ADDR`/`SERVER_PORT`, never DNS-resolved from a Host header.
TLS still verifies the original site hostname. No cross-request or cross-reader cache is used.
Outbound/loopback restrictions, TLS failures, and reverse proxies whose public port differs from
the backend listening port cause safe unavailable results. Filesystem/Joomla configuration alone
cannot establish web-server authentication or access rules, so the HTTP check cannot safely be
removed without an authoritative provider read-access contract.
Media thumbnail overrides pass the same checks; an unavailable override retains the natural visual.

User descriptors expose only `name` and numeric ID, never account metadata. They require a
`StoredSelectionReadContext::forField()` verified against the database, the field/group access,
and the containing article's public read policy. The context is bound to the current identity/view
levels and exact stored references. Generic user-ID lookup and User Groups remain unavailable.
Currently only the `com_content.article` host context can grant this name-disclosure context;
other custom-field host components need their own verified host read policy. Flat wrappers reuse
the source policy, but scoped user-name disclosure does not automatically extend to flat aliases.
Trusted SmartVisuals providers still decorate only successfully resolved resources and must
respect the current reader's access when supplying external visual URLs.
