# Comunidad RINOMED — Guía de migración al repo externo

## 1. BACKEND — `services/api/`

### A. `prisma/schema.prisma`

Agrega al final del archivo:

```prisma
enum CommunitySubmissionStatus {
  PENDING
  APPROVED
  REJECTED
}

model CommunitySubmission {
  id                String                    @id @default(uuid())
  userName          String
  originalImageUrl  String
  composedImageUrl  String?
  allowGallery      Boolean                   @default(false)
  status            CommunitySubmissionStatus @default(PENDING)
  createdAt         DateTime                  @default(now())
  updatedAt         DateTime                  @updatedAt
}
```

### B. Crea `src/routes/community.ts`

```typescript
import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

export const communityRouter = Router();

// GET /v1/community/gallery – imágenes aprobadas para galería pública
communityRouter.get('/gallery', async (_req, res, next) => {
  try {
    const submissions = await prisma.communitySubmission.findMany({
      where: { status: 'APPROVED', allowGallery: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userName: true,
        composedImageUrl: true,
        createdAt: true,
      },
    });
    return res.json({ data: submissions });
  } catch (error) {
    return next(error);
  }
});

// POST /v1/community/submissions – crear nueva submission (requiere auth)
communityRouter.post('/submissions', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { userName, originalImageUrl, composedImageUrl, allowGallery } = req.body as {
      userName: string;
      originalImageUrl: string;
      composedImageUrl?: string;
      allowGallery: boolean;
    };

    if (!userName || !originalImageUrl) {
      return res.status(400).json({ message: 'userName y originalImageUrl son requeridos.' });
    }

    const submission = await prisma.communitySubmission.create({
      data: {
        userName,
        originalImageUrl,
        composedImageUrl: composedImageUrl ?? null,
        allowGallery: allowGallery ?? false,
        status: 'PENDING',
      },
    });

    return res.status(201).json({ data: submission });
  } catch (error) {
    return next(error);
  }
});

// GET /v1/community/submissions – admin: ver todas las submissions
communityRouter.get('/submissions', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const submissions = await prisma.communitySubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ data: submissions });
  } catch (error) {
    return next(error);
  }
});

// PATCH /v1/community/submissions/:id/status – admin: aprobar o rechazar
communityRouter.patch('/submissions/:id/status', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { status } = req.body as { status: 'APPROVED' | 'REJECTED' };
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Estado inválido. Use APPROVED o REJECTED.' });
    }
    const updated = await prisma.communitySubmission.update({
      where: { id: req.params.id },
      data: { status },
    });
    return res.json({ data: updated });
  } catch (error) {
    return next(error);
  }
});
```

### C. `src/app.ts` — agregar import y montaje

```typescript
// Junto a los otros imports de routers:
import { communityRouter } from './routes/community.js';

// Junto a los otros app.use:
app.use('/v1/community', communityRouter);
```

### D. Ejecutar migración

```bash
npx prisma migrate dev --name add_community_submission
```

---

## 2. ADMIN WEB — `apps/admin_web/src/`

### A. Crea `pages/Community.tsx`

