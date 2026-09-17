import { useState } from 'react';
import Home from './pages/Home';
import FilterPokemonGuess from './pages/FilterPokemonGuess';
import GuessByImage from './pages/GuessByImage';
import GuessByImageSetup from './pages/GuessByImageSetup';
import PokemonGuess from './pages/PokemonGuess';

function App() {
  const [screen, setScreen] = useState('home');

  const handleGoHome = () => setScreen('home');

  return (
    <>
      {screen === 'home' && (
        <Home
          onPlay={() => setScreen('pokemon-guess')}
          onFilterPlay={() => setScreen('filter-pokemon-guess')}
          onImagePlay={() => setScreen('guess-by-image-setup')}
          onShadowPlay={() => setScreen('shadow-guess-setup')}
        />
      )}
      {screen === 'pokemon-guess' && <PokemonGuess onBack={handleGoHome} />}
      {screen === 'filter-pokemon-guess' && <FilterPokemonGuess onBack={handleGoHome} onStart={(settings) => setScreen({ type: 'filtered-game', settings })} />}
      {screen === 'guess-by-image-setup' && <GuessByImageSetup onBack={handleGoHome} onStart={(settings) => setScreen({ type: 'image-game', settings })} />}
      {screen === 'shadow-guess-setup' && <GuessByImageSetup isShadowMode onBack={handleGoHome} onStart={(settings) => setScreen({ type: 'shadow-game', settings })} />}
      {typeof screen === 'object' && screen.type === 'filtered-game' && (
        <PokemonGuess
          onBack={handleGoHome}
          initialPokemonList={screen.settings.pokemonList}
          maxAttempts={screen.settings.maxAttempts}
        />
      )}
      {typeof screen === 'object' && screen.type === 'image-game' && (
        <GuessByImage
          onBack={handleGoHome}
          pokemonList={screen.settings.pokemonList}
          duration={screen.settings.duration}
          canSkip={screen.settings.canSkip}
        />
      )}
      {typeof screen === 'object' && screen.type === 'shadow-game' && (
        <GuessByImage
          isShadowMode
          onBack={handleGoHome}
          pokemonList={screen.settings.pokemonList}
          duration={screen.settings.duration}
          canSkip={screen.settings.canSkip}
        />
      )}
    </>
  );
}

export default App;
