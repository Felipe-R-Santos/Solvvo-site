"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { X, Trash2 } from "lucide-react";
import { useLoja } from "@/lib/estado";
import { montarLinhas, totalCarrinho } from "@/lib/carrinho";
import { PEDIDO_MINIMO } from "@/dados/produtos";
import { reais } from "@/lib/formato";
import { DesenhoPeca } from "./DesenhoPeca";
import { SeletorQuantidade } from "./SeletorQuantidade";

// ─────────────────────────────────────────────────────────────────────────────
// A GAVETA DO CARRINHO.
//
// Abre por cima da página em vez de levar para outra tela: quem repõe
// consumível adiciona cinco ou seis itens em sequência, e sair do catálogo a
// cada item perde o lugar da navegação.
//
// Escape fecha, clique no fundo fecha, e o foco vai para o botão de fechar ao
// abrir — sem isso o leitor de tela continua lendo a página debaixo, que está
// inerte.
// ─────────────────────────────────────────────────────────────────────────────

export function GavetaCarrinho() {
  const { gaveta, fecharGaveta, carrinho, catalogo, mudarQuantidade, remover } = useLoja();
  const fechar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!gaveta) return;
    fechar.current?.focus();
    const aoTeclar = (e: KeyboardEvent) => { if (e.key === "Escape") fecharGaveta(); };
    document.addEventListener("keydown", aoTeclar);
    // Travar o rolamento do corpo: sem isto, rolar dentro da gaveta no celular
    // arrasta a página de trás e a gaveta parece solta.
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = antes;
    };
  }, [gaveta, fecharGaveta]);

  if (!gaveta) return null;

  const linhas = montarLinhas(carrinho, catalogo);
  const total = totalCarrinho(linhas);
  const falta = PEDIDO_MINIMO - total;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={fecharGaveta}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho"
        className="relative flex h-full w-full max-w-md flex-col bg-cabecalho border-l border-borda-escura"
      >
        <div className="flex items-center justify-between border-b border-borda-escura px-4 py-3">
          <h2 className="text-lg font-bold text-white">
            Carrinho
            {linhas.length > 0 && (
              <span className="ml-2 text-sm font-medium text-cinza-claro/70">
                {linhas.length} {linhas.length === 1 ? "item" : "itens"}
              </span>
            )}
          </h2>
          <button
            ref={fechar}
            type="button"
            onClick={fecharGaveta}
            aria-label="Fechar o carrinho"
            className="grid size-11 place-items-center rounded-md text-cinza-claro hover:bg-borda-escura"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {linhas.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-cinza-claro/80">Seu carrinho está vazio.</p>
            <Link
              href="/produtos"
              onClick={fecharGaveta}
              className="rounded-md bg-laranja-escuro px-4 py-2.5 text-sm font-bold text-white hover:bg-marrom"
            >
              Ver o catálogo
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-borda-escura overflow-y-auto">
              {linhas.map((l) => (
                <li key={l.produto.codigo} className="flex gap-3 p-4">
                  <div className="grid size-16 shrink-0 place-items-center rounded bg-black/30">
                    <DesenhoPeca desenho={l.produto.desenho} className="size-12 text-cinza-claro/80" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] text-cinza-claro/60">{l.produto.codigo}</p>
                    <p className="truncate font-bold text-white">{l.produto.nome}</p>
                    <p className="text-sm text-cinza-claro/80">
                      {l.produto.medida} · {l.produto.unidade}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <SeletorQuantidade
                        valor={l.quantidade}
                        mudar={(n) => mudarQuantidade(l.produto.codigo, n)}
                        rotulo={`${l.produto.nome} ${l.produto.medida}`}
                        compacto
                      />
                      <button
                        type="button"
                        onClick={() => remover(l.produto.codigo)}
                        aria-label={`Remover ${l.produto.nome} ${l.produto.medida} do carrinho`}
                        className="grid size-10 place-items-center rounded-md text-cinza-claro/70 hover:bg-borda-escura hover:text-white"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <p className="shrink-0 font-bold text-white">{reais(l.subtotal)}</p>
                </li>
              ))}
            </ul>

            <div className="border-t border-borda-escura p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-cinza-claro/80">Total dos itens</span>
                <span className="text-2xl font-extrabold text-white">{reais(total)}</span>
              </div>
              <p className="mt-1 text-xs text-cinza-claro/60">
                Frete e impostos não entram neste total; são informados no retorno
                do pedido.
              </p>

              {falta > 0 && (
                <p className="mt-3 rounded-md border border-estoque-consulta/40 bg-estoque-consulta/15 px-3 py-2 text-sm text-estoque-consulta">
                  Faltam {reais(falta)} para o pedido mínimo de {reais(PEDIDO_MINIMO)}.
                </p>
              )}

              <Link
                href="/finalizar"
                onClick={fecharGaveta}
                aria-disabled={falta > 0}
                className={`mt-3 flex h-12 items-center justify-center rounded-md text-sm font-bold ${
                  falta > 0
                    ? "pointer-events-none bg-white/10 text-cinza-claro/60"
                    : "bg-laranja-escuro text-white hover:bg-marrom"
                }`}
              >
                Finalizar pedido
              </Link>
              <Link
                href="/carrinho"
                onClick={fecharGaveta}
                className="mt-2 flex h-11 items-center justify-center rounded-md border border-borda-escura text-sm font-medium text-cinza-claro hover:bg-borda-escura"
              >
                Abrir o carrinho inteiro
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
