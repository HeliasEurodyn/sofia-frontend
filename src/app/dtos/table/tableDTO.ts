import {BaseDTO} from '../common/base-dto';

export class TableDTO extends BaseDTO {
  name: string;
  creationVersion: number;
  indexes: string;
  description: string;
  public tableFieldList: TableFieldDTO[];
}

export class TableFieldDTO extends BaseDTO {
  name: string;
  description: string;
  type: string;
  size: string;
  autoIncrement: Boolean;
  primaryKey: Boolean;
  hasDefault: Boolean;
  defaultValue: string;
  isUnsigned: Boolean;
  hasNotNull: Boolean;
}
