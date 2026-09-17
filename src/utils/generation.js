export const GENERATION_RANGES = [
  { value: 1, label: 'Geração 1', min: 1, max: 151 },
  { value: 2, label: 'Geração 2', min: 152, max: 251 },
  { value: 3, label: 'Geração 3', min: 252, max: 386 },
  { value: 4, label: 'Geração 4', min: 387, max: 493 },
  { value: 5, label: 'Geração 5', min: 494, max: 649 },
  { value: 6, label: 'Geração 6', min: 650, max: 721 },
  { value: 7, label: 'Geração 7', min: 722, max: 809 },
  { value: 8, label: 'Geração 8', min: 810, max: 905 },
  { value: 9, label: 'Geração 9', min: 906, max: 1025 },
];

export function getPokemonIdFromUrl(url) {
  return Number(url.split('/').filter(Boolean).at(-1));
}

export function filterPokemonByGenerations(pokemonList, selectedGenerations) {
  return pokemonList.filter((pokemon) => {
    const id = getPokemonIdFromUrl(pokemon.url);
    return GENERATION_RANGES.some((generation) => (
      selectedGenerations.includes(generation.value) && id >= generation.min && id <= generation.max
    ));
  });
}