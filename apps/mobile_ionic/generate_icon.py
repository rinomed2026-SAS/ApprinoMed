#!/usr/bin/env python3
"""
RINOMED 2026 App Icon Generator
Genera icono oficial 1024x1024 para iOS y Android
Cumple lineamientos de App Store y Google Play
"""

from PIL import Image, ImageDraw, ImageFilter
import math

# Configuración del diseño
SIZE = 1024
CENTER = SIZE // 2
MARGIN = int(SIZE * 0.15)  # 15% márgenes

# Paleta oficial RINOMED
COLOR_BG_START = (15, 15, 18)      # #0F0F12 (oscuro)
COLOR_BG_END = (28, 28, 28)        # #1C1C1C (violeta muy oscuro)
COLOR_MAGENTA = (192, 122, 184)    # #C07AB8
COLOR_GLOW = (208, 145, 199)       # #D091C7 (más claro para glow)

def create_gradient_background(size):
    """Crea fondo con gradiente sutil oscuro"""
    img = Image.new('RGB', (size, size), COLOR_BG_START)
    draw = ImageDraw.Draw(img)
    
    # Gradiente radial suave desde centro
    for y in range(size):
        for x in range(size):
            # Distancia desde centro
            dx = x - size // 2
            dy = y - size // 2
            distance = math.sqrt(dx * dx + dy * dy)
            max_distance = math.sqrt(2) * size / 2
            
            # Factor de interpolación (0 = centro, 1 = borde)
            factor = min(distance / max_distance, 1.0)
            
            # Interpolar colores
            r = int(COLOR_BG_START[0] + (COLOR_BG_END[0] - COLOR_BG_START[0]) * factor)
            g = int(COLOR_BG_START[1] + (COLOR_BG_END[1] - COLOR_BG_START[1]) * factor)
            b = int(COLOR_BG_START[2] + (COLOR_BG_END[2] - COLOR_BG_START[2]) * factor)
            
            img.putpixel((x, y), (r, g, b))
    
    return img

def draw_nose_symbol(draw, center, size):
    """
    Dibuja nariz estilizada minimalista
    Diseño geométrico simple y reconocible
    """
    # Escala del símbolo (65-70% del área disponible)
    scale = (size - 2 * MARGIN) * 0.35
    line_width = int(scale * 0.12)  # Grosor proporcional
    
    # Forma de nariz: perfil lateral estilizado
    # Puente nasal (línea vertical curvada)
    nose_bridge_top = (center[0], center[1] - scale)
    nose_bridge_bottom = (center[0], center[1] + scale * 0.3)
    
    # Punta de nariz (curva hacia adelante)
    nose_tip_control = (center[0] + scale * 0.6, center[1] + scale * 0.2)
    nose_tip_end = (center[0] + scale * 0.4, center[1] + scale * 0.5)
    
    # Fosa nasal (pequeño arco)
    nostril_start = (center[0] + scale * 0.2, center[1] + scale * 0.5)
    nostril_control = (center[0] + scale * 0.3, center[1] + scale * 0.7)
    nostril_end = (center[0], center[1] + scale * 0.6)
    
    # Dibujar puente nasal (línea principal)
    draw.line([nose_bridge_top, nose_bridge_bottom], fill=COLOR_MAGENTA, width=line_width)
    
    # Dibujar punta de nariz (curva Bézier aproximada con líneas)
    points_tip = []
    for t in range(0, 11):
        t = t / 10.0
        # Curva cuadrática Bézier
        x = (1-t)**2 * nose_bridge_bottom[0] + 2*(1-t)*t * nose_tip_control[0] + t**2 * nose_tip_end[0]
        y = (1-t)**2 * nose_bridge_bottom[1] + 2*(1-t)*t * nose_tip_control[1] + t**2 * nose_tip_end[1]
        points_tip.append((x, y))
    
    for i in range(len(points_tip) - 1):
        draw.line([points_tip[i], points_tip[i+1]], fill=COLOR_MAGENTA, width=line_width)
    
    # Dibujar fosa nasal (curva sutil)
    points_nostril = []
    for t in range(0, 11):
        t = t / 10.0
        x = (1-t)**2 * nostril_start[0] + 2*(1-t)*t * nostril_control[0] + t**2 * nostril_end[0]
        y = (1-t)**2 * nostril_start[1] + 2*(1-t)*t * nostril_control[1] + t**2 * nostril_end[1]
        points_nostril.append((x, y))
    
    for i in range(len(points_nostril) - 1):
        draw.line([points_nostril[i], points_nostril[i+1]], fill=COLOR_MAGENTA, width=line_width)
    
    # Agregar línea base sutil (puente superior)
    top_bridge_start = (center[0] - scale * 0.15, center[1] - scale * 0.9)
    top_bridge_end = (center[0] + scale * 0.15, center[1] - scale * 0.85)
    draw.line([top_bridge_start, top_bridge_end], fill=COLOR_MAGENTA, width=int(line_width * 0.8))

def apply_glow_effect(img):
    """Aplica glow magenta suave y tecnológico"""
    # Crear capa de glow
    glow = Image.new('RGBA', img.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    
    # Copiar el símbolo con color más brillante para el glow
    base_img = img.copy()
    pixels = base_img.load()
    glow_pixels = glow.load()
    
    for y in range(img.size[1]):
        for x in range(img.size[0]):
            pixel = pixels[x, y]
            # Si el pixel es magenta (parte del símbolo)
            if pixel == COLOR_MAGENTA:
                # Hacer glow más brillante
                glow_pixels[x, y] = (*COLOR_GLOW, 200)
    
    # Aplicar blur al glow (suave)
    glow = glow.filter(ImageFilter.GaussianBlur(radius=8))
    glow = glow.filter(ImageFilter.GaussianBlur(radius=4))
    
    # Combinar base + glow
    result = img.convert('RGBA')
    result = Image.alpha_composite(result, glow)
    
    return result.convert('RGB')

def generate_icon():
    """Genera el icono completo"""
    print("🎨 Generando icono RINOMED 2026...")
    
    # 1. Crear fondo con gradiente
    print("  → Creando fondo oscuro con gradiente...")
    img = create_gradient_background(SIZE)
    
    # 2. Dibujar símbolo de nariz
    print("  → Dibujando símbolo de nariz estilizada...")
    draw = ImageDraw.Draw(img)
    draw_nose_symbol(draw, (CENTER, CENTER), SIZE)
    
    # 3. Aplicar efecto glow
    print("  → Aplicando glow tecnológico magenta...")
    img = apply_glow_effect(img)
    
    # 4. Guardar
    output_path = 'resources/icon.png'
    img.save(output_path, 'PNG', quality=100)
    print(f"✅ Icono generado: {output_path}")
    print(f"   Tamaño: {SIZE}x{SIZE}px")
    print(f"   Formato: PNG sin transparencia")
    print(f"   Listo para: npx @capacitor/assets generate")

if __name__ == '__main__':
    generate_icon()
