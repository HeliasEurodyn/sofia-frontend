import {BaseDTO} from '../common/base-dto';
import {ComponentTableDTO, ComponentTableFieldDTO} from '../component/componentDTO';

export class ListComponentFieldDTO extends BaseDTO {
  editor: string;
  description: string;
  type: string
  public componentTable: ComponentTableDTO;
  public componentTableField: ComponentTableFieldDTO;
  visible: Boolean;
  editable: Boolean;
}
