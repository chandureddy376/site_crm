import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateClosedformComponent } from './mandate-closedform.component';

describe('ClosedformComponent', () => {
  let component: MandateClosedformComponent;
  let fixture: ComponentFixture<MandateClosedformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateClosedformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateClosedformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
