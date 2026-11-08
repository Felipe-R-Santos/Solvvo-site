// ─────────────────────────────────────────────────────────────────────────────
// RASTREIO DA NAVEGAÇÃO
//
// Registra o que o visitante fez, com data e hora, só neste navegador. Nada
// sai do aparelho — não há servidor nesta demonstração.
//
// No portal real isto viraria evento no servidor, ligado ao CNPJ da sessão.
// ─────────────────────────────────────────────────────────────────────────────

export type TipoEvento =
  | "visita"
  | "cadastro"
  | "busca"
  | "produto_visto"
  | "adicionou"
  | "removeu"
  | "iniciou_finalizacao"
  | "pedido_enviado";

export type Evento = {
  tipo: TipoEvento;
  /** Termo buscado, código do produto ou número do pedido, conforme o tipo. */
  detalhe?: string;
  quando: string; // ISO
};

export const ROTULO_EVENTO: Record<TipoEvento, string> = {
  visita: "Visitou a loja",
  cadastro: "Cadastrou a empresa",
  busca: "Buscou",
  produto_visto: "Viu o produto",
  adicionou: "Adicionou ao carrinho",
  removeu: "Removeu do carrinho",
  iniciou_finalizacao: "Começou a finalizar",
  pedido_enviado: "Enviou o pedido",
};

/** Carrinho parado há mais de 30 minutos, sem pedido depois dele. */
export const MINUTOS_ABANDONO = 30;

export function carrinhoAbandonado(eventos: Evento[]): boolean {
  const ultimoAdd = [...eventos].reverse().find((e) => e.tipo === "adicionou");
  if (!ultimoAdd) return false;
  const ultimoPedido = [...eventos].reverse().find((e) => e.tipo === "pedido_enviado");
  if (ultimoPedido && ultimoPedido.quando > ultimoAdd.quando) return false;
  const minutos = (Date.now() - new Date(ultimoAdd.quando).getTime()) / 60000;
  return minutos > MINUTOS_ABANDONO;
}
