import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsComponent } from './projects.component';
import { TranslationService } from '../../../core/services/translation.service';
import { signal } from '@angular/core';
import { EN } from '../../i18n/en';
import { provideIcons } from '@ng-icons/core';
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
import {
  boxLinkExternal,
  boxInfoCircle
} from '@ng-icons/boxicons/regular';
import { bootstrapGithub } from '@ng-icons/bootstrap-icons';
import { diSqldeveloperPlain } from '@ng-icons/devicon/plain';
import { PROJECTS } from '../../../core/models/project.model';
import type { Translation, Language } from '../../i18n/translations';

describe('ProjectsComponent', () => {
  let fixture: ComponentFixture<ProjectsComponent>;
  let component: ProjectsComponent;
  let currentLang: ReturnType<typeof signal<Language>>;
  let tSignal: ReturnType<typeof signal<Translation>>;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    currentLang = signal<Language>('en');
    tSignal = signal<Translation>(EN);

    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        {
          provide: TranslationService,
          useValue: {
            t: tSignal as unknown as TranslationService['t'],
            currentLang,
          },
        },
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
          boxLinkExternal,
          boxInfoCircle,
          diSqldeveloperPlain,
          bootstrapGithub
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create instance', () => {
    expect(component).toBeTruthy();
  });

  it('should inject TranslationService', () => {
    expect(component.translation).toBeTruthy();
  });

  it('should expose projects data', () => {
    expect(component.projects).toBe(PROJECTS);
    expect(component.projects.length).toBeGreaterThan(0);
  });

  it('should have iconMap for common technologies', () => {
    expect(component.iconMap['Java']).toBe('boxJavaLogo');
    expect(component.iconMap['Spring Boot']).toBe('simpleSpringboot');
    expect(component.iconMap['Angular']).toBe('simpleAngular');
    expect(component.iconMap['React']).toBe('simpleReact');
    expect(component.iconMap['SQL']).toBe('diSqldeveloperPlain');
    expect(component.iconMap['AWS']).toBe('boxAwsLogo');
    expect(component.iconMap['Azure']).toBe('boxMicrosoftLogo');
    expect(component.iconMap['GCP']).toBe('simpleGooglecloud');
    expect(component.iconMap['MongoDB']).toBe('boxMongodbLogo');
  });

  it('should render section with title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const sectionTitle = compiled.querySelector('.section-title');
    expect(sectionTitle).toBeTruthy();
    expect(sectionTitle?.textContent).toContain(EN.projects.title);
  });

  it('should render tech tags for each project', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const techTagGroups = compiled.querySelectorAll('.tech-tags');

    PROJECTS.forEach((exp, index) => {
      const tags = techTagGroups[index]?.querySelectorAll('.tech-tag');
      expect(tags?.length).toBe(exp.technologies.length);
    });
  });

  it('should render tech tag for a known technology', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const allTags = compiled.querySelectorAll('.tech-tag');
    const javaTags = Array.from(allTags).filter((tag) =>
      tag.textContent?.includes('Java'),
    );
    expect(javaTags.length).toBeGreaterThan(0);
  });
});
