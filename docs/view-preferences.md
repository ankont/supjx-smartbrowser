# SmartBrowser view preferences

Browser, Picker and embedded Selection View preferences use user-scoped localStorage and
Joomla's existing `#__user_profiles` entry `smartbrowser.preferences`. Frontend/backend
share a user's preferences on the same site. No selected resources, usage values, file
contents or form edits are saved in preferences.

The current user's server snapshot initializes the local cache. Changes save immediately
to the cache and are sent as debounced, CSRF-protected patches to `api.preferences`.
The endpoint takes the user exclusively from its authenticated session. Concurrent patches
merge under a database lock. Failed patches remain locally queued for the next visit.
Guest preferences remain browser-only. The profile is bounded to 300 keys/60 KB.

## Scopes

- Management browser: one key per base adapter, shared across roots and regular/flat views.
- Picker: a separate namespace, keyed by caller `viewPreferenceKey` and base adapter.
  Roots do not create additional saved appearances. Browse/access constraints remain enforced.
- Selection View: caller `viewPreferenceKey` for grid/list; `.single-layout` or
  `.multiple-layout` suffix for panels, sorting and columns. Picker state is separate even
  when the caller passes the same key to both APIs.
- Page display mode, editor maximization and Picker maximization: separate logical keys,
  using the same user storage and reset mechanism.
- Tabs, current selections, scroll positions and open/dirty forms remain transient unless
  a specific UI already persisted them. Session return URLs are navigation, not preferences.

## Caller keys and native integrations

```js
SmartBrowserPicker.open({
  adapter: 'articles',
  viewPreferenceKey: 'myplugin.article-source',
});
```

Use a stable role/field key, not a record ID, category, current URI, translated title or
random DOM ID. Equal keys intentionally share preferences; different keys isolate them.
Without a key, Pickers share a default per-adapter scope.

Native integrations provide stable keys automatically: Intro/Full Article Image separately,
article link slots/list, media field names and entity contexts, editor insertion actions,
thumbnail pickers and SmartAuthors user roles. Custom fields derive a key from their stable
input name unless explicitly configured. Programmatic callers such as Sources should keep
passing their own key; existing `viewPreferenceKey` usage continues working.

## Reset

The existing admin Reset preferences control changes a global generation when Options are
saved. On the next visit, every account discards its old local cache and old profile entry,
including selection panels, columns, filters, window sizes and offline pending changes.
Stale requests receive 409 and cannot restore old values. Reset does not erase selections
or modify resources. Unscoped legacy session/local entries are no longer used for logged-in
accounts; they are not imported across identities.
