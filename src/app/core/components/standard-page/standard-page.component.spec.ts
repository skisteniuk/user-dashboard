import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardPageComponent } from './standard-page.component';

describe('StandardPageComponent', () => {
  let component: StandardPageComponent;
  let fixture: ComponentFixture<StandardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
