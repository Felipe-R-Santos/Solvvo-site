"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Download, RotateCcw, Upload } from "lucide-react";
import { useLoja, type Sobrescrita } from "@/lib/estado";
import { PRODUTOS, ROTULO_ESTOQUE, type Estoque } from "@/dados/produtos";
import { reais } from "@/lib/formato";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUTOS, DO LADO DE DENTRO.
//
// A alteração NÃO reescreve o catálogo: ela vira uma sobrescrita guardada no
// navegador e aplicada por cima. É o que permite «restaurar original» sem
// precisar de cópia de segurança, e é o que faz o preço mudar na loja na hora.
//
// A IMPORTAÇÃO MOSTRA A PRÉVIA ANTES DE APLICAR, e lista as linhas que não
// reconheceu em vez de ignorá-las em silêncio. Planilha de preço aplicada sem
// conferência é o jeito mais rápido de vender pelo preço errado.
//
// O separador é ponto e vírgula porque é o que o Excel em português grava por
// padrão; a vírgula decimal também é aceita (`54,90`).
// ─────────────────────────────────────────────────────────────────────────────

const CABECALHO = "codigo;preco;estoque;prazo";

const MODELO = [
  CABECALHO,
  "CA-BC-M6-10;12,90;em-estoque;Pronta entrega",
  "CA-BO-CN-16;54,90;sob-consulta;7 dias úteis",
  "CA-DG-M8-01;29,90;indisponivel;Sem previsão",
].join("\r\n");

const ESTOQUES: Estoque[] = ["em-estoque", "sob-consulta", "indisponivel"];

type LinhaLida = {
  linha: number;
  codigo: string;
  nome: string;
  precoAntes: number;
  preco: number;
  estoqueAntes: Estoque;
  estoque: Estoque;
  prazoAntes: string;
  prazo: string;
};

type Recusada = { linha: number; conteudo: string; motivo: string };

function lerCsv(texto: string): { aceitas: LinhaLida[]; recusadas: Recusada[] } {
  const aceitas: LinhaLida[] = [];
  const recusadas: Recusada[] = [];

  texto.split(/\r?\n/).forEach((bruta, i) => {
    const numero = i + 1;
    const linha = bruta.trim();
    if (!linha) return;
    // O cabeçalho é opcional: planilha exportada traz, planilha colada não.
    if (linha.toLowerCase().replace(/\s/g, "").startsWith("codigo;")) return;

    const partes = linha.split(";").map((p) => p.trim());
    if (partes.length < 2) {
      recusadas.push({ linha: numero, conteudo: linha, motivo: "Faltam colunas (esperado codigo;preco;estoque;prazo)" });
      return;
    }

    const [codigo, precoBruto, estoqueBruto, prazoBruto] = partes;
    const produto = PRODUTOS.find((p) => p.codigo.toUpperCase() === codigo.toUpperCase());
    if (!produto) {
      recusadas.push({ linha: numero, conteudo: linha, motivo: `Código ${codigo} não existe no catálogo` });
      return;
    }

    const preco = Number(precoBruto.replace(/\./g, "").replace(",", "."));
    if (!Number.isFinite(preco) || preco <= 0) {
      recusadas.push({ linha: numero, conteudo: linha, motivo: `Preço «${precoBruto}» não é um número válido` });
      return;
    }

    let estoque = produto.estoque;
    if (estoqueBruto) {
      const achado = ESTOQUES.find(
        (e) =>
          e === estoqueBruto.toLowerCase() ||
          ROTULO_ESTOQUE[e].toLowerCase() === estoqueBruto.toLowerCase(),
      );
      if (!achado) {
        recusadas.push({
          linha: numero, conteudo: linha,
          motivo: `Estoque «${estoqueBruto}» desconhecido (use em-estoque, sob-consulta ou indisponivel)`,
        });
        return;
      }
      estoque = achado;
    }

    aceitas.push({
      linha: numero,
      codigo: produto.codigo,
      nome: `${produto.nome} ${produto.medida}`,
      precoAntes: produto.preco,
      preco,
      estoqueAntes: produto.estoque,
      estoque,
      prazoAntes: produto.prazo,
      prazo: prazoBruto || produto.prazo,
    });
  });

  return { aceitas, recusadas };
}

