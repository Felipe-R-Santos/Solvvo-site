# Loja de consumíveis Control ARC — demonstração

Protótipo navegável de um portal B2B de consumíveis e peças para soldagem
robótica. Serve para **mostrar e discutir**, não para vender.

> ⛔ **Nada aqui é real.** Catálogo, preços, estoque, prazos, empresas,
> compradores, CNPJs e pedidos são inventados para a demonstração. Nenhum
> pedido é enviado, nenhuma mensagem sai e nenhum dado trafega: tudo o que
> você fizer fica no `localStorage` do seu próprio navegador.

---

## Como rodar

```bash
cd demos/loja-controlarc
npm install
npm run dev          # http://localhost:3002
```

Build de produção:

```bash
npm run build && npm start
```

É um app Next **independente**, com o próprio `package.json`, o próprio
`tsconfig.json` e as próprias dependências. Ele mora dentro deste repositório
só para compartilhar o histórico; não divide código, nem configuração, nem
estilo com o outro projeto daqui.

---

## O que dá para fazer

| Tela | O que mostra |
|---|---|
| `/` | Banner, as sete categorias e os mais vendidos |
| `/produtos` | Catálogo com busca, filtro por categoria e disponibilidade, e ordenação |
| `/produtos/<peça>` | Ficha técnica, estoque, preço e botão de compra |
| `/carrinho` | Carrinho inteiro, com pedido mínimo e aviso de frete à parte |
| `/finalizar` | Endereço, condição, nº do pedido de compra e envio |
| `/pedidos` | Histórico com régua de andamento e «repetir pedido» |
| `/empresa`, `/cadastro` | Cadastro pelo CNPJ, com conferência do dígito |
| `/admin` | O painel, em sete telas (abaixo) |

**O painel** (`/admin`, sem senha na demonstração) tem: visão geral com os
números de 7 e 30 dias, empresas com linha do tempo, oportunidades (carrinho
abandonado e «viu e não comprou»), pedidos com mudança de status, produtos com
edição de preço e importação de planilha, campanhas e integrações.

Ele junta **dez empresas fictícias** com a **sua navegação real neste
aparelho** — a sua aparece marcada como «este aparelho» em toda tela.

### O roteiro curto para demonstrar

1. Cadastre uma empresa com um CNPJ válido qualquer.
2. Ponha três produtos no carrinho e mude uma quantidade.
3. Finalize o pedido e veja-o aparecer em **Meus pedidos**.
4. Clique em **Repetir pedido**: o carrinho volta montado.
5. Vá em `/admin` → **Empresas**: a sua empresa está lá, com a linha do tempo.
6. Vá em **Produtos**, mude um preço e volte à loja: mudou na hora.
7. Em **Oportunidades**, clique em «simular abandono agora».

Para zerar tudo: **Minha empresa → Apagar os dados desta demonstração**.

---

## Como está montado

```
src/
  app/            páginas (App Router)
  componentes/    cabeçalho, cartão, gaveta do carrinho, desenhos…
  dados/          catálogo, categorias e as empresas fictícias
  lib/            estado global, carrinho, CNPJ, formatação, painel
public/marca/     logo, ícones e a imagem de compartilhamento
```

- **Estado:** um contexto React (`src/lib/estado.tsx`), espelhado no
  `localStorage` com o prefixo `ca-loja-`. Sem servidor, sem banco, sem API.
- **Catálogo:** `src/dados/produtos.ts` é a fonte única — 25 itens em 7
  categorias. O painel não reescreve esse arquivo: grava uma **sobrescrita** por
  cima, que «restaurar originais» apaga.
- **Estilo:** Tailwind v4, com a paleta do Brand Kit declarada em
  `src/app/globals.css`. Fonte Montserrat.

---

## Decisões que valem saber

**As fotos de produto são render, não fotografia.** Não existe foto dos
produtos da Control disponível, e banco de imagens mostraria peça de outro
fabricante com a marca dele à vista. As 25 peças foram modeladas por medida —
as mesmas de `src/dados/produtos.ts` — e fotografadas numa cena de estúdio
única no Blender: fundo branco, mesma luz e **o mesmo ângulo em todas**. A
página do produto declara «Imagem ilustrativa (render)».

As **silhuetas em linha** continuam, mas só onde representam **categoria** —
os cartões da página inicial e o filtro do catálogo. Elas também são o reserva:
produto sem render cai na silhueta em vez de mostrar quadrado vazio.

### Refazer as imagens

