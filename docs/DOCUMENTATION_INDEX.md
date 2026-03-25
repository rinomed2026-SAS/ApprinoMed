# 📚 RINOMED 2026 - ÍNDICE DE DOCUMENTACIÓN

> Toda la documentación del proyecto vive en esta carpeta `docs/`.  
> En la raíz del repo solo está el [`README.md`](../README.md) principal.

---

## 🎯 Comenzar Por Aquí

Si eres **nuevo en el proyecto**, lee en este orden:

1. [`README.md`](../README.md) — Visión general, setup y quickstart
2. [`design/README_LOGIN.md`](./design/README_LOGIN.md) — Resumen ejecutivo del login
3. [`design/DESIGN_SYSTEM_GUIDE.md`](./design/DESIGN_SYSTEM_GUIDE.md) — Guía de desarrollo de UI
4. [`deployment/DEPLOYMENT_GUIDE.md`](./deployment/DEPLOYMENT_GUIDE.md) — Cómo subir a tiendas

---

## 📁 Estructura de Documentación

```
docs/
├── DOCUMENTATION_INDEX.md        ← Este archivo
│
├── design/                       ← UI, Design System, Login
│   ├── DESIGN_SYSTEM_GUIDE.md
│   ├── DESIGN_SYSTEM_SUMMARY.md
│   ├── LOGIN_IMPLEMENTATION.md
│   ├── README_LOGIN.md
│   ├── VISUAL_VERIFICATION.md
│   └── BACKGROUND_FIX_SUMMARY.md
│
├── deployment/                   ← Deploy, Store Submission
│   ├── DEPLOYMENT_GUIDE.md
│   ├── STORE_SUBMISSION_GUIDE.md
│   └── REVIEWER_NOTES.md
│
├── development/                  ← API, Testing, Status
│   ├── API_INTEGRATION_COMPLETE.md
│   ├── COMPLETE_DEVELOPMENT_SUMMARY.md
│   ├── IMPLEMENTATION_STATUS.md
│   ├── INTEGRATION_TESTING.md
│   ├── SYSTEM_STATUS_READY.md
│   └── COMMUNITY_MIGRATION.md
│
└── audit/                        ← Auditorías, Patchlogs
    ├── AUDIT_FINAL_SUMMARY.md
    ├── AUDIT_REPORT_RELEASE_READY.md
    └── PATCHLOG_FINAL.md
```

---

## 📄 Documentos por Categoría

### 🎨 Design (`docs/design/`)

| Documento | Descripción | Audiencia |
|-----------|-------------|-----------|
| [`DESIGN_SYSTEM_GUIDE.md`](./design/DESIGN_SYSTEM_GUIDE.md) | Guía completa del Design System | Developers, Diseñadores |
| [`DESIGN_SYSTEM_SUMMARY.md`](./design/DESIGN_SYSTEM_SUMMARY.md) | Resumen del sistema de diseño | Todos |
| [`LOGIN_IMPLEMENTATION.md`](./design/LOGIN_IMPLEMENTATION.md) | Implementación técnica del login | Developers |
| [`README_LOGIN.md`](./design/README_LOGIN.md) | Resumen ejecutivo del login | Stakeholders, PM |
| [`VISUAL_VERIFICATION.md`](./design/VISUAL_VERIFICATION.md) | Verificación visual en simulador | QA |
| [`BACKGROUND_FIX_SUMMARY.md`](./design/BACKGROUND_FIX_SUMMARY.md) | Fix de backgrounds del theme | Developers |

### 🚀 Deployment (`docs/deployment/`)

| Documento | Descripción | Audiencia |
|-----------|-------------|-----------|
| [`DEPLOYMENT_GUIDE.md`](./deployment/DEPLOYMENT_GUIDE.md) | Guía de deployment completa | DevOps, Tech Leads |
| [`STORE_SUBMISSION_GUIDE.md`](./deployment/STORE_SUBMISSION_GUIDE.md) | Guía de submission a App Store / Google Play | DevOps |
| [`REVIEWER_NOTES.md`](./deployment/REVIEWER_NOTES.md) | Credenciales y notas para revisores de tiendas | DevOps |

### 🛠 Development (`docs/development/`)

| Documento | Descripción | Audiencia |
|-----------|-------------|-----------|
| [`API_INTEGRATION_COMPLETE.md`](./development/API_INTEGRATION_COMPLETE.md) | Estado de integración API + Simulator | Developers |
| [`COMPLETE_DEVELOPMENT_SUMMARY.md`](./development/COMPLETE_DEVELOPMENT_SUMMARY.md) | Resumen completo de desarrollo | Todos |
| [`IMPLEMENTATION_STATUS.md`](./development/IMPLEMENTATION_STATUS.md) | Reporte de estado de implementación | PM, Developers |
| [`INTEGRATION_TESTING.md`](./development/INTEGRATION_TESTING.md) | Guía de testing de integración | QA, Developers |
| [`SYSTEM_STATUS_READY.md`](./development/SYSTEM_STATUS_READY.md) | Estado del sistema full-stack | Todos |
| [`COMMUNITY_MIGRATION.md`](./development/COMMUNITY_MIGRATION.md) | Guía de migración de comunidad | Developers |

### 🔒 Audit (`docs/audit/`)

| Documento | Descripción | Audiencia |
|-----------|-------------|-----------|
| [`AUDIT_FINAL_SUMMARY.md`](./audit/AUDIT_FINAL_SUMMARY.md) | Resumen ejecutivo de auditoría | Stakeholders |
| [`AUDIT_REPORT_RELEASE_READY.md`](./audit/AUDIT_REPORT_RELEASE_READY.md) | Reporte de auditoría para release | Tech Leads |
| [`PATCHLOG_FINAL.md`](./audit/PATCHLOG_FINAL.md) | Log de parches post-auditoría | Developers |

---

## 🎯 Por Rol

| Rol | Documentos recomendados |
|-----|------------------------|
| **Product Manager** | [`README.md`](../README.md) → [`design/README_LOGIN.md`](./design/README_LOGIN.md) |
| **Developer Frontend** | [`design/DESIGN_SYSTEM_GUIDE.md`](./design/DESIGN_SYSTEM_GUIDE.md) → [`design/LOGIN_IMPLEMENTATION.md`](./design/LOGIN_IMPLEMENTATION.md) |
| **DevOps / QA** | [`deployment/DEPLOYMENT_GUIDE.md`](./deployment/DEPLOYMENT_GUIDE.md) → [`development/INTEGRATION_TESTING.md`](./development/INTEGRATION_TESTING.md) |
| **Diseñador UI/UX** | [`design/DESIGN_SYSTEM_GUIDE.md`](./design/DESIGN_SYSTEM_GUIDE.md) → [`design/DESIGN_SYSTEM_SUMMARY.md`](./design/DESIGN_SYSTEM_SUMMARY.md) |

---

## 🎨 Paleta de Referencia Rápida

```
Fondo Oscuro      #0F0F12
Magenta Principal #C07AB8  ← Botones, links, acentos
Texto Principal   #FFFFFF
Texto Secundario  rgba(255,255,255,0.65)
Error             #FF6B6B
```

---

*Índice de Documentación - RINOMED 2026*  
*Actualizado: Marzo 2026*
