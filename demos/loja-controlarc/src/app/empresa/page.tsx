import type { Metadata } from "next";
import { MinhaEmpresa } from "./empresa";

export const metadata: Metadata = {
  title: "Minha empresa",
  description: "Dados cadastrais usados nos pedidos.",
};

export default function PaginaEmpresa() {
  return <MinhaEmpresa />;
}
