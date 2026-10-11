<?php
namespace Joomla\CMS\Uri { class Uri { public static string $root='https://site.example/'; public static function root() { return self::$root; } } }
namespace Joomla\Plugin\Filesystem\Local\Adapter {
    class LocalAdapter {
        public ?string $url=null;
        public function getUrl($path) { return $this->url ?? \Joomla\CMS\Uri\Uri::root() . ltrim($path, '/'); }
    }
}
namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter {
    function fopen(...$args) { throw new \RuntimeException('HTTP must not be called'); }
    function file_get_contents(...$args) { throw new \RuntimeException('File contents must not be returned'); }
}
namespace {
define('_JEXEC', 1);
$temp=sys_get_temp_dir().'/sb-native-'.bin2hex(random_bytes(5)); mkdir($temp);
define('JPATH_ROOT', $temp);
require __DIR__.'/../package/component/admin/src/Adapter/MediaReadVisibility.php';
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\MediaReadVisibility as Policy;
use Joomla\Plugin\Filesystem\Local\Adapter\LocalAdapter;
use Joomla\CMS\Uri\Uri;
function check($condition,$message) { if (!$condition) throw new \RuntimeException($message); }
function denied(callable $call) { try { $call(); } catch (\RuntimeException $e) { if ($e->getCode()===403) return; throw $e; } throw new \RuntimeException('Unsafe resource accepted'); }
$provider=new LocalAdapter(); $file=(object)['type'=>'file','mime_type'=>'application/pdf'];
file_put_contents($temp.'/public.pdf', '%PDF-1.4 fixture'); file_put_contents($temp.'/space name.pdf', '%PDF fixture');
try {
    foreach ([['443','on'],['7080','off'],['9443','off'],['','']] as [$port,$https]) {
        $_SERVER['SERVER_PORT']=$port; $_SERVER['HTTPS']=$https; $_SERVER['SERVER_ADDR']='';
        $_SERVER['HTTP_HOST']='attacker.example'; $_SERVER['HTTP_X_FORWARDED_HOST']='127.0.0.1:22';
        check(Policy::assertNativeUrl($provider,'/public.pdf',$file)==='https://site.example/public.pdf','Server/proxy headers affected provider URL');
    }
    check(Policy::assertPublic($provider,'/public.pdf',$file)==='https://site.example/public.pdf','Compatibility alias changed');
    check(Policy::assertNativeUrl($provider,'/space%20name.pdf',$file)==='https://site.example/space%20name.pdf','Encoded filename rejected');
    foreach (['http://site.example/public.pdf','https://site.example.evil/public.pdf','https://user:pass@site.example/public.pdf',
        'https://site.example/public.pdf?token=secret','https://site.example/public.pdf#part','https://site.example/%00file',
        'https://site.example/%2e%2e/outside.pdf','https://site.example/foo%5cbar','https://site.example/%0afile','https://site.example/invalid%ZZ'] as $url) {
        $provider->url=$url; denied(fn()=>Policy::assertNativeUrl($provider,'/public.pdf',$file));
    }
    $provider->url=null;
    denied(fn()=>Policy::assertNativeUrl($provider,'/missing.pdf',$file));
    denied(fn()=>Policy::assertNativeUrl($provider,'/',(object)['type'=>'dir']));
    denied(fn()=>Policy::assertNativeUrl(new class extends LocalAdapter {},'/public.pdf',$file));
    Uri::$root='https://site.example/subsite/';
    check(Policy::assertNativeUrl($provider,'/public.pdf',$file)==='https://site.example/subsite/public.pdf','Subdirectory site failed');
    Uri::$root='http://site.example:8089/';
    check(Policy::assertNativeUrl($provider,'/public.pdf',$file)==='http://site.example:8089/public.pdf','Native HTTP/custom port failed');
    $outside=$temp.'-outside.pdf'; file_put_contents($outside,'private');
    if (@symlink($outside,$temp.'/escape.pdf')) denied(fn()=>Policy::assertNativeUrl($provider,'/escape.pdf',$file));
    echo "Native media URL checks, proxy independence, unsafe inputs, missing files and provider boundaries OK\n";
} finally {
    foreach (glob($temp.'/*') ?: [] as $path) unlink($path);
    rmdir($temp); if (isset($outside) && is_file($outside)) unlink($outside);
}
}
