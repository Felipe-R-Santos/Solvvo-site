"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import type { Produto } from "@/dados/produtos";
import { reais } from "@/lib/formato";
import { useLoja } from "@/lib/estado";
import { FotoProduto } from "./FotoProduto";
import { SeletorQuantidade } from "./SeletorQuantidade";
import { SeloEstoque } from "./SeloEstoque";

// ─────────────────────────────────────────────────────────────────────────────
// O CARTÃO DO PRODUTO.
//
// ⚠ O CARTÃO É BRANCO desde 08/11/2026, como na referência do Diogo. A página
// é escura; o cartão claro é o que faz a peça e o preço saltarem. Por isso o
// texto daqui usa Quase-Negro e o selo de estoque pede a variante `claro` —
// os tons de fundo escuro somem sobre branco.
//
// O código da peça aparece no cartão, não só na página de detalhe: em compra
// de consumível quem repõe pede pelo código, e escondê-lo obrigaria a abrir
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
    <article className="group flex flex-col overflow-hidden rounded-lg bg-white">
      <Link
        href={`/produtos/${produto.slug}`}
        className="relative block"
        aria-label={`Ver ${produto.nome} ${produto.medida}`}
      >
        {produto.maisVendido && (
          <span className="absolute left-3 top-3 z-10 rounded bg-laranja-escuro px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
            Mais vendido
          </span>
        )}
        <FotoProduto
          produto={produto}
          tamanho="cartao"
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-1 flex-col border-t border-quase-negro/10 p-4">
        <p className="font-mono text-xs text-quase-negro/75">{produto.codigo}</p>
        <h3 className="mt-1 font-bold leading-7 text-quase-negro">
          <Link
            href={`/produtos/${produto.slug}`}
            className="inline-block hover:text-laranja-escuro"
          >
            {produto.nome}
          </Link>
        </h3>
        <p className="text-sm text-quase-negro/80">{produto.medida}</p>

        <div className="mt-3">
          <SeloEstoque estoque={produto.estoque} fundo="claro" />
        </div>

        <div className="mt-4 flex-1">
          {indisponivel ? (
            <p className="text-sm text-quase-negro/80">
              Sem previsão. Fale com a Control ARC para prazo.
            </p>
          ) : (
            <>
              <p className="text-2xl font-extrabold text-quase-negro">
                {reais(produto.preco)}
              </p>
              <p className="text-xs text-quase-negro/70">
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
              fundo="claro"
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
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-laranja-escuro px-3 text-sm font-bold text-white hover:bg-marrom disabled:cursor-not-allowed disabled:bg-quase-negro/15 disabled:text-quase-negro/85"
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
            {indisponivel ? "Indisponível" : "Adicionar"}
          </button>
        </div>
      </div>
    </article>
  );
}
