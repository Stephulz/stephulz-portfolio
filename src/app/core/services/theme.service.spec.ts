import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('in browser environment', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [ThemeService],
      });
      service = TestBed.inject(ThemeService);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    function flushEffects(): void {
      (TestBed as unknown as { flushEffects: () => void }).flushEffects();
    }

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have a theme signal that defaults to dark', () => {
      expect(service.theme()).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      service.toggle();
      expect(service.theme()).toBe('light');
    });

    it('should toggle from light to dark', () => {
      service.toggle();
      service.toggle();
      expect(service.theme()).toBe('dark');
    });

    it('should persist theme to localStorage on toggle', () => {
      service.toggle();
      flushEffects();
      expect(localStorage.getItem('portfolio-theme')).toBe('light');

      service.toggle();
      flushEffects();
      expect(localStorage.getItem('portfolio-theme')).toBe('dark');
    });

    it('should set data-theme attribute on documentElement', () => {
      service.toggle();
      flushEffects();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');

      service.toggle();
      flushEffects();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should restore stored theme from localStorage', () => {
      localStorage.setItem('portfolio-theme', 'light');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [ThemeService],
      });
      service = TestBed.inject(ThemeService);
      flushEffects();

      expect(service.theme()).toBe('light');
    });

    it('should handle invalid stored theme value gracefully', () => {
      localStorage.setItem('portfolio-theme', 'invalid-theme');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [ThemeService],
      });
      service = TestBed.inject(ThemeService);
      flushEffects();

      expect(service.theme()).toBe('dark');
    });

    it('should restore stored dark theme from localStorage', () => {
      localStorage.setItem('portfolio-theme', 'dark');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [ThemeService],
      });
      service = TestBed.inject(ThemeService);

      expect(service.theme()).toBe('dark');
    });

    it('should set loaded to true after the 500ms timeout', () => {
      jest.useFakeTimers();

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [ThemeService],
      });
      const svc = TestBed.inject(ThemeService);

      expect(svc.loaded()).toBe(false);

      jest.advanceTimersByTime(500);

      expect(svc.loaded()).toBe(true);
    });

    it('should respect system light mode preference when no stored value', () => {
      const originalMatchMedia = window.matchMedia;
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn().mockImplementation(() => ({
          matches: false,
          media: '(prefers-color-scheme: dark)',
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
        configurable: true,
        writable: true,
      });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [ThemeService],
      });
      const svc = TestBed.inject(ThemeService);
      flushEffects();

      expect(svc.theme()).toBe('light');
      Object.defineProperty(window, 'matchMedia', {
        value: originalMatchMedia,
        configurable: true,
        writable: true,
      });
    });

    it('should respect system dark mode preference when no stored value', () => {
      const originalMatchMedia = window.matchMedia;
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn().mockImplementation((query: string) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
        configurable: true,
        writable: true,
      });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [ThemeService],
      });
      service = TestBed.inject(ThemeService);
      flushEffects();

      expect(service.theme()).toBe('dark');
      Object.defineProperty(window, 'matchMedia', {
        value: originalMatchMedia,
        configurable: true,
        writable: true,
      });
    });
  });

  describe('in server environment', () => {
    beforeEach(() => {
      // Set a pre-existing value to verify SSR path skips browser APIs
      localStorage.setItem('portfolio-theme', 'pre-existing');
      document.documentElement.setAttribute('data-theme', 'light');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });
      service = TestBed.inject(ThemeService);
    });

    it('should create without errors in SSR', () => {
      expect(service).toBeTruthy();
    });

    it('should not access browser APIs in constructor', () => {
      // The constructor should skip the isPlatformBrowser block entirely
      // localStorage should retain the pre-existing value (not overwritten)
      expect(localStorage.getItem('portfolio-theme')).toBe('pre-existing');
      // data-theme should not have been modified by an effect
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should default to dark in SSR', () => {
      expect(service.theme()).toBe('dark');
    });

    it('should toggle theme in SSR without touching DOM', () => {
      service.toggle();
      expect(service.theme()).toBe('light');
      // No effect was registered, so localStorage should still have pre-existing value
      expect(localStorage.getItem('portfolio-theme')).toBe('pre-existing');
    });
  });
});
