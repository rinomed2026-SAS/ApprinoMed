import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonAvatar,
  IonChip
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SpeakersService } from '../services/speakers.service';
import { Session, Speaker } from '../services/types';
import { addIcons } from 'ionicons';
import { timeOutline, locationOutline, chevronForwardOutline, globeOutline, logoInstagram } from 'ionicons/icons';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-speaker-detail',
  templateUrl: './speaker-detail.page.html',
  styleUrls: ['./speaker-detail.page.scss'],
  imports: [CommonModule, TranslateModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonButton, IonIcon, IonBadge, IonAvatar, IonChip, RouterLink]
})
export class SpeakerDetailPage {
  speaker: (Speaker & { sessions: Session[] }) | null = null;
  loading = false;
  notFound = false;
  private fallbackSpeakers: (Speaker & { sessions: Session[] })[] = [
    {
      id: 'p1',
      name: 'Dr. John Williams',
      specialty: 'Rhinology',
      country: 'USA',
      bio: 'Expert in advanced endoscopic sinus surgery and skull-base approaches.',
      photoUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80',
      websiteUrl: 'https://drjohnwilliams.com',
      instagramUrl: '@drjohnwilliams',
      isInternational: true,
      sessions: [
        {
          id: 's1',
          day: 'Day 1',
          startTime: '09:00',
          endTime: '10:00',
          room: 'Auditorium A',
          title: 'Advanced Endoscopic Sinus Surgery',
          topic: 'Rhinology',
          level: 'Advanced',
          description: 'Key approaches and complication management.'
        }
      ]
    },
    {
      id: 'p2',
      name: 'Dra. María Fernanda Ruiz',
      specialty: 'Otology',
      country: 'Colombia',
      bio: 'Leader in hearing preservation techniques and cochlear implant programs.',
      photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
      websiteUrl: 'https://draruiz.com',
      instagramUrl: '@dra.mf.ruiz',
      isInternational: false,
      sessions: [
        {
          id: 's2',
          day: 'Day 1',
          startTime: '11:00',
          endTime: '12:00',
          room: 'Room B',
          title: 'Hearing Preservation in Otology',
          topic: 'Otology',
          level: 'Intermediate',
          description: 'Protocols and outcomes for implant candidates.'
        }
      ]
    },
    {
      id: 'p3',
      name: 'Dr. Kenji Tanaka',
      specialty: 'Head & Neck Oncology',
      country: 'Japan',
      bio: 'Focus on minimally invasive oncologic surgery and reconstructive strategies.',
      photoUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
      websiteUrl: 'https://drkenjitanaka.jp',
      instagramUrl: '@dr.kenji.tanaka',
      isInternational: true,
      sessions: [
        {
          id: 's3',
          day: 'Day 2',
          startTime: '14:00',
          endTime: '15:00',
          room: 'Auditorium C',
          title: 'Minimally Invasive Oncology',
          topic: 'Head & Neck',
          level: 'Advanced',
          description: 'Robotic and endoscopic oncology approaches.'
        }
      ]
    },
    {
      id: 'p4',
      name: 'Dra. Sofia Almeida',
      specialty: 'Laryngology',
      country: 'Portugal',
      bio: 'Specialist in voice rehabilitation and transoral laser microsurgery.',
      photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
      websiteUrl: 'https://drsofia.pt',
      instagramUrl: '@drasofiaalmeida',
      isInternational: true,
      sessions: [
        {
          id: 's4',
          day: 'Day 2',
          startTime: '16:00',
          endTime: '17:00',
          room: 'Room D',
          title: 'Voice Preservation & Rehab',
          topic: 'Laryngology',
          level: 'Beginner',
          description: 'Voice rehab protocols after transoral surgery.'
        }
      ]
    }
  ];

  constructor(private route: ActivatedRoute, private speakersService: SpeakersService, private router: Router) {
    addIcons({ timeOutline, locationOutline, chevronForwardOutline, globeOutline, logoInstagram });
  }

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadSpeaker(id);
  }

  loadSpeaker(id: string) {
    this.loading = true;
    this.speakersService.get(id).subscribe({
      next: (data) => {
        if (data) {
          this.speaker = { ...data, sessions: data.sessions ?? [] };
        } else {
          this.useFallback(id);
        }
      },
      error: () => this.useFallback(id),
      complete: () => {
        this.loading = false;
      }
    });
  }

  useFallback(id: string) {
    const fallback = this.fallbackSpeakers.find((sp) => sp.id === id);
    if (fallback) {
      this.speaker = fallback;
      this.notFound = false;
    } else {
      this.notFound = true;
      this.speaker = null;
    }
  }

  trackBySession(_i: number, session: Session) {
    return session.id;
  }

  openSession(sessionId: string) {
    this.router.navigate(['/tabs/sessions', sessionId]);
  }

  async openWebsite(url: string) {
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      await Browser.open({ url: fullUrl });
    }
  }

  async openInstagram(handle: string) {
    if (handle) {
      const cleanHandle = handle.replace('@', '').replace('https://instagram.com/', '').replace('https://www.instagram.com/', '');
      await Browser.open({ url: `https://instagram.com/${cleanHandle}` });
    }
  }
}
