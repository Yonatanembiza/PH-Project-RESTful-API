import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintingRegistrationComponent } from './painting-registration.component';

describe('PaintingRegistrationComponent', () => {
  let component: PaintingRegistrationComponent;
  let fixture: ComponentFixture<PaintingRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintingRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaintingRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
