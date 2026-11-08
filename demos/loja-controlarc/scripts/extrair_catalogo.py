# ─────────────────────────────────────────────────────────────────────────────
# Tira o catálogo de `src/dados/produtos.ts` e grava `scripts/_catalogo.json`,
# que é o que o script de render lê.
#
#   python scripts/extrair_catalogo.py
#
# Por que ler o TypeScript em vez de manter uma lista à parte: lista à parte
# diverge na primeira vez que alguém muda uma medida, e o render passaria a
# mostrar uma peça que o catálogo não vende mais. A fonte continua sendo uma só.
# ─────────────────────────────────────────────────────────────────────────────

import json
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
FONTE = RAIZ / "src" / "dados" / "produtos.ts"
DESTINO = RAIZ / "scripts" / "_catalogo.json"

CAMPOS = [
    "codigo", "slug", "nome", "medida", "material", "compatibilidade",
    "categoria", "unidade", "prazo", "desenho", "estoque",
]


def main():
    src = FONTE.read_text(encoding="utf-8")
    bloco = src[src.index("export const PRODUTOS"):src.index("export const produtoPorSlug")]

    itens = []
    for m in re.finditer(r"\{\s*codigo:(.*?)\n  \}", bloco, re.S):
        t = m.group(0)
        d = {}
        for campo in CAMPOS:
            g = re.search(campo + r':\s*"([^"]*)"', t)
            if g:
                d[campo] = g.group(1)
        if "codigo" in d:
            itens.append(d)

    if not itens:
        raise SystemExit("nenhum produto reconhecido — o formato de produtos.ts mudou?")

    DESTINO.write_text(json.dumps(itens, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(itens)} produtos → {DESTINO.relative_to(RAIZ)}")


main()
