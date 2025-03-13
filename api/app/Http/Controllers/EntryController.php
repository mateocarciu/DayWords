<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;

class EntryController extends Controller
{
    protected $user;

    public function __construct()
    {
        $this->user = Auth::user();
    }

    public function index()
    {
        $entries = $this->user->entries()
            // ->whereDate('created_at', now()->startOfDay())
            ->where('parent_entry_id', null)
            ->with('user', 'childEntries')
            ->get();

        $friendsEntries = $this->user->allFriends()
            ->load([
                'entries' => function ($query) {
                    $query->whereNull('parent_entry_id')
                        ->with('user', 'childEntries');
                }
            ])
            ->pluck('entries')
            ->flatten();

        $allEntries = $entries->merge($friendsEntries);

        return response()->json($allEntries);
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

        $entry = $this->user->entries()->create([
            'text' => $request->text,
            'location' => $request->location,
            'emotion' => $request->emotion,
            'mediaUrl' => $request->mediaUrl,
            'public' => $request->public,
            'parent_entry_id' => $request->parent_entry_id,
        ]);

        $friends = $this->user->allFriends();

        foreach ($friends as $friend) {
            Redis::publish('user.' . $friend->id, json_encode([
                'entry_id' => $entry->id,
                'title' => 'New entry created!',
                'text' => $entry->text,
            ]));
        }

        return response()->json($entry, 201);
    }

    public function show($id)
    {
        $entry = Entry::with(['user', 'childEntries', 'comments.user'])
            ->where(function ($query) {
                $query->where('user_id', $this->user->id)
                    ->orWhereIn('user_id', $this->user->friends->pluck('id'));
            })
            ->findOrFail($id);

        return response()->json($entry);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'text' => 'sometimes|required|string',
            'time' => 'sometimes|required',
            'date' => 'sometimes|required|date',
            'location' => 'nullable|string',
            'emotion' => 'sometimes|required|in:HAPPY,SAD,ANGRY,EXCITED,RELAXED,OTHER',
            'mediaUrl' => 'nullable|string',
            'public' => 'sometimes|required|boolean',
        ]);

        $entry = Entry::findOrFail($id);

        $entry->update($request->all());

        return response()->json($entry);
    }

    public function destroy($id)
    {
        $entry = Entry::findOrFail($id)->where('user_id', $this->user->id);

        $entry->delete();

        return response()->json(null, 204);
    }
}
