const FORM_SUBMIT_EMAIL = import.meta.env.VITE_FORMSUBMIT_EMAIL || 'antonio.sj2005@gmail.com';

function GameResultForm({ game, score, details }) {
  return (
    <form
      className="game-result-form"
      action={`https://formsubmit.co/${FORM_SUBMIT_EMAIL}`}
      method="POST"
    >
      <input type="hidden" name="Jogo" value={game} />
      <input type="hidden" name="Pontuação" value={score} />
      <input type="hidden" name="Detalhes" value={details} />
      <input type="hidden" name="Data" value={new Date().toLocaleString('pt-BR')} />
      <input type="hidden" name="_subject" value={`Resultado: ${game}`} />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="table" />
      <button className="primary-button" type="submit">Enviar resultado</button>
    </form>
  );
}

export default GameResultForm;