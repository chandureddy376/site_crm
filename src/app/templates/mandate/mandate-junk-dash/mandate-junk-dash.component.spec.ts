import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateJunkDashComponent } from './mandate-junk-dash.component';

describe('MandateJunkDashComponent', () => {
  let component: MandateJunkDashComponent;
  let fixture: ComponentFixture<MandateJunkDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateJunkDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateJunkDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
