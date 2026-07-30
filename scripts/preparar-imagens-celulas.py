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

CINZA_MARCA = (0x16, 0x18, 0x17)     # combina com o #0a0a0a do site
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


def trocar_fundo(im):
    """Flood fill dos 4 cantos: só o fundo CONECTADO muda de cor."""
    im = im.convert("RGB")
    w, h = im.size
    for canto in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        try:
            ImageDraw.floodfill(im, canto, CINZA_MARCA, thresh=42)
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
# Render de célula com coluna e lança, grades e piso com a
# marca Solvvo, figura humana dando escala. Original tem 9000x8000 px e 18 MB —
# inutilizável na web, por isso o tratamento abaixo.
HERO_ORIGEM = os.path.join(ACERVO, "marketing", "celula com coluna001.png")
HERO_LARGURA = 1920


def preparar_hero():
    """Trata o render para servir de fundo ATRÁS DE TEXTO BRANCO.

    Três passos, e cada um resolve um problema medido:

    1. FLOOD FILL do fundo cinza-claro (222,222,222) -> escuro da marca.
       Testado contra a alternativa de só escurecer tudo por multiply: aquela
       versão ficou cinza-lama, perdeu o laranja e ainda deixava o fundo bem
       mais claro que o #0a0a0a do site — emenda visível no topo da página.

    2. PUXA SÓ OS REALCES. O piso do render é quase branco. Escurecer a imagem
       inteira mata a cor; então a máscara age apenas acima de luminância 90,
       o que derruba o piso para cinza médio e não toca robô nem posicionador.
       Sem isto, texto branco em cima do piso fica ilegível.

    3. DEVOLVE SATURAÇÃO (+30%). Os passos 1 e 2 lavam um pouco a cor; isto
       recupera o laranja da lança e o verde das grades, que são a marca.
    """
    if not os.path.exists(HERO_ORIGEM):
        print(f"AVISO: nao achei o render do hero: {HERO_ORIGEM}")
        return
    im = Image.open(HERO_ORIGEM).convert("RGB")
    im = im.resize((HERO_LARGURA, int(HERO_LARGURA * im.height / im.width)), Image.LANCZOS)

    for canto in [(0, 0), (im.width - 1, 0), (0, im.height - 1), (im.width - 1, im.height - 1)]:
        try:
            ImageDraw.floodfill(im, canto, (0x10, 0x12, 0x11), thresh=40)
        except Exception:
            pass

    mascara = im.convert("L").point(lambda p: 0 if p < 90 else int((p - 90) * 255 / 165))
    escuro = Image.new("RGB", im.size, (0x1A, 0x1C, 0x1B))
    im = Image.composite(Image.blend(im, escuro, 0.80), im, mascara)
    im = ImageEnhance.Color(im).enhance(1.30)

    dst = os.path.join(SAIDA, "..", "hero-celula.webp")
    im.save(dst, "WEBP", quality=80, method=6)
    kb = os.path.getsize(dst) // 1024
    print(f"gerado: hero-celula.webp  ({im.width}x{im.height}, {kb} KB)")


def main():
    os.makedirs(SAIDA, exist_ok=True)
    preparar_hero()
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
    print(f"\n{len(feitos)} imagens em {SAIDA}")
    print(f"peso total: {sum(s for _, s in feitos)//1024} KB")


if __name__ == "__main__":
    main()
