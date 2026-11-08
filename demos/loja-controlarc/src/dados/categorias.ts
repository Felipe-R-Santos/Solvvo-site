export type Categoria = {
  slug: string;
  nome: string;
  /** Qual ilustração representa a categoria na fileira da página inicial. */
  desenho: Desenho;
};

/** Os oito desenhos em SVG que existem. Ver componentes/DesenhoPeca.tsx. */
export type Desenho =
  | "bico"
  | "bocal"
  | "difusor"
  | "porta-bico"
  | "fresa"
  | "antirrespingo"
  | "tocha"
  | "reposicao";

// ⚠ «Limpeza de tocha» é NOME A CONFIRMAR COM O DIOGO. Ele escreveu «dados de
// limpeza» e a imagem de referência dele diz «Dedeiras de Limpeza». Nenhum dos
// dois é termo corrente; ficou «Limpeza de tocha» até ele decidir.
export const CATEGORIAS: Categoria[] = [
  { slug: "bicos-de-contato", nome: "Bicos de contato", desenho: "bico" },
  { slug: "bocais", nome: "Bocais", desenho: "bocal" },
  { slug: "difusores-de-gas", nome: "Difusores de gás", desenho: "difusor" },
  { slug: "porta-bicos", nome: "Porta-bicos", desenho: "porta-bico" },
  { slug: "limpeza-de-tocha", nome: "Limpeza de tocha — fresas e antirrespingo", desenho: "fresa" },
  { slug: "tochas", nome: "Tochas", desenho: "tocha" },
  { slug: "pecas-de-reposicao", nome: "Peças de reposição", desenho: "reposicao" },
];

export const porSlug = (slug: string) => CATEGORIAS.find((c) => c.slug === slug);

/** Nome curto para a fileira de cartões, onde o nome longo não cabe. */
export const NOME_CURTO: Record<string, string> = {
  "bicos-de-contato": "Bicos de contato",
  "bocais": "Bocais",
  "difusores-de-gas": "Difusores",
  "porta-bicos": "Porta-bicos",
  "limpeza-de-tocha": "Limpeza de tocha",
  "tochas": "Tochas",
  "pecas-de-reposicao": "Reposição",
};
