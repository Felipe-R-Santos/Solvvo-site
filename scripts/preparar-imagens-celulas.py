# -*- coding: utf-8 -*-
"""
Prepara os renders de células PADRÃO para o site (public/celulas/).

POR QUE ESTES ARQUIVOS E NÃO OUTROS:
- Fonte: geradores/public/celulas-padrao/*-iso.png — são as células PADRÃO do
  catálogo, geometria genérica. NÃO usamos storage/layouts/<leadId>/, que é
  layout gerado PARA UM LEAD: a pasta é o id do cliente e a peça é a dele.
  Nenhuma imagem aqui carrega dado de cliente.
- Também não usamos os esquemas 2D (motor/celulas-prontas-solda): além de
  feios em fundo escuro, eles imprimem payload e referência de fabricante —
  exatamente o que não interessa entregar de graça ao concorrente.

O QUE O SCRIPT FAZ:
1. Troca o fundo cinza-claro (198,199,201) pelo cinza escuro da marca, por
   FLOOD FILL a partir dos 4 cantos. Flood fill em vez de "trocar todo pixel
   claro" porque as mesas e grades da célula também são claras — por limiar
   global elas virariam buraco.
2. Aplica marca d'água discreta (logo + solvvo.com.br).
3. Reduz para 1200 px e grava WebP (peso pequeno: hospedagem grátis).

USO:  python scripts/preparar-imagens-celulas.py
"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

AQUI   = os.path.dirname(os.path.abspath(__file__))
SITE   = os.path.dirname(AQUI)

# O acervo de renders vive FORA deste repositório (é o projeto do CRM, que é
# privado). Caminho RELATIVO de propósito: caminho absoluto num repositório
# público vaza o nome de usuário e a estrutura de pastas da máquina, e não
# funciona para mais ninguém. Pode ser sobrescrito por variável de ambiente.
ACERVO = os.environ.get(
    "SOLVVO_ACERVO",
    os.path.abspath(os.path.join(SITE, "..", "CRM Robotica")),
)
FONTE  = os.path.join(ACERVO, "geradores", "public", "celulas-padrao")
LOGO   = os.path.join(ACERVO, "geradores", "solda", "logo_solvvo.png")
SAIDA  = os.path.join(SITE, "public", "celulas")

# ── CORES DE FUNDO ──────────────────────────────────────────────────────────
# Atualizadas em 05/08/2026 junto com a Fase 2. Antes eram (0x16,0x18,0x17),
# calibradas para o #0a0a0a que o site usava; o carvão institucional agora é
# #1A1A1A e a superfície de cartão é #232321.
#
# ⚠ AS SEIS IMAGENS QUE JÁ ESTÃO EM public/celulas/ CARREGAM O FUNDO ANTIGO
#   (#171717). Elas só passam a bater com a paleta nova quando este script for
#   rodado de novo, e para isso é preciso ter o acervo do CRM na máquina. Não é
#   defeito visível — é 9 pontos de luminância —, mas está registrado para quem
#   for regenerar a galeria.
CARVAO = (0x23, 0x23, 0x21)          # --sv-surface do tema escuro
PAPEL  = (0xFA, 0xF9, 0xF6)          # --sv-surface do tema claro
FUNDO_HERO = (0x1A, 0x1A, 0x1A)      # --sv-bg do tema escuro: o herói sangra na
                                     # página, então casa com o FUNDO, não com o
                                     # cartão. Era (0x10,0x12,0x11) no #0a0a0a.
LARGURA     = 1200

# 6 arquiteturas visualmente distintas (não 23: galeria não é catálogo)
ESCOLHIDAS = [
    ("sw-cc1",    "Célula compacta"),
    ("sw-h",      "Célula H — duas estações"),
    ("sw-col",    "Coluna com lança"),
    ("sw-gan",    "Pórtico"),
    ("sw-ferris", "Carrossel"),
    ("sw-tt",     "Mesa posicionadora"),
]

# ─── RENDERS DE 2026, GERAÇÃO NOVA ──────────────────────────────────────────
# Qualidade bem acima das seis acima: material, cor de segurança, periféricos,
# fonte de solda, painel elétrico e figura humana dando escala. Vão para os
# lugares de destaque; a galeria segue com as antigas até serem regeradas.
#
# ONDE FICAM OS PNG: FORA do repositório. Cada um tem ~10 MB e, uma vez
# commitado, ficaria no histórico do git para sempre. Aponte SOLVVO_RENDERS
# para a pasta onde eles estiverem. O padrão é a raiz do site apenas como
# local de pouso — e por isso o .gitignore barra "Celulas Solvvo *.png".
#
# NÃO LEVAM MARCA D'ÁGUA, ao contrário das seis antigas: estes renders já têm a
# marca Solvvo aplicada nos painéis da cerca e no decalque do piso. Carimbar o
# logo por cima seria a segunda marca na mesma imagem.
RENDERS_NOVOS = os.environ.get("SOLVVO_RENDERS", SITE)
LARGURA_NOVAS = 1600

NOVAS = [
    ("Celulas Solvvo H2000.png",           "cel-h-duas-estacoes"),
    ("Celulas Solvvo H2000 com berco.png", "cel-h-com-berco"),
    ("Celulas Solvvo coluna e trilho.png", "cel-coluna-trilho"),
]

# Card social. 1,91:1 é a proporção que WhatsApp e LinkedIn usam; o conteúdo
# destes renders é quase quadrado, então o corte come piso vazio em cima e
# embaixo — decisão de Felipe, com a ressalva aceita.
OG_ORIGEM  = "Celulas Solvvo H2000 com berco.png"
OG_TAMANHO = (1200, 630)


def trocar_fundo(im):
    """Flood fill dos 4 cantos: só o fundo CONECTADO muda de cor."""
    im = im.convert("RGB")
    w, h = im.size
    for canto in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        try:
            ImageDraw.floodfill(im, canto, CARVAO, thresh=42)
        except Exception:
            pass
    return im


def marca_dagua(im):
    """Logo + domínio no canto inferior direito, discreto.
    Marca d'água não IMPEDE cópia — serve para o repost virar propaganda."""
    w, h = im.size
    if os.path.exists(LOGO):
        lw = int(w * 0.14)
        lg = Image.open(LOGO).convert("RGBA")
        lg = lg.resize((lw, int(lw * lg.height / lg.width)), Image.LANCZOS)
        # opacidade ~55%
        a = lg.getchannel("A").point(lambda p: int(p * 0.55))
        lg.putalpha(a)
        im.paste(lg, (w - lw - int(w * 0.03), h - lg.height - int(h * 0.03)), lg)
    return im


