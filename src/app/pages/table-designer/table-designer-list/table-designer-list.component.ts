import {Component, OnInit} from '@angular/core';
import {TableService} from '../../../services/table.service';

@Component({
  selector: 'app-table-designer-list',
  templateUrl: './table-designer-list.component.html',
  styleUrls: ['./table-designer-list.component.css']
})
export class TableDesignerListComponent implements OnInit {
  public tableData: any;

  constructor(private service: TableService) {
  }

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
