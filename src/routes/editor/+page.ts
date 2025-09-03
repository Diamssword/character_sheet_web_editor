import type { LoadEvent } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { SkinPartsFormat,SkinLayersFormat } from './skin/skinTypes';
export const load = (async (ev) => {
    ev.data
  
    return {};
   
}) satisfies PageLoad;
async function tryLoadResource(event:LoadEvent,url:string)
{
    var res=await event.fetch(url);
    if(res.ok)
        return await res.json();
    return undefined;
}

