import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsupClientChatComponent } from './whatsup-client-chat.component';

describe('WhatsupClientChatComponent', () => {
  let component: WhatsupClientChatComponent;
  let fixture: ComponentFixture<WhatsupClientChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsupClientChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsupClientChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
