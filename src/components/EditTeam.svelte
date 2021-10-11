<script>
    import Pokemon from './Pokemon.svelte';
    export let nationalDex;
    export let nowTeam;
    export let backFoldersHandler;
    // export let addPokemonHandler;
    // export let deletePokemonHandler;
    export let updateTeamHandler;
    let showPaste;
    let paste;
    const addPokemonHandler = () => {
        if(nowTeam.pokemons.length >= 6) return
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
                    baseStats: {},
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

    const exportPasteHandler = () => {
        paste = nowTeam.pokemons.map(pokemon => {
            const { name, ability, item, moves, ev, iv, } = pokemon;
            if(!name) return '' 
            return `
                ${name} @ ${item}
                Ability: ability
                Level: 50
                EVs: ${ev.hp} HP / ${ev.def} DEF / ${ev.spa} SpA / ${ev.spd} SpD / ${ev.spe} Spe
            `
        }).join('')
        showPaste = true;
    }
    const closePasteHandler = () => { showPaste = false }
</script>

<style>
    textarea {
        width: 100%;
        height: 30rem;
    }

</style>

<h5>
    {nowTeam.name}
    <button class="btn btn-secondary" on:click={backFoldersHandler}>Back</button>
    <button class="btn btn-success" on:click={addPokemonHandler}>Add Pokemon</button>
    {#if showPaste}
        <button class="btn btn-primary" on:click={closePasteHandler}>Close</button>
    {:else}
        <button class="btn btn-primary" on:click={exportPasteHandler}>Export</button>
    {/if}
</h5>
{#if showPaste}
    <textarea>{paste}</textarea>
{:else}
    {#each nowTeam.pokemons as pokemon, i}
        <Pokemon nationalDex={nationalDex} pokemon={pokemon} deletePokemonHandler={() => deletePokemonHandler(i)} updateHandler={(updatedPokemon) => updatePokemonHandler(i, updatedPokemon)} />
    {/each}
{/if}

