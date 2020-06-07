import { Component, OnInit } from '@angular/core';
import {TableComponentService} from '../../../services/table-component.service';
import { ListService } from 'app/services/list.service';

@Component({
  selector: 'app-list-designer-list',
  templateUrl: './list-designer-list.component.html',
  styleUrls: ['./list-designer-list.component.css']
})
export class ListDesignerListComponent implements OnInit {
  public tableData: any ;
  constructor(private service: ListService) { }

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
