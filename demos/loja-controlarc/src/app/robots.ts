import type { MetadataRoute } from "next";

// Ambiente de demonstração: nada entra em buscador.
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
