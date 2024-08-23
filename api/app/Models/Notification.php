<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'message',
        'date',
        'user_id',  // Ajout de la clé étrangère user_id
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
