<?php

namespace App\Controllers;

use App\Models\Event;

class EventsController
{
    public function getEvents()
    {
        header('Content-Type: application/json');
        $eventModel = new Event();
        $events = $eventModel->findAll();
        echo json_encode(['success' => true, 'events' => $events]);
    }
}