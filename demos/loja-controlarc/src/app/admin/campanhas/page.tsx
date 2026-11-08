"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { useLoja } from "@/lib/estado";
import { usarPainel } from "@/lib/usar-painel";
import type { Atividade } from "@/lib/painel";
import { CATEGORIAS, NOME_CURTO } from "@/dados/categorias";
import { reais } from "@/lib/formato";

// ─────────────────────────────────────────────────────────────────────────────
// CAMPANHAS.
//
// ⚠ ESTA TELA NÃO ENVIA NADA, e isso é regra, não limitação técnica da
// demonstração: disparo em massa para base B2B sem consentimento registrado é
// problema jurídico antes de ser problema de marketing. Aqui se escolhe o
// segmento, escreve a mensagem e COPIA — quem envia é uma pessoa, uma a uma.
//
// Os campos são {empresa} e {comprador}. A prévia mostra a mensagem já
// preenchida, empresa por empresa, para ninguém descobrir pelo WhatsApp do
// cliente que o campo não foi substituído.
// ─────────────────────────────────────────────────────────────────────────────

type Segmento = "abandonou" | "sem-compra-30" | "categoria";

const MODELO_PADRAO =
  "Olá, {comprador}! Aqui é da Control ARC.\n\n" +
  "Estamos com pronta entrega dos consumíveis de reposição para a célula da {empresa}.\n\n" +
  "Quer que eu monte um orçamento com os itens que vocês mais usam?";

const DIAS = 30;

export default function Campanhas() {
  const { catalogo } = useLoja();
  const { montado, atividades } = usarPainel();
  const [segmento, setSegmento] = useState<Segmento>("abandonou");
  const [categoria, setCategoria] = useState(CATEGORIAS[0].slug);
  const [modelo, setModelo] = useState(MODELO_PADRAO);

  const porCategoria = useMemo(
    () => (a: Atividade) =>
      a.vistos.some((c) => catalogo.find((p) => p.codigo === c)?.categoria === categoria),
    [catalogo, categoria],
  );

  const alvo = useMemo(() => {
    if (segmento === "abandonou") return atividades.filter((a) => a.abandonou);
    if (segmento === "categoria") return atividades.filter(porCategoria);
    // Comprou alguma vez, mas o pedido mais recente tem mais de 30 dias.
    return atividades.filter((a) => {
      if (a.pedidos.length === 0) return false;
      const ultimo = a.pedidos.reduce((m, p) => (p.quando > m ? p.quando : m), "");
      return Date.now() - new Date(ultimo).getTime() > DIAS * 86_400_000;
    });
  }, [atividades, segmento, porCategoria]);

  const preencher = (a: Atividade) =>
    modelo.replaceAll("{empresa}", a.razaoSocial).replaceAll("{comprador}", a.comprador);

  async function copiarTudo() {
    const texto = alvo
      .map((a) => `── ${a.razaoSocial} · ${a.cnpj} ──\n${preencher(a)}`)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(texto);
      toast.success(`${alvo.length} mensagem(ns) copiada(s)`);
    } catch {
      toast.error("O navegador não liberou a área de transferência");
    }
  }

  if (!montado) return <p className="text-cinza-claro/70">Carregando as campanhas…</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <div className="space-y-6">
        <fieldset>
          <legend className="text-sm font-bold uppercase tracking-wide text-white">
            Segmento
          </legend>
          <div className="mt-3 space-y-2">
            {([
              ["abandonou", "Abandonou o carrinho"],
              ["sem-compra-30", `Comprou há mais de ${DIAS} dias`],
              ["categoria", "Viu uma categoria"],
            ] as [Segmento, string][]).map(([valor, rotulo]) => (
              <label
                key={valor}
                className="flex cursor-pointer items-center gap-2.5 rounded-md border border-borda-escura bg-cartao-escuro px-3 py-3 text-sm text-cinza-claro"
              >
                <input
                  type="radio"
                  name="segmento"
                  value={valor}
                  checked={segmento === valor}
                  onChange={() => setSegmento(valor)}
                  className="size-4 accent-[#DF5318]"
                />
                {rotulo}
              </label>
            ))}
          </div>
        </fieldset>

        {segmento === "categoria" && (
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-white">
              Qual categoria
            </label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-md border border-borda-escura bg-cartao-escuro px-3 text-sm text-white outline-none focus:border-laranja"
            >
              {CATEGORIAS.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {NOME_CURTO[c.slug] ?? c.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="modelo" className="block text-sm font-medium text-white">
            Mensagem
          </label>
          <textarea
            id="modelo"
            rows={9}
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            aria-describedby="dica-campos"
            className="mt-1.5 w-full rounded-md border border-borda-escura bg-cartao-escuro px-3 py-2.5 text-sm leading-relaxed text-white outline-none focus:border-laranja"
          />
          <p id="dica-campos" className="mt-1.5 text-xs text-cinza-claro/60">
            Use <code className="font-mono text-cinza-claro">{"{empresa}"}</code> e{" "}
            <code className="font-mono text-cinza-claro">{"{comprador}"}</code>; a
            prévia já mostra preenchido.
          </p>
        </div>

        <button
          type="button"
          onClick={copiarTudo}
          disabled={alvo.length === 0}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-laranja-escuro px-6 text-sm font-bold text-white hover:bg-marrom disabled:bg-white/10 disabled:text-cinza-claro/60"
        >
          <Copy className="size-4" aria-hidden="true" />
          Copiar {alvo.length} mensagem(ns)
        </button>

        <p className="rounded-md border border-borda-escura px-3 py-2.5 text-xs leading-relaxed text-cinza-claro/70">
          Esta tela não envia mensagem nenhuma — nem aqui, nem no portal real
          sem consentimento registrado. Ela prepara o texto para quem vende
          enviar.
        </p>
      </div>

      <section aria-labelledby="titulo-previa">
        <h2 id="titulo-previa" className="text-sm font-bold uppercase tracking-wide text-white">
          Prévia
          <span className="ml-2 font-medium text-cinza-claro/60">
            {alvo.length} {alvo.length === 1 ? "empresa" : "empresas"}
          </span>
        </h2>

        {alvo.length === 0 ? (
          <p className="mt-3 rounded-lg border border-borda-escura bg-cartao-escuro p-5 text-sm text-cinza-claro/80">
            Nenhuma empresa cai neste segmento agora. Isso é resposta, não erro:
            o segmento existe e está vazio.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {alvo.map((a) => (
              <li key={a.chave} className="rounded-lg border border-borda-escura bg-cartao-escuro p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-bold text-white">{a.razaoSocial}</h3>
                  <span className="font-mono text-xs text-cinza-claro/60">{a.cnpj}</span>
                </div>
                {a.valorCarrinho > 0 && (
                  <p className="mt-0.5 text-xs text-estoque-consulta">
                    carrinho parado de {reais(a.valorCarrinho)}
                  </p>
                )}
                <p className="mt-3 whitespace-pre-line rounded-md bg-fundo px-3 py-2.5 text-sm leading-relaxed text-cinza-claro/85">
                  {preencher(a)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
