<script>
    import Pokemon from './Pokemon.svelte';
    export let nationalDex;
    export let nowTeam;
    export let backFoldersHandler;
    // export let addPokemonHandler;
    // export let deletePokemonHandler;
    export let updateTeamHandler;
    const addPokemonHandler = () => {
        const updatedTeam = {
            ...nowTeam,
            pokemons: [
                ...nowTeam.pokemons,
                {
                    name: '',
                    ability: '',
                    item: '',
                    moves: {
                        1: '',
                        2: '',
                        3: '',
                        4: '',
                    },
                    spriteUrl: '',
                    baseStats,
                    ev: {},
                    iv: {},
                    stats: {},
                }
            ]
        };
        updateTeamHandler(updatedTeam);
    }
    const deletePokemonHandler = (i) => {
        const updatedTeam = {
            ...nowTeam,
            pokemons: nowTeam.pokemons.filter((pokemon, idx) => idx !== i)
        };
        updateTeamHandler(updatedTeam);
    }
    const updatePokemonHandler = (idx, updatedPokemon) => {
        const updatedTeam = {
            ...nowTeam, 
            pokemons: nowTeam.pokemons.map((pokemon, i) => {
                if(i !== idx) {
                    return pokemon 
                } else {
                    return updatedPokemon
                }
            })
        }
        updateTeamHandler(updatedTeam)
    }
</script>

<style>
</style>

<h5>
    {nowTeam.name}
    <button class="btn btn-secondary" on:click={backFoldersHandler}>Back</button>
    <button class="btn btn-primary" on:click={addPokemonHandler}>Add Pokemon</button>
</h5>
{#each nowTeam.pokemons as pokemon, i}
    <Pokemon nationalDex={nationalDex} pokemon={pokemon} deletePokemonHandler={() => deletePokemonHandler(i)} updateHandler={(updatedPokemon) => updatePokemonHandler(i, updatedPokemon)} />
{/each}
