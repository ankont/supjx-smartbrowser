# Field Output and PHP Image Presentation

## Native article links (4.3.26)

The SmartBrowser article editor stores complete Selection Addresses in Joomla's native
`urls.urla/urlb/urlc` fields. Text and target continue to use the native sibling fields.
Images remain on their existing native contract. Plain legacy URLs remain supported.

The enabled System - SmartBrowser Integration plugin prepares site article/module output
at `onContentPrepare`, independently of replacement settings. It changes only the in-memory
render object, never the database. The original `urls` value type is retained. Generic
Joomla/template layouts receive bare URLs, preserving real anchors before the structured
fragment. Unknown formats and ordinary fragments are not stripped. Invalid properties do
not break the article. Public resolution reuses `SelectionFieldSupport::prepare()` and
the existing read/access policy; no permission is granted by knowing an address.

An override receives `$item->smartbrowserLinks['a'|'b'|'c']` for structured links:

```php
$link = $this->item->smartbrowserLinks['a'] ?? null;
$selected = $link['selected'] ?? null;
// $link['address']: original full address; $link['url']: bare URL.
if ($selected) {
    echo \SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionOutputRenderer::render($selected);
}
```

`selected` is the same prepared selection shape as custom field output: `resource`,
`selection`, `usage`, `effectiveThumbnail`, `effectiveThumbnailResource`,
`effectiveImageAddress`, `effectiveIcon`, `displayedName`, `visualPresentation`, `unavailable`.
For custom composition, call `SelectionOutputRenderer::displayData($selected)`; mark the
single primary image with `data-sb-primary-image` and finalize its HTML with
`SelectionOutputRenderer::present($html, $selected)`. This invokes the shared PHP image
presentation providers and preserves the template's frame/pin composition. Do not render
raw stored addresses as hrefs or independently parse provider metadata. Delegate unavailable
selections to the shared renderer rather than exposing retained references or Usage.

Consumers that render articles without dispatching Joomla's content preparation event can
explicitly call `ArticleLinkPresentation::prepare($item)` first. The method is idempotent.
Ordinary links have no extra entry and continue through the existing native layout.

The server-side address reader `SelectionAddress` reuses the contract's format/property
names. PHP extensions can register their own `registerProperty($definition)` and
`registerCodec($name, $decode)` before article preparation, using the same definitions as
their JS registration. A decoder receives ordered component pairs, the definition and
address; it returns `['value' => ...]` and optional `preserved`. `registerFormat($name,
$referenceHandler)` supports additional identity formats. Unknown properties/codecs remain
opaque in `usage['ext.selectionAddress']`; they are preserved but never guessed into typed
metadata. No specific crop extension is interpreted by SmartBrowser. The editor rehydrates
registered JS codecs silently, including when a different saved reference is unavailable.

Implemented in 3.16.0. Custom fields now render through Joomla's normal `FieldsPlugin` lifecycle and shared Joomla layouts, independently of the component's Picker UI. No editor JS is needed for final output. Stored `{ version, items: [{ selection, usage }] }` values and existing read/access policies are unchanged.

## Native-Like Defaults

Since 4.1.0, Resources > Selection options can enable neutral unavailable-resource
notices (`selection_show_unavailable`). The default remains omission. Notices never
include IDs, titles, links, thumbnails or private metadata of inaccessible resources.
Trashed resources use the same output policy; editor previews always show a warning.
The renderer also accepts an explicit `showUnavailable` option for trusted consumers.
Since 4.1.4, unavailable output uses the same Joomla layout as regular resources.
`displayData.unavailable` is true and all resource-specific identity, Usage and metadata
are replaced with a safe placeholder descriptor (`resource.id/type = unavailable`).
The configured public placeholder image, plain-text title and optional Font Awesome
icon are exposed through the usual image/title/icon fields. No original link or
badge is supplied. Template overrides should retain their normal composition but
recognize this flag and never resolve or re-query the synthetic resource ID.
Since 4.3.12, a configured placeholder image participates in the same presentation
hook. The context is rebuilt centrally from the neutral placeholder: null selection,
empty Usage/metadata, synthetic unavailable resource and configured image only.
There is no provider call without a configured safe image.
Custom output layouts/consumers that skip unavailable entries before calling
`SelectionOutputRenderer::render()` must delegate those entries to the renderer
to inherit this policy. This does not relax resource access checks.

