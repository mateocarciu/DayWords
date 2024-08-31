<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class EntryController extends Controller
{
    public function index() {
        $entries = Auth::user()->entries()
            ->rootEntries()
            ->with(['comments', 'childEntries'])
            ->get();
        
        return response()->json($entries);
    }

    public function store(Request $request)
    {
        $request->validate([
            'text' => 'required|string',
            'location' => 'nullable|string',
            'emotion' => 'nullable|in:HAPPY,SAD,ANGRY,EXCITED,RELAXED,OTHER',
            'mediaUrl' => 'nullable|string',
            'public' => 'nullable|boolean',
            'parent_entry_id' => 'nullable|exists:entries,id',
        ]);

        Auth::user()->entries()->create([
            'text' => $request->text,
            'location' => $request->location,
            'emotion' => $request->emotion,
            'mediaUrl' => $request->mediaUrl,
            'public' => $request->public,
            'parent_entry_id' => $request->parent_entry_id,
        ]);

        return response()->json(201);
    }

    // Montre une entrée spécifique
    public function show($id)
    {
        $entry = Entry::with(['comments', 'childEntries'])->findOrFail($id);  // Chargement des sous-entrées
        return response()->json($entry);
    }

    // Mise à jour d'une entrée
    public function update(Request $request, $id)
    {
        $entry = Entry::findOrFail($id);

        $this->authorize('update', $entry);

        $request->validate([
            'text' => 'sometimes|required|string',
            'time' => 'sometimes|required',
            'date' => 'sometimes|required|date',
            'location' => 'nullable|string',
            'emotion' => 'sometimes|required|in:HAPPY,SAD,ANGRY,EXCITED,RELAXED,OTHER',
            'mediaUrl' => 'nullable|string',
            'public' => 'sometimes|required|boolean',
        ]);

        $entry->update($request->all());

        return response()->json($entry);
    }

    // Suppression d'une entrée
    public function destroy($id)
    {
        $entry = Entry::findOrFail($id);

        $this->authorize('delete', $entry);

        $entry->delete();

        return response()->json(null, 204);
    }

    public function getFriendsEntries(Request $request)
    {
        // Récupérer les entrées des amis, avec les utilisateurs et les enfants
        $friendsEntries =  Auth::user()->allFriends()
            ->load(['entries' => function ($query) {
                $query->whereNull('parent_entry_id')
                    ->with('user', 'childEntries');
            }])
            ->pluck('entries')
            ->flatten();

        return response()->json($friendsEntries);
    }
}
