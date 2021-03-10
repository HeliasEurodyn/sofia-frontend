import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {NgbDateParserFormatter, NgbDateStruct, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {

  @Input() inputDate: Date;
  @Output() inputDateChange = new EventEmitter<Date>();
  @Input() editable: Boolean;
  @Output() keyDownChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() fieldId: any;

  @ViewChild('ngbDatepickerIdentifier') ngbInputDatepicker: NgbInputDatepicker;
  model: string;
  mask: String = '';
  dateFormat = 'dd/MM/yyyy';

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
    const DExp = /D/gi;
    const MExp = /M/gi;
    const YExp = /Y/gi;
    this.mask = this.dateFormat.toUpperCase().replace(DExp, '0').replace(MExp, '0').replace(YExp, '0');
  }

  onKeyDownEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.ngbInputDatepicker.toggle();
    }

    if (event.ctrlKey && event.key === 'z') {
      alert(JSON.stringify(this.inputDate));
    }

    this.keyDownChange.emit(event);
  }

  onNgbDatepickerSelection(ngbDate: NgbDateStruct) {
    this.inputDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    this.inputDateToModel();
  }

  inputDateToModel() {
    const dateStringFormated = this.datepipe.transform(this.inputDate, this.dateFormat);
    const exp = /\/|\\|-/gi;
    this.model = dateStringFormated.replace(exp, '');
  }

  onFocusOut() {
    try {
      const modelParsedToDate = this.tryModelToDate();
      if (modelParsedToDate === false) {
        this.model = '';
        this.inputDate = null;
      } else {
        this.inputDateChange.emit(this.inputDate);
        const dateStringFormated = this.datepipe.transform(this.inputDate, this.dateFormat);
        const exp = /\/|\\|-/gi;
        this.model = dateStringFormated.replace(exp, '');
      }
    } catch (error) {
      this.model = '';
      this.inputDate = null;
    }

  }

  tryModelToDate() {
    const currentDate = new Date();

    const exp = /\/|\\|-/gi;
    const modelFormat = this.dateFormat.replace(exp, '');

    const fistIndexOfD = modelFormat.indexOf('d');
    const lastIndexOfD = modelFormat.lastIndexOf('d');

    const fistIndexOfM = modelFormat.indexOf('M');
    const lastIndexOfM = modelFormat.lastIndexOf('M');

    const fistIndexOfY = modelFormat.indexOf('y');
    const lastIndexOfY = modelFormat.lastIndexOf('y');

    const day: number = +this.model.substring(fistIndexOfD, lastIndexOfD + 1);
    let month: number = +this.model.substring(fistIndexOfM, lastIndexOfM + 1);
    let year: number = +this.model.substring(fistIndexOfY, lastIndexOfY + 1);

    if (day <= 0) {
      return false;
    }

    if (month <= 0) {
      month = currentDate.getMonth() + 1;
    }

    if (year <= 0) {
      year = currentDate.getFullYear();
    }

    this.inputDate = new Date(year, month - 1, day);
    return true;
  }

}
