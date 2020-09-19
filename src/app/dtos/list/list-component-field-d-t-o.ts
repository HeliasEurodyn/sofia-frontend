import {BaseDTO} from '../common/base-dto';
import {ComponentPersistEntityFieldDTO} from '../component/component-persist-entity-field-dto';
import {ComponentPersistEntityDTO} from '../component/component-persist-entity-dto';


export class ListComponentFieldDTO extends BaseDTO {
  code: string;
  editor: string;
  description: string;
  type: string
  public componentPersistEntity: ComponentPersistEntityDTO;
  public componentPersistEntityField: ComponentPersistEntityFieldDTO;
  visible: Boolean;
  editable: Boolean;
  required: Boolean;
  defaultValue: string;
  decimals: number;
  fieldtype: string;
  shortLocation: string;
  operator: string;
  bclass: string;
  css: string;
  fieldValue: any;
  formulaType: string;
}
