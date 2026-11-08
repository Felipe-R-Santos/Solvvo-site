"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useLoja } from "@/lib/estado";
import { montarLinhas, totalCarrinho } from "@/lib/carrinho";
import { PEDIDO_MINIMO } from "@/dados/produtos";
import { reais } from "@/lib/formato";
import { FotoProduto } from "@/componentes/FotoProduto";
import { SeletorQuantidade } from "@/componentes/SeletorQuantidade";
import { SeloEstoque } from "@/componentes/SeloEstoque";

// ─────────────────────────────────────────────────────────────────────────────
// O CARRINHO INTEIRO.
//
// A gaveta serve para conferir de passagem; esta página é para revisar o pedido
// antes de enviar — por isso aqui aparecem o estoque de cada linha e o aviso de
// pedido mínimo, que na gaveta ficariam apertados.
//
// O TOTAL NÃO INCLUI FRETE NEM IMPOSTO, e isso está escrito ao lado do número.
// Total que parece final e depois cresce é o jeito mais rápido de perder a
// confiança de um comprador.
// ─────────────────────────────────────────────────────────────────────────────

export function PaginaCarrinho() {
  const { pronto, carrinho, catalogo, mudarQuantidade, remover, esvaziar } = useLoja();

  if (!pronto) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-cinza-claro/70">Carregando o carrinho…</p>
      </div>
    );
  }

  const linhas = montarLinhas(carrinho, catalogo);
  const total = totalCarrinho(linhas);
  const falta = PEDIDO_MINIMO - total;

  if (linhas.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
          Seu carrinho está vazio
        </h1>
        <p className="mt-3 text-cinza-claro/80">
          Abra o catálogo e monte a reposição da sua célula.
        </p>
        <Link
          href="/produtos"
          className="mt-6 inline-flex h-12 items-center rounded-md bg-laranja-escuro px-6 text-sm font-bold text-white hover:bg-marrom"
        >
          Ver o catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Carrinho</h1>
      <p className="mt-1.5 text-sm text-cinza-claro/70">
        {linhas.length} {linhas.length === 1 ? "item" : "itens"} no pedido
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <ul className="divide-y divide-borda-escura rounded-lg border border-borda-escura bg-cartao-escuro">
            {linhas.map((l) => (
              <li key={l.produto.codigo} className="flex flex-col gap-4 p-4 sm:flex-row">
                <div className="size-20 shrink-0 overflow-hidden rounded bg-white">
                  <FotoProduto produto={l.produto} tamanho="miniatura" className="size-full object-cover" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[11px] text-cinza-claro/60">{l.produto.codigo}</p>
                  <h2 className="font-bold leading-7 text-white">
                    <Link href={`/produtos/${l.produto.slug}`} className="inline-block leading-7 hover:text-laranja-texto">
                      {l.produto.nome}
                    </Link>
                  </h2>
                  <p className="text-sm text-cinza-claro/80">
                    {l.produto.medida} · {l.produto.unidade}
                  </p>
                  <div className="mt-2">
                    <SeloEstoque estoque={l.produto.estoque} />
                  </div>
                  <p className="mt-2 text-sm text-cinza-claro/70">
                    {reais(l.produto.preco)} cada
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-start">
                  <SeletorQuantidade
                    valor={l.quantidade}
                    mudar={(n) => mudarQuantidade(l.produto.codigo, n)}
                    rotulo={`${l.produto.nome} ${l.produto.medida}`}
                    compacto
                  />
                  <p className="text-lg font-extrabold text-white">{reais(l.subtotal)}</p>
                  <button
                    type="button"
                    onClick={() => remover(l.produto.codigo)}
                    aria-label={`Remover ${l.produto.nome} ${l.produto.medida} do carrinho`}
                    className="inline-flex h-11 items-center gap-1.5 rounded-md px-2 text-sm text-cinza-claro/70 hover:bg-borda-escura hover:text-white"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/produtos"
              className="inline-flex h-11 items-center rounded-md border border-borda-escura px-4 text-sm font-medium text-cinza-claro hover:bg-borda-escura"
            >
              Continuar comprando
            </Link>
            <button
              type="button"
              onClick={esvaziar}
              className="inline-flex h-11 items-center rounded-md border border-borda-escura px-4 text-sm font-medium text-cinza-claro/80 hover:bg-borda-escura hover:text-white"
            >
              Esvaziar o carrinho
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-borda-escura bg-cartao-escuro p-5 lg:sticky lg:top-24">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">
            Resumo
          </h2>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-cinza-claro/80">Itens</dt>
              <dd className="text-white">{reais(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cinza-claro/80">Frete</dt>
              <dd className="text-cinza-claro/70">A combinar</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cinza-claro/80">Impostos</dt>
              <dd className="text-cinza-claro/70">Conforme nota</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-baseline justify-between border-t border-borda-escura pt-4">
            <span className="font-bold text-white">Total dos itens</span>
            <span className="text-2xl font-extrabold text-white">{reais(total)}</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-cinza-claro/60">
            Frete e impostos não entram neste número. Eles são informados junto
            com o prazo, na confirmação do pedido.
          </p>

          {falta > 0 ? (
            <p className="mt-4 rounded-md border border-estoque-consulta/40 bg-estoque-consulta/15 px-3 py-2 text-sm text-estoque-consulta">
              Faltam {reais(falta)} para o pedido mínimo de {reais(PEDIDO_MINIMO)}.
            </p>
          ) : null}

          <Link
            href="/finalizar"
            aria-disabled={falta > 0}
            className={`mt-4 flex h-12 items-center justify-center rounded-md text-sm font-bold ${
              falta > 0
                ? "pointer-events-none bg-white/10 text-cinza-claro/60"
                : "bg-laranja-escuro text-white hover:bg-marrom"
            }`}
          >
            Finalizar pedido
          </Link>
        </aside>
      </div>
    </div>
  );
}
