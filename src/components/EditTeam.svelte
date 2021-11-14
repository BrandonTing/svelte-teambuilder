<script>
    import Pokemon from './Pokemon.svelte';
    export let nationalDex;
    export let nowTeam;
    export let backFoldersHandler;
    // export let addPokemonHandler;
    // export let deletePokemonHandler;
    export let updateTeamHandler;
    import * as natures from '../data/natures.json';
    let showPaste;
    let paste;
    // [(種族值×2+個體值+努力值÷4)×Lv÷100]+10+Lv
    const getHp = (baseStats, ev, iv) => {
        return Math.floor((baseStats.hp*2 + iv.hp + Math.floor(ev.hp/4))/2) + 10 + 50;
    }
    // {[(種族值×2+個體值+努力值÷4)×Lv÷100]+5}×性格補正(1.1、1.0、0.9)
    const getStat = (baseStats, ev, iv, code, natureModify = 1.0) => {
        return Math.floor((Math.floor((baseStats[code]*2 + iv[code] + Math.floor(ev[code]/4))/2) + 5)*natureModify);
    }
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
                        0: '',
                        1: '',
                        2: '',
                        3: '',
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
            if(!name) return '';
            return `
                ${name} @ ${item}
                Ability: ${ability}
                Level: 50
                EVs: ${ev.hp} HP / ${ev.def} DEF / ${ev.spa} SpA / ${ev.spd} SpD / ${ev.spe} Spe
                ${nature} Nature  
                IVs: ${iv.hp} HP / ${iv.def} DEF / ${iv.spa} SpA / ${iv.spd} SpD / ${iv.spe} Spe
                ${moves[0] ? `- ${moves[0]}` : ''}
                ${moves[1] ? `- ${moves[1]}` : ''}
                ${moves[2] ? `- ${moves[2]}` : ''}
                ${moves[3] ? `- ${moves[3]}` : ''}
            `
        }).join('')
    }

    const exportPasteHandler = () => {
        paste = getPaste();
        showPaste = true;
    }
    const closePasteHandler = async() => { 
        showPaste = false;
        // 讀paste 轉成object
        const importPokemons = await paste.split(/[\n]+/g).reduce(async (unResolvedPre, cur) => {
            const pre = await unResolvedPre;
            if(cur.includes('@')) {
                const [ name, item ] = cur.split('@');
                const sprite = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.trim().toLowerCase()}`)
                .then(r => r.json())
                .then(data => {
                    return { 
                        sprite: data.sprites.other['official-artwork'].front_default || data.sprites.front_default, 
                        icon: data.sprites.versions['generation-viii'].icons.front_default
                    }
                }).catch(err => {
                    return {}
                })
                const target = Object.values(nationalDex).find(pokemon => pokemon.name.toLowerCase() === name.trim().toLowerCase());
                const { baseStats } = target;
                let stats = {};
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
                return [
                    ...pre, 
                    {
                        name: name.trim(),
                        item: item.trim(),
                        spriteUrl: sprite.sprite,
                        iconUrl: sprite.icon,
                        baseStats,
                        iv,
                        ev,
                        stats
                    }
                ]
            } else {
                return pre.map((pokemon, i) => {
                    if(i === pre.length - 1) {
                        if(cur.includes('Ability')) {
                            const ability = cur.split('Ability:')[1].trim()
                            return {
                                ...pokemon,
                                ability
                            }
                        } else if(cur.includes('EVs')) {
                            const newEv = {};
                            const evs = cur.split('EVs:')[1].split('/').map(ev => ev.trim().split(' ')).forEach(([val, key]) => {
                                newEv[key.toLowerCase()] = Number(val);
                            });
                            return {
                                ...pokemon,
                                ev: {
                                    ...pokemon.ev,
                                    ...newEv
                                },
                            }
                        } else if(cur.includes('IVs')) {
                            const newIv = {};
                            const ivs = cur.split('IVs:')[1].split('/').map(iv => iv.trim().split(' ')).forEach(([val, key]) => {
                                newIv[key.toLowerCase()] = Number(val);
                            });
                            return {
                                ...pokemon,
                                iv: {
                                    ...pokemon.iv,
                                    ...newIv
                                },
                            }
                        } else if(cur.includes('Nature')) {
                            return {
                                ...pokemon,
                                nature: cur.split('Nature')[0].trim()
                            }
                        } else if(cur[0] === '-') {
                            if(pokemon.moves) {
                                return {
                                    ...pokemon,
                                    moves: {
                                        ...pokemon.moves,
                                        [Object.values(pokemon.moves).length]: cur.split('-')[1].trim()
                                    }
                                }
                            } else {
                                return {
                                    ...pokemon,
                                    moves: {
                                        0: cur.split('-')[1].trim()
                                    }
                                }
                            }
                        }
                        return pokemon 
                    } else {
                        return pokemon
                    }
                })
            }
        }, Promise.resolve([]));
        const updatedTeam = {
            ...nowTeam,
            pokemons: importPokemons
        }
        updateTeamHandler(updatedTeam)
    }
    const updateTeamNoteHandler = (e) => {
        const updatedTeam = {
            ...nowTeam, 
            note: e.target.value
        }
        updateTeamHandler(updatedTeam)

    }
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
    <textarea bind:value={paste}></textarea>
{:else}
    {#each nowTeam.pokemons as pokemon, i}
        <Pokemon nationalDex={nationalDex} pokemon={pokemon} deletePokemonHandler={() => deletePokemonHandler(i)} updateHandler={(updatedPokemon) => updatePokemonHandler(i, updatedPokemon)} />
    {/each}
{/if}
<h5>Note</h5>
<textarea on:change={updateTeamNoteHandler} placeholder="Type in your note of this team">{nowTeam.note}</textarea>

