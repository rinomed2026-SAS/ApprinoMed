import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonButton,
  IonInput
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  locationOutline,
  callOutline,
  globeOutline,
  timeOutline,
  informationCircleOutline,
  logoWhatsapp,
  mapOutline,
  phonePortraitOutline,
  mailOutline,
  sparklesOutline,
  personOutline,
  peopleOutline,
  cardOutline,
  closeOutline,
  chevronForwardOutline,
  documentTextOutline
} from 'ionicons/icons';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { InfoService } from '../services/info.service';
import { SessionsService } from '../services/sessions.service';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { EventInfo, Hotel, Tourism, UserProfile, Session } from '../services/types';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonButton,
    IonInput
  ]
})
export class InfoPage {
  tab = 'event';
  eventInfo: EventInfo | null = null;
  hotels: Hotel[] = [];
  tourism: Tourism[] = [];
  
  // Party registration
  showPartyModal = false;
  currentUser: UserProfile | null = null;
  partyForm = {
    participantName: '',
    companionName: ''
  };
  partyPrice = 150;
  closingEventTitle = '';
  closingEventDateTime = '';
  closingEventLocation = '';

  fallbackEventInfo: EventInfo = {
    id: 1,
    name: 'RINOMED 2026',
    city: 'Bogotá, Colombia',
    dates: '23-25 de Octubre, 2026',
    venue: 'Centro de Convenciones Andino',
    address: 'Cra. 5 #26-50',
    email: 'info@rinomed.org',
    phone: '+57 1 745 8900',
    whatsapp: '+57 310 456 7890',
    website: 'www.rinomed.org',
    mapsUrl: 'https://maps.google.com/?q=Centro+Convenciones+Andino+Bogota',
    academicHours: '48'
  };

  fallbackHotels: Hotel[] = [
    {
      id: '1',
      name: 'Hotel The Bogotá Experience',
      rating: 5,
      priceMinCop: 320000,
      priceMaxCop: 520000,
      distanceKm: 2.1,
      amenities: 'WiFi · Piscina · Spa · Restaurante',
      contact: '+57 1 745 8900',
      promoCode: 'RINOMED26-5S'
    },
    {
      id: '2',
      name: 'Hotel Entonces Bogotá',
      rating: 4,
      priceMinCop: 240000,
      priceMaxCop: 380000,
      distanceKm: 1.8,
      amenities: 'WiFi · Desayuno · Gym · Bar',
      contact: '+57 1 376 7000',
      promoCode: 'RINOMED26-4S'
    },
    {
      id: '3',
      name: 'Hotel Alcalá Suite',
      rating: 4,
      priceMinCop: 180000,
      priceMaxCop: 280000,
      distanceKm: 2.5,
      amenities: 'WiFi · Desayuno · Cocina',
      contact: '+57 1 376 5500',
      promoCode: 'RINOMED26-AC'
    },
    {
      id: '4',
      name: 'Hotel Platinium Bogotá',
      rating: 4,
      priceMinCop: 200000,
      priceMaxCop: 340000,
      distanceKm: 3.2,
      amenities: 'WiFi · Parking · Restaurante',
      contact: '+57 1 214 3000',
      promoCode: 'RINOMED26-PLT'
    }
  ];

  fallbackTourism: Tourism[] = [
    {
      id: '1',
      name: 'Monserrate',
      category: 'Patrimonio Religious',
      duration: '4 horas',
      highlights: 'Vistas panorámicas · Santuario · Transporte por cable',
      description: 'Visita el santuario a 3,152 metros de altura con vistas espectaculares de Bogotá.'
    },
    {
      id: '2',
      name: 'Museo del Oro',
      category: 'Museos & Cultura',
      duration: '3 horas',
      highlights: 'Colección de oro · Educativo · Entrada guidada',
      description: 'La colección más grande de artefactos de oro de la época prehispánica.'
    },
    {
      id: '3',
      name: 'La Candelaria',
      category: 'Tours Históricos',
      duration: '3.5 horas',
      highlights: 'Arquitectura colonial · Museos · Plaza Bolívar',
      description: 'Centro histórico de Bogotá con arquitectura colonial y sitios de interés.'
    },
    {
      id: '4',
      name: 'Zipaquirá - Catedral de Sal',
      category: 'Maravillas Naturales',
      duration: 'Día completo',
      highlights: 'Catedral subterránea · Mina de sal · Peregrinación',
      description: 'Impresionante catedral tallada dentro de una mina de sal, a 50 km de Bogotá.'
    },
    {
      id: '5',
      name: 'Usaquén',
      category: 'Barrios & Vida Nocturna',
      duration: '4 horas',
      highlights: 'Vida artística · Feria dominical · Gastronomía',
      description: 'Barrio bohemio con galerías de arte, tiendas y excelentes restaurantes.'
    },
    {
      id: '6',
      name: 'La Laguna de Iguaque',
      category: 'Ecoturismo',
      duration: 'Día completo',
      highlights: 'Senderismo · Laguna alpina · Flora & Fauna',
      description: 'Reserva natural con laguna sagrada y ecosistema de páramo a 2 horas de Bogotá.'
    }
  ];

