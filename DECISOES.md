# Decisões — reposicionamento do site Solvvo Solutions

Registro das decisões tomadas por Felipe sobre o **Brief v3.0**. Onde este
arquivo e o `BRIEF.txt` divergirem, **este arquivo vale** — mas a intenção é que
não divirjam: toda decisão aqui já foi aplicada ao texto do brief.

Data do registro: 05/08/2026 · Autoridade: Felipe (fundador)

---

## Valores comerciais fixados

| Campo | Valor |
|---|---|
| `PRAZO_PRE_ESTUDO` | 5 dias úteis |
| `PRECO_PRE_ESTUDO` | R$ 1.900 |
| `PRAZO_ESTUDO_COMPLETO` | 10 dias úteis |
| `PRECO_ESTUDO_COMPLETO` | a partir de R$ 9.800 |
| `PRECO_ASSINATURA` | R$ 3.400/mês |
| `QTD_PRE_ESTUDOS_ASSINATURA` | 2 por mês |

Nenhuma fase está mais bloqueada por valor comercial. Para mudar qualquer um,
editar a **seção 3 do `BRIEF.txt`** — nunca o texto das fases.

---

## C1 — Degradê da marca

**Decisão:** manter a `brand-bar` (faixa de 3px no topo). **Remover a
`brand-ambient`.**

**Por quê:** a faixa é assinatura contida e cabe na direção de folha técnica. A
luz ambiente em `mix-blend-mode: screen` cobre a tela inteira e tinge toda foto
de célula e todo desenho técnico da página — justamente o ativo que a nova
direção existe para valorizar.

**Consequência na paleta:** o acento institucional muda, porque o laranja do
deck oficial passou a ser conhecido.

| Tema | `--sv-accent` | Observação |
|---|---|---|
| escuro | `#FF6B35` | laranja do deck oficial |
| claro | `#C2410C` | mesmo matiz, escurecido para contrastar sobre `#F4F2ED` |

Os valores anteriores (`#E08B45` / `#B4531A`) estão **cancelados**.

**O verde `#34F000` fica exclusivamente na `brand-bar`.** Em nenhum outro lugar
do site.

---

## C2 — Fonte monoespacada

**Decisão:** **substituir, não somar.** Trocar `Geist_Mono` por `IBM_Plex_Mono`
e renomear a variável CSS para `--font-mono`.

**Por quê:** manter `--font-geist-mono` apontando para IBM Plex Mono é
exatamente a armadilha de sinônimo da regra 1.5 — o nome diz uma coisa e o
conteúdo é outra, e a divergência acontece em silêncio.

Alcance: `src/app/layout.tsx` (import e variável) e `src/app/globals.css`
(mapeamento no `@theme inline`). O único uso atual de `font-mono` está em
`src/app/page.tsx:850`.

---

## C3 — Acento no formulário

**Decisão:** botão primário e anel de foco **convivem**. O botão de envio
continua primário (fundo `--sv-accent`).

**Por quê:** o anel de foco é *estado*, não decoração. A regra "um acento por
tela" da Fase 2.2 mira em acento decorativo, não em affordance de interação.

---

## C4 — Números do acervo

**Decisão:** os dois conjuntos **não podem coexistir**.

- **Remover o `526` do site inteiro.**
- No bloco da plataforma ficam apenas: **6.928 componentes, 23 arquiteturas,
  72 posicionadores**, sob rótulo "Nosso acervo técnico".
- Os números da faixa de credibilidade (**31 projetos reais em STEP no acervo
  de referência**, **17 células medidas em simulação**, **0 equipamentos
  vendidos ou representados**) ficam **só no herói**.

**Por quê:** "526 projetos de referência" ao lado de "31 projetos reais em STEP"
é contradição visível na mesma página. Num site cujo argumento central é
procedência, contradição aritmética à vista derruba o argumento inteiro.

A regra de rotulagem da Fase 4 continua valendo: o rótulo é **"acervo de
referência"**. Nunca "projetos entregues", "clientes atendidos" ou equivalente.

---

## C5 — Erro de tipo ignorado no build

**Decisão:** rodar a verificação de tipos **antes** de qualquer edição e
apresentar a lista. Volume grande vira fase própria, executada antes da Fase 1.

