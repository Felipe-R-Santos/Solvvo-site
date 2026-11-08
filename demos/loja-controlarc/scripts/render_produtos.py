# ─────────────────────────────────────────────────────────────────────────────
# RENDER DAS FOTOS DE PRODUTO — roda DENTRO do Blender.
#
#   "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b \
#       --python scripts/render_produtos.py -- --saida _provas/render
#
# Por que render e não foto: não existe foto dos produtos da Control, e foto de
# banco de imagens mostraria peça de outro fabricante, com a marca dele à vista.
# A peça é modelada por medida — a mesma que está em `src/dados/produtos.ts` —,
# fotografada numa cena de estúdio única e sai sem marca nenhuma.
#
# ⚠ A MESMA CENA E O MESMO ENQUADRAMENTO EM TODAS AS PEÇAS. É o que faz a
# fileira de cartões parecer um catálogo, e não um ajuntado de imagens. Quem
# mexer na câmera ou na luz, refaça TODAS as peças, nunca uma só.
#
# ⚠ `view_transform = 'Standard'`. O padrão do Blender (AgX) acinzenta o branco,
# e o fundo sairia cinza-claro em vez de branco — justamente o que o cartão
# branco da loja não pode ter.
#
# Unidade do modelo: 1 unidade de Blender = 1 milímetro.
# ─────────────────────────────────────────────────────────────────────────────

import bpy
from mathutils import Vector
import json
import math
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CATALOGO = RAIZ / "scripts" / "_catalogo.json"

# Quanto do quadro a peça ocupa. O comando pede ≈ 70 %.
OCUPACAO = 0.70
LADO = 1200
AMOSTRAS = 128


# ── utilidades ──────────────────────────────────────────────────────────────

def limpar():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for bloco in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras):
        for item in list(bloco):
            if item.users == 0:
                bloco.remove(item)


def material(nome, cor, metalico=1.0, rugosidade=0.25, transmissao=0.0):
    m = bpy.data.materials.get(nome)
    if m:
        return m
    m = bpy.data.materials.new(nome)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*cor, 1.0)
    b.inputs["Metallic"].default_value = metalico
    b.inputs["Roughness"].default_value = rugosidade
    if "Transmission Weight" in b.inputs:
        b.inputs["Transmission Weight"].default_value = transmissao
    return m


# Os materiais do comando, um por linha, para ninguém inventar cor no meio do
# código. Valores aproximados de cada liga em sRGB linear.
MATERIAIS = {
    "cobre":        lambda: material("cobre", (0.72, 0.33, 0.18), 1.0, 0.22),
    "cobre_cromado": lambda: material("cobre_cromado", (0.70, 0.69, 0.67), 1.0, 0.20),
    "latao":        lambda: material("latao", (0.76, 0.60, 0.25), 1.0, 0.24),
    "latao_niquel": lambda: material("latao_niquel", (0.80, 0.80, 0.78), 1.0, 0.16),
    "aco":          lambda: material("aco", (0.56, 0.57, 0.58), 1.0, 0.28),
    "aco_escuro":   lambda: material("aco_escuro", (0.46, 0.47, 0.48), 1.0, 0.34),
    "ceramica":     lambda: material("ceramica", (0.92, 0.91, 0.88), 0.0, 0.42),
    "plastico":     lambda: material("plastico", (0.14, 0.26, 0.40), 0.0, 0.30),
    "plastico_claro": lambda: material("plastico_claro", (0.86, 0.86, 0.87), 0.0, 0.35),
    "borracha":     lambda: material("borracha", (0.09, 0.09, 0.10), 0.0, 0.62),
}


def pintar(obj, chave):
    obj.data.materials.clear()
    obj.data.materials.append(MATERIAIS[chave]())


def cilindro(r, h, z=0.0, v=96):
    bpy.ops.mesh.primitive_cylinder_add(vertices=v, radius=r, depth=h, location=(0, 0, z))
    return bpy.context.object


def cone(r1, r2, h, z=0.0, v=96):
    bpy.ops.mesh.primitive_cone_add(vertices=v, radius1=r1, radius2=r2, depth=h, location=(0, 0, z))
    return bpy.context.object


