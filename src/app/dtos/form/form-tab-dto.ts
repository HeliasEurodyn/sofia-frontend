import {BaseDTO} from '../common/base-dto';
import {FormArea} from './form-area';

export class FormTabDto extends BaseDTO {

  public description: string;

  public icon: string;

  public formAreas: FormArea[] = [];
}
