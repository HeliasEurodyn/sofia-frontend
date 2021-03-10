import {Component, OnInit} from '@angular/core';
import {PageComponent} from '../page/page-component';
import {FormService} from '../../services/crud/form.service';
import {CommandNavigatorService} from '../../services/command-navigator.service';
import {FormDto} from '../../dtos/form/form-dto';
import {FormTabDto} from '../../dtos/form/form-tab-dto';
import {DynamicScriptLoaderService} from '../../services/dynamic-script-loader.service';
import {FormComponentFieldDTO} from '../../dtos/form/form-component-field-dto';
import {ActivatedRoute} from '@angular/router';
import {FormComponentTableComponentDTO} from '../../dtos/form/form-component-table-component-dto';

declare function myfunction(param: string): any;

declare function passArray(param: any): any;

declare function sendMessage(callback: ((message: string) => void)): void;


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent extends PageComponent implements OnInit {

  public dto: FormDto;
  public selectedFormTabId: number;
  public test = '';

  constructor(private activatedRoute: ActivatedRoute,
              private service: FormService,
              private navigatorService: CommandNavigatorService,
              private dynamicScriptLoader: DynamicScriptLoaderService) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.setNavParams(params['nav']);
    });

    let id = '0';
    this.dto = new FormDto();

    const locateParams = this.getLocateParams();
    if (locateParams.has('ID')) {
      id = locateParams.get('ID');
    }

    this.service.getById(id).subscribe(data => {
      this.dto = data;
      this.assignComponentFieldsToFormFields();
      this.setDefaultSelectedTabs();
    });

    this.dynamicScriptLoader.load('random-gen').then(data => {
      sendMessage(this.updateDataAction);

      myfunction('test2');

      const testData: Map<string, any> = new Map<string, any>();
      testData.set('SSS', 'hhh');
      passArray(testData);

    }).catch(error => console.log(error));
  }

  assignComponentFieldsToFormFields() {
    for (const formTab of this.dto.formTabs) {
      for (const formArea of formTab.formAreas) {
        for (const formcomponent of formArea.formComponents) {
          if (formcomponent.type === 'field') {
            const componentPersistEntityField = this.getComponentPersistEntityFieldByFormField(formcomponent.formComponentField);
            formcomponent.formComponentField.componentPersistEntityField = componentPersistEntityField;
          } else if (formcomponent.type === 'table') {
            for (const formComponentTableComponent of formcomponent.formComponentTable.formComponents) {

            }
          }

        }
      }
    }
  }

  getComponentPersistEntityFieldByFormField(formComponentField: FormComponentFieldDTO) {
    const formComponentFieldName = formComponentField.componentPersistEntity.persistEntity.name + '.' +
      formComponentField.componentPersistEntityField.persistEntityField.name;

    for (const componentPersistEntity of this.dto.component.componentPersistEntityList) {
      for (const componentPersistEntityField of componentPersistEntity.componentPersistEntityFieldList) {
        const componentFieldName = componentPersistEntity.persistEntity.name + '.' + componentPersistEntityField.persistEntityField.name;

        if (componentFieldName === formComponentFieldName) {
          return componentPersistEntityField;
        }
      }
    }
  }

  public updateDataAction = (data: any) => {
    alert(data);
  };

  setDefaultSelectedTabs() {
    this.selectedFormTabId = 0;

    if (this.dto.formTabs.length > 0) {
      this.selectedFormTabId = this.dto.formTabs[0].id;
    } else {
      return;
    }
  }

  selectFormTab(formTab: FormTabDto) {
    this.selectedFormTabId = formTab.id;
  }

  save() {
    const componentValues = new Map();

    for (const formTab of this.dto.formTabs) {
      for (const formArea of formTab.formAreas) {
        for (const formcomponent of formArea.formComponents) {

          let valuePersistEntity = new Map();
          if (componentValues.has(formcomponent.formComponentField.componentPersistEntity.code)) {
            valuePersistEntity = componentValues.get(formcomponent.formComponentField.componentPersistEntity.code);
          }

          if (!valuePersistEntity.has(formcomponent.formComponentField.componentPersistEntityField.persistEntityField.name)) {
            valuePersistEntity.set(formcomponent.formComponentField.componentPersistEntityField.persistEntityField.name,
              formcomponent.formComponentField.componentPersistEntityField.value);
          }

          componentValues.set(formcomponent.formComponentField.componentPersistEntity.code, valuePersistEntity);
        }
      }
    }

    this.service.saveData(this.dto.id, componentValues).subscribe(data => {
      //   this.navigatorService.closeAndBack(this.pageId);
    });

  }

  delete() {

  }

  showPreviousPageButton() {

  }

  navigateToPreviousPage() {

  }

  showNextPageButton() {

  }

  navigateToNextPage() {

  }

  test2(event: KeyboardEvent) {
    alert('Hello');
  }

  tableFieldKeyDown(event: KeyboardEvent, id: number, formComponents: FormComponentTableComponentDTO[]) {

    if (event.ctrlKey && event.key === 'ArrowLeft') {
      let prevElementId;
      for (const formComponent of formComponents) {

        if (id === formComponent.id && prevElementId !== '') {
          document.getElementById(prevElementId).focus();
          return;
        }

        prevElementId = formComponent.id;
      }
    }

    if (event.ctrlKey && event.key === 'ArrowRight') {
      let currentElementIdFound = false;
      for (const formComponent of formComponents) {

        if (currentElementIdFound) {
          document.getElementById(formComponent.id.toString()).focus();
          return;
        }

        if (id === formComponent.id) {
          currentElementIdFound = true;
        }
      }
    }


  }


}