def sextavado(r, h, z=0.0):
    return cilindro(r, h, z, v=6)


def anel(maior, menor, z=0.0, seg=64):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=maior, minor_radius=menor, major_segments=seg,
        minor_segments=16, location=(0, 0, z),
    )
    return bpy.context.object


def juntar(partes):
    """Funde tudo num objeto só, para a peça ter uma sombra de contato única."""
    bpy.ops.object.select_all(action="DESELECT")
    for p in partes:
        p.select_set(True)
    bpy.context.view_layer.objects.active = partes[0]
    bpy.ops.object.join()
    return bpy.context.object


def furar(alvo, ferramenta):
    m = alvo.modifiers.new("furo", "BOOLEAN")
    m.operation = "DIFFERENCE"
    m.object = ferramenta
    bpy.context.view_layer.objects.active = alvo
    bpy.ops.object.modifier_apply(modifier=m.name)
    bpy.data.objects.remove(ferramenta, do_unlink=True)
    return alvo


def chanfrar(obj, largura=0.18, segmentos=3):
    m = obj.modifiers.new("chanfro", "BEVEL")
    m.width = largura
    m.segments = segmentos
    m.limit_method = "ANGLE"
    m.angle_limit = math.radians(35)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=m.name)
    bpy.ops.object.shade_smooth()
    return obj


def rosca(raio, z0, comprimento, passo=1.0):
    """Rosca aproximada por anéis empilhados. Na escala do render ela lê como
    rosca; modelar hélice de verdade custa caro e não muda a leitura."""
    partes = []
    n = max(2, int(comprimento / passo))
    for i in range(n):
        partes.append(anel(raio, passo * 0.26, z0 + i * passo, seg=48))
    return partes


# ── as peças ────────────────────────────────────────────────────────────────
#
# ⚠ TUDO AQUI É TORNEADO POR PERFIL, não montado com primitivas sobrepostas.
# A primeira versão empilhava cilindro, cone e anéis e subtraía o furo com
# booleano: a malha saía auto-intersectada, o booleano comia o corpo da peça e
# o render mostrou um fio solto com molas em volta, não um bico de contato.
#
# Perfil é a lista de pontos (raio, altura) do corte da peça, girada 360° em
# volta do eixo Z — que é literalmente como um bico, um bocal ou um porta-bico
# são feitos no torno. Sai malha fechada, sem auto-intersecção, e o furo
# passante é parte do perfil, não um buraco aberto depois.
#
# O perfil é um ANEL FECHADO de pontos: sobe pela parede de fora, atravessa a
# boca, desce pela parede de dentro e fecha na base.
#
# Toda peça é modelada EM PÉ, eixo em Z, e fotografada assim. Nenhuma é girada
# para «ficar bonita»: girar uma só quebraria o alinhamento da fileira de
# cartões.

import bmesh


def tornear(perfil, seg=128, nome="peca"):
    """Gira um perfil fechado em volta do eixo Z e devolve o sólido."""
    me = bpy.data.meshes.new(nome)
    obj = bpy.data.objects.new(nome, me)
    bpy.context.collection.objects.link(obj)
    bm = bmesh.new()
    vs = [bm.verts.new((max(r, 0.0), 0.0, z)) for r, z in perfil]
    for a, b in zip(vs, vs[1:]):
        bm.edges.new((a, b))
    bm.edges.new((vs[-1], vs[0]))
    bm.to_mesh(me)
    bm.free()
    m = obj.modifiers.new("torno", "SCREW")
    m.axis = "Z"
    m.angle = math.radians(360)
    m.steps = seg
    m.render_steps = seg
    m.use_merge_vertices = True
    m.use_normal_calculate = True
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.ops.object.modifier_apply(modifier=m.name)
    try:
        bpy.ops.object.shade_auto_smooth(angle=math.radians(31))
    except Exception:
        bpy.ops.object.shade_smooth()
    return obj


