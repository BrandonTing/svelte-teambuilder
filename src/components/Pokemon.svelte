<script>
    import { onMount } from "svelte";
    import { stats } from './Constant.js'
    import * as items from '../data/items.json'
    import * as moves from '../data/moves.json'
    import * as natures from '../data/natures.json'
    export let pokemon;
    export let deletePokemonHandler;
    export let nationalDex;
    export let updateHandler;
    let pokemonMoves = {};
    let searchList = [];
    let searchType = '';
    let curMoveIdx = 0;
    Array.from({length: 4}, (v, i) => i).forEach((key, idx) => {
        pokemonMoves[key] = pokemon.moves[idx] || ''
    });
    // [(種族值×2+個體值+努力值÷4)×Lv÷100]+10+Lv
    const getHp = (baseStats, ev, iv) => {
        return Math.floor((baseStats.hp*2 + iv.hp + Math.floor(ev.hp/4))/2) + 10 + 50;
    }
    // {[(種族值×2+個體值+努力值÷4)×Lv÷100]+5}×性格補正(1.1、1.0、0.9)
    const getStat = (baseStats, ev, iv, code, natureModify = 1.0) => {
        return Math.floor((Math.floor((baseStats[code]*2 + iv[code] + Math.floor(ev[code]/4))/2) + 5)*natureModify);
    }
    const searchPokemonHandler = (e) => {
        searchType = 'name';
        searchList = Object.values(nationalDex).filter(pokemon => pokemon.name.toLowerCase().includes(e.target.value.toLowerCase()))
    }
    const searchAbilityHandler = async () => {
        const curPokemon = Object.values(nationalDex).find(mon => mon.name.toLowerCase().includes(pokemon.name.toLowerCase()))
        searchType = 'ability';        
        searchList = Object.values(curPokemon.abilities).map(abi => {
            return {name: abi}
        });
    }
    const searchItemsHandler = (e) => {
        searchType = 'item';
        searchList = Object.values(items.Items).filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()))
    }
    const searchMovesHandler = (e, moveIdx) => {
        curMoveIdx = moveIdx
        searchType = 'moves';
        searchList = Object.values(moves.Moves).filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()))
    }
    const updatePokemonHandler = (updatedObj) => { 
        const updatedPokemon = {
            ...pokemon,
            ...updatedObj
        }
        updateHandler(updatedPokemon);
        clearSearchList();
    }
    const updateStatsHandler = (e, statCode) => {
        const { baseStats, ev, iv } = pokemon;
        if(statCode === 'hp') {
            updateHandler({
                ...pokemon,
                stats: {
                    ...pokemon.stats,
                    [statCode]: getHp(baseStats, ev, iv),
                }
            });
        } else {
            const { nature} = pokemon;
            const { minus, plus } = nature;
            let natureModify = 1;
            if(statCode === minus) natureModify = 0.9;
            if(statCode === plus) natureModify = 1.1;
            
            updateHandler({
                ...pokemon,
                stats: {
                    ...pokemon.stats,
                    [statCode]: getStat(baseStats, ev, iv, statCode, natureModify),
                }
            });
        }
    }    
    
    const selectHandler = async (selected) => {
        switch(searchType) {
            case 'name':
                const {name, baseStats } = selected
                let stats = {}
                let iv = {};
                let ev = {};
                Object.keys(baseStats).forEach(baseStat => {
                    // stat 換算
                    iv[baseStat] = 31;
                    ev[baseStat] = 0;
                    if(baseStat === 'hp') {
                        stats[baseStat] = getHp(baseStats, ev, iv);
                    } else {
                        stats[baseStat] = getStat(baseStats, ev, iv, baseStat);
                    }
                })
                const sprite = await fetch(`https://pokeapi.co/api/v2/pokemon/${selected.name.toLowerCase()}`)
                .then(r => r.json())
                .then(data => {
                    return { 
                        sprite: data.sprites.other['official-artwork'].front_default || data.sprites.front_default, 
                        icon: data.sprites.versions['generation-viii'].icons.front_default
                    };
                }).catch(err => {
                    return {}
                })
                updatePokemonHandler({
                    name,
                    spriteUrl: sprite.sprite,
                    iconUrl: sprite.icon,
                    baseStats,
                    stats,
                    iv,
                    ev
                });
                break;
            case 'ability': 
                updatePokemonHandler(
                    { ability: selected.name }
                )
                break;
            case 'item': 
                updatePokemonHandler(
                    { item: selected.name }
                )
                break;
            case 'moves': 
                updatePokemonHandler({ 
                    moves: {
                        ...pokemon.moves,
                        [curMoveIdx]: selected.name
                    } 
                })
                pokemonMoves[curMoveIdx] = selected.name
                break;                
            default: 
                break;
        }
    }
    const clearSearchList = () => {
        searchList = []
    }
    const changeNature = (nature) => {
        const { baseStats, ev, iv, stats } = pokemon;
        const updatedStats = {};
        const { name, plus, minus } = natures.Natures[nature];
        
        for(let statCode in stats) {
            if(statCode === plus) {
                const natureModify = 1.1;
                updatedStats[statCode] = getStat(baseStats, ev, iv, statCode, natureModify);
            } else if (statCode === minus) {
                const natureModify = 0.9;
                updatedStats[statCode] = getStat(baseStats, ev, iv, statCode, natureModify);
            } else {
                const natureModify = 1;
                updatedStats[statCode] = getStat(baseStats, ev, iv, statCode, natureModify);
            }
        }
        updateHandler({
            ...pokemon,
            nature: name,
            stats: {...updatedStats}
        });
    }
    const updateStats = (baseStats, ev, iv, stats, nature) => {
        const updatedStats = {};
        const { plus, minus } = natures.Natures[nature.toLowerCase()] || {};
        for(let statCode in stats) {
            if(statCode === plus) {
                const natureModify = 1.1;
                updatedStats[statCode] = getStat(baseStats, ev, iv, statCode, natureModify);
            } else if (statCode === minus) {
                const natureModify = 0.9;
                updatedStats[statCode] = getStat(baseStats, ev, iv, statCode, natureModify);
            } else if(statCode === 'hp') {
                updatedStats.hp =  getHp(baseStats, ev, iv)
            } else {
                const natureModify = 1;
                updatedStats[statCode] = getStat(baseStats, ev, iv, statCode, natureModify);
            }
        }
        updateHandler({
            ...pokemon,
            stats: {...updatedStats}
        });
    }
    onMount(() => {
        const { baseStats, ev, iv, stats, nature } = pokemon;
        updateStats(baseStats, ev, iv, stats, nature)
    });
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
                <input class="col-3" type="text" placeholder="Item" bind:value={pokemon.item} on:change={searchItemsHandler}>
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
                <input type="text" class="move-inputs" placeholder={`Move ${Number(moveIdx) + 1}`} bind:value={pokemonMoves[moveIdx]} on:change={(e) => searchMovesHandler(e, moveIdx)}>
            {/each}
        </div>
        <!-- spreads -->
        <div class="col-5 stat-inputs">
            {#each Object.values($stats) as stat}
                <div class="row">
                    <p class="col-5">{stat.text}</p>
                    <input class="col-3" type="number" placeholder='ev' bind:value={pokemon.ev[stat.code]} max={252} min={0} step={4} on:change={(e) => updateStatsHandler(e, stat.code)}>
                    <input class="col-2" type="number" placeholder='iv' bind:value={pokemon.iv[stat.code]} max={31} min={0} step={1} on:change={(e) => updateStatsHandler(e, stat.code)}>
                    <p class="col-2">{pokemon.stats[stat.code] || 0}</p>
                </div>
            {/each}
            <div class="row">
                <label for="plus-stat" class="col-5 text-end">Natures</label>
                <select class="col-3" id="plus-stat" on:blur={(e) => changeNature(e.target.value)}>
                    <option value=''>pls select</option>
                    {#each Object.keys(natures.Natures) as nature}
                        <option value={nature}>{nature}</option>
                    {/each}
                </select>
                <!-- <label for="plus-stat" class="col-3">+ nature</label>
                <select class="col-3" id="plus-stat" on:blur={(e) => changeNature('plus', e.target.value)}>
                    <option value=''>pls select</option>
                    {#each Object.values($stats).filter(stat => stat.text !== 'hp') as stat}
                        <option value={stat.code}>{stat.text}</option>
                    {/each}
                </select>
                <label for="minus-stat" class="col-3">- nature</label>
                <select class="col-3" id="minus-stat" on:blur={(e) => changeNature('minus', e.target.value)}>
                    <option value=''>pls select</option>
                    {#each Object.values($stats).filter(stat => stat.text !== 'hp') as stat}
                        <option value={stat.code}>{stat.text}</option>
                    {/each}
                </select> -->

            </div>
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
