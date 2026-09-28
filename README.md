# SuperSoftJx - SmartBrowser

SmartBrowser is a Joomla resource browser for articles, categories, tags, menu items, users, and media. It combines tree and flat navigation, grid and list views, contextual details, filtering, selection, editing, and batch operations in one interface. It runs in the administrator and site applications, subject to Joomla permissions.

## Requirements

- Joomla 5 or 6, with a supported PHP version for that Joomla installation.
- A modern browser with JavaScript enabled.
- Node.js and PowerShell are needed only to build the package from source.

## Installation

1. Download the `pkg_smartbrowser-v1.0.0.zip` release package, or build it from source.
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

Configure display, related-content, and integration settings in **SmartBrowser Options**. The integration plugin must be enabled for manager-link and picker integrations to take effect. SmartAuthors-specific user-field integration is used only when SmartAuthors is installed and enabled.

## Build and test

From the repository root, in PowerShell:

```powershell
npm ci
npm test
npm run build
powershell -NoProfile -ExecutionPolicy Bypass -File .\build\build.ps1
```

The installable package is written to `build/output/pkg_smartbrowser-v1.0.0.zip`. `npm run build` updates the bundled browser script in `package/component/media/js/`; run it before packaging. The packaging script replaces its own `build/stage/` and `build/output/` directories.

## Source layout

- `package/component/`: Joomla component, adapters, PHP endpoints, templates, translations, and shipped assets.
- `package/plugins/system/smartbrowserintegration/`: optional Joomla integration plugin.
- `resources/js/`: Vue browser source.
- `tests/`: Node test suite and PHP ZIP portability check.
- `build/build.ps1`: creates the installable package ZIP.
- `docs/architecture.md`: historical architecture notes from early development.

## License

GNU General Public License v2 or later. See [LICENSE](LICENSE).
