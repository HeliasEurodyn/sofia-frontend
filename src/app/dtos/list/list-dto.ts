import {BaseDTO} from '../common/base-dto';
import {ComponentDTO} from '../component/componentDTO';
import {ListComponentFieldDTO} from './list-component-field-d-t-o';
import {ListActionButton} from './list-action-button';
import {ListCssDTO} from './list-css-dto';
import {ListScriptDTO} from './list-script-dto';
import {AccessControlDto} from '../security/access-control-dto';
import {ListTranslationDTO} from './translation/list-translation-dto';

export class ListDTO extends BaseDTO {
  public code = '';
  public name = '';
  public headerTitle = '';
  public headerDescription = '';
  public headerIcon = '';
  public groupingTitle = '';
  public groupingDescription = '';
  public groupingClass: string = '';
  public title = '';
  public description = '';
  public icon = '';
  public selector = '';
  public filterFieldStructure: String = '';
  public customFilterFieldStructure: Boolean = false;
  public exportExcel: Boolean;
  public defaultPage: String = 'list';
  public autoRun: Boolean = false;
  public listVisible: Boolean = true;
  public filterVisible: Boolean = false;
  public filterClass: string = '';

  public hasPagination: Boolean;
  public totalPages: number;
  public currentPage: number;
  public pageSize: number;
  public hasMaxSize: Boolean;
  public maxSize: number;
  public headerFilters: Boolean;
  public jsonUrl = '';
  public accessControlEnabled: Boolean;
  public businessUnit: string;
  public component: ComponentDTO;
  public listActionButtons: ListActionButton[] = [];
  public listComponentColumnFieldList: ListComponentFieldDTO[] = [];
  public listComponentFilterFieldList: ListComponentFieldDTO[] = [];
  public listComponentLeftGroupFieldList: ListComponentFieldDTO[] = [];
  public listComponentTopGroupFieldList: ListComponentFieldDTO[] = [];
  public listComponentOrderByFieldList: ListComponentFieldDTO[] = [];
  public listComponentActionFieldList: ListComponentFieldDTO[] = [];
  public listScripts: ListScriptDTO[] = [];
  public listCssList: ListCssDTO[] = [];
  public instanceVersion: number;
  public accessControls: AccessControlDto[] = [];

  public translations: ListTranslationDTO[] = [];
}
