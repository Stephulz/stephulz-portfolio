import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Translation,
  Language,
  TRANSLATIONS,
  LANGUAGE_KEY,
} from '../../shared/i18n/translations';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly currentLang = signal<Language>('en');
  readonly t = signal<Translation>(TRANSLATIONS['en']);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.detectLanguage();
    }
  }

  private detectLanguage(): void {
    const stored = localStorage.getItem(LANGUAGE_KEY) as Language | null;
    if (stored === 'pt' || stored === 'en') {
      this.setLanguage(stored);
      return;
    }

    // Try to detect from browser locale / geolocation
    // For Brazilian Portuguese, check navigator.language
    const lang = navigator.language?.toLowerCase() || '';
    if (lang.startsWith('pt') || lang.startsWith('pt-br')) {
      this.setLanguage('pt');
    } else {
      this.setLanguage('en');
    }
  }

  setLanguage(lang: Language): void {
    this.currentLang.set(lang);
    this.t.set(TRANSLATIONS[lang]);

    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.setAttribute(
        'lang',
        lang === 'pt' ? 'pt-BR' : 'en',
      );
      localStorage.setItem(LANGUAGE_KEY, lang);
    }
  }

  toggle(): void {
    const next = this.currentLang() === 'en' ? 'pt' : 'en';
    this.setLanguage(next);
  }
}
