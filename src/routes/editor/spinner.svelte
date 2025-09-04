<script lang="ts">
    import tr from "$lib/translate.svelte";
    import { Spinner } from "flowbite-svelte";

</script>
 <div class="p-3 h-5/6 rounded-lg bg-primary-400 w-5/6 flex flex-col items-center justify-center">
                <h1 class="text-3xl text-secondary-text1 m-5">{tr("spinner.text")}</h1>
                    <Spinner size="16" color="green" />
            </div>