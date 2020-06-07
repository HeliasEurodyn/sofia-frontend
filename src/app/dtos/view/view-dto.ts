import {BaseDTO} from '../common/base-dto';
import {TableFieldDTO} from '../table/tableDTO';
import { ViewFieldDTO } from './view-field-dto';

export class ViewDTO extends BaseDTO {
  name: string;
  description: string;
  query: string;
  public viewFieldList: ViewFieldDTO[];
}
