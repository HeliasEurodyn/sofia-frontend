import {ComponentPersistEntityDTO} from '../component/component-persist-entity-dto';
import {ComponentPersistEntityFieldDTO} from '../component/component-persist-entity-field-dto';
import {BaseDTO} from '../common/base-dto';

export class FormComponentFieldDTO extends BaseDTO {
  editor: string;
  description: string;
  visible: Boolean;
  editable: Boolean;
  defaultValue: string;
  decimals: number;
  fieldtype: string;
  cssclass: string;
  fieldValue: any;
  type: string;
  public componentPersistEntity: ComponentPersistEntityDTO;
  public componentPersistEntityField: ComponentPersistEntityFieldDTO;
}