# ── FUNDO DO HERO ───────────────────────────────────────────────────────────
# Coluna e lança sobre trilho, com cerca, piso marcado e figura humana dando
# escala. Original de 7000x6000 px e 10 MB — inutilizável na web, daí o
# tratamento abaixo.
#
# TROCADO EM 05/08/2026. A origem anterior era
# `<acervo do CRM>/marketing/celula com coluna001.png`, que não existe mais na
# máquina — ou seja, o hero-celula.webp que estava no ar não tinha como ser
# regerado com as constantes novas da paleta. Manter os dois arquivos só criaria
# dúvida sobre qual é o vigente, então o antigo foi apagado e este passou a ser
# a única origem do herói.
HERO_ORIGEM = os.path.join(RENDERS_NOVOS, "Celulas Solvvo coluna e trilho.png")
HERO_LARGURA = 1920

# O herói sangra na página, então casa com --sv-bg de cada tema, não com o
# cartão. São DUAS versões por razão de contraste MEDIDO — ver o comentário
# extenso em preparar_hero() e o registro em DECISOES.md.
FUNDO_HERO_CARVAO = (0x1A, 0x1A, 0x1A)
FUNDO_HERO_PAPEL  = (0xF4, 0xF2, 0xED)


def preparar_hero(tema="carvao"):
    """Trata o render para servir de fundo ATRÁS DE TEXTO.

    ⚠ SÃO DUAS VERSÕES, E NÃO UMA. Não "simplifique" para um arquivo só.

    O motivo é contraste medido, não gosto. Amostrando os pixels reais do render
    por baixo de cada bloco de texto do herói (144 amostras por elemento,
    compondo o véu por cima), a versão carvão usada no tema claro dava:
    subtítulo 3,49:1, citação 4,28:1 e etiqueta 2,14:1 — contra os 4,5:1 que a
    WCAG AA exige. A causa é direta: o tratamento carvão PUXA OS REALCES PARA
    BAIXO para que texto claro leia; no tema claro o véu é claro sobre imagem
    escura, dá cinza médio, e aí é o texto ESCURO que some.

    Os dois tratamentos são espelhados:

    CARVÃO — fundo escuro, texto claro por cima.
      1. FLOOD FILL do fundo cinza-claro (222,222,222) -> carvão da marca.
         Testado contra escurecer tudo por multiply: aquela versão ficou
         cinza-lama, perdeu o laranja e deixava emenda visível no topo.
      2. PUXA OS REALCES. O piso do render é quase branco. Escurecer a imagem
         inteira mata a cor; a máscara age só acima de luminância 90, o que
         derruba o piso e não toca robô nem posicionador.

    PAPEL — fundo claro, texto escuro por cima. O espelho: a máscara age só
      ABAIXO de luminância 200 e levanta as sombras em direção ao papel. A
      cerca e os painéis escuros é que precisavam subir, não o piso.

    3. DEVOLVE SATURAÇÃO em ambos: os passos anteriores lavam a cor, e isto
       recupera o laranja da lança e o verde das grades, que são a marca.
    """
    if not os.path.exists(HERO_ORIGEM):
        print(f"AVISO: nao achei o render do hero: {HERO_ORIGEM}")
        return None
    papel = tema == "papel"
    fundo = FUNDO_HERO_PAPEL if papel else FUNDO_HERO_CARVAO

    im = Image.open(HERO_ORIGEM).convert("RGB")
    im = im.resize((HERO_LARGURA, int(HERO_LARGURA * im.height / im.width)), Image.LANCZOS)

    for canto in [(0, 0), (im.width - 1, 0), (0, im.height - 1), (im.width - 1, im.height - 1)]:
        try:
            ImageDraw.floodfill(im, canto, fundo, thresh=40)
        except Exception:
            pass

    if papel:
        # levanta as SOMBRAS: 255 onde é escuro, 0 onde já é claro
        mascara = im.convert("L").point(lambda p: 0 if p > 200 else int((200 - p) * 255 / 200))
        forca = 0.86
    else:
        # derruba os REALCES: 255 onde é claro, 0 onde já é escuro
        mascara = im.convert("L").point(lambda p: 0 if p < 90 else int((p - 90) * 255 / 165))
        forca = 0.80

    chapado = Image.new("RGB", im.size, fundo)
    im = Image.composite(Image.blend(im, chapado, forca), im, mascara)
    im = ImageEnhance.Color(im).enhance(1.30)

    destino = f"hero-celula-{tema}.webp"
    dst = os.path.join(SAIDA, "..", destino)
    im.save(dst, "WEBP", quality=80, method=6)
    tam = os.path.getsize(dst)
    print(f"gerado: {destino}  ({im.width}x{im.height}, {tam // 1024} KB)")
    return (dst, tam)


