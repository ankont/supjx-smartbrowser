# Changelog

## 2.1.0 - 2026-10-07

### Selection Profiles
- Added generic resource selection capabilities, caller selection profiles and per-resource usage state to the existing Picker.
- Added text, textarea, boolean, select, number and resource-reference editors in the existing Info pane, with primary/secondary presentation and validation.
- Added custom usage-editor and preview-action registration APIs.
- Added image alternative text, decorative state and loading strategy capabilities to the Media adapter.
- Added PDF thumbnail overrides using a nested instance of the same Picker, returning only a normalized resource reference.
- Preserved legacy result shapes; callers can explicitly request `{ selection, usage }`.
- Added ordered initial selections, isolated nested/parallel instances and transient Info visibility without changing remembered browser preferences.
- Added regression coverage, including desktop/mobile browser scenarios with the production renderer.

### Previously Uncommitted Changes
The source history also includes the changes delivered in the preserved 2.0.6 installer:
- Reusable single-adapter Collection View with resource resolution, ordering, removal, callbacks and lifecycle support.
- Flexible resource appearance rules, unified Font Awesome icon vocabulary and per-adapter icon customization.
- Generic SmartVisuals decoration consumption and optional SmartCrop image presentation.
- Expanded editor image-fieldset rendering for plugin fields, generic article creation defaults and the fix for normal creation without defaults.
- Default edit/selection actions, content previews, tree/breadcrumb icon fixes and Joomla media-field integration improvements.
- Remembered dashboard expansion and two-state popup editor maximization, with a shared dimmed/blurred modal backdrop.

### Verification
- 291 JavaScript tests and the standalone PHP regression suite pass locally.
- Browser checks cover image usage validation, PDF thumbnail selection/change/removal, ordered multiple selection, custom editors/actions and mobile layout.

## 2.0.6 - Archived Installer

The installer produced before Selection Profiles has been preserved as a separate
GitHub release under `archive-v2.0.6`.

The original full source snapshot was not committed. The archive tag therefore
contains only archival documentation and the installer checksum; it does not
pretend to be a reproducible source checkout of 2.0.6. Use the attached
`pkg_smartbrowser-v2.0.6.zip` installer, not GitHub's automatic source archives.
