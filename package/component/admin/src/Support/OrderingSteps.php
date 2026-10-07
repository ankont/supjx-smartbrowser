<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

defined('_JEXEC') or die;

final class OrderingSteps
{
    public static function orderedIds(array $siblings, array $selected, string $direction): array
    {
        if (!in_array($direction, ['up', 'down'], true)) throw new \InvalidArgumentException('Invalid ordering direction.', 400);
        foreach (self::movedIds($siblings, $selected, $direction) as $id) {
            $index = array_search($id, $siblings, true);
            $next = $index + ($direction === 'up' ? -1 : 1);
            [$siblings[$index], $siblings[$next]] = [$siblings[$next], $siblings[$index]];
        }
        return $siblings;
    }
    public static function movedIds(array $siblings, array $selected, string $direction): array
    {
        $selected = array_fill_keys($selected, true);
        $moves = [];
        $count = count($siblings);

        if ($direction === 'up') {
            for ($i = 0; $i < $count; $i++) {
                if (!isset($selected[$siblings[$i]])) continue;
                $start = $i;
                while ($i + 1 < $count && isset($selected[$siblings[$i + 1]])) $i++;
                if ($start === 0) continue;
                for ($j = $start; $j <= $i; $j++) $moves[] = $siblings[$j];
            }
            return $moves;
        }

        for ($i = $count - 1; $i >= 0; $i--) {
            if (!isset($selected[$siblings[$i]])) continue;
            $end = $i;
            while ($i > 0 && isset($selected[$siblings[$i - 1]])) $i--;
            if ($end === $count - 1) continue;
            for ($j = $end; $j >= $i; $j--) $moves[] = $siblings[$j];
        }
        return $moves;
    }
}
