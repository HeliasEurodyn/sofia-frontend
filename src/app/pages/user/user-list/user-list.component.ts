import { Component, OnInit } from '@angular/core';
import {TableService} from '../../../services/crud/table.service';
import {CommandNavigatorService} from '../../../services/command-navigator.service';
import {NotificationService} from '../../../services/notification.service';
import {PageComponent} from '../../page/page-component';
import {UserService} from '../../../services/crud/common/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent extends PageComponent implements OnInit {

  public userData: any;

  constructor(private service: UserService,
              private navigatorService: CommandNavigatorService,
              private notificationService: NotificationService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.setTitle('Table Designer List');
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
    this.userData = {
      headerRow: ['ID', 'Name', 'Created at']
    };

    this.service.get().subscribe(data => {
      this.userData.dataRows = data;
    });
  }

  delete(row: any) {
    this.service.delete(row['id']).subscribe(data => {
      this.refresh();
    });
  }


  clone(id: string) {
    let command = 'STATICPAGE[NAME:user-form,TITLE:User,TYPE:CLONE,LOCATE:(ID=' + id + '),PARENT-PAGEID:$PAGEID]';
    command = command.replace('$PAGEID', this.pageId);
    this.navigatorService.navigate(command);
  }

  openPage(id: string) {
    let command = 'STATICPAGE[NAME:user-form,TITLE:User,LOCATE:(ID=' + id + '),PARENT-PAGEID:$PAGEID]';
    command = command.replace('$PAGEID', this.pageId);
    this.navigatorService.navigate(command);
  }

  openNewPage() {
    let command = 'STATICPAGE[NAME:user-form,TITLE:User,PARENT-PAGEID:$PAGEID]';
    command = command.replace('$PAGEID', this.pageId);
    this.navigatorService.navigate(command);
  }

  showNotification() {
    this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-id-card', '<b>Error 500</b> Something Went Wrong');
  }

}
