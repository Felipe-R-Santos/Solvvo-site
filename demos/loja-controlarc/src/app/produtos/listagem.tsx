"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { CartaoProduto } from "@/componentes/CartaoProduto";
import { RegistrarVisita } from "@/componentes/RegistrarVisita";
import { CATEGORIAS, NOME_CURTO } from "@/dados/categorias";
import { ROTULO_ESTOQUE, type Estoque } from "@/dados/produtos";
import { useLoja } from "@/lib/estado";

// ─────────────────────────────────────────────────────────────────────────────
// A LISTAGEM.
//
// A busca olha nome, código, medida, material e compatibilidade — quem repõe
// consumível digita o código gravado na embalagem, não o nome comercial, e uma
// busca só por nome devolveria vazio justamente para quem sabe o que quer.
//
// Acento é ignorado dos dois lados: «difusor de gas» tem de achar «Difusor de
// gás», senão a busca falha para quem digita rápido no celular.
//
// Os filtros são UMA marcação só, usada na coluna do desktop e na gaveta do
// celular. Duas cópias divergiriam na primeira categoria nova.
// ─────────────────────────────────────────────────────────────────────────────

type Ordem = "relevancia" | "preco-asc" | "preco-desc" | "nome";

const ORDENS: { valor: Ordem; rotulo: string }[] = [
  { valor: "relevancia", rotulo: "Mais vendidos primeiro" },
  { valor: "preco-asc", rotulo: "Menor preço" },
  { valor: "preco-desc", rotulo: "Maior preço" },
  { valor: "nome", rotulo: "Nome (A–Z)" },
];

const ESTOQUES: Estoque[] = ["em-estoque", "sob-consulta", "indisponivel"];

