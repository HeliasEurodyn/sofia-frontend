export class TableDesign {
  id: number;
  name: string;
  creationVersion: number;
  indexes: string;
  description: string;
  createdOn: Date;
  createdBy: string;
 public customComponentFieldList: Field[];
}

export class Field {
  id: number;
  linecounter: number;
  name: string;
  description: string;
  type: string;
  size: string;
  relatedComponentName: string;
  createdOn: Date;
  createdBy: string;
  autoIncrement: Boolean;
  primaryKey: Boolean;
}
