<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Component\ComponentHelper;
use SuperSoft\Component\Smartbrowser\Administrator\Support\DirectLinkUri;
use SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceDescriptor;

defined('_JEXEC') or die;

final class DirectLinksAdapter implements ResourceAdapterInterface, ReadableResourceAdapterInterface
{
    private const ICONS = ['web'=>'fas fa-globe', 'mail'=>'fas fa-at', 'tel'=>'fas fa-phone', 'fragment'=>'fas fa-anchor', 'joomla'=>'fab fa-joomla'];
    public function __construct(private ?object $app = null) {}
    private function allRoots(): array
    {
        return array_map(static fn ($type) => ['id'=>'direct-links:'.$type, 'title'=>Text::_('COM_SMARTBROWSER_LINK_'.strtoupper($type)),
            'kind'=>'node','type'=>'uri-node','icon'=>self::ICONS[$type],'openIcon'=>self::ICONS[$type],'closedIcon'=>self::ICONS[$type],'useResourceIcon'=>true,'image'=>null,'selectable'=>false,'navigable'=>true,
            'hasChildren'=>false,'capabilities'=>['open'=>true,'createVirtual'=>true],'metadata'=>['uriType'=>$type]], array_keys(self::ICONS));
    }
    public function getId(): string { return 'direct-links'; }
    public function getRoots(): array
    {
        $config = json_decode($this->app?->getInput()->getString('adapterOptions', '{}') ?? '{}', true, 8);
        $nodes = $config['direct-links']['nodes'] ?? array_keys(self::ICONS);
        if (!is_array($nodes) || !$nodes || count($nodes) > count(self::ICONS)
            || count(array_filter($nodes, 'is_string')) !== count($nodes) || array_diff($nodes, array_keys(self::ICONS))) throw new \InvalidArgumentException('Invalid Direct Links nodes.', 400);
        return array_values(array_filter($this->allRoots(), static fn ($root) => in_array($root['metadata']['uriType'], $nodes, true)));
    }
    public function getResources(string $nodeId, array $options = []): array
    {
        $node = $this->getResource($nodeId); $items=[];
        if ($node['kind'] !== 'node') throw new \InvalidArgumentException('Invalid URI node',400);
        foreach ($options['selection'] ?? [] as $entry) {
            $reference=$entry['selection'];
            if ($reference['adapter'] !== $this->getId()) continue;
            try { $resource=$this->getResource($reference['id']); }
            catch (\InvalidArgumentException $error) { continue; } // Invalid retained references remain removable in the collection.
            if ($resource['parentId'] === $nodeId) $items[]=$resource;
        }
        $actions=$this->getActions(); $actions[0]['label']='COM_SMARTBROWSER_LINK_CREATE_'.strtoupper($node['metadata']['uriType']);
        return ['nodeId'=>$nodeId,'nodes'=>[],'items'=>$items,'currentResource'=>$node,'breadcrumb'=>[$node],
            'actions'=>$actions,'presentation'=>$this->getCollectionPresentation()];
    }
    public function getResource(string $id, array $options = []): array
    {
        foreach ($this->allRoots() as $root) if ($root['id'] === $id) return $root;
        [$type,$uri]=DirectLinkUri::decode($id);
        $title = match ($type) {
            'mail' => substr($uri, 7), 'tel' => substr($uri, 4), 'fragment' => rawurldecode(substr($uri, 1)),
            default => (parse_url($uri, PHP_URL_HOST) ?: '') . rawurldecode(rtrim((string) parse_url($uri, PHP_URL_PATH), '/')) ?: rawurldecode($uri),
        };
        if ($type === 'web' && $uri === '/') $title = Text::_('COM_SMARTBROWSER_LINK_HOME_PAGE');
        if ($type === 'joomla') {
            $parts = DirectLinkUri::joomlaParts($uri);
            $title = $this->componentTitle($parts['option']) . ' (' . $parts['view']
                . (isset($parts['id']) ? ' #' . $parts['id'] : '') . ')';
        }
        $customName = DirectLinkUri::name($id);
        if ($customName !== '') $title = $customName;
        return ResourceDescriptor::complete(['id'=>$id,'title'=>$title,'subtitle'=>$uri,'kind'=>'item','type'=>'uri',
            'uniquenessId'=>explode('.', $id, 2)[0],
            'parentId'=>'direct-links:'.$type,'icon'=>self::ICONS[$type],'image'=>null,'selectable'=>true,'navigable'=>false,
            'capabilities'=>['edit'=>true, 'renameVirtual'=>true, 'delete'=>true], 'metadata'=>['uri'=>$uri,'url'=>$uri,'linkName'=>$customName,
                'effectiveAddress'=>in_array($type, ['web','joomla'], true) && $this->app !== null ? DirectLinkUri::webAddress($uri, 'absolute', Uri::root()) : $uri,
                'uriType'=>$type,'uriTypeLabel'=>Text::_('COM_SMARTBROWSER_LINK_'.strtoupper($type))]], $this->getCollectionPresentation());
    }
    public function getReadableResource(string $id): array
    {
        $resource=$this->getResource($id);
        if ($resource['kind'] !== 'item') throw new \RuntimeException('Not readable',403);
        $resource['capabilities']=[];
        return $resource;
    }
    public function getBreadcrumb(string $id): array { return [$this->getResource($id)]; }
    public function getActions(array $selection = []): array
    {
        return [
            ['id'=>'createVirtual','label'=>'COM_SMARTBROWSER_LINK_CREATE','icon'=>'fas fa-plus','currentNode'=>true,'requiresSelection'=>false,'selectionScoped'=>true,'creationRole'=>'item','resourceType'=>'uri'],
            ['id'=>'edit','label'=>'JACTION_EDIT','icon'=>'fas fa-pen','requiresSelection'=>true,'single'=>true,'itemsOnly'=>true,'selectionScoped'=>true,'modifiedDefault'=>true],
            ['id'=>'delete','label'=>'JACTION_DELETE','icon'=>'fas fa-trash-alt','requiresSelection'=>true,'itemsOnly'=>true,'selectionScoped'=>true,'localState'=>true,'confirm'=>false],
            ['id'=>'renameVirtual','label'=>'COM_SMARTBROWSER_ACTION_RENAME','icon'=>'fas fa-i-cursor','requiresSelection'=>true,'single'=>true,'itemsOnly'=>true,'selectionScoped'=>true],
        ];
    }
    public function getCollectionPresentation(array $resources = []): array
    {
        return ['selectionScoped'=>true,'sortFields'=>[['id'=>'title','label'=>'COM_SMARTBROWSER_NAME'], ['id'=>'url','label'=>'COM_SMARTBROWSER_URL'], ['id'=>'effectiveAddress','label'=>'COM_SMARTBROWSER_LINK_EFFECTIVE_ADDRESS'], ['id'=>'uriTypeLabel','label'=>'COM_SMARTBROWSER_TYPE']],
            'columns'=>[['id'=>'title','label'=>'COM_SMARTBROWSER_NAME','source'=>'title'], ['id'=>'url','label'=>'COM_SMARTBROWSER_URL','source'=>'metadata.url'],
                ['id'=>'effectiveAddress','label'=>'COM_SMARTBROWSER_LINK_EFFECTIVE_ADDRESS','source'=>'metadata.effectiveAddress']],
            'gridFields'=>[['label'=>'COM_SMARTBROWSER_URL','source'=>'metadata.url','icon'=>'fas fa-link','identifier'=>true]],
            'infoFields'=>[['label'=>'COM_SMARTBROWSER_URL','source'=>'metadata.url'],['label'=>'COM_SMARTBROWSER_LINK_EFFECTIVE_ADDRESS','source'=>'metadata.effectiveAddress'],['label'=>'COM_SMARTBROWSER_TYPE','source'=>'metadata.uriTypeLabel','sortField'=>'uriTypeLabel']]];
    }
    public function executeAction(string $action, array $selection, array $payload = []): mixed
    {
        if (in_array($action, ['createVirtual', 'edit', 'renameVirtual'], true)) {
            $old=$action !== 'createVirtual' && count($selection)===1 ? $this->getResource($selection[0]) : null;
            $node=$this->getResource($old['parentId'] ?? ($payload['nodeId'] ?? ''));
            if ($node['kind'] !== 'node') throw new \InvalidArgumentException('Invalid URI node',400);
            $type=$node['metadata']['uriType'];
            $value=$old['metadata']['uri'] ?? '';
            if ($type==='mail') $value=preg_replace('/^mailto:/','',$value);
            if ($type==='tel') $value=preg_replace('/^tel:/','',$value);
            if ($type==='fragment') $value=rawurldecode(ltrim($value,'#'));
            $fields=[['name'=>'value','label'=>'COM_SMARTBROWSER_LINK_'.strtoupper($type),'type'=>'text','value'=>$value,'required'=>true,'maxlength'=>1400]];
            if ($type === 'web') $fields[0]['warningPattern']='\\s|^(?!(?:https?://|/|\\?|\\.))';
            if ($type === 'tel') $fields[]=['name'=>'countryPrefix','type'=>'hidden','contextValue'=>'phoneCountryPrefix','value'=>''];
            if ($type === 'fragment') $fields[0]['suggestions'] = 'anchors';
            if ($type === 'web') $fields[] = ['name'=>'addressMode','label'=>'COM_SMARTBROWSER_LINK_ADDRESS_MODE','type'=>'segmented','value'=>'auto', 'options'=>array_map(static fn ($mode) => ['value'=>$mode,'label'=>'COM_SMARTBROWSER_LINK_MODE_'.strtoupper($mode)], ['auto','absolute','relative'])];
            if ($type === 'joomla') {
                $parts=DirectLinkUri::joomlaParts($value) ?? [];
                $catalog=$this->joomlaViews();
                $fields=[['name'=>'option','label'=>'COM_SMARTBROWSER_LINK_COMPONENT','type'=>'text','value'=>$parts['option'] ?? '', 'required'=>true,'suggestions'=>array_keys($catalog)],
                    ['name'=>'view','label'=>'COM_SMARTBROWSER_LINK_VIEW','type'=>'text','value'=>$parts['view'] ?? '', 'required'=>true,'suggestionsBy'=>'option','suggestions'=>$catalog],
                    ['name'=>'id','label'=>'COM_SMARTBROWSER_LINK_ID','type'=>'text','value'=>$parts['id'] ?? '', 'maxlength'=>10]];
                if ($catalog) {
                    if (isset($parts['option'], $parts['view'])) $catalog[$parts['option']] = array_values(array_unique(array_merge($catalog[$parts['option']] ?? [], [$parts['view']])));
                    $fields[0]['type']='select'; $fields[0]['value']=$parts['option'] ?? array_key_first($catalog);
                    $fields[0]['options']=array_map(fn ($option) => ['value'=>$option,'label'=>$this->componentTitle($option)], array_keys($catalog));
                    $fields[1]['type']='select'; $fields[1]['dependsOn']='option'; $fields[1]['options']=[];
                    foreach ($catalog as $option=>$views) foreach ($views as $view) $fields[1]['options'][]=['value'=>$view,'label'=>$view,'parent'=>$option];
                    unset($fields[0]['suggestions'], $fields[1]['suggestions'], $fields[1]['suggestionsBy']);
                }
            }
            if ($action === 'renameVirtual') $fields=[['name'=>'resourceId','type'=>'hidden','value'=>$old['id']]];
            $fields[]=['name'=>'name','label'=>'COM_SMARTBROWSER_NAME','type'=>'text','value'=>$old['metadata']['linkName'] ?? '',
                'placeholder'=>$old['title'] ?? '', 'placeholderFrom'=>$type === 'joomla' ? null : 'value',
                'computedPlaceholder'=>true, 'hint'=>'COM_SMARTBROWSER_LINK_NAME_AUTO','maxlength'=>256];
            return ['command'=>'selectionEditor','action'=>$action === 'renameVirtual' ? 'renameVirtualResource' : 'resolveVirtual','nodeId'=>$node['id'],
                'label'=> $action === 'renameVirtual' ? 'COM_SMARTBROWSER_ACTION_RENAME' : ($old ? 'JACTION_EDIT' : 'COM_SMARTBROWSER_LINK_CREATE_'.strtoupper($type)),
                'fields'=>$fields];
        }
        if ($action === 'renameVirtualResource') {
            $old=$this->getResource((string) ($payload['resourceId'] ?? ''));
            if ($old['kind'] !== 'item') throw new \InvalidArgumentException('Invalid link.', 400);
            $type=$old['metadata']['uriType'];
            $reference=DirectLinkUri::reference($type === 'joomla' ? 'web' : $type, $old['metadata']['uri'], (string) ($payload['name'] ?? ''));
            return ['resource'=>$this->getResource($reference['id'])];
        }
        if ($action !== 'resolveVirtual') throw new \InvalidArgumentException('Unknown action',400);
        $node=$this->getResource($payload['nodeId'] ?? '');
        if ($node['kind'] !== 'node') throw new \InvalidArgumentException('Invalid URI node',400);
        $type=$node['metadata']['uriType'];
        $value=(string) ($payload['value'] ?? '');
        if ($type === 'joomla') $value=DirectLinkUri::joomlaPath((string) ($payload['option'] ?? ''), (string) ($payload['view'] ?? ''), (string) ($payload['id'] ?? ''));
        if ($type === 'web' && $this->app !== null) $value=DirectLinkUri::webAddress($value, (string) ($payload['addressMode'] ?? 'auto'), Uri::root());
        $name=(string) ($payload['name'] ?? '');
        if ($type === 'tel') {
            $original=$value;
            $value=DirectLinkUri::telephone($value, (string) ($payload['countryPrefix'] ?? ''));
            if (trim($name) === '' && $value !== DirectLinkUri::normalize('tel', $original)) $name=$original;
            elseif (trim($name) === '' && preg_match('/[ ().-]/', $original)) $name=$original;
        }
        $reference=DirectLinkUri::reference($type === 'joomla' ? 'web' : $type, $value, $name);
        return ['resource'=>$this->getResource($reference['id'])];
    }

