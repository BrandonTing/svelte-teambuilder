<script>
    import { stats } from './Constant.js'
    export let pokemon;
    export let deletePokemonHandler;
    export let nationalDex;
    export let updateHandler;
    let pokemonMoves = {};
    let searchList = [];
    let searchType = '';
    let curPokemonData;
    Array.from({length: 4}, (v, i) => i + 1).forEach((key, idx) => {
        pokemonMoves[key] = pokemon.moves[idx] || ''
    });
    const searchPokemonHandler = (e) => {
        searchType = 'name';
        searchList = Object.values(nationalDex).filter(pokemon => pokemon.name.toLowerCase().includes(e.target.value.toLowerCase()))
    }
    const searchAbilityHandler = () => {
        searchType = 'ability';        
        searchList = Object.values(curPokemonData.abilities).map(abi => {
            return {name: abi}
        });
    }
    const updatePokemonHandler = (updatedObj) => { 
        const updatedPokemon = {
            ...pokemon,
            ...updatedObj
        }
        updateHandler(updatedPokemon);
        clearSearchList();
    }
    const selectHandler = async (selected) => {
        switch(searchType) {
            case 'name':
                curPokemonData = selected;
                const {name, baseStats } = selected
                let base_stats = {}
                let iv = {};
                let ev = {};
                Object.keys(baseStats).forEach(baseStat => {
                    base_stats[baseStat] = baseStats[baseStat];
                    iv[baseStat] = 31;
                    ev[baseStat] = 0;
                })
                const sprite = await fetch(`https://pokeapi.co/api/v2/pokemon/${selected.name.toLowerCase()}`)
                .then(r => r.json())
                .then(data => {
                    return data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
                }).catch(err => {
                    return ''
                })
                updatePokemonHandler({
                    name,
                    spriteUrl: sprite,
                    base_stats,
                    iv,
                    ev
                });
                break;
            case 'ability': 
                updatePokemonHandler(
                    { ability: selected.name }
                )
                break;
            default: 
                break;
        }
    }
    const clearSearchList = () => {
        searchList = []
    }
</script>

<style>
    .card, .move-inputs {
        margin: 0.5rem 0;
    }
    .stat-inputs >* {
        padding: 0.4rem;
        margin: 0;
    }
    .stat-inputs p {
        text-align: right;
    }
    .list-group-item {
        cursor: pointer;
    }
    img {
        height: 20rem;
        width: 20rem;
        margin: auto;
    }
</style>

<div class="card position-relative"> 
    <div class="card-body row">
        <!-- name ability item -->
        <div class="col-5">
            <div class="row">
                <button class="col-3 btn btn-danger" on:click={deletePokemonHandler}>Delete</button>
                <input class="col-3" type="text" placeholder="Name" bind:value={pokemon.name} on:change={searchPokemonHandler}>
                <input class="col-3" type="text" placeholder="Ability" bind:value={pokemon.ability} on:focus={searchAbilityHandler} >
                <input class="col-3" type="text" placeholder="Item" bind:value={pokemon.item}>
            </div>
            {#if pokemon.spriteUrl}
                <div class="row">
                    <img src={pokemon.spriteUrl} alt={pokemon.name}>
                </div>
            {/if}
        </div>
        <!-- moves -->
        <div class="col-2">
            {#each Object.keys(pokemonMoves) as moveIdx}
                <input type="text" class="move-inputs" placeholder={`Move ${moveIdx}`} bind:value={pokemonMoves[moveIdx]}>
            {/each}
        </div>
        <!-- spreads -->
        <div class="col-5 stat-inputs">
            {#each Object.values($stats) as stat}
                <div class="row">
                    <p class="col-5">{stat.text}</p>
                    <input class="col-3" type="number" placeholder='ev' bind:value={pokemon.ev[stat.code]} max={252} min={0} step={4}>
                    <input class="col-2" type="number" placeholder='iv' bind:value={pokemon.iv[stat.code]} max={31} min={0} step={1}>
                    <p class="col-2">{pokemon.base_stats[stat.code] || 0}</p>
                </div>
            {/each}
        </div>
    </div>
    {#if searchList.length}
        <ul class="list-group">
            {#each searchList as item}
                <li class="list-group-item" on:click={() => selectHandler(item)}>{item.name}</li>
            {/each}
        </ul>
    {/if}
</div>
