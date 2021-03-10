import {BaseDTO} from '../common/base-dto';
import {FormComponentFieldDTO} from './form-component-field-dto';

export class FormComponentTableComponentDTO extends BaseDTO {

  public type: string;
  public cssclass: string;
  public formComponentField: FormComponentFieldDTO;

  constructor() {
    super();
    this.formComponentField = new FormComponentFieldDTO();
  }

}
