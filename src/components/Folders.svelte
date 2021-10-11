<script>
    import { onMount } from "svelte";
    import Folder from './Folder.svelte'
    import EditTeam from './EditTeam.svelte'
    import * as dex from '../data/pokedex.json'
    const nationalDex = dex.Pokedex;
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
    onMount(() => {
        const existedFolders = localStorage.getItem('folders') || "[]";
        folders = JSON.parse(existedFolders); 
    });

    const addFolderHandler = () => {
        folders = [...folders, {name: 'default', teams: []}]
        $: localStorage.setItem('folders', JSON.stringify(folders))
    }
    const deleteFolderHandler = (i) => {
        folders = folders.filter((item, index) => i !== index);
        $: localStorage.setItem('folders', JSON.stringify(folders))
    }
    const setFolderHandler = (updatedFolder, i) => {
        folders = folders.map((folder, index) => {
            if(index === i) {
                return updatedFolder
            } else {
                return folder
            }
        })
        $: localStorage.setItem('folders', JSON.stringify(folders))
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
        $: localStorage.setItem('folders', JSON.stringify(folders))
    }
    const updateTeamHandler = (updatedTeam) => {
        // TODO 存localstore
        folders = folders.map((folder, i) => {
            if(i !== nowTeam.folder) {
                return folder
            } else {
                const updatedTeams = folder.teams.map((team, i) => {
                    if(i !== nowTeam.team) {
                        return team 
                    } else {
                        return updatedTeam
                    }
                })
                return {
                    ...folder,
                    teams: updatedTeams
                }          
            }
        })
        $: localStorage.setItem('folders', JSON.stringify(folders))
    }
</script>

<style>
    .folders-container {
        padding: 2rem 0;
    }
</style>

<div class='folders-container'>
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
            nationalDex={nationalDex}
            nowTeam={folders.find((folder, i) => i === nowTeam.folder).teams.find((team, i) => i === nowTeam.team)} 
            backFoldersHandler={() => toggleShowFoldersHandler(true)} 
            updateTeamHandler={updateTeamHandler} />
    {/if}
</div>
