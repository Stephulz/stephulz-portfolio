import { Component, effect, inject, NgZone, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowUp, heroRectangleStack, heroArrowDown } from '@ng-icons/heroicons/outline';
import { bootstrapLinkedin, bootstrapGithub } from '@ng-icons/bootstrap-icons';
import { simpleGooglemaps } from '@ng-icons/simple-icons';
import { inject as injectAnalytics } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { TimelineComponent } from './shared/components/timeline/timeline.component';
import { ThemeService } from './core/services/theme.service';
import { TranslationService } from './core/services/translation.service';
import { ConfigCatService } from './core/services/configcat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, TimelineComponent, NgIcon],
  providers: [provideIcons({ bootstrapLinkedin, bootstrapGithub, simpleGooglemaps, heroArrowUp, heroArrowDown, heroRectangleStack })],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  readonly translation = inject(TranslationService);
  readonly theme = inject(ThemeService);
  readonly configCatService = inject(ConfigCatService)
  readonly showProjectsLink = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        if (this.theme.loaded()) {
          fadeOutPreBootSkeleton();
          void this.loadProjectsLinkFlag();
        }
      });
    }
  }

  private async loadProjectsLinkFlag(): Promise<void> {
    const enabled = await this.configCatService.getValueAsync('projectSection', false);
    this.ngZone.run(() => {
      this.showProjectsLink.set(enabled);
    });
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
