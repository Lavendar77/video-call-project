<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Render the dashboard.
     *
     * @return \Inertia\Response
     */
    public function __invoke()
    {
        $channels = Channel::query()
            ->whereNull('closed_at')
            ->where('expired_at', '>=', now())
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Dashboard', [
            'channels' => $channels,
        ]);
    }
}
