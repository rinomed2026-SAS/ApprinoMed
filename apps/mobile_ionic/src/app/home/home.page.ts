import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon, ToastController, AlertController, ViewWillEnter } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { StatisticsService, Statistics } from '../services/statistics.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    TranslateModule
  ],
  standalone: true
})
export class HomePage implements OnInit, ViewWillEnter {
  activeTab: string = 'sessions';

  statistics: Statistics = {
    totalSessions: 0,
    favoriteCount: 0,
    questionCount: 0
  };

  userName: string = 'Asistente';

  constructor(
    private router: Router,
    private auth: AuthService,
    private statisticsService: StatisticsService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  /** Refresh stats every time the user navigates to the home tab */
  ionViewWillEnter() {
    this.loadStatistics();
  }

  /**
   * Carga datos del usuario autenticado
   */
  private loadUserData() {
    // Cargar perfil del usuario desde la API
    this.auth.user$.subscribe(user => {
      if (user) {
        this.userName = user.name;
      }
    });

    // Cargar perfil si no está disponible
    this.auth.loadProfile().subscribe({
      next: (user) => {
        this.auth.setUser(user);
        this.userName = user.name;
      },
      error: () => {
        // Si falla, usar el nombre de localStorage como fallback
        this.userName = localStorage.getItem('userName') || 'Asistente';
      }
    });

    this.loadStatistics();
  }

  /**
   * Carga estadísticas del usuario desde la API
   */
  private loadStatistics() {
    this.statisticsService.get().subscribe({
      next: (response) => {
        this.statistics = response.data;
      },
      error: async (error) => {
        const toast = await this.toastController.create({
          message: 'Error loading statistics',
          duration: 2000,
          position: 'bottom',
          cssClass: 'rinomed-toast'
        });
        await toast.present();
      }
    });
  }

  /**
   * Obtiene la inicial del usuario para avatar
   */
  getUserInitial(): string {
    const name = localStorage.getItem('userName') || 'U';
    return name.charAt(0).toUpperCase();
  }

  /**
   * Navega a perfil del usuario
   */
  navigateToProfile() {
    this.router.navigate(['/tabs/profile']);
  }

  /**
   * Navega a una sección dentro de tabs (mantiene la barra inferior visible)
   */
  navigateTab(segment: string) {
    this.router.navigate([`/tabs/${segment}`]);
  }

  /**
   * Muestra certificado del usuario
   */
  viewCertificate() {
    this.router.navigate(['/tabs/certificate']);
  }
}
