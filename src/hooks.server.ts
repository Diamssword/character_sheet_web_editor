import("dotenv/config")
import type { Handle } from '@sveltejs/kit';
import {init} from "$lib/layers_visitor";
import * as fs from 'fs'
import type { RequestEvent } from './routes/$types';
clearCache();
var inited=false;
export const handle: Handle = async ({ event, resolve }) => {
	let ips=event.request.headers.get("x-forwarded-for");
	if(!inited)
	{
		init(event as any).catch(console.error)
		loadDic(event as any);
		inited=true;
	}
	if(ips)
	  event.locals.user_ip=ips.split(',')[0];
	if(!event.locals.user_ip)
		event.locals.user_ip="devIP"
	event.locals.dictionnary=translations;
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
var translations:{[key:string]:string}={};
async function loadDic(event:RequestEvent)
{
	try{
		const res=await event.fetch("/datas/custom/translation.txt")
		if(res.ok)
		{
			const txt=await res.text();
			txt.split("\n").forEach(line=>{
				if(!line.startsWith('#'))
				{
					const ind=line.indexOf("=")
					if(ind>-1)
						translations[line.substring(0,ind)]=line.substring(ind+1);
				}
			})
			console.log("translations loaded")
		}
	}catch(err){
		console.error(err)
	}
}