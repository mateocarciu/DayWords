<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

// Entry.php

class Entry extends Model
{
    use HasFactory;

    protected $fillable = [
        'text',
        'location',
        'emotion',
        'mediaUrl',
        'public',
        'parent_entry_id',
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function parentEntry(): BelongsTo
    {
        return $this->belongsTo(Entry::class, 'parent_entry_id');
    }

    public function childEntries(): HasMany
    {
        return $this->hasMany(Entry::class, 'parent_entry_id');
    }

    // Scope pour les entrées racines
    public function scopeRootEntries($query)
    {
        return $query->whereNull('parent_entry_id');
    }
}
