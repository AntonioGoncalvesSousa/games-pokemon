import { useEffect, useMemo, useState } from 'react';
import { formatPokemonName } from '../utils/pokemon';

function PokemonSearch({ pokemons, onSelect, disabled }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];

    const normalized = query.toLowerCase();
    return pokemons
      .filter((pokemon) => pokemon.name.toLowerCase().includes(normalized))
      .slice(0, 8)
      .map((pokemon) => {
        const match = pokemon.url?.match(/\/(pokemon|pokemon-species)\/(\d+)\/$/);
        const id = match ? match[2] : null;

        return {
          value: pokemon.name,
          label: formatPokemonName(pokemon.name),
          sprite: id ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png` : null,
        };
      });
  }, [pokemons, query]);

  useEffect(() => {
    if (query.trim() && isFocused) {
      setIsFocused(true);
    }
  }, [query, isFocused]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const selected = suggestions[0]?.value || query.trim().toLowerCase();
    if (selected) {
      onSelect(selected);
      setQuery('');
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (value) => {
    onSelect(value);
    setQuery('');
    setIsFocused(false);
  };

  return (
    <form className="pokemon-search" onSubmit={handleSubmit}>
      <div className="search-input-wrap">
        <span className="search-icon">🔎</span>
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            if (event.target.value.trim()) {
              setIsFocused(true);
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Digite o nome de um Pokémon..."
          disabled={disabled}
          aria-label="Pesquisar Pokémon"
        />
      </div>

      {isFocused && suggestions.length > 0 && (
        <ul className="search-suggestions">
          {suggestions.map((pokemon) => (
            <li key={pokemon.value}>
              <button type="button" onClick={() => handleSuggestionClick(pokemon.value)} className="suggestion-item">
                {pokemon.sprite ? (
                  <img src={pokemon.sprite} alt={pokemon.label} className="suggestion-item__sprite" />
                ) : (
                  <span className="suggestion-item__fallback">⚡</span>
                )}
                <span>{pokemon.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <button className="primary-button" type="submit" disabled={disabled || !query.trim()}>
        Chutar
      </button>
    </form>
  );
}

export default PokemonSearch;
