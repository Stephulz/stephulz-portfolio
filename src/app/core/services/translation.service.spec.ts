import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('lang');
  });

  describe('in browser environment', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [TranslationService],
      });
      service = TestBed.inject(TranslationService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should default to English', () => {
      expect(service.currentLang()).toBe('en');
    });

    it('should have translation function that returns English by default', () => {
      const t = service.t();
      expect(t.hero.greeting).toBe("Hi, I'm");
      expect(t.hero.name).toBe('Stefan Sanches');
    });

    it('should toggle language to Portuguese', () => {
      service.toggle();
      expect(service.currentLang()).toBe('pt');
    });

    it('should toggle back to English', () => {
      service.toggle();
      service.toggle();
      expect(service.currentLang()).toBe('en');
    });

    it('should update translation signal when toggling', () => {
      service.toggle();
      const t = service.t();
      expect(t.hero.greeting).toBe('Olá, eu sou');
    });

    it('should set language explicitly', () => {
      service.setLanguage('pt');
      expect(service.currentLang()).toBe('pt');
      expect(service.t().hero.greeting).toBe('Olá, eu sou');
    });

    it('should set the lang attribute on documentElement', () => {
      service.setLanguage('pt');
      expect(document.documentElement.getAttribute('lang')).toBe('pt-BR');

      service.setLanguage('en');
      expect(document.documentElement.getAttribute('lang')).toBe('en');
    });

    it('should persist language preference to localStorage', () => {
      service.setLanguage('pt');
      expect(localStorage.getItem('portfolio-lang')).toBe('pt');

      service.setLanguage('en');
      expect(localStorage.getItem('portfolio-lang')).toBe('en');
    });

    it('should restore stored language from localStorage', () => {
      localStorage.setItem('portfolio-lang', 'pt');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [TranslationService],
      });
      service = TestBed.inject(TranslationService);

      expect(service.currentLang()).toBe('pt');
      expect(service.t().hero.greeting).toBe('Olá, eu sou');
    });

    it('should handle invalid stored language gracefully', () => {
      localStorage.setItem('portfolio-lang', 'fr');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [TranslationService],
      });
      service = TestBed.inject(TranslationService);

      expect(service.currentLang()).toBe('en');
    });

    it('should detect Portuguese from browser locale', () => {
      const originalLang = navigator.language;

      Object.defineProperty(navigator, 'language', {
        value: 'pt-BR',
        configurable: true,
        writable: true,
      });

      localStorage.removeItem('portfolio-lang');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [TranslationService],
      });
      const svc = TestBed.inject(TranslationService);

      expect(svc.currentLang()).toBe('pt');
      expect(svc.t().hero.greeting).toBe('Olá, eu sou');

      Object.defineProperty(navigator, 'language', {
        value: originalLang,
        configurable: true,
        writable: true,
      });
    });

    it('should fall back to English when navigator.language is unavailable', () => {
      const originalLanguage = navigator.language;

      Object.defineProperty(navigator, 'language', {
        value: undefined,
        configurable: true,
        writable: true,
      });

      localStorage.removeItem('portfolio-lang');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [TranslationService],
      });
      const svc = TestBed.inject(TranslationService);

      expect(svc.currentLang()).toBe('en');

      Object.defineProperty(navigator, 'language', {
        value: originalLanguage,
        configurable: true,
        writable: true,
      });
    });

    it('should provide correct translations for all keys in English', () => {
      const t = service.t();
      expect(t.nav.experience).toBe('Work Experience');
      expect(t.experience.title).toBe('Work Experience');
      expect(t.footer.copyright).toBe('All rights reserved.');
      expect(t.theme.dark).toBe('Dark mode');
      expect(t.language.switch).toBe('Switch language');
    });

    it('should provide correct translations for all keys in Portuguese', () => {
      service.setLanguage('pt');
      const t = service.t();
      expect(t.nav.experience).toBe('Trajetória Profissional');
      expect(t.experience.title).toBe('Experiência Profissional');
      expect(t.footer.copyright).toBe('Todos os direitos reservados.');
      expect(t.theme.dark).toBe('Modo escuro');
      expect(t.language.switch).toBe('Trocar idioma');
    });
  });

  describe('in server environment', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          TranslationService,
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });
      service = TestBed.inject(TranslationService);
    });

    it('should create without errors in SSR', () => {
      expect(service).toBeTruthy();
    });

    it('should default to English in SSR', () => {
      expect(service.currentLang()).toBe('en');
    });

    it('should toggle language in SSR', () => {
      service.toggle();
      expect(service.currentLang()).toBe('pt');
    });

    it('should set language without DOM access in SSR', () => {
      service.setLanguage('pt');
      expect(service.currentLang()).toBe('pt');
      expect(service.t().hero.greeting).toBe('Olá, eu sou');
      expect(document.documentElement.getAttribute('lang')).toBeNull();
      expect(localStorage.getItem('portfolio-lang')).toBeNull();
    });
  });
});
