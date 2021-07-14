import { readable } from 'svelte/store';

export const stats = readable({
    HP: {
        code: 'hp',
        text: 'hp',
    },
    ATK: {
        code: 'atk',
        text: 'attack',
    },
    DEF: {
        code: 'def',
        text: 'defense',
    },
    SPA: {
        code: 'spa',
        text: 'special-attack',
    },
    SPD: {
        code: 'spd',
        text: 'special-defense',
    },
    SPE: {
        code: 'spe',
        text: 'speed',
    },
})