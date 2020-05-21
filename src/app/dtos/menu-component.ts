export class MenuComponent {
  id: number;
  name: string;
  createdOn: Date;
  createdBy: string;
  menuFieldList: MenuField[];
  version: number;
  constructor() {
    this.menuFieldList = [];
  }

}

export class MenuField {
  id: number;
  linecounter: number;
  name: string;
  icon: string;
  command: string;
  menuFieldList: MenuField[];
  version: number;
  constructor() {
    this.menuFieldList = [];
  }
}
