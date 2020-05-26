import { Component, OnInit } from '@angular/core';
import {MenuService} from '../../../services/menu.service';

@Component({
  selector: 'app-menu-designer-list',
  templateUrl: './menu-designer-list.component.html',
  styleUrls: ['./menu-designer-list.component.css']
})
export class MenuDesignerListComponent implements OnInit {
  public tableData: any;

  constructor(private menuDesignerService: MenuService) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.tableData = {
      headerRow: ['ID', 'Name', 'Version']
    };

    this.menuDesignerService.get().subscribe(data => {
      this.tableData.dataRows = data;
    });
  }

  delete(row: any) {
    this.menuDesignerService.delete(row['id']).subscribe(data => {
      this.refresh();
    });
  }

}
