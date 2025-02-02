<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    protected $user;

    public function __construct()
    {
        $this->user = Auth::user();
    }

    /**
     * Create a new comment.
     *
     * @param  Request  $request
     * @param  int  $entryId
     * @return JsonResponse
     */
    public function store(Request $request, $entryId): JsonResponse
    {
        $request->validate([
            'text' => 'required|string',
        ]);

        $entry = Entry::where(function ($query) {
            $query->where('user_id', operator: $this->user->id)
                ->orWhereIn('user_id', $this->user->friends->pluck('id'));
        })->findOrFail($entryId);

        $comment = $entry->comments()->create([
            'text' => $request->input('text'),
            'user_id' => $this->user->id,
        ]);

        return response()->json($comment, 201);
    }

    /**
     * Delete a comment.
     *
     * @param  int  $entryId
     * @param  int  $commentId
     * @return JsonResponse
     */
    public function delete($entryId, $commentId): JsonResponse
    {
        $comment = Comment::findOrFail($commentId)
            ->where('entry_id', $entryId)
            ->where('user_id', $this->user->id)
            ->first();

        $comment->delete();

        return response()->json(['message' => 'Comment deleted'], 200);
    }
}
