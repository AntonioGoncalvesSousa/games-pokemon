function ResultModal({ isOpen, result, secretPokemon, attempts, resultForm, onRetry, onBack }) {
  if (!isOpen || !secretPokemon) return null;

  return (
    <div className="modal-overlay">
      <div className="result-modal">
        <div className="result-modal__icon">{result === 'win' ? '🎉' : '💥'}</div>
        <h2>{result === 'win' ? 'Você acertou!' : 'Você perdeu!'}</h2>
        <p className="modal-lead">{result === 'win' ? 'O Pokémon era:' : 'O Pokémon secreto era:'}</p>

        <div className="secret-preview">
          <img
            src={secretPokemon.sprite}
            alt={secretPokemon.name}
            className="secret-preview__image"
          />
          <div className="secret-preview__name">{secretPokemon.name}</div>
        </div>

        <p className="modal-attempts">
          {result === 'win' ? 'Você descobriu em:' : 'Tentativas:'} {attempts} / 20
        </p>

        {resultForm}
        <div className="modal-actions">
          <button className="primary-button" type="button" onClick={onRetry}>
            Jogar novamente
          </button>
          <button className="secondary-button" type="button" onClick={onBack}>
            Voltar ao menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultModal;
