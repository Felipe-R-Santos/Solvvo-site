import Link from "next/link";
import { CATEGORIAS, NOME_CURTO } from "@/dados/categorias";
import { PRODUTOS } from "@/dados/produtos";
import { DesenhoPeca } from "./DesenhoPeca";

// A contagem sai do catálogo, não de número escrito à mão: categoria que
// ganha produto passa a dizer a verdade sozinha.
const quantos = (slug: string) =>
  PRODUTOS.filter((p) => p.categoria === slug).length;

export function Categorias() {
  return (
    <section aria-labelledby="titulo-categorias">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="titulo-categorias" className="text-2xl font-extrabold text-white sm:text-3xl">
          Categorias
        </h2>
        <Link href="/produtos" className="inline-block py-1 text-sm font-medium text-laranja-texto hover:underline">
          Ver tudo
        </Link>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORIAS.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/produtos?categoria=${c.slug}`}
              className="group flex h-full flex-col items-center gap-3 rounded-lg border border-borda-escura bg-cartao-escuro p-4 text-center hover:border-laranja"
            >
              <DesenhoPeca
                desenho={c.desenho}
                className="size-16 text-cinza-claro/80 transition-colors group-hover:text-laranja-texto"
              />
              <span className="text-sm font-bold leading-tight text-white">
                {NOME_CURTO[c.slug] ?? c.nome}
              </span>
              <span className="mt-auto text-xs text-cinza-claro/60">
                {quantos(c.slug)} {quantos(c.slug) === 1 ? "item" : "itens"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
