<?php

namespace App\Controllers;

class UploadController
{
    public function uploadImage()
    {
        // PHP's built-in file handling is used here.
        // For a more robust solution, consider a library like "league/flysystem".
        if (isset($_FILES['image'])) {
            $file = $_FILES['image'];
            $uploadDir = __DIR__ . '/../../uploads/images/';

            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $fileName = uniqid() . '-' . basename($file['name']);
            $targetPath = $uploadDir . $fileName;

            if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                echo json_encode([
                    'url' => '/uploads/images/' . $fileName,
                    'message' => 'Image uploaded successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to upload image']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'No image uploaded']);
        }
    }
}