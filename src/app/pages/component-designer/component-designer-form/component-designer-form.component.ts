import {Component, OnInit} from '@angular/core';
import {TableService} from '../../../services/table.service';
import {TableComponent, TableComponentField} from '../../../dtos/table-component';
import {Table} from '../../../dtos/table';
import {TableComponentService} from 'app/services/table-component.service';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-component-designer-form',
  templateUrl: './component-designer-form.component.html',
  styleUrls: ['./component-designer-form.component.css']
})
export class ComponentDesignerFormComponent implements OnInit {

  public tables: any;
  public tableComponent = new TableComponent();
  public selectedTableComponent: TableComponent;
  public mode: string;

  tableDesign: Table;
  tableComponentFieldList: TableComponentField[];

  constructor(private tableService: TableService,
              private tableComponentService: TableComponentService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {

    let id = '0';
    this.refresh();

    if (this.activatedRoute.snapshot.paramMap.has('id')) {
      id = this.activatedRoute.snapshot.paramMap.get('id');
    }

    if (id === '0') {
      this.mode = 'new-record';
      this.tableComponent = new TableComponent();
    } else {
      this.mode = 'edit-record';
    }

    if (this.mode === 'edit-record') {
      this.tableComponentService.getById(id).subscribe(data => {
        this.tableComponent = data;
      });
    }

  }


  refresh() {
    this.tableService.get().subscribe(data => {
      this.tables = data;
    });
  }

  save() {

    if (this.mode === 'edit-record') {
      this.tableComponentService.put(this.tableComponent).subscribe(data => {
        this.router.navigate(['/component-designer-list']);
      });
    } else {

      this.tableComponentService.post(this.tableComponent).subscribe(data => {
        this.router.navigate(['/component-designer-list']);
      });
    }


  }

  setSelectedTableComponent(selectedTableComponent) {
    this.selectedTableComponent = selectedTableComponent;
  }

  selectTable(row) {
    this.selectedTableComponent.showFieldList = true;
    this.selectedTableComponent.componentFieldList = [];
    this.selectedTableComponent.table = row;
    let shortOrder = 1;
    for (const tableDesignField of row.tableFieldList) {
      const tableComponentFiled = new TableComponentField();
      tableComponentFiled.tableField = tableDesignField;
      tableComponentFiled.editor = '';
      tableComponentFiled.description = tableDesignField.description;
      tableComponentFiled.shortOrder = shortOrder;
      this.selectedTableComponent.componentFieldList.push(tableComponentFiled);
      shortOrder++;
    }

  }

  toList() {
    this.router.navigate(['/component-designer-list']);
  }

  delete() {
    this.tableComponentService.delete(this.tableDesign.id).subscribe(data => {
      this.router.navigate(['/component-designer-list']);
    });
  }


  unselectTable(selectedTableComponent) {
    selectedTableComponent.componentFieldList = [];
    selectedTableComponent.table = null;
  }

  hideChildren(item) {
    item.showFieldList = false;
  }

  showChildren(item) {
    item.showFieldList = true;
  }


}
