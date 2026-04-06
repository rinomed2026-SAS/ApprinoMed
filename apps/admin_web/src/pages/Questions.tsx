import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

type AdminQuestion = {
  id: string;
  text: string;
  anonymous?: boolean;
  createdAt: string;
  user: { name: string; email: string };
  session: { title: string; day: string; startTime: string };
};

export function Questions() {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/v1/admin/questions');
      if (!response.ok) throw new Error('No se pudieron cargar las preguntas');
      const body = await response.json();
      setQuestions(body.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const deleteQuestion = async (id: string) => {
    if (!window.confirm('¿Eliminar esta pregunta? Esta acción no se puede deshacer.')) return;
    setDeleting(id);
    try {
      const response = await apiFetch(`/v1/admin/questions/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('No se pudo eliminar');
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });

  const formatSession = (day: string, startTime: string) => {
    const parsed = new Date(day);
    if (Number.isNaN(parsed.getTime())) return startTime;
    return `${parsed.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })} · ${startTime}`;
  };

  return (
    <section className="page">
      <div className="page-header">
        <img src="/logo-rinomed.svg" alt="RinoMed" className="brand-logo" />
        <div>
          <h2>Preguntas de la app</h2>
          <p className="page-sub">Dashboard rápido de Q&A enviado por los asistentes</p>
        </div>
        <a
          className="btn secondary"
          href={`${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'}/v1/admin/questions/export.csv`}
        >
          Exportar CSV
        </a>
        <button className="btn secondary" onClick={load} disabled={loading}>
          {loading ? 'Cargando…' : '↻ Recargar'}
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      {loading ? (
        <div className="card">Cargando preguntas…</div>
      ) : questions.length === 0 ? (
        <div className="card">Aún no hay preguntas enviadas.</div>
      ) : (
        <div className="qa-grid">
          {questions.map((q) => (
            <article key={q.id} className="qa-card">
              <div className="qa-card__top">
                <div>
                  <div className="qa-user">{q.user.name}</div>
                  <div className="qa-meta">{q.user.email}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {q.anonymous && <div className="qa-badge qa-badge--anon">🕶️ Anónimo</div>}
                  <div className="qa-badge">Sesión</div>
                </div>
              </div>

              <div className="qa-session">{q.session.title}</div>
              <div className="qa-meta">{formatSession(q.session.day, q.session.startTime)}</div>

              <p className="qa-text">{q.text}</p>

              <div className="qa-footer">
                <span className="qa-meta">Enviada: {formatDate(q.createdAt)}</span>
                <button
                  className="btn btn-sm danger"
                  disabled={deleting === q.id}
                  onClick={() => deleteQuestion(q.id)}
                >
                  {deleting === q.id ? '⏳' : '🗑️'} Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
