import type { MetadataRoute } from 'next'

// ─────────────────────────────────────────────────────────────────────────────
// ROBOTS.TXT
//
// SUBSTITUI o public/robots.txt, que foi apagado. Um arquivo em public/ tem
// precedência sobre esta rota, então manter os dois faria o estático vencer em
// silêncio e este código não valer nada.
//
// O que mudou em relação ao antigo: ele não tinha diretiva Sitemap. Sem ela, o
// buscador só encontra as páginas por link — e a rota do pré-estudo nasceu para
// circular por e-mail e proposta.
//
// A URL base vem da MESMA variável do metadataBase e do sitemap.
// ─────────────────────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.solvvo.com.br'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // /api é resto de scaffold e não é página; fora do índice.
      { userAgent: '*', allow: '/', disallow: '/api' },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
