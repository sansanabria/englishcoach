"""Generate a Spanish PDF user guide for EnglishCoach."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# ── Colors ────────────────────────────────────────────────
GREEN   = HexColor('#276047')
GREEN_L = HexColor('#e8f5ee')
BLUE    = HexColor('#1B3D7A')
BLUE_L  = HexColor('#e8eef8')
GRAY    = HexColor('#6b7280')
GRAY_L  = HexColor('#f3f4f6')
BORDER  = HexColor('#d1d5db')
ACCENT  = HexColor('#16a34a')
RED     = HexColor('#dc2626')

# ── Styles ────────────────────────────────────────────────
sTitle = ParagraphStyle('Title', fontName='Helvetica-Bold', fontSize=28,
                        leading=34, textColor=GREEN, alignment=TA_CENTER,
                        spaceAfter=6)
sSubtitle = ParagraphStyle('Sub', fontName='Helvetica', fontSize=13,
                           leading=18, textColor=GRAY, alignment=TA_CENTER,
                           spaceAfter=30)
sH1 = ParagraphStyle('H1', fontName='Helvetica-Bold', fontSize=18,
                      leading=24, textColor=GREEN, spaceBefore=20, spaceAfter=10)
sH2 = ParagraphStyle('H2', fontName='Helvetica-Bold', fontSize=14,
                      leading=18, textColor=BLUE, spaceBefore=14, spaceAfter=6)
sBody = ParagraphStyle('Body', fontName='Helvetica', fontSize=10.5,
                        leading=15, textColor=black, spaceAfter=6)
sBold = ParagraphStyle('Bold', fontName='Helvetica-Bold', fontSize=10.5,
                        leading=15, textColor=black, spaceAfter=6)
sBullet = ParagraphStyle('Bullet', fontName='Helvetica', fontSize=10.5,
                          leading=15, textColor=black, leftIndent=18,
                          bulletIndent=6, spaceAfter=4, bulletFontName='Helvetica')
sTip = ParagraphStyle('Tip', fontName='Helvetica-Oblique', fontSize=10,
                       leading=14, textColor=GREEN, leftIndent=12, spaceAfter=8)
sSmall = ParagraphStyle('Small', fontName='Helvetica', fontSize=9,
                         leading=12, textColor=GRAY, alignment=TA_CENTER)

def hr():
    return HRFlowable(width='100%', thickness=0.5, color=BORDER,
                      spaceBefore=8, spaceAfter=8)

def tip(text):
    return Paragraph(f'<b>Consejo:</b> {text}', sTip)

def bullet(text):
    return Paragraph(f'<bullet>&bull;</bullet>{text}', sBullet)

def numbered(num, text):
    return Paragraph(f'<b>{num}.</b> {text}', sBullet)

def section_box(title, items, color=GREEN_L, border=GREEN):
    """A colored box with a title and bullet items."""
    rows = [[Paragraph(f'<b>{title}</b>', ParagraphStyle('bx', fontName='Helvetica-Bold',
             fontSize=11, leading=14, textColor=border))]]
    for item in items:
        rows.append([Paragraph(f'&bull; {item}', ParagraphStyle('bi', fontName='Helvetica',
                     fontSize=10, leading=13, textColor=black, leftIndent=10))])
    t = Table(rows, colWidths=[16*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), color),
        ('BOX', (0,0), (-1,-1), 0.5, border),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    return t


# ── Build document ────────────────────────────────────────
out_path = os.path.join(os.path.dirname(__file__), 'Guia_EnglishCoach.pdf')

doc = SimpleDocTemplate(
    out_path, pagesize=A4,
    leftMargin=2*cm, rightMargin=2*cm,
    topMargin=2*cm, bottomMargin=2*cm,
)

story = []

# ── COVER ─────────────────────────────────────────────────
story.append(Spacer(1, 3*cm))
story.append(Paragraph('EnglishCoach', sTitle))
story.append(Paragraph('Guia del estudiante', ParagraphStyle('st2',
             fontName='Helvetica', fontSize=18, leading=24,
             textColor=BLUE, alignment=TA_CENTER, spaceAfter=8)))
story.append(Spacer(1, 6))
story.append(HRFlowable(width='40%', thickness=2, color=GREEN,
                         spaceBefore=4, spaceAfter=12))
story.append(Paragraph('Aprende ingles desde cero — Nivel A1',
             sSubtitle))
story.append(Spacer(1, 1.5*cm))
story.append(section_box('En esta guia aprenderas a:', [
    'Navegar por todas las secciones de la app',
    'Practicar frases traduciendolas de espanol a ingles',
    'Estudiar y conjugar verbos en todos los tiempos',
    'Aprender vocabulario nuevo con tarjetas interactivas',
    'Consultar las reglas de gramatica con ejemplos claros',
    'Seguir un plan de estudio semanal organizado',
    'Practicar el uso correcto de los articulos a / an',
]))
story.append(Spacer(1, 2*cm))
story.append(Paragraph('Abre el archivo <b>index.html</b> en tu navegador (Chrome, Firefox o Edge) para comenzar.',
             ParagraphStyle('ctr', fontName='Helvetica', fontSize=11, leading=15,
                            textColor=GRAY, alignment=TA_CENTER)))
story.append(PageBreak())

# ── 1. INICIO ────────────────────────────────────────────
story.append(Paragraph('1. Pantalla de Inicio', sH1))
story.append(hr())
story.append(Paragraph(
    'Al abrir la app veras la pantalla de <b>Inicio</b>. Desde aqui puedes acceder '
    'rapidamente a todas las secciones. En la parte superior veras tu <b>racha diaria</b> '
    '(los dias seguidos que has practicado) y estadisticas generales.',
    sBody))
story.append(Spacer(1, 6))
story.append(Paragraph('<b>Secciones disponibles desde Inicio:</b>', sBold))
story.append(bullet('<b>Practicar frases</b> — Traduce frases del espanol al ingles'))
story.append(bullet('<b>Verbos</b> — Estudia conjugaciones y practica todos los tiempos'))
story.append(bullet('<b>Vocabulario</b> — Aprende palabras nuevas por tema'))
story.append(bullet('<b>Gramatica</b> — Consulta las reglas de gramatica con ejemplos'))
story.append(bullet('<b>Plan de estudio</b> — Sigue un plan semanal organizado'))
story.append(bullet('<b>Todas las frases</b> — Ve la lista completa de frases de practica'))
story.append(Spacer(1, 6))
story.append(tip('Usa los botones de la barra de navegacion en la parte superior para moverte entre secciones.'))
story.append(Spacer(1, 6))

# Reiniciar
story.append(Paragraph('<b>Boton Reiniciar</b>', sBold))
story.append(Paragraph(
    'En la esquina superior derecha hay un boton de <b>Reiniciar</b>. '
    'Al pulsarlo, se borrara todo tu progreso (puntuaciones, racha, '
    'posicion de ejercicios) y la app empezara desde cero.',
    sBody))
story.append(tip('Usa este boton solo si quieres empezar de nuevo desde el principio.'))
story.append(Spacer(1, 10))

# ── 2. PRACTICAR FRASES ──────────────────────────────────
story.append(Paragraph('2. Practicar frases', sH1))
story.append(hr())
story.append(Paragraph(
    'Esta es la seccion principal de practica. Veras una frase en <b>espanol</b> '
    'y tendras que escribir la traduccion correcta en <b>ingles</b>.',
    sBody))
story.append(Spacer(1, 4))
story.append(Paragraph('<b>Como funciona:</b>', sBold))
story.append(numbered(1, 'Lee la frase en espanol que aparece en pantalla'))
story.append(numbered(2, 'Escribe la traduccion en ingles en el campo de texto'))
story.append(numbered(3, 'Pulsa el boton <b>Comprobar</b> para ver si es correcta'))
story.append(numbered(4, 'Si la respuesta es correcta, veras un mensaje verde'))
story.append(numbered(5, 'Si es incorrecta, veras la respuesta correcta para aprender'))
story.append(numbered(6, 'Pulsa <b>Siguiente</b> para pasar a la siguiente frase'))
story.append(Spacer(1, 6))

story.append(Paragraph('<b>Modos de practica:</b>', sBold))
story.append(bullet('<b>Todas las frases</b> — Practica con todas las frases disponibles'))
story.append(bullet('<b>Solo errores</b> — Repasa solo las frases que has fallado antes'))
story.append(bullet('<b>Repaso</b> — Sistema de repaso espaciado que te muestra frases en el momento optimo'))
story.append(Spacer(1, 6))

story.append(Paragraph('<b>Filtros de gramatica:</b>', sBold))
story.append(Paragraph(
    'Puedes filtrar las frases por tipo de gramatica: <b>Negacion</b>, '
    '<b>Preguntas</b>, <b>Tiempos</b> o <b>There is/are</b>.',
    sBody))
story.append(Spacer(1, 6))
story.append(tip('Si necesitas ayuda, busca el boton de pista que te muestra la estructura gramatical de la frase.'))
story.append(Spacer(1, 6))

# Botones especiales
story.append(Paragraph('<b>Botones utiles:</b>', sBold))
story.append(bullet('<b>Saltar</b> — Salta la frase actual si es muy dificil'))
story.append(bullet('<b>Reiniciar</b> — Empieza el ejercicio desde el principio'))
story.append(bullet('<b>Estrella</b> — Marca una frase para revisarla despues'))

story.append(PageBreak())

# ── 3. VERBOS ─────────────────────────────────────────────
story.append(Paragraph('3. Verbos', sH1))
story.append(hr())
story.append(Paragraph(
    'En esta seccion puedes estudiar y practicar los verbos en ingles. '
    'Hay verbos <b>regulares</b> (como work, study, live) e <b>irregulares</b> '
    '(como go, eat, see).',
    sBody))
story.append(Spacer(1, 4))

story.append(Paragraph('<b>Paso 1: Selecciona un verbo</b>', sBold))
story.append(Paragraph(
    'Veras una lista de verbos organizados por tipo. Puedes filtrarlos '
    'por <b>Todos</b>, <b>Modales</b>, <b>Irregulares</b> o <b>Regulares</b>. '
    'Tambien puedes usar el buscador para encontrar un verbo especifico.',
    sBody))
story.append(Spacer(1, 4))

story.append(Paragraph('<b>Paso 2: Elige que hacer</b>', sBold))
story.append(Paragraph(
    'Una vez seleccionado un verbo, tienes dos opciones:', sBody))
story.append(Spacer(1, 2))

story.append(section_box('Explicacion y conjugacion', [
    'Ve la tabla completa de conjugacion del verbo',
    'Present simple, Simple past, Present perfect, Future, Past perfect',
    'El participio y el tipo de verbo (regular/irregular)',
    'Seccion "Cuando usar cada tiempo" con explicaciones',
], GREEN_L, GREEN))
story.append(Spacer(1, 8))
story.append(section_box('Practicar', [
    'Ejercicio interactivo para practicar todos los tiempos',
    'Escribe la forma correcta del verbo para cada pronombre',
    'Ve tu puntuacion al final de cada tiempo',
    'Avanza por todos los tiempos: presente, pasado, perfecto, futuro...',
], BLUE_L, BLUE))
story.append(Spacer(1, 8))

story.append(tip('En la tabla de conjugacion, puedes abrir la seccion '
                  '"Cuando usar cada tiempo?" para ver explicaciones detalladas.'))

story.append(PageBreak())

# ── 4. VOCABULARIO ────────────────────────────────────────
story.append(Paragraph('4. Vocabulario', sH1))
story.append(hr())
story.append(Paragraph(
    'Aqui encontraras todo el vocabulario organizado por <b>temas</b>: familia, '
    'comida, ropa, colores, numeros, tiempo, transporte, casa, cuerpo y adjetivos.',
    sBody))
story.append(Spacer(1, 4))

story.append(Paragraph('<b>Como usar el vocabulario:</b>', sBold))
story.append(numbered(1, 'Navega por las tarjetas de vocabulario organizadas por tema'))
story.append(numbered(2, 'Cada tarjeta muestra la palabra en ingles con el articulo <b>the</b> (para sustantivos)'))
story.append(numbered(3, 'Debajo veras la traduccion en espanol'))
story.append(numbered(4, 'Usa el buscador para encontrar una palabra especifica'))
story.append(Spacer(1, 6))

story.append(Paragraph('<b>Modo practicar:</b>', sBold))
story.append(Paragraph(
    'Pulsa el boton <b>Practicar</b> para empezar un ejercicio con tarjetas. '
    'Veras la palabra en ingles y tendras que recordar su significado en espanol. '
    'Pulsa "Mostrar traduccion" para ver la respuesta, y luego marca si la sabias o no.',
    sBody))
story.append(Spacer(1, 6))

story.append(Paragraph('<b>Autotest:</b>', sBold))
story.append(Paragraph(
    'Activa la casilla <b>"Ocultar traducciones"</b> para esconder las '
    'traducciones y ponerte a prueba mientras miras las tarjetas.',
    sBody))
story.append(Spacer(1, 6))
story.append(tip('Las palabras con articulo "the" te ayudan a recordar que son sustantivos. '
                  'Los adjetivos y adverbios no llevan articulo.'))

story.append(Spacer(1, 14))

# ── 5. GRAMÁTICA ──────────────────────────────────────────
story.append(Paragraph('5. Gramatica', sH1))
story.append(hr())
story.append(Paragraph(
    'La seccion de gramatica contiene todas las reglas que necesitas para el nivel A1, '
    'explicadas en espanol con ejemplos en ingles.',
    sBody))
story.append(Spacer(1, 4))

story.append(Paragraph('<b>Contenido de gramatica:</b>', sBold))
story.append(bullet('<b>Estructura de la oracion</b> — Orden de sujeto, verbo y objeto'))
story.append(bullet('<b>Articulos a / an</b> — Cuando usar "a" y cuando "an" segun el sonido'))
story.append(bullet('<b>Conjugacion</b> — Reglas del presente simple, pasado y presente perfecto'))
story.append(bullet('<b>Tiempos verbales</b> — Cuando usar cada tiempo, con ejemplos y palabras clave'))
story.append(Spacer(1, 6))

story.append(Paragraph('<b>Ejercicio A / An:</b>', sBold))
story.append(Paragraph(
    'Dentro de la gramatica encontraras un ejercicio interactivo para practicar '
    'los articulos <b>a</b> y <b>an</b>. Veras una palabra y tendras que elegir '
    'el articulo correcto. Despues de responder, veras una explicacion de por que '
    'se usa ese articulo.',
    sBody))
story.append(Spacer(1, 6))
story.append(tip('Recuerda: "a" se usa antes de sonidos de consonante, "an" antes de sonidos '
                  'de vocal. Lo importante es el SONIDO, no la letra.'))

story.append(PageBreak())

# ── 6. PLAN DE ESTUDIO ───────────────────────────────────
story.append(Paragraph('6. Plan de estudio', sH1))
story.append(hr())
story.append(Paragraph(
    'El plan de estudio te guia semana a semana para aprender ingles de forma '
    'organizada. Esta dividido en <b>5 unidades</b> que cubren los niveles A1 y A2.',
    sBody))
story.append(Spacer(1, 6))

# Units table
units_data = [
    ['Unidad', 'Tema', 'Semanas'],
    ['1', 'Saludos e introducciones', 'Semana 1-2'],
    ['2', 'Familia y vida diaria', 'Semana 3-4'],
    ['3', 'Preguntas y negaciones', 'Semana 5-6'],
    ['4', 'Casa y ciudad', 'Semana 7-8'],
    ['5', 'Acciones en progreso', 'Semana 9-10'],
]
t = Table(units_data, colWidths=[2*cm, 8*cm, 4*cm])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), GREEN),
    ('TEXTCOLOR', (0,0), (-1,0), white),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 10),
    ('ALIGN', (0,0), (0,-1), 'CENTER'),
    ('ALIGN', (2,0), (2,-1), 'CENTER'),
    ('BACKGROUND', (0,1), (-1,-1), GRAY_L),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [white, GRAY_L]),
    ('GRID', (0,0), (-1,-1), 0.5, BORDER),
    ('TOPPADDING', (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(t)
story.append(Spacer(1, 10))

story.append(Paragraph('<b>Cada unidad incluye:</b>', sBold))
story.append(bullet('Temas de gramatica especificos para estudiar'))
story.append(bullet('Verbos clave para practicar'))
story.append(bullet('Vocabulario por tema'))
story.append(bullet('Actividades de practica (frases, verbos, vocabulario, articulos)'))
story.append(bullet('Objetivos claros para saber cuando has completado la unidad'))
story.append(Spacer(1, 6))
story.append(tip('Sigue el plan en orden. Cada unidad se construye sobre la anterior. '
                  'Intenta completar las actividades de cada semana antes de avanzar.'))

story.append(Spacer(1, 14))

# ── 7. TODAS LAS FRASES ──────────────────────────────────
story.append(Paragraph('7. Todas las frases', sH1))
story.append(hr())
story.append(Paragraph(
    'Esta seccion te muestra la <b>lista completa</b> de todas las frases de practica. '
    'Puedes filtrarlas por nivel (A1, A2) o ver solo las que has marcado con estrella.',
    sBody))
story.append(Spacer(1, 4))
story.append(Paragraph(
    'Cada frase muestra el texto en ingles, la traduccion en espanol, el nivel '
    'y el tipo de estructura gramatical que utiliza.',
    sBody))
story.append(tip('Usa esta seccion como referencia rapida para buscar una frase '
                  'especifica o repasar todas las estructuras que has aprendido.'))

story.append(PageBreak())

# ── 8. CONSEJOS ───────────────────────────────────────────
story.append(Paragraph('8. Consejos para aprender mejor', sH1))
story.append(hr())
story.append(Spacer(1, 6))

tips_data = [
    ('Practica todos los dias',
     'Aunque sean solo 10-15 minutos, la constancia es mas importante que la cantidad. '
     'Tu racha diaria te ayudara a mantener el habito.'),
    ('Sigue el plan de estudio',
     'El plan esta disenado para que aprendas paso a paso. '
     'Cada unidad introduce conceptos nuevos que se apoyan en los anteriores.'),
    ('No tengas miedo de equivocarte',
     'Los errores son parte del aprendizaje. Usa el modo "Solo errores" '
     'para repasar las frases que te cuestan mas.'),
    ('Aprende los verbos irregulares',
     'Los verbos irregulares son muy comunes en ingles. Dedica tiempo extra '
     'a memorizar sus formas en pasado y participio.'),
    ('Repasa el vocabulario regularmente',
     'Usa el modo de practica del vocabulario y activa "Ocultar traducciones" '
     'para ponerte a prueba.'),
    ('Lee las explicaciones de gramatica',
     'Antes de practicar un tema nuevo, lee la seccion de gramatica '
     'correspondiente para entender las reglas.'),
    ('Presta atencion a los articulos',
     'En ingles, "a" y "an" dependen del SONIDO, no de la letra. '
     'Practica con el ejercicio de a/an hasta que sea automatico.'),
    ('Repite en voz alta',
     'Cuando practiques frases, di la respuesta en voz alta antes de escribirla. '
     'Esto te ayudara a recordar mejor.'),
]

for i, (title, desc) in enumerate(tips_data, 1):
    story.append(KeepTogether([
        Paragraph(f'<b>{i}. {title}</b>', ParagraphStyle('tipT',
                  fontName='Helvetica-Bold', fontSize=11, leading=14,
                  textColor=GREEN, spaceBefore=4, spaceAfter=2)),
        Paragraph(desc, ParagraphStyle('tipD',
                  fontName='Helvetica', fontSize=10, leading=14,
                  textColor=black, leftIndent=14, spaceAfter=8)),
    ]))

story.append(Spacer(1, 1*cm))
story.append(HRFlowable(width='40%', thickness=2, color=GREEN,
                         spaceBefore=12, spaceAfter=12))
story.append(Paragraph('!Mucho exito con tu ingles!', ParagraphStyle('end',
             fontName='Helvetica-Bold', fontSize=14, leading=18,
             textColor=GREEN, alignment=TA_CENTER, spaceAfter=4)))
story.append(Paragraph('EnglishCoach — Aprende ingles desde cero',
             sSmall))

# ── Generate ──────────────────────────────────────────────
doc.build(story)
print(f'PDF created: {out_path}')
