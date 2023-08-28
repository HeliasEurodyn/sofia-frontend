import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(localeData);
dayjs.extend(weekday);

export interface CalendarDate {
  toDate(): Date;
  month(): number;
  year(): number;
  weekday(): number;
  dayOfMonth(): number;

  shortMonth(): string;
  longMonth(): string;
  weekNames(weekStart: number): Array<string>;

  daysBefore(days: number): CalendarDate;
  daysAfter(days: number): CalendarDate;
  prevMonth(): CalendarDate;
  nextMonth(): CalendarDate;

  daysInMonth(): number;
  monthStartDate(): CalendarDate;
  monthEndDate(): CalendarDate;
  resetTime(): CalendarDate;

  elapsedDays(cal: CalendarDate): number;
  isSame(cal: CalendarDate): boolean;
  isAfter(cal: CalendarDate): boolean;
  isBefore(cal: CalendarDate): boolean;
  isSameDate(cal: CalendarDate): boolean;
  isSameMonth(cal: CalendarDate): boolean;
  isWeekend(): boolean;

  format(fmt: string): string;
}

export class DayjsCalendarDate implements CalendarDate {
  date: Dayjs;

  constructor(date?: Date | string | Dayjs) {
    this.date = dayjs(date);
  }

  toDate(): Date {
    return this.date.toDate();
  }

  month(): number {
    return this.date.month();
  }

  year(): number {
    return this.date.year();
  }

  weekday(): number {
    return this.date.weekday();
  }

  dayOfMonth(): number {
    return this.date.date();
  }

  shortMonth(): string {
    return this.date.format("MMM");
  }

  longMonth(): string {
    return this.date.format("MMMM");
  }

  weekNames(weekStart: number): Array<string> {
    const dt = this.date.clone().weekday(weekStart);
    return dt.localeData().weekdaysShort();
  }

  daysBefore(days: number): CalendarDate {
    return new DayjsCalendarDate(this.date.clone().subtract(days, 'day'));
  }

  daysAfter(days: number): CalendarDate {
    return new DayjsCalendarDate(this.date.clone().add(days, 'day'));
  }

  prevMonth(): CalendarDate {
    return new DayjsCalendarDate(this.date.clone().subtract(1, 'month'));
  }

  nextMonth(): CalendarDate {
    return new DayjsCalendarDate(this.date.clone().add(1, 'month'));
  }

  daysInMonth():  number {
    return this.date.daysInMonth();
  }

  monthStartDate(): CalendarDate {
    const monthStartDate = this.date.clone().date(1);
    return new DayjsCalendarDate(monthStartDate);
  }

  monthEndDate(): CalendarDate {
    const monthEndDate = this.date.clone().date(this.daysInMonth());
    return new DayjsCalendarDate(monthEndDate);
  }

  resetTime(): CalendarDate {
    const d = this.date.startOf('date');
    return new DayjsCalendarDate(d);
  }

  elapsedDays(cal: CalendarDate) {
    return this.date.diff(dayjs(cal.toDate()), 'day');
  }

  isSame(cal: CalendarDate) {
    return this.date.isSame(cal.toDate());
  }

  isAfter(cal: CalendarDate) {
    return this.date.isAfter(dayjs(cal.toDate()));
  }

  isBefore(cal: CalendarDate) {
    return this.date.isBefore(dayjs(cal.toDate()));
  }

  isSameDate(cal: CalendarDate) {
    return (
      this.date.year() === cal.year() &&
      this.date.month() === cal.month() &&
      this.dayOfMonth() === cal.dayOfMonth()
    );
  }

  isSameMonth(cal: CalendarDate) {
    return (
      this.date.year() === cal.year() &&
      this.date.month() === cal.month()
    );
  }

  isWeekend(): boolean {
    const weekday = this.weekday();
    if (weekday == 6 || weekday == 0) {
      return true;
    }
    return false;
  }

  format(fmt: string): string {
    return this.date.format(fmt);
  }
}

export class CalendarUtils {
  static instance(date?: Date): CalendarDate {
    return new DayjsCalendarDate(date);
  }
}
