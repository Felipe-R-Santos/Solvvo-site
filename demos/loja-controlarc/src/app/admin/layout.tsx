import type { Metadata } from "next";
import { NavegacaoPainel } from "./navegacao";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s · Painel · Control ARC" },
  description: "Painel de demonstração da loja.",
};

export default function LayoutPainel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      {/* O aviso fica acima da navegação e em toda tela do painel: quem abrir o
          link direto numa aba precisa ver que os números são de mentira antes
          de olhar para os números. */}
      <p
        role="status"
        className="rounded-md border border-laranja/50 bg-laranja/10 px-4 py-3 text-sm leading-relaxed text-white"
      >
        <span className="font-bold">Painel de demonstração</span> · dados
        fictícios somados à sua navegação neste aparelho. Nenhuma informação sai
        deste navegador.
      </p>

      <h1 className="mt-6 text-2xl font-extrabold text-white sm:text-3xl">
        Painel da loja
      </h1>

      <NavegacaoPainel />

      <div className="mt-8">{children}</div>
    </div>
  );
}
