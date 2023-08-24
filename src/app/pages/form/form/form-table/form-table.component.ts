import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormControlDto} from '../../../../dtos/form/form-control-dto';
import {ComponentDTO} from '../../../../dtos/component/componentDTO';
import {FormControlTableLineDTO} from '../../../../dtos/form/form-control-table-line-d-t-o';
import {FormControlTableDTO} from '../../../../dtos/form/form-control-table-d-t-o';
import {ComponentPersistEntityDTO} from '../../../../dtos/component/component-persist-entity-dto';
import {ComponentPersistEntityDataLineDTO} from '../../../../dtos/component/component-persist-entity-data-line-dto';
import * as uuid from 'uuid';
import {FormControlTableCellDTO} from '../../../../dtos/form/form-control-table-cell-d-t-o';
import {FormControlTableControlDTO} from '../../../../dtos/form/form-control-table-control-d-t-o';
import {CommandNavigatorService} from '../../../../services/system/command-navigator.service';
import {FormComponent} from '../form.component';
import {FormAssignmentsService} from '../services/form-assignments.service';
import {ComponentObjService} from '../services/component-obj.service';
import {FormScriptsService} from '../../../../services/system/form-scripts.service';
import {DomSanitizer} from "@angular/platform-browser";
import {DateConverterService} from "../../../../services/system/date-converter.service";

@Component({
  selector: 'app-form-table',
  templateUrl: './form-table.component.html',
  styleUrls: ['./form-table.component.css']
})
export class FormTableComponent implements OnInit, OnChanges {
  @Input() form: FormComponent;
  @Input() formcontrol: FormControlDto;
  @Input() component: ComponentDTO;
  @Input() refreshUuid: string;

  constructor(private commandNavigatorService: CommandNavigatorService,
              private formAssignmentsService: FormAssignmentsService,
              private componentObjService: ComponentObjService,
              private formScriptsService: FormScriptsService,
              private sanitizer: DomSanitizer,
              private dateConverterService: DateConverterService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.refershTableFields(this.formcontrol.formControlTable);
  }

  public setDefaultLinesToFormTablesTree(componentPersistEntityList: ComponentPersistEntityDTO[]) {
    for (const componentPersistEntity of componentPersistEntityList) {
      if (componentPersistEntity.multiDataLine) {
        if (componentPersistEntity.componentPersistEntityDataLines.length === 0) {
          this.newComponentPersistEntityDataLine(componentPersistEntity);
        }
      }

      if (componentPersistEntity.componentPersistEntityList != null) {
        this.setDefaultLinesToFormTablesTree(componentPersistEntity.componentPersistEntityList);
      }
    }
  }

  public tableAddNewLine(formControlTableDTO: FormControlTableDTO,
                         formControlTableLineDTOS: FormControlTableLineDTO[],
                         prevFormControlTableLineDTO: FormControlTableLineDTO) {

    if (!formControlTableDTO.editable) {
      return;
    }

    let requiderFieldsFilled = true;
    if (prevFormControlTableLineDTO != null) {
      requiderFieldsFilled = this.checkRequiredFields(prevFormControlTableLineDTO);
    }

    this.formScriptsService.nativeTableButtonNewLineHandler(
        this.form.dto.id,
        formControlTableDTO,
        requiderFieldsFilled
    );


    if (requiderFieldsFilled) {
      this.newComponentPersistEntityDataLine(formControlTableDTO.componentPersistEntity);
      this.refershTableFields(formControlTableDTO);
      //this.tableFocusNextLineFirstField(formControlTableLineDTOS, prevFormControlTableLineDTO);
    }
  }

