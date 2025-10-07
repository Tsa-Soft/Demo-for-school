<?php

namespace App\Models;

use Config\Database;
use PDO;

class Translation
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getTranslationsByLang($lang)
    {
        $stmt = $this->db->query("SELECT key_path, text_bg, text_en FROM translations WHERE is_active = true");
        $translations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $translationsObj = [];
        foreach ($translations as $row) {
            $text = ($lang === 'en') ? $row['text_en'] : $row['text_bg'];
            if ($text) {
                $translationsObj[$row['key_path']] = $text;
            }
        }
        return $translationsObj;
    }
}