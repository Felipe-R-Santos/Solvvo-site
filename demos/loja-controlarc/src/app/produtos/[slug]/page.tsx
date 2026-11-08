import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUTOS, produtoPorSlug } from "@/dados/produtos";
import { Detalhe } from "./detalhe";

// Catálogo fixo em arquivo: dá para gerar as 25 páginas no build e servir cada
// uma como HTML pronto, sem rodar nada no servidor.
export function generateStaticParams() {
  return PRODUTOS.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const produto = produtoPorSlug(slug);
  if (!produto) return { title: "Produto não encontrado" };
  return {
    title: `${produto.nome} ${produto.medida}`,
    description: `${produto.nome} ${produto.medida} — ${produto.material}. ${produto.compatibilidade}. Código ${produto.codigo}.`,
  };
}

export default async function PaginaProduto({ params }: Props) {
  const { slug } = await params;
  const produto = produtoPorSlug(slug);
  if (!produto) notFound();
  return <Detalhe slug={produto.slug} />;
}
