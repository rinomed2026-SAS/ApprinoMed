import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonChip,
  IonButton
} from '@ionic/angular/standalone';
import { FavoritesService } from '../services/favorites.service';
import { Session } from '../services/types';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { star, starOutline, locationOutline } from 'ionicons/icons';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonChip, IonButton]
})
export class FavoritesPage {
  sessions: Session[] = [];
  grouped: { day: string; items: Session[] }[] = [];
  loading = false;
  notFound = false;

  constructor(
    private favoritesService: FavoritesService,
    private router: Router,
    private toast: ToastController,
    private translate: TranslateService
  ) {
    addIcons({ star, starOutline, locationOutline });
  }

  ionViewWillEnter() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.loading = true;
    this.favoritesService.list().subscribe({
      next: (res) => {
        const data = res.data ?? [];
        this.sessions = this.dedupeById(data);
        this.sortAndGroup();
      },
      error: () => {
        this.sessions = [];
        this.grouped = [];
        this.notFound = true;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  sortAndGroup() {
    const sorted = [...this.sessions].sort((a, b) => {
      const dayA = this.dayOrder(a.day);
      const dayB = this.dayOrder(b.day);
      if (dayA !== dayB) return dayA - dayB;
      return this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime);
    });

    const groups = new Map<string, Session[]>();
    sorted.forEach((s) => {
      const list = groups.get(s.day) || [];
      list.push(s);
      groups.set(s.day, list);
    });

    this.grouped = Array.from(groups.entries()).map(([day, items]) => ({ day, items }));
    this.notFound = this.grouped.length === 0;
  }

  toggleFavorite(event: Event, session: Session) {
    event.stopPropagation();
    this.favoritesService.remove(session.id).subscribe({
      next: async () => {
        this.sessions = this.sessions.filter((s) => s.id !== session.id);
        this.sortAndGroup();
        await this.presentToast(this.translate.instant('AGENDA.REMOVED_FROM_AGENDA'));
      },
      error: async () => {
        // Optimistic removal even on error
        this.sessions = this.sessions.filter((s) => s.id !== session.id);
        this.sortAndGroup();
        await this.presentToast(this.translate.instant('AGENDA.REMOVED_FROM_AGENDA'));
      }
    });
  }

  openSession(session: Session) {
    this.router.navigate(['/tabs/sessions', session.id]);
  }

  trackBySession(_i: number, session: Session) {
    return session.id;
  }

  trackByDay(_i: number, group: { day: string }) {
    return group.day;
  }

  private dedupeById(list: Session[]) {
    const seen = new Set<string>();
    return list.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }

  private timeToMinutes(time: string) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + (m || 0);
  }

  private dayOrder(day: string) {
    const match = day?.match(/\d+/);
    return match ? Number(match[0]) : 99;
  }

  private async presentToast(message: string) {
    const t = await this.toast.create({ message, duration: 1400, position: 'bottom', cssClass: 'rinomed-toast' });
    await t.present();
  }
}
