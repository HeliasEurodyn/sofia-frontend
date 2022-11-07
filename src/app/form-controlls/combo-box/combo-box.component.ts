import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ComponentPersistEntityDTO} from '../../dtos/component/component-persist-entity-dto';
import {ComponentPersistEntityFieldDTO} from '../../dtos/component/component-persist-entity-field-dto';

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.css']
})
export class ComboBoxComponent implements OnInit {
  @Input() editable: Boolean;
  @Input() componentPersistEntityDTO: ComponentPersistEntityDTO;
  @Input() componentPersistEntityFieldDTO: ComponentPersistEntityFieldDTO;
  @Output() keydownEvent = new EventEmitter<KeyboardEvent>();
  @Output() focusEvent = new EventEmitter<FocusEvent>();
  @Output() eventOccured = new EventEmitter<any>();
  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();
  @Input() comboOptions: any = null;
  @Input() defaultValue: string = null;

  constructor() {
  }

  ngOnInit(): void {

    if (this.componentPersistEntityFieldDTO != null) {
      this.comboOptions = JSON.parse(this.componentPersistEntityFieldDTO.assignment.editor);
    } else if (this.comboOptions != null) {
      this.comboOptions = JSON.parse(this.comboOptions);
    }

    if (!this.defaultValue == null) {
      this.value = this.defaultValue;
    }

    if (this.componentPersistEntityFieldDTO != null) {
      this.value = this.componentPersistEntityFieldDTO.value;
    }

  }

  eventOccuredActions(eventtype: string, event: any) {
    this.eventOccured.emit(
      {
        entityCode: (this.componentPersistEntityDTO == null ? this.value : this.componentPersistEntityDTO.code),
        fieldCode: (this.componentPersistEntityFieldDTO == null ? this.value : this.componentPersistEntityFieldDTO.code),
        eventtype: eventtype,
        event: event
      }
    );
  }

  keyDownTriggered($event: KeyboardEvent) {
    this.keydownEvent.emit($event);
  }

  focusTriggered($event: FocusEvent) {
    this.focusEvent.emit($event);
  }

  clearValue() {
    this.componentPersistEntityFieldDTO.value = null;
  }

  selectItem(value: any) {

    if (value === 'null' || value === 'undefined') {
      value = null;
    }
    this.valueChange.emit(value);

    if (this.componentPersistEntityFieldDTO == null) {
      return;
    }

    this.componentPersistEntityFieldDTO.value = value;

  }

  focusInputField(input) {
    input.focus();
    input.select();
  }

}
