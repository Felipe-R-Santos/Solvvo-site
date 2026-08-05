import type { Metadata } from 'next'
import { ThemeToggle } from '@/components/theme-toggle'
import { Carimbo } from '@/components/carimbo'
import { FormularioPreEstudo } from './formulario'
import { CONTATO } from '@/lib/contato'
import {
  PRAZO_PRE_ESTUDO,
  PRECO_PRE_ESTUDO,
  PRAZO_ESTUDO_COMPLETO,
  PRECO_ESTUDO_COMPLETO,
  PRECO_ASSINATURA,
  QTD_PRE_ESTUDOS_ASSINATURA,
} from '@/lib/valores'

// Server component de propósito: só assim a rota exporta metadata própria. O
// formulário, que precisa de estado, está isolado em ./formulario.tsx como
// client component. Se esta página virasse 'use client', ela herdaria o título
// da home e o link enviado por e-mail chegaria com a descrição errada.
export const metadata: Metadata = {
  title: `Pré-estudo de viabilidade robotizada em ${PRAZO_PRE_ESTUDO} dias úteis | Solvvo Solutions`,
  description:
    `Arquitetura de célula, tempo de ciclo estimado e faixa de investimento em ${PRAZO_PRE_ESTUDO} dias úteis, por ${PRECO_PRE_ESTUDO}. Escopo fechado, preço fechado. Engenharia independente: não vendemos equipamento nem representamos fabricante.`,
  keywords: [
    'pré-estudo de viabilidade',
    'engenharia de aplicação robotizada',
    'estudo de aplicação soldagem robotizada',
    'viabilidade célula robotizada',
    'estudo de aplicação',
    'célula robotizada',
  ],
  openGraph: {
    title: `Pré-estudo de viabilidade robotizada em ${PRAZO_PRE_ESTUDO} dias úteis`,
    description:
      `Escopo fechado, prazo fechado, preço fechado. ${PRECO_PRE_ESTUDO}, entregue em ${PRAZO_PRE_ESTUDO} dias úteis.`,
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Solvvo Solutions',
    images: [{ url: '/celulas/og-celula-carvao.webp', width: 1200, height: 630,
               alt: 'Célula robotizada de soldagem com berços montados, cerca de proteção e posto do operador' }],
  },
}

/* ─────────── Dados da página ─────────── */

// As nove entregas do pré-estudo, na ordem em que o estudo acontece.
const ENTREGAS = [
  {
    titulo: 'Veredito de viabilidade',
    texto: 'Viável, viável com ressalvas ou não recomendado — com a justificativa técnica que sustenta a resposta.',
  },
  {
    titulo: 'Três cenários comparados',
    texto: 'O arranjo mais simples que atende, o que atende crescimento de produção, e o de menor investimento. Lado a lado, no mesmo critério, com as limitações de cada um declaradas.',
  },
  {
    titulo: 'Arquitetura de célula recomendada',
    texto: 'Qual dos arranjos padrão atende a peça, e por que os outros foram descartados.',
  },
  {
    titulo: 'Robô e posicionador candidatos',
    texto: 'Selecionados por payload no punho com ferramenta montada e por momento admissível no eixo do posicionador — não por carga nominal de catálogo.',
  },
  {
    titulo: 'Tempo de ciclo com memória aberta',
    texto: 'Tempo de arco, reposicionamento, rotação de posicionador, carga e descarga e tempo morto, cada parcela à vista. Peças por hora e por turno.',
  },
  {
    titulo: 'Faixa de investimento com procedência',
    texto: 'Mínimo e máximo, com a origem de cada linha e o grau de firmeza do preço. Item sem preço confirmado não entra no total: aparece como pendência a cotar.',
  },
  {
    titulo: 'Retorno calculado e testado',
    texto: 'Custo por peça hoje e depois, payback em meses, e o payback recalculado com volume 30% menor e investimento 20% maior.',
  },
  {
    titulo: 'Riscos e pendências técnicas',
    texto: 'O que precisa ser resolvido antes de avançar. Nenhum estudo honesto tem essa lista vazia.',
  },
  {
    titulo: 'Vistas 3D do arranjo',
    texto: 'Imagens do layout proposto, prontas para colar na sua proposta.',
  },
]

const ENTRADAS = [
  'Desenho ou modelo 3D da peça — ou fotos com medidas principais, se não existir desenho',
  'Material, espessura e, no caso de solda, comprimento e posição dos cordões',
  'Volume de produção pretendido e regime de turnos',
  'Planta ou fotos da área disponível',
]

