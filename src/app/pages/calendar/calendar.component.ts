import { Component, OnInit, VERSION } from '@angular/core';
import {CalendarEvent} from './month-calendar/month-calendar.model';
import {CalendarDate, CalendarUtils} from './utils/date-utils';



@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  name = 'Angular ' + VERSION.major;
  viewDate: CalendarDate;
  weekStart: number = 0;
  events: Array<CalendarEvent>;
  constructor() { }

  ngOnInit() {
    this.viewDate = CalendarUtils.instance();
    this.events = [{
      startDate: new Date('08/18/2023'),
      id: '1',
      name: 'Event 1 witih a long long name that is really long that really really won\'t fit',
      color: "#AD2121"
    }, {
      startDate: new Date('08/24/2023'),
      endDate: new Date('08/24/2023'),
      id: '11',
      name: 'Event 11'
    }, {
      startDate: new Date('08/15/2023'),
      endDate: new Date('08/15/2023'),
      id: '2',
      name: 'Event 2',
      color: "#1E90FF"
    }, {
      startDate: new Date('08/13/2023'),
      endDate: new Date('08/13/2023'),
      id: '2',
      name: 'Event 3',
    }, {
      startDate: new Date('08/10/2023'),
      endDate: new Date('08/10/2023'),
      id: '4',
      name: 'Event 4',
    }, {
      startDate: new Date('08/06/2023'),
      endDate: new Date('08/07/2023'),
      id: '5',
      name: 'Event 5 witih a long long name that is really long that will try to fit',
    }, {
      startDate: new Date('08/04/2023'),
      id: '6',
      name: 'Event 6',
    }, {
      startDate: new Date('08/01/2023'),
      endDate: new Date('08/02/2023'),
      id: '7',
      name: 'Event 7',
    }];
  }

  onPreviousMonth() {
    this.viewDate = this.viewDate.prevMonth();
  }

  onToday() {
    this.viewDate = CalendarUtils.instance();
  }

  onNextMonth() {
    this.viewDate = this.viewDate.nextMonth();
  }


}
