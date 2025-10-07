<?php

namespace App\Middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware
{
    public static function authenticate()
    {
        $headers = getallheaders();
        if (!isset($headers['Authorization'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Authorization header not found']);
            exit();
        }

        $authHeader = $headers['Authorization'];
        list($jwt) = sscanf($authHeader, 'Bearer %s');

        if (!$jwt) {
            http_response_code(401);
            echo json_encode(['error' => 'Access token required']);
            exit();
        }

        try {
            $secretKey = getenv('JWT_SECRET');
            $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));
            // You can attach the decoded user info to the request if needed
            // For simplicity, we'll just let the request proceed
        } catch (\Exception $e) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid or expired token']);
            exit();
        }
    }
}