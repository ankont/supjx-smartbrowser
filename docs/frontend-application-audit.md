# Frontend application audit

## Findings

- The site dispatcher required `core.manage` on `com_smartbrowser`. This coupled authentication and backend-manager access before an adapter could apply resource ACL.
- Adapter registration required component-wide `core.manage` for Content, Tags, Menus, and Users. Authors with `core.create`, `core.edit`, or `core.edit.own` were therefore rejected before resource normalization.
- Article, Category, Tag, Menu Item, and User edit actions generated administrator URLs. They worked for Super Users because those users could enter the Administrator application.
- Media operations already use adapter models/API calls and do not require an administrator edit form.
- API authentication expiry was returned as an undifferentiated failed request. An expired edit iframe could show a nested login or error page.
- Shared assets and language strings are registered by the component and are not intrinsically administrator-only. Manager escape links intentionally remain administrator URLs.

## Implemented boundaries

- The site dispatcher now redirects guests to the standard Joomla login with the complete current URL as `return`. Authenticated ACL failures remain HTTP 403.
- API guests receive HTTP 401 plus a normalized `authenticationRequired` response and login URL. The client navigates the top-level window, forcing a clean reload and fresh CSRF token after login.
- Site adapter availability is based on the relevant component/resource operation permissions, including authorised Content categories, rather than Administrator login permission.
- Article editing uses Joomla's native site `com_content` form.
- Categories, Tags, Menu Items, and Users use a thin site-side SmartBrowser bridge. It loads the standard administrator MVC model and XML form under the site application, checks resource ACL before load and save, and does not route through `/administrator`.
- Administrator SmartBrowser edit URLs and forms are unchanged.

## Form extension compatibility

The bridge calls each Joomla model's normal `getForm()`/`preprocessForm()` path, so standard form XML, content plugins, and extensions that augment those model forms can load. Extensions that explicitly depend on the Administrator application, administrator-only document state, or administrator-only JavaScript may still require their own site-compatible integration; the bridge does not emulate the entire backend application.

## Resource strategy

| Resource | Site edit strategy |
| --- | --- |
| Articles | Native `com_content` site edit form |
| Categories | SmartBrowser site bridge + `com_categories` model/form |
| Tags | SmartBrowser site bridge + `com_tags` model/form |
| Menu Items | SmartBrowser site bridge + `com_menus` model/form |
| Users | SmartBrowser site bridge + `com_users` model/form |
| Media | Existing model/API actions; no separate edit form |

`Open Joomla Manager` remains an explicit administrator escape hatch and naturally requires administrator access.
