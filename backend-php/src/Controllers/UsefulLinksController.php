<?php

namespace App\Controllers;

use App\Models\UsefulLinks;

class UsefulLinksController
{
    public function getAll()
    {
        header('Content-Type: application/json');
        $linksModel = new UsefulLinks();
        $links = $linksModel->findAll();
        echo json_encode($links);
    }
}