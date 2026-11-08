// ─────────────────────────────────────────────────────────────────────────────
// ⚠ TUDO NESTE ARQUIVO É FICTÍCIO E INVENTADO PARA A DEMONSTRAÇÃO.
//
// Razão social, cidade, comprador, CNPJ, pedido, data: nada aqui corresponde a
// empresa, pessoa ou cliente real. Os nomes são palavras compostas inventadas
// justamente para não bater com nenhuma empresa existente, e o comprador
// aparece só como primeiro nome e inicial.
//
// Os CNPJs são números que PASSAM o dígito verificador — isso é de propósito,
// porque o painel precisa mostrar CNPJ formatado e a tela de cadastro valida o
// dígito. Nenhum deles foi conferido contra a Receita, e nenhum representa
// empresa real.
//
// AS DATAS SÃO RELATIVAS, não fixas: cada registro guarda «há quantos dias», e
// a data só é calculada na hora de mostrar. Assim a demonstração continua
// falando dos últimos 30 dias em qualquer dia que o Diogo abrir, sem ninguém
// precisar reescrever o arquivo.
//
// ⚠ Como a data vem de `Date.now()`, quem renderiza isto tem de ser componente
// de cliente e só depois de montado — servidor e navegador relógios diferentes
// dariam divergência de hidratação.
// ─────────────────────────────────────────────────────────────────────────────

import { PRODUTOS } from "./produtos";

export type ItemExemplo = { codigo: string; quantidade: number };

export type PedidoExemplo = {
  numero: string;
  /** Há quantos dias o pedido entrou. */
  diasAtras: number;
  hora: number;
  status: "Recebido" | "Em separação" | "Faturado" | "Enviado";
  itens: ItemExemplo[];
};

export type EmpresaExemplo = {
  cnpj: string;
  razaoSocial: string;
  cidade: string;
  uf: string;
  comprador: string;
  cargo: string;
  /** Há quantos dias a empresa se cadastrou. */
  clienteDesdeDias: number;
  visitas: number;
  ultimaVisitaDias: number;
  ultimaVisitaHora: number;
  /** Códigos que a empresa abriu — alimenta a tela de oportunidades. */
  vistos: string[];
  /** Carrinho que ficou parado. Vazio quando não há. */
  carrinho: ItemExemplo[];
  pedidos: PedidoExemplo[];
};

/** Converte «há quantos dias, a que hora» em ISO, no momento da chamada. */
export function isoAtras(dias: number, hora = 10, minuto = 0) {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  d.setHours(hora, minuto, 0, 0);
  return d.toISOString();
}

/** Soma pelo preço do catálogo — nenhum total é digitado à mão aqui, para não
 *  existir número que não bate com o produto que ele diz somar. */
export function totalDe(itens: ItemExemplo[]) {
  return itens.reduce((t, i) => {
    const p = PRODUTOS.find((x) => x.codigo === i.codigo);
    return p ? t + p.preco * i.quantidade : t;
  }, 0);
}

export const pecasDe = (itens: ItemExemplo[]) =>
  itens.reduce((t, i) => t + i.quantidade, 0);

