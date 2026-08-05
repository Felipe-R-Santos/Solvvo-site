'use client'

import { useState, FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowRight } from 'lucide-react'
import { CONTATO, abrirWhatsApp } from '@/lib/contato'

// ─────────────────────────────────────────────────────────────────────────────
// FORMULÁRIO DO PRÉ-ESTUDO
//
// Não é o formulário genérico da home. CADA CAMPO AQUI É UMA VARIÁVEL DE
// ENTRADA DO PRÉ-ESTUDO, não campo de captação: tipo de aplicação decide a
// família de arquitetura, existência de modelo 3D decide se entra Scan 3D,
// volume decide o regime, prazo decide a fila. Padronizar a entrada agora é o
// que torna possível automatizar depois — por isso os valores são fechados onde
// dá para fechar, e não texto livre.
//
// DESTINO: o mesmo do formulário da home — WhatsApp, com e-mail como segunda
// via. O site não tem servidor. Ver o comentário longo em app/page.tsx.
// ─────────────────────────────────────────────────────────────────────────────

const TIPOS_APLICACAO = [
  'Soldagem',
  'Manipulação e paletização',
  'Carga e descarga de máquina',
  'Outro',
]

const TEM_DESENHO = ['Sim', 'Não', 'Parcial']

type Campos = {
  nome: string
  empresa: string
  email: string
  telefone: string
  aplicacao: string
  desenho: string
  volume: string
  prazo: string
  descricao: string
  arquivo: string
}

const VAZIO: Campos = {
  nome: '', empresa: '', email: '', telefone: '',
  aplicacao: '', desenho: '', volume: '', prazo: '',
  descricao: '', arquivo: '',
}

