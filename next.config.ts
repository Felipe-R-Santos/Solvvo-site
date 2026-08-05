import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // `typescript.ignoreBuildErrors` foi DESLIGADO em 05/08/2026. Com ele ativo o
  // Next pulava a validação de tipos e publicava no Vercel mesmo com erro —
  // a página de vendas podia subir quebrada sem nenhum aviso. Verificado antes
  // de desligar: `npx tsc --noEmit` acusava zero erros, então não havia dívida
  // escondida atrás do flag, só risco futuro.
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
