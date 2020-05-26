import {Table, TableField} from './table';

export class TableComponent {
  id: number;
  name: string;
  description: string;
  public table: Table;
  public componentFieldList: TableComponentField[];
  createdOn: Date;
  createdBy: string;
  version: number;
  showFieldList: boolean;
}

export class TableComponentField {
  id: number;
  tableField: TableField;
  public table: Table;
  description: string;
  editor: string;
  public componentFieldList: TableComponentField[];
  shortOrder: number;
  createdOn: Date;
  createdBy: string;
  version: number;
  showFieldList: boolean;
}