`typescript.ignoreBuildErrors: true` está ativo em `next.config.ts:6`. Com rota
e formulário novos entrando, é um jeito de derrubar a página de vendas em
produção sem receber aviso nenhum.

---

## Inventário de cor — destinos definidos

O item (h) do brief não listava a escala de cinza. São 97 ocorrências de cinza
fixo no JSX e elas **não seguem troca de tema** — `text-gray-500` sobre o papel
`#F4F2ED` fica ilegível. Entram na Fase 2 junto com os hex.

| Classe atual | Ocorrências | Destino |
|---|---|---|
| `text-white` | 33 | `--sv-text` |
| `text-gray-300`, `text-gray-400` | 32 | `--sv-text-2` |
| `text-gray-500`, `text-gray-600` | 27 | `--sv-text-3` |
| `bg-white/5`, `bg-black/50` | 4 | `--sv-surface` |
| `border-white/30` | 1 | `--sv-line` |

Mais três destinos vindos do inventário da Fase 0:

- **Ênfase em texto corrido** (`page.tsx` linhas 576, 577, 592, 818) →
  `--sv-text` com **peso 500**. A ênfase passa a ser tipográfica, não cromática.
- **Partículas flutuantes do herói** (`page.tsx:273`) → **remover**.
- **Classes mortas** — `gradient-border`, `noise-overlay`, `pulse-emerald`,
  `animate-float` → **apagar do `globals.css`**. Nenhuma tem uso no projeto.

---

## `--sv-text-3` — a paleta mudou, e por quê

**Se você chegou aqui porque auditou o site e achou um valor diferente do que o
brief original trazia: é aqui que está a explicação.**

O brief v3.0 declarava a paleta com **"valores fixos, não negociáveis"**. Dois
valores mudaram mesmo assim, por decisão de Felipe em 05/08/2026:

| Tema | Brief original | Em vigor |
|---|---|---|
| escuro | `#6E6B64` | **`#8D8980`** |
| claro | `#8A8880` | **`#706E68`** |

**Motivo: reprovação de contraste medida, não preferência estética.**

Auditoria de contraste WCAG feita sobre a página inteira (182 elementos de texto
no desktop, 175 no mobile), nos dois temas e nas duas larguras. Resultado
idêntico nos quatro cenários: **75 falhas, todas no `--sv-text-3`**. Nenhuma
falha em `--sv-text` ou `--sv-text-2`.

| Tema | Valor original | Sobre `--sv-bg` | Sobre `--sv-surface` | Exigido |
|---|---|---|---|---|
| escuro | `#6E6B64` | 3,27:1 | 2,96:1 | 4,5:1 |
| claro | `#8A8880` | 3,17:1 | 3,37:1 | 4,5:1 |

A WCAG AA exige 4,5:1 para texto abaixo de 24px. Dos 75 casos, 63 estavam entre
12 e 14px.

**A contradição era do próprio brief:** a Fase 2.2 dizia "não negociáveis" e o
critério de aceite exigia "os dois temas passam em contraste, inclusive nos
números pequenos". Não havia como cumprir as duas.

### Os valores em vigor têm folga deliberada

A primeira correção usou o **menor ajuste** que satisfaz 4,5:1 (`#8D8980` e
`#706E68`). Isso deixava o pior caso em 4,52:1 — margem de 1,00× o mínimo, ou
seja, nenhuma.

**Margem zero não sobrevive a mudança de layout**, e a Fase 3 é uma mudança de
layout: ela cria texto pequeno que hoje não existe (carimbo do rodapé, legenda
de imagem, rótulo de unidade nos blocos de número) e molduras de 1px que
introduzem fundos intermediários que o cálculo original não previa. Um valor
calculado no limite reprova no primeiro fundo novo.

Os valores em vigor miram **5,0:1 no fundo mais difícil de cada tema**,
preservando o matiz quente da paleta:

| Tema | Em vigor | Sobre `--sv-bg` | Sobre `--sv-surface` |
|---|---|---|---|
| escuro | **`#959187`** | 5,53:1 | 5,01:1 |
| claro | **`#696761`** | 5,03:1 | 5,34:1 |

