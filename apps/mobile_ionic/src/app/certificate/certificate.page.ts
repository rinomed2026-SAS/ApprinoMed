import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, checkmarkCircleOutline, downloadOutline, refreshOutline, informationCircleOutline } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { CertificateService } from '../services/certificate.service';
import { StorageService } from '../services/storage.service';
import { Certificate } from '../services/types';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.page.html',
  styleUrls: ['./certificate.page.scss'],
  imports: [
    CommonModule,
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
    IonSpinner
  ]
})
export class CertificatePage {
  certificate: Certificate | null = null;
  isLoading = true;
  isDownloading = false;
  hasError = false;
  errorMessage = '';
  userName = 'Guest';

  // Fallback certificate data for offline/demo mode
  fallbackCertificate: Certificate = {
    id: '1',
    userId: 'user-001',
    certificateId: 'DEMO-2026-XXXX',
    userName: 'Demo User (Awaiting Certificate Generation)',
    eventName: 'International Congress of Rhinology and Otolaryngology',
    eventDates: 'April 17–18, 2026',
    academicHours: 20,
    issuedAt: new Date().toISOString()
  };

  constructor(
    private authService: AuthService,
    private certificateService: CertificateService,
    private storage: StorageService,
    private ngZone: NgZone,
    private toastController: ToastController
  ) {
    addIcons({
      documentTextOutline,
      checkmarkCircleOutline,
      downloadOutline,
      refreshOutline,
      informationCircleOutline
    });
  }

  ionViewWillEnter() {
    this.loadCertificate();
  }

  async loadCertificate() {
    this.isLoading = true;
    this.hasError = false;

    try {
      // Get user name from auth
      const accessToken = await this.authService.getAccessToken();
      if (accessToken) {
        this.authService.loadProfile().subscribe({
          next: (user) => {
            this.userName = user.name || 'Guest';
          },
          error: () => {
            this.userName = 'Guest';
          }
        });
      }

      // Try to load certificate with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );

      this.certificateService.getCertificate().toPromise().then(
        async (response: any) => {
          if (response?.data) {
            this.certificate = response.data;
            if (this.certificate) {
              this.certificate.userName = this.userName;
            }
            await this.certificateService.cacheCertificate(response.data);
          } else {
            throw new Error('No data');
          }
          this.isLoading = false;
        },
        async (err) => {
          // Try to load from cache
          const cached = await this.certificateService.getCachedCertificate();
          if (cached) {
            this.certificate = cached;
            this.certificate.userName = this.userName;
          } else {
            // Use fallback
            this.certificate = { ...this.fallbackCertificate };
            this.certificate.userName = this.userName;
          }
          this.isLoading = false;
          this.hasError = false;
        }
      );
    } catch (error) {
      // Use fallback on error
      this.certificate = { ...this.fallbackCertificate };
      this.certificate.userName = this.userName;
      this.isLoading = false;
      this.hasError = false;
    }

    // Ensure loading state ends after 6 seconds max
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
            this.showToast('Certificate downloaded successfully');
          });
        },
        error: (err) => {
          this.isDownloading = false;
          this.showToast('Failed to download certificate. Please try again.');
        }
      });
    } catch (error) {
      this.isDownloading = false;
      this.showToast('Failed to download certificate');
    }
  }

  async retry() {
    this.loadCertificate();
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
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }
}