For explicit/manual selections, retain one opaque reference for every stored item,
including references absent from a public-only query. Pass them through the normal
read-only preparation policy and preserve its unavailable entries for rendering.
Never query private titles, URLs, images or content just to fill an unavailable slot.
Do not invent unavailable placeholders for dynamic category/tag query results:
those queries should continue to return only publicly readable candidates.

| Resource | Default output |
| --- | --- |
| Image | `joomla.html.image`, alt/decorative/class Usage; optional escaped caption in `figure.item-image` / `figcaption.caption`. |
| Document, audio, video | Public URL link with title; optional effective thumbnail. No forced download, autoplay or extra player JS. |
| Article, featured article | Effective image when available and public article title link; displayed-name Usage respected. |
| Category, tag, articles-by-tag | Image/title/public link based on the actual node/item resource, not an editor navigation URL. |
| Menu item | Public target link, optional Link Image; without an image, available Link Icon. Structural menus/headings without public targets remain text. |
| User | Public display name. Image/URL only if supplied by the existing read/decoration policy. No email, login, membership or management link inferred. |
| Folder, group, root, unknown type | Image/title/public link where the adapter makes the resource readable; otherwise text or omission if unavailable. |

Flat adapters use the same rules. Unavailable resources and invalid/empty fields render nothing. Output does not grant new public access to user groups, arbitrary user IDs or private files. Multiple visible entries retain selection order in a plain `ul.list-unstyled`; one result needs no collection wrapper.

Default output is not a Picker grid: no editor controls, browser type-icon composition or site-specific pins. Explicit icon/both Usage can request icons. Only these or native menu Link Icons load Font Awesome. Text/captions are escaped; URLs are allowlisted (web, relative URLs, anchors, mail/tel links; images only web/relative sources). Link target `1` opens a new tab with `noopener noreferrer`; popup/modal behavior belongs in an override. Native image URI details are handled by Joomla's image layout, not interpreted as crop data.

## Common Renderer and Overrides

```php
use SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionOutputRenderer;

// Prepared by SelectionFieldSupport::prepare() with the proper read-only adapter
// and verified stored-host context where required; never raw IDs or user JSON.
echo SelectionOutputRenderer::renderSelection($prepared);

// A consumer's collection should render each resource visual individually:
echo SelectionOutputRenderer::render($prepared['items'][0], [
    'layout' => 'smartbrowser.resource',
    'purpose' => 'output', // or 'preview' for server-rendered editor HTML
]);
```

The renderer is not a resolver or authorization boundary. Consumers must use existing safe resource resolution first; `purpose: preview` does not relax policy. There is no new public rendering endpoint.

The resource layout is installed at `components/com_smartbrowser/layouts/smartbrowser/resource.php`. Override it at:

`templates/YOUR_TEMPLATE/html/layouts/com_smartbrowser/smartbrowser/resource.php`

Joomla `FileLayout` retains normal template/parent-template lookup; no high-priority base path bypasses overrides. The outer field layout also supports Joomla's standard `templates/YOUR_TEMPLATE/html/plg_fields_smartbrowserpicker/smartbrowser.php`. Prefer the resource override for composition; outer field overrides should continue delegating to `renderSelection()`.

`$displayData` contains `selected`, `resource`, opaque `usage`, `title`, safe `url`, `image` (native image-layout attributes), `imageAddress`, `caption`, `icon`, and `target`. Prepared items also supply `effectiveThumbnailResource` and `effectiveImageAddress`. Retained compound image addresses are used only when they still match the resolved thumbnail identity; no crop parameter is interpreted.

The template may centralize its composition in another Joomla layout and call it from both the resource override and ordinary site output:

```php
// Inside the resource override: composition only; do not call the hook.
echo \Joomla\CMS\Layout\LayoutHelper::render('site.resource-identity', $displayData);
```

The central layout must preserve `data-sb-primary-image="1"` on exactly one main image, e.g. by passing `$displayData['image']` through `joomla.html.image`. Decorative frame/pin images must not have the marker. Missing/ambiguous markers leave HTML unchanged without guessing. Keep escaping additional attributes/text: Joomla's image layout escapes src/alt, not arbitrary attributes. Prefer an image in normal flow when it should size a surrounding frame; absolutely positioned images need a renderer-owned viewport sizing strategy.

## PHP Hook

**Safe prepared item -> default/overridden layout -> presentation event -> final HTML**

