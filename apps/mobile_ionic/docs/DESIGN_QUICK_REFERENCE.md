# RINOMED 2026 – Design System Quick Reference

> Guía rápida para desarrolladores. Consulta completa en `DESIGN_SYSTEM_GUIDE.md`

## 🎨 Colores

```scss
// Fondos
$color-bg-darkest: #0F0F12;  // Negro profundo
$color-bg-dark: #1C1C1C;     // Negro oscuro

// Magenta RINOMED (identidad)
$color-magenta-primary: #C07AB8;  // CTA principal
$color-magenta-hover: #D08CC4;    // Hover
$color-magenta-active: #B968AA;   // Active

// Textos
$color-text-primary: #FFFFFF;      // Blanco puro
$color-text-secondary: rgba(255,255,255,0.65);  // Secundario
$color-text-tertiary: rgba(255,255,255,0.45);   // Débil

// Estados
$color-error: #FF6B6B;
$color-success: #4ECDC4;
$color-warning: #FFB84D;
$color-info: #7DD9D4;
```

## 📱 Backgrounds

```html
<!-- Login / Auth -->
<ion-content class="bg-login"></ion-content>

<!-- Home / Dashboard -->
<ion-content class="bg-home"></ion-content>

<!-- Detail / Content -->
<ion-content class="bg-detail"></ion-content>
```

## 🔤 Tipografía

```scss
// Fuentes
$font-family-primary: 'Inter', sans-serif;    // Body text
$font-family-display: 'Poppins', sans-serif;  // Headings
$font-family-mono: 'Fira Code', monospace;    // Code

// Tamaños
$font-size-xs: 12px;
$font-size-sm: 14px;
$font-size-base: 16px;
$font-size-lg: 18px;
$font-size-xl: 24px;
$font-size-2xl: 32px;
$font-size-3xl: 48px;

// Pesos
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

## 📏 Espaciado

```scss
$spacing-xs: 4px;     // xs
$spacing-sm: 8px;     // sm
$spacing-md: 12px;    // md
$spacing-lg: 16px;    // lg
$spacing-xl: 24px;    // xl
$spacing-2xl: 32px;   // 2xl
$spacing-3xl: 48px;   // 3xl
$spacing-4xl: 64px;   // 4xl
```

## 🔘 Componentes Reutilizables

### Botón Primary

```html
<button ion-button class="btn-primary">
  Acción principal
</button>
```

```scss
.btn-primary {
  background: linear-gradient(135deg, $color-magenta-primary, $color-magenta-hover);
  color: $color-text-primary;
  border-radius: $border-radius-md;
  font-weight: $font-weight-semibold;
  height: 44px;
  
  &:hover {
    box-shadow: 0 0 30px rgba(192, 122, 184, 0.5);
    transform: translateY(-2px);
  }
}
```

### Botón Secondary

```html
<button ion-button class="btn-secondary">
  Acción secundaria
</button>
```

```scss
.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: $color-text-primary;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: $border-radius-md;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.18);
  }
}
```

### Input Field

```html
<ion-item class="input-field">
  <ion-label position="floating">Label</ion-label>
  <ion-input type="text"></ion-input>
</ion-item>
```

```scss
.input-field {
  --background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  
  &:focus-within {
    border-bottom-color: $color-magenta-primary;
    box-shadow: 0 0 20px rgba(192, 122, 184, 0.3);
  }
}
```

### Card

```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

```scss
.card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}
```

## ⏱️ Transiciones

```scss
$transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);   // Rápida
$transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);   // Estándar
$transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);   // Lenta

// Uso
.element {
  transition: all $transition-base;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 20px rgba(192, 122, 184, 0.4);
  }
}
```

## 📐 Breakpoints

```scss
$breakpoint-mobile: 480px;    // <480px
$breakpoint-tablet: 768px;    // 480–768px
$breakpoint-desktop: 1024px;  // 768–1024px
$breakpoint-wide: 1440px;     // >1024px
```

## 🏗️ Layout Mixin

```scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// Uso
.container {
  @include flex-center;
  height: 100%;
}
```

## 🎬 Animaciones Básicas

```scss
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

// Uso
.element {
  animation: slideDown 600ms ease-out;
}
```

## ✅ Checklist de Desarrollo

- [ ] Usar `bg-login`, `bg-home` o `bg-detail`
- [ ] Importar `design-tokens.scss`
- [ ] Usar variables de color (no hardcode)
- [ ] Usar spacing scale ($spacing-*)
- [ ] Responsive mobile-first
- [ ] Contraste WCAG AA+ (4.5:1)
- [ ] Transiciones suaves (no >400ms)
- [ ] Textos con line-height >= 1.5
- [ ] Safe area iOS (env(safe-area-inset-*))
- [ ] Testar en múltiples dispositivos

## 📚 Archivos de Referencia

| Archivo | Descripción |
|---------|------------|
| `design-tokens.scss` | Variables maestras |
| `backgrounds.scss` | Fondos por pantalla |
| `rinomed-theme.scss` | Componentes reutilizables |
| `DESIGN_SYSTEM_GUIDE.md` | Guía completa |
| `BACKGROUNDS_GUIDE.md` | Guía de fondos |

## 🚀 Inicio Rápido

1. **Crear componente:**
   ```bash
   ng generate component pages/my-page
   ```

2. **Aplicar background:**
   ```html
   <ion-content class="bg-home">
     <!-- Tu contenido -->
   </ion-content>
   ```

3. **Importar tokens:**
   ```scss
   @import '../../theme/design-tokens.scss';
   ```

4. **Usar variables:**
   ```scss
   .my-element {
     color: $color-text-primary;
     font-size: $font-size-lg;
     padding: $spacing-lg;
     border-radius: $border-radius-md;
   }
   ```

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| Background no se ve | Verifica que está en `<ion-content>` |
| Colores incorrectos | Usa variables de `design-tokens.scss` |
| Texto ilegible | Aumenta contraste con `$color-text-primary` |
| Animación lenta | Usa `$transition-fast` (150ms) |
| Layout roto mobile | Revisa breakpoints y padding |

---

**Última actualización:** 27 enero 2026  
**Contacto:** design@rinomed2026.com
