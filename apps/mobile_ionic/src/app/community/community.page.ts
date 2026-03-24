import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { CommunityService } from './community.service';
import { CommunityGalleryItem } from './community.types';

/** Caption oficial para Instagram */
const INSTAGRAM_CAPTION = `Hago parte de la comunidad RINOMED 💙
Compartiendo conocimiento, experiencia y actualización médica.
#RINOMED #ComunidadRINOMED #Medicina #Otorrinolaringología`;

/** Tamaño máximo permitido: 8 MB */
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

/** Dimensiones del canvas de composición (formato vertical Instagram 4:5) */
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1350;

type PageView = 'hero' | 'upload' | 'preview' | 'gallery';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonSpinner,
  ],
})
export class CommunityPage implements OnInit {
  @ViewChild('compositionCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  currentView: PageView = 'hero';

  // Estado de la imagen del usuario
  selectedFile: File | null = null;
  previewDataUrl: string | null = null;
  uploadError: string | null = null;

  // Estado de composición
  composedDataUrl: string | null = null;
  isComposing = false;

  // Estado de formulario / envío
  allowGallery = false;
  isSending = false;
  sendSuccess = false;
  sendError: string | null = null;
  userName = 'Asistente';

  // Galería
  galleryItems: CommunityGalleryItem[] = [];
  isLoadingGallery = false;
  galleryError: string | null = null;

  readonly caption = INSTAGRAM_CAPTION;

  constructor(
    private router: Router,
    private auth: AuthService,
    private communityService: CommunityService,
    private ngZone: NgZone,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      if (user) this.userName = user.name;
    });
    this.auth.loadProfile().subscribe({
      next: (user) => {
        this.auth.setUser(user);
        this.userName = user.name;
      },
      error: () => {
        this.userName = localStorage.getItem('userName') || 'Asistente';
      },
    });
  }

  // ─────────────────────────────────────────────
  // NAVEGACIÓN INTERNA
  // ─────────────────────────────────────────────

  goTo(view: PageView) {
    this.currentView = view;
    if (view === 'gallery') this.loadGallery();
  }

  goBack() {
    if (this.currentView === 'preview') {
      this.currentView = 'upload';
    } else if (this.currentView === 'upload' || this.currentView === 'gallery') {
      this.currentView = 'hero';
    } else {
      this.router.navigate(['/tabs/home']);
    }
  }

  // ─────────────────────────────────────────────
  // SUBIDA DE IMAGEN
  // ─────────────────────────────────────────────

  triggerFileInput() {
    this.fileInputRef.nativeElement.click();
  }

  onFileSelected(event: Event) {
    this.uploadError = null;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validación de tipo
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.uploadError = 'Solo se permiten imágenes JPG, PNG o WebP.';
      return;
    }

    // Validación de tamaño
    if (file.size > MAX_FILE_SIZE_BYTES) {
      this.uploadError = 'La imagen no debe superar 8 MB.';
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.ngZone.run(() => {
        this.previewDataUrl = e.target?.result as string;
        this.composedDataUrl = null; // resetear composición anterior
      });
    };
    reader.readAsDataURL(file);
  }

  proceedToPreview() {
    if (!this.previewDataUrl) return;
    this.currentView = 'preview';
    // Esperar al siguiente ciclo para que el canvas esté en el DOM
    setTimeout(() => this.buildComposition(), 80);
  }

  // ─────────────────────────────────────────────
  // COMPOSICIÓN CON CANVAS
  // ─────────────────────────────────────────────

  /**
   * Dibuja la imagen del usuario + marco + overlay de marca RINOMED sobre un canvas.
   * Produce un data URL de la imagen final lista para descargar o enviar.
   */
  async buildComposition() {
    if (!this.previewDataUrl || !this.canvasRef) return;

    this.isComposing = true;

    try {
      const canvas = this.canvasRef.nativeElement;
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      const ctx = canvas.getContext('2d')!;

      // 1. Cargar imagen del usuario
      const userImg = await this.loadImage(this.previewDataUrl);

      // 2. Fondo oscuro premium
      ctx.fillStyle = '#0F0F12';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 3. Foto del usuario: crop centrado (cover), con margen para el marco
      const margin = 60;
      const photoArea = {
        x: margin,
        y: margin,
        w: CANVAS_WIDTH - margin * 2,
        h: CANVAS_HEIGHT - 320, // espacio inferior para texto/logo
      };
      this.drawCoverImage(ctx, userImg, photoArea.x, photoArea.y, photoArea.w, photoArea.h);

      // 4. Degradado inferior sobre la foto (para legibilidad del texto)
      const grad = ctx.createLinearGradient(0, photoArea.y + photoArea.h * 0.55, 0, photoArea.y + photoArea.h);
      grad.addColorStop(0, 'rgba(15,15,18,0)');
      grad.addColorStop(1, 'rgba(15,15,18,0.92)');
      ctx.fillStyle = grad;
      ctx.fillRect(photoArea.x, photoArea.y + photoArea.h * 0.55, photoArea.w, photoArea.h * 0.45);

      // 5. Marco magenta RINOMED alrededor de la foto
      const borderW = 5;
      ctx.strokeStyle = '#C07AB8';
      ctx.lineWidth = borderW;
      this.roundRect(ctx, photoArea.x - borderW / 2, photoArea.y - borderW / 2, photoArea.w + borderW, photoArea.h + borderW, 20);
      ctx.stroke();

      // 6. Esquinas decorativas
      this.drawCornerAccents(ctx, photoArea.x, photoArea.y, photoArea.w, photoArea.h);

      // 7. Banda inferior con branding
      const bandY = photoArea.y + photoArea.h + 16;
      const bandH = CANVAS_HEIGHT - bandY - margin;

      // Fondo sutil de la banda
      ctx.fillStyle = 'rgba(192,122,184,0.06)';
      this.roundRect(ctx, margin, bandY, CANVAS_WIDTH - margin * 2, bandH, 16);
      ctx.fill();

      // Borde superior de banda en magenta
      ctx.strokeStyle = 'rgba(192,122,184,0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(margin + 20, bandY);
      ctx.lineTo(CANVAS_WIDTH - margin - 20, bandY);
      ctx.stroke();

      // 8. Texto: "Soy parte de la comunidad RINOMED"
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `600 ${48}px "Poppins", "Inter", sans-serif`;
      ctx.fillText('Soy parte de la comunidad', CANVAS_WIDTH / 2, bandY + 68);

      // Texto "RINOMED" en magenta destacado
      ctx.fillStyle = '#C07AB8';
      ctx.font = `800 ${56}px "Poppins", "Inter", sans-serif`;
      ctx.fillText('RINOMED', CANVAS_WIDTH / 2, bandY + 134);

      // 9. Año/evento
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = `400 ${30}px "Inter", sans-serif`;
      ctx.fillText('RINOMED 2026 · Comunidad Médica', CANVAS_WIDTH / 2, bandY + 185);

      // 10. Puntos decorativos
      this.drawDots(ctx, margin + 40, bandY + bandH / 2);
      this.drawDots(ctx, CANVAS_WIDTH - margin - 40, bandY + bandH / 2);

      this.composedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    } catch (err) {
      console.error('Error building composition:', err);
      this.showToast('Error al generar la vista previa. Intenta de nuevo.');
    } finally {
      this.isComposing = false;
    }
  }

  /** Carga una imagen desde una data URL y devuelve HTMLImageElement */
  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  /** Dibuja una imagen en modo "cover" (centrado, recortado) */
  private drawCoverImage(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    const imgRatio = img.width / img.height;
    const areaRatio = w / h;

    let sx = 0, sy = 0, sw = img.width, sh = img.height;

    if (imgRatio > areaRatio) {
      sw = img.height * areaRatio;
      sx = (img.width - sw) / 2;
    } else {
      sh = img.width / areaRatio;
      sy = (img.height - sh) / 2;
    }

    // Clip redondeado para la foto
    ctx.save();
    this.roundRect(ctx, x, y, w, h, 18);
    ctx.clip();
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
    ctx.restore();
  }

  /** Dibuja un rectángulo con esquinas redondeadas como path */
  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /** Esquinas decorativas tipo bracket en las 4 esquinas de la foto */
  private drawCornerAccents(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number
  ) {
    const len = 36;
    const offset = 12;
    ctx.strokeStyle = '#E0C4D8';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    const corners: [number, number, number, number][] = [
      [x - offset, y - offset, 1, 1],
      [x + w + offset, y - offset, -1, 1],
      [x - offset, y + h + offset, 1, -1],
      [x + w + offset, y + h + offset, -1, -1],
    ];

    for (const [cx, cy, dx, dy] of corners) {
      ctx.beginPath();
      ctx.moveTo(cx, cy + dy * len);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + dx * len, cy);
      ctx.stroke();
    }
  }

  /** Tres puntos decorativos */
  private drawDots(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const colors = ['#C07AB8', 'rgba(192,122,184,0.5)', 'rgba(192,122,184,0.25)'];
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(x, y + i * 14 - 14, 4, 0, Math.PI * 2);
      ctx.fillStyle = colors[i];
      ctx.fill();
    }
  }

  // ─────────────────────────────────────────────
  // ACCIONES
  // ─────────────────────────────────────────────

  downloadComposed() {
    if (!this.composedDataUrl) return;
    const link = document.createElement('a');
    link.href = this.composedDataUrl;
    link.download = 'ComunidadRINOMED-2026.jpg';
    link.click();
    this.showToast('¡Imagen descargada!');
  }

  async copyCaption() {
    try {
      await navigator.clipboard.writeText(this.caption);
      this.showToast('Caption copiado al portapapeles 📋');
    } catch {
      // Fallback para contextos sin Clipboard API
      const ta = document.createElement('textarea');
      ta.value = this.caption;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this.showToast('Caption copiado al portapapeles 📋');
    }
  }

  openInstagram() {
    // Intenta abrir la app; si falla, abre la web
    window.open('instagram://camera', '_blank');
    setTimeout(() => {
      window.open('https://www.instagram.com', '_blank');
    }, 500);
  }

  // ─────────────────────────────────────────────
  // ENVÍO A BACKEND
  // ─────────────────────────────────────────────

  async submitToGallery() {
    if (!this.previewDataUrl) return;

    this.isSending = true;
    this.sendError = null;

    // Usamos el data URL de la imagen original y compuesta como "URLs"
    // En una fase 2 se subirían a un CDN y aquí irían los URLs reales.
    this.communityService.submit({
      userName: this.userName,
      originalImageUrl: this.previewDataUrl,
      composedImageUrl: this.composedDataUrl ?? undefined,
      allowGallery: this.allowGallery,
    }).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.isSending = false;
          this.sendSuccess = true;
          this.showToast('¡Tu imagen fue enviada exitosamente! 🎉');
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.isSending = false;
          this.sendError = 'No se pudo enviar la imagen. Intenta de nuevo.';
        });
      },
    });
  }

  // ─────────────────────────────────────────────
  // GALERÍA
  // ─────────────────────────────────────────────

  loadGallery() {
    this.isLoadingGallery = true;
    this.galleryError = null;
    this.communityService.getGallery().subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.galleryItems = res.data;
          this.isLoadingGallery = false;
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.galleryItems = [];
          this.galleryError = 'No se pudo cargar la galería.';
          this.isLoadingGallery = false;
        });
      },
    });
  }

  // ─────────────────────────────────────────────
  // UTILIDADES
  // ─────────────────────────────────────────────

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
      cssClass: 'community-toast',
    });
    toast.present();
  }

  resetFlow() {
    this.selectedFile = null;
    this.previewDataUrl = null;
    this.composedDataUrl = null;
    this.uploadError = null;
    this.allowGallery = false;
    this.sendSuccess = false;
    this.sendError = null;
    this.currentView = 'hero';
  }
}
