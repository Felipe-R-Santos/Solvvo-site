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

## Código morto — `src/hooks/use-mobile.ts`

**Decisão:** apagar o arquivo na **Fase 3**, no mesmo commit de remoção das
classes mortas do `globals.css`.

**Por quê:** `useIsMobile` não é importada por ninguém — o único lugar onde o
nome aparece é a própria declaração. É sobra do scaffold do shadcn. Ela carrega
o único erro de ESLint do projeto (`react-hooks/set-state-in-effect`, linha 14),
que nunca derrubou deploy nenhum porque o `next build` não roda ESLint. Mesma
natureza das classes CSS sem consumidor: remoção de código morto, um commit só.

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
