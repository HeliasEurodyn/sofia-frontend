import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-numeric-input',
  templateUrl: './numeric-input.component.html',
  styleUrls: ['./numeric-input.component.css']
})
export class NumericInputComponent implements OnInit {

  @Input() inputValue: any;
  @Output() inputValueChange = new EventEmitter<any>();
  @Input() mask: String = '';
  @Input() editable: Boolean;
  @Output() keyDownChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() fieldId: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  onKeyUp($event: KeyboardEvent) {
    if ($event.key === '.') {
      if (
        (this.inputValue === '' || this.inputValue == null)
        && this.mask.includes('.')) {
        this.inputValue = '0.';
      }
    }
    this.inputValueChange.emit(this.inputValue);
  }

  onKeyDown($event: KeyboardEvent) {
    this.keyDownChange.emit($event);
  }

}
