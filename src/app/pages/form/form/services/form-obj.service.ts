import {Injectable} from '@angular/core';
import {FormDto} from '../../../../dtos/form/form-dto';
import {FormArea} from '../../../../dtos/form/form-area';
import {FormControlDto} from '../../../../dtos/form/form-control-dto';

@Injectable({
  providedIn: 'root'
})
export class FormObjService {

  constructor() {
  }

  public getFormAreaByCode(code, dto: FormDto): FormArea {
    const formSections = dto.formTabs.concat(dto.formPopups);
    for (const formTab of formSections) {
      for (const formArea of formTab.formAreas) {
        if (formArea.code === code) {
          return formArea;
        }
      }
    }
    return null;
  }

  public getFormFieldsByCode(code, dto: FormDto): FormControlDto[] {
    const formControls: FormControlDto[] = [];

    const formSections = dto.formTabs.concat(dto.formPopups);
    for (const formTab of formSections) {
      for (const formArea of formTab.formAreas) {
        for (const formControl of formArea.formControls) {
          if (formControl.type === 'field' && formControl.formControlField != null) {
            if (formControl.formControlField.componentPersistEntity != null &&
              formControl.formControlField.componentPersistEntityField != null) {
              const curFieldCode = formControl.formControlField.componentPersistEntity.code + '.'
                + formControl.formControlField.componentPersistEntityField.code;
              if (code === curFieldCode) {
                formControls.push(formControl);
              }
            }
          }
          if (formControl.type === 'table' && formControl.formControlTable != null) {
              const curCode = formControl.formControlTable.componentPersistEntity.code;
              if (code === curCode) {
                formControls.push(formControl);
              }
          }
        }
      }
    }
    return formControls;
  }


}
