'use client'

import { useState, useRef, FormEvent } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ScanLine,
  Layers,
  Printer,
  Cpu,
  Menu,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  ChevronUp,
  Linkedin,
  Instagram,
  Youtube,
  CheckCircle2,
  TrendingUp,
  Target,
  Award,
  Car,
  Plane,
  Fuel,
  ArrowUpRight,
  Zap,
  Shield,
  BarChart3,
} from 'lucide-react'

/* ─────────── Animation helpers ─────────── */

function FadeInSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─────────── Navigation ─────────── */

const navLinks = [
  { label: 'Início', href: '#inicio' },
  { label: 'Plataforma', href: '#plataforma' },
  { label: 'Soluções', href: '#servicos' },
  { label: 'Células', href: '#celulas' },
  { label: 'Aplicações', href: '#cases' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
]

// ── CONTATO — um só lugar para mudar (usado no form, no WhatsApp e no rodapé) ──
const CONTATO = {
  email: 'contato@solvvo.com.br',
  // formato internacional, só dígitos: exigido pelo link do WhatsApp
  whatsapp: '5554981535018',
  telefoneVisivel: '(54) 9 8153-5018',
  cidade: 'Caxias do Sul, RS - Brasil',
}

// ── SERVIÇOS — uma lista só, para o rodapé e para o formulário ─────────────
// Antes existiam DUAS listas ("Scan 3D, Digital Twin, Manufatura Aditiva,
// Automação Industrial"), uma no rodapé e outra no select de contato, ambas
// vindas do template e nenhuma descrevendo o que a Solvvo vende. Duas listas
// separadas é como elas divergiram sem ninguém notar.
// Ordem: a que o cliente compra primeiro.
const SERVICOS = [
  'Pré-estudo de viabilidade',
  'Estudo de aplicação completo',
  'Especificação de célula',
  'Engenharia reversa e Scan 3D',
  'Dispositivos e gabaritos',
] as const

// O rodapé mostra os quatro principais; o formulário oferece todos mais "Outro".
const SERVICOS_RODAPE = SERVICOS.slice(0, 4)
const SERVICOS_FORMULARIO = [...SERVICOS, 'Outro']

// ── REDES SOCIAIS ──────────────────────────────────────────────────────────
// Antes os três ícones apontavam para href="#": clicar não fazia nada, o que
// num site institucional passa a impressão de página abandonada. Agora só
// aparece a rede que TEM endereço. Para publicar uma, cole a URL aqui.
const REDES: { nome: 'LinkedIn' | 'Instagram' | 'YouTube'; url: string }[] = [
  // Sem o `?viewAsMember=true` do endereço copiado do navegador: aquilo é
  // parâmetro de visualização de quem administra a página, não faz parte do
  // endereço público.
  { nome: 'LinkedIn', url: 'https://www.linkedin.com/company/solvvosolutions/' },
  { nome: 'Instagram', url: '' },
  { nome: 'YouTube', url: '' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setScrolled(window.scrollY > 50)
    })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-sv-bg/90 backdrop-blur-xl border-b border-sv-line shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-2 group">
          <img
            src="/logo-solvvo.png"
            alt="Solvvo"
            className="h-9 sm:h-11 w-auto object-contain drop-shadow-lg"
          />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-sv-text-2 hover:text-sv-text rounded-lg hover:bg-sv-surface transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle className="ml-2" />
          <Button
            onClick={() => {
              document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="ml-3 bg-sv-accent hover:bg-sv-accent/90 text-sv-accent-ink font-semibold"
          >
            Orçamento
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Mobile: tema + hambúrguer. O botão de tema fica FORA do menu para
            não exigir dois toques — trocar o tema é a primeira coisa que se
            faz ao abrir o site com a luz errada. */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-sv-text-2 hover:text-sv-text hover:bg-sv-surface">
              <Menu className="w-6 h-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-sv-bg border-sv-line w-80">
            <SheetHeader className="pt-8 pb-4">
              <SheetTitle className="text-left flex items-center gap-2">
                <img
                  src="/logo-solvvo.png"
                  alt="Solvvo"
                  className="h-8 w-auto object-contain drop-shadow-lg"
                />
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2 px-4">
              {navLinks.map((link) => (
                <SheetClose key={link.href} asChild>
                  <a
                    href={link.href}
                    className="px-4 py-3 text-base font-medium text-sv-text-2 hover:text-sv-text rounded-lg hover:bg-sv-surface transition-all"
                  >
                    {link.label}
                  </a>
                </SheetClose>
              ))}
              <Separator className="my-3 bg-sv-line" />
              <SheetClose asChild>
                <Button
                  className="bg-sv-accent hover:bg-sv-accent/90 text-sv-accent-ink font-semibold w-full"
                  onClick={() => {
                    setTimeout(() => {
                      document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })
                    }, 100)
                  }}
                >
                  Solicitar Orçamento
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
        </div>
      </nav>
    </header>
  )
}

/* ─────────── Hero Section ─────────── */

