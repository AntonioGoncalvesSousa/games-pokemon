const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

export async function sendGameFinishedEmail({ game, score, playedAt, details }) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const recipient = import.meta.env.VITE_GAME_RESULTS_EMAIL || 'antonio.sj2005@gmail.com';

  if (!serviceId || !templateId || !publicKey) {
    console.warn('EmailJS não configurado. O resultado não foi enviado por e-mail.');
    return;
  }

  const response = await fetch(EMAILJS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        to_email: recipient,
        game,
        score,
        played_at: playedAt,
        details,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Não foi possível enviar o resultado por e-mail.');
  }
}