  public refershTableFields(formControlTableDTO: FormControlTableDTO) {

    // ReCreate FormControlTableLineDTOs for Table
    formControlTableDTO.formControlLines = [];
    for (const componentPersistEntityDataLine of formControlTableDTO.componentPersistEntity.componentPersistEntityDataLines) {
      const formControlTableLineDTO: FormControlTableLineDTO = new FormControlTableLineDTO();
      formControlTableLineDTO.componentPersistEntity = new ComponentPersistEntityDTO();
      formControlTableLineDTO.componentPersistEntity.id = formControlTableDTO.componentPersistEntity.id;
      formControlTableLineDTO.componentPersistEntity.componentPersistEntityList = componentPersistEntityDataLine.componentPersistEntityList;
      formControlTableLineDTO.componentPersistEntity.componentPersistEntityFieldList =
        componentPersistEntityDataLine.componentPersistEntityFieldList;
      formControlTableLineDTO.componentPersistEntityDataLine = componentPersistEntityDataLine;

      // ReCreate FormControlTableCellDTO for FormControlTableLineDTOs
      for (const formControl of formControlTableDTO.formControls) {
        let cellFound = false;
        for (const componentPersistEntityField of componentPersistEntityDataLine.componentPersistEntityFieldList) {

          if (componentPersistEntityField.id === formControl.formControlField.fieldId) {
            const formControlTableCellDTO = new FormControlTableCellDTO();
            formControlTableCellDTO.id = uuid.v4();
            formControlTableCellDTO.componentPersistEntityField = componentPersistEntityField;
            formControlTableCellDTO.formControl = formControl;
            formControlTableLineDTO.formControlCells.push(formControlTableCellDTO);
            cellFound = true;
          }
        }

        if (!cellFound) {
          const formControlTableCellDTO =
            this.createTableCellOfFormControlFromComponentPEDataLine(formControl,
              componentPersistEntityDataLine.componentPersistEntityList);
          if (formControlTableCellDTO != null) {
            formControlTableLineDTO.formControlCells.push(formControlTableCellDTO);
          }
        }

      }
      formControlTableDTO.formControlLines.push(formControlTableLineDTO);
    }
  }

  public createTableCellOfFormControlFromComponentPEDataLine(formControl: FormControlTableControlDTO,
                                                             componentPersistEntityList: ComponentPersistEntityDTO[]) {

    for (const componentPersistEntity of componentPersistEntityList) {
      for (const componentPersistEntityField of componentPersistEntity.componentPersistEntityFieldList) {
        if (componentPersistEntityField.id === formControl.formControlField.fieldId) {
          const formControlTableCellDTO = new FormControlTableCellDTO();
          formControlTableCellDTO.id = uuid.v4();
          formControlTableCellDTO.componentPersistEntityField = componentPersistEntityField;
          formControlTableCellDTO.formControl = formControl;
          return formControlTableCellDTO;
        }
      }

      if (componentPersistEntity.componentPersistEntityList != null) {
        const formControlTableCellDTO =
          this.createTableCellOfFormControlFromComponentPEDataLine(formControl, componentPersistEntity.componentPersistEntityList);
        if (formControlTableCellDTO != null) {
          return formControlTableCellDTO;
        }
      }
    }

    return null;
  }

  public newComponentPersistEntityDataLine(componentPersistEntity: ComponentPersistEntityDTO) {

    /* Create new componentPersistEntityDataLine */
    const componentPersistEntityDataLine = new ComponentPersistEntityDataLineDTO();
    componentPersistEntityDataLine.id = uuid.v4();

    componentPersistEntityDataLine.componentPersistEntityId = componentPersistEntity.id;

    /* Clone component and assign to componentPersistEntityDataLines.component */
    if (componentPersistEntity.defaultComponentPersistEntityFieldList != null) {
      componentPersistEntityDataLine.componentPersistEntityFieldList =
        JSON.parse(JSON.stringify(componentPersistEntity.defaultComponentPersistEntityFieldList));
    }

    if (componentPersistEntity.defaultComponentPersistEntityList != null) {
      componentPersistEntityDataLine.componentPersistEntityList =
        JSON.parse(JSON.stringify(componentPersistEntity.defaultComponentPersistEntityList));
    }

    componentPersistEntity.componentPersistEntityDataLines.push(componentPersistEntityDataLine);

    return componentPersistEntityDataLine;
  }

  public setSelectedTableLineComponentTreeAndRefreshFormAssignments(componentPersistEntity: ComponentPersistEntityDTO,
                                                                    componentPersistEntityDataLine: ComponentPersistEntityDataLineDTO) {
    componentPersistEntity.componentPersistEntityFieldList = componentPersistEntityDataLine.componentPersistEntityFieldList;
    componentPersistEntity.componentPersistEntityList = componentPersistEntityDataLine.componentPersistEntityList;
    const ids = this.componentObjService.getChildPersistEntityIds(componentPersistEntity.componentPersistEntityList, []);
    this.formAssignmentsService.assignComponentFieldsToTableFieldsByPersistEntityIds(this.form.dto, ids);
  }

