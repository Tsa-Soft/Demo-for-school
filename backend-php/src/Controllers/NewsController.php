<?php

namespace App\Controllers;

use App\Models\News;

class NewsController
{
    public function getAllNews()
    {
        header('Content-Type: application/json');
        $newsModel = new News();
        $news = $newsModel->findAll();
        echo json_encode($news);
    }
}