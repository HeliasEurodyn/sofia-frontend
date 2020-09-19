import {Component, OnInit} from '@angular/core';
import {ListDTO} from '../../../dtos/list/list-dto';
import {ListService} from '../../../services/crud/list.service';
import {PageComponent} from '../../page/page-component';
import {ListComponentDTO} from '../../../dtos/list/list-component-dto';
import {ListResultsData} from '../../../dtos/list/list-results-data';
import {NavigatorService} from '../../../services/navigator.service';
import {NotificationService} from '../../../services/notification.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent extends PageComponent implements OnInit {

  public listDto: ListDTO;
  public listComponentDto: ListComponentDTO;
  public listResultsData: ListResultsData;
  public groupContent: Array<Map<string, any>>;
  // public groupContentRetreived = false;
  private selectedGroupItem: any;


  constructor(private service: ListService,
              private navigatorService: NavigatorService,
              private notificationService: NotificationService) {
    super();
  }

  ngOnInit(): void {
    this.listDto = new ListDTO();

    if (this.getLocateParams().has('ID')) {
      const id = this.getLocateParams().get('ID');

      this.service.getDataById(id).subscribe(data => {
        this.listDto = data;
        this.listComponentDto = this.listDto.listComponentList[0];

        // for (const listComponentDto of this.listDto.listComponentList) {
        //   for (const listComponentFilterField of listComponentDto.listComponentFilterFieldList) {
        //     // listComponentFilterField.fieldValue = this.parseDefaultValue(listComponentFilterField.defaultValue);
        //   }
        // }

      });
    }
  }

  // parseDefaultValue(defaultValue: string) {
  //
  //   if (defaultValue == null) {
  //     return '';
  //   }
  //
  //   if (defaultValue === '') {
  //     return '';
  //   }
  //
  //   if (defaultValue.match(/^\$DATENOWPLUS\((-\d+|\d+)\)$/)) {
  //     const currentDate = new Date();
  //     const parameter = +defaultValue.replace(/^\$DATENOWPLUS\(/, '').replace(/\)$/, '');
  //     currentDate.setDate(currentDate.getDate() + parameter);
  //     return currentDate;
  //   }
  //   return defaultValue;
  // }

  getListResultData() {

    let requiredFiledsEmpty = false;
    for (const filterField of this.listComponentDto.listComponentFilterFieldList) {
      if ((filterField.fieldValue == null || filterField.fieldValue === '') && filterField.required ) {
        this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-id-card', '<b>Filters error</b> Required filter field ' + filterField.description + ' is empty!');
        requiredFiledsEmpty = true;
      }
    }

    if (requiredFiledsEmpty) {
      return;
    }

    this.service.getListResultData(this.listDto).subscribe(data => {
      this.listResultsData = data;
    });
    this.getGroupResultData();

  }

  getGroupResultData() {
    this.service.getGroupResultData(this.listDto).subscribe(data => {
      this.groupContent = data;
      this.initializeGroupContentVisibility(this.listResultsData.groupContent, false);
      this.initializeGroupContentParrents(this.listResultsData.groupContent);
    });
  }


  private initializeGroupContentParrents(groupContent: Array<Map<string, any>>) {
    if (groupContent == null) {
      return;
    }
    for (const groupContentEntry of groupContent) {
      if (groupContentEntry['children'] !== null) {
        for (const groupContentChildEntry of groupContentEntry['children']) {
          groupContentChildEntry['parrent'] = groupContentEntry;
        }
        this.initializeGroupContentParrents(groupContentEntry['children']);
      }
    }
  }

  private initializeGroupContentVisibility(groupContent: Array<Map<string, any>>, childrenVisible: Boolean) {

    if (groupContent == null) {
      return;
    }

    for (const groupContentEntry of groupContent) {
      groupContentEntry['childrenVisible'] = childrenVisible;

      if (groupContentEntry['children'] !== null) {


        this.initializeGroupContentVisibility(groupContentEntry['children'], childrenVisible);
      }
    }
  }

  listButtonClick(command) {
    command = command.replace('$PAGEID', this.pageId);
    this.navigatorService.openLocation(command);
  }

  updateVisibility(item) {
    if (item['childrenVisible']) {
      item['childrenVisible'] = false;
    } else {
      item['childrenVisible'] = true;
    }
  }


  filterGroup(item) {
    this.resetListComponentLeftGroupFieldList();
    if (item['code'] + '-' + item['value'] !== this.selectedGroupItem) {
      this.selectedGroupItem = item['code'] + '-' + item['value'];
      this.setValueToListComponentLeftGroupFieldList(item['code'], item['value']);
      if (item['parrent'] != null) {
        this.filterGroupParrent(item['parrent'])
      }
    }
    this.getListResultData();
  }

  filterGroupParrent(item) {
    this.setValueToListComponentLeftGroupFieldList(item['code'], item['value']);
    if (item['parrent'] != null) {
      this.filterGroupParrent(item['parrent'])
    }
  }

  private resetListComponentLeftGroupFieldList() {
    for (const leftGroupingField of this.listComponentDto.listComponentLeftGroupFieldList) {
      leftGroupingField.fieldValue = null;
    }
  }

  private setValueToListComponentLeftGroupFieldList(code: string, value: any) {
    for (const leftGroupingField of this.listComponentDto.listComponentLeftGroupFieldList) {
      if (leftGroupingField.code === code) {
        leftGroupingField.fieldValue = value;
      }
    }
  }


  isGroupContentDivVisible() {
    if (this.listComponentDto?.listComponentLeftGroupFieldList?.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  dataExcel() {
    this.service.getListResultDataExcel(this.listDto).subscribe(data => {
      const blob = new Blob([data], {type: 'application/xlsx'});
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'list-data.xlsx';
      link.click();
    });
  }
}
