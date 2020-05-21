import {TableDesign, TableDesignField} from './table-design';

export class TableComponent {
  id: number;
  name: string;
  description: string;
  public tableDesign: TableDesign;
  public tableComponentFieldList: TableComponentField[];
  createdOn: Date;
  createdBy: string;
  version: number;
}

export class TableComponentField {
  id: number;
  tableDesignField: TableDesignField;

  editor: string;
  public tableDesign: TableDesign;
  public tableComponentFieldList: TableComponentField[];


  shortOrder: number;
  createdOn: Date;
  createdBy: string;
  version: number;
}
