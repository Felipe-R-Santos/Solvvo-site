import type { Metadata } from "next";
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

// SEO/compartilhamento: o título e a descrição são o que aparece no Google e
// no card do LinkedIn/WhatsApp quando alguém cola o link. Alinhados ao novo
// foco (estudo de aplicação + plataforma), com as palavras que o cliente
// realmente busca — "célula robotizada", "payback", "solda robotizada".
export const metadata: Metadata = {
  // metadataBase: sem isto o Next avisa no build e as imagens de Open Graph
  // saem com URL relativa — o LinkedIn e o WhatsApp NÃO conseguem montar o
  // card com miniatura, que é justamente o que gera clique.
  // ⚠ TROCAR pelo domínio real quando sair da hospedagem gratuita.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.solvvo.com.br"
  ),
  title: "Solvvo Solutions | Plataforma de Estudo de Aplicação Robotizada",
  description:
    "Plataforma de simulação automática para estudo de aplicação de células robotizadas: robô, posicionador, estrutura, tempo de ciclo, ROI e payback — com a fonte de cada número. Para integradoras e indústrias que refazem layout o tempo todo.",
  keywords: [
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
    title: "Solvvo Solutions | Plataforma de Estudo de Aplicação Robotizada",
    description:
      "Em breve: assinatura da plataforma que faz o estudo de aplicação de ponta a ponta — robô, posicionador, estrutura, ciclo, ROI e payback, com a fonte de cada número.",
    type: "website",
    locale: "pt_BR",
    siteName: "Solvvo Solutions",
    // A altura declarada era 900 e o arquivo tem 675. Declaração errada faz o
    // WhatsApp e o LinkedIn reservarem uma área que a imagem não preenche, e o
    // card sai com faixa vazia ou recorte torto — justamente nos dois canais
    // por onde a divulgação acontece. Medido: 1200 x 675.
    images: [{ url: "/celulas/sw-cc1.webp", width: 1200, height: 675,
               alt: "Célula robotizada de soldagem — arquitetura compacta" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solvvo Solutions | Plataforma de Estudo de Aplicação Robotizada",
    description:
      "O estudo de aplicação que leva semanas, feito de ponta a ponta e auditável linha por linha. Em breve por assinatura.",
    images: ["/celulas/sw-cc1.webp"],
  },
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
