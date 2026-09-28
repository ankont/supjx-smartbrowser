<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

defined('_JEXEC') or die;

interface BrowseRootAwareInterface
{
    public function configureBrowseRoot(?string $browseRoot): void;
    public function getBrowseRoot(): ?string;
    public function getInitialNode(?string $candidate = null): string;
    public function assertBrowseScope(array $resourceIds): void;
}
