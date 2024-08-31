<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EntryController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\SseController; // <-- Ajoutez ce contrôleur

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('/entries', EntryController::class);
    Route::apiResource('/friends', FriendController::class);
    Route::get('/friends-entries', [EntryController::class, 'getFriendsEntries']);
    Route::post('/friends/add', [FriendController::class, 'store']);
    Route::get('/friend-requests', [FriendController::class, 'friendRequests']);
    Route::patch('/friend-requests/{id}', [FriendController::class, 'handleFriendRequest']);
    Route::get('/comments/{entryId}', [CommentController::class, 'show']);
    Route::post('/comments/{entryId}', [CommentController::class, 'store']);

    // Route pour les Server-Sent Events
    Route::get('/sse', [SseController::class, 'stream']); // <-- Nouvelle route SSE
});