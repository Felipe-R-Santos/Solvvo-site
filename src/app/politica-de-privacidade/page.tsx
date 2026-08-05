import type { Metadata } from 'next'

// ─────────────────────────────────────────────────────────────────────────────
// ⚠ PENDÊNCIA PARA FELIPE — ESTE TEXTO PRECISA DE REVISÃO JURÍDICA.
//
// Ele foi escrito descrevendo com precisão o que o site REALMENTE faz hoje:
// não há servidor, não há banco, não há cookie próprio e não há analytics. Todo
// dado que o visitante digita sai do aparelho dele direto para o WhatsApp ou
// para o cliente de e-mail. Isso é raro e é bom — a maior parte das políticas
// por aí descreve coleta que este site não faz.
//
// ⚠ ESTA PÁGINA NÃO VAI AO AR SEM OS QUATRO CAMPOS ABAIXO (decisão de Felipe,
//   05/08/2026). Ela já está linkada no rodapé, então o `git push` publica.
//   PENDENTE — Felipe envia antes da publicação:
//     [ ] razão social completa
//     [ ] CNPJ
//     [ ] endereço completo (hoje só consta a cidade)
//     [ ] prazo de retenção das conversas e dos e-mails recebidos
//   RESOLVIDO:
//     [x] encarregado de dados (DPO) — é o próprio Felipe, sem estrutura
//         separada. Falta só publicar o contato dele na seção de direitos.
// Nada disso foi inventado nem preenchido com exemplo plausível.
//
// ⚠ ATUALIZAR NA FASE 2: o botão de tema vai gravar a preferência do visitante
// em localStorage. É dado técnico armazenado no aparelho dele, e a seção
// "Cookies e armazenamento local" precisa passar a mencioná-lo.
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Política de Privacidade | Solvvo Solutions',
  description:
    'Como a Solvvo Solutions trata os dados pessoais informados no site: o que é coletado, para que serve e como exercer seus direitos previstos na LGPD.',
}

const ATUALIZADO_EM = '5 de agosto de 2026'

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">{titulo}</h2>
      <div className="space-y-3 text-gray-400 leading-relaxed">{children}</div>
    </section>
  )
}

export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <div className="brand-bar fixed top-0 left-0 right-0 z-50" aria-hidden="true" />

      <header className="border-b border-[rgba(16,185,129,0.1)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/logo-solvvo.png"
              alt="Solvvo"
              className="h-9 sm:h-11 w-auto object-contain drop-shadow-lg"
            />
          </a>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Política de Privacidade
          </h1>
          <p className="text-sm text-gray-500 mt-3">
            Última atualização: {ATUALIZADO_EM}
          </p>

          <p className="text-gray-400 leading-relaxed mt-8">
            Esta política explica quais dados pessoais a Solvvo Solutions recebe
            através do site solvvo.com.br, o que fazemos com eles e como você
            pode exercer os direitos que a Lei Geral de Proteção de Dados
            (Lei nº 13.709/2018) garante.
          </p>

          <Secao titulo="Quem é o controlador dos dados">
            <p>
              <span className="text-emerald-400 font-medium">Solvvo Solutions</span>,
              sediada em Caxias do Sul, Rio Grande do Sul, Brasil.
            </p>
            <p>
              Para qualquer assunto relacionado aos seus dados pessoais, fale
              conosco pelo e-mail{' '}
              <a
                href="mailto:contato@solvvo.com.br"
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
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
              <span className="text-emerald-400 font-medium">
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
              Sua mensagem fica onde ela chegou: na conversa de WhatsApp ou na
              caixa de e-mail da empresa, pelo tempo necessário ao atendimento e
              ao histórico comercial. Você pode pedir a exclusão a qualquer
              momento pelos contatos acima.
            </p>
          </Secao>

          <Secao titulo="Cookies e armazenamento local">
            <p>
              O site{' '}
              <span className="text-emerald-400 font-medium">
                não usa cookies próprios
              </span>
              , não tem ferramenta de análise de audiência, não tem pixel de
              rede social e não tem chat de rastreamento.
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
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
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

          <div className="mt-16 pt-8 border-t border-[rgba(16,185,129,0.1)]">
            <a
              href="/"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              ← Voltar para a página inicial
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-[rgba(16,185,129,0.1)] bg-[#050505]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Solvvo. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
