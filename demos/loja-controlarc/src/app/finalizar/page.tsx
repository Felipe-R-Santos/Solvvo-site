import type { Metadata } from "next";
import { Finalizar } from "./finalizar";

export const metadata: Metadata = {
  title: "Finalizar pedido",
  description: "Revise os itens, confirme os dados e envie o pedido.",
};

export default function PaginaFinalizar() {
  return <Finalizar />;
}
