<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('newEntry', function ($user) {
    return true;
});


// Broadcast::channel('newEntry.{id}', function ($user, $id) {
//     return $user->allFriends()->contains('id', $id);
// });