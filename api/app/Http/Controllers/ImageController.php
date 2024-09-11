<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function show($filename)
    {
        // Vérifiez si l'utilisateur est authentifié
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Chemin du fichier dans le stockage privé
        $path = storage_path('app/private/profile_images/' . $filename);

        // Vérifiez si le fichier existe
        if (!file_exists($path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        // Retourner l'image comme une réponse
        return response()->file($path);
    }
}