Note que o fundo que aperta troca de lado conforme o tema: no escuro é o
`--sv-surface` (mais claro que o fundo da página), no claro é o `--sv-bg` (mais
escuro que a superfície). Quem for recalcular precisa checar os dois, não supor
qual é o pior.

### Correção junto: mapear por papel, não por classe de origem

O mapeamento inicial mandou `text-gray-500` e `text-gray-600` para `--sv-text-3`
em bloco. Mas `gray-500` no código antigo cobria coisas de peso muito diferente,
e isso jogou **texto descritivo de leitura** no nível de legenda: a dor dos três
perfis da plataforma, as notas dos números do acervo, as descrições das oito
etapas, as descrições das arquiteturas de célula e os textos dos cards de valor.

Esses passaram para `--sv-text-2`. **`--sv-text-3` fica restrito ao que o brief
define:** legenda, carimbo, unidade — mais rótulo de campo, placeholder e dado
de contato do rodapé.

Regra para quem mexer daqui em diante: **o nível do texto vem do papel dele na
página, não da classe que ele tinha antes.**

---

## Código morto — `src/hooks/use-mobile.ts`

**Decisão:** apagar o arquivo na **Fase 3**, no mesmo commit de remoção das
classes mortas do `globals.css`.

**Por quê:** `useIsMobile` não é importada por ninguém — o único lugar onde o
nome aparece é a própria declaração. É sobra do scaffold do shadcn. Ela carrega
o único erro de ESLint do projeto (`react-hooks/set-state-in-effect`, linha 14),
que nunca derrubou deploy nenhum porque o `next build` não roda ESLint. Mesma
natureza das classes CSS sem consumidor: remoção de código morto, um commit só.

**`tailwind.config.ts` sai no mesmo commit.** O Tailwind v4 só carrega esse
arquivo com uma diretiva `@config` no CSS, que não existe — quem define o tema é
o bloco `@theme` do `globals.css`. O arquivo está no repositório desde o
scaffold, sem efeito nenhum, e induz a erro quem for procurar onde as cores
moram.

**Ficam de fora:** os dois `text-white` das variantes `destructive` de
`ui/badge.tsx` e `ui/button.tsx`. `variant="destructive"` não é usado em lugar
nenhum do site, e branco sobre vermelho de erro está correto nos dois temas —
vermelho de erro não muda com o tema. Não vale gastar diff.

---

## Imagem da seção Sobre — `public/about-img.png`

**Decisão:** substituir por uma das imagens reais de `public/celulas/`, **na
Fase 3**, junto com o item 3.6 (moldura de 1px e legenda monoespaçada).

**Por quê:** a atual é stock genérico de IA — holograma azul neon sobre um
tablet. É o oposto da direção de folha de desenho técnico, e não faz sentido
emoldurar ficção científica. Trabalho próprio vale mais que qualquer imagem
genérica. **Não buscar nem gerar imagem nova:** as de `public/celulas/` são do
acervo e já estão no repositório.

---

## Política de Privacidade — campos pendentes

**Decisão:** a página **não vai ao ar** sem os quatro campos abaixo. Ela já está
linkada no rodapé, então um `git push` a publica — atenção antes de subir.

Pendente de Felipe:

- [ ] razão social completa
- [ ] CNPJ
- [ ] endereço completo (hoje só consta a cidade)
- [ ] prazo de retenção das conversas e dos e-mails

Resolvido:

- [x] **encarregado de dados (DPO): o próprio Felipe**, sem estrutura separada.
      Falta publicar o contato dele na seção de direitos.

**Atualizar na Fase 2:** quando o botão de tema entrar, ele grava a preferência
em `localStorage`. A seção "Cookies e armazenamento local" precisa deixar de
dizer que o site não armazena nada.

---

## Renders de célula da geração 2026

Felipe forneceu três renders novos em 05/08/2026, confirmados como **células
padrão, não layout de cliente** — a verificação que o `LEIA-ME.md` exige.