The renderer dispatches `onSmartBrowserPrepareImagePresentation` after the layout finishes and before returning HTML. Layouts and consumers do not dispatch it themselves. Plugins in the existing `content` and `smartvisuals` groups are imported through Joomla; already-loaded plugins subscribe normally. SmartBrowser references no concrete provider class/schema.

Event arguments:

- `imageElement`: the final primary `DOMElement` (`img`).
- `context`: `resource`, `selection`, opaque `usage`, `resolvedImage`, original `imageAddress`, DOM `imageUrl`, `purpose` (`output` or `preview`), `isReadOnly: true`, `unavailable` (boolean).

The original `imageAddress` retains native/compound URI data before Joomla cleans src; the DOM `imageUrl` may already be a plain public path. Providers interpret only their own data. No Usage JSON is exposed in HTML.

Providers apply image presentation, preserving source, alt, image identity, outer frame and pins. Change image CSS/size attributes owned by the provider and preserve unrelated styles. They must not write Selection Usage or article/file data. PHP plugins are trusted application code, not sandboxed. Subscribers follow Joomla dispatcher ordering and must cooperate on CSS rather than replacing another provider's entire style attribute.

Example (merge the subscription into the plugin's existing event map):

```php
public static function getSubscribedEvents(): array
{
    return ['onSmartBrowserPrepareImagePresentation' => 'prepareImage'];
}

public function prepareImage(\Joomla\Event\Event $event): void
{
    $context = $event->getArgument('context');
    if (($context['usage']['ext.example.monochrome'] ?? false) !== true) return;
    $image = $event->getArgument('imageElement');
    // This example owns filter; preserve unrelated inline declarations.
    $style = rtrim($image->getAttribute('style'), "; \t\n\r");
    $image->setAttribute('style', ($style !== '' ? $style . '; ' : '') . 'filter: grayscale(1)');
}
```

A thrown provider error restores the whole pre-event visual and logs a generic warning. No provider means ordinary layout output. Original unavailable resources are never passed to this event; their centrally generated neutral placeholders may participate when they have a configured image and the effective visibility policy permits output. Providers can check `context.unavailable`, and must not resolve the synthetic resource ID.

For trusted HTML already generated by a consumer, `SelectionOutputRenderer::present($html, $preparedItem, $options)` exposes the same finalization step; use it instead of, not in addition to, `render()`. It is not an HTML sanitizer. This also supports an unavailable model from `displayData(['unavailable' => true])`. Build its visual solely from the sanitized display data, preserve exactly one primary-image marker, and pass the host's effective `showUnavailable` choice. The same hook, once-only marker and rollback apply. With no configured image, the fragment is returned unchanged without calling providers; hidden unavailable output returns an empty string.

```php
$data = SelectionOutputRenderer::displayData(['unavailable' => true]);
// Layout uses only $data['image'], title/icon, and its own frame/pin; no article lookup.
$html = LayoutHelper::render('site.resource-identity', $data);
echo SelectionOutputRenderer::present($html, $data['selected'], [
    'showUnavailable' => $showUnavailable, // null/-1 means Use Global
    'purpose' => 'preview', // or 'output' for the published page
]);
```

## Once-Only Presentation and Migration

The renderer marks processed images `data-sb-image-presentation="server"`, including baseline restoration after failure. Re-finalizing marked HTML does not dispatch again. The JS image-presentation controller also skips this marker, preventing a second application when PHP HTML is published in a custom preview.

A SmartVisuals adapter using the shared PHP layout must re-render HTML when resource/Usage changes, cancel stale requests, publish its main image through `context.setImageElement()`, retain the server marker and release old publication before replacing HTML. Pass `purpose: preview`. Editing buttons remain in existing overlay/action APIs. The integration supplies its authenticated rendering route; no endpoint or site-specific renderer is added here.

Migration order:

1. SmartBrowser provides default field output, renderer/layout and PHP event (implemented here).
2. Template + SmartVisuals centralize site composition in a Joomla layout and adapt the dynamic Picker bridge to the shared renderer.
3. Sources calls the renderer per resource visual for both final output and editor preview, after its existing safe resolution.
4. Providers implement the PHP event using their own data logic; retain JS providers for client-rendered previews. Global image processors must respect the server marker too.

Other extensions are not modified. Until adapted, their stored metadata/addresses remain intact but private effects are not automatically reproduced by default field output. Old outer field overrides must delegate to the renderer to participate in this pipeline. Handwritten output that bypasses the renderer also bypasses its hook.
