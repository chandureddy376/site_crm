import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverduesDashboardComponent } from './overdues-dashboard.component';

describe('OverduesDashboardComponent', () => {
  let component: OverduesDashboardComponent;
  let fixture: ComponentFixture<OverduesDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverduesDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverduesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
