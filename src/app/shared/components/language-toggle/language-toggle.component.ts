import { Component, inject } from '@angular/core';
import { TranslationService } from '../../../core/services/translation.service';
import type { Language } from '../../i18n/translations';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  templateUrl: './language-toggle.component.html',
  styleUrl: './language-toggle.component.scss',
})
export class LanguageToggleComponent {
  readonly translation = inject(TranslationService);

  readonly languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'pt', label: 'PT' },
  ];
}
