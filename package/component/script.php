<?php
defined('_JEXEC') or die;
use Joomla\CMS\Factory;
use Joomla\CMS\Installer\InstallerAdapter;
use Joomla\CMS\Installer\InstallerScriptInterface;
use Joomla\Database\DatabaseInterface;

return new class implements InstallerScriptInterface {
    private bool $upgradeVisuals = false;
    public function install(InstallerAdapter $adapter): bool { return true; }
    public function update(InstallerAdapter $adapter): bool { return true; }
    public function uninstall(InstallerAdapter $adapter): bool { return true; }
    public function preflight(string $type, InstallerAdapter $adapter): bool
    {
        if ($type !== 'update') return true;
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)->select($db->quoteName('manifest_cache'))->from($db->quoteName('#__extensions'))
            ->where($db->quoteName('type') . ' = ' . $db->quote('component'))
            ->where($db->quoteName('element') . ' = ' . $db->quote('com_smartbrowser'));
        $manifest = json_decode((string) $db->setQuery($query)->loadResult(), true);
        $this->upgradeVisuals = isset($manifest['version']) && version_compare($manifest['version'], '2.0.0', '<');
        return true;
    }
    public function postflight(string $type, InstallerAdapter $adapter): bool
    {
        if (!$this->upgradeVisuals || $type !== 'update') return true;
        require_once JPATH_ADMINISTRATOR . '/components/com_smartbrowser/src/Support/VisualRulesUpgrade.php';
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)->select($db->quoteName(['extension_id', 'params']))->from($db->quoteName('#__extensions'))
            ->where($db->quoteName('type') . ' = ' . $db->quote('component'))
            ->where($db->quoteName('element') . ' = ' . $db->quote('com_smartbrowser'));
        $extension = $db->setQuery($query)->loadObject();
        if (!$extension) return true;
        $params = json_decode($extension->params, true, 512, JSON_THROW_ON_ERROR);
        $params = \SuperSoft\Component\Smartbrowser\Administrator\Support\VisualRulesUpgrade::params($params);
        $query = $db->getQuery(true)->update($db->quoteName('#__extensions'))
            ->set($db->quoteName('params') . ' = ' . $db->quote(json_encode($params, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR)))
            ->where($db->quoteName('extension_id') . ' = ' . (int) $extension->extension_id);
        $db->setQuery($query)->execute();
        Factory::getApplication()->setUserState('com_config.edit.component.data', null);
        return true;
    }
};
