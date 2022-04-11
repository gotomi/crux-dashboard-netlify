import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import netlify from '@astrojs/netlify/functions';



export default defineConfig({
    adapter: netlify(),
    integrations: [
        svelte(),
    ]
});