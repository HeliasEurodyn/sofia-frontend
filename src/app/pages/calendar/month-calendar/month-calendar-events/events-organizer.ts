import {CalendarEventEnhanced} from '../month-calendar.model';

export class EventTrack extends Array<CalendarEventEnhanced> {
}

export class EventTracks extends Array<EventTrack> {
}

export interface EventsOrganizer {
  organize(): void;
  getTracks(): Array<EventTracks>;
}
