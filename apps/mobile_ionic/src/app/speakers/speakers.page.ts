import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonIcon,
  IonBadge,
  IonAvatar
} from '@ionic/angular/standalone';
import { SpeakersService } from '../services/speakers.service';
import { StorageService } from '../services/storage.service';
import { Speaker } from '../services/types';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-speakers',
  templateUrl: './speakers.page.html',
  styleUrls: ['./speakers.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonIcon,
    IonBadge,
    IonAvatar,
    TranslateModule,
  ]
})
export class SpeakersPage {
  speakers: Speaker[] = [];
  filtered: Speaker[] = [];
  query = '';
  loading = false;
  notFound = false;
  private fallbackSpeakers: Speaker[] = [
    {
      id: 'p1',
      name: 'Dr. John Williams',
      specialty: 'Rhinology',
      country: 'USA',
      bio: 'Expert in advanced endoscopic sinus surgery and skull-base approaches.',
      photoUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80',
      isInternational: true
    },
    {
      id: 'p2',
      name: 'Dra. María Fernanda Ruiz',
      specialty: 'Otology',
      country: 'Colombia',
      bio: 'Leader in hearing preservation techniques and cochlear implant programs.',
      photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
      isInternational: false
    },
    {
      id: 'p3',
      name: 'Dr. Kenji Tanaka',
      specialty: 'Head & Neck Oncology',
      country: 'Japan',
      bio: 'Focus on minimally invasive oncologic surgery and reconstructive strategies.',
      photoUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
      isInternational: true
    },
    {
      id: 'p4',
      name: 'Dra. Sofia Almeida',
      specialty: 'Laryngology',
      country: 'Portugal',
      bio: 'Specialist in voice rehabilitation and transoral laser microsurgery.',
      photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
      isInternational: true
    }
  ];
  private search$ = new Subject<string>();

  constructor(private speakersService: SpeakersService, private storage: StorageService, private router: Router) {
    addIcons({ chevronForwardOutline });
    this.search$.pipe(debounceTime(300)).subscribe((value) => {
      this.query = value;
      this.applyFilter();
      this.load();
    });
  }

  ionViewWillEnter() {
    this.load();
  }

  onSearch(value?: string | null) {
    this.search$.next(value ?? '');
  }

  async load() {
    this.loading = true;
    this.speakersService.list(this.query).subscribe({
      next: async (data) => {
        this.speakers = data.data ?? [];
        this.applyFilter();
        await this.storage.set('speakers', this.speakers);
      },
      error: async () => {
        const cached = await this.storage.get<Speaker[]>('speakers');
        this.speakers = cached?.length ? cached : this.fallbackSpeakers;
        this.applyFilter();
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  applyFilter() {
    const term = this.query.toLowerCase().trim();
    if (!term) {
      this.filtered = [...this.speakers];
      this.notFound = this.filtered.length === 0;
      return;
    }

    this.filtered = this.speakers.filter((sp) => {
      const haystack = `${sp.name} ${sp.specialty} ${sp.country}`.toLowerCase();
      return haystack.includes(term);
    });
    this.notFound = this.filtered.length === 0;
  }

  trackBySpeaker(_i: number, sp: Speaker) {
    return sp.id;
  }

  openSpeaker(sp: Speaker) {
    this.router.navigate(['/tabs/speakers', sp.id]);
  }
}
