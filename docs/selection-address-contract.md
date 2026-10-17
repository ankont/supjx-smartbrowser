# SmartBrowser — Universal Selection Address Contract

## Objective

Implement a universal, human-readable **Selection Address Contract** in SmartBrowser.

The goal is to represent any selected resource, together with its representation properties and Selection Usage Data, as a single portable, copyable, editable text string.

The design is inspired by Joomla's native `#joomlaImage://` syntax.

The new address must use the actual resource URL whenever available, with a structured fragment containing Joomla-specific resource identity and optional selection properties.

**Keep the implementation minimal.** Reuse the existing resource adapters, Selection View, selection profiles, metadata and persistence infrastructure. Do not create a separate selection framework.

Inspect the repository before making architectural decisions.

**Contract authority:** Store this document at `docs/selection-address-contract.md` and treat it as the authoritative specification for Selection Addresses. Keep it synchronized with any intentional changes to the contract. Do not change the contract merely to accommodate implementation shortcuts. The contract defines the external behavior and semantics; implementation details may evolve independently.

## 1. Fundamental address syntax

Canonical syntax:

`<resource-url>#<format>://[locator][?properties]`

Examples:

**Joomla article**

`https://example.org/library/article.html#joomlaItem://article/43?titleOverride=MyTitle`

**Joomla image**

`images/cover.jpg#joomlaImage://local-images/cover.jpg?width=800&height=600`

**External link**

`https://example.org/page#joomlaLink://?target=_blank`

**Plain link**

`https://example.org/page`

The components have the following meaning:

- **Resource URL:** Actual frontend URL, public media URL or other meaningful URI reference.
- **Format:** Semantic representation of the selected resource.
- **Locator:** Optional internal identity or provider-specific reference.
- **Properties:** Optional selection metadata serialized as query parameters.

The resource URL is intended for navigation or access. The fragment provides additional resource identity and selection semantics.

For Joomla resources, **the locator is the authoritative resource identity**. The public URL must not be used as the primary means of identifying an article, category or other Joomla item.

### Public URL generation

For Joomla resources, resolve the actual frontend SEF URL through the existing Joomla routing infrastructure.

Respect the appropriate menu context, language and routing rules.

Do not invent URLs by concatenating aliases, IDs or category paths.

Prefer the final frontend URL rather than administrator edit URLs.

If no meaningful public URL exists, allow an empty base and preserve the complete resource identity in the locator:

`#joomlaItem://article/43`

This is a valid portable selection reference, although not a navigable public link.

Do not fabricate publicly accessible URLs for unpublished resources, internal-only resources or folders.

Regenerate public URLs when serializing selections rather than treating previously stored URLs as permanently authoritative.

### Existing URL fragments

A resource URL may already contain a fragment:

`https://example.org/page#section`

Its extended address may become:

`https://example.org/page#section#joomlaLink://?target=_blank`

The parser must identify the rightmost valid registered format marker and preserve the original fragment.

When navigating, consumers must use the recovered resource URL, not the full extended Selection Address.

Do not claim that the extended string itself preserves native browser anchor navigation.

## 2. Registered formats

Support exactly these seven initial format names:

| Format          | Meaning                                                   |
| --------------- | --------------------------------------------------------- |
| `joomlaImage`   | Joomla-compatible image reference                         |
| `joomlaItem`    | Joomla resource (article, category, menu item, tag, etc.) |
| `joomlaLink`    | Ordinary internal or external hyperlink                   |
| `joomlaFile`    | File-oriented resource                                    |
| `joomlaFolder`  | Folder within a media filesystem                          |
| `joomlaMedia`   | Playable audio/video resource                             |
| `joomlaGallery` | Gallery represented as one logical resource               |

Only `joomlaImage` is an existing Joomla-native address format. The others are SmartBrowser-defined.

Use consistent naming and a common parser/serializer architecture.

The format expresses the intended semantics of the selection. It does not necessarily correspond to a different underlying resource.

