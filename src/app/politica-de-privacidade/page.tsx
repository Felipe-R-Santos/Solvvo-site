import type { Metadata } from 'next'
import { ThemeToggle } from '@/components/theme-toggle'
import { Carimbo } from '@/components/carimbo'

// ─────────────────────────────────────────────────────────────────────────────
// ⚠ PENDÊNCIA PARA FELIPE — ESTE TEXTO PRECISA DE REVISÃO JURÍDICA.
//
// Ele foi escrito descrevendo com precisão o que o site REALMENTE faz hoje:
// não há servidor, não há banco, não há cookie próprio e não há analytics. Todo
// dado que o visitante digita sai do aparelho dele direto para o WhatsApp ou
// para o cliente de e-mail. Isso é raro e é bom — a maior parte das políticas
// por aí descreve coleta que este site não faz.
//
// DADOS COMPLETADOS EM 05/08/2026 por Felipe: CNPJ, endereço, prazo de retenção
// e encarregado. A página estava travada sem eles e agora pode ir ao ar.
//
// A RAZÃO SOCIAL NÃO CONSTA, E É DE PROPÓSITO: a alteração do nome empresarial
// para Solvvo está em andamento com o contador, e publicar o nome antigo agora
// significaria trocá-lo em pouco tempo. O CNPJ é o identificador juridicamente
// estável e não muda com a alteração. Revisitar quando o contrato social novo
// sair.
//
// E-MAIL: `contato@` é o único canal publicado. A ficha cadastral tem outros
// endereços; nenhum deles entra aqui.
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Política de Privacidade | Solvvo Solutions',
  description:
    'Como a Solvvo Solutions trata os dados pessoais informados no site: o que é coletado, para que serve e como exercer seus direitos previstos na LGPD.',
  // Sem este bloco, a página herda o og:title do layout raiz e o card social
  // dela anuncia o pré-estudo — quem recebe o link da política vê a oferta
  // comercial, que é o oposto do que a página comunica.
  openGraph: {
    title: 'Política de Privacidade | Solvvo Solutions',
    description:
      'O que o site coleta, para que serve e como exercer seus direitos previstos na LGPD.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Solvvo Solutions',
  },
}

const ATUALIZADO_EM = '5 de agosto de 2026'

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl sm:text-2xl font-medium text-sv-text mb-3">{titulo}</h2>
      <div className="space-y-3 text-sv-text-2 leading-relaxed">{children}</div>
    </section>
  )
}

