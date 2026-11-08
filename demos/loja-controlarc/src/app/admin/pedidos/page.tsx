"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { useLoja, STATUS, type StatusPedido } from "@/lib/estado";
import { usarPainel } from "@/lib/usar-painel";
import { CHAVES, ler, gravar } from "@/lib/armazenamento";
import { reais, dataHora } from "@/lib/formato";

// ─────────────────────────────────────────────────────────────────────────────
// PEDIDOS, DO LADO DE DENTRO.
//
// Os pedidos DE VERDADE deste navegador mudam de status pelo contexto, que é
// quem a loja lê — por isso o cliente vê a mudança na tela «Meus pedidos» na
// hora.
//
// Os pedidos das empresas FICTÍCIAS não existem em lugar nenhum, então o status
// alterado é guardado numa chave à parte. Sem isso o botão mexeria na tela e
// esqueceria ao recarregar, dando a impressão de que a demonstração está
// quebrada.
// ─────────────────────────────────────────────────────────────────────────────

const COR: Record<StatusPedido, string> = {
  "Recebido": "bg-white/10 text-cinza-claro border-white/20",
  "Em separação": "bg-estoque-consulta/20 text-estoque-consulta border-estoque-consulta/40",
  "Faturado": "bg-laranja/10 text-laranja-texto border-laranja/40",
  "Enviado": "bg-estoque-ok/20 text-estoque-ok border-estoque-ok/40",
};

export default function PedidosPainel() {
  const { catalogo, mudarStatus } = useLoja();
  const { montado, atividades } = usarPainel();
  const [trocados, setTrocados] = useState<Record<string, StatusPedido>>({});
  const [aberto, setAberto] = useState<string | null>(null);
  const [leu, setLeu] = useState(false);

  useEffect(() => {
    setTrocados(ler<Record<string, StatusPedido>>(CHAVES.statusExemplo, {}));
    setLeu(true);
  }, []);

  useEffect(() => {
    if (leu) gravar(CHAVES.statusExemplo, trocados);
  }, [leu, trocados]);

  const nome = useMemo(
    () => (c: string) => {
      const p = catalogo.find((x) => x.codigo === c);
      return p ? `${p.nome} ${p.medida}` : c;
    },
    [catalogo],
  );

  const linhas = useMemo(
    () =>
      atividades
        .flatMap((a) =>
          a.pedidos.map((p) => ({
            ...p,
            status: trocados[p.numero] ?? p.status,
            empresa: a.razaoSocial,
            cnpj: a.cnpj,
            esteAparelho: a.esteAparelho,
          })),
        )
        .sort((x, y) => y.quando.localeCompare(x.quando)),
    [atividades, trocados],
  );

  if (!montado) return <p className="text-cinza-claro/70">Carregando os pedidos…</p>;

  function trocar(numero: string, esteAparelho: boolean, status: StatusPedido) {
    if (esteAparelho) mudarStatus(numero, status);
    else setTrocados((a) => ({ ...a, [numero]: status }));
    toast.success(`Pedido ${numero}: ${status}`);
  }

  const total = linhas.reduce((t, l) => t + l.total, 0);

  return (
    <div>
      <p className="text-sm text-cinza-claro/70">
        {linhas.length} {linhas.length === 1 ? "pedido" : "pedidos"} ·{" "}
        {reais(total)} no total
      </p>

      <ul className="mt-5 space-y-3">
        {linhas.map((l) => {
          const expandido = aberto === l.numero;
          return (
            <li key={l.numero} className="rounded-lg border border-borda-escura bg-cartao-escuro">
              <div className="grid gap-3 p-4 sm:grid-cols-[1fr_auto]">
                <div className="min-w-0">
                  <h2 className="font-mono font-bold text-white">Pedido {l.numero}</h2>
                  <p className="mt-0.5 text-sm text-white">
                    {l.empresa}
                    {l.esteAparelho && (
                      <span className="ml-2 rounded bg-laranja-escuro px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        este aparelho
                      </span>
                    )}
                  </p>
                  <p className="font-mono text-xs text-cinza-claro/60">{l.cnpj}</p>
                  <p className="mt-1 text-xs text-cinza-claro/70">{dataHora(l.quando)}</p>
                </div>

                <div className="sm:text-right">
                  <p className="text-xl font-extrabold text-white">{reais(l.total)}</p>
                  <span
                    className={`mt-1.5 inline-block rounded-full border px-2.5 py-1 text-xs font-medium ${COR[l.status]}`}
                  >
                    {l.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-borda-escura px-4 py-3">
                <label htmlFor={`status-${l.numero}`} className="text-sm text-cinza-claro/80">
                  Mudar status
                </label>
                <select
                  id={`status-${l.numero}`}
                  value={l.status}
                  onChange={(e) => trocar(l.numero, l.esteAparelho, e.target.value as StatusPedido)}
                  className="h-11 rounded-md border border-borda-escura bg-fundo px-3 text-sm text-white outline-none focus:border-laranja"
                >
                  {STATUS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setAberto(expandido ? null : l.numero)}
                  aria-expanded={expandido}
                  aria-controls={`itens-${l.numero}`}
                  className="ml-auto inline-flex h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-cinza-claro hover:text-white"
                >
                  <ChevronDown
                    className={`size-4 transition-transform ${expandido ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                  {expandido ? "Ocultar itens" : "Ver os itens"}
                </button>
              </div>

              {expandido && (
                <ul id={`itens-${l.numero}`} className="border-t border-borda-escura p-4 space-y-2">
                  {l.itens.map((i) => (
                    <li key={i.codigo} className="flex justify-between gap-3 text-sm">
                      <span className="text-cinza-claro/85">{nome(i.codigo)}</span>
                      <span className="shrink-0 text-white">{i.quantidade}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {linhas.length > 0 && (
        <p className="mt-5 text-xs text-cinza-claro/75">
          O status de um pedido feito neste aparelho muda também na tela «Meus
          pedidos» do cliente, na hora.
        </p>
      )}
    </div>
  );
}
