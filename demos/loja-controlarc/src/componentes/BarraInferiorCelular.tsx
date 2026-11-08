"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, FileText, ShoppingCart } from "lucide-react";
import { useLoja } from "@/lib/estado";
import { totalPecas } from "@/lib/carrinho";

// ─────────────────────────────────────────────────────────────────────────────
// A BARRA DE BAIXO, SÓ NO CELULAR.
//
// Comprador de consumível repõe pelo telefone, no chão de fábrica. Sem esta
// barra, chegar ao carrinho exige rolar até o topo em toda página.
//
// `pb-[env(safe-area-inset-bottom)]` por causa da faixa de gestos do iPhone:
// sem isso o último dedo de altura dos botões fica embaixo dela.
// `main` leva `pb-24` no layout para o conteúdo não terminar atrás da barra.
// ─────────────────────────────────────────────────────────────────────────────

const ITENS = [
  { href: "/", rotulo: "Início", Icone: Home },
  { href: "/produtos", rotulo: "Produtos", Icone: Package },
  { href: "/pedidos", rotulo: "Pedidos", Icone: FileText },
] as const;

export function BarraInferiorCelular() {
  const caminho = usePathname();
  const { carrinho, abrirGaveta } = useLoja();
  const pecas = totalPecas(carrinho);

  // O painel tem a navegação dele; duas barras na mesma tela confundem.
  if (caminho.startsWith("/admin")) return null;

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-borda-escura bg-cabecalho pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-4">
        {ITENS.map(({ href, rotulo, Icone }) => {
          const ativo = href === "/" ? caminho === "/" : caminho.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={ativo ? "page" : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${
                  ativo ? "text-laranja-texto" : "text-cinza-claro/70"
                }`}
              >
                <Icone className="size-5" aria-hidden="true" />
                {rotulo}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={abrirGaveta}
            aria-label={pecas > 0 ? `Carrinho com ${pecas} peças` : "Carrinho, vazio"}
            className="relative flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-medium text-cinza-claro/70"
          >
            <span className="relative">
              <ShoppingCart className="size-5" aria-hidden="true" />
              {pecas > 0 && (
                <span className="absolute -right-2.5 -top-1.5 min-w-4 rounded-full bg-laranja-escuro px-1 text-center text-[10px] font-bold leading-4 text-white">
                  {pecas > 99 ? "99+" : pecas}
                </span>
              )}
            </span>
            Carrinho
          </button>
        </li>
      </ul>
    </nav>
  );
}
