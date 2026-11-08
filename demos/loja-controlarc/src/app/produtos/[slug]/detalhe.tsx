"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChevronRight, ShoppingCart } from "lucide-react";
import { useLoja } from "@/lib/estado";
import { reais } from "@/lib/formato";
import { porSlug } from "@/dados/categorias";
import { DesenhoPeca } from "@/componentes/DesenhoPeca";
import { SeletorQuantidade } from "@/componentes/SeletorQuantidade";
import { SeloEstoque } from "@/componentes/SeloEstoque";
import { CartaoProduto } from "@/componentes/CartaoProduto";

// ─────────────────────────────────────────────────────────────────────────────
// A PÁGINA DO PRODUTO.
//
// O produto vem do CATÁLOGO DO CONTEXTO, não da constante importada: é o que
// faz o preço e o estoque alterados no painel aparecerem aqui. Pegar direto de
// PRODUTOS mostraria o valor antigo e a demonstração do painel não provaria
// nada.
//
// Enquanto o contexto não terminou de ler o navegador, a tela mostra um vazio
// discreto em vez de piscar o preço original e trocar logo depois.
// ─────────────────────────────────────────────────────────────────────────────

export function Detalhe({ slug }: { slug: string }) {
  const { pronto, catalogo, adicionar, abrirGaveta, registrar } = useLoja();
  const [quantidade, setQuantidade] = useState(1);

  const produto = catalogo.find((p) => p.slug === slug);

  useEffect(() => {
    if (pronto && produto) registrar("produto_visto", produto.codigo);
  }, [pronto, produto, registrar]);

  if (!produto) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-cinza-claro/70">Carregando o produto…</p>
      </div>
    );
  }

  const categoria = porSlug(produto.categoria);
  const indisponivel = produto.estoque === "indisponivel";
  const relacionados = catalogo
    .filter((p) => p.categoria === produto.categoria && p.codigo !== produto.codigo)
    .slice(0, 3);

  const ficha: [string, string][] = [
    ["Código", produto.codigo],
    ["Medida", produto.medida],
    ["Material", produto.material],
    ["Compatibilidade", produto.compatibilidade],
    ["Embalagem", produto.unidade],
    ["Prazo", produto.prazo],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <nav aria-label="Trilha" className="flex flex-wrap items-center gap-1 text-sm text-cinza-claro/70">
        <Link href="/" className="inline-block py-0.5 hover:text-laranja-texto">Início</Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <Link href="/produtos" className="inline-block py-0.5 hover:text-laranja-texto">Catálogo</Link>
        {categoria && (
          <>
            <ChevronRight className="size-4" aria-hidden="true" />
            <Link href={`/produtos?categoria=${categoria.slug}`} className="inline-block py-0.5 hover:text-laranja-texto">
              {categoria.nome}
            </Link>
          </>
        )}
        <ChevronRight className="size-4" aria-hidden="true" />
        <span className="text-white">{produto.nome}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* `self-start` e proporção fixa: sem isso a moldura estica até a altura
            da coluna da ficha técnica e o desenho fica perdido num vazio. */}
        <div className="relative grid aspect-[4/3] place-items-center self-start rounded-lg border border-borda-escura bg-black/30 p-10">
          {produto.maisVendido && (
            <span className="absolute left-4 top-4 rounded bg-laranja-escuro px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
              Mais vendido
            </span>
          )}
          <DesenhoPeca desenho={produto.desenho} className="max-h-full w-full text-cinza-claro/85" />
          <p className="absolute bottom-3 right-4 text-[11px] text-cinza-claro/75">
            Desenho ilustrativo, fora de escala
          </p>
        </div>

        <div>
          <p className="font-mono text-sm text-cinza-claro/60">{produto.codigo}</p>
          <h1 className="mt-1 text-3xl font-extrabold leading-tight text-white">
            {produto.nome}
          </h1>
          <p className="mt-1 text-lg text-cinza-claro/85">{produto.medida}</p>

          <div className="mt-4">
            <SeloEstoque estoque={produto.estoque} />
          </div>

          <div className="mt-6 rounded-lg border border-borda-escura bg-cartao-escuro p-5">
            {indisponivel ? (
              <p className="text-cinza-claro/85">
                Item sem previsão de reposição. Fale com a Control ARC para
                prazo e alternativa equivalente.
              </p>
            ) : (
              <>
                <p className="text-3xl font-extrabold text-white">{reais(produto.preco)}</p>
                <p className="mt-1 text-sm text-cinza-claro/70">
                  {produto.unidade} · {produto.prazo}
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <SeletorQuantidade
                    valor={quantidade}
                    mudar={setQuantidade}
                    rotulo={`${produto.nome} ${produto.medida}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      adicionar(produto.codigo, quantidade);
                      toast.success(`${quantidade} × ${produto.nome} no carrinho`, {
                        action: { label: "Ver carrinho", onClick: abrirGaveta },
                      });
                      setQuantidade(1);
                    }}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-laranja-escuro sm:w-auto sm:flex-1 px-6 text-sm font-bold text-white hover:bg-marrom"
                  >
                    <ShoppingCart className="size-4" aria-hidden="true" />
                    Adicionar ao carrinho
                  </button>
                </div>
              </>
            )}
          </div>

          <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-white">
            Ficha técnica
          </h2>
          <dl className="mt-3 divide-y divide-borda-escura border-y border-borda-escura">
            {ficha.map(([rotulo, valor]) => (
              <div key={rotulo} className="grid grid-cols-[130px_1fr] gap-4 py-3">
                <dt className="text-sm text-cinza-claro/60">{rotulo}</dt>
                <dd className="text-sm text-white">{valor}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 text-xs leading-relaxed text-cinza-claro/60">
            Compatibilidade descrita por característica técnica — corrente,
            refrigeração e rosca. Confira a rosca e a medida da sua tocha antes
            de pedir.
          </p>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-16" aria-labelledby="titulo-relacionados">
          <h2 id="titulo-relacionados" className="text-2xl font-extrabold text-white">
            Da mesma categoria
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relacionados.map((p) => (
              <CartaoProduto key={p.codigo} produto={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
