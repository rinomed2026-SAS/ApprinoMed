import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonChip,
  IonLabel,
  IonSpinner
} from '@ionic/angular/standalone';
import { Session } from '../services/types';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { timeOutline, locationOutline, starOutline, star, calendarOutline, peopleOutline } from 'ionicons/icons';
import { SessionsService } from '../services/sessions.service';
import { FavoritesService } from '../services/favorites.service';

addIcons({ timeOutline, locationOutline, starOutline, star, calendarOutline, peopleOutline });

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, IonContent, IonSearchbar, IonSegment, IonSegmentButton, IonIcon, IonChip, IonLabel, IonSpinner]
})
export class AgendaPage {
  day = '2026-04-17';
  query = '';
  filteredSessions: Session[] = [];
  allSessions: Session[] = [];
  isLoading = false;
  private search$ = new Subject<string>();

  constructor(
    private router: Router, 
    private toastController: ToastController,
    private sessionsService: SessionsService,
    private favoritesService: FavoritesService,
    private translate: TranslateService
  ) {
    this.search$.pipe(debounceTime(300)).subscribe((value) => {
      this.query = value;
      this.applyFilters();
    });
  }

  ionViewWillEnter() {
    this.loadSessions();
  }

  onSearch(value?: string | null) {
    this.search$.next(value ?? '');
  }

  onDayChange(value?: string | number | null) {
    if (value === null || value === undefined) return;
    this.day = String(value);
    this.applyFilters();
  }

  loadSessions() {
    this.isLoading = true;
    this.sessionsService.list(undefined, undefined, 1, 50).subscribe({
      next: (response) => {
        this.allSessions = response.data;
        this.loadFavorites();
      },
      error: async (error) => {
        this.isLoading = false;
        const toast = await this.toastController.create({
          message: this.translate.instant('AGENDA.ERROR_LOADING'),
          duration: 2000,
          position: 'bottom',
          cssClass: 'rinomed-toast'
        });
        await toast.present();
      }
    });
  }

  loadFavorites() {
    this.favoritesService.list().subscribe({
      next: (response) => {
        const favoriteIds = new Set(response.data.map((s: Session) => s.id));
        this.allSessions.forEach(session => {
          session.isFavorite = favoriteIds.has(session.id);
        });
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.applyFilters();
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    const q = this.query.trim().toLowerCase();
    this.filteredSessions = this.allSessions
      .filter((session) => {
        // Normalize both dates to YYYY-MM-DD format for comparison
        const sessionDate = session.day.split('T')[0];
        return sessionDate === this.day;
      })
      .filter((session) => {
        if (!q) return true;
        return [session.title, session.topic, session.level, session.room, session.description]
          .some((field) => field.toLowerCase().includes(q));
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  async toggleFavorite(session: Session, event?: Event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    const wasFavorite = session.isFavorite;
    session.isFavorite = !session.isFavorite;
    
    const action = session.isFavorite 
      ? this.favoritesService.add(session.id)
      : this.favoritesService.remove(session.id);
    
    action.subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: session.isFavorite
            ? this.translate.instant('AGENDA.ADDED_TO_AGENDA')
            : this.translate.instant('AGENDA.REMOVED_FROM_AGENDA'),
          duration: 1400,
          position: 'bottom',
          cssClass: 'rinomed-toast'
        });
        await toast.present();
      },
      error: async () => {
        // Revert on error
        session.isFavorite = wasFavorite;
        const toast = await this.toastController.create({
          message: this.translate.instant('AGENDA.UPDATE_FAILED'),
          duration: 1400,
          position: 'bottom',
          cssClass: 'rinomed-toast'
        });
        await toast.present();
      }
    });
  }

  openSession(session: Session) {
    this.router.navigate(['/tabs/sessions', session.id]);
  }

  getSpeakerNames(session: Session): string {
    if (!session.speakers?.length) return '';
    return session.speakers.map(s => s.name).join(', ');
  }

  trackBySessionId(_index: number, session: Session) {
    return session.id;
  }
}
