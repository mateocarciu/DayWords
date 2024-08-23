<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EntryController extends Controller
{
    public function getUserEntries(Request $request)
    {
        $user = $request->user();
        $entries = $user->entries()->get(); // Assuming a User has many Entries
        return response()->json($entries);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'text' => 'required|string',
            'emotion' => 'nullable|string',
            'mediaUrl' => 'nullable|string',
            'parentEntry' => 'nullable|integer|exists:entries,id',
            // Other validation rules
        ]);

        $entry = $user->entries()->create([
            'text' => $data['text'],
            'emotion' => $data['emotion'] ?? null,
            'mediaUrl' => $data['mediaUrl'] ?? null,
            'parentEntry' => $data['parentEntry'] ?? null,
            // Set other fields as needed
        ]);

        return response()->json($entry, 201);
    }
}
