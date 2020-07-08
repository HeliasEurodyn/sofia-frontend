import {PersistEntityFieldDTO} from '../persistEntity/persist-entity-field-dto';
import {BaseDTO} from '../common/base-dto';

export class ComponentPersistEntityFieldDTO extends BaseDTO {

  description: string;

  editor: string;

  defaultValue: string;

  saveStatement: string;

  persistEntityField: PersistEntityFieldDTO;

}
