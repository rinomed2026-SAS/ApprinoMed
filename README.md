# RINOMED 2026

Monorepo para la app del Congreso de Rinología y Otorrinolaringología (Medellín, 17–18 abril 2026).

## 📚 Documentación

Toda la documentación del proyecto está organizada en [`docs/`](./docs/):

| Carpeta | Contenido |
|---------|-----------|
| [`docs/design/`](./docs/design/) | Design System, guías de estilo, login, backgrounds |
| [`docs/deployment/`](./docs/deployment/) | Guía de deploy, submission a tiendas, notas para reviewers |
| [`docs/development/`](./docs/development/) | Estado de implementación, integración API, testing, migración |
| [`docs/audit/`](./docs/audit/) | Auditorías de release, patchlogs, reportes de seguridad |

> 📖 **Índice completo:** [`docs/DOCUMENTATION_INDEX.md`](./docs/DOCUMENTATION_INDEX.md)

## 🎨 Design System Premium

**RINOMED 2026 utiliza un Sistema de Diseño Centralizado.**

- 📖 **Guía completa:** [`docs/design/DESIGN_SYSTEM_GUIDE.md`](./docs/design/DESIGN_SYSTEM_GUIDE.md)
- 📋 **Resumen:** [`docs/design/DESIGN_SYSTEM_SUMMARY.md`](./docs/design/DESIGN_SYSTEM_SUMMARY.md)
- 🚀 **Quick Ref:** [`apps/mobile_ionic/docs/DESIGN_QUICK_REFERENCE.md`](./apps/mobile_ionic/docs/DESIGN_QUICK_REFERENCE.md)

**Características:**
- ✅ Paleta obligatoria: Negro (#0F0F12 / #1C1C1C) + Magenta (#C07AB8)
- ✅ Tres backgrounds predefinidos: `bg-login`, `bg-home`, `bg-detail`
- ✅ 80+ variables SCSS centralizadas

**Regla de oro:** Nunca crees backgrounds personalizados o hardcodees colores. Siempre usa variables.

## Estructura

```
/rinomed-2026
  /apps
    /mobile_ionic
    /admin_web
  /services
    /api
  /infra
    docker-compose.yml
    .env.example
  README.md
```

## Requisitos

- Node.js 20
- Docker (para PostgreSQL)
- Xcode / Android Studio para builds nativas

## Configuración

1) Copia variables de entorno:

```bash
cp infra/.env.example services/api/.env
cp infra/.env.example apps/admin_web/.env
```

2) Levanta Postgres:

```bash
docker compose -f infra/docker-compose.yml up -d
```

## API

```bash
cd services/api
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### Sync usuarios desde Google Sheets (login)

Configura en `services/api/.env`:

```bash
GOOGLE_SHEET_ID=1-ZYMgzQY_kUY77YvZ5k1F9nSej403yGmFmOOyxtjNkQ
GOOGLE_SHEET_RANGE=Registros!A:Z
GOOGLE_SHEET_GID=0
GOOGLE_SHEET_DEFAULT_PASSWORD=Rinomed2026!
GOOGLE_SHEET_UPDATE_PASSWORDS=true
GOOGLE_SHEET_FORCE_ADMIN_EMAILS=admin@rinomedellin.com
GOOGLE_SERVICE_ACCOUNT_EMAIL=<service-account>@<project>.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Luego ejecuta:

```bash
cd services/api
npm run users:sync
```

Importante: comparte el Google Sheet con el correo del service account.
Si el correo está en `GOOGLE_SHEET_FORCE_ADMIN_EMAILS`, siempre se sincroniza con rol `ADMIN`.
Si no configuras credenciales de Google, el script intenta leer por export CSV público del Sheet (`GOOGLE_SHEET_ID` + `GOOGLE_SHEET_GID`).

- API local: `http://localhost:4000`
- Health: `GET /health`
- Privacy: `GET /privacy`

## Admin Web

```bash
cd apps/admin_web
npm install
npm run dev
```

- Admin local: `http://localhost:5173`
- Credenciales:
  - `review@rinomed2026.com` / `Rinomed2026!`

## Mobile (Ionic + Capacitor)

```bash
cd apps/mobile_ionic
npm install
npm start
```

### iOS/Android

```bash
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios
npx cap open android
```

### iOS Simulator (script rápido)

Desde la raíz del repo:

```zsh
chmod +x ./run-ios-sim.sh
./run-ios-sim.sh
```

El script ahora también levanta Postgres (`infra/docker-compose.yml`) y API local (`services/api`) antes de instalar la app en el simulador.

Si ya tienes backend corriendo y quieres omitirlo:

```zsh
START_BACKEND=0 ./run-ios-sim.sh
```

Requiere Xcode instalado (incluye Simulator).

## Cuentas de revisión (Store-Ready)

- Admin review: `review@rinomed2026.com` / `Rinomed2026!`
- Asistente demo: `attendee@rinomed2026.com` / `Rinomed2026!`

## Política de Privacidad

- URL pública: `http://localhost:4000/privacy`
- Acceso desde la app: Info → Privacidad

## Build Store-Ready

### Android AAB

```bash
cd apps/mobile_ionic
npm run build
npx cap sync android
cd android
./gradlew bundleRelease
```

### iOS Archive/TestFlight

```bash
cd apps/mobile_ionic
npm run build
npx cap sync ios
npx cap open ios
```

En Xcode: Product → Archive → Distribute App → TestFlight.

## Checklist de publicación

- **Apple App Store**
  - App Review Information: usar credenciales de revisión y notas de acceso.
  - Privacy Policy URL: `/privacy`.
  - Login obligatorio y cuenta demo.

- **Google Play**
  - Data Safety: declarar uso de email/nombre para autenticación.
  - Credenciales de demo si aplica.

## Notas de cumplimiento

- No se solicitan permisos de cámara ni ubicación.
- Manejo de errores con mensajes claros.
- Iconos y splash placeholders listos para reemplazo.
