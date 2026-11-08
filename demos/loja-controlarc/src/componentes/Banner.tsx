import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// O BANNER DA PÁGINA INICIAL — COMPOSIÇÃO PRÓPRIA, NÃO FOTO.
//
// ⚠ POR QUE NÃO SAIU UM QUADRO DO VÍDEO. Os doze quadros extraídos dos dois
// vídeos da pasta de marketing foram olhados um a um e NENHUM passou:
//   · dois são o cartão de abertura, só a logo;
//   · um mostra o rosto de uma pessoa, de perto e reconhecível;
//   · cinco trazem a logo gravada no canto superior direito;
//   · os quatro restantes mostram a peça azul de um cliente, grande e de forma
//     reconhecível, e a marca do fabricante do robô escrita no braço.
// Além disso o vídeo é vertical e tem só 480 px de largura — não daria banner
// nítido nem em meia tela, muito menos a 2×.
//
// Então a cena é desenhada: braço, tocha, arco e faíscas, na paleta da casa.
// Não finge ser fotografia e não mostra peça de ninguém.
//
// As faíscas param sozinhas em `prefers-reduced-motion` (ver globals.css).
// ─────────────────────────────────────────────────────────────────────────────

const FAISCAS = [
  { x: 388, atraso: "0s",    duracao: "1.9s" },
  { x: 372, atraso: "0.35s", duracao: "2.3s" },
  { x: 404, atraso: "0.7s",  duracao: "1.6s" },
  { x: 360, atraso: "1.1s",  duracao: "2.1s" },
  { x: 416, atraso: "1.45s", duracao: "1.8s" },
];

export function Banner() {
  return (
    <section className="relative overflow-hidden border-b border-borda-escura bg-cabecalho">
      {/* Malha técnica de fundo, bem apagada: dá textura sem competir com o texto. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #D8E0E9 1px, transparent 1px), linear-gradient(to bottom, #D8E0E9 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-laranja-texto">
            Portal de clientes
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            Consumíveis de solda, pedidos pelo CNPJ
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cinza-claro/85 sm:text-lg">
            Bicos, bocais, difusores, fresas de limpeza e peças de reposição
            para quem já opera célula robotizada. Monte o pedido, envie pelo
            CNPJ da sua empresa e acompanhe o andamento.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/produtos"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-laranja-escuro px-6 text-sm font-bold text-white hover:bg-marrom"
            >
              Ver o catálogo
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/cadastro"
              className="inline-flex h-12 items-center justify-center rounded-md border border-cinza-claro/30 px-6 text-sm font-bold text-white hover:border-laranja hover:text-laranja-texto"
            >
              Cadastrar a empresa
            </Link>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-borda-escura pt-6">
            <div>
              <dt className="text-xs uppercase tracking-wide text-cinza-claro/60">Pedido</dt>
              <dd className="mt-1 text-sm font-bold text-white">Pelo CNPJ</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-cinza-claro/60">Pagamento</dt>
              <dd className="mt-1 text-sm font-bold text-white">Boleto</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-cinza-claro/60">Catálogo</dt>
              <dd className="mt-1 text-sm font-bold text-white">7 categorias</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <svg
            viewBox="0 0 560 420"
            className="w-full"
            role="img"
            aria-label="Ilustração de um braço robótico soldando, com a tocha acesa"
          >
            <defs>
              <radialGradient id="arco" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#DF5318" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#DF5318" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Base e coluna */}
            <rect x="60" y="356" width="150" height="16" rx="3" fill="#2E2E2E" />
            <rect x="110" y="200" width="42" height="158" fill="#373435" />
            <rect x="110" y="200" width="42" height="158" fill="none" stroke="#2E2E2E" strokeWidth="2" />

            {/* Braço: dois elos e o punho */}
            <g stroke="#BE4010" strokeWidth="26" strokeLinecap="round" fill="none">
              <path d="M131 214 L236 128" />
              <path d="M236 128 L352 176" />
            </g>
            <g stroke="#DF5318" strokeWidth="18" strokeLinecap="round" fill="none">
              <path d="M131 214 L236 128" />
              <path d="M236 128 L352 176" />
            </g>
            <circle cx="131" cy="214" r="20" fill="#373435" stroke="#DF5318" strokeWidth="4" />
            <circle cx="236" cy="128" r="16" fill="#373435" stroke="#DF5318" strokeWidth="4" />

            {/* Punho e tocha */}
            <rect x="340" y="160" width="46" height="34" rx="6" fill="#DF5318" />
            <rect x="356" y="194" width="16" height="46" fill="#373435" />
            <path d="M356 240 h16 l-4 26 h-8 z" fill="#D8E0E9" />
            {/* Mangueira */}
            <path
              d="M340 176 C 300 168, 286 196, 300 226"
              fill="none"
              stroke="#2E2E2E"
              strokeWidth="9"
              strokeLinecap="round"
            />

            {/* Peça e mesa */}
            <rect x="230" y="300" width="270" height="14" fill="#373435" />
            <rect x="256" y="286" width="218" height="16" fill="#2E2E2E" />

            {/* Arco */}
            <ellipse cx="364" cy="288" rx="78" ry="48" fill="url(#arco)" />
            <path d="M364 266 L364 286" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.9" />

            {/* Faíscas: sobem e somem, cada uma no seu tempo */}
            {FAISCAS.map((f) => (
              <circle
                key={f.x}
                className="faisca"
                cx={f.x}
                cy={288}
                r="3"
                fill="#DF5318"
                style={{ animationDelay: f.atraso, animationDuration: f.duracao }}
              />
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