def filetes(r, z0, z1, passo, fundo):
    """Os filetes da rosca, como dentes no próprio perfil. Rosca de verdade é
    uma hélice; no perfil ela vira serrilha, e na escala do catálogo lê igual —
    sem o custo e sem o risco de malha suja."""
    pts, z = [], z0
    while z < z1 - passo:
        pts += [(r, z), (r - fundo, z + passo * 0.5)]
        z += passo
    pts.append((r, min(z, z1)))
    return pts


# ── peças torneadas ─────────────────────────────────────────────────────────

def p_bico(rosca_mm, furo_mm):
    """Bico de contato: haste roscada, colar sextavado e nariz cônico."""
    rt, rf = rosca_mm / 2.0, furo_mm / 2.0
    rc = rt * 1.34
    comp = 25.0 if rosca_mm <= 6 else 31.0
    z_colar = comp * 0.52
    perfil = [(rf, 0.55), (rf + 0.55, 0.0), (rt, 0.0)]
    perfil += filetes(rt, 1.2, z_colar - 1.0, 1.0 if rosca_mm <= 6 else 1.25, 0.55)
    perfil += [
        (rt, z_colar), (rc, z_colar), (rc, z_colar + 5.2),
        (rt * 1.1, z_colar + 7.0), (rf + 1.0, comp), (rf + 0.45, comp),
        (rf, comp - 0.45),
    ]
    peca = tornear(perfil, seg=96 if rosca_mm <= 6 else 128)
    pintar(peca, "cobre")
    return [peca]


def p_bocal(forma, diam_mm):
    """Bocal: tubo de parede fina com assento atrás; cônico ou cilíndrico."""
    rb = diam_mm / 2.0
    r_tras = max(rb + 3.4, 9.6)
    r_boca = rb + 1.4 if forma == "conico" else r_tras
    comp = 58.0
    perfil = [
        (rb, 0.0), (r_tras + 1.1, 0.0), (r_tras + 1.1, 6.0), (r_tras, 7.6),
        (r_boca, comp - 0.5), (r_boca - 0.5, comp), (r_boca - 1.5, comp),
        (r_tras - 1.5, 9.0),
        (rb, 7.0),
    ]
    peca = tornear(perfil)
    return [peca]


def p_difusor(rosca_mm, isolado=False):
    """Difusor de gás: corpo sextavado, haste roscada e furos radiais."""
    rt = rosca_mm / 2.0
    # Duas voltas de torno, não uma: com seg=6 no perfil inteiro a ponta
    # redonda saía sextavada também, e a peça virava uma pilha de hexágonos.
    corpo = tornear([(2.6, 0.0), (7.6, 0.0), (7.6, 15.0), (2.6, 15.0)], seg=6)
    pintar(corpo, "latao")
    ponta = tornear([(2.6, 14.0), (5.6, 14.0), (5.6, 23.4), (5.1, 24.0),
                     (3.1, 24.0), (2.6, 23.5)])
    pintar(ponta, "latao")
    haste = tornear(
        [(rt * 0.5, -12.0), (rt, -12.0)] + filetes(rt, -11.0, -0.5, 1.25, 0.5)
        + [(rt, 0.5), (rt * 0.5, 0.5)]
    )
    pintar(haste, "latao")
    partes = [corpo, ponta, haste]
    # Os furos de gás: pinos escuros encaixados, em vez de booleano. Lêem como
    # furo e não arriscam a malha.
    for i in range(6):
        a = math.radians(i * 60 + 30)
        f = cilindro(0.95, 2.6, 0, v=20)
        f.rotation_euler = (math.radians(90), 0, a)
        # Afundado ate rente a face do sextavado (6,58 do eixo): na primeira
        # versao o pino saia para fora e virava uma saliencia, nao um furo.
        # Rente à parede da ponta (raio 5,6), não à do sextavado: estavam
        # saindo para fora porque eu media pelo corpo e furava na ponta.
        f.location = (math.cos(a) * 4.45, math.sin(a) * 4.45, 19.0)
        pintar(f, "aco_escuro")
        partes.append(f)
    if isolado:
        aro = tornear([(7.7, 4.0), (8.6, 4.0), (8.6, 11.0), (7.7, 11.0)])
        pintar(aro, "ceramica")
        partes.append(aro)
    return partes


