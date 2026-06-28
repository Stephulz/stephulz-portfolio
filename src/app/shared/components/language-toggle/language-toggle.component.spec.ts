import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageToggleComponent } from './language-toggle.component';
import { TranslationService } from '../../../core/services/translation.service';
import { signal } from '@angular/core';
import { EN } from '../../i18n/en';
import type { Translation, Language } from '../../i18n/translations';

describe('LanguageToggleComponent', () => {
  let fixture: ComponentFixture<LanguageToggleComponent>;
  let component: LanguageToggleComponent;
  let currentLang: ReturnType<typeof signal<Language>>;
  let setLanguageSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    currentLang = signal<Language>('en');
    const tSignal = signal<Translation>(EN);
    setLanguageSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [LanguageToggleComponent],
      providers: [
        {
          provide: TranslationService,
          useValue: {
            t: tSignal as unknown as TranslationService['t'],
            currentLang,
            setLanguage: setLanguageSpy,
            toggle: () => {
              currentLang.set(currentLang() === 'en' ? 'pt' : 'en');
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create instance', () => {
    expect(component).toBeTruthy();
  });

  it('should inject TranslationService', () => {
    expect(component.translation).toBeTruthy();
  });

  it('should expose available languages', () => {
    expect(component.languages).toEqual([
      { code: 'en', label: 'EN' },
      { code: 'pt', label: 'PT' },
    ]);
  });

  it('should render language toggle buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('.lang-btn');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent?.trim()).toBe('EN');
    expect(buttons[1].textContent?.trim()).toBe('PT');
  });

  it('should highlight active language', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('.lang-btn');

    // English should be active by default
    expect(buttons[0].classList.contains('active')).toBe(true);
    expect(buttons[1].classList.contains('active')).toBe(false);
    expect(buttons[0].getAttribute('aria-checked')).toBe('true');
    expect(buttons[1].getAttribute('aria-checked')).toBe('false');
  });

  it('should highlight Portuguese when active', () => {
    currentLang.set('pt');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('.lang-btn');

    expect(buttons[0].classList.contains('active')).toBe(false);
    expect(buttons[1].classList.contains('active')).toBe(true);
  });

  it('should call setLanguage when button is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const ptButton = compiled.querySelectorAll('.lang-btn')[1];

    ptButton.dispatchEvent(new Event('click'));
    expect(setLanguageSpy).toHaveBeenCalledWith('pt');
  });

  it('should have role radiogroup', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('.lang-toggle');
    expect(container?.getAttribute('role')).toBe('radiogroup');
  });

  it('should have buttons with role radio', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('.lang-btn');
    buttons.forEach((btn) => {
      expect(btn.getAttribute('role')).toBe('radio');
    });
  });
});
