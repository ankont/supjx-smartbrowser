<?php
namespace Joomla\CMS\Language { class Text { public static function _($key) { return $key === 'COM_SIMPLENEWSLETTER' ? 'Simple Newsletter' : $key; } } }
namespace Joomla\CMS\Uri { class Uri { public static function root() { return 'http://localhost:8089/'; } } }
namespace {
define('_JEXEC',1);
$base=__DIR__.'/../package/component/admin/src/';
foreach (['Adapter/ResourceAdapterInterface.php','Adapter/ReadableResourceAdapterInterface.php','Support/ResourceDescriptor.php',
    'Support/DirectLinkUri.php','Adapter/DirectLinksAdapter.php','Support/CollectionResources.php','Support/SelectionFieldValue.php'] as $file) require $base.$file;
use SuperSoft\Component\Smartbrowser\Administrator\Support\DirectLinkUri;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionFieldValue;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\DirectLinksAdapter;
$check=static function($condition,$message) { if (!$condition) throw new \RuntimeException($message); };
$adapter=new DirectLinksAdapter();
$named=DirectLinkUri::reference('web', '/contact', 'Contact us');
$check($adapter->getReadableResource($named['id'])['title'] === 'Contact us', 'Named reference lost its title');
$check(DirectLinkUri::decode($named['id']) === ['web','/contact'], 'Name changed URI');
$stored=['version'=>1,'items'=>[['selection'=>$named,'usage'=>[]]]];
$check(SelectionFieldValue::decode(SelectionFieldValue::encode($stored))['items'] === $stored['items'], 'Named reference storage changed');
$check(DirectLinkUri::telephone('210 (123) 4567', '+30') === 'tel:+302101234567', 'Configured phone prefix');
$check(DirectLinkUri::telephone('+44 123456789', '+30') === 'tel:+44123456789', 'International prefix replaced');
$check(DirectLinkUri::telephone('0044 123456789', '+30') === 'tel:+44123456789', 'International 00 prefix not recognized');
$check(DirectLinkUri::telephone('210 1234567', '') === 'tel:2101234567', 'Unconfigured country guessed');
$phone=$adapter->executeAction('resolveVirtual', [], ['nodeId'=>'direct-links:tel','value'=>'210 (123) 4567','countryPrefix'=>'+30']);
$check($phone['resource']['title'] === '210 (123) 4567' && $phone['resource']['metadata']['url'] === 'tel:+302101234567', 'Phone display formatting lost');
$rename=$adapter->executeAction('renameVirtual', [$named['id']]);
$payload=['nodeId'=>$rename['nodeId']]; foreach ($rename['fields'] as $field) $payload[$field['name']]=$field['value'];
$payload['name']='Support';
$renamed=$adapter->executeAction($rename['action'], [], $payload)['resource'];
$check($renamed['title'] === 'Support' && $renamed['metadata']['uri'] === '/contact', 'Rename altered destination');
$absolute=DirectLinkUri::reference('web','https://localhost:8089/','Local');
$renamedAbsolute=$adapter->executeAction('renameVirtualResource', [], ['resourceId'=>$absolute['id'], 'name'=>'Start'])['resource'];
$check($renamedAbsolute['metadata']['uri'] === 'https://localhost:8089/', 'Rename reapplied address normalization');
try { SelectionFieldValue::decode(json_encode(['version'=>1,'items'=>[['selection'=>$named],['selection'=>DirectLinkUri::reference('web','/contact','Other')]]])); throw new \RuntimeException('Named duplicate accepted'); }
catch (\InvalidArgumentException $error) {}
$check(($adapter->getActions()[1]['modifiedDefault'] ?? false) === true, 'Direct Links edit is not the secondary default');
$check(($adapter->getActions()[2]['confirm'] ?? true) === false, 'Virtual deletion still asks for confirmation');
$check($adapter->getResource(DirectLinkUri::reference('web','/')['id'])['title'] === 'COM_SMARTBROWSER_LINK_HOME_PAGE', 'Root URI has no friendly home title');
foreach ([['web','HTTPS://EXAMPLE.COM/Page?A=1','https://example.com/Page?A=1'],['web','/index.php?option=com_content','/index.php?option=com_content'],
    ['mail','info@EXAMPLE.COM','mailto:info@example.com'],['tel','+30 210 1234567','tel:+302101234567'],['fragment','section1','#section1']] as [$type,$input,$uri]) {
    $ref=DirectLinkUri::reference($type,$input);
    $resource=$adapter->getReadableResource($ref['id']);
    $check($resource['metadata']['uri']===$uri && $resource['subtitle']===$uri && $resource['title'] && !$resource['capabilities'],'Public resolution failed');
    $check(count(array_filter($resource['infoFields'], static fn ($field) => $field['label'] === 'COM_SMARTBROWSER_URL')) === 1, 'Duplicate URL information');
    $value=['version'=>1,'items'=>[['selection'=>$ref,'usage'=>['visual.iconOverride'=>'fas fa-book']]]];
    $check(SelectionFieldValue::decode(SelectionFieldValue::encode($value))['items']===$value['items'],'Stored reference cycle changed');
    $node='direct-links:'.$type;
    $root=$adapter->getResource($node);
    $check($root['icon']===$resource['icon'] && $root['openIcon']===$resource['icon'] && $root['useResourceIcon'], 'URI navigation icon differs from item');
    $listing=$adapter->getResources($node,['selection'=>$value['items']]);
    $check(count($listing['items'])===1 && $listing['items'][0]['id']===$ref['id'],'Selection-scoped listing failed');
    $edit=$adapter->executeAction('edit',[$ref['id']]);
    $saved=$adapter->executeAction($edit['action'],[],['nodeId'=>$edit['nodeId'],'value'=>$edit['fields'][0]['value']]);
    $check($saved['resource']['id']===$ref['id'],'Edit normalization changed identity');
}
foreach (['javascript:alert(1)','data:text/plain,test','//evil.example/','https://user:pass@example.com/',"https://example.com/%0aheader",'file:///etc/passwd','foo:bar','<script>'] as $uri) {
    try { DirectLinkUri::reference('web',$uri); throw new \RuntimeException('Unsafe URI accepted'); }
    catch (\InvalidArgumentException $error) { $check($error->getCode()===400,'Wrong validation failure'); }
}
$check(count($adapter->getRoots())===5,'Node count changed');
$check(DirectLinkUri::webAddress('https://example.com/site/page?a=1&b=2', 'auto', 'https://example.com/site/') === '/site/page?a=1&b=2', 'Internal auto conversion');
$check(DirectLinkUri::webAddress('page#part', 'absolute', 'https://example.com/site/') === 'https://example.com/site/page#part', 'Absolute conversion');
$check(DirectLinkUri::webAddress('https://external.example/page', 'auto', 'https://example.com/') === 'https://external.example/page', 'External destination changed');
$check(DirectLinkUri::webAddress('https://external.example/', 'relative', 'https://example.com/') === '/', 'Explicit relative conversion failed');
$check(DirectLinkUri::webAddress('https://external.example/Page?a=1&b=2#part', 'relative', 'https://example.com/') === '/Page?a=1&b=2#part', 'Relative conversion lost URI data');
$check(DirectLinkUri::webAddress('https://localhost:8089/', 'auto', 'http://localhost:8089/') === '/', 'Same local site was not recognized across schemes');
$check(DirectLinkUri::webAddress('https://example.com/', 'auto', 'http://example.com/') === '/', 'Default ports mismatch');
$check(DirectLinkUri::webAddress('https://localhost:8090/', 'auto', 'http://localhost:8089/') === 'https://localhost:8090/', 'Different port was treated as internal');
$check(DirectLinkUri::webAddress('https://localhost:8089/', 'absolute', 'http://localhost:8089/') === 'https://localhost:8089/', 'Explicit absolute input changed');
$check(DirectLinkUri::webAddress('https://external.example//path', 'relative', 'https://example.com/') === '/.//path', 'Relative conversion created a protocol-relative URL');
$path=DirectLinkUri::joomlaPath('com_content','article','42');
$ref=DirectLinkUri::reference('web',$path);
$check(DirectLinkUri::decode($ref['id']) === ['joomla',$path], 'Joomla identity classification');
$check($adapter->getReadableResource($ref['id'])['parentId'] === 'direct-links:joomla', 'Joomla public descriptor');
$newsletter=DirectLinkUri::reference('web', DirectLinkUri::joomlaPath('com_simplenewsletter', 'form', '3'));
$check($adapter->getReadableResource($newsletter['id'])['title'] === 'Simple Newsletter (form #3)', 'Translated component title missing');
$definition=$adapter->executeAction('createVirtual', [], ['nodeId'=>'direct-links:joomla']);
$check($definition['fields'][count($definition['fields'])-1]['computedPlaceholder'] === true, 'Joomla automatic name hint disabled');
$prediction=$adapter->executeAction('resolveVirtual', [], ['nodeId'=>'direct-links:joomla','option'=>'com_simplenewsletter','view'=>'form','id'=>'3','name'=>'']);
$check($prediction['resource']['title'] === 'Simple Newsletter (form #3)', 'Joomla name prediction differs from resolved title');
$fallback=DirectLinkUri::reference('web', DirectLinkUri::joomlaPath('com_custom_tool', 'form', ''));
$check($adapter->getReadableResource($fallback['id'])['title'] === 'Custom Tool (form)', 'Component fallback or optional ID label failed');
$edit=$adapter->executeAction('edit',[$ref['id']]);
$payload=['nodeId'=>$edit['nodeId']]; foreach ($edit['fields'] as $field) $payload[$field['name']]=$field['value'];
$check($adapter->executeAction('resolveVirtual',[], $payload)['resource']['id'] === $ref['id'], 'Joomla edit cycle');
foreach ([['com_content','article','-1'],['com_content','article','1&x=2'],['javascript:test','article','42']] as $parts) {
    try { DirectLinkUri::joomlaPath(...$parts); throw new \RuntimeException('Unsafe Joomla path'); }
    catch (\InvalidArgumentException $error) {}
}
$app=new class { public function getInput() { return new class { public function getString($key,$default) { return '{"direct-links":{"nodes":["fragment","joomla"]}}'; } }; } };
$limited=new DirectLinksAdapter($app);
$local=$limited->getReadableResource(DirectLinkUri::reference('web','/page?a=1&b=2')['id']);
$check($local['metadata']['url'] === '/page?a=1&b=2' && $local['metadata']['effectiveAddress'] === 'http://localhost:8089/page?a=1&b=2', 'Returned and effective addresses are not distinct');
$check($limited->executeAction('resolveVirtual', [], ['nodeId'=>'direct-links:web', 'value'=>'https://localhost:8089/', 'addressMode'=>'auto'])['resource']['metadata']['url'] === '/', 'Editor failed to return root-relative address');
$check(count($limited->getRoots())===2 && $limited->getReadableResource($a = DirectLinkUri::reference('web','https://example.com/')['id'])['kind']==='item', 'Node configuration affected readable references');
$a=DirectLinkUri::reference('web','https://EXAMPLE.com/'); $b=DirectLinkUri::reference('web','https://example.com/');
$check($a===$b,'Equivalent host/scheme normalization differs');
try { SelectionFieldValue::decode(json_encode(['version'=>1,'items'=>[['selection'=>$a],['selection'=>$b]]])); throw new \RuntimeException('Duplicate accepted'); }
catch (\InvalidArgumentException $error) {}
echo "Direct Links URI validation, guest descriptors, editor round trips, canonical uniqueness and storage OK\n";
}