def p_porta_bico(rosca_mm, reforcado=False):
    """Porta-bico: rosca grossa atrás, colar sextavado, rosca fina à frente."""
    rt = rosca_mm / 2.0
    perfil = [(rt * 0.72, 0.5), (rt * 0.72 + 0.5, 0.0), (6.0, 0.0)]
    perfil += filetes(6.0, 1.0, 13.0, 1.25, 0.6)
    perfil += [(6.0, 14.0), (7.7, 14.5), (7.7, 19.5), (rt * 1.3, 20.5)]
    perfil += filetes(rt * 1.3, 21.0, 30.0, 1.0, 0.5)
    perfil += [(rt * 1.3, 31.0), (rt * 0.72 + 0.5, 31.0), (rt * 0.72, 30.5)]
    peca = tornear(perfil, seg=96)
    pintar(peca, "cobre_cromado" if reforcado else "latao_niquel")
    return [peca]


def p_fresa(diam_mm):
    """Fresa de limpeza: haste de aperto e cabeça com facas de corte.

    As facas são seis lados do próprio torneamento, não placas encostadas na
    peça. Tentei antes com blocos escuros ao redor: ou ficavam escondidos
    dentro da cabeça, ou pareciam aletas grudadas por fora."""
    rc = diam_mm / 2.0
    haste = tornear([(0.0, 0.0), (5.0, 0.0), (5.0, 22.0), (0.0, 22.0)])
    pintar(haste, "aco")
    cabeca = tornear([
        (0.0, 21.0), (rc, 23.0), (rc, 41.0), (rc * 0.62, 47.0), (0.0, 47.0),
    ], seg=6)
    pintar(cabeca, "aco")
    nucleo = tornear([(0.0, 23.0), (rc * 0.72, 23.0), (rc * 0.72, 44.0), (0.0, 44.0)])
    pintar(nucleo, "aco_escuro")
    return [haste, cabeca, nucleo]


def p_isolador():
    """Isolador de bocal: bucha de cerâmica branca com colar."""
    peca = tornear([
        (6.8, 0.0), (9.6, 0.0), (9.6, 3.0), (10.4, 3.5), (10.4, 5.0),
        (9.6, 5.5), (9.6, 14.4), (9.1, 15.0), (7.3, 15.0), (6.8, 14.5),
    ])
    pintar(peca, "ceramica")
    return [peca]


def p_roldana(canal_mm):
    """Roldana de tração: o canal em V está no próprio perfil, sem booleano."""
    v = max(1.0, canal_mm * 0.9)
    peca = tornear([
        (4.6, 0.0), (17.5, 0.0), (17.5, 4.0), (17.5 - v * 1.7, 6.0),
        (17.5, 8.0), (17.5, 12.0), (4.6, 12.0),
    ])
    pintar(peca, "aco_escuro")
    cubo = tornear([(4.6, 1.0), (9.0, 1.0), (9.0, 11.0), (4.6, 11.0)])
    pintar(cubo, "aco")
    return [peca, cubo]


