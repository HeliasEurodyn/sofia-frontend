import {TableDTO, TableFieldDTO} from '../table/tableDTO';
import {BaseDTO} from '../common/base-dto';

export class ComponentDTO extends BaseDTO {
  name: string;
  description: string;
  public componentTableList: ComponentTableDTO[];

}


export class ComponentTableDTO extends BaseDTO {
  public table: TableDTO;
  code: string;
  selector: string;
  public componentTableFieldList: ComponentTableFieldDTO[];
  showFieldList: boolean;
}

export class ComponentTableFieldDTO extends BaseDTO {
  tableField: TableFieldDTO;
  description: string;
  editor: string;
}
