<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\FriendRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FriendController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $friends = $user->allFriends();
        return response()->json($friends);
    }

    public function show($id)
    {
        $user = Auth::user();
        $friend = $user->allFriends()->find($id);

        if ($friend) {
            return response()->json($friend);
        } else {
            return response()->json('Friend not found', 404);
        }
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $friendUsername = $request->input('username');

        // Vérifier si l'utilisateur existe
        $friend = User::where('username', $friendUsername)->first();

        if (!$friend) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // pour pas pouvoir s'ajouter soit meme
        if ($user->id == $friend->id) {
            return response()->json(['message' => 'You cannot be friend with yourself'], 403);
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

    public function destroy($id)
    {
        $user = Auth::user();
        $friend = $user->allFriends()->find($id);

        if ($friend) {
            $user->friends()->detach($id);
            $friend->friends()->detach($user->id);

            return response()->json(['message' => 'Friend removed'], 200);
        } else {
            return response()->json('Friend not found', 404);
        }
    }

    public function friendRequests()
    {
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
            $friendRequest->delete();
            // $friendRequest->save();


            return response()->json(['message' => 'Friend request accepted'], 200);
        } elseif ($request->action === 'reject') {
            // Supprimer la demande d'ami si elle est rejetée
            // $friendRequest->delete();
            // $friendRequest->status = 'REJECTED';
            $friendRequest->delete();

            return response()->json(['message' => 'Friend request rejected'], 200);
        }

        $friendRequest->save();

        return response()->json(['message' => 'Invalid action'], 400);
    }

    public function searchUsers(Request $request)
    {
        $user = Auth::user();
        $searchTerm = $request->query('searchTerm'); // Utilise query() pour récupérer les paramètres GET

        if (!$searchTerm) {
            return response()->json(['message' => 'Search term is required'], 400);
        }

        // Rechercher les utilisateurs correspondant au terme de recherche
        $users = User::where('username', 'LIKE', '%' . $searchTerm . '%')
            ->where('id', '!=', $user->id) // Exclure l'utilisateur connecté
            ->get()
            ->map(function ($searchedUser) use ($user) {
                // Vérifier si l'utilisateur est déjà ami avec l'utilisateur trouvé
                $isFriend = $user->allFriends()->contains($searchedUser->id);

                return [
                    'id' => $searchedUser->id,
                    'username' => $searchedUser->username,
                    'isFriend' => $isFriend,
                ];
            });

        return response()->json($users);
    }
}