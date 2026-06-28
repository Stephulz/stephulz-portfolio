import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

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
  });
});
