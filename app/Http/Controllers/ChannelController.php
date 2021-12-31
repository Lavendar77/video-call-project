<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreChannelRequest;
use App\Models\Channel;
use Illuminate\Http\Request;

class ChannelController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $channels = Channel::query()
            ->whereNull('closed_at')
            ->whereDate('expired_at', '<', now())
            ->paginate()
            ->withQueryString();

        return $channels;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreChannelRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreChannelRequest $request)
    {
        $channel = new Channel();
        $channel->name = $request->name;
        $channel->user()->associate($request->user());
        $channel->save();
    }

    /**
     * Open the video stream of the specified resource.
     *
     * @param Request $request
     * @param  \App\Models\Channel  $channel
     * @return \Illuminate\Http\Response
     */
    public function open(Request $request, Channel $channel)
    {
        $user = $request->user();

        if ($channel->user_id !== $user->id && $user->attendingChannels()->where('id', $channel->id)->exists()) {
            if ($channel->locked_at) {
                abort(403, 'Channel is locked.');
            }
        }

        if ($channel->expired_at > now()) {
            abort(403, 'Channel is expired.');
        }

        return $channel;
    }

    /**
     * Close the video stream.
     *
     * @param  \App\Models\Channel  $channel
     * @return \Illuminate\Http\Response
     */
    public function close(Channel $channel)
    {
        $this->authorize('delete', $channel);

        abort_if($channel->expired_at, 403, 'Channel is expired.');

        $channel->closed_at = now();
        $channel->save();

        return;
    }
}
