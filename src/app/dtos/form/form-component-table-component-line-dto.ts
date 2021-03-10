import {BaseDTO} from '../common/base-dto';
import {ComponentPersistEntityDTO} from '../component/component-persist-entity-dto';
import {FormComponentTableComponentDTO} from './form-component-table-component-dto';

export class FormComponentTableComponentLineDTO extends BaseDTO {

  public componentPersistEntity: ComponentPersistEntityDTO;
  public formComponents: FormComponentTableComponentDTO[] = [];

}
