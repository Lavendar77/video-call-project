<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreChannelRequest;
use App\Models\Channel;
use Illuminate\Http\Request;

class ChannelController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param StoreChannelRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreChannelRequest $request)
    {
        $channel = new Channel();
        $channel->name = $request->name;
        $channel->user()->associate($request->user());
        $channel->save();

        return redirect()->route('dashboard');
    }

    /**
     * Open the video stream of the specified resource.
     *
     * @param Request $request
     * @param \App\Models\Channel $channel
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, Channel $channel)
    {
        $user = $request->user();

        if ($channel->user_id !== $user->id && $user->attendingChannels()->where('id', $channel->id)->exists()) {
            if ($channel->locked_at) {
                abort(403, 'Channel is locked.');
            }
        }

        if ($channel->expired_at < now()) {
            abort(403, 'Channel is expired.');
        }

        return $channel;
    }

    /**
     * Close the video stream.
     *
     * @param Request $request
     * @param \App\Models\Channel $channel
     * @return \Illuminate\Http\RedirectResponse
     */
    public function close(Request $request, Channel $channel)
    {
        if ($channel->user_id === $request->user()->id) {
            if (!$channel->closed_at) {
                $channel->closed_at = now();
                $channel->save();
            }
        }

        return redirect()->route('dashboard');
    }
}
