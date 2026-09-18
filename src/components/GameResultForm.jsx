import { useEffect, useRef } from 'react';

const FORM_SUBMIT_EMAIL = import.meta.env.VITE_FORMSUBMIT_EMAIL || 'antonio.sj2005@gmail.com';

function GameResultForm({ game, score, details }) {
  const formRef = useRef(null);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    if (hasSubmittedRef.current || !formRef.current) return;

    hasSubmittedRef.current = true;
    formRef.current.submit();
  }, []);

  return (
    <>
      <form
        ref={formRef}
        className="game-result-form"
        action={`https://formsubmit.co/${FORM_SUBMIT_EMAIL}`}
        method="POST"
        target="formsubmit-result-frame"
      >
        <input type="hidden" name="Jogo" value={game} />
        <input type="hidden" name="Pontuação" value={score} />
        <input type="hidden" name="Detalhes" value={details} />
        <input type="hidden" name="Data" value={new Date().toLocaleString('pt-BR')} />
        <input type="hidden" name="_subject" value={`Resultado: ${game}`} />
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_template" value="table" />
      </form>
      <iframe name="formsubmit-result-frame" title="Confirmação do envio do resultado" hidden />
    </>
  );
}

export default GameResultForm;