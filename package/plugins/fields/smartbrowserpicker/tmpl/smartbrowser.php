<?php
defined('_JEXEC') or die;

// Presentation belongs to the consuming layout. The fallback is escaped text only.
$titles = [];
foreach ($field->smartbrowser['items'] ?? [] as $selected) {
    if (!$selected['unavailable']) $titles[] = htmlspecialchars((string) ($selected['resource']['title'] ?? ''), ENT_QUOTES, 'UTF-8');
}
echo implode(', ', $titles);
