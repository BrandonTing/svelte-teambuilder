<script>
    import Team from './Team.svelte'
    export let folder;
    export let index;
    export let deleteHandler;
    export let setHandler;
    export let folders;
    export let moveTeamHandler;
    export let toggleShowFoldersHandler;
    const { name, teams, note } = folder;
    let folderName = name;
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
        folderName = name;
    }
    const renameHandler = () => {
        const updatedFolder = {
            teams,
            name: folderName
        };
        setHandler(updatedFolder, index)
        showRename = !showRename;
    };
    const addTeamHandler = () => {
        const updatedFolder = {
            name, 
            teams: [
                {
                    name: 'untitled',
                    pokemons: [],
                    note: ''
                }, 
                ...teams
            ],
            note: ''
        }
        setHandler(updatedFolder, index)
    };
    const deleteTeamHandler = (i) => {
        const updatedFolder = {
            name,
            teams: teams.filter((team, idx) => i !== idx),
        }
        setHandler(updatedFolder, index)
    }
    const setTeamHandler = (updatedTeam, i) => {
        const updatedFolder = {
            name,
            teams: teams.map((team, idx) => {
                if(idx === i) {
                    return updatedTeam
                } else {
                    return team
                }
            }),
        }
        setHandler(updatedFolder, index)
    }
    const updateFolderNoteHandler = (e) => {
        const updatedFolder = {
            name,
            teams,
            note: e.target.value
        }
        setHandler(updatedFolder, index)

    }
</script>

<style>
    .card {
        margin: 0.5rem 0;
    }
    .header-btns {
        top: 0.5rem;
        right: 1rem;
    }    
</style>

<!-- expandable folder -->
<div class="card position-relative"> 
    <h2 class="card-header" id={`folder-header-${index}`} on:click={toggleExpandHandler}>
        {name}
    </h2>
    <div class="header-btns position-absolute">
        <!-- delete/edit folder btn -->
        {#if showRename}
            <input type="text" placeholder="Username" bind:value={folderName}>
            <button class="btn btn-primary" on:click={renameHandler}>Confirm</button>
        {/if}
        <button class="btn btn-secondary" on:click={toggleRenameHandler}>{showRename ? 'Cancel Rename' : 'Rename'}</button>
        <button class="btn btn-danger" on:click={() => deleteHandler(index)}>Delete</button>
    </div>
    <div class="collapse show" id={`folder-content-${index}`}>
        <div class="card-body">
            <button class="btn btn-primary" on:click={() => addTeamHandler(index)}>Add team</button>
            <!-- render folders/teams from txt file -->
            {#each teams as team, i}
                <Team 
                    folders={folders} 
                    team={team} 
                    index={i} 
                    setHandler={setTeamHandler} 
                    deleteHandler={deleteTeamHandler}
                    moveTeamHandler={moveTeamHandler}
                    toggleShowDetailHandler={() => toggleShowFoldersHandler(false, index, i)} />
            {/each}
            <h5>Note</h5>
            <textarea class="w-100" on:change={updateFolderNoteHandler} placeholder="Type in your note of this folder">{note}</textarea>
        </div>
    </div>
</div>
