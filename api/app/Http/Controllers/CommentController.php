<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Récupère les commentaires d'une entrée spécifique.
     *
     * @param  int  $entryId
     * @return JsonResponse
     */
    public function getComments($entryId): JsonResponse
    {
        // Trouver l'entrée par ID
        $entry = Entry::find($entryId);

        // Vérifier si l'entrée existe
        if (!$entry) {
            return response()->json(['message' => 'Entry not found'], 404);
        }

        // Charger les commentaires associés à l'entrée
        $comments = $entry->comments->load('user');

        return response()->json($comments);
    }
}
