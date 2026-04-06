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
  IonList,
  IonItem,
  IonLabel,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personCircleOutline,
  documentTextOutline,
  informationCircleOutline,
  logOutOutline,
  checkmarkCircleOutline,
  chevronForwardOutline,
  globeOutline
} from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { UserProfile } from '../services/types';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { FavoritesService } from '../services/favorites.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
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
    IonList,
    IonItem,
    IonLabel,
          RouterLink,
          TranslateModule
  ]
})
export class ProfilePage {
  profile: UserProfile | null = null;
  isLoading = true;
  stats = {
    favorites: 0,
    questions: 0,
    certificateAvailable: false
  };

  // Fallback profile data
  fallbackProfile: UserProfile = {
    id: 'user-001',
    name: 'Dr. Guest User',
    email: 'guest@rinomed2026.com',
    role: 'ASSISTANT',
    stats: {
      favorites: 5,
      questions: 2,
      certificateAvailable: true
    }
  };


  constructor(
    private auth: AuthService,
    private storage: StorageService,
    private favoritesService: FavoritesService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
        private ngZone: NgZone,
        public languageService: LanguageService
  ) {
    addIcons({
      personCircleOutline,
      documentTextOutline,
      informationCircleOutline,
      logOutOutline,
      checkmarkCircleOutline,
      chevronForwardOutline,
      globeOutline
    });
  }

  ionViewWillEnter() {
    this.loadProfileData();
  }

  async loadProfileData() {
    this.isLoading = true;

    try {
      this.auth.loadProfile().subscribe({
        next: (data) => {
          this.profile = data;
          this.stats = {
            favorites: data.stats?.favorites || 0,
            questions: data.stats?.questions || 0,
            certificateAvailable: data.stats?.certificateAvailable || false
          };
          this.isLoading = false;
        },
        error: async (err) => {
          this.profile = this.fallbackProfile;
          this.stats = this.fallbackProfile.stats;
          this.isLoading = false;
        }
      });
    } catch (error) {
      this.profile = this.fallbackProfile;
      this.stats = this.fallbackProfile.stats;
      this.isLoading = false;
    }
  }

  getRoleLabel(role: string): string {
    const roleMap: { [key: string]: string } = {
      ASSISTANT: 'Attendee',
      PROFESSOR: 'Speaker',
      STAFF: 'Staff',
      ADMIN: 'Admin'
    };
    return roleMap[role] || role;
  }

  getAvatarInitial(): string {
    return this.profile?.name?.charAt(0).toUpperCase() || 'U';
  }

  getRoleColor(role: string): string {
    const colorMap: { [key: string]: string } = {
      ASSISTANT: '#8a4a8a',
      PROFESSOR: '#c07ab8',
      STAFF: '#a86ba8',
      ADMIN: '#d8a3d8'
    };
    return colorMap[role] || '#c07ab8';
  }

  viewCertificate() {
    this.router.navigate(['/tabs/certificate']);
  }

  openPrivacy() {
    this.router.navigate(['/tabs/privacy']);
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to exit?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Logout',
          role: 'destructive',
          handler: async () => {
            await this.performLogout();
          }
        }
      ]
    });

    await alert.present();
  }

  private async performLogout() {
    try {
      const refreshToken = await this.auth.getRefreshToken();
      if (refreshToken) {
        this.auth.logout(refreshToken).subscribe({
          error: () => {
            this.completeLogout();
          },
          complete: () => {
            this.completeLogout();
          }
        });
      } else {
        this.completeLogout();
      }
    } catch (error) {
      this.completeLogout();
    }
  }

  private async completeLogout() {
    await this.auth.clearTokens();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

    async changeLanguage() {
      const alert = await this.alertController.create({
        header: 'Seleccionar Idioma / Select Language',
        cssClass: 'language-alert',
        inputs: this.languageService.availableLanguages.map(lang => ({
          type: 'radio' as const,
          label: `${lang.flag}  ${lang.name}`,
          value: lang.code,
          checked: lang.code === this.languageService.getCurrentLanguage(),
          cssClass: 'language-radio-option'
        })),
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'OK',
            handler: async (langCode: string) => {
              if (langCode) {
                await this.languageService.setLanguage(langCode);
                const selected = this.languageService.availableLanguages.find(l => l.code === langCode);
                const toast = await this.toastController.create({
                  message: `${selected?.flag ?? ''} ${selected?.name ?? langCode}`,
                  duration: 2000,
                  position: 'bottom',
                  color: 'success'
                });
                await toast.present();
              }
            }
          }
        ]
      });
      await alert.present();
    }
}
