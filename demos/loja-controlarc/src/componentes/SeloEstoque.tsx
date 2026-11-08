import { ROTULO_ESTOQUE, type Estoque } from "@/dados/produtos";

// As cores de estoque moram aqui, e só aqui. Repetir esse mapa em cada tela é
// como «Sob consulta» acaba verde numa página e âmbar na outra.
//
// ⚠ SÃO DOIS CONJUNTOS, um para cada fundo. O cartão de produto é branco e as
// outras telas são escuras; um tom só não passa em contraste nos dois.
const ESCURO: Record<Estoque, string> = {
  "em-estoque": "bg-estoque-ok/20 text-estoque-ok border-estoque-ok/40",
  "sob-consulta": "bg-estoque-consulta/20 text-estoque-consulta border-estoque-consulta/40",
  "indisponivel": "bg-estoque-fora/10 text-estoque-fora border-estoque-fora/30",
};

const CLARO: Record<Estoque, string> = {
  "em-estoque": "bg-estoque-ok-claro/10 text-estoque-ok-claro border-estoque-ok-claro/30",
  "sob-consulta": "bg-estoque-consulta-claro/10 text-estoque-consulta-claro border-estoque-consulta-claro/30",
  "indisponivel": "bg-estoque-fora-claro/10 text-estoque-fora-claro border-estoque-fora-claro/30",
};

export function SeloEstoque({
  estoque, fundo = "escuro",
}: { estoque: Estoque; fundo?: "escuro" | "claro" }) {
  const cor = (fundo === "claro" ? CLARO : ESCURO)[estoque];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cor}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {ROTULO_ESTOQUE[estoque]}
    </span>
  );
}