export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen flex flex-col bg-sv-bg">
      <div className="brand-bar fixed top-0 left-0 right-0 z-50" aria-hidden="true" />

      <header className="border-b border-sv-line">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/logo-solvvo.png"
              alt="Solvvo"
              className="h-9 sm:h-11 w-auto object-contain"
            />
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-sv-text">
            Política de Privacidade
          </h1>
          <p className="text-sm text-sv-text-3 mt-3">
            Última atualização: {ATUALIZADO_EM}
          </p>

          <p className="text-sv-text-2 leading-relaxed mt-8">
            Esta política explica quais dados pessoais a Solvvo Solutions recebe
            através do site solvvo.com.br, o que fazemos com eles e como você
            pode exercer os direitos que a Lei Geral de Proteção de Dados
            (Lei nº 13.709/2018) garante.
          </p>

          <Secao titulo="Quem é o controlador dos dados">
            <p>
              <span className="text-sv-text font-medium">Solvvo Solutions</span>,
              inscrita no CNPJ 45.939.613/0001-27, com sede na Rua Madre Bárbara,
              806, sala 464, Bairro Diamantino, Caxias do Sul/RS, CEP 95055-041.
            </p>
            <p>
              O encarregado pelo tratamento de dados pessoais é{' '}
              <span className="text-sv-text font-medium">Felipe Renan Santos</span>.
            </p>
            <p>
              Para qualquer assunto relacionado aos seus dados pessoais, fale
              conosco pelo e-mail{' '}
              <a
                href="mailto:contato@solvvo.com.br"
                className="text-sv-text-2 hover:text-sv-text transition-colors"
              >
                contato@solvvo.com.br
              </a>{' '}
              ou pelo WhatsApp (54) 9 8153-5018.
            </p>
          </Secao>

          <Secao titulo="Que dados coletamos">
            <p>
              Apenas os que você digita no formulário de contato, por vontade
              própria:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>nome</li>
              <li>e-mail</li>
              <li>telefone, se você preencher</li>
              <li>serviço de interesse</li>
              <li>o conteúdo da mensagem que você escrever</li>
            </ul>
            <p>
              Não pedimos CPF, CNPJ, endereço, dado bancário nem qualquer
              informação sensível. Se você incluir esse tipo de dado no campo de
              mensagem, ele chegará junto — por isso, escreva ali só o
              necessário para descrevermos o seu projeto.
            </p>
          </Secao>

          <Secao titulo="Como esses dados são enviados">
            <p>
              Este ponto é incomum e vale a explicação: o site{' '}
              <span className="text-sv-text font-medium">
                não tem servidor próprio, banco de dados nem sistema de
                cadastro
              </span>
              . Nada do que você digita fica armazenado neste site.
            </p>
            <p>
              Ao enviar o formulário, o seu navegador monta uma mensagem com o
              que você preencheu e abre o WhatsApp — ou, se você escolher a
              segunda via, o seu programa de e-mail. A partir daí você decide se
              envia. Os dados vão do seu aparelho direto para o WhatsApp ou para
              o e-mail, sem passar por nenhum sistema nosso.
            </p>
            <p>
              Como consequência, ao enviar pelo WhatsApp a conversa passa a ser
              tratada também pela política de privacidade do próprio WhatsApp,
              que é serviço da Meta e não está sob nosso controle.
            </p>
          </Secao>

          <Secao titulo="Para que usamos">
            <p>
              Exclusivamente para responder ao seu contato, elaborar orçamento e
              conduzir a conversa comercial e técnica que você iniciou. É o que a
              LGPD chama de tratamento para procedimentos preliminares
              relacionados a contrato, a pedido do titular (art. 7º, V).
            </p>
            <p>
              Não vendemos, não alugamos e não cedemos seus dados para
              terceiros. Não usamos seus dados para publicidade e não enviamos
              mala direta.
            </p>
          </Secao>

          <Secao titulo="Por quanto tempo guardamos">
            <p>
              Conversas de WhatsApp e e-mails de contato comercial são guardados
              por{' '}
              <span className="text-sv-text font-medium">24 meses</span>, contados
              do último contato. Depois disso são eliminados.
            </p>
            <p>
              Você pode pedir a exclusão antes desse prazo, a qualquer momento,
              pelos contatos acima.
            </p>
          </Secao>

          <Secao titulo="Cookies e armazenamento local">
            <p>
              O site{' '}
              <span className="text-sv-text font-medium">
                não usa cookies próprios
              </span>
              , não tem ferramenta de análise de audiência, não tem pixel de
              rede social e não tem chat de rastreamento.
            </p>
            <p>
              Uma única informação fica guardada no seu aparelho: se você usar o
              botão que alterna entre o tema claro e o escuro, a sua escolha é
              gravada no armazenamento local do navegador para que a página abra
              do mesmo jeito na próxima visita. É uma preferência de exibição,
              não identifica você, e não sai do seu aparelho — nós não temos
              acesso a ela. Limpar os dados do site no navegador apaga essa
              preferência.
            </p>
            <p>
              As fontes tipográficas são servidas pelo próprio site, e não
              carregadas de servidor externo durante a sua visita — ou seja, sua
              navegação aqui não é comunicada a nenhum provedor de fontes.
            </p>
            <p>
              Como qualquer site na internet, o serviço de hospedagem registra
              dados técnicos de acesso, como endereço IP, tipo de navegador e
              horário da requisição, usados para segurança e funcionamento da
              infraestrutura.
            </p>
          </Secao>

          <Secao titulo="Seus direitos">
            <p>
              A LGPD garante a você, a qualquer momento e sem custo, o direito
              de:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>confirmar se tratamos algum dado seu e acessar esses dados</li>
              <li>corrigir dado incompleto, inexato ou desatualizado</li>
              <li>
                pedir anonimização, bloqueio ou eliminação de dado desnecessário
                ou tratado fora da lei
              </li>
              <li>pedir a portabilidade dos seus dados</li>
              <li>revogar o consentimento e pedir a eliminação dos dados</li>
              <li>
                ser informado sobre com quem compartilhamos os seus dados
              </li>
            </ul>
            <p>
              Para exercer qualquer um deles, escreva para{' '}
              <a
                href="mailto:contato@solvvo.com.br"
                className="text-sv-text-2 hover:text-sv-text transition-colors"
              >
                contato@solvvo.com.br
              </a>
              . Respondemos dentro do prazo previsto na LGPD, de até 15 dias
              contados do pedido (art. 19, II).
            </p>
          </Secao>

          <Secao titulo="Mudanças nesta política">
            <p>
              Se o site passar a coletar ou tratar dados de outra forma, esta
              página é atualizada junto, e a data de atualização no topo muda.
              Vale a versão publicada aqui.
            </p>
          </Secao>

          <div className="mt-16 pt-8 border-t border-sv-line">
            <a
              href="/"
              className="text-sm text-sv-text-2 hover:text-sv-text transition-colors"
            >
              ← Voltar para a página inicial
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-sv-line bg-sv-surface">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs text-sv-text-3">
            © {new Date().getFullYear()} Solvvo. Todos os direitos reservados.
          </p>
          <Carimbo />
        </div>
      </footer>
    </div>
  )
}
