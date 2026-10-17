# Field Output and PHP Image Presentation

Implemented in 3.16.0. Custom fields now render through Joomla's normal `FieldsPlugin` lifecycle and shared Joomla layouts, independently of the component's Picker UI. No editor JS is needed for final output. Stored `{ version, items: [{ selection, usage }] }` values and existing read/access policies are unchanged.

## Native-Like Defaults

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
- `context`: `resource`, `selection`, opaque `usage`, `resolvedImage`, original `imageAddress`, DOM `imageUrl`, `purpose` (`output` or `preview`), `isReadOnly: true`.

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

A thrown provider error restores the whole pre-event visual and logs a generic warning. No provider means ordinary layout output. Unavailable resources are never passed to this event. For trusted HTML already generated by a consumer, `SelectionOutputRenderer::present($html, $preparedItem, $options)` exposes the same finalization step; use it instead of, not in addition to, `render()`. It is not an HTML sanitizer.

## Once-Only Presentation and Migration

The renderer marks processed images `data-sb-image-presentation="server"`, including baseline restoration after failure. Re-finalizing marked HTML does not dispatch again. The JS image-presentation controller also skips this marker, preventing a second application when PHP HTML is published in a custom preview.

A SmartVisuals adapter using the shared PHP layout must re-render HTML when resource/Usage changes, cancel stale requests, publish its main image through `context.setImageElement()`, retain the server marker and release old publication before replacing HTML. Pass `purpose: preview`. Editing buttons remain in existing overlay/action APIs. The integration supplies its authenticated rendering route; no endpoint or site-specific renderer is added here.

Migration order:

1. SmartBrowser provides default field output, renderer/layout and PHP event (implemented here).
2. Template + SmartVisuals centralize site composition in a Joomla layout and adapt the dynamic Picker bridge to the shared renderer.
3. Sources calls the renderer per resource visual for both final output and editor preview, after its existing safe resolution.
4. Providers implement the PHP event using their own data logic; retain JS providers for client-rendered previews. Global image processors must respect the server marker too.

Other extensions are not modified. Until adapted, their stored metadata/addresses remain intact but private effects are not automatically reproduced by default field output. Old outer field overrides must delegate to the renderer to participate in this pipeline. Handwritten output that bypasses the renderer also bypasses its hook.
