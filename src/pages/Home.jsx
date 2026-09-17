import GameCard from '../components/GameCard';

function Home({ onPlay, onFilterPlay, onImagePlay, onShadowPlay }) {
  return (
    <div className="page-shell home-shell">
      <header className="main-header home-header">
        <p className="eyebrow">Pokémon Games</p>
        <h1>Pokémon Games</h1>
      </header>

      <main className="home-content">
        <section className="home-intro">
          <p className="section-label">Escolha seu desafio</p>
        </section>

        <GameCard
          title="Pokémon Guess"
          description="Descubra o Pokémon secreto em até 20 tentativas."
          emoji="⚡"
          buttonLabel="Jogar"
          onClick={onPlay}
        />
        <GameCard
          title="Filter Pokémon Guess"
          description="Escolha as gerações e o número de tentativas antes de jogar."
          emoji="🎯"
          buttonLabel="Configurar"
          onClick={onFilterPlay}
        />
        <GameCard
          title="Guess by Image"
          description="Adivinhe o Pokémon pela imagem antes que o tempo acabe."
          emoji="🖼️"
          buttonLabel="Configurar"
          onClick={onImagePlay}
        />
        <GameCard
          title="Guess by Shadow"
          description="Descubra o Pokémon apenas pela sua sombra."
          emoji="🌑"
          buttonLabel="Configurar"
          onClick={onShadowPlay}
        />
      </main>
    </div>
  );
}

export default Home;
