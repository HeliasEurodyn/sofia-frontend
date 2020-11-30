import {ListComponentDTO} from './list-component-dto';
import {BaseDTO} from '../common/base-dto';
import {ComponentDTO} from '../component/componentDTO';
import {ListComponentFieldDTO} from './list-component-field-d-t-o';

export class ListDTO extends BaseDTO {

  // code: string;
  public code: string;
  public name: string;
  public description: string;
  public selector: string;

  public filterFieldStructure: String = '';
  public customFilterFieldStructure: Boolean = false;

  public exportExcel: Boolean;
  public defaultPage: String = 'filter';
  public autoRun: Boolean = false;
  public listVisible: Boolean = true;
  public filterVisible: Boolean = true;

  public hasPagination: Boolean;
  public totalPages: number;
  public currentPage: number;
  public pageSize: number;
  public totalRows: number;

  public hasMaxSize: Boolean;
  public maxSize: number;

  public headerFilters: Boolean;
  public rowNavigation: string;

  public component: ComponentDTO;
  public listComponentColumnFieldList: ListComponentFieldDTO[] = [];
  public listComponentFilterFieldList: ListComponentFieldDTO[] = [];
  public listComponentLeftGroupFieldList: ListComponentFieldDTO[] = [];
  public listComponentTopGroupFieldList: ListComponentFieldDTO[] = [];
  public listComponentOrderByFieldList: ListComponentFieldDTO[] = [];
  public listComponentActionFieldList: ListComponentFieldDTO[] = [];

 // public listComponentList: ListComponentDTO[] = [];
}
