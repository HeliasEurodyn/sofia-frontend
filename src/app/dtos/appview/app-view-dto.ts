import {BaseDTO} from '../common/base-dto';
import {ViewFieldDTO} from '../view/view-field-dto';
import {AppViewFieldDTO} from './app-view-field-dto';

export class AppViewDTO extends BaseDTO {
  name: string;
  description: string;
  query: string;
  public appViewFieldList: AppViewFieldDTO[];
}
