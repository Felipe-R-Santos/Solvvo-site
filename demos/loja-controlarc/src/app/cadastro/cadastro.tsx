"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useLoja } from "@/lib/estado";
import { FormularioEmpresa } from "@/componentes/FormularioEmpresa";

// Para onde ir depois de cadastrar. Só caminho interno é aceito: aceitar URL
// inteira da query seria mandar o visitante para fora do site a pedido de um
// link montado por outra pessoa.
function destinoSeguro(valor: string | null) {
  return valor && valor.startsWith("/") && !valor.startsWith("//") ? valor : "/produtos";
}

export function Cadastro() {
  const { empresa, cadastrar } = useLoja();
  const router = useRouter();
  const voltar = destinoSeguro(useSearchParams().get("voltar"));

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:py-16">
      <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
        {empresa ? "Trocar a empresa" : "Cadastrar a empresa"}
      </h1>
      <p className="mt-3 leading-relaxed text-cinza-claro/80">
        O pedido sai no nome da empresa, não da pessoa. Informe o CNPJ e quem
        responde pela compra; a Control ARC usa esses dados para confirmar
        prazo, frete e condição de pagamento.
      </p>

      {empresa && (
        <p className="mt-4 rounded-md border border-borda-escura bg-cartao-escuro px-4 py-3 text-sm text-cinza-claro/80">
          Hoje está cadastrada <span className="font-bold text-white">{empresa.razaoSocial}</span>.
          Enviar o formulário substitui esses dados.
        </p>
      )}

      <div className="mt-8">
        <FormularioEmpresa
          inicial={empresa ?? undefined}
          rotuloEnvio={empresa ? "Salvar e continuar" : "Cadastrar e continuar"}
          aoEnviar={(d) => {
            cadastrar(d);
            toast.success(`Empresa ${d.razaoSocial} cadastrada`);
            router.push(voltar);
          }}
        />
      </div>
    </div>
  );
}
