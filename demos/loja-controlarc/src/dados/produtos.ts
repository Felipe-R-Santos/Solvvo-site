import type { Desenho } from "./categorias";

export type Estoque = "em-estoque" | "sob-consulta" | "indisponivel";

export type Produto = {
  codigo: string;
  slug: string;
  nome: string;
  /** Medida principal, mostrada embaixo do nome como na referência. */
  medida: string;
  material: string;
  /** Sempre genérica: nenhuma marca de tocha ou de consumível. */
  compatibilidade: string;
  categoria: string;
  unidade: string;
  preco: number;
  estoque: Estoque;
  prazo: string;
  maisVendido: boolean;
  desenho: Desenho;
};

// ─────────────────────────────────────────────────────────────────────────────
// FONTE ÚNICA do catálogo. Preço, estoque, nome e categoria moram só aqui.
//
// ⚠ TUDO ILUSTRATIVO. Os preços não vieram da Control: são valores plausíveis
// para a demonstração. A lista real, com código, foto, preço e estoque, tem de
// vir do ERP da Control antes de qualquer uso comercial.
//
// Compatibilidade é descrita por característica técnica (corrente, refrigeração,
// rosca), nunca por marca de fabricante.
// ─────────────────────────────────────────────────────────────────────────────
export const PRODUTOS: Produto[] = [
  // ── Bicos de contato ──────────────────────────────────────────────────────
  {
    codigo: "CA-BC-M6-10", slug: "bico-de-contato-m6-1-0mm",
    nome: "Bico de Contato M6", medida: "1,0 mm", material: "Cobre eletrolítico",
    compatibilidade: "Tochas robóticas refrigeradas a gás, até 300 A",
    categoria: "bicos-de-contato", unidade: "Caixa com 10", preco: 12.9,
    estoque: "em-estoque", prazo: "Pronta entrega", maisVendido: true, desenho: "bico",
  },
  {
    codigo: "CA-BC-M6-08", slug: "bico-de-contato-m6-0-8mm",
    nome: "Bico de Contato M6", medida: "0,8 mm", material: "Cobre eletrolítico",
    compatibilidade: "Tochas robóticas refrigeradas a gás, até 300 A",
    categoria: "bicos-de-contato", unidade: "Caixa com 10", preco: 12.4,
    estoque: "em-estoque", prazo: "Pronta entrega", maisVendido: false, desenho: "bico",
  },
  {
    codigo: "CA-BC-M8-12", slug: "bico-de-contato-m8-1-2mm",
    nome: "Bico de Contato M8", medida: "1,2 mm", material: "CuCrZr",
    compatibilidade: "Tochas robóticas refrigeradas a água, 400 A",
    categoria: "bicos-de-contato", unidade: "Caixa com 10", preco: 18.6,
    estoque: "em-estoque", prazo: "Pronta entrega", maisVendido: true, desenho: "bico",
  },
  {
    codigo: "CA-BC-M8-16", slug: "bico-de-contato-m8-1-6mm",
    nome: "Bico de Contato M8", medida: "1,6 mm", material: "CuCrZr",
    compatibilidade: "Tochas robóticas refrigeradas a água, 500 A",
    categoria: "bicos-de-contato", unidade: "Caixa com 10", preco: 21.3,
    estoque: "sob-consulta", prazo: "3 dias úteis", maisVendido: false, desenho: "bico",
  },

  // ── Bocais ────────────────────────────────────────────────────────────────
  {
    codigo: "CA-BO-CN-16", slug: "bocal-conico-16mm",
    nome: "Bocal Cônico", medida: "Ø 16 mm", material: "Cobre cromado",
    compatibilidade: "Tochas robóticas refrigeradas a água, 400 A",
    categoria: "bocais", unidade: "Unidade", preco: 54.9,
    estoque: "em-estoque", prazo: "Pronta entrega", maisVendido: true, desenho: "bocal",
  },
  {
    codigo: "CA-BO-CL-19", slug: "bocal-cilindrico-19mm",
    nome: "Bocal Cilíndrico", medida: "Ø 19 mm", material: "Cobre cromado",
    compatibilidade: "Tochas robóticas refrigeradas a água, 500 A",
    categoria: "bocais", unidade: "Unidade", preco: 61.5,
    estoque: "em-estoque", prazo: "Pronta entrega", maisVendido: false, desenho: "bocal",
  },
  {
    codigo: "CA-BO-CN-12", slug: "bocal-conico-12mm",
    nome: "Bocal Cônico", medida: "Ø 12 mm", material: "Cobre cromado",
    compatibilidade: "Tochas robóticas refrigeradas a gás, até 300 A",
    categoria: "bocais", unidade: "Unidade", preco: 47.8,
    estoque: "em-estoque", prazo: "Pronta entrega", maisVendido: false, desenho: "bocal",
  },
  {
    codigo: "CA-BO-CE-16", slug: "bocal-ceramico-16mm",
    nome: "Bocal Cerâmico", medida: "Ø 16 mm", material: "Cerâmica técnica",
    compatibilidade: "Soldagem TIG robotizada, até 250 A",
    categoria: "bocais", unidade: "Caixa com 10", preco: 38.4,
    estoque: "sob-consulta", prazo: "7 dias úteis", maisVendido: false, desenho: "bocal",
  },
  // ── Difusores de gás ──────────────────────────────────────────────────────
  {
    codigo: "CA-DG-M8-01", slug: "difusor-de-gas-m8",
    nome: "Difusor de Gás M8", medida: "Rosca M8", material: "Latão",
    compatibilidade: "Tochas robóticas refrigeradas a água, 400 A",
    categoria: "difusores-de-gas", unidade: "Unidade", preco: 29.9,
    estoque: "em-estoque", prazo: "Pronta entrega", maisVendido: true, desenho: "difusor",
  },
  {
    codigo: "CA-DG-M6-01", slug: "difusor-de-gas-m6",
    nome: "Difusor de Gás M6", medida: "Rosca M6", material: "Latão",
    compatibilidade: "Tochas robóticas refrigeradas a gás, até 300 A",
    categoria: "difusores-de-gas", unidade: "Unidade", preco: 26.5,
    estoque: "em-estoque", prazo: "Pronta entrega", maisVendido: false, desenho: "difusor",
  },
  {
    codigo: "CA-DG-IS-01", slug: "difusor-de-gas-isolado",
    nome: "Difusor de Gás Isolado", medida: "Rosca M8", material: "Latão com anel cerâmico",
    compatibilidade: "Tochas robóticas refrigeradas a água, 500 A",
    categoria: "difusores-de-gas", unidade: "Unidade", preco: 42.0,
    estoque: "em-estoque", prazo: "3 dias úteis", maisVendido: false, desenho: "difusor",
  },

  // ── Porta-bicos ───────────────────────────────────────────────────────────
  {
    codigo: "CA-PB-M6-01", slug: "porta-bico-m6",
    nome: "Porta-Bico M6", medida: "Rosca M6", material: "Latão niquelado",
    compatibilidade: "Tochas robóticas refrigeradas a gás, até 300 A",
    categoria: "porta-bicos", unidade: "Unidade", preco: 34.7,
    estoque: "em-estoque", prazo: "Pronta entrega", maisVendido: false, desenho: "porta-bico",
  },
  {
    codigo: "CA-PB-M8-01", slug: "porta-bico-m8",
    nome: "Porta-Bico M8", medida: "Rosca M8", material: "Latão niquelado",
    compatibilidade: "Tochas robóticas refrigeradas a água, 400 A",
    categoria: "porta-bicos", unidade: "Unidade", preco: 39.9,
    estoque: "em-estoque", prazo: "Pronta entrega", maisVendido: true, desenho: "porta-bico",
  },
  {
    codigo: "CA-PB-M8-CU", slug: "porta-bico-m8-reforcado",
    nome: "Porta-Bico M8 Reforçado", medida: "Rosca M8", material: "Cobre cromado",
    compatibilidade: "Tochas robóticas refrigeradas a água, 500 A",
    categoria: "porta-bicos", unidade: "Unidade", preco: 52.3,
    estoque: "sob-consulta", prazo: "5 dias úteis", maisVendido: false, desenho: "porta-bico",
  },
  // ── Limpeza de tocha ──────────────────────────────────────────────────────
  {
    codigo: "CA-LT-FR-16", slug: "fresa-de-limpeza-16mm",
    nome: "Fresa de Limpeza", medida: "Ø 16 mm", material: "Aço rápido",
    compatibilidade: "Estações de limpeza de bocal, acionamento pneumático",
    categoria: "limpeza-de-tocha", unidade: "Unidade", preco: 186.0,
    estoque: "em-estoque", prazo: "Pronta entrega", maisVendido: false, desenho: "fresa",
  },
  {
    codigo: "CA-LT-FR-19", slug: "fresa-de-limpeza-19mm",
    nome: "Fresa de Limpeza", medida: "Ø 19 mm", material: "Aço rápido",
    compatibilidade: "Estações de limpeza de bocal, acionamento pneumático",
    categoria: "limpeza-de-tocha", unidade: "Unidade", preco: 198.5,
    estoque: "sob-consulta", prazo: "10 dias úteis", maisVendido: false, desenho: "fresa",
  },
  {
    codigo: "CA-LT-AR-05", slug: "antirrespingo-5l",
    nome: "Líquido Antirrespingo", medida: "Galão 5 L", material: "Base aquosa, sem silicone",
    compatibilidade: "Estações de limpeza por imersão e pulverização",
    categoria: "limpeza-de-tocha", unidade: "Galão 5 L", preco: 148.9,
    estoque: "em-estoque", prazo: "Pronta entrega", maisVendido: true, desenho: "antirrespingo",
  },
  {
    codigo: "CA-LT-AR-01", slug: "antirrespingo-1l",
    nome: "Líquido Antirrespingo", medida: "Frasco 1 L", material: "Base aquosa, sem silicone",
    compatibilidade: "Aplicação manual e estações de pulverização",
    categoria: "limpeza-de-tocha", unidade: "Caixa com 6", preco: 42.6,
    estoque: "em-estoque", prazo: "Pronta entrega", maisVendido: false, desenho: "antirrespingo",
  },

  // ── Tochas ────────────────────────────────────────────────────────────────
  {
    codigo: "CA-TO-PC-45", slug: "pescoco-de-tocha-45",
    nome: "Pescoço de Tocha 45 graus", medida: "45 graus", material: "Latão com isolação cerâmica",
    compatibilidade: "Tochas robóticas refrigeradas a água, 400 A",
    categoria: "tochas", unidade: "Unidade", preco: 1240.0,
    estoque: "sob-consulta", prazo: "15 dias úteis", maisVendido: false, desenho: "tocha",
  },
  {
    codigo: "CA-TO-PC-22", slug: "pescoco-de-tocha-22",
    nome: "Pescoço de Tocha 22 graus", medida: "22 graus", material: "Latão com isolação cerâmica",
    compatibilidade: "Tochas robóticas refrigeradas a água, 500 A",
    categoria: "tochas", unidade: "Unidade", preco: 1385.0,
    estoque: "sob-consulta", prazo: "15 dias úteis", maisVendido: false, desenho: "tocha",
  },
  {
    codigo: "CA-TO-CJ-40", slug: "conjunto-de-tocha-400a",
    nome: "Conjunto de Tocha Robótica", medida: "400 A", material: "Conjunto montado",
    compatibilidade: "Montagem em punho de robô, refrigeração a água",
    categoria: "tochas", unidade: "Unidade", preco: 4890.0,
    estoque: "indisponivel", prazo: "Sob programação", maisVendido: false, desenho: "tocha",
  },
  // ── Peças de reposição ────────────────────────────────────────────────────
  {
    codigo: "CA-PR-CF-01", slug: "conduite-de-arame-3m",
    nome: "Conduíte de Arame", medida: "3 m · 1,0 a 1,2 mm", material: "Aço espiralado",
    compatibilidade: "Alimentadores de arame de tocha robótica",
    categoria: "pecas-de-reposicao", unidade: "Unidade", preco: 96.4,
    estoque: "em-estoque", prazo: "Pronta entrega", maisVendido: false, desenho: "reposicao",
  },
  {
    codigo: "CA-PR-RO-12", slug: "roldana-de-tracao-12",
    nome: "Roldana de Tração", medida: "1,2 mm", material: "Aço temperado",
    compatibilidade: "Alimentadores de arame de quatro roldanas",
    categoria: "pecas-de-reposicao", unidade: "Par", preco: 128.0,
    estoque: "em-estoque", prazo: "3 dias úteis", maisVendido: false, desenho: "reposicao",
  },
  {
    codigo: "CA-PR-IS-01", slug: "isolador-de-bocal",
    nome: "Isolador de Bocal", medida: "Padrão 400 A", material: "Cerâmica técnica",
    compatibilidade: "Tochas robóticas refrigeradas a água, 400 A",
    categoria: "pecas-de-reposicao", unidade: "Caixa com 5", preco: 58.2,
    estoque: "em-estoque", prazo: "Pronta entrega", maisVendido: false, desenho: "reposicao",
  },
  {
    codigo: "CA-PR-OR-01", slug: "kit-de-aneis-de-vedacao",
    nome: "Kit de Anéis de Vedação", medida: "Sortido", material: "Elastômero fluorado",
    compatibilidade: "Circuito de refrigeração de tocha robótica",
    categoria: "pecas-de-reposicao", unidade: "Kit", preco: 73.5,
    estoque: "indisponivel", prazo: "Sob programação", maisVendido: false, desenho: "reposicao",
  },
];

export const produtoPorSlug = (slug: string) =>
  PRODUTOS.find((p) => p.slug === slug);

export const produtoPorCodigo = (codigo: string) =>
  PRODUTOS.find((p) => p.codigo === codigo);

export const ROTULO_ESTOQUE: Record<Estoque, string> = {
  "em-estoque": "Em estoque",
  "sob-consulta": "Sob consulta",
  "indisponivel": "Indisponível",
};

/** Pedido mínimo ilustrativo. Precisa do valor real da Control. */
export const PEDIDO_MINIMO = 150;
