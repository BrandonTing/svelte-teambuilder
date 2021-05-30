<script>
    const toggleExpand = (e) => {
        e.preventDefault();
        const index =e.target.id.split('-')[2];
        const targetClassList = document.getElementById(`folder-content-${index}`).classList;
        if(targetClassList.contains('show')) {
            targetClassList.remove('show');
        } else {
            targetClassList.add('show');
        }
    }
</script>
<div>
    <!-- expandable fodler -->
    <!-- render folders from txt file -->
    <!-- show teams from txt data -->
    <div class="card"> 
        <h2 class="card-header" id="folder-header-1" on:click={toggleExpand}>
            Folder #1
        </h2>
        <div class="collapse show" id="folder-content-1">
            <div class="card-body">
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
            </div>
        </div>
    </div>
    <div class="card">
        <h2 class="card-header" id="folder-header-2"  on:click={toggleExpand}>
            Folder #2
        </h2>
        <div class="collapse" id="folder-content-2">
            <div class="card-body">
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
            </div>
        </div>
    </div>
</div>
