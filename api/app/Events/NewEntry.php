<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class NewEntry implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        // public Collection $receiver,
        // public User $sender,
    ) {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    // public function broadcastOn(): array
    // {
    //     info("Broadcasting to: ", $this->receiver->pluck('id')->toArray());
    //     return $this->receiver->map(fn($friend) => new PrivateChannel("newEntry.{$friend->id}"))->toArray();
    // }

    public function broadcastOn()
    {
        return [new Channel('newEntry')];
    }

    // public function broadcastAs()
    // {
    //     return 'NewEntry';
    // }
}