```tsx
import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../api';

type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

type CommunitySubmission = {
  id: string;
  userName: string;
  originalImageUrl: string;
  composedImageUrl: string | null;
  allowGallery: boolean;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
};

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
};

const STATUS_CLASS: Record<SubmissionStatus, string> = {
  PENDING: 'badge badge--pending',
  APPROVED: 'badge badge--approved',
  REJECTED: 'badge badge--rejected',
};

type FilterStatus = 'ALL' | SubmissionStatus;

export function Community() {
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [updating, setUpdating] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiFetch('/v1/community/submissions');
      if (!response.ok) throw new Error('No se pudieron cargar las submissions');
      const body = await response.json();
      setSubmissions(body.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setUpdating(id);
    try {
      const response = await apiFetch(`/v1/community/submissions/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('No se pudo actualizar el estado');
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'ALL' ? submissions : submissions.filter((s) => s.status === filter);

  const counts = {
    ALL: submissions.length,
    PENDING: submissions.filter((s) => s.status === 'PENDING').length,
    APPROVED: submissions.filter((s) => s.status === 'APPROVED').length,
    REJECTED: submissions.filter((s) => s.status === 'REJECTED').length,
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <section className="page">
      <div className="page-header">
        <img src="/logo-rinomed.svg" alt="RinoMed" className="brand-logo" />
        <div>
          <h2>Comunidad RINOMED</h2>
          <p className="page-sub">Modera las imágenes enviadas por la comunidad</p>
        </div>
        <button className="btn secondary" onClick={load} disabled={loading}>
          {loading ? 'Cargando…' : '↻ Recargar'}
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="community-filters">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as FilterStatus[]).map((f) => (
          <button
            key={f}
            className={`community-filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            <span className={`community-filter-dot community-filter-dot--${f.toLowerCase()}`} />
            {f === 'ALL' ? 'Todas' : STATUS_LABEL[f as SubmissionStatus]}
            <span className="community-filter-count">{counts[f]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card">Cargando submissions…</div>
      ) : filtered.length === 0 ? (
        <div className="card community-empty">
          <span style={{ fontSize: 40 }}>🖼️</span>
          <p>No hay submissions {filter !== 'ALL' ? `con estado "${STATUS_LABEL[filter as SubmissionStatus]}"` : 'todavía'}.</p>
        </div>
      ) : (
        <div className="community-grid">
          {filtered.map((sub) => (
            <article key={sub.id} className="community-card">
              <div
                className="community-card__img-wrap"
                onClick={() => setLightbox(sub.composedImageUrl ?? sub.originalImageUrl)}
                title="Ver en grande"
              >
                <img
                  src={sub.composedImageUrl ?? sub.originalImageUrl}
                  alt={`Imagen de ${sub.userName}`}
                  className="community-card__img"
                  loading="lazy"
                />
                <div className="community-card__img-overlay"><span>🔍 Ver</span></div>
              </div>

              <div className="community-card__body">
                <div className="community-card__row">
                  <span className="community-card__name">{sub.userName}</span>
                  <span className={STATUS_CLASS[sub.status]}>{STATUS_LABEL[sub.status]}</span>
                </div>
                <div className="community-card__meta">
                  <span>{formatDate(sub.createdAt)}</span>
                  {sub.allowGallery && <span className="badge badge--gallery">Galería pública</span>}
                </div>

                {sub.status === 'PENDING' && (
                  <div className="community-card__actions">
                    <button className="btn btn-sm success" disabled={updating === sub.id} onClick={() => updateStatus(sub.id, 'APPROVED')}>✓ Aprobar</button>
                    <button className="btn btn-sm danger"  disabled={updating === sub.id} onClick={() => updateStatus(sub.id, 'REJECTED')}>✕ Rechazar</button>
                  </div>
                )}
                {sub.status === 'APPROVED' && (
                  <div className="community-card__actions">
                    <button className="btn btn-sm danger" disabled={updating === sub.id} onClick={() => updateStatus(sub.id, 'REJECTED')}>✕ Rechazar</button>
                  </div>
                )}
                {sub.status === 'REJECTED' && (
                  <div className="community-card__actions">
                    <button className="btn btn-sm success" disabled={updating === sub.id} onClick={() => updateStatus(sub.id, 'APPROVED')}>✓ Aprobar</button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="community-lightbox"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada"
        >
          <button className="community-lightbox__close" onClick={() => setLightbox(null)} aria-label="Cerrar">✕</button>
          <img
            src={lightbox}
            alt="Vista ampliada"
            className="community-lightbox__img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
```

### B. `App.tsx` — agregar import y ruta

```tsx
// Junto a los otros imports de páginas:
import { Community } from './pages/Community';

// Junto a las otras rutas protegidas, antes del wildcard <Route path="*">:
<Route
  path="/community"
  element={
    <ProtectedLayout>
      <Community />
    </ProtectedLayout>
  }
/>
```

### C. Navegación lateral — agregar entrada al array `navItems`

```tsx
{ path: '/community', label: 'Comunidad', icon: '💜' }
```

### D. CSS global (`App.css` o equivalente) — agregar al final

```css
/* ═══════════════════════════════════════════════════════════════════════════════
   COMMUNITY – Moderación de posts
   ═══════════════════════════════════════════════════════════════════════════════ */

.community-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }

.community-filter-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 16px;
  background: var(--color-surface); border: 1px solid var(--color-border);
  border-radius: 999px; color: var(--color-text-secondary);
  font-size: 13px; font-weight: 500; cursor: pointer; transition: var(--transition-base);
}
.community-filter-btn:hover { background: var(--color-surface-hover); color: var(--color-text-primary); }
.community-filter-btn.active { background: var(--color-accent-light); border-color: var(--color-accent); color: var(--color-accent); font-weight: 600; }

.community-filter-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.community-filter-dot--all     { background: var(--color-text-secondary); }
.community-filter-dot--pending  { background: #f5a623; }
.community-filter-dot--approved { background: var(--color-success); }
.community-filter-dot--rejected { background: var(--color-danger); }

.community-filter-count { background: rgba(255,255,255,0.1); border-radius: 999px; padding: 1px 7px; font-size: 11px; font-weight: 700; }

.community-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }

.community-card {
  background: var(--color-surface); border: 1px solid var(--color-border);
  border-radius: 16px; overflow: hidden; transition: var(--transition-base);
}
.community-card:hover { border-color: var(--color-border-hover); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }

.community-card__img-wrap { position: relative; aspect-ratio: 4/5; overflow: hidden; cursor: pointer; background: #0a0a0e; }
.community-card__img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 300ms ease; }
.community-card__img-wrap:hover .community-card__img { transform: scale(1.04); }
.community-card__img-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 200ms ease; color: #fff; font-size: 15px; font-weight: 600; gap: 6px;
}
.community-card__img-wrap:hover .community-card__img-overlay { opacity: 1; }

.community-card__body { padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; }
.community-card__row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.community-card__name { font-size: 14px; font-weight: 600; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.community-card__meta { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--color-text-tertiary); flex-wrap: wrap; }
.community-card__actions { display: flex; gap: 8px; margin-top: 4px; }

.badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.3px; white-space: nowrap; }
.badge--pending  { background: rgba(245,166,35,0.18); color: #f5a623; border: 1px solid rgba(245,166,35,0.35); }
.badge--approved { background: var(--color-success-bg); color: var(--color-success); border: 1px solid rgba(81,207,102,0.3); }
.badge--rejected { background: var(--color-danger-bg);  color: var(--color-danger);  border: 1px solid rgba(224,90,90,0.3); }
.badge--gallery  { background: var(--color-accent-light); color: var(--color-accent); border: 1px solid rgba(192,122,184,0.35); }

.btn-sm { padding: 6px 12px !important; font-size: 12px !important; border-radius: 8px !important; flex: 1; }
.btn.success, .btn.btn-sm.success { background: var(--color-success-bg); border-color: rgba(81,207,102,0.4); color: var(--color-success); }
.btn.success:hover { background: rgba(81,207,102,0.25); }
.btn.danger,  .btn.btn-sm.danger  { background: var(--color-danger-bg);  border-color: rgba(224,90,90,0.4);   color: var(--color-danger); }
.btn.danger:hover  { background: rgba(224,90,90,0.25); }

.community-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 48px 24px; text-align: center; color: var(--color-text-secondary); }

.community-lightbox {
  position: fixed; inset: 0; background: rgba(0,0,0,0.92);
  z-index: 1000; display: flex; align-items: center; justify-content: center;
  cursor: pointer; backdrop-filter: blur(6px);
}
.community-lightbox__img { max-width: min(90vw, 540px); max-height: 90vh; border-radius: 16px; object-fit: contain; cursor: default; box-shadow: 0 24px 64px rgba(0,0,0,0.8); }
.community-lightbox__close {
  position: absolute; top: 20px; right: 24px;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
  color: #fff; font-size: 18px; width: 40px; height: 40px;
  border-radius: 50%; cursor: pointer; transition: var(--transition-base);
  display: flex; align-items: center; justify-content: center;
}
.community-lightbox__close:hover { background: rgba(255,255,255,0.2); }
```

---

## Variables CSS requeridas

El CSS asume estas variables en `:root`. Si tu proyecto las tiene con otros nombres, adáptalas:

| Variable | Valor de referencia |
|---|---|
| `--color-surface` | `rgba(255,255,255,0.04)` |
| `--color-surface-hover` | `rgba(255,255,255,0.08)` |
| `--color-border` | `rgba(255,255,255,0.10)` |
| `--color-border-hover` | `rgba(255,255,255,0.15)` |
| `--color-accent` | `#c07ab8` |
| `--color-accent-light` | `rgba(192,122,184,0.15)` |
| `--color-text-primary` | `#ffffff` |
| `--color-text-secondary` | `rgba(255,255,255,0.65)` |
| `--color-text-tertiary` | `rgba(255,255,255,0.45)` |
| `--color-success` | `#51cf66` |
| `--color-success-bg` | `rgba(81,207,102,0.15)` |
| `--color-danger` | `#e05a5a` |
| `--color-danger-bg` | `rgba(224,90,90,0.15)` |
| `--transition-base` | `all 250ms ease` |

---

## Endpoints disponibles tras la migración

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/v1/community/gallery` | No | Imágenes aprobadas para galería pública |
| `POST` | `/v1/community/submissions` | Bearer | Enviar nueva foto desde la app |
| `GET` | `/v1/community/submissions` | Admin | Listar todas para moderación |
| `PATCH` | `/v1/community/submissions/:id/status` | Admin | Aprobar o rechazar |