def p_antirrespingo(litros):
    """Galão de 5 L ou frasco de 1 L, plástico, rótulo liso e sem texto."""
    if litros >= 5:
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 62.0))
        corpo = bpy.context.object
        corpo.scale = (92.0, 72.0, 124.0)
        bpy.ops.object.transform_apply(scale=True)
        chanfrar(corpo, 6.0, 5)
        pintar(corpo, "plastico")
        gargalo = tornear([(0, 124.0), (11.0, 124.0), (11.0, 138.0), (0, 138.0)])
        pintar(gargalo, "plastico")
        tampa = tornear([(0, 136.0), (13.5, 136.0), (13.5, 148.0), (0, 148.0)])
        pintar(tampa, "plastico_claro")
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -36.3, 60.0))
        etiqueta = bpy.context.object
        etiqueta.scale = (78.0, 0.9, 68.0)
        bpy.ops.object.transform_apply(scale=True)
        pintar(etiqueta, "plastico_claro")
    else:
        corpo = tornear([
            (0, 0.0), (32.0, 0.0), (32.0, 104.0), (22.0, 118.0),
            (10.0, 124.0), (10.0, 140.0), (0, 140.0),
        ])
        pintar(corpo, "plastico")
        gargalo = tornear([(0, 120.0), (11.0, 120.0), (11.0, 132.0), (0, 132.0)])
        pintar(gargalo, "plastico")
        tampa = tornear([(0, 130.0), (13.0, 130.0), (13.0, 144.0), (0, 144.0)])
        pintar(tampa, "plastico_claro")
        # Faixa de rótulo com espessura de verdade: o perfil anterior tinha os
        # quatro pontos no mesmo raio e gerava superfície degenerada.
        etiqueta = tornear([(32.1, 24.0), (33.0, 24.0), (33.0, 84.0), (32.1, 84.0)])
        pintar(etiqueta, "plastico_claro")
    return [corpo, gargalo, tampa, etiqueta]


