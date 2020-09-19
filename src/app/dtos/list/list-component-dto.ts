import {ComponentDTO} from '../component/componentDTO';
import {BaseDTO} from '../common/base-dto';
import {ListComponentFieldDTO} from './list-component-field-d-t-o';

export class ListComponentDTO extends BaseDTO {
  code: string;
  selector: string;
  public component: ComponentDTO;
  public listComponentColumnFieldList: ListComponentFieldDTO[] = [];
  public listComponentFilterFieldList: ListComponentFieldDTO[] = [];
  public listComponentLeftGroupFieldList: ListComponentFieldDTO[] = [];
  public listComponentTopGroupFieldList: ListComponentFieldDTO[] = [];
  public listComponentOrderByFieldList: ListComponentFieldDTO[] = [];
  public listComponentActionFieldList: ListComponentFieldDTO[] = [];
  public filterFieldStructure: String = '';
  public customFilterFieldStructure: Boolean = false;
  public exportExcel: Boolean;
  public hasPagination: Boolean;
  public totalPages: number;
  public rowsLimit: number;
  public HeaderFilters: Boolean;
  public rowNavigation: string;
}
