"use client";

import { useEffect } from "react";
import { useLoja, } from "@/lib/estado";
import type { TipoEvento } from "@/lib/eventos";

/** Registra um evento quando a tela aparece. Fica em componente próprio para
 *  as páginas continuarem sendo de servidor. */
export function RegistrarVisita({
  tipo = "visita", detalhe,
}: { tipo?: TipoEvento; detalhe?: string }) {
  const { pronto, registrar } = useLoja();
  useEffect(() => {
    if (pronto) registrar(tipo, detalhe);
  }, [pronto, registrar, tipo, detalhe]);
  return null;
}