function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* FUNDO: render de célula com coluna e lança, do nosso acervo.
          Tratado por scripts/preparar-imagens-celulas.py — fundo escurecido e
          realces do piso puxados para baixo, senão o texto branco não lê.
          18 MB / 9000 px no original -> 86 KB / 1920 px em WebP.
          `object-center` porque a célula está no meio do quadro: em tela larga
          o recorte tira topo e base, e é o que se pode perder. */}
      <div className="absolute inset-0">
        <img
          src="/hero-celula.webp"
          alt=""
          fetchPriority="high"
          className="w-full h-full object-cover object-center"
          aria-hidden="true"
        />
        {/* Véu mais leve no topo (deixa a célula aparecer) e sólido embaixo,
            onde ficam a headline e os botões. */}
        <div className="absolute inset-0 bg-gradient-to-b from-sv-bg/55 via-sv-bg/78 to-sv-bg" />
        <div className="absolute inset-0 grid-pattern" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-sv-text-3 rounded-full opacity-30"
            // `left`/`top` em MotionStyle: o tipo do framer-motion 12 não
            // aceita as duas junto com `animate`, então a posição vai por
            // variável CSS, que é tipada como string e não conflita.
            style={{ insetInlineStart: `${20 + i * 15}%`, insetBlockStart: `${30 + i * 10}%` }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <img
            src="/logo-solvvo.png"
            alt="Solvvo"
            // Alturas reduzidas em 30/07: o arquivo do logo tinha 77% de
            // moldura transparente, então h-52 desenhava só ~48px de logo.
            // Com a moldura cortada, a altura do CSS virou altura REAL —
            // manter h-52 deixaria o logo com 208px e ~760px de largura.
            className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain mx-auto drop-shadow-2xl mb-8"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        >
          <Badge className="mb-6 px-4 py-1.5 text-sm font-medium bg-sv-surface text-sv-text-2 border-sv-line hover:bg-sv-surface transition-colors">
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Em breve — plataforma de simulação automática
          </Badge>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
        >
          O estudo de aplicação{' '}
          <span className="gradient-text">deixa de levar semanas</span>
          <br />
          e passa a caber numa sessão
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-sv-text-2 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          Plataforma de simulação automática para quem faz estudo de aplicação toda
          semana: <span className="text-sv-text-2">integradoras</span> e{' '}
          <span className="text-sv-text-2">indústrias que refazem layout o tempo todo</span>.
          Robô, posicionador, estrutura, tempo de ciclo, ROI e payback — com a fonte de
          cada número.
        </motion.p>

        <motion.div
          className="max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
        >
          <blockquote className="relative border-l-2 border-sv-line pl-4 sm:pl-6">
            <p className="text-base sm:text-lg italic text-sv-text-2 leading-relaxed">
              "Se o número não tem fonte, não é estudo — é chute com planilha bonita."
            </p>
            <p className="text-sm text-sv-text-3 mt-2">O princípio de engenharia da Solvvo Solutions</p>
          </blockquote>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
        >
          <Button
            size="lg"
            className="bg-sv-accent hover:bg-sv-accent/90 text-sv-accent-ink font-semibold text-base px-8 py-6 h-auto glow-emerald-strong hover:glow-emerald-strong transition-all"
            onClick={() => {
              document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Entrar na lista de espera
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-sv-line text-sv-text-2 hover:bg-sv-surface hover:text-sv-text font-semibold text-base px-8 py-6 h-auto transition-all"
            onClick={() => {
              document.getElementById('plataforma')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Ver o que a plataforma faz
          </Button>
        </motion.div>

        {/* A barra de estatísticas que ficava aqui foi REMOVIDA em 05/08/2026.
            Eram contagens do banco técnico interno (526 projetos de
            referência, 6.928 componentes, 23 arquiteturas, 72 posicionadores)
            apresentadas como currículo, logo abaixo dos CTAs. Um comprador lê
            "526 projetos" como "526 clientes atendidos" — e a empresa nunca
            afirmou isso. Numa página cujo argumento central é procedência, um
            número que se lê errado derruba o argumento inteiro.
            Os números de acervo que sobreviveram estão na seção Plataforma,
            sob rótulo explícito de acervo técnico interno. */}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-xs text-sv-text-3 uppercase tracking-widest">Scroll</span>
        <ChevronUp className="w-4 h-4 text-sv-text-3 rotate-180" />
      </motion.div>
    </section>
  )
}

/* ─────────── Services Section ─────────── */

// Ordenado pelo que o cliente compra primeiro: o estudo abre a porta,
// a célula é a entrega, o resto sustenta.
const services = [
  {
    icon: Layers,
    title: 'Estudo de Aplicação',
    description:
      'A conta que decide se vale robotizar: robô e posicionador por payload e alcance, estrutura dimensionada, tempo de ciclo, produtividade, ROI e payback — com a fonte de cada número.',
    features: ['Tempo de Ciclo', 'ROI e Payback', 'Procedência'],
  },
  {
    icon: Cpu,
    title: 'Especificação da Célula',
    description:
      'A definição técnica que vai para o fornecedor: robô, posicionador, berço, estrutura, proteções e segurança — dimensionados e justificados. Você compra sabendo exatamente o que pediu e por quê.',
    features: ['Memorial técnico', 'Escopo para cotação', 'Critério de aceite'],
  },
  {
    icon: ScanLine,
    title: 'Engenharia Reversa e Scan 3D',
    description:
      'Digitalização tridimensional da peça e do galpão para levantar a geometria real quando não existe desenho — a base de qualquer estudo que se sustente.',
    features: ['Peça sem Desenho', 'Inspeção Dimensional', 'Modelo 3D'],
  },
  {
    icon: Printer,
    title: 'Dispositivos e Fabricação',
    description:
      'Berços, gabaritos e dispositivos de fixação dimensionados para a peça, com fabricação e prototipagem rápida quando o prazo aperta.',
    features: ['Berços e Gabaritos', 'Dispositivos', 'Prototipagem'],
  },
]

function ServicesSection() {
  return (
    <section id="servicos" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/services-bg.png"
          alt=""
          className="w-full h-full object-cover opacity-10"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sv-bg via-sv-bg/95 to-sv-bg" />
        <div className="absolute inset-0 grid-pattern" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInSection className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 text-xs font-medium bg-sv-surface text-sv-text-2 border-sv-line">
            O que fazemos
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Nossas <span className="gradient-text">Soluções</span>
          </h2>
          <p className="text-sv-text-2 text-lg max-w-2xl mx-auto">
            Oferecemos soluções completas em manufatura digital, combinando tecnologia de ponta com expertise industrial para transformar sua operação.
          </p>
        </FadeInSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <StaggerItem key={i}>
                <Card className="group relative bg-sv-surface/80 border-sv-line hover:border-sv-text-3 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl overflow-hidden">
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-sv-surface group-hover:to-transparent transition-all duration-500" />
                  <CardHeader className="relative pb-2">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-sv-surface border border-sv-line flex items-center justify-center group-hover:bg-sv-surface group-hover:border-sv-text-3 transition-all group-hover:scale-110 duration-300 shrink-0">
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-sv-text-2" />
                      </div>
                      <div>
                        <CardTitle className="text-xl sm:text-2xl font-bold text-sv-text group-hover:text-sv-text transition-colors">
                          {service.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-sv-text-2 leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.features.map((f, j) => (
                        <Badge
                          key={j}
                          variant="outline"
                          className="text-xs border-sv-line text-sv-text-3 bg-sv-surface"
                        >
                          {f}
                        </Badge>
                      ))}
                    </div>
                    <a
                      href="#contato"
                      className="inline-flex items-center gap-1 text-sm font-medium text-sv-text-2 hover:text-sv-text transition-colors group/link"
                    >
                      Saiba Mais
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </CardContent>
                </Card>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}

/* ─────────── About Section ─────────── */

function AboutSection() {
  return (
    <section id="sobre" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sv-bg via-sv-bg/98 to-sv-bg" />
      <div className="absolute inset-0 grid-pattern" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <FadeInSection>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden glow-emerald">
                <img
                  src="/about-img.png"
                  alt="Engenheiro com óculos de proteção analisando um modelo tridimensional em tablet, no chão de fábrica"
                  className="w-full h-auto object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sv-bg/30 to-transparent" />
              </div>
            </div>
          </FadeInSection>

          {/* Text */}
          <FadeInSection delay={0.2}>
            <div>
              <Badge className="mb-4 px-3 py-1 text-xs font-medium bg-sv-surface text-sv-text-2 border-sv-line">
                Sobre nós
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Sobre a{' '}
                <span className="gradient-text">Solvvo</span>
              </h2>
              <div className="space-y-4 text-sv-text-2 leading-relaxed">
                <p>
                  A <span className="text-sv-text font-medium">Solvvo Solutions</span> faz o{' '}
                  <span className="text-sv-text font-medium">estudo de aplicação</span> de
                  células robotizadas e sistemas de automação — soldagem, manipulação,
                  paletização e movimentação de materiais. Não representamos fabricante e
                  não vendemos equipamento de automação: nosso produto é a engenharia que
                  diz se vale robotizar, com qual arranjo e em quanto tempo o investimento
                  volta.
                </p>
                <p>
                  Essa independência é o ponto, e ela é específica: não vendemos nem
                  representamos <span className="text-sv-text font-medium">robô,
                  posicionador ou periférico de automação</span>. Quem estuda a
                  aplicação sem ter robô no estoque não tem motivo para
                  superdimensionar. O estudo serve à decisão do cliente, não ao catálogo
                  de ninguém — e é o mesmo documento que ele usa para cotar com qualquer
                  integrador e comparar propostas no mesmo critério.
                </p>
                <p>
                  Berço, gabarito e dispositivo de fixação são outra coisa: são
                  projetados sob medida para a peça do cliente, não escolhidos num
                  catálogo de fabricante. Fabricá-los não cria conflito nenhum com a
                  independência acima — não há marca a favorecer num dispositivo que só
                  existe para aquela peça.
                </p>
                <p>
                  Trabalhamos com um princípio simples e incomum no setor:{' '}
                  <span className="text-sv-text font-medium">todo número tem de ter fonte</span>.
                  Payload e alcance saem do catálogo do fabricante. Estrutura sai de cálculo
                  declarado, com fator de segurança à vista. Ciclo sai do processo medido.
                  Nada de estimativa que não se possa auditar.
                </p>
                <p>
                  É esse método que estamos transformando em plataforma: o estudo de
                  aplicação que hoje leva semanas de planilha, feito de ponta a ponta e
                  rastreável linha por linha.
                </p>
              </div>

              {/* Values */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {[
                  { icon: Target, label: 'Missão', text: 'Tornar a decisão de robotizar uma conta, não uma aposta' },
                  { icon: Eye, label: 'Método', text: 'Cada número rastreável até catálogo, norma ou cálculo' },
                  { icon: Shield, label: 'Independência', text: 'Não vendemos nem representamos robô, posicionador ou periférico' },
                ].map((v, i) => {
                  const Icon = v.icon
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-sv-surface/50 border border-sv-line">
                      <Icon className="w-5 h-5 text-sv-text-2 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-sv-text">{v.label}</div>
                        <div className="text-xs text-sv-text-2 mt-0.5">{v.text}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  )
}

function Eye({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

/* ─────────── Aplicações ─────────── */

// ─────────────────────────────────────────────────────────────────────────────
// APLICAÇÕES QUE ATENDEMOS
//
// REGRA DESTA SEÇÃO: nenhum resultado numérico sem procedência ao lado.
// O site inteiro se sustenta em "todo número tem fonte" — um percentual solto
// aqui embaixo seria o primeiro lugar onde um engenheiro pede a memória de
// cálculo, e onde o argumento cairia.
//
// Por isso ela descreve a APLICAÇÃO e o que é entregue nela. Quando houver
// caso com número medido e fonte, ele entra aqui com a procedência junto.
// ─────────────────────────────────────────────────────────────────────────────
const aplicacoes = [
  {
    icon: Car,
    setor: 'Implementos e estruturas',
    titulo: 'Soldagem robotizada de conjuntos soldados',
    descricao:
      'Chassis, travessas, caixas e reservatórios: peças grandes, com muitos cordões e posições de difícil acesso. A célula é definida pelo alcance útil e pela posição de soldagem, não pelo tamanho do robô.',
    entregas: ['Arranjo da célula', 'Posicionador e berço', 'Alcance verificado'],
  },
  {
    icon: Fuel,
    setor: 'Movimentação e paletização',
    titulo: 'Manipulação e paletização de carga',
    descricao:
      'Carga e descarga de máquina, paletização de produto acabado e movimentação entre postos. O que decide o projeto é o payload no punho com a garra montada — e o ciclo, não o catálogo.',
    entregas: ['Payload com garra', 'Tempo de ciclo', 'Peças por hora'],
  },
  {
    icon: Plane,
    setor: 'Engenharia de suporte',
    titulo: 'Levantamento de peça e de planta sem desenho',
    descricao:
      'Quando não existe modelo 3D da peça nem planta confiável do galpão, o Scan 3D levanta a geometria real. É a base sem a qual nenhum estudo de aplicação se sustenta.',
    entregas: ['Scan 3D', 'Engenharia reversa', 'Layout do galpão'],
  },
]

function AplicacoesSection() {
  return (
    <section id="cases" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sv-bg via-sv-bg/98 to-sv-bg" />
      <div className="absolute inset-0 grid-pattern" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInSection className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 text-xs font-medium bg-sv-surface text-sv-text-2 border-sv-line">
            Onde atuamos
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Aplicações que{' '}
            <span className="gradient-text">atendemos</span>
          </h2>
          <p className="text-sv-text-2 text-lg max-w-2xl mx-auto">
            Cada aplicação tem a sua pergunta difícil. O estudo existe para respondê-la
            antes de o equipamento ser comprado.
          </p>
        </FadeInSection>

        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {aplicacoes.map((ap, i) => {
            const Icon = ap.icon
            return (
              <StaggerItem key={i}>
                <Card className="group h-full bg-sv-surface/80 border-sv-line hover:border-sv-text-3 transition-all duration-500 hover:shadow-xl overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-sv-surface border border-sv-line flex items-center justify-center group-hover:bg-sv-surface transition-colors">
                        <Icon className="w-5 h-5 text-sv-text-2" />
                      </div>
                      <Badge variant="outline" className="text-xs border-sv-line text-sv-text-3 bg-sv-surface">
                        {ap.setor}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-sv-text group-hover:text-sv-text transition-colors leading-snug">
                      {ap.titulo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <p className="text-sv-text-2 text-sm leading-relaxed mb-6 flex-1">
                      {ap.descricao}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ap.entregas.map((e, j) => (
                        <span
                          key={j}
                          className="text-xs px-2.5 py-1 rounded-md bg-sv-surface border border-sv-line text-sv-text-3"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}

/* ─────────── Founder Section ─────────── */

/* ─────────── Plataforma (teaser) ─────────── */

// O que a plataforma entrega, na ordem em que o estudo acontece.
const etapasPlataforma = [
  { titulo: 'Levantamento técnico', texto: 'Geometria da peça, processo, material, espessura e cordões.' },
  { titulo: 'Seleção do robô', texto: 'Por payload NO PUNHO e alcance útil — não por preço de tabela.' },
  { titulo: 'Posicionador e berço', texto: 'Tipo, capacidade e curso definidos pela peça, não pelo hábito.' },
  { titulo: 'Estrutura dimensionada', texto: 'Flexão, flecha e torção com fórmula declarada e fator de segurança.' },
  { titulo: 'Layout e 3D da célula', texto: 'Arranjo, área ocupada, alcance verificado e vistas geradas.' },
  { titulo: 'Ciclo e produtividade', texto: 'Tempo de arco, movimentação e tempo morto — peças por hora.' },
  { titulo: 'ROI e payback', texto: 'Retorno calculado sobre o ciclo real, não sobre o otimista.' },
  { titulo: 'Orçamento com procedência', texto: 'Cada linha aponta para catálogo, norma ou cálculo.' },
]

// Números MEDIDOS no acervo em 30/07/2026 (motor/base-master.db).
// Cada um é conferível — é este o argumento da plataforma.
//
// São CONTAGENS DE BANCO TÉCNICO INTERNO, nunca resultado comercial. É por isso
// que o bloco tem título e nota dizendo isso com todas as letras: sem o rótulo,
// "6.928 componentes" é lido como volume de trabalho entregue a cliente.
//
// O antigo "526 projetos de referência" saiu daqui em 05/08/2026. Era o mais
// fácil de ler errado ("526 clientes atendidos") e entrava em contradição
// direta com os números do herói, que falam de 31 projetos em STEP no acervo.
// Dois inventários do mesmo acervo com ordens de grandeza diferentes na mesma
// página é o tipo de coisa que o visitante encontra antes de nós.
const numerosAcervo = [
  { valor: '6.928', rotulo: 'componentes de catálogo', nota: 'SKUs com fabricante, modelo e procedência' },
  { valor: '23', rotulo: 'arquiteturas de célula', nota: 'validadas e prontas para dimensionar' },
  { valor: '72', rotulo: 'posicionadores', nota: 'lidos de catálogo de fabricante, payload por eixo' },
]

function PlataformaSection() {
  return (
    <section id="plataforma" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sv-bg via-sv-bg/98 to-sv-bg" />
      <div className="absolute inset-0 grid-pattern" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInSection className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 text-xs font-medium bg-sv-surface text-sv-text-2 border-sv-line">
            Em breve · por assinatura
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Simulação automática para{' '}
            <span className="gradient-text">estudos de aplicação</span>
          </h2>
          <p className="text-sv-text-2 text-lg max-w-3xl mx-auto leading-relaxed">
            Hoje o estudo de aplicação é artesanal: semanas de planilha, cada engenheiro
            com o seu método e um resultado que ninguém consegue auditar. Quem faz um
            estudo por ano convive com isso. Quem faz um por semana está perdendo
            proposta. A plataforma faz esse estudo de ponta a ponta — e mostra de onde
            veio cada número.
          </p>
        </FadeInSection>

        {/* ── PARA QUEM É ────────────────────────────────────────────────────
            O modelo é ASSINATURA MENSAL, então o valor está em quem REPETE o
            estudo, não em quem faz uma vez. Por isso os perfis são separados
            por FREQUÊNCIA — é ela que justifica pagar todo mês. */}
        <FadeInSection className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                perfil: 'Integradoras de robótica',
                dor: 'Cada proposta exige um estudo. O prazo de resposta decide quem ganha o pedido — e hoje ele depende do engenheiro mais ocupado da casa.',
              },
              {
                perfil: 'Indústrias que remanejam layout',
                dor: 'Mudou o mix, mudou a linha. A cada rearranjo, a conta de alcance, ciclo e capacidade precisa ser refeita do zero.',
              },
              {
                perfil: 'Engenharia interna',
                dor: 'Precisa comparar propostas de fornecedores diferentes no mesmo critério, com memória de cálculo que se possa auditar.',
              },
            ].map((p, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-sv-surface/60 border border-sv-line"
              >
                <div className="text-sm font-semibold text-sv-text-2 mb-2">{p.perfil}</div>
                <div className="text-sm text-sv-text-2 leading-relaxed">{p.dor}</div>
              </div>
            ))}
          </div>
        </FadeInSection>

        {/* Números do acervo — com rótulo explícito de acervo técnico interno.
            Sem este cabeçalho o bloco vira placar de vaidade, que é
            exatamente o que a remoção da barra do herói corrigiu. */}
        <FadeInSection className="mb-6">
          <h3 className="text-lg font-bold text-sv-text">Nosso acervo técnico</h3>
          <p className="text-sm text-sv-text-2 mt-1.5 max-w-2xl leading-relaxed">
            O que a plataforma consulta para dimensionar. São contagens do nosso
            banco técnico interno — não são clientes atendidos nem projetos
            entregues.
          </p>
        </FadeInSection>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {numerosAcervo.map((n, i) => (
            <StaggerItem key={i}>
              <div className="h-full p-6 rounded-xl bg-sv-surface/80 border border-sv-line hover:border-sv-text-3 transition-colors">
                <div className="text-3xl sm:text-4xl font-bold gradient-text">{n.valor}</div>
                <div className="text-sm font-semibold text-sv-text mt-2">{n.rotulo}</div>
                <div className="text-xs text-sv-text-2 mt-2 leading-relaxed">{n.nota}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* O que ela faz */}
        <FadeInSection>
          <div className="rounded-2xl bg-sv-surface/60 border border-sv-line p-6 sm:p-10">
            <h3 className="text-xl sm:text-2xl font-bold text-sv-text mb-2">
              Do desenho da peça ao payback, numa passada
            </h3>
            <p className="text-sm text-sv-text-2 mb-8">
              As oito etapas que a plataforma executa — e que hoje viram semanas de planilha.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {etapasPlataforma.map((e, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-sv-line">
                  <div className="text-xs font-mono text-sv-text-3 mb-1">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="text-sm font-semibold text-sv-text">{e.titulo}</div>
                  <div className="text-xs text-sv-text-2 mt-1 leading-relaxed">{e.texto}</div>
                </div>
              ))}
            </div>

            <Separator className="bg-sv-line my-8" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <p className="text-sm text-sv-text-2 max-w-xl leading-relaxed">
                A plataforma ainda não está no ar e será oferecida por{' '}
                <span className="text-sv-text-2">assinatura mensal</span>. Estamos validando
                com caso real — peça real, ciclo real, payback real. Quem entrar na lista
                de espera testa antes e ajuda a definir o que entra na primeira versão.
              </p>
              <Button
                size="lg"
                className="bg-sv-accent hover:bg-sv-accent/90 text-sv-accent-ink font-semibold shrink-0 glow-emerald-strong transition-all"
                onClick={() => {
                  document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Entrar na lista de espera
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

/* ─────────── Arquiteturas de célula (galeria) ─────────── */

// Renders das células PADRÃO do nosso acervo. São geometria de referência:
// nenhuma peça, nome ou dado de cliente aparece em nenhuma delas.
const galeriaCelulas = [
  { src: '/celulas/sw-cc1.webp', nome: 'Célula compacta', desc: 'Robô único e mesa fixa. Peça pequena a média, um operador carregando.' },
  { src: '/celulas/sw-h.webp', nome: 'Célula H — duas estações', desc: 'O robô solda numa estação enquanto o operador carrega a outra.' },
  { src: '/celulas/sw-col.webp', nome: 'Coluna com lança', desc: 'Alcance estendido para peça longa e berço de vão grande.' },
  { src: '/celulas/sw-gan.webp', nome: 'Pórtico', desc: 'Cobertura de área ampla com a peça fixa no piso.' },
  { src: '/celulas/sw-ferris.webp', nome: 'Carrossel', desc: 'Vários postos em rotação para ciclo contínuo.' },
  { src: '/celulas/sw-tt.webp', nome: 'Mesa posicionadora', desc: 'A peça gira para manter a posição de soldagem ideal.' },
]

function CelulasSection() {
  return (
    <section id="celulas" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sv-bg via-sv-bg/98 to-sv-bg" />
      <div className="absolute inset-0 grid-pattern" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInSection className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 text-xs font-medium bg-sv-surface text-sv-text-2 border-sv-line">
            Acervo
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Arquiteturas de{' '}
            <span className="gradient-text">célula</span>
          </h2>
          <p className="text-sv-text-2 text-lg max-w-2xl mx-auto">
            Seis das 23 arquiteturas do nosso acervo, usadas como base de
            dimensionamento. A escolha não é estética: ela sai da peça, do
            processo e do alcance exigido.
          </p>
        </FadeInSection>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galeriaCelulas.map((c, i) => (
            <StaggerItem key={i}>
              <div className="group h-full rounded-xl overflow-hidden bg-sv-surface/80 border border-sv-line hover:border-sv-text-3 transition-all">
                <div className="relative overflow-hidden bg-sv-surface">
                  <img
                    src={c.src}
                    alt={`Arquitetura de célula robotizada: ${c.nome}`}
                    loading="lazy"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sv-bg/60 to-transparent pointer-events-none" />
                </div>
                <div className="p-5">
                  <div className="text-base font-semibold text-sv-text">{c.nome}</div>
                  <div className="text-sm text-sv-text-2 mt-1.5 leading-relaxed">{c.desc}</div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInSection className="mt-10">
          <p className="text-xs text-sv-text-3 text-center max-w-2xl mx-auto leading-relaxed">
            Imagens geradas do nosso acervo de células padrão. Geometria de referência —
            nenhum projeto, peça ou dado de cliente é exibido.
          </p>
        </FadeInSection>
      </div>
    </section>
  )
}

/* ─────────── Contact Section ─────────── */

function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ───────────────────────────────────────────────────────────────────────────
  // ⚠ CORRIGIDO EM 30/07/2026 — ANTES ESTE FORMULÁRIO NÃO ENVIAVA NADA.
  //
  // O código anterior era:  await new Promise(r => setTimeout(r, 1500))
  // seguido de toast.success('Mensagem enviada com sucesso!'). Ou seja: o site
  // ESPERAVA 1,5 s e MENTIA para o visitante. Todo pedido de orçamento feito
  // pelo formulário desde a publicação foi perdido, sem deixar rastro.
  //
  // POR QUE WHATSAPP E NÃO UM POST PARA UMA API:
  // o site está em hospedagem GRATUITA (sem servidor para receber POST e sem
  // servidor de e-mail). Um endpoint próprio exigiria infraestrutura que ainda
  // não existe. O link wa.me não depende de servidor nenhum, funciona em
  // hospedagem estática, e no B2B industrial brasileiro o WhatsApp converte
  // melhor que e-mail — a conversa começa no aparelho de quem atende.
  // O e-mail fica como segunda via, para quem está no desktop sem WhatsApp.
  //
  // QUANDO TIVER SERVIDOR: trocar por um POST para /api/contato (ou ligar um
  // Web3Forms/Formspree, que são grátis e não exigem backend) e manter o
  // WhatsApp como atalho. A lista de campos já está pronta para isso.
  // ───────────────────────────────────────────────────────────────────────────
  const montarMensagem = () => {
    const l = [
      'Olá! Vim pelo site da Solvvo Solutions.',
      '',
      `Nome: ${formData.name}`,
      `E-mail: ${formData.email}`,
    ]
    if (formData.phone) l.push(`Telefone: ${formData.phone}`)
    if (formData.service) l.push(`Interesse: ${formData.service}`)
    if (formData.message) l.push('', 'Mensagem:', formData.message)
    return l.join('\n')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // validação mínima: sem isto o WhatsApp abre com mensagem vazia
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Preencha nome e e-mail para continuar.')
      return
    }

    setIsSubmitting(true)
    const texto = montarMensagem()
    const url = `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(texto)}`

    // abre numa aba nova; se o navegador bloquear o popup, navega na mesma aba
    const aba = window.open(url, '_blank', 'noopener,noreferrer')
    if (!aba) window.location.href = url

    setIsSubmitting(false)
    toast.success('Abrindo o WhatsApp com seus dados…', {
      description: 'Se não abrir, use o botão de e-mail abaixo — respondemos em até 24 h úteis.',
    })
  }

  // Segunda via, sem servidor: abre o cliente de e-mail já preenchido.
  const enviarPorEmail = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Preencha nome e e-mail para continuar.')
      return
    }
    const assunto = `Contato pelo site — ${formData.name}${formData.service ? ` (${formData.service})` : ''}`
    window.location.href =
      `mailto:${CONTATO.email}?subject=${encodeURIComponent(assunto)}`
      + `&body=${encodeURIComponent(montarMensagem())}`
  }

  return (
    <section id="contato" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sv-bg via-sv-bg/98 to-sv-bg" />
      <div className="absolute inset-0 grid-pattern" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInSection className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 text-xs font-medium bg-sv-surface text-sv-text-2 border-sv-line">
            Fale conosco
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Entre em <span className="gradient-text">Contato</span>
          </h2>
          <p className="text-sv-text-2 text-lg max-w-2xl mx-auto">
            Estamos prontos para ajudar sua empresa a dar o próximo passo na transformação digital.
          </p>
        </FadeInSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info */}
          <FadeInSection className="lg:col-span-2" delay={0.1}>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-sv-text mb-4">Informações de Contato</h3>
                <p className="text-sv-text-2 text-sm leading-relaxed">
                  Entre em contato conosco para discutir como podemos ajudar sua empresa a implementar soluções de manufatura digital.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-sv-surface/80 border border-sv-line hover:border-sv-line transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-sv-surface flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-sv-text-2" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-sv-text">E-mail</div>
                    <a
                      href={`mailto:${CONTATO.email}`}
                      className="text-sm text-sv-text-2 hover:text-sv-text transition-colors"
                    >
                      {CONTATO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-sv-surface/80 border border-sv-line hover:border-sv-line transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-sv-surface flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-sv-text-2" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-sv-text">Telefone</div>
                    <a
                      href={`https://wa.me/${CONTATO.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-sv-text-2 hover:text-sv-text transition-colors"
                    >
                      {CONTATO.telefoneVisivel} · WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-sv-surface/80 border border-sv-line hover:border-sv-line transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-sv-surface flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-sv-text-2" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-sv-text">Endereço</div>
                    <div className="text-sm text-sv-text-2">Caxias do Sul, RS - Brasil</div>
                  </div>
                </div>
              </div>

              {REDES.some((r) => r.url) && (
                <>
                  <Separator className="bg-sv-line" />
                  <div>
                    <div className="text-sm font-medium text-sv-text mb-3">Redes Sociais</div>
                    <div className="flex gap-3">
                      {REDES.filter((r) => r.url).map((r) => {
                        const Icon = r.nome === 'LinkedIn' ? Linkedin
                          : r.nome === 'Instagram' ? Instagram : Youtube
                        return (
                          <a
                            key={r.nome}
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={r.nome}
                            className="w-10 h-10 rounded-lg bg-sv-surface border border-sv-line flex items-center justify-center text-sv-text-2 hover:text-sv-text hover:border-sv-text-3 hover:bg-sv-surface transition-all"
                          >
                            <Icon className="w-4 h-4" />
                          </a>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </FadeInSection>

          {/* Contact Form */}
          <FadeInSection className="lg:col-span-3" delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Card className="bg-sv-surface/80 border-sv-line p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm text-sv-text-2">
                      Nome completo *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-sv-bg border-sv-line text-sv-text placeholder:text-sv-text-3 focus-visible:border-sv-accent focus-visible:ring-sv-accent/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-sv-text-2">
                      E-mail *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-sv-bg border-sv-line text-sv-text placeholder:text-sv-text-3 focus-visible:border-sv-accent focus-visible:ring-sv-accent/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm text-sv-text-2">
                      Telefone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-sv-bg border-sv-line text-sv-text placeholder:text-sv-text-3 focus-visible:border-sv-accent focus-visible:ring-sv-accent/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-sm text-sv-text-2">
                      Serviço de interesse *
                    </Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
                      required
                    >
                      <SelectTrigger className="w-full bg-sv-bg border-sv-line text-sv-text focus:ring-sv-accent/20 focus:ring-offset-0 [&_svg]:text-sv-text-3">
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      {/* O `value` é o texto que vai LITERAL para a mensagem do
                          WhatsApp ("Interesse: ..."). Antes eram slugs, e quem
                          recebia lia "Interesse: manufatura-aditiva". */}
                      <SelectContent className="bg-sv-surface border-sv-line">
                        {SERVICOS_FORMULARIO.map((s) => (
                          <SelectItem
                            key={s}
                            value={s}
                            className="text-sv-text-2 focus:text-sv-text focus:bg-sv-surface"
                          >
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 mt-5">
                  <Label htmlFor="message" className="text-sm text-sv-text-2">
                    Mensagem *
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Descreva seu projeto ou necessidade..."
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-sv-bg border-sv-line text-sv-text placeholder:text-sv-text-3 focus-visible:border-sv-accent focus-visible:ring-sv-accent/20 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-sv-accent hover:bg-sv-accent/90 text-sv-accent-ink font-semibold py-6 text-base glow-emerald-strong transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        className="w-4 h-4 border-2 border-sv-accent-ink/30 border-t-sv-accent-ink rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Enviar pelo WhatsApp
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                {/* Segunda via para quem está no desktop sem WhatsApp.
                    type="button" para NÃO disparar o submit do formulário. */}
                <button
                  type="button"
                  onClick={enviarPorEmail}
                  className="w-full mt-3 text-sm text-sv-text-2 hover:text-sv-text underline underline-offset-4 decoration-sv-line transition-colors"
                >
                  Prefiro enviar por e-mail
                </button>

                <p className="text-xs text-sv-text-2 mt-4 text-center leading-relaxed">
                  Resposta em até 24 horas úteis. Seus dados vão direto para a nossa
                  equipe — não usamos para mais nada.
                </p>
              </Card>
            </form>
          </FadeInSection>
        </div>
      </div>
    </section>
  )
}

/* ─────────── Footer ─────────── */

function Footer() {
  return (
    <footer className="relative border-t border-sv-line bg-sv-surface">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#inicio" className="flex items-center gap-2 mb-4">
              <img
                src="/logo-solvvo.png"
                alt="Solvvo"
                className="h-8 w-auto object-contain drop-shadow-lg"
              />
            </a>
            <p className="text-sm text-sv-text-2 leading-relaxed max-w-xs">
              Estudo de aplicação para células robotizadas e sistemas de automação.
              Engenharia independente, com procedência em cada número.
            </p>
            <div className="flex gap-3 mt-5">
              {REDES.filter((r) => r.url).map((r) => {
                const Icon = r.nome === 'LinkedIn' ? Linkedin
                  : r.nome === 'Instagram' ? Instagram : Youtube
                return (
                  <a
                    key={r.nome}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={r.nome}
                    className="w-8 h-8 rounded-md bg-sv-surface border border-sv-line flex items-center justify-center text-sv-text-3 hover:text-sv-text hover:border-sv-text-3 transition-all"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-sv-text uppercase tracking-wider mb-4">
              Serviços
            </h4>
            <ul className="space-y-2.5">
              {SERVICOS_RODAPE.map((link, i) => (
                <li key={i}>
                  <a
                    href="#servicos"
                    className="text-sm text-sv-text-3 hover:text-sv-text transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-sv-text uppercase tracking-wider mb-4">
              Empresa
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Sobre Nós', href: '#sobre' },
                { label: 'Aplicações', href: '#cases' },
                { label: 'Contato', href: '#contato' },
                // "Blog" saiu em 05/08/2026: apontava para "#" e não existe blog.
              ].map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-sm text-sv-text-3 hover:text-sv-text transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-sv-text uppercase tracking-wider mb-4">
              Contato
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-sv-text-3 mt-0.5 shrink-0" />
                <span className="text-sm text-sv-text-3">contato@solvvo.com.br</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-sv-text-3 mt-0.5 shrink-0" />
                <span className="text-sm text-sv-text-3">(54) 9 8153-5018</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sv-text-3 mt-0.5 shrink-0" />
                <span className="text-sm text-sv-text-3">Caxias do Sul<br />RS - Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-sv-line" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-sv-text-3">
            © {new Date().getFullYear()} Solvvo. Todos os direitos reservados.
          </p>
          {/* "Termos de Uso" saiu em 05/08/2026: apontava para "#" e não há
              plataforma, login nem transação que exijam termos. Página vazia
              só para tapar link é pior que link nenhum. A Política de
              Privacidade, ao contrário, é obrigação de LGPD — o formulário
              coleta dado pessoal — e agora tem rota de verdade. */}
          <div className="flex gap-6">
            <a
              href="/politica-de-privacidade"
              className="text-xs text-sv-text-3 hover:text-sv-text transition-colors"
            >
              Política de Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─────────── Main Page ─────────── */

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-sv-bg">
      {/* O degradê ambiente da marca que ficava aqui foi removido em
          05/08/2026. Ele cobria a tela inteira em mix-blend-mode: screen, o
          que clareava e tingia TODA imagem da página — inclusive os renders de
          célula e o desenho técnico, que são o melhor ativo visual da empresa e
          o que a nova direção existe para valorizar. A assinatura da marca
          continua, reduzida à faixa de 3px abaixo. */}
      {/* Faixa de assinatura no topo, como no rodapé das peças de post. */}
      <div className="brand-bar fixed top-0 left-0 right-0 z-50" aria-hidden="true" />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <PlataformaSection />
        <ServicesSection />
        <CelulasSection />
        <AplicacoesSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
