import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'app_language';
  
  readonly availableLanguages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' }
  ];

  constructor(private translate: TranslateService) {}

  async init() {
    // Set available languages
    this.translate.addLangs(this.availableLanguages.map(l => l.code));
    
    // Get saved language or use browser language
    const { value: savedLang } = await Preferences.get({ key: this.LANGUAGE_KEY });
    
    if (savedLang && this.availableLanguages.find(l => l.code === savedLang)) {
      this.translate.use(savedLang);
    } else {
      const browserLang = this.translate.getBrowserLang() || 'es';
      const lang = this.availableLanguages.find(l => l.code === browserLang)?.code || 'es';
      this.translate.use(lang);
      await this.setLanguage(lang);
    }
  }

  async setLanguage(lang: string) {
    this.translate.use(lang);
    await Preferences.set({ key: this.LANGUAGE_KEY, value: lang });
  }

  getCurrentLanguage() {
    return this.translate.currentLang;
  }

  getLanguageName(code: string): string {
    return this.availableLanguages.find(l => l.code === code)?.name || code;
  }
}
