<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

defined('_JEXEC') or die;

interface ResourceAdapterInterface
{
    public function getId(): string;

    public function getRoots(): array;

    public function getResources(string $nodeId, array $options = []): array;

    public function getResource(string $resourceId, array $options = []): array;

    public function getBreadcrumb(string $nodeId): array;

    public function getActions(array $selection = []): array;


    public function executeAction(string $action, array $selection, array $payload = []): mixed;
}
