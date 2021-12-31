<?php

namespace App\Console\Commands;

use App\Models\Channel;
use Illuminate\Console\Command;

class CloseLongLivedChannelCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'channel:close-long-lives';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Close long-lived channels (more than 1 hour long)';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Channel::query()
            ->whereDate('expired_at', '>', now())
            ->whereNull('closed_at')
            ->chunkById(100, function ($channels) {
                foreach ($channels as $channel) {
                    $channel->closed_at = now();
                    $channel->saveQuietly();
                }
            });

        return 0;
    }
}
