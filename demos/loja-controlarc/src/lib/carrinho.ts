import { PRODUTOS, type Produto } from "@/dados/produtos";

export type ItemCarrinho = { codigo: string; quantidade: number };

export type LinhaCarrinho = {
  produto: Produto;
  quantidade: number;
  subtotal: number;
};

/**
 * Junta os itens do carrinho com o catálogo já sobrescrito pelo painel.
 * Item cujo código sumiu do catálogo é descartado em silêncio, para um
 * carrinho antigo no navegador não quebrar a página.
 */
export function montarLinhas(
  itens: ItemCarrinho[],
  catalogo: Produto[] = PRODUTOS,
): LinhaCarrinho[] {
  return itens.flatMap((i) => {
    const produto = catalogo.find((p) => p.codigo === i.codigo);
    if (!produto) return [];
    return [{ produto, quantidade: i.quantidade, subtotal: produto.preco * i.quantidade }];
  });
}

export const totalCarrinho = (linhas: LinhaCarrinho[]) =>
  linhas.reduce((t, l) => t + l.subtotal, 0);

export const totalPecas = (itens: ItemCarrinho[]) =>
  itens.reduce((t, i) => t + i.quantidade, 0);
