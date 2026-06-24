import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  simpleAngular,
  simpleReact,
  simpleSpringboot,
  simpleGooglecloud,
  simpleMysql,
} from '@ng-icons/simple-icons';
import {
  boxJavaLogo,
  boxMicrosoftLogo,
  boxAwsLogo,
  boxMongodbLogo,
} from '@ng-icons/boxicons/logos';
import { diSqldeveloperPlain } from '@ng-icons/devicon/plain';
import { EXPERIENCES } from '../../../core/models/experience.model';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [NgIcon],
  providers: [
    provideIcons({
      simpleAngular,
      simpleReact,
      simpleSpringboot,
      simpleGooglecloud,
      simpleMysql,
      boxJavaLogo,
      boxMicrosoftLogo,
      boxAwsLogo,
      boxMongodbLogo,
      diSqldeveloperPlain,
    }),
  ],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent {
  readonly translation = inject(TranslationService);
  readonly experiences = EXPERIENCES;

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
  };
}
