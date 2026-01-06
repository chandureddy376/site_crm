import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignLeadsComponent } from './campaign-leads.component';

describe('CampaignLeadsComponent', () => {
  let component: CampaignLeadsComponent;
  let fixture: ComponentFixture<CampaignLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
