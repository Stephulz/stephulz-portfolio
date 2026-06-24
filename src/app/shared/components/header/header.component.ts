import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapLinkedin } from '@ng-icons/bootstrap-icons';
import { TranslationService } from '../../../core/services/translation.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIcon, ThemeToggleComponent, LanguageToggleComponent],
  providers: [provideIcons({ bootstrapLinkedin })],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly translation = inject(TranslationService);
}