For example, an MP4 may be a `joomlaFile` when intended for download, or a `joomlaMedia` when intended for playback.

### 2.1 joomlaImage

Example:

`images/photo.jpg#joomlaImage://local-images/photo.jpg?width=800&height=600`

Follow Joomla's actual native Media Field conventions.

Preserve the public image path, filesystem adapter, internal media path, dimensions and supported native metadata.

Support existing Joomla image addresses without converting them to a new proprietary format.

### 2.2 joomlaItem

Example:

`https://example.org/article.html#joomlaItem://article/43`

The locator contains the resource type and ID.

Use a URI-compatible `type/id` structure instead of the previous `article:43` syntax.

Support resource types exposed by existing SmartBrowser adapters without introducing unnecessary resource-specific code.

The old `article:43` string is not part of the new canonical contract. Do not generate it.

Legacy parsing may be retained if existing persisted selections actually depend on it, but do not make legacy support a major implementation project.

### 2.3 joomlaLink

Examples:

`https://example.org/page#joomlaLink://?target=_blank`

`https://example.org/page#joomlaLink://`

The locator is empty because the resource URL already identifies the link.

A plain URL without a format marker may also be interpreted as a `joomlaLink` when the selection context permits it.

Support normal URL query strings, fragments and valid link schemes according to the consumer's capabilities.

Reject unsafe executable URL schemes.

### 2.4 joomlaFile

Example:

`https://example.org/files/guide.pdf#joomlaFile://local-files/guide.pdf`

The locator preserves the filesystem adapter and file identity.

The format is not restricted to PDF or document files.

It describes file-oriented usage.

### 2.5 joomlaFolder

Example:

`#joomlaFolder://local-images/gallery`

Preserve the filesystem adapter and folder identity.

Include a public URL only if the folder actually has a meaningful public address.

Do not fabricate a public URL merely to fill the base component.

### 2.6 joomlaMedia

Examples:

`https://example.org/videos/intro.mp4#joomlaMedia://local-videos/intro.mp4?mediaType=video`

`https://www.youtube.com/watch?v=abc123#joomlaMedia://youtube/abc123?mediaType=video`

`https://example.org/audio/podcast.mp3#joomlaMedia://local-audio/podcast.mp3?mediaType=audio`

Represent playable media independently of whether the underlying resource is a file or external provider URL.

Support the semantic types `video` and `audio`.

Allow extensible provider identification.

Do not implement players as part of this feature. Rendering belongs to consumers.

### 2.7 joomlaGallery

Example:

`https://example.org/gallery#joomlaGallery://collection/42?layout=grid`

A gallery is one logical resource, distinct from a selection containing several independent images.

Do not automatically combine multiple `joomlaImage` selections into a gallery.

Do not implement a gallery manager or storage system as part of this task.

If no suitable gallery provider exists, support recognition and serialization of the format while reporting resolution as unsupported.

## 3. Selection properties

Selection Addresses may contain arbitrary registered properties:

`https://example.org/article.html#joomlaItem://article/43?titleOverride=MyTitle&role=featured`

Properties may come from representation metadata or Selection Usage Data.

**Use one flat namespace for all properties.**

Do not add prefixes such as `r.*` or `u.*`.

A property name must be unique within the effective selection profile.

If multiple property providers register the same name, report a configuration conflict. Do not silently override values.

Reuse existing Selection Profile and property metadata mechanisms.

### Property types

Support simple scalar properties directly:

- Strings
- Numbers
- Booleans
- Enumerated values
- Empty values

Use URI query conventions and standard percent-encoding for reserved characters.

Do not introduce a format version parameter.

Do not use JSON or Base64 as the default portable representation.

For structured properties, allow a registered codec to describe reversible flattening into textual query components.

Unknown properties must not be silently discarded. Preserve them for round-tripping when possible, or report an explicit incompatibility.

## 4. Compound properties and short aliases

A structured property may be represented using a short local alias.

This is an important part of the contract.

Suppose `thumbnailOverride` contains the Joomla image value:

