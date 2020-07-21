import {Component, OnInit} from '@angular/core';
import {TableComponentService} from '../../../services/crud/table-component.service';
import {NavigatorService} from '../../../services/navigator.service';
import {PageComponent} from '../../page/page-component';

@Component({
  selector: 'app-component-designer-list',
  templateUrl: './component-designer-list.component.html',
  styleUrls: ['./component-designer-list.component.css']
})
export class ComponentDesignerListComponent extends PageComponent implements OnInit {
  public tableData: any;

  constructor(private service: TableComponentService,
              private navigatorService: NavigatorService) {
    super();
  }

  ngOnInit(): void {
    this.refresh();
  }

  onFocusIn() {
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

  clone(id: string) {
    let command = 'STATICPAGE[NAME:component-designer-form,TITLE:Form,TYPE:CLONE,LOCATE:(ID=' + id + '),PARENT-PAGEID:$PAGEID]';
    command = command.replace('$PAGEID', this.pageId);
    this.navigatorService.openLocation(command);
  }

  openPage(id: string) {
    let command = 'STATICPAGE[NAME:component-designer-form,TITLE:Form,LOCATE:(ID=' + id + '),PARENT-PAGEID:$PAGEID]';
    command = command.replace('$PAGEID', this.pageId);
    this.navigatorService.openLocation(command);
  }


  openNewPage() {
    let command = 'STATICPAGE[NAME:component-designer-form,TITLE:Form,PARENT-PAGEID:$PAGEID]';
    command = command.replace('$PAGEID', this.pageId);
    this.navigatorService.openLocation(command);
  }

}
