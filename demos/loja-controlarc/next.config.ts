import type { NextConfig } from "next";

// Sem `output: standalone`: este app é publicado como projeto próprio na
// Vercel, com Root Directory em `demos/loja-controlarc`. A configuração do
// outro projeto deste repositório não se aplica aqui.
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // Com LOJA_ESTATICA=1 o build vira um punhado de arquivos em `out/`, que
  // qualquer servidor estático entrega — sem Next rodando, sem servidor, sem
  // depender de uma hospedagem específica. A loja aguenta isso porque todas as
  // páginas já são pré-renderizadas e não existe rota de servidor.
  output: process.env.LOJA_ESTATICA ? "export" : undefined,
  // Sem o selo de desenvolvimento no canto: ele entra nas provas em imagem e
  // tapa o primeiro item da barra de baixo no celular.
  devIndicators: false,
};

export default nextConfig;
