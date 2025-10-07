<?php

namespace App\Controllers;

class HealthController
{
    public function health()
    {
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'ok',
            'node' => phpversion(),
            'env' => getenv('NODE_ENV') ?: 'development',
            'time' => (new \DateTime())->format('c')
        ]);
    }
}