`images/cover.jpg#joomlaImage://local-images/cover.jpg?width=800&height=600`

Instead of embedding that entire value, use:

`thumbnailOverride=t&t.src=images/cover.jpg&t.media=local-images/cover.jpg&t.width=800&t.height=600`

Full example:

`https://example.org/article.html#joomlaItem://article/43?titleOverride=MyTitle&thumbnailOverride=t&t.src=images/cover.jpg&t.media=local-images/cover.jpg&t.width=800&t.height=600`

The value `t` is a **local alias for a structured property**, not the literal image URL.

Its subordinate keys contain the image components.

### Alias rules

1. Aliases are local to one Selection Address.
2. An alias is recognized only for a property whose registered descriptor declares a corresponding structured codec.
3. The alias must be unique within the address.
4. Generated alias names must not collide with ordinary registered property names or other alias groups.
5. Generate short deterministic aliases, such as `t`, `p`, `t1`.
6. Alias names supplied by imported addresses need not match those generated during serialization.
7. Missing required components or conflicting alias groups must cause a validation error.
8. The same mechanism must support any structured property, not just thumbnails.

### Joomla image codec

For properties declared as Joomla images, use these components:

- `<alias>.src`: Public image path.
- `<alias>.media`: Adapter-qualified media path.
- `<alias>.width`: Optional width.
- `<alias>.height`: Optional height.
- `<alias>.crop`: Optional SmartCrop coordinates.
- `<alias>.ratio`: Optional SmartCrop aspect ratio.
- `<alias>.zoom`: Optional SmartCrop zoom level.
- `<alias>.param.<name>`: Additional native image query parameters when needed.

**Lossless query parameter handling:** The Joomla image codec must preserve and round-trip **all** query parameters found in a valid Joomla image URI, including parameters introduced by extensions such as SmartCrop, without requiring explicit knowledge of every parameter name. Recognized parameters (including `crop`, `ratio` and `zoom`) may use the concise forms above; unfamiliar parameters must also survive parsing and reconstruction unchanged in meaning. Do not drop extension-specific metadata when importing, exporting or saving an image.

The codec must reconstruct the original native image URI:

`images/cover.jpg#joomlaImage://local-images/cover.jpg?width=800&height=600`

Do not assume the public image path can always be derived from the media adapter path.

Preserve each explicitly supplied component.

Do not invent missing dimensions.

Avoid hardcoding `thumbnailOverride`; the codec must work equally for properties such as `poster` or `backgroundImage`.

Keep the initial codec implementation small. Do not build a large generic object serialization framework.

## 5. Parsing and serialization

Provide a centralized implementation for:

- Parsing one Selection Address.
- Serializing one Selection Address.
- Parsing multiline selections.
- Serializing ordered selections.
- Applying registered property codecs.

Use existing SmartBrowser services and patterns wherever possible.

### Parsing behavior

The parser must:

1. Identify the format marker and separate the resource URL from the metadata fragment.
2. Preserve any fragment belonging to the original URL.
3. Parse the optional locator.
4. Parse and decode properties.
5. Resolve registered structured properties and aliases.
6. Reconstruct the corresponding selection metadata.
7. Resolve the actual resource using the existing adapter infrastructure.
8. Report invalid or unsupported selections cleanly.

Do not infer resource identity from arbitrary URL paths when a Joomla resource locator is available.

Do not assume every URL is a Joomla resource.

Unknown format markers must not be interpreted as known formats.

### Serialization behavior

The serializer must:

1. Obtain the resource's meaningful frontend URL when available.
2. Select the appropriate semantic output format.
3. Include the locator when required by that format.
4. Serialize registered properties.
5. Flatten structured properties through their codecs.
6. Generate collision-free short aliases.
7. Produce deterministic, readable output.

Simple properties should remain simple.

Do not include unnecessary placeholders, empty sections or redundant metadata.

A native Joomla image must remain compatible with the actual Joomla image field representation.

### Multiple selections

