import { readable } from 'svelte/store';

export const stats = readable({
    HP: 'HP',
    ATK: 'Attack',
    DEF: 'Defense',
    SPA: 'Special Attack',
    SPD: 'Special Defense',
    SPE: 'speed',
})