import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {PageComponent} from '../../page/page-component';
import {FormService} from '../../../services/crud/form.service';
import {CommandNavigatorService} from '../../../services/system/command-navigator.service';
import {FormDto} from '../../../dtos/form/form-dto';
import {FormTabDto} from '../../../dtos/form/form-tab-dto';
import {ActivatedRoute} from '@angular/router';
import {DatePipe, Location} from '@angular/common';
import {ComponentPersistEntityDTO} from '../../../dtos/component/component-persist-entity-dto';
import {YesNoDialogComponent} from '../../../shared/yes-no-dialog/yes-no-dialog.component';
import {FormControlButtonDTO} from '../../../dtos/form/form-control-button-dto';
import {OkDialogComponent} from '../../../shared/ok-dialog/ok-dialog.component';
import {PreviousRouteService} from '../../../services/system/previous-route.service';
import {DomSanitizer, Title} from '@angular/platform-browser';
import {FormScriptsService} from '../../../services/system/form-scripts.service';
import {FormActionButton} from '../../../dtos/form/form-action-button';
import {DynamicCssScriptLoaderService} from '../../../services/system/dynamic-css-script-loader.service';
import {concatMap} from 'rxjs/operators';
import {FormAssignmentsService} from './services/form-assignments.service';
import {FormTableLinesService} from './services/form-table-lines.service';
import {LanguageService} from '../../../services/system/language.service';
import {ListSearchService} from '../../../services/system/list-search.service';
import {DateConverterService} from '../../../services/system/date-converter.service';

