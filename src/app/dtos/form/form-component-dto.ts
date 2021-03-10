import {FormComponentFieldDTO} from './form-component-field-dto';
import {BaseDTO} from '../common/base-dto';
import {FormComponentTableDTO} from './form-component-table-dto';

export class FormComponentDto extends BaseDTO {

  public type: string;
  public cssclass: string;
  public formComponentField: FormComponentFieldDTO;
  public formComponentTable: FormComponentTableDTO;

  constructor() {
    super();
    this.formComponentField = new FormComponentFieldDTO();
    this.formComponentTable = new FormComponentTableDTO();
  }

}
