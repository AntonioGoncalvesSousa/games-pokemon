import { useMemo, useState } from 'react';
import { getPokemonListPage } from '../services/pokeApi';
import { filterPokemonByGenerations, GENERATION_RANGES } from '../utils/generation';

function FilterPokemonGuess({ onBack, onStart }) {
  const [selectedGenerations, setSelectedGenerations] = useState([1]);
  const [attemptsInput, setAttemptsInput] = useState('20');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedLabel = useMemo(() => (
    [...selectedGenerations]
      .sort((left, right) => left - right)
      .map((generation) => `Geração ${generation}`)
      .join(', ')
  ), [selectedGenerations]);

  const toggleGeneration = (generation) => {
    setSelectedGenerations((current) => (
      current.includes(generation)
        ? current.filter((item) => item !== generation)
        : [...current, generation]
    ));
  };

  const handleStart = async (event) => {
    event.preventDefault();
    const normalizedAttempts = attemptsInput.trim().toLowerCase();
    const isInfinity = normalizedAttempts === 'infinity';
    const maxAttempts = Number(normalizedAttempts);

    if (!selectedGenerations.length) {
      setError('Escolha pelo menos uma geração.');
      return;
    }

    if (!isInfinity && (!Number.isInteger(maxAttempts) || maxAttempts < 1)) {
      setError('Informe um número inteiro maior que zero ou escreva infinity.');
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      const list = await getPokemonListPage(0, 1200);
      const eligiblePokemon = filterPokemonByGenerations(list, selectedGenerations);

      if (!eligiblePokemon.length) {
        setError('Não encontramos Pokémon para essa combinação de gerações.');
        return;
      }

      onStart({
        pokemonList: eligiblePokemon,
        maxAttempts: isInfinity ? Infinity : maxAttempts,
      });
    } catch (loadError) {
      setError('Não foi possível carregar os Pokémon para essa partida.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-shell filter-shell">
      <header className="main-header">
        <div className="header-row">
          <div>
            <p className="eyebrow">FILTER POKÉMON GUESS</p>
            <h1>Configure seu desafio</h1>
          </div>
          <button type="button" className="secondary-button" onClick={onBack}>Voltar ao menu</button>
        </div>
      </header>

      <main className="filter-panel">
        <form onSubmit={handleStart}>
          <fieldset className="filter-section">
            <legend>Gerações permitidas</legend>
            <p className="filter-help">Escolha uma ou mais gerações para o Pokémon secreto.</p>
            <div className="generation-grid">
              {GENERATION_RANGES.map((generation) => (
                <label className="generation-option" key={generation.value}>
                  <input
                    type="checkbox"
                    checked={selectedGenerations.includes(generation.value)}
                    onChange={() => toggleGeneration(generation.value)}
                  />
                  <span>{generation.label}</span>
                </label>
              ))}
            </div>
            <p className="filter-selection">Selecionadas: {selectedLabel || 'nenhuma'}</p>
          </fieldset>

          <div className="filter-section">
            <label htmlFor="attempts">Quantidade de tentativas</label>
            <p className="filter-help">Digite um número ou escreva <strong>infinity</strong> para jogar sem limite.</p>
            <input
              id="attempts"
              className="attempts-input"
              type="text"
              inputMode="numeric"
              value={attemptsInput}
              onChange={(event) => setAttemptsInput(event.target.value)}
              placeholder="Ex.: 10 ou infinity"
            />
          </div>

          {error && <div className="error-banner">{error}</div>}

          <div className="filter-actions">
            <button type="button" className="secondary-button" onClick={onBack}>Cancelar</button>
            <button type="submit" className="primary-button" disabled={isLoading}>
              {isLoading ? 'Carregando...' : 'Começar partida'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default FilterPokemonGuess;