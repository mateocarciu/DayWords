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
            ->where('parent_entry_id', null)
            ->whereDate('created_at', now()->toDateString())
            ->with([
                'user',
                'childEntries' => function ($query) {
                    $query->orderBy('created_at');
                }
            ])
            ->get();

        $friendsEntries = $this->user->allFriends()
            ->load([
                'entries' => function ($query) {
                    $query->whereNull('parent_entry_id')
                        ->whereDate('created_at', now()->toDateString())
                        ->with([
                            'user',
                            'childEntries' => function ($query) {
                                $query->orderBy('created_at');
                            }
                        ]);
                }
            ])
            ->pluck('entries')
            ->flatten();

        $allEntries = $entries->merge($friendsEntries);

        $formattedEntries = $allEntries->map(function ($entry) {

            $totalChildEntries = $entry->childEntries->count();

            $limitedChildEntries = $entry->childEntries->take(2);

            $entry->child_entries = $limitedChildEntries;

            unset($entry->childEntries);

            $remainingChildEntries = max(0, $totalChildEntries - 2);

            $entry->more_entries = $remainingChildEntries;

            return $entry;
        });

        return response()->json($formattedEntries);
    }

    public function store(Request $request)
    {
        $request->validate([
            'text' => 'required|string',
            'location' => 'nullable|string',
            'emotion' => 'nullable|in:HAPPY,SAD,ANGRY,EXCITED,RELAXED,OTHER',
            'mediaUrl' => 'nullable|string',
            'public' => 'nullable|boolean',
        ]);

        if ($this->user->entries()->whereDate('created_at', now()->toDateString())->exists()) {
            $entry = $this->user->entries()->create([
                'text' => $request->text,
                'location' => $request->location,
                'emotion' => $request->emotion,
                'mediaUrl' => $request->mediaUrl,
                'public' => $request->public,
                'parent_entry_id' => $this->user->entries()->whereDate('created_at', now()->toDateString())->first()->id,
            ]);
        } else {
            $entry = $this->user->entries()->create([
                'text' => $request->text,
                'location' => $request->location,
                'emotion' => $request->emotion,
                'mediaUrl' => $request->mediaUrl,
                'public' => $request->public,
            ]);
        }

        $friends = $this->user->allFriends();

        foreach ($friends as $friend) {
            Redis::publish('user.' . $friend->id, json_encode([
                'entry_id' => $entry->id,
                'title' => 'New entry created!',
                'text' => $entry->text,
            ]));
        }

        // to notify the currennt user as well so they can see the entry in real-time instead of fetching it from the server
        Redis::publish('user.' . $this->user->id, json_encode([
            'entry_id' => $entry->id,
            'title' => 'New entry created!',
            'text' => $entry->text,
        ]));

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
        $entry = Entry::where('id', $id)
            ->where('user_id', $this->user->id)
            ->firstOrFail();

        $childEntries = $entry->childEntries;

        if ($childEntries->isNotEmpty()) {
            $newParent = $childEntries->first();
            $newParent->update(['parent_entry_id' => null]);

            foreach ($childEntries->where('id', '!=', $newParent->id) as $child) {
                $child->update(['parent_entry_id' => $newParent->id]);
            }
        }

        $entry->delete();

        return response()->json(null, 204);
    }
}
