import {Component, OnInit} from '@angular/core';
import {NavigatorService} from '../../../services/navigator.service';
import {PageComponent} from '../../page/page-component';
import {AppViewService} from '../../../services/crud/app-view.service';

@Component({
  selector: 'app-app-view-designer-list',
  templateUrl: './app-view-designer-list.component.html',
  styleUrls: ['./app-view-designer-list.component.css']
})
export class AppViewDesignerListComponent extends PageComponent implements OnInit {


  public tableData: any;

  constructor(private service: AppViewService,
              private navigatorService: NavigatorService) {
    super();
  }

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

  openPage(id: string) {
    let command = 'STATICPAGE[NAME:appview-designer-form,TITLE:Form,LOCATE:(ID=' + id + '),PARENT-PAGEID:$PAGEID]';
    command = command.replace('$PAGEID', this.pageId);
    this.navigatorService.openLocation(command);
  }

  openNewPage() {
    let command = 'STATICPAGE[NAME:appview-designer-form,TITLE:Form,PARENT-PAGEID:$PAGEID]';
    command = command.replace('$PAGEID', this.pageId);
    this.navigatorService.openLocation(command);
  }

}
