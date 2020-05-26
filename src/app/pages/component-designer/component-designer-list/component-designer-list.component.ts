import { Component, OnInit } from '@angular/core';
import {TableService} from '../../../services/table.service';
import {TableComponentService} from '../../../services/table-component.service';

@Component({
  selector: 'app-component-designer-list',
  templateUrl: './component-designer-list.component.html',
  styleUrls: ['./component-designer-list.component.css']
})
export class ComponentDesignerListComponent implements OnInit {
  public tableData: any;
  constructor(private service: TableComponentService) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.tableData = {
      headerRow: ['ID', 'Name', 'Created at']
    };

    this.service.get().subscribe(data => {
      this.tableData.dataRows = data;
    });
  }

  delete(row: any) {
    this.service.delete(row['id']).subscribe(data => {
      this.refresh();
    });
  }

}
