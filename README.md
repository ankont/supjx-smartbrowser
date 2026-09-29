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

The package installs `com_smartbrowser` and an optional system integration plugin. Native Joomla data remains in its existing components and Media providers. Joomla ACL is enforced by the adapters; access to one adapter does not imply access to the others.

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

Common options are `adapter` (`media`, `articles`, `categories`, `tags`, `articles-by-tag`, `menus`, or `users`), `selectionTarget` (`item`, `node`, or `both`), `multiple`, `allowedResourceTypes`, `browseRoot`, and `defaultView` (`grid` or `details`). For example, `browseRoot: 'category:42'` constrains an article picker to a category subtree; a Media picker can use a provider path such as `local-images:/lessons`. The selected user must have the relevant Joomla permissions. The picker also accepts an explicit `url` if your hosting page needs a different site or administrator browser route.

For a full-page browser, link to `index.php?option=com_smartbrowser&view=browser&adapter=articles&mode=select` in the appropriate Joomla application. If you host that page yourself, it dispatches `smartbrowser:select` with `event.detail` containing `{ adapter, mode, resources }`; the picker above handles that event and dialog lifecycle for you.

## Build and test

From the repository root, in PowerShell:

```powershell
npm ci
npm test
npm run build
powershell -NoProfile -ExecutionPolicy Bypass -File .\build\build.ps1
```

The installable package is written to `build/output/pkg_smartbrowser-v*.zip`. `npm run build` updates the bundled browser script in `package/component/media/js/`; run it before packaging. The packaging script replaces its own `build/stage/` and `build/output/` directories.

## Source layout

- `package/component/`: Joomla component, adapters, PHP endpoints, templates, translations, and shipped assets.
- `package/plugins/system/smartbrowserintegration/`: optional Joomla integration plugin.
- `resources/js/`: Vue browser source.
- `tests/`: Node test suite and PHP ZIP portability check.
- `build/build.ps1`: creates the installable package ZIP.
- `docs/architecture.md`: historical architecture notes from early development.

## License

GNU General Public License v2 or later. See [LICENSE](LICENSE).
