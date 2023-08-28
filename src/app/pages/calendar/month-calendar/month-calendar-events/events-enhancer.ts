import {CalendarEvent, CalendarEventEnhanced} from '../month-calendar.model';
import {CalendarUtils} from '../../utils/date-utils';
import {StringUtils} from '../../utils/string-utils';
import {ColorUtils} from '../../utils/color-utils';
import {CollectionUtils} from '../../utils/collection-utils';

export class EventsEnhancer {
  private eventColors: Map<string, string> = new Map();

  constructor(eventColors?: Map<string, string>) {
    if (eventColors) {
      this.eventColors = eventColors;
    }
  }

  enhanceEvents(events: Array<CalendarEvent>): Array<CalendarEventEnhanced> {
    const eevents = events.map((ce) => {
      const enhancedEvent = this.toEnahncedEvent(ce);
      this.setEventColor(enhancedEvent);
      return enhancedEvent;
    });
    return eevents;
  }

  private toEnahncedEvent(ce: CalendarEvent): CalendarEventEnhanced {
    const enhancedEvent: CalendarEventEnhanced = {...ce};
    enhancedEvent.startCalendarDate = CalendarUtils.instance(ce.startDate);
    if (ce.endDate) {
      enhancedEvent.endCalendarDate = CalendarUtils.instance(ce.endDate);
    }
    const start_date = enhancedEvent.startCalendarDate.resetTime();
    let end_date = start_date;
    if (enhancedEvent.endCalendarDate) {
      end_date = enhancedEvent.endCalendarDate.resetTime();
      enhancedEvent.numberOfDays = end_date.elapsedDays(start_date) + 1;
    } else {
      enhancedEvent.numberOfDays = 1;
    }
    return enhancedEvent;
  }

  private setEventColor(enhancedEvent: CalendarEventEnhanced) {
    const eventColorGroup = StringUtils.hashCode(
      enhancedEvent.id + ':' + enhancedEvent.name
    );
    let color = enhancedEvent.color;
    if (!color) {
      color = this.eventColors[eventColorGroup];
      if (!color) {
        color = ColorUtils.getRandomUniqueDarkColor((clr) => {
          return CollectionUtils.objCollectionContains(
            this.eventColors,
            'color',
            clr
          );
        });
      }
      enhancedEvent.color = color;
    }
    this.eventColors[eventColorGroup] = color;
  }
}
