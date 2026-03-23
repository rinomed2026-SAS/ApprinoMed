# 🎨 RINOMED 2026 - DESIGN SYSTEM & DEVELOPMENT GUIDE

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Paleta de Colores](#paleta-de-colores)
3. [Tipografía](#tipografía)
4. [Componentes Base](#componentes-base)
5. [Cómo Usar el Sistema](#cómo-usar-el-sistema)
6. [Ejemplos Prácticos](#ejemplos-prácticos)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Introducción

RINOMED 2026 es un **Design System Premium** para aplicaciones médicas de clase mundial. Está diseñado para transmitir:

- ✅ Profesionalismo médico
- ✅ Tecnología avanzada
- ✅ Elegancia científica
- ✅ Confiabilidad
- ✅ Internacionalidad

**Todos los componentes siguen la paleta de colores exacta y la estética oscura-futurista.**

---

## Paleta de Colores

### Colores Principales

| Nombre | Valor | RGB | Uso |
|--------|-------|-----|-----|
| Fondo Oscuro | `#0f0f12` | 15, 15, 18 | Fondo principal |
| Fondo Alt | `#1c1c1c` | 28, 28, 28 | Fondos secundarios |
| **Magenta (CTA)** | **#c07ab8** | **192, 122, 184** | Botones, links, acentos |
| Magenta Hover | `#d08cc4` | **208, 140, 196** | Estado hover |
| Magenta Active | `#b968aa` | **185, 104, 170** | Estado active/pressed |

### Colores de Texto

| Nombre | Valor | Alpha | Uso |
|--------|-------|-------|-----|
| Texto Principal | `#ffffff` | 100% | Títulos, botones |
| Texto Secundario | `rgba(255,255,255,0.65)` | 65% | Subtítulos, descriptions |
| Texto Terciario | `rgba(255,255,255,0.4)` | 40% | Placeholders, hints |

### Colores Funcionales

| Nombre | Valor | Uso |
|--------|-------|-----|
| Error | `#ff6b6b` | Validación, errores |
| Success | `#51cf66` | Confirmaciones |
| Warning | `#ffd93d` | Alertas |
| Info | `#74c0fc` | Información |

### Bordes y Fondos

| Elemento | Color | Descripción |
|----------|-------|-------------|
| Border | `rgba(255,255,255,0.08)` | Bordes sutiles |
| Border Hover | `rgba(255,255,255,0.15)` | Estados hover |
| Glass Dark | `rgba(255,255,255,0.04)` | Fondo glassmorphism |
| Glass Light | `rgba(255,255,255,0.06)` | Inputs glassmorphism |

---

## Tipografía

### Familias Recomendadas

```scss
// Títulos y headings
$font-primary: 'Inter', 'Poppins', 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;

// Cuerpo y etiquetas
$font-secondary: 'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Escalas de Tipografía

| Nivel | Tamaño | Peso | Tracking | Uso |
|-------|--------|------|----------|-----|
| H1 | 32px | 700 | 3px | Branding, títulos principales |
| H2 | 24px | 600 | 0.5px | Títulos de secciones |
| H3 | 18px | 600 | 0.3px | Subtítulos |
| Body | 15px | 400 | normal | Texto principal |
| Small | 12px | 400 | normal | Etiquetas, hints |
| XSmall | 11px | 400 | normal | Metadata |

### Pesos Recomendados

- **700 (Bold):** Títulos grandes, énfasis
- **600 (Semibold):** Títulos medianos, botones
- **500 (Medium):** Etiquetas, highlights
- **400 (Regular):** Texto regular
- **Evitar:** 300 (demasiado ligero en pantallas móviles)

---

## Componentes Base

### Card (Glassmorphism)

**Uso:** Contenedores principales, secciones destacadas

```scss
@include rinomed-glass;
padding: $rinomed-space-xl;
border-radius: $rinomed-radius-lg;
```

**Propiedades:**
- Fondo: `rgba(255,255,255,0.04)`
- Blur: 20px
- Border: 1px `rgba(255,255,255,0.08)`
- Sombra difusa

---

### Botón Primario

**Uso:** CTAs principales (Entrar, Guardar, Enviar)

```scss
@include rinomed-button-primary;
height: 48px;
width: 100%;
```

**Estados:**
- **Default:** Gradiente magenta
- **Hover:** Glow + elevación (-2px)
- **Active:** Magenta-active
- **Disabled:** Opacidad 60%

---

### Botón Secundario

**Uso:** Acciones alternativas

```scss
@include rinomed-button-secondary;
```

**Propiedades:**
- Fondo: Transparente
- Border: 1px magenta
- Texto: Magenta

---

### Input Base

**Uso:** Campos de formulario

```scss
@include rinomed-input-base;

input {
  @include rinomed-text-body;
  background: transparent;
  border: none;
}
```

**Focus State:**
- Border-color: Magenta
- Glow: 20px magenta
- Background: `rgba(255,255,255,0.08)`

---

### Link / Button Link

**Uso:** Links dentro de texto

```scss
@include rinomed-button-link;
```

**Estados:**
- **Default:** Magenta
- **Hover:** Magenta-hover + underline
- **Active:** Magenta-active

---

### Badges & Tags

**Uso:** Clasificaciones, estados

```scss
.badge {
  background: rgba(192, 122, 184, 0.15);
  border: 1px solid rgba(192, 122, 184, 0.3);
  color: $rinomed-magenta;
  border-radius: $rinomed-radius-sm;
  padding: $rinomed-space-sm $rinomed-space-md;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}
```

---

## Cómo Usar el Sistema

### 1. Importar el Tema

En tu componente SCSS:

```scss
@import '../../theme/rinomed-theme.scss';
```

### 2. Usar Variables

```scss
.my-component {
  background: $rinomed-bg-dark;
  color: $rinomed-text-primary;
  border: 1px solid $rinomed-border;
  border-radius: $rinomed-radius-md;
  padding: $rinomed-space-lg;
  transition: all $rinomed-transition-base;
}
```

### 3. Usar Mixins

```scss
.my-card {
  @include rinomed-glass;
  
  .title {
    @include rinomed-heading-2;
  }
  
  .button {
    @include rinomed-button-primary;
  }
}
```

### 4. Responsive

```scss
.my-section {
  @include rinomed-mobile-only {
    padding: $rinomed-space-lg;
  }
  
  @include rinomed-tablet-up {
    padding: $rinomed-space-2xl;
  }
}
```

---

## Ejemplos Prácticos

### Ejemplo 1: Card Simple

```html
<div class="my-card">
  <h2>Título</h2>
  <p>Descripción</p>
  <button class="btn-primary">Acción</button>
</div>
```

```scss
@import '../../theme/rinomed-theme.scss';

.my-card {
  @include rinomed-glass;
  padding: $rinomed-space-xl;
  
  h2 {
    @include rinomed-heading-2;
    margin-bottom: $rinomed-space-md;
  }
  
  p {
    @include rinomed-text-body;
    color: $rinomed-text-secondary;
    margin-bottom: $rinomed-space-lg;
  }
  
  .btn-primary {
    @include rinomed-button-primary;
    width: 100%;
  }
}
```

### Ejemplo 2: Lista de Items

```html
<div class="item-list">
  <div class="item">
    <span class="number">1</span>
    <div class="content">
      <h3>Título Item</h3>
      <p>Descripción</p>
    </div>
  </div>
</div>
```

```scss
@import '../../theme/rinomed-theme.scss';

.item-list {
  display: flex;
  flex-direction: column;
  gap: $rinomed-space-md;
}

.item {
  @include rinomed-glass;
  padding: $rinomed-space-lg;
  display: flex;
  gap: $rinomed-space-lg;
  align-items: flex-start;
  
  .number {
    font-family: $rinomed-font-family-primary;
    font-size: 24px;
    font-weight: 700;
    color: $rinomed-magenta;
    min-width: 40px;
  }
  
  .content {
    flex: 1;
  }
  
  h3 {
    @include rinomed-heading-3;
    margin-bottom: $rinomed-space-sm;
  }
  
  p {
    @include rinomed-text-small;
  }
}
```

### Ejemplo 3: Formulario

```html
<form class="my-form">
  <div class="form-group">
    <label>Email</label>
    <div class="form-input with-icon">
      <span class="input-icon">📧</span>
      <input type="email" placeholder="tu@correo.com" />
    </div>
  </div>
  <button type="submit" class="btn-primary">Enviar</button>
</form>
```

```scss
@import '../../theme/rinomed-theme.scss';

.my-form {
  display: flex;
  flex-direction: column;
  gap: $rinomed-space-lg;
}

.form-group {
  label {
    @include rinomed-label;
    display: block;
  }
}

.form-input {
  @include rinomed-input-base;
  
  &.with-icon {
    .input-icon {
      margin-right: $rinomed-space-md;
      color: $rinomed-text-secondary;
    }
  }
  
  input {
    @include rinomed-text-body;
    flex: 1;
    background: transparent;
    border: none;
    
    &::placeholder {
      color: $rinomed-text-tertiary;
    }
  }
}

.btn-primary {
  @include rinomed-button-primary;
  width: 100%;
}
```

---

## Best Practices

### ✅ DO's

1. **Usa las variables SCSS** siempre en lugar de hardcodear colores
2. **Usa mixins** para reutilización máxima
3. **Mantén el espaciado consistente** usando la escala
4. **Sigue la convención de naming:** `component-element-modifier`
5. **Respeta la paleta de colores** exactamente como está
6. **Implementa responsive** con los mixins `@include rinomed-*`
7. **Usa glassmorphism** para cards y contenedores principales
8. **Anima suavemente** (no más de 600ms por defecto)
9. **Testea en móvil** siempre antes de hacer commit
10. **Documenta componentes complejos** con comentarios

### ❌ DON'Ts

1. ❌ **No cambies los colores** - están cientificamente estudiados
2. ❌ **No hardcodees valores** de color, spacing, etc.
3. ❌ **No uses Material Design** por defecto (personaliza)
4. ❌ **No hagas sombras duras** - siempre diffusas
5. ❌ **No uses gradientes fuertes** - subtiles siempre
6. ❌ **No agregues mucho espacio negativo** en móvil
7. ❌ **No ignores el safe area** en iOS
8. ❌ **No uses animaciones exageradas**
9. ❌ **No hagas inputs sin glassmorphism**
10. ❌ **No olvides el focus state** en inputs y botones

---

## Troubleshooting

### Problema: "No puedo encontrar las variables SCSS"

**Solución:** Verifica que hayas importado el tema:
```scss
@import '../../theme/rinomed-theme.scss';
```

### Problema: "Los colores se ven diferentes en mi pantalla"

**Solución:** 
- Los colores están en RGB lineal (sRGB)
- Verifica que tu editor no tenga color management activo
- Los colores son exactos en dispositivos reales

### Problema: "Mi botón no tiene glow en hover"

**Solución:** Asegúrate de usar el mixin completo:
```scss
@include rinomed-button-primary;
```

No solo `@include rinomed-gradient-magenta;`

### Problema: "El blur effect no se ve"

**Solución:** El `backdrop-filter` necesita un fondo semi-transparente:
```scss
background: rgba(255, 255, 255, 0.04);
backdrop-filter: blur(20px);
```

### Problema: "Mis inputs no se ven cuando tienen focus"

**Solución:** Asegúrate de que el `input` tenga `background: transparent`:
```scss
input {
  background: transparent;
  border: none;
  outline: none;
}
```

### Problema: "El responsive no funciona"

**Solución:** Usa los mixins correctos:
```scss
@include rinomed-mobile-only {
  // Aplica en: < 768px
}

@include rinomed-tablet-up {
  // Aplica en: >= 768px
}

@include rinomed-desktop-up {
  // Aplica en: >= 1024px
}
```

---

## 📚 Referencias

- **Archivo de variables:** `/src/theme/rinomed-theme.scss`
- **Ejemplo implementado:** `/src/app/auth/login.page.scss`
- **Ejemplo de referencia:** `/src/app/home/home.page.example.scss`
- **Documentación:** `LOGIN_IMPLEMENTATION.md`

---

## 🎯 Conclusión

El **RINOMED 2026 Design System** es robusto, flexible y fácil de usar. Sigue estas guías y todos tus componentes serán consistentes, hermosos y profesionales.

**¡Diseña con confianza! 🚀**

---

*Última actualización: 27 de enero de 2026*
