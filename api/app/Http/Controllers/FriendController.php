<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\FriendRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FriendController extends Controller
{
    protected $user;

    public function __construct()
    {
        $this->user = Auth::user();
    }

    public function index()
    {
        $friends = $this->user->allFriends();

        $friendRequests = FriendRequest::where('receiver_id', $this->user->id)
            ->where('status', 'PENDING')
            ->with('sender')
            ->get();

        return response()->json([
            'friends' => $friends,
            'requests' => $friendRequests,
        ]);
    }

    public function show($id)
    {
        $friend = $this->user->allFriends()->find($id);

        if ($friend) {
            return response()->json($friend);
        } else {
            $friend = User::find($id);
            return response()->json($friend);

        }
    }

    public function store(Request $request)
    {
        $friendUsername = $request->input('username');

        $friend = User::where('username', $friendUsername)->first();

        if (!$friend) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // pour pas pouvoir s'ajouter soit meme
        if ($this->user->id == $friend->id) {
            return response()->json(['message' => 'You cannot be friend with yourself'], 403);
        }

        // Vérifier si une demande d'ami existe déjà
        $existingRequest = FriendRequest::where([
            ['sender_id', '=', $this->user->id],
            ['receiver_id', '=', $friend->id],
        ])->orWhere([
                    ['sender_id', '=', $friend->id],
                    ['receiver_id', '=', $this->user->id],
                ])->first();

        if ($existingRequest) {
            return response()->json(['message' => 'Friend request already exists'], 409);
        }

        $friendRequest = FriendRequest::create([
            'sender_id' => $this->user->id,
            'receiver_id' => $friend->id,
            'status' => 'PENDING',
            'date' => now(),
        ]);

        return response()->json(['message' => 'Friend request sent', 'request' => $friendRequest], 201);
    }

    public function destroy($id)
    {
        $friend = $this->user->allFriends()->find($id);

        if ($friend) {
            $this->user->friends()->detach($id);
            $friend->friends()->detach($this->user->id);

            return response()->json(['message' => 'Friend removed'], 200);
        } else {
            return response()->json('Friend not found', 404);
        }
    }

    public function handleFriendRequest(Request $request, $id)
    {
        $friendRequest = FriendRequest::findOrFail($id);

        // Vérifier si l'utilisateur connecté est le destinataire de la demande
        if ($this->user->id !== $friendRequest->receiver_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($request->action === 'accept') {
            $this->user->friends()->attach($friendRequest->sender_id);
            $friendRequest->sender->friends()->attach($this->user->id);

            $friendRequest->status = 'ACCEPTED';

            // Supprimer la demande d'ami après l'acceptation
            $friendRequest->delete();


            return response()->json(['message' => 'Friend request accepted'], 200);
        } elseif ($request->action === 'reject') {
            // Supprimer la demande d'ami si elle est rejetée
            $friendRequest->delete();

            return response()->json(['message' => 'Friend request rejected'], 200);
        }

        $friendRequest->save();

        return response()->json(['message' => 'Invalid action'], 400);
    }

    public function searchUsers(Request $request)
    {
        $searchTerm = $request->query('searchTerm'); // Utilise query() pour récupérer les paramètres GET de la requête

        if (!$searchTerm) {
            return response()->json(['message' => 'Search term is required'], 400);
        }

        // Rechercher les utilisateurs correspondant au terme de recherche qui est envoyé
        $users = User::where('username', 'LIKE', '%' . $searchTerm . '%')
            ->where('id', '!=', $this->user->id) // Exclure l'utilisateur connecté
            ->get()
            ->map(function ($searchedUser) {
                // Vérifier si l'utilisateur est déjà ami avec l'utilisateur trouvé
                $isFriend = $this->user->allFriends()->contains($searchedUser->id);

                return [
                    'id' => $searchedUser->id,
                    'profileImageUrl' => $searchedUser->profileImageUrl,
                    'username' => $searchedUser->username,
                    'isFriend' => $isFriend,
                ];
            });

        return response()->json($users);
    }
}