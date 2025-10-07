<?php

namespace App\Controllers;

use App\Models\Director;

class DirectorsController
{
    public function getDirectors()
    {
        header('Content-Type: application/json');
        $directorModel = new Director();
        $directors = $directorModel->findAll();
        echo json_encode($directors);
    }
}