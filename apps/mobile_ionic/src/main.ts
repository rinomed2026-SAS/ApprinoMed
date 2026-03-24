import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  calendarOutline,
  peopleOutline,
  starOutline,
  documentTextOutline,
  briefcaseOutline,
  informationCircleOutline,
  personCircleOutline,
  locationOutline,
  globeOutline,
  // Comunidad RINOMED
  peopleCircleOutline,
  cloudUploadOutline,
  downloadOutline,
  copyOutline,
  logoInstagram,
  imagesOutline,
  checkmarkCircleOutline,
  arrowBackOutline,
  personOutline,
  refreshOutline,
  arrowForward,
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { authInterceptor } from './app/interceptors/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'es'
      })
    ),
    provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json'
    })
  ],
});

addIcons({
  'home-outline': homeOutline,
  'calendar-outline': calendarOutline,
  'people-outline': peopleOutline,
  'star-outline': starOutline,
  'document-text-outline': documentTextOutline,
  'briefcase-outline': briefcaseOutline,
  'information-circle-outline': informationCircleOutline,
  'person-circle-outline': personCircleOutline,
  'location-outline': locationOutline,
  'globe-outline': globeOutline,
  // Comunidad RINOMED
  'people-circle-outline': peopleCircleOutline,
  'cloud-upload-outline': cloudUploadOutline,
  'download-outline': downloadOutline,
  'copy-outline': copyOutline,
  'logo-instagram': logoInstagram,
  'images-outline': imagesOutline,
  'checkmark-circle-outline': checkmarkCircleOutline,
  'arrow-back-outline': arrowBackOutline,
  'person-outline': personOutline,
  'refresh-outline': refreshOutline,
  'arrow-forward': arrowForward,
});
