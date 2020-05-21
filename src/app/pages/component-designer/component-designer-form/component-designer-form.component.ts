import {Component, OnInit} from '@angular/core';
import {TableDesignerService} from '../../../services/table-designer.service';
import {TableComponent, TableComponentField} from '../../../dtos/table-component';
import {TableDesign} from '../../../dtos/table-design';


@Component({
  selector: 'app-component-designer-form',
  templateUrl: './component-designer-form.component.html',
  styleUrls: ['./component-designer-form.component.css']
})
export class ComponentDesignerFormComponent implements OnInit {

  public tables: any;
  public tableComponent: TableComponent;
  public selectedTableComponent: TableComponent;

  tableDesign: TableDesign;
  tableComponentFieldList: TableComponentField[];

  constructor(private tableDesignerService: TableDesignerService) {
  }

  ngOnInit(): void {
    this.tableComponent = new TableComponent();

    this.refresh()
  }


  refresh() {

    this.tableDesignerService.get().subscribe(data => {
      this.tables = data;
    });
  }

  // setSelected(tableDesign: TableDesign, tableComponentFieldList: TableComponentField[] ) {
  //   this.tableDesign = tableDesign;
  //   this.tableComponentFieldList = tableComponentFieldList;
  // }

  setSelectedTableComponent(selectedTableComponent) {
    this.selectedTableComponent = selectedTableComponent;
  }

  selectTable(row) {

    this.selectedTableComponent.tableComponentFieldList = [];
    this.selectedTableComponent.tableDesign = row;
    let shortOrder = 1;
    for (const tableDesignField of row.customComponentFieldList) {
      const tableComponentFiled = new TableComponentField();
      tableComponentFiled.tableDesignField = tableDesignField;
      tableComponentFiled.editor = '';
      tableComponentFiled.shortOrder = shortOrder;
      this.selectedTableComponent.tableComponentFieldList.push(tableComponentFiled);
      shortOrder++;
    }

    // console.log('row ' + JSON.stringify(this.tableComponent));

  }

}
