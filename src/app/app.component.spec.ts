import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslationService } from './core/services/translation.service';
import { signal } from '@angular/core';
import { EN } from './shared/i18n/en';
import { provideIcons } from '@ng-icons/core';
import { bootstrapGithub, bootstrapLinkedin } from '@ng-icons/bootstrap-icons';
import { simpleGooglemaps } from '@ng-icons/simple-icons';
import { heroArrowUp } from '@ng-icons/heroicons/outline';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { Translation, Language } from './shared/i18n/translations';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let translationServiceMock: Partial<TranslationService>;

  beforeEach(async () => {
    const tSignal = signal<Translation>(EN);
    translationServiceMock = {
      t: tSignal as unknown as TranslationService['t'],
      currentLang: signal<Language>('en'),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: TranslationService, useValue: translationServiceMock },
        provideIcons({ bootstrapLinkedin, bootstrapGithub, simpleGooglemaps, heroArrowUp }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should inject TranslationService', () => {
    expect(component.translation).toBeDefined();
  });

  it('should have an t() function that returns translations', () => {
    const t = component.translation.t();
    expect(t.hero.name).toBe('Stefan Sanches');
  });

  it('should render the header section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
  });

  it('should render the footer section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });

  it('should render the timeline section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-timeline')).toBeTruthy();
  });

  it('should render hero section with greeting', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const greeting = compiled.querySelector('.hero-greeting');
    expect(greeting).toBeTruthy();
    expect(greeting?.textContent).toContain(EN.hero.greeting);
  });

  it('should render hero name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const name = compiled.querySelector('.hero-name');
    expect(name).toBeTruthy();
    expect(name?.textContent).toContain(EN.hero.name);
  });

  it('should render back to top link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const backToTop = compiled.querySelector('.to-top');
    expect(backToTop).toBeTruthy();
  });
});
