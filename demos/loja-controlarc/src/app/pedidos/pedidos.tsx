"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { FileText, RotateCcw, ChevronDown } from "lucide-react";
import { useLoja, STATUS, type StatusPedido } from "@/lib/estado";
import { reais, dataHora } from "@/lib/formato";

// ─────────────────────────────────────────────────────────────────────────────
// MEUS PEDIDOS.
//
// A régua de status aparece em cada pedido porque a pergunta que o comprador
// faz ao telefone é sempre a mesma: «saiu?». Mostrar em que etapa está é o que
// derruba esse telefonema.
//
// «Repetir pedido» existe porque reposição de consumível é a mesma lista todo
// mês. Ele remonta o carrinho; não envia nada sozinho.
// ─────────────────────────────────────────────────────────────────────────────

const COR_STATUS: Record<StatusPedido, string> = {
  "Recebido": "bg-white/10 text-cinza-claro border-white/20",
  "Em separação": "bg-estoque-consulta/20 text-estoque-consulta border-estoque-consulta/40",
  "Faturado": "bg-laranja/10 text-laranja-texto border-laranja/40",
  "Enviado": "bg-estoque-ok/20 text-estoque-ok border-estoque-ok/40",
};

function Regua({ status }: { status: StatusPedido }) {
  const atual = STATUS.indexOf(status);
  return (
    <ol className="mt-4 flex items-center gap-1.5" aria-label={`Andamento: ${status}`}>
      {STATUS.map((s, i) => (
        <li key={s} className="flex-1">
          <span
            aria-hidden="true"
            className={`block h-1.5 rounded-full ${i <= atual ? "bg-laranja-escuro" : "bg-borda-escura"}`}
          />
          <span
            className={`mt-1.5 block text-[11px] ${
              i <= atual ? "text-cinza-claro" : "text-cinza-claro/70"
            }`}
          >
            {s}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Pedidos() {
  const { pronto, pedidos, empresa, repetirPedido } = useLoja();
  const [aberto, setAberto] = useState<string | null>(null);

  if (!pronto) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <p className="text-cinza-claro/70">Carregando os pedidos…</p>
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <FileText className="mx-auto size-10 text-cinza-claro/75" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">
          Nenhum pedido ainda
        </h1>
        <p className="mt-3 text-cinza-claro/80">
          Os pedidos enviados por esta empresa aparecem aqui, com o andamento de
          cada um.
        </p>
        <Link
          href="/produtos"
          className="mt-6 inline-flex h-12 items-center rounded-md bg-laranja-escuro px-6 text-sm font-bold text-white hover:bg-marrom"
        >
          Ver o catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Meus pedidos</h1>
      <p className="mt-1.5 text-sm text-cinza-claro/70">
        {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}
        {empresa && ` · ${empresa.razaoSocial}`}
      </p>

      <ul className="mt-8 space-y-4">
        {pedidos.map((p) => {
          const expandido = aberto === p.numero;
          const pecas = p.itens.reduce((t, l) => t + l.quantidade, 0);
          return (
            <li key={p.numero} className="rounded-lg border border-borda-escura bg-cartao-escuro">
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-mono text-lg font-bold text-white">
                      Pedido {p.numero}
                    </h2>
                    <p className="mt-0.5 text-sm text-cinza-claro/70">
                      {dataHora(p.quando)} · {p.itens.length}{" "}
                      {p.itens.length === 1 ? "item" : "itens"} · {pecas} peças
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium ${COR_STATUS[p.status]}`}
                    >
                      {p.status}
                    </span>
                    <p className="mt-1.5 text-xl font-extrabold text-white">{reais(p.total)}</p>
                  </div>
                </div>

                <Regua status={p.status} />

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setAberto(expandido ? null : p.numero)}
                    aria-expanded={expandido}
                    aria-controls={`detalhe-${p.numero}`}
                    className="inline-flex h-11 items-center gap-2 rounded-md border border-borda-escura px-4 text-sm font-medium text-cinza-claro hover:bg-borda-escura"
                  >
                    <ChevronDown
                      className={`size-4 transition-transform ${expandido ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                    {expandido ? "Ocultar itens" : "Ver os itens"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      repetirPedido(p.numero);
                      toast.success(`Itens do pedido ${p.numero} no carrinho`);
                    }}
                    className="inline-flex h-11 items-center gap-2 rounded-md bg-laranja-escuro px-4 text-sm font-bold text-white hover:bg-marrom"
                  >
                    <RotateCcw className="size-4" aria-hidden="true" />
                    Repetir pedido
                  </button>
                </div>
              </div>

              {expandido && (
                <div id={`detalhe-${p.numero}`} className="border-t border-borda-escura p-5">
                  <table className="w-full text-sm">
                    <caption className="sr-only">Itens do pedido {p.numero}</caption>
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-cinza-claro/60">
                        <th scope="col" className="pb-2 font-medium">Item</th>
                        <th scope="col" className="pb-2 text-right font-medium">Qtd.</th>
                        <th scope="col" className="pb-2 text-right font-medium">Unitário</th>
                        <th scope="col" className="pb-2 text-right font-medium">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-borda-escura">
                      {p.itens.map((l) => (
                        <tr key={l.codigo}>
                          <td className="py-2.5 pr-3">
                            <span className="block text-white">{l.nome}</span>
                            <span className="font-mono text-xs text-cinza-claro/60">
                              {l.codigo} · {l.medida}
                            </span>
                          </td>
                          <td className="py-2.5 text-right text-cinza-claro/85">{l.quantidade}</td>
                          <td className="py-2.5 text-right text-cinza-claro/85">{reais(l.preco)}</td>
                          <td className="py-2.5 text-right font-bold text-white">
                            {reais(l.preco * l.quantidade)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <dl className="mt-5 grid gap-3 border-t border-borda-escura pt-4 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-cinza-claro/60">
                        Entrega
                      </dt>
                      <dd className="mt-1 text-cinza-claro/85">{p.endereco}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-cinza-claro/60">
                        Pagamento
                      </dt>
                      <dd className="mt-1 text-cinza-claro/85">{p.pagamento}</dd>
                    </div>
                    {p.pedidoCompra && (
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-cinza-claro/60">
                          Pedido de compra
                        </dt>
                        <dd className="mt-1 text-cinza-claro/85">{p.pedidoCompra}</dd>
                      </div>
                    )}
                    {p.observacoes && (
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-cinza-claro/60">
                          Observações
                        </dt>
                        <dd className="mt-1 text-cinza-claro/85">{p.observacoes}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
