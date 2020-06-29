import { Component, OnInit } from '@angular/core';
import {MenuService} from '../../../services/menu.service';
import {PageComponent} from '../../page/page-component';
import {NavigatorService} from '../../../services/navigator.service';

@Component({
  selector: 'app-menu-designer-list',
  templateUrl: './menu-designer-list.component.html',
  styleUrls: ['./menu-designer-list.component.css']
})
export class MenuDesignerListComponent extends PageComponent implements OnInit {
  public tableData: any;

  constructor(private menuDesignerService: MenuService,
              private navigatorService: NavigatorService) {
    super();
  }

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

  openPage(id: string) {
    let command = 'STATICPAGE[NAME:menu-designer-form,TITLE:Form,LOCATE:(ID=' + id + '),PARENT-PAGEID:$PAGEID]';
    command = command.replace('$PAGEID', this.pageId);
    this.navigatorService.openLocation(command);
  }


  openNewPage() {
    let command = 'STATICPAGE[NAME:table-designer-form,TITLE:Form,PARENT-PAGEID:$PAGEID]';
    command = command.replace('$PAGEID', this.pageId);
    this.navigatorService.openLocation(command);
  }

}
