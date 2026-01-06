import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyDashComponent } from './dummy-dash.component';

describe('DummyDashComponent', () => {
  let component: DummyDashComponent;
  let fixture: ComponentFixture<DummyDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DummyDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
