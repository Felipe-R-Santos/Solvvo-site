"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TELAS = [
  { href: "/admin", rotulo: "Visão geral" },
  { href: "/admin/empresas", rotulo: "Empresas" },
  { href: "/admin/oportunidades", rotulo: "Oportunidades" },
  { href: "/admin/pedidos", rotulo: "Pedidos" },
  { href: "/admin/produtos", rotulo: "Produtos" },
  { href: "/admin/campanhas", rotulo: "Campanhas" },
  { href: "/admin/integracoes", rotulo: "Integrações" },
];

export function NavegacaoPainel() {
  const caminho = usePathname();

  return (
    // Rola na horizontal no celular em vez de quebrar em três linhas de abas;
    // sete telas empilhadas empurrariam o conteúdo para fora da primeira tela.
    <nav aria-label="Telas do painel" className="mt-5 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex min-w-max gap-1 border-b border-borda-escura">
        {TELAS.map((t) => {
          const ativo = t.href === "/admin" ? caminho === "/admin" : caminho.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={ativo ? "page" : undefined}
                className={`inline-flex h-11 items-center border-b-2 px-3 text-sm font-medium ${
                  ativo
                    ? "border-laranja text-white"
                    : "border-transparent text-cinza-claro/70 hover:text-white"
                }`}
              >
                {t.rotulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
