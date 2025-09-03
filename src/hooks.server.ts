import("dotenv/config")
import type { Handle } from '@sveltejs/kit';
import {init} from "$lib/layers_visitor";
import * as fs from 'fs'
clearCache();
var inited=false;
export const handle: Handle = async ({ event, resolve }) => {
	let ips=event.request.headers.get("x-forwarded-for");
	if(!inited)
	{
		init(event as any).catch(console.error)
		inited=true;
	}
	if(ips)
	  event.locals.user_ip=ips.split(',')[0];
	if(!event.locals.user_ip)
		event.locals.user_ip="devIP"
	const response = await resolve(event);
	return response;
};

function clearCache()
{
	if(fs.existsSync('./datas/temp/'))
	{
		fs.readdirSync("./datas/temp/").forEach(f1=>{
			fs.rmSync("./datas/temp/"+f1);
		})
	}
	else
	fs.mkdirSync("./datas/temp",{recursive:true})
}