export class Table {
  id: number;
  name: string;
  creationVersion: number;
  indexes: string;
  description: string;
  createdOn: Date;
  createdBy: string;
  public tableFieldList: TableField[];
  version: number;
}

export class TableField {
  id: number;
  shortOrder: number;
  name: string;
  description: string;
  type: string;
  size: string;
  // relatedComponentName: string;
  createdOn: Date;
  createdBy: string;
  autoIncrement: Boolean;
  primaryKey: Boolean;
  version: number;
}
