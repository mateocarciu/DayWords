<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('newEntry.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
