import {Component, Input, OnInit, SimpleChanges, TemplateRef} from '@angular/core';
import {CalendarDay, CalendarEvent, CalendarEventEnhanced} from './month-calendar.model';
import {MonthCalendarService} from './month-calendar.service';

@Component({
  selector: 'app-month-calendar',
  templateUrl: './month-calendar.component.html',
  styleUrls: ['./month-calendar.component.scss']
})
export class MonthCalendarComponent implements OnInit {

  @Input()
  viewDate: Date;

  @Input()
  weekStart: number;

  @Input()
  weekHeaderTemplate!: TemplateRef<any>;

  @Input()
  events: Array<CalendarEvent>;

  constructor(public calendarService: MonthCalendarService) {}

  weekHeaders(): Array<string> {
    return this.calendarService.getWeekHeaders();
  }

  weeks(): Array<Array<CalendarDay>> {
    return this.calendarService.getWeeks();
  }

  eventsEnhanced(): Array<CalendarEventEnhanced> {
    return this.calendarService.getEventsEnhanced();
  }

  ngOnInit() {
    if (typeof this.viewDate === 'undefined') {
      this.viewDate = new Date();
    }
    this.calendarService.updateViewDate(this.viewDate, this.weekStart);
    this.calendarService.updateEvents(this.events);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.viewDate || changes.weekStart) {
      this.calendarService.updateViewDate(this.viewDate, this.weekStart);
      this.calendarService.updateEvents(this.events);
    } else if (changes.events) {
      this.calendarService.updateEvents(this.events);
    }
  }

}
