import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapLinkedin } from '@ng-icons/bootstrap-icons';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgIcon],
  providers: [provideIcons({ bootstrapLinkedin })],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly translation = inject(TranslationService);
  readonly currentYear = new Date().getFullYear();
}
