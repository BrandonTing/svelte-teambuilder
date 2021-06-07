<script>
    import Folder from './Folder.svelte'

    //get from local store 
    let folders = [
        {
            name: 'folder 1',
            teams: [
                {
                    name: 'team 1',
                },
                {
                    name: 'team 2',
                },
            ]
        },
        {
            name: '花環磨血',
            teams: [
                {
                    name: 'team 3',
                },
                {
                    name: 'team 4',
                },
            ]
        },
    ]
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
</script>

<div>
    <button class="btn btn-primary" on:click={addFolderHandler}>Add Folder</button>
    {#each folders as folder, i}
        <Folder 
            folders={folders} 
            name={folder.name} 
            teams={folder.teams} 
            index={i} 
            deleteHandler={deleteFolderHandler} 
            setHandler={setFolderHandler}
            moveTeamHandler={moveTeamHandler} />
    {/each}
</div>
