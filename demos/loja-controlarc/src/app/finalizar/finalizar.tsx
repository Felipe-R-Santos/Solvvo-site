"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Building2 } from "lucide-react";
import { useLoja, type Pedido } from "@/lib/estado";
import { montarLinhas, totalCarrinho } from "@/lib/carrinho";
import { PEDIDO_MINIMO } from "@/dados/produtos";
import { reais, dataHora } from "@/lib/formato";

// ─────────────────────────────────────────────────────────────────────────────
// FINALIZAR O PEDIDO.
//
// NÃO HÁ PAGAMENTO AQUI, e isso é de propósito: em compra B2B de consumível o
// preço final depende de frete e condição, que a Control confirma antes de
// faturar. Pedir cartão nesta tela inventaria uma etapa que o negócio não tem.
//
// ⚠ AS CONDIÇÕES DE PAGAMENTO SÃO ILUSTRATIVAS. Prazo, boleto e faturamento
// precisam vir do que a Control pratica de verdade antes de qualquer uso.
// ─────────────────────────────────────────────────────────────────────────────

const PAGAMENTOS = [
  "Boleto 28 dias",
  "Boleto 14 dias",
  "Pix na confirmação",
  "Faturar conforme contrato vigente",
];

export function Finalizar() {
  const {
    pronto, empresa, carrinho, catalogo, criarPedido, registrar,
  } = useLoja();

  const [pagamento, setPagamento] = useState(PAGAMENTOS[0]);
  const [pedidoCompra, setPedidoCompra] = useState("");
  const [endereco, setEndereco] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [erroEndereco, setErroEndereco] = useState("");
  const [enviado, setEnviado] = useState<Pedido | null>(null);

  useEffect(() => {
    if (pronto && !enviado && carrinho.length > 0) registrar("iniciou_finalizacao");
  }, [pronto, enviado, carrinho.length, registrar]);

  if (!pronto) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-cinza-claro/70">Carregando…</p>
      </div>
    );
  }

  // ── Depois de enviar ──────────────────────────────────────────────────────
  if (enviado) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rounded-lg border border-estoque-ok/40 bg-estoque-ok/10 p-6 text-center">
          <CheckCircle2 className="mx-auto size-10 text-estoque-ok" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-extrabold text-white">
            Pedido {enviado.numero} registrado
          </h1>
          <p className="mt-2 text-sm text-cinza-claro/85">
            Enviado em {dataHora(enviado.quando)} · {reais(enviado.total)}
          </p>
        </div>

        <p className="mt-6 rounded-md border border-borda-escura bg-cartao-escuro px-4 py-3 text-sm leading-relaxed text-cinza-claro/85">
          <span className="font-bold text-white">Isto é uma demonstração.</span>{" "}
          Nenhum pedido foi enviado à Control ARC e nenhum e-mail saiu daqui. O
          registro ficou guardado só neste navegador, para você ver como o
          acompanhamento funcionaria.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/pedidos"
            className="inline-flex h-12 items-center rounded-md bg-laranja-escuro px-6 text-sm font-bold text-white hover:bg-marrom"
          >
            Acompanhar o pedido
          </Link>
          <Link
            href="/produtos"
            className="inline-flex h-12 items-center rounded-md border border-borda-escura px-6 text-sm font-medium text-cinza-claro hover:bg-borda-escura"
          >
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  const linhas = montarLinhas(carrinho, catalogo);
  const total = totalCarrinho(linhas);
  const falta = PEDIDO_MINIMO - total;

  // ── Carrinho vazio ────────────────────────────────────────────────────────
  if (linhas.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-extrabold text-white">Não há o que finalizar</h1>
        <p className="mt-3 text-cinza-claro/80">Seu carrinho está vazio.</p>
        <Link
          href="/produtos"
          className="mt-6 inline-flex h-12 items-center rounded-md bg-laranja-escuro px-6 text-sm font-bold text-white hover:bg-marrom"
        >
          Ver o catálogo
        </Link>
      </div>
    );
  }

  // ── Sem empresa cadastrada ────────────────────────────────────────────────
  if (!empresa) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <Building2 className="mx-auto size-10 text-cinza-claro/75" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-extrabold text-white">
          Falta identificar a empresa
        </h1>
        <p className="mt-3 leading-relaxed text-cinza-claro/80">
          O pedido sai no nome da empresa. Cadastre o CNPJ — leva meio minuto e
          o carrinho continua montado.
        </p>
        <Link
          href="/cadastro?voltar=/finalizar"
          className="mt-6 inline-flex h-12 items-center rounded-md bg-laranja-escuro px-6 text-sm font-bold text-white hover:bg-marrom"
        >
          Cadastrar a empresa
        </Link>
      </div>
    );
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (endereco.trim().length < 10) {
      setErroEndereco("Informe o endereço de entrega com rua, número e cidade.");
      document.getElementById("endereco")?.focus();
      return;
    }
    setErroEndereco("");
    const pedido = criarPedido({
      pagamento, pedidoCompra: pedidoCompra.trim(),
      observacoes: observacoes.trim(), endereco: endereco.trim(),
    });
    if (pedido) {
      setEnviado(pedido);
      window.scrollTo({ top: 0 });
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Finalizar pedido</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <form onSubmit={enviar} noValidate className="space-y-6">
          <section className="rounded-lg border border-borda-escura bg-cartao-escuro p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wide text-white">
                  Empresa
                </h2>
                <p className="mt-2 font-bold text-white">{empresa.razaoSocial}</p>
                <p className="text-sm text-cinza-claro/80">CNPJ {empresa.cnpj}</p>
                <p className="mt-1 text-sm text-cinza-claro/80">
                  {empresa.comprador}
                  {empresa.cargo && ` · ${empresa.cargo}`}
                </p>
                <p className="text-sm text-cinza-claro/80">
                  {empresa.email} · {empresa.whatsapp}
                </p>
              </div>
              <Link
                href="/cadastro?voltar=/finalizar"
                className="inline-block shrink-0 py-1 text-sm font-medium text-laranja-texto hover:underline"
              >
                Trocar
              </Link>
            </div>
          </section>

          <section className="rounded-lg border border-borda-escura bg-cartao-escuro p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-white">
              Entrega e condição
            </h2>

            <div className="mt-4 space-y-5">
              <div>
                <label htmlFor="endereco" className="block text-sm font-medium text-white">
                  Endereço de entrega
                </label>
                <textarea
                  id="endereco"
                  rows={3}
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Rua, número, bairro, cidade/UF e CEP"
                  aria-invalid={erroEndereco ? true : undefined}
                  aria-describedby={erroEndereco ? "endereco-erro" : undefined}
                  className={`mt-1.5 w-full rounded-md border bg-fundo px-3 py-2.5 text-sm text-white outline-none placeholder:text-cinza-claro/40 ${
                    erroEndereco ? "border-marrom" : "border-borda-escura focus:border-laranja"
                  }`}
                />
                {erroEndereco && (
                  <p id="endereco-erro" className="mt-1 text-xs font-medium text-laranja-texto">
                    {erroEndereco}
                  </p>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="pagamento" className="block text-sm font-medium text-white">
                    Condição de pagamento
                  </label>
                  <select
                    id="pagamento"
                    value={pagamento}
                    onChange={(e) => setPagamento(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-md border border-borda-escura bg-fundo px-3 text-sm text-white outline-none focus:border-laranja"
                  >
                    {PAGAMENTOS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-cinza-claro/60">
                    Sujeita a confirmação da Control ARC.
                  </p>
                </div>

                <div>
                  <label htmlFor="pedidoCompra" className="block text-sm font-medium text-white">
                    Nº do pedido de compra (opcional)
                  </label>
                  <input
                    id="pedidoCompra"
                    value={pedidoCompra}
                    onChange={(e) => setPedidoCompra(e.target.value)}
                    placeholder="Como aparece no seu sistema"
                    className="mt-1.5 h-11 w-full rounded-md border border-borda-escura bg-fundo px-3 text-sm text-white outline-none placeholder:text-cinza-claro/40 focus:border-laranja"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="observacoes" className="block text-sm font-medium text-white">
                  Observações (opcional)
                </label>
                <textarea
                  id="observacoes"
                  rows={3}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Horário de recebimento, nota em separado, urgência"
                  className="mt-1.5 w-full rounded-md border border-borda-escura bg-fundo px-3 py-2.5 text-sm text-white outline-none placeholder:text-cinza-claro/40 focus:border-laranja"
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={falta > 0}
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-laranja-escuro px-6 text-sm font-bold text-white hover:bg-marrom disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-cinza-claro/60 sm:w-auto"
          >
            Enviar pedido
          </button>
          <p className="text-xs leading-relaxed text-cinza-claro/60">
            Enviar não gera cobrança. O pedido vai para conferência e volta com
            prazo, frete e condição confirmados.
          </p>
        </form>

        <aside className="h-fit rounded-lg border border-borda-escura bg-cartao-escuro p-5 lg:sticky lg:top-24">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">
            {linhas.length} {linhas.length === 1 ? "item" : "itens"}
          </h2>

          <ul className="mt-4 space-y-3">
            {linhas.map((l) => (
              <li key={l.produto.codigo} className="flex justify-between gap-3 text-sm">
                <span className="min-w-0 text-cinza-claro/85">
                  <span className="block truncate text-white">{l.produto.nome}</span>
                  <span className="text-xs text-cinza-claro/60">
                    {l.produto.medida} · {l.quantidade} × {reais(l.produto.preco)}
                  </span>
                </span>
                <span className="shrink-0 font-bold text-white">{reais(l.subtotal)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-baseline justify-between border-t border-borda-escura pt-4">
            <span className="font-bold text-white">Total dos itens</span>
            <span className="text-2xl font-extrabold text-white">{reais(total)}</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-cinza-claro/60">
            Sem frete e sem impostos, informados na confirmação.
          </p>

          {falta > 0 && (
            <p className="mt-4 rounded-md border border-estoque-consulta/40 bg-estoque-consulta/15 px-3 py-2 text-sm text-estoque-consulta">
              Faltam {reais(falta)} para o pedido mínimo de {reais(PEDIDO_MINIMO)}.
            </p>
          )}

          <Link
            href="/carrinho"
            className="mt-4 flex h-11 items-center justify-center rounded-md border border-borda-escura text-sm font-medium text-cinza-claro hover:bg-borda-escura"
          >
            Revisar o carrinho
          </Link>
        </aside>
      </div>
    </div>
  );
}
