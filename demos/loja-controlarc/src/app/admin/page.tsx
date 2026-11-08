"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLoja } from "@/lib/estado";
import { usarPainel } from "@/lib/usar-painel";
import { resumir, maisVistos, type Resumo } from "@/lib/painel";
import { reais, desde } from "@/lib/formato";
import { DesenhoPeca } from "@/componentes/DesenhoPeca";

// ─────────────────────────────────────────────────────────────────────────────
// VISÃO GERAL.
//
// As barras são `div` com largura em porcentagem. Biblioteca de gráfico para
// seis barras horizontais seria mais código entregue ao navegador do que a
// tela inteira — e barra em CSS lê bem em leitor de tela quando o número está
// escrito ao lado, que é o caso.
//
// AS DUAS JANELAS (7 e 30 dias) aparecem lado a lado de propósito: um número
// sozinho não diz se subiu ou caiu.
// ─────────────────────────────────────────────────────────────────────────────

function Cartao({
  rotulo, valor, apoio,
}: { rotulo: string; valor: string; apoio?: string }) {
  return (
    <div className="rounded-lg border border-borda-escura bg-cartao-escuro p-4">
      <p className="text-xs uppercase tracking-wide text-cinza-claro/60">{rotulo}</p>
      <p className="mt-1.5 text-2xl font-extrabold text-white">{valor}</p>
      {apoio && <p className="mt-0.5 text-xs text-cinza-claro/60">{apoio}</p>}
    </div>
  );
}

function Coluna({ r, titulo }: { r: Resumo; titulo: string }) {
  return (
    <section aria-labelledby={`janela-${r.dias}`}>
      <h2 id={`janela-${r.dias}`} className="text-sm font-bold uppercase tracking-wide text-white">
        {titulo}
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Cartao rotulo="Empresas que acessaram" valor={String(r.empresas)} />
        <Cartao rotulo="Pedidos" valor={String(r.pedidos)} />
        <Cartao rotulo="Receita" valor={reais(r.receita)} />
        <Cartao rotulo="Ticket médio" valor={r.pedidos ? reais(r.ticket) : "—"} />
        <Cartao
          rotulo="Conversão visita → pedido"
          valor={`${r.conversao.toFixed(0)}%`}
          apoio="empresas que compraram ÷ empresas que acessaram"
        />
        <Cartao
          rotulo="Carrinhos abandonados"
          valor={String(r.abandonados)}
          apoio={r.valorAbandonado > 0 ? `${reais(r.valorAbandonado)} parados` : undefined}
        />
      </div>
    </section>
  );
}

export default function VisaoGeral() {
  const { catalogo } = useLoja();
  const { montado, atividades } = usarPainel();

  const sete = useMemo(() => resumir(atividades, 7), [atividades]);
  const trinta = useMemo(() => resumir(atividades, 30), [atividades]);
  const vistos = useMemo(() => maisVistos(atividades, catalogo), [atividades, catalogo]);
  const recentes = useMemo(() => atividades.slice(0, 6), [atividades]);

  if (!montado) {
    return <p className="text-cinza-claro/70">Carregando os números…</p>;
  }

  const maior = vistos[0]?.vezes ?? 1;

  return (
    <div className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <Coluna r={sete} titulo="Últimos 7 dias" />
        <Coluna r={trinta} titulo="Últimos 30 dias" />
      </div>

      <section aria-labelledby="titulo-vistos">
        <h2 id="titulo-vistos" className="text-sm font-bold uppercase tracking-wide text-white">
          Produtos mais vistos
        </h2>
        {vistos.length === 0 ? (
          <p className="mt-3 text-sm text-cinza-claro/70">
            Nenhum produto visto ainda.
          </p>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {vistos.map(({ codigo, vezes, produto }) => (
              <li key={codigo} className="flex items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded bg-cartao-escuro">
                  <DesenhoPeca desenho={produto!.desenho} className="size-7 text-cinza-claro/80" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <Link
                      href={`/produtos/${produto!.slug}`}
                      className="block truncate py-0.5 text-sm text-white hover:text-laranja-texto"
                    >
                      {produto!.nome} {produto!.medida}
                    </Link>
                    <span className="shrink-0 text-sm font-bold text-white">
                      {vezes} {vezes === 1 ? "empresa" : "empresas"}
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-borda-escura">
                    <div
                      className="h-2 rounded-full bg-laranja"
                      style={{ width: `${(vezes / maior) * 100}%` }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="titulo-recentes">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="titulo-recentes" className="text-sm font-bold uppercase tracking-wide text-white">
            Quem passou por último
          </h2>
          <Link href="/admin/empresas" className="inline-block py-1 text-sm font-medium text-laranja-texto hover:underline">
            Ver todas
          </Link>
        </div>
        <ul className="mt-3 divide-y divide-borda-escura rounded-lg border border-borda-escura bg-cartao-escuro">
          {recentes.map((a) => (
            <li key={a.chave} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-bold text-white">
                  {a.razaoSocial}
                  {a.esteAparelho && (
                    <span className="ml-2 rounded bg-laranja-escuro px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      este aparelho
                    </span>
                  )}
                </p>
                <p className="font-mono text-xs text-cinza-claro/60">{a.cnpj}</p>
              </div>
              <div className="text-right text-sm">
                <p className="text-cinza-claro/85">{desde(a.ultimaVisita)}</p>
                <p className="text-xs text-cinza-claro/60">
                  {a.comprou ? `${a.pedidos.length} pedido(s)` : "sem pedido"}
                  {a.valorCarrinho > 0 && ` · carrinho ${reais(a.valorCarrinho)}`}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
