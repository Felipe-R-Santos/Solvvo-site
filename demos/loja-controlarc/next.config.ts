import type { NextConfig } from "next";

// Sem `output: standalone`: este app é publicado como projeto próprio na
// Vercel, com Root Directory em `demos/loja-controlarc`. A configuração do
// outro projeto deste repositório não se aplica aqui.
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // Sem o selo de desenvolvimento no canto: ele entra nas provas em imagem e
  // tapa o primeiro item da barra de baixo no celular.
  devIndicators: false,
};

export default nextConfig;
