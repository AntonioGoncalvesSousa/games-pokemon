function Loading({ message = 'Carregando Pokémon...' }) {
  return (
    <div className="loading-state">
      <div className="spinner" aria-label="Carregando" />
      <p>{message}</p>
    </div>
  );
}

export default Loading;
