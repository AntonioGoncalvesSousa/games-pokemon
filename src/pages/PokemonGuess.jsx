import { useEffect, useMemo, useState } from 'react';
import GuessTable from '../components/GuessTable';
import Loading from '../components/Loading';
import PokemonSearch from '../components/PokemonSearch';
import ResultModal from '../components/ResultModal';
import { getEvolutionChainById, getPokemonByNameOrId, getPokemonListPage, getPokemonSpeciesByNameOrId } from '../services/pokeApi';
import {
  formatHeight,
  formatPokemonName,
  formatWeight,
  getGenerationLabel,
  getPokemonSpriteUrl,
  normalizeName,
  translateColorName,
  translateEvolutionStage,
  translateHabitatName,
  translateTypeName,
} from '../utils/pokemon';
import { getEvolutionStageFromChain } from '../utils/evolution';

const MAX_ATTEMPTS = 20;

function PokemonGuess({ onBack }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [secretPokemon, setSecretPokemon] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [usedPokemon, setUsedPokemon] = useState(new Set());
  const [resultState, setResultState] = useState(null);

  const loadBasePokemonList = async () => {
    try {
      setIsLoading(true);
      setError('');
      const list = await getPokemonListPage(0, 1200);
      setPokemonList(list);
    } catch (loadError) {
      setError('Não foi possível carregar os dados do Pokémon.');
    } finally {
      setIsLoading(false);
    }
  };

  const startNewGame = async () => {
    setAttempts(0);
    setGuesses([]);
    setUsedPokemon(new Set());
    setResultState(null);
    setError('');
    setIsLoading(true);

    try {
      const list = await getPokemonListPage(0, 1200);
      setPokemonList(list);
      const randomIndex = Math.floor(Math.random() * list.length);
      const randomPokemon = list[randomIndex];
      const selected = await getPokemonByNameOrId(randomPokemon.name);
      const species = await getPokemonSpeciesByNameOrId(selected.id);
      const evolutionChainResponse = species.evolution_chain ? await getEvolutionChainById(species.evolution_chain.url.split('/').filter(Boolean).at(-1)) : null;

      const secretData = await buildPokemonProfile(selected, species, evolutionChainResponse);
      setSecretPokemon(secretData);
    } catch (loadError) {
      setError('Não foi possível carregar os dados do Pokémon.');
    } finally {
      setIsLoading(false);
    }
  };

  const buildPokemonProfile = async (pokemonData, speciesData, evolutionChainData) => {
    const evolutionStage = getEvolutionStageFromChain(evolutionChainData, pokemonData.name);
    const habitat = translateHabitatName(speciesData.habitat?.name ?? 'Unknown');
    const color = translateColorName(speciesData.color?.name ?? 'Unknown');
    const translatedTypes = pokemonData.types.map((entry) => ({
      ...entry,
      type: {
        ...entry.type,
        name: translateTypeName(entry.type.name),
      },
    }));

    return {
      id: pokemonData.id,
      name: pokemonData.name,
      sprite: getPokemonSpriteUrl(pokemonData),
      types: translatedTypes,
      generation: getGenerationLabel(speciesData.generation?.name ?? 'generation-1'),
      habitat,
      color,
      evolution: translateEvolutionStage(evolutionStage),
      height: formatHeight(pokemonData.height),
      heightValue: pokemonData.height,
      weight: formatWeight(pokemonData.weight),
      weightValue: pokemonData.weight,
    };
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleGuess = async (pokemonName) => {
    const normalizedGuess = normalizeName(pokemonName);
    if (!normalizedGuess || usedPokemon.has(normalizedGuess)) {
      if (usedPokemon.has(normalizedGuess)) {
        setError('Você já tentou esse Pokémon.');
      }
      return;
    }

    try {
      setError('');
      const pokemonData = await getPokemonByNameOrId(normalizedGuess);
      const speciesData = await getPokemonSpeciesByNameOrId(pokemonData.id);
      const evolutionChain = speciesData.evolution_chain
        ? await getEvolutionChainById(speciesData.evolution_chain.url.split('/').filter(Boolean).at(-1))
        : null;

      const detailedPokemon = await buildPokemonProfile(pokemonData, speciesData, evolutionChain);
      const nextAttempts = attempts + 1;
      setUsedPokemon((prev) => new Set(prev).add(normalizedGuess));
      setGuesses((prev) => [...prev, detailedPokemon]);
      setAttempts(nextAttempts);

      if (detailedPokemon.name === secretPokemon.name) {
        setResultState('win');
      } else if (nextAttempts >= MAX_ATTEMPTS) {
        setResultState('lose');
      }
    } catch (guessError) {
      setError('Não foi possível carregar os dados do Pokémon.');
    }
  };

  const guessesSummary = useMemo(() => {
    return guesses.map((guess) => ({
      ...guess,
      name: formatPokemonName(guess.name),
    }));
  }, [guesses]);

  const statusText = `${attempts} / ${MAX_ATTEMPTS}`;

  if (isLoading && !secretPokemon) {
    return (
      <div className="page-shell">
        <Loading message="Carregando Pokémon..." />
      </div>
    );
  }

  return (
    <div className="page-shell game-shell">
      <header className="main-header">
        <div className="header-row">
          <div>
            <p className="eyebrow">POKÉMON GUESS</p>
            <h1>Descubra o Pokémon secreto!</h1>
          </div>
          <button type="button" className="secondary-button" onClick={onBack}>
            Voltar ao menu
          </button>
        </div>

        <div className="attempts-bar">
          <span>Tentativas:</span>
          <strong>{statusText}</strong>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {!resultState && (
        <>
          <PokemonSearch pokemons={pokemonList} onSelect={handleGuess} disabled={isLoading || !secretPokemon} />
          <GuessTable guesses={guessesSummary} secretPokemon={secretPokemon} />
        </>
      )}

      <ResultModal
        isOpen={Boolean(resultState)}
        result={resultState}
        secretPokemon={secretPokemon ? { ...secretPokemon, name: formatPokemonName(secretPokemon.name) } : null}
        attempts={attempts}
        onRetry={startNewGame}
        onBack={onBack}
      />
    </div>
  );
}

export default PokemonGuess;