@Component({
  selector: 'app-form', templateUrl: './form.component.html', styleUrls: ['./form.component.css']
})
export class FormComponent extends PageComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren('formFields') formFields: QueryList<any>;
  public dto: FormDto;
  public selectedFormTabId: string;
  public selectedFormPopupCode: string;
  @ViewChild('yesNoDialog') yesNoDialog: YesNoDialogComponent;
  @ViewChild('okDialog') okDialog: OkDialogComponent;
  public selectedActionButton: FormActionButton
  id = '';
  selectionId = '';
  languageSelectionSubject;
  clonedData = false;
  searchSubject;

  constructor(private activatedRoute: ActivatedRoute, private service: FormService, private location: Location, private previousRouteService: PreviousRouteService, private navigatorService: CommandNavigatorService, private dynamicCssScriptLoader: DynamicCssScriptLoaderService, public datepipe: DatePipe, private title: Title, public formScriptsService: FormScriptsService, private formAssignmentsService: FormAssignmentsService, private formTableLinesService: FormTableLinesService, private languageService: LanguageService, private el: ElementRef, private listSearchService: ListSearchService, private sanitizer: DomSanitizer, private dateConverterService: DateConverterService) {
    super();
  }

  ngOnInit(): void {
    this.initNav(this.activatedRoute);

    this.selectionId = '';
    this.dto = new FormDto();

    const locateParams = this.getLocateParams();
    if (locateParams.has('ID')) {
      this.id = locateParams.get('ID');
    }

    if (locateParams.has('SELECTION-ID')) {
      this.selectionId = locateParams.get('SELECTION-ID');
    }

    if (this.params.has('TYPE')) {
      if (this.params.get('TYPE').toUpperCase() === 'CLONE') {
        this.clonedData = true;
      }
    }

    this.loadDynamicCssScript(this.id).then(data => {
      this.retrieveAndAssignData(this.id, this.selectionId);
    });
  }

  ngAfterViewInit() {
    this.applyLanguageSelection();
    this.applyHeaderSearchFilter();
  }

  ngOnDestroy() {
    this.languageSelectionSubject.unsubscribe();
    this.searchSubject.unsubscribe();
  }

  applyHeaderSearchFilter() {
    this.searchSubject = this.listSearchService.listSearchEmmiter.subscribe((searchVaule: string) => {

      if (this.dto.formTabs != null) {
        this.dto.formTabs
          .filter(formTab => formTab.formAreas != null)
          .forEach(formTab => {
            formTab.searchSelected = false;
            formTab.formAreas
              .filter(formArea => formArea.formControls != null)
              .forEach(formArea => {

                formArea.formControls
                  .filter(formControl => formControl.type === 'field')
                  .forEach(formControl => {
                    const value = formControl.formControlField.componentPersistEntityField.value == null ? '' : formControl.formControlField.componentPersistEntityField.value;
                    const fieldDescription = formControl.formControlField.description == null ? '' : formControl.formControlField.description;
                    formControl.searchSelected = false;
                    if ((value.toString().toLowerCase().includes(searchVaule.toLowerCase()) || fieldDescription.toString().toLowerCase().includes(searchVaule.toLowerCase())) && searchVaule !== '') {
                      formControl.searchSelected = true;
                      formTab.searchSelected = true;
                    }
                  });

                formArea.formControls
                  .filter(formControl => formControl.type === 'table')
                  .forEach(formControl => {
                    formControl.formControlTable.formControlLines
                      .forEach(formControlLine => {
                        formControlLine.formControlCells.forEach(formControlCell => {
                          const value = formControlCell.componentPersistEntityField.value == null ? '' : formControlCell.componentPersistEntityField.value;
                          const fieldDescription = formControlCell.formControl.formControlField.description == null ? '' : formControlCell.formControl.formControlField.description;
                          formControlCell.searchSelected = false;
                          if ((value.toString().toLowerCase().includes(searchVaule.toLowerCase()) || fieldDescription.toString().toLowerCase().includes(searchVaule.toLowerCase())) && searchVaule !== '') {
                            formControlCell.searchSelected = true;
                            formTab.searchSelected = true;
                          }
                        });
                      });
                  });

                formArea.formControls
                  .filter(formControl => formControl.type === 'table')
                  .forEach(formControl => {
                    formControl.formControlTable.formControls.forEach(tableFieldComponent => {

                      const fieldDescription = tableFieldComponent.formControlField.description == null ? '' : tableFieldComponent.formControlField.description;
                      tableFieldComponent.searchSelected = false;
                      if (fieldDescription.toString().toLowerCase().includes(searchVaule.toLowerCase()) && searchVaule !== '') {
                        tableFieldComponent.searchSelected = true;
                        formTab.searchSelected = true;
                      }
                    });
                  });

              });
          });
      }
    })
  }

  applyLanguageSelection() {
    this.languageSelectionSubject = this.languageService.languageSelectionEmmiter.subscribe((languageCode: string) => {
      this.retrieveAndAssignData(this.id, this.selectionId);
    });
  }

  refreshFormField(code: string): void {
    this.formFields
      .filter((formField: any) => formField.componentPersistEntityDTO.code + '.' + formField.componentPersistEntityFieldDTO.code === code)
      .forEach((formField: any) => {
        formField.refresh();
        console.log(formField);
      });
  }

  findFormField(code: string): void {
    return this.formFields
      .find((formField: any) => formField.componentPersistEntityDTO.code + '.' + formField.componentPersistEntityFieldDTO.code == code);
  }

  loadDynamicCssScript(id: any): Promise<any> {
    return this.dynamicCssScriptLoader.addScript(id, 'form');
  }

  retrieveAndAssignData(id: string, selectionId: string) {
    const language = JSON.parse(localStorage.getItem('loggedin_user')).currentLanguage;
    const languageId = language == null ? 0 : language.id;

    this.service.getUiVersion(id)
      .pipe(concatMap(instanceVersion => this.service.getUi(id, languageId, instanceVersion))).subscribe(dto => {
      localStorage.setItem('cachedForm' + id + '-' + languageId, JSON.stringify(dto));
      this.service.getData(id, selectionId, languageId, this.clonedData).subscribe(componentDTO => {
        dto.component = componentDTO;
        this.dto = dto;
        this.setSelectedComponentPersistEntityFieldsToTables(this.dto.component.componentPersistEntityList);

        this.dto.component.componentPersistEntityList = this.formAssignmentsService.addAssignmentsToTableDataLines(this.dto.component.componentPersistEntityList);

        this.dto = this.formAssignmentsService.assignComponentFieldsToFormFields(this.dto);
        this.dto = this.formTableLinesService.generateFormTableLines(this.dto);
        this.setDefaultSelectedTab();
        this.formScriptsService.load(this);
        this.defineTitle();
      });
    });
  }

  defineTitle() {
    if (this.commandShowCustomTitle()) {
      let windowTitle = this.getWindowCustomTitleFromCommand();
      windowTitle = this.setWindowTitleFieldValues(windowTitle, this.dto.component.componentPersistEntityList);
      this.title.setTitle(windowTitle);
    }
  }

  setWindowTitleFieldValues(windowTitle: string, componentPersistEntityList: ComponentPersistEntityDTO[]) {
    for (const cpe of componentPersistEntityList) {
      for (const cpef of cpe.componentPersistEntityFieldList) {
        windowTitle = windowTitle.replace('#' + cpe.code + '.' + cpef.code + '#', cpef.value);
      }
      if (cpe.componentPersistEntityList != null) {
        this.setWindowTitleFieldValues(windowTitle, cpe.componentPersistEntityList);
      }
    }
    return windowTitle;
  }

  saveAndBack() {
    const componentValues = this.mapComponentTreeForSaving(this.dto.component.componentPersistEntityList);
    if (this.selectionId === '') {
      this.service.saveData(this.dto.id, componentValues).subscribe(data => {
        this.location.back();
      });
    } else {
      this.service.updateData(this.dto.id, componentValues).subscribe(data => {
        this.location.back();
      });
    }

  }

  save(callback) {
    const componentValues = this.mapComponentTreeForSaving(this.dto.component.componentPersistEntityList);
    if (this.selectionId === '') {

      this.service.saveData(this.dto.id, componentValues).subscribe(data => {
        callback(data);
      });
    } else {
      this.service.updateData(this.dto.id, componentValues).subscribe(data => {
        callback(data);
      });
    }
  }

  makeReadOnly() {
    if (this.dto.formActionButtons != null) {
      this.dto.formActionButtons.forEach(formActionButton => {
        formActionButton.editable = false;
      });
    }
    const formSections = this.dto.formTabs.concat(this.dto.formPopups);
    if (formSections != null) {
      formSections
        .filter(formTab => formTab.formAreas != null)
        .forEach(formTab => {
          formTab.formAreas
            .filter(formArea => formArea.formControls != null)
            .forEach(formArea => {
              formArea.formControls
                .forEach(formControl => {
                  if (formControl.type === 'field') {
                    formControl.formControlField.editable = false;
                  }
                  if (formControl.type === 'table') {
                    formControl.formControlTable.editable = false;
                    formControl.formControlTable.formControls.forEach(formControl => formControl.formControlField.editable = false);
                  }
                  // if (formControl.type === 'table') {
                  //   formControl.formControlTable.formControlButtons = [];
                  // }
                });
            });
        });
    }
  }

  mapComponentTreeForSaving(cpeList: ComponentPersistEntityDTO[]) {
    const componentPersistEntitiesMap = new Map();
    for (const cpe of cpeList) {
      let cpeMap: Map<any, any>;
      if (cpe.multiDataLine === true) {
        cpeMap = this.mapMultilineComponentPersistEntityForSaving(cpe);
      } else {
        cpeMap = this.mapComponentPersistEntityForSaving(cpe) // , componentPersistEntitiesMap);
      }
      componentPersistEntitiesMap.set(cpe.code, cpeMap);
    }

    return componentPersistEntitiesMap;
  }

  mapComponentPersistEntityForSaving(componentPersistEntity: ComponentPersistEntityDTO) {
    const componentPersistEntityMap = new Map();

    /* Itterate fields and assign to Component Persist Entity map */
    for (const cpef of componentPersistEntity.componentPersistEntityFieldList) {

      /* If field not Assigned, assign it to map */
      if (!componentPersistEntityMap.has(cpef.code)) {

        let value = null;
        if (['datetime', 'datetime_det'].includes(cpef?.assignment?.type) && (cpef?.value instanceof Date)) {
          value = (cpef.value == null ? '' : cpef?.value?.toISOString());
        } else {
          value = cpef.value;
        }

        componentPersistEntityMap.set(cpef.code, value);
      }
    }

    if (componentPersistEntity.componentPersistEntityList != null) {
      const componentPersistSubEntitiesMap = this.mapComponentTreeForSaving(componentPersistEntity.componentPersistEntityList);
      componentPersistEntityMap.set('sub-entities', componentPersistSubEntitiesMap);
    }

    /* Return new Component Persist Entity Map  */
    return componentPersistEntityMap;
  }

  mapMultilineComponentPersistEntityForSaving(componentPersistEntity: ComponentPersistEntityDTO) {

    const componentPersistEntityMap = new Map();
    let index = 0;
    for (const componentPersistEntityDataLine of componentPersistEntity.componentPersistEntityDataLines) {
      const componentPersistEntityLineMap = new Map();
      for (const cpef of componentPersistEntityDataLine.componentPersistEntityFieldList) {
        if (!componentPersistEntityLineMap.has(cpef.code)) {
          let value = null;
          if (['datetime', 'datetime_det'].includes(cpef?.assignment?.type) && (cpef?.value instanceof Date)) {
            value = (cpef.value == null ? '' : cpef?.value?.toISOString());
          } else {
            value = cpef.value;
          }

          componentPersistEntityLineMap.set(cpef.code, value);
        }
      }

      if (componentPersistEntityDataLine.componentPersistEntityList != null) {
        const componentPersistSubEntitiesMap = this.mapComponentTreeForSaving(componentPersistEntityDataLine.componentPersistEntityList);
        componentPersistEntityLineMap.set('sub-entities', componentPersistSubEntitiesMap);
      }

      componentPersistEntityMap.set(index, componentPersistEntityLineMap);
      index++;
    }

    componentPersistEntityMap.set('multiline-entity', 'true');
    return componentPersistEntityMap;
  }

  delete() {
    this.service.deleteData(this.dto.id, this.selectionId).subscribe(data => {
      this.location.back();
    });
  }

  setSelectedComponentPersistEntityFieldsToTables(componentPersistEntityList: ComponentPersistEntityDTO[]) {
    for (const componentPersistEntity of componentPersistEntityList) {
      if (componentPersistEntity.multiDataLine) {
        if (componentPersistEntity.componentPersistEntityDataLines.length > 0) {
          componentPersistEntity.componentPersistEntityList = componentPersistEntity.componentPersistEntityDataLines[0].componentPersistEntityList;
          componentPersistEntity.componentPersistEntityFieldList = componentPersistEntity.componentPersistEntityDataLines[0].componentPersistEntityFieldList;
        }
      }

      if (componentPersistEntity.componentPersistEntityList != null) {
        this.setSelectedComponentPersistEntityFieldsToTables(componentPersistEntity.componentPersistEntityList);
      }
    }
  }

  setDefaultSelectedTab() {
    this.selectedFormTabId = '';

    if (this.dto.formTabs.length > 0) {
      this.selectedFormTabId = this.dto.formTabs[0].id;
    } else {
      return;
    }
  }

  selectFormTab(formTab: FormTabDto) {
    this.formScriptsService.buttonClickOccured(this.dto.id, formTab.code);
    this.selectedFormTabId = formTab.id;
  }

  navigateToNextPage() {
  }

  setSelectedTableLineComponentTree(componentPersistEntity: ComponentPersistEntityDTO, formControlLineComponentPersistEntity: ComponentPersistEntityDTO) {

    componentPersistEntity.componentPersistEntityFieldList
      .forEach(cpef => {
        formControlLineComponentPersistEntity.componentPersistEntityFieldList
          .filter(lineCpef => lineCpef.id === cpef.id)
          .forEach(lineCpef => cpef.value = lineCpef.value);
      });

    componentPersistEntity.componentPersistEntityList
      .forEach(cpe => {
        formControlLineComponentPersistEntity.componentPersistEntityList
          .filter(lineCpe => lineCpe.id === cpe.id)
          .forEach(lineCpe => this.setSelectedTableLineComponentTree(cpe, lineCpe));
      });

  }

  formButtonClicked(formControlButton: FormControlButtonDTO) {

    this.formScriptsService.buttonClickOccured(this.dto.id, formControlButton.code);

    const command = formControlButton.editor;
    if (command == null) {
      return;
    }

    if (command === '') {
      return;
    }

    this.navigatorService.navigate(command);
  }

  headerActionButtonClicked(actionButton: FormActionButton) {
    this.formScriptsService.buttonClickOccured(this.dto.id, actionButton.code);

    if (actionButton.editor == null || actionButton.editor === '') {
      return;
    }

    if (actionButton.editor === '#saveAndBack#') {
      this.saveAndBack();
      return;
    }

    if (actionButton.editor === '#delete#') {
      this.delete();
      return;
    }

    this.navigatorService.navigate(actionButton.editor);

  }

  setSelectedActionButton(actionButton: FormActionButton) {
    this.selectedActionButton = actionButton;
  }

  fieldEventOccured(event: any) {
    this.formScriptsService.fieldEventOccured(this.dto.id, event.entityCode, event.fieldCode, event.eventtype, event.event);
  }

  mapTreeToArrays(data: Map<any, any>) {
    return this.service.mapTreeToArrays(data);
  }

  getFieldByCode(fieldCode) {
    const formSections = this.dto.formTabs.concat(this.dto.formPopups);
    for (const formTab of formSections) {
      for (const formArea of formTab.formAreas) {
        for (const formControl of formArea.formControls) {
          if (formControl.type === 'field') {
            const curFieldCode = formControl.formControlField.componentPersistEntity.code + '.' + formControl.formControlField.componentPersistEntityField.code;
            if (fieldCode === curFieldCode) {
              return formControl.formControlField;
            }
          }
        }
      }
    }
  }

  public getFromBackendWithCustomHeaders(url: string, customHeaders: [], callback: (n: any, result: boolean) => any) {
    this.formScriptsService.getFromBackendWithCustomHeaders(url, customHeaders, callback);
  }

  public getFromUrlWithCustomHeaders(url: string, headers: [], callback: (n: any, result: boolean) => any) {
    this.formScriptsService.getFromUrlWithCustomHeaders(url, headers, callback);
  }

  trustResource(resource) {
    resource = (resource == null ? '' : resource.toString());
    resource = this.dateConverterService.replaceIsoToClientDateFormatsInText(resource);
    return this.sanitizer.bypassSecurityTrustHtml(resource);
  }

}
