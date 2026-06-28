import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { TranslationService } from '../../../core/services/translation.service';
import { signal } from '@angular/core';
import { EN } from '../../i18n/en';
import { provideIcons } from '@ng-icons/core';
import { bootstrapGithub, bootstrapLinkedin } from '@ng-icons/bootstrap-icons';
import type { Translation, Language } from '../../i18n/translations';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let component: FooterComponent;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    const tSignal = signal<Translation>(EN);

    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        {
          provide: TranslationService,
          useValue: {
            t: tSignal as unknown as TranslationService['t'],
            currentLang: signal<Language>('en'),
          },
        },
        provideIcons({ bootstrapLinkedin, bootstrapGithub }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create instance', () => {
    expect(component).toBeTruthy();
  });

  it('should have current year', () => {
    const expectedYear = new Date().getFullYear();
    expect(component.currentYear).toBe(expectedYear);
  });

  it('should inject TranslationService', () => {
    expect(component.translation).toBeTruthy();
  });

  it('should display the current year in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const footerCopy = compiled.querySelector('.footer-copy');
    expect(footerCopy?.textContent).toContain(String(new Date().getFullYear()));
  });

  it('should display copyright text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const footerCopy = compiled.querySelector('.footer-copy');
    expect(footerCopy?.textContent).toContain(EN.footer.copyright);
  });

  it('should display LinkedIn link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const linkedinLink = compiled.querySelector('[aria-label="LinkedIn"]');
    expect(linkedinLink).toBeTruthy();
    expect(linkedinLink?.getAttribute('href')).toContain('linkedin.com');
  });

  it('should display GitHub link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const githubLink = compiled.querySelector('[aria-label="GitHub"]');
    expect(githubLink).toBeTruthy();
    expect(githubLink?.getAttribute('href')).toContain('github.com');
  });

  it('should display built with text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const footerTech = compiled.querySelector('.footer-tech');
    expect(footerTech?.textContent).toContain(EN.footer.builtWith);
  });
});
