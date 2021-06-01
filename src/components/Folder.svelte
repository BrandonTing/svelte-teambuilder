<script>
    import Team from './Team.svelte'
    export let folder;
    export let index;
    export let deleteHandler;
    export let renameHandler;
    let name = folder;
    let showRename = false;
    const toggleExpandHandler = (e) => {
        e.preventDefault();
        const index =e.target.id.split('-')[2];
        const targetClassList = document.getElementById(`folder-content-${index}`).classList;
        if(targetClassList.contains('show')) {
            targetClassList.remove('show');
        } else {
            targetClassList.add('show');
        }
    }
    const toggleRenameHandler = () => {
        showRename = !showRename;
        name = folder;
    }
</script>

<style>
    .card {
        margin: 0.5rem 0;
        position: relative;
    }
    .header-btns {
        position: absolute;
        top: 0.5rem;
        right: 1rem;
    }    
</style>

<!-- expandable folder -->
<!-- delete/edit folder btn -->
<div class="card"> 
    <h2 class="card-header" id={`folder-header-${index}`} on:click={toggleExpandHandler}>
        {folder}
    </h2>
    <div class="header-btns">
        {#if showRename}
            <input type="text" placeholder="Username" bind:value={name}>
            <button class="btn btn-primary" on:click={() => {renameHandler(index, name);showRename = !showRename}}>Confirm</button>
        {/if}
        <button class="btn btn-secondary" on:click={toggleRenameHandler}>{showRename ? 'Cancel Rename' : 'Rename'}</button>
        <button class="btn btn-danger" on:click={() => deleteHandler(index)}>Delete folder and all teams inside</button>
    </div>
    <div class="collapse show" id={`folder-content-${index}`}>
        <div class="card-body">
            <!-- render folders/teams from txt file -->
            <Team />
        </div>
    </div>
</div>
