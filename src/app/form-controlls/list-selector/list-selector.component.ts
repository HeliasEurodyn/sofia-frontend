import {Component, ComponentRef, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommandNavigatorService} from '../../services/system/command-navigator.service';
import * as uuid from 'uuid';
import {CommandParserService} from '../../services/system/command-parser.service';
import {ComponentPersistEntityFieldDTO} from '../../dtos/component/component-persist-entity-field-dto';
import {TableComponentService} from '../../services/crud/table-component.service';
import {ComponentDTO} from '../../dtos/component/componentDTO';
import {ComponentPersistEntityDTO} from '../../dtos/component/component-persist-entity-dto';
import {DomSanitizer} from "@angular/platform-browser";

class FieldValue {
  public type: string;
  public componentPersistEntityField: ComponentPersistEntityFieldDTO;
  public html: string;
}

@Component({
  selector: 'app-list-selector',
  templateUrl: './list-selector.component.html',
  styleUrls: ['./list-selector.component.css'],
})
export class ListSelectorComponent implements OnInit {
  @Input() command: string;
  @Input() listRow: string[];
  @Input() defaultValue: string;
  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();
  @Input() private displayValue = '';
  @Output() keyDownChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() fieldClass: any;
  private uuid = '';
  displayFieldParameters: string[] = [];
  refreshComponentCode = '';
  fieldValues: FieldValue[] = [];
  @Input() component: ComponentDTO;
  @Input() lineComponentPersistEntity: ComponentPersistEntityDTO = null;
  componentPersistEntity: ComponentPersistEntityDTO;
  @Input() editable: Boolean;
  @Input() componentPersistEntityDTO: ComponentPersistEntityDTO;
  @Input() componentPersistEntityFieldDTO: ComponentPersistEntityFieldDTO;
  @Output() focusEvent = new EventEmitter<FocusEvent>();
  @Output() eventOccured = new EventEmitter<any>();
  @ViewChild('selectorField') selectorField: ElementRef;

  private formId = '';
  public hasForm = false;
  public openFormOnNewTab = false;
  public showDeleteButton = true;

  constructor(
    private commandParserService: CommandParserService,
    private commandNavigatorService: CommandNavigatorService,
    private componentService: TableComponentService,
    private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.uuid = uuid.v4();
    this.refresh();
  }

  public refresh() {
    this.retrieveCommand();
    this.retrieveDisplayFields();
    this.setComponentDislpayValue();
    this.setDefaultValue();
    this.setDefaultListValue();
    console.log(this.value);
  }

  private setDefaultValue() {
    if (this.defaultValue == null) {
      return;
    }

    if (this.defaultValue === '') {
      return;
    }

  const matchesExp = new RegExp('^\\[\\[[0-9]*\\,.*\\]\\]$', 'g');
    if (this.defaultValue.match(matchesExp)) {
      const replaceExp = new RegExp('^\\[\\[', 'g')
      const id = this.defaultValue.replace(new RegExp('^\\[\\[', 'g'), '')
        .replace(new RegExp('\,.*\\]\\]', 'g'), '');

      const displayValue = this.defaultValue.replace(new RegExp('^\\[\\[[0-9]*\\,', 'g'), '')
        .replace(new RegExp('\\]\\]', 'g'), '');

      this.value = id;
      this.displayValue = displayValue;
      this.valueChange.emit(this.value);
    }
  }

  private setDefaultListValue() {
    if (this.listRow == null) {
      return;
    }

    if (this.listRow.length === 0) {
      return;
    }

    if (this.listRow == null) {
      return;
    }

    const commandParts: Map<string, string> = this.commandParserService.parse(this.command);
    if (commandParts.has('LIST-DEFAULT-DISPLAY')) {
      const displayValues: Map<string, string> = this.commandParserService.parseMapPart(commandParts, 'LIST-DEFAULT-DISPLAY');
      const displayValueArray: string[] = [];
      for (const [displayValueKey, displayValue] of displayValues) {
          if (this.listRow[displayValueKey] != null) {
            displayValueArray.push(this.listRow[displayValueKey]);
          }
      }
      this.displayValue = displayValueArray.join(' ');
    }
  }

  /*
   * This function returns the componentPersistEntity list for this List Selector
   * ex. If this list selector is on a form table, the componentPersistEntity is not the general one
   * But the one with selection of its table line components
   * */
  private defineComponentPersistEntityList(): ComponentPersistEntityDTO[] {
    if (this.lineComponentPersistEntity == null) {
      return this.component.componentPersistEntityList;
    }
    return this.defineComponentPersistEntityListFromTree(this.component.componentPersistEntityList);
  }

