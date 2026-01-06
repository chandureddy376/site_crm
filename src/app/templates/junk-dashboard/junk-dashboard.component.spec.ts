import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JunkDashboardComponent } from './junk-dashboard.component';

describe('JunkDashboardComponent', () => {
  let component: JunkDashboardComponent;
  let fixture: ComponentFixture<JunkDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JunkDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JunkDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
