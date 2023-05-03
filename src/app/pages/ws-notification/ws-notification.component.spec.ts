import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WsNotificationComponent } from './ws-notification.component';

describe('WsNotificationComponent', () => {
  let component: WsNotificationComponent;
  let fixture: ComponentFixture<WsNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WsNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WsNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
