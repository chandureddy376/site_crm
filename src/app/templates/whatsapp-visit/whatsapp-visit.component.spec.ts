import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappVisitComponent } from './whatsapp-visit.component';

describe('WhatsappVisitComponent', () => {
  let component: WhatsappVisitComponent;
  let fixture: ComponentFixture<WhatsappVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
