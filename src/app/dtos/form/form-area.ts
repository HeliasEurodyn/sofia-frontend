import {BaseDTO} from '../common/base-dto';
import {FormComponentFieldDTO} from './form-component-field-dto';
import {FormComponentDto} from './form-component-dto';

export class FormArea extends BaseDTO {

  public description: string;

  public icon: string;

  public cssclass: string;

  public formComponents: FormComponentDto[] = [];
}
