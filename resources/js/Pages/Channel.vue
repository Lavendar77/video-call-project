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
                            <BreezeButton id="join" class="bg-blue-900">JOIN</BreezeButton>
                            <BreezeButton id="leave" class="bg-red-900">LEAVE</BreezeButton>
                        </div>

                        <div class="mt-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                            <div id="local-player" class="rounded overflow-hidden shadow-lg">
                                <div class="flex flex-col justify-center items-center">
                                    {{ user.name }}
                                    <p>(YOU)</p>
                                </div>
                            </div>
                            <div id="remote-player" class="rounded overflow-hidden shadow-lg"></div>
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
import { startBasicCall } from '@/Plugins/agora-web-sdk';

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

<style scoped>
#local-player, #remote-player {
    height: 480px;
}
</style>
