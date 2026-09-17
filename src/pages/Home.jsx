import GameCard from '../components/GameCard';

function Home({ onPlay }) {
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
      </main>
    </div>
  );
}

export default Home;
