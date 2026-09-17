import { compareNumericValues, formatHeight, formatWeight, formatPokemonName } from '../utils/pokemon';
import { getComparisonClass } from '../utils/comparison';

function GuessRow({ guess, secret }) {
  const type1Match = guess.types[0]?.type?.name === secret.types[0]?.type?.name;
  const type2Match = !guess.types[1] && !secret.types[1]
    ? true
    : guess.types[1]?.type?.name === secret.types[1]?.type?.name;

  const generationMatch = guess.generation === secret.generation;
  const habitatMatch = guess.habitat === secret.habitat;
  const colorMatch = guess.color === secret.color;
  const evolutionMatch = guess.evolution === secret.evolution;

  const heightComparison = compareNumericValues(guess.heightValue, secret.heightValue, guess.height);
  const weightComparison = compareNumericValues(guess.weightValue, secret.weightValue, guess.weight);

  return (
    <tr>
      <td className="guess-name">
        <div className="guess-pokemon">
          {guess.sprite ? (
            <img className="guess-sprite" src={guess.sprite} alt={formatPokemonName(guess.name)} />
          ) : (
            <span className="guess-sprite guess-sprite--fallback">?</span>
          )}
          <span>{formatPokemonName(guess.name)}</span>
        </div>
      </td>
      <td className={getComparisonClass(type1Match)}>{guess.types[0]?.type?.name || '—'}</td>
      <td className={getComparisonClass(type2Match)}>{guess.types[1]?.type?.name || '—'}</td>
      <td className={getComparisonClass(generationMatch)}>{guess.generation}</td>
      <td className={getComparisonClass(habitatMatch)}>{guess.habitat || '—'}</td>
      <td className={getComparisonClass(colorMatch)}>{guess.color || '—'}</td>
      <td className={getComparisonClass(evolutionMatch)}>{guess.evolution}</td>
      <td className={getComparisonClass(heightComparison.result === 'equal')}>{heightComparison.label}</td>
      <td className={getComparisonClass(weightComparison.result === 'equal')}>{weightComparison.label}</td>
    </tr>
  );
}

export default GuessRow;
