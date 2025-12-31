import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();

    window.Pusher = Pusher;
    const echo = new Echo({
        broadcaster: 'reverb',
        key: config.public.reverbKey,
        wsHost: config.public.reverbHost,
        wsPort: 8080,
        forceTLS: false,
        enabledTransports: ['ws', 'wss'],
    });

    return { provide: { echo } };
});