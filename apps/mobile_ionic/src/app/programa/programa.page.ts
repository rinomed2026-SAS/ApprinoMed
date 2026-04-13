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
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { ToastController } from '@ionic/angular';

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
  opening = false;

  constructor(private toastCtrl: ToastController) {
    addIcons({ downloadOutline, documentTextOutline, openOutline });
  }

  async openPdf() {
    if (this.opening) return;
    this.opening = true;
    try {
      if (this.isNative) {
        // En iOS nativo, construir la URL completa del servidor Capacitor
        // y abrirla en el in-app browser que SÍ puede renderizar PDFs
        const serverUrl = Capacitor.convertFileSrc('');
        // convertFileSrc devuelve algo como 'capacitor://localhost/'
        // Construimos la URL completa al asset
        const fullUrl = `${window.location.origin}/${PDF_ASSET_PATH}`;
        await Browser.open({ url: fullUrl });
      } else {
        window.open(PDF_ASSET_PATH, '_blank');
      }
    } catch (err) {
      console.error('openPdf error', err);
      const toast = await this.toastCtrl.create({
        message: 'No se pudo abrir el programa. Intenta descargarlo.',
        duration: 2500,
        position: 'bottom'
      });
      await toast.present();
    } finally {
      this.opening = false;
    }
  }

  async downloadPdf() {
    if (this.opening) return;
    this.opening = true;
    try {
      if (this.isNative) {
        // En iOS nativo, intentar Web Share API para compartir/guardar el PDF
        try {
          const resp = await fetch(PDF_ASSET_PATH);
          if (!resp.ok) throw new Error('fetch failed');
          const blob = await resp.blob();
          const file = new File([blob], 'Programa-RINOMED-2026.pdf', { type: 'application/pdf' });
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: 'Programa RINOMED 2026' });
            return;
          }
        } catch { /* share not available, fallback */ }

        // Fallback: abrir en in-app browser (muestra el PDF con opción de compartir)
        const fullUrl = `${window.location.origin}/${PDF_ASSET_PATH}`;
        await Browser.open({ url: fullUrl });
      } else {
        const link = document.createElement('a');
        link.href = PDF_ASSET_PATH;
        link.download = 'Programa-RINOMED-2026.pdf';
        link.click();
      }
    } catch (err) {
      console.error('downloadPdf error', err);
      const toast = await this.toastCtrl.create({
        message: 'No se pudo descargar el programa.',
        duration: 2500,
        position: 'bottom'
      });
      await toast.present();
    } finally {
      this.opening = false;
    }
  }
}
