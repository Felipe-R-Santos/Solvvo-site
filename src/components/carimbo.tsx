// ─────────────────────────────────────────────────────────────────────────────
// CARIMBO DE PRANCHA
//
// A faixa do rodapé no padrão do carimbo de um desenho técnico: identificação à
// esquerda, revisão e data à direita, monoespaçado, separado do resto por uma
// régua. É o detalhe que amarra a linguagem visual do site à do documento que o
// cliente recebe.
//
// Componente compartilhado, e não texto repetido em cada rodapé, porque ele
// aparece na home e na política de privacidade. Duas cópias divergiriam na
// primeira vez que a revisão mudasse — a armadilha de sinônimo da regra 1.5.
//
// REVISAO e ANO são literais de propósito: vêm escritos assim no brief. Não use
// new Date() aqui — a data do carimbo é a da revisão do documento, não a do dia
// em que a página foi aberta, e um ano que anda sozinho enquanto a revisão fica
// parada é justamente o tipo de número sem procedência que este site combate.
// ─────────────────────────────────────────────────────────────────────────────

const IDENTIFICACAO = 'SOLVVO SOLUTIONS · CAXIAS DO SUL RS'
const REVISAO = 'REV. 02 · 2026'

export function Carimbo() {
  return (
    <div className="border-t border-sv-line mt-8 pt-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.09em] text-sv-text-3">
          {IDENTIFICACAO}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.09em] text-sv-text-3">
          {REVISAO}
        </span>
      </div>
    </div>
  )
}
