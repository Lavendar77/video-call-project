require('./bootstrap');

import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/inertia-vue3';
import { InertiaProgress } from '@inertiajs/progress';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => require(`./Pages/${name}.vue`),
    setup({ el, app, props, plugin }) {
        return createApp({ render: () => h(app, props) })
            .use(plugin)
            .mixin({
                methods: {
                    route,
                    copyToClipboard(text) {
                        let dummy = document.createElement("input");
                        dummy.value = text;

                        document.body.appendChild(dummy);
                        dummy.select();

                        try {
                          document.execCommand("copy");
                        } catch (err) {
                          console.error(err)
                        }

                        document.body.removeChild(dummy);
                      }
                }
            })
            .mount(el);
    },
});

InertiaProgress.init({ color: '#4B5563' });
