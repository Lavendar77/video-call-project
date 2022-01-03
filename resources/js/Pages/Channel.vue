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
                        <button type="button" id="join">JOIN</button>
                        <button type="button" id="leave">LEAVE</button>

                        <div id="local-player"></div>
                    </div>
                </div>
            </div>
        </div>
    </BreezeAuthenticatedLayout>
</template>

<script>
import BreezeAuthenticatedLayout from '@/Layouts/Authenticated.vue';
import { Head } from '@inertiajs/inertia-vue3';
import '@/Plugins/agora-web-sdk';

export default {
    components: {
        BreezeAuthenticatedLayout,
        Head,
    },

    props: {
        channel: Object,
    },

    computed: {
        title() {
            return this.channel.name + ' (ID: ' + this.channel.finder + ')';
        },
    }
}
</script>

<style scoped>
#local-player {
    width: 640px;
    height: 480px;
    border: 1px solid red;
}
</style>
