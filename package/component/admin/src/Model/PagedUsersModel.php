<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Model;

use Joomla\Component\Users\Administrator\Model\UsersModel;

defined('_JEXEC') or die;

final class PagedUsersModel extends UsersModel
{
    public function getStart() { return max(0, (int) $this->getState('list.start')); }

    protected function getListQuery()
    {
        $query = parent::getListQuery();
        $group = (int) $this->getState('smartbrowser.group');
        if ($group > 0) {
            $query->where('EXISTS (SELECT 1 FROM ' . $this->getDatabase()->quoteName('#__user_usergroup_map')
                . ' sb_group WHERE sb_group.user_id = a.id AND sb_group.group_id = ' . $group . ')');
        }
        return $query->order('a.id ASC');
    }
}
