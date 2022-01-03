<template>
    <Head :title="title" />

    <BreezeAuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ title }}
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 bg-white border-b border-gray-200">
                        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                            <BreezeButton class="bg-red-900" @click="leaveOrEnd">LEAVE / END CALL</BreezeButton>
                        </div>

                        <div class="players mt-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                            <!-- Video call screens show here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </BreezeAuthenticatedLayout>
</template>

<script>
import BreezeAuthenticatedLayout from '@/Layouts/Authenticated.vue';
import BreezeButton from '@/Components/Button.vue';
import { Head } from '@inertiajs/inertia-vue3';
import { startBasicCall, endCall } from '@/Plugins/agora-web-sdk';

export default {
    components: {
        BreezeAuthenticatedLayout,
        Head,
        BreezeButton,
    },

    props: {
        channel: Object,
    },

    computed: {
        title() {
            return this.channel.name + ' (ID: ' + this.channel.finder + ')';
        },
        user() {
            return this.$page.props.auth.user;
        }
    },

    methods: {
        leaveOrEnd() {
            if (this.user.id === this.channel.user_id) {
                if (confirm("End the call completely?")) {
                    endCall();
                }
            } else {
                alert('remove me');
                // endCall(this.user.id);
            }

            this.$inertia.visit(this.route('channels.close', {
                channel: this.channel.id,
            }), {
                method: 'DELETE'
            });
        }
    },

    mounted() {
        startBasicCall(
            process.env.MIX_AGORA_APP_ID,
            process.env.MIX_AGORA_APP_TOKEN,
            process.env.MIX_AGORA_APP_CHANNEL,
            this.user.id
        );
    }
}
</script>

<style>
.player {
    height: 480px;
}
</style>
