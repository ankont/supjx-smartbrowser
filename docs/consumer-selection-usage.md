# Consumer-scoped Selection Usage

`mountCollection(element, config)` and `SmartBrowserPicker.open(config)` accept
`consumer` (a stable lowercase identifier) and `usageCapabilities` (an array of
capability definitions). The collection forwards them to its shared Add/Replace
Picker. These definitions are local to that instance, not global resource decoration.

Register the trusted definitions in PHP on every request that renders or validates
this consumer, including API requests (normally from the consumer's system plugin):

```php
use SuperSoft\Component\Smartbrowser\Administrator\Support\ConsumerUsage;
ConsumerUsage::register('example', [[
    'key' => 'ext.example.caption',
    'resourceTypes' => ['article'],
    'type' => 'string', 'editor' => 'text',
    'label' => 'PLG_EXAMPLE_CAPTION',
    'default' => '', 'presentation' => 'secondary',
    'validation' => ['maxLength' => 120],
]]);
$config['consumer'] = 'example';
$config['usageCapabilities'] = ConsumerUsage::definitions('example');
$config['selectionProfile']['ext.example.caption'] = true;
```

Pass that config to the existing Collection View, or directly to the Picker.
Definitions require an `ext.<consumer>.*` key, explicit `resourceTypes`, and an
existing capability type (`string`, `boolean`, `number`, `object`, `resource`).
Use the existing `editor`, `icon`, `options`, `picker`, `disabledWhen`,
`inactiveValue`, and `validation` contract. Labels and option labels are Joomla
translation keys: load their translations in the host and supply its `translate`
function. An option is `{ value: 'cards', label: 'PLG_EXAMPLE_CARDS' }`.

The existing Selection Profile explicitly enables each key. Its default,
presentation (`primary`, `secondary`, `hidden`), required flag and constraints
continue to apply. A definition's presentation is used unless the profile overrides
it. Constraints support lengths, number bounds/integer, allowedValues and pattern;
patterns must be compatible with both JavaScript and PHP regular expressions.

Persist `usage` in the existing selection JSON. No separate storage is introduced.
For final saves call `SelectionFieldSupport::usageValues(resource, usage, config)`
using a server-owned consumer and profile, and persist the returned values. API
validation receives only the consumer identifier and profile; it never trusts browser
capability definitions. Register PHP definitions before that request executes.
Client validation is feedback, not an authorization boundary. The saving host must
provide its trusted config and enforce permissions. Resource references use the
existing resolver and access checks.

Definitions are applied only to matching resource types. Registered consumer values
outside its enabled profile/types are rejected at the saving boundary. Unrelated
extension metadata retains its existing opaque preservation contract. Readonly and
hidden Usage modes still control editability; registration grants no permissions.

No frontend registration order is required: supply configuration before mounting.
To change the schema, remount the consumer. For compatibility with old selections,
keep old keys registered during migrations and perform migrations in the host.
