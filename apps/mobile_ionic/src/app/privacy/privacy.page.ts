import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton]
})
export class PrivacyPage {
  url = `${environment.apiBaseUrl}/privacy`;

  open() {
    window.open(this.url, '_blank');
  }
}
