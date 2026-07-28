import { Component, inject, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  simpleAngular,
  simpleReact,
  simpleSpringboot,
  simpleGooglecloud,
  simpleMysql,
  simpleApachekafka,
  simplePostgresql,
  simpleDocker,
} from '@ng-icons/simple-icons';
import {
  boxJavaLogo,
  boxMicrosoftLogo,
  boxAwsLogo,
  boxMongodbLogo,
} from '@ng-icons/boxicons/logos';
import {
  boxLinkExternal,
  boxInfoCircle,
} from '@ng-icons/boxicons/regular';
import { bootstrapGithub } from '@ng-icons/bootstrap-icons';
import { diSqldeveloperPlain } from '@ng-icons/devicon/plain';
import { TranslationService } from '../../../core/services/translation.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Project } from '../../../core/models/project.model';
import { TECH_ICONS } from '../../../core/constants/tech-icons';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [NgIcon],
  providers: [
    provideIcons({
      simpleAngular,
      simpleReact,
      simpleSpringboot,
      simpleGooglecloud,
      simpleMysql,
      simpleApachekafka,
      simplePostgresql,
      simpleDocker,
      boxJavaLogo,
      boxMicrosoftLogo,
      boxAwsLogo,
      boxMongodbLogo,
      boxLinkExternal,
      boxInfoCircle,
      diSqldeveloperPlain,
      bootstrapGithub,
    }),
  ],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent {
  readonly themeService = inject(ThemeService);
  readonly translation = inject(TranslationService);

  readonly project = input.required<Project>();
  readonly imageClick = output<void>();

  readonly iconMap = TECH_ICONS;
}
