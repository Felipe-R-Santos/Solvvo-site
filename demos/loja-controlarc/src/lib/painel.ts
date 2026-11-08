// ─────────────────────────────────────────────────────────────────────────────
// O QUE O PAINEL VÊ.
//
// Junta duas origens numa lista só:
//   1. as dez empresas FICTÍCIAS de `dados/empresas-exemplo.ts`, com datas
//      relativas aos últimos 30 dias;
//   2. a navegação REAL de quem está com a loja aberta neste navegador.
//
// A segunda aparece marcada como «este aparelho» em toda tela que a mostra. Sem
// essa marca o Diogo não saberia qual linha é a dele, e a demonstração de «o
// painel enxerga o que o cliente faz» perderia a graça.
//
// ⚠ TUDO AQUI DEPENDE DE `Date.now()`. Quem chamar estas funções tem de ser
// componente de cliente, depois de montado — no servidor as datas sairiam
// diferentes e a hidratação acusaria divergência.
// ─────────────────────────────────────────────────────────────────────────────

import {
  EMPRESAS, isoAtras, totalDe, type ItemExemplo,
} from "@/dados/empresas-exemplo";
import type { Produto } from "@/dados/produtos";
import type { Empresa, Pedido, StatusPedido } from "./estado";
import type { ItemCarrinho } from "./carrinho";
import type { Evento } from "./eventos";
import { MINUTOS_ABANDONO } from "./eventos";

export type PedidoPainel = {
  numero: string;
  quando: string;
  total: number;
  status: StatusPedido;
  itens: { codigo: string; quantidade: number }[];
};

export type Atividade = {
  chave: string;
  cnpj: string;
  razaoSocial: string;
  cidade: string;
  uf: string;
  comprador: string;
  cargo: string;
  esteAparelho: boolean;
  primeiraVisita: string;
  ultimaVisita: string;
  visitas: number;
  vistos: string[];
  carrinho: ItemExemplo[];
  valorCarrinho: number;
  pedidos: PedidoPainel[];
  gasto: number;
  comprou: boolean;
  /** Carrinho com valor e nenhum pedido depois do último item adicionado. */
  abandonou: boolean;
  /** Viu produto, não montou carrinho e nunca comprou. */
  viuNaoComprou: boolean;
};

/** A sessão deste navegador, se houver empresa cadastrada. */
type Sessao = {
  empresa: Empresa | null;
  carrinho: ItemCarrinho[];
  pedidos: Pedido[];
  eventos: Evento[];
};

function daExemplo(e: (typeof EMPRESAS)[number]): Atividade {
  const pedidos: PedidoPainel[] = e.pedidos.map((p) => ({
    numero: p.numero,
    quando: isoAtras(p.diasAtras, p.hora),
    total: totalDe(p.itens),
    status: p.status,
    itens: p.itens,
  }));
  const valorCarrinho = totalDe(e.carrinho);
  const ultimoPedido = pedidos.reduce<string>((a, p) => (p.quando > a ? p.quando : a), "");
  const ultimaVisita = isoAtras(e.ultimaVisitaDias, e.ultimaVisitaHora);

  return {
    chave: e.cnpj,
    cnpj: e.cnpj,
    razaoSocial: e.razaoSocial,
    cidade: e.cidade,
    uf: e.uf,
    comprador: e.comprador,
    cargo: e.cargo,
    esteAparelho: false,
    primeiraVisita: isoAtras(e.clienteDesdeDias, 9),
    ultimaVisita,
    visitas: e.visitas,
    vistos: e.vistos,
    carrinho: e.carrinho,
    valorCarrinho,
    pedidos,
    gasto: pedidos.reduce((t, p) => t + p.total, 0),
    comprou: pedidos.length > 0,
    // Carrinho parado conta como abandonado quando não houve pedido depois da
    // última visita — é o mesmo critério dos 30 minutos, só que em escala de
    // dias, porque estes registros são de dias atrás.
    abandonou: valorCarrinho > 0 && (!ultimoPedido || ultimoPedido < ultimaVisita),
    viuNaoComprou: valorCarrinho === 0 && pedidos.length === 0 && e.vistos.length > 0,
  };
}

