"use client";

import { useEffect, useMemo, useState } from "react";
import { useLoja } from "./estado";
import { montarAtividades, type Atividade } from "./painel";

/**
 * As atividades do painel, já montadas — e só depois da montagem no navegador.
 *
 * O `montado` existe porque as datas vêm de `Date.now()`: renderizar isto no
 * servidor e de novo no navegador daria dois valores e o React acusaria
 * divergência de hidratação. Antes disso a lista vem vazia e a tela mostra o
 * seu próprio «carregando».
 */
export function usarPainel(): { montado: boolean; atividades: Atividade[] } {
  const { pronto, empresa, carrinho, pedidos, eventos, catalogo } = useLoja();
  const [montado, setMontado] = useState(false);

  useEffect(() => { setMontado(true); }, []);

  const atividades = useMemo(
    () =>
      montado && pronto
        ? montarAtividades({ empresa, carrinho, pedidos, eventos }, catalogo)
        : [],
    [montado, pronto, empresa, carrinho, pedidos, eventos, catalogo],
  );

  return { montado: montado && pronto, atividades };
}
