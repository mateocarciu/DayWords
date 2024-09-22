<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'username',
        'name',
        'bio',
        'email',
        'password',
        'profileImageUrl',
        'location',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function entries(): HasMany
    {
        return $this->hasMany(Entry::class);
    }

    public function friends(): BelongsToMany
    {
        // Les amis où l'utilisateur est dans la colonne `user_id`
        return $this->belongsToMany(User::class, 'friends', 'user_id', 'friend_id')
            ->withTimestamps();
    }

    // public function inverseFriends(): BelongsToMany
    // {
    //     // Les amis où l'utilisateur est dans la colonne `friend_id`
    //     return $this->belongsToMany(User::class, 'friends', 'friend_id', 'user_id')
    //                 ->withTimestamps();
    // }

    // return $this->friends()->get()->merge($this->inverseFriends()->get());


    public function allFriends()
    {
        return $this->friends()->get();
    }

    public function sentFriendRequests(): HasMany
    {
        return $this->hasMany(FriendRequest::class, 'sender_id');
    }

    public function receivedFriendRequests(): HasMany
    {
        return $this->hasMany(FriendRequest::class, 'receiver_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }
}
