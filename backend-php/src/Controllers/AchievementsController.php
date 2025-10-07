<?php

namespace App\Controllers;

use App\Models\Achievement;

class AchievementsController
{
    public function getAchievements()
    {
        header('Content-Type: application/json');
        $achievementModel = new Achievement();
        $achievements = $achievementModel->findAll();
        echo json_encode($achievements);
    }
}
