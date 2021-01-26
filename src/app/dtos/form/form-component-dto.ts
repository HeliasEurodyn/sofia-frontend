import {FormComponentFieldDTO} from './form-component-field-dto';
import {BaseDTO} from '../common/base-dto';

export class FormComponentDto extends BaseDTO {
  type: string;
  cssclass: string;
  public formComponentField: FormComponentFieldDTO;
}
