import { useMemo, useState } from 'react';
import { getPokemonListPage } from '../services/pokeApi';
import { filterPokemonByGenerations, GENERATION_RANGES } from '../utils/generation';

const TIME_OPTIONS = [
  { value: 15, label: '15 segundos' },
  { value: 30, label: '30 segundos' },
  { value: 60, label: '1 minuto' },
];

function GuessByImageSetup({ isShadowMode = false, onBack, onStart }) {
  const [selectedGenerations, setSelectedGenerations] = useState([1]);
  const [duration, setDuration] = useState(30);
  const [canSkip, setCanSkip] = useState('yes');
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
    if (!selectedGenerations.length) {
      setError('Escolha pelo menos uma geração.');
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
        duration,
        canSkip: canSkip === 'yes',
        isShadowMode,
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
            <p className="eyebrow">{isShadowMode ? 'GUESS BY SHADOW' : 'GUESS BY IMAGE'}</p>
            <h1>{isShadowMode ? 'Configure o desafio da sombra' : 'Configure seu desafio'}</h1>
          </div>
          <button type="button" className="secondary-button" onClick={onBack}>Voltar ao menu</button>
        </div>
      </header>

      <main className="filter-panel">
        <form onSubmit={handleStart}>
          <fieldset className="filter-section">
            <legend>Gerações permitidas</legend>
            <p className="filter-help">Escolha uma ou mais gerações para os Pokémon.</p>
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

          <fieldset className="filter-section">
            <legend>Tempo de jogo</legend>
            <div className="choice-grid choice-grid--three">
              {TIME_OPTIONS.map((option) => (
                <label className="choice-option" key={option.value}>
                  <input
                    type="radio"
                    name="duration"
                    value={option.value}
                    checked={duration === option.value}
                    onChange={() => setDuration(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="filter-section">
            <legend>Botão de passar?</legend>
            <div className="choice-grid choice-grid--two">
              <label className="choice-option">
                <input type="radio" name="skip" value="yes" checked={canSkip === 'yes'} onChange={() => setCanSkip('yes')} />
                <span>Sim</span>
              </label>
              <label className="choice-option">
                <input type="radio" name="skip" value="no" checked={canSkip === 'no'} onChange={() => setCanSkip('no')} />
                <span>Não</span>
              </label>
            </div>
          </fieldset>

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

export default GuessByImageSetup;