import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { TranslationService } from '../../../core/services/translation.service';
import { signal } from '@angular/core';
import { EN } from '../../i18n/en';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { bootstrapLinkedin } from '@ng-icons/bootstrap-icons';
import type { Translation, Language } from '../../i18n/translations';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;

  beforeEach(async () => {
    const tSignal = signal<Translation>(EN);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        {
          provide: TranslationService,
          useValue: {
            t: tSignal as unknown as TranslationService['t'],
            currentLang: signal<Language>('en'),
            setLanguage: vi.fn(),
            toggle: vi.fn(),
          },
        },
        provideIcons({ bootstrapLinkedin }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create instance', () => {
    expect(component).toBeTruthy();
  });

  it('should inject TranslationService', () => {
    expect(component.translation).toBeTruthy();
  });

  it('should render the logo', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logo = compiled.querySelector('.logo');
    expect(logo).toBeTruthy();
    expect(logo?.textContent).toContain('Stefan');
  });

  it('should render navigation with experience link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const navLink = compiled.querySelector('.nav-link');
    expect(navLink).toBeTruthy();
    expect(navLink?.textContent).toContain(EN.nav.experience);
  });

  it('should render LinkedIn link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const linkedinLink = compiled.querySelector('.linkedin-link');
    expect(linkedinLink).toBeTruthy();
    expect(linkedinLink?.getAttribute('href')).toContain('linkedin.com');
  });

  it('should render language toggle component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-language-toggle')).toBeTruthy();
  });

  it('should render theme toggle component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-theme-toggle')).toBeTruthy();
  });
});