def _tubo_curvo(graus, raio_tubo, comp_reto, comp_curva, material_chave):
    """Tubo que dobra num ângulo — feito com curva de Bézier e bisel redondo,
    que dá malha limpa onde empilhar cilindros dava emenda visível."""
    cu = bpy.data.curves.new("tubo", "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = raio_tubo
    cu.bevel_resolution = 12
    cu.use_fill_caps = True
    linha = cu.splines.new("POLY")
    pontos = [(0, 0, 0), (0, 0, comp_reto)]
    x, z, ang = 0.0, comp_reto, 0.0
    n = 16
    for _ in range(n):
        ang += math.radians(graus) / n
        x += math.sin(ang) * comp_curva / n
        z += math.cos(ang) * comp_curva / n
        pontos.append((x, 0, z))
    linha.points.add(len(pontos) - 1)
    for i, (px, py, pz) in enumerate(pontos):
        linha.points[i].co = (px, py, pz, 1.0)
    obj = bpy.data.objects.new("tubo", cu)
    bpy.context.collection.objects.link(obj)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.ops.object.convert(target="MESH")
    obj = bpy.context.object
    pintar(obj, material_chave)
    return obj, (x, z, ang)


def p_pescoco(graus):
    """Pescoço de tocha: tubo curvado no ângulo do produto, com anel cerâmico."""
    tubo, (x, z, ang) = _tubo_curvo(graus, 6.6, 50.0, 44.0, "latao")
    base = tornear([(0, 0.0), (9.4, 0.0), (9.4, 15.0), (0, 15.0)])
    pintar(base, "latao")
    aro = tornear([(6.6, -5.0), (7.9, -5.0), (7.9, 5.0), (6.6, 5.0)])
    aro.rotation_euler = (0, ang, 0)
    aro.location = (x - math.sin(ang) * 8, 0, z - math.cos(ang) * 8)
    pintar(aro, "ceramica")
    return [tubo, base, aro]


def p_conjunto_tocha():
    """Conjunto montado: corpo, pescoço, bocal e o começo do cabo."""
    tubo, (x, z, ang) = _tubo_curvo(45, 6.6, 50.0, 44.0, "latao")
    corpo = tornear([(0, -46.0), (14.5, -46.0), (14.5, -4.0), (9.4, 0.0), (0, 0.0)])
    pintar(corpo, "aco_escuro")
    cabo = tornear([(0, -62.0), (7.8, -62.0), (7.8, -44.0), (0, -44.0)])
    pintar(cabo, "borracha")
    bocal = tornear([
        (8.4, 0.0), (10.8, 0.0), (10.8, 4.0), (9.6, 34.0), (8.2, 34.0),
        (8.4, 4.0),
    ])
    bocal.rotation_euler = (0, ang, 0)
    # Encaixado sobre a ponta do pescoço, não flutuando ao lado dela.
    bocal.location = (x - math.sin(ang) * 12, 0, z - math.cos(ang) * 12)
    pintar(bocal, "cobre_cromado")
    return [tubo, corpo, cabo, bocal]


def p_conduite():
    """Conduíte de arame: vendido enrolado, com terminais nas duas pontas."""
    partes = []
    for i in range(96):
        a = i * (2 * math.pi / 96)
        c = anel(3.4, 0.62, 0.0, seg=22)
        c.rotation_euler = (math.radians(90), 0, a + math.pi / 2)
        c.location = (math.cos(a) * 66.0, math.sin(a) * 66.0, 0)
        pintar(c, "aco")
        partes.append(c)
    for a, dz in ((0.10, 5.0), (-0.10, -5.0)):
        t = tornear([(0, -7.0), (4.8, -7.0), (4.8, 7.0), (0, 7.0)], seg=48)
        t.rotation_euler = (math.radians(90), 0, a + math.pi / 2)
        t.location = (math.cos(a) * 66.0, math.sin(a) * 66.0, dz)
        pintar(t, "latao")
        partes.append(t)
    return partes


def p_aneis():
    """Kit de anéis de vedação: seis anéis sortidos, espalhados na mesa."""
    partes = []
    for x, y, r in ((-28, 11, 5.4), (0, 19, 6.6), (27, 9, 4.8),
                    (-19, -17, 6.0), (13, -21, 7.2), (37, -7, 4.2)):
        a = anel(r, r * 0.27, r * 0.27, seg=56)
        a.location = (x, y, r * 0.27)
        pintar(a, "borracha")
        partes.append(a)
    return partes


# ── o estúdio ───────────────────────────────────────────────────────────────

def montar_estudio():
    """Estúdio: três pontos de luz, refletores escuros e captador de sombra.

    ⚠ O FUNDO É TRANSPARENTE AQUI, e vira branco só na conversão. A primeira
    tentativa pintou um chão branco e acendeu a cena: deu 255 em TODOS os
    pixels das três peças de teste — fundo e peça indistinguíveis. Com
    `film_transparent` mais `is_shadow_catcher`, o chão não aparece, só a
    sombra que a peça projeta nele, e a exposição passa a depender só da luz
    que bate na peça.

    ⚠ OS DOIS REFLETORES ESCUROS NÃO SÃO ENFEITE. Metal polido espelha o que
    está em volta; num mundo todo branco, um bocal cromado vira uma mancha
    branca sem aresta. As chapas escuras dão a ele uma borda para refletir.

    Montado UMA vez por peça, sempre igual: luz diferente por peça daria 25
    fotos que não parecem do mesmo catálogo."""
    # ⚠ ENORME DE PROPÓSITO. Com 6000 a borda do chão entrava no quadro das
    # peças altas (galão e frasco) e aparecia como uma faixa branca no topo.
    bpy.ops.mesh.primitive_plane_add(size=60000, location=(0, 0, 0))
    chao = bpy.context.object
    chao.is_shadow_catcher = True

    mundo = bpy.data.worlds["World"]
    mundo.use_nodes = True
    mundo.node_tree.nodes["Background"].inputs[0].default_value = (0.78, 0.78, 0.80, 1)
    mundo.node_tree.nodes["Background"].inputs[1].default_value = 1.15

    escuro = material("refletor", (0.05, 0.05, 0.055), metalico=0.0, rugosidade=0.8)
    for x, y, rz in ((-520, 300, math.radians(58)), (560, 220, math.radians(-54))):
        bpy.ops.mesh.primitive_plane_add(size=1700, location=(x, y, 380))
        chapa = bpy.context.object
        chapa.rotation_euler = (math.radians(90), 0, rz)
        chapa.data.materials.append(escuro)
        # ⚠ A chapa existe SÓ PARA O REFLEXO. Se ela enxergar a luz, vira um
        # anteparo: na primeira tentativa sombreou a cena inteira e o captador
        # de sombra saiu opaco de ponta a ponta.
        chapa.visible_camera = False
        chapa.visible_diffuse = False
        chapa.visible_shadow = False
        chapa.visible_transmission = False

    def luz(nome, energia, tamanho, pos, alvo=(0, 0, 40)):
        d = bpy.data.lights.new(nome, type="AREA")
        d.energy = energia
        d.size = tamanho
        o = bpy.data.objects.new(nome, d)
        bpy.context.collection.objects.link(o)
        # ⚠ A LUZ NÃO PODE APARECER NA FOTO. Em Cycles a área de uma luz é
        # visível para a câmera por padrão: nas peças altas, em que a câmera
        # recua e sobe, a cúpula entrava no alto do quadro como uma faixa
        # branca de aresta dura. Achei que fosse a borda do chão; não era.
        o.visible_camera = False
        o.location = pos
        dx, dy, dz = (alvo[0] - pos[0], alvo[1] - pos[1], alvo[2] - pos[2])
        o.rotation_euler = (
            math.atan2(math.hypot(dx, dy), -dz),
            0,
            math.atan2(-dx, dy),
        )
        return o

    # Potências altas porque a cena é modelada em milímetros e o Blender conta
    # a queda da luz como se fossem metros: a luz está, para ele, a centenas de
    # metros da peça.
    luz("principal", 2_400_000, 700, (-420, -460, 540))
    luz("preenchimento", 700_000, 900, (560, -300, 260))
    luz("contra", 1_100_000, 500, (120, 620, 480))
    # ⚠ A CÚPULA EXISTE POR CAUSA DAS FACES DE TOPO. Sem ela, a boca do furo e
    # o topo plano das peças ficavam pretos e chapados, com aresta dura: parecia
    # adesivo colado, não metal. Luz larga e fraca bem em cima resolve.
    luz("cupula", 900_000, 1600, (40, -60, 900))


def apontar(obj, de, para):
    """Gira `obj` para olhar de `de` até `para`.

    ⚠ A CONTA DO GIRO EM Z É `atan2(-dx, dy)`, NÃO `atan2(dy, dx) + pi/2`.
    As duas diferem de exatamente meia-volta, e com a errada a câmera e as três
    luzes apontavam para o lado oposto da peça: o render saía vazio, com a
    geometria inteira atrás da câmera. Custou três tentativas descobrir."""
    dx, dy, dz = (para[0] - de[0], para[1] - de[1], para[2] - de[2])
    obj.location = de
    obj.rotation_euler = (math.atan2(math.hypot(dx, dy), -dz), 0, math.atan2(-dx, dy))
    return obj


def enquadrar(objetos):
    """Uma câmera fixa — mesmo ângulo em todas as peças. Só a DISTÂNCIA muda,
    para cada peça ocupar a mesma fração do quadro."""
    xs, ys, zs = [], [], []
    for o in objetos:
        for v in o.bound_box:
            p = o.matrix_world @ Vector(v)
            xs.append(p.x); ys.append(p.y); zs.append(p.z)
    centro = ((min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2, (min(zs) + max(zs)) / 2)
    raio = max(
        math.dist((min(xs), min(ys), min(zs)), (max(xs), max(ys), max(zs))) / 2, 1.0
    )

    cam_dados = bpy.data.cameras.new("camera")
    cam_dados.lens = 85.0            # teleobjetiva curta: achata menos a peça
    cam_dados.sensor_width = 36.0
    cam = bpy.data.objects.new("camera", cam_dados)
    bpy.context.collection.objects.link(cam)
    bpy.context.scene.camera = cam

    meio_campo = math.atan(cam_dados.sensor_width / 2 / cam_dados.lens)
    distancia = raio / math.sin(meio_campo) / OCUPACAO

    # O ÂNGULO: 35° de elevação e 35° de azimute. Fixo, para todas.
    elev, azim = math.radians(35), math.radians(35)
    cam.location = (
        centro[0] + distancia * math.cos(elev) * math.cos(azim),
        centro[1] - distancia * math.cos(elev) * math.sin(azim),
        centro[2] + distancia * math.sin(elev),
    )
    dx, dy, dz = (centro[0] - cam.location[0], centro[1] - cam.location[1],
                  centro[2] - cam.location[2])
    cam.rotation_euler = (
        math.atan2(math.hypot(dx, dy), -dz),
        0,
        math.atan2(-dx, dy),
    )
    return cam


def configurar_render():
    c = bpy.context.scene
    c.render.engine = "CYCLES"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    try:
        prefs.compute_device_type = "OPTIX"
        prefs.get_devices()
        for d in prefs.devices:
            d.use = d.type in ("OPTIX", "CPU")
        c.cycles.device = "GPU"
    except Exception as e:
        print("  (sem GPU, caindo para CPU:", e, ")")
    c.cycles.samples = AMOSTRAS
    c.cycles.use_denoising = True
    c.render.resolution_x = LADO
    c.render.resolution_y = LADO
    c.render.film_transparent = True
    c.render.image_settings.file_format = "PNG"
    c.render.image_settings.color_mode = "RGBA"
    # ⚠ AgX, o padrão, acinzenta o branco e o fundo sairia cinza.
    c.view_settings.view_transform = "Standard"
    c.view_settings.look = "None"


# ── de que código sai qual peça ─────────────────────────────────────────────
# A chave é o prefixo do código do catálogo. Medida e furo saem do próprio
# registro do produto, para a variante de medida não precisar de função nova.

def construir(prod):
    cod = prod["codigo"]
    medida = prod["medida"]

    def mm(texto, padrao):
        achado = [t for t in texto.replace(",", ".").split() if t.replace(".", "").isdigit()]
        return float(achado[0]) if achado else padrao

    if cod.startswith("CA-BC-"):
        rosca_mm = 6.0 if "M6" in cod else 8.0
        return p_bico(rosca_mm, mm(medida, 1.0))

    if cod.startswith("CA-BO-"):
        forma = "cilindrico" if "-CL-" in cod else "conico"
        partes = p_bocal(forma, mm(medida, 16.0))
        pintar(partes[0], "ceramica" if "-CE-" in cod else "cobre_cromado")
        return partes

    if cod.startswith("CA-DG-"):
        return p_difusor(6.0 if "M6" in cod else 8.0, isolado="-IS-" in cod)

    if cod.startswith("CA-PB-"):
        return p_porta_bico(6.0 if "M6" in cod else 8.0, reforcado=cod.endswith("-CU"))

    if cod.startswith("CA-LT-FR-"):
        return p_fresa(mm(medida, 16.0))

    if cod.startswith("CA-LT-AR-"):
        return p_antirrespingo(5 if "5 L" in medida else 1)

    if cod.startswith("CA-TO-PC-"):
        return p_pescoco(45 if "45" in medida else 22)

    if cod.startswith("CA-TO-CJ-"):
        return p_conjunto_tocha()

    if cod == "CA-PR-CF-01":
        return p_conduite()
    if cod == "CA-PR-RO-12":
        return p_roldana(mm(medida, 1.2))
    if cod == "CA-PR-IS-01":
        return p_isolador()
    if cod == "CA-PR-OR-01":
        return p_aneis()

    raise SystemExit(f"codigo sem peca modelada: {cod}")


def main():
    args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    saida = Path(args[args.index("--saida") + 1]) if "--saida" in args else RAIZ / "_provas" / "render"
    # ⚠ ABSOLUTO, SEMPRE. Caminho relativo entregue ao Blender é resolvido pela
    # pasta de trabalho DELE, e as imagens foram parar na raiz do disco.
    if not saida.is_absolute():
        saida = (RAIZ / saida).resolve()
    so = args[args.index("--so") + 1] if "--so" in args else None
    saida.mkdir(parents=True, exist_ok=True)

    produtos = json.loads(CATALOGO.read_text(encoding="utf-8"))
    if so:
        produtos = [p for p in produtos if p["codigo"] in so.split(",")]

    for i, prod in enumerate(produtos, 1):
        limpar()
        configurar_render()
        montar_estudio()
        partes = construir(prod)
        enquadrar(partes)
        destino = saida / f"{prod['codigo']}.png"
        bpy.context.scene.render.filepath = str(destino)
        print(f"[{i}/{len(produtos)}] {prod['codigo']}  {prod['nome']} {prod['medida']}")
        bpy.ops.render.render(write_still=True)

    print("FIM", len(produtos), "pecas")


main()
