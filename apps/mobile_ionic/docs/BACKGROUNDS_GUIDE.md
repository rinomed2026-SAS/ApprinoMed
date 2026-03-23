# RINOMED 2026 – Guía de Backgrounds Oficiales

## Overview

RINOMED 2026 utiliza un sistema de backgrounds predefinidos que garantizan consistencia visual en toda la app. **Nunca debes crear backgrounds personalizados**. Siempre usa las clases proporcionadas.

---

## Backgrounds Disponibles

### 1. **bg-login** – Pantalla de Autenticación
**Ubicación:** `login.page.html`, `signup.page.html`, `forgot-password.page.html`

**Características:**
- Fondo inmersivo con gradientes magenta intensos
- Animaciones sutiles de blobs flotantes
- Sensación futurista y médica
- Ideal para captar atención y confianza

**Colores:**
- Fondo base: `#0F0F12` (negro profundo)
- Gradiente principal: magenta `#C07AB8` con opacidad 15%
- Efecto flotante: magenta con opacidad variable

**Uso:**
```html
<ion-content class="bg-login">
  <!-- Tu contenido aquí -->
</ion-content>
```

**Ejemplo completo:**
```typescript
// login.page.ts
export class LoginPage {
  // Componente
}
```

```html
<!-- login.page.html -->
<ion-content class="bg-login">
  <div class="login-container">
    <!-- Card, inputs, botón -->
  </div>
</ion-content>
```

```scss
// login.page.scss
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: $spacing-lg;
  
  // Contenido aquí
}
```

---

### 2. **bg-home** – Dashboard / Pantalla Principal
**Ubicación:** `home.page.html`, `agenda.page.html`, `speakers.page.html`

**Características:**
- Fondo oscuro equilibrado
- Gradiente sutil magenta en la parte superior
- Animación drift lenta y elegante
- Sensación de dashboard profesional
- Facilita lectura de contenido

**Colores:**
- Fondo base: `#1C1C1C` (negro oscuro)
- Gradiente radial suave con magenta 8% opacidad
- Degradado sutil al bottom

**Uso:**
```html
<ion-content class="bg-home">
  <!-- Tu contenido aquí -->
</ion-content>
```

**Ejemplo completo:**
```html
<!-- home.page.html -->
<ion-content class="bg-home">
  <!-- Header -->
  <div class="home-header">
    <h1>Bienvenido</h1>
  </div>

  <!-- Cards de contenido -->
  <div class="home-cards">
    <app-card *ngFor="let item of items" [item]="item"></app-card>
  </div>

  <!-- Botón flotante -->
  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button>
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>
</ion-content>
```

---

### 3. **bg-detail** – Pantallas de Detalle
**Ubicación:** `session-detail.page.html`, `speaker-detail.page.html`, `settings.page.html`

**Características:**
- Fondo sobrio y limpio
- Gradiente lineal muy ligero
- Minimalista para lectura cómoda
- Enfoque en el contenido
- Sin elementos decorativos distractores

**Colores:**
- Fondo base: `#1C1C1C`
- Gradiente vertical de `#1C1C1C` a `#18181B`
- Efecto radial muy suave con magenta 3% opacidad

**Uso:**
```html
<ion-content class="bg-detail">
  <!-- Tu contenido aquí -->
</ion-content>
```

**Ejemplo completo:**
```html
<!-- session-detail.page.html -->
<ion-content class="bg-detail">
  <!-- Header con imagen/hero -->
  <div class="detail-hero">
    <img [src]="session.image" alt="Session banner">
  </div>

  <!-- Contenido principal -->
  <div class="detail-body">
    <h1>{{ session.title }}</h1>
    <p class="meta">{{ session.speaker }} • {{ session.date }}</p>
    
    <div class="description">
      {{ session.description }}
    </div>

    <!-- Botón de acción -->
    <button ion-button class="btn-primary" (click)="addFavorite()">
      <ion-icon name="heart"></ion-icon>
      Marcar como favorito
    </button>
  </div>
</ion-content>
```

---

## Estructura Recomendada por Pantalla

### Login / Auth Screens
```
bg-login
├── Background animado (gradientes + blobs)
├── Card glassmorphism
│   ├── Branding
│   ├── Form inputs
│   └── CTA button
└── Footer info
```

### Home / Dashboard
```
bg-home
├── Header con usuario
├── Cards grid
│   ├── Card item
│   ├── Card item
│   └── Card item
├── List de contenido
└── FAB button
```

### Detail / Content Pages
```
bg-detail
├── Hero image/header
├── Contenido principal
│   ├── Título
│   ├── Metadata
│   └── Descripción
├── Secciones
└── CTAs
```

---

## Colores Permitidos por Fondo

| Background | Color Fondo | Texto | Acentos | Borders |
|-----------|-----------|--------|---------|---------|
| `bg-login` | `#0F0F12` | `#FFFFFF` | `#C07AB8` | `rgba(255,255,255,0.08)` |
| `bg-home` | `#1C1C1C` | `#FFFFFF` | `#C07AB8` | `rgba(255,255,255,0.12)` |
| `bg-detail` | `#1C1C1C` | `#FFFFFF` | `#C07AB8` | `rgba(255,255,255,0.08)` |

---

## Reglas Obligatorias

### ✅ SÍ
- ✓ Usar `bg-login`, `bg-home`, `bg-detail`
- ✓ Aplicar en `<ion-content>` directamente
- ✓ Mantener el esquema de colores
- ✓ Usar gradientes suaves
- ✓ Respetar la animación de fondo
- ✓ Consultar design tokens para colores

