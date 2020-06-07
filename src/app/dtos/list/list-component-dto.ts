import {ComponentDTO} from '../component/componentDTO';
import {BaseDTO} from '../common/base-dto';
import {ListComponentFilterFieldDTO} from './list-component-filter-field-dto';
import {ListComponentGroupFieldDTO} from './list-component-group-field-dto';
import {ListComponentFieldDTO} from './list-component-field-d-t-o';

export class ListComponentDTO extends BaseDTO {
  code: string;
  selector: string;
  public component: ComponentDTO;
  public listComponentColumnFieldList: ListComponentFieldDTO[] = [];
  public listComponentFilterFieldList: ListComponentFieldDTO[] = [];
  public listComponentLeftGroupFieldList: ListComponentFieldDTO[] = [];
  public listComponentTopGroupFieldList: ListComponentFieldDTO[] = [];
}
