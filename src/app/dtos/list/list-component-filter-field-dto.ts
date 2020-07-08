import {ComponentPersistEntityFieldDTO} from '../component/component-persist-entity-field-dto';
import {ComponentPersistEntityDTO} from '../component/component-persist-entity-dto';


export class ListComponentFilterFieldDTO {
  editor: string;
  description: string;
  type: string
  public componentTableDTO: ComponentPersistEntityDTO;
  public componentTableFieldDTO: ComponentPersistEntityFieldDTO;
  visible: Boolean;
  editable: Boolean;
}
