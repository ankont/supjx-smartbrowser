<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Model;

use Joomla\Component\Content\Administrator\Model\FeatureModel;

defined('_JEXEC') or die;

final class FeaturedOrderModel extends FeatureModel
{
    protected function canEditState($record)
    {
        return !empty($record->content_id)
            && $this->getCurrentUser()->authorise('core.edit.state', 'com_content.article.' . (int) $record->content_id);
    }
}
