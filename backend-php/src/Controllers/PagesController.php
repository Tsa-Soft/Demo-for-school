<?php

namespace App\Controllers;

use App\Models\Page;

class PagesController
{
    public function getPages()
    {
        header('Content-Type: application/json');
        $pageModel = new Page();
        $pages = $pageModel->getNavPages();
        echo json_encode($pages);
    }
}