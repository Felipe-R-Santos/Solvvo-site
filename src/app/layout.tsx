import type { Metadata, Viewport } from "next";
import { PRAZO_PRE_ESTUDO, PRECO_PRE_ESTUDO } from "@/lib/valores";
import { Geist, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SCRIPT_ANTI_FLASH, TEMA_PADRAO } from "@/lib/tema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// A monoespaçada da folha técnica: números, unidades, etiquetas, código de
// seção, carimbo e rótulo de tabela. NUNCA texto corrido.
//
// SUBSTITUI a Geist Mono, que não foi somada a ela. Manter as duas significaria
// baixar duas famílias e conviver com duas monoespaçadas; e deixar a variável
// chamada --font-geist-mono apontando para a IBM Plex seria a armadilha de
// sinônimo da regra 1.5 do brief — o nome dizendo uma coisa e o conteúdo outra.
//
// Só os pesos 400 e 500. O brief limita em 500: peso pesado em monoespaçada lê
// como marketing, que é o oposto do que esta direção quer. A IBM Plex Mono é
// fonte estática, então os pesos precisam ser declarados um a um.
const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// SEO/compartilhamento: o título e a descrição são o que aparece no Google e no
// card do LinkedIn/WhatsApp quando alguém cola o link.
//
// REESCRITOS EM 05/08/2026. Antes anunciavam a plataforma — um produto que não
// está no ar —, e quem buscava por engenharia de aplicação encontrava promessa
// de software. Agora descrevem o serviço que a empresa entrega hoje, na ordem
// que o brief manda: PRAZO, ESCOPO, INDEPENDÊNCIA.
export const metadata: Metadata = {
  // metadataBase: sem isto o Next avisa no build e as imagens de Open Graph
  // saem com URL relativa — o LinkedIn e o WhatsApp NÃO conseguem montar o
  // card com miniatura, que é justamente o que gera clique.
  // ⚠ TROCAR pelo domínio real quando sair da hospedagem gratuita.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.solvvo.com.br"
  ),
  title: `Solvvo Solutions | Pré-estudo de viabilidade robotizada em ${PRAZO_PRE_ESTUDO} dias`,
  description:
    `Arquitetura de célula, tempo de ciclo estimado e faixa de investimento em ${PRAZO_PRE_ESTUDO} dias úteis, por ${PRECO_PRE_ESTUDO} — escopo fechado, sem surpresa no orçamento. Engenharia independente: não vendemos equipamento nem representamos fabricante.`,
  keywords: [
    // as dez originais, que continuam sendo o que o cliente busca
    "estudo de aplicação",
    "célula robotizada",
    "simulação de célula robotizada",
    "software para integradora de robótica",
    "dimensionamento de célula de solda",
    "tempo de ciclo robô",
    "payback automação",
    "layout de manufatura",
    "solda robotizada",
    "automação industrial",
    // acrescentadas na Fase 8, para o serviço que o site passa a vender
    "pré-estudo de viabilidade",
    "engenharia de aplicação robotizada",
    "estudo de aplicação soldagem robotizada",
    "viabilidade célula robotizada",
  ],
  authors: [{ name: "Solvvo Solutions" }],
  // O ícone da aba é QUADRADO (16x16, 32x32). Usar o logo deitado (3,6:1)
  // fazia o navegador encolher tudo até caber na altura — sobrava um risco
  // ilegível. O emblema é quadrado e foi feito para isso.
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/emblema-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: `Pré-estudo de viabilidade robotizada em ${PRAZO_PRE_ESTUDO} dias úteis`,
    description:
      `Escopo fechado, prazo fechado, preço fechado. ${PRECO_PRE_ESTUDO}, entregue em ${PRAZO_PRE_ESTUDO} dias úteis. Não vendemos equipamento nem representamos fabricante.`,
    type: "website",
    locale: "pt_BR",
    siteName: "Solvvo Solutions",
    // Card social gerado por scripts/preparar-imagens-celulas.py: a célula
    // inteira, encaixada em 1200x630 com a lateral completada na cor de fundo.
    // A anterior era um render de geometria cinza sobre preto, da geração
    // antiga. Existe a versão papel (og-celula-papel.webp) se um dia o card
    // claro convier melhor no feed.
    images: [{ url: "/celulas/og-celula-carvao.webp", width: 1200, height: 630,
               alt: "Célula robotizada de soldagem com berços montados, cerca de proteção e posto do operador" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Pré-estudo de viabilidade robotizada em ${PRAZO_PRE_ESTUDO} dias úteis`,
    description:
      `Arquitetura de célula, ciclo estimado e faixa de investimento por ${PRECO_PRE_ESTUDO}, com a fonte de cada número.`,
    images: ["/celulas/og-celula-carvao.webp"],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// COR DA BARRA DO NAVEGADOR
//
// No Next 15+ o theme-color mora em `viewport`, não em `metadata` — declarado no
// lugar errado ele é silenciosamente ignorado.
//
// São dois valores, um por tema, com media query. Sem isso o celular pinta a
// barra de endereço com uma cor só e ela briga com a página em um dos temas.
//
// ⚠ LIMITE CONHECIDO: a media query segue a preferência do SISTEMA, e o site
// permite ESCOLHER o tema (guardado em localStorage). Quem está com o sistema
// no escuro e escolhe o tema claro veria a barra escura sobre página clara. Por
// isso o botão de tema também reescreve esta meta ao alternar — ver
// components/theme-toggle.tsx.
// ─────────────────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
    { media: "(prefers-color-scheme: light)", color: "#F4F2ED" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `data-theme` já vem escrito do servidor com o padrão, para o site abrir
    // legível mesmo com JavaScript desligado. O script abaixo corrige para a
    // preferência real antes da primeira pintura.
    // `suppressHydrationWarning` é obrigatório: o script mexe neste atributo
    // antes de o React hidratar, e sem isto o React acusa divergência.
    <html lang="pt-BR" data-theme={TEMA_PADRAO} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_ANTI_FLASH }} />
      </head>
      <body
        className={`${geistSans.variable} ${plexMono.variable} antialiased bg-sv-bg text-sv-text`}
      >
        {children}
        {/* O toast é estilizado por variável para acompanhar o tema. A prop
            `theme` do sonner só define os padrões internos dele; o que aparece
            na tela é o que está aqui. */}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: 'var(--sv-surface)',
              border: '1px solid var(--sv-line)',
              color: 'var(--sv-text)',
            },
          }}
        />
      </body>
    </html>
  );
}
