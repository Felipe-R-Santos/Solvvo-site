# ─────────────────────────────────────────────────────────────────────────────
# Desenha os rótulos que vão impressos nas embalagens do render.
#
#   python scripts/gerar_rotulos.py
#
# Só o antirrespingo tem embalagem com rótulo; o resto do catálogo é metal e
# cerâmica nus. Rótulo em branco entrega que a imagem é render — por isso aqui
# ele sai escrito, com a marca da Control ARC e o nome do produto.
#
# ⚠ TODO O TEXTO VEM DE `src/dados/produtos.ts`. Nome, medida e material saem
# do registro do próprio produto. Nada de frase de efeito, nada de selo de
# certificação, nada de advertência de segurança: inventar dizer de rótulo de
# produto químico é mentira com cara de detalhe caprichado — e, num produto de
# verdade, é o tipo de coisa que tem lei em cima.
#
# A fonte é Arial, que é a do Brand Kit da Control para figuras.
# ─────────────────────────────────────────────────────────────────────────────

import json
import re
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
# A versão de fundo ESCURO, porque o rótulo é escuro — a de fundo claro tem
# as letras em preto e sumiria no degradê.
LOGO = RAIZ / "public" / "marca" / "logo-fundo-escuro.png"
CATALOGO = RAIZ / "scripts" / "_catalogo.json"
SAIDA = RAIZ / "scripts" / "_rotulos"

ARIAL = Path("C:/Windows/Fonts/arial.ttf")
ARIAL_NEGRITO = Path("C:/Windows/Fonts/arialbd.ttf")

LARANJA = (223, 83, 24)
BRANCO = (255, 255, 255)
CINZA_CLARO = (205, 203, 200)
# O degradê do rótulo é o mesmo da abertura do site: preto no canto do texto,
# laranja quente no canto oposto.
FUNDO_ESCURO = (18, 18, 18)
FUNDO_QUENTE = (36, 23, 17)

# Quais produtos têm rótulo, e em que proporção (largura ÷ altura) a plaqueta
# do render o aplica. Precisa bater, senão a marca sai esticada.
ROTULADOS = {
    "CA-LT-AR-05": 78 / 60,
    "CA-LT-AR-01": 64 / 34,
}


def fonte(caminho, tamanho):
    return ImageFont.truetype(str(caminho), tamanho)


def centrado(d, y, texto, f, cor, largura):
    l = d.textlength(texto, font=f)
    d.text(((largura - l) / 2, y), texto, font=f, fill=cor)
    return y + f.size


def volume(medida):
    """«Galão 5 L» → «5 L»; «Frasco 1 L» → «1 L»."""
    m = re.search(r"(\d+(?:[.,]\d+)?)\s*L", medida)
    return f"{m.group(1)} L" if m else medida


def degrade(largura, altura):
    """O fundo do rótulo: preto no alto à esquerda, brasa no pé à direita.

    Mesma família do banner da loja — é o que tira a cara de etiqueta genérica
    e amarra a embalagem ao resto da identidade. Feito em numpy porque é
    cálculo por pixel; em laço de Python levaria segundos por rótulo."""
    ys, xs = np.mgrid[0:altura, 0:largura]
    x = xs / (largura - 1)
    y = ys / (altura - 1)

    base = np.clip(0.30 * x + 0.70 * y, 0, 1)[..., None]
    cor = np.array(FUNDO_ESCURO) * (1 - base) + np.array(FUNDO_QUENTE) * base

    # O brilho laranja, puxado para o canto de baixo à direita.
    d = np.sqrt(((x - 0.92) / 0.95) ** 2 + ((y - 1.02) / 0.85) ** 2)
    brilho = np.clip(1 - d, 0, 1) ** 1.5
    cor = cor + (np.array(LARANJA) - cor) * (brilho * 0.80)[..., None]

    return Image.fromarray(np.clip(cor, 0, 255).astype("uint8"), "RGB")


def desenhar(prod, proporcao):
    altura = 1200
    largura = int(altura * proporcao)
    img = degrade(largura, altura)
    d = ImageDraw.Draw(img)

    margem = int(largura * 0.08)
    util = largura - 2 * margem

    # ── a marca, no alto ──
    logo = Image.open(LOGO).convert("RGBA")
    # ⚠ A ALTURA DA LOGO TEM TETO. Dimensioná-la só pela largura funciona no
    # rótulo quadrado do galão, mas no rótulo largo do frasco — que dá a volta
    # na garrafa — a marca crescia junto com a largura e comia o espaço do
    # texto, até o layout não fechar.
    lw = int(util * 0.76)
    lh = int(lw * logo.height / logo.width)
    if lh > altura * 0.26:
        lh = int(altura * 0.26)
        lw = int(lh * logo.width / logo.height)
    logo = logo.resize((lw, lh), Image.LANCZOS)
    y = int(altura * 0.08)
    img.paste(logo, ((largura - lw) // 2, y), logo)
    y += lh + int(altura * 0.05)

    # ── régua laranja ──
    d.rectangle(
        [margem, y, largura - margem, y + max(3, int(altura * 0.008))], fill=LARANJA
    )
    y += int(altura * 0.055)

    # ── o nome do produto, que é o que o rótulo precisa gritar ──
    f_nome = fonte(ARIAL_NEGRITO, int(altura * 0.105))
    nome = prod["nome"].upper()
    while d.textlength(nome, font=f_nome) > util and f_nome.size > 20:
        f_nome = fonte(ARIAL_NEGRITO, f_nome.size - 2)
    y = centrado(d, y, nome, f_nome, BRANCO, largura) + int(altura * 0.025)

    # ── a composição, em letra miúda ──
    f_sub = fonte(ARIAL, int(altura * 0.055))
    y = centrado(d, y, prod["material"], f_sub, CINZA_CLARO, largura)

    # ── o volume, grande, ANCORADO NO RODAPÉ ──
    # Empilhar de cima para baixo estourava a borda: o «5 L» saía cortado pela
    # base do rótulo. Daqui para baixo a conta é a partir do pé.
    f_vol = fonte(ARIAL_NEGRITO, int(altura * 0.155))
    base_y = altura - int(altura * 0.09) - f_vol.size
    if base_y < y + int(altura * 0.02):
        raise SystemExit(f"{prod['codigo']}: o texto nao cabe no rotulo")
    centrado(d, base_y, volume(prod["medida"]), f_vol, BRANCO, largura)

    return img


def main():
    SAIDA.mkdir(parents=True, exist_ok=True)
    produtos = {p["codigo"]: p for p in json.loads(CATALOGO.read_text(encoding="utf-8"))}
    for codigo, proporcao in ROTULADOS.items():
        prod = produtos.get(codigo)
        if not prod:
            raise SystemExit(f"{codigo} não está no catálogo")
        img = desenhar(prod, proporcao)
        destino = SAIDA / f"{codigo}.png"
        img.save(destino)
        print(f"  {codigo}  {img.width}×{img.height}  {prod['nome']} {prod['medida']}")
    print(f"\n{len(ROTULADOS)} rótulos → {SAIDA.relative_to(RAIZ)}")


main()
