<script>
    import { stats } from './Constant.js'
    export let pokemon;
    export let deletePokemonHandler;
    let pokemonMoves = {};
    Array.from({length: 4}, (v, i) => i + 1).forEach((key, idx) => {
        pokemonMoves[key] = pokemon.moves[idx] || ''
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
</style>

<div class="card position-relative"> 
    <div class="card-body row">
        <!-- name ability item -->
        <div class="col-7">
            <button class="btn btn-danger" on:click={deletePokemonHandler}>Delete</button>
            <input class="col-3" type="text" placeholder="Name" bind:value={pokemon.name}>
            <input class="col-3" type="text" placeholder="Ability" bind:value={pokemon.ability}>
            <input class="col-3" type="text" placeholder="Item" bind:value={pokemon.item}>
        </div>
        <!-- moves -->
        <div class="col-2">
            {#each Object.keys(pokemonMoves) as moveIdx}
                <input type="text" class="move-inputs" placeholder={`Move ${moveIdx}`} bind:value={pokemonMoves[moveIdx]}>
            {/each}
        </div>
        <!-- spreads -->
        <div class="col-3 row stat-inputs">
            {#each Object.keys($stats) as stat}
                <p class="col-3">{stat}</p>
                <input class="col" type="number" placeholder={$stats[stat].text} bind:value={pokemon.ev[stat]} max={252} min={0} step={4}>
                <p class="col-3">200<p>
            {/each}
        </div>
    </div>
</div>
