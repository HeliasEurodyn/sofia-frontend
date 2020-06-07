import {ComponentTableDTO, ComponentTableFieldDTO} from '../component/componentDTO';

export class ListComponentGroupFieldDTO {
  editor: string;
  description: string;
  type: string
  public componentTableDTO: ComponentTableDTO;
  public componentTableFieldDTO: ComponentTableFieldDTO;
  visible: Boolean;
  editable: Boolean;
}
