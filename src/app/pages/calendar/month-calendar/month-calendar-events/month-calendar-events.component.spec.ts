import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthCalendarEventsComponent } from './month-calendar-events.component';

describe('MonthCalendarEventsComponent', () => {
  let component: MonthCalendarEventsComponent;
  let fixture: ComponentFixture<MonthCalendarEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthCalendarEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthCalendarEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
