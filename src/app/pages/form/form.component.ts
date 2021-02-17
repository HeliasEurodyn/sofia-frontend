import {Component, OnInit} from '@angular/core';
import {PageComponent} from '../page/page-component';
import {FormService} from '../../services/crud/form.service';
import {CommandNavigatorService} from '../../services/command-navigator.service';
import {FormDto} from '../../dtos/form/form-dto';
import {FormTabDto} from '../../dtos/form/form-tab-dto';
import {DynamicScriptLoaderService} from '../../services/dynamic-script-loader.service';
import {FormComponentFieldDTO} from '../../dtos/form/form-component-field-dto';

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

  // public componentValues = new Map();

  constructor(private service: FormService,
              private navigatorService: CommandNavigatorService,
              private dynamicScriptLoader: DynamicScriptLoaderService) {
    super();
  }

  ngOnInit(): void {
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
          const componentPersistEntityField = this.assignComponents(formcomponent.formComponentField);
          formcomponent.formComponentField.componentPersistEntityField = componentPersistEntityField;
        }
      }
    }
  }

  assignComponents(formComponentField: FormComponentFieldDTO) {
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

  // findComponentValueField(formComponentField: FormComponentFieldDTO) {
  //
  //   const formComponentFieldName = formComponentField.componentPersistEntity.persistEntity.name + '.' +
  //     formComponentField.componentPersistEntityField.persistEntityField.name;
  //
  //   for (const componentPersistEntity of this.dto.component.componentPersistEntityList) {
  //     for (const componentPersistEntityField of componentPersistEntity.componentPersistEntityFieldList) {
  //       const componentFieldName = componentPersistEntity.persistEntity.name + '.' + componentPersistEntityField.persistEntityField.name;
  //
  //       if (componentFieldName === formComponentFieldName) {
  //         return componentPersistEntityField.value;
  //       }
  //       // if (!this.componentValues.has(fieldName)) {
  //       //   this.componentValues.set(fieldName, '');
  //       //  }
  //     }
  //   }
  // }



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

    for (const formTab of this.dto.formTabs) {
      for (const formArea of formTab.formAreas) {
        for (const formcomponent of formArea.formComponents) {
          console.log(formcomponent.formComponentField.componentPersistEntityField.value);
        }
      }
    }


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
}
