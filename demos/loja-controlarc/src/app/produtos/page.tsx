import type { Metadata } from "next";
import { Suspense } from "react";
import { Listagem } from "./listagem";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Catálogo de consumíveis e peças para soldagem robótica: bicos de contato, bocais, difusores, porta-bicos, limpeza de tocha, tochas e reposição.",
};

export default function PaginaProdutos() {
  return (
    // `useSearchParams` exige fronteira de Suspense; sem ela o build acusa a
    // página inteira como renderização dinâmica.
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12 text-cinza-claro/70">
          Carregando o catálogo…
        </div>
      }
    >
      <Listagem />
    </Suspense>
  );
}
