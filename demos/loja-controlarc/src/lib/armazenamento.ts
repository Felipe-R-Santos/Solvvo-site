// ─────────────────────────────────────────────────────────────────────────────
// AS CHAVES DO localStorage MORAM SÓ AQUI.
//
// Nenhum literal "ca-loja-..." espalhado pelo código: renomear uma chave em um
// lugar e esquecer o outro é como o estado de uma loja se perde em silêncio.
//
// Tudo é envolvido em try/catch: navegação privativa e bloqueio de dados de
// terceiros fazem o localStorage lançar exceção. Se falhar, a loja funciona sem
// lembrar nada — nunca quebra.
// ─────────────────────────────────────────────────────────────────────────────

const PREFIXO = "ca-loja-";

export const CHAVES = {
  empresa: `${PREFIXO}empresa`,
  carrinho: `${PREFIXO}carrinho`,
  pedidos: `${PREFIXO}pedidos`,
  eventos: `${PREFIXO}eventos`,
  /** Preço, estoque e prazo alterados no painel, sobrescrevendo o catálogo. */
  sobrescritas: `${PREFIXO}sobrescritas`,
  /** Oportunidades marcadas como atendidas no painel. */
  atendidos: `${PREFIXO}atendidos`,
  /** Status mudado no painel para os pedidos das empresas fictícias. Os
   *  pedidos de verdade deste navegador guardam o status dentro de si. */
  statusExemplo: `${PREFIXO}status-exemplo`,
} as const;

export function ler<T>(chave: string, padrao: T): T {
  if (typeof window === "undefined") return padrao;
  try {
    const bruto = window.localStorage.getItem(chave);
    return bruto ? (JSON.parse(bruto) as T) : padrao;
  } catch {
    return padrao;
  }
}

export function gravar(chave: string, valor: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // Sem armazenamento: a sessão continua, só não sobrevive ao recarregamento.
  }
}

export function limparTudo() {
  if (typeof window === "undefined") return;
  try {
    Object.values(CHAVES).forEach((c) => window.localStorage.removeItem(c));
  } catch {
    /* nada a fazer */
  }
}