  constructor(
    private infoService: InfoService,
    private sessionsService: SessionsService,
    private storage: StorageService,
    private authService: AuthService,
    private ngZone: NgZone,
    private toastController: ToastController,
    private router: Router
  ) {
    addIcons({
      'location-outline': locationOutline,
      'call-outline': callOutline,
      'globe-outline': globeOutline,
      'time-outline': timeOutline,
      'information-circle-outline': informationCircleOutline,
      'logo-whatsapp': logoWhatsapp,
      'map-outline': mapOutline,
      'phone-portrait-outline': phonePortraitOutline,
      'mail-outline': mailOutline,
      'sparkles-outline': sparklesOutline,
      'person-outline': personOutline,
      'people-outline': peopleOutline,
      'card-outline': cardOutline,
      'close-outline': closeOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'document-text-outline': documentTextOutline
    });
    
    // Subscribe to current user
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.partyForm.participantName = user.name;
      }
    });
  }

  ionViewWillEnter() {
    this.load();
  }

  async load() {
    this.infoService.eventInfo().subscribe({
      next: async (data) => {
        this.eventInfo = data.data;
        await this.storage.set('event-info', data.data);
      },
      error: async () => {
        const stored = await this.storage.get<EventInfo>('event-info');
        this.eventInfo = stored || this.fallbackEventInfo;
      }
    });

    this.infoService.hotels().subscribe({
      next: async (data) => {
        this.hotels = data.data;
        await this.storage.set('hotels', this.hotels);
      },
      error: async () => {
        const stored = await this.storage.get<Hotel[]>('hotels');
        this.hotels = stored || this.fallbackHotels;
      }
    });

    this.infoService.tourism().subscribe({
      next: async (data) => {
        this.tourism = data.data;
        await this.storage.set('tourism', this.tourism);
      },
      error: async () => {
        const stored = await this.storage.get<Tourism[]>('tourism');
        this.tourism = stored || this.fallbackTourism;
      }
    });

    this.loadClosingEventFromAgendaDay2();
  }

  private loadClosingEventFromAgendaDay2() {
    this.sessionsService.list('2026-04-18', undefined, 1, 50).subscribe({
      next: (response) => {
        const sessions = response.data || [];
        const closing =
          sessions.find((session) => this.isClosingSession(session)) ||
          sessions[sessions.length - 1];

        if (!closing) return;

        this.closingEventTitle = closing.title || '';
        this.closingEventDateTime = `${this.formatSessionDay(closing.day)} · ${closing.startTime} - ${closing.endTime}`;
        this.closingEventLocation = closing.room || '';
      },
      error: () => {
      }
    });
  }

  private formatSessionDay(day: string): string {
    const datePart = day.split('T')[0];
    const parsed = new Date(`${datePart}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return datePart;
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(parsed);
  }

  private isClosingSession(session: Session): boolean {
    const text = `${session.title || ''} ${session.topic || ''} ${session.description || ''}`.toLowerCase();
    return text.includes('cierre') || text.includes('closing') || text.includes('clausura');
  }

  setTab(value?: string | number | null) {
    if (value === null || value === undefined) return;
    this.tab = String(value);
  }

  private extractQuery(url?: string): string {
    if (!url) return 'Centro Convenciones Andino Bogota';
    try {
      const match = url.match(/[?&]q=([^&]+)/);
      if (match) return decodeURIComponent(match[1].replace(/\+/g, ' '));
    } catch { /* ignore */ }
    return 'Centro Convenciones Andino Bogota';
  }

  async openAppleMaps(url?: string) {
    const query = this.extractQuery(url);
    const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(query)}`;
    try {
      await Browser.open({ url: appleMapsUrl });
    } catch (e) {
      console.error('openAppleMaps error', e);
      window.open(appleMapsUrl, '_blank');
    }
  }

  async openGoogleMaps(url?: string) {
    const query = this.extractQuery(url);
    const googleUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    try {
      await Browser.open({ url: googleUrl });
    } catch (e) {
      console.error('openGoogleMaps error', e);
      window.open(googleUrl, '_blank');
    }
  }

  openPrograma() {
    this.router.navigate(['/tabs/programa']);
  }

  async openWebsite(url?: string) {
    if (!url) return;
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    try {
      await Browser.open({ url: fullUrl });
    } catch {
      window.open(fullUrl, '_blank');
    }
  }

  async openWhatsApp(phone?: string) {
    if (!phone) return;
    const digits = phone.replace(/\D/g, '');
    const waUrl = `https://wa.me/${digits}`;
    try {
      await Browser.open({ url: waUrl });
    } catch {
      window.open(waUrl, '_blank');
    }
  }

  callPhone(phone?: string) {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  }

  formatPrice(price?: number): string {
    if (!price) return '—';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  renderRating(rating?: number): string {
    if (!rating) return '—';
    const full = Math.floor(rating);
    const partial = rating % 1 > 0.5;
    const empty = 5 - full - (partial ? 1 : 0);
    return '★'.repeat(full) + (partial ? '½' : '') + '☆'.repeat(empty);
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

  // Party registration methods
  openPartyRegistration() {
    if (this.currentUser) {
      this.partyForm.participantName = this.currentUser.name;
    }
    this.showPartyModal = true;
  }

  closePartyModal() {
    this.showPartyModal = false;
  }

  proceedToPayment() {
    if (!this.partyForm.participantName) {
      this.showToast('Por favor ingresa el nombre del participante');
      return;
    }
    // Open payment URL
    window.open('https://rinomedellin.com', '_blank');
    this.showPartyModal = false;
    this.showToast('Redirigiendo al portal de pago...');
  }

  trackByHotel(index: number, hotel: Hotel): string {
    return hotel.id || `hotel-${index}`;
  }

  trackByActivity(index: number, activity: Tourism): string {
    return activity.id || `activity-${index}`;
  }
}
