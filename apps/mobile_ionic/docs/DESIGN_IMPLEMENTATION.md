# RINOMED 2026 – UI/UX Design System Implementation
> Directivas de implementación para mantener la coherencia visual premium

## 🎯 Misión

Garantizar que RINOMED 2026 transmita:
- ✓ Profesionalismo médico internacional
- ✓ Tecnología avanzada y elegante
- ✓ Confianza y precisión científica
- ✓ Experiencia de clase mundial

---

## 📋 Sistema de Backgrounds Obligatorio

### Tres backgrounds predefinidos (NUNCA crees nuevos)

```html
<!-- 1. LOGIN SCREEN (Inmersivo, futurista) -->
<ion-content class="bg-login"></ion-content>

<!-- 2. HOME/DASHBOARD (Profesional, equilibrado) -->
<ion-content class="bg-home"></ion-content>

<!-- 3. DETAIL/CONTENT (Sobrio, legible) -->
<ion-content class="bg-detail"></ion-content>
```

### Mapeo de pantallas a backgrounds

| Pantalla | Background | Razón |
|---------|-----------|--------|
| Login, Sign Up, Forgot Password | `bg-login` | Captar atención, confianza |
| Home, Agenda, Speakers, Sponsors | `bg-home` | Dashboard profesional |
| Session Detail, Speaker Bio, Settings | `bg-detail` | Lectura cómoda |

---

## 🎨 Paleta de Colores Obligatoria

### Prohibido: Usar colores fuera de esta paleta

```scss
// Fondos
#0F0F12 - Negro profundo (login backgrounds)
#1C1C1C - Negro oscuro (home/detail)

// Magenta RINOMED (solo para CTAs)
#C07AB8 - Primary action
#D08CC4 - Hover state
#B968AA - Active/pressed

// Textos
#FFFFFF - Texto principal
rgba(255,255,255,0.65) - Texto secundario
rgba(255,255,255,0.45) - Texto débil

// Bordes
rgba(255,255,255,0.08) - Borde sutil
rgba(255,255,255,0.12) - Borde medio
rgba(255,255,255,0.18) - Borde destacado

// Estados
#FF6B6B - Error
#4ECDC4 - Success
#FFB84D - Warning
```

### Regla de oro
- **Magenta #C07AB8** = Único color de marca (CTAs, enfasis)
- **Blanco #FFFFFF** = Texto principal siempre
- **Grises suaves** = Texto secundario para jerarquía

---

## 📝 Guías de Estilo por Pantalla

### 1️⃣ Login Page

```html
<ion-content class="bg-login">
  <!-- Branding header -->
  <div class="login-header">
    <h1>RINOMED 2026</h1>
    <p>RHINOLOGY CONGRESS</p>
  </div>

  <!-- Form card (glassmorphism) -->
  <div class="login-card">
    <form>
      <!-- Inputs -->
    </form>
  </div>

  <!-- Footer -->
  <footer>
    <p>Medellín, 17–18 abril 2026</p>
  </footer>
</ion-content>
```

**Características visuales:**
- ✓ Fondo con gradientes magenta
- ✓ Animación de blobs flotantes
- ✓ Card glassmorphism con blur 20px
- ✓ Inputs con glow magenta en focus
- ✓ Botón CTA magenta con gradiente
- ✓ Transiciones suaves (600ms)
- ✓ Safe area iOS respetado

---

### 2️⃣ Home Page

```html
<ion-content class="bg-home">
  <!-- Header con usuario -->
  <div class="home-header">
    <h1>Hola, {{ user.name }}</h1>
    <p>Bienvenido al congreso</p>
  </div>

  <!-- Cards grid -->
  <div class="cards-grid">
    <app-card *ngFor="let item of items"></app-card>
  </div>

  <!-- List de contenido -->
  <div class="content-list">
    <app-list-item *ngFor="let item of list"></app-list-item>
  </div>

  <!-- FAB button -->
  <ion-fab slot="fixed">
    <ion-fab-button></ion-fab-button>
  </ion-fab>
</ion-content>
```