Use one Selection Address per line.

Example:

`https://example.org/article-a.html#joomlaItem://article/43?role=featured`

`https://example.org/article-b.html#joomlaItem://article/44`

`images/cover.jpg#joomlaImage://local-images/cover.jpg?width=800&height=600`

Preserve selection order.

Use existing selection identity and duplicate-handling rules.

Support normal pasted multiline text with LF or CRLF endings.

## 6. Selection View integration

Integrate the new contract directly into the existing Selection View.

The Address column must display the complete serialized address as **plain text**.

Do not introduce chips, metadata badges, structured address controls or additional visual complexity.

Provide a simple way to:

- Copy the complete address.
- Paste/import one or multiple addresses.
- See the updated address when selection properties change.

Reuse existing UI controls wherever possible.

The import process must validate addresses before changing the selection.

If a multiline import contains invalid entries, display useful line-specific errors without partially corrupting the current selection.

Respect existing selection limits, resource permissions, duplicate rules and ordering controls.

The normal selection workflow must remain unchanged.

## 7. Consumer integration and Joomla compatibility

The portable Selection Address and the value stored by a consuming field are **different concepts**.

Do not replace all internal storage with the new address syntax.

Keep the existing selection model and persistence architecture.

Each consumer may require a different output representation.

### Native Joomla Intro Image and Full Article Image

When a Selection View is used by a native Joomla image field:

- Read the existing native image value.
- Resolve the image using the current media adapter.
- Reconstruct the corresponding selection.
- Preserve the native metadata.
- Write the output using Joomla's native `#joomlaImage://` format.

Do not store custom `joomlaItem`, `joomlaFile` or other SmartBrowser-specific formats directly in native Joomla image fields.

A field-specific conversion must not silently discard essential properties.

### Other consumers

Consumers such as SmartLink, Sources or future plugins may use the full Selection Address format.

However, **do not add Sources-specific behavior or redesign SmartLink as part of this task**.

Provide the generic mechanism through existing extension points.

Do not assume other native Joomla custom fields use this same serialization format.

## 8. Compatibility and security

The feature must work with existing supported Joomla versions and in frontend and administrator contexts.

Do not rely on administrator-only services when invoked from the frontend.

Validate imported addresses as untrusted data.

Respect:

- Joomla ACL and resource permissions.
- Filesystem adapter boundaries.
- Existing resource-selection restrictions.
- URI and property syntax.
- Consumer capabilities.

Never treat knowledge of a resource ID or URL as authorization to access it.

Do not execute or render imported metadata as HTML.

### Backward compatibility

Do not change existing stored selection data unnecessarily.

If an existing selection can still be loaded through the current architecture, it should remain usable.

The old `article:43` Address syntax is not a required output format and should not constrain the new architecture.

Keep only the legacy parsing required to avoid actual regressions in persisted data.

No version numbers or version-negotiation framework are needed.

Future additions must preserve the meaning of existing formats and properties.

## 9. Tests and acceptance criteria

Implement focused tests following the repository's existing conventions.

Cover at least:

1. Serialization and parsing of all seven format names.
2. Article URLs generated through Joomla routing.
3. Resource identity remaining stable when the public URL changes.
4. The empty locator of `joomlaLink`.
5. Plain URLs and URLs with their own fragments.
6. Joomla image URI parsing and native reconstruction.
7. Structured `thumbnailOverride` serialization with short alias `t`.
8. Multiple structured properties with collision-free aliases.
9. Round-tripping image paths, adapter references and dimensions.
10. Property-name collision detection.
11. Correct URI escaping and Unicode handling.
12. Multiline selections preserving order.
13. Invalid import rollback without partial mutation.
14. Existing frontend and administrator Selection View behavior.
15. Native Joomla Intro Image compatibility.
16. Distinguishing `joomlaFile` from `joomlaMedia`.
17. Distinguishing `joomlaLink` from `joomlaMedia`.
18. Graceful handling of gallery resources without an installed gallery provider.
19. Resource permissions and unsupported formats.
20. Continued operation of existing selection consumers.
21. Lossless round-trip of SmartCrop `crop`, `ratio`, `zoom` and other unknown extension-defined Joomla image query parameters.

