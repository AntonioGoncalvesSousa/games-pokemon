import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import { getPokemonByNameOrId } from '../services/pokeApi';
import { formatPokemonName, getPokemonSpriteUrl, normalizeName } from '../utils/pokemon';

function GuessByImage({ isShadowMode = false, onBack, pokemonList, duration, canSkip }) {
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [usedPokemon, setUsedPokemon] = useState(new Set());
  const [query, setQuery] = useState('');
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [message, setMessage] = useState('');

  const chooseNextPokemon = async (usedNames = usedPokemon) => {
    const available = pokemonList.filter((pokemon) => !usedNames.has(pokemon.name));
    const pool = available.length ? available : pokemonList;
    const selected = pool[Math.floor(Math.random() * pool.length)];
    const data = await getPokemonByNameOrId(selected.name);
    setCurrentPokemon({ name: data.name, sprite: getPokemonSpriteUrl(data) });
    setUsedPokemon((current) => new Set(current).add(data.name));
    setQuery('');
  };

  useEffect(() => {
    chooseNextPokemon().catch(() => setMessage('Não foi possível carregar a imagem do Pokémon.'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isFinished || isLoading || isRevealed || !currentPokemon) return undefined;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setIsFinished(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [currentPokemon, isFinished, isLoading, isRevealed]);

  const continueToNextPokemon = async () => {
    setIsRevealed(false);
    await chooseNextPokemon();
  };

  useEffect(() => {
    if (!isRevealed || isFinished) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        continueToNextPokemon();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFinished, isRevealed]);

  const handleGuess = async (event) => {
    event.preventDefault();
    if (!query.trim() || !currentPokemon || isFinished || isRevealed) return;

    if (normalizeName(query) === normalizeName(currentPokemon.name)) {
      setScore((current) => current + 1);
      setMessage('Acertou!');
      setIsRevealed(true);
      return;
    }

    setMessage('Não foi dessa vez. Tente novamente.');
  };

  const handleSkip = async () => {
    if (!canSkip || !currentPokemon || isFinished || isRevealed) return;
    setMessage('Pokémon passado.');
    setIsRevealed(true);
  };

  if (isLoading) {
    return <div className="page-shell"><Loading message="Carregando Pokémon..." /></div>;
  }

  return (
    <div className="page-shell image-game-shell">
      <header className="main-header">
        <div className="header-row">
          <div>
            <p className="eyebrow">{isShadowMode ? 'GUESS BY SHADOW' : 'GUESS BY IMAGE'}</p>
            <h1>Qual é o Pokémon?</h1>
          </div>
          <button type="button" className="secondary-button" onClick={onBack}>Voltar ao menu</button>
        </div>
        <div className="image-game-stats">
          <span>Tempo: <strong>{secondsLeft}s</strong></span>
          <span>Pontos: <strong>{score}</strong></span>
        </div>
      </header>

      <main className="image-game-panel">
        {!isFinished ? (
          <>
            <div className="image-stage">
              {currentPokemon?.sprite && (
                <img
                  src={currentPokemon.sprite}
                  alt={isShadowMode ? 'Sombra do Pokémon' : 'Imagem do Pokémon'}
                  className={`image-game-pokemon${isShadowMode && !isRevealed ? ' image-game-pokemon--shadow' : ''}`}
                />
              )}
              {isRevealed && (
                <p className="revealed-pokemon-name">
                  {formatPokemonName(currentPokemon.name)}
                </p>
              )}
            </div>
            {isRevealed ? (
              <button type="button" className="primary-button" onClick={continueToNextPokemon} autoFocus>
                Próximo Pokémon
              </button>
            ) : (
              <>
                <form className="image-guess-form" onSubmit={handleGuess}>
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Digite o nome do Pokémon..."
                    aria-label="Nome do Pokémon"
                    autoComplete="off"
                  />
                  <button type="submit" className="primary-button">Adivinhar</button>
                </form>
                {canSkip && <button type="button" className="skip-button" onClick={handleSkip}>Passar Pokémon</button>}
              </>
            )}
            <p className="image-game-message" aria-live="polite">{message}</p>
          </>
        ) : (
          <div className="image-game-finished">
            <div className="result-modal__icon">🏆</div>
            <h2>Tempo encerrado!</h2>
            <img
              src={currentPokemon.sprite}
              alt={formatPokemonName(currentPokemon.name)}
              className="image-game-finished__pokemon"
            />
            <p className="revealed-pokemon-name">{formatPokemonName(currentPokemon.name)}</p>
            <p>Você fez {score} ponto{score === 1 ? '' : 's'}.</p>
            <button type="button" className="primary-button" onClick={onBack}>Voltar ao menu</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default GuessByImage;