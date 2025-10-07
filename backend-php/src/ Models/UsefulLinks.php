<?php

namespace App\Models;

use Config\Database;
use PDO;

class UsefulLinks
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findAll()
    {
        $stmt = $this->db->query("SELECT * FROM useful_links WHERE is_active = 1 ORDER BY position ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}