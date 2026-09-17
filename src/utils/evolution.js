export function getEvolutionStageFromChain(chain, pokemonName) {
  if (!chain || !chain.chain) return 'Stage 1';

  const nameMap = new Map();
  const visit = (node, depth = 1) => {
    const currentName = node.species?.name;
    if (currentName) {
      nameMap.set(currentName, depth);
      node.evolves_to?.forEach((child) => visit(child, depth + 1));
    }
  };

  visit(chain.chain);

  const stage = nameMap.get(pokemonName.toLowerCase());
  if (typeof stage === 'number') {
    return `Stage ${stage}`;
  }

  return 'Stage 1';
}
