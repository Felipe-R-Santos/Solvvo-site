import { ROTULO_ESTOQUE, type Estoque } from "@/dados/produtos";

// As três cores de estoque moram aqui, e só aqui. Repetir esse mapa em cada
// tela é como «Sob consulta» acaba verde numa página e âmbar na outra.
const COR: Record<Estoque, string> = {
  "em-estoque": "bg-estoque-ok/20 text-estoque-ok border-estoque-ok/40",
  "sob-consulta": "bg-estoque-consulta/20 text-estoque-consulta border-estoque-consulta/40",
  "indisponivel": "bg-estoque-fora/10 text-estoque-fora border-estoque-fora/30",
};

export function SeloEstoque({ estoque }: { estoque: Estoque }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${COR[estoque]}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {ROTULO_ESTOQUE[estoque]}
    </span>
  );
}
