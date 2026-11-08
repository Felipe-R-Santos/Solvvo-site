"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, MessageCircle, Clock } from "lucide-react";
import { useLoja } from "@/lib/estado";
import { usarPainel } from "@/lib/usar-painel";
import type { Atividade } from "@/lib/painel";
import { reais, desde } from "@/lib/formato";

// ─────────────────────────────────────────────────────────────────────────────
// OPORTUNIDADES.
//
// Duas listas, ordenadas por dinheiro parado: carrinho montado e largado, e
// quem olhou produto e não comprou. É a tela que justifica a loja para quem
// vende — ela transforma navegação em lista de ligação.
//
// ⚠ O LINK DO WHATSAPP VAI SEM NÚMERO, de propósito: `wa.me/?text=…` abre o
// aplicativo com a mensagem pronta e deixa quem vende escolher o contato.
// Mandar número embutido seria inventar o telefone de uma empresa que não
// existe — e, no portal real, disparar conversa sem conferir o destinatário.
//
// Nada aqui envia nada. «Marcar como atendido» só tira a linha da fila, neste
// navegador.
// ─────────────────────────────────────────────────────────────────────────────

function mensagemCarrinho(a: Atividade, itens: string) {
  return (
    `Olá, ${a.comprador}! Aqui é da Control ARC.\n\n` +
    `Vi que ficou um carrinho em aberto no portal da ${a.razaoSocial}, ` +
    `com ${itens}, somando ${reais(a.valorCarrinho)}.\n\n` +
    `Quer que eu confirme o prazo e feche o pedido?`
  );
}

function mensagemVisita(a: Atividade, itens: string) {
  return (
    `Olá, ${a.comprador}! Aqui é da Control ARC.\n\n` +
    `Vi que a ${a.razaoSocial} esteve olhando ${itens} no portal.\n\n` +
    `Posso passar prazo e condição para esses itens?`
  );
}

