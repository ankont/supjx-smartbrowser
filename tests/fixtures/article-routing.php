<?php
namespace Joomla\CMS\Uri {
    class Uri {
        private string $base; private array $query = [];
        public function __construct($url) {
            $this->base = explode('?', $url, 2)[0];
            parse_str((string) parse_url($url, PHP_URL_QUERY), $this->query);
        }
        public function setVar($key, $value) { $this->query[$key] = $value; }
        public function toString() { return $this->base . ($this->query ? '?' . http_build_query($this->query) : ''); }
        public static function isInternal($url) { return str_starts_with($url, '/') && !str_starts_with($url, '//') || str_starts_with($url, 'index.php'); }
    }
}
namespace Joomla\Component\Content\Site\Helper {
    class RouteHelper {
        public static function getArticleRoute($id, $category, $language) {
            return 'index.php?option=com_content&view=article&id=' . $id . '&catid=' . $category;
        }
    }
}
