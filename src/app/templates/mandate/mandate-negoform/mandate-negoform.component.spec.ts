import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateNegoformComponent } from './mandate-negoform.component';

describe('MandateNegoformComponent', () => {
  let component: MandateNegoformComponent;
  let fixture: ComponentFixture<MandateNegoformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateNegoformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateNegoformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
