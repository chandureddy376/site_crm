import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatePlansComponent } from './mandate-plans.component';

describe('MandatePlansComponent', () => {
  let component: MandatePlansComponent;
  let fixture: ComponentFixture<MandatePlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatePlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
