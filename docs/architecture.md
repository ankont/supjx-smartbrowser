# SmartBrowser architecture

## Joomla 6 Media Manager reference

The implementation was compared with the official `joomla/joomla-cms` `6.1-dev` source because the upstream repository no longer carries a `6.0-dev` branch.

The current Media Manager is a Vue 3 application backed by Vuex. Its UI is split into application, disk/drive tree, breadcrumb, toolbar, browser grid, table, typed media items, information bar, upload surface and action modals. The store keeps `disks`, `directories`, `files`, `selectedDirectory`, `selectedItems`, view/search/sort state and modal flags. `vuex-persist` writes the current directory, view, grid size, search, info bar and sorting to `sessionStorage` under `joomla.mediamanager`.

Data is loaded through the administrator `ApiController`, which delegates to `ApiModel` and the filesystem provider/adapter system. Items are normalized in the client into separate directory and file arrays. Create, upload, rename, delete and content retrieval use the same internal JSON endpoint with Joomla JSON CSRF validation and `com_media` ACL checks. Selection is an array of raw media items, and item/action components contain media-type-specific behavior. The SCSS is component-local and uses Media-specific selectors, so copying those selectors would create a brittle dependency.

## Package boundaries

### Generic browser core

- Normalized roots, nodes and items
- Navigation, breadcrumb, selection and select-all
- Search, sorting and direction
- Persisted selected node, view, view options, sorting and info state
- View registry whose definitions provide id, label, icon, renderer, size support and options
- Generic action descriptor rendering

### Media adapter

- Provider/drive to root mapping
- Folder to node and file to item mapping
- MIME-specific icon, preview and metadata mapping
- Media capabilities and action declarations
- Calls to Joomla Media models/providers for list, create, upload, rename, delete and content/URL retrieval
- Client interactions for file picking, preview, download and Web Share/clipboard fallback

### Content adapter family

`ContentAdapter` is the abstract Joomla Content-domain base. It owns reusable category hierarchy, breadcrumb, ACL, model, normalization, metadata, state mutation and editor URL helpers. It is not registered or exposed as a browser source.

`ArticleAdapter` is the concrete `Categories -> Articles` composition. It owns the adapter id, resource assembly, toolbar actions, filters and presentation schema. Future combinations are represented by new concrete subclasses rather than runtime hierarchy/resource configuration.

`CategoryAdapter` is the concrete `Categories -> Categories` composition. Child categories are its primary navigable/selectable resources. When `showContextResources` is enabled, it also provides direct articles of the current category through `ContextResourceProviderInterface`; those articles remain a separate contextual collection.

### Menu adapter and content resolution

`MenuAdapter` owns Joomla Menu and Menu Item hierarchy only. Menus are top-level containers and Menu Items are primary folder-like nodes whose real `parent_id`/nested-set bounds define navigation, breadcrumbs and `browseRoot` scope.

Contextual content is resolved lazily for the current Menu Item through `MenuItemResolverRegistry`. Dedicated strategies cover single Articles, category Article collections, featured Articles, tagged Articles, URLs, aliases and static types; a final generic component resolver provides a safe descriptor for unknown component views. Resolver output is always zero, one or many normalized contextual resources and never alters the Menu Item hierarchy.

Aliases delegate only resolver output. Their own position and children remain authoritative, while visited IDs and a bounded resolution depth prevent recursive alias chains. Article-producing resolvers call the public Content-domain resolution helpers, so menus reuse the same Article queries, normalization, ACL metadata, thumbnails and contextual interaction policy as the Content adapters.

### Contextual resources

Adapters that provide secondary context may implement `ContextResourceProviderInterface`. The API transports these resources in `contextItems`, separately from primary `nodes` and `items`, and only when the invocation enables `showContextResources`.

The client preserves that separation in state while keeping resource role independent from interaction policy. Normalized resources declare `focusable`, `selectable`, `bulkSelectable`, `actionable`, `navigable` and `activatable` independently. Contextual resources default to focusable but non-selectable/non-bulk-selectable; adapters may explicitly make them actionable without changing their role.

Focus (`focusedId` / `focusedResource`) is separate from checkbox and picker selection (`selectedIds`). The Info panel follows focus. Select All and bulk actions only consume bulk-selectable resources, while per-resource menus are derived from actionable capabilities rather than primary/contextual role. The core has no knowledge of the resource domain type.

### Joomla integration

- Administrator MVC component and menu entry
- DI service provider and Joomla namespace registration
- Web Asset Manager registration and script options
- Component access ACL plus unchanged `com_media` create/edit/delete authorization
- JSON CSRF validation for mutations
- Component and package manifests

## Deliberate parity limits

The generic endpoint avoids calling the HTTP endpoint that Joomla itself labels internal, but `MediaAdapter` necessarily consumes Joomla Media PHP model/provider classes. Those classes are the narrow compatibility boundary to re-test on Joomla updates.

Image editing through `media-action` plugins is not included in this first POC because the plugin UI and edit route are tightly coupled to `com_media`. Adding it cleanly requires an adapter-contributed editor surface rather than a core conditional. Folder move/copy is likewise deferred because drag semantics need a generic move/copy capability contract. Select mode exposes the public opening shape and emits `smartbrowser:select` with `{ adapter, mode, resources }`; lifecycle and modal-closing policy remain the responsibility of its future host integration.

The first two registered views are `grid` and `details`; neither is special-cased in the browser renderer. New modes can register another definition and Vue renderer without changing browser state.
