<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Events\NewEntry;

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
            ->with(['childEntries'])
            ->where('parent_entry_id', null)
            ->get();

        $friendsEntries = $this->user->allFriends()
            ->load([
                'entries' => function ($query) {
                    $query->whereNull('parent_entry_id')
                        // ->whereDate('created_at', now()->startOfDay())
                        ->with('user', 'childEntries');
                }
            ])
            ->pluck('entries')
            ->flatten();

        $allEntries = [
            'entries' => $entries,
            'friend_entries' => $friendsEntries
        ];

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

        $this->user->entries()->create([
            'text' => $request->text,
            'location' => $request->location,
            'emotion' => $request->emotion,
            'mediaUrl' => $request->mediaUrl,
            'public' => $request->public,
            'parent_entry_id' => $request->parent_entry_id,
        ]);

        // $receiver = User::find(4);
        // $sender = User::find(Auth::user()->id);
        // broadcast(new NewEntry($sender, $sender, $request->text));

        // Récupérer les amis de l'utilisateur
        // $friends = Auth::user()->friends;
        // info($friends);
        // info(Auth::user());

        // broadcast(new NewEntry(Auth::user()->friends, Auth::user()));
        // broadcast(new NewEntry($this->user->friends, $this->user));


        return response()->json(201);
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
