import type { Metadata } from "next";
import { Boxes, FileCheck2, MessageSquare } from "lucide-react";

export const metadata: Metadata = { title: "Integrações" };

// ─────────────────────────────────────────────────────────────────────────────
// INTEGRAÇÕES — VITRINE, E DITA COMO TAL.
//
// Nenhuma destas conexões existe nesta demonstração. A tela está aqui porque é
// a primeira pergunta de quem avalia a loja («e o estoque, vem do sistema?») e
// porque é honesto mostrar a resposta como PLANO, com o que falta escrito ao
// lado, em vez de deixar imaginar que já funciona.
//
// ⚠ Nenhum nome de fornecedor, de ERP ou de emissor de nota aparece aqui: a
// escolha é da Control, não nossa, e citar marca daria a impressão de decisão
// já tomada.
// ─────────────────────────────────────────────────────────────────────────────

const CARTOES = [
  {
    Icone: Boxes,
    titulo: "ERP — estoque, preço e prazo",
    agora:
      "Nesta demonstração o catálogo é um arquivo, e o painel sobrescreve preço e estoque no navegador.",
    depois:
      "No portal real, preço, saldo e prazo são lidos do ERP da Control a cada consulta. A loja deixa de ter preço próprio: ela mostra o que o sistema diz, com a hora da última leitura à vista.",
    falta: "Definir qual sistema, qual forma de leitura e com que frequência.",
  },
  {
    Icone: FileCheck2,
    titulo: "Nota fiscal",
    agora:
      "O pedido para aqui: fica registrado com status, e nada é faturado.",
    depois:
      "O pedido confirmado vira pedido de venda no sistema da Control e segue para faturamento; o número da nota e o rastreio voltam para a tela «Meus pedidos» do cliente.",
    falta: "Definir quem aprova o pedido antes de virar nota, e a regra de crédito por CNPJ.",
  },
  {
    Icone: MessageSquare,
    titulo: "WhatsApp do comercial",
    agora:
      "As telas de oportunidade e campanha montam a mensagem e deixam copiar. Nenhum envio parte daqui.",
    depois:
      "O aviso de carrinho parado chega para quem atende aquela conta, com o histórico do cliente junto. O envio continua partindo de uma pessoa.",
    falta:
      "Registro de consentimento por empresa e definição de quem atende cada conta.",
  },
];

export default function Integracoes() {
  return (
    <div>
      <p className="max-w-3xl text-sm leading-relaxed text-cinza-claro/80">
        <span className="font-bold text-white">Nada nesta tela está ligado.</span>{" "}
        São as três conexões que transformam esta loja em portal de verdade, com
        o que já existe e o que ainda precisa ser decidido, lado a lado.
      </p>

      <ul className="mt-6 grid gap-4 lg:grid-cols-3">
        {CARTOES.map(({ Icone, titulo, agora, depois, falta }) => (
          <li
            key={titulo}
            className="flex flex-col rounded-lg border border-borda-escura bg-cartao-escuro p-5"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-laranja/15">
                <Icone className="size-5 text-laranja-texto" aria-hidden="true" />
              </span>
              <h2 className="font-bold leading-tight text-white">{titulo}</h2>
            </div>

            <span className="mt-4 inline-flex w-fit rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-xs font-medium text-cinza-claro">
              Não conectado
            </span>

            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-cinza-claro/60">Hoje</dt>
                <dd className="mt-1 leading-relaxed text-cinza-claro/85">{agora}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-cinza-claro/60">
                  No portal real
                </dt>
                <dd className="mt-1 leading-relaxed text-cinza-claro/85">{depois}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-cinza-claro/60">
                  O que falta decidir
                </dt>
                <dd className="mt-1 leading-relaxed text-laranja-texto">{falta}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
