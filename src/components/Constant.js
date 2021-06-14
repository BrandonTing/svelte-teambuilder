import { readable } from 'svelte/store';

export const stats = readable({
    HP: {
        code: 'HP',
        text: 'HP',
    },
    ATK: {
        code: 'ATK',
        text: 'Attack',
    },
    DEF: {
        code: 'DEF',
        text: 'Defense',
    },
    SPA: {
        code: 'SPA',
        text: 'Special Attack',
    },
    SPD: {
        code: 'SPD',
        text: 'Special Defense',
    },
    SPE: {
        code: 'SPE',
        text: 'Speed',
    },
})