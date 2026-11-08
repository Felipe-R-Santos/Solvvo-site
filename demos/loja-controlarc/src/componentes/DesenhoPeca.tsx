// ─────────────────────────────────────────────────────────────────────────────
// OS DESENHOS DAS PEÇAS — oito figuras em SVG, desenhadas aqui.
//
// POR QUE DESENHO E NÃO FOTO: não existe foto dos produtos da Control
// disponível para esta demonstração, e foto de banco de imagens mostraria peça
// de outro fabricante com a marca dele à vista. Desenho de linha diz a forma da
// peça sem afirmar de quem ela é — e é honesto quanto a ser ilustração.
//
// ⚠ SÃO ESQUEMAS, NÃO DESENHO TÉCNICO. Nenhuma proporção aqui é cotada nem
// corresponde a dimensão real. Quando o catálogo real entrar, estes desenhos
// saem e as fotos entram.
//
// `aria-hidden` em todos: o nome do produto está ao lado, em texto. Figura
// decorativa anunciada por leitor de tela só repete o que já foi lido.
// ─────────────────────────────────────────────────────────────────────────────

import type { Desenho } from "@/dados/categorias";

type Props = { desenho: Desenho; className?: string };

const COMUM = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// Cada figura é desenhada dentro de 0 0 120 120, mas ocupa só uma faixa dele —
// um bico é comprido e baixo, um frasco é alto e estreito. Se todas usassem a
// caixa inteira, o bico apareceria como um risco no meio de um quadrado vazio.
// Por isso cada uma declara a SUA caixa, com uma folga pequena em volta.
const CAIXA: Record<Desenho, string> = {
  bico: "16 40 82 40",
  bocal: "20 36 78 48",
  difusor: "24 38 74 44",
  "porta-bico": "18 38 80 44",
  fresa: "16 36 82 48",
  antirrespingo: "38 16 60 86",
  tocha: "4 44 94 46",
  reposicao: "24 34 82 52",
};

/** Cada figura é desenhada deitada, como num catálogo de peça. */
const FIGURAS: Record<Desenho, React.ReactNode> = {
  // Bico de contato: corpo longo, assento cônico e o furo de passagem do arame.
  bico: (
    <>
      <path {...COMUM} d="M22 46h18v28H22z" />
      <path {...COMUM} d="M40 48h34l16 8-16 8H40z" />
      <path {...COMUM} d="M40 72h34l16-8" />
      <path {...COMUM} d="M90 56v8" />
      <path {...COMUM} d="M26 46v28M31 46v28M36 46v28" strokeWidth={1} />
      <circle cx="90" cy="60" r="2.5" fill="currentColor" stroke="none" />
    </>
  ),
  // Bocal: tronco de cone, com a parede interna à vista.
  bocal: (
    <>
      <path {...COMUM} d="M26 42h22v36H26z" />
      <path {...COMUM} d="M48 44l44 10v12L48 76z" />
      <path {...COMUM} d="M48 52l44 6M48 68l44-6" strokeWidth={1} />
      <path {...COMUM} d="M30 42v36M35 42v36" strokeWidth={1} />
    </>
  ),
  // Difusor de gás: cilindro com os furos radiais de saída.
  difusor: (
    <>
      <path {...COMUM} d="M30 44h44v32H30z" />
      <path {...COMUM} d="M74 50h14v20H74z" />
      <path {...COMUM} d="M34 44v32M39 44v32" strokeWidth={1} />
      <circle cx="52" cy="44" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="62" cy="44" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="52" cy="76" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="62" cy="76" r="2.5" fill="currentColor" stroke="none" />
      <path {...COMUM} d="M88 54v12" />
    </>
  ),
  // Porta-bico: rosca de um lado, assento do bico do outro, com o ombro no meio.
  "porta-bico": (
    <>
      <path {...COMUM} d="M24 50h26v20H24z" />
      <path {...COMUM} d="M50 44h10v32H50z" />
      <path {...COMUM} d="M60 52h32v16H60z" />
      <path {...COMUM} d="M28 50v20M33 50v20M38 50v20" strokeWidth={1} />
      <path {...COMUM} d="M66 52v16M74 52v16M82 52v16" strokeWidth={1} />
    </>
  ),
  // Fresa de limpeza: corpo cilíndrico e os dentes de corte na ponta.
  fresa: (
    <>
      <path {...COMUM} d="M22 52h30v16H22z" />
      <path {...COMUM} d="M52 42h30v36H52z" />
      <path {...COMUM} d="M82 46l10 6-10 6M82 58l10 6-10 6" />
      <path {...COMUM} d="M58 42v36M66 42v36M74 42v36" strokeWidth={1} />
    </>
  ),
  // Antirrespingo: frasco com o gatilho e a névoa saindo.
  antirrespingo: (
    <>
      <path {...COMUM} d="M44 48h24v44a4 4 0 0 1-4 4H48a4 4 0 0 1-4-4z" />
      <path {...COMUM} d="M50 48V38h12v10" />
      <path {...COMUM} d="M62 30h10M62 30v8" />
      <path {...COMUM} d="M80 26l6-4M84 32h8M80 38l6 4" strokeWidth={1.5} />
      <path {...COMUM} d="M44 66h24" strokeWidth={1} />
    </>
  ),
  // Tocha robótica: pescoço curvo, corpo e o cabo saindo por trás.
  tocha: (
    <>
      <path {...COMUM} d="M20 54h34v14H20z" />
      <path {...COMUM} d="M54 50h16v22H54z" />
      <path {...COMUM} d="M70 56c10 0 14 6 18 14" />
      <path {...COMUM} d="M70 66c6 0 9 4 12 10" />
      <path {...COMUM} d="M86 68l6 14-10 2z" />
      <path {...COMUM} d="M20 61H10" strokeWidth={3} />
    </>
  ),
  // Peça de reposição: suporte com os furos de fixação e um parafuso ao lado.
  reposicao: (
    <>
      <path {...COMUM} d="M30 40h40v12H42v28H30z" />
      <circle cx="36" cy="46" r="3" />
      <circle cx="64" cy="46" r="3" />
      <circle cx="36" cy="74" r="3" />
      <path {...COMUM} d="M78 46h8v6h-8z" />
      <path {...COMUM} d="M86 48h14v2H86z" />
    </>
  ),
};

export function DesenhoPeca({ desenho, className = "" }: Props) {
  return (
    <svg
      viewBox={CAIXA[desenho]}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {FIGURAS[desenho]}
    </svg>
  );
}
