// ─────────────────────────────────────────────────────────────────────────────
// A FAIXA QUE DIZ QUE ISTO É DEMONSTRAÇÃO.
//
// Fica no topo de TODA página e não fecha. A loja parece de verdade: preço,
// estoque, pedido, painel. Alguém que receba o link sem contexto pode achar que
// está comprando. A faixa é o que impede esse mal-entendido, e por isso não tem
// botão de dispensar — fechar seria justamente perder o aviso em quem mais
// precisa dele.
// ─────────────────────────────────────────────────────────────────────────────

export function FaixaDemonstracao() {
  return (
    <div className="bg-laranja-escuro text-white text-center text-xs sm:text-sm font-medium px-4 py-2 leading-snug">
      <span className="font-bold uppercase tracking-wide">Demonstração</span>
      {" · "}
      Catálogo, preços e estoque são ilustrativos. Nenhum pedido é enviado e
      nenhum dado sai deste navegador.
    </div>
  );
}
