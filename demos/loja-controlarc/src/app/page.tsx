import Link from "next/link";
import { ShieldCheck, Truck, Clock } from "lucide-react";
import { Banner } from "@/componentes/Banner";
import { Categorias } from "@/componentes/Categorias";
import { CartaoProduto } from "@/componentes/CartaoProduto";
import { RegistrarVisita } from "@/componentes/RegistrarVisita";
import { PRODUTOS } from "@/dados/produtos";

const MAIS_VENDIDOS = PRODUTOS.filter((p) => p.maisVendido);

const COMO = [
  {
    Icone: ShieldCheck,
    titulo: "Pedido pelo CNPJ",
    texto: "Sem cartão e sem cadastro de pessoa física. A empresa se identifica pelo CNPJ e o pedido fica no nome dela.",
  },
  {
    Icone: Clock,
    titulo: "Confirmação com prazo",
    texto: "O pedido chega à Control ARC e volta com prazo de entrega e condição de pagamento antes de qualquer cobrança.",
  },
  {
    Icone: Truck,
    titulo: "Frete combinado",
    texto: "O frete não entra no total da tela: é calculado para o seu endereço e informado na confirmação.",
  },
];

export default function Inicio() {
  return (
    <>
      <RegistrarVisita />
      <Banner />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Categorias />

        <section className="mt-16" aria-labelledby="titulo-mais-vendidos">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="titulo-mais-vendidos" className="text-2xl font-extrabold text-white sm:text-3xl">
              Mais vendidos
            </h2>
            <Link href="/produtos" className="inline-block py-1 text-sm font-medium text-laranja-texto hover:underline">
              Ver o catálogo
            </Link>
          </div>
          <p className="mt-2 text-sm text-cinza-claro/70">
            Os itens de reposição que mais saem — e que vale manter em estoque na
            sua célula.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MAIS_VENDIDOS.map((p) => (
              <CartaoProduto key={p.codigo} produto={p} />
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="titulo-como">
          <h2 id="titulo-como" className="text-2xl font-extrabold text-white sm:text-3xl">
            Como o pedido funciona
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {COMO.map(({ Icone, titulo, texto }) => (
              <li
                key={titulo}
                className="rounded-lg border border-borda-escura bg-cartao-escuro p-5"
              >
                <Icone className="size-6 text-laranja-texto" aria-hidden="true" />
                <h3 className="mt-3 font-bold text-white">{titulo}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-cinza-claro/80">{texto}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
