<?php

namespace App\Console\Commands;

use App\Models\Channel;
use Illuminate\Console\Command;

class CloseExpiredChannelCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'channel:close-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Close expired channels';

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
            ->where('expired_at', '<', now())
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
