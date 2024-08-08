import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintingComponent } from './painting.component';

describe('PaintingComponent', () => {
  let component: PaintingComponent;
  let fixture: ComponentFixture<PaintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
