import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePaintingComponent } from './update-painting.component';

describe('UpdatePaintingComponent', () => {
  let component: UpdatePaintingComponent;
  let fixture: ComponentFixture<UpdatePaintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePaintingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePaintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
