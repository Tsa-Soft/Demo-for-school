<?php

namespace App\Controllers;

use App\Models\User;
use Firebase\JWT\JWT;

class AuthController
{
    public function login()
    {
        header('Content-Type: application/json');
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['username']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Username and password are required']);
            return;
        }

        $userModel = new User();
        $user = $userModel->findByUsername($data['username']);

        if (!$user || !password_verify($data['password'], $user['password_hash'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
            return;
        }

        $secretKey = getenv('JWT_SECRET');
        $payload = [
            'iat' => time(),
            'exp' => time() + (24 * 60 * 60), // 24 hours
            'data' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role'],
            ]
        ];

        $token = JWT::encode($payload, $secretKey, 'HS256');

        echo json_encode([
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role'],
            ]
        ]);
    }
}