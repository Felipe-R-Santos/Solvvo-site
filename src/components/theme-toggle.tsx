'use client'

import { Sun, Moon } from 'lucide-react'
import { CHAVE_TEMA } from '@/lib/tema'

// ─────────────────────────────────────────────────────────────────────────────
// BOTÃO DE TEMA
//
// Ele NÃO guarda o tema em estado do React, de propósito. Duas razões:
//
// 1. Hidratação: o tema real é decidido pelo script anti-flash, que roda no
//    navegador antes de o React existir. Se o componente guardasse o valor em
//    estado, o servidor renderizaria um ícone e o navegador outro — e o React
//    reclamaria de divergência de hidratação a cada carregamento.
//
// 2. Ler o DOM dentro de um useEffect para depois chamar setState é
//    exatamente o padrão que o ESLint acusa em react-hooks/set-state-in-effect.
//    Era o único erro de lint do projeto, no use-mobile.ts que a Fase 3 apagou;
//    não faz sentido reintroduzi-lo aqui.
//
// Solução: os dois ícones são renderizados sempre, e o CSS esconde o que não
// vale para o tema corrente — ver as regras .sv-tema-sol / .sv-tema-lua em
// globals.css. O clique mexe direto no atributo data-theme do <html>, que é a
// mesma coisa que o script anti-flash escreve. Uma fonte só.
// ─────────────────────────────────────────────────────────────────────────────

// Cores da barra de endereço, iguais ao --sv-bg de cada tema.
const COR_BARRA = { dark: '#1A1A1A', light: '#F4F2ED' } as const

/**
 * Faz a barra do navegador acompanhar o tema ESCOLHIDO, e não o do sistema.
 *
 * O layout declara dois <meta name="theme-color"> com media query, e eles
 * resolvem o primeiro carregamento. Mas a media segue a preferência do SISTEMA:
 * quem está com o sistema no escuro e escolhe o tema claro ficaria com a barra
 * de endereço escura sobre página clara — visível e feio no celular.
 *
 * A solução é inserir uma terceira meta SEM media, que por isso vence as duas
 * declaradas, e reescrevê-la a cada troca.
 */
function sincronizarBarraDoNavegador(tema: 'dark' | 'light') {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"][data-sv]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.dataset.sv = '1'
    document.head.appendChild(meta)
  }
  meta.content = COR_BARRA[tema]
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  function alternarTema() {
    const raiz = document.documentElement
    const novo = raiz.dataset.theme === 'light' ? 'dark' : 'light'
    raiz.dataset.theme = novo
    try {
      localStorage.setItem(CHAVE_TEMA, novo)
    } catch {
      // Navegação privativa pode bloquear o armazenamento. A troca vale para
      // esta sessão mesmo assim; só não sobrevive ao recarregamento.
    }
    sincronizarBarraDoNavegador(novo)
  }

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label="Alternar entre tema claro e escuro"
      title="Alternar entre tema claro e escuro"
      className={`inline-flex items-center justify-center w-9 h-9 rounded-md border border-sv-line text-sv-text-2 hover:text-sv-text hover:bg-sv-surface transition-colors ${className}`}
    >
      <Sun className="sv-tema-sol w-4 h-4" aria-hidden="true" />
      <Moon className="sv-tema-lua w-4 h-4" aria-hidden="true" />
    </button>
  )
}