**Características visuales:**
- ✓ Fondo oscuro equilibrado
- ✓ Gradiente suave magenta en top
- ✓ Animación drift lenta (30s)
- ✓ Cards con glassmorphism suave
- ✓ Espacio blanco generoso
- ✓ Textos legibles
- ✓ CTAs magenta destacadas

---

### 3️⃣ Detail Page

```html
<ion-content class="bg-detail">
  <!-- Hero image -->
  <div class="detail-hero">
    <img [src]="item.image" alt="Hero">
  </div>

  <!-- Content body -->
  <div class="detail-body">
    <h1>{{ item.title }}</h1>
    <p class="meta">Información adicional</p>
    
    <div class="description">
      {{ item.description }}
    </div>

    <!-- CTAs -->
    <div class="actions">
      <button ion-button class="btn-primary">Acción principal</button>
      <button ion-button class="btn-secondary">Secundaria</button>
    </div>
  </div>
</ion-content>
```

**Características visuales:**
- ✓ Fondo lineal sobrio
- ✓ Efecto radial muy suave
- ✓ Sin elementos distractores
- ✓ Contraste máximo para lectura
- ✓ Bordes sutiles
- ✓ Espaciado generoso

---

## 🔧 Implementación Step-by-Step

### Paso 1: Crear componente
```bash
ng generate component pages/my-page --skip-tests
```

### Paso 2: Aplicar background
```html
<!-- my-page.html -->
<ion-content class="bg-home">
  <!-- Tu contenido -->
</ion-content>
```

### Paso 3: Importar design tokens
```scss
// my-page.scss
@import '../../theme/design-tokens.scss';
```

### Paso 4: Usar variables
```scss
.my-element {
  // Colores
  color: $color-text-primary;
  background: $color-bg-dark;
  
  // Tipografía
  font-family: $font-family-primary;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  
  // Espaciado
  padding: $spacing-xl;
  margin-bottom: $spacing-lg;
  
  // Bordes
  border-radius: $border-radius-md;
  border: 1px solid $color-border-light;
  
  // Transiciones
  transition: all $transition-base;
  
  &:hover {
    box-shadow: $shadow-lg;
  }
}
```

### Paso 5: Compilar y testar
```bash
npm run build
npx cap sync ios
./run-ios-sim.sh
```

---

## ✅ Checklist de Calidad

Antes de hacer commit, verifica:

- [ ] **Backgrounds**
  - [ ] Usa `bg-login`, `bg-home` o `bg-detail`
  - [ ] No hay backgrounds personalizados
  - [ ] El contenido es visible sobre el fondo

- [ ] **Colores**
  - [ ] Todos los colores están en `design-tokens.scss`
  - [ ] No hay colores hardcodeados
  - [ ] Magenta solo en CTAs

- [ ] **Tipografía**
  - [ ] Fuentes de `$font-family-*`
  - [ ] Tamaños de `$font-size-*`
  - [ ] Pesos de `$font-weight-*`
  - [ ] Line-height >= 1.5

- [ ] **Espaciado**
  - [ ] Usa spacing scale
  - [ ] Multiples de `$spacing-md` (12px)
  - [ ] Coherencia vertical y horizontal

- [ ] **Accesibilidad**
  - [ ] Contraste WCAG AA+ (4.5:1)
  - [ ] Textos legibles
  - [ ] Focus states visibles
  - [ ] ARIA labels donde aplique

- [ ] **Responsive**
  - [ ] Mobile-first (<480px)
  - [ ] Tablet (480–768px)
  - [ ] Desktop (>768px)
  - [ ] Safe area iOS

- [ ] **Animaciones**
  - [ ] Transiciones suaves (<400ms)
  - [ ] Usa `$transition-*`
  - [ ] No flashing ni parpadeos
  - [ ] Performance optimizado

