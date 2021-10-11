<script>
    export let team;
    export let index;
    export let deleteHandler;
    export let setHandler;
    export let folders;
    export let moveTeamHandler;
    export let toggleShowDetailHandler;
    let showRename = false;
    let showFoldersList = false;
    let teamName = team.name;
    const toggleRenameHandler = () => {
        showRename = !showRename;
    }
    const toggleMoveHandler = () => {
        // 移到其他folder
        showFoldersList = !showFoldersList;
    }
    const renameHandler = () => {
        const updatedTeam = {
            ...team,
            name: teamName,
        }
        setHandler(updatedTeam, index)
    }
    const moveHandler = (newFolderIdx) => {
        deleteHandler(index);
        moveTeamHandler({name: teamName}, newFolderIdx);
        toggleMoveHandler();
    }
</script>

<style>
    .card {
        margin: 0.5rem 0;
    }
    .team-btns {
        top: 0.5rem;
        right: 1rem;
    }
    .card-title {
        margin-bottom: 0
    }
    ul {
        z-index: 999;
        right: 1rem;
    }
    li {
        cursor: pointer;
    }
</style>

<div class="card position-relative">
    <div class="card-body">
        <h5 class="card-title">{team.name}</h5>
        <!-- members -->
        <!-- btns -->
        <div class="team-btns position-absolute">
            <button class="btn btn-secondary" on:click={toggleShowDetailHandler}>Edit</button>
            {#if showRename}
                <input type="text" placeholder="Username" bind:value={teamName}>
                <button class="btn btn-primary" on:click={() => {renameHandler(index, teamName);showRename = !showRename}}>Confirm</button>
            {/if}
            <button class="btn btn-secondary" on:click={toggleRenameHandler}>{showRename ? 'Cancel Rename' : 'Rename'}</button>
            <button class="btn btn-danger" on:click={() => deleteHandler(index)}>Delete</button>
            <button class="btn btn-danger" on:click={toggleMoveHandler}>Move to</button>
        </div>
        {#if showFoldersList}
            <!-- folders lists for moving teams -->
            <ul class="list-group position-absolute">
                {#each folders as folder, i}
                    <li class="list-group-item" on:click={() => moveHandler(i)}>{folder.name}</li>
                {/each}
            </ul>
        {/if}
        <div class='icon-container'>
            {#each team.pokemons as pokemon}
                <img src={pokemon.iconUrl} alt={pokemon.name}>
            {/each}
        </div>
    </div>
</div>
