import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login.page').then((m) => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register.page').then((m) => m.RegisterPage)
  },
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage)
      },
      {
        path: 'agenda',
        loadComponent: () => import('./agenda/agenda.page').then((m) => m.AgendaPage)
      },
      {
        path: 'speakers',
        loadComponent: () => import('./speakers/speakers.page').then((m) => m.SpeakersPage)
      },
      {
        path: 'favorites',
        loadComponent: () => import('./favorites/favorites.page').then((m) => m.FavoritesPage)
      },
      {
        path: 'info',
        loadComponent: () => import('./info/info.page').then((m) => m.InfoPage)
      },
      {
        path: 'sponsors',
        loadComponent: () => import('./sponsors/sponsors.page').then((m) => m.SponsorsPage)
      },
      {
        path: 'sponsors/:id',
        loadComponent: () => import('./sponsor-detail/sponsor-detail.page').then((m) => m.SponsorDetailPage)
      },
      {
        path: 'sessions/:id',
        loadComponent: () => import('./session-detail/session-detail.page').then((m) => m.SessionDetailPage)
      },
      {
        path: 'speakers/:id',
        loadComponent: () => import('./speaker-detail/speaker-detail.page').then((m) => m.SpeakerDetailPage)
      },
      {
        path: 'sessions/:id/questions',
        loadComponent: () => import('./questions/questions.page').then((m) => m.QuestionsPage)
      },
      {
        path: 'my-questions',
        loadComponent: () => import('./my-questions/my-questions.page').then((m) => m.MyQuestionsPage)
      },
      {
        path: 'certificate',
        loadComponent: () => import('./certificate/certificate.page').then((m) => m.CertificatePage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.page').then((m) => m.ProfilePage)
      },
      {
        path: 'privacy',
        loadComponent: () => import('./privacy/privacy.page').then((m) => m.PrivacyPage)
      },
      {
        path: 'community',
        loadComponent: () => import('./community/community.page').then((m) => m.CommunityPage)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
