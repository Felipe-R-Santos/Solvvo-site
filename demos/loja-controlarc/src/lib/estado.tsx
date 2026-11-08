"use client";

import {
  createContext, useContext, useEffect, useMemo, useState, useCallback,
  type ReactNode,
} from "react";
import { PRODUTOS, type Produto } from "@/dados/produtos";
import { CHAVES, ler, gravar, limparTudo } from "./armazenamento";
import { MINUTOS_ABANDONO, type Evento, type TipoEvento } from "./eventos";
import type { ItemCarrinho } from "./carrinho";

export type Empresa = {
  cnpj: string;
  razaoSocial: string;
  comprador: string;
  cargo: string;
  email: string;
  whatsapp: string;
  desde: string;
};

export type StatusPedido = "Recebido" | "Em separação" | "Faturado" | "Enviado";

export const STATUS: StatusPedido[] = ["Recebido", "Em separação", "Faturado", "Enviado"];

export type LinhaPedido = {
  codigo: string; nome: string; medida: string;
  quantidade: number; preco: number;
};

export type Pedido = {
  numero: string;
  quando: string;
  itens: LinhaPedido[];
  total: number;
  status: StatusPedido;
  pagamento: string;
  pedidoCompra: string;
  observacoes: string;
  endereco: string;
};

/** O que o painel pode sobrescrever num produto, guardado no navegador. */
export type Sobrescrita = Partial<Pick<Produto, "preco" | "estoque" | "prazo" | "maisVendido">>;

type Loja = {
  pronto: boolean;
  empresa: Empresa | null;
  carrinho: ItemCarrinho[];
  pedidos: Pedido[];
  eventos: Evento[];
  sobrescritas: Record<string, Sobrescrita>;
  atendidos: string[];
  catalogo: Produto[];
  /** A gaveta do carrinho mora no estado global porque dois lugares a abrem:
   *  o botão do cabeçalho e o da barra inferior do celular. */
  gaveta: boolean;

  cadastrar: (e: Omit<Empresa, "desde">) => void;
  sair: () => void;
  adicionar: (codigo: string, quantidade: number) => void;
  mudarQuantidade: (codigo: string, quantidade: number) => void;
  remover: (codigo: string) => void;
  esvaziar: () => void;
  criarPedido: (d: Omit<Pedido, "numero" | "quando" | "itens" | "total" | "status">) => Pedido | null;
  repetirPedido: (numero: string) => void;
  mudarStatus: (numero: string, status: StatusPedido) => void;
  registrar: (tipo: TipoEvento, detalhe?: string) => void;
  sobrescrever: (codigo: string, s: Sobrescrita) => void;
  restaurarOriginais: () => void;
  marcarAtendido: (chave: string) => void;
  simularAbandono: () => void;
  zerar: () => void;
  abrirGaveta: () => void;
  fecharGaveta: () => void;
};

const Contexto = createContext<Loja | null>(null);

export function useLoja() {
  const c = useContext(Contexto);
  if (!c) throw new Error("useLoja precisa estar dentro de ProvedorLoja");
  return c;
}

/** Catálogo com o que o painel alterou já aplicado em cima. */
function aplicar(sobrescritas: Record<string, Sobrescrita>): Produto[] {
  return PRODUTOS.map((p) => {
    const s = sobrescritas[p.codigo];
    return s ? { ...p, ...s } : p;
  });
}

const PAGAMENTO_PADRAO = "Boleto 28 dias";

