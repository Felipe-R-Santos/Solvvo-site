'use client'

import { useState, useRef, FormEvent } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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
  { label: 'Serviços', href: '#servicos' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Cases', href: '#cases' },
  { label: 'Contato', href: '#contato' },
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
          ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[rgba(16,185,129,0.1)] shadow-lg shadow-black/20'
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
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-emerald-400 rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
          <Button
            onClick={() => {
              document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="ml-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
          >
            Orçamento
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Mobile hamburger */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/5">
              <Menu className="w-6 h-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#0a0a0a] border-[rgba(16,185,129,0.15)] w-80">
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
                    className="px-4 py-3 text-base font-medium text-gray-300 hover:text-emerald-400 rounded-lg hover:bg-white/5 transition-all"
                  >
                    {link.label}
                  </a>
                </SheetClose>
              ))}
              <Separator className="my-3 bg-[rgba(16,185,129,0.1)]" />
              <SheetClose asChild>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold w-full"
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
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.png"
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/80 to-[#0a0a0a]" />
        <div className="absolute inset-0 grid-pattern" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
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
            className="h-28 sm:h-36 md:h-44 lg:h-52 w-auto object-contain mx-auto drop-shadow-2xl mb-8"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        >
          <Badge className="mb-6 px-4 py-1.5 text-sm font-medium bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15 transition-colors">
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Soluções em Indústria 4.0
          </Badge>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
        >
          Transforme sua{' '}
          <span className="gradient-text">Manufatura</span>
          <br />
          com Tecnologia Digital
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          Soluções avançadas em Scan 3D, Digital Twin e automação industrial para impulsionar a eficiência e inovação da sua empresa.
        </motion.p>

        <motion.div
          className="max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
        >
          <blockquote className="relative border-l-2 border-emerald-500/40 pl-4 sm:pl-6">
            <p className="text-base sm:text-lg italic text-emerald-300/80 leading-relaxed">
              "Em breve, as fábricas serão fábricas de fábricas..."
            </p>
            <p className="text-sm text-gray-500 mt-2">— Felipe R. Santos, fundador da Solvvo</p>
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
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base px-8 py-6 h-auto glow-emerald-strong hover:glow-emerald-strong transition-all"
            onClick={() => {
              document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Solicitar Orçamento
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 font-semibold text-base px-8 py-6 h-auto transition-all"
            onClick={() => {
              document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Conheça Nossos Serviços
          </Button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        >
          {[
            { value: '500+', label: 'Projetos' },
            { value: '200+', label: 'Clientes' },
            { value: '10+', label: 'Anos' },
            { value: '99%', label: 'Precisão' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
        <ChevronUp className="w-4 h-4 text-gray-500 rotate-180" />
      </motion.div>
    </section>
  )
}

/* ─────────── Services Section ─────────── */

const services = [
  {
    icon: ScanLine,
    title: 'Scan 3D',
    description:
      'Digitalização tridimensional de alta precisão para engenharia reversa, inspeção de qualidade e controle dimensional de peças e componentes industriais.',
    features: ['Engenharia Reversa', 'Inspeção Dimensional', 'Modelo 3D'],
  },
  {
    icon: Layers,
    title: 'Digital Twin',
    description:
      'Criação de réplicas virtuais inteligentes de ativos físicos para monitoramento em tempo real, simulação preditiva e otimização de processos.',
    features: ['Monitoramento em Tempo Real', 'Simulação', 'Predição'],
  },
  {
    icon: Printer,
    title: 'Manufatura Aditiva',
    description:
      'Serviços de prototipagem rápida e produção por impressão 3D em materiais avançados, reduzindo lead time e custos de desenvolvimento.',
    features: ['Prototipagem Rápida', 'Impressão 3D', 'Peças Sob Medida'],
  },
  {
    icon: Cpu,
    title: 'Automação Industrial',
    description:
      'Integração de IoT, sensores e sistemas de controle para fábricas inteligentes, aumentando produtividade e reduzindo paradas não planejadas.',
    features: ['IoT Industrial', 'Fábrica Inteligente', 'Controle Avançado'],
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/95 to-[#0a0a0a]" />
        <div className="absolute inset-0 grid-pattern" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInSection className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            O que fazemos
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Nossas <span className="gradient-text">Soluções</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Oferecemos soluções completas em manufatura digital, combinando tecnologia de ponta com expertise industrial para transformar sua operação.
          </p>
        </FadeInSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <StaggerItem key={i}>
                <Card className="group relative bg-[#111111]/80 border-[rgba(16,185,129,0.1)] hover:border-emerald-500/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/5 overflow-hidden">
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-transparent transition-all duration-500" />
                  <CardHeader className="relative pb-2">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/15 group-hover:border-emerald-500/30 transition-all group-hover:scale-110 duration-300 shrink-0">
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {service.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-gray-400 leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.features.map((f, j) => (
                        <Badge
                          key={j}
                          variant="outline"
                          className="text-xs border-[rgba(16,185,129,0.15)] text-emerald-400/80 bg-emerald-500/5"
                        >
                          {f}
                        </Badge>
                      ))}
                    </div>
                    <a
                      href="#contato"
                      className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors group/link"
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
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/98 to-[#0a0a0a]" />
      <div className="absolute inset-0 grid-pattern" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <FadeInSection>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden glow-emerald">
                <img
                  src="/about-img.png"
                  alt="Engenheiro analisando modelo digital twin"
                  className="w-full h-auto object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/30 to-transparent" />
              </div>
            </div>
          </FadeInSection>

          {/* Text */}
          <FadeInSection delay={0.2}>
            <div>
              <Badge className="mb-4 px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                Sobre nós
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Sobre a{' '}
                <span className="gradient-text">Solvvo</span>
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  A <span className="text-emerald-400 font-medium">Solvvo</span> é especialista em soluções de manufatura digital. Combinamos tecnologia de ponta com expertise industrial para ajudar empresas a transformar suas operações por meio de Scan 3D, Digital Twin e automação inteligente.
                </p>
                <p>
                  Nossa missão é democratizar o acesso a tecnologias como Scan 3D, Digital Twin e impressão 3D, tornando-as acessíveis e aplicáveis para negócios de todos os portes. Acreditamos que a digitalização é o caminho para uma indústria mais eficiente, sustentável e competitiva.
                </p>
                <p>
                  Com uma equipe multidisciplinar de engenheiros, designers e especialistas em tecnologia, entregamos projetos com excelência e compromisso com resultados mensuráveis.
                </p>
              </div>

              {/* Values */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {[
                  { icon: Target, label: 'Missão', text: 'Digitalizar a indústria brasileira' },
                  { icon: Eye, label: 'Visão', text: 'Ser referência global em manufatura digital' },
                  { icon: Shield, label: 'Valores', text: 'Inovação, excelência e confiança' },
                ].map((v, i) => {
                  const Icon = v.icon
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[#111111]/50 border border-[rgba(16,185,129,0.08)]">
                      <Icon className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-white">{v.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{v.text}</div>
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

/* ─────────── Cases Section ─────────── */

const cases = [
  {
    icon: Car,
    industry: 'Automotivo',
    title: 'Inspeção de peças automotivas com Scan 3D',
    description:
      'Implementação de sistema de inspeção dimensional por Scan 3D para uma montadora de veículos, garantindo qualidade e rastreabilidade de componentes críticos.',
    metrics: [
      { label: 'Redução de defeitos', value: '73%' },
      { label: 'Ganho de eficiência', value: '45%' },
      { label: 'ROI atingido em', value: '8 meses' },
    ],
  },
  {
    icon: Plane,
    industry: 'Aeroespacial',
    title: 'Digital Twin para componentes aeroespaciais',
    description:
      'Desenvolvimento de Digital Twins para motores e turbinas, permitindo simulação preditiva e manutenção baseada em condição para operadora aérea.',
    metrics: [
      { label: 'Redução de downtime', value: '60%' },
      { label: 'Economia anual', value: 'R$ 2.5M' },
      { label: 'Precisão da previsão', value: '94%' },
    ],
  },
  {
    icon: Fuel,
    industry: 'Óleo & Gás',
    title: 'Manufatura aditiva para peças de reposição',
    description:
      'Produção de peças sob demanda por manufatura aditiva para plataforma offshore, eliminando estoque e reduzindo tempo de parada para manutenção.',
    metrics: [
      { label: 'Redução de estoque', value: '80%' },
      { label: 'Lead time reduzido', value: '90%' },
      { label: 'Peças produzidas', value: '1.200+' },
    ],
  },
]

function CasesSection() {
  return (
    <section id="cases" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/98 to-[#0a0a0a]" />
      <div className="absolute inset-0 grid-pattern" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInSection className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            Resultados comprovados
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Cases de <span className="gradient-text">Sucesso</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Conheça alguns dos projetos que transformaram a operação de nossos clientes em diferentes setores industriais.
          </p>
        </FadeInSection>

        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {cases.map((caseItem, i) => {
            const Icon = caseItem.icon
            return (
              <StaggerItem key={i}>
                <Card className="group h-full bg-[#111111]/80 border-[rgba(16,185,129,0.1)] hover:border-emerald-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/5 overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors">
                        <Icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <Badge variant="outline" className="text-xs border-[rgba(16,185,129,0.15)] text-emerald-400/80 bg-emerald-500/5">
                        {caseItem.industry}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                      {caseItem.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                      {caseItem.description}
                    </p>
                    {/* Metrics */}
                    <div className="space-y-3">
                      {caseItem.metrics.map((metric, j) => (
                        <div key={j} className="flex items-center justify-between py-2 border-t border-[rgba(16,185,129,0.08)]">
                          <span className="text-sm text-gray-500">{metric.label}</span>
                          <span className="text-sm font-bold text-emerald-400">{metric.value}</span>
                        </div>
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

function FounderSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/98 to-[#0a0a0a]" />
      <div className="absolute inset-0 grid-pattern" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Photo */}
          <FadeInSection>
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div className="relative rounded-2xl overflow-hidden glow-emerald">
                <img
                  src="/felipe-foto.jpg"
                  alt="Felipe R. Santos - Fundador da Solvvo"
                  className="w-full h-auto object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/40 to-transparent" />
              </div>
              {/* Floating card */}
              <motion.div
                className="absolute -bottom-4 -right-2 sm:right-4 bg-[#111111] border border-emerald-500/20 rounded-xl px-4 py-3 glow-emerald"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Fundador</div>
                    <div className="text-xs text-gray-500">Solvvo</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </FadeInSection>

          {/* Text */}
          <FadeInSection delay={0.2}>
            <div>
              <Badge className="mb-4 px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                Quem somos
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Conheça o{' '}
                <span className="gradient-text">Fundador</span>
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Felipe R. Santos é o fundador e CEO da <span className="text-emerald-400 font-medium">Solvvo</span>, empresa especialista em soluções de manufatura digital. Com visão inovadora e paixão por tecnologia, Felipe lidera a missão de transformar a indústria brasileira por meio de ferramentas como Scan 3D, Digital Twin e automação inteligente.
                </p>
                <p>
                  Com experiência prática e conhecimento profundo do setor industrial, Felipe construiu a Solvvo com o objetivo de democratizar o acesso a tecnologias avançadas, tornando-as acessíveis para empresas de todos os portes e segmentos.
                </p>
              </div>

              {/* Quote */}
              <div className="mt-8 p-6 rounded-xl bg-[#111111]/80 border border-emerald-500/10">
                <blockquote className="relative border-l-2 border-emerald-500 pl-4">
                  <p className="text-lg sm:text-xl italic text-emerald-300 leading-relaxed mb-2">
                    "Em breve, as fábricas serão fábricas de fábricas..."
                  </p>
                  <p className="text-sm text-gray-500">Você está pronto para este momento?</p>
                </blockquote>
                <p className="text-sm text-emerald-400 mt-4 font-medium">— Felipe R. Santos</p>
              </div>
            </div>
          </FadeInSection>
        </div>
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    toast.success('Mensagem enviada com sucesso!', {
      description: 'Entraremos em contato em até 24 horas úteis.',
    })
    setFormData({ name: '', email: '', phone: '', service: '', message: '' })
  }

  return (
    <section id="contato" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/98 to-[#0a0a0a]" />
      <div className="absolute inset-0 grid-pattern" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInSection className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            Fale conosco
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Entre em <span className="gradient-text">Contato</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Estamos prontos para ajudar sua empresa a dar o próximo passo na transformação digital.
          </p>
        </FadeInSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info */}
          <FadeInSection className="lg:col-span-2" delay={0.1}>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Informações de Contato</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Entre em contato conosco para discutir como podemos ajudar sua empresa a implementar soluções de manufatura digital.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#111111]/80 border border-[rgba(16,185,129,0.08)] hover:border-emerald-500/20 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">E-mail</div>
                    <div className="text-sm text-gray-400">contato@solvvo.com.br</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#111111]/80 border border-[rgba(16,185,129,0.08)] hover:border-emerald-500/20 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Telefone</div>
                    <div className="text-sm text-gray-400">(54) 9 8153-5018</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#111111]/80 border border-[rgba(16,185,129,0.08)] hover:border-emerald-500/20 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Endereço</div>
                    <div className="text-sm text-gray-400">Caxias do Sul, RS - Brasil</div>
                  </div>
                </div>
              </div>

              <Separator className="bg-[rgba(16,185,129,0.1)]" />

              {/* Social Links */}
              <div>
                <div className="text-sm font-medium text-white mb-3">Redes Sociais</div>
                <div className="flex gap-3">
                  {[
                    { icon: Linkedin, label: 'LinkedIn' },
                    { icon: Instagram, label: 'Instagram' },
                    { icon: Youtube, label: 'YouTube' },
                  ].map((social, i) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={i}
                        href="#"
                        aria-label={social.label}
                        className="w-10 h-10 rounded-lg bg-[#111111] border border-[rgba(16,185,129,0.1)] flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </FadeInSection>

          {/* Contact Form */}
          <FadeInSection className="lg:col-span-3" delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Card className="bg-[#111111]/80 border-[rgba(16,185,129,0.1)] p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm text-gray-300">
                      Nome completo *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-[#0a0a0a] border-[rgba(16,185,129,0.1)] text-white placeholder:text-gray-600 focus-visible:border-emerald-500/40 focus-visible:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-gray-300">
                      E-mail *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-[#0a0a0a] border-[rgba(16,185,129,0.1)] text-white placeholder:text-gray-600 focus-visible:border-emerald-500/40 focus-visible:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm text-gray-300">
                      Telefone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-[#0a0a0a] border-[rgba(16,185,129,0.1)] text-white placeholder:text-gray-600 focus-visible:border-emerald-500/40 focus-visible:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-sm text-gray-300">
                      Serviço de interesse *
                    </Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
                      required
                    >
                      <SelectTrigger className="w-full bg-[#0a0a0a] border-[rgba(16,185,129,0.1)] text-white focus:ring-emerald-500/20 focus:ring-offset-0 [&_svg]:text-gray-500">
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111111] border-[rgba(16,185,129,0.15)]">
                        <SelectItem value="scan3d" className="text-gray-300 focus:text-white focus:bg-emerald-500/10">
                          Scan 3D
                        </SelectItem>
                        <SelectItem value="digital-twin" className="text-gray-300 focus:text-white focus:bg-emerald-500/10">
                          Digital Twin
                        </SelectItem>
                        <SelectItem value="manufatura-aditiva" className="text-gray-300 focus:text-white focus:bg-emerald-500/10">
                          Manufatura Aditiva
                        </SelectItem>
                        <SelectItem value="automacao" className="text-gray-300 focus:text-white focus:bg-emerald-500/10">
                          Automação Industrial
                        </SelectItem>
                        <SelectItem value="outro" className="text-gray-300 focus:text-white focus:bg-emerald-500/10">
                          Outro
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 mt-5">
                  <Label htmlFor="message" className="text-sm text-gray-300">
                    Mensagem *
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Descreva seu projeto ou necessidade..."
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-[#0a0a0a] border-[rgba(16,185,129,0.1)] text-white placeholder:text-gray-600 focus-visible:border-emerald-500/40 focus-visible:ring-emerald-500/20 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-6 text-base glow-emerald-strong transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Enviar Mensagem
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
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
    <footer className="relative border-t border-[rgba(16,185,129,0.1)] bg-[#050505]">
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
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Soluções avançadas em manufatura digital para impulsionar a transformação industrial do seu negócio.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Youtube, label: 'YouTube' },
              ].map((social, i) => {
                const Icon = social.icon
                return (
                  <a
                    key={i}
                    href="#"
                    aria-label={social.label}
                    className="w-8 h-8 rounded-md bg-[#111111] border border-[rgba(16,185,129,0.08)] flex items-center justify-center text-gray-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Serviços
            </h4>
            <ul className="space-y-2.5">
              {['Scan 3D', 'Digital Twin', 'Manufatura Aditiva', 'Automação Industrial'].map((link, i) => (
                <li key={i}>
                  <a
                    href="#servicos"
                    className="text-sm text-gray-500 hover:text-emerald-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Empresa
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Sobre Nós', href: '#sobre' },
                { label: 'Cases de Sucesso', href: '#cases' },
                { label: 'Contato', href: '#contato' },
                { label: 'Blog', href: '#' },
              ].map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contato
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-500">contato@solvvo.com.br</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-500">(54) 9 8153-5018</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-500">Caxias do Sul<br />RS - Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-[rgba(16,185,129,0.08)]" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Solvvo. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-600 hover:text-emerald-400 transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="text-xs text-gray-600 hover:text-emerald-400 transition-colors">
              Termos de Uso
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
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <CasesSection />
        <FounderSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