| Arquivo de origem | Slug gerado | O que mostra |
|---|---|---|
| `Celulas Solvvo H2000.png` | `cel-h-duas-estacoes` | célula H de duas estações, sem dispositivo montado |
| `Celulas Solvvo H2000 com berco.png` | `cel-h-com-berco` | a mesma célula H, com os berços montados, e figura humana |
| `Celulas Solvvo coluna e trilho.png` | `cel-coluna-trilho` | coluna e lança sobre trilho, dois posicionadores de cabeçote |

São duas arquiteturas e um par, não três arquiteturas: os dois primeiros são a
mesma célula com e sem o dispositivo de fixação.

### Usos aprovados

- **`cel-coluna-trilho` → fundo do herói**, pelo tratamento `preparar_hero()`.
  É a mesma arquitetura que gerou o herói atual, em render melhor e mais aberto.
- **`cel-h-com-berco` → seção Sobre**, no lugar da `sw-gan.webp`. Ela ilustra o
  parágrafo escrito na Fase 1 que separa a independência (robô, posicionador,
  periférico) do berço e do gabarito, projetados sob medida: a imagem mostra o
  berço montado na célula.
- **`cel-h-duas-estacoes` + `cel-h-com-berco` → card "Dispositivos e
  Fabricação"**. A mesma célula com e sem o dispositivo dispensa legenda
  explicativa.
- **`cel-h-com-berco` → card social (Open Graph)**.

### Uso RECUSADO, e por quê

Eu havia proposto pôr `cel-h-duas-estacoes` e `cel-coluna-trilho` lado a lado
para ilustrar o item 02 da Fase 5, "três cenários comparados". **Felipe recusou,
com razão.**

O item 02 é *três cenários comparados para o mesmo problema*. As duas
arquiteturas atendem peças diferentes — lado a lado elas ilustram **catálogo**,
não comparação, e ensinam a coisa errada sobre o que o pré-estudo entrega. Um
comprador atento nota a diferença.

**Decisão:** naquele ponto entra **uma imagem só**, com legenda dizendo que é
uma das alternativas avaliadas. A comparação de verdade é a tabela — arquitetura,
ciclo, peças por hora, investimento, payback.

**Pendência futura:** quando existirem duas arquiteturas renderizadas **para a
mesma peça**, a imagem dupla passa a valer e o item 02 pode receber o par.

### As seis da galeria foram regeradas — e isso NÃO é a troca de render

Ao rodar o script, as seis imagens antigas também foram regeradas. **Mantidas,
por decisão de Felipe**, e é importante não confundir isso com a frente
paralela descrita logo abaixo.

O que mudou nelas foi só o fundo: `#171717` → `#232323`. O valor antigo estava
calibrado para o `#0a0a0a` que a Fase 2 aposentou. Reverter deixaria seis
imagens de uma paleta morta dentro de cartões `--sv-surface` — apareceriam como
retângulo escuro dentro de retângulo menos escuro.

**É correção de alinhamento com a paleta. O render é o mesmo.** A troca dos
renders continua sendo a frente paralela abaixo.

### Frente paralela — regeneração da galeria

As seis imagens da galeria são de uma geração anterior e ficam visivelmente
atrás destas três. Regenerá-las no padrão novo é trabalho de Felipe no
KUKA.Sim, **não deste repositório, e não pode travar as Fases 4 a 8.**

Por ora: as três novas nos lugares de destaque, a galeria antiga como está.

### Alteração de escopo da Fase 5, autorizada

A Fase 5 do brief dizia "usar as fotos de célula já existentes em
`public/celulas/`. Não buscar, gerar nem substituir imagem nenhuma". Essa linha
existia para impedir que eu saísse procurando ou gerando imagem por conta
própria. **Felipe autorizou a exceção em 05/08/2026** e forneceu ele mesmo os
arquivos — a regra continua valendo para mim, o que mudou é a origem do
material. A linha do `BRIEF.txt` foi atualizada para não virar divergência
silenciosa.

### Onde vivem os originais

Os PNG têm ~10 MB cada e **ficam fora do repositório**. Um deles no histórico do
git ficaria lá para sempre. O `.gitignore` barra `Celulas Solvvo *.png`, e o
script aceita `SOLVVO_RENDERS` apontando para a pasta onde eles estiverem.

---

## O herói tem DUAS imagens, uma por tema — não unifique

