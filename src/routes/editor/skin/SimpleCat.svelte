<script lang="ts">
    import { Button, Dropdown, Input, TabItem, Tooltip } from "flowbite-svelte";
    import { type SkinEditor } from "./panel";
    import type { SkinPartsFormat, TextureInfos } from "./skinTypes";
    import PartButton from "./PartButton.svelte";
    import DrawerButton from "./DrawerButton.svelte";
    import { browser } from "$app/environment";
    let {children,skinEditor,cat,layer}:{children?:any,skinEditor:SkinEditor,cat:SkinPartsFormat,layer:string}=$props();
</script>
<TabItem title={cat.title} open={layer=="base"} activeClass="inline-block text-sm font-medium text-center bg-gray-200 disabled:cursor-not-allowed p-4 text-secondary-900 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">
<p class=" text-secondary-text text-2xl">{cat.title}</p>
{#each Object.keys(cat.cats||{"":{name:"",images:cat.images}}) as subk}
{@const sub=cat.cats?cat.cats[subk]:{name:"",images:cat.images}}
{#if cat.cats}
    <h2 class="text-gray-50 ">{sub.name}</h2>
{/if}
<div class="my-3">
    {#if sub.images}
        {#each sub.images as skin}
                {#if skin.subs }
                    <DrawerButton category={subk} {layer} {skinEditor} texture={skin} onclick={(sub)=>skinEditor.pickTexture(layer,{subs:skin.id,category:subk,id:sub.id})} />
                {:else}
                    <PartButton {layer} category={subk} {skinEditor} texture={skin} onclear={()=>{skinEditor.clearPart(layer)}} onclick={()=>skinEditor.pickTexture(layer,{id:skin.id,category:subk})}/>
                {/if}
        {/each}     
    {/if}
</div>
{/each}
{@render children?.()}
</TabItem>