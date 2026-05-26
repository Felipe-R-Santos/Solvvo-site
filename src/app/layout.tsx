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

export const metadata: Metadata = {
  title: "Solvvo | Soluções em Manufatura Digital",
  description:
    "Transforme sua manufatura com tecnologia digital. Scan 3D, Digital Twin, Manufatura Aditiva e Automação Industrial. Soluções de ponta para indústria 4.0.",
  keywords: [
    "Scan 3D",
    "Digital Twin",
    "Manufatura Digital",
    "Manufatura Aditiva",
    "Automação Industrial",
    "Indústria 4.0",
    "Engenharia Reversa",
    "Impressão 3D",
  ],
  authors: [{ name: "Solvvo" }],
  icons: {
    icon: "/logo-solvvo.png",
  },
  openGraph: {
    title: "Solvvo | Soluções em Manufatura Digital",
    description:
      "Transforme sua manufatura com tecnologia digital. Scan 3D, Digital Twin, Manufatura Aditiva e Automação Industrial.",
    type: "website",
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
