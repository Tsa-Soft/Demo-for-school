<?php

namespace App\Controllers;

use App\Models\Patron;

class PatronController
{
    public function getContent()
    {
        header('Content-Type: application/json');
        $lang = $_GET['lang'] ?? 'bg';
        $patronModel = new Patron();
        $content = $patronModel->getContent($lang);
        echo json_encode(['success' => true, 'content' => $content]);
    }
}