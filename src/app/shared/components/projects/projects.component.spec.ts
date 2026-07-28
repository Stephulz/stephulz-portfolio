import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsComponent } from './projects.component';
import { TranslationService } from '../../../core/services/translation.service';
import { signal } from '@angular/core';
import { EN } from '../../i18n/en';
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

  it('should render section with title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const sectionTitle = compiled.querySelector('.section-title');
    expect(sectionTitle).toBeTruthy();
    expect(sectionTitle?.textContent).toContain(EN.projects.title);
  });

  it('should render subtitle', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const subtitle = compiled.querySelector('.section-subtitle');
    expect(subtitle).toBeTruthy();
  });

  it('should render carousel component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const carousel = compiled.querySelector('app-carousel');
    expect(carousel).toBeTruthy();
  });

  it('should pass projects to carousel component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const carousel = compiled.querySelector('app-carousel');
    expect(carousel).toBeTruthy();
    // The carousel should render project cards for each project
    const cards = fixture.nativeElement.querySelectorAll('.projects-card');
    expect(cards.length).toBe(1);
  });

  it('should render tech tags for the current project', () => {
    const techTags = fixture.nativeElement.querySelectorAll('.tech-tag');
    expect(techTags.length).toBe(PROJECTS[0].technologies.length);
  });

  it('should render section header with translated subtitle', () => {
    const subtitle = fixture.nativeElement.querySelector('.section-subtitle');
    expect(subtitle).toBeTruthy();
    expect(subtitle?.textContent).toBeDefined();
  });
});
