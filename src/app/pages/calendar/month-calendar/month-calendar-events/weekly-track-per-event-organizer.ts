import {EventsOrganizer, EventTracks} from './events-organizer';
import {CalendarCell, CalendarDay, CalendarEventEnhanced} from '../month-calendar.model';
import {CalendarDate, CalendarUtils} from '../../utils/date-utils';
import {EventSorter} from './event-sorter';

export class WeeklyTrackPerEventOrganizer implements EventsOrganizer {
  weeks: Array<Array<CalendarDay>>;
  events: Array<CalendarEventEnhanced>;
  weeklyTracks: Array<EventTracks> = [];
  private calCells: Map<String, CalendarCell> = new Map();

  constructor(weeks: Array<Array<CalendarDay>>, events: Array<CalendarEventEnhanced>) {
    this.weeks = weeks;
    this.weeks.forEach( (week, row) => {
      week.forEach( (day, col) => {
        const cell = { row: row, col: col, events: [] };
        this.calCells.set(this.dateAsString(day.date), cell);
        day.cell = cell;
      })
    });
    this.events = events;
  }

  organize(): void {
    const sortedEvents = EventSorter.sort(this.events);
    const firstCalDate = CalendarUtils.instance(this.weeks[0][0].date);
    const lastCalDate = CalendarUtils.instance(
      this.weeks[this.weeks.length - 1][6].date
    );

    const weeklyTracks: Array<EventTracks> = [];

    sortedEvents.forEach((event) => {
      if (event.numberOfDays === 1) {
        const cell = this.calCells.get(this.dateAsString(event.startDate));
        if (cell) {
          let eventTracks = weeklyTracks[cell.row];
          if (typeof eventTracks === 'undefined') {
            eventTracks = [];
          }
          eventTracks[eventTracks.length][cell.col] =  { ...event, start: true, end: true, length: 1 };
        }
      } else {
        if (
          event.startCalendarDate.isAfter(lastCalDate) ||
          (event.endCalendarDate &&
            event.endCalendarDate.isBefore(firstCalDate))
        ) {
          // Skip if Event is out of range from calendar
        } else {
          const eventCells = this.getEventCells(event, firstCalDate, lastCalDate);
          const eventWeekRows = [];
          eventCells.forEach((eventCell, idx) => {
            if (typeof eventWeekRows[eventCell.row] === 'undefined') {
              eventWeekRows[eventCell.row] = {
                ...event,
                start: idx === 0,
                end: idx === eventCells.length - 1,
                length: 1
              }
            } else {
              eventWeekRows[eventCell.row].length += 1;
            }
          });
          eventWeekRows.forEach(eventWeekRow => {

          })
        }
      }
    });
  }

  private dateAsString(dt: Date) {
    return CalendarUtils.instance(dt).format('MM/DD/YYYY');
  }

  private getEventCells(event: CalendarEventEnhanced, firstCalDate: CalendarDate,lastCalDate: CalendarDate): Array<CalendarCell> {
    const eventCells: Array<CalendarCell> = [];
    let eventStartDate = event.startCalendarDate;
    if (event.startCalendarDate.isBefore(firstCalDate)) {
      eventStartDate = firstCalDate;
    }
    let eventDate = eventStartDate;
    while (true) {
      if (
        eventDate.isAfter(lastCalDate) ||
        (event.endCalendarDate && eventDate.isAfter(event.endCalendarDate))
      ) {
        break;
      }
      const cell = this.calCells.get(this.dateAsString(eventDate.toDate()));
      if (cell) {
        eventCells.push(cell);
      }
      eventDate = eventDate.daysAfter(1);
    }
    return eventCells;
  }

  private calculateTrackLengths(cells: Array<CalendarCell>): Array<number> {
    const trackLengths = [];
    for (let cell of cells) {
      if (typeof trackLengths[cell.row] === 'undefined') {
        trackLengths[cell.row] = 0;
      }
      trackLengths[cell.row] += 1;
    }
    return trackLengths;
  }

  getTracks(): Array<EventTracks> {
    return this.weeklyTracks;
  }
}
