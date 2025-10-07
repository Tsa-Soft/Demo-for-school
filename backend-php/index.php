<?php

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use App\Middleware\AuthMiddleware;

// CORS CONFIGURATION
$allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'https://www.nukgsz.com', 'https://nukgsz.com'];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit(0);
}

$dotenv = Dotenv::createImmutable(__DIR__ . '/config');
$dotenv->load();

$requestUri = strtok($_SERVER["REQUEST_URI"], '?');
$requestMethod = $_SERVER["REQUEST_METHOD"];

// A simple routing mechanism for dynamic routes
$uriParts = explode('/', $requestUri);

$routes = [
    '/api/health' => ['GET', 'App\Controllers\HealthController@health'],
    '/api/auth/login' => ['POST', 'App\Controllers\AuthController@login'],
    '/api/news' => ['GET', 'App\Controllers\NewsController@getAllNews'],
    '/api/useful-links' => ['GET', 'App\Controllers\UsefulLinksController@getAll'],
    '/api/patron' => ['GET', 'App\Controllers\PatronController@getContent'],
    '/api/pages' => ['GET', 'App\Controllers\PagesController@getPages'],
    '/api/events' => ['GET', 'App\Controllers\EventsController@getEvents'],
    '/api/staff' => ['GET', 'App\Controllers\StaffController@getAllStaff'],
    '/api/schoolstaff' => ['GET', 'App\Controllers\SchoolStaffController@getAll'],
    '/api/translations' => ['GET', 'App\Controllers\TranslationsController@getTranslations'],
    '/api/achievements' => ['GET', 'App\Controllers\AchievementsController@getAchievements'],
    '/api/directors' => ['GET', 'App\Controllers\DirectorsController@getDirectors'],
    '/api/navigation/header-menu' => ['GET', 'App\Controllers\NavigationController@getHeaderMenu'],
    '/api/content/update' => ['POST', 'App\Controllers\ContentController@updateSection', true],
    
    // Protected Routes
    '/api/upload/image' => ['POST', 'App\Controllers\UploadController@uploadImage', true],
];

// Handle dynamic routes like /api/content/page/{pageId}
if (count($uriParts) === 5 && $uriParts[1] === 'api' && $uriParts[2] === 'content' && $uriParts[3] === 'page') {
    $pageId = $uriParts[4];
    $controller = new App\Controllers\ContentController();
    $controller->getSectionsByPage($pageId);
    exit();
}

if (isset($routes[$requestUri]) && $routes[$requestUri][0] === $requestMethod) {
    list($controller, $method) = explode('@', $routes[$requestUri][1]);
    $isProtectedRoute = isset($routes[$requestUri][2]) && $routes[$requestUri][2] === true;

    if ($isProtectedRoute) {
        AuthMiddleware::authenticate();
    }

    $controllerInstance = new $controller();
    $controllerInstance->$method();
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Not Found']);
}