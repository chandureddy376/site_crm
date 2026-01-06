import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpDedicatedLeadsComponent } from './cp-dedicated-leads.component';

describe('CpDedicatedLeadsComponent', () => {
  let component: CpDedicatedLeadsComponent;
  let fixture: ComponentFixture<CpDedicatedLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpDedicatedLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpDedicatedLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
