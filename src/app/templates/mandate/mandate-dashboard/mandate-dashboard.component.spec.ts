import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateDashboardComponent } from './mandate-dashboard.component';

describe('MandateDashboardComponent', () => {
  let component: MandateDashboardComponent;
  let fixture: ComponentFixture<MandateDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
