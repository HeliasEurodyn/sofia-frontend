import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {ComponentPersistEntityDTO} from "../../dtos/component/component-persist-entity-dto";
import {ComponentPersistEntityFieldDTO} from "../../dtos/component/component-persist-entity-field-dto";
import {NgbDateParserFormatter, NgbDateStruct, NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss']
})
export class DateTimePickerComponent implements OnInit {

  @Input() inputDate: Date;
  @Output() inputDateChange = new EventEmitter<Date>();
  @Input() editable: Boolean;
  @Output() keyDownChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() fieldClass: any;
  @Output() focusEvent = new EventEmitter<FocusEvent>();
  @Output() eventOccured = new EventEmitter<any>();
  @Input() componentPersistEntityDTO: ComponentPersistEntityDTO;
  @Input() componentPersistEntityFieldDTO: ComponentPersistEntityFieldDTO;

  hourValue = '0';
  minuteValue = '0';

  @ViewChild('ngbDatepickerIdentifier') ngbInputDatepicker: NgbInputDatepicker;
  dateModel: string;
  convertedMask: String = '';
  @Input() mask = '';

  constructor(element: ElementRef,
              private renderer: Renderer2,
              private _parserFormatter: NgbDateParserFormatter,
              public datepipe: DatePipe) {
  }

  ngOnInit() {
    this.setMaskFormatFromDateFormat();
    this.inputDateToModel();
  }

  setMaskFormatFromDateFormat() {
    this.convertedMask = this.mask.toUpperCase().replace(/D/gi, '0').replace(/M/gi, '0').replace(/Y/gi, '0');
  }

  onKeyDownEvent(event: KeyboardEvent) {
    if (event.key === 'c') {
      this.ngbInputDatepicker.toggle();
    }

    this.keyDownChange.emit(event);
  }

  onNgbDatepickerSelection(ngbDate: NgbDateStruct) {
    this.inputDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    this.inputDateToModel();
    this.onFocusOut();
  }

  inputDateToModel() {
    if (this.inputDate === null) {
      return;
    }
    const dateStringFormated = this.datepipe.transform(this.inputDate, this.mask);
    this.dateModel = dateStringFormated.replace(/\/|\\|-/gi, '');

    this.hourValue = this.datepipe.transform(this.inputDate, 'hh');
    this.minuteValue = this.datepipe.transform(this.inputDate, 'mm');
  }

  onFocusOut() {
    try {
      const modelParsedToDate = this.tryModelToDate();
      if (modelParsedToDate === false) {
        this.dateModel = '';
        this.inputDate = null;
      } else {
        const dateStringFormated = this.datepipe.transform(this.inputDate, this.mask);
        const exp = /\/|\\|-/gi;
        this.dateModel = dateStringFormated.replace(exp, '');
      }
    } catch (error) {
      this.dateModel = '';
      this.inputDate = null;
    }
    this.inputDateChange.emit(this.inputDate);
  }

  tryModelToDate() {
    const currentDate = new Date();

    const exp = /\/|\\|-/gi;
    const modelFormat = this.mask.replace(exp, '');

    const fistIndexOfD = modelFormat.indexOf('d');
    const lastIndexOfD = modelFormat.lastIndexOf('d');

    const fistIndexOfM = modelFormat.indexOf('M');
    const lastIndexOfM = modelFormat.lastIndexOf('M');

    const fistIndexOfY = modelFormat.indexOf('y');
    const lastIndexOfY = modelFormat.lastIndexOf('y');

    const day: number = +this.dateModel.substring(fistIndexOfD, lastIndexOfD + 1);
    let month: number = +this.dateModel.substring(fistIndexOfM, lastIndexOfM + 1);
    let year: number = +this.dateModel.substring(fistIndexOfY, lastIndexOfY + 1);

    if (day <= 0) {
      return false;
    }

    if (month <= 0) {
      month = currentDate.getMonth() + 1;
    }

    if (year <= 0) {
      year = currentDate.getFullYear();
    }

    const hour = Number((this.hourValue === '' ? '0' : this.hourValue));
    const min = Number((this.minuteValue === '' ? '0' : this.minuteValue));

    this.inputDate = new Date(year, month - 1, day, hour, min);
    return true;
  }

  focusTriggered($event: FocusEvent) {
    this.focusEvent.emit($event);
  }

  eventOccuredActions(eventtype: string, event: any) {

    if (this.componentPersistEntityDTO == null) {
      return;
    }

    this.eventOccured.emit(
      {
        entityCode: this.componentPersistEntityDTO.code,
        fieldCode: this.componentPersistEntityFieldDTO.code,
        eventtype: eventtype,
        event: event
      }
    );
  }

  hourKeyCheck(ev: KeyboardEvent) {

    if (ev.keyCode < 48 || ev.keyCode > 57) {
      return false;
    }

    if (this.hourValue.length >= 2) {
      return false;
    }

    const numValue = Number(this.hourValue + ev.key);

    if (numValue < 0 || numValue > 23) {
      return false;
    }

    return true;
  }

  minuteKeyCheck(ev: KeyboardEvent) {

    if (ev.keyCode < 48 || ev.keyCode > 57) {
      return false;
    }

    if (this.minuteValue.length >= 2) {
      return false;
    }

    const numValue = Number(this.minuteValue + ev.key);

    if (numValue < 0 || numValue > 59) {
      return false;
    }

    return true;
  }

}