export default function Oportunidades() {
  const { catalogo, carrinho, atendidos, marcarAtendido, simularAbandono } = useLoja();
  const { montado, atividades } = usarPainel();
  const [mostrarAtendidos, setMostrarAtendidos] = useState(false);

  const nome = useMemo(
    () => (c: string) => {
      const p = catalogo.find((x) => x.codigo === c);
      return p ? `${p.nome} ${p.medida}` : c;
    },
    [catalogo],
  );

  const abandonados = useMemo(
    () => atividades.filter((a) => a.abandonou).sort((a, b) => b.valorCarrinho - a.valorCarrinho),
    [atividades],
  );

  const viuNaoComprou = useMemo(
    () => atividades.filter((a) => a.viuNaoComprou).sort((a, b) => b.vistos.length - a.vistos.length),
    [atividades],
  );

  if (!montado) return <p className="text-cinza-claro/70">Carregando as oportunidades…</p>;

  const visivel = (chave: string) => mostrarAtendidos || !atendidos.includes(chave);

  async function copiar(texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
      toast.success("Mensagem copiada");
    } catch {
      // Área de transferência bloqueada (http sem localhost, permissão negada):
      // em vez de falhar calado, diz o que aconteceu.
      toast.error("O navegador não liberou a área de transferência");
    }
  }

  function Cartao({ a, tipo }: { a: Atividade; tipo: "carrinho" | "visita" }) {
    const itens =
      tipo === "carrinho"
        ? a.carrinho.map((i) => `${i.quantidade} × ${nome(i.codigo)}`).join(", ")
        : a.vistos.slice(0, 3).map(nome).join(", ");
    const texto = tipo === "carrinho" ? mensagemCarrinho(a, itens) : mensagemVisita(a, itens);
    const atendido = atendidos.includes(a.chave + tipo);

    return (
      <li className={`rounded-lg border border-borda-escura bg-cartao-escuro p-4 ${atendido ? "opacity-55" : ""}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-bold text-white">
              {a.razaoSocial}
              {a.esteAparelho && (
                <span className="ml-2 rounded bg-laranja-escuro px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  este aparelho
                </span>
              )}
            </h3>
            <p className="font-mono text-xs text-cinza-claro/60">{a.cnpj}</p>
            <p className="mt-1 text-sm text-cinza-claro/85">
              {a.comprador}
              {a.cargo && ` · ${a.cargo}`} · última visita {desde(a.ultimaVisita)}
            </p>
          </div>
          {tipo === "carrinho" && (
            <p className="text-right">
              <span className="block text-xs uppercase tracking-wide text-cinza-claro/60">
                parado
              </span>
              <span className="text-xl font-extrabold text-estoque-consulta">
                {reais(a.valorCarrinho)}
              </span>
            </p>
          )}
        </div>

        <p className="mt-3 rounded-md bg-fundo px-3 py-2 text-sm text-cinza-claro/85">
          {itens || "—"}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(texto)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-laranja-escuro px-4 text-sm font-bold text-white hover:bg-marrom"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Chamar no WhatsApp
          </a>
          <button
            type="button"
            onClick={() => copiar(texto)}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-borda-escura px-4 text-sm font-medium text-cinza-claro hover:bg-borda-escura hover:text-white"
          >
            <Copy className="size-4" aria-hidden="true" />
            Copiar mensagem
          </button>
          <button
            type="button"
            onClick={() => {
              marcarAtendido(a.chave + tipo);
              toast.success(`${a.razaoSocial} marcada como atendida`);
            }}
            disabled={atendido}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-borda-escura px-4 text-sm font-medium text-cinza-claro hover:bg-borda-escura hover:text-white disabled:opacity-60"
          >
            <Check className="size-4" aria-hidden="true" />
            {atendido ? "Atendida" : "Marcar como atendido"}
          </button>
        </div>

        <p className="mt-3 text-xs text-cinza-claro/75">
          O link abre o WhatsApp com a mensagem pronta e sem destinatário — quem
          vende escolhe o contato. Nada é enviado por esta tela.
        </p>
      </li>
    );
  }

  const listaAbandono = abandonados.filter((a) => visivel(a.chave + "carrinho"));
  const listaVisita = viuNaoComprou.filter((a) => visivel(a.chave + "visita"));

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-borda-escura bg-cartao-escuro p-4">
        <div>
          <p className="text-sm font-bold text-white">Ferramentas da demonstração</p>
          <p className="mt-0.5 text-xs text-cinza-claro/70">
            Um carrinho só conta como abandonado depois de 30 minutos parado.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              simularAbandono();
              toast.success("Carrinho deste aparelho marcado como parado");
            }}
            disabled={carrinho.length === 0}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-laranja px-4 text-sm font-bold text-laranja-texto hover:bg-marrom hover:text-white disabled:border-borda-escura disabled:text-cinza-claro/75 disabled:hover:bg-transparent"
          >
            <Clock className="size-4" aria-hidden="true" />
            Simular abandono agora
          </button>
          <label className="inline-flex h-11 items-center gap-2 rounded-md border border-borda-escura px-4 text-sm text-cinza-claro">
            <input
              type="checkbox"
              checked={mostrarAtendidos}
              onChange={(e) => setMostrarAtendidos(e.target.checked)}
              className="size-4 accent-[#DF5318]"
            />
            Mostrar atendidas
          </label>
        </div>
      </div>
      {carrinho.length === 0 && (
        <p className="-mt-6 text-xs text-cinza-claro/60">
          Para usar «simular abandono», coloque algum item no carrinho da loja
          primeiro.
        </p>
      )}

      <section aria-labelledby="titulo-abandono">
        <h2 id="titulo-abandono" className="text-sm font-bold uppercase tracking-wide text-white">
          Carrinhos abandonados
          <span className="ml-2 font-medium text-cinza-claro/60">
            {listaAbandono.length} · {reais(listaAbandono.reduce((t, a) => t + a.valorCarrinho, 0))}
          </span>
        </h2>
        {listaAbandono.length === 0 ? (
          <p className="mt-3 text-sm text-cinza-claro/70">
            Nenhum carrinho parado no momento.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {listaAbandono.map((a) => (
              <Cartao key={a.chave} a={a} tipo="carrinho" />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="titulo-viu">
        <h2 id="titulo-viu" className="text-sm font-bold uppercase tracking-wide text-white">
          Viu e não comprou
          <span className="ml-2 font-medium text-cinza-claro/60">{listaVisita.length}</span>
        </h2>
        {listaVisita.length === 0 ? (
          <p className="mt-3 text-sm text-cinza-claro/70">Ninguém nesta fila.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {listaVisita.map((a) => (
              <Cartao key={a.chave} a={a} tipo="visita" />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
