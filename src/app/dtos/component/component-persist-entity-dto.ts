import {PersistEntityDTO} from '../persistEntity/persist-entity-dto';
import {ComponentPersistEntityFieldDTO} from './component-persist-entity-field-dto';
import {BaseDTO} from '../common/base-dto';

export class ComponentPersistEntityDTO extends BaseDTO {

  code: string;

  selector: string;

  public persistEntity: PersistEntityDTO;

  allowRetrieve: boolean;

  allowSave: boolean;

  public componentPersistEntityFieldList: ComponentPersistEntityFieldDTO[] = [];

  showFieldList: boolean;

}
