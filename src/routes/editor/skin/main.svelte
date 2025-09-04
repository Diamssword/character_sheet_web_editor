<script lang="ts">
    import Viewer from "./viewer.svelte";
    import type {SkinViewer} from "$lib/skinviewer3d/skinview3d";
    import PanelLeft from "./panel_left.svelte";
    import PanelRight from "./panel_right.svelte";
    import { Alert } from "flowbite-svelte";
    import { fade } from "svelte/transition";
    import { browser } from "$app/environment";
    import {  SkinEditor } from "./panel";
    import type { SaveFormat, SkinLayersFormat, SkinParts } from "./skinTypes";
    import { onMount } from "svelte";
    import { currentAppearence } from "../shared.svelte";
    import tr from "$lib/translate.svelte";
    let {data,dataSaver,canExport}:{data:{datas:SkinParts,layers:SkinLayersFormat[],hasStats:boolean }, dataSaver: {loader:()=>SaveFormat,saver:(data:SaveFormat)=>void},canExport:boolean }=$props();
    let viewer:SkinViewer=$state(undefined as any);
    let skinEditor= new SkinEditor(data);
    function onPhysicChange(slim:boolean,size:number)
    {
        if(viewer)
        {
            currentAppearence.data.apparence={size,slim};
            dataSaver.saver(currentAppearence.data);
            viewer.playerObject.forLayers(l=>l.modelType=(slim?"slim":"default"));    
            size=100+size
            skinEditor.slim=slim;
            viewer.playerObject.scale.set(size/200,size/200,size/200)
        }
    }
    function onloaded(){
        if(viewer && currentAppearence.isLoaded)
        {
            skinEditor.slim=currentAppearence.data.apparence?.slim||false;
            skinEditor.setViewer(viewer);
            skinEditor.loadSavedOrDefault(currentAppearence.data.skin)
            skinEditor.saveFn=(dt)=>{
                currentAppearence.data.skin=dt;
                dataSaver.saver(currentAppearence.data);
            }
        }
    }

    currentAppearence.listeners.push(onloaded);
    onMount(onloaded)
    var infos=tr("editor.skin.infos").split("|")
    var pickedInfo=$state(0);
    if(browser)
    {
        setInterval(()=>{
            var p=Math.floor(Math.random()*infos.length);
            if(p==pickedInfo)
                p=Math.floor(Math.random()*infos.length);
            pickedInfo=p;
        },7000)
    }
</script>
<div class="w-full flex-1 p-2">
    <div class="flex w-full mb-5 rounded-md">
        <div class="w-3/6 mr-5 max-h-[65vh]">
        <PanelLeft data={data} {skinEditor} {dataSaver} onExtra={onPhysicChange}  />
        </div>
        <div class="rounded-md bgimg flex w-2/6 justify-center items-center">
            <Viewer bind:viewer={viewer}/>
        </div>
       <div class="w-1/6 ml-5 max-h-[65vh]">
        <PanelRight {canExport} editor={skinEditor} changePhysicFn={onPhysicChange} />
       </div>
    </div>
    <Alert color="blue">
        {#key pickedInfo}
        <p in:fade={{duration:1000}}>{infos[pickedInfo]}</p>    
        {/key}
    </Alert>
</div>
<style>
.bgimg{
    background-image: url("/datas/custom/skin_bg.png");
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center;
}
</style>
