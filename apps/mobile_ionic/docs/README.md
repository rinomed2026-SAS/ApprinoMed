# RINOMED 2026 – Design Documentation

Este directorio contiene toda la documentación del sistema de diseño y guías de implementación.

## 📖 Documentos Disponibles

### 🎯 Inicio Rápido
- **[DESIGN_QUICK_REFERENCE.md](./DESIGN_QUICK_REFERENCE.md)** ⭐ *Empieza aquí*
  - Variables de color, spacing, tipografía
  - Componentes reutilizables
  - Snippets de código
  - Checklist de desarrollo

### 🎨 Guías Detalladas

- **[DESIGN_IMPLEMENTATION.md](./DESIGN_IMPLEMENTATION.md)**
  - Instrucciones completas para nuevas pantallas
  - Checklist de calidad
  - Prohibiciones explícitas
  - Mapeo de pantallas a backgrounds

- **[BACKGROUNDS_GUIDE.md](./BACKGROUNDS_GUIDE.md)**
  - Tres backgrounds predefinidos (login, home, detail)
  - Estructura recomendada por pantalla
  - Ejemplos de código completo
  - Troubleshooting

- **[DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md)** ⭐ *Referencia técnica*
  - Componentes reutilizables (mixins)
  - Patrones de diseño
  - Animaciones
  - Responsive design

### 📝 Otros Documentos

- **[LOGIN_IMPLEMENTATION.md](./LOGIN_IMPLEMENTATION.md)**
  - Documentación técnica del login
  - Angular Reactive Forms
  - Validación y autenticación

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**
  - Instrucciones App Store iOS
  - Instrucciones Google Play Android
  - Metadata y assets requeridos

- **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)**
  - Índice de todos los documentos
  - Audiencias recomendadas

## 🚀 Flujo de Uso

### Para Nuevos Desarrolladores
1. Leer **DESIGN_QUICK_REFERENCE.md** (10 minutos)
2. Revisar **BACKGROUNDS_GUIDE.md** (15 minutos)
3. Estudiar componente existente (login)
4. Crear primera página usando `bg-home`

### Para Cambios de Diseño
1. Consultar **DESIGN_SYSTEM_GUIDE.md**
2. Implementar según **DESIGN_IMPLEMENTATION.md**
3. Pasar checklist de calidad
4. Solicitar review a Design Team

### Para Nuevas Pantallas
1. Seleccionar background: `bg-login`, `bg-home` o `bg-detail`
2. Importar `design-tokens.scss`
3. Usar variables predefinidas
4. Compilar y testar
5. Hacer commit

## 📂 Estructura de Archivos

```
docs/
├── README.md (este archivo)
├── DESIGN_QUICK_REFERENCE.md        ← Empieza aquí
├── DESIGN_IMPLEMENTATION.md         ← Guía de implementación
├── BACKGROUNDS_GUIDE.md             ← Guía de fondos
├── DESIGN_SYSTEM_GUIDE.md           ← Referencia técnica
├── LOGIN_IMPLEMENTATION.md
├── DEPLOYMENT_GUIDE.md
└── DOCUMENTATION_INDEX.md
```

## 🎨 Sistema de Diseño

### Tres Backgrounds Predefinidos
```html
<ion-content class="bg-login"></ion-content>   <!-- Auth screens -->
<ion-content class="bg-home"></ion-content>    <!-- Dashboard -->
<ion-content class="bg-detail"></ion-content>  <!-- Content pages -->
```

### Paleta Obligatoria
- **Fondos:** #0F0F12, #1C1C1C
- **Magenta:** #C07AB8 (CTAs)
- **Texto:** #FFFFFF, rgba(255,255,255,0.65)
- **Bordes:** rgba(255,255,255,0.08)

### Tipografía
- **Display:** Poppins (headings)
- **Body:** Inter (texto principal)
- **Mono:** Fira Code (código)

## ✅ Checklist Rápido

Para cada nueva pantalla:
- [ ] Usar `bg-login`, `bg-home` o `bg-detail`
- [ ] Importar `design-tokens.scss`
- [ ] Usar variables de color (no hardcode)
- [ ] Usar spacing scale
- [ ] Responsive mobile-first
- [ ] Contraste WCAG AA+
- [ ] Compilar sin errores
- [ ] Testar en iOS y Android

## 🆘 Preguntas Frecuentes

**P: ¿Puedo crear mi propio background?**  
R: No. Usa `bg-login`, `bg-home` o `bg-detail`. Si necesitas algo diferente, comunica con Design Team.

**P: ¿Qué color uso para los botones?**  
R: Magenta `#C07AB8` para CTAs primarias. Gris para secundarias.

**P: ¿Cuánto debo espaciar los elementos?**  
R: Usa `$spacing-*` variables (múltiplos de 12px).

**P: ¿Qué fuente uso?**  
R: Inter para body, Poppins para títulos. Ver `design-tokens.scss`.

**P: ¿Las animaciones pueden ser lentas?**  
R: No. Máximo 350ms. Usa `$transition-slow`.

## 📞 Contacto

- **Design Team:** design@rinomed2026.com
- **Documentación:** Ver archivos en este directorio
- **Issues:** Slack #design-system

## 📊 Versión

- **Versión:** 1.0.0
- **Última actualización:** 27 enero 2026
- **Status:** Producción

---

**RINOMED 2026 – Sistema de Diseño Premium**  
*Cada pixel cuenta. Mantengamos la excelencia visual.*
