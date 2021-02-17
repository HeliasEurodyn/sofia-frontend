import {ComponentDTO} from '../component/componentDTO';
import {BaseDTO} from '../common/base-dto';
import {FormTabDto} from './form-tab-dto';
import {FormScript} from './form-script';

export class FormDto extends BaseDTO {

  public name: string;
  public component: ComponentDTO;
  public formTabs: FormTabDto[] = [];
  public formScripts: FormScript[] = [];

}
