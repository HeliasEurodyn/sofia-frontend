import { Component, OnInit } from '@angular/core';
import {TableService} from '../../../services/table.service';
import { ViewService } from 'app/services/view.service';

@Component({
  selector: 'app-view-designer-list',
  templateUrl: './view-designer-list.component.html',
  styleUrls: ['./view-designer-list.component.css']
})
export class ViewDesignerListComponent implements OnInit {
  public tableData: any;
  constructor(private service: ViewService) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.service.get().subscribe(data => {
      this.tableData = data;
    });
  }

  delete(row: any) {
    this.service.delete(row['id']).subscribe(data => {
      this.refresh();
    });
  }


}
