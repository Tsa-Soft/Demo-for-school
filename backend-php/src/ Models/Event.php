<?php

namespace App\Models;

use Config\Database;
use PDO;

class Event
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findAll()
    {
        $stmt = $this->db->query("SELECT * FROM events ORDER BY start_date ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}