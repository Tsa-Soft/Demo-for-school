<?php

namespace App\Models;

use Config\Database;
use PDO;

class News
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findAll()
    {
        $stmt = $this->db->query("SELECT * FROM news ORDER BY published_date DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}