// Tabela de níveis. Estruturada por LINHA (o critério) e não por coluna, porque
// é assim que ela empilha no mobile: cada nível vira um bloco com os quatro
// critérios dentro. Ver o comentário na seção 4.
const NIVEIS = [
  {
    nome: 'Pré-estudo',
    paraQue: 'Decidir se vale',
    entrega: 'Veredito, três cenários, ciclo estimado, faixa de investimento',
    prazo: `${PRAZO_PRE_ESTUDO} dias úteis`,
    investimento: PRECO_PRE_ESTUDO,
    destaque: true,
  },
  {
    nome: 'Estudo completo',
    paraQue: 'Sustentar a proposta assinada',
    entrega: 'Simulação, ciclo medido, layout, seleção justificada, ROI e payback',
    prazo: `${PRAZO_ESTUDO_COMPLETO} dias úteis`,
    investimento: PRECO_ESTUDO_COMPLETO,
    destaque: false,
  },
  {
    nome: 'Especificação executiva',
    paraQue: 'Comprar e receber',
    entrega: 'Memorial técnico, escopo de cotação, critério de aceite',
    prazo: 'Sob demanda',
    investimento: 'Sob consulta',
    destaque: false,
  },
]

const CRITERIOS: { chave: keyof (typeof NIVEIS)[number]; rotulo: string }[] = [
  { chave: 'paraQue', rotulo: 'Para que' },
  { chave: 'entrega', rotulo: 'Entrega' },
  { chave: 'prazo', rotulo: 'Prazo' },
  { chave: 'investimento', rotulo: 'Investimento' },
]

/* ─────────── Página ─────────── */

