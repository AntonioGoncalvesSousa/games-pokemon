export function compareValues(guessValue, secretValue) {
  if (!guessValue || !secretValue) {
    return {
      match: true,
      value: guessValue || '—',
    };
  }

  return {
    match: String(guessValue).toLowerCase() === String(secretValue).toLowerCase(),
    value: String(guessValue),
  };
}

export function getComparisonClass(match) {
  return match ? 'cell-success' : 'cell-danger';
}

export function compareTypeValues(guessTypes, secretTypes) {
  const normalizedGuess = guessTypes.length ? guessTypes : ['—'];
  const normalizedSecret = secretTypes.length ? secretTypes : ['—'];

  const guessString = normalizedGuess.join('/');
  const secretString = normalizedSecret.join('/');

  return {
    match: guessString.toLowerCase() === secretString.toLowerCase(),
    value: guessString,
  };
}
