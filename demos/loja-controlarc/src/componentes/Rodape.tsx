import Link from "next/link";
import Image from "next/image";

const ANO = new Date().getFullYear();

export function Rodape() {
  return (
    <footer className="border-t border-borda-escura bg-cabecalho mt-16">
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-10 sm:px-6 lg:px-8 md:pb-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/marca/logo-fundo-escuro.png"
              alt="Control ARC"
              width={1800}
              height={739}
              className="h-11 w-auto"
            />
            <p className="mt-4 text-sm text-cinza-claro/70 leading-relaxed">
              Consumíveis e peças para soldagem robótica, para quem já opera
              célula robotizada.
            </p>
          </div>

          <nav aria-label="Loja">
            <h2 className="text-sm font-bold uppercase tracking-wide text-white">Loja</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/produtos" className="inline-block py-1 text-cinza-claro/80 hover:text-laranja-texto">Todos os produtos</Link></li>
              <li><Link href="/carrinho" className="inline-block py-1 text-cinza-claro/80 hover:text-laranja-texto">Carrinho</Link></li>
              <li><Link href="/pedidos" className="inline-block py-1 text-cinza-claro/80 hover:text-laranja-texto">Meus pedidos</Link></li>
              <li><Link href="/empresa" className="inline-block py-1 text-cinza-claro/80 hover:text-laranja-texto">Minha empresa</Link></li>
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-white">Como funciona</h2>
            <ul className="mt-3 space-y-2 text-sm text-cinza-claro/80">
              <li>Pedido pelo CNPJ, sem cartão.</li>
              <li>Pagamento por boleto, combinado na confirmação.</li>
              <li>Frete e prazo informados no retorno do pedido.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-white">Esta página</h2>
            <p className="mt-3 text-sm text-cinza-claro/80 leading-relaxed">
              É uma demonstração. Os dados ficam só no seu navegador e podem ser
              apagados em{" "}
              <Link href="/empresa" className="inline-block py-1 text-laranja-texto hover:underline">
                Minha empresa
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-borda-escura flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p className="text-xs text-cinza-claro/60">
            © {ANO} Control ARC. Todos os direitos reservados.
          </p>
          <p className="text-xs text-cinza-claro/60">
            Protótipo de loja B2B — conteúdo ilustrativo.
          </p>
        </div>
      </div>
    </footer>
  );
}
