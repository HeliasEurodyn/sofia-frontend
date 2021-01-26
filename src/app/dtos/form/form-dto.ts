import {ComponentDTO} from '../component/componentDTO';
import {BaseDTO} from '../common/base-dto';
import {FormTabDto} from './form-tab-dto';

export class FormDto extends BaseDTO {

  public name: string;
  public component: ComponentDTO;
  public formTabs: FormTabDto[] = [];

}
