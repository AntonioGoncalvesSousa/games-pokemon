export function formatPokemonName(name = '') {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatHeight(heightInDecimeters) {
  return `${(heightInDecimeters / 10).toFixed(1)} m`;
}

export function formatWeight(weightInHectograms) {
  return `${(weightInHectograms / 10).toFixed(1)} kg`;
}

export function getGenerationLabel(generationName = '') {
  const match = generationName.match(/generation-(\d+)/);
  if (!match) return 'Geração 1';
  return `Geração ${match[1]}`;
}

export function translateTypeName(typeName = '') {
  const typeMap = {
    normal: 'Normal',
    fire: 'Fogo',
    water: 'Água',
    electric: 'Elétrico',
    grass: 'Grama',
    ice: 'Gelo',
    fighting: 'Lutador',
    poison: 'Veneno',
    ground: 'Terra',
    flying: 'Voador',
    psychic: 'Psíquico',
    bug: 'Inseto',
    rock: 'Pedra',
    ghost: 'Fantasma',
    dragon: 'Dragão',
    dark: 'Sombrio',
    steel: 'Metal',
    fairy: 'Fada',
  };

  return typeMap[typeName] || typeName;
}

export function translateHabitatName(habitatName = '') {
  const habitatMap = {
    cave: 'Caverna',
    forest: 'Floresta',
    grassland: 'Campo',
    mountain: 'Montanha',
    rare: 'Raro',
    'rough-terrain': 'Terreno Acidentado',
    sea: 'Mar',
    urban: 'Urbano',
    swamp: 'Pântano',
    underground: 'Subterrâneo',
    'waters-edge': 'Beira d\'Água',
  };

  return habitatMap[habitatName] || habitatName;
}

export function translateColorName(colorName = '') {
  const colorMap = {
    black: 'Preto',
    blue: 'Azul',
    brown: 'Marrom',
    gray: 'Cinza',
    green: 'Verde',
    pink: 'Rosa',
    purple: 'Roxo',
    red: 'Vermelho',
    white: 'Branco',
    yellow: 'Amarelo',
  };

  return colorMap[colorName] || colorName;
}

export function translateEvolutionStage(stage = '') {
  const stageMap = {
    'Stage 1': 'Estágio 1',
    'Stage 2': 'Estágio 2',
    'Stage 3': 'Estágio 3',
  };

  return stageMap[stage] || stage;
}

export function normalizeName(name = '') {
  return name.toLowerCase().trim();
}

export function getPokemonSpriteUrl(pokemon) {
  return pokemon?.sprites?.other?.['official-artwork']?.front_default || pokemon?.sprites?.front_default;
}

export function compareNumericValues(guessValue, secretValue, displayValue = guessValue) {
  if (guessValue === secretValue) {
    return { result: 'equal', label: `${displayValue} ✓` };
  }

  if (guessValue > secretValue) {
    return { result: 'higher', label: `${displayValue} ↑` };
  }

  return { result: 'lower', label: `${displayValue} ↓` };
}
