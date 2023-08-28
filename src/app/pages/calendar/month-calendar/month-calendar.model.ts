import { CalendarDate } from '../utils/date-utils';

export interface CalendarCell {
  row: number;
  col: number;
  events?: Array<CalendarEventEnhanced>;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isWeekEnd: boolean;
  cell: CalendarCell
}

export interface CalendarEvent {
  startDate: Date;
  endDate?: Date;
  allDay?: boolean;
  id: string;
  name: string;
  type?: string;
  schedule?: any;
  color?: string;
}

export interface CalendarEventEnhanced extends CalendarEvent {
  startCalendarDate?: CalendarDate;
  endCalendarDate?: CalendarDate;
  numberOfDays?: number;
  start?: boolean;
  end?: boolean;
  length?: number;
}
