import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBadge,
  IonIcon
} from '@ionic/angular/standalone';
import { SponsorsService } from '../services/sponsors.service';
import { Sponsor } from '../services/types';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.page.html',
  styleUrls: ['./sponsors.page.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, IonHeader, IonToolbar, IonTitle, IonContent, IonBadge, IonIcon]
})
export class SponsorsPage {
  groups: { tier: string; sponsors: Sponsor[] }[] = [];
  loading = false;
  notFound = false;
  private fallbackSponsors: Sponsor[] = [
    {
      id: 'sp1',
      name: 'MedTech Solutions',
      tier: 'Gold',
      description: 'Innovative endoscopic systems and surgical visualization.',
      websiteUrl: 'https://example.com',
      products: 'Endoscopic systems, Surgical instruments',
      logoUrl: 'https://images.unsplash.com/photo-1521790945508-bf2a36314e85?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'sp2',
      name: 'RinoLab Diagnostics',
      tier: 'Gold',
      description: 'Precision diagnostics for rhinology and airway care.',
      websiteUrl: 'https://example.com',
      products: 'Imaging, Diagnostics',
      logoUrl: 'https://images.unsplash.com/photo-1508387024700-9fe5c0b37f81?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'sp3',
      name: 'Auris Biotech',
      tier: 'Bronze',
      description: 'Biologics and implants for otology and head & neck.',
      websiteUrl: 'https://example.com',
      products: 'Implants, Biologics',
      logoUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'sp4',
      name: 'Nova Instruments',
      tier: 'Bronze',
      description: 'Ergonomic surgical tools and OR integration.',
      websiteUrl: 'https://example.com',
      products: 'Surgical tools, OR integration',
      logoUrl: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=300&q=80'
    }
  ];

  constructor(private sponsorsService: SponsorsService, private router: Router, private translate: TranslateService) {
    addIcons({ chevronForwardOutline });
  }

  ionViewWillEnter() {
    this.loadSponsors();
  }

  loadSponsors() {
    this.loading = true;
    this.sponsorsService.list().subscribe({
      next: (data) => {
        const sponsors = data.data?.length ? data.data : this.fallbackSponsors;
        this.groupByTier(sponsors);
      },
      error: () => {
        this.groupByTier(this.fallbackSponsors);
      },
      complete: () => (this.loading = false)
    });
  }

  groupByTier(list: Sponsor[]) {
    const order = (tier: string) => (tier?.toLowerCase() === 'gold' ? 1 : 2);
    const map = new Map<string, Sponsor[]>();
    list.forEach((s) => {
      const key = s.tier || 'Other';
      const arr = map.get(key) || [];
      arr.push(s);
      map.set(key, arr);
    });
    const grouped = Array.from(map.entries())
      .sort((a, b) => order(a[0]) - order(b[0]))
      .map(([tier, sponsors]) => ({ tier: tier.toUpperCase(), sponsors }));
    this.groups = grouped;
    this.notFound = grouped.length === 0;
  }

  trackByTier(_i: number, group: { tier: string }) {
    return group.tier;
  }

  trackBySponsor(_i: number, sp: Sponsor) {
    return sp.id;
  }

  openSponsor(sp: Sponsor) {
    this.router.navigate(['/tabs/sponsors', sp.id]);
  }
}
