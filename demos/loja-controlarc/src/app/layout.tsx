import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Cabecalho } from "@/componentes/Cabecalho";
import { Rodape } from "@/componentes/Rodape";
import { FaixaDemonstracao } from "@/componentes/FaixaDemonstracao";
import { BarraInferiorCelular } from "@/componentes/BarraInferiorCelular";
import { ProvedorLoja } from "@/lib/estado";

// Montserrat é a fonte de apoio do Brand Kit. A fonte da marca, Mazzard H
// Black, não existe no Google Fonts; e as fontes do outro projeto deste
// repositório não entram aqui de propósito.
const montserrat = Montserrat({
  variable: "--fonte-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const ENDERECO =
  process.env.NEXT_PUBLIC_LOJA_URL || "https://controlarc-loja.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(ENDERECO),
  title: {
    default: "Control ARC · Loja de Consumíveis e Peças",
    template: "%s · Control ARC",
  },
  description:
    "Portal B2B para clientes Control ARC: consumíveis e peças para soldagem robótica, com pedido pelo CNPJ.",
  icons: {
    icon: [
      { url: "/marca/favicon.ico", sizes: "any" },
      { url: "/marca/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/marca/apple-touch-icon.png",
  },
  openGraph: {
    title: "Control ARC · Loja de Consumíveis e Peças",
    description:
      "Consumíveis e peças para soldagem robótica, com pedido pelo CNPJ.",
    siteName: "Control ARC",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/marca/og-loja.png", width: 1200, height: 630,
               alt: "Control ARC — Automação e Robótica" }],
  },
  // Ambiente de demonstração: fora do índice de busca.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#121212",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // `data-scroll-behavior` é exigência do Next quando o CSS declara
    // `scroll-behavior: smooth`: sem ele, a troca de rota rola suavemente até o
    // topo e o navegador avisa no console a cada navegação.
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body className={`${montserrat.variable} font-sans antialiased bg-fundo text-white`}>
        <ProvedorLoja>
          <FaixaDemonstracao />
          <Cabecalho />
          <main className="min-h-[60vh] pb-24 md:pb-0">{children}</main>
          <Rodape />
          <BarraInferiorCelular />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#232323",
                border: "1px solid #2E2E2E",
                color: "#FFFFFF",
              },
            }}
          />
        </ProvedorLoja>
      </body>
    </html>
  );
}
