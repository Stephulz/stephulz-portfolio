import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroSun, heroMoon } from '@ng-icons/heroicons/outline';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [NgIcon],
  providers: [provideIcons({ heroSun, heroMoon })],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
})
export class ThemeToggleComponent {
  readonly themeService = inject(ThemeService);
  readonly translation = inject(TranslationService);
}
