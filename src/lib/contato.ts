// ─────────────────────────────────────────────────────────────────────────────
// CONTATO — um lugar só para mudar.
//
// Usado pelo formulário da home, pelo formulário do pré-estudo, pelo bloco de
// contato e pelo rodapé. Estava declarado dentro de app/page.tsx, o que
// funcionava enquanto havia uma página só; com a rota do pré-estudo entrando,
// duas cópias do número de WhatsApp divergiriam na primeira troca de linha.
// ─────────────────────────────────────────────────────────────────────────────

export const CONTATO = {
  email: 'contato@solvvo.com.br',
  // formato internacional, só dígitos: exigido pelo link do WhatsApp
  whatsapp: '5554981535018',
  telefoneVisivel: '(54) 9 8153-5018',
  cidade: 'Caxias do Sul, RS - Brasil',
}

/** Monta o link do WhatsApp já com a mensagem. */
export function linkWhatsApp(texto: string) {
  return `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(texto)}`
}

/**
 * Abre o WhatsApp numa aba nova; se o navegador bloquear o popup, navega na
 * mesma aba. Sem este fallback, o clique não faz nada em quem tem bloqueador
 * agressivo — e o visitante conclui que o formulário está quebrado.
 */
export function abrirWhatsApp(texto: string) {
  const url = linkWhatsApp(texto)
  const aba = window.open(url, '_blank', 'noopener,noreferrer')
  if (!aba) window.location.href = url
}
