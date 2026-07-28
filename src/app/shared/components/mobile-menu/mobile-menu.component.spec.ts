import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileMenuComponent } from './mobile-menu.component';
import { TranslationService } from '../../../core/services/translation.service';
import { signal, CUSTOM_ELEMENTS_SCHEMA, PLATFORM_ID } from '@angular/core';
import { EN } from '../../i18n/en';
import { provideIcons } from '@ng-icons/core';
import { bootstrapLinkedin, bootstrapList, bootstrapX } from '@ng-icons/bootstrap-icons';
import type { Translation, Language } from '../../i18n/translations';

describe('MobileMenuComponent', () => {
  let fixture: ComponentFixture<MobileMenuComponent>;
  let component: MobileMenuComponent;

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  });

  beforeEach(async () => {
    jest.useFakeTimers();
    const tSignal = signal<Translation>(EN);

    await TestBed.configureTestingModule({
      imports: [MobileMenuComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: TranslationService,
          useValue: {
            t: tSignal as unknown as TranslationService['t'],
            currentLang: signal<Language>('en'),
            setLanguage: jest.fn(),
            toggle: jest.fn(),
          },
        },
        provideIcons({ bootstrapLinkedin, bootstrapList, bootstrapX }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create instance', () => {
    expect(component).toBeTruthy();
  });

  it('should inject TranslationService', () => {
    expect(component.translation).toBeTruthy();
  });

  it('should render the hamburger button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.hamburger-btn');
    expect(button).toBeTruthy();
  });

  it('should have closed by default (menuState is closed)', () => {
    expect(component.menuState()).toBe('closed');
    expect(component.isOpen).toBe(false);
    expect(component.isVisible()).toBe(false);
    expect(component.isClosing()).toBe(false);
  });

  it('should have aria-label "Open menu" when closed', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.hamburger-btn');
    expect(button?.getAttribute('aria-label')).toBe('Open menu');
  });

  it('should have aria-expanded false when closed', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.hamburger-btn');
    expect(button?.getAttribute('aria-expanded')).toBe('false');
  });

  it('should toggle to open when hamburger button is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.hamburger-btn') as HTMLElement;

    button.click();
    fixture.detectChanges();
    expect(component.menuState()).toBe('open');
    expect(component.isOpen).toBe(true);
    expect(component.isVisible()).toBe(true);
    expect(component.isClosing()).toBe(false);
  });

  it('should start closing when hamburger button is clicked while open', () => {
    // Open first
    component.toggleMenu();
    fixture.detectChanges();
    expect(component.menuState()).toBe('open');

    // Click to close
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.hamburger-btn') as HTMLElement;
    button.click();
    fixture.detectChanges();

    // Should be in closing state
    expect(component.menuState()).toBe('closing');
    expect(component.isClosing()).toBe(true);
    expect(component.isVisible()).toBe(true); // still visible during animation
    expect(component.isOpen).toBe(false);

    // Fast-forward past the animation duration
    jest.advanceTimersByTime(250);
    fixture.detectChanges();

    expect(component.menuState()).toBe('closed');
    expect(component.isClosing()).toBe(false);
    expect(component.isVisible()).toBe(false);
  });

  it('should update aria-label based on menu state', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.hamburger-btn') as HTMLElement;

    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-label')).toBe('Close menu');

    button.click();
    fixture.detectChanges();
    // Still 'Close menu' during closing animation
    expect(button.getAttribute('aria-label')).toBe('Close menu');

    jest.advanceTimersByTime(250);
    fixture.detectChanges();
    expect(button.getAttribute('aria-label')).toBe('Open menu');
  });

  it('should update aria-expanded based on menu state', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.hamburger-btn') as HTMLElement;

    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');

    button.click();
    fixture.detectChanges();
    // Still expanded during closing
    expect(button.getAttribute('aria-expanded')).toBe('true');

    jest.advanceTimersByTime(250);
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('should hide overlay when menu is closed', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.mobile-overlay')).toBeFalsy();
  });

  it('should show overlay when menu is opened', () => {
    component.toggleMenu();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.mobile-overlay')).toBeTruthy();
  });

  it('should keep overlay visible during closing animation', () => {
    component.toggleMenu();
    fixture.detectChanges();

    component.closeMenu();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.mobile-overlay')).toBeTruthy();
    expect(compiled.querySelector('.mobile-overlay')?.classList.contains('is-closing')).toBe(true);
    expect(compiled.querySelector('.mobile-menu')?.classList.contains('is-closing')).toBe(true);
  });

  it('should show experience link in the menu when open', () => {
    component.toggleMenu();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = compiled.querySelectorAll('.mobile-nav-link');
    const experienceLink = Array.from(navLinks).find(
      (link) => link.textContent?.trim() === EN.nav.experience
    );
    expect(experienceLink).toBeTruthy();
  });

  it('should not show projects link when showProjects is false', () => {
    fixture.componentRef.setInput('showProjects', false);
    component.toggleMenu();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const projectsLink = Array.from(compiled.querySelectorAll('.mobile-nav-link')).find(
      (link) => link.textContent?.trim() === EN.nav.projects
    );
    expect(projectsLink).toBeFalsy();
  });

  it('should show projects link when showProjects is true', () => {
    fixture.componentRef.setInput('showProjects', true);
    component.toggleMenu();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const projectsLink = Array.from(compiled.querySelectorAll('.mobile-nav-link')).find(
      (link) => link.textContent?.trim() === EN.nav.projects
    );
    expect(projectsLink).toBeTruthy();
  });

  it('should close menu when a nav link is clicked', () => {
    component.toggleMenu();
    fixture.detectChanges();
    expect(component.menuState()).toBe('open');

    const compiled = fixture.nativeElement as HTMLElement;
    const navLink = compiled.querySelector('.mobile-nav-link') as HTMLElement;
    navLink.click();
    fixture.detectChanges();

    expect(component.menuState()).toBe('closing');
    expect(component.isClosing()).toBe(true);
  });

  it('should close menu when overlay is clicked', () => {
    component.toggleMenu();
    fixture.detectChanges();
    expect(component.menuState()).toBe('open');

    const compiled = fixture.nativeElement as HTMLElement;
    const overlay = compiled.querySelector('.mobile-overlay') as HTMLElement;
    overlay.click();
    fixture.detectChanges();

    expect(component.menuState()).toBe('closing');
    expect(component.isClosing()).toBe(true);
  });

  it('should not close menu when menu panel is clicked', () => {
    component.toggleMenu();
    fixture.detectChanges();
    expect(component.menuState()).toBe('open');

    const compiled = fixture.nativeElement as HTMLElement;
    const menu = compiled.querySelector('.mobile-menu') as HTMLElement;
    menu.click();
    fixture.detectChanges();

    expect(component.menuState()).toBe('open');
  });

  it('should close menu on escape key press', () => {
    component.toggleMenu();
    fixture.detectChanges();
    expect(component.menuState()).toBe('open');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(component.menuState()).toBe('closing');
  });

  it('should close menu on window resize above 768px', () => {
    component.toggleMenu();
    fixture.detectChanges();
    expect(component.menuState()).toBe('open');

    // Set a mock innerWidth above 768
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();

    expect(component.menuState()).toBe('closing');

    // Restore
    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, configurable: true });
  });

  it('should call ngOnDestroy without errors', () => {
    expect(() => fixture.destroy()).not.toThrow();
  });

  it('should still fully close after animation timeout', () => {
    component.toggleMenu();
    fixture.detectChanges();
    expect(component.menuState()).toBe('open');

    component.closeMenu();
    fixture.detectChanges();
    expect(component.menuState()).toBe('closing');

    jest.advanceTimersByTime(250);
    fixture.detectChanges();

    expect(component.menuState()).toBe('closed');
    expect(component.isVisible()).toBe(false);
    expect(component.isClosing()).toBe(false);
  });

  it('should re-open if toggled during closing animation', () => {
    component.toggleMenu();
    fixture.detectChanges();

    component.closeMenu();
    fixture.detectChanges();
    expect(component.menuState()).toBe('closing');

    // Toggle again while still closing
    component.toggleMenu();
    fixture.detectChanges();

    expect(component.menuState()).toBe('open');
    expect(component.isClosing()).toBe(false);

    // Advance past original timeout to ensure no side effects
    jest.advanceTimersByTime(250);
    fixture.detectChanges();

    expect(component.menuState()).toBe('open'); // should still be open
  });

  it('should show LinkedIn link in the mobile menu when open', () => {
    component.toggleMenu();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const linkedinLink = compiled.querySelector('.mobile-linkedin-link');
    expect(linkedinLink).toBeTruthy();
    expect(linkedinLink?.getAttribute('href')).toContain('linkedin.com');
  });

  it('should render language toggle in the mobile menu when open', () => {
    component.toggleMenu();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-language-toggle')).toBeTruthy();
  });

  it('should render theme toggle in the mobile menu when open', () => {
    component.toggleMenu();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-theme-toggle')).toBeTruthy();
  });

  describe('edge cases', () => {
    it('should do nothing when closeMenu() is called while closed', () => {
      component.closeMenu();
      expect(component.menuState()).toBe('closed');
    });

    it('should do nothing when closeMenu() is called while closing', () => {
      component.toggleMenu();
      fixture.detectChanges();
      component.closeMenu();
      // Already closing, calling again should not change state
      component.closeMenu();
      expect(component.menuState()).toBe('closing');
    });

    it('should do nothing on escape when not open', () => {
      component.onEscapePress();
      expect(component.menuState()).toBe('closed');
    });

    it('should do nothing on escape when closing', () => {
      component.toggleMenu();
      fixture.detectChanges();
      component.closeMenu();
      component.onEscapePress();
      expect(component.menuState()).toBe('closing');
    });
  });
});

describe('MobileMenuComponent in SSR', () => {
  let fixture: ComponentFixture<MobileMenuComponent>;
  let component: MobileMenuComponent;

  beforeEach(async () => {
    const tSignal = signal<Translation>(EN);

    await TestBed.configureTestingModule({
      imports: [MobileMenuComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        {
          provide: TranslationService,
          useValue: {
            t: tSignal as unknown as TranslationService['t'],
            currentLang: signal<Language>('en'),
            setLanguage: jest.fn(),
            toggle: jest.fn(),
          },
        },
        provideIcons({ bootstrapLinkedin, bootstrapList, bootstrapX }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should early-return from toggleBodyScroll without error', () => {
    component.toggleMenu();
    fixture.detectChanges();
    expect(component.menuState()).toBe('open');
  });

  it('should early-return from unlockBodyScroll without error', () => {
    expect(() => fixture.destroy()).not.toThrow();
  });

  it('should early-return on resize without error', () => {
    window.dispatchEvent(new Event('resize'));
    expect(component.menuState()).toBe('closed');
  });
});
