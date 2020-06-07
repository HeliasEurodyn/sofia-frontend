import {BaseDTO} from '../common/base-dto';

export class ViewFieldDTO extends BaseDTO {
  name: string;
  description: string;
  type: string;
  size: string;
}