**Se você está aqui pensando em "simplificar" `hero-celula-carvao.webp` e
`hero-celula-papel.webp` num arquivo só: não. É contraste medido.**

O `preparar_hero()` derruba os realces do render para que texto claro leia sobre
fundo escuro. No tema claro o véu é claro sobre imagem escura, o resultado é
cinza médio, e aí é o texto **escuro** que some. Medição por amostragem dos
pixels reais do render, 144 pontos por elemento, compondo o véu por cima:

| Elemento do herói | Carvão no tema claro (antes) | Papel no tema claro (agora) |
|---|---|---|
| etiqueta | **2,14:1** | 11,09:1 |
| subtítulo | **3,49:1** | 12,67:1 |
| citação | **4,28:1** | 5,29:1 |
| H1 | 7,14:1 | 11,38:1 |

Os dois tratamentos são espelhados: o carvão puxa os realces para baixo, o papel
levanta as sombras. Estão lado a lado em `preparar_hero()`, com o porquê escrito.

**A auditoria de contraste normal NÃO pega isso.** Ela mede o texto contra o
fundo declarado no CSS, e sobre o herói o fundo declarado é a cor da página —
ela não enxerga a imagem. Foi por isso que os quatro cenários deram zero falha
enquanto o herói reprovava. Para verificar, use a amostragem por canvas.

### Texto sobre imagem não usa `--sv-text-3`

Dois elementos do herói subiram de nível por medição, e não por estética:

- **etiqueta**: `--sv-text-3` → `--sv-text`. No nível 3 dava 3,36:1 no escuro,
  sobre a lança laranja, e 2,14:1 no claro.
- **atribuição da citação**: `--sv-text-3` → `--sv-text-2`. Dava 4,34:1 no
  escuro e 4,33:1 no claro, logo abaixo dos 4,5:1.

Regra que fica: **sobre imagem, o nível mínimo é `--sv-text-2`.** O nível 3
serve para legenda sobre fundo chapado.

---

## Espaçamento do herói no mobile — exceção registrada

O brief manda "manter a estrutura de layout" no Fase 4. **Felipe abriu exceção
para o espaçamento em 05/08/2026**, e a razão é conversão medida.

Com o `pt-20` fixo, em 375 × 667 — altura útil de muito Android depois da barra
do navegador — o CTA primário caía **129px abaixo da dobra**. Quem chega pelo
WhatsApp lia o prazo e o preço e não conseguia clicar.

Ajustado só o espaçamento no mobile (padding do topo, altura do logo e margens
entre blocos; nada muda a partir do breakpoint `sm`). Resultado medido:

| | 375 × 667 | 375 × 812 |
|---|---|---|
| H1 com o prazo | ✓ | ✓ |
| Subtítulo com o preço | ✓ | ✓ |
| CTA primário | ✓ 39px de folga | ✓ 184px de folga |

A exceção vale para **espaçamento**, não para redesenhar a seção.

---

## Fase 7 — o retrato é preto e branco, e só há uma versão

**Decisão:** o retrato de Felipe fica em preto e branco, num arquivo só, servindo
os dois temas.

**Por quê:** dá sobriedade à seção institucional e a separa das imagens técnicas
coloridas da mesma página — os renders de célula têm laranja de robô e verde de
cerca, e um retrato colorido no meio disputaria atenção com eles em vez de
encerrar a seção.

**Não converta as outras imagens para preto e branco.** A escolha vale para o
retrato, não para o site: os renders precisam da cor, que é onde está a
sinalização de segurança e a marca.

**Tratamento separado no script.** `preparar_retrato()` não passa por
`trocar_fundo()` nem por `preparar_hero()`: aqueles fazem flood fill do fundo a
partir dos cantos, o que só funciona em render com fundo chapado. Numa
fotografia o fundo tem gradiente, grão e sombra contínua — o flood fill vaza
para dentro da imagem e destrói o retrato. Também não leva marca d'água: é
pessoa, não peça de catálogo.

O corte é 4:5 do peito para cima. A original é vertical de corpo inteiro; em
coluna estreita, corpo inteiro deixa o rosto pequeno demais, e nessa seção é o
rosto que faz o trabalho.

