import { useEffect, useRef, useState } from 'react';
import PokemonSearch from '../components/PokemonSearch';
import Loading from '../components/Loading';
import { getPokemonByNameOrId } from '../services/pokeApi';
import { sendGameFinishedEmail } from '../services/gameEmail';
import { formatPokemonName, getPokemonSpriteUrl, normalizeName } from '../utils/pokemon';

function GuessByImage({ isShadowMode = false, onBack, pokemonList, duration, canSkip }) {
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [usedPokemon, setUsedPokemon] = useState(new Set());
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [message, setMessage] = useState('');
  const emailSentRef = useRef(false);

  const chooseNextPokemon = async (usedNames = usedPokemon) => {
    const available = pokemonList.filter((pokemon) => !usedNames.has(pokemon.name));
    const pool = available.length ? available : pokemonList;
    const selected = pool[Math.floor(Math.random() * pool.length)];
    const data = await getPokemonByNameOrId(selected.name);
    setCurrentPokemon({ name: data.name, sprite: getPokemonSpriteUrl(data) });
    setUsedPokemon((current) => new Set(current).add(data.name));
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

  useEffect(() => {
    if (!isFinished || emailSentRef.current) return;

    emailSentRef.current = true;
    sendGameFinishedEmail({
      game: isShadowMode ? 'Guess by Shadow' : 'Guess by Image',
      score,
      playedAt: new Date().toLocaleString('pt-BR'),
      details: `Pokémon final: ${currentPokemon ? formatPokemonName(currentPokemon.name) : 'indisponível'}`,
    }).catch(() => {
      console.error('Não foi possível enviar o resultado do jogo por e-mail.');
    });
  }, [currentPokemon, isFinished, isShadowMode, score]);

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

  const handleGuess = async (pokemonName) => {
    if (!pokemonName || !currentPokemon || isFinished || isRevealed) return;

    if (normalizeName(pokemonName) === normalizeName(currentPokemon.name)) {
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
                <PokemonSearch
                  pokemons={pokemonList}
                  onSelect={handleGuess}
                  disabled={isFinished || isRevealed || !currentPokemon}
                />
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