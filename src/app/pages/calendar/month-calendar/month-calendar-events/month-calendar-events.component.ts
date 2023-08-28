import {Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {CalendarDay, CalendarEventEnhanced} from '../month-calendar.model';
import {MonthCalendarService} from '../month-calendar.service';

@Component({
  selector: 'app-month-calendar-events',
  templateUrl: './month-calendar-events.component.html',
  styleUrls: ['./month-calendar-events.component.scss']
})
export class MonthCalendarEventsComponent implements OnInit {

  @Input()
  week: Array<CalendarDay>;

  @Input()
  rowId: number;

  @Input()
  last: boolean;

  @ViewChild("eventsContainer")
  eventsContainer: ElementRef;

  @ViewChild("calendarGridRowBg")
  calendarGridRowBg: ElementRef;

  @Input()
  events: Array<CalendarEventEnhanced>;

  @Input()
  monthCalendarService: MonthCalendarService;

  constructor(private ref: ElementRef, private renderer: Renderer2) { }


  ngOnInit(): void {
  }

  ngAfterViewChecked() {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.eventsContainer && this.calendarGridRowBg) {
      var eventsHeight = this.eventsContainer.nativeElement.offsetHeight;
      var bgHeight = this.calendarGridRowBg.nativeElement.offsetHeight;
      if (eventsHeight > bgHeight) {
        var height = `${eventsHeight}px`;
        this.renderer.setStyle(this.calendarGridRowBg.nativeElement, "height", height);
      }
    }
  }

  getEventTracks() {
    const events = this.monthCalendarService.getWeeklyTracks(this.rowId);
    return events;
  }

}
