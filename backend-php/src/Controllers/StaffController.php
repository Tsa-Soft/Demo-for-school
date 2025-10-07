<?php

namespace App\Controllers;

use App\Models\Staff;

class StaffController
{
    public function getAllStaff()
    {
        header('Content-Type: application/json');
        $staffModel = new Staff();
        $staff = $staffModel->findAll();
        echo json_encode($staff);
    }
}