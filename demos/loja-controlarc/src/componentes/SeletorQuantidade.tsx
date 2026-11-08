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
  /** `claro` para o cartão de produto, que é branco. */
  fundo?: "escuro" | "claro";
};

export function SeletorQuantidade({
  valor, mudar, minimo = 1, rotulo, compacto = false, fundo = "escuro",
}: Props) {
  const lado = compacto ? "h-11 w-11" : "h-12 w-12";
  const campo = compacto ? "h-11 w-14" : "h-12 w-16";
  const claro = fundo === "claro";
  const moldura = claro
    ? "border-quase-negro/25 bg-white"
    : "border-borda-escura bg-cartao-escuro";
  const botao = claro
    ? "text-quase-negro hover:bg-quase-negro/10"
    : "text-cinza-claro hover:bg-borda-escura";
  const texto = claro
    ? "text-quase-negro border-quase-negro/25"
    : "text-white border-borda-escura";

  return (
    <div className={`inline-flex items-stretch overflow-hidden rounded-md border ${moldura}`}>
      <button
        type="button"
        onClick={() => mudar(Math.max(minimo, valor - 1))}
        disabled={valor <= minimo}
        aria-label={`Diminuir a quantidade de ${rotulo}`}
        className={`${lado} ${botao} grid place-items-center disabled:opacity-40 disabled:hover:bg-transparent`}
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
        className={`${campo} ${texto} border-x bg-transparent text-center font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
      />

      <button
        type="button"
        onClick={() => mudar(valor + 1)}
        aria-label={`Aumentar a quantidade de ${rotulo}`}
        className={`${lado} ${botao} grid place-items-center`}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
