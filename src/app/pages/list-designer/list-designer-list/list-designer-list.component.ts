import {Component, OnInit} from '@angular/core';
import {ListService} from 'app/services/crud/list.service';
import {NavigatorService} from '../../../services/navigator.service';
import {PageComponent} from '../../page/page-component';

@Component({
  selector: 'app-list-designer-list',
  templateUrl: './list-designer-list.component.html',
  styleUrls: ['./list-designer-list.component.css']
})
export class ListDesignerListComponent extends PageComponent implements OnInit {
  public tableData: any;

  constructor(private service: ListService,
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
    this.service.get().subscribe(data => {
      this.tableData = data;
    });
  }

  delete(row: any) {
    this.service.delete(row['id']).subscribe(data => {
      this.refresh();
    });
  }

  openPage(id: string) {
    let command = 'STATICPAGE[NAME:list-designer-form,TITLE:Form,LOCATE:(ID=' + id + '),PARENT-PAGEID:$PAGEID]';
    command = command.replace('$PAGEID', this.pageId);
    this.navigatorService.openLocation(command);
  }


  openNewPage() {
    let command = 'STATICPAGE[NAME:list-designer-form,TITLE:Form,PARENT-PAGEID:$PAGEID]';
    command = command.replace('$PAGEID', this.pageId);
    this.navigatorService.openLocation(command);
  }

  clone(id: string) {
    let command = 'STATICPAGE[NAME:list-designer-form,TITLE:Form,TYPE:CLONE,LOCATE:(ID=' + id + '),PARENT-PAGEID:$PAGEID]';
    command = command.replace('$PAGEID', this.pageId);
    this.navigatorService.openLocation(command);
  }

}
