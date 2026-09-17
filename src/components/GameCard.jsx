function GameCard({ title, description, emoji, buttonLabel, onClick }) {
  return (
    <article className="game-card">
      <div className="game-card__badge">{emoji}</div>
      <div className="game-card__content">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <button className="primary-button" type="button" onClick={onClick}>
        {buttonLabel}
      </button>
    </article>
  );
}

export default GameCard;
