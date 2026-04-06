import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

type SurveyEntry = {
  id: string;
  overallRating: number;
  contentRating: number;
  organizationRating: number;
  venueRating: number;
  wouldRecommend: boolean;
  comments: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string };
};

type SurveyStats = {
  total: number;
  overallAvg: number;
  contentAvg: number;
  organizationAvg: number;
  venueAvg: number;
  recommendPct: number;
};

export function SurveyResults() {
  const [surveys, setSurveys] = useState<SurveyEntry[]>([]);
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiFetch('/v1/admin/surveys');
        if (!response.ok) throw new Error('No se pudieron cargar las encuestas');
        const body = await response.json();
        setSurveys(body.data ?? []);
        setStats(body.stats ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });

  const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <section className="page">
      <div className="page-header">
        <img src="/logo-rinomed.svg" alt="RinoMed" className="brand-logo" />
        <div>
          <h2>Encuestas de Satisfacción</h2>
          <p className="page-sub">Resultados de las encuestas completadas por los asistentes</p>
        </div>
        <a
          className="btn secondary"
          href={`${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'}/v1/admin/surveys/export.csv`}
        >
          Exportar CSV
        </a>
      </div>

      {error && <div className="alert error">{error}</div>}

      {loading ? (
        <div className="card">Cargando encuestas…</div>
      ) : (
        <>
          {/* Stats Summary */}
          {stats && (
            <div className="survey-stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Respuestas</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.overallAvg}</div>
                <div className="stat-label">General</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.contentAvg}</div>
                <div className="stat-label">Contenido</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.organizationAvg}</div>
                <div className="stat-label">Organización</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.venueAvg}</div>
                <div className="stat-label">Sede</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.recommendPct}%</div>
                <div className="stat-label">Recomendarían</div>
              </div>
            </div>
          )}

          {surveys.length === 0 ? (
            <div className="card">Aún no hay encuestas completadas.</div>
          ) : (
            <div className="qa-grid">
              {surveys.map((s) => (
                <article key={s.id} className="qa-card">
                  <div className="qa-card__top">
                    <div>
                      <div className="qa-user">{s.user.name}</div>
                      <div className="qa-meta">{s.user.email}</div>
                    </div>
                    {s.wouldRecommend && (
                      <div className="qa-badge" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)', borderColor: 'rgba(81,207,102,0.3)' }}>
                        ✓ Recomienda
                      </div>
                    )}
                  </div>

                  <div className="survey-ratings">
                    <div className="survey-rating-row">
                      <span className="survey-rating-label">General</span>
                      <span className="survey-stars">{stars(s.overallRating)}</span>
                    </div>
                    <div className="survey-rating-row">
                      <span className="survey-rating-label">Contenido</span>
                      <span className="survey-stars">{stars(s.contentRating)}</span>
                    </div>
                    <div className="survey-rating-row">
                      <span className="survey-rating-label">Organización</span>
                      <span className="survey-stars">{stars(s.organizationRating)}</span>
                    </div>
                    <div className="survey-rating-row">
                      <span className="survey-rating-label">Sede</span>
                      <span className="survey-stars">{stars(s.venueRating)}</span>
                    </div>
                  </div>

                  {s.comments && <p className="qa-text">{s.comments}</p>}

                  <div className="qa-footer">
                    <span className="qa-meta">Enviada: {formatDate(s.createdAt)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