  private defineComponentPersistEntityListFromTree(cpeList: ComponentPersistEntityDTO[]): ComponentPersistEntityDTO[] {
    if (cpeList == null) {
      return null;
    }

    let lineUpdated = false;
    const newCpeList: ComponentPersistEntityDTO[] = [];

    cpeList
      .forEach(cpe => {
        if (cpe.id === this.lineComponentPersistEntity.id) {
          lineUpdated = true;
          cpe.componentPersistEntityList = this.lineComponentPersistEntity.componentPersistEntityList;
          cpe.componentPersistEntityFieldList = this.lineComponentPersistEntity.componentPersistEntityFieldList;
          newCpeList.push(cpe);
        } else {
          newCpeList.push(cpe);
        }
      });

    if (lineUpdated) {
      return newCpeList;
    }

    newCpeList
      .forEach(newCpe => {
        const childCpeList = this.defineComponentPersistEntityListFromTree(newCpe.componentPersistEntityList);
        newCpe.componentPersistEntityList = childCpeList;
      });

    return newCpeList;
  }

  retrieveCommand(): void {
    const commandParts: Map<string, string> = this.commandParserService.parse(this.command);

    this.displayFieldParameters = this.commandParserService.parseListPart(commandParts, 'DISPLAY');
    if (commandParts.has('REFRESH')) {
      const componentPersistEntityList = this.defineComponentPersistEntityList();
      this.findPersistEntityOnListTree(componentPersistEntityList, commandParts.get('REFRESH'));
    }

    if (commandParts.has('FORM')) {
      this.formId = commandParts.get('FORM');
      this.hasForm = true;
    }

    if (commandParts.has('FORM-NEW-TAB')) {
      this.openFormOnNewTab = true;
    }

    if (commandParts.has('HIDE-DELETE') ) {
      if (commandParts.get('HIDE-DELETE').toString().toUpperCase() === 'YES' ) {
        this.showDeleteButton = false;
      }
    }

  }

  refreshComponent(): void {
    if (this.componentPersistEntity == null) {
      this.retrieveDisplayFields();
      this.setComponentDislpayValue();
      return;
    }

    this.componentService.getComponentPersistEntityDataById(this.componentPersistEntity.id.toString(), this.value)
      .subscribe(newComponentPersistEntity => {
        this.updatePersistEntityValues(this.componentPersistEntity, newComponentPersistEntity);
        this.retrieveDisplayFields();
        this.setComponentDislpayValue();
        this.eventOccuredActions('list_component_refreshed', null);
      });
  }

  private setComponentDislpayValue(): void {
    this.displayValue = '';
    if ( this.fieldValues.length !== this.displayFieldParameters.length) {
      this.displayValue = '';
      return;
    }

    const cpefField =
      this.fieldValues
      .filter(fieldValue => fieldValue.type === 'cpef')
      .find(fieldValue => fieldValue.componentPersistEntityField.value != null);

    if(cpefField == null){
      this.displayValue = '';
      return;
    }

    const displayValueArray: string[] = [];
    this.fieldValues.forEach(fieldValue => {
      if (fieldValue.type == 'cpef') {
        displayValueArray.push(fieldValue.componentPersistEntityField.value);
      } else {
        displayValueArray.push(fieldValue.html);
      }
    });
    this.displayValue = displayValueArray.join('  ');
  }

  openList() {
    const componentRefOnNavigation: ComponentRef<any> = this.commandNavigatorService.navigate(this.command);
    componentRefOnNavigation.instance.setPresetCommand(this.command);
    componentRefOnNavigation.instance.selectEmmiter.subscribe((returningValues: string[]) => {
        this.value = returningValues['RETURN'];
        this.valueChange.emit(this.value);
        if (this.value != null) {
          this.refreshComponent();
          this.setReturnDisplayValues(returningValues['RETURN-DISLPAY']);
        }
        this.eventOccuredActions('listselected', null);
    });

    componentRefOnNavigation.instance.popupCloseEmmiter.subscribe((returningValues: string[]) => {
      this.selectorField.nativeElement.focus();
    });

  }

  setReturnDisplayValues(returnDisplay) {
    if (returnDisplay === '' ) {
      return;
    }
    this.displayValue = returnDisplay;
  }

