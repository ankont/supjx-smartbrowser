<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Language\Text;

defined('_JEXEC') or die;

/** The content editor deliberately excludes executable and active document formats. */
final class EditableMedia
{
    public static function kind(string $name, string $mime): ?string
    {
        $extension = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        if (($extension === 'png' && $mime === 'image/png') || (in_array($extension, ['jpg', 'jpeg'], true) && $mime === 'image/jpeg')) return 'image';
        if (in_array($extension, ['txt', 'md', 'csv', 'log'], true) && in_array($mime, ['text/plain', 'text/markdown', 'text/csv'], true)) return 'text';
        return null;
    }

    public static function validate(string $kind, string $mime, string $content): void
    {
        if (strlen($content) > ($kind === 'text' ? 1048576 : 10485760)) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_FILE_EDITOR_TOO_LARGE'), 413);
        if ($kind === 'text') {
            if (str_contains($content, "\0") || !preg_match('//u', $content)) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_FILE_EDITOR_INVALID_TEXT'), 400);
            return;
        }
        $image = @getimagesizefromstring($content);
        if (!$image || ($image['mime'] ?? '') !== $mime) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_FILE_EDITOR_INVALID_IMAGE'), 400);
    }
}
