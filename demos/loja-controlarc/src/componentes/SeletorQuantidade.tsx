"use client";

import { Minus, Plus } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// − [ 12 ] +  — o seletor de quantidade.
//
// O campo aceita digitar: quem compra 400 bicos não vai clicar 400 vezes. Valor
// vazio ou não numérico volta para o mínimo em vez de virar NaN e sumir com o
// subtotal da linha.
//
// Os botões têm 44 px de lado, o mínimo para toque; o campo tem rótulo próprio
// por `aria-label`, senão o leitor de tela anuncia só um número solto.
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  valor: number;
  mudar: (n: number) => void;
  minimo?: number;
  rotulo: string;
  compacto?: boolean;
};

export function SeletorQuantidade({
  valor, mudar, minimo = 1, rotulo, compacto = false,
}: Props) {
  const lado = compacto ? "h-11 w-11" : "h-12 w-12";
  const campo = compacto ? "h-11 w-14" : "h-12 w-16";

  return (
    <div className="inline-flex items-stretch rounded-md border border-borda-escura bg-cartao-escuro overflow-hidden">
      <button
        type="button"
        onClick={() => mudar(Math.max(minimo, valor - 1))}
        disabled={valor <= minimo}
        aria-label={`Diminuir a quantidade de ${rotulo}`}
        className={`${lado} grid place-items-center text-cinza-claro hover:bg-borda-escura disabled:opacity-40 disabled:hover:bg-transparent`}
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>

      <input
        type="number"
        inputMode="numeric"
        min={minimo}
        value={valor}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          mudar(Number.isFinite(n) && n >= minimo ? n : minimo);
        }}
        aria-label={`Quantidade de ${rotulo}`}
        className={`${campo} bg-transparent text-center text-white font-medium border-x border-borda-escura [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
      />

      <button
        type="button"
        onClick={() => mudar(valor + 1)}
        aria-label={`Aumentar a quantidade de ${rotulo}`}
        className={`${lado} grid place-items-center text-cinza-claro hover:bg-borda-escura`}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