  keyOpenPage(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.openList();
    }
  }

  onKeyDown($event: KeyboardEvent) {
    this.keyDownChange.emit($event);
  }

  clear() {
    this.value = null;
    this.fieldValues = [];
    this.displayValue = '';
    this.valueChange.emit(this.value);
    if (this.componentPersistEntity != null) {
      this.clearComponentPersistEntityTree(this.componentPersistEntity);
    }
    this.eventOccuredActions('listcleared', null);
  }

  clearComponentPersistEntityTree(componentPersistEntity: ComponentPersistEntityDTO) {
    componentPersistEntity.componentPersistEntityFieldList.forEach(cpef => {
      cpef.value = null;
    });

    if (componentPersistEntity.componentPersistEntityList == null) {
      return null;
    }

    componentPersistEntity.componentPersistEntityList.forEach(cpe => {
      this.clearComponentPersistEntityTree(cpe);
    });
  }

  openForm() {
    let command = '';
    let newTabCommandPart = '';

    if (this.openFormOnNewTab) {
      newTabCommandPart = ',TAB:new,SIDEBAR-STATUS:minimized';
    }
    if (this.value == null) {
      command = 'FORM[LOCATE:(ID=3)' + newTabCommandPart + ']';
    } else {
      command = 'FORM[LOCATE:(ID=3;SELECTION-ID=' + this.value + ')' + newTabCommandPart + ']';
    }

    this.commandNavigatorService.navigate(command);
  }

  findPersistEntityOnListTree(componentPersistEntityList: ComponentPersistEntityDTO[], code: string) {
    componentPersistEntityList.forEach(componentPersistEntity => {
      if (componentPersistEntity.code === code) {
        this.componentPersistEntity = componentPersistEntity;
        return true;
      }

      if (componentPersistEntity.componentPersistEntityList != null) {
        const found = this.findPersistEntityOnListTree(componentPersistEntity.componentPersistEntityList, code);

        if (found) {
          return found;
        }
      }

    });
    return false;
  }

  updatePersistEntityValues(oldCpe: ComponentPersistEntityDTO, newCpe: ComponentPersistEntityDTO) {

    oldCpe
      .componentPersistEntityFieldList
      .forEach(cpef => {
        const selectedCpef =
          newCpe.componentPersistEntityFieldList
            .find(newCpef => newCpef.id === cpef.id);
        if (selectedCpef != null) {
          cpef.value = selectedCpef.value;
        }
      });

    if (oldCpe.multiDataLine === true) {
      oldCpe.componentPersistEntityFieldList = newCpe.componentPersistEntityFieldList;
    }

    if (oldCpe.componentPersistEntityList == null || newCpe.componentPersistEntityList == null) {
      return;
    }

    oldCpe.componentPersistEntityList.forEach(cpe => {
      const selectedChildCpe =
        newCpe.componentPersistEntityList
          .find(newChildCpe => newChildCpe.id === cpe.id);
      if (selectedChildCpe != null) {
        this.updatePersistEntityValues(cpe, selectedChildCpe);
      }
    });
  }

  private retrieveDisplayFields(): void {
    this.fieldValues = [];

    this.displayFieldParameters
      .forEach(displayFieldParameter => {
        const componentPersistEntityList = this.defineComponentPersistEntityList();
        const cpef =  this.retrieveDisplayCpefOnTree(componentPersistEntityList, displayFieldParameter);
        const displayField = new FieldValue();

        if(cpef != null){
          displayField.type = 'cpef';
          displayField.componentPersistEntityField = cpef;
          this.fieldValues.push(displayField);
        } else {
          displayField.type = 'html';
          displayField.html = displayFieldParameter;
          this.fieldValues.push(displayField);
        }
      });

    console.log('fieldValues');
    console.log(this.fieldValues);
  }

  private retrieveDisplayCpefOnTree(componentPersistEntityList: ComponentPersistEntityDTO[], displayFieldName: string): ComponentPersistEntityFieldDTO {
    for (const componentPersistEntity of componentPersistEntityList) {
      for (const cpef of componentPersistEntity.componentPersistEntityFieldList) {
        const currentField = componentPersistEntity.code + '.' + cpef.code;
        if (displayFieldName === currentField) {
          console.log(cpef);
          return cpef;
        }
      }

      if (componentPersistEntity.componentPersistEntityList != null) {
        const cpef = this.retrieveDisplayCpefOnTree(componentPersistEntity.componentPersistEntityList, displayFieldName);
        if (cpef != null) {
          return cpef;
        }
      }
    }

    return null;
  }

  eventOccuredActions(eventtype: string, event: any) {

    this.eventOccured.emit(
      {
        entityCode: (this.componentPersistEntityDTO == null ? '' : this.componentPersistEntityDTO.code),
        fieldCode: (this.componentPersistEntityFieldDTO == null ? '' : this.componentPersistEntityFieldDTO.code),
        eventtype: eventtype,
        event: event
      }
    );

  }

  focusTriggered($event: FocusEvent) {
    this.focusEvent.emit($event);
  }

  trustResource(resource) {
    return this.sanitizer.bypassSecurityTrustHtml(resource);
  }
}
