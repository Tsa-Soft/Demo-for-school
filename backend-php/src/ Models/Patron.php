<?php

namespace App\Models;

use Config\Database;
use PDO;

class Patron
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getContent($lang)
    {
        $stmt = $this->db->query("SELECT * FROM patron_content WHERE is_active = 1 ORDER BY position ASC");
        $patronContent = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $content = [];
        foreach ($patronContent as $row) {
            $content[] = [
                'id' => $row['id'],
                'section_key' => $row['section_key'],
                'title' => ($lang === 'en' ? $row['title_en'] : $row['title_bg']),
                'content' => ($lang === 'en' ? $row['content_en'] : $row['content_bg']),
                'image_url' => $row['image_url'],
            ];
        }
        return $content;
    }
}
