import type { Metadata } from "next";
import { PaginaCarrinho } from "./carrinho";

export const metadata: Metadata = {
  title: "Carrinho",
  description: "Itens selecionados para o pedido.",
};

export default function Carrinho() {
  return <PaginaCarrinho />;
}
