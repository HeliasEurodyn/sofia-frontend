import {Component, ElementRef, OnInit} from '@angular/core';
import {ListDTO} from '../../../dtos/list/list-dto';
import {ListService} from '../../../services/crud/list.service';
import {PageComponent} from '../../page/page-component';
import {ListResultsData} from '../../../dtos/list/list-results-data';
import {CommandNavigatorService} from '../../../services/command-navigator.service';
import {NotificationService} from '../../../services/notification.service';
import {DatePipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent extends PageComponent implements OnInit {

  public listDto: ListDTO;
  public listResultsData: ListResultsData;
  public groupContent: Array<Map<string, any>>;

  private showPrevPagination = false;
  private showNextPagination = false;

  private listHeaderVisible: Boolean = false;
  private filterHeaderVisible: Boolean = false;

  private filterBodyVisible: Boolean = false;
  private listBodyVisible: Boolean = true;
  private defaultPage: String = 'filter';

  constructor(private service: ListService,
              private commandNavigatorService: CommandNavigatorService,
              private notificationService: NotificationService,
              public datepipe: DatePipe,
              private activatedRoute: ActivatedRoute,
              private elRef: ElementRef) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.setNavParams(params['nav']);
    });

    this.listDto = new ListDTO();

    if (this.getLocateParams().has('ID')) {
      const id = this.getLocateParams().get('ID');

      this.service.getDataById(id).subscribe(data => {
        this.listDto = data;

        this.listHeaderVisible = this.listDto.listVisible;
        this.filterHeaderVisible = this.listDto.filterVisible;
        this.defaultPage = this.listDto.defaultPage;

        if (this.defaultPage === 'filter') {
          this.listBodyVisible = false;
          this.filterBodyVisible = true;
        } else {
          this.listBodyVisible = true;
          this.filterBodyVisible = false;
        }

        if (this.listDto.autoRun) {
          this.getListResultData();
        }
      });
    }
  }

  getListResultData() {
    let requiredFiledsEmpty = false;
    for (const filterField of this.listDto.listComponentFilterFieldList) {
      if ((filterField.fieldValue == null || filterField.fieldValue === '') && filterField.required) {
        this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-id-card',
          '<b>Filters error</b> Required filter field ' + filterField.description + ' is empty!');
        requiredFiledsEmpty = true;
      }
    }

    if (requiredFiledsEmpty) {
      return;
    }

    const values = new Map();
    for (const filterField of this.listDto.listComponentFilterFieldList) {
      if (filterField.fieldValue != null && filterField.fieldValue !== '' && filterField.editable) {
        let fieldValue = '';
        if (filterField.type === 'datetime') {
          fieldValue = this.datepipe.transform(filterField.fieldValue, 'yyyyMMddHHmmss');
        } else {
          fieldValue = filterField.fieldValue;
        }
        values.set(filterField.code, fieldValue);
      }
    }

    for (const filterField of this.listDto.listComponentLeftGroupFieldList) {
      if (filterField.fieldValue != null && filterField.fieldValue !== '' && filterField.editable) {
        let fieldValue = '';
        if (filterField.type === 'datetime') {
          fieldValue = this.datepipe.transform(filterField.fieldValue, 'yyyyMMddHHmmss');
        } else {
          fieldValue = filterField.fieldValue;
        }
        values.set(filterField.code, fieldValue);
      }
    }

    for (const filterField of this.listDto.listComponentColumnFieldList) {
      if (filterField.fieldValue != null && filterField.fieldValue !== '' && filterField.editable) {
        let fieldValue = '';
        if (filterField.type === 'datetime') {
          fieldValue = this.datepipe.transform(filterField.fieldValue, 'yyyyMMddHHmmss');
        } else {
          fieldValue = filterField.fieldValue;
        }
        values.set(filterField.code, fieldValue);
      }
    }

    this.service.getListResultData(values, this.listDto.id).subscribe(data => {
      this.listResultsData = data;
      this.setPaginationSettings();
      this.getGroupResultData(values);
    });
  }

  setPaginationSettings() {
    if (!this.listDto.hasPagination) {
      return;
    }

    if (this.listResultsData.currentPage > 0) {
      this.showPrevPagination = true;
    } else {
      this.showPrevPagination = false;
    }

    if (this.listResultsData.currentPage + 1 < this.listResultsData.totalPages) {
      this.showNextPagination = true;
    } else {
      this.showNextPagination = false;
    }
  }

  getGroupResultData(parametersMap: Map<string, string>) {
    this.service.getGroupResultData(parametersMap, this.listDto.id).subscribe(data => {
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

  listButtonClick(row, command) {

    if (command.toUpperCase() === 'RETURN') {
      this.emitReturningValues(row);
    } else {
      command = command.replace('$PAGEID', this.pageId);
      this.commandNavigatorService.navigate(command);
    }

  }

  updateVisibility(item) {
    if (item['childrenVisible']) {
      item['childrenVisible'] = false;
    } else {
      item['childrenVisible'] = true;
    }
  }

  filterGroup(item) {
    this.setValueToListComponentLeftGroupFieldList(item['code'], item['value']);
    if (item['parrent'] != null) {
      this.filterGroupParrent(item['parrent'])
    }
    this.getListResultData();
  }

  filterGroupParrent(item) {
    this.setValueToListComponentLeftGroupFieldList(item['code'], item['value']);
    if (item['parrent'] != null) {
      this.filterGroupParrent(item['parrent'])
    }
  }

  private resetListComponentLeftGroupFieldList(code) {
    for (const leftGroupingField of this.listDto.listComponentLeftGroupFieldList) {
      if (code === leftGroupingField.code) {
        leftGroupingField.fieldValue = null;
      }
    }
    this.getListResultData();
  }

  private setValueToListComponentLeftGroupFieldList(code: string, value: any) {
    for (const leftGroupingField of this.listDto.listComponentLeftGroupFieldList) {
      if (leftGroupingField.code === code) {
        leftGroupingField.fieldValue = value;
      }
    }
  }

  isGroupContentDivVisible() {
    if (this.listDto?.listComponentLeftGroupFieldList?.length > 0) {
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

  columnFilterRefreshData(event: KeyboardEvent) {

    const currentElementId: string = (event.target as Element).id;

    if (event.ctrlKey && event.key === 'ArrowLeft') {
      let prevElementId = '';
      for (const column of this.listDto.listComponentColumnFieldList) {

        if (currentElementId === 'headerFilter-' + column.code &&
          prevElementId !== '') {
          document.getElementById(prevElementId).focus();
          return;
        }

        if (column.editable) {
          prevElementId = 'headerFilter-' + column.code;
        }
      }
    }

    if (event.ctrlKey && event.key === 'ArrowRight') {
      let currentElementIdFound = false;
      for (const column of this.listDto.listComponentColumnFieldList) {

        if (currentElementIdFound && column.editable) {
          document.getElementById('headerFilter-' + column.code).focus();
          return;
        }

        if (currentElementId === 'headerFilter-' + column.code) {
          currentElementIdFound = true;
        }
      }
    }

    if (event.ctrlKey && event.key === 'Enter') {
      if (this.listResultsData.listContent.length === 1) {
        const row = this.listResultsData.listContent[0];
        this.emitReturningValues(row);
      }

    }

    if (event.key === 'Enter') {
      this.getListResultData();
    }

  }

  emitReturningValues(row) {
    if (this.params.has('RETURN')) {

      const emitData: string[] = [];
      const returnCode = this.params.get('RETURN');
      if (returnCode in row) {
        emitData['RETURN'] = row[returnCode];
      }

      let returnDisplayString = '';
      const displayValues: Map<string, string> = this.getReturningDisplayValues();
      for (const [displayValueKey, displayValue] of displayValues) {
        if (displayValueKey in row) {
          returnDisplayString += ' ' + row[displayValueKey];
        }
      }

      emitData['RETURN-DISLPAY'] = returnDisplayString;
      this.selectEmmiter.emit(emitData);
    }
  }


  navigateToPage(page: number) {
    if (page < 0) {
      return;
    }

    if (page > (this.listResultsData.totalPages - 1)) {
      return;
    }

    this.listDto.currentPage = page;
    this.service.getListResultDataPost(this.listDto).subscribe(data => {
      this.listResultsData = data;
      this.setPaginationSettings();
    });
  }

  setFilterBodyVisible() {
    this.filterBodyVisible = true;
    this.listBodyVisible = false;
  }

  setListBodyVisible() {
    this.filterBodyVisible = false;
    this.listBodyVisible = true;
  }

  showPreviousPageButton() {
    if (this.previousPage === null) {
      return false;
    } else {
      return true;
    }
  }

  navigateToPreviousPage() {
    this.commandNavigatorService.navigateToPreviousPage(this.pageId);
  }
}
