import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslationService } from '../../../core/services/translation.service';
import { signal } from '@angular/core';
import { EN } from '../../i18n/en';
import { provideIcons } from '@ng-icons/core';
import { heroMoon, heroSun } from '@ng-icons/heroicons/outline';
import type { Translation, Language } from '../../i18n/translations';
import type { Theme } from '../../../core/services/theme.service';

describe('ThemeToggleComponent', () => {
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let component: ThemeToggleComponent;
  let themeSignal: ReturnType<typeof signal<Theme>>;
  let toggleThemeSpy: jest.Mock;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    themeSignal = signal<Theme>('dark');
    toggleThemeSpy = jest.fn();
    const tSignal = signal<Translation>(EN);

    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent],
      providers: [
        {
          provide: ThemeService,
          useValue: {
            theme: themeSignal,
            toggle: toggleThemeSpy,
          },
        },
        {
          provide: TranslationService,
          useValue: {
            t: tSignal as unknown as TranslationService['t'],
            currentLang: signal<Language>('en'),
          },
        },
        provideIcons({ heroSun, heroMoon }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create instance', () => {
    expect(component).toBeTruthy();
  });

  it('should inject ThemeService', () => {
    expect(component.themeService).toBeTruthy();
  });

  it('should inject TranslationService', () => {
    expect(component.translation).toBeTruthy();
  });

  it('should render theme toggle button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.theme-btn');
    expect(button).toBeTruthy();
  });

  it('should have aria-label for dark mode (showing sun icon)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.theme-btn');
    expect(button?.getAttribute('aria-label')).toBe(EN.theme.light);
  });

  it('should have aria-label for light mode (showing moon icon)', () => {
    themeSignal.set('light');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.theme-btn');
    expect(button?.getAttribute('aria-label')).toBe(EN.theme.dark);
  });

  it('should render ng-icon when theme is dark', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icon = compiled.querySelector('ng-icon');
    expect(icon).toBeTruthy();
  });

  it('should call themeService.toggle on click', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.theme-btn') as HTMLElement;

    button.click();
    expect(toggleThemeSpy).toHaveBeenCalledTimes(1);
  });
});
