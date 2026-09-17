const API_BASE = 'https://pokeapi.co/api/v2';

const pokemonCache = new Map();
const speciesCache = new Map();
const evolutionCache = new Map();

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Não foi possível carregar os dados do Pokémon.');
  }

  return response.json();
}

export async function getPokemonByNameOrId(nameOrId) {
  const key = String(nameOrId).toLowerCase();

  if (pokemonCache.has(key)) {
    return pokemonCache.get(key);
  }

  const data = await fetchJson(`${API_BASE}/pokemon/${key}`);
  pokemonCache.set(key, data);
  return data;
}

export async function getPokemonSpeciesByNameOrId(nameOrId) {
  const key = String(nameOrId).toLowerCase();

  if (speciesCache.has(key)) {
    return speciesCache.get(key);
  }

  const data = await fetchJson(`${API_BASE}/pokemon-species/${key}`);
  speciesCache.set(key, data);
  return data;
}

export async function getEvolutionChainById(id) {
  if (evolutionCache.has(id)) {
    return evolutionCache.get(id);
  }

  const data = await fetchJson(`${API_BASE}/evolution-chain/${id}`);
  evolutionCache.set(id, data);
  return data;
}

export async function getPokemonListPage(offset = 0, limit = 20) {
  const data = await fetchJson(`${API_BASE}/pokemon-species?offset=${offset}&limit=${limit}`);
  return data.results;
}

export function clearPokemonCache() {
  pokemonCache.clear();
  speciesCache.clear();
  evolutionCache.clear();
}

export { pokemonCache, speciesCache, evolutionCache };