def _caixa_do_conteudo(im, folga=0.03):
    """Onde a célula realmente está, para o corte não ficar no olho.

    Detecta o que NÃO é o cinza do fundo: pixel com saturação (max-min dos
    canais) acima de 30, ou escuro demais para ser fundo. O fundo destes
    renders é cinza neutro puro, então saturação separa bem — e o critério de
    escuridão pega a estrutura cinza-chumbo dos painéis, que tem saturação
    baixa mas é bem mais escura que o fundo.
    """
    p = im.convert("RGB").resize((875, 750), Image.LANCZOS)
    px = p.load()
    xs, ys = [], []
    for y in range(750):
        for x in range(875):
            r, g, b = px[x, y]
            if (max(r, g, b) - min(r, g, b)) > 30 or max(r, g, b) < 120:
                xs.append(x); ys.append(y)
    if not xs:
        return (0, 0, im.width, im.height)
    x0, x1 = min(xs) / 875 - folga, max(xs) / 875 + folga
    y0, y1 = min(ys) / 750 - folga, max(ys) / 750 + folga
    return (max(0, int(x0 * im.width)),  max(0, int(y0 * im.height)),
            min(im.width, int(x1 * im.width)), min(im.height, int(y1 * im.height)))


def _fundo_para(im, cor):
    """Flood fill dos quatro cantos com tolerância alta.

    Tolerância 60, e não os 42 das seis antigas: o fundo destes renders é um
    DEGRADÊ (medido: 189 a 222 do topo para a base), não um cinza chapado. Com
    42 o preenchimento parava no meio do degradê e deixava uma faixa clara
    visível no pé da imagem — o que num fundo carvão salta aos olhos.
    """
    im = im.convert("RGB")
    w, h = im.size
    for canto in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
                  (w // 2, 0), (w // 2, h - 1)]:
        try:
            ImageDraw.floodfill(im, canto, cor, thresh=60)
        except Exception:
            pass
    return im


def preparar_novas():
    """Gera as duas versões de cada render novo: fundo carvão e fundo papel.

    Duas versões da mesma fonte, e não uma imagem com fundo transparente,
    porque o render tem sombra de contato no piso: em PNG com alfa a sombra
    ficaria recortada num contorno duro. Com o fundo preenchido, a sombra se
    dissolve na cor de destino e some sem deixar borda.
    """
    feitos = []
    for arquivo, slug in NOVAS:
        src = os.path.join(RENDERS_NOVOS, arquivo)
        if not os.path.exists(src):
            print(f"AVISO: nao achei {src} — pulando")
            continue
        base = Image.open(src).convert("RGB")
        base = base.crop(_caixa_do_conteudo(base))
        base = base.resize(
            (LARGURA_NOVAS, int(LARGURA_NOVAS * base.height / base.width)),
            Image.LANCZOS,
        )
        for sufixo, cor in (("carvao", CARVAO), ("papel", PAPEL)):
            im = _fundo_para(base.copy(), cor)
            dst = os.path.join(SAIDA, f"{slug}-{sufixo}.webp")
            im.save(dst, "WEBP", quality=82, method=6)
            feitos.append((dst, os.path.getsize(dst)))
            print(f"gerado: {os.path.basename(dst)}  "
                  f"({im.width}x{im.height}, {os.path.getsize(dst)//1024} KB)")
    return feitos


# ── RETRATO DA SEÇÃO SOBRE ──────────────────────────────────────────────────
# Tratamento SEPARADO dos renders, e é importante entender por quê:
#
#   . NÃO passa por trocar_fundo() nem por _fundo_para(). Aqueles fazem flood
#     fill do fundo a partir dos cantos, o que só funciona em render com fundo
#     chapado. Numa FOTOGRAFIA o fundo tem gradiente, grão e sombra contínua —
#     o flood fill vaza para dentro da imagem e destrói o retrato.
#   . NÃO passa por preparar_hero(). Aquele derruba realces ou levanta sombras
#     para o texto ler por cima; aqui não há texto por cima.
#   . NÃO ganha marca d'água. É pessoa, não peça de catálogo.
#
# O corte é 4:5 do PEITO PARA CIMA. A original é vertical de corpo inteiro
# (~2,7:1); numa coluna estreita, corpo inteiro deixa o rosto pequeno demais, e
# nesta seção é o rosto que faz o trabalho.
#
# Fica em PRETO E BRANCO, uma versão só, servindo os dois temas. Ver DECISOES.md.
RETRATO_ORIGEM = os.environ.get(
    "SOLVVO_RETRATO",
    os.path.join(os.path.expanduser("~"), "OneDrive", "Imagens",
                 "Felipe - Dia dos Pais 202510651.jpg"),
)
RETRATO_LARGURA = 900          # 900x1125, já em 4:5

# Janela do corte em FRAÇÃO da imagem original, medida sobre a foto: sobra de
# cabeça no topo, corte na altura do tronco embaixo. A proporção da janela já é
# 4:5 exata (0,468 de 4000 = 1872 px; 0,390 de 6000 = 2340 px).
# Deslocada para a direita do centro geométrico porque o rosto está descentrado
# na composição — centralizar no meio da foto deixaria o rosto na borda.
RETRATO_CAIXA = (0.326, 0.110, 0.794, 0.500)


def preparar_retrato():
    if not os.path.exists(RETRATO_ORIGEM):
        print(f"AVISO: nao achei o retrato: {RETRATO_ORIGEM} — pulando")
        return []
    im = Image.open(RETRATO_ORIGEM).convert("RGB")
    w, h = im.size
    x0, y0, x1, y1 = RETRATO_CAIXA
    cx = im.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))
    cx = cx.resize((RETRATO_LARGURA, RETRATO_LARGURA * 5 // 4), Image.LANCZOS)

    # A original já é preto e branco; o convert garante que nenhum resíduo de
    # cor sobreviva ao reencode.
    cx = cx.convert("L").convert("RGB")

    dst = os.path.join(SITE, "public", "felipe-retrato.webp")
    cx.save(dst, "WEBP", quality=84, method=6)
    print(f"gerado: felipe-retrato.webp  ({cx.width}x{cx.height}, "
          f"{os.path.getsize(dst) // 1024} KB)")
    return [(dst, os.path.getsize(dst))]


def preparar_og():
    """Card social, 1200x630.

    ENCAIXA a célula inteira e completa a lateral com a cor de fundo, em vez de
    cortar para preencher. Motivo medido: o conteúdo destes renders é 1,17:1 e o
    card é 1,91:1 — para preencher seria preciso descartar 39% da altura, e a
    célula ocupa quase toda ela. A primeira tentativa cortou a cabeça do robô e
    o decalque do piso. Célula inteira menor vale mais que célula grande
    decapitada, ainda mais num card que aparece com 300px de largura no celular.
    """
    src = os.path.join(RENDERS_NOVOS, OG_ORIGEM)
    if not os.path.exists(src):
        print(f"AVISO: nao achei {src} — pulando o card social")
        return []
    base = Image.open(src).convert("RGB")
    base = base.crop(_caixa_do_conteudo(base, folga=0.01))
    alvo_w, alvo_h = OG_TAMANHO
    margem = 0.94                       # respiro para a célula não encostar
    escala = min(alvo_w * margem / base.width, alvo_h * margem / base.height)
    base = base.resize(
        (max(1, int(base.width * escala)), max(1, int(base.height * escala))),
        Image.LANCZOS,
    )
    feitos = []
    for sufixo, cor in (("carvao", CARVAO), ("papel", PAPEL)):
        # preenche a célula PRIMEIRO, na cor de destino, e só então cola na
        # tela: assim a emenda entre o fundo do render e a tela é invisível.
        recorte = _fundo_para(base.copy(), cor)
        tela = Image.new("RGB", OG_TAMANHO, cor)
        tela.paste(recorte, ((alvo_w - recorte.width) // 2,
                             (alvo_h - recorte.height) // 2))
        dst = os.path.join(SAIDA, f"og-celula-{sufixo}.webp")
        tela.save(dst, "WEBP", quality=85, method=6)
        feitos.append((dst, os.path.getsize(dst)))
        print(f"gerado: {os.path.basename(dst)}  "
              f"(1200x630, {os.path.getsize(dst)//1024} KB)")
    return feitos


def main():
    os.makedirs(SAIDA, exist_ok=True)
    hero = [x for x in (preparar_hero("carvao"), preparar_hero("papel")) if x]
    novas = preparar_novas()
    og = preparar_og()
    retrato = preparar_retrato()
    feitos = []
    for slug, _rotulo in ESCOLHIDAS:
        src = os.path.join(FONTE, f"{slug}-iso.png")
        if not os.path.exists(src):
            print(f"AVISO: nao achei {src} — pulando")
            continue
        im = Image.open(src)
        im = trocar_fundo(im)
        im = im.resize((LARGURA, int(LARGURA * im.height / im.width)), Image.LANCZOS)
        im = marca_dagua(im)
        dst = os.path.join(SAIDA, f"{slug}.webp")
        im.save(dst, "WEBP", quality=82, method=6)
        feitos.append((dst, os.path.getsize(dst)))
        print(f"gerado: {os.path.basename(dst)}  ({os.path.getsize(dst)//1024} KB)")
    feitos += hero + novas + og + retrato
    print(f"\n{len(feitos)} imagens em {SAIDA}")
    print(f"peso total: {sum(s for _, s in feitos)//1024} KB")


if __name__ == "__main__":
    main()
