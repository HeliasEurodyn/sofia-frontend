import {ListComponentDTO} from './list-component-dto';
import {BaseDTO} from '../common/base-dto';

export class ListDTO extends BaseDTO {
  code: string;
  name: string;
  description: string;
  public listComponentList: ListComponentDTO[] = [];
}
