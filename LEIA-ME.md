# Site da Solvvo Solutions — como mexer

Guia em português simples. Você não precisa saber programar para as coisas
desta página.

- **Site no ar:** https://solvvo.com.br
- **Código:** https://github.com/Felipe-R-Santos/Solvvo-site
- **Hospedagem:** Vercel (publica sozinho a cada envio para o GitHub)
- **Esta pasta:** `C:\Users\felip\OneDrive\Solvvo\solvvo-site`

---

## Como o site vai ao ar

Você mexe nos arquivos desta pasta → envia para o GitHub → o Vercel publica
sozinho em 1 a 3 minutos. Não existe botão de "publicar" em lugar nenhum.

Para enviar, abra o PowerShell nesta pasta e rode as três linhas:

```bash
git add -A
git commit -m "descreva o que mudou"
git push
```

Se pedir login do GitHub, ele abre uma janela com um código de 8 caracteres
(tipo `A544-62B5`). Vá em **https://github.com/login/device**, digite o
código e autorize. Isso só acontece de vez em quando.

**Deu errado depois de publicar?** No painel da Vercel dá para voltar para a
versão anterior em dois cliques (Deployments → a versão que funcionava →
Promote to Production). Nada se perde.

---

## Onde mudar cada coisa

Quase tudo está em **um arquivo só**: `src/app/page.tsx`.
Abra com o Bloco de Notas ou o VS Code e procure pelo texto que quer trocar.

| O que você quer mudar | Onde |
|---|---|
| Frase grande da abertura | `src/app/page.tsx`, procure por `deixa de levar semanas` |
| Telefone, e-mail, WhatsApp | `src/app/page.tsx`, procure por `const CONTATO` |
| Links de redes sociais | `src/app/page.tsx`, procure por `const REDES` |
| Os números do acervo | `src/app/page.tsx`, procure por `numerosAcervo` |
| As 4 soluções | `src/app/page.tsx`, procure por `const services` |
| A lista de serviços (rodapé e formulário) | `src/app/page.tsx`, procure por `const SERVICOS` |
| Política de Privacidade | `src/app/politica-de-privacidade/page.tsx` |
| As 8 etapas da plataforma | `src/app/page.tsx`, procure por `etapasPlataforma` |
| "Para quem é" (3 perfis) | `src/app/page.tsx`, procure por `Integradoras de robótica` |
| Aplicações que atendemos | `src/app/page.tsx`, procure por `const aplicacoes` |
| Texto do "Sobre" | `src/app/page.tsx`, procure por `Solvvo Solutions` faz o |
| Título que aparece no Google | `src/app/layout.tsx` |

**Regra de ouro ao editar:** mude só o que está **entre aspas**. O resto
(colchetes, vírgulas, `className=`) é estrutura — se apagar sem querer, o
site quebra.

### Redes sociais

Só aparece o ícone da rede que tiver endereço preenchido. Para publicar o
Instagram, por exemplo, troque a linha vazia:

```
{ nome: 'Instagram', url: '' },
```
por
```
{ nome: 'Instagram', url: 'https://www.instagram.com/suaconta' },
```

---

## As imagens

As imagens de célula e o fundo do topo são **geradas por script** a partir
do acervo do CRM — não foram feitas à mão. Para trocá-las:

```bash
python scripts/preparar-imagens-celulas.py
```

O script pega os renders em `../CRM Robotica/geradores/public/celulas-padrao/`
e o render do topo em `../CRM Robotica/marketing/`, escurece o fundo, aplica
marca d'água e grava em `public/`. Se você mudar o render de origem, é só
rodar o comando de novo.

**Cuidado importante:** as imagens usadas são de células **padrão**. Não use
as de `CRM Robotica/Solvvo-CRM-Robotica-v2.0.0/storage/layouts/`, porque
aquelas são layouts gerados para **clientes específicos**.

---

## Decisões que valem manter

1. **Todo número no site tem fonte.** Os 6.928 componentes, 23 arquiteturas e
   72 posicionadores foram medidos no acervo do CRM. Se um dia entrar um número
   novo, ele precisa ter de onde veio — é o argumento central do site, e ele cai
   inteiro se um número não se sustentar.

   **Ter fonte não basta: o número também precisa ser lido do jeito certo.** Em
   05/08/2026 saiu do site o "526 projetos de referência", que era medido e
   correto, mas que um comprador lê como "526 clientes atendidos". Número de
   acervo técnico só aparece sob rótulo que diga que é acervo técnico.

2. **A Solvvo estuda a aplicação; não integra e não vende equipamento.**
   Essa independência é argumento de venda: quem estuda sem ter robô em
   estoque não tem motivo para superdimensionar.

3. **O formulário não tem servidor.** Ele monta a mensagem e abre o
   WhatsApp, com e-mail como segunda via. Quando houver servidor, dá para
   trocar por um envio de verdade — os campos já estão prontos.

---

## Coisas conhecidas (não são defeitos novos)

- **`npm run build` não roda no Windows.** O script usa `cp`, que é comando
  de Linux. No Vercel funciona. Se quiser testar o build aqui, use
  `npx next build` (sem o `npm run`).
- **`node_modules` e `.next`** são pastas geradas. Podem ser apagadas sem
  medo; voltam com `npm install` e `npx next build`.

---

## Para rodar o site no seu computador

```bash
npx next dev -p 3001
```

Depois abra http://localhost:3001. Isso é só na sua máquina — não altera o
site publicado.
