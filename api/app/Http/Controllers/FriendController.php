<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FriendController extends Controller
{
    public function getFriendsEntries(Request $request)
    {
        $user = $request->user();
        $friendsEntries = $user->friends()
            ->with('entries')
            ->get()
            ->pluck('entries')
            ->flatten();
        return response()->json($friendsEntries);
    }
}

