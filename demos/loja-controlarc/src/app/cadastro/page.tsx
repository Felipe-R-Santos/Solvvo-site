import type { Metadata } from "next";
import { Suspense } from "react";
import { Cadastro } from "./cadastro";

export const metadata: Metadata = {
  title: "Cadastrar a empresa",
  description: "Identifique a empresa pelo CNPJ para enviar pedidos.",
};

export default function PaginaCadastro() {
  return (
    <Suspense fallback={null}>
      <Cadastro />
    </Suspense>
  );
}