export function ProvedorLoja({ children }: { children: ReactNode }) {
  // Tudo começa vazio e só é preenchido depois da montagem: ler localStorage
  // durante a renderização do servidor dá erro de hidratação.
  const [pronto, setPronto] = useState(false);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [sobrescritas, setSobrescritas] = useState<Record<string, Sobrescrita>>({});
  const [atendidos, setAtendidos] = useState<string[]>([]);
  const [gaveta, setGaveta] = useState(false);

  useEffect(() => {
    setEmpresa(ler<Empresa | null>(CHAVES.empresa, null));
    setCarrinho(ler<ItemCarrinho[]>(CHAVES.carrinho, []));
    setPedidos(ler<Pedido[]>(CHAVES.pedidos, []));
    setEventos(ler<Evento[]>(CHAVES.eventos, []));
    setSobrescritas(ler<Record<string, Sobrescrita>>(CHAVES.sobrescritas, {}));
    setAtendidos(ler<string[]>(CHAVES.atendidos, []));
    setPronto(true);
  }, []);

  // Cada pedaço grava o seu, e só depois de `pronto` — senão a primeira
  // renderização apagaria o que estava guardado com os valores vazios acima.
  useEffect(() => { if (pronto) gravar(CHAVES.empresa, empresa); }, [pronto, empresa]);
  useEffect(() => { if (pronto) gravar(CHAVES.carrinho, carrinho); }, [pronto, carrinho]);
  useEffect(() => { if (pronto) gravar(CHAVES.pedidos, pedidos); }, [pronto, pedidos]);
  useEffect(() => { if (pronto) gravar(CHAVES.eventos, eventos); }, [pronto, eventos]);
  useEffect(() => { if (pronto) gravar(CHAVES.sobrescritas, sobrescritas); }, [pronto, sobrescritas]);
  useEffect(() => { if (pronto) gravar(CHAVES.atendidos, atendidos); }, [pronto, atendidos]);

  const catalogo = useMemo(() => aplicar(sobrescritas), [sobrescritas]);

  const registrar = useCallback((tipo: TipoEvento, detalhe?: string) => {
    setEventos((atual) => {
      const novo: Evento = { tipo, detalhe, quando: new Date().toISOString() };
      // Visita repetida no mesmo minuto não vira linha nova: a lista do painel
      // ficaria ilegível só por causa de navegação entre páginas.
      const ultimo = atual[atual.length - 1];
      if (
        ultimo && ultimo.tipo === tipo && ultimo.detalhe === detalhe &&
        Date.now() - new Date(ultimo.quando).getTime() < 60_000
      ) return atual;
      return [...atual, novo].slice(-200);
    });
  }, []);

  const cadastrar = useCallback((e: Omit<Empresa, "desde">) => {
    setEmpresa({ ...e, desde: new Date().toISOString() });
    registrar("cadastro", e.razaoSocial);
  }, [registrar]);

  const sair = useCallback(() => setEmpresa(null), []);

  const adicionar = useCallback((codigo: string, quantidade: number) => {
    if (quantidade <= 0) return;
    setCarrinho((atual) => {
      const tem = atual.find((i) => i.codigo === codigo);
      return tem
        ? atual.map((i) => i.codigo === codigo ? { ...i, quantidade: i.quantidade + quantidade } : i)
        : [...atual, { codigo, quantidade }];
    });
    registrar("adicionou", codigo);
  }, [registrar]);

  const mudarQuantidade = useCallback((codigo: string, quantidade: number) => {
    setCarrinho((atual) =>
      quantidade <= 0
        ? atual.filter((i) => i.codigo !== codigo)
        : atual.map((i) => i.codigo === codigo ? { ...i, quantidade } : i),
    );
  }, []);

  const remover = useCallback((codigo: string) => {
    setCarrinho((atual) => atual.filter((i) => i.codigo !== codigo));
    registrar("removeu", codigo);
  }, [registrar]);

  const esvaziar = useCallback(() => setCarrinho([]), []);

  const criarPedido = useCallback<Loja["criarPedido"]>((d) => {
    if (carrinho.length === 0) return null;
    const itens: LinhaPedido[] = carrinho.flatMap((i) => {
      const p = catalogo.find((x) => x.codigo === i.codigo);
      if (!p) return [];
      return [{
        codigo: p.codigo, nome: p.nome, medida: p.medida,
        quantidade: i.quantidade, preco: p.preco,
      }];
    });
    if (itens.length === 0) return null;

    const ano = new Date().getFullYear();
    // A numeração conta o que já existe no navegador, então reiniciar a
    // demonstração reinicia a sequência — é demonstração, não ERP.
    const sequencial = String(pedidos.length + 1).padStart(4, "0");
    const pedido: Pedido = {
      ...d,
      numero: `${ano}-${sequencial}`,
      quando: new Date().toISOString(),
      itens,
      total: itens.reduce((t, l) => t + l.preco * l.quantidade, 0),
      status: "Recebido",
      pagamento: d.pagamento || PAGAMENTO_PADRAO,
    };
    setPedidos((atual) => [pedido, ...atual]);
    setCarrinho([]);
    registrar("pedido_enviado", pedido.numero);
    return pedido;
  }, [carrinho, catalogo, pedidos.length, registrar]);

  const repetirPedido = useCallback((numero: string) => {
    const p = pedidos.find((x) => x.numero === numero);
    if (!p) return;
    // Só volta ao carrinho o que ainda existe no catálogo; o que saiu de linha
    // é descartado em silêncio em vez de virar item fantasma.
    const vivos = p.itens.filter((l) => catalogo.some((c) => c.codigo === l.codigo));
    setCarrinho(vivos.map((l) => ({ codigo: l.codigo, quantidade: l.quantidade })));
    vivos.forEach((l) => registrar("adicionou", l.codigo));
  }, [pedidos, catalogo, registrar]);

  const mudarStatus = useCallback((numero: string, status: StatusPedido) => {
    setPedidos((atual) => atual.map((p) => p.numero === numero ? { ...p, status } : p));
  }, []);

  const sobrescrever = useCallback((codigo: string, s: Sobrescrita) => {
    setSobrescritas((atual) => ({ ...atual, [codigo]: { ...atual[codigo], ...s } }));
  }, []);

  const restaurarOriginais = useCallback(() => setSobrescritas({}), []);

  const marcarAtendido = useCallback((chave: string) => {
    setAtendidos((atual) => atual.includes(chave) ? atual : [...atual, chave]);
  }, []);

  /** Empurra os «adicionou» para trás no tempo, para o painel mostrar o
   *  carrinho como abandonado sem esperar meia hora de verdade. */
  const simularAbandono = useCallback(() => {
    const atraso = (MINUTOS_ABANDONO + 15) * 60_000;
    setEventos((atual) => atual.map((e) =>
      e.tipo === "adicionou"
        ? { ...e, quando: new Date(new Date(e.quando).getTime() - atraso).toISOString() }
        : e,
    ));
  }, []);

  const abrirGaveta = useCallback(() => setGaveta(true), []);
  const fecharGaveta = useCallback(() => setGaveta(false), []);

  const zerar = useCallback(() => {
    limparTudo();
    setEmpresa(null); setCarrinho([]); setPedidos([]);
    setEventos([]); setSobrescritas({}); setAtendidos([]);
  }, []);

  const valor: Loja = {
    pronto, empresa, carrinho, pedidos, eventos, sobrescritas, atendidos, catalogo, gaveta,
    cadastrar, sair, adicionar, mudarQuantidade, remover, esvaziar,
    criarPedido, repetirPedido, mudarStatus, registrar,
    sobrescrever, restaurarOriginais, marcarAtendido, simularAbandono, zerar,
    abrirGaveta, fecharGaveta,
  };

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