function daSessao(s: Sessao, catalogo: Produto[]): Atividade | null {
  const { empresa, carrinho, pedidos, eventos } = s;
  if (!empresa) return null;

  const preco = (codigo: string) =>
    catalogo.find((p) => p.codigo === codigo)?.preco ?? 0;

  const valorCarrinho = carrinho.reduce((t, i) => t + preco(i.codigo) * i.quantidade, 0);

  const visitas = eventos.filter((e) => e.tipo === "visita").length;
  const vistos = [...new Set(
    eventos.filter((e) => e.tipo === "produto_visto").map((e) => e.detalhe ?? ""),
  )].filter(Boolean);

  const ultimo = eventos[eventos.length - 1]?.quando ?? empresa.desde;
  const ultimoAdd = [...eventos].reverse().find((e) => e.tipo === "adicionou");
  const ultimoPedido = [...eventos].reverse().find((e) => e.tipo === "pedido_enviado");

  const parado =
    !!ultimoAdd &&
    (!ultimoPedido || ultimoPedido.quando < ultimoAdd.quando) &&
    (Date.now() - new Date(ultimoAdd.quando).getTime()) / 60000 > MINUTOS_ABANDONO;

  return {
    chave: "este-aparelho",
    cnpj: empresa.cnpj,
    razaoSocial: empresa.razaoSocial,
    cidade: "—",
    uf: "",
    comprador: empresa.comprador,
    cargo: empresa.cargo,
    esteAparelho: true,
    primeiraVisita: empresa.desde,
    ultimaVisita: ultimo,
    visitas: Math.max(visitas, 1),
    vistos,
    carrinho: carrinho.map((i) => ({ codigo: i.codigo, quantidade: i.quantidade })),
    valorCarrinho,
    pedidos: pedidos.map((p) => ({
      numero: p.numero, quando: p.quando, total: p.total, status: p.status,
      itens: p.itens.map((l) => ({ codigo: l.codigo, quantidade: l.quantidade })),
    })),
    gasto: pedidos.reduce((t, p) => t + p.total, 0),
    comprou: pedidos.length > 0,
    abandonou: valorCarrinho > 0 && parado,
    viuNaoComprou: valorCarrinho === 0 && pedidos.length === 0 && vistos.length > 0,
  };
}

/** A lista do painel: a sessão deste navegador primeiro, depois as fictícias
 *  da visita mais recente para a mais antiga. */
export function montarAtividades(s: Sessao, catalogo: Produto[]): Atividade[] {
  const minha = daSessao(s, catalogo);
  const outras = EMPRESAS.map(daExemplo)
    .sort((a, b) => b.ultimaVisita.localeCompare(a.ultimaVisita));
  return minha ? [minha, ...outras] : outras;
}

const dentro = (iso: string, dias: number) =>
  Date.now() - new Date(iso).getTime() <= dias * 86_400_000;

export type Resumo = {
  dias: number;
  empresas: number;
  visitas: number;
  pedidos: number;
  receita: number;
  ticket: number;
  conversao: number;
  abandonados: number;
  valorAbandonado: number;
};

export function resumir(atividades: Atividade[], dias: number): Resumo {
  const ativas = atividades.filter((a) => dentro(a.ultimaVisita, dias));
  const pedidos = atividades.flatMap((a) => a.pedidos).filter((p) => dentro(p.quando, dias));
  const receita = pedidos.reduce((t, p) => t + p.total, 0);
  const comCarrinho = ativas.filter((a) => a.abandonou);
  const compraram = new Set(
    atividades
      .filter((a) => a.pedidos.some((p) => dentro(p.quando, dias)))
      .map((a) => a.chave),
  ).size;

  return {
    dias,
    empresas: ativas.length,
    visitas: ativas.reduce((t, a) => t + a.visitas, 0),
    pedidos: pedidos.length,
    receita,
    ticket: pedidos.length ? receita / pedidos.length : 0,
    conversao: ativas.length ? (compraram / ativas.length) * 100 : 0,
    abandonados: comCarrinho.length,
    valorAbandonado: comCarrinho.reduce((t, a) => t + a.valorCarrinho, 0),
  };
}

/** Produtos mais vistos, do mais visto para o menos. */
export function maisVistos(atividades: Atividade[], catalogo: Produto[], quantos = 6) {
  const conta = new Map<string, number>();
  atividades.forEach((a) => a.vistos.forEach((c) => conta.set(c, (conta.get(c) ?? 0) + 1)));
  return [...conta.entries()]
    .map(([codigo, vezes]) => ({
      codigo, vezes, produto: catalogo.find((p) => p.codigo === codigo),
    }))
    .filter((x) => x.produto)
    .sort((a, b) => b.vezes - a.vezes)
    .slice(0, quantos);
}
