<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Factory;
use Joomla\Database\DatabaseInterface;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\AdapterRegistry;

defined('_JEXEC') or die;

/** A verified, visible host field grants disclosure of its stored display-name references only. */
final class StoredSelectionReadContext
{
    private function __construct(private readonly array $references, private readonly string $reader) {}

    private static function reader(): string
    {
        $identity = Factory::getApplication()->getIdentity();
        $levels = $identity->getAuthorisedViewLevels();
        sort($levels);
        return json_encode([(int) $identity->id, $levels], JSON_THROW_ON_ERROR);
    }

    public static function forField(string $context, object $item, object $field): ?self
    {
        // Other host components need their own native read checks before they can grant this context.
        if ($context !== 'com_content.article' || empty($item->id) || empty($field->id)) return null;
        try {
            $app = Factory::getApplication();
            $db = Factory::getContainer()->get(DatabaseInterface::class);
            $query = $db->getQuery(true)->select(['f.context', 'f.type', 'f.state', 'f.access', 'v.value', 'f.group_id', 'g.state AS group_state', 'g.access AS group_access'])
                ->from($db->quoteName('#__fields', 'f'))
                ->join('INNER', $db->quoteName('#__fields_values', 'v') . ' ON v.field_id = f.id')
                ->join('LEFT', $db->quoteName('#__fields_groups', 'g') . ' ON g.id = f.group_id')
                ->where('f.id = ' . (int) $field->id)->where('v.item_id = ' . $db->quote((string) $item->id));
            $stored = $db->setQuery($query)->loadObject();
            if (!$stored || $stored->context !== $context || $stored->type !== 'smartbrowser' || (int) $stored->state !== 1
                || !in_array((int) $stored->access, $app->getIdentity()->getAuthorisedViewLevels(), true)
                || !empty($stored->group_id) && ((int) $stored->group_state !== 1 || !in_array((int) $stored->group_access, $app->getIdentity()->getAuthorisedViewLevels(), true))
                || $stored->value !== ($field->rawvalue ?? $field->value)) return null;
            (new AdapterRegistry($app))->getReadable('articles')->getReadableResource('article:' . (int) $item->id);
            return new self(array_map(static fn ($entry) => CollectionResources::key($entry['selection']), SelectionFieldValue::decode($stored->value)['items']), self::reader());
        } catch (\Throwable $error) { return null; }
    }

    public function permits(array $reference): bool
    {
        return $this->reader === self::reader() && in_array(CollectionResources::key($reference), $this->references, true);
    }
}