export default function ProdutosPainel() {
  const { catalogo, sobrescritas, sobrescrever, restaurarOriginais } = useLoja();
  const [previa, setPrevia] = useState<{ aceitas: LinhaLida[]; recusadas: Recusada[] } | null>(null);
  const [arquivo, setArquivo] = useState("");
  const entrada = useRef<HTMLInputElement>(null);

  const alterados = useMemo(() => Object.keys(sobrescritas).length, [sobrescritas]);

  function aplicarUm(codigo: string, s: Sobrescrita) {
    sobrescrever(codigo, s);
  }

  function baixarModelo() {
    // BOM na frente para o Excel abrir acentuado sem perguntar nada.
    const blob = new Blob(["﻿" + MODELO], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modelo-precos.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function escolher(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const texto = await f.text();
    setArquivo(f.name);
    setPrevia(lerCsv(texto));
  }

  function aplicarPrevia() {
    if (!previa) return;
    previa.aceitas.forEach((l) =>
      sobrescrever(l.codigo, { preco: l.preco, estoque: l.estoque, prazo: l.prazo }),
    );
    toast.success(`${previa.aceitas.length} produto(s) atualizados`);
    setPrevia(null);
    setArquivo("");
    if (entrada.current) entrada.current.value = "";
  }

  return (
    <div className="space-y-10">
      <section aria-labelledby="titulo-importar">
        <h2 id="titulo-importar" className="text-sm font-bold uppercase tracking-wide text-white">
          Importar planilha de preços
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-cinza-claro/80">
          Arquivo <code className="font-mono text-cinza-claro">.csv</code> com as
          colunas <code className="font-mono text-cinza-claro">{CABECALHO}</code>,
          separadas por ponto e vírgula. Estoque e prazo são opcionais: linha sem
          eles mantém o que já estava.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-md bg-laranja-escuro px-4 text-sm font-bold text-white hover:bg-marrom">
            <Upload className="size-4" aria-hidden="true" />
            Escolher arquivo
            <input
              ref={entrada}
              type="file"
              accept=".csv,text/csv"
              onChange={escolher}
              className="sr-only"
            />
          </label>
          <button
            type="button"
            onClick={baixarModelo}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-borda-escura px-4 text-sm font-medium text-cinza-claro hover:bg-borda-escura hover:text-white"
          >
            <Download className="size-4" aria-hidden="true" />
            Baixar o modelo
          </button>
        </div>

        {previa && (
          <div className="mt-5 rounded-lg border border-borda-escura bg-cartao-escuro p-4">
            <h3 className="font-bold text-white">
              Prévia de {arquivo}
            </h3>
            <p className="mt-1 text-sm text-cinza-claro/80">
              {previa.aceitas.length} linha(s) reconhecida(s)
              {previa.recusadas.length > 0 && `, ${previa.recusadas.length} recusada(s)`}
            </p>

            {previa.aceitas.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <caption className="sr-only">Alterações que serão aplicadas</caption>
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-cinza-claro/60">
                      <th scope="col" className="pb-2 font-medium">Produto</th>
                      <th scope="col" className="pb-2 font-medium">Preço</th>
                      <th scope="col" className="pb-2 font-medium">Estoque</th>
                      <th scope="col" className="pb-2 font-medium">Prazo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-borda-escura">
                    {previa.aceitas.map((l) => (
                      <tr key={l.codigo}>
                        <td className="py-2 pr-3">
                          <span className="block text-white">{l.nome}</span>
                          <span className="font-mono text-xs text-cinza-claro/60">{l.codigo}</span>
                        </td>
                        <td className="py-2 pr-3">
                          <span className="text-cinza-claro/60 line-through">{reais(l.precoAntes)}</span>
                          <span className="ml-2 font-bold text-white">{reais(l.preco)}</span>
                        </td>
                        <td className="py-2 pr-3 text-cinza-claro/85">
                          {ROTULO_ESTOQUE[l.estoque]}
                        </td>
                        <td className="py-2 text-cinza-claro/85">{l.prazo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {previa.recusadas.length > 0 && (
              <div className="mt-5 rounded-md border border-marrom/50 bg-marrom/10 p-3">
                <h4 className="text-sm font-bold text-white">Linhas não aplicadas</h4>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {previa.recusadas.map((r) => (
                    <li key={r.linha} className="text-cinza-claro/85">
                      <span className="font-mono text-xs text-cinza-claro/60">
                        linha {r.linha}
                      </span>{" "}
                      — {r.motivo}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={aplicarPrevia}
                disabled={previa.aceitas.length === 0}
                className="inline-flex h-11 items-center rounded-md bg-laranja-escuro px-4 text-sm font-bold text-white hover:bg-marrom disabled:bg-white/10 disabled:text-cinza-claro/60"
              >
                Aplicar {previa.aceitas.length} alteração(ões)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrevia(null);
                  setArquivo("");
                  if (entrada.current) entrada.current.value = "";
                }}
                className="inline-flex h-11 items-center rounded-md border border-borda-escura px-4 text-sm text-cinza-claro hover:bg-borda-escura"
              >
                Descartar
              </button>
            </div>
          </div>
        )}
      </section>

      <section aria-labelledby="titulo-catalogo">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="titulo-catalogo" className="text-sm font-bold uppercase tracking-wide text-white">
            Catálogo
            {alterados > 0 && (
              <span className="ml-2 font-medium text-laranja-texto">
                {alterados} alterado(s)
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={() => {
              restaurarOriginais();
              toast.success("Catálogo restaurado");
            }}
            disabled={alterados === 0}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-borda-escura px-4 text-sm font-medium text-cinza-claro hover:bg-borda-escura hover:text-white disabled:opacity-50"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Restaurar originais
          </button>
        </div>

        <ul className="mt-4 space-y-3">
          {catalogo.map((p) => {
            const mexido = Boolean(sobrescritas[p.codigo]);
            const original = PRODUTOS.find((x) => x.codigo === p.codigo)!;
            return (
              <li
                key={p.codigo}
                className={`rounded-lg border bg-cartao-escuro p-4 ${
                  mexido ? "border-laranja/60" : "border-borda-escura"
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-bold text-white">
                    {p.nome} {p.medida}
                  </h3>
                  <span className="font-mono text-xs text-cinza-claro/60">{p.codigo}</span>
                </div>
                {mexido && (
                  <p className="mt-1 text-xs text-laranja-texto">
                    Alterado neste navegador · original {reais(original.preco)} ·{" "}
                    {ROTULO_ESTOQUE[original.estoque]} · {original.prazo}
                  </p>
                )}

                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label htmlFor={`preco-${p.codigo}`} className="block text-xs text-cinza-claro/60">
                      Preço (R$)
                    </label>
                    <input
                      id={`preco-${p.codigo}`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={p.preco}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        if (Number.isFinite(n) && n >= 0) aplicarUm(p.codigo, { preco: n });
                      }}
                      className="mt-1 h-11 w-full rounded-md border border-borda-escura bg-fundo px-3 text-sm text-white outline-none focus:border-laranja"
                    />
                  </div>

                  <div>
                    <label htmlFor={`estoque-${p.codigo}`} className="block text-xs text-cinza-claro/60">
                      Estoque
                    </label>
                    <select
                      id={`estoque-${p.codigo}`}
                      value={p.estoque}
                      onChange={(e) => aplicarUm(p.codigo, { estoque: e.target.value as Estoque })}
                      className="mt-1 h-11 w-full rounded-md border border-borda-escura bg-fundo px-3 text-sm text-white outline-none focus:border-laranja"
                    >
                      {ESTOQUES.map((e) => (
                        <option key={e} value={e}>{ROTULO_ESTOQUE[e]}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor={`prazo-${p.codigo}`} className="block text-xs text-cinza-claro/60">
                      Prazo
                    </label>
                    <input
                      id={`prazo-${p.codigo}`}
                      value={p.prazo}
                      onChange={(e) => aplicarUm(p.codigo, { prazo: e.target.value })}
                      className="mt-1 h-11 w-full rounded-md border border-borda-escura bg-fundo px-3 text-sm text-white outline-none focus:border-laranja"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="inline-flex h-11 w-full cursor-pointer items-center gap-2 rounded-md border border-borda-escura px-3 text-sm text-cinza-claro">
                      <input
                        type="checkbox"
                        checked={p.maisVendido}
                        onChange={(e) => aplicarUm(p.codigo, { maisVendido: e.target.checked })}
                        className="size-4 accent-[#DF5318]"
                      />
                      Mais vendido
                    </label>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