const semAcento = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function Listagem() {
  const parametros = useSearchParams();
  const { catalogo } = useLoja();

  const buscaUrl = parametros.get("busca") ?? "";
  const categoriaUrl = parametros.get("categoria") ?? "";

  const [busca, setBusca] = useState(buscaUrl);
  const [categorias, setCategorias] = useState<string[]>(
    categoriaUrl ? [categoriaUrl] : [],
  );
  const [estoques, setEstoques] = useState<Estoque[]>([]);
  const [ordem, setOrdem] = useState<Ordem>("relevancia");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  // Buscar de novo pelo cabeçalho estando JÁ no catálogo só troca a URL — o
  // componente não remonta, e sem este espelho o campo continuaria mostrando a
  // busca anterior enquanto a lista parecia ignorar a nova.
  useEffect(() => { setBusca(buscaUrl); }, [buscaUrl]);
  useEffect(() => { setCategorias(categoriaUrl ? [categoriaUrl] : []); }, [categoriaUrl]);

  const termo = semAcento(busca.trim());

  const resultado = useMemo(() => {
    const lista = catalogo.filter((p) => {
      if (categorias.length && !categorias.includes(p.categoria)) return false;
      if (estoques.length && !estoques.includes(p.estoque)) return false;
      if (!termo) return true;
      const campo = semAcento(
        [p.nome, p.codigo, p.medida, p.material, p.compatibilidade].join(" "),
      );
      return termo.split(/\s+/).every((t) => campo.includes(t));
    });

    const ordenada = [...lista];
    if (ordem === "preco-asc") ordenada.sort((a, b) => a.preco - b.preco);
    else if (ordem === "preco-desc") ordenada.sort((a, b) => b.preco - a.preco);
    else if (ordem === "nome") ordenada.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    else ordenada.sort((a, b) => Number(b.maisVendido) - Number(a.maisVendido));
    return ordenada;
  }, [catalogo, categorias, estoques, termo, ordem]);

  function alternarCategoria(slug: string) {
    setCategorias((a) => (a.includes(slug) ? a.filter((x) => x !== slug) : [...a, slug]));
  }

  function alternarEstoque(e: Estoque) {
    setEstoques((a) => (a.includes(e) ? a.filter((x) => x !== e) : [...a, e]));
  }

  function limpar() {
    setCategorias([]);
    setEstoques([]);
    setBusca("");
  }

  const temFiltro = categorias.length > 0 || estoques.length > 0 || termo.length > 0;

  const filtros = (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-sm font-bold uppercase tracking-wide text-white">
          Categoria
        </legend>
        <ul className="mt-3 space-y-1">
          {CATEGORIAS.map((c) => (
            <li key={c.slug}>
              <label className="flex cursor-pointer items-center gap-2.5 py-2 text-sm text-cinza-claro/85">
                <input
                  type="checkbox"
                  checked={categorias.includes(c.slug)}
                  onChange={() => alternarCategoria(c.slug)}
                  className="size-4 accent-[#DF5318]"
                />
                {NOME_CURTO[c.slug] ?? c.nome}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-bold uppercase tracking-wide text-white">
          Disponibilidade
        </legend>
        <ul className="mt-3 space-y-1">
          {ESTOQUES.map((e) => (
            <li key={e}>
              <label className="flex cursor-pointer items-center gap-2.5 py-2 text-sm text-cinza-claro/85">
                <input
                  type="checkbox"
                  checked={estoques.includes(e)}
                  onChange={() => alternarEstoque(e)}
                  className="size-4 accent-[#DF5318]"
                />
                {ROTULO_ESTOQUE[e]}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {temFiltro && (
        <button
          type="button"
          onClick={limpar}
          className="inline-flex h-11 items-center gap-2 rounded-md border border-borda-escura px-3 text-sm text-cinza-claro hover:bg-borda-escura"
        >
          <X className="size-4" aria-hidden="true" />
          Limpar filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <RegistrarVisita />

      <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
        {buscaUrl ? `Resultados para «${buscaUrl}»` : "Catálogo"}
      </h1>
      <p className="mt-1.5 text-sm text-cinza-claro/70">
        {resultado.length} {resultado.length === 1 ? "produto" : "produtos"}
        {categorias.length === 1 && ` em ${NOME_CURTO[categorias[0]] ?? categorias[0]}`}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="busca-lista" className="sr-only">
          Filtrar por nome, código ou medida
        </label>
        <input
          id="busca-lista"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Filtrar por nome, código ou medida"
          className="h-11 w-full rounded-md border border-borda-escura sm:flex-1 bg-cartao-escuro px-3 text-sm text-white outline-none placeholder:text-cinza-claro/75 focus:border-laranja"
        />

        <label htmlFor="ordem" className="sr-only">
          Ordenar o catálogo
        </label>
        <select
          id="ordem"
          value={ordem}
          onChange={(e) => setOrdem(e.target.value as Ordem)}
          className="h-11 rounded-md border border-borda-escura bg-cartao-escuro px-3 text-sm text-white outline-none focus:border-laranja"
        >
          {ORDENS.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.rotulo}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setFiltrosAbertos((a) => !a)}
          aria-expanded={filtrosAbertos}
          aria-controls="filtros-celular"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-borda-escura px-4 text-sm font-medium text-cinza-claro lg:hidden"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filtros
        </button>
      </div>

      {filtrosAbertos && (
        <div
          id="filtros-celular"
          className="mt-4 rounded-lg border border-borda-escura bg-cartao-escuro p-4 lg:hidden"
        >
          {filtros}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block" aria-label="Filtros">
          {filtros}
        </aside>

        <div>
          {resultado.length === 0 ? (
            <div className="rounded-lg border border-borda-escura bg-cartao-escuro p-8 text-center">
              <p className="font-bold text-white">Nada encontrado com esses filtros.</p>
              <p className="mt-1.5 text-sm text-cinza-claro/80">
                Tente o código da peça, ou limpe os filtros para ver o catálogo
                inteiro.
              </p>
              <button
                type="button"
                onClick={limpar}
                className="mt-4 inline-flex h-11 items-center rounded-md bg-laranja-escuro px-4 text-sm font-bold text-white hover:bg-marrom"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {resultado.map((p) => (
                <CartaoProduto key={p.codigo} produto={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
