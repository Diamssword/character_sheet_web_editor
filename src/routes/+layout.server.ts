import type { LayoutServerLoad } from './$types';

export const load = (async (ev) => {
        
    return {dictionnary:ev.locals.dictionnary};
}) satisfies LayoutServerLoad;
