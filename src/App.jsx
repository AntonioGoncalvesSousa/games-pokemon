import { useState } from 'react';
import Home from './pages/Home';
import PokemonGuess from './pages/PokemonGuess';

function App() {
  const [screen, setScreen] = useState('home');

  const handleGoHome = () => setScreen('home');

  return (
    <>
      {screen === 'home' ? (
        <Home onPlay={() => setScreen('pokemon-guess')} />
      ) : (
        <PokemonGuess onBack={handleGoHome} />
      )}
    </>
  );
}

export default App;
