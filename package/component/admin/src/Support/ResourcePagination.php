<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

defined('_JEXEC') or die;

/** One ordered listing, even when nodes and items are fetched separately. */
final class ResourcePagination
{
    public int $total = 0;
    public int $prefix = 0;

    public function __construct(public int $offset, public readonly int $limit)
    {
        $this->offset = max(0, $offset);
        if ($limit < 1) throw new \InvalidArgumentException('Invalid page size.', 400);
    }

    public function count(int $items): void
    {
        $this->total = $this->prefix + $items;
        $last = $this->total ? intdiv($this->total - 1, $this->limit) * $this->limit : 0;
        $this->offset = min(intdiv($this->offset, $this->limit) * $this->limit, $last);
    }

    public function itemOffset(): int { return max(0, $this->offset - $this->prefix); }
    public function itemLimit(): int { return max(0, $this->limit - max(0, $this->prefix - $this->offset)); }
    public function nodes(array $nodes): array { return array_slice($nodes, $this->offset, $this->limit); }
    public function descriptor(): array
    {
        return ['offset' => $this->offset, 'limit' => $this->limit, 'total' => $this->total,
            'hasMore' => $this->offset + $this->limit < $this->total];
    }
}