export function FormularioPreEstudo() {
  const [dados, setDados] = useState<Campos>(VAZIO)
  const [enviando, setEnviando] = useState(false)

  const set = (campo: keyof Campos) => (valor: string) =>
    setDados((d) => ({ ...d, [campo]: valor }))

  /**
   * A mensagem vai em BLOCOS ROTULADOS, não em texto corrido.
   *
   * Quem recebe lê no celular, no meio do dia, e precisa bater o olho e saber
   * se dá para começar. Rótulo fixo em cada linha também é o que permite, mais
   * adiante, um robô ler a mensagem e preencher o estudo sem ambiguidade.
   * Campo não preenchido é OMITIDO em vez de sair vazio: linha com rótulo e
   * nada do lado ocupa espaço e não informa.
   */
  function montarMensagem() {
    const l: string[] = [
      '*Solicitação de pré-estudo — solvvo.com.br*',
      '',
      '*Quem*',
      `Nome: ${dados.nome}`,
      `Empresa: ${dados.empresa}`,
      `E-mail: ${dados.email}`,
      `Telefone: ${dados.telefone}`,
      '',
      '*Aplicação*',
      `Tipo: ${dados.aplicacao}`,
      `Peça tem desenho ou modelo 3D: ${dados.desenho}`,
    ]
    if (dados.volume) l.push(`Volume pretendido: ${dados.volume} peças/mês`)
    if (dados.prazo) l.push(`Precisa da resposta em: ${dados.prazo}`)
    if (dados.arquivo) l.push('', '*Arquivos*', dados.arquivo)
    if (dados.descricao) l.push('', '*Descrição*', dados.descricao)
    return l.join('\n')
  }

  function faltando() {
    const obrigatorios: [keyof Campos, string][] = [
      ['nome', 'nome'],
      ['empresa', 'empresa'],
      ['email', 'e-mail'],
      ['telefone', 'telefone'],
      ['aplicacao', 'tipo de aplicação'],
      ['desenho', 'se a peça tem desenho'],
    ]
    return obrigatorios.filter(([c]) => !dados[c].trim()).map(([, r]) => r)
  }

  function enviar(e: FormEvent) {
    e.preventDefault()
    const faltam = faltando()
    if (faltam.length) {
      toast.error(`Falta preencher: ${faltam.join(', ')}.`)
      return
    }
    setEnviando(true)
    abrirWhatsApp(montarMensagem())
    setEnviando(false)
    toast.success('Abrindo o WhatsApp com os seus dados…', {
      description:
        'Se não abrir, use o envio por e-mail abaixo. Respondemos em até 24 h úteis.',
    })
  }

  function enviarPorEmail() {
    const faltam = faltando()
    if (faltam.length) {
      toast.error(`Falta preencher: ${faltam.join(', ')}.`)
      return
    }
    const assunto = `Pré-estudo — ${dados.empresa} (${dados.aplicacao})`
    window.location.href =
      `mailto:${CONTATO.email}?subject=${encodeURIComponent(assunto)}` +
      `&body=${encodeURIComponent(montarMensagem().replace(/\*/g, ''))}`
  }

  const campo =
    'bg-sv-bg border-sv-line text-sv-text placeholder:text-sv-text-3 ' +
    'focus-visible:border-sv-accent focus-visible:ring-sv-accent/20'

  return (
    <form onSubmit={enviar} className="rounded border border-sv-line bg-sv-surface/60 p-6 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="nome" className="text-sm text-sv-text-2">Nome *</Label>
          <Input id="nome" required value={dados.nome}
            onChange={(e) => set('nome')(e.target.value)}
            placeholder="Seu nome" className={campo} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="empresa" className="text-sm text-sv-text-2">Empresa *</Label>
          <Input id="empresa" required value={dados.empresa}
            onChange={(e) => set('empresa')(e.target.value)}
            placeholder="Razão social ou nome fantasia" className={campo} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-sv-text-2">E-mail *</Label>
          <Input id="email" type="email" required value={dados.email}
            onChange={(e) => set('email')(e.target.value)}
            placeholder="voce@empresa.com.br" className={campo} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefone" className="text-sm text-sv-text-2">Telefone *</Label>
          <Input id="telefone" type="tel" required value={dados.telefone}
            onChange={(e) => set('telefone')(e.target.value)}
            placeholder="(00) 00000-0000" className={campo} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="aplicacao" className="text-sm text-sv-text-2">
            Tipo de aplicação *
          </Label>
          <Select value={dados.aplicacao} onValueChange={set('aplicacao')}>
            <SelectTrigger id="aplicacao"
              className="w-full bg-sv-bg border-sv-line text-sv-text focus:ring-sv-accent/20 focus:ring-offset-0 [&_svg]:text-sv-text-3">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-sv-surface border-sv-line">
              {TIPOS_APLICACAO.map((t) => (
                <SelectItem key={t} value={t}
                  className="text-sv-text-2 focus:text-sv-text focus:bg-sv-bg">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="desenho" className="text-sm text-sv-text-2">
            A peça tem desenho ou modelo 3D? *
          </Label>
          <Select value={dados.desenho} onValueChange={set('desenho')}>
            <SelectTrigger id="desenho"
              className="w-full bg-sv-bg border-sv-line text-sv-text focus:ring-sv-accent/20 focus:ring-offset-0 [&_svg]:text-sv-text-3">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-sv-surface border-sv-line">
              {TEM_DESENHO.map((t) => (
                <SelectItem key={t} value={t}
                  className="text-sv-text-2 focus:text-sv-text focus:bg-sv-bg">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="volume" className="text-sm text-sv-text-2">
            Volume de produção pretendido
          </Label>
          <Input id="volume" inputMode="numeric" value={dados.volume}
            onChange={(e) => set('volume')(e.target.value)}
            placeholder="peças por mês" className={campo} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prazo" className="text-sm text-sv-text-2">
            Prazo em que precisa da resposta
          </Label>
          <Input id="prazo" value={dados.prazo}
            onChange={(e) => set('prazo')(e.target.value)}
            placeholder="ex.: até 20/08, ou o quanto antes" className={campo} />
        </div>
      </div>

      <div className="space-y-2 mt-5">
        <Label htmlFor="arquivo" className="text-sm text-sv-text-2">
          Onde está o arquivo?
        </Label>
        <Input id="arquivo" value={dados.arquivo}
          onChange={(e) => set('arquivo')(e.target.value)}
          placeholder="link do Drive, WeTransfer — ou 'mando por WhatsApp'"
          className={campo} />
        {/* O envio é por WhatsApp e por e-mail, e nenhum dos dois transporta
            anexo a partir de um link. Este campo existe no lugar do upload:
            no mercado industrial brasileiro o cliente manda desenho e foto de
            peça por WhatsApp naturalmente. */}
        <p className="text-xs text-sv-text-3 leading-relaxed">
          Pode mandar o desenho depois, na própria conversa.
        </p>
      </div>

      <div className="space-y-2 mt-5">
        <Label htmlFor="descricao" className="text-sm text-sv-text-2">
          Descrição livre
        </Label>
        <Textarea id="descricao" rows={5} value={dados.descricao}
          onChange={(e) => set('descricao')(e.target.value)}
          placeholder="Material, espessura, cordões de solda, área disponível, turnos — quanto mais entrada, mais firme o número."
          className={`${campo} resize-none`} />
      </div>

      <Button type="submit" disabled={enviando}
        className="w-full mt-6 bg-sv-accent hover:bg-sv-accent/90 text-sv-accent-ink font-medium py-6 text-base">
        <span className="flex items-center gap-2">
          Solicitar pré-estudo pelo WhatsApp
          <ArrowRight className="w-4 h-4" />
        </span>
      </Button>

      {/* type="button" para NÃO disparar o submit do formulário. */}
      <button type="button" onClick={enviarPorEmail}
        className="w-full mt-3 text-sm text-sv-text-2 hover:text-sv-text underline underline-offset-4 decoration-sv-line transition-colors">
        Prefiro enviar por e-mail
      </button>

      <p className="text-xs text-sv-text-3 mt-4 text-center leading-relaxed">
        Resposta em até 24 horas úteis. Seus dados vão direto para a nossa
        equipe — veja a{' '}
        <a href="/politica-de-privacidade" className="underline underline-offset-2 hover:text-sv-text">
          Política de Privacidade
        </a>.
      </p>
    </form>
  )
}
