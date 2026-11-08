"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ShoppingCart, Building2, FileText, Menu, X } from "lucide-react";
import { useLoja } from "@/lib/estado";
import { totalPecas } from "@/lib/carrinho";
import { CATEGORIAS } from "@/dados/categorias";
import { GavetaCarrinho } from "./GavetaCarrinho";

// ─────────────────────────────────────────────────────────────────────────────
// O CABEÇALHO.
//
// ⚠ O FUNDO É `#121212`, UM DEGRAU MAIS ESCURO QUE A PÁGINA — e isso não é
// enfeite. Os vazados das letras O, R e A da logo são preto puro, recortado
// sobre fundo escuro. Em cima de `#191919` eles aparecem como manchas. Quem
// mexer aqui: ajuste o fundo, nunca a logo.
//
// A busca é um `form` com `role="search"`: assim Enter funciona sem JavaScript
// de tecla e o leitor de tela anuncia a região.
// ─────────────────────────────────────────────────────────────────────────────

export function Cabecalho() {
  const { carrinho, empresa, abrirGaveta, registrar } = useLoja();
  const router = useRouter();
  const [termo, setTermo] = useState("");
  const [menu, setMenu] = useState(false);
  const pecas = totalPecas(carrinho);

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    const t = termo.trim();
    if (!t) return;
    registrar("busca", t);
    setMenu(false);
    router.push(`/produtos?busca=${encodeURIComponent(t)}`);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-borda-escura bg-cabecalho/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8 h-16 lg:h-20">
          <Link href="/" className="flex h-11 shrink-0 items-center" aria-label="Control ARC — página inicial">
            <Image
              src="/marca/logo-fundo-escuro.png"
              alt="Control ARC"
              width={1800}
              height={739}
              priority
              className="h-8 w-auto sm:h-10"
            />
          </Link>

          <form
            role="search"
            onSubmit={buscar}
            className="hidden flex-1 md:flex max-w-xl"
          >
            <label htmlFor="busca-topo" className="sr-only">
              Buscar por produto ou código
            </label>
            <div className="flex w-full items-center rounded-md border border-borda-escura bg-cartao-escuro focus-within:border-laranja">
              <input
                id="busca-topo"
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                placeholder="Buscar por produto ou código"
                className="h-11 flex-1 bg-transparent px-3 text-sm text-white placeholder:text-cinza-claro/75 outline-none"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="grid h-11 w-11 place-items-center text-cinza-claro hover:text-laranja-texto"
              >
                <Search className="size-5" aria-hidden="true" />
              </button>
            </div>
          </form>

          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Principal">
            <Link
              href="/produtos"
              className="flex h-11 items-center rounded-md px-3 text-sm font-medium text-cinza-claro hover:bg-borda-escura hover:text-white"
            >
              Produtos
            </Link>
            <Link
              href="/pedidos"
              className="flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-cinza-claro hover:bg-borda-escura hover:text-white"
            >
              <FileText className="size-4" aria-hidden="true" />
              Pedidos
            </Link>
            {/* Com empresa cadastrada o cabeçalho mostra QUEM está comprando,
                com o CNPJ — é o que diz, numa olhada, que o pedido vai sair no
                nome certo. Sem cadastro, vira o convite para entrar. */}
            <Link
              href="/empresa"
              className="flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-cinza-claro hover:bg-borda-escura hover:text-white"
            >
              <Building2 className="size-4 shrink-0" aria-hidden="true" />
              {empresa ? (
                <span className="text-left leading-tight">
                  <span className="block max-w-[180px] truncate text-white">
                    {empresa.razaoSocial}
                  </span>
                  <span className="block font-mono text-[11px] text-cinza-claro/60">
                    {empresa.cnpj}
                  </span>
                </span>
              ) : (
                "Entrar"
              )}
            </Link>
          </nav>

          <button
            type="button"
            onClick={abrirGaveta}
            className="relative ml-auto grid size-11 place-items-center rounded-md text-cinza-claro hover:bg-borda-escura hover:text-white lg:ml-0"
            aria-label={
              pecas > 0 ? `Carrinho com ${pecas} peças` : "Carrinho, vazio"
            }
          >
            <ShoppingCart className="size-5" aria-hidden="true" />
            {pecas > 0 && (
              <span className="absolute -right-0.5 -top-0.5 min-w-5 rounded-full bg-laranja-escuro px-1 text-center text-[11px] font-bold leading-5 text-white">
                {pecas > 99 ? "99+" : pecas}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            aria-expanded={menu}
            aria-controls="menu-celular"
            aria-label={menu ? "Fechar o menu" : "Abrir o menu"}
            className="grid size-11 place-items-center rounded-md text-cinza-claro hover:bg-borda-escura lg:hidden"
          >
            {menu
              ? <X className="size-5" aria-hidden="true" />
              : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>

        {menu && (
          <div id="menu-celular" className="border-t border-borda-escura px-4 py-4 lg:hidden">
            <form role="search" onSubmit={buscar} className="md:hidden">
              <label htmlFor="busca-celular" className="sr-only">
                Buscar por produto ou código
              </label>
              <div className="flex items-center rounded-md border border-borda-escura bg-cartao-escuro focus-within:border-laranja">
                <input
                  id="busca-celular"
                  value={termo}
                  onChange={(e) => setTermo(e.target.value)}
                  placeholder="Buscar por produto ou código"
                  className="h-11 flex-1 bg-transparent px-3 text-sm text-white placeholder:text-cinza-claro/75 outline-none"
                />
                <button type="submit" aria-label="Buscar" className="grid size-11 place-items-center text-cinza-claro">
                  <Search className="size-5" aria-hidden="true" />
                </button>
              </div>
            </form>

            <ul className="mt-4 space-y-1">
              {CATEGORIAS.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/produtos?categoria=${c.slug}`}
                    onClick={() => setMenu(false)}
                    className="block rounded-md px-3 py-3 text-sm text-cinza-claro hover:bg-borda-escura hover:text-white"
                  >
                    {c.nome}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-borda-escura pt-4 space-y-1">
              <Link href="/pedidos" onClick={() => setMenu(false)} className="block rounded-md px-3 py-3 text-sm text-cinza-claro hover:bg-borda-escura hover:text-white">
                Meus pedidos
              </Link>
              <Link href="/empresa" onClick={() => setMenu(false)} className="block rounded-md px-3 py-3 text-sm text-cinza-claro hover:bg-borda-escura hover:text-white">
                {empresa ? "Minha empresa" : "Entrar com o CNPJ"}
              </Link>
            </div>
          </div>
        )}
      </header>

      <GavetaCarrinho />
    </>
  );
}
