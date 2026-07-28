import { Component, inject } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { TranslationService } from '../../../core/services/translation.service';
import { PROJECTS } from '../../../core/models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CarouselComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  readonly translation = inject(TranslationService);
  readonly projects = PROJECTS;
}
