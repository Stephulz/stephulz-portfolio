import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineComponent } from './timeline.component';
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
import { diSqldeveloperPlain } from '@ng-icons/devicon/plain';
import { EXPERIENCES } from '../../../core/models/experience.model';
import type { Translation, Language } from '../../i18n/translations';

describe('TimelineComponent', () => {
  let fixture: ComponentFixture<TimelineComponent>;
  let component: TimelineComponent;
  let currentLang: ReturnType<typeof signal<Language>>;
  let tSignal: ReturnType<typeof signal<Translation>>;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    currentLang = signal<Language>('en');
    tSignal = signal<Translation>(EN);

    await TestBed.configureTestingModule({
      imports: [TimelineComponent],
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
          diSqldeveloperPlain,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create instance', () => {
    expect(component).toBeTruthy();
  });

  it('should inject TranslationService', () => {
    expect(component.translation).toBeTruthy();
  });

  it('should expose experiences data', () => {
    expect(component.experiences).toBe(EXPERIENCES);
    expect(component.experiences.length).toBeGreaterThan(0);
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
    expect(sectionTitle?.textContent).toContain(EN.experience.title);
  });

  it('should render section subtitle', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const sectionSubtitle = compiled.querySelector('.section-subtitle');
    expect(sectionSubtitle).toBeTruthy();
    expect(sectionSubtitle?.textContent).toContain(EN.experience.subtitle);
  });

  it('should render all experience items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const timelineItems = compiled.querySelectorAll('.timeline-item');
    expect(timelineItems.length).toBe(EXPERIENCES.length);
  });

  it('should render company names for each experience', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const companies = Array.from(compiled.querySelectorAll('.timeline-company'));
    EXPERIENCES.forEach((exp, index) => {
      expect(companies.at(index)?.textContent).toContain(exp.company);
    });
  });

  it('should render role in English by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const roles = Array.from(compiled.querySelectorAll('.timeline-role'));
    EXPERIENCES.forEach((exp, index) => {
      expect(roles.at(index)?.textContent).toContain(exp.role);
    });
  });

  it('should render role in Portuguese when language is pt', () => {
    currentLang.set('pt');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const roles = Array.from(compiled.querySelectorAll('.timeline-role'));
    EXPERIENCES.forEach((exp, index) => {
      expect(roles.at(index)?.textContent).toContain(exp.rolePt);
    });
  });

  it('should render period in English by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const periods = Array.from(compiled.querySelectorAll('.timeline-period'));
    EXPERIENCES.forEach((exp, index) => {
      expect(periods.at(index)?.textContent).toContain(exp.period);
    });
  });

  it('should render period in Portuguese when language is pt', () => {
    currentLang.set('pt');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const periods = Array.from(compiled.querySelectorAll('.timeline-period'));
    EXPERIENCES.forEach((exp, index) => {
      expect(periods.at(index)?.textContent).toContain(exp.periodPt);
    });
  });

  it('should render tech tags for each experience', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const techTagGroups = Array.from(compiled.querySelectorAll('.tech-tags'));

    EXPERIENCES.forEach((exp, index) => {
      const tags = techTagGroups.at(index)?.querySelectorAll('.tech-tag');
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

  it('should have timeline markers with dots', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const dots = compiled.querySelectorAll('.timeline-dot');
    expect(dots.length).toBe(EXPERIENCES.length);
  });

  it('should have timeline lines between items (except last)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const lines = compiled.querySelectorAll('.timeline-line');
    expect(lines.length).toBe(EXPERIENCES.length - 1);
  });
});
