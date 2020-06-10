import {Component, OnInit} from '@angular/core';
import {TableService} from '../../../services/table.service';
import {BaseComponent} from '../../common/base-component';

@Component({
  selector: 'app-table-designer-list',
  templateUrl: './table-designer-list.component.html',
  styleUrls: ['./table-designer-list.component.css']
})
export class TableDesignerListComponent extends BaseComponent implements OnInit {
  public tableData: any;

  constructor(private service: TableService) {
    super();
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