    private function componentTitle(string $option): string
    {
        if ($this->app !== null && method_exists($this->app, 'getLanguage')) {
            $language = $this->app->getLanguage();
            foreach (['JPATH_ADMINISTRATOR', 'JPATH_SITE'] as $path) {
                if (defined($path)) $language->load($option . '.sys', constant($path));
            }
        }
        $key = strtoupper($option);
        $title = Text::_($key);
        return $title !== $key ? $title : ucwords(str_replace('_', ' ', substr($option, 4)));
    }

    private function joomlaViews(): array
    {
        if (!defined('JPATH_SITE')) return [];
        $catalog=[];
        foreach (glob(JPATH_SITE.'/components/com_*', GLOB_ONLYDIR) ?: [] as $directory) {
            $option=basename($directory);
            if (!ComponentHelper::isEnabled($option)) continue;
            $views=[];
            foreach (['tmpl','views','src/View'] as $folder) foreach (glob($directory.'/'.$folder.'/*', GLOB_ONLYDIR) ?: [] as $view) {
                $name=strtolower(basename($view));
                if (preg_match('/^[a-z][a-z0-9_]*$/D', $name)) $views[]=$name;
            }
            if ($views) $catalog[$option]=array_values(array_unique($views));
        }
        ksort($catalog);
        return $catalog;
    }
}
