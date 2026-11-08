"use client";

import { useState } from "react";
import { mascaraCnpj, cnpjValido } from "@/lib/cnpj";
import type { Empresa } from "@/lib/estado";

// ─────────────────────────────────────────────────────────────────────────────
// O FORMULÁRIO DA EMPRESA — usado no cadastro e na edição.
//
// O CNPJ É CONFERIDO PELO DÍGITO VERIFICADOR, não só pelo tamanho. Numa loja
// B2B o CNPJ é a identidade do pedido: digitar errado significa nota no nome
// de outra empresa.
//
// ⚠ CONFERIR O DÍGITO NÃO É CONSULTAR A RECEITA. O número pode ser válido e não
// existir. No portal real isto consulta o cadastro da Control antes de aceitar.
//
// Cada erro aparece ao lado do campo e é ligado a ele por `aria-describedby`;
// uma lista de erros no topo faria quem usa leitor de tela caçar o campo.
// ─────────────────────────────────────────────────────────────────────────────

type Dados = Omit<Empresa, "desde">;

const VAZIO: Dados = {
  cnpj: "", razaoSocial: "", comprador: "", cargo: "", email: "", whatsapp: "",
};

type Props = {
  inicial?: Dados;
  rotuloEnvio: string;
  aoEnviar: (d: Dados) => void;
};

function Campo({
  id, rotulo, valor, mudar, erro, dica, tipo = "text", inputMode, maxLength, autoComplete,
}: {
  id: string; rotulo: string; valor: string; mudar: (v: string) => void;
  erro?: string; dica?: string; tipo?: string;
  inputMode?: "text" | "numeric" | "tel" | "email"; maxLength?: number; autoComplete?: string;
}) {
  const idErro = `${id}-erro`;
  const idDica = `${id}-dica`;
  const descrito = [erro ? idErro : null, dica ? idDica : null].filter(Boolean).join(" ");

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {rotulo}
      </label>
      <input
        id={id}
        type={tipo}
        value={valor}
        inputMode={inputMode}
        maxLength={maxLength}
        autoComplete={autoComplete}
        onChange={(e) => mudar(e.target.value)}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descrito || undefined}
        className={`mt-1.5 h-11 w-full rounded-md border bg-cartao-escuro px-3 text-sm text-white outline-none placeholder:text-cinza-claro/40 ${
          erro ? "border-marrom focus:border-marrom" : "border-borda-escura focus:border-laranja"
        }`}
      />
      {dica && !erro && (
        <p id={idDica} className="mt-1 text-xs text-cinza-claro/60">{dica}</p>
      )}
      {erro && (
        <p id={idErro} className="mt-1 text-xs font-medium text-laranja-texto">{erro}</p>
      )}
    </div>
  );
}

export function FormularioEmpresa({ inicial, rotuloEnvio, aoEnviar }: Props) {
  const [d, setD] = useState<Dados>(inicial ?? VAZIO);
  const [erros, setErros] = useState<Partial<Record<keyof Dados, string>>>({});

  const trocar = (campo: keyof Dados) => (v: string) =>
    setD((a) => ({ ...a, [campo]: campo === "cnpj" ? mascaraCnpj(v) : v }));

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const novos: Partial<Record<keyof Dados, string>> = {};

    if (!d.cnpj.trim()) novos.cnpj = "Informe o CNPJ da empresa.";
    else if (!cnpjValido(d.cnpj)) novos.cnpj = "Esse CNPJ não passa na conferência do dígito. Confira os números.";

    if (d.razaoSocial.trim().length < 3) novos.razaoSocial = "Informe a razão social como está no cartão CNPJ.";
    if (d.comprador.trim().length < 3) novos.comprador = "Informe quem vai responder pelo pedido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) novos.email = "Informe um e-mail válido para o retorno do pedido.";
    if (d.whatsapp.replace(/\D/g, "").length < 10) novos.whatsapp = "Informe o telefone com DDD.";

    setErros(novos);
    if (Object.keys(novos).length > 0) {
      // Levar o foco ao primeiro campo com erro: rolar sozinho até ele é o que
      // evita o formulário «não fez nada» em tela de celular.
      document.getElementById(Object.keys(novos)[0])?.focus();
      return;
    }
    aoEnviar({ ...d, cnpj: d.cnpj.trim(), razaoSocial: d.razaoSocial.trim() });
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-5">
      <Campo
        id="cnpj" rotulo="CNPJ" valor={d.cnpj} mudar={trocar("cnpj")}
        erro={erros.cnpj} inputMode="numeric" maxLength={18}
        dica="Só o dígito verificador é conferido aqui — esta é uma demonstração, não há consulta à Receita."
      />
      <Campo
        id="razaoSocial" rotulo="Razão social" valor={d.razaoSocial}
        mudar={trocar("razaoSocial")} erro={erros.razaoSocial}
        autoComplete="organization"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo
          id="comprador" rotulo="Responsável pelo pedido" valor={d.comprador}
          mudar={trocar("comprador")} erro={erros.comprador} autoComplete="name"
        />
        <Campo
          id="cargo" rotulo="Cargo (opcional)" valor={d.cargo}
          mudar={trocar("cargo")} autoComplete="organization-title"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo
          id="email" rotulo="E-mail" valor={d.email} mudar={trocar("email")}
          erro={erros.email} tipo="email" inputMode="email" autoComplete="email"
        />
        <Campo
          id="whatsapp" rotulo="Telefone ou WhatsApp" valor={d.whatsapp}
          mudar={trocar("whatsapp")} erro={erros.whatsapp} inputMode="tel"
          autoComplete="tel"
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-12 w-full items-center justify-center rounded-md bg-laranja-escuro px-6 text-sm font-bold text-white hover:bg-marrom sm:w-auto"
      >
        {rotuloEnvio}
      </button>

      <p className="text-xs leading-relaxed text-cinza-claro/60">
        Nesta demonstração os dados ficam apenas no seu navegador. Nada é
        enviado e nada é armazenado em servidor.
      </p>
    </form>
  );
}
