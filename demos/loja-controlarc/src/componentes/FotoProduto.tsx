import Image from "next/image";
import type { Produto } from "@/dados/produtos";
import { DesenhoPeca } from "./DesenhoPeca";

// ─────────────────────────────────────────────────────────────────────────────
// A FOTO DO PRODUTO.
//
// São renders feitos no Blender a partir das medidas do próprio catálogo, em
// cena de estúdio única: fundo branco, mesma luz e MESMO ÂNGULO nas 25 peças.
// Ver `scripts/render_produtos.py`.
//
// Por que render e não foto de banco de imagens: banco mostraria peça de outro
// fabricante, com a marca dele à vista. Aqui não há marca nenhuma.
//
// ⚠ O DESENHO DE LINHA CONTINUA SENDO O RESERVA. Produto cujo arquivo ainda
// não foi gerado cai na silhueta em vez de mostrar quadrado vazio — é o que
// permite acrescentar item ao catálogo antes de renderizar a peça dele.
// ─────────────────────────────────────────────────────────────────────────────

/** Os códigos que já têm render. Lista explícita para o reserva funcionar sem
 *  pedir o arquivo ao servidor e levar 404 no console. */
const COM_FOTO = new Set<string>([
  "CA-BC-M6-10", "CA-BC-M6-08", "CA-BC-M8-12", "CA-BC-M8-16",
  "CA-BO-CN-16", "CA-BO-CL-19", "CA-BO-CN-12", "CA-BO-CE-16",
  "CA-DG-M8-01", "CA-DG-M6-01", "CA-DG-IS-01",
  "CA-PB-M6-01", "CA-PB-M8-01", "CA-PB-M8-CU",
  "CA-LT-FR-16", "CA-LT-FR-19", "CA-LT-AR-05", "CA-LT-AR-01",
  "CA-TO-PC-45", "CA-TO-PC-22", "CA-TO-CJ-40",
  "CA-PR-CF-01", "CA-PR-RO-12", "CA-PR-IS-01", "CA-PR-OR-01",
]);

type Props = {
  produto: Produto;
  /** `cartao` usa o arquivo de 600 px; `pagina`, o de 1200. */
  tamanho?: "cartao" | "pagina" | "miniatura";
  className?: string;
  prioridade?: boolean;
};

const LADO = { miniatura: 600, cartao: 600, pagina: 1200 } as const;

export function FotoProduto({
  produto, tamanho = "cartao", className = "", prioridade = false,
}: Props) {
  if (!COM_FOTO.has(produto.codigo)) {
    return (
      <DesenhoPeca
        desenho={produto.desenho}
        className={className || "size-full text-quase-negro/70"}
      />
    );
  }

  const arquivo =
    tamanho === "pagina"
      ? `/produtos/${produto.codigo}.webp`
      : `/produtos/${produto.codigo}-600.webp`;

  return (
    <Image
      src={arquivo}
      alt={`${produto.nome} ${produto.medida}`}
      width={LADO[tamanho]}
      height={LADO[tamanho]}
      priority={prioridade}
      className={className}
    />
  );
}
