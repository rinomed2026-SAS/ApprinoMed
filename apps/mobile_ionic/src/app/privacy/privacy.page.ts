import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonIcon
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { shieldCheckmarkOutline, documentTextOutline } from 'ionicons/icons';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton, IonIcon
  ]
})
export class PrivacyPage {
  activeTab: 'privacy' | 'terms' = 'privacy';

  constructor() {
    addIcons({ shieldCheckmarkOutline, documentTextOutline });
  }
}
