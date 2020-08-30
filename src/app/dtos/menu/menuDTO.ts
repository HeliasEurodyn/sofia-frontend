import {BaseDTO} from '../common/base-dto';

export class MenuDTO extends BaseDTO {

  name: string;
  menuFieldList: MenuFieldDTO[];

  constructor() {
    super();
    this.name = '';
    this.menuFieldList = [];
  }
}

export class MenuFieldDTO extends BaseDTO {
  name: string;
  icon: string;
  command: string;
  menuFieldList: MenuFieldDTO[];

  constructor() {
    super();
    this.menuFieldList = [];
  }
}