export default function EstudoDeAplicacao() {
  return (
    <div className="min-h-screen flex flex-col bg-sv-bg">
      <div className="brand-bar fixed top-0 left-0 right-0 z-50" aria-hidden="true" />

      <header className="border-b border-sv-line">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo-solvvo.png" alt="Solvvo"
              className="h-9 sm:h-11 w-auto object-contain" />
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

          {/* ── SEÇÃO 1 — ABERTURA ─────────────────────────────────────── */}
          <section className="pt-14 sm:pt-20 pb-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.09em] text-sv-text-3 mb-4">
              Engenharia independente de aplicação robotizada
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-tight tracking-tight text-sv-text">
              Pré-estudo de viabilidade robotizada em {PRAZO_PRE_ESTUDO} dias úteis
            </h1>

            <div className="mt-8 space-y-5 text-sv-text-2 leading-relaxed max-w-2xl">
              <p>
                Toda integradora tem o mesmo gargalo: o engenheiro de aplicação. Cinco
                vendedores gerando oito estudos por mês caem na mesa de uma pessoa só, e
                o que era resposta de dois dias vira resposta de um mês. Enquanto isso o
                cliente final decide sem o número — ou decide não fazer.
              </p>
              <p>
                O pré-estudo da Solvvo existe para tapar esse buraco.{' '}
                <span className="text-sv-text font-medium">
                  Escopo fechado, prazo fechado, preço fechado.
                </span>{' '}
                Você continua dono da venda e da execução; nós entregamos a engenharia
                que sustenta a proposta.
              </p>
            </div>

            {/* Prazo e preço em bloco de número, no padrão 3.5 */}
            <div className="mt-10 pt-8 border-t border-sv-line grid grid-cols-2 gap-8 max-w-md">
              <div>
                <div className="font-mono text-[22px] font-medium leading-none text-sv-text">
                  {PRAZO_PRE_ESTUDO} dias
                </div>
                <div className="font-mono text-[11px] uppercase tracking-[0.09em] text-sv-text-3 mt-2">
                  úteis, do aceite à entrega
                </div>
              </div>
              <div>
                <div className="font-mono text-[22px] font-medium leading-none text-sv-text">
                  {PRECO_PRE_ESTUDO}
                </div>
                <div className="font-mono text-[11px] uppercase tracking-[0.09em] text-sv-text-3 mt-2">
                  escopo fechado, por estudo
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a href="#solicitar"
                className="inline-flex items-center justify-center rounded px-8 py-4 bg-sv-accent text-sv-accent-ink font-medium hover:bg-sv-accent/90 transition-colors">
                Solicitar pré-estudo
              </a>
              <a href="#o-que-voce-recebe"
                className="inline-flex items-center justify-center rounded px-8 py-4 border border-sv-line text-sv-text-2 hover:text-sv-text hover:bg-sv-surface font-medium transition-colors">
                Ver o que entra
              </a>
            </div>
          </section>

          {/* ── SEÇÃO 2 — O QUE VOCÊ RECEBE ────────────────────────────── */}
          <section id="o-que-voce-recebe" className="py-16 border-t border-sv-line">
            <p className="font-mono text-[11px] uppercase tracking-[0.09em] text-sv-text-3 mb-4">
              O que você recebe
            </p>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-sv-text mb-10">
              Nove entregas, todas com a fonte do número
            </h2>

            <ol className="space-y-8">
              {ENTREGAS.map((e, i) => (
                <li key={i} className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1">
                  <div className="font-mono text-[22px] font-medium leading-none text-sv-text tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.09em] text-sv-text-3">
                      {e.titulo}
                    </h3>
                    <p className="text-sv-text-2 leading-relaxed mt-1.5">{e.texto}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* UMA imagem só, e presa ao item 02 de propósito.
                Duas arquiteturas lado a lado ilustrariam CATÁLOGO, não
                comparação: elas atendem peças diferentes, e o que o pré-estudo
                compara são arranjos para a MESMA peça. A comparação de verdade
                é a tabela de ciclo, peças/hora, investimento e payback.
                Decisão de Felipe, registrada em DECISOES.md. */}
            <figure className="mt-12">
              <div className="rounded border border-sv-line overflow-hidden">
                <div className="sv-img-celula-h w-full aspect-[1600/1368]" role="img"
                  aria-label="Render de célula robotizada em arquitetura H de duas estações, com robô no pedestal central, dois posicionadores, cortina de luz na estação de carga e fonte de solda fora da cerca" />
              </div>
              <figcaption className="font-mono text-[11px] uppercase tracking-[0.09em] text-sv-text-3 mt-3">
                Uma das alternativas avaliadas · célula H de duas estações
              </figcaption>
            </figure>

            {/* Nota de limite — texto literal do brief. Contorno de 1px, sem
                fundo colorido: é ressalva técnica, não aviso de alerta. */}
            <aside className="mt-12 rounded border border-sv-line p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.09em] text-sv-text-3 mb-3">
                Onde o pré-estudo para
              </p>
              <p className="text-sv-text-2 leading-relaxed">
                O pré-estudo não é projeto executivo nem simulação validada. Ele existe
                para decidir se vale avançar e com que ordem de grandeza de investimento.
                Quando a decisão for sim, o estudo completo entra com simulação, ciclo
                medido e memorial de cálculo.
              </p>
            </aside>
          </section>

          {/* ── SEÇÃO 3 — O QUE PRECISAMOS DE VOCÊ ─────────────────────── */}
          <section className="py-16 border-t border-sv-line">
            <p className="font-mono text-[11px] uppercase tracking-[0.09em] text-sv-text-3 mb-4">
              O que precisamos de você
            </p>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-sv-text mb-6">
              Quanto melhor a entrada, mais firme o número
            </h2>
            <p className="text-sv-text-2 leading-relaxed mb-8">O mínimo para começar:</p>

            <ul className="space-y-4 max-w-2xl">
              {ENTRADAS.map((e, i) => (
                <li key={i} className="grid grid-cols-[auto_1fr] gap-4 items-start">
                  <span className="font-mono text-[11px] text-sv-text-3 mt-1.5 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sv-text-2 leading-relaxed">{e}</span>
                </li>
              ))}
            </ul>

            <p className="text-sv-text-2 leading-relaxed mt-8 max-w-2xl">
              Não tem desenho da peça nem planta confiável do galpão?{' '}
              <span className="text-sv-text font-medium">
                O Scan 3D levanta a geometria real
              </span>{' '}
              e vira a base do estudo.
            </p>
          </section>

          {/* ── SEÇÃO 4 — NÍVEIS DE ENTREGA ────────────────────────────── */}
          <section className="py-16 border-t border-sv-line">
            <p className="font-mono text-[11px] uppercase tracking-[0.09em] text-sv-text-3 mb-4">
              Níveis de entrega
            </p>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-sv-text mb-10">
              Até onde você precisa ir
            </h2>

            {/* NÃO É <table>, e não rola de lado no celular.
                Tabela com rolagem horizontal no mobile é onde a informação
                morre: o visitante não descobre que há colunas à direita. Aqui é
                grid — três colunas no desktop, três blocos empilhados no
                celular, cada um com os quatro critérios rotulados dentro. */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {NIVEIS.map((n) => (
                <div key={n.nome}
                  className={`rounded border p-6 ${
                    n.destaque ? 'border-sv-accent bg-sv-surface' : 'border-sv-line bg-sv-surface/50'
                  }`}>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.09em] text-sv-text-3">
                    {n.nome}
                  </h3>
                  <dl className="mt-5 space-y-4">
                    {CRITERIOS.map((c) => (
                      <div key={c.chave}>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.09em] text-sv-text-3">
                          {c.rotulo}
                        </dt>
                        <dd className={`mt-1 leading-relaxed ${
                          c.chave === 'prazo' || c.chave === 'investimento'
                            ? 'font-mono text-sm text-sv-text'
                            : 'text-sm text-sv-text-2'
                        }`}>
                          {n[c.chave] as string}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </section>

          {/* ── SEÇÃO 5 — ASSINATURA ───────────────────────────────────── */}
          <section className="py-16 border-t border-sv-line">
            <p className="font-mono text-[11px] uppercase tracking-[0.09em] text-sv-text-3 mb-4">
              Para quem precisa de pré-estudo toda semana
            </p>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-sv-text mb-8">
              Assinatura para integradoras
            </h2>

            <div className="rounded border border-sv-line p-6 sm:p-8 max-w-3xl">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                <span className="font-mono text-[22px] font-medium leading-none text-sv-text">
                  {PRECO_ASSINATURA}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.09em] text-sv-text-3">
                  por mês · {QTD_PRE_ESTUDOS_ASSINATURA} pré-estudos inclusos
                </span>
              </div>

              <div className="mt-6 space-y-4 text-sv-text-2 leading-relaxed">
                <p>
                  Integradoras e revendas que geram estudo em volume têm plano mensal:{' '}
                  {PRECO_ASSINATURA} com {QTD_PRE_ESTUDOS_ASSINATURA} pré-estudos
                  inclusos, prioridade de fila e reunião técnica semanal. Estudos
                  adicionais entram com desconto.
                </p>
                <p>
                  É engenharia de aplicação sob demanda, sem o custo fixo de um
                  engenheiro dedicado.
                </p>
              </div>

              <a href={`https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(
                  'Olá! Vim pela página do pré-estudo e quero falar sobre o plano mensal para integradoras.'
                )}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded px-6 py-3 mt-7 border border-sv-line text-sv-text-2 hover:text-sv-text hover:bg-sv-bg font-medium transition-colors">
                Falar sobre o plano mensal
              </a>
            </div>
          </section>

          {/* ── SEÇÃO 6 — FORMULÁRIO ───────────────────────────────────── */}
          <section id="solicitar" className="py-16 border-t border-sv-line">
            <p className="font-mono text-[11px] uppercase tracking-[0.09em] text-sv-text-3 mb-4">
              Solicitar
            </p>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-sv-text mb-4">
              Comece o seu pré-estudo
            </h2>
            <p className="text-sv-text-2 leading-relaxed mb-10 max-w-2xl">
              Cada campo abaixo é uma variável que o estudo precisa. Preencher agora é o
              que permite devolver em {PRAZO_PRE_ESTUDO} dias úteis.
            </p>

            <FormularioPreEstudo />
          </section>
        </div>
      </main>

      <footer className="border-t border-sv-line bg-sv-surface">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <a href="/" className="text-sm text-sv-text-2 hover:text-sv-text transition-colors">
                ← Voltar para a página inicial
              </a>
              <p className="text-sm text-sv-text-3 mt-3 max-w-xs leading-relaxed">
                Estudo de aplicação para células robotizadas. Engenharia
                independente, com procedência em cada número.
              </p>
            </div>
            <ul className="space-y-2 text-sm text-sv-text-3">
              <li>
                <a href={`mailto:${CONTATO.email}`} className="hover:text-sv-text transition-colors">
                  {CONTATO.email}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${CONTATO.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="hover:text-sv-text transition-colors">
                  {CONTATO.telefoneVisivel} · WhatsApp
                </a>
              </li>
              <li>{CONTATO.cidade}</li>
              <li>
                <a href="/politica-de-privacidade" className="hover:text-sv-text transition-colors">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>
          <Carimbo />
        </div>
      </footer>
    </div>
  )
}
