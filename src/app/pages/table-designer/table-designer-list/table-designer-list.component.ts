import {Component, OnInit} from '@angular/core';
import {TableDesignerService} from '../../../services/table-designer.service';

@Component({
  selector: 'app-table-designer-list',
  templateUrl: './table-designer-list.component.html',
  styleUrls: ['./table-designer-list.component.css']
})
export class TableDesignerListComponent implements OnInit {
  public tableData: any;

  constructor(private tableDesignerService: TableDesignerService) {
  }

  ngOnInit(): void {

    this.refresh();
  }

  refresh() {
    this.tableData = {
      headerRow: ['ID', 'Name', 'Version']
    };

    this.tableDesignerService.get().subscribe(data => {
      this.tableData.dataRows = data;
    });
  }

  delete(row: any) {
    this.tableDesignerService.delete(row['id']).subscribe(data => {
      this.refresh()
    });
  }
}
