# Fix: Community submissions falla con 400 Bad Request

## Problema

El `POST /v1/community/submissions` retorna `400 Bad Request` con `"userName es requerido"` y `received: {}`. Dos causas:

1. **Body parser limit demasiado bajo** — `express.json({ limit: '2mb' })` rechaza el body cuando las imágenes base64 superan 2MB, dejando `req.body` como `{}`.
2. **`userName` depende 100% del body** — Si el body falla, no hay fallback.

---

## Corrección 1: `src/app.ts` — Aumentar límite del body parser

**Buscar:**

```typescript
app.use(express.json({ limit: '2mb' }));
```

**Reemplazar por:**

```typescript
app.use(express.json({ limit: '20mb' }));
```

---

## Corrección 2: `src/routes/community.ts` — Fallback de userName desde auth

En el `POST /submissions`, reemplazar toda la sección de validación:

**Buscar:**

```typescript
communityRouter.post('/submissions', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { userName, originalImageUrl, composedImageUrl, allowGallery, appCaption } = req.body as {
      userName: string;
      originalImageUrl: string;
      composedImageUrl?: string;
      allowGallery: boolean;
      appCaption?: string;
    };

    if (!userName || !originalImageUrl) {
      return res.status(400).json({ message: 'userName y originalImageUrl son requeridos.' });
    }

    const submission = await prisma.communitySubmission.create({
      data: {
        userName,
```

**Reemplazar por:**

```typescript
communityRouter.post('/submissions', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { userName, originalImageUrl, composedImageUrl, allowGallery, appCaption } = req.body as {
      userName?: string;
      originalImageUrl: string;
      composedImageUrl?: string;
      allowGallery: boolean;
      appCaption?: string;
    };

    // Resolve userName: prefer body, fallback to authenticated user profile
    let resolvedUserName = userName;
    if (!resolvedUserName && req.userId) {
      const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { name: true } });
      resolvedUserName = user?.name || 'Asistente';
    }

    if (!resolvedUserName || !originalImageUrl) {
      return res.status(400).json({
        message: 'userName es requerido y debe ser un string no vacío.',
        received: { userName: resolvedUserName, hasImage: !!originalImageUrl },
      });
    }

    const submission = await prisma.communitySubmission.create({
      data: {
        userName: resolvedUserName,
```

El resto del `create` queda igual (`originalImageUrl`, `composedImageUrl`, `appCaption`, `allowGallery`, `status`).

---

## Resumen de cambios

| Archivo | Cambio |
|---------|--------|
| `src/app.ts` | `limit: '2mb'` → `limit: '20mb'` |
| `src/routes/community.ts` | `userName` opcional + fallback desde `prisma.user` del token auth |

**Hacer deploy a Railway después del push.**
