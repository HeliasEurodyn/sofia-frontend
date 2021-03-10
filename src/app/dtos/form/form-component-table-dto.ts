import {BaseDTO} from '../common/base-dto';
import {ComponentPersistEntityDTO} from '../component/component-persist-entity-dto';
import {FormComponentTableComponentDTO} from './form-component-table-component-dto';
import {FormComponentTableComponentLineDTO} from './form-component-table-component-line-dto';

export class FormComponentTableDTO extends BaseDTO {

  description: string;
  visible: Boolean;
  editable: Boolean;
  required: Boolean;
  css: string;
  public componentPersistEntity: ComponentPersistEntityDTO;
  public formComponents: FormComponentTableComponentDTO[] = [];

  public formComponentLine: FormComponentTableComponentLineDTO
  public formComponentLines: FormComponentTableComponentLineDTO[] = [];

  addFormComponentLine() {

    /* Create new formComponentLine */
    this.formComponentLine = new FormComponentTableComponentLineDTO();

    /* Clone Form components and assign to formComponentLine.formComponents */
    this.formComponents.forEach(val => this.formComponentLine.formComponents.push(Object.assign({}, val)));

    /* Clone componentPersistEntity and assign to formComponentLine.componentPersistEntity */
    this.formComponentLine.componentPersistEntity = Object.assign({}, this.componentPersistEntity);

    /* Add new formComponentLine to Lines */
    this.formComponentLines.push(this.formComponentLine);

  }

}
