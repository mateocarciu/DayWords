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

    //logout
    Route::post('/logout', [AuthController::class, 'logout']);

    //friends page
    Route::get('/users/search', [FriendController::class, 'searchUsers']);
    Route::apiResource('/friends', FriendController::class);
    Route::post('/friends/add/{id}', [FriendController::class, 'store']);
    Route::patch('/friends/requests/{id}', [FriendController::class, 'handleFriendRequest']);

    //entries page
    Route::apiResource('/entries', EntryController::class);

    //entries detail page
    Route::post('/entry/{id}/comments', [CommentController::class, 'store']);
});