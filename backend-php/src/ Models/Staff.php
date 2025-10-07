<?php

namespace App\Models;

use Config\Database;
use PDO;

class Staff
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findAll()
    {
        $stmt = $this->db->query("SELECT * FROM staff_members WHERE is_active = 1 ORDER BY is_director DESC, position ASC, name ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}