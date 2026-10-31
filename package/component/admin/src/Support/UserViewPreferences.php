<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Factory;
use Joomla\CMS\Session\Session;
use Joomla\CMS\Uri\Uri;
use Joomla\Database\DatabaseInterface;

defined('_JEXEC') or die;

/** User-owned UI preferences in Joomla's existing profile table, never resource data. */
final class UserViewPreferences
{
    private const KEY = 'smartbrowser.preferences';
    private static ?\WeakMap $documents = null;
    public static function generation(): string { return (string) ComponentHelper::getParams('com_smartbrowser')->get('preferences_reset_token', '') ?: '0'; }
    private static function stored(int $user): array
    {
        if (!$user) return [];
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $raw = $db->setQuery($db->getQuery(true)->select($db->quoteName('profile_value'))->from($db->quoteName('#__user_profiles'))
            ->where($db->quoteName('user_id') . ' = ' . $user)->where($db->quoteName('profile_key') . ' = ' . $db->quote(self::KEY)))->loadResult();
        $data = json_decode((string) $raw, true);
        if (is_array($data) && ($data['generation'] ?? '') !== self::generation()) {
            $db->setQuery($db->getQuery(true)->delete($db->quoteName('#__user_profiles'))
                ->where($db->quoteName('user_id') . ' = ' . $user)->where($db->quoteName('profile_key') . ' = ' . $db->quote(self::KEY))
                ->where($db->quoteName('profile_value') . ' = ' . $db->quote((string) $raw)))->execute();
            return [];
        }
        return is_array($data) && ($data['generation'] ?? '') === self::generation() ? (array) ($data['values'] ?? []) : [];
    }
    public static function prepare(object $document): void
    {
        self::$documents ??= new \WeakMap();
        if (isset(self::$documents[$document])) return;
        self::$documents[$document] = true;
        $app = Factory::getApplication();
        $id = (int) $app->getIdentity()->id;
        $input = $app->getInput();
        $context = $input->getCmd('option') === 'com_smartbrowser' ? $input->getCmd('type', 'browser')
            : (['com_content' => 'article', 'com_categories' => 'category', 'com_tags' => 'tag', 'com_menus' => 'menu', 'com_users' => 'user'][$input->getCmd('option')] ?? $input->getCmd('option', 'native'));
        $document->addScriptOptions('com_smartbrowser.preferences', ['userId' => $id, 'generation' => self::generation(),
            'context' => $context, 'values' => self::stored($id), 'apiUrl' => Uri::base() . 'index.php?option=com_smartbrowser&task=api.preferences&format=json', 'csrfToken' => Session::getFormToken()]);
    }
    public static function validate(array $changes): void
    {
        if (count($changes) > 100 || strlen(json_encode($changes, JSON_THROW_ON_ERROR)) > 262144) throw new \InvalidArgumentException('Preferences too large.', 400);
        foreach ($changes as $key => $value) {
            if (!is_string($key) || !preg_match('/^[a-zA-Z][^\x00-\x20\x7f]{0,239}$/D', $key) || in_array($key, ['__proto__', 'constructor', 'prototype'], true)
                || $value !== null && (!is_string($value) || strlen($value) > 32768)) throw new \InvalidArgumentException('Invalid preference.', 400);
        }
    }
    public static function save(int $user, string $generation, array $changes): array
    {
        if ($user < 1) throw new \RuntimeException('Authentication required.', 401);
        if ($generation !== self::generation()) throw new \RuntimeException('Preferences were reset. Reload the page.', 409);
        self::validate($changes);
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $db->transactionStart();
        try {
            // Serialize patches from concurrent tabs without replacing unrelated keys.
            $db->setQuery('SELECT ' . $db->quoteName('id') . ' FROM ' . $db->quoteName('#__users') . ' WHERE ' . $db->quoteName('id') . ' = ' . $user . ' FOR UPDATE')->loadResult();
            $values = self::stored($user);
            foreach ($changes as $key => $value) { if ($value === null) unset($values[$key]); else $values[$key] = $value; }
            if (count($values) > 300 || strlen(json_encode($values, JSON_THROW_ON_ERROR)) > 60000) throw new \InvalidArgumentException('Too many preferences.', 400);
            $db->setQuery($db->getQuery(true)->delete($db->quoteName('#__user_profiles'))->where($db->quoteName('user_id') . ' = ' . $user)->where($db->quoteName('profile_key') . ' = ' . $db->quote(self::KEY)))->execute();
            $row = (object) ['user_id' => $user, 'profile_key' => self::KEY, 'profile_value' => json_encode(['generation' => $generation, 'values' => $values], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR), 'ordering' => 1];
            $db->insertObject('#__user_profiles', $row);
            $db->transactionCommit();
            return ['saved' => true];
        } catch (\Throwable $error) { $db->transactionRollback(); throw $error; }
    }
}
