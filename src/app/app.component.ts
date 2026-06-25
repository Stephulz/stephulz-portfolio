import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapLinkedin } from '@ng-icons/bootstrap-icons';
import { simpleGooglemaps } from '@ng-icons/simple-icons';
import { inject as injectAnalytics } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { TimelineComponent } from './shared/components/timeline/timeline.component';
import { TranslationService } from './core/services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, TimelineComponent, NgIcon],
  providers: [provideIcons({ bootstrapLinkedin, simpleGooglemaps })],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  readonly translation = inject(TranslationService);

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
