import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

const statItems = [
  { label: 'Usuarios', icon: '👥', key: 'users', path: '/users' },
  { label: 'Sesiones', icon: '📅', key: 'sessions', path: '/sessions' },
  { label: 'Preguntas', icon: '💬', key: 'questions', path: '/questions' },
  { label: 'Leads', icon: '✉️', key: 'leads', path: '/leads' },
  { label: 'Encuestas', icon: '⭐', key: 'surveys', path: '/surveys' },
  { label: 'Comunidad', icon: '💜', key: 'community', path: '/community' },
  { label: 'Speakers', icon: '🎤', key: 'speakers', path: '/speakers' },
  { label: 'Sponsors', icon: '💼', key: 'sponsors', path: '/sponsors' }
];

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Record<string, number>>({ users: 0, sessions: 0, questions: 0, leads: 0, surveys: 0, community: 0, speakers: 0, sponsors: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, sessionsRes, questionsRes, leadsRes, surveysRes, communityRes, speakersRes, sponsorsRes] = await Promise.all([
          apiFetch('/v1/admin/users'),
          apiFetch('/v1/admin/sessions'),
          apiFetch('/v1/admin/questions'),
          apiFetch('/v1/admin/leads/export.csv'),
          apiFetch('/v1/admin/surveys').catch(() => null),
          apiFetch('/v1/community/submissions').catch(() => null),
          apiFetch('/v1/admin/speakers'),
          apiFetch('/v1/admin/sponsors')
        ]);

        const users = await usersRes.json();
        const sessions = await sessionsRes.json();
        const questions = await questionsRes.json();
        const leadsText = await leadsRes.text();
        const surveys = surveysRes ? await surveysRes.json().catch(() => ({ data: [] })) : { data: [] };
        const community = communityRes ? await communityRes.json().catch(() => ({ data: [] })) : { data: [] };
        const speakers = await speakersRes.json();
        const sponsors = await sponsorsRes.json();

        setStats({
          users: users.data?.length ?? 0,
          sessions: sessions.data?.length ?? 0,
          questions: questions.data?.length ?? 0,
          leads: leadsText ? Math.max(0, leadsText.split('\n').length - 2) : 0,
          surveys: surveys.data?.length ?? 0,
          community: community.data?.length ?? 0,
          speakers: speakers.data?.length ?? 0,
          sponsors: sponsors.data?.length ?? 0
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="page">
      <div className="page-header">
        <img src="/logo-rinomed.svg" alt="RinoMed 2026" className="brand-logo" />
        <div>
          <h2>Dashboard</h2>
          <p className="page-sub">Panel de control</p>
        </div>
      </div>
      <div className="stats">
        {statItems.map((item) => (
          <div
            key={item.key}
            className="stat-card stat-card--clickable"
            onClick={() => navigate(item.path)}
            style={{ cursor: 'pointer' }}
            title={`Ir a ${item.label}`}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
            <div className="stat-label">{item.label}</div>
            <div className="stat-value">{loading ? '…' : (stats[item.key] ?? 0)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
