<script lang="ts">
    import { Button, Dropdown, DropdownItem, Input,Popover,Toast,Tooltip } from 'flowbite-svelte'; 
    import { exportCharacter, SkinEditor } from './panel';
    import type { SaveFormat } from './skinTypes';
    import { currentAppearence } from '../shared.svelte';
    import tr from '$lib/translate.svelte';
    type Props={
    changePhysicFn:(slim:boolean,taille:number)=>void
    editor:SkinEditor
    canExport:boolean
    }
    var info:string|undefined = $state(undefined);
    var {changePhysicFn,editor,canExport}:Props=$props();
    var code:string|undefined=$state();
    var timer=$state(0);
    var int: NodeJS.Timeout | undefined;
    function allGood(){
      if(!currentAppearence.data.stats.firstname  ||currentAppearence.data.stats.firstname?.trim().length<1)
        return tr("editor.export.error.fill.firstname")
      if(!currentAppearence.data.stats.lastname|| currentAppearence.data.stats.lastname?.trim().length<1)
        return tr("editor.export.error.fill.lastname")
      if(!canExport)
        return tr("editor.export.error.fill.points")
    }
    function exporte()
    {
      exportCharacter(editor,currentAppearence.data).then(e=>{
          code=e
          timer=60;
          clearInterval(int);
          int=setInterval(()=>{
            if(timer<=0)
            {
              code=undefined;
              clearInterval(int);
            }
            timer--;
          },1000)
         
      })
    }
    function exportImage()
    {
      var dt=editor.toPNG(true);
      var element = document.createElement('a');
      element.setAttribute('href', dt);
      element.setAttribute('download', (currentAppearence.data.stats.firstname||"skin")+".png");
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    function saveDatas()
    {
      var file = new Blob([JSON.stringify(currentAppearence.data)], {type: "text/json"});
      var element = document.createElement('a');
      element.setAttribute('href', URL.createObjectURL(file));
      element.setAttribute('download', (currentAppearence.data.stats.firstname||"profileResurgence")+".json");
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    function loadDatas(ev:Event & { currentTarget: EventTarget & HTMLInputElement; })
    {
      if(!ev.currentTarget.files)
        return;
      var v:File=ev.currentTarget.files[0];
      if(v)
      {
        var reader=new FileReader();
        reader.onload=()=>{
          var js=JSON.parse(reader.result?.toString()||"") as SaveFormat
          if(js.skin)
            editor.loadSavedOrDefault(js.skin)
          if(js.apparence)
            changePhysicFn(js.apparence.slim,js.apparence.size)
        }
        reader.readAsText(v,"utf-8")
      }
    }
    function copyCode()
    {
      if(code)
      {
        navigator.clipboard.writeText(code)
        info=tr("editor.export.info.copy");
        setTimeout(() => {
        info=undefined;
        }, 2000);
      }
    }
</script>
<div class="h-full overflow-auto w-full">
        <div class="grid gap-6 mb-6 md:grid-cols-2">
          <Button id="export-button" type="button" class=col-span-2>
            {tr("editor.export.button.export")}
            <svg class="w-6 h-6 text-gray-50 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 10 4 4 4-4"/>
            </svg>
          </Button>
          <Dropdown simple triggeredBy="#export-button" >
            <DropdownItem class="flex items-center" onclick={saveDatas}>
                {tr("editor.export.button.save")}
            </DropdownItem>
            <Tooltip placement="left"  type="dark">{tr("editor.export.button.save.tip")}</Tooltip>
            <DropdownItem class="flex items-center" onclick={exportImage}>
              {tr("editor.export.button.download")}
            </DropdownItem>
            <Tooltip  placement="left"  type="dark">{tr("editor.export.button.download.tip")}</Tooltip>
          </Dropdown>
          <Button type="button" class="col-span-2" onclick={()=>{document.getElementById("data_uploader").click()}}>{tr("editor.export.button.load")}</Button>
          <Tooltip  placement="left"  type="dark">{tr("editor.export.button.load.tip")}</Tooltip>
          {#await allGood() then errorText}
            {#if errorText ==undefined}
              <Button class="grow bg-secondary-text col-span-2" type="button" size="xl" onclick={exporte} >{tr("editor.export.button.code")}</Button>
              <Tooltip  placement="left"  type="dark">{tr("editor.export.button.code.tip")}</Tooltip>
            {:else}
              <Button class="grow bg-gray-600 text-gray-950 col-span-2" type="button" size="xl">{tr("editor.export.button.code")}</Button>
              <div class="col-span-2">
                <p class="text-red-500">{errorText}</p>
              </div>
            {/if}
          {/await}
          
         
          {#if code}
            <div class="col-span-2">
              <p class="text-primary-800">{tr("editor.export.button.code.copy.tip")}</p>
              <div class="flex items-center">
              <Input class="rounded-none w-22 h-10 rounded-l-lg " type="text" readonly value={code}/>
              <Button class=" rounded-none bg-secondary-text col-span-2 p-0 rounded-r-lg w-12 h-9" type="button" onclick={copyCode}>
              <img src="/images/svg/copy.svg" alt="copy icon" class="w-8 h-8">
              </Button>
              <Tooltip>{tr("editor.export.button.code.copy")}</Tooltip>
              </div>
              <p  class="text-primary-800"> {tr("editor.export.code.text.pref")} <b class="text-secondary-text">{timer}</b> {tr("editor.export.code.text.suff")}</p>
            </div>
          {/if}
        <input hidden type="file" accept=".json" id="data_uploader" onchange={loadDatas}>
      </div>
      {#if info}
        <Toast class="fixed bottom-4 right-4 rounded-lg bg-green-300 text-primary-50" onclose={()=>{info=undefined}}>
            {info}
        </Toast>
      {/if}
</div>