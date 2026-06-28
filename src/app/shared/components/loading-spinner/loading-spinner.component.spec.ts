import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let fixture: ComponentFixture<LoadingSpinnerComponent>;
  let component: LoadingSpinnerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the spinner overlay', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const overlay = compiled.querySelector('.spinner-overlay');
    expect(overlay).toBeTruthy();
  });

  it('should have a role of status for accessibility', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const overlay = compiled.querySelector('.spinner-overlay');
    expect(overlay?.getAttribute('role')).toBe('status');
  });

  it('should render the spinning rings', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const rings = compiled.querySelectorAll('.spinner-ring');
    expect(rings.length).toBe(2);
  });
});
