import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonChip,
  IonButton,
  IonIcon,
  IonTextarea,
  IonAvatar
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionsService } from '../services/sessions.service';
import { FavoritesService } from '../services/favorites.service';
import { QuestionsService } from '../services/questions.service';
import { Session, Question } from '../services/types';
import { ToastController, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  timeOutline,
  locationOutline,
  starOutline,
  star,
  chevronForwardOutline,
  trashOutline
} from 'ionicons/icons';
import { SESSIONS_SEED, SessionSeed } from '../data/sessions.seed';

@Component({
  selector: 'app-session-detail',
  templateUrl: './session-detail.page.html',
  styleUrls: ['./session-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonChip,
    IonButton,
    IonIcon,
    IonTextarea,
    IonAvatar
  ]
})
export class SessionDetailPage {
  session: (Session & { speakers: SpeakerLite[] }) | null = null;
  questions: Question[] = [];
  questionText = '';
  notFound = false;
  private userId = localStorage.getItem('userEmail') || 'review@rinomed2026.com';
  counterFormatter = (currentLength: number, maxLength?: number) => `${currentLength}/${maxLength ?? 280}`;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionsService: SessionsService,
    private favoritesService: FavoritesService,
    private questionsService: QuestionsService,
    private toastController: ToastController,
    private alertController: AlertController,
    private translate: TranslateService
  ) {
    addIcons({ timeOutline, locationOutline, starOutline, star, chevronForwardOutline, trashOutline });
  }

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadSession(id);
    this.loadQuestions(id);
  }

  loadSession(id: string) {
    const seed = SESSIONS_SEED.find((s) => s.id === id);
    this.sessionsService.get(id).subscribe({
      next: (data) => {
        this.session = this.hydrateSession(data, seed);
        this.notFound = !this.session;
      },
      error: () => {
        this.session = this.hydrateSession(null, seed);
        this.notFound = !this.session;
      }
    });
  }

  loadQuestions(id: string) {
    this.questionsService.list().subscribe({
      next: (res) => {
        this.questions = (res.data || []).filter((q) => q.sessionId === id && (!q.userId || q.userId === this.userId));
      },
      error: () => {
        this.questions = [];
      }
    });
  }

  async toggleFavorite(event?: Event) {
    if (event) event.stopPropagation();
    if (!this.session) return;
    const targetId = this.session.id;

    if (this.session.isFavorite) {
      this.favoritesService.remove(targetId).subscribe(async () => {
        if (this.session) this.session.isFavorite = false;
        await this.presentToast(this.translate.instant('AGENDA.REMOVED_FROM_AGENDA'));
      });
    } else {
      this.favoritesService.add(targetId).subscribe(async () => {
        if (this.session) this.session.isFavorite = true;
        await this.presentToast(this.translate.instant('AGENDA.ADDED_TO_AGENDA'));
      });
    }
  }

  async sendQuestion() {
    if (!this.session) return;
    const text = this.questionText.trim();
    if (text.length < 10 || text.length > 280) {
      await this.presentToast(this.translate.instant('SESSION_DETAIL.QUESTION_LENGTH_ERROR'));
      return;
    }
    const sessionId = this.session.id;
    this.questionsService.create(sessionId, text).subscribe({
      next: async (res) => {
        const created: Question = res.data || {
          id: crypto.randomUUID(),
          sessionId,
          text,
          createdAt: new Date().toISOString(),
          userId: this.userId
        } as Question;
        this.questions = [created, ...this.questions];
        this.questionText = '';
        await this.presentToast(this.translate.instant('SESSION_DETAIL.QUESTION_SENT'));
      },
      error: async () => {
        const fallback: Question = {
          id: crypto.randomUUID(),
          sessionId,
          text,
          createdAt: new Date().toISOString(),
          userId: this.userId
        } as Question;
        this.questions = [fallback, ...this.questions];
        this.questionText = '';
        await this.presentToast(this.translate.instant('SESSION_DETAIL.QUESTION_SENT'));
      }
    });
  }

  async confirmDelete(question: Question, event: Event) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: this.translate.instant('SESSION_DETAIL.DELETE_CONFIRM_TITLE'),
      buttons: [
        {
          text: this.translate.instant('COMMON.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('COMMON.DELETE'),
          role: 'destructive',
          handler: () => this.deleteQuestion(question)
        }
      ]
    });
    await alert.present();
  }

  deleteQuestion(question: Question) {
    this.questionsService.remove(question.id).subscribe({
      next: async () => {
        this.questions = this.questions.filter((q) => q.id !== question.id);
        await this.presentToast(this.translate.instant('SESSION_DETAIL.QUESTION_DELETED'));
      },
      error: async () => {
        this.questions = this.questions.filter((q) => q.id !== question.id);
        await this.presentToast(this.translate.instant('SESSION_DETAIL.QUESTION_DELETED'));
      }
    });
  }

  openSpeaker(speaker: SpeakerLite) {
    this.router.navigate(['/tabs/speakers', speaker.id]);
  }

  trackByQuestionId(_i: number, q: Question) {
    return q.id;
  }

  private hydrateSession(data: Session | null, seed?: SessionSeed) {
    if (data) {
      const speakers = (data as unknown as { speakers?: SpeakerLite[] }).speakers;
      return { ...data, speakers: speakers ?? this.seedSpeakers(seed) } as Session & { speakers: SpeakerLite[] };
    }
    if (seed) {
      return { ...seed, speakers: this.seedSpeakers(seed) } as Session & { speakers: SpeakerLite[] };
    }
    return null;
  }

  private seedSpeakers(seed?: SessionSeed): SpeakerLite[] {
    if (!seed) return [];
    return seed.speakers.map((name, idx) => ({ id: `seed-speaker-${seed.id}-${idx}`, name }));
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({ message, duration: 1400, position: 'bottom', cssClass: 'rinomed-toast' });
    await toast.present();
  }
}

type SpeakerLite = { id: string; name: string; specialty?: string; country?: string; photoUrl?: string };