---

## Acessibilidade de tocha saiu da seção institucional

**Decisão:** a frase sobre verificação de acessibilidade de tocha passa a
aparecer também no item 08 das entregas, em `/estudo-de-aplicacao`.

**Por quê:** é o diferencial mais forte da empresa e vivia só na seção
institucional da home, que pouca gente lê. Precisa aparecer **onde o comprador
avalia o entregável** — na lista do que ele recebe, não na página sobre quem
somos.

---

## Política de privacidade — por que a razão social não consta

Os dados do controlador foram completados em 05/08/2026: CNPJ, endereço, prazo
de retenção de 24 meses e encarregado.

**A razão social foi omitida de propósito.** A alteração do nome empresarial
para Solvvo está em andamento com o contador, e publicar o nome antigo agora
significaria trocá-lo em pouco tempo — numa página que existe para dar
segurança jurídica, nome que muda é ruído. **O CNPJ é o identificador
juridicamente estável e não muda com a alteração**, então ele sozinho cumpre a
identificação.

**Revisitar esta linha quando o contrato social novo sair.**

`contato@solvvo.com.br` é o único canal publicado. A ficha cadastral tem outros
endereços; nenhum deles entra no site.

**O endereço vai sem o complemento.** A sala 464 saiu logo depois da primeira
publicação: a sede é endereço residencial, e o número da sala aponta para a
unidade onde a pessoa mora. Rua, número, bairro, cidade e CEP identificam a
empresa para efeito de LGPD sem publicar isso. **Não reponha o complemento.**

---

## Rótulo de link descreve o que acontece ao clicar

Os quatro cards de solução tinham o mesmo "Saiba Mais" apontando para o
formulário genérico. Ao corrigir isso, mandei dois deles para seções que
tratavam de **outro** assunto e citavam o serviço de passagem — Scan 3D para
`#cases`, Dispositivos para `#sobre`.

**Felipe recusou, com razão.** Isso frustra mais que o formulário genérico:
promete informação que não está lá. Quem clica em "Saiba mais" espera
profundidade sobre aquele serviço.

**Regra:** o rótulo do link descreve o que acontece ao clicar.

- Serviço **com** página → "Saiba mais" → a página.
- Serviço **sem** página → "Falar sobre isso" → `#contato`.

Não existe página para Engenharia Reversa nem para Dispositivos. Melhor assumir
isso que fingir profundidade.

---

## Critério de agrupamento de commit

O brief manda commits pequenos, um por fase, e proíbe misturar fase de conteúdo
com fase visual. Vale. Mas a regra existe para servir à **rastreabilidade**, e há
um caso em que separar piora exatamente o que ela protege:

**Quando o texto de um documento é a justificativa de um diff de código, os dois
vão no mesmo commit.** Separá-los produz um commit que altera a paleta sem
explicação e outro que explica uma paleta que já mudou — quem fizer `git log`
depois encontra a mudança antes do motivo, ou pior, encontra só a mudança.

Não vale como brecha para juntar fases: conteúdo e identidade visual continuam
em commits separados. Vale para documento que **explica aquele diff específico**
— `DECISOES.md` e `BRIEF.txt` quando a alteração deles é a razão de ser do
código que muda junto.

Decisão de Felipe, 05/08/2026.

---

## Ordem de execução

```
build do C5  →  Fase 1  →  Fase 2  →  Fase 3  →  Fase 4
             →  Fase 5  →  Fase 6  →  Fase 8
```

**Fase 7 (autoria na seção Sobre) continua bloqueada**, esperando texto aprovado
e foto de Felipe.

Regra mantida: uma fase por commit, e **nunca** conteúdo e identidade visual no
mesmo commit.

---

## Pendências externas (registrar, não corrigir aqui)

**PDF gerado pelo CRM** — fora deste repositório. Usa `#1a1a2e` no cabeçalho e
nas tarjas de tabela. O carvão institucional da Solvvo é `#1A1A1A`. Se o
documento que chega ao cliente não usa a mesma paleta da página que o trouxe, a
percepção de cuidado técnico cai — e cuidado técnico é exatamente o que está
sendo vendido. Corrigir no repositório do CRM, não aqui.
