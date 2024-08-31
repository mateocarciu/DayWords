<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\FriendRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FriendController extends Controller
{
    public function index() {
        $user = Auth::user();
        $friends = $user->allFriends();
        return response()->json($friends);
    }

    public function show($id) {
        $user = Auth::user();
        $friend = $user->allFriends()->find($id);

        if ($friend) {
            return response()->json($friend);
        } else {
            return response()->json('Friend not found', 404);
        }
    }

    public function store(Request $request) {
        $user = Auth::user();
        $friendEmail = $request->input('email');

        // Vérifier si l'utilisateur existe
        $friend = User::where('email', $friendEmail)->first();

        if (!$friend) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Vérifier si une demande d'ami existe déjà
        $existingRequest = FriendRequest::where([
            ['sender_id', '=', $user->id],
            ['receiver_id', '=', $friend->id],
        ])->orWhere([
            ['sender_id', '=', $friend->id],
            ['receiver_id', '=', $user->id],
        ])->first();

        if ($existingRequest) {
            return response()->json(['message' => 'Friend request already exists'], 409);
        }

        // Créer une nouvelle demande d'ami
        $friendRequest = FriendRequest::create([
            'sender_id' => $user->id,
            'receiver_id' => $friend->id,
            'status' => 'PENDING',
            'date' => now(),
        ]);

        return response()->json(['message' => 'Friend request sent', 'request' => $friendRequest], 201);
    }

    public function friendRequests() {
        $user = Auth::user();
        $requests = FriendRequest::where('receiver_id', $user->id)
                                 ->where('status', 'PENDING')
                                 ->with('sender')
                                 ->get();
    
        return response()->json($requests);
    }
    public function handleFriendRequest(Request $request, $id)
    {
        $friendRequest = FriendRequest::findOrFail($id);
        $user = Auth::user();
    
        // Vérifier si l'utilisateur connecté est le destinataire de la demande
        if ($user->id !== $friendRequest->receiver_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        if ($request->action === 'accept') {
            // Ajouter une entrée dans la table `friends`
            $user->friends()->attach($friendRequest->sender_id);
            $friendRequest->sender->friends()->attach($user->id);

            $friendRequest->status = 'ACCEPTED';
    
            // Supprimer la demande d'ami après l'acceptation
            // $friendRequest->delete();
            $friendRequest->save();

    
            return response()->json(['message' => 'Friend request accepted'], 200);
        } elseif ($request->action === 'reject') {
            // Supprimer la demande d'ami si elle est rejetée
            // $friendRequest->delete();
            $friendRequest->status = 'REJECTED';
    
            return response()->json(['message' => 'Friend request rejected'], 200);
        }
    
        $friendRequest->save();

        return response()->json(['message' => 'Invalid action'], 400);
    }
}