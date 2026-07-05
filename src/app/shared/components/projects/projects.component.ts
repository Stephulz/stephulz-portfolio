import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  simpleAngular,
  simpleReact,
  simpleSpringboot,
  simpleGooglecloud,
  simpleMysql,
  simpleApachekafka,
  simplePostgresql,
  simpleDocker
} from '@ng-icons/simple-icons';
import {
  boxJavaLogo,
  boxMicrosoftLogo,
  boxAwsLogo,
  boxMongodbLogo,
} from '@ng-icons/boxicons/logos';
import {
  boxLinkExternal,
  boxInfoCircle
} from '@ng-icons/boxicons/regular';
import { bootstrapGithub } from '@ng-icons/bootstrap-icons';
import { diSqldeveloperPlain } from '@ng-icons/devicon/plain';
import { TranslationService } from '../../../core/services/translation.service';
import { PROJECTS } from '../../../core/models/project.model';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-projects',
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
      bootstrapGithub
    }),
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  readonly themeService = inject(ThemeService);
  readonly translation = inject(TranslationService);
  readonly projects = PROJECTS;

  readonly iconMap: Record<string, string> = {
    Java: 'boxJavaLogo',
    'Spring Boot': 'simpleSpringboot',
    Angular: 'simpleAngular',
    React: 'simpleReact',
    SQL: 'diSqldeveloperPlain',
    GCP: 'simpleGooglecloud',
    AWS: 'boxAwsLogo',
    Azure: 'boxMicrosoftLogo',
    MongoDB: 'boxMongodbLogo',
    'Apache Kafka': 'simpleApachekafka',
    PostgreSQL: 'simplePostgresql',
    Docker: 'simpleDocker'
  };
}
