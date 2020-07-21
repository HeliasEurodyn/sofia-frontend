import {Component, OnInit} from '@angular/core';
import {TableService} from '../../../services/crud/table.service';
import {PageComponent} from '../../page/page-component';
import {NavigatorService} from '../../../services/navigator.service';
import {NotificationService} from '../../../services/notification.service';

@Component({
  selector: 'app-table-designer-list',
  templateUrl: './table-designer-list.component.html',
  styleUrls: ['./table-designer-list.component.css']
})
export class TableDesignerListComponent extends PageComponent implements OnInit {
  public tableData: any;

  constructor(private service: TableService,
              private navigatorService: NavigatorService,
              private notificationService: NotificationService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.title = 'Table Designer List';
    this.refresh();
  }

  onFocusIn() {
    this.refresh();
  }

  showPreviousPageButton() {
    if (this.previousPage === null) {
      return false;
    } else {
      return true;
    }
  }

  navigateToPreviousPage() {
    this.navigatorService.navigateToPreviousPage(this.pageId);
  }

  navigateToNextPage() {
    this.navigatorService.navigateToNextPage(this.pageId);
  }

  showNextPageButton() {
    if (this.nextPage === null) {
      return false;
    } else {
      return true;
    }
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
    let command = 'STATICPAGE[NAME:table-designer-form,TITLE:Form,TYPE:CLONE,LOCATE:(ID=' + id + '),PARENT-PAGEID:$PAGEID]';
    command = command.replace('$PAGEID', this.pageId);
    this.navigatorService.openLocation(command);
  }

  openPage(id: string) {
    let command = 'STATICPAGE[NAME:table-designer-form,TITLE:Form,LOCATE:(ID=' + id + '),PARENT-PAGEID:$PAGEID]';
    command = command.replace('$PAGEID', this.pageId);
    this.navigatorService.openLocation(command);
  }

  openNewPage() {
    let command = 'STATICPAGE[NAME:table-designer-form,TITLE:Form,PARENT-PAGEID:$PAGEID]';
    command = command.replace('$PAGEID', this.pageId);
    this.navigatorService.openLocation(command);
  }

  showNotification() {
    this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-id-card', '<b>Error 500</b> Something Went Wrong');
  }
}
