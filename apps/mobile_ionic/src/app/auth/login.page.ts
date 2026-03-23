import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, finalize, throwError, timeout } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [CommonModule, IonContent, IonIcon, ReactiveFormsModule, RouterLink, TranslateModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class LoginPage implements OnInit {
  private formBuilder = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);

  loginForm!: FormGroup;
  isLoading = false;
  error = '';
  showPassword = false;

  // Credenciales de prueba para review en tiendas
  readonly REVIEW_EMAIL = 'review@rinomed2026.com';
  readonly REVIEW_PASSWORD = 'Rinomed2026!';

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: [
        this.REVIEW_EMAIL,
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        this.REVIEW_PASSWORD,
        [
          Validators.required,
          Validators.minLength(1)
        ]
      ]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    if (this.loginForm.invalid) {
      this.error = 'Por favor completa todos los campos correctamente';
      return;
    }

    this.isLoading = true;
    this.error = '';

    const { email, password } = this.loginForm.value;

    this.auth.login(email, password).pipe(
      timeout(12000),
      catchError((err) => {
        if (err?.name === 'TimeoutError') {
          this.error = 'No se pudo conectar con el servidor. Intenta de nuevo.';
        }
        return throwError(() => err);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: async (data) => {
        await this.auth.setTokens(data.accessToken, data.refreshToken);
        this.auth.setUser(data.user);
        
        // Toast de bienvenida
        const toast = await this.toastController.create({
          message: '¡Bienvenido a RINOMED 2026!',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        await toast.present();

        // Navegar a home
        this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
      },
      error: (err) => {
        if (!this.error) {
          this.error = 'Credenciales inválidas. Por favor intenta nuevamente.';
        }
      }
    });
  }

  async openForgotPassword() {
    const alert = await this.alertController.create({
      header: 'Recuperar contraseña',
      message: 'Si olvidaste tu contraseña, por favor contacta al equipo de soporte en support@rinomed2026.com',
      buttons: [
        {
          text: 'Copiar correo',
          handler: () => {
            // Copiar a clipboard
            navigator.clipboard.writeText('support@rinomed2026.com').then(async () => {
              const toast = await this.toastController.create({
                message: 'Correo de soporte copiado',
                duration: 1500,
                position: 'bottom'
              });
              await toast.present();
            });
          }
        },
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }
}