  public setSelectedTableLineComponentTree(componentPersistEntity: ComponentPersistEntityDTO,
                                           componentPersistEntityDataLine: ComponentPersistEntityDataLineDTO) {
    componentPersistEntity.componentPersistEntityFieldList = componentPersistEntityDataLine.componentPersistEntityFieldList;
    componentPersistEntity.componentPersistEntityList = componentPersistEntityDataLine.componentPersistEntityList;
  }

  public tableAppendNewLine(formControlTableLineDTOS: FormControlTableLineDTO[],
                            formControlTableDTO: FormControlTableDTO) {
    let prevFormControlTableLineDTO = null;

    if (formControlTableLineDTOS.length > 0) {
      prevFormControlTableLineDTO = formControlTableLineDTOS[formControlTableLineDTOS.length - 1];
    }
    this.tableAddNewLine(formControlTableDTO, formControlTableLineDTOS, prevFormControlTableLineDTO);
  }

  public tableDeleteLine(formControlTableDTO: FormControlTableDTO,
                         formControlTableLineDTOS: FormControlTableLineDTO[], formControlTableLineDTO: FormControlTableLineDTO) {

    if (!formControlTableDTO.editable) {
      return;
    }

    let elementPosition = 0;
    for (const curFormControlTableLineDTO of formControlTableLineDTOS) {
      if (curFormControlTableLineDTO === formControlTableLineDTO) {
        formControlTableLineDTOS.splice(elementPosition, 1);
        formControlTableDTO.componentPersistEntity.componentPersistEntityDataLines.splice(elementPosition, 1);
        return true;
      }
      elementPosition++;
    }
    return false;
  }

  public checkRequiredFields(formControlTableLineDTO: FormControlTableLineDTO) {

    const formControlCells = Object.assign([], formControlTableLineDTO.formControlCells).filter(
      formControlCell => formControlCell.formControl.type === 'field'
    );

    for (const formControlCell of formControlCells) {
      if ((formControlCell.componentPersistEntityField.value === null ||
        formControlCell.componentPersistEntityField.value === '') &&
        formControlCell.formControl.formControlField.required === true
      ) {
        return false;
      }
    }
    return true;
  }

  public tableFocusFirstLineFirstField(formControlLines: FormControlTableLineDTO[]) {
    for (const formControlLine of formControlLines) {
      const htmlclass =
        formControlLine.formControlCells[0].id.toString()
      this.focusByClass(htmlclass);

      return true;
    }
    return false;
  }

  public focusByClass(selectedClass: string) {
    const elements = document.getElementsByClassName(selectedClass);
    if (elements.length === 1) {
      const htmlELement = elements[0] as HTMLElement;
      htmlELement.focus();
      return true;
    }
    return false;
  }

  formButtonClicked(tableFormControlButton: FormControlTableControlDTO,
                    formControlLine: FormControlTableLineDTO,
                    formControlLines: FormControlTableLineDTO[],
                    formcontrol: FormControlDto,
                    formControlTable: FormControlTableDTO) {

    this.formScriptsService.tableButtonClickOccured(
      this.form.dto.id,
      tableFormControlButton.formControlButton.code,
      formcontrol.formControlTable,
      formControlLine.componentPersistEntityDataLine);

    let command = tableFormControlButton.formControlButton.editor;

    if (command === '#deleteLine') {
      this.tableDeleteLine(formControlTable, formControlLines, formControlLine);
      return;
    }

    if (command === '#selectLine') {
      this.setSelectedTableLineComponentTreeAndRefreshFormAssignments(formcontrol.formControlTable.componentPersistEntity,
        formControlLine.componentPersistEntityDataLine);
      return;
    }

    if (command === '') {
      return;
    }

    formControlLine.formControlCells.forEach((formControlCell, index) => {
      command = command.replace('#' + formControlCell.componentPersistEntityField.code,
        formControlCell.componentPersistEntityField.value);
    });

    this.commandNavigatorService.navigate(command);
  }

  tableEventOccured(fieldParameters: any,
                    componentPersistEntity: ComponentPersistEntityDTO,
                    componentPersistEntityDataLine: ComponentPersistEntityDataLineDTO) {
    this.formScriptsService.tableFieldEventOccured(
      this.form.dto.id,
      fieldParameters['entityCode'],
      fieldParameters['fieldCode'],
      fieldParameters['eventtype'],
      fieldParameters['event'],
      componentPersistEntity,
      componentPersistEntityDataLine
    );
  }

