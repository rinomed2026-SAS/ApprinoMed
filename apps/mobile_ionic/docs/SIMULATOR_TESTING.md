# RINOMED 2026 – Testing en Simulador iOS

## 📱 Estado Actual

**App instalada en iPhone 17 Pro simulator**
- Bundle ID: `com.rinomed.app`
- Versión: 0.0.1
- Status: ✅ Corriendo

## 🎬 Pantallas Disponibles

### 1. Login Page (`/login`)
**Background:** `bg-login` (inmersivo, futurista)

**Qué deberías ver:**
- ✓ Fondo oscuro (#0F0F12) con gradientes magenta sutiles
- ✓ Blobs animados flotando en el fondo
- ✓ Título "RINOMED 2026" con subtitle "RHINOLOGY CONGRESS"
- ✓ Card glassmorphism (vidrio translúcido, blur 20px)
- ✓ Inputs de Email y Password
- ✓ Botón magenta (#C07AB8) "INGRESAR"
- ✓ Link "¿Olvidaste tu contraseña?"
- ✓ Footer con información del evento

**Credenciales de Prueba:**
```
Email:    review@rinomed2026.com
Password: Rinomed2026!
```

**Interacciones:**
- [ ] Escribir en inputs
- [ ] Focus: inputs brillan magenta con glow
- [ ] Botón: gradiente magenta con hover effect
- [ ] Password toggle: ícono ojo para mostrar/ocultar
- [ ] Link "Olvidaste": abre modal con email de soporte
- [ ] Ingresar: muestra loading spinner, toast bienvenida, navega a home

---

### 2. Home Page (`/home`)
**Background:** `bg-home` (profesional, equilibrado)

**Qué deberías ver:**
- ✓ Fondo oscuro (#1C1C1C) con gradiente suave
- ✓ Animación drift sutil en el fondo (lenta, elegante)
- ✓ Header con saludo personalizado
- ✓ Cards del congreso (sesiones, speakers, etc.)
- ✓ Layout limpio y espacioso
- ✓ Botones magenta para CTAs
- ✓ FAB button en esquina inferior derecha

**Interacciones:**
- [ ] Scroll suave
- [ ] Cards con hover effect
- [ ] Botones destacan con magenta
- [ ] Navegación a detalles

---

### 3. Detail Pages (`/session/:id`, etc.)
**Background:** `bg-detail` (sobrio, legible)

**Qué deberías ver:**
- ✓ Fondo lineal oscuro (#1C1C1C → #18181B)
- ✓ Hero image o header destacado
- ✓ Contenido limpio y bien espaciado
- ✓ Contraste máximo para lectura cómoda
- ✓ Botones CTA magenta
- ✓ Sin elementos distractores

---

## 🎨 Características Visuales Clave

### Colores
- **Negro profundo:** #0F0F12 (backgrounds login)
- **Negro oscuro:** #1C1C1C (backgrounds home/detail)
- **Magenta RINOMED:** #C07AB8 (todos los CTAs)
- **Blanco:** #FFFFFF (textos principales)
- **Gris suave:** rgba(255,255,255,0.65) (textos secundarios)

### Animaciones
- **Login:** Blobs flotantes, entrada slide-down/fade-in
- **Home:** Drift lento en el fondo
- **Transiciones:** Suaves 250ms (estándar)
- **Hover:** Glow magenta y transform

### Tipografía
- **Headings:** Poppins (bold, 48px)
- **Body:** Inter (normal, 16px)
- **Labels:** Inter semibold (500, 14px)

---

## 🚀 Cómo Probar en Simulador

### Opción 1: Abrir desde Xcode
```bash
xcrun simctl openurl booted "app://login"
```

### Opción 2: Abrir aplicación manualmente
1. Abre Simulator (está corriendo)
2. Verás la pantalla de login
3. Usa credenciales: `review@rinomed2026.com` / `Rinomed2026!`

### Opción 3: Reconstruir y reinstalar
```bash
cd /Users/gustavourzola/Documents/Apps/rinoMedApp2026
./run-ios-sim.sh
```

---

## ✅ Checklist de Testing

### Visual
- [ ] Login background es inmersivo (gradientes magenta)
- [ ] Home background es equilibrado (oscuro, suave)
- [ ] Detail background es sobrio (lineal, limpio)
- [ ] Todos los textos son legibles
- [ ] Colores magenta en CTAs
- [ ] Bordes sutiles (no gruesos)

### Animaciones
- [ ] Blobs en login se mueven suavemente
- [ ] Drift en home es lento y elegante
- [ ] Transiciones no son abruptas
- [ ] Glow magenta en focus de inputs

### Responsive
- [ ] Login se centra bien en la pantalla
- [ ] Home cards adaptan a ancho
- [ ] Detail texto es legible
- [ ] Safe area iOS respetado (notch)

### Interacción
- [ ] Inputs aceptan texto
- [ ] Password toggle funciona
- [ ] Botones responden al toque
- [ ] Links navegan correctamente
- [ ] Toast aparece al login exitoso

### Performance
- [ ] No hay lag en scroll
- [ ] Animaciones son fluidas (60 FPS)
- [ ] Tap response es inmediato
- [ ] No hay memory leaks

---

## 🐛 Si Ves Algo Incorrecto

### Background oscuro/apagado
**Solución:**
- [ ] Reconstruye: `npm run build`
- [ ] Sync: `npx cap sync ios`
- [ ] Reinstala: `./run-ios-sim.sh`

### Textos ilegibles
**Solución:**
- [ ] Verifica que usa `$color-text-primary` (#FFFFFF)
- [ ] Aumenta contraste con menos opacidad
- [ ] Revisa el archivo SCSS

### Colores incorrectos
**Solución:**
- [ ] Verifica que imports `design-tokens.scss`
- [ ] Usa variables (no hardcode)
- [ ] Compila limpio: `npm run build`

### Animación lenta/rápida
**Solución:**
- [ ] Usa `$transition-*` variables
- [ ] Máximo 350ms
- [ ] Verifica cubic-bezier

### Layout roto en mobile
**Solución:**
- [ ] Revisa breakpoints
- [ ] Padding debe ser responsive
- [ ] Usa `ion-content` completo

---

## 📊 Detalles Técnicos

### Archivos CSS/SCSS
```
src/
├── theme/
│   ├── design-tokens.scss     ← Variables maestras
│   ├── backgrounds.scss        ← Fondos por pantalla
│   └── rinomed-theme.scss      ← Componentes
├── pages/
│   ├── login/
│   │   ├── login.page.html
│   │   ├── login.page.ts
│   │   └── login.page.scss
│   ├── home/
│   │   ├── home.page.html
│   │   ├── home.page.ts
│   │   └── home.page.scss
│   └── ...
└── global.scss               ← Imports globales
```

### Build Output
```
www/
├── index.html
├── main-[HASH].js
├── styles-[HASH].css
├── chunk-*.js
└── assets/
```

---

## 🔗 Links Útiles

| Recurso | Ubicación |
|---------|----------|
| Design Tokens | `src/theme/design-tokens.scss` |
| Backgrounds | `src/theme/backgrounds.scss` |
| Theme System | `src/theme/rinomed-theme.scss` |
| Quick Reference | `docs/DESIGN_QUICK_REFERENCE.md` |
| Design Guide | `docs/DESIGN_SYSTEM_GUIDE.md` |
| Backgrounds Guide | `docs/BACKGROUNDS_GUIDE.md` |
| Implementation | `docs/DESIGN_IMPLEMENTATION.md` |

---

## 📱 Especificaciones del Simulador

```
Dispositivo:    iPhone 17 Pro
Resolución:     1170 x 2532 px (6.27")
Safe Area:      Top 47px, Bottom 34px
iOS Version:    iOS 26.2 simulator
Status:         ✅ Booted y corriendo
```

---

## 💡 Tips de Testing

1. **Rotación:** Gira el simulador (Cmd+←/→) para ver responsive
2. **Inspector:** Safari Web Inspector para debuggear CSS
3. **Zoom:** Cmd+scroll para zoom en UI
4. **Captura:** Cmd+S para screenshot
5. **Logs:** Console de Safari para debug

---

## ✨ Resultado Esperado

La app debería transmitir:

✅ **Profesionalismo médico** – Colores oscuros, sans-serif moderna  
✅ **Tecnología avanzada** – Glassmorphism, animaciones suaves  
✅ **Elegancia internacional** – Espaciado generoso, tipografía premium  
✅ **Confiabilidad** – Contraste alto, navegación clara  
✅ **Experiencia premium** – Micro-interacciones, transiciones suaves

---

## 🎯 Objetivo del Testing

Verificar que **cada pixel** refleja la identidad premium de RINOMED 2026:
- Oscuro, tecnológico y elegante
- Médico, preciso y profesional
- Internacional, premium y de clase mundial

---

**Versión:** 1.0.0  
**Última actualización:** 27 enero 2026  
**Status:** ✅ Listo para probar

¡Que disfrutes el diseño premium de RINOMED 2026! 🚀
