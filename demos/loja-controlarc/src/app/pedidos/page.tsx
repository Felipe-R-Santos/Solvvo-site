import type { Metadata } from "next";
import { Pedidos } from "./pedidos";

export const metadata: Metadata = {
  title: "Meus pedidos",
  description: "Histórico de pedidos enviados pela empresa.",
};

export default function PaginaPedidos() {
  return <Pedidos />;
}
