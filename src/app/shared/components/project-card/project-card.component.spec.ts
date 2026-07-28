import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCardComponent } from './project-card.component';
import { TranslationService } from '../../../core/services/translation.service';
import { signal } from '@angular/core';
import { EN } from '../../i18n/en';
import { PROJECTS } from '../../../core/models/project.model';
import type { Translation, Language } from '../../i18n/translations';

describe('ProjectCardComponent', () => {
  let fixture: ComponentFixture<ProjectCardComponent>;
  let component: ProjectCardComponent;
  let currentLang: ReturnType<typeof signal<Language>>;
  let tSignal: ReturnType<typeof signal<Translation>>;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    currentLang = signal<Language>('en');
    tSignal = signal<Translation>(EN);

    await TestBed.configureTestingModule({
      imports: [ProjectCardComponent],
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

    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', PROJECTS[0]);
    fixture.detectChanges();
  });

  it('should create instance', () => {
    expect(component).toBeTruthy();
  });

  it('should receive project via input', () => {
    expect(component.project()).toBe(PROJECTS[0]);
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

  it('should render project title', () => {
    const titleEl = fixture.nativeElement.querySelector('.projects-title');
    expect(titleEl?.textContent).toContain(PROJECTS[0].title);
  });

  it('should render project image', () => {
    const img = fixture.nativeElement.querySelector(
      '.projects-image',
    ) as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.src).toContain(PROJECTS[0].imageUrlDark);
  });

  it('should render tech tags for the project', () => {
    const techTags = fixture.nativeElement.querySelectorAll('.tech-tag');
    expect(techTags.length).toBe(PROJECTS[0].technologies.length);
  });

  it('should render tech tag for a known technology', () => {
    const allTags =
      fixture.nativeElement.querySelectorAll('.tech-tag');
    const javaTags = Array.from(allTags).filter((tag) =>
      (tag as HTMLElement).textContent?.includes('Java'),
    );
    expect(javaTags.length).toBeGreaterThan(0);
  });

  it('should render project links', () => {
    const links = fixture.nativeElement.querySelectorAll('.btn-secondary');
    expect(links.length).toBe(2);
  });

  it('should emit imageClick when image is clicked', () => {
    const spy = jest.fn();
    component.imageClick.subscribe(spy);

    const image = fixture.nativeElement.querySelector(
      '.projects-image',
    ) as HTMLImageElement;
    image.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render git URL link', () => {
    const link = fixture.nativeElement.querySelector(
      '.btn-secondary',
    ) as HTMLAnchorElement;
    expect(link?.href).toContain(PROJECTS[0].gitUrl);
  });

  it('should render arch details link', () => {
    const links = fixture.nativeElement.querySelectorAll(
      '.btn-secondary',
    ) as NodeListOf<HTMLAnchorElement>;
    const archLink = links[links.length - 1];
    expect(archLink?.href).toContain(PROJECTS[0].archDetails);
  });
});
