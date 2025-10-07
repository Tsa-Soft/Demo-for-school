<?php

namespace App\Models;

use Config\Database;
use PDO;

class Achievement
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findAll()
    {
        $stmt = $this->db->query("SELECT * FROM school_achievements WHERE is_active = true ORDER BY position ASC, created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}