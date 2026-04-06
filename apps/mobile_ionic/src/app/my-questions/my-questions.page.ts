import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonSpinner,
  IonBackButton,
  IonButtons,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chatbubbleEllipsesOutline,
  trashOutline,
  eyeOffOutline,
  timeOutline,
  chevronForwardOutline,
  arrowBackOutline
} from 'ionicons/icons';
import { QuestionsService } from '../services/questions.service';

type QuestionWithSession = {
  id: string;
  sessionId: string;
  text: string;
  anonymous?: boolean;
  createdAt: string;
  session?: {
    id: string;
    title: string;
    day: string;
    startTime: string;
    endTime?: string;
    room?: string;
  };
};

@Component({
  selector: 'app-my-questions',
  templateUrl: './my-questions.page.html',
  styleUrls: ['./my-questions.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonSpinner,
    IonBackButton,
    IonButtons
  ]
})
export class MyQuestionsPage {
  questions: QuestionWithSession[] = [];
  isLoading = true;
  isEmpty = false;

  constructor(
    private questionsService: QuestionsService,
    private router: Router,
    private ngZone: NgZone,
    private toastController: ToastController,
    private alertController: AlertController,
    private translate: TranslateService
  ) {
    addIcons({
      chatbubbleEllipsesOutline,
      trashOutline,
      eyeOffOutline,
      timeOutline,
      chevronForwardOutline,
      arrowBackOutline
    });
  }

  ionViewWillEnter() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.isLoading = true;
    this.questionsService.list().subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.questions = res.data ?? [];
          this.isEmpty = this.questions.length === 0;
          this.isLoading = false;
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.questions = [];
          this.isEmpty = true;
          this.isLoading = false;
        });
      }
    });
  }

  async confirmDelete(q: QuestionWithSession) {
    const alert = await this.alertController.create({
      header: this.translate.instant('MY_QUESTIONS.DELETE_TITLE'),
      message: this.translate.instant('MY_QUESTIONS.DELETE_CONFIRM'),
      buttons: [
        { text: this.translate.instant('COMMON.CANCEL'), role: 'cancel' },
        {
          text: this.translate.instant('MY_QUESTIONS.DELETE'),
          role: 'destructive',
          handler: () => this.deleteQuestion(q)
        }
      ]
    });
    await alert.present();
  }

  deleteQuestion(q: QuestionWithSession) {
    this.questionsService.remove(q.id).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.questions = this.questions.filter((x) => x.id !== q.id);
          this.isEmpty = this.questions.length === 0;
          this.showToast(this.translate.instant('MY_QUESTIONS.DELETED'));
        });
      },
      error: () => {
        this.showToast(this.translate.instant('MY_QUESTIONS.DELETE_ERROR'));
      }
    });
  }

  goToSession(sessionId: string) {
    this.router.navigate([`/tabs/sessions/${sessionId}`]);
  }

  formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleString('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  }

  formatSessionTime(session?: QuestionWithSession['session']): string {
    if (!session) return '';
    try {
      const d = new Date(session.day);
      const dayStr = d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
      return `${dayStr} · ${session.startTime}`;
    } catch {
      return session.startTime || '';
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'rinomed-toast'
    });
    toast.present();
  }
}
