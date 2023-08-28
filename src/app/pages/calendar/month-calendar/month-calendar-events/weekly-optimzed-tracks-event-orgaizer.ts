import {CalendarCell, CalendarDay, CalendarEventEnhanced} from '../month-calendar.model';
import {EventsOrganizer, EventTracks} from './events-organizer';
import {CalendarDate, CalendarUtils} from '../../utils/date-utils';
import {EventSorter} from './event-sorter';

export class WeeklyOptimzedTracksEventOrganizer implements EventsOrganizer {
  private weeks: Array<Array<CalendarDay>>;
  private events: Array<CalendarEventEnhanced>;
  private weeklyTracks: Array<EventTracks> = [];
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
    this.arrangeEventsToCells();
    this.weeklyTracks = this.calculateWeeklyEventTracks();
  }

  getTracks(): Array<EventTracks> {
    return this.weeklyTracks;
  }

  private dateAsString(dt: Date) {
    return CalendarUtils.instance(dt).format('MM/DD/YYYY');
  }

  private arrangeEventsToCells() {
    const sortedEvents = EventSorter.sort(this.events);
    const firstCalDate = CalendarUtils.instance(this.weeks[0][0].date);
    const lastCalDate = CalendarUtils.instance(
      this.weeks[this.weeks.length - 1][6].date
    );

    sortedEvents.forEach((event) => {
      if (event.numberOfDays === 1) {
        const cell = this.calCells.get(this.dateAsString(event.startDate));
        if (cell) {
          const track = this.findOptimalTrack([cell]);
          cell.events[track] = { ...event, start: true, end: true, length: 1 };
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
          const track = this.findOptimalTrack(eventCells);
          const trackLengths = this.calculateTrackLengths(eventCells);
          eventCells.forEach((eventCell, idx) => {
            eventCell.events[track] = {
              ...event,
              start: idx === 0,
              end: idx === eventCells.length - 1,
              length: trackLengths[eventCell.row],
            };
          });
        }
      }
    });
  }

  private findOptimalTrack(cells: Array<CalendarCell>): number {
    const numberOfCells = cells.length;
    const maxEvents = Math.max(
      ...cells.map((cell) => {
        return cell.events.length;
      })
    );
    let availableIdx = -1;
    for (let i = 0; i < maxEvents; i++) {
      availableIdx = i;
      for (let j = 0; j < numberOfCells; j++) {
        if (typeof cells[j].events[i] !== 'undefined') {
          availableIdx = -1;
          break;
        }
      }
      if (availableIdx !== -1) {
        break;
      }
    }

    if (availableIdx === -1) {
      availableIdx = maxEvents;
    }
    return availableIdx;
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

  private calculateWeeklyEventTracks(): Array<EventTracks> {
    const weeklyTracks: Array<EventTracks> = [];
    this.weeks.forEach((weekDays, weekId) => {
      const eventTracks = [];
      if (weekDays) {
        const weekLength = weekDays.length;
        const trackCount = Math.max(
          ...weekDays.map((weekDay) => {
            return weekDay.cell.events.length;
          })
        );
        for (let track = 0; track < trackCount; track++) {
          if (typeof eventTracks[track] === 'undefined') {
            eventTracks[track] = [];
          }
          for (let cell = 0; cell < weekLength; cell++) {
            const weekDay = weekDays[cell];
            if (typeof weekDay.cell.events[track] !== 'undefined') {
              eventTracks[track][cell] = weekDay.cell.events[track];
              cell += weekDay.cell.events[track].length - 1;
            }
          }
        }
      }
      weeklyTracks[weekId] = eventTracks;
    });
    return weeklyTracks;
  }
}
