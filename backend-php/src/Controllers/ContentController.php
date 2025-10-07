<?php

namespace App\Controllers;

use App\Models\Content;
use App\Middleware\AuthMiddleware;

class ContentController
{
    public function getSectionsByPage($pageId)
    {
        header('Content-Type: application/json');
        $contentModel = new Content();
        $sections = $contentModel->findByPage($pageId);
        echo json_encode($sections);
    }

    public function updateSection()
    {
        AuthMiddleware::authenticate();
        header('Content-Type: application/json');
        
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['id']) || !isset($data['content'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Section ID and content are required']);
            return;
        }

        $contentModel = new Content();
        $success = $contentModel->update($data['id'], $data['content']);

        if ($success) {
            echo json_encode(['message' => 'Content section updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update content section']);
        }
    }
}