  filterListRefreshData(event, formControlTable: FormControlTableDTO) {
    if(event.eventtype !== 'listselected' && event.eventtype !== 'listcleared'){
      return;
    }

    this.filtertableLines(event, formControlTable);
  }

  filterRefreshData(event, formControlTable: FormControlTableDTO) {
    if (event.key !== 'Enter') {
      return;
    }

  this.filtertableLines(event, formControlTable);
  }

  filtertableLines(event, formControlTable: FormControlTableDTO) {
    formControlTable.formControlLines.forEach(formControlLine => {
      let hideLine = false;

      formControlLine.formControlCells.forEach(formControlcell => {
        if (!formControlcell.componentPersistEntityField.value.toString().includes(formControlcell.formControl.filterValue) &&
          formControlcell.formControl.filterValue != null  &&
          formControlcell.formControl.filterValue !== '') {
          hideLine = true;
        }
      });

      formControlLine.hideLine = hideLine;
    });
  }

  cellsKeyDown(event, formcontrol: FormControlDto, formControlLine: FormControlTableLineDTO, rowIndex: number, colIndex: number) {
    const formControlLines = formcontrol.formControlTable.formControlLines;

    if (event.shiftKey && event.key === 'ArrowLeft') {
      const tds = document.getElementsByClassName('tbl-'+formcontrol.id+'-cell-' + rowIndex + '-' + (colIndex-1) );
      if (tds.length > 0) {
        this.focusContorlField((tds[0] as HTMLElement).children);
      }
    }

    if (event.shiftKey && event.key === 'ArrowRight') {
      const tds = document.getElementsByClassName('tbl-'+formcontrol.id+'-cell-' + rowIndex + '-' + (colIndex+1) );
      if (tds.length > 0) {
        this.focusContorlField((tds[0] as HTMLElement).children);
      }
    }

    if (event.shiftKey && event.key === 'ArrowUp') {
      const tds = document.getElementsByClassName('tbl-'+formcontrol.id+'-cell-' + (rowIndex-1) + '-' + colIndex );
      if (tds.length > 0) {
        this.focusContorlField((tds[0] as HTMLElement).children);
      }
    }

    if (event.shiftKey && event.key === 'ArrowDown') {
      let newRowIndex = rowIndex+1;

      if(newRowIndex == formControlLines.length){
       this.tableAppendNewLine(formControlLines,formcontrol.formControlTable);

        setTimeout(() => {
          const tds = document.getElementsByClassName('tbl-'+formcontrol.id+'-cell-' + newRowIndex + '-' + colIndex );
          console.log('tbl-'+formcontrol.id+'-cell-' + newRowIndex + '-' + colIndex );
          if (tds.length > 0) {
            this.focusContorlField((tds[0] as HTMLElement).children);
          }
        },500);

       return;
      }

      const tds = document.getElementsByClassName('tbl-'+formcontrol.id+'-cell-' + newRowIndex + '-' + colIndex );
      console.log(tds.length);
      console.log('tbl-'+formcontrol.id+'-cell-' + newRowIndex + '-' + colIndex );
      if (tds.length > 0) {
        this.focusContorlField((tds[0] as HTMLElement).children);
      }
    }

    if (event.altKey && event.key === 'Delete') {
      this.tableDeleteLine(formcontrol.formControlTable, formControlLines, formControlLine);
      const tds = document.getElementsByClassName('tbl-'+formcontrol.id+'-cell-' + (rowIndex-1) + '-' + colIndex );
      if (tds.length > 0) {
        this.focusContorlField((tds[0] as HTMLElement).children);
      }
    }
  }

  private focusContorlField(elements: HTMLCollection) {
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains('ctrl-field')) {
        (elements[i] as HTMLElement).focus();
        return true;
      }
    }

    for (let i = 0; i < elements.length; i++) {
      const found = this.focusContorlField((elements[i] as HTMLElement).children);
      if (found) {
        return true;
      }
    }

    return false;
  }

  trustResource(resource) {
    resource = this.dateConverterService.replaceIsoToClientDateFormatsInText(resource.toString());
    return this.sanitizer.bypassSecurityTrustHtml(resource);
  }

}
