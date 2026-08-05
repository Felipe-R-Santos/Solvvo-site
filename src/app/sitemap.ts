import type { MetadataRoute } from 'next'

// ─────────────────────────────────────────────────────────────────────────────
// SITEMAP
//
// Gerado, e não escrito à mão em public/sitemap.xml, por dois motivos:
// a URL base sai do MESMO lugar que o metadataBase do layout (a variável
// NEXT_PUBLIC_SITE_URL), então trocar de domínio não deixa um arquivo para
// trás; e rota nova entra aqui, ao lado das outras, em vez de num XML que
// ninguém lembra de abrir.
//
// ⚠ AO CRIAR ROTA NOVA, ACRESCENTE AQUI. Página fora do sitemap depende de o
// buscador achar por link — e a rota do pré-estudo nasceu para ser colada em
// e-mail e proposta, não só para ser rastreada.
//
// /api não entra: é resto de scaffold e não é página.
// ─────────────────────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.solvvo.com.br'

export default function sitemap(): MetadataRoute.Sitemap {
  // Data fixa e não `new Date()`: com data do build, todo deploy diz ao
  // buscador que tudo mudou, inclusive o que não mudou. Atualize a mão quando
  // o conteúdo da rota mudar de verdade.
  const revisao = new Date('2026-08-05')

  return [
    {
      url: BASE,
      lastModified: revisao,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE}/estudo-de-aplicacao`,
      lastModified: revisao,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE}/politica-de-privacidade`,
      lastModified: revisao,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]
}
