<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EntryController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\CommentController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/users/search', [FriendController::class, 'searchUsers']);

    Route::apiResource('/friends', FriendController::class);
    Route::post('/friends/add', [FriendController::class, 'store']);
    Route::get('/friend-requests', [FriendController::class, 'friendRequests']);
    Route::patch('/friend-requests/{id}', [FriendController::class, 'handleFriendRequest']);

    Route::apiResource('/entries', EntryController::class);
    Route::get('/friends-entries', [EntryController::class, 'getFriendsEntries']);

    Route::get('/comments/{entryId}', [CommentController::class, 'show']);
    Route::post('/comments/{entryId}', [CommentController::class, 'store']);
});