import {
  Component,
  HostListener,
  OnDestroy,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  bootstrapX,
  bootstrapChevronLeft,
  bootstrapChevronRight,
  bootstrapZoomIn,
  bootstrapZoomOut,
} from '@ng-icons/bootstrap-icons';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { TranslationService } from '../../../core/services/translation.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Project } from '../../../core/models/project.model';

// ─── Zoom constraints ────────────────────────────────────────────────
const ZOOM_MIN = 1;
const ZOOM_MAX = 5;
const ZOOM_STEP = 0.25;

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [ProjectCardComponent, NgIcon],
  providers: [
    provideIcons({
      bootstrapX,
      bootstrapChevronLeft,
      bootstrapChevronRight,
      bootstrapZoomIn,
      bootstrapZoomOut,
    }),
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent implements OnDestroy {
  readonly themeService = inject(ThemeService);
  readonly translation = inject(TranslationService);

  readonly projects = input.required<Project[]>();

  readonly currentIndex = signal(0);
  readonly isZoomed = signal(false);
  readonly isPaused = signal(false);
  readonly progress = signal(0);

  // ── Zoom / pan state ───────────────────────────────────────────
  readonly zoomLevel = signal(1);
  readonly panX = signal(0);
  readonly panY = signal(0);
  readonly isPanning = signal(false);
  readonly isInteracting = signal(false);

  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;
  private slideStartTime = 0;
  private pauseCount = 0;

  /* swipe / drag for carousel */
  private touchStartX = 0;
  private touchStartY = 0;
  private readonly SWIPE_THRESHOLD = 50;
  readonly dragOffset = signal(0);
  readonly isDragging = signal(false);

  /* pinch state */
  private initialPinchDist = 0;
  private pinchZoomStart = 0;

  /* pan state */
  private panStartX = 0;
  private panStartY = 0;
  private panOriginX = 0;
  private panOriginY = 0;
  private hasPanned = false;

  /* cached pan bounds (recached on zoom/resize, not during drag) */
  private cachedMaxPanX = 0;
  private cachedMaxPanY = 0;

  constructor() {
    this.startAutoPlay();
  }

  get currentProject(): Project {
    return this.projects()[this.currentIndex()];
  }

  // ── Autoplay ────────────────────────────────────────────────────

  /**
   * Drives both the progress bar and slide advancement via a single
   * 50 ms interval. This keeps them perfectly in sync — unlike the
   * previous approach of a CSS animation + separate setInterval which
   * drifted apart on pause/resume and manual navigation.
   */
  startAutoPlay(): void {
    this.stopAutoPlay();
    this.slideStartTime = performance.now();
    this.progress.set(0);

    this.autoPlayInterval = setInterval(() => {
      if (this.isPaused()) return;

      const elapsed = performance.now() - this.slideStartTime;
      const pct = Math.min(elapsed / 5000, 1);
      this.progress.set(pct);

      if (pct >= 1) {
        this.next();
      }
    }, 50);
  }

  stopAutoPlay(): void {
    if (this.autoPlayInterval !== null) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  next(): void {
    this.currentIndex.update((i) => (i + 1) % this.projects().length);
    this.resetSlideTimer();
  }

  prev(): void {
    this.currentIndex.update(
      (i) => (i - 1 + this.projects().length) % this.projects().length,
    );
    this.resetSlideTimer();
  }

  goToSlide(index: number): void {
    this.currentIndex.set(index);
    this.resetSlideTimer();
  }

  private resetSlideTimer(): void {
    this.slideStartTime = performance.now();
    this.progress.set(0);
  }

  pauseAutoPlay(): void {
    this.pauseCount++;
    this.isPaused.set(true);
  }

  resumeAutoPlay(): void {
    this.pauseCount--;
    if (this.pauseCount <= 0) {
      this.pauseCount = 0;
      this.isPaused.set(false);
      // Adjust slideStartTime so the paused duration is not counted,
      // keeping the remaining time accurate for the current slide.
      this.slideStartTime = performance.now() - (this.progress() * 5000);
    }
  }

  // ── Lightbox open / close ──────────────────────────────────────

  openZoom(): void {
    this.isZoomed.set(true);
    this.resetZoom();
    this.pauseAutoPlay();
  }

  closeZoom(): void {
    this.isZoomed.set(false);
    this.resumeAutoPlay();
  }

  // ── Zoom controls ──────────────────────────────────────────────

  clampZoom(value: number): number {
    return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value));
  }

  zoomIn(): void {
    this.zoomLevel.update((z) => this.clampZoom(z + ZOOM_STEP));
    this.recalcPanBounds();
    this.clampPan();
  }

  zoomOut(): void {
    this.zoomLevel.update((z) => this.clampZoom(z - ZOOM_STEP));
    this.recalcPanBounds();
    this.clampPan();
  }

  setZoom(value: number): void {
    this.zoomLevel.set(this.clampZoom(value));
    this.recalcPanBounds();
    this.clampPan();
  }

  onSliderInput(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(value)) {
      this.setZoom(value);
    }
  }

  resetZoom(): void {
    this.zoomLevel.set(1);
    this.panX.set(0);
    this.panY.set(0);
  }

  /**
   * Recalculate pan bounds from the DOM and cache them.
   * Should be called when zoom changes or the viewport resizes.
   */
  recalcPanBounds(): void {
    if (this.zoomLevel() <= 1) {
      this.cachedMaxPanX = 0;
      this.cachedMaxPanY = 0;
      return;
    }

    const figure = document.querySelector<HTMLElement>('.lightbox-figure');
    const img = document.querySelector<HTMLImageElement>('.lightbox-image');
    if (!figure || !img) return;

    const contW = figure.offsetWidth;
    const contH = figure.offsetHeight;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    if (!imgW || !imgH) return;

    const z = this.zoomLevel();
    this.cachedMaxPanX = Math.max(0, (imgW * z - contW) / (2 * z));
    this.cachedMaxPanY = Math.max(0, (imgH * z - contH) / (2 * z));
  }

  /**
   * Clamp panX/panY to the cached bounds (fast, no DOM reads).
   */
  clampPan(): void {
    if (this.zoomLevel() <= 1) {
      this.panX.set(0);
      this.panY.set(0);
      return;
    }

    if (this.cachedMaxPanX === 0 && this.cachedMaxPanY === 0) {
      // bounds not yet computed — try once, then bail
      this.recalcPanBounds();
      if (this.cachedMaxPanX === 0 && this.cachedMaxPanY === 0) return;
    }

    this.panX.update((px) =>
      Math.min(this.cachedMaxPanX, Math.max(-this.cachedMaxPanX, px)),
    );
    this.panY.update((py) =>
      Math.min(this.cachedMaxPanY, Math.max(-this.cachedMaxPanY, py)),
    );
  }

  get zoomPercent(): number {
    return Math.round(this.zoomLevel() * 100);
  }

  // ── Scroll-to-zoom (mouse wheel) ───────────────────────────────

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (!this.isZoomed()) return;

    const target = event.target as HTMLElement | null;
    if (!target?.closest('.lightbox-overlay')) return;

    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  // ── Pinch-to-zoom (touch) ──────────────────────────────────────

  onLightboxTouchStart(event: TouchEvent): void {
    if (!this.isZoomed()) return;

    if (event.touches.length === 2) {
      // pinch start
      event.preventDefault();
      this.isInteracting.set(true);
      this.initialPinchDist = this.pinchDistance(event);
      this.pinchZoomStart = this.zoomLevel();
    } else if (event.touches.length === 1 && this.zoomLevel() > 1) {
      // pan start (zoomed in)
      this.isInteracting.set(true);
      this.hasPanned = false;
      this.isPanning.set(true);
      this.panStartX = event.touches[0].clientX;
      this.panStartY = event.touches[0].clientY;
      this.panOriginX = this.panX();
      this.panOriginY = this.panY();
    }
  }

  onLightboxTouchMove(event: TouchEvent): void {
    if (!this.isZoomed()) return;

    if (event.touches.length === 2 && this.initialPinchDist > 0) {
      event.preventDefault();
      const newDist = this.pinchDistance(event);
      const ratio = newDist / this.initialPinchDist;
      this.zoomLevel.set(
        this.clampZoom(this.pinchZoomStart * ratio),
      );
      this.recalcPanBounds();
      this.clampPan();
    } else if (event.touches.length === 1 && this.isPanning()) {
      event.preventDefault();
      this.hasPanned = true;
      const dx = event.touches[0].clientX - this.panStartX;
      const dy = event.touches[0].clientY - this.panStartY;
      this.panX.set(this.panOriginX + dx);
      this.panY.set(this.panOriginY + dy);
      this.clampPan();
    }
  }

  onLightboxTouchEnd(_event: TouchEvent): void {
    this.initialPinchDist = 0;
    this.isPanning.set(false);
    this.isInteracting.set(false);
  }

  private pinchDistance(event: TouchEvent): number {
    const t = event.touches;
    const dx = t[0].clientX - t[1].clientX;
    const dy = t[0].clientY - t[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // ── Mouse pan (zoom > 1) ──────────────────────────────────────

  onOverlayClick(_event: MouseEvent): void {
    // If the user just finished a pan/drag, don't close
    if (this.hasPanned) {
      this.hasPanned = false;
      return;
    }
    this.closeZoom();
  }

  /**
   * Double-click on the image/figure to reset zoom to 100%.
   * Clicks on the figure are stopped from propagating to the overlay
   * so the first click of a double-click doesn't close the lightbox.
   */
  onFigureDblClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.zoomLevel() > 1) {
      this.resetZoom();
    }
  }

  onLightboxMouseDown(event: MouseEvent): void {
    if (!this.isZoomed() || this.zoomLevel() <= 1) return;
    this.isInteracting.set(true);
    this.hasPanned = false;
    this.isPanning.set(true);
    this.panStartX = event.clientX;
    this.panStartY = event.clientY;
    this.panOriginX = this.panX();
    this.panOriginY = this.panY();
    // Don't preventDefault here — it would block dblclick from firing.
    // Text selection is already blocked via user-select: none in CSS.
  }

  @HostListener('document:mousemove', ['$event'])
  onLightboxMouseMove(event: MouseEvent): void {
    if (!this.isPanning()) return;
    event.preventDefault();
    this.hasPanned = true;
    const dx = event.clientX - this.panStartX;
    const dy = event.clientY - this.panStartY;
    this.panX.set(this.panOriginX + dx);
    this.panY.set(this.panOriginY + dy);
    this.clampPan();
  }

  @HostListener('document:mouseup')
  onLightboxMouseUp(): void {
    this.isPanning.set(false);
    this.isInteracting.set(false);
  }

  // ── Swipe for carousel ─────────────────────────────────────────

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.dragOffset.set(0);
    this.isDragging.set(true);
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging()) return;
    const rawDelta = event.touches[0].clientX - this.touchStartX;
    const resisted = rawDelta * 0.4;
    this.dragOffset.set(resisted);
  }

  onTouchEnd(event: TouchEvent): void {
    this.isDragging.set(false);

    const deltaX = event.changedTouches[0].clientX - this.touchStartX;
    const deltaY = Math.abs(event.changedTouches[0].clientY - this.touchStartY);

    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > this.SWIPE_THRESHOLD
    ) {
      if (deltaX > 0) {
        this.prev();
      } else {
        this.next();
      }
    }

    requestAnimationFrame(() => this.dragOffset.set(0));
  }

  // ── Keyboard ───────────────────────────────────────────────────

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isZoomed()) {
      this.closeZoom();
    }
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft(): void {
    if (!this.isZoomed()) {
      this.prev();
    }
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    if (!this.isZoomed()) {
      this.next();
    }
  }

  // ── Window resize ──────────────────────────────────────────────

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.isZoomed()) {
      this.recalcPanBounds();
      this.clampPan();
    }
  }

  // ── Cleanup ────────────────────────────────────────────────────

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }
}
