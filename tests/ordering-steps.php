<?php

define('_JEXEC', 1);
require __DIR__ . '/../package/component/admin/src/Support/OrderingSteps.php';

use SuperSoft\Component\Smartbrowser\Administrator\Support\OrderingSteps;

$cases = [
    [[1, 2, 3, 4, 5], [2, 3], 'up', [2, 3, 1, 4, 5]],
    [[1, 2, 3, 4, 5], [2, 3], 'down', [1, 4, 2, 3, 5]],
    [[1, 2, 3, 4, 5], [1, 2], 'up', [1, 2, 3, 4, 5]],
    [[1, 2, 3, 4, 5], [4, 5], 'down', [1, 2, 3, 4, 5]],
    [[1, 2, 3, 4, 5], [2, 4], 'up', [2, 1, 4, 3, 5]],
    [[1, 2, 3, 4, 5], [2, 4], 'down', [1, 3, 2, 5, 4]],
];

foreach ($cases as [$siblings, $selected, $direction, $expected]) {
    foreach (OrderingSteps::movedIds($siblings, $selected, $direction) as $id) {
        $index = array_search($id, $siblings, true);
        $neighbor = $direction === 'up' ? $index - 1 : $index + 1;
        [$siblings[$index], $siblings[$neighbor]] = [$siblings[$neighbor], $siblings[$index]];
    }
    if ($siblings !== $expected) throw new RuntimeException('Incorrect ordering step for ' . $direction);
}

echo "Ordering steps OK\n";
