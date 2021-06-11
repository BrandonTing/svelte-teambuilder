<script>
    import Pokemon from './Pokemon.svelte';
    export let nowTeam;
    export let backFoldersHandler;
    const addPokemonHandler = () => {
        console.log('add pokemon')
    }
</script>

<style>
</style>

<h5>
    {nowTeam.name}
    <button class="btn btn-secondary" on:click={backFoldersHandler}>Back</button>
    <button class="btn btn-primary" on:click={addPokemonHandler}>Add Pokemon</button>
</h5>
{#each nowTeam.pokemons as pokemon}
    <Pokemon pokemon={pokemon} />
{/each}