export const EMPRESAS: EmpresaExemplo[] = [
  {
    cnpj: "41.827.065/0001-92",
    razaoSocial: "Metalurgica Ferrovante Ltda",
    cidade: "Caxias do Sul", uf: "RS",
    comprador: "Marcelo R.", cargo: "Comprador",
    clienteDesdeDias: 27, visitas: 14,
    ultimaVisitaDias: 0, ultimaVisitaHora: 9,
    vistos: ["CA-BC-M8-12", "CA-BO-CN-16", "CA-DG-M8-01", "CA-PB-M8-01"],
    carrinho: [],
    pedidos: [
      { numero: "2026-0002", diasAtras: 24, hora: 11, status: "Enviado",
        itens: [{ codigo: "CA-BC-M8-12", quantidade: 200 }, { codigo: "CA-BO-CN-16", quantidade: 20 }] },
      { numero: "2026-0007", diasAtras: 9, hora: 15, status: "Faturado",
        itens: [{ codigo: "CA-BC-M8-12", quantidade: 250 }, { codigo: "CA-DG-M8-01", quantidade: 10 }] },
      { numero: "2026-0012", diasAtras: 1, hora: 8, status: "Em separação",
        itens: [{ codigo: "CA-PB-M8-01", quantidade: 6 }, { codigo: "CA-BO-CN-16", quantidade: 15 }] },
    ],
  },
  {
    cnpj: "52.398.147/0001-85",
    razaoSocial: "Implementos Rodocampo Ltda",
    cidade: "Marau", uf: "RS",
    comprador: "Juliana P.", cargo: "Supervisora de manutenção",
    clienteDesdeDias: 22, visitas: 9,
    ultimaVisitaDias: 0, ultimaVisitaHora: 14,
    vistos: ["CA-LT-FR-16", "CA-LT-AR-05", "CA-LT-FR-19"],
    // Carrinho montado e deixado para trás: é a oportunidade mais clara do painel.
    carrinho: [{ codigo: "CA-LT-FR-16", quantidade: 4 }, { codigo: "CA-LT-AR-05", quantidade: 6 }],
    pedidos: [
      { numero: "2026-0005", diasAtras: 16, hora: 10, status: "Enviado",
        itens: [{ codigo: "CA-LT-AR-05", quantidade: 12 }] },
    ],
  },
  {
    cnpj: "61.730.492/0001-65",
    razaoSocial: "Caldeiraria Tubonorte Ltda",
    cidade: "Joinville", uf: "SC",
    comprador: "Anderson L.", cargo: "Comprador técnico",
    clienteDesdeDias: 30, visitas: 21,
    ultimaVisitaDias: 2, ultimaVisitaHora: 16,
    vistos: ["CA-TO-PC-45", "CA-TO-CJ-40", "CA-PR-CF-01", "CA-PR-RO-12", "CA-BC-M8-16"],
    carrinho: [],
    pedidos: [
      { numero: "2026-0003", diasAtras: 23, hora: 9, status: "Enviado",
        itens: [{ codigo: "CA-TO-CJ-40", quantidade: 1 }, { codigo: "CA-BC-M8-16", quantidade: 100 }] },
      { numero: "2026-0009", diasAtras: 6, hora: 13, status: "Faturado",
        itens: [{ codigo: "CA-PR-RO-12", quantidade: 2 }, { codigo: "CA-PR-CF-01", quantidade: 1 }] },
    ],
  },
  {
    cnpj: "74.261.538/0001-96",
    razaoSocial: "Estruturas Vigapar Ltda",
    cidade: "Gravatai", uf: "RS",
    comprador: "Rodrigo M.", cargo: "Encarregado de solda",
    clienteDesdeDias: 19, visitas: 6,
    ultimaVisitaDias: 4, ultimaVisitaHora: 11,
    vistos: ["CA-BC-M6-10", "CA-BO-CL-19", "CA-DG-M6-01"],
    carrinho: [{ codigo: "CA-BC-M6-10", quantidade: 100 }],
    pedidos: [
      { numero: "2026-0006", diasAtras: 13, hora: 14, status: "Enviado",
        itens: [{ codigo: "CA-BC-M6-10", quantidade: 150 }, { codigo: "CA-BO-CL-19", quantidade: 10 }] },
    ],
  },
  {
    cnpj: "83.609.241/0001-60",
    razaoSocial: "Serralheria Barraforte Ltda",
    cidade: "Farroupilha", uf: "RS",
    comprador: "Cleber A.", cargo: "Proprietario",
    clienteDesdeDias: 11, visitas: 4,
    ultimaVisitaDias: 7, ultimaVisitaHora: 17,
    vistos: ["CA-BC-M6-08", "CA-BO-CN-12"],
    carrinho: [],
    pedidos: [
      { numero: "2026-0008", diasAtras: 8, hora: 16, status: "Enviado",
        itens: [{ codigo: "CA-BC-M6-08", quantidade: 50 }, { codigo: "CA-BO-CN-12", quantidade: 8 }] },
    ],
  },
  {
    cnpj: "91.453.876/0001-49",
    razaoSocial: "Montagens Soldaplan Ltda",
    cidade: "Sao Jose dos Pinhais", uf: "PR",
    comprador: "Fernanda S.", cargo: "Compras",
    clienteDesdeDias: 25, visitas: 17,
    ultimaVisitaDias: 1, ultimaVisitaHora: 10,
    vistos: ["CA-DG-IS-01", "CA-PB-M8-CU", "CA-BC-M8-12", "CA-PR-IS-01"],
    carrinho: [],
    pedidos: [
      { numero: "2026-0004", diasAtras: 20, hora: 8, status: "Enviado",
        itens: [{ codigo: "CA-PB-M8-CU", quantidade: 10 }, { codigo: "CA-DG-IS-01", quantidade: 6 }] },
      { numero: "2026-0011", diasAtras: 3, hora: 9, status: "Recebido",
        itens: [{ codigo: "CA-BC-M8-12", quantidade: 300 }, { codigo: "CA-PR-IS-01", quantidade: 4 }] },
    ],
  },
  {
    cnpj: "25.971.403/0001-09",
    razaoSocial: "Fundicao Granitaco Ltda",
    cidade: "Bento Goncalves", uf: "RS",
    comprador: "Tiago B.", cargo: "Planejamento",
    clienteDesdeDias: 15, visitas: 3,
    ultimaVisitaDias: 12, ultimaVisitaHora: 15,
    vistos: ["CA-PR-OR-01", "CA-PR-CF-01"],
    carrinho: [],
    pedidos: [
      { numero: "2026-0001", diasAtras: 47, hora: 10, status: "Enviado",
        itens: [{ codigo: "CA-PR-CF-01", quantidade: 1 }, { codigo: "CA-PR-OR-01", quantidade: 4 }] },
    ],
  },
  {
    cnpj: "36.842.591/0001-91",
    razaoSocial: "Reboques Eixobravo Ltda",
    cidade: "Erechim", uf: "RS",
    comprador: "Paulo H.", cargo: "Comprador",
    clienteDesdeDias: 28, visitas: 11,
    ultimaVisitaDias: 5, ultimaVisitaHora: 13,
    vistos: ["CA-BC-M8-16", "CA-BO-CE-16", "CA-LT-AR-01"],
    carrinho: [{ codigo: "CA-BO-CE-16", quantidade: 12 }, { codigo: "CA-LT-AR-01", quantidade: 4 }],
    pedidos: [
      { numero: "2026-0010", diasAtras: 5, hora: 13, status: "Faturado",
        itens: [{ codigo: "CA-BC-M8-16", quantidade: 200 }] },
    ],
  },
  {
    cnpj: "47.108.625/0001-35",
    razaoSocial: "Usinagem Fresacorte Ltda",
    cidade: "Chapeco", uf: "SC",
    comprador: "Elaine T.", cargo: "Compras",
    clienteDesdeDias: 6, visitas: 2,
    ultimaVisitaDias: 6, ultimaVisitaHora: 11,
    vistos: ["CA-TO-PC-22"],
    carrinho: [],
    pedidos: [],
  },
  {
    cnpj: "58.239.714/0001-37",
    razaoSocial: "Chassis Vigamestre Ltda",
    cidade: "Canoas", uf: "RS",
    comprador: "Everton C.", cargo: "Manutencao",
    clienteDesdeDias: 3, visitas: 5,
    ultimaVisitaDias: 0, ultimaVisitaHora: 16,
    vistos: ["CA-BO-CN-16", "CA-BC-M8-12", "CA-DG-M8-01", "CA-PB-M8-01", "CA-LT-FR-16"],
    carrinho: [{ codigo: "CA-BC-M8-12", quantidade: 400 }, { codigo: "CA-DG-M8-01", quantidade: 20 }],
    pedidos: [],
  },
];
