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
    private static array $records = [];
    public static function generation(int $user = 0): string
    {
        $global = (string) ComponentHelper::getParams('com_smartbrowser')->get('preferences_reset_token', '') ?: '0';
        $token = $user ? (self::record($user)['resetToken'] ?? '') : '';
        return $global . ($token !== '' ? ':' . $token : '');
    }
    private static function record(int $user): array
    {
        if (!$user) return [];
        if (isset(self::$records[$user])) return self::$records[$user];
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $raw = $db->setQuery($db->getQuery(true)->select($db->quoteName('profile_value'))->from($db->quoteName('#__user_profiles'))
            ->where($db->quoteName('user_id') . ' = ' . $user)->where($db->quoteName('profile_key') . ' = ' . $db->quote(self::KEY)))->loadResult();
        $data = json_decode((string) $raw, true);
        if (is_array($data) && ($data['generation'] ?? '') !== self::generation()) {
            $db->setQuery($db->getQuery(true)->delete($db->quoteName('#__user_profiles'))
                ->where($db->quoteName('user_id') . ' = ' . $user)->where($db->quoteName('profile_key') . ' = ' . $db->quote(self::KEY))
                ->where($db->quoteName('profile_value') . ' = ' . $db->quote((string) $raw)))->execute();
            return self::$records[$user] = [];
        }
        return self::$records[$user] = is_array($data) && ($data['generation'] ?? '') === self::generation() ? $data : [];
    }
    private static function stored(int $user): array { return (array) (self::record($user)['values'] ?? []); }
    public static function option(string $key, mixed $default = null): mixed
    {
        $id = (int) Factory::getApplication()->getIdentity()->id;
        $personal = json_decode((string) (self::stored($id)['supjx.smartbrowser.personal'] ?? '{}'), true);
        return is_array($personal) ? ($personal[$key] ?? $default) : $default;
    }
    public static function editorMode(bool $site): string
    {
        $mode = self::option('editorMode', 'inherit');
        return in_array($mode, ['modal', 'page'], true) ? $mode : (string) ComponentHelper::getParams('com_smartbrowser')->get($site ? 'editor_site' : 'editor_admin', 'modal');
    }
    /** Summarize administrator defaults without applying the current user's overrides. */
    public static function globalDefaults(object $params, bool $site, string $adapter = ''): array
    {
        $contexts = [];
        foreach (['categories', 'tags', 'menus'] as $type) $contexts[$type] = (bool) $params->get('context_' . $type . ($site ? '_site' : '_admin'), 0);
        $adapter = preg_replace('/^flat-/', '', $adapter);
        $context = isset($contexts[$adapter]) ? ($contexts[$adapter] ? 'show' : 'hide')
            : (count(array_unique($contexts)) > 1 ? 'mixed' : (reset($contexts) ? 'show' : 'hide'));
        $replacements = array_filter($params->toArray(), static fn($value, $key) => str_starts_with($key, 'replace_') && $key !== 'replace_all' && (string) $value === '1', ARRAY_FILTER_USE_BOTH);
        return [
            'editorMode' => (string) $params->get($site ? 'editor_site' : 'editor_admin', 'modal'),
            'loadingMode' => $params->get('loading_mode', 'smart'),
            'pageSize' => max(1, (int) $params->get('page_size', 50)),
            'contextItems' => $context,
            'contextItemsByAdapter' => array_map(static fn($show) => $show ? 'show' : 'hide', $contexts),
            'integration' => (bool) $params->get('replace_all', 0) ? 'enabled' : ($replacements ? 'partial' : 'disabled'),
        ];
    }
    public static function prepareInterface(object $document): void
    {
        self::prepare($document);
        Factory::getApplication()->getLanguage()->load('com_smartbrowser', JPATH_ADMINISTRATOR);
        foreach (array_merge(self::languageKeys(), ['JCANCEL']) as $key) BrowserLanguage::script($key);
        $document->getWebAssetManager()->useScript('com_smartbrowser.personal-preferences');
    }
    public static function languageKeys(): array
    {
        return ['COM_SMARTBROWSER_LOAD_ALL', 'COM_SMARTBROWSER_ITEM_COUNT', 'COM_SMARTBROWSER_PERSONAL_VALUE_SMART', 'COM_SMARTBROWSER_LOAD_MORE', 'COM_SMARTBROWSER_SELECT_ALL_LOADED', 'COM_SMARTBROWSER_INVERT_SELECTION_LOADED', 'COM_SMARTBROWSER_PERSONAL_PAGE_SIZE', 'COM_SMARTBROWSER_PERSONAL_PAGE_SIZE_DESC', 'COM_SMARTBROWSER_SELECT_ALL_PAGE', 'COM_SMARTBROWSER_INVERT_SELECTION_PAGE', 'COM_SMARTBROWSER_PERSONAL_LOADING', 'COM_SMARTBROWSER_PERSONAL_LOADING_DESC', 'COM_SMARTBROWSER_PERSONAL_VALUE_ALL', 'COM_SMARTBROWSER_PERSONAL_VALUE_PAGES', 'COM_SMARTBROWSER_PAGINATION', 'COM_SMARTBROWSER_PAGE_PREVIOUS', 'COM_SMARTBROWSER_PAGE_NEXT', 'COM_SMARTBROWSER_PAGE_RANGE', 'COM_SMARTBROWSER_PAGE_SIZE', 'COM_SMARTBROWSER_PAGE_SELECTION', 'COM_SMARTBROWSER_PERSONAL_CONTEXT_CATEGORIES', 'COM_SMARTBROWSER_PERSONAL_CONTEXT_TAGS', 'COM_SMARTBROWSER_PERSONAL_CONTEXT_MENUS', 'COM_SMARTBROWSER_ADAPTER_CATEGORIES', 'COM_SMARTBROWSER_ADAPTER_TAGS', 'COM_SMARTBROWSER_ADAPTER_MENUS', 'JINLINEHELP', 'COM_SMARTBROWSER_PERSONAL_SAVE_CLOSE', 'COM_SMARTBROWSER_PERSONAL_EDITOR_DESC', 'COM_SMARTBROWSER_PERSONAL_CONTEXT_DESC', 'COM_SMARTBROWSER_PERSONAL_INTEGRATION_DESC', 'COM_SMARTBROWSER_PERSONAL_STATE_SCOPE_DESC', 'COM_SMARTBROWSER_PERSONAL_NODE_SCOPE_DESC', 'COM_SMARTBROWSER_PERSONAL_VALUE_MIXED', 'COM_SMARTBROWSER_PERSONAL_VALUE_ENABLED', 'COM_SMARTBROWSER_PERSONAL_VALUE_DISABLED', 'COM_SMARTBROWSER_PERSONAL_VALUE_PARTIAL', 'COM_SMARTBROWSER_PERSONAL_TITLE', 'COM_SMARTBROWSER_PERSONAL_DESCRIPTION', 'COM_SMARTBROWSER_PERSONAL_EDITOR', 'COM_SMARTBROWSER_PERSONAL_CONTEXT', 'COM_SMARTBROWSER_PERSONAL_INTEGRATION', 'COM_SMARTBROWSER_PERSONAL_STATE_SCOPE', 'COM_SMARTBROWSER_PERSONAL_NODE_SCOPE', 'COM_SMARTBROWSER_PERSONAL_VALUE_INHERIT', 'COM_SMARTBROWSER_PERSONAL_VALUE_MODAL', 'COM_SMARTBROWSER_PERSONAL_VALUE_PAGE', 'COM_SMARTBROWSER_PERSONAL_VALUE_SHOW', 'COM_SMARTBROWSER_PERSONAL_VALUE_HIDE', 'COM_SMARTBROWSER_PERSONAL_VALUE_SMARTBROWSER', 'COM_SMARTBROWSER_PERSONAL_VALUE_NATIVE', 'COM_SMARTBROWSER_PERSONAL_VALUE_CALLER', 'COM_SMARTBROWSER_PERSONAL_VALUE_ADAPTER', 'COM_SMARTBROWSER_PERSONAL_RESET_VIEW', 'COM_SMARTBROWSER_PERSONAL_RESET_ALL', 'COM_SMARTBROWSER_PERSONAL_RESET_DONE', 'COM_SMARTBROWSER_PERSONAL_SAVE_FAILED', 'COM_SMARTBROWSER_HISTORY_TITLE', 'COM_SMARTBROWSER_HISTORY_BACK', 'COM_SMARTBROWSER_HISTORY_EMPTY', 'COM_SMARTBROWSER_HISTORY_CLEAR'];
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
        $document->addScriptOptions('com_smartbrowser.preferences', ['userId' => $id, 'generation' => self::generation($id),
            'context' => $context, 'globalDefaults' => self::globalDefaults(ComponentHelper::getParams('com_smartbrowser'), $app->isClient('site'), $input->getCmd('adapter', '')), 'editorDefault' => (string) ComponentHelper::getParams('com_smartbrowser')->get($app->isClient('site') ? 'editor_site' : 'editor_admin', 'modal'),
            'values' => self::stored($id), 'apiUrl' => Uri::base() . 'index.php?option=com_smartbrowser&task=api.preferences&format=json', 'csrfToken' => Session::getFormToken()]);
    }
    public static function validate(array $changes): void
    {
        if (count($changes) > 100 || strlen(json_encode($changes, JSON_THROW_ON_ERROR)) > 262144) throw new \InvalidArgumentException('Preferences too large.', 400);
        foreach ($changes as $key => $value) {
            if (!is_string($key) || !preg_match('/^[a-zA-Z][^\x00-\x20\x7f]{0,239}$/D', $key) || in_array($key, ['__proto__', 'constructor', 'prototype'], true)
                || $value !== null && (!is_string($value) || strlen($value) > 32768)) throw new \InvalidArgumentException('Invalid preference.', 400);
            if ($key === 'supjx.smartbrowser.personal' && $value !== null) {
                $settings = json_decode($value, true, 8, JSON_THROW_ON_ERROR);
                $allowed = ['pageSize' => null, 'loadingMode' => ['inherit', 'all', 'pages', 'smart'], 'editorMode' => ['inherit', 'modal', 'page'], 'contextItems' => ['inherit', 'show', 'hide'], 'contextItemsByAdapter' => null, 'integration' => ['inherit', 'smartbrowser', 'native'], 'pickerStateScope' => ['caller', 'adapter'], 'pickerNodeScope' => ['caller', 'adapter']];
                if (!is_array($settings) || array_diff(array_keys($settings), array_keys($allowed))) throw new \InvalidArgumentException('Invalid personal preference.', 400);
                foreach ($settings as $name => $setting) {
                    if ($name === 'pageSize') {
                        if ($setting !== null && (!is_int($setting) || $setting < 1 || $setting > 9007199254740991)) throw new \InvalidArgumentException('Invalid page size.', 400);
                    } elseif ($name === 'contextItemsByAdapter') {
                        if (!is_array($setting) || array_diff(array_keys($setting), ['categories', 'tags', 'menus'])) throw new \InvalidArgumentException('Invalid contextual preference.', 400);
                        foreach ($setting as $value) if (!in_array($value, ['inherit', 'show', 'hide'], true)) throw new \InvalidArgumentException('Invalid contextual preference.', 400);
                    } elseif (!in_array($setting, $allowed[$name], true)) throw new \InvalidArgumentException('Invalid personal preference.', 400);
                }
            }
        }
    }
    public static function save(int $user, string $generation, array $changes, bool $reset = false): array
    {
        if ($user < 1) throw new \RuntimeException('Authentication required.', 401);
        if ($generation !== self::generation($user)) throw new \RuntimeException('Preferences were reset. Reload the page.', 409);
        self::validate($changes);
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $db->transactionStart();
        try {
            // Serialize patches from concurrent tabs without replacing unrelated keys.
            $db->setQuery('SELECT ' . $db->quoteName('id') . ' FROM ' . $db->quoteName('#__users') . ' WHERE ' . $db->quoteName('id') . ' = ' . $user . ' FOR UPDATE')->loadResult();
            unset(self::$records[$user]);
            if ($generation !== self::generation($user)) throw new \RuntimeException('Preferences were reset. Reload the page.', 409);
            $record = self::record($user);
            $values = $reset ? [] : self::stored($user);
            if ($reset) $changes = [];
            foreach ($changes as $key => $value) { if ($value === null) unset($values[$key]); else $values[$key] = $value; }
            if (count($values) > 300 || strlen(json_encode($values, JSON_THROW_ON_ERROR)) > 60000) throw new \InvalidArgumentException('Too many preferences.', 400);
            $db->setQuery($db->getQuery(true)->delete($db->quoteName('#__user_profiles'))->where($db->quoteName('user_id') . ' = ' . $user)->where($db->quoteName('profile_key') . ' = ' . $db->quote(self::KEY)))->execute();
            $record = ['generation' => self::generation(), 'resetToken' => $reset ? bin2hex(random_bytes(12)) : ($record['resetToken'] ?? ''), 'values' => $values];
            $row = (object) ['user_id' => $user, 'profile_key' => self::KEY, 'profile_value' => json_encode($record, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR), 'ordering' => 1];
            $db->insertObject('#__user_profiles', $row);
            $db->transactionCommit();
            self::$records[$user] = $record;
            return ['saved' => true, 'generation' => self::generation($user)];
        } catch (\Throwable $error) { $db->transactionRollback(); throw $error; }
    }
}
