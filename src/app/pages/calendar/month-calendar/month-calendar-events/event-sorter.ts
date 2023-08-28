
import {CalendarEventEnhanced} from '../month-calendar.model';

export class EventSorter {
  static sort(eventsEnhanced: Array<CalendarEventEnhanced>): Array<CalendarEventEnhanced> {
    const sortedEvents = [...eventsEnhanced];
    sortedEvents.sort(EventSorter.compareFn);
    return sortedEvents;
  }

  static compareFn(a: CalendarEventEnhanced, b: CalendarEventEnhanced): number {
    if (a.numberOfDays === b.numberOfDays) {
      if (b.startCalendarDate.isSame(a.startCalendarDate)) {
        return 0;
      } else if (a.startCalendarDate.isAfter(b.startCalendarDate)) {
        return 1;
      } else {
        return -1;
      }
    } else {
      return b.numberOfDays - a.numberOfDays;
    }
  }
}
