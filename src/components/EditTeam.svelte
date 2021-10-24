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
                    nature: ''
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

    const getPaste = () => {
        return nowTeam.pokemons.map(pokemon => {
            const { name, ability, item, moves, ev, iv, nature } = pokemon;
            if(!name) return '' 
            return `
                ${name} @ ${item}
                Ability: ${ability}
                Level: 50
                EVs: ${ev.hp} HP / ${ev.def} DEF / ${ev.spa} SpA / ${ev.spd} SpD / ${ev.spe} Spe
                ${nature} Nature  
                IVs: ${iv.hp} HP / ${iv.def} DEF / ${iv.spa} SpA / ${iv.spd} SpD / ${iv.spe} Spe
                - ${moves[0]}
                - ${moves[1]}
                - ${moves[2]}
                - ${moves[3]}
            `
        }).join('')
    }

    const exportPasteHandler = () => {
        paste = getPaste();
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

