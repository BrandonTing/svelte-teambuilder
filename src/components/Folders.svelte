<script>
    import { onMount } from "svelte";
    import Folder from './Folder.svelte'
    import EditTeam from './EditTeam.svelte'

    let showFolders = true;
    let nowTeam = {
        folder: 0,
        team: 0
    };
    const toggleShowFoldersHandler = (show, folderIdx, teamIdx) => {
        showFolders = show;
        if(!showFolders) {
            nowTeam = {
                folder: folderIdx,
                team: teamIdx,
            }
        }
    }
    //get from local store 
    let folders = [];
    $: localStorage.setItem('folders', JSON.stringify(folders))
    onMount(() => {
        const existedFolders = localStorage.getItem('folders');
        folders = JSON.parse(existedFolders);
    });
    const addFolderHandler = () => {
        folders = [...folders, {name: 'default', teams: []}]
    }
    const deleteFolderHandler = (i) => {
        folders = folders.filter((item, index) => i !== index);
    }
    const setFolderHandler = (updatedFolder, i) => {
        folders = folders.map((folder, index) => {
            if(index === i) {
                return updatedFolder
            } else {
                return folder
            }
        })
    }
    const moveTeamHandler = (team, newIdx) => {
        folders = folders.map((folder, index) => {
            if(index === newIdx) {
                return {
                    ...folder,
                    teams: [
                        ...folder.teams,
                        team
                    ]
                }
            } else {
                return folder
            }
        })
    }
    const addPokemonHandler = () => {
        folders = folders.map(((folder, i) => {
            if(i !== nowTeam.folder) {
                return folder
            } else {
                const updatedTeam = folder.teams.map((team, i) => {
                    if(i !== nowTeam.team) {
                        return team 
                    } else {
                        return {
                            ...team,
                            pokemons: [
                                ...team.pokemons,
                                {
                                    name: '',
                                    ability: '',
                                    item: '',
                                    moves: [],
                                    ev: {}
                                }
                            ]
                        }
                    }
                })
                return {
                    ...folder,
                    teams: updatedTeam
                }
            }
        }))
    }
    const deletePokemonHandler = (i) => {
        folders = folders.map(((folder, i) => {
            if(i !== nowTeam.folder) {
                return folder
            } else {
                const updatedTeam = folder.teams.map((team, i) => {
                    if(i !== nowTeam.team) {
                        return team 
                    } else {
                        return {
                            ...team,
                            pokemons: team.pokemons.filter((pokemon, idx) => idx !== i)
                        }
                    }
                })
                return {
                    ...folder,
                    teams: updatedTeam
                }
            }
        }))
    }
</script>

<div>
    {#if showFolders} 
        <button class="btn btn-primary" on:click={addFolderHandler}>Add Folder</button>
        {#each folders as folder, i}
            <Folder 
                folders={folders} 
                name={folder.name} 
                teams={folder.teams} 
                index={i} 
                deleteHandler={deleteFolderHandler} 
                setHandler={setFolderHandler}
                moveTeamHandler={moveTeamHandler}
                toggleShowFoldersHandler={toggleShowFoldersHandler} />
        {/each}
    {:else}
        <EditTeam 
            nowTeam={folders.find((folder, i) => i === nowTeam.folder).teams.find((team, i) => i === nowTeam.team)} 
            backFoldersHandler={() => toggleShowFoldersHandler(true)} 
            addPokemonHandler={addPokemonHandler}
            deletePokemonHandler={deletePokemonHandler} />
    {/if}
</div>
