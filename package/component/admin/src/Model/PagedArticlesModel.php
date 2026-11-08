<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Model;

use Joomla\Component\Content\Administrator\Model\ArticlesModel;

defined('_JEXEC') or die;

/** Retain Joomla filtering/access queries, adding deterministic page ordering. */
final class PagedArticlesModel extends ArticlesModel
{
    protected function getStoreId($id = '')
    {
        return parent::getStoreId($id . ':' . serialize($this->getState('smartbrowser.states')));
    }

    public function getStart()
    {
        // The host already clamps the combined node/item page. Joomla's usual
        // page alignment would shift the final article batch when nodes precede it.
        return max(0, (int) $this->getState('list.start'));
    }

    protected function getListQuery()
    {
        $query = parent::getListQuery();
        $states = $this->getState('smartbrowser.states');
        if (is_array($states)) {
            $query->whereIn($this->getDatabase()->quoteName('a.state'), array_map('intval', $states));
        }
        if ($this->getState('smartbrowser.sort') === null) return $query;
        $field = match ($this->getState('smartbrowser.sort')) {
            'title' => 'a.title', 'alias' => 'a.alias', 'state' => 'a.state',
            'author' => 'ua.name', 'created' => 'a.created', 'language' => 'a.language',
            'id' => 'a.id', 'location' => 'c.lft', 'ordering' => $this->getState('smartbrowser.featured') ? 'fp.ordering' : 'a.ordering',
            default => 'a.modified',
        };
        $direction = $this->getState('list.direction') === 'DESC' ? 'DESC' : 'ASC';
        $query->clear('order');
        if ($field === 'a.ordering') $query->order('c.lft ' . $direction);
        return $query->order($field . ' ' . $direction)->order('a.id ASC');
    }
}
