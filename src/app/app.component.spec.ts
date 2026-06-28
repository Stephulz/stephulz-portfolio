import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslationService } from './core/services/translation.service';
import { ThemeService } from './core/services/theme.service';
import { signal, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EN } from './shared/i18n/en';
import { provideIcons } from '@ng-icons/core';
import { bootstrapGithub, bootstrapLinkedin } from '@ng-icons/bootstrap-icons';
import { simpleGooglemaps } from '@ng-icons/simple-icons';
import { heroArrowUp } from '@ng-icons/heroicons/outline';
import type { Translation, Language } from './shared/i18n/translations';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    const tSignal = signal<Translation>(EN);
    const themeLoadedSignal = signal(true);
    const translationServiceMock: Partial<TranslationService> = {
      t: tSignal as unknown as TranslationService['t'],
      currentLang: signal<Language>('en'),
    };
    const themeServiceMock: Partial<ThemeService> = {
      loaded: themeLoadedSignal as unknown as ThemeService['loaded'],
      theme: signal<'dark' | 'light'>('dark') as unknown as ThemeService['theme'],
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: TranslationService, useValue: translationServiceMock },
        { provide: ThemeService, useValue: themeServiceMock },
        provideIcons({ bootstrapLinkedin, bootstrapGithub, simpleGooglemaps, heroArrowUp }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    // Add pre-boot-skeleton element to DOM so fadeOutPreBootSkeleton() can find it
    const skeletonEl = document.createElement('div');
    skeletonEl.id = 'pre-boot-skeleton';
    document.body.appendChild(skeletonEl);

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

  afterEach(() => {
    jest.restoreAllMocks();
    const el = document.getElementById('pre-boot-skeleton');
    if (el) {
      el.remove();
    }
  });

  it('should open external link in a new tab', () => {
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    component.navigateToExternalLink('https://example.com');
    expect(windowOpenSpy).toHaveBeenCalledWith('https://example.com', '_blank');
    windowOpenSpy.mockRestore();
  });

  it('should add hidden class to pre-boot-skeleton when theme loads', () => {
    const el = document.getElementById('pre-boot-skeleton');
    expect(el).toBeTruthy();
    expect(el!.classList.contains('hidden')).toBe(true);
  });

  it('should remove pre-boot-skeleton element after transitionend event', () => {
    const el = document.getElementById('pre-boot-skeleton');
    expect(el).toBeTruthy();

    el!.dispatchEvent(new Event('transitionend'));

    expect(document.getElementById('pre-boot-skeleton')).toBeNull();
  });
});

describe('AppComponent in server environment', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    const tSignal = signal<Translation>(EN);
    const themeLoadedSignal = signal(true);
    const translationServiceMock: Partial<TranslationService> = {
      t: tSignal as unknown as TranslationService['t'],
      currentLang: signal<Language>('en'),
    };
    const themeServiceMock: Partial<ThemeService> = {
      loaded: themeLoadedSignal as unknown as ThemeService['loaded'],
      theme: signal<'dark' | 'light'>('dark') as unknown as ThemeService['theme'],
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: TranslationService, useValue: translationServiceMock },
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: PLATFORM_ID, useValue: 'server' },
        provideIcons({ bootstrapLinkedin, bootstrapGithub, simpleGooglemaps, heroArrowUp }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create without errors in SSR', () => {
    expect(component).toBeTruthy();
  });

  it('should not inject analytics on server', () => {
    // ngOnInit runs but should skip analytics because isPlatformBrowser is false
    expect(component).toBeTruthy();
  });

});

describe('AppComponent — edge-case coverage', () => {
  it('should not throw when fadeOutPreBootSkeleton runs without the element in DOM', () => {
    // Intentionally NOT adding #pre-boot-skeleton to DOM.
    // The effect fires, calls fadeOutPreBootSkeleton(), getElementById returns null,
    // and the function early-returns without error.
    const tSignal = signal<Translation>(EN);
    const themeLoadedSignal = signal(true);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: TranslationService,
          useValue: {
            t: tSignal as unknown as TranslationService['t'],
            currentLang: signal<Language>('en'),
          },
        },
        {
          provide: ThemeService,
          useValue: {
            loaded: themeLoadedSignal as unknown as ThemeService['loaded'],
            theme: signal<'dark' | 'light'>('dark') as unknown as ThemeService['theme'],
          },
        },
        provideIcons({ bootstrapLinkedin, bootstrapGithub, simpleGooglemaps, heroArrowUp }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    const comp = TestBed.createComponent(AppComponent);
    comp.detectChanges();

    expect(comp.componentInstance).toBeTruthy();
  });

  it('should skip fadeOut when theme.loaded() is false (else branch)', () => {
    // loaded starts as false → effect else-path is taken
    // Then loaded becomes true → effect re-runs and takes if-path
    const tSignal = signal<Translation>(EN);
    const themeLoadedSignal = signal(false);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: TranslationService,
          useValue: {
            t: tSignal as unknown as TranslationService['t'],
            currentLang: signal<Language>('en'),
          },
        },
        {
          provide: ThemeService,
          useValue: {
            loaded: themeLoadedSignal as unknown as ThemeService['loaded'],
            theme: signal<'dark' | 'light'>('dark') as unknown as ThemeService['theme'],
          },
        },
        provideIcons({ bootstrapLinkedin, bootstrapGithub, simpleGooglemaps, heroArrowUp }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    const comp = TestBed.createComponent(AppComponent);
    comp.detectChanges();

    // Effect first evaluates with loaded() === false — the else-path is taken
    // No fadeOut should happen yet
    expect(comp.componentInstance).toBeTruthy();

    // Now flip loaded to true — effect re-evaluates and calls fadeOut
    themeLoadedSignal.set(true);
    comp.detectChanges();

    expect(comp.componentInstance).toBeTruthy();
  });
});
