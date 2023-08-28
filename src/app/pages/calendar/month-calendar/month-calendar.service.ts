import { Injectable } from '@angular/core';
import {CalendarDate, CalendarUtils} from '../utils/date-utils';
import {CalendarDay, CalendarEvent, CalendarEventEnhanced} from './month-calendar.model';
import {EventsEnhancer} from './month-calendar-events/events-enhancer';
import {EventsOrganizer, EventTracks} from './month-calendar-events/events-organizer';
import {WeeklyOptimzedTracksEventOrganizer} from './month-calendar-events/weekly-optimzed-tracks-event-orgaizer';

@Injectable({
  providedIn: 'root'
})
export class MonthCalendarService {


  private weekStart: number;
  private viewDate: CalendarDate;

  private weeksOrder: Array<number> = [];
  private weekHeaders: Array<string> = [];
  private weeks: Array<Array<CalendarDay>> = [];

  private eventsEnhancer: EventsEnhancer;
  private eventsEnhanced: Array<CalendarEventEnhanced> = [];
  private events: Array<CalendarEvent>;
  private weeklyTracks: Array<EventTracks> = [];

  constructor() {
    this.eventsEnhancer = new EventsEnhancer();
  }

  getWeekHeaders(): Array<string> {
    return this.weekHeaders;
  }

  getWeeks(): Array<Array<CalendarDay>> {
    return this.weeks;
  }

  getEventsEnhanced(): Array<CalendarEventEnhanced> {
    return this.eventsEnhanced;
  }

  updateViewDate(viewDate: Date, weekStart: number) {
    this.viewDate = CalendarUtils.instance(viewDate);
    this.weekStart = weekStart;

    if (
      typeof this.weekStart === 'undefined' ||
      this.weekStart < 0 ||
      this.weekStart > 6
    ) {
      this.weekStart = 0;
    }

    const weekNames = this.viewDate.weekNames(this.weekStart);
    this.weeksOrder = [];
    this.weekHeaders = [];
    for (let i = 0; i < 7; i++) {
      const week = (i + this.weekStart) % 7;
      this.weeksOrder.push(week);
      this.weekHeaders.push(weekNames[week]);
    }

    this.weeks = this.getMonthCalendar();
  }

  private getMonthCalendar(): Array<Array<CalendarDay>> {
    const prevMonthDays = this.generatePrevMonthDays();
    const currentMonthDays = this.generateCurrentMonthDays();
    const nextMonthDays = this.generateNextMonthDays();

    const calDays = [].concat(prevMonthDays, currentMonthDays, nextMonthDays);
    const weeks = [];
    const chunkSize = 7;
    for (let i = 0; i < calDays.length; i += chunkSize) {
      const chunk = calDays.slice(i, i + chunkSize);
      weeks.push(chunk);
    }
    return weeks;
  }

  private generatePrevMonthDays(): Array<CalendarDay> {
    const monthStartDate = this.viewDate.monthStartDate();
    const monthStartWeek = monthStartDate.weekday();
    const prevMonthDaysToGenerate = this.weeksOrder.indexOf(monthStartWeek);

    const prevMonthDays = [];
    for (let i = prevMonthDaysToGenerate; i > 0; i--) {
      const dt = monthStartDate.daysBefore(i);
      prevMonthDays.push(this.toCalendarDay(dt));
    }
    return prevMonthDays;
  }

  private generateCurrentMonthDays(): Array<CalendarDay> {
    const daysInMonth = this.viewDate.daysInMonth();
    const monthStartDate = this.viewDate.monthStartDate();
    const currentMonthDays = [];
    for (let i = 0; i < daysInMonth; i++) {
      const dt = monthStartDate.daysAfter(i);
      currentMonthDays.push(this.toCalendarDay(dt));
    }
    return currentMonthDays;
  }

  private generateNextMonthDays(): Array<CalendarDay> {
    const monthEndDate = this.viewDate.monthEndDate();
    const monthEndWeek = monthEndDate.weekday();
    const nextMonthDaysToGenerate = 6 - this.weeksOrder.indexOf(monthEndWeek);

    const nextMonthDays = [];
    for (let i = 0; i < nextMonthDaysToGenerate; i++) {
      const dt = monthEndDate.daysAfter(i + 1);
      nextMonthDays.push(this.toCalendarDay(dt));
    }
    return nextMonthDays;
  }

  private toCalendarDay(calDate: CalendarDate) {
    return {
      date: calDate.resetTime().toDate(),
      day: calDate.dayOfMonth(),
      isCurrentDay: calDate.isSameDate(CalendarUtils.instance()),
      isCurrentMonth: calDate.isSameMonth(this.viewDate),
      isWeekend: calDate.isWeekend(),
    };
  }

  updateEvents(events: Array<CalendarEvent>) {
    this.events = events;
    this.eventsEnhanced = this.eventsEnhancer.enhanceEvents(this.events);
    const eventsOrganizer: EventsOrganizer = new WeeklyOptimzedTracksEventOrganizer(this.weeks, this.eventsEnhanced);
    eventsOrganizer.organize();
    this.weeklyTracks = eventsOrganizer.getTracks();
  }

  getWeeklyTracks(weekId: number): EventTracks {
    if (typeof this.weeklyTracks[weekId] !== 'undefined') {
      return this.weeklyTracks[weekId];
    } else {
      return [];
    }
  }
}
