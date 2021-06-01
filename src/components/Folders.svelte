<script>
    import Folder from './Folder.svelte'

    //get from local store 
    let folders = [
        'default',
        '花環磨血'
    ]
    const addFolderHandler = () => {
        let cantUseDefaultName = true;
        let index = 0;
        while(cantUseDefaultName) {
            const newFolderName = `default${index === 0 ? '' : `_${index}`}`;
            if(!folders.find(name => name === newFolderName)) {
                folders = [newFolderName, ...folders]
                cantUseDefaultName = false;
            } else {
                index++
            }
        }
    }
    const renameFolderHandler = (i, value) => {
        folders = folders.map((folder, index) => {
            if(index === i) {
                return value
            } else {
                return folder
            }
        })
    }
    const deleteFolderHandler = (i) => {
        folders = folders.filter((item, index) => i !== index);
    }
</script>

<div>
    <button class="btn btn-primary" on:click={addFolderHandler}>Add Folder</button>
    <!-- add folder btn -->
    {#each folders as folder, i}
        <!-- expandable folder -->
        <!-- delete/edit folder btn -->
        <Folder folder={folder} index={i} deleteHandler={deleteFolderHandler} renameHandler={renameFolderHandler} />
    {/each}
</div>
