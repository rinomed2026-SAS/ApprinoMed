import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonChip
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { SponsorsService } from '../services/sponsors.service';
import { Sponsor } from '../services/types';
import { ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { globeOutline, mailOutline, chatbubbleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sponsor-detail',
  templateUrl: './sponsor-detail.page.html',
  styleUrls: ['./sponsor-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonButton, IonIcon, IonBadge]
})
export class SponsorDetailPage {
  sponsor: Sponsor | null = null;
  loading = false;
  notFound = false;
  private userId = localStorage.getItem('userEmail') || 'guest@rinomed2026.com';
  private fallbackSponsors: Sponsor[] = [
    {
      id: 'sp1',
      name: 'MedTech Solutions',
      tier: 'Gold',
      description: 'Innovative endoscopic systems and surgical visualization.',
      websiteUrl: 'https://example.com',
      products: 'Endoscopic systems, Surgical instruments',
      productsList: ['Endoscopic systems', 'Surgical instruments'],
      logoUrl: 'https://images.unsplash.com/photo-1521790945508-bf2a36314e85?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'sp2',
      name: 'RinoLab Diagnostics',
      tier: 'Gold',
      description: 'Precision diagnostics for rhinology and airway care.',
      websiteUrl: 'https://example.com',
      products: 'Imaging, Diagnostics',
      productsList: ['Imaging', 'Diagnostics'],
      logoUrl: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'sp3',
      name: 'Auris Biotech',
      tier: 'Bronze',
      description: 'Biologics and implants for otology and head & neck.',
      websiteUrl: 'https://example.com',
      products: 'Implants, Biologics',
      productsList: ['Implants', 'Biologics'],
      logoUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=300&q=80'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private sponsorsService: SponsorsService,
    private toast: ToastController,
    private translate: TranslateService
  ) {
    addIcons({ globeOutline, mailOutline, chatbubbleOutline });
  }

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadSponsor(id);
  }

  loadSponsor(id: string) {
    this.loading = true;
    this.sponsorsService.get(id).subscribe({
      next: (data) => {
        if (data?.data) {
          this.sponsor = data.data;
          this.prepareProducts();
          this.notFound = false;
        } else {
          this.useFallback(id);
        }
      },
      error: () => this.useFallback(id),
      complete: () => (this.loading = false)
    });
  }

  useFallback(id: string) {
    const fallback = this.fallbackSponsors.find((sp) => sp.id === id);
    if (fallback) {
      this.sponsor = fallback;
      this.notFound = false;
    } else {
      this.sponsor = null;
      this.notFound = true;
    }
  }

  prepareProducts() {
    if (!this.sponsor) return;
    if (!this.sponsor.productsList && this.sponsor.products) {
      this.sponsor.productsList = this.sponsor.products
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
    }
  }

  visitWebsite() {
    if (!this.sponsor?.websiteUrl) return;
    window.open(this.sponsor.websiteUrl, '_blank');
  }

  requestInfo() {
    if (!this.sponsor) return;
    this.sponsorsService.createLead(this.sponsor.id, { userId: this.userId, requestedAt: new Date().toISOString() }).subscribe({
      next: async () => {
        await this.presentToast(this.translate.instant('SPONSOR_DETAIL.REQUEST_SENT'));
      },
      error: async () => {
        await this.presentToast(this.translate.instant('SPONSOR_DETAIL.REQUEST_SENT'));
      }
    });
  }

  trackByProduct(_i: number, item: string) {
    return item;
  }

  private async presentToast(message: string) {
    const t = await this.toast.create({ message, duration: 1500, position: 'bottom', cssClass: 'rinomed-toast' });
    await t.present();
  }
}
