import GuessRow from './GuessRow';

function GuessTable({ guesses, secretPokemon }) {
  return (
    <div className="table-container">
      <table className="guess-table">
        <thead>
          <tr>
            <th>Pokémon</th>
            <th>Tipo 1</th>
            <th>Tipo 2</th>
            <th>Geração</th>
            <th>Habitat</th>
            <th>Cor</th>
            <th>Evolução</th>
            <th>Altura</th>
            <th>Peso</th>
          </tr>
        </thead>
        <tbody>
          {guesses.map((guess) => (
            <GuessRow key={guess.name} guess={guess} secret={secretPokemon} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GuessTable;