- [ ] **Compilación**
  - [ ] `npm run build` sin errores
  - [ ] Build warnings solo deprecation
  - [ ] Bundle size normal

- [ ] **Testing**
  - [ ] Funciona en iOS simulator
  - [ ] Funciona en Android
  - [ ] Funciona en PWA

---

## 🚫 Prohibiciones Explícitas

### ❌ NUNCA hagas esto

```scss
// ❌ NO: Crear backgrounds personalizados
.custom-bg {
  background: linear-gradient(to right, purple, blue);
}

// ❌ NO: Hardcodear colores
.button {
  color: #F000FF;
  background: #123ABC;
}

// ❌ NO: Usar colores fuera de la paleta
.text {
  color: #00FF00; // Verde no permitido
}

// ❌ NO: Animaciones lentas
.element {
  transition: all 3s ease-in-out; // Muy lenta
}

// ❌ NO: Bordes gruesos
.card {
  border: 5px solid white; // Demasiado grueso
}

// ❌ NO: Tipografía personalizada
.heading {
  font-family: 'Comic Sans', cursive; // Prohibido
  font-size: 73px; // Tamaño arbitrario
}
```

### ✅ SÍ: Haz esto en su lugar

```scss
@import '../../theme/design-tokens.scss';

// ✅ Usa backgrounds predefinidos
.my-page {
  // Aplicar en ion-content
}

// ✅ Usa variables de color
.button {
  color: $color-text-primary;
  background: $color-magenta-primary;
}

// ✅ Usa colores permitidos
.text {
  color: $color-text-secondary;
}

// ✅ Usa transiciones predefinidas
.element {
  transition: all $transition-base;
}

// ✅ Usa border-radius de escala
.card {
  border-radius: $border-radius-md;
  border: 1px solid $color-border-light;
}

// ✅ Usa tipografía de escala
.heading {
  font-family: $font-family-display;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
}
```

---

## 📚 Documentación Referencia

| Documento | Propósito |
|-----------|-----------|
| `design-tokens.scss` | Variables maestras (referencia técnica) |
| `backgrounds.scss` | Estilos de backgrounds |
| `BACKGROUNDS_GUIDE.md` | Guía detallada de backgrounds |
| `DESIGN_QUICK_REFERENCE.md` | Consulta rápida para desarrolladores |
| `DESIGN_SYSTEM_GUIDE.md` | Guía completa (componentes, patrones) |

---

## 🆘 Soporte

### ¿Preguntas sobre diseño?
- **Documentación:** Lee `DESIGN_QUICK_REFERENCE.md`
- **Ejemplos:** Ver `home.page.example.scss`
- **Contacto:** design@rinomed2026.com

### ¿Problema con compilación?
- Verifica imports en `global.scss`
- Reconstruye: `npm run build`
- Limpia caché: `rm -rf www/`

### ¿Necesitas nuevo background?
- Comunica con Design Team
- No crees backgrounds personalizados
- Sigue el proceso de aprobación

---

## 🎓 Training para Nuevos Desarrolladores

1. Lee `DESIGN_QUICK_REFERENCE.md` (10 min)
2. Revisa `BACKGROUNDS_GUIDE.md` (15 min)
3. Estudia un componente existente (login.page)
4. Crea tu primera página usando template
5. Pide review de Design Team

---

## 📊 Versión & Historial

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0.0 | 27 ene 2026 | Inicial - Design System base |
| - | - | - |

---

## 👥 Equipo

- **Design:** Design Team (@rinomed.com)
- **Frontend:** Development Team (@rinomed.com)
- **QA:** Quality Team (@rinomed.com)

---

**Última actualización:** 27 enero 2026  
**Status:** ✅ Producción  
**Contacto:** design@rinomed2026.com

---

> *RINOMED 2026 es un evento médico internacional premium.*  
> *Cada pixel cuenta. Mantengamos la excelencia visual.*
