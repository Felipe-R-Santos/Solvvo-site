import type { MetadataRoute } from "next";

// `force-static` é exigência da exportação estática: sem isto o Next trata
// /robots.txt como rota de servidor e o build em `output: export` falha.
export const dynamic = "force-static";

// Ambiente de demonstração: nada entra em buscador.
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
