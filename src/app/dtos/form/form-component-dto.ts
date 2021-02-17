import {FormComponentFieldDTO} from './form-component-field-dto';
import {BaseDTO} from '../common/base-dto';

export class FormComponentDto extends BaseDTO {

  public type: string;
  public cssclass: string;
  public formComponentField: FormComponentFieldDTO;

  constructor() {
    super();
    this.formComponentField = new FormComponentFieldDTO();
  }

}
