# ─────────────────────────────────────────────────────────────────────────────
# Dos PNG do render para os WEBP que a loja serve.
#
#   python scripts/converter_imagens.py
#
# O Blender grava PNG com fundo transparente (captador de sombra). Aqui o fundo
# vira BRANCO de verdade e sai em dois tamanhos: 1200 para a página do produto
# e 600 para os cartões.
#
# ⚠ O TETO É 250 KB POR ARQUIVO, exigência do comando. A qualidade cai em
# degraus até caber; se nem no menor degrau couber, o arquivo é recusado em vez
# de entrar grande e pesar no celular de quem abre a loja no chão de fábrica.
# ─────────────────────────────────────────────────────────────────────────────

from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ENTRADA = RAIZ / "_provas" / "render"
SAIDA = RAIZ / "public" / "produtos"
TETO_KB = 250
QUALIDADES = (92, 88, 82, 76, 70, 62)


def gravar(img, destino, lado):
    """Grava no maior nível de qualidade que ainda caiba no teto."""
    quadro = img.resize((lado, lado), Image.LANCZOS)
    for q in QUALIDADES:
        quadro.save(destino, "WEBP", quality=q, method=6)
        kb = destino.stat().st_size / 1024
        if kb <= TETO_KB:
            return q, kb
    raise SystemExit(f"{destino.name} não cabe em {TETO_KB} KB nem na qualidade mínima")


def main():
    SAIDA.mkdir(parents=True, exist_ok=True)
    fontes = sorted(ENTRADA.glob("CA-*.png"))
    if not fontes:
        raise SystemExit(f"nenhum render em {ENTRADA}")

    maior = 0.0
    for f in fontes:
        bruto = Image.open(f).convert("RGBA")
        # O fundo branco entra aqui, não no Blender: assim o mesmo render serve
        # para qualquer fundo que a loja venha a usar depois.
        branco = Image.new("RGBA", bruto.size, (255, 255, 255, 255))
        composto = Image.alpha_composite(branco, bruto).convert("RGB")

        q1, kb1 = gravar(composto, SAIDA / f"{f.stem}.webp", 1200)
        q2, kb2 = gravar(composto, SAIDA / f"{f.stem}-600.webp", 600)
        maior = max(maior, kb1, kb2)
        print(f"  {f.stem:<14} 1200: {kb1:6.1f} KB (q{q1})   600: {kb2:5.1f} KB (q{q2})")

    print(f"\n{len(fontes)} produtos · maior arquivo {maior:.1f} KB · teto {TETO_KB} KB")


main()
