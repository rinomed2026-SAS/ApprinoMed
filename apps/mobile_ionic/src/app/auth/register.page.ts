import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonButton
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonLabel, IonButton, FormsModule, RouterLink]
})
export class RegisterPage {
  name = '';
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.error = '';
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: async (data) => {
        await this.auth.setTokens(data.accessToken, data.refreshToken);
        this.router.navigateByUrl('/tabs/home');
      },
      error: () => {
        this.error = 'No se pudo registrar';
      }
    });
  }
}
