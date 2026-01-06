import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateInactiveJunkComponent } from './mandate-inactive-junk.component';

describe('MandateInactiveJunkComponent', () => {
  let component: MandateInactiveJunkComponent;
  let fixture: ComponentFixture<MandateInactiveJunkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateInactiveJunkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateInactiveJunkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
