import {ComponentPersistEntityDTO} from '../component/component-persist-entity-dto';
import {ComponentPersistEntityFieldDTO} from '../component/component-persist-entity-field-dto';

export class ListComponentGroupFieldDTO {
  editor: string;
  description: string;
  type: string
  public componentTableDTO: ComponentPersistEntityDTO;
  public componentTableFieldDTO: ComponentPersistEntityFieldDTO;
  visible: Boolean;
  editable: Boolean;
}
