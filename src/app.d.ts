// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		 interface Locals {
			user_ip?:string,
			dictionnary:{[key:string]:string}
		 }
		// interface PageState {}
		// interface Platform {}
	}
}
export {};
