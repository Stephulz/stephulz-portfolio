import {
  Component,
  inject,
  input,
  signal,
  computed,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapLinkedin, bootstrapList, bootstrapX } from '@ng-icons/bootstrap-icons';
import { TranslationService } from '../../../core/services/translation.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';

type MenuState = 'closed' | 'open' | 'closing';

const EXIT_ANIMATION_MS = 250;

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [NgIcon, ThemeToggleComponent, LanguageToggleComponent],
  providers: [provideIcons({ bootstrapLinkedin, bootstrapList, bootstrapX })],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss',
})
export class MobileMenuComponent implements OnDestroy {
  readonly translation = inject(TranslationService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly showProjects = input(false);

  readonly menuState = signal<MenuState>('closed');

  /** Whether the overlay/menu panel should be in the DOM. */
  readonly isVisible = computed(() => this.menuState() !== 'closed');

  /** Whether we're in the closing animation phase. */
  readonly isClosing = computed(() => this.menuState() === 'closing');

  private closeTimeout: ReturnType<typeof setTimeout> | null = null;

  /** Track whether we're in the browser for SSR-safe DOM access. */
  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  toggleMenu(): void {
    const state = this.menuState();

    if (state === 'closed') {
      this.openMenu();
    } else if (state === 'open') {
      this.startClosing();
    } else if (state === 'closing') {
      // Re-open if currently closing
      this.clearCloseTimeout();
      this.menuState.set('open');
      this.toggleBodyScroll(true);
    }
  }

  /** Publicly exposed for tests — returns true if the menu is fully open. */
  get isOpen(): boolean {
    return this.menuState() === 'open';
  }

  closeMenu(): void {
    if (this.menuState() === 'open') {
      this.startClosing();
    }
  }

  ngOnDestroy(): void {
    this.clearCloseTimeout();
    this.unlockBodyScroll();
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.menuState() === 'open') {
      this.startClosing();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.isBrowser && window.innerWidth >= 768 && this.menuState() === 'open') {
      this.startClosing();
    }
  }

  onOverlayClick(): void {
    this.closeMenu();
  }

  onMenuClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onNavClick(): void {
    this.closeMenu();
  }

  private openMenu(): void {
    this.menuState.set('open');
    this.toggleBodyScroll(true);
  }

  private startClosing(): void {
    this.menuState.set('closing');
    this.toggleBodyScroll(false);

    this.closeTimeout = setTimeout(() => {
      this.menuState.set('closed');
      this.closeTimeout = null;
    }, EXIT_ANIMATION_MS);
  }

  private clearCloseTimeout(): void {
    if (this.closeTimeout !== null) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }

  /** Lock or unlock body scroll based on menu state. */
  private toggleBodyScroll(force?: boolean): void {
    if (!this.isBrowser) {
      return;
    }
    const shouldLock = force ?? this.menuState() === 'open';
    document.body.style.overflow = shouldLock ? 'hidden' : '';
  }

  /** Ensure body scroll is always restored on destroy. */
  private unlockBodyScroll(): void {
    if (!this.isBrowser) {
      return;
    }
    document.body.style.overflow = '';
  }
}
