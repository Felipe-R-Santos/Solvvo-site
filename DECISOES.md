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

Os valores novos são o **menor ajuste** que satisfaz 4,5:1 nos dois fundos de
cada tema, preservando o matiz quente da paleta — não uma cor escolhida no olho:

| Tema | Novo | Sobre `--sv-bg` | Sobre `--sv-surface` |
|---|---|---|---|
| escuro | `#8D8980` | 5,00:1 | 4,52:1 |
| claro | `#706E68` | 4,54:1 | 4,82:1 |

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
