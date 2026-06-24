import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'portfolio-theme';

  readonly theme = signal<Theme>('dark');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.storageKey) as Theme | null;
      if (stored === 'light' || stored === 'dark') {
        this.theme.set(stored);
      } else {
        // Respect system preference, but default to dark
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)',
        ).matches;
        this.theme.set(prefersDark ? 'dark' : 'light');
      }

      effect(() => {
        const current = this.theme();
        document.documentElement.setAttribute('data-theme', current);
        localStorage.setItem(this.storageKey, current);
      });
    }
  }

  toggle(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }
}
