import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  downloadOutline,
  documentTextOutline,
  openOutline
} from 'ionicons/icons';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

const PDF_ASSET_PATH = 'assets/docs/programa-rinomed-2026.pdf';

@Component({
  selector: 'app-programa',
  templateUrl: './programa.page.html',
  styleUrls: ['./programa.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon
  ]
})
export class ProgramaPage {
  private isNative = Capacitor.isNativePlatform();

  constructor() {
    addIcons({ downloadOutline, documentTextOutline, openOutline });
  }

  async openPdf() {
    if (this.isNative) {
      const baseUrl = window.location.origin;
      await Browser.open({ url: `${baseUrl}/${PDF_ASSET_PATH}` });
    } else {
      window.open(PDF_ASSET_PATH, '_blank');
    }
  }

  async downloadPdf() {
    if (this.isNative) {
      const baseUrl = window.location.origin;
      await Browser.open({ url: `${baseUrl}/${PDF_ASSET_PATH}` });
    } else {
      const link = document.createElement('a');
      link.href = PDF_ASSET_PATH;
      link.download = 'Programa-RINOMED-2026.pdf';
      link.click();
    }
  }
}
