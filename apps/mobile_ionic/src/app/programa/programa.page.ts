import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Platform } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  downloadOutline,
  shareOutline,
  documentTextOutline,
  openOutline
} from 'ionicons/icons';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const PDF_ASSET_PATH = 'assets/docs/programa-rinomed-2026.pdf';

@Component({
  selector: 'app-programa',
  templateUrl: './programa.page.html',
  styleUrls: ['./programa.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonSpinner
  ]
})
export class ProgramaPage implements OnInit {
  pdfUrl: SafeResourceUrl | null = null;
  isLoading = true;
  isNative = false;
  pdfError = false;

  constructor(
    private sanitizer: DomSanitizer,
    private platform: Platform,
    private translate: TranslateService
  ) {
    addIcons({ downloadOutline, shareOutline, documentTextOutline, openOutline });
    this.isNative = Capacitor.isNativePlatform();
  }

  ngOnInit() {
    // On web/PWA we can embed PDF in an iframe
    // On native (iOS/Android) we'll show a card with open/download buttons
    if (!this.isNative) {
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(PDF_ASSET_PATH);
    }
    this.isLoading = false;
  }

  async openPdf() {
    if (this.isNative) {
      // On native, use Capacitor Browser to open the PDF
      // The PDF is served from the webview's local assets
      const baseUrl = window.location.origin;
      await Browser.open({ url: `${baseUrl}/${PDF_ASSET_PATH}` });
    } else {
      // On web, open in new tab
      window.open(PDF_ASSET_PATH, '_blank');
    }
  }

  async downloadPdf() {
    if (this.isNative) {
      // On native, open in external browser which allows saving
      const baseUrl = window.location.origin;
      await Browser.open({ url: `${baseUrl}/${PDF_ASSET_PATH}` });
    } else {
      // On web, trigger download
      const link = document.createElement('a');
      link.href = PDF_ASSET_PATH;
      link.download = 'Programa-RINOMED-2026.pdf';
      link.click();
    }
  }

  onPdfLoad() {
    this.isLoading = false;
  }

  onPdfError() {
    this.isLoading = false;
    this.pdfError = true;
  }
}
