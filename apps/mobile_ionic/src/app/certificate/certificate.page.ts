import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonTextarea,
  IonToggle,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  documentTextOutline,
  checkmarkCircleOutline,
  downloadOutline,
  refreshOutline,
  informationCircleOutline,
  starOutline,
  star
} from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { CertificateService } from '../services/certificate.service';
import { SurveyService, SurveyPayload } from '../services/survey.service';
import { StorageService } from '../services/storage.service';
import { Certificate } from '../services/types';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.page.html',
  styleUrls: ['./certificate.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonSpinner,
    IonTextarea,
    IonToggle
  ]
})
export class CertificatePage {
  // ── Survey state ──
  surveyCompleted = false;
  surveyLoading = true;
  showSurvey = true;
  surveySubmitting = false;

  survey: SurveyPayload = {
    overallRating: 0,
    contentRating: 0,
    organizationRating: 0,
    venueRating: 0,
    wouldRecommend: true,
    comments: ''
  };

  ratingLabels = [1, 2, 3, 4, 5];

  // ── Certificate state ──
  certificate: Certificate | null = null;
  isLoading = true;
  isDownloading = false;
  hasError = false;
  errorMessage = '';
  userName = 'Guest';

  fallbackCertificate: Certificate = {
    id: '1',
    userId: 'user-001',
    certificateId: 'DEMO-2026-XXXX',
    userName: 'Demo User (Awaiting Certificate Generation)',
    eventName: 'International Congress of Rhinology and Otolaryngology',
    eventDates: 'April 17–18, 2026',
    academicHours: 16,
    issuedAt: new Date().toISOString(),
    userRole: 'ASSISTANT',
    certificateType: 'Certificado de Asistencia'
  };

  constructor(
    private authService: AuthService,
    private certificateService: CertificateService,
    private surveyService: SurveyService,
    private storage: StorageService,
    private ngZone: NgZone,
    private toastController: ToastController,
    private translate: TranslateService
  ) {
    addIcons({
      documentTextOutline,
      checkmarkCircleOutline,
      downloadOutline,
      refreshOutline,
      informationCircleOutline,
      starOutline,
      star
    });
  }

  ionViewWillEnter() {
    this.checkSurveyStatus();
  }

  /** Check if user already completed the satisfaction survey */
  checkSurveyStatus() {
    this.surveyLoading = true;
    this.surveyService.get().subscribe({
      next: (res) => {
        if (res.data) {
          this.surveyCompleted = true;
          this.showSurvey = false;
          this.loadCertificate();
        } else {
          this.surveyCompleted = false;
          this.showSurvey = true;
        }
        this.surveyLoading = false;
      },
      error: () => {
        // If can't reach API, keep survey visible so user must complete it
        this.surveyCompleted = false;
        this.showSurvey = true;
        this.surveyLoading = false;
      }
    });
  }

  setRating(field: 'overallRating' | 'contentRating' | 'organizationRating' | 'venueRating', value: number) {
    this.survey[field] = value;
  }

  get canSubmitSurvey(): boolean {
    return this.survey.overallRating > 0 &&
           this.survey.contentRating > 0 &&
           this.survey.organizationRating > 0 &&
           this.survey.venueRating > 0;
  }

  submitSurvey() {
    if (!this.canSubmitSurvey) return;
    this.surveySubmitting = true;

    this.surveyService.submit(this.survey).subscribe({
      next: async () => {
        this.surveyCompleted = true;
        this.showSurvey = false;
        this.surveySubmitting = false;
        await this.showToast(this.translate.instant('SURVEY.SUBMITTED'));
        this.loadCertificate();
      },
      error: async () => {
        this.surveySubmitting = false;
        await this.showToast(this.translate.instant('SURVEY.ERROR'));
      }
    });
  }

  async loadCertificate() {
    this.isLoading = true;
    this.hasError = false;

    try {
      const accessToken = await this.authService.getAccessToken();
      if (accessToken) {
        this.authService.loadProfile().subscribe({
          next: (user) => { this.userName = user.name || 'Guest'; },
          error: () => { this.userName = 'Guest'; }
        });
      }

      this.certificateService.getCertificate().toPromise().then(
        async (response: any) => {
          if (response?.data) {
            this.certificate = response.data;
            if (this.certificate) this.certificate.userName = this.userName;
            await this.certificateService.cacheCertificate(response.data);
          } else {
            throw new Error('No data');
          }
          this.isLoading = false;
        },
        async (err) => {
          if (err?.status === 403) {
            this.surveyCompleted = false;
            this.showSurvey = true;
            this.isLoading = false;
            return;
          }
          const cached = await this.certificateService.getCachedCertificate();
          if (cached) {
            this.certificate = cached;
            this.certificate.userName = this.userName;
          } else {
            this.certificate = { ...this.fallbackCertificate };
            this.certificate.userName = this.userName;
          }
          this.isLoading = false;
        }
      );
    } catch (error) {
      this.certificate = { ...this.fallbackCertificate };
      this.certificate.userName = this.userName;
      this.isLoading = false;
    }

    setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        if (!this.certificate) {
          this.certificate = { ...this.fallbackCertificate };
          this.certificate.userName = this.userName;
        }
      }
    }, 6000);
  }

  async downloadCertificate() {
    if (!this.certificate) return;
    this.isDownloading = true;

    try {
      this.certificateService.downloadPdf().subscribe({
        next: (blob) => {
          this.ngZone.run(() => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `RINOMED-2026-Certificate-${this.certificate?.certificateId}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
            this.isDownloading = false;
            this.showToast(this.translate.instant('SURVEY.CERT_DOWNLOADED'));
          });
        },
        error: () => {
          this.isDownloading = false;
          this.showToast(this.translate.instant('SURVEY.CERT_DOWNLOAD_ERROR'));
        }
      });
    } catch (error) {
      this.isDownloading = false;
      this.showToast(this.translate.instant('SURVEY.CERT_DOWNLOAD_ERROR'));
    }
  }

  async retry() {
    this.checkSurveyStatus();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  getFormattedDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      ASSISTANT: this.translate.instant('SURVEY.ROLE_ASSISTANT'),
      PROFESSOR: this.translate.instant('SURVEY.ROLE_PROFESSOR'),
      STAFF: this.translate.instant('SURVEY.ROLE_STAFF'),
      ADMIN: this.translate.instant('SURVEY.ROLE_ADMIN')
    };
    return labels[role] || role;
  }
}
