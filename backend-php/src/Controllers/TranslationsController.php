<?php

namespace App\Controllers;

use App\Models\Translation;

class TranslationsController
{
    public function getTranslations()
    {
        header('Content-Type: application/json');
        $lang = $_GET['lang'] ?? 'bg';
        $translationModel = new Translation();
        $translations = $translationModel->getTranslationsByLang($lang);
        echo json_encode($translations);
    }
}