Use actual Joomla behavior as the reference for native image compatibility.

## 10. Implementation constraints

**Avoid overengineering.**

This task is primarily an address parser/serializer and its integration with the existing selection model.

Prefer a small, coherent implementation over a new framework.

In particular:

- No new database tables unless truly necessary.
- No migrations without a demonstrated need.
- No separate internal selection storage format.
- No broad refactoring of existing adapters.
- No new gallery implementation.
- No audio/video player implementation.
- No new resource picker.
- No rich Address editor.
- No Sources-specific implementation.
- No unrelated changes to SmartBrowser.

Use lightweight format handlers only where different behavior actually requires them.

Do not create seven large independent subsystems merely because seven format names exist.

## 11. Deliverables

Implement the feature in the existing repository.

Follow all established package, plugin, namespace, file and release naming conventions.

After implementation, provide:

1. A concise explanation of the actual architecture used.
2. The files changed and the key integration points.
3. Examples of the seven supported address formats.
4. The implemented compound-property alias behavior.
5. Test results.
6. Any existing limitations or deliberately deferred integrations.

Do not perform unrelated refactoring.

**Success criterion:** SmartBrowser selections can be represented, copied, imported and exported as readable URI-based addresses containing all supported selection metadata, while existing resource adapters, consumers and native Joomla image fields continue functioning correctly.

## 12. Implementation contract and clarifications

The existing `{ selection, usage }` JSON remains authoritative storage. Portable addresses are a representation of that selection, not a replacement identity or storage format.

### Public integration points

Loading the existing public Collection View API also exposes:

- `SmartBrowser.SelectionAddress`: shared syntax and property-codec registry.
- `SmartBrowser.createSelectionAddressService({ config, api? })`: selection-aware resolution and serialization using the existing ResourceApi. An omitted API is created from the consumer configuration; call `destroy()` when finished.
- Collection and Selection Field instances expose `exportAddresses(options?)` and `importAddresses(text, { append? })`.

`exportAddresses()` refreshes descriptors through the existing adapters before serializing in stored selection order. `importAddresses()` validates before one atomic commit. Multi-select import appends by default; single-select import replaces by default. Explicit `append: false` replaces the complete collection. Existing duplicate rules apply, retaining the first identity. A pending import cannot overwrite an intervening selection edit.

The service's `serialize(entry, resolvedResource?, options?)` obtains a fresh resource when none is supplied. Internal Selection View rendering can reuse its current resolved descriptors. `serializeLines(entries, resources)` and `import(text, current, options)` are the non-UI counterparts; `import` resolves and validates but does not itself mutate a collection.

The registry's `parse(text)` is syntax-only, so that unsupported galleries and provider addresses can still be recognized and round-tripped. Parsing is not authorization. Resolution/import always goes through the existing adapter, browse-root, resource-type and usage validation paths. `parseLines(text)` accepts LF/CRLF, ignores blank lines, and retains source line numbers for diagnostics. `serialize({ format, url, locator, properties })` handles ordered query pairs; `properties` is an array of `[name, value]` pairs, allowing lossless native image query parameters.

Joomla's article/category resources can be exposed by more than one existing view adapter. A non-default view may emit the optional registered representation property `adapter=featured-articles` (or another allowed adapter for that resource type). This is a routing hint to preserve existing `{ adapter, id }` entries, not an alternative identity: `type/id` remains authoritative, and the hint cannot select an unrelated/disallowed adapter or bypass its browse scope. Default article addresses do not need this property.

### Property metadata

Capabilities declare portable metadata in their existing descriptor:

```js
{
  key: 'visual.thumbnailOverride',
  type: 'resource',
  address: { name: 'thumbnailOverride', codec: 'joomlaImage', alias: 't' },
  // Existing editor, picker, validation and profile rules remain unchanged.
}
```

