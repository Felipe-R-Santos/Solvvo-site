"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import type { Produto } from "@/dados/produtos";
import { reais } from "@/lib/formato";
import { useLoja } from "@/lib/estado";
import { DesenhoPeca } from "./DesenhoPeca";
import { SeletorQuantidade } from "./SeletorQuantidade";
import { SeloEstoque } from "./SeloEstoque";

// ─────────────────────────────────────────────────────────────────────────────
// O CARTÃO DO PRODUTO.
//
// O código da peça aparece no cartão, não só na página de detalhe: em compra de
// consumível quem repõe pede pelo código, e esconder o código obrigaria a abrir
// cada produto para conferir se é o mesmo que está na máquina.
//
// Produto indisponível continua visível, com o botão desligado e o aviso no
// lugar do preço — sumir com o item faria o comprador achar que a loja não
// trabalha com a peça.
// ─────────────────────────────────────────────────────────────────────────────

export function CartaoProduto({ produto }: { produto: Produto }) {
  const { adicionar, abrirGaveta } = useLoja();
  const [quantidade, setQuantidade] = useState(1);
  const indisponivel = produto.estoque === "indisponivel";

  return (
    <article className="group flex flex-col rounded-lg border border-borda-escura bg-cartao-escuro overflow-hidden">
      <Link
        href={`/produtos/${produto.slug}`}
        className="relative block bg-black/30 p-6"
        aria-label={`Ver ${produto.nome} ${produto.medida}`}
      >
        {produto.maisVendido && (
          <span className="absolute left-3 top-3 rounded bg-laranja-escuro px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
            Mais vendido
          </span>
        )}
        <DesenhoPeca
          desenho={produto.desenho}
          className="mx-auto h-28 w-28 text-cinza-claro/80 transition-colors group-hover:text-laranja-texto"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-mono text-xs text-cinza-claro/60">{produto.codigo}</p>
        <h3 className="mt-1 font-bold leading-7 text-white">
          <Link href={`/produtos/${produto.slug}`} className="inline-block leading-7 hover:text-laranja-texto">
            {produto.nome}
          </Link>
        </h3>
        <p className="text-sm text-cinza-claro/80">{produto.medida}</p>

        <div className="mt-3">
          <SeloEstoque estoque={produto.estoque} />
        </div>

        <div className="mt-4 flex-1">
          {indisponivel ? (
            <p className="text-sm text-cinza-claro/70">
              Sem previsão. Fale com a Control ARC para prazo.
            </p>
          ) : (
            <>
              <p className="text-2xl font-extrabold text-white">{reais(produto.preco)}</p>
              <p className="text-xs text-cinza-claro/70">
                {produto.unidade} · {produto.prazo}
              </p>
            </>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          {!indisponivel && (
            <SeletorQuantidade
              valor={quantidade}
              mudar={setQuantidade}
              rotulo={`${produto.nome} ${produto.medida}`}
              compacto
            />
          )}
          <button
            type="button"
            disabled={indisponivel}
            onClick={() => {
              adicionar(produto.codigo, quantidade);
              toast.success(`${quantidade} × ${produto.nome} no carrinho`, {
                action: { label: "Ver carrinho", onClick: abrirGaveta },
              });
              setQuantidade(1);
            }}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-laranja-escuro px-3 text-sm font-bold text-white hover:bg-marrom disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-cinza-claro/85"
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
            {indisponivel ? "Indisponível" : "Adicionar"}
          </button>
        </div>
      </div>
    </article>
  );
}
