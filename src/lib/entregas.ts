// ─────────────────────────────────────────────────────────────────────────────
// O QUE O PRÉ-ESTUDO ENTREGA — nove itens, na ordem em que o estudo acontece.
//
// Usado em dois lugares: a lista completa em /estudo-de-aplicacao e o resumo no
// bloco da home. Duas cópias divergiriam na primeira vez que uma entrega
// mudasse de nome — e a home passaria a prometer coisa diferente da página que
// ela mesma linka.
//
// O RESUMO DA HOME MOSTRA OS NOVE TÍTULOS, não uma seleção. Escolher "os
// principais" seria decidir no lugar de quem lê qual entrega importa, e a lista
// é curta o bastante para caber inteira.
// ─────────────────────────────────────────────────────────────────────────────

export const ENTREGAS = [
  {
    titulo: 'Veredito de viabilidade',
    texto: 'Viável, viável com ressalvas ou não recomendado — com a justificativa técnica que sustenta a resposta.',
  },
  {
    titulo: 'Três cenários comparados',
    texto: 'O arranjo mais simples que atende, o que atende crescimento de produção, e o de menor investimento. Lado a lado, no mesmo critério, com as limitações de cada um declaradas.',
  },
  {
    titulo: 'Arquitetura de célula recomendada',
    texto: 'Qual dos arranjos padrão atende a peça, e por que os outros foram descartados.',
  },
  {
    titulo: 'Robô e posicionador candidatos',
    texto: 'Selecionados por payload no punho com ferramenta montada e por momento admissível no eixo do posicionador — não por carga nominal de catálogo.',
  },
  {
    titulo: 'Tempo de ciclo com memória aberta',
    texto: 'Tempo de arco, reposicionamento, rotação de posicionador, carga e descarga e tempo morto, cada parcela à vista. Peças por hora e por turno.',
  },
  {
    titulo: 'Faixa de investimento com procedência',
    texto: 'Mínimo e máximo, com a origem de cada linha e o grau de firmeza do preço. Item sem preço confirmado não entra no total: aparece como pendência a cotar.',
  },
  {
    titulo: 'Retorno calculado e testado',
    texto: 'Custo por peça hoje e depois, payback em meses, e o payback recalculado com volume 30% menor e investimento 20% maior.',
  },
  {
    titulo: 'Riscos e pendências técnicas',
    // A frase sobre acessibilidade de tocha é o diferencial mais forte da
    // empresa, e até 05/08/2026 vivia só na seção institucional — que pouca
    // gente lê. Aqui ela aparece onde o comprador avalia o entregável.
    texto: 'O que precisa ser resolvido antes de avançar. Nenhum estudo honesto tem essa lista vazia. Acessibilidade de tocha verificada por quem já soldou: é onde célula de solda falha, e é o que raramente aparece num estudo feito por quem nunca segurou uma.',
  },
  {
    titulo: 'Vistas 3D do arranjo',
    texto: 'Imagens do layout proposto, prontas para colar na sua proposta.',
  },
]