The effective profile may supply `address` metadata on its existing policy object. This does not weaken capability or permission validation. Built-in aliases include `titleOverride`, `thumbnailOverride`, `iconOverride`, `presentation` and Direct Links `target`. Existing Joomla target values map to readable values such as `_blank` and `_self`, and map back on import.

Extensions may use `registerProperty(definition)` for existing `ext.*` usage metadata, or declare `address` on their existing resource capabilities. Ordinary capabilities still need to be enabled by the Selection Profile. Both keys and portable property names must be unique among effective providers; conflicts are errors.

`registerCodec(name, { encode, decode })` handles structured properties. `encode(value, context)` returns textual component pairs without the local alias prefix. `decode(pairs, context)` returns `{ value, preserved? }`. Codecs receive `definition` and `resolveReference`; the built-in image codec also receives any preserved native URI. Codec registration does not grant resource access.

The serializer assigns deterministic, collision-free short aliases, reserving ordinary property names and their component prefixes. Imported aliases need not match the generated alias. All query values use standard percent encoding; encoded slashes/colons in component values are equivalent to the readable examples above. String/number/boolean types come from registered descriptors, not guesses based on text. Null/undefined are omitted. Explicitly stored scalar values, including false, zero and empty strings, are retained even when equal to the current capability default: another consumer may have different profile defaults. The serializer does not invent values for absent properties or add placeholder sections.

Unknown textual properties are retained as ordered pairs under existing `ext.selectionAddress` usage metadata, never silently applied as arbitrary capabilities. This same reserved extension metadata retains semantic format choice and compound image URI details that cannot fit into a normalized `{ adapter, id }` thumbnail reference. It is not a new top-level item schema and is not emitted as JSON in Address. Unregistered structured extension data requires a codec and produces an explicit incompatibility until one is registered. Unknown native image parameters, including repeated names, remain intact in the native URI or compound codec.

### Formats and providers

`registerFormat(name, { reference, describe?, validate? })` adds a lightweight semantic handler without changing the parser. The seven documented formats are the initial registrations. `getFormat(name)` returns the existing handler; a provider may explicitly replace/extend it using `registerFormat(name, handler, { replace: true })`. The returned cleanup restores the previous handler. This is how an installed gallery or external playable-media provider can resolve its locator through an existing authorized adapter. Without such a provider, gallery resolution is unsupported; recognition and serialization still work. `registerItemType(type, adapters)` maps additional Joomla item locator types to existing adapter IDs.

Registry changes notify open Selection Views. `subscribe(listener)` returns an unsubscribe callback. No format version field is introduced.

Input is bounded to 262,144 characters per address, 4 MiB per pasted batch and 500 selections; existing consumer-specific limits on stored references, field JSON and usage metadata still apply. Failures report incompatibility rather than truncating data.

### Native and legacy consumers

The native image bridge continues reading and writing its native field and adjacent caption/alt/class controls. It preserves the actual native image URI, including extension parameters, through existing `ext.address` handling. Import rejects non-image formats and selection properties that the native consumer cannot represent. An image codec never derives an explicitly supplied public path from its filesystem locator.

Preview extension `getAddress()`/`setAddress()` retain their existing field-specific/native semantics for compatibility. `getSelectionAddress()` exposes the complete portable address; the Selection View's Address input/column and copy commands use the portable representation.

Identifier-only legacy collections continue loading and exporting. They cannot import usage-bearing selections without a consumer capable of the existing structured selection model; no silent metadata stripping or automatic storage migration is performed. Native Joomla custom fields are not presumed to accept portable address strings as their stored value.

Actual SEF/menu/language output depends on the site's Joomla routing configuration. Public descriptors are regenerated by the adapters; articles/categories use Joomla Content RouteHelper and the site router, while tag/menu addresses reuse their readable site routes. Unpublished/inaccessible/internal-only resources retain an empty public base. External playable-media providers and gallery management are deliberately not implemented here.
