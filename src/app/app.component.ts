import { Component, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowUp } from '@ng-icons/heroicons/outline';
import { bootstrapLinkedin, bootstrapGithub } from '@ng-icons/bootstrap-icons';
import { simpleGooglemaps } from '@ng-icons/simple-icons';
import { inject as injectAnalytics } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { TimelineComponent } from './shared/components/timeline/timeline.component';
import { ThemeService } from './core/services/theme.service';
import { TranslationService } from './core/services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, TimelineComponent, NgIcon],
  providers: [provideIcons({ bootstrapLinkedin, bootstrapGithub, simpleGooglemaps, heroArrowUp })],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  readonly translation = inject(TranslationService);
  readonly theme = inject(ThemeService);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        if (this.theme.loaded()) {
          fadeOutPreBootSkeleton();
        }
      });
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      injectAnalytics();
      injectSpeedInsights();
    }
  }

  navigateToExternalLink(url: string): void {
    window.open(url, '_blank');
  }
}

/** Fade out and remove the pre-bootstrap skeleton screen from index.html. */
function fadeOutPreBootSkeleton(): void {
  const el = document.getElementById('pre-boot-skeleton');
  if (!el) {
    return;
  }

  el.classList.add('hidden');

  el.addEventListener(
    'transitionend',
    () => {
      el.remove();
    },
    { once: true },
  );
}