### ❌ NO
- ✗ Crear backgrounds personalizados
- ✗ Cambiar colores de fondo sin aprobación
- ✗ Usar colores fuera de la paleta
- ✗ Añadir ruido visual excesivo
- ✗ Modificar los pseudo-elementos de background
- ✗ Usar fondos planos simples

---

## Ejemplos de Uso Completo

### Página de Login (Component)

**login.page.ts**
```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  login() {
    if (this.form.valid) {
      // Lógica de login
    }
  }
}
```

**login.page.html**
```html
<ion-content class="bg-login">
  <div class="login-wrapper">
    <!-- Branding -->
    <div class="branding">
      <h1 class="title">RINOMED 2026</h1>
      <p class="subtitle">International Rhinology Congress</p>
    </div>

    <!-- Form Card -->
    <div class="login-card">
      <form [formGroup]="form" (ngSubmit)="login()">
        <!-- Email Input -->
        <ion-item class="input-wrapper">
          <ion-label position="floating">Email</ion-label>
          <ion-input 
            type="email"
            formControlName="email"
            placeholder="tu@email.com">
          </ion-input>
        </ion-item>

        <!-- Password Input -->
        <ion-item class="input-wrapper">
          <ion-label position="floating">Contraseña</ion-label>
          <ion-input 
            type="password"
            formControlName="password"
            placeholder="••••••••">
          </ion-input>
        </ion-item>

        <!-- Submit Button -->
        <button 
          ion-button 
          expand="block" 
          class="btn-primary"
          [disabled]="!form.valid">
          Ingresar
        </button>
      </form>

      <!-- Forgot Password -->
      <p class="forgot-password">
        <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
      </p>
    </div>

    <!-- Footer -->
    <footer class="login-footer">
      <p>Medellín, 17–18 abril 2026</p>
      <a href="/privacy">Política de Privacidad</a>
    </footer>
  </div>
</ion-content>
```

**login.page.scss**
```scss
@import '../../theme/design-tokens.scss';

.login-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100%;
  padding: $spacing-lg;
}

.branding {
  text-align: center;
  animation: slideDown 600ms ease-out;

  .title {
    font-family: $font-family-display;
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin: 0 0 $spacing-sm 0;
  }

  .subtitle {
    font-size: $font-size-sm;
    color: $color-text-secondary;
    letter-spacing: 1px;
    margin: 0;
  }
}

.login-card {
  width: 100%;
  max-width: 380px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: $border-radius-lg;
  padding: $spacing-2xl;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  animation: fadeInScale 600ms ease-out 100ms both;

  form {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }
}

.input-wrapper {
  --background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 0;

  &:focus-within {
    border-bottom-color: $color-magenta-primary;
    box-shadow: 0 0 20px rgba(192, 122, 184, 0.3);
  }
}

.btn-primary {
  background: linear-gradient(135deg, $color-magenta-primary, $color-magenta-hover);
  color: $color-text-primary;
  border-radius: $border-radius-md;
  font-weight: $font-weight-semibold;
  height: 44px;
  margin-top: $spacing-md;

  &:hover:not(:disabled) {
    box-shadow: 0 0 30px rgba(192, 122, 184, 0.5);
    transform: translateY(-2px);
  }
}

.forgot-password {
  text-align: center;
  margin-top: $spacing-lg;
  font-size: $font-size-sm;

  a {
    color: $color-magenta-primary;
    text-decoration: none;

    &:hover {
      color: $color-magenta-hover;
      text-decoration: underline;
    }
  }
}

.login-footer {
  text-align: center;
  margin-top: $spacing-2xl;
  color: $color-text-tertiary;
  font-size: $font-size-sm;

  a {
    color: $color-magenta-primary;
    text-decoration: none;
    display: block;
    margin-top: $spacing-sm;
  }
}

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

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## Troubleshooting

### P: El background no se ve
**R:** Verifica que:
1. La clase está aplicada en `<ion-content>`
2. El import en `global.scss` está correcto
3. Reconstruye: `npm run build`

### P: Quiero customizar el background
**R:** **No debes hacerlo**. Si necesitas algo diferente:
1. Comunica con el Design Team
2. Los backgrounds son parte de la identidad
3. Toda personalización debe aprobarse

### P: ¿Puedo cambiar los colores?
**R:** **No**. Los colores están en `design-tokens.scss` y son obligatorios. Si necesitas variación, solicita al Design Team.

### P: El animation se ve cortada
**R:** Asegúrate que:
1. No hay `overflow: hidden` en el contenedor
2. El `z-index` del contenido es mayor a 0
3. La clase está directamente en `<ion-content>`

---

## Checklist para Nuevas Pantallas

- [ ] Usar `bg-login`, `bg-home` o `bg-detail` (no crear nuevo)
- [ ] Aplicar en `<ion-content class="bg-XXX">`
- [ ] Verificar que el contenido está visible sobre el fondo
- [ ] Usar colores de `design-tokens.scss`
- [ ] Magenta (#C07AB8) solo para CTAs
- [ ] Textos con contraste alto
- [ ] Responsive mobile-first
- [ ] Testar en simulador iOS y Android
- [ ] Documentar en JIRA si hay cambios visuales

---

## Contacto Design Team

Si tienes dudas sobre backgrounds, colores o algún aspecto visual:

- **Email:** design@rinomed2026.com
- **Slack:** #design-system
- **Docs:** `/docs/DESIGN_SYSTEM_GUIDE.md`

---

**Última actualización:** 27 enero 2026  
**Versión:** 1.0.0
