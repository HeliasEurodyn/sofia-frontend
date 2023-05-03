import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarWsNotificationComponent } from './navbar-ws-notification.component';

describe('NavbarWsNotificationComponent', () => {
  let component: NavbarWsNotificationComponent;
  let fixture: ComponentFixture<NavbarWsNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarWsNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarWsNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
