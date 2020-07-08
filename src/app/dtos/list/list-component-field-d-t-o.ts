import {BaseDTO} from '../common/base-dto';
import {ComponentPersistEntityFieldDTO} from '../component/component-persist-entity-field-dto';
import {ComponentPersistEntityDTO} from '../component/component-persist-entity-dto';


export class ListComponentFieldDTO extends BaseDTO {
  editor: string;
  description: string;
  type: string
  public componentTable: ComponentPersistEntityDTO;
  public componentTableField: ComponentPersistEntityFieldDTO;
  visible: Boolean;
  editable: Boolean;
}
