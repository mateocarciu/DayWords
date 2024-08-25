<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EntryController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CommentController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/entries', [EntryController::class, 'index']);
    Route::get('/friends-entries', [FriendController::class, 'getFriendsEntries']);
    Route::post('/entries', [EntryController::class, 'store']);
    Route::get('/comments/{entryId}', [CommentController::class, 'getComments']);

});