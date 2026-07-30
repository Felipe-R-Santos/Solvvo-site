import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    images: [{ url: "/celulas/sw-cc1.webp", width: 1200, height: 900,
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
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-foreground`}
      >
        {children}
        <Toaster
          position="top-right"
          richColors
          theme="dark"
          toastOptions={{
            style: {
              background: '#111111',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: '#f0fdf4',
            },
          }}
        />
      </body>
    </html>
  );
}
