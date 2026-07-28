import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { CarouselComponent } from './carousel.component';
import { TranslationService } from '../../../core/services/translation.service';
import { signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  bootstrapX,
  bootstrapChevronLeft,
  bootstrapChevronRight,
  bootstrapZoomIn,
  bootstrapZoomOut,
} from '@ng-icons/bootstrap-icons';
import { EN } from '../../i18n/en';
import { PROJECTS } from '../../../core/models/project.model';
import type { Translation, Language } from '../../i18n/translations';

describe('CarouselComponent', () => {
  let fixture: ComponentFixture<CarouselComponent>;
  let component: CarouselComponent;
  let currentLang: ReturnType<typeof signal<Language>>;
  let tSignal: ReturnType<typeof signal<Translation>>;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    currentLang = signal<Language>('en');
    tSignal = signal<Translation>(EN);

    await TestBed.configureTestingModule({
      imports: [CarouselComponent],
      providers: [
        {
          provide: TranslationService,
          useValue: {
            t: tSignal as unknown as TranslationService['t'],
            currentLang,
          },
        },
        provideIcons({
          bootstrapX,
          bootstrapChevronLeft,
          bootstrapChevronRight,
          bootstrapZoomIn,
          bootstrapZoomOut,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('projects', PROJECTS);
    fixture.detectChanges();
  });

  it('should create instance', () => {
    expect(component).toBeTruthy();
  });

  it('should inject TranslationService', () => {
    expect(component.translation).toBeTruthy();
  });

  it('should receive projects via input', () => {
    expect(component.projects()).toBe(PROJECTS);
    expect(component.projects().length).toBeGreaterThan(0);
  });

  it('should start at index 0', () => {
    expect(component.currentIndex()).toBe(0);
  });

  it('should render one project card component', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-project-card');
    expect(cards.length).toBe(1);
  });

  it('should render project title in card', () => {
    const titleEl = fixture.nativeElement.querySelector('.projects-title');
    expect(titleEl?.textContent).toContain(PROJECTS[0].title);
  });

  describe('navigation', () => {
    it('should navigate to next slide via next()', () => {
      component.next();
      expect(component.currentIndex()).toBe(1);
    });

    it('should wrap to first slide after last', () => {
      component.goToSlide(PROJECTS.length - 1);
      component.next();
      expect(component.currentIndex()).toBe(0);
    });

    it('should navigate to previous slide via prev()', () => {
      component.next();
      component.prev();
      expect(component.currentIndex()).toBe(0);
    });

    it('should wrap to last slide going prev from first', () => {
      component.prev();
      expect(component.currentIndex()).toBe(PROJECTS.length - 1);
    });

    it('should go to specific slide via goToSlide()', () => {
      component.goToSlide(1);
      expect(component.currentIndex()).toBe(1);
    });

    it('should navigate via next arrow button click', () => {
      const nextArrow = fixture.nativeElement.querySelector(
        '.carousel-arrow--next',
      ) as HTMLButtonElement;
      nextArrow.click();
      expect(component.currentIndex()).toBe(1);
    });

    it('should navigate via prev arrow button click', () => {
      component.next();
      fixture.detectChanges();
      const prevArrow = fixture.nativeElement.querySelector(
        '.carousel-arrow--prev',
      ) as HTMLButtonElement;
      prevArrow.click();
      expect(component.currentIndex()).toBe(0);
    });
  });

  describe('dots', () => {
    it('should render navigation dots equal to projects count', () => {
      const dots = fixture.nativeElement.querySelectorAll('.carousel-dot');
      expect(dots.length).toBe(PROJECTS.length);
    });

    it('should highlight the active dot', () => {
      component.goToSlide(1);
      fixture.detectChanges();
      const dots = fixture.nativeElement.querySelectorAll('.carousel-dot');
      expect(dots[1].classList.contains('active')).toBe(true);
      expect(dots[0].classList.contains('active')).toBe(false);
    });

    it('should go to slide when dot is clicked', () => {
      const dots = fixture.nativeElement.querySelectorAll(
        '.carousel-dot',
      ) as NodeListOf<HTMLButtonElement>;
      dots[1].click();
      expect(component.currentIndex()).toBe(1);
      dots[0].click();
      expect(component.currentIndex()).toBe(0);
    });
  });

  describe('keyboard navigation', () => {
    it('should go to next slide on ArrowRight keydown', () => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight' }),
      );
      expect(component.currentIndex()).toBe(1);
    });

    it('should go to previous slide on ArrowLeft keydown', () => {
      component.next();
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
      );
      expect(component.currentIndex()).toBe(0);
    });

    it('should wrap around on ArrowRight at last slide', () => {
      component.goToSlide(PROJECTS.length - 1);
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight' }),
      );
      expect(component.currentIndex()).toBe(0);
    });

    it('should wrap around on ArrowLeft at first slide', () => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
      );
      expect(component.currentIndex()).toBe(PROJECTS.length - 1);
    });

    it('should not navigate on ArrowRight when zoomed', () => {
      component.openZoom();
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight' }),
      );
      expect(component.currentIndex()).toBe(0);
    });

    it('should not navigate on ArrowLeft when zoomed', () => {
      component.openZoom();
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
      );
      expect(component.currentIndex()).toBe(0);
    });
  });

  describe('swipe gestures', () => {
    function touchEvent(
      clientX: number,
      clientY: number,
    ): TouchEvent {
      return {
        touches: [{ clientX, clientY }] as unknown as TouchList,
        changedTouches: [{ clientX, clientY }] as unknown as TouchList,
      } as TouchEvent;
    }

    function touchMoveEvent(clientX: number): TouchEvent {
      return {
        touches: [{ clientX, clientY: 100 }] as unknown as TouchList,
      } as TouchEvent;
    }

    it('should set isDragging on touch start', () => {
      component.onTouchStart(touchEvent(300, 100));
      expect(component.isDragging()).toBe(true);
      expect(component.dragOffset()).toBe(0);
    });

    it('should update dragOffset on touch move with resistance', () => {
      component.onTouchStart(touchEvent(300, 100));
      component.onTouchMove(touchMoveEvent(100));
      expect(component.dragOffset()).toBeCloseTo(-80, 0);
    });

    it('should clear isDragging and reset dragOffset on touch end', () => {
      jest.useFakeTimers();
      component.onTouchStart(touchEvent(300, 100));
      component.onTouchMove(touchMoveEvent(100));
      component.onTouchEnd(touchEvent(100, 100));
      expect(component.isDragging()).toBe(false);
      jest.advanceTimersByTime(20);
      expect(component.dragOffset()).toBe(0);
      jest.useRealTimers();
    });

    it('should not update dragOffset on touch move without touch start', () => {
      component.onTouchMove(touchMoveEvent(100));
      expect(component.dragOffset()).toBe(0);
    });

    it('should navigate to next slide on swipe left', () => {
      component.onTouchStart(touchEvent(300, 100));
      component.onTouchEnd(touchEvent(150, 100));
      expect(component.currentIndex()).toBe(1);
    });

    it('should navigate to previous slide on swipe right', () => {
      component.next();
      component.onTouchStart(touchEvent(100, 100));
      component.onTouchEnd(touchEvent(300, 100));
      expect(component.currentIndex()).toBe(0);
    });

    it('should not navigate on vertical swipe', () => {
      component.onTouchStart(touchEvent(150, 100));
      component.onTouchEnd(touchEvent(150, 300));
      expect(component.currentIndex()).toBe(0);
    });

    it('should not navigate on small horizontal swipe below threshold', () => {
      component.onTouchStart(touchEvent(200, 100));
      component.onTouchEnd(touchEvent(180, 100));
      expect(component.currentIndex()).toBe(0);
    });

    it('should wrap around on swipe left at last slide', () => {
      component.goToSlide(PROJECTS.length - 1);
      component.onTouchStart(touchEvent(300, 100));
      component.onTouchEnd(touchEvent(100, 100));
      expect(component.currentIndex()).toBe(0);
    });
  });

  describe('auto-advance', () => {
    it('should auto-advance every 5 seconds', () => {
      jest.useFakeTimers();
      const fix = TestBed.createComponent(CarouselComponent);
      const comp = fix.componentInstance;
      fix.componentRef.setInput('projects', PROJECTS);
      fix.detectChanges();
      jest.advanceTimersByTime(5000);
      expect(comp.currentIndex()).toBe(1);
      jest.advanceTimersByTime(5000);
      expect(comp.currentIndex()).toBe(0);
      jest.useRealTimers();
    });

    it('should wrap around when reaching the end', () => {
      jest.useFakeTimers();
      const fix = TestBed.createComponent(CarouselComponent);
      const comp = fix.componentInstance;
      fix.componentRef.setInput('projects', PROJECTS);
      fix.detectChanges();
      comp.goToSlide(PROJECTS.length - 1);
      jest.advanceTimersByTime(5000);
      expect(comp.currentIndex()).toBe(0);
      jest.useRealTimers();
    });

    it('should pause autoplay when isPaused is true', () => {
      jest.useFakeTimers();
      const fix = TestBed.createComponent(CarouselComponent);
      const comp = fix.componentInstance;
      fix.componentRef.setInput('projects', PROJECTS);
      fix.detectChanges();
      comp.pauseAutoPlay();
      jest.advanceTimersByTime(10000);
      expect(comp.currentIndex()).toBe(0);
      jest.useRealTimers();
    });

    it('should resume autoplay after being paused', () => {
      jest.useFakeTimers();
      const fix = TestBed.createComponent(CarouselComponent);
      const comp = fix.componentInstance;
      fix.componentRef.setInput('projects', PROJECTS);
      fix.detectChanges();
      comp.pauseAutoPlay();
      jest.advanceTimersByTime(5000);
      comp.resumeAutoPlay();
      jest.advanceTimersByTime(5000);
      expect(comp.currentIndex()).toBe(1);
      jest.useRealTimers();
    });

    it('should have isPaused initially false', () => {
      const fix = TestBed.createComponent(CarouselComponent);
      const comp = fix.componentInstance;
      fix.componentRef.setInput('projects', PROJECTS);
      fix.detectChanges();
      expect(comp.isPaused()).toBe(false);
    });
  });

  describe('progress bar', () => {
    it('should render progress bar container', () => {
      const bar = fixture.nativeElement.querySelector('.progress-bar');
      expect(bar).toBeTruthy();
    });

    it('should render progress fill element', () => {
      const fill = fixture.nativeElement.querySelector('.progress-fill');
      expect(fill).toBeTruthy();
    });

    it('should have paused class when isPaused is true', () => {
      component.pauseAutoPlay();
      fixture.detectChanges();
      const fill = fixture.nativeElement.querySelector('.progress-fill');
      expect(fill?.classList.contains('paused')).toBe(true);
    });

    it('should not have paused class when isPaused is false', () => {
      const fill = fixture.nativeElement.querySelector('.progress-fill');
      expect(fill?.classList.contains('paused')).toBe(false);
    });
  });

  describe('image zoom (lightbox)', () => {
    it('should open zoom when openZoom is called', () => {
      component.openZoom();
      expect(component.isZoomed()).toBe(true);
    });

    it('should pause autoplay when zoom opens', () => {
      component.openZoom();
      expect(component.isPaused()).toBe(true);
    });

    it('should resume autoplay when zoom closes', () => {
      component.openZoom();
      expect(component.isPaused()).toBe(true);
      component.closeZoom();
      expect(component.isPaused()).toBe(false);
    });

    it('should not change slide while zoomed even after 10 seconds', () => {
      jest.useFakeTimers();
      const fix = TestBed.createComponent(CarouselComponent);
      const comp = fix.componentInstance;
      fix.componentRef.setInput('projects', PROJECTS);
      fix.detectChanges();
      comp.openZoom();
      jest.advanceTimersByTime(10000);
      expect(comp.currentIndex()).toBe(0);
      jest.useRealTimers();
    });

    it('should allow hover pause and zoom pause to stack and unstack correctly', () => {
      component.pauseAutoPlay();
      expect(component.isPaused()).toBe(true);

      component.openZoom();
      expect(component.isPaused()).toBe(true);

      component.closeZoom();
      expect(component.isPaused()).toBe(true);

      component.resumeAutoPlay();
      expect(component.isPaused()).toBe(false);
    });

    it('should render lightbox when zoomed', () => {
      component.isZoomed.set(true);
      fixture.detectChanges();
      const overlay = fixture.nativeElement.querySelector('.lightbox-overlay');
      expect(overlay).toBeTruthy();
    });

    it('should not render lightbox when not zoomed', () => {
      const overlay = fixture.nativeElement.querySelector('.lightbox-overlay');
      expect(overlay).toBeFalsy();
    });

    it('should close zoom when closeZoom() is called', () => {
      component.isZoomed.set(true);
      fixture.detectChanges();
      component.closeZoom();
      fixture.detectChanges();
      const overlay = fixture.nativeElement.querySelector('.lightbox-overlay');
      expect(overlay).toBeFalsy();
      expect(component.isZoomed()).toBe(false);
    });

    it('should close zoom when close button is clicked', () => {
      component.isZoomed.set(true);
      fixture.detectChanges();
      const closeBtn = fixture.nativeElement.querySelector(
        '.lightbox-close',
      ) as HTMLButtonElement;
      closeBtn.click();
      fixture.detectChanges();
      const overlay = fixture.nativeElement.querySelector('.lightbox-overlay');
      expect(overlay).toBeFalsy();
    });

    it('should close zoom when overlay background is clicked', () => {
      component.isZoomed.set(true);
      fixture.detectChanges();
      const overlay = fixture.nativeElement.querySelector(
        '.lightbox-overlay',
      ) as HTMLElement;
      overlay.click();
      fixture.detectChanges();
      expect(component.isZoomed()).toBe(false);
    });

    it('should close zoom on Escape keydown', () => {
      component.isZoomed.set(true);
      fixture.detectChanges();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(component.isZoomed()).toBe(false);
    });

    it('should do nothing on Escape keydown when not zoomed', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(component.isZoomed()).toBe(false);
    });

    it('should not close zoom on non-Escape keydown', () => {
      component.isZoomed.set(true);
      fixture.detectChanges();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(component.isZoomed()).toBe(true);
    });

    it('should render lightbox image with correct project src', () => {
      component.isZoomed.set(true);
      fixture.detectChanges();
      const img = fixture.nativeElement.querySelector(
        '.lightbox-image',
      ) as HTMLImageElement;
      expect(img).toBeTruthy();
      expect(img.src).toContain(PROJECTS[0].imageUrlDark);
    });

    it('should render lightbox close button', () => {
      component.isZoomed.set(true);
      fixture.detectChanges();
      const closeBtn = fixture.nativeElement.querySelector(
        '.lightbox-close',
      ) as HTMLButtonElement;
      expect(closeBtn).toBeTruthy();
    });
  });

  describe('zoom controls', () => {
    beforeEach(() => {
      component.isZoomed.set(true);
      component.resetZoom();
      fixture.detectChanges();
    });

    it('should reset zoom on open', () => {
      component.openZoom();
      expect(component.zoomLevel()).toBe(1);
      expect(component.panX()).toBe(0);
      expect(component.panY()).toBe(0);
    });

    it('should zoom in by ZOOM_STEP via zoomIn()', () => {
      component.zoomIn();
      expect(component.zoomLevel()).toBe(1.25);
    });

    it('should zoom out by ZOOM_STEP via zoomOut()', () => {
      component.zoomIn();
      component.zoomIn();
      component.zoomOut();
      expect(component.zoomLevel()).toBe(1.25);
    });

    it('should not zoom below 1', () => {
      component.zoomOut();
      expect(component.zoomLevel()).toBe(1);
    });

    it('should not zoom above 5', () => {
      for (let i = 0; i < 20; i++) {
        component.zoomIn();
      }
      expect(component.zoomLevel()).toBe(5);
    });

    it('should set zoom via setZoom()', () => {
      component.setZoom(2);
      expect(component.zoomLevel()).toBe(2);
    });

    it('should clamp zoom via setZoom()', () => {
      component.setZoom(10);
      expect(component.zoomLevel()).toBe(5);
      component.setZoom(0);
      expect(component.zoomLevel()).toBe(1);
    });

    it('should reset pan when zoom is reset', () => {
      component.setZoom(2);
      component.panX.set(100);
      component.panY.set(50);
      component.resetZoom();
      expect(component.zoomLevel()).toBe(1);
      expect(component.panX()).toBe(0);
      expect(component.panY()).toBe(0);
    });

    it('should return correct zoomPercent', () => {
      component.setZoom(1.5);
      expect(component.zoomPercent).toBe(150);
    });

    it('should render zoom controls bar', () => {
      const controls = fixture.nativeElement.querySelector('.zoom-controls');
      expect(controls).toBeTruthy();
    });

    it('should render zoom slider', () => {
      const slider = fixture.nativeElement.querySelector('.zoom-slider') as HTMLInputElement;
      expect(slider).toBeTruthy();
      expect(slider.min).toBe('1');
      expect(slider.max).toBe('5');
    });

    it('should render zoom in and zoom out buttons', () => {
      const buttons = fixture.nativeElement.querySelectorAll('.zoom-btn');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('should render zoom percentage label', () => {
      const label = fixture.nativeElement.querySelector('.zoom-label');
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain('100%');
    });

    it('should show reset button when zoomed in', () => {
      component.setZoom(2);
      fixture.detectChanges();
      const resetBtn = fixture.nativeElement.querySelector('.zoom-btn--reset');
      expect(resetBtn).toBeTruthy();
    });

    it('should hide reset button at zoom 1', () => {
      const resetBtn = fixture.nativeElement.querySelector('.zoom-btn--reset');
      expect(resetBtn).toBeFalsy();
    });

    it('should disable zoom-out button at zoom 1', () => {
      const buttons = fixture.nativeElement.querySelectorAll('.zoom-btn');
      // First zoom button should be zoom-out (disabled at min)
      expect(buttons[0].hasAttribute('disabled')).toBe(true);
    });

    it('should disable zoom-in button at zoom 5', () => {
      component.setZoom(5);
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll('.zoom-btn');
      expect(buttons[1].hasAttribute('disabled')).toBe(true);
    });

    it('should respond to slider input', () => {
      const slider = fixture.nativeElement.querySelector('.zoom-slider') as HTMLInputElement;
      slider.value = '3';
      slider.dispatchEvent(new Event('input'));
      expect(component.zoomLevel()).toBe(3);
    });

    it('should update image transform style when zooming', () => {
      component.setZoom(2);
      fixture.detectChanges();
      const img = fixture.nativeElement.querySelector('.lightbox-image') as HTMLImageElement;
      expect(img.style.transform).toContain('scale(2)');
    });
  });

  describe('scroll zoom', () => {
    function dispatchWheel(deltaY: number): void {
      const overlay = fixture.nativeElement.querySelector('.lightbox-overlay') as HTMLElement;
      overlay.dispatchEvent(new WheelEvent('wheel', { deltaY, bubbles: true }));
    }

    beforeEach(() => {
      component.isZoomed.set(true);
      fixture.detectChanges();
    });

    it('should zoom in on wheel down (negative deltaY)', () => {
      dispatchWheel(-100);
      expect(component.zoomLevel()).toBe(1.25);
    });

    it('should zoom out on wheel up (positive deltaY)', () => {
      component.setZoom(2);
      dispatchWheel(100);
      expect(component.zoomLevel()).toBe(1.75);
    });

    it('should not zoom when not zoomed', () => {
      component.closeZoom();
      fixture.detectChanges();
      // No DOM overlay, so wheel event never fires — zoom stays at 1
      expect(component.zoomLevel()).toBe(1);
    });

    it('should clamp to min zoom on scroll out', () => {
      for (let i = 0; i < 20; i++) {
        dispatchWheel(100);
      }
      expect(component.zoomLevel()).toBe(1);
    });

    it('should clamp to max zoom on scroll in', () => {
      for (let i = 0; i < 30; i++) {
        dispatchWheel(-100);
      }
      expect(component.zoomLevel()).toBe(5);
    });
  });

  describe('pan (mouse)', () => {
    beforeEach(() => {
      component.isZoomed.set(true);
      component.setZoom(2);
      fixture.detectChanges();
    });

    it('should start panning on mousedown when zoomed', () => {
      const event = new MouseEvent('mousedown', { clientX: 100, clientY: 50 });
      component.onLightboxMouseDown(event);
      expect(component.isPanning()).toBe(true);
    });

    it('should not start panning on mousedown at zoom level 1', () => {
      component.setZoom(1);
      const event = new MouseEvent('mousedown', { clientX: 100, clientY: 50 });
      component.onLightboxMouseDown(event);
      expect(component.isPanning()).toBe(false);
    });

    it('should update pan during mousemove', () => {
      component.onLightboxMouseDown(new MouseEvent('mousedown', { clientX: 100, clientY: 50 }));
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 70 }));
      expect(component.panX()).toBe(50);
      expect(component.panY()).toBe(20);
    });

    it('should stop panning on mouseup', () => {
      component.onLightboxMouseDown(new MouseEvent('mousedown', { clientX: 100, clientY: 50 }));
      document.dispatchEvent(new MouseEvent('mouseup'));
      expect(component.isPanning()).toBe(false);
    });
  });

  describe('pan boundary clamping', () => {
    beforeEach(() => {
      component.isZoomed.set(true);
      component.setZoom(2);
      fixture.detectChanges();
      component.recalcPanBounds();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should reset pan to zero at zoom level 1', () => {
      component.setZoom(1);
      component.panX.set(100);
      component.panY.set(50);
      component.clampPan();
      expect(component.panX()).toBe(0);
      expect(component.panY()).toBe(0);
    });

    it('should clamp pan after zoomIn', () => {
      const spy = jest.spyOn(component, 'clampPan');
      component.zoomIn();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should clamp pan after zoomOut', () => {
      component.setZoom(2);
      const spy = jest.spyOn(component, 'clampPan');
      component.zoomOut();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should clamp pan after setZoom', () => {
      const spy = jest.spyOn(component, 'clampPan');
      component.setZoom(3);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should recalc bounds on window resize when zoomed', () => {
      const spy = jest.spyOn(component, 'recalcPanBounds');
      window.dispatchEvent(new Event('resize'));
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should not recalc bounds on window resize when not zoomed', () => {
      component.isZoomed.set(false);
      const spy = jest.spyOn(component, 'recalcPanBounds');
      window.dispatchEvent(new Event('resize'));
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should call clampPan after mousemove', () => {
      const spy = jest.spyOn(component, 'clampPan');
      component.onLightboxMouseDown(
        new MouseEvent('mousedown', { clientX: 100, clientY: 50 }),
      );
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 150, clientY: 70 }),
      );
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should clamp pan within bounds when cached bounds exist', () => {
      // Force cached bounds to a known value
      const comp = component as unknown as {
        cachedMaxPanX: number;
        cachedMaxPanY: number;
      };
      comp.cachedMaxPanX = 200;
      comp.cachedMaxPanY = 150;

      component.panX.set(500);
      component.panY.set(500);
      component.clampPan();
      expect(component.panX()).toBe(200);
      expect(component.panY()).toBe(150);

      component.panX.set(-500);
      component.panY.set(-500);
      component.clampPan();
      expect(component.panX()).toBe(-200);
      expect(component.panY()).toBe(-150);
    });

    it('should not change pan when within bounds', () => {
      const comp = component as unknown as {
        cachedMaxPanX: number;
        cachedMaxPanY: number;
      };
      comp.cachedMaxPanX = 200;
      comp.cachedMaxPanY = 150;

      component.panX.set(50);
      component.panY.set(30);
      component.clampPan();
      expect(component.panX()).toBe(50);
      expect(component.panY()).toBe(30);
    });
  });

  describe('touch pinch-to-zoom', () => {
    function twoFingerTouchEvent(
      x1: number, y1: number,
      x2: number, y2: number,
    ): TouchEvent {
      return {
        touches: [
          { clientX: x1, clientY: y1 },
          { clientX: x2, clientY: y2 },
        ] as unknown as TouchList,
        preventDefault: jest.fn(),
      } as unknown as TouchEvent;
    }

    beforeEach(() => {
      component.isZoomed.set(true);
      fixture.detectChanges();
    });

    it('should start pinch on two-finger touch', () => {
      component.onLightboxTouchStart(twoFingerTouchEvent(100, 100, 200, 100));
      expect(component.isInteracting()).toBe(true);
    });

    it('should zoom in on pinch spread', () => {
      component.onLightboxTouchStart(twoFingerTouchEvent(100, 100, 200, 100));
      // Spread fingers from 100px apart to 150px apart
      component.onLightboxTouchMove(twoFingerTouchEvent(100, 100, 250, 100));
      expect(component.zoomLevel()).toBeGreaterThan(1);
    });

    it('should zoom out on pinch close', () => {
      component.setZoom(2);
      component.onLightboxTouchStart(twoFingerTouchEvent(100, 100, 300, 100));
      // Close fingers from 200px apart to 100px apart
      component.onLightboxTouchMove(twoFingerTouchEvent(100, 100, 200, 100));
      expect(component.zoomLevel()).toBeLessThan(2);
    });

    it('should end pinch state on touch end', () => {
      component.onLightboxTouchStart(twoFingerTouchEvent(100, 100, 200, 100));
      component.onLightboxTouchMove(twoFingerTouchEvent(100, 100, 250, 100));
      component.onLightboxTouchEnd({} as TouchEvent);
      expect(component.isPanning()).toBe(false);
      expect(component.isInteracting()).toBe(false);
    });
  });

  describe('touch pan when zoomed', () => {
    function singleTouchEvent(clientX: number, clientY: number): TouchEvent {
      return {
        touches: [{ clientX, clientY }] as unknown as TouchList,
        changedTouches: [{ clientX, clientY }] as unknown as TouchList,
        preventDefault: jest.fn(),
      } as unknown as TouchEvent;
    }

    beforeEach(() => {
      component.isZoomed.set(true);
      component.setZoom(2);
      fixture.detectChanges();
    });

    it('should start touch pan when zoomed on single touch', () => {
      component.onLightboxTouchStart(singleTouchEvent(100, 50));
      expect(component.isPanning()).toBe(true);
      expect(component.isInteracting()).toBe(true);
    });

    it('should not start touch pan at zoom level 1', () => {
      component.setZoom(1);
      component.onLightboxTouchStart(singleTouchEvent(100, 50));
      expect(component.isPanning()).toBe(false);
    });

    it('should update pan on touch move', () => {
      component.onLightboxTouchStart(singleTouchEvent(100, 50));
      component.onLightboxTouchMove(singleTouchEvent(150, 70));
      expect(component.panX()).toBe(50);
      expect(component.panY()).toBe(20);
    });
  });

  describe('zoom edge cases', () => {
    it('should not zoom on wheel when not zoomed', () => {
      const spy = jest.spyOn(component, 'zoomIn');
      document.dispatchEvent(new WheelEvent('wheel', { deltaY: -100 }));
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should not zoom on wheel when event target is outside overlay', () => {
      component.isZoomed.set(true);
      fixture.detectChanges();
      const spy = jest.spyOn(component, 'zoomIn');
      // Dispatch wheel on document body (outside overlay)
      document.body.dispatchEvent(new WheelEvent('wheel', { deltaY: -100, bubbles: true }));
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should handle slider NaN input gracefully', () => {
      const inputEvent = new Event('input');
      Object.defineProperty(inputEvent, 'target', {
        value: { value: 'not-a-number' },
      });
      const setZoomSpy = jest.spyOn(component, 'setZoom');
      component.onSliderInput(inputEvent);
      expect(setZoomSpy).not.toHaveBeenCalled();
      setZoomSpy.mockRestore();
    });

    it('should not close zoom on overlay click after panning', () => {
      component.isZoomed.set(true);
      component.setZoom(2);
      fixture.detectChanges();

      // Simulate a pan
      component.onLightboxMouseDown(new MouseEvent('mousedown', { clientX: 100, clientY: 50 }));
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 70 }));
      document.dispatchEvent(new MouseEvent('mouseup'));

      // Click on overlay — should NOT close because hasPanned is true
      component.onOverlayClick(new MouseEvent('click'));
      expect(component.isZoomed()).toBe(true);
    });

    it('should stop propagation on figure click', () => {
      const event = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
      // Simulate the template's (click)="$event.stopPropagation()" on the figure
      event.stopPropagation();
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should reset zoom on double-click when zoomed', () => {
      component.isZoomed.set(true);
      component.setZoom(2);
      fixture.detectChanges();

      const event = new MouseEvent('dblclick');
      component.onFigureDblClick(event);

      expect(component.zoomLevel()).toBe(1);
      expect(component.panX()).toBe(0);
      expect(component.panY()).toBe(0);
    });

    it('should not reset zoom on double-click when not zoomed', () => {
      component.isZoomed.set(true);
      component.setZoom(1);
      fixture.detectChanges();

      const event = new MouseEvent('dblclick');
      component.onFigureDblClick(event);

      expect(component.zoomLevel()).toBe(1);
    });
  });

  describe('content update on slide change', () => {
    it('should update displayed content when slide changes', () => {
      const originalTitle =
        fixture.nativeElement.querySelector('.projects-title')?.textContent;
      component.next();
      fixture.detectChanges();
      const newTitle =
        fixture.nativeElement.querySelector('.projects-title')?.textContent;
      expect(newTitle).not.toBe(originalTitle);
      expect(newTitle).toContain(PROJECTS[1].title);
    });
  });

  describe('cleanup', () => {
    it('should clear interval on destroy', () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      fixture.destroy();
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });
});
