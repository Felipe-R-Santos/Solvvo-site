"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLoja } from "@/lib/estado";
import { usarPainel } from "@/lib/usar-painel";
import type { Atividade } from "@/lib/painel";
import { ROTULO_EVENTO } from "@/lib/eventos";
import { reais, desde, dataHora } from "@/lib/formato";

// ─────────────────────────────────────────────────────────────────────────────
// EMPRESAS.
//
// A LINHA DO TEMPO DE UMA EMPRESA FICTÍCIA É DERIVADA do próprio registro dela
// — cadastro, produtos vistos, itens no carrinho e pedidos, nessa ordem — e não
// de um histórico inventado à parte. Assim nenhuma linha do tempo contradiz a
// linha da tabela logo acima.
//
// A empresa DESTE APARELHO usa os eventos de verdade, na ordem em que
// aconteceram. É a única cujo histórico é real.
// ─────────────────────────────────────────────────────────────────────────────

type Marca = { quando: string; texto: string; detalhe?: string };

function linhaDoTempoDerivada(a: Atividade, nomePorCodigo: (c: string) => string): Marca[] {
  const marcas: Marca[] = [
    { quando: a.primeiraVisita, texto: "Cadastrou a empresa", detalhe: a.razaoSocial },
  ];

  // Os produtos vistos são distribuídos entre o cadastro e a última visita,
  // em ordem, para a linha ficar legível sem fingir hora exata.
  const inicio = new Date(a.primeiraVisita).getTime();
  const fim = new Date(a.ultimaVisita).getTime();
  a.vistos.forEach((c, i) => {
    const t = inicio + ((fim - inicio) * (i + 1)) / (a.vistos.length + 1);
    marcas.push({
      quando: new Date(t).toISOString(),
      texto: ROTULO_EVENTO.produto_visto,
      detalhe: nomePorCodigo(c),
    });
  });

  a.pedidos.forEach((p) =>
    marcas.push({
      quando: p.quando,
      texto: ROTULO_EVENTO.pedido_enviado,
      detalhe: `${p.numero} · ${reais(p.total)}`,
    }),
  );

  a.carrinho.forEach((i) =>
    marcas.push({
      quando: a.ultimaVisita,
      texto: ROTULO_EVENTO.adicionou,
      detalhe: `${i.quantidade} × ${nomePorCodigo(i.codigo)}`,
    }),
  );

  return marcas.sort((x, y) => y.quando.localeCompare(x.quando));
}

export default function Empresas() {
  const { catalogo, eventos } = useLoja();
  const { montado, atividades } = usarPainel();
  const [aberta, setAberta] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");

  const nome = useMemo(
    () => (c: string) => {
      const p = catalogo.find((x) => x.codigo === c);
      return p ? `${p.nome} ${p.medida}` : c;
    },
    [catalogo],
  );

  const lista = useMemo(() => {
    const t = filtro.trim().toLowerCase();
    if (!t) return atividades;
    return atividades.filter(
      (a) =>
        a.razaoSocial.toLowerCase().includes(t) ||
        a.cnpj.includes(t) ||
        a.comprador.toLowerCase().includes(t),
    );
  }, [atividades, filtro]);

  if (!montado) return <p className="text-cinza-claro/70">Carregando as empresas…</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-cinza-claro/70">
          {lista.length} {lista.length === 1 ? "empresa" : "empresas"}
        </p>
        <div>
          <label htmlFor="filtro-empresas" className="sr-only">
            Filtrar por razão social, CNPJ ou comprador
          </label>
          <input
            id="filtro-empresas"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Filtrar por nome, CNPJ ou comprador"
            className="h-11 w-full rounded-md border border-borda-escura bg-cartao-escuro px-3 text-sm text-white outline-none placeholder:text-cinza-claro/75 focus:border-laranja sm:w-80"
          />
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {lista.map((a) => {
          const expandida = aberta === a.chave;
          const marcas = a.esteAparelho
            ? [...eventos]
                .reverse()
                .map((e) => ({
                  quando: e.quando,
                  texto: ROTULO_EVENTO[e.tipo],
                  detalhe: e.detalhe ? nome(e.detalhe) : undefined,
                }))
            : linhaDoTempoDerivada(a, nome);

          return (
            <li key={a.chave} className="rounded-lg border border-borda-escura bg-cartao-escuro">
              <div className="grid gap-3 p-4 sm:grid-cols-[1fr_auto]">
                <div className="min-w-0">
                  <h2 className="font-bold text-white">
                    {a.razaoSocial}
                    {a.esteAparelho && (
                      <span className="ml-2 rounded bg-laranja-escuro px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        este aparelho
                      </span>
                    )}
                  </h2>
                  <p className="font-mono text-xs text-cinza-claro/60">{a.cnpj}</p>
                  <p className="mt-1 text-sm text-cinza-claro/85">
                    {a.comprador}
                    {a.cargo && ` · ${a.cargo}`}
                    {a.uf && ` · ${a.cidade}/${a.uf}`}
                  </p>
                </div>

                <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:text-right">
                  <dt className="text-cinza-claro/60">Última visita</dt>
                  <dd className="text-white">{desde(a.ultimaVisita)}</dd>
                  <dt className="text-cinza-claro/60">Produtos vistos</dt>
                  <dd className="text-white">{a.vistos.length}</dd>
                  <dt className="text-cinza-claro/60">Carrinho aberto</dt>
                  <dd className={a.valorCarrinho > 0 ? "font-bold text-estoque-consulta" : "text-white"}>
                    {a.valorCarrinho > 0 ? reais(a.valorCarrinho) : "—"}
                  </dd>
                  <dt className="text-cinza-claro/60">Comprou</dt>
                  <dd className="text-white">
                    {a.comprou ? `${a.pedidos.length} · ${reais(a.gasto)}` : "não"}
                  </dd>
                </dl>
              </div>

              <div className="border-t border-borda-escura px-4 py-3">
                <button
                  type="button"
                  onClick={() => setAberta(expandida ? null : a.chave)}
                  aria-expanded={expandida}
                  aria-controls={`tempo-${a.chave}`}
                  className="inline-flex h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-cinza-claro hover:text-white"
                >
                  <ChevronDown
                    className={`size-4 transition-transform ${expandida ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                  {expandida ? "Ocultar a linha do tempo" : "Ver a linha do tempo"}
                </button>

                {expandida && (
                  <div id={`tempo-${a.chave}`} className="mt-2 pb-2">
                    {marcas.length === 0 ? (
                      <p className="text-sm text-cinza-claro/70">Nenhum evento registrado.</p>
                    ) : (
                      <ol className="space-y-3 border-l border-borda-escura pl-4">
                        {marcas.map((m, i) => (
                          <li key={`${m.quando}-${i}`} className="relative">
                            <span
                              className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-laranja"
                              aria-hidden="true"
                            />
                            <p className="text-sm text-white">
                              {m.texto}
                              {m.detalhe && (
                                <span className="text-cinza-claro/85"> — {m.detalhe}</span>
                              )}
                            </p>
                            <p className="text-xs text-cinza-claro/60">{dataHora(m.quando)}</p>
                          </li>
                        ))}
                      </ol>
                    )}
                    {!a.esteAparelho && (
                      <p className="mt-4 text-xs text-cinza-claro/75">
                        Histórico derivado do registro fictício desta empresa.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
