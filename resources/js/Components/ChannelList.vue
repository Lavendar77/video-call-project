<template>
    <form @submit.prevent="submit" class="mb-5">
        <BreezeInput type="text" class="mt-1 block w-full" v-model="form.name" placeholder="Create a channel" required />
    </form>

    <div v-if="channels">
        <table class="table-auto w-full" v-if="channels.data && channels.data.length">
            <thead>
                <tr>
                    <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase">
                        Name
                    </th>
                    <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase">
                        Expires At
                    </th>
                    <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase"></th>
                </tr>
            </thead>
            <tbody class="">
                <tr v-for="channel in channels.data" :key="channel.id">
                    <td class="px-3 py-3 border-b border-gray-200 bg-white">{{ channel.name }}</td>
                    <td class="px-3 py-3 border-b border-gray-200 bg-white">{{ channel.expired_at }}</td>
                    <td class="px-3 py-3 border-b border-gray-200 bg-white">
                        <BreezeButton @click="copyLink(channel.finder)" class="mr-2">Copy Link</BreezeButton>
                        <BreezeButton @click="open(channel.finder)">Open</BreezeButton>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="flex mt-5">
            <Link
                :href="channels.prev_page_url"
                as="button"
                type="button"
                class="border border-teal-500 text-teal-500 block rounded-sm font-bold py-4 px-6 mr-2 flex items-center hover:bg-teal-500 hover:text-white"
                :class="{ 'border-none bg-gray-400 text-gray-100 hover:bg-gray-400': !channels.prev_page_url }"
            >
                Prev
            </Link>
            <Link
                :href="channels.next_page_url"
                as="button"
                type="button"
                class="border border-teal-500 text-teal-500 block rounded-sm font-bold py-4 px-6 mr-2 flex items-center hover:bg-teal-500 hover:text-white"
                :class="{ 'border-none bg-gray-400 text-gray-100 hover:bg-gray-400': !channels.next_page_url }"
            >
                Next
            </Link>
        </div>
    </div>
</template>

<script>
import BreezeInput from '@/Components/Input.vue';
import BreezeButton from '@/Components/Button.vue';
import { Link } from '@inertiajs/inertia-vue3';

export default {
    components: {
        Link,
        BreezeInput,
        BreezeButton,
    },

    props: {
        channels: Object,
    },

    data() {
        return {
            form: this.$inertia.form({
                name: '',
            })
        }
    },

    methods: {
        submit() {
            this.form.post(this.route('channels.store'), {
                onFinish: () => this.form.reset('name'),
            })
        },

        copyLink(link) {
            this.$root.copyToClipboard(this.route('channels.show', {
                'channel': link,
            }))
        },

        open(finder) {
            this.$inertia.visit(this.route('channels.show', {
                channel: finder
            }))
        }
    },
}
</script>
