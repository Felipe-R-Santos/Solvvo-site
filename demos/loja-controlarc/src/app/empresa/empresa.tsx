"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Building2, Pencil, Trash2 } from "lucide-react";
import { useLoja } from "@/lib/estado";
import { FormularioEmpresa } from "@/componentes/FormularioEmpresa";
import { data } from "@/lib/formato";

export function MinhaEmpresa() {
  const { pronto, empresa, pedidos, cadastrar, zerar } = useLoja();
  const [editando, setEditando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  if (!pronto) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <p className="text-cinza-claro/70">Carregando…</p>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <Building2 className="mx-auto size-10 text-cinza-claro/75" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">
          Nenhuma empresa cadastrada
        </h1>
        <p className="mt-3 text-cinza-claro/80">
          Cadastre o CNPJ para enviar pedidos e acompanhar o andamento.
        </p>
        <Link
          href="/cadastro"
          className="mt-6 inline-flex h-12 items-center rounded-md bg-laranja-escuro px-6 text-sm font-bold text-white hover:bg-marrom"
        >
          Cadastrar a empresa
        </Link>
      </div>
    );
  }

  const ficha: [string, string][] = [
    ["CNPJ", empresa.cnpj],
    ["Razão social", empresa.razaoSocial],
    ["Responsável", empresa.comprador],
    ["Cargo", empresa.cargo || "—"],
    ["E-mail", empresa.email],
    ["Telefone", empresa.whatsapp],
    ["Cadastrada em", data(empresa.desde)],
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-16">
      <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Minha empresa</h1>
      <p className="mt-1.5 text-sm text-cinza-claro/70">
        Estes dados acompanham cada pedido enviado.
      </p>

      {editando ? (
        <div className="mt-8 rounded-lg border border-borda-escura bg-cartao-escuro p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">
            Editar cadastro
          </h2>
          <div className="mt-5">
            <FormularioEmpresa
              inicial={empresa}
              rotuloEnvio="Salvar alterações"
              aoEnviar={(d) => {
                cadastrar(d);
                setEditando(false);
                toast.success("Cadastro atualizado");
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => setEditando(false)}
            className="mt-4 inline-flex h-11 items-center rounded-md border border-borda-escura px-4 text-sm text-cinza-claro hover:bg-borda-escura"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-borda-escura bg-cartao-escuro p-5">
          <dl className="divide-y divide-borda-escura">
            {ficha.map(([rotulo, valor]) => (
              <div key={rotulo} className="grid grid-cols-[130px_1fr] gap-4 py-3">
                <dt className="text-sm text-cinza-claro/60">{rotulo}</dt>
                <dd className="break-words text-sm text-white">{valor}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setEditando(true)}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-laranja-escuro px-4 text-sm font-bold text-white hover:bg-marrom"
            >
              <Pencil className="size-4" aria-hidden="true" />
              Editar dados
            </button>
            <Link
              href="/pedidos"
              className="inline-flex h-11 items-center rounded-md border border-borda-escura px-4 text-sm font-medium text-cinza-claro hover:bg-borda-escura"
            >
              Ver os {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}
            </Link>
          </div>
        </div>
      )}

      <section className="mt-10 rounded-lg border border-borda-escura p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-white">
          Dados desta demonstração
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-cinza-claro/80">
          Cadastro, carrinho e pedidos ficam guardados só neste navegador, neste
          aparelho. Nada foi enviado para servidor nenhum. Apagar devolve a loja
          ao estado inicial.
        </p>

        {confirmando ? (
          <div className="mt-4 rounded-md border border-marrom/50 bg-marrom/10 p-4">
            <p className="text-sm text-white">
              Apagar o cadastro, o carrinho e os {pedidos.length}{" "}
              {pedidos.length === 1 ? "pedido" : "pedidos"} deste navegador? Não
              dá para desfazer.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  zerar();
                  setConfirmando(false);
                  toast.success("Demonstração reiniciada");
                }}
                className="inline-flex h-11 items-center rounded-md bg-marrom px-4 text-sm font-bold text-white hover:bg-marrom"
              >
                Apagar tudo
              </button>
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="inline-flex h-11 items-center rounded-md border border-borda-escura px-4 text-sm text-cinza-claro hover:bg-borda-escura"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-md border border-borda-escura px-4 text-sm font-medium text-cinza-claro hover:bg-borda-escura hover:text-white"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Apagar os dados desta demonstração
          </button>
        )}
      </section>
    </div>
  );
}
