import { browser } from '$app/environment';
import { create } from '$lib/translate.svelte';
import type { LayoutLoad } from './$types';

export const load = (async (ev) => {
        create(ev.data.dictionnary);
    return {};
}) satisfies LayoutLoad;