<?php

namespace App\Observers;

use App\Jobs\CloseChannelJob;
use App\Models\Channel;

class ChannelObserver
{
    /**
     * Handle the Channel "creating" event.
     *
     * @param  \App\Models\Channel  $channel
     * @return void
     */
    public function creating(Channel $channel)
    {
        $channel->finder = now()->timestamp;
        $channel->expired_at = $channel->created_at->addHours(config('settings.channel_life_in_hours'));
    }

    /**
     * Handle the Channel "created" event.
     *
     * @param  \App\Models\Channel  $channel
     * @return void
     */
    public function created(Channel $channel)
    {
        CloseChannelJob::dispatch($channel)->delay($channel->expired_at);
    }

    /**
     * Handle the Channel "updated" event.
     *
     * @param  \App\Models\Channel  $channel
     * @return void
     */
    public function updated(Channel $channel)
    {
        //
    }

    /**
     * Handle the Channel "deleted" event.
     *
     * @param  \App\Models\Channel  $channel
     * @return void
     */
    public function deleted(Channel $channel)
    {
        //
    }

    /**
     * Handle the Channel "restored" event.
     *
     * @param  \App\Models\Channel  $channel
     * @return void
     */
    public function restored(Channel $channel)
    {
        //
    }

    /**
     * Handle the Channel "force deleted" event.
     *
     * @param  \App\Models\Channel  $channel
     * @return void
     */
    public function forceDeleted(Channel $channel)
    {
        //
    }
}
