import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async (ev) => {
    try{ 
        let res=await ev.fetch("/datas/custom/landing.html")
        if(res.ok)
        {
           return {content:await res.text()};
        }
        else
            return redirect(303,"/editor")
    }catch{
        return redirect(303,"/editor")
    }

    return {};
}) satisfies PageLoad;