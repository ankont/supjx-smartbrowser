<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Model;

use Joomla\CMS\Factory;
use Joomla\Component\Content\Administrator\Model\ArticleModel;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SmartAuthorsAccess;

defined('_JEXEC') or die;

final class SmartAuthorsArticleModel extends ArticleModel
{
    private ?int $targetState = null;

    public function publish(&$pks, $value = 1)
    {
        $this->targetState = (int) $value;
        try {
            return parent::publish($pks, $value);
        } finally {
            $this->targetState = null;
        }
    }

    protected function canEditState($record)
    {
        if ($this->targetState === null) return parent::canEditState($record);
        if (empty($record->id)) return false;

        $app = Factory::getApplication();
        $user = $this->getCurrentUser();
        if (SmartAuthorsAccess::canChangeArticleState($app, $user, $record, $this->targetState)) return true;

        return ($this->targetState === -2 || ($this->targetState === 0 && (int) ($record->state ?? 0) === -2))
            && SmartAuthorsAccess::canTrashArticle($app, $user, $record);
    }
}
