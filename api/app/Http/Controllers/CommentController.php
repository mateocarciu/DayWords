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
    public function show($entryId): JsonResponse
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

    /**
     * Crée un nouveau commentaire pour une entrée spécifique.
     *
     * @param  Request  $request
     * @param  int  $entryId
     * @return JsonResponse
     */
    public function store(Request $request, $entryId): JsonResponse
    {
        // Valider les données de la requête
        $request->validate([
            'text' => 'required|string',
        ]);

        // Trouver l'entrée par ID
        $entry = Entry::find($entryId);

        // Vérifier si l'entrée existe
        if (!$entry) {
            return response()->json(['message' => 'Entry not found'], 404);
        }

        // Créer un nouveau commentaire
        $comment = $entry->comments()->create([
            'text' => $request->input('text'),
            'user_id' => auth()->id(),
        ]);

        return response()->json($comment, 201);
    }

    /**
     * Supprime un commentaire spécifique.
     *
     * @param  int  $entryId
     * @param  int  $commentId
     * @return JsonResponse
     */
    public function delete($entryId, $commentId): JsonResponse
    {
        // Trouver l'entrée par ID
        $entry = Entry::find($entryId);

        // Vérifier si l'entrée existe
        if (!$entry) {
            return response()->json(['message' => 'Entry not found'], 404);
        }

        // Trouver le commentaire par ID
        $comment = $entry->comments()->find($commentId);

        // Vérifier si le commentaire existe
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        // Vérifier si l'utilisateur est autorisé à supprimer le commentaire
        if ($comment->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Supprimer le commentaire
        $comment->delete();

        return response()->json(['message' => 'Comment deleted'], 200);
    }
}
