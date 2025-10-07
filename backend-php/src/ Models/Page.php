<?php

namespace App\Models;

use Config\Database;
use PDO;

class Page
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getNavPages()
    {
        $stmt = $this->db->query("SELECT * FROM pages WHERE is_active = 1 AND show_in_menu = 1 ORDER BY parent_id ASC, position ASC");
        $pages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $pageMap = [];
        $rootPages = [];

        foreach ($pages as $page) {
            $pageMap[$page['id']] = array_merge($page, ['children' => []]);
        }

        foreach ($pages as $page) {
            if ($page['parent_id']) {
                if (isset($pageMap[$page['parent_id']])) {
                    $pageMap[$page['parent_id']]['children'][] = &$pageMap[$page['id']];
                }
            } else {
                $rootPages[] = &$pageMap[$page['id']];
            }
        }
        return $rootPages;
    }
}