```bash
python scripts/extrair_catalogo.py                       # catálogo → JSON
python scripts/gerar_rotulos.py                          # a arte dos rótulos
"C:\Program Files\Blender Foundation\Blender 5.2lender.exe" -b     --python scripts/render_produtos.py -- --saida _provas/render
python scripts/converter_imagens.py                      # PNG → WEBP 1200 e 600
```

Para renderizar só algumas peças, acrescente `--so CA-BC-M8-12,CA-BO-CN-16`.
Se a placa de vídeo estiver ocupada (jogo aberto, navegador pesado), acrescente
`--cpu`: é mais lento e não depende dela.

Só o antirrespingo tem embalagem com rótulo, e ele sai escrito — marca,
nome do produto, composição e volume, tudo lido de `produtos.ts`. Rótulo em
branco entrega que a imagem é render.

### Trocar por foto de verdade, quando a Control tirar

Grave o arquivo com **o mesmo nome**, em `public/produtos/`:

- `public/produtos/<código>.webp` — 1200 × 1200, para a página do produto;
- `public/produtos/<código>-600.webp` — 600 × 600, para os cartões.

Foto de celular serve, desde que siga o mesmo padrão das outras: **fundo
branco**, luz difusa (perto de uma janela, sem flash direto), peça centralizada
ocupando uns 70 % do quadro e nada de marca à vista. Mantenha o arquivo abaixo
de 250 KB. Não precisa mexer em código: a loja passa a servir a foto nova
sozinha.

**O banner é composição própria, não quadro de vídeo.** Os doze quadros
extraídos dos vídeos de marketing foram olhados um a um e nenhum serviu: dois
são o cartão de abertura, um mostra um rosto de perto, cinco trazem a logo
gravada no canto e os quatro restantes mostram a peça de um cliente e a marca
do fabricante do robô. Fora isso o vídeo tem 480 px de largura, o que não dá
banner nítido.

**Compatibilidade é descrita por característica técnica** — corrente,
refrigeração, rosca —, nunca por marca de tocha ou de consumível.

**O cabeçalho é `#121212`, um degrau mais escuro que a página.** Na logo de
fundo escuro o miolo das letras O, R e A é preto sólido; quanto mais escuro o
fundo atrás dela, menos esses miolos aparecem como furos. Ajuste o fundo,
nunca a logo.

**Três cores saíram dos valores propostos, por medição.** Os tons de estoque
tinham sido escolhidos para texto sobre branco e reprovavam sobre fundo escuro
(2,60:1, 2,60:1 e 1,81:1 contra o mínimo de 4,5:1 da WCAG AA). Os atuais medem
4,79:1, 4,96:1 e 6,80:1. Pelo mesmo motivo existe um laranja só para texto
miúdo: o Laranja Institucional dá 4,03:1 sobre o cartão. Está tudo anotado,
com os números, em `src/app/globals.css`.

---

## O que falta para virar portal de verdade

1. **Catálogo real**, com código, foto, preço e estoque vindos do ERP da
   Control. Hoje é arquivo, e os preços são plausíveis, não reais.
2. **Cadastro de clientes** ligado ao sistema da Control: aqui o CNPJ só passa
   pela conferência do dígito, não existe consulta nenhuma.
3. **Condições comerciais de verdade** — pedido mínimo, prazos de pagamento e
   regra de frete. As que aparecem são ilustrativas.
4. **Decisão sobre quem aprova** um pedido antes de ele virar nota.
5. **Nome da categoria «Limpeza de tocha»** — fica a confirmar com o Diogo.

---

## Onde está no ar

**https://loja-controlarc.vercel.app**

Publicado em 08/11/2026, projeto `loja-controlarc`, plano gratuito.

A loja sai **fora do índice de busca**: `robots.txt` nega tudo e as páginas
levam `noindex`. O endereço não é linkado de lugar nenhum — quem tem o link
abre, quem não tem não encontra. Não há senha: se o link for repassado, a outra
pessoa também abre.

### Como republicar

O projeto foi criado pela linha de comando e **não está ligado ao Git**: push no
repositório não republica sozinho. Para subir uma versão nova:

```bash
cd demos/loja-controlarc
vercel deploy --prod
```

Para passar a publicar a cada push, ligue o repositório em
**Project Settings → Git**, com Root Directory em `demos/loja-controlarc` e
Production Branch em `loja-controlarc-demo`.

### Se quiser pôr senha

Dá para fechar com senha de graça, por middleware no próprio app, com a senha
em variável de ambiente — nunca escrita em arquivo. O *Password Protection* da
própria Vercel é pago (não existe no plano gratuito) e não é necessário.
